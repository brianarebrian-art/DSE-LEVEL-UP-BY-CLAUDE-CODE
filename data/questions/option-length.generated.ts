// ⚠️ 本檔由 scripts/gen-question-summary.mts 產生 —— 請勿手動修改。
// 重新產生：npm run gen:summary
// 迴歸鎖：data/questions/__tests__/summary-parity.test.mts
//
// 逐科「揀最長選項」的命中情況（創辦人回覆 17C，2026-10-04）。只計已上線的選擇題；
// unique 為四個選項中有唯一最長者的題數，correct 為該最長選項正是答案的題數。
// 隨機揀選的命中率約為四分之一。長度以 scripts/qbank/_gate.mjs 的 visualLength 量度。
// 日期只在數字改變時更新。

export const OPTION_LENGTH_MEASURED_AT = '2026-10-04'

export const LONGEST_OPTION: Record<string, { unique: number; correct: number }> = {
  "math": {
    "unique": 557,
    "correct": 43
  },
  "m2": {
    "unique": 441,
    "correct": 89
  },
  "m1": {
    "unique": 538,
    "correct": 51
  },
  "physics": {
    "unique": 685,
    "correct": 76
  },
  "chemistry": {
    "unique": 524,
    "correct": 100
  },
  "biology": {
    "unique": 489,
    "correct": 109
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
    "correct": 94
  },
  "ict": {
    "unique": 518,
    "correct": 154
  },
  "economics": {
    "unique": 547,
    "correct": 167
  },
  "csd": {
    "unique": 883,
    "correct": 719
  },
  "chinese-history": {
    "unique": 1060,
    "correct": 1004
  },
  "history": {
    "unique": 333,
    "correct": 264
  },
  "geography": {
    "unique": 689,
    "correct": 170
  },
  "chinese-literature": {
    "unique": 961,
    "correct": 872
  },
  "english-literature": {
    "unique": 986,
    "correct": 814
  },
  "ethics-religious": {
    "unique": 848,
    "correct": 697
  },
  "ths": {
    "unique": 543,
    "correct": 130
  },
  "health-management": {
    "unique": 626,
    "correct": 268
  },
  "design-tech": {
    "unique": 582,
    "correct": 190
  },
  "visual-arts": {
    "unique": 303,
    "correct": 212
  },
  "music": {
    "unique": 338,
    "correct": 149
  },
  "pe": {
    "unique": 540,
    "correct": 242
  },
  "technology-living": {
    "unique": 484,
    "correct": 188
  }
}
