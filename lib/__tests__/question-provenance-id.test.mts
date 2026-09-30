// Question provenance shows only what the records hold (UX loop 12, P1-G, 2026-09-30).
//
// Each question has an ID; the records do not hold a per-question syllabus year or
// revision date. The disclosure shows the ID and the transparency page says the
// other two are not recorded, instead of inventing them.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')
const pick = <T,>(m: T): T => ((m as { default?: T }).default ?? m)
const T = pick(await import('../../data/questions/types.ts'))

test('the disclosure shows the question ID, the same one the report carries', () => {
  const src = read('components/QuestionProvenance.tsx')
  assert.match(src, /\{en \? 'Question ID ' : '題號 '\}\s*<span className="font-mono select-all text-ink-soft">\{questionId\}<\/span>/)
  assert.match(read('components/ReportQuestionButton.tsx'), /題號：\$\{questionId\}/)
})

test('no syllabus year, revision date or reviewer is shown, because none is recorded per question', () => {
  const code = read('components/QuestionProvenance.tsx').replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/^\s*\/\/.*$/gm, '')
  assert.doesNotMatch(code, /課綱年份|修訂日期|syllabus year|revised on|reviewed by|覆核人/i)
})

test('the question type has no per-question syllabus or revision field to show', () => {
  const types = read('data/questions/types.ts')
  assert.doesNotMatch(types, /syllabusYear|syllabusVersion|revisedAt|updatedAt|lastReviewed/, 'a new field exists: show it in QuestionProvenance and update /transparency')
  assert.ok(T, 'types module loads')
})

test('the transparency page says both are not recorded', () => {
  const page = read('app/transparency/TransparencyClient.tsx')
  assert.match(page, /題目紀錄冇逐題記低對照邊一年嘅課綱、幾時最後修訂/)
  assert.match(page, /do not store, question by question, which syllabus year/)
})
