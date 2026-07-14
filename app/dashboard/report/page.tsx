'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ImageDown } from 'lucide-react'
import RadarChart, { type RadarAxis } from '@/components/RadarChart'
import ErrorDNA from '@/components/ErrorDNA'
import { getTopicStats, weakestTopics, winRate, type TopicStatEntry } from '@/lib/topicStats'
import { getReverseLog } from '@/lib/reverseLog'
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

    const log = getReverseLog()
    const dna = {
      concept: log.filter((e) => e.cause === 'A').length,
      trap: log.filter((e) => e.cause === 'B').length,
      careless: log.filter((e) => e.cause === 'C').length,
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
      a.download = `dse-level-up-溫書地圖-${Date.now()}.png`
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
        <p className="text-slate-400 animate-pulse">{en ? 'Building your study map…' : '生成緊你嘅溫書地圖...'}</p>
      </div>
    )
  }

  // 未有數據
  if (report === 'empty') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950 px-4 text-center">
        <div className="text-5xl" aria-hidden>🗺️</div>
        <p className="text-slate-300 font-bold">{en ? 'No practice data yet' : '仲未有練習記錄'}</p>
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
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm transition-colors">
            <ArrowLeft size={15} /> {en ? 'Back to dashboard' : '返回我的進度'}
          </Link>
          <button
            onClick={downloadPng}
            disabled={downloading}
            className="inline-flex items-center gap-2 border border-[#00F5D4]/40 text-[#00F5D4] hover:bg-[#00F5D4]/10 px-4 py-2.5 rounded-xl transition-all text-sm font-semibold disabled:opacity-50"
          >
            <ImageDown size={15} /> {downloading ? (en ? 'Exporting…' : '導出緊…') : en ? 'Download PNG' : '下載 PNG'}
          </button>
        </div>

        {/* ===== 報告區（PNG 會影呢個範圍） ===== */}
        <div ref={areaRef} className="bg-slate-950 rounded-2xl p-5 sm:p-8">
          <header className="text-center mb-8">
            <div className="text-sm font-bold tracking-widest" style={{ color: '#00F5D4' }}>DSE LEVEL UP</div>
            <h1 className="text-3xl font-extrabold mt-2">{en ? 'My Study Map' : '我嘅溫書地圖'}</h1>
            <p className="text-slate-500 text-xs mt-2">{report.generatedAt}</p>
          </header>

          {/* 統計卡 ×4 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {stat.map((c) => (
              <div key={c.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center">
                <div className="text-3xl font-extrabold" style={{ color: c.accent }}>{c.value}</div>
                <div className="text-xs text-slate-500 mt-2">{c.label}</div>
              </div>
            ))}
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
                    <div className="text-slate-500 text-xs mt-2 leading-relaxed">
                      {en ? 'Room to grow — redo the variants and reread the full solution.' : '進步空間 —— 重做變體題，再細讀詳解。'}
                    </div>
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
                  <span style={{ color: '#00F5D4' }}>{i + 1}.</span> {s}
                </li>
              ))}
            </ul>
          </div>

          <footer className="text-center text-[11px] text-slate-600 leading-relaxed">
            © DSE Level Up 2026. {en ? 'Data is for personal study reference only; official results are as published by the HKEAA.' : '數據僅供個人學習參考，最終成績以 HKEAA 公布為準。'}
          </footer>
        </div>
      </div>
    </div>
  )
}
