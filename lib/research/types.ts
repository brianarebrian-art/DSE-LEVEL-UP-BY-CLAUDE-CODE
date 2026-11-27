export const QUESTION_TYPES = ['single', 'multiple', 'likert', 'nps', 'text', 'task', 'sus'] as const
export type QuestionType = (typeof QUESTION_TYPES)[number]

export const SURVEY_STATUSES = ['draft', 'published', 'paused', 'archived'] as const
export type SurveyStatus = (typeof SURVEY_STATUSES)[number]

export const RESPONSE_STATUSES = ['pending', 'classified', 'follow_up', 'resolved'] as const
export type ResponseStatus = (typeof RESPONSE_STATUSES)[number]

export const TAG_IDS = [
  'usability',
  'navigation',
  'copy',
  'performance',
  'trust',
  'pricing',
  'bug',
  'positive',
] as const
export type TagId = (typeof TAG_IDS)[number]

export const TASK_VALUES = ['done', 'partial', 'unable'] as const
export type TaskValue = (typeof TASK_VALUES)[number]

export const PREVIEW_MODES = ['ready', 'loading', 'empty', 'error'] as const
export type PreviewMode = (typeof PREVIEW_MODES)[number]

export const DENSITIES = ['comfortable', 'compact'] as const
export type Density = (typeof DENSITIES)[number]

export interface ChoiceOption {
  id: string
  label: string
}

export interface Question {
  id: string
  type: QuestionType
  prompt: string
  helpText: string
  required: boolean
  options: ChoiceOption[]
}

export interface Survey {
  id: string
  name: string
  description: string
  purpose: string
  startsOn: string
  endsOn: string
  status: SurveyStatus
  questions: Question[]
  updatedAt: string
}

export type AnswerValue =
  | { type: 'single'; optionId: string }
  | { type: 'multiple'; optionIds: string[] }
  | { type: 'likert'; score: number }
  | { type: 'nps'; score: number }
  | { type: 'text'; text: string }
  | { type: 'task'; value: TaskValue }
  | { type: 'sus'; scores: number[] }

export interface SurveyResponse {
  id: string
  surveyId: string
  respondentCode: string
  submittedAt: string
  answers: Record<string, AnswerValue>
  tags: TagId[]
  status: ResponseStatus
}

export interface ResearchSettings {
  preview: PreviewMode
  density: Density
}

export interface ResearchStore {
  version: 1
  surveys: Survey[]
  responses: SurveyResponse[]
  settings: ResearchSettings
}

export interface AnswerDraft {
  step: number
  answers: Record<string, AnswerValue>
  savedAt: string
}

export interface ResponseFilters {
  query: string
  surveyId: string
  status: '' | ResponseStatus
  tag: '' | TagId
  from: string
  to: string
}
