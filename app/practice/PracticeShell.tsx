'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useLocale, useT } from '@/lib/i18n'
import PracticeGate from './PracticeGate'
import { parseCause } from '@/lib/causeMode'
import PracticeSupport from '@/components/PracticeSupport'
// NTM 溫柔二次確認：開咗「今晚唔溫得」入嚟會先問一次（零強制，確認即放行）
import NotTonightGate from '@/components/NotTonightGate'
import { ArrowRight } from 'lucide-react'

// 2026-07-29：由 `page.tsx` 原封不動搬過嚟。搬遷原因見 page.tsx 檔首註釋 ——
// page.tsx 本身要變返 server component 先有伺服器端內容俾爬蟲讀，
// 而本檔所有互動邏輯（鎖死引擎／錯因自診／NTM／SEN 支援）維持不變。

function LoadingScreen() {
  const t = useT()
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface text-ink-muted">{t.common.loading}</div>
  )
}

/** Nielsen H5／H2：冇 ?subject= 時唔默認數學——避免「開始練習」靜默開錯科。 */
function MissingSubject() {
  const { locale } = useLocale()
  const en = locale === 'en'
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center bg-surface text-ink-soft">
      <h1 className="text-xl font-medium text-ink">
        {en ? 'Pick a subject to start' : '先揀一科再開始'}
      </h1>
      <p className="max-w-sm text-sm leading-relaxed text-ink-muted">
        {en
          ? 'Practice needs a subject. Choose one from the list, or continue where you left off.'
          : '練習要指定科目。去科目總覽揀一科，或者由「開始練習」接返上次。'}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/subjects"
          className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-accent-strong px-5 text-sm font-medium text-on-accent transition-[colors,transform] duration-100 hover:bg-accent-hover active:scale-[0.97]"
        >
          {en ? 'All subjects' : '科目總覽'} <ArrowRight size={16} aria-hidden />
        </Link>
        <Link
          href="/start"
          className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-line-strong px-5 text-sm text-ink-soft transition-colors hover:bg-surface-sunken"
        >
          {en ? 'Continue / start' : '繼續／開始練習'}
        </Link>
      </div>
    </div>
  )
}

function PracticeRouter() {
  const params = useSearchParams()
  const subjectId = params.get('subject')
  const topicFilter = params.get('topic')
  // `long` = 書寫題獨立卷（決策 ②）。同 MC 卷完全分開，唔共用 sessionSize。
  const rawMode = params.get('mode')
  // `cause` = practise by self-diagnosed error cause (UX audit F1, lib/causeMode.ts).
  // Without a valid ?cause= it is an ordinary session.
  const cause = parseCause(params.get('cause'))
  const mode =
    rawMode === 'weakness' ? 'weakness' : rawMode === 'long' ? 'long' : rawMode === 'cause' && cause ? 'cause' : 'normal'
  // C6「只做 1 題」：唯一支援嘅細卷尺寸。刻意唔開放任意數字 ——
  // 呢個入口存在嘅意義係「門檻低到冇得再低」，唔係一個自訂長度功能。
  const size = params.get('size') === '1' ? 1 : undefined

  if (!subjectId) return <MissingSubject />

  // Re-mount the gate (and the session beneath it) whenever subject/topic/mode changes.
  return (
    <PracticeGate
      key={`${subjectId}|${topicFilter ?? ''}|${mode}|${cause ?? ''}|${size ?? ''}`}
      subjectId={subjectId}
      topicFilter={topicFilter}
      mode={mode}
      cause={mode === 'cause' ? cause : null}
      sessionSize={size}
    />
  )
}

export default function PracticeShell() {
  return (
    <>
      <Suspense fallback={<LoadingScreen />}>
        <NotTonightGate>
          <PracticeRouter />
        </NotTonightGate>
      </Suspense>
      {/* 支援小隊：唞一唞（4-7-8 呼吸）+ 易讀字體切換。防跳行閱讀尺已改為全站常駐（見 layout） */}
      <PracticeSupport />
    </>
  )
}
