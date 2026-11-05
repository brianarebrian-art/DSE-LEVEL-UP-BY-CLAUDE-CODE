# Cursor Bugbot 營運與用量上限指引

## 一、背景與現況

近期維運郵箱收到通知：「Bugbot couldn't run - usage limit reached」，代表 Cursor Bugbot 的每月分析配額已耗盡。

為確保開發流程與 CI/CD 管道順暢，特此確立 Bugbot 的定位與防護原則。

---

## 二、定位與 CI 策略

1. **非阻擋式工具（Optional / Non-blocking）**：
   - Bugbot 為外部輔助代碼審查工具，非核心把關依賴。
   - 核心質量與安全性由本地與 GitHub Actions CI 嚴格把關：
     - `npm run secret:scan`（密鑰防洩漏）
     - `npm audit --omit=dev --audit-level=high`（依賴安全性）
     - `npm test`（單元與整合測試）
     - `npm run typecheck`（TypeScript 靜態檢查）
     - `npm run qa`（術語、無障礙、i18n、題庫結構等 13 道閘門）
     - `npm run build`（Next.js 生產建置與靜態匯出驗證）

2. **CI 回退與獨立性**：
   - GitHub Actions 工作流程（`.github/workflows/ci.yml`）**不得**強依賴 Bugbot 回應。
   - 若 Bugbot 因用量上限（Usage limit reached）無法運行，PR 合併與發佈流程應依據 GitHub Actions CI 綠燈為準，不因此受阻。

---

## 三、用量控制與建議

1. **避免觸發過量檢查**：
   - 減少頻繁的小型 WIP commit 觸發外部分析。
   - 在本地確認 `npm run qa` 與 `npm test` 通過後，再推送分支。
2. **用量重置週期**：
   - Cursor Bugbot 配額按月結算與重置，配額耗盡期間以團隊人手審查及本地安全掃描為核心。
