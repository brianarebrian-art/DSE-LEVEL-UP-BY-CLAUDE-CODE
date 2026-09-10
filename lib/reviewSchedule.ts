// 艾賓浩斯重溫排程 —— 共用邏輯（原本內嵌喺 ReviewScheduler.tsx）
//
// 2026-08-23 抽出嚟：溫柔每日建議（lib/gentleSuggestions）都要知「今日有幾多條
// 到期重溫」。兩處各自寫一次間隔表，遲早會漂走 —— 一邊改 1/3/7/14/30、另一邊冇改，
// 學生就會見到卡片講「3 條到期」但重溫區得 2 條，而且冇任何測試會紅。
//
// 數據 100% 本地：lib/reverseLog（錯題紀錄）＋ dse_review_done（已完成）。
// 冇伺服器表 —— question_events 2026-07-14 已剷，亦係隱私紅線。

import { getReverseLog, type ReverseCause } from '@/lib/reverseLog'

/** 錯誤之後第 N 日到期重溫。 */
export const INTERVALS = [1, 3, 7, 14, 30] as const

export const REVIEW_DONE_KEY = 'dse_review_done'

export interface DueItem {
  questionId: string
  subjectId: string
  topic: string
  /** 英文課題名；舊記錄冇，讀取端回落 `topic`。 */
  topicEn?: string
  topicId?: string
  cause: ReverseCause
  daysAgo: number
}

export function todayStr(): string {
  return new Date().toLocaleDateString('en-CA')
}

/** 日曆日差（date-only，避免時分秒誤差令「啱好第 3 日」跳格）。 */
export function daysBetween(ts: number, now: number = Date.now()): number {
  const a = new Date(ts)
  a.setHours(0, 0, 0, 0)
  const b = new Date(now)
  b.setHours(0, 0, 0, 0)
  return Math.round((b.getTime() - a.getTime()) / 86400000)
}

export function loadReviewDone(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(REVIEW_DONE_KEY) ?? '{}') as Record<string, string>
  } catch {
    return {}
  }
}

export function markReviewDone(questionId: string): void {
  if (typeof window === 'undefined') return
  try {
    const done = loadReviewDone()
    done[questionId] = todayStr()
    localStorage.setItem(REVIEW_DONE_KEY, JSON.stringify(done))
  } catch {
    /* ignore */
  }
}

/**
 * 今日到期重溫嘅題目。每條題目只計最近一次錯誤（reverseLog 新喺頭）。
 * @param limit 上限，預設 5 —— 每日最多 5 張卡，避免壓力堆疊。
 */
export function dueReviews(limit = 5): DueItem[] {
  const done = loadReviewDone()
  const today = todayStr()
  const seen = new Set<string>()
  const items: DueItem[] = []
  for (const e of getReverseLog()) {
    if (seen.has(e.questionId)) continue
    seen.add(e.questionId)
    const days = daysBetween(e.ts)
    if ((INTERVALS as readonly number[]).includes(days) && done[e.questionId] !== today) {
      items.push({
        questionId: e.questionId,
        subjectId: e.subjectId,
        topic: e.topic,
        topicEn: e.topicEn,
        topicId: e.topicId,
        cause: e.cause,
        daysAgo: days,
      })
    }
  }
  return items.slice(0, limit)
}

/**
 * 【聽日】到期重溫嘅題目 —— 交卷後嘅回訪鉤子。
 *
 * ══ 點解要有 ══
 * `dueReviews()` 答「今日有幾多條」，只喺 /dashboard 出現。而學生交完卷係落
 * /result，嗰一頁由頭到尾冇提過聽日有嘢等緊佢 —— 即係話遺忘曲線排程雖然
 * 已經上線，但喺【決定佢聽日返唔返嚟】嗰一刻係隱形嘅。
 *
 * 實測 174 個帳號、97 個做過至少一節，第二日返過嚟得 24 個（14%）。
 * 呢個函數係為咗補返嗰個缺口：交卷嗰一刻話畀學生聽，聽日有咩喺度等。
 *
 * ══ 點解唔做「連續打卡」 ══
 * 2027 目標書要求 Daily Streak。但 lib/progress.ts:158 記低咗連續計數
 * 已經被【刻意剷走並取代】—— 中斷一日即歸零，等同宣告「之前的努力白費」；
 * 對焦慮傾向學生係純粹壓力，對 ADHD 學生令重新開始嘅門檻更高（憲章 §7）。
 * 呢兩批人正正就係平台服務嘅對象，亦係今日 SESSION_SIZE 20→10 嘅理由。
 *
 * 所以呢度用【聽日有嘢等你】而唔係【你連續咗幾多日】：
 * 前者係一個邀請，後者係一個會斷嘅紀錄。兩者都提供回訪理由，
 * 但只有前者喺學生休息一日之後唔會懲罰佢。
 *
 * @param limit 上限，預設 3 —— 對應「明日 3 題」，亦避免壓力堆疊。
 */
export function upcomingReviews(limit = 3): DueItem[] {
  const done = loadReviewDone()
  const today = todayStr()
  const seen = new Set<string>()
  const items: DueItem[] = []
  for (const e of getReverseLog()) {
    if (seen.has(e.questionId)) continue
    seen.add(e.questionId)
    // 今日係第 N 日，聽日就係第 N+1 日 —— 睇 N+1 落唔落喺間隔表之內。
    const tomorrow = daysBetween(e.ts) + 1
    // 已經喺今日重溫過嘅，聽日唔會再叫 —— 否則交卷後見到「聽日有 3 條」，
    // 而嗰 3 條啱啱先做完，等於報一個假數。
    if ((INTERVALS as readonly number[]).includes(tomorrow) && done[e.questionId] !== today) {
      items.push({
        questionId: e.questionId,
        subjectId: e.subjectId,
        topic: e.topic,
        topicEn: e.topicEn,
        topicId: e.topicId,
        cause: e.cause,
        daysAgo: tomorrow,
      })
    }
  }
  return items.slice(0, limit)
}
