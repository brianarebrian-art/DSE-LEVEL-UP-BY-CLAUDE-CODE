'use client'

import { Languages } from 'lucide-react'
import { useLocale } from '@/lib/i18n'

// 固定按鈕同時標示「語言」及切換目標，學生毋須靠猜測或進入選單尋找。
export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, toggle } = useLocale()
  const label = locale === 'zh' ? 'English' : '中文'
  const compactLabel = locale === 'zh' ? 'EN' : '中文'
  const controlLabel = locale === 'zh' ? '語言 / Language' : 'Language / 語言'
  const compactControlLabel = locale === 'zh' ? '語言' : 'Lang'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        locale === 'zh'
          ? '語言 / Language：切換介面至 English（英文）'
          : 'Language / 語言: switch interface to 中文（Chinese）'
      }
      title={controlLabel}
      className={`inline-flex h-11 min-h-11 shrink-0 touch-manipulation select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-line bg-surface-raised px-3 text-sm font-medium text-ink shadow-sm hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:bg-surface-sunken ${className}`}
    >
      <Languages aria-hidden="true" className="size-4 shrink-0" />
      <span className="hidden sm:inline xl:hidden">{compactControlLabel}</span>
      <span className="hidden xl:inline">{controlLabel}</span>
      <span aria-hidden="true" className="hidden text-ink-muted sm:inline">·</span>
      <span className="font-semibold">
        <span className="xl:hidden">{compactLabel}</span>
        <span className="hidden xl:inline">{label}</span>
      </span>
    </button>
  )
}
