import type { Metadata } from 'next'
import { completeSeoMetadata } from '@/lib/seo'
import { RespondentPage } from '@/components/research/RespondentForm'

export async function generateMetadata({ params }: { params: Promise<{ surveyId: string }> }): Promise<Metadata> {
  const { surveyId } = await params
  return completeSeoMetadata({
    title: '填寫問卷 | DSE Level Up',
    description: '填寫 DSE Level Up 用戶研究問卷。回覆只留喺呢部瀏覽器，唔會收集姓名、電郵或學校。',
  }, `/research/s/${surveyId}`)
}

export default async function FillSurveyPage({
  params,
  searchParams,
}: {
  params: Promise<{ surveyId: string }>
  searchParams: Promise<{ preview?: string }>
}) {
  const { surveyId } = await params
  const query = await searchParams
  return <RespondentPage surveyId={surveyId} allowUnpublished={query.preview === '1'} />
}
