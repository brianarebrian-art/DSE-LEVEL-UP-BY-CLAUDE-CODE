import 'server-only'
import { getServiceSupabase } from '@/utils/supabase/server'
import { safeLog } from '@/lib/safeLog'

export type AuthEmailKind = 'magic_link' | 'reset_password' | 'verify_email'

/**
 * Deliver auth emails without a mandatory paid ESP.
 *
 * Order:
 * 1. Always enqueue `auth_email_outbox` (server-only table) for audit / manual send.
 * 2. If `AUTH_EMAIL_WEBHOOK_URL` is set, POST a minimal payload (no password).
 * 3. In non-production, also log a scrubbed notice (never the full URL in prod logs).
 *
 * Founders can wire the webhook to any free SMTP relay or personal mailer later.
 */
export async function sendAuthEmail(opts: {
  kind: AuthEmailKind
  to: string
  subject: string
  url: string
}): Promise<void> {
  const to = opts.to.trim().toLowerCase()
  if (!to || !opts.url) return

  const bodyText =
    opts.kind === 'magic_link'
      ? `Sign in to DSE Level Up:\n${opts.url}\n\nIf you did not request this, ignore this email.\n\n登入 DSE Level Up：\n${opts.url}\n\n如果你冇要求呢封電郵，可以忽略。`
      : opts.kind === 'reset_password'
        ? `Reset your DSE Level Up password:\n${opts.url}\n\nIf you did not request this, ignore this email.\n\n重設密碼：\n${opts.url}\n\n如果你冇要求，可以忽略。`
        : `Verify your DSE Level Up email:\n${opts.url}\n\nIf you did not create an account, ignore this email.\n\n驗證電郵：\n${opts.url}\n\n如果你冇註冊，可以忽略。`

  try {
    const sb = getServiceSupabase()
    await sb.from('auth_email_outbox').insert({
      kind: opts.kind,
      to_email: to,
      subject: opts.subject.slice(0, 200),
      body_text: bodyText.slice(0, 8000),
    })
  } catch (e) {
    safeLog('error', 'sendAuthEmail:outbox', e)
  }

  const webhook = process.env.AUTH_EMAIL_WEBHOOK_URL?.trim()
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          kind: opts.kind,
          to,
          subject: opts.subject,
          // URL is one-time; webhook handler must treat as secret.
          url: opts.url,
        }),
      })
      if (!res.ok) safeLog('error', 'sendAuthEmail:webhook_status', { status: res.status })
    } catch (e) {
      safeLog('error', 'sendAuthEmail:webhook', e)
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    safeLog('info', `sendAuthEmail:${opts.kind}`, { toDomain: to.split('@')[1] ?? '?' })
  }
}
