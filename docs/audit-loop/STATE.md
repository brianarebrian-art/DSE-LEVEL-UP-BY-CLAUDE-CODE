# Audit Loop State
最後更新：2026-10-04 · Iteration #12 · Branch: audit-loop

- Branch 起點：`feat/ux-loop` 的 `29e54f8`（包括改進循環 2 全部 commit）。`origin/main` 為 `8258ab0`。
- 審計原文：`docs/audit-loop/source-audit.md`（2026-10-01 由 `~/Downloads/DSE level up.md` 複製，未改動）。
- Prompt：`docs/prompts/audit-loop.md`（v5，2026-10-01，按用戶貼上內容寫入）。

## 現況快照（T00）

代碼檢查以本 branch 為準；回應標頭以 production（`https://dse-level-up-by-claude-code.vercel.app/`，2026-10-01 `curl -sI`）為準。

| 審計講法 | 實際 | 證據 |
|---|---|---|
| 26,497 條題目 | ✅ 屬實（練習池）。已編寫 27,326，其餘為已收起 597、課題暫緩 219、等人手判斷 13 | `data/questions/summary.generated.ts` `TOTAL_QUESTIONS`、`CONTENT_STATS` |
| 每科約 866–1624 條 | ✅ 屬實（每科總數 866–1624；選擇題 857–1594） | 同上 `SUBJECT_SUMMARY` |
| 音樂、體育、視藝等每科只有 13 條書寫題 | ✅ 屬實（書寫題 9–128 條；10 科為 13 條，倫理與宗教 9 條） | 同上 |
| 題目「全部由 2026 DSE 考生逐題覆核」（審計更新二，來自創辦人口述） | ❌ repo 無此紀錄：具名審批紀錄已於 2026-09-25 刪除，`REVIEWED_COUNT` = 0；憲章 §12 規定照實披露「未有真人逐題審批」 | `data/provenance.ts`、憲章 §12.1 約束 1、記憶紀錄 review-records-deleted。見 Q-P7 |
| 首頁撳科目到第一題 | ⚠️ 部分：首頁 4 個核心科目一撳直入 `/practice?subject=…` 第 1 題；有選修的科目先出選修單元對話框；「開始練習」→ `/start`：新用戶到 `/subjects`，回訪用戶續做或開最近科目 | `lib/quickStart.ts`、`app/start/StartRedirect.tsx`；2026-10-01 瀏覽器實測 |
| 答錯後「揀錯因 → 情緒彈窗 → 撳展開解析」 | ⚠️ 部分：錯因三選一是回饋區內的按鈕（非彈窗），揀之前解析收起；情緒全屏對話框只在**難題**答錯且未開安靜模式時出現，不是每題 | `app/practice/PracticeSession.tsx:526` `if (!isCorrect && currentQ.difficulty === 'hard' && !isQuiet()) setEmoOpen(true)`；`components/EmotionThermometer.tsx:67` `fixed inset-0` |
| 解析預設收起 | ✅ 屬實：只顯示首句提示，撳後展開；學生可揀「直接畀我睇晒」並記住 | `components/StagedExplanation.tsx` `KEY_ALWAYS_FULL = 'dse_explain_always_full'` |
| robots.txt 列出 /admin/、/account、/sign-in、/sign-up | ✅ 屬實（按 prompt §8 保持現狀） | `public/robots.txt` |
| 頁面由 `cdn.tailwindcss.com` 載入 | ❌ 唔屬實：repo 內只有審計原文及 prompt 提及；用本地 Tailwind v4 | `grep -rn cdn.tailwindcss.com`（排除 node_modules、.next、docs/audit-loop、docs/prompts）零結果 |
| 缺 HSTS | ❌ 唔屬實：production 回 `strict-transport-security: max-age=63072000; includeSubDomains; preload` | `curl -sI`；`next.config.ts:34`。`preload` 與 prompt §8 不符，見 Q-P5 |
| CSP `script-src 'self' 'unsafe-inline'` | ✅ 屬實 | `curl -sI`；`next.config.ts:20` |
| X-Frame-Options、nosniff、Referrer-Policy、Permissions-Policy | ✅ 屬實 | `curl -sI` |
| 缺 rate limiting | ❌ 唔屬實：`proxy.ts` 按 IP 記憶體滑動視窗（/api 每分鐘 60、/api/auth 每 10 分鐘 30），每個 instance 各自計 | `proxy.ts`、`lib/rateLimit.ts` |
| 無 `/.well-known/security.txt` | ✅ 屬實 | `public/.well-known/security.txt` 不存在 |
| Footer／關於頁無 Instagram、Threads 連結 | ✅ 屬實 | `components/Footer.tsx`、`app/about/AboutClient.tsx` 無相關連結 |
| 首次打開就有「加到主畫面」橫幅 | ✅ 屬實（瀏覽器支援時）：只有「唔使喇」後永久收起，未按完成練習與否控制 | `components/InstallHint.tsx` |
| Desktop sidebar 捲動後消失 | ⚠️ 未重現：側欄是 `fixed inset-y-0`，應常駐；待 T15 實測 | `components/Sidebar.tsx:107` |
| 練習頁載入 3–5 秒 | ⬜ 待驗證（T47 量度） | — |

