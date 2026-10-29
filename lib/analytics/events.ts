// Privacy-minimised product analytics (server validates before insert).
// Naming follows docs/ANALYTICS_PLAN.md — keep in lockstep with tests.

export const ANALYTICS_EVENT_NAMES = [
  'question_viewed',
  'question_answered',
  'question_bookmarked',
  'mistake_review_started',
  'topic_practice_completed',
  'question_reported',
  'login_completed',
  'signup_completed',
  'practice_started',
  'practice_completed',
  'explanation_viewed',
  'auth_sync_error',
] as const

export type AnalyticsEventName = (typeof ANALYTICS_EVENT_NAMES)[number]

/** Payload keys allowed after scrub. No email, name, school, free-text answers. */
export const ALLOWED_PAYLOAD_KEYS = [
  'subjectId',
  'topicId',
  'questionId',
  'difficulty',
  'correct',
  'elapsedMs',
  'locale',
  'mode',
  'category',
  'sessionSize',
  'platformHint', // coarse: mobile|desktop|unknown — never UA string
] as const

export type AnalyticsPayload = Partial<Record<(typeof ALLOWED_PAYLOAD_KEYS)[number], string | number | boolean>>

const EVENT_SET = new Set<string>(ANALYTICS_EVENT_NAMES)
const KEY_SET = new Set<string>(ALLOWED_PAYLOAD_KEYS)

const ANON_RE = /^[A-Za-z0-9_-]{8,64}$/
const SUBJECT_RE = /^[A-Za-z0-9_.:@-]{1,128}$/

export function scrubPayload(raw: unknown): AnalyticsPayload {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const out: AnalyticsPayload = {}
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!KEY_SET.has(k)) continue
    if (typeof v === 'boolean' || typeof v === 'number') {
      if (typeof v === 'number' && !Number.isFinite(v)) continue
      if (typeof v === 'number' && Math.abs(v) > 1e9) continue
      out[k as keyof AnalyticsPayload] = v
      continue
    }
    if (typeof v === 'string') {
      const t = v.trim().slice(0, 100)
      if (!t) continue
      // Block obvious PII shapes
      if (/@/.test(t) && k !== 'subjectId') continue
      out[k as keyof AnalyticsPayload] = t
    }
  }
  return out
}

export function parseAnalyticsEvent(body: unknown):
  | {
      ok: true
      value: {
        eventName: AnalyticsEventName
        anonymousId: string | null
        subjectKey: string | null
        platform: 'web' | 'unknown'
        appVersion: string | null
        payload: AnalyticsPayload
      }
    }
  | { ok: false; error: string } {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { ok: false, error: 'invalid body' }
  const b = body as Record<string, unknown>
  if (typeof b.eventName !== 'string' || !EVENT_SET.has(b.eventName)) return { ok: false, error: 'invalid event' }

  let anonymousId: string | null = null
  if (b.anonymousId != null) {
    if (typeof b.anonymousId !== 'string' || !ANON_RE.test(b.anonymousId)) return { ok: false, error: 'invalid anonymousId' }
    anonymousId = b.anonymousId
  }

  let subjectKey: string | null = null
  if (b.subjectKey != null) {
    if (typeof b.subjectKey !== 'string' || !SUBJECT_RE.test(b.subjectKey)) return { ok: false, error: 'invalid subjectKey' }
    subjectKey = b.subjectKey
  }

  if (!anonymousId && !subjectKey) return { ok: false, error: 'actor required' }

  const platform = b.platform === 'web' || b.platform === 'unknown' ? b.platform : 'web'
  const appVersion =
    typeof b.appVersion === 'string' && b.appVersion.length > 0 && b.appVersion.length <= 32
      ? b.appVersion
      : null

  return {
    ok: true,
    value: {
      eventName: b.eventName as AnalyticsEventName,
      anonymousId,
      subjectKey,
      platform,
      appVersion,
      payload: scrubPayload(b.payload),
    },
  }
}
