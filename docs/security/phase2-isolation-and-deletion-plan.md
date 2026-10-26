# 階段二：Preview 隔離與帳戶刪除設計草稿

**狀態：** Review 草稿，未授權任何 Vercel/Supabase/OAuth/Sentry 設定變更；未套用 migration；未在 Preview 執行登入或資料操作。日期：2026-10-26。

## 1. 隔離現況與邊界

Vercel/Supabase metadata 曾顯示 Supabase database/service-role variables 僅設於 Production；但原有 Next public build vars 與 Auth.js/OAuth/Auth secret 等 variables 同時設於 Preview。Preview 因而不能被視為隔離環境。PR 的目前已發布 Preview 仍是較早 commit；本文件只記錄程式分支的新增防線，不代表遠端 Preview 已執行新版本。

| 路徑 | 本分支防線／應有 target | 狀態與剩餘限制 |
|---|---|---|
| Supabase REST／service role | Production 固定至已核對 project ref `aegekxapxgcfdrkzisis`；Preview/development 只使用各自 `DSE_PREVIEW_*`／`DSE_DEVELOPMENT_*` URL、key、ref，必須明確完全匹配；Preview 無 staging 設定就 fail closed。 | 已加純函式 project-ref policy 與合成 tests；尚未部署。真實 Preview variables 仍須人工 target audit；未建立 staging project。 |
| 瀏覽器題庫 GET | Next build 只把 deployment-specific public URL／anon key/ref 編入 bundle；只有明確 project ref match 才啟用。Preview 無 staging config 時回落靜態題庫。 | 本地 synthetic tests；未打開 Preview。公開 anon key 不是秘密，service-role/DB secrets 不進 client bundle。 |
| PostgreSQL／Better Auth | Production 用既有 `DATABASE_URL`/`BETTER_AUTH_*`；Preview/development 只讀 `DSE_PREVIEW_*`/`DSE_DEVELOPMENT_*`，並解析 direct/pooler DB host/ref。Backend mismatch、unknown target、wrong project 或缺值均不初始化。 | Preview Auth API 另由 catch-all 回 503；不能因為 env 變數出現就開啟。目標是未來隔離 E2E，而非本次啟用。 |
| Auth.js／Google OAuth／email | Preview Auth.js 和 Better Auth endpoints 均在 route 第一層回 503。未獲批准前不配置獨立 OAuth app、不登入；email/password 仍關閉，mail provider 尚未配置。 | 部署前 shared Auth.js `AUTH_SECRET`、Google ID/secret 與 auth URL 曾同時 target Preview/Production。程式 route gate 可阻止入口，但 Vercel 變數仍需另行人工清理/隔離批准。 |
| Push subscribe/unsubscribe | 所有寫入經 guarded server Supabase target。只接受官方 push provider endpoint host family；sender 再驗一次且 `redirect: 'error'`。 | Preview 缺獨立 service-role key 即拒絕資料操作；cron Preview 一律 404，無 outbound push。尚未對 provider 發送測試。 |
| Cron/background | Exam-day cron 在檢查 secret、建立 DB client 或發 push 前只允許 Vercel production。 | 程式防線；須再盤點 Vercel cron 和其他 webhook/job config。 |
| Outbound HTTP | `safeFetch` 僅接到固定的 HKO/MTR 考試日 upstream 並拒絕 redirect；動態 Push endpoint 有獨立 allowlist。 | 沒有找到 app 內 Redis/KV client，也沒有被使用的 Storage/Realtime SDK path；此為 source scan 結果而非網路層全面監測。 |
| Sentry SDK | Client/server/edge SDK 只在 Production 啟用；traces/transactions、logs 關閉；Replay 未安裝；Preview source map upload/tunnel 在 Next config 關閉。 | Vercel metadata 曾顯示 Sentry auth/public/OTLP/log-drain variables 對 Preview 亦存在。平台 log drain/外部集成可繞過 SDK `enabled:false`，程式無法停用；需管理員唯讀核實其目的地並另行批准變更。 |
| Vercel Speed Insights/Analytics | layout 已以 `VERCEL_ENV === 'production'` 限制。 | 不能只靠 SDK source 宣稱平台 integrations/edge logs 已停用。 |

