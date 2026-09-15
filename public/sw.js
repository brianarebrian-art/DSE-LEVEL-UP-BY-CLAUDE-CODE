/* 考試日管家 —— service worker。
 *
 * ══ 呢個檔存在嘅原因 ══
 * 伺服器send嘅推送【冇任何內容】，亦都唔知邊個幾時考試。
 * 所以「今日關唔關我事」同「出乜文字」兩件事都喺呢度做 ——
 * 即係喺學生自己部機上面，讀部機自己嘅 IndexedDB。
 *
 * 唔關事就靜靜哋唔出通知。伺服器永遠唔知發生過乜。
 *
 * ══ 2026-09-13：加咗離線層（下面「離線」一節）══
 * 原本呢度寫住「故意冇 fetch handler」，理由係快取會令學生食住舊版 ——
 * 考試朝早出返一版舊天氣就係最壞嘅情況。呢個顧慮【完全成立】，所以離線層
 * 唔係「加個快取」，而係按住嗰個顧慮設計：
 *
 *   ① 全部 network-first。有網一定行網絡，快取只喺網絡【真係失敗】先用。
 *      即係有網嘅學生【結構上】唔可能由呢層攞到舊嘢 —— 唔係靠記得 bump 版本。
 *      刻意冇 timeout：慢網唔等於冇網，一個 4 秒 timeout 會令長期慢網嘅
 *      基層學生永遠食快取，正正變返原本要避免嗰件事。
 *   ② /api/* 同跨域（Supabase、Google）一律唔攔。天氣、同步、題庫版本
 *      全部照舊直出。題目資料離線本來就靠 lib/questionCloud.ts 嘅 IndexedDB。
 *   ③ 要 `?offline=1` 先生效（lib/pwa/swUrl.ts 決定）。冇呢個參數，
 *      fetch handler 一行都唔行，activate 仲會刪晒離線快取 —— 呢個就係回滾。
 *
 * docs/top20-features-ledger.md #03 記低嘅三個前提（獨立立項、分階段 rollout、
 * 回滾方案）喺呢度逐樣對應：本 commit 獨立做；生產預設關、由
 * NEXT_PUBLIC_SW_OFFLINE 開；回滾 = 設返 0。
 */

const DB = 'dse-exam-day'
const STORE = 'prefs'
const KEY = 'config'

/** 開 IndexedDB。SW 度冇 localStorage，所以偏好要放 IDB 先讀得到。 */
function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function readConfig() {
  return openDb()
    .then(
      (db) =>
        new Promise((resolve) => {
          const tx = db.transaction(STORE, 'readonly')
          const req = tx.objectStore(STORE).get(KEY)
          req.onsuccess = () => resolve(req.result || null)
          req.onerror = () => resolve(null)
        }),
    )
    .catch(() => null)
}

/** 香港日期（YYYY-MM-DD）。部機時區可能唔係香港，所以明寫。 */
function hkDate(offsetDays) {
  const d = new Date(Date.now() + (offsetDays || 0) * 86400000)
  return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Hong_Kong' })
}

/** 香港而家幾點鐘。 */
function hkHour() {
  return Number(
    new Date().toLocaleString('en-GB', {
      timeZone: 'Asia/Hong_Kong',
      hour: '2-digit',
      hour12: false,
    }),
  )
}

const TEXT = {
  night: {
    zh: { title: '聽日考試 —— 執嘢喇', body: '准考證、身分證、文具、計數機。撳入嚟睇聽朝天氣同幾點出門。' },
    en: { title: 'Exam tomorrow — pack now', body: 'Admission form, ID, stationery, calculator. Tap for tomorrow’s weather and departure time.' },
  },
  morning: {
    zh: { title: '今朝考試 —— 睇下幾點出門', body: '天氣同車務已經更新。撳入嚟睇你今朝嘅出門時間。' },
    en: { title: 'Exam this morning', body: 'Weather and trains updated. Tap for your departure time.' },
  },
}

