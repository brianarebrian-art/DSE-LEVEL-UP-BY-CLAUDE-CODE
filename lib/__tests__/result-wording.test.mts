// The result page describes this session's practice, not the student's true level, and
// says it is not an HKEAA grade prediction (UX loop 42, 2026-09-30; hardening prompt §6, §28).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const dict = readFileSync('lib/dictionary.ts', 'utf8').replace(/^\s*\/\/.*$/gm, '')

test('no claim about the student\'s true level from one session', () => {
  assert.doesNotMatch(dict, /真實水平|你嘅水平指向|your true level|your level points to/)
  assert.match(dict, /rangeSpan: '以呢 \{n\} 題計，考慮到樣本細，你今次嘅練習表現大約對應 Level \{low\} 至 \{high\}。'/)
})

test('the range box says it is not an HKEAA grade prediction, in both languages', () => {
  assert.match(dict, /cutoffOrigin: '呢個係本站練習數據嘅學習指標，唔係考評局成績預測。/)
  assert.match(dict, /cutoffOrigin: 'This is a learning indicator from practice on this site, not an HKEAA grade prediction\./)
})

test('the result page has one h1', () => {
  const src = readFileSync('app/result/ResultPageClient.tsx', 'utf8')
  assert.match(src, /<h1 className="mb-2 text-sm font-medium text-ink-muted">\{locale === 'en' \? 'Practice result' : '練習結果'\}<\/h1>/)
})
