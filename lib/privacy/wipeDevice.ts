'use client'

// ============================================================================
// wipeDevice —— 清走【呢部機】上面本平台寫過嘅所有嘢（PDPO 刪除權，本機半邊）
// ----------------------------------------------------------------------------
// 雲端半邊喺 app/api/account/delete/route.ts（由 lib/privacy/userData.ts 驅動）。
//
// ══ 點解要有呢個檔 —— 2026-09-13 之前嘅做法係 `localStorage.clear()` ══
// 介面講「本機資料亦已清空」，但實際上漏咗三樣：
//
//   ① IndexedDB `dse-exam-day` —— 考試日期。service worker 讀佢決定出唔出
//      「聽日考試」通知。唔清嘅話，學生撳完「刪除我的資料」，聽晚照樣彈通知。
//   ② 推送訂閱 —— `push_subscriptions` 用 endpoint 做 key，唔係 user_id，
//      所以雲端刪除迴圈【結構上】掃唔到佢。只有部機自己知道自己個 endpoint。
//   ③ IndexedDB `dse-qbank` 同 Cache Storage —— 公開題目內容，唔屬個人資料，
//      但介面講嘅係「本機資料」。一句講大咗嘅話，就算差嘅唔係私隱資料，
//      都係 §16.D 同一個病：讀嘅人以為清晒，實際冇。
//
// ══ 設計 ══
// · IndexedDB 唔寫死 DB 名，用 indexedDB.databases() 逐個列出嚟刪 ——
//   寫死就係第三個會漂移嘅地方（questionCloud.ts、push/client.ts、呢度）。
//   舊 Firefox（< 126）冇 databases()，先至回落 KNOWN_DBS；
//   lib/__tests__/wipe-device.test.mts 會掃 repo 入面每個 indexedDB.open，
//   確保 KNOWN_DBS 一個唔漏。
// · 每一步獨立 try，一步失敗唔阻下一步；最後【如實】回報邊步冇完成，
//   同雲端刪除路由「刪唔到嘢就唔可以回 ok」係同一條原則。
// · deleteDatabase 撞到未關嘅連線會 blocked —— 請求唔會唔見，會排隊到連線
//   關咗先執行。所以 caller 清完一定要做一次【完整 reload】（唔係 client 導航），
//   reload 會關晒連線，排隊嘅刪除即刻完成，亦同時清走記憶體入面嘅舊 state。
// ============================================================================

import { unsubscribePush } from '@/lib/push/client'

/** 瀏覽器冇 indexedDB.databases() 嗰陣嘅回落名單。測試守住佢唔會漏。 */
export const KNOWN_DBS = ['dse-qbank', 'dse-exam-day'] as const

export interface WipeReport {
  /** 完全清走咗嘅步驟 */
  done: string[]
  /** 冇完成嘅步驟（附原因）—— 非空就唔可以同學生講「全部清走咗」 */
  failed: string[]
  /** 已排隊、要 reload 先完成嘅 IndexedDB 刪除 */
  queued: string[]
}

function deleteDb(name: string): Promise<'ok' | 'blocked' | 'error'> {
  return new Promise((resolve) => {
    let req: IDBOpenDBRequest
    try { req = indexedDB.deleteDatabase(name) } catch { return resolve('error') }
    req.onsuccess = () => resolve('ok')
    req.onerror = () => resolve('error')
    // blocked ≠ 失敗：請求仍然排緊隊，連線一關就會刪。
    req.onblocked = () => resolve('blocked')
  })
}

export async function wipeThisDevice(): Promise<WipeReport> {
  const r: WipeReport = { done: [], failed: [], queued: [] }

  // ① 推送 —— 一定要行先：退訂要靠 service worker 登記攞 subscription，
  //    下面第 ③ 步會剷走個登記。unsubscribePush 同時通知伺服器刪 endpoint；
  //    伺服器嗰下失敗亦唔會永久殘留 —— cron 下次推送收到 410 會自己刪死端點。
  try {
    await unsubscribePush()
    r.done.push('push')
  } catch {
    r.failed.push('push')
  }

  // ② IndexedDB
  if (typeof indexedDB !== 'undefined') {
    let names: string[] = [...KNOWN_DBS]
    try {
      const listed = await indexedDB.databases?.()
      if (listed) names = [...new Set([...names, ...listed.map((d) => d.name).filter((n): n is string => !!n)])]
    } catch { /* 回落 KNOWN_DBS */ }
    for (const n of names) {
      const res = await deleteDb(n)
      if (res === 'ok') r.done.push(`idb:${n}`)
      else if (res === 'blocked') r.queued.push(`idb:${n}`)
      else r.failed.push(`idb:${n}`)
    }
  }

  // ③ Service worker 登記 ＋ Cache Storage
  try {
    if ('serviceWorker' in navigator) {
      for (const reg of await navigator.serviceWorker.getRegistrations()) await reg.unregister()
    }
    if (typeof caches !== 'undefined') {
      for (const k of await caches.keys()) await caches.delete(k)
    }
    r.done.push('sw+cache')
  } catch {
    r.failed.push('sw+cache')
  }

  // ④ localStorage ＋ sessionStorage —— 放最尾：上面幾步都唔讀佢，
  //    但如果放前面而某一步觸發咗任何寫入，就會寫返啲嘢入嚟。
  try {
    localStorage.clear()
    sessionStorage.clear()
    r.done.push('storage')
  } catch {
    r.failed.push('storage')
  }

  return r
}
