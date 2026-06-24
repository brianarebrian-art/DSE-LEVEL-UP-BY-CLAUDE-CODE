// Client-side learning-progress store (localStorage).
// Designed so a server-backed implementation (once the user logs in + we add a DB)
// can replace the storage layer without changing the public API.

import { notifyProgressChanged } from '@/lib/sync'

export interface AttemptRecord {
  subjectId: string
  subjectName: string
  topicFilter: string | null
  score: number
  total: number
  grade: string
  topicResults: { topic: string; correct: number; total: number }[]
  elapsed: number
  timestamp: number // epoch ms
}

const KEY = 'dse_progress'

function isBrowser() {
  return typeof window !== 'undefined'
}

export function loadAttempts(): AttemptRecord[] {
  if (!isBrowser()) return []
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as AttemptRecord[]) : []
  } catch {
    return []
  }
}

export function recordAttempt(a: AttemptRecord): void {
  if (!isBrowser()) return
  const all = loadAttempts()
  all.push(a)
  // Keep the store bounded (most recent 500 attempts).
  const trimmed = all.slice(-500)
  localStorage.setItem(KEY, JSON.stringify(trimmed))
  notifyProgressChanged() // queue a debounced cloud sync (if signed in)
}

export function clearProgress(): void {
  if (!isBrowser()) return
  localStorage.removeItem(KEY)
}

// ── Derived statistics ──────────────────────────────────────────────

export interface SubjectStat {
  subjectId: string
  subjectName: string
  attempts: number
  questions: number
  correct: number
  accuracy: number // 0–1
  bestGrade: string
}

export interface TopicStat {
  topic: string
  correct: number
  total: number
  accuracy: number
}

export interface ProgressStats {
  totalAttempts: number
  totalQuestions: number
  totalCorrect: number
  overallAccuracy: number // 0–1
  currentStreak: number // consecutive days up to today/yesterday
  activeDays: number
  subjects: SubjectStat[]
  weakTopics: TopicStat[]
  recent: AttemptRecord[]
}

const GRADE_RANK = ['U', '1', '2', '3', '4', '5', '5*', '5**']

function betterGrade(a: string, b: string): string {
  return GRADE_RANK.indexOf(a) >= GRADE_RANK.indexOf(b) ? a : b
}

function dayKey(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function computeStreak(attempts: AttemptRecord[]): number {
  if (attempts.length === 0) return 0
  const days = new Set(attempts.map((a) => dayKey(a.timestamp)))
  let streak = 0
  const cursor = new Date()
  // Allow the streak to count from today; if nothing today, start from yesterday.
  if (!days.has(dayKey(cursor.getTime()))) {
    cursor.setDate(cursor.getDate() - 1)
    if (!days.has(dayKey(cursor.getTime()))) return 0
  }
  while (days.has(dayKey(cursor.getTime()))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function computeStats(attempts: AttemptRecord[]): ProgressStats {
  const totalAttempts = attempts.length
  const totalQuestions = attempts.reduce((s, a) => s + a.total, 0)
  const totalCorrect = attempts.reduce((s, a) => s + a.score, 0)

  const subjMap = new Map<string, SubjectStat>()
  const topicMap = new Map<string, TopicStat>()

  for (const a of attempts) {
    let s = subjMap.get(a.subjectId)
    if (!s) {
      s = {
        subjectId: a.subjectId,
        subjectName: a.subjectName,
        attempts: 0,
        questions: 0,
        correct: 0,
        accuracy: 0,
        bestGrade: 'U',
      }
      subjMap.set(a.subjectId, s)
    }
    s.attempts++
    s.questions += a.total
    s.correct += a.score
    s.bestGrade = betterGrade(s.bestGrade, a.grade)

    for (const t of a.topicResults) {
      let tt = topicMap.get(t.topic)
      if (!tt) {
        tt = { topic: t.topic, correct: 0, total: 0, accuracy: 0 }
        topicMap.set(t.topic, tt)
      }
      tt.correct += t.correct
      tt.total += t.total
    }
  }

  const subjects = [...subjMap.values()].map((s) => ({
    ...s,
    accuracy: s.questions > 0 ? s.correct / s.questions : 0,
  }))
  subjects.sort((a, b) => b.questions - a.questions)

  const weakTopics = [...topicMap.values()]
    .map((t) => ({ ...t, accuracy: t.total > 0 ? t.correct / t.total : 0 }))
    .filter((t) => t.total >= 2 && t.accuracy < 0.8)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5)

  const recent = [...attempts].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8)
  const activeDays = new Set(attempts.map((a) => dayKey(a.timestamp))).size

  return {
    totalAttempts,
    totalQuestions,
    totalCorrect,
    overallAccuracy: totalQuestions > 0 ? totalCorrect / totalQuestions : 0,
    currentStreak: computeStreak(attempts),
    activeDays,
    subjects,
    weakTopics,
    recent,
  }
}
