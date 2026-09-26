// Whether reading and display settings sync to the student's account.
//
// UX audit D1 (b+), Yuna 2026-09-21: explicit consent, off by default, for new
// accounts only. Together these settings (easy-read font, reading ruler, spacing,
// sensory preference ...) can suggest a reading difficulty, which is a health
// inference we should not hold without being asked.
//
//   'on'    sync. Set when the student turns it on, or automatically when the
//           account already had settings in the cloud before this change, so an
//           account that was syncing keeps syncing.
//   'off'   the student turned it off: no upload, and the cloud copy is deleted.
//   'unset' no choice yet and no cloud copy: a new account; nothing is uploaded.
//
// Local only; the consent itself is never sent anywhere.

export const SETTINGS_SYNC_KEY = 'dse_settings_sync'
export const SETTINGS_SYNC_EVENT = 'dse-settings-sync'

export type SyncConsent = 'on' | 'off' | 'unset'

export function readSyncConsent(): SyncConsent {
  try {
    const v = localStorage.getItem(SETTINGS_SYNC_KEY)
    return v === '1' ? 'on' : v === '0' ? 'off' : 'unset'
  } catch {
    return 'unset'
  }
}

/** The student's own choice, from the accessibility panel. */
export function setSyncConsent(on: boolean): void {
  try {
    localStorage.setItem(SETTINGS_SYNC_KEY, on ? '1' : '0')
  } catch {
    /* storage blocked: the choice lasts for this page only */
  }
  window.dispatchEvent(new Event(SETTINGS_SYNC_EVENT))
}

/** An account that already had cloud settings keeps syncing (no event: nothing changed). */
export function keepExistingSync(): void {
  try {
    localStorage.setItem(SETTINGS_SYNC_KEY, '1')
  } catch {
    /* ignore */
  }
}
