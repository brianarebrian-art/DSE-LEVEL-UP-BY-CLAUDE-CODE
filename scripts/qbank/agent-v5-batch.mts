// Agentic Harness v5 · 階段三 — Archetype Masking 原創題批次（$0，人手撰寫，過 Evaluator）
//
// 誠實聲明：以下每一題均為【原創】——全新情境／數字／人名，考核趨勢報告所列嘅高頻底層技能，
// 並非任何 HKEAA 官方試題嘅複製或「改少少數字」。內容不引錄任何官方試題或評卷參考。
// 全部過 lib/agents/evaluator（術語紅線／書面語／格式／版權訊號），PASS 先寫入 drafts/。
// 生產紀律：drafts ≠ 入庫；仍須 review-drafts.mjs → 人手逐題批 → promote-drafts.mjs。
//
// 執行：npx --yes tsx@4.19.2 scripts/qbank/agent-v5-batch.mts

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
  contentEn: string
  options: string[]
  optionsEn: string[]
  correctIndex: number
  explanation: string
  explanationEn: string
  markingSchemeZh: string
  markingSchemeEn: string
  refYears: number[]
  frequency: 'High' | 'Med' | 'Low'
  trapLevel: number
}

const require = createRequire(import.meta.url)
const { evaluateQuestion } = require('../../lib/agents/evaluator.ts') as {
  evaluateQuestion: (d: Q) => { verdict: 'PASS' | 'REVISE' | 'BLOCK'; score: number; feedback: string }
}

