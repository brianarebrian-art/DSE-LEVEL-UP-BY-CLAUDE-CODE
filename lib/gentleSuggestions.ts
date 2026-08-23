// 溫柔每日建議 —— 「今日學習光譜」（第 2 週 · 引擎四）
//
// 規格書 §4.5。呢個係【建議】唔係【任務】，所以設計上刻意做唔到以下嘢：
//   • 冇「未完成」狀態 —— 建議只有「睇咗」同「撳走咗」，冇第三種
//   • 冇連續日數、冇打卡、冇錯過提示（FOMO 對焦慮症學生係直接傷害）
//   • 冇紅點、冇感嘆號、冇強制通知
//   • 每日最多 MAX_PER_DAY 條 —— 一版建議本身就係一版壓力
//   • 每一條都撳一下就走，而且走咗唔會扣任何嘢
//
// 資料源全部係學生自己部機（reverseLog／topicStats／progress），
// 零伺服器、零新數據表、零虛構統計。
//
// 【與規格書嘅一處刻意偏離】§4.5 原文「Mock 仲有 30 日」帶倒數數字，
// 但同一節嘅設計原則又寫明「活動結束倒數 → 無倒數計時」。兩句相撞。
// 全站已經有 CountdownBanner 顯示緊日數，喺建議卡再講一次等於加多一重倒數壓力，
// 故此處嘅考試節點建議【唔帶數字】，只講「今日可以溫乜」。

import { dueReviews } from '@/lib/reviewSchedule'
import { getReverseLog, type ReverseCause } from '@/lib/reverseLog'
import { weakestTopics, topicLabel } from '@/lib/topicStats'
import { loadAttempts } from '@/lib/progress'
import { getSubject } from '@/data/subjects'

export const MAX_PER_DAY = 3
export const DISMISS_KEY = 'dse_gentle_dismissed'

/** 一科幾多日冇練過，先當值得溫柔提一句。 */
export const STALE_DAYS = 14
/** 同一個錯因喺近 30 日重複幾多次，先當值得提。 */
export const CAUSE_MIN = 3
const CAUSE_WINDOW_DAYS = 30

export type SuggestionKind = 'review' | 'cause' | 'balance' | 'exam' | 'encourage'

export interface Suggestion {
  /** 穩定 id —— 撳走之後今日唔會再出現同一條。 */
  id: string
  kind: SuggestionKind
  zh: string
  en: string
  /** 有嘅話，卡片會出一個直接入練習嘅連結。 */
  href?: string
  actionZh?: string
  actionEn?: string
}

const CAUSE_HINT: Record<ReverseCause, { zh: string; en: string }> = {
  A: {
    zh: '做題前先重溫課題定義同前提，唔好急住計',
    en: 'revisit the definitions and premises before you start calculating',
  },
  B: {
    zh: '試下開閱讀尺，逐句圈實指令字先落筆',
    en: 'try the reading ruler and circle the command words before answering',
  },
  C: {
    zh: '計完留三十秒覆一次數，單位同符號行先',
    en: 'leave thirty seconds to recheck — units and signs first',
  },
}

const CAUSE_LABEL: Record<ReverseCause, { zh: string; en: string }> = {
  A: { zh: '概念盲區', en: 'concept blind spots' },
  B: { zh: '審題陷阱', en: 'question-reading traps' },
  C: { zh: '運算粗心', en: 'careless slips' },
}

function todayStr(now: number): string {
  return new Date(now).toLocaleDateString('en-CA')
}

function loadDismissed(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(DISMISS_KEY) ?? '{}') as Record<string, string>
  } catch {
    return {}
  }
}

/** 撳走一條建議。只影響今日 —— 聽日重新計算，唔會永久消失。 */
export function dismissSuggestion(id: string, now: number = Date.now()): void {
  if (typeof window === 'undefined') return
  try {
    const d = loadDismissed()
    d[id] = todayStr(now)
    // 只保留今日嘅紀錄，唔好無限growth
    const today = todayStr(now)
    for (const k of Object.keys(d)) if (d[k] !== today) delete d[k]
    localStorage.setItem(DISMISS_KEY, JSON.stringify(d))
  } catch {
    /* ignore */
  }
}

/**
 * 砌今日嘅建議。已經按優先次序排好，呼叫端直接取頭 MAX_PER_DAY 條。
 * 優先次序：重溫 > 錯因 > 均衡 > 考試節點 > 鼓勵。
 * 理由：頭三種係由學生自己嘅數據長出嚟，最貼身；鼓勵語冇數據支撐，
 * 所以排最後 —— 只喺真係冇嘢好講嗰陣先出，唔會蓋過有內容嘅建議。
 */
