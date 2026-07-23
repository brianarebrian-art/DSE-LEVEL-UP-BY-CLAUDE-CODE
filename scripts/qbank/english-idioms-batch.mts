// Agentic Harness v5 · 英文科 — 原創詞彙運用題批次（$0，人手撰寫，過 Evaluator）
//
// 資料來源：使用者提供的「Charlene's Giveaway」英文參考（成語 idioms + 學術片語 practical phrases）。
// 合規：成語／學術片語屬【公共英文用語】，非版權內容。以下每題均為【原創情境】——
// 由本人撰寫全新例句，【不照抄】參考資料的例句；只借用公開成語／片語本身作為考核目標。
// 過 lib/agents/evaluator，PASS 先寫入 drafts/。生產紀律：drafts ≠ 入庫，仍須人手審。
//
// 執行：npx --yes tsx@4.19.2 scripts/qbank/english-idioms-batch.mts

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

interface Q {
  subject: string
  topic: string
  topicZh: string
  topicEn: string
  difficulty: 'easy' | 'medium' | 'hard'
  content: string
  options: string[]
  correctIndex: number
  explanation: string // 中文書面語解析（marker 級）
  explanationEn: string
  target: string // 考核目標詞彙（公開成語／片語）
}

const require = createRequire(import.meta.url)
const { evaluateQuestion } = require('../../lib/agents/evaluator.ts') as {
  evaluateQuestion: (d: {
    subject: string
    topic: string
    difficulty: 'easy' | 'medium' | 'hard'
    content: string
    contentEn?: string
    options: string[]
    optionsEn?: string[]
    correctIndex: number
    explanation: string
    explanationEn?: string
  }) => { verdict: 'PASS' | 'REVISE' | 'BLOCK'; score: number; feedback: string }
}

const bank: Q[] = [
  {
    subject: 'english',
    topic: 'idiom-in-context',
    topicZh: '成語語境理解',
    topicEn: 'Idiom in context',
    difficulty: 'easy',
    content:
      "Read the sentence: “Missing that flight turned out to be a blessing in disguise, because the delay let Priya meet her future business partner at the airport.” What does “a blessing in disguise” mean here?",
    options: [
      'A setback that unexpectedly leads to something good',
      'A gift that is wrapped and hidden',
      'A punishment that is well deserved',
      'A secret ceremony held at an airport',
    ],
    correctIndex: 0,
    explanation:
      '「A blessing in disguise（因禍得福）」指表面上不幸、其後卻帶來意想不到好處的事。句中「錯過航班」看似壞事，卻促成重要相遇，故選第一項。常見扣分陷阱：按字面把 blessing 理解為「禮物」或「祝福」，忽略 in disguise（偽裝／表面看不出）的轉折意味。',
    explanationEn:
      '“A blessing in disguise” means a setback that unexpectedly brings something good. Missing the flight looked bad but led to a key meeting, so the first option is correct. Common trap: reading “blessing” literally as a gift, ignoring “in disguise”.',
    target: 'a blessing in disguise',
  },
  {
    subject: 'english',
    topic: 'idiom-fit',
    topicZh: '成語填空（語境配對）',
    topicEn: 'Choosing the right idiom',
    difficulty: 'medium',
    content:
      'Which idiom best completes the sentence? “The complaints the company has received are only ___; many more customers are unhappy but have stayed silent.”',
    options: ['the tip of the iceberg', 'a double-edged sword', 'a blessing in disguise', 'water under the bridge'],
    correctIndex: 0,
    explanation:
      '「The tip of the iceberg（冰山一角）」指一個更大、隱藏問題中可見的一小部分。句意為「收到的投訴只是可見的一小部分，更多不滿被隱藏」，故選第一項。常見扣分陷阱：見到「problem」便選帶負面色彩的其他成語，忽略「可見一小部分 vs 隱藏大部分」這個核心語境。',
    explanationEn:
      '“The tip of the iceberg” is the small visible part of a much larger hidden problem. The complaints are the visible part; more dissatisfaction is hidden — so the first option fits. Trap: picking another negative idiom without matching the “small visible vs large hidden” context.',
    target: 'the tip of the iceberg',
  },
  {
    subject: 'english',
    topic: 'idiom-meaning',
    topicZh: '成語意義',
    topicEn: 'Idiom meaning',
    difficulty: 'easy',
    content:
      'When we say that smartphones are “a double-edged sword”, we mean that they ___.',
    options: [
      'bring clear benefits but also real drawbacks',
      'are physically sharp and dangerous',
      'should be banned from schools',
      'are only useful for two purposes',
    ],
    correctIndex: 0,
    explanation:
      '「A double-edged sword（雙刃劍／一體兩面）」比喻同一事物既有好處也有壞處。說智能電話是雙刃劍，即指它有明顯益處但同時帶來實在的弊端，故選第一項。常見扣分陷阱：把比喻當字面，理解為「鋒利危險」。',
    explanationEn:
      '“A double-edged sword” describes something with both advantages and disadvantages. Calling smartphones a double-edged sword means they bring benefits but also real drawbacks — the first option. Trap: taking the metaphor literally as “sharp and dangerous”.',
    target: 'a double-edged sword',
  },
  {
    subject: 'english',
    topic: 'academic-register-opener',
    topicZh: '學術語域（開首片語）',
    topicEn: 'Academic register (opening phrase)',
    difficulty: 'medium',
    content:
      'In a formal argumentative essay, which opening best introduces a widely held opinion in an appropriate academic register?',
    options: [
      'A prevailing view holds that remote work improves productivity.',
      'Everybody always says remote work is way better lol.',
      'I kinda think remote work is good, maybe.',
      'Remote work good, office bad, simple as that.',
    ],
    correctIndex: 0,
    explanation:
      '「A prevailing view holds that…（普遍看法認為……）」是正式、客觀地引入普遍觀點的學術片語，最合議論文語域。其餘選項分別過於口語（lol）、猶豫不定（kinda / maybe）或不完整不規範，皆不符正式書面語。常見扣分陷阱：只看內容對錯而忽略「語域是否正式」這個評分重點。',
    explanationEn:
      '“A prevailing view holds that…” formally and objectively introduces a common opinion, matching an academic register. The others are too colloquial, hesitant, or ungrammatical. Trap: judging only the content, not the required formal register.',
    target: 'A prevailing view holds that …',
  },
  {
    subject: 'english',
    topic: 'phrase-function',
    topicZh: '片語功能',
    topicEn: 'Function of a phrase',
    difficulty: 'medium',
    content:
      'A writer begins a paragraph with “Mounting evidence points to the fact that …”. This phrase signals that the writer is about to ___.',
    options: [
      'present accumulating research or data that support a claim',
      'share a personal childhood memory',
      'make an emotional plea to the reader',
      'change the subject to an unrelated topic',
    ],
    correctIndex: 0,
    explanation:
      '「Mounting evidence points to the fact that…（越來越多證據顯示……）」用於引入不斷累積、支持某論點的研究或數據，屬論證性語言。故選第一項。常見扣分陷阱：把「evidence」誤當作個人經歷或情感訴求，混淆論證與敘事／抒情。',
    explanationEn:
      '“Mounting evidence points to the fact that…” introduces accumulating research or data supporting a claim — argumentative language. Hence the first option. Trap: confusing evidence-based argument with anecdote or emotional appeal.',
    target: 'Mounting evidence points to the fact that …',
  },
  {
    subject: 'english',
    topic: 'formal-register-choice',
    topicZh: '正式語域選擇',
    topicEn: 'Choosing a formal register',
    difficulty: 'medium',
    content:
      'Which sentence expresses the idea most appropriately for a formal DSE writing task?',
    options: [
      'The significance of mental health support should not be understated.',
      'Mental health support is honestly super duper important tbh.',
      "Don't forget mental health support is like a huge deal, ok?",
      'Mental health support, whatever, it kind of matters I guess.',
    ],
    correctIndex: 0,
    explanation:
      '「The significance of … should not be understated（……的重要性不容低估）」是正式、有力的書面語表達，最合正式寫作語域。其餘選項含口語標記（tbh、like、whatever）或語氣猶豫，皆不合格。常見扣分陷阱：只看是否強調了重點，忽略語域與用詞是否正式規範。',
    explanationEn:
      '“The significance of … should not be understated” is a formal, emphatic written expression suited to formal writing. The others contain colloquial markers or hesitant tone. Trap: checking only whether the point is emphasised, not whether the register is formal.',
    target: 'The significance of … should not be understated.',
  },
]

