import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { STATE_COORDINATES } from '@/lib/state-coordinates'

export const runtime = 'nodejs'

function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.min(1, value))
}

function normalizePlaceName(value: string | null | undefined): string {
  return (value ?? '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '')
    .trim()
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180
}

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371
  const dLat = degToRad(b.lat - a.lat)
  const dLng = degToRad(b.lng - a.lng)
  const lat1 = degToRad(a.lat)
  const lat2 = degToRad(b.lat)

  const sinLat = Math.sin(dLat / 2)
  const sinLng = Math.sin(dLng / 2)

  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}

function findNearestState(lat: number, lng: number): string | null {
  let bestState: string | null = null
  let bestDist = Number.POSITIVE_INFINITY

  for (const [state, coords] of Object.entries(STATE_COORDINATES)) {
    const d = haversineKm({ lat, lng }, { lat: coords.lat, lng: coords.lng })
    if (d < bestDist) {
      bestDist = d
      bestState = state
    }
  }

  return bestState
}

type DiseaseDataApiResponse = {
  updatedAt: string
  states: Array<{
    state: string
    riskScore: number
    overallRisk?: 'Low' | 'Medium' | 'High' | 'Critical'
    riskLevel?: 'Low' | 'Medium' | 'High' | 'Critical'
    primaryThreat?: string
    environmentalFactors?: {
      temp: number
      humidity: number
      rain: boolean
      pm25: number
      aqiUS?: number | null
      waterQuality: 'Good' | 'Fair' | 'Poor' | 'Unknown'
    }
  }>
}

async function fetchDiseaseData(): Promise<DiseaseDataApiResponse | null> {
  try {
    const h = await headers()
    const host = h.get('host')
    if (!host) return null
    const proto = h.get('x-forwarded-proto') ?? 'http'
    const url = `${proto}://${host}/api/disease-data`
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return null
    return (await res.json()) as DiseaseDataApiResponse
  } catch {
    return null
  }
}

function buildPreventions(input: { risk: number; level: string; primaryThreat: string }): string[] {
  const risk = clamp01(input.risk)
  const level = input.level
  const threat = (input.primaryThreat || 'Unknown').toLowerCase()

  const intensity = risk > 0.7 || level === 'High' || level === 'Critical'

  if (threat.includes('water')) {
    return [
      'Drink only boiled/filtered water; avoid untreated water sources.',
      'Wash hands with soap regularly, especially before eating and after toilet use.',
      'Avoid raw/unsafe street food; eat freshly cooked hot meals.',
      intensity ? 'Keep ORS ready and seek medical care quickly for diarrhea/dehydration symptoms.' : 'Keep ORS available and monitor symptoms early.',
      'Ensure safe sanitation and disinfect high-touch surfaces at home.',
    ]
  }

  if (threat.includes('resp')) {
    return [
      'Improve ventilation indoors; avoid crowded poorly ventilated places.',
      'Wear a mask in crowded indoor areas if you have symptoms or risk is elevated.',
      'Practice hand hygiene and avoid touching face after public contact.',
      intensity ? 'If fever/breathing issues occur, seek medical care promptly and isolate.' : 'If fever/cough persists, seek medical advice and rest.',
      'Keep children and seniors up to date with recommended vaccines where available.',
    ]
  }

  // Default to vector-borne style guidance.
  return [
    'Use mosquito repellent and wear long sleeves in the evening/night.',
    'Remove standing water (coolers, pots, buckets) to reduce mosquito breeding.',
    'Use bed nets/screens; keep doors/windows closed when possible.',
    intensity ? 'Seek medical care quickly for high fever, rash, or severe body aches.' : 'Monitor symptoms and get tested early if fever develops.',
    'Maintain clean surroundings and coordinate community vector control where possible.',
  ]
}

type Body = { lat?: number; lng?: number }

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Body

  const lat = typeof body.lat === 'number' ? body.lat : Number.NaN
  const lng = typeof body.lng === 'number' ? body.lng : Number.NaN

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ ok: false, error: 'Missing lat/lng.' }, { status: 400 })
  }

  const state = findNearestState(lat, lng)
  if (!state) {
    return NextResponse.json({ ok: false, error: 'Unable to detect state.' }, { status: 404 })
  }

  const diseaseData = await fetchDiseaseData()
  const normalizedState = normalizePlaceName(state)
  const match = diseaseData?.states?.find((s) => normalizePlaceName(s.state) === normalizedState)

  const riskScore = clamp01(typeof match?.riskScore === 'number' ? match.riskScore : 0.25)
  const level = match?.overallRisk ?? match?.riskLevel ?? (riskScore > 0.9 ? 'Critical' : riskScore > 0.7 ? 'High' : riskScore > 0.5 ? 'Medium' : 'Low')
  const primaryThreat = match?.primaryThreat ?? 'Unknown'

  const telegramBotUsername = (process.env.TELEGRAM_BOT_USERNAME || '').trim() || null
  const telegramBotUrl = telegramBotUsername ? `https://t.me/${telegramBotUsername}` : null

  return NextResponse.json({
    ok: true,
    detectedAt: new Date().toISOString(),
    state,
    riskScore,
    overallRisk: level,
    primaryThreat,
    environmentalFactors: match?.environmentalFactors ?? null,
    preventions: buildPreventions({ risk: riskScore, level, primaryThreat }),
    telegram: {
      botUsername: telegramBotUsername,
      botUrl: telegramBotUrl,
    },
  })
}

export async function GET() {
  return NextResponse.json({ ok: true, hint: 'POST { lat, lng } to detect state risk.' })
}
