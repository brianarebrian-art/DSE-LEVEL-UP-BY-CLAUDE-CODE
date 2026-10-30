/** Founder OS 環境標記（唔依賴前端可偽造嘅值做授權）。 */

export type FounderDeployEnv = 'production' | 'preview' | 'development' | 'test'

export function getFounderDeployEnv(): FounderDeployEnv {
  if (process.env.NODE_ENV === 'test') return 'test'
  if (process.env.VERCEL_ENV === 'production') return 'production'
  if (process.env.VERCEL_ENV === 'preview') return 'preview'
  if (process.env.NODE_ENV === 'production') return 'production'
  return 'development'
}

export function founderEnvLabel(env: FounderDeployEnv): string {
  switch (env) {
    case 'production':
      return '正式'
    case 'preview':
      return '預覽'
    case 'test':
      return '測試'
    default:
      return '本機'
  }
}

/** Demo fixtures 只准非正式環境，且需明確旗標。正式環境永不自動回退。 */
export function founderDemoFixturesAllowed(): boolean {
  if (getFounderDeployEnv() === 'production') return false
  return process.env.FOUNDER_DEMO_FIXTURES === '1'
}

/** Founder AI：只睇伺服器 env；Secret 永不回傳前端。 */
export function founderAiConfigured(): boolean {
  return Boolean(process.env.FOUNDER_AI_API_KEY?.trim() && process.env.FOUNDER_AI_BASE_URL?.trim())
}

export function founderCacheHeaders(): HeadersInit {
  return {
    'Cache-Control': 'private, no-store, max-age=0, must-revalidate',
    Pragma: 'no-cache',
  }
}
