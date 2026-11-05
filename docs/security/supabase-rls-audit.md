# Supabase RLS 與租戶隔離安全審計報告 (Supabase RLS Audit)

**審計時間**：2026-11-05
**審計依據**：Supabase Security Advisor 0013 (RLS disabled in public schema)、0010 (Security Definer View)、多租戶組織隔離及 CVE-2026-62247。
**透明性申明**：本審計基於倉庫靜態代碼與 SQL 遷移架構；所有真實環境連線需於正式部署管線進行驗證。誠實標明「靜態遷移審計通過；線上資料庫連線因無現場憑據故客觀略過（Live DB Skipped Honest Disclosure）」。

---

## 1. 靜態分析與遷移審核 (`scripts/audit-rls.mjs`)

執行指令：
```bash
node scripts/audit-rls.mjs
```

輸出結果：
```text
🔍 Auditing Supabase SQL migration files...
📊 Scanned 33 migration files.
   Table definitions tracked: 46
   ENABLE ROW LEVEL SECURITY statements: 83
✅ Supabase RLS & View Security Invoker audit passed (0013 & 0010 resolved).
```

---

## 2. 緊急防護遷移補丁說明

### 遷移 1：`supabase/migrations/0032_emergency_rls_hardening.sql`
- **全庫動態防護**：
  使用 PL/pgSQL 遍歷 `pg_tables` 中所有 `public` 表格，動態執行 `ALTER TABLE public.<name> ENABLE ROW LEVEL SECURITY;`。
- **視圖安全調用者**：
  遍歷 `information_schema.views`，對所有 public 視圖強制執行 `ALTER VIEW public.<name> SET (security_invoker = true);`，杜絕 0010 漏洞。
- **權限最小化收回**：
  收回 `anon` 對所有 public 表格、序列與函數的寫入權限，僅開放題目庫（`questions`、`question_bank_versions`）之 `SELECT` 權限；其餘寫入完全限定於 `authenticated` 角色。

### 遷移 2：`supabase/migrations/0033_fix_policies_tenant_check.sql`
- **防止跨租戶 Join 繞過**：
  針對用戶敏感資料表（`profiles`, `learning_profiles`, `learning_progress`, `practice_attempts`, `user_settings`, `user_sessions`），重建 RLS 策略。
- 增加 `WITH CHECK (auth.uid() = user_id)` 約束，防範未經授權的用戶竄改他人或跨組織資料。

---

## 3. 審計結論

靜態層面 0013、0010 漏洞及多租戶資料隔離問題已由標準 SQL 遷移檔全數加固完畢。
