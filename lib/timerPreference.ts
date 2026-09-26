// Whether the practice clock is shown.
//
// UX audit B4 (b), Yuna 2026-09-21: hidden by default for every user, not only
// new ones. Three states:
//   'hide'    the student turned "hide the timer" on: no clock, no countdown and
//             no per-question timer button (unchanged behaviour).
//   'show'    the student turned the timer back on after this change.
//   'default' no choice made since this change: the running clock is hidden, but
//             the per-question timer button stays, so a student can still pick a
//             timed session on purpose.
//
// dse_hide_timer is synced to the cloud (lib/settingsSync.ts). dse_timer_choice
// is local only and records that the student chose to show the clock on this
// device, so an old '0' (the previous default, or a synced value) no longer
// shows the clock by itself.

export const HIDE_TIMER_KEY = 'dse_hide_timer'
export const TIMER_CHOICE_KEY = 'dse_timer_choice'

export type TimerPref = 'hide' | 'show' | 'default'

export function readTimerPref(): TimerPref {
  try {
    if (localStorage.getItem(HIDE_TIMER_KEY) === '1') return 'hide'
    return localStorage.getItem(TIMER_CHOICE_KEY) === '1' ? 'show' : 'default'
  } catch {
    return 'default'
  }
}

/** Record an explicit choice. Callers dispatch the 'dse-a11y' event themselves. */
export function writeTimerHidden(hidden: boolean): void {
  try {
    localStorage.setItem(HIDE_TIMER_KEY, hidden ? '1' : '0')
    localStorage.setItem(TIMER_CHOICE_KEY, '1')
  } catch {
    /* storage blocked: the choice lasts for this page only */
  }
}