const bank: Q[] = [
  {
    subject: 'economics',
    topic: 'opportunity-cost',
    topicZh: '機會成本',
    topicEn: 'Opportunity Cost',
    difficulty: 'medium',
    content:
      '阿樂在一個週末，可選擇替鄰居補習賺取 300 元、到餐廳兼職賺取 360 元，或留在家中溫習。若他最終選擇留在家中溫習，則此決定的機會成本應為下列何者？',
    contentEn:
      'On a weekend, Lok can tutor a neighbour for $300, work part-time at a restaurant for $360, or stay home to study. If he chooses to stay home and study, what is the opportunity cost of that decision?',
    options: ['300 元的補習收入', '360 元的兼職收入', '660 元（兩項相加）', '零，因為他沒有花錢'],
    optionsEn: ['The $300 tutoring income', 'The $360 part-time income', '$660 (the two added together)', 'Zero, since he spent no money'],
    correctIndex: 1,
    explanation:
      '機會成本指作出選擇時所放棄的、價值最高的一個替代選項，而非所有被放棄選項的總和。阿樂留家溫習所放棄的最高價值選項是兼職的 360 元，故機會成本為 360 元。常見扣分陷阱：將所有被放棄選項相加（660 元），或誤以為沒有金錢支出便沒有機會成本。',
    explanationEn:
      'Opportunity cost is the value of the single most valuable alternative forgone, not the sum of all alternatives given up. By staying home, the highest-valued option Lok forgoes is the $360 part-time job, so the opportunity cost is $360. Common deductions: adding all forgone options ($660), or assuming no money spent means no cost.',
    markingSchemeZh: '得分點：① 指出機會成本＝放棄的最高價值選項（1）；② 正確選出 360 元的兼職收入（1）。',
    markingSchemeEn: 'Award: ① identifies opportunity cost = highest-valued alternative forgone (1); ② selects the $360 part-time income (1).',
    refYears: [2023, 2024, 2025],
    frequency: 'High',
    trapLevel: 3,
  },
  {
    subject: 'economics',
    topic: 'goods-classification',
    topicZh: '物品分類',
    topicEn: 'Classification of Goods',
    difficulty: 'easy',
    content:
      '路邊街燈供任何途人使用；一名途人享用燈光不會減少其他人可享用的燈光，而且難以阻止任何人使用。就經濟學的物品分類而言，街燈最適合被歸類為下列何者？',
    contentEn:
      'A street lamp lights the road for any passer-by; one person using the light does not reduce the amount available to others, and it is hard to stop anyone from using it. In economic terms, a street lamp is best classified as which of the following?',
    options: ['私人物品', '共用品', '只具排他性的物品', '只具競爭性的物品'],
    optionsEn: ['A private good', 'A public good (shared good)', 'A good that is only excludable', 'A good that is only rival'],
    correctIndex: 1,
    explanation:
      '共用品同時具備非競爭性（一人享用不減少他人可享用量）與非排他性（難以阻止他人使用）。街燈正符合這兩項特徵，故屬共用品。常見扣分陷阱：只憑其中一項特徵便下判斷；亦須留意本港課程採用「共用品」一詞。',
    explanationEn:
      'A shared good is both non-rival (one person’s use does not reduce the amount available to others) and non-excludable (hard to stop others from using). A street lamp meets both criteria, so it is a shared good. Common deduction: judging by only one property; note the HK syllabus term.',
    markingSchemeZh: '得分點：① 同時指出非競爭性與非排他性（1）；② 正確歸類為共用品（1）。',
    markingSchemeEn: 'Award: ① states both non-rivalry and non-excludability (1); ② classifies as a shared good (1).',
    refYears: [2023, 2024, 2025],
    frequency: 'High',
    trapLevel: 2,
  },
  {
    subject: 'math',
    topic: 'percentage-area',
    topicZh: '百分數與面積（跨課題）',
    topicEn: 'Percentage & Area (cross-topic)',
    difficulty: 'medium',
    content: '一塊長方形草地長 8 米、闊 5 米。若把長與闊各增加 25%，則新草地的面積比原草地增加多少？',
    contentEn:
      'A rectangular lawn is 8 m long and 5 m wide. If both the length and the width are increased by 25%, by what percentage does the area increase?',
    options: ['25%', '50%', '56.25%', '62.5%'],
    optionsEn: ['25%', '50%', '56.25%', '62.5%'],
    correctIndex: 2,
    explanation:
      '長與闊各增加 25%，即各變為原來的 1.25 倍。面積為長與闊的乘積，故新面積是原面積的 1.25 × 1.25 = 1.5625 倍，即增加 56.25%。常見扣分陷阱：直接把 25% 當作面積增幅，忽略面積屬二維量、須將比例相乘。',
    explanationEn:
      'Increasing each of the length and width by 25% makes each 1.25 times the original. Area is length × width, so the new area is 1.25 × 1.25 = 1.5625 times the original — a 56.25% increase. Common deduction: treating 25% as the area increase, forgetting area is two-dimensional and the factors multiply.',
    markingSchemeZh: '得分點：① 各邊變為 1.25 倍（1）；② 面積比 1.25²＝1.5625，得增幅 56.25%（1）。',
    markingSchemeEn: 'Award: ① each side becomes 1.25× (1); ② area factor 1.25² = 1.5625 → 56.25% increase (1).',
    refYears: [2023, 2024, 2025],
    frequency: 'High',
    trapLevel: 3,
  },
  {
    subject: 'math',
    topic: 'unit-conversion',
    topicZh: '單位換算陷阱',
    topicEn: 'Unit-conversion trap',
    difficulty: 'easy',
    content: '一條繩長 2.5 米，每段長 25 厘米。這條繩最多可剪成多少段完整的小段？',
    contentEn: 'A rope is 2.5 m long. Each piece is 25 cm long. What is the greatest number of whole pieces the rope can be cut into?',
    options: ['10 段', '100 段', '1 段', '0.1 段'],
    optionsEn: ['10 pieces', '100 pieces', '1 piece', '0.1 piece'],
    correctIndex: 0,
    explanation:
      '須先統一單位：2.5 米等於 250 厘米。250 ÷ 25 = 10，故最多可剪成 10 段完整的小段。常見扣分陷阱：忘記把米換算成厘米（誤算 2.5 ÷ 25 = 0.1），或單位換算方向相反。',
    explanationEn:
      'Convert units first: 2.5 m equals 250 cm. 250 ÷ 25 = 10, so the rope makes at most 10 whole pieces. Common deduction: forgetting to convert metres to centimetres (mis-computing 2.5 ÷ 25 = 0.1), or converting in the wrong direction.',
    markingSchemeZh: '得分點：① 換算 2.5 米＝250 厘米（1）；② 250 ÷ 25＝10 段（1）。',
    markingSchemeEn: 'Award: ① convert 2.5 m = 250 cm (1); ② 250 ÷ 25 = 10 pieces (1).',
    refYears: [2023, 2024, 2025],
    frequency: 'High',
    trapLevel: 4,
  },
  {
    subject: 'english',
    topic: 'integrated-register',
    topicEn: 'Integrated skills — paraphrase & register',
    topicZh: '整合能力——改寫與語域',
    difficulty: 'medium',
    content:
      'An integrated-skills data file states: “The workshop is fully booked; latecomers cannot be admitted.” In a polite email to a member who arrived late, which option best paraphrases this in an appropriate register instead of copying it word-for-word?',
    contentEn:
      'An integrated-skills data file states: “The workshop is fully booked; latecomers cannot be admitted.” In a polite email to a member who arrived late, which option best paraphrases this in an appropriate register instead of copying it word-for-word?',
    options: [
      '“You cannot come in because you are late.”',
      '“Unfortunately, as the workshop had reached full capacity, we were unable to admit those who arrived after it began.”',
      '“The workshop is fully booked; latecomers cannot be admitted.”',
      '“No entry for late people, sorry.”',
    ],
    optionsEn: [
      '“You cannot come in because you are late.”',
      '“Unfortunately, as the workshop had reached full capacity, we were unable to admit those who arrived after it began.”',
      '“The workshop is fully booked; latecomers cannot be admitted.”',
      '“No entry for late people, sorry.”',
    ],
    correctIndex: 1,
    explanation:
      '整合能力題考核「改寫與語域轉換」，而非照抄資料。第二個選項以委婉、正式的語氣重述資訊，並非逐字複製，最切合禮貌電郵的語域。逐字照搬資料原句屬盲抄，是最典型的扣分位；過於直率或不禮貌的措辭亦不符電郵語域。',
    explanationEn:
      'Integrated tasks assess paraphrasing and register shift, not copying. The second option restates the information politely and formally without lifting it verbatim, matching a courteous email register. Copying the source sentence word-for-word is blind copying — the most typical deduction — while blunt or impolite wording breaches the email register.',
    markingSchemeZh: '得分點：① 避免逐字照抄（1）；② 用正式而委婉的語域改寫（1）。',
    markingSchemeEn: 'Award: ① avoids verbatim copying (1); ② rephrases in a formal, polite register (1).',
    refYears: [2023, 2024, 2025],
    frequency: 'High',
    trapLevel: 4,
  },
  {
    subject: 'chinese',
    topic: 'argumentation',
    topicZh: '論證方法（駁論）',
    topicEn: 'Argumentation techniques (refutation)',
    difficulty: 'medium',
    content: '議論文中，作者先提出並反駁對立的觀點，然後確立自己的主張。這種論證方法一般稱為下列何者？',
    contentEn:
      'In an argumentative essay, the writer first raises and rebuts an opposing view, then establishes their own claim. This technique is generally called which of the following?',
    options: ['舉例論證', '對比論證', '駁論（先破後立）', '比喻論證'],
    optionsEn: ['Argument by example', 'Argument by contrast', 'Refutation (rebut then assert)', 'Argument by analogy'],
    correctIndex: 2,
    explanation:
      '先提出對立觀點再加以反駁，最後確立己方主張，屬「駁論」，即「先破後立」的結構。舉例論證重在以事例支持；對比論證重在正反並列比較；比喻論證則借喻說理。常見扣分陷阱：把「駁論」與「對比論證」混淆——前者重在「破」對方，後者重在「比較」。',
    explanationEn:
      'Raising an opposing view, rebutting it, then asserting one’s own claim is refutation — the “break then build” structure. Argument by example supports with cases; argument by contrast juxtaposes for comparison; argument by analogy reasons through metaphor. Common deduction: confusing refutation with contrast — the former targets the opponent, the latter compares.',
    markingSchemeZh: '得分點：① 辨識「先反駁對立觀點」的結構（1）；② 正確選出駁論／先破後立（1）。',
    markingSchemeEn: 'Award: ① identifies the “rebut the opposing view first” structure (1); ② selects refutation / break-then-build (1).',
    refYears: [2023, 2024, 2025],
    frequency: 'High',
    trapLevel: 3,
  },
]

