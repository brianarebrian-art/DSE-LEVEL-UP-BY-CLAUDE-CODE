// ============================================================================
// posref-classifier.mts — what does a positional phrase in an explanation refer to?
// ----------------------------------------------------------------------------
// Pure functions, no file writes. Used by classify-posref.mts (the CLI that writes
// the classification) and by lib/__tests__/posref-classification.test.mts.
// The signals and classes are described in classify-posref.mts.
// ============================================================================
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

// ── Candidate patterns: read from check-posref.mjs so the two cannot drift ────
const gate = read('scripts/qbank/check-posref.mjs')
const pattern = (name: string): RegExp => {
  const m = gate.match(new RegExp(`const ${name} = \\/(.+)\\/([a-z]*)\\n`))
  if (!m) throw new Error(`cannot read ${name} from check-posref.mjs`)
  return new RegExp(m[1], m[2].includes('g') ? m[2] : m[2] + 'g')
}
const PATTERNS = ['ZH', 'EN', 'ZH_ORD', 'EN_ORD'].map((n) => ({ layer: n, re: pattern(n) }))

// ── Signals ─────────────────────────────────────────────────────────────────
const OPTION_NOUN = /選項|干擾項|答案|option|distractor|choice/i
const OMISSION_BEFORE = /(?:漏了|漏晒|漏咗|只算了|只計了|只算|只計|缺了|少了|略去了|忽略了|omits? the|drops? the|only the)\s*$/i
const TERM_OF = /(?:數列|級數|展開式|多項式|行列式|矩陣|恆等式|算式|式子|sequence|series|expansion|polynomial)\s*的?\s*$/i
const ENUM_COUNT = /[二三四五六兩]\s*(?:件事|個條件|項條件|個因素|個原因|個步驟|點)\s*[：:]|\b(?:two|three|four|five) (?:conditions|things|factors|steps|reasons)\b/i
const STEM_STATEMENTS = /\(\s*[1-4]\s*\)[\s\S]*\(\s*[2-4]\s*\)|[①②③④][\s\S]*[②③④]|(?:^|\s)I{1,3}\.\s[\s\S]*\sII\.\s/

const ORDINAL: Record<string, number> = {
  一: 0, 二: 1, 三: 2, 四: 3, '1': 0, '2': 1, '3': 2, '4': 3,
  first: 0, second: 1, third: 2, fourth: 3, A: 0, B: 1, C: 2, D: 3,
}
/** Stored option index the phrase points at, or null (last/final resolve to n - 1). */
function mappedIndex(phrase: string, n: number): number | null {
  if (/最後|last|final/i.test(phrase)) return n - 1
  const m = phrase.match(/第\s*([1-4一二三四])|\b(first|second|third|fourth)\b|(?:^|[^A-Za-z])([ABCD])(?:\s*選項|$)|選項\s*([ABCD])|options?\s+([ABCD])/i)
  if (!m) return null
  const k = (m[1] ?? m[2] ?? m[3] ?? m[4] ?? m[5]).toString()
  const v = ORDINAL[k] ?? ORDINAL[k.toLowerCase()] ?? ORDINAL[k.toUpperCase()]
  return v ?? null
}

const norm = (s: string) =>
  s.replace(/\\(?:text|mathrm|mathbf)\{([^}]*)\}/g, '$1').replace(/\\[,;!:]|[\s${}]/g, '').toLowerCase()

/** Does `text` quote this option? Short numeric options must appear as written. */
function quotes(text: string, option: string): boolean {
  const o = norm(option)
  if (o.length < 2) return option.length > 1 && text.includes(option)
  const t = norm(text)
  return t.includes(o.length > 24 ? o.slice(0, 16) : o)
}

const STOP = new Set(['that', 'this', 'with', 'from', 'have', 'which', 'their', 'there', 'what', 'when', 'where', 'does', 'because', 'only', 'than', 'into', 'they', 'them', 'were', 'been', 'also', 'more'])
/** Latin words (5+ letters) and CJK bigrams: enough to tell whether two short texts share a subject. */
function tokens(s: string): Set<string> {
  const out = new Set<string>()
  for (const w of s.toLowerCase().match(/[a-z]{5,}/g) ?? []) if (!STOP.has(w)) out.add(w)
  const cjk = s.replace(/[^一-鿿]/g, '')
  for (let i = 0; i + 1 < cjk.length; i++) out.add(cjk.slice(i, i + 2))
  return out
}
function overlapsAnOption(after: string, options: string[]): boolean {
  const t = tokens(after)
  return options.some((o) => {
    const shared = [...tokens(o)].filter((x) => t.has(x))
    return shared.some((x) => /[a-z]/.test(x)) || shared.length >= 2
  })
}

