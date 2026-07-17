'use client'

import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { useT } from '@/lib/i18n'

export default function Footer() {
  const t = useT()
  return (
    <footer className="border-t border-slate-800 bg-bg-dark mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-3">
              <BookOpen size={20} className="text-amber-400" />
              <span>
                DSE <span className="text-amber-400">Level Up</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              {t.footer.tagline1}
              <br />{t.footer.tagline2}
            </p>
          </div>

          {/* Links */}
          <div>
            <div className="text-slate-300 font-medium mb-3">{t.footer.practiceHeading}</div>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/subjects/math" className="hover:text-slate-300 transition-colors">
                  {t.footer.linkMath}
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-slate-300 transition-colors">
                  {t.footer.linkMethodology}
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-slate-300 transition-colors">
                  {t.footer.linkLeaderboard}
                </Link>
              </li>
              <li>
                <Link href="/relax" className="hover:text-slate-300 transition-colors">
                  {t.footer.linkRelax}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-slate-300 font-medium mb-3">{t.footer.aboutHeading}</div>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/about" className="hover:text-slate-300 transition-colors">
                  {t.footer.aboutUs}
                </Link>
              </li>
              <li>
                <Link href="/transparency" className="hover:text-slate-300 transition-colors">
                  {t.footer.transparency}
                </Link>
              </li>
              <li>
                <a href="mailto:dselevelup@gmail.com" className="hover:text-slate-300 transition-colors">
                  {t.footer.contact}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal disclaimer */}
        <div className="border-t border-slate-800 pt-6 text-xs text-slate-600 leading-relaxed">
          <p className="mb-2">
            <span className="text-slate-500 font-medium">{t.footer.disclaimerLabel}</span>
            {t.footer.disclaimerBody}
          </p>
          <p className="text-slate-700">
            {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  )
}
