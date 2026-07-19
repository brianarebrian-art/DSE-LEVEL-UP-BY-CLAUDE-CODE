'use client'

import { useEffect, useState } from 'react'
import { getTodaySpectrum, type DaySpectrum } from '@/lib/dailySpectrum'
import { useLocale } from '@/lib/i18n'

// F-PRG: 今日學習光譜 (Kate/視覺 + Leo/前端) — light-first 版（憲章 §3）
// 10 段水平光譜，對應每日 3:5:2 建議節奏（3 基礎 · 5 核心 · 2 進階）。
// 數據 100% 來自今日真實作答（lib/dailySpectrum，本地按日重置）——唔靠估算。
// 大愛紅線：無 XP／升級／通關／血量字眼；未完成唔會顯示任何「落後」暗示。
// 色彩：白底神經色（#00F5D4）刺眼且對比不足，三段改用憲章三強調（青／金／玫），on white 讀得清。
const TIERS = [
  { key: 'easy' as const, target: 3, color: '#008B84', zh: '基礎', en: 'Foundation' },
  { key: 'medium' as const, target: 5, color: '#B8860B', zh: '核心', en: 'Core' },
  { key: 'hard' as const, target: 2, color: '#C2185B', zh: '進階', en: 'Advanced' },
]

export default function DailySpectrum() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [s, setS] = useState<DaySpectrum | null>(null)

  useEffect(() => {
    setS(getTodaySpectrum()) // client-only（localStorage）
  }, [])

  if (!s) return null
  const done = TIERS.reduce((a, t) => a + Math.min(s[t.key], t.target), 0)
  const complete = done >= 10

  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl p-6 mb-10">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
        <h2 className="font-medium text-[#1A1A1A]">🌈 {en ? "Today's study spectrum" : '今日學習光譜'}</h2>
        {complete && (
          <span className="text-sm font-medium text-[#008B84]">
            ✨ {en ? 'Spectrum complete — mastery +1' : '今日光譜完成，掌握度 +1'}
          </span>
        )}
      </div>
      <p className="text-xs text-[#6B6B6B] mb-4">
        {en ? '3 foundation · 5 core · 2 advanced' : '3 題基礎 · 5 題核心 · 2 題進階'}
      </p>

      {/* 10 段光譜條：逐段按今日真實完成數填色 */}
      <div className="flex gap-1.5" role="img" aria-label={en ? `Today: ${done} of 10 suggested questions done` : `今日已完成建議節奏 ${done}/10 題`}>
        {TIERS.flatMap((t) =>
          Array.from({ length: t.target }).map((_, i) => {
            const filled = s[t.key] > i
            // 最新填滿嗰格閃一下微光（respect prefers-reduced-motion）
            const isNewest = filled && s[t.key] === i + 1
            return (
              <span
                key={`${t.key}-${i}`}
                className={`h-3 flex-1 rounded-full transition-colors ${isNewest ? 'animate-pulse motion-reduce:animate-none' : ''}`}
                style={{ background: filled ? t.color : '#EAEAE4', animationDuration: '300ms', animationIterationCount: filled ? 2 : undefined }}
              />
            )
          }),
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-[#6B6B6B]">
        {TIERS.map((t) => (
          <span key={t.key} className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: t.color }} aria-hidden />
            {en ? t.en : t.zh} {Math.min(s[t.key], t.target)}/{t.target}
            {s[t.key] > t.target && <span className="text-[#9CA3AF]">(+{s[t.key] - t.target})</span>}
          </span>
        ))}
      </div>
    </div>
  )
}
