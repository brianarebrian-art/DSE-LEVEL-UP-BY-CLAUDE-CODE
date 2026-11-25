# docs/06-prediction-disclosure.md — 非官方等級／表現估算披露

> 2026-11-26（Asia/Hong_Kong）

## 必須披露（UI／API）

1. **非官方**：DSE Level Up 預測／估算 ≠ 考評局評級。  
2. **樣本量**：少於 `MIN_QUESTIONS`（見 `lib/mastery.ts`，現為 30）不顯示累積等級範圍。  
3. **信心**：以範圍而非單一等級；無校準數據時標 `CALIBRATION_INSUFFICIENT`。  
4. **更新日期**：顯示估算模型版本日。  
5. **書寫題**：永不入準確率（憲章 §16.A）。

## 本輪實作

- `/api/practice/grade` 回應含 `predictionDisclaimer`。  
- `/api/practice/session` 含非官方練習聲明。  
- **未**新增任何「準確率 %」對外宣稱。  
- 實證「難 10%」：**未做**（FAIL／UNKNOWN 見分數卡）。
