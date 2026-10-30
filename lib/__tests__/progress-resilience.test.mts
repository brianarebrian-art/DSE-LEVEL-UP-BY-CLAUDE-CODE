// ============================================================================
// progress-resilience.test.mts —— 壞咗嘅本機紀錄唔可以冧咗成個進度頁
// ----------------------------------------------------------------------------
// C1：進度改為 in-memory；replaceAttempts 仍然要隔走爛記錄。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'

function installFakeWindow(): void {
  const g = globalThis as Record<string, unknown>
  g.window = globalThis
  g.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  }
}

const good = (ts: number) => ({
  subjectId: 'math', subjectName: '數學', topicFilter: null,
  score: 7, total: 10, grade: '4',
  topicResults: [{ topic: 'quadratic_equations', correct: 7, total: 10 }],
  elapsed: 600000, timestamp: ts,
})

test('爛記錄會被隔走，好嘅照樣讀得返', async () => {
  installFakeWindow()
  const { loadAttempts, replaceAttempts, clearProgress } = await import('../progress.ts')
  clearProgress()
  const now = Date.now()
  replaceAttempts([
    good(now - 2000),
    { subjectId: 'math', score: 5, total: 10, timestamp: now - 1000 } as never, // 少咗 topicResults
    null as never,
    'not an object' as never,
    { ...good(now), topicResults: 'oops' } as never,
    good(now),
  ])
  const out = loadAttempts()
  assert.equal(out.length, 2, '應該淨返兩筆完整記錄')
  for (const a of out) assert.ok(Array.isArray(a.topicResults), 'topicResults 一定要係陣列')
})

test('唔係陣列／空資料時回空陣列，唔會 throw', async () => {
  installFakeWindow()
  const { loadAttempts, replaceAttempts, clearProgress } = await import('../progress.ts')
  clearProgress()
  replaceAttempts(null as never)
  assert.deepEqual(loadAttempts(), [])
  replaceAttempts([] )
  assert.deepEqual(loadAttempts(), [])
})
