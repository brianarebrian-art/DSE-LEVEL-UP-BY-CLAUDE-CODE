// Option identity through the shuffle (lib/optionNotes.ts, 2026-09-29).
//
// 1. Shuffle regression: the same question shown 100 times in 100 orders; every time,
//    each note sits with the option it was written for (same optionId, same text).
// 2. Regression fixture (fixtures/rationale-option-mismatch.json): the BAFS question
//    whose explanation said 「第二項把期初與期末的加減調轉」. By stored order the second
//    option is the CORRECT answer; the option described is the swap. The reasoning
//    was right, the positional reference was wrong — shuffling or not.
// 3. Every question in any bank that has optionNotes gives each option one note and
//    uses no positional wording.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')
const pick = <T,>(m: T): T => ((m as { default?: T }).default ?? m)
const N = pick(await import('../optionNotes.ts'))
const I = pick(await import('../../data/questions/index.ts'))
const S = pick(await import('../../data/subjects.ts'))

// Same patterns as scripts/qbank/check-posref.mjs.
const POS_ZH = /第[一二三四]項(?!因素|變[項數]|憑證|獨立)/
const POS_EN = /\b[Tt]he (?:first|second|third|fourth) (?:option|distractor)s?\b|\boptions? [ABCD]\b/

/** Deterministic PRNG so a failure can be replayed (mulberry32). */
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const fixture = JSON.parse(read('lib/__tests__/fixtures/rationale-option-mismatch.json'))
const fx = fixture.question as { options: string[]; correctIndex: number; explanation: string }
const { opening, purchases, closing } = fixture.inputs as Record<string, number>
const money = (n: number) => `\\$${n}`

// The fixture question, repaired: each note names what that option's number came from.
const repairedNotes = [
  { optionId: fx.options.indexOf(money(purchases)), zh: '只計購貨，忽略了期初與期末存貨的變動。' },
  { optionId: fx.options.indexOf(money(opening + purchases - closing)), zh: '正確：期初存貨 + 購貨 − 期末存貨。' },
  { optionId: fx.options.indexOf(money(opening + purchases + closing)), zh: '把期末存貨加上去，等於把未賣出的貨也算作成本。' },
  { optionId: fx.options.indexOf(money(closing + purchases - opening)), zh: '把期初與期末存貨的加減調轉了。' },
]

test('fixture: the stored explanation uses the positional wording the gate forbids', () => {
  assert.match(fx.explanation, POS_ZH)
})

test('fixture: 「第二項」 by stored order is the correct answer, not the option it describes', () => {
  const second = fx.options[1]
  assert.equal(second, money(opening + purchases - closing), 'stored second option is the correct answer')
  assert.equal(fx.correctIndex, 1)
  // The sentence describes swapping opening and closing, which gives a different option.
  const swapped = money(closing + purchases - opening)
  assert.notEqual(second, swapped)
  assert.ok(fx.options.includes(swapped), 'the swap distractor exists, just not where the text points')
})

test('fixture, repaired: every option has one note, found by identity, each matching its own number', () => {
  assert.deepEqual(repairedNotes.map((n) => n.optionId).sort(), [0, 1, 2, 3])
  for (const n of repairedNotes) assert.doesNotMatch(n.zh, POS_ZH)
})

test('shuffle regression: 100 shuffles, every note stays with its own option', () => {
  const q = { options: fx.options, optionsEn: fx.options }
  const random = rng(20260929)
  const orders = new Set<string>()
  for (let run = 0; run < 100; run++) {
    const shown = N.displayOptions(q, random)
    orders.add(shown.map((o) => o.optionId).join(''))
    const rows = N.notesInDisplayOrder(repairedNotes, shown)
    assert.equal(rows.length, 4)
    rows.forEach(({ option, note }, pos) => {
      assert.equal(option, shown[pos], 'rows follow display order')
      assert.equal(note.optionId, option.optionId, `run ${run}: note attached to another option`)
      assert.equal(option.zh, fx.options[note.optionId], `run ${run}: option text drifted from its id`)
    })
  }
  assert.ok(orders.size > 10, `the shuffle actually varied (${orders.size} distinct orders)`)
})

test('a question without notes shows no note list', () => {
  const shown = N.displayOptions({ options: ['a', 'b', 'c', 'd'] })
  assert.deepEqual(N.notesInDisplayOrder(undefined, shown), [])
})

test('every question with optionNotes: one note per option, no positional wording', () => {
  let checked = 0
  for (const s of S.subjects) {
    for (const q of I.getSubjectQuestionsRaw(s.id)) {
      const notes = (q as { optionNotes?: { optionId: number; zh: string; en?: string }[] }).optionNotes
      if (!notes) continue
      checked++
      const opts = (q as { options: string[] }).options
      assert.deepEqual(notes.map((n) => n.optionId).sort((a, b) => a - b), opts.map((_, i) => i), q.id)
      for (const n of notes) {
        assert.doesNotMatch(n.zh, POS_ZH, `${q.id} note ${n.optionId}`)
        if (n.en) assert.doesNotMatch(n.en, POS_EN, `${q.id} note ${n.optionId}`)
      }
      for (const t of [(q as { explanation: string }).explanation]) assert.doesNotMatch(t, POS_ZH, q.id)
    }
  }
  assert.ok(checked >= 10, `expected the repaired batch to carry notes, found ${checked}`)
})

test('the practice screen keeps option identity and renders the notes', () => {
  const src = read('app/practice/PracticeSession.tsx')
  assert.match(src, /shuffledOptions: displayOptions\(q\)/)
  assert.equal((src.match(/<OptionNotes/g) ?? []).length, 2, 'both the right- and wrong-answer branches')
})
