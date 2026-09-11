// ═══════════════════════════════════════════════════════════════════════════
// 實測難度加權抽題 —— 2027 目標書階段一第 2 項
// ───────────────────────────────────────────────────────────────────────────
//   「提高英文語法等高錯率模組嘅出現頻率，精確控制整體答題水準」
//   驗收：全站平均正確率收斂至 65% ± 3%
//
// ⚠️ 本模組【預設完全唔生效】。`EMPIRICAL_K = 0` 之下，
//    weightedOrder() 回傳嘅次序同輸入逐項相同 —— 即係現行行為，一個字都冇改。
//    要開，改一個常數（或者傳 k 入去）就得。
//
// ══ 點解落一個關住嘅掣，而唔係直接開 ══
//
// 實測結論（npm run qbank:simulate-sampling，1,000 節 × 10 題）：
//
//   k = 0  純隨機（現狀）  88.8%
//   k = 2  明顯傾斜        71.2%
//   k ≈ 3.1                65.2%  ← 命中目標
//   k = 4                  61.1%
//   k = 8                  55.2%
//
// 65% 搆得到。但 k ≈ 3.1 之下，五個課題食咗 61% 抽題量 ——
// 一節 10 題有 6.1 題落喺同五個課題，其餘一百幾個近乎抽唔到。
// 呢個係刷正確率而唔係溫書。
//
// 而且有內生性：實測正確率係喺【現行抽題】之下量到嘅，一加重權重，
// 學生喺該課題嘅曝露量大增，練得多咗正確率會升，於是 65% 守唔住，
// 要不斷加大 k —— 一個追唔到嘅移動目標。
//
// 更即時嘅衝突：今日（2026-09-09）先剷咗 30 秒反思鎖，開始兩個月實驗，
// 2026-11-09 憑逐週正確率 curve 覆檢（憲章 §7.2）。實驗期內大幅改難度，
// 條 curve 就分唔清係邊樣造成 —— 呢個係實驗設計問題，唔係態度問題。
//
// 所以：邏輯砌好、測試鎖好、預設關住。決定一落就係揭個掣，唔係開個工程。
//
// ══ 兩個刻意嘅設計 ══
//
// ① 只改【排序】，唔改【分層】。
//    buildPool 先排序、再 pickByDifficulty 按 3:5:2 分層。加權落喺排序嗰步，
//    所以 3:5:2 分毫不變 —— 變嘅只係邊個課題填入每一層。
//    憲章 §7 同 lib/adaptiveOrder.ts 都建基於嗰個比例，唔可以郁。
//
// ② 用【學生自己嘅】逐課題統計，唔用全站匯總。
//    dse_topic_stats 本來就喺本機、本來就喺 §16.E 上雲白名單之內 ——
//    唔使開新表、唔使開新 key、唔使新增任何採集。
//    而且個人化本身更啱：一個 Grammar 好嘅學生，唔應該因為「全站 Grammar 差」
//    而被灌 Grammar 題。§16.E 約束 3 禁止跨用戶比較，呢個做法連比較都冇。
// ═══════════════════════════════════════════════════════════════════════════

/**
 * 傾斜程度。權重 ∝ (1 − 正確率)^k。
 *
 * **0 = 完全唔生效**，次序同輸入逐項相同。呢個係現行行為。
 *
 * 改呢個數之前請先讀上面嘅實測結論 —— 特別係「k ≈ 3.1 令五個課題食咗
 * 61% 抽題量」同「§7.2 實驗期內改難度會令 curve 讀唔到」。
 */
export const EMPIRICAL_K = 0

/** 課題最少要幾多題實測紀錄，先至攞嚟計權重。太少就係噪音。 */
export const MIN_OBSERVATIONS = 8

export interface TopicAccuracy {
  /** 題庫嘅 topic id（唔係中文標籤）。 */
  topic: string
  /** 該課題做過幾多題。 */
  total: number
  /** 錯咗幾多題。 */
  wrong: number
}

/** 一條題目要有 topic 先排得到 —— 只取呢一欄，方便測試同重用。 */
interface HasTopic {
  topic: string
}

