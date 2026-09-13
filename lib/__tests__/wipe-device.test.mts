// ============================================================================
// wipe-device.test.mts —— PDPO 刪除權：本機半邊 ＋ DELETE /api/me
// ----------------------------------------------------------------------------
// 2026-09-13 之前，「刪除我的資料」嘅本機部分係一句 `localStorage.clear()`，
// 而介面講「本機資料亦已清空」。實測漏咗：
//   · IndexedDB `dse-exam-day`（考試日期）—— SW 照讀，聽晚照彈「聽日考試」
//   · 推送訂閱 —— push_subscriptions 用 endpoint 做 key，雲端迴圈結構上掃唔到
//   · 未登入用戶 —— 冇任何刪除路徑，介面叫佢「先登入」
//   · 已登入用戶刪完仲係登入 —— reload 後 SyncProvider 即刻 ping，雲端又開返一行
//
// 下面每條測試守一種【靜靜哋壞】嘅方式：壞咗唔會報錯、唔會令任何頁面爛，
// 學生只會以為自己嘅資料清走咗。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (...p: string[]) => readFileSync(join(ROOT, ...p), 'utf8')
const WIPE = read('lib', 'privacy', 'wipeDevice.ts')
/** 剷註釋先排次序 —— wipeDevice.ts 檔頭就寫住舊做法 `localStorage.clear()`。 */
const WIPE_CODE = WIPE.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\s\/\/ .*$/gm, '')
const ACCOUNT = read('app', 'account', 'AccountPageClient.tsx')
const ME = read('app', 'api', 'me', 'route.ts')

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(join(ROOT, dir))) {
    if (e === 'node_modules' || e === '__tests__' || e.startsWith('.')) continue
    const rel = join(dir, e)
    if (statSync(join(ROOT, rel)).isDirectory()) walk(rel, out)
    else if (/\.(ts|tsx|js|mjs)$/.test(e)) out.push(rel)
  }
  return out
}

test('① KNOWN_DBS 唔可以漏 repo 入面任何一個 IndexedDB', () => {
  // 回落名單只喺舊 Firefox（冇 indexedDB.databases()）用，但一漏就係
  // 「嗰批學生嘅考試日期永遠清唔走」而且冇聲。
  const known = [...WIPE.matchAll(/KNOWN_DBS = \[([^\]]*)\]/g)][0]?.[1] ?? ''
  const opened = new Set<string>()
  for (const f of [...walk('lib'), ...walk('components'), ...walk('app'), ...walk('public')]) {
    const src = read(f)
    if (!/indexedDB\.open\(/.test(src)) continue
    const m = src.match(/const DB\s*=\s*'([^']+)'/)
    assert.ok(m, `${relative(ROOT, join(ROOT, f))} 開 IndexedDB 但揾唔到 const DB = '…' —— 測試讀唔到佢個名`)
    opened.add(m![1])
  }
  assert.ok(opened.size >= 2, `只揾到 ${opened.size} 個 DB —— 掃描壞咗？`)
  for (const n of opened) {
    assert.ok(known.includes(`'${n}'`), `IndexedDB「${n}」唔喺 KNOWN_DBS —— 舊 Firefox 上刪除會漏咗佢`)
  }
})

test('② 本機清除要清晒四樣：推送、IndexedDB、SW＋快取、storage', () => {
  assert.match(WIPE, /unsubscribePush\(\)/, '冇退推送 —— 刪完聽晚照樣彈通知')
  assert.match(WIPE, /indexedDB\.deleteDatabase/, '冇刪 IndexedDB —— 考試日期留低')
  assert.match(WIPE, /\.unregister\(\)/, '冇剷 service worker 登記')
  assert.match(WIPE, /caches\.delete/, '冇清 Cache Storage')
  assert.match(WIPE, /localStorage\.clear\(\)/, '冇清 localStorage')
  // 次序：推送一定要喺剷 SW 之前（退訂要靠 SW 登記攞 subscription），
  // storage 一定要最尾（前面任何一步觸發寫入都會寫返入嚟）。
  const iPush = WIPE_CODE.indexOf('await unsubscribePush()')
  const iUnreg = WIPE_CODE.indexOf('.unregister()')
  const iClear = WIPE_CODE.indexOf('localStorage.clear()')
  assert.ok(iPush > 0 && iPush < iUnreg, '推送退訂排咗喺剷 SW 之後 —— 攞唔到 subscription，退唔到')
  assert.ok(iClear > iUnreg, 'localStorage.clear() 唔係最後一步')
})

test('③ DELETE /api/me 唔可以有自己嘅刪除邏輯 —— 一個實作、兩個名', () => {
  assert.match(
    ME,
    /export \{ POST as DELETE \} from '\.\.\/account\/delete\/route'/,
    '/api/me 冇 re-export 原本個 handler',
  )
  const code = ME.replace(/^\s*\/\/.*$/gm, '')
  assert.ok(
    !/\.delete\(|USER_SCOPED_TABLES|getServiceSupabase/.test(code),
    '/api/me 自己寫咗刪除邏輯 —— 兩個入口遲早會一個跟唔上 userData.ts 登記表',
  )
})

test('④ 已登入：雲端 → 本機 → 登出，次序唔可以調', () => {
  const i = ACCOUNT.indexOf('const del = async')
  const body = ACCOUNT.slice(i, ACCOUNT.indexOf('const wipeLocalOnly', i))
  const a = body.indexOf("fetch('/api/me'")
  const b = body.indexOf('wipeThisDevice()')
  const c = body.indexOf('authSignOutAndWait()')
  assert.ok(a > 0, '已登入刪除冇打 /api/me')
  assert.ok(b > a, '本機清除排咗喺雲端之前 —— SyncProvider 一 focus 就會由雲端拉返舊資料')
  assert.ok(c > b, '登出唔係最後一步 —— reload 後會即刻 ping，雲端又開返一行')
  assert.ok(!/localStorage\.clear\(\)/.test(body), '仲用緊淨係 localStorage.clear() —— 漏 IndexedDB 同推送')
})

test('⑤ 未登入都要刪得 —— 唔可以叫佢先登入', () => {
  const i = ACCOUNT.indexOf("status === 'unauthenticated' ?")
  assert.ok(i > 0, '揾唔到未登入分支')
  const branch = ACCOUNT.slice(i, i + 2500)
  assert.match(branch, /onClick=\{wipeLocalOnly\}/, '未登入分支冇清除掣 —— 佢嘅資料全部喺本機，但冇得刪')
})

test('⑥ 完成之後要完整 reload，唔可以 client 導航', () => {
  // 未關嘅 IndexedDB 連線會令 deleteDatabase 排隊；只有 reload 會關晒連線。
  assert.match(ACCOUNT, /window\.location\.replace\('\/'\)/, '完成後冇完整 reload')
  const done = ACCOUNT.slice(ACCOUNT.indexOf('{done ? ('), ACCOUNT.indexOf(") : status === 'unauthenticated'"))
  assert.ok(!/<Link[^>]*href="\/"/.test(done), '完成畫面用咗 <Link href="/"> —— client 導航，排隊嘅刪除唔會完成')
})

test('⑦ 有步驟清唔到就要講，唔可以一句「全部清走咗」蓋過去', () => {
  assert.match(ACCOUNT, /report\.failed\.length > 0/, '完成畫面冇理 failed —— 清唔到都會講清晒')
})
