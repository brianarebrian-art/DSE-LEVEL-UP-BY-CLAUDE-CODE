# 部署與索引驗證清單

正式來源是 `https://www.dselevelup.com`，唯一 canonical origin 在 `lib/site.ts`。2026-10-22 基線 HTTP 請求確認：`http://dselevelup.com` 經兩次 308 到正式 HTTPS www；`http://www.dselevelup.com` 和 `https://dselevelup.com` 亦以 308 到正式來源。核心八頁均回應 200，未知路由回應 404。這些是基線結果，不能證明本輪 PR 已部署。

Vercel 專案為 `prj_CQRC5oit3FL5KrrmCaAXxqUugfYu`，team 為 `team_Zkq68StxxxCH0hT6GGh7mrg9`。基線 deployment 是 `dpl_BgDXhe8AJgDVuFPVnxEijCTbBEQw`，狀態 READY、target production。預覽網域有 Vercel SSO 保護，不應以受保護的預覽網址作 canonical、sitemap 或 Google 索引入口。

## 發布前檢查與停止條件

- [ ] 核對 GitHub PR 的實際 diff，保留登入、題庫 RNG／ID、學生私隱及免費原則。
- [ ] 在同一版本執行 `npm ci`、`npm run lint -- --max-warnings=0`、`npx tsc --noEmit`、`npm test`、`npm run qa` 和 `npm run build`，保存退出碼及測試數。
- [ ] 用 `npm run start -- -p 3001 -H 0.0.0.0` 啟動已建置版本，不能用 dev 的成功回應冒充 production-mode HTML。
- [ ] 執行下列 HTTP 驗證工具，另以真實瀏覽器檢查 390、768、1440 px 的閱讀、表格水平捲動、鍵盤焦點與對比。可存取性工具及實機測試結果須分開記錄。
- [ ] 四個編輯稿保持 `EDITORIAL_DRAFT_ROUTES` 及 noindex，AI 三頁保持 Blocked／noindex。只有全部門檻通過後才另做 release PR；不存在的生成 API不能靠移除 noindex 變成完成。
- [ ] 合併經核准的 PR 後，核對 Vercel production 的 commit SHA 與 PR merge SHA 一致，等待 READY，然後重新驗證正式 URL。

```bash
python3 scripts/seo/verify_responses.py \
  --origin http://127.0.0.1:3001 \
  --canonical-origin https://www.dselevelup.com \
  --routes docs/seo-verification-routes.json \
  --output /tmp/dse-local-production-seo

# 正式部署後才執行：
python3 scripts/seo/verify_responses.py \
  --origin https://www.dselevelup.com \
  --canonical-origin https://www.dselevelup.com \
  --routes docs/seo-verification-routes.json \
  --output /tmp/dse-production-seo
```

此工具用一般訪客、Googlebot 和 Twitterbot User-Agent 讀取原始 HTTP，不執行 JavaScript。偽裝 User-Agent 不是來自 Google 的真實檢索，也不是 URL Inspection；本機 production-mode、正式部署與 Google 索引是三個不同的驗證層。

## Search Console：BLOCKED

目前沒有本專案的 Search Console 資源權限、已登入工作階段或匯出數據。新頁面的索引狀態一律未知，不能宣稱已收錄；不使用空白搜尋結果判定未索引。[1]

需要資源擁有者提供已驗證的 `dselevelup.com` 網域資源，或 `https://www.dselevelup.com/` 網址前綴資源的適當權限。僅核對可提供 URL Inspection、Page indexing、Sitemaps 和 Performance 匯出；提交 sitemap／要求索引需要相應操作權限。若採服務帳戶，僅讀取用途給適當資源權限，不要將私鑰放進 repo、瀏覽器程式碼或訊息。

