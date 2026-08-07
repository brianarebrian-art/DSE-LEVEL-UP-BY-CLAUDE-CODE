// 題庫兩條讀取路徑必須一致。
//
// 背景（2026-08-07 實際踩過）：題庫有兩個入口 ——
//   • `load.ts`   惰性載入，【app 真正送畀學生嗰條路】
//   • `index.ts`  eager barrel，【所有 QA 工具同稽核統計讀嗰條路】
// 兩邊各自列自己嘅組成檔案。`english-reviewed` 同 `bafs-reviewed` 一直只喺
// load.ts，從來未接入 barrel，結果 12 條已審核題目照樣送咗畀學生，但對
// topic-coverage.mjs 同任何全量稽核完全隱形 —— 一份機器全量統計報告因此
// 少報咗 12 題而毫無警示。
//
// 呢個檔就係要令下次漏註冊直接紅測試，而唔係等半年後有人數漏先發現。

import { test } from 'node:test'
import assert from 'node:assert/strict'

type Q = { id: string; type?: string }

const { getSubjectQuestions } = await import('../index.ts')
const { loadSubjectQuestions } = await import('../load.ts')
const { subjects } = await import('../../subjects.ts')

test('每一科：load.ts 同 index.ts 出同一批題目 id', async () => {
  const mismatches: string[] = []

  for (const s of subjects) {
    const viaLoader = await loadSubjectQuestions(s.id)
    const viaBarrel = getSubjectQuestions(s.id)

    const L = new Set(viaLoader.map((q) => q.id))
    const B = new Set(viaBarrel.map((q) => q.id))
    const onlyLoader = [...L].filter((x) => !B.has(x))
    const onlyBarrel = [...B].filter((x) => !L.has(x))

    if (onlyLoader.length || onlyBarrel.length) {
      mismatches.push(
        `${s.id}: loader ${L.size} / barrel ${B.size}` +
          (onlyLoader.length ? `｜只喺 loader（學生見到但稽核見唔到）: ${onlyLoader.slice(0, 5).join(', ')}` : '') +
          (onlyBarrel.length ? `｜只喺 barrel（稽核見到但學生見唔到）: ${onlyBarrel.slice(0, 5).join(', ')}` : ''),
      )
    }
  }

  assert.deepEqual(
    mismatches,
    [],
    `\n題庫兩條路徑唔一致 —— 通常係新 bank 檔只加咗入 load.ts 或者只加咗入 index.ts：\n  ${mismatches.join('\n  ')}\n`,
  )
})

test('總題數兩邊一致（稽核數字唔會少報）', async () => {
  let loaderTotal = 0
  let barrelTotal = 0
  for (const s of subjects) {
    loaderTotal += (await loadSubjectQuestions(s.id)).length
    barrelTotal += getSubjectQuestions(s.id).length
  }
  assert.equal(barrelTotal, loaderTotal, `barrel ${barrelTotal} ≠ loader ${loaderTotal}`)
  assert.ok(loaderTotal > 5000, `題庫總數應該過 5,000，實際 ${loaderTotal}`)
})

test('全題庫題目 id 唯一（跨科亦唔可以撞）', async () => {
  const seen = new Map<string, string>()
  const dups: string[] = []
  for (const s of subjects) {
    for (const q of await loadSubjectQuestions(s.id)) {
      const prev = seen.get(q.id)
      if (prev) dups.push(`${q.id}（${prev} ↔ ${s.id}）`)
      else seen.set(q.id, s.id)
    }
  }
  assert.deepEqual(dups, [], `重複題目 id：${dups.slice(0, 10).join(', ')}`)
})

test('每一科都有題目 —— 任何一科變成 0 都係註冊出事', async () => {
  const empty: string[] = []
  for (const s of subjects) {
    if ((await loadSubjectQuestions(s.id)).length === 0) empty.push(s.id)
  }
  assert.deepEqual(empty, [], `冇題目嘅科目：${empty.join(', ')}`)
})
