// Anonymous product feedback for /feedback → general_feedback.payload.
//
// Stored shape is only scenario choices plus optional short notes the student
// chose to send. No account, email, IP, cookie or auth header is read or kept.
// Identity keys are dropped if a client sends them. Free-text emails are removed
// before insert so an address typed into a note is not stored.

export const FEATURE_IDS = [
  'just_one_card',
  'error_analysis',
  'focus_light',
  'quiet_mode',
  'emergency_room',
  'accessibility',
] as const
export type FeatureId = (typeof FEATURE_IDS)[number]

export const FEATURE_CHOICES = ['not_tried', 'helped_a_bit', 'very_useful', 'not_for_me'] as const
export type FeatureChoice = (typeof FEATURE_CHOICES)[number]

export const A11Y_IDS = ['contrast', 'keyboard', 'screen_reader', 'reduced_motion'] as const
export type A11yId = (typeof A11Y_IDS)[number]

export const A11Y_CHOICES = ['not_tried', 'comfortable', 'some_friction', 'not_for_me'] as const
export type A11yChoice = (typeof A11Y_CHOICES)[number]

export const TEXT_MAX = 400

export const FEATURE_LABEL: Record<FeatureId, { zh: string; en: string }> = {
  just_one_card: { zh: '只做一題', en: 'Just one card' },
  error_analysis: { zh: '錯因分析', en: 'Error analysis' },
  focus_light: { zh: 'Focus 專注燈', en: 'Focus light' },
  quiet_mode: { zh: '安靜模式', en: 'Quiet mode' },
  emergency_room: { zh: '考試急症室', en: 'Exam-day calm space' },
  accessibility: { zh: '無障礙', en: 'Accessibility' },
}

export const A11Y_LABEL: Record<A11yId, { zh: string; en: string }> = {
  contrast: { zh: '對比', en: 'Contrast' },
  keyboard: { zh: '鍵盤', en: 'Keyboard' },
  screen_reader: { zh: '螢幕閱讀器', en: 'Screen reader' },
  reduced_motion: { zh: '減少動態', en: 'Reduced motion' },
}

const IDENTITY_KEYS = new Set([
  'userid',
  'uid',
  'sub',
  'email',
  'emailaddress',
  'ip',
  'ipaddress',
  'cookie',
  'cookies',
  'authorization',
  'auth',
  'useragent',
  'phone',
  'phonenumber',
  'session',
  'sessionid',
  'token',
  'password',
  'name',
  'firstname',
  'lastname',
  'fullname',
])

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g

export interface GeneralFeedbackPayload {
  version: 1
  features: Partial<Record<FeatureId, FeatureChoice>>
  accessibility: {
    answers: Partial<Record<A11yId, A11yChoice>>
    note?: string
  }
  aha: {
    had_moment: boolean
    text?: string
  }
  locale?: 'zh' | 'en'
}

export type ParseFeedbackError = 'invalid body' | 'invalid choice' | 'too long' | 'empty'

function normKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/** Drop identity keys at every object level. Strings are left for the text cleaner. */
export function stripIdentity(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripIdentity)
  if (!value || typeof value !== 'object') return value
  const out: Record<string, unknown> = {}
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if (IDENTITY_KEYS.has(normKey(key))) continue
    out[key] = stripIdentity(child)
  }
  return out
}

function cleanText(value: unknown): { ok: true; text?: string } | { ok: false; error: 'too long' | 'invalid choice' } {
  if (value == null || value === '') return { ok: true }
  if (typeof value !== 'string') return { ok: false, error: 'invalid choice' }
  const text = value.replace(EMAIL, ' ').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replace(/[ \t]{2,}/g, ' ').trim()
  if (!text) return { ok: true }
  if ([...text].length > TEXT_MAX) return { ok: false, error: 'too long' }
  return { ok: true, text }
}

