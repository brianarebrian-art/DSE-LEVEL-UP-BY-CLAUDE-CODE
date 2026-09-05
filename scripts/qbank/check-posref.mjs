#!/usr/bin/env node
// ============================================================================
// check-posref.mjs —— 解析唔可以用位置指選項
// ----------------------------------------------------------------------------
// 點解：選項喺每次呈現時都會洗牌（app/practice/PracticeSession.tsx:114
// prepareQuestion → shuffle(pairs)），所以「第二項」／"the second option"
// 指嘅係當次隨機排到嗰個位嘅選項，並非作者寫嗰陣心目中嗰個。
// 學生睇到嘅解析因此會指錯選項。
//
// ══ 2026-09-05：加入掃題庫模式（--banks）══
// 舊版【只掃草稿】。嗰個決定當時係啱嘅（現存 *-auto.ts 有一批同類問題，
// 一掃就會令現有數據集即刻 fail，違反憲章 §6），但佢留低咗一個罅隙：
//
//   一個喺草稿度修好、但【冇重新 promote】嘅位置式引用，喺閘眼中完全隱形 ——
//   草稿綠燈，題庫照錯，而學生見到嘅係題庫。
//
// 2026-09-05 實際踩過：csd-b2-10 嘅「第三項」草稿早就改成「有一項」，
// 但冇人重跑 promote，個修正一個月都到唔到學生嗰邊，而 qa 全程綠燈。
//
// 所以而家掃埋題庫，用【祖父清單】處理現存嗰批（同 shape-baseline.json 一樣
// 嘅做法）：清單入面嘅獲豁免，清單以外嘅一條都唔准新增。
// 咁樣憲章 §6 照守（現有數據集唔會失效），而回歸即刻捉到。
//
//   node scripts/qbank/check-posref.mjs [檔案…]   （預設掃 drafts/ 全部）
//   node scripts/qbank/check-posref.mjs --banks   （順便掃 data/questions/，對祖父清單）
//   node scripts/qbank/check-posref.mjs --banks --write-baseline
//                                                 （重寫祖父清單；只准減，唔准加）
// ============================================================================
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const DRAFTS = 'scripts/qbank/drafts'
const BANKS = 'data/questions'
const BASELINE = 'scripts/qbank/posref-bank-baseline.json'
// 「第三項因素」＝混淆變項、「第二項憑證」＝雙重認證第二重、
// 「第二項」喺數學指多項式／點積嘅項 —— 呢啲都唔係選項引用。
const ZH = /第[一二三四]項(?!因素|變[項數]|憑證|獨立)/
const EN = /\b[Tt]he (?:first|second|third|fourth) (?:option|distractor)s?\b|\boptions? [ABCD]\b/
const FIELDS = ['explanation', 'explanationEn']

const argv = process.argv.slice(2)
const SCAN_BANKS = argv.includes('--banks')
const WRITE_BASELINE = argv.includes('--write-baseline')
const explicit = argv.filter((a) => !a.startsWith('--'))

const files = explicit.length
  ? explicit
  : readdirSync(DRAFTS).filter((f) => f.endsWith('.json') && !f.includes('.decisions.') && !f.includes('.review.')).map((f) => join(DRAFTS, f))

let bad = 0
for (const f of files) {
  let data
  try { data = JSON.parse(readFileSync(f, 'utf8')) } catch { continue }
  const qs = Array.isArray(data) ? data : (data.questions ?? data.drafts ?? data.items ?? [])
  for (const q of qs) {
    for (const k of FIELDS) {
      const t = q[k]
      if (typeof t !== 'string') continue
      const m = t.match(ZH) ?? t.match(EN)
      if (!m) continue
      bad++
      console.log(`  ✗ ${f.split('/').pop()} ${q.id} [${k}] 「${m[0]}」`)
      console.log(`     …${t.slice(Math.max(0, m.index - 30), m.index + 45)}…`)
    }
  }
}
if (bad) {
  console.log(`\n❌ ${bad} 處用咗位置指選項。選項會洗牌，請改為引用選項內容，`)
  console.log(`   或者用「有一項／另一項」「one option／another option」。`)
  process.exit(1)
}
console.log(`✅ check-posref：${files.length} 個草稿檔，冇位置式選項引用。`)

// ── 題庫掃描（--banks）────────────────────────────────────────────────────
// 題庫檔有兩種寫法：promote 生成嘅係純 JSON 陣列，手寫嘅係 TS object literal。
// 所以【唔好】試圖 JSON.parse 或者 import —— 直接抽 explanation 欄位嘅字串值，
// 兩種寫法都食得到。整份檔做全文 regex 就唔得：數學題嘅「第三項」可以係
// 數列嘅第三項，唔關選項事。
if (!SCAN_BANKS) process.exit(0)

