/**
 * DSE Level Up — offline question-bank generation engine (Plan B).
 * ---------------------------------------------------------------------------
 * Generates NEW bilingual HKDSE MC questions with Claude, runs a deterministic
 * structural gate + an independent LLM-as-judge pass, then writes the survivors
 * into a static `data/questions/<subject>-generated.ts` bank (merged in index.ts).
 * The live site stays 100% static / $0 — this runs on YOUR machine only.
 *
 * Usage (needs a local Node on PATH + the Anthropic SDK):
 *   export PATH="../.node-local/bin:$PATH"        # from dse-level-up/
 *   npm i @anthropic-ai/sdk                        # one-time
 *   export ANTHROPIC_API_KEY=sk-ant-...            # YOUR key (gitignored / shell only)
 *   npx --yes tsx@4.19.2 scripts/gen-questions.mts math --count 180
 *
 * Verify the machinery WITHOUT a key or the SDK (mock batch, no API calls):
 *   npx --yes tsx@4.19.2 scripts/gen-questions.mts math --count 6 --dry-run
 *
 * Flags: <subject> --count N --batch N --dry-run --model <id>
 *
 * SECURITY: the API key is read from process.env only. Never hard-code it,
 * never write it to a file. .env.local stays gitignored.
 */

const MODEL_DEFAULT = 'claude-opus-4-8' // latest, most capable (per claude-api skill)

// ── CLI args ────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2)
const SUBJECT = argv.find((a) => !a.startsWith('--')) ?? 'math'
const DRY_RUN = argv.includes('--dry-run')
const num = (flag: string, def: number) => {
  const i = argv.indexOf(flag)
  return i >= 0 && argv[i + 1] ? Number(argv[i + 1]) : def
}
const str = (flag: string, def: string) => {
  const i = argv.indexOf(flag)
  return i >= 0 && argv[i + 1] ? String(argv[i + 1]) : def
}
const TARGET = num('--count', 180) // how many NEW questions to add this run
const BATCH = num('--batch', 20) // questions per API call (DSE 6/10/4 maps to 20)
const MODEL = str('--model', MODEL_DEFAULT)
const MAX_ROUNDS = num('--max-rounds', Math.ceil((TARGET / BATCH) * 3) + 4)

if (SUBJECT !== 'math') {
  console.error(`This proof targets "math" only. Got "${SUBJECT}". (The engine is subject-agnostic; add a blueprint for other subjects before scaling.)`)
  process.exit(1)
}

// ── Subject blueprint: topics + a default framework per topic ────────────────
// Mirrors data/questions/math.ts (T / FW). The generator must tag each question
// with one of these topicIds; the framework is derived from the topic.
type Meta = { id: string; zh: string; en: string }
type Fw = Meta & { emoji: string }

const FW = {
  transform: { id: 'transformation_thinking', zh: '轉化思維', en: 'Transformative Thinking', emoji: '🔄' },
  rate: { id: 'rate_intuition', zh: '變化率直覺', en: 'Rate-of-change Intuition', emoji: '📈' },
  decompose: { id: 'condition_decomposition', zh: '條件分解', en: 'Condition Decomposition', emoji: '🎯' },
  modelling: { id: 'modelling', zh: '建模能力', en: 'Modelling', emoji: '🏗️' },
  geometry: { id: 'geometric_intuition', zh: '幾何直覺', en: 'Geometric Intuition', emoji: '📐' },
  sequence: { id: 'sequence_patterns', zh: '數列規律', en: 'Sequence Patterns', emoji: '🔢' },
} satisfies Record<string, Fw>

