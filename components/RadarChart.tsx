'use client'

// Lightweight pure-SVG radar chart (no chart library). Each axis is a capability
// dimension with a 0–1 value; the filled polygon's shape changes live with the data.

export interface RadarAxis {
  label: string
  value: number // 0..1
}

export default function RadarChart({
  axes,
  size = 260,
}: {
  axes: RadarAxis[]
  size?: number
}) {
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
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] mx-auto" role="img" aria-label={'弱項雷達圖 / weakness radar' /* i18n-exempt: 一次過雙語 aria-label；純 SVG 共用組件，無 locale context */}>
      {rings.map((r) => (
        <polygon
          key={r}
          points={axes.map((_, i) => point(i, r * R).join(',')).join(' ')}
          fill="none"
          stroke="#1e293b"
          strokeWidth={1}
        />
      ))}
      {axes.map((_, i) => {
        const [x, y] = point(i, R)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#1e293b" strokeWidth={1} />
      })}
      <polygon points={valuePoly} fill="rgba(245,158,11,0.22)" stroke="#f59e0b" strokeWidth={2} />
      {axes.map((ax, i) => {
        const [x, y] = point(i, clamp(ax.value) * R)
        return <circle key={i} cx={x} cy={y} r={3.5} fill="#f59e0b" />
      })}
      {axes.map((ax, i) => {
        const [x, y] = point(i, R + 20)
        const short = ax.label.length > 6 ? ax.label.slice(0, 6) : ax.label
        return (
          <text key={i} x={x} y={y} fontSize={10} fill="#94a3b8" textAnchor="middle" dominantBaseline="middle">
            {short}
          </text>
        )
      })}
    </svg>
  )
}
