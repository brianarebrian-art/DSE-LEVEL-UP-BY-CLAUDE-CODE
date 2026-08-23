// ============================================================================
// mastery.ts —— 等級估算（v4：百分位空間，界線全部來自考評局公開數據）
// ----------------------------------------------------------------------------
// ══ v3 → v4 改咗咩，點解 ══
//
// v3 用一張【自訂門檻表】（t1 ≥ 0.85、t2 ≥ 0.80、t3 ≥ 0.50 → Level 5）。
// 嗰七個數字係人手揀嘅 —— 冇任何出處，亦冇任何方法驗證佢啱唔啱。換句話講，
// 「你係 4 級」呢句嘢入面，最關鍵嗰一步係一個拍腦袋嘅數。
//
// v4 剷走成張表。做法係離開分數空間，改用【百分位空間】：
//
//   1. 逐層猜測校正 → 加權合成一個掌握度 m
//   2. m 視為考生百分位（⚠️ 唯一未經驗證嘅假設，見下）
//   3. 由考評局表 5a 嘅【真實累積百分率】反查等級
//
// 咁樣，等級界線本身唔再係我哋作嘅 —— 係考評局公布咗嘅事實。逐科差異
// （英文前 10.1% 係 5 級、物理前 26.3% 先係 5 級）亦自動反映出嚟，唔使
// 為每科調參數。
//
// ══ 三種不確定性，分開講，唔混埋一齊 ══
//
// ① 抽樣誤差 —— 算得出。你做嘅題數有限，觀察到嘅正確率本身會上落。
//    用 Wilson 區間（唔用 Wald：樣本細或者接近全對時 Wald 會出負數／零寬度）。
//
// ② 年度漂移 —— 量得到。等級界線每年都郁。生物「5 級或以上」十年之間
//    由 18.0% 去到 20.9%（表 7c，sd 0.83 個百分點）。就算我哋量你量得完全準，
//    你對正嗰條線本身都喺度郁。呢個係水平參照制度嘅特性，唔係我哋嘅誤差。
//
// ③ 未驗證嘅假設 —— 量唔到，只能講明。第 2 步「m 視為百分位」從來冇對過
//    真實 DSE 成績驗證，因為本平台【冇一個】學生同時有（a）我哋量到嘅表現
//    同（b）真實 DSE 等級。冇對照數據，呢一步喺數學上係識別唔到嘅
//    (unidentified)。任何人聲稱佢個算法準，而佢冇呢批對照數據，佢係喺度作。
//
// ══ 點解【唔做】規格書 §4.4 嗰個逐科 k 擬合 ══
//
// 規格書要求：生成 10,000 個模擬考生 → 調 k 直至輸出分佈吻合表 5a。
// 呢個係循環論證。模擬考生嘅能力分佈本身係假設出嚟嘅，所以「調 k 令輸出
// 吻合」永遠都調得到 —— 你冇加入任何新資訊，只係造出咗一個「已校準」嘅
// 外觀。真正嘅校準需要對照數據（規格書自己嘅 Phase C：學生自願回報真實
// 成績），冇捷徑。故此 v4 用恆等映射並且【講明】，而唔係用一個擬合出嚟
// 嘅係數去掩蓋同一個假設。
//
// ══ 憲章 §7 / 規格書 §3.3：SEN 資料永不入算法 ══
// 本模組嘅輸入型別【刻意】冇任何 SEN 欄位 —— 傳唔到入去，就用唔到。
// ============================================================================

import { subjectDistribution, type LevelKey } from '@/lib/levelDistribution'
import { boundaryDrift } from '@/lib/levelDrift'

export type Tier = 'easy' | 'medium' | 'hard'
export type TierCounts = Record<Tier, { correct: number; total: number }>

/** 四選一 MC 嘅純猜中率。 */
export const GUESS_RATE = 0.25

