// Which layout each width gets (refinement loop 2, 2026-09-30; prompt §25–§27).
//
// Tailwind v4 emits arbitrary breakpoints (min-[1440px]:) before named ones (lg:, xl:),
// so a min-[1440px] rule silently loses to lg: on the same element (UX loop 40). The
// practice workspace therefore uses the named `desk` breakpoint. This test pins the
// breakpoint values and the classes that decide each layout, and bans arbitrary
// breakpoints in app code so the ordering bug cannot come back unnoticed.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const read = (p: string) => readFileSync(p, 'utf8')
const css = read('app/globals.css')
const REM = 16
// Tailwind v4 defaults, plus the project's own `desk`.
const BP = { md: 48 * REM, lg: 64 * REM, xl: 80 * REM, desk: Number(css.match(/--breakpoint-desk:\s*([\d.]+)rem/)?.[1]) * REM }

function classesOf(src: string, marker: string): string[] {
  const at = src.indexOf(marker)
  assert.ok(at >= 0, marker)
  const m = src.slice(at).match(/className="([^"]+)"/)
  assert.ok(m, `className after ${marker}`)
  return m[1].split(/\s+/)
}
/** Is a class with this breakpoint prefix active at `width`? Unprefixed = always. */
const active = (prefix: keyof typeof BP | '', width: number) => prefix === '' || width >= BP[prefix]

test('breakpoints: desk is 1440px, and the side-bar width follows md / xl', () => {
  assert.equal(BP.desk, 1440)
  assert.match(css, /@media \(min-width: 48rem\) \{\s*html\[data-sidebar='on'\] \{\s*--sidebar-w: 5rem;/)
  assert.match(css, /@media \(min-width: 80rem\) \{\s*html\[data-sidebar='on'\] \{\s*--sidebar-w: 260px;/)
})

test('767 → phone nav only; 768 and 1024 → rail, no hamburger; 1440 → rail and practice workspace', () => {
  const sidebar = read('components/Sidebar.tsx')
  const nav = read('components/Navbar.tsx')
  const bottom = read('components/BottomNav.tsx')
  const railShownFrom = classesOf(sidebar, "aria-label={en ? 'Sections'").includes('md:flex') ? 'md' : null
  assert.equal(railShownFrom, 'md', 'side rail appears from md')
  const hamburger = classesOf(nav, '{/* 漢堡掣')
  assert.ok(hamburger.includes('md:hidden'), 'hamburger hidden from md')
  const inline = classesOf(nav, '{/* 2026-09-30（改進循環 2，prompt §25）')
  assert.ok(inline.includes('hidden') && inline.includes('md:flex'), 'inline controls from md')
  assert.match(bottom, /md:hidden/)

  for (const [w, expectRail] of [[767, false], [768, true], [1024, true], [1440, true]] as const) {
    assert.equal(active('md', w), expectRail, `rail at ${w}`)
    // The hamburger shows exactly where the rail does not: never both.
    assert.equal(!active('md', w), !expectRail, `hamburger at ${w}`)
  }
})

test('practice: one column below 1024, two from 1024, three-column workspace from 1440', () => {
  const src = read('app/practice/PracticeSession.tsx')
  const grid = (src.match(/className="(lg:grid lg:grid-cols-2[^"]*)"/)?.[1] ?? '').split(/\s+/)
  assert.ok(grid.includes('lg:grid-cols-2') && grid.includes('desk:grid-cols-[220px_1fr_1fr]'))
  const cols = (w: number) => (active('desk', w) ? 3 : active('lg', w) ? 2 : 1)
  assert.equal(cols(767), 1)
  assert.equal(cols(1023), 1)
  assert.equal(cols(1024), 2)
  assert.equal(cols(1366), 2)
  assert.equal(cols(1440), 3)
  assert.equal(cols(1920), 3)
})

test('no arbitrary min-[…]/max-[…] breakpoints in app code (they lose to lg:/xl:)', () => {
  const bad: string[] = []
  const walk = (d: string) => {
    for (const f of readdirSync(d)) {
      const p = join(d, f)
      if (f === '__tests__' || f === 'node_modules') continue
      if (statSync(p).isDirectory()) walk(p)
      else if (/\.tsx?$/.test(f) && /\b(min|max)-\[\d+(px|rem|em)\]:/.test(read(p))) bad.push(p)
    }
  }
  walk('app'); walk('components')
  assert.deepEqual(bad, [])
})