/**
 * 按實測正確率重新排序題目，令高錯率課題排前 —— 之後嘅分層會由頭攞起，
 * 所以排得前＝被抽中機會大。
 *
 * @param questions 已經排好序嘅題目（unseen-first 或 weakness-first）
 * @param accuracy  學生自己嘅逐課題統計
 * @param k         傾斜程度。**0 = 原樣返回**
 * @param rand      隨機源，預設 Math.random。測試傳入固定序列即可重現。
 *
 * ⚠️ k = 0 嗰條 early return 唔係優化，係【正確性要求】：
 *    冇佢嘅話，就算 k = 0 令所有權重相等，加權抽樣依然會重新洗牌，
 *    而上游 buildPool 嘅 unseen-first 次序就會被打散 —— 學生會開始
 *    重複見到啱啱做過嘅題。呢個係一個「開關關住但行為已經變咗」嘅陷阱。
 */
export function weightedOrder<T extends HasTopic>(
  questions: readonly T[],
  accuracy: readonly TopicAccuracy[],
  k: number = EMPIRICAL_K,
  rand: () => number = Math.random,
): T[] {
  if (k <= 0) return [...questions] // 見上面 ⚠️ —— 唔可以剷
  if (questions.length === 0) return []

  const wrongRate = new Map<string, number>()
  for (const a of accuracy) {
    if (!a?.topic || a.total < MIN_OBSERVATIONS) continue
    if (a.wrong < 0 || a.wrong > a.total) continue // 同 lib/progress.ts 一樣嘅衛生閘
    wrongRate.set(a.topic, a.wrong / a.total)
  }
  // 冇任何足夠樣本嘅課題 —— 冇嘢可以加權，原樣返回好過亂排。
  if (wrongRate.size === 0) return [...questions]

  // 未有實測嘅課題用【中位錯誤率】而唔係 0 ——
  // 用 0 會令所有新課題排到最後，等於學生永遠見唔到未做過嘅嘢，
  // 而未做過嘅嘢正正就係最應該做嘅。中位數令佢哋企喺中間，公平競爭。
  const rates = [...wrongRate.values()].sort((a, b) => a - b)
  // ⚠️ 偶數個樣本要取兩個中間值嘅【平均】，唔可以就咁 rates[len/2]。
  //    初版寫咗 rates[Math.floor(len / 2)]，喺偶數之下攞咗【上】中位數 ——
  //    得兩個課題（4% 同 90%）嗰陣，未做過嘅課題就會拎到 90%，
  //    即係被當成全站最難，排到最前。一個本來為咗「公平競爭」而設嘅回退值，
  //    反而變成「未做過嘅永遠優先」。測試 ⑧ 捉到。
  const mid = rates.length >> 1
  const median = rates.length % 2 === 1 ? rates[mid] : (rates[mid - 1] + rates[mid]) / 2

  // 不放回加權抽樣（Efraimidis–Spirakis）：每項計一個 key = rand^(1/w)，
  // 由大到小排。等價於逐次按權重抽而唔重複，但只需一次排序。
  const keyed = questions.map((q) => {
    const w = Math.pow(Math.max(wrongRate.get(q.topic) ?? median, 1e-6), k)
    // rand() 有機會回 0，Math.pow(0, 1/w) = 0 會令該項永遠包尾 ——
    // 夾一個極細下限，令「運氣差」唔會變成「永遠抽唔到」。
    const u = Math.max(rand(), 1e-12)
    return { q, key: Math.pow(u, 1 / w) }
  })
  keyed.sort((a, b) => b.key - a.key)
  return keyed.map((x) => x.q)
}

/**
 * 呢個模組而家生唔生效。
 *
 * 存在嘅原因：唔想任何人靠讀 `EMPIRICAL_K` 個數值去估行為。
 * 呼叫端問一句就知，而測試亦可以鎖住「預設係關住」呢件事。
 */
export function isEmpiricalWeightingActive(k: number = EMPIRICAL_K): boolean {
  return k > 0
}
