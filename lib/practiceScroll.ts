// After an answer, how far to scroll so the feedback comes into view
// (UX loop 4, 2026-09-30).
//
// On a phone the feedback sits under the four options. Measured at 375×812:
// the first line after a wrong answer was at y=744 and the page did not move,
// so the student saw the options change colour and nothing else.
//
// The rule: leave the page alone when the feedback already starts in the top
// three quarters of the screen. Otherwise scroll just far enough to put its first
// line at mid-screen, which keeps the chosen and the correct option above it.

/** Feedback starting at or above this share of the viewport is left where it is. */
export const FEEDBACK_VISIBLE_LINE = 0.75
/** Where the first line of the feedback ends up after scrolling. */
export const FEEDBACK_TARGET_LINE = 0.5

export function feedbackScrollDelta(feedbackTop: number, viewportHeight: number): number {
  if (!(viewportHeight > 0) || !Number.isFinite(feedbackTop)) return 0
  if (feedbackTop <= viewportHeight * FEEDBACK_VISIBLE_LINE) return 0
  return Math.round(feedbackTop - viewportHeight * FEEDBACK_TARGET_LINE)
}