/**
 * 出唔出通知，同出乜 —— 【純函數】，方便測試。
 *
 * 呢個判斷就係成個私隱設計嘅核心：伺服器send一個空白推送俾所有人，
 * 邊個真係會見到通知，完全喺呢度決定。所以佢有測試鎖住
 * （lib/__tests__/push-sw-decision.test.mts）—— 一個「順手改成日日都出」
 * 嘅修改要即刻紅。
 *
 * @param cfg        部機上面嘅設定（IndexedDB）
 * @param hour       香港而家幾點（0–23）
 * @param todayHk    香港今日 YYYY-MM-DD
 * @param tomorrowHk 香港聽日 YYYY-MM-DD
 * @returns null = 唔出通知
 */
function decideNotification(cfg, hour, todayHk, tomorrowHk) {
  // 冇設定 = 學生訂閱咗但未填考試時間。唔出通知 ——
  // 一個日日彈但幫唔到手嘅通知，只會令人索性關咗成個功能。
  if (!cfg || !cfg.examDate) return null

  const slot = hour >= 19 ? 'night' : hour < 12 ? 'morning' : null
  if (!slot) return null
  if (cfg[slot] === false) return null // 學生喺部機上面關咗呢個時段

  // 夜晚嗰個講聽日，朝早嗰個講今日。對唔上就唔關事。
  const target = slot === 'night' ? tomorrowHk : todayHk
  if (cfg.examDate !== target) return null

  const t = TEXT[slot][cfg.lang === 'en' ? 'en' : 'zh']
  return { slot, title: t.title, body: t.body }
}

self.addEventListener('push', (event) => {
  event.waitUntil(
    readConfig().then((cfg) => {
      const t = decideNotification(cfg, hkHour(), hkDate(0), hkDate(1))
      if (!t) return
      const slot = t.slot
      return self.registration.showNotification(t.title, {
        body: t.body,
        // 冇 icon／badge：repo 入面得 app/favicon.ico，冇 192px PNG。
        // 指住一個唔存在嘅檔唔會報錯，佢會靜靜哋用返瀏覽器預設 ——
        // 即係一個「睇落做咗嘢，其實冇」嘅寫法。有咗真圖先加。
        tag: `exam-day-${slot}`, // 同一時段唔會疊幾個通知出嚟
        data: { url: '/exam-day' },
      })
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/exam-day'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      // 已經開咗就 focus 返，唔好開多一個 tab。
      for (const c of list) {
        if (c.url.includes('/exam-day') && 'focus' in c) return c.focus()
      }
      return self.clients.openWindow(url)
    }),
  )
})

// ════════════════════════════════════════════════════════════════════════
// 離線（2026-09-13）—— 見檔頭。練習頁斷網 reload 唔會變瀏覽器「冇網絡」頁。
// ════════════════════════════════════════════════════════════════════════

/** 由登記 URL 讀開關。測試環境冇 self.location，當關。 */
const OFFLINE_ON = (() => {
  try {
    return new URL(self.location.href).searchParams.get('offline') === '1'
  } catch {
    return false
  }
})()

const CACHE_PREFIX = 'dse-offline-'
// 改呢個版本號 = 下次 activate 刪晒舊快取。network-first 之下平時唔使郁佢；
// 留住係畀「快取入面有樣嘢壞咗」嗰種緊急情況。
const CACHE = `${CACHE_PREFIX}v1`
// 上限：每次 deploy 嘅 chunk hash 都唔同，冇上限嘅話會一路累積。
const MAX_ENTRIES = 400

/**
 * 【純函數】呢個請求要唔要經離線層。方便測試 —— 攔錯一個 /api 請求，
 * 同步就會喺斷網時靜靜哋食咗一個舊回應。
 */
function shouldHandle(req, origin) {
  if (!req || req.method !== 'GET') return false
  let u
  try {
    u = new URL(req.url)
  } catch {
    return false
  }
  if (u.origin !== origin) return false // Supabase、Google —— 唔攔
  if (u.pathname.startsWith('/api/')) return false // 動態資料永遠唔快取
  if (u.pathname.startsWith('/_next/webpack-hmr')) return false
  if (u.pathname === '/sw.js') return false
  // 分段請求（影片、音訊）回 206，Cache API 收唔到
  if (req.headers && typeof req.headers.get === 'function' && req.headers.get('range')) return false
  return true
}

