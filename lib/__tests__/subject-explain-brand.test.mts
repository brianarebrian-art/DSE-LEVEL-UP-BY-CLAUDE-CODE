// /subject 精解頁只可以向搜尋引擎同答案引擎報一個產品名。
// 舊品牌留喺標題、描述、FAQ 或 JSON-LD，會同 DSE Level Up 被當成兩個實體。
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Metadata } from 'next'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const OLD_BRAND = '考試急症室'
const BRAND = 'DSE Level Up'
const EXPLAIN_PAGE = 'app/subject/[subject]/[topic]/[id]/page.tsx'

function textField(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

test('subject explain generation path has no old brand string', () => {
  const page = readFileSync(join(ROOT, EXPLAIN_PAGE), 'utf8')
  const helper = readFileSync(join(ROOT, 'lib/subjectExplainSeo.ts'), 'utf8')
  const claims = readFileSync(join(ROOT, 'scripts/claims-guard.mjs'), 'utf8')
  assert.equal(page.includes(OLD_BRAND), false, EXPLAIN_PAGE)
  assert.equal(helper.includes(OLD_BRAND), false, 'lib/subjectExplainSeo.ts')
  assert.match(page, /subjectExplainSeo\(/)
  assert.match(page, /href="\/"[^>]*>DSE Level Up<\/Link>/)
  assert.doesNotMatch(page, /title:\s*`[^`]*\|/)
  assert.match(claims, /lib\/subjectExplainSeo\.ts/)
})

test('math_quad_1 explain title, FAQ and JSON-LD name one product', async () => {
  const subjectsMod = await import('../../data/subjects.ts')
  const questionsMod = await import('../../data/questions/index.ts')
  const seoMod = await import('../subjectExplainSeo.ts')
  const siteSeo = await import('../seo.ts')
  const routeMod = await import('../../app/subject/[subject]/[topic]/[id]/page.tsx')

  const S = (subjectsMod as { default?: typeof subjectsMod }).default ?? subjectsMod
  const Q = (questionsMod as { default?: typeof questionsMod }).default ?? questionsMod
  const seoApi = (seoMod as { default?: typeof seoMod }).default ?? seoMod
  const route = typeof routeMod.generateMetadata === 'function'
    ? routeMod
    : (routeMod as unknown as { default?: typeof routeMod }).default ?? routeMod

  assert.equal(siteSeo.SITE_NAME, BRAND)

  const subjectId = 'math'
  const id = 'math_quad_1'
  const meta = S.getSubject(subjectId)
  assert.ok(meta)
  const question = Q.getSubjectQuestions(subjectId).find((q) => q.id === id)
  assert.ok(question, 'math_quad_1 is in the maths bank')
  const topicName = question.topicZh || question.topic
  const pagePath = `/subject/${subjectId}/${question.topic}/${id}`

  const seo = seoApi.subjectExplainSeo({
    subjectId,
    subjectName: meta.name,
    topicName,
    questionContent: question.content,
    explanation: question.explanation,
    pagePath,
  })
  const blob = JSON.stringify(seo)
  assert.equal(blob.includes(OLD_BRAND), false)
  assert.equal(seo.title, `DSE 2026 ${meta.name} 題目精解 (${topicName}) | ${BRAND}`)
  assert.equal(
    seo.description,
    `DSE 2026 ${meta.name} (${topicName}) 題目解析與解題思維。${BRAND} 提供 DSE 考評局規格模擬題目與避陷提示。`,
  )
  assert.equal(seo.faq[1].question, `${BRAND} 點樣協助溫習 ${meta.name}？`)
  assert.equal(
    seo.faq[1].answer,
    `${BRAND} 提供零壓力、即時錯因診斷與間隔重複溫習，協助 DSE 考生穩固應試思維。`,
  )
  assert.doesNotMatch(blob, /訂閱|廣告|保證.*分|分數保證/)

  const [qa, faq, crumbs] = seo.jsonLd['@graph']
  assert.equal(qa.name, `DSE 2026 ${meta.name} ${topicName} 題目詳解 — ${BRAND}`)
  assert.equal(qa.url, `https://www.dselevelup.com${pagePath}`)
  assert.equal(faq.mainEntity[1]?.name, seo.faq[1].question)
  assert.equal(faq.mainEntity[1]?.acceptedAnswer.text, seo.faq[1].answer)
  assert.equal(faq.mainEntity[0]?.name, seo.faq[0].question)
  assert.equal(crumbs.itemListElement[0].name, BRAND)
  assert.equal(crumbs.itemListElement[0].item, 'https://www.dselevelup.com')
  assert.equal(crumbs.itemListElement[2].name, topicName)

  const metadata: Metadata = await route.generateMetadata({
    params: Promise.resolve({ subject: subjectId, topic: question.topic, id }),
  })
  assert.equal(textField(metadata.title), seo.title)
  assert.equal(metadata.description, seo.description)
  assert.equal(metadata.alternates?.canonical, `https://www.dselevelup.com${seo.pagePath}`)
  assert.equal(textField(metadata.openGraph && 'title' in metadata.openGraph ? metadata.openGraph.title : undefined), seo.title)
  assert.equal(metadata.openGraph && 'description' in metadata.openGraph ? metadata.openGraph.description : undefined, seo.description)
  assert.equal(metadata.openGraph && 'siteName' in metadata.openGraph ? metadata.openGraph.siteName : undefined, BRAND)
  assert.equal(textField(metadata.twitter && 'title' in metadata.twitter ? metadata.twitter.title : undefined), seo.title)
  assert.equal(metadata.twitter && 'description' in metadata.twitter ? metadata.twitter.description : undefined, seo.description)
  assert.equal(JSON.stringify(metadata).includes(OLD_BRAND), false)
})
