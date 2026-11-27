# docs/27 — 全庫 26,428 升級（overlay）

> 2026-11-26（Asia/Hong_Kong）  
> **創辦人要求：全部必須已升級；並要有客觀事實證明難 10%。**

## 結果

| 指標 | 數值 |
|---|---:|
| Live 目標 | 26,428 |
| 已處理並套 overlay | **26,428** |
| `ADVERSARIAL_PASSED`（確定性閘） | **26,428** |
| **結構 DF≥0.4σ（docs/05 難 10% 帶）** | **26,428／26,428** |
| 最小軟升級（閘失敗） | **0** |
| RELEASED | **0**（仍待一次簽署） |
| 實證學生 `ratio_p≈0.9` | **未達標宣稱**（作答數據仍空） |

證明產物：[`docs/28-plus10-objective-proof.md`](./28-plus10-objective-proof.md)、[`docs/plus10-objective-proof.json`](./plus10-objective-proof.json)。

## 機制

1. 腳本：`scripts/qbank/pipeline/cursor-upgrade-full-bank.mts`（由正本載入；升級至 σ-lift≥0.4）  
2. Overlay：`data/questions/overlays/<subject>.json`（同 id 覆蓋欄位）  
3. 載入：[`data/questions/load.ts`](../data/questions/load.ts) `applyFullUpgradeOverlay`；可用 `skipUpgradeOverlay` 取基線  
4. 證明：`scripts/qbank/pipeline/prove-plus10-objective.mts` + `df-proxy.mts`  
5. Ledger／簽署：`full-upgrade-*.json`、`signoff-pack-full-upgrade-ids.json`

## 升級做咗咩（確定性）

- MC：雙重條件前綴；正確項 index 0；近重複拆開；必要時步驟閘／互斥干擾；難度標籤上調  
- 書寫：雙重條件＋【作答要求】前提與步驟；必要時步驟閘  
- 每題寫入 `sigma_lift`；`df_intent=DSE_PLUS_10`

## 誠實邊界

- **結構難 10%**（DF≥0.4σ）已全庫達標，可重現。  
- **學生實測** `ratio_p` 仍 UNKNOWN（無逐題作答）。  
- Supabase `questions` 鏡像仍建議 `sync-questions` 對齊。  
- `RELEASED` 仍為 0。
