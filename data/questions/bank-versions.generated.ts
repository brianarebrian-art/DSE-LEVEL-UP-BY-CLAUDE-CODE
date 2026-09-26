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
  "m2": "0910f57d18242251",
  "m1": "dc059e526ca5422f",
  "physics": "3a2f243ba5726470",
  "chemistry": "a66238fb22943e24",
  "biology": "bd96d5708c024f6a",
  "english": "7ac918865e3f4784",
  "chinese": "83ff6087ab2d58bf",
  "bafs": "ddfc4a6609d81dcc",
  "ict": "bb2f7a41cf70393c",
  "economics": "b62cce21ebead269",
  "csd": "00bd603385de67e2",
  "chinese-history": "3913c873ced256ac",
  "history": "8a8b272f1a0c2a4d",
  "geography": "e3f5b6180b0ad2dc",
  "chinese-literature": "fba3353ff66aa3ee",
  "english-literature": "fb0d11dbd2fdd27a",
  "ethics-religious": "bf9e8797ed27a2de",
  "ths": "d2773cd7752d4e43",
  "health-management": "cfc1ae68bf9688df",
  "design-tech": "64fef62b093109a5",
  "visual-arts": "6218b105e55f0cad",
  "music": "3a00286b8e71277b",
  "pe": "00a446296163e63e",
  "technology-living": "1853f5e8cb2d0d48"
}
