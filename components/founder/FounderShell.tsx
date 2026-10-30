'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState, useTransition } from 'react'
import {
  FOUNDER_NAV,
  FOUNDER_WORK_MODES,
  type FounderWorkMode,
} from '@/lib/founder/nav'
import { authSignOut } from '@/lib/auth/session'
import FounderCommandBar from '@/components/founder/FounderCommandBar'
import './founder-theme.css'

const FAV_KEY = 'fos_favorites'
const RECENT_KEY = 'fos_recent'

export type FounderShellProps = {
  email: string
  name: string
  envLabel: string
  platformStatus: string
  badges?: Record<string, number>
  children: React.ReactNode
}

export default function FounderShell({
  email,
  name,
  envLabel,
  platformStatus,
  badges = {},
  children,
}: FounderShellProps) {
  const pathname = usePathname() || '/founder'
  const searchParams = useSearchParams()
  const router = useRouter()
  const [navOpen, setNavOpen] = useState(false)
  const [q, setQ] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
 const [recent, setRecent] = useState<string[]>([])
  const [, startTransition] = useTransition()

  const mode = (searchParams.get('mode') as FounderWorkMode) || 'command'

  useEffect(() => {
    try {
      setFavorites(JSON.parse(localStorage.getItem(FAV_KEY) || '[]') as string[])
      setRecent(JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') as string[])
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    setNavOpen(false)
    try {
      const prev = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') as string[]
      const next = [pathname, ...prev.filter((p) => p !== pathname)].slice(0, 8)
      localStorage.setItem(RECENT_KEY, JSON.stringify(next))
      setRecent(next)
    } catch {
      /* ignore */
    }
  }, [pathname])

  const flatNav = useMemo(
    () => FOUNDER_NAV.flatMap((g) => g.items.map((i) => ({ ...i, group: g.label }))),
    [],
  )

  const searchHits = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return []
    return flatNav
      .filter((i) => `${i.label} ${i.labelEn} ${i.href}`.toLowerCase().includes(needle))
      .slice(0, 8)
  }, [q, flatNav])

  function setMode(next: FounderWorkMode) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('mode', next)
    startTransition(() => router.replace(`${pathname}?${params.toString()}`))
  }

  function toggleFav(href: string) {
    setFavorites((prev) => {
      const next = prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href].slice(0, 12)
      try {
        localStorage.setItem(FAV_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }

  const statusClass =
    platformStatus === 'optimal'
      ? 'fos-badge-ok'
      : platformStatus === 'degraded'
        ? 'fos-badge-warn'
        : 'fos-badge-warn'

  return (
    <div data-founder-os data-mode={mode} className="flex min-h-dvh flex-col text-[15px]">
 <a
        href="#fos-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded focus:bg-cyan-400 focus:px-3 focus:py-2 focus:text-slate-900"
      >
 跳到主要內容
 </a>

 <header className="sticky top-0 z-30 border-b border-[var(--fos-border-soft)] bg-[color-mix(in_srgb,var(--fos-bg)_90%,transparent)] backdrop-blur-md">
 <div className="flex flex-wrap items-center gap-3 px-3 py-2.5 md:px-4">
 <button
            type="button"
            className="rounded-lg border border-[var(--fos-border-soft)] px-2.5 py-1.5 text-sm text-[var(--fos-cyan)] lg:hidden"
            aria-expanded={navOpen}
            aria-controls="fos-nav"
            onClick={() => setNavOpen((v) => !v)}
 >
 選單
 </button>
 <div className="min-w-0 flex-1">
 <p className="truncate text-sm font-semibold tracking-wide text-[var(--fos-cyan)] md:text-base">
 DSE LEVEL UP — FOUNDER OS
 </p>
 <p className="truncate text-xs text-[var(--fos-muted)]">創辦人指揮中心 · Founder Command</p>
 </div>
 <span
            className={`rounded-full border px-2.5 py-0.5 text-xs ${statusClass}`}
            role="status"
            aria-live="polite"
            title="平台狀態（由真實指標推斷，非合成健康分）"
          >
            {platformStatus === 'optimal'
              ? '狀態正常'
              : platformStatus === 'degraded'
                ? '狀態降級 — 請睇簡報'
                : '狀態未知'}
          </span>
 <span className="rounded-full border border-[var(--fos-border-soft)] px-2.5 py-0.5 text-xs text-[var(--fos-muted)]">
            {envLabel}
          </span>
 <div className="relative w-full sm:w-56 md:w-64">
 <label className="sr-only" htmlFor="fos-global-search">
 全域搜尋
 </label>
 <input
              id="fos-global-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="搜尋模組…"
              className="w-full rounded-lg border border-[var(--fos-border-soft)] bg-[var(--fos-panel)] px-3 py-1.5 text-sm text-[var(--fos-ink)] placeholder:text-[var(--fos-faint)]"
              autoComplete="off"
            />
            {searchHits.length > 0 && (
 <ul className="absolute z-40 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-[var(--fos-border)] bg-[var(--fos-panel)] shadow-lg">
                {searchHits.map((hit) => (
 <li key={hit.href}>
 <Link
                      href={hit.href}
                      className="block px-3 py-2 text-sm hover:bg-[color-mix(in_srgb,var(--fos-cyan)_10%,transparent)]"
                      onClick={() => setQ('')}
 >
 <span className="text-[var(--fos-ink)]">{hit.label}</span>
 <span className="ml-2 text-xs text-[var(--fos-faint)]">{hit.group}</span>
 </Link>
 </li>
 ))}
 </ul>
 )}
 </div>
 <div className="flex items-center gap-2 text-xs text-[var(--fos-muted)]">
 <span className="hidden max-w-[10rem] truncate sm:inline" title={email}>
              {name || email}
            </span>
 <button
              type="button"
              onClick={() => {
                void authSignOut()
              }}
              className="rounded-lg border border-[var(--fos-border-soft)] px-2.5 py-1.5 text-[var(--fos-cyan)] hover:border-[var(--fos-cyan)]"
            >
 登出
 </button>
 </div>
 </div>
 <div className="flex gap-1 overflow-x-auto px-3 pb-2 md:px-4" role="tablist" aria-label="工作模式">
          {FOUNDER_WORK_MODES.map((m) => (
 <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={mode === m.id}
              title={m.description}
              onClick={() => setMode(m.id)}
              className={`shrink-0 rounded-md px-3 py-1 text-xs ${
 mode === m.id
 ? 'bg-[color-mix(in_srgb,var(--fos-cyan)_18%,transparent)] text-[var(--fos-cyan)]'
 : 'text-[var(--fos-muted)] hover:text-[var(--fos-ink)]'
 }`}
            >
              {m.label}
            </button>
 ))}
 </div>
 </header>

 <div className="flex min-h-0 flex-1">
 <aside
          id="fos-nav"
          className={`${
 navOpen ? 'fixed inset-y-0 left-0 z-40 flex w-[min(18rem,85vw)]' : 'hidden'
 } flex-col border-r border-[var(--fos-border-soft)] bg-[var(--fos-panel)] lg:static lg:flex lg:w-60 lg:shrink-0`}
        >
 <div className="flex items-center justify-between border-b border-[var(--fos-border-soft)] px-3 py-2 lg:hidden">
 <span className="text-sm text-[var(--fos-cyan)]">導航</span>
 <button type="button" className="text-sm text-[var(--fos-muted)]" onClick={() => setNavOpen(false)}>
 關閉
 </button>
 </div>
 <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Founder OS 導航">
            {favorites.length > 0 && (
 <div className="mb-3">
 <p className="fos-panel-title mb-1 px-2">我的最愛</p>
                {favorites.map((href) => {
                  const item = flatNav.find((i) => i.href === href)
 if (!item) return null
 return (
 <Link key={href} href={href} className="fos-nav-link" aria-current={pathname === href ? 'page' : undefined}>
                      {item.label}
                    </Link>
 )
 })}
 </div>
            )}
            {recent.length > 0 && (
 <div className="mb-3">
 <p className="fos-panel-title mb-1 px-2">最近瀏覽</p>
                {recent.slice(0, 5).map((href) => {
                  const item = flatNav.find((i) => i.href === href)
 return (
 <Link key={href} href={href} className="fos-nav-link" aria-current={pathname === href ? 'page' : undefined}>
                      {item?.label ?? href}
                    </Link>
 )
 })}
 </div>
            )}
            {FOUNDER_NAV.map((group) => (
 <div key={group.id} className="mb-3">
 <p className="fos-panel-title mb-1 px-2">{group.label}</p>
 <ul>
                  {group.items.map((item) => {
                    const badge = item.badgeKey ? badges[item.badgeKey] : undefined
                    const current = pathname === item.href || (item.href !== '/founder' && pathname.startsWith(`${item.href}/`))
                    return (
                      <li key={item.href} className="flex items-center gap-1">
 <Link
                          href={item.href}
                          className="fos-nav-link min-w-0 flex-1"
                          aria-current={current ? 'page' : undefined}
                        >
 <span className="flex items-center justify-between gap-2">
 <span className="truncate">{item.label}</span>
                            {typeof badge === 'number' && badge > 0 && (
 <span className="rounded-full bg-[color-mix(in_srgb,var(--fos-warn)_25%,transparent)] px-1.5 text-[10px] text-[var(--fos-warn)]">
                                {badge > 99 ? '99+' : badge}
 </span>
 )}
 </span>
 </Link>
 <button
                          type="button"
                          className="px-1 text-[var(--fos-faint)] hover:text-[var(--fos-cyan)]"
                          aria-label={favorites.includes(item.href) ? '取消最愛' : '加入最愛'}
                          onClick={() => toggleFav(item.href)}
                        >
                          {favorites.includes(item.href) ? '' : ''}
                        </button>
 </li>
 )
 })}
 </ul>
 </div>
 ))}
 </nav>
 <div className="border-t border-[var(--fos-border-soft)] p-3 text-[10px] leading-relaxed text-[var(--fos-faint)]">
 <p>身份由伺服器驗證。Session 撤銷：撳登出，或喺 Google 帳戶撤銷本應用授權後重新登入。</p>
 <p className="mt-1.5">
              快捷：頂欄搜尋模組；「我的最愛」可釘常用頁。內容審核去{' '}
              <Link href="/admin" className="text-[var(--fos-cyan)] underline-offset-2 hover:underline">
 /admin
 </Link>
 。
 </p>
 </div>
 </aside>
        {navOpen && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-scrim lg:hidden"
            aria-label="關閉選單"
            onClick={() => setNavOpen(false)}
 />
 )}

 <div className="flex min-w-0 flex-1 flex-col">
 <main id="fos-main" className="flex-1 px-3 py-4 md:px-5">
            {children}
          </main>
 <FounderCommandBar />
 </div>
 </div>
 </div>
  )
}
