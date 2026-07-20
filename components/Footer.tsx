'use client'

import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { useT } from '@/lib/i18n'

// Phase 2 Task 2（Kate/Leo 2026-07-18）：light-first 三層頁尾安全網（憲章 §10）。
// 三層 = ① Doormat 二級導航 ② Trust 信任標誌（版權＋HKEAA 免責）③ Compliance 合規入口。
// 誠實紅線（憲章 §10 明文）：只連真實路由（唔整 404）、無真熱線就唔放假號、
// 虛擬 persona（Carson/Amity…）絕對唔列為真人導師。全部 t.footer.* i18n 沿用。

export default function Footer() {
  const t = useT()
  return (
    <footer className="border-t border-black/[0.06] bg-[#FAFAF8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
        {/* Layer 1：Doormat 二級導航 */}
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-medium text-lg mb-3 text-[#1A1A1A]">
              <BookOpen size={20} className="text-[#008B84]" />
              <span>
                DSE <span className="text-[#008B84]">Level Up</span>
              </span>
            </div>
            <p className="text-[#6B6B6B] text-sm leading-relaxed">
              {t.footer.tagline1}
              <br />{t.footer.tagline2}
            </p>
          </div>

          {/* 練習 */}
          <div>
            <div className="text-[#1A1A1A] font-medium mb-3">{t.footer.practiceHeading}</div>
            <ul className="space-y-2 text-sm text-[#6B6B6B]">
              <li>
                <Link href="/subjects/math" className="hover:text-[#008B84] transition-colors">
                  {t.footer.linkMath}
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-[#008B84] transition-colors">
                  {t.footer.linkMethodology}
                </Link>
              </li>
              <li>
                <Link href="/relax" className="hover:text-[#008B84] transition-colors">
                  {t.footer.linkRelax}
                </Link>
              </li>
            </ul>
          </div>

          {/* 關於 / 支援 */}
          <div>
            <div className="text-[#1A1A1A] font-medium mb-3">{t.footer.aboutHeading}</div>
            <ul className="space-y-2 text-sm text-[#6B6B6B]">
              <li>
                <Link href="/about" className="hover:text-[#008B84] transition-colors">
                  {t.footer.aboutUs}
                </Link>
              </li>
              <li>
                <Link href="/transparency" className="hover:text-[#008B84] transition-colors">
                  {t.footer.transparency}
                </Link>
              </li>
              <li>
                <a href="mailto:dselevelup@gmail.com" className="hover:text-[#008B84] transition-colors">
                  {t.footer.contact}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Layer 2：Trust 信任標誌 + HKEAA 免責（Luna §17 必須顯示） */}
        <div className="border-t border-black/[0.06] pt-6 text-xs text-[#9CA3AF] leading-relaxed">
          <p className="mb-2">
            <span className="text-[#6B6B6B] font-medium">{t.footer.disclaimerLabel}</span>
            {t.footer.disclaimerBody}
          </p>
          {/* Layer 3：Compliance —— 只連真實存在路由（/transparency），唔整 404 */}
          <p className="text-[#9CA3AF]">
            {t.footer.copyright}
            <span className="mx-2">·</span>
            <Link href="/transparency" className="underline hover:text-[#008B84] transition-colors">
              {t.footer.transparency}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
