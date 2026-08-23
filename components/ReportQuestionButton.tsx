'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocale } from '@/lib/i18n'

// 題目勘誤入口 —— 學生見到題目有問題，喺當場報得返。
//
// ══ 點解要有呢樣嘢 ══
// 題庫五千幾條，真人逐條睇唔曬。2026-08-21 掃描揪到七條機器翻譯殘句
// （「廉頗雖老仍思report國」——「思報國」被翻譯器食咗，直接改咗典故意思），
// 係我掃描先發現，唔係學生報上嚟。學生係最密嘅一張網，之前張網開口太細。
//
// ══ 由 QuestionProvenance 抽出嚟嘅原因 ══
// 舊版報錯係 QuestionProvenance 入面一條 11px mailto 文字連結，只出現喺練習頁。
// 抽成獨立元件之後：(a) 標記／錯題頁一樣用得，(b) 可以喺寄之前揀分類，
// (c) 最重要 —— 補返一個唔靠郵件程式嘅退路。
//
// ══ 點解一定要有「複製」呢個退路 ══
// mailto 喺冇設定郵件程式嘅裝置上【完全靜默】：撳落去乜都唔會發生，
// 學生以為報咗，其實乜都冇。呢個比冇掣更差 —— 同 /relax/group 嗰個寫入
// 一張從未存在嘅表嘅 email 表單係同一種錯。
// 所以個對話框永遠攤開報告全文（唔係淨係一個「複製」掣）：就算剪貼板 API
// 失敗、就算冇郵件程式，學生都仲可以自己揀字複製，用任何方式寄畀我哋。
//
// ══ 唔存任何嘢 ══
// 冇 localStorage、冇 API、冇資料表。學生打嘅字只會去佢自己揀嘅地方。
// 唔係做唔到後端，而係「有個掣但寫入唔到」嘅風險，喺呢個平台已經出過一次。
const REPORT_EMAIL = 'dselevelup@gmail.com'

/** 分類要係學生講得出口嘅話，唔係內部術語 —— 揀錯類都好過唔報。 */
export const CATEGORIES = [
  { key: 'answer', zh: '答案好似唔啱', en: 'The answer looks wrong' },
  { key: 'explain', zh: '解析講唔通 ／ 同答案對唔上', en: 'The explanation does not follow' },
  { key: 'wording', zh: '題目寫得唔清楚 ／ 有歧義', en: 'The question is unclear or ambiguous' },
  { key: 'display', zh: '排版、公式或顯示有問題', en: 'Formatting, formula or display problem' },
  { key: 'scope', zh: '超出課程範圍 ／ 難度標錯', en: 'Outside the syllabus, or mislabelled difficulty' },
  { key: 'copyright', zh: '懷疑抄咗官方試題', en: 'Looks copied from an official paper' },
  { key: 'other', zh: '其他', en: 'Something else' },
] as const

type CategoryKey = (typeof CATEGORIES)[number]['key']

/** 組成報告全文 —— mailto 同「自己複製」用同一份，唔會兩邊唔一致。 */
export function composeReport(questionId: string, cat: CategoryKey, detail: string, en: boolean): string {
  const label = CATEGORIES.find((c) => c.key === cat)
  const lines = en
    ? [
        `Question ID: ${questionId}`,
        `Issue type: ${label?.en ?? cat}`,
        '',
        'What I noticed:',
        detail.trim() || '(not filled in)',
      ]
    : [
        `題號：${questionId}`,
        `問題類別：${label?.zh ?? cat}`,
        '',
        '我發現嘅問題：', // i18n-exempt: 同一個三元式上面有英文版 'What I noticed:'
        detail.trim() || '（未填）', // i18n-exempt: 對應上面 '(not filled in)'
      ]
  return lines.join('\n')
}

