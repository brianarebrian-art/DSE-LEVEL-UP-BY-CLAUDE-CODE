import { test } from 'node:test'
import assert from 'node:assert/strict'

// 等級區間的守門測試。
//
// 呢個模組直接影響學生點理解自己嘅水平，計錯的後果唔係「數字唔靚」，
// 而係學生據一個假精確的等級去決定溫邊科。所以連數學性質都要釘死。

const mod = await import('../gradeConfidence.ts')
const { wilsonInterval, gradeRange } = mod
const cut = await import('../../data/cutoffs.ts')
const { getPracticeCutoffs } = cut

const table20 = getPracticeCutoffs(20)

test('Wilson 區間永遠落喺 [0,1]', () => {
  for (const n of [1, 3, 5, 20, 50, 200]) {
    for (let k = 0; k <= n; k++) {
      const [lo, hi] = wilsonInterval(k, n)
      assert.ok(lo >= 0 && lo <= 1, `lo 出界：k=${k} n=${n} lo=${lo}`)
      assert.ok(hi >= 0 && hi <= 1, `hi 出界：k=${k} n=${n} hi=${hi}`)
      assert.ok(lo <= hi, `lo > hi：k=${k} n=${n}`)
    }
  }
})

test('全對唔會收成零寬度 —— 呢個正正係唔用 Wald 區間嘅原因', () => {
  // Wald 區間喺 p=1 時 √(p(1-p)/n)=0，會報「100% 肯定」。Wilson 唔會。
  const [lo, hi] = wilsonInterval(20, 20)
  assert.equal(hi, 1, '全對時上界應為 1')
  assert.ok(lo < 1, '全對時下界唔應該係 1 —— 20 題全對唔代表水平無上落')
  assert.ok(lo > 0.7, `20 題全對，下界應該仲係幾高，實際 ${lo}`)
})

test('全錯同樣唔會收成零寬度', () => {
  const [lo, hi] = wilsonInterval(0, 20)
  assert.equal(lo, 0)
  assert.ok(hi > 0, '全錯時上界唔應該係 0')
})

test('樣本愈大，區間愈窄（同一答對率）', () => {
  let prev = Infinity
  for (const n of [10, 20, 50, 100, 300]) {
    const [lo, hi] = wilsonInterval(Math.round(0.7 * n), n)
    const width = hi - lo
    assert.ok(width < prev, `n=${n} 時區間冇收窄（${width} ≥ ${prev}）`)
    prev = width
  }
})

test('n=0 唔會爆，回傳完全未知', () => {
  const [lo, hi] = wilsonInterval(0, 0)
  assert.equal(lo, 0)
  assert.equal(hi, 1)
})

test('20 題答啱 14 條，區間跨過多過一個等級', () => {
  // 呢個係本功能存在嘅理由：70% 睇落好肯定係 Level 5，
  // 但 20 題嘅樣本根本撐唔起呢個結論。
  const r = gradeRange(14, 20, table20)
  assert.equal(r.n, 20)
  assert.equal(r.isSingle, false, '20 題唔應該足以鎖定單一等級')
  assert.notEqual(r.low, r.high)
  assert.ok(r.loRatio < 0.7 && r.hiRatio > 0.7, '區間應該包住觀測值 0.7')
})

test('區間下界對應嘅等級唔會好過上界', () => {
  const order = ['5**', '5*', '5', '4', '3', '2', '1', 'U']
  for (let k = 0; k <= 20; k++) {
    const r = gradeRange(k, 20, table20)
    const li = order.indexOf(r.low)
    const hi = order.indexOf(r.high)
    assert.ok(li >= hi, `k=${k}：low(${r.low}) 應該唔好過 high(${r.high})`)
  }
})

test('questionsToNarrow：單一等級時為 0，否則大過現有題數或為 null', () => {
  for (const k of [0, 5, 10, 14, 18, 20]) {
    const r = gradeRange(k, 20, table20)
    if (r.isSingle) {
      assert.equal(r.questionsToNarrow, 0, `k=${k} 已單一等級，應為 0`)
    } else if (r.questionsToNarrow !== null) {
      assert.ok(
        r.questionsToNarrow > 20,
        `k=${k}：叫學生做 ${r.questionsToNarrow} 題（少過而家嘅 20 題）冇意義`,
      )
      assert.ok(r.questionsToNarrow <= 500, '上限 500')
    }
  }
})

test('做多啲題之後，區間真係會收窄到單一等級（questionsToNarrow 唔係空口講白話）', () => {
  const r = gradeRange(14, 20, table20)
  if (r.questionsToNarrow) {
    const m = r.questionsToNarrow
    const bigger = gradeRange(Math.round(0.7 * m), m, getPracticeCutoffs(m))
    assert.equal(
      bigger.isSingle,
      true,
      `聲稱做到 ${m} 題就會收窄，實際冇 —— 呢個承諾必須兌現得到`,
    )
  }
})
