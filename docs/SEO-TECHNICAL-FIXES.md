# 技術 SEO 修復紀錄

基線為 `d25c63740a9184d0303e2558c8ee6f51643258d6`，修復分支為 `seo/truth-audit-quality-pages`。本文件記錄程式修復，不將本機建置、GitHub PR 或 HTTP 200 視為正式部署、Google 索引或搜尋成效。基線問題及 130 URL 清單見 `REPOSITORY-TRUTH-REPORT.md`；最終退出碼及 HTTP 結果見 `SEO-RELEASE-VALIDATION.md`。

## 問題、證據與修改

| 問題 | 基線證據 | 嚴重程度 | 修復與修改檔案 | 驗收標準 | 狀態與界限 |
|---|---|---|---|---|---|
| 兩個 robots 來源產生不同回應 | `public/robots.txt`、`app/robots.ts`；基線隔離與 production 回應不同 | P0 BLOCKER | 刪除靜態檔，只保留 `app/robots.ts`，sitemap 使用 `SITE_ORIGIN` | 唯一來源，200 text/plain，正式 HTTPS www sitemap；公開資源可抓取 | 程式修復；新版 production 回應待部署 |
| 把 Disallow 當成私人頁 noindex | 管理頁沒有明確 robots metadata；舊 named bots 規則不一致 | P1 HIGH | `lib/seoPolicy.ts`、`lib/seo.ts` 與各私人頁 metadata；保留 API Disallow | 私人外殼可讀 noindex，帳戶資料仍由原權限保護，不進 sitemap | 程式修復；noindex 不代替存取控制 |
| 尚未存在的 AI 功能被宣傳 | 17 個 API routes 沒有 prompt→新題、作文批改、學習計劃或試卷上傳 API | P0 BLOCKER | 重寫 `app/ai/*/page.tsx` 為題庫／手動規劃／原創拆題指南，整個 `/ai` noindex | 明確列不支援項目；CTA 指向真實流程；不編造示範結果 | 功能宣稱修復；真正 AI 工具仍 BLOCKED |
| 官方題目版權未核實 | 原內容地圖要求 Past Paper 題解，未有可公開重刊授權 | P0 BLOCKER | 新增 `/dse-maths/question-types/quadratic-discriminant`；不虛構年度卷題及 marking scheme | 原創題、完整驗算，清楚非官方；官方資源經 `ExternalLinkGate` | 已採使用者允許的題型解析替代；官方題解仍 BLOCKED |
| 廣告預留 UI 違反永久無廣告 | `AdSlot.tsx` 與不考之地分類／總覽引用 | P0 BLOCKER | 刪除元件與兩個引用；同步 `public/llms.txt` | 公開頁無廣告／贊助預留 UI，無死 import | 程式修復，不聲稱基線已有第三方廣告 |
| helper 只覆蓋八頁，21 sitemap URL 無 canonical | 基線原始 HTML 與頁面匯出清單 | P1 HIGH | `completeSeoMetadata()` 保留既有特殊 metadata，統一 canonical／OG／Twitter／noindex；所有有意義頁面及動態頁接入 | 原始 HTML 單一自身 canonical，社交 metadata 完整 | 程式修復；全 sitemap 回應驗證另列 |
| 大量動態摘要過短 | 初輪新版 97 sitemap URL 中 79 頁 description 未達本次 150–160 字符門檻 | P1 HIGH | 五種資料驅動 metadata 模板，詳見 `DYNAMIC-METADATA-REMEDIATION.md` | 所有有效資料實例自然、獨特 150–160 Unicode 字符，不截斷半句或加入關鍵字填充 | 最終原始 HTML 結果見驗收文件 |
| 科目入口錯誤 slug | 原連結使用 mathematics／english-language 等，不符有效資料 ID | P1 HIGH | 首頁、Maths、English 與五頁 CTA 改用 `math`／`english`／`physics` | 真實動態路由及 query 被現有練習流程識別 | 程式修復；source-level 內鏈無未解析目的地 |
| 隱藏 H1 與雙 H1 | `/practice` 僅 sr-only H1；`/notes/[subject]` 每頁兩個 H1 | P1 HIGH | 公開科目／筆記導覽改為可見正文；移除重複 client H1；私人練習外殼 noindex | 公開頁原始 HTML 恰一 H1，沒有以隱藏文字冒充主要內容 | 程式修復；私人純客戶端結果不當公開內容驗收 |
| 薄外殼與孤島頁列入 sitemap | capsule、relax、sensei、waiting 等初始內容或入口不足 | P1 HIGH | `shouldNoIndex()` 與 sitemap 共用政策；私人、測試、感謝、未完成頁排除 | sitemap 不含 noindex／Draft／Blocked，所有 loc 為正式有效 URL | 程式修復；不以加 sitemap 代替內容品質 |
| Cantonese 可索引場景未入 sitemap | 18 個公開 canonical 路由未列入 95 loc 基線 | P1 HIGH | `app/sitemap.ts` 從 `SCENE_IDS` 展開 16 場景，加總覽及學習方法 | 真實資料來源、200、自身 canonical、原入口仍在不考之地 | 程式修復；不改成 DSE 科目或首頁突出宣傳 |
| JSON-LD 不安全或與可見標題不同 | 未轉義 JSON.stringify script；四篇 Article headline 取自 SEO title而非可見 H1 | P1 HIGH | `serializeJsonLd()`、nonce `JsonLd` Server Component；舊 Article 支援 `visibleHeadline`；相關頁改安全输出 | JSON parse 正確，nonce符合回應 CSP，headline 與 H1一致，無虛構欄位 | 程式修復；Google Rich Results eligibility 未驗證 |
| 編輯頁與 AppShell 重複主要地標 | Chromium 顯示新教學頁兩個 main，且重複 main-content ID | P1 HIGH | AppShell 保留唯一 main，新教學頁內容使用 article／section | DOM 唯一 main-content ID，跳至主要內容可聚焦正確地標 | 最終瀏覽器結果見驗收文件 |
| 新頁未按原導航契約分類 | guard-nav 報 10 routes 未分類；兩個指南沒有真實入連 | P1 HIGH | `lib/pageOrder.ts` 明示不屬個人進度循環的理由；題庫指南連到手動規劃／拆題方法 | 原守門器通過，不改規則；每頁有真實入口及返回路徑 | 程式修復，不以假 href或豁免遮掩孤島 |
| ESLint 基線 29 warnings | `baseline-lint.log` | P1 HIGH | 移除死匯入／過時 disable，保留題庫 RNG／ID；CI `--max-warnings=0` | 全 repo 0 errors／0 warnings；題庫前後指紋一致 | 個別修復證據見 `LINT-BASELINE-REMEDIATION.md`；全站結果另列 |
| SEO 舊文件與內容地圖失真 | 80 rows、78 unique URL，僅9個實際唯一路由；Markdown分隔損壞 | P0 BLOCKER | 80 筆獨立審核 V2；明示 MERGE／DELETE／BLOCKED，舊文件標歷史；舊生成器改為 V2 校驗 | 80筆11欄、決策原因可追溯，沒有自動發布80頁 | 文件修復；P0 PUBLISH NOW／Published=0 |
| 寫死固定寬度表格與語言界線 | QA responsive／i18n 命中 | P1 HIGH | 讓表格欄位隨窄屏閱讀；教材標 zh-Hant，metadata使用合法固定語言標記，不變更 guard規則 | 390／768／1440 視窗無正文溢出；固定教材不得假稱全文隨英文 UI切換 | 最終結果及限制另列 |
| token 文件已過時 | 原 `docs/tokens.md` 少6個現有 CSS block | P2 MEDIUM | 用既有 `scripts/gen-token-doc.mjs` 重生成 | `--check` 通過，未改配色或 CSS | 文件修復 |

