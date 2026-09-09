// 迴歸鎖：跨裝置同步邊界
//
// 呢個檔鎖住「邊啲 key 會離開部機」。歷史上呢條界線郁過三次，每次都有理由，
// 而每次都應該有測試跟住郁 —— 唔係嘅話，界線會靜靜哋漂移。
//
//   2026-08-26  剔走 dse_active_session ＋ dse_topic_stats（P0 止血）
//   2026-09-07  dse_topic_stats 加返（憲章 §16.E，2026-09-04 雙簽早已批准，
//               代碼一直未跟）
//   2026-09-08  dse_active_session ＋ dse_reverse_log 加入（選項 C，Yuna 裁決，
//               ⬜ 待 Brian 副署），兩者都含答案原文
//
// 三類測試分別鎖住：會傳、唔會空傳（防洗白）、同埋 null 嘅特殊意義。
import { test } from 'node:test'
import assert from 'node:assert/strict'

const store = new Map<string, string>()
;(globalThis as unknown as { window: unknown }).window = globalThis
;(globalThis as unknown as { localStorage: unknown }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
}

const { snapshotLocal } = await import('../sync.ts')
const snap = () => snapshotLocal() as unknown as Record<string, unknown>

const base = () => {
  store.clear()
  store.set('dse_progress', '[]')
}

test('逐課題統計：有累積就上傳', () => {
  base()
  store.set('dse_topic_stats', JSON.stringify({ 'chemistry::redox': { total: 8, wrong: 3 } }))
  assert.ok('dse_topic_stats' in snap(), '冇咗即係換部機雷達圖由零開始')
})

test('未完成嗰節：連答案原文一齊上傳（選項 C）', () => {
  base()
  store.set(
    'dse_active_session',
    JSON.stringify({
      current: 3,
      questionIds: ['a', 'b'],
      answers: [{ selectedZh: '學生揀嗰個', isCorrect: false }],
    }),
  )
  const s = snap()
  assert.ok('dse_active_session' in s, '冇咗即係換部機接唔返做到一半嗰份卷')
  const a = s.dse_active_session as { answers: { selectedZh: string }[] }
  assert.equal(
    a.answers[0].selectedZh,
    '學生揀嗰個',
    'selectedZh 要完整帶過去，否則續做時分數會計錯',
  )
})

test('錯因自診：上傳（選項 C）', () => {
  base()
  store.set(
    'dse_reverse_log',
    JSON.stringify([{ cause: 'A', selected: '揀錯嗰個', correct: '正解' }]),
  )
  assert.ok('dse_reverse_log' in snap(), '冇咗即係換部機錯題 DNA 由零開始')
})

test('三個 key 都係空嘅時候，一個都唔可以帶上去洗白雲端', () => {
  base()
  const s = snap()
  for (const k of ['dse_topic_stats', 'dse_reverse_log']) {
    assert.ok(
      !(k in s),
      `${k} 空嘅時候唔可以帶 —— applyLocal 用 truthy 判斷，空值會覆蓋雲端已有嘅嘢`,
    )
  }
  assert.ok(!('dse_active_session' in s), '冇 active session 嗰陣唔應該帶呢個欄位')
})

test('active session 明確係 null 嗰陣要傳 —— null 代表「已完成，其他機清走佢」', () => {
  base()
  store.set('dse_active_session', 'null')
  const s = snap()
  assert.ok('dse_active_session' in s, 'null 有意義，唔可以當成「冇值」慳走')
  assert.equal(s.dse_active_session, null)
})
