# UI 語言與語意修復

## 已實作

- `app/admin/quality/QualityReviewClient.tsx` 使用既有 `useLocale()`，評分項目、覆核階段、角色、篩選器、按鈕、錯誤、儲存提示及空狀態都由真實繁中／英語字串按 locale選擇；helper元件收到locale，科目使用既有name／nameEn。
- `app/credits/page.tsx` 是Server Component，以完整、可見中英對照呈現公開致謝、貢獻、限制和免責聲明；沒有假裝其內容隨 locale 切換。離站確認仍由 `ExternalLinkGate` 負責。
- `/admin` 的新增覆核入口使用實際中英並列；兩個管理路由只對固定搜尋 metadata加明確語言註記。
- 首頁學習導航與共用 SEO導覽使用真實靜態雙語；編輯教材仍以 `lang="zh-Hant"` 劃界，英語例句以 `lang="en"`標示。
- 管理品質及致謝頁內容使用 section，沿用 `AppShell`唯一main，不再增加巢狀main或重複main-content ID。

## 未改動

沒有改動管理權限、審核者角色政策、API路徑、DB欄位、審核提交payload、決策值、批准條件或題庫發布流程。沒有登入管理頁或提交覆核決定。管理頁仍noindex且受既有存取控制保護，noindex不取代權限。

i18n守門器規則沒有改動。metadata語言註記不適用於客戶端互動控制；中英並列註記僅用於真的有兩种語言的顯示內容。守門器零命中不等於整站或所有教材完成全文英文翻譯。

## 驗證

全站最終 `npm run qa`、TypeScript、ESLint及完整測試結果見 `SEO-RELEASE-VALIDATION.md`。不能把中途的局部通過當成最終整站成功。
