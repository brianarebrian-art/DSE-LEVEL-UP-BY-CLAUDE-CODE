# 技術審核：Vercel × Supabase 未開墾功能藍圖 v1.0

**審核日期**：2026-07-31 · **審核對象**：`dse-level-up-vercel-supabase-blueprint-v1.md`
**核實方式**：逐項對 live DB（`aegekxapxgcfdrkzisis`）、repo 檔案、package.json 查證。

**總評**：12 項之中 **2 項建議做**、**3 項可考慮但要重寫**、**7 項不建議或前提錯誤**。
第二部分嘅七層火控 System Prompt **質素高、建議採用**（唯要補三處已知漏洞，見 §3）。

---

## 1. 一句話結論表

| # | 功能 | 判定 | 決定性理由 |
|---|---|---|---|
| 01 | Edge Config 難度校準 | ❌ 前提錯 | SQL 查詢嘅欄位全部唔存在；且需新套件 |
| 02 | Cron 每日溫習信 | 🟡 可考慮 | 概念成立，但只服務登入用戶（少數） |
| 03 | ISR 題目頁靜態化 | ❌ 前提錯 | `/question/[id]` 路由【唔存在】 |
| 04 | FDW 真實數據出題 | ❌ 撞紅線 | 題目內容會喺審批後自行變動 |
| 05 | Rewrites 學科路由 | ❌ 反效果 | 製造重複內容，同今日做嘅 canonical 對衝 |
| 06 | Webhook 錯題溫和提醒 | 🟡 可考慮 | 數據唔喺可查詢形狀；建議改喺前端做 |
| 07 | Connection Pooler | ❌ 不適用 | 主要路徑根本冇直連 Postgres |
| 08 | Analytics × 慢查詢 | ✅ 建議做 | 擴展已裝好，零成本 |
| 09 | pg_trgm 錯字搜尋 | ❌ 前提錯 | 題目唔喺 Supabase，pg_trgm 搜唔到 |
| 10 | Edge Middleware 延遲優化 | ❌ 前提錯 | 本專案用 `proxy.ts`，冇 `middleware.ts` |
| 11 | Audit Triggers 審計鏈 | ❌ 反效果 | 增加而非減少 PDPO 風險；Log Drains 非免費 |
| 12 | Draft Mode 預覽 | ✅ 已經有 | 現有覆核表已達成同樣效果 |

---

## 2. 逐項核實

### ❌ 01 Edge Config 難度校準 —— SQL 欄位全部唔存在

藍圖寫：`SELECT difficulty, AVG(correct_rate) FROM user_progress GROUP BY difficulty`

`user_progress` 實際欄位：`id, user_id, progress_data(jsonb), total_questions_done, last_active_at, updated_at`。
**冇 `difficulty`，冇 `correct_rate`。** 逐題數據全部藏喺 `progress_data` 嘅
`dse_topic_stats` JSON key 入面（97 行全部有），而 `total_questions_done`
**97 行全部係 0**（前端從未寫入）。呢條查詢跑唔到。

另外 `@vercel/edge-config` **未安裝** —— 撞「禁新套件」。

**更根本嘅問題**：藍圖話「唔係 gamification」，呢點同意。但佢會令 3:5:2 難度配比
變成浮動 —— 而 3:5:2 係憲章寫死嘅規格，亦係 `npm run qa` 嘅閘。要改就要先改憲章，
唔係加一個 Edge Config 就算。

### 🟡 02 Cron 每日溫習信 —— 概念成立，覆蓋面係問題

方向同大愛設計一致（平台內、唔推送、唔彈窗），我認同。但寫入
`user_settings` 意味住**只有登入用戶先有**。本站登入係選擇性（只換跨裝置同步），
即係大部分學生根本收唔到。

**建議改法**：整個功能其實唔需要 server —— 昨日做咗幾多題、邊個課題有進步，
`dse_topic_stats` 同 `dse_progress` 本機已經有齊。喺前端純本地生成，
**所有學生都有**，零 server 成本、零 cron、零新數據上雲。

### ❌ 03 ISR 題目頁靜態化 —— 目標路由唔存在

`app/question/` **唔存在**。呢件事今個月做 AEO 時已經確認過，並且明確將
`/question/{id}` 排除喺 sitemap 之外，理由原文：「該路由段【並不存在】。
照做等於主動邀請爬蟲索引 5,167 個 404」。

而且藍圖將兩條唔同嘅審批路徑撈埋一齊：`review-drafts.mjs → decisions.json`
係**本機檔案**流程，唔會產生任何 Supabase 寫入，所以 Database Webhook 永遠唔會觸發。
Supabase `review_decisions` 表係 `/admin` 嗰條路。

