import type { QuestionType, ResponseStatus, SurveyStatus, TagId, TaskValue } from '@/lib/research/types'

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  single: '單選',
  multiple: '多選',
  likert: '1–5 量表',
  nps: 'NPS 0–10',
  text: '開放文字',
  task: '任務完成',
  sus: 'SUS',
}

export const SURVEY_STATUS_LABEL: Record<SurveyStatus, string> = {
  draft: '草稿',
  published: '發佈中',
  paused: '已暫停',
  archived: '已封存',
}

export const RESPONSE_STATUS_LABEL: Record<ResponseStatus, string> = {
  pending: '待處理',
  classified: '已分類',
  follow_up: '需跟進',
  resolved: '已解決',
}

export const TAG_LABEL: Record<TagId, string> = {
  usability: '易用性',
  navigation: '導航',
  copy: '文案',
  performance: '效能',
  trust: '信任',
  pricing: '定價',
  bug: 'Bug',
  positive: '正面反饋',
}

export const TASK_LABEL: Record<TaskValue, string> = {
  done: '完成',
  partial: '部分完成',
  unable: '無法完成',
}

export const LIKERT_HINT = '1 表示非常不同意，5 表示非常同意。'
export const NPS_HINT = '0 表示完全唔會介紹，10 表示非常願意介紹。'

export function formatWhen(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleString()
}

export function formatDay(day: string): string {
  if (!day) return '未設定'
  const date = new Date(`${day}T00:00:00`)
  if (Number.isNaN(date.getTime())) return day
  return date.toLocaleDateString()
}

export function formatPercent(rate: number | null): string {
  if (rate == null || Number.isNaN(rate)) return '未有'
  return `${Math.round(rate * 100)}%`
}

export function formatScore(value: number | null, digits = 1): string {
  if (value == null || Number.isNaN(value)) return '未有'
  return value.toLocaleString('zh-HK', {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })
}

export function formatNps(value: number | null): string {
  if (value == null || Number.isNaN(value)) return '未有'
  const rounded = Math.round(value)
  if (rounded > 0) return `+${rounded}`
  return String(rounded)
}
