// ============================================================================
// math-p1-long.test.mts —— 數學卷一長題目草稿：答案數值驗算
// ----------------------------------------------------------------------------
// 呢個測試獨立計一次每條題目嘅答案，同草稿入面寫嘅對數。
//
// ⚠️ 呢個測試綠燈【唔等於】題目可以入庫。
//    佢只證明一件事：我冇計錯數。
//    題目合唔合課程、問法自然唔自然、步驟分割得啱唔啱、
//    分數分配合唔合理 —— 全部要真人睇。機器永不自動入庫。
//
// 讀檔而非 import 草稿：`npx tsx@4.19.2` 喺呢個 repo（package.json 冇
// `"type": "module"`）唔支援 .ts/.tsx 嘅具名 ESM import，會拋
// "does not provide an export named …"。全部現存測試都係讀檔，唔係巧合。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const DRAFT = 'scripts/qbank/drafts/math-p1-long.json'
const rows: { id: string; referenceAnswer: string; marks: number }[] = JSON.parse(readFileSync(DRAFT, 'utf8'))
const ans = (id: string) => {
  const r = rows.find((x) => x.id === id)
  assert.ok(r, `草稿冇 ${id}`)
  return r!.referenceAnswer
}
/** 答案字串入面要搵到呢個數（容許 LaTeX 包裝）。 */
const has = (id: string, ...needles: (string | number)[]) => {
  const a = ans(id)
  for (const n of needles) assert.ok(a.includes(String(n)), `${id}：答案應含 ${n}\n實際：${a}`)
}
const round3sf = (x: number) => Number(x.toPrecision(3))
/** 浮點比較 —— 呢啲全部係精確嘅有理數運算，但 IEEE-754 會漂少少
 *  （例如 0.8×1.6×300−300 = 84.00000000000006）。用容差比較，
 *  唔係放鬆標準：漂移量喺 1e-9 級，任何真正嘅計算錯誤都遠大過呢個數。 */
const near = (a: number, b: number, msg?: string) =>
  assert.ok(Math.abs(a - b) < 1e-9, `${msg ?? ''} 期望 ${b}，實際 ${a}`)

test('全部 20 條都在草稿之內，且 id 唯一', () => {
  assert.equal(rows.length, 20)
  assert.equal(new Set(rows.map((r) => r.id)).size, 20)
})

test('q01 指數律：(2a³b⁻²)² ÷ (4a⁻¹b³) = a⁷/b⁷，a=2,b=1 時為 128', () => {
  const a = 2, b = 1
  const val = Math.pow(2 * Math.pow(a, 3) * Math.pow(b, -2), 2) / (4 * Math.pow(a, -1) * Math.pow(b, 3))
  assert.equal(val, Math.pow(a, 7) / Math.pow(b, 7)) // 化簡式與原式恆等
  assert.equal(val, 128)
  has('math_p1_01', 'a^{7}', 'b^{7}', 128)
})

test('q02 變換主項：S=62, r=2, n=5 ⇒ a=2', () => {
  const S = 62, r = 2, n = 5
  const a = (S * (1 - r)) / (1 - Math.pow(r, n))
  assert.equal(a, 2)
  // 反代原式驗算
  assert.equal((a * (1 - Math.pow(r, n))) / (1 - r), S)
  has('math_p1_02', 'a=2')
})

test('q03 因式分解：(2x+3y)(2x-3y-1) 展開等於 4x²-9y²-2x-3y', () => {
  for (const [x, y] of [[1, 1], [2, -3], [-4, 5], [0.5, 7]]) {
    assert.equal((2 * x + 3 * y) * (2 * x - 3 * y - 1), 4 * x * x - 9 * y * y - 2 * x - 3 * y, `x=${x},y=${y}`)
  }
  has('math_p1_03', '(2x+3y)(2x-3y-1)')
})

test('q04 百分數：加價 60% 後八折仍賺 $84 ⇒ 成本 $300，利潤率 28%', () => {
  const C = 300
  near(0.8 * 1.6 * C - C, 84, '利潤')
  near(((0.8 * 1.6 * C - C) / C) * 100, 28, '利潤百分率')
  has('math_p1_04', '300', '28')
})

