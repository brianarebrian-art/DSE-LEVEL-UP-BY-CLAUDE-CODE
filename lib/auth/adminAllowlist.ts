import 'server-only'
import { headers } from 'next/headers'
import { auth as nextAuth } from '@/auth'
import { betterAuthServer, betterAuthEnabled } from '@/lib/auth/better-auth'
import { adminFromUser, parseAllowlist, type AdminIdentity } from '@/lib/auth/adminIdentity'

// Admin 身份 = 環境變數 ADMIN_EMAILS（逗號分隔）白名單。
//
// 點解用 env 而唔係寫死喺源碼（原 spec 做法）：repo 係公開嘅，把 admin Google
// 帳號寫入源碼等於公告「攻破呢兩個郵箱就攻破審核面板」—— 無謂送個靶俾人。
// env 未設定時白名單為空 → 冇任何人係 admin（安全預設，/admin 一律彈走）。
//
// 身份解析跟 lib/auth/server.ts 同一套 backend-agnostic 模式（Auth.js 今日，
// Better Auth 切換後不變）。判斷本身喺 lib/auth/adminIdentity.ts（純函數，有測試）。

export type { AdminIdentity }

// 已登入且喺白名單 → 回傳身份；否則 null（caller 自行 redirect / 403）。
export async function requireAdmin(): Promise<AdminIdentity | null> {
  const allowlist = parseAllowlist(process.env.ADMIN_EMAILS)
  if (betterAuthEnabled && betterAuthServer) {
    const session = await betterAuthServer.api.getSession({ headers: await headers() })
    // Better Auth 有電郵＋密碼註冊 —— 一定要驗證咗嘅電郵先算（見 adminIdentity.ts）。
    return adminFromUser(session?.user, allowlist, { requireVerifiedEmail: true })
  }
  const session = await nextAuth()
  return adminFromUser(session?.user, allowlist, { requireVerifiedEmail: false })
}
