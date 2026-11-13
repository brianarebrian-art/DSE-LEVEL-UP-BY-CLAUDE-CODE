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
  emergency_room: { zh: '溫習支援', en: 'Study support' },
  accessibility: { zh: '無障礙', en: 'Accessibility' },
}

export const A11Y_LABEL: Record<A11yId, { zh: string; en: string }> = {
  contrast: { zh: '對比', en: 'Contrast' },
  keyboard: { zh: '鍵盤', en: 'Keyboard' },
  screen_reader: { zh: '螢幕閱讀器', en: 'Screen reader' },
  reduced_motion: { zh: '減少動態', en: 'Reduced motion' },
}

// Comfort and word-of-mouth. Every item is optional. Values are scenario ids,
// never 1–5 scores or star ratings. The storage key `emergency_room` stays so
// older rows still mean the same feature; only the visible name changed.
export const COMFORT_DURING_IDS = ['at_ease', 'neutral', 'rushed', 'close_page'] as const
export type ComfortDuring = (typeof COMFORT_DURING_IDS)[number]

export const COMFORT_AFTER_IDS = ['useful_next', 'no_feeling', 'uncomfortable_labelled', 'skip_explanation'] as const
export type ComfortAfter = (typeof COMFORT_AFTER_IDS)[number]

export const WOM_RECOMMEND_IDS = ['volunteer', 'if_asked', 'would_not', 'unsure'] as const
export type WomRecommend = (typeof WOM_RECOMMEND_IDS)[number]

export const WOM_DESCRIBE_IDS = [
  'free_no_login',
  'logic_over_memory',
  'gentler_mood',
  'quality_worry',
  'messy_ui',
  'other',
] as const
export type WomDescribe = (typeof WOM_DESCRIBE_IDS)[number]

type Copy = { zh: string; en: string }

export const COMFORT_HEADING: Copy = { zh: '舒服唔舒服', en: 'How it felt' }
export const COMFORT_DURING_QUESTION: Copy = {
  zh: '答緊題／睇完結果嗰陣，你多啲係？（單選）',
  en: 'While answering, or just after a result, which is closer? (one choice)',
}
export const COMFORT_AFTER_QUESTION: Copy = {
  zh: '答錯之後，頁面令你覺得？（可多選）',
  en: 'After a wrong answer, the page makes you feel…? (more than one is fine)',
}
export const COMFORT_NOTE_LABEL: Copy = {
  zh: '有冇一句文案／畫面令你特別安心，或者特別想走？貼關鍵字都得。',
  en: 'Was there a line, or a screen, that made you feel especially at ease, or especially want to leave? A keyword is enough.',
}
export const COMFORT_DURING_LABEL: Record<ComfortDuring, Copy> = {
  at_ease: { zh: '幾放鬆，繼續得', en: 'Mostly at ease, I can continue' },
  neutral: { zh: '普通', en: 'Neutral' },
  rushed: { zh: '有少少趕／緊張', en: 'A bit rushed or tense' },
  close_page: { zh: '好想關頁', en: 'I want to close the page' },
}
export const COMFORT_AFTER_LABEL: Record<ComfortAfter, Copy> = {
  useful_next: { zh: '有用，知下一步', en: 'Useful, I know the next step' },
  no_feeling: { zh: '無感覺', en: 'No particular feeling' },
  uncomfortable_labelled: { zh: '有少少唔舒服（好似被標籤）', en: 'A bit uncomfortable (as if labelled)' },
  skip_explanation: { zh: '好想唔睇解析直接下一題', en: 'I want to skip the explanation and go on' },
}

