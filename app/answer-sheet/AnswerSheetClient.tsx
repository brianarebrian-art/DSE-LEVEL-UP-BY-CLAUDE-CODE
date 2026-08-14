'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ClipboardCheck, Lightbulb, ArrowRight, Check, RotateCcw, Save } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import MathText from '@/components/MathText'
import { subjects } from '@/data/subjects'
import { getSubjectMCQuestions, getQuestionsByTopic, getWrittenQuestions } from '@/data/questions'
import type { SelfAssessment, WrittenQuestion } from '@/data/questions/types'
import { logReverseError, type ReverseCause } from '@/lib/reverseLog'
import { recordAttempt } from '@/lib/progress'
import { recordTopicOutcomes } from '@/lib/topicStats'
import { predictGrade } from '@/lib/grading'
import { getPracticeCutoffs } from '@/data/cutoffs'
import { buildPaper, buildWrittenSection, decodePaperCode, type PaperItem, type PaperSpec } from '@/lib/paper/paper'

// 紙筆對答案 —— 一入嚟就係一份【答案紙】。
//
// 2026-08-14 改版：原本要逐題撳返你喺紙上揀咗邊個字母，先至肯揭答案。做完紙筆
// 再喺電話上重輸二十次 A/B/C/D，係一重冇必要嘅苦工 —— 學生手上已經有張紙，
// 佢要嘅係一份對照表。所以而家開卷即出全部正確答案 + 解析，學生對住張紙自己剔。
//
// 代價講清楚：舊流程「先自報、後揭曉」順帶擋住咗「睇完答案先話自己啱」。而家
// 呢層冇咗，自評屬誠信制。呢個係可以接受嘅 —— 成績只入自己部機、冇人比較、
// 冇排名，呃到嘅只有自己。換返嚟嘅係真係有人肯用。
//
// 錯因自診完整保留：剔「未啱」先出三維自診，一樣寫入 dse_reverse_log 餵錯因雷達。

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

type Mark = 'right' | 'wrong'

// `react-hooks/purity` 唔准喺 component body 內直接叫 Date.now()。時間戳確實要
// 喺事件發生嗰刻先取（唔可以喺 render 期預先算），所以抽去 module scope。
const nowMs = () => Date.now()

// 乙部自評三級 → 課題掌握度權重。同 LongPracticeSession 嘅 CREDIT 一致：
// 「部分明白」記半分而非 0 —— 寫得出部分步驟同完全唔識唔應該當同一件事。
const WRITTEN_CREDIT: Record<WrittenLevel, number> = { full: 1, partial: 0.5, none: 0 }
type WrittenLevel = Extract<SelfAssessment, 'full' | 'partial' | 'none'>

const WRITTEN_LEVELS: { key: WrittenLevel; zh: string; en: string; cls: string }[] = [
  { key: 'full', zh: '完全掌握', en: 'Fully got it', cls: 'border-accent/50 bg-accent/15 text-accent-strong' },
  { key: 'partial', zh: '部分明白', en: 'Partly', cls: 'border-gold/50 bg-gold/15 text-gold-strong' },
  { key: 'none', zh: '仲未掌握', en: 'Not yet', cls: 'border-line-strong bg-line text-ink-soft' },
]

