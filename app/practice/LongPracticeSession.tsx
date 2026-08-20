'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Brain } from 'lucide-react'
import TextQuestionCard from '@/components/TextQuestionCard'
import LongQuestionCard from '@/components/LongQuestionCard'
import { useLocale } from '@/lib/i18n'
import { recordTopicOutcomes } from '@/lib/topicStats'
import { logReverseError, type ReverseCause } from '@/lib/reverseLog'
import type { SelfAssessment, WrittenQuestion } from '@/data/questions/types'

// 書寫題練習（?mode=long）—— 同 20 題 MC 流程【完全分開】嘅獨立卷。
//
// 2026-07-31 Brian 拍板三項決策，全部喺呢個檔落實：
//
// ① 自評完全分開統計。書寫題只寫入【錯題本（reverseLog）】同【課題掌握度
//    （topicStats）】，**唔會**呼叫 recordAttempt() —— 即係唔入 dse_progress，
//    因此唔會流入整體準確率、predictGrade 等級預測、或每日 3:5:2 學習光譜。
//    理由：自評係學生自己講，唔係客觀分。混入去就等於將主觀數據當客觀指標展示。
//    （光譜亦刻意排除：3:5:2 節奏係按 MC 校準，一條 6 分鐘長題目當一格會失真。）
//
// ② 獨立 session，一次 3 條（DEFAULT_LONG_SESSION）。MC session 一個字都冇改。
//    一條長題目建議用時 5–15 分鐘，同 MC 唔可以 1:1 換算；混入同一個 20 題卷
//    會令「20 題」失去意義。呢個分卷亦對應真實 DSE 卷一／卷二結構。
//
// ③ 唔觸發 60 秒反思鎖。鎖死原本由「客觀答錯中高難度題」觸發；書寫題冇客觀
//    對錯，只有自評。若用自評「仲未掌握」去觸發強制凍結，等於【懲罰誠實自評】——
//    學生好快就會學識揀「完全掌握」嚟避開凍結，自評數據即刻失去價值。
//    改為溫和邀請：想記低錯因就撳，唔想就跳過，唔記錄 = 唔會捏造 cause。
export const DEFAULT_LONG_SESSION = 3

// 自評三級 → 課題掌握度嘅得分權重。full = 完全掌握、partial = 部分明白。
// 「部分明白」記半分而非 0：學生寫得出部分步驟同完全唔識，唔應該當同一件事。
const CREDIT: Record<SelfAssessment, number> = {
  correct: 1, full: 1, partial: 0.5, wrong: 0, none: 0,
}

// 同 AnswerSheetClient 一致：`Date.now()` 唔可以喺 component body 直接叫，
// react-hooks 嘅純度規則證明唔到嗰個函數唔會喺 render 期間執行。抽上 module
// scope 之後，呼叫點就明確唔屬於 render。
const nowMs = () => Date.now()

