# UX 改善循環紀錄

**來源：** 2026-09-30 Yuna 貼上的「Claude Code Loop Prompt：DSE Level Up 持續 UX／產品／增長改善循環」，要求由 LOOP 1 開始持續迭代。
**分支：** `feat/ux-loop`（由 `origin/main` 的 `feda328` 開出，已包含信任中心同步數目及 `/practice` 題數標示的修正）。
**憲章 §4：** 該 prompt 列明每輪一個小 slice 及其次序，視作創辦人對所列 slice 的批准。每輪動手前，先在本檔寫明影響範圍；超出 prompt 所列範圍，或屬 prompt 第九節列明須由使用者決定的事項，一律停下。

---

## LOOP 1 — 2026-09-30

- **Slice：** 建立基線。
- **優先級：** 基線（先於 P0）。
- **基線結果：**
  - `npm test` 1089/1089 通過；`npm run qa` rc=0；`npx tsc --noEmit` rc=0；`npm run build` rc=0。
  - `npm run lint` 失敗：29 個 error，全部在 `ds-bundle/`（design-sync 生成的打包檔及 React 副本，已列入 `.gitignore`，CI 的全新 checkout 沒有這個目錄）。原始碼本身沒有 lint error。
- **改動：** `eslint.config.mjs` 忽略 `ds-bundle/**`，理由寫在設定檔內。之後 lint 為 0 error、35 warning。
- **測試：** lint rc=0。沒有新增測試：改動只影響本機生成檔是否被掃描。
- **QA：** 同上。
- **未完成：** 35 個 warning 維持原狀，不在本輪範圍。
- **新風險：** 無。忽略範圍只限生成目錄。
- **下一輪最高優先問題：** P0-A。新用戶由首頁到第一題要經「開始練習 → 科目列表 → 科目頁 → 立即開始」，首屏沒有直接開始 10 題的入口。
- **Commit：** 見 git log（`chore(lint): ignore the generated design-sync bundle`）。

## LOOP 2 — 2026-09-30

- **Slice：** 首頁首屏直接開始 10 題。
- **優先級：** P0-A。
- **影響範圍（動手前）：** `app/page.tsx`（Hero 按鈕區）、新增 `lib/quickStart.ts`、`lib/entitlements.ts`（新增 `sessionMinutes`）、科目頁改用同一函數、新增測試。不改練習流程、題庫、同步或其他頁。
- **改動：**
  - Hero 原本的「開始練習 → 科目列表」大按鈕，改為「揀一科，即刻開始 10 題」及四個核心科目（數學、英文、中文、公民），每格直接連到 `/practice?subject=…`（沿用 `lib/sessionResume.ts` 的 `practiceHref`，與「繼續」卡同一個 URL 規則）。
  - 下面一行寫明「約 15 分鐘 · 唔使登入 · 免費」，再加兩條文字連結：「揀其他科目（共 25 科）」及季節性副入口（放榜季仍是 `/waiting`、`/relax`）。
  - 預計時間由 `sessionMinutes()` 計，科目頁快速開始卡改用同一函數。
  - 為了令 360–1440 闊度的首屏都容得下：四格排成一行；桌面頂部留白、徽章及副標題下方間距各減一級；桌面吉祥物由 208px 闊縮至 176px。
  - `.claude/launch.json` 新增 `dse-level-up-prod`（`next start -p 3001`）。開發伺服器的 Tailwind 快取不會生成新 class（已知問題，見 `docs/dev-stale-css-root-cause-2026-09-16.md`），畫面驗證改用 production build。
- **只選四個核心科目的原因：** 每個 DSE 考生都修這四科；未知道學生選甚麼科之前，這是唯一不需猜測的選擇。其他 21 科仍在同一屏。
- **測試：** 新增 `lib/__tests__/home-quick-start.test.mts`（8 項）：四科都在用、連結是普通一節練習、沒有一科會先彈選修對話框、每科選擇題足夠一節、練習路徑不要求登入、時間只有一個來源、快速開始在信任標記之前、選修科會被捉到。變異測試：加入有選修的科目 → 2 項失敗；科目頁改回自行計 1.5 分鐘 → 1 項失敗。
- **驗證：** `npm test` 1097/1097；`npm run qa` rc=0；`npx tsc --noEmit` rc=0；`npm run lint` 0 error；`npm run build` rc=0。
- **畫面（production build，3001）：**
  - 375×812：四格 y=499–563，文字連結 y=595–639，全在底部浮動按鈕（y=692）之上，無水平捲動。
  - 360×800（英文）：標題一行，四格及兩條連結都在首屏；「Chinese」不截斷。
  - 390×844、430×932、768×1024、1024×768（連結底 757）、1280×800（連結底 795）、1440×900：首屏都見到四格及連結。
  - 由首頁撳「數學」到第一題四個選項出現：1.6 秒，一次點擊。以前要經科目列表、科目頁、「立即開始」。
  - 鍵盤：Tab 有可見焦點框（全站 2px outline）；每格 aria-label 為「數學：開始 10 題」，包含可見文字。
- **未完成／已知問題：**
  - 回訪學生（首屏多一張「繼續第 N 題」卡）在 375×812 時，四格仍在首屏，但兩條文字連結（y=701–745）被左下無障礙按鈕、「閱讀尺」及右下「情緒支援」按鈕遮住。這是浮動工具的問題，科目列表第一張卡的「開始練習」亦被遮住，列為下一輪。
  - 首頁倒數橫額、「2026 DSE 考生製作」字眼及頁尾守護者名單未改動：屬產品方向，待創辦人決定（見上一份 UX 審計核對）。
- **新風險：** `npx tsc --noEmit` 要 15 分鐘，因為 `tsconfig.json` 的 `**/*.ts` 把 `.claude/worktrees/` 兩份完整 repo 副本也計算在內（lint 早已排除 `.claude/**`）。
- **下一輪最高優先問題：** P0-5。手機底部三個浮動工具（無障礙、閱讀尺、情緒支援）會遮住首頁、科目列表及練習頁底部的按鈕。
- **Commit：** 見 git log（`feat(home): start ten questions from the first screen`）。
