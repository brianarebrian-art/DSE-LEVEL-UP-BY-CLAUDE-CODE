# 🤖 DSE LEVEL UP — Agentic Harness v5.0（融合終極版）

> **版本**：v5.0 Synthesis（Gemini 企業級白皮書 × Kimi v4 實作 × 真實項目校正）
> **日期**：2026-07-22
> **性質**：從「傳統 Web App」升級為「自主 AI 教練 Agent 生態系統」，並以 2026 企業級 SOTA Harness 規格為標尺、以 DSE LEVEL UP 真實架構為地基
> **分層策略**：Tier 0（$0，實施主體） → Tier 1（$50–150/月，可選擴展藍圖）
> **語言**：全文標準書面語（符合語言紅線；程式碼註解按需）

---

## 融合來源說明（本文件如何組成）

本文件不是三份草稿的拼接，而是一次校正過的整合。三個來源各司其職：

| 來源 | 貢獻 | 在本文件的角色 |
|---|---|---|
| **Gemini 白皮書**《2026 企業級 SOTA AI Agent Harness 規格評估》 | 五大維度標準、量化落差分析、威脅模型（NSA MCP 指引 + OWASP MCP Top 10）、中央 Gateway 治理、OpenTelemetry GenAI 規範、可審計度量矩陣 | **標尺與框架**：定義「怎樣才算最高規格」，以及如何量化驗收 |
| **Kimi v4** `dse-agentic-harness-v4.md` | DSE 五層具體實作（沙箱／記憶／雙引擎／熔斷／遙測）、Agent 角色映射、Tier 0 路線圖與工時 | **實作骨架**：把抽象標準落成 DSE 可執行的程式碼與步驟 |
| **真實項目認識**（本會話深度掌握現有 codebase） | Auth.js + server-only `service_role`、100% localStorage、純 SVG、`--webpack`、`correctIndex`、`drafts → review → decisions.json → promote` 人工流水線、現有 `scripts/qbank/*` 守閘、`i18n-guard` | **校正與地基**：把標準與實作，對齊到 DSE 真正跑得起、且守得住紅線的形態 |

> **v4 → v5 三大關鍵校正**（詳見附錄 A）：
> 1. **記憶層 RLS**：v4 用 Supabase Auth 的 `auth.uid()` 做隔離——但真實架構**冇 Supabase Auth**（用 Auth.js + server-only `service_role`）。v5 改為「伺服器端 service_role 按 app-session `user_id` 收窄」的隔離模型。
> 2. **$0 向量嵌入**：v4／Gemini 都把 `vector(1536)`（OpenAI text-embedding-3-small）焗死入 schema——但 §5 財務紅線禁付費 API。v5 的 Tier 0 改用**免費本地嵌入**（`gte-small` 384 維／Transformers.js）或關鍵字回退；1536 維 OpenAI 留給 Tier 1。
> 3. **裁決字眼**：v4 的 Evaluator 用「FAIL」——雖屬內部狀態，但為守情緒紅線（§4）避免任何洩漏，v5 內部裁決改為 `PASS / REVISE / BLOCK`，且**永不面向學生**。

---

## 0. 執行摘要（判斷）

**判斷**：DSE LEVEL UP 現行「Claude Code + Vercel / Supabase / Notion 三連接器直連（P2P）」架構，在**記憶維度**已有良好底子（Supabase pgvector + 結構化題庫 + Notion 知識庫），但在**環境隔離、控制防禦、安全治理、可觀測性**四維，與 2026 企業級 SOTA 標準存在結構性落差。本 Harness 以 **Tier 0（$0）**先用現有免費工具模擬約 80% 的 Agent 執行網格能力，驗證價值後再視需要升 Tier 1。

**五維成熟度速覽（Tier 0 目標）**

| 維度 | 現況 | 落差 | v5 Tier 0 目標 |
|---|---|---|---|
| 環境隔離 | 本機／Edge 無硬隔離 | 高 | Vercel Edge Isolate + 10 秒硬超時 + SHA-256 指紋去重 |
| 記憶 | pgvector + 題庫 + Notion，缺主動壓縮 | 中 | 三級記憶（L1/L2/L3）+ Janitor 壓縮，**$0 本地嵌入** |
| 控制防禦 | 靠模型自停／Max Iterations | 高 | 雙引擎 Generator/Evaluator + 語義熔斷 + $10 成本斷路 |
| 安全治理 | 明文 Token、全或無授權 | **極高**（v4 幾乎缺席） | 憑證不落客戶端 + 工具最小權限清單 + Schema 哈希 + 危險 SQL 攔截 |
| 可觀測性 | console.log／連接器日誌 | 高 | 每個 Thought/Tool 帶 `trace_id` 的結構化 JSON 遙測 + 成本看板 |

