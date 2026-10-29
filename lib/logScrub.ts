// SEC-R1-002 / FIX-DSE-APP-002 — shared scrub helpers for production logs + Sentry.
// Defence-in-depth: Vercel/Sentry are private to operators, but vendor error strings
// and request metadata can still carry emails, tokens, cookies, or push endpoints.

const EMAIL =
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi
/** JWT-shaped or long opaque bearer tokens. */
const BEARER = /\bBearer\s+[A-Za-z0-9\-._~+/]+=*/gi
const JWT = /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g
/** Web Push endpoints are device identifiers — never log raw. */
const PUSH_ENDPOINT =
  /https?:\/\/(?:fcm\.googleapis\.com|updates\.push\.services\.mozilla\.com|[^/\s]+\/wp(?:-)?(?:push|wns)|[^/\s]*push[^/\s]*)[^\s"'\\]*/gi
const COOKIE_PAIR = /(?:^|;\s*)([^=;\s]+)=([^;]*)/g
const AUTH_HEADER_LINE = /^(authorization|cookie|set-cookie)$/i
const PG_URL = /\bpostgres(?:ql)?:\/\/[^\s"'\\]+/gi
const HEX_SECRET = /\b[a-f0-9]{32,}\b/gi
const BASE64ISH = /\b(?:[A-Za-z0-9_-]{24,}=*)\b/g

const REDACT = '[redacted]'

/** Scrub a free-form error / log message for production sinks. */
export function scrubLogText(input: unknown): string {
  if (input == null) return 'error'
  let text = typeof input === 'string' ? input : String((input as { message?: unknown })?.message ?? input)
  if (!text) return 'error'
  text = text
    .replace(BEARER, `Bearer ${REDACT}`)
    .replace(JWT, REDACT)
    .replace(EMAIL, REDACT)
    .replace(PUSH_ENDPOINT, REDACT)
    .replace(PG_URL, REDACT)
    // Long hex after emails/tokens — keep short codes (e.g. 42P01) intact.
    .replace(HEX_SECRET, (m) => (m.length >= 32 ? REDACT : m))
  // Avoid over-redacting short stable codes: only scrub base64ish blobs ≥ 40 chars.
  text = text.replace(BASE64ISH, (m) => (m.length >= 40 ? REDACT : m))
  return text
}

export function scrubHeaderValue(name: string, value: string): string {
  if (AUTH_HEADER_LINE.test(name)) {
    if (/^cookie$/i.test(name) || /^set-cookie$/i.test(name)) {
      return value.replace(COOKIE_PAIR, (_m, k) => `${k}=${REDACT}`)
    }
    return REDACT
  }
  return scrubLogText(value)
}

/** Structural fields we scrub — kept loose so Sentry ErrorEvent (tags: Primitive, etc.) assigns. */
type SentryScrubFields = {
  message?: string
  request?: {
    url?: string
    headers?: Record<string, string>
    cookies?: unknown
    data?: unknown
  }
  exception?: {
    values?: Array<{ value?: string; type?: string }>
  }
  extra?: Record<string, unknown>
}

/**
 * Mutates a Sentry event in place; always returns the same reference (never drops).
 * Generic `T extends object` so beforeSend can keep ErrorEvent in / ErrorEvent out.
 */
export function scrubSentryEvent<T extends object>(event: T): T {
  const e = event as T & SentryScrubFields
  if (e.message) e.message = scrubLogText(e.message)

  if (e.exception?.values) {
    for (const v of e.exception.values) {
      if (v.value) v.value = scrubLogText(v.value)
    }
  }

  const req = e.request
  if (req) {
    if (req.url) req.url = scrubLogText(req.url)
    if (req.headers) {
      const next: Record<string, string> = {}
      for (const [k, v] of Object.entries(req.headers)) {
        next[k] = scrubHeaderValue(k, String(v))
      }
      req.headers = next
    }
    if (req.cookies != null) {
      req.cookies = REDACT
    }
    if (typeof req.data === 'string') {
      req.data = scrubLogText(req.data)
    } else if (req.data && typeof req.data === 'object') {
      req.data = scrubDataObject(req.data as Record<string, unknown>)
    }
  }

  if (e.extra) {
    for (const [k, v] of Object.entries(e.extra)) {
      if (typeof v === 'string') e.extra[k] = scrubLogText(v)
    }
  }

  return event
}

const SENSITIVE_KEYS = /^(authorization|cookie|set-cookie|password|token|secret|auth|p256dh|endpoint)$/i

function scrubDataObject(data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(data)) {
    if (SENSITIVE_KEYS.test(k)) {
      out[k] = REDACT
    } else if (typeof v === 'string') {
      out[k] = scrubLogText(v)
    } else {
      out[k] = v
    }
  }
  return out
}

/** Extract a production-safe message + optional vendor code from unknown errors. */
export function safeErrorFields(err: unknown): { message: string; code?: string } {
  if (err == null) return { message: 'error' }
  if (typeof err === 'string') return { message: scrubLogText(err) }
  const e = err as { message?: unknown; code?: unknown }
  const code = typeof e.code === 'string' && e.code.length <= 32 ? e.code : undefined
  return { message: scrubLogText(e.message ?? 'error'), code }
}
