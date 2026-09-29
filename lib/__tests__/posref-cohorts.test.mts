// Positional wording, fourth decision (Yuna 2026-09-29; docs/rationale-repairs.md §七).
//
//   ① the 135 machine-generated candidates are withdrawn
//   ② the total is a union of question ids, checked here from the sources
//   ③–⑥ the 537 hand-written candidates are classified: A withdrawn, B kept,
//       C left live in a review queue
//
// "A regex hit is not a content bug": the classifier decides from the question's
// structure, and these tests pin what it must and must not call an option reference.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')
const json = (p: string) => JSON.parse(read(p))
const pick = <T,>(m: T): T => ((m as { default?: T }).default ?? m)
const I = pick(await import('../../data/questions/index.ts'))
const C = pick(await import('../../scripts/qbank/posref-classifier.mts'))
const R = pick(await import('../../data/questions/repair-stats.ts'))

type Rec = { subject: string; stage: string; cohort: string }
type Row = { subject: string; id: string; cohort: 'machine' | 'handwritten'; class: 'A' | 'B' | 'C'; decidedBy?: string }
const log = json('data/questions/rationale-repairs.json') as Record<string, Rec>
const withdrawn = json('data/questions/withdrawn.json') as Record<string, Record<string, { date: string; reason: string }>>
const classification = json('data/questions/posref-classification.json') as { counts: Record<string, Record<string, number>>; rows: Row[] }
const decisions = json('scripts/qbank/posref-review-decisions.json').decisions as Record<string, { class: string; by: string; date: string; note: string }>
const idsOf = (baseline: string) => Object.values(json(baseline).grandfathered as Record<string, string[]>).flat().map((e) => e.split(' ')[0])

const inCohort = (c: string) => new Set(Object.entries(log).filter(([, r]) => r.cohort === c).map(([id]) => id))
const first = inCohort('positional-first')
const machine = inCohort('positional-machine')
const hand = inCohort('positional-handwritten')
const isOut = (s: string, id: string) => withdrawn[s]?.[id]?.reason === 'POSITIONAL_RATIONALE_REFERENCE'

// ── ① ② cohorts, recomputed from the baselines rather than read back from the log ──
test('the machine cohort is exactly the ordinal-baseline questions outside the first 176', () => {
  const fromBaseline = new Set(idsOf('scripts/qbank/posref-ordinal-baseline.json').filter((id) => !first.has(id)))
  assert.equal(first.size, 176)
  assert.deepEqual([...machine].sort(), [...fromBaseline].sort())
  assert.equal(machine.size, 135)
})

test('the three cohorts do not overlap, so the published total is a union', () => {
  for (const [a, b] of [[first, machine], [first, hand], [machine, hand]] as const) {
    assert.deepEqual([...a].filter((id) => b.has(id)), [])
  }
  const s = R.repairStats()
  assert.equal(s.found, first.size + machine.size + hand.size)
  assert.equal(s.found, new Set([...first, ...machine, ...hand]).size)
  assert.deepEqual(s.byCohort, { 'positional-first': first.size, 'positional-machine': machine.size, 'positional-handwritten': hand.size })
})

test('every logged question is withdrawn until restored, and every positional withdrawal is logged', () => {
  for (const [id, r] of Object.entries(log)) {
    if (r.stage === 'restored') continue
    assert.ok(isOut(r.subject, id), `${r.subject}/${id} (${r.cohort}) is not withdrawn`)
  }
  for (const [subject, byId] of Object.entries(withdrawn)) {
    for (const [id, e] of Object.entries(byId)) {
      if (e.reason === 'POSITIONAL_RATIONALE_REFERENCE') assert.ok(log[id]?.subject === subject, `${subject}/${id} withdrawn but not in the repair log`)
    }
  }
})

// ── ③–⑥ hand-written candidates ────────────────────────────────────────────
test('the candidates are the runtime-baseline questions outside the first two cohorts', () => {
  const runtime = new Set(idsOf('scripts/qbank/posref-runtime-baseline.json'))
  const candidates = [...runtime].filter((id) => !first.has(id) && !machine.has(id))
  assert.equal(candidates.length, 537)
  const rows = new Set(classification.rows.filter((r) => r.cohort === 'handwritten').map((r) => r.id))
  // A rewritten question drops out of the classification but stays in its cohort.
  for (const id of rows) assert.ok(runtime.has(id), `${id} classified but not a baseline hit`)
  assert.equal(R.repairStats().candidates.total, candidates.length)
})

