// ============================================================================
// retention.mts —— 留存率 ＋ 逐週正確率 curve（唯讀）
// ----------------------------------------------------------------------------
//   npm run analytics:retention [-- --json]
//
// ⚠️ 唯讀。唔寫 Supabase、唔寫題庫、唔改任何代碼。
//
// ══ 點解要有 ══
//
// 兩個到期嘅要求，同一份數據答得到：
//
// ① 2027 目標書核心目標 1：「次日留存由 14% 提升至 ≥ 50%」。
//    完成標準寫住「Day-2 Retention 穩定達標 ≥ 50%」——
//    但全站【冇任何嘢量度緊呢個數】。冇量度就冇得驗收，
//    亦冇得知道任何留存改動（例如 2026-09-10 落嘅「聽日有嘢等你」）
//    究竟有冇用。一個冇反饋迴路嘅留存目標，只會變成一個信念。
//
// ② 憲章 §7.2：30 秒反思鎖 2026-09-09 剷除，兩個月實驗，
//    2026-11-09 要交「逐週正確率 curve —— 每星期答啱幾多條、
//    答錯幾多條、正確率」。對照基準：整體正確率 88.3%、5,565 題、484 節。
//
// ══ 數據源同限制 ══
//
// 只有 `user_progress.progress_data → dse_progress`（AttemptRecord[]，
// 每條帶 timestamp）。`user_sessions` 表【0 行】—— 前端從來冇寫過，
// 所以「開過網站但未做題」呢個群體量度唔到。
//
// 即係話本腳本量嘅係【做過題嘅人有冇返嚟再做題】，
// 而唔係【開過網站嘅人有冇再開】。兩者唔同，報告會寫明。
//
// ⚠️ 每個 attempt 嘅 timestamp 係【該裝置嘅本機時鐘】。學生改時區、
//    部機時間唔準，都會令日界計錯。樣本細嘅時候，一兩個異常足以郁到
//    百分比 —— 所以下面所有數字都會連同分母一齊報，唔會淨係報百分比。
//
// ⚠️ §16.E 約束 3 禁止【向學生呈現】跨用戶比較。本腳本係內部營運分析，
//    只出匯總數（同 /api/admin/users/stats 同一性質），唔會有任何
//    逐人數據流去學生介面，亦唔會寫入任何表。
// ============================================================================

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const args = process.argv.slice(2)
const JSON_OUT = args.includes('--json')

const env = Object.fromEntries(
  readFileSync(join(ROOT, '.env.local'), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')] }),
)
const res = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_progress?select=user_id,progress_data`, {
  headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` },
})
const rows = (await res.json()) as { user_id?: string; progress_data?: Record<string, unknown> }[]
if (!Array.isArray(rows)) { console.error('✗ Supabase 讀取失敗：', JSON.stringify(rows).slice(0, 300)); process.exit(1) }

interface Attempt { score?: number; total?: number; timestamp?: number }
const DAY = 86_400_000
/** UTC 日界。用 UTC 而唔用本機時區 —— 腳本喺邊部機跑都要得出同一個數。 */
const dayKey = (ts: number) => Math.floor(ts / DAY)

// ── 同一把衛生閘（見 lib/progress.ts isPossibleAttempt）────────────────────
// 實測揾過一條 score=10000 / total=100。唔剔走，正確率會由 88.5% 變 257.8%。
const usable = (a: Attempt): boolean =>
  Number.isFinite(a.score) && Number.isFinite(a.total) &&
  Number.isInteger(a.total) && (a.total ?? 0) > 0 &&
  Number.isInteger(a.score) && (a.score ?? 0) >= 0 && (a.score ?? 0) <= (a.total ?? 0) &&
  Number.isFinite(a.timestamp) && (a.timestamp ?? 0) > 0

interface User { days: number[]; attempts: Attempt[] }
const users: User[] = []
let droppedAttempts = 0
for (const row of rows) {
  const p = row.progress_data?.dse_progress
  if (!Array.isArray(p)) continue
  const clean = (p as Attempt[]).filter((a) => { const ok = usable(a); if (!ok) droppedAttempts++; return ok })
  if (!clean.length) continue
  const days = [...new Set(clean.map((a) => dayKey(a.timestamp!)))].sort((a, b) => a - b)
  users.push({ days, attempts: clean })
}

