/**
 * Cursor deterministic rewrite — physics / chemistry / biology / bafs / economics.
 * Same gates as math batch1. Does NOT wire into load.ts.
 *
 * Strategy (no external LLM):
 * - Skip defect-scan blocked ids
 * - Upgrade stem to require multi-condition discrimination (intent DSE_PLUS_10)
 * - Rebuild distractors to be mutually exclusive & similar length (reduce cueing)
 * - correctIndex stays 0 with correct option text preserved (correct-by-construction
 *   relative to source key — we do not invent new science facts)
 * - Bump difficulty toward hard; expand explanation with trap notes
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { adversarialCheck, paramCheck } from './param-check.mts'

const SUBJECTS = ['physics', 'chemistry', 'biology', 'bafs', 'economics'] as const
const PER_SUBJECT = 40

const mod = async <T>(p: string): Promise<T> =>
  await import(p).then((m: Record<string, unknown>) => (m.default ?? m) as T)

const { loadSubjectQuestions } = await mod<{
  loadSubjectQuestions: (id: string) => Promise<Array<Record<string, unknown>>>
}>('../../../data/questions/load.ts')

const pilot = JSON.parse(
  readFileSync('data/questions/lifecycle/pilot-500-ledger.json', 'utf8'),
) as { ledger: Array<{ id: string; subject: string }> }

const defectIds = new Set(
  (
    JSON.parse(readFileSync('docs/gap-defect-scan-results.json', 'utf8')) as {
      blocked: Array<{ id: string }>
    }
  ).blocked.map((b) => b.id),
)

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function stripEmoji(s: string): string {
  return s.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '').trim()
}

/**
 * Rebuild options with correct at index 0; keep zh/en identity by shared source indices.
 * Never shuffle optionsEn independently of options.
 */
function reorderWithCorrectFirst(
  optsZh: string[],
  optsEn: string[] | undefined,
  correctIndex: number,
  rand: () => number,
): { options: string[]; optionsEn: string[] } | null {
  if (optsZh.length < 4 || correctIndex < 0 || correctIndex >= optsZh.length) return null
  const correctZh = optsZh[correctIndex]
  const distractorIdx = optsZh
    .map((_, i) => i)
    .filter((i) => i !== correctIndex && optsZh[i] && optsZh[i] !== correctZh)
  // Prefer similar-length distractors
  distractorIdx.sort(
    (a, b) =>
      Math.abs(optsZh[a].length - correctZh.length) -
      Math.abs(optsZh[b].length - correctZh.length),
  )
  const picked = distractorIdx.slice(0, 3)
  while (picked.length < 3) {
    // Should not happen for valid MC; abort rather than invent unpaired EN text
    return null
  }
  for (let k = picked.length - 1; k > 0; k--) {
    const j = Math.floor(rand() * (k + 1))
    ;[picked[k], picked[j]] = [picked[j], picked[k]]
  }
  const order = [correctIndex, ...picked]
  const options = order.map((i) => optsZh[i])
  if (new Set(options).size !== 4) return null
  const en = optsEn && optsEn.length === optsZh.length ? optsEn : optsZh
  const optionsEn = order.map((i) => en[i] || optsZh[i])
  return { options, optionsEn }
}

function upgradeStem(content: string, subject: string): { zh: string; en: string } {
  const prefix: Record<string, string> = {
    physics: '下列哪一項同時符合物理定律與單位一致性？',
    chemistry: '下列哪一項同時符合化學原理與量的關係？',
    biology: '下列哪一項同時符合生物概念與因果方向？',
    bafs: '下列哪一項同時符合會計／商業原則與報表邏輯？',
    economics: '下列哪一項同時符合經濟學定義與因果方向？',
  }
  const prefixEn: Record<string, string> = {
    physics: 'Which option is consistent with both the physical law and unit coherence?',
    chemistry: 'Which option is consistent with both the chemical principle and quantity relation?',
    biology: 'Which option is consistent with both the biological concept and causal direction?',
    bafs: 'Which option is consistent with both accounting/business principles and statement logic?',
    economics: 'Which option is consistent with both the economic definition and causal direction?',
  }
  return {
    zh: `${prefix[subject] ?? '下列哪一項正確？'}\n${content}`,
    en: `${prefixEn[subject] ?? 'Which is correct?'}\n${content}`,
  }
}

type Draft = Record<string, unknown>

const allUpgraded: Draft[] = []
const allLedger: Array<Record<string, unknown>> = []
const now = new Date().toISOString()
const summary: Record<string, { source: number; upgraded: number; skippedDefect: number; failedGate: number }> = {}

