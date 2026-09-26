// Elective choices: which elective units (or strand) a student's school has
// assigned, per subject. Rules and official unit names come from
// PAPER_STRUCTURE in data/dse-paper-formats.ts (2027 assessment frameworks).
//
// Stored in localStorage and, for signed-in students, synced with progress
// (lib/sync.ts). Decided by Yuna on 2026-09-26 under charter §18; see
// docs/charter-amendment-2026-09-26-electives-DRAFT.md and charter §16.E.
// Each subject's choice carries its own updatedAt so the newer choice wins per
// subject when two devices disagree.

import { PAPER_STRUCTURE, type ElectiveRule } from '@/data/dse-paper-formats'
import { notifyProgressChanged } from '@/lib/sync'

export const ELECTIVES_KEY = 'dse_electives'
export const ELECTIVES_EVENT = 'dse-electives'

export interface ElectiveSelection {
  /** The student does not know yet, or the school has not assigned them: no filtering. */
  unassigned?: boolean
  /** BAFS and Technology & Living: the chosen strand id. */
  strand?: string
  /** Chosen elective unit ids. */
  units: string[]
  /** When this choice was made (ms). Used to pick the newer choice across devices. */
  updatedAt?: number
}

export type ElectiveMap = Record<string, ElectiveSelection>

export function electiveRules(subject: string): ElectiveRule[] {
  return PAPER_STRUCTURE[subject]?.electives ?? []
}

export function hasElectives(subject: string): boolean {
  return electiveRules(subject).length > 0
}

/** The strand rule, if the subject is split into strands first. */
export function strandRule(subject: string): ElectiveRule | undefined {
  return electiveRules(subject).find((r) => r.kind === 'strand')
}

/** The unit rule that applies after the strand choice (if any). */
export function unitRule(subject: string, strand?: string): ElectiveRule | undefined {
  return electiveRules(subject).find((r) => r.kind === 'units' && (r.strand === undefined || r.strand === strand))
}

/** A selection is complete when it says "unassigned", or satisfies every rule that applies. */
export function isCompleteSelection(subject: string, sel: ElectiveSelection | undefined): boolean {
  if (!sel) return false
  if (sel.unassigned) return true
  const sr = strandRule(subject)
  if (sr && !sr.units.some((u) => u.id === sel.strand)) return false
  const ur = unitRule(subject, sel.strand)
  if (!ur) return true
  const valid = sel.units.filter((id) => ur.units.some((u) => u.id === id))
  return valid.length === ur.choose && new Set(valid).size === valid.length
}

export function readElectives(): ElectiveMap {
  try {
    const raw = localStorage.getItem(ELECTIVES_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

export function saveElective(subject: string, sel: ElectiveSelection): void {
  const all = readElectives()
  all[subject] = { ...sel, updatedAt: Date.now() }
  try {
    localStorage.setItem(ELECTIVES_KEY, JSON.stringify(all))
  } catch {
    /* storage blocked: the choice lasts for this page only */
  }
  window.dispatchEvent(new Event(ELECTIVES_EVENT))
  notifyProgressChanged() // signed in: push with progress
}

// ── Which existing topics belong to one elective or strand ─────────────────
//
// Only mappings that are unambiguous are listed. A topic not listed here is
// shown to every student. Deliberately left out (2026-09-26):
//   • geography weather_climate: the EDB guide describes the Weather and
//     Climate elective as an extension of compulsory content, so the topic may
//     hold compulsory-level questions.
//   • ict databases: not verified whether the compulsory part covers database
//     basics.
//   • BAFS, DAT, HMSC: topics mix compulsory and elective content.
//   • physics, chemistry, biology, economics, Chinese history: no existing
//     topic covers an elective unit.
// Filtering out a compulsory question would be worse than showing one extra
// elective question, so the list errs on the side of leaving topics unmapped.
export const TOPIC_SCOPE: Record<string, Record<string, { strand?: string; unit?: string }>> = {
  'ethics-religious': {
    buddhism: { unit: 'buddhism' },
    christianity: { unit: 'christianity' },
  },
  'technology-living': {
    nutrition: { strand: 'food' },
    lifecycle: { strand: 'food' },
    meal_planning: { strand: 'food' },
    food_science: { strand: 'food' },
    food_safety: { strand: 'food' },
    tl_nutrition_calc: { strand: 'food' },
    fibres: { strand: 'fashion' },
    fashion: { strand: 'fashion' },
  },
}

/** Whether a topic belongs in this student's practice, given their elective choice. */
export function isTopicInScope(subject: string, topic: string, sel: ElectiveSelection | undefined): boolean {
  if (!sel || sel.unassigned) return true
  const scope = TOPIC_SCOPE[subject]?.[topic]
  if (!scope) return true
  if (scope.strand && sel.strand && scope.strand !== sel.strand) return false
  if (scope.unit && !sel.units.includes(scope.unit)) return false
  return true
}
