// Practice status strip for questions 1–10 (UX loop 19; Yuna decision 2, 2026-09-30).
//
// Decision 2 chose display only: students see where they are and how each answered
// question went, but cannot jump; answering stays forward-only.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')
const mod: any = await import('../questionStatus.ts')
const QS = mod.default?.questionStatuses ? mod.default : mod

const ok = { isCorrect: true }
const miss = { isCorrect: false }

test('one status per question: answered by result, then current, then not yet', () => {
  assert.deepEqual(QS.questionStatuses(5, [ok, miss], 2), ['correct', 'blindSpot', 'current', 'todo', 'todo'])
  assert.deepEqual(QS.questionStatuses(3, [], 0), ['current', 'todo', 'todo'])
  assert.deepEqual(QS.questionStatuses(3, [ok, ok, miss], 2), ['correct', 'correct', 'blindSpot'])
  assert.deepEqual(QS.questionStatuses(0, [], 0), [])
  // A null slot (no answer recorded) never counts as answered.
  assert.deepEqual(QS.questionStatuses(2, [null], 1), ['todo', 'current'])
  const input = [ok]
  QS.questionStatuses(2, input, 1)
  assert.deepEqual(input, [ok], 'input unchanged')
})

test('labels name a blind spot, never a verdict', () => {
  const L = QS.QUESTION_STATUS_LABEL
  assert.equal(L.blindSpot.zh, '發現盲點')
  for (const k of Object.keys(L)) {
    assert.doesNotMatch(L[k].zh, /錯|失敗/)
    assert.doesNotMatch(L[k].en, /wrong|fail/i)
  }
})

test('the progress bar cannot jump between questions', () => {
  const src = read('app/practice/PracticeSession.tsx')
  const bar = src.slice(src.indexOf('role="progressbar"'), src.indexOf('role="progressbar"') + 700)
  assert.match(bar, /aria-valuemin=\{0\}/)
  assert.match(bar, /aria-valuemax=\{totalQ\}/)
  assert.doesNotMatch(bar, /<button|<Link|<a\s|onClick|href=/)
})

test('a miss is not drawn in red on the practice page', () => {
  const src = read('app/practice/PracticeSession.tsx')
  assert.match(src, /border-gold/)
  assert.doesNotMatch(src, /rose|bg-red-|text-red-|danger/)
})

test('the practice page shows one continuous bar above the question and cannot jump', () => {
  const src = read('app/practice/PracticeSession.tsx')
  const code = src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  const bar = code.indexOf('role="progressbar"')
  const grid = code.indexOf('<div className="lg:grid lg:grid-cols-2')
  assert.ok(bar > 0 && bar < grid, 'above the question')
  assert.match(code, /第 \{n\} \/ \{total\} 題|t\.practice\.progress/)
  assert.doesNotMatch(code, /<QuestionStatusStrip/)
  assert.doesNotMatch(code, /上一題/)
  assert.doesNotMatch(code, /setCurrent\([^)]*\)[\s\S]{0,80}progressbar/)
})
