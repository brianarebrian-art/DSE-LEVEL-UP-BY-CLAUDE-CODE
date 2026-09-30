// Subject page: what to do next, and per-topic standing with its evidence
// (UX loop 32, 2026-09-30; hardening prompt §9 and §41).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const m: any = await import('../topicEvidence.ts')
const T = m.default?.topicEvidence ? m.default : m

test('fewer than five answers: no label, only the count', () => {
  const e = T.topicEvidence({ total: 4, wrong: 0 })
  assert.equal(e.level, 'unknown')
  assert.equal(e.answered, 4)
  assert.equal(T.topicEvidence(undefined).answered, 0)
})

test('labels follow accuracy; under fifteen answers they carry "little evidence"', () => {
  assert.equal(T.topicEvidence({ total: 10, wrong: 6 }).level, 'weak')
  assert.equal(T.topicEvidence({ total: 10, wrong: 3 }).level, 'fair')
  const s = T.topicEvidence({ total: 10, wrong: 0 })
  assert.equal(s.level, 'steady')
  assert.equal(s.lowConfidence, true)
  assert.equal(T.topicEvidence({ total: 20, wrong: 1 }).lowConfidence, false)
  // Corrupt tallies do not produce impossible numbers.
  const bad = T.topicEvidence({ total: 5, wrong: 9 })
  assert.equal(bad.accuracy, 0)
})

test('no label ever says mastered', () => {
  for (const v of Object.values(T.LEVEL_LABEL) as { zh: string; en: string }[]) {
    assert.doesNotMatch(v.zh, /掌握/)
    assert.doesNotMatch(v.en, /master/i)
  }
})

// The next-step rules moved to recommend-next.test.mts with recommendNextPractice (2026-09-30).

test('the subject page shows the panel and per-topic lines from local data only', () => {
  const view = readFileSync('app/subjects/[subject]/SubjectDetailView.tsx', 'utf8')
  assert.match(view, /<SubjectProgressPanel subjectId=\{meta\.id\} topics=\{topics\} tally=\{tally\} \/>/)
  assert.match(view, /evidenceLine\(topicEvidence\(tally\[topic\.id\]\), en\)/)
  // The hook runs before the early return for inactive subjects.
  assert.ok(view.indexOf('useSubjectTopicTally(meta.id)') < view.indexOf('if (!meta.isActive'))
  const panel = readFileSync('components/SubjectProgressPanel.tsx', 'utf8')
  assert.doesNotMatch(panel, /localStorage\.setItem|fetch\(/)
  assert.match(panel, /min-h-12/)
})
