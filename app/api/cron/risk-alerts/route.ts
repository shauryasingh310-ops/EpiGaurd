import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { splitBullets } from '@/lib/otp'
import { sendWhatsAppTemplateMessage } from '@/lib/whatsapp'

export const runtime = 'nodejs'

type DiseaseDataApiResponse = {
  updatedAt: string
  states: Array<{
    state: string
    riskScore: number
    riskLevel?: 'Low' | 'Medium' | 'High' | 'Critical'
    overallRisk?: 'Low' | 'Medium' | 'High' | 'Critical'
    primaryThreat?: string
  }>
}

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(1, value))
}

function meetsThreshold(level: string | null | undefined, threshold: 'HIGH' | 'CRITICAL'): boolean {
  if (threshold === 'CRITICAL') return level === 'Critical'
  return level === 'High' || level === 'Critical'
}

function getBaseUrl(): string {
  const explicit = process.env.APP_BASE_URL
  if (explicit) return explicit.replace(/\/$/, '')
  const vercel = process.env.VERCEL_URL
  if (vercel) return `https://${vercel}`
  return ''
}

async function fetchDiseaseData(baseUrl: string): Promise<DiseaseDataApiResponse | null> {
  try {
    const resp = await fetch(`${baseUrl}/api/disease-data`, { cache: 'no-store' })
    if (!resp.ok) return null
    return (await resp.json()) as DiseaseDataApiResponse
  } catch {
    return null
  }
}

async function fetchAiActions(baseUrl: string, state: string, primaryThreat: string, risk: number): Promise<string[]> {
  try {
    const resp = await fetch(`${baseUrl}/api/predictions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        region: state,
        disease: primaryThreat,
        risk,
        trend: 'stable',
      }),
    })

    if (!resp.ok) return []
    const payload = (await resp.json().catch(() => null)) as any
    const analysis = typeof payload?.analysis === 'string' ? payload.analysis : ''
    return splitBullets(analysis, 3)
  } catch {
    return []
  }
}

function requireCronAuth(req: Request): boolean {
  const expected = process.env.CRON_SECRET
  if (!expected) {
    // Dev friendliness: allow when secret not set.
    return process.env.NODE_ENV !== 'production'
  }

  const header = req.headers.get('x-cron-secret')
  if (header && header === expected) return true

  const auth = req.headers.get('authorization')
  if (auth && auth.startsWith('Bearer ')) {
    const token = auth.slice('Bearer '.length)
    if (token === expected) return true
  }

  return false
}

export async function GET(req: Request) {
  if (!requireCronAuth(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const baseUrl = getBaseUrl()
  if (!baseUrl) {
    return NextResponse.json(
      { error: 'Missing APP_BASE_URL (or VERCEL_URL) for cron execution.' },
      { status: 500 },
    )
  }

  const alertTemplate = process.env.WHATSAPP_ALERT_TEMPLATE_NAME
  if (!alertTemplate) {
    return NextResponse.json(
      { error: 'Missing WHATSAPP_ALERT_TEMPLATE_NAME (approved WhatsApp template required).' },
      { status: 500 },
    )
  }

  const disease = await fetchDiseaseData(baseUrl)
  if (!disease) {
    return NextResponse.json(
      { error: 'Failed to fetch /api/disease-data. Check API keys / uptime.' },
      { status: 502 },
    )
  }

  const settings = await prisma.userAlertSettings.findMany({
    where: { whatsappEnabled: true },
    include: {
      user: {
        select: {
          phoneNumber: true,
          phoneVerified: true,
          whatsappOptIn: true,
        },
      },
    },
  })

  const byState = new Map<string, DiseaseDataApiResponse['states'][number]>()
  for (const s of disease.states ?? []) {
    byState.set(s.state, s)
  }

  let sent = 0
  let skipped = 0
  const now = Date.now()

  for (const row of settings) {
    const phone = row.user.phoneNumber
    if (!phone || !row.user.phoneVerified || !row.user.whatsappOptIn) {
      skipped++
      continue
    }

    const state = row.selectedState
    const snapshot = byState.get(state)
    if (!snapshot) {
      skipped++
      continue
    }

    const level = snapshot.overallRisk ?? snapshot.riskLevel ?? 'Low'
    const risk = clamp01(snapshot.riskScore)
    const threshold = row.threshold

    if (!meetsThreshold(level, threshold)) {
      skipped++
      continue
    }

    const last = row.lastAlertSentAt?.getTime() ?? 0
    const cooldownMs = (row.cooldownMinutes ?? 60) * 60 * 1000
    if (last && now - last < cooldownMs) {
      skipped++
      continue
    }

    const riskPct = String(Math.round(risk * 100))
    const primaryThreat = (snapshot.primaryThreat ?? 'Unknown').toString()

    const actions = await fetchAiActions(baseUrl, state, primaryThreat, risk)
    const safeActions = actions.length
      ? actions
      : [
          'Avoid unsafe water and use boiled/filtered water.',
          'Increase hand hygiene and sanitation precautions.',
          'Seek medical advice early if symptoms appear.',
        ]

    const link = `${baseUrl}/dashboard?state=${encodeURIComponent(state)}`

    // Template variables expected (recommended):
    // 1 risk level, 2 state, 3 risk percent, 4 primary threat, 5 action1, 6 action2, 7 action3, 8 link
    await sendWhatsAppTemplateMessage({
      to: phone,
      templateName: alertTemplate,
      bodyParameters: [
        level,
        state,
        riskPct,
        primaryThreat,
        safeActions[0] ?? '',
        safeActions[1] ?? '',
        safeActions[2] ?? '',
        link,
      ],
    })

    await prisma.userAlertSettings.update({
      where: { id: row.id },
      data: { lastAlertSentAt: new Date() },
    })

    sent++
  }

  return NextResponse.json({ ok: true, sent, skipped, updatedAt: disease.updatedAt })
}
