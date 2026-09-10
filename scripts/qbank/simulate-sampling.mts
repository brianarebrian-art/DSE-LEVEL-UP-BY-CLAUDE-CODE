// ============================================================================
// simulate-sampling.mts —— 抽題演算法上限模擬（唯讀）
// ----------------------------------------------------------------------------
//   npm run qbank:simulate-sampling [-- --sessions 1000 --size 10]
//
// ⚠️ 唯讀。唔改題庫、唔改抽題邏輯、唔寫 Supabase。輸出一個數字：
//    【單靠重新分配現有題目，全站正確率最低推得到幾多】。
//
// ══ 要答嘅問題 ══
// 2027 目標書階段一第 2 項：「提高英文語法等高錯率模組嘅出現頻率，
// 精確控制整體答題水準」，驗收條件係「全站平均正確率收斂至 65% ± 3%」。
//
// 呢個假設咗抽題演算法做得到。但抽題只可以喺【現有題目】之間重新分配 ——
// 佢創造唔到一條比現有最難嗰條更難嘅題。所以存在一個數學上嘅下限，
// 而嗰個下限由題庫本身決定，唔係由演算法決定。
//
// 本腳本量嗰個下限。若下限高於 65%，就代表「調演算法」呢條路走唔通，
// 要出新題 —— 而知道呢件事嘅成本，係跑一次呢個腳本；
// 唔知而去調演算法嘅成本，係幾個月之後先發現收斂唔到。
//
// ══ 方法 ══
// 對每個有實測數據嘅課題，用其實測正確率作為「答啱概率」。
// 抽題權重 ∝ (1 − 正確率)^k：
//   k = 0  純隨機（現狀）
//   k = 1  溫和向高錯率課題傾斜
//   k = 2  明顯傾斜
//   k = 4  極端傾斜
//   k = ∞  只抽最難嗰個課題（理論下限，教學上荒謬，只作參照）
//
// 每個 k 跑 N 節蒙地卡羅，報告全站正確率。
//
// ⚠️ 三項已知限制，唔可以當冇：
//   ① 只覆蓋有實測數據嘅課題。冇數據嘅課題（大部分）真實難度不明，
//      模擬當佢哋唔存在 —— 即係結果偏向「我哋知道嘅嗰批」。
//   ② 實測正確率本身受抽題影響（現時抽得容易，所以睇落容易），
//      改咗抽題之後真實數字會漂移。呢個係內生性問題，模擬解決唔到。
//   ③ 假設學生表現同課題獨立。實際上連續答錯會影響狀態（§7 大愛設計）。
// 故此本腳本嘅輸出應讀作【樂觀上限】：真實可達嘅正確率唔會低過呢個數。
// ============================================================================

import { readFileSync, writeFileSync, mkdtempSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const args = process.argv.slice(2)
const arg = (n: string, d: number) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] ? Number(args[i + 1]) : d }
const SESSIONS = arg('sessions', 1000)
const SIZE = arg('size', 10) // 同 lib/entitlements.ts SESSION_SIZE 一致（§7.1：10）
const MIN_N = arg('min', 8)
const TARGET = 0.65

// ── 載入題庫（同 recalibrate-difficulty.mts 同一招）──────────────────────────
const ts = (await import('typescript')).default
const TMP = mkdtempSync(join(tmpdir(), 'sim-'))
const tr = (p: string) => ts.transpileModule(readFileSync(p, 'utf8'), { compilerOptions: { module: 'ES2020', target: 'ES2020' } }).outputText
const rw = (js: string) => js.replace(/(from\s+['"])(\.\/[^'"]+?)(['"])/g, (m, a, s, b) => (s.endsWith('.mjs') ? m : `${a}${s}.mjs${b}`))
for (const f of readdirSync(join(ROOT, 'data/questions')).filter((f) => f.endsWith('.ts')))
  writeFileSync(join(TMP, f.replace(/\.ts$/, '.mjs')), rw(tr(join(ROOT, 'data/questions', f))))
writeFileSync(join(TMP, 'subjects.mjs'), rw(tr(join(ROOT, 'data/subjects.ts'))))
const Q = (await import('file://' + join(TMP, 'index.mjs'))) as { getSubjectQuestions: (s: string) => { type?: string; topic?: string }[] }
const { subjects } = (await import('file://' + join(TMP, 'subjects.mjs'))) as { subjects: { id: string; isActive?: boolean; nameZh?: string }[] }

// ── 實測正確率（同一把衛生閘）──────────────────────────────────────────────
const env = Object.fromEntries(readFileSync(join(ROOT, '.env.local'), 'utf8').split('\n')
  .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
  .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')] }))
const rows = await (await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_progress?select=progress_data`,
  { headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` } })).json() as { progress_data?: Record<string, unknown> }[]

