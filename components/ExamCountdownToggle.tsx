'use client'

import { useEffect, useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { isExamCountdownOn, setExamCountdown } from '@/lib/examCountdown'

// 考期模式開關（/account）。創辦人決定 5（2026-09-30）：首頁倒數預設收起，由學生自己開。
// 放在休息日旁邊：兩者都是「坐低諗完先揀」的設定，不是做題途中即時調的控制。
export default function ExamCountdownToggle() {
  const { locale } = useLocale()
  const en = locale === 'en'
  // 掛載後才讀 localStorage，避免 hydration 不一致。
  const [on, setOn] = useState(false)
  useEffect(() => setOn(isExamCountdownOn()), [])

  return (
    <section className="bg-surface-raised border border-line rounded-2xl p-6">
      <h2 className="text-base font-bold text-ink mb-1 flex items-center gap-2">
        <CalendarDays size={16} className="text-accent shrink-0" aria-hidden />
        {en ? 'Exam countdown' : '考期模式'}
      </h2>
      <p className="text-sm text-ink-muted leading-relaxed mb-4">
        {en
          ? 'Show roughly how many days are left until the DSE at the top of the home page. Off unless you turn it on. The date is an estimate until the HKEAA announces the timetable.'
          : '喺首頁頂顯示距離 DSE 大約仲有幾多日。你唔開就唔會出。考評局公布時間表之前，日期係估算。'}
      </p>
      <button
        type="button"
        aria-pressed={on}
        onClick={() => setOn(setExamCountdown(!on))}
        className={`inline-flex min-h-12 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
          on ? 'border-accent-strong bg-accent-strong text-on-accent' : 'border-line-strong text-ink-soft hover:border-accent'
        }`}
      >
        {on ? (en ? 'Countdown on' : '倒數已開') : en ? 'Show the countdown' : '開啟倒數'}
      </button>
    </section>
  )
}
