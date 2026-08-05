// 結果覆核嘅行為測試。
//
// 重點守三樣：① 重批算術正確；② 對唔上題庫嘅 id 唔會靜靜當答錯（會分開報）；
// ③ shape-guard 擋得住畸形／過大 payload（呢個 endpoint 收匿名輸入）。

import { test } from 'node:test'
import assert from 'node:assert/strict'

const { regrade, isSubmittedAnswers, MAX_ANSWERS } = await import('../verifyResult.ts')

const KEY: Record<string, string> = {
  q1: '正解一',
  q2: '正解二',
  q3: '正解三',
}
const keyOf = (id: string) => KEY[id]

// ── regrade ─────────────────────────────────────────────────────────────

test('全對', () => {
  const r = regrade(
    [
      { questionId: 'q1', selectedZh: '正解一' },
      { questionId: 'q2', selectedZh: '正解二' },
    ],
    keyOf,
  )
  assert.deepEqual(r, { score: 2, total: 2, unknownIds: [] })
})

test('部分對', () => {
  const r = regrade(
    [
      { questionId: 'q1', selectedZh: '正解一' },
      { questionId: 'q2', selectedZh: '錯嘅' },
      { questionId: 'q3', selectedZh: '正解三' },
    ],
    keyOf,
  )
  assert.equal(r.score, 2)
  assert.equal(r.total, 3)
})

test('冇作答（null）計入總數但唔得分', () => {
  const r = regrade([{ questionId: 'q1', selectedZh: null }], keyOf)
  assert.deepEqual(r, { score: 0, total: 1, unknownIds: [] })
})

test('前後左右空白唔影響判分', () => {
  const r = regrade([{ questionId: 'q1', selectedZh: '  正解一 ' }], keyOf)
  assert.equal(r.score, 1)
})

test('【核心】答案庫冇嘅題目 id 唔會當答錯 —— 分開報 unknownIds', () => {
  // 當成答錯就會誣衊一個其實答啱咗、只係揸緊舊 bundle 嘅學生。
  const r = regrade(
    [
      { questionId: 'q1', selectedZh: '正解一' },
      { questionId: 'deleted_q', selectedZh: '任何嘢' },
    ],
    keyOf,
  )
  assert.equal(r.score, 1)
  assert.equal(r.total, 1) // 唔識嗰題唔計入總數
  assert.deepEqual(r.unknownIds, ['deleted_q'])
})

test('全部 id 都對唔上 → total 0（route 會據此回 verified:false）', () => {
  const r = regrade([{ questionId: 'x', selectedZh: 'y' }], keyOf)
  assert.equal(r.total, 0)
  assert.equal(r.unknownIds.length, 1)
})

test('空提交唔會出 NaN', () => {
  assert.deepEqual(regrade([], keyOf), { score: 0, total: 0, unknownIds: [] })
})

test('刻意唔做寬鬆正規化：全形／標點差異照樣算錯', () => {
  // 前端係嚴格文字比對。覆核如果比前端寬鬆，就會遮蔽前端嘅批改 bug ——
  // 而搵出呢類不一致正正係呢個覆核唯一嘅實際用途。
  const r = regrade([{ questionId: 'q1', selectedZh: '正解一。' }], keyOf)
  assert.equal(r.score, 0)
})

test('分數永遠唔會大過總數', () => {
  const many = Array.from({ length: 50 }, () => ({ questionId: 'q1', selectedZh: '正解一' }))
  const r = regrade(many, keyOf)
  assert.equal(r.score, 50)
  assert.equal(r.total, 50)
  assert.ok(r.score <= r.total)
})

// ── shape-guard（匿名端點，輸入一律唔可信）────────────────────────────

test('接受合法 payload', () => {
  assert.equal(isSubmittedAnswers([{ questionId: 'q1', selectedZh: 'a' }]), true)
  assert.equal(isSubmittedAnswers([{ questionId: 'q1', selectedZh: null }]), true)
})

