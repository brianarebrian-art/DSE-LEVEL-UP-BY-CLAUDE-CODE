// What the site tells strangers about itself (audit #8, 2026-10-04).
// robots.txt is public: it must hold crawler rules only, not team notes (names, dates, removed
// features, old domains). The framework is not announced in an X-Powered-By header.
import { test } from 'node:test'
import assert from 'node:assert/strict'

test('robots exposes crawler rules only and keeps page noindex readable', async () => {
  const { default: robots } = await import('../../app/robots.ts')
  const rules = robots().rules
  assert.ok(Array.isArray(rules))
  assert.deepEqual(rules.find(rule => rule.userAgent === '*'), { userAgent: '*', allow: '/', disallow: ['/api/'] })
})

test('next.config turns off the X-Powered-By header', async () => {
  const { default: config } = await import('../../next.config.ts')
  assert.equal(config.poweredByHeader, false)
})

// Founders' reply 19a (audit #10, 2026-10-04): /progress and /breathe returned 404 although
// the nav calls those pages 進度 and 呼吸空間. Not permanent, so the addresses stay free.
test('/progress and /breathe lead to the pages the nav names', async () => {
  const { default: config } = await import('../../next.config.ts')
  const rules = (await config.redirects?.()) ?? []
  for (const [source, destination] of [['/progress', '/dashboard'], ['/breathe', '/relax']]) {
    const r = rules.find((x: { source: string }) => x.source === source)
    assert.ok(r, `${source} has no redirect`)
    assert.equal(r.destination, destination)
    assert.equal(r.permanent, false)
  }
})
