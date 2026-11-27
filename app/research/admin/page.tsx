import { completeSeoMetadata } from '@/lib/seo'
import { Overview } from '@/components/research/Overview'

export const metadata = completeSeoMetadata({
  title: '研究總覽 | DSE Level Up',
  description: 'DSE Level Up 用戶研究總覽。完成率、滿意度、NPS 同任務完成由呢部瀏覽器嘅示範回覆計出。',
}, '/research/admin')

export default function ResearchAdminPage() {
  return <Overview />
}
