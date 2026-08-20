'use client'

import { useEffect, useState } from 'react'
import { Lock, LockOpen, Trash2, PenLine } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import {
  type Capsule,
  MAX_LEN,
  MAX_CAPSULES,
  add,
  isSealed,
  load,
  remove,
  save,
  startOfLocalDay,
} from '@/lib/capsule/store'

// 見 page.tsx 檔頭。呢版嘅每一個設計選擇都係喺避開同一組陷阱：
//   ✗ 唔顯示倒數（「仲有 47 日」係壓力，唔係陪伴）—— 只顯示開啟日期
//   ✗ 唔記連續日數、唔計總數做成就（憲章禁 gamification）
//   ✗ 唔提示「你好耐冇寫」—— 呢個功能永遠唔主動追人
//   ✓ 隨時刪得走自己嘅囊，唔使解釋

function fmtDate(ms: number, en: boolean): string {
  const d = new Date(ms)
  return en
    ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`
}

/** 預設開啟時機。刻意唔預設「放榜日」—— 嗰個日子本身對好多人已經夠沉重。 */
function presets(now: number): { zh: string; en: string; at: number }[] {
  const base = startOfLocalDay(new Date(now))
  const plus = (days: number) => base + days * 86_400_000
  return [
    { zh: '一個月後', en: 'In a month', at: plus(30) },
    { zh: '三個月後', en: 'In three months', at: plus(90) },
    { zh: '半年後', en: 'In six months', at: plus(182) },
  ]
}

export default function CapsuleClient() {
  const { locale } = useLocale()
  const en = locale === 'en'

  const [list, setList] = useState<Capsule[]>([])
  const [ready, setReady] = useState(false)
  const [text, setText] = useState('')
  const [when, setWhen] = useState<number | null>(null)
  const [customDate, setCustomDate] = useState('')
  const [justSealed, setJustSealed] = useState(false)
  const [now, setNow] = useState(0)

  // localStorage 只可以喺 mount 之後讀 —— SSR 冇 window，直接讀會 hydration 唔一致。
  //
  // `now` 一併喺呢度定格，唔可以喺 render 入面叫 Date.now()：render 必須係純函數，
  // 唔同 render 攞到唔同嘅時間會令結果唔穩定（同 LongPracticeSession 嗰個係同一類）。
  // 代價要講清楚：如果一個囊嘅開啟時刻啱啱喺頁面開住嗰陣過咗，佢唔會即時彈出，
  // 要 reload 先見到。對一個以「日」為單位嘅功能嚟講，呢個代價可以接受。
  useEffect(() => {
    setList(load())
    setNow(Date.now())
    setReady(true)
  }, [])

  // 早退必須喺呢度 —— 所有 hook 之後、任何用到 `now` 嘅計算之前。
  // 咁樣落面就唔使 `now || Date.now()` 做 fallback（嗰個一樣係 render 期間調用）。
  if (!ready) return <div className="min-h-[40vh]" />

  const options = presets(now)
  const chosen = when ?? options[0].at
  const canSeal = text.trim().length > 0 && list.length < MAX_CAPSULES

  function seal() {
    if (!canSeal) return
    const next = add(list, text, chosen)
    setList(next)
    save(next)
    setText('')
    setJustSealed(true)
  }

  function drop(id: string) {
    const next = remove(list, id)
    setList(next)
    save(next)
  }

  const sealed = list.filter((c) => isSealed(c, now))
  const opened = list.filter((c) => !isSealed(c, now))

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-medium text-ink">{en ? 'Time capsule' : '時間囊'}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {en
            ? 'Write how things are right now, pick a date, and seal it. You can only open it when that day comes.'
            : '寫低而家係點，揀一個日期，封存佢。要等到嗰日先開得返。'}
        </p>
      </header>

      <p className="mb-6 rounded-xl border border-accent/25 bg-accent/[0.06] p-4 text-sm leading-relaxed text-ink-soft">
        {en
          ? 'This stays on your device. It is not uploaded, not synced, and nobody else — including us — can read it. Nobody can reply to you here either: this site has no messaging of any kind.'
          : '呢啲字留喺你部機。唔會上傳、唔會同步，冇其他人睇得到 —— 包括我哋。呢度亦冇人可以回覆你：本站冇任何形式嘅訊息功能。'}
      </p>

      {/* ── 寫 ── */}
      <section className="mb-8 rounded-2xl border border-line bg-surface-raised p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-ink">
          <PenLine size={15} className="text-accent" aria-hidden />
          {en ? 'Write to a later you' : '寫畀之後嘅自己'}
        </h2>

        <label htmlFor="capsule-text" className="sr-only">
          {en ? 'Your message' : '你想講嘅嘢'}
        </label>
        <textarea
          id="capsule-text"
          value={text}
          onChange={(e) => {
            setText(e.target.value.slice(0, MAX_LEN))
            setJustSealed(false)
          }}
          rows={5}
          placeholder={
            en
              ? 'Today was… / What I am scared of right now is… / If you are reading this, I want you to know…'
              : '今日係…… ／ 我而家最驚嘅係…… ／ 如果你睇到呢段字，我想你知……'
          }
          className="w-full resize-none rounded-xl border border-line bg-surface p-3 text-sm leading-relaxed text-ink-soft placeholder:text-ink-muted focus:border-accent focus:outline-none"
        />

        <div className="mt-3">
          <div className="mb-2 text-xs text-ink-muted">{en ? 'Open it:' : '幾時開返：'}</div>
          <div className="flex flex-wrap gap-2">
            {options.map((o) => (
              <button
                key={o.at}
                onClick={() => {
                  setWhen(o.at)
                  setCustomDate('')
                }}
                aria-pressed={chosen === o.at}
                className={`min-h-11 rounded-full px-3 py-1.5 text-xs transition-colors ${
                  chosen === o.at
                    ? 'bg-accent/12 text-accent-strong ring-1 ring-accent/40'
                    : 'bg-surface-sunken text-ink-muted hover:text-ink-soft'
                }`}
              >
                {en ? o.en : o.zh}
              </button>
            ))}
            <label className="inline-flex min-h-11 items-center gap-2 rounded-full bg-surface-sunken px-3 text-xs text-ink-muted">
              {en ? 'Or a date:' : '或者揀日子：'}
              <input
                type="date"
                value={customDate}
                min={new Date(startOfLocalDay(new Date(now)) + 86_400_000).toISOString().slice(0, 10)}
                onChange={(e) => {
                  setCustomDate(e.target.value)
                  if (e.target.value) {
                    const [y, m, d] = e.target.value.split('-').map(Number)
                    setWhen(new Date(y, m - 1, d).getTime())
                  }
                }}
                className="bg-transparent text-xs text-ink-soft focus:outline-none"
              />
            </label>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xs text-ink-muted">
            {text.length} / {MAX_LEN}
          </span>
          <button
            onClick={seal}
            disabled={!canSeal}
            className="min-h-11 inline-flex items-center gap-1.5 rounded-xl bg-accent-strong px-4 text-sm font-medium text-on-accent transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Lock size={14} aria-hidden />
            {en ? `Seal until ${fmtDate(chosen, en)}` : `封存到 ${fmtDate(chosen, en)}`}
          </button>
        </div>

        {justSealed && (
          <p className="mt-3 text-sm text-accent-strong" role="status">
            {en ? '✓ Sealed. See you then.' : '✓ 封好咗。到時見。'}
          </p>
        )}
        {list.length >= MAX_CAPSULES && (
          <p className="mt-3 text-xs text-ink-muted">
            {en
              ? `You have ${MAX_CAPSULES} capsules — delete one to make room.`
              : `你有 ${MAX_CAPSULES} 個囊 —— 刪一個先寫得落。`}
          </p>
        )}
      </section>

      {/* ── 已到期 ── */}
      {opened.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-medium text-ink">
            <LockOpen size={17} className="text-accent" aria-hidden />
            {en ? 'Ready to read' : '開得返嘞'}
          </h2>
          <div className="space-y-3">
            {opened.map((c) => (
              <article key={c.id} className="rounded-2xl border border-accent/30 bg-surface-raised p-4">
                <div className="mb-2 text-xs text-ink-muted">
                  {en ? `Written on ${fmtDate(c.createdAt, en)}` : `${fmtDate(c.createdAt, en)} 寫`}
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">{c.text}</p>
                <button
                  onClick={() => drop(c.id)}
                  className="mt-3 inline-flex min-h-11 items-center gap-1 text-xs text-ink-muted transition-colors hover:text-rose"
                >
                  <Trash2 size={13} aria-hidden /> {en ? 'Delete' : '刪除'}
                </button>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── 封存中 ── */}
      {sealed.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-medium text-ink">
            <Lock size={16} className="text-ink-muted" aria-hidden />
            {en ? 'Sealed' : '封存中'}
          </h2>
          <div className="space-y-2">
            {sealed.map((c) => (
              // 刻意【唔顯示內容、亦唔顯示倒數】。倒數係壓力來源（憲章 §7）；
              // 只講一個日子，唔講「仲有幾多日」。
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-xl border border-line bg-surface-sunken px-4 py-3"
              >
                <Lock size={14} className="shrink-0 text-ink-muted" aria-hidden />
                <span className="flex-1 text-sm text-ink-muted">
                  {en ? `Opens ${fmtDate(c.unsealAt, en)}` : `${fmtDate(c.unsealAt, en)} 開得返`}
                </span>
                <button
                  onClick={() => drop(c.id)}
                  aria-label={en ? 'Delete this capsule' : '刪除呢個囊'}
                  className="inline-flex min-h-11 items-center text-ink-muted transition-colors hover:text-rose"
                >
                  <Trash2 size={13} aria-hidden />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {list.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line-strong bg-surface-raised p-8 text-center text-sm leading-relaxed text-ink-muted">
          {en
            ? 'Nothing sealed yet. The one above is waiting whenever you feel like writing — there is no schedule and nothing counts.'
            : '仲未封存過任何嘢。上面嗰個等緊你，幾時想寫先寫 —— 冇時間表，亦唔會計數。'}
        </p>
      )}
    </div>
  )
}
