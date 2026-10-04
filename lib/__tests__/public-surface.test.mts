// What the site tells strangers about itself (audit #8, 2026-10-04).
// robots.txt is public: it must hold crawler rules only, not team notes (names, dates, removed
// features, old domains). The framework is not announced in an X-Powered-By header.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('robots.txt carries no internal notes', () => {
  const robots = readFileSync('public/robots.txt', 'utf8')
  const comments = robots.split('\n').filter((l) => l.startsWith('#')).join('\n')
  assert.doesNotMatch(comments, /Brian|Yuna|拍板|20\d\d-\d\d-\d\d|teacher|老師|dse-level-up\.vercel\.app|[一-鿿]/)
  assert.match(robots, /^User-agent: \*$/m)
  assert.match(robots, /^Disallow: \/api\/$/m)
})

test('next.config turns off the X-Powered-By header', async () => {
  const { default: config } = await import('../../next.config.ts')
  assert.equal(config.poweredByHeader, false)
})
