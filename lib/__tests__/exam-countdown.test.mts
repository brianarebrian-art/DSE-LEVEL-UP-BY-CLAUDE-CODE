// Exam countdown is opt-in (UX loop 26; Yuna decision 5, 2026-09-30).
//
// The home page used to open with 「距 N 日 · 2027 DSE 開考」 for every visitor. It is now
// off by default; a student turns on 考期模式 in /account. The setting stays on this device.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const store = new Map<string, string>()
const events: string[] = []
;(globalThis as any).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => void store.set(k, String(v)),
  removeItem: (k: string) => void store.delete(k),
}
;(globalThis as any).window = { dispatchEvent: (e: Event) => { events.push(e.type); return true } }

const mod: any = await import('../examCountdown.ts')
const EC = mod.default?.isExamCountdownOn ? mod.default : mod

test('off by default, on only after the student turns it on, off again after turning off', () => {
  store.clear()
  assert.equal(EC.isExamCountdownOn(), false)
  assert.equal(EC.setExamCountdown(true), true)
  assert.equal(store.get('dse_exam_countdown'), '1')
  assert.equal(EC.setExamCountdown(false), false)
  assert.equal(store.has('dse_exam_countdown'), false)
  assert.deepEqual(events.slice(-2), ['dse-exam-countdown', 'dse-exam-countdown'])
})

test('blocked storage reads as off', () => {
  const saved = (globalThis as any).localStorage
  ;(globalThis as any).localStorage = { getItem: () => { throw new Error('blocked') } }
  assert.equal(EC.isExamCountdownOn(), false)
  ;(globalThis as any).localStorage = saved
})

test('the banner renders nothing while the setting is off', () => {
  const src = readFileSync('components/CountdownBanner.tsx', 'utf8')
  assert.match(src, /if \(!isExamCountdownOn\(\)\) return setDays\(null\)/)
  assert.match(src, /if \(days === null\) return null/)
  assert.match(src, /window\.addEventListener\(EXAM_COUNTDOWN_EVENT, read\)/)
})

test('the toggle lives in /account, is a 48px pressed-state button, and is listed in stored data', () => {
  assert.match(readFileSync('app/account/AccountPageClient.tsx', 'utf8'), /<ExamCountdownToggle \/>/)
  const t = readFileSync('components/ExamCountdownToggle.tsx', 'utf8')
  assert.match(t, /aria-pressed=\{on\}/)
  assert.match(t, /min-h-12/)
  assert.match(readFileSync('components/StoredDataInspector.tsx', 'utf8'), /dse_exam_countdown: \{ zh:/)
})

test('the setting never syncs: not a cloud key, so the trust count stays 14', () => {
  const inspector = readFileSync('components/StoredDataInspector.tsx', 'utf8')
  const cloud = inspector.slice(inspector.indexOf('export const CLOUD_PROGRESS_KEYS'), inspector.indexOf('export const CLOUD_KEYS'))
  assert.doesNotMatch(cloud, /dse_exam_countdown/)
  for (const f of ['lib/sync.ts', 'lib/settingsSync.ts']) assert.doesNotMatch(readFileSync(f, 'utf8'), /dse_exam_countdown/, f)
})
