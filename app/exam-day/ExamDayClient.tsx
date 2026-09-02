'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, CloudSun, TrainFront, Clock, RefreshCw, Bus, Footprints, Bell, BellOff } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import ExternalLinkGate from '@/components/ExternalLinkGate'
import {
  pushSupported, currentSubscription, subscribePush, unsubscribePush,
  writePushConfig, examDateOf, type SubscribeResult,
} from '@/lib/push/client'
import {
  resolvePlace, planJourney, suggestNames, stationLabel, lineLabel,
  type Journey,
} from '@/lib/examDay/network'

// 考試日管家（報告 v4.0 §6）
//
// ══ 呢一版改咗啲乜（2026-09-03）══
// 舊版收「出發站代碼（例：TSW）」同「輕鐵站編號」，然後由考試時間扣一個
// 寫死嘅 40／55 分鐘。三個問題：
//   1. 冇目的地 —— 所以嗰個「建議出門時間」根本唔關你住邊、去邊事。
//      天水圍去柴灣同天后去銅鑼灣攞返同一個答案。
//   2. 要人填代碼 —— 冇學生記得自己個站係 TSW 定 TWW，仲要分清楚
//      荃灣（TSW）同天水圍（TIS）。一個要查表先填得到嘅輸入框，
//      等於冇。
//   3. 搭巴士嘅學生冇位可以填。
// 而家：打地方名（將軍澳、小西灣、銅鑼灣都得，唔使係車站名），
// 出發同目的地兩格都有，車程由 lib/examDay/network.ts 真計，
// 唔搭港鐵嘅有巴士／步行模式。
//
// ══ 隱私：目的地唔會離開部機 ══
// 所有設定只寫 localStorage。傳去伺服器嘅【只有上車站】（要攞嗰個站嘅
// 實時班次同延誤旗）。試場係邊、幾時考、住邊 —— 伺服器一律唔知。
// 憲章 §16.E：上雲白名單（lib/sync.ts）新增任何一個 key 都要創辦人
// 書面批准，所以呢啲嘢冇入 sync。
//
// ══ 推送（§6.3）——做咗兩個時段，第三個做唔到 ══
// 規格要求三樣：22:00 準備清單、06:30 綜合 brief、天氣突變即時推送。
//   ✓ 前兩樣做咗（Vercel Cron 每日兩次）。
//   ✗ 「天氣突變即時推送」做唔到 —— Vercel Hobby 嘅 cron 每個一日
//     淨係行得一次，冇任何辦法做到「突變即時」。寫得出但兌現唔到嘅
//     承諾，喺考試朝早會令學生等一個永遠唔會嚟嘅通知，
//     所以介面上面一個字都唔會提「即時」。
//
// 訂閱表【冇】user id、考試日期、試場（supabase/migrations/0012）。
// 伺服器send嘅推送冇任何內容，「今日關唔關我事」由 public/sw.js
// 喺學生部機上面讀 IndexedDB 判斷。伺服器永遠唔知發生過乜。

interface Buffer { code: string; zh: string; en: string; minutes: number }
interface Note { zh: string; en: string }
interface Brief {
  weather: {
    warnings: string[]
    temperature: number | null
    rainfallMm: number
    rainfallPlace: string | null
    updateTime: string | null
  }
  mtr: {
    line: string | null
    station: string | null
    next: { dest: string; platform: string; minutes: number; at: string }[]
    disrupted: boolean
    noticeUrl: string | null
  }
  buffers: Buffer[]
  notes: Note[]
  arriveEarlyMinutes: number
  degraded: boolean
  fetchedAt: Record<string, string | null>
  source: string
}

type Mode = 'mtr' | 'bus' | 'self'

