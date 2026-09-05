'use client'

// 三維自診 —— 反思閘嗰三個選項（BUILD-SPEC §2.3 步驟 2）
//
// 文字用第一人稱「我」，唔用「你」。呢個唔係文風偏好：
// 「你係咪睇漏咗題目？」讀落係審問，「我睇漏咗題目啲字」讀落係自述。
// 同一個意思，一個令學生防衛，一個令佢肯認。
import type { Dimension } from './types'

export interface DimensionDef {
  id: Dimension
  icon: string
  /** 反思閘上面畀學生揀嘅句子（第一人稱） */
  label: string
  labelEn: string
  /** 發現簿／發現卡上面嘅短名（第三人稱，用嚟做標籤） */
  short: string
  shortEn: string
}

export const DIMENSIONS: readonly DimensionDef[] = [
  {
    id: 'A', icon: '🧩',
    label: '我對呢個概念本身唔清楚',
    labelEn: 'I am not clear on the concept itself',
    short: '概念盲區', shortEn: 'Concept blind spot',
  },
  {
    id: 'B', icon: '🔍',
    label: '概念我識，但我睇漏咗題目啲字',
    labelEn: 'I know the concept, but I misread the question',
    short: '審題陷阱', shortEn: 'Question-reading trap',
  },
  {
    id: 'C', icon: '✏️',
    label: '我明，只係計錯／寫漏',
    labelEn: 'I understood it — I just slipped in the working',
    short: '運算粗心', shortEn: 'Careless slip',
  },
] as const

export const DIMENSION_BY_ID: Record<Dimension, DimensionDef> =
  Object.fromEntries(DIMENSIONS.map((d) => [d.id, d])) as Record<Dimension, DimensionDef>

/**
 * 反思閘下限（秒）。
 *
 * 2026-09-05 Brian 裁決：由 60 減到 30，並且【所有答錯題】都行，
 * 唔再限於 hard（憲章 §7 同日修訂）。
 *
 * 呢個係下限唔係固定時長 —— 學生一揀咗維度就即刻可以睇解析。
 * 倒數只係服務「唔揀嗰批」：冇下限的話，個畫面會變成一個要撳走嘅彈窗。
 */
export const REFLECTION_SECONDS = 30
