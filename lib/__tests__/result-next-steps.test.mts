// Next steps under the score on /result (UX loop 7, 2026-09-30; lib/resultNextSteps.ts).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')
const pick = <T,>(m: T): T => ((m as { default?: T }).default ?? m)
const N = pick(await import('../resultNextSteps.ts'))

const tallies = [
  { topic: '二次方程', correct: 3, total: 4 },
  { topic: '概率', correct: 1, total: 3 },
  { topic: '數列', correct: 3, total: 3 },
]
const ids = { 二次方程: 'quadratic', 概率: 'probability', 數列: 'sequences' }

test('the weakest topic below 80% becomes a targeted practice link', () => {
  const s = N.resultNextSteps({ subjectId: 'math', topicResults: tallies, topicIds: ids })
  assert.deepEqual(s.weakest, { label: '概率', href: '/practice?subject=math&topic=probability', correct: 1, total: 3 })
  assert.equal(s.retryHref, '/practice?subject=math')
  assert.equal(s.topicsHref, '/subjects/math')
})

test('no weak topic, no link: 80% or better everywhere', () => {
  const s = N.resultNextSteps({ subjectId: 'math', topicResults: [{ topic: '數列', correct: 4, total: 5 }], topicIds: ids })
  assert.equal(s.weakest, null)
})

test('results saved before topicIds existed still get the other two steps', () => {
  const s = N.resultNextSteps({ subjectId: 'physics', topicResults: tallies })
  assert.equal(s.weakest, null)
  assert.equal(s.retryHref, '/practice?subject=physics')
})

test('a hand-edited or malformed id is not turned into a link', () => {
  for (const bad of [{ 概率: '../admin' }, { 概率: 'a b' }, { 概率: 42 }, ['probability'], 'probability', null]) {
    assert.equal(N.resultNextSteps({ subjectId: 'math', topicResults: tallies, topicIds: bad }).weakest, null, JSON.stringify(bad))
  }
})

test('topics with no questions are ignored when ranking', () => {
  assert.equal(N.weakestTopic([{ topic: 'x', correct: 0, total: 0 }, { topic: 'y', correct: 1, total: 2 }])?.topic, 'y')
  assert.equal(N.weakestTopic([]), null)
})

test('the result page shows next steps right after the score, once', () => {
  const page = read('app/result/ResultPageClient.tsx')
  const code = page.replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  const steps = code.indexOf('resultNextSteps({')
  assert.ok(steps > 0)
  assert.ok(steps < code.indexOf('{r.timeUsedA}'), 'before the score bar')
  assert.ok(steps < code.indexOf('copyTeacherReport}'), 'before the teacher report')
  assert.equal(code.match(/\{r\.retry\}/g)?.length, 1, 'the old bottom buttons are gone, not duplicated')
})

test('topic ids go to the local result only, never to the synced progress log', () => {
  const s = read('app/practice/PracticeSession.tsx')
  const local = s.slice(s.indexOf('const resultData = {'), s.indexOf("localStorage.setItem('dse_result'"))
  assert.match(local, /topicIds: Object\.fromEntries\(questions\.map\(\(q\) => \[q\.topicZh, q\.topic\]\)\)/)
  const at = s.indexOf("localStorage.setItem('dse_result'")
  const synced = s.slice(s.indexOf('recordAttempt({', at), s.indexOf('})', s.indexOf('recordAttempt({', at)))
  assert.doesNotMatch(synced, /topicIds/)
})
