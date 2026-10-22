import type { Metadata } from 'next'
import { SITE_ORIGIN } from '@/lib/site'

export function createSeoMetadata({ title, description, path, type = 'website' }: { title: string; description: string; path: string; type?: 'website' | 'article' }): Metadata {
  const url = `${SITE_ORIGIN}${path}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type, siteName: 'DSE Level Up', locale: 'zh_HK', images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'DSE Level Up 香港文憑試學習平台' }] },
    twitter: { card: 'summary_large_image', title, description, images: ['/opengraph-image'] },
  }
}

export function jsonLd(data: Record<string, unknown>) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', ...data }) }} />
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return jsonLd({ '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: `${SITE_ORIGIN}${item.path}` })) })
}
