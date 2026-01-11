import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      phoneNumber: true,
      phoneVerified: true,
      whatsappOptIn: true,
      alertSettings: true,
    },
  })

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  return NextResponse.json({
    phoneNumber: user.phoneNumber,
    phoneVerified: user.phoneVerified,
    whatsappOptIn: user.whatsappOptIn,
    settings: user.alertSettings,
  })
}

type UpdateSettingsBody = {
  selectedState?: string
  whatsappEnabled?: boolean
  browserEnabled?: boolean
  threshold?: 'HIGH' | 'CRITICAL'
  cooldownMinutes?: number
  whatsappOptIn?: boolean
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = (await req.json().catch(() => ({}))) as UpdateSettingsBody

  const selectedState = (body.selectedState ?? '').toString().trim()
  const cooldownMinutes =
    typeof body.cooldownMinutes === 'number' && Number.isFinite(body.cooldownMinutes)
      ? Math.max(5, Math.min(24 * 60, Math.round(body.cooldownMinutes)))
      : undefined

  const threshold = body.threshold === 'CRITICAL' ? 'CRITICAL' : body.threshold === 'HIGH' ? 'HIGH' : undefined

  if (selectedState && selectedState.length > 80) {
    return NextResponse.json({ error: 'Invalid state.' }, { status: 400 })
  }

  if (typeof body.whatsappOptIn === 'boolean') {
    await prisma.user.update({
      where: { id: userId },
      data: {
        whatsappOptIn: body.whatsappOptIn,
        whatsappOptInAt: body.whatsappOptIn ? new Date() : null,
      },
    })
  }

  const existing = await prisma.userAlertSettings.findUnique({ where: { userId } })

  const updated = await prisma.userAlertSettings.upsert({
    where: { userId },
    create: {
      userId,
      selectedState: selectedState || existing?.selectedState || 'Uttar Pradesh',
      whatsappEnabled: typeof body.whatsappEnabled === 'boolean' ? body.whatsappEnabled : false,
      browserEnabled: typeof body.browserEnabled === 'boolean' ? body.browserEnabled : true,
      threshold: threshold ?? 'HIGH',
      cooldownMinutes: cooldownMinutes ?? 60,
    },
    update: {
      ...(selectedState ? { selectedState } : {}),
      ...(typeof body.whatsappEnabled === 'boolean' ? { whatsappEnabled: body.whatsappEnabled } : {}),
      ...(typeof body.browserEnabled === 'boolean' ? { browserEnabled: body.browserEnabled } : {}),
      ...(threshold ? { threshold } : {}),
      ...(typeof cooldownMinutes === 'number' ? { cooldownMinutes } : {}),
    },
  })

  return NextResponse.json({ ok: true, settings: updated })
}
