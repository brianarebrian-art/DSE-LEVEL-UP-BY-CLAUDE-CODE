// Founder answers of 2026-10-03 to FOUNDER-QUEUE Q-T02, Q-T04, Q-T10, Q-T11, Q-T39.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (p: string) => readFileSync(p, 'utf8')

test('Q-T10: the practice header button reads 先做到呢度, not 今日夠了', () => {
  const s = read('components/PracticeSupport.tsx')
  assert.match(s, /\{en \? 'Stop here for now' : '先做到呢度'\}/)
  assert.doesNotMatch(s.replace(/^\s*(\/\/|\/\*\*|\*).*$/gm, ''), /'今日夠了/)
})
