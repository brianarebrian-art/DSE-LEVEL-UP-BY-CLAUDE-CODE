import type { MCQuestion, OptionNote } from '@/data/questions/types'

// Option identity through the shuffle (2026-09-29).
//
// Options are shuffled every time a question is shown. Any explanation that names an
// option by position ("第二項", "the second option") therefore points at the wrong one;
// 176 questions were withdrawn for exactly that. The fix is structural, not a writing
// rule: each displayed option carries `optionId`, its index in the stored array, and a
// per-option note is looked up by that id. Position never enters into it.
//
// Pure functions only, so the shuffle regression test can run them without a browser.

/** One option as displayed. `optionId` is its stored index, not its display position. */
export interface DisplayOption {
  zh: string
  en: string | null
  optionId: number
}

/** Fisher–Yates on a copy. `random` is injectable so tests can replay many shuffles. */
export function shuffled<T>(arr: readonly T[], random: () => number = Math.random): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** The question's options in a fresh random order, each tagged with its identity. */
export function displayOptions(
  q: Pick<MCQuestion, 'options' | 'optionsEn'>,
  random: () => number = Math.random,
): DisplayOption[] {
  return shuffled(
    q.options.map((zh, i) => ({ zh, en: q.optionsEn?.[i] ?? null, optionId: i })),
    random,
  )
}

/**
 * Pairs each displayed option with its note, in display order. Options without a
 * note are left out; a question without notes returns [] and shows only its prose
 * explanation, as before.
 */
export function notesInDisplayOrder(
  notes: readonly OptionNote[] | undefined,
  displayed: readonly DisplayOption[],
): { option: DisplayOption; note: OptionNote }[] {
  if (!notes?.length) return []
  const byId = new Map(notes.map((n) => [n.optionId, n]))
  return displayed.flatMap((option) => {
    const note = byId.get(option.optionId)
    return note ? [{ option, note }] : []
  })
}
