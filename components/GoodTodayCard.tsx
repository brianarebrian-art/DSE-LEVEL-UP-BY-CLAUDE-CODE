'use client'

import { useEffect, useState } from 'react'
import { Heart, Pencil, Check, X } from 'lucide-react'
import { useLocale } from '@/lib/i18n'

// 「今日已經好叻」+ 個人化鼓勵語（Emma/UDL + Sarah）。
//
// 服務對象：今日狀態差、做唔到題、但仍然開咗個站嘅學生。憲章大愛設計要求
// 平台唔可以只在「有成績」時先出聲。
//
// 設計取態 —— 呢張卡刻意【唔量度任何嘢】：
//   ✗ 唔記連續日數（streak 已於 7b16d6f 剷走，斷 streak 的愧疚傷害實在）
//   ✗ 唔記總撳次數、唔設上限、唔畀獎勵（憲章禁 gamification）
//   ✗ 唔會因為「你今日未撳」而提示 —— 呢張卡永遠唔主動追人
//   ✓ 想撳幾多次得幾多次，每次都會出一句
//   ✓ 學生可以自己寫鼓勵語；有自訂就優先抽自訂嗰批（自己講畀自己聽最有效）
//
// 儲存：純 localStorage，兩個 key，零 server、零 PII。
//   dse_good_today —— 只存「今日日期 + 今日抽中嗰句」，逐日覆寫。刻意唔存歷史：
//                      存歷史就等於做咗出席記錄，同上面「唔量度」的取態相違。
//   dse_own_cheers —— 學生自訂鼓勵語陣列。

const KEY_TODAY = 'dse_good_today'
const KEY_OWN = 'dse_own_cheers'
const MAX_OWN = 12
const MAX_LEN = 60

// 中英兩批平排，由下方 `en ? CHEERS_EN : CHEERS_ZH` 揀。i18n-guard 只認三元式，
// 睇唔到隔咗幾行嘅英文版，故此每行標 i18n-exempt —— 呢批【有】英文對照，屬誤報。
//
// 情感層刻意用廣東話（憲章容許；學術解析層先強制書面語）。措辭三條規矩：
// 唔提「落後／差／應該」，唔比較，唔要求任何產出。
const CHEERS_ZH = [
  '今日開咗個站，已經係一個決定。', // i18n-exempt: 有 CHEERS_EN 對照
  '狀態差都嚟到，呢樣嘢好多人做唔到。', // i18n-exempt: 有 CHEERS_EN 對照
  '唔使今日搞掂晒。今日做到幾多就幾多。', // i18n-exempt: 有 CHEERS_EN 對照
  // 原稿寫「你冇落後」，被情緒安全閘攔住。閘攔得啱：否定句一樣會先種低個框，
  // 講「你唔係差」本身已經令人諗起「差」。改為只講自己嗰條線，唔提比較。
  '你行緊自己嗰條線，唔使同人比較。', // i18n-exempt: 有 CHEERS_EN 對照
  '休息唔係浪費時間，係溫書嘅一部分。', // i18n-exempt: 有 CHEERS_EN 對照
  '做唔到題唔代表你唔得，可能只係今日攰。', // i18n-exempt: 有 CHEERS_EN 對照
  '你已經捱到而家，呢樣本身就唔簡單。', // i18n-exempt: 有 CHEERS_EN 對照
  '一題都好，明日嘅你會多謝今日嘅你。', // i18n-exempt: 有 CHEERS_EN 對照
]

const CHEERS_EN = [
  'You opened the site today. That was a decision.',
  'You came even though today feels rough. Not everyone does.',
  'You do not have to finish it today. Whatever you manage counts.',
  'You are not behind. You are on your own line.',
  'Resting is not wasted time. It is part of revising.',
  'A bad day at questions is not a verdict on you.',
  'You have got this far already. That is not nothing.',
  'Even one question. Tomorrow-you will be glad.',
]

const today = () => new Date().toISOString().slice(0, 10)

function readOwn(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY_OWN) ?? '[]')
    return Array.isArray(raw) ? raw.filter((s): s is string => typeof s === 'string' && !!s.trim()) : []
  } catch {
    return []
  }
}

