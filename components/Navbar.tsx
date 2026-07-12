'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Fragment, useState } from 'react'
import { Menu, X, BookOpen } from 'lucide-react'
import AuthButton from '@/components/AuthButton'
import LanguageToggle from '@/components/LanguageToggle'
import { useT, useLocale } from '@/lib/i18n'

const navLinks: { href: string; key: 'subjects' | 'progress' | 'methodology' | 'leaderboard' | 'about' }[] = [
  { href: '/subjects', key: 'subjects' },
  { href: '/dashboard', key: 'progress' },
  { href: '/methodology', key: 'methodology' },
  { href: '/leaderboard', key: 'leaderboard' },
  { href: '/about', key: 'about' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const t = useT()
  const { locale } = useLocale()
  // 老師大數據平台 入口對所有人可見（方案 A）：老師未登入都見到、知道有呢個功能；學生／訪客
  // 見到但入唔到 —— /teacher 同 /api/teacher 已 server-side 鎖死（requireRole → 403），頁面亦會
  // 友善提示（請登入／你係學生，去練習區）。純 UI 提示，唔洩漏任何資料。
  const teacherLabel = locale === 'en' ? 'Teacher Analytics' : '老師大數據平台'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/80 bg-[#080C14]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <BookOpen size={22} className="text-amber-400" />
            <span>
              DSE <span className="text-amber-400">Level Up</span>
            </span>
          </Link>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Fragment key={l.href}>
              <Link
                href={l.href}
                className={`text-sm transition-colors ${
                  pathname === l.href
                    ? 'text-amber-400'
                    : 'text-slate-400 hover:text-slate-100'
                }`}
              >
                {t.nav[l.key]}
              </Link>
              {/* 老師大數據平台 — 插喺「科目」同「我的進度」之間；對所有人可見（方案 A）。年長老師
                  易睇：大字、高對比黃、有 📊 icon。/teacher 仍然 server-side 守衛（requireRole → 403）。 */}
              {l.href === '/subjects' && (
                <Link
                  href="/teacher"
                  className={`flex items-center gap-1.5 text-base font-bold transition-colors ${
                    pathname === '/teacher' ? 'text-[#FEE440]' : 'text-[#FEE440] hover:text-[#FEE440]/80'
                  }`}
                >
                  <span aria-hidden>📊</span>
                  <span>{teacherLabel}</span>
                </Link>
              )}
            </Fragment>
          ))}
          <Link
            href="/subjects/math"
            className="ml-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            {t.nav.startPractice}
          </Link>
          <LanguageToggle />
          <AuthButton />
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <button
            className="text-slate-400 hover:text-slate-100"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-800 bg-[#080C14] px-4 pb-4 pt-2 flex flex-col gap-3">
          {navLinks.map((l) => (
            <Fragment key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className={`py-2 text-sm ${
                  pathname === l.href ? 'text-amber-400' : 'text-slate-300'
                }`}
              >
                {t.nav[l.key]}
              </Link>
              {l.href === '/subjects' && (
                <Link
                  href="/teacher"
                  onClick={() => setOpen(false)}
                  className="py-2 text-base font-bold text-[#FEE440] flex items-center gap-1.5"
                >
                  <span aria-hidden>📊</span>
                  <span>{teacherLabel}</span>
                </Link>
              )}
            </Fragment>
          ))}
          <Link
            href="/subjects/math"
            onClick={() => setOpen(false)}
            className="bg-amber-500 text-black font-semibold text-sm text-center py-2 rounded-lg"
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