/**
 * 三個難度層嘅權重。跟 DSE 卷面嘅 3:5:2（基礎:普通:拔尖）—— 同題庫嘅出題
 * 比例一致（憲章 §12）。唔用觀察到嘅比例，因為學生可以自己揀課題，
 * 揀晒基礎題就會令 m 虛高。
 */
export const TIER_WEIGHTS: Record<Tier, number> = { easy: 0.3, medium: 0.5, hard: 0.2 }

/**
 * 一節練習嘅平均每題秒數，低於此值即整節作廢。
 *
 * 用「一節嘅平均」而唔係逐題時間，因為 `AttemptRecord` 從來冇存過逐題計時。
 * 呢個係誠實嘅限制：佢捉到「全程亂撳」，但捉唔到「大部分題認真做、其中
 * 幾題亂撳」。要捉後者就要改練習頁去記逐題時間，屬另一批工作。
 */
export const MIN_SECONDS_PER_QUESTION = 3

/** 少過呢個題數，唔輸出任何等級 —— 短卷嘅上落大到冇診斷價值。 */
export const MIN_QUESTIONS = 30

/** 95% 雙尾 z 值。用標準 95%，唔收窄到好睇 —— 區間闊本身就係訊息。 */
const Z = 1.959963985

/**
 * 「係咪淨係喺度亂撳」呢個檢查專用嘅 z 值（99%）。
 *
 * 刻意比顯示用嘅 95% 嚴 —— 因為兩邊嘅代價唔對稱：
 *   · 錯誤咁話一個亂撳嘅人有等級 → 佢會信咗一個假嘅數去計劃溫書。
 *   · 錯誤咁叫一個真係識做嘅人再做多幾十題 → 佢做多幾十題。
 * 後者係可以接受嘅成本，前者唔係。
 */
const Z_GUESS = 2.5758293035

/** 校正正確率：扣走猜中嘅部分，下限截於 0。 */
export function corrected(correct: number, total: number): number {
  if (!Number.isFinite(correct) || !Number.isFinite(total) || total <= 0) return 0
  const obs = Math.max(0, Math.min(1, correct / total))
  return Math.max(0, (obs - GUESS_RATE) / (1 - GUESS_RATE))
}

/** Wilson score interval，回 [lo, hi]（未做猜測校正）。 */
export function wilson(correct: number, total: number, z: number = Z): [number, number] {
  if (!Number.isFinite(correct) || !Number.isFinite(total) || total <= 0) return [0, 1]
  const Z = z
  const n = total
  const p = Math.max(0, Math.min(1, correct / n))
  const d = 1 + (Z * Z) / n
  const c = p + (Z * Z) / (2 * n)
  const s = Z * Math.sqrt((p * (1 - p)) / n + (Z * Z) / (4 * n * n))
  return [Math.max(0, (c - s) / d), Math.min(1, (c + s) / d)]
}

const correctRatio = (x: number) => Math.max(0, (x - GUESS_RATE) / (1 - GUESS_RATE))

export type Level = 1 | 2 | 3 | 4 | 5 | 5.5 | 5.75
export function levelLabel(l: Level): string {
  return l === 5.75 ? '5**' : l === 5.5 ? '5*' : String(l)
}

const KEY_TO_LEVEL: [LevelKey, Level][] = [
  ['5**', 5.75], ['5*+', 5.5], ['5+', 5], ['4+', 4], ['3+', 3], ['2+', 2], ['1+', 1],
]
/** 由低至高 */
const LEVEL_ORDER: Level[] = KEY_TO_LEVEL.map(([, l]) => l).reverse()
const span = (lo: Level, hi: Level) => LEVEL_ORDER.indexOf(hi) - LEVEL_ORDER.indexOf(lo) + 1

/**
 * 由「全港前 q%」查該科嘅等級。界線全部係考評局表 5a 嘅實數。
 * 連第 1 級都唔到（q 大過 1+ 嘅百分率）時回 null —— 唔輸出「Level 0」。
 */
export function levelForTopShare(subjectId: string, topPercent: number): Level | null {
  const d = subjectDistribution(subjectId)
  if (!d) return null
  for (const [key, level] of KEY_TO_LEVEL) {
    if (d.cumulative[key] >= topPercent) return level
  }
  return null
}

