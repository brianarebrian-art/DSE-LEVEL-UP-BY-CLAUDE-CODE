'use client'

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { Printer, FileText, RefreshCw, ArrowRight } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import MathText from '@/components/MathText'
import { subjects } from '@/data/subjects'
// 課題清單同「有冇書寫題」→ summary.generated（靜態）。
// 出卷要嘅真題目 → load.ts 逐科 lazy loader，撳「生成試卷」先落嗰一科。
// 兩者都唔行 barrel：barrel 靜態 import 齊 25 科，喺呢個 client 檔會將
// 全部題庫 build 入瀏覽器 —— 為咗一份試卷落 25 科（2026-09-05 實測）。
import { SUBJECT_SUMMARY, SUBJECT_TOPICS } from '@/data/questions/summary.generated'
import {
  loadSubjectMCQuestions,
  loadQuestionsByTopic,
  loadWrittenQuestions,
} from '@/data/questions/load'
import type { WrittenQuestion } from '@/data/questions/types'
import QRCode from '@/components/QRCode'
import {
  answerSheetUrl,
  buildPaper,
  buildWrittenSection,
  encodePaperCode,
  newSeed,
  WRITTEN_SIZES,
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
  const [written, setWritten] = useState<number>(0)
  const [withExplain, setWithExplain] = useState(false)
  const [paper, setPaper] = useState<
    { spec: PaperSpec; items: PaperItem[]; writtenItems: WrittenQuestion[] } | null
  >(null)

  // 乙部只喺真係有書寫題嘅科目出現（現時只有中文科 26 條 long）。
  // 冇題就連個控制項都唔顯示 —— 好過畀人揀完先話「呢科冇」。
  const subjectHasWritten = useMemo(() => {
    try {
      return (SUBJECT_SUMMARY[subject]?.written ?? 0) > 0
    } catch {
      return false
    }
  }, [subject])

  const topics = useMemo(() => {
    try {
      return SUBJECT_TOPICS[subject] ?? []
    } catch {
      return []
    }
  }, [subject])

  const [busy, setBusy] = useState(false)

  const subjectMeta = activeSubjects.find((s) => s.id === subject)

  // 2026-09-05 改為 async：題目改成按需載入，所以出卷要等一個 await。
  // seed 喺 await 之前先攞 —— 攞完先 await 嘅話，連撳兩次可能撞同一個 seed。
  const generate = useCallback(async () => {
    if (busy) return
    setBusy(true)
    try {
      const wanted = subjectHasWritten ? written : 0
      const spec: PaperSpec = { subject, topic, size, seed: newSeed(), ...(wanted > 0 && { written: wanted }) }
      // 甲部只取 MC：客觀分數評級嗰部分，書寫題（自評制）唔計入
      const pool = topic ? await loadQuestionsByTopic(subject, topic) : await loadSubjectMCQuestions(subject)
      const items = buildPaper(spec, pool)
      // 乙部由全科書寫題抽（唔跟課題篩選 —— 長題目本身就跨課題，26 條再篩就幾乎抽唔到）
      const writtenItems = buildWrittenSection(spec, wanted > 0 ? await loadWrittenQuestions(subject) : [])
      setPaper(items.length > 0 ? { spec, items, writtenItems } : null)
    } finally {
      setBusy(false)
    }
  }, [subject, topic, size, written, subjectHasWritten, busy])

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* ── 設定區（打印時隱藏）───────────────────────────────────────── */}
      <div className="no-print">
        <header className="mb-6">
          <h1 className="flex items-center gap-2 text-2xl font-medium text-ink">
            <FileText size={22} className="text-accent" />
            {tr('紙筆戰士', 'Paper Warrior')}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {tr(
              '印一份出嚟，用紙同筆好好咁做一次。做完返嚟對答案，錯嘅照樣入錯題紀錄。',
              'Print a set, work through it on paper, then come back to check — your mistakes still feed your error log.',
            )}
          </p>
        </header>

        <div className="rounded-2xl border border-line bg-surface-raised p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">{tr('科目', 'Subject')}</span>
              <select
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value)
                  setTopic('')
                  setPaper(null)
                }}
                className="min-h-11 w-full rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink-soft focus:border-accent focus:outline-none"
              >
                {activeSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.emoji} {en ? s.nameEn : s.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">{tr('課題', 'Topic')}</span>
              <select
                value={topic}
                onChange={(e) => {
                  setTopic(e.target.value)
                  setPaper(null)
                }}
                className="min-h-11 w-full rounded-lg border border-line-strong bg-surface px-3 text-sm text-ink-soft focus:border-accent focus:outline-none"
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
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">{tr('題數', 'Questions')}</span>
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
                      ? 'bg-surface-sunken text-accent-strong ring-1 ring-accent/40'
                      : 'bg-line text-ink-muted hover:bg-line'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {subjectHasWritten && (
            <div className="mt-4">
              <span className="mb-1.5 block text-sm font-medium text-ink-soft">
                {tr('乙部 · 書寫題', 'Section B · written')}
              </span>
              <div className="flex flex-wrap gap-2">
                {WRITTEN_SIZES.map((n) => (
                  <button
                    key={n}
                    onClick={() => {
                      setWritten(n)
                      setPaper(null)
                    }}
                    className={`min-h-11 rounded-lg px-4 text-sm transition-colors ${
                      written === n
                        ? 'bg-surface-sunken text-accent-strong ring-1 ring-accent/40'
                        : 'bg-line text-ink-muted hover:bg-line'
                    }`}
                  >
                    {n === 0 ? tr('唔要', 'None') : n}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                {tr(
                  '書寫題冇客觀對錯，對答案時出參考答案同評分準則畀你自評，唔會計入上面嗰個分數同等級。',
                  'Written questions have no objective right answer: the answer sheet shows a model answer and marking scheme for you to self-assess. They never count toward the score or grade above.',
                )}
              </p>
            </div>
          )}

          <label className="mt-4 flex min-h-11 items-center gap-2.5">
            <input
              type="checkbox"
              checked={withExplain}
              onChange={(e) => setWithExplain(e.target.checked)}
              className="h-4 w-4 accent-accent-strong"
            />
            <span className="text-sm text-ink-soft">
              {tr('連答案同解析一齊印（練習用）', 'Include answers and explanations (practice mode)')}
              <span className="ml-1 text-xs text-ink-muted">
                {tr('唔剔＝純題目，當模擬考', 'Unchecked = questions only, like a real exam')}
              </span>
            </span>
          </label>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={generate}
              disabled={busy}
              aria-busy={busy}
              className="min-h-11 inline-flex items-center gap-2 rounded-lg bg-accent-strong px-4 py-2 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60"
            >
              <RefreshCw size={15} className={busy ? 'animate-spin' : undefined} />
              {busy ? tr('出緊卷…', 'Building…') : paper ? tr('換一份', 'Regenerate') : tr('生成試卷', 'Generate paper')}
            </button>
            {paper && (
              <button
                onClick={() => window.print()}
                className="min-h-11 inline-flex items-center gap-2 rounded-lg border border-accent/40 px-4 py-2 text-sm font-medium text-accent-strong transition-colors hover:bg-surface-sunken"
              >
                <Printer size={15} /> {tr('打印 / 儲存做 PDF', 'Print / Save as PDF')}
              </button>
            )}
          </div>

          {paper && (
            <div className="mt-4 rounded-xl border border-accent/25 bg-surface-sunken p-3 text-sm text-accent-strong">
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
            <p className="mt-4 text-xs text-ink-muted">
              {tr('撳「生成試卷」就會即刻喺下面出現預覽。', 'Press “Generate paper” and a preview appears below.')}
            </p>
          )}
        </div>
      </div>

      {/* ── A4 卷面（螢幕預覽 + 打印本體）───────────────────────────── */}
      {paper && (
        <article className="paper-sheet mt-8 rounded-2xl border border-line bg-surface-raised p-8 text-ink">
          <header className="mb-5 border-b border-line-strong pb-3">
            <h2 className="text-lg font-semibold">
              DSE Level Up — {tr('紙筆戰士', 'Paper Warrior')}
            </h2>
            <p className="mt-0.5 text-xs text-ink-soft">
              {tr('科目', 'Subject')}：{en ? subjectMeta?.nameEn : subjectMeta?.name}
              {' ｜ '}
              {tr('題數', 'Questions')}：{paper.items.length}
              {' ｜ '}
              {tr('模式', 'Mode')}：
              {withExplain ? tr('連解析', 'With explanations') : tr('純題目', 'Questions only')}
            </p>
            <p className="mt-0.5 text-xs text-ink-soft">
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
                <p className="mt-1.5 pl-5 text-sm tracking-wide text-ink-soft">
                  {tr('作答', 'Answer')}：
                  {item.options.map((_, oi) => (
                    <span key={oi} className="mr-3">
                      ☐ {LETTERS[oi]}
                    </span>
                  ))}
                </p>

                {withExplain && (
                  <div className="mt-2 ml-5 border-l-2 border-accent/40 pl-3 text-xs leading-relaxed text-ink-soft">
                    <p>
                      <span className="font-medium text-accent-strong">{tr('答案', 'Answer')}：</span>
                      {/* 引選項內容，唔淨係引字母 —— 對答案時唔會撈亂 */}
                      <MathText>{en ? item.optionsEn[item.answerIndex] : item.options[item.answerIndex]}</MathText>
                    </p>
                    <p className="mt-1">
                      <span className="font-medium text-accent-strong">{tr('解析', 'Why')}：</span>
                      <MathText>
                        {tr(item.question.explanation, item.question.explanationEn ?? item.question.explanation)}
                      </MathText>
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ol>

          {paper.writtenItems.length > 0 && (
            <section className="mt-8">
              <h2 className="border-t border-line-strong pt-4 text-sm font-medium text-ink">
                {tr('乙部 · 書寫題', 'Section B · Written')}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                {tr(
                  '書寫題冇客觀對錯。做完之後喺對答案頁對住參考答案同評分準則自評，唔會計入甲部分數。',
                  'Written questions have no objective right answer. Compare with the model answer and marking scheme on the answer sheet; they do not count toward the Section A score.',
                )}
              </p>
              <ol className="mt-4 space-y-6">
                {paper.writtenItems.map((q, i) => (
                  <li key={q.id} className="paper-q break-inside-avoid">
                    <div className="text-sm font-medium leading-relaxed">
                      {paper.items.length + i + 1}.{' '}
                      <MathText>{tr(q.content, q.contentEn ?? q.content)}</MathText>
                      <span className="ml-1 text-xs font-normal text-ink-soft">
                        （{q.marks} {tr('分', q.marks === 1 ? 'mark' : 'marks')}
                        {q.type === 'long' && q.suggestedMinutes
                          ? tr(`．建議 ${q.suggestedMinutes} 分鐘`, `, ~${q.suggestedMinutes} min`)
                          : ''}
                        ）
                      </span>
                    </div>
                    {/* 作答空間：高度按分數走（每分約 26px），設上下限令一題唔會
                        自己霸咗成版、亦唔會細到寫唔落。虛線框喺列印時保留。 */}
                    <div
                      className="paper-write-space mt-2 rounded-lg border border-dashed border-line-strong"
                      style={{ minHeight: `${Math.min(360, Math.max(110, q.marks * 26))}px` }}
                      aria-hidden
                    />
                  </li>
                ))}
              </ol>
            </section>
          )}

          {/* print-keep：呢個係卷面自己嘅頁腳，唔係網站頁腳。冇呢個 class 就會被
              print CSS 嘅 `footer` 規則一併隱藏，連卷號同免責聲明都印唔到。 */}
          <footer className="print-keep mt-6 flex items-start gap-4 border-t border-line-strong pt-3 text-xs text-ink-soft">
            {/* QR：掃一次就開對答案頁並自動填卷號，唔使人手抄 `~` 分隔符（手機鍵盤
                要切兩次符號版先打到）。內容只係公開卷號深連結，冇任何個人資料。 */}
            <QRCode value={answerSheetUrl(paper.spec)} size={84} className="shrink-0 rounded" />
            <div className="min-w-0">
            <p className="font-medium">
              {tr('卷號', 'Paper code')}：<span className="tracking-wider">{encodePaperCode(paper.spec)}</span>
            </p>
            <p className="mt-0.5">
              {tr(
                '做完想對答案：掃左邊個 QR 碼就會即刻開對答案頁；冇相機都得，喺 DSE Level Up 開「紙筆戰士 → 對答案」，打返上面個卷號一樣重開到同一份卷。',
                'To check your answers: scan the QR code on the left to open the answer sheet directly. No camera? Open “Paper Warrior → Answer sheet” on DSE Level Up and enter the paper code above.',
              )}
            </p>
            <p className="mt-1.5 text-ink-muted">
              {tr(
                '本平台試題為獨立改寫版本，並非香港考試及評核局（HKEAA）官方試題。',
                'Questions are independently rewritten and are not HKEAA official exam papers.',
              )}
            </p>
            </div>
          </footer>
        </article>
      )}

      {paper === null && (
        <div className="no-print mt-8 rounded-2xl border border-line bg-surface-raised p-8 text-center text-sm text-ink-muted">
          {tr('仲未有卷。撳上面「生成試卷」開始。', 'No paper yet — press “Generate paper” above to start.')}
        </div>
      )}

      <p className="no-print mt-6 text-center text-sm">
        <Link href="/answer-sheet" className="inline-flex min-h-11 items-center gap-1.5 text-accent-strong hover:underline">
          {tr('已經做完紙筆？去對答案', 'Already finished on paper? Check your answers')} <ArrowRight size={15} />
        </Link>
      </p>
    </div>
  )
}
