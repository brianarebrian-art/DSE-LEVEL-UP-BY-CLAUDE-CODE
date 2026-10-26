export type AuthBackend = 'authjs' | 'better-auth'
export type AuthBackendSelection = { backend: AuthBackend; error: null } | { backend: null; error: 'invalid' | 'mismatch' }

function parse(value: string | undefined): AuthBackend | null {
  if (value === undefined || value === '') return 'authjs'
  if (value === 'authjs' || value === 'next-auth') return 'authjs'
  if (value === 'better-auth') return 'better-auth'
  return null
}

/** Both private server and public client flags must select the same single authority. */
export function resolveAuthBackend(serverValue?: string, clientValue?: string): AuthBackendSelection {
  const server = parse(serverValue)
  const client = parse(clientValue)
  if (!server || !client) return { backend: null, error: 'invalid' }
  if (server !== client) return { backend: null, error: 'mismatch' }
  return { backend: server, error: null }
}