1. 到 Search Console 使用擁有本站資源的 Google 帳戶登入，從左上選擇 `dselevelup.com`。若資源不存在，新增「網域」資源並按 Google 提供的 TXT 記錄到 DNS 驗證；不能自行編造 TXT token。若無 DNS 權限，可新增 www HTTPS 網址前綴，使用頁面提供的實際驗證方法。
2. 確认資源範圍、已驗證狀態及「設定 → 使用者和權限」。保存資源名稱和日期，不公開驗證 token。
3. 打開「索引 → Sitemap」，輸入 `https://www.dselevelup.com/sitemap.xml`。提交後保存狀態、最後讀取日期、發現網址數；「成功」只代表 sitemap 可讀，不代表全數索引。
4. 逐頁在頂部輸入完整正式網址，先保存「Google 索引」結果，再按「測試線上網址」。記錄是否允許檢索、網頁擷取、是否允許索引、使用者指定 canonical、Google 選定 canonical、最後檢索時間。
5. 在「查看已測試的網頁」保存 HTML、截圖及資源錯誤；比對可見 H1、主要段落及 JSON-LD。Google 選定 canonical 是索引版本資訊，線上測試不能預測它。[1]
6. 對仍為 Draft／Blocked 的頁面，預期 noindex，**不要要求建立索引**。四個教學頁待 release gate 通過、移除 draft policy、加入 sitemap 後才要求索引；AI 生成器必須先有可驗證且符合專案政策的真正功能。
7. 對通過发布門檻且可索引的頁面，按「要求建立索引」。保存要求時間，不把排入佇列當作索引完成。後續查核已索引版本，若 Google 尚未檢索，保留未驗證狀態。

## 八個核心 URL 記錄

下表的可檢索只表示基線普通 HTTP 回應。canonical、schema 及行動體驗的本輪證據需在正式部署後填入，Google 索引結果現在均為 BLOCKED。

| URL | 可檢索 | 可索引 | Canonical | JSON-LD | 行動裝置可用性 | 問題 | 嚴重程度 | 修復狀態 |
|---|---|---|---|---|---|---|---|---|
| https://www.dselevelup.com/ | 基線 200 | BLOCKED：無 GSC | 指定 `/`，新版待 production 核對 | WebSite／Organization，新版待核對 | 新版待測 | 無本輪 production／GSC 證據 | P1 HIGH | Draft release |
| https://www.dselevelup.com/dse-maths | 基線 200 | BLOCKED：無 GSC | 指定自身，新版待核對 | BreadcrumbList，新版待核對 | 新版待測 | 修復 math slug；正式部署待核對 | P1 HIGH | Draft release |
| https://www.dselevelup.com/dse-maths/quadratic-equations | 基線 200 | 不允許：編輯稿 noindex | 指定自身，新版待核對 | Article／BreadcrumbList，新版待核對 | 新版待測 | 全品質門檻未通過不得發布 | P0 BLOCKER | Draft |
| https://www.dselevelup.com/dse-english | 基線 200 | BLOCKED：無 GSC | 指定自身，新版待核對 | BreadcrumbList，新版待核對 | 新版待測 | 修復 english slug；正式部署待核對 | P1 HIGH | Draft release |
| https://www.dselevelup.com/dse-english/writing-format | 基線 200 | 不允許：編輯稿 noindex | 指定自身，新版待核對 | Article／BreadcrumbList，新版待核對 | 新版待測 | 全品質門檻未通過不得發布 | P0 BLOCKER | Draft |
| https://www.dselevelup.com/ai/practice-generator | 基線 200 | 不允許：功能 Blocked | 指定自身，新版待核對 | 只可描述真實題庫應用，非不存在的生成器 | 新版待測 | 即時 AI 生成 API 缺失 | P0 BLOCKER | Blocked |
| https://www.dselevelup.com/ai/study-plan | 基線 200 | 不允許：功能 Blocked | 指定自身，新版待核對 | 手動指南 Article，非自動工具 | 新版待測 | 沒有 AI 計劃生成 | P0 BLOCKER | Blocked |
| https://www.dselevelup.com/ai/past-paper-explainer | 基線 200 | 不允許：功能 Blocked | 指定自身，新版待核對 | 拆題指南 Article，非上傳工具 | 新版待測 | 沒有試卷上傳或 AI 題解 | P0 BLOCKER | Blocked |

## Robots、canonical 與 structured data 通過標準

