// Phase 3 Agent A — queue payload contracts (no PII / free text).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const {
  FORBIDDEN_QUEUE_KEYS,
  assertNoForbiddenKeys,
  buildQueueReport,
  isProcessableReportStatus,
  parseQueueReport,
  queueFileName,
  slimQuestionForQueue,
} = await import('../errorSystem/queueReport.ts')

const example = JSON.parse(
  readFileSync(join(process.cwd(), '.grok-queue/_example-report.json'), 'utf8'),
) as unknown

test('example queue file validates and has no forbidden keys', () => {
  const r = parseQueueReport(example)
  assert.ok(r.ok, r.ok ? '' : r.error)
  assert.equal(assertNoForbiddenKeys(example).length, 0)
  for (const k of FORBIDDEN_QUEUE_KEYS) {
    assert.equal(Object.prototype.hasOwnProperty.call(example, k), false)
  }
})

test('buildQueueReport strips bank noise and rejects description injection', () => {
  const row = {
    id: 42,
    question_id: 'math_demo',
    category: 'answer',
    locale: 'zh',
    status: 'open',
    created_at: '2026-11-05T00:00:00.000Z',
  }
  const q = {
    id: 'math_demo',
    type: 'mc',
    subject: 'math',
    topic: 'quadratic',
    difficulty: 'medium',
    content: 'Solve x^2=1',
    options: ['0', '1', '2', '3'],
    correctIndex: 1,
  }
  const payload = buildQueueReport(row, q)
  assert.equal(payload.report_id, '42')
  assert.equal(payload.subject, 'math')
  assert.deepEqual(payload.original_question.options, ['0', '1', '2', '3'])
  assert.equal(queueFileName(42), 'report-42.json')
  assert.equal(isProcessableReportStatus('open'), true)
  assert.equal(isProcessableReportStatus('queued'), false)

  const poisoned = {
    ...payload,
    description: '學生自寫',
    reporter_id: 'uuid',
  }
  const bad = parseQueueReport(poisoned)
  assert.equal(bad.ok, false)
})

test('slimQuestionForQueue keeps only investigation fields', () => {
  const slim = slimQuestionForQueue({
    id: 'x',
    type: 'text',
    subject: 'chinese',
    content: '解釋',
    referenceAnswer: '參考',
    difficulty: 'hard',
  })
  assert.deepEqual(Object.keys(slim).sort(), ['content', 'difficulty', 'referenceAnswer', 'type'])
})

test('agent-a script documents dry-run and forbids realtime on Next edge', () => {
  const src = readFileSync(join(process.cwd(), 'scripts/error-system/agent-a.mts'), 'utf8')
  assert.match(src, /--write/)
  assert.match(src, /--push-status/)
  assert.match(src, /dry-run/)
  assert.equal(src.includes("from '@/utils/supabase/server'"), false)
  assert.match(src, /Realtime/)
})
