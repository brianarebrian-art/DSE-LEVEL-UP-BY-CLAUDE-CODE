'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ClipboardCheck, Lightbulb, ArrowRight } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import MathText from '@/components/MathText'
import { subjects } from '@/data/subjects'
import { getSubjectQuestions, getQuestionsByTopic } from '@/data/questions'
import { logReverseError, type ReverseCause } from '@/lib/reverseLog'
import { buildPaper, decodePaperCode, LETTERS, type PaperItem, type PaperSpec } from '@/lib/paper/paper'

// 紙筆對答案 —— 學生做完紙本，返嚟自報揀咗咩，然後揭曉 + 做錯因自診。
//
// 誠實說明（同原 spec 有一處刻意唔同）：原 spec 話「照常觸發 60 秒逆向鎖死引擎」。
// 60 秒鎖係【做題當下】強迫停低諗嘅機制；紙筆已經花咗時間，再鎖 60 秒冇意義。
// 真正餵養錯因雷達嘅係【三維錯因自診】—— 呢度完整保留，錯題一樣寫入 dse_reverse_log。

const REVERSE_CAUSES: {
  key: ReverseCause; emoji: string; zh: string; zhDesc: string; en: string; enDesc: string
}[] = [
  { key: 'A', emoji: '🧠', zh: '概念盲區', en: 'Conceptual Blindspot',
    zhDesc: '未完全理解定理底層邏輯（如忽略定義域或公式前提條件）',
    enDesc: "Didn't fully grasp the underlying theorem (e.g. ignored a domain or a formula precondition)" },
  { key: 'B', emoji: '🎯', zh: '審題陷阱', en: 'HKEAA Reading Trap',
    zhDesc: '踩中題目隱蔽字眼、關鍵限制或雙重否定句',
    enDesc: 'Fell for a hidden keyword, constraint or double-negative in the question' },
  { key: 'C', emoji: '🧮', zh: '運算粗心', en: 'Execution / Calculator Error',
    zhDesc: '按錯計算機或純運算失誤，思路其實正確',
    enDesc: 'Mis-keyed the calculator or a pure arithmetic slip — the method was right' },
]

