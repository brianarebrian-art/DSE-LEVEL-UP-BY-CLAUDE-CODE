// Decisions from the external UX audit (docs/DECISIONS-ux-audit-2026-09-20.md).
// Options chosen by Yuna on 2026-09-21; carried out on 2026-09-26 under charter §18
// (no signatures needed). One test block per item, so an item cannot quietly revert.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (p: string) => readFileSync(p, 'utf8')

// ── A1 (b): keep the IG link on the share card, say the group is off-site ─────
test('A1: community safety says the Instagram group is not part of this site', () => {
  const card = read('app/result/ResultPageClient.tsx') + read('components/DailyStatsCard.tsx')
  const page = read('app/community-safety/CommunitySafetyClient.tsx')
  if (!/ig\.me\//.test(card)) return // link removed from the card: nothing to explain
  assert.ok(page.includes('IG 溫書群組唔屬於本站'), 'Chinese section missing')
  assert.ok(page.includes('The Instagram group is not part of this site'), 'English section missing')
})

// ── B4 (b): the practice clock is hidden by default for every user ──────────
function withStorage(init: Record<string, string>, fn: () => void) {
  const store = new Map(Object.entries(init))
  const prev = (globalThis as any).localStorage
  ;(globalThis as any).localStorage = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => void store.set(k, String(v)),
    removeItem: (k: string) => void store.delete(k),
  }
  try { fn() } finally { (globalThis as any).localStorage = prev }
}
const tp: any = await import('../timerPreference.ts')
const T = tp.default?.readTimerPref ? tp.default : tp

test('B4: no choice and the old default both mean hidden', () => {
  withStorage({}, () => assert.equal(T.readTimerPref(), 'default'))
  withStorage({ dse_hide_timer: '0' }, () => assert.equal(T.readTimerPref(), 'default'), )
})

test('B4: an explicit hide still hides; turning the clock on is remembered', () => {
  withStorage({ dse_hide_timer: '1' }, () => assert.equal(T.readTimerPref(), 'hide'))
  withStorage({}, () => {
    T.writeTimerHidden(false)
    assert.equal(T.readTimerPref(), 'show')
    T.writeTimerHidden(true)
    assert.equal(T.readTimerPref(), 'hide')
  })
})

test('B4: the practice page hides the running clock unless the student chose to show it', () => {
  const ps = read('app/practice/PracticeSession.tsx')
  assert.match(ps, /const showElapsed = timerPref === 'show'/)
  assert.match(ps, /\{showElapsed && \(\s*<span className="flex items-center gap-1">\s*<Clock/, 'elapsed clock must depend on showElapsed')
  // The per-question timer button stays available in the default state.
  assert.match(ps, /const hideTimer = timerPref === 'hide'/)
})
