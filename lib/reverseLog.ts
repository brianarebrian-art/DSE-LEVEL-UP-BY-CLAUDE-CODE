'use client'

// 逆向錯因日誌 (Reverse Error Log) — records WHY a student fell for a wrong MC
// option (the 三維錯因自診 of the "答錯即鎖死" lockout), powering a reverse error
// notebook. Pure localStorage, capped, best-effort (never throws into the UI).

export type ReverseCause = 'A' | 'B' | 'C'

export interface ReverseLogEntry {
  subjectId: string
  questionId: string
  topic: string
  // F-REV: 題庫 topic id（practice ?topic= filter 食 id 唔食標籤）。
  // optional：舊記錄冇呢欄，重溫排程會 fallback 去科目層級連結。
  topicId?: string
  cause: ReverseCause
  selected: string
  correct: string
  ts: number
}

const KEY = 'dse_reverse_log'
const CAP = 200

export function logReverseError(entry: ReverseLogEntry): void {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(KEY)
    const list: ReverseLogEntry[] = raw ? JSON.parse(raw) : []
    list.unshift(entry)
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, CAP)))
  } catch {
    /* ignore quota / parse errors — the log is best-effort */
  }
}

export function getReverseLog(): ReverseLogEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
