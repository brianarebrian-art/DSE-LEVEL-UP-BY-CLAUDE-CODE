import { NextResponse } from 'next/server'
import {
  getWarnings, getCurrentWeather, getMtr, getLrt,
  type WarnSum, type MtrTrain,
} from '@/lib/examDay/upstream'

// GET /api/exam-day/brief?examAt=<ISO>&line=TWL&sta=TSW&lrt=<id>
//
// 報告 v4.0 §6.3 指定嘅回傳形狀。呢條係【唯一】會掂政府 API 嘅路徑 ——
// 前端零直連（§6.2）。
//
// ══ 隱私（§6.2）══
// 呢個 endpoint 【唔收】user id、唔收座標、唔寫任何嘢入資料庫。
// 試場同考試時間由前端喺 localStorage 揸住，每次以 query 參數傳入。
// 換句話講：伺服器唔知邊個學生、幾時考、喺邊考 —— 佢淨係做代理同計數。
// 呢個係刻意嘅：憲章 §16.E 訂明上雲白名單要創辦人書面批准，
// 而「考試日期 + 試場」係一個新嘅個人資料類別，未有批准。
//
// ══ 唔做嘅嘢 ══
// 主動推送（§6.3 嘅 22:00／06:30／天氣突變）冇實作。原因寫喺
// app/exam-day/ExamDayClient.tsx 檔頭。

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** 由警告碼砌一句人話。唔做預測、唔做建議以外嘅判斷。 */
function warningLine(w: WarnSum): { active: string[]; advice: string | null } {
  const active = Object.values(w)
    .filter((v) => v.actionCode !== 'CANCEL')
    .map((v) => v.type || v.name)
  if (!active.length) return { active: [], advice: null }

  const codes = Object.values(w).map((v) => v.code)
  // 只針對「要唔要提早出門」呢一件事俾建議，唔扮氣象台。
  if (codes.some((c) => c === 'WRAINR' || c === 'WRAINB'))
    return { active, advice: '大雨警告生效，路面同車務都會慢 —— 建議提早 25 分鐘出門，帶備替換襪。' }
  if (codes.some((c) => c === 'WRAINA'))
    return { active, advice: '黃雨生效，建議提早 15 分鐘出門。' }
  if (codes.some((c) => c.startsWith('TC') && c !== 'TC1'))
    return { active, advice: '熱帶氣旋信號生效 —— 以考評局公布為準，出門前先睇一次官方公告。' }
  if (codes.includes('WHOT'))
    return { active, advice: '酷熱天氣警告 —— 帶多支水，早半個字出門避免趕到出汗。' }
  return { active, advice: null }
}

const nextTwo = (t: MtrTrain[] | undefined) =>
  (t ?? []).filter((x) => x.valid !== 'N').slice(0, 2)
    .map((x) => ({ dest: x.dest, platform: x.plat, minutes: Number(x.ttnt), at: x.time }))

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams
  const line = q.get('line')
  const sta = q.get('sta')
  const lrt = q.get('lrt')
  const examAt = q.get('examAt')

  // 每個上游獨立 settle：一個死唔應該拖冧成份 brief（§6.2 熔斷）。
  const [warnRes, wxRes, mtrRes, lrtRes] = await Promise.allSettled([
    getWarnings(),
    getCurrentWeather(),
    line && sta ? getMtr(line, sta) : Promise.resolve(null),
    lrt ? getLrt(lrt) : Promise.resolve(null),
  ])

  const ok = <T,>(r: PromiseSettledResult<T>) => (r.status === 'fulfilled' ? r.value : null)
  const warn = ok(warnRes)
  const wx = ok(wxRes)
  const mtr = ok(mtrRes)
  const lrtS = ok(lrtRes)

  const wl = warn ? warningLine(warn.data) : { active: [], advice: null }

  const trains = mtr?.data.data
    ? Object.values(mtr.data.data).flatMap((d) => [...nextTwo(d.UP), ...nextTwo(d.DOWN)]).slice(0, 4)
    : []

  const lrtTrains = (lrtS?.data.platform_list ?? []).flatMap((p) =>
    (p.route_list ?? []).slice(0, 2).map((r) => ({
      platform: p.platform_id, route: r.route_no, dest: r.dest_ch, eta: r.time_ch,
    })),
  ).slice(0, 4)

  // 建議出門時間：由考試時間倒推。緩衝刻意寫死喺呢度而唔係由前端傳 ——
  // 「留幾多緩衝」係一個產品判斷，唔應該每個呼叫者各自決定。
  let leaveBy: string | null = null
  if (examAt) {
    const t = Date.parse(examAt)
    if (Number.isFinite(t)) {
      const buffer = wl.advice ? 55 : 40 // 分鐘：有警告就多 15 分鐘
      leaveBy = new Date(t - buffer * 60_000).toISOString()
    }
  }

  const degraded = [warn, wx, mtr, lrtS].some((r) => r?.stale)
    || [warnRes, wxRes, mtrRes, lrtRes].some((r) => r.status === 'rejected')

  return NextResponse.json(
    {
      weather: {
        warnings: wl.active,
        advice: wl.advice,
        temperature: wx?.data.temperature?.data?.find((d) => d.place === '香港天文台')?.value ?? null,
        updateTime: wx?.data.updateTime ?? null,
      },
      mtr: { line, station: sta, next: trains },
      lrt: { stationId: lrt, next: lrtTrains },
      leaveBy,
      degraded,
      fetchedAt: {
        warnings: warn?.fetchedAt ?? null,
        weather: wx?.fetchedAt ?? null,
        mtr: mtr?.fetchedAt ?? null,
        lrt: lrtS?.fetchedAt ?? null,
      },
      source: '香港天文台 · 港鐵 · data.gov.hk 公開資料',
    },
    { headers: { 'cache-control': 'no-store' } },
  )
}
