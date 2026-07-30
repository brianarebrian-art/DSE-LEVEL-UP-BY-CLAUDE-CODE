# Phase 1 影響報告 —— 非 MC 題型接線（文字題／長題目）

**日期**：2026-07-30
**觸發**：Brian 拍板「即刻接線做成功能」（`TextQuestionCard` / `LongQuestionCard`）
**依據**：CLAUDE.md §4 —— 超過 3 個檔案嘅變更必須先出 read-only 影響報告，等 greenlight 先准執行
**狀態**：⏳ 等 Phase 2 greenlight。**本報告階段零代碼改動。**

---

## 1. 現況（已逐項核實，非推測）

2026-07-01 commit `38948eb`「開始製作每一科一千題嘅問題庫」落咗前置地基，之後轉去做 MC 就停低。
`git log -S "from '@/components/TextQuestionCard'"` 對全歷史回空 —— 兩張卡**由出生到今日從未被 import**。

| 前置件 | 狀態 |
|---|---|
| `TextQuestion` / `LongQuestion` 型別 | ✅ 已存在（`data/questions/types.ts`） |
| `AnyQuestion` union、`SelfAssessment` | ✅ 已存在，但**零 consumer** |
| 兩張答題卡 UI | ✅ 已寫好，含明文「no auto-grading」誠實規則 |
| 題庫入面嘅 text／long 題 | ❌ **0 條** |
| `_gate.mjs` 收唔收 | ❌ 第 57 行 `if (row?.type !== 'mc')` **硬拒** |
| 練習引擎處理 union | ❌ `Question = MCQuestion`，`getSubjectQuestions(): Question[]` |
| 原設計嘅落地面「arena」 | ❌ 已一刀斬（`arenas` 等 3 表已刪） |

**憲章價值**：兩張卡係「長答案**唔准**機器批改」嘅現成正確實作 —— 交參考答案＋評分準則，學生三級自評，機器唔落分。呢個正正係反覆被錯誤 spec 成「Regex／關鍵詞自動批改」嗰個功能嘅負責任版本。接線唔會引入紅線，反而係把紅線嘅正解固定落 live app。

---

## 2. 受影響檔案（11 個代碼檔 + 草稿 + 測試）

| # | 檔案 | 行數 | 改動性質 | 風險 |
|---|---|---|---|---|
| 1 | `data/questions/types.ts` | — | 加註釋；`Question` 過渡策略 | 低 |
| 2 | `data/questions/index.ts` | 107 | 出口由 `Question[]` 放寬至 `AnyQuestion[]` | **中** —— 25 科全部經此出口 |
| 3 | `app/practice/PracticeSession.tsx` | 1,039 | `prepareQuestion()` 硬假設 `q.options`／`q.correctIndex`；答題→鎖死→自診→寫入全鏈繫住 `isCorrect: boolean` | **最高** |
| 4 | `scripts/qbank/_gate.mjs` | 125 | 放寬 type 白名單；`toReviewedQuestion` 按 type 出 shape | 低 |
| 5 | `scripts/qbank/promote-drafts.mjs` | — | 按 type 出唔同 shape | 中 |
| 6 | `app/admin/ReviewPanel.tsx` | 383 | 預覽硬 render 4 選項，要按 type 分流 | 低 |
| 7 | `lib/topicStats.ts` | 95 | `recordTopicOutcomes` 收 boolean | 中 |
| 8 | `lib/progress.ts` | — | `AttemptRecord.score/total` 假設每題 1 分、客觀 | **中（誠實性）** |
| 9 | `data/questions/__tests__/structural.test.mts` | — | 硬 assert 每題 4 選項 + `correctIndex` 範圍 | 中 |
| 10 | `components/{Text,Long}QuestionCard.tsx` | 129 / 159 | 遷語意 token（現時夾硬深色，兩主題唔一致） | 低 |
| 11 | `scripts/qbank/drafts/*.json` + docs | — | 首批長題目草稿（**內容工作，須真人逐題批**） | — |

---

## 3. 兩項閘門影響核實（憲章 §6）

**(a) 放寬 `_gate.mjs` 唔會誤殺任何現有草稿。**
掃過 `scripts/qbank/drafts/` 全部 13 個草稿檔、79 條題目：**type 100% 係 `'mc'`**。
放寬白名單係「放鬆」而非「收緊」，數學上唔可能令現有數據失效。§6 嘅「先統計失效數量」要求不適用。