const TOPICS: Record<string, { topic: Meta; fw: Fw }> = {
  quadratic_equations: { topic: { id: 'quadratic_equations', zh: '二次方程', en: 'Quadratic Equations' }, fw: FW.transform },
  calculus: { topic: { id: 'calculus', zh: '微積分', en: 'Calculus' }, fw: FW.rate },
  probability: { topic: { id: 'probability', zh: '概率', en: 'Probability' }, fw: FW.decompose },
  functions: { topic: { id: 'functions', zh: '函數與建模', en: 'Functions & Modelling' }, fw: FW.modelling },
  trigonometry: { topic: { id: 'trigonometry', zh: '三角函數', en: 'Trigonometry' }, fw: FW.geometry },
  statistics: { topic: { id: 'statistics', zh: '統計', en: 'Statistics' }, fw: FW.modelling },
  logarithms: { topic: { id: 'logarithms', zh: '對數與指數', en: 'Logarithms & Exponents' }, fw: FW.transform },
  sequences: { topic: { id: 'sequences', zh: '數列', en: 'Sequences' }, fw: FW.sequence },
  percentage: { topic: { id: 'percentage', zh: '百分數與利率', en: 'Percentages & Interest' }, fw: FW.modelling },
  coordinate_geometry: { topic: { id: 'coordinate_geometry', zh: '坐標幾何', en: 'Coordinate Geometry' }, fw: FW.geometry },
  inequalities: { topic: { id: 'inequalities', zh: '不等式', en: 'Inequalities' }, fw: FW.transform },
}
const TOPIC_IDS = Object.keys(TOPICS)

// ── The shape Claude must return (raw json_schema → guaranteed valid JSON) ────
type GenQ = {
  difficulty: 'easy' | 'medium' | 'hard'
  topicId: string
  question_zh: string
  question_en: string
  options_zh: string[]
  options_en: string[]
  answer_index: number
  combat_analysis_zh: string
  combat_analysis_en: string
}

const GEN_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    questions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
          topicId: { type: 'string', enum: TOPIC_IDS },
          question_zh: { type: 'string' },
          question_en: { type: 'string' },
          options_zh: { type: 'array', items: { type: 'string' } },
          options_en: { type: 'array', items: { type: 'string' } },
          answer_index: { type: 'integer' },
          combat_analysis_zh: { type: 'string' },
          combat_analysis_en: { type: 'string' },
        },
        required: ['difficulty', 'topicId', 'question_zh', 'question_en', 'options_zh', 'options_en', 'answer_index', 'combat_analysis_zh', 'combat_analysis_en'],
      },
    },
  },
  required: ['questions'],
}

const JUDGE_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    verdicts: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          index: { type: 'integer' },
          answer_is_correct: { type: 'boolean' },
          reason: { type: 'string' },
        },
        required: ['index', 'answer_is_correct', 'reason'],
      },
    },
  },
  required: ['verdicts'],
}

// ── Prompts ───────────────────────────────────────────────────────────────────
const GEN_SYSTEM = `You are an expert HKDSE Mathematics (compulsory part) question writer for "DSE Level Up", a Gen-Z / Gen-Alpha exam-prep platform in Hong Kong.

Write FLAWLESS multiple-choice questions. The single most important rule: the marked correct answer MUST be mathematically, verifiably correct, and exactly one option is correct.

Rules:
- 4 options each. options_zh[answer_index] / options_en[answer_index] is THE correct answer. The other 3 are plausible traps from common mistakes.
- All 4 options must be DISTINCT (in both languages).
- Bilingual: question_zh + combat_analysis_zh in Traditional Chinese (Hong Kong); question_en + combat_analysis_en in English. Math symbols are language-neutral — use $...$ LaTeX (e.g. $x^2 - 5x + 6 = 0$). Write a literal dollar sign as \\$.
- HK-localised, Gen-Z scenarios for word problems (gaming, boba/bubble tea, K-pop, Steam sales, MTR, meme stocks, etc.) — vary names, numbers and scenarios every time.
- combat_analysis: max ~2 sentences, casual Hong Kong Cantonese peer tone (人話). Explain WHY the answer is right and the tactical trap of a wrong option — but NEVER refer to options by letter (A/B/C/D) or position; describe the wrong-answer CONTENT instead (options get shuffled in the app).
- Tag each question with one topicId from the allowed list and an honest difficulty.
- Difficulty: easy = Level 2-3 direct application; medium = Level 4-5 multi-step; hard = Level 5** unseen scenario / logic trap.`

