// QR 編碼器測試。
//
// ── 呢個測試點解要有 golden 向量 ──────────────────────────────────────────
// QR 編碼冇辦法「自己驗自己」—— 用自寫嘅 decoder 去驗自寫嘅 encoder，兩邊犯同
// 一個錯就會一齊過。所以正確性係喺開發時用【外部獨立解碼器】確認：macOS Vision
// framework（`VNDetectBarcodesRequest`，即 iPhone 相機背後嗰個），對版本 1–10
// 共 20 個 payload 做 encode → PNG → decode 全部往返一致。
//
// 實際捉到嘅錯：初版格式資訊第一份副本寫成轉置（位元 0–5 沿第 8 列而唔係第 8 欄），
// 結構、時序、版本選擇全部睇落正常，但 Vision 完全解唔到。純結構斷言捉唔到呢種錯。
//
// 呢度存低嗰次已驗證嘅矩陣做 golden，令日後任何改動一旦影響輸出即刻紅。要重新
// 產生 golden，必須再行一次外部解碼驗證，唔可以照抄新輸出。

import { test } from 'node:test'
import assert from 'node:assert/strict'

const { encodeQR } = await import('../paper/qr.ts')

// 'DSE' → 版本 1，2026-08-14 經 macOS Vision 解碼確認回傳 'DSE'
const GOLDEN_DSE = [
  '111111101001001111111', '100000101010001000001', '101110100100101011101',
  '101110101111001011101', '101110100011001011101', '100000100101101000001',
  '111111101010101111111', '000000001001100000000', '101101110111101101101',
  '110111011101111000110', '100010101011000000111', '101100001011001111010',
  '010111100010100100110', '000000001011001000001', '111111101111100101000',
  '100000100100000110111', '101110100100111111001', '101110101001001111110',
  '101110100110101100000', '100000101000010100101', '111111101110010010000',
]

const render = (m: boolean[][]) => m.map((r) => r.map((v) => (v ? '1' : '0')).join(''))

test('golden 向量：輸出一個位元都唔可以變', () => {
  assert.deepEqual(render(encodeQR('DSE')), GOLDEN_DSE)
})

test('版本按 payload 長度遞增，且揀最細嗰個', () => {
  const versionOf = (s: string) => (encodeQR(s).length - 17) / 4
  assert.equal(versionOf('A'.repeat(1)), 1)
  assert.equal(versionOf('A'.repeat(14)), 1) // v1-M 上限 14 位元組
  assert.equal(versionOf('A'.repeat(15)), 2)
  assert.equal(versionOf('A'.repeat(26)), 2)
  assert.equal(versionOf('A'.repeat(27)), 3)
})

test('超出版本 10-M 容量會拋錯，唔會靜靜截斷', () => {
  // 靜靜截斷係最壞情況：印咗上紙先發現掃出嚟少咗字
  assert.throws(() => encodeQR('A'.repeat(300)), /過長/)
})

test('三個定位圖案位置同形狀正確', () => {
  const m = encodeQR('DSE')
  const n = m.length
  for (const [top, left] of [[0, 0], [0, n - 7], [n - 7, 0]]) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const ring = r === 0 || r === 6 || c === 0 || c === 6
        const core = r >= 2 && r <= 4 && c >= 2 && c <= 4
        assert.equal(m[top + r][left + c], ring || core, `定位圖案 (${top},${left}) 偏移 (${r},${c})`)
      }
    }
  }
})

test('時序圖案交替，且固定深色模組存在', () => {
  const m = encodeQR('DSE')
  const n = m.length
  for (let i = 8; i < n - 8; i++) {
    assert.equal(m[6][i], i % 2 === 0, `橫向時序 col ${i}`)
    assert.equal(m[i][6], i % 2 === 0, `縱向時序 row ${i}`)
  }
  assert.equal(m[n - 8][8], true, '固定深色模組')
})

test('矩陣為正方形且全部為布林值', () => {
  for (const s of ['A', 'A'.repeat(100), 'https://example.com/x?p=a~b~20~zzzz']) {
    const m = encodeQR(s)
    assert.equal(m.length, m[0].length)
    assert.equal((m.length - 17) % 4, 0, '邊長須為 17 + 4v')
    for (const row of m) {
      assert.equal(row.length, m.length)
      for (const v of row) assert.equal(typeof v, 'boolean')
    }
  }
})

test('深色比例合理（罰分規則四有生效）', () => {
  // 遮罩擇優其中一個目的就係令深淺接近各半。偏離太遠代表遮罩選擇壞咗。
  for (const s of ['DSE', 'A'.repeat(60), 'A'.repeat(150)]) {
    const m = encodeQR(s)
    const dark = m.flat().filter(Boolean).length
    const pct = (dark * 100) / (m.length * m.length)
    assert.ok(pct > 35 && pct < 65, `深色比例 ${pct.toFixed(1)}% 偏離過遠（payload 長度 ${s.length}）`)
  }
})
