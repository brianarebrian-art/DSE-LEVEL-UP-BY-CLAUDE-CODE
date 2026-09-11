// ============================================================================
// topic-stats-crdt.test.mts —— 逐課題統計嘅三方增量合併
// ----------------------------------------------------------------------------
// 2026-09-11 簽署：「實作基於 Timestamp 嘅增量 Union 策略」。
// 此前 dse_topic_stats 刻意跟贏家，情境 4 長期留紅等簽名。
//
// ══ 點解呢批測試要用具體數字，唔可以只測「兩邊嘅 key 都在」══
// 「兩邊 key 都在」呢個條件，相加、取 max、三方合併【三個做法都過到】——
// 換言之嗰條測試分辨唔到正確同錯誤。真正嘅難題係同一個課題兩邊都做過：
//
//   基準 20/5 · 本機 30/8 · 雲端 26/6
//     正解  36/9   （20 + 10 + 6 · 5 + 3 + 1）
//     相加  56/14  （共同嗰 20 題被雙計）
//     取max 30/8   （掉失雲端嗰 6 題）
//
// 差別落到學生身上：雷達圖顯示佢喺某課題做過 56 題，而佢其實做過 36 題，
// 正確率亦跟住錯。而且冇任何辦法事後分辨邊個數字曾經被雙計過。
// ============================================================================
import test from 'node:test'
import assert from 'node:assert/strict'

const { mergeTopicStats, mergeSnapshots, snapshotLocal, applyLocal, markTopicBase } =
  await import('../sync.ts')

type Stats = Record<string, { total?: number; wrong?: number; [k: string]: unknown }>
const S = (o: Stats) => o
/** 只取數字欄，方便逐項比對。 */
const nums = (m: Stats | undefined) =>
  Object.fromEntries(Object.entries(m ?? {}).map(([k, v]) => [k, `${v.total ?? 0}/${v.wrong ?? 0}`]))

// ── ① 共同歷史唔可以雙計 ──────────────────────────────────────────────────
test('共同歷史只計一次 —— 唔係相加', () => {
  const base = S({ 'math::algebra': { total: 20, wrong: 5 } })
  const local = S({ 'math::algebra': { total: 30, wrong: 8 } }) // 本機再做 10 題，錯 3
  const cloud = S({ 'math::algebra': { total: 26, wrong: 6 } }) // 另一機再做 6 題，錯 1
  const out = mergeTopicStats(local, cloud, base)
  assert.deepEqual(nums(out), { 'math::algebra': '36/9' },
    '20 + 10 + 6 = 36、5 + 3 + 1 = 9。得 56 即係相加（雙計），得 30 即係取 max（掉失）')
})

// ── ② 兩邊增量都要保住 ────────────────────────────────────────────────────
test('兩邊各自新開嘅課題都保得住', () => {
  const base = S({ 'math::algebra': { total: 10, wrong: 2 } })
  const local = S({ 'math::algebra': { total: 10, wrong: 2 }, 'econ::demand': { total: 15, wrong: 3 } })
  const cloud = S({ 'math::algebra': { total: 10, wrong: 2 }, 'bio::cells': { total: 8, wrong: 1 } })
  const out = mergeTopicStats(local, cloud, base)
  assert.deepEqual(nums(out), {
    'math::algebra': '10/2', // 兩邊都冇郁過 —— 唔可以變 20
    'econ::demand': '15/3',
    'bio::cells': '8/1',
  })
})

// ── ③ 冇基準 → 退回取 max（保守）────────────────────────────────────────
//
// 第一次同步、或者舊裝置未蓋過章嗰陣冇基準。此時寧可少計一邊嘅未同步增量，
// 都唔可以雙計 —— 少計仲有機會喺下次同步補返，雙計係永久污染。
test('冇基準退回逐欄取 max —— 寧可少計都唔可以雙計', () => {
  const local = S({ 'math::algebra': { total: 30, wrong: 8 } })
  const cloud = S({ 'math::algebra': { total: 26, wrong: 6 } })
  const out = mergeTopicStats(local, cloud, null)
  assert.deepEqual(nums(out), { 'math::algebra': '30/8' },
    '冇基準就算唔到增量；取 max 至少保證唔會大過真實值')
})

// ── ④ 合併永不倒退 ────────────────────────────────────────────────────────
//
// 一個喺基準入面、但已經唔喺雲端嘅課題（雲端行被一部冇該課題嘅機覆蓋過）：
// cloud + (local − base) 會扣走 base 嗰部分，結果細過本機現值。
// mergeTopicStats 嘅 Math.max(…, lv) 就係擋呢一種 —— 唔係裝飾。
test('雲端唔見咗某課題時，合併結果唔可以低過本機現值', () => {
  const base = S({ 'math::algebra': { total: 20, wrong: 5 } })
  const local = S({ 'math::algebra': { total: 25, wrong: 6 } })
  const cloud = S({}) // 雲端行被一部冇呢個課題嘅機覆蓋過
  const out = mergeTopicStats(local, cloud, base)
  assert.deepEqual(nums(out), { 'math::algebra': '25/6' },
    '冇個 Math.max 保護就會變成 0 + (25 − 20) = 5，學生嘅雷達會一夜之間縮水')
})

