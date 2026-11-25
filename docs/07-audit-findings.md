# docs/07-audit-findings.md

> 2026-11-26（Asia/Hong_Kong）· 雞蛋裏挑骨頭清單（節錄實測）

| 項目 | 結果 | 證據 | 優先級 |
|---|---|---|---|
| 選項順序是否固定 | PASS（顯示層洗牌） | PracticeSession + `_builder` correctIndex:0 | — |
| 儲存答案位置規律 | FAIL 若洗牌失效 | 全庫 correctIndex 慣例為 0 | P0 監控 |
| 答案可否由前端取得 | FAIL（相對 2B） | anon SELECT / JS chunk | P0（flag 路徑已建，預設關） |
| 年份溫習軸 | FAIL | year 多用 0 | P1 |
| paper 欄位驅動抽題 | FAIL | 無 paper 於題目物件 | P1 |
| 隨機 session seed 可預測 | PARTIAL | client Math.random 舊路徑；server HMAC seed 新路徑 | P1 |
| 解析是否逐步邏輯 | UNKNOWN | 多數散文 explanation | P2 |
| 背誦破解測試 | UNKNOWN | 未跑 | P1 |
| 列印完整卷 | PARTIAL | paper-warrior；無 server PDF | P1 |
| 等級官方等同聲稱 | PASS | trust-copy 測試／predictor 用語 | — |
| SEN／情緒安全回饋 | PARTIAL | 對抗閘有羞辱語檢查 stub | P1 |
| 實名審批覆蓋 | FAIL | REVIEWED_COUNT=5／26428 | P0 透明度 |
