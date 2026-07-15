'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'

// 返去 🫁 呼吸空間主頁（44px 觸控目標，SEN 要求）。client 組件，文字跟語言切換。
export default function BackButton() {
  const { locale } = useLocale()
  const en = locale === 'en'
  return (
    // FIX: [A1][A2] 「返去補給艙」→「返去呼吸空間」
    <Link
      href="/relax"
      className="inline-flex items-center gap-1.5 min-h-11 px-2 -ml-2 text-sm text-[#8B8B96] hover:text-[#E8E8EC] transition-colors"
    >
      ← {en ? 'Back to the Breathing Space' : '返去呼吸空間'}
    </Link>
  )
}