**三條不可動搖的地基**（貫穿全文）：
- **$0 死鎖**：Tier 0 全部使用免費額度；任何觸及付費 API 的設計一律降級或移到 Tier 1，須 Brian/Yuna 聯合批准。
- **機器永不自動入庫**：Agent 產出一律進 `drafts`，經 `review-drafts.mjs` → 真人逐題批 → `promote-drafts.mjs` → 實名 `decisions.json` → 人手 wire 入 `load.ts`。雙引擎只是把關，不取代人。
- **大愛與紅線內建於 Evaluator**：術語紅線、版權（平行改寫法）、情緒安全（無紅字／無「FAIL」面向學生）、受眾鎖定（12–18 歲、無大學超綱），全部是硬檢查，不是建議。

---

## 1. 假設、範圍與非目標

### 1.1 真實架構基線（v5 一切設計必須對齊）

| 項目 | 真實狀態（校正 v4 的想當然） |
|---|---|
| 認證 | **Auth.js（Google OAuth）**；伺服器端 `getServiceSupabase()` 用 `service_role`。**冇 Supabase Auth、冇 `middleware.ts`。**（`better-auth` 與 `next-auth` 並存於 `package.json`，遷移仍在進行——見待決策項 D-1） |
| 資料 | **100% localStorage 為主**；Supabase 只經 server-only `service_role` 存取，`service_role` **永不落客戶端** |
| RLS | 因無 Supabase Auth，`auth.uid()` 型 RLS **不適用**；隔離改由伺服器端按 app-session `user_id` 收窄查詢 |
| 圖表 | 純 SVG + Tailwind；**禁 Chart.js / D3 / Recharts** |
| 建置 | `next build --webpack`；dev port **3001** |
| 題目 JSON | 用 `correctIndex`（0–3）非字母式；選項會洗牌；**解析引內容不引字母** |
| 生產紀律 | `drafts → review-drafts.mjs → 真人逐題批 → promote-drafts.mjs → 實名 decisions.json → 人手 wire 入 load.ts`；**機器永不自動入庫** |
| 現有守閘 | `scripts/qbank/term-guard.mjs`、`validate-banks.mjs`、`budget-guard.mjs`、`hkeaa-monitor.mjs`、`scripts/i18n-guard.mjs`，全部串入 `npm run qa` |

### 1.2 非目標（永久攔截，復建＝不合格；見 54-idea §6）

- 不重建 **JUPAS 預測器／收生機率**、**老師平台／IEP**、**Gamification**（EXP／段位／combo／火焰／解鎖）。
- 不引入 **付費第三方 API**（含付費 embedding）至 Tier 0；Tier 1 才可選。
- 不引入 **假統計／假在線人數／假見證**。
- 不使用 **舊名**（Aethel／WisdomPath／化城避風港／Buff 補給艙）。
- Agent **不面向全齡層／亞太區擴張／終身學習**；鎖死 12–18 歲香港 DSE。

---

## 2. 架構總覽：DSE LEVEL UP AI Agent 執行網格（五層）

```
┌──────────────────────────────────────────────────────────────────────────┐
│              DSE LEVEL UP — AI Agent Execution Mesh (v5)                   │
│      Agent = Model + Harness；模型負責推理，Harness 負責安全與確定性        │
└──────────────────────────────────────────────────────────────────────────┘
   ┌───────────────┬───────────────┬───────────────┬───────────────┐
   ▼               ▼               ▼               ▼               ▼
┌─────────┐   ┌─────────┐   ┌─────────┐   ┌──────────────┐   ┌────────────┐
│環境隔離 │   │ 記憶層  │   │控制防禦 │   │  安全治理    │   │ 可觀測性   │
│Sandbox  │   │Memory   │   │Dual+CB  │   │Governance★   │   │Observ.     │
├─────────┤   ├─────────┤   ├─────────┤   ├──────────────┤   ├────────────┤
│Edge     │   │L1 Ctx   │   │Generator│   │憑證不落客戶端│   │trace_id/步 │
│Isolate  │   │L2 Vec+  │   │Evaluator│   │工具最小權限  │   │成本看板    │
│10s超時  │   │  Graph  │   │語義熔斷 │   │Schema 哈希   │   │OTel(Tier1) │
│指紋去重 │   │L3 Janitor│  │$10 斷路 │   │危險SQL攔截   │   │W3C傳播     │
└────┬────┘   └────┬────┘   └────┬────┘   └──────┬───────┘   └─────┬──────┘
     └─────────────┴───────┬──────┴───────────────┴─────────────────┘
                           ▼
              人工升級（Escalation）：熔斷 → Discord Webhook → Brian/Yuna
              生產紀律：Agent 產出 → drafts（永不自動入庫）
```

