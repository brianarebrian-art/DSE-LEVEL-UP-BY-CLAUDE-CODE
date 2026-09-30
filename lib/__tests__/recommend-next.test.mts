// Adaptive recommendation V1 (refinement loop 2, 2026-09-30; prompt §9–§13, §40).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

type Mod = typeof import('../recommendNext.ts')
const raw = (await import('../recommendNext.ts')) as Mod & { default?: Mod }
const R = raw.default ?? raw
type TE = typeof import('../topicEvidence.ts')
const te = (await import('../topicEvidence.ts')) as TE & { default?: TE }
const { MIN_EVIDENCE } = te.default ?? te

const NOW = Date.UTC(2026, 8, 30, 12)
const topics = [{ id: 'a', count: 10 }, { id: 'b', count: 10 }, { id: 'c', count: 10 }, { id: 'w', count: 5, mcCount: 0 }]
const base = { subject: 'math', questionCounts: topics, recentErrors: [], recentSessions: [], now: NOW }
const err = (topicId: string, minsAgo: number, subjectId = 'math') => ({ subjectId, topicId, ts: NOW - minsAgo * 60_000 })

test('lowest accuracy with enough evidence, else first untried, else nothing', () => {
  const r = R.recommendNextPractice({ ...base, topicEvidence: { a: { total: 10, wrong: 2 }, b: { total: 10, wrong: 6 }, c: { total: 3, wrong: 3 } } })
  assert.equal(r?.topic, 'b')
  assert.deepEqual(r?.reason, { kind: 'lowAccuracy', correct: 4, answered: 10 })
  assert.equal(r?.subject, 'math')
  assert.ok((r?.estimatedMinutes ?? 0) > 0)
  // Three wrong out of three is not enough evidence to pick c.
  assert.equal(R.recommendNextPractice({ ...base, topicEvidence: { a: { total: 20, wrong: 0 }, b: { total: 20, wrong: 1 } } })?.reason.kind, 'untried')
  assert.equal(R.recommendNextPractice({ ...base, topicEvidence: { a: { total: 20, wrong: 0 }, b: { total: 20, wrong: 0 }, c: { total: 20, wrong: 0 } } }), null)
})

test('evidence threshold: 1/1 or a handful of answers never produces a judgement', () => {
  const ev = { a: { total: 1, wrong: 1 }, b: { total: MIN_EVIDENCE - 1, wrong: MIN_EVIDENCE - 1 }, c: { total: 1, wrong: 0 } }
  const r = R.recommendNextPractice({ ...base, topicEvidence: ev, recentErrors: [err('a', 1), err('a', 2), err('b', 3), err('b', 4)] })
  // Every topic has been touched, none has enough evidence: nothing to say.
  assert.equal(r, null)
})

test('recent wrong answers clustered in one topic come first', () => {
  const ev = { a: { total: 12, wrong: 2 }, b: { total: 10, wrong: 7 }, c: { total: 8, wrong: 3 } }
  const r = R.recommendNextPractice({ ...base, topicEvidence: ev, recentErrors: [err('c', 5), err('c', 6), err('c', 7), err('a', 8), err('x', 9, 'physics')] })
  assert.equal(r?.topic, 'c')
  assert.deepEqual(r?.reason, { kind: 'recentErrors', inTopic: 3, considered: 4 })
})

test('old errors and single errors do not count as a cluster', () => {
  const ev = { a: { total: 12, wrong: 2 }, b: { total: 10, wrong: 7 }, c: { total: 8, wrong: 3 } }
  const old = (R.RECENT_ERROR_DAYS + 1) * 24 * 60
  const r = R.recommendNextPractice({ ...base, topicEvidence: ev, recentErrors: [err('c', old), err('c', old + 1), err('a', 1)] })
  assert.equal(r?.reason.kind, 'lowAccuracy')
  assert.equal(r?.topic, 'b')
})

test('never a topic without published MC questions', () => {
  const r = R.recommendNextPractice({ ...base, questionCounts: [{ id: 'w', count: 5, mcCount: 0 }], topicEvidence: { w: { total: 10, wrong: 9 } }, recentErrors: [err('w', 1), err('w', 2), err('w', 3)] })
  assert.equal(r, null)
  // Topics missing from the published list (withheld, withdrawn) are ignored too.
  const r2 = R.recommendNextPractice({ ...base, topicEvidence: { gone: { total: 10, wrong: 9 }, a: { total: 10, wrong: 0 }, b: { total: 10, wrong: 0 }, c: { total: 10, wrong: 0 } }, recentErrors: [err('gone', 1), err('gone', 2)] })
  assert.equal(r2, null)
})

test('a topic just finished well is not suggested again straight away', () => {
  const ev = { a: { total: 10, wrong: 4 }, b: { total: 10, wrong: 3 }, c: { total: 10, wrong: 0 } }
  const sessions = [{ subjectId: 'math', topicFilter: 'a', score: 9, total: 10, timestamp: NOW - 30 * 60_000 }]
  assert.equal(R.recommendNextPractice({ ...base, topicEvidence: ev, recentSessions: sessions })?.topic, 'b')
  assert.equal(R.recommendNextPractice({ ...base, topicEvidence: ev })?.topic, 'a')
})

test('the subject page uses it, links to the topic, and never says weakest', () => {
  const panel = readFileSync('components/SubjectProgressPanel.tsx', 'utf8')
  assert.match(panel, /recommendNextPractice\(\{/)
  assert.match(panel, /href=\{`\/practice\?subject=\$\{subjectId\}&topic=\$\{encodeURIComponent\(step\.topic\)\}`\}/)
  assert.match(panel, /最近較需要鞏固/)
  assert.doesNotMatch(panel.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, ''), /最弱|weakest/i)
  assert.doesNotMatch(readFileSync('lib/recommendNext.ts', 'utf8'), /localStorage|fetch\(|supabase/i)
})

test('other weak-topic lists use the same evidence threshold and no "weakest" label', () => {
  const strip = (p: string) => readFileSync(p, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
  for (const f of ['components/DailyPlan.tsx', 'lib/gentleSuggestions.ts']) {
    const s = strip(f)
    assert.match(s, /weakestTopics\(\{ min: MIN_EVIDENCE/, f)
    assert.doesNotMatch(s, /最弱|weakest topics|最抵溫/, f)
  }
  assert.doesNotMatch(strip('app/result/ResultPageClient.tsx'), /今次最弱|Weakest this time/)
})
