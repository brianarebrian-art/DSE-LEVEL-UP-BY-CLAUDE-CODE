'use client'

import { useEffect, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { useLocale } from '@/lib/i18n'

// HKDSE exam start date.
// ⚠️ UPDATE EACH YEAR with the official HKEAA date once it is announced. This is an
// ESTIMATE (HKDSE core written papers usually begin early April), which is why the
// banner says "約 / About" — never present it as the exact official count.
const DSE_EXAM_DATE = new Date('2027-04-08T00:00:00+08:00')

// A calm, encouraging countdown (因材施教 tone) — a daily-habit nudge, NOT an alarm.
// Returns null until mounted so the day count never causes an SSR/CSR mismatch.
export default function CountdownBanner() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [days, setDays] = useState<number | null>(null)

  useEffect(() => {
    const ms = DSE_EXAM_DATE.getTime() - Date.now()
    setDays(Math.max(0, Math.ceil(ms / 86_400_000)))
  }, [])

  if (days === null) return null

  const note = en
    ? days > 180
      ? 'Plenty of time — build a daily habit.'
      : days > 60
        ? 'Into the prep season — keep a steady pace.'
        : 'Final stretch — a little every day adds up.'
    : days > 180
      ? '時間充裕，養成每日溫習習慣。'
      : days > 60
        ? '進入備戰期，保持穩定節奏。'
        : '最後衝刺，每日少少，積少成多。'

  return (
    // 2026-07-30 對比度修正：本組件係 light-first 遷移漏網（仍用 slate/amber 深色系）。
    // 淺色主題下，amber/6% 淡底會合成成米白 #FAF4E9，而 text-slate-300 落上去只有
    // 1.36:1、text-amber-300 更只有 1.33:1 —— 即係首頁頂第一眼睇到嘅倒數日數
    // 【實際上係睇唔到】。已全部改用主題 token，兩個主題都達 AA。
    <div className="border-b border-gold/25 bg-gold/[0.06]">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm flex-wrap">
        <CalendarDays size={15} className="text-gold shrink-0" />
        <span className="text-ink-soft">
          {en ? 'About ' : '距 '}
          <span className="font-bold text-gold">{days}</span>
          {en ? ' days to HKDSE 2027' : ' 日 · 2027 DSE 開考'}
        </span>
        <span className="text-ink-muted hidden sm:inline">·</span>
        <span className="text-ink-muted">{note}</span>
      </div>
    </div>
  )
}