const emp = new Map<string, { subject: string; label: string; total: number; wrong: number }>()
for (const row of rows) {
  const t = row.progress_data?.dse_topic_stats as Record<string, { label?: string; topic?: string; subjectId?: string; total?: number; wrong?: number }> | undefined
  if (!t) continue
  for (const [k, v] of Object.entries(t)) {
    if (!v?.subjectId || !v?.topic) continue
    const total = v.total ?? 0, wrong = v.wrong ?? 0
    if (total <= 0 || wrong < 0 || wrong > total) continue
    const c = emp.get(k) ?? { subject: v.subjectId, label: v.label ?? v.topic, total: 0, wrong: 0 }
    c.total += total; c.wrong += wrong; emp.set(k, c)
  }
}

// ── 抽題池：每個課題連同題數（權重上限）同實測答啱概率 ──────────────────────
interface Cell { key: string; subject: string; label: string; bankN: number; pCorrect: number; obsN: number }
const pool: Cell[] = []
for (const s of subjects) {
  if (s.isActive === false) continue
  const counts = new Map<string, number>()
  for (const q of Q.getSubjectQuestions(s.id)) {
    if ((q.type ?? 'mc') !== 'mc' || !q.topic) continue
    counts.set(q.topic, (counts.get(q.topic) ?? 0) + 1)
  }
  for (const [topic, bankN] of counts) {
    const e = emp.get(`${s.id}::${topic}`)
    if (!e || e.total < MIN_N) continue
    pool.push({ key: `${s.id}::${topic}`, subject: s.id, label: e.label, bankN, pCorrect: 1 - e.wrong / e.total, obsN: e.total })
  }
}
if (pool.length < 5) { console.error('✗ 有實測數據嘅課題太少，模擬冇意義'); process.exit(1) }

// 覆蓋率：模擬只涵蓋題庫嘅幾多
let bankMC = 0
for (const s of subjects) { if (s.isActive === false) continue; bankMC += Q.getSubjectQuestions(s.id).filter((q) => (q.type ?? 'mc') === 'mc').length }
const coveredMC = pool.reduce((a, c) => a + c.bankN, 0)

// ── 模擬 ────────────────────────────────────────────────────────────────────
// 權重 = 題庫題數 × (1 − 正確率)^k。乘題庫題數，因為一個只有 3 條題嘅課題
// 唔可能承擔一節 10 題 —— 唔計呢一項，模擬會高估極端傾斜嘅可行性。
function run(k: number, sessions = SESSIONS) {
  const w = pool.map((c) => c.bankN * Math.pow(Math.max(1 - c.pCorrect, 1e-6), k))
  const sum = w.reduce((a, b) => a + b, 0)
  const cum: number[] = []
  let acc = 0
  for (const x of w) { acc += x / sum; cum.push(acc) }
  let correct = 0, total = 0
  for (let s = 0; s < sessions; s++) {
    for (let i = 0; i < SIZE; i++) {
      const r = Math.random()
      let lo = 0, hi = cum.length - 1
      while (lo < hi) { const mid = (lo + hi) >> 1; if (cum[mid] < r) lo = mid + 1; else hi = mid }
      total++
      if (Math.random() < pool[lo].pCorrect) correct++
    }
  }
  return correct / total
}

const floorCell = [...pool].sort((a, b) => a.pCorrect - b.pCorrect)[0]

console.log(`\n${'═'.repeat(74)}\n  抽題演算法上限模擬（唯讀）\n${'═'.repeat(74)}`)
console.log(`\n模擬設定：${SESSIONS.toLocaleString()} 節 × ${SIZE} 題 = ${(SESSIONS * SIZE).toLocaleString()} 題 · 目標 ${(TARGET * 100).toFixed(0)}%`)
console.log(`抽題池：${pool.length} 個有實測數據嘅課題，涵蓋 ${coveredMC.toLocaleString()} / ${bankMC.toLocaleString()} 條 live MC（${((coveredMC / bankMC) * 100).toFixed(0)}%）`)

console.log(`\n${'─'.repeat(74)}`)
console.log(`  ${'傾斜程度'.padEnd(28)}${'全站正確率'.padStart(12)}${'距 65%'.padStart(11)}`)
console.log(`${'─'.repeat(74)}`)
const results: { k: number; label: string; acc: number }[] = []
for (const [k, label] of [[0, 'k=0  純隨機（現狀）'], [1, 'k=1  溫和傾斜'], [2, 'k=2  明顯傾斜'], [4, 'k=4  極端傾斜'], [8, 'k=8  近乎只抽最難']] as [number, string][]) {
  const a = run(k)
  results.push({ k, label, acc: a })
  const gap = (a - TARGET) * 100
  const mark = Math.abs(gap) <= 3 ? '  ✅ 命中' : gap > 0 ? '  ✗ 仍然過高' : '  ✗ 過低'
  console.log(`  ${label.padEnd(28)}${(a * 100).toFixed(1).padStart(11)}%${((gap > 0 ? '+' : '') + gap.toFixed(1)).padStart(10)}${mark}`)
}
console.log(`${'─'.repeat(74)}`)
console.log(`  ${'理論下限（只抽單一最難課題）'.padEnd(24)}${(floorCell.pCorrect * 100).toFixed(1).padStart(11)}%${(((floorCell.pCorrect - TARGET) * 100 > 0 ? '+' : '') + ((floorCell.pCorrect - TARGET) * 100).toFixed(1)).padStart(10)}`)
console.log(`  └─ 該課題：${floorCell.label}（${floorCell.subject}）· 實測 ${floorCell.obsN} 題`)

