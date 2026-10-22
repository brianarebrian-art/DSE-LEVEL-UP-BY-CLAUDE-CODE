import { test } from 'node:test'
import assert from 'node:assert/strict'
import type { Metadata } from 'next'

const { createSeoMetadata, completeSeoMetadata, articleJsonLd } = await import('../seo.ts')
const { shouldNoIndex, EDITORIAL_DRAFT_ROUTES } = await import('../seoPolicy.ts')
const { serializeJsonLd } = await import('../structuredData.ts')
const { SITE_ORIGIN } = await import('../site.ts')
const { default: sitemap } = await import('../../app/sitemap.ts')
const { default: robots } = await import('../../app/robots.ts')

const input = { title: '原創教學標題', description: '這是頁面真正的內容摘要。', path: '/test-topic' }

function policy(metadata: Metadata) {
  const value = metadata.robots
  assert.ok(value && typeof value === 'object')
  const google = value.googleBot
  assert.ok(google && typeof google === 'object')
  return { index: value.index, googleIndex: google.index }
}

test('metadata uses the explicit production origin and complete sharing fields', () => {
  const result = createSeoMetadata(input)
  assert.equal(result.alternates?.canonical, `${SITE_ORIGIN}/test-topic`)
  assert.equal(result.openGraph?.url, `${SITE_ORIGIN}/test-topic`)
  assert.ok(result.twitter && 'card' in result.twitter)
  assert.equal(result.twitter.card, 'summary_large_image')
  assert.ok(JSON.stringify(result.openGraph).includes(`${SITE_ORIGIN}/opengraph-image`))
  assert.throws(() => createSeoMetadata({ ...input, path: '//example.test/topic' }))
})

test('private, test, personalised and incomplete pages cannot inherit index=true', () => {
  for (const path of ['/account', '/admin', '/admin/quality', '/dev/answer-cards', '/dashboard', '/result', '/practice', '/ai/practice-generator', ...EDITORIAL_DRAFT_ROUTES]) {
    assert.equal(shouldNoIndex(path), true, path)
    assert.deepEqual(policy(createSeoMetadata({ ...input, path })), { index: false, googleIndex: false })
  }
  assert.equal(shouldNoIndex('/dse-maths'), false)
  assert.equal(shouldNoIndex('/accounting'), false)
})

test('legacy completion keeps explicit noindex and overwrites conflicting canonical', () => {
  const result = completeSeoMetadata({ title: '帳戶', description: '帳戶外殼', robots: { index: false }, alternates: { canonical: '/' } }, '/account')
  assert.equal(result.alternates?.canonical, `${SITE_ORIGIN}/account`)
  assert.equal(policy(result).index, false)
  assert.equal(result.openGraph?.title, '帳戶')
})

test('JSON-LD safely round-trips HTML-sensitive text without ending a script', () => {
  const data = { text: '</script><script>alert(1)</script>&\u2028\u2029' }
  const safe = serializeJsonLd(data)
  assert.ok(!safe.includes('<'))
  assert.ok(!safe.includes('&'))
  assert.deepEqual(JSON.parse(safe), data)
})

test('Article omits unverified dates and never invents reviews or ratings', () => {
  const schema = articleJsonLd(input)
  assert.equal(schema.headline, input.title)
  assert.equal(schema.mainEntityOfPage['@id'], `${SITE_ORIGIN}/test-topic`)
  assert.ok(!('dateModified' in schema))
  assert.ok(!('aggregateRating' in schema))
  assert.ok(!('review' in schema))
})

test('sitemap excludes every noindex route and has no duplicate canonical URLs', () => {
  const rows = sitemap()
  const urls = rows.map(row => row.url)
  assert.equal(new Set(urls).size, urls.length)
  for (const url of urls) {
    assert.equal(new URL(url).origin, SITE_ORIGIN)
    assert.equal(shouldNoIndex(new URL(url).pathname), false, url)
  }
  for (const path of EDITORIAL_DRAFT_ROUTES) assert.ok(!urls.includes(SITE_ORIGIN + path))
  // 任務外殼唔應出現喺 sitemap 輸出，亦唔應誤寫入 STATIC_ROUTES 清單。
  assert.ok(!urls.includes(`${SITE_ORIGIN}/practice`))
})

test('STATIC_ROUTES must not list noindex paths (avoids maintainer traps)', async () => {
  const { readFileSync } = await import('node:fs')
  const { join } = await import('node:path')
  const { fileURLToPath } = await import('node:url')
  const root = fileURLToPath(new URL('../..', import.meta.url))
  const src = readFileSync(join(root, 'app/sitemap.ts'), 'utf8')
  const block = src.slice(src.indexOf('STATIC_ROUTES'), src.indexOf('export default'))
  const listed = [...block.matchAll(/path:\s*'([^']*)'/g)].map((m) => m[1] || '/')
  for (const path of listed) {
    const normalised = path || '/'
    assert.equal(
      shouldNoIndex(normalised),
      false,
      `STATIC_ROUTES lists noindex path ${normalised} — remove it; filter alone is not enough documentation`,
    )
  }
})

test('robots permits reading page noindex, CSS, JS and images', () => {
  assert.equal(robots().sitemap, SITE_ORIGIN + '/sitemap.xml')
  const rules = robots().rules
  assert.ok(Array.isArray(rules))
  for (const rule of rules) assert.deepEqual(rule.disallow, ['/api/'])
})
