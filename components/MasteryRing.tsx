'use client'

// 課題掌握度圓環（第 1 週 · 引擎二「個人微進度」）
//
// 純 SVG，零圖表庫（憲章第 3 條：禁 Chart.js / D3 / Recharts）。
//
// 憲章與規格書的三條硬性約束，全部在此組件內執行：
//   1. 【無等級】—— 只顯示百分比，不出現任何等級稱號、段位、星級或 EXP 數字。
//   2. 【無他人比較】—— 資料源只有本機 localStorage 的個人答題紀錄，
//      組件本身沒有任何接收他人數據的介面。
//   3. 【無「未完成」標記】—— 尚未達 100% 的課題顯示為「持續進步中」，
//      不出現「未完成」「差 X%」等帶欠缺意味的字眼。
//
// 顏色刻意全部使用 accent（青），不按高低變色：
// 用紅／橙標示低掌握度等於把弱項渲染成失敗，違反憲章第 7 條。
//
// 樣本量誠實原則：少於 MIN_CONFIDENT_SAMPLE 題時仍然顯示圓環（學生看得到自己有進度），
// 但同時標明樣本仍少，避免 1 題答對就顯示「100% 掌握」這種誤導。

import { useLocale } from '@/lib/i18n'

/** 低於此題數，百分比只作參考，需標明樣本仍少。 */
export const MIN_CONFIDENT_SAMPLE = 4

export default function MasteryRing({
  label,
  correct,
  total,
  size = 96,
}: {
  label: string
  correct: number
  total: number
  size?: number
}) {
  const { locale } = useLocale()
  const en = locale === 'en'

  const safeTotal = Math.max(0, Math.trunc(total))
  const safeCorrect = Math.min(Math.max(0, Math.trunc(correct)), safeTotal)
  const ratio = safeTotal > 0 ? safeCorrect / safeTotal : 0
  const pct = Math.round(ratio * 100)
  const thin = safeTotal < MIN_CONFIDENT_SAMPLE

  const stroke = 8
  const r = (size - stroke) / 2
  const cx = size / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - ratio)

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          role="img"
          aria-label={
            en
              ? `${label}: ${safeCorrect} correct out of ${safeTotal} attempted, ${pct}%`
              : `${label}：已答 ${safeTotal} 題，答對 ${safeCorrect} 題，${pct}%`
          }
        >
          {/* 底環 */}
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            className="stroke-line"
            strokeWidth={stroke}
          />
          {/* 進度環：-90deg 起點令進度由 12 點鐘方向順時針走 */}
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            className="stroke-accent ring-draw"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${cx} ${cx})`}
            style={{ ['--ring-circumference' as string]: `${circumference}` }}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-lg font-medium text-ink"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {pct}%
        </span>
      </div>

      <span className="mt-2 text-xs text-ink-soft leading-snug line-clamp-2">{label}</span>
      <span className="text-[10px] text-ink-muted mt-0.5" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {safeCorrect}/{safeTotal}
        {thin ? (en ? ' · small sample' : ' · 樣本仲少') : ''}
      </span>
    </div>
  )
}
