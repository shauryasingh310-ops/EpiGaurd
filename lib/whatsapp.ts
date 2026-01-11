type WhatsAppTextParameter = {
  type: 'text'
  text: string
}

type WhatsAppComponent = {
  type: 'body'
  parameters: WhatsAppTextParameter[]
}

type WhatsAppTemplateMessage = {
  messaging_product: 'whatsapp'
  to: string
  type: 'template'
  template: {
    name: string
    language: { code: string }
    components: WhatsAppComponent[]
  }
}

type SendTemplateArgs = {
  to: string
  templateName: string
  languageCode?: string
  bodyParameters: string[]
}

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing ${name}. Set it in .env.local (server-side).`)
  }
  return value
}

function isDryRun(): boolean {
  return process.env.WHATSAPP_DRY_RUN === 'true'
}

function normalizeTemplateLanguage(value: string | undefined): string {
  const raw = (value ?? '').trim()
  if (!raw) return 'en_US'
  // Some users mistakenly set multiple values like "en_US,hi".
  // WhatsApp expects a single language code, so pick the first.
  const first = raw.split(',')[0]?.trim()
  return first || 'en_US'
}

export function normalizePhoneNumber(input: string, defaultCountryCode?: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ''

  // Keep leading +; strip non-digits elsewhere.
  const hasPlus = trimmed.startsWith('+')
  const digits = trimmed.replace(/[^0-9]/g, '')
  if (!digits) return ''

  if (hasPlus) {
    return `+${digits}`
  }

  // If user enters 10-digit number (common in India), prefix default CC (ex: +91)
  if (digits.length === 10 && defaultCountryCode && /^\+\d+$/.test(defaultCountryCode)) {
    return `${defaultCountryCode}${digits}`
  }

  // Otherwise, assume they provided country code without '+'
  if (digits.length >= 11 && digits.length <= 15) {
    return `+${digits}`
  }

  return ''
}

export async function sendWhatsAppTemplateMessage(args: SendTemplateArgs): Promise<void> {
  const dryRun = isDryRun()
  const token = dryRun ? (process.env.WHATSAPP_TOKEN || '') : requireEnv('WHATSAPP_TOKEN')
  const phoneNumberId = dryRun
    ? (process.env.WHATSAPP_PHONE_NUMBER_ID || '')
    : requireEnv('WHATSAPP_PHONE_NUMBER_ID')

  const languageCode = args.languageCode || normalizeTemplateLanguage(process.env.WHATSAPP_TEMPLATE_LANGUAGE)

  const payload: WhatsAppTemplateMessage = {
    messaging_product: 'whatsapp',
    to: args.to,
    type: 'template',
    template: {
      name: args.templateName,
      language: { code: languageCode },
      components: [
        {
          type: 'body',
          parameters: args.bodyParameters.map((text) => ({ type: 'text', text })),
        },
      ],
    },
  }

  if (dryRun) {
    // Helps verify that auth flows + DB writes work even before templates are approved.
    console.log('[whatsapp] DRY_RUN enabled; not sending message', {
      to: args.to,
      templateName: args.templateName,
      languageCode,
      bodyParametersCount: args.bodyParameters.length,
    })
    return
  }

  const url = `https://graph.facebook.com/v20.0/${encodeURIComponent(phoneNumberId)}/messages`

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (resp.ok) return

  const text = await resp.text().catch(() => '')
  throw new Error(`WhatsApp API failed (${resp.status}): ${text.slice(0, 1000)}`)
}
