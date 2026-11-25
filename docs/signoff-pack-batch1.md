# 一次簽署清單（Sign-off Pack）— Batch 1

> 生成：2026-11-26（Asia/Hong_Kong）  
> **本包不請求把 26,428 全庫標為 RELEASED。**  
> 簽署對象 = 已 `ADVERSARIAL_PASSED` 且缺陷閘通過嘅清單。

## 創辦人一次簽署範圍

| 清單 | 數量 | 檔案 | 學生可見？ |
|---|---|---|---|
| Pilot 500（確定性閘） | 500 | `data/questions/lifecycle/pilot-500-ledger.json` | 否（仍未接 `RELEASED`；部分已在正本但標 `PARAM_UPGRADED`／`DSE_PLUS_10_UNCALIBRATED`） |
| Math Cursor rewrite batch1 | 49 | `data/questions/lifecycle/math-cursor-batch1-ledger.json` | **否** — 未接線 `load.ts` |
| Physics Cursor rewrite batch1 | 40 | `data/questions/lifecycle/physics-cursor-batch1-ledger.json` | **否** |
| Chemistry Cursor rewrite batch1 | 39 | `data/questions/lifecycle/chemistry-cursor-batch1-ledger.json` | **否** |
| Biology Cursor rewrite batch1 | 39 | `data/questions/lifecycle/biology-cursor-batch1-ledger.json` | **否** |
| BAFS Cursor rewrite batch1 | 40 | `data/questions/lifecycle/bafs-cursor-batch1-ledger.json` | **否** |
| Economics Cursor rewrite batch1 | 39 | `data/questions/lifecycle/economics-cursor-batch1-ledger.json` | **否** |
| **Cursor 改寫合計（可簽進下一步）** | **246** | `data/questions/lifecycle/cursor-rewrite-batch1-rollup.json` | **否** |

機器可讀 ID 清單：`docs/signoff-pack-batch1-ids.json`

## 明確排除

- 全部 `LEGACY_UNCALIBRATED`（~25,928）
- 缺陷掃描 `blocked`（14 題）— 見 `docs/gap-defect-scan-results.json`
- Cursor 改寫中 `REJECTED`／`CURSOR_REWRITE_BLOCKED_DEFECT`／`CURSOR_REWRITE_GATE_FAIL`
- 任何「已證明難 10%」宣稱（本輪僅 `df_intent=DSE_PLUS_10`，校準 `INSUFFICIENT`）

## 簽署後先做（仍非全庫）

1. 將**已簽** Cursor 草稿分批接線 `data/questions/load.ts`（按科）  
2. （另批）`PRACTICE_SERVER_GRADE` 灰度 + 回滾開關  
3. 維持未簽題目喺 `ADVERSARIAL_PASSED` 或 `LEGACY_UNCALIBRATED`

## 簽署核對清單（創辦人）

- [ ] 已讀 `docs/02-accuracy-gap.md`：答對率落差 ≠ 已難 10%  
- [ ] 已讀 `docs/08-hypothesis-results.md`：主因比例 UNKNOWN  
- [ ] 確認 Cursor 改寫 **246** 題均未接線學生正本  
- [ ] 確認空 answers 洩鍵已修（grade API）  
- [ ] 確認無外部 LLM 本輪預算／呼叫  
- [ ] 簽名：________ 日期：________（Asia/Hong_Kong）

## 狀態總表

| 閘 | 狀態 |
|---|---|
| 憲章 2B | DRAFT |
| 外部 LLM | 禁用 |
| APPROVED | 0 |
| RELEASED（本包） | **0 — 等待一次簽署** |
| 實證 DSE_PLUS_10 | **0** |