## 五頁交付邊界

四篇教學內容包括二次方程、英文四文體、原創判別式題型及物理運動方程，具完整例題與訂正方法。第五篇是「AI 生成個人化 DSE 練習題」網址下的誠實題庫使用指南。它不是已實作的 AI 生成器。英文 CTA為寫作自評，物理 CTA為現有題庫，SENSEI為零模型知識卡檢索，均不得描述成即時生成／作文機評。

四篇維持 `EDITORIAL_DRAFT_ROUTES`，三個 AI 指南維持 `/ai` noindex。完整手機與本機 HTML 通過亦不能取消尚未完成的正式部署 gate。解除 noindex需另做 release PR，先核對正式 SHA與完整品質門檻；真正 AI 生成還需產品／憲章批准的實作決策。

## 尚未驗證與停止條件

Search Console 資源權限、Google 選定 canonical、Google索引、Rich Results、實際 Core Web Vitals、自然點擊／曝光／CTR、CTA analytics及持續排程均不由本次程式碼證明。精確所需權限、操作及通過標準在 `DEPLOYMENT-INDEXING-CHECKLIST.md` 和 `SEO-MONITORING-PLAN.md`。沒有資料填 BLOCKED，不填0，也不寫排名提升。

Google指南要求準確且有用的頁面摘要，不保證使用 meta description，也沒有把150–160字列為排名成功條件；該字符範圍是使用者本次編輯門檻。[1] `robots.txt`抓取封鎖不等於 noindex，更不代替保護私人資料；讓公開外殼可抓取，才能讀取noindex。[2]

## References

[1]: https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=zh-tw "Google SEO 入門指南"
[2]: https://developers.google.com/search/docs/crawling-indexing/block-indexing "Google noindex 與抓取限制"
[3]: https://support.google.com/webmasters/answer/9012289?hl=zh-Hant "Google Search Console 網址檢查工具"

## 最後跨頁schema覆蓋檢查

最後驗收另發現：舊Server wrappers的13頁及不考之地10個分類頁雖然有全站WebSite／Organization，卻沒有內容麵包屑。現已補上可見 `PageBreadcrumb`／既有 `Breadcrumb`，使用實際頁面名稱與存在的路由；首頁亦輸出自身單項麵包屑。這不是以全站schema冒充每頁schema，所有script沿用同一安全序列化與CSP nonce。

25個有效學科筆記實例改為 `TechArticle`，headline取自相同可見H1，保留資源用途與免費資訊，不編造日期或評分。HTTP驗證工具現在明確要求公開內容有BreadcrumbList、`/notes/*`有TechArticle，並驗證response CSP nonce；文章headline也必須對應真正H1。

初輪的3個canonical誤報源於HTTP工具將sitemap首頁的空pathname與 `/`列作兩個URL；不是正式網站多輸出canonical。工具已正規化並去重，後續檢查對唯一實際URL執行。