### 建議的隔離配置（本身不是建立批准）

先以一個全新的 Supabase Free project 和合成資料作為唯一雲端驗收目標，project 建立完成後才使用 unique URL/ref/key；不得從 production clone、restore、seed 或讀取任何學生資料。若未獲 project 建立批准，繼續只做 local synthetic/unit/static tests。OAuth E2E 應先暫停：若日後要測 Google，建立專用測試 OAuth client/project、只允許一次性測試帳號及精確 Preview callback，且需另行批准；production Google client ID/secret 絕不可沿用。email/password 仍在整個測試期關閉，直至郵件供應商、網域、費用和驗證流程分別批准。

Vercel variables 需按 target 明確分區：Production 只留既有 production values；Preview 移除 production-only Auth.js/Google/Supabase DB/Sentry drain/source map credentials，然後只新增最少的 `DSE_PREVIEW_SUPABASE_PROJECT_REF`、`DSE_PREVIEW_SUPABASE_URL`、`DSE_PREVIEW_SUPABASE_ANON_KEY` 及 `DSE_PREVIEW_SUPABASE_SERVICE_ROLE_KEY`（service role 僅 server）。只有在獨立 DB migration/secret/oauth 測試另獲批准後，才考慮 Better Auth `DSE_PREVIEW_DATABASE_URL`、secret、base URL、Google test client。不要設 `NEXT_PUBLIC_*` service role/password。每次 build 檢查 compiled client bundle 不含 production project ref、service-role key、DB URL、OAuth secret；runtime 對 Preview project ref 進行 exact-match deny test；用 synthetic IDs 驗證每個 data route、cron、push endpoint 都不能回落 Production。不得打開 production Preview deployment 執行登入或資料測試。

## 2. Supabase Free project 提案（未批准建立）

| 項目 | 唯讀已知資料／限制 |
|---|---|
| Organization | `brianarebrian-art's Org`；ID `fdpsdnnxorqlsikbeten`；目前 Free。 |
| 現有 project | `DSE-LEVEL-UP`，ref `aegekxapxgcfdrkzisis`，region `ap-northeast-1`（Tokyo），Postgres 17.6.1.127。只看到此一 project，不能證明使用者在其他組織/其他 owner-admin 關係下沒有佔用 Free quota。 |
| 建議新 project name | `DSE-LEVEL-UP-Isolated-QA`（先確認 name 可用；不建立）。 |
| 建議 region | `ap-northeast-1`，與 production 同 region 方便相容性測試但使用完全不同 project/data/keys。選 region 不構成跨環境共享。 |
| Project quote | Supabase connector 回報 US$0 monthly；僅是 Free plan estimate，不含超額/稅項/使用者帳戶資格變數，也不保證 quota 可用。 |
| Free quota | 官方文件顯示 500 MB DB/project、1 GB storage、5 GB egress、5 GB cached egress、Free projects 數量受 owner/admin across organizations 限制；Free project 可因一週 inactivity pause，沒有 paid backup/PITR SLA。未得 account-wide quota definitive answer。 |
| 付款／升級 | 官方 billing setup 說明 paid plan 要求 payment method；目前資料不足以保證這個帳戶建立 Free project 絕不遇到額外驗證或提示。此 organization 顯示 Free；不按任何付費按鈕、不升級、不開始 trial。超出 Free quota 的影響以官方當期政策為準；不承諾硬性美元上限。 |
| Branch 替代方案 | 已報價 US$0.01344/branch-hour，約 US$0.32256/day、US$9.81/730-hour month，另需符合 Pro/branching 和 compute 規則；Free org 不適用，不能視為零成本。 |
| 相容性 | Project Postgres 17.6.1.127。Migrations 明確使用 `vector` 與 `pg_trgm`；Supabase 官方 extension docs/pgvector docs 列支援。當前 DSE Auth.js 用 Google `sub` 作 app `TEXT user_id`，migrations 明確未依賴 `auth.users`/`auth.uid()`。新增 Better Auth 只在其隔離 Postgres DB 及已明確選擇的 provider 後才會起用。仍需在新專案實際執行全部 migrations，檢查 RLS/grants/index/function/constraint、重跑與 rollback；已存在 `MIGRATIONS_FAILED` branch 不動。 |
| 刪除／保留 | 若獲批准，建議 7–14 天人工驗收 window；完成後先停止 Preview 用該 ref，另行確認刪除精確 project。Free inactivity pause 不能當作刪除或資料清除；刪除 project 可能永久刪除資料。預算只可稱 connector estimate $0 monthly、paid alternative 不批准，不能保證 usage 永遠 $0。 |

