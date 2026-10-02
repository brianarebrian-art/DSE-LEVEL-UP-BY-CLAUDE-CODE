// audit loop T39 (2026-10-02): the note beside the sign-in buttons quotes the consent
// form and counts the synced keys, so it cannot drift from the privacy policy.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (p: string) => readFileSync(p, 'utf8')
type Mod = { CLOUD_COUNT: number; CLOUD_PROGRESS_KEYS: readonly string[]; CLOUD_SETTINGS_KEYS: readonly string[] }
const raw = (await import('../cloudKeys.ts')) as Mod & { default?: Mod }
const K = raw.default ?? raw

test('the note quotes the consent form and the shared key count, never its own list', () => {
  const s = read('components/SignInNote.tsx')
  assert.match(s, /const what = CONSENT_POINTS\[0\]\.a/)
  assert.match(s, /CLOUD_COUNT/)
  assert.match(s, /href="\/privacy"/)
  assert.match(s, /href="\/account"/)
  assert.equal(K.CLOUD_COUNT, K.CLOUD_PROGRESS_KEYS.length + K.CLOUD_SETTINGS_KEYS.length)
})

test('the note sits next to the sign-in buttons, not in a pop-up', () => {
  assert.match(read('components/Navbar.tsx'), /<AuthButton onAction=\{\(\) => setOpen\(false\)\} \/>\n\s*<\/div>\n\s*<SignInNote/)
  assert.match(read('components/SyncStatus.tsx'), /<SignInNote className="basis-full" \/>/)
  assert.doesNotMatch(read('components/SignInNote.tsx'), /role="dialog"|createPortal/)
})
