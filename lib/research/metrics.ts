import { LIKERT_HINT, NPS_HINT, TAG_LABEL, TASK_LABEL } from '@/lib/research/labels'
import { susScore } from '@/lib/research/sus'
import type {
  AnswerValue,
  Question,
  ResponseFilters,
  Survey,
  SurveyResponse,
  TagId,
  TaskValue,
} from '@/lib/research/types'

export function answerFor<T extends AnswerValue['type']>(
  question: Question,
  answers: Record<string, AnswerValue>,
  type: T,
): Extract<AnswerValue, { type: T }> | null {
  const value = answers[question.id]
  if (!value || value.type !== type || question.type !== type) return null
  return value as Extract<AnswerValue, { type: T }>
}

export function isAnswered(question: Question, answer: AnswerValue | undefined): boolean {
  if (!answer || answer.type !== question.type) return false
  switch (answer.type) {
    case 'single':
      return question.options.some((option) => option.id === answer.optionId)
    case 'multiple':
      return answer.optionIds.some((id) => question.options.some((option) => option.id === id))
    case 'likert':
      return Number.isInteger(answer.score) && answer.score >= 1 && answer.score <= 5
    case 'nps':
      return Number.isInteger(answer.score) && answer.score >= 0 && answer.score <= 10
    case 'text':
      return answer.text.trim().length > 0
    case 'task':
      return answer.value === 'done' || answer.value === 'partial' || answer.value === 'unable'
    case 'sus':
      return susScore(answer.scores) != null
    default:
      return false
  }
}

export function requiredMessage(question: Question): string {
  switch (question.type) {
    case 'single':
    case 'task':
      return '請揀一個選項。'
    case 'multiple':
      return '請至少揀一項。'
    case 'likert':
      return '請揀 1 至 5。'
    case 'nps':
      return '請揀 0 至 10。'
    case 'text':
      return '請填寫呢題。'
    case 'sus':
      return '請為十句各揀一次。'
    default:
      return '請完成呢題。'
  }
}

export function questionError(question: Question, answer: AnswerValue | undefined): string | null {
  if (!question.required && !isAnswered(question, answer)) return null
  if (!isAnswered(question, answer)) return requiredMessage(question)
  return null
}

export function completionRate(survey: Survey, response: SurveyResponse): number | null {
  if (survey.questions.length === 0) return null
  const done = survey.questions.filter((question) => isAnswered(question, response.answers[question.id])).length
  return done / survey.questions.length
}

export function satisfactionScore(survey: Survey, response: SurveyResponse): number | null {
  const scores = survey.questions.flatMap((question) => {
    const answer = answerFor(question, response.answers, 'likert')
    return answer && isAnswered(question, answer) ? [answer.score] : []
  })
  if (scores.length === 0) return null
  return scores.reduce((sum, score) => sum + score, 0) / scores.length
}

export function npsScore(survey: Survey, response: SurveyResponse): number | null {
  for (const question of survey.questions) {
    const answer = answerFor(question, response.answers, 'nps')
    if (answer && isAnswered(question, answer)) return answer.score
  }
  return null
}

export function responseSus(survey: Survey, response: SurveyResponse): number | null {
  const scores = survey.questions.flatMap((question) => {
    const answer = answerFor(question, response.answers, 'sus')
    if (!answer || !isAnswered(question, answer)) return []
    const score = susScore(answer.scores)
    return score == null ? [] : [score]
  })
  if (scores.length === 0) return null
  return scores.reduce((sum, score) => sum + score, 0) / scores.length
}

export function taskAnswers(survey: Survey, response: SurveyResponse): TaskValue[] {
  return survey.questions.flatMap((question) => {
    const answer = answerFor(question, response.answers, 'task')
    return answer && isAnswered(question, answer) ? [answer.value] : []
  })
}

export function npsIndex(scores: readonly number[]): number | null {
  if (scores.length === 0) return null
  let promoters = 0
  let detractors = 0
  for (const score of scores) {
    if (score >= 9) promoters += 1
    else if (score <= 6) detractors += 1
  }
  return ((promoters - detractors) / scores.length) * 100
}

