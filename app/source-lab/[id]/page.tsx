import { completeSeoMetadata } from '@/lib/seo'
import { notFound } from 'next/navigation'
import { sourceLabEntries, getSourceLabEntry } from '@/data/history-sources'
import { SITE_ORIGIN } from '@/lib/site'
import { JsonLd } from '@/components/Seo/JsonLd'
import { sourceLabSeoDescription } from '@/lib/dynamicSeoDescriptions'
import SourceLabClient from './SourceLabClient'

// 條目數目固定且細，全部 build time 預渲染。
export function generateStaticParams() {
  return sourceLabEntries.map((e) => ({ id: e.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const entry = getSourceLabEntry(id)
  if (!entry) notFound()
  return completeSeoMetadata({
    title: `${entry.titleZh} | 史料判讀室 | DSE Level Up`, // i18n-exempt: 靜態 SEO <title>（generateMetadata 唔跟 client locale）
    description: sourceLabSeoDescription({ title: entry.titleZh, date: entry.dateZh, place: entry.placeZh, factCount: entry.facts.length, perspectiveCount: entry.perspectives.length, positionCount: entry.positions.length }), // i18n-exempt: 同上
  }, `/source-lab/${id}`)
}

export default async function SourceLabEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const entry = getSourceLabEntry(id)
  if (!entry) notFound()
  const description = sourceLabSeoDescription({
    title: entry.titleZh,
    date: entry.dateZh,
    place: entry.placeZh,
    factCount: entry.facts.length,
    perspectiveCount: entry.perspectives.length,
    positionCount: entry.positions.length,
  })
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LearningResource',
        '@id': `${SITE_ORIGIN}/source-lab/${id}#resource`,
        url: `${SITE_ORIGIN}/source-lab/${id}`,
        name: entry.titleZh, // i18n-exempt: 與預設語言可見 H1 完全一致的 server-only JSON-LD 名稱
        description,
        learningResourceType: 'Source-analysis training',
        educationalLevel: 'Hong Kong Diploma of Secondary Education (HKDSE)',
        inLanguage: 'zh-HK',
        isAccessibleForFree: true,
        isPartOf: { url: `${SITE_ORIGIN}/source-lab` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_ORIGIN}/source-lab/${id}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DSE Level Up', item: SITE_ORIGIN },
          { '@type': 'ListItem', position: 2, name: '史料判讀室', item: `${SITE_ORIGIN}/source-lab` }, // i18n-exempt: 可見返回連結文字
          { '@type': 'ListItem', position: 3, name: entry.titleZh },
        ],
      },
    ],
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <SourceLabClient entry={entry} />
    </>
  )
}
