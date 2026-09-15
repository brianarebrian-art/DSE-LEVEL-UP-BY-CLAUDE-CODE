'use client'

import { useEffect, useState } from 'react'
import { Smartphone, X } from 'lucide-react'
import { useLocale } from '@/lib/i18n'

// 「加到主畫面」輕提示（首頁）—— 2026-09-15，回應《v4 Final Lean》§7。
//
// ══ 設計紅線（憲章 §7：唔准製造壓力）══
// · 撳過「唔使喇」就【永遠】唔再出（localStorage）。一個每次開都彈嘅提示，
//   對焦慮嘅學生嚟講就係另一件「未做嘅事」。
// · 已經裝咗（display-mode: standalone）唔出。
// · 唔係彈窗、唔遮內容、唔阻任何操作。
// · 瀏覽器唔支援就乜都唔出 —— 唔教學生做一樣佢部機做唔到嘅嘢。
//
// ══ 兩條路 ══
// · Chrome／Edge／Android：瀏覽器會派 beforeinstallprompt。攔住佢，學生撳掣先叫
//   prompt()。冇派（未符合安裝條件、已經裝咗）就唔出。
// · iOS Safari：冇 beforeinstallprompt，只可以教佢「分享 → 加至主畫面」。
//
// ⚠️ DISMISS_KEY 刻意唔入 lib/sync.ts（憲章 §16.E：上雲 key 要創辦人書面批准）。

const DISMISS_KEY = 'dse_install_hint_dismissed'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type Mode = 'hidden' | 'prompt' | 'ios'

function isStandalone(): boolean {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isIosSafari(): boolean {
  const ua = navigator.userAgent
  // iPadOS 13+ 扮 Mac，要靠觸控點數分辨
  const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
  // iOS 上面嘅 Chrome／Firefox（CriOS／FxiOS）加唔到主畫面
  return ios && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua)
}

export default function InstallHint() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [mode, setMode] = useState<Mode>('hidden')
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    try {
      if (localStorage.getItem(DISMISS_KEY) === '1') return
    } catch {
      return // 儲存被封鎖 —— 記唔住「已關」，就寧願唔出，免得每次都彈
    }
    if (isStandalone()) return
    if (isIosSafari()) {
      setMode('ios')
      return
    }
    const onPrompt = (e: Event) => {
      e.preventDefault() // 唔好畀瀏覽器自己彈 mini-infobar；由學生決定幾時撳
      setEvt(e as BeforeInstallPromptEvent)
      setMode('prompt')
    }
    // 裝完之後收埋（佢喺同一個分頁入面裝都唔會再見到）
    const onInstalled = () => setMode('hidden')
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const dismiss = () => {
    setMode('hidden')
    try {
      localStorage.setItem(DISMISS_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  const install = async () => {
    if (!evt) return
    await evt.prompt().catch(() => {})
    // 瀏覽器規定一個事件只可以 prompt 一次；無論學生揀咩都收埋，唔再追問
    setEvt(null)
    setMode('hidden')
  }

  if (mode === 'hidden') return null

  return (
    <div className="mx-auto max-w-2xl px-4 mt-4">
      <div className="flex items-start gap-3 rounded-2xl border border-line bg-surface-raised px-4 py-3">
        <Smartphone size={18} className="text-accent shrink-0 mt-0.5" aria-hidden />
        <div className="flex-1 text-sm text-ink-soft leading-relaxed">
          {mode === 'prompt'
            ? en
              ? 'Want to open it faster? You can add DSE Level Up to your home screen — it opens like an app.'
              : '想快啲打開？可以加到主畫面，開起嚟好似 app 咁。'
            : en
              ? 'Want to open it faster? In Safari, tap Share, then “Add to Home Screen”.'
              : '想快啲打開？喺 Safari 撳「分享」，再揀「加至主畫面」。'}
          {mode === 'prompt' && (
            <button
              type="button"
              onClick={install}
              className="ml-2 min-h-11 px-3 rounded-lg text-accent-strong font-medium underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              {en ? 'Add to home screen' : '加到主畫面'}
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label={en ? 'No thanks — don’t show this again' : '唔使喇，唔好再出'}
          className="shrink-0 min-h-11 min-w-11 -mr-2 -mt-1 flex items-center justify-center rounded-lg text-ink-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <X size={16} aria-hidden />
        </button>
      </div>
    </div>
  )
}
