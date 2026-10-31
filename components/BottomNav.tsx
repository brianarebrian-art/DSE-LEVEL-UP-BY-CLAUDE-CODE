'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { BookOpen, TrendingUp, Bookmark, UserRound } from 'lucide-react'
import { useT, useLocale } from '@/lib/i18n'
import { isImmersiveRoute } from '@/lib/immersiveRoutes'

/** Morandi shell: four tabs — same labels as desktop rail. */
export default function BottomNav() {
  const pathname = usePathname()
  const t = useT()
  const { locale } = useLocale()
  const en = locale === 'en'
  const hidden = isImmersiveRoute(pathname)

  useEffect(() => {
    const el = document.documentElement
    if (hidden) el.removeAttribute('data-bottomnav')
    else el.setAttribute('data-bottomnav', 'on')
    return () => el.removeAttribute('data-bottomnav')
  }, [hidden])

  if (hidden) return null

  const BOTTOM_PREFETCH_OFF = new Set(['/dashboard', '/bookmarks', '/account'])
  const tabs = [
    { href: '/subjects', label: t.nav.tabPractice, Icon: BookOpen },
    { href: '/dashboard', label: t.nav.tabProgress, Icon: TrendingUp },
    { href: '/bookmarks', label: t.nav.tabSaved, Icon: Bookmark },
    { href: '/account', label: t.nav.tabAccount, Icon: UserRound },
  ]

  return (
    <nav
      aria-label={en ? 'Main' : '主要導航'}
      className="chrome-material no-print fixed inset-x-0 bottom-0 z-50 border-t border-line md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <ul className="flex">
        {tabs.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                prefetch={BOTTOM_PREFETCH_OFF.has(href) ? false : undefined}
                aria-current={active ? 'page' : undefined}
                className={`pressable flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
                  active ? 'text-accent' : 'text-ink-muted'
                }`}
              >
                <Icon size={22} aria-hidden strokeWidth={active ? 2.25 : 1.75} />
                <span>{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
