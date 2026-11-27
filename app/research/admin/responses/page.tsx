import { completeSeoMetadata } from '@/lib/seo'
import { ResponseTable } from '@/components/research/ResponseTable'

export const metadata = completeSeoMetadata({
  title: '研究回覆 | DSE Level Up',
  description: '檢視、篩選同匯出 DSE Level Up 用戶研究回覆。受訪者只有匿名編號。',
}, '/research/admin/responses')

export default function ResearchResponsesPage() {
  return <ResponseTable />
}
