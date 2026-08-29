#!/usr/bin/env node
// ============================================================================
// check-posref.mjs —— 解析唔可以用位置指選項
// ----------------------------------------------------------------------------
// 點解：選項喺每次呈現時都會洗牌（app/practice/PracticeSession.tsx:114
// prepareQuestion → shuffle(pairs)），所以「第二項」／"the second option"
// 指嘅係當次隨機排到嗰個位嘅選項，並非作者寫嗰陣心目中嗰個。
// 學生睇到嘅解析因此會指錯選項。
//
// 呢個閘【只掃草稿】，唔掃 data/questions/ —— 因為現存 *-auto.ts 仲有
// 約 290 條同類問題，要重新 promote 先清得到，而 promote 要創辦人簽名。
// 掃已入庫題庫會即刻令現有數據集 fail，違反憲章 §6。
//
//   node scripts/qbank/check-posref.mjs [檔案…]     （預設掃 drafts/ 全部）
// ============================================================================
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const DRAFTS = 'scripts/qbank/drafts'
// 「第三項因素」＝混淆變項、「第二項憑證」＝雙重認證第二重、
// 「第二項」喺數學指多項式／點積嘅項 —— 呢啲都唔係選項引用。
const ZH = /第[一二三四]項(?!因素|變[項數]|憑證|獨立)/
const EN = /\b[Tt]he (?:first|second|third|fourth) (?:option|distractor)s?\b|\boptions? [ABCD]\b/
const FIELDS = ['explanation', 'explanationEn']

const files = process.argv.slice(2).length
  ? process.argv.slice(2)
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
