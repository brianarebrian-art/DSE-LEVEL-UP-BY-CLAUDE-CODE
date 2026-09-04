import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'

// 每日額度（lib/quota.ts）嘅行為測試。
//
// ══ 點解要有 ══
// 額度係一個【會扣走學生做題機會】嘅機制。佢出錯嘅方向唔對等：
// 少計咗，冇人受傷；多計咗，一個學生今日就做少咗題。
// 所以呢度嘅重點唔係「計得準」，係「唔會多計」。
//
// 呢個 module 純 localStorage，冇 React、冇網絡，所以 stub 一個
// 最小 localStorage 就跑得。

const store = new Map<string, string>()
const g = globalThis as unknown as { window?: unknown; localStorage?: unknown }
g.window = {}
g.localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
}

const { recordAnswered, getTodayCount, hasReachedDailyLimit, isQuotaEnabled, isSenComfortMode, FREE_DAILY_LIMIT } =
  await import('../quota.ts')

const KEY = 'dse_daily_answered'
const todayStr = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

beforeEach(() => {
  store.clear()
  delete process.env.NEXT_PUBLIC_PLUS_ENABLED
})

test('憲章 §3.1 明文數字：每日 40 題', () => {
  assert.equal(FREE_DAILY_LIMIT, 40, '改呢個數＝改憲章 §3.1，要 Brian ＋ Yuna 雙簽')
})

test('暗部署期間唔攔任何人', () => {
  recordAnswered(500, 'a')
  assert.equal(isQuotaEnabled(), false, 'NEXT_PUBLIC_PLUS_ENABLED 未開就唔應該生效')
  assert.equal(hasReachedDailyLimit(), false, '額度未開，做幾多題都唔可以話佢夠鐘')
})

test('同一組練習 refresh 極都只計一次', () => {
  const token = 'economics:14/20:512'
  recordAnswered(20, token)
  recordAnswered(20, token) // 學生撳 F5
  recordAnswered(20, token) // 再撳
  assert.equal(getTodayCount(), 20, '同一個 token 重複記數 —— 學生會無端端畀人扣咗額度')
})

test('唔同組練習分開計', () => {
  recordAnswered(20, 'economics:14/20:512')
  recordAnswered(20, 'physics:11/20:733')
  assert.equal(getTodayCount(), 40)
})

test('過咗一日就歸零', () => {
  store.set(KEY, JSON.stringify({ date: '2020-01-01', n: 999, last: 'old' }))
  assert.equal(getTodayCount(), 0, '舊日子嘅數唔可以帶落今日')
})

test('壞資料當零，唔可以掟錯', () => {
  for (const bad of ['{}', 'null', 'not json', '[]', JSON.stringify({ date: todayStr(), n: 'x' })]) {
    store.set(KEY, bad)
    assert.equal(getTodayCount(), 0, `壞資料 ${bad} 應該當零`)
  }
})

test('負數同零唔會扣數', () => {
  recordAnswered(20, 'a')
  recordAnswered(-5, 'b')
  recordAnswered(0, 'c')
  assert.equal(getTodayCount(), 20)
})

test('額度開咗之後，夠 40 題先至叫夠鐘', () => {
  process.env.NEXT_PUBLIC_PLUS_ENABLED = '1'
  recordAnswered(39, 'a')
  assert.equal(hasReachedDailyLimit(), false, '39 題唔應該攔')
  recordAnswered(1, 'b')
  assert.equal(hasReachedDailyLimit(), true)
})

test('任何一個 SEN 旗標開咗就用無壓力版（修補 4）', () => {
  assert.equal(isSenComfortMode(), false)
  for (const k of ['dse_calm_lock', 'dse_easy_font', 'dse_reading_ruler', 'dse_hide_timer']) {
    store.clear()
    store.set(k, '1')
    assert.equal(isSenComfortMode(), true, `${k} 開咗就應該當 SEN 模式`)
  }
})

test('SEN 版唔准出現「額度用完」類字眼（修補 4 禁語）', async () => {
  const fs = await import('node:fs')
  const src = fs.readFileSync('components/QuotaNotice.tsx', 'utf8')
  // 抽 SEN 分支：由 `if (state.sen)` 去到嗰個 return 完為止。
  const sen = /if \(state\.sen\) \{([\s\S]*?)\n  \}/.exec(src)
  assert.ok(sen, '搵唔到 SEN 分支 —— 組件結構改咗，呢個測試要跟住改')
  for (const banned of ['額度', '用完', '限制', '無限']) {
    assert.ok(
      !sen![1].includes(banned),
      `SEN 版出現咗「${banned}」—— 修補 4 明文禁語，會將學生放喺一個被攔住嘅位置`,
    )
  }
})

test('SEN 版必須保留「我想繼續」嘅出路，唔准收埋', async () => {
  const fs = await import('node:fs')
  const src = fs.readFileSync('components/QuotaNotice.tsx', 'utf8')
  const sen = /if \(state\.sen\) \{([\s\S]*?)\n  \}/.exec(src)
  assert.ok(sen![1].includes('我想繼續溫書'), 'SEN 版冇咗繼續溫書嘅選擇 —— 修補 4 要求佢永遠喺度')
})

test('額度數字唔准上雲（憲章 §16.E 執行第 1 點）', async () => {
  const fs = await import('node:fs')
  const sync = fs.readFileSync('lib/sync.ts', 'utf8')
  assert.ok(
    !sync.includes('dse_daily_answered'),
    'dse_daily_answered 入咗上雲白名單 —— 逐日行為紀錄上雲要創辦人書面批准',
  )
})
