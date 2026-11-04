// macOS desktop notification via osascript. No-op on non-Darwin.
import { spawnSync } from 'node:child_process'
import { platform } from 'node:os'

function escapeAppleScript(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

export function notifyMac({ title, body }) {
  if (platform() !== 'darwin') {
    return { ok: false, reason: 'not-darwin' }
  }
  const script = `display notification "${escapeAppleScript(body)}" with title "${escapeAppleScript(title)}" sound name "Sosumi"`
  const r = spawnSync('osascript', ['-e', script], { encoding: 'utf8' })
  if (r.status !== 0) {
    return { ok: false, reason: (r.stderr || r.stdout || 'osascript failed').trim() }
  }
  return { ok: true }
}

export function speakMac(text) {
  if (platform() !== 'darwin') return { ok: false, reason: 'not-darwin' }
  const r = spawnSync('say', ['-v', 'Sinji', String(text).slice(0, 140)], {
    encoding: 'utf8',
  })
  // Fall back to default voice if Sinji missing
  if (r.status !== 0) {
    spawnSync('say', [String(text).slice(0, 140)], { encoding: 'utf8' })
  }
  return { ok: true }
}