### 精確建立動作待批准

目前不執行。若你後續批准，請明確批准以下全部限定條件：在上述 organization 建立 **一個**名稱為 `DSE-LEVEL-UP-Isolated-QA`、region `ap-northeast-1`、**Free plan only** 的獨立 Supabase project；不新增付款方式、不升級、不試用、不啟用付費 add-on、不建立 branch、不複製 production 資料；只載入合成資料；建好後由你另行提供/批准只把測試 credentials 加到指定 Vercel Preview target。若建立畫面要求卡片、升級、trial、付費條款或任何費用，立即停止並不提交。保留期限最多先設 14 天，期滿只提出刪除申請，不自動刪除。

## 3. 帳戶刪除與 session 撤銷：提議的可測語義

此為設計提案，不是已實作或驗收。現有 route 逐表刪除可回報部分失敗，但 Auth.js stateless/JWT session 沒有中心撤銷狀態；僅清 cookie 或刪業務資料不足以證明跨裝置安全。Better Auth session 管理亦未在真實 DB/跨裝置實測。

1. **請求接受：** 已驗證使用者明確確認後，在單一 transaction 以 compare-and-set 把 lifecycle `active` 改成 `deleting`，寫入隨機 request/correlation ID 和開始時間。只能接受一次；重複請求回相同狀態，不重複建立不同流程。
2. **立即封鎖：** lifecycle 寫入成功是唯一生效時間點。從下一個 request 起，集中 server authorization resolver 查狀態，`deleting` 或 `deleted` 一律拒絕所有讀寫；不能只在刪除 API/前端檢查。任何 service-role API、Route Handler、Server Action、cron、RPC、Storage/Realtime/edge handler 都須列入入口清單。Service-role bypasses RLS，故必須在每個 server trust boundary 做統一授權；如未能覆蓋則不得上線。
3. **舊 session：** Better Auth session row 撤銷只是附加措施；所有請求仍須查 lifecycle，避免舊 Auth.js JWT 或其他裝置 bearer cookie 繞過。Auth.js stateless session 的 `sub` 保持可驗證也不代表可授權。
4. **原子刪除：** 提案以單一受限 `SECURITY DEFINER`/資料庫 transaction 刪除所有 registry 中的 user-scoped app tables、Better Auth account/session rows、push owner credentials、consent history 及可刪身份映射；所有表需固定 allowlist、RLS/grants/owner/search_path 固定、只准 service_role execute。任何失敗令整體 transaction rollback，保持 `deleting` 以便重試，不回成功。不得動 production；先在空白隔離 DB 驗證原子性和重跑。
5. **完成狀態：** DB transaction 成功提交後才標 `deleted` 並回「業務資料刪除完成」。備份、平台日誌、外部郵件/推送供應商資料不等同同步刪除，應另列處理者和其保留期限，不能對用戶假稱立即全域清除。
6. **並行與離線：** 所有有副作用的 write transaction 先鎖/讀 lifecycle，並用一致鎖順序；當狀態由 active 轉 deleting 後，新 write 失敗。刪除 transaction 對同 user 的並行請求序列化。離線裝置的 queue 在重連時由服務端生命周期拒絕；禁止 client merge/recreate 以復活資料，完成後需明確要求使用者另行新註冊。
7. **同一 Google 身份重登入：** 不以 email 合併或恢復刪除中的 user。刪除時將舊 `(provider, subject)` 映射改為最小化 tombstone（建議 keyed HMAC subject，不保存 email/token）並與 user lifecycle 連動；重登時命中 tombstone 就拒絕舊帳戶恢復，必須經明確的空白新帳戶流程。保留期限需由隱私/法律責任人決定；到期後移除 tombstone 前要確保所有舊 session 已超過最長有效期，並確認舊 user data/backups 不能重新掛接。
8. **狀態拆分：** `deleting` 不代表已接受（只有確認回應）；`deleting` 後已禁止存取；transaction commit 後才是業務資料刪除完成；backup/log/provider retention 結束是外部最終清除。API response/產品文字需各自表示，不混為一談。

