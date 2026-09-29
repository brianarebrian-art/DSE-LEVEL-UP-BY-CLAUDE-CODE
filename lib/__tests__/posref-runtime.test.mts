// Positional option references, checked on the question objects themselves
// (Yuna 2026-09-29, decision ⑤).
//
// check-posref.mjs scans bank FILES and reads only double-quoted `explanation` fields,
// which covers the machine-written *-auto.ts banks. Hand-written banks use single quotes
// and template literals, so they were invisible to it (537 live hits on 2026-09-29).
// This test reads the loaded questions instead, with the same four patterns, and
// allows only what is on the grandfather list. New wording like 「最後一項」「A 選項」
// "the final option" cannot enter any bank again.
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

test('the ordinal and letter patterns catch what they are meant to', () => {
  for (const t of ['最後一項把係數之比倒轉', '第三個選項憑空發明', 'A 選項是正確的', 'The final option inverts the ratio', 'the last choice']) {
    assert.ok(hits(t), t)
  }
  for (const t of ['展開式的末項', '$P(A \\cap B)$', 'one option ignores the chain rule', '另一項把加減調轉']) {
    assert.ok(!hits(t), t)
  }
})

test('no question outside the grandfather list refers to an option by position', () => {
  const fresh: string[] = []
  for (const s of S.subjects) {
    for (const q of I.getSubjectQuestionsRaw(s.id)) {
      const texts = [(q as { explanation?: string }).explanation ?? '', (q as { explanationEn?: string }).explanationEn ?? '']
      if (texts.some(hits) && !allowed.has(q.id)) fresh.push(`${s.id}/${q.id}`)
    }
  }
  assert.deepEqual(fresh, [], 'Quote the option, or use optionNotes. Do not add to the grandfather list.')
})