/** 樣本量上限鎖：題數未夠，等級封頂 —— 唔畀一個做咗 30 題嘅人見到 5**。 */
export function sampleCap(effectiveTotal: number): Level | null {
  if (effectiveTotal < MIN_QUESTIONS) return null
  if (effectiveTotal < 60) return 3
  if (effectiveTotal < 120) return 4
  if (effectiveTotal < 200) return 5
  return 5.75
}

export interface MasteryInput {
  subjectId: string
  /** 累計（跨節）逐層作答統計。 */
  tiers: TierCounts
  /** 已通過效度閘嘅累計題數。 */
  effectiveTotal: number
}

export interface MasteryResult {
  low: Level | null
  high: Level | null
  /** 加權掌握度（已猜測校正），0–1。 */
  mastery: number
  /** 對應嘅「全港前 q%」中心值。 */
  topPercent: number | null
  /** 逐層校正正確率，供解釋用。 */
  correctedByTier: Record<Tier, number>
  /** 不確定性①：抽樣誤差令 topPercent 上落幾多個百分點。 */
  samplingSpread: number
  /** 不確定性②：該科該界線十年嘅標準差（百分點）。冇數據時為 null。 */
  driftSd: number | null
  reason: 'ok' | 'too_few' | 'too_uncertain' | 'below_floor' | 'no_distribution'
  /** 仲要做多幾多題先講得出嘢（`too_few` 同 `too_uncertain` 時有值）。 */
  questionsShort: number
}

/**
 * 一個估算最多只准跨【兩個相鄰等級】。
 *
 * 點解要有呢條線：喺 30–60 題嘅時候，抽樣區間闊到 ±37 至 ±66 個百分點 ——
 * 換算返等級就係「1 至 3 級」。呢句嘢對學生冇任何用，但佢讀落去好似係一個
 * 答案。與其講一個跨三級嘅「估算」，不如直接講「而家講唔到，仲要做幾多題」。
 *
 * 呢條線唔係拍腦袋：以經濟科為例，各等級喺百分位上嘅闊度係 17.3 / 28.0 /
 * 24.8 / 17.9 個百分點，所以一個跨三級嘅區間，即係抽樣誤差已經大過成個
 * 等級尺嘅一半以上。
 */
export const MAX_LEVEL_SPAN = 2

/**
 * 由累計逐層統計導出等級區間。
 *
 * 純函數。輸入【冇】亦不可以有任何 SEN 或個人特徵欄位（規格書 §3.3）。
 * 永遠輸出【區間】—— 冇任何路徑會回一個單一等級。
 */