const CAUSES: { key: ReverseCause; emoji: string; zh: string; en: string }[] = [
  { key: 'A', emoji: '🧠', zh: '概念盲區', en: 'Conceptual blind spot' },
  { key: 'B', emoji: '🎯', zh: '審題陷阱', en: 'Misread the question' },
  { key: 'C', emoji: '🧮', zh: '運算粗心', en: 'Careless working' },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function LongPracticeSession({
  bank,
  subjectId,
  topicFilter,
  sessionSize = DEFAULT_LONG_SESSION,
}: {
  bank: WrittenQuestion[]
  subjectId: string
  topicFilter: string | null
  sessionSize?: number
}) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const tr = (zh: string, e: string) => (en ? e : zh)

  const questions = useMemo(() => {
    const pool = topicFilter ? bank.filter((q) => q.topic === topicFilter) : bank
    return shuffle(pool).slice(0, sessionSize)
  }, [bank, topicFilter, sessionSize])

  const [idx, setIdx] = useState(0)
  const [done, setDone] = useState(false)
  // 已自評但仲未決定要唔要記錯因嘅題目（決策 ③ 嘅溫和邀請）
  const [inviteFor, setInviteFor] = useState<WrittenQuestion | null>(null)
  const [assessed, setAssessed] = useState<{ q: WrittenQuestion; credit: number }[]>([])

  const current = questions[idx]

  const advance = () => {
    setInviteFor(null)
    if (idx + 1 >= questions.length) setDone(true)
    else setIdx((i) => i + 1)
  }

  const handleResult = (q: WrittenQuestion, level: SelfAssessment) => {
    const credit = CREDIT[level] ?? 0
    // ① 課題掌握度 —— 唯一兩個寫入點之一
    recordTopicOutcomes(subjectId, [
      { topic: q.topic, label: en ? (q.topicEn ?? q.topicZh) : q.topicZh, correct: credit, total: 1 },
    ])
    setAssessed((a) => [...a, { q, credit }])
    // 未完全掌握先出錯因邀請；完全掌握就直接過下一題
    if (credit < 1) setInviteFor(q)
    else advance()
  }

  // ① 錯題本 —— 只有學生真係揀咗錯因先記錄。跳過就唔寫，唔會捏造 cause。
  const logCause = (q: WrittenQuestion, cause: ReverseCause) => {
    logReverseError({
      subjectId,
      questionId: q.id,
      topic: en ? (q.topicEn ?? q.topicZh) : q.topicZh,
      topicId: q.topic,
      cause,
      selected: tr('（書寫題自評）', '(written self-assessment)'),
      correct: q.referenceAnswer.slice(0, 120),
      ts: nowMs(),
      difficulty: q.difficulty, // 真相引擎：分辨基礎盲點 vs 進階未消化
    })
    advance()
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-surface text-ink flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="text-lg font-medium mb-2">{tr('呢科暫時未有長題目', 'No written questions here yet')}</p>
          <p className="text-sm text-ink-muted leading-relaxed mb-6">
            {tr(
              '長題目要逐條經真人審批先會上線，所以出得慢。想即刻練，可以先做選擇題。',
              'Written questions go live only after a human approves each one, so they arrive slowly. The multiple-choice bank is ready now.',
            )}
          </p>
          <Link
            href={`/practice?subject=${subjectId}`}
            className="min-h-11 inline-flex items-center gap-2 bg-accent-strong hover:bg-accent-hover text-on-accent font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            {tr('去做選擇題', 'Practise multiple choice')} <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    )
  }

  if (done) {
    // 刻意【冇分數、冇等級、冇百分比】—— 自評唔係客觀分（決策 ①）。
    const shaky = assessed.filter((a) => a.credit < 1)
    return (
      <div className="min-h-screen bg-surface text-ink px-4 py-24 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-medium mb-3">
            {tr(`你做完咗 ${assessed.length} 條長題目`, `You worked through ${assessed.length} written questions`)}
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed mb-8">
            {tr(
              '長題目冇機器分數 —— 因為真正嘅評分準則要人先睇得懂。你嘅自評已寫入課題掌握度，唔會計入準確率或等級預測。',
              'There is no machine score here — a real marking scheme needs a human eye. Your self-assessment feeds your topic mastery only; it never counts towards accuracy or grade prediction.',
            )}
          </p>

          {shaky.length > 0 && (
            <div className="rounded-2xl border border-gold/30 bg-gold/10 p-5 mb-8">
              <p className="text-sm font-medium text-gold mb-2">
                💡 {tr('你發現咗值得再睇嘅課題', 'Topics worth another look')}
              </p>
              <ul className="text-sm text-ink-soft space-y-1">
                {[...new Set(shaky.map((a) => (en ? (a.q.topicEn ?? a.q.topicZh) : a.q.topicZh)))].map((t) => (
                  <li key={t}>· {t}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/practice?subject=${subjectId}&mode=long`}
              className="min-h-11 inline-flex items-center gap-2 bg-accent-strong hover:bg-accent-hover text-on-accent font-medium px-5 py-2.5 rounded-xl transition-colors"
            >
              {tr('再做一組', 'Another set')}
            </Link>
            <Link
              href="/dashboard"
              className="min-h-11 inline-flex items-center gap-2 border border-line-strong text-ink-soft hover:text-accent hover:border-accent px-5 py-2.5 rounded-xl transition-colors"
            >
              {tr('睇返我嘅進度', 'See my progress')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface text-ink px-4 py-24 sm:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-ink-muted">
            {tr(`第 ${idx + 1} / ${questions.length} 條`, `${idx + 1} of ${questions.length}`)}
          </span>
          <span className="text-[11px] text-ink-muted">
            {tr('長題目練習 · 自評制', 'Written practice · self-assessed')}
          </span>
        </div>

        {current.type === 'long' ? (
          <LongQuestionCard key={current.id} q={current} onResult={(l) => handleResult(current, l)} />
        ) : (
          <TextQuestionCard key={current.id} q={current} onResult={(l) => handleResult(current, l)} />
        )}

        {/* ③ 溫和邀請 —— 唔係強制凍結。撳「暫時唔使」一樣可以行落去。 */}
        {inviteFor && (
          <div className="mt-5 rounded-2xl border border-line bg-surface-raised p-5">
            <p className="text-sm text-ink-soft mb-1 inline-flex items-center gap-2">
              <Brain size={16} className="text-accent" aria-hidden />
              {tr('想唔想順手記低今次係邊種盲點？', 'Want to note what tripped you up?')}
            </p>
            <p className="text-xs text-ink-muted mb-3 leading-relaxed">
              {tr('記低咗會入你嘅錯題本，之後溫書搵返會快好多。唔想記都完全冇問題。',
                  'It goes into your error notebook so revision is faster later. Skipping is completely fine.')}
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {CAUSES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => logCause(inviteFor, c.key)}
                  className="min-h-11 text-sm border border-line-strong hover:border-accent hover:text-accent text-ink-soft rounded-xl px-3 py-2.5 transition-colors"
                >
                  {c.emoji} {en ? c.en : c.zh}
                </button>
              ))}
            </div>
            <button
              onClick={advance}
              className="min-h-11 mt-3 text-sm text-ink-muted hover:text-accent transition-colors"
            >
              {tr('暫時唔使，繼續 →', 'Skip for now →')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