export default function AnswerSheetClient() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const tr = (zh: string, e: string) => (en ? e : zh)
  const params = useSearchParams()

  const [code, setCode] = useState('')
  const [paper, setPaper] = useState<
    { spec: PaperSpec; items: PaperItem[]; writtenItems: WrittenQuestion[] } | null
  >(null)
  const [writtenLevels, setWrittenLevels] = useState<Record<string, WrittenLevel>>({})
  const [error, setError] = useState(false)
  const [marks, setMarks] = useState<Record<string, Mark>>({})
  const [causes, setCauses] = useState<Record<string, ReverseCause>>({})
  const [scoreInput, setScoreInput] = useState('')
  const [minutesInput, setMinutesInput] = useState('')
  const [saved, setSaved] = useState<{ score: number; total: number; grade: string; topics: number } | null>(null)

  const load = useCallback((raw: string) => {
    const spec = decodePaperCode(raw)
    if (!spec) {
      setError(true)
      setPaper(null)
      return
    }
    // 只取 MC：答題卡係客觀批改流程，書寫題（自評制）唔屬於呢個入口
    const pool = spec.topic ? getQuestionsByTopic(spec.subject, spec.topic) : getSubjectMCQuestions(spec.subject)
    const items = buildPaper(spec, pool)
    if (items.length === 0) {
      setError(true)
      setPaper(null)
      return
    }
    setError(false)
    setMarks({})
    setCauses({})
    setWrittenLevels({})
    setScoreInput('')
    setMinutesInput('')
    setSaved(null)
    // 乙部：卷號第 5 段有幾多就重建幾多（冇第 5 段即 0，舊卷號行為不變）
    const writtenItems = buildWrittenSection(spec, spec.written ? getWrittenQuestions(spec.subject) : [])
    setPaper({ spec, items, writtenItems })
  }, [])

  // 由 URL ?p= 自動開卷（紙上印咗 QR 同卷號）
  useEffect(() => {
    const p = params.get('p')
    if (p) {
      setCode(p)
      load(p)
    }
  }, [params, load])

  const subjectMeta = subjects.find((s) => s.id === paper?.spec.subject)

  const tally = useMemo(() => {
    const values = Object.values(marks)
    const right = values.filter((m) => m === 'right').length
    return { marked: values.length, right, wrong: values.length - right }
  }, [marks])

  // 錯因自診 → 寫入 reverseLog（同 practice 用同一條 key，錯因雷達即時見到）
  function chooseCause(item: PaperItem, cause: ReverseCause) {
    if (!paper) return
    setCauses((prev) => ({ ...prev, [item.question.id]: cause }))
    logReverseError({
      subjectId: paper.spec.subject,
      questionId: item.question.id,
      topic: item.question.topicZh,
      topicId: item.question.topic,
      cause,
      // 紙筆流程冇收集學生實際揀咗邊個選項（佢張紙先有），故留空而唔係老作一個
      selected: '',
      correct: item.options[item.answerIndex],
      ts: nowMs(),
      difficulty: item.question.difficulty,
    })
  }

  /**
   * 乙部自評 —— 跟足 2026-07-31 Brian 拍板嘅規則（見 LongPracticeSession 檔頭）：
   * 只寫 topicStats（同 reverseLog，若學生肯揀錯因），**唔會**入 recordAttempt，
   * 所以唔會流入甲部成績、整體準確率或等級預測。自評係學生自己講嘅嘢，
   * 混入客觀指標就等於把主觀數據當客觀分展示。
   */
  function assessWritten(q: WrittenQuestion, level: WrittenLevel) {
    if (!paper || writtenLevels[q.id]) return // 一題只計一次，防止重複疊加課題掌握度
    setWrittenLevels((prev) => ({ ...prev, [q.id]: level }))
    recordTopicOutcomes(paper.spec.subject, [
      {
        topic: q.topic,
        label: en ? (q.topicEn ?? q.topicZh) : q.topicZh,
        correct: WRITTEN_CREDIT[level],
        total: 1,
      },
    ])
  }

  function logWrittenCause(q: WrittenQuestion, cause: ReverseCause) {
    if (!paper) return
    setCauses((prev) => ({ ...prev, [q.id]: cause }))
    logReverseError({
      subjectId: paper.spec.subject,
      questionId: q.id,
      topic: en ? (q.topicEn ?? q.topicZh) : q.topicZh,
      topicId: q.topic,
      cause,
      selected: tr('（書寫題自評）', '(written self-assessment)'),
      correct: q.referenceAnswer.slice(0, 120),
      ts: nowMs(),
      difficulty: q.difficulty,
    })
  }

  function setMark(item: PaperItem, mark: Mark) {
    setMarks((prev) => {
      const next = { ...prev }
      if (next[item.question.id] === mark) delete next[item.question.id]
      else next[item.question.id] = mark
      return next
    })
  }

  /**
   * 存入進度。
   *
   * 誠實規則：`topicResults` 只由【真係剔過】嘅題目組成。淨係填總分冇逐題剔嘅
   * 話，我哋根本唔知邊個課題錯咗，就唔會砌一份課題分佈出嚟 —— 老作課題分佈
   * 等於教學生去補一個佢可能根本冇錯嘅課題。
   */
  function save() {
    if (!paper) return
    const total = paper.items.length
    const typed = scoreInput.trim()
    const scoreNum = typed === ''
      ? tally.right
      : Math.max(0, Math.min(total, Math.round(Number(typed) || 0)))

    // AttemptRecord.topicResults 嘅 `topic` 存【顯示標籤】；recordTopicOutcomes
    // 嘅 `topic` 存【topic id】+ 另有 label。兩者語義唔同，要分開砌。
    const byTopic = new Map<string, { id: string; label: string; correct: number; total: number }>()
    for (const it of paper.items) {
      const mk = marks[it.question.id]
      if (!mk) continue
      const id = it.question.topic
      const row = byTopic.get(id) ?? { id, label: it.question.topicZh, correct: 0, total: 0 }
      row.total++
      if (mk === 'right') row.correct++
      byTopic.set(id, row)
    }
    const rows = [...byTopic.values()]

    const minutes = Number(minutesInput.trim())
    const elapsed = Number.isFinite(minutes) && minutes > 0 ? Math.round(minutes * 60) : 0

    const grade = predictGrade(scoreNum, getPracticeCutoffs(total, paper.spec.subject), paper.spec.subject).grade
    recordAttempt({
      subjectId: paper.spec.subject,
      subjectName: subjectMeta?.name ?? paper.spec.subject,
      topicFilter: paper.spec.topic || null,
      score: scoreNum,
      total,
      grade,
      topicResults: rows.map((r) => ({ topic: r.label, correct: r.correct, total: r.total })),
      elapsed,
      timestamp: Date.now(),
    })
    if (rows.length) {
      recordTopicOutcomes(
        paper.spec.subject,
        rows.map((r) => ({ topic: r.id, label: r.label, correct: r.correct, total: r.total })),
      )
    }
    setSaved({ score: scoreNum, total, grade, topics: rows.length })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <header className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-medium text-ink">
          <ClipboardCheck size={22} className="text-accent" />
          {tr('紙筆對答案', 'Paper answer sheet')}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {tr(
            '掃張紙下面個 QR，或者打返個卷號，就會即刻出晒全部正確答案。',
            'Scan the QR at the bottom of your sheet, or type the paper code, to see every correct answer straight away.',
          )}
        </p>
      </header>

      {/* 入卷號 */}
      <div className="rounded-2xl border border-line bg-surface-raised p-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink-soft">{tr('卷號', 'Paper code')}</span>
          <div className="flex flex-wrap gap-2">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && load(code)}
              placeholder="math~all~20~k3q7"
              className="min-h-11 flex-1 rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink-soft placeholder:text-ink-muted focus:border-accent focus:outline-none"
            />
            <button
              onClick={() => load(code)}
              className="min-h-11 rounded-lg bg-accent-strong px-4 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
            >
              {tr('開卷', 'Open')}
            </button>
          </div>
        </label>
        {error && (
          <p className="mt-3 rounded-lg border border-gold/30 bg-gold/10 p-3 text-sm text-gold-strong">
            {tr('搵唔到呢個卷號。再對一對張紙下面嗰行字？', "That code didn't match a paper — could you double-check the line at the bottom of your sheet?")}
          </p>
        )}
        {!paper && !error && (
          <p className="mt-3 text-xs text-ink-muted">
            {tr('未有卷？', 'No paper yet?')}{' '}
            <Link href="/paper-warrior" className="text-accent-strong underline underline-offset-2">
              {tr('去紙筆戰士印一份', 'Print one in Paper Warrior')}
            </Link>
          </p>
        )}
      </div>

      {paper && (
        <>
          <div className="mt-6 rounded-2xl border border-line bg-surface-raised p-4">
            <p className="text-sm text-ink-soft">
              {subjectMeta?.emoji} {en ? subjectMeta?.nameEn : subjectMeta?.name} ·{' '}
              {tr(`${paper.items.length} 題`, `${paper.items.length} questions`)}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">
              {tr(
                '下面係全部正確答案。對住你張紙逐題剔返啱定未啱 —— 剔咗先知道邊個課題要補。',
                'Every correct answer is below. Mark each one against your paper — the marks are what tell you which topics to work on.',
              )}
            </p>
            <p className="mt-2 text-sm font-medium text-accent-strong">
              {tr(
                `已剔 ${tally.marked} / ${paper.items.length} · 啱 ${tally.right} · 未啱 ${tally.wrong}`,
                `Marked ${tally.marked} of ${paper.items.length} · ${tally.right} right · ${tally.wrong} to revisit`,
              )}
            </p>
          </div>

          <ol className="mt-4 space-y-3">
            {paper.items.map((item, i) => {
              const mark = marks[item.question.id]
              return (
                <li key={item.question.id} className="rounded-2xl border border-line bg-surface-raised p-4">
                  <div className="text-sm font-medium leading-relaxed text-ink">
                    {i + 1}.{' '}
                    <MathText>{tr(item.question.content, item.question.contentEn ?? item.question.content)}</MathText>
                  </div>

                  <p className="mt-2 text-sm text-ink-soft">
                    <span className="font-medium text-accent-strong">{tr('正確答案', 'Correct answer')}：</span>
                    <MathText>{en ? item.optionsEn[item.answerIndex] : item.options[item.answerIndex]}</MathText>
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                    <MathText>
                      {tr(item.question.explanation, item.question.explanationEn ?? item.question.explanation)}
                    </MathText>
                  </p>

                  {/* 自剔。再撳一次可取消，改錯咗唔使重開成份卷。 */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => setMark(item, 'right')}
                      aria-pressed={mark === 'right'}
                      className={`inline-flex min-h-11 items-center gap-1.5 rounded-xl border px-3 text-sm font-medium transition-colors ${
                        mark === 'right'
                          ? 'border-accent/50 bg-accent/15 text-accent-strong'
                          : 'border-line bg-surface text-ink-muted hover:border-accent/40'
                      }`}
                    >
                      <Check size={15} aria-hidden /> {tr('我啱咗', 'I got it')}
                    </button>
                    <button
                      onClick={() => setMark(item, 'wrong')}
                      aria-pressed={mark === 'wrong'}
                      className={`inline-flex min-h-11 items-center gap-1.5 rounded-xl border px-3 text-sm font-medium transition-colors ${
                        mark === 'wrong'
                          ? 'border-gold/50 bg-gold/15 text-gold-strong'
                          : 'border-line bg-surface text-ink-muted hover:border-gold/40'
                      }`}
                    >
                      <RotateCcw size={15} aria-hidden /> {tr('我未啱', 'Not yet')}
                    </button>
                  </div>

                  {mark === 'wrong' && (
                    <div className="mt-3 rounded-xl border border-gold/25 bg-gold/[0.06] p-3">
                      <p className="flex items-center gap-1.5 text-sm font-medium text-gold-strong">
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
                                  ? 'border-accent/50 bg-accent/[0.08]'
                                  : 'border-line bg-surface-raised hover:border-accent/40'
                              }`}
                            >
                              <span className="text-sm">{c.emoji}</span>
                              <span className="min-w-0">
                                <span className="block text-sm font-medium text-ink">{tr(c.zh, c.en)}</span>
                                <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">
                                  {tr(c.zhDesc, c.enDesc)}
                                </span>
                              </span>
                            </button>
                          )
                        })}
                      </div>
                      {causes[item.question.id] && (
                        <p className="mt-2 text-xs text-accent-strong">
                          {tr('已記低，錯因雷達會見到。', 'Logged — it will show up in your error radar.')}
                        </p>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ol>

          {paper.writtenItems.length > 0 && (
            <section className="mt-8">
              <h2 className="text-base font-medium text-ink">{tr('乙部 · 書寫題', 'Section B · Written')}</h2>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                {tr(
                  '書寫題永遠唔會由機器批改。下面出參考答案同評分準則，你自己對住張紙評 —— 呢部分唔會計入上面個成績同等級，只會餵你嘅課題掌握度。',
                  'Written questions are never machine-marked. Below is a model answer and marking scheme for you to judge your own work — this section never counts toward the score or grade above; it only feeds your topic mastery.',
                )}
              </p>

              <ol className="mt-4 space-y-3">
                {paper.writtenItems.map((q, i) => {
                  const level = writtenLevels[q.id]
                  return (
                    <li key={q.id} className="rounded-2xl border border-line bg-surface-raised p-4">
                      <div className="text-sm font-medium leading-relaxed text-ink">
                        {paper.items.length + i + 1}.{' '}
                        <MathText>{tr(q.content, q.contentEn ?? q.content)}</MathText>
                        <span className="ml-1 text-xs font-normal text-ink-muted">
                          （{q.marks} {tr('分', q.marks === 1 ? 'mark' : 'marks')}）
                        </span>
                      </div>

                      <div className="mt-2.5 rounded-xl border border-accent/25 bg-accent/[0.05] p-3">
                        <p className="text-xs font-medium text-accent-strong">{tr('參考答案', 'Model answer')}</p>
                        <div className="mt-1 text-sm leading-relaxed text-ink-soft">
                          <MathText>{tr(q.referenceAnswer, q.referenceAnswerEn ?? q.referenceAnswer)}</MathText>
                        </div>
                      </div>

                      {/* 評分準則只有 LongQuestion 先有；TextQuestion（短答）冇呢欄 */}
                      {q.type === 'long' && q.markingScheme && (
                        <details className="mt-2 rounded-xl border border-line bg-surface p-3">
                          <summary className="cursor-pointer text-xs font-medium text-ink-soft">
                            {tr('評分準則', 'Marking scheme')}
                          </summary>
                          <div className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                            <MathText>{tr(q.markingScheme, q.markingSchemeEn ?? q.markingScheme)}</MathText>
                          </div>
                        </details>
                      )}

                      {q.explanation && (
                        <details className="mt-2 rounded-xl border border-line bg-surface p-3">
                          <summary className="cursor-pointer text-xs font-medium text-ink-soft">
                            {tr('解題思路', 'How to approach it')}
                          </summary>
                          <div className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                            <MathText>{tr(q.explanation, q.explanationEn ?? q.explanation)}</MathText>
                          </div>
                        </details>
                      )}

                      <p className="mt-3 text-xs text-ink-muted">
                        {tr('對住你張紙，你覺得自己寫成點？', 'Comparing with your paper, how did you do?')}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-2">
                        {WRITTEN_LEVELS.map((l) => (
                          <button
                            key={l.key}
                            onClick={() => assessWritten(q, l.key)}
                            disabled={!!level}
                            aria-pressed={level === l.key}
                            className={`min-h-11 rounded-xl border px-3 text-sm font-medium transition-colors disabled:opacity-60 ${
                              level === l.key ? l.cls : 'border-line bg-surface text-ink-muted hover:border-accent/40'
                            }`}
                          >
                            {tr(l.zh, l.en)}
                          </button>
                        ))}
                      </div>

                      {/* 未完全掌握先出錯因【邀請】。刻意唔強制：唔記錄好過捏造一個 cause。 */}
                      {level && level !== 'full' && (
                        <div className="mt-3 rounded-xl border border-gold/25 bg-gold/[0.06] p-3">
                          <p className="flex items-center gap-1.5 text-sm font-medium text-gold-strong">
                            <Lightbulb size={15} /> {tr('想記低係邊種盲點？（唔想就跳過）', 'Want to log the kind of gap? (skip if you prefer)')}
                          </p>
                          <div className="mt-2 space-y-1.5">
                            {REVERSE_CAUSES.map((c) => {
                              const chosen = causes[q.id] === c.key
                              return (
                                <button
                                  key={c.key}
                                  onClick={() => logWrittenCause(q, c.key)}
                                  className={`flex w-full items-start gap-2 rounded-lg border p-2 text-left transition-colors ${
                                    chosen ? 'border-accent/50 bg-accent/[0.08]' : 'border-line bg-surface-raised hover:border-accent/40'
                                  }`}
                                >
                                  <span className="text-sm">{c.emoji}</span>
                                  <span className="min-w-0">
                                    <span className="block text-sm font-medium text-ink">{tr(c.zh, c.en)}</span>
                                    <span className="mt-0.5 block text-xs leading-relaxed text-ink-muted">
                                      {tr(c.zhDesc, c.enDesc)}
                                    </span>
                                  </span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ol>
            </section>
          )}

          {/* 成績存檔 */}
          <div className="mt-6 rounded-2xl border border-line bg-surface-raised p-5">
            <h2 className="text-base font-medium text-ink">{tr('入返你張紙嘅成績', 'Log your paper result')}</h2>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">
              {tr(
                '入咗之後會併入你嘅進度同錯因雷達，下次一眼睇返自己邊度進步咗。',
                'Saved into your progress and error radar, so you can see how you are moving over time.',
              )}
            </p>

            <div className="mt-4 flex flex-wrap items-end gap-4">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-ink-soft">{tr('啱咗幾多題', 'Number correct')}</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={paper.items.length}
                    value={scoreInput}
                    onChange={(e) => setScoreInput(e.target.value)}
                    placeholder={String(tally.right)}
                    className="min-h-11 w-20 rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink-soft placeholder:text-ink-muted focus:border-accent focus:outline-none"
                  />
                  <span className="text-sm text-ink-muted">/ {paper.items.length}</span>
                </div>
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-ink-soft">
                  {tr('用咗幾多分鐘（可以唔填）', 'Minutes taken (optional)')}
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={minutesInput}
                  onChange={(e) => setMinutesInput(e.target.value)}
                  placeholder="—"
                  className="min-h-11 w-24 rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink-soft placeholder:text-ink-muted focus:border-accent focus:outline-none"
                />
              </label>
            </div>

            {scoreInput.trim() === '' && (
              <p className="mt-2 text-xs text-ink-muted">
                {tr(
                  `唔填就當你上面剔咗嘅 ${tally.right} 題。`,
                  `Leave it blank and we use the ${tally.right} you marked above.`,
                )}
              </p>
            )}
            {tally.marked === 0 && (
              <p className="mt-2 text-xs leading-relaxed text-gold-strong">
                {tr(
                  '你未逐題剔過。淨係入總分一樣存到，但因為唔知邊幾題錯，就唔會有課題分析 —— 我哋唔會靠估砌一份出嚟。',
                  'You have not marked individual questions. The total alone still saves, but without knowing which ones you missed there is no topic breakdown — we will not guess one.',
                )}
              </p>
            )}

            <button
              onClick={save}
              className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-xl bg-accent-strong px-4 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
            >
              <Save size={15} aria-hidden /> {tr('存入我嘅進度', 'Save to my progress')}
            </button>

            {saved && (
              <div className="mt-4 rounded-xl border border-accent/30 bg-accent/[0.07] p-3" role="status">
                <p className="text-sm font-medium text-accent-strong">
                  {tr(
                    `已存：${saved.total} 題入面啱咗 ${saved.score} 題 · 等級 ${saved.grade}`,
                    `Saved: ${saved.score} of ${saved.total} correct · grade ${saved.grade}`,
                  )}
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  {saved.topics > 0
                    ? tr(
                        `${saved.topics} 個課題嘅表現已併入錯因雷達。`,
                        `${saved.topics} topics folded into your error radar.`,
                      )
                    : tr(
                        '成績已記低。下次逐題剔，就會連埋課題分析。',
                        'Result logged. Mark question by question next time to get the topic breakdown too.',
                      )}
                </p>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-sm">
            <Link href="/dashboard" className="inline-flex min-h-11 items-center gap-1.5 text-accent-strong hover:underline">
              {tr('去睇錯因雷達', 'See your error radar')} <ArrowRight size={15} />
            </Link>
          </p>
        </>
      )}
    </div>
  )
}
