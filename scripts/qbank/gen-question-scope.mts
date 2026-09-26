#!/usr/bin/env -S npx tsx
// ============================================================================
// gen-question-scope.mts — writes data/questions/question-scope.generated.ts
// ----------------------------------------------------------------------------
//   npm run qbank:question-scope            regenerate
//   npm run qbank:question-scope -- --check exit 1 if the file is out of date
//
// Per-question elective mapping for topics that mix compulsory and elective
// content. Decided by Yuna on 2026-09-26 under charter §18 ("要將地理、ICT、企財
// 幾科嘅混合課題加入選修對應，逐條題分開"). Record: docs/ELECTIVE-SPLIT-2026-09-26.md.
//
// Every question in the topics below is classified by the rules here, which follow
// the EDB Curriculum and Assessment Guides (page references in the record). A
// question the rules do not place in an elective is "shared": every student sees it.
// That is the safe default: hiding a compulsory question from a student is worse
// than showing one extra elective question.
//
// Only questions that belong to ONE elective are written to the output; the map is
// read by isQuestionInScope in lib/electives.ts. Rerun after adding questions to
// these topics; data/questions/__tests__/question-scope.test.mts fails while stale.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const OUT = join(ROOT, 'data/questions/question-scope.generated.ts')
const CHECK = process.argv.includes('--check')

type Q = { id: string; topic: string; content: string }
type Scope = { strand?: string; unit?: string }
const load = async <T,>(p: string): Promise<T> => {
  const m = await import(join(ROOT, p))
  return (m.default?.getSubjectQuestionsRaw ? m.default : m) as T
}
const idx = await load<{ getSubjectQuestionsRaw: (id: string) => Q[] }>('data/questions/index.ts')

const ACC: Scope = { strand: 'accounting' }
const BM: Scope = { strand: 'business-management' }
const WEATHER: Scope = { unit: 'weather-and-climate' }
const DB: Scope = { unit: 'databases' }

// A rule returns the elective a question belongs to, or null for "shared".
type Rule = (q: Q) => Scope | null
const when = (re: RegExp, scope: Scope): Rule => (q) => (re.test(q.content) ? scope : null)
const first = (...rules: Rule[]): Rule => (q) => {
  for (const r of rules) {
    const s = r(q)
    if (s !== undefined && s !== null) return s
  }
  return null
}
const always = (scope: Scope): Rule => () => scope
// An explicit "shared" that stops later rules (for questions that match a keyword
// but are compulsory in both strands).
const SHARED_STOP = {} as Scope
const stop = (re: RegExp): Rule => (q) => (re.test(q.content) ? SHARED_STOP : null)