### Prompt 提及的路徑及指令

| 項目 | 結果 |
|---|---|
| `docs/charter.md`、`CLAUDE.md`、`lib/sync.ts`、`proxy.ts`、`next.config.ts`、`supabase/migrations/` | ✅ 存在（雲端 key 名單現由 `lib/cloudKeys.ts` 定義、`lib/sync.ts` 使用） |
| `scripts/qbank/_gate.mjs`、`review-drafts.mjs`、`promote-drafts.mjs` | ✅ 存在；另有 `auto-promote.mts`（憲章 §12 預設通道） |
| `decisions.json` | ⚠️ 無單一 `decisions.json`；有每批次的 `scripts/qbank/drafts/*.decisions.json` |
| `*-reviewed.ts` | ✅ `data/questions/` 內 72 個 |
| `getServiceSupabase()` | ✅ 用於 `app/api/progress`、`app/api/privacy/consent`、`app/admin` 等 |
| `middleware.ts` | ✅ 不存在（用 `proxy.ts`）；prompt 說「會被靜默忽略」，實際兩者並存時 build 會報錯，見 Q-P6 |
| `scripts/metrics/` | ❌ 不存在（T27／T37 會建立） |
| `npm run qa`／`npm test`／`npm run build` | ✅ 存在；build 為 `next build --webpack`；`next` 版本 `^16.3.3` |

## 任務

