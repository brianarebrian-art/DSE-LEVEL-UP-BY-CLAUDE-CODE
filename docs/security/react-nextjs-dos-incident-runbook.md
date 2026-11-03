# React／Next.js DoS 緊急應變 Runbook

## 1. 偵測

來源包括 Vercel logs/WAF events、Sentry error tracking、CPU/duration/5xx alerts、外部 health check 及用戶報告。記錄 deployment、commit、route、時間（香港時間及 UTC）、request ID、region、metrics screenshot/link。

## 2. Triage

1. 確認是否集中於 Server Action POST、RSC/App Router request 或單一 deployment。
2. 比較正常 baseline 與當前 CPU、duration、latency、5xx、health-check。
3. 判斷係惡意／異常 request、deployment regression、平台事故或依賴問題。
4. 不下載、轉發或重播未經批准嘅真實 payload；只保留必要 metadata。

## 3. Severity 判定

- **SEV-1:** production 無法服務、health check 持續失敗、CPU saturation、廣泛 5xx 或學生登入／學習流程受阻。
- **SEV-2:** Server Action 明顯退化、局部 5xx／高 latency，服務仍可用但有擴散風險。
- **SEV-3:** 單一 route 異常、可由 WAF/rate limit 控制，無廣泛用戶影響。

SEV-1 立即通知 incident commander、Security、Platform 及 product/data owner；不可等完整根因先處置。

## 4. Containment

1. 暫停 promotion／新 deployment。
2. 收緊 Vercel WAF managed rule、route-specific rate limit、POST body-size limit；記錄 rule ID、操作者及時間。
3. 對可疑來源啟用 managed bot challenge；保留學生正常 allow path。
4. 如仍然持續，使用最後已驗證 patched deployment；不可回滾到已知 affected dependency artifact。

## 5. WAF emergency rule

只由獲授權 Security/Platform owner 建立最小範圍規則：指定 route、method、region/IP signal、rate threshold 及 expiry time。先 dry-run（如可用），再 block/challenge；每次變更完成後以正常 read-only flow 驗證，並記錄 rollback rule。

## 6. Disable affected Server Action

1. 由 incident commander 指定 action name/route 及 disable scope。
2. 以 feature flag／route guard 回應 maintenance 或 503；避免執行昂貴 operation。
3. 如無 flag，停止受影響 deployment promotion 或部署已批准的最小 containment change。
4. 驗證學生 read-only／非受影響流程，並監察 health check、5xx、CPU、duration。
5. 保留 disabled reason、開始時間、操作者及恢復條件。

## 7. Key／credential rotation（如適用）

只有當 logs 顯示 credential exposure、token misuse 或第三方 connector 受影響時才 rotate。於 Vercel／Supabase secret manager 產生新 secret、更新 preview/staging、驗證服務，再按批准窗口更新 production；不得將 secret 寫入文件、logs 或 chat。若無 exposure evidence，記錄「rotation not required」及原因。

## 8. Rollback

停止 promotion，回到最後已驗證 patched deployment。使用 deployment-level rollback，保留原 deployment/commit；不要 reset、刪除學生資料或回滾到明知 affected 的 React version。Rollback 後重跑 health check、正常 Server Action smoke test 及 error monitoring。

## 9. User communication

由指定 communication owner 發出狀態更新：受影響功能、開始時間、目前 workaround、資料完整性狀態（只在已確認時說明）、下一次更新時間。避免披露可重播 exploit payload、內部 secrets 或未證實根因。

## 10. Post-mortem

24 小時內完成時間線、detection gap、WAF/rate-limit effectiveness、dependency evidence、customer impact、資料／credential assessment、rollback outcome 及永久修正 owner。建立 follow-up ticket：React/Next.js upgrade、monitoring gaps、Server Action inventory、runbook drill；完成後更新 incident assessment 及 risk acceptance。

## 手動確認清單

- Vercel：WAF、logs、alerts、deployment rollback、environment scope、owner permissions。
- Supabase：auth/session logs、edge/function limits、DB connection/statement timeout、secret rotation procedure。
- DNS/health monitoring：外部 probe、TTL、failover／maintenance route、通知 escalation。
- WAF/bot provider：challenge、allowlist、rate policy、audit log、emergency contact。
