// Subject search with the names students actually type (UX loop 9, 2026-09-30;
// lib/subjectSearch.ts). Every case below was measured against the old search.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const pick = <T,>(m: T): T => ((m as { default?: T }).default ?? m)
const Q = pick(await import('../subjectSearch.ts'))
const S = pick(await import('../../data/subjects.ts'))
const first = (q: string) => Q.searchSubjects(S.subjects, q)[0]?.id

test('old names and short forms that found nothing now find the subject', () => {
  // Before: no result for any of these.
  assert.equal(first('通識'), 'csd')
  assert.equal(first('Liberal Studies'), 'csd')
  assert.equal(first('電腦'), 'ict')
  assert.equal(first('家政'), 'technology-living')
  assert.equal(first('TL'), 'technology-living')
})

test('a wrong top match is corrected', () => {
  assert.equal(first('LS'), 'csd') // before: Mathematics only
})

test('an exact short name or alias comes first among fuzzy matches', () => {
  assert.equal(first('ICT'), 'ict') // before: listed after M2 and M1
  assert.equal(first('eng'), 'english')
  assert.equal(first('Chem'), 'chemistry')
  assert.equal(first('phy'), 'physics')
  assert.equal(first('中文'), 'chinese')
  assert.equal(first('英文'), 'english')
  assert.equal(first('數學'), 'math')
  assert.equal(first('M2'), 'm2')
})

test('typo tolerance still works', () => {
  assert.equal(first('數学'), 'math') // simplified 学
  assert.equal(first('economcs'), 'economics')
})

test('an empty query keeps every subject in the default order', () => {
  assert.deepEqual(Q.searchSubjects(S.subjects, '  ').map((s) => s.id), S.subjects.map((s) => s.id))
})

test('every alias belongs to a real subject and none is shared between subjects', () => {
  const ids = new Set(S.subjects.map((s) => s.id))
  const seen = new Map<string, string>()
  for (const [id, aliases] of Object.entries(Q.SUBJECT_ALIASES)) {
    assert.ok(ids.has(id), `unknown subject ${id}`)
    for (const a of aliases) {
      const key = a.toLowerCase()
      assert.ok(!seen.has(key), `${a} used by ${seen.get(key)} and ${id}`)
      seen.set(key, id)
    }
  }
})

test('the subjects page uses this search, not a second copy of the matching rule', () => {
  const view = readFileSync(join(ROOT, 'app/subjects/SubjectsView.tsx'), 'utf8')
  assert.match(view, /searchSubjects\(subjects, q\)/)
  assert.doesNotMatch(view, /bestSimilarity\(/)
})

test('the search box and the sort menu have accessible names, not just a placeholder', () => {
  const view = readFileSync(join(ROOT, 'app/subjects/SubjectsView.tsx'), 'utf8')
  assert.match(view, /type="search"\s+aria-label=\{en \? 'Search subjects/)
  assert.match(view, /<select\s+aria-label=\{en \? 'Sort subjects' : '科目排序'\}/)
})
