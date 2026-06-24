import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// SERVER-ONLY Supabase client using the service-role key.
//
// ⚠️ NEVER import this from a client component. The service-role key bypasses Row
// Level Security and must never reach the browser. It is read from process.env at
// REQUEST time (not build time) and only inside server route handlers.
//
// Singleton: created once per server process so we don't open a fresh connection
// pool on every request (防線 C).
let client: SupabaseClient | null = null

export function getServiceSupabase(): SupabaseClient {
  if (client) return client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error(
      'Supabase env missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local (server-only; never commit the service key).',
    )
  }
  client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return client
}
