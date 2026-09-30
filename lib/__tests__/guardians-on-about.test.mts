// The guardians thank-you list lives on /about, not in the footer (UX loop 27;
// Yuna decision 7, 2026-09-30). The footer appears on every page, the home page included.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('the footer no longer renders the list', () => {
  const footer = readFileSync('components/Footer.tsx', 'utf8')
  assert.doesNotMatch(footer, /import GuardianCredits|<GuardianCredits/)
})

test('/about renders it once, as its own labelled section with an h2', () => {
  const about = readFileSync('app/about/AboutClient.tsx', 'utf8')
  assert.equal((about.match(/<GuardianCredits \/>/g) ?? []).length, 1)
  assert.match(about, /<section id="guardians" aria-labelledby="guardians-title"/)
  const g = readFileSync('components/GuardianCredits.tsx', 'utf8')
  assert.match(g, /<h2 id="guardians-title"/)
  // Still says it is a thank-you, not an endorsement or audit.
  assert.match(g, /This list is a thank-you, not an endorsement/)
})
