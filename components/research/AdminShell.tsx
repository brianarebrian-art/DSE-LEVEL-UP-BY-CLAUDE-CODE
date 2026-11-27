'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, ClipboardList, Inbox, LayoutDashboard, Settings } from 'lucide-react'
import { RESEARCH_HOME, RESEARCH_NAV } from '@/lib/research/nav'
import { useResearch } from '@/components/research/ResearchProvider'
import { Disclaimer, cx } from '@/components/research/ui'

const ICONS = [LayoutDashboard, ClipboardList, Inbox, BarChart3, Settings]

function NavLinks({ className }: { className: string }) {
  const pathname = usePathname()
  return (
    <nav aria-label="研究工作台" className={className}>
      {RESEARCH_NAV.map((item, index) => {
        const Icon = ICONS[index] ?? LayoutDashboard
        const active = item.href === '/research/admin'
          ? pathname === item.href
          : pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cx(
              'flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium',
              active ? 'bg-accent text-on-accent' : 'text-ink [@media(hover:hover)]:hover:bg-surface-sunken',
            )}
          >
            <Icon aria-hidden="true" focusable="false" width={18} height={18} />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { store } = useResearch()
  const compact = store?.settings.density === 'compact'
  return (
    <div className={compact ? 'text-sm' : 'text-base'}>
      <header className="sticky top-0 z-20 border-b border-line bg-surface-raised pt-[env(safe-area-inset-top)]">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-xs font-medium text-ink-muted">DSE Level Up</p>
            <p className="text-base font-semibold text-ink">用戶研究</p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <Link href={RESEARCH_HOME} className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm text-ink underline-offset-4 hover:underline">
              公開問卷
            </Link>
            <Link href="/" className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm text-ink underline-offset-4 hover:underline">
              返回首頁
            </Link>
          </div>
        </div>
        <NavLinks className="flex gap-2 overflow-x-auto px-4 pb-3 md:hidden" />
      </header>
      <div className="md:flex">
        <NavLinks className="hidden w-52 shrink-0 flex-col gap-1 border-r border-line p-3 md:flex" />
        <div className="min-w-0 flex-1 px-4 py-6 pb-28">{children}</div>
      </div>
      <Disclaimer />
    </div>
  )
}

export function PublicFrame({ children, trailing }: { children: React.ReactNode; trailing?: React.ReactNode }) {
  return (
    <div>
      <header className="border-b border-line bg-surface-raised pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-xs font-medium text-ink-muted">DSE Level Up</p>
            <p className="text-base font-semibold text-ink">用戶研究</p>
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            {trailing}
            <Link href="/research/admin" className="inline-flex min-h-11 items-center text-sm text-ink underline-offset-4 hover:underline">
              研究工作台
            </Link>
            <Link href="/" className="inline-flex min-h-11 items-center text-sm text-ink underline-offset-4 hover:underline">
              返回首頁
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-6 pb-28">{children}</div>
      <Disclaimer />
    </div>
  )
}
