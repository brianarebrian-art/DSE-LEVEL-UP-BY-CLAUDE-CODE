# SEO 網站架構與上線流程

本文件取代 d25c637 的規劃表述。路由存在、內容完成、正式部署、Google 索引是分開的狀態，不能互相推論。完整基線在 `REPOSITORY-TRUTH-REPORT.md`，當前改動及門檻在 `SEO-TECHNICAL-FIXES.md`。

## 真實路由與主要連結

首頁 → `/dse-maths` → `/dse-maths/quadratic-equations` → `/dse-maths/question-types/quadratic-discriminant`。Maths hub 與概念頁亦連到真實 `/subjects/math`、`/notes/math`；不是 `mathematics`。

首頁 → `/dse-english` → `/dse-english/writing-format`。寫作指南連到 `/writing` 的自評、`/notes/english` 的課題筆記及 `/reading`；不是 `english-language`，也不是不存在的 `/ai/essay-feedback`。

理科本輪只新增 `/dse-physics/motion-equations`，由數學概念頁及真正 `/subjects/physics` 連入；沒有新增 `/dse-physics` hub 冒充完成。四個教學稿保留 noindex 並排除 sitemap，直至全部發布門檻通過。

`/ai/practice-generator`、`/ai/study-plan`、`/ai/past-paper-explainer` 存在，但即時生成器、自動學習計劃及試卷上傳題解 API 不存在。三頁只提供真實使用指南／限制，維持 Blocked、noindex、不進 sitemap。現有題庫抽題並不等於 prompt-to-question AI 生成。

`/dse-chinese`、`/dse-biology`、`/dse-chemistry`、`/dse-economics`、`/dse-bafs`、`/past-papers` 及 `/ai/essay-feedback` 是舊提案中的未實作路徑，不可用作主要 CTA。是否保留的決策以 V2 清單為準。

私人、帳戶、後台、測試及個人化練習外殼以共同 `seoPolicy` 禁止索引及排除 sitemap，實際私隱仍由身份／權限保護。`robots.ts` 只封鎖 `/api/` 抓取，讓 Google 能讀到頁面 noindex；靜態重複 robots 已移除。

## URL 與內容模式

使用穩定、小寫、描述性的路徑；query 參數用作狀態或選題，不替每個參數建立薄內容索引頁。只有真正得到可公開使用的原題並實作相應題解，才使用帶年份／試卷／題號的 URL。本輪版權 fallback 使用「題型解析」，不虛構官方題號。

教學頁從學習目標開始，解釋規則與適用條件，再給完整原創例題、驗算、常見錯誤、相關概念及真實工具入口。文體頁以讀者、目的、語氣、段落與大綱比較。AI 狀態指南必須先說明功能現況，再列實際可完成的操作；不是純行銷。

`Breadcrumb`、`InternalLinkCard` 與 `JsonLd` 是可重用元件。JSON-LD 使用安全序列化及現有 CSP nonce；Article headline 必須與可見 H1 相同。不能因 validator 警告而編造作者、日期、評價或價格。

## 發布與維護

正式 www HTTPS、redirect、metadata、原始 HTML、手機、lint、build 及 URL Inspection 的精確操作在 `DEPLOYMENT-INDEXING-CHECKLIST.md`。無 Search Console 權限時保持 BLOCKED，不把本機檢查算成 Google 索引。

每週／每月數據來源、KPI 與未達標行動在 `SEO-MONITORING-PLAN.md`。尚未取得 GSC 資料與排程的文件方案不是已運作監測系統。頁面數量不是 KPI 成效，不批量發布 80 個模板頁。

## References

[1]: https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=zh-tw "Google SEO 入門指南"
[2]: https://developers.google.com/search/docs/crawling-indexing/block-indexing "Google noindex 與抓取限制"
