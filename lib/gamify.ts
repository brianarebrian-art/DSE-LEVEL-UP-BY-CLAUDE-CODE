// Dopamine engine state: academic EXP + rank, daily study streak, and gacha-
// unlocked UI themes. All client-side localStorage, all null-safe (every getter
// tolerates a missing / corrupt key and returns a calibrated default).

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}
function readNum(key: string): number {
  if (!isBrowser()) return 0
  try {
    const n = Number(localStorage.getItem(key))
    return Number.isFinite(n) ? n : 0
  } catch {
    return 0
  }
}
function write(key: string, value: string): void {
  if (!isBrowser()) return
  try {
    localStorage.setItem(key, value)
  } catch {
    /* ignore */
  }
}

// ── EXP ───────────────────────────────────────────────────────────────────────
const EXP_KEY = 'dse_exp'
/** Academic EXP earned per answered question (tune in one place). */
export const EXP_PER_QUESTION = 10

export function getExp(): number {
  return readNum(EXP_KEY)
}
export function addExp(n: number): number {
  const next = getExp() + Math.max(0, Math.round(n))
  write(EXP_KEY, String(next))
  return next
}

// ── Daily streak ──────────────────────────────────────────────────────────────
const STREAK_KEY = 'dse_streak_days'
const LAST_KEY = 'dse_last_active'

function dayKey(d = new Date()): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

export function getStreak(): number {
  return readNum(STREAK_KEY)
}

/**
 * Advance the daily streak on a completed run. Same day → unchanged; yesterday →
 * +1; any longer gap (or first ever) → reset to 1. Returns the new count and
 * whether this call changed it (so the UI can light the flame once per day).
 */
export function touchStreak(): { days: number; increased: boolean } {
  if (!isBrowser()) return { days: 0, increased: false }
  const today = dayKey()
  let last: string | null = null
  try {
    last = localStorage.getItem(LAST_KEY)
  } catch {
    last = null
  }
  if (last === today) return { days: Math.max(1, getStreak()), increased: false }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const days = last === dayKey(yesterday) ? Math.max(1, getStreak()) + 1 : 1
  write(STREAK_KEY, String(days))
  write(LAST_KEY, today)
  return { days, increased: true }
}

// ── Rank titles ───────────────────────────────────────────────────────────────
export interface Rank {
  id: string
  zh: string
  en: string
  cls: string // tailwind text class (or a special class for the gold 戰神)
}

// Highest threshold first. `premiumOnly` tiers are skipped for free users.
const RANKS: { min: number; premiumOnly?: boolean; rank: Rank }[] = [
  { min: 50000, premiumOnly: true, rank: { id: 'god', zh: 'DSE 戰神', en: 'DSE War God', cls: 'rank-god' } },
  { min: 5000, rank: { id: 'elite', zh: '尖子預備軍', en: 'Elite-in-Training', cls: 'text-sky-300' } },
  { min: 1000, rank: { id: 'apprentice', zh: '操卷學徒', en: 'Drill Apprentice', cls: 'text-emerald-300' } },
  { min: 0, rank: { id: 'drifter', zh: '學術流浪漢', en: 'Academic Drifter', cls: 'text-slate-400' } },
]

export function rankFor(exp: number, isPremium: boolean): Rank {
  for (const r of RANKS) {
    if (exp >= r.min && (!r.premiumOnly || isPremium)) return r.rank
  }
  return RANKS[RANKS.length - 1].rank
}

/** EXP threshold of the next tier up, or null if already at the top. */
export function nextRankAt(exp: number): number | null {
  const ascending = [...RANKS].sort((a, b) => a.min - b.min)
  for (const r of ascending) if (exp < r.min) return r.min
  return null
}

// ── Gacha + unlockable themes ─────────────────────────────────────────────────
const THEMES_KEY = 'dse_themes'
const ACTIVE_THEME_KEY = 'dse_active_theme'

/** True on a win. Default 5% — the hell-question easter egg. */
export function rollGacha(p = 0.05): boolean {
  return Math.random() < p
}

export function getThemes(): string[] {
  if (!isBrowser()) return []
  try {
    const raw = localStorage.getItem(THEMES_KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}
/** Unlock a theme; returns true only if it was newly unlocked. */
export function unlockTheme(id: string): boolean {
  if (!isBrowser()) return false
  const cur = getThemes()
  if (cur.includes(id)) return false
  write(THEMES_KEY, JSON.stringify([...cur, id]))
  return true
}

export function getActiveTheme(): string {
  if (!isBrowser()) return 'default'
  try {
    return localStorage.getItem(ACTIVE_THEME_KEY) || 'default'
  } catch {
    return 'default'
  }
}
export function setActiveTheme(id: string): void {
  write(ACTIVE_THEME_KEY, id)
  applyTheme(id)
}
/** Reflect the active theme onto <html data-theme> (CSS does the rest). */
export function applyTheme(id?: string): void {
  if (typeof document === 'undefined') return
  const theme = id ?? getActiveTheme()
  if (theme && theme !== 'default') document.documentElement.dataset.theme = theme
  else delete document.documentElement.dataset.theme
}
