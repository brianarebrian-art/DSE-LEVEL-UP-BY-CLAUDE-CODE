// ============================================================================
// apply-translations.mjs — 將【已簽名】嘅譯稿補入題庫（translation-batch 專用）
// ----------------------------------------------------------------------------
// 呢個唔係 promote-drafts.mjs 嘅替代品。promote 係將【新題目】入庫；呢個腳本
// 淨係做一件事：畀已經入咗庫嘅題目補返 contentEn / optionsEn / explanationEn。
//
// 硬性保證（每次執行都會斷言，違反即中止並且唔寫檔）：
//   ① reviewer 欄必須非空 —— 機器永不自動入庫
//   ② 只有 decisions 標明 approved 嘅條目先會套用
//   ③ 任何【已存在】嘅欄位（含 content / options / correctIndex / explanation）
//      必須逐字不變；只准新增嗰三條 En 欄
//   ④ 目標題目必須本來就冇 En 欄（唔會覆蓋任何現有譯文）
//
// 目標檔嘅 `*-reviewed.ts` 標明「Do NOT hand-edit」。呢個腳本正正就係為咗唔使
// 手改 —— 改動由 draft + decisions 兩份檔決定，可重跑、可審計。
//
// 用法：node scripts/qbank/apply-translations.mjs scripts/qbank/drafts/<name>.json
// ============================================================================

import { readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const IN = process.argv[2]
if (!IN) {
  console.error('用法: node scripts/qbank/apply-translations.mjs <drafts/xxx.json>')
  process.exit(1)
}

const doc = JSON.parse(readFileSync(IN, 'utf8'))
if (doc.kind !== 'translation-batch') {
  console.error(`❌ ${basename(IN)} 唔係 translation-batch（kind=${doc.kind}）`)
  process.exit(1)
}

const decPath = join(dirname(IN), `${basename(IN).replace(/\.json$/, '')}.decisions.json`)
const dec = JSON.parse(readFileSync(decPath, 'utf8'))

// ── 生死線 ①：冇真人簽名唔准入庫
const reviewer = String(dec._meta?.reviewer ?? '').trim()
if (!reviewer) {
  console.error(`\n❌ ${basename(decPath)} 嘅 reviewer 欄留白 —— 拒絕入庫。`)
  console.error(`   機器永不自動入庫：要有真人逐條批核並簽名，呢個腳本先會做嘢。\n`)
  process.exit(1)
}
if (String(dec._meta?.source ?? '') !== basename(IN)) {
  console.error(`❌ decisions 嘅 source (${dec._meta?.source}) 對唔上 ${basename(IN)}`)
  process.exit(1)
}

// ── 生死線 ②：只套用 approved
const approved = doc.items.filter((it) => dec.decisions?.[it.id] === 'approved')
const skipped = doc.items.filter((it) => dec.decisions?.[it.id] !== 'approved')

console.log(`\n${'═'.repeat(70)}\n  套用譯稿 — ${basename(IN)}\n${'═'.repeat(70)}`)
console.log(`  覆核人 : ${reviewer}（${dec._meta.reviewedAt || '未填日期'}）`)
console.log(`  ✅ 已批 ${approved.length} 條 · ⏭️  未批／退回 ${skipped.length} 條（唔會套用）\n`)

// ── 按目標檔分組
const byFile = {}
for (const it of approved) (byFile[it.sourceFile] ??= []).push(it)

let totalApplied = 0
const failures = []

for (const [relPath, items] of Object.entries(byFile)) {
  const abs = join(ROOT, relPath)
  const src = readFileSync(abs, 'utf8')

  // 檔案格式：`export const X: Question[] = [ …純 JSON… ]`
  const open = src.indexOf('= [')
  const close = src.lastIndexOf(']')
  if (open < 0 || close < 0) { failures.push(`${relPath}: 認唔到 Question[] 陣列`); continue }
  const head = src.slice(0, open + 2)
  const tail = src.slice(close + 1)
  let arr
  try {
    arr = JSON.parse(src.slice(open + 2, close + 1))
  } catch (e) {
    failures.push(`${relPath}: 陣列唔係合法 JSON（${e.message}）`)
    continue
  }

  const byId = new Map(arr.map((q) => [q.id, q]))
  const before = JSON.parse(JSON.stringify(arr)) // 深複製，用嚟事後逐欄比對

  for (const it of items) {
    const q = byId.get(it.id)
    if (!q) { failures.push(`${relPath}: 搵唔到 ${it.id}`); continue }

    // ── 生死線 ④：唔覆蓋現有譯文
    for (const k of ['contentEn', 'optionsEn', 'explanationEn']) {
      if (q[k] !== undefined) { failures.push(`${it.id}: ${k} 本身已存在，拒絕覆蓋`); }
    }
    // 譯稿記低嘅中文必須同題庫現況一致，否則題庫喺覆核之後被人改過
    if (q.content !== it.zh.content || q.explanation !== it.zh.explanation
        || JSON.stringify(q.options) !== JSON.stringify(it.zh.options) || q.correctIndex !== it.correctIndex) {
      failures.push(`${it.id}: 題庫中文內容同覆核時唔一致 —— 請重新覆核，唔好盲套`)
      continue
    }
    if (it.en.optionsEn.length !== q.options.length) {
      failures.push(`${it.id}: optionsEn 數目對唔上 options`)
      continue
    }

    // 重建物件，令 En 欄緊貼對應嘅中文欄（純為可讀性；JSON 物件順序唔影響行為）
    const rebuilt = {}
    for (const [k, v] of Object.entries(q)) {
      rebuilt[k] = v
      if (k === 'content') rebuilt.contentEn = it.en.contentEn
      if (k === 'options') rebuilt.optionsEn = it.en.optionsEn
      if (k === 'explanation') rebuilt.explanationEn = it.en.explanationEn
    }
    byId.set(it.id, rebuilt)
    const idx = arr.findIndex((x) => x.id === it.id)
    arr[idx] = rebuilt
    totalApplied++
  }

  // ── 生死線 ③：逐欄斷言 —— 舊欄位一個都唔准變
  const NEW = new Set(['contentEn', 'optionsEn', 'explanationEn'])
  for (let i = 0; i < arr.length; i++) {
    const a = before[i], b = arr[i]
    for (const k of Object.keys(a)) {
      if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) failures.push(`${a.id}: 欄位 ${k} 被改動（應該零改動）`)
    }
    for (const k of Object.keys(b)) {
      if (!(k in a) && !NEW.has(k)) failures.push(`${a.id}: 多咗未預期嘅欄位 ${k}`)
    }
  }

  if (failures.length) continue

  // `head` 收喺 "= " 度（唔包 '['），而 JSON.stringify(…, null, 2) 出嚟第一個字就係
  // '['、縮排亦同 promote-drafts.mjs 原本嘅寫法一致，所以直接駁埋就得 —— 唔好再
  // 加縮排或者 slice 走個 '['（曾經兩樣都做過，結果食咗開頭個中括號，寫出壞 TS）。
  const out = head + JSON.stringify(arr, null, 2) + tail

  // ── 生死線 ⑤：寫檔前確認產出仲係合法、而且陣列讀返出嚟同記憶體一致。
  const reOpen = out.indexOf('= ['), reClose = out.lastIndexOf(']')
  let roundTrip
  try {
    roundTrip = JSON.parse(out.slice(reOpen + 2, reClose + 1))
  } catch (e) {
    failures.push(`${relPath}: 產出唔係合法 JSON 陣列（${e.message}）—— 冇寫檔`)
    continue
  }
  if (JSON.stringify(roundTrip) !== JSON.stringify(arr)) {
    failures.push(`${relPath}: 產出來回讀寫唔一致 —— 冇寫檔`)
    continue
  }

  writeFileSync(abs, out)
  console.log(`  ✍️  ${relPath.padEnd(38)} 補咗 ${items.length} 條`)
}

if (failures.length) {
  console.error(`\n❌ ${failures.length} 項斷言唔過 —— 一個檔都冇寫：`)
  failures.slice(0, 20).forEach((f) => console.error('   ' + f))
  console.error()
  process.exit(1)
}

console.log(`\n  ✅ 合共補咗 ${totalApplied} 條英文欄（中文內容零改動）`)
console.log(`  下一步：npm test && npm run qa && npm run build\n`)