| ID | Gate | 狀態 | Commit | 證據／備註 |
|---|---|---|---|---|
| T00 | DIRECT | DONE | `ffbb870` | 見上方快照；FOUNDER-QUEUE Q-P1–Q-P10 |
| T54 | DIRECT | DONE | `234681a` | Wave 8：U01–U16；Wave 9：D01–D12；無 `BREAKING` |
| T01 | SIGN | WAITING-FOUNDER | | 前提與 repo 衝突，等 Q-P7 回覆；未 merge 的 `fix/methodology-review-rate` 見 U03 |
| T02 | SIGN | STALE | | 2026-10-02 核實社群安全頁每句屬實：分享卡（`components/DailyStatsCard.tsx:136`）及呼吸空間（`app/relax/components/RelaxLanding.tsx:121` → `/relax/group`）確有 IG 群組連結，YouTube（`SoloPlayer.tsx`）、GitHub（`GuardianCredits.tsx`）亦經 ExternalLinkGate。prompt「分享卡永遠唔放」與 Yuna 2026-09-21 決定衝突，見 Q-T02 |
| T03 | DIRECT | DONE | `70692a5` | 頁尾及關於頁經 ExternalLinkGate；本機 production build 390／768／1024／1920 四個闊度都見到、冇超出畫面；撳後出「你即將離開」提示，console 冇錯誤（CSP 無影響） |
| T38 | SIGN | TODO | | 依賴 T01（WAITING-FOUNDER） |
| T39 | SIGN | DONE | `c709fe6` | Q-T39：短句、講明可選；結果頁加可選登入掣；本機實測 |
| T04 | SIGN | DONE | `918880d` | Q-T04：等級範圍預設收埋，撳「睇粗糙估算（僅供參考）」先出；本機實測 |
| T05 | SIGN | STALE | | Q-T05：創辦人決定維持先出第一步 |
| T06 | SIGN | STALE | | 情緒 check-in 彈窗（`EmotionThermometer`）及解析下心情小卡已按創辦人 2026-10-02 決定刪除（憲章 §7.2.1，commit `169e1bf`、`b636838`） |
| T07 | SIGN | STALE | | 練習頁錯因三揀一已按創辦人 2026-10-02 決定刪除，答錯直接出解析（憲章 §7.2.1，commit `169e1bf`）；書寫題及答題紙保留 |
| T08 | DIRECT | DONE | `1a4c801` | 本機 production build 實測：由首頁撳數學，載入期間 `role="status"` 讀出「正在準備你嘅 10 條練習題…」 |
| T09 | DIRECT | DONE | `3796efa` | 首頁底部改為同頁頂一樣嘅四科快捷掣（`QuickStartGrid`）＋「揀其他科目」連結；本機 production build 375px 實測四掣 80×64、冇超出畫面 |
| T40 | SIGN | STALE | | 已有：`/subjects` 頂部「最近練過」科目掣（`app/subjects/SubjectsView.tsx:182`，UX loop 16）；首頁回頭學生有「上次練緊／上次未做完」卡（`components/ContinueCard.tsx`），一撳返去。首頁再加一行會重複並擠迫 375px 首屏 |
| T41 | SIGN | STALE | | 已有：`components/ShareStatsCardButton.tsx:55-69` 支援 files 就用 `navigator.share`，唔支援就下載 |
| T42 | SIGN | DONE | `74bf9f0` | 結果頁一行文字連結「追蹤 @dselevelup 睇更多溫書貼士」，經 ExternalLinkGate；本機 production build 做完一節實測顯示 |
| T10 | FOUNDER | DONE | `501ca48` | Q-T10：改「先做到呢度」 |
| T11 | FOUNDER | DONE | `b559469` | Q-T11：同類型再一題／難啲／易啲／換課題，一次性、只排次序；本機實測換課題同灰掣 |
| T12 | DIRECT | TODO | | |
| T13 | DIRECT | STALE | | 改進循環 2 R2-11d 已修正（commit `23cdb01`）。2026-10-02 本機 production build 390×844 實測 `/about` 捲到底：頁尾最後一行底部 y=738，底欄頂 y=787，冇被遮 |
| T14 | DIRECT | TODO | | |
| T15 | DIRECT | STALE | | 側欄係 `position: fixed`（`components/Sidebar.tsx:107`）。2026-10-02 本機 production build 1920×1080 實測 `/about` 捲到底（scrollY 2542）側欄仍佔 0–1080，未重現審計描述 |
| T16 | DIRECT | TODO | | |
| T17 | DIRECT | TODO | | |
| T18 | DIRECT | TODO | | |
| T55 | DIRECT | TODO | | 建議在 T18 之後 |
| T19 | FOUNDER | TODO | | |
| T20 | SIGN | TODO | | 須拆子任務 |
| T43 | SIGN | TODO | | |
| T44 | DIRECT | TODO | | |
| T45 | SIGN | TODO | | |
| T46 | DIRECT | TODO | | |
| T21 | DIRECT | TODO | | |
| T57 | FOUNDER | TODO | | 依賴 T21 |
| T22 | SIGN | TODO | | |
| T23 | SIGN | TODO | | |
| T56 | FOUNDER | TODO | | |
| T24 | SIGN | TODO | | |
| T25 | FOUNDER | TODO | | |
| T26 | FOUNDER | TODO | | |
| T58 | DIRECT | TODO | | |
| T59 | FOUNDER | TODO | | |
| T49 | FOUNDER | TODO | | |
| T50 | FOUNDER | TODO | | |
| T27 | DIRECT | TODO | | |
| T27b | DIRECT | TODO | | 依賴 T28 migration 已由創辦人 apply |
| T28 | SIGN | TODO | | 改進循環 2 R2-6 曾按當時 prompt 決定「報告不存資料庫」，見 Q-P9 |
| T29 | SIGN | TODO | | |
| T60 | FOUNDER | TODO | | |
| T30 | FOUNDER | TODO | | |
| T51 | FOUNDER | TODO | | |
| T52 | FOUNDER | TODO | | |
| T31 | DIRECT | TODO | | 快照顯示 production 已有 HSTS，預計 STALE；`preload` 見 Q-P5 |
| T32 | DIRECT | TODO | | 快照 grep 零結果，預計 STALE |
| T33 | FOUNDER | TODO | | |
| T34 | SIGN | TODO | | 快照顯示已實施（`proxy.ts`）；分散式限流（Vercel Firewall）屬 `docs/SECURITY-audit-2026-09-25.md` §2 第 3 項，T54 不另開項目 |
| T35 | DIRECT | TODO | | |
| T36 | DIRECT | DONE | `5e2534c` | 本機 production build 實測 `/.well-known/security.txt` 回 200 `text/plain`；測試會喺 Expires（2027-10-02）到期前提醒更新 |
| T37 | DIRECT | TODO | | |
| T53 | FOUNDER | TODO | | |
| T47 | DIRECT／SIGN | TODO | | |
| T48 | DIRECT | TODO | | |

