'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { getPracticeRank, RANKS, type PracticeRankState } from '@/lib/practiceRank'

// 競技場卡 —— 段位 + EXP 進度（憲章 §8.1，2026-08-22 遊戲化解禁）
//
// ══ 呢張卡刻意【唔做】嘅嘢 ══
// · 唔顯示任何排名、他人成績或在線人數 —— 平台冇 user-to-user，
//   而且憲章 §8 禁止虛構統計。一個「你贏過 73% 用戶」嘅數字係作出嚟嘅。
// · 唔顯示「距離 5** 仲差幾多」—— 等級預測屬永久否決項目。
// · 唔顯示倒扣、掉段、連續中斷 —— 見 lib/practiceRank.ts 頂部關於大愛設計嘅註釋。
//
// 金屬環（規格書 §2.3）用純 SVG + CSS `ring-rotate`；SEN 之下由 globals.css
// 直接殺掉動畫，唔使喺呢度再判斷一次。

function MetallicRing({ progress, label }: { progress: number; label: string }) {
  const R = 34
  const C = 2 * Math.PI * R
  return (
    <svg viewBox="0 0 80 80" className="w-20 h-20 shrink-0" role="img" aria-label={label}>
      <defs>
        <linearGradient id="rank-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-neon-cyan)" />
          <stop offset="100%" stopColor="var(--color-neon-purple)" />
        </linearGradient>
      </defs>
      {/* 底環 */}
      <circle cx="40" cy="40" r={R} fill="none" stroke="currentColor" strokeWidth="3" className="text-line" />
      {/* 進度環 —— 由 12 點鐘開始順時針 */}
      <circle
        cx="40" cy="40" r={R} fill="none" stroke="url(#rank-ring)" strokeWidth="3"
        strokeLinecap="round" strokeDasharray={C}
        strokeDashoffset={C * (1 - progress)}
        transform="rotate(-90 40 40)"
        style={{ transition: 'stroke-dashoffset 700ms var(--ease-spring-settle)' }}
      />
      {/* 裝飾外環（會轉，SEN／reduced-motion 之下停）*/}
      <circle
        cx="40" cy="40" r="38" fill="none" stroke="url(#rank-ring)" strokeWidth="1"
        strokeDasharray="4 10" opacity="0.5" className="ring-rotate"
      />
    </svg>
  )
}

export default function PracticeRankCard({ className = '' }: { className?: string }) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [a, setA] = useState<PracticeRankState | null>(null)

  // 導出值，唔會寫任何嘢；掛喺 mount 之後避免 SSR／水合唔一致
  useEffect(() => { setA(getPracticeRank()) }, [])
  if (!a || a.sessions === 0) return null

  const tier = RANKS.indexOf(a.rank) + 1
  const ringLabel = en
    ? `Rank ${tier} of ${RANKS.length}: ${a.rank.en}`
    : `第 ${tier} 級（共 ${RANKS.length} 級）：${a.rank.zh}`

  return (
    <div className={`relative overflow-hidden border border-line rounded-xl bg-surface-raised p-4 sm:p-5 ${className}`}>
      <div className="absolute inset-0 particle-bg opacity-30 pointer-events-none" aria-hidden />
      <div className="relative flex items-center gap-4">
        <MetallicRing progress={a.progress} label={ringLabel} />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-ink-muted mb-0.5">
            {en ? 'Practice rank' : '練習段位'}
          </p>
          <p className="text-lg font-semibold text-ink leading-tight">
            {en ? a.rank.en : a.rank.zh}
          </p>
          <p className="text-[12px] text-ink-soft mt-1.5 leading-relaxed">
            {en
              ? `${a.sessions} session${a.sessions > 1 ? 's' : ''} · ${a.activeDays} day${a.activeDays > 1 ? 's' : ''} practised`
              : `已完成 ${a.sessions} 節 · 練習過 ${a.activeDays} 日`}
          </p>
          {a.next ? (
            <>
              <div className="mt-2.5 h-1.5 rounded-full bg-surface-sunken overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${Math.round(a.progress * 100)}%`, transition: 'width 700ms var(--ease-spring-settle)' }}
                />
              </div>
              <p className="text-[11px] text-ink-muted mt-1.5" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {en
                  ? `${a.toNext} EXP to ${a.next.en}`
                  : `再 ${a.toNext} EXP 就到「${a.next.zh}」`}
              </p>
            </>
          ) : (
            <p className="text-[11px] text-ink-muted mt-2">
              {/* 到頂唔係終點 —— 唔可以令學生覺得「做完喇，唔使再練」 */}
              {en ? 'Top tier reached — keep the habit going.' : '已到最高一級 —— 保持住個習慣就得。'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
