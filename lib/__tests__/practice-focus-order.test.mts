import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
const { practiceTabDestination, slotFor } = await import('../practiceFocusOrder.ts')

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const session = readFileSync(join(ROOT, 'app/practice/PracticeSession.tsx'), 'utf8')
const css = readFileSync(join(ROOT, 'app/globals.css'), 'utf8')
const block = css.slice(css.indexOf('/* practice-revealed-p0'), css.indexOf('/* /practice-revealed-p0 */'))

const optA = { id: 'a' }
const optB = { id: 'b' }
const nextBtn = { id: 'next' }
const feedback = { id: 'fb' }
const cause = { id: 'cause' }
const more = { id: 'more' }
const after = { id: 'after' }

function slot(active: object, inFeedback: object[]) {
  return slotFor(active, {
    options: [optA, optB],
    nextBtn,
    feedback,
    inFeedback,
    afterNext: after,
  })
}

test('arrows and Tab meet the practice order: options, next, then explanation', () => {
  assert.equal(practiceTabDestination(slot(optA, [cause, more]), false), null)
  assert.equal(practiceTabDestination(slot(optB, [cause, more]), false), 'next')
  assert.equal(practiceTabDestination('next', false), 'feedback-first')
  assert.equal(practiceTabDestination(slot(cause, [cause, more]), false), null)
  assert.equal(practiceTabDestination(slot(more, [cause, more]), false), 'after')
  assert.equal(practiceTabDestination(slot(after, [cause, more]), true), 'feedback-last')
  assert.equal(practiceTabDestination('next', true), 'option-last')
  assert.equal(practiceTabDestination(slot(cause, [cause, more]), true), 'next')
  assert.equal(practiceTabDestination(slot(cause, [cause]), false), 'after')
  assert.equal(practiceTabDestination(slot(cause, [cause]), true), 'next')
  assert.equal(practiceTabDestination(slot(feedback, []), true), 'next')
  assert.equal(practiceTabDestination('other', false), null)
})

test('the session wires that order and does not drop revealed options', () => {
  assert.match(session, /practiceTabDestination\(/)
  assert.match(session, /aria-disabled=\{answerState !== null\}/)
  assert.match(session, /aria-pressed=\{isSelected\}/)
  assert.match(session, /data-practice-option/)
  assert.doesNotMatch(session, /(?<!aria-)disabled=\{answerState !== null\}/)
  assert.doesNotMatch(session, /outline-none/)
  assert.match(session, /未揀中。正確答案同解析已經標示/)
  const handler = session.slice(session.indexOf('const onKey = (e: KeyboardEvent)'), session.indexOf("window.addEventListener('keydown'"))
  assert.match(handler, /ArrowDown/)
  const arrow = handler.slice(handler.indexOf('ArrowDown'), handler.indexOf('const k = e.key.toUpperCase()'))
  assert.doesNotMatch(arrow, /selectOption/)
  assert.match(block, /outline:\s*3px solid var\(--color-accent\);/)
  assert.doesNotMatch(block, /outline:\s*none/)
  assert.match(block, /\.practice-option\s*\{[^}]*min-height:\s*48px;/)
})