## Wave 8 未完成工作（由 T54 填寫）

| ID | Gate | 狀態 | 出處 | 大細 | 備註 |
|---|---|---|---|---|---|
| U01 | DIRECT | TODO | branch `feat/homepage-copy-update`（`9b04c85`、`49aa8d0`，2026-08-13） | S | `GoodTodayCard.tsx`、`docs/TRIAGE-200-ideas-2026-08-09.md` 已在本 branch；只有 `scripts/qbank/_scan-clean.mts` 不在。預計 `SUPERSEDED`，待核實該 script 用途 |
| U02 | DIRECT | TODO | branch `claude/nostalgic-montalcini-a21f8f`（`20dbe3d`，2026-08-29）；`.claude/worktrees/` 兩個 detached worktree 指向同一 commit | S | 改動（m1 `binomial_theorem` → `binomial`）已在本 branch `data/questions/m1-bank.ts:23`。預計 `SUPERSEDED`；branch 及 worktree 只盤點，不刪 |
| U03 | FOUNDER | TODO | branch `fix/methodology-review-rate`（`952d00b`，2026-09-25） | S | 把 `/methodology` 實名審批比例改為即時計。審批紀錄已於 2026-09-25 刪除（`REVIEWED_COUNT` = 0），前提已不成立；與 T01／Q-P7 重疊 |
| U04 | FOUNDER | TODO | `docs/SECURITY-audit-2026-09-25.md` §2 第 1 項；`lib/auth/better-auth.ts:34` | M | 開密碼註冊前要有電郵驗證（需發信服務，觸及 §5 成本），或只開 Google |
| U05 | DIRECT | TODO | 同上 §2 第 4 項：`app/layout.tsx:166`、`app/subjects/[subject]/page.tsx:100`、`app/cantonese/page.tsx:99`、`app/cantonese/[sceneId]/page.tsx:85`、`app/cantonese/learn/page.tsx:66`、`components/Seo/ArticleJsonLd.tsx:57` | M | JSON-LD 以 `JSON.stringify` 直接放入 `<script>`，未轉義 `<`。6 個檔，超過 3 個檔，按憲章 §4 要先出影響報告 |
| U06 | FOUNDER | TODO | 同上 §2 第 6 項 | S | 2026-10-02 只讀核實仍然存在：`authenticated` 角色在 `review_decisions`、`user_settings` 有 SELECT，兩表 0 條 policy，所以 RLS 照樣擋住。`handle_updated_at` 未固定 `search_path`；`authenticated` 角色多餘 SELECT 權。要改 production schema |
| U07 | FOUNDER | TODO | 2026-10-02 只讀核實：production 無 `push_subscriptions` 表。同上 §2 第 7 項；`supabase/migrations/0012_push_subscriptions.sql`；`app/api/push/subscribe/route.ts` | S | production 未有 `push_subscriptions` 表；端點毋須登入可寫。決定上線（先加限流）或移除 |
| U08 | FOUNDER | TODO | 同上 §2 第 8 項 | S | 已刪的收款 QR 仍在 git 歷史；是否改寫歷史 |
| U09 | FOUNDER | TODO | `docs/ux-loop-progress.md:878` | S | `PRIVACY_MISMATCH`：私隱頁未提 Vercel 平台請求日誌（IP、user-agent） |
| U10 | DIRECT | TODO | `docs/ux-loop-progress.md:879`；`lib/privacy/userData.ts`；`supabase/migrations/0011_drop_wall.sql` | S | 刪除清單仍含 `wall_posts`、`wall_likes`，但 0011 已刪這兩張表。2026-10-02 只讀核實：production `public` 只有 8 張表，無 `wall_posts`、`wall_likes`；私隱頁「共 7 張表」的說法要再對一次。改文案屬 SIGN |
| U11 | FOUNDER | TODO | `docs/ux-loop-progress.md:804`；`CONTENT_PROVENANCE.md` §6 第 2 項 | S | `/writing`「取材自 2023 DSE 英文卷二」字眼，`DECISION_CONFLICT` |
| U12 | DIRECT | TODO | `docs/ux-loop-progress.md:828`、`:912`、`:913` | S | ⬜ 待驗證：已登入狀態的頂欄；React #418 只出現過一次 |
| U13 | FOUNDER | TODO | `docs/topic-remap-worklist.md`（2026-07-28） | L | 133 題課題歸邊及 3 組語義重疊（75 題）。部分可能已處理（例如 m1 `binomial`），要先重跑 `scripts/qbank/topic-coverage.mjs` 更新清單；改題庫屬 `NEED-HUMAN-REVIEW` |
| U14 | FOUNDER | TODO | `docs/content-debt-2026-09-16.md:66-72` | L | 7 科翻譯債全部 ⬜；改題庫屬 `NEED-HUMAN-REVIEW` |
| U15 | FOUNDER | TODO | `docs/PHASE1-privacy-consent-gate.md`、`docs/proposal-dropout-measurement-2026-09-16.md`、`docs/iso-loop-design-2026-11-09.md`、`docs/charter-amendment-2026-09-15-DRAFT.md`、`docs/charter-amendment-2026-09-26-family-stats-DRAFT.md` | M | 仍標「草稿／等 greenlight」的文件。按憲章 §18.2 須逐份決定；09-19、09-25、09-26-electives 三份草案已由憲章 §1 2.1、§12、§16.E 處理，不列入 |
| U16 | FOUNDER | TODO | `docs/weekly_mission.md:9-14`（2026-07-11） | S | 第 5 項（人文科 1,000 題預算）、第 6 項（升學導航數據）仍 ⬜；第 6 項或觸及 §8 已否決的 JUPAS 方向，要創辦人確認是否作廢 |

