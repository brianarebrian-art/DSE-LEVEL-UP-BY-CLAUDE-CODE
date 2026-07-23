// Agentic Harness v5 · BAFS — 原創題批次（$0，人手撰寫，過 Evaluator）
//
// 版權合規（重要）：使用者提供的參考是【模擬試卷 + 答案】，屬有版權的試題集。
// 本批【不複製、不改編、不「改少少數字」】任何模擬題；只從中識別【考核課題／技能】
// （折舊、存貨、財務比率、直式財務狀況表、壞帳準備、有限公司融資），再自行撰寫
// 【全新原創】題目（公司／數字／情境全部原創）。符合 §1 版權紅線與 Archetype Masking。
//
// BAFS 紅線：2026 起財務報表一律【直式 Vertical Form】，禁 T-form／橫式。以下題目已守。
// ⚠️ #8 缺口（誠實）：lib/agents/evaluator.ts 尚未內建 BAFS「直式」規則（該規則在
//    scripts/qbank/term-guard.mjs 的 CI 層）。本批以人手確保合規，並標記待補。
//
// 執行：npx --yes tsx@4.19.2 scripts/qbank/bafs-batch.mts

import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

interface Q {
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
    topic: 'depreciation-straight-line',
    topicZh: '折舊（直線法）',
    topicEn: 'Depreciation (straight-line)',
    difficulty: 'easy',
    content:
      '某公司於年初以 $120,000 購入一部機器，估計可用 5 年，殘值為 $20,000。若採用直線法計算折舊，每年的折舊費用為多少？',
    contentEn:
      'A company buys a machine for $120,000 at the start of the year, with an estimated useful life of 5 years and a residual value of $20,000. Using the straight-line method, what is the annual depreciation expense?',
    options: ['$20,000', '$24,000', '$100,000', '$4,000'],
    optionsEn: ['$20,000', '$24,000', '$100,000', '$4,000'],
    correctIndex: 0,
    explanation:
      '直線法每年折舊 = （成本 − 殘值）÷ 可用年期 =（120,000 − 20,000）÷ 5 = 20,000。常見扣分陷阱：忘記先扣減殘值（誤算 120,000 ÷ 5 = 24,000），或把總折舊 100,000 當作每年折舊。',
    explanationEn:
      'Straight-line annual depreciation = (cost − residual) ÷ useful life = (120,000 − 20,000) ÷ 5 = 20,000. Common trap: forgetting to deduct the residual value (120,000 ÷ 5 = 24,000), or mistaking total depreciation (100,000) for the annual figure.',
  },
  {
    topic: 'inventory-valuation',
    topicZh: '存貨估值',
    topicEn: 'Inventory valuation',
    difficulty: 'easy',
    content: '根據審慎性原則（prudence），期末存貨在財務報表中一般應以下列何者列賬？',
    contentEn:
      'Under the prudence concept, closing inventory should generally be stated in the financial statements at which of the following?',
    options: ['成本與可變現淨值兩者中的較低者', '永遠以成本列賬', '永遠以售價列賬', '成本與售價兩者中的較高者'],
    optionsEn: [
      'The lower of cost and net realisable value',
      'Always at cost',
      'Always at selling price',
      'The higher of cost and selling price',
    ],
    correctIndex: 0,
    explanation:
      '按審慎性原則，存貨以「成本」與「可變現淨值（NRV）」中的較低者列賬，以免高估資產與利潤。常見扣分陷阱：一律用成本入賬，或誤以售價（未實現利潤）列賬。',
    explanationEn:
      'Under prudence, inventory is stated at the lower of cost and net realisable value, to avoid overstating assets and profit. Common trap: always using cost, or valuing at selling price (unrealised profit).',
  },
  {
    topic: 'ratio-current',
    topicZh: '流動比率',
    topicEn: 'Current ratio',
    difficulty: 'easy',
    content: '某公司流動資產為 $180,000，流動負債為 $90,000。其流動比率（current ratio）為多少？',
    contentEn:
      "A company has current assets of $180,000 and current liabilities of $90,000. What is its current ratio?",
    options: ['2 : 1', '0.5 : 1', '1 : 2', '$90,000'],
    optionsEn: ['2 : 1', '0.5 : 1', '1 : 2', '$90,000'],
    correctIndex: 0,
    explanation:
      '流動比率 = 流動資產 ÷ 流動負債 = 180,000 ÷ 90,000 = 2，即 2 : 1。常見扣分陷阱：把分子分母倒轉（0.5 : 1），或誤把兩者之差當成比率。',
    explanationEn:
      'Current ratio = current assets ÷ current liabilities = 180,000 ÷ 90,000 = 2, i.e. 2 : 1. Common trap: inverting the ratio (0.5 : 1), or using the difference instead.',
  },
  {
    topic: 'sofp-classification',
    topicZh: '財務狀況表分類（直式）',
    topicEn: 'Classification in the statement of financial position (vertical form)',
    difficulty: 'easy',
    content:
      '在直式（vertical form）財務狀況表中，「應收帳款（trade receivables）」一般應歸類為下列何者？',
    contentEn:
      "In a statement of financial position (vertical form), 'trade receivables' should normally be classified as which of the following?",
    options: ['流動資產', '非流動資產', '流動負債', '業主權益'],
    optionsEn: ['A current asset', 'A non-current asset', 'A current liability', "Owner's equity"],
    correctIndex: 0,
    explanation:
      '應收帳款預期在一個營業週期（通常一年）內收回，屬流動資產，在直式財務狀況表中列於流動資產項下。常見扣分陷阱：與應付帳款（trade payables，屬流動負債）混淆。',
    explanationEn:
      'Trade receivables are expected to be collected within one operating cycle (usually a year), so they are a current asset, listed under current assets in the vertical-form statement. Common trap: confusing them with trade payables (a current liability).',
  },
  {
    topic: 'provision-doubtful-debts',
    topicZh: '呆帳準備',
    topicEn: 'Provision for doubtful debts',
    difficulty: 'medium',
    content:
      '某公司應收帳款為 $200,000，管理層估計其中 3% 可能無法收回，須設立呆帳準備（provision for doubtful debts）。應設立的呆帳準備金額為多少？',
    contentEn:
      'A company has trade receivables of $200,000. Management estimates 3% may be uncollectible and sets up a provision for doubtful debts. What is the amount of the provision?',
    options: ['$6,000', '$60,000', '$194,000', '$200,000'],
    optionsEn: ['$6,000', '$60,000', '$194,000', '$200,000'],
    correctIndex: 0,
    explanation:
      '呆帳準備 = 應收帳款 × 估計不能收回比率 = 200,000 × 3% = 6,000。這是對應收帳款的估計減值，並非直接註銷整筆帳款。常見扣分陷阱：把整筆 200,000 當壞帳註銷，或百分比小數點計錯（60,000）。',
    explanationEn:
      'Provision for doubtful debts = receivables × estimated uncollectible rate = 200,000 × 3% = 6,000. It is an estimated impairment of receivables, not a write-off of the whole balance. Common trap: writing off the full 200,000, or a decimal error (60,000).',
  },
  {
    topic: 'company-financing-debentures',
    topicZh: '有限公司融資（債權證）',
    topicEn: 'Company financing (debentures)',
    difficulty: 'medium',
    content: '就有限公司的融資而言，下列關於「債權證（debentures）」的描述，何者正確？',
    contentEn:
      'Regarding the financing of a limited company, which statement about debentures is correct?',
    options: [
      '持有人是公司的債權人，可獲固定利息',
      '持有人是公司的股東，可獲股息',
      '持有人擁有公司的投票權',
      '利息只在公司有盈利時才須支付',
    ],
    optionsEn: [
      'Holders are creditors of the company and receive fixed interest',
      'Holders are shareholders of the company and receive dividends',
      'Holders have voting rights in the company',
      'Interest is payable only when the company makes a profit',
    ],
    correctIndex: 0,
    explanation:
      '債權證持有人是公司的債權人（非股東），可獲固定利息，且利息屬須支付的費用，不論公司是否有盈利。股息與投票權屬普通股股東。常見扣分陷阱：把債權證與股份混淆，或以為利息視乎盈利才付。',
    explanationEn:
      'Debenture holders are creditors (not shareholders), receive fixed interest, and that interest is an expense payable regardless of profit. Dividends and voting rights belong to ordinary shareholders. Common trap: confusing debentures with shares, or thinking interest depends on profit.',
  },
]

