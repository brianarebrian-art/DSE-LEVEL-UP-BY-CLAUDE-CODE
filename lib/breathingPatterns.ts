// B3 呼吸法升級 —— 三種節奏定義（純數據，零依賴）。
//
// 三個模式服務三種唔同狀態，唔係「難度分級」：
//   4-7-8      長呼氣 → 副交感神經佔優，適合心跳好快嗰陣
//   Box 4-4-4-4 四邊等長 → 節奏可預測，適合考前收斂注意力
//   Coherent 5-5 無屏息 → 最易持續，適合日常
//
// 醫療定位：呢啲係一般放鬆練習，唔係治療。有呼吸系統疾病（如哮喘）
// 嘅學生應該自然呼吸，唔好跟住屏息 —— 呢句提示喺 UI 常駐。

export type Phase = 'in' | 'hold' | 'out' | 'holdOut'

export interface BreathingPattern {
  id: 'relief' | 'box' | 'coherent'
  /** 一個完整循環嘅相位序列（毫秒） */
  cycle: { phase: Phase; ms: number }[]
  labelZh: string
  labelEn: string
  /** 咩時候適合用 —— 描述場景，唔評價用家 */
  whenZh: string
  whenEn: string
}

export const PHASE_LABELS: Record<Phase, { zh: string; en: string }> = {
  in: { zh: '吸氣', en: 'Breathe in' },
  hold: { zh: '屏息', en: 'Hold' },
  out: { zh: '呼氣', en: 'Breathe out' },
  holdOut: { zh: '停一停', en: 'Rest' },
}

// 相位顏色沿用 /relax 既有霓虹（呢個區係刻意深色，唔屬 light-first 遷移範圍）。
// 用 @theme 變數而唔係字面 hex，跟 P1-7-R1 已定嘅做法。
export const PHASE_COLOR: Record<Phase, string> = {
  in: 'var(--color-neon-cyan)',
  hold: 'var(--color-neon-purple)',
  out: 'var(--color-neon-pink)',
  holdOut: 'var(--color-neon-purple)',
}

export const PATTERNS: BreathingPattern[] = [
  {
    id: 'relief',
    labelZh: '4-7-8',
    labelEn: '4-7-8',
    whenZh: '心跳好快、頂唔順嗰陣',
    whenEn: 'When your heart is racing',
    cycle: [
      { phase: 'in', ms: 4000 },
      { phase: 'hold', ms: 7000 },
      { phase: 'out', ms: 8000 },
    ],
  },
  {
    id: 'box',
    labelZh: '方形呼吸',
    labelEn: 'Box breathing',
    whenZh: '考試前想收返個心',
    whenEn: 'Settling before an exam',
    cycle: [
      { phase: 'in', ms: 4000 },
      { phase: 'hold', ms: 4000 },
      { phase: 'out', ms: 4000 },
      { phase: 'holdOut', ms: 4000 },
    ],
  },
  {
    id: 'coherent',
    labelZh: '5-5 平衡',
    labelEn: 'Coherent 5-5',
    whenZh: '日常，冇特別事都做得',
    whenEn: 'Everyday, no reason needed',
    cycle: [
      { phase: 'in', ms: 5000 },
      { phase: 'out', ms: 5000 },
    ],
  },
]

export const DEFAULT_PATTERN = PATTERNS[0]

/** 一個循環嘅總長（毫秒）—— 用嚟計「你照顧咗自己幾耐」。 */
export function cycleMs(p: BreathingPattern): number {
  return p.cycle.reduce((sum, s) => sum + s.ms, 0)
}