## Wave 9 技術債（由 T54 填寫）

| ID | Gate | 狀態 | 出處 | 大細 | 備註 |
|---|---|---|---|---|---|
| D01 | SIGN | DONE | `050021f` | `npm audit --omit=dev`（2026-10-02）：`next` 16.2.0–16.3.5 critical（GHSA-vcvr-r3jv-pc5j，`next/og` ImageResponse） | S | 創辦人 2026-10-02 於對話中批准（「批 D01」），見 FOUNDER-QUEUE Q-D01。`next` ^16.3.3 → ^16.3.8；lockfile 只改 `next`、`@next/env`、`@next/swc-*`。升級後 `npm audit --omit=dev` 0 個漏洞。驗收：npm test 1278/1278、tsc 0、qa 0、lint 0 error（35 warning，與升級前相同）、build 通過（第一次 build 在 `next/font` 下載 Google 字型時失敗，代碼不變重跑即通過，未能重現）；production build 實測 10 條 route 200、`/opengraph-image` 1200×630 PNG、練習頁作答一題正常、console 無 error |
| D02 | DIRECT | TODO | `npm run lint`：`app/account/AccountPageClient.tsx:4`、`app/exam-day/ExamDayClient.tsx:619`、`app/practice/PracticeSession.tsx:588`（hook 依賴）、`components/PrivacyConsentGate.tsx:31`、`lib/jyutping.ts:56`；4 處多餘 `eslint-disable`（`app/subjects/[subject]/page.tsx:99`、`app/cantonese/**` 三處） | S | `PracticeSession.tsx:588` 的 hook 依賴改動可能影響行為，要先確認或另拆 |
| D03 | DIRECT | TODO | `npm run lint`：`data/questions/` 7 個檔共 17 個未用變數警告（biology-bank2、chemistry-bank、chinese、design-tech-bank、health-management-bank、music-bank、visual-arts-bank） | S | 只是未用變數，不改題目內容；但按 §14.2 改題庫檔案一律 `CANNOT-COMPLETE`（`NEED-HUMAN-REVIEW`），預計照此標記 |
| D04 | DIRECT | TODO | `npm run lint`：`scripts/copy-guard.mjs:39`、`scripts/qbank/gen-long-drafts.mjs:45`、`scripts/qbank/sample-review.mjs:51`、`scripts/qbank/validate-banks.mjs:56` | S | |
| D05 | DIRECT | TODO | `npm run lint` 掃入 `.ds-sync/`（`.gitignore:49` 已忽略）及 `.design-sync/previews/`，共 6 個警告 | S | 在 eslint 設定加 ignore（不是新規則） |
| D06 | DIRECT | TODO | `app/practice/PracticeSession.tsx:711-716` | S | 註解仍描述已剷除的 server 簽名鎖；`const proceed = next` 只是別名。只改註解及別名，不碰 §7.2 實驗；`discovery-local-only` 測試要繼續通過 |
| D07 | DIRECT | TODO | `lib/__tests__/` 48 處 `any`（多為 `const mod: any = await import(…)`） | M | 只改測試；tsx CJS 載入方式要保留 |
| D08 | FOUNDER | TODO | `supabase/migrations/0018_recreate_user_sessions.sql`、`0018_revoke_anon_on_user_tables.sql` | S | 兩個 migration 同用 0018 編號。已套用的 migration 改名有風險，只記錄 |
| D09 | SIGN | TODO | `npm outdated`（2026-10-02）minor／patch：`@supabase/supabase-js` 2.117.2、`better-auth` 1.7.7、`lucide-react` 1.49.0、`pg` 8.23.1、`@types/*` | M | `next` 由 D01 處理 |
| D10 | FOUNDER | TODO | `npm outdated` major：`eslint` 10、`typescript` 7、`@types/node` 26、`react`／`react-dom` 19.3、`katex` 0.19、`@anthropic-ai/sdk` 0.131 | L | 只盤點 |
| D11 | DIRECT | TODO | `README.md:13`（Next 版本）、`README.md:23`（`middleware.ts`「靜靜忽略」） | S | 等 Q-P6、Q-P9 回覆 |
| D12 | DIRECT | TODO | `docs/weekly_mission.md`（最後更新 2026-07-11） | S | 過時計劃檔，第 1 項（經濟科 push）早已完成；未決項目見 U16 |
| D13 | SIGN | TODO | `npm audit`（含 dev，2026-10-02）：`brace-expansion` high | S | 只在開發依賴，不入 production bundle；與 D01 無關 |
| D14 | FOUNDER | TODO | production `curl -sI`（2026-10-02）：`/`、`/subjects`、`/llms.txt`、`/robots.txt`、`/opengraph-image` 及靜態檔回 `access-control-allow-origin: *` | S | repo 無設定此 header（`next.config.ts`、`proxy.ts`、`vercel.json`、`app`、`lib` 零命中）；本機 production build 不送出；需登入的 `/api/progress`（401）亦無。判斷為 Vercel CDN 對公開快取內容的預設。這些回應不帶 cookie 或個人資料，風險低。要改須在 Vercel 設定或 `next.config.ts` 覆寫，效果要部署後實測，先記錄 |
| D15 | DIRECT | TODO | 2026-10-02 本機 `npm run build` 共 9 次，有 2 次喺 `next/font` 下載 Google 字型時失敗（`TypeError: Cannot read properties of null (reading '1')`，`node_modules/next/dist/compiled/@next/font/dist/google/loader.js:122`），代碼不變重跑即過 | S | 如果 Vercel 部署時遇到會令部署失敗。要查係網絡定 Next 16.3.8 嘅問題；可考慮改用本地字型檔（唔加套件） |

