// The three kinds of fault found in batch M1-01, kept as permanent regression cases
// (Yuna 2026-09-29, decision ⑥). Fixture: fixtures/m1-01-regressions.json holds each
// question as it was before the repair; the tests check both that the old text shows
// the fault and that the repaired question in the bank does not.
//
//   A  option / rationale mismatch   (m1_rep_0002)
//   B  presentation: "x^{1}"         (m1_rep_0004, and every question with notes)
//   C  misconception wording         (m1_rep_0007)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const fx = JSON.parse(readFileSync(join(ROOT, 'lib/__tests__/fixtures/m1-01-regressions.json'), 'utf8'))
const pick = <T,>(m: T): T => ((m as { default?: T }).default ?? m)
const I = pick(await import('../../data/questions/index.ts'))
const S = pick(await import('../../data/subjects.ts'))

type Q = { id: string; options: string[]; correctIndex: number; explanation: string; explanationEn?: string; optionNotes?: { optionId: number; zh: string; en?: string }[] }
const bank = new Map(I.getSubjectQuestionsRaw('m1').map((q) => [q.id, q as unknown as Q]))
const X1 = /x\^\{1\}(?!\d)/

test('A (before): the explanation names "the first distractor" as multiplication, but that is not where it is', () => {
  const b = fx.caseA_optionRationaleMismatch.before as Q
  assert.match(b.explanation, /第一個干擾項把兩個導數【直接相乘】/)
  const distractors = b.options.map((o, i) => ({ o, i })).filter((d) => d.i !== b.correctIndex)
  const multiplied = b.options.findIndex((o) => /^\$\d+x\^\{1\} \\cos 3x\$$/.test(o)) // a single term: the product of derivatives
  assert.ok(multiplied >= 0)
  assert.notEqual(distractors[0].i, multiplied, 'the first stored distractor is not the multiplied one')
})

test('A (after): each note sits on the option it describes, with no ordinal wording', () => {
  const q = bank.get('m1_rep_0002')!
  assert.ok(q.optionNotes)
  const noteOn = (text: RegExp) => q.optionNotes!.find((n) => text.test(q.options[n.optionId]))!
  assert.match(noteOn(/^\$6x \\cos 3x\$$/).zh, /直接相乘/)
  assert.match(noteOn(/^\$2x \\cos 3x \+ 3x\^\{2\} \\sin 3x\$$/).zh, /放錯了位置/)
  assert.match(noteOn(/^\$2x \\sin 3x \+ x\^\{2\} \\cos 3x\$$/).zh, /漏了鏈式法則帶出的因子/)
  for (const t of [q.explanation, ...q.optionNotes!.map((n) => n.zh)]) {
    assert.doesNotMatch(t, /第[一二三四]個干擾項|第[一二三四]項|最後一項/)
  }
})

test('B (before): "x^{1}" appeared in the options', () => {
  const b = fx.caseB_presentationNormalisation.before as Q
  assert.ok(b.options.some((o) => X1.test(o)))
})

test('B (after): no question with option notes prints "x^{1}" anywhere', () => {
  let checked = 0
  for (const s of S.subjects) {
    for (const raw of I.getSubjectQuestionsRaw(s.id)) {
      const q = raw as unknown as Q
      if (!q.optionNotes) continue
      checked++
      const texts = [...q.options, q.explanation, q.explanationEn ?? '', ...q.optionNotes.flatMap((n) => [n.zh, n.en ?? ''])]
      for (const t of texts) assert.doesNotMatch(t, X1, `${q.id}: ${t.slice(0, 50)}`)
    }
  }
  assert.ok(checked >= 10)
})

test('C (before): distractor k was misdiagnosed as "treating the expression as linear"', () => {
  const b = fx.caseC_misconceptionWording.before as Q
  assert.match(b.explanation, /當成一次函數/)
  assert.doesNotMatch(b.explanation, /u'\s*\}\s*\{\s*v'|\\dfrac\{u'\}\{v'\}/, 'the u\'/v\' error was never named')
})

test('C (after): the note names u\'/v\' as the error and says it is wrong; the explanation states the real rule', () => {
  const q = bank.get('m1_rep_0007')!
  const k = q.options.findIndex((o) => o === '$3$')
  assert.ok(k >= 0 && k !== q.correctIndex, 'k is a distractor')
  const note = q.optionNotes!.find((n) => n.optionId === k)!
  assert.match(note.zh, /\\dfrac\{u'\}\{v'\}/, 'names the misconception u\'/v\'')
  assert.match(note.zh, /並不等於/, 'says it is wrong')
  assert.match(note.en ?? '', /is not the quotient of the derivatives/)
  assert.match(q.explanation, /\\dfrac\{u'v - uv'\}\{v\^\{2\}\}/, 'the explanation gives the actual quotient rule')
  const correct = q.optionNotes!.find((n) => n.optionId === q.correctIndex)!
  assert.doesNotMatch(correct.zh, /u'\}\{v'\}/, 'the correct option is not explained with the misconception')
})
