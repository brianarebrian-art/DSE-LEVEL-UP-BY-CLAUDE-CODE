# DSE Level Up 第一次整體大更新 · Phase 1 研究報告

**文件版本：** 1.0.0
**日期：** 2026-10-31（Asia/Hong_Kong）
**負責人：** 首席全端工程師兼保安負責人
**狀態：** Phase 1 完成，等待批准進入 Phase 2

---

## 1. 執行摘要 (Executive Summary)

本研究深入檢視現有程式碼、資料庫遷移與營運架構。平台已具備堅實倫理底線（永久免費、零廣告、原創平行改寫、無催逼遊戲化），並完成 Supabase Auth 遷移地基。然而，平台目前實質上仍偏向「題庫練習站」，尚未完全閉環為「個人學習系統」：錯題多停留在瀏覽器 `localStorage`，缺少前測診斷與後測驗證；伺服器端部分 API 缺乏嚴格驗證與速率限制。在保安層面，多個敏感資料表雖透過 `REVOKE` 限制客戶端，但依賴 `service_role` 繞過 RLS 的後端查詢需防範 IDOR 與越權；部分依賴項如 `katex` 與 `zod` 存在高風險漏洞需受控升級。本次大更新將以「安全第一、零破壞、可驗證進步」為核心推進。

---

## 2. 現有系統架構盤點 (Current Architecture Map)

### 2.1 Next.js 16 App Router 與路由佈局
- **核心設定：** 使用 Next.js 16 (`16.4.2`)、React 19 (`19.2.4`)、Tailwind CSS v4、Node.js。
- **Proxy 路由代理：** `proxy.ts` 負責網域名稱規範化（308 轉向至 `www.dselevelup.com`）、記憶體滑動窗口 Rate Limiting、以及動態產生 CSP Nonce。無 `middleware.ts`（Next.js 16 下兩者並存會導致 build 失敗）。
- **主要頁面與入口：**
  - 首頁：`app/page.tsx` + `app/HomePageClient.tsx`
  - 智能開始：`app/start/`、`lib/quickStart.ts`
  - 科目目錄：`app/subjects/`、`SubjectDetailView.tsx`
  - 練習引擎：`app/practice/`（`PracticeShell.tsx`、`PracticeGate.tsx`、`PracticeSession.tsx`，約 1360 行）
  - 結果結算：`app/result/ResultPageClient.tsx`、`lib/resultNextSteps.ts`
  - 進度與設定：`app/dashboard/`、`app/bookmarks/`、`app/account/`
  - 獨立學科與內容頁：`/dse-maths`、`/dse-english`、`/dse-physics`、`/notes`
  - 信任與透明度：`/trust`、`/transparency`、`/methodology`、`/about`
  - 創辦人與後台管理：`/founder`（Founder OS 儀表板與指令列）、`/admin`（題目審核與質素隊列）

### 2.2 Server Components 與 Client Components 分佈
- **Server Components (RSC)：** 負責靜態結構、SEO Metadata、JSON-LD Schema 生成、以及各主路由的初始資料提取。
- **Client Components (`'use client'`)：** 集中於練習互動流程（`PracticeSession`、`PracticeQuestionCard`）、音效與計時控制、SEN 工具面板（`A11yPanel`、`ReadingRuler`）、登入狀態監聽（`AuthProvider`）及本機/雲端同步機制（`SyncProvider`、`SettingsSync`）。
- **Server Actions：** 現有程式碼僅在 `lib/founder/actions.ts` 包含 `'use server'`，用於創辦人批量預覽題目狀態，並具備 `originFromHeaders()` 來源校驗。

### 2.3 Route Handlers 與 API 端點
- `app/api/progress/route.ts`：讀取與儲存用戶練習進度快照（`user_progress`）。
- `app/api/sync/session/route.ts`：記錄每日活躍 Session（無 Request Body，純 Server 端時間與身分寫入）。
- `app/api/sync/settings/route.ts`：SEN 偏好設定（字級、行距、字距）跨裝置同步。
- `app/api/auth/migrate-legacy/route.ts`：將舊 Auth.js Google sub 遷移至 Supabase `auth.users.id`。
- `app/auth/callback/route.ts`：Supabase OAuth 回調，交換 Code 為 Session Cookie 並初始化 Profile。
- `app/api/account/delete/route.ts` 與 `app/api/me/route.ts`：落實 PDPO 抹除權，清空用戶關聯資料。
- `app/api/report/route.ts`：題目錯誤回報（匿名、最小化收集、無 PII）。
- `app/api/feedback/route.ts`：練習後問卷回饋。
- `app/api/practice-count/route.ts`：匿名統計當日練習題數。
- `app/api/push/subscribe/route.ts`：推播訂閱，要求 Management Token。
- `app/api/admin/` & `app/api/founder/`：內部審核與營運端點。