## 備註

- 2026-10-02 創辦人決定（回覆「a」）：Vercel Web Analytics 用同源 script（commit `372d711`），唔裝 `@vercel/analytics` 套件，憲章 §1 第 5 點不變。

- 2026-10-02 創辦人決定：暫時未有錢買域名，繼續用 `dse-level-up-by-claude-code.vercel.app`。審計再提域名問題，引用本句，不再開新問題。
- 2026-10-02 創辦人決定（回覆「a」）：首頁及頁尾刪去「未經逐題人手覆核」半句，保留「經自動檢查」；憲章 §12.1 約束 1 已加修訂。T01 原前提（寫「有人手逐題覆核」）仍無紀錄支持，Q-P7 未答前不做。

- Supabase 只讀核對（2026-10-02，project `aegekxapxgcfdrkzisis`，只用 SELECT 查系統表，無寫入）：`public` 共 8 張表 —— `privacy_consents`、`profiles`、`question_bank_versions`、`questions`、`review_decisions`、`user_progress`、`user_sessions`、`user_settings`，全部開 RLS。`anon` 只在 `questions`、`question_bank_versions` 有 SELECT（policy `*_public_read`），其餘 6 張用戶資料表 `anon` 零權限，即未登入者讀不到任何學生資料。用戶資料表的 policy 只開放 `service_role`（伺服器）。審計「RLS 未核實、anon 可能讀到他人答案」不成立。
- T54 盤點範圍及零結果項目（2026-10-02）：`git stash list` 空；`app`、`components`、`lib`、`scripts` 無 `TODO`／`FIXME`／`HACK`／`XXX`／`WIP`（「未完成」命中全是 UI 字眼或題目內容）；無 `.skip`／`.todo` 測試；非測試代碼無 `@ts-ignore`、`@ts-expect-error`、`as any`；`lib/`、`components/` 無未被 import 的模組（掃描 script 經負向自測：臨時加入一個無人 import 的檔，能被找出）；題目抽選、等級預測、錯題 DNA、`lib/sync.ts`、題庫雲端載入均有測試。
- `BREAKING`：無。lint 0 error；T54 未改代碼，最近一次全套檢查在 `29e54f8`（npm test 1278/1278、tsc、qa、build 全過），之後只有文件 commit。本 iteration 未重跑 `npm test`、`tsc`、`build`。
- 不列入的已排期覆檢：憲章 §7.1 中途離開率（2026-10-09）、§7.2 反思鎖實驗（2026-11-09）。由創辦人進行，不屬 loop 任務。

