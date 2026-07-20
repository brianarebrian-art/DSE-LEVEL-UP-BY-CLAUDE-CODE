'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, BookOpen } from 'lucide-react'
import AuthButton from '@/components/AuthButton'
import LanguageToggle from '@/components/LanguageToggle'
import { useT, useLocale } from '@/lib/i18n'

// Phase 2 Task 1（Kate/Leo 2026-07-18）：light-first 清晨圖書館。純白底 + #1A1A1A 文字
// + #008B84 accent（WCAG AA 4.6:1）；實心青掣用 #00726C（白字 4.9:1）。保留全部真結構
// （5 條 i18n 連結 + LanguageToggle + AuthButton + mobile aria）—— 只轉色，唔動導航內容。

// 排行榜 (leaderboard) removed 2026-07-20 — it was a fabricated-student gamification
// leaderboard (fake ranks + 🔥streak + fake stats), a §禁 gamification + §禁虛構 red line.
const navLinks: { href: string; key: 'subjects' | 'progress' | 'methodology' | 'about' }[] = [
  { href: '/subjects', key: 'subjects' },
  { href: '/dashboard', key: 'progress' },
  { href: '/methodology', key: 'methodology' },
  { href: '/about', key: 'about' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const t = useT()
  const { locale } = useLocale()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/[0.06] bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="min-h-11 flex items-center gap-2 font-medium text-lg text-[#1A1A1A]">
            <BookOpen size={22} className="text-[#008B84]" />
            <span>
              DSE <span className="text-[#008B84]">Level Up</span>
            </span>
          </Link>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {/* P1-3 WCAG：導航鏈接補 44px 觸控高度（navbar 容器 64px 高，視覺不變） */}
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors min-h-11 inline-flex items-center px-1 ${
                pathname === l.href
                  ? 'text-[#008B84]'
                  : 'text-[#6B6B6B] hover:text-[#008B84]'
              }`}
            >
              {t.nav[l.key]}
            </Link>
          ))}
          <Link
            href="/subjects/math"
            className="ml-2 min-h-11 inline-flex items-center bg-[#00726C] hover:bg-[#005F5A] text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
          >
            {t.nav.startPractice}
          </Link>
          <LanguageToggle />
          <AuthButton />
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-3">
          {/* FIX: [C12類] icon-only 掣冇無障礙名，VoiceOver/TalkBack 用戶開唔到選單；
              順手補 44px 觸控目標（B10 標準）+ aria-expanded */}
          <button
            className="min-h-11 min-w-11 flex items-center justify-center text-[#6B6B6B] hover:text-[#1A1A1A]"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={
              locale === 'en'
                ? open ? 'Close menu' : 'Open menu'
                : open ? '關閉選單' : '開啟選單'
            }
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-black/[0.06] bg-white px-4 pb-4 pt-2 flex flex-col gap-3">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`py-2 text-sm ${
                pathname === l.href ? 'text-[#008B84]' : 'text-[#2D2D2D]'
              }`}
            >
              {t.nav[l.key]}
            </Link>
          ))}
          <Link
            href="/subjects/math"
            onClick={() => setOpen(false)}
            className="bg-[#00726C] text-white font-medium text-sm text-center py-2 rounded-lg"
          >
            {t.nav.startPractice}
          </Link>
          <div className="pt-1 flex items-center justify-between">
            <LanguageToggle />
            <AuthButton onAction={() => setOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  )
}
