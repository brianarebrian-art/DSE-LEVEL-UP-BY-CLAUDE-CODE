import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

// Plus 裝置 LRU（Phase 2.3 方案 B）嘅設計紅線測試。
//
// 呢個功能最容易腐化嘅方向唔係「計錯數」，係「慢慢變返做指紋追蹤」。
// 一句「加返 user_agent 落去，準啲」聽落好合理，而冇人會記得
// 當初刻意唔加。所以呢啲紅線要有測試睇住，唔靠註釋。

const MIGRATION = 'supabase/migrations/0014_plus_devices.sql'
const sql = () => fs.readFileSync(MIGRATION, 'utf8')

test('plus_devices 表冇任何指紋欄位', () => {
  // 只掃 create table 內文，唔掃解釋點解唔用指紋嗰段註釋。
  const body = /create table[\s\S]*?\n\);/i.exec(sql())
  assert.ok(body, '搵唔到 create table —— migration 結構改咗')
  for (const banned of ['ip_address', 'user_agent', 'inet', 'screen', 'timezone', 'fingerprint']) {
    assert.ok(
      !new RegExp(`\\b${banned}\\b`, 'i').test(body![0]),
      `plus_devices 出現 ${banned} —— 呢張表刻意唔由硬件／網絡推導身分。` +
        '2026-09-04 已否決 sha256(user_agent + IP) 方案：除咗私隱，' +
        '佢仲會令學校電腦室成間房撞同一個指紋。',
    )
  }
})

test('plus_devices 同 0013 一樣 service-role only（開 RLS，唔寫 policy）', () => {
  const s = sql()
  assert.match(s, /alter table public\.plus_devices enable row level security/i, '冇開 RLS')
  assert.ok(!/create\s+policy/i.test(s), '寫咗 policy —— 呢批表一律只經 getServiceSupabase() 存取')
})

test('user_id 係 TEXT，冇 FK 去 auth.users', () => {
  const s = sql()
  assert.match(s, /user_id\s+text\s+not null/i, 'user_id 唔係 TEXT —— Auth.js Google sub 係字串，唔係 UUID')
  assert.ok(!/references\s+auth\.users/i.test(s), '本 app 冇 Supabase Auth，auth.users 唔係身份來源')
})

test('刪帳號要清走 plus_devices（同付費表唔同，佢冇稅務用途）', () => {
  const reg = fs.readFileSync('lib/privacy/userData.ts', 'utf8')
  const scoped = /export const USER_SCOPED_TABLES\s*=\s*\[([\s\S]*?)\] as const/.exec(reg)
  assert.ok(scoped![1].includes("'plus_devices'"), 'plus_devices 唔喺刪除清單 —— 刪帳號會留低裝置紀錄')
})

test('device token 唔准入 URL query', () => {
  // 出現喺伺服器日誌、referrer、瀏覽紀錄同分享出去嘅連結入面。
  const hook = fs.readFileSync('lib/payment/usePlusTier.ts', 'utf8')
  assert.match(hook, /method:\s*'POST'/, '權限核對必須用 POST 送 token')
  assert.ok(!/[?&]device=/.test(hook), 'token 入咗 URL query')
  const route = fs.readFileSync('app/api/entitlement/route.ts', 'utf8')
  assert.ok(!/searchParams[\s\S]{0,40}device/i.test(route), 'route 由 URL 讀 device token')
})

test('route 只認 UUID 格式，唔畀塞任意字串入表', () => {
  const route = fs.readFileSync('app/api/entitlement/route.ts', 'utf8')
  assert.match(route, /\{36\}|\[0-9a-f-\]/i, '冇驗證 device token 格式')
})

test('裝置檢查 fail-OPEN，entitlement 本身 fail-CLOSED', () => {
  const src = fs.readFileSync('lib/payment/entitlement.ts', 'utf8')

  // getEntitlement 嘅 catch 回 FREE；getEntitlementForDevice 嘅 catch 回 ent。
  // 呢個唔對稱係刻意嘅：查唔到「有冇畀錢」→ 當冇；查唔到「用緊邊部機」→
  // 佢已經確認畀咗錢，唔可以因為我哋個 DB 出事而剝佢權限。
  const base = /export async function getEntitlement\(\)[\s\S]*?\n\}/.exec(src)
  const dev = /export async function getEntitlementForDevice[\s\S]*?\n\}/.exec(src)
  assert.ok(base && dev, '兩個函數其中一個搵唔到 —— 結構改咗，呢個測試要跟住改')
  assert.match(base![0], /catch[\s\S]*?return FREE/, 'getEntitlement 出錯必須 fail-closed 落 free')
  assert.match(dev![0], /catch[\s\S]*?return ent/, 'getEntitlementForDevice 出錯必須 fail-open —— 佢已經畀咗錢')
})

test('讓位嘅裝置跌返 free，但保留 expiresAt（佢冇失去訂閱，只係呢部機唔計）', () => {
  const src = fs.readFileSync('lib/payment/entitlement.ts', 'utf8')
  assert.match(
    src,
    /tier:\s*'free',\s*expiresAt:\s*ent\.expiresAt/,
    '讓位時掉咗 expiresAt —— 學生會以為自己張單冇咗',
  )
})
