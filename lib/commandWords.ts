// HKEAA command words ("except", "not", "must", 「除了」「並非」…), one source for
// both the highlight (components/CommandWordText.tsx) and cause-based practice
// (lib/causeMode.ts). Moved out of the component on 2026-09-26 (UX audit F1): a
// second copy of the word list would drift.
//
// English words use (?<![A-Za-z])…(?![A-Za-z]) so "not" does not match "note" or
// "cannot". Chinese has no word boundary, so negative look-arounds narrow it:
// 「消除了／根除了／廢除了」 are verb + 了, 「所有權」 is a legal noun and
// 「一定程度」 is an adverb of degree; none of them may light up.
//
// ⚠️ Only the source string is exported, never a /g RegExp object. RegExp#test on
// a /g regex is stateful (lastIndex moves on after each hit), so testing one
// shared regex in a loop over questions silently skips every other match.

const COMMAND_WORD_SOURCE =
  '((?<![A-Za-z])(?:except\\s+for|other\\s+than|apart\\s+from|except|not|must|always|only|never|all|none|best|most|least)(?![A-Za-z])|(?<![消根廢免解清剷刪])除了|並非|必須|一定(?!程度)|只有|永不|所有(?!權)|全無|最佳|最多|最少|除外|不包括|不正確|不屬於)' // i18n-exempt: command-word matching pattern (scans Chinese and English stems), not UI copy

/** A fresh global regex for String#split, which ignores lastIndex. One capture group. */
export function commandWordSplitter(): RegExp {
  return new RegExp(COMMAND_WORD_SOURCE, 'gi')
}

/** True when the text contains at least one command word. Stateless: safe in loops. */
export function hasCommandWord(text: string | undefined): boolean {
  return !!text && new RegExp(COMMAND_WORD_SOURCE, 'i').test(text)
}
