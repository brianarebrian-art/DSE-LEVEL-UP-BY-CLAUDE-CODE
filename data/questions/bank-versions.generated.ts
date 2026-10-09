// ⚠️ 本檔由 scripts/gen-question-summary.mts 產生 —— 請勿手動修改。
// 重新產生：npm run gen:summary
// 迴歸鎖：data/questions/__tests__/summary-parity.test.mts
//
// 每科題庫內容的雜湊，算法見 scripts/qbank/bank-version.mts（與 sync-questions.mts 共用）。
// 瀏覽器只會在雲端版本號與此處一致時使用 Supabase 副本，否則使用隨網站一併建置的題庫。
// 原因：2026-09-25 發現雲端副本停留於 09-05，比 repo 少 1,117 條，而學生一直在做舊版本。

/** 科目 id → 題庫內容版本號（與 Supabase question_bank_versions.version 同一算法）。 */
export const BANK_VERSION: Record<string, string> = {
  "math": "40e15e70233d229b",
  "m2": "3f47daa2eed83083",
  "m1": "4da53604cf5df560",
  "physics": "10186704be3e7e26",
  "chemistry": "8cd65430c4a3bd62",
  "biology": "ec6952ee80ef0b0a",
  "english": "03c7506362c20dc0",
  "chinese": "0d3a16fa37b20509",
  "bafs": "20df67eecd94c703",
  "ict": "858717b5a1a19f0c",
  "economics": "9b7f0314995579f5",
  "csd": "6100ab2ab6198fdb",
  "chinese-history": "0bf4bd4a84037fa1",
  "history": "b0820f8a2c7eb919",
  "geography": "3efbf5ff3d211c3a",
  "chinese-literature": "26ca0b9084d8abed",
  "english-literature": "f7a7deea15f0c24f",
  "ethics-religious": "0503d6895e4fa384",
  "ths": "1282eeb97cd9c9b8",
  "health-management": "7b1e3fb33a24da66",
  "design-tech": "d5cacfe84ccbb200",
  "visual-arts": "c21c0c1a02c593c4",
  "music": "6114bd1b12c8fbf8",
  "pe": "4cdc4cb8c0d4488e",
  "technology-living": "13155b47c51cf1a1"
}