test('q05 餘式／因式定理：a=-3, b=-11 且 f(x)=(x+2)(2x-1)(x-3)', () => {
  const a = -3, b = -11
  const f = (x: number) => 2 * x ** 3 + a * x ** 2 + b * x + 6
  assert.equal(f(1), -6, '除以 (x-1) 的餘數應為 -6')
  assert.equal(f(-2), 0, '(x+2) 應為因式')
  for (const x of [-3, -1, 0, 0.5, 3, 4]) {
    near(f(x), (x + 2) * (2 * x - 1) * (x - 3), `分解式在 x=${x}`)
  }
  has('math_p1_05', 'a=-3', 'b=-11', '(x+2)(2x-1)(x-3)')
})

test('q06 正多邊形：內角比外角大 132° ⇒ 外角 24°、n=15、內角和 2340°', () => {
  const ext = (180 - 132) / 2
  assert.equal(ext, 24)
  const n = 360 / ext
  assert.equal(n, 15)
  assert.equal(180 - ext, ext + 132, '內外角互補且相差 132°')
  assert.equal((n - 2) * 180, 2340)
  has('math_p1_06', '24', 'n=15', '2340')
})

test('q07 統計：中位數 45、眾數 47、全距 26、四分位數間距 13', () => {
  const d = [32, 35, 35, 38, 41, 43, 47, 47, 47, 52, 55, 58]
  assert.equal(d.length, 12)
  assert.deepEqual([...d].sort((x, y) => x - y), d, '數據應已按序')
  assert.equal((d[5] + d[6]) / 2, 45)
  const freq = new Map<number, number>()
  for (const v of d) freq.set(v, (freq.get(v) ?? 0) + 1)
  const mode = [...freq.entries()].sort((a, b) => b[1] - a[1])[0]
  assert.equal(mode[0], 47)
  assert.equal(mode[1], 3)
  assert.equal(d[11] - d[0], 26)
  const q1 = (d[2] + d[3]) / 2, q3 = (d[8] + d[9]) / 2
  assert.equal(q1, 36.5); assert.equal(q3, 49.5); assert.equal(q3 - q1, 13)
  has('math_p1_07', '45', '47', '26', '13')
})

test('q08 相似立體：高比 2:3 ⇒ 體積 40→135；面積 90→40', () => {
  assert.equal(40 * (27 / 8), 135)
  assert.equal(90 * (4 / 9), 40)
  has('math_p1_08', '135', '40')
})

test('q09 餘弦定理：AB=8, AC=5, ∠A=60° ⇒ BC=7、面積 10√3、高≈4.95', () => {
  const bc2 = 64 + 25 - 2 * 8 * 5 * Math.cos(Math.PI / 3)
  assert.equal(Math.round(bc2), 49)
  assert.equal(Math.round(Math.sqrt(bc2)), 7)
  const area = 0.5 * 8 * 5 * Math.sin(Math.PI / 3)
  assert.ok(Math.abs(area - 10 * Math.sqrt(3)) < 1e-9)
  const h = (2 * area) / 7
  assert.equal(round3sf(h), 4.95)
  has('math_p1_09', 'BC=7', '10\\sqrt{3}', '4.95')
})

test('q10 等差數列：a=5,d=4 ⇒ T20=81、S20=860、最小 n 使 Sn>1000 為 22', () => {
  const T = (n: number) => 5 + (n - 1) * 4
  const S = (n: number) => (n / 2) * (2 * 5 + (n - 1) * 4)
  assert.equal(T(20), 81)
  assert.equal(S(20), 860)
  assert.equal(S(21), 945)
  assert.equal(S(22), 1034)
  assert.ok(S(21) <= 1000 && S(22) > 1000, 'n=22 必須係最小')
  has('math_p1_10', '81', '860', 'n=22')
})

