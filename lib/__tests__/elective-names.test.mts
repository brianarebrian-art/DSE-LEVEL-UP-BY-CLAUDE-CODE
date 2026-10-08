// ============================================================================
// elective-names.test.mts — every elective unit has a Chinese name (founders' reply 45a)
// ----------------------------------------------------------------------------
// 2026-10-08 red-team audit: in the Chinese interface the elective picker showed long
// English titles ("Elective Part 1: Monopoly Pricing; …") for nine subjects. The Chinese
// names now come from the EDB Curriculum and Assessment Guides in Chinese, recorded per
// elective as `sourceZh`. HKEAA publications are not used (decision of 2026-09-30).
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'

const pick = <T,>(m: T): T => ((m as { default?: T }).default ?? m)
const F = pick(await import('../../data/dse-paper-formats.ts')) as {
  PAPER_STRUCTURE: Record<string, { electives?: { kind: string; units: { id: string; en?: string; zh?: string }[]; sourceZh?: string }[] }>
}

const electives = Object.entries(F.PAPER_STRUCTURE).flatMap(([subject, st]) => (st.electives ?? []).map((e) => ({ subject, ...e })))

test('every elective unit has a Chinese name', () => {
  assert.ok(electives.length >= 10, 'the scan found the electives')
  const missing = electives.flatMap((e) => e.units.filter((u) => !u.zh?.trim()).map((u) => `${e.subject}/${u.id}`))
  assert.deepEqual(missing, [])
})

test('Chinese names added from a guide say which EDB guide, never an HKEAA document', () => {
  for (const e of electives) {
    if (!e.sourceZh) continue
    assert.match(e.sourceZh, /^https:\/\/www\.edb\.gov\.hk\/attachment\/tc\//, `${e.subject}: ${e.sourceZh}`)
    assert.doesNotMatch(e.sourceZh, /hkeaa|DocLibrary/i, e.subject)
  }
  for (const s of ['physics', 'chemistry', 'biology', 'economics', 'ict', 'geography', 'health-management', 'design-tech', 'technology-living']) {
    assert.ok(electives.some((e) => e.subject === s && e.sourceZh), `${s} records where its Chinese names came from`)
  }
})

test('the economics picker no longer shows English in the Chinese interface', () => {
  const econ = electives.find((e) => e.subject === 'economics')!
  assert.deepEqual(econ.units.map((u) => u.zh), [
    '選修單元（一）：壟斷定價；反競爭行為及競爭政策',
    '選修單元（二）：貿易理論之延伸；經濟增長及發展',
  ])
})