export function buildSuggestions(now: number = Date.now()): Suggestion[] {
  const out: Suggestion[] = []

  // ① 重溫建議
  const due = dueReviews(5)
  if (due.length > 0) {
    const first = due[0]
    const topicHref = first.topicId
      ? `/practice?subject=${first.subjectId}&topic=${encodeURIComponent(first.topicId)}`
      : `/practice?subject=${first.subjectId}`
    // 舊記錄冇 topicEn，回落中文 —— 顯示中文好過顯示空白
    const topicZh = first.topic
    const topicEn = first.topicEn || first.topic
    out.push({
      id: `review:${todayStr(now)}`,
      kind: 'review',
      zh:
        due.length === 1
          ? `「${topicZh}」有一個盲點今日啱好到期，睇返佢啱啱好。`
          : `「${topicZh}」等 ${due.length} 個盲點今日啱好到期，睇返佢哋啱啱好。`,
      en:
        due.length === 1
          ? `One blind spot in “${topicEn}” comes due today — good timing to revisit it.`
          : `${due.length} blind spots, starting with “${topicEn}”, come due today.`,
      href: topicHref,
      actionZh: '去重溫',
      actionEn: 'Revisit',
    })
  }

  // ② 錯因建議 —— 近 30 日重複最多嗰個
  const cutoff = now - CAUSE_WINDOW_DAYS * 86400000
  const tally: Record<ReverseCause, number> = { A: 0, B: 0, C: 0 }
  for (const e of getReverseLog()) if (e.ts >= cutoff) tally[e.cause]++
  const top = (Object.keys(tally) as ReverseCause[]).sort((a, b) => tally[b] - tally[a])[0]
  if (tally[top] >= CAUSE_MIN) {
    out.push({
      id: `cause:${top}:${todayStr(now)}`,
      kind: 'cause',
      zh: `近排「${CAUSE_LABEL[top].zh}」出現得比較多。${CAUSE_HINT[top].zh}。`,
      en: `Lately ${CAUSE_LABEL[top].en} keep coming up — ${CAUSE_HINT[top].en}.`,
    })
  }

  // ③ 均衡建議 —— 有練過但擱低咗一段時間嘅科
  const attempts = loadAttempts()
  const lastSeen = new Map<string, number>()
  for (const a of attempts) {
    const prev = lastSeen.get(a.subjectId) ?? 0
    if (a.timestamp > prev) lastSeen.set(a.subjectId, a.timestamp)
  }
  let stale: { subjectId: string; days: number } | null = null
  for (const [sid, ts] of lastSeen) {
    const days = Math.floor((now - ts) / 86400000)
    if (days >= STALE_DAYS && (!stale || days > stale.days)) stale = { subjectId: sid, days }
  }
  if (stale) {
    // 科名由科目登記表攞 —— AttemptRecord.subjectName 係作答當日寫低嘅中文名，
    // 英文介面用返佢就會中英夾雜（非華語考生睇唔明）。
    const meta = getSubject(stale.subjectId)
    const fallback = attempts.find((a) => a.subjectId === stale!.subjectId)?.subjectName ?? stale.subjectId
    const nameZh = meta?.name ?? fallback
    const nameEn = meta?.nameEn ?? fallback
    out.push({
      id: `balance:${stale.subjectId}:${todayStr(now)}`,
      kind: 'balance',
      zh: `「${nameZh}」擱低咗一排。做 1 題都得，唔使做成份。`,
      en: `“${nameEn}” has been sitting a while. One question counts — you don’t owe it a full set.`,
      href: `/practice?subject=${stale.subjectId}&size=1`,
      actionZh: '做 1 題',
      actionEn: 'Just one',
    })
  }

  // ④ 考試節點建議 —— 刻意唔帶倒數數字（見檔頭）
  const weak = weakestTopics({ min: 2, limit: 1 })[0]
  if (weak) {
    out.push({
      id: `exam:${weak.key}:${todayStr(now)}`,
      kind: 'exam',
      zh: `想喺考場穩陣啲，「${topicLabel(weak, false)}」係最抵溫嗰個 —— 練返幾條。`,
      en: `If you want a steadier exam day, “${topicLabel(weak, true)}” is the highest-yield one to drill.`,
      href: `/practice?subject=${weak.subjectId}&topic=${encodeURIComponent(weak.topic)}`,
      actionZh: '去練',
      actionEn: 'Drill it',
    })
  }

  // ⑤ 鼓勵提示 —— 冇數據支撐，所以【冇任何比較】（唔講「贏咗幾多同齡人」）
  out.push({
    id: `encourage:${todayStr(now)}`,
    kind: 'encourage',
    zh: '今日肯打開嚟，已經係一件事。做幾多都算數。',
    en: 'Opening this at all today already counts. However much you do is enough.',
  })

  return out
}

/**
 * 今日應該顯示嘅建議。
 *
 * 【先封頂，後剔走】—— 次序好緊要。倒轉做（先剔走後封頂）就會變成
 * 撳走一條即刻補一條上嚟，變咗「你唔做完唔准走」，正正係呢個模組要避開嘅嘢。
 * 而家嘅行為係：今日最多三條，撳走一條就少一條，重新載入都唔會補位。
 */
export function todaySuggestions(now: number = Date.now()): Suggestion[] {
  const dismissed = loadDismissed()
  const today = todayStr(now)
  return buildSuggestions(now)
    .slice(0, MAX_PER_DAY)
    .filter((s) => dismissed[s.id] !== today)
}
