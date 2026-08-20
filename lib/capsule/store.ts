// 時間囊 —— 純本機儲存層。
//
// 設計紅線（見 docs/DECISION-no-interaction.md）：
//   · 零 server、零同步、零互動。呢啲字係學生寫畀自己嘅，唔應該離開部機，
//     亦【永遠唔可以】加入 CLOUD_KEYS（同 dse_emotion_log 同一級）。
//   · 封存中嘅囊【唔顯示倒數】—— 只顯示開啟日期。倒數本身就係壓力來源，
//     憲章 §7 嘅隱藏倒數計時器唔係得練習頁先算數。
//   · 唔記連續日數、唔計總數做成就（憲章禁 gamification）。

export const CAPSULE_KEY = 'dse_capsule'

export interface Capsule {
  id: string
  /** 學生自己寫嘅內容。 */
  text: string
  /** 寫低嗰刻（ms）。 */
  createdAt: number
  /** 可以打開嗰日（ms，當地日界線 00:00）。 */
  unsealAt: number
}

export const MAX_LEN = 1000
/** 上限只為咗防 localStorage 爆，唔係為咗設一個「目標」。 */
export const MAX_CAPSULES = 30

/** 當地時間某日嘅 00:00（ms）。用當地日界線，學生睇日曆同睇個站要一致。 */
export function startOfLocalDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

export function isSealed(c: Capsule, now: number = Date.now()): boolean {
  return now < c.unsealAt
}

export function load(): Capsule[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CAPSULE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // 逐項驗證：localStorage 係用戶改得到嘅，唔可以信 shape。
    return parsed.filter(
      (c): c is Capsule =>
        !!c &&
        typeof (c as Capsule).id === 'string' &&
        typeof (c as Capsule).text === 'string' &&
        Number.isFinite((c as Capsule).createdAt) &&
        Number.isFinite((c as Capsule).unsealAt),
    )
  } catch {
    return []
  }
}

export function save(list: Capsule[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CAPSULE_KEY, JSON.stringify(list.slice(0, MAX_CAPSULES)))
  } catch {
    // 配額爆／私密模式 —— 靜靜失敗好過拋錯整爛成版。
  }
}

/** 新增一個囊。回傳新清單（最新喺前）。 */
export function add(list: Capsule[], text: string, unsealAt: number, now: number = Date.now()): Capsule[] {
  const trimmed = text.trim().slice(0, MAX_LEN)
  if (!trimmed) return list
  const capsule: Capsule = {
    // crypto.randomUUID 喺所有目標瀏覽器都有；仍然留 fallback 免得舊 WebView 拋錯。
    id: globalThis.crypto?.randomUUID?.() ?? `c${now}${Math.random().toString(36).slice(2, 8)}`,
    text: trimmed,
    createdAt: now,
    // 最早都要聽日 —— 「即寫即開」唔係時間囊，而且會令個功能變成一個普通記事本。
    unsealAt: Math.max(unsealAt, startOfLocalDay(new Date(now)) + 86_400_000),
  }
  return [capsule, ...list].slice(0, MAX_CAPSULES)
}

export function remove(list: Capsule[], id: string): Capsule[] {
  return list.filter((c) => c.id !== id)
}
