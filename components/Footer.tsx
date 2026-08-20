'use client'

import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { useT } from '@/lib/i18n'
import GuardianCredits from '@/components/GuardianCredits'

// Phase 2 Task 2（Kate/Leo 2026-07-18）：light-first 三層頁尾安全網（憲章 §10）。
// 三層 = ① Doormat 二級導航 ② Trust 信任標誌（版權＋HKEAA 免責）③ Compliance 合規入口。
// 誠實紅線（憲章 §10 明文）：只連真實路由（唔整 404）、無真熱線就唔放假號、
// 虛擬 persona（Carson/Amity…）絕對唔列為真人導師。全部 t.footer.* i18n 沿用。

export default function Footer() {
  const t = useT()
  return (
    <footer className="border-t border-line bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
        {/* Layer 1：Doormat 二級導航 */}
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-medium text-lg mb-3 text-ink">
              <BookOpen size={20} className="text-accent" />
              <span>
                DSE <span className="text-accent">Level Up</span>
              </span>
            </div>
            <p className="text-ink-muted text-sm leading-relaxed">
              {t.footer.tagline1}
              <br />{t.footer.tagline2}
            </p>
          </div>

          {/* 練習 */}
          <div>
            <div className="text-ink font-medium mb-3">{t.footer.practiceHeading}</div>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li>
                <Link href="/subjects/math" className="hover:text-accent transition-colors">
                  {t.footer.linkMath}
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-accent transition-colors">
                  {t.footer.linkMethodology}
                </Link>
              </li>
              <li>
                <Link href="/relax" className="hover:text-accent transition-colors">
                  {t.footer.linkRelax}
                </Link>
              </li>
            </ul>
          </div>

          {/* 關於 / 支援 */}
          <div>
            <div className="text-ink font-medium mb-3">{t.footer.aboutHeading}</div>
            <ul className="space-y-2 text-sm text-ink-muted">
              <li>
                <Link href="/about" className="hover:text-accent transition-colors">
                  {t.footer.aboutUs}
                </Link>
              </li>
              <li>
                <Link href="/transparency" className="hover:text-accent transition-colors">
                  {t.footer.transparency}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-accent transition-colors">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href="/community-safety" className="hover:text-accent transition-colors">
                  {t.footer.communitySafety}
                </Link>
              </li>
              <li>
                <a href="mailto:dselevelup@gmail.com" className="hover:text-accent transition-colors">
                  {t.footer.contact}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 守護者致謝名單 —— 錨點係 Brand 欄嘅 tagline2「由 2026 DSE 考生製作。」。
            規格原文寫「插入喺 tagline 下面、練習連結上面」，但真實 Footer 係三欄
            grid（Brand｜練習｜關於），啲連結係喺 tagline【隔籬】而唔係下面，
            而規格禁令 #6 亦明文唔准移動現有連結。故放喺整個 doormat grid 之後、
            Trust 層之前 —— 即真實版面上最接近「tagline 下面」嘅位置，且零改動現有連結。 */}
        <GuardianCredits />

        {/* Layer 2：Trust 信任標誌 + HKEAA 免責（Luna §17 必須顯示） */}
        <div className="border-t border-line pt-6 text-xs text-ink-muted leading-relaxed">
          <p className="mb-2">
            <span className="text-ink-muted font-medium">{t.footer.disclaimerLabel}</span>
            {t.footer.disclaimerBody}
          </p>
          {/* Layer 3：Compliance —— 只連真實存在路由（/transparency），唔整 404 */}
          <p className="text-ink-muted">
            {t.footer.copyright}
            <span className="mx-2">·</span>
            <Link href="/transparency" className="underline hover:text-accent transition-colors">
              {t.footer.transparency}
            </Link>
            <span className="mx-2">·</span>
            <Link href="/privacy" className="underline hover:text-accent transition-colors">
              {t.footer.privacy}
            </Link>
            <span className="mx-2">·</span>
            <Link href="/community-safety" className="underline hover:text-accent transition-colors">
              {t.footer.communitySafety}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
