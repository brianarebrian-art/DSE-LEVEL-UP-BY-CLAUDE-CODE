/**
 * Server-side practice session helpers (charter 2B C1 — DRAFT / flag-gated).
 *
 * Security rules:
 * - Client token is HMAC-signed metadata ONLY (ids + seed). No correct indices.
 * - Answers are re-derived on grade from bank + seed (deterministic RNG replay).
 * - PRACTICE_SESSION_HMAC_SECRET is required when PRACTICE_SERVER_GRADE=1.
 */
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import type { MCQuestion } from '@/data/questions/types'

export const PRACTICE_SERVER_GRADE_FLAG = 'PRACTICE_SERVER_GRADE'

export function serverGradeEnabled(): boolean {
  return process.env.PRACTICE_SERVER_GRADE === '1'
}

/** True when grading flag is on AND a dedicated HMAC secret is configured. */
export function serverGradeReady(): boolean {
  if (!serverGradeEnabled()) return false
  const s = process.env.PRACTICE_SESSION_HMAC_SECRET
  return typeof s === 'string' && s.length >= 32
}

const PILOT_SUBJECTS = new Set([
  'math',
  'physics',
  'chemistry',
  'biology',
  'bafs',
  'economics',
])

export function isPilotSubject(subjectId: string): boolean {
  return PILOT_SUBJECTS.has(subjectId)
}

export type PublicSessionItem = {
  id: string
  content: string
  contentEn?: string
  options: string[]
  optionsEn?: string[]
  marks: number
  topic: string
  topicZh: string
  difficulty: string
}

/** v2 token payload — never includes answer keys or shuffled option text. */
export type SessionPayload = {
  v: 2
  sessionId: string
  subjectId: string
  seed: string
  exp: number
  itemIds: string[]
}

function secret(): string {
  const s = process.env.PRACTICE_SESSION_HMAC_SECRET
  if (typeof s === 'string' && s.length >= 32) return s
  throw new Error('PRACTICE_SESSION_HMAC_SECRET_required')
}

function sign(body: string): string {
  return createHmac('sha256', secret()).update(body).digest('base64url')
}

export function encodeSession(payload: SessionPayload): string {
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  return `${body}.${sign(body)}`
}

