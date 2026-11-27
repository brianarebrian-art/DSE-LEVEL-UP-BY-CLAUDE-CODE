import { formatAnswer, completionRate, npsScore, responseSus, satisfactionScore, taskAnswers, taskSuccessRate } from '@/lib/research/metrics'
import { RESPONSE_STATUS_LABEL, TAG_LABEL } from '@/lib/research/labels'
import type { Survey, SurveyResponse } from '@/lib/research/types'

function cell(value: string | number | null): string {
  const text = value == null ? '' : String(value)
  if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`
  return text
}

export function responsesToCsv(surveys: readonly Survey[], responses: readonly SurveyResponse[]): string {
  const surveyById = new Map(surveys.map((survey) => [survey.id, survey]))
  const questionColumns = surveys.flatMap((survey) =>
    survey.questions.map((question) => ({
      key: `${survey.id}:${question.id}`,
      header: `${survey.name}｜${question.prompt}`,
      surveyId: survey.id,
      question,
    })),
  )
  const headers = [
    'ID',
    '受訪編號',
    '時間',
    '問卷',
    '完成率',
    '滿意度',
    'NPS',
    'SUS',
    '任務完成率',
    '標籤',
    '狀態',
    ...questionColumns.map((column) => column.header),
  ]
  const lines = [headers.map(cell).join(',')]
  for (const response of responses) {
    const survey = surveyById.get(response.surveyId)
    const completion = survey ? completionRate(survey, response) : null
    const satisfaction = survey ? satisfactionScore(survey, response) : null
    const nps = survey ? npsScore(survey, response) : null
    const sus = survey ? responseSus(survey, response) : null
    const tasks = survey ? taskSuccessRate(taskAnswers(survey, response)) : null
    const row = [
      response.id,
      response.respondentCode,
      response.submittedAt,
      survey?.name ?? '',
      completion == null ? '' : Math.round(completion * 1000) / 1000,
      satisfaction == null ? '' : Math.round(satisfaction * 100) / 100,
      nps == null ? '' : nps,
      sus == null ? '' : Math.round(sus * 10) / 10,
      tasks == null ? '' : Math.round(tasks * 1000) / 1000,
      response.tags.map((tag) => TAG_LABEL[tag]).join('、'),
      RESPONSE_STATUS_LABEL[response.status],
      ...questionColumns.map((column) =>
        column.surveyId === response.surveyId && survey
          ? formatAnswer(column.question, response.answers[column.question.id])
          : '',
      ),
    ]
    lines.push(row.map(cell).join(','))
  }
  return `\uFEFF${lines.join('\r\n')}`
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