`/robots.txt` 必須回應 200 text/plain，只有一份實際來源，Sitemap 指向正式 www HTTPS；不阻擋 CSS／JavaScript／圖片。私人資料由權限保護，公開私人頁外殼以 meta robots 和 googlebot noindex 控制，不能依賴 Disallow 當成私隱保護。Google 要能抓取外殼才讀到 noindex。[2]

原始 production HTML 必須有單一 H1、獨特 title、單一 150–160 Unicode 字符 description、自身 canonical 及可見主要內容。schema 必須能 JSON parse，對應可見內容、無虛構評分及日期。用 Schema.org validator 檢查通用語法，再用 Google Rich Results Test 檢查 Google 支援的結果類型；WebApplication 語法有效不代表獲得 Google rich result。Article 未提供非必填欄位的警告不代表可以編造欄位。

手機檢查用真實 viewport 390×844，至少再核對 768 px 和 1440 px。正文不能跨出畫面，表格可在有提示的容器內水平捲動；鍵盤可到主要連結，有可見焦點；正常文字對比至少 4.5:1，大字 3:1。這是操作驗收，不把單次本機量測稱為實際 Core Web Vitals。

## References

[1]: https://support.google.com/webmasters/answer/9012289?hl=zh-Hant "Google Search Console 網址檢查工具"
[2]: https://developers.google.com/search/docs/crawling-indexing/block-indexing "Google noindex 與 robots 抓取限制"
[3]: https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=zh-tw "Google SEO 入門指南"

## 本輪已完成的本機production-mode驗證（不是正式部署／GSC）

本機程式版本完成全部品質閘及以下8核心URL驗證；前述正式站表仍只記基線／正式部署待核對，不能把本機結果填成Google索引結果。最終HTTP共112網址、336回應、0問題；30項視窗檢查0問題。

| URL | 本機HTTP | HTML索引政策 | Canonical | JSON-LD類型 | 390／768／1440px | Google索引／選定canonical |
|---|---|---|---|---|---|---|
| `https://www.dselevelup.com/` | 200 | 允許索引；非Google已收錄證據 | 自身；唯一 | WebSite／Organization／WebApplication／BreadcrumbList | 通過 | BLOCKED：無GSC權限／數據 |
| `https://www.dselevelup.com/dse-maths` | 200 | 允許索引；非Google已收錄證據 | 自身；唯一 | WebSite／Organization／WebApplication／BreadcrumbList | 通過 | BLOCKED：無GSC權限／數據 |
| `https://www.dselevelup.com/dse-maths/quadratic-equations` | 200 | noindex（預期） | 自身；唯一 | WebSite／Organization／WebApplication／BreadcrumbList／Article | 通過 | BLOCKED：無GSC權限／數據 |
| `https://www.dselevelup.com/dse-english` | 200 | 允許索引；非Google已收錄證據 | 自身；唯一 | WebSite／Organization／WebApplication／BreadcrumbList | 通過 | BLOCKED：無GSC權限／數據 |
| `https://www.dselevelup.com/dse-english/writing-format` | 200 | noindex（預期） | 自身；唯一 | WebSite／Organization／WebApplication／BreadcrumbList／Article | 通過 | BLOCKED：無GSC權限／數據 |
| `https://www.dselevelup.com/ai/practice-generator` | 200 | noindex（預期） | 自身；唯一 | WebSite／Organization／WebApplication／BreadcrumbList／Article／WebApplication | 通過 | BLOCKED：無GSC權限／數據 |
| `https://www.dselevelup.com/ai/study-plan` | 200 | noindex（預期） | 自身；唯一 | WebSite／Organization／WebApplication／BreadcrumbList／Article | 通過 | BLOCKED：無GSC權限／數據 |
| `https://www.dselevelup.com/ai/past-paper-explainer` | 200 | noindex（預期） | 自身；唯一 | WebSite／Organization／WebApplication／BreadcrumbList／Article | 通過 | BLOCKED：無GSC權限／數據 |

CI已接入同一HTTP檢查：`verify_responses.py --sitemap --strict`，並保存原始HTML artifact。完整證據見交付包`evidence/accepted-http`及`evidence/accepted-browser`；此处不把WebApplication語法、noindex或schema解析當作Google rich result。
