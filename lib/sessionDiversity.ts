// Session sampler guard: a 10-question set should not be two copies of the same
// stem with the numbers swapped. Digits (including inside $...$) collapse to a
// placeholder, so templates that differ only by values share a key.

export function stemKey(content: string): string {
  const masked = content.replace(/\$\$[\s\S]*?\$\$|\$[^$]*\$/g, (math) => math.replace(/\d+(?:\.\d+)?/g, '#'))
  return masked.replace(/\d+(?:\.\d+)?/g, '#').replace(/\s+/g, '').toLowerCase()
}

/**
 * Draw up to `size` items, preferring stems not already chosen. If the pool
 * cannot fill the session without a repeat, the leftovers are appended so a
 * thin bank still returns as many questions as it has.
 */
export function takeDiverse<T extends { content: string }>(
  ordered: readonly T[],
  size: number,
  already: readonly T[] = [],
): T[] {
  if (size <= 0) return []
  const chosen: T[] = []
  const seen = new Set(already.map((q) => stemKey(q.content)))
  const skipped: T[] = []
  for (const q of ordered) {
    if (chosen.length >= size) break
    const key = stemKey(q.content)
    if (seen.has(key)) {
      skipped.push(q)
      continue
    }
    chosen.push(q)
    seen.add(key)
  }
  for (const q of skipped) {
    if (chosen.length >= size) break
    chosen.push(q)
  }
  return chosen
}
