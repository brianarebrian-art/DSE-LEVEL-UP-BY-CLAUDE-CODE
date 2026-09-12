// ============================================================================
// hook-reach.mts —— 兩個留存鉤子嘅【觸及率】（唯讀）
// ----------------------------------------------------------------------------
//   npm run analytics:hook-reach
//
// ⚠️ 唯讀。唔寫 Supabase、唔寫題庫、唔改任何代碼。
//
// ══ 點解要有 ══
// 2027 目標書第 2 項：D1 返場率由 10.1% 推向 ≥ 50%，手段寫明係
// 「全面依靠 /result『聽日有嘢等你』卡片與 JustOneCard 進行無壓導流」。
//
// 但「推進」之前要先答一條更基本嘅問題：呢兩個鉤子實際觸及到幾多人？
// 一個只喺 3% 嘅節出現嘅卡片，無論寫得幾好都推唔動 D1 ——
// 而呢一點喺留存數字上係睇唔出嘅：D1 冇升，你分唔清係「卡片冇用」
// 定係「卡片根本冇出現過」。兩者嘅對策完全相反。
//
// ══ 「聽日有嘢等你」嘅出現條件（lib/reviewSchedule.ts:112）══
// 卡只喺【聽日】啱啱等於錯題之後第 1 / 3 / 7 / 14 / 30 日嗰刻出現。
// 即係話：今日錯 → 聽日見到（第 1 日 ✓）；但第 2 日返嚟就見唔到，
// 因為下一個間隔係第 3 日。窗口好窄，所以觸及率唔可以假設。
//
// 本腳本用真實數據模擬：對每一個（用戶 × 練習日），
// 計嗰日交卷嗰刻個卡會唔會 render。
//
// JustOneCard 冇條件，逢 /dashboard 都出，所以觸及率係 100% ——
// 但佢嘅前提係學生要去到 /dashboard，而呢點本腳本量唔到（見尾段）。
// ============================================================================
import { readFileSync } from 'node:fs'

const INTERVALS = [1, 3, 7, 14, 30]
const DAY = 86400_000

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }),
) as Record<string, string>

