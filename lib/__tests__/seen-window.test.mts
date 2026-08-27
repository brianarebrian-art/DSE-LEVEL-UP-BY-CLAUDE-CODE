// seen.ts 嘅 WINDOW 必須大過最大嗰科嘅題數。
//
// 點解要有呢個測試：WINDOW 係一個靜態常數，而題庫係一路加嘅。兩者之間嘅關係
// 冇任何嘢守住，所以題庫大過 WINDOW 嗰一日唔會有任何訊號 —— 學生只會發現
// 「做極都係嗰啲題」，而冇人知道原因喺呢一行。2026-08-27 實測時舊值 300 已經
// 令五科退化，其中數學只保證頭 33% 唔重複。
//
// 呢個測試令個不變式自己出聲：題庫升穿 WINDOW，CI 即刻紅。
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const mod = async <T,>(p: string): Promise<T> =>
  await import(p).then((m: Record<string, unknown>) => (m.default ?? m) as T)

test('seen.ts 嘅 WINDOW 大過最大嗰科嘅題數（否則學生做唔晒就撞返舊題）', async () => {
  const src = readFileSync(new URL('../seen.ts', import.meta.url), 'utf8')
  const m = src.match(/const WINDOW = (\d+)/)
  assert.ok(m, 'seen.ts 搵唔到 WINDOW 常數')
  const WINDOW = Number(m![1])

  const { loadSubjectQuestions } = await mod<{
    loadSubjectQuestions: (id: string) => Promise<unknown[]>
  }>('../../data/questions/load.ts')
  const { subjects } = await mod<{ subjects: Array<Record<string, string>> }>(
    '../../data/subjects.ts',
  )

  const over: string[] = []
  let biggest = 0
  for (const s of subjects) {
    const n = (await loadSubjectQuestions(s.id).catch(() => [])).length
    if (n > biggest) biggest = n
    if (n > WINDOW) over.push(`${s.id} ${n} 條 > WINDOW ${WINDOW}`)
  }
  assert.deepEqual(
    over,
    [],
    `題庫超咗 seen.ts 嘅 WINDOW —— 學生會喺仲有未做過嘅題目時撞返舊題。\n` +
      `最大科目 ${biggest} 條。請調高 lib/seen.ts 嘅 WINDOW。\n  ` +
      over.join('\n  '),
  )
})
