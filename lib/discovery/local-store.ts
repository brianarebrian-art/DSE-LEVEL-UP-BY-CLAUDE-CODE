'use client'

// 發現簿 —— localStorage 讀寫（BUILD-SPEC §2.1）
//
// ⚠️ 【永不上雲】。呢個唔係實作細節，係承諾：
//   · `label` 可以係學生自己打嘅字，有機會夾雜個人情緒內容（BUILD-SPEC §2.3 步驟 4）
//   · 上雲白名單由 lib/sync.ts 定義，新增任何一個 key 都要創辦人書面批准
//     （憲章 §16.E 執行第 1 點）。`dse_discoveries` 冇批准過，亦冇打算攞批准。
// 迴歸鎖：lib/__tests__/discovery-local-only.test.mts
//
// 一切操作 best-effort：私隱瀏覽模式、額度爆、學生封鎖咗儲存 —— 全部靜靜哋
// 降級成「今次冇記低」，唔可以拋錯入 UI。一個因為儲存失敗而爆咗嘅練習頁，
// 對學生嚟講就係「呢個網站壞咗」。
import type { Discovery } from './types'

export const DISCOVERIES_KEY = 'dse_discoveries'

// 上限。一條發現約 160 bytes，1200 條 ≈ 190KB —— localStorage 額度綽綽有餘，
// 而 1200 條已經係做足一整年練習嘅量。爆咗就掉最舊嗰批，唔會靜靜哋停止記錄。
const CAP = 1200

export function getDiscoveries(): Discovery[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(DISCOVERIES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as Discovery[]) : []
  } catch {
    return []
  }
}

/** 新嘅擺前面（最近做嘅擺頭），回傳寫入後嘅全本。 */
export function addDiscovery(d: Omit<Discovery, 'id' | 'createdAt'>): Discovery[] {
  const entry: Discovery = { ...d, id: newId(), createdAt: Date.now() }
  const next = [entry, ...getDiscoveries()].slice(0, CAP)
  save(next)
  return next
}

/** 某一節嘅發現（發現卡用）。 */
export function discoveriesSince(startedAt: number): Discovery[] {
  return getDiscoveries().filter((d) => d.createdAt >= startedAt)
}

export function clearDiscoveries(): void {
  try { localStorage.removeItem(DISCOVERIES_KEY) } catch { /* 冇得清就算 */ }
}

function save(list: Discovery[]): void {
  try {
    localStorage.setItem(DISCOVERIES_KEY, JSON.stringify(list))
  } catch {
    // 額度爆：掉一半再試一次。再唔得就放棄 —— 唔好為咗記一條發現而搞冧成節練習。
    try { localStorage.setItem(DISCOVERIES_KEY, JSON.stringify(list.slice(0, Math.floor(CAP / 2)))) } catch { /* 放棄 */ }
  }
}

// crypto.randomUUID() 要 secure context；http://localhost 算 secure，但區域網
// IP（同事用手機開嚟睇）就唔算，嗰陣會拋。回落一個夠用嘅隨機 id ——
// 呢個 id 淨係用嚟喺本機一個 array 入面分辨兩條記錄，唔涉及任何安全性質。
function newId(): string {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  } catch { /* 落下面 */ }
  return `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
}