export function decodeSession(token: string): SessionPayload | null {
  const [body, sig] = token.split('.')
  if (!body || !sig) return null
  let expect: string
  try {
    expect = sign(body)
  } catch {
    return null
  }
  try {
    const a = Buffer.from(sig)
    const b = Buffer.from(expect)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  } catch {
    return null
  }
  try {
    const parsed = JSON.parse(
      Buffer.from(body, 'base64url').toString('utf8'),
    ) as SessionPayload
    if (parsed.v !== 2 || !parsed.sessionId || !Array.isArray(parsed.itemIds)) return null
    if (parsed.itemIds.length === 0 || parsed.itemIds.length > 40) return null
    if (Date.now() > parsed.exp) return null
    return parsed
  } catch {
    return null
  }
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashSeed(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function shuffleOptions(
  q: MCQuestion,
  rng: () => number,
): { options: string[]; optionsEn?: string[]; correctShuffledIndex: number } {
  const idx = [...q.options.keys()]
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[idx[i], idx[j]] = [idx[j], idx[i]]
  }
  const options = idx.map((i) => q.options[i])
  const optionsEn = q.optionsEn ? idx.map((i) => q.optionsEn![i]) : undefined
  const correctShuffledIndex = idx.indexOf(q.correctIndex)
  return { options, optionsEn, correctShuffledIndex }
}

/** Replay pool pick + option shuffles from seed. Returns null if bank drift. */
export function replaySessionItems(
  seed: string,
  itemIds: string[],
  bank: MCQuestion[],
): Array<{ q: MCQuestion; correctShuffledIndex: number; public: PublicSessionItem }> | null {
  const rng = mulberry32(hashSeed(seed))
  const pool = [...bank]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  const picked = pool.slice(0, itemIds.length)
  if (picked.length !== itemIds.length) return null
  for (let i = 0; i < itemIds.length; i++) {
    if (picked[i].id !== itemIds[i]) return null
  }
  return picked.map((q) => {
    const sh = shuffleOptions(q, rng)
    return {
      q,
      correctShuffledIndex: sh.correctShuffledIndex,
      public: {
        id: q.id,
        content: q.content,
        contentEn: q.contentEn,
        options: sh.options,
        optionsEn: sh.optionsEn,
        marks: q.marks,
        topic: q.topic,
        topicZh: q.topicZh,
        difficulty: q.difficulty,
      },
    }
  })
}

export function buildSession(
  subjectId: string,
  questions: MCQuestion[],
  size: number,
): { token: string; publicItems: PublicSessionItem[]; sessionId: string } {
  const seed = randomBytes(16).toString('hex')
  const n = Math.min(size, questions.length)
  // Provisional ids after same shuffle algorithm — use empty ids then fill via replay
  const rng = mulberry32(hashSeed(seed))
  const pool = [...questions]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  const itemIds = pool.slice(0, n).map((q) => q.id)
  const replayed = replaySessionItems(seed, itemIds, questions)
  if (!replayed) throw new Error('session_replay_failed')

  const sessionId = randomBytes(12).toString('hex')
  const payload: SessionPayload = {
    v: 2,
    sessionId,
    subjectId,
    seed,
    exp: Date.now() + 2 * 60 * 60 * 1000,
    itemIds,
  }
  return {
    token: encodeSession(payload),
    publicItems: replayed.map((r) => r.public),
    sessionId,
  }
}

export type GradeDetail = {
  id: string
  correct: boolean
  /** Only present when the client submitted an answer for this id. */
  correctIndex?: number
  answered: boolean
}

export function gradeSession(
  token: string,
  answers: Array<{ id: string; chosenIndex: number }>,
  bank: MCQuestion[],
): {
  ok: true
  score: number
  total: number
  details: GradeDetail[]
  answeredIds: string[]
} | { ok: false; error: string } {
  if (!Array.isArray(answers) || answers.length === 0) {
    return { ok: false, error: 'empty_answers' }
  }
  const session = decodeSession(token)
  if (!session) return { ok: false, error: 'invalid_or_expired_session' }
  if (session.subjectId && bank.length === 0) {
    return { ok: false, error: 'empty_bank' }
  }
  const replayed = replaySessionItems(session.seed, session.itemIds, bank)
  if (!replayed) return { ok: false, error: 'session_bank_mismatch' }

  // One answer per id (first wins); ignore unknowns / duplicates after first
  const chosen = new Map<string, number>()
  for (const a of answers) {
    if (!chosen.has(a.id)) chosen.set(a.id, a.chosenIndex)
  }

  let score = 0
  const details: GradeDetail[] = []
  const answeredIds: string[] = []
  for (const row of replayed) {
    const pick = chosen.get(row.q.id)
    const answered = typeof pick === 'number'
    const correct = answered && pick === row.correctShuffledIndex
    if (correct) score++
    if (answered) {
      answeredIds.push(row.q.id)
      details.push({
        id: row.q.id,
        correct,
        correctIndex: row.correctShuffledIndex,
        answered: true,
      })
    } else {
      // Unanswered: count as wrong for score/total, but do NOT leak the key.
      details.push({ id: row.q.id, correct: false, answered: false })
    }
  }
  return { ok: true, score, total: replayed.length, details, answeredIds }
}

/** Keys that must never appear in pre-grade API JSON (including inside token payload). */
export function assertNoAnswerLeak(payload: unknown): string[] {
  const bad: string[] = []
  const walk = (v: unknown, path: string) => {
    if (typeof v === 'string' && path.endsWith('.token')) {
      // Token is base64url.payload — decode body only (ignore sig) and scan
      const body = v.split('.')[0]
      if (body) {
        try {
          const json = Buffer.from(body, 'base64url').toString('utf8')
          if (/correctShuffledIndex|correctIndex|explanation|referenceAnswer/i.test(json)) {
            bad.push(`${path}[decoded]`)
          }
        } catch {
          /* ignore decode errors */
        }
      }
    }
    if (v && typeof v === 'object') {
      for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
        if (
          /correctIndex|correctShuffledIndex|correctZh|explanation|referenceAnswer|answer_key/i.test(
            k,
          )
        ) {
          bad.push(`${path}.${k}`)
        }
        walk(val, `${path}.${k}`)
      }
    }
  }
  walk(payload, '$')
  return bad
}
