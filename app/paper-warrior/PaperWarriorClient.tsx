'use client'

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { Printer, FileText, RefreshCw, ArrowRight } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import MathText from '@/components/MathText'
import { subjects } from '@/data/subjects'
import { getSubjectQuestions, getSubjectTopics, getQuestionsByTopic } from '@/data/questions'
import {
  buildPaper,
  encodePaperCode,
  newSeed,
  LETTERS,
  PAPER_SIZES,
  type PaperItem,
  type PaperSpec,
} from '@/lib/paper/paper'

// 紙筆戰士 —— 揀範圍 → 生成 A4 卷 → window.print()。
// 用瀏覽器原生打印（零新 dependency、零成本），配合 globals.css 既有 @media print
// 同下面 .paper-sheet 嘅 A4 規則。冇後端 PDF 服務（$0 原則）。

const activeSubjects = subjects.filter((s) => s.isActive)

export default function PaperWarriorClient() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const tr = (zh: string, e: string) => (en ? e : zh)

  const [subject, setSubject] = useState(activeSubjects[0]?.id ?? 'math')
  const [topic, setTopic] = useState('')
  const [size, setSize] = useState<number>(20)
  const [withExplain, setWithExplain] = useState(false)
  const [paper, setPaper] = useState<{ spec: PaperSpec; items: PaperItem[] } | null>(null)

  const topics = useMemo(() => {
    try {
      return getSubjectTopics(subject)
    } catch {
      return []
    }
  }, [subject])

  const subjectMeta = activeSubjects.find((s) => s.id === subject)

  const generate = useCallback(() => {
    const spec: PaperSpec = { subject, topic, size, seed: newSeed() }
    const pool = topic ? getQuestionsByTopic(subject, topic) : getSubjectQuestions(subject)
    const items = buildPaper(spec, pool)
    setPaper(items.length > 0 ? { spec, items } : null)
  }, [subject, topic, size])

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* ── 設定區（打印時隱藏）───────────────────────────────────────── */}
      <div className="no-print">
        <header className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-medium text-[#1A1A1A]">
            <FileText size={22} className="text-[#008B84]" />
            {tr('紙筆戰士', 'Paper Warrior')}
          </h1>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            {tr(
              '印一份出嚟，用紙同筆好好咁做一次。做完返嚟對答案，錯嘅照樣入錯題紀錄。',
              'Print a set, work through it on paper, then come back to check — your mistakes still feed your error log.',
            )}
          </p>
        </header>

        <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#2D2D2D]">{tr('科目', 'Subject')}</span>
              <select
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value)
                  setTopic('')
                  setPaper(null)
                }}
                className="min-h-11 w-full rounded-lg border border-black/[0.12] bg-[#FAFAF8] px-3 text-sm text-[#2D2D2D] focus:border-[#008B84] focus:outline-none"
              >
                {activeSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.emoji} {en ? s.nameEn : s.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#2D2D2D]">{tr('課題', 'Topic')}</span>
              <select
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value)
                  setPaper(null)
                }}
                className="min-h-11 w-full rounded-lg border border-black/[0.12] bg-[#FAFAF8] px-3 text-sm text-[#2D2D2D] focus:border-[#008B84] focus:outline-none"
              >
                <option value="">{tr('全部課題', 'All topics')}</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.emoji} {en ? (t.en ?? t.zh) : t.zh}（{t.count}）
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4">
            <span className="mb-1.5 block text-sm font-medium text-[#2D2D2D]">{tr('題數', 'Questions')}</span>
            <div className="flex flex-wrap gap-2">
              {PAPER_SIZES.map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setSize(n)
                    setPaper(null)
                  }}
                  className={`min-h-11 rounded-lg px-4 text-sm transition-colors ${
                    size === n
                      ? 'bg-[#008B84]/12 text-[#00726C] ring-1 ring-[#008B84]/40'
                      : 'bg-black/[0.04] text-[#6B6B6B] hover:bg-black/[0.07]'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <label className="mt-4 flex min-h-11 items-center gap-2.5">
            <input
              type="checkbox"
              checked={withExplain}
              onChange={(e) => setWithExplain(e.target.checked)}
              className="h-4 w-4 accent-[#00726C]"
            />
            <span className="text-sm text-[#2D2D2D]">
              {tr('連答案同解析一齊印（練習用）', 'Include answers and explanations (practice mode)')}
              <span className="ml-1 text-xs text-[#9CA3AF]">
                {tr('唔剔＝純題目，當模擬考', 'Unchecked = questions only, like a real exam')}
              </span>
            </span>
          </label>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={generate}
              className="min-h-11 inline-flex items-center gap-2 rounded-lg bg-[#00726C] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#005F5A]"
            >
              <RefreshCw size={15} /> {paper ? tr('換一份', 'Regenerate') : tr('生成試卷', 'Generate paper')}
            </button>
            {paper && (
              <button
                onClick={() => window.print()}
                className="min-h-11 inline-flex items-center gap-2 rounded-lg border border-[#008B84]/40 px-4 py-2 text-sm font-medium text-[#00726C] transition-colors hover:bg-[#008B84]/[0.06]"
              >
                <Printer size={15} /> {tr('打印 / 儲存做 PDF', 'Print / Save as PDF')}
              </button>
            )}
          </div>

          {paper && (
            <div className="mt-4 rounded-xl border border-[#008B84]/25 bg-[#008B84]/[0.06] p-3 text-sm text-[#00635E]">
              <p>
                {tr(
                  `已生成 ${paper.items.length} 題。「打印」個窗入面揀「另存為 PDF」就有電子檔。`,
                  `${paper.items.length} questions ready. In the print dialog choose “Save as PDF” for a file.`,
                )}
              </p>
              <p className="mt-1">
                {tr('做完紙筆之後，去 ', 'When you have finished on paper, go to ')}
                <Link href={`/answer-sheet?p=${encodePaperCode(paper.spec)}`} className="font-medium underline underline-offset-2">
                  {tr('對答案頁', 'the answer sheet')}
                </Link>
                {tr('（卷號已印喺張紙下面，任何裝置都開得返同一份）。', ' (the paper code is printed at the bottom — it reopens the same paper on any device).')}
              </p>
            </div>
          )}

          {paper === null && (
            <p className="mt-4 text-xs text-[#9CA3AF]">
              {tr('撳「生成試卷」就會即刻喺下面出現預覽。', 'Press “Generate paper” and a preview appears below.')}
            </p>
          )}
        </div>
      </div>

      {/* ── A4 卷面（螢幕預覽 + 打印本體）───────────────────────────── */}
      {paper && (
        <article className="paper-sheet mt-8 rounded-2xl border border-black/[0.08] bg-white p-8 text-[#1A1A1A]">
          <header className="mb-5 border-b border-black/15 pb-3">
            <h2 className="text-lg font-semibold">
              DSE Level Up — {tr('紙筆戰士', 'Paper Warrior')}
            </h2>
            <p className="mt-0.5 text-xs text-[#4A4A4A]">
              {tr('科目', 'Subject')}：{en ? subjectMeta?.nameEn : subjectMeta?.name}
              {' ｜ '}
              {tr('題數', 'Questions')}：{paper.items.length}
              {' ｜ '}
              {tr('模式', 'Mode')}：
              {withExplain ? tr('連解析', 'With explanations') : tr('純題目', 'Questions only')}
            </p>
            <p className="mt-0.5 text-xs text-[#4A4A4A]">
              {tr('姓名', 'Name')}：____________________　{tr('日期', 'Date')}：____________________
            </p>
          </header>

          <ol className="space-y-5">
            {paper.items.map((item, i) => (
              <li key={item.question.id} className="paper-q break-inside-avoid">
                <div className="text-sm font-medium leading-relaxed">
                  {i + 1}. <MathText>{tr(item.question.content, item.question.contentEn ?? item.question.content)}</MathText>
                </div>
                <ul className="mt-1.5 space-y-1 pl-5">
                  {item.options.map((opt, oi) => (
                    <li key={oi} className="text-sm leading-relaxed">
                      {LETTERS[oi]}.{' '}
                      <MathText>{en ? item.optionsEn[oi] : opt}</MathText>
                    </li>
                  ))}
                </ul>
                <p className="mt-1.5 pl-5 text-sm tracking-wide text-[#4A4A4A]">
                  {tr('作答', 'Answer')}：
                  {item.options.map((_, oi) => (
                    <span key={oi} className="mr-3">
                      ☐ {LETTERS[oi]}
                    </span>
                  ))}
                </p>

                {withExplain && (
                  <div className="mt-2 ml-5 border-l-2 border-[#008B84]/40 pl-3 text-xs leading-relaxed text-[#4A4A4A]">
                    <p>
                      <span className="font-medium text-[#00635E]">{tr('答案', 'Answer')}：</span>
                      {/* 引選項內容，唔淨係引字母 —— 對答案時唔會撈亂 */}
                      <MathText>{en ? item.optionsEn[item.answerIndex] : item.options[item.answerIndex]}</MathText>
                    </p>
                    <p className="mt-1">
                      <span className="font-medium text-[#00635E]">{tr('解析', 'Why')}：</span>
                      <MathText>
                        {tr(item.question.explanation, item.question.explanationEn ?? item.question.explanation)}
                      </MathText>
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ol>

          <footer className="mt-6 border-t border-black/15 pt-3 text-xs text-[#4A4A4A]">
            <p className="font-medium">
              {tr('卷號', 'Paper code')}：<span className="tracking-wider">{encodePaperCode(paper.spec)}</span>
            </p>
            <p className="mt-0.5">
              {tr(
                '做完想對答案：喺 DSE Level Up 開「紙筆戰士 → 對答案」，打返上面個卷號就會重開同一份卷。',
                'To check your answers: open “Paper Warrior → Answer sheet” on DSE Level Up and enter the paper code above.',
              )}
            </p>
            <p className="mt-1.5 text-[#6B6B6B]">
              {tr(
                '本平台試題為獨立改寫版本，並非香港考試及評核局（HKEAA）官方試題。',
                'Questions are independently rewritten and are not HKEAA official exam papers.',
              )}
            </p>
          </footer>
        </article>
      )}

      {paper === null && (
        <div className="no-print mt-8 rounded-2xl border border-black/[0.06] bg-white p-8 text-center text-sm text-[#6B6B6B]">
          {tr('仲未有卷。撳上面「生成試卷」開始。', 'No paper yet — press “Generate paper” above to start.')}
        </div>
      )}

      <p className="no-print mt-6 text-center text-sm">
        <Link href="/answer-sheet" className="inline-flex min-h-11 items-center gap-1.5 text-[#00726C] hover:underline">
          {tr('已經做完紙筆？去對答案', 'Already finished on paper? Check your answers')} <ArrowRight size={15} />
        </Link>
      </p>
    </div>
  )
}
