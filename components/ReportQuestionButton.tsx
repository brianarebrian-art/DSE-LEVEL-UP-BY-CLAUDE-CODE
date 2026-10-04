'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useLocale } from '@/lib/i18n'
import { CATEGORIES, type CategoryKey } from '@/lib/questionReport'

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
// ══ 2026-10-04：可以直接送出（審計 #7，創辦人回覆「a」）══
// 「送出」只傳學生【揀】的內容：題號、問題類別、介面語言（lib/questionReport.ts，
// 表 question_reports）。學生自己寫的描述不會傳到本站，只會經學生自己的電郵寄出
// （憲章 §16.E 約束 5）。不記帳戶、IP 或裝置。
// 送出失敗（包括資料表未建立）一定會顯示，並指向電郵；只有伺服器回覆 { ok: true }
// 才顯示「收到」，避免重犯「有個掣但寫入唔到」的錯。
const REPORT_EMAIL = 'dselevelup@gmail.com'

export { CATEGORIES }

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
  // 撳咗「用電郵寄出」：只代表郵件程式已開啟（或者冇反應），唔代表已寄出。
  const [prepared, setPrepared] = useState(false)
  const [send, setSend] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)

  // 換咗第二條題就清空 —— 否則上一條題打咗嘅描述會跟住去下一條，
  // 學生一唔為意就寄咗段對唔上號嘅文字畀我哋。
  useEffect(() => {
    setCat('answer')
    setDetail('')
    setCopied(false)
    setPrepared(false)
    setSend('idle')
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
      setPrepared(false)
      setSend((s) => (s === 'sent' ? s : 'idle'))
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

  // 只送題號、類別、語言 —— detail（學生寫的字）刻意不送。
  const submit = async () => {
    setSend('sending')
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ questionId, category: cat, locale: en ? 'en' : 'zh' }),
      })
      const data = (await res.json().catch(() => null)) as { ok?: boolean } | null
      setSend(res.ok && data?.ok === true ? 'sent' : 'failed')
    } catch {
      setSend('failed')
    }
  }

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
                  ? 'Pick the kind of problem and press Send. We receive only the question ID and the kind of problem, not who you are. A person reads every report; if we are wrong, the question gets fixed or withdrawn.'
                  : '揀問題類別，撳「送出」就得。我哋只會收到題號同問題類別，唔會知道你係邊個。每一份都有真人睇；如果證實係我哋錯，條題會改或者落架。'}
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

              <button
                type="button"
                onClick={submit}
                disabled={send === 'sending' || send === 'sent'}
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-accent-strong px-4 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60"
              >
                {send === 'sending' ? (en ? 'Sending…' : '傳送緊…') : send === 'sent' ? (en ? 'Sent' : '已送出') : en ? 'Send' : '送出'}
              </button>
              <p aria-live="polite" className="mt-2 text-xs leading-relaxed text-ink-muted">
                {send === 'sent'
                  ? en
                    ? 'Received. Thank you — we will look at this question.'
                    : '收到，多謝你！我哋會睇吓呢條題。'
                  : send === 'failed'
                    ? en
                      ? 'It did not go through. Please send it by email below instead.'
                      : '傳送唔到。請用下面嘅電郵寄出。'
                    : ''}
              </p>

              {/* 學生自己寫的描述只經學生自己的電郵寄出，本站不儲存（憲章 §16.E 約束 5）。 */}
              <h3 className="mt-5 border-t border-line pt-4 text-sm font-medium text-ink">
                {en ? 'Want to tell us more? Send it by email' : '想講多啲？用電郵寄'}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                {en
                  ? 'What you write here goes only through your own email app. This site does not store it.'
                  : '呢度寫嘅字只會經你自己嘅電郵寄出，本站唔會儲存。'}
              </p>
              <label htmlFor="report-detail" className="mt-3 block text-xs font-medium text-ink-soft">
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
                {en ? 'This is what the email will say' : '電郵內容就係呢啲'}
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
                  onClick={() => setPrepared(true)}
                  className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-line-strong px-4 text-sm text-ink-soft transition-colors hover:border-accent/40 hover:text-accent"
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
                {prepared && !copied
                  ? en
                    ? `Report prepared. It is only sent when you press Send in your email app. If nothing opened, copy the text and send it to ${REPORT_EMAIL}.`
                    : `報告已準備。要喺你嘅電郵程式撳「傳送」先算寄出；如果乜都冇彈出嚟，複製上面段字寄去 ${REPORT_EMAIL}。`
                  : copied
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
