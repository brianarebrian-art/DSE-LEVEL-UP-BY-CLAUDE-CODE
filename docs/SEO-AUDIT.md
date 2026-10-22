# DSE Level Up SEO 審核報告

審核日期：2026-10-22。方法：檢查 GitHub repo 的 Next.js App Router 原始碼、公開路由宣告與 SEO 設定；未有正式站 Search Console 或 Lighthouse 數據，因此效能、實際索引量和搜尋成效標為「待部署後量度」，不把程式碼存在當成 Google 已索引的證據。

## 現況與風險

| 項目 | 現況 | 風險 / 判斷 | 優先級 |
|---|---|---|---|
| 可檢索內容 | `/subjects/[subject]`、`/notes/[subject]` 已有 server-rendered 課題摘要；新 SEO landing pages 已加入 | 個人化 dashboard、account、result 等不應進 sitemap | P0 |
| Sitemap | 已有 `app/sitemap.ts`，以實際 subject data 衍生，並排除不存在的逐題 URL | 需要把新公開內容頁加入同一來源，避免 orphan pages | P0 |
| Robots | 原有 `public/robots.txt` 已允許公開頁並禁止私密/後台；新增 `app/robots.ts` 作為 Next metadata 路由 | 上線後只保留一個產生來源，檢查回應不是重複或過時版本 | P0 |
| Canonical | `SITE_ORIGIN` 已集中在 `lib/site.ts`；部分頁面已有 canonical | 新頁面以 `createSeoMetadata` 統一 canonical、OG、Twitter | P0 |
| Title / description | 根 layout 有全站預設 metadata；部分舊頁面自行產生 metadata | 舊頁面仍要逐路由抽樣，確保不共用空泛 title；新頁面已獨立 | P0 |
| Heading | 既有 client-heavy 頁面有 SSR 內容補強；新頁面每頁一個 H1 | 上線前用 HTML 檢查所有公開 landing pages 的 H1 數量 | P1 |
| 語意 HTML | 新頁面使用 header/nav/main/article/section/ol/ul/a 等結構；舊頁面需逐頁檢查 | 不要用 hidden text 取代實際可讀內容 | P1 |
| 內部連結 | 新增 Breadcrumb、RelatedTopics、RelatedPastPapers、NextPrevChapter、InternalLinkCard | 內容地圖中的頁面要由首頁/科目頁在三次點擊內可達 | P0 |
| Structured data | 根 layout 已有 WebSite、Organization、WebApplication；新增頁面有 BreadcrumbList、Article/WebApplication | JSON-LD 必須與可見內容一致，部署後用 Rich Results Test 驗證 | P1 |
| 圖片 | 既有站使用 Next/Image 與 OG image；新文字內容不新增圖片需求 | 有意義圖片補 alt、描述性檔名及鄰近說明；裝飾圖用空 alt | P1 |
| 效能 / CWV | 既有 code 已優先使用 server/client 分離及 next/font；無正式站 field data | 以 mobile 75th percentile 監測 LCP ≤2.5s、INP ≤200ms、CLS ≤0.1；不要只看 Lighthouse | P1 |
| 搜尋意圖 landing pages | 原有 `/subjects`、`/notes`、`/practice`；新增 `/dse-maths`、`/dse-english`、主題頁及 AI 工具頁 | 其餘科目依 P0/P1/P2 內容地圖分批製作，避免大量薄內容 | P0 |

## 立即修復項目

1. 使用共用 `lib/seo.ts`，每個公開 landing page 宣告獨特 title、description、canonical、OG 和 Twitter metadata。
2. 保持 `SITE_ORIGIN` 單一來源；更新 sitemap 只納入真正存在、可讀、對學生有用的公開頁。
3. 把公開科目頁、主題頁、Past Paper 題解和 AI 工具頁互相連接，避免孤島頁；私密和個人化內容使用 `noindex` 或存取控制，不靠 robots.txt 保密。
4. 發布後在 Search Console 提交 `/sitemap.xml`，抽查首頁、兩個示範主題頁和一個 AI 頁的 URL Inspection。
5. 對內容建立編輯核對流程：課程範圍、解題步驟、日期、作者/來源、常見錯誤及內部連結，未核對的 AI 草稿不可批量發布。

## 原則對應

本實作以 Google 官方建議為準：內容先服務學生；使用學生自然會搜尋的詞語於 title、H1、alt 和 anchor text；連結必須可抓取；robots.txt 只管理抓取流量，不能當作 noindex；JSON-LD 只描述頁面上實際可見的內容；不使用 keyword stuffing、隱藏文字、購買連結或自動大量低質內容。

## 未能由 repo 證明的項目

正式索引數量、曝光、CTR、自然點擊、排名、註冊率、AI 工具使用率、手機 field CWV、404/5xx 和 canonical 選擇結果，都要在正式站接入 Search Console、分析工具和部署後爬蟲再量度。不要把 KPI 目標誤寫成保證排名。

## References

[1]: https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=zh-tw "搜尋引擎最佳化 SEO 入門指南"
[2]: https://developers.google.com/search/docs/essentials "Google Search Essentials"
[3]: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data "Introduction to structured data markup in Google Search"
[4]: https://developers.google.com/search/docs/crawling-indexing/robots/intro "Introduction to robots.txt"
[5]: https://developers.google.com/search/docs/appearance/title-link "Influencing your title links in search results"
[6]: https://web.dev/articles/vitals "Web Vitals"
