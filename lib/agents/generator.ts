// Agentic Harness v5 · Phase 3 — Generator（編排引擎，$0；真正 LLM 生成係注入嘅付費接縫）
//
// ⚠️ $0 裂縫（誠實 flag）：真正嘅生成 = claude-opus-4-8 付費推理。本模組【唔喺度真跑】付費 API，
//    只做編排——收一個注入嘅 generateDraft()（由呼叫方決定用付費 LLM／人手／測試 stub），
//    行 Evaluator 迴圈（最多 3 次），PASS 先交出去。
// 生產紀律：PASS ≠ 自動發布；只代表「可入 drafts/ 等人工評審」。機器永不自動入庫。

import { evaluateQuestion, type MCDraft, type Verdict } from '@/lib/agents/evaluator'

export interface GenerateInput {
  subject: string
  topic: string
  difficulty: 'easy' | 'medium' | 'hard'
  refYears?: number[]
  // 注入嘅生成器：收上次 Evaluator feedback，回一個草稿。
  generateDraft: (ctx: { input: GenerateInput; attempt: number; feedback?: string }) => Promise<MCDraft>
  maxIterations?: number
}

export interface GenerateOutcome {
  verdict: Verdict | 'MAX_ITERATIONS'
  iterations: number
  draft?: MCDraft
  lastFeedback?: string
}

export async function generateWithReview(input: GenerateInput): Promise<GenerateOutcome> {
  const maxIter = input.maxIterations ?? 3
  let feedback: string | undefined
  let lastDraft: MCDraft | undefined

  for (let attempt = 1; attempt <= maxIter; attempt++) {
    const draft = await input.generateDraft({ input, attempt, feedback })
    lastDraft = draft
    const result = evaluateQuestion(draft)

    if (result.verdict === 'PASS') {
      return { verdict: 'PASS', iterations: attempt, draft }
    }
    if (result.verdict === 'BLOCK') {
      // 觸紅線：即停，唔再迭代（避免燒 token）。
      return { verdict: 'BLOCK', iterations: attempt, draft, lastFeedback: result.feedback }
    }
    feedback = result.feedback // REVISE：帶 feedback 再試
  }
  return { verdict: 'MAX_ITERATIONS', iterations: maxIter, draft: lastDraft, lastFeedback: feedback }
}
