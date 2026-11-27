/**
 * 用戶研究已併入主站，但 Brian 未核准上正式網站。
 * `VERCEL_ENV=production` 必須 404。
 * 沒有 `VERCEL_ENV` 而 `NODE_ENV=production` 時同樣 404，避免本機 production 露出。
 * `VERCEL_ENV=preview` 即使 `NODE_ENV=production` 也不 404。
 * 預覽網址不可指去 dselevelup.com 或 www.dselevelup.com。
 */
export function isResearchRouteHidden(env?: {
  VERCEL_ENV?: string
  NODE_ENV?: string
}): boolean {
  const vercelEnv = env ? env.VERCEL_ENV : process.env.VERCEL_ENV
  const nodeEnv = env ? env.NODE_ENV : process.env.NODE_ENV
  return vercelEnv === 'production' || (vercelEnv == null && nodeEnv === 'production')
}
