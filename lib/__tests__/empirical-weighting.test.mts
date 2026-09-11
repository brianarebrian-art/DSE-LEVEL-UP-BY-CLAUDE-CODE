// ============================================================================
// empirical-weighting.test.mts —— 實測難度加權抽題
// ----------------------------------------------------------------------------
// 2027 目標書階段一第 2 項。呢個模組【預設關住】——
// 最重要嗰條測試係 ①：關住嗰陣，行為必須同以前逐項相同。
//
// 一個「掣關住但行為已經變咗」嘅模組，比一個開咗嘅模組更危險：
// 冇人會去查一個聲稱關住嘅嘢。
// ============================================================================
import test from 'node:test'
import assert from 'node:assert/strict'

const { weightedOrder, isEmpiricalWeightingActive, EMPIRICAL_K, MIN_OBSERVATIONS } =
  await import('../empiricalWeighting.ts')

const Q = (id: string, topic: string) => ({ id, topic })
const ids = (rows: { id: string }[]) => rows.map((r) => r.id)
/** 固定隨機序列 —— 令加權抽樣可重現。 */
const seq = (...xs: number[]) => { let i = 0; return () => xs[i++ % xs.length] }

// ── ① 預設關住，行為同以前逐項相同 ────────────────────────────────────────
test('預設 EMPIRICAL_K = 0 —— 即係完全唔生效', () => {
  assert.equal(EMPIRICAL_K, 0, '要開請經過決策，唔好靜靜哋改個預設值')
  assert.equal(isEmpiricalWeightingActive(), false)
})

test('k = 0 原樣返回 —— 唔可以打散上游嘅 unseen-first 次序', () => {
  const qs = [Q('a', 'x'), Q('b', 'y'), Q('c', 'x'), Q('d', 'z')]
  const acc = [{ topic: 'x', total: 100, wrong: 90 }, { topic: 'y', total: 100, wrong: 5 }]
  // 就算實測差異極大，k = 0 之下都唔應該郁過。
  assert.deepEqual(ids(weightedOrder(qs, acc, 0)), ['a', 'b', 'c', 'd'])
  assert.deepEqual(ids(weightedOrder(qs, acc)), ['a', 'b', 'c', 'd'], '預設參數亦然')
})

test('k = 0 返回新陣列，唔可以就咁遞返同一個 reference', () => {
  const qs = [Q('a', 'x')]
  const out = weightedOrder(qs, [], 0)
  assert.notEqual(out, qs, '呼叫端會 sort，唔可以令佢原地改到上游嘅陣列')
  assert.deepEqual(out, qs)
})

// ── ② 開咗之後，高錯率課題排前 ────────────────────────────────────────────
test('k > 0 令高錯率課題排前', () => {
  // easy 課題 5% 錯、hard 課題 95% 錯。k 夠大，hard 應該壓倒性排前。
  const qs = [Q('e1', 'easy'), Q('e2', 'easy'), Q('h1', 'hard'), Q('h2', 'hard')]
  const acc = [
    { topic: 'easy', total: 100, wrong: 5 },
    { topic: 'hard', total: 100, wrong: 95 },
  ]
  // 用同一個隨機值，令排序純由權重決定。
  const out = ids(weightedOrder(qs, acc, 4, seq(0.5)))
  assert.deepEqual(out.slice(0, 2).sort(), ['h1', 'h2'], '高錯率嗰兩條應該排頭兩位')
})

test('傾斜程度隨 k 上升', () => {
  const qs = Array.from({ length: 200 }, (_, i) => Q(`q${i}`, i % 2 === 0 ? 'easy' : 'hard'))
  const acc = [
    { topic: 'easy', total: 100, wrong: 20 },
    { topic: 'hard', total: 100, wrong: 80 },
  ]
  const hardShare = (k: number) => {
    let r = 1
    const rand = () => (r = (r * 1103515245 + 12345) % 2147483648) / 2147483648 // 決定性 PRNG
    return weightedOrder(qs, acc, k, rand).slice(0, 20).filter((q) => q.topic === 'hard').length / 20
  }
  const k1 = hardShare(1), k4 = hardShare(4)
  assert.ok(k1 > 0.5, `k=1 應該已經偏向高錯率（實得 ${k1}）`)
  assert.ok(k4 >= k1, `k=4 應該唔少過 k=1（實得 ${k4} vs ${k1}）`)
})

