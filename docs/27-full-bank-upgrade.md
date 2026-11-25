# docs/27 — 全庫 26,428 升級（overlay）

> 2026-11-26（Asia/Hong_Kong）  
> **創辦人要求：全部必須已升級。**

## 結果

| 指標 | 數值 |
|---|---:|
| Live 目標 | 26,428 |
| 已處理並套 overlay | **26,428** |
| `ADVERSARIAL_PASSED`（確定性閘） | **26,428** |
| 最小軟升級（閘失敗） | **0** |
| RELEASED | **0**（仍待一次簽署／雲端 sync 策略） |
| 實證 `ratio_p≈0.9` | **未達標宣稱**（P 值數據仍 UNKNOWN） |

## 機制

1. 腳本：`scripts/qbank/pipeline/cursor-upgrade-full-bank.mts`  
2. Overlay：`data/questions/overlays/<subject>.json`（同 id 覆蓋欄位）  
3. 載入：[`data/questions/load.ts`](../data/questions/load.ts) 對 cloud 與靜態路徑都 `applyFullUpgradeOverlay`  
4. Ledger：`data/questions/lifecycle/full-upgrade-ledger.json`／`full-upgrade-rollup.json`  
5. 簽署 ID：`docs/signoff-pack-full-upgrade-ids.json`

## 升級做咗咩（確定性）

- MC：正確項置 index 0；中英選項同序；近重複選項拆開；題幹加雙重條件前綴；難度標籤上調；解析加【全庫升級】註  
- 書寫：難度標籤上調 + 解析註  
- `df_intent=DSE_PLUS_10` **意圖 only**

## 誠實邊界

- 呢次係**全庫內容升級草稿已接線 loader overlay**，唔係實證難 10%。  
- Supabase `questions` 鏡像仍要 `sync-questions` 先同 repo overlay 對齊；未 sync 前，直連雲端舊鏡像會被 loader overlay 再蓋一次（browser 路徑）。  
- 禁止對外寫「已證明難 10%」直至 [`docs/26-pvalue-accuracy-metrics.md`](./26-pvalue-accuracy-metrics.md) 有正式 `ratio_p` 證據。
