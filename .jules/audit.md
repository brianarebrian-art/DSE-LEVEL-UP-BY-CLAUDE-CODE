# Jules 每晚安全與品質審計清單 (Jules Nightly Audit Checklist)

本文件建立原因：Cursor Bugbot 使用額度已達上限（Usage limit reached），因此全庫程式碼審計、安全性掃描與架構防護檢查自 2026-11-05 起切換由 Jules 每晚執行。

---

## 1. 審計排程與觸發
- **週期：** 每晚例行執行（Nightly）或在重大功能合入 main 前手動調用。
- **工具鏈：** Jules Agent CLI / CI scripts。

---

## 2. 每晚審核檢驗項目 (Checklist)

### 2.1 部署管線與環境防護 (P0 Pipeline Guard)
- [ ] `vercel.json` 嚴格禁止 `NODE_VERSION` 屬性。
- [ ] `vercel.json` 必須通過官方 OpenAPI schema 校驗 (`https://openapi.vercel.sh/vercel.json`)。
- [ ] `package.json` 中的 `engines.node` 必須維持 `26.x`。
- [ ] `.nvmrc` 必須維持 `26.13.0`。
- [ ] GitHub Actions 工作流使用 `actions/setup-node@v7`。

### 2.2 資料安全性與 RLS 防護 (P1 Security & RLS)
- [ ] 檢查新建立的 Supabase 資料表是否皆已執行 `ENABLE ROW LEVEL SECURITY`。
- [ ] 檢查 `practice_attempts` 與 `learning_*` 表是否嚴格拒絕學生端 `DELETE`（僅 service_role 可在刪帳時操作）。
- [ ] 檢查 `consent_logs` 是否維持純 Append-only 模式（絕無 UPDATE，撤回同意必須 INSERT 新列帶 `withdrawn_at` 與 `previous_consent_id`）。
- [ ] 檢查 `handle_new_user_profile` 等 `SECURITY DEFINER` 函數是否已從 `PUBLIC`、`anon`、`authenticated` 撤銷 EXECUTE 權限。
- [ ] 執行專案金鑰掃描：`npm run secret:scan`，杜絕任何 service-role key 外洩至客戶端。

### 2.3 產品設計與資料遷移防護 (P1 Design Consistency)
- [ ] 年齡組別 (`age_band`) 家長通知邏輯是否覆蓋 16–18 歲（含 18 歲翌日 18yo + 1 day）。
- [ ] 舊錯因代碼 A/B/C 是否維持單一真相來源映射（A->concept, B->comprehension, C->calculation），無歧義映射。
- [ ] 間隔重複 (Spaced Repetition) 排程邏輯：Fail 與 Skip 皆排定至 +1 日，Pass 逐步推進至 +3/+7/+14/+30 日。
- [ ] 錯題自我診斷是否保持可跳過且無 30 秒強制鎖定。

### 2.4 SEO 與增長 (P2 Growth & SEO)
- [ ] `sitemap.xml` 包含之有效可索引網址數量維持 > 100。
- [ ] 題目頁包含完整 QAPage 與 FAQPage JSON-LD 結構化資料，關鍵字涵蓋 "DSE 2026"、"溫習支援" 與科目名稱。
- [ ] Instagram DM 報名 Webhook `/api/enroll/webhook` 運作正常，支援自動建立 review_items 與 Stripe Payment Link。

### 2.5 建置與程式碼品質閘門 (Build & QA Gates)
- [ ] `npm test`：所有單元測試 100% 通過。
- [ ] `npm run typecheck`：TypeScript 0 錯誤。
- [ ] `npm run qa`：憲章守衛（term, posref, banks, i18n, contrast, emoji, claims 等）全綠。
- [ ] `npm audit --omit=dev --audit-level=high`：生產環境無 high/critical 漏洞。
- [ ] `npm run build`：Next.js Webpack 生產建置成功生成所有靜態與動態路由。
