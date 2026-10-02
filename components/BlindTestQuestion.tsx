'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'

// 盲測黑題目 (Blind Test) — a screenshot-ready hardcore showcase for the landing
// page / IG Reels. Key numbers and keywords are blacked out so only the FIGURE,
// the four options remain. Click a black block to peek.
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
  label,
}: {
  children: React.ReactNode
  revealed: boolean
  onReveal: () => void
  /** 未揭開時畀讀屏用戶嘅說明。揭開之後唔再需要 —— 內容自己講嘢。 */
  label: string
}) {
  // ⚠️ 2026-09-12：未揭開嘅遮蓋塊係一個【真正嘅操作點】，唔淨係一個樣式。
  // 原本只有 onClick，即係淨係滑鼠做到 —— 鍵盤同讀屏用戶見到個黑格但揭唔開，
  // 而格入面係題目嘅數字（「∠APB = ⬛°」），揭唔開就讀唔到條題。WCAG 2.1.1。
  // 揭開之後就唔再係操作點，所以 role / tabIndex / onKeyDown 一律收返 ——
  // 留住嘅話，鍵盤用戶要行過一堆冇作用嘅停駐點。
  const interactive = !revealed
  return (
    <span
      onClick={interactive ? onReveal : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? label : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onReveal()
              }
            }
          : undefined
      }
      className={`inline-block rounded px-1 mx-0.5 align-middle transition-colors ${
        revealed
          ? 'bg-paper-ink/10 text-paper-warn font-semibold'
          : 'bg-paper-ink text-paper-ink cursor-pointer select-none'
              + ' focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
              + ' focus-visible:outline-paper-warn'
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
        <Black revealed={revealed} onReveal={reveal} label={tr('顯示被遮蓋嘅數值', 'Reveal the hidden value')}>50</Black>
        {tr('°，C 為優弧上一點，求 ∠ACB。', '°, with C on the major arc. Find ∠ACB.')}
      </p>

      {/* Options with the key figures redacted */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        {['65', '50', '130', '25'].map((v, i) => (
          <div key={i} className="flex items-center gap-2 border border-paper-ink/20 bg-paper-ink/5 rounded-lg px-3 py-2 text-sm">
            <span className="w-5 h-5 rounded bg-paper-ink/10 text-paper-ink text-xs font-bold flex items-center justify-center">
              {['A', 'B', 'C', 'D'][i]}
            </span>
            <Black revealed={revealed} onReveal={reveal} label={tr('顯示被遮蓋嘅數值', 'Reveal the hidden value')}>{v}</Black><span className="text-paper-muted">°</span>
          </div>
        ))}
      </div>

      <p className="text-[10px] text-paper-muted text-center mt-3">
        {tr('黑色係考評局陷阱位 — 撳一下偷睇。喺 DSE Level Up，你要睇穿，唔係背答案。',
            'The black blocks are the examiner’s traps — tap to peek. On DSE Level Up you see through them, you don’t memorise.')}
      </p>
    </div>
  )
}
