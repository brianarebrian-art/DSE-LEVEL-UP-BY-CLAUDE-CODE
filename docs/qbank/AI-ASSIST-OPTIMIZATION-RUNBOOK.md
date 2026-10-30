# 題庫 AI 輔助優化 Runbook（二人小隊）

狀態：**實務指引** · 2026-10-29  
對象：二人小隊（一人主導佇列／一人做抽樣覆核；可互換）＋ AI agent  
目的：用 AI **加快** 題庫整理、風險標記、缺欄補齊同修復建議——**唔等於**「教師已審定」。

## 硬性原則（先讀）

1. **唔宣稱 teacher-reviewed／教師審定。** AI 初審、機器閘、二人抽樣，一律唔可寫成「已由教師覆核」。公開披露跟憲章 §12（例如「經自動檢查」）。
2. **AI 只做第一關。** 可標記風險、缺欄、計算候選、格式問題；不可簽批 `approved` 作教師資格替代。
3. **唔寫 production DB。** 本 runbook 只產出草稿、清單、PR／檔案 diff 建議。上線題庫走既有閘（見下「相關文件」）；未經創辦人／科目編輯明確批准，唔跑 `sync-questions --push`、唔直接改 live Supabase `questions`。
4. **唔把 HKEAA 原題／評卷參考全文交 AI。** 版權未清物料唔推送；見 [I · 題庫保護方案](./I-QBANK-PROTECTION-PLAN-2026-10-29.md)。
5. **壞題優先收起／修訂，唔造假難度標籤。** 證據不足填 `unverified`／`insufficient_sample`，唔虛構實測數字。

## 相關文件（必連）

| 文件 | 用途 |
|---|---|
| [題目質素審核 SOP](../DSE_Level_Up_題目質素審核_SOP_2026-10-20.md) | 正式審核目標、硬性閘門、AI→教師流程 |
| [逐題審核 Prompt v1](../DSE_Level_Up_逐題審核_Prompt_v1.md) | AI／編輯初審輸出格式；**禁止**代簽教師 |
| [I · 題庫保護方案](./I-QBANK-PROTECTION-PLAN-2026-10-29.md) | 權利／版本／唔推未清版權／唔稱 DSE 預測 |
| 憲章 `docs/charter.md` §12 | 機器閘披露、撤回路徑 |
| `scripts/qbank/`（`_gate`、`auto-promote`、`withdraw` 等） | 既有技術閘；本 runbook **唔取代** |

---

## 二人角色（建議）

| 角色 | 誰 | 做乜 | 唔做乜 |
|---|---|---|---|
| **A · 佇列主理** | 隊員 1 | 建 triage 清單、開 agent 批次、合併報告、開 Draft PR | 唔代教師簽批；唔 push 未清版權 diff |
| **B · 抽樣覆核** | 隊員 2 | 按風險抽樣人手讀題、裁決 escalate／修訂建議 | 唔把「我睇過幾條」寫成全庫教師審定 |
| **Agent** | Cursor／Claude 等 | 跑 checklist、產 JSON／修訂建議、列 blocker | 唔寫 production DB；唔貼 HKEAA 全文；唔改 provenance 為 teacher |

一人日可兼 A+B，但**同一批次**建議：A 產報告 → B（或隔日嘅自己）抽樣，避免「自己產、自己當已審」。

---

## 工作流（五步，每日／每週可循環）

### 1. Triage 佇列（15–30 分鐘）

由高到低排優先（二人共識一科或一課題）：

| 優先 | 佇列名 | 典型訊號 | 建議批次大小 |
|---|---|---|---|
| P0 | `blocker` | 答案錯嫌疑、雙正解、疑似版權、超出課綱 | 5–15 題／批 |
| P1 | `student_report` | 學生報錯、高放棄率、得分率異常 | 10–20 |
| P2 | `shape_debt` | 缺解析、缺課綱映射、英混中、選項長度異常 | 20–40 |
| P3 | `coverage` | 課題空洞、難度標籤無實測 | 按課題抽樣 |

輸出：一個清單檔（例如 `docs/qbank/queues/<date>-<subject>.md` 或 issue／PR 描述），每行：`id | subject | 佇列 | 為何入佇列 | 負責人`。  
**唔**喺呢步改 live 題庫。

### 2. AI 第一關（Agent 批次）

對每批題，agent 跟 [逐題審核 Prompt](../DSE_Level_Up_逐題審核_Prompt_v1.md)，角色固定 `role: "ai"`：

**Checklist（逐題勾）：**

- [ ] 題幹／選項／答案鍵齊唔齊；明顯錯字、斷句、單位
- [ ] MC：四選一是否唯一；有冇「全對／全錯」陷阱寫法問題
- [ ] 計算題：獨立重算一次（寫步驟）；對唔上 → `blocker`
- [ ] 課綱：只填**候選**單元／課題；無官方 URL／頁碼 → `unverified`
- [ ] 語言：中英混雜、指令歧義、選項長度極端傾斜
- [ ] 版權風險：像原題複寫 → **即停**，升級人類，唔繼續改寫公開
- [ ] 難度：只記錄推理步驟／陷阱類型；唔改標籤除非有實測
- [ ] 輸出 JSON 或表格；不確定一律 `unverified`，並列「要人類確認嘅問題」

