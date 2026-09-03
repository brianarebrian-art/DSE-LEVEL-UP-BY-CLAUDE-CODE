import { test } from 'node:test'
import assert from 'node:assert/strict'
// ⚠️ 同 exam-day.test.mts / exam-day-network.test.mts 一樣要 default interop ——
// package.json 冇 `"type": "module"`，tsx 會把 `.ts` 編成 CJS，
// 具名 import 會 SyntaxError，namespace import 亦只攞到 { default }。
import * as ns from '../greeting.ts'
const g = (ns as unknown as { default?: typeof ns }).default ?? ns

// 規格 §3.2 嘅四個時段。呢度逐個【邊界】測，唔係測中間值 ——
// 中間值點寫都啱，錯只會錯喺 >= 定 > 嗰一隻字度。
test('greetingSlot：四個邊界逐個對規格 §3.2', () => {
  // 05:00–11:59 早上
  assert.equal(g.greetingSlot(4), 'night')
  assert.equal(g.greetingSlot(5), 'morning')
  assert.equal(g.greetingSlot(11), 'morning')
  // 12:00–17:59 下午
  assert.equal(g.greetingSlot(12), 'afternoon')
  assert.equal(g.greetingSlot(17), 'afternoon')
  // 18:00–21:59 晚上
  assert.equal(g.greetingSlot(18), 'evening')
  assert.equal(g.greetingSlot(21), 'evening')
  // 22:00–04:59 深夜
  assert.equal(g.greetingSlot(22), 'night')
  assert.equal(g.greetingSlot(23), 'night')
  assert.equal(g.greetingSlot(0), 'night')
})

test('greetingSlot：24 個鐘全部有歸屬，冇一個跌出四個時段', () => {
  const slots = new Set(['morning', 'afternoon', 'evening', 'night'])
  for (let h = 0; h < 24; h++) assert.ok(slots.has(g.greetingSlot(h)), `hour ${h}`)
})

test('greetingSlot：小數鐘數向下取整（11.9 仲係早上，唔可以變咗下午）', () => {
  assert.equal(g.greetingSlot(11.99), 'morning')
  assert.equal(g.greetingSlot(4.99), 'night')
})

test('isNightSlot：晚上同深夜出月亮，日間出太陽', () => {
  assert.equal(g.isNightSlot('night'), true)
  assert.equal(g.isNightSlot('evening'), true)
  assert.equal(g.isNightSlot('morning'), false)
  assert.equal(g.isNightSlot('afternoon'), false)
})
