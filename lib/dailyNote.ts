// 今日提示（藍圖功能 02「每日溫習信」+ 06「錯題溫和提醒」的前端版本）
//
// ── 為何改在前端做 ────────────────────────────────────────────────────────────
// 原藍圖把兩者都放在 server：02 用 Vercel Cron 寫入 `user_settings.daily_note`，
// 06 用 Supabase Database Webhook 監察 `user_progress`。兩者都行不通或不划算：
//
//   · 覆蓋面反而縮窄：兩者都只服務已登入用戶。本平台登入屬選擇性（只換取跨裝置
//     同步，不給任何額外權限），大部分學生根本收不到。
//   · 06 在資料層做不到：`user_progress` 沒有逐題記錄，只有整塊 upsert 的 JSONB
//     快照，Database Trigger 無法從中判斷「同一課題連續錯三次」。
//   · 所需資料本機早已齊備：`dse_reverse_log`（逐條錯題，含 topicId 與時間戳）、
//     `dse_progress`（每次練習記錄）、`dse_topic_stats`（逐課題掌握度）。
//
// 因此改為純前端計算：零伺服器、零 Cron、零新資料上雲，而且**所有學生**
// （包括未登入者）都適用。
//
// ── 憲章紅線 ──────────────────────────────────────────────────────────────────
// · 不做連續天數／連勝（屬 gamification，已否決）
// · 沒有資料時一律不顯示，絕不因「你昨日冇溫書」而產生任何提示
// · 語氣為學長學姐式陪伴，不作評判
// · 一次只顯示一則訊息：兩個提示同時出現會互相爭奪注意力，對 ADHD 學生尤其不利
//
// 本檔為純函數，不觸碰 localStorage，時間由呼叫方傳入，方便測試。

import type { AttemptRecord } from '@/lib/progress'
import type { ReverseLogEntry } from '@/lib/reverseLog'
import type { TopicStatEntry } from '@/lib/topicStats'

/** 觸發溫和提醒所需的錯誤次數。三次＝「同一個坑跌三次」，是介入的合理時機。 */
export const NUDGE_ERROR_THRESHOLD = 3
/** 只看最近多少日的錯題。太舊的錯誤未必仍是弱點。 */
export const NUDGE_WINDOW_DAYS = 7
/** 同一課題的提醒冷卻期：一日一次。避免變成嘮叨。 */
export const NUDGE_COOLDOWN_DAYS = 1

const DAY = 86_400_000

export interface NudgeMessage {
  kind: 'nudge'
  /** 課題 id，用於「去溫習」深連結與冷卻記錄。 */
  topicId: string
  subjectId: string
  label: string
  count: number
}

export interface DailyNoteMessage {
  kind: 'note'
  /** 昨日做過的題數。0 代表昨日沒有練習 —— 此情況不會產生訊息。 */
  yesterdayQuestions: number
  /** 昨日練過的科目名稱（去重，最多 3 個）。 */
  yesterdaySubjects: string[]
  /** 今日建議的課題；沒有合適對象時為 null，屆時只作簡短肯定。 */
  suggestion: { subjectId: string; topicId: string; label: string } | null
}

export type TodayMessage = NudgeMessage | DailyNoteMessage

/** 以本地日期切界（非 UTC）—— 學生的「昨日」是香港時間的昨日。 */
export function localDayStart(ts: number): number {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/**
 * 06 溫和提醒：找出最近 `NUDGE_WINDOW_DAYS` 日內，錯誤次數達門檻且今日尚未提醒過
 * 的課題。同時符合條件時取錯得最多的一個。
 *
 * `lastNudgedAt` 由呼叫方提供（記於 localStorage），key 為 `${subjectId}::${topicId}`。
 */
export function buildGentleNudge(
  log: ReverseLogEntry[],
  now: number,
  lastNudgedAt: Record<string, number> = {},
): NudgeMessage | null {
  const since = now - NUDGE_WINDOW_DAYS * DAY
  const buckets = new Map<string, { subjectId: string; topicId: string; label: string; count: number }>()

  for (const e of log) {
    if (typeof e?.ts !== 'number' || e.ts < since || e.ts > now) continue
    // 舊記錄可能沒有 topicId。沒有 id 就無法做深連結，亦無法穩定分組，故略過。
    const topicId = e.topicId
    if (!topicId || !e.subjectId) continue
    const key = `${e.subjectId}::${topicId}`
    const b = buckets.get(key) ?? { subjectId: e.subjectId, topicId, label: e.topic || topicId, count: 0 }
    b.count += 1
    if (e.topic) b.label = e.topic
    buckets.set(key, b)
  }

  const cooldown = NUDGE_COOLDOWN_DAYS * DAY
  const eligible = [...buckets.entries()]
    .filter(([key, b]) => {
      if (b.count < NUDGE_ERROR_THRESHOLD) return false
      const last = lastNudgedAt[key]
      return !(typeof last === 'number' && now - last < cooldown)
    })
    .sort((a, b) => b[1].count - a[1].count)

  if (eligible.length === 0) return null
  const [, top] = eligible[0]
  return { kind: 'nudge', topicId: top.topicId, subjectId: top.subjectId, label: top.label, count: top.count }
}

/**
 * 02 每日溫習信：總結昨日練習，並提出一個具體而細小的今日建議。
 *
 * 刻意只在「昨日真的有練習」時才產生訊息 —— 若學生昨日休息，平台不應開口提起，
 * 更不應暗示對方偷懶。這是憲章「不打擊自信」在此功能上的具體落實。
 */
export function buildDailyNote(
  attempts: AttemptRecord[],
  stats: TopicStatEntry[],
  now: number,
): DailyNoteMessage | null {
  const todayStart = localDayStart(now)
  const yesterdayStart = todayStart - DAY

  const yesterday = attempts.filter(
    (a) => typeof a?.timestamp === 'number' && a.timestamp >= yesterdayStart && a.timestamp < todayStart,
  )
  if (yesterday.length === 0) return null

  const yesterdayQuestions = yesterday.reduce((n, a) => n + (Number(a.total) || 0), 0)
  if (yesterdayQuestions === 0) return null

  const yesterdaySubjects = [...new Set(yesterday.map((a) => a.subjectName).filter(Boolean))].slice(0, 3)

  // 建議對象：掌握度最弱、且樣本足夠（至少做過 3 題）的課題。
  // 樣本門檻是為了不讓「做過一題、啱好錯咗」被當成弱點 —— 那只是雜訊。
  const candidates = stats
    .filter((s) => s && s.total >= 3 && s.wrong > 0)
    .sort((a, b) => b.wrong / b.total - a.wrong / a.total)

  const pick = candidates[0]
  return {
    kind: 'note',
    yesterdayQuestions,
    yesterdaySubjects,
    suggestion: pick ? { subjectId: pick.subjectId, topicId: pick.topic, label: pick.label || pick.topic } : null,
  }
}

/**
 * 一日只出一則。提醒優先於溫習信：前者針對一個正在重複發生的具體困難，
 * 時效性與針對性都較高；後者屬日常陪伴，遲一日看到並無損失。
 */
export function pickTodayMessage(input: {
  log: ReverseLogEntry[]
  attempts: AttemptRecord[]
  stats: TopicStatEntry[]
  now: number
  lastNudgedAt?: Record<string, number>
}): TodayMessage | null {
  return (
    buildGentleNudge(input.log, input.now, input.lastNudgedAt) ??
    buildDailyNote(input.attempts, input.stats, input.now)
  )
}
