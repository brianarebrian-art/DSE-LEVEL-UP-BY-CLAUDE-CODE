'use client'

// 題目收藏夾（#106，同時覆蓋 #23 範文金句收藏、#63 經濟術語閃卡的收藏需求）。
// 純 localStorage、可分類、有上限、best-effort（永不向 UI 拋錯）。
//
// 設計取態 ——
//   ✓ 只存【指標】（科目 + 題目 id + 課題標籤），唔存題目全文：題庫改咗版本
//     之後，收藏會自動跟住讀到新版本，唔會留低一份過時副本。
//   ✓ 資料夾係自由文字，預設「未分類」。刻意唔做「必須先建資料夾」——
//     多一步就會有學生索性唔收藏。
//   ✗ 唔記收藏總數排行、唔設成就、唔顯示「你今個星期收藏咗幾多」——
//     收藏係工具，唔係表現指標（憲章禁 gamification）。
//
// 題目版本改動之後 id 可能消失（例如某條被 reject 落架）。讀取端負責過濾
// 搵唔返嘅 id，本模組唔做題庫查詢 —— 保持零 import、可喺任何組件安全呼叫。

const KEY = 'dse_bookmarks'
const CAP = 300
export const DEFAULT_FOLDER = '未分類'
export const FOLDER_MAX_LEN = 20

export interface Bookmark {
  subjectId: string
  questionId: string
  /** 課題顯示標籤，用於收藏頁分組顯示，避免逐條反查題庫。 */
  topic: string
  folder: string
  ts: number
}

function read(): Bookmark[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    if (!Array.isArray(raw)) return []
    return raw.filter(
      (b): b is Bookmark =>
        !!b && typeof b.subjectId === 'string' && typeof b.questionId === 'string',
    )
  } catch {
    return []
  }
}

function write(list: Bookmark[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, CAP)))
    // 同一頁可能有多個組件同時顯示收藏狀態（題目卡 + 導航列計數）。
    // localStorage 的 storage 事件唔會喺同一個分頁觸發，故此自派一個事件。
    window.dispatchEvent(new Event('dse-bookmarks'))
  } catch {
    /* 配額滿或私隱模式：靜靜失敗，唔可以因為收藏唔到而擋住做題 */
  }
}

export function getBookmarks(): Bookmark[] {
  return read().sort((a, b) => b.ts - a.ts)
}

export function isBookmarked(subjectId: string, questionId: string): boolean {
  return read().some((b) => b.subjectId === subjectId && b.questionId === questionId)
}

/** 加入收藏。已存在則只更新資料夾（等於「改分類」），唔會產生重複。 */
export function addBookmark(b: Omit<Bookmark, 'ts' | 'folder'> & { folder?: string }): void {
  const folder = (b.folder ?? DEFAULT_FOLDER).trim().slice(0, FOLDER_MAX_LEN) || DEFAULT_FOLDER
  const list = read()
  const existing = list.find((x) => x.subjectId === b.subjectId && x.questionId === b.questionId)
  if (existing) {
    existing.folder = folder
    write(list)
    return
  }
  list.unshift({ subjectId: b.subjectId, questionId: b.questionId, topic: b.topic, folder, ts: Date.now() })
  write(list)
}

export function removeBookmark(subjectId: string, questionId: string): void {
  write(read().filter((b) => !(b.subjectId === subjectId && b.questionId === questionId)))
}

/** 回傳新狀態：true = 加咗，false = 剷咗。 */
export function toggleBookmark(
  b: Omit<Bookmark, 'ts' | 'folder'> & { folder?: string },
): boolean {
  if (isBookmarked(b.subjectId, b.questionId)) {
    removeBookmark(b.subjectId, b.questionId)
    return false
  }
  addBookmark(b)
  return true
}

/** 現有資料夾名（依收藏數多寡排），供收藏時快速再用。 */
export function getFolders(): string[] {
  const count = new Map<string, number>()
  for (const b of read()) count.set(b.folder, (count.get(b.folder) ?? 0) + 1)
  return [...count.entries()].sort((a, b) => b[1] - a[1]).map(([f]) => f)
}

export function renameFolder(from: string, to: string): void {
  const name = to.trim().slice(0, FOLDER_MAX_LEN)
  if (!name || name === from) return
  const list = read()
  for (const b of list) if (b.folder === from) b.folder = name
  write(list)
}
