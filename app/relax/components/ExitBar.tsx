'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'

// 一鍵離開補給艙返 Dashboard（SEN 要求：任何頁面一 click 走）。
// client 組件，令文字跟語言切換（layout 係 server component，出唔到 hook）。
export default function ExitBar() {
  const { locale } = useLocale()
  const en = locale === 'en'
  return (
    <div className="flex justify-end mb-2">
      <Link
        href="/dashboard"
        className="text-xs text-[#8B8B96] hover:text-[#E8E8EC] transition-colors min-h-11 inline-flex items-center px-2"
      >
        {en ? 'Leave the station →' : '離開補給艙 →'}
      </Link>
    </div>
  )
}
