// Official Instagram/Threads links (audit loop T03, 2026-10-02): footer and About only,
// through the exit gate, never on a share card.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (p: string) => readFileSync(p, 'utf8')

test('footer and About render the official accounts through ExternalLinkGate', () => {
  for (const f of ['components/Footer.tsx', 'app/about/AboutClient.tsx']) {
    const s = read(f)
    assert.match(s, /OFFICIAL_SOCIAL\.map/, f)
    assert.match(s, /<ExternalLinkGate[\s\S]{0,80}href=\{s\.href\}/, f)
  }
  const site = read('lib/site.ts')
  assert.match(site, /https:\/\/www\.instagram\.com\/dselevelup/)
  assert.match(site, /https:\/\/www\.threads\.com\/@dselevelup/)
})

test('share cards do not carry the official accounts', () => {
  for (const f of ['components/DailyStatsCard.tsx', 'components/CauseCard.tsx']) {
    assert.doesNotMatch(read(f), /OFFICIAL_SOCIAL|instagram\.com\/dselevelup|threads\.com/, f)
  }
})
