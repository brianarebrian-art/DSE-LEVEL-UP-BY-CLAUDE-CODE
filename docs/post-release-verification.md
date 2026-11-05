# 發布後驗證

日期：2026-11-05（香港時間）。

這次沒有合併到 `main`，也沒有把生產站換成這次的程式。Phase 9 寫明要等創辦人批准。下面分開寫「這次分支在本機驗到的」和「生產站目前的底，不是這次發布的結果」。

## 本機

- 單元測試：`fsrs-scheduler`、`knowledge-trace`、`socratic-tutor`、`pooler-guard` 共 15 項通過。
- `POST /api/tutor/socratic` 在第三次答不上微分時，先備包含 `m2-algebra`，回應裡沒有正確選項原文，`revealsAnswer` 是 false。
- `POST /api/review/schedule` 回 200。新的 Good 評分間隔是 3 日，`persisted` 是 false，`database` 是 `unset`。
- 未設定 `CRON_SECRET` 時，`POST /api/revalidate` 回 503。
- 瀏覽器（`http://localhost:3001`，手機寬度 390）連續三次選未對上的選項之後，頁面出現代數、基礎、必修部分、相似題，以及講解圖。英文標題會換成 “When a step does not land, walk back two layers”。
- 進度頁在尚未做過練習的狀態有「Prerequisite trace」連結，點下去會到 `/review/trace`。
- 截圖：`docs/research/ui-references/trace-third-miss-mobile.png`。
- 開發伺服器的 HMR WebSocket 在用 `127.0.0.1` 開頁時會被 Next 擋住。用 `localhost:3001` 則客戶端腳本正常。這是開發伺服器的來源限制，不是這條功能的錯誤。

## Preview

- 部署 `dpl_869iLD6vdQRqSjZzm8PHJrrhYJma`（提交 `0e8c3fa`）狀態 READY，區域 `hkg1`。
- 網址：`https://dse-level-up-by-claude-code-git-cursor-fsrs-s-b62071-dselevelup.vercel.app/review/trace`
- 這個 Preview 有 Vercel SSO。打開之後連續三次點未對上的選項，頁面同時出現代數、相似題（x³）和 `/explainers/` 的圖。
- 主控台有兩類既有攔截：Vercel 工具列腳本被 CSP 擋下，以及 `/monitoring` 轉去 `vercel.com` 的連線被 `connect-src` 擋下。學生這條先備流程仍然完成。

## 生產站（尚未包含這次改動）

- Vercel 專案仍是 `dse-level-up-by-claude-code`。這次沒有讀 Analytics，所以不能報 P95。目標仍是 P95 低於 300 ms，見 `docs/PRD.md`。
- Supabase 在檢查當下連線 15 / 60，約 25%，低於 50%。這是檢查當下的底，不是這次發布之後的數字。
- Sentry 專案 `javascript-nextjs` 有一條未解決問題 `JAVASCRIPT-NEXTJS-6`：`/transparency` 上讀取 `M_ID`。堆疊在 `executors/200.js`，受影響用戶數是 0，最後見到的時間約為 2026-11-05 21:12（香港時間）。它在這次分支之前已經存在，而且堆疊不是本倉庫的頁面原始碼。沒有把它標成已解決。
- 沒有對 `https://www.dselevelup.com` 跑這次的先備流程，因為生產站還沒有這條路由。

## 未做

- 沒有把 `0035` 草稿套用到生產資料庫。
- 沒有改 Vercel 的 Postgres 環境變數。
- 沒有生成付費短片。
- 沒有建立第二個 Sentry 專案。
- Preview 已用臨時分享連結走完三次未對上。沒有把分享參數寫進倉庫。
