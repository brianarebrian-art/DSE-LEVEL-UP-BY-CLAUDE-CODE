import { createSign, createPrivateKey, createPublicKey } from 'node:crypto'

// Web Push 嘅 VAPID 簽章 —— 【零新增套件】。
//
// ══ 點解唔用 web-push ══
// 憲章 §5 嚴禁新增套件。而呢一版根本唔需要：我哋send嘅係
// 【冇 payload 嘅推送】，冇 payload 就唔使做 RFC 8291 嗰套
// ECDH + HKDF + AES-128-GCM 加密 —— 淨係要一個 ES256 JWT。
// Node 內置 crypto 用 `dsaEncoding: 'ieee-p1363'` 直接出到 JOSE
// 要求嗰個 64 bytes raw r||s 簽名（預設係 DER，唔啱用）。
//
// ══ 冇 payload 唔止係為咗慳 ══
// 推送要經 Google／Mozilla／Apple 嘅推送伺服器。有 payload 嘅話，
// 就算加咗密，個推送服務都知道「呢部機而家收緊一個 DSE Level Up
// 嘅通知」。冇 payload 嘅話佢知道嘅完全一樣，但我哋亦都冇機會
// 手殘咁把考試日期或者試場放咗入去 —— 一個結構上做唔到嘅洩漏，
// 好過一個靠自律唔做嘅洩漏。
//
// 通知內容由 service worker 喺【學生部機上面】砌（見 public/sw.js）。

/** VAPID 金鑰對。私鑰只會喺伺服器出現，公鑰會傳去瀏覽器。 */
export interface VapidKeys {
  /** base64url，65 bytes 未壓縮 EC 點（0x04 ‖ x ‖ y） */
  publicKey: string
  /** base64url，32 bytes 私鑰純量 */
  privateKey: string
}

const b64u = (b: Buffer | Uint8Array) => Buffer.from(b).toString('base64url')

/** 由 base64url 私鑰砌返一個 node KeyObject。 */
function toPrivateKey(privateKeyB64: string, publicKeyB64: string) {
  const d = Buffer.from(privateKeyB64, 'base64url')
  const pub = Buffer.from(publicKeyB64, 'base64url')
  if (d.length !== 32) throw new Error('VAPID 私鑰長度唔啱（要 32 bytes base64url）')
  if (pub.length !== 65 || pub[0] !== 4) throw new Error('VAPID 公鑰唔係 65 bytes 未壓縮 EC 點')
  return createPrivateKey({
    key: {
      kty: 'EC',
      crv: 'P-256',
      d: d.toString('base64url'),
      x: pub.subarray(1, 33).toString('base64url'),
      y: pub.subarray(33, 65).toString('base64url'),
    },
    format: 'jwk',
  })
}

/** 由 base64url 公鑰砌返 KeyObject（測試用嚟驗簽）。 */
export function toPublicKey(publicKeyB64: string) {
  const pub = Buffer.from(publicKeyB64, 'base64url')
  return createPublicKey({
    key: {
      kty: 'EC',
      crv: 'P-256',
      x: pub.subarray(1, 33).toString('base64url'),
      y: pub.subarray(33, 65).toString('base64url'),
    },
    format: 'jwk',
  })
}

/**
 * 簽一個 VAPID JWT。
 *
 * @param audience 推送端點嘅 origin（唔可以帶 path —— 帶咗推送服務會拒收）
 * @param subject  聯絡方式，`mailto:` 或者 `https:`。推送服務出事嗰陣搵人用。
 * @param ttlSec   有效期。RFC 8292 上限 24 小時，我哋用 12 小時。
 */
export function signVapidJwt(
  keys: VapidKeys,
  audience: string,
  subject: string,
  ttlSec = 12 * 60 * 60,
): string {
  const header = b64u(Buffer.from(JSON.stringify({ typ: 'JWT', alg: 'ES256' })))
  const payload = b64u(
    Buffer.from(JSON.stringify({
      aud: audience,
      exp: Math.floor(Date.now() / 1000) + ttlSec,
      sub: subject,
    })),
  )
  const signer = createSign('sha256')
  signer.update(`${header}.${payload}`)
  signer.end()
  // ⚠️ ieee-p1363 唔可以慳：預設 DER 編碼喺 JOSE 度係無效簽名，
  // 而推送服務只會回一個 401，唔會話你知係編碼問題。
  const sig = signer.sign({ key: toPrivateKey(keys.privateKey, keys.publicKey), dsaEncoding: 'ieee-p1363' })
  return `${header}.${payload}.${b64u(sig)}`
}

export interface PushResult {
  ok: boolean
  status: number
  /** true = 呢個訂閱已經死咗（瀏覽器移除咗／過期），要由資料庫刪走 */
  gone: boolean
}

/**
 * send一個【冇內容】嘅推送，淨係叫部機醒返。
 *
 * 回 404／410 = 訂閱已經唔存在（換咗機、清咗瀏覽器資料、關咗通知）。
 * 呢兩個唔算失敗，係叫我哋清走佢 —— 唔清就會日日打去一個死咗嘅端點。
 */
export async function sendEmptyPush(
  endpoint: string,
  keys: VapidKeys,
  subject: string,
  ttlSec = 3 * 60 * 60,
): Promise<PushResult> {
  const aud = new URL(endpoint).origin
  const jwt = signVapidJwt(keys, aud, subject)
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `vapid t=${jwt}, k=${keys.publicKey}`,
      TTL: String(ttlSec),
      'Content-Length': '0',
    },
  })
  return { ok: res.ok, status: res.status, gone: res.status === 404 || res.status === 410 }
}

/**
 * 由環境變數讀金鑰。冇設就 return null —— 呢個係【正常狀態】，
 * 唔係錯誤：整個推送功能係選配，冇金鑰就成個功能靜靜哋收埋。
 * 一個因為冇設環境變數而 500 嘅網站，比一個冇推送嘅網站差好多。
 */
export function vapidFromEnv(): { keys: VapidKeys; subject: string } | null {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  const subject = process.env.VAPID_SUBJECT
  if (!publicKey || !privateKey || !subject) return null
  return { keys: { publicKey, privateKey }, subject }
}
