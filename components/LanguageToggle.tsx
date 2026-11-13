'use client'

import { useLocale } from '@/lib/i18n'

// 按鈕文字是「將要切換去」的語言，不是目前語言。
// 固定最小寬度，避免「English」與「中文」換字時把導覽列撐開。
export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, toggle } = useLocale()
  const label = locale === 'zh' ? 'English' : '中文'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        locale === 'zh'
          ? 'Switch interface language to English（將介面語言切換至英文）'
          : '將介面語言切換至中文（Switch interface language to Chinese）'
      }
      className={`inline-flex h-11 min-h-11 min-w-20 shrink-0 touch-manipulation select-none items-center justify-center whitespace-nowrap rounded-lg border border-line bg-surface-raised px-3 text-sm font-medium text-ink shadow-sm hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:bg-surface-sunken ${className}`}
    >
      {label}
    </button>
  )
}
