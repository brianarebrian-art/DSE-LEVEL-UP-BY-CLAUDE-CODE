// Phase 4 — bot routing + investigation result contracts.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const {
  botForSubject,
  botClaimsSubject,
  NO_DUAL_REVIEW_EXEMPTION_SUBJECTS,
} = await import('../errorSystem/botRouting.ts')
const {
  buildInvestigationResult,
  buildStubInvestigation,
  parseInvestigationResult,
  resultFileName,
  BANNED_RESULT_PHRASES,
} = await import('../errorSystem/investigationResult.ts')
const { parseQueueReport } = await import('../errorSystem/queueReport.ts')

test('routes core subjects and cold subjects without exemption', () => {
  assert.equal(botForSubject('math'), 'math-bot')
  assert.equal(botForSubject('m2'), 'math-bot')
  assert.equal(botForSubject('design-tech'), 'general-bot')
  assert.equal(botForSubject('csd'), 'general-bot')
  assert.equal(botClaimsSubject('math-bot', 'm1'), true)
  assert.equal(botClaimsSubject('chi-bot', 'math'), false)
  assert.equal(botClaimsSubject('general-bot', 'music'), true)
  assert.equal(botClaimsSubject('general-bot', 'math'), false)
  for (const s of NO_DUAL_REVIEW_EXEMPTION_SUBJECTS) {
    assert.ok(botForSubject(s))
  }
})

test('investigation result always forces dual_review_required and bans phrases', () => {
  const ok = buildInvestigationResult({
    report_id: '1',
    assigned_bot_id: 'math-bot',
    is_valid: true,
    confidence: 0.9,
    error_type: 'wrong_answer',
    evidence: 're-solved',
    should_replace: true,
    reasoning: 'key mismatch',
    completed_at: '2026-11-05T00:00:00.000Z',
  })
  assert.equal(ok.dual_review_required, true)
  assert.equal(resultFileName(1), 'result-1.json')

  assert.throws(() =>
    buildInvestigationResult({
      report_id: '1',
      assigned_bot_id: 'math-bot',
      is_valid: true,
      confidence: 0.9,
      error_type: 'wrong_answer',
      evidence: 'x',
      should_replace: true,
      reasoning: `bad ${BANNED_RESULT_PHRASES[0]}`,
      completed_at: '2026-11-05T00:00:00.000Z',
    }),
  )

  const parsed = parseInvestigationResult({ ...ok, dual_review_required: false })
  assert.equal(parsed.ok, false)
})

test('example result file validates', () => {
  const example = JSON.parse(
    readFileSync(join(process.cwd(), '.grok-investigations/_example-result.json'), 'utf8'),
  )
  const r = parseInvestigationResult(example)
  assert.ok(r.ok, r.ok ? '' : r.error)
})

test('stub from example queue stays low confidence for needs_human path', () => {
  const example = JSON.parse(
    readFileSync(join(process.cwd(), '.grok-queue/_example-report.json'), 'utf8'),
  )
  const q = parseQueueReport(example)
  assert.ok(q.ok)
  if (!q.ok) return
  const stub = buildStubInvestigation(q.value, 'math-bot', '2026-11-05T00:00:00.000Z')
  assert.ok(stub.confidence < 0.8)
  assert.equal(stub.dual_review_required, true)
  assert.equal(stub.should_replace, false)
  assert.equal(stub.harness, 'stub')
  const round = parseInvestigationResult(stub)
  assert.ok(round.ok, round.ok ? '' : round.error)
})

test('bot-scan script ignores underscore queue files and forbids API keys', () => {
  const src = readFileSync(join(process.cwd(), 'scripts/error-system/bot-scan.mts'), 'utf8')
  assert.match(src, /--stub/)
  assert.match(src, /xAI/)
  assert.equal(src.includes('XAI_API_KEY'), false)
  assert.equal(src.includes('GROK_API_KEY'), false)
})
