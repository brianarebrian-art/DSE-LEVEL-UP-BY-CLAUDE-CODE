'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { intentLinks } from '@/lib/pageOrder'

// 頁底「下一步」—— 掛喺 AppShell 一次，唔喺任何 page.tsx 出現。
//
// 2026-09-30（UX 循環 LOOP 34）：由「上一頁／下一頁」改為按學生想做的事（lib/pageOrder.ts
// 的 INTENT_LINKS）。唔喺主瀏覽循環嘅頁面由 `intentLinks()` 回 null，本組件直接 return null；
// 新 route 仍要喺 lib/pageOrder.ts 分類（scripts/guard-nav.mjs）。
export default function PageNav() {
  const pathname = usePathname()
  const { locale } = useLocale()
  const en = locale === 'en'

  const links = intentLinks(pathname)
  if (!links) return null
  const [primary, secondary] = links

  // min-h-12 = 48px。第一個是主要動作（實心），第二個是次要（框線）。
  const base =
    'min-h-12 flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-3 text-sm font-medium transition-colors ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

  return (
    <nav aria-label={en ? 'Next step' : '下一步'} className="mx-auto mt-10 flex w-full max-w-3xl items-stretch gap-3 px-4 pb-6">
      <Link href={primary.href} className={`${base} bg-accent-strong text-on-accent hover:bg-accent-hover`}>
        {en ? primary.en : primary.zh} <ArrowRight size={16} aria-hidden />
      </Link>
      <Link href={secondary.href} className={`${base} border border-line bg-surface-raised text-ink-soft hover:bg-surface-sunken hover:text-ink`}>
        {en ? secondary.en : secondary.zh}
      </Link>
    </nav>
  )
}
