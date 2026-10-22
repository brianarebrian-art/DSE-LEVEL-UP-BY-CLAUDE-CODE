# SEO 長期監測方案

Search Console 成效與索引資料目前為 BLOCKED；沒有可用的真實基線數據。此文件建立監測流程，不宣稱已啟動自動排程、已索引、流量增加或排名改善。每個數字都必須附資源、日期區間、篩選條件及原始匯出，資料缺失填 `BLOCKED`，不是 0。

**可填日誌模板：** [`docs/seo-monitoring-log.md`](seo-monitoring-log.md)。創辦人 GSC 步驟：[`docs/search-console-steps-2026-10-09.md`](search-console-steps-2026-10-09.md)。教學稿解禁閘：[`docs/EDITORIAL-PUBLISH-GATE.md`](EDITORIAL-PUBLISH-GATE.md)。本機 schema 抽查：`python3 scripts/seo/verify_rich_results.py`（唔等於 Google Rich Results 合格）。

監測責任由網站維護者及內容負責人承接。建議每週固定一個工作日處理技術異常，每月同日分析內容機會；開始日 T0 是本輪正式 release 完成並保存權限及基線的日期，不是文件撰寫日。未選擇負責人與未取得資料權限前，不把文件計劃當成已運作的監測系統。

## 每週檢查

| 項目 | 操作及數據來源 | 可核對的異常條件 | 未達標行動 |
|---|---|---|---|
| 索引錯誤 | Search Console「網頁索引」匯出原因與 URL；將 Draft／Blocked 排除於應索引名單 | 正式可索引 canonical 頁出現 noindex、404、5xx、伺服器錯誤或不預期重複 | P0：錯誤索引控制／私人資料；P1：正式內容抓取失敗。修復後用線上測試核對 |
| Sitemap | 保存成功狀態、最後讀取日期、發現 URL 數；HTTP 讀取正式 sitemap 並比對程式政策 | 不能讀取、非正式網域、重複或列入私人／未完成頁 | 修復來源、部署或政策；重提正確 sitemap，不反覆提交同一失敗檔 |
| 已索引頁面數量 | 記錄可索引 canonical 名單中實際在 Google 索引的 URL，而非 sitemap URL 總數 | 宣傳為 Published 但沒有索引記錄；或新頁仍未被抓取 | 查內部連結、canonical、抓取及內容；保留真正原因，不預測索引日期 |
| 新曝光 query | Performance 搜尋類型 Web；匯出最近 7 日與前 7 日 query，另看香港篩選 | 新 query 與頁面意圖不符，或把不同 filter 的數字混比 | 找正確 landing page，修正題意不符內容；不按每個 query 建 doorway page |
| 高曝光低 CTR | 保存每頁 clicks、impressions 及 CTR；僅對至少 100 曝光的頁作初步排查 | CTR 低於該頁可比較的前四週基線，且查詢組合／位置改變需一起檢視 | 核對 title 與內容是否準確滿足意圖；改一項並記錄日期，不能直接宣稱改動帶来提升 |
| 零曝光頁面 | 對正式公開的可索引 URL 逐頁核對；資料取得後才可填 0 | 自 release 起 28 日仍無可見曝光資料 | 先確認已索引與統計 filter；再查內容深度與內部入口。數據缺失不是零曝光 |
| Core Web Vitals | Search Console CWV 報告及 PageSpeed Insights／CrUX 可用數據，手機與桌面分開 | 欄位資料顯示 Poor，或同群組從 Good 變差 | 先找實際 LCP／INP／CLS 問題及頁群；本機 Lighthouse 只供診斷，不冒充欄位資料 |
| HTTP 與內部連結 | `scripts/seo/verify_responses.py` 及正式 sitemap URL；一般訪客／Googlebot／Twitterbot 回應 | 狀態錯誤、canonical 漂移、H1 重複、schema parse／nonce 錯誤、導向不存在頁 | 提交可覆核修復 PR；不在 production 寫入學生資料做測試 |

100 曝光只是工作排序樣本門檻，不是 Google 或成功率標準。CTR 用 `clicks / impressions × 100%` 計算，不能平均各頁 CTR 代替總 CTR。若 Search Console 隱藏低量 query，query 明細和總數可能不相等；不要自行補出被隱藏查詢。

## 每月檢查

保存最近完整 28 日與前 28 日的 clicks、impressions、CTR；相同搜尋類型、國家與裝置 filter 才能比较。需要考慮 DSE 考期季節性；有去年同期資料再列同比，沒有則填未取得。平均排名若使用，必須保留 Google 的欄位定義，不將它當作每位學生看到的固定名次。

| 項目 | 月度決策 |
|---|---|
| 自然搜尋點擊、曝光與 CTR 趨勢 | 列實際數值、日期區間和變動，不把觀察到的差異直接歸因本輪 SEO |
| Top landing pages | 按 canonical 頁的 clicks 及 impressions 排序；核對落地頁是否有可操作例子、步驟及真實 CTA |
| Top queries | 按曝光及點擊分組學生意圖；標記重複、偏題或缺少內容，不按長尾字詞批量新增頁 |
| 內容更新機會 | 先更新錯誤公式、過時考綱、不可用工具及低價值重複內容，再考慮新頁 |
| 新 P0／P1 優先級 | 使用內容地圖 V2，以實際 query、學生需求、來源與可完成深度決定；沒有資料注明假設，不捏造需求量 |
| 內部連結與孤島頁 | 從首頁、科目入口及 sitemap 列出連入／連出；公開內容至少有相關入口；私人頁不是應公開的孤島 |

