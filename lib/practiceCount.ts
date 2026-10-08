// Anonymous practice counts (founders' reply 40a, 2026-10-08;
// docs/learning-loop-measurement-plan-2026-10-08.md, option 丙).
//
// Two moments are counted, per day and subject only: a practice set starting (and whether
// it was started from the result page's practise-again links) and a practice set
// finishing (with how many questions it had). Nothing identifies a student: no account,
// IP, device, time of day, question or answer, and the table keeps running totals, not
// one row per event (supabase/migrations/0023_practice_counts.sql).
//
// PRACTICE_COUNTS_ENABLED stays false until three things are done together: the founders
// approve applying the migration to the production database, the privacy page describes
// the counts, and its POLICY_VERSION question is settled. While false, the practice page
// sends nothing and the route stores nothing (lib/__tests__/practice-count.test.mts).
import { getSubject } from '@/data/subjects'

export const PRACTICE_COUNTS_ENABLED = false

export const PRACTICE_EVENTS = ['started', 'completed'] as const
export type PracticeEvent = (typeof PRACTICE_EVENTS)[number]

/** A practice set has at most SESSION_SIZE questions today; this only bounds bad input. */
export const MAX_ANSWERED = 100

export interface PracticeCount {
  subject: string
  event: PracticeEvent
  /** Started from a link on the result page (the "practise again" step). Always false for completed. */
  fromResult: boolean
  /** Questions in the finished set. Always 0 for started. */
  answered: number
}

const SUBJECT_ID = /^[a-z0-9-]{1,40}$/

export function parsePracticeCount(v: unknown): { ok: true; value: PracticeCount } | { ok: false; error: string } {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return { ok: false, error: 'body must be an object' }
  const r = v as Record<string, unknown>
  if (typeof r.subject !== 'string' || !SUBJECT_ID.test(r.subject) || !getSubject(r.subject)) return { ok: false, error: 'unknown subject' }
  if (!PRACTICE_EVENTS.includes(r.event as PracticeEvent)) return { ok: false, error: 'unknown event' }
  const event = r.event as PracticeEvent
  if (event === 'started') {
    if (typeof r.fromResult !== 'boolean') return { ok: false, error: 'fromResult must be true or false' }
    if (r.answered !== undefined && r.answered !== 0) return { ok: false, error: 'a start has no answered count' }
    return { ok: true, value: { subject: r.subject, event, fromResult: r.fromResult, answered: 0 } }
  }
  if (r.fromResult !== undefined && r.fromResult !== false) return { ok: false, error: 'a finish is not from the result page' }
  const n = r.answered
  if (typeof n !== 'number' || !Number.isInteger(n) || n < 1 || n > MAX_ANSWERED) return { ok: false, error: 'answered out of range' }
  return { ok: true, value: { subject: r.subject, event, fromResult: false, answered: n } }
}

/** Arguments for public.bump_practice_count (the migration). */
export function toRpcArgs(c: PracticeCount) {
  return { p_subject: c.subject, p_event: c.event, p_from_result: c.fromResult, p_answered: c.answered }
}

// The result page marks its practise-again links, so a start can say where it came from
// without any identifier: ?from=result on the practice URL, nothing stored on the device.
const FROM_PARAM = 'from'
const FROM_RESULT = 'result'

export function withFromResult(href: string): string {
  const [path, query = ''] = href.split('?')
  const q = new URLSearchParams(query)
  q.set(FROM_PARAM, FROM_RESULT)
  return `${path}?${q.toString()}`
}

export function cameFromResult(search: string): boolean {
  return new URLSearchParams(search).get(FROM_PARAM) === FROM_RESULT
}

/** Fire and forget. A failure never reaches the student. */
export function sendPracticeCount(c: PracticeCount): void {
  if (!PRACTICE_COUNTS_ENABLED) return
  try {
    void fetch('/api/practice-count', {
      method: 'POST',
      keepalive: true, // the finish is sent just before the page moves to /result
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(c),
    }).catch(() => {})
  } catch {
    /* fetch unavailable: nothing to do */
  }
}
