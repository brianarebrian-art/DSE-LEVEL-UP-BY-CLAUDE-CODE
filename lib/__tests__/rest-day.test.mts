// ============================================================================
// rest-day.test.mts —— 休息日護盾
// ----------------------------------------------------------------------------
// 守兩類嘢，兩類都唔係「功能仲喺度」：
//
//  A. 邏輯正確性（純函數，真跑）—— 日界線同污損資料。
//     日界線一錯，學生會喺星期五凌晨 2 點見到星期五嘅休息文案，而佢覺得
//     自己仲喺星期四。站內三個功能（每日光譜、今晚唔溫得、休息日）必須
//     共用 lib/hkTime.ts 嗰條 04:00 線，唔可以各寫一套。
//
//  B. 設計紅線（掃原始碼）—— 佢唔可以變成一個鎖，亦唔可以上雲。
//     Emma/UDL 2026-07-16 就「今晚唔溫得」裁決過：❌ 真・鎖，✅ 增加摩擦。
//     一個「休息日」功能最自然嘅下一步改動就係「嗰日索性唔畀入 /practice」，
//     而嗰一步會同時傷害想溫同唔想溫嗰兩邊。測試 ④ 攔住佢。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
// 動態 import 而唔係靜態 import：restDay.ts 係 client 模組，經 tsx 轉成 CJS 之後
// Node 嘅靜態具名 import 偵測唔到佢啲 export（實測 SyntaxError），但執行時
// 個 namespace 係齊嘅。呢個係 runner 相容問題，唔係模組問題。
const { hkWeekday, WEEKDAY_LABELS } = await import('../restDay.ts')

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (...p: string[]) => readFileSync(join(ROOT, ...p), 'utf8')
/**
 * 剷走註釋先掃。呢兩個檔嘅註釋【正正】寫住唔准出現嘅字（「唔可以出『連續 N 日』」、
 * 「唔係 getDay()」），唔剷就係測試掃到自己嘅紅線說明而紅。
 * 限制：簡單正則，唔處理字串入面嘅 `//`；呢三個檔冇 URL，夠用。
 */
const code = (src: string) =>
  src.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\s\/\/ .*$/gm, '')

// 2026-09-11 係星期五。UTC 時刻 → 香港時刻 = +8。
const utc = (iso: string) => Date.parse(iso)

test('① 日界線係 04:00 HKT —— 凌晨 2 點（HKT）仲算前一日', () => {
  // 星期五 2026-09-11 HKT 02:00 = 星期四 2026-09-10 UTC 18:00
  assert.equal(hkWeekday(utc('2026-09-10T18:00:00Z')), 4, '星期五凌晨 2 點應該計星期四(4)')
  // 星期五 HKT 04:00 = 星期四 UTC 20:00 —— 啱啱過界，計星期五
  assert.equal(hkWeekday(utc('2026-09-10T20:00:00Z')), 5, '星期五 04:00 應該計星期五(5)')
  // 星期五 HKT 正午 12:00 = 星期五 UTC 04:00
  assert.equal(hkWeekday(utc('2026-09-11T04:00:00Z')), 5)
  // 星期六 HKT 03:59 = 星期五 UTC 19:59 —— 仲係星期五
  assert.equal(hkWeekday(utc('2026-09-11T19:59:00Z')), 5, '星期六 03:59 應該仲係星期五(5)')
})

test('② 唔跟裝置時區 —— 同一個 timestamp 喺任何機上都應該得出同一日', () => {
  // hkWeekday 完全唔應該讀 Date#getDay()（本地時區）。掃原始碼證明。
  const src = read('lib', 'restDay.ts')
  assert.ok(
    !/\.getDay\(\)/.test(code(src)),
    'restDay.ts 用咗 getDay()（裝置時區）—— 人喺外地或者時區設錯就會差成日',
  )
  assert.match(src, /hkDayString/, '冇用 lib/hkTime.ts 嘅日界線 —— 三個功能會各有一個「今日」')
})

test('③ 污損資料唔可以靜靜哋令功能失效', () => {
  const src = read('lib', 'restDay.ts')
  // 學生改得到 localStorage（DevTools／導入檔案）。一個 7、一個字串、一個
  // 唔係 array 嘅值入到嚟，如果照收，之後嘅 includes() 永遠唔命中而且冇聲。
  assert.match(src, /Number\.isInteger/, '冇驗過係整數')
  assert.match(src, /d >= 0 && d <= 6/, '冇 clamp 落 0–6')
  assert.match(src, /Array\.isArray/, '冇驗過係 array')
  // 七個標籤一個唔少，而且長名同短名都要有（讀屏聽「一」「二」冇意思）
  for (let d = 0; d <= 6; d++) {
    const l = WEEKDAY_LABELS[d as 0]
    assert.ok(l?.zh && l?.en && l?.zhLong && l?.enLong, `星期 ${d} 嘅標籤唔齊`)
  }
})

test('④ 唔可以變成鎖 —— 休息日一樣入得去做題', () => {
  const card = read('components', 'JustOneCard.tsx')
  const i = card.indexOf('if (resting)')
  assert.ok(i > 0, '休息日分支冇咗')
  const branch = card.slice(i, card.indexOf('return (', card.indexOf('}', card.indexOf('</div>\n    )'))) )
  assert.match(
    branch,
    /href=\{`\/practice\?subject=/,
    '休息日分支冇留返一條入 /practice 嘅路 —— 咁就係一個鎖，違反 Emma/UDL 2026-07-16 裁決',
  )
  // 亦唔可以喺 middleware／route 層攔 /practice
  const picker = read('components', 'RestDayPicker.tsx')
  for (const [name, src] of [['RestDayPicker', picker], ['JustOneCard', card]] as const) {
    assert.ok(!/router\.(push|replace)\('\/relax/.test(src), `${name} 喺休息日強制跳轉 —— 嗰個係鎖`)
  }
})

test('⑤ 唔可以出 streak／指責式文案（憲章 §7 ＋ §8）', () => {
  // JustOneCard 只掃【休息日分支】：原有分支嘅英文寫住「no score, no streak」——
  // 否定句，合法。掃成個檔就會將一句「冇 streak」當成 streak 攔。
  const card = code(read('components', 'JustOneCard.tsx'))
  const restBranch = card.slice(card.indexOf('if (resting)'), card.indexOf('return (', card.indexOf('if (resting)') + 30))
  assert.ok(restBranch.length > 200, '揾唔到休息日分支')
  const all = code(read('components', 'RestDayPicker.tsx')) + restBranch
  for (const bad of ['連續', 'streak', '打卡', '破戒', '已鎖定', 'Locked']) {
    assert.ok(!all.includes(bad), `見到「${bad}」—— 休息日唔可以帶任何計數或者責備`)
  }
})

test('⑥ 個 key 唔可以上雲（憲章 §16.E）', () => {
  assert.ok(
    !read('lib', 'sync.ts').includes('dse_rest_days'),
    'dse_rest_days 出現咗喺 lib/sync.ts —— 上雲白名單加 key 要創辦人書面批准',
  )
})

test('⑦ 一日都冇揀 = 清走個 key，唔留一個空 array', () => {
  // 一個永遠存在嘅 `[]` 會令將來「佢有冇用過呢個功能」分唔清楚，
  // 亦令 StoredDataInspector 列出一個實際上冇用嘅 key。
  assert.match(read('lib', 'restDay.ts'), /removeItem\(KEY\)/, '冇揀嗰陣冇 removeItem')
})