function sentences(text: string): { start: number; end: number }[] {
  const out: { start: number; end: number }[] = []
  let start = 0
  const re = /[。！？]|[.!?](?=\s|$)/g
  for (const m of text.matchAll(re)) {
    // A full stop inside a number ("0.5") is not a sentence end.
    if (m[0] === '.' && /\d/.test(text[m.index! - 1] ?? '') && /\d/.test(text[m.index! + 1] ?? '')) continue
    out.push({ start, end: m.index! + 1 })
    start = m.index! + 1
  }
  if (start < text.length) out.push({ start, end: text.length })
  return out
}

export type Verdict = 'option' | 'content' | 'unknown'
export type Hit = { field: string; phrase: string; verdict: Verdict; signals: string[]; mapsTo: number | null; mapsToCorrect: boolean }
export type Q = { id: string; content?: string; contentEn?: string; options?: string[]; optionsEn?: string[]; correctIndex?: number; explanation?: string; explanationEn?: string }

function classifyHit(q: Q, field: 'explanation' | 'explanationEn', text: string, at: number, phrase: string): Hit {
  const options = (field === 'explanationEn' ? q.optionsEn ?? q.options : q.options) ?? []
  const n = options.length || 4
  const mapsTo = mappedIndex(phrase, n)
  const signals: string[] = []

  if (OPTION_NOUN.test(phrase)) signals.push('option-noun')
  const before = text.slice(Math.max(0, at - 12), at)
  if (OMISSION_BEFORE.test(before)) signals.push('omission-object')
  if (TERM_OF.test(before)) signals.push('term-of')

  const ss = sentences(text)
  const k = ss.findIndex((s) => at >= s.start && at < s.end)
  const window = text.slice(ss[Math.max(0, k - 1)]?.start ?? 0, ss[k]?.end ?? text.length)
  const distractors = options.map((o, i) => ({ o, i })).filter((d) => d.i !== q.correctIndex && d.i !== mapsTo)
  if (distractors.some((d) => quotes(window, d.o))) signals.push('sibling-distractors')

  // A list of non-option items that the position can index.
  const listed = text.split(/[。；;]/).some((part) => {
    const items = part.split('、')
    return items.length >= 3 && !items.some((it) => options.some((o) => quotes(it, o)))
  })
  if (ENUM_COUNT.test(text) || listed) signals.push('enumeration')
  const stem = (field === 'explanationEn' ? q.contentEn ?? q.content : q.content) ?? ''
  if (STEM_STATEMENTS.test(stem) && !OPTION_NOUN.test(phrase)) signals.push('stem-statements')
  const after = text.slice(at + phrase.length, at + phrase.length + 60).split(/[。；;.!?]/)[0]
  if (overlapsAnOption(after, [...(q.options ?? []), ...(q.optionsEn ?? [])])) signals.push('option-overlap')

  let verdict: Verdict = 'unknown'
  if (signals.includes('option-noun')) verdict = 'option'
  else if (signals.includes('omission-object') || signals.includes('term-of')) verdict = 'content'
  else if (signals.includes('sibling-distractors')) verdict = 'option'
  else if ((signals.includes('enumeration') || signals.includes('stem-statements')) && !signals.includes('option-overlap')) verdict = 'content'

  return { field, phrase, verdict, signals, mapsTo, mapsToCorrect: mapsTo !== null && mapsTo === q.correctIndex }
}

export type PosrefClass = 'A' | 'B' | 'C'
export const LABEL: Record<PosrefClass, string> = {
  A: 'CONFIDENT_OPTION_REFERENCE',
  B: 'LIKELY_CONTENT_REFERENCE',
  C: 'AMBIGUOUS',
}

export function classifyQuestion(q: Q): { class: PosrefClass; hits: Hit[] } | null {
  const hits: Hit[] = []
  for (const field of ['explanation', 'explanationEn'] as const) {
    const text = q[field]
    if (typeof text !== 'string') continue
    for (const { re } of PATTERNS) {
      for (const m of text.matchAll(re)) hits.push(classifyHit(q, field, text, m.index!, m[0]))
    }
  }
  if (!hits.length) return null
  const cls: PosrefClass = hits.some((h) => h.verdict === 'option') ? 'A' : hits.every((h) => h.verdict === 'content') ? 'B' : 'C'
  return { class: cls, hits }
}
