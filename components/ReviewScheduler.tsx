'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getReverseLog, type ReverseCause } from '@/lib/reverseLog'
import { getSubject } from '@/data/subjects'
import { useLocale } from '@/lib/i18n'

// F-REV: 錯題重溫智能排程 (Max + Ethan)
// 艾賓浩斯遺忘曲線：錯誤後第 1／3／7／14／30 日到期重溫。
// 數據 100% 本地（lib/reverseLog 有 questionId + topic + ts）——
// 冇 server 表（question_events 已剷、隱私紅線），完成記錄存 dse_review_done。
// 誠實限制：出題係課題內隨機抽樣，所以「開始重溫」係直入該課題操練，
// 唔係重播一模一樣嗰條題目 —— 卡片文案照直講。
// 大愛紅線：無「你仲錯／又錯」；用「溫故知新／值得再鞏固」。

const INTERVALS = [1, 3, 7, 14, 30]
const DONE_KEY = 'dse_review_done'

const CAUSE_TAG: Record<ReverseCause, { zh: string; en: string; cls: string }> = {
  A: { zh: '概念盲區', en: 'Concept', cls: 'bg-rose-500/15 text-rose-300 border-rose-500/30' },
  B: { zh: '審題陷阱', en: 'Trap', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  C: { zh: '運算粗心', en: 'Careless', cls: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
}

interface DueItem {
  questionId: string
  subjectId: string
  topic: string
  topicId?: string
  cause: ReverseCause
  daysAgo: number
}

function todayStr(): string {
  return new Date().toLocaleDateString('en-CA')
}

// 日曆日差（date-only，避免時分秒誤差）
function daysBetween(ts: number): number {
  const a = new Date(ts); a.setHours(0, 0, 0, 0)
  const b = new Date(); b.setHours(0, 0, 0, 0)
  return Math.round((b.getTime() - a.getTime()) / 86400000)
}

function loadDone(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem(DONE_KEY) ?? '{}') } catch { return {} }
}

export default function ReviewScheduler() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [due, setDue] = useState<DueItem[] | null>(null)

  useEffect(() => {
    const done = loadDone()
    const seen = new Set<string>()
    const items: DueItem[] = []
    // reverseLog 新喺頭 → 每條題目只取最近一次錯誤
    for (const e of getReverseLog()) {
      if (seen.has(e.questionId)) continue
      seen.add(e.questionId)
      const days = daysBetween(e.ts)
      // 到期 = 錯後日數啱好落喺艾賓浩斯間隔，且今日未重溫過
      if (INTERVALS.includes(days) && done[e.questionId] !== todayStr()) {
        items.push({ questionId: e.questionId, subjectId: e.subjectId, topic: e.topic, topicId: e.topicId, cause: e.cause, daysAgo: days })
      }
    }
    setDue(items.slice(0, 5)) // 每日最多 5 張卡，避免壓力堆疊
  }, [])

  // 撳「開始重溫」＝當日完成呢條嘅排程（直入該課題操練）
  const markDone = (questionId: string) => {
    try {
      const done = loadDone()
      done[questionId] = todayStr()
      localStorage.setItem(DONE_KEY, JSON.stringify(done))
    } catch { /* ignore */ }
  }

  if (!due) return null

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="font-bold mb-1">📖 {en ? "Today's review suggestions" : '今日建議重溫'}</h2>
      <p className="text-xs text-slate-400 mb-4">
        {en
          ? 'Spaced repetition (day 1 / 3 / 7 / 14 / 30 after a slip) — revisiting is how knowing becomes mastery.'
          : '溫故知新 —— 按遺忘曲線（錯後第 1／3／7／14／30 日）排程，呢啲概念值得再鞏固。'}
      </p>

      {due.length === 0 ? (
        <p className="text-sm text-slate-400 py-4 text-center">
          {en ? 'No reviews due today — take it easy.' : '今日冇重溫任務，休息吓啦。'}
        </p>
      ) : (
        <div className="space-y-2.5">
          {due.map((d) => {
            const subj = getSubject(d.subjectId)
            const tag = CAUSE_TAG[d.cause]
            return (
              <div key={d.questionId} className="flex flex-wrap items-center gap-3 bg-slate-800/50 border border-slate-700/60 rounded-xl px-4 py-3">
                <div className="flex-1 min-w-[10rem]">
                  <div className="text-sm text-slate-200 font-medium">
                    {subj ? (en ? subj.nameEn : subj.name) : d.subjectId} · {d.topic}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span className={`px-2 py-0.5 rounded-full border text-[11px] ${tag.cls}`}>{en ? tag.en : tag.zh}</span>
                    {en ? `Slipped here ${d.daysAgo} day${d.daysAgo > 1 ? 's' : ''} ago · due today` : `上次喺呢度跌倒係 ${d.daysAgo} 日前 · 建議今日重溫`}
                  </div>
                </div>
                {/* 舊記錄冇 topicId → fallback 去科目層級（傳 label 會令題池清零） */}
                <Link
                  href={d.topicId
                    ? `/practice?subject=${encodeURIComponent(d.subjectId)}&topic=${encodeURIComponent(d.topicId)}`
                    : `/practice?subject=${encodeURIComponent(d.subjectId)}`}
                  onClick={() => markDone(d.questionId)}
                  className="min-h-11 inline-flex items-center bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 rounded-lg px-4 py-2 text-sm font-semibold transition-all"
                >
                  {en ? 'Review this topic' : '開始重溫'}
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
