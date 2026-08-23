// ============================================================================
// mastery.test.mts —— 等級預測 v3 驗收測試（規格書 §七）
// ----------------------------------------------------------------------------
// 規格書列出八個測試。此處實作七個：
//   測試 7（分佈吻合）做唔到 —— 佢要求輸出分佈同考評局 2025 年各級累積百分率
//   相差 ≤ 2 個百分點，但嗰批數據（dse-2025-level-distribution.json）目前
//   唔喺 repo 入面。冇真值就冇得對，寫一個「通過」嘅測試等於自欺。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const {
  predictMastery, corrected, sampleCap, halfWidth, sessionIsValid, GUESS_RATE, levelLabel,
} = await import('../mastery.ts')

type Tiers = Parameters<typeof predictMastery>[0]['tiers']
const tiers = (e: [number, number], m: [number, number], h: [number, number]): Tiers => ({
  easy: { correct: e[0], total: e[1] },
  medium: { correct: m[0], total: m[1] },
  hard: { correct: h[0], total: h[1] },
})

// 以真答對率 p 生成一組作答（期望值，非隨機）—— 測試要可重現。
const at = (p: number, n: number): [number, number] => [Math.round(p * n), n]

test('猜測校正：純亂按（25%）校正後歸零', () => {
  assert.equal(corrected(25, 100), 0)
  assert.equal(corrected(10, 100), 0, '低於猜中率一律截於 0，唔可以出負數')
  assert.ok(Math.abs(corrected(100, 100) - 1) < 1e-9)
  assert.ok(Math.abs(corrected(50, 100) - (0.5 - GUESS_RATE) / 0.75) < 1e-9)
})

test('測試 1｜全揀第一個選項（≈25% 命中）—— 零個 session 產出 Level ≥ 3', () => {
  // 四選一之下「全 A」嘅命中率就係 25%。題數由細到大都試。
  for (const n of [30, 60, 120, 200, 400]) {
    const per = Math.floor(n / 3)
    const r = predictMastery({ tiers: tiers(at(0.25, per), at(0.25, per), at(0.25, n - 2 * per)), effectiveTotal: n })
    assert.ok(r.level === null || r.level < 3, `n=${n} 竟然出到 ${r.level}`)
  }
})

test('測試 2｜純隨機 1,000 節，輸出等級唔會超過 Level 2', () => {
  // 用固定種子嘅線性同餘產生器 —— 隨機測試都要可重現。
  let s = 20260823
  const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648
  const draw = (n: number): [number, number] => {
    let c = 0
    for (let i = 0; i < n; i++) if (rnd() < 0.25) c++
    return [c, n]
  }
  const levels: number[] = []
  for (let i = 0; i < 1000; i++) {
    const r = predictMastery({ tiers: tiers(draw(40), draw(40), draw(40)), effectiveTotal: 120 })
    levels.push(r.level ?? 0)
  }
  levels.sort((a, b) => a - b)
  const p95 = levels[Math.floor(levels.length * 0.95)]
  assert.ok(p95 <= 2, `第 95 百分位係 ${p95}，應該 ≤ 2`)
  assert.ok(Math.max(...levels) <= 2, `最高出到 ${Math.max(...levels)}`)
})

test('測試 3｜全部題目撳得極快 —— 整節標記無效', () => {
  assert.equal(sessionIsValid(20, 20), false, '每題 1 秒')
  assert.equal(sessionIsValid(20, 39), false, '每題不足 2 秒')
  assert.equal(sessionIsValid(20, 60), true, '每題 3 秒，剛好過閘')
  assert.equal(sessionIsValid(0, 100), false)
  assert.equal(sessionIsValid(20, Number.NaN), false)
})

test('測試 4｜真答對率 0.75，n ≥ 60 時落喺 Level 4 ± 1', () => {
  for (const n of [60, 120, 240]) {
    const per = Math.floor(n / 3)
    const r = predictMastery({ tiers: tiers(at(0.85, per), at(0.75, per), at(0.6, n - 2 * per)), effectiveTotal: n })
    assert.ok(r.level !== null, `n=${n} 應該出到等級`)
    assert.ok(Math.abs((r.level as number) - 4) <= 1, `n=${n} 出咗 ${r.level}`)
  }
})

