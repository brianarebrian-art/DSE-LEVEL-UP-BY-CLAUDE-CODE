# `.grok-replacement-queue/` — 替換題雙審佇列（檔案版）

Agent B（Phase 5）在 Supabase `question_replacement_queue`（migration 0034）未 apply 前，用本目錄做 **git file** 佇列。

- 正式工單：`replacement-{report_id}.json`
- 範例：`_example-*.json`（Agent 忽略 `_`）
- 對應草稿：`drafts/error-replacements/draft-{report_id}.json`

規則（創辦人決策）：

1. `dual_review_required` 恒為 true  
2. `review_stage` 由 `human_review` 起；`l1_due_at` = 建立後 24h  
3. `public_label_*` 只用「經自動檢查」／`Automated checks only`  
4. **未**完成 L1+L2 之前唔可 promote／唔將 `question_reports.status` 設為 `fixed`
