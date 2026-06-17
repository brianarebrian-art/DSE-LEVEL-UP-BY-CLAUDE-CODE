'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, BookOpen } from 'lucide-react'
import AuthButton from '@/components/AuthButton'

const navLinks = [
  { href: '/subjects', label: '科目' },
  { href: '/dashboard', label: '我的進度' },
  { href: '/methodology', label: '方法論' },
  { href: '/leaderboard', label: '排行榜' },
  { href: '/about', label: '關於我們' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

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
              {l.label}
            </Link>
          ))}
          <Link
            href="/subjects/math"
            className="ml-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
          >
            開始練習
          </Link>
          <AuthButton />
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-slate-400 hover:text-slate-100"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
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
              {l.label}
            </Link>
          ))}
          <Link
            href="/subjects/math"
            onClick={() => setOpen(false)}
            className="bg-amber-500 text-black font-semibold text-sm text-center py-2 rounded-lg"
          >
            開始練習
          </Link>
          <div className="pt-1">
            <AuthButton onAction={() => setOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  )
}
