// 啟發式教學引導模組（Socratic Heuristic Guidance）
//
// 貫徹「不憤不啟，不悱不發」理念與項目憲章限制：
// 1. 嚴禁直接列出最終答案，杜絕「看懂等於學會」的思維惰性。
// 2. 嚴格基於結構化層級（Level 1 方向點撥、Level 2 原理聯想、Level 3 起手式提示）。
// 3. 100% 繁體中文（香港慣用語），文案溫和、零催促、無 emoji。

export interface SocraticStep {
  level: 1 | 2 | 3
  /** 階梯名稱（方向點撥 / 原理聯想 / 步驟起手） */
  labelZh: string
  labelEn: string
  /** 啟發性提問或引導文字（以問句或思路提示為主） */
  promptZh: string
  promptEn: string
}

export interface QuestionSocraticFramework {
  questionId: string
  subjectId: string
  steps: SocraticStep[]
  /** 考評局評分核心關鍵字清單（供學生比對思考完整度） */
  markingSchemeKeywords?: string[]
}

/**
 * 建立三級啟發引導步驟
 */
export function buildSocraticSteps(params: {
  directionZh: string
  directionEn: string
  conceptZh: string
  conceptEn: string
  starterZh: string
  starterEn: string
}): SocraticStep[] {
  return [
    {
      level: 1,
      labelZh: '方向點撥',
      labelEn: 'Directional Cue',
      promptZh: params.directionZh,
      promptEn: params.directionEn,
    },
    {
      level: 2,
      labelZh: '原理聯想',
      labelEn: 'Core Concept',
      promptZh: params.conceptZh,
      promptEn: params.conceptEn,
    },
    {
      level: 3,
      labelZh: '步驟起手',
      labelEn: 'Step Starter',
      promptZh: params.starterZh,
      promptEn: params.starterEn,
    },
  ]
}

/**
 * 檢查自評文案是否包含考評局核心關鍵字（粗略覆蓋率檢查）
 * 學生自行輸入思考重點時，比對是否遺漏考評要點（零自動評分，僅供學生自我覺察）
 */
export function assessKeywordCoverage(studentNote: string, expectedKeywords: string[]): {
  matched: string[]
  missing: string[]
} {
  const matched: string[] = []
  const missing: string[] = []

  const cleanNote = studentNote.toLowerCase()

  for (const kw of expectedKeywords) {
    if (cleanNote.includes(kw.toLowerCase())) {
      matched.push(kw)
    } else {
      missing.push(kw)
    }
  }

  return { matched, missing }
}
