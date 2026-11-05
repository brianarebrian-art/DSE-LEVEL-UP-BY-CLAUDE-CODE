// Inclusive lexicon for student-facing free text (email compose / future UI).
// Used client-side for warnings only — report API still never stores free text (§16.E).
//
// Blocklist: clear slurs / abusive variants (incl. romanisation + mixed script).
// Allowlist: educational / identity phrases that must NOT be blocked (共融).

const NORMALIZE = (s: string) =>
  s
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

/** Phrases that must pass even if they share characters with blocked tokens. */
export const INCLUSIVE_ALLOWLIST = [
  '失敗率',
  '放下執念',
  '同志',
  '黑板',
  'failure rate',
  'let go',
] as const

/**
 * Abusive variants — keep short; match as substrings after normalize.
 * Includes Jyutping-ish and mixed forms from the v5.0 checklist.
 */
export const INCLUSIVE_BLOCKLIST = [
  '肥老',
  '衰l',
  'fei lou',
  'feilou',
  'hak gwai',
  'hakgwai',
  '黑鬼',
] as const

export type InclusiveScan = {
  blocked: string[]
  /** True when text is OK to send (no block hits outside allowlist spans). */
  ok: boolean
}

/**
 * Scan free text. Allowlisted phrases are masked before block matching so
 * 「同志」／「黑板」等唔會誤殺。
 */
export function scanInclusiveText(raw: string): InclusiveScan {
  let masked = NORMALIZE(raw)
  for (const allow of INCLUSIVE_ALLOWLIST) {
    const a = NORMALIZE(allow)
    if (!a) continue
    masked = masked.split(a).join(' '.repeat(a.length))
  }
  const blocked: string[] = []
  for (const bad of INCLUSIVE_BLOCKLIST) {
    const b = NORMALIZE(bad)
    if (b && masked.includes(b)) blocked.push(bad)
  }
  return { blocked, ok: blocked.length === 0 }
}

export function inclusiveWarningZh(blocked: string[]): string {
  if (!blocked.length) return ''
  return '呢段描述可能含有唔尊重人嘅字眼。請改寫後再用電郵寄出；「送出」只傳題號同問題類別，唔受影響。'
}

export function inclusiveWarningEn(blocked: string[]): string {
  if (!blocked.length) return ''
  return 'That note may include disrespectful language. Please rephrase before emailing. Send (category only) is unaffected.'
}
