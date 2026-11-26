/** Keep half-credits from written self-assessment (partial = 0.5). */
export function noteCount(value: unknown): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100000) return null
  return Math.round(value * 2) / 2
}
