'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { duplicateSurvey, createId } from '@/lib/research/surveys'
import { formatDay, SURVEY_STATUS_LABEL } from '@/lib/research/labels'
import { ResearchGate, useResearch } from '@/components/research/ResearchProvider'
import { Button } from '@/components/research/ui'

export function SurveyList() {
  return (
    <ResearchGate>
      <SurveyListBody />
    </ResearchGate>
  )
}

function SurveyListBody() {
  const { store, update } = useResearch()
  const router = useRouter()
  if (!store) return null
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink">問卷</h1>
          <p className="mt-1 text-sm text-ink-soft">草稿唔會出現喺公開列表。複本會變成新草稿。</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            const id = createId('sv')
            const now = new Date().toISOString()
            update((current) => ({
              ...current,
              surveys: [
                {
                  id,
                  name: '未命名問卷',
                  description: '',
                  purpose: '',
                  startsOn: '',
                  endsOn: '',
                  status: 'draft',
                  questions: [],
                  updatedAt: now,
                },
                ...current.surveys,
              ],
            }))
            router.push(`/research/admin/surveys/${id}`)
          }}
        >
          新問卷
        </Button>
      </div>
      <ul className="space-y-3">
        {store.surveys.map((survey) => {
          const count = store.responses.filter((response) => response.surveyId === survey.id).length
          return (
            <li key={survey.id} className="rounded-2xl border border-line bg-surface-raised p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-warning">{SURVEY_STATUS_LABEL[survey.status]}</p>
                  <h2 className="mt-1 text-lg font-semibold text-ink">{survey.name}</h2>
                  <p className="mt-1 text-sm text-ink-muted">
                    {formatDay(survey.startsOn)} 至 {formatDay(survey.endsOn)} · {count} 份回覆
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/research/admin/surveys/${survey.id}`} className="inline-flex min-h-11 items-center rounded-lg border border-line-strong px-3 text-sm text-ink">
                    編輯
                  </Link>
                  <Button
                    onClick={() => {
                      const copy = duplicateSurvey(survey, new Date().toISOString(), {
                        surveyId: createId('sv'),
                        questionIds: survey.questions.map(() => createId('q')),
                      })
                      update((current) => ({ ...current, surveys: [copy, ...current.surveys] }))
                      router.push(`/research/admin/surveys/${copy.id}`)
                    }}
                  >
                    複本
                  </Button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
