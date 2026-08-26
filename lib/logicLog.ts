// ============================================================================
// logicLog.ts —— 每日溫習足跡（Daily Logic Log）
// ----------------------------------------------------------------------------
// 規格書：SPEC-GAMIFY-P1-20260822 §模組一。憲章 §8.1（2026-08-22 解禁）之下的
// 遊戲化層。
//
// ══ 與規格書的三處刻意分歧 ══
//
// 一、【足跡由既有數據導出，不另存一份】
//     規格書寫「每次完成練習後，系統自動記錄一次足跡」，即新增一條寫入路徑。
//     本實作改為由 `dse_progress`（練習記錄）與 `dse_reverse_log`（自診記錄）
//     當場導出，練習頁一行不改。理由與 lib/practiceRank.ts 相同：Yuna 2026-08-22
//     指示「遊戲化盡量不可以影響到 practice 那邊」；一旦足跡有自己的儲存，
//     練習頁就要負責每次作答時同步它，等於把遊戲化的節奏塞進作答流程。
//     順帶好處是兩份數據不可能對不上——本來就是同一個來源。
//     規格書 §模組二自己亦寫明家園「完全由現有數據衍生計算」，此處只是把
//     同一原則套用於模組一。
//
// 二、【`frameworks_mastered` 改為「今日涉獵課題」】
//     規格書要求記錄「掌握框架」（例如「釐清條件機率前提」）。平台並無量度
//     「框架掌握」這回事：題目上的 `framework` 欄是出題端的分類標籤，不是
//     學生的掌握程度；把答對一題說成「掌握了某框架」屬虛構數據（憲章 §8）。
//     誠實的替代是「今日做過哪些課題」——這是真正記錄得到的。
//
// 三、【不寫 `device_id`】
//     規格書的 localStorage schema 有 `device_id: uuid`。純本機的日誌不需要
//     裝置識別碼：它不參與任何運算，卻替每部裝置造出一個穩定指紋。不寫。
//
// 唯一真正儲存的，是學生自己輸入的心情備註（`dse_logic_log`），因為那是
// 導出不到的。
// ============================================================================

import { loadAttempts, type AttemptRecord } from '@/lib/progress'
import { getReverseLog, type ReverseLogEntry } from '@/lib/reverseLog'
import { hkDayString } from '@/lib/hkTime'
import { getSubject } from '@/data/subjects'

/** 備註上限（規格書 §模組一：50 字）。 */
export const MOOD_NOTE_MAX = 50

const NOTE_KEY = 'dse_logic_log'

/** 足跡的時間軸長度（規格書 §MVP P0：最近 30 日）。 */
export const LOG_WINDOW_DAYS = 30

export interface LogEntry {
  /** YYYY-MM-DD（HKT，04:00 日界線——與全站每日重置同一把尺）。 */
  date: string
  questionsCount: number
  /** 科目 id，按當日做題數由多至少。 */
  subjects: string[]
  /** 今日涉獵的課題標籤（見檔首分歧二）。 */
  topics: string[]
  /** 今日自診為「審題陷阱」的課題——來自 reverseLog 的 B 類。 */
  trapsFound: string[]
  timeMinutes: number
  moodNote: string | null
  /** 當日完成的練習節數。 */
  sessions: number
}

// ── 心情備註（唯一的寫入路徑）───────────────────────────────────────────────

type NoteMap = Record<string, string>

function readNotes(): NoteMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(NOTE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {}
    const out: NoteMap = {}
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof v === 'string') out[k] = v
    }
    return out
  } catch {
    return {}
  }
}

export function getMoodNote(date: string): string | null {
  return readNotes()[date] ?? null
}

/** 寫入／清除某日備註。空字串等於清除，學生要收得返自己寫過的東西。 */
export function setMoodNote(date: string, note: string): void {
  if (typeof window === 'undefined') return
  try {
    const notes = readNotes()
    const trimmed = note.trim().slice(0, MOOD_NOTE_MAX)
    if (trimmed) notes[date] = trimmed
    else delete notes[date]
    localStorage.setItem(NOTE_KEY, JSON.stringify(notes))
  } catch {
    /* 配額爆滿時靜默失敗——備註是附加物，不可以令整頁報錯 */
  }
}

// ── 導出足跡 ────────────────────────────────────────────────────────────────

/**
 * 由練習記錄與自診記錄導出每日足跡。純函數，方便測試。
 *
 * `notes` 由呼叫端傳入（`buildLogEntries()` 會讀 localStorage），使本函數
 * 在 SSR 與測試之下都不碰瀏覽器 API。
 */
