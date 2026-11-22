"use client"
import { useEffect, useState } from 'react'
import { noteFilename } from '@/lib/notes/topicLearning'

/** Native printing keeps text selectable and SVG QR sharp, without a PDF SDK. */
export default function StudyNoteActions({subject, topic}:{subject:string; topic:string}) {
  const [message,setMessage] = useState('')
  const [busy,setBusy] = useState(false)
  const [ready,setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])
  async function print(pdf:boolean) {
    setBusy(true)
    setMessage('正在準備字型及圖片…') // i18n-exempt: requested Traditional Chinese print status
    const title = document.title
    let timeout: ReturnType<typeof setTimeout> | undefined
    try {
      const resources = Promise.all([
        document.fonts.ready,
        ...Array.from(document.querySelectorAll<HTMLImageElement>('#topic-study-note img')).map(img => {
          img.loading = 'eager'
          return img.complete && img.naturalWidth > 0 ? Promise.resolve() : img.decode()
        }),
      ])
      await Promise.race([resources, new Promise((_,reject) => {
        timeout = setTimeout(() => reject(new Error('Print resources timed out')), 15000)
      })])
      document.title = noteFilename(subject, topic)
      setMessage(pdf ? '請在列印視窗選擇「儲存為 PDF」；iPhone 可使用列印預覽的分享功能儲存。尚未確認儲存完成。' : '列印視窗已要求開啟；請檢查 A4 排版與最後一頁 QR 碼。') // i18n-exempt: requested Traditional Chinese print status
      window.print()
    } catch {
      setMessage('未能開啟列印。請使用瀏覽器選單的「列印」或分享功能，選擇 A4 並保留最後一頁 QR 碼。') // i18n-exempt: requested Traditional Chinese print status
    } finally {
      clearTimeout(timeout)
      document.title = title
      setBusy(false)
    }
  }
  return <div className="no-print space-y-3" lang="zh-HK">
    <div className="flex flex-wrap gap-3">
      <button type="button" disabled={!ready || busy} onClick={() => void print(true)} className="min-h-12 rounded-xl bg-accent-strong px-4 py-3 text-sm font-semibold text-on-accent hover:bg-accent-hover focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60">儲存 PDF（列印）{/* i18n-exempt: requested Traditional Chinese controls */}</button>
      <button type="button" disabled={!ready || busy} onClick={() => void print(false)} className="min-h-12 rounded-xl border border-line-strong bg-surface-raised px-4 py-3 text-sm font-semibold text-ink hover:bg-surface-sunken focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-accent disabled:cursor-wait disabled:opacity-60">列印筆記{/* i18n-exempt: requested Traditional Chinese controls */}</button>
    </div>
    <p className="text-sm leading-7 text-ink-muted">PDF 使用瀏覽器原生列印，不會直接下載檔案。選擇 A4；如需每頁頁碼，請啟用瀏覽器的頁首及頁尾（不同手機支援不同）。{/* i18n-exempt: requested Traditional Chinese instructions */}</p>
    <p className="text-sm leading-7 text-ink-muted" role="status" aria-live="polite">{message}</p>
    <noscript>請使用瀏覽器選單的「列印」或分享功能，儲存為 PDF。{/* i18n-exempt: requested Traditional Chinese instructions */}</noscript>
  </div>
}
