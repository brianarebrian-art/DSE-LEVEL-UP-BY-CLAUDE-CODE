# 審核：藍圖執行版 v1.0（任務 01／03／04／05／10／11／12）

> 對象：`dse-level-up-blueprint-claude-code-prompt.md`（2026-07-31）
> 方法：逐條對 **live Supabase**（project `aegekxapxgcfdrkzisis`）同 **真 repo** 核，唔採信文件自述
> 性質：Phase 1 唯讀審核（憲章 §4）。文件本身要求「唔准只講概念」，所以本報告只寫實測到嘅嘢。

---

## 0. 一句話結論

7 項之中 **0 項可以照規格執行**：01／03／04／05／10／11 各有硬性技術錯誤或撞紅線，12 想要嘅效果已經上線。

但審核途中查到**一個已上線嘅真 bug**，而佢正正就係任務 05 想達成嘅目標 —— 已修（見 §3）。

---

## 1. 逐項判詞

| # | 名稱 | 判詞 | 一句話理由 |
|---|---|---|---|
| 01 | Edge Config 難度校準 | ❌ 前提錯 | SQL 引用嘅兩個欄位都唔存在，數據源本身亦唔存在 |
| 03 | ISR 題目頁靜態化 | ❌ 前提錯 | 題目喺 TypeScript 模組，唔喺 Supabase；路由亦唔存在 |
| 04 | FDW 真實數據出題 | ❌ SQL 執行唔到 + 撞紅線 | `http` 唔係 FDW；已審批題目會自己變動 |
| 05 | Rewrites 學科路由 | ❌ id 虛構 + 反效果 | 例子 id 唔存在；真正阻礙 SEO 嘅係另一件事（已修） |
| 10 | Edge Middleware 地理 | ❌ API 已移除 + no-op | `req.geo` 喺 Next 15 已刪；設 header 改變唔到 CDN 路由 |
| 11 | Audit Triggers | ❌ 增加而非減少 PDPO 風險 | 會令已上線嘅刪除權失效 |
| 12 | Draft Mode 預覽 | 🟡 已有 | `/admin` 已做；`isSubjectLead()` 唔存在 |

---

## 2. 實測證據

### 01 — `user_progress` 冇文件講嗰兩個欄位

文件 SQL：`SELECT difficulty, AVG(correct_rate) FROM user_progress GROUP BY difficulty`

實測 `information_schema.columns`，`user_progress` **只有 6 欄**：

```
id (uuid) · user_id (text) · progress_data (jsonb)
total_questions_done (integer) · last_active_at · updated_at
```

**冇 `difficulty`，冇 `correct_rate`。** 呢個直接違反文件自己 §④ Rule #1「禁假設 schema」。

更根本：數據源唔存在。未登入用戶 100% 行 localStorage、零 Postgres 寫入；78 行 `user_progress` 嘅 `total_questions_done` **全部係 0**，逐課題數據藏喺 `progress_data` JSON 嘅 `dse_topic_stats` key 入面，**冇難度維度**。上一批 08 實測 `pg_stat_statements` 零應用層查詢，已經印證同一件事。

另：`@vercel/edge-config` 未安裝（撞 Rule #4）。SDK 可以用 raw fetch 繞開，但數據源問題無解。

憲章風險：全平台校準會令個別學生實際做到嘅題偏離 3:5:2 —— 而 3:5:2 係已上線嘅服題契約。

### 03 — 題目根本唔喺資料庫

- `app/question/` **唔存在**，冇 `/question/[id]` 路由。
- 5,166 條題目係 `data/questions/*.ts` **TypeScript 模組**，隨 bundle 送到瀏覽器。`review_decisions`（58 行）只存審批決定，唔存題目內容 —— 實測欄位為 `batch / draft_id / subject / topic / decision / comment / reviewer_email / reviewer_name`。
- 即使建咗路由，題庫係**編譯進 bundle**，「wire 入 load.ts」之後必須重新部署先生效；revalidate 一個靜態頁改變唔到已編譯模組。
- `pg_net`（Database Webhooks 依賴）實測 **未安裝**（`installed_version: null`）。
- 驗收指標「LCP < 100ms」本身唔成立：LCP 包含網絡往返，真實流動網絡做唔到。

