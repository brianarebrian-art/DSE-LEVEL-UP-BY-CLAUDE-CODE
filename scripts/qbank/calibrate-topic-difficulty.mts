// ============================================================================
// calibrate-topic-difficulty.mts —— 逐課題 × 難度級校準（唯讀）
// ----------------------------------------------------------------------------
//   npm run qbank:calibrate                  報告
//   npm run qbank:calibrate -- --propose     另外寫一份提案 JSON（唔郁題庫）
//
// ⚠️ 唯讀。永遠唔會改 data/questions/*.ts 一隻字。--propose 只係寫一份
//    【提案檔】出嚟畀人睇 —— 憲章 §12：機器負責量度，唔負責入庫。
//
// ══ 粒度：點解係「逐課題 × 難度級」而唔係逐題 ══
// 2026-09-10 簽署：「逐課題 × 難度級校準。呢個粒度已經足夠解決目標書想解決嘅
// 問題 —— 失真唔係出喺個別題目，係出喺成個難度標籤系統。」
//
// 逐題做唔到，亦唔應該做：
//   ① 逐題答對率要一張 user_id + question_id + 對錯 嘅表 —— 就係 `question_events`，
//      已於 0003_drop_teacher_platform.sql 刪除，憲章 §16.E 約束 7 明文維持刪除。
//   ② 就算有，26,064 條題除以現有 5,835 題實測 = 每條題 0.22 次觀測。逐題估計
//      喺統計上等於冇。
//
// ══ 本腳本點樣估一個 cell ══
// 一個 cell = (科目, 課題, 難度級)。三個數據源，粗幼差好遠：
//
//   dse_topic_stats     676 條目 · 100 個課題有 ≥8 題實測   ← 厚，可信
//   difficultyResults   867 題（48 節）                     ← 中等
//   逐題觀測             見下面「④ 樣本力核對」             ← 薄到唔用得
//
// 所以 cell 嘅估計值 =【課題實測正確率】，而難度級嘅修正量【實測為零】：
// accuracy-budget ② 檢定咗三層 χ² = 1.83、p ≈ 0.40，即係三層統計上分唔開。
// 一個量度為零嘅因子，唔應該喺估計式入面攞到非零權重 —— 否則就係拿噪音當訊號。
//
// 呢個結論同簽署嗰句一致：失真出喺【標籤系統】，唔係出喺個別題目。
//
// ══ 分界線點嚟 ══
// 由 65% 目標倒推。3:5:2 之下要 65%，三層要真係分開，一組自然嘅目標係
//   easy 85% · medium 65% · hard 40%  →  0.3(.85)+0.5(.65)+0.2(.40) = 66.0%
// 分界線取相鄰目標嘅中點：85/65 → 75%，65/40 → 52.5%。
// 唔係執個靚數，係由目標推出嚟 —— 目標一改，分界線跟住改。
// ============================================================================

