import type { Metadata } from 'next'
import HomePageClient from './HomePageClient'
import { createSeoMetadata, breadcrumbJsonLd } from '@/lib/seo'
import { homeSeoDescription } from '@/lib/dynamicSeoDescriptions'
import { JsonLd } from '@/components/Seo/JsonLd'

export const metadata: Metadata = createSeoMetadata({
  title: 'DSE Level Up | DSE 溫習平台 | 選擇題練判斷', // i18n-exempt: zh-Hant fixed search metadata
  description: homeSeoDescription(), // i18n-exempt: zh-Hant fixed search metadata
  path: '/',
  type: 'website',
})

export default function HomePage() {
  return <>
    <JsonLd data={breadcrumbJsonLd([{ name: 'DSE Level Up', path: '/' }])} />
    <HomePageClient />
  </>
}
