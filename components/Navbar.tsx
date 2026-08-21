'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Menu, X, BookOpen } from 'lucide-react'
import AuthButton from '@/components/AuthButton'
import LanguageToggle from '@/components/LanguageToggle'
import ThemeToggle from '@/components/ThemeToggle'
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
const navLinks: {
  href: string
  key: 'subjects' | 'progress' | 'tabSaved' | 'notes'
}[] = [
  { href: '/subjects', key: 'subjects' },
  { href: '/dashboard', key: 'progress' },
  { href: '/bookmarks', key: 'tabSaved' },
  { href: '/notes', key: 'notes' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const t = useT()
  const { locale } = useLocale()
  const en = locale === 'en'

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-line bg-surface-raised">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="min-h-11 flex items-center gap-2 font-medium text-lg text-ink">
            <BookOpen size={22} className="text-accent" />
            <span className="whitespace-nowrap">
              DSE <span className="text-accent">Level Up</span>
            </span>
          </Link>
        </div>

        {/* 橫向導航條 —— 只喺真係夠位（≥1280px）先出，否則寧願用漢堡都唔好斷行 */}
        <div className="hidden lg:flex items-center gap-6">
          {/* P1-3 WCAG：導航鏈接補 44px 觸控高度（navbar 容器 64px 高，視覺不變） */}
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm whitespace-nowrap transition-colors min-h-11 inline-flex items-center px-1 ${
                pathname === l.href ? 'text-accent' : 'text-ink-muted hover:text-accent'
              }`}
            >
              {t.nav[l.key]}
            </Link>
          ))}
          {/* 全科入口 —— 2026-08-09 由 /subjects/math 改為 /subjects：「開始練習」
              屬通用行動呼籲，直接導向數學科等於代學生選定科目。路由為複數。 */}
          <Link
            href="/subjects"
            className="ml-2 min-h-11 inline-flex items-center whitespace-nowrap bg-accent-strong hover:bg-accent-hover text-on-accent font-medium text-sm px-4 py-2 rounded-lg transition-colors"
          >
            {t.nav.startPractice}
          </Link>
          {/* compact 單掣：三段式會令英文版超出 xl 斷點，重新出現標籤斷行 */}
          <ThemeToggle compact />
          <LanguageToggle />
          <AuthButton />
        </div>

        {/* 漢堡掣 —— 手機同平板都係佢（<1280px） */}
        <div className="lg:hidden flex items-center">
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

      {/* 選單面板 —— 內容同橫向條完全一致。手機單欄、平板雙欄（唔會拉到成版咁長）。 */}
      {open && (
        <div
          id="site-menu"
          className="lg:hidden border-t border-line bg-surface-raised px-4 sm:px-8 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`min-h-11 flex items-center border-b border-line text-sm ${
                    pathname === l.href ? 'text-accent font-medium' : 'text-ink-soft hover:text-accent'
                  }`}
                >
                  {t.nav[l.key]}
                </Link>
              ))}
            </div>

            {/* 漢堡選單內容須與橫向條完全一致 —— 連目標路由亦然。 */}
            <Link
              href="/subjects"
              onClick={() => setOpen(false)}
              className="mt-4 min-h-11 flex items-center justify-center bg-accent-strong hover:bg-accent-hover text-on-accent font-medium text-sm py-2.5 rounded-lg transition-colors"
            >
              {t.nav.startPractice}
            </Link>

            {/* 語言切換同登入 —— 手機／平板一樣搵得到（之前橫向條斷行時就係呢兩樣最易失蹤） */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2">
              <div className="flex items-center gap-1">
                <span className="text-xs text-ink-muted">{en ? 'Language' : '語言'}</span>
                <LanguageToggle />
              </div>
              <AuthButton onAction={() => setOpen(false)} />
            </div>

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
