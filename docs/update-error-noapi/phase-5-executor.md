# 題目錯誤反映系統 — Phase 5：Agent B（Executor）

> **狀態：** 決策引擎＋CLI 已入 repo；預設 dry-run；**唔**自動 `fixed`／唔跳雙審。  
> **日期：** 2026-11-05（Asia/Hong_Kong）  
> **繼承：** phase-1…4

---

## 0. 本 Phase 交付

| 路徑 | 用途 |
|---|---|
| [`lib/errorSystem/agentB.ts`](../../lib/errorSystem/agentB.ts) | 決策：needs_human／reject／enqueue_replacement／confirm_no_replace |
| [`scripts/error-system/agent-b.mts`](../../scripts/error-system/agent-b.mts) | 掃 result → draft＋replacement queue＋audit |
| [`.grok-replacement-queue/`](../../.grok-replacement-queue/) | 0034 未 apply 前嘅檔案版替換佇列 |
| [`drafts/error-replacements/`](../../drafts/error-replacements/) | 替換題草稿殼（awaiting_generation） |
| [`lib/__tests__/error-system-agent-b.test.mts`](../../lib/__tests__/error-system-agent-b.test.mts) | 合約測試 |
| `npm run error:agent-b` | 入口 |

**Phase 5 完成，等待批准**（唔開工 Phase 6）。

---

## 1. 行為（對齊四決策）

```
result-*.json
  ├ confidence<0.8 或 is_valid=false → reportStatus=needs_human（唔 withdraw）
  ├ not_an_error → rejected
  ├ valid + high conf + should_replace
  │     → withdraw（可選 --withdraw）
  │     → draft stub + .grok-replacement-queue（human_review, l1_due_at=+24h）
  │     → reportStatus=confirmed（唔係 fixed）
  └ valid + high conf + !should_replace → confirmed（等人手決定）
```

| 禁止 | 原因 |
|---|---|
| 高 confidence 即 `fixed` | 未完成 L1+L2 |
| 跳過 `second_review`／單審冷門 | 決策 1 |
| 學生標「AI生成替換」 | 決策 4；只用「經自動檢查」 |
| runtime INSERT `questions` | git 正本＋sync |
| 推送通知到舉報人帳戶 | 匿名（決策 3） |

完整題幹生成交 Cursor／教師填 `drafts/error-replacements/`；本 Phase 只寫 **awaiting_generation** 殼，避免未自檢題直接入庫。

---

## 2. 用法

```bash
npm run error:agent-b
npm run error:agent-b -- --write
npm run error:agent-b -- --write --withdraw          # 改 withdrawn.json
npm run error:agent-b -- --write --push-status        # 需 0034
```

### 高 confidence 試跑（唔 commit 產物、唔 withdraw）

```bash
npm run error:agent-a -- --fixture scripts/error-system/fixtures/open-report.sample.json --write
cp scripts/error-system/fixtures/result-high-confidence.sample.json .grok-investigations/result-9001.json
npm run error:agent-b -- --write
# 檢查 .grok-replacement-queue/replacement-9001.json 同 drafts/error-replacements/draft-9001.json
rm -f .grok-queue/report-9001.json .grok-investigations/result-9001.json \
  .grok-replacement-queue/replacement-9001.json drafts/error-replacements/draft-9001.json \
  .grok-investigations/_audit/audit-9001-*.json
```

---

## 3. 同上傳 prompt 差異

| Prompt | Phase 5 |
|---|---|
| soft-delete `questions.is_active` | `withdraw.mts`＋`withdrawn.json` |
| insert 新題即上線 | 只入 replacement queue；promote 喺雙審後 |
| 通知 reporter | 匿名，無個人通知 |
| confidence 高可跳過真人 | **否決** |

---

## 4. 驗收

- [x] 低 confidence → needs_human  
- [x] 高 confidence replace → confirmed + dual_review queue + L1 24h  
- [x] 無 `fixed` 決策輸出  
- [x] 公開標籤「經自動檢查」  
- [x] 單元測試  
- [ ] Production `--withdraw`／`--push-status` — 營運明確批准後  
- [ ] Phase 6 UI／通知  

---

**Phase 5 完成，等待批准**
