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
