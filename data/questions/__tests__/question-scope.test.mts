// Per-question elective scope (scripts/qbank/gen-question-scope.mts;
// docs/ELECTIVE-SPLIT-2026-09-26.md). Yuna 2026-09-26: split the mixed topics of
// geography, ICT and BAFS question by question.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const idx: any = await import('../index.ts')
const I = idx.default?.getSubjectQuestionsRaw ? idx.default : idx
const gen: any = await import('../question-scope.generated.ts')
const QUESTION_SCOPE = gen.QUESTION_SCOPE ?? gen.default.QUESTION_SCOPE
const el: any = await import('../../../lib/electives.ts')
const E = el.default?.isQuestionInScope ? el.default : el

const header = readFileSync(new URL('../question-scope.generated.ts', import.meta.url), 'utf8')

test('the map covers every current question in the split topics (rerun the generator after adding questions)', () => {
  const lines = [...header.matchAll(/^\/\/ ([a-z-]+)\/([a-z_]+): (.+)$/gm)]
  assert.ok(lines.length >= 12)
  for (const [, subject, topic, tally] of lines) {
    const counted = [...tally.matchAll(/(\d+)/g)].reduce((n, m) => n + Number(m[1]), 0)
    const actual = I.getSubjectQuestionsRaw(subject).filter((q: any) => q.topic === topic).length
    assert.equal(actual, counted, `${subject}/${topic}: ${actual} questions, map built for ${counted}. Run: npm run qbank:question-scope`)
  }
})

test('every mapped id exists and points at a real elective of its subject', () => {
  for (const [subject, m] of Object.entries<Record<string, { strand?: string; unit?: string }>>(QUESTION_SCOPE)) {
    const ids = new Set(I.getSubjectQuestionsRaw(subject).map((q: any) => q.id))
    const units = new Set(E.electiveRules(subject).flatMap((r: any) => r.units.map((u: any) => u.id)))
    for (const [id, s] of Object.entries(m)) {
      assert.ok(ids.has(id), `${subject}: unknown id ${id}`)
      assert.ok(units.has(s.strand ?? s.unit), `${subject}/${id}: ${s.strand ?? s.unit} is not an elective of ${subject}`)
    }
  }
})

test('spot checks against the guides', () => {
  const S = (subject: string, id: string) => QUESTION_SCOPE[subject]?.[id]?.strand ?? QUESTION_SCOPE[subject]?.[id]?.unit ?? 'shared'
  assert.equal(S('geography', 'geo_wx_33'), 'weather-and-climate', 'convectional rain')
  assert.equal(S('geography', 'geo_floor_08'), 'shared', 'reading a climate graph')
  assert.equal(S('ict', 'ict_db_77'), 'databases', 'foreign key')
  assert.equal(S('ict', 'ict_db_76'), 'shared', 'primary key is compulsory')
  assert.equal(S('bafs', 'bafs_mgmt_31'), 'business-management', 'staff turnover (HRM)')
  assert.equal(S('bafs', 'bafs_mgmt_25'), 'shared', 'planning (Basics of Management)')
  assert.equal(S('bafs', 'bafs-02'), 'accounting', 'inventory at lower of cost and NRV')
  assert.equal(S('bafs', 'bafs_ac_71'), 'shared', 'accounting equation (Basics of Accounting)')
  assert.equal(S('bafs', 'bafs-06'), 'shared', 'debentures are in both strands and personal finance')
  assert.equal(S('bafs', 'bafs_rep_0032'), 'shared', 'classifying trade receivables')
  assert.equal(S('bafs', 'bafs_acct_b1_02'), 'accounting', 'period-end adjustments')
  assert.equal(S('bafs', 'bafs_acct_b1_03'), 'shared', 'sole proprietor statement')
  assert.equal(S('bafs', 'bafs_floor_18'), 'business-management', 'payback period')
})

test('the practice filter hides the other elective and keeps shared questions', () => {
  const acc = { strand: 'accounting', units: [] }
  const bm = { strand: 'business-management', units: [] }
  const q = (id: string, topic: string) => ({ id, topic })
  assert.equal(E.isQuestionInScope('bafs', q('bafs_mgmt_31', 'management'), acc), false)
  assert.equal(E.isQuestionInScope('bafs', q('bafs_mgmt_31', 'management'), bm), true)
  assert.equal(E.isQuestionInScope('bafs', q('bafs-02', 'accounting'), bm), false)
  assert.equal(E.isQuestionInScope('bafs', q('bafs_ac_71', 'accounting'), bm), true)
  const geo = { units: ['dynamic-earth-the-building-of-hong-kong', 'transport-development-planning-and-management'] }
  assert.equal(E.isQuestionInScope('geography', q('geo_wx_33', 'weather_climate'), geo), false)
  assert.equal(E.isQuestionInScope('geography', q('geo_floor_08', 'weather_climate'), geo), true)
  assert.equal(E.isQuestionInScope('bafs', q('bafs_mgmt_31', 'management'), { unassigned: true, units: [] }), true)
  const gate = readFileSync(new URL('../../../app/practice/PracticeGate.tsx', import.meta.url), 'utf8')
  assert.match(gate, /isQuestionInScope\(subjectId, q, sel \?\? undefined\)/)
})
