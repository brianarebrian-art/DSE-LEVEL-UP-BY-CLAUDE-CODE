'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState } from 'react'
import { useT } from '@/lib/i18n'
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

  useEffect(() => {
    let alive = true
    if (long) {
      loadWrittenQuestions(subjectId).then((qs) => { if (alive) setWrittenBank(qs) })
    } else {
      loadSubjectMCQuestions(subjectId).then((qs) => { if (alive) setMcBank(qs) })
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
