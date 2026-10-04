// ⚠️ 本檔由 scripts/gen-question-summary.mts 產生 —— 請勿手動修改。
// 重新產生：npm run gen:summary
// 迴歸鎖：data/questions/__tests__/summary-parity.test.mts
//
// 每科題庫內容的雜湊，算法見 scripts/qbank/bank-version.mts（與 sync-questions.mts 共用）。
// 瀏覽器只會在雲端版本號與此處一致時使用 Supabase 副本，否則使用隨網站一併建置的題庫。
// 原因：2026-09-25 發現雲端副本停留於 09-05，比 repo 少 1,117 條，而學生一直在做舊版本。

/** 科目 id → 題庫內容版本號（與 Supabase question_bank_versions.version 同一算法）。 */
export const BANK_VERSION: Record<string, string> = {
  "math": "4326865440cba0da",
  "m2": "41b1812cac3c01de",
  "m1": "3f3c2773398e7a79",
  "physics": "55fa56f8a6462080",
  "chemistry": "b9d57a4cab6dc18a",
  "biology": "a560e67f818923c1",
  "english": "03c7506362c20dc0",
  "chinese": "0d3a16fa37b20509",
  "bafs": "423eda3bdf9aa8b4",
  "ict": "bb2f7a41cf70393c",
  "economics": "bccf872f1a433dc4",
  "csd": "ec25f481d0b46d58",
  "chinese-history": "0bf4bd4a84037fa1",
  "history": "8a8b272f1a0c2a4d",
  "geography": "c1ec80b37986ec45",
  "chinese-literature": "fba3353ff66aa3ee",
  "english-literature": "f7a7deea15f0c24f",
  "ethics-religious": "30a87c2d49e618c8",
  "ths": "d2773cd7752d4e43",
  "health-management": "cfc1ae68bf9688df",
  "design-tech": "357caacef7e7af2b",
  "visual-arts": "6218b105e55f0cad",
  "music": "3a00286b8e71277b",
  "pe": "00a446296163e63e",
  "technology-living": "1853f5e8cb2d0d48"
}
