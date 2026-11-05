# 題目錯誤反映系統 — Phase 3：Agent A（Queue Creator）

> **狀態：** Agent A CLI＋純函式庫已入 repo；預設 dry-run。  
> **日期：** 2026-11-05（Asia/Hong_Kong）  
> **繼承：** [phase-1-db.md](./phase-1-db.md)、[phase-2-queue.md](./phase-2-queue.md)

---

## 0. 本 Phase 交付

| 路徑 | 用途 |
|---|---|
| [`lib/errorSystem/queueReport.ts`](../../lib/errorSystem/queueReport.ts) | 組裝／驗證 queue JSON；禁 PII 欄 |
| [`scripts/error-system/agent-a.mts`](../../scripts/error-system/agent-a.mts) | 掃 `open` 舉報 → 寫 `.grok-queue/report-*.json` |
| [`scripts/error-system/fixtures/open-report.sample.json`](../../scripts/error-system/fixtures/open-report.sample.json) | 離線試跑 |
| [`lib/__tests__/error-system-agent-a.test.mts`](../../lib/__tests__/error-system-agent-a.test.mts) | 合約測試 |
| `npm run error:agent-a` | package.json 入口 |

**Phase 3 完成，等待批准**（唔開工 Phase 4）。

---

## 1. 行為

```
question_reports status=open
  → 由 data/questions 正本攞題（唔信 runtime 亂改雲）
  → buildQueueReport（無 description／reporter_id）
  → --write → .grok-queue/report-{id}.json
  → 可選 --push-status → status open→queued（樂觀鎖：where status=open）
```

### 旗標

| Flag | 作用 |
|---|---|
| （無） | dry-run，只打印 |
| `--write` | 寫 queue 檔（已存在則 skip） |
| `--push-status` | PATCH DB → `queued`（**需 0034 已 apply**） |
| `--fixture path` | 離線用樣例列，唔打 Supabase |
| `--limit N` | 最多處理 N 條（預設 50） |

```bash
npm run error:agent-a
npm run error:agent-a -- --fixture scripts/error-system/fixtures/open-report.sample.json
npm run error:agent-a -- --fixture scripts/error-system/fixtures/open-report.sample.json --write
npm run error:agent-a -- --write --push-status   # 要有 .env.local + 0034
```

---

## 2. 點解唔用 Vercel Realtime 常駐

- Prompt 寫「Realtime 監聽」；本站邊界係 **ops／Cursor 週期跑 CLI**，避免 Next 長連線同額外 egress。
- 並發靠 `PATCH … status=eq.open` 樂觀鎖（0 row＝已被取走）；`pg_advisory_xact_lock` RPC 可喺 apply 0034 後另加，唔阻本 Phase。

---

## 3. 四決策遵守

1. 本 Phase 唔做替換／單審；只入 queue  
2. L1 24h 喺 Phase 5 入 `question_replacement_queue` 時生效  
3. Queue JSON **禁止** `description`／`reporter_id`／IP／email（`FORBIDDEN_QUEUE_KEYS`）  
4. 唔寫「AI生成替換」

---

## 4. 驗收

- [x] 純函式 `buildQueueReport`／`parseQueueReport`  
- [x] CLI dry-run／`--write`／`--fixture`  
- [x] 單元測試 4 條 pass  
- [x] 樣例寫出後無 PII 欄  
- [ ] Production `--push-status` — 等 0034 apply  
- [x] Phase 4 Bot 掃真 `report-*.json` — 見 phase-4-bots.md

---

## 5. 之後

| Phase | 內容 |
|---|---|
| 4 | 手動／Bot 試掃 queue → 寫 investigations |
| 5 | Agent B：result → withdraw＋replacement_queue（雙審） |
| 6 | UI／通知 |

---

**Phase 3 完成，等待批准**