// ── 留存 ────────────────────────────────────────────────────────────────────
//
// 三個定義，因為佢哋答唔同問題，而混淆咗就會得出一個好睇但冇意思嘅數：
//
//   D1（次日）    首次做題之後【第二個曆日】有冇再做。呢個係目標書講嘅「次日留存」。
//   D7（一週內）  首次之後 7 日之內有冇返過嚟（任何一日）。比 D1 寬鬆，樣本細時較穩。
//   曾經返過      有冇第二個活躍日（唔限幾時）。呢個係上限 —— D1 永遠唔會高過佢。
//
// ⚠️ 分母刻意排除【今日先第一次做題】嘅人 —— 佢哋根本未有機會返嚟。
//    唔排除嘅話，每新增一個用戶就會即刻拉低 D1，而嗰個下跌係假嘅。
const today = dayKey(Date.now())
const eligible = users.filter((u) => u.days[0] < today) // 至少有機會返嚟一次
const d1 = eligible.filter((u) => u.days.includes(u.days[0] + 1)).length
const eligible7 = users.filter((u) => u.days[0] <= today - 7)
const d7 = eligible7.filter((u) => u.days.some((d) => d > u.days[0] && d <= u.days[0] + 7)).length
const everReturned = eligible.filter((u) => u.days.length > 1).length

// ── 逐週正確率 curve（憲章 §7.2，2026-11-09 覆檢要交）────────────────────
const weeks = new Map<number, { correct: number; total: number; sessions: number; users: Set<number> }>()
users.forEach((u, ui) => {
  for (const a of u.attempts) {
    const wk = Math.floor(dayKey(a.timestamp!) / 7)
    const w = weeks.get(wk) ?? { correct: 0, total: 0, sessions: 0, users: new Set<number>() }
    w.correct += a.score!; w.total += a.total!; w.sessions++; w.users.add(ui)
    weeks.set(wk, w)
  }
})
const weekRows = [...weeks.entries()].sort((a, b) => a[0] - b[0]).map(([wk, w]) => ({
  weekStart: new Date(wk * 7 * DAY).toISOString().slice(0, 10),
  sessions: w.sessions, questions: w.total,
  accuracy: w.total ? w.correct / w.total : null,
  activeUsers: w.users.size,
}))

const allCorrect = users.reduce((s, u) => s + u.attempts.reduce((t, a) => t + a.score!, 0), 0)
const allTotal = users.reduce((s, u) => s + u.attempts.reduce((t, a) => t + a.total!, 0), 0)

// 2026-09-09 剷鎖 —— §7.2 實驗嘅分界線。
const LOCK_REMOVED = dayKey(Date.parse('2026-09-09T00:00:00Z'))
const split = (before: boolean) => {
  let c = 0, t = 0, n = 0
  for (const u of users) for (const a of u.attempts) {
    const d = dayKey(a.timestamp!)
    if (before ? d < LOCK_REMOVED : d >= LOCK_REMOVED) { c += a.score!; t += a.total!; n++ }
  }
  return { correct: c, total: t, sessions: n, accuracy: t ? c / t : null }
}
const beforeLock = split(true), afterLock = split(false)

const pct = (a: number, b: number) => (b ? ((a / b) * 100).toFixed(1) + '%' : '—')

if (JSON_OUT) {
  console.log(JSON.stringify({
    generatedAt: new Date().toISOString(),
    users: { withAttempts: users.length, eligibleForD1: eligible.length, eligibleForD7: eligible7.length },
    retention: { d1, d1Rate: eligible.length ? d1 / eligible.length : null, d7, d7Rate: eligible7.length ? d7 / eligible7.length : null, everReturned },
    overall: { questions: allTotal, accuracy: allTotal ? allCorrect / allTotal : null, droppedAttempts },
    weekly: weekRows,
    lockExperiment: { removedOn: '2026-09-09', before: beforeLock, after: afterLock },
  }, null, 2))
  process.exit(0)
}

const L = '─'.repeat(72)
console.log(`\n${'═'.repeat(72)}\n  留存率 ＋ 逐週正確率 curve（唯讀）\n${'═'.repeat(72)}`)
console.log(`\n帳號 ${rows.length} · 做過題 ${users.length} · 剔走不可能紀錄 ${droppedAttempts} 條`)

console.log(`\n${L}\n① 留存（目標：次日 ≥ 50%）`)
console.log(`   次日返嚟（D1）    ${String(d1).padStart(4)} / ${String(eligible.length).padStart(4)}  ${pct(d1, eligible.length).padStart(7)}`)
console.log(`   一週內返嚟（D7）  ${String(d7).padStart(4)} / ${String(eligible7.length).padStart(4)}  ${pct(d7, eligible7.length).padStart(7)}`)
console.log(`   曾經返過（上限）  ${String(everReturned).padStart(4)} / ${String(eligible.length).padStart(4)}  ${pct(everReturned, eligible.length).padStart(7)}`)
console.log(`\n   ⚠️ 分母已排除「今日先第一次做題」嘅人 —— 佢哋未有機會返嚟。`)
console.log(`      唔排除嘅話，每新增一個用戶就會即刻拉低 D1，而嗰個下跌係假嘅。`)
console.log(`   ⚠️ 量嘅係【做過題嘅人有冇返嚟再做題】，唔係【開過網站嘅人有冇再開】——`)
console.log(`      user_sessions 表 0 行，前端從來冇寫過，所以「開咗但未做題」嗰批量度唔到。`)

