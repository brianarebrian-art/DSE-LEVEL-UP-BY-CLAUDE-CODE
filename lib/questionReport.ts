// Question problem reports (「呢條題有問題？話我哋知」).
//
// 2026-10-04 (audit #7, founders' reply A7-2 A, then "a"): a report can be sent straight to the
// site. Only what the student PICKS is stored — the question id and a category — plus the
// interface language and the time (table `question_reports`,
// supabase/migrations/0020_question_reports.sql). The student's own description is not sent
// to the site: it goes only by the student's own email, as before (charter §16.E constraint 5:
// what a student writes stays off our servers).
//
// No account, IP address or device is stored, so a report cannot be traced back to a student.
//
// Shared by the button (client) and the API route (server), so this must not be a 'use client'
// module: a server import of a client module receives references, not the values.

/** Phrases a student would say, not internal terms. Keep in step with the migration's check constraint. */
export const CATEGORIES = [
  { key: 'answer', zh: '答案好似唔啱', en: 'The answer looks wrong' },
  { key: 'explain', zh: '解析講唔通 ／ 同答案對唔上', en: 'The explanation does not follow' },
  { key: 'wording', zh: '題目寫得唔清楚 ／ 有歧義', en: 'The question is unclear or ambiguous' },
  { key: 'display', zh: '排版、公式或顯示有問題', en: 'Formatting, formula or display problem' },
  { key: 'scope', zh: '超出課程範圍 ／ 難度標錯', en: 'Outside the syllabus, or mislabelled difficulty' },
  // 2026-09-30 (UX loop 30): a wrong topic also misfiles "practise this topic" and the error-pattern stats.
  { key: 'topic', zh: '課題分類錯', en: 'Filed under the wrong topic' },
  { key: 'copyright', zh: '懷疑抄咗官方試題', en: 'Looks copied from an official paper' },
  { key: 'other', zh: '其他', en: 'Something else' },
] as const

export type CategoryKey = (typeof CATEGORIES)[number]['key']

export interface QuestionReport {
  questionId: string
  category: CategoryKey
  locale: 'zh' | 'en'
}

const QUESTION_ID = /^[A-Za-z0-9_.:-]{1,100}$/

/**
 * Validates a request body and keeps only the three allowed fields. Anything else the client
 * sends (a description, a name) is dropped here, so it can never reach the database.
 */
export function parseReport(body: unknown): { ok: true; value: QuestionReport } | { ok: false; error: string } {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { ok: false, error: 'invalid body' }
  const b = body as Record<string, unknown>
  if (typeof b.questionId !== 'string' || !QUESTION_ID.test(b.questionId)) return { ok: false, error: 'invalid questionId' }
  const category = CATEGORIES.find((c) => c.key === b.category)?.key
  if (!category) return { ok: false, error: 'invalid category' }
  if (b.locale !== 'zh' && b.locale !== 'en') return { ok: false, error: 'invalid locale' }
  return { ok: true, value: { questionId: b.questionId, category, locale: b.locale } }
}

/** The row written to `question_reports`. Column names match the migration. */
export function toRow(r: QuestionReport): { question_id: string; category: CategoryKey; locale: 'zh' | 'en' } {
  return { question_id: r.questionId, category: r.category, locale: r.locale }
}
