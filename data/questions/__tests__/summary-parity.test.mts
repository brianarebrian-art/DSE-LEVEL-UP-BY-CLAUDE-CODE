// ============================================================================
// summary-parity.test.mts —— summary.generated.ts 必須同真題庫一致
// ----------------------------------------------------------------------------
// summary.generated.ts 存在嘅理由係令 client 組件唔使 import barrel（唔使將
// 2.2MB 題目 build 入瀏覽器）。代價係多咗一份【複本】，而複本會漂移。
//
// 漂移嘅後果唔係「數字舊咗」咁簡單：呢啲數字全部係【學生睇得到】嘅 ——
// 首頁「26,204 條題目」、科目卡題數、課題 chip 上面嘅逐課題題數。
// 顯示同題庫唔符嘅數字＝向學生提供錯誤資訊，同憲章 §8「不虛構數據」同一類。
// Topic.count 本身就係為咗同一個理由，由人手維護改成即時衍生（見 types.ts）。
//
// 所以呢度每次都拎真題庫重算一次，逐科逐課題比對。唔一致就跑 npm run gen:summary。
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
// 動態 import —— 同 loader-parity.test.mts 一致。tsx 4.19.2 之下靜態 import
// 呢啲 .ts 模組會拋 "does not provide an export named …"。
const { getSubjectQuestions, getSubjectTopics } = await import('../index.ts')
const { SUBJECT_SUMMARY, SUBJECT_TOPICS, TOTAL_QUESTIONS } = await import('../summary.generated.ts')
const { subjects } = await import('../../subjects.ts')

const active = subjects.filter((s) => s.isActive !== false)
const FIX = '——跑 `npm run gen:summary` 重新產生'

test('逐科題數（total／mc／written／topics）同真題庫一致', () => {
  for (const s of active) {
    const qs = getSubjectQuestions(s.id)
    const mc = qs.filter((q) => (q.type ?? 'mc') === 'mc').length
    const got = SUBJECT_SUMMARY[s.id]
    assert.ok(got, `${s.id} 唔喺 SUBJECT_SUMMARY 入面 ${FIX}`)
    assert.deepEqual(
      got,
      { total: qs.length, mc, written: qs.length - mc, topics: getSubjectTopics(s.id).length },
      `${s.id} 題數對唔上 ${FIX}`,
    )
  }
  assert.equal(Object.keys(SUBJECT_SUMMARY).length, active.length, `科目數對唔上 ${FIX}`)
})

test('逐課題題數同真題庫一致', () => {
  for (const s of active) {
    const live = getSubjectTopics(s.id)
    const gen = SUBJECT_TOPICS[s.id]
    assert.ok(gen, `${s.id} 唔喺 SUBJECT_TOPICS 入面 ${FIX}`)
    assert.equal(gen.length, live.length, `${s.id} 課題數對唔上 ${FIX}`)
    for (const t of live) {
      const g = gen.find((x) => x.id === t.id)
      assert.ok(g, `${s.id}／${t.id} 課題唔見咗 ${FIX}`)
      // 呢三個數係課題 chip 上面直接顯示畀學生睇嘅。
      assert.equal(g.count, t.count, `${s.id}／${t.id} count 對唔上 ${FIX}`)
      assert.equal(g.mcCount, t.mcCount, `${s.id}／${t.id} mcCount 對唔上 ${FIX}`)
      assert.equal(g.writtenCount, t.writtenCount, `${s.id}／${t.id} writtenCount 對唔上 ${FIX}`)
      // 課題名亦要一致 —— 改咗 zh／en 而冇重新產生，學生會見到舊名。
      assert.equal(g.zh, t.zh, `${s.id}／${t.id} 課題名對唔上 ${FIX}`)
    }
  }
})

test('TOTAL_QUESTIONS 等於逐科加起嚟', () => {
  const sum = active.reduce((n, s) => n + getSubjectQuestions(s.id).length, 0)
  assert.equal(TOTAL_QUESTIONS, sum, `全站總題數對唔上 ${FIX}`)
})
