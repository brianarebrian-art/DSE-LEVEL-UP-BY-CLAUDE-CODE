# DSE Level Up 第一次整體大更新 · Phase 4B 資料與保安設計

**文件版本：** 1.0.0
**日期：** 2026-10-31（Asia/Hong_Kong）
**負責人：** 首席全端工程師兼保安負責人
**狀態：** Phase 4B 完成，等待批准進入 Phase 4C

---

## 1. 執行摘要 (Executive Summary)

Phase 4B 奠定 DSE Level Up 作為個人學習系統的底層資料架構與安全護城河。本設計嚴格落實「零破壞、零資料重設、向下相容」原則，以 **Supabase PostgreSQL** 為核心，規劃包含錯題本、錯因自診、學習路線、間隔排程、掌握度快照與稽核日誌在內的 **14 個核心資料表**。安全防線全面落實 **Deny All 預設策略**、基於伺服器端 Token 的嚴格授權、13 大威脅模型防護，並建立完備的備份還原與事故應變（Incident Response）Runbook，確保學生學習資料獲得銀行級保護。

---

## 2. 目標資料模型 (Target Data Model)

所有涉及用戶個人學習軌跡之資料表，主鍵一律採用 `uuid` 或穩定識別碼，外部鍵級聯保護，並全面開啟 Row Level Security (RLS)。

### 2.1 14 個核心資料表規格清單

#### 1. `profiles`
- **現狀：** 已存在（`0030_supabase_google_auth_rebuild.sql`）。
- **新增/修改欄位：** 新增 `role text not null default 'student' check (role in ('student','reviewer','admin','founder'))`。
- **Migration 策略：** `ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text default 'student';` 向下相容。
- **索引：** PK(`id` references `auth.users(id)`), `CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role)`.
- **RLS 策略：**
  - `SELECT`: `auth.uid() = id` 或 `role IN ('admin','founder')`。
  - `UPDATE`: `auth.uid() = id`（僅限 `display_name`, `avatar_url`；禁止一般學生透過客戶端直接更改 `role`）。
  - `INSERT`: 僅限 `handle_new_user_profile()` 觸發器或伺服器端初始寫入。
- **敏感欄位：** `email`, `role`（不公開）。
- **保留/刪除原則：** 遵循 PDPO，用戶刪除帳號時級聯刪除 (`ON DELETE CASCADE`)。

#### 2. `subjects`
- **現狀：** 程式碼內存在靜態常數（`data/subjects/`），雲端輔助表為 `dse_curriculum_frameworks`。
- **資料表結構：** `id text primary key` (slug), `name_zh text not null`, `name_en text not null`, `is_active boolean default true`, `curriculum_version text not null default '2026'`.
- **Migration 策略：** 建立實體參照表，匯入現有 25 個科目中繼資料。
- **RLS 策略：** 全員（含 `anon`）唯讀；寫入嚴格限制為 `service_role`。
- **保留/刪除原則：** 系統基礎字典，永久保留。

#### 3. `topics`
- **現狀：** 程式碼靜態定義。
- **資料表結構：** `id text primary key` (topic_code), `subject_id text not null references public.subjects(id)`, `name_zh text not null`, `name_en text not null`, `order_seq int not null default 0`, `is_core boolean default true`.
- **索引：** `topics_subject_id_idx ON public.topics(subject_id)`.
- **RLS 策略：** 全員唯讀；寫入僅限 `service_role`。
- **保留/刪除原則：** 系統課綱資料，隨課綱版本管理。

#### 4. `questions`
- **現狀：** 已存在（`0016` / `0017`）。
- **現有欄位：** `id text primary key`, `subject text`, `topic text`, `type text`, `difficulty text`, `data jsonb`, `synced_at timestamptz`.
- **新增欄位：** `content_version int not null default 1`, `source_type text not null default 'rewrite' check (source_type in ('original','rewrite','open_data'))`, `review_status text not null default 'auto_checked' check (review_status in ('auto_checked','under_review','verified','corrected','withdrawn'))`, `curriculum_code text`.
- **Migration 策略：** `ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS ...`，預設填入預設值，不影響線上讀取。
- **RLS 策略：** `anon` 與 `authenticated` 僅限 `SELECT`（0017 已 revoke 寫入權）；寫入限 `service_role`。

