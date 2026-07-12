'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'

// 盲測黑題目 (Blind Test) — a screenshot-ready hardcore showcase for the landing
// page / IG Reels. Key numbers and keywords are blacked out so only the FIGURE,
// the four options and the 三大逆向錯因診斷欄 remain. Click a black block to peek.
export default function BlindTestQuestion() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const tr = (zh: string, eng: string) => (en ? eng : zh)
  const [revealed, setRevealed] = useState(false)

  const Black = ({ children }: { children: React.ReactNode }) => (
    <span
      onClick={() => setRevealed(true)}
      className={`inline-block rounded px-1 mx-0.5 align-middle transition-colors ${
        revealed ? 'bg-amber-500/15 text-amber-300' : 'bg-black text-black cursor-pointer select-none'
      }`}
    >
      {children}
    </span>
  )

  const causes = [
    { emoji: '🧠', zh: '概念盲區', en: 'Conceptual Blindspot', dZh: '忽略定理前提', dEn: 'Missed a premise' },
    { emoji: '🎯', zh: '審題陷阱', en: 'HKEAA Reading Trap', dZh: '看漏關鍵字眼', dEn: 'Missed a keyword' },
    { emoji: '🧮', zh: '運算粗心', en: 'Calculator Slip', dZh: '按錯計算機', dEn: 'Mis-keyed the calc' },
  ]

  return (
    <div className="bg-black border-2 border-red-700/70 rounded-2xl p-5 sm:p-6 shadow-[0_0_25px_rgba(220,38,38,0.25)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-red-400 font-extrabold tracking-wide text-sm uppercase">🩻 {tr('盲測黑題', 'Blind Test')}</span>
      </div>

      {/* Figure — two tangents from an external point P to a circle */}
      <svg viewBox="0 0 280 160" className="w-full h-36 mb-4" role="img" aria-label="circle with two tangents">
        <circle cx="178" cy="82" r="44" fill="none" stroke="#64748b" strokeWidth="2" />
        <circle cx="178" cy="82" r="2.5" fill="#94a3b8" />
        <text x="186" y="80" fill="#94a3b8" fontSize="11">O</text>
        {/* external point P and the two tangents */}
        <line x1="58" y1="82" x2="160" y2="46" stroke="#ef4444" strokeWidth="2" />
        <line x1="58" y1="82" x2="160" y2="118" stroke="#ef4444" strokeWidth="2" />
        <circle cx="58" cy="82" r="2.5" fill="#f5d061" />
        <text x="40" y="86" fill="#f5d061" fontSize="11">P</text>
        <circle cx="160" cy="46" r="2.5" fill="#f5d061" />
        <text x="150" y="40" fill="#f5d061" fontSize="11">A</text>
        <circle cx="160" cy="118" r="2.5" fill="#f5d061" />
        <text x="150" y="132" fill="#f5d061" fontSize="11">B</text>
        {/* point C on the major arc */}
        <circle cx="214" cy="58" r="2.5" fill="#94a3b8" />
        <text x="220" y="56" fill="#94a3b8" fontSize="11">C</text>
        <line x1="214" y1="58" x2="160" y2="46" stroke="#475569" strokeWidth="1.3" />
        <line x1="214" y1="58" x2="160" y2="118" stroke="#475569" strokeWidth="1.3" />
        <path d="M 78 74 A 22 22 0 0 1 78 90" fill="none" stroke="#ef4444" strokeWidth="1.3" />
      </svg>

      {/* Redacted question */}
      <p className="text-sm leading-relaxed text-slate-200 mb-4">
        {tr('由圓外一點 P 引兩條切線，', 'From external point P two tangents are drawn; ')}
        {tr('已知 ∠APB = ', '∠APB = ')}
        <Black>{tr('五十', 'fifty')}</Black>
        {tr('°，C 為優弧上一點，求 ∠ACB。', '°, with C on the major arc. Find ∠ACB.')}
      </p>

      {/* Options with the key figures redacted */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        {[tr('六十五', '65'), tr('五十', '50'), tr('一三〇', '130'), tr('二十五', '25')].map((v, i) => (
          <div key={i} className="flex items-center gap-2 border border-slate-800 bg-slate-900/60 rounded-lg px-3 py-2 text-sm">
            <span className="w-5 h-5 rounded bg-slate-800 text-slate-500 text-xs font-bold flex items-center justify-center">
              {['A', 'B', 'C', 'D'][i]}
            </span>
            <Black>{v}</Black><span className="text-slate-500">°</span>
          </div>
        ))}
      </div>

      {/* 三大逆向錯因診斷欄 */}
      <div className="border-t border-red-900/40 pt-4">
        <p className="text-[11px] font-bold text-red-300/80 mb-2 uppercase tracking-wide">
          {tr('答錯？先診斷你嘅錯因 · Reverse Error Diagnosis', 'Wrong? Diagnose your cause first')}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {causes.map((c) => (
            <div key={c.zh} className="border border-red-900/50 bg-red-950/30 rounded-lg px-2 py-2 text-center">
              <div className="text-base leading-none mb-1">{c.emoji}</div>
              <div className="text-[11px] font-bold text-slate-200 leading-tight">{tr(c.zh, c.en)}</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{tr(c.dZh, c.dEn)}</div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-slate-600 text-center mt-3">
        {tr('黑色係考評局陷阱位 — 撳一下偷睇。喺 DSE Level Up，你要睇穿，唔係背答案。',
            'The black blocks are the examiner’s traps — tap to peek. On DSE Level Up you see through them, you don’t memorise.')}
      </p>
    </div>
  )
}
