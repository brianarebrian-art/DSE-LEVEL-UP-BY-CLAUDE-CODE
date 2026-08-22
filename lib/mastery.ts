// ============================================================================
// mastery.ts —— 掌握度階梯（等級預測算法 v3，規格書 2026-08-23 §四）
// ----------------------------------------------------------------------------
// 取代「答對百分比 → 查分數線」嘅估算方式。
//
// ══ 點解要換 ══
// 舊做法：答對率 ≥ 70% 就係 Level 5。四選一 MC 純亂按嘅期望正確率係 25%，
// 以二項分佈計算，20 題制之下亂按攞到假 Level 3 嘅機率係 10.18%；連續亂按
// 20 節，至少見到一次假 Level 3 嘅機率係 88.3%。呢個唔係 UI bug —— 係一條
// 70% 嘅分數線遇上 25% 嘅猜中率，再遇上短卷嘅大方差。
//
// 若果每節由 20 題減到 10 題，假 Level 5 嘅機率會由 0.0030% 升到 0.3506%
// —— 放大 118.8 倍。故此規格書訂明：縮短 session 嘅改動【唔可以】喺本模組
// 上線之前單獨發布。
//
// ══ 猜測校正係地基 ══
//   校正正確率 = max(0, (觀察正確率 − 0.25) ÷ 0.75)
// 純亂按嘅觀察率 0.25 校正後係 0，三層都係 0 —— 連 Level 1 都過唔到。
// 「亂按攞 Level 5」由「機率細」變成「結構上冇路徑」。
//
// ══ 憲章 §7 / 規格書 §3.3：SEN 資料永不入算法 ══
// `predictMastery()` 嘅輸入型別【刻意】唔設任何 SEN 欄位。呢個唔係守則，
// 係型別層面嘅硬阻擋 —— 傳唔到入去，就用唔到。理由：用群體統計去調整個人
// 估算，等於用一個標籤預先決定一個人嘅上限，而且會用「更準確」做包裝。
//
// ══ 未做嘅嘢（唔可以當已做）══
// 規格書 §4.4 要求逐科擬合校準係數 k，令輸出分佈吻合考評局 2025 年
// 各級考生累積百分率。嗰批數據（`dse-2025-level-distribution.json`）目前
// 【唔喺 repo 入面】，所以本模組嘅 k 一律 1.00，並且冇逐科差異。
// k 唔准手調 —— 要有值，必須跑得返嗰個擬合程序。
// ============================================================================

/** 三個難度層。同 PracticeSession 嘅 difficultyResults 一致。 */
export type Tier = 'easy' | 'medium' | 'hard'
export type TierCounts = Record<Tier, { correct: number; total: number }>

/** 四選一 MC 嘅純猜中率。 */
export const GUESS_RATE = 0.25

/**
 * 一節練習嘅平均每題秒數，低於此值即整節作廢（防線 2）。
 *
 * 用「一節嘅平均」而唔係逐題時間，因為 `AttemptRecord` 從來冇存過逐題計時。
 * 呢個係誠實嘅限制：佢捉到「全程亂撳」（規格書測試 3），但捉唔到「大部分題
 * 認真做、其中幾題亂撳」。要捉後者就要改練習頁去記逐題時間，屬另一批工作。
 */
export const MIN_SECONDS_PER_QUESTION = 3

/**
 * 門檻比較嘅容差。
 *
 * 門檻表用「≥」，即係啱啱好踩線要當作過。但校正公式 (obs − 0.25) ÷ 0.75 喺
 * 浮點數之下唔一定準：一個 tier 1 答啱 34／40（即剛好 85%）嘅學生，校正後
 * 係 0.7999999999999999，比 Level 4 嘅門檻 0.80 細一個 ULP —— 於是佢攞 Level 3，
 * 而另一個同樣係 85%（40／47）嘅學生攞 Level 4。同一個表現，兩個等級，
 * 分別只在於二進位表示。故此比較一律加 1e-9 容差。
 */
const EPS = 1e-9

/** 校正正確率：扣走猜中嘅部分，下限截於 0。 */
export function corrected(correct: number, total: number): number {
  if (!Number.isFinite(correct) || !Number.isFinite(total) || total <= 0) return 0
  const obs = Math.max(0, Math.min(1, correct / total))
  return Math.max(0, (obs - GUESS_RATE) / (1 - GUESS_RATE))
}