#### 5. `question_variants`
- **資料表結構：** `id uuid primary key default gen_random_uuid()`, `base_question_id text not null references public.questions(id)`, `variant_question_id text not null references public.questions(id)`, `variant_logic text not null`, `created_at timestamptz default now()`.
- **索引：** `question_variants_base_idx ON public.question_variants(base_question_id)`.
- **RLS 策略：** 全員唯讀；寫入僅限 `service_role`。
- **用途：** 支援學生錯題未通過時，自動調度同概念邏輯變式題。

#### 6. `attempts` (練習節作答記錄)
- **資料表結構：** `id uuid primary key default gen_random_uuid()`, `user_id uuid not null references auth.users(id) on delete cascade`, `subject_id text not null references public.subjects(id)`, `mode text not null check (mode in ('topic','diagnostic','checkpoint','review','quick'))`, `total_questions int not null`, `correct_count int not null`, `duration_seconds int not null`, `started_at timestamptz not null`, `completed_at timestamptz default now()`.
- **索引：** `attempts_user_id_created_idx ON public.attempts(user_id, completed_at desc)`.
- **RLS 策略：**
  - 預設 Deny All。
  - `SELECT`: `auth.uid() = user_id`。
  - `INSERT`: `auth.uid() = user_id`（由 Server Action 驗證後寫入）。
  - `UPDATE` / `DELETE`: 禁止客戶端直接修改；刪除僅限帳號抹除級聯。
- **敏感欄位：** 完整學習軌跡。

#### 7. `mistakes` (錯題本專屬表)
- **資料表結構：** `id uuid primary key default gen_random_uuid()`, `user_id uuid not null references auth.users(id) on delete cascade`, `question_id text not null references public.questions(id)`, `subject_id text not null`, `topic_id text not null`, `selected_option text not null`, `correct_option text not null`, `error_step text`, `first_failed_at timestamptz not null default now()`, `last_failed_at timestamptz not null default now()`, `fail_count int not null default 1`, `repair_status text not null default 'unrepaired' check (repair_status in ('unrepaired','in_review','repaired'))`, `repaired_at timestamptz`.
- **索引：** `mistakes_user_topic_idx ON public.mistakes(user_id, topic_id)`, `mistakes_user_status_idx ON public.mistakes(user_id, repair_status)`.
- **RLS 策略：** 嚴格鎖定 `auth.uid() = user_id`，禁止他人讀寫。

#### 8. `error_tags` (5 大認知錯因關聯表)
- **資料表結構：** `id uuid primary key default gen_random_uuid()`, `mistake_id uuid not null references public.mistakes(id) on delete cascade`, `user_id uuid not null references auth.users(id) on delete cascade`, `tag_category text not null check (tag_category in ('concept','misread','calculation','unit_format','trap_logic'))`, `student_note text`, `tagged_at timestamptz default now()`.
- **索引：** `error_tags_mistake_idx ON public.error_tags(mistake_id)`.
- **RLS 策略：** `auth.uid() = user_id`。

#### 9. `review_schedule` (艾賓浩斯間隔重溫排程)
- **資料表結構：** `id uuid primary key default gen_random_uuid()`, `user_id uuid not null references auth.users(id) on delete cascade`, `mistake_id uuid not null references public.mistakes(id) on delete cascade`, `due_date date not null`, `interval_day int not null check (interval_day in (1,3,7,14,30))`, `is_completed boolean not null default false`, `completed_at timestamptz`, `retry_pass boolean`.
- **索引：** `review_schedule_user_due_idx ON public.review_schedule(user_id, due_date, is_completed)`.
- **RLS 策略：** `auth.uid() = user_id`。

#### 10. `learning_plans` (個人每週學習計劃)
- **資料表結構：** `id uuid primary key default gen_random_uuid()`, `user_id uuid not null references auth.users(id) on delete cascade`, `subject_id text not null references public.subjects(id)`, `weekly_target_sessions int not null default 3 check (weekly_target_sessions between 1 and 7)`, `session_duration_minutes int not null default 15 check (session_duration_minutes between 10 and 60)`, `status text not null default 'active' check (status in ('active','paused','completed'))`, `created_at timestamptz default now()`, `updated_at timestamptz default now()`.
- **RLS 策略：** `auth.uid() = user_id`。