export function taskSuccessRate(values: readonly TaskValue[]): number | null {
  if (values.length === 0) return null
  return values.filter((value) => value === 'done').length / values.length
}

export interface ResearchAggregate {
  responseCount: number
  completion: number | null
  satisfaction: number | null
  nps: number | null
  taskSuccess: number | null
  taskPartial: number | null
  sus: number | null
  tagCounts: { tag: TagId; count: number }[]
}

export function aggregate(surveys: readonly Survey[], responses: readonly SurveyResponse[]): ResearchAggregate {
  const surveyById = new Map(surveys.map((survey) => [survey.id, survey]))
  const paired = responses.flatMap((response) => {
    const survey = surveyById.get(response.surveyId)
    return survey ? [{ survey, response }] : []
  })
  const mean = (values: number[]) =>
    values.length === 0 ? null : values.reduce((sum, value) => sum + value, 0) / values.length
  const completions = paired.flatMap(({ survey, response }) => {
    const rate = completionRate(survey, response)
    return rate == null ? [] : [rate]
  })
  const satisfactions = paired.flatMap(({ survey, response }) => {
    const score = satisfactionScore(survey, response)
    return score == null ? [] : [score]
  })
  const npsScores = paired.flatMap(({ survey, response }) => {
    const score = npsScore(survey, response)
    return score == null ? [] : [score]
  })
  const susScores = paired.flatMap(({ survey, response }) => {
    const score = responseSus(survey, response)
    return score == null ? [] : [score]
  })
  const tasks = paired.flatMap(({ survey, response }) => taskAnswers(survey, response))
  const tagCounts = (Object.keys(TAG_LABEL) as TagId[])
    .map((tag) => ({ tag, count: responses.filter((response) => response.tags.includes(tag)).length }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
  const partial = tasks.length === 0 ? null : tasks.filter((value) => value === 'partial').length / tasks.length
  return {
    responseCount: paired.length,
    completion: mean(completions),
    satisfaction: mean(satisfactions),
    nps: npsIndex(npsScores),
    taskSuccess: taskSuccessRate(tasks),
    taskPartial: partial,
    sus: mean(susScores),
    tagCounts,
  }
}

export function inDateRange(iso: string, from: string, to: string): boolean {
  const day = iso.slice(0, 10)
  if (from && day < from) return false
  if (to && day > to) return false
  return true
}

export function filterResponses(
  surveys: readonly Survey[],
  responses: readonly SurveyResponse[],
  filters: ResponseFilters,
): SurveyResponse[] {
  const query = filters.query.trim().toLowerCase()
  const names = new Map(surveys.map((survey) => [survey.id, survey.name.toLowerCase()]))
  return responses.filter((response) => {
    if (filters.surveyId && response.surveyId !== filters.surveyId) return false
    if (filters.status && response.status !== filters.status) return false
    if (filters.tag && !response.tags.includes(filters.tag)) return false
    if (!inDateRange(response.submittedAt, filters.from, filters.to)) return false
    if (!query) return true
    const haystack = [response.id, response.respondentCode, names.get(response.surveyId) ?? ''].join(' ').toLowerCase()
    return haystack.includes(query)
  })
}

export interface Suggestion {
  id: string
  title: string
  detail: string
}

export function prioritySuggestions(surveys: readonly Survey[], responses: readonly SurveyResponse[]): Suggestion[] {
  const surveyById = new Map(surveys.map((survey) => [survey.id, survey]))
  const taskBuckets = new Map<string, { prompt: string; values: TaskValue[] }>()
  const likertBuckets = new Map<string, { prompt: string; scores: number[] }>()
  for (const response of responses) {
    const survey = surveyById.get(response.surveyId)
    if (!survey) continue
    for (const question of survey.questions) {
      if (question.type === 'task') {
        const answer = answerFor(question, response.answers, 'task')
        if (!answer || !isAnswered(question, answer)) continue
        const bucket = taskBuckets.get(question.id) ?? { prompt: question.prompt, values: [] }
        bucket.values.push(answer.value)
        taskBuckets.set(question.id, bucket)
      }
      if (question.type === 'likert') {
        const answer = answerFor(question, response.answers, 'likert')
        if (!answer || !isAnswered(question, answer)) continue
        const bucket = likertBuckets.get(question.id) ?? { prompt: question.prompt, scores: [] }
        bucket.scores.push(answer.score)
        likertBuckets.set(question.id, bucket)
      }
    }
  }
  const suggestions: Suggestion[] = []
  const worstTask = [...taskBuckets.entries()]
    .map(([id, bucket]) => ({ id, ...bucket, rate: taskSuccessRate(bucket.values) ?? 1 }))
    .sort((a, b) => a.rate - b.rate)[0]
  if (worstTask && worstTask.rate < 0.75) {
    suggestions.push({
      id: `task-${worstTask.id}`,
      title: '先睇未完成嘅任務',
      detail: `「${worstTask.prompt}」喺已答示範回覆入面，完成比例係 ${Math.round(worstTask.rate * 100)}%。部分完成唔計入完成。`,
    })
  }
  const weakestLikert = [...likertBuckets.entries()]
    .map(([id, bucket]) => ({
      id,
      prompt: bucket.prompt,
      mean: bucket.scores.reduce((sum, score) => sum + score, 0) / bucket.scores.length,
    }))
    .sort((a, b) => a.mean - b.mean)[0]
  if (weakestLikert && weakestLikert.mean < 3.5) {
    suggestions.push({
      id: `likert-${weakestLikert.id}`,
      title: '量表有一句低過內部門檻',
      detail: `「${weakestLikert.prompt}」平均 ${weakestLikert.mean.toFixed(1)} / 5。${LIKERT_HINT}`,
    })
  }
  const counts = aggregate(surveys, responses).tagCounts.filter((row) => row.tag !== 'positive' && row.count > 0)
  if (counts[0]) {
    suggestions.push({
      id: `tag-${counts[0].tag}`,
      title: '最多人標到嘅主題',
      detail: `${TAG_LABEL[counts[0].tag]} 出現 ${counts[0].count} 次。標籤係研究員人手加上，唔係自動判斷。`,
    })
  }
  const nps = aggregate(surveys, responses).nps
  if (nps != null && nps < 20) {
    suggestions.push({
      id: 'nps',
      title: '推薦指數低過內部門檻',
      detail: `NPS 係 ${Math.round(nps)}。計法：9–10 當推薦，7–8 當中性，0–6 當唔推薦，再用推薦比例減唔推薦比例。${NPS_HINT}`,
    })
  }
  if (suggestions.length === 0) {
    suggestions.push({
      id: 'none',
      title: '未見單一短板',
      detail: '呢批回覆入面，任務完成、量表同推薦指數都未跌過內部門檻。可以先打開狀態係「需跟進」嘅回覆逐條睇。',
    })
  }
  return suggestions.slice(0, 4)
}

export function formatAnswer(question: Question, answer: AnswerValue | undefined): string {
  if (!isAnswered(question, answer) || !answer) return '未答'
  switch (answer.type) {
    case 'single':
      return question.options.find((option) => option.id === answer.optionId)?.label ?? '未答'
    case 'multiple': {
      const labels = question.options.filter((option) => answer.optionIds.includes(option.id)).map((option) => option.label)
      return labels.length ? labels.join('、') : '未答'
    }
    case 'likert':
      return `${answer.score} / 5`
    case 'nps':
      return `${answer.score} / 10`
    case 'text':
      return answer.text.trim()
    case 'task':
      return TASK_LABEL[answer.value]
    case 'sus': {
      const score = susScore(answer.scores)
      return score == null ? '未答' : `SUS ${score.toLocaleString('zh-HK', { maximumFractionDigits: 1 })}`
    }
    default:
      return '未答'
  }
}
