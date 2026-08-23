// ============================================================================
// levelDrift.ts —— 等級界線嘅年度漂移（唯讀）
// ----------------------------------------------------------------------------
// 資料來源：考評局表 7c（2016–2025，甲類學科，日校考生）。
// 由 scripts/qbank/extract-hkeaa-drift.py 直接抽出，可重跑覆核。
//
// 一個等級界線唔係一條固定嘅線。生物科「5 級或以上」十年之間由 18.0% 去到
// 20.9%。即係話就算我哋量一個學生量得完全準確，佢對正嗰條線本身都喺度郁。
// 呢個係水平參照制度嘅特性（每年按評卷結果訂線），唔係平台嘅量度誤差 ——
// 所以要分開講，唔可以混入抽樣誤差入面當成同一回事。
// ============================================================================

import raw from '@/data/dse-level-drift.json'
import type { LevelKey } from '@/lib/levelDistribution'

export interface Drift {
  /** 2016–2025 逐年嘅累積百分率 */
  series: number[]
  /** 標準差（百分點）—— 界線每年郁幾多 */
  sd: number
  min: number
  max: number
  range: number
}

const SUBJECTS = raw.subjects as unknown as Record<
  string, { years: number[]; byLevel: Record<string, Drift> }
>

/** 冇該科或該界線嘅十年數據時回 null —— 呼叫端要有 null 分支。 */
export function boundaryDrift(subjectId: string, level: LevelKey): Drift | null {
  return SUBJECTS[subjectId]?.byLevel?.[level] ?? null
}

export function driftYears(subjectId: string): number[] {
  return SUBJECTS[subjectId]?.years ?? []
}