另：`review_decisions` **冇 `status` 欄**（實際欄位係 `decision`，值只有
`approved` / `rejected`），所以 `status = 'promoted'` 呢個條件唔存在。

### ❌ 04 FDW 真實數據出題 —— 撞「機器永不自動入庫」

技術上：`postgres_fdw` 係連**另一個 Postgres**，唔係連政府 REST／CSV API。
要拉外部 HTTP 要用 `http` extension 或 `wrappers`（兩者喺本專案**未安裝**，
但 available）。

**但更要緊嘅係憲章問題**：題目內容一旦引用實時外部數據，就代表
**題面會喺真人審批之後自行變動**。今日審批時 CPI 係 1.8%，下個月變 2.3%，
參考答案同解析就即刻同題面對唔上 —— 而冇任何人審批過新版本。
呢個直接違反「機器永不自動入庫」嘅精神：唔止入庫，仲係入完之後繼續改。

**可行嘅版本**：出題時**快照**一次數據並寫死落草稿，註明數據日期，行正常審批管線。
咁就係「用真實數據出題」而唔係「題目跟住數據郁」。

### ❌ 05 Rewrites 學科路由 —— 會製造重複內容

標題寫「子域名」但例子全部係路徑（`/math/*`），兩者唔同嘢。

實際問題：站內已經有 `/subjects/[subject]` 同 `/notes/[subject]`。再加 `/math/*`
指向同一內容，就係**同一份內容兩個 URL** —— 搜尋引擎眼中係 duplicate content，
會分散權重。呢個同今個月啱啱做好嘅 canonical + sitemap 直接對衝。

要做學科入口，正路係優化現有 `/subjects/[subject]` 嘅 metadata 同內鏈，
唔係加一層別名。

### 🟡 06 Webhook 錯題溫和提醒 —— 方向啱，落點錯

「連續錯 3 次先溫柔介入」呢個設計我認同，亦符合大愛紅線（唔彈窗、唔扣分）。

但 DB trigger 做唔到：`user_progress` **冇逐題行**，只有一個成塊 upsert 嘅
JSONB 快照。要喺 trigger 入面判斷「同一 topic 連續錯 3 次」，就要喺 Postgres
入面 parse JSON 再同上一版比對 —— 複雜、易錯、而且一樣只覆蓋登入用戶。

**建議改法**：`lib/reverseLog.ts` 本機已經逐條記錄 `topicId` + `cause` + `ts`，
判斷「同一課題近期錯咗 3 次」係一個 3 行嘅前端函數。所有學生（包括未登入）
都有效，零 server、零 webhook。

### ❌ 07 Connection Pooler —— 主要路徑冇直連 Postgres

藍圖列為 🔴 P0。但實際架構係：`getServiceSupabase()` 用 `@supabase/supabase-js`，
**經 HTTPS 打去 PostgREST**，唔會開 Postgres 連接。所有 `/api/*` 路由都行呢條路。
所以「Vercel Serverless 每個請求新建數據庫連接」呢個前提唔成立。

唯一直連 Postgres 嘅係 `lib/auth/better-auth.ts` 嘅 `new Pool({ connectionString })`
（`pg@^8.22.0` 確實已安裝），但佢**只喺 `DATABASE_URL` + `BETTER_AUTH_SECRET`
同時存在時先啟用**，目前係 fall through 去 Auth.js。

**結論**：呢項而家零影響。真正要留意嘅係「日後一旦切換去 Better Auth」——
到時 `DATABASE_URL` 應該用 Supabase 嘅 **pooler 連接字串（port 6543）**
而唔係直連（5432）。呢個係一行 env 值嘅事，唔係 2 小時工程。

### ✅ 08 Analytics × pg_stat_statements —— 建議做，而且已經裝好

`pg_stat_statements` **已安裝並啟用**。零成本、零用戶可見改動、純開發者工具。
12 項入面最乾淨嘅一項。

### ❌ 09 pg_trgm 錯字搜尋 —— 題目根本唔喺 Supabase

`pg_trgm` 確實**已安裝**。但 —— **Supabase 冇任何題目表**。
`public` schema 得 8 張表：`agent_memory`、`agent_traces`、`escalation_queue`、
`profiles`、`review_decisions`、`user_progress`、`user_sessions`、`user_settings`。
5,166 條題目全部住喺 `data/questions/*.ts`（TypeScript 模組，隨 bundle 出街）。
pg_trgm 搜唔到唔喺數據庫入面嘅嘢。

