import { seedStore } from '@/lib/research/seed'
import {
  DENSITIES,
  PREVIEW_MODES,
  QUESTION_TYPES,
  RESPONSE_STATUSES,
  SURVEY_STATUSES,
  TAG_IDS,
  type AnswerDraft,
  type AnswerValue,
  type ResearchStore,
  type Survey,
  type SurveyResponse,
} from '@/lib/research/types'

export const STORE_KEY = 'dse-level-up-research-v1'
export const DRAFT_PREFIX = 'dse-level-up-research-draft:'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isAnswer(value: unknown): value is AnswerValue {
  if (!isRecord(value) || typeof value.type !== 'string') return false
  switch (value.type) {
    case 'single':
      return typeof value.optionId === 'string'
    case 'multiple':
      return Array.isArray(value.optionIds) && value.optionIds.every((item) => typeof item === 'string')
    case 'likert':
    case 'nps':
      return typeof value.score === 'number'
    case 'text':
      return typeof value.text === 'string'
    case 'task':
      return value.value === 'done' || value.value === 'partial' || value.value === 'unable'
    case 'sus':
      return Array.isArray(value.scores) && value.scores.every((item) => typeof item === 'number')
    default:
      return false
  }
}

function isSurvey(value: unknown): value is Survey {
  if (!isRecord(value)) return false
  if (typeof value.id !== 'string' || typeof value.name !== 'string') return false
  if (typeof value.description !== 'string' || typeof value.purpose !== 'string') return false
  if (typeof value.startsOn !== 'string' || typeof value.endsOn !== 'string') return false
  if (typeof value.updatedAt !== 'string') return false
  if (!SURVEY_STATUSES.includes(value.status as Survey['status'])) return false
  if (!Array.isArray(value.questions)) return false
  return value.questions.every((question) => {
    if (!isRecord(question)) return false
    if (typeof question.id !== 'string' || typeof question.prompt !== 'string') return false
    if (typeof question.helpText !== 'string' || typeof question.required !== 'boolean') return false
    if (!QUESTION_TYPES.includes(question.type as Survey['questions'][number]['type'])) return false
    if (!Array.isArray(question.options)) return false
    return question.options.every((option) => isRecord(option) && typeof option.id === 'string' && typeof option.label === 'string')
  })
}

function isResponse(value: unknown): value is SurveyResponse {
  if (!isRecord(value)) return false
  if (typeof value.id !== 'string' || typeof value.surveyId !== 'string') return false
  if (typeof value.respondentCode !== 'string' || !/^R-\d{4}$/.test(value.respondentCode)) return false
  if (typeof value.submittedAt !== 'string') return false
  if (!RESPONSE_STATUSES.includes(value.status as SurveyResponse['status'])) return false
  if (!Array.isArray(value.tags) || !value.tags.every((tag) => TAG_IDS.includes(tag as SurveyResponse['tags'][number]))) return false
  if (!isRecord(value.answers) || !Object.values(value.answers).every(isAnswer)) return false
  return true
}

export function parseStore(raw: string): ResearchStore | null {
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return null
  }
  if (!isRecord(data) || data.version !== 1) return null
  if (!Array.isArray(data.surveys) || !data.surveys.every(isSurvey)) return null
  if (!Array.isArray(data.responses) || !data.responses.every(isResponse)) return null
  if (!isRecord(data.settings)) return null
  if (!PREVIEW_MODES.includes(data.settings.preview as ResearchStore['settings']['preview'])) return null
  if (!DENSITIES.includes(data.settings.density as ResearchStore['settings']['density'])) return null
  return data as unknown as ResearchStore
}

export function loadBrowserStore(): { ok: true; store: ResearchStore } | { ok: false } {
  const raw = localStorage.getItem(STORE_KEY)
  if (raw == null) {
    const store = seedStore()
    localStorage.setItem(STORE_KEY, JSON.stringify(store))
    return { ok: true, store }
  }
  const store = parseStore(raw)
  if (!store) return { ok: false }
  return { ok: true, store }
}

export function writeBrowserStore(store: ResearchStore): void {
  localStorage.setItem(STORE_KEY, JSON.stringify(store))
}

export function readDraft(surveyId: string): AnswerDraft | null {
  const raw = localStorage.getItem(`${DRAFT_PREFIX}${surveyId}`)
  if (!raw) return null
  try {
    const data = JSON.parse(raw) as unknown
    if (!isRecord(data) || typeof data.step !== 'number' || !isRecord(data.answers)) return null
    if (!Object.values(data.answers).every(isAnswer)) return null
    return {
      step: data.step,
      answers: data.answers as AnswerDraft['answers'],
      savedAt: typeof data.savedAt === 'string' ? data.savedAt : '',
    }
  } catch {
    return null
  }
}

export function writeDraft(surveyId: string, draft: AnswerDraft): void {
  localStorage.setItem(`${DRAFT_PREFIX}${surveyId}`, JSON.stringify(draft))
}

export function clearDraft(surveyId: string): void {
  localStorage.removeItem(`${DRAFT_PREFIX}${surveyId}`)
}

export function clearDrafts(): void {
  const keys: string[] = []
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index)
    if (key?.startsWith(DRAFT_PREFIX)) keys.push(key)
  }
  for (const key of keys) localStorage.removeItem(key)
}