★ = Gemini 白皮書補上的維度（Kimi v4 幾乎缺席），v5 正式納入。

---

## 3. 五大維度設計（標準 → v4 實作 → v5 校正）

### 3.1 環境隔離層（Environment / Sandbox）

**標準（Gemini）**：Tier 0 用 Vercel Edge（V8 Isolate，冷啟動 <50ms，10 秒硬超時，SHA-256 指紋去重，滑動窗口斷路）；Tier 1 用 Firecracker/E2B/Fly.io Sprites MicroVM（硬體級隔離 + CRIU 檢查點/復原：~300ms 快照、10ms 級熱回滾，實測回滾時間 −29%、Token −36%）。

**v4 實作**：`app/api/agent/sandbox/route.ts`，`export const runtime='edge'`、`maxDuration=10`，SHA-256 指紋 + 最近 10 次去重，連續 3 次相同指紋即熔斷升級。此部分**基本正確、可直接採用**。

**v5 校正**：
- 保留 v4 的 Edge Isolate 設計；補上**出站白名單**（Edge 只允許呼叫 Supabase server route 與 YouTube-nocookie 等既有白名單域，杜絕 Agent 亂連外網）。
- 明確：Tier 0 的「隔離」是 V8 Isolate（記憶體隔離 + 超時），**非硬體級**；DSE 目前不執行學生上載的任意二進制，風險可控，故 Tier 1 MicroVM 列為「當需要跑不可信代碼時」才啟用，而非 Day 1 必需。
- C/R（檢查點/復原）在 Tier 0 以「狀態快照存 localStorage / Supabase 一列 JSON」近似；真正 OS 級 C/R 屬 Tier 1。

### 3.2 記憶層（Hierarchical Memory Mesh）— **重點校正區**

**標準（Gemini）**：L1 活躍上下文（4K–8K tokens）／L2 pgvector 向量 + 概念圖（HNSW 索引，salience 衰減、LRU 淘汰）／L3 Janitor 週期壓縮（每 10 對話或 24h，用低成本模型將萬級 token → 200 字 DNA 摘要）。

**v4 實作**：`0004_agent_memory.sql`（`agent_memory_vectors` / `concept_graph` / `concept_graph_edges` / `janitor_compress_log`）+ `lib/agents/janitor.ts`。結構良好，但有兩個與真實項目相撞的錯，v5 必須改：

**校正 1 — 隔離模型（去 Supabase Auth）**
v4 寫 `user_id ... references auth.users(id)` 與 `create policy ... using (auth.uid() = user_id)`。真實項目**冇 Supabase Auth**，`auth.uid()` 恆為 null，此 RLS 形同虛設或全部拒絕。v5 改為：

```sql
-- v5 校正：無 Supabase Auth 的隔離模型
-- user_id 來自 Auth.js session（app 層身分），非 auth.users
create table if not exists agent_memory_vectors (
    id            uuid primary key default gen_random_uuid(),
    user_id       text not null,          -- app-session user id（Auth.js sub），非 FK 去 auth.users
    agent_id      text not null,
    content       text not null,
    -- $0 校正：Tier 0 用 384 維免費本地嵌入（gte-small / MiniLM）；Tier 1 才 1536(OpenAI)
    embedding     vector(384),
    content_type  text not null check (content_type in
                  ('error_pattern','concept_mastery','question_archetype','student_profile','session_summary')),
    metadata      jsonb default '{}',
    salience      double precision default 0.5 check (salience between 0 and 1),
    access_count  integer default 0,
    created_at    timestamptz default clock_timestamp(),
    last_accessed timestamptz default clock_timestamp()
);
-- 隔離：不用 RLS auth.uid()，改為「只經 server-only getServiceSupabase() 存取，
-- 且每條查詢一律 .eq('user_id', sessionUserId)」。service_role 永不落客戶端。
-- （可選）保留 RLS 並停用匿名角色，作為 service_role 誤用時的第二道防線。
```

