// Positional option references, checked on the question objects themselves
// (Yuna 2026-09-29, decision ⑤).
//
// check-posref.mjs scans bank FILES and reads only double-quoted `explanation` fields,
// which covers the machine-written *-auto.ts banks. Hand-written banks use single quotes
// and template literals, so they were invisible to it (537 live hits on 2026-09-29).
// This test reads the loaded questions instead, with the same four patterns, and
// allows only what is on the grandfather list. New wording like 「最後一項」「A 選項」
// "the final option" cannot enter any bank again.
//
// Fourth decision (Yuna 2026-09-29), the two rules by name:
//   NEW_ITEM_GATE    a question outside the grandfather list may not refer to an option
//                    by position, in its explanation, its MC hack or its option notes.
//   LEGACY_BASELINE  the three grandfather lists can only shrink. Their sizes are pinned
//                    below; one entry more fails CI. When a question is fixed, remove it
//                    from the list and lower the number here in the same change.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')
const pick = <T,>(m: T): T => ((m as { default?: T }).default ?? m)
const I = pick(await import('../../data/questions/index.ts'))
const S = pick(await import('../../data/subjects.ts'))

// The patterns come from check-posref.mjs so the two checks cannot drift apart.
const gate = read('scripts/qbank/check-posref.mjs')
const pattern = (name: string): RegExp => {
  const src = gate.match(new RegExp(`const ${name} = \\/(.+)\\/([a-z]*)\\n`))
  assert.ok(src, `cannot read ${name} from check-posref.mjs`)
  return new RegExp(src![1], src![2])
}
const PATTERNS = ['ZH', 'EN', 'ZH_ORD', 'EN_ORD'].map(pattern)
const baseline = JSON.parse(read('scripts/qbank/posref-runtime-baseline.json')).grandfathered as Record<string, string[]>
const allowed = new Set(Object.values(baseline).flat())

function hits(text: string): boolean {
  return PATTERNS.some((re) => re.test(text))
}

type Q = { id: string; explanation?: string; explanationEn?: string; mcHack?: string; mcHackEn?: string; optionNotes?: { zh: string; en?: string }[] }
/** Every text a student reads after answering. */
const textsOf = (q: Q) => [q.explanation, q.explanationEn, q.mcHack, q.mcHackEn, ...(q.optionNotes ?? []).flatMap((n) => [n.zh, n.en])].filter((t): t is string => typeof t === 'string')

// LEGACY_BASELINE ceilings (2026-09-29). Lower, never raise.
const CEILING: Record<string, number> = {
  'scripts/qbank/posref-bank-baseline.json': 277,
  'scripts/qbank/posref-ordinal-baseline.json': 416,
  'scripts/qbank/posref-runtime-baseline.json': 758, // 838 → 800 → 758: M1-02 (38) and M1-03 (42) explanations rewritten (founders' replies 31-1c, 32a)
}

test('the ordinal and letter patterns catch what they are meant to', () => {
  for (const t of ['最後一項把係數之比倒轉', '第三個選項憑空發明', 'A 選項是正確的', 'The final option inverts the ratio', 'the last choice']) {
    assert.ok(hits(t), t)
  }
  for (const t of ['展開式的末項', '$P(A \\cap B)$', 'one option ignores the chain rule', '另一項把加減調轉']) {
    assert.ok(!hits(t), t)
  }
})

test('NEW_ITEM_GATE: no question outside the grandfather list refers to an option by position', () => {
  const fresh: string[] = []
  for (const s of S.subjects) {
    for (const q of I.getSubjectQuestionsRaw(s.id) as Q[]) {
      if (textsOf(q).some(hits) && !allowed.has(q.id)) fresh.push(`${s.id}/${q.id}`)
    }
  }
  assert.deepEqual(fresh, [], 'Quote the option, or use optionNotes. Do not add to the grandfather list.')
})

test('LEGACY_BASELINE: each grandfather list is exactly at its pinned ceiling', () => {
  for (const [file, ceiling] of Object.entries(CEILING)) {
    const b = JSON.parse(read(file)) as { total?: number; grandfathered: Record<string, string[]> }
    const n = Object.values(b.grandfathered).flat().length
    assert.ok(n <= ceiling, `${file}: ${n} entries, ceiling ${ceiling}. The list may not grow.`)
    assert.equal(n, ceiling, `${file} shrank to ${n}: lower its CEILING to ${n} in this file.`)
    if (b.total !== undefined) assert.equal(b.total, n, `${file}: total says ${b.total}, list has ${n}`)
  }
})

test('LEGACY_BASELINE: every runtime grandfather entry still has the wording (fixed ones are removed)', () => {
  // Without this, a fixed entry could be swapped for a new one and the count would not move.
  const stale: string[] = []
  for (const s of S.subjects) {
    const listed = new Set(baseline[s.id] ?? [])
    for (const q of I.getSubjectQuestionsRaw(s.id) as Q[]) {
      if (listed.has(q.id) && !textsOf(q).some(hits)) stale.push(`${s.id}/${q.id}`)
    }
  }
  assert.deepEqual(stale, [], 'Remove these from posref-runtime-baseline.json and lower its CEILING.')
})

test('negative self-test: the gate rejects each wording the decision lists', () => {
  for (const t of ['第一項把次序倒轉', '第二項漏了稅', '最後一項用了相減', '第三個選項憑空發明', 'A 選項忽略了成本', 'The B option ignores tax', 'the final option inverts it']) {
    assert.ok(hits(t), t)
  }
  assert.ok(!hits('Make a choice and answer a question.'), 'lower-case "a choice" is not an option letter')
})
