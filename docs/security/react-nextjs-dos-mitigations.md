# React／Next.js DoS 補償控制清單

> 目的：在 dependency hotfix 未批准前降低暴露面。以下全部為建議及待確認設定，不假設 Vercel WAF、rate limit 或 bot protection 已經啟用。

## 控制清單

| 控制 | 建議 | 驗證方法 | 負責人 |
| --- | --- | --- | --- |
| Vercel WAF | 對高風險 Server Action POST path 套用 managed rules；先在 preview/staging 觀察 false positive，再逐步收緊。 | 以正常 founder/admin 流程測試 2xx；查 WAF event、blocked request、5xx。 | `[Owner: Security/Platform]` |
| Server Action rate limit | 按 IP、session/user、route 分層；對匿名及高成本 action 使用較低 burst，回應 429 並帶 Retry-After。 | staging 發送合成 burst；確認合法低頻請求成功、超額請求收到 429、應用 CPU 無持續上升。 | `[Owner: Backend]` |
| POST body size | 對 Server Action / API POST 設定最小可行上限；拒絕超限 payload，並記錄 413。 | 使用合成 payload 測試低於／等於／高於上限；確認 413、無 crash、正常 action 不受影響。 | `[Owner: Platform]` |
| Bot challenge | 對匿名、異常速率及可疑 fingerprint 使用 managed challenge；避免對已登入學生正常流量全面 challenge。 | preview/staging 驗證 challenge、通過後 action、失敗後拒絕及 audit event。 | `[Owner: Security]` |
| CPU alert | 設定 preview/staging baseline；production CPU 短時間高於 baseline 時通知 on-call。 | 以測試事件或告警 dry-run 驗證 notification、deduplication、escalation。 | `[Owner: SRE]` |
| Duration alert | 監察 Server Action/request duration p95/p99 及長尾；超過 baseline 通知。 | 以 synthetic request 產生可控 latency，確認 alert 及 trace link。 | `[Owner: SRE]` |
| 5xx alert | 按 route 及 deployment 監察 5xx rate；Server Action path 使用較低 threshold。 | staging 產生受控 5xx 或使用 alert test event，確認告警內容完整。 | `[Owner: SRE]` |
| Health-check alert | 由外部 health check 監察首頁及關鍵 read-only endpoint；分開記錄 timeout、5xx、DNS/TLS。 | 執行 maintenance／synthetic check，確認 failure、recovery、通知及 escalation。 | `[Owner: Platform]` |

## Emergency disable Server Action 流程

1. Incident commander 確認受影響 action route、時間窗及 severity。
2. 優先用 feature flag／route guard 將該 action 回應為 maintenance 或 503；不要刪資料或改 database schema。
3. 若無 runtime flag，使用 Vercel promotion／deployment rollback 或最小範圍 code change 停止該 action。
4. 套用 WAF block、rate limit 及 body-size limit，保留規則 ID、時間、操作者及 evidence。
5. 用合法 read-only flow 做 smoke test；確認 health check 恢復後才考慮逐步恢復。
6. 記錄是否需要 key／credential rotation，完成 post-incident review 及永久 hotfix approval。

## 手動確認項目

- Vercel：WAF plan、managed rules、rate-limit capability、logs、alerts、deployment rollback 權限。
- Supabase：是否有 edge/function rate limit、audit log、DB connection/statement timeout；不可假設存在。
- DNS／health monitoring：外部 probe、TTL、failover／maintenance routing。
- WAF／bot provider：challenge policy、allowlist、false-positive review、緊急聯絡人。
