/**
 * Clear System · emoji ban (2026-10-30)
 * Strip emoji / pictograph code points from any string before it reaches the UI.
 * Prefer never putting emoji in source; this is a last-line defence for data fields.
 */

// Emoji & pictograph ranges (not misc technical symbols like ⌘).
const EMOJI_RE =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2B55}\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu

/** Dingbats / faux-emoji often pasted into UI copy. */
const DINGBAT_RE = /[⚠✅❌✓✔✖★☆☀☁⚡✨⭐🔥💡📌📍🌱🎓📚🧠💬🙌👏🎯🚀🔢📐⚗️🧬📝📖🕊🔄✍🔍🧮🔖🧭🫂🫁🎧🎹🌧🧘⏳🔇🌬👥📷📸🌙📘📄⏸▶►◀]/gu

export function stripEmoji(input: string): string {
  return input
    .replace(EMOJI_RE, '')
    .replace(DINGBAT_RE, '')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

export function containsEmoji(input: string): boolean {
  return EMOJI_RE.test(input) || DINGBAT_RE.test(input)
}
