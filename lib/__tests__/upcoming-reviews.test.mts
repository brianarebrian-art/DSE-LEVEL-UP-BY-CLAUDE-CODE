// ============================================================================
// upcoming-reviews.test.mts —— 「聽日有嘢等你」回訪鉤子
// ----------------------------------------------------------------------------
// 交卷後喺 /result 顯示聽日到期嘅重溫題。呢個係留存鉤子 ——
// 實測 97 個做過至少一節嘅帳號，第二日返過嚟得 24 個（14%）。
//
// ⚠️ 呢個檔同時鎖住一個【設計決定】：唔做連續打卡。
//    lib/progress.ts:158 記低咗連續計數已經被刻意剷走並取代 ——
//    中斷一日即歸零，對焦慮同 ADHD 學生係純壓力（憲章 §7）。
//    若日後有人加返 streak，測試 ⑥ 會嗌。
// ============================================================================
import test from 'node:test'
import assert from 'node:assert/strict'

const DAY = 86_400_000

// upcomingReviews 讀 localStorage（經 lib/reverseLog）。Node 冇 window，
// 所以造一個最細嘅 localStorage 替身再 import —— 同 repo 其他測試同一招。
const store = new Map<string, string>()
;(globalThis as { localStorage?: unknown }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, v),
  removeItem: (k: string) => void store.delete(k),
}
;(globalThis as { window?: unknown }).window = globalThis

const { upcomingReviews, dueReviews, REVIEW_DONE_KEY } = await import('../reviewSchedule.ts')

const entry = (id: string, topic: string, daysAgo: number) => ({
  subjectId: 'economics', questionId: id, topic, topicEn: topic, topicId: 't',
  cause: 'A', selected: 'x', correct: 'y', ts: Date.now() - daysAgo * DAY,
})
const seed = (rows: unknown[]) => {
  store.clear()
  store.set('dse_reverse_log', JSON.stringify(rows))
}
const topics = (rows: { topic: string }[]) => rows.map((r) => r.topic)

// ── ① 只揀聽日啱好落喺 1/3/7/14/30 嗰啲 ────────────────────────────────────
test('只回傳聽日到期嘅題目', () => {
  seed([
    entry('a', '今日錯', 0), // 聽日 = 第 1 日 ✅
    entry('b', '前日錯', 2), // 聽日 = 第 3 日 ✅
    entry('c', '六日前', 6), // 聽日 = 第 7 日 ✅
    entry('d', '四日前', 4), // 聽日 = 第 5 日 ❌ 唔喺間隔表
    entry('e', '十日前', 10), // 聽日 = 第 11 日 ❌
  ])
  assert.deepEqual(topics(upcomingReviews(10)), ['今日錯', '前日錯', '六日前'])
})

// ── ② 預設上限 3（對應「明日 3 題」）──────────────────────────────────────
test('預設最多回傳 3 條 —— 避免壓力堆疊', () => {
  seed([entry('a', 'A', 0), entry('b', 'B', 0), entry('c', 'C', 0), entry('d', 'D', 0)])
  assert.equal(upcomingReviews().length, 3)
  assert.equal(upcomingReviews(4).length, 4, 'limit 可以覆寫')
})

// ── ③ 同一題只算一次 ──────────────────────────────────────────────────────
test('同一題錯過幾次只算最近嗰次', () => {
  seed([entry('same', '最近', 0), entry('same', '舊', 2)])
  assert.deepEqual(topics(upcomingReviews()), ['最近'], 'reverseLog 新喺頭，取第一次見到嗰條')
})

// ── ④ 今日已重溫過嘅，聽日唔應該再叫 ──────────────────────────────────────
//
// 唔隔走嘅話，學生啱啱重溫完，交卷頁就話「聽日有 3 條」，
// 而嗰 3 條就係佢啱啱做完嘅 —— 等於報一個假數。
test('今日已經重溫過嘅唔會再排入聽日', () => {
  seed([entry('done', '做過', 0), entry('todo', '未做', 0)])
  const today = new Date().toLocaleDateString('en-CA')
  store.set(REVIEW_DONE_KEY, JSON.stringify({ done: today }))
  assert.deepEqual(topics(upcomingReviews()), ['未做'])
})

// ── ⑤ 冇嘢到期就回空陣列（UI 靠呢個決定唔渲染）────────────────────────────
//
// /result 見到空陣列就【乜都唔顯示】，唔會出「聽日冇嘢重溫」之類嘅空狀態 ——
// 嗰句話對一個啱啱全對嘅學生毫無意義，對一個做少咗題嘅學生就變成提醒佢做得少。
test('冇嘢到期回空陣列', () => {
  seed([entry('a', 'A', 4)])
  assert.deepEqual(upcomingReviews(), [])
  seed([])
  assert.deepEqual(upcomingReviews(), [])
})

// ── ⑥ 唔准加返連續打卡 ────────────────────────────────────────────────────
//
// lib/progress.ts:158 明文記低：連續計數已被刻意剷走並取代，因為中斷一日
// 即歸零，等同宣告「之前的努力白費」—— 對焦慮傾向學生係純粹壓力源，
// 對 ADHD 學生令重新開始嘅門檻更高（憲章 §7 大愛設計）。
//
// 2027 目標書要求 Daily Streak。若有人照做，呢條會嗌 ——
// 嗰陣要做嘅唔係改測試，係核實嗰個決定有冇推翻過 §7 嘅簽名。
test('/result 唔准出現歸零式連續打卡', async () => {
  const { readFileSync } = await import('node:fs')
  const raw = readFileSync('app/result/ResultPageClient.tsx', 'utf8')
  // ⚠️ 一定要剝走註釋先掃。初版直接掃原始碼，結果捉到兩處【講緊唔做 streak】
  //    嘅註釋（line 189「無虛構…streak」同本功能自己嗰段說明）—— 一條用嚟
  //    守住「唔做 streak」嘅閘，反而被「解釋點解唔做 streak」嘅文字觸發。
  //    掃代碼嘅閘掃到註釋，捉到嘅係文檔而唔係行為。
  const src = raw
    .replace(/\/\*[\s\S]*?\*\//g, '') // 區塊註釋
    .replace(/(^|[^:])\/\/.*$/gm, '$1') // 行註釋（`$1` 保住 http:// 之類嘅冒號前綴）
  for (const banned of ['streak', 'Streak', '連續打卡', '連勝']) {
    assert.ok(!src.includes(banned),
      `/result 嘅【代碼】出現「${banned}」—— 連續計數已於 lib/progress.ts:158 刻意剷走（憲章 §7）：` +
      `中斷一日即歸零，對焦慮同 ADHD 學生係純壓力。要加返須先推翻該決定並留低簽名，` +
      `唔可以喺一個留存功能入面順帶加。`)
  }
  // 回訪鉤子本身要仲喺度 —— 唔可以剷咗 streak 之後連回訪理由都冇埋。
  assert.ok(src.includes('TomorrowStrip'), '/result 應保留「聽日有嘢等你」回訪鉤子')
})

// ── ⑦ 唔可以同 dueReviews 撈亂 ────────────────────────────────────────────
test('upcomingReviews 同 dueReviews 睇嘅係唔同日子', () => {
  seed([entry('today', '今日到期', 1), entry('tmr', '聽日到期', 0)])
  assert.deepEqual(topics(dueReviews()), ['今日到期'], 'dueReviews 睇今日')
  assert.deepEqual(topics(upcomingReviews()), ['聽日到期'], 'upcomingReviews 睇聽日')
})