批次結束產出：`ai-pass-summary`（通過候選／需修訂／blocker 數量）＋逐題附註。  
標籤建議只用：`ai_first_pass`｜`needs_human`｜`blocker`｜`copyright_hold`——**唔用** `teacher_approved`。

### 3. 人類抽樣覆核（隊員 B）

唔逐條全讀時，最少抽樣：

| 來源 | 抽樣比例 |
|---|---|
| AI 標 `blocker`／`copyright_hold` | **100%** |
| AI 標 `needs_human` | ≥ 30% 或最少 5 題 |
| AI「通過候選」 | ≥ 10% 或最少 3 題（每批） |
| 長答／資料／計算／雙語 | 有則全部升級第二人目（可隔日） |

抽樣裁決：`confirm_issue`｜`false_alarm`｜`revise_draft`｜`escalate_founder`。  
記錄覆核者顯示名（真實身份）、日期、題 id——呢啲係**抽樣紀錄**，唔係教師簽批。

### 4. 修訂同閘（只走既有通道）

- 修訂草稿：PR 改 `data/questions`／`scripts/qbank/drafts` 等，跟 repo 既有 review／promote／`auto-promote`／`withdraw` 流程。
- 機器閘通過 ≠ 教師審定；網站披露唔改口。
- 壞題：優先 `withdraw`／收起，保留證據；唔靜默刪歷史。
- **本 runbook 唔授權** production DB 直接 UPDATE／INSERT。

### 5. 收工披露同下一批

- PR／日誌寫明：`AI first-pass + human spot-check`；人數、抽樣比例、blocker 數。
- 明確一句：**未完成 SOP 教師覆核前，唔可對外稱 teacher-reviewed。**
- 把未清 `copyright_hold` 交返 [I-QBANK 保護](./I-QBANK-PROTECTION-PLAN-2026-10-29.md) 佇列。
- 選下一批 P0／P1，重複。

---

## 明確唔好自動化

| 項目 | 原因 |
|---|---|
| 教師／科目編輯「approved」簽批 | 資格同責任；SOP 硬閘 |
| 把 provenance／UI 改成「教師已審」 | 誤導學生；違反披露 |
| 把 HKEAA 試題／評卷參考貼上 AI 或公開 repo | 版權／PHASE2 |
| Production DB 直寫、`sync-questions --push`（無批准） | 風險同不可回滾證據 |
| 批量自動改難度／「預測等級」文案 | 無實測即虛構；唔稱 DSE 預測 |
| 為 SEO 產薄題海 | I-QBANK「明確唔做」 |
| 單一 agent 全自動 promote 後當質素完成 | 機器閘 ≠ 質素完成 |
| 虛構實測得分率／用時 | SOP 禁止 |

可自動化（安全區）：缺欄掃描、格式／字元掃描、重複偵測、計算重算建議、佇列排序、報告彙整、Draft PR 說明草稿。

---

## 二人一週節奏（示例）

| 日 | A | B |
|---|---|---|
| 一 | 定科＋建 P0/P1 佇列 | 確認抽樣規則 |
| 二–三 | 開 2–3 個 AI 批次、整理報告 | 抽樣 blocker＋10% 通過候選 |
| 四 | 開修訂 Draft PR（只檔案） | 複核 PR 描述披露字句 |
| 五 | 更新佇列餘額；copyright_hold 交保護方案 | 決定下週科目 |

每日上限建議：AI 處理 ≤ 40 題「深度 checklist」；抽樣時間唔好少過 AI 時間嘅 1/3，否則假效率。

---

## 完成定義（Definition of Done）——單一批次

- [ ] 佇列清單同優先級有紀錄  
- [ ] 每題有 AI 初審輸出（或明確 skip 理由）  
- [ ] blocker／copyright 100% 人類看過  
- [ ] 通過候選有約定抽樣，結果有名有日  
- [ ] 無 production DB 直寫；無 HKEAA 全文入 agent 上下文  
- [ ] 對外／PR 文案**無** teacher-reviewed 宣稱  
- [ ] 若有檔案改動：Draft PR＋連到本 runbook 同 SOP  

---

## 快速口令（貼上 agent 開頭）

```text
你係題庫 AI 初審助手。跟 docs/qbank/AI-ASSIST-OPTIMIZATION-RUNBOOK.md
同 docs/DSE_Level_Up_逐題審核_Prompt_v1.md。
role 只可係 ai。唔准標記教師審定／approved 作上線依據。
唔寫 production DB。唔要求、唔貼 HKEAA 原題全文。
不確定填 unverified。輸出逐題風險同要人類確認嘅問題。
```
)