const KEY = 'dse_exam_day_prefs'
interface Prefs {
  examAt: string
  mode: Mode
  from: string
  to: string
  /** 由屋企去到上車站（行路／小巴／輕鐵／搭車都算） */
  toStation: number
  /** 落車之後行去試場 */
  toVenue: number
  /** 巴士／自己去：由出門到入到試場，成程幾耐 */
  doorToDoor: number
}
const EMPTY: Prefs = { examAt: '', mode: 'mtr', from: '', to: '', toStation: 10, toVenue: 8, doorToDoor: 45 }

/** localStorage 讀返嚟嘅嘢唔可以信 —— 逐格檢查，壞一格唔好拖冧成頁。 */
function readPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY
    const o = JSON.parse(raw) as Record<string, unknown>
    const num = (v: unknown, d: number) =>
      typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 240 ? Math.round(v) : d
    const str = (v: unknown) => (typeof v === 'string' ? v.slice(0, 40) : '')
    return {
      examAt: str(o.examAt),
      mode: o.mode === 'bus' || o.mode === 'self' ? o.mode : 'mtr',
      from: str(o.from),
      to: str(o.to),
      toStation: num(o.toStation, EMPTY.toStation),
      toVenue: num(o.toVenue, EMPTY.toVenue),
      doorToDoor: num(o.doorToDoor, EMPTY.doorToDoor),
    }
  } catch {
    return EMPTY // 讀唔到就用預設，唔好因為 storage 壞咗而白畫面
  }
}

