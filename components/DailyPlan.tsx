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
// Light-first（憲章 §3）：白底 + 金強調（提醒色）。
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
    <div className="bg-white border border-[#B8860B]/20 rounded-2xl p-6 mb-10">
      <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
        <div className="flex items-center gap-2.5">
          <CalendarCheck size={18} className="text-[#B8860B] shrink-0" />
          <h3 className="text-lg font-medium text-[#1A1A1A]">{en ? 'Today’s plan' : '今日溫習計劃'}</h3>
        </div>
        {items.length > 0 && (
          <span className="text-xs text-[#9CA3AF]">
            {en ? `≈ ${items.length * PER_TOPIC_MIN} min` : `約 ${items.length * PER_TOPIC_MIN} 分鐘`}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <>
          <p className="text-sm text-[#6B6B6B] mb-4">
            {en
              ? 'Do a few practices first and we’ll build a focused plan from your weakest topics.'
              : '先做幾份練習，我哋就會用你最弱嘅課題砌出一個專屬計劃。'}
          </p>
          <Link
            href="/subjects"
            className="inline-flex items-center gap-2 text-sm bg-[#00726C] hover:bg-[#005F5A] text-white font-medium px-4 py-2 rounded-xl transition-colors"
          >
            {en ? 'Pick a subject' : '揀一科開始'} <ArrowRight size={15} />
          </Link>
        </>
      ) : (
        <>
          <p className="text-sm text-[#6B6B6B] mb-4">
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
                  className="group flex items-center gap-3 bg-[#F5F5F0] hover:bg-[#EDEDE8] border border-black/[0.06] hover:border-[#B8860B]/50 rounded-xl px-4 py-3 transition-all"
                >
                  <span className="text-xl shrink-0">{meta?.emoji ?? '📘'}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-[#1A1A1A] truncate">{it.label}</span>
                    <span className="block text-xs text-[#9CA3AF]">
                      {meta ? (en ? meta.nameEn : meta.name) : it.subjectId}
                      {' · '}
                      <span className={pct < 60 ? 'text-[#C2185B]' : 'text-[#B8860B]'}>
                        {en ? `${pct}% correct` : `答對率 ${pct}%`}
                      </span>
                    </span>
                  </span>
                  <ArrowRight size={16} className="text-[#9CA3AF] group-hover:text-[#B8860B] shrink-0" />
                </Link>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