---

## 3. Supabase 現況與清單 (Supabase Inventory)

### 3.1 資料表清單與 RLS 狀態
1. `questions`：公開題庫，儲存無損題目 JSON。啟用 RLS；`anon` 與 `authenticated` 僅有 `SELECT` 權限；寫入嚴格限制為 `service_role`。
2. `question_bank_versions`：題庫雜湊版本表，供快取驗證。啟用 RLS；公開唯讀。
3. `user_progress`：歷史用戶進度快照表。啟用 RLS；`anon` 與 `authenticated` 已全部 `REVOKE`；僅 `service_role` 可存取。
4. `user_settings`：SEN 偏好設定表。啟用 RLS；由伺服器端依 `user_id` 存取。
5. `user_sessions`：每日活躍度統計。啟用 RLS；由伺服器端安全寫入。
6. `privacy_consents`：私隱政策同意紀錄。啟用 RLS；紀錄用戶同意之特定版本。
7. `question_reports`：題目錯誤回報。啟用 RLS；由伺服器端匿名寫入。
8. `session_feedback`：練習後回饋。啟用 RLS；由伺服器端寫入。
9. `push_subscriptions`：推播端點與金鑰雜湊。啟用 RLS。
10. `auth_identity_map`：Google sub 與 UUID 對應表。啟用 RLS；伺服器專用。
11. `profiles` & `learning_profiles`：用戶基本資料與學習檔案。啟用 RLS。
12. `dse_question_quality_reviews` & `dse_curriculum_frameworks`：題目審核與課綱架構表。
13. `founder_audit_events`：創辦人操作稽核紀錄表。

### 3.2 Client 建立方式與金鑰使用
- **伺服器端 SSR 客戶端：** `lib/auth/supabase-server.ts` 透過 `@supabase/ssr` 的 `createServerClient` 綁定 Cookie Store，執行基於用戶身分之操作。
- **伺服器端 Service Role 客戶端：** `utils/supabase/server.ts` 導出 `getServiceSupabase()` 單例，使用 `SUPABASE_SERVICE_ROLE_KEY`。此 Key 繞過 RLS，限 server-only 使用。
- **瀏覽器端客戶端：** `lib/auth/supabase-browser.ts` 使用 `NEXT_PUBLIC_SUPABASE_URL` 與 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。金鑰設計為公開，只具題庫唯讀及 Auth 授權呼叫權限。
- **安全檢查：** 代碼庫已全面封鎖 `SUPABASE_SERVICE_ROLE_KEY` 進入客戶端 Bundle（CI 及靜態檢查嚴格把關）。

---

## 4. 認證系統現況 (Auth Inventory)

1. **認證技術現況：**
   - 歷史上曾支援 Auth.js (NextAuth) 與 Better Auth。現行版本已於 2026-10-30 完成重構，全面統一收斂為 **Supabase Auth Google OAuth**（`@supabase/ssr`）。
   - 系統使用 `auth_identity_map` 平滑過渡舊版 Google sub 至新架構 UUID，確保學生歷史進度不中斷。
2. **Session 驗證與授權：**
   - 伺服器端核心驗證函式為 `getAuthUser()` 及 `getSyncUserId()`（`lib/auth/server.ts`），透過 Supabase Token 取得經過驗證的 `auth.users.id`，絕不信任前端傳入之身分標識。
3. **角色與權限架構：**
   - **Student：** 一般已登入或匿名學生。
   - **Reviewer：** 於 `REVIEWER_EMAILS` 白名單中指定角色（teacher / subject_editor / volunteer），可存取 `/admin/quality`。
   - **Admin：** 於 `ADMIN_EMAILS` 白名單中，具審核權限。
   - **Founder：** 硬編碼之創辦人電郵並強制比對 `FOUNDER_GOOGLE_SUB`，無匹配者拒絕存取 `/founder`。

---

## 5. 產品現況與差距分析 (Product Gap Analysis)

