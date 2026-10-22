# 本輪 SEO 實作範圍

審核基線是 `main` 的 `d25c63740a9184d0303e2558c8ee6f51643258d6`，日期為 2026-10-22。本輪使用獨立分支 `seo/truth-audit-quality-pages`，不直接合併到正式 main。使用者的附件已授權由零審核及按結果修復；不改變登入 backend、用戶資料存取邊界、題庫計分、付費政策或資料庫。

## 已核實的主要影響

`/dse-maths` 和二次方程頁使用不存在的 `mathematics` slug，實際科目 ID 是 `math`。English 筆記使用不存在的 `english-language` slug，實際 ID 是 `english`。`app/robots.ts` 與 `public/robots.txt` 並存，隔離基線與正式回應顯示不同規則，不能只看 repository 檔案存在就推定服務來源。基線 ESLint 有 0 errors、29 warnings，因此不能通過使用者要求的 0 warnings 品質門檻。

AI 工具宣傳頁沒有對應的即時生成 API。既有練習是題庫抽題、批改選擇題及書寫題自評；本輪不能把它描述為任意 prompt 生成或 AI 作文評分。生成器頁將完整交付使用及功能限制說明，但功能狀態為 Blocked，不能標為 Published。沒有原題轉載權證據，第三頁使用附件明確允許的原創「題型解析」替代，不虚構年份、卷號或官方 marking scheme。

## 程式結構與責任

`app/` 保留既有 Next.js App Router；五個重點頁使用 Server Components 與現有設計 tokens。`lib/seo.ts` 負責 canonical、Open Graph 與 Twitter metadata；`components/Seo/JsonLd.tsx` 沿用 CSP nonce，`lib/structuredData.ts` 安全序列化。`docs/` 保存基線真實狀態、逐頁內容決策、部署與索引操作，以及未完成門檻。`scripts/` 的技術驗證只發送讀取請求，不寫入學生帳戶或資料庫。

## Google 官方依據

Google 指南要求實用、原創、可靠內容及描述性連結；沒有「字數越多排名越高」或單一 H1 數量的 Google 排名門檻。本輪單一 H1 與 150–160 字符 description 是使用者的編輯驗收要求，不是排名保證。[1]

`robots.txt` 的 Disallow 不是禁止索引或資料安全機制。Google 必須能抓取頁面，才能讀到 noindex。公開的帳戶外殼可用 noindex；真正的私人資料必須仍受身份與權限保護。[2]

URL Inspection 的線上測試不是已索引證據，也不能預測 Google 最終選定的 canonical。需分別保存即時可抓取結果及已索引版本結果。沒有 Search Console 權限或輸出資料時，索引、排名、曝光、CTR 及搜尋流量一律未驗證。[3]

## References

[1]: https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=zh-tw "Google 搜尋引擎最佳化入門指南"
[2]: https://developers.google.com/search/docs/crawling-indexing/block-indexing "Google 使用 noindex 禁止索引"
[3]: https://support.google.com/webmasters/answer/9012289?hl=zh-Hant "Search Console 網址檢查工具"
