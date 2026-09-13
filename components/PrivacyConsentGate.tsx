'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLocale } from '@/lib/i18n'
import { useAuthSession } from '@/lib/auth/session'
import {
  CONSENT_POINTS,
  DECLINE_NOTE,
  CONSENT_LOCAL_KEY,
  POLICY_VERSION,
  type ConsentState,
} from '@/lib/privacy/consent'

// 私隱政策同意閘（Phase 2，選項 B）。
//
// ⚠️ 呢個【唔係】一道牆。撳「而家唔好」之後，成個網站照用得晒 ——
// 所有題目、所有科目、所有 SEN 功能，一樣都唔會少。唯一分別係唔開雲端同步。
// 實作上靠 SyncProvider 只喺 granted 先同步（見 lib/privacy/consent.ts 檔頭）。
//
// 大愛設計（憲章 §7）落到呢一版嘅具體要求：
//   · 唔可以擋住去路 —— 兩個掣都關得到，冇一個係死路
//   · 「而家唔好」唔可以寫成負面選擇，亦唔可以細過「同意」個掣
//   · 唔可以講「你必須同意先可以繼續」—— 呢句喺呢度係假話
//   · 唔可以彈完又彈：本機記住問過（CONSENT_LOCAL_KEY），版本 bump 先再問

export default function PrivacyConsentGate() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const { status: authStatus } = useAuthSession()
  const [state, setState] = useState<ConsentState>('unknown')
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [failed, setFailed] = useState(false)

  // 登入之後查一次：呢個人同意咗現行版本未？
  useEffect(() => {
    if (authStatus !== 'authenticated') {
      setOpen(false)
      return
    }
    let alive = true
    fetch('/api/privacy/consent')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j: { consented?: boolean }) => {
        if (!alive) return
        if (j.consented) {
          setState('granted')
          return
        }
        // 未同意現行版本。本機記住呢個 session 問過未，避免跳頁就彈多次。
        let asked: string | null = null
        try {
          asked = localStorage.getItem(CONSENT_LOCAL_KEY)
        } catch {
          /* private mode */
        }
        setState('declined')
        if (asked !== POLICY_VERSION) setOpen(true)
      })
      .catch(() => {
        // 查唔到就唔彈 —— 網絡差唔應該變成一個彈窗。下次再查。
        if (alive) setState('unknown')
      })
    return () => {
      alive = false
    }
  }, [authStatus])

  const remember = () => {
    try {
      localStorage.setItem(CONSENT_LOCAL_KEY, POLICY_VERSION)
    } catch {
      /* private mode — 下次再問，冇壞 */
    }
  }

  const accept = async () => {
    setSaving(true)
    setFailed(false)
    try {
      const res = await fetch('/api/privacy/consent', { method: 'POST' })
      if (!res.ok) throw new Error(String(res.status))
      setState('granted')
      remember()
      setOpen(false)
      // 話畀 SyncProvider 知可以開始同步（唔使等下一次 reload）。
      window.dispatchEvent(new Event('dse:consent-changed'))
    } catch {
      // 寫唔入就【唔可以扮成功】—— 扮咗，學生會以為進度跟得到佢，但唔會。
      setFailed(true)
    } finally {
      setSaving(false)
    }
  }

  const decline = () => {
    setState('declined')
    remember()
    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-title"
      className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/40 p-4 sm:items-center"
    >
      <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-line bg-surface-raised p-6 shadow-xl">
        <h2 id="consent-title" className="text-xl font-medium text-ink">
          {en ? 'Before your progress leaves this device' : '喺你嘅進度離開呢部機之前'}
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          {en
            ? 'You signed in, so we can sync your progress across devices. Here is exactly what that means — three questions, three answers.'
            : '你登入咗，即係話我哋可以幫你將進度同步到第二部機。呢件事實際上係咩，三條問題答晒你。'}
        </p>

        <dl className="mt-5 space-y-4">
          {CONSENT_POINTS.map((p) => (
            <div key={p.q.en}>
              <dt className="text-sm font-medium text-ink">{en ? p.q.en : p.q.zh}</dt>
              <dd className="mt-1 text-sm text-ink-soft">{en ? p.a.en : p.a.zh}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-5 rounded-xl border border-line bg-surface p-3 text-sm text-ink-soft">
          {en ? DECLINE_NOTE.en : DECLINE_NOTE.zh}
        </p>

        {failed && (
          <p className="mt-4 rounded-xl border border-gold/40 bg-gold/[0.08] p-3 text-sm text-ink-soft">
            {en
              ? 'That did not save, so we have not turned syncing on — we will not pretend it worked. Your practice is safe on this device either way. Try again in a moment.'
              : '記唔到入去，所以我哋冇開同步 —— 唔會扮咗做完。無論點你部機入面嘅練習一個字都冇少。等陣再試。'}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={accept}
            disabled={saving}
            className="min-h-11 flex-1 rounded-xl bg-accent-strong px-5 font-medium text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {saving ? (en ? 'Saving…' : '記緊…') : en ? 'Yes, sync my progress' : '好，幫我同步進度'}
          </button>
          <button
            onClick={decline}
            className="min-h-11 flex-1 rounded-xl border border-line-strong px-5 font-medium text-ink-soft transition-colors hover:border-accent hover:text-accent"
          >
            {en ? 'Not now — keep it on this device' : '而家唔好 —— 留喺呢部機'}
          </button>
        </div>

        {/* 同意閘上通往完整私隱政策嘅連結。個 Link 冇自己嘅顏色，繼承呢個 p —— 
            用 ink-faint 等於叫學生喺 2.91 對比之下揾一條佢有權睇嘅政策。 */}
        <p className="mt-4 text-center text-xs text-ink-muted">
          <Link href="/privacy" className="underline underline-offset-2 hover:text-accent">
            {en ? 'Read the full privacy policy' : '睇完整私隱政策'}
          </Link>
        </p>
      </div>
    </div>
  )
}
