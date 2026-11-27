import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { notFound } from 'next/navigation'
import { FirstPassGradePreview } from '@/components/loop/FirstPassGradePreview'
import { isFirstPassGradeRouteHidden, type FirstPassSummary } from '@/lib/loop-engineering/first-pass-abc'
import { completeSeoMetadata } from '@/lib/seo'

// 首輪分級預覽。正式環境回 404，不進入學生練習、目錄或批改。
export const dynamic = 'force-dynamic'

export const metadata = completeSeoMetadata({
  title: '在練題首輪分級預覽 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '只供預覽環境檢視未經核實的首輪分級。正式環境不提供，亦不改變學生練習。', // i18n-exempt: zh-Hant fixed search metadata
}, '/dev/first-pass-grades')

export default function FirstPassGradesPage() {
  if (isFirstPassGradeRouteHidden()) notFound()
  const summary = JSON.parse(readFileSync(join(process.cwd(), 'data/loop-engineering/first-pass-abc/summary.json'), 'utf8')) as FirstPassSummary
  return <FirstPassGradePreview summary={summary} />
}