#### 11. `plan_tasks` (學習任務切片)
- **資料表結構：** `id uuid primary key default gen_random_uuid()`, `plan_id uuid not null references public.learning_plans(id) on delete cascade`, `user_id uuid not null references auth.users(id) on delete cascade`, `topic_id text not null`, `task_type text not null check (task_type in ('diagnostic','weakness_focus','topic_test','review'))`, `goal_description text not null`, `is_completed boolean default false`, `completed_at timestamptz`.
- **RLS 策略：** `auth.uid() = user_id`。

#### 12. `mastery_snapshots` (0-100 Mastery 掌握度快照)
- **資料表結構：** `id uuid primary key default gen_random_uuid()`, `user_id uuid not null references auth.users(id) on delete cascade`, `subject_id text not null`, `topic_id text`, `mastery_score numeric(5,2) not null check (mastery_score between 0 and 100)`, `trend text check (trend in ('up','down','stable'))`, `snapshot_date date not null default current_date`, `created_at timestamptz default now()`.
- **索引：** `mastery_user_subject_date_idx ON public.mastery_snapshots(user_id, subject_id, snapshot_date)`.
- **RLS 策略：** `auth.uid() = user_id`。

#### 13. `content_reports` (題目錯誤回報與追蹤)
- **現狀：** `0020_question_reports.sql` 僅記錄精簡分類。
- **升級資料表：** `id uuid primary key default gen_random_uuid()`, `report_code text not null unique`, `user_id uuid references auth.users(id) on delete set null`, `question_id text not null references public.questions(id)`, `category text not null check (category in ('content_error','ambiguous','unclear_explanation','format_issue'))`, `description text`, `status text not null default 'received' check (status in ('received','under_review','confirmed','resolved','withdrawn'))`, `reviewer_notes text`, `resolved_at timestamptz`, `created_at timestamptz default now()`.
- **RLS 策略：**
  - `INSERT`: 任何身分（包含匿名，若登入則附帶 `user_id`）。
  - `SELECT`: 回報人可憑 `report_code` 唯讀查詢進度；Reviewer / Admin / Founder 可讀取並更新全量回報。

#### 14. `audit_logs` (系統全域安全與操作日誌)
- **現狀：** 現有 `founder_audit_events` 僅記錄創辦人事件。
- **統一稽核表：** `id uuid primary key default gen_random_uuid()`, `actor_id uuid references auth.users(id)`, `actor_role text not null`, `action text not null`, `resource_type text not null`, `resource_id text`, `ip_hash text not null`, `user_agent_hash text`, `metadata jsonb default '{}'::jsonb`, `timestamp timestamptz not null default now()`.
- **RLS 策略：** 嚴格 Deny All。禁止任何客戶端（包括已登入學生）讀取；僅伺服器專用 Logger 可寫入；僅 Admin / Founder 可檢視。
- **禁止記錄：** 嚴禁寫入明文密碼、Session Token、API Key、學生作答文字細節。

---

## 3. RLS 設計與權限防護矩陣 (RLS & Access Control)

### 3.1 核心原則：預設拒絕 (Deny by Default)
1. 每一張新建立之資料表，必須首先執行：
   ```sql
   ALTER TABLE public.<table_name> ENABLE ROW LEVEL SECURITY;
   REVOKE ALL ON TABLE public.<table_name> FROM anon, authenticated, public;
   ```
2. 僅顯式賦予業務所需之最小權限（Least Privilege）。

### 3.2 角色矩陣與存取權限 (RBAC)

| 資料表 | Student (已登入) | Student (未登入/Anon) | Teacher / Reviewer | Admin / Founder |
| :--- | :--- | :--- | :--- | :--- |
| `questions` | `SELECT` | `SELECT` | `SELECT` | `SELECT` (寫入走 migration/script) |
| `attempts` | `SELECT`, `INSERT` (Own) | 拒絕 | 拒絕 | 唯讀稽核 |
| `mistakes` | `SELECT`, `INSERT`, `UPDATE` (Own) | 拒絕 | 拒絕 | 唯讀統計 |
| `error_tags` | `SELECT`, `INSERT` (Own) | 拒絕 | 拒絕 | 唯讀統計 |
| `review_schedule`| `SELECT`, `UPDATE` (Own) | 拒絕 | 拒絕 | 唯讀統計 |
| `content_reports`| `INSERT`, `SELECT` (Own/Code) | `INSERT`, `SELECT` (Code) | `SELECT`, `UPDATE` (審題) | `SELECT`, `UPDATE`, `DELETE` |
| `audit_logs` | 拒絕 | 拒絕 | 拒絕 | 唯讀審計 |

