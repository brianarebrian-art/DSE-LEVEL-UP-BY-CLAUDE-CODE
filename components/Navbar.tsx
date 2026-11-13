'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X, BookOpen } from 'lucide-react'
import Icon from '@/src/components/ui/Icon'
import AuthButton from '@/components/AuthButton'
import SignInNote from '@/components/SignInNote'
import Greeting from '@/components/Greeting'
import ThemeToggle from '@/components/ThemeToggle'
import { showsStudentLanguageControl } from '@/lib/localePreference'
import { A11yButton } from '@/components/A11yPanel'
import { useT, useLocale } from '@/lib/i18n'

// Phase 2 Task 1（Kate/Leo 2026-07-18）：light-first 清晨圖書館。純白底 + #1A1A1A 文字
// + 青色 accent；實心青掣用 accent-strong。
//
// 2026-07-30 更正：原註釋寫「#008B84 accent（WCAG AA 4.6:1）」，兩處都錯 ——
// #008B84 實測只有 4.00:1（vs #FAFAF8）／4.18:1（vs 白卡），內文未達 AA；
// 白字落 #00726C 係 5.80:1 而非 4.9:1。accent 已改為 #006B65。
// 色值一律唔好喺組件註釋寫死，改睇 globals.css 的 token 定義（每個值都附實測比值）。
//
// 2026-07-28 響應式統一（手機 / 平板 / 電腦一套內容）：
// 橫向導航條由 `md`(768px) 改為 `xl`(1280px) 先顯示。實測natural 闊度——
// 中文 1,059px、英文 1,210px（7 條連結 + 開始練習 + 語言 + 登入）——所以喺舊
// 斷點下，768–1210px 之間（即係【全部平板】同細 mon 手提電腦）啲中文標籤會斷成
// 兩行（「我的進 度」「影子溫書 室」），排版爛晒。而家凡係唔夠位就一律出漢堡選單，
// 而選單內容同橫向條【完全一樣】：7 條連結 + 開始練習 + 語言切換 + Google 登入。
//
// 排行榜 (leaderboard) removed 2026-07-20 — it was a fabricated-student gamification
// leaderboard (fake ranks + 🔥streak + fake stats), a §禁 gamification + §禁虛構 red line.
// ── 2026-08-21 導覽收斂（UI／UX 方案 §4.1）─────────────────────────────────
// 由六條平排連結收成四條內容入口。收斂嘅理由唔係「方案叫收就收」，係量出嚟嘅：
//
// 舊狀態：連結組 natural 闊度中文 1,020px（實測），加埋 logo／開始練習／
// 主題／語言／登入之後，橫向條要 `xl`(1280px) 先擺得落。即係話
// 【全部平板同細 mon 手提電腦】見到嘅都係漢堡選單 —— 橫向導航等於得桌面大 mon 先有。
// 收成四條之後擺得落 `lg`(1024px)，多咗一整個裝置級別攞返真正嘅導航。
//
// 邊三條降級、點解：
//   · /methodology、/about —— 本來已經喺 Footer，剷出導覽零成本
//   · /paper-warrior（紙筆戰士）—— 佢係一種【練習模式】，唔係「進度」「收藏」
//     嘅同級物。結構上屬於練習之下。降級唔等於收埋：已經同時擺入
//     科目總覽頁同 Footer「練習」欄，兩個入口都搵得返。
//
// 升上嚟嘅係 /bookmarks（收藏）—— 佢本來喺全站導覽入面【一個入口都冇】，
// 學生淨係由進度頁入得去。
//
// 同手機底欄嘅關係：三條相同（練習／進度／收藏），第四條刻意唔同 ——
// 桌面第四條係「筆記」，手機係「帳戶」。因為桌面右上角已經有 Google 登入掣，
// 再放「帳戶」係重複；手機底欄嗰四格拇指夠得到嘅位置就冇登入掣，所以要有。
// 次要殼層路由：關閉 Link 預取，避免首頁首屏同練習主 CTA 搶帶寬
//（PERF-HOME-PREFETCH-2026-10-29；稽核僅 lab TTFB/FCP，無偽造 Lighthouse 分）。
const NAV_PREFETCH_OFF = new Set([
  '/dashboard',
  '/bookmarks',
  '/account',
  '/notes',
  '/off-syllabus',
  '/about',
  '/credits',
])

