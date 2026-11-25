# 安全／SEN／情緒安全閘（Sprint 5）

## 安全

| 檢查 | 結果 |
|---|---|
| secret:scan 路徑存在 | PASS（既有 scripts/secret-scan.mjs） |
| service role 不入 client | PASS（既有 server-only） |
| PRACTICE_SERVER_GRADE 預設關 | PASS |
| 0038 未擅自 apply | PASS |
| Sentry Replay | PASS（關） |
| Sentry scrub 含 correctIndex | FAIL／未做 — 記入 UNKNOWN |

## SEN／情緒

| 檢查 | 結果 |
|---|---|
| 對抗閘羞辱語 | PASS（stub） |
| 危機語句處理 | UNKNOWN — 沿用既有求助資源頁；本輪未改 |
| 減少干擾／列印 SEN 行距 | UNKNOWN |
