'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useLocale, useT } from '@/lib/i18n'
import { loadAttempts } from '@/lib/progress'
import { getSubject } from '@/data/subjects'
import { SESSION_SIZE } from '@/lib/entitlements'
import { loadSubjectMCQuestions, loadWrittenQuestions } from '@/data/questions/load'
import type { MCQuestion, WrittenQuestion } from '@/data/questions'
import { PracticeSkeleton } from '@/components/Skeleton'
import ElectiveSelector, { useElectiveSelection } from '@/components/ElectiveSelector'
import { hasElectives, isTopicInScope, type ElectiveSelection } from '@/lib/electives'

// Client-only quiz runner (uses Math.random/localStorage). The platform is 100%
// free, so there is no wall, cap or tier check here any more — we simply load
// the subject's question bank (its own lazy chunk) and run.
const PracticeSession = dynamic(() => import('./PracticeSession'), {
  ssr: false,
  loading: () => <Loading />,
})

// 書寫題（?mode=long）行完全獨立嘅 runner —— 決策 ②。刻意唔塞入 PracticeSession：
// 嗰邊由選項洗牌、客觀對錯、反思鎖到成績結算都係為 MC 而寫，混入去就要
// 喺 1,039 行入面到處加 if，反而更易整爛現有流程。
const LongPracticeSession = dynamic(() => import('./LongPracticeSession'), {
  ssr: false,
  loading: () => <Loading />,
})

// #117 骨架屏取代原本得一句置中「載入中」。題庫係 lazy chunk，慢網絡下呢一刻
// 可以係幾秒空白畫面。畫返題目卡輪廓，等待感細好多。
//
// 讀屏用戶：骨架本身 aria-hidden（純視覺），故此另設一個 sr-only 的載入文字，
// 保留原本 `t.common.loading` 嘅語意，唔會因為改視覺而失去無障礙訊息。
function Loading() {
  const t = useT()
  return (
    <div aria-busy="true">
      <span className="sr-only">{t.common.loading}</span>
      <PracticeSkeleton />
    </div>
  )
}

/**
 * UX audit C1 (a), Yuna 2026-09-21: a bank that fails to load (offline, chunk never
 * cached) used to leave the skeleton spinning forever, and a screen reader kept
 * announcing "loading". This says what happened and lists subjects this device has
 * practised before, which are the ones most likely to still open offline.
 */
