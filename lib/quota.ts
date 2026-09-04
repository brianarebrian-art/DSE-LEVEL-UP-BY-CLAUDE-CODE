// 每日免費題數額度（憲章 §3.1：AI 出題每日 40 題）。
//
// ══ 現時係【暗置】 ══
// `isQuotaEnabled()` 預設 false。即係計數照計，但一題都唔會攔。
// 開賣日（2026-09-19）之前，學生完全感覺唔到有呢樣嘢存在。
//
// ══ 呢個數【唔上雲】 ══
// `dse_daily_answered` 唔喺 lib/sync.ts 白名單，亦唔准加落去 ——
// 憲章 §16.E 執行第 1 點：上雲白名單新增任何一個 key 都要創辦人書面批准。
// 「呢個人今日做咗幾多題」係一個逐日行為紀錄，比逐課題正確率更貼身。
// 額度喺部機度計，跨機唔同步 —— 即係換部機理論上可以重新計過。
// 呢個係【刻意】接受嘅漏洞：堵佢要將每日行為上雲，代價唔值。
//
// ══ 唔可以侵蝕練習流程（§8.1 約束 3）══
// 呢個 module 淨係讀寫一個 localStorage 數字。佢唔會 import 練習引擎，
// 唔會影響出題、批改、或者 60 秒逆向鎖死引擎嘅任何一步。

/** 憲章 §3.1 明文數字。改佢＝改憲章，要雙簽。 */
export const FREE_DAILY_LIMIT = 40

const KEY = 'dse_daily_answered'

// SEN 舒適模式旗標（lib/settingsSync.ts 定義）。任何一個開咗，
// 就當學生想要低刺激嘅環境。
const SEN_KEYS = ['dse_calm_lock', 'dse_easy_font', 'dse_reading_ruler', 'dse_hide_timer']

type DayCount = { date: string; n: number; last?: string }

/** 本機日曆日。香港用戶即係香港日子；唔用 UTC，因為凌晨兩點做題唔應該算第二日。 */
function today(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function read(): DayCount {
  const blank = { date: today(), n: 0 }
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return blank
    const v = JSON.parse(raw) as Partial<DayCount>
    if (typeof v?.date !== 'string' || typeof v?.n !== 'number' || !Number.isFinite(v.n)) return blank
    // 過咗日就歸零。冇 cron、冇 server —— 落一日自然就係新一日。
    return v.date === blank.date
      ? { date: v.date, n: Math.max(0, v.n), last: typeof v.last === 'string' ? v.last : undefined }
      : blank
  } catch {
    return blank
  }
}

/** 今日做咗幾多題。SSR 安全（冇 window 就當 0）。 */
export function getTodayCount(): number {
  if (typeof window === 'undefined') return 0
  return read().n
}

/**
 * 做完一組之後記數。
 *
 * `token` 係嗰組練習嘅穩定指紋。結果頁一 refresh 個 effect 就會再行一次，
 * 冇呢個守衛，學生撳兩次 F5 就當佢做多咗 40 題 —— 一個純粹因為
 * 我哋實作方式而扣佢額度嘅 bug。同一個 token 只計一次。
 */
export function recordAnswered(n: number, token: string): void {
  if (typeof window === 'undefined' || !Number.isFinite(n) || n <= 0 || !token) return
  try {
    const cur = read()
    if (cur.last === token) return
    localStorage.setItem(KEY, JSON.stringify({ date: cur.date, n: cur.n + Math.floor(n), last: token }))
  } catch {
    // localStorage 唔用得（私隱模式／滿咗）＝ 唔計數。
    // 額度係一個商業機制，唔應該為咗佢而令一個學生做唔到題。
  }
}

/**
 * 額度有冇實際生效。暗部署期間一律 false。
 *
 * 用 NEXT_PUBLIC_ 係因為呢個判斷要喺 client 做（渲染提示）。
 * ⚠️ 所以佢【唔係】安全邊界 —— 學生改得到。真正嘅 Plus 權限核對
 * 永遠喺 server（lib/payment/entitlement.ts）。呢度淨係決定
 * 「畀唔畀個提示出現」，唔決定「畀唔畀佢做題」。
 */
export function isQuotaEnabled(): boolean {
  return process.env.NEXT_PUBLIC_PLUS_ENABLED === '1'
}

/** 學生揀咗低刺激環境。決定用邊個版本嘅提示（修補 4）。 */
export function isSenComfortMode(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return SEN_KEYS.some((k) => localStorage.getItem(k) === '1')
  } catch {
    return false
  }
}

/** 今日夠鐘收工未。額度未生效就永遠 false。 */
export function hasReachedDailyLimit(): boolean {
  return isQuotaEnabled() && getTodayCount() >= FREE_DAILY_LIMIT
}