export default function GoodTodayCard({ className = '' }: { className?: string }) {
  const { locale } = useLocale()
  const en = locale === 'en'

  const [msg, setMsg] = useState<string | null>(null)
  const [own, setOwn] = useState<string[]>([])
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  // 只在 mount 後讀 localStorage —— 避免 SSR／CSR 落差。
  useEffect(() => {
    setOwn(readOwn())
    try {
      const saved = JSON.parse(localStorage.getItem(KEY_TODAY) ?? 'null')
      if (saved?.date === today() && typeof saved.msg === 'string') setMsg(saved.msg)
    } catch {
      /* 壞資料當冇撳過，唔阻塞介面 */
    }
  }, [])

  const press = () => {
    const pool = own.length ? own : en ? CHEERS_EN : CHEERS_ZH
    // 連續撳兩次盡量唔好出同一句（只得一句嗰陣就冇得避）。
    const choices = pool.length > 1 ? pool.filter((c) => c !== msg) : pool
    const picked = choices[Math.floor(Math.random() * choices.length)]
    setMsg(picked)
    try {
      localStorage.setItem(KEY_TODAY, JSON.stringify({ date: today(), msg: picked }))
    } catch {
      /* 私隱模式下寫唔到就算，訊息照出 */
    }
  }

  const saveOwn = () => {
    const text = draft.trim().slice(0, MAX_LEN)
    if (!text) return
    const next = [...own.filter((c) => c !== text), text].slice(-MAX_OWN)
    setOwn(next)
    setDraft('')
    try {
      localStorage.setItem(KEY_OWN, JSON.stringify(next))
    } catch {
      /* 同上 */
    }
  }

  const removeOwn = (text: string) => {
    const next = own.filter((c) => c !== text)
    setOwn(next)
    try {
      localStorage.setItem(KEY_OWN, JSON.stringify(next))
    } catch {
      /* 同上 */
    }
  }

  return (
    <div className={`rounded-2xl border border-line bg-surface-raised p-5 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Heart size={16} className="text-gold shrink-0" aria-hidden />
            <h3 className="text-sm font-medium text-ink">
              {en ? 'You already did well today' : '今日已經好叻'}
            </h3>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            {en
              ? 'Press it whenever — for anything at all. No streaks, no counting.'
              : '做咗任何嘢都撳得。唔記連續日數，唔計次數。'}
          </p>
        </div>
        <button
          onClick={() => setEditing((s) => !s)}
          aria-expanded={editing}
          aria-label={en ? 'Edit my own messages' : '編輯自訂鼓勵語'}
          className="min-h-11 min-w-11 shrink-0 inline-flex items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-line hover:text-accent"
        >
          <Pencil size={15} aria-hidden />
        </button>
      </div>

      <button
        onClick={press}
        className="mt-4 min-h-11 w-full rounded-xl bg-accent-strong px-4 py-3 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
      >
        {en ? 'I showed up today' : '我今日有嚟過'}
      </button>

      {msg && (
        <p
          aria-live="polite"
          className="mt-3 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm leading-relaxed text-ink-soft"
        >
          {msg}
        </p>
      )}

      {editing && (
        <div className="mt-4 border-t border-line pt-4">
          <label htmlFor="own-cheer" className="block text-xs text-ink-muted">
            {en
              ? `Write your own (up to ${MAX_OWN}). Yours are used instead of ours.`
              : `寫你自己嘅（最多 ${MAX_OWN} 句）。有自訂就只出你嗰批。`}
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="own-cheer"
              value={draft}
              maxLength={MAX_LEN}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveOwn()}
              placeholder={en ? 'e.g. Slow is still forward.' : '例如：慢都係向前。'}
              className="min-h-11 w-full rounded-xl border border-line-strong bg-surface-sunken px-3 py-2 text-sm text-ink-soft outline-none placeholder:text-ink-muted focus:border-accent"
            />
            <button
              onClick={saveOwn}
              disabled={!draft.trim()}
              aria-label={en ? 'Save' : '儲存'}
              className="min-h-11 min-w-11 shrink-0 inline-flex items-center justify-center rounded-xl border border-accent/30 bg-surface-sunken text-accent transition-colors hover:bg-surface-sunken disabled:opacity-40"
            >
              <Check size={16} aria-hidden />
            </button>
          </div>

          {own.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {own.map((c) => (
                <li key={c} className="flex items-center gap-2 text-sm text-ink-soft">
                  <span className="min-w-0 flex-1 break-words">{c}</span>
                  <button
                    onClick={() => removeOwn(c)}
                    aria-label={en ? `Delete: ${c}` : `刪除：${c}`}
                    className="min-h-11 min-w-11 shrink-0 inline-flex items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-line hover:text-ink"
                  >
                    <X size={14} aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
