// 考試日管家 —— 政府開放數據上游存取層（報告 v4.0 §6）
//
// ══ 三條硬規矩（§6.2）══
// 1. 前端零直連：呢個模組只可以喺 server 行（API route），瀏覽器唔會拎到
//    任何 *.gov.hk 網域。理由係條款合規同埋 CORS，亦避免學生部機嘅 IP
//    直接打政府 API。
// 2. 熔斷唔可以出白畫面：上游死咗要照出【最後一次成功嘅快取 + 時間戳】。
//    考試朝早六點半，一個空白頁比一個「五分鐘前嘅天氣」差好多。
// 3. 零新增付費服務：規格原文寫住用 Vercel KV，但憲章 §5 嚴禁新增服務。
//    改用行程內記憶體快取 —— serverless 實例之間唔共享，命中率低啲，
//    但成本真係 $0，而且上游本身容許呢個頻率。
//
// ⚠️ 唔好改成 fetch 嘅 next.revalidate 就算數：嗰個喺上游 5xx 嗰陣
// 唔會保留舊值，熔斷（規矩 2）就冇咗。呢度要自己揸住 last-good。

/** 一格快取：value 係最後一次成功嘅結果，ts 係嗰次嘅時間。 */
interface Slot<T> {
  value: T
  ts: number
}

const store = new Map<string, Slot<unknown>>()

export interface Fetched<T> {
  data: T
  /** 呢份資料嘅實際取得時間（ISO） */
  fetchedAt: string
  /** true = 上游今次失敗，出緊舊快取（熔斷中） */
  stale: boolean
}

/**
 * 帶快取同熔斷嘅 JSON 取數。
 *
 * @param key    快取鍵
 * @param url    上游 URL（必須係 https 嘅 *.gov.hk）
 * @param ttlMs  幾耐之內直接用快取唔打上游
 */
export async function cachedJson<T>(
  key: string,
  url: string,
  ttlMs: number,
  timeoutMs = 6000,
): Promise<Fetched<T>> {
  const hit = store.get(key) as Slot<T> | undefined
  const now = Date.now()
  if (hit && now - hit.ts < ttlMs) {
    return { data: hit.value, fetchedAt: new Date(hit.ts).toISOString(), stale: false }
  }

  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      cache: 'no-store',
      headers: { accept: 'application/json' },
    })
    if (!res.ok) throw new Error(`upstream ${res.status}`)
    const data = (await res.json()) as T
    store.set(key, { value: data, ts: now })
    return { data, fetchedAt: new Date(now).toISOString(), stale: false }
  } catch (err) {
    // 熔斷：有舊嘢就照出，並且明講係舊嘅。
    if (hit) {
      return { data: hit.value, fetchedAt: new Date(hit.ts).toISOString(), stale: true }
    }
    throw err instanceof Error ? err : new Error('upstream failed')
  } finally {
    clearTimeout(timer)
  }
}

/** 淨係俾測試用 —— 清走行程內快取。 */
export function __resetCache() {
  store.clear()
}

// ── 上游端點（全部公開、免鑰匙、免費）────────────────────────────────
const HKO = 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php'
const MTR = 'https://rt.data.gov.hk/v1/transport/mtr/getSchedule.php'
const LRT = 'https://rt.data.gov.hk/v1/transport/mtr/lrt/getSchedule'

/** TTL 按規格 §6.2：天氣 5–10 分鐘、列車 15–30 秒。 */
export const TTL = { weather: 5 * 60_000, warning: 60_000, train: 20_000 } as const

export interface WarnSumEntry {
  name: string
  code: string
  actionCode?: string
  type?: string
  issueTime?: string
  updateTime?: string
}
export type WarnSum = Record<string, WarnSumEntry>

export const getWarnings = () =>
  cachedJson<WarnSum>('hko:warnsum', `${HKO}?dataType=warnsum&lang=tc`, TTL.warning)

export interface RhrRead {
  temperature?: { data?: { place: string; value: number; unit: string }[] }
  rainfall?: { data?: { place: string; max?: number; min?: number; unit: string }[] }
  humidity?: { data?: { place: string; value: number; unit: string }[] }
  updateTime?: string
  icon?: number[]
}

export const getCurrentWeather = () =>
  cachedJson<RhrRead>('hko:rhrread', `${HKO}?dataType=rhrread&lang=tc`, TTL.weather)

export interface MtrTrain {
  seq: string
  dest: string
  plat: string
  time: string
  /** time-to-next-train，分鐘 */
  ttnt: string
  valid: string
}
export interface MtrSchedule {
  status?: number
  sys_time?: string
  curr_time?: string
  data?: Record<string, { UP?: MtrTrain[]; DOWN?: MtrTrain[] }>
}

export const getMtr = (line: string, sta: string) =>
  cachedJson<MtrSchedule>(
    `mtr:${line}:${sta}`,
    `${MTR}?line=${encodeURIComponent(line)}&sta=${encodeURIComponent(sta)}&lang=tc`,
    TTL.train,
  )

export interface LrtPlatform {
  platform_id: number
  route_list?: { route_no: string; dest_ch: string; time_ch: string; train_length?: number }[]
}
export interface LrtSchedule {
  status?: number
  platform_list?: LrtPlatform[]
}

export const getLrt = (stationId: string) =>
  cachedJson<LrtSchedule>(
    `lrt:${stationId}`,
    `${LRT}?station_id=${encodeURIComponent(stationId)}`,
    TTL.train,
  )