export default function AnswerSheetClient() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const tr = (zh: string, e: string) => (en ? e : zh)
  const params = useSearchParams()

  const [code, setCode] = useState('')
  const [paper, setPaper] = useState<{ spec: PaperSpec; items: PaperItem[] } | null>(null)
  const [error, setError] = useState(false)
  const [picked, setPicked] = useState<Record<string, number>>({})
  const [revealed, setRevealed] = useState(false)
  const [causes, setCauses] = useState<Record<string, ReverseCause>>({})

  const load = useCallback((raw: string) => {
    const spec = decodePaperCode(raw)
    if (!spec) {
      setError(true)
      setPaper(null)
      return
    }
    const pool = spec.topic ? getQuestionsByTopic(spec.subject, spec.topic) : getSubjectQuestions(spec.subject)
    const items = buildPaper(spec, pool)
    if (items.length === 0) {
      setError(true)
      setPaper(null)
      return
    }
    setError(false)
    setPicked({})
    setCauses({})
    setRevealed(false)
    setPaper({ spec, items })
  }, [])

  // 由 URL ?p= 自動開卷（紙上印咗條連結／卷號）
  useEffect(() => {
    const p = params.get('p')
    if (p) {
      setCode(p)
      load(p)
    }
  }, [params, load])

  const subjectMeta = subjects.find((s) => s.id === paper?.spec.subject)
  const answeredCount = paper ? paper.items.filter((it) => picked[it.question.id] !== undefined).length : 0

  const score = useMemo(() => {
    if (!paper || !revealed) return null
    let right = 0
    for (const it of paper.items) if (picked[it.question.id] === it.answerIndex) right++
    return { right, total: paper.items.length }
  }, [paper, revealed, picked])

  function reveal() {
    setRevealed(true)
  }

  // 錯因自診 → 寫入 reverseLog（同 practice 用同一條 key，錯因雷達即時見到）
  function chooseCause(item: PaperItem, cause: ReverseCause) {
    if (!paper) return
    setCauses((prev) => ({ ...prev, [item.question.id]: cause }))
    const sel = picked[item.question.id]
    logReverseError({
      subjectId: paper.spec.subject,
      questionId: item.question.id,
      topic: item.question.topicZh,
      topicId: item.question.topic,
      cause,
      selected: sel !== undefined ? item.options[sel] : '',
      correct: item.options[item.answerIndex],
      ts: Date.now(),
    })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-medium text-[#1A1A1A]">
          <ClipboardCheck size={22} className="text-[#008B84]" />
          {tr('紙筆對答案', 'Paper answer sheet')}
        </h1>
        <p className="mt-1 text-sm text-[#6B6B6B]">
          {tr(
            '打返張紙下面個卷號，就會重開同一份卷（任何裝置都得）。',
            'Enter the paper code printed at the bottom of your sheet to reopen the exact same paper — on any device.',
          )}
        </p>
      </header>

      {/* 入卷號 */}
      <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[#2D2D2D]">{tr('卷號', 'Paper code')}</span>
          <div className="flex flex-wrap gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && load(code)}
              placeholder="math~all~20~k3q7"
              className="min-h-11 flex-1 rounded-lg border border-black/[0.12] bg-[#FAFAF8] px-3 text-sm text-[#2D2D2D] placeholder:text-[#9CA3AF] focus:border-[#008B84] focus:outline-none"
            />
            <button
              onClick={() => load(code)}
              className="min-h-11 rounded-lg bg-[#00726C] px-4 text-sm font-medium text-white transition-colors hover:bg-[#005F5A]"
            >
              {tr('開卷', 'Open')}
            </button>
          </div>
        </label>
        {error && (
          <p className="mt-3 rounded-lg border border-[#B8860B]/30 bg-[#B8860B]/10 p-3 text-sm text-[#8a6608]">
            {tr('搵唔到呢個卷號。再對一對張紙下面嗰行字？', "That code didn't match a paper — could you double-check the line at the bottom of your sheet?")}
          </p>
        )}
        {!paper && !error && (
          <p className="mt-3 text-xs text-[#9CA3AF]">
            {tr('未有卷？', 'No paper yet?')}{' '}
            <Link href="/paper-warrior" className="text-[#00726C] underline underline-offset-2">
              {tr('去紙筆戰士印一份', 'Print one in Paper Warrior')}
            </Link>
          </p>
        )}
      </div>

      {paper && (
        <>
          <div className="mt-6 rounded-2xl border border-black/[0.06] bg-white p-4">
            <p className="text-sm text-[#2D2D2D]">
              {subjectMeta?.emoji} {en ? subjectMeta?.nameEn : subjectMeta?.name} ·{' '}
              {tr(`${paper.items.length} 題`, `${paper.items.length} questions`)}
            </p>
            {!revealed ? (
              <>
                <p className="mt-1 text-xs text-[#6B6B6B]">
                  {tr(
                    `逐題撳返你喺紙上面揀咗嘅字母。已填 ${answeredCount} / ${paper.items.length}。`,
                    `Tap the letter you chose on paper for each question. ${answeredCount} of ${paper.items.length} filled in.`,
                  )}
                </p>
                <button
                  onClick={reveal}
                  disabled={answeredCount === 0}
                  className="mt-3 min-h-11 rounded-lg bg-[#00726C] px-4 text-sm font-medium text-white transition-colors hover:bg-[#005F5A] disabled:opacity-40"
                >
                  {tr('睇答案', 'Reveal answers')}
                </button>
              </>
            ) : (
              score && (
                <p className="mt-1 text-sm text-[#00635E]">
                  {tr(
                    `${score.total} 題入面啱咗 ${score.right} 題。答錯嗰啲喺下面揀個錯因，就會入到你嘅錯因雷達。`,
                    `${score.right} of ${score.total} correct. Tag a cause on the ones you missed and they flow into your error radar.`,
                  )}
                </p>
              )
            )}
          </div>

          <ol className="mt-4 space-y-3">
            {paper.items.map((item, i) => {
              const sel = picked[item.question.id]
              const isRight = revealed && sel === item.answerIndex
              const isWrong = revealed && sel !== undefined && sel !== item.answerIndex
              return (
                <li key={item.question.id} className="rounded-2xl border border-black/[0.06] bg-white p-4">
                  <div className="text-sm font-medium leading-relaxed text-[#1A1A1A]">
                    {i + 1}.{' '}
                    <MathText>{tr(item.question.content, item.question.contentEn ?? item.question.content)}</MathText>
                  </div>

                  {/* 自報所揀 */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.options.map((_, oi) => {
                      const active = sel === oi
                      const showAsAnswer = revealed && oi === item.answerIndex
                      return (
                        <button
                          key={oi}
                          disabled={revealed}
                          onClick={() => setPicked((p) => ({ ...p, [item.question.id]: oi }))}
                          className={`min-h-11 w-11 rounded-lg text-sm font-medium transition-colors ${
                            showAsAnswer
                              ? 'bg-[#008B84]/15 text-[#00635E] ring-2 ring-[#008B84]/50'
                              : active
                                ? 'bg-[#B8860B]/15 text-[#8a6608] ring-1 ring-[#B8860B]/40'
                                : 'bg-black/[0.04] text-[#6B6B6B] hover:bg-black/[0.07]'
                          }`}
                        >
                          {LETTERS[oi]}
                        </button>
                      )
                    })}
                  </div>

                  {revealed && (
                    <div className="mt-3">
                      <p className="text-sm text-[#2D2D2D]">
                        <span className="font-medium text-[#00635E]">{tr('正確答案', 'Correct answer')}：</span>
                        <MathText>{en ? item.optionsEn[item.answerIndex] : item.options[item.answerIndex]}</MathText>
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#6B6B6B]">
                        <MathText>
                          {tr(item.question.explanation, item.question.explanationEn ?? item.question.explanation)}
                        </MathText>
                      </p>

                      {isRight && (
                        <p className="mt-2 text-xs text-[#00635E]">{tr('✓ 呢題你揸得穩。', '✓ You had this one.')}</p>
                      )}

                      {isWrong && (
                        <div className="mt-3 rounded-xl border border-[#B8860B]/25 bg-[#B8860B]/[0.06] p-3">
                          <p className="flex items-center gap-1.5 text-sm font-medium text-[#8a6608]">
                            <Lightbulb size={15} /> {tr('你發現咗一個新盲點💡 係邊一種？', 'You found a new blind spot 💡 which kind?')}
                          </p>
                          <div className="mt-2 space-y-1.5">
                            {REVERSE_CAUSES.map((c) => {
                              const chosen = causes[item.question.id] === c.key
                              return (
                                <button
                                  key={c.key}
                                  onClick={() => chooseCause(item, c.key)}
                                  className={`flex w-full items-start gap-2 rounded-lg border p-2 text-left transition-colors ${
                                    chosen
                                      ? 'border-[#008B84]/50 bg-[#008B84]/[0.08]'
                                      : 'border-black/[0.08] bg-white hover:border-[#008B84]/40'
                                  }`}
                                >
                                  <span className="text-sm">{c.emoji}</span>
                                  <span className="min-w-0">
                                    <span className="block text-sm font-medium text-[#1A1A1A]">{tr(c.zh, c.en)}</span>
                                    <span className="mt-0.5 block text-xs leading-relaxed text-[#6B6B6B]">
                                      {tr(c.zhDesc, c.enDesc)}
                                    </span>
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                          {causes[item.question.id] && (
                            <p className="mt-2 text-xs text-[#00635E]">
                              {tr('已記低，錯因雷達會見到。', 'Logged — it will show up in your error radar.')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ol>

          {revealed && (
            <p className="mt-6 text-center text-sm">
              <Link href="/dashboard" className="inline-flex min-h-11 items-center gap-1.5 text-[#00726C] hover:underline">
                {tr('去睇錯因雷達', 'See your error radar')} <ArrowRight size={15} />
              </Link>
            </p>
          )}
        </>
      )}
    </div>
  )
}
