import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { verify } from 'node:crypto'
// default interop（同其他 .mts 測試一樣，見 exam-day.test.mts 檔頭）
import * as ns from '../push/vapid.ts'
const vapid = (ns as unknown as { default?: typeof ns }).default ?? ns
const { signVapidJwt, sendEmptyPush, toPublicKey, vapidFromEnv } = vapid

// ── 一對只喺測試入面用嘅金鑰 ──
// 用 node:crypto 即場生成，唔會寫入任何檔，亦唔會同生產嘅金鑰有關。
import { generateKeyPairSync } from 'node:crypto'
function makeKeys() {
  const { publicKey, privateKey } = generateKeyPairSync('ec', { namedCurve: 'prime256v1' })
  const pj = publicKey.export({ format: 'jwk' }) as { x: string; y: string }
  const sj = privateKey.export({ format: 'jwk' }) as { d: string }
  return {
    publicKey: Buffer.concat([
      Buffer.from([4]), Buffer.from(pj.x, 'base64url'), Buffer.from(pj.y, 'base64url'),
    ]).toString('base64url'),
    privateKey: Buffer.from(sj.d, 'base64url').toString('base64url'),
  }
}
const KEYS = makeKeys()
const SUB = 'mailto:test@example.com'

// ══ VAPID 簽章 ══
// 呢幾條守嘅係一堆「推送服務只會回一個 401，唔會話你知邊度錯」嘅細節。

test('JWT 有三截，header 係 ES256', () => {
  const jwt = signVapidJwt(KEYS, 'https://fcm.googleapis.com', SUB)
  const [h, p, sig] = jwt.split('.')
  assert.equal(jwt.split('.').length, 3)
  const header = JSON.parse(Buffer.from(h, 'base64url').toString())
  assert.equal(header.alg, 'ES256')
  assert.equal(header.typ, 'JWT')
  assert.ok(JSON.parse(Buffer.from(p, 'base64url').toString()).exp > Math.floor(Date.now() / 1000))
  // JOSE 要 raw r‖s（64 bytes）。Node 預設出 DER（70 左右，長度仲要浮動）——
  // 用錯咗推送服務只會回 401，除錯會好痛苦。
  assert.equal(Buffer.from(sig, 'base64url').length, 64, 'ES256 簽名一定要 64 bytes raw r‖s，唔可以係 DER')
})

test('簽名真係驗得過（唔係亂砌一串嘢出嚟）', () => {
  const jwt = signVapidJwt(KEYS, 'https://fcm.googleapis.com', SUB)
  const [h, p, sig] = jwt.split('.')
  const ok = verify('sha256', Buffer.from(`${h}.${p}`),
    { key: toPublicKey(KEYS.publicKey), dsaEncoding: 'ieee-p1363' },
    Buffer.from(sig, 'base64url'))
  assert.equal(ok, true)
})

test('aud 只可以係 origin，唔可以帶 path', async () => {
  // 推送端點嘅 URL 好長（帶住一個 token path）。整條擺落 aud 就會被拒。
  const calls: { url: string; headers: Record<string, string> }[] = []
  const real = globalThis.fetch
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    calls.push({ url, headers: init.headers as Record<string, string> })
    return new Response('', { status: 201 })
  }) as unknown as typeof fetch

  await sendEmptyPush('https://fcm.googleapis.com/fcm/send/AAAA-BBBB_cccc', KEYS, SUB)
  globalThis.fetch = real

  const auth = calls[0].headers.Authorization
  const jwt = auth.match(/t=([^,]+)/)![1]
  const aud = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString()).aud
  assert.equal(aud, 'https://fcm.googleapis.com')
})

test('推送冇 payload —— 冇 body，Content-Length 係 0', async () => {
  // 冇 payload 唔止係慳：冇得放 payload 就冇得手殘咁把考試日期
  // 或者試場放咗入去。結構上做唔到嘅洩漏好過靠自律唔做嘅洩漏。
  let init: RequestInit | undefined
  const real = globalThis.fetch
  globalThis.fetch = (async (_u: string, i: RequestInit) => { init = i; return new Response('', { status: 201 }) }) as unknown as typeof fetch
  await sendEmptyPush('https://push.example.com/x/y', KEYS, SUB)
  globalThis.fetch = real
  assert.equal(init?.body, undefined)
  assert.equal((init?.headers as Record<string, string>)['Content-Length'], '0')
  assert.ok((init?.headers as Record<string, string>).TTL)
})

for (const status of [404, 410]) {
  test(`推送回 ${status} → 標記為已死（要由資料庫刪走）`, async () => {
    const real = globalThis.fetch
    globalThis.fetch = (async () => new Response('', { status })) as unknown as typeof fetch
    const r = await sendEmptyPush('https://push.example.com/x', KEYS, SUB)
    globalThis.fetch = real
    assert.equal(r.gone, true)
    assert.equal(r.ok, false)
  })
}