**(b) 但現有測試會 fail —— 必須先改測試。**
`structural.test.mts` 對每科每題硬 assert：

```
assert.equal(q.options.length, 4, ...)
assert.ok(Number.isInteger(q.correctIndex) && ...)
```

加入任何 text／long 題會令該科測試即時 fail。**必須先按 `q.type` 分流 assertion**，
否則就係「以 feature change 令現有數據集失效」—— 憲章 §6 明文禁止。
現時 42/42 通過，改測試後題數會升（新增 type-specific 斷言）。

---

## 4. 三個要創辦人拍板嘅設計問題（唔係技術問題）

### 決策 1 —— 自評結果計唔計入「準確率」同「等級預測」？

現時 `predictGrade(score, cutoffs)` 同 dashboard「整體準確率」**100% 由客觀 MC 答對率**得出。
自評（完全掌握／部分明白／完全唔識）係**學生自己講**，唔係客觀分。

| 選項 | 後果 |
|---|---|
| **(A) 完全分開**：長題目只入錯題本／課題掌握度，**唔入** accuracy 同等級預測 | 等級預測維持純客觀。**建議。** |
| (B) 混入但 UI 明示「含自評」 | 誠實，但「等級預測」嘅可比性下降 |
| (C) 混入唔標示 | **我反對** —— 將主觀數據當客觀指標展示，違憲章禁虛構統計嘅精神 |

### 決策 2 —— 長題目點放入 session？

現時一 session 20 題 MC，按 3:5:2 抽。一條長題目建議用時 5–15 分鐘，同 MC 唔可以 1:1 換算；
混入同一 session 會令「20 題」失去意義，亦會拉爆 60 秒鎖死嘅節奏假設。

| 選項 | 後果 |
|---|---|
| **(A) 獨立 session**（例如 `?mode=long`，一次 2–3 題），MC session 完全唔變 | 改動面細好多，且對應真實 DSE 卷一／卷二分卷結構。**建議。** |
| (B) 混入，按 marks 折算格數 | 要改 `pickByDifficulty` 同 3:5:2 定義，牽連 QA 閘 |

### 決策 3 —— 60 秒逆向鎖死引擎點套落長題目？

鎖死現時由「客觀答錯中高難度題」觸發。長題目冇客觀對錯，只有自評。

**如果用自評「完全唔識」去觸發強制凍結 60 秒，等於懲罰誠實自評** ——
學生會學會揀「完全掌握」去避開凍結，自評數據即刻失去價值。

| 選項 | 後果 |
|---|---|
| **(A) 長題目唔觸發鎖死**，改為溫和邀請（「想唔想一齊拆解一次？」） | 保住自評誠實度。**建議。** |
| (B) 照觸發 | 自評數據會被學生策略性扭曲 |

---

## 5. 交付邊界（憲章紅線，先講清）

- **機器永不自動入庫。** 我可以出長題目**草稿**並過客觀閘，但**唔會**入 live 題庫。
  即係本輪交付完，學生喺 /practice 仲未會見到長題目 —— 要等真人逐題批 + 人手 wire。
- 為滿足 §4「同一 session 內必須有 UI 觸發點同可手動驗證」，驗證面設喺
  **`/admin` 審核預覽**：真人審題時見到嘅，就係學生將來見到嘅同一張卡。
  呢個唔使任何題目入庫都可以實測 UI。
- 兩張卡會一併遷語意 token（現時夾硬深色，同全站雙主題唔一致），並過渲染對比度稽核。

---

## 6. 建議執行次序（Phase 2，等 greenlight）

1. 改 `structural.test.mts` 按 type 分流 —— **先改測試，唔准倒過來**
2. `_gate.mjs` 放寬 + 按 type 驗必要欄位；`promote-drafts.mjs` 按 type 出 shape
3. `data/questions/index.ts` 出口放寬至 `AnyQuestion[]`
4. 兩張卡遷 token + 過對比度稽核
5. `/admin` 預覽按 type render（＝ UI 驗證面）
6. `PracticeSession` 按 `q.type` 分流；依決策 1–3 接統計、session、鎖死
7. 出首批長題目草稿 → 過閘 → **留待真人審批**
8. `npm run qa` / `npm test` / `npm run build` / 雙主題對比度稽核

**未有 Phase 2 greenlight，以上一項都唔會動。**
