// Agent B decision engine — investigation result → next ops action.
// High confidence NEVER skips dual review or marks the report `fixed`.
import type { InvestigationResultV1 } from './investigationResult.ts'
import type { QueueReportV1 } from './queueReport.ts'

export const CONFIDENCE_AUTO_THRESHOLD = 0.8

export type AgentBAction =
  | 'needs_human'
  | 'reject_report'
  | 'enqueue_replacement'
  | 'confirm_no_replace'

export type AgentBDecision = {
  action: AgentBAction
  /** Intended question_reports.status after this step (0034 statuses). */
  reportStatus: 'needs_human' | 'rejected' | 'confirmed'
  reason: string
  shouldWithdraw: boolean
  enqueueReplacement: boolean
}

/**
 * Decide what Agent B should do. `fixed` is never returned here — only after
 * L1+L2 approve and qbank promote (later phase).
 */
export function decideAgentBAction(result: InvestigationResultV1): AgentBDecision {
  if (result.dual_review_required !== true) {
    return {
      action: 'needs_human',
      reportStatus: 'needs_human',
      reason: 'dual_review_required missing or false — refuse single-review path',
      shouldWithdraw: false,
      enqueueReplacement: false,
    }
  }

  if (!result.is_valid) {
    if (result.error_type === 'not_an_error') {
      return {
        action: 'reject_report',
        reportStatus: 'rejected',
        reason: 'investigation marked not_an_error',
        shouldWithdraw: false,
        enqueueReplacement: false,
      }
    }
    return {
      action: 'needs_human',
      reportStatus: 'needs_human',
      reason: 'is_valid=false — founder review',
      shouldWithdraw: false,
      enqueueReplacement: false,
    }
  }

  if (result.confidence < CONFIDENCE_AUTO_THRESHOLD) {
    return {
      action: 'needs_human',
      reportStatus: 'needs_human',
      reason: `confidence ${result.confidence} < ${CONFIDENCE_AUTO_THRESHOLD}`,
      shouldWithdraw: false,
      enqueueReplacement: false,
    }
  }

  if (result.should_replace) {
    return {
      action: 'enqueue_replacement',
      reportStatus: 'confirmed',
      reason: 'valid high-confidence replace → withdraw + replacement queue (still L1+L2)',
      shouldWithdraw: true,
      enqueueReplacement: true,
    }
  }

  return {
    action: 'confirm_no_replace',
    reportStatus: 'confirmed',
    reason: 'valid high-confidence but should_replace=false — founder may edit in place',
    shouldWithdraw: false,
    enqueueReplacement: false,
  }
}

export type ReplacementQueueFileV1 = {
  schema_version: 1
  report_id: string
  old_question_id: string
  subject_slug: string
  draft_ref: string
  review_stage: 'human_review'
  l1_due_at: string
  dual_review_required: true
  internal_source: 'error_replacement'
  public_label_zh: '經自動檢查'
  public_label_en: 'Automated checks only'
  investigation: {
    assigned_bot_id: string
    confidence: number
    error_type: string
    should_replace: true
  }
  created_at: string
}

export function buildReplacementQueueFile(input: {
  report: QueueReportV1
  result: InvestigationResultV1
  draftRef: string
  now?: Date
}): ReplacementQueueFileV1 {
  const now = input.now ?? new Date()
  const l1 = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  return {
    schema_version: 1,
    report_id: input.report.report_id,
    old_question_id: input.report.question_id,
    subject_slug: input.report.subject,
    draft_ref: input.draftRef,
    review_stage: 'human_review',
    l1_due_at: l1.toISOString(),
    dual_review_required: true,
    internal_source: 'error_replacement',
    public_label_zh: '經自動檢查',
    public_label_en: 'Automated checks only',
    investigation: {
      assigned_bot_id: input.result.assigned_bot_id,
      confidence: input.result.confidence,
      error_type: input.result.error_type,
      should_replace: true,
    },
    created_at: now.toISOString(),
  }
}

/** Draft shell for Cursor／教師填內容 — 唔係完整可上線題。 */
export type ReplacementDraftStub = {
  schema_version: 1
  status: 'awaiting_generation'
  report_id: string
  old_question_id: string
  subject: string
  topic?: string
  difficulty?: string
  type: string
  instructions: string[]
  public_provenance_zh: '經自動檢查'
  public_provenance_en: 'Automated checks only'
  dual_review_required: true
}

export function buildReplacementDraftStub(report: QueueReportV1): ReplacementDraftStub {
  const q = report.original_question
  return {
    schema_version: 1,
    status: 'awaiting_generation',
    report_id: report.report_id,
    old_question_id: report.question_id,
    subject: report.subject,
    topic: q.topic,
    difficulty: q.difficulty,
    type: q.type,
    instructions: [
      'Generate a same-topic same-difficulty replacement; do not copy official papers (n-gram < 70%).',
      'Self-check the new item before L1 human_review.',
      'Do not label the student UI as AI-generated replacement; use 經自動檢查 only.',
      'Must pass human_review then second_review before qbank promote — no subject exemptions.',
    ],
    public_provenance_zh: '經自動檢查',
    public_provenance_en: 'Automated checks only',
    dual_review_required: true,
  }
}

export function replacementQueueFileName(reportId: string | number): string {
  return `replacement-${reportId}.json`
}

export function replacementDraftFileName(reportId: string | number): string {
  return `draft-${reportId}.json`
}

export type AgentBAuditEvent = {
  action: string
  target_type: string
  target_id: string
  report_id: string
  result: 'ok' | 'denied' | 'error' | 'cancelled'
  summary: string
  created_at: string
}

export function buildAgentBAuditEvent(input: {
  action: string
  target_type: string
  target_id: string
  report_id: string
  result?: AgentBAuditEvent['result']
  summary: string
  now?: Date
}): AgentBAuditEvent {
  return {
    action: input.action,
    target_type: input.target_type,
    target_id: input.target_id,
    report_id: input.report_id,
    result: input.result ?? 'ok',
    summary: input.summary.slice(0, 500),
    created_at: (input.now ?? new Date()).toISOString(),
  }
}
