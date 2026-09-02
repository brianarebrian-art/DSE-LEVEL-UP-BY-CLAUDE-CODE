// 考試日推送 —— 瀏覽器嗰邊。
//
// ══ 分工 ══
// 伺服器：send一個冇內容嘅推送，唔知邊個幾時考試。
// 呢度：把考試日期寫入 IndexedDB，等 service worker 自己判斷關唔關事。
//
// 點解要 IndexedDB 而唔係 localStorage：service worker 冇 localStorage。
// 考試日期本身仍然係 localStorage 嗰份為準（app/exam-day/ExamDayClient.tsx），
// 呢度只係鏡一份落 IDB 俾 SW 讀。

const DB = 'dse-exam-day'
const STORE = 'prefs'
const KEY = 'config'

export interface PushConfig {
  /** 香港日期 YYYY-MM-DD。冇就唔會出任何通知。 */
  examDate: string | null
  /** 前一晚 19:00 之後嗰個「執嘢」提示 */
  night: boolean
  /** 考試日朝早嗰個「出門時間」提示 */
  morning: boolean
  lang: 'zh' | 'en'
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

/** 寫低 SW 要用嘅設定。寫唔入唔應該搞冧個頁 —— 最多係冇通知。 */
export async function writePushConfig(cfg: PushConfig): Promise<void> {
  try {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put(cfg, KEY)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    /* 私隱模式／storage 滿：靜靜哋算數 */
  }
}

/** `datetime-local` 嘅值（本地時間）→ 香港日期 YYYY-MM-DD。 */
export function examDateOf(examAt: string): string | null {
  const t = Date.parse(examAt)
  if (!Number.isFinite(t)) return null
  return new Date(t).toLocaleDateString('en-CA', { timeZone: 'Asia/Hong_Kong' })
}

export const pushSupported = () =>
  typeof window !== 'undefined' &&
  'serviceWorker' in navigator &&
  'PushManager' in window &&
  'Notification' in window

/** base64url 公鑰 → Uint8Array（PushManager 要嘅格式）。 */
function urlB64ToBytes(b64: string): Uint8Array {
  const pad = '='.repeat((4 - (b64.length % 4)) % 4)
  const raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)))
}

/**
 * 註冊 service worker。
 *
 * ⚠️ 只可以喺【學生撳咗開推送】之後叫。開頁就註冊嘅話，等於喺一個
 * 冇要求過通知嘅人部機上面裝咗一個常駐 worker —— 就算佢乜都唔做，
 * 「未問過就裝咗嘢落人哋部機」呢件事本身唔啱。
 * 睇現有狀態要用 readRegistration()，嗰個唔會裝。
 */
export async function registerSw(): Promise<ServiceWorkerRegistration | null> {
  if (!pushSupported()) return null
  try {
    return await navigator.serviceWorker.register('/sw.js')
  } catch {
    return null
  }
}

/** 唯讀：睇下裝咗未，唔會裝。 */
async function readRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!pushSupported()) return null
  try {
    return (await navigator.serviceWorker.getRegistration('/')) ?? null
  } catch {
    return null
  }
}

export async function currentSubscription(): Promise<PushSubscription | null> {
  const reg = await readRegistration()
  if (!reg) return null
  try {
    return await reg.pushManager.getSubscription()
  } catch {
    return null
  }
}

export type SubscribeResult = 'ok' | 'denied' | 'unsupported' | 'not-configured' | 'failed'

/**
 * 開啟推送。
 *
 * ⚠️ 一定要由一個【真實嘅用戶動作】叫（例如撳掣）。瀏覽器會拒絕
 * 冇用戶手勢嘅權限請求，而且被拒一次之後，好多瀏覽器再唔會問第二次 ——
 * 即係我哋用一次過嘅方式燒咗人哋一個永久嘅選擇權。
 */
export async function subscribePush(publicKey: string | undefined): Promise<SubscribeResult> {
  if (!pushSupported()) return 'unsupported'
  // 公鑰檢查一定要喺 requestPermission 之前 —— 冇金鑰即係開唔到，
  // 而彈完權限窗又話開唔到，就等於白白燒咗學生嗰個一次過嘅選擇權。
  if (!publicKey) return 'not-configured'
  const reg = await registerSw()
  if (!reg) return 'unsupported'

  const perm = await Notification.requestPermission()
  if (perm !== 'granted') return 'denied'

  try {
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToBytes(publicKey) as BufferSource,
    })
    const j = sub.toJSON() as { endpoint?: string; keys?: { p256dh?: string; auth?: string } }
    const r = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ endpoint: j.endpoint, p256dh: j.keys?.p256dh, auth: j.keys?.auth }),
    })
    if (!r.ok) {
      // 伺服器收唔到就唔好留一個瀏覽器訂閱喺度 —— 佢永遠唔會收到嘢，
      // 而學生會以為自己已經開咗。
      await sub.unsubscribe().catch(() => {})
      return r.status === 503 ? 'not-configured' : 'failed'
    }
    return 'ok'
  } catch {
    return 'failed'
  }
}

export async function unsubscribePush(): Promise<void> {
  const sub = await currentSubscription()
  if (!sub) return
  const endpoint = sub.endpoint
  await sub.unsubscribe().catch(() => {})
  // 就算瀏覽器嗰邊退咗，都要通知伺服器刪走 —— 唔刪就會日日打去一個
  // 死咗嘅端點，而且張表會無限膨脹。
  await fetch('/api/push/subscribe', {
    method: 'DELETE',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ endpoint }),
  }).catch(() => {})
}
