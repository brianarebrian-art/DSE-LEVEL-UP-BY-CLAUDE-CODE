import type { Metadata } from 'next'
import { completeSeoMetadata } from '@/lib/seo'
import { ThanksPage } from '@/components/research/ThanksPage'

export async function generateMetadata({ params }: { params: Promise<{ surveyId: string }> }): Promise<Metadata> {
  const { surveyId } = await params
  return completeSeoMetadata({
    title: '已收到回覆 | DSE Level Up',
    description: '用戶研究問卷已收到。回覆只留喺呢部瀏覽器，可以再填另一份或返回首頁。',
  }, `/research/s/${surveyId}/thanks`)
}

export default async function ResearchThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>
}) {
  const { code } = await searchParams
  return <ThanksPage code={code ?? ''} />
}
