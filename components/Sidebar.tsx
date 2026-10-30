'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import {
  Target,
  Dna,
  ChartColumnIncreasing,
  Leaf,
  Bookmark,
  Sprout,
  Compass,
  UserRound,
  NotebookPen,
} from 'lucide-react'
import OwlMark from '@/components/OwlMark'
import { useT, useLocale } from '@/lib/i18n'
import { isImmersiveRoute } from '@/lib/immersiveRoutes'

// 左側導航欄 —— 四格跨裝置同名（練習·進度·收藏·帳戶）＋「更多」次要項。
//
// ══ IA（2026-10-30）══
// 以前側欄第四格唔係帳戶、組名同底欄唔對齊；漢堡第四係筆記、手機第四係帳戶。
// 而家主列四項同 BottomNav／漢堡 primaryLinks 同一套 href＋用詞；
// 筆記／錯誤模式／練習表現／呼吸空間／不考之地入「更多」或尾組。
//
// ══ 斷點（規格 §7 有調整）══
//   ≥1280px  完整 260px 側欄
//   1024px+  80px 圖標欄（實際由 md 起出，見 tablet-rail）
//   <768px   唔顯示 —— 交返漢堡＋底欄
//
// ══ 沉浸式路由唔顯示 ══
// 同 Navbar／Footer／底欄一致（見 lib/immersiveRoutes.ts）。

const GROUPS = [
  { id: 'primary', labelKey: 'groupMain' as const },
  { id: 'more', labelKey: 'groupMore' as const },
  { id: 'other', labelKey: null },
] as const

type SidebarKey =
  | 'practice'
  | 'progress'
  | 'saved'
  | 'account'
  | 'notes'
  | 'errorDna'
  | 'predictor'
  | 'relax'
  | 'offSyllabus'

const ITEMS: {
  href: string
  key: SidebarKey
  Icon: typeof Sprout
  exact: boolean
  group: 'primary' | 'more' | 'other'
}[] = [
  { href: '/subjects', key: 'practice', Icon: Sprout, exact: false, group: 'primary' },
  { href: '/dashboard', key: 'progress', Icon: Target, exact: true, group: 'primary' },
  { href: '/bookmarks', key: 'saved', Icon: Bookmark, exact: false, group: 'primary' },
  { href: '/account', key: 'account', Icon: UserRound, exact: false, group: 'primary' },
  { href: '/notes', key: 'notes', Icon: NotebookPen, exact: false, group: 'more' },
  { href: '/dashboard#error-dna', key: 'errorDna', Icon: Dna, exact: true, group: 'more' },
  { href: '/predictor', key: 'predictor', Icon: ChartColumnIncreasing, exact: false, group: 'more' },
  { href: '/relax', key: 'relax', Icon: Leaf, exact: false, group: 'more' },
  // 2026-09-26：不考之地喺側欄最尾，維持「唔當眼」（憲章 §1.2.1）。
  { href: '/off-syllabus', key: 'offSyllabus', Icon: Compass, exact: false, group: 'other' },
]

// /subjects 係練習主入口，保持預設預取；其餘次要殼層關預取
//（PERF-HOME-PREFETCH-2026-10-29；稽核僅 lab TTFB/FCP）。
const SIDEBAR_PREFETCH_OFF: ReadonlySet<string> = new Set(
  ITEMS.map((i) => i.href).filter((href) => href !== '/subjects'),
)

/** 錨點連結永遠唔算「目前頁」—— pathname 冇 hash，否則會同「進度」一齊亮。 */
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

  // 掛 data-sidebar 落 <html>，令 --sidebar-w 生效（見 globals.css）。
  useEffect(() => {
    const el = document.documentElement
    if (hidden) el.removeAttribute('data-sidebar')
    else el.setAttribute('data-sidebar', 'on')
    return () => el.removeAttribute('data-sidebar')
  }, [hidden])

  if (hidden) return null

  return (
    <nav
      aria-label={en ? 'Sections' : '分區導航'}
      className="no-print fixed inset-y-0 left-0 z-40 hidden w-20 flex-col border-r border-line bg-surface md:flex xl:w-[260px]"
    >
      <Link
        href="/"
        className="flex flex-col items-center gap-2 border-b border-line px-3 py-5 text-center xl:px-6 xl:pb-6 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
      >
        <OwlMark size={40} className="shrink-0 xl:hidden" />
        <OwlMark size={88} className="hidden shrink-0 xl:block" />
        <span className="hidden min-w-0 xl:block">
          <span className="block font-serif text-xl tracking-[0.12em] text-gold-strong">
            DSE LEVEL UP
          </span>
          <span className="mt-0.5 block font-serif text-sm text-ink-muted">
            {t.sidebar.tagline}
          </span>
        </span>
      </Link>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-3 py-4 xl:px-4">
        {GROUPS.map((g, gi) => {
          const label = g.labelKey ? t.sidebar[g.labelKey] : t.sidebar.offSyllabus
          return (
            <div
              key={g.id}
              role="group"
              aria-label={label}
              className={g.id === 'other' ? 'mt-auto border-t border-line pt-3' : gi > 0 ? 'border-t border-line pt-3 xl:border-t-0 xl:pt-0' : ''}
            >
              {g.labelKey && (
                <p aria-hidden className="mb-1 hidden px-3 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted xl:block">
                  {label}
                </p>
              )}
              <ul className="flex flex-col gap-1">
                {ITEMS.filter((it) => it.group === g.id).map(({ href, key, Icon, exact }) => {
                  const active = isActive(pathname, href, exact)
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        prefetch={SIDEBAR_PREFETCH_OFF.has(href) ? false : undefined}
                        aria-current={active ? 'page' : undefined}
                        title={t.sidebar[key]}
                        className={`flex min-h-[52px] items-center gap-3 rounded-xl border px-3 font-serif text-[17px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
                          active
                            ? 'border-accent/35 bg-accent/15 text-ink'
                            : 'border-transparent text-ink-soft hover:bg-accent/8 hover:text-ink'
                        }`}
                      >
                        <Icon size={22} strokeWidth={1.3} aria-hidden className="shrink-0 text-gold" />
                        <span className="hidden xl:inline">{t.sidebar[key]}</span>
                        <span className="sr-only xl:hidden">{t.sidebar[key]}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="sidebar-quote hidden gap-3 border-t border-line px-6 py-5 xl:flex">
        <Leaf size={18} strokeWidth={1.2} aria-hidden className="mt-1 shrink-0 text-gold" />
        <p className="font-serif text-sm italic leading-relaxed text-ink-muted">{t.sidebar.quote}</p>
      </div>
    </nav>
  )
}
