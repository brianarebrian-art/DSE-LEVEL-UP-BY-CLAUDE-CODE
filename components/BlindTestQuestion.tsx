'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'

// 盲測黑題目 (Blind Test) — a screenshot-ready hardcore showcase for the landing
// page / IG Reels. Key numbers and keywords are blacked out so only the FIGURE,
// the four options and the 三大逆向錯因診斷欄 remain. Click a black block to peek.
//
// 2026-09-03 莫蘭迪化：由「純黑卡 + 霓虹紅光」改為【一張試卷】。
//
// ══ 點解要換成紙，唔係淨係換色 ══
// 舊版係黑卡 + 黑色遮蓋條 —— 即係「塗黑」本身睇唔到（黑疊黑）。
// 而且暗色模式下【物理上做唔到】一條比卡更深嘅條：卡係 #2C2A29，
// 已經接近黑，再深都只得 1.34:1。
// 一張紙先至有得塗黑，所以兩個主題都係紙：淺色用試卷米白（PC-009），
// 暗色用舊紙色（PC-027，唔會喺深夜灼眼）。墨兩邊共用。
//
// ══ 唔用螢光紅 ══
// 陷阱標示改用色卡最深嗰隻磚紅（PC-004）。憲章 §7 禁大紅／打擊自信元素；
// 「呢度有陷阱」係一個提示，唔係一個責備。
// 遮蓋塊。必須留喺 module scope —— 定義喺 render function 入面嘅話，每次
// `revealed` 一變，React 就會當佢係一個【全新嘅組件類型】，將所有遮蓋塊 unmount
// 再 remount（同時觸發 react-hooks 嘅 "Cannot create components during render"）。
// SVG 用嘅 token（presentation attribute 唔食 var()，見下面註釋）
const INK = { stroke: 'var(--color-paper-muted)' } as const
const INK_FILL = { fill: 'var(--color-paper-muted)' } as const
const MUTED = { stroke: 'var(--color-paper-ink)', opacity: 0.35 } as const
const TRAP = { stroke: 'var(--color-paper-warn)' } as const
const TRAP_FILL = { fill: 'var(--color-paper-warn)' } as const

function Black({
  children,
  revealed,
  onReveal,
}: {
  children: React.ReactNode
  revealed: boolean
  onReveal: () => void
}) {
  return (
    <span
      onClick={onReveal}
      className={`inline-block rounded px-1 mx-0.5 align-middle transition-colors ${
        revealed
          ? 'bg-paper-ink/10 text-paper-warn font-semibold'
          : 'bg-paper-ink text-paper-ink cursor-pointer select-none'
      }`}
    >
      {children}
    </span>
  )
}

