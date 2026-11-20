// 2026-11-20 founder order: 不考之地 is removed. /cantonese stays, without that name
// and without a homepage card. Old URLs redirect home so they are not leftover cards.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

const read = (p: string) => readFileSync(p, 'utf8')

test('off-syllabus pages, data and share button are gone', () => {
  for (const p of [
    'app/off-syllabus/page.tsx',
    'app/off-syllabus/[category]/page.tsx',
    'data/offSyllabus/index.ts',
    'components/OffSyllabusShareButton.tsx',
  ]) {
    assert.equal(existsSync(p), false, p)
  }
  assert.ok(existsSync('app/cantonese/page.tsx'), '/cantonese must stay')
})

test('navigation, dictionary, sitemap and route manifest do not offer the section', () => {
  for (const p of ['components/Navbar.tsx', 'components/Sidebar.tsx', 'app/sitemap.ts', 'public/manus-routes.json']) {
    assert.doesNotMatch(read(p), /off-syllabus|offSyllabus|不考之地|Beyond the syllabus/)
  }
  assert.doesNotMatch(read('lib/dictionary.ts'), /offSyllabus|不考之地|Off the Syllabus|Beyond the syllabus/)
  assert.doesNotMatch(read('app/cantonese/CantoneseView.tsx'), /off-syllabus|offSyllabus/)
  assert.doesNotMatch(read('app/page.tsx'), /href="\/cantonese"/)
  assert.doesNotMatch(read('app/HomePageClient.tsx'), /href="\/cantonese"/)
})

test('old off-syllabus URLs redirect to the homepage', async () => {
  const { default: config } = await import('../../next.config.ts')
  const rules = (await config.redirects?.()) ?? []
  for (const source of ['/off-syllabus', '/off-syllabus/:category']) {
    const rule = rules.find((item: { source: string }) => item.source === source)
    assert.ok(rule, `${source} has no redirect`)
    assert.equal(rule.destination, '/')
    assert.equal(rule.permanent, true)
  }
})
