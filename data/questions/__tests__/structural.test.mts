// Structural regression suite for every active subject's question bank.
// Formalises what `_scan.mts` only reports ad hoc into real pass/fail assertions
// so a broken bank (dup options, dup ids, out-of-range correctIndex, EN-array
// length mismatch) fails `npm test` / CI instead of depending on someone
// remembering to run `_scan.mts` by hand.
//
// NOTE: `createBank().add()` (see ../_parametric.ts) already drops any tuple
// whose 4 zh option strings collide, so a healthy bank should never trip the
// option-distinctness checks below — if one does, something bypassed that
// guard (e.g. a hand-authored file, or a bank not using createBank at all).
//
// Must import the question modules via dynamic import() from this .mts file —
// a static `import ... from '../index'` silently resolves to only a `default`
// export in this project's tsx/Node setup (the `.ts` file is loaded as CJS
// under static import, but correctly as ESM under dynamic import()). This is
// the same reason the existing `_scan.mts` uses `await import(...)`.

import { test } from 'node:test'
import assert from 'node:assert/strict'

const { getActiveSubjects } = await import('../../subjects.ts')
const { getSubjectQuestions } = await import('../index.ts')

const subjects = getActiveSubjects()

test('at least one active subject is registered', () => {
  assert.ok(subjects.length > 0, 'getActiveSubjects() returned nothing — subjects.ts registry broken?')
})

test('every active subject has at least one question', () => {
  const empty = subjects.filter((s) => getSubjectQuestions(s.id).length === 0)
  assert.deepEqual(empty.map((s) => s.id), [], `subjects with zero questions: ${empty.map((s) => s.id).join(', ')}`)
})

// 2026-07-31（非 MC 題型接線 Phase 2 第一步）：斷言按 `q.type` 分流。
//
// 點解要先改測試：呢度原本對【每科每題】硬 assert「4 個選項 + correctIndex 喺範圍內」。
// 一旦題庫出現 text／long 題，佢哋根本冇 `options`／`correctIndex`，全部 25 科即時
// fail。憲章 §6 明文禁止「以 feature change 令現有數據集失效」，所以次序係
// 【先令測試識得分流，再放寬閘同出口】，唔可以倒轉。
//
// 分流唔等於放鬆：每個題型各有自己嘅必要條件，MC 嗰套一個字都冇改。
// 用結構化 shape 而唔係 import 型別：本檔要同時驗「唔應該存在嘅欄位冇出現」
// （例如 long 題唔准帶 correctIndex），而收窄過嘅 union 型別會令嗰啲斷言
// 喺編譯期被當成死碼 —— 但佢哋要防嘅正正係執行期真係有人塞咗落去。
type AnyRow = {
  id?: string
  type?: string
  content?: string
  options?: string[]
  optionsEn?: string[]
  correctIndex?: number
  referenceAnswer?: string
}
const isMC = (q: AnyRow) => (q.type ?? 'mc') === 'mc'

for (const s of subjects) {
  test(`${s.id}: question ids are unique, every type is well-formed`, () => {
    const qs = getSubjectQuestions(s.id)
    const seenIds = new Set()
    for (const q of qs as unknown as AnyRow[]) {
      assert.ok(!seenIds.has(q.id), `duplicate id "${q.id}" in subject "${s.id}"`)
      seenIds.add(q.id)

      // ── 跨題型共通 ──────────────────────────────────────────────────────────
      assert.ok(q.id && String(q.id).length > 0, `empty id in subject "${s.id}"`)
      assert.ok(q.content && String(q.content).length > 0, `${q.id}: empty content`)
      assert.ok(
        ['mc', 'text', 'long'].includes((q.type as string | undefined) ?? 'mc'),
        `${q.id}: unknown question type ${JSON.stringify(q.type)}`,
      )

      if (isMC(q)) {
        // ── MC：原有斷言原封不動 ────────────────────────────────────────────
        const opts = q.options
        assert.ok(Array.isArray(opts), `${q.id}: MC question has no options array`)
        assert.equal(opts!.length, 4, `${q.id}: expected 4 options, got ${opts!.length}`)
        assert.equal(
          new Set(opts!).size, 4,
          `${q.id}: duplicate option text (zh) — ${JSON.stringify(opts)}`,
        )

        if (q.optionsEn) {
          assert.equal(q.optionsEn.length, opts!.length, `${q.id}: optionsEn/options length mismatch`)
          assert.equal(
            new Set(q.optionsEn).size, q.optionsEn.length,
            `${q.id}: duplicate option text (en) — ${JSON.stringify(q.optionsEn)}`,
          )
        }

        assert.ok(
          Number.isInteger(q.correctIndex) && q.correctIndex! >= 0 && q.correctIndex! < opts!.length,
          `${q.id}: correctIndex ${q.correctIndex} out of bounds for ${opts!.length} options`,
        )
      } else {
        // ── text／long：冇客觀答案，改為驗「自評所需嘅材料齊唔齊」──────────────
        // 呢兩個題型【永不機器批改】：提交後攤開參考答案，學生自評。所以參考答案
        // 缺失就等於功能壞死（學生冇嘢對照），比 MC 少一個選項更嚴重。
        assert.ok(
          typeof q.referenceAnswer === 'string' && q.referenceAnswer.trim().length > 0,
          `${q.id}: ${q.type} question has no referenceAnswer — 學生冇嘢對照，自評無法進行`,
        )
        // 反向斷言：唔可以偷偷帶住 MC 欄位扮客觀題
        assert.equal(q.options, undefined, `${q.id}: ${q.type} question must not carry \`options\``)
        assert.equal(
          q.correctIndex, undefined,
          `${q.id}: ${q.type} question must not carry \`correctIndex\` —— 呢個題型冇客觀對錯`,
        )
      }
    }
  })
}

// 題型分佈 —— 唔係閘，係可見度。長題目一入庫呢度就會反映出嚟。
test('question-type distribution across all subjects', () => {
  const tally: Record<string, number> = { mc: 0, text: 0, long: 0 }
  for (const s of subjects) {
    for (const q of getSubjectQuestions(s.id) as { type?: string }[]) {
      tally[q.type ?? 'mc'] = (tally[q.type ?? 'mc'] ?? 0) + 1
    }
  }
  console.log(`    type distribution → mc ${tally.mc} · text ${tally.text} · long ${tally.long}`)
  assert.ok(tally.mc > 0, 'no MC questions at all — bank registry broken?')
})
