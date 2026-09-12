#!/usr/bin/env node
// ============================================================================
// promote-all.mjs —— 將【全部已具名簽署】嘅草稿批次一次過 promote
// ----------------------------------------------------------------------------
// 點解要有：promote-drafts.mjs 一次只做一個批次，而家有 120 個已簽名批次。
// 逐個打一次命令唔止慢，仲會漂移 —— 打漏一個，嗰批題就永遠停喺草稿度，
// 而【冇任何嘢會嗌】：測試唔會紅，閘唔會紅，佢淨係唔存在。
//
// ══ 最容易出事嗰一點：`--out` 檔名 ══
// promote-drafts.mjs 係【覆寫】唔係追加。如果呢度用「<草稿名>-reviewed」做
// 統一慣例，54 個沿用舊命名嘅歷史批次（例如 chinese-floor-batch1.json →
// chinese-floor-batch1.ts，冇 `-reviewed` 尾）就會各自多生一個新檔，
// 舊檔原封不動仲喺 load.ts 度接住 —— 即係同一批題入面庫兩次，
// 全站撞題測試會即刻紅，而根因喺一個睇落好無辜嘅命名慣例入面。
//
// 所以對照表【由檔案系統反推】，唔靠慣例：promote-drafts.mjs 生成嘅每個
// 題庫檔頭都有一行 `//   source   : <草稿>.json`，掃返出嚟就係真實對照。
// 只有從未 promote 過嘅新批次先至用 `<草稿名>-reviewed`。
//
// 用法：npm run qbank:promote-all [-- --dry]
// ============================================================================

import { execFileSync } from 'node:child_process'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const DRAFTS = 'scripts/qbank/drafts'
const BANKS = 'data/questions'
const DRY = process.argv.includes('--dry')

// 管線煙霧測試留低嘅 fixture，唔屬於題庫內容。
// 兩個檔都帶 `_agentMeta` 欄，係 agent 管線自我測試嘅產物。
// 佢哋一樣有簽名（一併批咗），所以一定要喺呢度明文排除 ——
// 靠「冇人記得 promote」嚟排除，等於冇排除。
const FIXTURES = new Set(['agent-smoke.json', 'agent-v5-batch.json'])

// ── 已經上線，但由【另一個生成器】管住嘅批次 ──────────────────────────────
//
// 呢 21 個批次嘅題目一早已經喺 live 題庫入面（學生一直做緊），但收容佢哋嘅
// 題庫檔冇 `//   source   :` 檔頭 —— 因為嗰啲檔唔係 promote-drafts.mjs 生成，
// 而係 *-auto.ts 一類由另一條管線寫出嚟，一個檔入面撈埋好幾批題。
//
// 如果唔明文排除，上面嗰條「揾唔到 source 就當新批次」嘅回退規則會將佢哋
// promote 去一個全新嘅 <草稿名>-reviewed.ts。後果唔係多咗個檔咁簡單：
// 同一批題會同時存在於兩個檔，全站撞題測試即刻紅；而如果有人「順手」將
// `--out` 指返去原本個 *-auto.ts，promote-drafts 係【覆寫】—— 嗰個檔入面
// 其餘幾批題會一次過消失，冇警告。
//
// 值 = 佢哋實際住喺邊個檔（2026-09-12 以首條 id 逐個反查確認）。
// 呢張表只作記錄同排除用，本腳本永遠唔會寫入嗰啲檔。
const ALREADY_LIVE_ELSEWHERE = {
  'bafs-replace.json': 'bafs-auto.ts',
  'chemistry-replace.json': 'chemistry-auto.ts',
  'chinese-crosstext-demo.json': 'chinese-reviewed.ts',
  'chinese-fanwen-long-batch1.json': 'chinese-fanwen-long.ts',
  'chinese-fanwen-weak-84.json': 'chinese-reviewed.ts',
  'chinese-floor.json': 'chinese-auto.ts',
  'chinese-history-floor.json': 'chinese-history-auto.ts',
  'chinese-literature-floor.json': 'chinese-literature-auto.ts',
  'chinese-p2-writing-batch1.json': 'chinese-p2-writing.ts',
  'economics-replace.json': 'economics-auto.ts',
  'econ-market-structure-mc-10.json': 'economics-reviewed.ts',
  'econ-supply-demand-mc-10.json': 'economics-reviewed.ts',
  'english-floor.json': 'english-auto.ts',
  'english-literature-floor.json': 'english-literature-auto.ts',
  'ethics-religious-floor.json': 'ethics-religious-auto.ts',
  'geography-floor.json': 'geography-auto.ts',
  'history-floor.json': 'history-auto.ts',
  'm1-replace.json': 'm1-auto.ts',
  'm2-replace.json': 'm2-auto.ts',
  'physics-replace.json': 'physics-auto.ts',
  'technology-living-floor.json': 'technology-living-auto.ts',
}

