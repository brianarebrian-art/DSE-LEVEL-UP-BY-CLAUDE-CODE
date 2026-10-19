export type RetentionEventName =
  | 'homepage_viewed'
  | 'short_practice_started'
  | 'short_practice_completed'
  | 'question_report_opened'
  | 'question_report_submitted'
  | 'privacy_choice_selected'
  | 'teacher_badge_seen'

export type RetentionEvent = {
  name: RetentionEventName
  subject?: string
  variant?: 'promise' | 'trust'
  anonymousId: string
  occurredAt: string
}

const ANON_KEY = 'dse_retention_anon_id'

function anonymousId() {
  if (typeof window === 'undefined') return 'server'
  try {
    const existing = sessionStorage.getItem(ANON_KEY)
    if (existing) return existing
    const id = crypto.randomUUID()
    sessionStorage.setItem(ANON_KEY, id)
    return id
  } catch {
    return 'ephemeral'
  }
}

export function trackRetentionEvent(
  name: RetentionEventName,
  properties: Omit<RetentionEvent, 'name' | 'anonymousId' | 'occurredAt'> = {},
) {
  if (typeof window === 'undefined') return
  const event: RetentionEvent = {
    name,
    ...properties,
    anonymousId: anonymousId(),
    occurredAt: new Date().toISOString(),
  }
  void fetch('/api/analytics/retention', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(event),
    keepalive: true,
  }).catch(() => undefined)
}