驗收矩陣需要真實 isolated DB、合成 user IDs、兩個不同瀏覽器 session、舊 Auth.js JWT、Better Auth session、直接 API/Server Action/RPC/Storage/Realtime 可達入口、並行寫入與刪除、transaction fault injection、舊 offline queue reconnect、重登同 Google subject、刪除 retry、備份/供應商 retention copy。任何入口無法測到或存在 bypass 均阻擋宣稱完成。這些測試目前全部 blocked/not tested。

## 4. FIX-001 challenge 審閱

舊 branch 曾有 Push `auth` secret challenge 協議：server 產短期 nonce、browser 以 Push auth secret 做 HMAC proof、server 比對後換 management token。雖然 concept 可證明 controller possession，仍是自製協議，需檢驗 race/replay/limit/RPC 原子性，而 isolated DB 未獲批准。因此本 follow-up **已移除 claim route、nonce 欄位和 HMAC recovery helper/test**，不聲稱該協議已驗證。

現有替代流程：初次訂閱時產生 CSPRNG 256-bit opaque owner token，cookie 為 HttpOnly/Secure/SameSite=Strict；資料庫只保存 SHA-256 token digest；更新/刪除必須以現 cookie 的 digest 和 endpoint/version compare-and-set；未有有效 token、legacy hash NULL、猜測 endpoint 或僅持有 `p256dh`/`auth` 欄位均不能 claim/overwrite。使用者需在本機關閉舊通知，再啟用以產生新端點；即使舊端點仍在 DB，也只在 push provider 回 404/410 後才 prune。所有外來 endpoint 在寫入 route 和 cron sender 雙重驗證 provider host，sender 禁止 redirect；proxy 目前提供 per-instance general limit，不是分散式 abuse limiter。

**未測：** DRAFT migration 未套用，真 DB token hash/grant/RLS/CAS/concurrent/cron-vs-user tests 未做；push provider 未打出合成請求。這是 protocol simplification，不等於已驗收 FIX-001 完成。

## 5. safeFetch 決定

`safeFetch` 原意是對外部 HTTP request 下調 `Accept-Encoding`，不宣告 Brotli，避免已記錄的 Node/Brotli CVE Node2Shell 路徑；它不是 DNS/IP filter 或 runtime patch。本分支將它接到固定 HKO/MTR URL 的 exam-day upstream，且 `cachedJson` 在 cache lookup/network 前，只接受 HTTPS + 精確 host/path，拒絕任意 URL；再以 `redirect: 'error'` 防止允許的 upstream redirect 至未預期 host。題庫、Supabase、動態 push endpoint 不走該 helper。新增 synthetic regression 確認內網 URL 在 fetch 前遭拒絕。尚需查明 deployment Node runtime 是否已 patched；helper 不能替代 patch。

## 6. 遠端驗收／所需批准

本 follow-up 已提交至授權 task branch 並更新 PR #110；PR 維持 OPEN/未合併。新 head SHA、CI/Preview 建置狀態按 report appendix 記錄。程式推送會自動觸發 CI/Vercel Preview build，但 Preview 未被打開、登入或用於任何資料操作；Supabase Preview migration check 仍 skipped，沒有 migration E2E。所有本地通過項不能代替遠端 check，也不表示 Preview 安全配置已人工核實。

要進行完整 cloud E2E，尚待你另行批准上述一個獨立 Free project 建立，以及 project 建立後指定 Vercel Preview target 的 env 設置。若 Vercel 當前共享 Auth.js/Google secrets 或 Sentry drain 的 Preview variables 要移除/更改，須列出精確 key 名及 target 後獨立批准；不會讀取秘密值，也不會自行改設定。migration 套用、Google OAuth client、Notion、Production 都是其他批准閘門。
