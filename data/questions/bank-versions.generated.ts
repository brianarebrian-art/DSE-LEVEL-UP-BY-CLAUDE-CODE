// ⚠️ 本檔由 scripts/gen-question-summary.mts 產生 —— 請勿手動修改。
// 重新產生：npm run gen:summary
// 迴歸鎖：data/questions/__tests__/summary-parity.test.mts
//
// 每科題庫內容的雜湊，算法見 scripts/qbank/bank-version.mts（與 sync-questions.mts 共用）。
// 瀏覽器只會在雲端版本號與此處一致時使用 Supabase 副本，否則使用隨網站一併建置的題庫。
// 原因：2026-09-25 發現雲端副本停留於 09-05，比 repo 少 1,117 條，而學生一直在做舊版本。

/** 科目 id → 題庫內容版本號（與 Supabase question_bank_versions.version 同一算法）。 */
export const BANK_VERSION: Record<string, string> = {
  "math": "011144b099cb8960",
  "m2": "de75d6f694f0c506",
  "m1": "412341e19c83ae85",
  "physics": "6f36e2630778be40",
  "chemistry": "a66238fb22943e24",
  "biology": "ef7363b0127fd008",
  "english": "58c6898ca40e1597",
  "chinese": "cfa2fd972b82aee7",
  "bafs": "58e17aa0481d747c",
  "ict": "bb2f7a41cf70393c",
  "economics": "32060ce53af546ef",
  "csd": "38e4803d800584de",
  "chinese-history": "f866a5e0a0b380f9",
  "history": "8a8b272f1a0c2a4d",
  "geography": "bcd7397ba6038f7b",
  "chinese-literature": "1e6bd824816cacf0",
  "english-literature": "67c6c380d32d077f",
  "ethics-religious": "82141aff753817fc",
  "ths": "d2773cd7752d4e43",
  "health-management": "3be3105b129e1764",
  "design-tech": "43c3f9b03904749d",
  "visual-arts": "6218b105e55f0cad",
  "music": "8d5bc04d34b4de18",
  "pe": "c5a9d00ae6399af2",
  "technology-living": "0c15e75207cf67d8"
}
