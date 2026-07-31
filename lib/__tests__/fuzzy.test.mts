// 錯字容忍搜尋的行為測試。
// 重點不是「分數等於幾多」，而是【該搵到的搵到、唔該搵到的唔好出】——
// 門檻校準若日後改動，這裡會即時報錯。

import { test } from 'node:test'
import assert from 'node:assert/strict'

const { similarity, normalise, fuzzyFilter, FUZZY_THRESHOLD } = await import('../fuzzy.ts')

const hit = (q: string, t: string) => similarity(q, t) >= FUZZY_THRESHOLD

test('normalise 統一大小寫、全形與標點', () => {
  assert.equal(normalise('Ｑｕａｄｒａｔｉｃ　方程！'), 'quadratic方程')
  assert.equal(normalise('魚我所欲也，熊掌亦我所欲也。'), '魚我所欲也熊掌亦我所欲也')
  assert.equal(normalise('  M1  '), 'm1')
})

test('完全正確的查詢一定命中', () => {
  assert.ok(hit('二次方程', '二次方程'))
  assert.ok(hit('二次方程', '二次方程與判別式'))
  assert.ok(hit('quadratic', 'Quadratic Equations'))
})

test('打錯一個字仍然命中（讀寫障礙學生的主要場景）', () => {
  // 「魚我所欲也」打錯尾字
  assert.ok(hit('魚我所欲野', '魚我所欲也'))
  // 打錯中間字
  assert.ok(hit('魚我索欲也', '魚我所欲也'))
  // 英文漏打一個字母
  assert.ok(hit('quadratc', 'Quadratic Equations'))
  // 英文打多一個字母
  assert.ok(hit('quadraatic', 'Quadratic Equations'))
})

test('只打關鍵字（非連續）也命中', () => {
  assert.ok(hit('魚熊掌', '魚我所欲也，熊掌亦我所欲也'))
  assert.ok(hit('三角函數', '三角函數與恆等式'))
})

test('術語近似詞命中正確條目', () => {
  // 「共用品」是正確譯法；學生可能打成「公共品」
  assert.ok(hit('公共品', '共用品'))
  assert.ok(hit('共用品', '共用品（Public Good）'))
})

test('完全無關的查詢不會命中', () => {
  assert.ok(!hit('體育', '二次方程'))
  assert.ok(!hit('photosynthesis', 'Quadratic Equations'))
  assert.ok(!hit('zzzzzz', '魚我所欲也'))
})

test('單字查詢不會命中所有長文本', () => {
  // 單一常見字不應把整個題庫拉出來
  assert.ok(!hit('也', '魚我所欲也，熊掌亦我所欲也，二者不可得兼'))
})

test('空查詢時 fuzzyFilter 原樣回傳', () => {
  const items = [{ zh: '數學' }, { zh: '物理' }]
  assert.deepEqual(fuzzyFilter(items, '', (i) => [i.zh]), items)
  assert.deepEqual(fuzzyFilter(items, '   ', (i) => [i.zh]), items)
})

test('fuzzyFilter 依相關度排序，較貼近者在前', () => {
  const items = [
    { id: 'a', zh: '三角函數與恆等式' },
    { id: 'b', zh: '二次方程' },
    { id: 'c', zh: '三角函數' },
  ]
  const out = fuzzyFilter(items, '三角函數', (i) => [i.zh])
  assert.equal(out[0].id, 'c', '完全相同者應排第一')
  assert.ok(out.some((x) => x.id === 'a'), '相關者亦應保留')
  assert.ok(!out.some((x) => x.id === 'b'), '無關者應剔除')
})

test('多欄位比對：中英文任一命中即可', () => {
  const items = [{ zh: '二次方程', en: 'Quadratic Equations' }]
  assert.equal(fuzzyFilter(items, 'quadratc', (i) => [i.zh, i.en]).length, 1)
  assert.equal(fuzzyFilter(items, '二次方程', (i) => [i.zh, i.en]).length, 1)
})

test('undefined／null 欄位不會令比對爆錯', () => {
  const items = [{ zh: '數學', en: undefined }]
  assert.doesNotThrow(() => fuzzyFilter(items, 'math', (i) => [i.zh, i.en]))
})
