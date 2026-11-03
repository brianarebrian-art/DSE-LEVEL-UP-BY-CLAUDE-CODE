# DSE Level Up 第一次整體大更新 · Phase 4C SEO/AEO/GEO 與測試設計

**文件版本：** 1.0.0
**日期：** 2026-10-31（Asia/Hong_Kong）
**負責人：** 首席全端工程師兼保安負責人
**狀態：** Phase 4C 完成，等待批准進入 Phase 5

---

## 1. 執行摘要 (Executive Summary)

Phase 4C 為本次大更新規劃兩大支柱：
1. **DSE 知識樞紐 (Knowledge Hub) 與 SEO / AEO / GEO 權威訊號設計：** 藉由結構化課題模板、直接可被引用之定義（Answer-first）、語義化 HTML 與 7 大 Schema.org 結構化資料，提升在傳統搜尋引擎（Google）與新興生成式答案引擎（Perplexity, ChatGPT Search, Google AI Overviews）中的專業引用度與有機流量。
2. **全維度品質與保安測試體系：** 涵蓋單元、整合、E2E、RLS 隔離、Auth、防刷限流、效能（Core Web Vitals）、無障礙（WCAG 2.1 AA）與三級模擬入侵演練，並規範本地最小可重複執行的驗證命令鏈。

---

## 2. DSE Knowledge Hub 資訊架構與課題頁範本

### 2.1 知識樞紐資訊架構 (Information Architecture)
- **路徑層級：**
  $$\text{/} \longrightarrow \text{/subjects/[subject]} \longrightarrow \text{/subjects/[subject]/[topic]} \longrightarrow \text{/practice?subject=...&topic=...}$$
- **定位：** 課題頁（Topic Landing Page）作為「溫習精華 + 概念定義 + 實例示範 + 即時練習」的聚合中心，兼具 SEO 收錄與學習入口功能。

### 2.2 課題頁標準模板 (Topic Page Template)
每個課題頁（例如 `/subjects/math/quadratic-equations`）必須標準化具備以下 10 大區塊：
1. **課題導言與一句直接可引用定義 (Extractable Definition)：**
   - 位於 `<h1>` 下方的首段，字數 40-70 字，語言乾淨無贅詞。
   - *範例：*「一元二次方程（Quadratic Equation）係指未知數最高次數為二嘅整式方程，標準形式為 $ax^2 + bx + c = 0$（其中 $a \neq 0$）。」
2. **HKDSE 考核重點與考評局目標 (Assessment Objectives)：**
   - 標明甲類考試中此課題佔分比重、每年常出題型（Paper 1 必答題 / Paper 2 MC 題）。
3. **高頻常見題型分類 (Common Question Types)：**
   - 題型一：判別式 $\Delta$ 與實根個數。
   - 題型二：根與係數關係（韋達定理 Sum/Product of Roots）。
   - 題型三：拋物線圖像頂點與對稱軸變換。
4. **Step-by-step 範例解法 (Worked Examples)：**
   - 提供 1 道代表性原創平行改寫題，分步列出「審題關鍵 $\rightarrow$ 列式依據 $\rightarrow$ 運算過程 $\rightarrow$ 最終答案」。
5. **考生常見陷阱 (Common Traps & Pitfalls)：**
   - 清楚指出「誤將判別式大於零當作有兩個非負實根」、「移項漏變正負號」等歷年考生經典失分盲點。
6. **常見問題解答 (FAQ)：**
   - 3 至 5 個考生高頻疑問（例如：「點樣一眼睇出判別式係咪等於零？」）。
7. **相關練習入口 (Direct Practice CTA)：**
   - 點擊「即練 10 題此課題」直接帶參數進入沉浸式 `/practice?subject=math&topic=quadratic`。
8. **前置概念與後續延伸 (Concept Prerequisites)：**
   - 前置：因式分解、代數化簡；後續：二次函數極值、不等式。
9. **審核者實體、題目來源與更新日期 (Provenance & E-E-A-T)：**
   - 標註：審定者（例如：DSE 數學科註冊教師 / 科目資深編輯）、最後更新日期、版本號。
