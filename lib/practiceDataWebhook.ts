// Optional $0 wake for a Grok Bot webhook routine.
//
// Live MC practice is stored by app/api/practice-count (service-role
// bump_practice_count into practice_counts). Guests and signed-in students
// both send one `completed` event per finished set (app/practice/PracticeSession.tsx).
// practice_attempts and learning_progress are not that write path.
//
// This module only decides whether to POST a non-identifying wake, and sends
// it. It does not read or write student rows. If the URL or sender key is
// unset, invalid, or not https, every function that would send becomes a no-op.
//
// Debounce: at most one POST per Asia/Hong_Kong calendar day, and only when
// the completed-session total for that day was 0 before this bump. Baseline
// 2026-10-08..2026-10-31 (docs/baseline-2026-10-31.md) had 186 completed
// sessions across 22 active days (about 8 a day) and 1851 answered questions.
// One POST per completion, or per question, would wake the routine many times
// on a busy day. A day with no completed session does not POST.
// Two completions that both observe a zero total can both POST. A failed POST
// is not retried later that same day. Started-only days do not wake.

export const PRACTICE_DATA_WEBHOOK_URL_ENV = 'PRACTICE_DATA_WEBHOOK_URL'
export const PRACTICE_DATA_WEBHOOK_KEY_ENV = 'PRACTICE_DATA_WEBHOOK_KEY'

/** One attempt. The practice response must not wait on a slow receiver. */
export const WAKE_TIMEOUT_MS = 5_000

export const PRACTICE_WAKE_TIMEZONE = 'Asia/Hong_Kong' as const

export interface PracticeWebhookConfig {
  url: string
  key: string
}

export interface PracticeWakeBody {
  event: 'practice_data_available'
  source: 'practice_counts'
  signal: 'completed_session'
  day: string
  timezone: typeof PRACTICE_WAKE_TIMEZONE
}

export const PRACTICE_WAKE_BODY_KEYS = [
  'event',
  'source',
  'signal',
  'day',
  'timezone',
] as const

type Env = Record<string, string | undefined>

/**
 * Sender key from the routine panel. Accepts the key itself, `Bearer <key>`,
 * or the panel's full `Authorization: Bearer <key>` line. The stored value
 * is the key only.
 */
export function normalizeSenderKey(raw: string): string | null {
  let key = raw.trim()
  const asHeader = /^authorization:\s*(.+)$/i.exec(key)
  if (asHeader) key = asHeader[1].trim()
  const asBearer = /^bearer\s+(\S+)$/i.exec(key)
  if (asBearer) key = asBearer[1].trim()
  if (!key || /\s/.test(key)) return null
  return key
}

/** Both env vars must be set. The URL must be https with no userinfo. */
export function readPracticeWebhookConfig(env: Env = process.env): PracticeWebhookConfig | null {
  const url = env[PRACTICE_DATA_WEBHOOK_URL_ENV]?.trim() ?? ''
  const key = normalizeSenderKey(env[PRACTICE_DATA_WEBHOOK_KEY_ENV] ?? '')
  if (!url || !key) return null
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }
  if (parsed.protocol !== 'https:') return null
  if (parsed.username || parsed.password) return null
  // POST the parsed URL, so a host pasted in the wrong case still reaches that host.
  return { url: parsed.href, key }
}

export function hongKongCalendarDay(now: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: PRACTICE_WAKE_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? ''
  const day = `${get('year')}-${get('month')}-${get('day')}`
  return /^\d{4}-\d{2}-\d{2}$/.test(day) ? day : ''
}

/** Sum of practice_counts.sessions. Null means the read cannot be trusted. */
export function sumCompletedSessions(
  rows: ReadonlyArray<{ sessions?: unknown }> | null,
): number | null {
  if (!rows) return null
  let sum = 0
  for (const row of rows) {
    const n = sessionTotal(row.sessions)
    if (n === null) return null
    sum += n
  }
  return sum
}

function sessionTotal(value: unknown): number | null {
  if (typeof value === 'number') {
    if (!Number.isSafeInteger(value) || value < 0) return null
    return value
  }
  if (typeof value === 'string' && /^(0|[1-9][0-9]*)$/.test(value)) {
    const n = Number(value)
    if (!Number.isSafeInteger(n)) return null
    return n
  }
  return null
}

/**
 * priorCompletedSessions is the completed-session total for that Hong Kong
 * day before this bump. Null (read failed) does not wake.
 */
export function shouldWakePracticeData(input: {
  event: 'started' | 'completed'
  priorCompletedSessions: number | null
}): boolean {
  return input.event === 'completed' && input.priorCompletedSessions === 0
}

export function buildPracticeWakeBody(day: string): PracticeWakeBody {
  return {
    event: 'practice_data_available',
    source: 'practice_counts',
    signal: 'completed_session',
    day,
    timezone: PRACTICE_WAKE_TIMEZONE,
  }
}

export type WakePost = (url: string, init: RequestInit) => Promise<Response>

export interface WakePostResult {
  ok: boolean
  status?: number
}

export async function postPracticeDataWake(
  config: PracticeWebhookConfig,
  body: PracticeWakeBody,
  post: WakePost = (url, init) => fetch(url, init),
  timeoutMs = WAKE_TIMEOUT_MS,
): Promise<WakePostResult> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await post(config.url, {
      method: 'POST',
      redirect: 'error',
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.key}`,
      },
      body: JSON.stringify(body),
    })
    await res.body?.cancel().catch(() => {})
    return { ok: res.ok, status: res.status }
  } catch {
    return { ok: false }
  } finally {
    clearTimeout(timer)
  }
}

export async function wakeIfFirstCompletionToday(args: {
  event: 'started' | 'completed'
  priorCompletedSessions: number | null
  day: string
  config: PracticeWebhookConfig | null
  post?: WakePost
}): Promise<'disabled' | 'not_first' | 'sent' | 'failed'> {
  if (!args.config) return 'disabled'
  if (!shouldWakePracticeData(args)) return 'not_first'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(args.day)) return 'not_first'
  const result = await postPracticeDataWake(args.config, buildPracticeWakeBody(args.day), args.post)
  return result.ok ? 'sent' : 'failed'
}