- §8 拒絕項目照 prompt v5 全部記錄，不另開任務。
- 憲章與 prompt §3 有出入的地方，按 §1.2 第 5 條以憲章為準，已列入 FOUNDER-QUEUE（Q-P1–Q-P3）。

- 審計 #7（2026-10-04，貼上內容，對象為線上版）核對結果：
  - 已修：信任中心及 `/methodology`「出唔出街由人決定」與 §12.1 不符，改為照實描述（commit `7ad76b9`，trust-copy 測試擴至四頁）；`/security.txt` 404，加 308 轉址（commit `a25a743`）。
  - 待創辦人：頁尾「等級預測」（Q-A7-1，憲章 §13 原文）、報錯入庫（Q-A7-2）、公開退回清單（Q-A7-3）、CSP nonce（Q-A7-4）。
  - 已存在，不另開任務：每題覆核標籤（`components/QuestionProvenance.tsx`）、做完一節後的 IG／Threads 連結及登入提示（Q-T02、Q-T39）、私隱頁 Vercel Analytics 說明、科目頁「部分考核形式未於本站提供」（`app/subjects/SubjectsView.tsx:112`，逐科資料 ASSESSMENT_METADATA_DEFERRED）、情緒彈窗已刪（2026-10-02）。
  - 已有決定，不再開問題：域名（見上 2026-10-02）、答錯先出第一步（Q-T05）。
  - 與實況不符：「1024px 導航唔會變桌面欄、25 科變長列表」—— 2026-10-04 本機 dev 1024×768 實測 `/subjects` 有左側圖示欄及三欄科目卡。同一截圖見左下無障礙浮動掣疊住第一張卡的「開始 10 題」，屬 T12。
  - 安全核對：`/api/*` 回應無 `access-control-allow-origin: *`，只有 CDN 靜態頁有（公開內容、不帶 cookie，風險低，不改）；`NEXT_PUBLIC_*` 只有 Supabase URL、anon key、VAPID 公鑰及 auth URL，資料庫連線 `DATABASE_URL` 只在 `lib/auth/better-auth.ts`（`import 'server-only'`）；`auth.ts` 無自訂 redirect callback，用 Auth.js 預設同源限制；RLS 見上 2026-10-02 只讀核對。
  - 未做、未排期：390px 精簡導航、1920px 題目解析並排、免登入進度碼、人工金標 50 題、每週電郵摘要。屬設計或內容工作，待創辦人排優先次序。
  - 檢查：npm test 1252/1252、tsc 0、改動檔 lint 0 error；本機 dev 實測信任中心及方法論新字眼、`/security.txt` → 308 → `/.well-known/security.txt`，console 無錯誤。production build 通過（2026-10-04）。
