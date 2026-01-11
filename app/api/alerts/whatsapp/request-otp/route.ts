import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateOtpCode, hashOtp } from '@/lib/otp'
import { normalizePhoneNumber, sendWhatsAppTemplateMessage } from '@/lib/whatsapp'

export const runtime = 'nodejs'

type RequestOtpBody = {
  phoneNumber?: string
}

function requireOtpSecret(): string {
  const s = process.env.OTP_SECRET
  if (!s) {
    throw new Error('Missing OTP_SECRET. Set OTP_SECRET in .env.local (server-side).')
  }
  return s
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = (await req.json().catch(() => ({}))) as RequestOtpBody
  const rawPhone = (body.phoneNumber ?? '').toString()
  const normalized = normalizePhoneNumber(rawPhone, process.env.DEFAULT_COUNTRY_CODE)

  if (!normalized) {
    return NextResponse.json(
      { error: 'Invalid phone number. Use E.164 format like +911234567890.' },
      { status: 400 },
    )
  }

  const otpTemplate = process.env.WHATSAPP_OTP_TEMPLATE_NAME
  if (!otpTemplate) {
    return NextResponse.json(
      { error: 'Missing WHATSAPP_OTP_TEMPLATE_NAME (approved WhatsApp template required).' },
      { status: 400 },
    )
  }

  const otpSecret = requireOtpSecret()
  const code = generateOtpCode(6)
  const codeHash = hashOtp(code, otpSecret)
  const ttlMinutes = 10
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000)

  // Keep only the most recent pending verification per user.
  await prisma.phoneVerification.deleteMany({ where: { userId } })

  await prisma.phoneVerification.create({
    data: {
      userId,
      phoneNumber: normalized,
      codeHash,
      expiresAt,
    },
  })

  try {
    // Template should have {{1}} = OTP code, {{2}} = expiry minutes (optional)
    await sendWhatsAppTemplateMessage({
      to: normalized,
      templateName: otpTemplate,
      bodyParameters: [code, String(ttlMinutes)],
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to send WhatsApp message.'
    return NextResponse.json(
      { error: 'Failed to send OTP via WhatsApp.', details: message },
      { status: 502 },
    )
  }

  return NextResponse.json({ ok: true, to: normalized, expiresInMinutes: ttlMinutes })
}
