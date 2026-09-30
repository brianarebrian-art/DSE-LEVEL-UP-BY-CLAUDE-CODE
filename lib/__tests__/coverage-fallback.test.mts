// Subject coverage wording without per-subject assessment metadata
// (refinement loop 2, 2026-09-30; prompt §15–§16, ASSESSMENT_METADATA_DEFERRED).
// Not every subject has an oral or a practical, and the site has no reliable
// per-subject component data, so it neither says "complete" nor "not covered" per item.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const code = (p: string) =>
  readFileSync(p, 'utf8').replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

test('subject cards and summaries use the neutral fallback', () => {
  const cards = code('app/subjects/SubjectsView.tsx')
  assert.match(cards, /部分考核形式未於本站提供/)
  assert.match(cards, /Some assessment components are not offered here/)
  for (const f of ['app/subjects/SubjectsView.tsx', 'app/subjects/page.tsx', 'lib/dictionary.ts']) {
    const s = code(f)
    assert.doesNotMatch(s, /口試、實作：未涵蓋|書寫、口試同實作題型未涵蓋|書寫、口試及實作題型暫未涵蓋|oral \/ practical: not covered/, f)
    assert.doesNotMatch(s, /✅\s*完整|全面覆蓋|fully covered/i, f)
  }
})