- 2026-10-04 創辦人回覆審計 #7 四題（「A7-1 A、A7-2 A、A7-3 A、A7-4 B」）：
  - A7-1：憲章 §13 修訂，commit `1777234`。
  - A7-3：`/transparency` 最近退回紀錄，commit `fb42589`、`c8eca66`。
  - A7-4：CSP nonce，commit `b79cc36`。代價：全部 HTML 頁面由預先產生改為每次請求即時產生（build 只剩 icon、manifest、OG 圖及 sitemap 為靜態），CDN 不再快取頁面，每次開頁都用一次 Vercel 運算。部署後要留意 Vercel 用量及開頁速度。本機正式版實測 23 條路徑：每個可執行 script 帶當次 nonce、每次 nonce 不同；注入的 inline script 及 eval 被擋；練習、筆記、進度、透明度頁無 console 錯誤。Vercel Web Analytics 只在正式部署載入，本機測不到（同源 script，`'self'` 已容許），⬜ 待部署後驗證。
  - A7-2：與憲章 §16.E 約束 5 衝突，暫停，已再問創辦人（見 FOUNDER-QUEUE Q-A7-2）。
  - 另見：`components/DataPortability.tsx` 已有「導出／導入進度檔案」，審計建議的「免登入進度碼」部分已存在。
  - 檢查：npm test 1263/1263、tsc 0、lint 0 error（34 warnings）、qa 通過、production build 通過。
- 2026-10-04 A7-2 最終方案（創辦人回覆「a」）：報錯可直接送出，只存題號、類別、語言、時間（commit `752efad`）。私隱政策 bump 至 `2026-10-04.v1`，登入學生會再見同意書。本機正式版實測：無效資料 5 種全部 400；瀏覽器以模擬伺服器回覆測試「送出」成功及失敗兩條路，送出內容只有題號、類別、語言（即使描述框有字）；未向正式資料庫寫入任何資料。資料表要創辦人在 Supabase 建立，⬜ 待建立後在正式網站驗證。檢查：npm test 1269/1269、tsc 0、lint 0 error、qa 通過、build 通過。
- 2026-10-04 創辦人要求 Claude 建立 `question_reports`（Supabase project `aegekxapxgcfdrkzisis`，migration 名 `question_reports`）。建立前只讀確認表不存在；建立後只讀核對權限正確（見 FOUNDER-QUEUE Q-A7-2），未寫入任何資料行。Security advisor：新表只有 INFO「RLS enabled, no policy」（刻意，同其他 4 張用戶表）；另有一項舊有 WARN `public.handle_updated_at` search_path 未固定，非今次引入，未處理。
- 2026-10-04 創辦人決定：暫不推送 `audit-loop`、不合併入 `main`，維持原狀。`audit-loop` 比 `origin/main` 多 18 個 commit（本次記錄另加）。正式網站維持 PR #73 的版本。

