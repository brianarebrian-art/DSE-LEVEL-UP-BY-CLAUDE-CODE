# `.grok-queue/` — 錯誤反映調查輸入佇列

Cursor Agent A（Phase 3）寫入；Grok Bot 讀取。以 **Git file** 做 queue，唔用 webhook／付費 API。

## 檔名

- 正式工單：`report-{report_id}.json`（`report_id`＝`question_reports.id`）
- 範例／說明：`_example-*.json`（bot **忽略** `_` 開頭）

## 寫入前條件

- `question_reports.status` 由 `open` → 寫檔後改 `queued`
- **禁止**寫入學生自由文字、`reporter_id`、IP、email（§16.E；匿名決策）
- `category` 必須係 [`lib/questionReport.ts`](../lib/questionReport.ts) 嘅 key
- `subject` 必須係 [`data/subjects.ts`](../data/subjects.ts) 嘅 `id`

## Schema

見 [`_example-report.json`](./_example-report.json) 同 [`docs/update-error-noapi/phase-2-queue.md`](../docs/update-error-noapi/phase-2-queue.md)。
