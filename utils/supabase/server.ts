import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { deploymentTarget, isAllowedSupabaseApiTarget } from '@/lib/supabase/targetPolicy'

// SERVER-ONLY client. Preview/development never fall back to production credentials.
let client: SupabaseClient | null = null

function selectedTargetConfig() {
  const target = deploymentTarget(process.env.VERCEL_ENV)
  if (target === 'production') {
    return {
      target,
      projectRef: undefined,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: process.env.SUPABASE_SERVICE_ROLE_KEY,
    }
  }
  if (target === 'preview') {
    return {
      target,
      projectRef: process.env.DSE_PREVIEW_SUPABASE_PROJECT_REF,
      url: process.env.DSE_PREVIEW_SUPABASE_URL,
      key: process.env.DSE_PREVIEW_SUPABASE_SERVICE_ROLE_KEY,
    }
  }
  if (target === 'development') {
    return {
      target,
      projectRef: process.env.DSE_DEVELOPMENT_SUPABASE_PROJECT_REF,
      url: process.env.DSE_DEVELOPMENT_SUPABASE_URL,
      key: process.env.DSE_DEVELOPMENT_SUPABASE_SERVICE_ROLE_KEY,
    }
  }
  return { target, projectRef: undefined, url: undefined, key: undefined }
}

export function getServiceSupabase(): SupabaseClient {
  const selected = selectedTargetConfig()
  if (!isAllowedSupabaseApiTarget(selected.url, selected.target, selected.projectRef)) {
    throw new Error('data-target-not-allowed')
  }
  if (!selected.key) throw new Error('data-target-not-configured')
  if (client) return client
  client = createClient(selected.url!, selected.key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return client
}
