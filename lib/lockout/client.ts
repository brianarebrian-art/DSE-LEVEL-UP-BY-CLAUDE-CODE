'use client'

// Client side of the optional server-validated lockout. FAIL-OPEN by design: if the
// feature is off, the network is down, or the server errors, a student is NEVER wrongly
// trapped — we fall straight back to the client countdown. Enable with BOTH:
//   NEXT_PUBLIC_LOCKOUT_SERVER=true  (client flag, build-time)
//   LOCKOUT_SECRET=<random secret>   (server, runtime)
const ENABLED = process.env.NEXT_PUBLIC_LOCKOUT_SERVER === 'true'

// Ask the server to start a signed lockout for this question. Returns null (→ client
// timer only) when disabled or on any failure.
export async function startServerLockout(
  questionId: string,
): Promise<{ token: string; expiresAt: number } | null> {
  if (!ENABLED) return null
  try {
    const res = await fetch('/api/lockout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'start', questionId }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return data?.enabled && data.token
      ? { token: data.token as string, expiresAt: data.expiresAt as number }
      : null
  } catch {
    return null
  }
}

// Returns true = OK to unlock (INCLUDING every fail-open path). Returns false ONLY when
// the server is reachable AND explicitly says the lock has not expired yet (i.e. a
// genuine early-unlock / tamper attempt).
export async function verifyServerUnlock(token: string): Promise<boolean> {
  if (!ENABLED) return true
  try {
    const res = await fetch('/api/lockout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', token }),
    })
    if (!res.ok) return true
    const data = await res.json()
    if (data?.enabled === false) return true
    return Boolean(data?.unlocked)
  } catch {
    return true
  }
}
