// ============================================================================
// recalibrate-difficulty.mts —— 實測難度校準（唯讀）
// ----------------------------------------------------------------------------
//   npm run qbank:recalibrate-difficulty
//
// ⚠️ 本腳本【唯讀】。唔會寫入題庫、唔會改任何 difficulty 標籤、唔會掂 Supabase
//    嘅寫入端。輸出淨係一份報告 —— 改唔改標籤係人嘅決定（憲章 §12 同一原則：
//    機器負責量度，唔負責入庫）。
//
// ══ 要答嘅問題 ══
// 2027 目標書講「進階題答對率 93.4%，靜態標籤失真」。呢個講法要驗證，
// 而唔係照單全收 —— 因為據此改成個題庫嘅標籤，係一個不可逆嘅動作。
//
// ══ 點解唔做「逐題」校準 ══
// 目標書要求「根據真實答題數據自動調整【題目】權重」。做唔到 ——
// 全站冇任何逐題答題紀錄。要有，就要開一張 user_id + question_id + 對錯 嘅表，
// 而嗰張表就係 `question_events`，已於 0003_drop_teacher_platform.sql 刪除，
// 並由憲章 §16.E 約束 7 明文維持刪除（lib/reviewSchedule.ts:8 亦註明係隱私紅線）。
//
// 現存數據嘅最幼粒度係【逐課題】同【逐難度級】，兩者分開存放：
//   dse_topic_stats     subject::topicId → { total, wrong }   ← 帶真實 topic id
//   difficultyResults   easy/medium/hard → { correct, total } ← 只得約 10% 節有
//   topicResults        中文標籤 → { correct, total }          ← 100% 節都有
//
// ══ 本腳本嘅核心測試 ══
// 「逐難度級」樣本太薄（hard 只得 160 題），單憑佢落結論唔穩陣。
// 所以改用一個樣本厚得多、亦更能直接回答問題嘅測試：
//
//   每個課題都有一個【靜態難度組合】（該課題入面 easy/medium/hard 各佔幾多），
//   亦有一個【實測正確率】。若果難度標籤有鑑別力，兩者應該相關 ——
//   hard 佔比愈高嘅課題，實測正確率應該愈低。
//
// 若相關性接近零，即係標籤唔止校準唔準，而係完全冇攜帶資訊。
// 呢個測試用到全部 675 個課題條目，而唔係 48 節嘅難度分項。
// ============================================================================

import { readFileSync, writeFileSync, mkdtempSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const args = process.argv.slice(2)
const JSON_OUT = args.includes('--json')
const MIN_N = Number(args[args.indexOf('--min') + 1]) || 8 // 課題最少要幾多題實測先入樣本

// ── 載入 live 題庫（沿用 topic-coverage.mjs 嘅轉譯法）────────────────────────
// data/questions/load.ts 用咗 `@/lib/questionCloud` 別名，tsx 解析唔到而令
// 成個模組 instantiate 失敗（check-draft-overlap.mts 就係死喺呢度）。
// 轉譯整個 data/questions 樹再 import 係 repo 既有慣例，繞得過。
const ts = (await import('typescript')).default
const TMP = mkdtempSync(join(tmpdir(), 'recal-'))
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
  subjects: { id: string; isActive?: boolean; nameZh?: string }[]
}

// ── 讀 Supabase（server-only service role，唔經瀏覽器）──────────────────────
const env = Object.fromEntries(
  readFileSync(join(ROOT, '.env.local'), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]
    }),
)
const res = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_progress?select=progress_data`, {
  headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` },
})
const rows = (await res.json()) as { progress_data?: Record<string, unknown> }[]
if (!Array.isArray(rows)) {
  console.error('✗ Supabase 讀取失敗：', JSON.stringify(rows).slice(0, 300))
  process.exit(1)
}