const DIFF_MAP: Record<string, string> = { easy: 'basic', medium: 'intermediate', hard: 'hard' }

function toDraft(q: Q, i: number) {
  return {
    id: `eng-idiom-${String(i + 1).padStart(2, '0')}`,
    type: 'mc' as const,
    subject: q.subject,
    topic: q.topicEn,
    difficulty: DIFF_MAP[q.difficulty] ?? 'basic',
    question: q.content,
    options: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    explanationEn: q.explanationEn,
    _agentMeta: {
      status: 'draft' as const,
      pending_human_review: true,
      original_authored: true,
      not_copied_from_reference: true,
      target_vocabulary: q.target,
      reference_inspiration: "Charlene's Giveaway (public idioms/phrases; original contexts written fresh)",
      skill_tags: ['vocabulary', 'register', 'reading'],
      frequency: 'High',
      trap_level: 3,
      source: 'agentic-harness-v5-english-idioms',
    },
  }
}

const passed: ReturnType<typeof toDraft>[] = []
console.log('── 英文科 · 原創詞彙運用題批次（$0；公開成語／片語，原創情境）──\n')
bank.forEach((q, i) => {
  // Evaluator：英文科跳過口語檢查；補 contentEn/optionsEn 令雙語 check 通過
  const r = evaluateQuestion({
    subject: q.subject,
    topic: q.topic,
    difficulty: q.difficulty,
    content: q.content,
    contentEn: q.content,
    options: q.options,
    optionsEn: q.options,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    explanationEn: q.explanationEn,
  })
  const tag = r.verdict === 'PASS' ? '✅' : r.verdict === 'REVISE' ? '✎' : '⛔'
  console.log(`${tag} [${q.target}] → ${r.verdict}（score ${r.score}）`)
  if (r.verdict !== 'PASS') console.log('   ' + r.feedback.replace(/\n/g, '\n   '))
  if (r.verdict === 'PASS') passed.push(toDraft(q, i))
})

const outPath = fileURLToPath(new URL('./drafts/english-idioms-batch.json', import.meta.url))
writeFileSync(outPath, JSON.stringify(passed, null, 2) + '\n', 'utf8')
console.log(`\n總結：${passed.length}/${bank.length} PASS → 寫入 scripts/qbank/drafts/english-idioms-batch.json`)
console.log('生產紀律：drafts ≠ 入庫；下一步 review-drafts.mjs → 人手逐題批 → promote-drafts.mjs。')
