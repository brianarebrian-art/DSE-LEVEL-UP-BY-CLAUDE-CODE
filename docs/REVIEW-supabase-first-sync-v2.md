# 技術審核：Supabase-First 跨裝置即時同步規格書 v2.0

**審核日期**：2026-07-30 · **審核對象**：`dse-level-up-supabase-first-sync-spec-v2.md`
**結論**：**不予執行**。核實方式為對 live 資料庫（`aegekxapxgcfdrkzisis`）同 repo 逐項查證，非推測。

---

## A. 一跑即死嘅硬錯誤（migration 連第一步都行唔到）

### A1. `question_events` 表【唔存在】

規格 §2.1 將佢列為「現存表（Phase 0）」並「沿用」，§2.2 對佢 `ALTER TABLE`，§4.1 stored
procedure 又 `INSERT INTO` 佢。實查 `information_schema.tables`，`public` 只有 8 張表：

```
agent_memory · agent_traces · escalation_queue · profiles
review_decisions · user_progress · user_sessions · user_settings
```

`question_events` 早已隨教師雷達一併刪除。`ALTER TABLE public.question_events` 會即時失敗。

### A2. `profiles` 表【冇 `email` 欄】

實查欄位：`user_id (text)` · `role (text)` · `display_name (text)` · `created_at (timestamptz)`。

規格全篇以 `google_email TEXT NOT NULL REFERENCES public.profiles(email)` 做外鍵
（`student_progress`、`device_sessions` 都係），另有 `.eq('email', email)` 查詢、
§10.1 聲稱 Google Email 存於 `profiles.email`。**該欄由頭到尾唔存在**，
而且 `REFERENCES` 亦要求被引欄有 UNIQUE 約束。

### A3. `CREATE POLICY IF NOT EXISTS` 係【語法錯誤】

規格 §3.1 四條 policy 全部用呢個寫法。實測（對一張唔存在嘅表落 probe，確保零副作用）：

```
ERROR: 42601: syntax error at or near "not"
LINE 1: create policy if not exists "syntax_probe_never_created"
                         ^
```

報錯位置喺 `not` —— 係 **parse 階段**失敗，唔係「表唔存在」。PostgreSQL 嘅 `CREATE POLICY`
並無 `IF NOT EXISTS` 變體。四條 policy 一條都建唔到。

---

## B. 用錯 API、用未安裝嘅套件

| 規格寫 | 實況 |
|---|---|
| `getServerSession(authOptions)` from `next-auth` | 呢個係 **Auth.js v4** API。本站係 **v5**（`next-auth@^5.0.0-beta.31`），全 repo 搜唔到 `getServerSession` 或 `authOptions`。真實 helper 係 `getSyncUserId()`（`lib/auth/server.ts`），而且已預留 Better Auth 切換 |
| `import { getServiceSupabase } from '@/lib/supabase'` | 真實路徑係 `@/utils/supabase/server` |
| `import { LRUCache } from 'lru-cache'` | **未安裝**。憲章嚴禁新增套件 |

---

## C. 設計缺陷（就算改正咗 A、B 依然唔應該行）

### C1. `mastery_level` 公式壞咗，而且方向係【反】嘅

規格 §4.1 設計說明聲稱：「避免『頭 10 題全錯、後 10 題全對』仍顯示 50% 嘅失真」。
照公式逐字模擬（`DO UPDATE` 內 `public.student_progress.*` 取舊值）：

| 情境 | 規格公式 | 純終身正確率 | 真 EWMA（α=0.3） |
|---|---|---|---|
| 頭 10 錯 → 後 10 對（**進步**） | **48.5%** | 50.0% | 97.2% |
| 頭 10 對 → 後 10 錯（**退步**） | **51.5%** | 50.0% | 2.7% |
| 頭 50 錯 → 後 50 對 | 49.7% | 50.0% | — |

三件事：

1. 佢**冇解決**自己講嗰個問題 —— 48.5% 同 50% 冇分別。
2. 佢**方向係反**嘅：**努力進步嘅學生顯示 48.5%，退步嘅學生顯示 51.5%**。
3. n 一大就收斂返去終身正確率（n=100 時 49.7%），既非「最近 10 題」亦非 EWMA。

第 2 點唔止係數學錯 —— 一個由全錯捱到全對嘅學生，掌握度顯示得**比退步嘅同學低**，
直接違反憲章「絕對禁止打擊自信」。

### C2. In-memory rate limit 喺 serverless 上無效

`LRUCache` 存喺 lambda instance 記憶體。Vercel 每個並發請求可能係唔同 instance，
scale 出去之後「每分鐘 30 次」形同虛設。文件仲標題寫住「Vercel Hobby 兼容版」。

### C3. 防重複提交嘅約束防唔到嘢

§13 寫「`question_id` + `created_at` 聯合唯一約束」。`created_at` 每次提交都唔同，
呢個約束**永遠唔會觸發**。

### C4. 遷移邏輯會靜靜咁乜都唔搬