function mailtoHref(questionId: string, body: string, en: boolean): string {
  const subject = en
    ? `[DSE Level Up] Question issue: ${questionId}`
    : `[DSE Level Up] 題目問題：${questionId}`
  return `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export default function ReportQuestionButton({
  questionId,
  variant = 'inline',
}: {
  questionId: string
  /** inline＝解析區腳註連結；standalone＝卡片上獨立細掣（標記／錯題頁用）。 */
  variant?: 'inline' | 'standalone'
}) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [open, setOpen] = useState(false)
  const [cat, setCat] = useState<CategoryKey>('answer')
  const [detail, setDetail] = useState('')
  const [copied, setCopied] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)

  // 換咗第二條題就清空 —— 否則上一條題打咗嘅描述會跟住去下一條，
  // 學生一唔為意就寄咗段對唔上號嘅文字畀我哋。
  useEffect(() => {
    setCat('answer')
    setDetail('')
    setCopied(false)
  }, [questionId])

  useEffect(() => {
    if (open) {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false)
      }
      document.addEventListener('keydown', onKey)
      // 焦點落喺對話框本身而唔係第一個掣仔：對話框內容喺手機比一屏長，
      // 聚焦第一個掣仔會令瀏覽器捲到佢嗰度，標題同「有真人睇」嗰句直接被推出畫面。
      panelRef.current?.focus({ preventScroll: true })
      if (panelRef.current) panelRef.current.scrollTop = 0
      setCopied(false)
      wasOpen.current = true
      return () => document.removeEventListener('keydown', onKey)
    }
    // 只喺「由開變閂」嗰刻還原焦點。冇 wasOpen 呢個守衛的話，
    // 元件一掛載（open=false）就會即刻搶焦點 —— 學生每答完一題，
    // 焦點就會無端端跳去報錯掣度。
    if (wasOpen.current) {
      wasOpen.current = false
      triggerRef.current?.focus({ preventScroll: true })
    }
  }, [open])

  const body = composeReport(questionId, cat, detail, en)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(body)
      setCopied(true)
    } catch {
      // 剪貼板權限被拒／非安全來源：唔扮成功。下面個 textarea 一直攤開，
      // 學生自己揀字照樣複製到。
      setCopied(false)
    }
  }

  const triggerClass =
    variant === 'inline'
      ? 'text-accent hover:underline'
      : 'inline-flex min-h-11 items-center gap-1.5 text-xs text-ink-muted transition-colors hover:text-accent'

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className={triggerClass}
      >
        {en ? 'Something wrong with this question?' : '呢條題有問題？話我哋知'}
      </button>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          /* z-[100]：練習頁左下角工具角係 z-50、休息遮罩 z-[70]，唔蓋過就會有掣浮喺
               對話框之上（實測手機 375px 下「用電郵寄出」被字級掣壓住）。
               同 ExternalLinkGate 用同一層 —— 兩個遮罩唔會同時出現。 */
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-title"
            className="fixed inset-0 z-[100] flex items-end justify-center bg-surface/95 p-4 backdrop-blur-sm sm:items-center"
          >
            <div
              ref={panelRef}
              tabIndex={-1}
              className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-line bg-surface-raised p-5 focus:outline-none"
            >
              <h2 id="report-title" className="text-base font-medium text-ink">
                {en ? 'Report a problem with this question' : '報告呢條題嘅問題'}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                {en
                  ? 'A person reads every report. If it turns out we are wrong, the question gets fixed or withdrawn.'
                  : '每一封都有真人睇。如果證實係我哋錯，條題會改或者落架。'}
              </p>
              <p className="mt-2 font-mono text-[11px] text-ink-muted">
                {en ? 'Question ID' : '題號'}: {questionId}
              </p>

              <fieldset className="mt-4">
                <legend className="mb-2 text-xs font-medium text-ink-soft">
                  {en ? 'What kind of problem?' : '係邊一類問題？'}
                </legend>
                <div className="space-y-1">
                  {CATEGORIES.map((c) => (
                    <label
                      key={c.key}
                      className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg px-2 text-sm text-ink-soft hover:bg-surface-sunken"
                    >
                      <input
                        type="radio"
                        name="report-category"
                        value={c.key}
                        checked={cat === c.key}
                        onChange={() => setCat(c.key)}
                        className="h-4 w-4 shrink-0 accent-[var(--color-accent-strong)]"
                      />
                      <span>{en ? c.en : c.zh}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label htmlFor="report-detail" className="mt-4 block text-xs font-medium text-ink-soft">
                {en ? 'What did you notice? (optional)' : '你發現咗咩？（可以唔填）'}
              </label>
              <textarea
                id="report-detail"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                rows={3}
                className="mt-1.5 w-full rounded-lg border border-line-strong bg-surface px-3 py-2 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                placeholder={
                  en ? 'e.g. option 2 also works because…' : '例如：第二個選項其實都啱，因為⋯⋯'
                }
              />

              {/* 報告全文永遠攤開 —— 就算冇郵件程式、就算剪貼板失敗，
                  學生都仲可以自己揀字。呢度係唯一唔會靜默失敗嘅一條路。 */}
              <label htmlFor="report-preview" className="mt-4 block text-xs font-medium text-ink-soft">
                {en ? 'This is what gets sent' : '寄出去嘅就係呢啲'}
              </label>
              <textarea
                id="report-preview"
                readOnly
                value={body}
                rows={5}
                className="mt-1.5 w-full rounded-lg border border-line bg-surface-sunken px-3 py-2 font-mono text-[11px] leading-relaxed text-ink-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              />

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={mailtoHref(questionId, body, en)}
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-accent-strong px-4 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
                >
                  {en ? 'Open email app' : '用電郵寄出'}
                </a>
                <button
                  type="button"
                  onClick={copy}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-line-strong px-4 text-sm text-ink-soft transition-colors hover:border-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                >
                  {en ? 'Copy the text' : '複製內容'}
                </button>
              </div>

              {/* 「冇郵件程式」嘅出路要寫明 —— 唔可以假設每部裝置都撳得郵件連結。 */}
              <p aria-live="polite" className="mt-2 text-[11px] leading-relaxed text-ink-muted">
                {copied
                  ? en
                    ? `Copied. Send it to ${REPORT_EMAIL} however you like.`
                    : `已複製。用任何方式寄去 ${REPORT_EMAIL} 都得。`
                  : en
                    ? `No email app? Copy the text above and send it to ${REPORT_EMAIL} any way you like.`
                    : `冇郵件程式？複製上面段字，用任何方式寄去 ${REPORT_EMAIL} 都得。`}
              </p>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-3 min-h-11 w-full rounded-lg text-sm text-ink-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
              >
                {en ? 'Close' : '閂咗佢'}
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
