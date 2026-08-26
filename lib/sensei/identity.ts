// ============================================================================
// lib/sensei/identity.ts —— 憲章 §16.B：AI 身份誠實義務
// ----------------------------------------------------------------------------
// SENSEI 可以用師兄師姐語氣，但【被問及是否真人時必須如實回答】。
// 用戶群係 12–18 歲：一個中六生半夜三點同「師兄」傾偈，以為對面係真人嗰陣
// 投放嘅信任，同佢知道係 AI 完全唔同。
//
// 設計取態：【寧可多答，唔可以漏答】。
// 誤判成身份問題 → 學生多睇一句「我係 AI」，冇損失。
// 漏咗 → 直接違反 §16.B，而且係喺學生最想知嗰一刻扮傻。
// 所以下面啲 pattern 刻意鬆，唔追求精準。
// ============================================================================

/** 身份相關嘅主體詞。任何一個出現，就已經進入「可能問緊身份」嘅範圍。 */
const SUBJECT = /真人|真係人|人定機|係人定|人類|機械人|機器人|人工智能|人工智慧|\bA\.?I\.?\b|\bbot\b|\brobot\b|\bhuman\b|\breal person\b|\bchatbot\b|\blanguage model\b|\bgpt\b|大模型|語言模型/i

/** 疑問形式。中英文都要覆蓋，包括冇問號嘅口語問法。 */
const QUESTION = /咪|係唔係|是不是|是否|嗎[？?]?|呢[？?]|[？?]|\bare you\b|\bis this\b|\bwho are you\b|\bwhat are you\b|定係|定唔定/i

/**
 * 學生係咪喺度問 SENSEI 嘅身份。
 *
 * ⚠️ 呢個函數【唔可以】收窄到「精準」為止。漏一個問法 = 一次扮傻。
 */
/**
 * 直接問「你係乜嘢」嘅講法。呢類冇主體詞（唔會提「AI」「真人」），
 * 所以要獨立一條 —— 測試最初就係喺「what are you」呢句紅咗。
 */
const DIRECT = /\b(?:who|what)\s+are\s+you\b|你係邊個|你係乜(?:嘢|野)?|你是誰|你是什麼|你到底係乜/i

export function isIdentityQuestion(input: string): boolean {
  if (!input) return false
  const s = input.trim()
  if (!s) return false
  // 「你係咪AI」「你係人定機」呢類唔一定有問號，所以主體詞 + 第二人稱亦當問身份。
  if (DIRECT.test(s)) return true
  const secondPerson = /\b(you|your)\b|你|妳|sensei/i.test(s)
  if (!SUBJECT.test(s)) return false
  return QUESTION.test(s) || secondPerson
}

/**
 * 停火令核准嘅標準回答，逐字寫死。
 * 憲章 §16.B 記錄咗同一段文字 —— 兩邊唔一致會被測試捉到。
 */
export const IDENTITY_ANSWER = {
  zh: 'Sensei 係 DSE LEVEL UP 嘅 AI 學習助手，設計成師兄師姐嘅語氣陪你溫書。雖然 Sensei 唔係真人，但背後嘅知識同建議全部係由考過 DSE 嘅團隊審核過嘅。',
  en: 'Sensei is the AI study assistant of DSE LEVEL UP, written in the voice of a senior student to keep you company while you revise. Sensei is not a real person, but every piece of knowledge behind it has been reviewed by a team who has sat the DSE.',
} as const

/** 永遠顯示、唔遮得住嘅身份標示（§16.B 執行要求 1）。 */
export const AI_BADGE = {
  zh: 'AI 學習助手・內容由真人審核',
  en: 'AI study assistant · human-reviewed content',
} as const
