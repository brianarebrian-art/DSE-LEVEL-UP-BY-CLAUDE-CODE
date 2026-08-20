import type { CutoffTable } from '@/data/cutoffs'
import type { Grade } from '@/lib/grading'

// 等級估算的不確定範圍。
//
// ══ 點解要有呢個檔 ══
// 學生做完 20 題，見到一個「Level 4」。呢個數其實疊咗三層不確定性：
//
//   ① 分界線本身係近似值。data/cutoffs.ts 的 `practicePercentages`
//      （5**=92%、5*=83%、5=70%…）註明「Approximates typical DSE grade
//      distributions」，唔係考評局公布的官方分界。
//   ② 樣本細。20 題的答對率，同一個學生今日做同聽日做，本身就會上落。
//   ③ 題目係改寫版本，難度分佈同真卷唔會完全一致。
//
// 顯示成一個肯定的數字，等於把三層不確定性壓成零。學生若據此以為自己穩袋
// Level 4，而實際考獲 Level 3，佢失去的唔止係分數，係對整個平台的信任 ——
// 而呢個信任係我哋唯一真正擁有的資產。
//
// 本檔只處理 ② —— 唯一可以用數學誠實量化的一層。①③ 無法計算，必須用文字
// 向學生講明（見結果頁的說明文案）。呢個分工要記住：範圍收窄唔等於準確，
// 只等於「樣本夠大到答對率本身唔再飄」。
//
// ══ 用 Wilson score interval，唔用常見的 p̂ ± z·√(p̂(1-p̂)/n) ══
// 後者（Wald 區間）喺樣本細或答對率接近 0／1 時會出鬼——區間可以超出
// [0,1]，20 題全對時更會收成寬度 0，變成「我百分百肯定你係 5**」。
// Wilson 冇呢個問題：全對時上界仍為 1，下界仍然反映樣本細。

/** 95% 雙尾 z 值。用標準 95% 而唔係收窄到好睇的數 —— 區間闊本身就係訊息。 */
const Z = 1.959963985

export interface GradeRange {
  /** 區間下界對應的等級（較差那端） */
  low: Grade
  /** 區間上界對應的等級（較好那端） */
  high: Grade
  /** 上下界相同時為 true —— 樣本已足以指向單一等級 */
  isSingle: boolean
  /** 答對率區間，0–1。供顯示或除錯用。 */
  loRatio: number
  hiRatio: number
  /** 本次樣本題數 */
  n: number
  /**
   * 若要令區間收窄到只跨一個等級，仲需要大約幾多題（維持同一答對率）。
   * 已經係單一等級時為 0；估算不到（例如答對率啱啱喺分界線上）時為 null。
   */
  questionsToNarrow: number | null
}

const GRADE_ORDER: Grade[] = ['5**', '5*', '5', '4', '3', '2', '1']

/** Wilson score interval。回傳 [lo, hi]，必定落喺 [0,1] 之內。 */
export function wilsonInterval(correct: number, n: number, z = Z): [number, number] {
  if (n <= 0) return [0, 1]
  const p = Math.min(1, Math.max(0, correct / n))
  const z2 = z * z
  const denom = 1 + z2 / n
  const centre = (p + z2 / (2 * n)) / denom
  const half = (z / denom) * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))
  return [Math.max(0, centre - half), Math.min(1, centre + half)]
}

/** 把一個答對率映射到等級。同 predictGrade 用同一張分界表，確保兩者一致。 */
function ratioToGrade(ratio: number, table: CutoffTable): Grade {
  const score = ratio * table.totalMarks
  for (const g of GRADE_ORDER) {
    if (score >= table.cutoffs[g as keyof CutoffTable['cutoffs']]) return g
  }
  return 'U'
}

/**
 * 由本次成績算出等級區間。
 *
 * ⚠️ 公社科（達標／不達標）唔適用 —— 官方只有二元評級，冇區間概念。
 *    呼叫方須自行跳過，本函數唔會為 csd 產生有意義的輸出。
 */
export function gradeRange(correct: number, n: number, table: CutoffTable): GradeRange {
  const [loRatio, hiRatio] = wilsonInterval(correct, n)
  const low = ratioToGrade(loRatio, table)
  const high = ratioToGrade(hiRatio, table)
  const isSingle = low === high

  return {
    low, high, isSingle, loRatio, hiRatio, n,
    questionsToNarrow: isSingle ? 0 : estimateNarrowing(correct, n, table),
  }
}

/**
 * 維持同一答對率的前提下，大約要做到幾多題，區間先會收窄到單一等級。
 *
 * 刻意用逐步試算而唔係解析解：分界線唔等距，解析式會為咗好睇而假設等距，
 * 反而報一個做唔到的數。上限 500 題 —— 超過就代表答對率太貼近分界線，
 * 呢種情況下任何「再做 N 題就知」的講法都係誤導，故回 null。
 */
function estimateNarrowing(correct: number, n: number, table: CutoffTable): number | null {
  const p = correct / n
  for (let m = n + 5; m <= 500; m += 5) {
    const [lo, hi] = wilsonInterval(Math.round(p * m), m)
    if (ratioToGrade(lo, table) === ratioToGrade(hi, table)) return m
  }
  return null
}