// ── ① 數據衛生閘 ────────────────────────────────────────────────────────────
//
// 點解要有：實測發現一條 math 紀錄寫住 score=10000 / total=100 / elapsed=4
//（4 秒做完 100 題）。淨係嗰一條，就令全站正確率由 88.5% 變成 257.8%、
// math 科變成 1748%。一個會信呢條紀錄嘅校準引擎，會把 math 判成「太淺」
// 而狂加難度。所以任何統計之前一定要先落閘。
//
// 閘本身刻意保守 —— 只剔【數學上不可能】嘅，唔剔【睇落可疑】嘅。
// 剔得太狠會令樣本偏向「乖學生」，而嗰個偏差冇人察覺得到。
interface Attempt {
  subjectId?: string
  score?: number
  total?: number
  elapsed?: number
  timestamp?: number
  topicResults?: { topic: string; correct: number; total: number }[]
  difficultyResults?: Record<string, { correct: number; total: number }>
}
const dropped: { why: string; a: Attempt }[] = []
const clean: Attempt[] = []
for (const row of rows) {
  const p = row.progress_data?.dse_progress
  if (!Array.isArray(p)) continue
  for (const a of p as Attempt[]) {
    const score = a.score ?? 0
    const total = a.total ?? 0
    if (!Number.isFinite(score) || !Number.isFinite(total)) { dropped.push({ why: '非數值', a }); continue }
    if (total <= 0) { dropped.push({ why: 'total ≤ 0', a }); continue }
    if (score < 0) { dropped.push({ why: 'score < 0', a }); continue }
    if (score > total) { dropped.push({ why: 'score > total（不可能）', a }); continue }
    clean.push(a)
  }
}

// ── ② 逐難度級（樣本薄，只作參照）──────────────────────────────────────────
const byDiff: Record<string, [number, number]> = { easy: [0, 0], medium: [0, 0], hard: [0, 0] }
let sessWithDiff = 0
for (const a of clean) {
  if (!a.difficultyResults) continue
  sessWithDiff++
  for (const k of ['easy', 'medium', 'hard'] as const) {
    const d = a.difficultyResults[k]
    if (d) { byDiff[k][0] += d.correct ?? 0; byDiff[k][1] += d.total ?? 0 }
  }
}

// ── ③ 逐課題實測（樣本厚 —— 本腳本嘅主力）──────────────────────────────────
// dse_topic_stats 嘅 key 係 `subject::topicId`，帶真實 topic id，
// 所以對得返題庫。topicResults 只有中文標籤，對唔返 id，故只用作總量核對。
const emp = new Map<string, { subject: string; topic: string; label: string; total: number; wrong: number }>()
for (const row of rows) {
  const ts_ = row.progress_data?.dse_topic_stats as Record<string, { label?: string; topic?: string; subjectId?: string; total?: number; wrong?: number }> | undefined
  if (!ts_) continue
  for (const [key, v] of Object.entries(ts_)) {
    if (!v?.subjectId || !v?.topic || !Number.isFinite(v.total)) continue
    const total = v.total ?? 0
    const wrong = v.wrong ?? 0
    if (total <= 0 || wrong < 0 || wrong > total) continue // 同一把衛生閘
    const cur = emp.get(key) ?? { subject: v.subjectId, topic: v.topic, label: v.label ?? v.topic, total: 0, wrong: 0 }
    cur.total += total; cur.wrong += wrong
    emp.set(key, cur)
  }
}

// ── ④ 題庫嘅靜態難度組合 ────────────────────────────────────────────────────
// 每個課題喺題庫入面嘅 easy/medium/hard 佔比。DIFF_SCORE 把組合壓成一個
// 0–1 嘅「靜態難度指數」（easy=0、medium=0.5、hard=1），方便同實測錯誤率相關。
const W: Record<string, number> = { easy: 0, medium: 0.5, hard: 1 }
const stat = new Map<string, { n: number; easy: number; medium: number; hard: number; idx: number }>()
for (const s of subjects) {
  if (s.isActive === false) continue
  const qs = Q.getSubjectQuestions(s.id).filter((q) => (q.type ?? 'mc') === 'mc')
  const g = new Map<string, { easy: number; medium: number; hard: number }>()
  for (const q of qs) {
    if (!q.topic || !q.difficulty) continue
    const c = g.get(q.topic) ?? { easy: 0, medium: 0, hard: 0 }
    if (q.difficulty in c) (c as Record<string, number>)[q.difficulty]++
    g.set(q.topic, c)
  }
  for (const [topic, c] of g) {
    const n = c.easy + c.medium + c.hard
    if (!n) continue
    stat.set(`${s.id}::${topic}`, { n, ...c, idx: (c.easy * W.easy + c.medium * W.medium + c.hard * W.hard) / n })
  }
}

