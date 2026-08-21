// ============================================================================
// progress-resilience.test.mts —— 壞咗嘅本機紀錄唔可以冧咗成個進度頁
// ----------------------------------------------------------------------------
// 2026-08-21：驗證儀表板嗰陣寫錯咗一筆測試資料（少咗 topicResults），
// /dashboard 即刻 crash（`a.topicResults is not iterable`）。
// 舊寫法 `parsed as AttemptRecord[]` 只驗外層係咪陣列，一筆壞就冧成版。
//
// localStorage 唔係我哋控制得到嘅地方 —— 寫到一半冇電、配額爆滿被截斷、
// 擴充功能、學生自己開 devtools 貼嘢，都會整壞。一個學生嘅練習紀錄
// 唔應該因為其中一筆爛咗就成個進度頁見唔到。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'

const KEY = 'dse_progress'

/** 極簡 localStorage 替身 —— 只為咗令 lib/progress.ts 行得到。 */
function installFakeStorage(): void {
  const store = new Map<string, string>()
  const g = globalThis as Record<string, unknown>
  g.window = globalThis
  g.localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  }
}

const good = (ts: number) => ({
  subjectId: 'math', subjectName: '數學', topicFilter: null,
  score: 7, total: 10, grade: '4',
  topicResults: [{ topic: 'quadratic_equations', correct: 7, total: 10 }],
  elapsed: 600000, timestamp: ts,
})

test('爛記錄會被隔走，好嘅照樣讀得返', async () => {
  installFakeStorage()
  const { loadAttempts } = await import('../progress.ts')
  const now = Date.now()
  localStorage.setItem(KEY, JSON.stringify([
    good(now - 2000),
    { subjectId: 'math', score: 5, total: 10, timestamp: now - 1000 }, // 少咗 topicResults ← 就係佢冧咗個頁
    null,
    'not an object',
    { ...good(now), topicResults: 'oops' }, // topicResults 唔係陣列
    good(now),
  ]))
  const out = loadAttempts()
  assert.equal(out.length, 2, '應該淨返兩筆完整記錄')
  for (const a of out) assert.ok(Array.isArray(a.topicResults), 'topicResults 一定要係陣列')
})

test('整份資料爛晒／唔係陣列時回空陣列，唔會 throw', async () => {
  installFakeStorage()
  const { loadAttempts } = await import('../progress.ts')
  for (const raw of ['{"nope":1}', 'not json at all', '[', 'null']) {
    localStorage.setItem(KEY, raw)
    assert.deepEqual(loadAttempts(), [])
  }
})