// `en-backfill-51.json` 唔係題目草稿 —— 佢係一份翻譯補漏紀錄（`kind` / `items`
// / `counts` 結構，冇 `id` 欄），只係啱啱好擺咗喺 drafts/ 入面。
const NOT_A_DRAFT = new Set(['en-backfill-51.json'])

// ── ① 由題庫檔頭反推 草稿 → 題庫檔名 ────────────────────────────────────
const outFor = new Map()
const dupes = []
for (const f of readdirSync(BANKS)) {
  if (!f.endsWith('.ts')) continue
  const head = readFileSync(join(BANKS, f), 'utf8').slice(0, 2000)
  const m = head.match(/^\/\/\s+source\s+:\s+(\S+\.json)\s*$/m)
  if (!m) continue
  const base = f.replace(/\.ts$/, '')
  if (outFor.has(m[1]) && outFor.get(m[1]) !== base) dupes.push(`${m[1]} → ${outFor.get(m[1])} 同 ${base}`)
  outFor.set(m[1], base)
}
if (dupes.length) {
  console.error('✗ 同一個草稿對到多過一個題庫檔 —— 唔敢覆寫，請人手釐清：')
  for (const d of dupes) console.error('   ' + d)
  process.exit(1)
}

// ── ② 砌計劃 ────────────────────────────────────────────────────────────
const plan = []
const skipped = []
for (const f of readdirSync(DRAFTS).sort()) {
  if (!f.endsWith('.json') || f.startsWith('_')
    || f.endsWith('.decisions.json') || f.endsWith('.rejected.json') || f.endsWith('.sample.json')) continue
  if (FIXTURES.has(f) || NOT_A_DRAFT.has(f)) continue
  if (f in ALREADY_LIVE_ELSEWHERE) { skipped.push(`${f} —— 已經喺 ${ALREADY_LIVE_ELSEWHERE[f]}`); continue }
  const dp = join(DRAFTS, f.replace(/\.json$/, '.decisions.json'))
  if (!existsSync(dp)) continue
  const dec = JSON.parse(readFileSync(dp, 'utf8'))
  const reviewer = String(dec?._meta?.reviewer ?? '').trim()
  if (!reviewer) continue                       // 未簽名 = 唔係本腳本嘅事
  const subject = String(dec?._meta?.subject ?? '').trim()
  if (!subject) { console.error(`✗ ${f}：decisions 檔冇 _meta.subject，promote 唔到`); process.exit(1) }
  plan.push({ file: f, subject, out: outFor.get(f) ?? f.replace(/\.json$/, '') + '-reviewed', fresh: !outFor.has(f) })
}

console.log(`計劃：${plan.length} 個已簽名批次（沿用現有題庫檔 ${plan.filter((p) => !p.fresh).length}、新開 ${plan.filter((p) => p.fresh).length}）`)
for (const p of plan.filter((x) => x.fresh)) console.log(`   🆕 ${p.file} → ${p.out}.ts`)
if (skipped.length) {
  console.log(`\n跳過 ${skipped.length} 個（由另一條管線管住，見 ALREADY_LIVE_ELSEWHERE）：`)
  for (const s of skipped) console.log('   ⏭  ' + s)
}
if (DRY) { console.log('\n--dry：冇執行任何 promote。'); process.exit(0) }

// ── ③ 執行 ──────────────────────────────────────────────────────────────
let ok = 0
const failed = []
for (const p of plan) {
  try {
    execFileSync('node', ['scripts/qbank/promote-drafts.mjs',
      '--in', join(DRAFTS, p.file), '--subject', p.subject,
      '--decisions', join(DRAFTS, p.file.replace(/\.json$/, '.decisions.json')),
      '--out', p.out], { encoding: 'utf8' })
    ok++
  } catch (e) {
    failed.push(`✗ ${p.file}\n${String(e.stdout ?? '')}${String(e.stderr ?? '')}`.trimEnd())
  }
}
console.log(`\npromote 成功 ${ok} / ${plan.length}`)
if (failed.length) {
  console.error('\n以下批次失敗：')
  for (const f of failed) console.error(f + '\n')
  process.exit(1)
}
console.log('⚠️ 新開嘅題庫檔【仲未接線】—— 要人手 wire 入 data/questions/load.ts')
console.log('   同 data/questions/index.ts（憲章 §12 第二道人手閘）。')
