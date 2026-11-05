import { JsonLd } from '@/components/Seo/JsonLd'

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQSchemaProps {
  faqs: FAQItem[]
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  if (!faqs || faqs.length === 0) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return <JsonLd data={schema} />
}
