// ============================================================================
// session-tracking.test.mts —— 「今日開過 app」採集嘅邊界
// ----------------------------------------------------------------------------
// 2026-09-11 重建 user_sessions（migration 0018）。呢張表曾經喺 2026-08-20
// 由 0010 刪走，理由之一係「一個冇人用嘅寫入口係純負債」。
//
// 今次重建加返一個寫入口，所以要同時加返守住佢嘅嘢。呢批測試守嘅係
// 【採集範圍】—— 一個採集端點最容易出事嘅地方唔係佢記唔記到嘢，
// 係佢日後慢慢記多咗嘢，而冇人留意到私隱頁已經對唔上。
// ============================================================================
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const ROUTE = readFileSync('app/api/sync/session/route.ts', 'utf8')
const MIGRATION = readFileSync('supabase/migrations/0018_recreate_user_sessions.sql', 'utf8')
const PROVIDER = readFileSync('components/SyncProvider.tsx', 'utf8')
const PRIVACY = readFileSync('app/privacy/PrivacyClient.tsx', 'utf8')
const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

// ── ① 端點唔可以收客戶端任何資料 ──────────────────────────────────────────
//
// user_id 由 server session 解出，day 由 server 時鐘決定。客戶端一個欄位都
// 注入唔到 —— 所以偽造、灌數、注入呢三類問題喺設計上唔存在。
// 一旦開始讀 body／query／header，呢個保證即刻冇咗。
test('端點唔讀 request body、query 或 header', () => {
  const code = strip(ROUTE)
  for (const bad of [/\breq\.json\(/, /\brequest\.json\(/, /searchParams/, /\.headers\.get\(/, /await\s+req\b/]) {
    assert.ok(!bad.test(code),
      `端點開始讀客戶端輸入（${bad}）—— 一收資料就要處理偽造同注入，而家係設計上唔使`)
  }
  // POST 唔應該有參數 —— 有參數即係打算用佢。
  assert.match(code, /export async function POST\(\s*\)/,
    'POST 唔應該收 Request 參數')
})

test('未登入唔記錄，而且唔會嗌', () => {
  const code = strip(ROUTE)
  assert.match(code, /if \(!userId\) return new NextResponse\(null, \{ status: 204 \}\)/,
    '未登入要靜靜哋回 204 —— 回 401 會喺 console 嗌，學生見到紅色')
})

test('採集失敗唔可以影響做題', () => {
  const code = strip(ROUTE)
  assert.match(code, /catch/, '要有 catch')
  assert.ok(!/status:\s*5\d\d/.test(code), '唔可以回 5xx —— 分析失敗唔係學生嘅問題')
})

// ── ② 表 schema 唔可以長胖 ────────────────────────────────────────────────
test('schema 只有三個欄，冇識別資料、冇逐題紀錄', () => {
  const create = /CREATE TABLE IF NOT EXISTS user_sessions \(([\s\S]*?)\);/.exec(MIGRATION)
  assert.ok(create, '揾唔到 CREATE TABLE')
  const body = create![1]
  const cols = body.split('\n').map((l) => l.trim().split(/\s+/)[0]).filter((c) => /^[a-z_]+$/.test(c) && c !== 'PRIMARY')
  assert.deepEqual(cols.sort(), ['day', 'first_seen', 'user_id'],
    `欄位變咗：${cols.join(', ')}。加欄之前要先改私隱頁 —— 而家嗰頁寫住「淨係一個日期，冇其他」`)

  // 憲章 §16.E 約束 7：question_events 維持刪除。呢張表永遠唔准變成佢。
  for (const forbidden of ['question_id', 'question', 'score', 'correct', 'ip', 'user_agent', 'path', 'referrer']) {
    assert.ok(!new RegExp(`\\b${forbidden}\\b`, 'i').test(body),
      `schema 出現 ${forbidden} —— 逐題紀錄同識別資料一律唔准（§16.E 約束 7）`)
  }
})

test('anon 被顯式 revoke —— RLS 唔夠', () => {
  // Supabase 有 ALTER DEFAULT PRIVILEGES，新表自動畀齊 anon 全套 DML，
  // 所以「冇 grant」唔等於「冇權」。0016 原稿寫錯過，0017 實測捉返。
  assert.match(MIGRATION, /REVOKE ALL ON TABLE user_sessions FROM anon/i)
  assert.match(MIGRATION, /ENABLE ROW LEVEL SECURITY/i)
})

// ── ③ 一日一次 ────────────────────────────────────────────────────────────
//
// upsert 本身冪等，多打唔會多行 —— 但會白費 Edge Request，同憲章 §5
// 嘅成本死鎖直接對撞。所以本機要先擋一重。
test('前端一日只 ping 一次', () => {
  const code = strip(PROVIDER)
  assert.match(code, /SESSION_PING_KEY/, '揾唔到本機擋重複嘅 key')
  const idx = code.indexOf("fetch('/api/sync/session'")
  assert.ok(idx > 0, 'SyncProvider 冇呼叫個端點')
  const before = code.slice(Math.max(0, idx - 600), idx)
  assert.match(before, /getItem\(SESSION_PING_KEY\)/,
    '發請求之前要先檢查本機標記 —— 否則開十次 app 就打十次')
  // 標記要喺成功之後先寫：寫咗先發，失敗就等到聽日先再試。
  const after = code.slice(idx, idx + 600)
  assert.match(after, /then\([\s\S]*setItem\(SESSION_PING_KEY/,
    '標記必須喺請求成功之後先寫')
})

test('ping 失敗唔可以拋出 —— 唔可以搞亂做題', () => {
  const code = strip(PROVIDER)
  const idx = code.indexOf("fetch('/api/sync/session'")
  const seg = code.slice(idx, idx + 800)
  assert.match(seg, /\.catch\(/, '要有 catch')
})

// ── ④ 匿名訪客唔追蹤 ──────────────────────────────────────────────────────
//
// 目標書講「捕捉全量訪客軌跡」。已登入嗰半做咗；未登入嗰半【冇做】——
// 對 12–18 歲未成年人新增採集要另行裁決。呢條守住嗰條界線，
// 順帶令「幾時做咗」變成一個會紅嘅事件，而唔係悄悄溜入去。
test('冇訪客編號、冇追蹤 cookie', () => {
  const code = strip(PROVIDER) + strip(ROUTE)
  for (const bad of [/visitor_?id/i, /anonymous_?id/i, /device_?id/i, /fingerprint/i, /document\.cookie/]) {
    assert.ok(!bad.test(code),
      `揾到訪客識別（${bad}）—— 追蹤未登入未成年訪客屬新增採集，要創辦人裁決`)
  }
})

// ── ⑤ 私隱頁必須跟住講 ────────────────────────────────────────────────────
//
// 頁面上寫住「登入之後上傳嘅【只有】以下呢啲，冇其他」。加咗採集而唔改嗰版，
// 嗰句就變成一句假嘅承諾 —— 憲章 §16.D 講嘅正正係呢種。
test('私隱頁有講「開過 app 嘅日期」，同埋講明未登入唔記錄', () => {
  assert.match(PRIVACY, /開過 app 嘅日期/, '私隱頁冇披露新採集')
  assert.match(PRIVACY, /一日一行/, '私隱頁應該講明粒度')
  assert.match(PRIVACY, /未登入嘅話，我哋唔會記錄你嚟過/, '私隱頁應該講明未登入唔記錄')
  assert.match(PRIVACY, /dates you opened the app/i, '英文版亦要有')
})

// ── ⑥ 刪帳號要清走 ────────────────────────────────────────────────────────
test('user_sessions 喺刪帳號清單入面', async () => {
  const { USER_SCOPED_TABLES } = await import('../privacy/userData.ts')
  assert.ok((USER_SCOPED_TABLES as readonly string[]).includes('user_sessions'),
    'user_sessions 唔喺 USER_SCOPED_TABLES —— 刪帳號會漏低佢，' +
    '而 /privacy 講「你可以刪除自己嘅資料」就係假嘅')
})
