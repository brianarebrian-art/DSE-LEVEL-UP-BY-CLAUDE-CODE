// Agent A queue payload builder for `.grok-queue/report-{id}.json`.
// Pure module: no Supabase, no fs — safe for unit tests and scripts.
import { CATEGORIES, type CategoryKey } from '../questionReport.ts'

export const QUEUE_SCHEMA_VERSION = 1 as const

/** Keys that must never appear in a queue report file (§16.E + anonymous decision). */
export const FORBIDDEN_QUEUE_KEYS = [
  'reporter_id',
  'user_id',
  'email',
  'ip',
  'ip_address',
  'user_agent',
  'description',
  'detail',
  'name',
  'phone',
] as const

export type QueueOriginalQuestion = {
  type: string
  topic?: string
  difficulty?: string
  content: string
  contentEn?: string
  options?: string[]
  optionsEn?: string[]
  correctIndex?: number
  referenceAnswer?: string
}

export type QueueReportV1 = {
  schema_version: typeof QUEUE_SCHEMA_VERSION
  report_id: string
  question_id: string
  subject: string
  category: CategoryKey
  locale: 'zh' | 'en'
  original_question: QueueOriginalQuestion
  created_at: string
}

export type ReportRow = {
  id: number | string
  question_id: string
  category: string
  locale: string
  status: string
  created_at: string
}

export type BankQuestionLite = {
  id: string
  type: string
  subject: string
  topic?: string
  difficulty?: string
  content: string
  contentEn?: string
  options?: string[]
  optionsEn?: string[]
  correctIndex?: number
  referenceAnswer?: string
}

const CATEGORY_KEYS = new Set(CATEGORIES.map((c) => c.key))

export function queueFileName(reportId: string | number): string {
  return `report-${reportId}.json`
}

export function isProcessableReportStatus(status: string): boolean {
  return status === 'open'
}

export function assertNoForbiddenKeys(value: unknown, path = '$'): string[] {
  const hits: string[] = []
  if (Array.isArray(value)) {
    value.forEach((v, i) => hits.push(...assertNoForbiddenKeys(v, `${path}[${i}]`)))
    return hits
  }
  if (!value || typeof value !== 'object') return hits
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if ((FORBIDDEN_QUEUE_KEYS as readonly string[]).includes(k)) {
      hits.push(`${path}.${k}`)
    }
    hits.push(...assertNoForbiddenKeys(v, `${path}.${k}`))
  }
  return hits
}

export function slimQuestionForQueue(q: BankQuestionLite): QueueOriginalQuestion {
  const out: QueueOriginalQuestion = {
    type: q.type,
    content: q.content,
  }
  if (q.topic) out.topic = q.topic
  if (q.difficulty) out.difficulty = q.difficulty
  if (q.contentEn) out.contentEn = q.contentEn
  if (Array.isArray(q.options)) out.options = q.options
  if (Array.isArray(q.optionsEn)) out.optionsEn = q.optionsEn
  if (typeof q.correctIndex === 'number') out.correctIndex = q.correctIndex
  if (typeof q.referenceAnswer === 'string') out.referenceAnswer = q.referenceAnswer
  return out
}

/**
 * Build a queue report from a DB row + bank question. Drops any forbidden fields.
 * Throws if category/locale invalid or question id mismatch.
 */
export function buildQueueReport(row: ReportRow, question: BankQuestionLite): QueueReportV1 {
  if (!CATEGORY_KEYS.has(row.category as CategoryKey)) {
    throw new Error(`invalid category: ${row.category}`)
  }
  if (row.locale !== 'zh' && row.locale !== 'en') {
    throw new Error(`invalid locale: ${row.locale}`)
  }
  if (question.id !== row.question_id) {
    throw new Error(`question id mismatch: row=${row.question_id} bank=${question.id}`)
  }
  const payload: QueueReportV1 = {
    schema_version: QUEUE_SCHEMA_VERSION,
    report_id: String(row.id),
    question_id: row.question_id,
    subject: question.subject,
    category: row.category as CategoryKey,
    locale: row.locale,
    original_question: slimQuestionForQueue(question),
    created_at: row.created_at,
  }
  const forbidden = assertNoForbiddenKeys(payload)
  if (forbidden.length) {
    throw new Error(`forbidden keys in queue payload: ${forbidden.join(', ')}`)
  }
  return payload
}

/** Validate a parsed queue JSON file (bot / Agent A round-trip). */
export function parseQueueReport(raw: unknown): { ok: true; value: QueueReportV1 } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ok: false, error: 'not an object' }
  const forbidden = assertNoForbiddenKeys(raw)
  if (forbidden.length) return { ok: false, error: `forbidden keys: ${forbidden.join(', ')}` }
  const o = raw as Record<string, unknown>
  if (o.schema_version !== 1) return { ok: false, error: 'schema_version' }
  if (typeof o.report_id !== 'string' || !o.report_id) return { ok: false, error: 'report_id' }
  if (typeof o.question_id !== 'string' || !o.question_id) return { ok: false, error: 'question_id' }
  if (typeof o.subject !== 'string' || !o.subject) return { ok: false, error: 'subject' }
  if (!CATEGORY_KEYS.has(o.category as CategoryKey)) return { ok: false, error: 'category' }
  if (o.locale !== 'zh' && o.locale !== 'en') return { ok: false, error: 'locale' }
  if (typeof o.created_at !== 'string') return { ok: false, error: 'created_at' }
  const q = o.original_question
  if (!q || typeof q !== 'object' || Array.isArray(q)) return { ok: false, error: 'original_question' }
  const qq = q as Record<string, unknown>
  if (typeof qq.type !== 'string' || typeof qq.content !== 'string') return { ok: false, error: 'original_question fields' }
  return { ok: true, value: o as unknown as QueueReportV1 }
}