§8 讀 `localStorage.getItem('dse_mistake_dna')` —— **呢個 key 全 repo 唔存在**。
真實 key 係 `dse_topic_stats`、`dse_reverse_log`。而 `dse_progress` 係一個
`AttemptRecord[]` 陣列，同 `student_progress` 嘅 `(subject, topic_id)` 逐行結構對唔上。
結果：舊用戶會以為遷移成功（`dse_sync_migrated=true` 照樣寫落去），實際三個月進度清零。

### C5. Keep-alive cron 解決緊一個唔存在嘅問題

§13 建議「Vercel Cron 每 5 分鐘 ping Supabase 保持喚醒」。Supabase Free 係
**閒置**先休眠；有真實日活用戶就唔算閒置。另外 Vercel Hobby 嘅 cron 頻率有上限
（需自行核實），每 5 分鐘大概率行唔到。

---

## D. 產品與憲章紅線（呢部分任何一條都足以否決）

### D1. 強制登入 —— 匿名學生【做唔到題】

§6 `submitAnswer()`：未登入就 `alert('請先使用 Google 帳號登入…')` 然後 `return false`。
即係**冇 Google 帳號就練唔到習**。

呢個推翻已確立嘅立場：Google 登入 = **跨裝置同步 ONLY，唔給任何額外權限**；
平台 100% 免費、人人可用。好多 12–18 歲學生冇／唔用 Google 帳號，部分學校網絡仲封鎖。
**呢一條本身就足以否決整份規格。**

（順帶：`alert()` 係阻塞式彈窗，違反規格自己 §7.1「不彈出阻塞視窗」。）

### D2. 對未成年人做裝置指紋追蹤

§10.1 以「唔儲存 IP 地址」為由聲稱 PDPO 合規。但 `device_sessions.device_fingerprint`
係**比 IP 更持久嘅跨 session 追蹤識別碼** —— IP 會變，指紋唔會。

而 §7.2 描述嘅跨裝置體驗**根本唔需要指紋**（用 user id 就夠）。唯一寫低嘅用途係
§13「防止濫用」—— 即係為咗防一個喺免費、無獎勵、無排行榜產品上**唔存在**嘅威脅，
去追蹤學生。刪 IP 加指紋唔係合規改善，係倒退。

### D3. 用 raw email 做全表 join key —— 隱私倒退

現行 schema 用不透明嘅 Google `sub`（`user_progress.user_id` 為 text）。
規格改用 `google_email` 做 PK／FK 散佈每一張表。一份聲稱 PDPO 合規嘅文件，
反而將**直接識別個人資料**寫到成個資料庫都係。

### D4.「絕對不將資料存回 localStorage」＝ 設計上必然掉數據

§7.3 明文禁止落地本機，§6 隊列只存 React 記憶體（`useRef`）。學生喺地鐵做 15 題，
app 被 OS 殺（平價手機記憶體壓力極常見）或者 tab 被回收 → **15 題全冇**。

呢個**直接傷害憲章最優先嗰批學生**：基層、網絡不穩、用舊機嘅考生。
現行 localStorage-first 架構喺呢個情境下係零損失。

---

## E. 佢想要嘅嘢，大部分【已經上線】

| 規格提議新建 | 實況 |
|---|---|
| `/api/sync/submit-answer`、`/api/sync/fetch-state` | `app/api/progress/route.ts` 已有 GET（拉雲端）+ POST（upsert） |
| `useSupabaseSync` hook | `lib/sync.ts`（176 行）+ `components/SyncProvider.tsx` 已有 |
| 衝突處理 | 現有 `mergeSnapshots()` 有**三分支**：A 冇雲端行→留本地；B 本機未同步過→**數據較完整嘅一邊贏**（防蓋走努力）；C 已建立→較新者贏。規格提議嘅單純「後寫勝出」**會蓋走 B 分支**，係退步 |
| `profiles.sen_preferences` JSONB（open_dyslexic／line_focus_guide／hide_timer） | `user_settings` 表 + `/api/sync/settings` **已經同步緊同樣三個欄位**（`easy_font`／`reading_ruler`／`hide_timer`），純重複建設 |
| `device_sessions` | `user_sessions` 表已存在（0 行 —— 前端從未寫入，係另一個待決問題） |

---

## F. 建議

**唔好行呢份規格。** 想要嘅價值（跨裝置同步）現時已經有；規格會用一個
**做唔到防篡改、會掉數據、要強制登入、會追蹤未成年人**嘅架構去換走佢。

如果想加固現有那條線，可行嘅細範圍改動（全部 $0、唔改架構）：

1. `/api/progress` POST 加 payload size cap（例如 256 KB）同基本 schema 驗證
2. 加 server-side 時鐘合理性檢查（拒絕明顯未來嘅 `updatedAt`）
3. 為 `user_progress` 加 `updated_at` 索引（如查詢量升）

呢三項先要創辦人拍板要唔要做；本文件階段**零代碼、零 migration 改動**。
