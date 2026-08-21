import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

// 計數機貼士卡 —— 數學驗算。
//
// ══ 呢個測試守緊咩、唔守緊咩 ══
// data/calcTips.ts 每張卡有兩層驗證：
//   ① 數學層 —— 條 program 嘅公式啱唔啱、卡上寫嘅預期輸出對唔對。← 呢個測試
//   ② 真機層 —— 嗰串按鍵喺 Casio fx-50FH II／3650P 上面真係入得到、行得通。
//                ← 呢個【只有真人攞住部機做得到】，所以 `verified` flag 永遠
//                   由人手改，機器唔會掂。
//
// 換句話講：呢個測試綠燈【唔等於】張卡可以出街。佢只保證「如果按鍵入得到，
// 出嚟嘅數係啱」。CalcTipCard 喺 production 仍然只 render verified:true 嘅卡。
//
// ══ 點解值得寫 ══
// 一條錯嘅計數機程式，比一條錯嘅題目更難察覺：學生會信部機。而卡上嘅測試向量
// （testZh）係真人核對嗰陣唯一嘅對照，如果佢本身寫錯咗，真人核完會「核對成功」
// 但實際係錯。呢度就係防呢件事。
//
// ⚠️ 讀原始碼而唔係 import —— npm test 釘死 tsx@4.19.2，做唔到 .ts 具名 ESM import。

const SRC = fs.readFileSync('data/calcTips.ts', 'utf8')

/** 卡上寫嘅測試向量必須含有呢個數 —— 兩邊唔一致就係漂移。 */
function vectorMentions(...needles: string[]) {
  for (const n of needles) {
    assert.ok(SRC.includes(n), `data/calcTips.ts 嘅測試向量搵唔到「${n}」—— 公式同卡上嘅預期輸出唔再一致`)
  }
}

test('二次方程：B²−4AC→D，(−B±√D)÷(2A)', () => {
  const disc = (a: number, b: number, c: number) => b * b - 4 * a * c
  const root = (a: number, b: number, d: number, sign: 1 | -1) => (-b + sign * Math.sqrt(d)) / (2 * a)

  const d1 = disc(1, -2, -2)
  assert.equal(d1, 12)
  assert.ok(Math.abs(root(1, -2, d1, 1) - (1 + Math.sqrt(3))) < 1e-9)
  assert.ok(Math.abs(root(1, -2, d1, -1) - (1 - Math.sqrt(3))) < 1e-9)
  // D < 0 → √D 喺實機出 Math ERROR，而嗰個【就係答案】（無實根）。
  assert.equal(disc(1, 2, 5), -16)
  assert.ok(disc(1, 2, 5) < 0)

  vectorMentions('D=12', '2.7321', '−0.7321', 'D=−16')
})

test('兩點：距離、中點、斜率', () => {
  const dist = (a: number, b: number, c: number, d: number) => Math.sqrt((c - a) ** 2 + (d - b) ** 2)
  assert.equal(dist(1, 2, 4, 6), 5)
  assert.equal((1 + 4) / 2, 2.5)
  assert.equal((2 + 6) / 2, 4)
  assert.ok(Math.abs((6 - 2) / (4 - 1) - 4 / 3) < 1e-9)

  // 豎直線：C−A = 0 → 斜率一步出 Math ERROR，唔係機器壞。
  assert.equal(dist(2, 1, 2, 5), 4)
  assert.equal(2 - 2, 0)

  vectorMentions('距離 5', '(2.5, 4)', '1.3333', '距離 4')
})

test('等差數列：T(n)=A+(N−1)D，S(n)=N(2A+(N−1)D)÷2', () => {
  const T = (a: number, d: number, n: number) => a + (n - 1) * d
  const S = (a: number, d: number, n: number) => (n * (2 * a + (n - 1) * d)) / 2
  assert.equal(T(3, 4, 10), 39)
  assert.equal(S(3, 4, 10), 210)
  assert.equal(T(20, -3, 7), 2)
  assert.equal(S(20, -3, 7), 77)

  vectorMentions('T(10)=39', 'S(10)=210', 'T(7)=2', 'S(7)=77')
})

test('nCr／nPr（內置鍵）', () => {
  const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1))
  const nCr = (n: number, r: number) => fact(n) / (fact(r) * fact(n - r))
  const nPr = (n: number, r: number) => fact(n) / fact(n - r)
  assert.equal(nCr(8, 3), 56)
  assert.equal(nPr(8, 3), 336)
  // 「至少 1 名女生」= 全部組合 − 一個女都冇（即三個都係男）
  assert.equal(nCr(6, 3) - nCr(3, 3), 19)

  vectorMentions('8C3 = 56', '8P3 = 336', '20−1 = 19')
})

test('SD 統計模式：σ（母體）同 s（樣本）唔可以撈亂', () => {
  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length
  const popSd = (xs: number[]) => {
    const m = mean(xs)
    return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / xs.length)
  }
  const sampSd = (xs: number[]) => {
    const m = mean(xs)
    return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1))
  }
  assert.equal(mean([2, 4, 6]), 4)
  assert.ok(Math.abs(popSd([2, 4, 6]) - Math.sqrt(8 / 3)) < 1e-9)
  assert.equal(sampSd([2, 4, 6]), 2) // ← 卡上兩個數都要有，因為考生最易撈亂就係呢兩個
  assert.equal(mean([1, 1, 1, 5]), 2)
  assert.ok(Math.abs(popSd([1, 1, 1, 5]) - Math.sqrt(3)) < 1e-9)

  vectorMentions('x̄ = 4', '1.6330', 's = 2', '1.7321')
})

test('機器唔可以自己批准一張卡出街', () => {
  // 呢條係紅線嘅執行機制：數學啱 ≠ 真機入得到。`verified` 只准真人改，
  // 而且改嗰陣必須同時填實名（見 data/calcTips.ts 嘅 verifiedBy）。
  const card = fs.readFileSync('components/CalcTipCard.tsx', 'utf8')
  assert.match(card, /verified/, 'CalcTipCard 必須睇 verified flag')
  assert.match(SRC, /verifiedBy\?:\s*string/, 'verified:true 必須配一個實名欄位')
  // 任何 verified:true 嘅卡都必須有 verifiedBy。
  const blocks = SRC.split(/\n  \{\n/).slice(1)
  for (const b of blocks) {
    if (/verified:\s*true/.test(b)) {
      assert.match(b, /verifiedBy:\s*'[^']+'/, '有卡標咗 verified:true 但冇填實名驗證人')
    }
  }
})
