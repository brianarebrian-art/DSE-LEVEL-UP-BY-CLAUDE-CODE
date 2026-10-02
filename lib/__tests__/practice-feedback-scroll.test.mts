// Bringing the feedback into view after an answer (UX loop 4, 2026-09-30;
// lib/practiceScroll.ts). The numbers are the ones measured at 375×812.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const pick = <T,>(m: T): T => ((m as { default?: T }).default ?? m)
const P = pick(await import('../practiceScroll.ts'))
const session = readFileSync(join(ROOT, 'app/practice/PracticeSession.tsx'), 'utf8')

test('feedback below the fold is scrolled to mid-screen', () => {
  // Wrong answer, first line measured at y=744 on a 375×812 phone.
  const d = P.feedbackScrollDelta(744, 812)
  assert.equal(d, 338)
  assert.equal(744 - d, 406) // lands at half the viewport height
  // Far below (a long question): still lands at mid-screen.
  assert.equal(1200 - P.feedbackScrollDelta(1200, 812), 406)
})

test('feedback already on screen is left alone', () => {
  assert.equal(P.feedbackScrollDelta(400, 812), 0)
  assert.equal(P.feedbackScrollDelta(609, 812), 0) // exactly three quarters down
  assert.equal(P.feedbackScrollDelta(-50, 812), 0) // already scrolled past
})

test('the scroll never moves by the options: the chosen and correct options stay above', () => {
  // Options measured at y=418–678; after scrolling by d every option bottom stays below the sticky header (~60px).
  const d = P.feedbackScrollDelta(744, 812)
  for (const bottom of [474, 542, 610, 678]) assert.ok(bottom - d > 60, `option ending at ${bottom}`)
})

test('bad measurements do not scroll', () => {
  assert.equal(P.feedbackScrollDelta(Number.NaN, 812), 0)
  assert.equal(P.feedbackScrollDelta(900, 0), 0)
})

test('the session scrolls to the feedback after an answer, and respects reduced motion', () => {
  // 2026-10-02: the feelings check-in was removed, so nothing delays the scroll.
  const fx = session.slice(session.indexOf('const feedbackRef'), session.indexOf('}, [answerState])'))
  assert.match(fx, /if \(answerState === null\) return/)
  assert.match(fx, /feedbackScrollDelta\(el\.getBoundingClientRect\(\)\.top, window\.innerHeight\)/)
  assert.match(fx, /prefers-reduced-motion: reduce/)
  assert.match(fx, /classList\.contains\('no-motion'\)/)
  // R2-11: the region is focusable (tabIndex -1) so lost focus can land there.
  assert.match(session, /<div ref=\{feedbackRef\} tabIndex=\{-1\} className="animate-slide-up focus:outline-none">/)
})

test('the result is announced from a live region that exists before the answer', () => {
  const at = session.indexOf('aria-live="polite"')
  assert.ok(at > 0)
  // The region must not sit inside {answerState !== null && …}, or it would be
  // inserted together with its text and screen readers would skip it.
  const before = session.slice(session.lastIndexOf('{/*', at), at)
  assert.doesNotMatch(before, /answerState !== null &&/)
  assert.match(session.slice(at, at + 400), /answerState === null\s*\?\s*''/)
})
