// ============================================================================
// _card-gate.mjs —— SENSEI 知識卡片嘅客觀閘（review + promote 共用）
// ----------------------------------------------------------------------------
// 同 _gate.mjs 一樣嘅分工：機器只判客觀嘢（格式、欄位齊唔齊、長度、重複），
// 【永遠唔判斷內容學術上啱唔啱】—— 嗰樣係真人嘅事。
//
// ⚠️ 最要緊嗰條規則係 STRICT_KEYS：卡片物件【只准】有白名單入面嘅 key。
// 點解要白名單而唔係黑名單：黑名單擋得住 `score`，擋唔住將來有人叫佢
// `marks`／`grade`／`markingCriteria`／`bandScore`。白名單之下，
// 任何新欄位都要先改呢個檔、先過 review —— 憲章 §16.A 就守得住。
// ============================================================================

export const SUBJECTS = new Set(['chinese', 'english', 'math', 'economics'])
export const DIFFICULTIES = new Set(['basic', 'intermediate', 'hard'])
export const SOURCES = new Set(['syllabus', 'original', 'concept'])

/** 卡片草稿唯一合法嘅 key。多一個都會被攔。 */
export const STRICT_KEYS = new Set([
  'id', 'subject', 'topic', 'subTopic', 'difficulty', 'source',
  'concept', 'example', 'examTechnique', 'commonTrap',
  'conceptEn', 'exampleEn', 'examTechniqueEn', 'commonTrapEn',
  'keywords', 'relatedTopics',
])

const SECTIONS = ['concept', 'example', 'examTechnique', 'commonTrap']
const MIN_LEN = 10
const MAX_LEN = 300

const isStr = (v) => typeof v === 'string' && v.trim().length > 0

/** 正規化，用嚟捉重複概念（唔同標點／空白但實質一樣）。 */
export const normCard = (s) => String(s || '').replace(/\s+/g, '').replace(/[，。、；：！？,.;:!?]/g, '')

/**
 * @returns {string[]} 錯誤列表，空陣列 = 過閘
 */
export function gateCard(card, expectedSubject) {
  const errs = []
  if (!card || typeof card !== 'object' || Array.isArray(card)) return ['not an object']

  // ① strict schema —— 呢條係擋分數欄位嘅結構性防線
  for (const k of Object.keys(card)) {
    if (!STRICT_KEYS.has(k)) errs.push(`unknown field "${k}" — 卡片唔可以有白名單以外嘅欄位（見 _card-gate.mjs STRICT_KEYS）`)
  }

  if (!isStr(card.id)) errs.push('missing id')
  else if (!/^[a-z0-9-]+$/.test(card.id)) errs.push(`id "${card.id}" 只准 a-z 0-9 同 -`)

  if (card.subject !== expectedSubject) errs.push(`subject "${card.subject}" ≠ "${expectedSubject}"`)
  if (!SUBJECTS.has(card.subject)) errs.push(`subject "${card.subject}" 唔喺 SENSEI 首批四科`)
  if (!DIFFICULTIES.has(card.difficulty)) errs.push(`difficulty "${card.difficulty}" 無效`)
  if (!SOURCES.has(card.source)) errs.push(`source "${card.source}" 無效`)
  if (!isStr(card.topic)) errs.push('missing topic')

  // ② 四段式必須齊全
  for (const sec of SECTIONS) {
    const v = card[sec]
    if (!isStr(v)) { errs.push(`missing 【${sec}】`); continue }
    const n = v.trim().length
    if (n < MIN_LEN) errs.push(`${sec} 太短（${n} < ${MIN_LEN}）`)
    if (n > MAX_LEN) errs.push(`${sec} 太長（${n} > ${MAX_LEN}）—— 一次對話一個概念，防資訊過載`)
  }

  // ③ 檢索關鍵詞
  if (!Array.isArray(card.keywords) || card.keywords.length === 0) errs.push('keywords 唔可以空 —— 冇關鍵詞就永遠檢索唔到呢張卡')
  else if (!card.keywords.every(isStr)) errs.push('keywords 要全部係非空字串')

  if (card.relatedTopics !== undefined && !Array.isArray(card.relatedTopics)) errs.push('relatedTopics 要係陣列')
  if (card.subTopic !== undefined && !isStr(card.subTopic)) errs.push('subTopic 要係非空字串')

  return errs
}

/** promote 時將草稿加上簽名，欄位順序固定，方便 diff。 */
export function toSignedCard(draft, reviewer, reviewedAt) {
  const out = {}
  for (const k of STRICT_KEYS) if (draft[k] !== undefined) out[k] = draft[k]
  out.reviewer = reviewer
  out.reviewedAt = reviewedAt
  return out
}
