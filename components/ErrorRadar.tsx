'use client'

import { useEffect, useRef, useState } from 'react'
import { getReverseLog, type ReverseCause } from '@/lib/reverseLog'
import { useLocale } from '@/lib/i18n'

// F-DNA: 錯題 DNA 雷達圖 (Victor + Ethan + Kate)
// 純 SVG 三軸雷達，數據 = 最近 30 日逆向錯因日誌（lib/reverseLog，本地）。
// 三軸沿用全站現有錯因分類（A 概念盲區／B 審題陷阱／C 運算粗心）——
// spec 嘅 MEC「方法錯誤」對應現有 C 軸，唔另起爐灶以免同已記錄數據脫節。
// 洞察文案：規則式、只描述唔批評、絕不同其他學生比較。載入時由中心展開 800ms
//（respect prefers-reduced-motion）。

const AXES: { cause: ReverseCause; zh: string; en: string }[] = [
  { cause: 'A', zh: '概念盲區', en: 'Concept blind spot' },
  { cause: 'B', zh: '審題陷阱', en: 'Question traps' },
  { cause: 'C', zh: '運算粗心', en: 'Careless slips' },
]

const DAY = 24 * 60 * 60 * 1000
const CX = 110
const CY = 102
const R = 72

// 三軸方向：頂、右下、左下
function point(axis: number, r: number): [number, number] {
  const angle = -Math.PI / 2 + (axis * 2 * Math.PI) / 3
  return [CX + r * Math.cos(angle), CY + r * Math.sin(angle)]
}

export default function ErrorRadar() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [scores, setScores] = useState<Record<ReverseCause, number> | null>(null)
  const [total, setTotal] = useState(0)
  const [insight, setInsight] = useState('')
  const [scale, setScale] = useState(0) // 開場動畫：0 → 1
  const raf = useRef(0)

  useEffect(() => {
    const now = Date.now()
    const log = getReverseLog().filter((e) => now - e.ts <= 30 * DAY)
    const c: Record<ReverseCause, number> = { A: 0, B: 0, C: 0 }
    log.forEach((e) => { c[e.cause] += 1 })
    const n = log.length
    setTotal(n)
    // 每軸 0–100 = 該錯因佔最近 30 日錯誤嘅百分比
    setScores({
      A: n ? Math.round((c.A / n) * 100) : 0,
      B: n ? Math.round((c.B / n) * 100) : 0,
      C: n ? Math.round((c.C / n) * 100) : 0,
    })

    // 洞察（規則式，真數據）：主導錯因 + 近 7 日 vs 之前 7 日有冇收窄
    if (n >= 5) {
      const top = (['A', 'B', 'C'] as ReverseCause[]).reduce((a, b) => (c[a] >= c[b] ? a : b))
      const axis = AXES.find((x) => x.cause === top)!
      const pct = Math.round((c[top] / n) * 100)
      const last7 = log.filter((e) => now - e.ts <= 7 * DAY)
      const prev7 = log.filter((e) => now - e.ts > 7 * DAY && now - e.ts <= 14 * DAY)
      const share = (list: typeof log) =>
        list.length ? list.filter((e) => e.cause === top).length / list.length : null
      const s1 = share(last7)
      const s0 = share(prev7)
      const hint =
        top === 'A'
          ? (en ? 'Try revisiting definitions and conditions before drilling.' : '建議做題前先重溫該課題嘅定義同前提。')
          : top === 'B'
            ? (en ? 'Try circling keywords like “at least / except” before answering.' : '建議多做圈起「最多／至少／除咗」等關鍵字嘅練習。')
            : (en ? 'Try building a check-every-result habit.' : '建議養成做完即驗算嘅習慣。')
      if (s1 !== null && s0 !== null && s0 - s1 >= 0.1) {
        const drop = Math.round((s0 - s1) * 100)
        setInsight(
          en
            ? `“${axis.en}” is narrowing — down ${drop} percentage points this week vs last. Keep it up.`
            : `「${axis.zh}」正逐步收窄，近 7 日比之前 7 日減少 ${drop} 個百分點。繼續保持。`,
        )
      } else {
        setInsight(
          en
            ? `Your biggest recent challenge is “${axis.en}” (${pct}% of errors). ${hint}`
            : `你最近嘅最大挑戰係「${axis.zh}」，佔錯誤 ${pct}%。${hint}`,
        )
      }
    }

    // 開場動畫：由中心展開 800ms；prefers-reduced-motion 直接到位
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setScale(1)
      return
    }
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 800)
      setScale(1 - (1 - p) * (1 - p)) // ease-out
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [en]) // locale 切換時重算洞察文案

  if (!scores) return null

  const poly = AXES.map((a, i) => point(i, (R * (scores[a.cause] / 100)) * scale).join(',')).join(' ')

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="font-bold mb-1">🧬 {en ? 'Error DNA radar (last 30 days)' : '錯題 DNA 雷達（最近 30 日）'}</h2>
      <p className="text-xs text-slate-400 mb-3">
        {en ? 'Share of each self-diagnosed error cause' : '三維錯因自診分佈（各軸 = 佔錯誤百分比）'}
      </p>

      {total < 5 ? (
        <p className="text-sm text-slate-400 py-6 text-center">
          {en ? 'Building up data — keep practising and this analysis gets sharper.' : '數據累積中，繼續做題會令分析更準確。'}
        </p>
      ) : (
        <>
          <svg viewBox="0 0 220 190" className="w-full max-w-[280px] mx-auto h-auto" role="img"
            aria-label={en
              ? `Radar: concept ${scores.A}%, traps ${scores.B}%, careless ${scores.C}%`
              : `雷達：概念盲區 ${scores.A}%、審題陷阱 ${scores.B}%、運算粗心 ${scores.C}%`}>
            {/* 背景同心三角 + 軸線 */}
            {[1, 2 / 3, 1 / 3].map((f) => (
              <polygon key={f} points={AXES.map((_, i) => point(i, R * f).join(',')).join(' ')}
                fill="none" stroke="#1e293b" strokeWidth="1" />
            ))}
            {AXES.map((_, i) => {
              const [x, y] = point(i, R)
              return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="#1e293b" strokeWidth="1" />
            })}
            {/* 數據多邊形：紫填充 + 青邊框（設計系統） */}
            <polygon points={poly} fill="#9B5DE5" fillOpacity="0.3" stroke="#00F5D4" strokeWidth="2" strokeLinejoin="round" />
            {AXES.map((a, i) => {
              const [x, y] = point(i, (R * (scores[a.cause] / 100)) * scale)
              return <circle key={a.cause} cx={x} cy={y} r="3.5" fill="#00F5D4" />
            })}
            {/* 軸標籤 + 百分比 */}
            {AXES.map((a, i) => {
              const [x, y] = point(i, R + 16)
              return (
                <text key={a.cause} x={x} y={y + (i === 0 ? -2 : 8)} fontSize="10.5" fill="#cbd5e1" textAnchor="middle">
                  {en ? a.en : a.zh} {scores[a.cause]}%
                </text>
              )
            })}
          </svg>
          {insight && <p className="text-sm text-slate-300 leading-relaxed mt-3">{insight}</p>}
        </>
      )}
    </div>
  )
}
