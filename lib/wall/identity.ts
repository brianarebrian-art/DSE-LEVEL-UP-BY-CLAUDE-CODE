import 'server-only'
import { createHash } from 'node:crypto'
import { hkDayString } from '@/lib/hkTime'

// 匿名身份（spec §4.3）——「考生 #XXXX」。
//
// author_hash = sha256(user_id + 每日鹽值 + server 秘密) → 4 位數字。
//   • 每日鹽值（HKT 日界線 04:00）令同一用戶【跨日不可追蹤】：今日 #0427、聽日 #1839，
//     旁人無法把兩日嘅帖串埋一齊起底。
//   • server 秘密（WALL_SALT，缺省 fallback AUTH_SECRET）令外人即使知道 user_id 都
//     推唔返個 handle。秘密永不落 client。
//   • 發帖嗰刻算一次，存落 wall_posts.author_hash —— 所以一條舊帖永遠顯示佢當日嘅號碼，
//     唔會因為過咗日而變。同一用戶同一日發兩帖 → 同一號碼（正常）。
//
// 顯示層【只】見呢個號碼；user_id 淨係後端問責用，永不出街。

function serverSalt(): string {
  return process.env.WALL_SALT ?? process.env.AUTH_SECRET ?? 'shadow-study-room'
}

/** 「考生 #XXXX」——發帖當刻計，之後存落 row。 */
export function authorHandle(userId: string, now: number = Date.now()): string {
  const day = hkDayString(now)
  const digest = createHash('sha256').update(`${userId}:${day}:${serverSalt()}`).digest('hex')
  // 取 digest 頭 8 位 hex → 數字 → mod 10000 → 補零 4 位
  const n = parseInt(digest.slice(0, 8), 16) % 10000
  return `考生 #${String(n).padStart(4, '0')}`
}
