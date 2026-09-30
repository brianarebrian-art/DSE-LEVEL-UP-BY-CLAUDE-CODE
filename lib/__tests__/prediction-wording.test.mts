// The practice estimate is not named or sold as a grade prediction (UX loop 21, 2026-09-30;
// hardening loop prompt §6).
//
// Before: the side bar, /predictor title, dashboard card, subject page, home CTA note and the
// site-wide meta description called it 等級預測／Grade Predictor／即時等級預測. The estimate
// itself already gave a range and three kinds of uncertainty; the name promised more.
//
// Allowed: the charter §13 disclaimer sentence (「等級預測僅供參考，最終成績以 HKEAA 公布為準」),
// which the charter requires word for word, and sentences that say it is NOT a prediction.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8')

function files(dir: string): string[] {
  return readdirSync(join(ROOT, dir)).flatMap((f) => {
    const p = join(dir, f)
    if (f === '__tests__' || f === 'node_modules') return []
    return statSync(join(ROOT, p)).isDirectory() ? files(p) : /\.tsx?$/.test(f) ? [p] : []
  })
}

const stripComments = (s: string) =>
  s.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1')

const CLAIM = /等級預測|即時等級|Grade Predictor|grade prediction|predicted grade|grade predictor/gi
const ALLOWED = [
  /等級預測僅供參考，最終成績以 HKEAA 公布為準/, // charter §13, verbatim
  /Grade predictions are (?:for reference|indicative) only/, // its English translation (footer, /about)
  /not an? (?:HKEAA |DSE )?grade prediction/i,
]

test('no user-facing string names the estimate a grade prediction', () => {
  const hits: string[] = []
  for (const f of [...files('app'), ...files('components'), 'lib/dictionary.ts']) {
    const lines = stripComments(read(f)).split('\n')
    lines.forEach((line, i) => {
      if (!CLAIM.test(line)) return
      CLAIM.lastIndex = 0
      if (ALLOWED.some((re) => re.test(line))) return
      hits.push(`${relative(ROOT, join(ROOT, f))}:${i + 1} ${line.trim().slice(0, 90)}`)
    })
    CLAIM.lastIndex = 0
  }
  assert.deepEqual(hits, [])
})

test('the new names are used where the old ones were', () => {
  const dict = read('lib/dictionary.ts')
  assert.match(dict, /predictor: '練習表現',/)
  assert.match(dict, /title: '練習表現估算',/)
  assert.match(dict, /predictor: 'Practice performance',/)
  assert.match(read('app/predictor/page.tsx'), /title: '練習表現估算 \| DSE Level Up'/)
  assert.match(read('app/layout.tsx'), /並非考評局官方網站/)
})

test('every estimate says what it is right under the range', () => {
  const src = read('components/MasteryEstimate.tsx')
  const band = src.indexOf('<p className="text-2xl font-medium text-ink mt-2">{band}</p>')
  const note = src.indexOf('唔係考評局成績預測', band)
  assert.ok(band > 0 && note > band && note - band < 400, 'note directly after the band')
  assert.match(src, /not an HKEAA grade prediction/)
  // Only the estimate page shows it; the result page stopped on 2026-09-30 (refinement loop 2).
  assert.match(read('app/predictor/PredictorClient.tsx'), /<MasteryEstimate/)
  assert.doesNotMatch(read('app/result/ResultPageClient.tsx'), /MasteryEstimate/)
})
