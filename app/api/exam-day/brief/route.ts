import { NextResponse } from 'next/server'
import {
  getWarnings, getCurrentWeather, getMtr, mtrDisrupted,
  type WarnSum, type MtrTrain, type RhrRead,
} from '@/lib/examDay/upstream'

// GET /api/exam-day/brief?line=TKL&sta=TKO
//
// 呢條係【唯一】會掂政府 API 嘅路徑 —— 前端零直連（§6.2）。
//
// ══ 隱私（§6.2 / 憲章 §16.E）══
// 唔收 user id、唔收座標、唔寫任何嘢入資料庫。
//
// ⚠️ 特別注意【唔收目的地】：試場係邊留喺瀏覽器，車程亦係喺瀏覽器度
// 用 lib/examDay/network.ts 計。伺服器淨係知一個【上車站】，因為要攞
// 嗰個站嘅實時班次同延誤旗 —— 冇得慳。
// 「將軍澳站有人搭緊車」同「呢位學生喺 XX 中學考試」係兩件完全唔同
// 敏感度嘅事，而我哋只需要頭嗰件。
//
// ══ 唔做嘅嘢 ══
// 主動推送（§6.3 嘅 22:00／06:30／天氣突變）冇實作。原因寫喺
// app/exam-day/ExamDayClient.tsx 檔頭。

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** 一格緩衝：點解要加、加幾多。UI 會逐格列出嚟俾學生自己睇。 */
export interface Buffer {
  code: string
  zh: string
  en: string
  minutes: number
}

/**
 * 一般建議開考前 30 分鐘到場。
 *
 * 寫 30 而唔係引考評局條文，係因為實際到場時間以准考證同學校指示為準，
 * 而且各試場開放時間唔一定一樣。UI 要照講呢句 —— 我哋唔可以扮自己
 * 係考評局嘅權威版本（憲章 §16.D 嗰種「講大咗自己」嘅毛病）。
 */
const ARRIVE_EARLY = 30

/** 一句提示。雙語成對出 —— 客戶端揀邊句由 locale 決定。 */
interface Note { zh: string; en: string }

/**
 * 由天文台警告砌緩衝。
 *
 * 落雨嗰幾格【唔加埋一齊】—— 黃紅黑係同一件事嘅三個級數，
 * 加埋就會變成 85 分鐘咁荒謬。只取最大嗰格。
 */
function weatherBuffers(w: WarnSum | null, rainMm: number): { buffers: Buffer[]; notes: Note[] } {
  const buffers: Buffer[] = []
  const notes: Note[] = []
  const codes = w
    ? Object.values(w).filter((v) => v.actionCode !== 'CANCEL').map((v) => v.code)
    : []

  // ── 雨（取最大一格）──
  if (codes.includes('WRAINB')) {
    buffers.push({ code: 'rain', minutes: 40, zh: '黑色暴雨警告', en: 'Black rainstorm warning' })
    notes.push({
      zh: '黑色暴雨生效 —— 考評局有機會延期或者改安排。出門之前一定要睇一次考評局同學校嘅公布，唔好淨係信呢一版。',
      en: 'Black rainstorm in force — the HKEAA may postpone or change arrangements. Check the HKEAA and your school before you leave; do not rely on this page alone.',
    })
  } else if (codes.includes('WRAINR')) {
    buffers.push({ code: 'rain', minutes: 30, zh: '紅色暴雨警告', en: 'Red rainstorm warning' })
    notes.push({
      zh: '紅雨生效，路面同車務都會慢。帶多對襪，濕腳坐三個鐘好難捱。',
      en: 'Red rainstorm in force — roads and trains will be slow. Bring a spare pair of socks.',
    })
  } else if (codes.includes('WRAINA')) {
    buffers.push({ code: 'rain', minutes: 15, zh: '黃色暴雨警告', en: 'Amber rainstorm warning' })
  } else if (rainMm >= 10) {
    buffers.push({ code: 'rain', minutes: 10, zh: '正落大雨（未掛警告）', en: 'Heavy rain, no warning yet' })
  } else if (rainMm >= 3) {
    buffers.push({ code: 'rain', minutes: 5, zh: '正落雨', en: 'Raining' })
  }

  // ── 風（同雨分開，兩樣可以一齊有）──
  const tc = codes.find((c) => /^TC(8|9|10)/.test(c))
  if (tc) {
    buffers.push({ code: 'typhoon', minutes: 45, zh: '八號或以上熱帶氣旋信號', en: 'T8 or above' })
    notes.push({
      zh: '八號或以上信號生效 —— 考試多數會改期。以考評局公布為準，唔好貿然出門。',
      en: 'T8 or above — exams are usually rescheduled. Follow the HKEAA announcement; do not set out without checking.',
    })
  } else if (codes.includes('TC3')) {
    buffers.push({ code: 'typhoon', minutes: 10, zh: '三號強風信號', en: 'T3 strong wind signal' })
  }

  if (codes.includes('WTS')) buffers.push({ code: 'thunder', minutes: 10, zh: '雷暴警告', en: 'Thunderstorm warning' })
  if (codes.includes('WHOT')) buffers.push({ code: 'hot', minutes: 5, zh: '酷熱天氣警告', en: 'Very hot weather warning' })
  if (codes.includes('WCOLD')) buffers.push({ code: 'cold', minutes: 5, zh: '寒冷天氣警告', en: 'Cold weather warning' })

  return { buffers, notes }
}