const DIFF_MAP: Record<string, string> = { easy: 'basic', medium: 'intermediate', hard: 'hard' }

function toDraft(q: Q, i: number) {
  return {
    id: `agent-v5-${q.subject}-${String(i + 1).padStart(2, '0')}`,
    type: 'mc' as const,
    subject: q.subject,
    topic: q.topicZh,
    difficulty: DIFF_MAP[q.difficulty] ?? 'basic',
    question: q.content,
    questionEn: q.contentEn,
    options: q.options,
    optionsEn: q.optionsEn,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    explanationEn: q.explanationEn,
    markingScheme: q.markingSchemeZh,
    markingSchemeEn: q.markingSchemeEn,
    _agentMeta: {
      status: 'draft' as const,
      pending_human_review: true,
      archetype_masking: true,
      original_authored: true,
      ref_years: q.refYears,
      frequency: q.frequency,
      trap_level: q.trapLevel,
      bilingual: true,
      source: 'agentic-harness-v5-stage3',
    },
  }
}

const passed: ReturnType<typeof toDraft>[] = []
const rejected: { q: Q; verdict: string; feedback: string }[] = []

console.log('── Agentic Harness v5 · 階段三 · Archetype Masking 原創題批次（$0）──\n')
bank.forEach((q, i) => {
  const r = evaluateQuestion(q)
  const tag = r.verdict === 'PASS' ? '✅' : r.verdict === 'REVISE' ? '✎' : '⛔'
  console.log(`${tag} [${q.subject}/${q.topic}] → ${r.verdict}（score ${r.score}）`)
  if (r.verdict === 'PASS') passed.push(toDraft(q, i))
  else {
    rejected.push({ q, verdict: r.verdict, feedback: r.feedback })
    console.log('   ' + r.feedback.replace(/\n/g, '\n   '))
  }
})

const outPath = fileURLToPath(new URL('./drafts/agent-v5-batch.json', import.meta.url))
writeFileSync(outPath, JSON.stringify(passed, null, 2) + '\n', 'utf8')

console.log(`\n總結：${passed.length}/${bank.length} PASS → 寫入 scripts/qbank/drafts/agent-v5-batch.json`)
if (rejected.length) console.log(`      ${rejected.length} 題未過（REVISE/BLOCK），未寫入，需修正。`)
console.log('生產紀律：drafts ≠ 入庫；下一步 review-drafts.mjs → 人手逐題批 → promote-drafts.mjs。')
