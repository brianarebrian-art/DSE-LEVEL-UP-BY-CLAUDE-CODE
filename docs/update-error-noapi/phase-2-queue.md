# 題目錯誤反映系統 — Phase 2：File Queue＋Bots＋Cursor Rule

> **狀態：** Phase 2 架構已入 repo；**未**實作 Agent A／B runtime（Phase 3／5）。  
> **日期：** 2026-11-05（Asia/Hong_Kong）  
> **繼承：** [phase-1-db.md](./phase-1-db.md) 四決策、憲章 §12／§16.B／§16.E

---

## 0. 本 Phase 交付

| 路徑 | 用途 |
|---|---|
| [`.grok-queue/`](../../.grok-queue/) | Agent→Bot 輸入佇列（`report-{id}.json`） |
| [`.grok-investigations/`](../../.grok-investigations/) | Bot→Agent 結果佇列（`result-{id}.json`） |
| [`.grok-bots/`](../../.grok-bots/) | 6 分科 bot＋[`_SHARED.md`](../../.grok-bots/_SHARED.md) |
| [`.cursor/rules/error-system.mdc`](../../.cursor/rules/error-system.mdc) | Agent 硬規則 |

結尾要求：**Phase 2 完成，等待批准**（唔開工 Phase 3）。

---

## 1. 架構

```
question_reports (anon POST /api/report)
        │
        ▼  Phase 3 Agent A
 .grok-queue/report-{id}.json
        │
        ▼  Grok Bot 掃 file（無 API Key）
 .grok-investigations/result-{id}.json
        │
        ▼  Phase 5 Agent B
 withdraw.mts + question_replacement_queue
        │
        ▼  L1 24h → L2 second_review → qbank promote
 學生 provenance：「經自動檢查」
```

唔用 webhook；Git 檔案即消息。

---

## 2. 同上傳 prompt 嘅差異（刻意）

| Prompt 原稿 | Phase 2 |
|---|---|
| `description` 自由文字 | **刪除**；用 `category`（§16.E） |
| `report_type` 中文枚舉 | 用現有 `answer`／`explain`／… keys |
| `question_id` uuid | **text**（對齊 `questions.id`） |
| `subject: math_core` | 用 `data/subjects.ts` id（`math`／`m1`／`m2`…） |
| 冷門豁免指示 | **禁止**；各 bot 寫死 `dual_review_required: true` |
| 結果後可跳過真人 | **禁止**；高 confidence 仍入雙審佇列 |

---

## 3. JSON 合約

### 3.1 `report-{report_id}.json`

必填：`schema_version`（1）、`report_id`、`question_id`、`subject`、`category`、`locale`、`original_question`、`created_at`。

`original_question` 最少：`type`、`content`；MC 另加 `options`、`correctIndex`；可加 `topic`、`difficulty`。

**禁止欄：** `reporter_id`、`description`、`ip`、`email`、`user_id`。

範例：[`.grok-queue/_example-report.json`](../../.grok-queue/_example-report.json)（bot 忽略 `_` 檔）。

### 3.2 `result-{report_id}.json`

必填：`schema_version`、`report_id`、`assigned_bot_id`、`is_valid`、`confidence`（0–1）、`error_type`、`evidence`、`should_replace`、`reasoning`、`dual_review_required`（必須 `true`）、`completed_at`。

可選：`correct_answer`。

範例：[`.grok-investigations/_example-result.json`](../../.grok-investigations/_example-result.json)。

---

## 4. Bot 科目路由

| Bot | `subject` id |
|---|---|
| `chi-bot` | `chinese`, `chinese-literature` |
| `eng-bot` | `english`, `english-literature` |
| `math-bot` | `math`, `m1`, `m2` |
| `sci-bot` | `physics`, `chemistry`, `biology` |
| `commerce-bot` | `economics`, `bafs`, `ict` |
| `general-bot` | `csd`, 史地、術科、DAT、其餘兜底 |

M2／DAT／音樂等 **無豁免**。

課綱：優先官方 HKEAA／EDB 文件；repo 暫無 `docs/syllabus/2026-*.md` 時，bot 必須喺 `evidence` 寫明所用 URL／版本。

---

## 5. Cursor rule

[`error-system.mdc`](../../.cursor/rules/error-system.mdc)：`alwaysApply: false`，以 globs 綁 queue／docs／report API。重申四決策、file queue、唔 runtime 改 `questions`、限流沿用。

---

## 6. 驗收 checklist

- [x] `.grok-queue/`＋README＋`_example-report.json`（無 PII／無 description）
- [x] `.grok-investigations/`＋README＋`_example-result.json`（`dual_review_required: true`）
- [x] 6 bot＋`_SHARED.md`（含四決策、禁單審、禁 AI生成替換）
- [x] `.cursor/rules/error-system.mdc`
- [x] 本文件
- [ ] 手動放一張真 `report-*.json` 試掃 — **Phase 4**
- [x] Agent A — **Phase 3**（見 phase-3-agent-a.md）
- [ ] Agent B — **Phase 5**

---

## 7. 之後

| Phase | 內容 |
|---|---|
| 3 | Agent A：監 `question_reports`／寫 queue／status→`queued` |
| 4 | Bot 試跑＋樣例 result |
| 5 | Agent B：讀 result、withdraw、入 replacement_queue（唔跳雙審） |
| 6 | UI／通知／測試 |

---

**Phase 2 完成，等待批准**
