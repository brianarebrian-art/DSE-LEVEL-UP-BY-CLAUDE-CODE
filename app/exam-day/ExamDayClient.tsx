'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, CloudSun, TrainFront, Clock, RefreshCw } from 'lucide-react'
import { useLocale } from '@/lib/i18n'

// 考試日管家（報告 v4.0 §6）
//
// ══ 隱私：所有嘢留喺部機 ══
// 試場、路線、考試時間全部只寫 localStorage，逐次以 query 傳去 proxy。
// 伺服器唔知邊個學生、幾時考、喺邊考。憲章 §16.E 訂明上雲白名單
// （lib/sync.ts）新增任何一個 key 都要創辦人書面批准，而「考試日期 +
// 試場」係一個新嘅個人資料類別 —— 未有批准，所以唔上雲，亦冇入 sync。
//
// ══ 冇做主動推送（§6.3）══
// 規格要求 22:00 準備清單、06:30 綜合 brief、天氣突變即時推送。三樣都冇做：
//   1. 推送要 service worker + 一張伺服器端訂閱表，而張表必然要綁
//      user id ＋ 考試日期 ＋ 試場 —— 即係上面講嗰個未批准嘅資料類別。
//   2. 「天氣突變即時推送」喺 Vercel Hobby 上面做唔到：cron 一日一次，
//      根本行唔到「即時」。寫得出嘅只會係一個做唔到嘅承諾。
// 現時做法係學生自己揀時間開嚟睇，並且每次都出【真實取得時間】。

interface Brief {
  weather: { warnings: string[]; advice: string | null; temperature: number | null; updateTime: string | null }
  mtr: { line: string | null; station: string | null; next: { dest: string; platform: string; minutes: number; at: string }[] }
  lrt: { stationId: string | null; next: { platform: number; route: string; dest: string; eta: string }[] }
  leaveBy: string | null
  degraded: boolean
  fetchedAt: Record<string, string | null>
  source: string
}

const KEY = 'dse_exam_day_prefs'
interface Prefs { line: string; sta: string; lrt: string; examAt: string }
const EMPTY: Prefs = { line: '', sta: '', lrt: '', examAt: '' }

// 港鐵線代碼。刻意寫死一張細表而唔係去拉一份完整車站清單 ——
// 拉清單要另一個上游同一張快取表，而學生只需要揀自己嗰條線。
// 每行尾嘅 i18n-exempt 係必要嘅：i18n-guard 唔接受 [zh, en] 元組寫法
// （佢分唔清「雙語資料表」同「淨中文寫死」），而標記必須同行。
// 呢張表確實係雙語，下面 `en ? e : zh` 逐項揀。
const LINES: [string, string, string][] = [
  ['TWL', '荃灣綫', 'Tsuen Wan'], ['KTL', '觀塘綫', 'Kwun Tong'], ['ISL', '港島綫', 'Island'], // i18n-exempt: 雙語資料表
  ['TCL', '東涌綫', 'Tung Chung'], ['TML', '屯馬綫', 'Tuen Ma'], ['EAL', '東鐵綫', 'East Rail'], // i18n-exempt: 雙語資料表
  ['SIL', '南港島綫', 'South Island'], ['TKL', '將軍澳綫', 'Tseung Kwan O'], ['AEL', '機場快綫', 'Airport Express'], // i18n-exempt: 雙語資料表
]

