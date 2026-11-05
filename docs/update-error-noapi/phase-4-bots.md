# 題目錯誤反映系統 — Phase 4：Bot 掃 file＋試跑 harness

> **狀態：** 科目路由、result 合約、本機 `bot-scan` harness 已入 repo。  
> **日期：** 2026-11-05（Asia/Hong_Kong）  
> **繼承：** phase-1…3；[`.grok-bots/_SHARED.md`](../../.grok-bots/_SHARED.md)

---

## 0. 本 Phase 交付

| 路徑 | 用途 |
|---|---|
| [`lib/errorSystem/botRouting.ts`](../../lib/errorSystem/botRouting.ts) | subject → bot；冷門科無豁免 |
| [`lib/errorSystem/investigationResult.ts`](../../lib/errorSystem/investigationResult.ts) | result JSON；`dual_review_required` 恒 true；禁「AI生成替換」等字串 |
| [`scripts/error-system/bot-scan.mts`](../../scripts/error-system/bot-scan.mts) | 掃 `.grok-queue/report-*.json`（忽略 `_`） |
| [`lib/__tests__/error-system-bot-scan.test.mts`](../../lib/__tests__/error-system-bot-scan.test.mts) | 路由／合約測試 |
| `npm run error:bot-scan` | package.json 入口 |

**Phase 4 完成，等待批准**（唔開工 Phase 5）。

---

## 1. 正式 Bot vs Harness

| | Grok VM（正式） | `bot-scan` harness（本 Phase） |
|---|---|---|
| 讀 queue | 是 | 是 |
| 自己重做題 | 是（跟 bot.md） | **否** — 只 stub |
| API Key | **無** | **無** |
| 輸出 result | 誠實 confidence | stub `confidence=0.45` → 促 `needs_human` |
| 雙審 | 必須 true | 強制 true |

正式 VM 仍以 `.grok-bots/*-bot.md` 為準；harness 用嚟驗路由、檔名、禁字、同 CI。

---

## 2. 用法

```bash
# 列出邊個 bot 會認領現有 report-*.json（唔計 _example）
npm run error:bot-scan

# 只跑 math-bot
npm run error:bot-scan -- --bot math-bot

# 寫 stub result（低 confidence）
npm run error:bot-scan -- --all-bots --stub --write
```

### 手動試掃（本機）

```bash
# 1) 用 Agent A fixture 寫一張真 report（非 _ 開頭）
npm run error:agent-a -- --fixture scripts/error-system/fixtures/open-report.sample.json --write

# 2) math-bot stub 調查
npm run error:bot-scan -- --bot math-bot --stub --write

# 3) 檢查 .grok-investigations/result-9001.json
#    dual_review_required=true, confidence<0.8

# 4) 試完刪走唔好 commit 工單檔
rm -f .grok-queue/report-9001.json .grok-investigations/result-9001.json
```

---

## 3. 四決策

1. `m1`／`m2`／`design-tech` 等仍要雙審；result 無「單審-冷門科」  
2. 即使日後高 confidence，Phase 5 仍入 L1 24h＋L2  
3. Queue／result 無 reporter／description  
4. 禁「AI生成替換」字串（`BANNED_RESULT_PHRASES`）

---

## 4. 驗收

- [x] 路由：math／m2→math-bot；design-tech→general-bot；general 唔認領 math  
- [x] result 強制 `dual_review_required: true`  
- [x] 禁字測試  
- [x] stub confidence < 0.8  
- [x] 手動 fixture→report→result 試跑（本地，檔案唔入 git）  
- [ ] 真 Grok VM 24/7 — 營運部署，非本 PR  

---

## 5. 之後

| Phase | 內容 |
|---|---|
| 5 | Agent B — 見 phase-5-executor.md |
| 6 | UI／通知／共融 — 見 phase-6-ui-test.md |

---

**Phase 4 完成，等待批准**