const RULES: Record<string, Record<string, Rule>> = {
  // Geography C&A Guide (2022): the Weather and Climate elective extends basic ideas
  // from the compulsory part. Processes (rainfall types, tropical cyclones, monsoon,
  // lapse rate, humidity, pressure) are elective. Reading climate graphs, annual
  // temperature range, weather vs climate, urban heat island and El Niño stay shared:
  // they are skills or ideas the compulsory modules also use, or the guide is unclear.
  geography: {
    weather_climate: first(
      stop(/氣候圖|年溫差|城市熱島|厄爾尼諾|「氣候」與「天氣」/),
      always(WEATHER),
    ),
  },
  // ICT: compulsory A covers a single table and simple SQL (guide p.25); multiple
  // tables, relationships and normalisation are the Databases elective (p.47–50).
  ict: {
    databases: when(/外鍵|外來鍵|規範化|範式|一對多|多對多|連接條件|聯繫|父實體|子實體/, DB),
  },
  // BAFS 2027 guide. Accounting strand elective: period-end adjustments, depreciation,
  // inventory valuation, partnership, limited company, bank reconciliation, the wider
  // accounting principles, cost accounting and CVP (p.17–21). Business Management
  // strand elective: financing, budgeting, capital investment appraisal, working
  // capital, HRM and marketing (p.25–27). Ratio analysis is in BOTH electives
  // (accounting p.20; business management p.25–26), so ratio questions are shared,
  // except investment ratios (EPS, dividend cover, P/E), which only accounting lists.
  // Basics of Accounting (BM compulsory, p.22) and Basics of Management (accounting
  // compulsory, p.14) keep the basics of each shared.
  bafs: {
    depreciation: always(ACC),
    bafs_depreciation: always(ACC),
    ratios: when(/每股盈利|股息保障|市盈率/, ACC),
    bafs_ratio_analysis: when(/每股盈利|股息保障|市盈率/, ACC),
    management: when(
      /市場|營銷|4P|定價|品牌|分銷|渠道|推廣|廣告|顧客|產品生命|衰退期|培訓|流失|激勵|招聘|甄選|人力資源/,
      BM,
    ),
    accounting: when(/謹慎|審慎|可變現淨值|呆帳|呆賬|合夥|退伙|現金簿|銀行月結單|損耗/, ACC),
    // Allowance for doubtful accounts marks the two long questions built on period-end
    // adjustments. ("尚未支付" alone also matched a basic classification item.)
    financial_statements: when(/呆賬準備|呆帳準備/, ACC),
    costing: when(/收支平衡|盈虧平衡|回本銷量|邊際貢獻|目標利潤|固定成本/, ACC),
    bafs_costing_pricing: first(
      when(/回本期|payback/, BM),
      when(/收支平衡|break-even|邊際貢獻|固定成本|目標利潤/, ACC),
    ),
    financial_mgmt: first(
      stop(/債權證/), // debentures: accounting strand, BM financing and personal finance all cover them
      when(/折舊/, ACC),
      when(/融資|股本|債務|留存盈利|現金流入|回本期/, BM),
    ),
  },
}

const map: Record<string, Record<string, Scope>> = {}
const counts: string[] = []
for (const [subject, topics] of Object.entries(RULES)) {
  const bank = idx.getSubjectQuestionsRaw(subject)
  for (const [topic, rule] of Object.entries(topics)) {
    const qs = bank.filter((q) => q.topic === topic)
    if (!qs.length) throw new Error(`${subject}/${topic}: no questions (topic renamed?)`)
    const tally = new Map<string, number>()
    for (const q of [...qs].sort((a, b) => a.id.localeCompare(b.id))) {
      const s = rule(q)
      const key = !s || s === SHARED_STOP ? 'shared' : s.strand ?? s.unit!
      tally.set(key, (tally.get(key) ?? 0) + 1)
      if (s && s !== SHARED_STOP) (map[subject] ??= {})[q.id] = s
    }
    counts.push(`// ${subject}/${topic}: ${[...tally].map(([k, n]) => `${k} ${n}`).join(', ')}`)
  }
}

const body =
  `// GENERATED by scripts/qbank/gen-question-scope.mts. Do not edit by hand.\n` +
  `// Per-question elective scope (docs/ELECTIVE-SPLIT-2026-09-26.md). Questions not\n` +
  `// listed are shared by every student.\n` +
  counts.join('\n') + '\n' +
  `export const QUESTION_SCOPE: Record<string, Record<string, { strand?: string; unit?: string }>> = ` +
  '{\n' +
  Object.entries(map)
    .map(([s, m]) => `  ${JSON.stringify(s)}: {\n` + Object.entries(m).map(([id, v]) => `    ${JSON.stringify(id)}: ${JSON.stringify(v)},`).join('\n') + '\n  },')
    .join('\n') +
  '\n}\n'

if (CHECK) {
  let current = ''
  try { current = readFileSync(OUT, 'utf8') } catch { /* missing */ }
  if (current !== body) {
    console.error('✗ data/questions/question-scope.generated.ts is out of date. Run: npm run qbank:question-scope')
    process.exit(1)
  }
  console.log('✓ question scope up to date')
} else {
  writeFileSync(OUT, body)
  console.log(counts.join('\n'))
}
