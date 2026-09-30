// Tablets (768–1023px) get the side bar's icon rail (UX loop 39, 2026-09-30; hardening
// prompt §20). Before, they had neither the phone bottom nav (md:hidden) nor the side bar
// (lg:flex), only the hamburger menu.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (p: string) => readFileSync(p, 'utf8')

test('the rail, every offset and the CSS variable switch on at the same breakpoint (md)', () => {
  assert.match(read('components/Sidebar.tsx'), /hidden w-20 flex-col border-r border-line bg-surface md:flex xl:w-\[260px\]/)
  assert.match(read('components/AppShell.tsx'), /'md:pl-20 xl:pl-\[260px\]'/)
  assert.match(read('components/Footer.tsx'), /md:pl-20 xl:pl-\[260px\]/)
  assert.match(read('components/Navbar.tsx'), /md:left-20 xl:left-\[260px\]/)
  const css = read('app/globals.css')
  assert.match(css, /@media \(min-width: 48rem\) \{\s*html\[data-sidebar='on'\] \{\s*--sidebar-w: 5rem;/)
  assert.doesNotMatch(css, /@media \(min-width: 64rem\) \{\s*html\[data-sidebar='on'\]/)
  // The phone bottom nav hides at the same breakpoint, so no width has both or neither.
  assert.match(read('components/BottomNav.tsx'), /md:hidden/)
})