export type Level = 1 | 2 | 3 | 4 | 5 | 5.5 | 5.75
/** 5.5 = 5*，5.75 = 5**。用數字係為咗比較同計區間，顯示時用 `levelLabel()`。 */
export function levelLabel(l: Level): string {
  return l === 5.75 ? '5**' : l === 5.5 ? '5*' : String(l)
}

interface Rung {
  level: Level
  t1: number
  t2: number | null
  t3: number | null
  minT1: number
  minT2: number
  minT3: number
  minTotal: number
}

/**
 * 規格書 §4.3 門檻表。全部條件必須【同時】滿足。
 * t2／t3 嘅門檻會乘上逐科校準係數 k（目前一律 1.00，見檔首）。
 */
const LADDER: Rung[] = [
  { level: 5.75, t1: 0.90, t2: 0.90, t3: 0.85, minT1: 10, minT2: 20, minT3: 12, minTotal: 200 },
  { level: 5.5,  t1: 0.90, t2: 0.85, t3: 0.70, minT1: 10, minT2: 20, minT3: 12, minTotal: 150 },
  { level: 5,    t1: 0.85, t2: 0.80, t3: 0.50, minT1: 10, minT2: 20, minT3: 12, minTotal: 30 },
  { level: 4,    t1: 0.80, t2: 0.65, t3: null, minT1: 10, minT2: 20, minT3: 0,  minTotal: 30 },
  { level: 3,    t1: 0.70, t2: 0.40, t3: null, minT1: 10, minT2: 15, minT3: 0,  minTotal: 30 },
  { level: 2,    t1: 0.50, t2: null, t3: null, minT1: 10, minT2: 0,  minT3: 0,  minTotal: 30 },
  { level: 1,    t1: 0.25, t2: null, t3: null, minT1: 10, minT2: 0,  minT3: 0,  minTotal: 30 },
]

/**
 * 樣本量上限鎖（防線 5）。題數未夠，等級封頂。
 *
 * ⚠️ 呢道鎖同 §4.3 門檻表有一處互相覆蓋：表入面 5* 要求總數 ≥ 150，但本鎖
 * 喺 120–199 之間封頂 Level 5，所以 150–199 之間嘅 5* 事實上取唔到。
 * 兩者衝突時以【較保守】嘅一方為準（即本鎖），並喺此處記錄，唔靜靜改門檻表。
 */
export function sampleCap(totalEffective: number): Level | null {
  if (totalEffective < 30) return null
  if (totalEffective < 60) return 3
  if (totalEffective < 120) return 4
  if (totalEffective < 200) return 5
  return 5.75
}

export interface MasteryInput {
  /** 累計（跨節）逐層作答統計。單一節做唔到 —— Level 3 已需要 t1≥10 且 t2≥15。 */
  tiers: TierCounts
  /** 已通過效度閘嘅累計題數。 */
  effectiveTotal: number
  /**
   * 逐科校準係數。乘落 t2／t3 門檻。
   * 目前一律 1.00：擬合所需嘅考評局分佈數據未入 repo，冇得擬合就唔准填數。
   */
  k?: number
}

export interface MasteryResult {
  /** 估算等級；資料未夠時為 null。 */
  level: Level | null
  /** 顯示用區間（低／高）。level 為 null 時兩者皆 null。 */
  low: Level | null
  high: Level | null
  /** 三層嘅校正正確率，供解釋用。 */
  correctedByTier: Record<Tier, number>
  /** 未夠資料時嘅原因碼，供 UI 出對應文案。 */
  reason: 'ok' | 'too_few' | 'tier_gap' | 'below_floor'
  /** 仲差幾多題先夠出等級（`too_few` 時有值）。 */
  questionsShort: number
}

/** 規格書 §4.5：半寬 = clamp(0.9/√n, 0.08, 0.45)；Phase A 強制不小於 0.5 級。 */
export function halfWidth(effectiveTotal: number, phaseA = true): number {
  const raw = effectiveTotal > 0 ? 0.9 / Math.sqrt(effectiveTotal) : 0.45
  const clamped = Math.min(0.45, Math.max(0.08, raw))
  return phaseA ? Math.max(0.5, clamped) : clamped
}

const ORDER: Level[] = [1, 2, 3, 4, 5, 5.5, 5.75]
const step = (l: Level, d: number): Level => ORDER[Math.min(ORDER.length - 1, Math.max(0, ORDER.indexOf(l) + d))]

