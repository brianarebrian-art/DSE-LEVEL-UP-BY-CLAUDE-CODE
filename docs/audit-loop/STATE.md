# Audit Loop State
最後更新：2026-10-02 · Iteration #1 · Branch: audit-loop

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
| T00 | DIRECT | DONE | （本 commit） | 見上方快照；FOUNDER-QUEUE Q-P1–Q-P10 |
| T54 | DIRECT | TODO | | 依賴 T00 |
| T01 | SIGN | TODO | | 前提與 repo 衝突，見 Q-P7 |
| T02 | SIGN | TODO | | |
| T03 | DIRECT | TODO | | |
| T38 | SIGN | TODO | | 依賴 T01 |
| T39 | SIGN | TODO | | |
| T04 | SIGN | TODO | | `/predictor` 另有未決的 DECISION_CONFLICT（`docs/ux-loop-progress.md` R2-1） |
| T05 | SIGN | TODO | | 反思鎖已於 2026-09-09 剷除（憲章 §7.2），見 Q-P2 |
| T06 | SIGN | TODO | | |
| T07 | SIGN | TODO | | 錯因自診是憲章 §7.2 實驗保留項，改動要確認不影響 2026-11-09 覆檢 |
| T08 | DIRECT | TODO | | |
| T09 | DIRECT | TODO | | |
| T40 | SIGN | TODO | | |
| T41 | SIGN | TODO | | |
| T42 | SIGN | TODO | | 依賴 T03 |
| T10 | FOUNDER | TODO | | |
| T11 | FOUNDER | TODO | | |
| T12 | DIRECT | TODO | | |
| T13 | DIRECT | TODO | | 改進循環 2 R2-11d 已修正（commit `23cdb01`），T13 iteration 時驗證後可標 STALE |
| T14 | DIRECT | TODO | | |
| T15 | DIRECT | TODO | | 快照未重現 |
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
| T34 | SIGN | TODO | | 快照顯示已實施（`proxy.ts`） |
| T35 | DIRECT | TODO | | |
| T36 | DIRECT | TODO | | |
| T37 | DIRECT | TODO | | |
| T53 | FOUNDER | TODO | | |
| T47 | DIRECT／SIGN | TODO | | |
| T48 | DIRECT | TODO | | |

## Wave 8 未完成工作（由 T54 填寫）

| ID | Gate | 狀態 | 出處 | 大細 | 備註 |
|---|---|---|---|---|---|

## Wave 9 技術債（由 T54 填寫）

| ID | Gate | 狀態 | 出處 | 大細 | 備註 |
|---|---|---|---|---|---|

## 備註

- §8 拒絕項目照 prompt v5 全部記錄，不另開任務。
- 憲章與 prompt §3 有出入的地方，按 §1.2 第 5 條以憲章為準，已列入 FOUNDER-QUEUE（Q-P1–Q-P3）。
