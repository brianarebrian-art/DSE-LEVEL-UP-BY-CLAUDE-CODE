'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'

// 一鍵離開呼吸空間返 Dashboard（SEN 要求：任何頁面一 click 走）。
// client 組件，令文字跟語言切換（layout 係 server component，出唔到 hook）。
export default function ExitBar() {
  const { locale } = useLocale()
  const en = locale === 'en'
  return (
    <div className="flex justify-end mb-2">
      {/* FIX: [A2][B6] 「離開補給艙」→「離開呼吸空間」；text-xs（~11px 低可發現性）→
          text-sm + 品牌霓虹 #00F5D4 + hover:underline，觸控區 min-h-11 保留 */}
      <Link
        href="/dashboard"
        className="text-sm text-neon-cyan hover:text-[#7FFAE8] hover:underline underline-offset-4 transition-colors min-h-11 inline-flex items-center px-2"
      >
        {en ? 'Leave the Breathing Space →' : '離開呼吸空間 →'}
      </Link>
    </div>
  )
}