test('A is withdrawn; B and C stay in practice', () => {
  for (const r of classification.rows.filter((x) => x.cohort === 'handwritten')) {
    const out = isOut(r.subject, r.id)
    if (r.class === 'A') assert.ok(out && hand.has(r.id), `${r.subject}/${r.id} is class A but not withdrawn (run classify-posref.mts --apply)`)
    else assert.ok(!out, `${r.subject}/${r.id} is class ${r.class} and must not be withdrawn`)
  }
  for (const id of hand) {
    const row = classification.rows.find((r) => r.id === id)
    assert.ok(!row || row.class === 'A', `${id} was withdrawn as A but is now class ${row?.class}`)
  }
})

test('every machine-generated candidate is withdrawn whatever its class', () => {
  for (const r of classification.rows.filter((x) => x.cohort === 'machine')) {
    assert.ok(isOut(r.subject, r.id) || log[r.id]?.stage === 'restored', `${r.subject}/${r.id}`)
  }
})

test('the stored classification is what the classifier gives today', () => {
  for (const row of classification.rows) {
    if (row.decidedBy) continue
    const q = I.getSubjectQuestionsRaw(row.subject).find((x: { id: string }) => x.id === row.id)
    assert.ok(q, `${row.subject}/${row.id} is not in the bank`)
    assert.equal(C.classifyQuestion(q!)?.class, row.class, `${row.subject}/${row.id}: rerun scripts/qbank/classify-posref.mts --write`)
  }
})

test('a human decision names a reviewer alias, a date and a reason, and only says A or B', () => {
  for (const [k, d] of Object.entries(decisions)) {
    assert.match(k, /^[a-z0-9-]+\/.+$/, k)
    assert.ok(d.class === 'A' || d.class === 'B', `${k}: class`)
    assert.ok(d.by?.trim() && /^\d{4}-\d{2}-\d{2}$/.test(d.date) && d.note?.trim(), `${k}: by, date and note`)
  }
})

test('/transparency shows the two figures separately', () => {
  const page = read('app/transparency/TransparencyClient.tsx')
  for (const k of ['k.A', 'k.B', 'k.C', 'k.total', "c['positional-first']", "c['positional-machine']", "c['positional-handwritten']"]) {
    assert.ok(page.includes(`n(${k})`), k)
  }
})

// ── The classifier ─────────────────────────────────────────────────────────
const base = { id: 't', options: ['$10$', '$20$', '$30$', '$40$'], correctIndex: 0 }
const cls = (explanation: string, extra: object = {}) => C.classifyQuestion({ ...base, explanation, ...extra })?.class

test('option references: the option is named, or the other wrong options are quoted beside it', () => {
  assert.equal(cls('第三個選項把次序倒轉。'), 'A')
  assert.equal(cls('陷阱：$20$ 漏了月初結餘；$30$ 漏了流出；最後一項把結餘減去而非加上。'), 'A')
  assert.equal(cls('答案是 $10$。', { explanationEn: 'The last option divides instead.' }), 'A')
})

test('content references: a term, a listed condition, or a statement in the stem', () => {
  assert.equal(cls('陷阱：$20$ 漏晒第二項；$30$ 加錯號。'), 'B')
  assert.equal(cls('$20$ 只算了第一項。'), 'B')
  assert.equal(cls('取決於三件事：各方同意、授權清晰、以及政治解決方案。缺了第三項，部隊只能凍結衝突。'), 'B')
  assert.equal(cls('數列的第二項為 7。'), 'B')
})

test('unclear stays unclear rather than being guessed', () => {
  assert.equal(cls('最後一項最容易失分。'), 'C')
  // A list is present, but the words after the phrase are about an option: el_po_6_*.
  const speaker = {
    options: ['The speaker is a constructed voice', 'A poem has no speaker', 'The speaker is always the poet', 'The speaker is the reader'],
  }
  assert.equal(cls('要留意最後一項最容易失分 —— speaker 是建構出來的聲音。可以逐項核：分節、節奏、押韻、停頓、說話的是誰。', speaker), 'C')
})

test('negative self-test: without its signals the same sentence is not classified', () => {
  // If the sibling-distractor check stopped working, this would fall to C, not A.
  assert.notEqual(cls('陷阱：$50$ 漏了月初結餘；$60$ 漏了流出；最後一項把結餘減去。'), 'A')
  // If the omission check stopped working, this would be A (siblings quoted), not B.
  assert.equal(C.classifyQuestion({ ...base, explanation: '陷阱：$20$ 漏晒第二項。' })?.hits[0].signals.includes('omission-object'), true)
})
