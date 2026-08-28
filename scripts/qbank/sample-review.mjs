// ============================================================================
// sample-review.mjs —— 抽樣覆核：機器閘跑全部，真人全讀當中 N 條
// ----------------------------------------------------------------------------
// 創辦人 2026-08-27 決定，取代「逐題人手批」。
//
// 點解要改：2,936 條新題若逐題真讀，約需 144 小時。實測首批 40 條時，
// 審核時間短到讀唔晒解析 —— 即係「逐題批」呢個紀錄同實情已經對唔上。
// 與其保留一個做唔到嘅規矩，不如寫低一個做得到而且誠實嘅規矩。
//
// 呢個腳本【唔會】令機器批准題目。佢只做三件事：
//   ① 由 N 條入面抽出 k 條做人手全讀，抽法可重跑、由種子決定
//   ② 產生只含嗰 k 條嘅審批表
//   ③ 寫低一份 decisions 骨架，明確分開「真人讀過」同「只過機器閘」
//
// ⚠️ 抽樣抓得到嘅係【整批寫得差】，抓唔到【孤立一條答案掉轉】。
//    40 條入面 1 條錯（2.5%），抽 10 條有約 23% 機會抽中。
//    40 條入面 8 條錯（20%），抽 10 條有約 89% 機會抽中。
//    所以規則係：抽中嗰批一旦有一條被駁回，【整批退回】，唔係淨係踢走嗰一條。
//
// 抽樣由種子決定，種子寫入 decisions —— 任何人都可以重跑同一條指令，
// 驗證嗰 k 條係抽出嚟嘅，唔係揀出嚟嘅。作者揀唔到自己有信心嗰批。
//
// 用法：
//   node scripts/qbank/sample-review.mjs --in <drafts.json> --subject <id> [--k 10] [--seed <字串>]
// ============================================================================

import { readFileSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { basename } from 'node:path'

const arg = (n, d = null) => { const i = process.argv.indexOf(`--${n}`); return i > -1 ? process.argv[i + 1] : d }
const IN = arg('in'), SUBJECT = arg('subject')
if (!IN || !SUBJECT) {
  console.error('usage: node scripts/qbank/sample-review.mjs --in <drafts.json> --subject <id> [--k 10] [--seed <字串>]')
  process.exit(2)
}
const rows = JSON.parse(readFileSync(IN, 'utf8'))
const K = Number(arg('k', Math.max(8, Math.ceil(rows.length * 0.25))))
// 預設種子帶住檔名同題數 —— 同一份草稿永遠抽同一批，換咗內容就換一批。
const SEED = arg('seed', `${basename(IN)}:${rows.length}`)

// 決定性洗牌：由種子推出一串 hash，用嚟排序。可重跑、可驗證。
function keyed(id) {
  return createHash('sha256').update(`${SEED}::${id}`).digest('hex')
}

// 分層抽樣 —— 按難度攤開，唔好成批集中喺易題。
const byDiff = { basic: [], intermediate: [], hard: [] }
for (const r of rows) (byDiff[r.difficulty] ?? byDiff.intermediate).push(r)
const picked = []
for (const [d, list] of Object.entries(byDiff)) {
  if (!list.length) continue
  const want = Math.max(1, Math.round(K * list.length / rows.length))
  picked.push(...[...list].sort((a, b) => keyed(a.id) < keyed(b.id) ? -1 : 1).slice(0, want))
}
// 若四捨五入令總數同 K 有出入，按同一條 hash 次序補足／削減。
const all = [...rows].sort((a, b) => keyed(a.id) < keyed(b.id) ? -1 : 1)
const chosen = new Set(picked.map((r) => r.id))
for (const r of all) { if (chosen.size >= K) break; chosen.add(r.id) }
while (chosen.size > K) chosen.delete([...chosen].pop())

const sampleIds = rows.filter((r) => chosen.has(r.id)).map((r) => r.id)
const stem = basename(IN).replace(/\.json$/, '')
const sampleFile = IN.replace(/\.json$/, '.sample.json')
writeFileSync(sampleFile, JSON.stringify(rows.filter((r) => chosen.has(r.id)), null, 1) + '\n')

const decisions = {}
for (const r of rows) decisions[r.id] = chosen.has(r.id) ? 'pending' : 'machine-admitted'
const doc = {
  _meta: {
    source: basename(IN), subject: SUBJECT,
    mode: 'sampled',
    reviewer: '',            // ← 留白，由真人填
    reviewedAt: '',
    sample: { size: sampleIds.length, of: rows.length, seed: SEED, ids: sampleIds },
    note: '抽樣覆核：sample.ids 係真人全讀過嘅；其餘只過咗機器閘（格式／術語／重複），機器唔檢查答案啱唔啱。抽中嗰批任何一條被駁回 = 整批退回重檢。',
  },
  decisions,
}
writeFileSync(IN.replace(/\.json$/, '.decisions.json'), JSON.stringify(doc, null, 2) + '\n')

const d = (x) => rows.filter((r) => chosen.has(r.id) && r.difficulty === x).length
console.log(`
📐 抽樣覆核 —— ${stem}  ·  ${SUBJECT}
   全批 ${rows.length} 條，抽出 ${sampleIds.length} 條做真人全讀（易 ${d('basic')} / 中 ${d('intermediate')} / 難 ${d('hard')}）
   種子：${SEED}   ← 寫入 decisions，任何人可重跑驗證抽樣

   下一步：
     node scripts/qbank/review-drafts.mjs --in ${sampleFile} --subject ${SUBJECT}
     → 開審批表，讀晒嗰 ${sampleIds.length} 條，填名匯出
     → 將匯出嘅 reviewer / reviewedAt / 決定併入 ${basename(IN).replace(/\.json$/, '.decisions.json')}

   ⚠️ 抽中嗰批任何一條被駁回，整批退回重檢 —— 唔好淨係踢走嗰一條。
`)
