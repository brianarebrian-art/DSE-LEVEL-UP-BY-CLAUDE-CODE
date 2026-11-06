// P1 homepage path, practice thumb-zone gutter, and sign-in timing.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

test('homepage primary path is the no-sign-in subject picker; secondary is outline', () => {
  const home = read('app/HomePageClient.tsx')
  const hero = home.slice(home.indexOf('── HERO ──'), home.indexOf('── 信任列 ──'))
  assert.match(hero, /id="quick-start"/)
  assert.equal('揀'.codePointAt(0), 0x63c0)
  assert.match(hero, /唔使登入／揀科開始 \$\{SESSION_SIZE\} 題/)
  assert.doesNotMatch(hero, /擇科|撿科/)
  const practice = read('app/practice/PracticeSession.tsx')
  assert.match(practice, /未揀中/)
  assert.doesNotMatch(practice, /未擇中|未撿中/)
  assert.match(hero, /href=\{hero\.ctaSecHref\}/)
  assert.match(hero, /prefetch=\{false\}/)
  assert.match(hero, /border border-line-strong bg-transparent/)
  assert.doesNotMatch(hero, /--color-neon|bg-rose/)
  const grid = home.slice(home.indexOf('function QuickStartGrid'), home.indexOf('export default function HomePage'))
  assert.match(grid, /h-14/)
  assert.match(grid, /bg-accent-strong/)
  assert.match(grid, /text-on-accent/)
  assert.doesNotMatch(grid, /prefetch=\{false\}/)
})

test('header 開始練習 and the hero picker are one guest path', () => {
  const nav = read('components/Navbar.tsx')
  assert.equal((nav.match(/href="\/start"/g) ?? []).length, 2)
  assert.match(nav, /h-14/)
  assert.match(nav, /text-on-accent/)
  const qs = read('lib/quickStart.ts')
  assert.match(qs, /return '\/#quick-start'/)
  assert.match(read('app/HomePageClient.tsx'), /id="quick-start"/)
})

test('narrow practice pages keep the next button clear of the support control', () => {
  const css = read('app/globals.css')
  const block = css.slice(css.indexOf('/* practice-revealed-p0'), css.indexOf('/* /practice-revealed-p0 */'))
  assert.match(block, /@media \(max-width: 639px\) \{\s*\.practice-next-bar \{\s*padding-right: 88px;/)
  assert.match(block, /bottom:\s*max\(12px,\s*env\(safe-area-inset-bottom\)\);/)
  assert.match(block, /height:\s*56px;/)
  assert.match(block, /\.practice-explain\s*\{[^}]*padding-bottom:\s*72px;/)
  assert.match(block, /body:has\(\.practice-session\) \.a11y-fab\s*\{\s*display:\s*none;/)
  const sos = read('components/GlobalA11y.tsx')
  assert.match(sos, /className="no-print fixed floating-bottom right-4 z-40/)
  assert.match(sos, /aria-label=\{en \? 'Emotional support' : '情緒支援'\}/)
})
