// Structured data and AI-readable text added for founders' reply 61a (2026-10-09):
// organisation logo and official accounts, FAQPage on /about and on every subject page
// (same text as the visible FAQ), honest sitemap dates and corrected llms.txt claims.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (p: string) => readFileSync(p, 'utf8')
const { ABOUT_FAQS, localiseFaq, subjectFaq, faqPageSchema } = await import('../faq.ts')

test('Organization lists the logo and only the official accounts the site links', () => {
  const s = read('app/layout.tsx')
  assert.match(s, /logo: `\$\{SITE_URL\}\/icons\/owl-512\.png`/)
  assert.match(s, /sameAs: OFFICIAL_SOCIAL\.map\(\(s\) => s\.href\)/)
})

test('/about emits FAQPage from the same list the page shows', () => {
  assert.match(read('app/about/page.tsx'), /faqPageSchema\(localiseFaq\(ABOUT_FAQS, false\)/)
  const c = read('components/FAQSection.tsx')
  assert.match(c, /ABOUT_FAQS\.map\(/)
  assert.doesNotMatch(c, /const FAQS/, 'a second copy of the FAQ text would drift from the structured data')
  const schema = faqPageSchema(localiseFaq(ABOUT_FAQS, false), 'https://example.test/about')
  assert.equal(schema['@type'], 'FAQPage')
  assert.equal(schema.mainEntity.length, ABOUT_FAQS.length)
  assert.equal(schema.mainEntity[0].name, ABOUT_FAQS[0].qZh)
  assert.equal(schema.mainEntity[0].acceptedAnswer.text, ABOUT_FAQS[0].aZh)
})

test('subject pages build the visible FAQ and FAQPage with the same function and counts', () => {
  const page = read('app/subjects/[subject]/page.tsx')
  assert.match(page, /faqPageSchema\(faq,/)
  assert.match(page, /subjectFaq\(\s*\{ id: meta\.id, name: meta\.name, nameEn: meta\.nameEn, mc: mcCount, written: writtenCount, topics \},\s*false,/)
  const view = read('app/subjects/[subject]/SubjectDetailView.tsx')
  assert.match(view, /subjectFaq\(\s*\{ id: meta\.id, name: meta\.name, nameEn: meta\.nameEn, mc: typeCounts\.mc, written: writtenCount, topics \},\s*en,/)
  assert.match(view, /faq\.map\(/)
})

test('subjectFaq: counts from the input and honest provenance', () => {
  const topics = [
    { id: 'a', zh: '甲', count: 3, mcCount: 3, writtenCount: 0 },
    { id: 'b', zh: '乙', count: 0, mcCount: 0, writtenCount: 2 },
    { id: 'c', zh: '丙', count: 0, mcCount: 0, writtenCount: 0 },
  ] as never[]
  const math = subjectFaq({ id: 'math', name: '數學', nameEn: 'Maths', mc: 1234, written: 5, topics }, false)
  assert.equal(math.length, 3)
  assert.match(math[0].a, /1,234 條選擇題同 5 條書寫題，分佈喺 2 個課題/)
  assert.match(math[1].a, /未經註冊教師審定/)
  assert.doesNotMatch(math.map((f) => f.a).join(''), /人手覆核|教師審核|逐題覆核/)
  const eng = subjectFaq({ id: 'english', name: '英文', nameEn: 'English', mc: 10, written: 0, topics }, true)
  assert.equal(eng.length, 3)
  assert.doesNotMatch(eng[0].a, /written/, 'no written count when there are none')
})

// data/dse-paper-formats.ts is derived from HKEAA frameworks and takes no new uses after
// 2026-09-30 (CONTENT_PROVENANCE.md §3); FAQPage data is read by AI answer engines.
test('the FAQ is built from the site\'s own bank, not from HKEAA-derived data', () => {
  const src = read('lib/faq.ts').replace(/^\s*\/\/.*$/gm, '')
  assert.doesNotMatch(src, /dse-paper-formats|notPractisedHere|isMCExamFormat/)
})

test('sitemap writes only dates that have a record', () => {
  const s = read('app/sitemap.ts')
  assert.doesNotMatch(s.replace(/\/\/.*$/gm, ''), /new Date\(\)/)
  assert.match(s, /ARTICLE_DATES\[path\]/)
  assert.match(s, /BANK_UPDATED_AT\[id\]/)
})

test('llms.txt no longer carries the outdated or overstated claims', () => {
  const t = read('public/llms.txt')
  for (const bad of [
    /self-diagnosis follows any wrong/i,
    /asks the student to classify the cause/i,
    /These are always on/i,
    /written by hand/i,
    /audited by a person/i,
    /AI is never the final approver/i,
    /no audio at all/i,
  ]) {
    assert.doesNotMatch(t, bad)
  }
  assert.match(t, /not been reviewed by registered teachers/)
  // PageSpeed Insights (2026-10-09) marked llms.txt "contains no links": the format expects
  // Markdown links under its sections.
  assert.ok((t.match(/\]\(https:\/\/www\.dselevelup\.com\//g) ?? []).length >= 5, 'llms.txt needs Markdown links')
  assert.match(t, /opt-in and off by default/)
})
