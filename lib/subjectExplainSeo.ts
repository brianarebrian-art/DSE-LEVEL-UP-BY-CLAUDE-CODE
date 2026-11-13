import { SITE_NAME } from '@/lib/seo'
import { SITE_ORIGIN } from '@/lib/site'

/**
 * /subject/[subject]/[topic]/[id] 精解頁嘅搜尋與答案引擎文案。
 *
 * 標題、meta description、Open Graph／Twitter（由 completeSeoMetadata 抄過去）、
 * 可見 FAQ、QAPage、FAQPage 同 BreadcrumbList 全部由呢個函數出。
 * 品牌只使用 SITE_NAME，避免精解頁再出現第二個產品名。
 */
export type SubjectExplainFaq = {
  question: string
  answer: string
}

export type SubjectExplainJsonLd = {
  '@context': 'https://schema.org'
  '@graph': [
    {
      '@type': 'QAPage'
      '@id': string
      name: string
      url: string
      mainEntity: {
        '@type': 'Question'
        name: string
        text: string
        answerCount: 1
        acceptedAnswer: {
          '@type': 'Answer'
          text: string
          url: string
        }
      }
    },
    {
      '@type': 'FAQPage'
      '@id': string
      mainEntity: Array<{
        '@type': 'Question'
        name: string
        acceptedAnswer: {
          '@type': 'Answer'
          text: string
        }
      }>
    },
    {
      '@type': 'BreadcrumbList'
      '@id': string
      itemListElement: [
        { '@type': 'ListItem'; position: 1; name: string; item: string },
        { '@type': 'ListItem'; position: 2; name: string; item: string },
        { '@type': 'ListItem'; position: 3; name: string },
      ]
    },
  ]
}

export type SubjectExplainSeo = {
  title: string
  description: string
  pagePath: string
  faq: [SubjectExplainFaq, SubjectExplainFaq]
  jsonLd: SubjectExplainJsonLd
}

export function subjectExplainSeo(input: {
  subjectId: string
  subjectName: string
  topicName: string
  questionContent: string
  explanation?: string
  pagePath: string
}): SubjectExplainSeo {
  const { subjectId, subjectName, topicName, questionContent, explanation, pagePath } = input
  const pageUrl = new URL(pagePath, SITE_ORIGIN).toString()
  const title = `DSE 2026 ${subjectName} 題目精解 (${topicName}) | ${SITE_NAME}`
  const description = `DSE 2026 ${subjectName} (${topicName}) 題目解析與解題思維。${SITE_NAME} 提供 DSE 考評局規格模擬題目與避陷提示。`
  const faq: [SubjectExplainFaq, SubjectExplainFaq] = [
    {
      question: `呢題 DSE 2026 ${subjectName} (${topicName}) 考核重點係咩？`,
      answer: `本題針對 DSE 2026 ${subjectName} 課程重點考核 ${topicName} 核心概念，訓練審題與計算精確度。`,
    },
    {
      question: `${SITE_NAME} 點樣協助溫習 ${subjectName}？`,
      answer: `${SITE_NAME} 提供零壓力、即時錯因診斷與間隔重複溫習，協助 DSE 考生穩固應試思維。`,
    },
  ]

  return {
    title,
    description,
    pagePath,
    faq,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'QAPage',
          '@id': `${pageUrl}#qapage`,
          name: `DSE 2026 ${subjectName} ${topicName} 題目詳解 — ${SITE_NAME}`,
          url: pageUrl,
          mainEntity: {
            '@type': 'Question',
            name: questionContent,
            text: questionContent,
            answerCount: 1,
            acceptedAnswer: {
              '@type': 'Answer',
              text: explanation || '題目詳細解析請參考解題步驟與概念重點。',
              url: pageUrl,
            },
          },
        },
        {
          '@type': 'FAQPage',
          '@id': `${pageUrl}#faq`,
          mainEntity: faq.map((item) => ({
            '@type': 'Question' as const,
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer' as const,
              text: item.answer,
            },
          })),
        },
        {
          '@type': 'BreadcrumbList',
          '@id': `${pageUrl}#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_ORIGIN },
            { '@type': 'ListItem', position: 2, name: subjectName, item: `${SITE_ORIGIN}/subjects/${subjectId}` },
            { '@type': 'ListItem', position: 3, name: topicName },
          ],
        },
      ],
    },
  }
}
