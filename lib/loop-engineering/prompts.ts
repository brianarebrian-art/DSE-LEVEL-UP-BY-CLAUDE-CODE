/**
 * 讀取已存放的審核提示與表格。正本在 docs/loop-engineering/prompts/。
 * 不要由學生頁面引入。提示正文含審核用語，不在此檔重複，以免被文案閘誤掃。
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { LOOP5_BLOCKED_LABEL_ZH } from './disclosure.ts'

const PROMPT_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../docs/loop-engineering/prompts')

export const PROMPT_FILES = {
  upgrade: 'upgrade.md',
  aiReview: 'ai-review.md',
  twoPersonReview: 'two-person-review.md',
  expertReviewFuture: 'expert-review-future.md',
  questionnaireBlocked: 'questionnaire-blocked.md',
} as const

export type PromptKey = keyof typeof PROMPT_FILES

export function loadStoredPrompt(key: PromptKey): string {
  return readFileSync(join(PROMPT_DIR, PROMPT_FILES[key]), 'utf8')
}

export function userTestQuestionnaireStatus(): {
  enabled: false
  label: typeof LOOP5_BLOCKED_LABEL_ZH
  mayDistribute: false
} {
  return { enabled: false, label: LOOP5_BLOCKED_LABEL_ZH, mayDistribute: false }
}
