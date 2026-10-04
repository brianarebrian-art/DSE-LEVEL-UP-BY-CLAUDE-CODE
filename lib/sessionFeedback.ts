// Two questions after a practice session (audit #8, founders' reply 5a, wording "5 ok",
// 2026-10-04): did any of these 10 questions look wrong, and will you use the site again.
//
// Stored in `session_feedback` (supabase/migrations/0022_session_feedback.sql): subject,
// which question, the answer picked, interface language and time. No account, IP address,
// device or free text, so an answer cannot be traced back to a student. Each tap is its own
// row; the two answers are not linked to each other.
//
// Shared by the card (client) and the API route (server), so this is not a 'use client' module.

export const FEEDBACK_QUESTIONS = ['had_error', 'will_return'] as const
export type FeedbackQuestion = (typeof FEEDBACK_QUESTIONS)[number]

export const FEEDBACK_ANSWERS = ['yes', 'no', 'unsure'] as const
export type FeedbackAnswer = (typeof FEEDBACK_ANSWERS)[number]

export interface SessionFeedback {
  subject: string
  question: FeedbackQuestion
  answer: FeedbackAnswer
  locale: 'zh' | 'en'
}

const SUBJECT = /^[a-z0-9-]{1,40}$/

/** Validates a request body and keeps only the four allowed fields. */
export function parseFeedback(body: unknown): { ok: true; value: SessionFeedback } | { ok: false; error: string } {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { ok: false, error: 'invalid body' }
  const b = body as Record<string, unknown>
  if (typeof b.subject !== 'string' || !SUBJECT.test(b.subject)) return { ok: false, error: 'invalid subject' }
  const question = FEEDBACK_QUESTIONS.find((q) => q === b.question)
  if (!question) return { ok: false, error: 'invalid question' }
  const answer = FEEDBACK_ANSWERS.find((a) => a === b.answer)
  if (!answer) return { ok: false, error: 'invalid answer' }
  if (b.locale !== 'zh' && b.locale !== 'en') return { ok: false, error: 'invalid locale' }
  return { ok: true, value: { subject: b.subject, question, answer, locale: b.locale } }
}

/** The row written to `session_feedback`. Column names match the migration. */
export function toFeedbackRow(f: SessionFeedback) {
  return { subject: f.subject, question: f.question, answer: f.answer, locale: f.locale }
}