export default function ExamDayClient() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const tr = (zh: string, e: string) => (en ? e : zh)

  const [prefs, setPrefs] = useState<Prefs>(EMPTY)
  const [brief, setBrief] = useState<Brief | null>(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  /**
   * 請求序號 —— 改出發地嗰陣會連環開幾個 fetch（打一個字就一個）。
   * 冇呢個號碼嘅話，早開嗰個遲返嚟就會覆蓋咗遲開嗰個，
   * 結果係螢幕上面出【另一個站】嘅班次，而且睇落完全正常。
   * 考試朝早睇錯咗個站嘅班次，比乜都唔出仲差。
   */
  const seq = useRef(0)

  // 推送。'unknown' = 仲未問過瀏覽器（SSR 同首次 render 都係呢個）。
  const [pushOn, setPushOn] = useState<boolean | 'unknown'>('unknown')
  const [pushMsg, setPushMsg] = useState<SubscribeResult | null>(null)
  const [pushBusy, setPushBusy] = useState(false)

  useEffect(() => { setPrefs(readPrefs()) }, [])

  useEffect(() => {
    if (!pushSupported()) { setPushOn(false); return }
    void currentSubscription().then((s) => setPushOn(!!s))
  }, [])

  // 把考試日期鏡一份落 IndexedDB —— service worker 冇 localStorage，
  // 讀唔到就永遠判斷唔到「今日係咪你考試」，於是永遠唔會出通知。
  useEffect(() => {
    void writePushConfig({
      examDate: examDateOf(prefs.examAt),
      night: true,
      morning: true,
      lang: en ? 'en' : 'zh',
    })
  }, [prefs.examAt, en])

  const save = (p: Prefs) => {
    setPrefs(p)
    try { localStorage.setItem(KEY, JSON.stringify(p)) } catch { /* 私隱模式寫唔入，唔阻功能 */ }
  }
  const set = <K extends keyof Prefs>(k: K, v: Prefs[K]) => save({ ...prefs, [k]: v })

  const places = useMemo(() => suggestNames(en), [en])
  const fromR = useMemo(() => resolvePlace(prefs.from), [prefs.from])
  const toR = useMemo(() => resolvePlace(prefs.to), [prefs.to])

  const journey: Journey | null = useMemo(() => {
    if (prefs.mode !== 'mtr' || !fromR || !toR) return null
    return planJourney(fromR.station.id, toR.station.id)
  }, [prefs.mode, fromR, toR])

  const load = useCallback(async (line: string | null, sta: string | null) => {
    const mine = ++seq.current
    setLoading(true); setErr(null)
    try {
      const q = new URLSearchParams()
      if (line && sta) { q.set('line', line); q.set('sta', sta) }
      const r = await fetch(`/api/exam-day/brief?${q}`)
      if (!r.ok) throw new Error(String(r.status))
      const data = (await r.json()) as Brief
      if (mine === seq.current) setBrief(data) // 已經有新請求開咗就丟咗佢
    } catch {
      if (mine === seq.current) {
        setErr(tr('攞唔到最新資料。可能係網絡，亦可能係上游暫時唔通 —— 出門前請以現場公告為準。',
                  'Could not fetch the latest data. Check the notices at the venue before you leave.'))
      }
    } finally {
      if (mine === seq.current) setLoading(false)
    }
  }, [en]) // eslint-disable-line react-hooks/exhaustive-deps

  // 上車站一變就重攞（要嗰個站嘅實時班次）。冇港鐵就淨係攞天氣。
  const boardLine = journey?.boardLine ?? null
  const boardSta = journey?.boardStation ?? null
  useEffect(() => { void load(boardLine, boardSta) }, [boardLine, boardSta]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── 出門時間 ────────────────────────────────────────────────────────
  // 逐格加，並且原封不動咁列出嚟。一個學生應該睇得出個數字係點嚟嘅 ——
  // 睇唔出嘅話，佢就冇辦法判斷可唔可以信。
  const rows = useMemo(() => {
    if (!brief) return null
    const r: { key: string; label: string; minutes: number }[] = []
    if (prefs.mode === 'mtr') {
      if (!journey) return null
      if (prefs.toStation > 0)
        r.push({ key: 'feed', minutes: prefs.toStation, label: tr(`去到${stationLabel(journey.boardStation)}站`, `Get to ${stationLabel(journey.boardStation, true)} Station`) })
      r.push({ key: 'wait', minutes: journey.waitMinutes, label: tr('月台等車', 'Waiting on platforms') })
      r.push({
        key: 'ride',
        minutes: journey.minutes,
        label: journey.interchanges
          ? tr(`車程（轉車 ${journey.interchanges} 次）`, `On the train (${journey.interchanges} interchange${journey.interchanges > 1 ? 's' : ''})`)
          : tr('車程（直達）', 'On the train (direct)'),
      })
      if (prefs.toVenue > 0)
        r.push({ key: 'walk', minutes: prefs.toVenue, label: tr('落車行去試場', 'Walk to the exam centre') })
    } else {
      r.push({
        key: 'd2d',
        minutes: prefs.doorToDoor,
        label: prefs.mode === 'bus' ? tr('成程車（你自己填嘅）', 'Whole trip (your own figure)') : tr('由出門到入到試場', 'Door to door'),
      })
    }
    for (const b of brief.buffers) {
      // 港鐵延誤緩衝唔應該加落巴士乘客身上 —— 佢根本唔搭。
      if (b.code === 'mtr' && prefs.mode !== 'mtr') continue
      r.push({ key: `buf-${b.code}`, minutes: b.minutes, label: en ? b.en : b.zh })
    }
    r.push({ key: 'early', minutes: brief.arriveEarlyMinutes, label: tr('提早到場', 'Arrive early') })
    return r
  }, [brief, journey, prefs, en]) // eslint-disable-line react-hooks/exhaustive-deps

  const totalMinutes = rows?.reduce((a, b) => a + b.minutes, 0) ?? 0
  const leaveBy = useMemo(() => {
    if (!rows || !prefs.examAt) return null
    const t = Date.parse(prefs.examAt)
    if (!Number.isFinite(t)) return null
    return new Date(t - totalMinutes * 60_000)
  }, [rows, prefs.examAt, totalMinutes])

  const hhmm = (d: Date | string | null) => {
    if (!d) return '—'
    const dt = typeof d === 'string' ? new Date(d) : d
    // 24 小時制：一個叫你六點四十七出門嘅畫面，唔應該仲要人分「上午」定「下午」。
    return dt.toLocaleTimeString(en ? 'en-HK' : 'zh-HK', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
  }

  // 一定要由撳掣叫 —— 冇用戶手勢嘅權限請求會被拒，而被拒一次之後
  // 好多瀏覽器唔會再問，即係我哋燒咗人哋一個永久嘅選擇權。
  const togglePush = async () => {
    setPushBusy(true); setPushMsg(null)
    try {
      if (pushOn === true) {
        await unsubscribePush()
        setPushOn(false)
      } else {
        const r = await subscribePush(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
        setPushMsg(r)
        setPushOn(r === 'ok')
      }
    } finally { setPushBusy(false) }
  }

  // 逐個 case 用 tr()，唔用 [zh, en] 元組 —— i18n-guard 唔接受元組寫法
  // （佢分唔清「雙語資料表」同「淨中文寫死」），全站慣例係 en 三元／tr()。
  const pushMessage = (r: SubscribeResult) => {
    if (r === 'ok') return tr('開咗。前一晚同考試朝早各提你一次。', 'On. One reminder the night before, one on the exam morning.')
    if (r === 'denied') return tr('你部機拒絕咗通知權限。要開返嘅話，去瀏覽器嘅網站設定度改。', 'Notifications were blocked. Re-enable them in your browser’s site settings.')
    if (r === 'unsupported') return tr('你個瀏覽器唔支援推送通知。', 'Your browser does not support push notifications.')
    if (r === 'not-configured') return tr('推送功能未設定好，暫時開唔到。', 'Push is not set up yet.')
    return tr('開唔到，試多次。開唔到嘅話照樣可以自己入嚟睇。', 'Could not turn it on. You can still open this page yourself.')
  }

  const field = 'mt-1 w-full min-h-11 rounded-xl border border-line-strong bg-surface-sunken px-3 text-sm text-ink'

  const MODES: { id: Mode; zh: string; en: string; Icon: typeof Bus }[] = [
    { id: 'mtr', zh: '港鐵', en: 'MTR', Icon: TrainFront },
    { id: 'bus', zh: '巴士、小巴', en: 'Bus / minibus', Icon: Bus },
    { id: 'self', zh: '行路、家人車', en: 'Walk / lift', Icon: Footprints },
  ]

  return (
    <div className="min-h-screen px-4 py-10 bg-surface text-ink-soft">
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
          {tr('考試朝早最重要嘅唔係題目，係準時。打返你住邊、去邊試場，我幫你計幾點出門口。',
              'On exam morning the thing that matters is being on time. Tell me where you start and where the centre is.')}
        </p>

        {/* ── 設定 ── */}
        <div className="bg-surface-raised border border-line rounded-2xl p-5 mb-4 ml-q-enter">
          <label className="block text-xs text-ink-muted mb-4">
            {tr('考試開始時間', 'Exam starts')}
            <input
              type="datetime-local"
              value={prefs.examAt}
              onChange={(e) => set('examAt', e.target.value)}
              className={field}
            />
          </label>

          <fieldset className="mb-4">
            <legend className="text-xs text-ink-muted mb-1.5">{tr('你點去試場？', 'How do you get there?')}</legend>
            <div className="grid grid-cols-3 gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  aria-pressed={prefs.mode === m.id}
                  onClick={() => set('mode', m.id)}
                  className={`ml-press min-h-11 rounded-xl border px-2 py-2 text-xs inline-flex flex-col items-center justify-center gap-1 transition-colors ${
                    prefs.mode === m.id
                      ? 'border-accent bg-surface-sunken text-ink font-medium'
                      : 'border-line-strong text-ink-muted hover:text-ink'
                  }`}
                >
                  <m.Icon size={16} aria-hidden />
                  {en ? m.en : m.zh}
                </button>
              ))}
            </div>
          </fieldset>

          {prefs.mode === 'mtr' ? (
            <>
              <datalist id="hk-places">
                {places.map((p) => <option key={p} value={p} />)}
              </datalist>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs text-ink-muted">
                  {tr('由邊度出發？', 'Starting from')}
                  <input
                    list="hk-places"
                    value={prefs.from}
                    placeholder={tr('例如：將軍澳、小西灣', 'e.g. Tseung Kwan O')}
                    onChange={(e) => set('from', e.target.value)}
                    className={field}
                  />
                  <PlaceHint raw={prefs.from} r={fromR} en={en} tr={tr} />
                </label>
                <label className="text-xs text-ink-muted">
                  {tr('試場喺邊？', 'Exam centre is at')}
                  <input
                    list="hk-places"
                    value={prefs.to}
                    placeholder={tr('例如：銅鑼灣、沙田', 'e.g. Causeway Bay')}
                    onChange={(e) => set('to', e.target.value)}
                    className={field}
                  />
                  <PlaceHint raw={prefs.to} r={toR} en={en} tr={tr} />
                </label>
                <label className="text-xs text-ink-muted">
                  {tr('由屋企去到上車站要幾耐？（分鐘）', 'Minutes to reach your first station')}
                  <input
                    type="number" inputMode="numeric" min={0} max={120}
                    value={prefs.toStation}
                    onChange={(e) => set('toStation', Math.max(0, Math.min(120, Number(e.target.value) || 0)))}
                    className={field}
                  />
                </label>
                <label className="text-xs text-ink-muted">
                  {tr('落車行去試場要幾耐？（分鐘）', 'Minutes from station to the centre')}
                  <input
                    type="number" inputMode="numeric" min={0} max={120}
                    value={prefs.toVenue}
                    onChange={(e) => set('toVenue', Math.max(0, Math.min(120, Number(e.target.value) || 0)))}
                    className={field}
                  />
                </label>
              </div>
            </>
          ) : (
            <label className="block text-xs text-ink-muted">
              {prefs.mode === 'bus'
                ? tr('平時由屋企去到試場，成程要幾耐？（分鐘）', 'Your usual door-to-door trip (minutes)')
                : tr('由出門到入到試場要幾耐？（分鐘）', 'Door to door (minutes)')}
              <input
                type="number" inputMode="numeric" min={0} max={240}
                value={prefs.doorToDoor}
                onChange={(e) => set('doorToDoor', Math.max(0, Math.min(240, Number(e.target.value) || 0)))}
                className={field}
              />
              <span className="block mt-1.5 text-[11px] text-ink-muted leading-relaxed">
                {prefs.mode === 'bus'
                  ? tr('巴士冇免費嘅行程時間 API，所以呢格要你自己填 —— 你平時搭嗰程車幾耐，你自己最清楚。填一個唔趕嘅日子嘅時間，落雨嗰陣我會再幫你加返緩衝。',
                      'There is no free journey-time API for buses, so this one is yours to fill in — you know your usual trip best. Use a relaxed, non-rushed day; the rain buffer is added on top.')
                  : tr('包埋落車、行入試場、上樓搵課室嗰段時間。',
                      'Include getting dropped off, walking in, and finding the room.')}
              </span>
            </label>
          )}

          <button
            onClick={() => void load(boardLine, boardSta)}
            disabled={loading}
            className="ml-press mt-4 w-full min-h-11 rounded-xl bg-accent-strong hover:bg-accent-hover text-on-accent font-medium inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <RefreshCw size={15} aria-hidden className={loading ? 'animate-spin' : ''} />
            {loading ? tr('攞緊…', 'Fetching…') : tr('更新天氣同車務', 'Refresh weather & trains')}
          </button>
          {/* ── 提我 ── */}
          {pushOn !== 'unknown' && (
            <div className="mt-4 pt-4 border-t border-line">
              <button
                type="button"
                onClick={() => void togglePush()}
                disabled={pushBusy}
                aria-pressed={pushOn === true}
                className={`ml-press w-full min-h-11 rounded-xl border px-3 inline-flex items-center justify-center gap-2 text-sm transition-colors disabled:opacity-60 ${
                  pushOn ? 'border-accent bg-surface-sunken text-ink' : 'border-line-strong text-ink-soft hover:text-ink'
                }`}
              >
                {pushOn ? <Bell size={15} aria-hidden /> : <BellOff size={15} aria-hidden />}
                {pushOn
                  ? tr('考試前會提你（撳一下關閉）', 'Reminders on (tap to turn off)')
                  : tr('考試前提我一聲', 'Remind me before my exam')}
              </button>
              <p className="text-[11px] text-ink-muted mt-2 leading-relaxed">
                {tr('前一晚提你執嘢，考試朝早提你睇出門時間 —— 兩個時段，冇第三個。天氣突變唔會即時通知你，我哋做唔到，唔想扮做到。',
                    'One reminder the night before, one on the exam morning — that is all. We cannot send you instant alerts when the weather turns, so we will not pretend otherwise.')}
              </p>
              <p className="text-[11px] text-ink-muted mt-1 leading-relaxed">
                {tr('伺服器唔會知你幾時考、喺邊考 —— 佢send嘅通知係空白嘅，「今日關唔關你事」係你部機自己判斷。',
                    'The server never learns your exam date or venue — the push it sends is empty, and your own device decides whether today concerns you.')}
              </p>
              {pushMsg && (
                <p className="text-[11px] text-ink mt-2 bg-surface-sunken border-l-[3px] border-accent rounded-lg px-3 py-2 leading-relaxed">
                  {pushMessage(pushMsg)}
                </p>
              )}
            </div>
          )}

          {/* 呢句要跟模式變。巴士模式根本乜都唔傳，照出「傳去伺服器嘅淨係一個 */}
          {/* 上車站」就係喺私隱聲明度講咗一句唔啱嘅嘢 —— 講少咗都係講錯。 */}
          <p className="text-[11px] text-ink-muted mt-3 leading-relaxed">
            {prefs.mode === 'mtr'
              ? tr('呢啲設定只存喺你部機。傳去伺服器嘅淨係一個上車站（要攞嗰個站嘅實時班次）—— 試場係邊、幾時考，伺服器一律唔知。',
                   'These settings stay on your device. Only your boarding station is sent, to fetch live train times — the server never learns your exam centre or exam time.')
              : tr('呢啲設定只存喺你部機，一個字都唔會傳出去 —— 呢個模式淨係攞天氣，唔使話俾伺服器聽你喺邊。',
                   'These settings stay on your device and nothing is sent — this mode only fetches the weather, so the server is never told where you are.')}
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

            {/* ── 出門時間 + 逐格拆解 ── */}
            <div className="bg-surface-raised border border-line rounded-2xl p-5 mb-4 ml-reveal">
              <div className="flex items-center gap-2 text-xs text-ink-muted mb-1">
                <Clock size={14} aria-hidden /> {tr('建議出門時間', 'Suggested departure')}
              </div>

              {!prefs.examAt ? (
                <p className="text-sm text-ink">{tr('填咗考試開始時間先計到。', 'Enter your exam start time first.')}</p>
              ) : !rows ? (
                <p className="text-sm text-ink">
                  {tr('填埋出發地同試場先計到 —— 冇目的地就冇車程，冇車程嘅「建議時間」係作出嚟嘅。',
                      'Fill in both places first — without a destination there is no journey time, and a departure time without one is made up.')}
                </p>
              ) : (
                <>
                  <p className="text-4xl font-semibold text-ink tabular-nums">{hhmm(leaveBy)}</p>
                  <p className="text-xs text-ink-muted mt-1 mb-4">
                    {tr(`合共 ${totalMinutes} 分鐘，開考時間 ${hhmm(new Date(prefs.examAt))}`,
                        `${totalMinutes} minutes in total, exam starts ${hhmm(new Date(prefs.examAt))}`)}
                  </p>
                  <ul className="space-y-1 border-t border-line pt-3">
                    {rows.map((r) => (
                      <li key={r.key} className="flex items-baseline justify-between gap-3 text-sm">
                        <span className="text-ink-soft">{r.label}</span>
                        <span className="tabular-nums text-ink shrink-0">
                          {r.minutes} {tr('分', 'min')}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {journey && journey.legs.length > 0 && (
                    <p className="text-[11px] text-ink-muted mt-3 leading-relaxed">
                      {tr('路線：', 'Route: ')}
                      {journey.legs.map((l) =>
                        l.line === 'WALK'
                          ? tr(`行去${stationLabel(l.toId)}`, `walk to ${stationLabel(l.toId, true)}`)
                          : tr(`${stationLabel(l.fromId)} —${lineLabel(l.line)}→ ${stationLabel(l.toId)}`,
                               `${stationLabel(l.fromId, true)} —${lineLabel(l.line, true)}→ ${stationLabel(l.toId, true)}`),
                      ).join(en ? ', ' : '，')}
                    </p>
                  )}
                </>
              )}
            </div>

            {brief.notes.map((n) => (
              <div key={n.zh} className="bg-surface-sunken border-l-[3px] border-warn rounded-xl px-4 py-3 mb-4 text-sm text-ink leading-relaxed">
                {en ? n.en : n.zh}
              </div>
            ))}

            {/* ── 天氣 ── */}
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
              <div className="text-sm text-ink-soft space-y-0.5">
                {brief.weather.temperature !== null && (
                  <p>{tr('氣溫', 'Temperature')}：{brief.weather.temperature}°C</p>
                )}
                <p>
                  {brief.weather.rainfallMm > 0
                    ? tr(`過去一個鐘各區最大雨量：${brief.weather.rainfallPlace ?? ''} ${brief.weather.rainfallMm} 毫米`,
                         `Heaviest rainfall in the past hour: ${brief.weather.rainfallPlace ?? ''} ${brief.weather.rainfallMm} mm`)
                    : tr('過去一個鐘各區都冇錄到雨量。', 'No rainfall recorded anywhere in the past hour.')}
                </p>
              </div>
            </div>

            {/* ── 港鐵 ── */}
            {prefs.mode === 'mtr' && brief.mtr.station && (
              <div className="bg-surface-raised border border-line rounded-2xl p-5 mb-4 ml-reveal">
                <div className="flex items-center gap-2 text-xs text-ink-muted mb-2">
                  <TrainFront size={14} aria-hidden />
                  {tr('港鐵', 'MTR')} · {stationLabel(brief.mtr.station, en)}
                  {brief.mtr.line ? ` · ${lineLabel(brief.mtr.line, en)}` : ''}
                </div>
                {brief.mtr.disrupted && (
                  <p className="text-sm text-ink bg-surface-sunken border-l-[3px] border-warn rounded-lg px-3 py-2 mb-2">
                    {tr('港鐵掛住延誤或者特別安排。', 'The MTR is flagging a delay or special arrangement.')}
                    {brief.mtr.noticeUrl && (
                      <ExternalLinkGate
                        href={brief.mtr.noticeUrl}
                        platform={tr('港鐵', 'MTR')}
                        className="underline ml-1 text-accent"
                      >
                        {tr('睇港鐵公告', 'MTR notice')}
                      </ExternalLinkGate>
                    )}
                  </p>
                )}
                {brief.mtr.next.length > 0 ? (
                  <>
                    <ul className="space-y-1.5">
                      {brief.mtr.next.map((t, i) => (
                        <li key={i} className="flex items-center justify-between text-sm bg-surface-sunken rounded-lg px-3 py-2">
                          {/* 港鐵回嘅 dest 係站代碼（例：KET）。一定要過 stationLabel —— */}
                          {/* 唔係嘅話，我哋啱啱先由輸入框剷走嘅代碼會由上游繞返入顯示層。 */}
                          <span className="text-ink">{tr('往', 'To')} {stationLabel(t.dest, en)} · {tr('月台', 'Plat')} {t.platform}</span>
                          <span className="tabular-nums text-ink font-medium">{t.minutes} {tr('分鐘', 'min')}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-ink-muted mt-2 leading-relaxed">
                      {tr('呢幾班係而家嗰幾班，唔係你出門嗰陣嗰幾班 —— 擺喺度係俾你睇下條線而家順唔順。',
                          'These are the trains right now, not the ones you will catch — they are here so you can see whether the line is running smoothly.')}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-ink-muted">{tr('而家攞唔到呢個站嘅班次。', 'No live times for this station right now.')}</p>
                )}
              </div>
            )}

            {/* ── 資料來源 + 免責聲明 ── */}
            <div className="text-[11px] text-ink-muted leading-relaxed space-y-2">
              <p>
                {tr('資料來源：', 'Source: ')}{brief.source}。
                {tr('取得時間 — 警告 ', 'Fetched — warnings ')}{hhmm(brief.fetchedAt.warnings)}
                {tr('、天氣 ', ', weather ')}{hhmm(brief.fetchedAt.weather)}
                {brief.fetchedAt.mtr ? `${tr('、港鐵 ', ', MTR ')}${hhmm(brief.fetchedAt.mtr)}` : ''}。
                {prefs.mode === 'mtr'
                  ? tr('車程係按港鐵網絡自行估算，唔係港鐵官方行程規劃。',
                       'Journey times are our own estimate from the MTR network, not the official MTR trip planner.')
                  : ''}
              </p>
              <p className="border-t border-line pt-2">
                <strong className="text-ink-soft">{tr('免責聲明：', 'Disclaimer: ')}</strong>
                {tr('本頁嘅出門時間係按公開數據計出嚟嘅估算，唔係承諾。實際路況、班次、天氣同試場安排隨時會變，我哋唔會亦冇能力保證你準時到場。因參考本頁而遲到、缺席或引致任何損失，DSE Level Up 及其團隊概不負責，亦不承擔任何法律責任。出門前請以香港考試及評核局公布、學校指示同現場實況為準，並自行預留額外時間。',
                    'The departure time on this page is an estimate from public data, not a promise. Road conditions, train service, weather and exam-centre arrangements can change at any time, and we cannot and do not guarantee that you will arrive on time. DSE Level Up and its team accept no responsibility and no legal liability for any lateness, absence or loss arising from reliance on this page. Always follow HKEAA announcements, your school’s instructions and conditions on the ground, and leave extra time of your own.')}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/** 打咗個地方名之後嘅回應：認得、認得但要轉個站、定係唔認得。 */
function PlaceHint({ raw, r, en, tr }: {
  raw: string
  r: ReturnType<typeof resolvePlace>
  en: boolean
  tr: (zh: string, e: string) => string
}) {
  if (!raw.trim()) return null
  if (!r) {
    return (
      <span className="block mt-1.5 text-[11px] text-ink-muted leading-relaxed">
        {tr('搵唔到呢個地方 —— 佢可能冇港鐵去到。揀返上面「巴士、小巴」，自己填成程車幾耐就得。',
            'No match — there may be no MTR there. Switch to “Bus / minibus” above and enter your own trip time.')}
      </span>
    )
  }
  if (r.viaAlias) {
    return (
      <span className="block mt-1.5 text-[11px] text-ink-muted leading-relaxed">
        {tr(`${raw.trim()}冇港鐵站，最近係${r.station.zh}站 —— 記得下面嗰格要計埋去${r.station.zh}站嗰段時間。`,
            `No station at ${raw.trim()}; the nearest is ${r.station.en}. Remember to count the time to get there below.`)}
      </span>
    )
  }
  return (
    <span className="block mt-1.5 text-[11px] text-ink-muted">
      {tr(`${r.station.zh}站`, `${r.station.en} Station`)}
    </span>
  )
}
