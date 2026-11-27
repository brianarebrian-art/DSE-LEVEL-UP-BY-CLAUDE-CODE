import type { Metadata } from 'next'
import { completeSeoMetadata } from '@/lib/seo'
import { SurveyBuilder } from '@/components/research/SurveyBuilder'

export async function generateMetadata({ params }: { params: Promise<{ surveyId: string }> }): Promise<Metadata> {
  const { surveyId } = await params
  return completeSeoMetadata({
    title: '編輯問卷 | DSE Level Up',
    description: '編輯用戶研究問卷嘅名稱、目的、題目同連結。二維碼位置只係預留，未產生可掃描嘅碼。',
  }, `/research/admin/surveys/${surveyId}`)
}

export default async function EditSurveyPage({ params }: { params: Promise<{ surveyId: string }> }) {
  const { surveyId } = await params
  return <SurveyBuilder surveyId={surveyId} />
}
