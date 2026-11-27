import { notFound } from 'next/navigation'
import { LoopDisclosurePreview } from '@/components/loop/LoopDisclosurePreview'
import { isLoopDisclosureRouteHidden } from '@/lib/loop-engineering/disclosure'
import { completeSeoMetadata } from '@/lib/seo'

// 披露文案預覽。正式環境回 404，不進入學生練習或成績頁。
export const dynamic = 'force-dynamic'

export const metadata = completeSeoMetadata({
  title: '披露文案預覽 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '只供預覽環境核對預測等級與題庫來源披露，正式環境不提供。', // i18n-exempt: zh-Hant fixed search metadata
}, '/dev/loop-disclosure')

export default function LoopDisclosurePage() {
  if (isLoopDisclosureRouteHidden()) notFound()
  return <LoopDisclosurePreview />
}