// ── ⑤ wrong 唔可以多過 total ──────────────────────────────────────────────
//
// 兩個欄位各自合併，理論上撞得穿。一個 wrong > total 嘅課題正確率為負數，
// 而 recalibrate 嘅衛生閘會直接剔走佢 —— 即係該課題喺雷達上消失。
test('答錯數永遠夾喺做過數之內', () => {
  const base = S({ 't': { total: 10, wrong: 9 } })
  const local = S({ 't': { total: 11, wrong: 20 } }) // 污糟數據
  const cloud = S({ 't': { total: 12, wrong: 11 } })
  const out = mergeTopicStats(local, cloud, base)
  const v = out!['t']
  assert.ok((v.wrong as number) <= (v.total as number),
    `wrong ${v.wrong} 多過 total ${v.total} —— 正確率會變負數`)
})

test('非數值／負數一律當 0，唔會爆', () => {
  const out = mergeTopicStats(
    S({ a: { total: NaN, wrong: -5 }, b: { total: 'x' as unknown as number } }),
    S({ a: { total: 4, wrong: 1 } }),
    null,
  )
  assert.deepEqual(nums(out), { a: '4/1', b: '0/0' })
})

// ── ⑥ 收斂 ────────────────────────────────────────────────────────────────
//
// ⚠️ 呢條測試第一版寫錯咗，而佢錯嘅方式本身就係重點，所以記低：
//    初版模擬「B 推上雲」之後，仍然用【舊基準 20/5】去幫 B 做下一次合併，
//    結果 36 + (26 − 20) = 42 —— B 自己嗰 6 題被計咗兩次。
//    真實情況唔會咁：B 一 push 成功，markTopicBase() 就會把 B 嘅基準
//    蓋成佢啱啱送出去嗰份（26/6）。即係話測試 ⑧ 守住嗰句唔係錦上添花 ——
//    冇咗佢，呢度就會出現一模一樣嘅 42。
//
// 以下逐步模擬真實時序，每部機各自帶自己嘅基準。
test('真實時序：兩部機各自帶基準，一輪來回之後收斂', () => {
  // 共同起點：兩機都同步過，雲端＝20/5
  let cloud = S({ t: { total: 20, wrong: 5 } })
  let baseA = S({ t: { total: 20, wrong: 5 } })
  let baseB = S({ t: { total: 20, wrong: 5 } })
  let A = S({ t: { total: 30, wrong: 8 } }) // A 離線再做 10 題，錯 3
  let B = S({ t: { total: 26, wrong: 6 } }) // B 離線再做 6 題，錯 1

  // ── B 先 push（冇 pull）──
  cloud = B
  baseB = B // ← markTopicBase(sent)

  // ── A 拉、合併、寫本機、再 push ──
  A = mergeTopicStats(A, cloud, baseA)!
  baseA = A // ← applyLocal 蓋章
  cloud = A
  assert.deepEqual(nums(A), { t: '36/9' }, 'A 合併之後應該係 20 + 10 + 6')

  // ── B 拉 ──
  B = mergeTopicStats(B, cloud, baseB)!
  baseB = B
  assert.deepEqual(nums(B), { t: '36/9' }, 'B 唔可以把自己嗰 6 題再計一次')
  assert.deepEqual(nums(A), nums(B), '兩部機最終要見到同一組數字')

  // ── 再拉多兩轉，數字唔可以再郁（冪等）──
  for (let i = 0; i < 3; i++) {
    A = mergeTopicStats(A, cloud, baseA)!
    baseA = A
    B = mergeTopicStats(B, cloud, baseB)!
    baseB = B
  }
  assert.deepEqual(nums(A), { t: '36/9' }, '重複同步唔可以令個數字一路脹大')
  assert.deepEqual(nums(B), { t: '36/9' })
})

// 把「基準冇蓋章」嗰個失敗模式明文鎖住 —— 呢個係整套機制最脆弱嘅一環。
test('基準冇跟住 push 蓋章，就會雙計（記錄失敗模式）', () => {
  const staleBase = S({ t: { total: 20, wrong: 5 } })
  const merged = mergeTopicStats(S({ t: { total: 26, wrong: 6 } }), S({ t: { total: 36, wrong: 9 } }), staleBase)!
  assert.deepEqual(nums(merged), { t: '42/10' },
    '呢個 42 就係基準過期嘅後果。佢喺度唔係因為啱，係因為要證明 markTopicBase 唔可以剷')
})

