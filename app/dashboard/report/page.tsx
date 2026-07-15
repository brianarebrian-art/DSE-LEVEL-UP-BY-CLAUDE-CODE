'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ImageDown } from 'lucide-react'
import RadarChart, { type RadarAxis } from '@/components/RadarChart'
import ErrorDNA from '@/components/ErrorDNA'
import { getTopicStats, weakestTopics, winRate, type TopicStatEntry } from '@/lib/topicStats'
import { getReverseLog } from '@/lib/reverseLog'
import { loadAttempts } from '@/lib/progress'
import { predictGrade } from '@/lib/grading'
import { getPracticeCutoffs } from '@/data/cutoffs'
import { useLocale } from '@/lib/i18n'

// 生成報告 —「我嘅溫書地圖」。學生自學檢討 + 可下載 PNG 分享俾任何人（老師／師兄師姐／
// 家長），平台唔做老師登入同數據存取（老師平台已一刀斬）。
//
// 誠實原則：全部數據即時由本機 REAL 記錄聚合 —— lib/topicStats（逐課題操練/掌握度）、
// lib/reverseLog（錯因三維自診）、dse_result（最近一次練習）。冇 server 表、冇 cache、
// 冇虛構 trendSlope/JUPAS。「最近練習等級」用現有 predictGrade（同 /result 一致，僅供參考）。
// PNG 下載用現有依賴 html2canvas（動態 import，零新增套件）。

interface StoredResult {
  score: number
  total: number
  subjectId?: string
  elapsed: number
}

// 逐課題溫習建議（盲點卡用）。key = 真實題庫 topic id；搵唔到就按 label 關鍵字 fallback，
// 再唔係就用 default。內容對齊 HKEAA 術語（共用品，非公共財）。
const SUGGESTIONS: { match: (id: string, label: string) => boolean; zh: string; en: string }[] = [
  {
    match: (id, l) => id.includes('quadratic') || l.includes('二次'),
    zh: '重溫求根公式同判別式嘅應用場景。',
    en: 'Revisit the quadratic formula and where the discriminant applies.',
  },
  {
    match: (id, l) => id === 'market_failure' || l.includes('共用品') || l.includes('市場失靈'),
    zh: '再睇一次「共用品」嘅兩大特徵：非排他性同非競爭性。',
    en: 'Re-check the two defining features of a public good: non-excludability and non-rivalry.',
  },
  {
    match: (id, l) => id === 'demand_supply' || l.includes('供求') || l.includes('需求'),
    zh: '畫多幾次供求曲線，留意價格同數量變動方向。',
    en: 'Sketch the demand–supply curves a few more times; watch which way price and quantity move.',
  },
  {
    match: (id, l) => id === 'probability' || l.includes('概率') || l.includes('機率'),
    zh: '溫習條件概率同樹形圖嘅畫法。',
    en: 'Review conditional probability and how to draw tree diagrams.',
  },
  {
    match: (id, l) => ['mechanics', 'force_motion', 'kinematics'].includes(id) || l.includes('力學'),
    zh: '力學圖要標晒所有力，包括摩擦力同支持力。',
    en: 'Label every force on your mechanics diagrams — friction and the normal force included.',
  },
]

function suggestionFor(id: string, label: string, en: boolean): string {
  const hit = SUGGESTIONS.find((s) => s.match(id, label))
  if (hit) return en ? hit.en : hit.zh
  return en
    ? 'Do 5 more variant questions on this topic, then reread the full solution.'
    : '針對呢個課題多做 5 題變體練習，再細讀詳解。'
}

interface ReportData {
  generatedAt: string
  lastGrade: string | null
  accuracy: number
  attempts: number
  masteredCount: number
  radarAxes: RadarAxis[]
  blindSpots: TopicStatEntry[]
  dna: { concept: number; trap: number; careless: number }
  nextSteps: string[]
  // 近 30 日真・軌跡（由 dse_progress 練習史計，唔係虛構 trendSlope）；<4 次練習就唔顯示
  trend: {
    runs: number
    earlyPct: number
    latePct: number
    status: 'up' | 'steady' | 'building'
    points: { t: number; pct: number }[]
  } | null
}

