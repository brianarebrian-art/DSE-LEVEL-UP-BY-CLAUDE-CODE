// Investigation result builder for `.grok-investigations/result-{id}.json`.
import type { BotId } from './botRouting.ts'
import type { QueueReportV1 } from './queueReport.ts'
import { FORBIDDEN_QUEUE_KEYS, assertNoForbiddenKeys } from './queueReport.ts'

export const RESULT_SCHEMA_VERSION = 1 as const

export const ERROR_TYPES = [
  'wrong_answer',
  'bad_explanation',
  'ambiguous_wording',
  'display_bug',
  'out_of_syllabus',
  'wrong_topic',
  'copyright_risk',
  'not_an_error',
  'other',
] as const

export type ErrorType = (typeof ERROR_TYPES)[number]

/** Strings banned in any result text field (founder decisions 1 + 4). */
export const BANNED_RESULT_PHRASES = [
  'AI生成替換',
  'AI 生成替換',
  'AI-generated replacement',
  '單審-冷門科',
  '單審冷門',
] as const

export type InvestigationResultV1 = {
  schema_version: typeof RESULT_SCHEMA_VERSION
  report_id: string
  assigned_bot_id: BotId
  is_valid: boolean
  confidence: number
  error_type: ErrorType
  correct_answer?: string
  evidence: string
  should_replace: boolean
  reasoning: string
  dual_review_required: true
  completed_at: string
  /** Harness-only: structural stub, not a full Grok VM re-solve. */
  harness?: 'stub' | 'validate'
}

export function resultFileName(reportId: string | number): string {
  return `result-${reportId}.json`
}

export function findBannedPhrases(text: string): string[] {
  return BANNED_RESULT_PHRASES.filter((p) => text.includes(p))
}

function assertCleanText(field: string, text: string): void {
  const hits = findBannedPhrases(text)
  if (hits.length) throw new Error(`${field} contains banned phrase(s): ${hits.join(', ')}`)
}

export function buildInvestigationResult(input: {
  report_id: string
  assigned_bot_id: BotId
  is_valid: boolean
  confidence: number
  error_type: ErrorType
  correct_answer?: string
  evidence: string
  should_replace: boolean
  reasoning: string
  completed_at?: string
  harness?: 'stub' | 'validate'
}): InvestigationResultV1 {
  if (input.confidence < 0 || input.confidence > 1) {
    throw new Error('confidence must be in [0,1]')
  }
  if (!(ERROR_TYPES as readonly string[]).includes(input.error_type)) {
    throw new Error(`invalid error_type: ${input.error_type}`)
  }
  assertCleanText('evidence', input.evidence)
  assertCleanText('reasoning', input.reasoning)
  if (input.correct_answer) assertCleanText('correct_answer', input.correct_answer)

  const payload: InvestigationResultV1 = {
    schema_version: RESULT_SCHEMA_VERSION,
    report_id: input.report_id,
    assigned_bot_id: input.assigned_bot_id,
    is_valid: input.is_valid,
    confidence: input.confidence,
    error_type: input.error_type,
    evidence: input.evidence,
    should_replace: input.should_replace,
    reasoning: input.reasoning,
    // Always true — no niche exemption (founder decision 1).
    dual_review_required: true,
    completed_at: input.completed_at ?? new Date().toISOString(),
  }
  if (input.correct_answer !== undefined) payload.correct_answer = input.correct_answer
  if (input.harness) payload.harness = input.harness

  const forbidden = assertNoForbiddenKeys(payload)
  if (forbidden.length) throw new Error(`forbidden keys: ${forbidden.join(', ')}`)
  return payload
}

/** Honest Phase 4 harness stub: low confidence → Agent B will take needs_human path. */
export function buildStubInvestigation(
  report: QueueReportV1,
  botId: BotId,
  completedAt = new Date().toISOString(),
): InvestigationResultV1 {
  return buildInvestigationResult({
    report_id: report.report_id,
    assigned_bot_id: botId,
    is_valid: true,
    confidence: 0.45,
    error_type: 'other',
    evidence:
      'Phase 4 harness stub: subject routed and queue schema validated. Full Grok VM re-solve was not run; treat as needs_human.',
    should_replace: false,
    reasoning:
      'Structural scan only. dual_review_required remains true for every subject including m1/m2/design-tech. Student-facing provenance stays 經自動檢查 only.',
    completed_at: completedAt,
    harness: 'stub',
  })
}

export function parseInvestigationResult(
  raw: unknown,
): { ok: true; value: InvestigationResultV1 } | { ok: false; error: string } {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ok: false, error: 'not an object' }
  const forbidden = assertNoForbiddenKeys(raw)
  if (forbidden.length) return { ok: false, error: `forbidden keys: ${forbidden.join(', ')}` }
  const o = raw as Record<string, unknown>
  if (o.schema_version !== 1) return { ok: false, error: 'schema_version' }
  if (typeof o.report_id !== 'string') return { ok: false, error: 'report_id' }
  if (typeof o.assigned_bot_id !== 'string') return { ok: false, error: 'assigned_bot_id' }
  if (typeof o.is_valid !== 'boolean') return { ok: false, error: 'is_valid' }
  if (typeof o.confidence !== 'number' || o.confidence < 0 || o.confidence > 1) {
    return { ok: false, error: 'confidence' }
  }
  if (!(ERROR_TYPES as readonly string[]).includes(o.error_type as string)) {
    return { ok: false, error: 'error_type' }
  }
  if (typeof o.evidence !== 'string' || typeof o.reasoning !== 'string') {
    return { ok: false, error: 'evidence/reasoning' }
  }
  if (typeof o.should_replace !== 'boolean') return { ok: false, error: 'should_replace' }
  if (o.dual_review_required !== true) return { ok: false, error: 'dual_review_required must be true' }
  if (typeof o.completed_at !== 'string') return { ok: false, error: 'completed_at' }
  for (const field of ['evidence', 'reasoning', 'correct_answer'] as const) {
    const t = o[field]
    if (typeof t === 'string') {
      const banned = findBannedPhrases(t)
      if (banned.length) return { ok: false, error: `banned in ${field}: ${banned.join(',')}` }
    }
  }
  // Re-check forbidden student keys from queue list (shared denylist).
  for (const k of FORBIDDEN_QUEUE_KEYS) {
    if (k in o) return { ok: false, error: `forbidden key ${k}` }
  }
  return { ok: true, value: o as unknown as InvestigationResultV1 }
}
