'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { Target, Dna, ChartColumnIncreasing, Leaf, Bookmark, Sprout } from 'lucide-react'
import OwlMark from '@/components/OwlMark'
import { useT, useLocale } from '@/lib/i18n'
import { isImmersiveRoute } from '@/lib/immersiveRoutes'

// 左側導航欄 —— Night Study 設計（Claude Design `templates/night-study/NightStudy`）。
//
// ══ 2026-09-19：項目清單改跟模板 ══
// 2026-09-03 版冇跟規格嘅五項，理由有兩個：（a）五項入面只有兩項有路由；
// （b）規格冇「練習」。今次兩個理由都唔再成立 ——
//   · 模板版本已經加咗「↳ Today's Practice」，擺喺每日任務之下；
//   · 等級預測有咗自己嘅頁（/predictor）。
// 所以清單改跟模板，但有三處刻意唔跟：
//   ① 冇 Focus Mode。Brian 2026-09-05 親口剷除成個「專注」功能
//      （commit 536397f），呼吸法已搬入呼吸空間。模板喺呢個裁決之前畫成。
//   ② 錯題 DNA 唔開新頁，指去 /dashboard#error-dna。同一個 commit 入面 Brian
//      將「溫書地圖」合併返落進度頁（「合併落去我哋嘅進度嗰度」）——
//      另開一頁錯題 DNA，就係重建佢啱啱合併走嘅嘢。
//   ③ 保留「收藏」。模板冇佢，但剷走即係有人今日撳得到、明日撳唔到。
//      直向側欄多一項只係多 52px 高（見下面「點解可以擺到六項」）。
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

// `sub`：模板將「今日練習」縮入每日任務之下（↳）—— 層級係資訊，唔係裝飾：
// 練習係每日任務入面嘅一件事，唔係並列嘅另一個分區。
// 完整側欄嗰陣 sub 項用 ↳ 代替圖標；80px 欄冇位畫層級，淨係一個 ↳ 又唔知係乜，
// 所以喺嗰度照出自己個 icon。
const ITEMS = [
  { href: '/dashboard', key: 'mission', Icon: Target, exact: true, sub: false },
  { href: '/subjects', key: 'todayPractice', Icon: Sprout, exact: false, sub: true },
  { href: '/dashboard#error-dna', key: 'errorDna', Icon: Dna, exact: true, sub: false },
  { href: '/predictor', key: 'predictor', Icon: ChartColumnIncreasing, exact: false, sub: false },
  { href: '/relax', key: 'relax', Icon: Leaf, exact: false, sub: false },
  { href: '/bookmarks', key: 'saved', Icon: Bookmark, exact: false, sub: false },
] as const

/** 錨點連結永遠唔算「目前頁」—— pathname 冇 hash，否則會同每日任務一齊亮。 */
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
      {/* 品牌區。模板將貓頭鷹置中放大、名字用襯線體；80px 欄下只剩吉祥物。
          模板嘅貓頭鷹係 150px —— 喺 1280×720 嘅手提電腦上，品牌區會食走
          三分一個側欄高度，六個導航項就要捲。收到 88px，名字同副題照跟模板。 */}
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

      <ul className="flex flex-1 flex-col gap-1 px-3 py-4 xl:px-4">
        {ITEMS.map(({ href, key, Icon, exact, sub }) => {
          const active = isActive(pathname, href, exact)
          return (
            <li key={href} className={sub ? 'xl:ml-6' : undefined}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                title={t.sidebar[key]}
                // 選中態跟模板：整格淺色底加一圈邊，冇左豎條。
                // 字色維持 text-ink 而唔係 accent —— accent 字疊喺 accent 底上面
                // 會食走對比；邊框同底色已經夠講「你喺度」，讀屏靠 aria-current。
                className={`flex items-center gap-3 rounded-xl border px-3 font-serif transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
                  sub ? 'min-h-11 text-[15px]' : 'min-h-[52px] text-[17px]'
                } ${
                  active
                    ? 'border-accent/35 bg-accent/15 text-ink'
                    : 'border-transparent text-ink-soft hover:bg-accent/8 hover:text-ink'
                }`}
              >
                <Icon
                  size={22}
                  strokeWidth={1.3}
                  aria-hidden
                  className={`shrink-0 text-gold ${sub ? 'xl:hidden' : ''}`}
                />
                {sub && (
                  <span aria-hidden className="hidden text-ink-muted xl:inline">
                    ↳
                  </span>
                )}
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
      <div className="hidden gap-3 border-t border-line px-6 py-5 xl:flex">
        <Leaf size={18} strokeWidth={1.2} aria-hidden className="mt-1 shrink-0 text-gold" />
        <p className="font-serif text-sm italic leading-relaxed text-ink-muted">{t.sidebar.quote}</p>
      </div>
    </nav>
  )
}