/**
 * 由累計逐層統計導出等級估算。
 *
 * 純函數。輸入【冇】亦【不可以有】任何 SEN 或個人特徵欄位（規格書 §3.3）。
 */
export function predictMastery(input: MasteryInput): MasteryResult {
  const k = Number.isFinite(input.k) && (input.k as number) > 0 ? (input.k as number) : 1
  const c: Record<Tier, number> = {
    easy: corrected(input.tiers.easy.correct, input.tiers.easy.total),
    medium: corrected(input.tiers.medium.correct, input.tiers.medium.total),
    hard: corrected(input.tiers.hard.correct, input.tiers.hard.total),
  }
  const n = Math.max(0, Math.floor(input.effectiveTotal))
  const cap = sampleCap(n)
  const blank: MasteryResult = { level: null, low: null, high: null, correctedByTier: c, reason: 'too_few', questionsShort: Math.max(0, 30 - n) }
  if (cap === null) return blank

  for (const r of LADDER) {
    if (r.level > cap) continue
    if (n < r.minTotal) continue
    if (input.tiers.easy.total < r.minT1) continue
    if (r.minT2 > 0 && input.tiers.medium.total < r.minT2) continue
    if (r.minT3 > 0 && input.tiers.hard.total < r.minT3) continue
    if (c.easy < r.t1 - EPS) continue
    if (r.t2 !== null && c.medium < r.t2 * k - EPS) continue
    if (r.t3 !== null && c.hard < r.t3 * k - EPS) continue
    const hw = halfWidth(n)
    const span = hw >= 0.5 ? 1 : 0
    return {
      level: r.level,
      low: step(r.level, -span),
      high: step(r.level, span),
      correctedByTier: c,
      reason: 'ok',
      questionsShort: 0,
    }
  }
  // 過唔到最低一級：唔係「資料不足」，而係目前嘅表現連 Level 1 嘅門檻都未到。
  // 呢個情況【唔顯示等級】—— 憲章 §7 唔准出現打擊自信嘅元素，把一個學生標成
  // 「Level 0」冇任何教學價值。UI 應改為顯示課題掌握度同下一步做咩。
  const gap = input.tiers.easy.total < 10 || (input.tiers.medium.total < 15 && c.easy >= 0.70)
  return { ...blank, reason: gap ? 'tier_gap' : 'below_floor', questionsShort: 0 }
}

/** 一節練習是否通過效度閘（防線 2）。 */
export function sessionIsValid(total: number, elapsedSeconds: number): boolean {
  if (!Number.isFinite(total) || total <= 0) return false
  if (!Number.isFinite(elapsedSeconds) || elapsedSeconds < 0) return false
  return elapsedSeconds / total >= MIN_SECONDS_PER_QUESTION
}

// ── 由本機練習紀錄導出（唯一嘅接線點）────────────────────────────────────

import { loadAttempts, type AttemptRecord } from '@/lib/progress'

const EMPTY: TierCounts = {
  easy: { correct: 0, total: 0 },
  medium: { correct: 0, total: 0 },
  hard: { correct: 0, total: 0 },
}

export interface SubjectMastery extends MasteryResult {
  /** 通過效度閘嘅節數 */
  sessions: number
  /** 因為太快而作廢嘅節數 —— 要向學生講明，唔可以靜靜扣走 */
  discarded: number
  /** 2026-08-23 之前、冇逐層統計嘅舊節數 */
  legacy: number
}

/**
 * 累計某一科嘅逐層統計並導出等級估算。
 *
 * 三種會被排除嘅節：① 平均每題快過 3 秒（防線 2）；② 冇 `difficultyResults`
 * 嘅舊記錄；③ 逐層總數對唔上該節題數（資料損壞）。三者分開計數，因為
 * 「你有 5 節因為做得太快冇計入」同「你仲差 16 題」係兩句唔同嘅說話。
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
  return { ...predictMastery({ tiers, effectiveTotal }), sessions, discarded, legacy }
}

/** 讀本機紀錄並導出。SSR 之下 loadAttempts 回 []，故安全。 */
export function getSubjectMastery(subjectId: string): SubjectMastery {
  return computeSubjectMastery(loadAttempts(), subjectId)
}

/** 完全冇資料時嘅空狀態，供 UI 直接用。 */
export const EMPTY_MASTERY: SubjectMastery = {
  ...predictMastery({ tiers: EMPTY, effectiveTotal: 0 }),
  sessions: 0, discarded: 0, legacy: 0,
}
