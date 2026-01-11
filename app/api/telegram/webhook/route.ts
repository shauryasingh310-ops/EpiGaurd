import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { extractStartCode, type TelegramWebhookUpdate } from '@/lib/telegram'

export const runtime = 'nodejs'

function isAuthorized(req: Request): boolean {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET
  if (!expected) {
    // Dev friendliness if you haven't configured the secret yet.
    return process.env.NODE_ENV !== 'production'
  }

  const got = req.headers.get('x-telegram-bot-api-secret-token')
  return got === expected
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const update = (await req.json().catch(() => null)) as TelegramWebhookUpdate | null
  if (!update) return NextResponse.json({ ok: true })

  const parsed = extractStartCode(update)
  if (!parsed) return NextResponse.json({ ok: true })

  const { chatId, username, code } = parsed

  // We only link on /start <code>
  if (!code) {
    return NextResponse.json({ ok: true })
  }

  const record = await prisma.telegramLinkCode.findUnique({ where: { code } })
  if (!record) {
    return NextResponse.json({ ok: true })
  }

  if (record.expiresAt.getTime() < Date.now()) {
    await prisma.telegramLinkCode.delete({ where: { id: record.id } }).catch(() => {})
    return NextResponse.json({ ok: true })
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: {
        telegramChatId: chatId,
        telegramUsername: username ?? null,
        telegramOptIn: true,
        telegramOptInAt: new Date(),
      },
    }),
    prisma.telegramLinkCode.delete({ where: { id: record.id } }),
  ])

  return NextResponse.json({ ok: true })
}

export async function GET() {
  // Simple health check
  return NextResponse.json({ ok: true })
}
