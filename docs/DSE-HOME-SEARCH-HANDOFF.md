# DSE Level Up — 專屬首頁與搜尋設定交接

## 範圍與審核

此版本是現有 DSE Level Up 的漸進補強，不是公司官網模板。以 `fix/pr-ci-root-causes` 為基礎，先保留既有 CI 修復；草稿 PR 不代表批准正式上線。新增標題、摘要、學習入口及問答皆為編輯稿，須由創辦人覆核。FAQ 按現有功能與政策編寫，不聲稱來自學生訪談。

不改登入、題庫、資料庫、價格、現有內容審核閘或索引政策；不加入外部 SDK、付費 API、虛構評價、學生人數或升級保證。原先獨立示範站不會匯入。

## 資訊架構與搜尋意圖

| 入口 | 真實用途 | query cluster（未驗證搜尋量） |
| --- | --- | --- |
| `/` → `/subjects` → `/practice?subject=…` | 原創改寫練習；首次一節試用後 Google 登入 | DSE 免費練習、HKDSE 溫習平台 |
| `/dse-maths` → 筆記與原創例題 | 數學解題步驟 | DSE Maths、二次方程、判別式 |
| `/dse-english` → `/writing`、`/reading` | 英文閱讀與寫作自評，不是 AI 評分 | DSE English、英文作文格式、寫作自評 |
| `/methodology`、`/transparency`、`/trust` | 題目來源、限制及核對方式 | 題庫來源、平台可信度 |
| `/about`、`/feedback`、`/privacy`、`/terms` | 平台資訊、回報及政策 | DSE Level Up 品牌查詢 |

沿用既有柔和 Morandi tokens、貓頭鷹、鍵盤焦點與 SEN 支援。首頁單一 H1，核心科目 CTA 仍直接進入練習。新增三張學習卡與可用鍵盤開合的原生 details FAQ。正文及 FAQ 會出現在伺服器 HTML，不需要爬蟲執行 JavaScript；語言切換沿用現有 locale context，沒有憑空加入不存在的語言 URL 或 hreflang。

編輯位置：`lib/homeContent.ts`（雙語簡介、學習卡及 FAQ）、`app/HomePageClient.tsx`（標題與排版）。首頁伺服器 JSON-LD 使用同一 FAQ 清單，並沿用 CSP nonce／安全序列化。FAQ 結構化資料不保證 Google 顯示 rich results 或 AI 引用。

## SEO / GEO / AEO 適用性

既有 `lib/seo.ts` 提供每頁 metadata、canonical、OG、Twitter；`app/sitemap.ts` 與 `app/robots.ts` 沿用原有公開頁清單及 noindex 審核規則，不為 SEO 重建重複頁。

本地搜尋以「香港 DSE、zh-HK、真實科目內容」為主。這是網上學習平台，並無已確認實體補習中心，因此不套用 LocalBusiness、不虛構地址、營業時間、地區分店或地圖。保留既有 Organization／WebApplication 與官方社交帳戶。

## Google Search Console

參考：[Google 驗證說明](https://support.google.com/webmasters/answer/9008080?hl=en)、[Next.js metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)。

1. 用你自己的 Google 帳戶新增資源。優先考慮 `dselevelup.com` Domain property：用 DNS TXT 驗證，可涵蓋子網域和不同協定。DNS 主機商及現有驗證狀態須按當時實況確認，不沿用舊文件中的假設。
2. 或新增 URL-prefix property：`https://www.dselevelup.com/`，選 HTML tag。你自行設定 `NEXT_PUBLIC_GSC_VERIFICATION_TOKEN` 為 Google 提供的 **content 值**，不要填整段 HTML，也不要貼到聊天。
3. 此值是最終網站公開的擁有權證明，不是 Google OAuth client secret。缺省或全空白時不輸出任何假 token；在 Vercel 正式環境設定後需重新部署。本次未改遠端環境變數或 DNS。
4. 部署後確認首頁原始碼的 head 含 `google-site-verification`，首頁不能要求登入，再回 GSC 按 Verify。Domain property 不能用 HTML tag 驗證。
5. HTML file 替代方案：下載 Google 提供的原始 `google實際代碼.html`，原名原內容放在 `public/`，提交部署後確認根目錄 URL 直接回應該檔；不要建立假的示範驗證檔。保留驗證檔／tag／TXT，避免失去驗證。
6. 成功後提交 `https://www.dselevelup.com/sitemap.xml`。檢查首頁、科目入口、Maths／English hub；不要要求索引個人進度、作答外殼或仍受編輯閘保護的 noindex 草稿。
7. 在 GSC 觀察索引、選定 canonical、曝光與點擊；沿用 `docs/SEO-MONITORING-PLAN.md` 及 `docs/seo-monitoring-log.md`。驗證、schema 或 sitemap 200 都不等於已收錄、排名提高或監測已啟用。

舊 `docs/search-console-steps-2026-10-09.md` 的登入章節早於目前 Supabase Auth 棧，**不要依其 Auth.js／NEXTAUTH_URL 指引修改登入**。此工作不處理登入設定。

### 日後 Site Verification API 整合位置

目前只有 metadata 支援，沒有自動呼叫 API。若另行批准自動化，可在 server-only adapter（例如 `lib/server/googleSiteVerification.ts`）接入：由擁有人 OAuth 2.0 授權 → 取得驗證資料 → 放置 token → API 確認擁有權。OAuth 憑證須保留在伺服器端安全儲存、不得用 NEXT_PUBLIC 前綴；加入 CSRF/state、最小權限及撤銷機制。實作前核對 Google 最新文件，不把預留位置當成已完成整合。

## 上線前 SEO / GEO / AEO checklist

- [ ] 創辦人核實新增雙語簡介、CTA、首次一節試用政策、FAQ 與功能一致。
- [ ] 不含示範品牌、placeholder-domain.com、虛構見證或數字；官方地址／電話若不存在則不新增。
- [ ] 核對 title、description、self-canonical、OG 圖、唯一 H1、內部連結及 FAQ JSON-LD 與可見文字一致。
- [ ] 四種寬度 360／768／1024／1440px 驗收；鍵盤、對比、reduced-motion、深淺主題與英文切換。
- [ ] 檢查首次訪客練習入口及既有 Google 登入流程；不把 CTA 連結測試說成已驗證完整 OAuth。
- [ ] 真實 URL 跑 Lighthouse／Rich Results Test；有足夠流量後監測 field Core Web Vitals。
- [ ] GSC 由擁有人驗證、提交 sitemap、檢查重要公開頁；維持個人頁及編輯草稿原有索引政策。
- [ ] 只有實際符合資格的實體業務才考慮 Google Business Profile；本次不建立虛構地點。
- [ ] 記錄驗證的 commit／deployment／日期；合併前確認相依 CI PR 的處理次序。

## 本次交付的驗證界線

本機通過 1,560 個測試、全部 13 個 QA 子閘、ESLint、TypeScript、secret scan 及 production dependency audit（0 vulnerabilities）。4 GiB sandbox 的 production build 在預設 heap 達上限，使用 3072／2560 MiB heap 後仍被系統終止；沒有把它記作通過。已另行批准以草稿 PR 的遠端 CI／Preview 完成 production build 驗收，不修改或略過任何檢查。最終遠端結果與瀏覽器覆核以 PR 描述為準。
