import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

type RegisterBody = {
  name?: string
  email?: string
  password?: string
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as RegisterBody

  const name = (body.name ?? '').toString().trim()
  const email = (body.email ?? '').toString().trim().toLowerCase()
  const password = (body.password ?? '').toString()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters.' },
      { status: 400 },
    )
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { error: 'An account with that email already exists.' },
        { status: 409 },
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ ok: true, user })
  } catch (err) {
    // Avoid leaking internals; provide more detail in dev.
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      {
        error: 'Registration failed.',
        ...(process.env.NODE_ENV !== 'production' ? { details: message } : {}),
      },
      { status: 500 },
    )
  }
}
