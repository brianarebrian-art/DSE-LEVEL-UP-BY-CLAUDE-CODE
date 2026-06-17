'use client'

import Link from 'next/link'
import { ArrowRight, Brain, Zap } from 'lucide-react'
import MathText from '@/components/MathText'
import { subjects, getActiveSubjects } from '@/data/subjects'

const activeSubjects = getActiveSubjects()
const totalSubjects = subjects.length

const frameworks = [
  { emoji: '🔄', name: '轉化思維', desc: '將複雜問題化為已知形式', freq: '每年 4–5 條' },
  { emoji: '📈', name: '變化率直覺', desc: '導數與函數增減分析', freq: '每年 3–4 條' },
  { emoji: '🎯', name: '條件分解', desc: '拆解概率與統計條件', freq: '每年 3–4 條' },
  { emoji: '🏗️', name: '建模能力', desc: '將實際問題轉為數學模型', freq: '每年 2–3 條' },
  { emoji: '📐', name: '幾何直覺', desc: '坐標幾何與向量', freq: '每年 2–3 條' },
  { emoji: '🔢', name: '數列規律', desc: '等差等比與遞推', freq: '每年 2 條' },
  { emoji: '⚡', name: '三角轉換', desc: '三角恆等式與方程', freq: '每年 2–3 條' },
  { emoji: '🎲', name: '組合計數', desc: '排列組合原理', freq: '每年 2 條' },
  { emoji: '🔍', name: '圖像分析', desc: '函數圖像特徵識別', freq: '每年 2 條' },
  { emoji: '💡', name: '方程構建', desc: '建立並求解方程組', freq: '每年 2 條' },
  { emoji: '📊', name: '統計推斷', desc: '數據分佈與異常值', freq: '每年 2 條' },
  { emoji: '🌀', name: '對稱原理', desc: '利用對稱性簡化問題', freq: '每年 1–2 條' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">

      {/* ── HERO ── */}
      <section className="relative pt-20 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-amber-500/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">

          {/* Live users badge */}
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-8 text-sm text-amber-300">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block" />
            已有 1,247 位 2026 DSE 考生喺度溫書
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-[1.15] tracking-tight">
            我分析了 10 年 DSE Math，
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              發現每年只考 12 個核心邏輯
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-3 max-w-2xl mx-auto">
            掌握邏輯，唔係背答案。無論出乜題，你都識答。
          </p>

          <div className="flex items-center justify-center gap-4 text-sm text-slate-600 mb-10">
            <span>✓ 2026 DSE 考生製作</span>
            <span>·</span>
            <span>✓ 完全免費</span>
            <span>·</span>
            <span>✓ 無廣告</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/subjects/math"
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-4 rounded-xl text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              立即開始練習 <ArrowRight size={18} />
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-8 py-4 rounded-xl text-base transition-all"
            >
              <Brain size={18} className="text-amber-400" /> 了解方法論
            </Link>
          </div>
        </div>
      </section>

      {/* ── LIVE DEMO ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
            睇下係點樣運作
          </h2>
          <p className="text-slate-500 text-center mb-12">
            一條 2023 DSE 真題 → 拆解核心邏輯 → 改寫版練習題
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-400 text-xs font-bold flex items-center justify-center">1</span>
                <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">官方試題</span>
              </div>
              <div className="text-xs text-amber-400 mb-3 font-mono">2023 DSE Math Paper 1 Q1</div>
              <p className="text-slate-300 text-sm leading-relaxed">
                解方程 <MathText>$2x^2 + 3x - 5 = 0$</MathText>，求 <MathText>$x$</MathText> 的值。
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-600">
                答案：<MathText>{'$x = 1$'}</MathText> 或 <MathText>{'$x = -\\frac{5}{2}$'}</MathText>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">2</span>
                <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">核心邏輯</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🔄</span>
                <span className="text-amber-400 text-sm font-semibold">框架：轉化思維</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                考核「因式分解」或「求根公式」的應用能力。<br /><br />
                數字不重要——能否辨認方程形式、選擇正確方法才是考點。換咩數字都係考呢樣嘢。
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900 border border-green-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 text-xs font-bold flex items-center justify-center">3</span>
                <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">改寫版（本平台）</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Zap size={14} className="text-green-400" />
                <span className="text-green-400 text-sm font-semibold">全新數字，同款邏輯</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                解方程 <MathText>$3x^2 + 5x - 2 = 0$</MathText>，求 <MathText>$x$</MathText> 的值。
              </p>
              <Link
                href="/subjects/math"
                className="block text-center text-sm bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 py-2 rounded-lg transition-all"
              >
                立即練習 →
              </Link>
            </div>
          </div>

          {/* Arrow connecting the steps on desktop */}
          <p className="text-center text-slate-600 text-sm mt-6">
            你做完改寫版練習後，遇到同類型題目——無論數字係咩——都識答。
          </p>
        </div>
      </section>

      {/* ── FRAMEWORKS GRID ── */}
      <section className="py-16 px-4 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
            DSE Math 的 12 個核心思維框架
          </h2>
          <p className="text-slate-500 text-center mb-12">
            每年出現，每年換湯不換藥——掌握框架，無懼任何變體
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {frameworks.map((f, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-600 transition-colors"
              >
                <div className="text-2xl mb-2">{f.emoji}</div>
                <div className="font-semibold text-sm mb-1">{f.name}</div>
                <div className="text-xs text-slate-500 mb-2">{f.desc}</div>
                <div className="text-xs text-amber-500/70 font-mono">{f.freq}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[
              { num: '10', unit: '年', label: '年份分析（2014–2023）' },
              { num: '120+', unit: '', label: '改寫練習題' },
              { num: '12', unit: '個', label: '核心思維框架' },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-4xl sm:text-5xl font-extrabold text-amber-400 mb-1">
                  {s.num}<span className="text-2xl">{s.unit}</span>
                </div>
                <div className="text-slate-500 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-12 px-4 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-8 text-slate-300">同學仔怎麼說</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                quote: '終於明白點解每年都係考同一嘢，改寫題幫我鞏固咗好多。',
                name: 'Marco L.',
                grade: '目標 5**',
              },
              {
                quote: '用完之後做 past paper，感覺好多題目都「見過」，但又係新嘅。',
                name: 'Rachel C.',
                grade: '目標 5*',
              },
              {
                quote: '即時批改同等級預測好有動力，做完一條已經想做下一條。',
                name: 'Jayden K.',
                grade: '目標 5',
              },
            ].map((t, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <p className="text-slate-400 text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div className="text-sm font-medium text-slate-200">{t.name}</div>
                <div className="text-xs text-amber-500">{t.grade}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUBJECTS ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
            目標涵蓋全部 HKDSE 科目
          </h2>
          <p className="text-slate-500 text-center mb-12">
            {activeSubjects.length} 科已上線——更多科目正用同一套方法論陸續改寫
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {activeSubjects.map((s) => (
              <Link
                key={s.id}
                href={`/subjects/${s.id}`}
                className="group bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-xl p-5 text-center transition-all"
              >
                <div className="text-3xl mb-2">{s.emoji}</div>
                <div className="font-semibold text-sm mb-1">{s.short}</div>
                <div className="text-[11px] text-green-400 flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" /> 已上線
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/subjects"
              className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
            >
              睇晒全部 {totalSubjects} 科路線圖 <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">準備好開始？</h2>
          <p className="text-slate-500 mb-8">第一批完全免費開放，無需登入即可練習</p>
          <Link
            href="/subjects/math"
            className="inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-black font-bold px-10 py-5 rounded-xl text-lg transition-all hover:scale-[1.02]"
          >
            開始數學練習 <ArrowRight size={22} />
          </Link>
          <p className="text-slate-600 text-sm mt-4">數學科 · 12 條練習題 · 即時批改 + 等級預測</p>
        </div>
      </section>
    </div>
  )
}
