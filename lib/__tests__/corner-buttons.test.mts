// Keep tappable content out from under the corner buttons (UX loop 15, 2026-09-30).
//
// Two overlaps measured after loops 2 and 8:
//   • returning student, 375×812 homepage: the links under the quick start sat at
//     y=701–745, under the accessibility and emotional-support buttons (from y=692);
//   • 1024×768 practice page: the right end of 下一題 ran under the emotional-support button.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (p: string) => readFileSync(p, 'utf8')

test('with a continue card on a phone, the mascot gives way; first-time visitors are unchanged', () => {
  assert.match(read('components/ContinueCard.tsx'), /<div data-continue-card className=/)
  assert.match(read('app/page.tsx'), /<div className="hero-mascot hero-rise mb-4 flex justify-center">/)
  const css = read('app/globals.css')
  const at = css.indexOf('section:has([data-continue-card]) .hero-mascot')
  assert.ok(at > 0)
  assert.match(css.slice(css.lastIndexOf('@media', at), at), /@media \(max-width: 639px\) \{\s*$/)
})

test('between 1024 and 1279px the practice columns leave room for the right-corner button', () => {
  assert.match(read('app/practice/PracticeSession.tsx'), /lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:max-xl:pr-14/)
})
