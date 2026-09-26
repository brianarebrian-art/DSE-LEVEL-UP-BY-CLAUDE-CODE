'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Fingerprint } from 'lucide-react'
import { getReverseLog, type ReverseCause } from '@/lib/reverseLog'
import { useLocale } from '@/lib/i18n'
import { causeHasMaterial } from '@/lib/causeMode'

// 錯因 DNA — visualises the distribution of the student's self-diagnosed error causes
// (the A/B/C reverse-cause log written by the lockout). Pure client-side; reads the
// existing dse_reverse_log. AI-free: the "diagnosis" is a fixed rule on the top cause.
// Light-first（憲章 §3）：三色改用青／金／紫（on-white 讀得清、避開鮮紅錯誤主色）。
// UX audit B2 (a), Yuna 2026-09-21: the concept-blind-spot colour leaves the red family
// (was rose #C2185B, now violet #6D28D9, the palette's --color-violet).
const CAUSE: Record<ReverseCause, { emoji: string; zh: string; en: string; color: string; adviceZh: string; adviceEn: string }> = {
  A: {
    emoji: '🧠', zh: '概念盲區', en: 'Concept blind spot', color: '#6D28D9',
    adviceZh: '你最常喺「概念盲區」跌倒 —— 做題前先重溫該課題嘅定義同前提，唔好急住計。',
    adviceEn: 'Your weak point is concept blind spots — revisit a topic’s definitions and conditions before drilling.',
  },
  B: {
    emoji: '🎯', zh: '審題陷阱', en: 'Misreading the question', color: '#7E5D07',
    adviceZh: '你最常「睇漏關鍵字」—— 答題前強迫自己圈起「最多／至少／除咗」等字眼。',
    adviceEn: 'You most often misread the prompt — circle keywords like “at least / except / not” before answering.',
  },
  C: {
    emoji: '🧮', zh: '運算粗心', en: 'Careless calculation', color: '#006B65',
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
  // 連續同類錯因偵測（Ethan/數據）：最近 N 次全同一錯因 ⇒ 惡性循環警示。
  // practiceHref: UX audit F1, a 10-question session on this cause in the latest entry's subject.
  const [streak, setStreak] = useState<{ cause: ReverseCause; len: number; practiceHref: string | null } | null>(null)

  useEffect(() => {
    const log = getReverseLog()
    const c: Record<ReverseCause, number> = { A: 0, B: 0, C: 0 }
    for (const e of log) if (e.cause === 'A' || e.cause === 'B' || e.cause === 'C') c[e.cause]++
    setCounts(c)
    setTotal(log.length)
    // log 係新→舊：由頭數起，連續同 cause 達 3 次即警示
    if (log.length >= 3) {
      const head = log[0].cause
      let len = 0
      for (const e of log) { if (e.cause === head) len++; else break }
      const subjectId = log[0].subjectId
      const practiceHref =
        subjectId && causeHasMaterial(log, subjectId, head)
          ? `/practice?subject=${encodeURIComponent(subjectId)}&mode=cause&cause=${head}`
          : null
      setStreak(len >= 3 ? { cause: head, len, practiceHref } : null)
    }
  }, [])

  const top = ORDER.reduce((a, b) => (counts[b] > counts[a] ? b : a), 'A' as ReverseCause)

  return (
    <div className="bg-surface-raised border border-line rounded-2xl p-6 mb-10">
      <div className="flex items-center gap-2.5 mb-1">
        <Fingerprint size={18} className="text-gold shrink-0" />
        <h3 className="text-lg font-medium text-ink">{en ? 'Your error fingerprint' : '你嘅錯題指紋'}</h3>
      </div>
      <p className="text-ink-muted text-sm mb-4">
        {en ? 'Every self-diagnosed mistake builds your pattern.' : '每次錯因自診都會砌出你獨有嘅錯誤模式。'}
      </p>

      {total === 0 ? (
        <p className="text-sm text-ink-muted bg-surface-sunken rounded-xl px-4 py-6 text-center">
          {en
            ? 'Practise and run the reverse-cause check after a wrong answer — your error fingerprint will appear here.'
            : '開始練習，答錯後做錯因自診，你嘅錯題指紋就會喺度顯示。'}
        </p>
      ) : (
        <>
          {/* DNA stripes — proportion of each cause */}
          <div className="h-8 flex rounded-full overflow-hidden mb-4 bg-surface-sunken">
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
            {ORDER.map((k, i) => (
              <div
                key={k}
                className="ml-stagger flex items-center gap-1.5 text-xs text-ink-muted"
                style={{ ['--i' as string]: i }}
              >
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: CAUSE[k].color }} />
                <span>{CAUSE[k].emoji} {en ? CAUSE[k].en : CAUSE[k].zh}</span>
                <span className="text-ink-muted">({counts[k]})</span>
              </div>
            ))}
          </div>

          {/* Same cause three or more times in a row. UX audit B2 (a): framed as a pattern the
              student found (gold, not rose), with one thing they can do next. */}
          {streak && (
            <div className="bg-surface-sunken rounded-xl px-4 py-3 border-l-[3px] border-gold mb-3">
              <div className="text-xs text-gold font-medium mb-1">{en ? 'You found a pattern' : '你搵到一個規律'}</div>
              <p className="text-sm text-ink-soft leading-relaxed">
                {en
                  ? `Your last ${streak.len} slips were all “${CAUSE[streak.cause].en}”. Knowing that is useful. Next time: ${CAUSE[streak.cause].adviceEn.split(' — ')[1] ?? CAUSE[streak.cause].adviceEn}`
                  : `你最近 ${streak.len} 次都係「${CAUSE[streak.cause].zh}」—— 搵到呢個規律已經係進步。下次可以咁做：${CAUSE[streak.cause].adviceZh.split('——')[1]?.trim() ?? CAUSE[streak.cause].adviceZh}`}
              </p>
              {streak.practiceHref && (
                <Link
                  href={streak.practiceHref}
                  className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-accent-strong underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                >
                  {en ? 'Practise this kind now' : '即刻練返呢類'}
                  <ArrowRight size={14} aria-hidden />
                </Link>
              )}
            </div>
          )}

          {/* Diagnosis on the top cause */}
          <div className="bg-surface-sunken rounded-xl px-4 py-3 border-l-[3px] border-gold">
            <div className="text-xs text-gold font-medium mb-1">{en ? 'Pattern read' : '模式診斷'}</div>
            <p className="text-sm text-ink-soft leading-relaxed">{en ? CAUSE[top].adviceEn : CAUSE[top].adviceZh}</p>
          </div>
        </>
      )}
    </div>
  )
}
