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
  const token = requireEnv('WHATSAPP_TOKEN')
  const phoneNumberId = requireEnv('WHATSAPP_PHONE_NUMBER_ID')

  const languageCode = args.languageCode || process.env.WHATSAPP_TEMPLATE_LANGUAGE || 'en_US'

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