test('推送回 500 唔算已死 —— 唔可以因為上游一次抽筋就刪走訂閱', async () => {
  const real = globalThis.fetch
  globalThis.fetch = (async () => new Response('', { status: 500 })) as unknown as typeof fetch
  const r = await sendEmptyPush('https://push.example.com/x', KEYS, SUB)
  globalThis.fetch = real
  assert.equal(r.gone, false)
})

test('壞金鑰要即刻掉錯，唔可以簽出一個冇人收得到嘅 JWT', () => {
  assert.throws(() => signVapidJwt({ publicKey: KEYS.publicKey, privateKey: 'c2hvcnQ' }, 'https://a.test', SUB))
  assert.throws(() => signVapidJwt({ publicKey: 'c2hvcnQ', privateKey: KEYS.privateKey }, 'https://a.test', SUB))
})

test('冇設環境變數 = 功能收埋，唔係錯誤', () => {
  const saved = [process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY, process.env.VAPID_SUBJECT]
  delete process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  delete process.env.VAPID_PRIVATE_KEY
  delete process.env.VAPID_SUBJECT
  assert.equal(vapidFromEnv(), null, '應該回 null（功能未開），唔應該掉錯 —— 一個因為冇設環境變數而 500 嘅網站，比一個冇推送嘅網站差好多')
  if (saved[0]) process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY = saved[0]
  if (saved[1]) process.env.VAPID_PRIVATE_KEY = saved[1]
  if (saved[2]) process.env.VAPID_SUBJECT = saved[2]
})

// ══ Service worker 嘅「出唔出通知」判斷 ══
// 伺服器send一個空白推送俾【所有】訂閱者。邊個真係會見到通知，
// 完全由呢個函數決定 —— 所以佢就係成個私隱設計嘅核心。
// sw.js 一載入就會叫 self.addEventListener。Node 冇 `self`，
// 所以要先擺一個最細嘅替身 —— 我哋只係想攞嗰個純函數出嚟驗，
// 唔係要模擬成個 service worker 環境。
;(globalThis as unknown as { self: unknown }).self ??= {
  addEventListener: () => {},
  registration: { showNotification: () => {} },
  clients: { matchAll: async () => [], openWindow: async () => null },
}
const require_ = createRequire(import.meta.url)
const { decideNotification } = require_('../../public/sw.js') as {
  decideNotification: (
    cfg: Record<string, unknown> | null, hour: number, today: string, tomorrow: string,
  ) => { slot: string; title: string; body: string } | null
}
const TODAY = '2027-04-22'
const TOMORROW = '2027-04-23'
const on = { night: true, morning: true, lang: 'zh' }

test('冇考試日期 → 唔出通知（訂閱咗但未填，唔可以日日彈）', () => {
  assert.equal(decideNotification({ ...on, examDate: null }, 6, TODAY, TOMORROW), null)
  assert.equal(decideNotification(null, 6, TODAY, TOMORROW), null)
})

test('考試日期唔啱 → 唔出通知', () => {
  assert.equal(decideNotification({ ...on, examDate: '2027-05-30' }, 6, TODAY, TOMORROW), null)
})

test('考試朝早 → 出「出門時間」', () => {
  const r = decideNotification({ ...on, examDate: TODAY }, 6, TODAY, TOMORROW)
  assert.equal(r?.slot, 'morning')
  assert.ok(r!.title.includes('今朝'))
})

test('前一晚 → 出「執嘢」，而且睇嘅係聽日嘅日期', () => {
  const r = decideNotification({ ...on, examDate: TOMORROW }, 22, TODAY, TOMORROW)
  assert.equal(r?.slot, 'night')
  // 前一晚嗰個唔可以攞今日去對 —— 對錯咗就會喺考試當晚先提你執嘢。
  assert.equal(decideNotification({ ...on, examDate: TODAY }, 22, TODAY, TOMORROW), null)
})

test('日頭（12–18 點）唔出通知 —— 冇對應時段', () => {
  assert.equal(decideNotification({ ...on, examDate: TODAY }, 14, TODAY, TOMORROW), null)
})

test('學生喺部機上面關咗某個時段 → 嗰個時段唔出', () => {
  assert.equal(decideNotification({ ...on, morning: false, examDate: TODAY }, 6, TODAY, TOMORROW), null)
  assert.ok(decideNotification({ ...on, night: false, examDate: TODAY }, 6, TODAY, TOMORROW))
})

test('英文設定出英文', () => {
  const r = decideNotification({ ...on, lang: 'en', examDate: TODAY }, 6, TODAY, TOMORROW)
  assert.ok(/exam/i.test(r!.title))
})

test('通知文字唔可以講「即時」—— Hobby cron 一日行一次，做唔到', () => {
  // 兌現唔到嘅承諾喺考試朝早會令學生等一個永遠唔會嚟嘅通知。
  const { TEXT } = require_('../../public/sw.js') as { TEXT: Record<string, Record<string, { title: string; body: string }>> }
  const all = JSON.stringify(TEXT)
  for (const word of ['即時', '實時', 'instant', 'real-time', 'realtime']) {
    assert.ok(!all.toLowerCase().includes(word.toLowerCase()), `通知文字唔可以出現「${word}」`)
  }
})
