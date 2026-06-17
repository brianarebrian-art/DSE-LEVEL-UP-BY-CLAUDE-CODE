import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { getSubject, getActiveSubjects } from '@/data/subjects'
import { getSubjectQuestions, getSubjectTopics } from '@/data/questions'

const activeShortNames = getActiveSubjects()
  .map((s) => s.short)
  .join('、')

// Pre-render the active subject routes at build time.
export function generateStaticParams() {
  return getActiveSubjects().map((s) => ({ subject: s.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string }>
}) {
  const { subject } = await params
  const meta = getSubject(subject)
  if (!meta) return { title: '科目 | DSE Level Up' }
  return {
    title: `${meta.name} | DSE Level Up`,
    description: meta.description,
  }
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>
}) {
  const { subject } = await params
  const meta = getSubject(subject)

  if (!meta) notFound()

  const questions = getSubjectQuestions(subject)
  const topics = getSubjectTopics(subject)

  // Subject exists but has no live content yet → coming soon view.
  if (!meta.isActive || questions.length === 0) {
    return (
      <div className="min-h-screen px-4 py-20">
        <div className="max-w-xl mx-auto text-center">
          <div className="text-6xl mb-6">{meta.emoji}</div>
          <h1 className="text-3xl font-extrabold mb-3">{meta.name}</h1>
          <p className="text-slate-400 mb-2">{meta.description}</p>
          <div className="inline-flex items-center gap-2 text-sm text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-2 mt-4">
            預計上線：{meta.launchDate ?? '稍後公佈'}
          </div>
          <div className="mt-8">
            <Link
              href="/subjects"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-3 rounded-xl transition-all text-sm"
            >
              ← 返回科目總覽
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const totalMarks = questions.length

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-slate-500 text-sm mb-2 flex items-center gap-1">
          <Link href="/" className="hover:text-slate-300">首頁</Link>
          <span>/</span>
          <Link href="/subjects" className="hover:text-slate-300">科目</Link>
          <span>/</span>
          <span>{meta.short}</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 flex items-center gap-3">
            <span>{meta.emoji}</span>
            {meta.name}
          </h1>
          <p className="text-slate-400 text-lg">{meta.description}</p>
        </div>

        {/* Quick start banner */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-lg mb-1">綜合練習（推薦入手）</div>
            <p className="text-slate-400 text-sm">
              {questions.length} 條題目，涵蓋全部 {topics.length} 大課題 · 即時批改 · 等級預測
            </p>
            <div className="flex gap-3 mt-2 text-xs text-slate-500 flex-wrap">
              <span>⏱ 約 {Math.max(5, Math.round(questions.length * 1.5))} 分鐘</span>
              <span>·</span>
              <span>📊 即時等級預測</span>
              <span>·</span>
              <span>🎯 {totalMarks} 分滿分</span>
            </div>
          </div>
          <Link
            href={`/practice?subject=${meta.id}`}
            className="shrink-0 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-all"
          >
            立即開始 <ArrowRight size={16} />
          </Link>
        </div>

        {/* Topic list */}
        <h2 className="text-lg font-bold mb-4 text-slate-300">按課題練習</h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-12">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              href={`/practice?subject=${meta.id}&topic=${topic.id}`}
              className="group bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 rounded-xl p-5 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">{topic.emoji}</div>
                <div>
                  <div className="font-semibold mb-0.5">{topic.zh}</div>
                  <div className="text-xs text-slate-500">
                    框架：{topic.framework} · {topic.count} 條題目
                  </div>
                </div>
              </div>
              <svg
                className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>

        {/* Cross-link to other subjects */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <div className="font-medium text-sm mb-0.5">想練其他科？</div>
            <div className="text-xs text-slate-500">{activeShortNames}已上線，更多陸續推出</div>
          </div>
          <Link
            href="/subjects"
            className="shrink-0 text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            全部科目 <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
