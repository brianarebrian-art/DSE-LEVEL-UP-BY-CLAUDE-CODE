'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CalendarCheck, ArrowRight } from 'lucide-react'
import { weakestTopics, winRate, type TopicStatEntry } from '@/lib/topicStats'
import { getSubject } from '@/data/subjects'
import { useLocale } from '@/lib/i18n'

// 今日溫習計劃 — a simple, AI-FREE rule engine: target the 3 weakest topics (lowest
// win-rate, ≥1 attempt) and turn each into one short, linked drill. No model, no
// fabricated data — it just reads the existing topic-stats weakness signal.
const PER_TOPIC_MIN = 10 // rough minutes per short drill, for the time estimate

export default function DailyPlan() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [items, setItems] = useState<TopicStatEntry[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setItems(weakestTopics({ min: 1, limit: 3 }))
    setReady(true)
  }, [])

  if (!ready) return null

  return (
    <div className="bg-slate-900 border border-amber-500/20 rounded-2xl p-6 mb-10">
      <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
        <div className="flex items-center gap-2.5">
          <CalendarCheck size={18} className="text-amber-400 shrink-0" />
          <h3 className="text-lg font-bold text-slate-100">{en ? 'Today’s plan' : '今日溫習計劃'}</h3>
        </div>
        {items.length > 0 && (
          <span className="text-xs text-slate-500">
            {en ? `≈ ${items.length * PER_TOPIC_MIN} min` : `約 ${items.length * PER_TOPIC_MIN} 分鐘`}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <>
          <p className="text-sm text-slate-400 mb-4">
            {en
              ? 'Do a few practices first and we’ll build a focused plan from your weakest topics.'
              : '先做幾份練習，我哋就會用你最弱嘅課題砌出一個專屬計劃。'}
          </p>
          <Link
            href="/subjects"
            className="inline-flex items-center gap-2 text-sm bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-2 rounded-xl transition-colors"
          >
            {en ? 'Pick a subject' : '揀一科開始'} <ArrowRight size={15} />
          </Link>
        </>
      ) : (
        <>
          <p className="text-sm text-slate-500 mb-4">
            {en
              ? 'Your 3 weakest topics — clear them one by one.'
              : '你 3 個最弱嘅課題 —— 逐個擊破。'}
          </p>
          <div className="space-y-2.5">
            {items.map((it) => {
              const meta = getSubject(it.subjectId)
              const pct = Math.round(winRate(it) * 100)
              const href = `/practice?subject=${it.subjectId}&topic=${encodeURIComponent(it.topic)}`
              return (
                <Link
                  key={it.key}
                  href={href}
                  className="group flex items-center gap-3 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700 hover:border-amber-500/50 rounded-xl px-4 py-3 transition-all"
                >
                  <span className="text-xl shrink-0">{meta?.emoji ?? '📘'}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-100 truncate">{it.label}</span>
                    <span className="block text-xs text-slate-500">
                      {meta ? (en ? meta.nameEn : meta.name) : it.subjectId}
                      {' · '}
                      <span className={pct < 60 ? 'text-red-400' : 'text-amber-400'}>
                        {en ? `${pct}% correct` : `答對率 ${pct}%`}
                      </span>
                    </span>
                  </span>
                  <ArrowRight size={16} className="text-slate-600 group-hover:text-amber-400 shrink-0" />
                </Link>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
