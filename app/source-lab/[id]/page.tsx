import { notFound } from 'next/navigation'
import { sourceLabEntries, getSourceLabEntry } from '@/data/history-sources'
import SourceLabClient from './SourceLabClient'

// 條目數目固定且細，全部 build time 預渲染。
export function generateStaticParams() {
  return sourceLabEntries.map((e) => ({ id: e.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const entry = getSourceLabEntry(id)
  if (!entry) return { title: '史料判讀室 | DSE Level Up' } // i18n-exempt: 靜態 SEO <title> fallback
  return {
    title: `${entry.titleZh} | 史料判讀室 | DSE Level Up`, // i18n-exempt: 靜態 SEO <title>（generateMetadata 唔跟 client locale）
    description: `${entry.titleZh}（${entry.dateZh}）—— 事實層、詮釋層、立場層分離陳列，供 DSE 歷史科卷一資料題訓練。`, // i18n-exempt: 同上
    alternates: { canonical: `/source-lab/${id}` },
  }
}

export default async function SourceLabEntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const entry = getSourceLabEntry(id)
  if (!entry) notFound()

  return <SourceLabClient entry={entry} />
}
