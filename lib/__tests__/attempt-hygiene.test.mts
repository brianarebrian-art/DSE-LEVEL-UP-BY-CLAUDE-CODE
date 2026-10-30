// ============================================================================
// attempt-hygiene.test.mts —— 寫入端唔准收不可能嘅練習紀錄
// ----------------------------------------------------------------------------
import test from 'node:test'
import assert from 'node:assert/strict'

;(globalThis as { localStorage?: unknown }).localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
}
;(globalThis as { window?: unknown }).window = {
  __dse_progress_mem: [] as unknown[],
  dispatchEvent: () => true,
  localStorage: (globalThis as { localStorage: unknown }).localStorage,
}

const { recordAttempt, loadAttempts, clearProgress } = await import('../progress.ts')

const base = {
  subjectId: 'math', subjectName: '數學', topicFilter: null,
  grade: '4', topicResults: [], elapsed: 600, timestamp: Date.now(),
}
const rec = (score: number, total: number) => ({ ...base, score, total })
const count = () => loadAttempts().length
const reset = () => clearProgress()

test('正常紀錄照樣寫得入', () => {
  reset()
  recordAttempt(rec(8, 10) as never)
  recordAttempt(rec(0, 10) as never)
  recordAttempt(rec(10, 10) as never)
  assert.equal(count(), 3)
})

test('答啱多過總題數 —— 擋（就係嗰條 10000/100）', () => {
  reset()
  recordAttempt(rec(10000, 100) as never)
  assert.equal(count(), 0)
})

test('total ≤ 0 或者負分 —— 擋', () => {
  reset()
  recordAttempt(rec(0, 0) as never)
  recordAttempt(rec(5, -1) as never)
  recordAttempt(rec(-3, 10) as never)
  assert.equal(count(), 0)
})

test('非整數／非數值 —— 擋', () => {
  reset()
  recordAttempt(rec(NaN, 10) as never)
  recordAttempt(rec(3, Infinity) as never)
  recordAttempt(rec(2.5, 10) as never)
  assert.equal(count(), 0)
})

test('快得可疑但可能嘅唔擋 —— 唔可以令數據偏向乖學生', () => {
  reset()
  recordAttempt({ ...rec(3, 10), elapsed: 8 } as never)
  assert.equal(count(), 1, '純猜同跳答都係真實行為，擋咗就係篩走一批真學生')
})

test('擋住之後唔可以 throw —— 學生啱啱交完卷，唔應該見到錯誤', () => {
  reset()
  assert.doesNotThrow(() => recordAttempt(rec(999, 1) as never))
})
