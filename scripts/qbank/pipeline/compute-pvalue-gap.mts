/**
 * Deterministic P-value gap aggregation (no external LLM).
 *
 * Input JSON (optional --in path):
 * {
 *   items: [{
 *     item_id, subject, topic?,
 *     hkeaa_ref_p?, hkeaa_est_p?,
 *     correct_count?, attempt_count?,   // or pass dlu_p + sample_size
 *     dlu_p?, sample_size?,
 *     same_topic_type?: boolean
 *   }]
 * }
 *
 * Without --in / empty items: writes UNKNOWN report (honest default).
 *
 * Usage:
 *   npx tsx scripts/qbank/pipeline/compute-pvalue-gap.mts
 *   npx tsx scripts/qbank/pipeline/compute-pvalue-gap.mts --in path/to/items.json
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const MIN_N = 30
const ANOMALY_DELTA = -0.3
const TARGET_RATIO = 0.9

export type ItemInput = {
  item_id: string
  subject: string
  topic?: string
  hkeaa_ref_p?: number | null
  hkeaa_est_p?: number | null
  correct_count?: number
  attempt_count?: number
  dlu_p?: number | null
  sample_size?: number
  same_topic_type?: boolean
}

export type ItemMetric = {
  item_id: string
  subject: string
  topic?: string
  hkeaa_ref_p: number | null
  hkeaa_est_p: number | null
  hkeaa_p_kind: 'ref' | 'est' | 'none'
  hkeaa_p: number | null
  dlu_p: number | null
  sample_size: number
  delta_p: number | null
  ratio_p: number | null
  same_topic_type: boolean
  in_formal_aggregate: boolean
  anomaly_flag: boolean
  skip_reason?: string
}

export function computeDluP(correct: number, attempts: number): number | null {
  if (!Number.isFinite(attempts) || attempts <= 0) return null
  if (!Number.isFinite(correct) || correct < 0 || correct > attempts) return null
  return correct / attempts
}

export function computeDeltaRatio(
  dlu: number | null,
  hkeaa: number | null,
): { delta_p: number | null; ratio_p: number | null } {
  if (dlu == null || hkeaa == null || !Number.isFinite(dlu) || !Number.isFinite(hkeaa)) {
    return { delta_p: null, ratio_p: null }
  }
  if (hkeaa === 0) return { delta_p: dlu - hkeaa, ratio_p: null }
  return { delta_p: dlu - hkeaa, ratio_p: dlu / hkeaa }
}

export function metricize(row: ItemInput): ItemMetric {
  let dlu =
    row.dlu_p != null && Number.isFinite(row.dlu_p)
      ? row.dlu_p
      : computeDluP(row.correct_count ?? NaN, row.attempt_count ?? NaN)
  const sample =
    typeof row.sample_size === 'number'
      ? row.sample_size
      : typeof row.attempt_count === 'number'
        ? row.attempt_count
        : 0

  const ref =
    row.hkeaa_ref_p != null && Number.isFinite(row.hkeaa_ref_p) ? row.hkeaa_ref_p : null
  const est =
    row.hkeaa_est_p != null && Number.isFinite(row.hkeaa_est_p) ? row.hkeaa_est_p : null
  const kind: ItemMetric['hkeaa_p_kind'] = ref != null ? 'ref' : est != null ? 'est' : 'none'
  const hkeaa = kind === 'ref' ? ref : kind === 'est' ? est : null
  const { delta_p, ratio_p } = computeDeltaRatio(dlu, hkeaa)

  let skip_reason: string | undefined
  // Opt-in only: missing/undefined same_topic_type must NOT enter formal stats
  const same = row.same_topic_type === true
  if (!same) skip_reason = 'cross_topic_or_type'
  else if (sample < MIN_N) skip_reason = 'sample_lt_30'
  else if (hkeaa == null) skip_reason = 'no_hkeaa_p'
  else if (dlu == null) skip_reason = 'no_dlu_p'

  const in_formal = !skip_reason
  const anomaly_flag =
    in_formal && delta_p != null && delta_p < ANOMALY_DELTA

  return {
    item_id: row.item_id,
    subject: row.subject,
    topic: row.topic,
    hkeaa_ref_p: ref,
    hkeaa_est_p: est,
    hkeaa_p_kind: kind,
    hkeaa_p: hkeaa,
    dlu_p: dlu,
    sample_size: sample,
    delta_p,
    ratio_p,
    same_topic_type: same,
    in_formal_aggregate: in_formal,
    anomaly_flag,
    skip_reason,
  }
}

function mean(xs: number[]): number | null {
  if (!xs.length) return null
  return xs.reduce((a, b) => a + b, 0) / xs.length
}

function aggregate(metrics: ItemMetric[]) {
  const formal = metrics.filter((m) => m.in_formal_aggregate)
  const bySubject: Record<
    string,
    { n: number; mean_delta_p: number | null; mean_ratio_p: number | null }
  > = {}
  for (const m of formal) {
    if (!bySubject[m.subject]) {
      bySubject[m.subject] = { n: 0, mean_delta_p: null, mean_ratio_p: null }
    }
    bySubject[m.subject].n++
  }
  for (const sub of Object.keys(bySubject)) {
    const rows = formal.filter((m) => m.subject === sub)
    bySubject[sub].mean_delta_p = mean(
      rows.map((r) => r.delta_p!).filter((x) => x != null),
    )
    bySubject[sub].mean_ratio_p = mean(
      rows.map((r) => r.ratio_p!).filter((x) => typeof x === 'number'),
    )
  }
  return {
    formal_n: formal.length,
    mean_delta_p: mean(formal.map((m) => m.delta_p!).filter((x) => x != null)),
    mean_ratio_p: mean(
      formal.map((m) => m.ratio_p!).filter((x) => typeof x === 'number'),
    ),
    target_ratio: TARGET_RATIO,
    bySubject,
    anomalies: formal.filter((m) => m.anomaly_flag),
  }
}

// CLI
const args = process.argv.slice(2)
const inIdx = args.indexOf('--in')
const inPath = inIdx >= 0 ? args[inIdx + 1] : null

let items: ItemInput[] = []
if (inPath) {
  const raw = JSON.parse(readFileSync(inPath, 'utf8')) as
    | { items?: ItemInput[] }
    | ItemInput[]
  items = Array.isArray(raw) ? raw : raw.items || []
}

const metrics = items.map(metricize)
const agg = aggregate(metrics)
const now = new Date().toISOString()

const report = {
  generatedAt: now,
  timezoneNote: 'Machine UTC; report for Asia/Hong_Kong founder review',
  definitions: {
    P: 'correct / valid_attempts in [0,1]; larger = easier',
    delta_p: 'P_DLU - P_HKEAA (percentage points when ×100)',
    ratio_p: 'P_DLU / P_HKEAA; intent ≈ 0.9 for +10% relative difficulty',
    min_sample: MIN_N,
    anomaly_delta_lt: ANOMALY_DELTA,
  },
  caveats: [
    'Platform self-selected students ≠ territory-wide HKEAA cohort',
    'Observational only — not absolute item difficulty',
    'D4: store P numbers + topic metadata only; never paste HKEAA stems',
    'Do not claim empirical +10% until formal_n and ratio evidence exist',
  ],
  status:
    metrics.length === 0
      ? 'UNKNOWN_NO_INPUT'
      : agg.formal_n === 0
        ? 'UNKNOWN_NO_FORMAL_ROWS'
        : 'OK',
  input_n: metrics.length,
  aggregate: agg,
  items: metrics,
  report_template_zh:
    agg.formal_n === 0
      ? '現階段無法計算正式聚合：缺生產作答或官方／推定 P，或全部 n<30。標 UNKNOWN。'
      : `現階段 DSE Level Up 統計：平台相對考評局對應考點，平均相對比值為 ${agg.mean_ratio_p?.toFixed(3) ?? 'null'}；平均絕對差距 ${(agg.mean_delta_p != null ? (agg.mean_delta_p * 100).toFixed(1) : 'null')} 個百分點。（已統計 ${agg.formal_n} 題，每題 n≥${MIN_N}；樣本群體≠全港應考考生。）`,
}

mkdirSync('docs', { recursive: true })
writeFileSync('docs/pvalue-gap-report.json', JSON.stringify(report, null, 2))

// Tiny self-check fixture when no input
if (!inPath) {
  const demo = [
    metricize({
      item_id: '_demo_ok',
      subject: 'math',
      hkeaa_ref_p: 0.6,
      correct_count: 48,
      attempt_count: 100,
      same_topic_type: true,
    }),
    metricize({
      item_id: '_demo_small_n',
      subject: 'math',
      hkeaa_ref_p: 0.5,
      correct_count: 5,
      attempt_count: 10,
    }),
  ]
  const demoAgg = aggregate(demo)
  writeFileSync(
    'docs/pvalue-gap-demo.json',
    JSON.stringify(
      {
        note: 'Synthetic demo only — not production. Shows ΔP=-0.12, ratio=0.80 for n=100.',
        demo,
        aggregate: demoAgg,
      },
      null,
      2,
    ),
  )
}

console.log(
  JSON.stringify(
    {
      status: report.status,
      input_n: report.input_n,
      formal_n: agg.formal_n,
      mean_delta_p: agg.mean_delta_p,
      mean_ratio_p: agg.mean_ratio_p,
      anomalies: agg.anomalies.length,
      out: 'docs/pvalue-gap-report.json',
    },
    null,
    2,
  ),
)
