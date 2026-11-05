# `.grok-investigations/` — 調查結果輸出佇列

Grok Bot 寫入；Cursor Agent B（Phase 5）讀取。

## 檔名

- 正式結果：`result-{report_id}.json`
- 範例：`_example-result.json`（Agent **忽略** `_` 開頭）

## 讀取規則（Agent B，Phase 5）

- `is_valid === true` 且 `confidence >= 0.8` → 撤回舊題＋入 `question_replacement_queue`（**仍須** L1 `human_review` 24h ＋ L2 `second_review`）
- `confidence < 0.8` 或 `is_valid === false` → `question_reports.status = needs_human`／`rejected`（視 `is_valid`）
- **禁止**因 confidence 高而跳過雙審或標「AI生成替換」
- **禁止**任何科目單審豁免

## Schema

見 [`_example-result.json`](./_example-result.json)。
