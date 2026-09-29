#!/usr/bin/env -S npx tsx
// ============================================================================
// classify-posref.mts — sort positional-wording hits into three classes
// ----------------------------------------------------------------------------
//   npx tsx scripts/qbank/classify-posref.mts            report only
//   npx tsx scripts/qbank/classify-posref.mts --write    also write the outputs below
//   npx tsx scripts/qbank/classify-posref.mts --apply    withdraw hand-written class A not yet
//                                                        withdrawn, and log them for repair
//
// Yuna 2026-09-29, fourth decision (docs/DECISIONS-2026-09-29.md §八):
// a pattern hit is not a content bug. "數列的第二項" and "缺了第三項" (the third of
// three conditions listed in the explanation) are fine; "最後一項把比例倒轉" names an
// option by a position that the shuffle breaks. The regex in check-posref.mjs only
// finds candidates. This script decides what each candidate refers to, from the
// question's own structure, and never from the wording alone:
//
//   option-noun         the matched phrase names an option ("第三個選項", "the last option")
//   omission-object     the phrase is the object of an omission verb ("漏了第二項",
//                       "只算了第一項"): a term of an expression or a listed condition
//   term-of             the phrase belongs to a noun ("數列的第二項", "展開式的最後一項")
//   sibling-distractors the same or the previous sentence quotes other wrong options
//                       ("陷阱：90,000 元漏了…；170,000 元漏了…；最後一項把…")
//   enumeration         the explanation lists items that are not options and the
//                       position can index that list ("三件事：…、…、以及…")
//   stem-statements     the stem numbers its own statements ((1)(2)(3), I II III)
//   option-overlap      the words right after the phrase also appear in an option.
//                       This cancels the two list signals above: in el_po_6_* the
//                       sentence after 「最後一項」 is about the speaker, and so are the
//                       options, so a student could read it as pointing at an option.
//
// Each hit becomes option / content / unknown; each question becomes
//   A  CONFIDENT_OPTION_REFERENCE   any hit refers to an option  -> withdraw
//   B  LIKELY_CONTENT_REFERENCE     every hit refers to content  -> keep
//   C  AMBIGUOUS                    otherwise                    -> human review queue
//
// A human decision in posref-review-decisions.json overrides the classifier. Claude
// never writes that file (charter §16.C, §18.1).
//
// Outputs (--write):
//   data/questions/posref-classification.json     one row per candidate question
//   docs/rationale-repairs/posref-review-queue.md the C class, grouped by template
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')
const pick = <T,>(m: T): T => ((m as { default?: T }).default ?? m)
const I = pick(await import(join(ROOT, 'data/questions/index.ts')))
const { classifyQuestion, LABEL } = await import('./posref-classifier.mts')
type PosrefClass = import('./posref-classifier.mts').PosrefClass
type Hit = import('./posref-classifier.mts').Hit
type Q = import('./posref-classifier.mts').Q
const S = pick(await import(join(ROOT, 'data/subjects.ts')))

// ── Cohorts ─────────────────────────────────────────────────────────────────
// first       the 176 of the first decision (rationale-repairs.json)
// machine     live entries on the ordinal file baseline (generated banks, 135)
// handwritten every other runtime hit (537)
const repairs = JSON.parse(read('data/questions/rationale-repairs.json')) as Record<string, { subject: string; cohort?: string }>
const first = new Set(Object.entries(repairs).filter(([, r]) => (r.cohort ?? 'positional-first') === 'positional-first').map(([id]) => id))
const ordinal = JSON.parse(read('scripts/qbank/posref-ordinal-baseline.json')).grandfathered as Record<string, string[]>
const machine = new Set(Object.values(ordinal).flat().map((e) => e.split(' ')[0]).filter((id) => !first.has(id)))
const runtime = JSON.parse(read('scripts/qbank/posref-runtime-baseline.json')).grandfathered as Record<string, string[]>
const decisionsFile = JSON.parse(read('scripts/qbank/posref-review-decisions.json')) as { decisions: Record<string, { class: 'A' | 'B'; by: string; date: string; note: string }> }

const template = (id: string) => id.replace(/\d+/g, '#')

type Row = { subject: string; id: string; cohort: 'machine' | 'handwritten'; template: string; class: PosrefClass; label: string; decidedBy?: string; hits: Hit[] }
const rows: Row[] = []
for (const s of S.subjects as { id: string }[]) {
  const ids = new Set(runtime[s.id] ?? [])
  for (const raw of I.getSubjectQuestionsRaw(s.id) as Q[]) {
    if (!ids.has(raw.id) || first.has(raw.id)) continue
    const c = classifyQuestion(raw)
    if (!c) continue // rewritten since the baseline was measured
    const human = decisionsFile.decisions[`${s.id}/${raw.id}`]
    const cls = human?.class ?? c.class
    rows.push({
      subject: s.id, id: raw.id, cohort: machine.has(raw.id) ? 'machine' : 'handwritten', template: template(raw.id),
      class: cls, label: LABEL[cls], ...(human ? { decidedBy: `${human.by} ${human.date}` } : {}), hits: c.hits,
    })
  }
}
rows.sort((a, b) => a.subject.localeCompare(b.subject) || a.id.localeCompare(b.id))

