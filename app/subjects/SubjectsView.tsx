'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Lock, CheckCircle2, Search, Printer } from 'lucide-react'
import {
  subjects,
  type SubjectMeta,
} from '@/data/subjects'
import { SUBJECT_SUMMARY } from '@/data/questions/summary.generated'
import { useLocale } from '@/lib/i18n'
import { searchSubjects } from '@/lib/subjectSearch'
import { quickStartHref, recentSubjectIds } from '@/lib/quickStart'
import { loadAttempts } from '@/lib/progress'
import { SESSION_SIZE } from '@/lib/entitlements'

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
  // 每科書寫題數的範圍，由題庫摘要計（LOOP 24）：有些科目只有十條左右，不能只說「有書寫題」。
  const written = subjects.filter((s) => s.isActive).map((s) => SUBJECT_SUMMARY[s.id]?.written ?? 0)
  const writtenMin = written.length ? Math.min(...written) : 0
  const writtenMax = written.length ? Math.max(...written) : 0
  const name = (s: SubjectMeta) => (locale === 'en' ? s.nameEn : s.name)
  const desc = (s: SubjectMeta) => (locale === 'en' ? s.descriptionEn : s.description)
  const en = locale === 'en'

  // 最近練過的科目（UX 循環 LOOP 16）：只讀本機現有的練習紀錄，掛載後才讀，避免 SSR 不一致。
  const [recent, setRecent] = useState<SubjectMeta[]>([])
  useEffect(() => {
    const live = (id: string) => subjects.some((s) => s.id === id && s.isActive)
    setRecent(recentSubjectIds(loadAttempts(), live).map((id) => subjects.find((s) => s.id === id)!))
  }, [])

  // Search / category / sort — over the single free, open subject grid.
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'all' | 'core' | 'extended' | 'elective'>('all')
  const [sort, setSort] = useState<'default' | 'az' | 'live'>('default')

  // 2026-07-31：由「精確 includes」改為錯字容忍比對（藍圖功能 09 的前端版）。
  //
  // 原本打錯一個字就會得出「搵唔到符合嘅科目」—— 讀寫障礙學生往往因此以為
  // 平台冇呢一科而放棄。現時「數學」打成「數学」、「economics」打漏一個字母
  // 一樣搵得到。實作見 lib/fuzzy.ts（純函數、11 個測試覆蓋、零依賴）。
  //
  // 2026-09-30（UX 循環 LOOP 9）：加入學生常用簡稱（通識、電腦、家政、TL、Chem…），並在
  // 預設排序下按相關度排列，完全吻合簡稱的科目排第一。實測及別名表見 lib/subjectSearch.ts。
  const q = query.trim()
  const inCategory = (s: SubjectMeta) => category === 'all' || s.category === category
  const matched = searchSubjects(subjects, q).filter(inCategory)
  const sortGroup = (group: SubjectMeta[]) => {
    if (sort === 'az') return [...group].sort((a, b) => name(a).localeCompare(name(b)))
    if (sort === 'live') return [...group].sort((a, b) => Number(b.isActive) - Number(a.isActive))
    return group
  }
  const totalMatched = matched.length

  const ActiveCard = ({ s }: { s: SubjectMeta }) => {
    // 2026-08-21：呢度本來係一個「✓ 已上線」徽章。信譽審核 §5 指出「已上線」
    // 會被理解成全題型覆蓋。改為顯示【真實題數】：一個具體數字唔會被過度詮釋，
    // 而且加減題會自動跟。
    //
    // 2026-09-05 修正兩處：
    //   ① 個徽章本來寫 `getSubjectQuestions(s.id).length` 然後標「條 MC」，但
    //      呢個函數返嘅係【全部題型】。數學實測 1539 條入面得 1509 條係 MC，
    //      即係個數字每次都連書寫題一齊報做 MC。而家先 filter 再數。
    //   ② 書寫題覆蓋率本來寫死一句「未涵蓋」，但數學／中文／歷史已經有書寫題
    //      入咗庫。寫死嘅句子唔會跟住數據行 —— 一句喺三科身上已經係假嘅話，
    //      同一句喺其餘廿二科身上就算啱都唔應該再信。改為逐科由實數推。
  //   ③ 2026-09-05 再改：數字由 summary.generated 攞，唔再 import barrel。
  //      呢一頁本來為咗顯示 25 個題數，將全 25 科題庫 build 咗入瀏覽器
  //      （實測 28 個題庫 chunk）。數字完全一樣 —— summary 由題庫產生，
  //      而 summary-parity 測試每次 npm test 拎真題庫重算比對。
    const { mc, written } = SUBJECT_SUMMARY[s.id] ?? { mc: 0, written: 0 }
    // 2026-09-30（UX 循環 LOOP 5）：卡的底部原本寫「開始練習」，但整張卡只連去科目頁，
    // 學生要在科目頁再撳一次「立即開始」。現在分成兩個連結：
    //   ① 科目名稱 —— 延伸覆蓋整張卡（after:inset-0），去科目頁，行為與以前相同；
    //   ② 「開始 10 題」—— 疊在最上層，直接開始一節（與首頁快速開始同一條 URL）。
    // 不可把 ② 放在 ① 之內：連結不能巢狀，讀屏亦會讀成一條。
    return (
      <div className={`group relative flex flex-col bg-surface-raised border border-line rounded-xl p-5 transition-all ${accentRing[s.accent] ?? ''}`}>
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 text-[10px] text-accent bg-surface-sunken border border-accent/20 px-2 py-0.5 rounded-full">
            <CheckCircle2 size={10} /> {mc}
            {en ? ' MC' : ' 條 MC'}
          </span>
        </div>
        <div className="text-3xl mb-3" aria-hidden>{s.emoji}</div>
        <h2 className="font-medium mb-1 text-ink">
          <Link
            href={`/subjects/${s.id}`}
            className="after:absolute after:inset-0 after:rounded-xl after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-accent"
          >
            {name(s)}
          </Link>
        </h2>
        <div className="text-xs text-ink-muted mb-2 leading-relaxed">{desc(s)}</div>
        <div className="text-[11px] text-ink-muted mb-3">
          {written > 0
            ? en
              ? `Written: ${written} · oral / practical: not covered`
              : `書寫 ${written} 條 · 口試、實作：未涵蓋`
            : en
              ? 'Written / oral / practical: not covered'
              : '書寫、口試、實作：未涵蓋'}
        </div>
        <div className="mt-auto flex items-center justify-between gap-3">
          <Link
            href={quickStartHref(s.id)}
            aria-label={en ? `${s.nameEn}: start ${SESSION_SIZE} questions` : `${s.name}：開始 ${SESSION_SIZE} 題`}
            className="relative z-10 inline-flex min-h-12 items-center gap-1 rounded-xl bg-accent-strong px-4 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {en ? `Start ${SESSION_SIZE} questions` : `開始 ${SESSION_SIZE} 題`} <ArrowRight size={14} aria-hidden />
          </Link>
          <span aria-hidden className="text-xs text-ink-muted group-hover:text-accent transition-colors">
            {en ? 'Topics & papers ›' : '課題及卷別 ›'}
          </span>
        </div>
      </div>
    )
  }

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
        <div className="mb-6">
          <div className="text-ink-muted text-sm mb-2 flex items-center gap-1">
            <Link href="/" className="hover:text-accent">{t.common.home}</Link>
            <span>/</span>
            <span>{tl.title}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-medium mb-3 text-ink">{tl.title}</h1>
          {/* 手機用 text-sm：英文介紹比中文長一行，回訪學生多了「最近練過」一行時，
              第一張卡的「開始 10 題」會落到左下無障礙掣之下（375×812 實測 y=700–748）。 */}
          <p className="text-ink-muted text-sm sm:text-lg max-w-2xl">
            {tl.introA}
            <span className="text-accent">{activeCount}{tl.introLiveA}</span>
            {writtenMax > 0 && <>{tl.introWrittenA}{writtenMin}{tl.introWrittenB}{writtenMax}{tl.introWrittenC}</>}
            {tl.introB}
          </p>
        </div>

        {/* 2026-09-05：「內容生產進度」進度條喺呢度剷走。
            佢一直顯示 25 / 25，即係一條永遠滿格嘅進度條 —— 25 科全部有題目，
            冇嘢仲喺度「生產緊」。真正未齊嘅係【個別課題】同【書寫題】，
            而嗰兩樣喺呢條科目層級嘅進度條上面永遠見唔到。
            一個永遠滿格嘅指標唔係報平安，係量錯咗嘢。
            覆蓋率而家逐科顯示（見 ActiveCard），跟實數行。 */}

        {/* 最近練過：回訪學生毋須搜尋或捲動，直接再開一節。初次訪客沒有紀錄，這一行不出現。 */}
        {recent.length > 0 && (
          <section aria-labelledby="recent-subjects" className="mb-5">
            {/* 標題只給讀屏；可見的「最近練過」與科目放同一行。375×812 實測，標題獨佔一行時，
                第一張卡的「開始 10 題」會被推到左下無障礙掣之下。 */}
            <h2 id="recent-subjects" className="sr-only">
              {en ? `Practised recently: start ${SESSION_SIZE} questions` : `最近練過：直接開始 ${SESSION_SIZE} 題`}
            </h2>
            <ul className="flex flex-wrap items-center gap-2">
              <li aria-hidden className="text-sm text-ink-muted">{en ? 'Recent' : '最近練過'}</li>
              {recent.map((s) => (
                <li key={s.id}>
                  <Link
                    href={quickStartHref(s.id)}
                    aria-label={en ? `${s.nameEn}: start ${SESSION_SIZE} questions` : `${s.name}：開始 ${SESSION_SIZE} 題`}
                    className="inline-flex min-h-12 items-center gap-1.5 rounded-xl border border-accent/40 bg-surface-raised px-3 text-sm font-medium text-ink transition-colors hover:border-accent"
                  >
                    <span aria-hidden>{s.emoji}</span>
                    {en ? s.shortEn : s.short}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Controls: search + sort */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              aria-label={en ? 'Search subjects, e.g. Chem, ICT, 通識' : '搜尋科目，例如：數學、Chem、通識'}
              placeholder={en ? 'Search subjects…' : '搜尋科目…'}
              className="w-full bg-surface-raised border border-line-strong rounded-xl pl-9 pr-3 py-2.5 text-sm text-ink-soft placeholder-ink-muted focus:border-accent/50 focus:outline-none"
            />
          </div>
          <select
            aria-label={en ? 'Sort subjects' : '科目排序'}
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
        <div className="flex gap-2 mb-6 flex-wrap">
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
          {sortGroup(matched).map((s) =>
            s.isActive ? (
              <ActiveCard key={s.id} s={s} />
            ) : (
              <ComingSoonCard key={s.id} s={s} />
            )
          )}
        </div>

        {/* 紙筆戰士 2026-08-21 由頂部導覽降級落嚟。佢係一種【練習模式】
            （生成可打印 A4 卷），結構上屬於呢個 hub，唔係「進度」「收藏」嘅同級物。
            降級唔等於收埋 —— 呢度同 Footer 練習欄各有一個入口。
            2026-09-30（UX 循環 LOOP 5）：由標題下方移到科目列表之後，令手機首屏先見到科目。 */}
        <Link
          href="/paper-warrior"
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-xl border border-line-strong bg-surface-raised px-4 text-sm text-ink-soft transition-colors hover:border-accent/40 hover:text-accent"
        >
          <Printer size={15} aria-hidden />
          {t.nav.paper}
          {en ? ' (A4, pen and paper)' : '（A4，用紙筆做）'}
        </Link>

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
