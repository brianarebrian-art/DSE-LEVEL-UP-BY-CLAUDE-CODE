'use client'

import { Moon } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { setQuiet, useQuiet } from '@/lib/quietMode'

// Dashboard 嘅安靜模式開關。見 lib/quietMode.ts 檔頭：收埋分數、段位／EXP 同溫習時數。
// 文案只講「收埋咩」，唔講「點解你需要」—— 無痕設計（Emma/UDL），唔出診斷字眼。
export default function QuietModeToggle() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const quiet = useQuiet()

  return (
    <button
      type="button"
      onClick={() => setQuiet(!quiet)}
      aria-pressed={quiet}
      className={`mb-4 inline-flex items-center gap-2 min-h-11 rounded-xl border px-3 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
        quiet ? 'bg-surface-sunken border-accent/50 text-accent' : 'bg-surface-raised border-line-strong text-ink-soft hover:bg-surface-sunken'
      }`}
    >
      <Moon size={14} aria-hidden className="shrink-0" />
      {quiet
        ? en
          ? 'Quiet mode on: scores, rank, EXP and study time hidden'
          : '安靜模式：已收埋分數、段位、EXP 同溫習時數'
        : en
          ? 'Quiet mode: hide scores, rank, EXP and study time'
          : '安靜模式：收埋分數、段位、EXP 同溫習時數'}
    </button>
  )
}
