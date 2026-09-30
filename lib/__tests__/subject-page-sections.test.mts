// Subject page: practice entries first, reference material folded (UX loop 6, 2026-09-30).
//
// At 375×812 the 2027 paper-structure section was 389px tall and pushed 按課題練習
// down to y=1270. It is reference material, not a way to practise, so it is now a
// <details> that starts closed. Its content (counts, papers, weights, source) is kept.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const src = readFileSync(join(ROOT, 'app/subjects/[subject]/SubjectDetailView.tsx'), 'utf8')
const code = src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '')

test('the paper structure is a closed <details> with a real heading in its summary', () => {
  const at = code.indexOf('{structure && (')
  const block = code.slice(at, code.indexOf('</details>', at))
  assert.match(block, /<details className="group mb-10/)
  assert.doesNotMatch(block, /<details[^>]*\bopen\b/, 'must start closed')
  assert.match(block, /<summary[^>]*min-h-12[^>]*>\s*<h2/)
  // Content that must survive the fold.
  for (const k of ['typeCounts.mc', 'structure.sections.map', 'structure.sbaPct', 'ExternalLinkGate']) assert.ok(block.includes(k), k)
})

test('practice entries come before the reference section', () => {
  const quick = code.indexOf('href={`/practice?subject=${meta.id}`}')
  const written = code.indexOf('href={`/practice?subject=${meta.id}&mode=long`}')
  const details = code.indexOf('<details className="group mb-10')
  const topics = code.indexOf('{sd.byTopic}')
  assert.ok(quick > 0 && written > 0 && details > 0 && topics > details)
  // Card order is decided in JSX by examHasMC; both cards render before the fold.
  assert.ok(code.indexOf('{examHasMC ? <>{mcCard}{writtenCard}</> : <>{writtenCard}{mcCard}</>}') < details)
})
