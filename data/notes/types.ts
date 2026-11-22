/** 一份課題自學筆記（可列印／儲存為 PDF）。 */
export interface StudyNote {
  subjectId: string
  topicId: string
  /** 課題中文名 */
  titleZh: string
  titleEn: string
  /** 核心概念（1–3 句） */
  conceptZh: string
  conceptEn: string
  /** 必記要點 */
  mustKnowZh: string[]
  mustKnowEn: string[]
  /** 考試作答提示 */
  examTipZh: string
  examTipEn: string
  /** 常見陷阱 */
  commonTrapZh: string
  commonTrapEn: string
  /** 可選：public/explainers 下的 SVG 路徑 */
  explainerSrc?: string
  /** 內容來源標記（透明） */
  source: 'generated' | 'sensei' | 'override'
}
