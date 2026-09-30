// Written questions: a four-point self-check and plain words that the site does not mark
// (UX loop 33, 2026-09-30; hardening prompt §26, charter §16.A).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const card = readFileSync('components/LongQuestionCard.tsx', 'utf8')
const sheet = readFileSync('app/answer-sheet/AnswerSheetClient.tsx', 'utf8')

test('the card says it does not mark, and offers the four checks', () => {
  assert.match(card, /本站唔會幫你評分/)
  assert.match(card, /This site does not mark written answers/)
  for (const k of ['content', 'concept', 'evidence', 'structure']) assert.match(card, new RegExp(`key: '${k}', zh:`), k)
  assert.match(card, /<fieldset/)
  assert.match(card, /type="checkbox"/)
})

test('the checklist is not stored, sent or scored', () => {
  const block = card.slice(card.indexOf('<fieldset'), card.indexOf('</fieldset>'))
  assert.doesNotMatch(block, /onResult|localStorage|fetch\(/)
  assert.doesNotMatch(card, /checks\)?\.(filter|length)|Object\.values\(checks\)/, 'no score from ticks')
})

test('self-rating labels compare with the model answer and never claim mastery', () => {
  for (const src of [card, sheet]) {
    assert.match(src, /key: 'full', zh: '大致對到'/)
    assert.match(src, /key: 'partial', zh: '對到部分'/)
    assert.match(src, /key: 'none', zh: '未對到'/)
    assert.doesNotMatch(src.replace(/^\s*\/\/.*$/gm, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, ''), /zh: '完全掌握'|zh: '仲未掌握'/)
  }
})