| 維度 | 現況 (As-Is) | 目標升級 (To-Be - v1) | 差距分析與整改重點 |
| :--- | :--- | :--- | :--- |
| **錯題處理** | 散落在 `localStorage`（`reverseLog.ts`）；有 3 維粗略標籤，但練習頁缺乏一鍵重做閉環與深度引導。 | 一鍵重做錯題；精確 5 大錯因標籤；顯示「錯邊步、點解錯、下次點避免」；3/7/14 日間隔重溫。 | 現有錯題未與知識點完全串接，需要將錯題記錄由純本地輕量升級為可追蹤修復狀態的模式。 |
| **學習診斷** | 無前測診斷；進入練習直接選科做題；結果頁僅為當節分數結算。 | 10 分鐘入門診斷；每週 3-5 次（每次 15-30 分鐘）學習路線；薄弱點優先推薦；節末 1 分鐘覆盤。 | 缺乏學習路線引擎，目前 `recommendNext.ts` 僅基於簡單題目偏好排序，需增設學習計劃與任務推進邏輯。 |
| **進度儀表板** | 顯示累計題數、估算等級區間（非認證）、題目光譜，資訊密度高且行動指引分散。 | 0-100 每科 Mastery Score；Top 3 弱項課題；錯題重做通過率；Next Best Action（今日唯一步驟）。 | Dashboard 需收斂資訊階層，拔除易致焦慮的冗餘圖表，突出「有冇進步」與「下一步做咩」。 |
| **內容透明度** | 具備基礎機檢披露（`QuestionProvenance`），但無逐題版本追蹤；錯誤回報走 mailto/基礎紀錄。 | 題目來源清楚標示（原創/改寫/公開衍生）；審核狀態全透明；錯誤回報可即時查詢「已收到/已修正」。 | 需落實 Content Provenance 頁面與錯誤回報狀態可視化。 |
| **無障礙 (SEN)** | 具備字級、行距、閱讀尺面板與沉浸式無干擾模式。 | 完善鍵盤導航、螢幕閱讀器替代描述、數學式 KaTeX 語音輔助、可隨時關閉限時壓力提示。 | 需對齊 WCAG 2.1 AA 標準，確保壓力計時器預設關閉且絕不強制截斷答題。 |

---

## 6. 保安風險登記冊 (Security Risk Register)

### [P0] 嚴重性極高風險

- **Risk ID: SEC-P0-01**
  - **位置：** `utils/supabase/server.ts` (`getServiceSupabase()`) 與部分 API 呼叫點
  - **描述：** 系統大量使用 `service_role` 繞過 RLS 進行資料操作。若在業務路由中缺少嚴格的 `user_id` 擁有權校驗或過濾，將導致嚴重的 IDOR（水平越權）。
  - **攻擊場景：** 攻擊者以 Student A 登入，偽造請求參數修改目標 ID，若路由未強制使用 `auth.uid()` 比對，將直接竄改或刪除 Student B 的學習資料。
  - **影響：** 學生資料完整性遭到破壞，違反 PDPO 規範。
  - **建議修復：** 建立統一的伺服器端授權守門工具（如 `requireVerifiedUser()`），所有 Server Actions 與 API 必須從伺服器 Session 取出 verified user id 作為唯一資料過濾條件，並全面實施 RLS regression test。
  - **驗證方式：** 編寫 Level 2 模擬測試，以 Student A 身分請求 Student B 資源，必須嚴格回傳 403/404 或受限。

- **Risk ID: SEC-P0-02**
  - **位置：** `proxy.ts` (Rate Limiting 實作)
  - **描述：** 現行 Rate Limiting 依賴記憶體 Map (`createLimiter`)，在 Vercel Serverless / Edge 多實例環境下各節點記憶體隔離，無法形成全局分散式限速。
  - **攻擊場景：** 攻擊者利用並行分散請求輪詢不同的 Serverless 實例，繞過記憶體桶計數，針對 `/api/auth/` 或報告端點發動暴力窮舉或阻斷服務。
  - **影響：** 後端資料庫承受異常流量，認證機制可能遭受 credential stuffing。
  - **建議修復：** Milestone 1 強化關鍵端點（如 Auth、Report）的邊界驗證與 IP 防護架構，並在必要時對關鍵資安端點引入分散式或嚴格的阻擋策略。
  - **驗證方式：** 模擬外部併發突發請求，驗證拒絕回應率與告警機制。

---

### [P1] 高度風險

