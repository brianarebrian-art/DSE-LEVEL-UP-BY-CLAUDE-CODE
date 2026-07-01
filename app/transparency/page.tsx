'use client'

import { ShieldCheck, Database, AlertTriangle } from 'lucide-react'
import { useLocale } from '@/lib/i18n'

// Transparency page — deliberately HONEST. It does NOT claim "not AI-generated" or
// "reviewed by frontline tutors"; the content is alumni + AI co-authored and
// hand-checked, and we say exactly that. No fabricated provenance.
export default function TransparencyPage() {
  const { locale } = useLocale()
  const en = locale === 'en'

  const sections = [
    {
      icon: ShieldCheck,
      title: en ? 'How we keep the questions sound' : '我哋點樣確保題目質素',
      points: en
        ? [
            'Every question is co-authored by DSE alumni with AI, then checked by hand.',
            'All items are original rewrites that follow the style and reasoning of 2012–2025 past papers — they are NOT official HKEAA questions, and no official content is copied.',
            'Numeric / calculation questions are verified by parametric brute-force checking.',
            'Spotted a mistake? Tell us and we’ll fix it as soon as we can.',
          ]
        : [
            '每一條題目都由 DSE 舊生 + AI 協作編寫，再逐題人手核對。',
            '全部都係原創改寫，參照 2012–2025 歷屆試題嘅出題邏輯同風格 —— 並非 HKEAA 官方試題，亦無複製任何官方內容。',
            '數值／計算題以參數化方式 brute-force 驗算。',
            '發現錯誤？話我哋知，我哋會盡快修正。',
          ],
    },
    {
      icon: Database,
      title: en ? 'How we handle your data' : '我哋點樣處理你嘅數據',
      points: en
        ? [
            'Your practice records stay in your own browser (localStorage) by default — our server can’t read them.',
            'If you sign in with Google, it’s ONLY to sync progress across devices. It unlocks nothing — the platform is 100% free for everyone.',
            'We never sell user data to anyone.',
          ]
        : [
            '你嘅練習記錄預設只存喺你部裝置嘅瀏覽器（localStorage），我哋伺服器讀唔到。',
            '如果你用 Google 登入，純粹係為咗跨裝置同步進度。佢唔解鎖任何嘢 —— 平台對所有人 100% 免費。',
            '我哋永遠唔會將用戶數據賣俾任何人。',
          ],
    },
    {
      icon: AlertTriangle,
      title: en ? 'Known limits (we won’t overstate)' : '已知限制（唔會誇大）',
      points: en
        ? [
            'These are rewritten practice questions, not official papers. For real past papers, go to the HKEAA website.',
            'Grade prediction is based on your answers and is indicative only — the HKEAA result is the only one that counts.',
            'AI-assisted writing can occasionally slip; if something looks off, please report it.',
          ]
        : [
            '呢啲係改寫練習題，唔係官方試題。要官方歷屆試題，請去 HKEAA 網站。',
            '等級預測根據你嘅作答表現計算，僅供參考 —— 最終成績以 HKEAA 公布為準。',
            'AI 協作或會偶有手民之誤；見到有問題，麻煩話我哋知。',
          ],
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
        {en ? 'Transparency' : '透明度報告'}
      </h1>
      <p className="text-slate-400 mb-10 leading-relaxed">
        {en
          ? 'We’d rather be honest about how this is built than oversell it. Here’s exactly how the questions are made, how your data is handled, and where the limits are.'
          : '我哋寧願老老實實講清楚係點整出嚟，都唔想誇大。以下係題目點樣製作、你嘅數據點樣處理、同埋邊度有限制。'}
      </p>

      <div className="space-y-8">
        {sections.map((s) => {
          const Icon = s.icon
          return (
            <section
              key={s.title}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <Icon size={20} className="text-amber-400 shrink-0" />
                <h2 className="text-lg font-bold text-slate-100">{s.title}</h2>
              </div>
              <ul className="space-y-2.5">
                {s.points.map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
                    <span className="text-amber-400/70 mt-0.5 shrink-0">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