### 3.3 防禦機制實作
- **防範 IDOR (水平越權)：** 所有以已登入學生為基礎的操作，RLS Policy 強制綁定：
  ```sql
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
  ```
  在 Server Action 與 API 中，強制自伺服器 Cookie 取得 verified `user_id`（`getSyncUserId()`），絕不接受前端 Request Body 傳入之 `user_id`。
- **防範垂直越權 (Privilege Escalation)：** `profiles.role` 欄位禁止前端更新，僅可透過伺服器端白名單校驗的專屬管理端點變更。
- **防範 Mass Assignment (批量賦值)：** 所有 Server Actions 與 API 均透過 Zod 進行白名單 Schema 解析，排除非許可欄位。

---

## 4. 認證與授權架構設計 (Auth Design)

1. **認證流整合：**
   - 沿用並強化 **Supabase Auth Google OAuth**（SSR 模式）。
   - 瀏覽器與伺服器間透過 `HttpOnly`, `SameSite=Lax`, `Secure` 的 Cookie 傳遞 Session。
2. **Server Action 與 Route Handler 雙重校驗：**
   - 任何資料變更（Mutation），無論 Client 頁面是否已被保護，進入 Server Action / Route 後**必須立即執行授權守門函式**：
     ```ts
     const user = await getAuthUser()
     if (!user) throw new Error('UNAUTHORIZED')
     ```
3. **金鑰與權杖保護：**
   - Refresh Token 自動輪換（Supabase 內建 Token Rotation）。
   - 登出時呼叫 `supabase.auth.signOut()`，同步清理客戶端與伺服器端 Session Cookie。
   - 支援「登出所有裝置」，撤銷該用戶名下所有 Refresh Token。
4. **管理員二步驟驗證 (2FA / Passkey) 規劃：**
   - 針對具備 Reviewer / Admin / Founder 權限之帳戶，要求開啟 Google 2FA，並於後台操作敏感變更時進行二次憑證比對。

---

## 5. 密鑰管理清單 (Secret Management)

| 密鑰名稱 | 範圍 (Scope) | 允許環境 | 用途 | 洩漏後果 | 輪換方案 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | 公開 (Client/Server) | Dev, Preview, Prod | 專案連線位址 | 無直接危害 | 變更專案設定 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 公開 (Client) | Dev, Preview, Prod | 題庫唯讀及 Auth 初始連線 | 題庫爬取（已為公開內容） | Supabase 後台一鍵輪換 |
| `SUPABASE_SERVICE_ROLE_KEY` | **伺服器專用 (Server-Only)** | Server, CI (受控) | 繞過 RLS 之特權操作與遷移 | **P0：資料庫全部資料外洩** | 立即於後台 Revoke 並更新 Vercel Env |
| `CRON_SECRET` | 伺服器專用 | Prod | Vercel Cron 定時排程保護 | 遭受排程阻斷或反覆觸發 | 生成隨機 32 位字串更新 |
| `VAPID_PRIVATE_KEY` | 伺服器專用 | Prod | Web Push 簽名 | 偽造推播通知 | 重新生成金鑰對 |
| `FOUNDER_GOOGLE_SUB` | 伺服器專用 | Prod, Staging | Founder OS 權限綁定 | 創辦人身分冒用風險 | 更換綁定之 sub ID |

*防護邊界：* 嚴格禁止使用 `NEXT_PUBLIC_` 前綴存放特權金鑰；CI 內建 `secret-scan` 與 `barrel-guard`，若發現 service key 進入 client bundle 立即中斷 build。

---

## 6. 威脅模型 (Threat Model & Mitigations)