### 04 — 嗰段 SQL 執行會直接失敗

```sql
CREATE FOREIGN TABLE external.cpi_data (...) SERVER http_server OPTIONS (uri '...');
```

`http` extension 提供嘅係**函數**（`http_get()` 等），**唔係** foreign-data wrapper；Postgres 冇 `http_server` 呢個 FDW server type。呢段 SQL 唔會 work。

而且 `http` 同 `wrappers` **兩個都未安裝**（available ≠ installed）。文件寫「Supabase 原生支援」係指可以裝，唔等於已經有。

**撞紅線（比語法錯更嚴重）**：題目數字如果跟外部 API 走，一條**已經真人審批過**嘅題目會喺學生做緊嗰刻自己變數字，而答案係固定嘅 —— 直接製造錯題。呢個同時撞「機器永不自動入庫」同題目正確性。

正確做法：出題**當刻**由真人抄低數字寫死入題目，並註明數據年份同來源。政府開放數據做情境冇問題，做 runtime 依賴就有問題。

### 05 — 例子 id 係虛構

文件例子 `/econ/*` `/chi/*`。實測 25 個真實 subject id：

```
math m2 m1 physics chemistry biology english chinese bafs ict economics csd
chinese-history history geography chinese-literature english-literature
ethics-religious ths health-management design-tech visual-arts music pe
technology-living
```

**冇 `econ`，冇 `chi`** —— 係 `economics` 同 `chinese`。照抄會全部 404。

文件又寫「`user_progress` 按 `subject` 欄位過濾」—— 實測 6 欄入面**冇 `subject`**。

另外 `app/subjects/[subject]/page.tsx` 已經有 `generateStaticParams()` + `notFound()`，25 科各有獨立靜態頁同獨立 URL。加 rewrite 只係畀同一頁**第二個 URL**，屬自製 duplicate content，SEO 上係減分。

專案亦冇 `vercel.json`，而 `next.config.ts` 已有 `headers()`；路由配置分兩處會分裂。

### 10 — API 已移除，而且係 no-op

- `req.geo` 喺 **Next.js 15 已經移除**，本 repo 係 16.2.9。而家要讀 `x-vercel-ip-country` header，或用 `@vercel/functions` 嘅 `geolocation()`（**未安裝**）。
- `res.headers.set('x-cdn-region','hkg1')` **咩都唔會做**。Vercel Edge Network 本身自動路由到最近 PoP；一個自訂 response header 影響唔到 CDN 選點。呢個功能係純 no-op，代價係**每一個請求**都多行一次 proxy。
- 文件 §③ 自己寫明「Middleware：`proxy.ts`（唔係 `middleware.ts`）」，但任務 10 個 code block 就用 `middleware.ts` + `export function middleware` —— **同一份文件自打嘴巴**。實際檔案係 `proxy.ts`（53 行，已做緊 rate limiting）。
- 「延遲 < 50ms」對未登入用戶無意義：佢哋 100% localStorage，根本唔 call Supabase。

### 11 — 會令已上線嘅刪除權失效

`old_data JSONB, new_data JSONB` 會將**整行 `user_progress`** 複製一份，即係學生完整學習紀錄**多存一份**。呢個係數據增生，同 PDPO 最小化原則相反。

**最嚴重一點**：`/account` 有已上線嘅 PDPO 抹除功能。刪咗 `user_progress` 之後，`audit_log.old_data` 仲完整保留住 —— 學生行使咗刪除權，但數據仲喺度。呢個係法律問題，唔係技術取捨。

- `pg_cron`（90 日清理依賴）實測 **未安裝**。
- Log Drains 據 Vercel 公開分級係 Pro+ 功能。**呢點我喺呢個環境確認唔到你哋實際 plan**，如果係 Hobby 就直接撞 $0 死鎖 —— 需人手確認。
- 一個啱嘅地方：`user_progress` **真係有 `id` uuid 欄**，所以 `COALESCE(NEW.id, OLD.id)` 語法上行得通。