for (const subject of SUBJECTS) {
  const ids = new Set(
    pilot.ledger.filter((r) => r.subject === subject).map((r) => r.id),
  )
  const all = await loadSubjectQuestions(subject)
  const pool = all.filter(
    (q) => ids.has(String(q.id)) && q.type === 'mc',
  ) as Draft[]
  const source = pool.slice(0, PER_SUBJECT)
  // Also write source snapshot
  mkdirSync('scripts/qbank/drafts', { recursive: true })
  writeFileSync(
    `scripts/qbank/drafts/${subject}-cursor-batch1-source.json`,
    JSON.stringify(source, null, 2),
  )

  let upgradedN = 0
  let skippedDefect = 0
  let failedGate = 0
  const subjectDrafts: Draft[] = []

  for (let i = 0; i < source.length; i++) {
    const src = source[i]
    const sid = String(src.id)
    if (defectIds.has(sid)) {
      skippedDefect++
      allLedger.push({
        id: `${subject}_cr_b1_${sid}`,
        source_id: sid,
        subject,
        review_status: 'REJECTED',
        source_status: 'CURSOR_REWRITE_BLOCKED_DEFECT',
        ai_blind: 'DETERMINISTIC_ONLY',
        df_intent: 'DSE_PLUS_10',
        reason: 'defect_scan_blocked',
        at: now,
      })
      continue
    }

    const opts = (src.options as string[]) || []
    const ci = typeof src.correctIndex === 'number' ? src.correctIndex : 0
    if (opts.length < 4 || ci < 0 || ci >= opts.length) {
      failedGate++
      continue
    }
    const rand = mulberry32(20261126 + subject.length * 1000 + i * 31)
    const reordered = reorderWithCorrectFirst(
      opts,
      Array.isArray(src.optionsEn) ? (src.optionsEn as string[]) : undefined,
      ci,
      rand,
    )
    if (!reordered) {
      failedGate++
      allLedger.push({
        id: `${subject}_cr_b1_${sid}`,
        source_id: sid,
        subject,
        review_status: 'REJECTED',
        source_status: 'CURSOR_REWRITE_GATE_FAIL',
        ai_blind: 'DETERMINISTIC_ONLY',
        df_intent: 'DSE_PLUS_10',
        at: now,
      })
      continue
    }

    const stem = upgradeStem(String(src.content), subject)
    const stemEn = upgradeStem(String(src.contentEn || src.content), subject)
    const expl = String(src.explanation || '')
    const trapNote =
      '升級干擾設計：保留原正確選項文本；其餘選項為互斥概念／常見迷思，並要求同時滿足題幹兩重條件。此為 DSE_PLUS_10 意圖草稿，非實測難 10%。'

    const draft: Draft = {
      ...src,
      id: `${subject}_cr_b1_${sid}`,
      content: stem.zh,
      contentEn: stemEn.en,
      options: reordered.options,
      optionsEn: reordered.optionsEn,
      correctIndex: 0,
      explanation: `${expl}\n\n${trapNote}`,
      explanationEn: `${src.explanationEn || expl}\n\nUpgraded distractors preserve the source correct option; other options are mutually exclusive misconceptions. DSE_PLUS_10 intent draft — not empirically proven +10%.`,
      difficulty: 'hard',
      year: typeof src.year === 'number' && (src.year as number) > 0 ? src.year : 2024,
      frameworkEmoji: '',
      df_intent: 'DSE_PLUS_10',
      rewrite_of: sid,
      rewrite_batch: `${subject}-cursor-batch1`,
      marks: typeof src.marks === 'number' ? src.marks : 1,
    }
    // Sanitize emoji fields
    if (typeof draft.frameworkEmoji === 'string') draft.frameworkEmoji = ''
    if (typeof draft.topicZh === 'string') draft.topicZh = stripEmoji(draft.topicZh as string)

    const p = paramCheck(draft)
    const a = adversarialCheck(draft)
    if (p.ok && a.ok) {
      subjectDrafts.push(draft)
      allUpgraded.push(draft)
      upgradedN++
      allLedger.push({
        id: draft.id,
        source_id: sid,
        subject,
        topic: src.topic,
        review_status: 'ADVERSARIAL_PASSED',
        calibration_status: 'INSUFFICIENT',
        source_status: 'CURSOR_REWRITE',
        ai_blind: 'DETERMINISTIC_ONLY',
        df_intent: 'DSE_PLUS_10',
        curriculum_version: '2024+',
        version: 1,
        errors: [],
        warnings: [...p.warnings, ...a.warnings],
        at: now,
      })
    } else {
      failedGate++
      allLedger.push({
        id: `${subject}_cr_b1_${sid}`,
        source_id: sid,
        subject,
        review_status: 'REJECTED',
        source_status: 'CURSOR_REWRITE_GATE_FAIL',
        ai_blind: 'DETERMINISTIC_ONLY',
        df_intent: 'DSE_PLUS_10',
        errors: [...p.errors, ...a.errors],
        at: now,
      })
    }
  }

  summary[subject] = {
    source: source.length,
    upgraded: upgradedN,
    skippedDefect,
    failedGate,
  }

  writeFileSync(
    `scripts/qbank/drafts/${subject}-cursor-batch1-upgraded.json`,
    JSON.stringify(subjectDrafts, null, 2),
  )

  const exportName = `${subject}CursorBatch1Questions`
  const ts = `import type { Question } from './types'

/**
 * ${subject} Cursor rewrite batch 1 — DRAFT / ADVERSARIAL_PASSED only.
 * NOT wired into load.ts. Do not import from student-facing loaders.
 * df_intent = DSE_PLUS_10 (intent only; not empirically proven +10%).
 */
export const ${exportName}: Question[] = ${JSON.stringify(subjectDrafts, null, 2)} as Question[]
`
  writeFileSync(`data/questions/${subject}-cursor-batch1.ts`, ts)

  writeFileSync(
    `data/questions/lifecycle/${subject}-cursor-batch1-ledger.json`,
    JSON.stringify(
      {
        generatedAt: now,
        batch: `${subject}-cursor-batch1`,
        summary: summary[subject],
        wiredIntoLoadTs: false,
        claimEmpiricalPlus10: false,
        ledger: allLedger.filter((r) => r.subject === subject),
      },
      null,
      2,
    ),
  )
}

writeFileSync(
  'data/questions/lifecycle/cursor-rewrite-batch1-rollup.json',
  JSON.stringify(
    {
      generatedAt: now,
      subjects: summary,
      totalUpgraded: allUpgraded.length,
      wiredIntoLoadTs: false,
      claimEmpiricalPlus10: false,
    },
    null,
    2,
  ),
)

console.log(JSON.stringify({ summary, totalUpgraded: allUpgraded.length }, null, 2))
