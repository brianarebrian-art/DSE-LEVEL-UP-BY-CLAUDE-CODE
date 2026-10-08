#!/usr/bin/env -S npx tsx
// ============================================================================
// repairs/m1-04.mts — rationale repair, batch M1-04 (5 questions, 1 template)
// ----------------------------------------------------------------------------
//   npx tsx scripts/qbank/repairs/m1-04.mts          → writes the batch file
//   npx tsx scripts/qbank/repair-rationale.mts --batch M1-04   → applies it
//   npx tsx scripts/qbank/restore-computed.mts --batch M1-04   → back into practice
//
// Founders' reply 33a (2026-10-08): the standard-score comparison template held back
// from M1-03. m1_rep_0063–0066 and 0068 are repaired as a computed batch;
// m1_rep_0067 stays withdrawn, because both standard scores are 2 there and the
// option marked correct ("乙卷，因為其標準分數較高（甲 z = 2，乙 z = 2）")
// contradicts itself. That is a wrong question, not a wrong explanation.
//
// The old explanation ended with "最後一項只確認了兩卷都高於平均", naming an option by
// position. Here each option gets its own note. The raw-mark option needs two
// wordings: in 0063, 0065 and 0066 the paper with the higher raw mark is also the
// paper with the higher standard score, so that option names the right paper for
// the wrong reason; in 0064 and 0068 it names the wrong paper.
// ============================================================================
import { writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const BATCH = 'M1-04'
const IDS = ['m1_rep_0063', 'm1_rep_0064', 'm1_rep_0065', 'm1_rep_0066', 'm1_rep_0068']

type Text = { zh: string; en: string }
interface Note { optionId: number; kind: string; zh: string; en: string }
interface Built {
  template: string
  params: Record<string, number>
  expected: Record<string, string>
  expectedEn: Record<string, string>
  notes: Record<string, Text>
  explanation: Text
}

/** Up to four decimals, no trailing zeros. */
const num = (v: number) => String(Math.round(v * 1e4) / 1e4)

function compare(muA: number, sA: number, xA: number, muB: number, sB: number, xB: number): Built {
  const zA = (xA - muA) / sA
  const zB = (xB - muB) / sB
  if (zA === zB) throw new Error(`equal standard scores (${zA}); the question has no correct option`)
  if (xA === xB) throw new Error('equal raw marks; the raw-mark option names no paper')
  const hiA = zA > zB
  const hi = hiA ? '甲' : '乙', lo = hiA ? '乙' : '甲'
  const hiEn = hiA ? 'A' : 'B', loEn = hiA ? 'B' : 'A'
  const rawA = xA > xB
  const raw = rawA ? '甲' : '乙', rawEn = rawA ? 'A' : 'B'
  const [za, zb, zHi, zLo] = [num(zA), num(zB), num(Math.max(zA, zB)), num(Math.min(zA, zB))]
  const fracA = `\\dfrac{${xA} - ${muA}}{${sA}}`
  const fracB = `\\dfrac{${xB} - ${muB}}{${sB}}`
  const sameAsCorrect = rawA === hiA
  return {
    template: 'compare-two-papers-by-z',
    params: { muA, sA, xA, muB, sB, xB },
    expected: {
      correct: `${hi}卷，因為其標準分數較高（甲 $z = ${za}$，乙 $z = ${zb}$）`,
      otherPaper: `${lo}卷，因為其標準分數較高`,
      rawMark: `${raw}卷，因為原始分數較高`,
      bothAbove: '兩卷表現相同，因為兩者都高於各自的平均分',
    },
    expectedEn: {
      correct: `Paper ${hiEn}, because its standard score is higher (A: $z = ${za}$, B: $z = ${zb}$)`,
      otherPaper: `Paper ${loEn}, because its standard score is higher`,
      rawMark: `Paper ${rawEn}, because the raw mark is higher`,
      bothAbove: 'Equally well, since both marks are above their respective means',
    },
    notes: {
      correct: {
        zh: `正確。甲卷 $z = ${fracA} = ${za}$，乙卷 $z = ${fracB} = ${zb}$。${hi}卷的標準分數較高，即該分數高出該卷平均分較多個標準差。`,
        en: `Correct. Paper A: $z = ${fracA} = ${za}$; Paper B: $z = ${fracB} = ${zb}$. Paper ${hiEn} has the higher standard score: that mark is more standard deviations above its paper's mean.`,
      },
      otherPaper: {
        zh: `${lo}卷的標準分數是 $${zLo}$，低於${hi}卷的 $${zHi}$，比較的方向弄反了。`,
        en: `Paper ${loEn}'s standard score is $${zLo}$, lower than Paper ${hiEn}'s $${zHi}$; the comparison is the wrong way round.`,
      },
      rawMark: sameAsCorrect
        ? {
            zh: `卷別碰巧選對，但理由錯了：兩卷的平均分和標準差不同，原始分數 $${xA}$ 與 $${xB}$ 不可直接比較，判斷要靠標準分數。`,
            en: `The paper happens to be right but the reason is wrong: the papers have different means and standard deviations, so the raw marks $${xA}$ and $${xB}$ cannot be compared directly. The standard score decides it.`,
          }
        : {
            zh: `${raw}卷的原始分數較高，但兩卷的平均分和標準差不同，原始分數不可直接比較；按標準分數，${raw}卷其實較低（$z = ${zLo}$）。`,
            en: `Paper ${rawEn} has the higher raw mark, but the papers have different means and standard deviations, so raw marks cannot be compared directly; by standard score Paper ${rawEn} is in fact lower ($z = ${zLo}$).`,
          },
      bothAbove: {
        zh: `兩個分數確實都高於各自的平均分，但高出的幅度不同：甲卷高出 $${za}$ 個標準差，乙卷高出 $${zb}$ 個標準差，所以表現並不相同。`,
        en: `Both marks are indeed above their means, but not by the same amount: $${za}$ standard deviations on Paper A and $${zb}$ on Paper B, so the performances are not equal.`,
      },
    },
    explanation: {
      zh: `兩份卷的平均分與標準差都不相同，原始分數不可直接比較，要先化成標準分數。甲卷 $z = ${fracA} = ${za}$；乙卷 $z = ${fracB} = ${zb}$。${hi}卷的 $z$ 較高，故相對表現較佳。兩個分數雖然都高於平均分，但高出的標準差數目不同，所以不能說表現相同。`,
      en: `The two papers have different means and standard deviations, so the raw marks cannot be compared directly; convert them to standard scores first. Paper A: $z = ${fracA} = ${za}$; Paper B: $z = ${fracB} = ${zb}$. Paper ${hiEn} has the higher $z$, so that is the better relative performance. Both marks are above their means, but by different numbers of standard deviations, so the performances are not equal.`,
    },
  }
}

const STEM = /甲卷平均分 \$(\d+)\$、標準差 \$(\d+)\$，他得 \$(\d+)\$ 分；乙卷平均分 \$(\d+)\$、標準差 \$(\d+)\$，他得 \$(\d+)\$ 分。/

function build(content: string): Built {
  const m = content.match(STEM)
  if (!m) throw new Error(`stem matches no template: ${content}`)
  return compare(+m[1], +m[2], +m[3], +m[4], +m[5], +m[6])
}

const mod = await import(join(ROOT, 'data/questions/index.ts'))
const idx = (mod.default?.getSubjectQuestionsRaw ? mod.default : mod) as {
  getSubjectQuestionsRaw: (s: string) => Array<{ id: string; content: string; options: string[]; optionsEn?: string[]; correctIndex: number }>
}
const bank = new Map(idx.getSubjectQuestionsRaw('m1').map((q) => [q.id, q]))

const out = []
for (const id of IDS) {
  const q = bank.get(id)
  if (!q) throw new Error(`${id} not in the raw m1 bank`)
  const t = build(q.content)
  const notes: Note[] = q.options.map((opt, optionId) => {
    const kinds = Object.entries(t.expected).filter(([, s]) => s === opt).map(([k]) => k)
    if (kinds.length !== 1) throw new Error(`${id} option ${optionId} "${opt}" matched ${kinds.length} kinds`)
    // The English option at the same index must be the same kind, or the notes would be on the wrong English text.
    if (q.optionsEn?.[optionId] !== t.expectedEn[kinds[0]]) throw new Error(`${id} option ${optionId}: English "${q.optionsEn?.[optionId]}" is not ${kinds[0]}`)
    return { optionId, kind: kinds[0], ...t.notes[kinds[0]] }
  })
  const correct = notes.filter((n) => n.kind === 'correct').map((n) => n.optionId)
  if (correct.length !== 1 || correct[0] !== q.correctIndex) throw new Error(`${id}: recomputed correct option ${correct} ≠ stored ${q.correctIndex}`)
  out.push({ id, template: t.template, params: t.params, options: q.options, optionsEn: q.optionsEn!, explanation: t.explanation.zh, explanationEn: t.explanation.en, optionNotes: notes })
}

// 0067 must still fail the recomputation; if it ever passes, the question was changed and this note is stale.
let held = false
try { build(bank.get('m1_rep_0067')!.content) } catch { held = true }
if (!held) throw new Error('m1_rep_0067 no longer has equal standard scores; revisit the founders\' reply 33a')

mkdirSync(join(ROOT, 'data/questions/rationale-repairs'), { recursive: true })
writeFileSync(
  join(ROOT, `data/questions/rationale-repairs/${BATCH}.json`),
  JSON.stringify({ batch: BATCH, subject: 'm1', computed: true, generatedBy: 'scripts/qbank/repairs/m1-04.mts', repairs: out }, null, 2) + '\n',
)
console.log(`✓ ${BATCH}: ${out.length} repairs written to data/questions/rationale-repairs/${BATCH}.json`)
