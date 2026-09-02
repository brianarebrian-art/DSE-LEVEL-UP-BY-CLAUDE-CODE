import test from 'node:test'
import assert from 'node:assert/strict'
// ⚠️ 同 exam-day.test.mts 一樣要 default interop —— package.json 冇
// `"type": "module"`，tsx 會把 `.ts` 編成 CJS，具名 import 會 SyntaxError。
import * as ns from '../examDay/network.ts'
const net = (ns as unknown as { default?: typeof ns }).default ?? ns
const { resolvePlace, planJourney, suggestNames, STATIONS } = net

// 呢一批測試守嘅係一個【會令學生遲到】嘅數字。
// 出門時間唔似排版錯 —— 錯咗冇人即刻見到，要到考試朝早先兌現。
// 所以呢度嘅斷言比平時嚴，而且刻意唔對稱（見下面「估算校準」）。

// ── 地方名解析 ────────────────────────────────────────────────────────

test('打車站名 → 認得，而且唔會當佢係別名', () => {
  const r = resolvePlace('銅鑼灣')
  assert.equal(r?.station.id, 'CAB')
  assert.equal(r?.viaAlias, false)
})

test('打「站」字都認得', () => {
  assert.equal(resolvePlace('將軍澳站')?.station.id, 'TKO')
})

test('英文名都認得（英文介面用）', () => {
  assert.equal(resolvePlace('Causeway Bay')?.station.id, 'CAB')
  assert.equal(resolvePlace('  tseung kwan o ')?.station.id, 'TKO')
})

// 呢條係整個改版嘅起點：用戶舉「小西灣」做例子，而小西灣根本冇港鐵站。
// 一個只認車站名嘅搜尋框，喺小西灣嗰位學生手上就係一個死胡同。
test('冇車站嘅地方（小西灣）→ 對到最近嘅站，而且標返係別名', () => {
  const r = resolvePlace('小西灣')
  assert.equal(r?.station.id, 'CHW')
  assert.equal(r?.viaAlias, true, 'UI 要靠呢個旗去講「小西灣冇站，最近係柴灣」')
})

test('冇合理港鐵接駁嘅地方 → null，唔可以亂猜一個站', () => {
  // 赤柱、西貢市中心呢類地方硬砌一個「最近站」會出一個差幾十分鐘嘅
  // 車程，比搵唔到仲危險 —— 嗰陣要引導佢用巴士模式。
  assert.equal(resolvePlace('赤柱'), null)
  assert.equal(resolvePlace(''), null)
  assert.equal(resolvePlace('   '), null)
})

test('datalist 有齊車站名同別名', () => {
  const names = suggestNames()
  assert.ok(names.includes('銅鑼灣'))
  assert.ok(names.includes('小西灣'), '別名一定要出現喺建議清單，否則用戶打唔中')
  assert.ok(names.length > STATIONS.length)
})

// ── 網絡結構 ──────────────────────────────────────────────────────────

test('每個站都去得到其他任何一個站（冇孤島）', () => {
  const hub = resolvePlace('金鐘')!.station.id
  for (const s of STATIONS) {
    if (s.id === hub) continue
    assert.ok(planJourney(s.id, hub), `${s.zh} 去唔到金鐘 —— 圖砌漏咗`)
  }
})

test('同一個站 → 0 分鐘，唔會出負數或者 NaN', () => {
  const j = planJourney('CAB', 'CAB')!
  assert.equal(j.minutes, 0)
  assert.equal(j.interchanges, 0)
})

test('嚟回程時間一樣（圖係無向嘅）', () => {
  const a = planJourney('TKO', 'CAB')!
  const b = planJourney('CAB', 'TKO')!
  assert.equal(a.minutes, b.minutes)
})

test('直達就唔應該報轉車', () => {
  const j = planJourney('CHW', 'CAB')! // 柴灣 → 銅鑼灣，成程港島綫
  assert.equal(j.interchanges, 0)
  assert.equal(j.boardLine, 'ISL')
})

test('機場快綫唔喺圖入面 —— 唔可以為咗慳兩分鐘 routing 學生落去', () => {
  // 演算法唔識車費。機場快綫單程數十蚊，對一個免費平台嘅用戶嚟講
  // 係一個唔可以自動幫佢做嘅決定，所以喺數據層就剷走咗。
  const all = STATIONS.flatMap((s) => s.lines)
  assert.ok(!all.includes('AEL'))
  assert.ok(!all.includes('DRL'))
  assert.equal(resolvePlace('機場'), null)
})

test('等車時間隨轉車次數上升', () => {
  const direct = planJourney('CHW', 'CAB')!
  const twoLegs = planJourney('TKO', 'CAB')!
  assert.equal(direct.waitMinutes, 3)
  assert.ok(twoLegs.waitMinutes > direct.waitMinutes)
})

// ── 估算校準 ──────────────────────────────────────────────────────────

/**
 * 對比港鐵官方行程規劃嘅時間（2026-09-03 逐條查，約數）。
 *
 * ⚠️ 上下限刻意【唔對稱】：低過參考 5% 就 fail，但高過去容忍到 30%。
 * 估多咗 = 學生早到，估少咗 = 學生遲到 —— 兩種錯誤嘅代價差天共地。
 * 一個對稱嘅容忍度會靜靜雞放行「平均啱、但一半個案偏低」嘅改動。
 */
const REFERENCE: [string, string, number][] = [
  ['將軍澳', '銅鑼灣', 22], ['沙田', '旺角', 19], ['屯門', '中環', 50],
  ['元朗', '尖沙咀', 32], ['粉嶺', '九龍塘', 26], ['寶琳', '荃灣', 57],
  ['天水圍', '柴灣', 72], ['太古', '太子', 33], ['馬鞍山', '紅磡', 32],
  ['東涌', '九龍塘', 42], ['海怡半島', '沙田', 38], ['青衣', '觀塘', 42],
]

for (const [from, to, ref] of REFERENCE) {
  test(`車程估算 ${from} → ${to}（參考 ${ref} 分鐘）`, () => {
    const j = planJourney(resolvePlace(from)!.station.id, resolvePlace(to)!.station.id)!
    const est = j.minutes + j.waitMinutes
    assert.ok(est >= ref * 0.95, `估 ${est} 分，比實際 ${ref} 分低太多 —— 會令學生遲到`)
    assert.ok(est <= ref * 1.3, `估 ${est} 分，比實際 ${ref} 分高太多 —— 冇人會信一個叫佢五點半起身嘅 App`)
  })
}

// ── 顯示層唔可以漏代碼出街 ────────────────────────────────────────────
// 呢一版改版嘅核心就係「唔好逼人睇代碼」。但代碼可以由第二個方向溜返入嚟：
// 港鐵實時班次個 dest 係站代碼，唔過 stationLabel 就會出「往 KET」。
test('站代碼一律轉到中／英名，唔會原封不動出街', () => {
  const { stationLabel } = net
  assert.equal(stationLabel('KET'), '堅尼地城')
  assert.equal(stationLabel('KET', true), 'Kennedy Town')
  // 羅湖／落馬洲唔喺路線圖（口岸，唔會係試場），但東鐵綫真係開去嗰度，
  // 上水出發嘅學生會喺班次表見到 —— 所以顯示層要識。
  assert.equal(stationLabel('LOW'), '羅湖')
  assert.equal(stationLabel('LMC', true), 'Lok Ma Chau')
})
