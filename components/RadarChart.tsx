'use client'

// Lightweight pure-SVG radar chart (no chart library). Each axis is a capability
// dimension with a 0–1 value; the filled polygon's shape changes live with the data.
//
// 2026-07-30 對比度修正：軸標籤原本寫死 fill="#6B6B6B"，但本組件會出現喺兩個
// 底色完全相反嘅地方 —— /dashboard（跟主題嘅卡，Cyber 下變深藍，深灰字剩 3.2:1）
// 同 /dashboard/report（永遠深色，因為導出 PNG 底色鎖 #020617，深灰字剩 2.6:1）。
// 兩邊都唔合格。故加 `tone`：
//   'theme'（預設）—— 用 Tailwind fill-* utility 跟主題 token 走
//   'dark'         —— 固定淺灰，專門畀永遠深底嘅報告頁／導出圖用
// SVG presentation attribute 唔食 var()，所以必須用 utility class 而唔係 fill=""。

export interface RadarAxis {
  label: string
  value: number // 0..1
}

export default function RadarChart({
  axes,
  size = 260,
  tone = 'theme',
}: {
  axes: RadarAxis[]
  size?: number
  tone?: 'theme' | 'dark'
}) {
  const dark = tone === 'dark'
  const labelCls = dark ? 'fill-slate-400' : 'fill-ink-muted'
  const gridStroke = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.10)'
  const markCls = dark ? 'fill-cyan-300 stroke-cyan-300' : 'fill-accent stroke-accent'
  const n = axes.length
  if (n < 3) return null // a polygon needs at least 3 axes

  const cx = size / 2
  const cy = size / 2
  const R = size / 2 - 40
  const point = (i: number, r: number): [number, number] => {
    const a = ((-90 + (i * 360) / n) * Math.PI) / 180
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
  }
  const clamp = (v: number) => Math.max(0.04, Math.min(1, Number.isFinite(v) ? v : 0))
  const rings = [0.25, 0.5, 0.75, 1]
  const valuePoly = axes.map((ax, i) => point(i, clamp(ax.value) * R).join(',')).join(' ')

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] mx-auto" role="img" aria-label={'能力雷達圖 / ability radar' /* i18n-exempt: 一次過雙語 aria-label；純 SVG 共用組件，無 locale context */}>
      {rings.map((r) => (
        <polygon
          key={r}
          points={axes.map((_, i) => point(i, r * R).join(',')).join(' ')}
          fill="none"
          stroke={gridStroke}
          strokeWidth={1}
        />
      ))}
      {axes.map((_, i) => {
        const [x, y] = point(i, R)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={gridStroke} strokeWidth={1} />
      })}
      <polygon points={valuePoly} className={markCls} fillOpacity={0.15} strokeWidth={2} />
      {axes.map((ax, i) => {
        const [x, y] = point(i, clamp(ax.value) * R)
        return <circle key={i} cx={x} cy={y} r={3.5} className={markCls} />
      })}
      {axes.map((ax, i) => {
        const [x, y] = point(i, R + 20)
        const short = ax.label.length > 6 ? ax.label.slice(0, 6) : ax.label
        return (
          <text key={i} x={x} y={y} fontSize={10} className={labelCls} textAnchor="middle" dominantBaseline="middle">
            {short}
          </text>
        )
      })}
    </svg>
  )
}
