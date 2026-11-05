// Phase 5 Agent B — decisions never skip dual review / never emit fixed.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const {
  decideAgentBAction,
  buildReplacementQueueFile,
  buildReplacementDraftStub,
  CONFIDENCE_AUTO_THRESHOLD,
} = await import('../errorSystem/agentB.ts')
const { buildInvestigationResult } = await import('../errorSystem/investigationResult.ts')
const { parseQueueReport } = await import('../errorSystem/queueReport.ts')

const baseResult = {
  report_id: '42',
  assigned_bot_id: 'math-bot' as const,
  error_type: 'wrong_answer' as const,
  evidence: 're-solved',
  reasoning: 'mismatch',
  completed_at: '2026-11-05T00:00:00.000Z',
  dual_review_required: true as const,
}

test('low confidence or invalid → needs_human; never fixed', () => {
  const low = decideAgentBAction(
    buildInvestigationResult({
      ...baseResult,
      is_valid: true,
      confidence: 0.45,
      should_replace: true,
    }),
  )
  assert.equal(low.action, 'needs_human')
  assert.equal(low.reportStatus, 'needs_human')
  assert.equal(low.enqueueReplacement, false)

  const bad = decideAgentBAction(
    buildInvestigationResult({
      ...baseResult,
      is_valid: false,
      confidence: 0.9,
      should_replace: false,
      error_type: 'other',
    }),
  )
  assert.equal(bad.action, 'needs_human')
})

test('high confidence replace still enqueues dual review, not fixed', () => {
  const d = decideAgentBAction(
    buildInvestigationResult({
      ...baseResult,
      is_valid: true,
      confidence: CONFIDENCE_AUTO_THRESHOLD,
      should_replace: true,
    }),
  )
  assert.equal(d.action, 'enqueue_replacement')
  assert.equal(d.reportStatus, 'confirmed')
  assert.equal(d.shouldWithdraw, true)
  assert.equal(d.enqueueReplacement, true)
  assert.notEqual(d.reportStatus, 'fixed' as string)
})

test('not_an_error → reject_report', () => {
  const d = decideAgentBAction(
    buildInvestigationResult({
      ...baseResult,
      is_valid: false,
      confidence: 0.95,
      should_replace: false,
      error_type: 'not_an_error',
    }),
  )
  assert.equal(d.action, 'reject_report')
  assert.equal(d.reportStatus, 'rejected')
})

test('replacement queue file locks labels and L1 24h', () => {
  const example = JSON.parse(
    readFileSync(join(process.cwd(), '.grok-queue/_example-report.json'), 'utf8'),
  )
  const q = parseQueueReport(example)
  assert.ok(q.ok)
  if (!q.ok) return
  const result = buildInvestigationResult({
    ...baseResult,
    report_id: q.value.report_id,
    is_valid: true,
    confidence: 0.91,
    should_replace: true,
  })
  const now = new Date('2026-11-05T00:00:00.000Z')
  const item = buildReplacementQueueFile({
    report: q.value,
    result,
    draftRef: 'drafts/error-replacements/draft-0.json',
    now,
  })
  assert.equal(item.dual_review_required, true)
  assert.equal(item.review_stage, 'human_review')
  assert.equal(item.public_label_zh, '經自動檢查')
  assert.equal(item.l1_due_at, '2026-11-06T00:00:00.000Z')
  const stub = buildReplacementDraftStub(q.value)
  assert.equal(stub.dual_review_required, true)
  assert.equal(stub.status, 'awaiting_generation')
})

test('agent-b script refuses silent fixed and API keys', () => {
  const src = readFileSync(join(process.cwd(), 'scripts/error-system/agent-b.mts'), 'utf8')
  assert.match(src, /--withdraw/)
  assert.match(src, /dual_review/)
  assert.equal(src.includes('GROK_API_KEY'), false)
  assert.match(src, /即 fixed/)
})
