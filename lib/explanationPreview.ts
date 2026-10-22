// How much of an explanation to show before the student asks for the rest.
//
// The practice feedback used to reveal only the first sentence and hide the
// remainder behind a second control. On a phone that read as one collapsed
// line. Show two or three short pieces immediately. Do not invent numbered
// "step 1 / step 2" labels: sentence boundaries are not a worked solution.
// Real `steps` from the question bank keep their own order in the component.

const MIN_PIECE = 10

function maskMath(text: string): { masked: string; slots: string[] } {
  const slots: string[] = []
  const masked = text.replace(/\$\$[\s\S]+?\$\$|\$[^$\n]+\$/g, (m) => {
    const token = `\u0000${slots.length}\u0000`
    slots.push(m)
    return token
  })
  return { masked, slots }
}

function unmask(text: string, slots: string[]): string {
  return text.replace(/\u0000(\d+)\u0000/g, (_, n: string) => slots[Number(n)] ?? '')
}

/**
 * Sentence pieces. Math spans are masked first so a decimal point is not a break.
 * A short ASCII stop (for example "Fig.") stays with the following words.
 * A fullwidth stop always starts a new piece, even when the piece is short.
 */
export function splitSentences(text: string): string[] {
  const trimmed = text.trim()
  if (!trimmed) return []
  const { masked, slots } = maskMath(trimmed)
  const out: string[] = []
  let rest = masked.trim()
  let carry = ''
  while (rest) {
    const m = rest.match(/^[\s\S]*?(?:[。！？]|[.!?](?=\s|$))/)
    const head = m?.[0]
    if (!head || head.trim().length >= rest.length) {
      const tail = `${carry}${rest}`.trim()
      if (tail) out.push(unmask(tail, slots))
      carry = ''
      break
    }
    const chunk = `${carry}${head}`.trim()
    const asciiStop = /[.!?]$/.test(head.trim()) && !/[。！？]/.test(head)
    if (asciiStop && chunk.length < MIN_PIECE + 2) {
      carry = `${chunk} `
      rest = rest.slice(head.length).trimStart()
      continue
    }
    out.push(unmask(chunk, slots))
    carry = ''
    rest = rest.slice(head.length).trimStart()
  }
  if (carry.trim()) {
    const extra = unmask(carry.trim(), slots)
    if (out.length) out[out.length - 1] = `${out[out.length - 1]} ${extra}`.trim()
    else out.push(extra)
  }
  return out.filter((s) => s.length > 0)
}

function pieces(text: string): string[] {
  const sentences = splitSentences(text)
  if (sentences.length >= 2) return sentences
  const only = sentences[0] ?? text.trim()
  const clauses = only
    .split(/(?<=；)|(?<=;\s)/)
    .map((s) => s.trim())
    .filter((s) => s.length >= MIN_PIECE)
  return clauses.length >= 2 ? clauses : [only]
}

/** At most three short pieces up front. Anything beyond that is `rest`. */
export function previewSteps(text: string): { steps: string[]; rest: string[] } {
  const all = pieces(text).filter((s) => s.length > 0)
  if (all.length === 0) return { steps: [], rest: [] }
  const n = Math.min(3, all.length)
  return { steps: all.slice(0, n), rest: all.slice(n) }
}
