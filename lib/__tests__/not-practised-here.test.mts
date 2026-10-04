// ============================================================================
// not-practised-here.test.mts — founders' reply 22a (audit #10, 2026-10-04)
// ----------------------------------------------------------------------------
// Each subject page says which parts of the real exam the site cannot practise.
// Wording approved as drafted ("22 ok"); the list is derived from PAPER_STRUCTURE.
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const { notPractisedSentence } = await import('../notPractisedHere.ts')

test('the three approved examples, word for word', () => {
  assert.equal(notPractisedSentence('music', false), '本站練唔到：聆聽（要聽錄音，卷 1，50%）、演奏（卷 2，30%）、創作（卷 3，20%）。呢啲部分要另外準備。')
  assert.equal(notPractisedSentence('english', false), '本站練唔到：聆聽（要聽錄音，卷 3A，15%）、口試（卷 4，10%）、校本評核（15%）。呢啲部分要另外準備。')
  assert.equal(notPractisedSentence('pe', false), '本站練唔到：實習考試（卷 3，40%）。呢啲部分要另外準備。')
  assert.equal(notPractisedSentence('music', true), 'Not covered here: listening (needs recordings; Paper 1, 50%), performing (Paper 2, 30%), composing (Paper 3, 20%). Prepare for these separately.')
})

test('written-only subjects without school-based assessment show nothing', () => {
  for (const id of ['math', 'm1', 'm2', 'economics', 'history', 'chinese-history', 'geography', 'bafs', 'csd', 'ethics-religious', 'ths']) {
    assert.equal(notPractisedSentence(id, false), null, id)
  }
})

test('school-based assessment is named where it exists', () => {
  assert.equal(notPractisedSentence('physics', false), '本站練唔到：校本評核（20%）。呢啲部分要另外準備。')
})

test('the subject page shows the sentence under the title, not inside the collapsed table', () => {
  const view = readFileSync('app/subjects/[subject]/SubjectDetailView.tsx', 'utf8')
  assert.match(view, /const notPractised = notPractisedSentence\(meta\.id, en\)/)
  const title = view.indexOf('{description}</p>\n          {notPractised && (')
  assert.ok(title > 0 && title < view.indexOf('<details'), 'the sentence must sit under the title, above the collapsed exam table')
})
