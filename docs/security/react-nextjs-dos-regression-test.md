# React／Next.js DoS 回歸測試計劃

## Safety boundary

- 只可在 staging／preview 環境執行。
- 只使用 synthetic payload；不可使用學生個人資料、真實 token 或 production credentials。
- 不可對 production、main deployment 或公開第三方服務執行攻擊。
- 固定低 concurrency、短 duration；任何 resource exhaustion、health-check failure 或 error-rate spike 即刻停止。

## Test matrix

| 版本 | 環境 | 目的 |
| --- | --- | --- |
| Unpatched | 隔離 preview/staging | 建立受控 baseline；不可外推至 production。 |
| Patched | 隔離 preview/staging | 確認 dependency fix 及補償控制後的 resource behaviour。 |

兩個 preview 必須使用獨立 synthetic data、可識別 deployment/commit、相同測試設定及相同監察窗口。

## 測試前記錄

- deployment URL、commit SHA、dependency lockfile hash、測試時間。
- CPU、memory（如可得）、request latency p50/p95/p99、5xx rate。
- Server Action 429/413/WAF events。
- health-check success、latency、timeout 及 recovery baseline。
- active connections／duration（如平台提供）。

## 執行步驟

1. 先對 read-only endpoint 做短 smoke test，確認 preview 正常。
2. 對指定 Server Action 使用 synthetic、邊界大小及 nested reference payload；不得帶入真實資料。
3. 以低速率、分階段 request burst 執行，每階段後檢查 CPU、latency、5xx、health check。
4. 觸發 rate limit/body-size/WAF controls 時記錄 status code、rule ID、Retry-After 及 logs。
5. 任何 stop condition 出現即停止，等待 health check 恢復並記錄 recovery time。
6. 對 unpatched 與 patched preview 使用相同 workload，完成差異比較。

## Pass criteria

- Patched preview 不出現 sustained CPU saturation、health-check failure 或服務無回應。
- 受控超額請求收到預期 429／413／WAF challenge/block，而非 5xx storm。
- 正常低頻 smoke flow 成功率達 99% 或高於既定 staging SLO。
- p95/p99 latency、5xx rate、recovery time 不超過預先批准 threshold；threshold 必須於測試前填入。
- 測試期間及測試後 logs、metrics、deployment evidence 完整。

## Fail criteria / stop conditions

- 任何 production request 被送出。
- health check failure、5xx rate 超過批准 threshold、CPU 持續飽和、preview 無法恢復。
- synthetic payload 意外包含個人資料／secret。
- rate limit、body-size limit 或 WAF control 無法生效，或正常流量被大規模誤阻。

Fail 後保留 evidence、停止測試、通知 incident commander，並按 rollback plan 處理；不可自行放寬 threshold 後重跑。

## Sign-off

- Security tester: `[Name / date]`
- Engineering owner: `[Name / date]`
- SRE/Platform observer: `[Name / date]`
- Incident commander: `[Name / date]`
