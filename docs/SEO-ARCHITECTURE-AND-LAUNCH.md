# SEO 網站架構與上線流程

## 路由層級

- `/`：平台首頁；連到 `/subjects`、主要科目頁及 AI 工具。
- `/dse-maths`、`/dse-english`、`/dse-chinese`、`/dse-biology`、`/dse-chemistry`、`/dse-physics`、`/dse-economics`、`/dse-bafs`：科目支柱頁；每頁連到主題、練習及 Past Paper。
- `/dse-maths/quadratic-equations`、`/dse-english/writing-format`：可獨立排名的主題筆記頁；由科目頁、相關內容卡和 Breadcrumb 到達。
- `/past-papers`：按科目、年份、Paper、題號組織的題解索引；真正有內容的題解才進 sitemap。
- `/ai/practice-generator`、`/ai/study-plan`、`/ai/past-paper-explainer`、`/ai/essay-feedback`：工具 landing pages；連回具體學習內容，避免工具頁成為孤島。
- `/account`、`/dashboard`、`/result`、`/admin`、`/api`：私人、個人化或系統路由；不進 sitemap，並按需要使用 noindex/存取控制。

## Parent / child 及三次點擊原則

首頁 → 科目支柱頁 → 主題筆記頁，是公開主題頁的主要路徑。科目頁內有熱門主題卡，主題頁用 Breadcrumb、RelatedTopics、RelatedPastPapers 連回同一 subject cluster。首頁另設科目總覽和工具入口，讓 P0 頁在兩次點擊內可到達。新增頁面必須在內容索引或科目頁加入描述性 anchor text，不能只依賴 sitemap。

## URL 規則

使用小寫英文和連字符；path 描述內容；不要把 query string 當成可索引主題頁；年份、paper、題號只在真正提供該題解時使用，例如 `/dse-maths/past-papers/2023/paper-2/q12`。內容改名時保留 redirect 和 canonical 策略，不要任意改變穩定 URL。

## 三個可重用內容範本

### 主題筆記頁

H1 + 學習目標 → 核心概念 → 公式/規則/流程 → 分步例題 → 常見錯誤 → DSE 考試重點 → 相關 Past Paper 題解 → AI 練習 CTA → 相關主題/前後章。

### Past Paper 題解頁

H1 + 題目重點 → 評分要求 → 分步解法 → 常見失分位 → 涉及概念 → 相似題目 → AI 解釋/練習 CTA。只發布已核對且可合法使用的題目/題解內容；不把來源不明的 AI 輸出當作官方答案。

### AI 工具 landing page

H1 + 學生痛點 → 工具如何處理 → 使用步驟 → 具體例子 → 使用界線與 FAQ → CTA → 相關學習內容。清楚說明 AI 輔助不等於教師評分或成績保證。

## Search Console 上線 checklist

- [ ] 驗證 `www.dselevelup.com` 的 Domain property。
- [ ] 開啟 URL Inspection，檢查首頁、`/dse-maths`、`/dse-maths/quadratic-equations`、`/dse-english/writing-format`、`/ai/practice-generator`。
- [ ] 提交 `https://www.dselevelup.com/sitemap.xml`；確認回應 200、XML 有效、只含公開 canonical URLs。
- [ ] 打開 `/robots.txt`，確認公開頁 Allow、`/api/` 和私人/後台路由 Disallow；記住 robots 不等於 noindex。
- [ ] 在 URL Inspection 查看 Google-selected canonical、可檢索性、rendered HTML 和 index status。
- [ ] 用 Rich Results Test 檢查 BreadcrumbList、Article、WebApplication；結構化資料必須和頁面可見內容一致。
- [ ] 用 PageSpeed Insights、Chrome DevTools 及 Search Console CWV report 檢查 mobile/desktop。
- [ ] 設定 404/5xx、redirect、canonical、index coverage 及 sitemap errors 的每週檢查。
- [ ] 發布後記錄基準：已索引頁面、曝光、CTR、點擊、平均位置、註冊率及 AI 工具啟動率。

## 30 / 60 / 90 日 KPI

- 30 日：所有 P0 頁返回 200；sitemap 無錯誤；至少 90% P0 頁通過可檢索性抽查；建立 GSC baseline；公開頁 mobile LCP/INP/CLS 以 75 百分位為目標 LCP ≤2.5 秒、INP ≤200ms、CLS ≤0.1。
- 60 日：完成 P1 首批內容和內部連結；比較 P0 曝光、CTR、自然點擊與 baseline；找出有曝光低 CTR 的 title/description 進行一次內容型改善；不以保證排名作 KPI。
- 90 日：完成 P2 中與真實學生問題最相關的批次；追蹤主題頁的自然入口、學習頁停留/下一頁點擊、註冊率或 AI 工具啟動率；按 Search Console query 和內容品質每月迭代。

## 每月維護

每月一次抽查 10 個公開頁的 title、description、H1、canonical、JSON-LD、內部連結和手機版；更新已過時 syllabus/題解；移除薄內容或合併重複頁；查看 sitemap、索引、CWV、404/5xx；以實際學生問題擴充內容，而不是用程式批量生成相似頁。

## References

[1]: https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=zh-tw "搜尋引擎最佳化 SEO 入門指南"
[2]: https://developers.google.com/search/docs/essentials "Google Search Essentials"
[3]: https://developers.google.com/search/docs/appearance/core-web-vitals "Core Web Vitals and Google Search results"
