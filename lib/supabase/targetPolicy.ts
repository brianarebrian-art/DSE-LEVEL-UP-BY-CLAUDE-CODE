export const PRODUCTION_SUPABASE_PROJECT_REF = 'aegekxapxgcfdrkzisis'
const PROJECT_REF = /^[a-z0-9]{20}$/

export type DeploymentTarget = 'production' | 'preview' | 'development' | 'unknown'

export function deploymentTarget(value: string | undefined): DeploymentTarget {
  return value === 'production' || value === 'preview' || value === 'development' ? value : 'unknown'
}

export function parseSupabaseApiProjectRef(rawUrl: string | undefined): string | null {
  if (!rawUrl) return null
  try {
    const url = new URL(rawUrl)
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null
    const match = /^([a-z0-9]{20})\.supabase\.co$/i.exec(url.hostname)
    return match?.[1]?.toLowerCase() ?? null
  } catch {
    return null
  }
}

export function parseSupabaseDatabaseProjectRef(rawUrl: string | undefined): string | null {
  if (!rawUrl) return null
  try {
    const url = new URL(rawUrl)
    if (url.protocol !== 'postgres:' && url.protocol !== 'postgresql:') return null
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '::1') {
      return 'local'
    }
    const direct = /^db\.([a-z0-9]{20})\.supabase\.co$/i.exec(url.hostname)
    if (direct) return direct[1].toLowerCase()
    const pooler = /^[a-z0-9-]+\.pooler\.supabase\.com$/i.test(url.hostname)
    const username = decodeURIComponent(url.username)
    const pooledRef = /^postgres\.([a-z0-9]{20})$/i.exec(username)
    return pooler && pooledRef ? pooledRef[1].toLowerCase() : null
  } catch {
    return null
  }
}

function validConfiguredRef(value: string | undefined, target: DeploymentTarget): string | null {
  if (target === 'production') return PRODUCTION_SUPABASE_PROJECT_REF
  if (target !== 'preview' && target !== 'development') return null
  if (!value) return null
  const normalized = value.toLowerCase()
  if (target === 'development' && normalized === 'local') return 'local'
  if (!PROJECT_REF.test(normalized) || normalized === PRODUCTION_SUPABASE_PROJECT_REF) return null
  return normalized
}

function isAllowedRef(candidate: string | null, target: DeploymentTarget, configuredRef?: string): boolean {
  const expected = validConfiguredRef(configuredRef, target)
  return !!candidate && !!expected && candidate === expected
}

export function isAllowedSupabaseApiTarget(
  rawUrl: string | undefined,
  target: DeploymentTarget,
  configuredRef?: string,
): boolean {
  return isAllowedRef(parseSupabaseApiProjectRef(rawUrl), target, configuredRef)
}

export function isAllowedSupabaseDatabaseTarget(
  rawUrl: string | undefined,
  target: DeploymentTarget,
  configuredRef?: string,
): boolean {
  const candidate = parseSupabaseDatabaseProjectRef(rawUrl)
  if (candidate === 'local') return target === 'development' && configuredRef?.toLowerCase() === 'local'
  return isAllowedRef(candidate, target, configuredRef)
}
