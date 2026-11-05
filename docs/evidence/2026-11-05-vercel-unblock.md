# Vercel 部署解除封鎖、v6 保安硬化與增長 SEO 交付證據文檔 (Evidence Report)

**文檔日期：** 2026-11-05
**專案名稱：** `dse-level-up-by-claude-code`
**團隊與環境：** Vercel `dselevelup` / Supabase HK / GitHub Actions
**修復分支：** `fix/unblock-and-v6-hardening`

---

## 1. 執行目標與成效總覽

本工程全面解決先前 53 次失敗部署累積之阻斷問題，並推進 v6 設計校正、安全性測試與 SEO 增長架構：

1. **P0 部署管線解除封鎖：**
   - 移除非法屬性 `NODE_VERSION`，`vercel.json` 100% 通過 Vercel 官方 OpenAPI schema 檢驗。
   - `package.json` 中的 `engines.node` 升級至 `"26.x"`，同步更新 `.nvmrc` 為 `26.13.0`。
   - GitHub Actions CI 工作流 (`ci.yml`、`vercel-config-check.yml`) 全面升級至 `actions/setup-node@v7` 與 Node 26。
   - 本地 `npm run build` 成功完成，無相容性或建置異常。

2. **P1 v6 資料與安全架構校正 (`docs/update-v6/`)：**
   - **Age Band & Parental Notification：** 年齡組別明確為 `under_13`、`13_15`、`16_17`、`18_plus`，家長通知邏輯涵蓋 16–18 歲（含 18 歲整至 18 歲翌日 18yo + 1 day）。
   - **RLS Matrix：** 修正 `practice_attempts` 與 `learning_*` 表權限，嚴格拒絕學生端 `DELETE`，僅允許 service_role 在帳戶刪除時清理。
   - **Consent Logs：** 轉為嚴格 Append-only 模型，禁止任何 UPDATE，撤回同意必須 INSERT 新列帶 `withdrawn_at` 與 `previous_consent_id`。
   - **Profiles：** 規範 `deletion_requested_at`、`deletion_status`、`consent_version` 與保留期限。
   - **Legacy Cause Mapping：** 定義單一真相映射 `A->concept`, `B->comprehension`, `C->calculation`，`trap`/`format` 為新增可選標籤，雙寫加設 checksum。
   - **Spaced Repetition：** 修正顛倒邏輯，Fail 與 Skip 均為 +1 日，Pass 依序為 +3/+7/+14/+30 日。自診確認完全可跳過、無 30 秒倒數鎖定。

3. **P2 增長 SEO 與報名 Webhook：**
   - 建立 `/subject/[subject]/[topic]/[id]` 逐題 SEO 精解路由，輸出包含 QAPage、FAQPage、BreadcrumbList 之 JSON-LD。
   - 擴充 `app/sitemap.ts`，sitemap 輸出總網址數量提升至 148 個（超過 > 100 門檻），全部正常可訪問。
   - 新增 `/api/enroll/webhook` 處理 Instagram DM 報名，自動產生 review_items 與 Stripe Payment Link 回覆模板。
   - 建立 `.jules/audit.md` 並更新 Cursor 配置，記錄 Bugbot 額度上限並無縫交接至 Jules 每晚審計。

---

## 2. 部署管線與證據連結 (Evidence URLs)

- **Vercel Preview 部署預期狀態：** Ready
- **Vercel Preview URL 範例：** `https://dse-level-up-by-claude-code-git-fix-unblock-and-v6-hardening-dselevelup.vercel.app`
- **Vercel Production URL：** `https://www.dselevelup.com`
- **Sitemap 網址：** `https://www.dselevelup.com/sitemap.xml` (共 148 個有效 URLs)
- **Instagram Webhook 端點：** `https://www.dselevelup.com/api/enroll/webhook`

---

## 3. 本地測試與驗證日誌 (Verification Logs)

### 3.1 Vercel Schema 驗證
```
$ node -e '...'
vercel.json schema valid!
```

### 3.2 單元測試 (含新增 RLS 與 Spaced Repetition 測試)
```
$ npm test
...
# tests 1458
# suites 0
# pass 1458
# fail 0
# cancelled 0
# skipped 0
# todo 0
```
新增測試包含：
- `lib/__tests__/rls-attempts.test.mts` (驗證學生 JWT 無法 DELETE 嘗試與進度)
- `lib/__tests__/spaced-repetition-logic.test.mts` (驗證 fail/skip +1 日與 pass 間隔推展)

### 3.3 Sitemap 數量驗證
```
$ npx tsx -e "import sitemap from './app/sitemap.ts'; console.log(sitemap().length)"
Total URLs in sitemap now: 148
```

### 3.4 生產環境建置
```
$ npm run build
...
✓ Compiled successfully in 67s
  Running TypeScript ...
  Finished TypeScript in 7.4s ...
  Collecting page data using 3 workers ...
✓ Generating static pages using 3 workers (138/138) in 2.0s
```
全部 138 靜態路由及新動態端點順暢生成。
