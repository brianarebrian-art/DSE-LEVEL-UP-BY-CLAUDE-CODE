/**
 * Loop Engineering 五維難度量表。
 * 2026-11-27 定稿。計分數字仍是 loop-engineering-w1-2026-11-26，錨點、剖面與公式沒有改。
 * 只供審核與腳本使用，不要由學生頁面引入。
 *
 * 這是平台自編量表，不是考評局標準。
 * 綜合分滿分 25。升級門檻是公式 (1)：升級後綜合分 ≥ 基準綜合分 × 1.10。
 * 算術達標不是「已達」或「已驗證 DSE+10%」。難度宣稱維持未驗證。
 */

export const RUBRIC_VERSION = 'loop-engineering-w1-2026-11-26'
export const RUBRIC_STATUS = 'final' as const
export const RUBRIC_FINALIZED_ON = '2026-11-27'
export const UPGRADE_FACTOR = 1.1
export const COMPOSITE_MAX = 25

export const DIMENSIONS = [
  'reasoning',
  'stepIntegration',
  'trapQuality',
  'expression',
  'transfer',
] as const

export type Dimension = (typeof DIMENSIONS)[number]

export type DimensionScores = Record<Dimension, number>

export const DIMENSION_LABEL_ZH: Record<Dimension, string> = {
  reasoning: '推理層級',
  stepIntegration: '步驟整合',
  trapQuality: '陷阱質量',
  expression: '表達／論證',
  transfer: '遷移',
}

/** 1／3／5 分的操作錨點。2 分、4 分取相鄰錨點之間，且仍須在課綱內。 */
export const ANCHORS_ZH: Record<Dimension, { at1: string; at3: string; at5: string }> = {
  reasoning: {
    at1: '直接套公式或提取單一資訊',
    at3: '兩步因果或條件判斷',
    at5: '策略選擇後多層論證，仍在課綱內',
  },
  stepIntegration: {
    at1: '單一步驟',
    at3: '須選擇並連接兩個知識點',
    at5: '跨課題整合且須自行規劃路徑',
  },
  trapQuality: {
    at1: '無教學陷阱或只有粗心點',
    at3: '高頻概念混淆且可教',
    at5: '多層次合理干擾，但全部可從題幹條件排除',
  },
  expression: {
    at1: '只要答案',
    at3: '須說明方法選擇',
    at5: '須比較方法或說明限制，且符合該題分值的考試節奏',
  },
  transfer: {
    at1: '與練習情境高度套路化',
    at3: '須把課綱能力遷到新情境',
    at5: '須判斷方法邊界並遷到相近但非同一題型',
  },
}

/**
 * 基準剖面是本平台對公開評核大綱卷別描述的操作讀法，不是考評局統計，
 * 也不是任何官方題的過錄。見 docs/loop-engineering/rubric-zh-hk.md。
 */
export const BASELINE_PROFILES = {
  p2_mc: {
    labelZh: '卷二選擇題的典型能力要求（未再拆甲部／乙部）',
    scores: { reasoning: 3, stepIntegration: 2, trapQuality: 3, expression: 1, transfer: 2 },
  },
  p1_a1: {
    labelZh: '卷一甲部(1) 淺易傳統題的典型能力要求',
    scores: { reasoning: 2, stepIntegration: 2, trapQuality: 2, expression: 3, transfer: 2 },
  },
  p1_a2: {
    labelZh: '卷一甲部(2) 較難傳統題的典型能力要求',
    scores: { reasoning: 3, stepIntegration: 3, trapQuality: 3, expression: 3, transfer: 3 },
  },
  p1_b: {
    labelZh: '卷一乙部傳統題的典型能力要求',
    scores: { reasoning: 4, stepIntegration: 4, trapQuality: 3, expression: 4, transfer: 3 },
  },
} as const

export type BaselineProfileId = keyof typeof BASELINE_PROFILES

export function composite(scores: DimensionScores): number {
  assertScores(scores)
  return DIMENSIONS.reduce((sum, key) => sum + scores[key], 0)
}

