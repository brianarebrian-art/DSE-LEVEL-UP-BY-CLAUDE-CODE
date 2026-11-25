# docs/25 — 創辦人一次彙報：26,428 題（誠實版）

> 生成：2026-11-26（Asia/Hong_Kong）  
> 用途：一次過向創辦人交代全庫現況。**禁止**把本檔當「全庫已升級／已難 10%／已 RELEASED」證明。

## 裁決（先讀）

**「26,428 條題目」= 已盤點、學生預設可練習嘅 live 題數。**  
**唔等於** 26,428 條已升級、已簽署、已 RELEASED、或已證明難 10%。

| 層次 | 數字 | 狀態 |
|---|---:|---|
| Live 練習題（盤點） | **26,428** | PASS — [`docs/00-inventory.md`](./00-inventory.md)／`TOTAL_QUESTIONS` |
| Lifecycle：試點確定性閘 | **500** | `ADVERSARIAL_PASSED`；校準 `INSUFFICIENT`；**RELEASED=0** |
| Lifecycle：其餘 | **25,928** | `LEGACY_UNCALIBRATED`（ledger-only） |
| Cursor 改寫草稿（新 ID，**唔計入** 26,428） | **246** | `ADVERSARIAL_PASSED`；**未接** `data/questions/load.ts` |
| 一次簽署候選 | **746**（500+246） | 等創辦人簽 — [`docs/signoff-pack-batch1.md`](./signoff-pack-batch1.md) |
| APPROVED／RELEASED／實證 DSE_PLUS_10 | **0／0／0** | 禁止對外宣稱已達標 |

帳本來源：

- Pilot：`data/questions/lifecycle/pilot-500-ledger.json`（500 = 84×5 科 + economics 80）
- Legacy：`data/questions/lifecycle/legacy-uncalibrated-ledger.json`（25,928；`expectedTotal` 26,428）
- Cursor rollup：`data/questions/lifecycle/cursor-rewrite-batch1-rollup.json`（math 另計；連 math = 246）
- 簽署 ID：`docs/signoff-pack-batch1-ids.json`

## Cursor 改寫 batch1（分科）

| 科 | ADVERSARIAL_PASSED | REJECTED（缺陷擋） | 接線 load.ts |
|---|---:|---:|---|
| math | 49 | 1 | **否** |
| physics | 40 | 0 | **否** |
| chemistry | 39 | 1 | **否** |
| biology | 39 | 1 | **否** |
| bafs | 40 | 0 | **否** |
| economics | 39 | 1 | **否** |
| **合計** | **246** | **4** | **否** |

`df_intent=DSE_PLUS_10` 僅係**意圖**；校準維持 `INSUFFICIENT`。未簽署前禁止匯入學生可見正本。

## 內容現況（非 lifecycle）

| 項目 | 數字／狀態 |
|---|---|
| Live 練習題 | 26,428（MC ≈ 25,367 · text ≈ 185 · long ≈ 876） |
| 作者總庫（含非 live） | ≈ 27,448 authored |
| Withdrawn（學生不下發） | 616 |
| Withheld topic | 219 |
| 試點缺陷掃描 | 500 掃；486 清潔；**14** `near_duplicate_options` 封鎖加難 |
| 外部 LLM | **禁用**（僅 Cursor + 確定性腳本） |
| 空 answers 洩鍵 | 已修（grade API；見 PR #259） |

缺陷證據：[`docs/gap-defect-scan-results.json`](./gap-defect-scan-results.json)  
假設結果：[`docs/08-hypothesis-results.md`](./08-hypothesis-results.md)  
答對率落差：[`docs/02-accuracy-gap.md`](./02-accuracy-gap.md)

## 可講／唔可講

**可講**

- 26,428 已全量盤點，學生預設可練習  
- 試點 500 + Cursor 草稿 246 已過確定性對抗閘  
- 答對率落差已做缺陷分離；缺陷題唔抬難  
- 空交卷不再洩答案鍵（新 grade 路徑）  
- RELEASED=0，無虛假全庫發布  

**唔可講**

- 全庫已 RELEASED／已教師全審  
- 已證明難 10%／全庫 DSE_PLUS_10 實測達標  
- 已跨模型 AI 盲審  
- 25,928 legacy 已校準  

## 未完成（誠實清單）

完整分數卡：[`docs/19-final-scorecard.md`](./19-final-scorecard.md) · 短板：[`docs/16-shortfall-report.md`](./16-shortfall-report.md)

重點未完成：

1. **25,928** 仍 `LEGACY_UNCALIBRATED`  
2. Cursor 246 未接線、未 APPROVED／RELEASED  
3. 實證難 10% = **0**（無 n≥30 等百分位）  
4. 憲章 2B 未簽；migration `0038` DRAFT  
5. 舊客戶端路徑仍可暴露答案；`PRACTICE_SERVER_GRADE` 預設關  
6. 全科可列印 PDF／聆聽口語等卷別支援未達標  
7. Bugbot（PR #259）：部分 Cursor 草稿 `optionsEn` 與中文選項索引未對齊 — 簽署前須修  

**總評：30 日縮範圍基建 PASS；全量題庫升級 FAIL（預期內）。**

## 創辦人下一步

1. 讀簽署包 [`docs/signoff-pack-batch1.md`](./signoff-pack-batch1.md)（746 候選，非 26,428）  
2. 簽完先允許：分批接線已簽 Cursor 草稿 + server grade 灰度  
3. Legacy 25,928 繼續分批缺陷閘 → 改寫 → 再簽；禁止一次口頭全放  

簽名：________　日期：________（Asia/Hong_Kong）
