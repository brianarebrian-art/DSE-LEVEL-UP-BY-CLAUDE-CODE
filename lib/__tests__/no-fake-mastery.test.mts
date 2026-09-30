// No invented mastery numbers (UX loop 41, 2026-09-30; hardening prompt §41, charter §8).
// DailySpectrum said 「掌握度 +1」 when the day's 3:5:2 mix was done; nothing on the site
// holds a mastery value that goes up by one.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('the spectrum completion message makes no mastery claim', () => {
  const src = readFileSync('components/DailySpectrum.tsx', 'utf8').replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  assert.doesNotMatch(src, /掌握度 \+1|mastery \+1/)
  assert.match(src, /今日光譜完成/)
})

test('topic rings still flag thin samples', () => {
  const ring = readFileSync('components/MasteryRing.tsx', 'utf8')
  assert.match(ring, /const thin = safeTotal < MIN_CONFIDENT_SAMPLE/)
})
