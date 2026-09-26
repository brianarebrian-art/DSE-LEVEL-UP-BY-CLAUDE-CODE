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
  assert.match(ps, /const showElapsed = timerPref === 'show' && !quiet/)
  assert.match(ps, /\{showElapsed && \(\s*<span className="flex items-center gap-1">\s*<Clock/, 'elapsed clock must depend on showElapsed')
  // The per-question timer button stays available in the default state.
  assert.match(ps, /const hideTimer = timerPref === 'hide'/)
})

// ── B3 (a): the emotion check-in focuses its heading, not "I'm OK" ──────────
test('B3: no option is auto-focused; the heading takes focus and the page goes inert', () => {
  const src = read('components/EmotionThermometer.tsx')
  assert.doesNotMatch(src, /autoFocus=/, 'an auto-focused option lets a reflexive Enter record a feeling')
  assert.match(src, /ref=\{headingRef\} tabIndex=\{-1\}/)
  assert.match(src, /headingRef\.current\?\.focus\(\)/)
  assert.match(src, /setAttribute\('inert', ''\)/)
  assert.match(src, /previous\.focus\(\)/, 'focus must return where it was')
})

// ── B2 (a): a repeated error cause is a pattern the student found, not an alert ──
test('B2: the repeat-pattern card is gold and framed as a finding, and concept blind spots are not red', () => {
  const src = read('components/ErrorDNA.tsx')
  assert.doesNotMatch(src, /重複模式警示|Repeat-pattern alert/)
  assert.match(src, /你搵到一個規律/)
  const card = src.slice(src.indexOf('{streak && ('), src.indexOf('{streak && (') + 400)
  assert.match(card, /border-gold/)
  assert.doesNotMatch(card, /rose/)
  const conceptColour = src.match(/zh: '概念盲區', en: 'Concept blind spot', color: '(#[0-9A-Fa-f]{6})'/)?.[1]
  assert.equal(conceptColour, '#6D28D9', 'concept blind spot must leave the red family')
})

// ── B1 (a): a chosen rest day is a full rest page on the dashboard ─────────
test('B1: the dashboard shows a full rest page on a rest day, before any task or count', () => {
  const src = read('app/dashboard/DashboardPageClient.tsx')
  assert.match(src, /setRestDay\(isRestDayToday\(\)\)/)
  assert.match(src, /addEventListener\('dse-rest-day', read\)/)
  const branch = src.indexOf('if (restDay) {')
  assert.ok(branch > 0, 'rest-day branch missing')
  assert.ok(branch < src.indexOf('const accuracyPct'), 'the rest page must return before stats are rendered')
  const page = src.slice(branch, branch + 2500)
  assert.match(page, /今日想做少少都得/, 'keep the small "do one anyway" link')
  assert.match(page, /href="\/relax"/)
})

// ── C1 (a): a bank that fails to load says so instead of spinning forever ────
test('C1: both bank loads have a catch that leads to an error screen', () => {
  const gate = read('app/practice/PracticeGate.tsx')
  assert.match(gate, /loadWrittenQuestions\(subjectId\)\.then\([^\n]*\)\.catch\(fail\)/)
  assert.match(gate, /loadSubjectMCQuestions\(subjectId\)\.then\([^\n]*\)\.catch\(fail\)/)
  assert.match(gate, /if \(loadFailed\) return <BankLoadError subjectId=\{subjectId\} \/>/)
  assert.match(gate, /呢科未存喺部機/)
})

test('C1: the version check gives up after a few seconds only when a local copy exists', () => {
  const cloud = read('lib/questionCloud.ts')
  const ms = Number(cloud.match(/export const VERSION_TIMEOUT_MS = (\d+)/)?.[1])
  assert.ok(ms >= 3000 && ms <= 4000, `timeout ${ms} ms is outside the chosen 3–4 s`)
  assert.match(cloud, /cached\?\.questions\.length \? setTimeout\(\(\) => ctrl\.abort\(\), VERSION_TIMEOUT_MS\) : null/)
  assert.match(cloud, /clearTimeout\(timer\)/)
})

// ── B5 (b): quiet mode also hides the numbers, and its toggle comes first ─────
test('B5: the dashboard score line and stat cards are hidden in quiet mode, after the toggle', () => {
  const src = read('app/dashboard/DashboardPageClient.tsx')
  assert.match(src, /const quiet = useQuiet\(\)/)
  assert.match(src, /\{!quiet && \(\s*<p className="text-ink-muted text-sm">\s*\{d\.subtitleA\}/, 'score line must depend on quiet')
  assert.match(src, /\{!quiet && \(\s*<div className="grid grid-cols-2 lg:grid-cols-4[^"]*">\s*\{statCards\.map/, 'stat cards must depend on quiet')
  const toggle = src.indexOf('<QuietModeToggle />')
  const cards = src.indexOf('{statCards.map')
  assert.ok(toggle > 0 && toggle < cards, 'the toggle must come before the stat cards')
})

test('B5: quiet mode also hides the practice clock, the mood pop-up and the encouragement wall', () => {
  const ps = read('app/practice/PracticeSession.tsx')
  assert.match(ps, /const showElapsed = timerPref === 'show' && !quiet/)
  assert.match(ps, /if \(!isCorrect && currentQ\.difficulty === 'hard' && !isQuiet\(\)\) setEmoOpen\(true\)/)
  // The per-question timer button still depends only on an explicit hide.
  assert.match(ps, /const hideTimer = timerPref === 'hide'/)
  const result = read('app/result/ResultPageClient.tsx')
  assert.match(result, /\{!quiet && <EncouragementWall \/>\}/)
})
