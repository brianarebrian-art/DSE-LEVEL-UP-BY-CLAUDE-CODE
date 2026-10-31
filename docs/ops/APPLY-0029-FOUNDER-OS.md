# 套用 Founder OS migration 0029（待創辦人批准）

**狀態（2026-10-31 Phase 0 核實）：生產資料庫尚未套用。**

證據：

- Supabase `list_migrations` 無 `founder_os`／對應 0029 記錄（最新已套用至 `supabase_google_auth_rebuild`／`revoke_handle_new_user_profile_execute`）
- `to_regclass('public.founder_audit_events')` → `null`（`founder_operational_tasks`、`founder_feature_flags` 同樣）

本地檔案：`supabase/migrations/0029_founder_os.sql`

## 做咩

建立創辦人營運表：審計、任務、AI jobs、事故、發佈批次、覆核個案、預算、整合狀態、功能開關、指令確認。  
**唔會**清空學生／題庫資料（檔頭已寫明）。

## 批准前唔好做

- 唔好喺未確認下 `apply_migration`／SQL Editor 執行
- 唔好改學生表或題庫表

## 建議步驟（批准後）

1. 創辦人回覆：「批准套用 0029」
2. 先喺 Supabase SQL Editor **預覽**檔案全文；確認無 DROP 學生／題庫表
3. 套用 `0029_founder_os.sql`（或以 CLI migration 對齊命名慣例）
4. 驗證：

```sql
select to_regclass('public.founder_audit_events') as audit,
       to_regclass('public.founder_operational_tasks') as ops,
       to_regclass('public.founder_feature_flags') as flags;
```

5. 用允許電郵登入 `/founder`：指揮中心唔應再出現「0029」紅色情報；`/founder/settings/audit` 唔應顯示「審計表未接駁」
6. 做一個無害動作（例如開 stats），確認 `founder_audit_events` 有新列

## 回滾

若需回滾：只 drop 0029 新建嘅 `founder_*` 表（見 migration 內表名清單）。**唔好**動 `user_progress`／`questions`／`practice_counts`。

## 相關

- `docs/founder-os.md`
- `docs/baseline-2026-10-31.md`
- `lib/founder/schemaProbe.ts`
