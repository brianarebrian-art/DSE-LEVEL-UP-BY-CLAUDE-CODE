import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

// /community-safety（學生安全）頁面測試。
//
// ══ 分工 ══
// 「本站冇任何用戶對用戶互動」呢個【結構性不變量】由 lib/__tests__/no-interaction.test.mts
// 守住（掃 API 路由、掃 migrations、掃在線人數）。呢個檔只守【頁面本身】：
// 佢講嘅嘢有冇兌現、搵唔搵得到、有冇亂許承諾。
//
// 呢個檔喺 2026-08-21 整個重寫過。舊版通篇測試「影子溫書室點樣審核」——
// 個牆已經刪走，嗰啲測試守緊嘅嘢已經冇對象。留住一堆指向已刪檔嘅測試，
// 除咗令 CI 紅之外冇任何價值。
//
// ⚠️ 讀原始碼而唔係 import —— npm test 釘死 tsx@4.19.2，做唔到 .ts/.tsx 具名 ESM import。

const PAGE = 'app/community-safety/CommunitySafetyClient.tsx'
const SHELL = 'app/community-safety/page.tsx'

test('必須由頁尾去到，喺 sitemap，並有獨立 metadata', () => {
  assert.match(fs.readFileSync('components/Footer.tsx', 'utf8'), /href="\/community-safety"/, '頁尾冇連結')
  assert.match(fs.readFileSync('app/sitemap.ts', 'utf8'), /'\/community-safety'/, 'sitemap 冇呢版')
  const shell = fs.readFileSync(SHELL, 'utf8')
  assert.match(shell, /export const metadata/, '欠獨立 metadata')
  assert.match(shell, /title:\s*'學生安全/, 'title 必須具體')
  assert.match(shell, /description:/, '欠 description —— 家長／學校係由搜尋結果撳入嚟')
})

test('頁面必須交代「用咩接住」，唔可以淨係話刪咗', () => {
  // 一版淨係講「我哋移除咗個社群功能」嘅頁，對一個凌晨三點入嚟嘅學生嚟講
  // 係一扇閂咗嘅門。頁面必須帶佢去下一個地方。
  const src = fs.readFileSync(PAGE, 'utf8')
  assert.match(src, /href="\/capsule"/, '必須連去時間囊')
  assert.ok(fs.existsSync('app/capsule/page.tsx'), '連去嘅嘢本身要存在')
})

test('危機熱線必須喺呢版出現', () => {
  const src = fs.readFileSync(PAGE, 'utf8')
  assert.match(src, /HotlineCard/, '講緊學生安全而冇熱線，就係得個講字')
})

test('頁面唔可以承諾一個守唔到嘅回應時間', () => {
  const src = fs.readFileSync(PAGE, 'utf8')
  // ⚠️ 唔可以淨係 grep 個詞組 —— 頁面可能【本身就講緊】「冇 24 小時回應承諾」，
  // 而嗰句正正係要保留嘅嘢。所以要睇上文有冇否定詞。
  const SLA = /(24|48|72)\s*小時(內)?(回應|處理)|within\s+(24|48|72)\s*hours/g
  const promises: string[] = []
  for (const m of src.matchAll(SLA)) {
    const lead = src.slice(Math.max(0, m.index! - 12), m.index!)
    if (!/[冇唔無不]|\bno\b|\bnot\b|never/i.test(lead)) promises.push(m[0])
  }
  assert.deepEqual(
    promises,
    [],
    `出現咗【正面】回應時間承諾：${promises.join('、')}。憲章寫明創辦人係業餘模式、每週一次異步同步。`,
  )
})

test('唔可以再引用已刪除嘅影子溫書室檔案', () => {
  for (const f of [PAGE, SHELL]) {
    const src = fs.readFileSync(f, 'utf8')
    for (const gone of ['app/api/wall', 'lib/wall/', 'app/wall/']) {
      assert.ok(!src.includes(gone), `${f} 仲引用緊已刪除嘅 ${gone}`)
    }
  }
})