export default function BlindTestQuestion() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const tr = (zh: string, eng: string) => (en ? eng : zh)
  const [revealed, setRevealed] = useState(false)
  const reveal = () => setRevealed(true)

  const causes = [
    { emoji: '🧠', zh: '概念盲區', en: 'Conceptual Blindspot', dZh: '忽略定理前提', dEn: 'Missed a premise' },
    { emoji: '🎯', zh: '審題陷阱', en: 'HKEAA Reading Trap', dZh: '看漏關鍵字眼', dEn: 'Missed a keyword' },
    { emoji: '🧮', zh: '運算粗心', en: 'Calculator Slip', dZh: '按錯計算機', dEn: 'Mis-keyed the calc' },
  ]

  return (
    <div className="bg-paper border border-paper-warn/40 rounded-2xl p-5 sm:p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-paper-warn font-extrabold tracking-wide text-sm uppercase">🩻 {tr('盲測黑題', 'Blind Test')}</span>
      </div>

      {/* Figure — two tangents from an external point P to a circle */}
      <svg viewBox="0 0 280 160" className="w-full h-36 mb-4" role="img" aria-label="circle with two tangents">
        {/* ⚠️ SVG presentation attribute（fill="…" / stroke="…"）唔會解析 var() ——
            佢哋唔係當 CSS 值咁 parse。要食 token 就一定要行 inline style。 */}
        <circle cx="178" cy="82" r="44" fill="none" style={INK} strokeWidth="2" />
        <circle cx="178" cy="82" r="2.5" style={INK_FILL} />
        <text x="186" y="80" style={INK_FILL} fontSize="11">O</text>
        {/* external point P and the two tangents */}
        <line x1="58" y1="82" x2="160" y2="46" style={TRAP} strokeWidth="2" />
        <line x1="58" y1="82" x2="160" y2="118" style={TRAP} strokeWidth="2" />
        <circle cx="58" cy="82" r="2.5" style={TRAP_FILL} />
        <text x="40" y="86" style={TRAP_FILL} fontSize="11">P</text>
        <circle cx="160" cy="46" r="2.5" style={TRAP_FILL} />
        <text x="150" y="40" style={TRAP_FILL} fontSize="11">A</text>
        <circle cx="160" cy="118" r="2.5" style={TRAP_FILL} />
        <text x="150" y="132" style={TRAP_FILL} fontSize="11">B</text>
        {/* point C on the major arc */}
        <circle cx="214" cy="58" r="2.5" style={INK_FILL} />
        <text x="220" y="56" style={INK_FILL} fontSize="11">C</text>
        <line x1="214" y1="58" x2="160" y2="46" style={MUTED} strokeWidth="1.3" />
        <line x1="214" y1="58" x2="160" y2="118" style={MUTED} strokeWidth="1.3" />
        <path d="M 78 74 A 22 22 0 0 1 78 90" fill="none" style={TRAP} strokeWidth="1.3" />
      </svg>

      {/* Redacted question */}
      <p className="text-sm leading-relaxed text-paper-ink mb-4">
        {tr('由圓外一點 P 引兩條切線，', 'From external point P two tangents are drawn; ')}
        {tr('已知 ∠APB = ', '∠APB = ')}
        <Black revealed={revealed} onReveal={reveal}>{tr('五十', 'fifty')}</Black>
        {tr('°，C 為優弧上一點，求 ∠ACB。', '°, with C on the major arc. Find ∠ACB.')}
      </p>

      {/* Options with the key figures redacted */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        {[tr('六十五', '65'), tr('五十', '50'), tr('一三〇', '130'), tr('二十五', '25')].map((v, i) => (
          <div key={i} className="flex items-center gap-2 border border-paper-ink/20 bg-paper-ink/5 rounded-lg px-3 py-2 text-sm">
            <span className="w-5 h-5 rounded bg-paper-ink/10 text-paper-ink text-xs font-bold flex items-center justify-center">
              {['A', 'B', 'C', 'D'][i]}
            </span>
            <Black revealed={revealed} onReveal={reveal}>{v}</Black><span className="text-paper-muted">°</span>
          </div>
        ))}
      </div>

      {/* 三大逆向錯因診斷欄 */}
      <div className="border-t border-paper-ink/15 pt-4">
        <p className="text-[11px] font-bold text-paper-warn mb-2 uppercase tracking-wide">
          {tr('答錯？先診斷你嘅錯因 · Reverse Error Diagnosis', 'Wrong? Diagnose your cause first')}
        </p>
        <div className="grid grid-cols-3 gap-2">
          {causes.map((c) => (
            <div key={c.zh} className="border border-paper-warn/30 bg-paper-warn/5 rounded-lg px-2 py-2 text-center">
              <div className="text-base leading-none mb-1">{c.emoji}</div>
              <div className="text-[11px] font-bold text-paper-ink leading-tight">{tr(c.zh, c.en)}</div>
              <div className="text-[10px] text-paper-muted mt-0.5 leading-tight">{tr(c.dZh, c.dEn)}</div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-paper-muted text-center mt-3">
        {tr('黑色係考評局陷阱位 — 撳一下偷睇。喺 DSE Level Up，你要睇穿，唔係背答案。',
            'The black blocks are the examiner’s traps — tap to peek. On DSE Level Up you see through them, you don’t memorise.')}
      </p>
    </div>
  )
}
