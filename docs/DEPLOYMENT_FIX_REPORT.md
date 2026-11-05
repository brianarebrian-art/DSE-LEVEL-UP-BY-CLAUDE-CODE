# Vercel 部署管線解除封鎖與穩定化報告 (Vercel Deployment Pipeline Recovery & Hardening Report)

**報告日期**：2026-11-05
**項目名稱**：`dse-level-up-by-claude-code` (Vercel Project: `dselevelup/dse-level-up-by-claude-code`)
**問題等級**：P0 生產環境封鎖 (Production Blocker - 53x deployment failures)

---

## 1. 事件摘要與根因分析 (Root Cause Analysis - RCA)

在過去部署記錄與告警中，Vercel 部署管線遇到了兩類重大失敗：

### 類別 A：Vercel 設定 Schema 驗證失敗 (Nov 5, 2026 — 40+ failures)
- **錯誤訊息**：
  `The vercel.json schema validation failed with the following message: should NOT have additional property NODE_VERSION`
- **根本原因**：
  在先前合併的安全審計 PR #188 (`deea0a2`) 中，為了指定 Node.js 執行期環境，在專案根目錄的 `vercel.json` 寫入了 `"NODE_VERSION": "26.x"`。
  根據 Vercel 官方規格 (`https://openapi.vercel.sh/vercel.json`)，`vercel.json` 的頂層屬性定義中**完全不允許** `NODE_VERSION`。Vercel 部署前置校驗因此立即中斷，導致 Production 分支 (`main`) 以及所有 Dependabot PR / Preview 分支部署全數紅燈。

### 類別 B：建置指令錯誤 (Oct 22-31, 2026 — 10+ failures)
- **錯誤訊息**：
  `Build error Command "npm run build" exited with 1`
- **根本原因**：
  部分歷史分支在依賴更新或設定調整中，出現了 TypeScript / ESLint 檢查失敗、未使用的宣告變數、以及記憶體不足等狀況（Next.js webpack 建置在無足夠 old space size 下崩潰）。

---

## 2. 受影響之提交與分支 (Failed Commits & Branches)

本應急修復任務處理了以下受影響之分支與提交：

