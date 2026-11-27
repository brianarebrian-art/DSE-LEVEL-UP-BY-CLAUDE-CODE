# docs/08-hypothesis-results.md

> 2026-11-26（更新：試點缺陷掃描）

| 假設 | 結果 | 貢獻比例 | 說明 |
|---|---|---|---|
| H1 答案錯誤 | PARTIAL | UNKNOWN | 歷史 withdrawn 616；本輪 shape 閘通過；14 題近重複選項 → 封鎖加難 |
| H2 超綱 | UNKNOWN | UNKNOWN | 未跑 syllabus 對照 |
| H3 語言晦澀 | PARTIAL／UNKNOWN | UNKNOWN | 羞辱語 stub 0 命中；可讀性盲評未做 |
| H4 多答案 | PARTIAL | UNKNOWN | 近重複選項 14／500；學術互斥未跑 LLM |
| H5 UI 誤答 | UNKNOWN | UNKNOWN | 無熱區數據；空 answers 洩鍵已修 |
| H6 難度真高 | UNKNOWN／CALIBRATION_INSUFFICIENT | UNKNOWN | 無 IRT／等百分位；n≥30 未達；DF 多 FOUNDATION／STANDARD |

**主因比例：無法判定。** 禁止用本檔對外宣稱已解釋答對率落差。

## 分離規則（執行）

- 缺陷題 → `REJECTED`／withdraw 候選；**唔進** `CURSOR_REWRITE`
- 清潔題 → 可標 `DSE_PLUS_10` **意圖**（草稿）；實測難 10% 非本階段承諾
- 真難估計 → 只用已過缺陷閘題 + 公開 HKEAA 統計；否則維持 `CALIBRATION_INSUFFICIENT`
- 數量化：`delta_p`／`ratio_p`（目標 ≈0.9）見 [`docs/26-pvalue-accuracy-metrics.md`](./26-pvalue-accuracy-metrics.md)；現況聚合 **UNKNOWN**（無生產 n≥30 + 官方 P）

證據檔：`docs/gap-defect-scan-results.json` · `docs/pvalue-gap-report.json`
