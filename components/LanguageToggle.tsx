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
      className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors"
    >
      <Languages size={16} />
      {locale === 'zh' ? 'EN' : '中'}
    </button>
  )
}