// ── ③ 樣本不足唔算數 ──────────────────────────────────────────────────────
test(`少過 ${MIN_OBSERVATIONS} 題實測嘅課題唔攞嚟計 —— 噪音唔可以當訊號`, () => {
  const qs = [Q('a', 'thin'), Q('b', 'thin')]
  // 只有 2 題實測、100% 錯 —— 統計上係噪音。
  const out = weightedOrder(qs, [{ topic: 'thin', total: 2, wrong: 2 }], 4)
  assert.deepEqual(ids(out), ['a', 'b'], '冇任何足夠樣本嘅課題 → 原樣返回')
})

test('污糟數據唔可以入到權重（wrong > total）', () => {
  const qs = [Q('a', 'bad'), Q('b', 'ok')]
  const out = weightedOrder(qs, [
    { topic: 'bad', total: 10, wrong: 999 }, // 同 lib/progress.ts 一樣嘅衛生閘
    { topic: 'ok', total: 20, wrong: 4 },
  ], 4, seq(0.5))
  assert.equal(out.length, 2, '唔應該掉題，只係唔採用嗰條污糟統計')
})

// ── ④ 未做過嘅課題唔可以被永遠排走 ────────────────────────────────────────
//
// 用 0 作預設錯誤率會令所有新課題排到最後 —— 即係學生永遠見唔到未做過嘅嘢，
// 而未做過嘅嘢正正就係最應該做嘅。所以用中位數。
test('未有實測嘅課題用中位錯誤率，唔會被排到最後', () => {
  const qs = [Q('new1', 'unseen'), Q('lo', 'lowErr'), Q('hi', 'highErr')]
  const acc = [
    { topic: 'lowErr', total: 50, wrong: 2 }, // 4%
    { topic: 'highErr', total: 50, wrong: 45 }, // 90%
  ]
  const out = ids(weightedOrder(qs, acc, 4, seq(0.5)))
  assert.equal(out[0], 'hi', '最高錯率排第一')
  assert.equal(out[1], 'new1', '未做過嘅企中間，唔會排到最尾')
  assert.equal(out[2], 'lo', '最低錯率排最後')
})

// ── ⑤ 唔可以掉題或者複製題 ────────────────────────────────────────────────
test('加權之後題數不變、冇重複', () => {
  const qs = Array.from({ length: 50 }, (_, i) => Q(`q${i}`, `t${i % 5}`))
  const acc = Array.from({ length: 5 }, (_, i) => ({ topic: `t${i}`, total: 20, wrong: i * 4 }))
  const out = weightedOrder(qs, acc, 3)
  assert.equal(out.length, 50)
  assert.equal(new Set(ids(out)).size, 50, '一條都唔可以少，一條都唔可以多')
})

test('空輸入唔會爆', () => {
  assert.deepEqual(weightedOrder([], [{ topic: 'x', total: 10, wrong: 5 }], 4), [])
  assert.deepEqual(ids(weightedOrder([Q('a', 'x')], [], 4)), ['a'])
})

// ── ⑥ 3:5:2 分層唔可以被繞過 ──────────────────────────────────────────────
//
// 加權刻意落喺【排序】而唔係【分層】—— buildPool 之後仍然行
// pickByDifficulty(…, sessionSize)。若日後有人把加權搬去分層之後，
// 3:5:2 就會被打破，而憲章 §7 同 lib/adaptiveOrder.ts 都建基於嗰個比例。
test('抽題仍然經過 3:5:2 分層', async () => {
  const { readFileSync } = await import('node:fs')
  const src = readFileSync('app/practice/PracticeSession.tsx', 'utf8')
  assert.match(src, /weightedOrder\(/, 'buildPool 應該有加權步驟')
  const wIdx = src.indexOf('weightedOrder(')
  const pIdx = src.indexOf('pickByDifficulty(', wIdx)
  assert.ok(pIdx > wIdx, '加權必須喺 pickByDifficulty 之前 —— 否則 3:5:2 會被打破')
})
