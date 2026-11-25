/**
 * Deterministic parameter / shape checks for qbank items.
 * No external LLM. Exit 0 always when imported; CLI prints JSON summary.
 */
export type CheckResult = {
  id: string
  ok: boolean
  errors: string[]
  warnings: string[]
}

type AnyQ = Record<string, unknown>

export function paramCheck(q: AnyQ): CheckResult {
  const errors: string[] = []
  const warnings: string[] = []
  const id = String(q.id ?? '(missing-id)')

  if (!q.id) errors.push('missing_id')
  if (!q.subject) errors.push('missing_subject')
  if (!q.topic) errors.push('missing_topic')
  if (!q.content || String(q.content).trim().length < 8) errors.push('stem_too_short')
  if (!q.difficulty || !['easy', 'medium', 'hard'].includes(String(q.difficulty))) {
    errors.push('bad_difficulty')
  }
  if (typeof q.marks !== 'number' || (q.marks as number) <= 0) errors.push('bad_marks')

  if (!q.contentEn) warnings.push('missing_contentEn')

  if (q.type === 'mc') {
    const opts = q.options as string[] | undefined
    if (!Array.isArray(opts) || opts.length < 4) errors.push('mc_options_lt_4')
    else if (new Set(opts).size !== opts.length) errors.push('duplicate_options')
    const ci = q.correctIndex
    if (typeof ci !== 'number' || ci < 0 || !opts || ci >= opts.length) {
      errors.push('bad_correctIndex')
    }
    if (!q.explanation || String(q.explanation).trim().length < 8) {
      errors.push('explanation_too_short')
    }
    if (!q.explanationEn) warnings.push('missing_explanationEn')
  } else if (q.type === 'text' || q.type === 'long') {
    if (!q.referenceAnswer) errors.push('missing_referenceAnswer')
  } else {
    errors.push('bad_type')
  }

  return { id, ok: errors.length === 0, errors, warnings }
}

export function adversarialCheck(q: AnyQ): CheckResult {
  const base = paramCheck(q)
  const errors = [...base.errors]
  const warnings = [...base.warnings]
  const id = base.id

  if (q.type === 'mc') {
    const opts = (q.options as string[]) || []
    const banned = /以上皆是|以上皆非|all of the above|none of the above/i
    if (opts.some((o) => banned.test(o))) {
      warnings.push('all_of_the_above_pattern')
    }
    const lengths = opts.map((o) => o.length)
    if (lengths.length === 4) {
      const max = Math.max(...lengths)
      const min = Math.min(...lengths)
      if (max > min * 3 && max - min > 40) warnings.push('option_length_skew')
    }
  }
  // Emotional-safety stub: shaming language in explanation
  const expl = String(q.explanation ?? '')
  if (/你很差|你一定失敗|你不夠努力|stupid|idiot/i.test(expl)) {
    errors.push('emotional_safety_violation')
  }

  return { id, ok: errors.length === 0, errors, warnings }
}

/** Jaccard similarity on character bigrams (zh/en agnostic). */
export function bigramJaccard(a: string, b: string): number {
  const grams = (s: string) => {
    const t = s.replace(/\s+/g, '')
    const set = new Set<string>()
    for (let i = 0; i < t.length - 1; i++) set.add(t.slice(i, i + 2))
    return set
  }
  const A = grams(a)
  const B = grams(b)
  if (A.size === 0 || B.size === 0) return 0
  let inter = 0
  for (const g of A) if (B.has(g)) inter++
  return inter / (A.size + B.size - inter)
}
