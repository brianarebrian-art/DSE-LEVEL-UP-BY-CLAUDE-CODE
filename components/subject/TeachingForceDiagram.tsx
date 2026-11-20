import type { HorizontalForceDiagram } from '@/data/public-samples/batch-1'

function clampLength(length: number): number {
  if (length < 36) return 36
  if (length > 124) return 124
  return length
}

function HorizontalArrow({
  x1,
  x2,
  y,
  label,
  dashed,
}: {
  x1: number
  x2: number
  y: number
  label: string
  dashed?: boolean
}) {
  const direction = x2 >= x1 ? 1 : -1
  const head = 11
  const base = x2 - direction * head
  const mid = (x1 + x2) / 2
  return (
    <g>
      <line
        x1={x1}
        y1={y}
        x2={base}
        y2={y}
        stroke="currentColor"
        strokeWidth={2.5}
        strokeDasharray={dashed ? '7 4' : undefined}
      />
      <polygon points={`${x2},${y} ${base},${y - 5.5} ${base},${y + 5.5}`} fill="currentColor" />
      <text x={mid} y={y - 8} textAnchor="middle" fill="currentColor" fontSize={14}>
        {label}
      </text>
    </g>
  )
}

/** Original free-body diagram for the two public mechanics samples. Labels come from data. */
export function TeachingForceDiagram({ model }: { model: HorizontalForceDiagram }) {
  const hasAccel = Boolean(model.accelLabel && model.accelDirection)
  const bodyX = 140
  const bodyW = 80
  const bodyH = 64
  const bodyY = hasAccel ? 78 : 36
  const groundY = bodyY + bodyH
  const forceY = bodyY + 44
  const vbH = groundY + 52
  const captionId = `${model.id}-caption`
  const leftLength = clampLength(model.leftLength)
  const rightLength = clampLength(model.rightLength)
  const ticks = [40, 68, 96, 124, 152, 180, 208, 236, 264, 292, 320]

  return (
    <figure className="mb-6 rounded-xl border border-stone-200 bg-white p-3 dark:border-stone-700 dark:bg-stone-900">
      <svg role="img" aria-label={model.ariaLabel} aria-describedby={captionId} focusable="false" width="320" height={vbH} viewBox={`0 0 360 ${vbH}`} className="h-auto w-full max-w-full text-stone-900 dark:text-stone-100">
        <line x1={28} y1={groundY} x2={332} y2={groundY} stroke="currentColor" strokeWidth={2} />
        {ticks.map((x) => (
          <line key={x} x1={x} y1={groundY} x2={x - 8} y2={groundY + 8} stroke="currentColor" strokeWidth={1.5} />
        ))}
        <rect
          x={bodyX}
          y={bodyY}
          width={bodyW}
          height={bodyH}
          rx={6}
          className="fill-stone-100 dark:fill-stone-800"
          stroke="currentColor"
          strokeWidth={2}
        />
        <text
          x={bodyX + bodyW / 2}
          y={bodyY + 30}
          textAnchor="middle"
          fill="currentColor"
          fontSize={16}
          fontWeight={600}
        >
          {model.bodyLabel}
        </text>
        <HorizontalArrow x1={bodyX} x2={bodyX - leftLength} y={forceY} label={model.leftLabel} />
        <HorizontalArrow x1={bodyX + bodyW} x2={bodyX + bodyW + rightLength} y={forceY} label={model.rightLabel} />
        {hasAccel ? (
          <HorizontalArrow
            x1={model.accelDirection === 'left' ? 250 : 150}
            x2={model.accelDirection === 'left' ? 150 : 250}
            y={bodyY - 28}
            label={model.accelLabel ?? ''}
            dashed
          />
        ) : null}
        <text x={180} y={groundY + 28} textAnchor="middle" fill="currentColor" fontSize={13}>
          {model.surfaceLabel}
        </text>
      </svg>
      <figcaption id={captionId} className="mt-2 text-sm leading-relaxed text-stone-800 dark:text-stone-100">
        {model.caption}
      </figcaption>
    </figure>
  )
}
