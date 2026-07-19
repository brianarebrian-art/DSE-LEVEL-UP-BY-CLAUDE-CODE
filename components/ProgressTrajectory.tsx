'use client'

import { useEffect, useState } from 'react'
import { loadAttempts } from '@/lib/progress'
import { useLocale } from '@/lib/i18n'

// 計劃A §5.6「精進軌跡」— light-first 版。純 SVG，零圖表庫（憲章 §1）。
// 數據 100% 由 localStorage 真實作答（loadAttempts）逐日聚合，絕不虛構曲線。
// 每個活躍日一點，取最近 14 日；y = 當日正確率。少於 2 個活躍日顯示溫和佔位。

interface DayPoint {
  label: string
  accuracy: number // 0–1
}

function dayKey(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function shortDate(ts: number): string {
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

function buildSeries(): DayPoint[] {
  const attempts = loadAttempts()
  const byDay = new Map<string, { score: number; total: number; ts: number }>()
  for (const a of attempts) {
    const k = dayKey(a.timestamp)
    const cur = byDay.get(k) ?? { score: 0, total: 0, ts: a.timestamp }
    cur.score += a.score
    cur.total += a.total
    cur.ts = Math.max(cur.ts, a.timestamp)
    byDay.set(k, cur)
  }
  return [...byDay.values()]
    .sort((a, b) => a.ts - b.ts)
    .slice(-14)
    .map((v) => ({ label: shortDate(v.ts), accuracy: v.total > 0 ? v.score / v.total : 0 }))
}

export default function ProgressTrajectory() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [pts, setPts] = useState<DayPoint[] | null>(null)

  // Read client-only data after mount (avoids SSR hydration mismatch).
  useEffect(() => {
    setPts(buildSeries())
  }, [])

  const title = en ? 'Improvement trajectory' : '精進軌跡'
  const subtitle = en
    ? "Not a comparison with others — your own progress curve."
    : '唔係分數比較，係你自己嘅進步曲線'

  return (
    <section className="rounded-2xl border border-black/[0.06] bg-white p-6 mb-10">
      <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
        <div>
          <div className="text-xs text-[#6B6B6B] mb-1">{title}</div>
          <div className="text-lg font-medium text-[#1A1A1A]">{subtitle}</div>
        </div>
        {pts && pts.length >= 2 && (
          <span className="inline-flex items-center rounded-full border border-[#008B84]/25 bg-[#008B84]/[0.07] px-3 py-1.5 text-xs font-medium text-[#00877F]">
            {en ? `Last ${pts.length} active days` : `過去 ${pts.length} 個活躍日`}
          </span>
        )}
      </div>

      {!pts || pts.length < 2 ? (
        <div className="py-12 text-center text-sm text-[#6B6B6B]">
          {en
            ? 'Practise on two or more days to see your trajectory take shape.'
            : '再多操幾日，你嘅進步曲線就會浮現出嚟。'}
        </div>
      ) : (
        <Chart pts={pts} en={en} />
      )}
    </section>
  )
}

function Chart({ pts, en }: { pts: DayPoint[]; en: boolean }) {
  const W = 720
  const H = 240
  const padL = 10
  const padR = 14
  const padT = 22
  const padB = 30
  const innerW = W - padL - padR
  const innerH = H - padT - padB
  const n = pts.length

  const x = (i: number) => padL + (n === 1 ? innerW / 2 : (innerW * i) / (n - 1))
  const y = (acc: number) => padT + innerH * (1 - acc)
  const baseline = padT + innerH

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.accuracy).toFixed(1)}`).join(' ')
  const areaPath =
    `M ${x(0).toFixed(1)} ${baseline.toFixed(1)} ` +
    pts.map((p, i) => `L ${x(i).toFixed(1)} ${y(p.accuracy).toFixed(1)}`).join(' ') +
    ` L ${x(n - 1).toFixed(1)} ${baseline.toFixed(1)} Z`

  const gridPcts = [0, 0.25, 0.5, 0.75, 1]

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full"
        style={{ minWidth: 320 }}
        role="img"
        aria-label={en ? 'Daily accuracy trajectory' : '每日正確率精進軌跡'}
      >
        <defs>
          <linearGradient id="trajArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#008B84" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#008B84" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y grid + % labels */}
        {gridPcts.map((g) => {
          const gy = y(g)
          return (
            <g key={g}>
              <line
                x1={padL}
                y1={gy}
                x2={W - padR}
                y2={gy}
                stroke="rgba(0,0,0,0.07)"
                strokeDasharray="4 4"
              />
              <text x={W - padR} y={gy - 3} textAnchor="end" fontSize="10" fill="#9CA3AF">
                {Math.round(g * 100)}%
              </text>
            </g>
          )
        })}

        {/* Area + line */}
        <path d={areaPath} fill="url(#trajArea)" />
        <path d={linePath} fill="none" stroke="#008B84" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* Points */}
        {pts.map((p, i) => {
          const isLast = i === n - 1
          return (
            <g key={i}>
              {isLast && <circle cx={x(i)} cy={y(p.accuracy)} r={7} fill="#B8860B" fillOpacity="0.15" />}
              <circle
                cx={x(i)}
                cy={y(p.accuracy)}
                r={isLast ? 4.5 : 3}
                fill="#FFFFFF"
                stroke={isLast ? '#B8860B' : '#008B84'}
                strokeWidth="2"
              />
              {isLast && (
                <text
                  x={x(i)}
                  y={y(p.accuracy) - 12}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="500"
                  fill="#1A1A1A"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {Math.round(p.accuracy * 100)}%
                </text>
              )}
              {/* Endpoint x-labels only, to avoid crowding */}
              {(i === 0 || isLast) && (
                <text x={x(i)} y={H - 10} textAnchor={i === 0 ? 'start' : 'end'} fontSize="10" fill="#9CA3AF">
                  {i === 0 ? (en ? 'start' : '起步') : en ? 'today' : '今日'}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
