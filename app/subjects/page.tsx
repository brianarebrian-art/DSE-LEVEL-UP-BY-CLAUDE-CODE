import Link from 'next/link'
import { ArrowRight, Lock, CheckCircle2 } from 'lucide-react'
import {
  subjects,
  priorityLabels,
  priorityOrder,
  type SubjectMeta,
} from '@/data/subjects'

export const metadata = {
  title: '科目總覽 | DSE Level Up',
  description: '涵蓋所有 HKDSE 科目的改寫版練習——核心科目已上線，其餘陸續推出。',
}

// Tailwind needs literal class names, so map accents explicitly.
const accentRing: Record<string, string> = {
  amber: 'hover:border-amber-500/50 hover:bg-amber-500/5',
  cyan: 'hover:border-cyan-500/50 hover:bg-cyan-500/5',
  sky: 'hover:border-sky-500/50 hover:bg-sky-500/5',
  violet: 'hover:border-violet-500/50 hover:bg-violet-500/5',
  emerald: 'hover:border-emerald-500/50 hover:bg-emerald-500/5',
  green: 'hover:border-green-500/50 hover:bg-green-500/5',
  rose: 'hover:border-rose-500/50 hover:bg-rose-500/5',
  red: 'hover:border-red-500/50 hover:bg-red-500/5',
  blue: 'hover:border-blue-500/50 hover:bg-blue-500/5',
  orange: 'hover:border-orange-500/50 hover:bg-orange-500/5',
  teal: 'hover:border-teal-500/50 hover:bg-teal-500/5',
  pink: 'hover:border-pink-500/50 hover:bg-pink-500/5',
  fuchsia: 'hover:border-fuchsia-500/50 hover:bg-fuchsia-500/5',
  indigo: 'hover:border-indigo-500/50 hover:bg-indigo-500/5',
  slate: 'hover:border-slate-500/50 hover:bg-slate-500/5',
  lime: 'hover:border-lime-500/50 hover:bg-lime-500/5',
}

function ActiveCard({ s }: { s: SubjectMeta }) {
  return (
    <Link
      href={`/subjects/${s.id}`}
      className={`group relative bg-slate-900 border border-slate-800 rounded-xl p-5 transition-all ${accentRing[s.accent] ?? ''}`}
    >
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">
          <CheckCircle2 size={10} /> 已上線
        </span>
      </div>
      <div className="text-3xl mb-3">{s.emoji}</div>
      <div className="font-bold mb-1">{s.name}</div>
      <div className="text-xs text-slate-500 mb-3 leading-relaxed">{s.description}</div>
      <div className="flex items-center gap-1 text-sm text-amber-400 font-medium">
        開始練習 <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  )
}

function ComingSoonCard({ s }: { s: SubjectMeta }) {
  return (
    <div className="relative bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 opacity-70">
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
          <Lock size={10} /> {s.launchDate ?? '即將推出'}
        </span>
      </div>
      <div className="text-3xl mb-3 grayscale opacity-80">{s.emoji}</div>
      <div className="font-bold mb-1 text-slate-300">{s.name}</div>
      <div className="text-xs text-slate-600 leading-relaxed">{s.description}</div>
    </div>
  )
}

export default function SubjectsPage() {
  const activeCount = subjects.filter((s) => s.isActive).length

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="text-slate-500 text-sm mb-2 flex items-center gap-1">
            <Link href="/" className="hover:text-slate-300">首頁</Link>
            <span>/</span>
            <span>科目總覽</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">科目總覽</h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            目標涵蓋全部 HKDSE 科目。我哋按考生人數同改寫難度排優先級——
            <span className="text-amber-400">{activeCount} 科已上線</span>，其餘陸續推出。
          </p>
        </div>

        {/* Roadmap progress bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-12">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">內容生產進度</span>
            <span className="text-amber-400 font-medium">
              {activeCount} / {subjects.length} 科
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
              style={{ width: `${(activeCount / subjects.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-600 mt-3">
            策略：先上線數學 + 理科，用 AI 輔助改寫加速生產，其餘科目按優先級逐步補上。
          </p>
        </div>

        {/* Grouped by priority */}
        <div className="space-y-12">
          {priorityOrder.map((p) => {
            const group = subjects.filter((s) => s.priority === p)
            if (group.length === 0) return null
            const info = priorityLabels[p]
            return (
              <section key={p}>
                <div className="mb-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded">
                      {p}
                    </span>
                    {info.label.replace(`${p} · `, '')}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">{info.desc}</p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.map((s) =>
                    s.isActive ? (
                      <ActiveCard key={s.id} s={s} />
                    ) : (
                      <ComingSoonCard key={s.id} s={s} />
                    )
                  )}
                </div>
              </section>
            )
          })}
        </div>

        {/* Footer note */}
        <div className="mt-16 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center">
          <p className="text-slate-400 mb-2">想優先睇到某科？</p>
          <p className="text-sm text-slate-600 mb-4">
            話我哋知你考緊邊科，我哋會調整生產優先級。
          </p>
          <a
            href="mailto:brianarebrian@gmail.com"
            className="inline-flex items-center gap-2 text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-xl transition-all"
          >
            告訴我哋你想要嘅科目
          </a>
        </div>
      </div>
    </div>
  )
}
