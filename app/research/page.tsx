import { completeSeoMetadata } from '@/lib/seo'
import { PublicHome } from '@/components/research/PublicHome'

export const metadata = completeSeoMetadata({
  title: '公開問卷 | DSE Level Up',
  description: 'DSE Level Up 用戶研究嘅公開問卷。回覆只留喺呢部瀏覽器，內容關於練習流程、題庫同可列印練習卷。',
}, '/research')

export default function ResearchHomePage() {
  return <PublicHome />
}
