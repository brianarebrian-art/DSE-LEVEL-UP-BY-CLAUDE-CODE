// ============================================================================
// levelDistribution.ts —— 考評局 2025 年各科成績分佈（唯讀）
// ----------------------------------------------------------------------------
// 資料來源：《2025 年香港中學文憑考試考生在各科的成績分析》表 5a（日校考生）。
// 由 scripts/qbank/extract-hkeaa-2025.py 直接由考評局 PDF 抽出，可重跑覆核。
//
// ══ 呢啲數字係咩，唔係咩 ══
// 係：「有幾多百分比嘅考生攞到某一級」—— 考評局公開發布嘅事實。
// 唔係：「攞幾多分先有某一級」。考評局從來冇公布過任何一科嘅分數線；DSE 用
//       水平參照，分數線每年按評卷結果訂立。data/cutoffs.ts 嗰組 92/83/70…
//       係平台自訂嘅，同呢個檔冇關係。
//
// ══ 用途同紅線 ══
// 用途：喺估算旁邊出一句有出處嘅參考（「2025 年經濟科考生入面，70.1% 攞到
//       3 級或以上」），令學生知道自己個範圍喺全港人群入面大概點解讀。
//
// ⛔ 嚴禁用嚟做跨科難度比較。M2 有 34.4% 考生達 5 級以上、體育 3.6%，但呢個
//    唔代表 M2 易過體育 —— M2 係自選科目，報考嘅本身就係數學能力較強嗰群。
//    一個學生因為睇咗我哋個 app 而轉選 M2 然後跟唔上，係我哋造成嘅實質傷害。
//    本模組【冇】亦【唔會】提供任何跨科排序或比較嘅函數。
//
// ⛔ 本檔唔含亦永不含特殊需要考生統計（嗰個喺表 3g）。群體統計永不進入個人估算。
// ============================================================================

import raw from '@/data/dse-2025-level-distribution.json'

export type LevelKey = '5**' | '5*+' | '5+' | '4+' | '3+' | '2+' | '1+'

export interface SubjectDistribution {
  hkeaaZh: string
  /** 出席人數（日校考生） */
  sat: number
  /** 累積百分率：攞到該級【或以上】嘅考生百分比 */
  cumulative: Record<LevelKey, number>
  /** 未能評級（U）嘅百分比 */
  u: number
  /**
   * 出席人數少於 200。規格書 §3.2：一兩個考生就能移動幾個百分點，
   * 呢啲科目唔可以單獨作為校準目標，顯示時亦要講明樣本細。
   */
  smallSample: boolean
  /** 該科由考評局兩個單元合併而成（按出席人數加權）時嘅來源 */
  merged?: { part: string; sat: number }[]
}

const SUBJECTS = raw.subjects as unknown as Record<string, SubjectDistribution>

export const DISTRIBUTION_YEAR = raw.source.year
export const DISTRIBUTION_COHORT = raw.source.cohort

/** 冇該科數據（或該科唔設等級）時回 null —— 呼叫端要有 null 分支，唔准兜個假數。 */
export function subjectDistribution(subjectId: string): SubjectDistribution | null {
  return SUBJECTS[subjectId] ?? null
}

/** 公民與社會發展只設達標／未達標，永不輸出 1–5 等級。 */
export function isBinarySubject(subjectId: string): boolean {
  return subjectId in raw.binarySubjects
}

/**
 * 攞到某一級或以上嘅考生百分比。
 * `level` 用 lib/mastery.ts 嘅數值制（5.5 = 5*、5.75 = 5**）。
 */
export function shareAtOrAbove(subjectId: string, level: number): number | null {
  const d = subjectDistribution(subjectId)
  if (!d) return null
  const key: LevelKey | null =
    level >= 5.75 ? '5**' : level >= 5.5 ? '5*+' : level >= 5 ? '5+'
      : level >= 4 ? '4+' : level >= 3 ? '3+' : level >= 2 ? '2+' : level >= 1 ? '1+' : null
  return key === null ? null : d.cumulative[key]
}