**校正 2 — $0 向量嵌入**
Gemini/v4 焗死 `vector(1536)` = OpenAI `text-embedding-3-small`（付費），違反 §5。v5 的 Tier 0：
- 首選 **免費本地嵌入**：Supabase Edge Function 內置 `gte-small`（384 維）或瀏覽器/Edge 端 Transformers.js `all-MiniLM-L6-v2`（384 維），零 API 費用；
- 最保守回退：**關鍵字餘弦/重疊**檢索（v4 `retrieveRelevantMemories` 已有此 $0 回退，保留）；
- 1536 維 OpenAI 嵌入 **只在 Tier 1** 啟用。故 schema 維度改 384，避免把付費依賴寫死。

**L3 Janitor（$0 校正）**：v4 用「低成本模型」壓縮。Tier 0 若要真正 $0，壓縮改為**規則式摘要**（抽取錯因分佈 CMT/TMR/MEC + top 概念盲點）而非 LLM 呼叫；如已有免費額度的 Haiku 級模型可用，才升級為語義壓縮。壓縮日誌 `janitor_compress_log` 結構沿用。

### 3.3 控制與防禦層（Dual-Engine + Semantic Circuit Breaker）

**標準（Gemini）**：Generator/Evaluator 雙引擎；**無監督語義熔斷**——把連續 t 步草稿轉向量 `e_t`，在窗口 W(=10) 內算餘弦距離，`Dist_cos(e_t, e_{t-1}) ≤ τ (τ∈[0.03,0.05])` 連續 k≥3 步、且下游測試通過率/進度分 `Q_t` 停滯，即微秒級熔斷（相比 LLM-as-Judge 每輪判定省約 38% token）。四大高危升級：重複無進度 >2 次、單任務成本破 $10、試圖呼叫不可逆破壞工具（DROP TABLE／刪 Git 分支／重置 Notion）、置信度 <0.70。降級：Meta-Agent 干預（凍結 L1、重拆子任務、Ralph Loop 式全新上下文重啟）→ 2 次無效則人工接管。

**v4 實作**：`lib/agents/generator.ts`（最多 3 次迭代）+ `lib/agents/evaluator.ts`（術語紅線 / 版權 / 數學正確性 / 難度 / 解析質量）+ `lib/agents/circuitBreaker.ts`（$10 成本鎖、連續 BLOCK、Discord Webhook 升級）。骨架完整、方向正確。

**v5 校正**：
- **裁決字眼**：v4 用 `PASS / FAIL / BLOCK`。為守情緒紅線（§4，全站零「FAIL」）且防內部字眼洩漏到任何面向學生的表面，v5 內部裁決改為 **`PASS / REVISE / BLOCK`**（REVISE = 退回重寫）。任何 Agent 產出面向學生時，一律轉為「你發現咗一個新盲點 💡／再諗下」正向措辭。
- **Tier 0 語義熔斷降級**：v4 只有「Max Iterations = 3」硬上限（Gemini 明確指此為不足）。v5 Tier 0 先用「指紋去重（3 次相同輸入）＋測試通過率停滯」作近似語義熔斷（$0，不需每輪 embedding）；真正的餘弦距離語義熔斷（需嵌入）列 Tier 1，或當免費本地嵌入可用時啟用。
- **尊重生產紀律（不可協商）**：雙引擎 **不等於自動發布**。Evaluator PASS 只代表「可進入人工評審隊列」，寫入 `drafts/`；仍須 `review-drafts.mjs` → 真人逐題批 → `promote-drafts.mjs`。此點必須凌駕一切效率考量（54-idea §7）。
- **接駁現有守閘**：Evaluator 的術語紅線、格式、預算、口語化檢查，**直接復用已存在的** `scripts/qbank/term-guard.mjs`、`validate-banks.mjs`、`budget-guard.mjs` 與 `scripts/i18n-guard.mjs`（全部已串入 `npm run qa`）。v5 不重造，只把它們包成 Evaluator 的 check 函式，令「同一套規則」同時守 CI 與 Agent 產出。