## KPI 與行動

這些是驗收及監測目標，不是對搜尋流量或索引時程的預測。若正式 release 延後，天數從实际 T0 起算。

| 時間 | 指標 | 驗收標準 | 數據來源 | 未達標行動 |
|---|---|---|---|---|
| 30 天 | 八個核心頁通過 URL Inspection | 8/8 的適當狀態已記錄；Draft／Blocked 的不通過原因逐頁列明，不能算索引成功 | Search Console 即時及 Google 索引版本 | 修復技術問題；工具缺失保持 Blocked，取得權限 |
| 30 天 | 五個 P0 頁面正式上線 | 5/5 完成全部品質門檻；官方題解以授權或允許的非官方題型解析替代；生成器未實作不能算完成 | GitHub、正式 HTML、頁面門檻記錄 | 完成剩餘內容／手機／部署；生成器先處理政策與真實實作阻礙 |
| 30 天 | 開始出現自然搜尋曝光 | 提供真實 Search Console 數據；有或沒有均如實記錄，不保證出現 | Search Console Performance | 先確認索引，再檢查內容及內部連結 |
| 60 天 | 核心內容頁逐步被索引 | 列出真正索引 URL 與數量，以及未索引原因 | Search Console Page indexing／URL Inspection | 查 sitemap、canonical、抓取及內容品質；不把發現 URL 数当作索引数 |
| 60 天 | 相關 query 產生曝光 | 提供實際 query 明細或明確無可見資料 | Search Console | 改善 title／description／內容意圖，不建立低質重複頁 |
| 90 天 | 自然搜尋點擊與 CTR | 提供可比較日期區間的實際趨勢及具體改善行動，不承諾上升百分比 | Search Console | 查低 CTR 頁的查詢組合、位置及摘要，記錄修改 |
| 90 天 | 內容頁導向真實學習工具 | 追蹤已支援 CTA 的 clicks；未支援 AI 生成入口不得包裝為工具轉化 | Analytics 的已驗證事件／Vercel 實際支援能力 | 先確認事件可用、私隱及權限，再優化 CTA；不能用 page views 代替 CTA clicks |

## 權限、事件與自動化狀態

| 能力 | 現況 | 要求與替代方式 |
|---|---|---|
| Search Console 每週／每月數據 | BLOCKED：未提供本資源權限或匯出 | 擁有者按部署清單提供合適權限，或定期匯出報表。不能從普通網站 HTTP 得到 clicks／impressions |
| 已索引版本 URL Inspection API | BLOCKED：未配置資源授權 | API 資料不等於即時測試；實際線上測試需在 Search Console 操作 |
| Vercel 部署狀態 | 已連接，僅核實本次查到的 deployment | Git SHA 和 READY 是部署證據，不是搜尋成效 |
| CTA 點擊事件 | BLOCKED：只有基線 script 載入程式碼，未驗證事件或後台數據 | 確認實際 Vercel Analytics 方案能力／事件授權；沒有事件就填未取得，不假設套餐或計费 |
| 持續排程 | 未建立，文件不等於已運作系統 | 確定負責人、資源及資料權限後，可使用應用原生 CI／明確授權的 Manus ScheduleTask；不以暫存 sandbox background loop 冒充長期服務 |

目前 GitHub PR CI 可在每次變更阻擋 lint／test／QA／build 問題，屬程式回歸門檻，不是已啟動的 Search Console 監測。正式 HTTP 抓取可以用有限的唯讀工作執行；週期性後台分析待權限與排程確定後才標為運作。

## 紀錄模板

每次執行建立 `日期／資源／來源／查詢日期區間／filter／數據檔案／問題／嚴重程度／行動／負責人／下次覆檢日` 的紀錄。P0 是私人資料曝露、錯誤禁止正式內容索引或大範圍正式內容不可用；P1 是個別正式頁抓取、canonical、主要內容或工具宣稱錯誤。任何修復狀態都附 commit 和對應證據，不用「基本正常」。

## References

[1]: https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=zh-tw "Google SEO 入門指南"
[2]: https://support.google.com/webmasters/answer/9012289?hl=zh-Hant "Search Console 網址檢查工具"
[3]: https://developers.google.com/search/docs/appearance/core-web-vitals "Google 搜尋與 Core Web Vitals"

## 本輪原生CI補強

`.github/workflows/ci.yml` 已在build後啟動production-mode服務，以 `verify_responses.py --sitemap --strict` 對sitemap與指定Draft／404案例執行訪客、Googlebot、社交User-Agent的原始HTML回歸檢查，並保存artifact。它包含canonical、description、H1、社交metadata、Breadcrumb、筆記TechArticle、nonce及noindex政策；不是Google實際爬蟲，也不提供Google選定canonical。

這是已交付的CI設定。遠端GitHub Actions是否通過須看PR的實際run，不能用本機相同命令通過冒充远端CI綠燈。每週／每月Search Console監測仍未啟用；它需要資源授權與明確排程，與PR觸發的程式回歸檢查不同。
