import { completeSeoMetadata } from '@/lib/seo'
import { AnalyticsPanel } from '@/components/research/AnalyticsPanel'

export const metadata = completeSeoMetadata({
  title: '研究分析 | DSE Level Up',
  description: '由示範回覆計算完成率、滿意度、NPS、任務完成、標籤排名同優先改善建議。唔係考評局數據。',
}, '/research/admin/analytics')

export default function ResearchAnalyticsPage() {
  return <AnalyticsPanel />
}
