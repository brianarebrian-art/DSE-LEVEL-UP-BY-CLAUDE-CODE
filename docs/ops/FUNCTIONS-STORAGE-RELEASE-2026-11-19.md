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
| Functions Storage GB | **已確認讀數：9.54 GB**（創辦人 Dashboard 截圖） |

## Dashboard 讀數（創辦人提供）

| 項目 | 值 |
|------|-----|
| 時間 | 2026-11-19（Asia/Hong_Kong）；圖表右緣約 07:00；標「Updated just now」 |
| Total size | **9.54 GB** |
| 免費額度（歷史） | ~**10 GB**（見 [`L-COST-AND-CAPACITY-2026-10-29.md`](./L-COST-AND-CAPACITY-2026-10-29.md)） |
| 臨時額度 | Limits increased **3x Until Dec 19** |
| 證據 | [`assets/functions-storage-2026-11-19.png`](./assets/functions-storage-2026-11-19.png) |

判語：**已確認讀數**。相對 10 GB 仍約 **95%**（緊）。Batch 1–3 實刪約 22:40 HKT，圖表右緣較早，**之後或再跌**——唔虛構 delta。

## 未刪（刻意）

- `confirm_E` 18 個近 7 日 preview  
- 2 個 production READY 唔喺 2026-11-19 批准 inventory：  
  `dpl_9QA12dFnDLCJyVpoFkrpNJJJRWjL` · `dpl_FPPHQ4J8Rtb8km26Uw4RvBngk7aK`

## 容量閘門

**讀數已到 · 空間仍緊。** WP2 **唔自動開工**；等你一句「開 WP2」或批准下一輪（例如 `confirm_E`）先做。