// IA：四格跨裝置同名（練習·進度·收藏·帳戶）—— 漢堡主列同底欄一字不差。
// 筆記／不考之地降入「更多」，唔再同第四格搶位（以前桌面第四＝筆記、手機第四＝帳戶）。
const primaryLinks: {
  href: string
  key: 'tabPractice' | 'tabProgress' | 'tabSaved' | 'tabAccount'
}[] = [
  { href: '/subjects', key: 'tabPractice' },
  { href: '/dashboard', key: 'tabProgress' },
  { href: '/bookmarks', key: 'tabSaved' },
  { href: '/account', key: 'tabAccount' },
]

const moreLinks: {
  href: string
  key: 'notes' | 'offSyllabus'
}[] = [
  { href: '/notes', key: 'notes' },
  // 2026-09-26 Yuna：非 DSE 範圍嘅內容只由「更多」入，唔放首頁。
  { href: '/off-syllabus', key: 'offSyllabus' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const t = useT()
  const { locale } = useLocale()
  const en = locale === 'en'
  // 語言按鈕由 AppShell 固定在右上角。這裡只留出同寬的空位，避免蓋住漢堡或登入。
  const languageGutter = showsStudentLanguageControl(pathname)

  // 轉頁自動收埋（比逐個 Link onClick 可靠：瀏覽器上一頁／程式導航都收到）
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Esc 收選單（鍵盤用戶要有路出去）
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // left 要跟側欄讓位。position:fixed 係對住 viewport，唔係對住父層 ——
  // 所以喺 AppShell 包一個有 padding 嘅 div 推唔郁佢，一定要喺呢度出。
  return (
    <nav className="chrome-material fixed top-0 right-0 left-0 z-50 border-b border-line md:left-20 xl:left-[260px]">
 <div className="flex h-16 items-center gap-2 pl-4 sm:pl-8">
        {/* Logo */}
        <div className="flex min-w-0 items-center gap-2">
 <div className="hidden lg:block">
 <Greeting />
 </div>
 <Link href="/" aria-label="DSE Level Up" className="flex min-h-11 min-w-0 items-center gap-2 text-lg font-semibold text-ink md:hidden">
 <BookOpen size={22} className="shrink-0 text-accent" aria-hidden />
 <span className="whitespace-nowrap">
            DSE<span className="text-accent hidden sm:inline"> Level Up</span>
 </span>
 </Link>
 </div>

        {/* 橫向導航條 —— 只喺真係夠位（≥1280px）先出，否則寧願用漢堡都唔好斷行 */}
        {/* 2026-09-30（改進循環 2，prompt §25）：原本 lg 起才出，768–1023px 平板同時有側欄及漢堡選單。
            改為 md 起出，漢堡只留給手機。 */}
        <div className="hidden min-w-0 flex-1 items-center justify-end gap-3 md:flex lg:gap-5">
          <Link
            href="/subjects"
            className="pressable min-h-11 px-3.5 py-2 text-sm font-medium text-ink-soft hover:text-accent flex items-center gap-2 rounded-[var(--radius-control)] border border-line bg-surface-raised shadow-2xs hover:border-line-strong transition-colors"
            aria-label={en ? 'Search questions' : '搜尋題目'}
            title={en ? 'Search questions' : '搜尋題目'}
          >
            <Icon name="search" size={16} label={en ? 'Search' : '搜尋題目'} />
            <span>{en ? 'Search' : '搜尋題目'}</span>
          </Link>
          <Link
            href="/subjects"
            className="pressable min-h-11 px-3.5 py-2 text-sm font-medium text-ink-soft hover:text-accent flex items-center gap-2 rounded-[var(--radius-control)] border border-line bg-surface-raised shadow-2xs hover:border-line-strong transition-colors"
            aria-label={en ? 'Filter subjects' : '篩選科目'}
            title={en ? 'Filter subjects, years and difficulty' : '篩選科目、年份、難度'}
          >
            <Icon name="filter" size={16} label={en ? 'Filter' : '篩選科目'} />
            <span>{en ? 'Filter' : '篩選科目'}</span>
          </Link>
          <Link
            href="/#quick-start"
            className="pressable ml-1 inline-flex h-12 min-h-12 items-center whitespace-nowrap rounded-[var(--radius-control)] border border-line-strong bg-transparent px-5 text-sm font-semibold tracking-wide text-ink shadow-xs transition-[background-color,transform,box-shadow] hover:bg-surface-sunken focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent active:scale-[0.97]"
          >
            {t.nav.startPractice}
          </Link>
 </div>

        <div className={`ml-auto flex shrink-0 items-center gap-1 ${languageGutter ? 'pr-28' : 'pr-4 sm:pr-8'}`}>
          <div className="hidden items-center gap-2 border-l border-line pl-2 md:flex">
            <ThemeToggle compact />
            <AuthButton />
          </div>
        {/* 漢堡掣 —— 手機同平板都係佢（<1280px） */}
        <div className="md:hidden flex items-center gap-1">
          {/* 手機的無障礙入口（2026-09-30 Yuna 決定 1）：放在漢堡掣旁邊，
              左下角浮動掣在手機上因此收起。平板及以上不顯示，維持浮動掣。 */}
          <A11yButton />
          {/* FIX: [C12類] icon-only 掣冇無障礙名，VoiceOver/TalkBack 用戶開唔到選單；
              順手補 44px 觸控目標（B10 標準）+ aria-expanded + aria-controls */}
          <button
            className="min-h-11 min-w-11 flex items-center justify-center rounded-lg text-ink-soft hover:text-accent hover:bg-line transition-colors"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={en ? (open ? 'Close menu' : 'Open menu') : open ? '關閉選單' : '開啟選單'}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
 </button>
 </div>
 </div>
 </div>

      {/* 選單面板 —— 內容同橫向條完全一致。手機單欄、平板雙欄（唔會拉到成版咁長）。 */}
      {open && (
        <div
          id="site-menu"
          className="md:hidden border-t border-line bg-surface-raised px-4 sm:px-8 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
 <div className="mx-auto max-w-6xl">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              {primaryLinks.map((l) => (
 <Link
                  key={l.href}
                  href={l.href}
                  prefetch={NAV_PREFETCH_OFF.has(l.href) ? false : undefined}
                  onClick={() => setOpen(false)}
                  className={`min-h-11 flex items-center border-b border-line text-sm ${
 pathname === l.href || pathname.startsWith(`${l.href}/`)
 ? 'text-accent font-medium'
 : 'text-ink-soft hover:text-accent'
 }`}
                >
                  {t.nav[l.key]}
                </Link>
 ))}
 </div>

 <div className="mt-4 border-t border-line pt-3">
 <p className="mb-1 text-xs font-medium uppercase tracking-wide text-ink-muted">
                {t.nav.more}
              </p>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                {moreLinks.map((l) => (
 <Link
                    key={l.href}
                    href={l.href}
                    prefetch={NAV_PREFETCH_OFF.has(l.href) ? false : undefined}
                    onClick={() => setOpen(false)}
                    className={`min-h-11 flex items-center border-b border-line text-sm ${
 pathname === l.href || pathname.startsWith(`${l.href}/`)
 ? 'text-accent font-medium'
 : 'text-ink-soft hover:text-accent'
 }`}
                  >
                    {t.nav[l.key]}
                  </Link>
 ))}
 <Link
                  href="/about"
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className={`min-h-11 flex items-center border-b border-line text-sm ${
 pathname === '/about' ? 'text-accent font-medium' : 'text-ink-soft hover:text-accent'
 }`}
                >
                  {t.footer.aboutUs}
                </Link>
 <Link
                  href="/credits"
                  prefetch={false}
                  onClick={() => setOpen(false)}
                  className={`min-h-11 flex items-center border-b border-line text-sm ${
 pathname === '/credits' ? 'text-accent font-medium' : 'text-ink-soft hover:text-accent'
 }`}
                >
                  {en ? 'Guardians' : '守護者致謝名單'}
                </Link>
 </div>
 </div>

            {/* 漢堡選單內容須與橫向條完全一致 —— 連目標路由亦然。 */}
            <Link
              href="/#quick-start"
              onClick={() => setOpen(false)}
              className="mt-4 flex h-14 min-h-14 items-center justify-center rounded-[var(--radius-control)] border border-line-strong bg-transparent text-sm font-medium text-ink transition-colors hover:bg-surface-sunken focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {t.nav.startPractice}
            </Link>

            {/* 語言按鈕在右上角常駐，不放進選單。登入仍與橫向列一致。 */}
            <div className="mt-3 flex flex-wrap items-center justify-end gap-2 border-t border-line pt-2">
 <AuthButton onAction={() => setOpen(false)} />
 </div>
 <SignInNote className="mt-2" />

            {/* 主題：選單內出完整三段式（自動／淺色／深色），選項一目了然。
                同語言切換分開兩行，避免學生以為兩者相關。 */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2">
 <span className="text-xs text-ink-muted">{en ? 'Theme' : '主題'}</span>
 <ThemeToggle />
 </div>
 </div>
 </div>
 )}
 </nav>
  )
}
