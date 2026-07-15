'use client'

// F-EMO: 情緒溫度計私密記錄 — 純 localStorage，永不上 server、永不入報告／排行榜
// （隱私紅線：學習情緒數據不得暴露於任何公開場景；question_events 表已於
// 0003_drop_teacher_platform 剷除，本功能一開始就唔行 server 路線）。
// 只為日後（學生自己裝置上）觀察「邊種情緒狀態最常出現」留一條私家線索。

export type EmotionTag = 'happy' | 'neutral' | 'anxious' | 'skipped'

export interface EmotionLogEntry {
  tag: EmotionTag
  subjectId: string
  ts: number
}

const KEY = 'dse_emotion_log'
const CAP = 200

export function logEmotion(tag: EmotionTag, subjectId: string): void {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(KEY)
    const list: EmotionLogEntry[] = raw ? JSON.parse(raw) : []
    list.unshift({ tag, subjectId, ts: Date.now() })
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, CAP)))
  } catch {
    /* best-effort，唔阻答題流程 */
  }
}
