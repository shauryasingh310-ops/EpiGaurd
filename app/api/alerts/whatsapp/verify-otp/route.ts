import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hashOtp, safeEqual } from '@/lib/otp'

export const runtime = 'nodejs'

type VerifyOtpBody = {
  code?: string
}

function requireOtpSecret(): string {
  const s = process.env.OTP_SECRET ?? (process.env as Record<string, string | undefined>)['OTP_SECRET ']
  if (!s) {
    throw new Error(
      'Missing OTP_SECRET. Set OTP_SECRET in .env.local (server-side). ' +
        'If you wrote `OTP_SECRET = ...` with a space before `=`, remove the space and restart the dev server.',
    )
  }
  return s
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = (await req.json().catch(() => ({}))) as VerifyOtpBody
  const code = (body.code ?? '').toString().trim()

  if (!/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: 'Invalid code.' }, { status: 400 })
  }

  const record = await prisma.phoneVerification.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  if (!record) {
    return NextResponse.json({ error: 'No pending verification found.' }, { status: 404 })
  }

  if (record.expiresAt.getTime() < Date.now()) {
    await prisma.phoneVerification.delete({ where: { id: record.id } })
    return NextResponse.json({ error: 'Code expired. Request a new one.' }, { status: 400 })
  }

  if (record.attempts >= 5) {
    await prisma.phoneVerification.delete({ where: { id: record.id } })
    return NextResponse.json({ error: 'Too many attempts. Request a new code.' }, { status: 400 })
  }

  const otpSecret = requireOtpSecret()
  const expected = record.codeHash
  const actual = hashOtp(code, otpSecret)

  const ok = safeEqual(expected, actual)

  if (!ok) {
    await prisma.phoneVerification.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    })
    return NextResponse.json({ error: 'Incorrect code.' }, { status: 400 })
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        phoneNumber: record.phoneNumber,
        phoneVerified: true,
        whatsappOptIn: true,
        whatsappOptInAt: new Date(),
      },
    }),
    prisma.phoneVerification.delete({ where: { id: record.id } }),
  ])

  return NextResponse.json({ ok: true, phoneNumber: record.phoneNumber })
}