const DIFF_MAP: Record<string, string> = { easy: 'basic', medium: 'intermediate', hard: 'hard' }

function toDraft(q: Q, i: number) {
  return {
    id: `bafs-${String(i + 1).padStart(2, '0')}`,
    type: 'mc' as const,
    subject: 'bafs',
    topic: q.topicZh,
    difficulty: DIFF_MAP[q.difficulty] ?? 'basic',
    question: q.content,
    questionEn: q.contentEn,
    options: q.options,
    optionsEn: q.optionsEn,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    explanationEn: q.explanationEn,
    _agentMeta: {
      status: 'draft' as const,
      pending_human_review: true,
      original_authored: true,
      not_copied_from_reference: true,
      reference_note: 'Topics identified from user-supplied mock papers; scenarios/numbers written fresh (Archetype Masking).',
      vertical_form_compliant: true,
      bilingual: true,
      frequency: 'High',
      trap_level: 3,
      source: 'agentic-harness-v5-bafs',
    },
  }
}

const passed: ReturnType<typeof toDraft>[] = []
console.log('── BAFS · 原創題批次（$0；課題對標，情境全原創，守直式紅線）──\n')
bank.forEach((q, i) => {
  const r = evaluateQuestion({
    subject: 'bafs',
    topic: q.topic,
    difficulty: q.difficulty,
    content: q.content,
    contentEn: q.contentEn,
    options: q.options,
    optionsEn: q.optionsEn,
    correctIndex: q.correctIndex,
    explanation: q.explanation,
    explanationEn: q.explanationEn,
  })
  const tag = r.verdict === 'PASS' ? '✅' : r.verdict === 'REVISE' ? '✎' : '⛔'
  console.log(`${tag} [${q.topicZh}] → ${r.verdict}（score ${r.score}）`)
  if (r.verdict !== 'PASS') console.log('   ' + r.feedback.replace(/\n/g, '\n   '))
  if (r.verdict === 'PASS') passed.push(toDraft(q, i))
})

const outPath = fileURLToPath(new URL('./drafts/bafs-batch.json', import.meta.url))
writeFileSync(outPath, JSON.stringify(passed, null, 2) + '\n', 'utf8')
console.log(`\n總結：${passed.length}/${bank.length} PASS → 寫入 scripts/qbank/drafts/bafs-batch.json`)
console.log('生產紀律：drafts ≠ 入庫；下一步 review-drafts.mjs → 人手逐題批 → promote-drafts.mjs。')
