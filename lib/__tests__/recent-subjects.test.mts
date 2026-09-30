// /subjects: the subjects practised most recently, one tap from a new session
// (UX loop 16, 2026-09-30; lib/quickStart.ts recentSubjectIds).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const pick = <T,>(m: T): T => ((m as { default?: T }).default ?? m)
const Q = pick(await import('../quickStart.ts'))
const live = (id: string) => id !== 'retired'
const a = (subjectId: string, timestamp: number) => ({ subjectId, timestamp })

test('newest first, each subject once, at most three', () => {
  const attempts = [a('math', 1), a('physics', 5), a('math', 9), a('economics', 3), a('chinese', 4), a('physics', 2)]
  assert.deepEqual(Q.recentSubjectIds(attempts, live), ['math', 'physics', 'chinese'])
  assert.deepEqual(Q.recentSubjectIds(attempts, live, 5), ['math', 'physics', 'chinese', 'economics'])
})

test('subjects no longer live are skipped, and no history means no row', () => {
  assert.deepEqual(Q.recentSubjectIds([a('retired', 9), a('math', 1)], live), ['math'])
  assert.deepEqual(Q.recentSubjectIds([], live), [])
})

test('the input log is not reordered in place', () => {
  const attempts = [a('math', 1), a('physics', 5)]
  Q.recentSubjectIds(attempts, live)
  assert.deepEqual(attempts.map((x) => x.subjectId), ['math', 'physics'])
})

test('the page reads the log after mount and links each chip to a session', () => {
  const view = readFileSync('app/subjects/SubjectsView.tsx', 'utf8')
  const fx = view.slice(view.indexOf('const [recent, setRecent]'), view.indexOf('// Search / category / sort'))
  assert.match(fx, /useEffect\(\(\) => \{[\s\S]*recentSubjectIds\(loadAttempts\(\), live\)/)
  const row = view.slice(view.indexOf('{recent.length > 0 && ('), view.indexOf('{/* Controls: search + sort */}'))
  assert.match(row, /href=\{quickStartHref\(s\.id\)\}/)
  assert.match(row, /min-h-12/)
})