function pick<T extends string>(
  value: unknown,
  allowed: readonly T[],
): { ok: true; value?: T } | { ok: false; error: 'invalid choice' } {
  if (value == null || value === '') return { ok: true }
  if (typeof value !== 'string' || !(allowed as readonly string[]).includes(value)) {
    return { ok: false, error: 'invalid choice' }
  }
  return { ok: true, value: value as T }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

/** Keep only the allowed scenario fields. Reject numeric ratings and empty forms. */
export function parseGeneralFeedback(
  body: unknown,
): { ok: true; value: GeneralFeedbackPayload } | { ok: false; error: ParseFeedbackError } {
  const stripped = stripIdentity(body)
  if (!isRecord(stripped)) return { ok: false, error: 'invalid body' }

  const featuresIn = stripped.features
  const features: Partial<Record<FeatureId, FeatureChoice>> = {}
  if (featuresIn != null) {
    if (!isRecord(featuresIn)) return { ok: false, error: 'invalid body' }
    for (const id of FEATURE_IDS) {
      const picked = pick(featuresIn[id], FEATURE_CHOICES)
      if (!picked.ok) return picked
      if (picked.value) features[id] = picked.value
    }
  }

  const a11yIn = stripped.accessibility
  const answers: Partial<Record<A11yId, A11yChoice>> = {}
  let note: string | undefined
  if (a11yIn != null) {
    if (!isRecord(a11yIn)) return { ok: false, error: 'invalid body' }
    const rawAnswers = isRecord(a11yIn.answers) ? a11yIn.answers : a11yIn
    for (const id of A11Y_IDS) {
      const picked = pick(rawAnswers[id], A11Y_CHOICES)
      if (!picked.ok) return picked
      if (picked.value) answers[id] = picked.value
    }
    const cleaned = cleanText(a11yIn.note)
    if (!cleaned.ok) return cleaned
    note = cleaned.text
  }

  const ahaIn = stripped.aha
  let hadMoment = false
  let ahaText: string | undefined
  if (ahaIn != null) {
    if (!isRecord(ahaIn)) return { ok: false, error: 'invalid body' }
    if (ahaIn.had_moment != null && typeof ahaIn.had_moment !== 'boolean') {
      return { ok: false, error: 'invalid choice' }
    }
    hadMoment = ahaIn.had_moment === true
    const cleaned = cleanText(ahaIn.text)
    if (!cleaned.ok) return cleaned
    ahaText = cleaned.text
  }

  let locale: 'zh' | 'en' | undefined
  if (stripped.locale != null) {
    if (stripped.locale !== 'zh' && stripped.locale !== 'en') return { ok: false, error: 'invalid choice' }
    locale = stripped.locale
  }

  const value: GeneralFeedbackPayload = {
    version: 1,
    features,
    accessibility: note ? { answers, note } : { answers },
    aha: ahaText ? { had_moment: hadMoment, text: ahaText } : { had_moment: hadMoment },
  }
  if (locale) value.locale = locale

  const hasSignal =
    Object.keys(features).length > 0 ||
    Object.keys(answers).length > 0 ||
    !!note ||
    hadMoment ||
    !!ahaText
  if (!hasSignal) return { ok: false, error: 'empty' }
  return { ok: true, value }
}

function joinLines(lines: string[], locale: 'zh' | 'en'): string {
  if (locale === 'en') {
    return lines
      .map((line) => line.replace(/[.。]\s*$/, ''))
      .join('. ')
      .concat('.')
  }
  return lines.map((line) => line.replace(/[。．]\s*$/, '')).join('。') + '。'
}

/** Short anonymous reflection for the on-page card. No points, grades, or star counts. */
export function reflectionCard(payload: GeneralFeedbackPayload, locale: 'zh' | 'en'): { title: string; text: string } {
  const zh = locale !== 'en'
  const lines: string[] = []
  const notTried: string[] = []
  const a11yNotTried: string[] = []
  for (const id of FEATURE_IDS) {
    const choice = payload.features[id]
    if (!choice) continue
    const name = FEATURE_LABEL[id][zh ? 'zh' : 'en']
    if (choice === 'not_tried') notTried.push(name)
    if (choice === 'very_useful') lines.push(zh ? `${name}對我好有用` : `${name} was really useful for me`)
    if (choice === 'helped_a_bit') lines.push(zh ? `${name}有少少幫助` : `${name} helped a little`)
    if (choice === 'not_for_me') lines.push(zh ? `${name}暫時唔係我嘅方式` : `${name} is not my way right now`)
  }
  if (notTried.length) {
    lines.push(zh ? `未試過：${notTried.join('、')}` : `Not tried yet: ${notTried.join(', ')}`)
  }
  for (const id of A11Y_IDS) {
    const choice = payload.accessibility.answers[id]
    if (!choice) continue
    const name = A11Y_LABEL[id][zh ? 'zh' : 'en']
    if (choice === 'not_tried') a11yNotTried.push(name)
    if (choice === 'comfortable') lines.push(zh ? `${name}用得順` : `${name} felt comfortable`)
    if (choice === 'some_friction') lines.push(zh ? `${name}有啲阻滯` : `${name} had some friction`)
    if (choice === 'not_for_me') lines.push(zh ? `${name}唔適用於我` : `${name} does not apply to me`)
  }
  if (a11yNotTried.length) {
    lines.push(zh ? `無障礙未試過：${a11yNotTried.join('、')}` : `Accessibility not tried: ${a11yNotTried.join(', ')}`)
  }
  if (payload.aha.had_moment) lines.push(zh ? '我有過「原來係咁」嘅瞬間' : 'I had an “oh, so that’s how” moment')
  if (payload.aha.text) lines.push(payload.aha.text)
  if (payload.accessibility.note) lines.push(payload.accessibility.note)
  return {
    title: zh ? '一句冇分數嘅話' : 'A note with no score',
    text: lines.length
      ? joinLines(lines, zh ? 'zh' : 'en')
      : zh
        ? '我路過講咗少少感覺。'
        : 'I stopped by and said a little about how it felt.',
  }
}
