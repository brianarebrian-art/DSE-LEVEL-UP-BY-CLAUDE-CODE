// audit loop T08 (2026-10-02): while the question bank loads, the practice page shows
// visible text in a polite live region, not only a sr-only "loading".
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const s = readFileSync('app/practice/PracticeGate.tsx', 'utf8')

test('the loading state says what is being prepared and is announced politely', () => {
  assert.match(s, /<p role="status" aria-live="polite"/)
  assert.match(s, /`正在準備你嘅 \$\{SESSION_SIZE\} 條練習題…`/)
  assert.match(s, /loading: \(\) => <Loading kind="mc" \/>/)
  assert.match(s, /if \(scopedMc === null\) return <Loading kind="mc" \/>/)
})