const genUser = (seed: string, count: number, dist: { easy: number; medium: number; hard: number }, excluded: string[]) => `Generate EXACTLY ${count} brand-new questions: ${dist.easy} easy, ${dist.medium} medium, ${dist.hard} hard.

Random_Seed: ${seed}  (use it to shift scenarios, names and numbers — output must be 100% different from any prior set)

Excluded scenarios/openings (do NOT reuse these question stems or their numbers — make genuinely new ones):
${excluded.length ? excluded.map((e) => `- ${e}`).join('\n') : '- (none yet)'}

Allowed topicIds: ${TOPIC_IDS.join(', ')}

Return JSON matching the schema. Double-check every answer by solving it yourself before finalising.`

const JUDGE_SYSTEM = `You are a strict HKDSE Mathematics grader. For each question you are given the stem, the 4 options, and which option index the author marked correct. Independently SOLVE each question from scratch, then decide whether the author's marked option is the one and only correct answer. Be ruthless: if the marked answer is wrong, if more than one option is correct, if the question is ambiguous/ill-posed, or if no option is correct, mark answer_is_correct=false. Only mark true when you are confident the marked option is uniquely correct. Give a one-line reason.`

const judgeUser = (batch: GenQ[]) => `Grade these ${batch.length} questions. For each, the marked-correct option text is options_zh[answer_index].

${batch.map((q, i) => `#${i} [${q.topicId}/${q.difficulty}]
Q: ${q.question_zh}
Options: ${q.options_zh.map((o, j) => `(${j}) ${o}`).join('  ')}
Marked correct: index ${q.answer_index} = "${q.options_zh[q.answer_index]}"`).join('\n\n')}

Return one verdict per question by its index.`

// ── Anthropic call (lazy import so --dry-run needs neither the SDK nor a key) ──
let _client: any = null
async function anthropic() {
  if (_client) return _client
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set. `export ANTHROPIC_API_KEY=sk-ant-...` (your key — never commit it), or pass --dry-run to test the machinery.')
  }
  let Anthropic: any
  try {
    Anthropic = (await import('@anthropic-ai/sdk')).default
  } catch {
    throw new Error('@anthropic-ai/sdk is not installed. Run `npm i @anthropic-ai/sdk` first (or use --dry-run).')
  }
  _client = new Anthropic() // reads ANTHROPIC_API_KEY from env
  return _client
}

async function callJSON(system: string, user: string, schema: object): Promise<any> {
  const client = await anthropic()
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'high', format: { type: 'json_schema', schema } },
    system,
    messages: [{ role: 'user', content: user }],
  })
  const block = res.content.find((b: any) => b.type === 'text')
  if (!block) throw new Error('No text block in response (stop_reason=' + res.stop_reason + ')')
  return JSON.parse(block.text)
}

