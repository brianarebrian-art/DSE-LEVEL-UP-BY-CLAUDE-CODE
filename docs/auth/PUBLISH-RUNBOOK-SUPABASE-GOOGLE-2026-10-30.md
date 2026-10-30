# 發布 runbook：Supabase Auth Google（2026-10-30 批准發布）

## 已完成（agent）

| 步驟 | 狀態 |
|---|---|
| Apply `0030_supabase_google_auth_rebuild` 到 production DB `aegekxapxgcfdrkzisis` | ✅ |
| Apply `0031_revoke_handle_new_user_profile_execute` | ✅ |
| 核實：`profiles_legacy` 6 行、`user_progress` 236 行保留；新 `profiles` 空 | ✅ |
| Vercel：`NEXT_PUBLIC_SUPABASE_URL`／`ANON_KEY` 擴到 production+preview+development | ✅ |
| Production deploy from `cursor/supabase-google-auth-impl-fc22` | ⏳ 進行中（見 Vercel） |
| Merge PR #144 → `main` | ⏳ 創辦人／CI 綠後 |

## 必須人手（登入先至可用）

### A. Supabase Dashboard → Authentication

專案：https://supabase.com/dashboard/project/aegekxapxgcfdrkzisis

1. **Authentication → Providers → Google**：開啟  
   - Client ID／Secret：由 Vercel 現有 `AUTH_GOOGLE_ID`／`AUTH_GOOGLE_SECRET` 複製（或建**新** Google OAuth client 更易 rollback）
2. **Authentication → URL Configuration**  
   - Site URL：`https://www.dselevelup.com`  
   - Redirect URLs 加入：  
     - `https://www.dselevelup.com/auth/callback`  
     - `http://localhost:3001/auth/callback`

### B. Google Cloud Console → OAuth Web client

1. **Authorized JavaScript origins**  
   - `https://www.dselevelup.com`  
   - `http://localhost:3001`
2. **Authorized redirect URIs**（切換後**只**留 Supabase）：  
   - `https://aegekxapxgcfdrkzisis.supabase.co/auth/v1/callback`  
3. **退役**舊 Auth.js redirect：  
   - 刪 `https://www.dselevelup.com/api/auth/callback/google`  
   - 刪 `http://localhost:3001/api/auth/callback/google`（若有）

### C. Vercel env 退役（A／B 完成並 smoke 登入成功之後）

刪除（全部 environment）：

- `AUTH_GOOGLE_ID`
- `AUTH_GOOGLE_SECRET`
- `AUTH_SECRET`
- `AUTH_URL`
- 任何 `BETTER_AUTH_*`／`NEXT_PUBLIC_AUTH_BACKEND`／`DATABASE_URL`（若只為 BA）

保留：

- `NEXT_PUBLIC_AUTH_ENABLED=true`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAILS`／`REVIEWER_EMAILS`

> MCP 無 env delete；請喺 Vercel Dashboard → Project → Settings → Environment Variables 手動刪。

### D. Smoke（www）

1. 未登入做 1 題 → refresh → 進度消失（C1）
2. Google 登入 → 到 `/dashboard` → `profiles` 有一行
3. 舊 Google 帳戶：`auth_identity_map`／`learning_progress` 有遷移跡象（best-effort）
4. 登出 → 再登入唔複製 profile

## Rollback（高風險，唔鼓勵）

保留 `profiles_legacy`／`user_progress`；要退回 Auth.js 需 redeploy 舊 commit + 恢復 Google redirect —— 預設唔做。