const FIELD = /["']?(explanation|explanationEn)["']?\s*:\s*"((?:[^"\\]|\\.)*)"/g
const ID = /["']?id["']?\s*:\s*["']([^"']+)["']/g

function scanBank(file) {
  const s = readFileSync(file, 'utf8')
  // 先記低每個 id 出現嘅位置，之後每個命中向前搵最近嗰個。
  const ids = [...s.matchAll(ID)].map((m) => ({ at: m.index, id: m[1] }))
  const nearestId = (at) => {
    let r = '(不明)'
    for (const x of ids) { if (x.at > at) break; r = x.id }
    return r
  }
  const hits = []
  for (const m of s.matchAll(FIELD)) {
    const [field, text] = [m[1], m[2]]
    const hit = text.match(ZH) ?? text.match(EN)
    if (!hit) continue
    hits.push({ id: nearestId(m.index), field, phrase: hit[0] })
  }
  return hits
}

const bankFiles = readdirSync(BANKS).filter((f) => f.endsWith('.ts')).sort()
const found = {}
for (const f of bankFiles) {
  const hits = scanBank(join(BANKS, f))
  if (hits.length) found[f] = hits.map((h) => `${h.id} [${h.field}]`).sort()
}

const base = existsSync(BASELINE) ? JSON.parse(readFileSync(BASELINE, 'utf8')) : null

if (WRITE_BASELINE) {
  const old = base?.grandfathered ?? {}
  const added = []
  for (const [f, list] of Object.entries(found)) {
    const prev = new Set(old[f] ?? [])
    for (const e of list) if (!prev.has(e)) added.push(`${f} ${e}`)
  }
  // 只准減唔准加 —— 呢個限制先係「祖父清單」同「豁免清單」嘅分別。
  // 冇咗佢，任何新回歸都可以一句 --write-baseline 洗白。
  if (base && added.length) {
    console.log(`\n✗ 拒絕寫入：有 ${added.length} 項【新增】，祖父清單只准減唔准加。`)
    for (const a of added.slice(0, 10)) console.log(`   + ${a}`)
    console.log(`  呢啲係新出現嘅位置式引用，要修好，唔係加入豁免。\n`)
    process.exit(1)
  }
  const total = Object.values(found).reduce((n, l) => n + l.length, 0)
  writeFileSync(BASELINE, JSON.stringify({
    _note: [
      '位置式選項引用嘅【祖父清單】—— 呢啲題目喺題庫掃描生效之前已經存在，故獲豁免。',
      '憲章 §6：唔准以新閘令現有數據集失效。呢張清單就係嗰個豁免。',
      '',
      '⚠️ 只准減，唔准加。--write-baseline 見到有新增就會拒絕寫入。',
      '   清一條就由呢度剷一條；一條都唔准補入嚟。',
      '',
      '全部集中喺 *-auto.ts（機器生成、未經逐題人手改寫嗰批）。',
      '要清就要改草稿再重新 promote，而 promote 要真人簽名（憲章 §12）。',
    ],
    measuredAt: new Date().toISOString().slice(0, 10),
    total,
    grandfathered: found,
  }, null, 2) + '\n')
  console.log(`\n✅ 已寫入 ${BASELINE}：${total} 條，${Object.keys(found).length} 個檔。`)
  process.exit(0)
}

if (!base) {
  console.log(`\n✗ 搵唔到 ${BASELINE}。先跑一次 --banks --write-baseline 立基線。\n`)
  process.exit(1)
}

const old = base.grandfathered ?? {}
const regressions = []
const fixed = []
for (const [f, list] of Object.entries(found)) {
  const prev = new Set(old[f] ?? [])
  for (const e of list) if (!prev.has(e)) regressions.push(`${f} ${e}`)
}
for (const [f, list] of Object.entries(old)) {
  const now = new Set(found[f] ?? [])
  for (const e of list) if (!now.has(e)) fixed.push(`${f} ${e}`)
}

const nowTotal = Object.values(found).reduce((n, l) => n + l.length, 0)
if (regressions.length) {
  console.log(`\n❌ 題庫新增 ${regressions.length} 處位置式引用（祖父清單以外）：`)
  for (const r of regressions) console.log(`   ✗ ${r}`)
  console.log(`\n   選項會洗牌，位置指唔到人。改為引用選項內容，或者用「有一項／另一項」。`)
  console.log(`   ⚠️ 唔好用 --write-baseline 洗白 —— 佢會拒絕，而且嗰個先係呢道閘嘅重點。\n`)
  process.exit(1)
}
console.log(`✅ check-posref --banks：${bankFiles.length} 個題庫檔，${nowTotal} 條喺祖父清單內，零新增。`)
if (fixed.length) {
  console.log(`   🎉 已修好 ${fixed.length} 條，可以由祖父清單剷走（跑 --banks --write-baseline）：`)
  for (const x of fixed.slice(0, 5)) console.log(`      − ${x}`)
}
