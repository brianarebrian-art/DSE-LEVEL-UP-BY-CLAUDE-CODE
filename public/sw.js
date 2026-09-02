/* 考試日管家 —— service worker。
 *
 * ══ 呢個檔存在嘅原因 ══
 * 伺服器send嘅推送【冇任何內容】，亦都唔知邊個幾時考試。
 * 所以「今日關唔關我事」同「出乜文字」兩件事都喺呢度做 ——
 * 即係喺學生自己部機上面，讀部機自己嘅 IndexedDB。
 *
 * 唔關事就靜靜哋唔出通知。伺服器永遠唔知發生過乜。
 *
 * ⚠️ 呢個 SW 【故意冇 fetch handler】。加咗就會變成一層快取，
 * 而一層快取喺考試朝早可以出返一版舊嘅天氣 —— 嗰個係最唔可以
 * 出錯嘅時刻。要離線就要另外認真設計，唔可以順手做。
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

// 俾 node:test 攞呢個純函數出嚟驗。喺瀏覽器／SW 度 `module` 係 undefined，
// 所以呢一段完全冇作用 —— 唔會影響 SW 嘅行為。
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { decideNotification, TEXT }
}
