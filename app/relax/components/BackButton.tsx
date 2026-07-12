'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'

// 返去 ⚡ Buff 補給艙主頁（44px 觸控目標，SEN 要求）。client 組件，文字跟語言切換。
export default function BackButton() {
  const { locale } = useLocale()
  const en = locale === 'en'
  return (
    <Link
      href="/relax"
      className="inline-flex items-center gap-1.5 min-h-11 px-2 -ml-2 text-sm text-[#8B8B96] hover:text-[#E8E8EC] transition-colors"
    >
      ← {en ? 'Back to Buff Station' : '返去補給艙'}
    </Link>
  )
}
