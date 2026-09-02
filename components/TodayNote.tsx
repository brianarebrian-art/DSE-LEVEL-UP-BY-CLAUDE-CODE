'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { loadAttempts } from '@/lib/progress'
import { getReverseLog } from '@/lib/reverseLog'
import { getTopicStats } from '@/lib/topicStats'
import { localDayStart, pickTodayMessage, type TodayMessage } from '@/lib/dailyNote'

// 今日提示 —— 藍圖功能 02（每日溫習信）+ 06（錯題溫和提醒）的前端合併版。
// 計算邏輯全部在 lib/dailyNote.ts（純函數、有測試覆蓋），本組件只負責呈現。
//
// 刻意【只設一個位】：兩個提示各佔一格會互相爭奪注意力，對 ADHD 學生尤其不利。
// 優先次序見 pickTodayMessage —— 提醒（針對正在重複發生的困難）先於溫習信。
//
// 沒有訊息時回傳 null，整個區塊消失 —— 不留空殼、不寫「今日暫無提示」之類
// 只會佔位而無資訊的句子。

const NUDGED_KEY = 'dse_nudged_at'
// 今日已選定嘅提醒。同「冷卻」分開兩件事：
//   冷卻（NUDGED_KEY）＝ 呢個課題今日提過喇，唔好再提【第二個】。
//   今日已選（TODAY_KEY）＝ 今日揀咗邊一個，重新渲染時要揀返【同一個】。
// 兩者唔分開就會出事：組件一 mount 就寫冷卻，React StrictMode 喺開發模式下
// 會 double-invoke effect，第二次就被自己啱啱寫低嘅冷卻擋走，結果提醒永遠唔出。
// 生產環境亦一樣 —— 學生離開再返回 dashboard 就會觸發同樣情況。
const TODAY_KEY = 'dse_today_nudge'

function readNudged(): Record<string, number> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(NUDGED_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function markNudged(key: string, day: number): void {
  if (typeof window === 'undefined') return
  try {
    const cur = readNudged()
    cur[key] = Date.now()
    localStorage.setItem(NUDGED_KEY, JSON.stringify(cur))
    localStorage.setItem(TODAY_KEY, JSON.stringify({ day, key }))
  } catch {
    /* quota／私隱模式 —— 冷卻記錄屬最佳努力，失敗不影響顯示 */
  }
}

/** 今日已選定嘅提醒 key（同日重新渲染時要揀返同一個）。 */
function readTodayKey(day: number): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(TODAY_KEY)
    const v = raw ? JSON.parse(raw) : null
    return v && v.day === day && typeof v.key === 'string' ? v.key : null
  } catch {
    return null
  }
}

export default function TodayNote({ className = '' }: { className?: string }) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const tr = (zh: string, e: string) => (en ? e : zh)
  const [msg, setMsg] = useState<TodayMessage | null>(null)

  useEffect(() => {
    // 全部讀本機，未登入用戶一樣有效。
    const now = Date.now()
    const day = localDayStart(now)
    const nudged = readNudged()
    // 今日已經揀咗嘅嗰個，要豁免自己嘅冷卻，否則重新渲染就會揀唔返同一個。
    const todayKey = readTodayKey(day)
    if (todayKey) delete nudged[todayKey]

    const m = pickTodayMessage({
      log: getReverseLog(),
      attempts: loadAttempts(),
      stats: getTopicStats(),
      now,
      lastNudgedAt: nudged,
    })
    setMsg(m)
    if (m?.kind === 'nudge') markNudged(`${m.subjectId}::${m.topicId}`, day)
  }, [])

  if (!msg) return null

  if (msg.kind === 'nudge') {
    return (
      <div className={`rounded-2xl border border-gold/30 bg-gold/10 p-5 ${className}`}>
        <p className="text-sm font-medium text-gold mb-1">
          💡 {tr('你發現咗一個新盲點', 'You have found a blind spot')}
        </p>
        <p className="text-sm text-ink-soft leading-relaxed mb-3">
          {tr(
            `最近喺「${msg.label}」呢個課題撞板咗 ${msg.count} 次。唔係你唔得 —— 係呢度真係有個位未打通。`,
            `You have stumbled ${msg.count} times on “${msg.label}” lately. That is not a lack of ability — there is simply a knot here that is not untied yet.`,
          )}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/notes/${msg.subjectId}?topic=${encodeURIComponent(msg.topicId)}`}
            className="min-h-11 inline-flex items-center gap-2 bg-accent-strong hover:bg-accent-hover text-on-accent text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            {tr('睇返呢個課題嘅拆解', 'Read the breakdown')} <ArrowRight size={15} aria-hidden />
          </Link>
          <Link
            href="/relax"
            className="min-h-11 inline-flex items-center text-sm text-ink-muted hover:text-accent px-2 transition-colors"
          >
            {tr('或者，抖十分鐘先', 'Or take ten minutes first')}
          </Link>
        </div>
      </div>
    )
  }

  const { yesterdayQuestions, yesterdaySubjects, suggestion } = msg
  const subjects = yesterdaySubjects.join(tr('、', ', '))
  return (
    <div className={`rounded-2xl border border-line bg-surface-raised p-5 ${className}`}>
      <p className="text-sm font-medium text-ink mb-1 inline-flex items-center gap-2">
        <Sparkles size={16} className="text-accent" aria-hidden />
        {tr('今日小提示', 'A note for today')}
      </p>
      <p className="text-sm text-ink-soft leading-relaxed mb-3">
        {subjects
          ? tr(
              `你昨日喺${subjects}練咗 ${yesterdayQuestions} 題。`,
              `Yesterday you worked through ${yesterdayQuestions} questions in ${subjects}.`,
            )
          : tr(`你昨日練咗 ${yesterdayQuestions} 題。`, `Yesterday you worked through ${yesterdayQuestions} questions.`)}
        {suggestion
          ? tr(
              `今日不如試下「${suggestion.label}」，做 3 題就得 —— 開咗個頭最難。`,
              ` Today, how about “${suggestion.label}”? Three questions is enough — starting is the hard part.`,
            )
          : tr('今日想練邊科都得，唔使諗太多。', ' Whatever you feel like practising today is fine.')}
      </p>
      {suggestion && (
        <Link
          href={`/practice?subject=${suggestion.subjectId}&topic=${encodeURIComponent(suggestion.topicId)}&size=1`}
          className="min-h-11 inline-flex items-center gap-2 border border-accent/40 bg-surface-sunken hover:bg-surface-sunken text-accent text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          {tr('先做 1 題', 'Just one question')} <ArrowRight size={15} aria-hidden />
        </Link>
      )}
    </div>
  )
}
