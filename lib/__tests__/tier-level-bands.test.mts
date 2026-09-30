// Level bands per difficulty tier (was lib/difficulty.ts TIER_LEVEL_BANDS).
//
// History: Yuna 2026-09-26 put "about Level 2–3 / 4 / 5+" beside each difficulty tier on
// the result page. Refinement loop 2 (2026-09-30, prompt §3–§4) removed every DSE level
// from the result page, and the bands with it. The difficulty labels behind them were
// never calibrated (the three tiers were statistically indistinguishable on 2026-09-10).

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = join(import.meta.dirname, '..', '..')

test('no code maps a difficulty tier to a DSE level any more', () => {
  const users: string[] = []
  const walk = (dir: string) => {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f)
      if (f === '__tests__' || f === 'node_modules') continue
      if (statSync(p).isDirectory()) walk(p)
      else if (/\.(ts|tsx)$/.test(f)) {
        const code = readFileSync(p, 'utf8').replace(/^\s*\/\/.*$/gm, '')
        if (/TIER_LEVEL_BANDS|約 2–3 級|about Level 2–3/.test(code)) users.push(relative(ROOT, p))
      }
    }
  }
  for (const d of ['app', 'components', 'lib']) walk(join(ROOT, d))
  assert.deepEqual(users, [])
})

test('the result page has no per-tier level section', () => {
  const result = readFileSync(join(ROOT, 'app/result/ResultPageClient.tsx'), 'utf8')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/^\s*\/\/.*$/gm, '')
  assert.doesNotMatch(result, /bandTiers|並非考評局標準|本節分層表現/)
})
