'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { BookOpen, Target, Bookmark, Leaf } from 'lucide-react'
import OwlMark from '@/components/OwlMark'
import { useT, useLocale } from '@/lib/i18n'
import { isImmersiveRoute } from '@/lib/immersiveRoutes'

// 左側導航欄 —— 規格 §3.1（「深夜書房療癒風」2026-09-03，Yuna 核准版式）。
//
// ══ 點解導航項同規格圖唔一樣 ══
// 規格 §3.1 列咗五項並註明「順序不可變」：
//   Daily Mission / Error DNA / Grade Predictor / Focus Mode / Breathing Room
// 逐條對返實際路由，五項入面【只有兩項有路由】：
//   Daily Mission → 冇；最接近係 /dashboard
//   Grade Predictor → 冇；等級預測分佈喺 /result 同 /prediction-method
//
// 更要緊嘅係：規格嗰五項【冇「練習」】。呢個站嘅核心動作就係做題 ——
// 一條由側欄入唔到練習嘅導航，唔係風格差異，係一個死結。
// 規格圖只畫咗七頁（全站有 43 頁），五項清單係嗰七頁嘅目錄，唔係全站 IA。
// 所以：版式、狀態、字級、間距全部照規格；項目清單用實際存在嘅目的地。
//
// ══ 點解可以擺到六項（Navbar 當初收到剩四條）══
// Navbar 收斂由六條變四條，理由係量出嚟嘅【橫向】闊度：連結組中文 1,020px，
// 加埋其他控件之後要 1280px 先擺得落（見 Navbar.tsx 註釋）。
// 直向側欄冇呢個約束 —— 每項自己一行，多兩項只係多 96px 高。
// 即係話當初嗰個取捨係綁死喺橫向排版嘅，換咗方向就唔再成立。
//
// ══ 斷點（規格 §7 有調整）══
//   ≥1280px  完整 260px 側欄
//   1024px+  80px 圖標欄
//   <1024px  唔顯示 —— 交返畀現有漢堡選單同底部 Tab Bar
// 規格寫 768px 就轉 80px 圖標欄。冇跟：768px 嘅平板剩返 688px 內容闊度，
// 而呢個站已經有一套做得好嘅漢堡＋底欄。喺細平板硬食走 80px，
// 換返嚟嘅只係一列冇字嘅圖標。
//
// ══ 沉浸式路由唔顯示 ══
// 同 Navbar／Footer／底欄一致（見 lib/immersiveRoutes.ts）。
// ⚠️ 規格圖 A／D／F（做題、呼吸空間、專注）畫住側欄，即係同現行
// 「沉浸式 = 零干擾」嘅決定相反。呢度維持現行做法，因為嗰個決定有寫低理由
// （答題時誤撳離開）。要改嘅話應該係一個獨立決定，唔係跟住換色順手改咗。

const ITEMS = [
  { href: '/subjects', key: 'practice', Icon: BookOpen, exact: false },
  { href: '/dashboard', key: 'progress', Icon: Target, exact: true },
  { href: '/bookmarks', key: 'saved', Icon: Bookmark, exact: false },
  { href: '/relax', key: 'relax', Icon: Leaf, exact: false },
] as const

export default function Sidebar() {
  const pathname = usePathname()
  const t = useT()
  const { locale } = useLocale()
  const en = locale === 'en'

  const hidden = isImmersiveRoute(pathname)

  // 掛 data-sidebar 落 <html>，令 --sidebar-w 生效（見 globals.css）。
  // 側欄係 z-40，而無障礙掣同閱讀尺係 z-50 —— 唔讓位嘅話兩個掣會浮喺側欄
  // 之上，實測正好壓住底部引言。同 BottomNav 掛 data-bottomnav 一樣嘅做法：
  // 掛喺 <html> 而唔係逐個組件傳 prop，側欄一收起變數即刻返 0。
  //
  // ⚠️ hook 要喺 early return 之前 —— 沉浸式路由同非沉浸式路由嘅 hook 數目
  // 唔一致嘅話，React 會喺切換路由嗰陣報 hook order 錯。
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
      className="no-print fixed inset-y-0 left-0 z-40 hidden w-20 flex-col border-r border-line bg-surface lg:flex xl:w-[260px]"
    >
      {/* 品牌區（規格 §3.1.1）。80px 欄下只剩吉祥物，文字收起。 */}
      <Link
        href="/"
        className="flex items-center gap-3 border-b border-line px-4 py-5 xl:px-6 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
      >
        <OwlMark size={40} className="shrink-0" />
        <span className="hidden min-w-0 xl:block">
          <span className="block truncate text-sm font-semibold tracking-[0.05em] text-ink">
            DSE LEVEL UP
          </span>
          <span className="block truncate text-xs text-ink-muted">{t.sidebar.tagline}</span>
        </span>
      </Link>

      <ul className="flex flex-1 flex-col gap-1 px-3 py-4">
        {ITEMS.map(({ href, key, Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`)
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                title={t.sidebar[key]}
                className={`relative flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
                  active
                    ? 'bg-accent/15 text-accent'
                    : 'text-ink-muted hover:bg-accent/8 hover:text-ink'
                }`}
              >
                {/* 選中態嘅左豎條（規格 §3.1.2）。裝飾用，讀屏靠 aria-current。 */}
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-accent"
                  />
                )}
                <Icon size={22} strokeWidth={1.5} aria-hidden className="shrink-0" />
                {/* 80px 欄收字，但唔可以淨靠 title —— 觸控裝置冇 hover。
                    故收字嗰陣用 sr-only 保住無障礙名，而 lg 斷點以下根本唔出側欄。 */}
                <span className="hidden xl:inline">{t.sidebar[key]}</span>
                <span className="sr-only xl:hidden">{t.sidebar[key]}</span>
              </Link>
            </li>
          )
        })}
      </ul>

      {/* 底部引用（規格 §3.1.3）。
          ⚠️ 規格原文係「Slow is smooth, smooth is fast. — Navy SEALs」。冇照用：
          （a）呢句嘅 Navy SEALs 出處查唔到實證，掛住一個查唔到嘅出處
               同憲章 §8 禁虛構嘅精神相反；
          （b）軍事框架同 §7 大愛設計、同呢班考緊試嘅中六生唔夾。
          改用憲章 §9 自己嗰句 —— 係我哋自己講過嘅話，冇出處問題，而且更貼題。 */}
      <div className="hidden border-t border-line px-6 py-5 xl:block">
        <Leaf size={16} strokeWidth={1.5} aria-hidden className="mb-2 text-ink-faint" />
        <p className="text-xs italic leading-relaxed text-ink-muted">{t.sidebar.quote}</p>
      </div>
    </nav>
  )
}
