// ⚠️ 本檔由 scripts/gen-question-summary.mts 產生 —— 請勿手動修改。
// 重新產生：npm run gen:summary
// 迴歸鎖：data/questions/__tests__/summary-parity.test.mts
//
// 每科題庫內容的雜湊，算法見 scripts/qbank/bank-version.mts（與 sync-questions.mts 共用）。
// 瀏覽器只會在雲端版本號與此處一致時使用 Supabase 副本，否則使用隨網站一併建置的題庫。
// 原因：2026-09-25 發現雲端副本停留於 09-05，比 repo 少 1,117 條，而學生一直在做舊版本。

/** 科目 id → 題庫內容版本號（與 Supabase question_bank_versions.version 同一算法）。 */
export const BANK_VERSION: Record<string, string> = {
  "math": "d16d20de4012b629",
  "m2": "797e736cce5e3d53",
  "m1": "cdbebf7411ac6658",
  "physics": "392f26cfddb4680b",
  "chemistry": "cd98a37b1e4a5dcd",
  "biology": "0dd3b1711b3bce0b",
  "english": "dd2127fa7586115d",
  "chinese": "3d46ffe901cfbcd0",
  "bafs": "0d48f18c17937a40",
  "ict": "f925aac84115da24",
  "economics": "9524fcdb1aa2c3f3",
  "csd": "9de6ddb2ae54d062",
  "chinese-history": "63235077ac5d924d",
  "history": "f7d810a55c3a7ea4",
  "geography": "7d38e5d3220fa191",
  "chinese-literature": "b0b5d69a74ebdc16",
  "english-literature": "b2e86fb05861b38f",
  "ethics-religious": "d5feeb65daaaec6e",
  "ths": "4a258b6caa5f5a0b",
  "health-management": "b6930626181bd3cd",
  "design-tech": "9e2791f2e12e965f",
  "visual-arts": "c914bdde51b372a3",
  "music": "916ad859f79005ee",
  "pe": "6f0f984502b0523e",
  "technology-living": "1e3185ebe7071ab8"
}
