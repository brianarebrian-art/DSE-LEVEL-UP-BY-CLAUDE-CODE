import 'server-only'
import { getServiceSupabase } from '@/utils/supabase/server'
import {
  resolveBusinessUserId,
  type IdentityMappingStore,
  type MappingProvider,
} from '@/lib/auth/identityMappingCore'

/**
 * Persist a mapping only from a verified Better Auth session/user id and, when
 * present, its authenticated Google account `accountId` (Google `sub`). No email
 * address is accepted or considered. The migration must be applied before this
 * backend can be enabled; lookup/write failures are allowed to fail closed.
 */
export async function resolveMappedBusinessUserId(
  betterAuthUserId: string,
  googleSubject: string | null,
): Promise<string | null> {
  const supabase = getServiceSupabase()
  const store: IdentityMappingStore = {
    async find(provider: MappingProvider, subject: string) {
      const { data, error } = await supabase.from('auth_identity_mappings')
        .select('user_id').eq('provider', provider).eq('provider_subject', subject).maybeSingle()
      if (error) throw error
      return (data as { user_id?: string } | null)?.user_id ?? null
    },
    async insertIfAbsent(mapping) {
      const { error } = await supabase.from('auth_identity_mappings').upsert(
        {
          provider: mapping.provider,
          provider_subject: mapping.subject,
          user_id: mapping.userId,
          mapping_method: mapping.method,
        },
        { onConflict: 'provider,provider_subject', ignoreDuplicates: true },
      )
      if (error) throw error
    },
  }
  return resolveBusinessUserId({ betterAuthUserId, googleSubject }, store)
}
