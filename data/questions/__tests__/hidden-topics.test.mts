// Withheld topics (data/questions/hidden-topics.ts; docs/UNMAPPED-220.md).
// Yuna 2026-09-26: the two "not found" Ethics and Religious Studies topics are not
// shown to students, but the questions stay in the repo for audit.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const idx: any = await import('../index.ts')
const I = idx.default?.getSubjectQuestions ? idx.default : idx
const ht: any = await import('../hidden-topics.ts')
const H = ht.default?.HIDDEN_TOPICS ? ht.default : ht

const HIDDEN = ['religion_philosophy', 'religion_society']

test('the withheld list is exactly the two unmapped ERS topics', () => {
  assert.deepEqual(H.HIDDEN_TOPICS, { 'ethics-religious': HIDDEN })
})

test('students get none of them; the raw bank still has all 220', () => {
  const served = I.getSubjectQuestions('ethics-religious')
  assert.equal(served.filter((q: any) => HIDDEN.includes(q.topic)).length, 0)
  const raw = I.getSubjectQuestionsRaw('ethics-religious')
  assert.equal(raw.filter((q: any) => HIDDEN.includes(q.topic)).length, 220)
  assert.equal(raw.length - served.length, 220)
})

test('the topic list does not show them', () => {
  const ids = I.getSubjectTopics('ethics-religious').map((t: any) => t.id)
  for (const t of HIDDEN) assert.ok(!ids.includes(t), `${t} is still listed`)
})

test('the client loader filters both the cloud and the static path', () => {
  const src = readFileSync('data/questions/load.ts', 'utf8')
  assert.match(src, /if \(cloud\?\.length\) return withoutHiddenTopics\(subjectId, cloud\)/)
  assert.match(src, /return withoutHiddenTopics\(subjectId, applyDifficultyOverrides\(all/)
})

test('the record lists every withheld id', () => {
  const doc = readFileSync('docs/UNMAPPED-220.md', 'utf8')
  const raw = I.getSubjectQuestionsRaw('ethics-religious').filter((q: any) => HIDDEN.includes(q.topic))
  const missing = raw.filter((q: any) => !doc.includes(q.id))
  assert.equal(missing.length, 0, `not in docs/UNMAPPED-220.md: ${missing.slice(0, 5).map((q: any) => q.id).join(', ')}`)
})
