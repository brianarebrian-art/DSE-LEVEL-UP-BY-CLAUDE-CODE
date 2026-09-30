// The result page describes this session's practice, not the student's true level, and
// says it is not an HKEAA grade prediction (UX loop 42, 2026-09-30; hardening prompt §6, §28;
// refinement loop 2).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const dict = readFileSync('lib/dictionary.ts', 'utf8').replace(/^\s*\/\/.*$/gm, '')

test('no claim about the student\'s true level from one session', () => {
  assert.doesNotMatch(dict, /真實水平|你嘅水平指向|your true level|your level points to/)
})

// Refinement loop 2 (2026-09-30) removed the level range; the band note and the page
// disclaimer now carry the "not an HKEAA result" message.
test('the result page says it is not an HKEAA result or prediction, in both languages', () => {
  assert.match(dict, /disclaimer: '本網站的練習表現指標只反映本站練習數據，並不是 HKEAA 官方成績或預測。'/)
  assert.match(dict, /disclaimer: 'Performance on this site reflects practice here only\. It is not an HKEAA result or a prediction of one\.'/)
  assert.match(dict, /bandNote: '只反映今次呢一節練習，唔係 DSE 等級，亦唔代表你已經掌握。'/)
})

test('the result page has one h1', () => {
  const src = readFileSync('app/result/ResultPageClient.tsx', 'utf8')
  assert.match(src, /<h1 className="mb-2 text-sm font-medium text-ink-muted">\{locale === 'en' \? 'Practice result' : '練習結果'\}<\/h1>/)
})
