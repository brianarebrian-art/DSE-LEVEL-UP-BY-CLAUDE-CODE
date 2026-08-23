'use client'

// 逆向錯因日誌 (Reverse Error Log) — records WHY a student fell for a wrong MC
// option (the 三維錯因自診 of the "答錯即鎖死" lockout), powering a reverse error
// notebook. Pure localStorage, capped, best-effort (never throws into the UI).

import type { Difficulty } from '@/data/questions'

export type ReverseCause = 'A' | 'B' | 'C'

export interface ReverseLogEntry {
  subjectId: string
  questionId: string
  topic: string
  // F-REV: 題庫 topic id（practice ?topic= filter 食 id 唔食標籤）。
  // optional：舊記錄冇呢欄，重溫排程會 fallback 去科目層級連結。
  topicId?: string
  /**
   * 英文課題名。optional：2026-08-23 之前嘅記錄冇呢欄，讀取端回落中文。
   * 加呢欄係為咗非華語考生 —— 英文介面之下重溫建議唔應該淨係得中文課題名。
   */
  topicEn?: string
  cause: ReverseCause
  selected: string
  correct: string
  ts: number
  // 真相引擎：分辨「基礎概念盲點」（easy/medium）同「進階概念未消化」（hard）。
  // optional 且純附加 —— 舊記錄冇呢欄，引擎會當作未知並歸去進階分支。
  difficulty?: Difficulty
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