### 3.4 安全治理層（Security Governance）— **Gemini 補上、v4 缺席的維度**

**標準（Gemini / NSA MCP 指引 / OWASP MCP Top 10）**：MCP 讓伺服器可反向要求客戶端執行操作，帶來「未驗證任務傳播」與「上下文越界洩露」新型攻擊面。SOTA 要求：中央 MCP Gateway 統一入口 + OIDC 綁真實身分、工具級細粒度 RBAC（虛擬金鑰、最小工具清單）、工具描述 Schema 哈希簽名（防 Rug-Pull 突變）、憑證主機端保險箱（沙箱內無真 Key，MITM 代理動態注入）、雙向 PII/DLP 遮蔽。

**現況風險（直接關乎 DSE 現用的三連接器）**：本專案**真實使用** Notion / Supabase / Vercel 三連接器（本 Harness 的 54-idea 追蹤庫正是經 Notion MCP 建立）。按 Gemini 審計，P2P 直連下：
- **Notion**：靜態 Internal Token 明文、無限期有效、無工具級控制——Token 一洩，可跨工作區讀任意機密頁。
- **Supabase**：OAuth 通道安全，但應用層「全或無」授權，Agent 在惡意 Prompt 下極易執行 `DROP TABLE` 等高危 DDL。
- **Vercel**：靜態 PAT，缺調用參數過濾，理論上可被利用作供應鏈投毒。

**v5 Tier 0 務實緩解（$0，Day 1 可做）**：

| OWASP MCP 威脅 | DSE 具體場景 | Tier 0 緩解（$0） |
|---|---|---|
| MCP01 憑證暴露 | Notion/Supabase/Vercel Token 明文 | 所有 Token 只存**伺服器端環境變數**，`service_role` 永不落客戶端；`.env*` 入 `.gitignore`（已有）；只給連接器**最小必要 scope** |
| MCP02 特權提升 / 越權 SQL | Agent 被誘導 `DROP TABLE` / 刪生產分支 | Agent 對 Supabase **只走白名單 server route**，不直接廣播 raw SQL 工具；伺服器端對 SQL 做 **deny-list（DROP/TRUNCATE/ALTER 拒絕）**；破壞性操作一律入人工升級隊列 |
| MCP03 工具毒化 / Rug-Pull | 連接器描述被動態竄改 | 首次審查連接器時對其工具 schema 做 **SHA-256 簽名**，每次連線比對，突變即停用報警（可用現有 `scripts/` 加一個 `mcp-schema-guard.mjs`，仿 `i18n-guard` 模式） |
| MCP04 供應鏈 | 未審計 npm/npx 連接器 | 鎖版本（`package-lock.json` 已有）；連接器只用官方託管（如 `mcp.notion.com`）而非隨手本地 stdio |
| MCP06 影子伺服器 | 私自起未認證本地 MCP | 只允許經 OAuth 握手的官方連接器；不在生產開匿名 localhost MCP |
| MCP07 上下文過度共享 | 對話含 PII 被連接器記錄 | 因資料 100% localStorage、Supabase 只存去識別化的錯題 DNA，PII 面本已極小；Agent 上下文不放真實姓名/聯絡 |

**v5 Tier 1（可選）**：引入中央 **MCP Gateway**（Speakeasy / Bifrost / WSO2）統一終止認證、綁 OIDC 真實身分、發**虛擬金鑰（narrow allow-list）**、雙向 DLP 遮蔽；憑證改由 Gateway 託管，沙箱與 Agent **不承載任何真 Key**。

### 3.5 可觀測性層（Observability）

**標準（Gemini）**：完全相容 **OpenTelemetry GenAI 語義約定**——一次交互抽象為 span 樹：`invoke_agent`（根）→ `chat`（每次 LLM 呼叫，記 `gen_ai.usage.*_tokens`、`cache_read` 省 token）→ `execute_tool {tool}`（記 `gen_ai.tool.name`、`mcp.session.id`、`mcp.method.name`）；並經 **JSON-RPC `_meta.traceparent`** 做 **W3C 上下文傳播**，打通 Claude Code → Gateway → 連接器 → 後端 DB 的端到端追蹤，供合規審計一鍵回溯「某 session 讀咗邊啲表、改咗邊啲 Notion 頁、花咗幾多錢」。

