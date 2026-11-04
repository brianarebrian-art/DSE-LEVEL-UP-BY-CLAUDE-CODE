# Milestone A：RLS readiness（只讀對帳計劃，唔改 production）

- **狀態：** 文件完成；**未**對 production 跑 SQL、**未**改 policy  
- **日期：** 2026-11-04（Asia/Hong_Kong）  
- **硬閘：** P0 未答前禁止 ENABLE／DROP／ALTER policy 到 production；`0030` 是否已套用 **未驗證**  

對齊：`phase-4b-data-security-design.md` §1–2；SEC-P0／既有 SECURITY 審計。

---

## 1. 應用層現況（repo 已核）

| 路徑 | 授權模型 |
|---|---|
| 多數學生寫入 API | Server 用 `getServiceSupabase()`＋session `user_id` 過濾（service_role bypass RLS，**eq filter 即授權**） |
| Admin／Reviewer | `adminAllowlist`／`reviewerAllowlist`＋`emailVerifiedFromAuthUser`（Milestone A 要求 verified email） |
| 題庫公開讀 | Migration 設計：`questions`／versions anon `SELECT USING (true)`——刻意公開練習池 |
| `0030` 新表 | 設計為 `auth.uid()` own policies；**production 是否已 apply：未知** |

結論：而家學生資料主要靠 **server 再驗證**，唔好假設 production 已有完整 user-JWT RLS。

---

## 2. Repo migration 期望矩陣（摘要）

| 表／群組 | RLS | 預期 client | 備註 |
|---|---|---|---|
| `user_progress` 等舊 blob | ENABLE；多為零寬政策或只 service | 只經 service | 遷移前維持 |
| `questions`／`question_bank_versions` | ENABLE；anon SELECT true | 公開讀 | 唔當漏洞；內容靠 repo 過濾 hidden |
| `question_reports`／`session_feedback`／`practice_counts` | ENABLE；無學生寬政策 | service 寫 | |
| `founder_*`／audit | ENABLE；revoke | service／allowlist API | |
| `0030` profiles／learning_*／practice_attempts | own SELECT／INSERT（attempts 無 UPDATE） | 若套用：user JWT 可 | **未確認 prod** |
| `0025` push revoke | DRAFT | — | 另批先可 apply |

完整欄位設計見 Phase 4B；本檔唔重複 DDL。

---

## 3. 建議只讀對帳（創辦人／有權限者跑；agent 唔連 prod）

喺 **staging 先**，再考慮 prod 唯讀：

```sql
-- 列出 public 表 RLS 同政策（示意；以實際 scripts/metrics/rls-audit.sql 為準若存在）
SELECT c.relname AS table_name, c.relrowsecurity AS rls_on
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relkind = 'r'
ORDER BY 1;

SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

對帳清單：

1. 每一張用戶資料表：`relrowsecurity = true`。  
2. 無「學生表」對 `anon`／`authenticated` 嘅 `USING (true)` 寫入或跨用戶讀。  
3. `questions` 公開讀屬預期；記低。  
4. 比較 production 表集合 vs repo migrations（尤其 `0030`）。  
5. 結果貼返 `FOUNDER-QUEUE`／本目錄附錄——**唔**喺未批准時改 policy。

---

## 4. Remediation 順序（將來批准後）

1. Staging apply／對帳。  
2. PITR on＋restore drill（SEC-P0-002）。  
3. 只做 additive／收緊 revoke（例如 0025），一次一 PR。  
4. 新學習表：建議 user JWT＋own RLS；舊 blob 維持 service。  
5. 自動化：`test:rls`（需 staging 憑證）——Milestone A **未**加依賴。

**本 Milestone 明確不做：** production `ALTER POLICY`、`DROP POLICY`、寬政策 ENABLE、資料回填。

---

## 5. IDOR 回歸期望（測試設計，等 staging）

| Case | Expected |
|---|---|
| Student A JWT 讀 B 嘅 `practice_attempts` | 0 行 |
| 偽造 body `user_id=B` 打 progress POST（已登入 A） | 寫入 A 或 401／403；永不寫 B |
| Anon 直連 service 以外嘅用戶表 | 拒絕 |
| Anon SELECT questions | 允許（公開池） |

---

## 6. Rollback

未改 production → 無需 DB rollback。若將來誤 apply：用 PITR／上一 migration 反向（必須先有 drill）。

---

## 7. 驗收

- [x] 文件化現況同硬閘  
- [x] 對帳 SQL／清單供創辦人  
- [ ] Staging／prod 實跑結果（**未做**）  
- [ ] Policy 變更 PR（**未做**）