/** 過去一個鐘全港最大雨量（毫米）同落喺邊區。 */
function peakRain(wx: RhrRead | null): { mm: number; place: string | null } {
  let mm = 0
  let place: string | null = null
  for (const d of wx?.rainfall?.data ?? []) {
    const v = d.max ?? 0
    if (v > mm) { mm = v; place = d.place }
  }
  return { mm, place }
}

const nextTrains = (t: MtrTrain[] | undefined) =>
  (t ?? []).filter((x) => x.valid !== 'N').slice(0, 2)
    .map((x) => ({ dest: x.dest, platform: x.plat, minutes: Number(x.ttnt), at: x.time }))

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams
  const line = q.get('line')
  const sta = q.get('sta')

  // 每個上游獨立 settle：一個死唔應該拖冧成份 brief（§6.2 熔斷）。
  const [warnRes, wxRes, mtrRes] = await Promise.allSettled([
    getWarnings(),
    getCurrentWeather(),
    line && sta ? getMtr(line, sta) : Promise.resolve(null),
  ])

  const ok = <T,>(r: PromiseSettledResult<T>) => (r.status === 'fulfilled' ? r.value : null)
  const warn = ok(warnRes)
  const wx = ok(wxRes)
  const mtr = ok(mtrRes)

  const rain = peakRain(wx?.data ?? null)
  const { buffers, notes } = weatherBuffers(warn?.data ?? null, rain.mm)

  const disrupted = mtrDisrupted(mtr?.data)
  if (disrupted) {
    buffers.push({ code: 'mtr', minutes: 20, zh: '港鐵掛住延誤／特別安排', en: 'MTR delay or special arrangement' })
    notes.push({
      zh: '港鐵而家掛住延誤或者特別安排。呢一版只係轉述佢自己出嗰面旗，詳情要睇港鐵公告。',
      en: 'The MTR is flagging a delay or special arrangement. This page only relays their own flag — check the MTR notice for details.',
    })
  }

  const trains = mtr?.data.data
    ? Object.values(mtr.data.data)
        .flatMap((d) => [...nextTrains(d.UP), ...nextTrains(d.DOWN)])
        .slice(0, 4)
    : []

  const degraded = [warn, wx, mtr].some((r) => r?.stale)
    || [warnRes, wxRes, mtrRes].some((r) => r.status === 'rejected')

  return NextResponse.json(
    {
      weather: {
        // 出 type 唔出 name：name 係「熱帶氣旋警告信號」（一號同十號一樣），
        // type 係「一號戒備信號」／「十號颶風信號」—— 分別就係全部。
        warnings: warn
          ? Object.values(warn.data).filter((v) => v.actionCode !== 'CANCEL').map((v) => v.type || v.name || v.code)
          : [],
        temperature: wx?.data.temperature?.data?.find((d) => d.place === '香港天文台')?.value ?? null,
        rainfallMm: rain.mm,
        rainfallPlace: rain.place,
        updateTime: wx?.data.updateTime ?? null,
      },
      mtr: {
        line,
        station: sta,
        next: trains,
        disrupted,
        noticeUrl: mtr?.data.url ?? null,
      },
      // 緩衝分鐘數由伺服器出（「留幾多」係產品判斷，唔應該由每個呼叫者
      // 各自決定），但【車程】由前端自己計 —— 因為計車程要目的地，
      // 而目的地唔應該離開部機。兩邊喺 UI 度加埋先係最後嗰個出門時間。
      buffers,
      notes,
      arriveEarlyMinutes: ARRIVE_EARLY,
      degraded,
      fetchedAt: {
        warnings: warn?.fetchedAt ?? null,
        weather: wx?.fetchedAt ?? null,
        mtr: mtr?.fetchedAt ?? null,
      },
      source: '香港天文台公開數據 · 港鐵實時列車資訊（data.gov.hk）',
    },
    { headers: { 'cache-control': 'no-store' } },
  )
}
