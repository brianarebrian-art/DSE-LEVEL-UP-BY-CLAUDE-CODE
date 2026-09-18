'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useLocale, useT } from '@/lib/i18n'
import { neighbours } from '@/lib/pageOrder'

// 前／後頁導航 —— 掛喺 AppShell 一次，唔喺任何 page.tsx 出現。
//
// 唔喺主瀏覽循環嘅頁面（全屏任務模式、動態詳情頁、後台、Footer 資訊頁…）
// 由 `neighbours()` 回 null，本組件直接 return null。即係話：
//   · 加一條新 route 唔使記得嚟呢度改嘢
//   · 但 scripts/guard-nav.mjs 會要求你去 lib/pageOrder.ts 明示佢屬邊一類
//
// 目的地名沿用 `t.nav` 現有叫法（同底欄／側欄一致），唔另創一套新詞。

/** 循環入面每一站對應字典邊條 key —— 同 lib/pageOrder 嘅 PAGE_ORDER 對齊。 */
const LABEL: Record<string, (t: ReturnType<typeof useT>) => string> = {
  '/': (t) => t.pageNav.home,
  '/subjects': (t) => t.nav.tabPractice,
  '/dashboard': (t) => t.nav.tabProgress,
  '/bookmarks': (t) => t.nav.tabSaved,
  '/notes': (t) => t.nav.notes,
  '/account': (t) => t.nav.tabAccount,
}

export default function PageNav() {
  const pathname = usePathname()
  const { locale } = useLocale()
  const t = useT()
  const en = locale === 'en'

  const pair = neighbours(pathname)
  if (!pair) return null

  const nameFor = (href: string) => LABEL[href]?.(t) ?? href
  // 全形冒號淨係屬於中文版。英文版照用會令螢幕閱讀器讀出一個中文標點，
  // 而 aria-label 係唯一唔會被眼睇到、只會被讀出嚟嘅字。
  const label = (dir: string, href: string) => `${dir}${en ? ': ' : '：'}${nameFor(href)}`

  // min-h-11 = 44px（iOS HIG／WCAG 2.5.5 目標大小）。兩掣各佔一半，
  // 中間留 gap，唔用 divide —— 邊框本身已經分開咗。
  const base =
    'min-h-11 flex-1 inline-flex items-center gap-1.5 rounded-xl border border-line ' +
    'bg-surface-raised px-4 py-3 text-sm text-ink-soft transition-colors ' +
    'hover:bg-surface-sunken hover:text-ink ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

  return (
    <nav
      aria-label={en ? 'Page navigation' : '頁面導航'}
      className="mx-auto mt-10 flex w-full max-w-3xl items-stretch gap-3 px-4 pb-6"
    >
      <Link
        href={pair.prev}
        className={`${base} justify-start`}
        aria-label={label(t.pageNav.prev, pair.prev)}
      >
        <ChevronLeft size={16} className="shrink-0 text-ink-muted" aria-hidden />
        <span className="text-ink-muted">{t.pageNav.prev}</span>
        <span className="truncate font-medium">{nameFor(pair.prev)}</span>
      </Link>

      <Link
        href={pair.next}
        className={`${base} justify-end`}
        aria-label={label(t.pageNav.next, pair.next)}
      >
        <span className="truncate font-medium">{nameFor(pair.next)}</span>
        <span className="text-ink-muted">{t.pageNav.next}</span>
        <ChevronRight size={16} className="shrink-0 text-ink-muted" aria-hidden />
      </Link>
    </nav>
  )
}
