# Functions Storage 釋放驗證（Batch 1–3）

時間：**2026-11-19**（Asia/Hong_Kong）  
腳本：`scripts/ops/delete-approved-vercel-deployments.mjs`  
結果 JSON：[functions-storage-delete-result-2026-11-19.json](./functions-storage-delete-result-2026-11-19.json)

## 做咗咩

1. Dry-run：`delete=158` · keep=3 · confirm_E=18  
2. 實刪：`deleted=158` · `failed=0`  
3. 範圍：Batch 1（ERROR/CANCELED）+ Batch 2（preview READY）+ Batch 3（舊 production READY）

## 驗證

| 項目 | 結果 |
|------|------|
| keep 3 production READY | 仍在 |
| confirm_E 18 | 仍在（未動） |
| 已刪 ID | 抽樣／全集對照：0 仍存在 |
| 剩餘 deployments | 47（READY 36 · ERROR 6 · CANCELED 5） |
| production READY | 5（含 keep 3 + 2 個唔喺批准包內嘅舊 production） |
| `https://www.dselevelup.com/` | HTTP 200 |
| `/robots.txt` | HTTP 200 |
| Functions Storage GB | **無法用 API 讀** → 請 Dashboard 對比 |

## 未刪（刻意）

- `confirm_E` 18 個近 7 日 preview  
- 2 個 production READY 唔喺 2026-11-19 批准 inventory：  
  `dpl_9QA12dFnDLCJyVpoFkrpNJJJRWjL` · `dpl_FPPHQ4J8Rtb8km26Uw4RvBngk7aK`

## 你要做（1 分鐘）

1. 開 Vercel Dashboard → team `dselevelup` → Usage → **Functions Storage**  
2. 對比刪前基線（若有截圖）／而家 GB  
3. 回覆：已確認釋放／等待更新／無法驗證  

容量閘門通過後先開 WP2。