- **Risk ID: SEC-P1-01**
  - **位置：** `app/api/founder/overview/route.ts` & `lib/founder/metrics.ts`
  - **描述：** Founder overview 執行時對 `user_progress` 表進行全表掃描並解析 JSON，未有分頁或物化視圖聚合。
  - **攻擊場景：** 隨著用戶規模擴大，觸發該端點會引致資料庫 CPU 飆升及記憶體耗盡，造成資料庫拒絕服務。
  - **影響：** 後台查詢效能劣化，引發生產站連鎖延遲。
  - **建議修復：** 將進度聚合邏輯改為定期物化聚合視圖，避免在請求時進行全表 JSON 掃描。
  - **驗證方式：** 壓力測試模擬大數據量下的 API 延遲與資料庫負荷。

- **Risk ID: SEC-P1-02**
  - **位置：** `supabase/migrations/0025` 至 `0028` 等 DRAFT migration 檔案
  - **描述：** 資料庫目錄中保留未套用或草稿狀態的 SQL 檔案，且部分文件仍指稱舊版 Better Auth / Auth.js，造成文檔與實際 Schema 漂移。
  - **攻擊場景：** 開發者若誤套用未經審核的 DRAFT migration，可能覆蓋既有權限或撤銷重要設定。
  - **影響：** 部署失誤引致環境不穩定或安全防線降級。
  - **建議修復：** 徹底清理過時草稿，鎖定 Migration 版本鏈，確保生產環境與 repo 狀態 100% 一致。
  - **驗證方式：** 執行 Migration 靜態語法與漂移審計腳本。

---

### [P2] 中度風險

- **Risk ID: SEC-P2-01**
  - **位置：** `app/api/push/subscribe/route.ts`
  - **描述：** 推播訂閱允許未登入匿名提交，儘管具備 Management Token 雜湊校驗，仍有被惡意灌水填滿資料表的風險。
  - **建議修復：** 增加更嚴格的容量配額限制與過期訂閱自動清理機制。
  - **驗證方式：** 自動化大量訂閱測試確認超出配額時的防禦行為。

- **Risk ID: SEC-P2-02**
  - **位置：** `lib/rateLimit.ts` 取得之 IP Header
  - **描述：** `request.headers.get('x-forwarded-for')?.split(',')[0]` 可能在特定反向代理未正確清洗時遭受 Header 偽造。
  - **建議修復：** 確保讀取經過 Vercel 信任之真實 IP 標頭（如 `x-real-ip`），防止偽造客戶端 IP。
  - **驗證方式：** 構造帶有偽造 X-Forwarded-For 標頭的請求進行限流驗證。

---

## 7. 依賴項審計 (Dependency Audit)

根據 `npm audit` 與 `package.json` 靜態掃描：

1. **高風險依賴 (High Severity)：**
   - **`zod` (<4.6.6)：** 存在記憶體耗盡風險（GHSA-mrhx-c7xc-m3w5，大集合約束驗證時 DoS）。
   - **處置建議：** 評估受控升級至已修復版本，確保不破壞現有 Schema 定義。
2. **中風險依賴 (Moderate Severity)：**
   - **`katex` (0.17.0)：** 存在 Prototype Pollution 繞過 trust 限制風險（GHSA-238p-pmpm-9mq7）。
   - **`glob` / `minimatch`：** 存在 DoS 與檔案路徑遍歷風險，由 `@sentry/nextjs` 及 ESLint 相關套件引入。
   - **處置建議：** 配合 Next.js 16 與 React 19 相容性，在 Milestone 1 執行非破壞性之安全性修補（`npm audit fix`）。
3. **休眠與過時依賴盤點：**
   - `@anthropic-ai/sdk` (`^0.105.0`) 存在於 `devDependencies`，但憲章與本次目標已明定不引入任何教育型 AI 助手或 LLM runtime。應評估是否僅為線下批次工具，並禁止任何執行期依賴。
   - 移除非必要之過時草稿腳本，保持依賴清爽。

---

## 8. 大更新 v1 建議範圍與邊界 (Scope & Boundaries)

### 8.1 建議涵蓋範圍 (In Scope)
1. **保安地基強化：** 統一伺服器身分與授權校驗層、嚴格防範 IDOR、建立 Audit Logging、安全回應標頭強化。
2. **錯題復習系統：** 建立一鍵重做錯題流程、5 大錯因標籤（概念/題意/計算符號/單位格式/陷阱）、間隔重溫排程（3/7/14 日）。
3. **個人化學習路線：** 輕量入門診斷（10 分鐘）、每週 3-5 次學習計劃、優先推薦薄弱點、無壓力節奏控制。
4. **透明度與進度儀表板：** 0-100 Mastery 指標、Top 3 弱項課題、Next Best Action、題目來源與審核狀態全透明。
5. **SEN 與無障礙強化：** 遵守 WCAG 2.1 AA 標準，提供閱讀輔助、倒數計時完全可選關閉。
6. **SEO / AEO / GEO 升級：** 課題知識樞紐結構化資料（JSON-LD）、高品質 SSR 頁面、清晰定義與 FAQ。