const gap = eligible.length ? (d1 / eligible.length - 0.5) * 100 : 0
console.log(`\n   距 50% 目標（按 D1 計）：${gap >= 0 ? '已達標' : `尚差 ${Math.abs(gap).toFixed(1)} 個百分點`}`)

// ── 對數：2027 目標書引嘅「14%」係邊個定義？──────────────────────────────
//
// 目標書寫「次日留存由現時 14% 提升至 ≥ 50%」。但上面三個定義冇一個係 14%。
// 對返數：14% ≈ 曾經返過嘅人數 ÷ 【全部帳號】（唔淨係做過題嘅）。
//
// 呢個唔係「次日留存」—— 佢係「全部註冊帳號之中，有幾多個曾經返嚟做第二日」。
// 分子係「曾經返過」，分母係「全部帳號」，兩者唔同層。
//
// 點解要寫出嚟：一個定義唔清嘅目標，永遠達得到又永遠達唔到 ——
// 揀個鬆嘅定義就過關，揀個緊嘅就唔過關，而兩邊都可以話自己啱。
// 50% 究竟指邊一個，係一個要人決定嘅事，唔係一個可以估嘅事。
const perAllAccounts = rows.length ? everReturned / rows.length : 0
console.log(`\n   ── 對數：目標書引嘅「14%」係邊個定義？──`)
console.log(`   曾經返過 ÷ 全部帳號   ${String(everReturned).padStart(4)} / ${String(rows.length).padStart(4)}  ${pct(everReturned, rows.length).padStart(7)}  ← 最接近 14%`)
console.log(`   次日返嚟 ÷ 有機會返   ${String(d1).padStart(4)} / ${String(eligible.length).padStart(4)}  ${pct(d1, eligible.length).padStart(7)}  ← 字面上嘅「次日留存」`)
console.log(`\n   ⚠️ 兩個數差 ${Math.abs((perAllAccounts - d1 / (eligible.length || 1)) * 100).toFixed(1)} 個百分點，而「50%」指邊一個未定。`)
console.log(`      鬆嘅定義（曾經返過 ÷ 做過題嘅人）而家已經 ${pct(everReturned, eligible.length)}；`)
console.log(`      緊嘅定義（次日 ÷ 有機會返）而家 ${pct(d1, eligible.length)}。`)
console.log(`      同一個「50%」，一個要升 ${(50 - (everReturned / (eligible.length || 1)) * 100).toFixed(0)} 點，另一個要升 ${(50 - (d1 / (eligible.length || 1)) * 100).toFixed(0)} 點。`)
console.log(`      ⬜ 呢個要創辦人揀 —— 定義唔清嘅目標，永遠達得到又永遠達唔到。`)

console.log(`\n${L}\n② 逐週正確率 curve（憲章 §7.2，2026-11-09 覆檢要交）`)
console.log(`   ${'週起'.padEnd(14)}${'節'.padStart(6)}${'題'.padStart(7)}${'正確率'.padStart(9)}${'活躍人'.padStart(8)}`)
for (const w of weekRows.slice(-16)) {
  console.log(`   ${w.weekStart.padEnd(14)}${String(w.sessions).padStart(6)}${String(w.questions).padStart(7)}${(w.accuracy === null ? '—' : (w.accuracy * 100).toFixed(1) + '%').padStart(9)}${String(w.activeUsers).padStart(8)}`)
}
if (weekRows.length > 16) console.log(`   （只列最近 16 週，共 ${weekRows.length} 週；完整數據用 --json）`)

console.log(`\n${L}\n③ 剷鎖前後對照（§7.2 實驗，2026-09-09 分界）`)
console.log(`   剷鎖前  ${String(beforeLock.sessions).padStart(4)} 節 · ${String(beforeLock.total).padStart(5)} 題 · ${(beforeLock.accuracy === null ? '—' : (beforeLock.accuracy * 100).toFixed(1) + '%').padStart(7)}`)
console.log(`   剷鎖後  ${String(afterLock.sessions).padStart(4)} 節 · ${String(afterLock.total).padStart(5)} 題 · ${(afterLock.accuracy === null ? '—' : (afterLock.accuracy * 100).toFixed(1) + '%').padStart(7)}`)
if (afterLock.sessions < 30) {
  console.log(`\n   ⚠️ 剷鎖後只得 ${afterLock.sessions} 節 —— 樣本遠遠未夠落任何結論。`)
  console.log(`      §7.2 訂明 2026-11-09 覆檢，就係為咗等夠兩個月數據。`)
  console.log(`      而家跑呢個腳本嘅目的係【確認量得到】，唔係【而家就睇答案】。`)
}

console.log(`\n${L}\n全站：${allTotal.toLocaleString()} 題 · 正確率 ${pct(allCorrect, allTotal)}`)
console.log(`§7.2 對照基準（剷鎖前實測）：88.3% · 5,565 題 · 484 節`)
console.log(`\n唯讀 —— 冇寫 Supabase、冇寫題庫、冇改代碼。`)
console.log(`機器可讀：npm run analytics:retention -- --json\n`)