10. **無障礙導航與跳至主內容錨點。**

---

## 3. SEO 技術規範 (SEO Technical Requirements)

1. **靜態生成與伺服器渲染 (SSG / SSR)：**
   - 25 個科目頁與主要課題頁採用靜態生成（SSG / ISR），確保極速 TTFB 與 100% 爬蟲無障礙抓取。
2. **Metadata 與 Open Graph 規範：**
   - 遵循單一來源原則（`lib/site.ts` 之 `SITE_ORIGIN = 'https://www.dselevelup.com'`）。
   - 嚴格不在根 Layout 宣告全站統一 Canonical；由各 Page 依據規範路徑動態宣告獨立 Canonical URL：
     ```ts
     export const metadata: Metadata = {
       title: '一元二次方程 DSE 溫習重點與常考題型 | DSE Level Up',
       description: '免費 DSE 數學科一元二次方程溫習筆記：涵蓋判別式性質、韋達定理公式、常考陷阱與 step-by-step 題型解析。',
       alternates: { canonical: `${SITE_ORIGIN}/subjects/math/quadratic-equations` }
     }
     ```
3. **XML Sitemap 與 robots.txt：**
   - `app/sitemap.ts` 動態匯出全站所有有效科目、課題、筆記及透明度頁面。
   - `app/robots.ts` 允許 Googlebot、Bingbot 爬取公開頁面；明確禁止爬取內部路由（`/founder/*`, `/admin/*`, `/api/*`）。
4. **語義化 HTML 與內部連結網狀結構 (Internal Linking)：**
   - 嚴格使用 `<main>`, `<article>`, `<header>`, `<section>`, `<nav>`。
   - 課題頁雙向連結：首頁 $\leftrightarrow$ 科目目錄 $\leftrightarrow$ 課題頁 $\leftrightarrow$ 練習題卡。
5. **語言與香港受眾訊號 (zh-HK Signals)：**
   - HTML 根節點標記 `<html lang="zh-HK">`。
   - Open Graph locale 設為 `zh_HK`，輔以 `en_HK`。
   - 關鍵字佈局自然融入香港本土考評用語（如「甲類科目」、「評卷參考」、「MC 技巧」、「卷一必答」）。

---

## 4. 結構化資料設計 (Structured Data / JSON-LD)

全站課題與知識頁面整合 7 大 Schema.org 規格，以 `@graph` 形式輸出於 `<head>`：

1. **`Course`：**
   - 代表整個 DSE 考試科目課程（如 HKDSE Mathematics Compulsory Part），標明 `provider` (DSE Level Up) 與 `isAccessibleForFree: true`。
2. **`LearningResource`：**
   - 代表具體課題的教學模組，標註 `educationalLevel: "SecondaryEducation"`, `learningResourceType: "RevisionGuide"`, `assesses: "Quadratic Equations"`.
3. **`FAQPage`：**
   - 封裝課題頁的 3-5 條高頻問題與權威解答，爭取 Google 搜尋結果頁 (SERP) Rich Snippet 折疊卡片。
4. **`HowTo`：**
   - 用於分步解題示範（Worked Examples），標明 `step` 結構與每一步的操作要領。
5. **`Article`：**
   - 用於筆記與教學專題，標註 `author`, `publisher`, `datePublished`, `dateModified`.
6. **`Person` (Reviewer Entity)：**
   - 結構化標註審定教師實體，提升 E-E-A-T 專業可信度訊號。
7. **`BreadcrumbList`：**
   - 麵包屑導航路徑（首頁 > 數學科 > 一元二次方程），利於搜尋引擎解析網站層級。

---

## 5. AEO / GEO 答案引擎優化規範 (Answer Engine Optimization)

為讓 Perplexity、ChatGPT、Google AI Overviews 正確引述與推薦本站內容，制定以下規範：

1. **答案優先結構 (Answer-First Content Architecture)：**
   - 每個課題頁與題型節點，第一段直接給出核心答案/定義，次段陳述原理解析，第三段列舉邊界特例與陷阱。
