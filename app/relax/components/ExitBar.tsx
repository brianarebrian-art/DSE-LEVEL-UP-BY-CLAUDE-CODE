'use client'

import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { useLocale } from '@/lib/i18n'

// 呼吸空間頂欄：左邊 logo 返主頁，右邊一鍵返 Dashboard。
//
// 2026-09-05：加返左上角 logo（Brian）。呢區自成一格、冇 Navbar，
// 之前入到嚟就完全冇品牌識別，亦冇一條路返主頁 —— 只有一條返 Dashboard。
// 兩個出口刻意去唔同地方，唔係重複：
//   logo → `/`          「我想離開呢個情境」
//   離開 → `/dashboard` 「我準備好返去溫書」
// 一個攰到想收工嘅學生同一個抖夠想繼續嘅學生，需要嘅唔係同一道門。
//
// client 組件，令文字跟語言切換（layout 係 server component，出唔到 hook）。
export default function ExitBar() {
  const { locale } = useLocale()
  const en = locale === 'en'
  return (
    <div className="flex items-center justify-between mb-2">
      <Link
        href="/"
        aria-label={en ? 'DSE Level Up — back to home' : 'DSE Level Up — 返回主頁'}
        className="inline-flex items-center gap-2 min-h-11 px-2 -ml-2 rounded-lg text-ink transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <BookOpen size={20} className="text-accent" aria-hidden />
        <span className="font-medium tracking-tight">
          DSE <span className="text-accent">Level Up</span>
        </span>
      </Link>

      <Link
        href="/dashboard"
        className="text-sm text-accent hover:text-accent-hover hover:underline underline-offset-4 transition-colors min-h-11 inline-flex items-center px-2"
      >
        {en ? 'Leave the Breathing Space →' : '離開呼吸空間 →'}
      </Link>
    </div>
  )
}
