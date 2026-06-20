'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getActiveSubjects, type SubjectMeta } from '@/data/subjects'
import type { Topic } from '@/data/questions'
import { useLocale } from '@/lib/i18n'

export default function SubjectDetailView({
  meta,
  questionsCount,
  topics,
}: {
  meta: SubjectMeta
  questionsCount: number
  topics: Topic[]
}) {
  const { t, locale } = useLocale()
  const sd = t.subjectDetail
  const en = locale === 'en'
  const name = en ? meta.nameEn : meta.name
  const short = en ? meta.shortEn : meta.short
  const description = en ? meta.descriptionEn : meta.description

  // Subject exists but has no live content yet → coming soon view.
  if (!meta.isActive || questionsCount === 0) {
    return (
      <div className="min-h-screen px-4 py-20">
        <div className="max-w-xl mx-auto text-center">
          <div className="text-6xl mb-6">{meta.emoji}</div>
          <h1 className="text-3xl font-extrabold mb-3">{name}</h1>
          <p className="text-slate-400 mb-2">{description}</p>
          <div className="inline-flex items-center gap-2 text-sm text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-full px-4 py-2 mt-4">
            {sd.launchPrefix}{meta.launchDate ?? sd.launchTBA}
          </div>
          <div className="mt-8">
            <Link
              href="/subjects"
              className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-3 rounded-xl transition-all text-sm"
            >
              ← {sd.backToSubjects}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const totalMarks = questionsCount
  const activeShortNames = getActiveSubjects()
    .map((s) => (en ? s.shortEn : s.short))
    .join(en ? ', ' : '、')

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="text-slate-500 text-sm mb-2 flex items-center gap-1">
          <Link href="/" className="hover:text-slate-300">{t.common.home}</Link>
          <span>/</span>
          <Link href="/subjects" className="hover:text-slate-300">{t.common.subjects}</Link>
          <span>/</span>
          <span>{short}</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 flex items-center gap-3">
            <span>{meta.emoji}</span>
            {name}
          </h1>
          <p className="text-slate-400 text-lg">{description}</p>
        </div>

        {/* Quick start banner */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-lg mb-1">{sd.quickStartTitle}</div>
            <p className="text-slate-400 text-sm">
              {questionsCount}{sd.quickDescA}{topics.length}{sd.quickDescB}
            </p>
            <div className="flex gap-3 mt-2 text-xs text-slate-500 flex-wrap">
              <span>{sd.minutesAbout}{Math.max(5, Math.round(questionsCount * 1.5))}{sd.minutesUnit}</span>
              <span>·</span>
              <span>{sd.gradePredict}</span>
              <span>·</span>
              <span>{sd.fullMarksA}{totalMarks}{sd.fullMarksB}</span>
            </div>
          </div>
          <Link
            href={`/practice?subject=${meta.id}`}
            className="shrink-0 inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-all"
          >
            {sd.startNow} <ArrowRight size={16} />
          </Link>
        </div>

        {/* Topic list */}
        <h2 className="text-lg font-bold mb-4 text-slate-300">{sd.byTopic}</h2>
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
                  <div className="font-semibold mb-0.5">{en ? (topic.en ?? topic.zh) : topic.zh}</div>
                  <div className="text-xs text-slate-500">
                    {sd.topicFwPrefix}{en ? (topic.frameworkEn ?? topic.framework) : topic.framework}{sd.topicCountA}{topic.count}{sd.topicCountB}
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
            <div className="font-medium text-sm mb-0.5">{sd.crossTitle}</div>
            <div className="text-xs text-slate-500">{activeShortNames}{sd.crossLiveSuffix}</div>
          </div>
          <Link
            href="/subjects"
            className="shrink-0 text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            {sd.crossAll} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
