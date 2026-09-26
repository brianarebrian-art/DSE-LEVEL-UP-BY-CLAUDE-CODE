// Level bands per difficulty tier (lib/difficulty.ts TIER_LEVEL_BANDS).
//
// Decisions (Yuna, 2026-09-26): keep the existing 2–3 / 4 / 5+ mapping, show it
// on the result page only, say that it is the platform's estimate and not an
// HKEAA standard (charter §8), and never show it for Citizenship and Social
// Development, which has no levels.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = join(import.meta.dirname, '..', '..')
const ns: any = await import('../difficulty.ts')
const { TIER_LEVEL_BANDS } = ns.default?.TIER_LEVEL_BANDS ? ns.default : ns
const RESULT = 'app/result/ResultPageClient.tsx'
const result = readFileSync(join(ROOT, RESULT), 'utf8')

test('the three bands are 2–3, 4 and 5 or above', () => {
  assert.deepEqual(Object.keys(TIER_LEVEL_BANDS).sort(), ['easy', 'hard', 'medium'])
  assert.match(TIER_LEVEL_BANDS.easy.zh, /2–3 級/)
  assert.match(TIER_LEVEL_BANDS.medium.zh, /4 級/)
  assert.match(TIER_LEVEL_BANDS.hard.zh, /5 級或以上/)
  for (const b of Object.values<{ zh: string; en: string }>(TIER_LEVEL_BANDS)) assert.ok(b.en.length > 0, 'English label missing')
})

test('the bands appear on the result page and nowhere else', () => {
  const users: string[] = []
  const walk = (dir: string) => {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f)
      if (f === '__tests__' || f === 'node_modules') continue
      if (statSync(p).isDirectory()) walk(p)
      else if (/\.(ts|tsx)$/.test(f) && readFileSync(p, 'utf8').includes('TIER_LEVEL_BANDS')) users.push(relative(ROOT, p))
    }
  }
  for (const d of ['app', 'components', 'lib']) walk(join(ROOT, d))
  assert.deepEqual(users.sort(), ['lib/difficulty.ts', RESULT].sort())
})

test('the result page says the bands are an estimate, not an HKEAA standard', () => {
  assert.ok(result.includes('並非考評局標準'), 'Chinese disclosure missing')
  assert.ok(result.includes('not an HKEAA standard'), 'English disclosure missing')
})

test('Citizenship and Social Development never shows a band', () => {
  const def = result.match(/const bandTiers = ([\s\S]*?)\n\s*: \[\]/)
  assert.ok(def, 'bandTiers definition not found')
  assert.match(def[1], /!isBinaryGrade/)
  assert.match(def[1], /subjectId !== 'csd'/)
  assert.match(result, /\{bandTiers\.length > 0 && \(/, 'the section must render only when bandTiers has rows')
})
