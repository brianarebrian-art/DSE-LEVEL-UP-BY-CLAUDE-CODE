export type MappingProvider = 'better_auth_user' | 'google'
export type MappingMethod = 'better_auth_user_id' | 'verified_google_subject'

export interface IdentityMapping {
  provider: MappingProvider
  subject: string
  userId: string
  method: MappingMethod
}

export interface IdentityMappingStore {
  find(provider: MappingProvider, subject: string): Promise<string | null>
  insertIfAbsent(mapping: IdentityMapping): Promise<void>
}

export interface AuthenticatedIdentityInput {
  betterAuthUserId: string
  /** Google `sub` from Better Auth's authenticated account record; never an email. */
  googleSubject: string | null
}

/**
 * Resolve verified identities to one stable business user_id. Existing mappings
 * win; a first Google identity keeps the legacy Google-sub key. A user who first
 * had a Better Auth id keeps that business id when Google is explicitly linked.
 * Conflicting mappings return null and are never merged or guessed.
 */
export async function resolveBusinessUserId(
  input: AuthenticatedIdentityInput,
  store: IdentityMappingStore,
): Promise<string | null> {
  const betterAuthUserId = input.betterAuthUserId
  const googleSubject = input.googleSubject
  if (!validSubject(betterAuthUserId)) return null
  if (googleSubject !== null && !validSubject(googleSubject)) return null

  const betterAuthMapped = await store.find('better_auth_user', betterAuthUserId)
  const googleMapped = googleSubject ? await store.find('google', googleSubject) : null
  if (betterAuthMapped && googleMapped && betterAuthMapped !== googleMapped) return null

  const businessUserId = betterAuthMapped ?? googleMapped ?? googleSubject ?? betterAuthUserId
  const betterAuthIdentity: IdentityMapping = {
    provider: 'better_auth_user', subject: betterAuthUserId, userId: businessUserId, method: 'better_auth_user_id',
  }
  if (!betterAuthMapped) await store.insertIfAbsent(betterAuthIdentity)
  if (googleSubject && !googleMapped) {
    await store.insertIfAbsent({
      provider: 'google', subject: googleSubject, userId: businessUserId, method: 'verified_google_subject',
    })
  }

  const confirmedBetterAuth = await store.find('better_auth_user', betterAuthUserId)
  const confirmedGoogle = googleSubject ? await store.find('google', googleSubject) : null
  if (confirmedBetterAuth !== businessUserId) return null
  if (googleSubject && confirmedGoogle !== businessUserId) return null
  return businessUserId
}

function validSubject(value: string): boolean {
  return typeof value === 'string' && value.length > 0 && value.length <= 512
}
