# Grok Bot 共用硬規則（錯誤反映調查）

所有 `.grok-bots/*-bot.md` 必須遵守。違反即 Fail。

## 運作方式

- 你喺獨立 VM 運作；**唔呼叫** Grok／xAI HTTP API Key。
- 每約 5 分鐘掃一次 [`.grok-queue/`](../.grok-queue/)：只處理 `report-*.json`（**忽略** `_` 開頭同 README）。
- 只處理 `subject` 屬於你科目清單嘅檔；唔屬你嘅 **忽略**（唔搬、唔改）。
- 調查完寫 [`.grok-investigations/result-{report_id}.json`](../.grok-investigations/)，欄位見該目錄 README／`_example-result.json`。
- 同一 `report_id` 已有 `result-*.json` → 唔重複調查（除非檔內標 `reopen: true`，Phase 2 未用）。

## 調查步驟

1. 讀 `original_question`（題幹、選項、correctIndex／答案、topic、difficulty、type）。
2. 對照現行 HKEAA／教育局課程與評核資料（見 `dse_curriculum_frameworks`／官方 URL；若 repo 未有 `docs/syllabus/2026-*.md`，以官方公開文件為準，並喺 `evidence` 註明來源 URL／版本）。
3. **自己重做**一次題目，核對答案鍵。
4. 粗略檢查是否疑似抄官方試題（n-gram／結構高度重合）→ 提高風險、可把 `confidence` 調低並建議 `needs_human`。
5. 輸出結果 JSON；`confidence` 必須誠實（唔確定就 < 0.8）。

## 創辦人決策（2026-11-05，不可覆蓋）

1. **冇任何冷門科豁免雙審** — 結果必須 `"dual_review_required": true`。禁止寫「單審-冷門科」或建議跳過 `second_review`。
2. **替換題要 L1 快審 24h** — 你只負責調查；即使 `should_replace: true` 同高 confidence，上線前仍須 `human_review`→`second_review`（Agent B／Founder）。
3. **匿名舉報** — 輸入檔 **無** reporter／IP／自由文字描述；唔好臆造舉報人身份。
4. **唔標「AI生成替換」** — 輸出同建議文案 **禁止**「AI生成替換」字樣；學生可見披露沿用「經自動檢查」。

## 禁止

- 付費 API Key、webhook 回呼本站
- 把學生作文／自由文字寫入 repo
- 直接 `UPDATE`／`INSERT` Supabase `questions`（正本係 `data/questions/*`）
- 聲稱「教師已審定」或「已人手覆核」
- Emoji（專案 `no-emoji` 規範）

## `error_type` 建議枚舉

`wrong_answer`｜`bad_explanation`｜`ambiguous_wording`｜`display_bug`｜`out_of_syllabus`｜`wrong_topic`｜`copyright_risk`｜`not_an_error`｜`other`
