import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET() {
  const username = (process.env.TELEGRAM_BOT_USERNAME || '').trim()
  if (!username) {
    return NextResponse.json(
      { ok: false, error: 'Telegram bot is not configured.' },
      { status: 500 },
    )
  }

  const url = `https://t.me/${username}`
  return NextResponse.redirect(url, { status: 307 })
}
