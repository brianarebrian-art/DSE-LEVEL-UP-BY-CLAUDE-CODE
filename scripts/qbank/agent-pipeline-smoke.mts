// Agentic Harness v5 · Phase 6 — 集成 smoke（$0，零付費生成）
//
// 目的：證明「Evaluator → drafts」流水線可行，而【唔使真跑付費 LLM】。
//   1. 幾條【原創】樣本題（Archetype Masking：原創數字／情境，非任何真卷）。
//   2. 過 lib/agents/evaluator（Phase 3 守門引擎，複用真規則）。
//   3. PASS 嘅先寫入 scripts/qbank/drafts/agent-smoke.json（draft on-disk 格式）。
//   4. 生產紀律：寫入 drafts/ ≠ 入庫；仍須 review-drafts.mjs → 人手 → promote-drafts.mjs。
//
// ⚠️ 兩個誠實 flag：
//  (a) 欄位映射：Evaluator 用 content / difficulty(easy|medium|hard)；draft on-disk 用
//      `question` / difficulty(basic|intermediate|hard)。writer 負責映射。
//  (b) 載入方式：本 repo 無 "type":"module"，.ts 喺 tsx 下當 CJS；.mts(ESM) 直接
//      named-import 一個 .ts 會 interop 失敗，故用 createRequire 載入（複用真 evaluator，唔重造）。
//
// 執行：npx --yes tsx@4.19.2 scripts/qbank/agent-pipeline-smoke.mts

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

interface SampleDraft {
  subject: string
  topic: string
  topicZh?: string
  topicEn?: string
  difficulty: 'easy' | 'medium' | 'hard'
  content: string
  contentEn?: string
  options: string[]
  optionsEn?: string[]
  correctIndex: number
  explanation: string
  explanationEn?: string
  marks?: number
}

const require = createRequire(import.meta.url)
const { evaluateQuestion } = require('../../lib/agents/evaluator.ts') as {
  evaluateQuestion: (d: SampleDraft) => { verdict: 'PASS' | 'REVISE' | 'BLOCK'; score: number; feedback: string }
}

// ── 原創樣本（親自撰寫，非任何 HKEAA 官方試題；純作流水線示範）──────────────
const samples: SampleDraft[] = [
  {
    subject: 'economics',
    topic: 'opportunity-cost',
    topicZh: '機會成本',
    topicEn: 'Opportunity Cost',
    difficulty: 'easy',
    content:
      '小晴收到 80 元利是。她可選擇購買一本溫習筆記（售價 50 元），或與朋友觀看一場電影（票價 80 元）。若她最終選擇觀看電影，則此選擇的機會成本最接近下列何者？',
    contentEn:
      'Ching receives $80. She can either buy study notes ($50) or watch a movie ($80). If she chooses the movie, which best describes the opportunity cost of that choice?',
    options: ['放棄了的那本溫習筆記', '電影票的 80 元', '手上的 80 元現金', '沒有任何機會成本'],
    optionsEn: ['The study notes forgone', 'The $80 ticket', 'The $80 cash in hand', 'There is no opportunity cost'],
    correctIndex: 0,
    explanation:
      '機會成本指作出選擇時所放棄的、價值最高的替代選項。小晴選擇觀看電影，所放棄的最佳替代選項是那本溫習筆記，因此機會成本最接近溫習筆記本身；電影票的金額屬直接支出，並非機會成本。',
    explanationEn:
      'Opportunity cost is the value of the best alternative forgone. Choosing the movie means giving up the notes, so the opportunity cost is the notes; the ticket price is a direct outlay, not the opportunity cost.',
    marks: 1,
  },
  {
    // 反例：故意含術語紅線「公共財」，證明 Evaluator 會 BLOCK（唔會寫入 drafts）
    subject: 'economics',
    topic: 'goods-types',
    topicZh: '物品分類',
    difficulty: 'easy',
    content: '下列何者最能描述「公共財」的非競爭性特徵？',
    options: ['一人消費會減少他人可用量', '一人消費不減少他人可用量', '可以輕易排他', '必然由私人提供'],
    correctIndex: 1,
    explanation: '此樣本故意使用被禁術語「公共財」（應為「共用品」），預期會被術語紅線 BLOCK，示範守門機制。',
    marks: 1,
  },
]

const DIFF_MAP: Record<string, string> = { easy: 'basic', medium: 'intermediate', hard: 'hard' }

function toDraft(d: SampleDraft, i: number) {
  return {
    id: `agent-smoke-${d.subject}-${i + 1}`,
    type: 'mc' as const,
    subject: d.subject,
    topic: d.topicZh ?? d.topic,
    difficulty: DIFF_MAP[d.difficulty] ?? 'basic',
    question: d.content,
    options: d.options,
    correctIndex: d.correctIndex,
    explanation: d.explanation,
    _agentMeta: {
      status: 'draft' as const,
      pending_human_review: true,
      archetype_masking: true,
      ref_years: [2023, 2024, 2025],
      frequency: 'High' as const,
      trap_level: 2,
      bilingual: !!d.contentEn && !!d.optionsEn && !!d.explanationEn,
      source: 'agentic-harness-v5-smoke',
    },
  }
}

const passed: ReturnType<typeof toDraft>[] = []
console.log('── Agentic Harness v5 · Phase 6 smoke（$0，零付費生成）──\n')
samples.forEach((s, i) => {
  const r = evaluateQuestion(s)
  console.log(`樣本 ${i + 1} [${s.subject}/${s.topic}] → ${r.verdict}（score ${r.score}）`)
  if (r.verdict !== 'PASS') console.log('   ' + r.feedback.replace(/\n/g, '\n   '))
  if (r.verdict === 'PASS') passed.push(toDraft(s, i))
})

const outPath = fileURLToPath(new URL('./drafts/agent-smoke.json', import.meta.url))
writeFileSync(outPath, JSON.stringify(passed, null, 2) + '\n', 'utf8')
console.log(`\n✅ ${passed.length} 題 PASS → 寫入 scripts/qbank/drafts/agent-smoke.json`)
console.log('   （生產紀律：drafts ≠ 入庫；下一步 review-drafts.mjs → 人手逐題批 → promote-drafts.mjs）')
