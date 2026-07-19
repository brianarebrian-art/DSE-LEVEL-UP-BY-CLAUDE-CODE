'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Lock, CheckCircle2, Search } from 'lucide-react'
import {
  subjects,
  type SubjectMeta,
} from '@/data/subjects'
import { useLocale } from '@/lib/i18n'

// Tailwind needs literal class names, so map accents explicitly.
// Light-first（憲章 §3）：每科保留自己嘅 hover accent 作色彩編碼（hover-only 淡色調，on-white 讀得清）。
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

export default function SubjectsView() {
  const { t, locale } = useLocale()
  const tl = t.subjectsList
  const activeCount = subjects.filter((s) => s.isActive).length
  const name = (s: SubjectMeta) => (locale === 'en' ? s.nameEn : s.name)
  const desc = (s: SubjectMeta) => (locale === 'en' ? s.descriptionEn : s.description)
  const en = locale === 'en'

  // Search / category / sort — over the single free, open subject grid.
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'all' | 'core' | 'extended' | 'elective'>('all')
  const [sort, setSort] = useState<'default' | 'az' | 'live'>('default')

  const q = query.trim().toLowerCase()
  const matches = (s: SubjectMeta) =>
    (!q || [s.name, s.nameEn, s.short, s.shortEn].some((v) => v.toLowerCase().includes(q))) &&
    (category === 'all' || s.category === category)
  const sortGroup = (group: SubjectMeta[]) => {
    if (sort === 'az') return [...group].sort((a, b) => name(a).localeCompare(name(b)))
    if (sort === 'live') return [...group].sort((a, b) => Number(b.isActive) - Number(a.isActive))
    return group
  }
  const totalMatched = subjects.filter(matches).length

  const ActiveCard = ({ s }: { s: SubjectMeta }) => (
    <Link
      href={`/subjects/${s.id}`}
      className={`group relative bg-white border border-black/[0.06] rounded-xl p-5 transition-all ${accentRing[s.accent] ?? ''}`}
    >
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center gap-1 text-[10px] text-[#008B84] bg-[#008B84]/10 border border-[#008B84]/20 px-2 py-0.5 rounded-full">
          <CheckCircle2 size={10} /> {t.common.live}
        </span>
      </div>
      <div className="text-3xl mb-3">{s.emoji}</div>
      <div className="font-medium mb-1 text-[#1A1A1A]">{name(s)}</div>
      <div className="text-xs text-[#6B6B6B] mb-3 leading-relaxed">{desc(s)}</div>
      <div className="flex items-center gap-1 text-sm text-[#008B84] font-medium">
        {tl.startPractice} <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  )

  const ComingSoonCard = ({ s }: { s: SubjectMeta }) => (
    <div className="relative bg-[#F7F7F3] border border-black/[0.05] rounded-xl p-5 opacity-80">
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center gap-1 text-[10px] text-[#9CA3AF] bg-[#EDEDE8] px-2 py-0.5 rounded-full">
          <Lock size={10} /> {s.launchDate ?? t.common.comingSoon}
        </span>
      </div>
      <div className="text-3xl mb-3 grayscale opacity-80">{s.emoji}</div>
      <div className="font-medium mb-1 text-[#6B6B6B]">{name(s)}</div>
      <div className="text-xs text-[#9CA3AF] leading-relaxed">{desc(s)}</div>
    </div>
  )

  return (
    <div className="min-h-screen px-4 py-12 bg-[#FAFAF8] text-[#2D2D2D]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="text-[#6B6B6B] text-sm mb-2 flex items-center gap-1">
            <Link href="/" className="hover:text-[#008B84]">{t.common.home}</Link>
            <span>/</span>
            <span>{tl.title}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-medium mb-3 text-[#1A1A1A]">{tl.title}</h1>
          <p className="text-[#6B6B6B] text-lg max-w-2xl">
            {tl.introA}
            <span className="text-[#008B84]">{activeCount}{tl.introLiveA}</span>{tl.introB}
          </p>
        </div>

        {/* Roadmap progress bar */}
        <div className="bg-white border border-black/[0.06] rounded-2xl p-5 mb-12">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-[#6B6B6B]">{tl.progressLabel}</span>
            <span className="text-[#008B84] font-medium">
              {activeCount} / {subjects.length}{tl.progressUnit}
            </span>
          </div>
          <div className="h-2 bg-black/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#008B84] to-[#7C3AED] rounded-full"
              style={{ width: `${(activeCount / subjects.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-[#9CA3AF] mt-3">
            {tl.strategy}
          </p>
        </div>

        {/* Controls: search + sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={en ? 'Search subjects…' : '搜尋科目…'}
              className="w-full bg-white border border-black/[0.10] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[#2D2D2D] placeholder-[#9CA3AF] focus:border-[#008B84]/50 focus:outline-none"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as 'default' | 'az' | 'live')}
            className="bg-white border border-black/[0.10] rounded-xl px-3 py-2.5 text-sm text-[#2D2D2D] focus:border-[#008B84]/50 focus:outline-none"
          >
            <option value="default">{en ? 'Default order' : '預設排序'}</option>
            <option value="az">{en ? 'Name A–Z' : '名稱 A–Z'}</option>
            <option value="live">{en ? 'Live first' : '已上線優先'}</option>
          </select>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {([
            ['all', en ? 'All' : '全部'],
            ['core', en ? 'Core' : '核心'],
            ['extended', en ? 'Extended (M1·M2)' : '延伸 M1·M2'],
            ['elective', en ? 'Elective' : '選修'],
          ] as const).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setCategory(val)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                category === val
                  ? 'bg-[#008B84]/12 text-[#008B84] border-[#008B84]/40'
                  : 'bg-white text-[#6B6B6B] border-black/[0.10] hover:text-[#008B84]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* No results */}
        {totalMatched === 0 && (
          <div className="text-center py-16 text-[#6B6B6B]">
            <div className="text-4xl mb-3">🔍</div>
            <p className="mb-4">{en ? 'No subjects match your search.' : '搵唔到符合嘅科目。'}</p>
            <button
              type="button"
              onClick={() => { setQuery(''); setCategory('all') }}
              className="text-sm text-[#008B84] hover:underline"
            >
              {en ? 'Clear filters' : '清除篩選'}
            </button>
          </div>
        )}

        {/* One flat grid — every subject is free and open to everyone. */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortGroup(subjects.filter(matches)).map((s) =>
            s.isActive ? (
              <ActiveCard key={s.id} s={s} />
            ) : (
              <ComingSoonCard key={s.id} s={s} />
            )
          )}
        </div>

        {/* Footer note */}
        <div className="mt-16 bg-[#F5F5F0] border border-black/[0.06] rounded-2xl p-6 text-center">
          <p className="text-[#2D2D2D] mb-2">{tl.footerTitle}</p>
          <p className="text-sm text-[#6B6B6B] mb-4">
            {tl.footerBody}
          </p>
          <a
            href="mailto:dselevelup@gmail.com"
            className="inline-flex items-center gap-2 text-sm bg-white hover:bg-[#F5F5F0] border border-black/[0.12] text-[#2D2D2D] px-4 py-2 rounded-xl transition-all"
          >
            {tl.footerBtn}
          </a>
        </div>
      </div>
    </div>
  )
}