// ── ⑤ 相關性：靜態難度指數 vs 實測錯誤率 ────────────────────────────────────
// 若標籤有鑑別力，兩者應正相關（hard 佔比愈高 → 錯得愈多）。
const pairs: { key: string; label: string; subject: string; n: number; idx: number; err: number; acc: number; obsN: number }[] = []
for (const [key, e] of emp) {
  const st = stat.get(key)
  if (!st || e.total < MIN_N) continue
  pairs.push({ key, label: e.label, subject: e.subject, n: st.n, idx: st.idx, err: e.wrong / e.total, acc: 1 - e.wrong / e.total, obsN: e.total })
}
const pearson = (xs: number[], ys: number[]) => {
  const n = xs.length
  if (n < 3) return NaN
  const mx = xs.reduce((a, b) => a + b, 0) / n
  const my = ys.reduce((a, b) => a + b, 0) / n
  let num = 0, dx = 0, dy = 0
  for (let i = 0; i < n; i++) { const a = xs[i] - mx, b = ys[i] - my; num += a * b; dx += a * a; dy += b * b }
  return dx && dy ? num / Math.sqrt(dx * dy) : NaN
}
const r = pearson(pairs.map((p) => p.idx), pairs.map((p) => p.err))

// ── 輸出 ────────────────────────────────────────────────────────────────────
const pct = (a: number, b: number) => (b ? ((a / b) * 100).toFixed(1) + '%' : '—')
const cleanScore = clean.reduce((s, a) => s + (a.score ?? 0), 0)
const cleanTotal = clean.reduce((s, a) => s + (a.total ?? 0), 0)
const NAME = new Map(subjects.map((s) => [s.id, s.nameZh ?? s.id]))

if (JSON_OUT) {
  console.log(JSON.stringify({
    hygiene: { kept: clean.length, dropped: dropped.length, reasons: dropped.map((d) => d.why) },
    overall: { questions: cleanTotal, accuracy: cleanTotal ? cleanScore / cleanTotal : null },
    byDifficulty: byDiff, sessionsWithDifficulty: sessWithDiff,
    correlation: { r, n: pairs.length, minObservations: MIN_N },
    topics: pairs.sort((a, b) => a.acc - b.acc),
  }, null, 2))
  process.exit(0)
}

const line = '─'.repeat(74)
console.log(`\n${'═'.repeat(74)}\n  實測難度校準（唯讀 —— 本腳本唔會改任何標籤）\n${'═'.repeat(74)}`)

console.log(`\n① 數據衛生閘`)
console.log(`   保留 ${clean.length} 節 · 剔走 ${dropped.length} 節`)
for (const d of dropped) {
  console.log(`   ✗ ${d.a.subjectId ?? '?'} score=${d.a.score} total=${d.a.total} elapsed=${d.a.elapsed}s  —— ${d.why}`)
}
if (dropped.length) {
  const dt = dropped.reduce((s, d) => s + (d.a.total ?? 0), 0)
  console.log(`   影響：若唔剔走，全站正確率會由 ${pct(cleanScore, cleanTotal)} 變成 ` +
    `${pct(cleanScore + dropped.reduce((s, d) => s + (d.a.score ?? 0), 0), cleanTotal + dt)}`)
}
console.log(`   清洗後全站：${cleanTotal.toLocaleString()} 題 · 正確率 ${pct(cleanScore, cleanTotal)}`)

