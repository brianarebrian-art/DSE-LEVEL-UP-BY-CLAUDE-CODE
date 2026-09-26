// Elective choices (lib/electives.ts).

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..', '..')
const ns: any = await import('../electives.ts')
const E = ns.default?.isTopicInScope ? ns.default : ns
const fmt: any = await import('../../data/dse-paper-formats.ts')
const { PAPER_STRUCTURE } = fmt.default?.PAPER_STRUCTURE ? fmt.default : fmt
const sum: any = await import('../../data/questions/summary.generated.ts')
const { SUBJECT_TOPICS } = sum.default?.SUBJECT_TOPICS ? sum.default : sum

test('every mapped topic exists, and maps to a real strand or unit', () => {
  for (const [subject, topics] of Object.entries<Record<string, { strand?: string; unit?: string }>>(E.TOPIC_SCOPE)) {
    const registered = new Set(SUBJECT_TOPICS[subject].map((t: { id: string }) => t.id))
    const rules = PAPER_STRUCTURE[subject].electives ?? []
    const strands = new Set(rules.filter((r: any) => r.kind === 'strand').flatMap((r: any) => r.units.map((u: any) => u.id)))
    const units = new Set(rules.filter((r: any) => r.kind === 'units').flatMap((r: any) => r.units.map((u: any) => u.id)))
    for (const [topic, scope] of Object.entries(topics)) {
      assert.ok(registered.has(topic), `${subject}: topic ${topic} is not registered`)
      if (scope.strand) assert.ok(strands.has(scope.strand), `${subject}/${topic}: unknown strand ${scope.strand}`)
      if (scope.unit) assert.ok(units.has(scope.unit), `${subject}/${topic}: unknown unit ${scope.unit}`)
    }
  }
})

test('a selection is complete only when it satisfies the rule', () => {
  assert.equal(E.isCompleteSelection('physics', undefined), false)
  assert.equal(E.isCompleteSelection('physics', { units: ['atomic-world'] }), false, 'physics needs 2')
  assert.equal(E.isCompleteSelection('physics', { units: ['atomic-world', 'medical-physics'] }), true)
  assert.equal(E.isCompleteSelection('physics', { units: ['atomic-world', 'not-a-unit'] }), false)
  assert.equal(E.isCompleteSelection('physics', { units: ['atomic-world', 'atomic-world'] }), false)
  assert.equal(E.isCompleteSelection('physics', { unassigned: true, units: [] }), true, '"not sure" is a valid answer')
  assert.equal(E.isCompleteSelection('bafs', { strand: 'accounting', units: [] }), true)
  assert.equal(E.isCompleteSelection('bafs', { units: [] }), false, 'BAFS needs a strand')
  assert.equal(E.isCompleteSelection('technology-living', { strand: 'food', units: ['food-culture', 'food-product-development'] }), true)
  assert.equal(
    E.isCompleteSelection('technology-living', { strand: 'food', units: ['food-culture', 'apparel-industry'] }),
    false,
    'a unit from the other strand does not count',
  )
  assert.equal(E.isCompleteSelection('ethics-religious', { units: ['buddhism'] }), true)
})

test('practice scope follows the choice, and leaves unmapped topics alone', () => {
  const ers = { units: ['christianity'] }
  assert.equal(E.isTopicInScope('ethics-religious', 'buddhism', ers), false)
  assert.equal(E.isTopicInScope('ethics-religious', 'christianity', ers), true)
  assert.equal(E.isTopicInScope('ethics-religious', 'ethical_theories', ers), true, 'compulsory topic stays')

  const food = { strand: 'food', units: ['food-culture', 'food-product-development'] }
  assert.equal(E.isTopicInScope('technology-living', 'fibres', food), false)
  assert.equal(E.isTopicInScope('technology-living', 'nutrition', food), true)
  assert.equal(E.isTopicInScope('technology-living', 'consumer', food), true, 'shared topic stays')

  assert.equal(E.isTopicInScope('ethics-religious', 'buddhism', { unassigned: true, units: [] }), true)
  assert.equal(E.isTopicInScope('ethics-religious', 'buddhism', undefined), true)
  assert.equal(E.isTopicInScope('physics', 'mechanics', { units: ['atomic-world', 'medical-physics'] }), true)
})

test('elective choices sync with progress (Yuna 2026-09-26, charter §16.E)', () => {
  // Was 'not synced until signed'. Decided under charter §18; see
  // docs/charter-amendment-2026-09-26-electives-DRAFT.md.
  const sync = readFileSync(join(ROOT, 'lib/sync.ts'), 'utf8')
  assert.ok(sync.includes(`electives: '${E.ELECTIVES_KEY}'`), `lib/sync.ts does not sync ${E.ELECTIVES_KEY}`)
  assert.ok(sync.includes(`const ELECTIVES_EVENT = '${E.ELECTIVES_EVENT}'`), 'event name drifted from lib/electives.ts')
})

test('merging elective choices: newer wins per subject, one-sided subjects are kept', async () => {
  const sy: any = await import('../sync.ts')
  const S = sy.default?.mergeElectives ? sy.default : sy
  const local = { physics: { units: ['atomic-world'], updatedAt: 200 }, bafs: { strand: 'accounting', units: [], updatedAt: 100 } }
  const cloud = { physics: { units: ['medical-physics'], updatedAt: 100 }, bafs: { strand: 'business', units: [], updatedAt: 300 }, ict: { units: ['x'] } }
  const m = S.mergeElectives(local, cloud)
  assert.deepEqual(m.physics.units, ['atomic-world'], 'local is newer for physics')
  assert.equal(m.bafs.strand, 'business', 'cloud is newer for BAFS')
  assert.deepEqual(m.ict.units, ['x'], 'a subject chosen on one side only is kept')
  assert.deepEqual(S.mergeElectives({ a: { units: [1] } }, { a: { units: [2] } }).a.units, [1], 'a tie keeps this device')
})