test('拒絕非陣列／空陣列', () => {
  for (const bad of [null, undefined, {}, 'q1', 42, []]) {
    assert.equal(isSubmittedAnswers(bad), false, `${JSON.stringify(bad)} 應該被拒`)
  }
})

test('拒絕超長陣列（防大 payload）', () => {
  const tooMany = Array.from({ length: MAX_ANSWERS + 1 }, () => ({
    questionId: 'q1',
    selectedZh: 'a',
  }))
  assert.equal(isSubmittedAnswers(tooMany), false)
  assert.equal(isSubmittedAnswers(tooMany.slice(0, MAX_ANSWERS)), true)
})

test('拒絕缺欄／型別錯／超長字串', () => {
  const bad: unknown[] = [
    [{ selectedZh: 'a' }], // 冇 questionId
    [{ questionId: '', selectedZh: 'a' }], // 空 id
    [{ questionId: 123, selectedZh: 'a' }], // id 唔係 string
    [{ questionId: 'q1', selectedZh: 42 }], // selected 唔係 string|null
    [{ questionId: 'x'.repeat(101), selectedZh: 'a' }], // id 過長
    [{ questionId: 'q1', selectedZh: 'x'.repeat(501) }], // 選項文字過長
    [null],
    ['not an object'],
  ]
  for (const b of bad) {
    assert.equal(isSubmittedAnswers(b), false, `${JSON.stringify(b)} 應該被拒`)
  }
})

// ── 對真題庫（確保 route 揀嘅欄位真係存在）─────────────────────────────

test('【迴歸】correctZh 唔係儲存欄位 —— 正解一定要由 options[correctIndex] 導出', async () => {
  // 呢條測試釘死一個真實踩過嘅坑：route 初版寫 `q.correctZh`，但 MCQuestion
  // 只有 correctIndex + options[]。結果係答案表全 undefined，覆核永遠靜靜
  // 回 verified:false —— 一個「睇落有做嘢、實際乜都冇驗」嘅端點。
  const m = (await import('../../data/questions/economics.ts')) as Record<string, unknown>
  const qs = m.economicsQuestions as {
    id: string
    type?: string
    options: string[]
    correctIndex: number
    correctZh?: string
  }[]
  const mc = qs.filter((q) => q.type === 'mc')
  assert.ok(mc.length > 0)

  for (const q of mc) {
    assert.equal(q.correctZh, undefined, `${q.id} 竟然有 correctZh —— 導出方式改咗，要同步 route`)
    assert.ok(Number.isInteger(q.correctIndex))
    assert.ok(q.correctIndex >= 0 && q.correctIndex < q.options.length, `${q.id} correctIndex 越界`)
    assert.equal(typeof q.options[q.correctIndex], 'string')
    assert.ok(q.options[q.correctIndex].length > 0)
  }
})

test('用真題庫嘅導出方式重批，答啱得分、答錯唔得分', async () => {
  const m = (await import('../../data/questions/economics.ts')) as Record<string, unknown>
  const qs = (m.economicsQuestions as { id: string; type?: string; options: string[]; correctIndex: number }[])
    .filter((q) => q.type === 'mc')
    .slice(0, 3)

  const key = new Map(qs.map((q) => [q.id, q.options[q.correctIndex]]))
  const keyOfReal = (id: string) => key.get(id)

  const allRight = regrade(
    qs.map((q) => ({ questionId: q.id, selectedZh: q.options[q.correctIndex] })),
    keyOfReal,
  )
  assert.equal(allRight.score, 3)
  assert.equal(allRight.total, 3)

  const allWrong = regrade(
    qs.map((q) => ({
      questionId: q.id,
      // 揀一個【唔係】正解嘅選項
      selectedZh: q.options.find((_, i) => i !== q.correctIndex) ?? null,
    })),
    keyOfReal,
  )
  assert.equal(allWrong.score, 0)
  assert.equal(allWrong.total, 3)
})
