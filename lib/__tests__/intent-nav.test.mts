// Page bottom navigation is about what the student wants next, not the page tree
// (UX loop 34, 2026-09-30; hardening prompt §23).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'

const po: any = await import('../pageOrder.ts')
const P = po.default?.intentLinks ? po.default : po

const routeExists = (href: string) =>
  href === '/' ? existsSync('app/page.tsx') : existsSync(`app${href}/page.tsx`)

test('every page in the loop gets two links: practise first, then one other real page', () => {
  for (const route of P.PAGE_ORDER as string[]) {
    const links = P.intentLinks(route)
    assert.ok(links, route)
    assert.equal(links.length, 2)
    assert.equal(links[0].href, '/start', `${route}: practise first`)
    assert.notEqual(links[1].href, route, `${route}: not a link to itself`)
    for (const l of links) {
      assert.ok(routeExists(l.href), `${route} → ${l.href} exists`)
      assert.ok(l.zh && l.en)
    }
  }
  assert.equal(P.intentLinks('/practice'), null)
  assert.equal(P.intentLinks('/privacy'), null)
})

test('PageNav shows intent links, not previous/next page names', () => {
  const src = readFileSync('components/PageNav.tsx', 'utf8')
  assert.match(src, /intentLinks\(pathname\)/)
  assert.doesNotMatch(src, /neighbours|pageNav\.prev|pageNav\.next|ChevronLeft/)
  assert.match(src, /aria-label=\{en \? 'Next step' : '下一步'\}/)
  assert.match(src, /min-h-12/)
})