// ── Deterministic structural gate (pure code, 100% reliable) ──────────────────
const norm = (s: string) => s.replace(/\s+/g, '').replace(/[，。、！？,.!?:：；;]/g, '').toLowerCase()
const sig = (q: GenQ) => `${q.topicId}::${norm(q.question_zh).slice(0, 30)}`
const LETTER_REF = /(選項|答案|option)\s*[（(]?\s*[A-DＡ-Ｄ甲乙丙丁]\b|[（(][A-D][）)]/

function structuralReject(q: GenQ): string | null {
  if (!TOPIC_IDS.includes(q.topicId)) return `unknown topicId ${q.topicId}`
  if (!['easy', 'medium', 'hard'].includes(q.difficulty)) return `bad difficulty`
  if (!Array.isArray(q.options_zh) || q.options_zh.length !== 4) return `options_zh != 4`
  if (!Array.isArray(q.options_en) || q.options_en.length !== 4) return `options_en != 4`
  if (q.answer_index < 0 || q.answer_index > 3) return `answer_index out of range`
  if (new Set(q.options_zh.map(norm)).size !== 4) return `duplicate zh options`
  if (new Set(q.options_en.map(norm)).size !== 4) return `duplicate en options`
  for (const f of ['question_zh', 'question_en', 'combat_analysis_zh', 'combat_analysis_en'] as const) {
    if (!q[f] || !String(q[f]).trim()) return `empty ${f}`
  }
  if (LETTER_REF.test(q.combat_analysis_zh) || LETTER_REF.test(q.combat_analysis_en)) return `analysis cites an option letter`
  return null
}

// ── Map an accepted GenQ → the static MCQuestion shape (correct goes to idx 0) ─
function toMC(q: GenQ, id: string) {
  const meta = TOPICS[q.topicId]
  const order = [q.answer_index, ...[0, 1, 2, 3].filter((i) => i !== q.answer_index)]
  return {
    id,
    type: 'mc' as const,
    subject: 'math',
    topic: meta.topic.id,
    topicZh: meta.topic.zh,
    topicEn: meta.topic.en,
    framework: meta.fw.id,
    frameworkZh: meta.fw.zh,
    frameworkEn: meta.fw.en,
    frameworkEmoji: meta.fw.emoji,
    difficulty: q.difficulty,
    year: 2026,
    content: q.question_zh,
    contentEn: q.question_en,
    options: order.map((i) => q.options_zh[i]),
    optionsEn: order.map((i) => q.options_en[i]),
    correctIndex: 0,
    explanation: q.combat_analysis_zh,
    explanationEn: q.combat_analysis_en,
    marks: q.difficulty === 'hard' ? 2 : 1,
  }
}

// ── A tiny mock batch so --dry-run exercises the full pipeline (no API) ────────
function mockBatch(n: number, seed: string): GenQ[] {
  const out: GenQ[] = []
  const r = Number(seed.replace(/\D/g, '').slice(-4) || '1')
  for (let i = 0; i < n; i++) {
    const a = ((r + i) % 9) + 2
    const sum = a + 3
    out.push({
      difficulty: i % 3 === 0 ? 'easy' : i % 3 === 1 ? 'medium' : 'hard',
      topicId: TOPIC_IDS[i % TOPIC_IDS.length],
      question_zh: `[MOCK-${seed}-${i}] 阿珍儲咗 ${a} 張閃卡，阿明多佢 3 張。阿明有幾多張？`,
      question_en: `[MOCK-${seed}-${i}] Jan has ${a} holo cards; Ming has 3 more. How many does Ming have?`,
      options_zh: [`${sum}`, `${a}`, `${a + 6}`, `${a * 3}`],
      options_en: [`${sum}`, `${a}`, `${a + 6}`, `${a * 3}`],
      answer_index: 0,
      combat_analysis_zh: `多 3 張即係 ${a} + 3 = ${sum}。揀返 ${a} 嗰個係睇漏咗「多 3」。`,
      combat_analysis_en: `"3 more" means ${a} + 3 = ${sum}. Picking ${a} ignores the "+3".`,
    })
  }
  return out
}

// ── Load existing questions (hand + already-generated) for dedup ──────────────
async function loadExistingSignatures(): Promise<Set<string>> {
  const set = new Set<string>()
  try {
    const mod: any = await import('../data/questions/index.ts')
    for (const q of mod.getSubjectQuestions('math') as any[]) {
      set.add(`${q.topic}::${norm(q.content).slice(0, 30)}`)
    }
  } catch (e) {
    console.warn('⚠️  could not load existing bank for dedup (continuing):', (e as Error).message)
  }
  return set
}
async function loadExistingGenerated(): Promise<any[]> {
  try {
    const mod: any = await import('../data/questions/math-generated.ts')
    return (mod.mathGeneratedQuestions as any[]) ?? []
  } catch {
    return []
  }
}

// ── Write the static bank file ────────────────────────────────────────────────
async function writeBank(questions: any[]) {
  const { writeFile } = await import('node:fs/promises')
  const path = new URL('../data/questions/math-generated.ts', import.meta.url)
  const header = `import type { Question } from './types'

// AUTO-GENERATED by scripts/gen-questions.mts — do not hand-edit.
// Each question passed a deterministic structural gate + an independent
// LLM-as-judge correctness pass. Merged into the math bank in index.ts.
// Count: ${questions.length}. Regenerate with: npx tsx scripts/gen-questions.mts math --count <n>

export const mathGeneratedQuestions: Question[] = ${JSON.stringify(questions, null, 2)}
`
  await writeFile(path, header, 'utf8')
  console.log(`📝 wrote ${questions.length} questions → data/questions/math-generated.ts`)
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n🚀 gen-questions: subject=math target=+${TARGET} batch=${BATCH} model=${MODEL} ${DRY_RUN ? '(DRY RUN — mock data, no API)' : ''}`)

  const existingSig = await loadExistingSignatures()
  const seen = new Set<string>(existingSig)
  const accepted: any[] = []
  const recentStems: string[] = []
  let round = 0
  const stats = { generated: 0, structRejected: 0, dupRejected: 0, judgeRejected: 0 }

  while (accepted.length < TARGET && round < MAX_ROUNDS) {
    round++
    const need = Math.min(BATCH, TARGET - accepted.length)
    // DSE distribution 30/50/20, scaled to this batch
    const dist = { easy: Math.round(need * 0.3), hard: Math.round(need * 0.2), medium: 0 }
    dist.medium = need - dist.easy - dist.hard
    const seed = `${Date.now().toString(36)}-r${round}-${Math.random().toString(36).slice(2, 6)}`

    let batch: GenQ[]
    try {
      batch = DRY_RUN
        ? mockBatch(need, seed)
        : (await callJSON(GEN_SYSTEM, genUser(seed, need, dist, recentStems.slice(-40)), GEN_SCHEMA)).questions
    } catch (e) {
      console.error(`   round ${round}: generation failed — ${(e as Error).message}`)
      if (!DRY_RUN && round === 1) throw e // fail fast on first-round auth/SDK errors
      continue
    }
    stats.generated += batch.length

    // 1) deterministic structural + dedup gate
    const structOk: GenQ[] = []
    for (const q of batch) {
      const why = structuralReject(q)
      if (why) { stats.structRejected++; continue }
      const s = sig(q)
      if (seen.has(s)) { stats.dupRejected++; continue }
      seen.add(s)
      structOk.push(q)
    }

    // 2) independent LLM-as-judge correctness pass (skipped in dry-run)
    let judged: GenQ[] = structOk
    if (!DRY_RUN && structOk.length) {
      try {
        const { verdicts } = await callJSON(JUDGE_SYSTEM, judgeUser(structOk), JUDGE_SCHEMA)
        const ok = new Map<number, boolean>(verdicts.map((v: any) => [v.index, v.answer_is_correct]))
        judged = structOk.filter((_, i) => {
          const pass = ok.get(i) === true
          if (!pass) stats.judgeRejected++
          return pass
        })
      } catch (e) {
        console.error(`   round ${round}: judge failed, dropping batch to be safe — ${(e as Error).message}`)
        judged = []
      }
    }

    for (const q of judged) {
      accepted.push(q)
      recentStems.push(norm(q.question_zh).slice(0, 40))
    }
    console.log(`   round ${round}: +${judged.length} accepted (total ${accepted.length}/${TARGET}) | struct✗${stats.structRejected} dup✗${stats.dupRejected} judge✗${stats.judgeRejected}`)
  }

  if (!accepted.length) {
    console.error('\n❌ 0 questions accepted — nothing written.')
    process.exit(1)
  }

  // map → MCQuestion and append to any previously-generated bank
  const oldGen = await loadExistingGenerated()
  const startN = oldGen.length
  const mapped = accepted.map((q, i) => toMC(q, `math_gen_${startN + i + 1}`))
  await writeBank([...oldGen, ...mapped])

  console.log(`\n✅ done. accepted ${accepted.length} new (bank generated total: ${startN + mapped.length}).`)
  console.log(`   stats: generated=${stats.generated} structRejected=${stats.structRejected} dupRejected=${stats.dupRejected} judgeRejected=${stats.judgeRejected}`)
  if (DRY_RUN) console.log('   (DRY RUN: mock data, judge skipped. Run without --dry-run + a key for real questions.)')
  console.log('   next: `npm run build -- --webpack` to confirm the bank compiles.\n')
}

main().catch((e) => { console.error(e); process.exit(1) })