console.log(`\n${line}\n② 逐難度級（樣本薄，只作參照）`)
console.log(`   有難度分項嘅節：${sessWithDiff} / ${clean.length}（${((sessWithDiff / clean.length) * 100).toFixed(0)}%）`)
for (const k of ['easy', 'medium', 'hard'] as const) {
  console.log(`   ${k.padEnd(7)} ${String(byDiff[k][1]).padStart(6)} 題 · 正確率 ${pct(byDiff[k][0], byDiff[k][1])}`)
}
const ok = byDiff.easy[1] && byDiff.medium[1] && byDiff.hard[1]
if (ok) {
  const ae = byDiff.easy[0] / byDiff.easy[1], am = byDiff.medium[0] / byDiff.medium[1], ah = byDiff.hard[0] / byDiff.hard[1]
  console.log(`   排序：${ae > am && am > ah ? '✅ easy > medium > hard（符合預期）' : '❌ 唔符合預期 —— 標籤排序係錯嘅'}`)
}

console.log(`\n${line}\n③ 核心測試：靜態難度標籤預唔預測得到實測正確率？`)
console.log(`   樣本：${pairs.length} 個課題（每個至少 ${MIN_N} 題實測紀錄）`)
console.log(`   相關係數 r = ${Number.isNaN(r) ? '—' : r.toFixed(3)}`)
const verdict = Number.isNaN(r) ? '樣本不足'
  : Math.abs(r) < 0.15 ? '❌ 幾乎零相關 —— 標籤唔攜帶任何難度資訊'
  : r < 0 ? '❌ 負相關 —— 標籤方向係反嘅'
  : r < 0.35 ? '⚠️  弱相關 —— 標籤有少量資訊，但遠不足以作抽題依據'
  : '✅ 有相關 —— 標籤大致成立'
console.log(`   判讀：${verdict}`)
console.log(`   （r = 1 代表 hard 佔比愈高錯得愈多；r = 0 代表標籤同實際難度無關）`)

console.log(`\n${line}\n④ 實測最難嘅課題（正確率由低至高，前 15）`)
console.log(`   ${'課題'.padEnd(26)}${'科目'.padEnd(14)}${'實測'.padStart(7)}${'題數'.padStart(6)}${'靜態指數'.padStart(9)}`)
for (const p of [...pairs].sort((a, b) => a.acc - b.acc).slice(0, 15)) {
  const flag = p.acc < 0.65 && p.idx < 0.4 ? '  ← 標籤偏淺' : p.acc > 0.95 && p.idx > 0.6 ? '  ← 標籤偏深' : ''
  console.log(`   ${p.label.slice(0, 12).padEnd(26)}${(NAME.get(p.subject) ?? p.subject).slice(0, 6).padEnd(14)}${pct(1 - p.err, 1).padStart(7)}${String(p.obsN).padStart(6)}${p.idx.toFixed(2).padStart(9)}${flag}`)
}

console.log(`\n${line}\n⑤ 距離 65% 目標`)
const cur = cleanTotal ? cleanScore / cleanTotal : 0
console.log(`   現時 ${pct(cleanScore, cleanTotal)} · 目標 65.0% · 差 ${((cur - 0.65) * 100).toFixed(1)} 個百分點`)
const below = pairs.filter((p) => p.acc <= 0.65)
console.log(`   實測已經 ≤ 65% 嘅課題：${below.length} / ${pairs.length}（${((below.length / pairs.length) * 100).toFixed(0)}%）`)
console.log(`   ⚠️ 抽題演算法只可以喺【現有題目】之間重新分配。若絕大部分課題實測都遠高於 65%，`)
console.log(`      加重邊個課題嘅權重都推唔到落 65% —— 要出新題。下一步（抽題模擬器）會量到上限喺邊。`)

console.log(`\n${line}`)
console.log(`⚠️ 本報告唯讀。冇改過任何 difficulty 標籤，冇寫入題庫，冇寫入 Supabase。`)
console.log(`   改唔改、點改，係人嘅決定 —— 機器負責量度（憲章 §12 同一原則）。`)
console.log(`   機器可讀輸出：npm run qbank:recalibrate-difficulty -- --json\n`)
