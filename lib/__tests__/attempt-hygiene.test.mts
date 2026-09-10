// ============================================================================
// attempt-hygiene.test.mts —— 寫入端唔准收不可能嘅練習紀錄
// ----------------------------------------------------------------------------
// 2026-09-10 稽核 Supabase 揾到一條 score=10000 / total=100 / elapsed=4
//（4 秒做完 100 題）。淨係嗰一條，就令全站正確率由 88.5% 變成 257.8%、
// math 科變成 1748%。
//
// 讀取端過濾唔等於唔入：髒數據照樣寫本機、照樣同步上雲、照樣散去每一部
// 裝置，而每一個新寫嘅分析腳本都要自己記得再過濾一次。漏一次就得一次錯數。
// ============================================================================
import test from 'node:test'
import assert from 'node:assert/strict'

const store = new Map<string, string>()
;(globalThis as { localStorage?: unknown }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
}
;(globalThis as { window?: unknown }).window = globalThis

const { recordAttempt, loadAttempts } = await import('../progress.ts')

const base = {
  subjectId: 'math', subjectName: '數學', topicFilter: null,
  grade: '4', topicResults: [], elapsed: 600, timestamp: Date.now(),
}
const rec = (score: number, total: number) => ({ ...base, score, total })
const count = () => loadAttempts().length

test('正常紀錄照樣寫得入', () => {
  store.clear()
  recordAttempt(rec(8, 10) as never)
  recordAttempt(rec(0, 10) as never) // 全錯係完全合理嘅
  recordAttempt(rec(10, 10) as never) // 全對亦然
  assert.equal(count(), 3)
})

test('答啱多過總題數 —— 擋（就係嗰條 10000/100）', () => {
  store.clear()
  recordAttempt(rec(10000, 100) as never)
  assert.equal(count(), 0)
})

test('total ≤ 0 或者負分 —— 擋', () => {
  store.clear()
  recordAttempt(rec(0, 0) as never)
  recordAttempt(rec(5, -1) as never)
  recordAttempt(rec(-3, 10) as never)
  assert.equal(count(), 0)
})

test('非整數／非數值 —— 擋', () => {
  store.clear()
  recordAttempt(rec(NaN, 10) as never)
  recordAttempt(rec(3, Infinity) as never)
  recordAttempt(rec(2.5, 10) as never)
  assert.equal(count(), 0)
})

// ⚠️ 閘刻意保守：只擋數學上不可能嘅，唔擋睇落可疑嘅。
// 擋得太狠會令數據偏向「乖學生」，而嗰個偏差冇人察覺得到 ——
// 比一條離群值更難處理。
test('快得可疑但可能嘅唔擋 —— 唔可以令數據偏向乖學生', () => {
  store.clear()
  recordAttempt({ ...rec(3, 10), elapsed: 8 } as never) // 8 秒做 10 題：純猜，完全可能
  assert.equal(count(), 1, '純猜同跳答都係真實行為，擋咗就係篩走一批真學生')
})

test('擋住之後唔可以 throw —— 學生啱啱交完卷，唔應該見到錯誤', () => {
  store.clear()
  assert.doesNotThrow(() => recordAttempt(rec(999, 1) as never))
})
