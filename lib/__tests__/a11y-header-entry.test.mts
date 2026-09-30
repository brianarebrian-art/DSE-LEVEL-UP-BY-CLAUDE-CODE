// Phone accessibility entry in the page header (UX loop 18; Yuna decision 1, 2026-09-30).
//
// The bottom-left floating button covered the bottom of the first screen on every
// phone page. On phones it now sits in the header; the floating button hides only
// when the page has a header button, so no page loses its accessibility entry.
// The bottom-right emotional support button stays where it was.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')
const panel = read('components/A11yPanel.tsx')
const css = read('app/globals.css')

function buttonSource(): string {
  const at = panel.indexOf('export function A11yButton(')
  assert.ok(at > 0, 'A11yButton is exported from A11yPanel')
  return panel.slice(at, panel.indexOf('\n}\n', at))
}

test('the header button opens the same panel, is phone-only and 48px', () => {
  const btn = buttonSource()
  assert.match(btn, /data-a11y-trigger/)
  assert.match(btn, /window\.dispatchEvent\(new Event\(OPEN_A11Y_EVENT\)\)/)
  assert.match(panel, /export const OPEN_A11Y_EVENT = 'dse-open-a11y'/)
  assert.match(btn, /aria-haspopup="dialog"/)
  assert.match(btn, /aria-label=\{en \? 'Open accessibility menu' : '開啟無障礙功能選單'\}/)
  const cls = btn.match(/className=\{`([^`]+)`\}/)![1]
  for (const c of ['md:hidden', 'min-h-12', 'min-w-12']) assert.ok(cls.split(/\s+/).includes(c), c)
  // The footer link still opens the panel with the same event name.
  assert.match(read('components/Footer.tsx'), /new Event\('dse-open-a11y'\)/)
})

test('the floating button hides on phones only when the page has a header button', () => {
  assert.match(panel, /className="a11y-fab no-print fixed floating-bottom floating-left/)
  const rule = css.match(/@media \(max-width: (\d+)px\) \{\s*body:has\(\[data-a11y-trigger\]\) \.a11y-fab \{ display: none; \}/)
  assert.ok(rule, 'conditional rule in globals.css')
  // Same breakpoint as md:hidden on the header button (Tailwind v4 md = 768px).
  assert.equal(Number(rule[1]), 767)
  // Never hidden unconditionally: pages without a header button keep the floating one.
  const hides = css.match(/[^\n{}]*\.a11y-fab[^{]*\{[^}]*display:\s*none/g) ?? []
  assert.equal(hides.length, 1)
  assert.match(hides[0], /body:has\(\[data-a11y-trigger\]\)/)
})

test('every header students see on a phone carries the button', () => {
  const sites = {
    'components/Navbar.tsx': /<A11yButton \/>/,
    'app/practice/PracticeSession.tsx': /<A11yButton className="ml-auto" \/>/,
    'app/practice/LongPracticeSession.tsx': /<A11yButton \/>/,
  }
  for (const [file, re] of Object.entries(sites)) {
    const src = read(file)
    assert.match(src, /import \{ A11yButton \} from '@\/components\/A11yPanel'/, file)
    assert.match(src, re, file)
  }
  // In the practice session it sits in the sticky top row, so it stays reachable mid-question.
  const s = read('app/practice/PracticeSession.tsx')
  const sticky = s.indexOf('<div className="focus-dim sticky top-0 z-30')
  const btn = s.indexOf('<A11yButton className="ml-auto" />')
  const rowEnd = s.indexOf('{/* Progress bar */}', sticky)
  assert.ok(sticky > 0 && sticky < btn && btn < rowEnd)
})

test('opening from far away moves focus into the panel and back on close', () => {
  assert.match(panel, /openerRef\.current = document\.activeElement instanceof HTMLElement \? document\.activeElement : null/)
  assert.match(panel, /if \(openerRef\.current\) closeRef\.current\?\.focus\(\)/)
  assert.match(panel, /if \(opener\?\.isConnected\) opener\.focus\(\)/)
  assert.match(panel, /ref=\{closeRef\}\s+onClick=\{\(\) => setOpen\(false\)\}/)
})

test('the emotional support button is untouched and stays bottom-right', () => {
  const g = read('components/GlobalA11y.tsx')
  assert.match(g, /className="no-print fixed floating-bottom right-4 z-40/)
  assert.doesNotMatch(g, /a11y-fab|data-a11y-trigger/)
  assert.doesNotMatch(css, /body:has\(\[data-a11y-trigger\]\)[^{]*(sos|support)/i)
})
