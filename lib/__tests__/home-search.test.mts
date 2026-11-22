import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
const pick = <T,>(m: T): T => ((m as { default?: T }).default ?? m)
const { HOME_FAQS, HOME_INTRO, HOME_ROUTES } = pick(await import('../homeContent.ts'))
const { faqPageSchema, localiseFaq } = pick(await import('../faq.ts'))
const { googleVerification } = pick(await import('../searchVerification.ts'))
const { SESSION_SIZE } = pick(await import('../entitlements.ts'))
const { SITE_ORIGIN } = pick(await import('../site.ts'))

const read = (path: string) => readFileSync(path, 'utf8')

test('home answer states the real audience, free content and independent status in both languages', () => {
  assert.match(HOME_INTRO.zh, /香港考生.*免費.*原創改寫/)
  assert.match(HOME_INTRO.zh, /並非考評局官方/)
  assert.match(HOME_INTRO.en, /Hong Kong DSE/)
  assert.match(HOME_INTRO.en, /not an official HKEAA/)
  assert.ok([...HOME_INTRO.zh].length >= 40 && [...HOME_INTRO.zh].length <= 70)
})

test('home learning cards reach existing public routes, not placeholder service pages', () => {
  assert.equal(new Set(HOME_ROUTES.map(r => r.href)).size, HOME_ROUTES.length)
  for (const route of HOME_ROUTES) {
    assert.ok(existsSync(`app${route.href}/page.tsx`), route.href)
    for (const value of [route.labelZh, route.labelEn, route.detailZh, route.detailEn]) assert.ok(value.trim())
  }
})

test('FAQ and structured data share actual product rules in each language', () => {
  for (const en of [false, true]) {
    const items = localiseFaq(HOME_FAQS, en)
    const schema = faqPageSchema(items, `${SITE_ORIGIN}/`)
    assert.equal(items.length, 4)
    assert.deepEqual(schema.mainEntity.map(q => [q.name, q.acceptedAnswer.text]), items.map(x => [x.q, x.a]))
    const account = items[1].a
    assert.ok(account.includes(String(SESSION_SIZE)))
    assert.match(account, en ? /one set.*After that, sign in with Google/ : /一節試用.*之後需用 Google 登入/)
    assert.match(items[2].a, en ? /not been reviewed by registered teachers/ : /未經註冊教師審定/)
    assert.match(items[3].a, en ? /does not.*AI-grade/ : /不會.*AI 作文評分/)
  }
})

test('home wires visible content and server FAQ schema from one source', () => {
  const client = read('app/HomePageClient.tsx')
  assert.match(client, /en \? HOME_INTRO.en : HOME_INTRO.zh/)
  assert.match(client, /HOME_ROUTES.map\(/)
  assert.match(client, /localiseFaq\(HOME_FAQS, en\)/)
  assert.match(client, /faq.map\(/)
  const page = read('app/page.tsx')
  assert.match(page, /faqPageSchema\(localiseFaq\(HOME_FAQS, false\)/)
})

test('Google verification omits unset values and uses only the supplied token', () => {
  assert.equal(googleVerification(undefined), undefined)
  assert.equal(googleVerification(''), undefined)
  assert.equal(googleVerification(' \n '), undefined)
  assert.deepEqual(googleVerification(' test-only-token '), { google: 'test-only-token' })
  assert.match(read('app/layout.tsx'), /verification: googleVerification\(process.env.NEXT_PUBLIC_GSC_VERIFICATION_TOKEN\)/)
})