**v4 實作**：`lib/agents/telemetry.ts`——`logAgentTrace()` 把每個 `THOUGHT/TOOL_CALL/...` 帶 `trace_id` 寫入 `agent_traces` 表 + console；`generateTraceId()` / `createChildTrace()` 支援嵌套。方向正確。（注意：v4 該檔第 1216 行附近有一段 TS 內誤混 SQL `--` 註解，v5 已標記需清理——見附錄 A。）

**v5 校正**：
- Tier 0 就用 v4 的結構化 JSON + `agent_traces` 表（$0），欄位對齊 OTel GenAI 命名（`gen_ai.usage.input_tokens` 等）以便日後零改寫接 OTel。
- 加一個**成本欄位 `cost_usd`** 與每日/每 Agent 匯總視圖，餵給控制層的 $10 斷路與 §5 財務死鎖監控（呼應 54-idea #10 Vercel/Supabase 用量死鎖）。
- Tier 1 才接 **OTel Collector + Jaeger/Grafana** 與 W3C `traceparent` 跨進程傳播。

---

## 4. 威脅模型與紅線審核（PRE-EXECUTION）

**Agent 執行前四關 + 大愛關（每次 Agent 產出前硬跑）**

| 關卡 | 檢查 | 由誰把關（映射現有守閘） |
|---|---|---|
| 1. 預算 | Tier 0 全 $0；任何付費調用即攔截，Tier 1 須 Brian/Yuna 批 | `budget-guard.mjs` + 成本斷路 |
| 2. 受眾 | 內容鎖 12–18 歲、無大學超綱（如「收入彈性」） | Evaluator 術語 check |
| 3. 專家紅線 | 經濟「共用品」禁「公共財」、「企業家職能」禁單「企業」；中文須跨篇 | `term-guard.mjs` |
| 4. 版權 | 平行改寫法（Archetype Masking），零 HKEAA 直抄 | Evaluator 版權 check |
| 5. 大愛 | 無紅字、無面向學生「FAIL」、無排名比較；錯題導向「發現盲點」 | Evaluator 情緒 check + `i18n-guard`（語氣一致性） |

**重大風險與緩解**

| 風險 | 影響 | 緩解 |
|---|---|---|
| Agent 幻覺生成錯題 | 學生學錯概念 | Evaluator 硬驗證 + **人工評審隊列（drafts）不自動發布** |
| 成本失控 | 破 $200/月死鎖 | 成本斷路 $10/任務 + `budget-guard` + 用量看板 |
| 語義死循環 | 資源/費用黑洞 | 指紋去重 + 測試停滯熔斷（Tier 0）／餘弦語義熔斷（Tier 1） |
| **越權 SQL / 憑證外洩** | 資料災難 | 白名單 route + SQL deny-list + Token 僅伺服器端（見 §3.4） |
| Janitor 過度壓縮 | 個性化失效 | 保留高 salience 記憶 + 人工抽查 |

---

## 5. 誠實成本模型（$0 死鎖如何守、幾時會破）

**Tier 0 為何能 $0**：Vercel Edge / Hobby、Supabase Free（500MB + pgvector）、Auth.js、結構化 JSON 遙測——全部免費額度內。Agent「推理」若用現有已付/免費的 Claude Code 額度，不另計平台成本。

**什麼會破 $0（必須擋）**：
- 付費 embedding API（OpenAI 1536）→ Tier 0 改**本地 384 維/關鍵字**。
- L3 Janitor 每 10 對話 call 一次付費模型 → Tier 0 先用**規則式摘要**。
- 向量表無限膨脹撐爆 500MB → **salience 衰減 + LRU 淘汰 + 30 天低價值清理**。
- Edge Function 調用量爆 Free Tier → 用量看板 + 閾值告警（54-idea #10）。

**Tier 1 才付費**（須聯合批准）：E2B/Fly.io MicroVM（~$30）、Pinecone/Weaviate（~$35）、Honeycomb/OTel（~$20）、部分任務升級模型——合計 ~$50–150/月，仍在 §5 上限附近，逐項評估 ROI。

---

## 6. 量化驗收矩陣（可審計；Gemini 度量 × DSE $0 可測）

