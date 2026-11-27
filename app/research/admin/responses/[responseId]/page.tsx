import type { Metadata } from 'next'
import { completeSeoMetadata } from '@/lib/seo'
import { ResponseDetail } from '@/components/research/ResponseDetail'

export async function generateMetadata({ params }: { params: Promise<{ responseId: string }> }): Promise<Metadata> {
  const { responseId } = await params
  return completeSeoMetadata({
    title: '回覆詳情 | DSE Level Up',
    description: '檢視單份用戶研究回覆、標籤同處理狀態。受訪者只有匿名編號。',
  }, `/research/admin/responses/${responseId}`)
}

export default async function ResearchResponseDetailPage({ params }: { params: Promise<{ responseId: string }> }) {
  const { responseId } = await params
  return <ResponseDetail responseId={responseId} />
}