export function assertScores(scores: DimensionScores): void {
  for (const key of DIMENSIONS) {
    const value = scores[key]
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new Error(`${DIMENSION_LABEL_ZH[key]}必須是 1 至 5 的整數`)
    }
  }
}

/**
 * 公式 (1) 的右方。用 11/10 的整數路徑，避免二進制小數。
 * 不向下取整；整數綜合分須自行跨過這個門檻。
 */
export function upgradeThreshold(baselineComposite: number): number {
  if (!Number.isFinite(baselineComposite) || baselineComposite <= 0) {
    throw new Error('基準綜合分必須是正數')
  }
  return Math.round(baselineComposite * 11) / 10
}

export function meetsUpgradeTarget(upgradeComposite: number, baselineComposite: number): boolean {
  return upgradeComposite >= upgradeThreshold(baselineComposite)
}

/**
 * 和局：同一維度若相鄰兩個整數都說得通，取較低分。
 * 不相鄰的分歧不是和局，必須重評，不能在這裡折中。
 */
export function lowerScoreOnTie(a: number, b: number): number {
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || a > 5 || b < 1 || b > 5) {
    throw new Error('和局只接受 1 至 5 的整數')
  }
  if (Math.abs(a - b) > 1) throw new Error('和局只適用於相鄰分數，較大差距要重評')
  return Math.min(a, b)
}

/** 兩人綜合分不一致時，不取平均、不取較高分。工作分是較低的那份，直到第三人仲裁。 */
export function workingCompositeOnRaterTie(composites: number[]): number {
  if (composites.length < 2 || composites.some((value) => !Number.isFinite(value))) {
    throw new Error('和局至少要有兩份綜合分')
  }
  return Math.min(...composites)
}

export function profileComposite(profileId: BaselineProfileId): number {
  return composite(BASELINE_PROFILES[profileId].scores)
}

export interface ClassifiableItem {
  type: string
  marks?: number | null
  content?: string
}

export interface BaselineClassification {
  profileId: BaselineProfileId
  precision: 'section_tag' | 'marks_band' | 'mc_default'
  scores: DimensionScores
  composite: number
  upgradeThreshold: number
  source: 'platform_framework_proxy'
  officialStatistic: false
}

/** 選擇題不依卷別標籤再拆，因為題庫沒有已核實的基礎／非基礎課題旗標。 */
export function classifyBaseline(item: ClassifiableItem): BaselineClassification {
  const profileId = profileFor(item)
  const precision = precisionFor(item, profileId)
  const scores = { ...BASELINE_PROFILES[profileId].scores }
  const total = composite(scores)
  return {
    profileId,
    precision,
    scores,
    composite: total,
    upgradeThreshold: upgradeThreshold(total),
    source: 'platform_framework_proxy',
    officialStatistic: false,
  }
}

function profileFor(item: ClassifiableItem): BaselineProfileId {
  if (item.type === 'mc') return 'p2_mc'
  const section = detectPaper1Section(item.content ?? '')
  if (section === 'A1') return 'p1_a1'
  if (section === 'A2') return 'p1_a2'
  if (section === 'B') return 'p1_b'
  const marks = item.marks ?? 0
  if (marks >= 9) return 'p1_b'
  if (marks >= 5) return 'p1_a2'
  return 'p1_a1'
}

function precisionFor(item: ClassifiableItem, profileId: BaselineProfileId): BaselineClassification['precision'] {
  if (item.type === 'mc') return 'mc_default'
  if (detectPaper1Section(item.content ?? '')) return 'section_tag'
  return profileId === 'p2_mc' ? 'mc_default' : 'marks_band'
}

function detectPaper1Section(content: string): 'A1' | 'A2' | 'B' | null {
  if (/甲部\s*[（(]\s*1\s*[）)]|Section\s*A\s*\(\s*1\s*\)/i.test(content)) return 'A1'
  if (/甲部\s*[（(]\s*2\s*[）)]|Section\s*A\s*\(\s*2\s*\)/i.test(content)) return 'A2'
  if (/乙部|Section\s*B\b/i.test(content)) return 'B'
  return null
}
