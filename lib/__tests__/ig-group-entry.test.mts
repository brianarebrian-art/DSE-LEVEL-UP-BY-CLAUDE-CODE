// ============================================================================
// ig-group-entry.test.mts — founders' reply 36a (2026-10-08)
// ----------------------------------------------------------------------------
// The student-run Instagram group page already says it is not official and shows a
// leave-site confirmation. The cards that lead to it did not: 「同戰友傾偈」 and
// 「影子溫書室」 read like features of this site. Every card linking to /relax/group
// must show IG_GROUP_ENTRY_NOTE before the student taps it.
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const { IG_GROUP_ENTRY_NOTE } = await import('../site.ts')

function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) return name === '__tests__' ? [] : tsxFiles(p)
    return p.endsWith('.tsx') ? [p] : []
  })
}

const LINK = /href=["'{`]*\/relax\/group["'`}]/

/** A source file that links to the group page but never renders the note. */
function missingNote(src: string): boolean {
  return LINK.test(src) && !src.includes('IG_GROUP_ENTRY_NOTE')
}

test('the note names the platform, says it is off-site and not official, in both languages', () => {
  assert.match(IG_GROUP_ENTRY_NOTE.zh, /Instagram/)
  assert.match(IG_GROUP_ENTRY_NOTE.zh, /站外/)
  assert.match(IG_GROUP_ENTRY_NOTE.zh, /唔係官方/)
  assert.match(IG_GROUP_ENTRY_NOTE.en, /Instagram/)
  assert.match(IG_GROUP_ENTRY_NOTE.en, /off-site/)
  assert.match(IG_GROUP_ENTRY_NOTE.en, /not official/)
})

test('every card linking to /relax/group shows the note', () => {
  const linking = [...tsxFiles(join(ROOT, 'app')), ...tsxFiles(join(ROOT, 'components'))]
    .filter((p) => LINK.test(readFileSync(p, 'utf8')))
  // The two known entry cards; an empty list would mean the scan went blind.
  const rel = linking.map((p) => relative(ROOT, p)).sort()
  assert.ok(rel.includes('app/relax/components/RelaxLanding.tsx'), rel.join(', '))
  assert.ok(rel.includes('app/dashboard/DashboardPageClient.tsx'), rel.join(', '))
  const bad = linking.filter((p) => missingNote(readFileSync(p, 'utf8'))).map((p) => relative(ROOT, p))
  assert.deepEqual(bad, [], `cards linking to /relax/group without IG_GROUP_ENTRY_NOTE: ${bad.join(', ')}`)
})

test('self-test: the check catches a card without the note', () => {
  assert.equal(missingNote(`<Link href="/relax/group">同戰友傾偈</Link>`), true)
  assert.equal(missingNote(`<Link href={'/relax/group'}>x</Link>`), true)
  assert.equal(missingNote(`<Link href="/relax/group">{IG_GROUP_ENTRY_NOTE.zh}</Link>`), false)
  assert.equal(missingNote(`<Link href="/relax/solo">x</Link>`), false)
})