// ── 解 k：搵出令全站正確率命中目標嘅傾斜程度 ──────────────────────────────
//
// ⚠️ 呢段原本寫錯過：初版攞【最極端嗰個 k】去同目標比，於是 k=8 得 56.4%
//    亦被判成「已達 65% ± 3%」—— 56.4% 明明低過 62%。錯處在於問錯問題：
//    要問嘅唔係「最極端做唔做得到」，而係「有冇一個 k 命中目標」。
//    正確率隨 k 單調下降，所以二分搜尋解得到。
const lo0 = results[0].acc, hi0 = results[results.length - 1].acc
let hitK: number | null = null, hitAcc = NaN
if (TARGET <= lo0 && TARGET >= hi0) {
  let lo = 0, hi = 8
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2
    const a = run(mid, Math.max(SESSIONS, 3000)) // 解 k 時加大樣本，減少蒙地卡羅雜訊
    if (a > TARGET) lo = mid; else hi = mid
    hitK = mid; hitAcc = a
  }
}

console.log(`\n${'─'.repeat(74)}\n判讀`)
if (hitK !== null) {
  console.log(`  ✅ 單靠重新分配抽題權重，全站正確率去得到 65%。`)
  console.log(`     所需傾斜程度 k ≈ ${hitK.toFixed(2)}，模擬所得 ${(hitAcc * 100).toFixed(1)}%。`)
  console.log(``)
  console.log(`  ⚠️ 但呢個 k 嘅代價要講清楚。k ≈ ${hitK.toFixed(1)} 之下，抽題權重同 (1−正確率) 嘅`)
  console.log(`     ${hitK.toFixed(1)} 次方成正比 —— 即係實測最難嗰批課題會被大幅加重。`)
  const w = pool.map((c) => c.bankN * Math.pow(Math.max(1 - c.pCorrect, 1e-6), hitK!))
  const tot = w.reduce((a, b) => a + b, 0)
  const top = pool.map((c, i) => ({ c, share: w[i] / tot })).sort((a, b) => b.share - a.share).slice(0, 5)
  console.log(`     抽題佔比最高嘅五個課題：`)
  for (const t of top) {
    console.log(`       ${t.c.label.slice(0, 14).padEnd(18)} ${(t.share * 100).toFixed(1).padStart(5)}%  （實測 ${(t.c.pCorrect * 100).toFixed(0)}%，題庫 ${t.c.bankN} 條）`)
  }
  const top5 = top.reduce((a, t) => a + t.share, 0)
  console.log(`     五個課題合共佔 ${(top5 * 100).toFixed(0)}% 抽題量。`)
  console.log(``)
  console.log(`  ⛔ 呢個唔應該直接落實，兩個理由：`)
  console.log(`     ① 課程覆蓋崩潰。學生做 10 題有 ${(top5 * 10).toFixed(1)} 題落喺同五個課題，`)
  console.log(`        其餘課題近乎抽唔到 —— 呢個係「刷正確率」而唔係「溫書」。`)
  console.log(`     ② 內生性。實測正確率係喺【現行抽題】之下量到嘅。一改權重，`)
  console.log(`        學生喺該課題嘅曝露量大增，正確率會上升（練得多咗），`)
  console.log(`        於是 65% 守唔住，要不斷加大 k —— 呢個係一個追唔到嘅移動目標。`)
  console.log(``)
  console.log(`  建議讀法：65% 係【題庫問題】而唔係【演算法問題】。`)
  console.log(`  演算法搆得到 65%，但要用一個會摧毀課程覆蓋嘅權重。`)
  console.log(`  可持續嘅做法係出真正有鑑別度嘅新題，令 k 唔使推到咁盡。`)
} else if (hi0 > TARGET) {
  console.log(`  ❌ 即使把權重推到極端（k=8），全站正確率仍然停喺 ${(hi0 * 100).toFixed(1)}%，`)
  console.log(`     距 65% 尚差 ${((hi0 - TARGET) * 100).toFixed(1)} 個百分點。調演算法呢條路去唔到 65%，要出新題。`)
} else {
  console.log(`  ⚠️ 純隨機（k=0）已經係 ${(lo0 * 100).toFixed(1)}%，低於目標 —— 檢查抽題池同實測數據。`)
}

console.log(`\n${'─'.repeat(74)}`)
console.log(`⚠️ 本模擬嘅三項限制（檔頭有詳細說明）：`)
console.log(`   ① 只涵蓋 ${((coveredMC / bankMC) * 100).toFixed(0)}% 題庫 —— 其餘課題真實難度不明`)
console.log(`   ② 實測正確率本身受現行抽題影響（內生性），改咗抽題會漂移`)
console.log(`   ③ 假設題目之間獨立，冇計連續答錯對狀態嘅影響`)
console.log(`   故此結果應讀作【樂觀上限】：真實可達嘅正確率唔會低過呢個數。`)
console.log(`\n唯讀 —— 冇改抽題邏輯、冇改題庫、冇寫 Supabase。\n`)
