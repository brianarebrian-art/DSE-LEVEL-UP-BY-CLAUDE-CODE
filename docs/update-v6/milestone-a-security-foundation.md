# Milestone A：保安地基（完成報告）

- **狀態：** Milestone A 完成，等待批准  
- **日期：** 2026-11-04（Asia/Hong_Kong）  
- **分支：** `cursor/v6-phase-5a-security-97aa`  
- **硬閘：** 未做 production migration、key rotation、遠端 RLS 變更（P0 未答）

---

## 1. 已完成項目

| 項目 | 做法 |
|---|---|
| Secret 防線 | `utils/supabase/server.ts` 加 `import 'server-only'` |
| Secret scan | `npm run secret:scan` + CI step |
| Dependency audit | CI `npm audit --omit=dev --audit-level=high`（moderate 如 Sentry glob／KaTeX 另排升級，唔 `--force`） |
| Admin／Reviewer 驗證 | 改用 `emailVerifiedFromAuthUser` + `requireVerifiedEmail: true` |
| 登出共用裝置 | `authSignOut`：嘗試同步 → 失敗則 confirm 放棄 → `wipeThisDevice` |
| 共用 IP 限流 | `apiRouteClass`／`limitForRouteClass`；sync／count 120，唔封禁 |
| Progress 註釋 | 去掉過時 Auth.js／Better Auth／Google sub 誤導 |
| typecheck script | `npm run typecheck` → `tsc --noEmit` |
| Runbook | 本目錄 backup／incident／secret／RLS 文件 |

## 2. 產出檔案

- 程式：`utils/supabase/server.ts`、`lib/auth/adminAllowlist.ts`、`lib/auth/reviewerAllowlist.ts`、`lib/auth/session.tsx`、`lib/sync.ts`、`lib/rateLimit.ts`、`proxy.ts`、`app/api/progress/route.ts`、`package.json`、`.github/workflows/ci.yml`、`scripts/secret-scan.mjs`、相關測試  
- 文件：  
  - `docs/update-v6/milestone-a-security-foundation.md`（本檔）  
  - `docs/update-v6/milestone-a-secret-remediation.md`  
  - `docs/update-v6/milestone-a-rls-readiness.md`  
  - `docs/update-v6/milestone-a-backup-incident-runbook.md`  

## 3. 驗證

本地應跑：

```bash
npm run secret:scan
npm audit --omit=dev --audit-level=high
npm run typecheck
npm test
npx eslint . --max-warnings=0
npm run build
```

## 4. 風險／未做

- Edge 限流仍按 IP（無 Redis）；已登入 `user_id` 分桶留待有可靠 edge session 讀取時再加。  
- 登出 `confirm` 係瀏覽器原生對話；完整三鍵 UI 可後續打磨。  
- `wipeThisDevice` 會清題庫 IDB——共用裝置安全優先；可後續改「保留 qbank」。  
- Production RLS 對帳、PITR drill、key rotation：**明確未做**。  

## 5. Rollback

還原本分支 commit；無限流 schema。CI 新增 step 回滾即移除。

## 6. 下一 Milestone

等批准後先做 **Milestone B（法律／私隱／共融基線）**，或你指定其他。

**Milestone A 完成，等待批准。**
