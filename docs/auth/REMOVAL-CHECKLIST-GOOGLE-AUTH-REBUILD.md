# 移除驗收清單（舊 Google／Auth.js／Better Auth）

配合 `docs/auth/SUPABASE-GOOGLE-REBUILD-DESIGN.md`。  
**狀態：** 階段 5 實作 PR — 程式項已打勾；**生產發布／Google Console 仍待「批准發布」**。

## 程式／依賴

- [x] 刪除 `auth.ts`
- [x] 刪除 `app/api/auth/[...nextauth]/`
- [x] 刪除／取代 `lib/auth/better-auth.ts`、`lib/auth/client.ts`（BA）
- [x] 重寫 `lib/auth/session.tsx` → Supabase session
- [x] `package.json` 移除 `next-auth`、`better-auth`（`pg` 保留畀 `scripts/db-slow-queries.mjs`）
- [x] 刪除 `components/DataPortability.tsx` 及所有引用
- [x] 刪除 `components/InAppBrowserNotice.tsx` 及所有引用（改 sign-in 純文案）
- [x] 停止 `lib/progress.ts` 對長期 `localStorage` 進度寫入（未登入 memory-only）
- [ ] `rg "next-auth|better-auth|AUTH_GOOGLE|authSignInGoogle|DataPortability|InAppBrowserNotice"` → 零業務命中（測試／本清單／歷史 docs 除外）— 實作後跑

## 環境變數（Vercel／.env.example）

- [x] `.env.example` 註明退役：`AUTH_GOOGLE_*`、`AUTH_SECRET`、BA 相關
- [x] 保留：`NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`、`SUPABASE_SERVICE_ROLE_KEY`
- [ ] Vercel production env 實際清走舊 key — **等批准發布**

## Google Cloud Console

- [ ] 新（或改）redirect **只**指向 Supabase `.../auth/v1/callback` — **等批准發布**
- [ ] 移除舊 `.../api/auth/callback/google` — **等批准發布**

## 文件

- [x] 刪除 `FLIP-TO-BETTER-AUTH.md`
- [x] 刪除 `docs/auth/G-AUTH-*.md`（以本設計文為準）
- [x] 更新 `CONTRIBUTING.md`／`docs/charter.md` 登入說明

## 驗收指令（實作後）

```bash
rg -n "next-auth|better-auth|AUTH_GOOGLE_SECRET|signInWithOAuth" --glob '!node_modules/**' --glob '!.git/**'
npm test && npx tsc --noEmit && npm run build
```
