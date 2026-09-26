// Consistency checks for PAPER_STRUCTURE (data/dse-paper-formats.ts).
//
// The figures come from the HKEAA 2027 assessment frameworks (read 2026-09-26).
// These tests cannot prove a figure matches the PDF; they catch an edit that
// makes the data contradict itself: weights that no longer add up, hasMC that
// disagrees with the section list, or an elective rule with the wrong count.

import { test } from 'node:test'
import assert from 'node:assert/strict'

const ns: any = await import('../../data/dse-paper-formats.ts')
const { PAPER_STRUCTURE, DSE_PAPER_FORMATS, QUESTION_KIND_LABELS } = ns.default?.PAPER_STRUCTURE ? ns.default : ns
const subjNs: any = await import('../../data/subjects.ts')
const { subjects } = subjNs.default?.subjects ? subjNs.default : subjNs

const active: string[] = subjects.filter((s: { isActive?: boolean }) => s.isActive !== false).map((s: { id: string }) => s.id)
const near = (a: number, b: number) => Math.abs(a - b) < 0.06

test('every active subject has a 2027 structure and a paper-format entry', () => {
  for (const id of active) {
    assert.ok(PAPER_STRUCTURE[id], `${id}: no PAPER_STRUCTURE entry`)
    assert.ok(DSE_PAPER_FORMATS.some((f: { subject: string }) => f.subject === id), `${id}: no DSE_PAPER_FORMATS entry`)
  }
})

test('paper weights plus school-based assessment total 100%', () => {
  for (const [id, s] of Object.entries<any>(PAPER_STRUCTURE)) {
    const total = Object.values<number>(s.paperWeights).reduce((a, b) => a + b, 0) + s.sbaPct
    assert.ok(near(total, 100), `${id}: papers + SBA = ${total}`)
  }
})

test('section weights add up to their paper (per strand), where the framework gives them', () => {
  for (const [id, s] of Object.entries<any>(PAPER_STRUCTURE)) {
    const groups = new Map<string, { known: number; unknown: number; paper: string }>()
    for (const sec of s.sections) {
      const paper = sec.paper in s.paperWeights ? sec.paper : sec.paper.replace(/[A-Z]$/, '')
      assert.ok(paper in s.paperWeights, `${id}: section on unknown paper ${sec.paper}`)
      const key = `${paper}|${sec.strand ?? ''}`
      const g = groups.get(key) ?? { known: 0, unknown: 0, paper }
      if (sec.weight === null) g.unknown++
      else g.known += sec.weight
      groups.set(key, g)
    }
    // A paper split by strand is checked once per strand; the shared part counts for both.
    for (const [key, g] of groups) {
      const strand = key.split('|')[1]
      const shared = strand ? groups.get(`${g.paper}|`) : undefined
      const known = g.known + (shared?.known ?? 0)
      const unknown = g.unknown + (shared?.unknown ?? 0)
      const target = s.paperWeights[g.paper]
      if (unknown === 0) assert.ok(near(known, target), `${id} paper ${g.paper} ${strand}: sections ${known} ≠ ${target}`)
      else assert.ok(known <= target + 0.06, `${id} paper ${g.paper}: known sections ${known} exceed ${target}`)
    }
  }
})

test('hasMC agrees with the section list, and mcWeightPct with the MC sections', () => {
  for (const f of DSE_PAPER_FORMATS) {
    const s = PAPER_STRUCTURE[f.subject]
    const mcSections = s.sections.filter((x: any) => x.kinds.includes('mc'))
    assert.equal(mcSections.length > 0, f.hasMC, `${f.subject}: hasMC ${f.hasMC} but MC sections ${mcSections.length}`)
    if (typeof f.mcWeightPct === 'number') {
      const pure = mcSections.filter((x: any) => x.kinds.length === 1 && !x.elective && x.weight !== null)
      const sum = pure.reduce((a: number, x: any) => a + x.weight, 0)
      assert.ok(near(sum, f.mcWeightPct), `${f.subject}: mcWeightPct ${f.mcWeightPct} vs MC sections ${sum}`)
    }
  }
})

test('exactly the ten subjects verified to have no MC in the 2027 papers', () => {
  const noMC = DSE_PAPER_FORMATS.filter((f: any) => !f.hasMC).map((f: any) => f.subject).sort()
  assert.deepEqual(noMC, [
    'chinese-history', 'chinese-literature', 'design-tech', 'english-literature', 'ethics-religious',
    'health-management', 'history', 'm1', 'm2', 'visual-arts',
  ])
})

test('elective rules are well-formed', () => {
  for (const [id, s] of Object.entries<any>(PAPER_STRUCTURE)) {
    for (const e of s.electives ?? []) {
      assert.equal(e.units.length, e.of, `${id}: ${e.units.length} units listed, rule says ${e.of}`)
      assert.ok(e.choose >= 1 && e.choose <= e.of, `${id}: choose ${e.choose} of ${e.of}`)
      assert.equal(new Set(e.units.map((u: any) => u.id)).size, e.units.length, `${id}: duplicate unit ids`)
      for (const u of e.units) assert.ok(u.en || u.zh, `${id}: unit ${u.id} has no name`)
      assert.match(e.source, /hkeaa\.edu\.hk|edb\.gov\.hk|^\/DocLibrary\//, `${id}: elective source is not HKEAA/EDB`)
    }
  }
})

test('every question kind used has a label', () => {
  for (const [id, s] of Object.entries<any>(PAPER_STRUCTURE)) {
    for (const sec of s.sections) for (const k of sec.kinds) assert.ok(QUESTION_KIND_LABELS[k], `${id}: kind ${k} has no label`)
  }
})
