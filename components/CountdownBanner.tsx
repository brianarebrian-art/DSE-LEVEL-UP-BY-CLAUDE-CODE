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
    <div className="border-b border-amber-500/20 bg-amber-500/[0.06]">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-center gap-3 text-sm flex-wrap">
        <CalendarDays size={15} className="text-amber-400 shrink-0" />
        <span className="text-slate-300">
          {en ? 'About ' : '距 '}
          <span className="font-bold text-amber-300">{days}</span>
          {en ? ' days to HKDSE 2027' : ' 日 · 2027 DSE 開考'}
        </span>
        <span className="text-slate-500 hidden sm:inline">·</span>
        <span className="text-slate-500">{note}</span>
      </div>
    </div>
  )
}
