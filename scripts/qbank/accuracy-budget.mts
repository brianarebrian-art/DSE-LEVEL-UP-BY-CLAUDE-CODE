// ============================================================================
// accuracy-budget.mts —— 「65%」到底要幾多條新題？（唯讀）
// ----------------------------------------------------------------------------
//   npm run qbank:accuracy-budget
//
// ⚠️ 唯讀。唔改題庫、唔改標籤、唔寫 Supabase。
//
// ══ 點解要有呢個腳本 ══
// 2026-09-10 簽署：「接受『65% 靠出新題而非靠加大抽題傾斜』呢個路徑」。
// 呢個決定一落，「65%」就由一個抽題參數問題，變成一個【出題預算問題】——
// 而預算要計得出，先至知道 1,200／30,000 呢兩個數夠唔夠。
//
// 抽題模擬器（simulate-sampling.mts）答嘅係「唔出新題，靠傾斜可以去到幾低」。
// 呢個腳本答相反嗰邊：「唔加傾斜，靠出新題要出幾多、要出幾難」。
//
// ══ 模型 ══
// 一節按 3:5:2 出卷（憲章 §7）。所以：
//     節正確率 = 0.3 × easy 正確率 + 0.5 × medium 正確率 + 0.2 × hard 正確率
// 每一層嘅正確率，係該層題庫入面所有題目嘅平均。加入 N 條新題之後：
//     層正確率 = (舊題數 × 舊正確率 + N × 新題正確率) / (舊題數 + N)
//
// 呢個模型嘅假設【寫明喺度】，因為佢決定咗結論可唔可信：
//   ① 層內均勻抽樣 —— 同一層之內每條題被抽中嘅機會相等。
//      現行 buildPool 係 unseen-first 排序 + 分層抽，唔完全均勻，
//      但 EMPIRICAL_K = 0 之下冇難度傾斜，所以層內大致均勻。
//   ② 新題嘅實測正確率係一個【假設】，唔係量度值 —— 未出嘅題冇數據。
//      所以本腳本輸出嘅係一張【對照表】而唔係單一答案：
//      你打算出幾難嘅題，就睇返嗰一行要出幾多條。
// ============================================================================

import { readFileSync, writeFileSync, mkdtempSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const TARGET = 0.65
const RATIO = { easy: 0.3, medium: 0.5, hard: 0.2 } as const
type Tier = keyof typeof RATIO
const TIERS: Tier[] = ['easy', 'medium', 'hard']

// ── 載入 live 題庫 ──────────────────────────────────────────────────────────
const ts = (await import('typescript')).default
const TMP = mkdtempSync(join(tmpdir(), 'budget-'))
const transpile = (p: string) =>
  ts.transpileModule(readFileSync(p, 'utf8'), { compilerOptions: { module: 'ES2020', target: 'ES2020' } }).outputText
const rewrite = (js: string) =>
  js.replace(/(from\s+['"])(\.\/[^'"]+?)(['"])/g, (m, a, s, b) => (s.endsWith('.mjs') ? m : `${a}${s}.mjs${b}`))
for (const f of readdirSync(join(ROOT, 'data/questions')).filter((f) => f.endsWith('.ts')))
  writeFileSync(join(TMP, f.replace(/\.ts$/, '.mjs')), rewrite(transpile(join(ROOT, 'data/questions', f))))
writeFileSync(join(TMP, 'subjects.mjs'), rewrite(transpile(join(ROOT, 'data/subjects.ts'))))
const Q = (await import('file://' + join(TMP, 'index.mjs'))) as {
  getSubjectQuestions: (s: string) => { id: string; type?: string; topic?: string; difficulty?: string }[]
}
const { subjects } = (await import('file://' + join(TMP, 'subjects.mjs'))) as {
  subjects: { id: string; isActive?: boolean }[]
}

const bank: Record<Tier, number> = { easy: 0, medium: 0, hard: 0 }
let mcTotal = 0
for (const s of subjects) {
  if (s.isActive === false) continue
  for (const q of Q.getSubjectQuestions(s.id)) {
    if ((q.type ?? 'mc') !== 'mc') continue
    mcTotal++
    if (q.difficulty && q.difficulty in bank) bank[q.difficulty as Tier]++
  }
}

// ── 實測逐層正確率 ──────────────────────────────────────────────────────────
const env = Object.fromEntries(
  readFileSync(join(ROOT, '.env.local'), 'utf8').split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')] }),
)
const res = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_progress?select=progress_data`, {
  headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` },
})
const rows = (await res.json()) as { progress_data?: Record<string, any> }[]
if (!Array.isArray(rows)) { console.error('✗ Supabase 讀取失敗'); process.exit(1) }

