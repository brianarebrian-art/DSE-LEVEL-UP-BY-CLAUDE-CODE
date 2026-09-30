// Practice page at 1024px and wider: question and feedback side by side (UX loop 8, 2026-09-30).
//
// Measured at 1024×768 before: the question card used the middle 672px with about
// 170px empty on each side, and after an answer the feedback started at y=668 with
// 下一題 at y=1171. Below 1024px the page stays one column, unchanged.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const src = readFileSync(join(ROOT, 'app/practice/PracticeSession.tsx'), 'utf8')
const code = src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '')

const gridAt = code.indexOf('<div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:max-xl:pr-14">')
const cardAt = code.indexOf('<div key={currentQ.id} className="bg-surface-raised')
const feedbackAt = code.indexOf('<div ref={feedbackRef}')
// 2026-09-30 (loop 19): the bottom score dots moved to the top status strip, so the
// grid is now followed directly by the emotion check-in; anchor on that instead.
const afterGridAt = code.indexOf('{emoOpen && <EmotionThermometer')

test('the question card and the feedback share one two-column grid from lg up', () => {
  assert.ok(gridAt > 0, 'grid wrapper')
  assert.ok(gridAt < cardAt && cardAt < feedbackAt, 'card then feedback inside the grid')
  // The grid closes before the emotion check-in that follows the session.
  assert.ok(afterGridAt > feedbackAt)
  const closeAt = code.lastIndexOf('</div>', afterGridAt)
  assert.ok(feedbackAt < closeAt)
  assert.match(code, /<div className="max-w-2xl mx-auto lg:max-w-6xl">/)
})

test('below lg nothing changes: every layout class on the wrapper is lg-prefixed', () => {
  const cls = code.slice(gridAt).match(/className="([^"]+)"/)![1]
  for (const c of cls.split(/\s+/)) assert.match(c, /^lg:/, c)
})

test('before an answer the right column explains itself instead of sitting empty, on lg only', () => {
  const hint = code.slice(code.indexOf('{answerState === null && (', feedbackAt), afterGridAt)
  assert.match(hint, /className="focus-dim hidden lg:block/)
  assert.match(hint, /揀咗答案之後/)
})
