'use client'

import { useEffect, useState } from 'react'
import { Fingerprint } from 'lucide-react'
import { getReverseLog, type ReverseCause } from '@/lib/reverseLog'
import { useLocale } from '@/lib/i18n'

// 錯因 DNA — visualises the distribution of the student's self-diagnosed error causes
// (the A/B/C reverse-cause log written by the lockout). Pure client-side; reads the
// existing dse_reverse_log. AI-free: the "diagnosis" is a fixed rule on the top cause.
const CAUSE: Record<ReverseCause, { emoji: string; zh: string; en: string; color: string; adviceZh: string; adviceEn: string }> = {
  A: {
    emoji: '🧠', zh: '概念盲區', en: 'Concept blind spot', color: '#f87171',
    adviceZh: '你最常喺「概念盲區」跌倒 —— 做題前先重溫該課題嘅定義同前提，唔好急住計。',
    adviceEn: 'Your weak point is concept blind spots — revisit a topic’s definitions and conditions before drilling.',
  },
  B: {
    emoji: '🎯', zh: '審題陷阱', en: 'Misreading the question', color: '#fbbf24',
    adviceZh: '你最常「睇漏關鍵字」—— 答題前強迫自己圈起「最多／至少／除咗」等字眼。',
    adviceEn: 'You most often misread the prompt — circle keywords like “at least / except / not” before answering.',
  },
  C: {
    emoji: '🧮', zh: '運算粗心', en: 'Careless calculation', color: '#60a5fa',
    adviceZh: '你最常「識做但計錯」—— 養成做完即驗算嘅習慣。',
    adviceEn: 'You know the method but slip on arithmetic — build a habit of checking every result.',
  },
}
const ORDER: ReverseCause[] = ['A', 'B', 'C']

export default function ErrorDNA() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [counts, setCounts] = useState<Record<ReverseCause, number>>({ A: 0, B: 0, C: 0 })
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const log = getReverseLog()
    const c: Record<ReverseCause, number> = { A: 0, B: 0, C: 0 }
    for (const e of log) if (e.cause === 'A' || e.cause === 'B' || e.cause === 'C') c[e.cause]++
    setCounts(c)
    setTotal(log.length)
  }, [])

  const top = ORDER.reduce((a, b) => (counts[b] > counts[a] ? b : a), 'A' as ReverseCause)

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-10">
      <div className="flex items-center gap-2.5 mb-1">
        <Fingerprint size={18} className="text-amber-400 shrink-0" />
        <h3 className="text-lg font-bold text-slate-100">{en ? 'Your error DNA' : '你嘅錯題 DNA'}</h3>
      </div>
      <p className="text-slate-500 text-sm mb-4">
        {en ? 'Every self-diagnosed mistake builds your pattern.' : '每次錯因自診都會砌出你獨有嘅錯誤模式。'}
      </p>

      {total === 0 ? (
        <p className="text-sm text-slate-500 bg-slate-800/40 rounded-xl px-4 py-6 text-center">
          {en
            ? 'Practise and run the reverse-cause check after a wrong answer — your error DNA will appear here.'
            : '開始練習，答錯後做錯因自診，你嘅錯題 DNA 就會喺度顯示。'}
        </p>
      ) : (
        <>
          {/* DNA stripes — proportion of each cause */}
          <div className="h-8 flex rounded-full overflow-hidden mb-4 bg-slate-800">
            {ORDER.map((k) => {
              const pct = (counts[k] / total) * 100
              if (pct === 0) return null
              return (
                <div
                  key={k}
                  className="h-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: CAUSE[k].color }}
                  title={`${en ? CAUSE[k].en : CAUSE[k].zh}: ${counts[k]}`}
                />
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4">
            {ORDER.map((k) => (
              <div key={k} className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: CAUSE[k].color }} />
                <span>{CAUSE[k].emoji} {en ? CAUSE[k].en : CAUSE[k].zh}</span>
                <span className="text-slate-600">({counts[k]})</span>
              </div>
            ))}
          </div>

          {/* Diagnosis on the top cause */}
          <div className="bg-slate-800/40 rounded-xl px-4 py-3 border-l-2 border-amber-500/60">
            <div className="text-xs text-amber-400 font-bold mb-1">{en ? 'Pattern read' : '模式診斷'}</div>
            <p className="text-sm text-slate-300 leading-relaxed">{en ? CAUSE[top].adviceEn : CAUSE[top].adviceZh}</p>
          </div>
        </>
      )}
    </div>
  )
}
