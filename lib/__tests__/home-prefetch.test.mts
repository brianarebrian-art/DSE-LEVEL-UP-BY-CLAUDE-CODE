// Homepage / shell Link prefetch policy (PERF-HOME-PREFETCH-2026-10-29).
// Secondary routes disable prefetch; primary practice CTAs keep the Next.js default.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const home = readFileSync('app/HomePageClient.tsx', 'utf8')
const nav = readFileSync('components/Navbar.tsx', 'utf8')
const side = readFileSync('components/Sidebar.tsx', 'utf8')
const bottom = readFileSync('components/BottomNav.tsx', 'utf8')
const continueCard = readFileSync('components/ContinueCard.tsx', 'utf8')

/** Find a Link opening tag that mentions hrefNeedle somewhere before the tag closes. */
function linkTagContaining(src: string, hrefNeedle: string): string | null {
  const re = /<Link\b[\s\S]*?>/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src))) {
    if (m[0].includes(hrefNeedle)) return m[0]
  }
  return null
}

test('homepage secondary info links disable prefetch', () => {
  for (const href of ['"/transparency"', '"/trust"']) {
    const tag = linkTagContaining(home, href)
    assert.ok(tag, `missing Link ${href}`)
    assert.match(tag!, /prefetch=\{false\}/, href)
  }
  const sec = linkTagContaining(home, 'hero.ctaSecHref')
  assert.ok(sec, 'seasonal secondary CTA')
  assert.match(sec!, /prefetch=\{false\}/)
})

test('homepage primary practice CTAs keep default prefetch (no prefetch={false})', () => {
  const qs = home.slice(home.indexOf('function QuickStartGrid'), home.indexOf('export default function HomePage'))
  assert.match(qs, /href=\{quickStartHref\(s\.id\)\}/)
  assert.doesNotMatch(qs, /prefetch=\{false\}/, 'quick-start must stay prefetchable')

  const startCta = linkTagContaining(home, 'hero.ctaStartHref')
  assert.ok(startCta)
  assert.doesNotMatch(startCta!, /prefetch=\{false\}/)

  // Phase 4 首頁收斂後唔再喺首屏鋪科目卡；主練習入口係 QuickStart + /subjects。
  const plain = [...home.matchAll(/<Link\b[\s\S]*?>/g)].filter((m) => /href="\/subjects"/.test(m[0]))
  assert.ok(plain.length >= 1, 'expected /subjects Links')
  for (const m of plain) assert.doesNotMatch(m[0], /prefetch=\{false\}/)
})

test('ContinueCard (primary resume CTA) does not disable prefetch', () => {
  assert.doesNotMatch(continueCard, /prefetch=\{false\}/)
  assert.match(continueCard, /href=\{target\.href\}/)
})

test('shell nav: secondary routes set prefetch false; practice entries do not', () => {
  assert.match(nav, /NAV_PREFETCH_OFF = new Set\(\[/)
  for (const href of ['/dashboard', '/bookmarks', '/account', '/notes', '/off-syllabus', '/about', '/credits']) {
    assert.match(nav, new RegExp(`'${href}'`))
  }
  assert.match(nav, /prefetch=\{NAV_PREFETCH_OFF\.has\(l\.href\) \? false : undefined\}/)
  // /subjects is the practice entry — must not be in the off set.
  const offBlock = nav.slice(nav.indexOf('NAV_PREFETCH_OFF = new Set(['), nav.indexOf('])', nav.indexOf('NAV_PREFETCH_OFF = new Set([')) + 2)
  assert.doesNotMatch(offBlock, /'\/subjects'/)

  const startTags = [...nav.matchAll(/<Link\b[\s\S]*?>/g)].filter((m) => m[0].includes('"/start"'))
  assert.ok(startTags.length >= 1)
  for (const m of startTags) assert.doesNotMatch(m[0], /prefetch=\{false\}/)

  assert.match(nav, /href="\/about"\s+prefetch=\{false\}/)
  assert.match(nav, /href="\/credits"\s+prefetch=\{false\}/)
})

test('sidebar and bottom nav secondary routes disable prefetch; /subjects stays default', () => {
  // Typed as ReadonlySet<string> so .has(href) accepts ITEMS union incl. /subjects.
  assert.match(side, /SIDEBAR_PREFETCH_OFF(?::\s*ReadonlySet<string>)?\s*=\s*new Set\(/)
  assert.match(side, /href !== '\/subjects'/)
  assert.match(side, /prefetch=\{SIDEBAR_PREFETCH_OFF\.has\(href\) \? false : undefined\}/)

  assert.match(bottom, /BOTTOM_PREFETCH_OFF = new Set\(\['\/dashboard', '\/bookmarks', '\/account'\]\)/)
  assert.match(bottom, /prefetch=\{BOTTOM_PREFETCH_OFF\.has\(href\) \? false : undefined\}/)
})

test('ops note exists and refuses fake Lighthouse scores', () => {
  const doc = readFileSync('docs/ops/PERF-HOME-PREFETCH-2026-10-29.md', 'utf8')
  assert.match(doc, /lab-only|僅 lab|lab only/i)
  assert.match(doc, /TTFB/)
  assert.match(doc, /FCP/)
  assert.match(doc, /Lighthouse/)
  assert.match(doc, /唔會|不.*宣稱|no fake|唔好.*冒充/i)
})