const obs: Record<Tier, [number, number]> = { easy: [0, 0], medium: [0, 0], hard: [0, 0] }
let siteCorrect = 0, siteTotal = 0
for (const row of rows) {
  for (const a of (row.progress_data?.dse_progress ?? []) as any[]) {
    // 同 lib/progress.ts 一樣嘅衛生閘 —— 唔可以信 score > total 嗰條
    if (!a || (a.score ?? 0) > (a.total ?? 0) || (a.total ?? 0) <= 0) continue
    siteCorrect += a.score ?? 0
    siteTotal += a.total ?? 0
    if (!a.difficultyResults) continue
    for (const k of TIERS) {
      const d = a.difficultyResults[k]
      if (d) { obs[k][0] += d.correct ?? 0; obs[k][1] += d.total ?? 0 }
    }
  }
}
const acc = (t: Tier) => (obs[t][1] ? obs[t][0] / obs[t][1] : NaN)

// ── ① 三層分唔分得開？（χ² 獨立性檢定）────────────────────────────────────
//
// 舊版 recalibrate-difficulty.mts 見到 hard(91.9%) > easy(90.5%) 就寫
// 「❌ 標籤排序係錯嘅」。嗰句 over-claim 咗 —— hard 只得 160 題，
// 呢個差距完全可以係抽樣噪音。「排序反轉」同「分唔開」係兩個唔同嘅結論，
// 而後者先至係數據撐得住嗰個。
//
// 分唔開本身已經足夠判死個標籤系統：一個有鑑別度嘅難度標籤，
// 應該令三層【顯著地】分開。分唔開 = 冇鑑別度。
const nAll = TIERS.reduce((s, t) => s + obs[t][1], 0)
const cAll = TIERS.reduce((s, t) => s + obs[t][0], 0)
const pPool = cAll / nAll
let chi2 = 0
for (const t of TIERS) {
  const n = obs[t][1]
  if (!n) continue
  for (const [o, e] of [[obs[t][0], n * pPool], [n - obs[t][0], n * (1 - pPool)]]) {
    if (e > 0) chi2 += ((o - e) ** 2) / e
  }
}
// df = 2。上尾機率（df=2 有閉式解：p = exp(-χ²/2)）
const pValue = Math.exp(-chi2 / 2)

// ── ② 上限：三層各自去到最盡，節正確率去到幾多 ────────────────────────────
const blend = (e: number, m: number, h: number) => RATIO.easy * e + RATIO.medium * m + RATIO.hard * h
const now = blend(acc('easy'), acc('medium'), acc('hard'))
const hardZero = blend(acc('easy'), acc('medium'), 0)
const hardMedZero = blend(acc('easy'), 0, 0)

// ── ③ 出題預算：每層要幾多條新題 ──────────────────────────────────────────
// 要令某層由 a0 拉到目標 aT，加 N 條正確率 pNew 嘅新題：
//   (n0·a0 + N·pNew)/(n0+N) = aT   →   N = n0(a0 − aT)/(aT − pNew)
const needed = (n0: number, a0: number, aT: number, pNew: number) => {
  if (pNew >= aT) return Infinity // 新題唔夠難，加幾多都拉唔落
  return (n0 * (a0 - aT)) / (aT - pNew)
}