function BankLoadError({ subjectId }: { subjectId: string }) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [others, setOthers] = useState<string[]>([])
  useEffect(() => {
    const seen = new Set<string>()
    for (const a of [...loadAttempts()].sort((x, y) => y.timestamp - x.timestamp)) {
      if (a.subjectId !== subjectId && getSubject(a.subjectId)) seen.add(a.subjectId)
    }
    setOthers([...seen].slice(0, 6))
  }, [subjectId])
  const name = (id: string) => {
    const m = getSubject(id)
    return m ? (en ? m.nameEn : m.name) : id
  }
  return (
    <div role="alert" className="mx-auto max-w-md px-4 py-16 text-center">
      <h1 className="text-xl font-medium text-ink">{en ? 'This subject isn’t saved on this device yet' : '呢科未存喺部機'}</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
        {en
          ? 'The questions could not be downloaded, probably because there is no connection right now. Open it once while you are online and it will be saved.'
          : '題目下載唔到，多數係因為而家冇網。有網嗰陣開一次，就會存低喺部機。'}
      </p>
      {others.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-ink-soft">{en ? 'Subjects you have practised here before, worth a try:' : '你之前喺呢部機做過呢幾科，可以試下：'}</p>
          <ul className="mt-3 flex flex-wrap justify-center gap-2">
            {others.map((id) => (
              <li key={id}>
                <Link href={`/practice?subject=${encodeURIComponent(id)}`} className="inline-flex min-h-11 items-center rounded-xl border border-line-strong px-4 text-sm text-ink hover:bg-surface-sunken">
                  {name(id)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => window.location.reload()} className="min-h-11 rounded-xl bg-accent-strong px-5 text-sm font-medium text-on-accent hover:bg-accent-hover">
          {en ? 'Try again' : '再試一次'}
        </button>
        <Link href="/subjects" className="inline-flex min-h-11 items-center px-3 text-sm text-accent underline underline-offset-4">
          {en ? 'All subjects' : '全部科目'}
        </Link>
      </div>
    </div>
  )
}

export default function PracticeGate({
  subjectId,
  topicFilter,
  mode = 'normal',
  sessionSize,
}: {
  subjectId: string
  topicFilter: string | null
  mode?: 'normal' | 'weakness' | 'long'
  /** C6「只做 1 題」會傳 1；其餘一律用標準卷長。 */
  sessionSize?: number
}) {
  const long = mode === 'long'
  const electives = useElectiveSelection(subjectId)
  // The subject's question bank, lazily fetched as its own chunk.
  // 兩條路各自只攞自己嗰種題 —— MC runner 讀 options／correctIndex，攞錯會即時爆。
  const [mcBank, setMcBank] = useState<MCQuestion[] | null>(null)
  const [writtenBank, setWrittenBank] = useState<WrittenQuestion[] | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)

  useEffect(() => {
    let alive = true
    setLoadFailed(false)
    const fail = () => { if (alive) setLoadFailed(true) }
    if (long) {
      loadWrittenQuestions(subjectId).then((qs) => { if (alive) setWrittenBank(qs) }).catch(fail)
    } else {
      loadSubjectMCQuestions(subjectId).then((qs) => { if (alive) setMcBank(qs) }).catch(fail)
    }
    return () => {
      alive = false
    }
  }, [subjectId, long])

  // Mixed practice follows the saved electives. A session the student opened on
  // one topic is left alone: choosing that topic is an explicit request. If the
  // filter would leave nothing, the whole bank is used rather than an empty session.
  //
  // Memoised on the selection's content, not its object identity: readElectives()
  // returns a fresh object on every storage event, and LongPracticeSession
  // rebuilds (reshuffles) its pool whenever `bank` changes identity.
  const selKey = JSON.stringify(electives.sel ?? null)
  const scopedMc = useMemo(() => mcBank && inScope(mcBank, subjectId, topicFilter, selKey), [mcBank, subjectId, topicFilter, selKey])
  const scopedWritten = useMemo(
    () => writtenBank && inScope(writtenBank, subjectId, topicFilter, selKey),
    [writtenBank, subjectId, topicFilter, selKey],
  )

  if (loadFailed) return <BankLoadError subjectId={subjectId} />

  // A subject with electives needs an answer before the first session. The
  // dialog accepts "not assigned / not sure", which shows every topic.
  if (hasElectives(subjectId) && (!electives.ready || !electives.complete)) {
    return electives.ready ? <ElectiveSelector subject={subjectId} /> : <Loading />
  }

  if (long) {
    if (scopedWritten === null) return <Loading />
    return (
      <LongPracticeSession
        key={subjectId + '|' + (topicFilter ?? '') + '|long'}
        bank={scopedWritten}
        subjectId={subjectId}
        topicFilter={topicFilter}
      />
    )
  }

  if (scopedMc === null) return <Loading />

  return (
    <PracticeSession
      key={subjectId + '|' + (topicFilter ?? '') + '|' + mode + '|' + (sessionSize ?? '')}
      bank={scopedMc}
      subjectId={subjectId}
      topicFilter={topicFilter}
      sessionSize={sessionSize ?? SESSION_SIZE}
      mode={mode === 'weakness' ? 'weakness' : 'normal'}
    />
  )
}

function inScope<T extends { topic: string }>(bank: T[], subjectId: string, topicFilter: string | null, selKey: string): T[] {
  if (topicFilter) return bank
  const sel = JSON.parse(selKey) as ElectiveSelection | null
  const kept = bank.filter((q) => isTopicInScope(subjectId, q.topic, sel ?? undefined))
  return kept.length ? kept : bank
}
