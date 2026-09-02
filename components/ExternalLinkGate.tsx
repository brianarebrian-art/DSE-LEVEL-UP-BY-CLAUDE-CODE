'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useLocale } from '@/lib/i18n'

// 第三方出口閘門。
//
// ══ 點解需要 ══
// 我哋嘅用戶係 12–18 歲。當一條連結由「呼吸空間」「戰友集結區」呢類心理支援脈絡
// 彈出去，學生會帶住對本站嘅信任行過去 —— 但過咗界之後，帳戶規則、私訊規則、
// 私隱規則全部唔再係我哋管。出事嘅話，公眾一樣會算落平台度。
//
// 舊做法係喺頁面【底部】寫一段「呢個唔係官方頻道」。問題係 CTA 喺免責【上面】——
// 學生撳完就已經離開咗，先至有機會碌到嗰段字。免責喺點擊之後出現，等於冇免責。
//
// ══ 設計取態 ══
// 呢個係【知情同意嘅減速帶】，唔係鎖。`href` 照樣真實保留喺 <a> 上面，所以：
//   • 中鍵／右鍵「喺新分頁開啟」照用（唔會整爛正常瀏覽習慣）
//   • 螢幕閱讀器同爬蟲睇得到真實目的地
//   • 用戶想繞過梗係繞得到 —— 我哋要嘅係「佢知道自己去緊邊」，唔係攔住佢
//
// 目的地【一定要顯示真實 host】而唔係我哋自己寫嘅平台名：寫死嘅名可以同 href
// 唔一致（將來有人改咗 href 但忘記改名），真實 host 由 URL 即時解析，唔會講大話。
export default function ExternalLinkGate({
  href,
  platform,
  children,
  className,
  style,
  extraWarning,
}: {
  href: string
  /**
   * 平台俗名，只作文案用；真實 host 一律由 href 解析。
   * 需要中英分流嘅話由呼叫方傳 `en ? … : …`（全站慣例，i18n-guard 認呢個式）。
   */
  platform: string
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  /** 高風險目的地（例如陌生人社群）額外加一句；同樣由呼叫方做語言分流。 */
  extraWarning?: string
}) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [open, setOpen] = useState(false)
  const cancelRef = useRef<HTMLButtonElement>(null)

  // host 由真實 href 解析 —— 唔信任何人手填嘅名。URL 解析失敗就顯示原字串。
  let host = href
  try {
    host = new URL(href, 'https://dse-level-up-by-claude-code.vercel.app').host
  } catch {
    /* 保持原值 */
  }

  useEffect(() => {
    if (!open) return
    cancelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const proceed = () => {
    setOpen(false)
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
        onClick={(e) => {
          // 中鍵／Cmd／Ctrl／Shift 點擊 = 用戶明確想直接開新分頁，唔攔。
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
          e.preventDefault()
          setOpen(true)
        }}
      >
        {children}
      </a>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-scrim p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="elg-title"
            className="w-full max-w-sm rounded-2xl border border-line-strong bg-surface-raised p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="elg-title" className="text-base font-bold text-ink">
              {en ? 'You’re about to leave DSE Level Up' : '你即將離開 DSE Level Up'}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {en ? 'Destination: ' : '前往：'}
              <span className="font-mono font-medium text-accent-strong">{host}</span>
              {en ? ` (${platform})` : `（${platform}）`}
            </p>

            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {en
                ? 'Accounts, direct messages, content rules and privacy on that site are managed by them, not by us. Our '
                : '該平台嘅帳戶、私訊、內容規則同私隱政策由對方管理，唔受我哋控制。你一離開，我哋嘅'}
              <Link href="/privacy" className="font-medium text-accent-strong underline underline-offset-2">
                {en ? 'privacy policy' : '私隱政策'}
              </Link>
              {en ? ' and our ' : '同'}
              <Link href="/community-safety" className="font-medium text-accent-strong underline underline-offset-2">
                {en ? 'community guidelines' : '社群安全守則'}
              </Link>
              {en ? ' do not apply once you are there.' : '就唔再適用。'}
            </p>

            {extraWarning && (
              <p className="mt-3 rounded-xl border border-gold/25 bg-gold/[0.06] p-3 text-sm leading-relaxed text-ink-soft">
                {extraWarning}
              </p>
            )}

            <div className="mt-5 flex gap-2">
              <button
                ref={cancelRef}
                onClick={() => setOpen(false)}
                className="min-h-11 flex-1 rounded-xl border border-line-strong bg-surface-raised px-4 text-sm font-medium text-ink-soft transition-colors hover:bg-surface-sunken"
              >
                {en ? 'Stay here' : '留喺呢度'}
              </button>
              <button
                onClick={proceed}
                className="min-h-11 flex-1 rounded-xl bg-accent-strong px-4 text-sm font-medium text-on-accent transition-opacity hover:opacity-90"
              >
                {en ? 'Continue' : '繼續前往'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
