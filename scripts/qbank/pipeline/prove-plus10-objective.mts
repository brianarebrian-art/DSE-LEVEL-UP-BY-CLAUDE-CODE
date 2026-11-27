/**
 * Objective +10% difficulty proof using docs/05 DF σ-lift.
 *
 * For every live item:
 *   sigma_lift = (DF_post - DF_pre) / σ_pre
 * Pass when sigma_lift ≥ 0.4 (docs/05 DSE_PLUS_10 band lower bound)
 * Implied ratio ≈ 1 - (sigma_lift/0.5)*0.1  → 0.5σ maps to ratio 0.9
 *
 * Usage:
 *   npx tsx scripts/qbank/pipeline/prove-plus10-objective.mts
 *   npx tsx scripts/qbank/pipeline/prove-plus10-objective.mts --subject math
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import {
  computeDf,
  mean,
  stdev,
  median,
  meetsPlus10,
  impliedRatioFromSigma,
  sigmaToRelativeHardness,
  PLUS10_SIGMA_MIN,
  PLUS10_SIGMA_TARGET,
} from './df-proxy.mts'

const mod = async <T>(p: string): Promise<T> =>
  await import(p).then((m: Record<string, unknown>) => (m.default ?? m) as T)

const { loadSubjectQuestions } = await mod<{
  loadSubjectQuestions: (
    id: string,
    opts?: { skipUpgradeOverlay?: boolean },
  ) => Promise<Array<Record<string, unknown>>>
}>('../../../data/questions/load.ts')

const SUBJECTS = [
  'math', 'm1', 'm2', 'physics', 'chemistry', 'biology', 'english', 'ict',
  'chinese', 'bafs', 'economics', 'geography', 'history', 'ths', 'music', 'pe',
  'csd', 'chinese-history', 'chinese-literature', 'english-literature',
  'visual-arts', 'ethics-religious', 'technology-living', 'design-tech',
  'health-management',
] as const

const args = process.argv.slice(2)
const subIdx = args.indexOf('--subject')
const only = subIdx >= 0 ? args[subIdx + 1] : null
const subjects = only ? SUBJECTS.filter((s) => s === only) : [...SUBJECTS]

type Row = {
  id: string
  subject: string
  type: string
  df_pre: number
  df_post: number
  delta_df: number
  sigma_lift: number
  implied_relative_hardness: number
  implied_ratio: number
  pass: boolean
}

const rows: Row[] = []
const preDfs: number[] = []

for (const subject of subjects) {
  const [base, upgraded] = await Promise.all([
    loadSubjectQuestions(subject, { skipUpgradeOverlay: true }),
    loadSubjectQuestions(subject, { skipUpgradeOverlay: false }),
  ])
  const upById = new Map(upgraded.map((q) => [String(q.id), q]))
  for (const q of base) {
    const id = String(q.id)
    const u = upById.get(id)
    if (!u) continue
    const pre = computeDf(q)
    const post = computeDf(u)
    preDfs.push(pre.DF)
    rows.push({
      id,
      subject,
      type: String(q.type),
      df_pre: pre.DF,
      df_post: post.DF,
      delta_df: Math.round((post.DF - pre.DF) * 1000) / 1000,
      sigma_lift: 0, // filled after σ known
      implied_relative_hardness: 0,
      implied_ratio: 1,
      pass: false,
    })
  }
}

const sigmaPre = stdev(preDfs) || 1e-6
const medianPre = median(preDfs)
const meanPre = mean(preDfs)

for (const r of rows) {
  r.sigma_lift = Math.round(((r.df_post - r.df_pre) / sigmaPre) * 1000) / 1000
  r.implied_relative_hardness =
    Math.round(sigmaToRelativeHardness(r.sigma_lift) * 10000) / 10000
  r.implied_ratio = Math.round(impliedRatioFromSigma(r.sigma_lift) * 10000) / 10000
  r.pass = meetsPlus10(r.sigma_lift)
}

const passed = rows.filter((r) => r.pass)
const failed = rows.filter((r) => !r.pass)
const lifts = rows.map((r) => r.sigma_lift)
const meanSigma = mean(lifts)
const minSigma = lifts.length ? Math.min(...lifts) : 0
const maxSigma = lifts.length ? Math.max(...lifts) : 0
const meanRatio = mean(rows.map((r) => r.implied_ratio))
const meanHard = mean(rows.map((r) => r.implied_relative_hardness))
const maxImpliedRatio = rows.length
  ? Math.max(...rows.map((r) => r.implied_ratio))
  : 1

const bySubject: Record<
  string,
  { n: number; pass: number; fail: number; mean_sigma_lift: number; mean_implied_ratio: number }
> = {}
for (const s of subjects) {
  const rs = rows.filter((r) => r.subject === s)
  bySubject[s] = {
    n: rs.length,
    pass: rs.filter((r) => r.pass).length,
    fail: rs.filter((r) => !r.pass).length,
    mean_sigma_lift: Math.round(mean(rs.map((r) => r.sigma_lift)) * 1000) / 1000,
    mean_implied_ratio: Math.round(mean(rs.map((r) => r.implied_ratio)) * 10000) / 10000,
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  timezoneNote: 'Machine UTC; Asia/Hong_Kong founder review',
  definition: {
    source: 'docs/05-difficulty-model.md',
    formula: 'DF = 0.30C+0.20S+0.15R+0.15D+0.10U+0.10M',
    plus10_band: `sigma_lift = (DF_post-DF_pre)/σ_pre ≥ ${PLUS10_SIGMA_MIN} (target ${PLUS10_SIGMA_TARGET} ≈ ratio 0.9)`,
    empirical_ratio_p: 'NOT claimed — practice_attempts empty; this is structural DF proof only',
  },
  baseline: {
    n: preDfs.length,
    mean_df_pre: Math.round(meanPre * 1000) / 1000,
    median_df_pre: Math.round(medianPre * 1000) / 1000,
    sigma_pre: Math.round(sigmaPre * 1000) / 1000,
  },
  verdict: {
    total: rows.length,
    pass: passed.length,
    fail: failed.length,
    pass_rate: rows.length ? Math.round((passed.length / rows.length) * 10000) / 10000 : 0,
    all_pass: failed.length === 0 && rows.length > 0,
    /** Every item ≥0.4σ ⇒ every item at least ~8% relative hardness (docs/05). */
    every_item_at_least_plus10_band: failed.length === 0 && rows.length > 0,
    mean_sigma_lift: Math.round(meanSigma * 1000) / 1000,
    min_sigma_lift: Math.round(minSigma * 1000) / 1000,
    max_sigma_lift: Math.round(maxSigma * 1000) / 1000,
    mean_implied_relative_hardness: Math.round(meanHard * 10000) / 10000,
    mean_implied_ratio: Math.round(meanRatio * 10000) / 10000,
    /** Worst-case (easiest relative) implied ratio; must be ≤0.92 for ≥8% band. */
    max_implied_ratio: Math.round(maxImpliedRatio * 10000) / 10000,
    target_implied_ratio: 0.9,
  },
  bySubject,
  fail_sample: failed.slice(0, 50).map((r) => ({
    id: r.id,
    subject: r.subject,
    delta_df: r.delta_df,
    sigma_lift: r.sigma_lift,
  })),
}

mkdirSync('docs', { recursive: true })
mkdirSync('data/questions/lifecycle', { recursive: true })
writeFileSync('docs/plus10-objective-proof.json', JSON.stringify(report, null, 2))
writeFileSync(
  'data/questions/lifecycle/plus10-objective-proof-ids.json',
  JSON.stringify(
    {
      generatedAt: report.generatedAt,
      all_pass: report.verdict.all_pass,
      pass_ids_count: passed.length,
      fail_ids: failed.map((r) => r.id),
    },
    null,
    2,
  ),
)

console.log(
  JSON.stringify(
    {
      all_pass: report.verdict.all_pass,
      total: report.verdict.total,
      pass: report.verdict.pass,
      fail: report.verdict.fail,
      mean_sigma_lift: report.verdict.mean_sigma_lift,
      mean_implied_ratio: report.verdict.mean_implied_ratio,
      sigma_pre: report.baseline.sigma_pre,
      out: 'docs/plus10-objective-proof.json',
    },
    null,
    2,
  ),
)
