import 'server-only'
import { headers } from 'next/headers'
import { auth as nextAuth } from '@/auth'
import { betterAuthServer, betterAuthEnabled } from '@/lib/auth/better-auth'

// Admin 身份 = 環境變數 ADMIN_EMAILS（逗號分隔）白名單。
//
// 點解用 env 而唔係寫死喺源碼（原 spec 做法）：repo 係公開嘅，把 admin Google
// 帳號寫入源碼等於公告「攻破呢兩個郵箱就攻破審核面板」—— 無謂送個靶俾人。
// env 未設定時白名單為空 → 冇任何人係 admin（安全預設，/admin 一律彈走）。
//
// 身份解析跟 lib/auth/server.ts 同一套 backend-agnostic 模式（Auth.js 今日，
// Better Auth 切換後不變）。

export interface AdminIdentity {
  email: string
  name: string
}

function allowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return allowlist().includes(email.toLowerCase())
}

async function getSessionIdentity(): Promise<AdminIdentity | null> {
  if (betterAuthEnabled && betterAuthServer) {
    const hdrs = await headers()
    const session = await betterAuthServer.api.getSession({ headers: hdrs })
    const user = session?.user
    if (!user?.email) return null
    return { email: user.email, name: user.name ?? user.email }
  }
  const session = await nextAuth()
  const user = session?.user
  if (!user?.email) return null
  return { email: user.email, name: user.name ?? user.email }
}

// 已登入且喺白名單 → 回傳身份；否則 null（caller 自行 redirect / 403）。
export async function requireAdmin(): Promise<AdminIdentity | null> {
  const identity = await getSessionIdentity()
  if (!identity || !isAdminEmail(identity.email)) return null
  return identity
}
