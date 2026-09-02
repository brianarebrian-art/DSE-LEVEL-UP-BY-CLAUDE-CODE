'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Lock, CheckCircle2, Search, Printer } from 'lucide-react'
import {
  subjects,
  type SubjectMeta,
} from '@/data/subjects'
import { getSubjectQuestions } from '@/data/questions'
import { useLocale } from '@/lib/i18n'
import { bestSimilarity, FUZZY_THRESHOLD } from '@/lib/fuzzy'

// Tailwind needs literal class names, so map accents explicitly.
// 2026-09-02（規格 v4.0-B §1.3）：原本 16 隻高飽和 Tailwind 色收斂成六個
// 莫蘭迪家族。色值定義喺 globals.css --color-subj-*，跟主題走。
// 用途只係 hover 色彩編碼，唔載字，所以門檻係 3:1（圖形／UI 邊界）。
const accentRing: Record<string, string> = {
  sage: 'hover:border-subj-sage/50 hover:bg-subj-sage/5',
  moss: 'hover:border-subj-moss/50 hover:bg-subj-moss/5',
  mist: 'hover:border-subj-mist/50 hover:bg-subj-mist/5',
  clay: 'hover:border-subj-clay/50 hover:bg-subj-clay/5',
  rose: 'hover:border-subj-rose/50 hover:bg-subj-rose/5',
  stone: 'hover:border-subj-stone/50 hover:bg-subj-stone/5',
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

  // 2026-07-31：由「精確 includes」改為錯字容忍比對（藍圖功能 09 的前端版）。
  //
  // 原本打錯一個字就會得出「搵唔到符合嘅科目」—— 讀寫障礙學生往往因此以為
  // 平台冇呢一科而放棄。現時「數學」打成「數学」、「economics」打漏一個字母
  // 一樣搵得到。實作見 lib/fuzzy.ts（純函數、11 個測試覆蓋、零依賴）。
  const q = query.trim()
  const searchable = (s: SubjectMeta) => [s.name, s.nameEn, s.short, s.shortEn]
  const matches = (s: SubjectMeta) =>
    (!q || bestSimilarity(q, searchable(s)) >= FUZZY_THRESHOLD) &&
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
      className={`group relative bg-surface-raised border border-line rounded-xl p-5 transition-all ${accentRing[s.accent] ?? ''}`}
    >
      {/* 2026-08-21：呢度本來係一個「✓ 已上線」徽章。信譽審核 §5 指出「已上線」
          會被理解成全題型覆蓋 —— 而實情係 MC 有、書寫／口試／實作冇。
          改為顯示【真實題數】：一個具體數字唔會被過度詮釋，而且加減題會自動跟。 */}
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center gap-1 text-[10px] text-accent bg-surface-sunken border border-accent/20 px-2 py-0.5 rounded-full">
          <CheckCircle2 size={10} /> {getSubjectQuestions(s.id).length}
          {en ? ' MC' : ' 條 MC'}
        </span>
      </div>
      <div className="text-3xl mb-3">{s.emoji}</div>
      <div className="font-medium mb-1 text-ink">{name(s)}</div>
      <div className="text-xs text-ink-muted mb-2 leading-relaxed">{desc(s)}</div>
      <div className="text-[11px] text-ink-muted mb-3">
        {en ? 'Written / oral / practical: not covered' : '書寫、口試、實作：未涵蓋'}
      </div>
      <div className="flex items-center gap-1 text-sm text-accent font-medium">
        {tl.startPractice} <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  )

  const ComingSoonCard = ({ s }: { s: SubjectMeta }) => (
    <div className="relative bg-surface border border-line rounded-xl p-5 opacity-80">
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center gap-1 text-[10px] text-ink-muted bg-surface-sunken px-2 py-0.5 rounded-full">
          <Lock size={10} /> {s.launchDate ?? t.common.comingSoon}
        </span>
      </div>
      <div className="text-3xl mb-3 grayscale opacity-80">{s.emoji}</div>
      <div className="font-medium mb-1 text-ink-muted">{name(s)}</div>
      <div className="text-xs text-ink-muted leading-relaxed">{desc(s)}</div>
    </div>
  )

  return (
    <div className="min-h-screen px-4 py-12 bg-surface text-ink-soft">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="text-ink-muted text-sm mb-2 flex items-center gap-1">
            <Link href="/" className="hover:text-accent">{t.common.home}</Link>
            <span>/</span>
            <span>{tl.title}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-medium mb-3 text-ink">{tl.title}</h1>
          <p className="text-ink-muted text-lg max-w-2xl">
            {tl.introA}
            <span className="text-accent">{activeCount}{tl.introLiveA}</span>{tl.introB}
          </p>
          {/* 紙筆戰士 2026-08-21 由頂部導覽降級落嚟。佢係一種【練習模式】
              （生成可打印 A4 卷），結構上屬於呢個 hub，唔係「進度」「收藏」嘅同級物。
              降級唔等於收埋 —— 呢度同 Footer 練習欄各有一個入口。 */}
          <Link
            href="/paper-warrior"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl border border-line-strong bg-surface-raised px-4 text-sm text-ink-soft transition-colors hover:border-accent/40 hover:text-accent"
          >
            <Printer size={15} aria-hidden />
            {t.nav.paper}
          </Link>
        </div>

        {/* Roadmap progress bar */}
        <div className="bg-surface-raised border border-line rounded-2xl p-5 mb-12">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-ink-muted">{tl.progressLabel}</span>
            <span className="text-accent font-medium">
              {activeCount} / {subjects.length}{tl.progressUnit}
            </span>
          </div>
          <div className="h-2 bg-line rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-violet rounded-full"
              style={{ width: `${(activeCount / subjects.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-ink-muted mt-3">
            {tl.strategy}
          </p>
        </div>

        {/* Controls: search + sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={en ? 'Search subjects…' : '搜尋科目…'}
              className="w-full bg-surface-raised border border-line-strong rounded-xl pl-9 pr-3 py-2.5 text-sm text-ink-soft placeholder-ink-muted focus:border-accent/50 focus:outline-none"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as 'default' | 'az' | 'live')}
            className="bg-surface-raised border border-line-strong rounded-xl px-3 py-2.5 text-sm text-ink-soft focus:border-accent/50 focus:outline-none"
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
                  ? 'bg-surface-sunken text-accent border-accent/40'
                  : 'bg-surface-raised text-ink-muted border-line-strong hover:text-accent'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* No results */}
        {totalMatched === 0 && (
          <div className="text-center py-16 text-ink-muted">
            <div className="text-4xl mb-3">🔍</div>
            <p className="mb-4">{en ? 'No subjects match your search.' : '搵唔到符合嘅科目。'}</p>
            <button
              type="button"
              onClick={() => { setQuery(''); setCategory('all') }}
              className="text-sm text-accent hover:underline"
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
        <div className="mt-16 bg-surface-sunken border border-line rounded-2xl p-6 text-center">
          <p className="text-ink-soft mb-2">{tl.footerTitle}</p>
          <p className="text-sm text-ink-muted mb-4">
            {tl.footerBody}
          </p>
          <a
            href="mailto:dselevelup@gmail.com"
            className="inline-flex items-center gap-2 text-sm bg-surface-raised hover:bg-surface-sunken border border-line-strong text-ink-soft px-4 py-2 rounded-xl transition-all"
          >
            {tl.footerBtn}
          </a>
        </div>
      </div>
    </div>
  )
}