另外兩處事實錯誤：
- 「`unaccent`（忽略聲調）」—— `unaccent` 係去拉丁字母嘅變音符號（é → e），
  對中文**完全冇作用**。
- 例子寫「搜尋『共用品』打錯做『共用品』或『公共品』」—— 頭兩個字串**完全相同**。

**方向本身係啱嘅**（讀寫障礙學生打錯字搵唔到內容，會以為平台冇呢個內容而放棄）。
正確做法係**前端模糊搜尋**：題庫已經喺 client 手上，用一個細 trigram／編輯距離
函數即可，零 server、零新套件、亦服務未登入用戶。

### ❌ 10 Edge Middleware —— 本專案冇 `middleware.ts`

`middleware.ts` **唔存在**；本專案用 `proxy.ts`。呢個係反覆出現嘅假設錯誤，
憲章技術棧一節亦有明文列明。

而且 Vercel 本身已經自動由最近邊緣節點派靜態資源，唔需要寫 middleware 去做。
「確保 Supabase 查詢經最優路徑」亦唔係 middleware 控制得到嘅事。

### ❌ 11 Audit Triggers —— 增加而非減少 PDPO 風險

藍圖將呢項當作「PDPO 合規護城河」。實情相反：**開一張 `audit_log` 記錄
未成年人每一次數據變更（誰、何時、改咗乜、改之前係乜），係新增一批個人資料
同新增一項保存責任。** PDPO 嘅保留原則係「非必要不保留」，唔係「保留得越多越合規」。

要處理「學生聲稱進度無故消失」呢個場景，現有 `updated_at` + `lib/sync.ts`
嘅三分支 merge（本機較完整時保留本機）已經係防線；真正要加就加**匯出功能**
（`/dashboard/report` 同 `/account` 已經有），俾學生自己留底，而唔係平台留底。

另：**Vercel Log Drains 唔屬 Hobby 方案**（需自行核實現行方案細則），
與「$0 額外支出」前提衝突。

### ✅ 12 Draft Mode 預覽 —— 想要嘅效果已經有

「學科首席喺手機打開連結，睇題目真實渲染效果」—— `review-drafts.mjs` 產生嘅
**自足 HTML 覆核表已經做到**：可直接喺手機開、逐題通過／退回、匯出 decisions.json。
今日（2026-07-31）已擴充為按題型渲染（書寫題出參考答案＋評分準則）並實測過。

Draft Mode 會多一套需要維護嘅臨時連結 + 過期機制，換嚟嘅增量價值近乎零。

---

## 3. 第二部分「七層火控 System Prompt」—— 建議採用，補三處

呢份 prompt 質素明顯高過之前幾份規格：**§③ Context 嘅技術事實全部正確**
（`getSyncUserId()` 而非 `getServerSession`、`@/utils/supabase/server` 而非
`@/lib/supabase`、8 張現存表、`lib/sync.ts` 三分支 merge），**§④ Rules 嘅
禁強制登入／禁追蹤未成年人／禁新套件／禁 gamification 四條，正正係之前幾份
規格踩過嘅坑**。§⑦ 第 1 步「冇 schema 就先問，唔好寫代碼」尤其正確。

建議補三處：

1. **補入 `proxy.ts`（非 `middleware.ts`）** —— §③ 冇寫，而本文件自己 §10 就踩咗。
2. **補一條紅線：「禁機器自動入庫，亦禁題目內容於審批後自行變動」** ——
   現有 Rules 冇涵蓋，而本文件 §04 就踩咗。
3. **§④「必須做到」第 1 條「所有寫入 API 必須有 rate limiting，可用原生 Map/Set」**
   —— 喺 Vercel serverless 上，`Map` 存喺單個 instance 記憶體，多 instance 之下
   等於冇限制。應改為：「若需真正 rate limiting，須用共享儲存（例如 Supabase
   一張細表）；用記憶體 Map 只可當作同一 instance 內嘅粗略節流，唔可以當作安全機制。」

---

## 4. 建議

**即刻可做（$0、低風險）**：08（pg_stat_statements 已裝好，接 Vercel Analytics 對照）。

**建議改寫後做（全部改喺前端，服務所有學生而非只服務登入用戶）**：
02 每日溫習信、06 錯題溫和提醒、09 錯字容忍搜尋。三者共通點 ——
**所需數據本機已經齊，上 server 反而縮窄咗覆蓋面**。

**不建議做**：01、03、04、05、07、10、11、12。

**採用**：第二部分七層火控 prompt（補上述三處後）。

本文件零代碼、零 migration 改動。