export const WOM_HEADING: Copy = { zh: '口碑', en: 'Telling a classmate' }
export const WOM_RECOMMEND_QUESTION: Copy = {
  zh: '如果同學問「有冇免費溫習網站」，你會？（單選）',
  en: 'If a classmate asked “know any free revision sites?”, you would…? (one choice)',
}
export const WOM_DESCRIBE_QUESTION: Copy = {
  zh: '你會點向朋友形容佢？（可多選）',
  en: 'How would you describe it to a friend? (more than one is fine)',
}
export const WOM_OTHER_LABEL: Copy = { zh: '其他（可以留空）', en: 'Other (optional)' }
export const WOM_CHANGE_LABEL: Copy = {
  zh: '如果只改一樣會令你更想返嚟，會係咩？',
  en: 'If changing one thing would make you more likely to come back, what would it be?',
}
export const WOM_RECOMMEND_LABEL: Record<WomRecommend, Copy> = {
  volunteer: { zh: '會主動提 DSE Level Up', en: 'Mention DSE Level Up without being asked' },
  if_asked: { zh: '問到先講', en: 'Only if they ask' },
  would_not: { zh: '唔會提', en: 'I would not mention it' },
  unsure: { zh: '唔肯定', en: 'Not sure' },
}
export const WOM_DESCRIBE_LABEL: Record<WomDescribe, Copy> = {
  free_no_login: { zh: '免費又唔迫登入', en: 'Free, and it does not push you to sign in' },
  logic_over_memory: { zh: '拆邏輯多過背答案', en: 'It unpacks the logic more than memorising answers' },
  gentler_mood: { zh: '氣氛溫和啲', en: 'The atmosphere is gentler' },
  quality_worry: { zh: '題目質素一般／擔心唔準', en: 'Question quality is average, or I worry it is not accurate' },
  messy_ui: { zh: '介面有啲亂', en: 'The interface is a bit messy' },
  other: { zh: '其他（可填）', en: 'Other (you can write it)' },
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
    note: string
  }
  comfort: {
    during?: ComfortDuring
    after_wrong: ComfortAfter[]
    note: string
  }
  word_of_mouth: {
    recommend?: WomRecommend
    describe: WomDescribe[]
    other?: string
    change: string
  }
  aha: {
    had_moment: boolean
    text: string
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

function pickMany<T extends string>(
  value: unknown,
  allowed: readonly T[],
): { ok: true; value: T[] } | { ok: false; error: 'invalid choice' } {
  if (value == null) return { ok: true, value: [] }
  if (!Array.isArray(value)) return { ok: false, error: 'invalid choice' }
  const out: T[] = []
  for (const item of value) {
    if (typeof item !== 'string' || !(allowed as readonly string[]).includes(item)) {
      return { ok: false, error: 'invalid choice' }
    }
    if (!out.includes(item as T)) out.push(item as T)
  }
  return { ok: true, value: out }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

/** Keep only the allowed scenario fields. Reject numeric ratings. An empty form is valid. */
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
  let note = ''
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
    note = cleaned.text ?? ''
  }

  const comfortIn = stripped.comfort
  let during: ComfortDuring | undefined
  let afterWrong: ComfortAfter[] = []
  let comfortNote = ''
  if (comfortIn != null) {
    if (!isRecord(comfortIn)) return { ok: false, error: 'invalid body' }
    const pickedDuring = pick(comfortIn.during, COMFORT_DURING_IDS)
    if (!pickedDuring.ok) return pickedDuring
    during = pickedDuring.value
    const pickedAfter = pickMany(comfortIn.after_wrong, COMFORT_AFTER_IDS)
    if (!pickedAfter.ok) return pickedAfter
    afterWrong = pickedAfter.value
    const cleaned = cleanText(comfortIn.note)
    if (!cleaned.ok) return cleaned
    comfortNote = cleaned.text ?? ''
  }

  const womIn = stripped.word_of_mouth
  let recommend: WomRecommend | undefined
  let describe: WomDescribe[] = []
  let other: string | undefined
  let change = ''
  if (womIn != null) {
    if (!isRecord(womIn)) return { ok: false, error: 'invalid body' }
    const pickedRecommend = pick(womIn.recommend, WOM_RECOMMEND_IDS)
    if (!pickedRecommend.ok) return pickedRecommend
    recommend = pickedRecommend.value
    const pickedDescribe = pickMany(womIn.describe, WOM_DESCRIBE_IDS)
    if (!pickedDescribe.ok) return pickedDescribe
    describe = pickedDescribe.value
    const cleanedOther = cleanText(womIn.other)
    if (!cleanedOther.ok) return cleanedOther
    if (describe.includes('other') && cleanedOther.text) other = cleanedOther.text
    const cleanedChange = cleanText(womIn.change)
    if (!cleanedChange.ok) return cleanedChange
    change = cleanedChange.text ?? ''
  }

  const ahaIn = stripped.aha
  let hadMoment = false
  let ahaText = ''
  if (ahaIn != null) {
    if (!isRecord(ahaIn)) return { ok: false, error: 'invalid body' }
    if (ahaIn.had_moment != null && typeof ahaIn.had_moment !== 'boolean') {
      return { ok: false, error: 'invalid choice' }
    }
    hadMoment = ahaIn.had_moment === true
    const cleaned = cleanText(ahaIn.text)
    if (!cleaned.ok) return cleaned
    ahaText = cleaned.text ?? ''
  }

  let locale: 'zh' | 'en' | undefined
  if (stripped.locale != null) {
    if (stripped.locale !== 'zh' && stripped.locale !== 'en') return { ok: false, error: 'invalid choice' }
    locale = stripped.locale
  }

  const value: GeneralFeedbackPayload = {
    version: 1,
    features,
    accessibility: { answers, note },
    comfort: during ? { during, after_wrong: afterWrong, note: comfortNote } : { after_wrong: afterWrong, note: comfortNote },
    word_of_mouth: {
      ...(recommend ? { recommend } : {}),
      describe,
      ...(other ? { other } : {}),
      change,
    },
    aha: { had_moment: hadMoment, text: ahaText },
  }
  if (locale) value.locale = locale
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
  if (payload.comfort.during) lines.push(COMFORT_DURING_LABEL[payload.comfort.during][zh ? 'zh' : 'en'])
  for (const id of payload.comfort.after_wrong) lines.push(COMFORT_AFTER_LABEL[id][zh ? 'zh' : 'en'])
  if (payload.comfort.note) lines.push(payload.comfort.note)
  if (payload.word_of_mouth.recommend) lines.push(WOM_RECOMMEND_LABEL[payload.word_of_mouth.recommend][zh ? 'zh' : 'en'])
  for (const id of payload.word_of_mouth.describe) {
    if (id === 'other') continue
    lines.push(WOM_DESCRIBE_LABEL[id][zh ? 'zh' : 'en'])
  }
  if (payload.word_of_mouth.other) lines.push(payload.word_of_mouth.other)
  if (payload.word_of_mouth.change) lines.push(payload.word_of_mouth.change)
  if (payload.aha.had_moment) lines.push(zh ? '我有過「原來係咁」嘅瞬間' : 'I had an “oh, so that’s how” moment')
  if (payload.aha.text) lines.push(payload.aha.text)
  if (payload.accessibility.note) lines.push(payload.accessibility.note)
  return {
    title: zh ? '一句冇分數嘅話' : 'A note with no score',
    text: lines.length
      ? joinLines(lines, zh ? 'zh' : 'en')
      : zh
        ? '呢張卡留空。可以關閉呢頁。'
        : 'This card was left blank. You can close the page.',
  }
}