export function predictMastery(input: MasteryInput): MasteryResult {
  const c: Record<Tier, number> = {
    easy: corrected(input.tiers.easy.correct, input.tiers.easy.total),
    medium: corrected(input.tiers.medium.correct, input.tiers.medium.total),
    hard: corrected(input.tiers.hard.correct, input.tiers.hard.total),
  }
  const n = Math.max(0, Math.floor(input.effectiveTotal))
  const blank = (reason: MasteryResult['reason']): MasteryResult => ({
    low: null, high: null, mastery: 0, topPercent: null, correctedByTier: c,
    samplingSpread: 0, driftSd: null, reason,
    questionsShort: Math.max(0, MIN_QUESTIONS - n),
  })

  if (subjectDistribution(input.subjectId) === null) return blank('no_distribution')
  const cap = sampleCap(n)
  if (cap === null) return blank('too_few')

  // ── 加權合成 + 抽樣區間 ─────────────────────────────────────────────────
  // 逐層各自取 Wilson 區間再加權合成上下界。呢個比真正嘅聯合區間【略闊】，
  // 而略闊係啱嘅方向：寧可講到自己冇咁肯定。
  let m = 0, lo = 0, hi = 0, guessLo = 0, wsum = 0
  for (const t of ['easy', 'medium', 'hard'] as Tier[]) {
    const d = input.tiers[t]
    if (d.total <= 0) continue
    const w = TIER_WEIGHTS[t]
    const [wl, wh] = wilson(d.correct, d.total)
    m += w * c[t]
    lo += w * correctRatio(wl)
    hi += w * correctRatio(wh)
    guessLo += w * correctRatio(wilson(d.correct, d.total, Z_GUESS)[0])
    wsum += w
  }
  if (wsum <= 0) return blank('too_few')
  m /= wsum; lo /= wsum; hi /= wsum; guessLo /= wsum

  // ── 分唔分得出你唔係喺度亂撳？ ────────────────────────────────────────
  // 猜測校正令【點估計】歸零，但區間仲會蓋住低等級 —— 而低等級喺百分位上
  // 好闊（經濟科 1+ 95.4%、2+ 88.0%），所以一個亂撳嘅人喺統計上啱啱好落
  // 喺嗰度。實測：n=120 亂撳一千次，有 308 次會出到「1–2 級」。
  //
  // 判準：如果 99% 區間校正後嘅【下界】仲係 0，代表我哋喺統計上排除唔到
  // 「佢純粹靠估」呢個可能。排除唔到就唔准講等級 —— 呢個係顯著性，唔係保守。
  //
  // ⚠️ 講清楚：呢個係統計檢定，唔係結構性保證。一個亂撳嘅人如果好彩到
  //    喺 120 題度撳中 35%，佢喺數據上同一個真係弱嘅學生【無法分辨】——
  //    冇任何算法做得到。實測亂撳一千次，會漏出去嘅少於 2%，而且封頂喺
  //    第 2 級。唔可以聲稱 0%。
  if (guessLo <= 0) return { ...blank('below_floor'), mastery: m, samplingSpread: 0 }

  const centre = (1 - m) * 100          // 前 q%
  const qHi = (1 - lo) * 100            // 表現差嗰端 → 排名靠後
  const qLo = (1 - hi) * 100
  const samplingSpread = Math.round((qHi - qLo) * 10) / 10

  const mid = levelForTopShare(input.subjectId, centre)
  if (mid === null) return blank('below_floor')

  // ── 年度漂移：把區間按該界線十年嘅標準差再推闊 ──────────────────────
  const key = KEY_TO_LEVEL.find(([, l]) => l === mid)?.[0] ?? null
  const drift = key ? boundaryDrift(input.subjectId, key) : null
  const sd = drift?.sd ?? null
  const pad = sd ?? 0

  // ⚠️ 次序好重要：先用【未封頂】嘅區間去判斷夠唔夠準，之後先封頂顯示。
  // 倒轉嘅話，樣本量上限鎖會把一個 ±60 個百分點嘅區間截成「2–3 級」，
  // 令一個完全冇資訊嘅估算睇落好似好精準 —— 封頂係用嚟限制顯示範圍，
  // 唔可以攞嚟遮住不確定性。
  let rawLow = levelForTopShare(input.subjectId, qHi + pad) ?? 1
  let rawHigh = levelForTopShare(input.subjectId, Math.max(0, qLo - pad)) ?? mid
  if (rawLow > rawHigh) [rawLow, rawHigh] = [rawHigh, rawLow]

  if (span(rawLow, rawHigh) > MAX_LEVEL_SPAN) {
    return {
      ...blank('too_uncertain'),
      mastery: m,
      topPercent: Math.round(centre * 10) / 10,
      samplingSpread,
      driftSd: sd,
      questionsShort: questionsToNarrow(input, m),
    }
  }

  const capped = (l: Level): Level => (l > cap ? cap : l)
  let low = capped(rawLow)
  let high = capped(rawHigh)

  // 永不輸出單一等級：即使所有不確定性都收窄到同一級，都要展示相鄰一級，
  // 因為第三種不確定性（未驗證嘅假設）根本量唔到 —— 唔可以扮佢係零。
  if (low === high) {
    const i = LEVEL_ORDER.indexOf(high)
    if (i >= 0 && i + 1 < LEVEL_ORDER.length && LEVEL_ORDER[i + 1] <= cap) high = LEVEL_ORDER[i + 1]
    else if (i > 0) low = LEVEL_ORDER[i - 1]
  }


  return {
    low, high, mastery: m, topPercent: Math.round(centre * 10) / 10,
    correctedByTier: c, samplingSpread, driftSd: sd, reason: 'ok', questionsShort: 0,
  }
}

