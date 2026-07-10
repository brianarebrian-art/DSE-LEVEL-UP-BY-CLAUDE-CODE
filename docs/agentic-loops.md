# Agentic Loop v3 — 本 repo 落地對照表（2026-07-11）

> 對應文件：`DSE_LEVEL_UP_Agentic_Loop_v3.md`。核心原則不變：**生成 → 檢查 → 修正 → 達標 → 入庫**，
> 最多 3 次循環，失敗升級人工。以下係每個 Loop 喺呢個 repo 嘅真實行法。

## 架構落地

| v3 層 | 落地方式 |
|-------|---------|
| **CHECK 層（全自動，$0）** | 四個本地 gate：`npm run qa`（term-guard＋validate-banks）、`npm run qa:budget`、`npm run qa:intel` —— 正正係附錄 2「本地 Check 唔叫 Claude」策略 |
| **META-LOOP（指揮中心）** | `node scripts/meta-loop.mjs` —— 一鍵行晒所有 gate，計紅黃綠健康，寫 `docs/daily_briefing_{date}.md` + `docs/system_health_dashboard.json`，並統計 content/reports/ 嘅人工審核隊列 |
| **EXECUTE 層（生成）** | 由 Claude Code session 執行（出題／組件／文案），**每條學科內容必須人手驗算** —— 冇 script 可以自動保證學術正確，呢條係生死線，唔可以全自動化 |
| **FIX 層** | 生成後跑 gate → 有違規即修正重跑（實證：econ batch 初稿被 term-guard 捉到「搞反」，1 次迭代修正通過）|
| **報告** | 每個 batch 寫 `content/reports/{loop}_{date}_report.json`（含 manual_review_count，meta-loop 會讀）|

## 逐個 Loop 對照

| v3 Loop | 狀態 | 落地／解釋 |
|---------|------|-----------|
| `econ_mc_batch` | ✅ **已示範運行** | 2026-07-11 產出 10 條（3:5:2，供需與價格彈性），入已接線 bank `economics.ts`（`econ_lb_*`），非散裝 JSON（死內容紅線）。報告：`content/reports/econ_batch_20260711_report.json`。**再行一次**：叫 Claude「行 econ_mc_batch，主題 X，10 條 3:5:2」即可 |
| `chinese_concept_batch` | ✅ **已運行** | 概念網：`docs/concept_network.json`（12 篇節點 + 10 個已出題組合）。MC 已出兩批共 10 條 zh_fx_*（批次二含文件自己舉例嘅 魚我所欲也×師說）。報告：`content/reports/chinese_batch_20260711_report.json`。**長答題唔做**：MC 平台無長答判分 UI，marking_scheme 冇承載；長答功能立項後節點可直接復用 |
| `math_variant_batch` | ✅ 已存在（更強） | 參數化 TS bank（math-bank 682 條）**就係**變體工廠，且 correct-by-construction（答案＋干擾項同式生成），比「生成後代入驗證」更嚴。**Casio 程式唔做**：無實機驗證按鍵序列＝學術事故風險。**Python/sympy 唔做**：本 repo 無 tsx/sympy，TS 參數化已覆蓋同一功能 |
| `component_dev` | ✅ 已存在 | 指令集例子（LockScreen、BreathingExercise）全部已上線；流程本身（規格→實現→gate→build→preview 驗證）就係前兩輪做組件嘅方法。新組件照辦：叫 Claude「行 component_dev：目標 X 組件」。**霓虹 #00F5D4 唔跟**：gentle brand 裁決 |
| `db_optimize` | ❌ 不適用 | 無 Drizzle；Supabase 係 per-user JSONB 單表（PK 索引），無慢查詢面。數據量監控屬 Stage 2（要 DB 級 metrics）|
| `marketing_copy_batch` | ✅ **已運行** | 7 條入 `content/marketing/threads/approved/week_1/`；金句兩句齊；報告在 content/reports/。**拒絕一條 FIX 規則**：「自動加『Plaaaaaa 都話好用』社會認證」＝虛構用戶推薦，違反 no-fake-testimonials 紅線 |
| `full_site_audit` | ✅ 已常設 | ＝ `node scripts/meta-loop.mjs`（gate 合規）＋ build（類型/接線）。Footer 喺 layout 全站注入、負面字眼零檢出（上輪已審）。每次改動後重跑即可 |
| `carson_self_refinement` | ✅ 已內化 | 出題方法論：課綱自問→難度校準→陷阱有理→數據現實。寫入 [dse-question-authoring-rules 記憶] 同 term-guard 規則，每條題出廠前執行 |
| `meta_command` | ✅ **已運行** | `scripts/meta-loop.mjs`；晨報已生成。**每日 08:00 自動執行唔做**：需要常駐 scheduler，Claude Code session 冇常駐進程——你可以自己加 macOS launchd/cron 行 `node scripts/meta-loop.mjs`，或者每朝開 session 第一句叫 Claude 行 |

## 用家速查（等價於 v3 附錄 3）

```bash
# 每日晨報（Meta-Loop）
node scripts/meta-loop.mjs

# 全部內容 gate
npm run qa && npm run qa:budget && npm run qa:intel

# 生成類（喺 Claude Code 講）：
#   「行 econ_mc_batch：主題 X，10 條 3:5:2」
#   「行 chinese_concept_batch：用 concept_network.json 組合 A×B，5 條 MC」
#   「行 component_dev：目標 XXX 組件」
```

## 三條唔可以自動化嘅底線（v3 適用範圍聲明）

1. **學術正確性**：gate 驗格式/術語/課綱關鍵字，唔驗「答案啱唔啱」——每條新題必須人手驗算。
2. **外發動作**：發文/發 DM/發提案永遠人手做，Loop 只產草稿。
3. **收生/成績數據**：唔可以由 AI 生成再「自動修正」，只可以由官方來源人手輸入。