| 維度 | 指標 | SOTA 目標 | DSE Tier 0 目標（$0 可測） | 驗證方法 |
|---|---|---|---|---|
| 環境 | 沙箱冷啟動 | ≤150ms | Edge Isolate 冷啟 <300ms | 計時器量發指令→握手 |
| 環境 | 回滾延遲 | ≤300ms | 狀態快照還原 <1s | 模擬崩潰，量還原 |
| 控制 | 語義循環攔截率 | ≥98.5% | 指紋去重攔截率 ≥95% | 100 組隱性循環 Prompt |
| 控制 | 成本鎖阻斷時延 | ≤10ms | 破 $10 即凍結 <100ms | 並發模擬累計費用 |
| 安全 | 危險 SQL / 越權攔截 | 100% | DROP/TRUNCATE deny 100% | 引導 Agent 試越權 |
| 安全 | Schema 突變攔截 | ≤50ms | 連接器 schema 哈希比對命中 100% | 送竄改 schema 包 |
| 觀測 | 追蹤穿透率 | 100% | 每 Agent 決策皆有 `trace_id` 100% | 抽查 `agent_traces` |
| 記憶 | Janitor 壓縮率 | — | 10 題後 token ↓ >80% | 壓縮前後 token 對比 |
| 業務 | 跨裝置同步 | — | 手機做題→桌面可見 | 端到端測 |
| 業務 | 術語/版權/情緒紅線 | — | `npm run qa` 0 違規 | CI 守閘 |

---

## 7. 實施路線圖（v4 校正版；Tier 0，$0）

| Phase | 內容 | 負責人 | 工時 | v5 校正重點 |
|---|---|---|---|---|
| 0. 基建 | migration：`agent_memory`(384維/text user_id) / `agent_traces` / `escalation_queue` | Alan | 2h | 去 `auth.users` FK；`vector(384)` |
| 1. 沙箱 | Edge sandbox route + 10s 超時 + 指紋去重 + 出站白名單 | Max | 2h | 加白名單 |
| 2. 記憶 | Janitor（規則式摘要）+ 本地嵌入/關鍵字檢索 + 概念圖種子 | Alan + Leo | 4h | $0 嵌入 |
| 3. 控制 | Generator/Evaluator（**復用 qbank 守閘**）+ 雙引擎迴圈 | Leo | 5h | 復用非重造；`PASS/REVISE/BLOCK` |
| 4. 防禦 | circuitBreaker + 成本追蹤 + Discord 升級 + **SQL deny-list + schema 哈希 guard** | Max + Eric | 4h | 補安全治理 |
| 5. 觀測 | telemetry（OTel 命名）+ 成本看板 | Leo | 2h | 清理 v4 TS/SQL 混註解 |
| 6. 集成 | Sync/Generator/Evaluator 接現有流程，**產出入 drafts** | 全員 | 4h | 尊重人工流水線 |
| — 合計 | | | **~23h（$0）** | Tier 1 另 ~16h（可選） |

---

## 8. 紅線可追溯自檢（憲法 / 54-idea 逐條對映）

- **§1 版權**：Evaluator 版權 check（平行改寫法）+ Footer 免責 → ✅ 內建
- **§2 術語**：`term-guard.mjs` 併入 Evaluator（共用品/企業家職能/禁收入彈性/中文跨篇）→ ✅
- **§3 語言**：本文件全書面語；`i18n-guard` 守語氣；學術內容禁港式口語 → ✅
- **§4 情緒安全**：內部裁決 `REVISE`（非 FAIL）；面向學生零紅字/零 FAIL/零排名 → ✅ 校正
- **§5 財務**：Tier 0 全 $0；付費一律 Tier 1 + 聯合批准；成本斷路 $10 → ✅
- **§6 已否決**：Harness 不含 JUPAS/老師平台/gamification；不用舊名 → ✅（Non-Goals §1.2）
- **§7 技術現實**：無 Supabase Auth/`middleware`；`service_role` 伺服器端；`correctIndex`；`--webpack`/3001；**機器永不自動入庫** → ✅ 全面校正
- **五大哲學**（櫻梅桃李/人間革命/常不輕/衣裏明珠/同苦化城）：Agent 個性化、逆向診斷、正向批改、錯題價值化、情緒安全網 → ✅ 對應五層設計

---

## 9. 待決策項與風險（Open Decisions）

