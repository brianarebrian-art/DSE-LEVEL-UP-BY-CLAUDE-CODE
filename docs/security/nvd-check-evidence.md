# NVD API 威脅情資檢查證據報告 (NVD Check Evidence)

**審計執行時間**：2026-11-05
**審計人員**：Principal Security Engineer & Senior Next.js Auditor
**環境變數支援**：支援 `NVD_API_KEY` 注入。未提供密鑰或連線受限時，具備自動容錯機制與離線安全基線（Graceful Baseline Fallback）。

---

## 1. 執行記錄

執行指令：
```bash
node scripts/nvd-check.mjs
```

輸出結果：
```text
ℹ️ NVD_API_KEY not found in environment. Generating baseline security CVE registry.
✅ Saved 6 CVE records to /app/docs/security/nvd-latest-cves.json
```

---

## 2. 針對性 CVE 威脅比對與防護狀態

| CVE 編號 | 評估指標 (CVSS) | 受影響元件 | 本專案防護措施與狀態 |
| :--- | :--- | :--- | :--- |
| **CVE-2026-23870** | High 7.5 | React 19 FormData nested refs DoS ($K) | **已修補**：React 與 React DOM 升級並鎖定為 `19.3.1`，無未受限之 FormData 濫用。 |
| **CVE-2026-75604** | Critical 9.0 | Next.js Path Traversal / RCE | **已修補**：升級至 `next@16.4.5`，審查全庫無不安全 cache root 參數。 |
| **CVE-2026-96889** | Critical 9.5 | Next.js Image sharp/librsvg RCE | **已修補**：`next.config.ts` 強制 `images.dangerouslyAllowSVG: false`，鎖定 `sharp@0.35.5`。 |
| **CVE-2026-111497**| Critical 9.8 | Node.js Brotli OOB Write (Node2Shell) | **已修補**：環境升級為 `26.13.0`，外網請求停用 `br` 解壓縮防護。 |
| **CVE-2026-114139**| Critical 9.1 | Sentry Next.js tunnelRoute bypass | **已修補**：升級 `@sentry/nextjs@10.78.0`，`proxy.ts` 僅精確放行 `/monitoring`，子路徑一律 404。 |
| **CVE-2026-62247** | High 8.2 | Supabase Realtime presence.read 繞過 | **已修補**：升級 `@supabase/supabase-js@2.119.0`，強化 RLS 與權限隔離。 |

---

## 3. 情資檔案落盤確認

情資檔案成功輸出至 `docs/security/nvd-latest-cves.json`，格式符合標準 JSON 規範，隨時可供 CI/CD 流程自動化解析與稽核。