const res = await fetch(
  `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_progress?select=user_id,progress_data`,
  { headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` } },
)
if (!res.ok) { console.error('讀唔到 user_progress：', res.status); process.exit(1) }
const rows = (await res.json()) as { user_id?: string; progress_data?: Record<string, unknown> }[]

// 一個時間戳屬於邊一日（以香港時間切日，同 lib/reviewSchedule.ts 嘅 todayStr 一致）
const dayOf = (ts: number) => Math.floor((ts + 8 * 3600_000) / DAY)

let accountsTotal = rows.length
let accountsWithProgress = 0
let accountsWithLog = 0
let usersWithLog = 0
let userSessionDays = 0
let daysCardWouldShow = 0
let usersEverSeen = 0
const perUser: { n: number; hit: number }[] = []

for (const row of rows) {
  const log = row.progress_data?.dse_reverse_log
  const prog = row.progress_data?.dse_progress
  if (Array.isArray(prog) && prog.length) accountsWithProgress++
  if (Array.isArray(log) && log.length) accountsWithLog++
  if (!Array.isArray(log) || !log.length || !Array.isArray(prog) || !prog.length) continue
  usersWithLog++

  const errDays = [...new Set(
    log.map((e: Record<string, unknown>) => (typeof e?.ts === 'number' ? dayOf(e.ts) : null))
       .filter((d): d is number => d !== null),
  )]
  const sessionDays = [...new Set(
    prog.map((p: Record<string, unknown>) => (typeof p?.timestamp === 'number' ? dayOf(p.timestamp) : null))
        .filter((d): d is number => d !== null),
  )]

  let hit = 0
  for (const d of sessionDays) {
    // 交卷嗰刻：對每條錯題，「聽日」= (d - errDay) + 1。落喺間隔表就會 render。
    const show = errDays.some((e) => e <= d && INTERVALS.includes(d - e + 1))
    if (show) hit++
  }
  userSessionDays += sessionDays.length
  daysCardWouldShow += hit
  if (hit > 0) usersEverSeen++
  perUser.push({ n: sessionDays.length, hit })
}

const pct = (a: number, b: number) => (b ? ((a / b) * 100).toFixed(1) + '%' : '—')
const line = '─'.repeat(72)

console.log(line)
console.log('  留存鉤子觸及率（唯讀）')
console.log(line)
console.log('  ⚠️ 先睇分母 —— 呢個數字暫時代表唔到全體')
console.log(`     帳號總數                      ${String(accountsTotal).padStart(5)}`)
console.log(`     有練習記錄（dse_progress）    ${String(accountsWithProgress).padStart(5)}`)
console.log(`     有錯題記錄（dse_reverse_log） ${String(accountsWithLog).padStart(5)}   ← 樽頸`)
console.log(`     兩樣都有（本分析嘅分母）      ${String(usersWithLog).padStart(5)}`)
console.log()
console.log('     點解得咁少：dse_reverse_log 係 2026-09-08 先批准上雲')
console.log('     （§16.E 修訂），只有之後同步過嘅帳號先帶住佢。')
console.log('     即係話呢個分母會隨時間自然長大，唔使做嘢 ——')
console.log('     但【而家】任何觸及率數字都係喺極細樣本上量出嚟，唔可以當結論。')
console.log()
console.log('  ① /result「聽日有嘢等你」')
console.log(`     練習日總數（用戶 × 日）      ${String(userSessionDays).padStart(5)}`)
console.log(`     其中卡片會 render            ${String(daysCardWouldShow).padStart(5)}   ${pct(daysCardWouldShow, userSessionDays)}`)
console.log(`     至少見過一次嘅帳號            ${String(usersEverSeen).padStart(5)}   ${pct(usersEverSeen, usersWithLog)}`)
console.log()
console.log('  ② JustOneCard')
console.log('     冇出現條件，逢 /dashboard 都 render —— 觸及率 100%（喺該頁而言）。')
console.log('     ⚠️ 但前提係學生要去到 /dashboard。交卷之後預設去 /result，')
console.log('        唔會自動經過 /dashboard，所以「實際見到」嘅比率量唔到 ——')
console.log('        要量就要記錄逐頁到訪，而嗰個係新增採集，須創辦人裁決（同 retention.mts §④ 同一問題）。')
console.log()
console.log(line)
console.log('  點讀呢個數')
console.log(line)
console.log('  呢個係【上限】，唔係實際曝光率：')
console.log('   · 計嘅係「卡片會唔會 render」，唔係「學生有冇望到 / 有冇 scroll 到」')
console.log('   · 亦假設學生每個練習日都行到 /result（交咗卷就會，中途離開就唔會）')
console.log('  換言之，實際見到嘅人只會【少過】呢個數，唔會多過。')
console.log()
console.log('  若呢個上限本身已經偏低，咁「靠呢張卡推 D1 由 10.1% 去 50%」')
console.log('  就唔係文案問題，係機制覆蓋問題 —— 兩者嘅對策完全相反：')
console.log('   · 文案問題 → 改寫卡片內容')
console.log('   · 覆蓋問題 → 放寬間隔表 / 加其他觸發條件 / 換導流位置')
console.log('  呢個分辨唔到，就會一路改文案而個數一路唔郁。')
console.log(line)
if (usersWithLog < 20) {
  console.log(`  ⚠️ 本次分母只有 ${usersWithLog} 個帳號 / ${userSessionDays} 個練習日 —— 樣本太細。`)
  console.log('     上面嘅百分比【唔可以】當成全體觸及率。要等 dse_reverse_log')
  console.log('     喺更多帳號上同步齊先再跑一次；而家跑嘅目的係【確認量得到】。')
  console.log(line)
}
console.log('  唯讀 —— 冇寫 Supabase、冇寫題庫、冇改代碼。')
