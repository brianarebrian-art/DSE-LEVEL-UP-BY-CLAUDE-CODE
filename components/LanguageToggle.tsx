'use client'

import { Languages } from 'lucide-react'
import { useLocale } from '@/lib/i18n'

// Flips the whole UI between 中文 and English. The label shows the language you
// would switch TO, not the current one.
export default function LanguageToggle() {
  const { locale, toggle } = useLocale()
  return (
    <button
      onClick={toggle}
      aria-label={locale === 'zh' ? 'Switch to English' : '切換至中文'}
      className="min-h-11 min-w-11 flex items-center justify-center gap-1.5 text-sm font-medium text-[#6B6B6B] hover:text-[#008B84] transition-colors"
    >
      <Languages size={16} />
      {locale === 'zh' ? 'EN' : '中'}
    </button>
  )
}
