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

test('the strip cannot be clicked: a plain list with no buttons, links or handlers', () => {
  const src = read('components/QuestionStatusStrip.tsx')
  assert.match(src, /<ol aria-label=\{en \? 'Question status' : '各題狀態'\}/)
  assert.match(src, /aria-current=\{i === current \? 'step' : undefined\}/)
  assert.match(src, /className="sr-only">\{en \? `Question \$\{i \+ 1\}: \$\{label\}` : `第 \$\{i \+ 1\} 題：\$\{label\}`\}/)
  assert.doesNotMatch(src, /<button|<Link|<a\s|onClick|href=|tabIndex|role="button"/)
})

test('correct and blind spot differ by more than colour', () => {
  const src = read('components/QuestionStatusStrip.tsx')
  const style = (k: string) => src.match(new RegExp(`${k}: '([^']+)'`))![1].split(' ')
  assert.ok(style('blindSpot').includes('border-dashed'))
  assert.ok(!style('correct').includes('border-dashed'))
  assert.ok(!style('blindSpot').some((c) => /red|danger/.test(c)), 'no red for a blind spot')
})

test('the practice page shows the strip at the top and drops the old bar and dots', () => {
  const src = read('app/practice/PracticeSession.tsx')
  const code = src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  const strip = code.indexOf('<QuestionStatusStrip statuses={questionStatuses(totalQ, answers, current)} current={current}')
  const grid = code.indexOf('<div className="lg:grid lg:grid-cols-2')
  assert.ok(strip > 0 && strip < grid, 'above the question')
  assert.doesNotMatch(code, /Array\.from\(\{ length: totalQ \}\)/, 'bottom dots removed')
  assert.doesNotMatch(code, /style=\{\{ width: `\$\{progress\}%` \}\}/, 'thin bar removed')
  // Moving between questions still only happens through next(): the strip gets no setter.
  assert.doesNotMatch(code, /<QuestionStatusStrip[^>]*setCurrent/)
})
