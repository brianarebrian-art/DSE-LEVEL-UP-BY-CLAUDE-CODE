// ⚠️ 本檔由 scripts/gen-question-summary.mts 產生 —— 請勿手動修改。
// 重新產生：npm run gen:summary
// 迴歸鎖：data/questions/__tests__/summary-parity.test.mts
//
// 逐科「揀最長選項」的命中情況（創辦人回覆 17C，2026-10-04）。只計已上線的選擇題；
// unique 為四個選項中有唯一最長者的題數，correct 為該最長選項正是答案的題數。
// 隨機揀選的命中率約為四分之一。長度以 scripts/qbank/_gate.mjs 的 visualLength 量度。
// 日期只在數字改變時更新。

export const OPTION_LENGTH_MEASURED_AT = '2026-10-09'

export const LONGEST_OPTION: Record<string, { unique: number; correct: number }> = {
  "math": {
    "unique": 557,
    "correct": 43
  },
  "m2": {
    "unique": 459,
    "correct": 91
  },
  "m1": {
    "unique": 599,
    "correct": 57
  },
  "physics": {
    "unique": 720,
    "correct": 78
  },
  "chemistry": {
    "unique": 529,
    "correct": 101
  },
  "biology": {
    "unique": 493,
    "correct": 107
  },
  "english": {
    "unique": 957,
    "correct": 343
  },
  "chinese": {
    "unique": 785,
    "correct": 732
  },
  "bafs": {
    "unique": 452,
    "correct": 92
  },
  "ict": {
    "unique": 518,
    "correct": 148
  },
  "economics": {
    "unique": 551,
    "correct": 168
  },
  "csd": {
    "unique": 885,
    "correct": 716
  },
  "chinese-history": {
    "unique": 1060,
    "correct": 1004
  },
  "history": {
    "unique": 335,
    "correct": 263
  },
  "geography": {
    "unique": 685,
    "correct": 162
  },
  "chinese-literature": {
    "unique": 959,
    "correct": 860
  },
  "english-literature": {
    "unique": 986,
    "correct": 814
  },
  "ethics-religious": {
    "unique": 849,
    "correct": 695
  },
  "ths": {
    "unique": 541,
    "correct": 126
  },
  "health-management": {
    "unique": 625,
    "correct": 267
  },
  "design-tech": {
    "unique": 582,
    "correct": 187
  },
  "visual-arts": {
    "unique": 303,
    "correct": 211
  },
  "music": {
    "unique": 335,
    "correct": 146
  },
  "pe": {
    "unique": 540,
    "correct": 242
  },
  "technology-living": {
    "unique": 484,
    "correct": 183
  }
}