export function computeLogEntries(
  attempts: readonly AttemptRecord[],
  reverse: readonly ReverseLogEntry[],
  notes: NoteMap = {},
  windowDays: number = LOG_WINDOW_DAYS,
  now: number = Date.now(),
): LogEntry[] {
  const cutoff = now - windowDays * 86400000
  const byDate = new Map<string, {
    questions: number
    seconds: number
    sessions: number
    subjects: Map<string, number>
    topics: Set<string>
    traps: Set<string>
  }>()

  const bucket = (date: string) => {
    let b = byDate.get(date)
    if (!b) {
      b = { questions: 0, seconds: 0, sessions: 0, subjects: new Map(), topics: new Set(), traps: new Set() }
      byDate.set(date, b)
    }
    return b
  }

  for (const a of attempts) {
    if (typeof a.timestamp !== 'number' || a.timestamp < cutoff) continue
    const b = bucket(hkDayString(a.timestamp))
    b.questions += Number.isFinite(a.total) ? Math.max(0, a.total) : 0
    b.seconds += Number.isFinite(a.elapsed) ? Math.max(0, a.elapsed) : 0
    b.sessions += 1
    b.subjects.set(a.subjectId, (b.subjects.get(a.subjectId) ?? 0) + (a.total || 0))
    for (const r of a.topicResults ?? []) if (r?.topic) b.topics.add(r.topic)
  }

  // 自診記錄只補「陷阱」一欄：一條足跡的存在與否，由有沒有做過題決定，
  // 不由有沒有做錯決定——否則做全對的日子反而沒有足跡。
  for (const r of reverse) {
    if (typeof r.ts !== 'number' || r.ts < cutoff) continue
    if (r.cause !== 'B' || !r.topic) continue
    const date = hkDayString(r.ts)
    if (!byDate.has(date)) continue
    bucket(date).traps.add(r.topic)
  }

  return [...byDate.entries()]
    .map(([date, b]): LogEntry => ({
      date,
      questionsCount: b.questions,
      subjects: [...b.subjects.entries()].sort((x, y) => y[1] - x[1]).map(([id]) => id),
      topics: [...b.topics],
      trapsFound: [...b.traps],
      timeMinutes: Math.round(b.seconds / 60),
      moodNote: notes[date] ?? null,
      sessions: b.sessions,
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

/** 讀本機資料並導出足跡。SSR 之下兩個來源都回 []，故安全。 */
export function buildLogEntries(windowDays: number = LOG_WINDOW_DAYS): LogEntry[] {
  return computeLogEntries(loadAttempts(), getReverseLog(), readNotes(), windowDays)
}

// ── 時間軸視覺（規格書 §模組一「方式 A」）────────────────────────────────────

export type NodeTone = 'quiet' | 'cyan' | 'pink' | 'gold'

/**
 * 節點顏色。規格書按「當日掌握框架數量」分四級；此處改按【當日涉獵課題數】，
 * 理由見檔首分歧二。分級的門檻照搬規格書（0／1–2／3–4／5+）。
 */
export function nodeTone(e: Pick<LogEntry, 'topics'>): NodeTone {
  const n = e.topics.length
  if (n >= 5) return 'gold'
  if (n >= 3) return 'pink'
  if (n >= 1) return 'cyan'
  return 'quiet'
}

export type NodeSize = 'sm' | 'md' | 'lg'

/** 節點大小：規格書 §模組一——10 題以下小、10–30 中、30 題以上大。 */
export function nodeSize(e: Pick<LogEntry, 'questionsCount'>): NodeSize {
  if (e.questionsCount > 30) return 'lg'
  if (e.questionsCount >= 10) return 'md'
  return 'sm'
}

/** 兩條相鄰足跡是否為連續日子（決定要不要畫連接線）。 */
export function isConsecutive(newer: string, older: string): boolean {
  const a = Date.parse(`${newer}T00:00:00Z`)
  const b = Date.parse(`${older}T00:00:00Z`)
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false
  return a - b === 86400000
}

// ── 累積制日數（HOTFIX-0823 方案 B）─────────────────────────────────────────

export interface ActiveDayCounts {
  /** 本月（HKT 曆月）有足跡的日數，同一日做幾多節都只計一日。 */
  monthly: number
  /** 有記錄以來總共有足跡的日數，同樣去重。 */
  total: number
}

/**
 * 累積制日數。取代舊有的「連續 N 日」顯示。
 *
 * 為何不用連續計數：這與 progress.ts 的 `computeRecentActiveDays` 是同一個理由——
 * 連續計數的傷害不在符號，而在【中斷一日即歸零】。學生休息一日，畫面就把之前
 * 的累積一次抹掉，等同宣告「之前的努力白費」。累積制之下，休息一日只是今日沒有
 * 加一，已經走過的路一日都不會被收回。
 *
 * 為何在本機計算而不查伺服器：本站練習資料 100% 存於 localStorage，`question_events`
 * 表已於 2026-07-14 移除。去重日數是一個對本機陣列的計數，無需任何伺服器往返，
 * 亦因此離線可用、零成本（憲章 §5）。
 *
 * 純函數（`attempts` 與 `now` 皆由呼叫端傳入），故 SSR 與測試都不碰瀏覽器 API。
 */
export function computeActiveDays(
  attempts: readonly AttemptRecord[],
  now: number = Date.now(),
): ActiveDayCounts {
  const thisMonth = hkDayString(now).slice(0, 7) // YYYY-MM（HKT 曆月）
  const all = new Set<string>()
  const month = new Set<string>()
  for (const a of attempts) {
    if (typeof a?.timestamp !== 'number' || !Number.isFinite(a.timestamp)) continue
    const day = hkDayString(a.timestamp)
    all.add(day)
    if (day.slice(0, 7) === thisMonth) month.add(day)
  }
  return { monthly: month.size, total: all.size }
}

/** 讀本機練習記錄並計出累積日數。SSR 之下 `loadAttempts()` 回 []，故安全。 */
export function buildActiveDays(now: number = Date.now()): ActiveDayCounts {
  return computeActiveDays(loadAttempts(), now)
}

// 【已移除】currentStreak（連續足跡日數）——HOTFIX-0823 創辦人拍板改用累積制，
// 見上面 computeActiveDays。刻意連函數一併剷走而唔係淨係唔顯示：留住一個
// 現成嘅 streak 函數，等於留住一個「接返落去」嘅邀請。
// isConsecutive 保留 —— 佢淨係用嚟畫時間軸節點之間嘅連接線，唔係計分。

/** 科目 id → 顯示標籤（找不到就原樣回傳，不可以因為科目改名而整頁報錯）。 */
export function subjectLabel(id: string, en: boolean): string {
  const s = getSubject(id)
  if (!s) return id
  return en ? (s.nameEn ?? s.name) : s.name
}
