# 移除驗收清單（舊 Google／Auth.js／Better Auth）

配合 `docs/auth/SUPABASE-GOOGLE-REBUILD-DESIGN.md`。  
**狀態：** 設計階段 · 項目尚未刪除 · 實作 PR 必須逐項打勾。

## 程式／依賴

- [ ] 刪除 `auth.ts`
- [ ] 刪除 `app/api/auth/[...nextauth]/`
- [ ] 刪除／取代 `lib/auth/better-auth.ts`、`lib/auth/client.ts`（BA）
- [ ] 重寫 `lib/auth/session.tsx` → Supabase session（或拆成新檔後刪舊檔）
- [ ] `package.json` 移除 `next-auth`、`better-auth`（及僅為 BA 嘅 `pg` 若適用）
- [ ] 刪除 `components/DataPortability.tsx` 及所有引用
- [ ] 刪除 `components/InAppBrowserNotice.tsx` 及所有引用
- [ ] 停止 `lib/progress.ts`／`lib/sync.ts` 對長期 `localStorage` 進度寫入（未登入改 memory-only）
- [ ] `rg "next-auth|better-auth|AUTH_GOOGLE|authSignInGoogle|DataPortability|InAppBrowserNotice"` → 零業務命中（測試／本清單除外）

## 環境變數（Vercel／.env.example）

- [ ] 移除或註明退役：`AUTH_GOOGLE_ID`、`AUTH_GOOGLE_SECRET`、`AUTH_SECRET`
- [ ] 移除：`NEXT_PUBLIC_AUTH_BACKEND`、`BETTER_AUTH_*`、`GOOGLE_CLIENT_ID/SECRET`（BA）、`DATABASE_URL`（若只為 BA）
- [ ] 保留：`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`、`SUPABASE_SERVICE_ROLE_KEY`

## Google Cloud Console

- [ ] 新（或改）redirect **只**指向 Supabase `.../auth/v1/callback`
- [ ] 移除舊 `.../api/auth/callback/google`

## 文件

- [ ] 歸檔或刪除 `FLIP-TO-BETTER-AUTH.md`
- [ ] 歸檔或刪除 `docs/auth/G-AUTH-*.md`（以本設計文為準）
- [ ] 更新 `CONTRIBUTING.md`／`README` 登入說明

## 驗收指令（實作後）

```bash
rg -n "next-auth|better-auth|AUTH_GOOGLE_SECRET|signInWithOAuth" --glob '!node_modules/**' --glob '!.git/**'
npm test && npx tsc --noEmit && npm run build
```