1. **Account Takeover / Credential Stuffing：** Google OAuth 委託認證 + `proxy.ts` 滑動窗口限流 + 異常 IP 速率限制。
2. **IDOR (水平越權)：** RLS 強制 `auth.uid() = user_id` + 後端過濾強制以 session id 為唯一查詢條件。
3. **Privilege Escalation (垂直越權)：** 角色欄位客戶端不可寫 + 白名單硬編碼與 Google sub 雙重綁定。
4. **XSS (跨站腳本)：** Next.js 自動轉義 + 強制 CSP (Content Security Policy) 與每請求獨立 Nonce，嚴禁 `unsafe-inline`。
5. **CSRF (跨站請求偽造)：** Server Actions 內建 Host/Origin 標頭比對（`originFromHeaders()`）+ Cookie 採用 `SameSite=Lax`。
6. **SQL Injection：** 全面使用 Supabase / PostgREST 參數化查詢，絕不拼接 SQL 字串。
7. **Mass Assignment：** Zod Strict Schema 白名單校驗，忽略未宣告欄位。
8. **Rate-limit Bypass：** 提取 Vercel 信任之真實 IP 標頭，針對 Auth/Report/Feedback 端點施加嚴格配額。
9. **Data Exfiltration (資料拖庫)：** 題庫外之學生資料表全鎖，嚴格限制分頁上限（Max 50 行），禁止無限制批量 Dump。
10. **Supply-chain Attack (供應鏈攻擊)：** 鎖定 `package-lock.json`，開啟 Dependabot 與 CI 安全審計。
11. **DDoS：** 邊緣 Cloudflare / Vercel Edge 緩存，題庫直連 Supabase 減輕運算壓力。
12. **Content Tampering (內容竄改)：** 題庫正本保留於 Git 版本庫，資料庫僅為衍生鏡像，寫入僅限 service_role。
13. **Sensitive Data Leak in Logs：** 採用 `safeLog()` 集中清洗日誌，去除 PII、密碼、Token 與堆疊細節。

---

## 7. 監控、稽核與脫敏原則 (Logging & Monitoring)

- **必須記錄事件：**
  - 登入成功 / 失敗回調
  - 新裝置登入事件
  - 帳號抹除請求與執行結果
  - RLS / 授權失敗阻擋事件
  - 內容錯誤回報提交
  - 題目上下架與審核狀態更新
- **脫敏原則 (Zero PII Logging)：**
  - 嚴禁記錄密碼、金鑰、完整 Token、身分證號。
  - 電郵地址進行遮罩處理（例如：`b***n@gmail.com`）。
  - IP 地址僅儲存 SHA-256 雜湊值（加鹽），僅供防刷限流識別，不存儲明文。

---

## 8. 備份、還原演練與事故應變 (Backup & Incident Response)

### 8.1 備份策略
- **每日自動快照：** Supabase 平台託管每日 WAL 自動備份。
- **每週獨立邏輯備份：** 自動化排程腳本匯出 `user_progress`, `mistakes`, `learning_plans` 之去識別化資料庫 Dump，加密儲存於獨立安全雲端儲存槽。
- **版本回滾基準：** 任何資料庫 Migration 必須具備對應之 `down.sql` 回滾腳本，確保可隨時退回上一穩定版本。

### 8.2 還原演練 (Restore Drill)
- 每季度執行一次離線還原演練，驗證：
  1. 備份檔案解密與載入時間 $\le 30 \text{ 分鐘}$。
  2. 資料完整性校驗（主鍵衝突、關聯完整性、筆數一致）。
  3. 驗證新建立的測試用戶能否正常讀取還原之歷史進度。

### 8.3 事故應變 Runbook (Incident Response)

```text
[偵測到異常/回報] (0-30 min)
    ├── 評估嚴重度：P0 (金鑰洩漏/大量越權) / P1 (部分端點異常) / P2
    └── 指派 Incident Commander (首席全端工程師兼保安負責人)
          │
[遏制階段 Containment] (30-120 min)
    ├── 若金鑰疑似洩漏：立即至 Supabase 控制台 Revoke SERVICE_ROLE_KEY 並更新 Vercel
    ├── 若特定帳號被盜：立即撤銷該帳號 Session 並阻斷其操作
    ├── 若受攻擊端點異常：藉由 proxy.ts 或環境變數一鍵切換維護降級模式
    └── 封鎖惡意攻擊者 IP 雜湊
          │
[影響評估 Impact Assessment] (2-4 hours)
    ├── 查詢 audit_logs 分析受影響資料行數與範圍
    └── 確認是否有未成年人個人資料被非授權讀取
          │
[通報與修復] (4-24 hours)
    ├── 若涉及個資外洩：依據 PDPO 規範啟動用戶通報與聲明指引
    └── 部署 Hotfix 修復補丁並執行迴歸驗證
          │
[事後檢討 Post-Mortem] (72 hours)
    └── 產出完整事故報告、根本原因分析 (RCA) 與預防改進清單
```

---

**Phase 4B 完成，等待批准。**
