#!/usr/bin/env node
// 生成 scripts/qbank/shape-baseline.json —— 答案形狀閘嘅祖父清單。
//
// 只應該喺【收窄門檻】或者【清理舊題】之後重新生成。日常出新題唔需要跑呢個 ——
// 新題要做嘅係改長干擾項令佢過閘，唔係擴大豁免。
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
import { answerShapeMargin, SHAPE_MARGIN_LIMIT } from './_gate.mjs'

const D = 'scripts/qbank/drafts'
const DERIVED = ['.decisions.json', '.rejected.json', '.sample.json']
const OUT = 'scripts/qbank/shape-baseline.json'

export function collect() {
  const ids = []
  let scannedMc = 0
  for (const f of fs.readdirSync(D).sort()) {
    if (!f.endsWith('.json') || DERIVED.some((x) => f.endsWith(x))) continue
    let rows
    try { rows = JSON.parse(fs.readFileSync(`${D}/${f}`, 'utf8')) } catch { continue }
    if (!Array.isArray(rows)) continue
    for (const q of rows) {
      if (q?.type !== 'mc' || !Array.isArray(q.options) || q.options.length !== 4) continue
      if (!Number.isInteger(q.correctIndex)) continue
      scannedMc++
      if (answerShapeMargin(q.options, q.correctIndex) >= SHAPE_MARGIN_LIMIT) ids.push(q.id)
    }
  }
  return { ids: ids.sort(), scannedMc }
}

// 同 gen-provenance.mjs 一樣：只有直接執行先寫檔，唔好一 import 就有副作用。
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const { ids, scannedMc } = collect()
  const prev = JSON.parse(fs.readFileSync(OUT, 'utf8'))
  const out = { ...prev, limit: SHAPE_MARGIN_LIMIT, count: ids.length, scannedMc, ids,
    generatedAt: new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Hong_Kong' }).format(new Date()) }
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n')
  const delta = ids.length - (prev.count ?? 0)
  console.log(`✅ shape-baseline.json：${ids.length} 條豁免（${delta >= 0 ? '+' : ''}${delta}）`)
  if (delta > 0) console.log('⚠️  清單變長咗 —— 呢個唔應該發生，新題應該過閘而唔係加豁免。')
}
