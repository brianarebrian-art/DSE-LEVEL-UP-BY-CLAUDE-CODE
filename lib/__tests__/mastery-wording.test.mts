// "Mastered" is only said when evidence supports it, and it never does from a handful of
// answers or a self-rating (refinement loop 2, 2026-09-30; prompt §32, §35, §41).
// The brand line 掌握邏輯，唔係背答案 (charter §9) is a slogan about the method, not a
// judgement of a student, and stays.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const strip = (s: string) =>
  s.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"])\/\/.*$/gm, '$1')

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    if (f === '__tests__' || f === 'node_modules') return []
    return statSync(p).isDirectory() ? files(p) : /\.tsx?$/.test(f) ? [p] : []
  })
}

test('no UI string tells a student they have mastered something', () => {
  const bad: string[] = []
  // Judgements about the student: 你掌握 / 掌握度 / 已經掌握 / 我掌握到, "you've got this locked in", "mastery" as a label.
  const judgement = /你掌握|我掌握到|未掌握到|掌握度|掌握得好穩|Topic mastery|topic mastery|becomes mastery|\blocked in\b|精通/
  for (const d of ['app', 'components']) {
    for (const f of files(d)) {
      const s = strip(readFileSync(f, 'utf8'))
      if (judgement.test(s)) bad.push(f)
    }
  }
  assert.deepEqual(bad, [])
})

test('written self-check wording is the same on every written-answer entry point', () => {
  const text = strip(readFileSync('components/TextQuestionCard.tsx', 'utf8'))
  const long = strip(readFileSync('components/LongQuestionCard.tsx', 'utf8'))
  assert.match(text, /大致對到/)
  assert.match(text, /未對到/)
  assert.match(long, /大致對到/)
  assert.match(long, /未對到/)
})

test('brand names are secondary labels, never the feature name on their own', () => {
  const subject = strip(readFileSync('app/subjects/[subject]/SubjectDetailView.tsx', 'utf8'))
  assert.match(subject, /知識卡・SENSEI/)
  assert.doesNotMatch(subject, /'SENSEI・概念檢索'/)
  assert.doesNotMatch(strip(readFileSync('app/answer-sheet/page.tsx', 'utf8')), /「紙筆戰士」/)
})
