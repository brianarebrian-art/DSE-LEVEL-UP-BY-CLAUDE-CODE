'use client'

import { HelpCircle } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { ABOUT_FAQS } from '@/lib/faq'

// FAQ 手風琴（Jack/客戶體驗）— 用原生 <details>/<summary>：零 JS 狀態、鍵盤
// 無障礙自帶。完整 20 條見 content/community/faq.md；精選 8 條在 lib/faq.ts。
// Light-first migration (2026-07-21, task #97): 白卡 + #008B84 accent，weight 400/500。

// Text lives in lib/faq.ts: /about repeats it as FAQPage structured data (reply 61a).

export default function FAQSection() {
  const { locale } = useLocale()
  const en = locale === 'en'
  return (
    <div className="bg-surface-raised border border-line rounded-2xl p-6 mt-5">
      <div className="flex items-center gap-2 mb-3">
        <HelpCircle size={20} className="text-accent" />
        <h2 className="font-medium text-lg text-ink">{en ? 'FAQ' : '常見問題'}</h2>
      </div>
      <div className="divide-y divide-line">
        {ABOUT_FAQS.map((f, i) => (
          <details key={i} className="group py-2.5">
            <summary className="cursor-pointer list-none flex items-start justify-between gap-3 text-sm font-medium text-ink-soft hover:text-ink transition-colors">
              <span>{en ? f.qEn : f.qZh}</span>
              <span className="text-ink-muted group-open:rotate-45 transition-transform shrink-0 mt-0.5">＋</span>
            </summary>
            <p className="text-sm text-ink-muted leading-relaxed mt-2 pr-6">{en ? f.aEn : f.aZh}</p>
          </details>
        ))}
      </div>
    </div>
  )
}