test('測試 5｜多做一節之後，等級唔會大幅跳動', () => {
  const a = predictMastery({ tiers: tiers(at(0.85, 40), at(0.75, 40), at(0.6, 40)), effectiveTotal: 120 })
  const b = predictMastery({ tiers: tiers(at(0.85, 47), at(0.75, 47), at(0.6, 46)), effectiveTotal: 140 })
  assert.ok(a.level !== null && b.level !== null)
  assert.ok(Math.abs((a.level as number) - (b.level as number)) < 0.5, `由 ${a.level} 跳到 ${b.level}`)
})

test('測試 8｜SEN 中立 —— 輸入型別根本冇 SEN 欄位', () => {
  const src = readFileSync(new URL('../mastery.ts', import.meta.url), 'utf8')
  const code = src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
  for (const banned of ['sen', 'Sen', 'SEN', 'dyslex', 'adhd', 'accommodation']) {
    assert.ok(!code.includes(banned), `算法唔應該提及 ${banned}`)
  }
  // 同一組作答，唔論呼叫端有冇任何額外設定，輸出必須逐位元相同。
  const t = tiers(at(0.85, 40), at(0.75, 40), at(0.6, 40))
  const x = predictMastery({ tiers: t, effectiveTotal: 120 })
  const y = predictMastery({ tiers: t, effectiveTotal: 120 })
  assert.deepEqual(x, y)
})

test('樣本量上限鎖：題數未夠就封頂，30 題以下唔出等級', () => {
  assert.equal(sampleCap(29), null)
  assert.equal(sampleCap(30), 3)
  assert.equal(sampleCap(59), 3)
  assert.equal(sampleCap(60), 4)
  assert.equal(sampleCap(119), 4)
  assert.equal(sampleCap(120), 5)
  assert.equal(sampleCap(199), 5)
  assert.equal(sampleCap(200), 5.75)
})

test('一個完全識做嘅學生，喺 199 題之前都攞唔到 5*（上限鎖較保守）', () => {
  const perfect = (n: number) => {
    const per = Math.floor(n / 3)
    return predictMastery({ tiers: tiers(at(1, per), at(1, per), at(1, n - 2 * per)), effectiveTotal: n })
  }
  assert.equal(perfect(160).level, 5, '門檻表准 5*，但上限鎖封頂 5 —— 以保守者為準')
  assert.equal(perfect(200).level, 5.75)
})

test('資料未夠：回報仲差幾多題，而唔係出一個假等級', () => {
  const r = predictMastery({ tiers: tiers(at(0.9, 8), at(0.9, 6), [0, 0]), effectiveTotal: 14 })
  assert.equal(r.level, null)
  assert.equal(r.reason, 'too_few')
  assert.equal(r.questionsShort, 16)
})

test('過唔到 Level 1 門檻時唔輸出等級 —— 唔會出「Level 0」', () => {
  const r = predictMastery({ tiers: tiers(at(0.3, 40), at(0.28, 40), at(0.26, 40)), effectiveTotal: 120 })
  assert.equal(r.level, null)
  assert.ok(r.reason === 'below_floor' || r.reason === 'tier_gap')
  assert.ok(!JSON.stringify(r).includes('"level":0'))
})

test('Phase A：區間強制至少一級闊，永不輸出單一數字', () => {
  for (const n of [30, 120, 500, 5000]) {
    assert.ok(halfWidth(n) >= 0.5, `n=${n} 半寬 ${halfWidth(n)} 細過 0.5`)
  }
  const r = predictMastery({ tiers: tiers(at(0.85, 80), at(0.75, 80), at(0.6, 80)), effectiveTotal: 240 })
  assert.ok(r.low !== null && r.high !== null && r.low !== r.high, '必須係區間')
})

test('k 目前一律 1.00 —— 冇擬合數據就唔准填逐科係數', () => {
  const src = readFileSync(new URL('../mastery.ts', import.meta.url), 'utf8')
  const code = src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
  assert.ok(!/k_?[Ss]ubject|SUBJECT_K|kBySubject/.test(code), '見到逐科 k 表 —— 但擬合數據未入 repo')
  const t = tiers(at(0.85, 40), at(0.75, 40), at(0.6, 40))
  assert.deepEqual(
    predictMastery({ tiers: t, effectiveTotal: 120 }),
    predictMastery({ tiers: t, effectiveTotal: 120, k: 1 }),
    '預設值必須等同 k = 1.00',
  )
})

test('等級標籤：5.5 → 5*，5.75 → 5**', () => {
  assert.equal(levelLabel(5.5), '5*')
  assert.equal(levelLabel(5.75), '5**')
  assert.equal(levelLabel(4), '4')
})
