# docs/26 — 答對率與難度數量化（P‑value）

> 2026-11-26（Asia/Hong_Kong）  
> **觀察指標，唔係絕對客觀難度。** 平台自發溫習用戶 ≠ 全港 DSE 應考考生。

## 定義

教育測驗難度指數：

\[
P = \frac{\text{答對人數}}{\text{有效作答人數}},\quad P\in[0,1]
\]

數值愈大題目愈容易；愈細愈難。

| 符號 | 欄位 | 意思 |
|---|---|---|
| \(P_{HKEAA}\) | `hkeaa_ref_p` | 考評局原題官方逐題答對率；無公開則 `null` |
| （推定） | `hkeaa_est_p` | 無官方數據時 AI／人工推定；必須標【推定】 |
| \(P_{DLU}\) | `dlu_p` | DSE Level Up 本題學生實測答對率 |
| \(\Delta P\) | `delta_p` | \(P_{DLU}-P_{HKEAA}\)（**百分點**差；負＝平台較低） |
| 相對比值 | `ratio_p` | \(P_{DLU}/P_{HKEAA}\) |
| | `sample_size` | 平台有效作答人數 |

比較基準優先用 `hkeaa_ref_p`；僅當其為 null 先用 `hkeaa_est_p`（報告必須寫【推定】）。

## 業務目標（難度 +10% 意圖）

粗目標（其他條件接近時）：

\[
P_{DLU} \approx 0.90 \times P_{HKEAA}\quad\Rightarrow\quad ratio\_p\approx 0.9
\]

即相對答對率約低官方 **10%（相對）**，**唔係** 10 個百分點。  
在有足夠樣本（n≥30）同對照考點之前，**禁止**對外宣稱「已證明難 10%」。

## 數據品質

1. **群體差異：** \(\Delta P\)／`ratio_p` 混合咗題目難度差同用戶群體差；只係參考。  
2. **同考點、同題型**先可比；禁止跨課題亂比。`same_topic_type` 必須**顯式 true** 先入正式聚合（缺省／false = 唔入）。  
3. **D4：** 只存 P 值數字同考點對照元數據；唔搬考評局題文。  
4. **n&lt;30：** 唔入正式聚合；可列觀察。  
5. **異常：** `delta_p < -0.3` → 優先複檢（缺陷 vs 真難）。

## 聚合報告寫法

> 「現階段 DSE Level Up 全庫統計：平台學生答對率相對於考評局對應考點原題，平均相對比值為 X；亦即平台學生答對表現平均只達真 DSE 考生 X×100%，平均絕對差距 Y 個百分點。（已統計 N 題，每題 n≥30；樣本群體≠全港應考考生。）」

若無生產作答／無官方 P：標 **UNKNOWN**，唔填假數字。

## 實作位置

| 產物 | 路徑 |
|---|---|
| Cursor 規則 | [`.cursor/rules/pvalue-accuracy.mdc`](../.cursor/rules/pvalue-accuracy.mdc) |
| Schema DRAFT | [`supabase/migrations/0039_item_pvalue_metrics.DRAFT.sql`](../supabase/migrations/0039_item_pvalue_metrics.DRAFT.sql) |
| 聚合腳本 | [`scripts/qbank/pipeline/compute-pvalue-gap.mts`](../scripts/qbank/pipeline/compute-pvalue-gap.mts) |
| 輸出佔位 | [`docs/pvalue-gap-report.json`](./pvalue-gap-report.json) |

## 現況（本輪）

- `practice_attempts` 生產寫入／校準事件：**未開齊** → `dlu_p` 多數 UNKNOWN  
- 官方逐題 `hkeaa_ref_p`：**未批量入庫** → 對照 UNKNOWN  
- 難度 +10%：僅有 `df_intent` 草稿；實證 `ratio_p≈0.9` 未達標宣稱條件  