export default function ReportPage() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [report, setReport] = useState<ReportData | null | 'empty'>(null)
  const [downloading, setDownloading] = useState(false)
  const areaRef = useRef<HTMLDivElement>(null)

  // 即時聚合（client-only：localStorage 只喺瀏覽器有）
  useEffect(() => {
    const stats = getTopicStats()
    const attempts = stats.reduce((a, e) => a + e.total, 0)
    if (attempts === 0) return setReport('empty')

    const correct = stats.reduce((a, e) => a + (e.total - e.wrong), 0)
    const mastered = stats.filter((e) => e.total >= 4 && winRate(e) >= 0.7).length

    // 最近一次練習等級（現有 predictGrade，同 /result 一致；冇做過就唔顯示）
    let lastGrade: string | null = null
    try {
      const raw = localStorage.getItem('dse_result')
      if (raw) {
        const r: StoredResult = JSON.parse(raw)
        lastGrade = predictGrade(r.score, getPracticeCutoffs(r.total, r.subjectId ?? 'practice')).grade
      }
    } catch { /* ignore */ }

    // 雷達：操練得最多嘅課題（最多 6 條軸），value = 掌握度 0–1
    const radarAxes = [...stats]
      .sort((a, b) => b.total - a.total)
      .slice(0, 6)
      .map((e) => ({ label: e.label, value: winRate(e) }))

    const blind = weakestTopics({ min: 2, limit: 3 }).filter((e) => winRate(e) < 1)

    // 錯題 DNA：近 50 條錯因自診（log 新喺頭，slice 即最近 50）
    const log = getReverseLog().slice(0, 50)
    const dna = {
      concept: log.filter((e) => e.cause === 'A').length,
      trap: log.filter((e) => e.cause === 'B').length,
      careless: log.filter((e) => e.cause === 'C').length,
    }

    // 近 30 日進步軌跡：真練習史（dse_progress），前半 vs 後半平均準確率。
    // ≥4 次先有統計意義；下行用「蓄力中」正向措辭（大愛紅線：無「退步/落後」）。
    let trend: ReportData['trend'] = null
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000
    const recent = loadAttempts()
      .filter((a) => a.timestamp >= cutoff && a.total > 0)
      .sort((a, b) => a.timestamp - b.timestamp)
    if (recent.length >= 4) {
      const half = Math.floor(recent.length / 2)
      const pct = (list: typeof recent) =>
        Math.round((list.reduce((s, a) => s + a.score, 0) / list.reduce((s, a) => s + a.total, 0)) * 100)
      const earlyPct = pct(recent.slice(0, half))
      const latePct = pct(recent.slice(half))
      const delta = latePct - earlyPct
      trend = {
        runs: recent.length,
        earlyPct,
        latePct,
        status: delta >= 3 ? 'up' : delta <= -3 ? 'building' : 'steady',
        points: recent.map((a) => ({ t: a.timestamp, pct: Math.round((a.score / a.total) * 100) })),
      }
    }

    // 下一步建議（規則式，全部由真數據推）
    const steps: string[] = []
    if (blind[0]) {
      steps.push(
        en
          ? `Focus on “${blind[0].label}” — 3 foundation variants a day.`
          : `專攻「${blind[0].label}」，每日 3 題基礎變體。`,
      )
    }
    if (dna.careless > dna.concept && dna.careless > 0) {
      steps.push(
        en
          ? 'Your concepts are solid — try leaving an extra 30 seconds to double-check each answer.'
          : '你嘅概念理解唔錯，試下做題時多留 30 秒檢查。',
      )
    } else {
      steps.push(
        en
          ? 'Revisit the Path A full solutions for the topics above, then redo the variants until it clicks.'
          : '重溫上面課題嘅 Path A 詳解，再重做變體題，將「識」化為「熟」。',
      )
    }

    setReport({
      generatedAt: new Date().toLocaleDateString(en ? 'en-HK' : 'zh-HK'),
      lastGrade,
      accuracy: Math.round((correct / attempts) * 100),
      attempts,
      masteredCount: mastered,
      radarAxes,
      blindSpots: blind,
      nextSteps: steps,
      dna,
      trend,
    })
  }, [en])

  const downloadPng = async () => {
    if (downloading || !areaRef.current) return
    setDownloading(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(areaRef.current, { backgroundColor: '#020617', scale: 2, logging: false })
      const blob: Blob | null = await new Promise((res) => canvas.toBlob((b) => res(b), 'image/png'))
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `DSE_LevelUp_Report_${new Date().toISOString().slice(0, 10)}.png`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  // Loading
  if (report === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <p className="text-slate-400 animate-pulse motion-reduce:animate-none">{en ? 'Building your study map…' : '生成緊你嘅溫書地圖...'}</p>
      </div>
    )
  }

  // 未有數據
  if (report === 'empty') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950 px-4 text-center">
        <div className="text-5xl" aria-hidden>🗺️</div>
        <p className="text-slate-300 font-bold">{en ? 'Not enough data yet — do a few questions first!' : '仲未有足夠數據，做幾題先！'}</p>
        <p className="text-slate-500 text-sm max-w-sm">
          {en ? 'Do a few questions first — your study map is built from your real practice.' : '先做幾條題目 —— 溫書地圖係由你嘅真實練習記錄生成。'}
        </p>
        <Link href="/subjects" className="mt-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-all">
          {en ? 'Start practising' : '去操練'}
        </Link>
      </div>
    )
  }

  const stat = [
    { label: en ? 'Latest practice level' : '最近練習等級', value: report.lastGrade ?? '—', accent: '#00F5D4' },
    { label: en ? 'Overall accuracy' : '整體準確率', value: `${report.accuracy}%`, accent: '#FEE440' },
    { label: en ? 'Questions attempted' : '已做題數', value: `${report.attempts}`, accent: '#9B5DE5' },
    { label: en ? 'Topics mastered' : '已攻克課題', value: `${report.masteredCount}`, accent: '#00F5D4' },
  ]

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        {/* 頂部操作列（no-print，唔會入 PNG 截圖之外嘅嘢） */}
        <div className="no-print flex items-center justify-between mb-6 gap-3 flex-wrap">
          <Link href="/dashboard" className="inline-flex items-center gap-2 min-h-11 text-slate-400 hover:text-slate-200 text-sm transition-colors">
            <ArrowLeft size={15} /> {en ? 'Back to dashboard' : '返回我的進度'}
          </Link>
          <button
            onClick={downloadPng}
            disabled={downloading}
            className="inline-flex items-center gap-2 min-h-11 bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-4 py-2.5 rounded-xl transition-all text-sm font-bold disabled:opacity-50"
          >
            <ImageDown size={15} /> {downloading ? (en ? 'Exporting…' : '導出緊…') : en ? 'Download PNG' : '下載 PNG'}
          </button>
        </div>

        {/* ===== 報告區（PNG 會影呢個範圍） ===== */}
        <div ref={areaRef} className="bg-slate-950 rounded-2xl p-5 sm:p-8">
          <header className="text-center mb-8">
            <div className="text-sm font-bold tracking-widest" style={{ color: '#00F5D4' }}>DSE LEVEL UP</div>
            <h1 className="text-3xl font-extrabold mt-2">{en ? 'My Study Map' : '我嘅溫書地圖'}</h1>
            <p className="text-slate-400 text-xs mt-2">{report.generatedAt}</p>
          </header>

          {/* 統計卡 ×4 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {stat.map((c) => (
              <div key={c.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
                <div className="text-3xl font-extrabold" style={{ color: c.accent }}>{c.value}</div>
                <div className="text-xs text-slate-400 mt-2">{c.label}</div>
              </div>
            ))}
          </div>

          {/* 近 30 日進步軌跡：真練習史（dse_progress），純 SVG 折線（零圖表庫）。
              每點 = 一次練習嘅準確率；<4 次未夠統計意義，顯示鼓勵文案。 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h2 className="text-sm font-bold text-slate-300">{en ? 'Progress (last 30 days)' : '進步軌跡（近 30 日）'}</h2>
              {report.trend && (
                <span
                  className="text-sm font-bold"
                  style={{ color: report.trend.status === 'up' ? '#00F5D4' : report.trend.status === 'steady' ? '#FEE440' : '#9B5DE5' }}
                >
                  {report.trend.runs} {en ? 'runs' : '次練習'} · {report.trend.earlyPct}% → {report.trend.latePct}%{' '}
                  {report.trend.status === 'up'
                    ? en ? '↗ Rising' : '↗ 上升'
                    : report.trend.status === 'steady'
                      ? en ? '→ Steady' : '→ 平穩'
                      : en ? '🌱 Building up' : '🌱 蓄力中'}
                </span>
              )}
            </div>
            {report.trend ? (
              (() => {
                const pts = report.trend.points
                const t0 = pts[0].t
                const t1 = pts[pts.length - 1].t
                const x = (t: number) => (t1 === t0 ? 300 : 20 + ((t - t0) / (t1 - t0)) * 560)
                const y = (pct: number) => 140 - pct * 1.2
                const line = pts.map((p) => `${x(p.t).toFixed(1)},${y(p.pct).toFixed(1)}`).join(' ')
                const md = (t: number) => { const d = new Date(t); return `${d.getMonth() + 1}/${d.getDate()}` }
                return (
                  <svg viewBox="0 0 600 168" className="w-full h-auto" role="img" aria-label={en ? 'Accuracy over time' : '準確率走勢'}>
                    <defs>
                      <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[0, 50, 100].map((g) => (
                      <g key={g}>
                        <line x1="20" x2="580" y1={y(g)} y2={y(g)} stroke="#1e293b" strokeWidth="1" />
                        <text x="583" y={y(g) + 3} fontSize="9" fill="#94a3b8">{g}%</text>
                      </g>
                    ))}
                    <polygon points={`20,${y(0)} ${line} ${x(t1).toFixed(1)},${y(0)}`} fill="url(#trendFill)" />
                    <polyline points={line} fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                    {pts.map((p, i) => (
                      <circle key={i} cx={x(p.t)} cy={y(p.pct)} r="3" fill="#22d3ee" />
                    ))}
                    <text x="20" y="162" fontSize="10" fill="#94a3b8">{md(t0)}</text>
                    <text x="580" y="162" fontSize="10" fill="#94a3b8" textAnchor="end">{md(t1)}</text>
                  </svg>
                )
              })()
            ) : (
              <p className="text-slate-400 text-sm text-center py-6">
                {en ? 'Do a few more questions and your progress line will appear!' : '做多幾題，進步軌跡就會出現！'}
              </p>
            )}
          </div>

          {/* 能力雷達 */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
            <h2 className="text-sm font-bold text-slate-300 mb-4">{en ? 'Ability radar (mastery by topic)' : '能力雷達（逐課題掌握度）'}</h2>
            <RadarChart axes={report.radarAxes} />
          </div>

          {/* 發現盲點 */}
          {report.blindSpots.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-bold text-slate-300 mb-3">{en ? 'Blind spots discovered 💡' : '發現盲點 💡'}</h2>
              <div className="grid sm:grid-cols-3 gap-3">
                {report.blindSpots.map((b) => (
                  <div key={`${b.subjectId}-${b.topic}`} className="bg-slate-900 border border-rose-500/20 rounded-xl p-4">
                    <div className="text-rose-300 font-bold text-sm">{b.label}</div>
                    <div className="text-slate-400 text-xs mt-1">{en ? 'Mastery' : '掌握度'} {Math.round(winRate(b) * 100)}%</div>
                    <div className="text-slate-400 text-xs mt-2 leading-relaxed">
                      {suggestionFor(b.topic, b.label, en)}
                    </div>
                    {/* 即刻溫呢度 → 直入該科該課題操練（practice 需要 subject+topic 兩個參數）。
                        data-html2canvas-ignore：下載 PNG 時唔會影埋個掣落報告圖。 */}
                    <Link
                      href={`/practice?subject=${encodeURIComponent(b.subjectId)}&topic=${encodeURIComponent(b.topic)}`}
                      data-html2canvas-ignore
                      className="mt-3 inline-flex items-center justify-center w-full min-h-11 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 rounded-lg py-2 text-xs font-semibold transition-all"
                    >
                      {en ? 'Practise this now' : '即刻溫呢度'}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 錯題 DNA（重用現有組件：概念盲區／審題陷阱／運算粗心） */}
          <div className="mb-8">
            <ErrorDNA />
          </div>

          {/* 下一步建議 */}
          <div className="rounded-2xl p-6 mb-8 border border-slate-800" style={{ background: 'linear-gradient(135deg, rgba(0,245,212,0.10), rgba(155,93,229,0.10))' }}>
            <h2 className="text-sm font-bold text-slate-200 mb-3">{en ? 'Next steps' : '下一步建議'}</h2>
            <ul className="space-y-2">
              {report.nextSteps.map((s, i) => (
                <li key={i} className="text-sm text-slate-300 flex gap-2">
                  <span style={{ color: '#00F5D4' }}>▸</span> {s}
                </li>
              ))}
            </ul>
          </div>

          <footer className="text-center text-[11px] text-slate-400 leading-relaxed">
            © DSE Level Up 2026. {en ? 'Data is for personal study reference only; official results are as published by the HKEAA.' : '數據僅供個人學習參考，最終成績以 HKEAA 公布為準。'}
          </footer>
        </div>
      </div>
    </div>
  )
}
