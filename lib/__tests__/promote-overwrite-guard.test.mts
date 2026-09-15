// ============================================================================
// promote-overwrite-guard.test.mts —— promote-drafts 唔可以靜靜哋冚走另一批
// ----------------------------------------------------------------------------
// 2026-08-07：中文卷二 6 條 promote 完之後再 promote 範文長題 20 條（冇加 --out），
// 前者連同該檔原有 12 條舊題一併消失 —— 冇警告、冇備份。
// 之後嘅防線只係「記得加 --out」。2026-09-15 加咗停機保護。
//
// 本測試守三件事：
//   ① 寫檔之前有保護；② 保護比對嘅係 source 批次；③ 冇 --force 後門。
// 另外 ④ 守住「唔可以改做合併」—— 生成檔檔頭只有一組 reviewer／source／mode，
//   兩批合併會令其中一批嘅審批紀錄錯誤歸屬（抽樣批可能被講成逐題人手批）。
//
// 行為實測（真實批次，見 commit）：bafs-batch-2 唔加 --out → exit 1、bafs-reviewed.ts
// hash 不變；同批重跑 → exit 0、逐字不變。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const SRC = readFileSync(join(ROOT, 'scripts', 'qbank', 'promote-drafts.mjs'), 'utf8')
const CODE = SRC.replace(/^\s*\/\/.*$/gm, '')

test('① 寫檔之前一定有覆寫保護', () => {
  const guard = CODE.indexOf('if (existsSync(outFile))')
  const write = CODE.indexOf('writeFileSync(outFile')
  assert.ok(guard > 0, '覆寫保護唔見咗 —— 同一科第二批會靜靜哋冚走第一批')
  assert.ok(write > guard, 'writeFileSync 排咗喺保護之前')
})

test('② 保護比對 source 批次，唔同就停機', () => {
  const g = CODE.slice(CODE.indexOf('if (existsSync(outFile))'), CODE.indexOf('writeFileSync(outFile'))
  assert.match(g, /source/, '保護冇讀現有檔嘅 source')
  assert.match(g, /prevSource !== basename\(IN\)/, '保護冇同今次批次比對')
  assert.match(g, /process\.exit\(1\)/, '對唔上都冇停機')
})

test('③ 冇 --force／--overwrite 後門', () => {
  assert.ok(!/arg\('(force|overwrite|replace)'\)/.test(CODE), '加咗強制覆寫旗 —— 呢個旗就係下一個 footgun')
})

test('④ 唔可以改做「合併兩批落同一個檔」', () => {
  // 合併就要讀返舊生成檔嘅內容。現時唯一讀 outFile 嘅地方係保護本身（只為攞 source）。
  const reads = [...CODE.matchAll(/readFileSync\(outFile/g)].length
  assert.equal(reads, 1, `outFile 被讀咗 ${reads} 次 —— 多過保護嗰一次，即係有人將舊檔內容拼返入新檔`)
  // 檔頭每個模式都只有一條 source，而且係今次嘅單一批次
  const srcLines = [...SRC.matchAll(/^\/\/\s+source\s*:\s*(.+)$/gm)].map((m) => m[1].trim())
  assert.ok(srcLines.length >= 2, `檔頭 source 行得 ${srcLines.length} 條（full ＋ sampled 應各一）`)
  for (const l of srcLines) assert.equal(l, '${basename(IN)}', `檔頭 source 唔再係單一批次：${l}`)
})
