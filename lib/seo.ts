import type { Metadata } from 'next'
import { SITE_ORIGIN } from '@/lib/site'
import { shouldNoIndex } from '@/lib/seoPolicy'

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
  if (!path.startsWith('/') || path.startsWith('//')) throw new Error('SEO paths must be site-relative')
  const url = new URL(path, SITE_ORIGIN).toString()
  const imageUrl = new URL(image, SITE_ORIGIN).toString()
  const blocked = noIndex || shouldNoIndex(path)
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: {
      index: !blocked,
      follow: true,
      googleBot: { index: !blocked, follow: true, 'max-image-preview': 'large' },
    },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      locale: 'zh_HK',
      title,
      description,
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [imageUrl] },
  }
}

/** Complete legacy metadata without changing route-specific titles or extra fields. */
export function completeSeoMetadata(input: Metadata, path: string): Metadata {
  const titleValue = input.title
  const title = typeof titleValue === 'string' ? titleValue :
    titleValue && 'absolute' in titleValue ? titleValue.absolute :
    titleValue && 'default' in titleValue ? titleValue.default : SITE_NAME
  const robots = input.robots
  const explicitlyBlocked = typeof robots === 'object' && robots !== null && robots.index === false
  const noIndex = explicitlyBlocked || typeof robots === 'string' && robots.includes('noindex')
  const og = input.openGraph
  const type = og && 'type' in og && og.type === 'article' ? 'article' : 'website'
  const generated = createSeoMetadata({ title, description: input.description ?? '', path, type, noIndex })
  return {
    ...input,
    ...generated,
    alternates: { ...input.alternates, canonical: generated.alternates?.canonical },
    openGraph: { ...input.openGraph, ...generated.openGraph },
    twitter: { ...input.twitter, ...generated.twitter },
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
  const url = new URL(input.path, SITE_ORIGIN).toString()
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    author: organizationJsonLd,
    publisher: organizationJsonLd,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    image: new URL(DEFAULT_OG_IMAGE, SITE_ORIGIN).toString(),
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
