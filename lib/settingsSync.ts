// v8.0 CLOUD-FIRST · SEN 設定跨裝置同步（HOOK1 嘅 saveSettings 部分）。
//
// 呢個係 v8 入面唯一一個真缺口：`lib/sync.ts` 個 Snapshot 由頭到尾只覆蓋
// 進度／計數／topicStats／active_session —— SEN 設定從來冇同步過。一部機調好
// 字級行距，第二部機要重新調一次。對讀寫障礙學生嚟講呢個係真痛點。
//
// 寫入模型（創辦人 2026-07-22 拍板：方案 A）：
//   1. localStorage 即寫 = single source of truth，UI 即時反應，永不 block
//   2. 已登入先至 fire-and-forget POST 上雲；唔理 res.ok、唔彈 toast、唔重試到阻塞
//   3. 未登入 → 完全唔會打 /api/sync/*，亦唔會入任何 queue（匿名用戶硬性保護）
//
// 只用【真實存在】嘅 localStorage key。v8 §8.1 有三個 key 喺 repo 唔存在：
//   dse_dark_mode ✗（全站 0 個 dark: utility）／dse_dyslexic_font ✗（實際 dse_easy_font）
//   dse_focus_mode ✗（dse_focus_today 係番茄鐘計數，兩回事）

import {
  FONT_KEY,
  LINE_HEIGHT_KEY,
  LETTER_SPACING_KEY,
  DEFAULT_LINE_HEIGHT,
  applyFontSize,
  applyTextSpacing,
  type LetterSpacing,
} from '@/components/GlobalA11y'

/** A11yPanel／ReadingRuler／PracticeSession 都聽住呢個事件重讀 storage。 */
export const A11Y_EVENT = 'dse-a11y'

const EASY_FONT_KEY = 'dse_easy_font'
const READING_RULER_KEY = 'dse_reading_ruler'
const HIDE_TIMER_KEY = 'dse_hide_timer'
const CALM_LOCK_KEY = 'dse_calm_lock'
const SENSORY_PREF_KEY = 'dse_relax_sensory_pref'

export interface CloudSettings {
  easy_font: boolean
  reading_ruler: boolean
  hide_timer: boolean
  calm_lock: boolean
  font_size: number
  line_height: number
  letter_spacing: LetterSpacing
  sensory_pref: unknown | null
}

const flag = (k: string) => {
  try {
    return localStorage.getItem(k) === '1'
  } catch {
    return false
  }
}

const num = (k: string, min: number, max: number, fallback: number) => {
  try {
    const v = Number(localStorage.getItem(k))
    return Number.isFinite(v) && v >= min && v <= max ? v : fallback
  } catch {
    return fallback
  }
}

/** 讀本機現狀，準備上雲。 */
export function collectLocalSettings(): CloudSettings {
  let sensory: unknown = null
  try {
    const raw = localStorage.getItem(SENSORY_PREF_KEY)
    sensory = raw ? JSON.parse(raw) : null
  } catch {
    sensory = null
  }
  let spacing: LetterSpacing = 'normal'
  try {
    const s = localStorage.getItem(LETTER_SPACING_KEY)
    if (s === 'wide' || s === 'extra-wide' || s === 'normal') spacing = s
  } catch {
    /* ignore */
  }
  return {
    easy_font: flag(EASY_FONT_KEY),
    reading_ruler: flag(READING_RULER_KEY),
    hide_timer: flag(HIDE_TIMER_KEY),
    calm_lock: flag(CALM_LOCK_KEY),
    font_size: num(FONT_KEY, 12, 24, 16),
    line_height: num(LINE_HEIGHT_KEY, 1.2, 2, DEFAULT_LINE_HEIGHT),
    letter_spacing: spacing,
    sensory_pref: sensory,
  }
}

/**
 * 將雲端設定套落本機。寫 storage → 套 DOM → 廣播 dse-a11y，
 * 令 A11yPanel／閱讀尺／練習頁即時跟住變，唔使 reload。
 */
export function applyCloudSettings(s: CloudSettings): void {
  try {
    localStorage.setItem(EASY_FONT_KEY, s.easy_font ? '1' : '0')
    localStorage.setItem(READING_RULER_KEY, s.reading_ruler ? '1' : '0')
    localStorage.setItem(HIDE_TIMER_KEY, s.hide_timer ? '1' : '0')
    localStorage.setItem(CALM_LOCK_KEY, s.calm_lock ? '1' : '0')
    if (s.sensory_pref != null) {
      localStorage.setItem(SENSORY_PREF_KEY, JSON.stringify(s.sensory_pref))
    }
  } catch {
    /* 私密模式／配額滿：設定套唔到唔應該搞爛做題 */
  }

  document.documentElement.classList.toggle('font-easy', s.easy_font)
  applyFontSize(s.font_size)
  applyTextSpacing(s.line_height, s.letter_spacing)

  window.dispatchEvent(new Event(A11Y_EVENT))
}

/** 已登入先至送。fire-and-forget —— 失敗唔彈嘢、唔阻塞、唔重試到 block。 */
export async function pushSettings(): Promise<boolean> {
  try {
    const res = await fetch('/api/sync/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings: collectLocalSettings() }),
    })
    return res.ok
  } catch {
    return false
  }
}

/** 登入時拉一次。回傳有冇成功攞到雲端設定。 */
export async function pullSettings(): Promise<CloudSettings | null> {
  try {
    const res = await fetch('/api/sync/settings')
    if (!res.ok) return null
    const body = (await res.json()) as { settings: CloudSettings | null }
    return body.settings ?? null
  } catch {
    return null
  }
}