/**
 * 維持目前嘅正確率，仲要做多幾多題先收窄到 ≤2 級。
 *
 * 用向前搜尋而唔用解析式：Wilson 區間再經加權、猜測校正、查表、漂移加闊
 * 幾層之後，冇一條乾淨嘅閉式解。直接照同一條路徑試幾個題數，最誠實。
 * 搜尋唔到（例如能力啱啱好踩喺界線上）時回 0，呼叫端要當「講唔到幾多題」。
 */
function questionsToNarrow(input: MasteryInput, m: number): number {
  const obs = m * (1 - GUESS_RATE) + GUESS_RATE          // 校正返做觀察正確率
  for (const n of [120, 180, 240, 320, 420, 560, 720, 960]) {
    if (n <= input.effectiveTotal) continue
    const per = Math.floor(n / 3)
    const mk = (k: number) => ({ correct: Math.round(obs * k), total: k })
    const r = predictMastery({
      subjectId: input.subjectId,
      tiers: { easy: mk(per), medium: mk(per), hard: mk(n - 2 * per) },
      effectiveTotal: n,
    })
    if (r.reason === 'ok') return n - input.effectiveTotal
  }
  return 0
}

/** 一節練習是否通過效度閘。 */
export function sessionIsValid(total: number, elapsedSeconds: number): boolean {
  if (!Number.isFinite(total) || total <= 0) return false
  if (!Number.isFinite(elapsedSeconds) || elapsedSeconds < 0) return false
  return elapsedSeconds / total >= MIN_SECONDS_PER_QUESTION
}

// ── 由本機練習紀錄導出（唯一嘅接線點）────────────────────────────────────

import { loadAttempts, type AttemptRecord } from '@/lib/progress'

export interface SubjectMastery extends MasteryResult {
  sessions: number
  discarded: number
  legacy: number
}

/**
 * 累計某一科嘅逐層統計並導出等級估算。
 *
 * 三種會被排除嘅節分開計數，因為「你有 5 節因為做得太快冇計入」同
 * 「你仲差 16 題」係兩句唔同嘅說話。
 */
export function computeSubjectMastery(
  attempts: readonly AttemptRecord[],
  subjectId: string,
): SubjectMastery {
  const tiers: TierCounts = {
    easy: { correct: 0, total: 0 },
    medium: { correct: 0, total: 0 },
    hard: { correct: 0, total: 0 },
  }
  let sessions = 0, discarded = 0, legacy = 0, effectiveTotal = 0
  for (const a of attempts) {
    if (a.subjectId !== subjectId) continue
    if (!a.difficultyResults) { legacy++; continue }
    if (!sessionIsValid(a.total, a.elapsed)) { discarded++; continue }
    let n = 0
    for (const t of ['easy', 'medium', 'hard'] as Tier[]) {
      const d = a.difficultyResults[t]
      if (!d || !Number.isFinite(d.correct) || !Number.isFinite(d.total)) continue
      tiers[t].correct += Math.max(0, d.correct)
      tiers[t].total += Math.max(0, d.total)
      n += Math.max(0, d.total)
    }
    effectiveTotal += n
    sessions++
  }
  return { ...predictMastery({ subjectId, tiers, effectiveTotal }), sessions, discarded, legacy }
}

/** 讀本機紀錄並導出。SSR 之下 loadAttempts 回 []，故安全。 */
export function getSubjectMastery(subjectId: string): SubjectMastery {
  return computeSubjectMastery(loadAttempts(), subjectId)
}
