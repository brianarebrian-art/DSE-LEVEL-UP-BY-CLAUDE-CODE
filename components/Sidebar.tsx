'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import {
  BookOpen,
  TrendingUp,
  Bookmark,
  UserRound,
  NotebookPen,
  Dna,
  ChartColumnIncreasing,
  Leaf,
  Compass,
} from 'lucide-react'
import { useT, useLocale } from '@/lib/i18n'
import { isImmersiveRoute } from '@/lib/immersiveRoutes'

/** Morandi shell: narrow left rail — four primary tabs match BottomNav. */
const PRIMARY = [
  { href: '/subjects', key: 'practice' as const, Icon: BookOpen, exact: false },
  { href: '/dashboard', key: 'progress' as const, Icon: TrendingUp, exact: true },
  { href: '/bookmarks', key: 'saved' as const, Icon: Bookmark, exact: false },
  { href: '/account', key: 'account' as const, Icon: UserRound, exact: false },
]

const MORE = [
  { href: '/notes', key: 'notes' as const, Icon: NotebookPen, exact: false },
  { href: '/dashboard#error-dna', key: 'errorDna' as const, Icon: Dna, exact: true },
  { href: '/predictor', key: 'predictor' as const, Icon: ChartColumnIncreasing, exact: false },
  { href: '/relax', key: 'relax' as const, Icon: Leaf, exact: false },
  { href: '/off-syllabus', key: 'offSyllabus' as const, Icon: Compass, exact: false },
]

const SIDEBAR_PREFETCH_OFF: ReadonlySet<string> = new Set(
  [...PRIMARY, ...MORE].map((i) => i.href).filter((href) => href !== '/subjects'),
)

function isActive(pathname: string, href: string, exact: boolean): boolean {
  if (href.includes('#')) return false
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
}

export default function Sidebar() {
  const pathname = usePathname()
  const t = useT()
  const { locale } = useLocale()
  const en = locale === 'en'
  const hidden = isImmersiveRoute(pathname)

  useEffect(() => {
    const el = document.documentElement
    if (hidden) el.removeAttribute('data-sidebar')
    else el.setAttribute('data-sidebar', 'on')
    return () => el.removeAttribute('data-sidebar')
  }, [hidden])

  if (hidden) return null

  const linkClass = (active: boolean) =>
    `pressable flex min-h-[52px] w-full flex-col items-center justify-center gap-0.5 rounded-[var(--radius-control)] px-1 text-[10px] font-medium transition-colors xl:flex-row xl:justify-start xl:gap-3 xl:px-3 xl:text-[15px] ${
      active
        ? 'bg-accent/12 text-accent'
        : 'text-ink-muted hover:bg-surface-sunken hover:text-ink'
    }`

  return (
    <nav
      aria-label={en ? 'Main' : '主要導航'}
      className="chrome-material no-print fixed inset-y-0 left-0 z-40 hidden w-20 flex-col border-r border-line md:flex xl:w-[260px]"
    >
      <Link
        href="/"
        className="flex min-h-16 flex-col items-center justify-center border-b border-line px-2 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent xl:items-start xl:px-5"
      >
        <span className="text-[11px] font-semibold tracking-wide text-accent xl:text-sm">DSE</span>
        <span className="hidden text-sm font-semibold text-ink xl:inline">Level Up</span>
      </Link>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-2 py-4 xl:px-3">
        <div role="group" aria-label={en ? 'Main' : '主要'}>
          <p className="mb-1 hidden px-2 text-[11px] font-medium uppercase tracking-wider text-ink-muted xl:block">
            {t.sidebar.groupMain}
          </p>
          <ul className="flex flex-col gap-1">
            {PRIMARY.map(({ href, key, Icon, exact }) => {
              const active = isActive(pathname, href, exact)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    prefetch={SIDEBAR_PREFETCH_OFF.has(href) ? false : undefined}
                    aria-current={active ? 'page' : undefined}
                    title={t.sidebar[key]}
                    className={linkClass(active)}
                  >
                    <Icon size={22} strokeWidth={active ? 2.2 : 1.75} aria-hidden className="shrink-0" />
                    <span className="truncate xl:inline">{t.sidebar[key]}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div role="group" aria-label={t.sidebar.groupMore} className="border-t border-line pt-3">
          <p className="mb-1 hidden px-2 text-[11px] font-medium uppercase tracking-wider text-ink-muted xl:block">
            {t.sidebar.groupMore}
          </p>
          <ul className="flex flex-col gap-1">
            {MORE.map(({ href, key, Icon, exact }) => {
              const active = isActive(pathname, href, exact)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    prefetch={SIDEBAR_PREFETCH_OFF.has(href) ? false : undefined}
                    aria-current={active ? 'page' : undefined}
                    title={t.sidebar[key]}
                    className={linkClass(active)}
                  >
                    <Icon size={20} strokeWidth={active ? 2.2 : 1.75} aria-hidden className="shrink-0" />
                    <span className="sr-only xl:not-sr-only xl:truncate">{t.sidebar[key]}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </nav>
  )
}
