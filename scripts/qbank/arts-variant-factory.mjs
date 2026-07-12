#!/usr/bin/env node
// ============================================================================
// arts-variant-factory.mjs — humanities "concept-web → MC variants" generator.
// ----------------------------------------------------------------------------
// Humanities subjects (中文/英文/史/地/CSD/倫宗) can't be parametrised by number,
// so the leverage is: a HUMAN authors a concept web (nodes + MC templates whose
// answers the human sets), and this machine expands each template's `items` into
// concrete MC questions — DETERMINISTICALLY (enumerate items, no Math.random),
// with EXACT/normalised dedup (no fake "semantic similarity", which would need an
// embedding model this machine doesn't have).
//
// It outputs a DRAFTS JSON in the exact shape review-drafts.mjs consumes. Nothing
// here goes near a live bank: every variant still flows through the human-review
// pipeline (review-drafts → a person approves EACH → promote-drafts). We do NOT do
// the spec's "sample 20%" — for academic content, un-sampled errors would ship, so
// 100% human review stays. Templates that are `type:"long"` are SKIPPED (the app's
// practice engine is MC-only) and reported, not injected.
//
//   node scripts/qbank/arts-variant-factory.mjs \
//     --web scripts/qbank/concept-webs/chinese-yu-wo-suo-yu.json \
//     --out scripts/qbank/drafts/chinese-ywsy.drafts.json
//
// Concept-web template schema (see the sample web for a worked example):
//   { template_id, topic, type:"mc", difficulty, stem, options?, correctIndex?,
//     explanation?, items:[ { vars:{k:v}, options?, correctIndex?, explanation?,
//     difficulty? } ] }
//   - stem may contain {var} placeholders filled from each item's `vars`.
//   - options/correctIndex/explanation/difficulty fall back from item → template.
// ============================================================================

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, basename } from 'node:path'
import { gateRow, norm } from './_gate.mjs'

const args = process.argv.slice(2)
const arg = (n, d = null) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] ? args[i + 1] : d }
const WEB = arg('web')
const OUT = arg('out')
if (!WEB || !OUT) {
  console.error('usage: node scripts/qbank/arts-variant-factory.mjs --web <concept-web.json> --out <drafts.json>')
  process.exit(2)
}

let web
try { web = JSON.parse(readFileSync(WEB, 'utf8')) } catch (e) { console.error(`✗ cannot read/parse ${WEB}: ${e.message}`); process.exit(1) }
const subject = web?._meta?.subject
const templates = web?.templates
if (!subject || !Array.isArray(templates)) { console.error('✗ concept web needs _meta.subject and a templates[] array'); process.exit(1) }

const fill = (stem, vars) => String(stem).replace(/\{(\w+)\}/g, (m, k) => (vars && k in vars ? String(vars[k]) : m))

const drafts = []
const skippedLong = []
const badVariants = []
const seen = new Set()
let seq = 0

for (const t of templates) {
  if (t?.type === 'long') { skippedLong.push(t.template_id || '(unnamed)'); continue }
  if (t?.type && t.type !== 'mc') { skippedLong.push(`${t.template_id || '(unnamed)'} (type ${t.type})`); continue }
  const items = Array.isArray(t?.items) && t.items.length ? t.items : [{ vars: {} }]
  for (const it of items) {
    const question = fill(t.stem ?? '', it.vars ?? {})
    const options = it.options ?? t.options
    const correctIndex = it.correctIndex ?? t.correctIndex
    const explanation = it.explanation ?? t.explanation
    const difficulty = it.difficulty ?? t.difficulty
    const row = {
      id: `art-${subject}-${t.template_id}-${seq}`,
      type: 'mc',
      subject,
      topic: t.topic ?? (Array.isArray(t.combination) ? t.combination.join('+') : 'general'),
      difficulty,
      question,
      options,
      correctIndex,
      explanation,
      // provenance so a reviewer can trace a variant back to its mother template
      _mother: t.template_id,
    }
    seq++
    // objective self-check so the drafts file is clean before it reaches review
    const errs = gateRow(row, subject)
    const key = norm(question) + '|' + (Array.isArray(options) ? options.map(norm).join('¦') : '')
    if (seen.has(key)) errs.push('duplicate variant (same stem+options)')
    if (errs.length) { badVariants.push({ id: row.id, mother: t.template_id, reasons: errs }); continue }
    seen.add(key)
    drafts.push(row)
  }
}

// ── report ──────────────────────────────────────────────────────────────────
console.log(`\n🏭 Arts variant factory — ${basename(WEB)}  ·  subject "${subject}"`)
console.log(`   templates ${templates.length}  ·  ✓ variants ${drafts.length}  ·  ⏭️  long-answer skipped ${skippedLong.length}  ·  ✗ bad ${badVariants.length}`)
if (skippedLong.length) console.log(`   skipped (MC-only engine can't serve long-answer): ${skippedLong.join(', ')}`)
if (badVariants.length) {
  console.log('   variants that FAILED the objective self-check (fix the template):')
  for (const b of badVariants.slice(0, 10)) console.log(`     ${b.id} [${b.mother}]: ${b.reasons.join('; ')}`)
}
if (!drafts.length) { console.error('\n✗ no valid MC variants produced — nothing written.\n'); process.exit(1) }

const diff = drafts.reduce((a, q) => ((a[q.difficulty] = (a[q.difficulty] || 0) + 1), a), {})
console.log(`   difficulty (drafts vocab): basic ${diff.basic || 0} / intermediate ${diff.intermediate || 0} / hard ${diff.hard || 0}`)

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, JSON.stringify(drafts, null, 2) + '\n')
console.log(`\n✓ wrote ${drafts.length} draft variants → ${OUT}`)
console.log(`  → NEXT: node scripts/qbank/review-drafts.mjs --in ${OUT} --subject ${subject}`)
console.log(`    (every variant still needs question-by-question HUMAN approval before it can go live.)\n`)
process.exit(badVariants.length ? 1 : 0)
