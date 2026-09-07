import 'server-only'
import { headers } from 'next/headers'
import { auth as nextAuth } from '@/auth'
import { betterAuthServer, betterAuthEnabled } from '@/lib/auth/better-auth'
import { safeLog } from '@/lib/safeLog'

// The stable per-user key for cloud progress (the `user_id` column of user_progress).
//
// DATA-COMPATIBILITY (directive: 保留現有用戶數據兼容性): existing rows were written by
// Auth.js keyed on the Google `sub`. Better Auth issues its own user ids, so after the
// cutover we look up the user's Google account and key on its `accountId` — which IS
// the same Google `sub` — so every existing user keeps their synced progress. Users who
// signed up with email/password (no Google account) key on the Better Auth user id.
//
// Until Better Auth is configured, this falls straight through to Auth.js → identical
// behaviour to today.
export async function getSyncUserId(): Promise<string | null> {
  if (betterAuthEnabled && betterAuthServer) {
    const hdrs = await headers()
    const session = await betterAuthServer.api.getSession({ headers: hdrs })
    if (!session?.user) return null

    // ⚠️ 呢度【唔准】喺解析失敗嗰陣回落 `session.user.id`。
    //
    // 原本嘅寫法係 try/catch 之後 `return session.user.id`。問題係：一個本來
    // 用 Google 登入、進度 keyed on `sub` 嘅學生，一旦 listUserAccounts 出事，
    // 就會攞到一個【全新嘅 key】—— 佢下次同步會開一行新嘅，而舊嗰行永遠
    // 搵唔返。169 個帳號（2026-09-07 實測）全部係咁 keyed。
    //
    // 而且呢種失敗【冇聲】：頁面照開、練習照做，只係進度由某一日開始變咗
    // 另一個人嘅。等有人察覺嗰陣已經冇得追。
    //
    // 所以三種情況分開處理：
    //   有 Google 帳號 ＋ 攞到 accountId  → 用 accountId（＝舊 sub，接得返）
    //   冇 Google 帳號                    → email/password 用戶，用 Better Auth id 係啱
    //   有 Google 帳號但攞唔到 accountId  → 【回 null】，唔賭
    // 回 null 嘅後果係「今次唔同步」，本機 localStorage 一個字都冇少；
    // 用錯 key 嘅後果係「雲端進度永久失聯」。兩者唔同級。
    try {
      const accounts = await betterAuthServer.api.listUserAccounts({ headers: hdrs })
      const list = Array.isArray(accounts) ? accounts : []
      const google = list.find(
        (a: { providerId?: string; provider?: string }) => (a.providerId ?? a.provider) === 'google',
      )
      if (!google) return session.user.id // 純 email/password 用戶
      const accountId = (google as { accountId?: string }).accountId
      if (accountId) return accountId
      safeLog('error', 'getSyncUserId: google account has no accountId', { userId: session.user.id })
      return null
    } catch (e) {
      safeLog('error', 'getSyncUserId: listUserAccounts failed — refusing to guess a key', e)
      return null
    }
  }

  const session = await nextAuth()
  return session?.user?.id ?? null
}