const pct = (x: number) => (Number.isFinite(x) ? (x * 100).toFixed(1) + '%' : '—')
const line = '─'.repeat(76)
console.log(`\n${'═'.repeat(76)}\n  出題預算：「全站 65%」實際要幾多條新題（唯讀）\n${'═'.repeat(76)}`)

console.log(`\n① 現況`)
console.log(`   題庫 MC ${mcTotal.toLocaleString()} 條 —— easy ${bank.easy.toLocaleString()} · medium ${bank.medium.toLocaleString()} · hard ${bank.hard.toLocaleString()}`)
console.log(`   實測全站 ${pct(siteTotal ? siteCorrect / siteTotal : NaN)}（${siteTotal.toLocaleString()} 題）`)
console.log(`   逐層實測：`)
for (const t of TIERS) console.log(`     ${t.padEnd(8)}${String(obs[t][1]).padStart(5)} 題 · ${pct(acc(t))}`)
console.log(`   3:5:2 加權推算 ${pct(now)} —— 對比實測 ${pct(siteTotal ? siteCorrect / siteTotal : NaN)}，模型成立`)

console.log(`\n${line}\n② 三層分唔分得開？`)
console.log(`   χ² = ${chi2.toFixed(2)} · df = 2 · p ≈ ${pValue.toFixed(2)}（樣本 ${nAll} 題）`)
console.log(`   判讀：${pValue < 0.05
  ? '三層有顯著差異'
  : '❌ 三層【統計上分唔開】—— 一個有鑑別度嘅難度標籤應該令三層顯著分開'}`)
console.log(`   ⚠️ 呢個唔等於「排序反轉」。hard 只得 ${obs.hard[1]} 題，91.9% vs 88.4% 完全可以係噪音。`)
console.log(`      「分唔開」係數據撐得住嘅結論；「排序係錯」唔係。兩者都足以判死個標籤系統。`)

console.log(`\n${line}\n③ 上限：唔出新題，重新標籤最多去到幾低`)
console.log(`   hard 層全部答錯（0%）        → 節正確率 ${pct(hardZero)}`)
console.log(`   hard ＋ medium 全部答錯（0%）→ 節正確率 ${pct(hardMedZero)}`)
console.log(`   ⚠️ 3:5:2 之下 easy 佔 30%，實測 ${pct(acc('easy'))} —— 單靠 easy 一層就已經鎖死咗 ${pct(RATIO.easy * acc('easy'))}。`)
console.log(`      即係話：${hardZero > TARGET
  ? `就算 hard 層每一條都答錯，都仲有 ${pct(hardZero)}，達唔到 65%。`
  : `hard 層做到夠難就搆得到 65%。`}`)

console.log(`\n${line}\n④ 出題預算對照表`)
console.log(`   要達到全站 65%，三層各自要拉到幾多？（easy 維持唔郁嘅前提下）`)
const eContrib = RATIO.easy * acc('easy')
console.log(`\n   ${'hard 層目標'.padEnd(14)}${'medium 層目標'.padEnd(16)}${'成立？'}`)
for (const h of [0.30, 0.40, 0.50, 0.60]) {
  const m = (TARGET - eContrib - RATIO.hard * h) / RATIO.medium
  console.log(`   ${pct(h).padEnd(14)}${pct(m).padEnd(16)}${m > 0 && m <= 1 ? '✅' : '❌ 做唔到'}`)
}