### 12 — 想要嘅效果已經上線

- `isSubjectLead()` **唔存在**；`lib/auth/roles.ts` 隨教師雷達一齊刪咗。而家係 `lib/auth/adminAllowlist.ts`。
- `/admin` 已經做緊：Auth.js 閘 + 逐題預覽（P2-5 已按 type render）。學科首席登入即見。
- 真缺口只有一個：**冇 Google 帳號嘅審批人睇唔到**。Draft Mode 24 小時連結解決到，但同文件自己寫「只限內部學科首席使用」有張力 —— 一條 URL 就係一條 URL，冇登入閘，轉發咗就冇得收。
- `NextResponse.redirect()` 需要絕對 URL，文件個 code 傳相對路徑會 throw。

---

## 3. 已修：全站 canonical 指向首頁（任務 05 想解決嘅真正問題）

`app/layout.tsx` 原本設 `alternates: { canonical: '/' }`。根 layout 嘅 metadata 會被**全站每一頁繼承**，所以實測結果係：

```
/                    → 首頁 ✓
/subjects            → 首頁 ✗
/subjects/math       → 首頁 ✗
/subjects/economics  → 首頁 ✗
/methodology         → 首頁 ✗
/practice            → 首頁 ✗
```

即係 25 個科目頁全部向搜尋引擎宣告「我係首頁嘅複製品，收錄首頁就得」。任務 05 寫住要「SEO 獨立索引每科頁面」—— 真正擋住佢嘅係呢行，唔係缺少 rewrite。

**修法（3 檔）**：根 layout 移除 `alternates`（附原因註解防復發）；`/subjects` 同 `/subjects/[subject]` 各自宣告 canonical。未宣告嘅頁面由搜尋引擎以該 URL 自身為準，此即正確預設。

**實測結果**：

```
/                            （無，＝以自身為準）
/subjects                    → /subjects
/subjects/math               → /subjects/math
/subjects/economics          → /subjects/economics
/subjects/technology-living  → /subjects/technology-living
/notes/math                  → /notes/math      （原有，未受影響）
/answer-sheet                → /answer-sheet    （原有，未受影響）
```

---

## 4. 文件做得啱嘅地方

- §④ Rule #5 同附錄陷阱表都已寫「用『近 30 日練習』而非『連續打卡』」—— 吸收咗同日嘅改動。
- 附錄 10 條陷阱之中 8 條準確：`getSyncUserId()`、`@/utils/supabase/server`、`proxy.ts`、`correctIndex`、`question_events` 已刪、`profiles.email` 唔存在、原生 Map 取代 `lru-cache`、書面語。
- §③ 提到「`dse_progress`（MC 專用，長題不可寫入）」—— 準確，同決策 ① 一致。

## 5. 文件自己作咗一個 localStorage key

§③ 寫「`dse_daily_note` — 今日提示冷卻」。**呢個 key 唔存在**（全 repo grep 零命中）。真實係 `dse_nudged_at`（冷卻）同 `dse_today_nudge`（今日已選），分兩個 key 係為咗避開 React StrictMode double-invoke。

同一份文件嘅附錄陷阱表先啱啱教人「唔好用虛構 key `dse_mistake_dna`」，前面就自己作咗一個。

---

## 6. 建議

1. **7 項全部唔好照做。** 01／03／04 需要「題目上雲」呢個前置決策（task #93）先有意義；喺題目仍然係 TypeScript 模組嘅前提下，三者都冇數據源。
2. **10 建議永久放棄** —— 就算修正 API，佢做嘅嘢本身係 no-op。
3. **11 如果真係要審計鏈**，正確方向係只記 metadata（誰、何時、改咗邊張表），**唔記 `old_data`／`new_data` 內容**，咁先同刪除權並存。呢個要先過法務。
4. **12 唯一值得考慮嘅子問題**係「冇 Google 帳號嘅審批人點審」，但呢個係流程問題，唔一定要用 Draft Mode 解。
5. **05 嘅真正目標已經達成**（見 §3），唔需要 rewrite 層。
