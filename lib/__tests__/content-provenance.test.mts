// CONTENT_PROVENANCE.md records every data source that refers to the HKEAA
// (UX loop 23, 2026-09-30; hardening prompt §31).
//
// The record only helps if it stays complete: a new data file that mentions the HKEAA
// must be listed there (source, acquisition, transformation, permission, review state)
// before it ships. The document must never claim legal clearance or HKEAA permission.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const doc = readFileSync(join(ROOT, 'CONTENT_PROVENANCE.md'), 'utf8')

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    if (f === 'questions' || f === '__tests__') return []
    return statSync(p).isDirectory() ? walk(p) : /\.(ts|json)$/.test(f) ? [p] : []
  })
}

test('every data file that mentions the HKEAA is listed', () => {
  const missing: string[] = []
  for (const abs of walk(join(ROOT, 'data'))) {
    if (!/HKEAA|考評局|hkeaa/.test(readFileSync(abs, 'utf8'))) continue
    const rel = relative(ROOT, abs)
    const listed = doc.includes(rel) || doc.includes(`${dirname(rel)}/`)
    if (!listed) missing.push(rel)
  }
  assert.deepEqual(missing, [], 'add a row to CONTENT_PROVENANCE.md')
  // Both statistics files feed MasteryEstimate; the drift file names the HKEAA only in its source PDF.
  for (const f of ['data/dse-2025-level-distribution.json', 'data/dse-level-drift.json', 'data/dse-paper-formats.ts']) {
    assert.ok(doc.includes(f), f)
  }
})

test('the record claims no legal clearance and no HKEAA permission', () => {
  assert.match(doc, /不是法律意見，亦不聲稱任何內容「法律上沒有問題」/)
  assert.match(doc, /沒有取得香港考試及評核局（考評局）或教育局的任何授權、認可或背書/)
  assert.doesNotMatch(doc, /已獲授權|獲考評局授權|licensed by the HKEAA|legally cleared|完全合法/)
})

test('the record points to the single count source instead of copying numbers', () => {
  assert.match(doc, /`CONTENT_STATS`/)
  assert.doesNotMatch(doc, /\b\d{1,2},\d{3}\b/, 'no copied question counts')
})
