'use client'

// 知識概念網 —— 純 SVG（第 2 週 · 引擎三）
//
// 規格書 §4.4 嘅四條硬性約束，全部喺呢個組件執行：
//   1. 節點大小【固定】—— 冇稀有度、冇等級、冇大小差異
//   2. 未探索節點寫「等待發現」，唔寫「未完成」
//   3. 冇完成度百分比 —— 只講「已探索幾多篇」同「已建立幾多個連接」
//   4. 純 SVG，零圖表庫
//
// 版面：十二篇按文體分組順序排成一個圓。同組必然相鄰，所以「可比較連接」
// 係圓周附近嘅短弧；「跨篇連接」（題庫真實存在嘅跨篇比較題）會橫過中間，
// 一眼分得出兩者唔同 —— 呢個係用位置而唔係用顏色去講嘅分別。

import { useEffect, useState } from 'react'
import { useLocale } from '@/lib/i18n'
import {
  computeConceptNet,
  GROUPS,
  type ConceptNetState,
  type ConceptNode,
} from '@/lib/conceptNet'

const SIZE = 460
const R = 158
const NODE_R = 13 // 固定，永遠唔跟表現變

function pointAt(i: number, n: number, r: number): [number, number] {
  const a = ((-90 + (i * 360) / n) * Math.PI) / 180
  return [SIZE / 2 + r * Math.cos(a), SIZE / 2 + r * Math.sin(a)]
}

export default function ConceptNet({
  onSelect,
  selectedId,
}: {
  onSelect?: (node: ConceptNode) => void
  selectedId?: string | null
}) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [state, setState] = useState<ConceptNetState | null>(null)

  useEffect(() => {
    setState(computeConceptNet())
  }, [])

  if (!state) return null

  const n = state.nodes.length
  const pos = new Map<string, [number, number]>()
  state.nodes.forEach((node, i) => pos.set(node.id, pointAt(i, n, R)))

  return (
    <div>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-[480px] mx-auto"
        role="img"
        aria-label={
          en
            ? `Concept map of the twelve prescribed classical texts: ${state.exploredCount} explored, ${state.connectionCount} connections formed`
            : `指定文言範文十二篇概念網：已探索 ${state.exploredCount} 篇，已建立 ${state.connectionCount} 個連接`
        }
      >
        {/* 連接線先畫，永遠喺節點底下 */}
        {state.edges.map((e) => {
          const p1 = pos.get(e.a)
          const p2 = pos.get(e.b)
          if (!p1 || !p2) return null
          return (
            <line
              key={`${e.a}-${e.b}`}
              x1={p1[0]}
              y1={p1[1]}
              x2={p2[0]}
              y2={p2[1]}
              className={e.crossText ? 'stroke-gold' : 'stroke-accent'}
              strokeWidth={e.crossText ? 2 : 1}
              strokeOpacity={e.crossText ? 0.75 : 0.28}
            />
          )
        })}

        {state.nodes.map((node, i) => {
          const [x, y] = pointAt(i, n, R)
          const [lx, ly] = pointAt(i, n, R + 34)
          const sel = selectedId === node.id
          const short = node.zh.replace(/（節錄）/, '') // i18n-exempt: 剝走中文篇名嘅「（節錄）」後綴，英文行走 node.en，唔經呢條 regex
          const label = en ? node.en : short
          return (
            <g
              key={node.id}
              className={onSelect ? 'cursor-pointer' : undefined}
              onClick={onSelect ? () => onSelect(node) : undefined}
              role={onSelect ? 'button' : undefined}
              tabIndex={onSelect ? 0 : undefined}
              onKeyDown={
                onSelect
                  ? (ev) => {
                      if (ev.key === 'Enter' || ev.key === ' ') {
                        ev.preventDefault()
                        onSelect(node)
                      }
                    }
                  : undefined
              }
              aria-label={
                node.explored
                  ? en
                    ? `${node.en} — explored`
                    : `${short} —— 已探索`
                  : en
                    ? `${node.en} — waiting to be discovered`
                    : `${short} —— 等待發現`
              }
            >
              {sel && (
                <circle cx={x} cy={y} r={NODE_R + 6} className="fill-none stroke-gold" strokeWidth={1.5} />
              )}
              <circle
                cx={x}
                cy={y}
                /* 半徑寫死 —— 規格書 §4.4：節點大小固定，冇稀有度差異 */
                r={NODE_R}
                className={node.explored ? 'fill-accent stroke-accent' : 'fill-none stroke-line-strong'}
                fillOpacity={node.explored ? 0.22 : 0}
                strokeWidth={1.5}
                strokeDasharray={node.explored ? undefined : '3 3'}
              />
              <text
                x={lx}
                y={ly}
                fontSize={10}
                textAnchor="middle"
                dominantBaseline="middle"
                className={node.explored ? 'fill-ink-soft' : 'fill-ink-muted'}
              >
                {label.length > 9 ? `${label.slice(0, 9)}…` : label}
              </text>
            </g>
          )
        })}
      </svg>

      {/* 圖例。刻意唔出百分比，亦唔出「X / 12」—— 規格書 §4.4 明訂冇完成度。 */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-accent/40 border border-accent" aria-hidden />
          {en ? `${state.exploredCount} explored` : `已探索 ${state.exploredCount} 篇`}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-5 h-px bg-accent/50" aria-hidden />
          {en ? 'ready to compare' : '可比較連接'}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-5 h-0.5 bg-gold" aria-hidden />
          {en ? 'cross-text link' : '跨篇連接'}
        </span>
        <span>{en ? `${state.connectionCount} connections formed` : `已建立 ${state.connectionCount} 個連接`}</span>
      </div>

      <p className="mt-3 text-[11px] text-ink-muted text-center leading-relaxed">
        {en
          ? 'Grouping by genre is our own navigation aid, not an HKEAA classification. The twelve texts themselves are the official prescribed list.'
          : '文體分組係我哋為咗方便睇而做嘅導覽分類，唔係考評局嘅官方分類；十二篇本身先係官方指定篇目。'}
      </p>
      <p className="sr-only">
        {Object.values(GROUPS)
          .map((g) => (en ? g.en : g.zh))
          .join(' · ')}
      </p>
    </div>
  )
}
