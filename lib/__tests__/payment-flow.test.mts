import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

// 付款流程（Phase 1.2 ＋ 2.2）嘅設計紅線測試。
//
// 呢批 code 有個特性：出錯嘅代價唔對等，而且好多錯【唔會喺 dev 出現】。
// 價格漂移要等到學生收到卡單先發現；webhook 回錯 status code 要等到
// Stripe 重試三日先發現；冪等寫錯要等到兩個人同時買先發現。
// 所以呢度守嘅係「一睇個檔就知有冇違反」嗰種紅線。

const read = (p: string) => fs.readFileSync(p, 'utf8')

/**
 * 剝走註釋。
 *
 * ⚠️ 呢個唔係修飾 —— 唔剝就會誤判。本 repo 嘅慣例係喺註釋度寫低
 * 「點解唔用某樣嘢」，所以一段解釋「唔准用 req.json() 驗簽名」嘅註釋，
 * 本身就含住 `req.json()` 四隻字。掃原始碼會捉到自己嗰句解釋，
 * 然後告一個冇犯過嘅錯。（同 privacy-page.test.mts 同一個做法。）
 */
const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')
const code = (p: string) => stripComments(read(p))
const CHECKOUT = 'app/api/checkout/route.ts'
const WEBHOOK = 'app/api/webhooks/stripe/route.ts'
const GRANT = 'lib/payment/grant.ts'
const THANKYOU = 'app/thank-you/page.tsx'

test('建 Checkout Session 前必須對 Stripe 個價', () => {
  const src = read(CHECKOUT)
  assert.match(src, /prices\.list\(\s*\{\s*lookup_keys/, '冇由 Stripe 攞返 price')
  assert.match(
    src,
    /price\.unit_amount !== spec\.amountCents/,
    '冇對價 —— skus.ts 同 Stripe 漂移就會出現「頁面寫 HK$168、卡單扣 HK$188」，' +
      '而學生要等月結單先知',
  )
  assert.match(src, /price_mismatch/, '對唔啱冇拒絕開 session')
})

test('前端唔可以傳金額（§5.1）', () => {
  const client = read('app/confirm-payment/ConfirmPaymentClient.tsx')
  const body = /body: JSON\.stringify\(\{[^}]*\}\)/.exec(client)
  assert.ok(body, '搵唔到 checkout 請求 body')
  for (const banned of ['amount', 'price', 'unit_amount', 'cents']) {
    assert.ok(!body![0].includes(banned), `前端傳咗 ${banned} —— 價格只可以由 server 決定`)
  }
})

test('冇剔同意就唔可以開 session，而且喺 server 檢查', () => {
  const src = read(CHECKOUT)
  assert.match(src, /body\.consent !== true/, 'server 冇檢查同意 —— 前端個 disabled 屬性改得')
  assert.match(src, /consent_required/, '')
})

test('寫唔到同意紀錄就唔可以去付款（修補 2）', () => {
  const src = read(CHECKOUT)
  assert.match(src, /consent_log_failed/, '冇處理同意紀錄寫入失敗')
  // 順序：session 建完 → 寫 consent → 先 return url
  const iSession = src.indexOf('checkout.sessions.create')
  const iConsent = src.indexOf("from('consent_logs')")
  const iReturn = src.indexOf('session.url')
  assert.ok(iSession < iConsent && iConsent < iReturn, '次序錯 —— 必須寫得成同意紀錄先返 URL')
})

test('同意紀錄唔收家長電郵、唔收 IP／user-agent', () => {
  const src = code(CHECKOUT)
  for (const banned of ['parent_email', 'ip_address', 'user_agent', "headers.get('x-forwarded-for')"]) {
    assert.ok(!src.includes(banned), `checkout 收集咗 ${banned} —— 見 0013 migration consent_logs 註釋`)
  }
})

test('webhook 用原始 body 驗簽名，唔可以用 req.json()', () => {
  const src = code(WEBHOOK)
  assert.match(src, /await req\.text\(\)/, '冇攞原始 body')
  assert.match(src, /constructEvent\(/, '冇驗簽名')
  const beforeVerify = src.slice(0, src.indexOf('constructEvent'))
  assert.ok(!/req\.json\(\)/.test(beforeVerify), 'parse 過再驗簽名 —— byte sequence 變咗，驗極唔會過')
})

test('webhook 除咗簽名唔啱，一律回 200', () => {
  const src = read(WEBHOOK)
  // 400 只可以出現喺簽名／缺簽名嗰兩個位
  const badStatuses = [...src.matchAll(/status:\s*(\d{3})/g)].map((m) => m[1])
  for (const s of badStatuses) {
    assert.ok(['400', '503'].includes(s), `webhook 會回 ${s} —— Stripe 見到非 2xx 會重試三日`)
  }
  assert.match(src, /catch[\s\S]*?safeLog[\s\S]*?\}\s*\n\s*return NextResponse\.json\(\{ received: true \}\)/,
    '處理失敗冇回 200 —— 應該靠 /thank-you 輪詢補救，唔係叫 Stripe 死撼')
})

test('冇自動續費 —— webhook 唔准處理 invoice 事件', () => {
  const src = code(WEBHOOK)
  for (const banned of ['invoice.paid', 'invoice.payment_failed', 'customer.subscription']) {
    assert.ok(!src.includes(banned), `出現 ${banned} —— 憲章 §8.2 冇自動續費，根本冇 invoice`)
  }
})

test('webhook 同 /thank-you 共用同一段入賬邏輯', () => {
  for (const f of [WEBHOOK, THANKYOU]) {
    assert.match(read(f), /grantFromSession/, `${f} 冇用共用入賬 —— 兩份邏輯遲早漂移`)
  }
})

test('冪等靠 UNIQUE 撞車，唔靠先 select 再 insert', () => {
  const src = code(GRANT)
  assert.match(src, /23505/, '冇處理 unique_violation')
  // 先 select 再 insert 有 race window：兩個請求同時 select 都話冇，然後兩個都 insert。
  assert.ok(!/\.select\([\s\S]{0,200}\.insert\(/.test(src), '用咗 select-then-insert —— 有 race')
})

test('退款只改 status，唔刪紀錄（§4.3 稅務保留 7 年）', () => {
  const src = code(GRANT)
  assert.match(src, /status:\s*'refunded'/, '退款冇標記')
  assert.ok(!/\.delete\(\)/.test(src), '退款刪咗紀錄 —— 憲章 §4.3 要保留 7 年')
})

test('/thank-you 要核對 session 屬唔屬於當前登入者', () => {
  const src = read(THANKYOU)
  assert.match(
    src,
    /client_reference_id !== userId/,
    'session_id 出現喺 URL，複製得分享得 —— 唔核對就會向陌生人透露呢張單存唔存在',
  )
})

test('到期日 server-side 計，唔用 session 入面嘅時間', () => {
  const src = code(GRANT)
  assert.match(src, /computeExpiry\(sku, now\)/, '冇用 server 時間計到期')
  assert.ok(!/session\.(created|expires_at)/.test(src), '用咗 Stripe 嘅時鐘計到期')
})
