'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useT } from '@/lib/i18n'
import { SESSION_SIZE } from '@/lib/entitlements'
import { loadSubjectMCQuestions, loadWrittenQuestions } from '@/data/questions/load'
import type { MCQuestion, WrittenQuestion } from '@/data/questions'
import { PracticeSkeleton } from '@/components/Skeleton'

// Client-only quiz runner (uses Math.random/localStorage). The platform is 100%
// free, so there is no wall, cap or tier check here any more — we simply load
// the subject's question bank (its own lazy chunk) and run.
const PracticeSession = dynamic(() => import('./PracticeSession'), {
  ssr: false,
  loading: () => <Loading />,
})

// 書寫題（?mode=long）行完全獨立嘅 runner —— 決策 ②。刻意唔塞入 PracticeSession：
// 嗰邊由選項洗牌、客觀對錯、60 秒反思鎖到成績結算都係為 MC 而寫，混入去就要
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

  if (long) {
    if (writtenBank === null) return <Loading />
    return (
      <LongPracticeSession
        key={subjectId + '|' + (topicFilter ?? '') + '|long'}
        bank={writtenBank}
        subjectId={subjectId}
        topicFilter={topicFilter}
      />
    )
  }

  if (mcBank === null) return <Loading />

  return (
    <PracticeSession
      key={subjectId + '|' + (topicFilter ?? '') + '|' + mode + '|' + (sessionSize ?? '')}
      bank={mcBank}
      subjectId={subjectId}
      topicFilter={topicFilter}
      sessionSize={sessionSize ?? SESSION_SIZE}
      mode={mode === 'weakness' ? 'weakness' : 'normal'}
    />
  )
}
