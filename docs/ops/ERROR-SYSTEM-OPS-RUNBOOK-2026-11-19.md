# 錯誤反映系統 — 營運手冊（創辦人批准 Phase 5）

**批准：** 創辦人「批」（2026-11-19 Asia/Hong_Kong）— 啟用 Phase 5 executor 營運路徑。  
**硬規則：** `.cursor/rules/error-system.mdc`（雙審、L1 24h、匿名、唔標「AI生成替換」、零 xAI API Key）。

## 每週流程（二人）

```bash
# 1) 開舉報 → file queue（dry-run 先睇）
npm run error:agent-a
npm run error:agent-a -- --write
# 有 0034 先加：--push-status

# 2) 分科 bot 調查（正式 VM 跟 .grok-bots；本機 harness 只 stub）
npm run error:bot-scan -- --all-bots
# 正式調查結果放入 .grok-investigations/result-*.json

# 3) Executor（預設 dry-run）
npm run error:agent-b
# 高 confidence＋應替換：寫 draft＋replacement queue；可 withdraw 錯題
npm run error:agent-b -- --write --withdraw

# 4) Cursor 接手生成替換題幹
npm run error:cursor-handoff
# 將印出嘅 prompt 貼去 Cloud Agent；填 drafts/error-replacements/draft-*.json

# 5) 二人雙審
#    L1 human_review（24h 內）→ L2 second_review → 先至 qbank promote
#    報告 status 唔好手動改 fixed，直至替換上線
```

## 批准範圍

| 動作 | 狀態 |
|------|------|
| `agent-a --write` | **已批准** |
| `agent-b --write` | **已批准** |
| `agent-b --write --withdraw`（僅 `enqueue_replacement`） | **已批准** |
| `agent-b --push-status` | 等 0034 migration 已 apply 於正式庫後再用 |
| 跳過 L2／高 conf 即 `fixed` | **永久禁止** |
| 付費 Grok／xAI API | **永久禁止**（file queue only） |

## 驗收對照

見 `docs/update-error-noapi/phase-5-executor.md`。Phase 6 UI 已入 repo，另見該檔。
