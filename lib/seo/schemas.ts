import type { AnyQuestion } from '@/data/questions/types'

export function qaPageJsonLd(question: AnyQuestion, subjectName: string, url: string) {
  const isMc = question.type === 'mc'
  const optionsText = isMc && question.options ? question.options.join('\n') : ''
  const answerText = isMc && question.options ? question.options[question.correctIndex] : ''
  const stemText = question.content || ''

  return {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: `[${subjectName}] ${stemText.slice(0, 80)}`,
      text: `${stemText}\n${optionsText}`,
      answerCount: 1,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${answerText}\n\n解析：${question.explanation || ''}`,
        url: url,
      },
    },
  }
}

export function faqPageJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  }
}

import { SITE_ORIGIN } from '@/lib/site'

export function courseJsonLd(courseName: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: courseName,
    description: description,
    provider: {
      '@type': 'Organization',
      name: 'DSE Level Up',
      sameAs: SITE_ORIGIN,
    },
    url: url,
  }
}
