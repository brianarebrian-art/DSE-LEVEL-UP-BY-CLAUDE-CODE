import { notFound } from 'next/navigation'
import { LoopWeek58Preview } from '@/components/loop/LoopWeek58Preview'
import { isLoopDisclosureRouteHidden } from '@/lib/loop-engineering/disclosure'
import { loadWeek58PreviewModel } from '@/lib/loop-engineering/week58-batch'
import { completeSeoMetadata } from '@/lib/seo'

// 第 5–8 星期草稿預覽。正式環境回 404，不進入學生練習或成績頁。
export const dynamic = 'force-dynamic'

export const metadata = completeSeoMetadata({
  title: '升級草稿預覽 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '只供預覽環境檢視必修數學升級草稿，正式環境不提供，亦不進入練習池。', // i18n-exempt: zh-Hant fixed search metadata
}, '/dev/loop-week58')

export default function LoopWeek58Page() {
  if (isLoopDisclosureRouteHidden()) notFound()
  return <LoopWeek58Preview model={loadWeek58PreviewModel()} />
}
