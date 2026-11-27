import { notFound } from 'next/navigation'
import { completeSeoMetadata } from '@/lib/seo'
import { isResearchRouteHidden } from '@/lib/research/availability'
import { ResearchProvider } from '@/components/research/ResearchProvider'

export const dynamic = 'force-dynamic'

export const metadata = completeSeoMetadata({
  title: '用戶研究 | DSE Level Up',
  description: 'DSE Level Up 用戶研究。問卷同回覆只留喺呢部瀏覽器，唔會收集姓名、電郵或學校。正式網站未核准公開。',
}, '/research')

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  if (isResearchRouteHidden()) notFound()
  return <ResearchProvider>{children}</ResearchProvider>
}