### 8.2 明確排除目標 (Explicit Non-Goals)
- ❌ 引入教育型 AI 助手、AI 聊天機械人、AI 生成題目或答案。
- ❌ 引入催逼型 Streak、排名榜、經驗值、徽章等過度遊戲化功能。
- ❌ 全科長卷模擬試卷與 DSE 等級過度承諾預測。
- ❌ 學生社群、留言討論區或深度家長監控。
- ❌ 引入新的第三方 ORM、State Management、付費監控（如 PostHog/Datadog）或付費圖表庫。

---

## 9. 待確認決策與開放問題 (Decisions & Open Questions)

請創辦人提供以下資訊與決策確認：

1. **環境與部署確認：** 現有 Staging 環境的存取方式為何？生產環境部署來源分支是否鎖定為 `main`？
2. **生產金鑰綁定狀態：** 生產環境 Vercel 之 `FOUNDER_GOOGLE_SUB` 是否已確實綁定創辦人 Google 帳號之 sub？
3. **歷史 Migration 生產狀態：** `0029_founder_os.sql` 與 `0030_supabase_google_auth_rebuild.sql` 是否已完整應用於生產 Supabase？
4. **保安 Incident Response 負責人：** 當觸發 Level 3 安全事故應變或憑證疑慮時，誰擔任主要 Incident Commander？是否有現行書面 Privacy / Security Policy 需對齊？
5. **錯題資料持久化策略：** 學生錯題復習資料在未登入時保留於 `localStorage`，登入後是否同意同步至雲端受 RLS 保護的專屬表？

---

## 10. 後續 Phase 實作里程碑劃分規劃 (Milestones Blueprint)

每個 Milestone 均獨立可測試、可驗收、可回滾：

| Milestone | 名稱 | 預計變更範圍 | 測試與驗收標準 | 回滾方案 (Rollback) |
| :--- | :--- | :--- | :--- | :--- |
| **M1** | **保安地基強化** | `lib/auth/`, `proxy.ts`, 安全標頭, 輸入驗證, 授權 Helper | Level 1 & 2 安全測試通過；零 IDOR；所有測試 Pass | Git revert M1 commit；還原代理設定 |
| **M2** | **錯題復習系統** | 錯題紀錄結構, 一鍵重做 UI, 5 大錯因標籤組件 | 錯題可重做、通過率計算正確、間隔重溫準確觸發 | Feature flag 預設關閉；本地 log 結構向下相容 |
| **M3** | **個人化學習路線** | 診斷前測流程, 週計劃引擎, 薄弱課題優先排序 | 10 分鐘內完成診斷並生成每週 3-5 次路線 | 切換回傳統科目列表與 QuickStart 入口 |
| **M4** | **進度儀表板** | Dashboard 視圖收斂, Mastery 分數計算, Next Best Action | 單一行動指引明確；無負面排名標籤；手機端 375px 無溢出 | 保留舊版 Dashboard Client 組件作為備用入口 |
| **M5** | **節測與限時練習** | 10-15 分鐘課題節測, 失分地圖, 壓力提示開關 | 倒數計時可隨時關閉；超時不扣分不強制終止 | 回退練習時間模式設定至現行預設狀態 |
| **M6** | **透明度與回報** | Content Provenance 頁, 錯誤回報追蹤狀態 UI | 學生可查回報處理狀態；公開標示題目來源與審核者 | 題目卡保持現有基礎 Provenance 披露標籤 |
| **M7** | **SEO / AEO / GEO** | DSE Knowledge Hub, 課題頁 JSON-LD, Sitemap 擴展 | 結構化資料通過 Google Rich Results 測試；Core Web Vitals 達標 | 靜態頁面可獨立部署，不影響核心 App 運作 |

---

## 11. Phase 2 建議計劃 (Proposed Phase 2 Plan)

待 Phase 1 獲得批准後，Phase 2 將專注於**「問題定義 (Problem Definition)」**：
- 明確規範目標考生核心旅程與痛點。
- 定義衡量產品成功的關鍵指標（錯題重做通過率、7日回訪完成率、API p95 延遲、P0 漏洞清零時間）。
- 明確 MVP 邊界與假設驗證路徑，杜絕功能蔓延。

---

**Phase 1 完成，等待批准。**
