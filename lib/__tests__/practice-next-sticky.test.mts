// Practice revealed state (mobile): next stays in the column, a11y control
// sits at the top-right, wrong-answer copy stays neutral.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')
const css = read('app/globals.css')
const session = read('app/practice/PracticeSession.tsx')
const block = css.slice(css.indexOf('/* practice-revealed-p0'), css.indexOf('/* /practice-revealed-p0 */'))

test('the next bar is sticky inside the content column and only after an answer', () => {
  assert.match(block, /position:\s*sticky;/)
  assert.match(block, /bottom:\s*max\(12px,\s*env\(safe-area-inset-bottom\)\);/)
  assert.match(block, /height:\s*56px;/)
  assert.match(block, /min-height:\s*48px;/)
  assert.match(block, /z-index:\s*20;/)
  assert.match(block, /background:\s*var\(--color-surface-raised\);/)
  assert.match(block, /border-top:\s*1px solid var\(--color-line-strong\);/)
  assert.match(block, /background:\s*var\(--color-accent-strong\);/)
  assert.match(block, /color:\s*var\(--color-on-accent\);/)
  assert.match(session, /answerState \? ' practice-session-revealed'/)
  assert.match(session, /\{answerState !== null && \(\s*<div className="practice-next-bar">/)
})

test('the explanation card keeps 72px under the text and uses a clay tint', () => {
  assert.match(block, /\.practice-explain\s*\{[^}]*padding-bottom:\s*72px;/)
  assert.match(block, /color-mix\(in srgb, var\(--color-ml-clay\)/)
  assert.doesNotMatch(block, /--color-rose|--color-neon/)
  assert.match(session, /practice-explain practice-miss/)
})

test('the accessibility control on practice is top-right, not over the next button', () => {
  assert.match(block, /top:\s*max\(12px,\s*env\(safe-area-inset-top\)\);/)
  assert.match(block, /right:\s*12px;/)
  assert.match(block, /bottom:\s*auto;/)
  assert.match(block, /min-width:\s*44px;/)
  assert.match(block, /min-height:\s*44px;/)
  assert.match(block, /z-index:\s*45;/)
  assert.ok(block.indexOf('z-index: 45') > 0)
  assert.ok(Number(block.match(/\.practice-next-bar\s*\{[^}]*z-index:\s*(\d+)/)?.[1]) < 50)
})

test('revealed copy does not scold', () => {
  assert.match(session, /未揀中/)
  assert.match(session, /想記低原因？（可以唔揀）/)
  assert.doesNotMatch(session, /呢題失手|以後唔好收埋|💡 發現盲點/)
  assert.match(session, /pickedCause === null|useState<ReverseCause \| null>\(null\)/)
})

test('Wave 2 sticky bar keeps retry beside next after reveal', () => {
  assert.match(session, /practice-retry-btn/)
  assert.match(session, /再試一次/)
  assert.match(block, /\.practice-retry-btn\s*\{/)
  assert.match(block, /display:\s*flex;/)
  assert.match(session, /提示（可選）/)
  assert.match(session, /aria-expanded=\{hintOpen\}/)
})