export default function ExamDayClient() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const tr = (zh: string, e: string) => (en ? e : zh)

  const [prefs, setPrefs] = useState<Prefs>(EMPTY)
  const [brief, setBrief] = useState<Brief | null>(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setPrefs({ ...EMPTY, ...(JSON.parse(raw) as Partial<Prefs>) })
    } catch { /* 讀唔到就用預設，唔好因為 storage 壞咗而白畫面 */ }
  }, [])

  const save = (p: Prefs) => {
    setPrefs(p)
    try { localStorage.setItem(KEY, JSON.stringify(p)) } catch { /* 私隱模式寫唔入，唔阻功能 */ }
  }

  const load = useCallback(async (p: Prefs) => {
    setLoading(true); setErr(null)
    try {
      const q = new URLSearchParams()
      if (p.line && p.sta) { q.set('line', p.line); q.set('sta', p.sta) }
      if (p.lrt) q.set('lrt', p.lrt)
      if (p.examAt) q.set('examAt', new Date(p.examAt).toISOString())
      const r = await fetch(`/api/exam-day/brief?${q}`)
      if (!r.ok) throw new Error(String(r.status))
      setBrief((await r.json()) as Brief)
    } catch {
      setErr(tr('攞唔到最新資料。可能係網絡，亦可能係上游暫時唔通 —— 出門前請以現場公告為準。',
                'Could not fetch the latest data. Check the notices at the venue before you leave.'))
    } finally { setLoading(false) }
  }, [en]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { void load(prefs) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const hhmm = (iso: string | null) =>
    iso ? new Date(iso).toLocaleTimeString(en ? 'en-HK' : 'zh-HK', { hour: '2-digit', minute: '2-digit' }) : '—'

  return (
    <div data-ml className="min-h-screen px-4 py-10 bg-surface text-ink-soft">
      <div className="max-w-2xl mx-auto">
        <div className="sticky top-0 z-30 -mt-2 pt-2 pb-2 mb-1 bg-surface flex items-center gap-2 text-sm">
          <Link
            href="/dashboard"
            aria-label={tr('返回我的進度', 'Back to progress')}
            className="-ml-2 inline-flex items-center gap-0.5 min-h-11 pl-1 pr-2 rounded-lg text-ink-muted hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <ChevronLeft size={16} aria-hidden />
            <span className="text-xs">{tr('返回', 'Back')}</span>
          </Link>
          <span className="text-ink-soft font-medium">{tr('考試日管家', 'Exam-day brief')}</span>
        </div>

        <p className="text-sm text-ink-muted mb-6 leading-relaxed">
          {tr('考試朝早最重要嘅功能，唔係題目，係準時。天氣同車務一版睇晒。',
              'On exam morning the thing that matters is being on time. Weather and trains, on one page.')}
        </p>

        {/* 設定 */}
        <div className="bg-surface-raised border border-line rounded-2xl p-5 mb-4 ml-q-enter">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-xs text-ink-muted">
              {tr('考試開始時間', 'Exam starts')}
              <input
                type="datetime-local"
                value={prefs.examAt}
                onChange={(e) => save({ ...prefs, examAt: e.target.value })}
                className="mt-1 w-full min-h-11 rounded-xl border border-line-strong bg-surface-sunken px-3 text-sm text-ink"
              />
            </label>
            <label className="text-xs text-ink-muted">
              {tr('港鐵線', 'MTR line')}
              <select
                value={prefs.line}
                onChange={(e) => save({ ...prefs, line: e.target.value })}
                className="mt-1 w-full min-h-11 rounded-xl border border-line-strong bg-surface-sunken px-3 text-sm text-ink"
              >
                <option value="">{tr('（唔用港鐵）', '(not using MTR)')}</option>
                {LINES.map(([c, zh, e]) => <option key={c} value={c}>{en ? e : zh}</option>)}
              </select>
            </label>
            <label className="text-xs text-ink-muted">
              {tr('出發車站代碼（例：TSW）', 'Station code (e.g. TSW)')}
              <input
                value={prefs.sta}
                onChange={(e) => save({ ...prefs, sta: e.target.value.toUpperCase().slice(0, 4) })}
                className="mt-1 w-full min-h-11 rounded-xl border border-line-strong bg-surface-sunken px-3 text-sm text-ink"
              />
            </label>
            <label className="text-xs text-ink-muted">
              {tr('輕鐵站編號（新界西，可留空）', 'LRT station id (optional)')}
              <input
                value={prefs.lrt}
                onChange={(e) => save({ ...prefs, lrt: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                className="mt-1 w-full min-h-11 rounded-xl border border-line-strong bg-surface-sunken px-3 text-sm text-ink"
              />
            </label>
          </div>
          <button
            onClick={() => void load(prefs)}
            disabled={loading}
            className="ml-press mt-4 w-full min-h-11 rounded-xl bg-accent-strong hover:bg-accent-hover text-on-accent font-medium inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <RefreshCw size={15} aria-hidden className={loading ? 'animate-spin' : ''} />
            {loading ? tr('攞緊…', 'Fetching…') : tr('更新', 'Refresh')}
          </button>
          <p className="text-[11px] text-ink-muted mt-3 leading-relaxed">
            {tr('呢啲設定只存喺你部機，唔會上傳。伺服器唔會知你幾時考、喺邊考。',
                'These settings stay on your device. The server never learns your exam time or venue.')}
          </p>
        </div>

        {err && (
          <div className="bg-surface-sunken border-l-[3px] border-gold rounded-xl px-4 py-3 mb-4 text-sm text-ink">
            {err}
          </div>
        )}

        {brief && (
          <>
            {brief.degraded && (
              <p className="text-xs text-ink-muted mb-3">
                {tr('部分資料係最後一次成功取得嘅版本（上游暫時唔通），時間見下面。',
                    'Some figures are the last successfully fetched values — timestamps below.')}
              </p>
            )}

            {brief.leaveBy && (
              <div className="bg-surface-raised border border-line rounded-2xl p-5 mb-4 ml-reveal">
                <div className="flex items-center gap-2 text-xs text-ink-muted mb-1">
                  <Clock size={14} aria-hidden /> {tr('建議出門時間', 'Suggested departure')}
                </div>
                <p className="text-3xl font-semibold text-ink tabular-nums">{hhmm(brief.leaveBy)}</p>
                <p className="text-xs text-ink-muted mt-1">
                  {tr('由考試時間倒推，已計緩衝。塞車、排隊入場都要計埋。',
                      'Counted back from your exam time, buffer included.')}
                </p>
              </div>
            )}

            <div className="bg-surface-raised border border-line rounded-2xl p-5 mb-4 ml-reveal">
              <div className="flex items-center gap-2 text-xs text-ink-muted mb-2">
                <CloudSun size={14} aria-hidden /> {tr('天氣', 'Weather')}
              </div>
              {brief.weather.warnings.length ? (
                <ul className="mb-2 space-y-1">
                  {brief.weather.warnings.map((w) => (
                    <li key={w} className="text-sm text-ink bg-surface-sunken border-l-[3px] border-warn rounded-lg px-3 py-2">{w}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-ink mb-2">{tr('現時冇生效警告。', 'No active warnings.')}</p>
              )}
              {brief.weather.temperature !== null && (
                <p className="text-sm text-ink-soft">{tr('氣溫', 'Temperature')}：{brief.weather.temperature}°C</p>
              )}
              {brief.weather.advice && <p className="text-sm text-ink mt-2 leading-relaxed">{brief.weather.advice}</p>}
            </div>

            {brief.mtr.next.length > 0 && (
              <div className="bg-surface-raised border border-line rounded-2xl p-5 mb-4 ml-reveal">
                <div className="flex items-center gap-2 text-xs text-ink-muted mb-2">
                  <TrainFront size={14} aria-hidden /> {tr('港鐵', 'MTR')} · {brief.mtr.line} {brief.mtr.station}
                </div>
                <ul className="space-y-1.5">
                  {brief.mtr.next.map((t, i) => (
                    <li key={i} className="flex items-center justify-between text-sm bg-surface-sunken rounded-lg px-3 py-2">
                      <span className="text-ink">{tr('往', 'To')} {t.dest} · {tr('月台', 'Plat')} {t.platform}</span>
                      <span className="tabular-nums text-ink font-medium">{t.minutes} {tr('分鐘', 'min')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {brief.lrt.next.length > 0 && (
              <div className="bg-surface-raised border border-line rounded-2xl p-5 mb-4 ml-reveal">
                <div className="text-xs text-ink-muted mb-2">{tr('輕鐵', 'Light Rail')}</div>
                <ul className="space-y-1.5">
                  {brief.lrt.next.map((t, i) => (
                    <li key={i} className="flex items-center justify-between text-sm bg-surface-sunken rounded-lg px-3 py-2">
                      <span className="text-ink">{t.route} · {t.dest}</span>
                      <span className="tabular-nums text-ink">{t.eta}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-[11px] text-ink-muted leading-relaxed">
              {tr('資料來源：', 'Source: ')}{brief.source}。
              {tr('取得時間 — 警告 ', 'Fetched — warnings ')}{hhmm(brief.fetchedAt.warnings)}
              {tr('、天氣 ', ', weather ')}{hhmm(brief.fetchedAt.weather)}
              {brief.fetchedAt.mtr ? `${tr('、港鐵 ', ', MTR ')}${hhmm(brief.fetchedAt.mtr)}` : ''}。
              {tr('本頁為公開數據再加工，不能取代現場公告或學校指示。',
                  'Reprocessed public data — it does not replace notices at the venue or from your school.')}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
