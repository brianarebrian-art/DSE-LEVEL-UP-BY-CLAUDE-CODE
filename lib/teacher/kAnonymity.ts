// k-anonymity for class aggregates (Teacher Radar privacy hardening — adopts the
// spec's D03 idea). In a small class, a raw count like "3 students got X wrong" can
// re-identify individuals. When a class has fewer than K_MIN students we return a
// coarse ratio word instead of an exact number. Pure + unit-testable; used by the
// Phase 3 snapshot builder before any count reaches a teacher.
export const K_MIN = 5

/** Exact count when the class is large enough; otherwise a coarse ratio word. */
export function maskCount(affected: number, total: number): number | string {
  if (total >= K_MIN) return affected
  const ratio = total > 0 ? affected / total : 0
  if (ratio > 0.5) return '多數'
  if (ratio > 0.2) return '少數'
  return '個別'
}

/** True when a class is large enough to show exact numbers at all. */
export function meetsKAnonymity(total: number): boolean {
  return total >= K_MIN
}