- **D-1 認證棧**：`package.json` 同時有 `better-auth` 與 `next-auth`，且倉庫有 `FLIP-TO-BETTER-AUTH.md`。v5 記憶層以「app-session `user_id` 字串」設計，兩者皆相容；但需 Brian/Max 敲定最終棧，並確認 `user_id` 來源欄位（`sub`）。
- **D-2 本地嵌入落點**：`gte-small`（Supabase Edge Function）vs Transformers.js（Edge/瀏覽器）vs 純關鍵字。建議先關鍵字上線、再視效果加 `gte-small`（仍 $0）。
- **D-3 幾時需要 MicroVM**：目前不跑學生上載的任意代碼，Tier 0 Edge Isolate 已足；當引入「學生提交代碼自動評測（ICT 科）」時才升 Tier 1 沙箱。
- **D-4 Meta-Agent / Ralph Loop**：屬進階，建議 Tier 0 先只做「指紋熔斷 + 人工升級」，Meta-Agent 留待有免費模型額度時。

---

## 附錄 A：v4 → v5 技術矛盾校正清單

| # | v4 原設計 | 問題 | v5 校正 |
|---|---|---|---|
| A1 | `references auth.users(id)` + RLS `auth.uid()=user_id` | 真實項目無 Supabase Auth，`auth.uid()` 恆 null | `user_id text`（app-session）+ 伺服器端 `service_role` 按 user_id 收窄；RLS 作第二道防線 |
| A2 | `embedding vector(1536)`（OpenAI，付費） | 違反 §5 $0；免費 tier 呼叫不到 | Tier 0 `vector(384)` 免費本地嵌入/關鍵字；1536 留 Tier 1 |
| A3 | Evaluator 裁決含 `FAIL` | 觸情緒紅線 §4「零 FAIL」 | 內部改 `PASS/REVISE/BLOCK`，永不面向學生 |
| A4 | 「Memory #6/#7…」引用 | Kimi 自定編號，對不上真實憲法 | 改掛 v2.1 憲法 / 54-idea §1–§7 |
| A5 | 只有 Max Iterations=3 | Gemini 指此為語法級不足 | Tier 0 指紋+測試停滯熔斷；Tier 1 餘弦語義熔斷 |
| A6 | 雙引擎似可自動發布 | 違反「機器永不自動入庫」 | PASS 僅入 `drafts` → 人工評審流水線 |
| A7 | 缺安全治理維度 | Gemini 五維之一缺席 | 補 §3.4：OWASP MCP Top 10 → DSE + Tier 0 緩解 |
| A8 | telemetry.ts 混入 SQL `--` 註解 | 語法/可讀性 | 清理；SQL 移入 migration 檔 |
| A9 | 泛用 `createClient`（似客戶端） | 恐洩 `service_role` | 一律 server-only `getServiceSupabase()` |

## 附錄 B：與現有 codebase 的接駁點（真實文件）

- 守閘復用：`scripts/qbank/term-guard.mjs`、`validate-banks.mjs`、`budget-guard.mjs`、`scripts/i18n-guard.mjs` → 包成 Evaluator checks，續留 `npm run qa`。
- 同步：`lib/sync.ts` + `question_events`（既有）→ Sync-Agent 之底。
- 資料存取：一律經 server-only `getServiceSupabase()`；`supabase_schema.sql` / `supabase_security_fixes.sql` 之上加 `0004_agent_memory` 等 migration。
- 生產紀律：`scripts/qbank/review-drafts.mjs` / `promote-drafts.mjs` / `decisions.json` → Agent 產出的唯一出口。

## 附錄 C：SOTA 參考（源自 Gemini 白皮書）

Firecracker / E2B / Fly.io Sprites / CubeSandbox 沙箱；CRIU / Crab 檢查點復原；Semantic Early-Stopping（arXiv 2606.27009）；Resilience Circuit Breakers；NSA《MCP Security Design Considerations》；OWASP MCP Top 10；Speakeasy / Bifrost / WSO2 MCP Gateway；OpenAPI-to-MCP（Speakeasy/TrueFoundry）；OpenTelemetry GenAI Semantic Conventions（v1.41+）。

---

> **最終判斷**：v5 = Gemini 的「企業級標尺與威脅模型」＋ Kimi v4 的「DSE 可執行骨架」＋ 真實項目的「地基與紅線」。三者合一後，Harness 既對得上 2026 SOTA 五維標準，又守得住 $0 死鎖、人工把關與大愛紅線。
> **實施策略**：Tier 0（~23h，$0）先落地並量化驗收，證明價值後再逐項評估 Tier 1。
> **風險等級**：中（新增複雜度，但每層有熔斷 + 人工升級 + 現有守閘兜底）。
