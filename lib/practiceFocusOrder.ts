// Tab order for a revealed practice question.
//
// The next button stays pinned under the scrolling explanation, so it cannot
// also sit between the options and the explanation in layout. Sequential focus
// is decided here: question options, then next, then the explanation controls.
// A null destination means the browser's own order is already right.

export type PracticeFocusSlot =
  | 'option'
  | 'option-last'
  | 'next'
  | 'feedback-first'
  | 'feedback-last'
  | 'feedback-only'
  | 'after'
  | 'other'

export type PracticeTabStop = 'next' | 'feedback-first' | 'feedback-last' | 'option-last' | 'after'

export function slotFor(
  active: object,
  model: {
    options: readonly object[]
    nextBtn: object
    feedback: object
    inFeedback: readonly object[]
    afterNext: object | null
  },
): PracticeFocusSlot {
  if (active === model.nextBtn) return 'next'
  const last = model.options[model.options.length - 1]
  if (last && active === last) return 'option-last'
  if (model.options.includes(active)) return 'option'
  const only = model.inFeedback.length <= 1
  const first = model.inFeedback[0]
  if (only && (active === model.feedback || (first !== undefined && active === first))) return 'feedback-only'
  if (first !== undefined && active === first) return 'feedback-first'
  const tail = model.inFeedback[model.inFeedback.length - 1]
  if (tail !== undefined && active === tail) return 'feedback-last'
  if (model.afterNext && active === model.afterNext) return 'after'
  return 'other'
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/** Tab stops inside root, skipping hidden nodes. */
export function listPracticeFocusables(root: ParentNode): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => {
    if (el.closest('[aria-hidden="true"]')) return false
    const style = window.getComputedStyle(el)
    return style.display !== 'none' && style.visibility !== 'hidden'
  })
}

export function tabStopElement(
  dest: PracticeTabStop,
  model: {
    options: readonly HTMLElement[]
    nextBtn: HTMLElement
    feedback: HTMLElement
    inFeedback: readonly HTMLElement[]
    afterNext: HTMLElement | null
  },
): HTMLElement | null {
  if (dest === 'next') return model.nextBtn
  if (dest === 'option-last') return model.options[model.options.length - 1] ?? null
  if (dest === 'feedback-first') return model.inFeedback[0] ?? model.feedback
  if (dest === 'feedback-last') return model.inFeedback[model.inFeedback.length - 1] ?? model.feedback
  return model.afterNext
}

/** Where Tab should move. null keeps the browser order. */
export function practiceTabDestination(slot: PracticeFocusSlot, shift: boolean): PracticeTabStop | null {
  if (slot === 'other' || slot === 'option') return null
  if (!shift) {
    if (slot === 'option-last') return 'next'
    if (slot === 'next') return 'feedback-first'
    if (slot === 'feedback-last' || slot === 'feedback-only') return 'after'
    return null
  }
  if (slot === 'next') return 'option-last'
  if (slot === 'feedback-first' || slot === 'feedback-only') return 'next'
  if (slot === 'after') return 'feedback-last'
  return null
}
