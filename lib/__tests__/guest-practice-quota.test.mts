// Guest free-session gate (Fluid Active CPU / charter §3.1).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const Q = await import('../guestPracticeQuota.ts')
const {
  GUEST_FREE_SESSION_KEY,
  GUEST_FREE_SESSION_QUESTIONS,
  mayStartGuestPractice,
  hasUsedGuestFreeSession,
  markGuestFreeSessionUsed,
  clearGuestFreeSessionUsed,
} = Q

test('free session length matches SESSION_SIZE', async () => {
  const { SESSION_SIZE } = await import('../entitlements.ts')
  assert.equal(GUEST_FREE_SESSION_QUESTIONS, SESSION_SIZE)
  assert.equal(GUEST_FREE_SESSION_QUESTIONS, 10)
})

test('mayStartGuestPractice: signed-in always allowed; unsigned blocked after flag', () => {
  assert.equal(mayStartGuestPractice({ authStatus: 'authenticated', authUiEnabled: true }), true)
  assert.equal(mayStartGuestPractice({ authStatus: 'loading', authUiEnabled: true }), true)
  assert.equal(mayStartGuestPractice({ authStatus: 'unauthenticated', authUiEnabled: false }), true)
})

test('mark / clear round-trip uses only the boolean localStorage key', () => {
  const store = new Map<string, string>()
  const fake = {
    localStorage: {
      getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
      setItem: (k: string, v: string) => {
        store.set(k, v)
      },
      removeItem: (k: string) => {
        store.delete(k)
      },
    },
  }
  const desc = Object.getOwnPropertyDescriptor(globalThis, 'window')
  Object.defineProperty(globalThis, 'window', { value: fake, configurable: true, writable: true })
  try {
    assert.equal(hasUsedGuestFreeSession(), false)
    assert.equal(mayStartGuestPractice({ authStatus: 'unauthenticated', authUiEnabled: true }), true)
    markGuestFreeSessionUsed()
    assert.equal(store.get(GUEST_FREE_SESSION_KEY), '1')
    assert.equal(hasUsedGuestFreeSession(), true)
    assert.equal(mayStartGuestPractice({ authStatus: 'unauthenticated', authUiEnabled: true }), false)
    clearGuestFreeSessionUsed()
    assert.equal(hasUsedGuestFreeSession(), false)
    assert.equal(mayStartGuestPractice({ authStatus: 'unauthenticated', authUiEnabled: true }), true)
  } finally {
    if (desc) Object.defineProperty(globalThis, 'window', desc)
    else Reflect.deleteProperty(globalThis, 'window')
  }
})

test('practice gate and APIs enforce the cost boundary', () => {
  const gate = readFileSync('app/practice/PracticeGate.tsx', 'utf8')
  assert.match(gate, /GuestSessionGate/)
  assert.match(gate, /mayStartGuestPractice/)
  assert.match(gate, /guestBlocked/)

  const session = readFileSync('app/practice/PracticeSession.tsx', 'utf8')
  assert.match(session, /markGuestFreeSessionUsed/)
  assert.match(session, /authStatus !== 'authenticated'/)
  assert.match(session, /authStatus !== 'authenticated'\) return/)

  const countRoute = readFileSync('app/api/practice-count/route.ts', 'utf8')
  assert.match(countRoute, /getSyncUserId/)
  assert.match(countRoute, /sign_in_required|counted: false/)

  const verify = readFileSync('app/api/result/verify/route.ts', 'utf8')
  assert.match(verify, /getSyncUserId/)
  assert.match(verify, /status: 401/)
  // Auth check must run before loading the bank (Fluid CPU).
  const authAt = verify.indexOf('getSyncUserId')
  const loadAt = verify.indexOf('loadRegradeMCQuestions')
  assert.ok(authAt >= 0 && loadAt > authAt, 'auth before bank load')

  const result = readFileSync('app/result/ResultPageClient.tsx', 'utf8')
  assert.match(result, /status !== 'authenticated'\) return/)
  assert.match(result, /guestMustSignIn/)
})

test('charter documents the 10-question guest policy and storage gap', () => {
  const charter = readFileSync('docs/charter.md', 'utf8')
  assert.match(charter, /未登入最多可答 \*\*10 題\*\*/)
  assert.match(charter, /不得上傳至資料庫或作為練習紀錄保留/)
  assert.match(charter, /目前程式的本機儲存尚未符合此政策/)
})