import { readFileSync, writeFileSync, mkdtempSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const args = process.argv.slice(2)
const PROPOSE = args.includes('--propose')
const MIN_N = 8

const TIER_TARGET = { easy: 0.85, medium: 0.65, hard: 0.40 } as const
const CUT_EASY_MEDIUM = (TIER_TARGET.easy + TIER_TARGET.medium) / 2      // 0.750
const CUT_MEDIUM_HARD = (TIER_TARGET.medium + TIER_TARGET.hard) / 2      // 0.525
type Tier = keyof typeof TIER_TARGET
const TIERS: Tier[] = ['easy', 'medium', 'hard']
const bandOf = (acc: number): Tier => (acc >= CUT_EASY_MEDIUM ? 'easy' : acc >= CUT_MEDIUM_HARD ? 'medium' : 'hard')

// ── 載入 live 題庫 ──────────────────────────────────────────────────────────
const ts = (await import('typescript')).default
const TMP = mkdtempSync(join(tmpdir(), 'calib-'))
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
const NAME = new Map(subjects.map((s) => [s.id, s.nameZh ?? s.id]))

interface Cell { subject: string; topic: string; tier: Tier; n: number; ids: string[] }
const cells = new Map<string, Cell>()
for (const s of subjects) {
  if (s.isActive === false) continue
  for (const q of Q.getSubjectQuestions(s.id)) {
    if ((q.type ?? 'mc') !== 'mc' || !q.topic || !q.difficulty) continue
    if (!TIERS.includes(q.difficulty as Tier)) continue
    const k = `${s.id}::${q.topic}::${q.difficulty}`
    const c = cells.get(k) ?? { subject: s.id, topic: q.topic, tier: q.difficulty as Tier, n: 0, ids: [] }
    c.n++
    if (c.ids.length < 3) c.ids.push(q.id)
    cells.set(k, c)
  }
}

// ── Supabase（server-only service role）─────────────────────────────────────
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

// 課題實測（厚）—— key 係 `subject::topicId`
const topicAcc = new Map<string, { label: string; total: number; wrong: number }>()
for (const row of rows) {
  const t = row.progress_data?.dse_topic_stats
  if (!t) continue
  for (const [key, v] of Object.entries(t as Record<string, any>)) {
    if (!v?.subjectId || !v?.topic || !Number.isFinite(v.total)) continue
    const total = v.total ?? 0, wrong = v.wrong ?? 0
    if (total <= 0 || wrong < 0 || wrong > total) continue // 同一把衛生閘
    const cur = topicAcc.get(key) ?? { label: v.label ?? v.topic, total: 0, wrong: 0 }
    cur.total += total; cur.wrong += wrong
    topicAcc.set(key, cur)
  }
}

// ── ④ 樣本力核對：逐個 cell 有幾多次真實觀測？──────────────────────────────
//
// ⚠️ 呢一段【只用嚟證明 cell 級估計做唔到】，唔會攞去砌任何模型。
//    aggregate 完即棄，冇 user_id、冇落地、冇入庫 —— 純粹係一個 power check。
//    數據源係兩個【已經雙簽批准上雲】嘅 key（憲章 §16.E 約束 5）：
//    dse_active_session 嘅 questionIds[] ↔ answers[].isCorrect 平行陣列，
//    以及 dse_reverse_log（只有答錯，所以單獨用計唔到正確率）。
const qMeta = new Map<string, { subject: string; topic?: string; tier?: string }>()
for (const s of subjects) {
  if (s.isActive === false) continue
  for (const q of Q.getSubjectQuestions(s.id)) qMeta.set(q.id, { subject: s.id, topic: q.topic, tier: q.difficulty })
}
const cellObs = new Map<string, number>()
let perQ = 0
for (const row of rows) {
  const as = row.progress_data?.dse_active_session
  if (as?.questionIds && Array.isArray(as.answers)) {
    for (let i = 0; i < as.answers.length; i++) {
      const id = as.questionIds[i]
      const m = id && qMeta.get(id)
      if (!m?.topic || !m.tier) continue
      perQ++
      const k = `${m.subject}::${m.topic}::${m.tier}`
      cellObs.set(k, (cellObs.get(k) ?? 0) + 1)
    }
  }
  for (const e of (row.progress_data?.dse_reverse_log ?? []) as any[]) {
    const m = e?.questionId && qMeta.get(e.questionId)
    if (!m?.topic || !m.tier) continue
    perQ++
    const k = `${m.subject}::${m.topic}::${m.tier}`
    cellObs.set(k, (cellObs.get(k) ?? 0) + 1)
  }
}
const cellsWithAny = [...cells.keys()].filter((k) => (cellObs.get(k) ?? 0) > 0).length
const cellsWithEnough = [...cells.keys()].filter((k) => (cellObs.get(k) ?? 0) >= MIN_N).length

// ── ⑤ 估計 + 提案 ──────────────────────────────────────────────────────────
interface Row extends Cell { acc: number | null; obsN: number; proposed: Tier | null; label: string }
const out: Row[] = []
for (const [k, c] of cells) {
  const ta = topicAcc.get(`${c.subject}::${c.topic}`)
  const enough = ta && ta.total >= MIN_N
  const acc = enough ? 1 - ta.wrong / ta.total : null
  out.push({ ...c, acc, obsN: ta?.total ?? 0, proposed: acc === null ? null : bandOf(acc), label: ta?.label ?? c.topic })
}

const covered = out.filter((r) => r.acc !== null)
const coveredQ = covered.reduce((s, r) => s + r.n, 0)
const allQ = out.reduce((s, r) => s + r.n, 0)
const moved = covered.filter((r) => r.proposed !== r.tier)
const movedQ = moved.reduce((s, r) => s + r.n, 0)

const pct = (x: number) => (x * 100).toFixed(1) + '%'
const line = '─'.repeat(76)
console.log(`\n${'═'.repeat(76)}\n  逐課題 × 難度級校準（唯讀 —— 唔會改題庫）\n${'═'.repeat(76)}`)

console.log(`\n① 校準對象`)
console.log(`   cell（科目 × 課題 × 難度級）：${cells.size}`)
console.log(`   涵蓋 MC 題：${allQ.toLocaleString()} 條`)

console.log(`\n${line}\n② 分界線（由 65% 目標倒推，唔係執靚數）`)
console.log(`   三層目標：easy ${pct(TIER_TARGET.easy)} · medium ${pct(TIER_TARGET.medium)} · hard ${pct(TIER_TARGET.hard)}`)
console.log(`   3:5:2 加權 = ${pct(0.3 * TIER_TARGET.easy + 0.5 * TIER_TARGET.medium + 0.2 * TIER_TARGET.hard)}（目標 65%）`)
console.log(`   分界：實測 ≥ ${pct(CUT_EASY_MEDIUM)} → easy · ≥ ${pct(CUT_MEDIUM_HARD)} → medium · 其餘 → hard`)

console.log(`\n${line}\n③ 樣本力：cell 級估計做唔做得到？`)
console.log(`   逐題觀測合共 ${perQ} 次 · 分佈落 ${cells.size} 個 cell`)
console.log(`   有【任何】觀測嘅 cell：${cellsWithAny} / ${cells.size}（${pct(cellsWithAny / cells.size)}）`)
console.log(`   有 ≥ ${MIN_N} 次觀測嘅 cell：${cellsWithEnough} / ${cells.size}（${pct(cellsWithEnough / cells.size)}）`)
console.log(`   → ❌ cell 級直接估計做唔到。改由【課題實測】推算，難度級修正量取零`)
console.log(`     （accuracy-budget ② 檢定：三層 χ² = 1.83、p ≈ 0.40，統計上分唔開）`)

console.log(`\n${line}\n④ 校準結果`)
console.log(`   有課題實測撐得住嘅 cell：${covered.length} / ${cells.size} · 涵蓋 ${coveredQ.toLocaleString()} / ${allQ.toLocaleString()} 條題（${pct(coveredQ / allQ)}）`)
console.log(`   標籤要郁嘅：${moved.length} 個 cell · ${movedQ.toLocaleString()} 條題（佔有數據嗰批 ${pct(movedQ / (coveredQ || 1))}）`)
const dir = new Map<string, number>()
for (const r of moved) dir.set(`${r.tier} → ${r.proposed}`, (dir.get(`${r.tier} → ${r.proposed}`) ?? 0) + r.n)
for (const [k, v] of [...dir].sort((a, b) => b[1] - a[1])) console.log(`     ${k.padEnd(20)}${v.toLocaleString().padStart(7)} 條`)

console.log(`\n${line}\n⑤ 校準後嘅題庫分佈（只計有數據嗰批）`)
const before: Record<string, number> = { easy: 0, medium: 0, hard: 0 }
const after: Record<string, number> = { easy: 0, medium: 0, hard: 0 }
for (const r of covered) { before[r.tier] += r.n; after[r.proposed!] += r.n }
console.log(`   ${'層'.padEnd(9)}${'現時標籤'.padStart(10)}${'校準後'.padStart(10)}${'  變化'}`)
for (const t of TIERS) {
  const d = after[t] - before[t]
  console.log(`   ${t.padEnd(9)}${before[t].toLocaleString().padStart(10)}${after[t].toLocaleString().padStart(10)}   ${d > 0 ? '+' : ''}${d.toLocaleString()}`)
}
console.log(`\n   ⚠️ 呢個先係「hard 唔 hard」嘅實數。3:5:2 每節要抽 2 條 hard ——`)
console.log(`      校準後真正夠 hard 嘅題得 ${after.hard.toLocaleString()} 條，佔 ${pct(after.hard / (coveredQ || 1))}。`)

console.log(`\n${line}\n⑥ 校準後最需要出新題嘅課題（實測最難，即係學生真係唔識嗰啲）`)
console.log(`   ${'課題'.padEnd(24)}${'科目'.padEnd(12)}${'實測'.padStart(8)}${'觀測'.padStart(6)}${'題庫'.padStart(6)}  現時 → 校準後`)
for (const r of covered.filter((r) => r.proposed !== 'easy').sort((a, b) => a.acc! - b.acc!).slice(0, 15)) {
  console.log(`   ${r.label.slice(0, 11).padEnd(24)}${(NAME.get(r.subject) ?? r.subject).slice(0, 5).padEnd(12)}` +
    `${pct(r.acc!).padStart(8)}${String(r.obsN).padStart(6)}${String(r.n).padStart(6)}  ${r.tier} → ${r.proposed}`)
}

if (PROPOSE) {
  // ⚠️ 目的地【寫死喺呼叫度】，唔准經變數。
  //    唯讀性靠 lib/__tests__/calibration-readonly.test.mts 靜態掃 writeFileSync
  //    嘅第一個參數 —— 傳個變數入去，個閘就睇唔到寫緊去邊，等於冇閘。
  writeFileSync(join(ROOT, 'scripts/qbank/drafts/_difficulty-proposal.json'), JSON.stringify({
    generatedAt: new Date().toISOString(),
    method: 'topic-empirical accuracy; difficulty-tier adjustment measured null (chi2=1.83, p=0.40)',
    cuts: { easyMedium: CUT_EASY_MEDIUM, mediumHard: CUT_MEDIUM_HARD },
    reviewer: '', // ⚠️ 留白 —— 憲章 §16.C：冇人跑過就唔准填
    status: 'pending',
    changes: moved.map((r) => ({
      subject: r.subject, topic: r.topic, from: r.tier, to: r.proposed,
      questions: r.n, sampleIds: r.ids, empiricalAccuracy: r.acc, observations: r.obsN,
    })),
  }, null, 2) + '\n')
  console.log(`\n${line}\n提案已寫入 scripts/qbank/drafts/_difficulty-proposal.json`)
  console.log(`   ⚠️ 提案檔 ≠ 入庫。reviewer 欄留白、status = pending。`)
  console.log(`   題庫一隻字都冇改過 —— 要改要人手改，同題目入庫係同一條管線（憲章 §12）。`)
}

console.log(`\n${line}`)
console.log(`⚠️ 唯讀。冇改過 data/questions/*.ts、冇寫入 Supabase。`)
console.log(`   ③ 嘅逐題 aggregate 即用即棄，冇 user_id、冇落地 —— 只用嚟證明 cell 級做唔到。\n`)
