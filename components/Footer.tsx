import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#080C14] mt-20">
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
              改寫版歷屆試題，掌握核心邏輯。
              <br />由 2026 DSE 考生製作。
            </p>
          </div>

          {/* Links */}
          <div>
            <div className="text-slate-300 font-medium mb-3">練習</div>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/subjects/math" className="hover:text-slate-300 transition-colors">
                  數學
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-slate-300 transition-colors">
                  方法論
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-slate-300 transition-colors">
                  排行榜
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-slate-300 font-medium mb-3">關於</div>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <Link href="/about" className="hover:text-slate-300 transition-colors">
                  關於我們
                </Link>
              </li>
              <li>
                <a href="mailto:contact@dselevelup.hk" className="hover:text-slate-300 transition-colors">
                  聯絡我們
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal disclaimer */}
        <div className="border-t border-slate-800 pt-6 text-xs text-slate-600 leading-relaxed">
          <p className="mb-2">
            <span className="text-slate-500 font-medium">免責聲明：</span>
            本平台提供之試題均為獨立改寫版本，旨在協助考生練習應試技巧，並非香港考試及評核局（HKEAA）官方試題。官方歷屆試題請前往 HKEAA 網站下載。等級預測僅供參考，最終成績以 HKEAA 公布為準。
          </p>
          <p className="text-slate-700">
            © 2026 DSE Level Up · 非商業用途 · 保留所有權利
          </p>
        </div>
      </div>
    </footer>
  )
}
