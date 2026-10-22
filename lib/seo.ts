import type { Metadata } from 'next'
import { SITE_ORIGIN } from '@/lib/site'

export const SITE_NAME = 'DSE Level Up'
export const DEFAULT_OG_IMAGE = '/opengraph-image'

export type SeoInput = {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
  image?: string
  noIndex?: boolean
}

export function createSeoMetadata({ title, description, path, type = 'article', image = DEFAULT_OG_IMAGE, noIndex = false }: SeoInput): Metadata {
  const url = new URL(path, SITE_ORIGIN).toString()
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      locale: 'zh_HK',
      title,
      description,
      images: [{ url: image, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

export const organizationJsonLd = {
  '@type': 'Organization',
  '@id': `${SITE_ORIGIN}/#organization`,
  name: SITE_NAME,
  url: SITE_ORIGIN,
  description: '為香港中學生提供原創 DSE 學習內容與工具的獨立教育平台。',
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, SITE_ORIGIN).toString(),
    })),
  }
}

export function articleJsonLd(input: { title: string; description: string; path: string; dateModified?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    dateModified: input.dateModified,
    author: organizationJsonLd,
    publisher: organizationJsonLd,
    mainEntityOfPage: new URL(input.path, SITE_ORIGIN).toString(),
    inLanguage: 'zh-HK',
  }
}

export function softwareApplicationJsonLd(input: { name: string; description: string; path: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: input.name,
    description: input.description,
    url: new URL(input.path, SITE_ORIGIN).toString(),
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web browser',
    isAccessibleForFree: true,
    audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
  }
}