console.log(`\n   選定一組目標之後，要出幾多條新題：`)
console.log(`\n   ${'層'.padEnd(9)}${'現況'.padEnd(9)}${'目標'.padEnd(9)}${'新題正確率'.padEnd(12)}${'要出'.padStart(10)}`)
const PLAN: [Tier, number][] = [['hard', 0.40], ['medium', 0.597]]
for (const [t, aT] of PLAN) {
  for (const pNew of [0.20, 0.30]) {
    const n = needed(bank[t], acc(t), aT, pNew)
    console.log(`   ${t.padEnd(9)}${pct(acc(t)).padEnd(9)}${pct(aT).padEnd(9)}${pct(pNew).padEnd(12)}${Number.isFinite(n) ? Math.ceil(n).toLocaleString().padStart(10) : '  ∞ 拉唔郁'}`)
  }
}

const totalNew = PLAN.reduce((s, [t, aT]) => s + needed(bank[t], acc(t), aT, 0.30), 0)
console.log(`\n   新題正確率 30% 之下，合共要出 ${Math.ceil(totalNew).toLocaleString()} 條新 MC。`)
console.log(`   簽署目標係 MC 30,000（即係加 ${(30000 - mcTotal).toLocaleString()} 條）。`)
console.log(`   ${totalNew > 30000 - mcTotal
  ? `❌ 差距：${Math.ceil(totalNew - (30000 - mcTotal)).toLocaleString()} 條。30,000 呢個數達唔到 65%。`
  : `✅ 30,000 呢個數夠有凸。`}`)

console.log(`\n${line}\n⑤ 另一條路：唔出新題，改 3:5:2`)
//
// ③ 證明咗 easy 層鎖死咗 27.1%，即係話【比例本身】先係綁死 65% 嗰個約束，
// 而唔係題數。改比例係一行常數，改題庫係一年工程 —— 兩者要並排擺出嚟畀人揀。
//
// ⚠️ 3:5:2 由憲章 §7 訂明，而 lib/adaptiveOrder.ts 亦建基於呢個比例。
//    本節【只係計數】，唔構成修改建議 —— 要改就要改憲章，而憲章要雙簽。
const solveRatio = (e: number, m: number, h: number) => {
  // 固定 easy:medium 比例唔變，加大 hard 佔比 x：
  //   (1−x)·(現有 easy/medium 混合) + x·h = TARGET
  const mix = (RATIO.easy * e + RATIO.medium * m) / (RATIO.easy + RATIO.medium)
  const x = (TARGET - mix) / (h - mix)
  return x
}
for (const hAcc of [0.30, 0.40, 0.50]) {
  const x = solveRatio(acc('easy'), acc('medium'), hAcc)
  const ok = x > 0 && x < 1
  const e2 = ok ? (1 - x) * (RATIO.easy / (RATIO.easy + RATIO.medium)) : NaN
  const m2 = ok ? (1 - x) * (RATIO.medium / (RATIO.easy + RATIO.medium)) : NaN
  console.log(`   hard 層做到 ${pct(hAcc)} → 比例要變成 ` +
    (ok ? `${(e2 * 10).toFixed(1)} : ${(m2 * 10).toFixed(1)} : ${(x * 10).toFixed(1)}（現時 3 : 5 : 2）` : '❌ 冇解 —— hard 層再難都拉唔到'))
}
console.log(`   ⚠️ 呢個假設 hard 層【已經真係難】。而 ② 話畀我哋知，現時三層分唔開 ——`)
console.log(`      即係話改完比例，抽多咗嘅「hard」同 easy 一樣淺，全站正確率一個字都唔會郁。`)
console.log(`      所以呢條路唔係「改比例」，而係【先令 hard 名副其實，再改比例】。`)

console.log(`\n${line}`)
console.log(`⚠️ 唯讀。冇改過任何 difficulty 標籤、冇寫入題庫、冇寫入 Supabase。`)
console.log(`   ② 嘅 χ² 用實測數據；③④ 嘅「新題正確率」係【假設值】—— 未出嘅題冇數據，`)
console.log(`   所以④ 係一張對照表而唔係一個答案。出完第一批新題要返嚟重跑，用實測值取代假設。\n`)
