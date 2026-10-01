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
    // R2-11 (2026-10-01): the old check accepted any file directly in data/, because the
    // record mentions "data/" everywhere. A directory counts only when it is listed as
    // its own entry, in backticks, and is not data/ itself.
    const dir = dirname(rel)
    const listed = doc.includes(`\`${rel}\``) || (dir !== 'data' && doc.includes(`\`${dir}/\``))
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
  // Refinement loop 2 (prompt §22): no legal-status words at all, unless a legal document
  // in the repo backs them. There is none.
  assert.doesNotMatch(doc, /\blegal(ly)?\b|\bcomplian(t|ce)\b|\blicen[cs]ed\b|\bpermitted\b|合法|合規|獲准/i)
})

// Refinement loop 2 (2026-09-30; prompt §22): code that reads an HKEAA-derived data file
// must be listed in §3.1, and any extraction script named after the HKEAA in §3.
const DERIVED = ['dse-2025-level-distribution', 'dse-level-drift', 'dse-paper-formats']
function codeFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f)
    if (f === '__tests__' || f === 'node_modules' || f.startsWith('.')) return []
    return statSync(p).isDirectory() ? codeFiles(p) : /\.(ts|tsx|mts|mjs|py)$/.test(f) ? [p] : []
  })
}

test('every file that reads an HKEAA-derived data file is listed', () => {
  const importRe = new RegExp(`(from|import)\\s+[^\\n]*['"][^'"]*(${DERIVED.join('|')})(\\.json|\\.ts)?['"]`)
  const missing: string[] = []
  for (const d of ['app', 'components', 'lib', 'scripts']) {
    for (const abs of codeFiles(join(ROOT, d))) {
      const rel = relative(ROOT, abs)
      const src = readFileSync(abs, 'utf8')
      const reads = importRe.test(src) || (/hkeaa/i.test(rel) && /\.py$/.test(rel))
      if (reads && !doc.includes(`\`${rel}\``)) missing.push(rel)
    }
  }
  assert.deepEqual(missing, [], 'add these to CONTENT_PROVENANCE.md §3 / §3.1')
})

test('negative self-test: the import scan recognises the forms used in the repo', () => {
  const importRe = new RegExp(`(from|import)\\s+[^\\n]*['"][^'"]*(${DERIVED.join('|')})(\\.json|\\.ts)?['"]`)
  assert.ok(importRe.test("import raw from '@/data/dse-level-drift.json'"))
  assert.ok(importRe.test("import { getPaperFormat } from '../../data/dse-paper-formats.ts'"))
  assert.ok(!importRe.test('// see data/dse-paper-formats.ts'))
})

test('the record points to the single count source instead of copying numbers', () => {
  assert.match(doc, /`CONTENT_STATS`/)
  assert.doesNotMatch(doc, /\b\d{1,2},\d{3}\b/, 'no copied question counts')
})