// ── ⑦ 基準 key 永不上雲 ───────────────────────────────────────────────────
//
// 憲章 §16.E 約束 6：上雲白名單三個 key，加任何一個都要創辦人書面批准。
// dse_topic_stats_base 係【本機記帳】，唔屬於白名單，亦唔准入。
// lib/__tests__/trust-disclosure.test.mts 嘅 BOOKKEEPING 豁免就係靠呢條撐住 ——
// 嗰邊係「聲稱」唔上傳，呢度係「核實」唔上傳。
test('dse_topic_stats_base 唔會出現喺上傳嘅快照入面', () => {
  const store = new Map<string, string>()
  const g = globalThis as Record<string, unknown>
  const prevW = g.window, prevL = g.localStorage
  const ls = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => void store.set(k, String(v)),
    removeItem: (k: string) => void store.delete(k),
  }
  g.localStorage = ls
  g.window = { localStorage: ls, dispatchEvent: () => true }
  try {
    store.set('dse_topic_stats', JSON.stringify({ 'math::algebra': { total: 20, wrong: 5 } }))
    markTopicBase({ 'math::algebra': { total: 20, wrong: 5 } })
    assert.ok(store.has('dse_topic_stats_base'), 'markTopicBase 應該寫得入本機')

    const sent = snapshotLocal()
    assert.ok(!('dse_topic_stats_base' in sent),
      '基準 key 走漏咗入上傳快照 —— 違反憲章 §16.E 約束 6')
    assert.ok(!JSON.stringify(sent).includes('dse_topic_stats_base'))
  } finally {
    g.window = prevW
    g.localStorage = prevL
  }
})

// ── ⑧ 基準一定要喺同步成功之後蓋章 ────────────────────────────────────────
//
// 冇呢一步，合併公式再啱都會出錯數：push 令雲端等於本機，基準唔跟住郁，
// 下次算出嚟嘅 delta 就會包含雲端【已經有】嘅部分 —— 即係雙計。
// 呢個係整套機制入面最易喺日後重構時被靜靜哋剷走嘅一環。
test('applyLocal 寫完課題統計即刻蓋章', () => {
  const store = new Map<string, string>()
  const g = globalThis as Record<string, unknown>
  const prevW = g.window, prevL = g.localStorage
  const ls = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => void store.set(k, String(v)),
    removeItem: (k: string) => void store.delete(k),
  }
  g.localStorage = ls
  g.window = { localStorage: ls, dispatchEvent: () => true }
  try {
    applyLocal({
      dse_progress: [],
      dse_free_attempts_total: 0,
      dse_topic_stats: { t: { total: 7, wrong: 2 } },
      updatedAt: 1,
      syncedAt: 1,
    } as never)
    assert.equal(store.get('dse_topic_stats_base'), store.get('dse_topic_stats'),
      'applyLocal 之後，基準必須等於啱啱寫入嘅課題統計')
  } finally {
    g.window = prevW
    g.localStorage = prevL
  }
})

test('push 成功之後有蓋章 —— SyncProvider 唔可以剷走呢句', async () => {
  const { readFileSync } = await import('node:fs')
  const src = readFileSync('components/SyncProvider.tsx', 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
  assert.match(src, /markTopicBase\(/, 'push 路徑冇叫 markTopicBase —— 下次合併會雙計')
  // 必須喺 res.ok 檢查之後先蓋章：push 失敗而蓋咗章，等於把一段未上傳嘅增量
  // 當成已經同步，之後永遠補唔返。
  const okIdx = src.indexOf('push ${res.status}')
  const markIdx = src.indexOf('markTopicBase(', okIdx)
  assert.ok(okIdx > 0 && markIdx > okIdx,
    'markTopicBase 必須喺 push 成功之後先叫 —— 失敗都蓋章會令未上傳嘅增量永久消失')
})

// ── ⑨ mergeSnapshots 唔可以整走本來有嘅雷達 ──────────────────────────────
test('一邊冇課題統計時，唔可以把另一邊洗白', () => {
  const withStats = {
    dse_progress: [], dse_free_attempts_total: 0,
    dse_topic_stats: { t: { total: 9, wrong: 2 } }, updatedAt: 1000, syncedAt: 500,
  }
  const without = { dse_progress: [], dse_free_attempts_total: 0, updatedAt: 2000, syncedAt: 500 }
  // 本機冇、雲端有
  const a = mergeSnapshots(without as never, { progress: withStats as never, updated_at: null } as never, null)
  assert.deepEqual(nums(a.dse_topic_stats as Stats), { t: '9/2' })
  // 本機有、雲端冇
  const b = mergeSnapshots(withStats as never, { progress: without as never, updated_at: null } as never, null)
  assert.deepEqual(nums(b.dse_topic_stats as Stats), { t: '9/2' })
})
