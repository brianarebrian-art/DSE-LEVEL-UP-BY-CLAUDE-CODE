# L · Vercel／Supabase 免費額度與尖峰容量

狀態：**緊急／待創辦人動作** · 2026-10-30（香港時間）更新  
憲章：每月總技術成本死鎖約 **US$200 以內**；嚴禁擅自開付費第三方 API。  
近 cap：**優先降級，唔偷偷升級**（要書面准）。

## 0. 2026-10-30 警報（已核）

創辦人／儀表板訊息：

> Your free team dselevelup has used 100% of the included free tier usage for **Function Storage (10 GB)**.  
> Your free team dselevelup has used 100% of the included free tier usage for **Fluid Active CPU (4 hours)**.

| 指標 | Hobby 包 | 意思 | 本專案驅動因素 |
|---|---|---|---|
| **Functions Storage** | ~10 GB | 每個保留中嘅 deployment 嘅 Function bundle（按 region 存） | 大量 preview deployment（Cursor agent／Dependabot／PR） |
| **Fluid Active CPU** | 4 CPU-hrs／月 | 代碼真正執行嘅 CPU 時間（等 I/O 唔計） | 全站 `proxy.ts`（CSP nonce）＋ API／SSR／cron；流量越大越快爆 |

核對（MCP，team `dselevelup`，project `dse-level-up-by-claude-code`）：

- 團隊只有 **1** 個 project。
- 最近約 100 個 deployment 裏，preview 佔多數（約 2／3）；`main`／production 亦多。
- Production 現跑 `iad1`。
- `vercel.json` 有 **每日 2 次** cron：`/api/cron/exam-day-nudge`。
- 每個 HTML 請求經 `proxy.ts` 生 CSP nonce → 頁面無法當純靜態 CDN 交；會食 Fluid CPU。

Hobby 超額後多數要等約 30 日額度重置；Function／Deployment Storage 刪咗 deployment 之後先會回落（刪除後有 recovery 期，但唔再計入用量）。

**唔准喺未書面批准下升級 Pro。**

## 1. 創辦人而家要做（唔經 agent）

Dashboard：https://vercel.com/dselevelup/dse-level-up-by-claude-code

1. **Usage** → 確認 Functions Storage／Active CPU 係咪真係 100%。截圖存檔。
2. **Deployments** → 批量刪除舊 **Preview**（保留 production 最近 2–3 個同而家要用嘅 PR）。Storage 即時唔再計入；永久 GC 要等 recovery。
3. **Settings → Deployment Retention** → 縮短 Pre-Production／Canceled／Errored（建議試 **1–7 日**；Production 可留 30 日）。預設 Hobby 30 日太長，會囤住 Function bundles。
4. （可選，止血最強）**Settings → Git → Disable Preview Deployments**，直至 Storage 回落。之後只 deploy `main`。
5. 若學生站已 5xx／暫停：要嘛等額度重置，要嘛**書面准** Pro trial／Pro（仍受憲章 US$200 死鎖約束）。

## 2. 已落地／建議嘅 repo 措施

| 措施 | 狀態 | 說明 |
|---|---|---|
| `scripts/vercel-ignore-build.mjs` | 本 PR | Dependabot、docs／`.cursor`／`.github` only → **跳過** preview build；`main`／production 永遠 build |
| Project Ignored Build Step | 本 PR 經 MCP 設 | `node scripts/vercel-ignore-build.mjs` |
| 關全部 Preview | 待創辦人 | Dashboard 開關；agent 唔擅自關死 |
| 減 cron | 待批 | 考季外可改每日 1 次或暫時關 |
| CSP nonce → 靜態化 | 研究／另批 | 影響保安模型；唔喺呢輪改 |

Ignored Build Step 指令（Dashboard 或 API）：

```bash
node scripts/vercel-ignore-build.mjs
```

（exit 0 = skip；exit 1 = build。）

## 3. 現用付費面（定性）

| 服務 | 用途 | 備註 |
|---|---|---|
| Vercel | 託管／CDN／Web Analytics／Speed Insights | **而家係 Hobby／free team**（警報原文） |
| Supabase | Postgres／Auth／storage | Free／Pro 待核；project `aegekxapxgcfdrkzisis` |
| Sentry | 錯誤 | 免費額常見；Replay 關 |
| Google OAuth | 登入 | 通常免費配額 |

`scripts/budget-guard.mjs` 與憲章對齊——改預算要兩邊一齊改。

## 4. 尖峰風險（考前）

| 風險 | 緩解 |
|---|---|
| Fluid CPU 月中爆 | 減 preview；Retention 縮短；考慮靜態化／減 SSR（另批）；唔對 production 壓測 |
| Functions Storage 爆 | 刪舊 preview；Ignored Build Step；可選關 Preview |
| DB 連線 | 唔用 transaction pooler 跑 DDL；讀多寫少 |
| 濫用刮題 | IP rate limit；禁 bulk API |

## 5. 負載測試

只可喺**批准嘅隔離環境**；唔對 production 做壓力／攻擊探測。

## 6. 待創辦人回覆

- [ ] 已截 Usage 圖  
- [ ] 已刪舊 Preview／已改 Retention  
- [ ] Preview Deployments：維持／暫時關閉  
- [ ] 超額期間：等重置／准 Pro（金額寫明）  