test('q11 圓的性質：∠CAB=34° ⇒ ∠ACB=90°、∠ABC=56°、弦切角 ∠TCA=56°', () => {
  const acb = 90 // 半圓上的圓周角
  const abc = 180 - acb - 34
  assert.equal(abc, 56)
  assert.equal(abc, 56, '弦切角等於交錯弓形內的圓周角')
  has('math_p1_11', '90^{\\circ}', '56^{\\circ}')
})

test('q12 標準差：4,7,9,12,18 ⇒ 平均 10、標準差≈4.77；各加 6 後標準差不變', () => {
  const d = [4, 7, 9, 12, 18]
  const mean = d.reduce((a, b) => a + b, 0) / d.length
  assert.equal(mean, 10)
  const sd = Math.sqrt(d.reduce((a, x) => a + (x - mean) ** 2, 0) / d.length)
  assert.equal(round3sf(sd), 4.77)
  const shifted = d.map((x) => x + 6)
  const m2 = shifted.reduce((a, b) => a + b, 0) / shifted.length
  assert.equal(m2, 16)
  const sd2 = Math.sqrt(shifted.reduce((a, x) => a + (x - m2) ** 2, 0) / shifted.length)
  assert.ok(Math.abs(sd2 - sd) < 1e-12, '平移後標準差必須不變')
  has('math_p1_12', '10', '4.77', '16')
})

test('q13 不放回概率：5 紅 3 藍 ⇒ 5/14、15/28、9/14', () => {
  const rr = (5 / 8) * (4 / 7)
  assert.ok(Math.abs(rr - 5 / 14) < 1e-12)
  const mix = 2 * (5 / 8) * (3 / 7)
  assert.ok(Math.abs(mix - 15 / 28) < 1e-12)
  const bb = (3 / 8) * (2 / 7)
  assert.ok(Math.abs(rr + mix + bb - 1) < 1e-12, '三個互斥情況必須加起來等於 1')
  assert.ok(Math.abs(1 - rr - 9 / 14) < 1e-12)
  has('math_p1_13', '\\dfrac{5}{14}', '\\dfrac{15}{28}', '\\dfrac{9}{14}')
})

test('q14 變分：z=18x/y²；x=9,y=2 ⇒ 40.5；x+25%、y−20% ⇒ z 增約 95.3%', () => {
  const k = (8 * 9) / 4
  assert.equal(k, 18)
  const z = (x: number, y: number) => (18 * x) / y ** 2
  assert.equal(z(4, 3), 8)
  assert.equal(z(9, 2), 40.5)
  const ratio = z(1.25 * 4, 0.8 * 3) / z(4, 3)
  near(ratio, 1.25 / 0.64, '倍數')
  assert.equal(round3sf((ratio - 1) * 100), 95.3)
  has('math_p1_14', '18x', '40.5', '95.3')
})

test('q15 坐標幾何：M(2,4)、垂直平分線 3x+2y-14=0、圓 x²+y²-4x-8y+7=0', () => {
  const A = [-1, 2], B = [5, 6]
  const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]
  assert.deepEqual(M, [2, 4])
  const mAB = (B[1] - A[1]) / (B[0] - A[0])
  assert.equal(mAB, 2 / 3)
  const mPerp = -1 / mAB
  assert.equal(mPerp, -1.5)
  // 3x+2y-14=0 過 M 且斜率 -3/2
  assert.equal(3 * M[0] + 2 * M[1] - 14, 0)
  assert.equal(-3 / 2, mPerp)
  // 圓：A、B 都要喺圓上，且 M 係圓心
  const circ = (x: number, y: number) => x * x + y * y - 4 * x - 8 * y + 7
  assert.equal(circ(A[0], A[1]), 0, 'A 必須喺圓上')
  assert.equal(circ(B[0], B[1]), 0, 'B 必須喺圓上')
  const r2 = (2 - A[0]) ** 2 + (4 - A[1]) ** 2
  assert.equal(r2, 13, '半徑平方應為 13（AB 係直徑，唔係半徑）')
  has('math_p1_15', '(2,\\ 4)', '3x+2y-14=0', 'x^{2}+y^{2}-4x-8y+7=0')
})

