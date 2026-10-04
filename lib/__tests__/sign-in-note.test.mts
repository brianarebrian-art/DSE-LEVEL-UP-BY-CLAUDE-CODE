// audit loop T39 (2026-10-02): the note beside the sign-in buttons quotes the consent
// form and counts the synced keys, so it cannot drift from the privacy policy.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (p: string) => readFileSync(p, 'utf8')
type Mod = { CLOUD_COUNT: number; CLOUD_PROGRESS_KEYS: readonly string[]; CLOUD_SETTINGS_KEYS: readonly string[] }
const raw = (await import('../cloudKeys.ts')) as Mod & { default?: Mod }
const K = raw.default ?? raw

// 2026-10-03 (Q-T39): the founders asked for a short note that says syncing is optional.
// The full list and the deletion steps live on the privacy page, which the note links.
test('the note is short, says syncing is optional, and links the privacy policy', () => {
  const s = read('components/SignInNote.tsx')
  assert.match(s, /可選同步進度：登入之後，換部機都接得返；唔登入一樣用得。/)
  assert.match(s, /href="\/privacy"/)
  assert.doesNotMatch(s, /\d+ 項/, 'no hand-written item count that could drift')
  assert.equal(K.CLOUD_COUNT, K.CLOUD_PROGRESS_KEYS.length + K.CLOUD_SETTINGS_KEYS.length)
})

test('after a session the result page offers optional sign-in (Q-T39)', () => {
  assert.match(read('app/result/ResultPageClient.tsx'), /<SignInNote withButton \/>/)
})

test('the note sits next to the sign-in buttons, not in a pop-up', () => {
  assert.match(read('components/Navbar.tsx'), /<AuthButton onAction=\{\(\) => setOpen\(false\)\} \/>\n\s*<\/div>\n\s*<SignInNote/)
  assert.match(read('components/SyncStatus.tsx'), /<SignInNote className="basis-full" \/>/)
  assert.doesNotMatch(read('components/SignInNote.tsx'), /role="dialog"|createPortal/)
})
