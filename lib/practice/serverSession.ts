/**
 * Server-side practice session helpers (charter 2B C1 — DRAFT / flag-gated).
 * Sessions keep answer keys only in memory Map keyed by session id.
 * NOT durable across serverless instances without external store — MVP uses
 * signed session payload (HMAC) so any instance can verify.
 */
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import type { MCQuestion } from '@/data/questions/types'

export const PRACTICE_SERVER_GRADE_FLAG = 'PRACTICE_SERVER_GRADE'

export function serverGradeEnabled(): boolean {
  return process.env.PRACTICE_SERVER_GRADE === '1'
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

type SessionItem = {
  id: string
  content: string
  contentEn?: string
  options: string[]
  optionsEn?: string[]
  /** Index in the SHUFFLED options array that is correct — server only. */
  correctShuffledIndex: number
  marks: number
  topic: string
  topicZh: string
  difficulty: string
}

export type PublicSessionItem = Omit<SessionItem, 'correctShuffledIndex'>

export type SessionPayload = {
  v: 1
  sessionId: string
  subjectId: string
  seed: string
  exp: number
  items: SessionItem[]
}

function secret(): string {
  // Prefer dedicated secret; fall back to service role only on server (never expose).
  return (
    process.env.PRACTICE_SESSION_HMAC_SECRET ||
    process.env.CRON_SECRET ||
    'dev-only-insecure-practice-session-secret'
  )
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
  const expect = sign(body)
  try {
    const a = Buffer.from(sig)
    const b = Buffer.from(expect)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  } catch {
    return null
  }
  try {
    const parsed = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload
    if (parsed.v !== 1 || !parsed.sessionId || !Array.isArray(parsed.items)) return null
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

export function buildSession(
  subjectId: string,
  questions: MCQuestion[],
  size: number,
): { token: string; publicItems: PublicSessionItem[]; sessionId: string } {
  const seed = randomBytes(16).toString('hex')
  const rng = mulberry32(hashSeed(seed))
  const pool = [...questions]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  const picked = pool.slice(0, Math.min(size, pool.length))
  const items: SessionItem[] = picked.map((q) => {
    const sh = shuffleOptions(q, rng)
    return {
      id: q.id,
      content: q.content,
      contentEn: q.contentEn,
      options: sh.options,
      optionsEn: sh.optionsEn,
      correctShuffledIndex: sh.correctShuffledIndex,
      marks: q.marks,
      topic: q.topic,
      topicZh: q.topicZh,
      difficulty: q.difficulty,
    }
  })
  const sessionId = randomBytes(12).toString('hex')
  const payload: SessionPayload = {
    v: 1,
    sessionId,
    subjectId,
    seed,
    exp: Date.now() + 2 * 60 * 60 * 1000,
    items,
  }
  const publicItems: PublicSessionItem[] = items.map((item) => ({
    id: item.id,
    content: item.content,
    contentEn: item.contentEn,
    options: item.options,
    optionsEn: item.optionsEn,
    marks: item.marks,
    topic: item.topic,
    topicZh: item.topicZh,
    difficulty: item.difficulty,
  }))
  return { token: encodeSession(payload), publicItems, sessionId }
}

export function gradeSession(
  token: string,
  answers: Array<{ id: string; chosenIndex: number }>,
): {
  ok: true
  score: number
  total: number
  details: Array<{ id: string; correct: boolean; correctIndex: number }>
} | { ok: false; error: string } {
  const session = decodeSession(token)
  if (!session) return { ok: false, error: 'invalid_or_expired_session' }
  const byId = new Map(session.items.map((i) => [i.id, i]))
  let score = 0
  const details: Array<{ id: string; correct: boolean; correctIndex: number }> = []
  for (const a of answers) {
    const item = byId.get(a.id)
    if (!item) continue
    const correct = a.chosenIndex === item.correctShuffledIndex
    if (correct) score++
    details.push({
      id: a.id,
      correct,
      correctIndex: item.correctShuffledIndex,
    })
  }
  return { ok: true, score, total: details.length, details }
}

/** Strip keys that must never appear in pre-grade API JSON. */
export function assertNoAnswerLeak(payload: unknown): string[] {
  const bad: string[] = []
  const walk = (v: unknown, path: string) => {
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