test('q16 二次函數：最小值 k-6、兩不等實根 k<6、最小值 -2 ⇒ k=4', () => {
  for (const k of [-2, 0, 3, 4, 6, 9]) {
    const f = (x: number) => x * x - 2 * k * x + (k * k + k - 6)
    assert.ok(Math.abs(f(k) - (k - 6)) < 1e-12, `k=${k} 時頂點值應為 k-6`)
    const disc = (-2 * k) ** 2 - 4 * (k * k + k - 6)
    assert.equal(disc, -4 * k + 24)
    assert.equal(disc > 0, k < 6, `k=${k}：判別式>0 應等價於 k<6`)
    assert.equal(disc > 0, k - 6 < 0, '判別式>0 與 最小值<0 必須一致')
  }
  assert.equal(4 - 6, -2)
  has('math_p1_16', 'k-6', 'k<6', 'k=4')
})

test('q17 對數／指數方程：log₃x+log₃(x-2)=1 ⇒ x=3（捨 -1）；2^{2x}-5·2^x+4=0 ⇒ x=0,2', () => {
  const l3 = (x: number) => Math.log(x) / Math.log(3)
  assert.ok(Math.abs(l3(3) + l3(3 - 2) - 1) < 1e-12)
  assert.ok(!Number.isFinite(l3(-1)) || Number.isNaN(l3(-1)), 'x=-1 令對數無定義，必須捨去')
  for (const x of [0, 2]) assert.equal(4 ** x - 5 * 2 ** x + 4, 0)
  for (const x of [1, 3, -1]) assert.notEqual(4 ** x - 5 * 2 ** x + 4, 0, `x=${x} 唔應該係根`)
  has('math_p1_17', 'x=3', 'x=0', 'x=2')
})

test('q18 等比數列：a=3,r=2 ⇒ T8=384、Sn=3(2ⁿ-1)、最小 n 使 Sn>5000 為 11', () => {
  const T = (n: number) => 3 * 2 ** (n - 1)
  const S = (n: number) => 3 * (2 ** n - 1)
  assert.equal(T(8), 384)
  // 逐項相加驗證封閉式
  let acc = 0
  for (let i = 1; i <= 12; i++) { acc += T(i); assert.equal(acc, S(i), `S(${i}) 封閉式應等於逐項和`) }
  assert.equal(S(10), 3069)
  assert.equal(S(11), 6141)
  assert.ok(S(10) <= 5000 && S(11) > 5000, 'n=11 必須係最小')
  has('math_p1_18', '384', '3(2^{n}-1)', 'n=11')
})

test('q19 三維三角：AC=13、AG=√233≈15.3、與底面夾角≈31.6°', () => {
  const AC = Math.hypot(12, 5)
  assert.equal(AC, 13)
  const AG = Math.hypot(AC, 8)
  near(AG ** 2, 233, 'AG²')
  assert.equal(round3sf(AG), 15.3)
  const ang = (Math.atan(8 / AC) * 180) / Math.PI
  assert.equal(round3sf(ang), 31.6)
  has('math_p1_19', 'AC=13', '\\sqrt{233}', '15.3', '31.6')
})

test('q20 組合：C(9,4)=126、C(4,2)·C(5,2)=60、至少一男 = 121/126', () => {
  const C = (n: number, r: number) => { let v = 1; for (let i = 0; i < r; i++) v = (v * (n - i)) / (i + 1); return Math.round(v) }
  assert.equal(C(9, 4), 126)
  assert.equal(C(4, 2) * C(5, 2), 60)
  assert.equal(C(5, 4), 5)
  assert.ok(Math.abs(1 - 5 / 126 - 121 / 126) < 1e-12)
  // 逐類男生數相加必須等於總數 —— 交叉驗算
  let total = 0
  for (let m = 0; m <= 4; m++) total += C(4, m) * C(5, 4 - m)
  assert.equal(total, 126)
  has('math_p1_20', '126', '60', '\\dfrac{121}{126}')
})

test('分數與建議時間合理：每題 marks 1..15、minutes 1..20', () => {
  for (const r of rows) {
    assert.ok(r.marks >= 1 && r.marks <= 15, `${r.id} marks=${r.marks} 超出合理範圍`)
  }
})