async function trim() {
  const c = await caches.open(CACHE)
  const keys = await c.keys()
  // Cache API 嘅 keys() 係插入次序，最早嗰啲先刪。
  for (const k of keys.slice(0, Math.max(0, keys.length - MAX_ENTRIES))) await c.delete(k)
}

function offlinePage() {
  const html = `<!doctype html><html lang="zh-HK"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>冇網絡 · Offline</title>
<style>body{margin:0;font:16px/1.6 system-ui,sans-serif;background:#F4F0EA;color:#2C2A29;display:grid;place-items:center;min-height:100vh;padding:24px;box-sizing:border-box}
main{max-width:420px}a{color:#445148;font-weight:600}p{margin:.5em 0}</style></head>
<body><main><p><strong>你而家冇網絡。</strong></p>
<p>呢一頁你之前未開過，所以部機冇存底。之前做過嘅科目仍然可以練習：</p>
<p><a href="/practice">去練習</a> · <a href="/dashboard">睇進度</a></p>
<p lang="en" style="margin-top:1.5em">You are offline. This page was not saved on this device. Subjects you have practised before still work: <a href="/practice">Practice</a> · <a href="/dashboard">Progress</a></p>
</main></body></html>`
  return new Response(html, { status: 503, headers: { 'content-type': 'text/html; charset=utf-8' } })
}

async function networkFirst(req) {
  try {
    const res = await fetch(req)
    // 只存正常嘅同源回應。404、重新導向、opaque 一律唔存 ——
    // 存咗一個 404，斷網時就會一直見到 404。
    if (res.ok && res.type === 'basic') {
      const copy = res.clone()
      caches.open(CACHE).then((c) => c.put(req, copy)).then(trim).catch(() => {})
    }
    return res
  } catch (err) {
    const hit =
      (await caches.match(req)) ||
      // /practice?subject=physics 未開過，但 /practice?subject=math 開過：
      // 同一個頁面組件，科目由 client 讀 query 決定。
      (req.mode === 'navigate' ? await caches.match(req, { ignoreSearch: true }) : undefined)
    if (hit) return hit
    if (req.mode === 'navigate') return offlinePage()
    throw err
  }
}

self.addEventListener('install', () => {
  // 即刻接手：network-first 之下新舊版本並存冇害，而回滾要越快生效越好。
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const k of await caches.keys()) {
        // 冇開離線 → 刪晒（回滾）；有開 → 刪舊版本。
        if (k.startsWith(CACHE_PREFIX) && (!OFFLINE_ON || k !== CACHE)) await caches.delete(k)
      }
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  if (!OFFLINE_ON) return
  if (!shouldHandle(event.request, self.location.origin)) return
  event.respondWith(networkFirst(event.request))
})

// 預載 app shell：SW 喺第一次載入【之後】先裝好，嗰一頁用過嘅資源冇經過佢。
// 由頁面報返自己用過嘅同源 URL（components/ServiceWorkerRegister.tsx），
// 呢度補存 —— 否則第一次開完即刻斷網，reload 會缺 chunk。
self.addEventListener('message', (event) => {
  const d = event.data
  if (!OFFLINE_ON || !d || d.type !== 'dse-warm' || !Array.isArray(d.urls)) return
  event.waitUntil(
    (async () => {
      const c = await caches.open(CACHE)
      for (const u of d.urls.slice(0, 200)) {
        try {
          const req = new Request(u, { credentials: 'same-origin' })
          if (!shouldHandle(req, self.location.origin)) continue
          if (await c.match(req)) continue
          const res = await fetch(req)
          if (res.ok && res.type === 'basic') await c.put(req, res)
        } catch {
          /* 一條失敗唔阻其餘 */
        }
      }
      await trim()
    })(),
  )
})

// 俾 node:test 攞純函數出嚟驗。喺瀏覽器／SW 度 `module` 係 undefined，
// 所以呢一段完全冇作用 —— 唔會影響 SW 嘅行為。
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { decideNotification, TEXT, shouldHandle, OFFLINE_ON }
}