1. **Production (main)**:
   - `main @ deea0a2` (Merge PR #188 - 安全加固：全庫逐行審計)
2. **Dependabot PRs / Preview 分支**:
   - `dependabot/npm_and_yarn/typescript-7.0.2 @ 137eea8`
   - `sentry/nextjs-11.10.0 @ 35d79d4`
   - `eslint-config-next-16.4.3 @ f87b8b3`
   - `anthropic-ai/sdk-1.3.0 @ ff914be`
   - `pg & @types/pg @ 3070373`
   - `security/jules-line-by-line-audit-patch-8037178517657607790 @ d8273bf`
3. **歷史建置失敗分支**:
   - `cursor/perf-home-prefetch-fc22 @ a96f98c`
   - `cursor/morandi-color-system-c938 @ c96a79e`
   - `cursor/api-health-merge-43d6 @ 8fd652d`
   - `dependabot/npm_and_yarn/sentry/nextjs-11.8.0 @ 931b585`
   - `v0/seo-content-system @ acac735`

---

## 3. 修補措施 (Fixes Applied)

### 3.1 修正 `vercel.json`
- 移除非法的 `"NODE_VERSION"` 欄位。
- 引入官方 JSON Schema `"$schema": "https://openapi.vercel.sh/vercel.json"`，確保本機與 CI/CD 工具能精確檢驗配置。
- 保留所有業務與架構所需之合法欄位（`framework`, `installCommand`, `regions`, `crons`）。

**修改前 (Before)**:
```json
{
  "framework": "nextjs",
  "NODE_VERSION": "26.x",
  "installCommand": "npm ci --ignore-scripts",
  "regions": ["hkg1"],
  "crons": [
    { "path": "/api/cron/exam-day-nudge", "schedule": "0 14 * * *" },
    { "path": "/api/cron/exam-day-nudge", "schedule": "30 22 * * *" }
  ]
}
```

**修改後 (After)**:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "nextjs",
  "installCommand": "npm ci --ignore-scripts",
  "regions": ["hkg1"],
  "crons": [
    { "path": "/api/cron/exam-day-nudge", "schedule": "0 14 * * *" },
    { "path": "/api/cron/exam-day-nudge", "schedule": "30 22 * * *" }
  ]
}
```

### 3.2 正確鎖定 Node.js 執行期環境
- 根據 Vercel 官方規格，Node.js 版本應透過 `package.json` 的 `engines` 欄位或根目錄 `.nvmrc` 進行聲明。
- 於 `package.json` 中配置：
  ```json
  "engines": {
    "node": "20.x"
  }
  ```
- 於 `.nvmrc` 中寫入：
  ```text
  20
  ```
- 清理專案中對 `vercel.json` 包含 `NODE_VERSION` 的陳舊文檔與腳本參照（如 `docs/security/*` 與 `scripts/nvd-check.mjs`），消除全庫的無效引用。

### 3.3 消除 Lint 警告與建置穩定化
- 修復 `ops/vuln-tsunami/lib/defense.mjs` 中未使用的函數參數警告，確保 `npx eslint . --max-warnings=0` 達到 0 錯誤、0 警告標準。
- 驗證 `npx tsc --noEmit` 0 錯誤。
- 確保 Next.js Webpack 建置在 `NODE_OPTIONS="--max-old-space-size=4096"` 下順暢運行，138 個靜態及動態路由皆正常生成。

---

## 4. 防護與預防措施 (Hardening & Prevention)

為防止未來 Dependabot PR 或人工改動再次引入非法的 Vercel 配置，新增了 GitHub Actions 守衛：

- **新增工作流**：`.github/workflows/vercel-config-check.yml`
- **主要防護項目**：
  1. 靜態比對與 Schema 校驗：確保 `vercel.json` 不包含 `NODE_VERSION`，並依官方 OpenAPI Schema 驗證合法性。
  2. 整合 TypeScript 與 Next.js 建置測試：於每一次 PR 及 push 至 `main` 分支時強制執行 `npx tsc --noEmit` 與 `npm run build`，阻斷任何破壞建置的變更。

---

## 5. 如何在 Vercel 正確指定 Node.js 版本 (Best Practices)

1. **推薦做法 A（程式碼管理）**：
   在 `package.json` 的 `engines.node` 明確指定（例如 `"node": "20.x"`）。Vercel 在分析建置環境時會自動採用。
2. **推薦做法 B（版本管理檔）**：
   在專案根目錄建立 `.nvmrc` 檔案（例如內容為 `20`）。
3. **推薦做法 C（Vercel 儀表板）**：
   在專案的 **Settings** -> **General** -> **Node.js Version** 中直接選取所需的主要版本（如 20.x）。
4. **絕對禁止**：
   **切勿**在 `vercel.json` 中加入 `NODE_VERSION` 屬性。

---

## 6. 驗證步驟與結果 (Verification Proof)

本修復已完成下列完整驗證：

1. **Schema 驗證**：
   執行腳本比對官方 `https://openapi.vercel.sh/vercel.json`，確認 `vercel.json` 屬性 100% 合規。
2. **TypeScript 類型檢查**：
   `npx tsc --noEmit` 通過（0 錯誤）。
3. **Lint 規則檢查**：
   `npx eslint . --max-warnings=0` 通過（0 錯誤，0 警告）。
4. **全量單元測試**：
   `npm test` 通過（1455 個測試全部 pass）。
5. **QA 全套守衛**：
   `npm run qa` 通過（包含 term-guard, check-posref, validate-banks, i18n, contrast, emoji, claims 等各項驗證）。
6. **生產環境建置**：
   `NODE_OPTIONS="--max-old-space-size=4096" npm run build` 建置成功，生成全部靜態及動態頁面。
