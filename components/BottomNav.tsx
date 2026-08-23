'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { BookOpen, Bookmark, TrendingUp, UserRound } from 'lucide-react'
import { useT, useLocale } from '@/lib/i18n'

// 手機底部導航（UI／UX 方案 §6.1）。
//
// ══ 點解要有 ══
// 桌面版導航喺頂部，手機用漢堡選單 —— 單手揸住電話時，拇指去到頂部要換手。
// 學生大部分係喺車上、床上、小息用手機做題，所以四個最常去嘅位置應該落喺
// 拇指範圍之內。
//
// ══ 四個入口點揀 ══
// 方案 §4.1 建議「今日／練習／回顧／我的」。呢度只採用結構，唔採用嗰四個名 ——
// 掣寫「今日」但撳落去個頁面寫「我的進度」，學生就要記兩套名。故一律沿用
// 目的地本身嘅叫法：練習、進度、收藏、帳戶。
//
// 順帶補返一個實際缺口：`/bookmarks`（收藏／錯題）本來喺【全站導覽入面完全冇
// 入口】，學生只能由進度頁入去。而家「收藏」成為四個常駐入口之一。
//
// ══ 沉浸式路由唔顯示 ══
// 練習、專注、呼吸空間、紙筆戰士呢類全螢幕任務模式，底欄會（a）食走垂直空間、
// （b）令學生答題時容易誤撳離開。呢啲頁自己已經有返回路徑，故底欄收起。
//
// ══ 同浮動掣嘅關係 ══
// 左右下角本身已經企滿咗無障礙面板、閱讀尺、情緒支援掣。底欄一出就會壓住佢哋，
// 所以底欄顯示時會喺 <html> 掛 `data-bottomnav="on"`，`--bottom-nav-h` 由 0 變成
// 底欄高度，所有用 `.floating-bottom*` 嘅浮動掣自動上移（見 globals.css）。
// 掛喺 <html> 而唔係各自傳 prop：底欄一收起，變數即刻返 0，唔會出現
// 「底欄冇咗但浮動掣仲吊喺半空」。

/** 全螢幕任務模式 —— 呢啲路由唔顯示底欄。 */
const IMMERSIVE = ['/practice', '/focus', '/relax', '/paper-warrior', '/answer-sheet']

export default function BottomNav() {
  const pathname = usePathname()
  const t = useT()
  const { locale } = useLocale()
  const en = locale === 'en'

  const hidden = IMMERSIVE.some((p) => pathname === p || pathname.startsWith(`${p}/`))

  useEffect(() => {
    const el = document.documentElement
    if (hidden) el.removeAttribute('data-bottomnav')
    else el.setAttribute('data-bottomnav', 'on')
    return () => el.removeAttribute('data-bottomnav')
  }, [hidden])

  if (hidden) return null

  const tabs = [
    { href: '/subjects', label: t.nav.tabPractice, Icon: BookOpen },
    { href: '/dashboard', label: t.nav.tabProgress, Icon: TrendingUp },
    { href: '/bookmarks', label: t.nav.tabSaved, Icon: Bookmark },
    { href: '/account', label: t.nav.tabAccount, Icon: UserRound },
  ]

  return (
    /* md:hidden —— 桌面有頂部導航，唔需要重複一次。
       z-50 同浮動掣同層：底欄係最底嘅一條，浮動掣已經被 --bottom-nav-h 推上去，
       兩者唔會重疊，故毋須再爭高低。 */
    <nav
      aria-label={en ? 'Main' : '主要導航'}
      className="no-print fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface-raised md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="flex">
        {tabs.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
                  active ? 'text-accent-strong' : 'text-ink-muted hover:text-ink-soft'
                }`}
              >
                {/* 圖標係裝飾 —— 下面已經有文字標籤，讀屏用戶唔應該聽兩次。
                    亦刻意唔用純圖標：圖標嘅意思因人而異，加咗字先至人人睇得明。 */}
                <Icon size={19} aria-hidden strokeWidth={active ? 2.2 : 1.8} />
                <span>{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
