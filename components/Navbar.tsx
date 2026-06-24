'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, BookOpen } from 'lucide-react'
import AuthButton from '@/components/AuthButton'
import LanguageToggle from '@/components/LanguageToggle'
import StreakFlame from '@/components/StreakFlame'
import { useT } from '@/lib/i18n'
import { usePlan } from '@/lib/usePlan'

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
  const { isPremium, authEnabled } = usePlan()
  const showUpgrade = authEnabled && !isPremium

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/80 bg-[#080C14]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <BookOpen size={22} className="text-amber-400" />
          <span>
            DSE <span className="text-amber-400">Level Up</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm transition-colors ${
                pathname === l.href
                  ? 'text-amber-400'
                  : 'text-slate-400 hover:text-slate-100'
              }`}
            >
              {t.nav[l.key]}
            </Link>
          ))}
          <Link
            href="/subjects/math"
            className="ml-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            {t.nav.startPractice}
          </Link>
          {showUpgrade && (
            <Link
              href="/upgrade"
              className="text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              {t.premium.navUpgrade}
            </Link>
          )}
          <StreakFlame />
          <LanguageToggle />
          <AuthButton />
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-3">
          <StreakFlame />
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
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`py-2 text-sm ${
                pathname === l.href ? 'text-amber-400' : 'text-slate-300'
              }`}
            >
              {t.nav[l.key]}
            </Link>
          ))}
          <Link
            href="/subjects/math"
            onClick={() => setOpen(false)}
            className="bg-amber-500 text-black font-semibold text-sm text-center py-2 rounded-lg"
          >
            {t.nav.startPractice}
          </Link>
          {showUpgrade && (
            <Link
              href="/upgrade"
              onClick={() => setOpen(false)}
              className="py-2 text-sm font-medium text-amber-400"
            >
              {t.premium.navUpgrade}
            </Link>
          )}
          <div className="pt-1 flex items-center justify-between">
            <LanguageToggle />
            <AuthButton onAction={() => setOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  )
}