// ── Report ──────────────────────────────────────────────────────────────────
const count = (cohort: string, cls?: PosrefClass) => rows.filter((r) => r.cohort === cohort && (!cls || r.class === cls)).length
const overlap = [...machine].filter((id) => first.has(id))
console.log(`first cohort ${first.size}; machine ${machine.size}; overlap ${overlap.length}`)
for (const cohort of ['machine', 'handwritten']) {
  console.log(`${cohort.padEnd(11)} ${count(cohort)}  A ${count(cohort, 'A')}  B ${count(cohort, 'B')}  C ${count(cohort, 'C')}`)
}
const pointsAtCorrect = rows.filter((r) => r.hits.some((h) => h.verdict === 'option' && h.mapsToCorrect))
console.log(`option references whose stored position is the correct answer: ${pointsAtCorrect.length}`)

if (process.argv.includes('--write')) {
  writeFileSync(join(ROOT, 'data/questions/posref-classification.json'), JSON.stringify({
    _note: [
      '由 scripts/qbank/classify-posref.mts 生成，唔好人手改。人手決定寫入 posref-review-decisions.json。',
      'A = CONFIDENT_OPTION_REFERENCE（收起）；B = LIKELY_CONTENT_REFERENCE（保留）；C = AMBIGUOUS（待人手判斷）。',
      'machine = 機器生成題庫（第四次決定：全部收起，不論分類）；handwritten = 手寫題庫。',
    ],
    counts: Object.fromEntries(['machine', 'handwritten'].map((c) => [c, { total: count(c), A: count(c, 'A'), B: count(c, 'B'), C: count(c, 'C') }])),
    rows,
  }, null, 1) + '\n')

  const queue = rows.filter((r) => r.class === 'C')
  const byTemplate = new Map<string, Row[]>()
  for (const r of queue) byTemplate.set(`${r.subject} ${r.template}`, [...(byTemplate.get(`${r.subject} ${r.template}`) ?? []), r])
  const lines = [
    '# 位置詞候選：待人手判斷（C 類）',
    '',
    '由 `scripts/qbank/classify-posref.mts --write` 生成，唔好人手改。',
    '',
    '這些題目的解析有位置詞（例如「最後一項」），但分類器判斷不到它指的是選項還是題目內容。',
    '在判斷之前，題目照常上線（Yuna 2026-09-29 第四次決定：C 類不即時收起）。',
    '',
    '判斷方法：看一條例子，決定整個模板。指選項 → A（收起）；指題目內容 → B（保留）。',
    '決定寫入 `scripts/qbank/posref-review-decisions.json`，鍵為 `科目/題號`，須填 `class`、`by`（代號）、`date`、`note`。',
    '然後重跑本腳本。Claude 不會代填。',
    '',
    `共 ${queue.length} 題，${byTemplate.size} 個模板。`,
    '',
  ]
  for (const [key, rs] of byTemplate) {
    const [subject] = key.split(' ')
    const ex = rs[0]
    const q = (I.getSubjectQuestionsRaw(subject) as Q[]).find((x) => x.id === ex.id)!
    lines.push(`## ${key}（${rs.length} 題）`, '')
    lines.push(`例子：\`${subject}/${ex.id}\``, '')
    for (const h of ex.hits) {
      const text = q[h.field as 'explanation' | 'explanationEn'] ?? ''
      const at = text.indexOf(h.phrase)
      lines.push(`- ${h.field}「${h.phrase}」：…${text.slice(Math.max(0, at - 50), at + h.phrase.length + 50).replace(/\n/g, ' ')}…`)
      lines.push(`  - 訊號：${h.signals.join('、') || '（無）'}；按儲存次序指向第 ${h.mapsTo === null ? '?' : h.mapsTo + 1} 個選項${h.mapsToCorrect ? '（正確答案）' : ''}`)
    }
    lines.push('', `題號：${rs.map((r) => r.id).join('、')}`, '')
  }
  writeFileSync(join(ROOT, 'docs/rationale-repairs/posref-review-queue.md'), lines.join('\n'))
  console.log('written: data/questions/posref-classification.json, docs/rationale-repairs/posref-review-queue.md')
}

// ── --apply: decision ④, "A → withdraw" ─────────────────────────────────────────
// Hand-written class A (including a C that a reviewer has decided is A) is withdrawn
// with the reason code and logged for repair in its cohort. B and C are never touched.
// An entry that already exists is kept as it is (same rule as withdraw.mts).
if (process.argv.includes('--apply')) {
  const wPath = join(ROOT, 'data/questions/withdrawn.json')
  const withdrawn = JSON.parse(readFileSync(wPath, 'utf8')) as Record<string, Record<string, { date: string; reason: string }>>
  const log = repairs as Record<string, Record<string, unknown>>
  const today = new Date().toISOString().slice(0, 10)
  let added = 0
  for (const r of rows.filter((x) => x.cohort === 'handwritten' && x.class === 'A')) {
    if (withdrawn[r.subject]?.[r.id] || log[r.id]) continue
    ;(withdrawn[r.subject] ??= {})[r.id] = { date: today, reason: 'POSITIONAL_RATIONALE_REFERENCE' }
    log[r.id] = { subject: r.subject, batch: null, stage: 'withdrawn', updated: today, contentReview: null, cohort: 'positional-handwritten' }
    added++
  }
  writeFileSync(wPath, JSON.stringify(withdrawn, null, 2) + '\n')
  writeFileSync(join(ROOT, 'data/questions/rationale-repairs.json'), JSON.stringify(log, null, 2) + '\n')
  console.log(`--apply: withdrew and logged ${added} hand-written class A question(s). Next: npm run gen:summary.`)
}