2. **可直接提取之定義 (Extractable Definitions)：**
   - 使用獨立語意區塊 `<aside class="callout-def">` 或精簡清單標記重要定理，避免使用冗長散文修飾。
3. **實體連結與來源引用 (Citation-Friendly Formatting)：**
   - 在頁尾提供明確的「引用來源與方法學」（Citation block），附帶永久錨點連結，方便 AI 引擎產生出處標籤。
4. **內容新鮮度訊號 (Content Freshness)：**
   - 頁面明文與中繼資料同步展示最後覆審日期（如：`最後審核日期：2026-10-30`）。

---

## 6. 全維度測試體系 (Testing Plan)

| 測試層級 | 測試範疇 | 工具 / 框架 | 驗收標準 |
| :--- | :--- | :--- | :--- |
| **Unit Tests (單元測試)** | 錯題排程運算、Mastery 算法、CSP Nonce、脫敏函式、Zod Schema | Node Test Runner (`tsx --test`) | 100% 純函數單元測試通過，邊界數值（0, 負數, 超時）無拋錯。 |
| **Integration Tests (整合測試)** | Route Handlers、同步合併、跨裝置偏好同步、CSRF 驗證 | Next.js Test Harness / Mock Req | API 在未授權時嚴格回傳 401/403，資料庫錯誤時回傳脫敏 500。 |
| **E2E Tests (端到端測試)** | 學生從首頁進站、診斷前測、完成練習、錯題重做完整閉環 | Playwright | 核心練習流程在桌面與手機視窗（375px）均能完整走通。 |
| **RLS Tests (資料庫隔離測試)** | Student A 查詢 Student B 紀錄、匿名存取特權表、直接繞過測試 | pgTAP / Supabase Client Test | 100% 越權查詢回傳 0 列或 Denied，無資料洩漏。 |
| **Auth Tests (認證測試)** | Session 建立、Token 輪換、登出清理、Session 偽造拒絕 | Supabase SSR Test Client | 偽造 Cookie 或過期 Token 立即被阻擋。 |
| **Abuse & Rate-limit Tests** | 高頻刷題、大量提交報告、暴力請求認證端點 | 壓測腳本 (Autocannon / Bash) | 超過閾值時精確回傳 429 且帶 `Retry-After`，防刷生效。 |
| **Performance Tests** | 首屏加載、練習切換題延遲、記憶體消耗 | Lighthouse / Speed Insights | LCP $< 2.0\text{s}$, FID/INP $< 100\text{ms}$, CLS $< 0.05$. |
| **Accessibility Tests (A11y)** | 對比度、鍵盤導航焦點、觸控高標 (`min-h-12`)、無 Emoji | Axe-core / 現有 Guard 腳本 | 符合 WCAG 2.1 AA，Emoji 檢查 100% 通過。 |
| **Content & SEO QA** | 題目格式完整性、JSON-LD 語法、Sitemap 有效性 | `validate-banks` / Google Rich Results | 零孤兒路由，結構化資料校驗零 Error。 |
| **Security Exercise (三級演習)** | Level 1 未認證、Level 2 低權限越權、Level 3 入侵應變 | 安全演練腳本與 Runbook | 滿足全部三級模擬入侵 Pass 條件。 |

---

## 7. 本地驗證命令集 (Local Verification Commands)

為確保開發過程嚴謹、可重複且不破壞現有環境，本更新使用並封裝以下最小命令：

```bash
# 1. 程式碼靜態語法與型別檢查
npm run lint

# 2. 全面題庫品質與守護檢查 (Term, Contrast, Emoji, Claims, Integration, Nav)
npm run qa

# 3. 執行全量單元與整合測試
npm test

# 4. 驗證題庫一致性與防撞檢查
npm run baseline

# 5. 生產環境建置驗證 (預防靜態頁面記憶體溢出)
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

*安全與 RLS 迴歸驗證方案（將於 Milestone 1 最小引入）：*
- `npx tsx scripts/security/test-rls-regression.mts`（模擬 Student A 查詢 Student B，驗證拒絕行為）。
- `npx tsx scripts/security/test-rate-limit.mts`（驗證 429 觸發條件）。

---

**Phase 4C 完成，等待批准。**
