# 移除驗收清單（舊 Google／Auth.js／Better Auth）

配合 `docs/auth/SUPABASE-GOOGLE-REBUILD-DESIGN.md`、`docs/auth/PUBLISH-RUNBOOK-SUPABASE-GOOGLE-2026-10-30.md`。  
**狀態：** 批准發布進行中 — DB／部分 Vercel 已做；Google Console＋Supabase Provider＋刪舊 env 要人手。

## 程式／依賴

- [x] 刪除 `auth.ts`
- [x] 刪除 `app/api/auth/[...nextauth]/`
- [x] 刪除／取代 `lib/auth/better-auth.ts`、`lib/auth/client.ts`（BA）
- [x] 重寫 `lib/auth/session.tsx` → Supabase session
- [x] `package.json` 移除 `next-auth`、`better-auth`（`pg` 保留畀 scripts）
- [x] 刪除 `components/DataPortability.tsx` 及所有引用
- [x] 刪除 `components/InAppBrowserNotice.tsx` 及所有引用
- [x] 停止 `lib/progress.ts` 對長期 `localStorage` 進度寫入
- [x] Migration `0030` apply production（2026-10-30）
- [x] `0031` revoke trigger function EXECUTE

## 環境變數（Vercel／.env.example）

- [x] `.env.example` 註明退役舊 Auth.js／BA keys
- [x] `NEXT_PUBLIC_SUPABASE_URL`／`ANON_KEY` 覆蓋 production+preview+development
- [ ] Vercel 刪除 `AUTH_GOOGLE_*`／`AUTH_SECRET`／`AUTH_URL` — **等 Google Provider smoke 過**

## Google Cloud Console

- [ ] Redirect **只**指向 `https://aegekxapxgcfdrkzisis.supabase.co/auth/v1/callback`
- [ ] 移除舊 `.../api/auth/callback/google`

## Supabase Auth

- [ ] Providers → Google 開啓＋Client ID／Secret
- [ ] URL config：Site URL + `/auth/callback` allowlist

## 文件

- [x] 刪除 `FLIP-TO-BETTER-AUTH.md`、舊 `G-AUTH-*`
- [x] 更新 `CONTRIBUTING.md`／`docs/charter.md`
- [x] 本 runbook：`PUBLISH-RUNBOOK-SUPABASE-GOOGLE-2026-10-30.md`
