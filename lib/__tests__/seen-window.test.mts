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


// ── 輪替規則：學生要做得曬成個題庫 ────────────────────────────────────────
//
// 2026-08-27：書寫題 runner（?mode=long）由頭到尾冇做輪替 —— 純
// `shuffle(pool).slice(0, 3)`。數學書寫題上線 30 條嗰日實測到：
//   · 做勻 30 條平均要 38.9 個 session（有輪替嘅話係 10 個），最壞 129 個
//   · 做夠 10 個 session（30 條嘅份量）平均只見過 19.5 / 30 條
// 呢度鎖住嗰條規則本身，唔係鎖住 runner —— 規則錯咗，兩個 runner 一齊錯。

const { orderUnseenFirst } = await import('../seen.ts')
const noShuffle = <T,>(a: T[]): T[] => a
const q = (id: string) => ({ id })

test('未見過嘅永遠排喺見過嘅前面', () => {
  const pool = [q('a'), q('b'), q('c'), q('d')]
  const out = orderUnseenFirst(pool, ['a', 'c'], noShuffle).map((x) => x.id)
  assert.deepEqual(out.slice(0, 2).sort(), ['b', 'd'], '未見過嘅要排頭')
  assert.deepEqual(out.slice(2), ['c', 'a'], '見過嘅要最耐冇見嗰個行先')
})

test('全部見過時，出最耐冇見嗰批（唔會卡死）', () => {
  const pool = [q('a'), q('b'), q('c')]
  // seen 最前 = 最近見過
  assert.deepEqual(orderUnseenFirst(pool, ['c', 'b', 'a'], noShuffle).map((x) => x.id), ['a', 'b', 'c'])
})

test('【核心】連續做落去，ceil(N/K) 個 session 就見勻全部，零重複', () => {
  const N = 30, K = 3
  const pool = Array.from({ length: N }, (_, i) => q('q' + i))
  const seen: string[] = []
  const shown = new Set<string>()
  let dup = 0
  for (let s = 0; s < Math.ceil(N / K); s++) {
    const batch = orderUnseenFirst(pool, seen, noShuffle).slice(0, K)
    for (const x of batch) {
      if (shown.has(x.id)) dup++
      shown.add(x.id)
      seen.unshift(x.id) // recordSeen 語意：最新排最前
    }
  }
  assert.equal(shown.size, N, `${Math.ceil(N / K)} 個 session 應該見勻 ${N} 條，實際 ${shown.size} 條`)
  assert.equal(dup, 0, `第一輪唔應該有任何重複，實際重複 ${dup} 條`)
})

test('題庫行勻一轉之後先至重複 —— 而且由最耐冇見嗰條開始', () => {
  const pool = [q('a'), q('b'), q('c')]
  const seen = ['c', 'b', 'a'] // a 最耐冇見
  assert.equal(orderUnseenFirst(pool, seen, noShuffle)[0].id, 'a')
})


test('兩個 runner 都真係接咗輪替規則（唔止規則啱，要真係用）', async () => {
  // 上面幾條測試只證明規則本身啱。規則寫得幾好，runner 唔叫佢就等於冇 ——
  // 書寫題 runner 就係咁樣靜靜地淨係 shuffle().slice() 咗一排。
  const { readFileSync } = await import('node:fs')
  for (const f of ['app/practice/LongPracticeSession.tsx', 'app/practice/PracticeSession.tsx']) {
    const src = readFileSync(f, 'utf8')
    assert.ok(/getSeen\(/.test(src), `${f} 冇讀 getSeen —— 唔知學生見過乜`)
    assert.ok(/recordSeen\(/.test(src), `${f} 冇叫 recordSeen —— 今次出過乜唔會記低，下一卷避唔開`)
  }
  const long = readFileSync('app/practice/LongPracticeSession.tsx', 'utf8')
  assert.ok(/orderUnseenFirst\(/.test(long), '書寫題 runner 冇用共用輪替規則')
  assert.ok(
    !/return shuffle\(pool\)\.slice\(/.test(long),
    '書寫題 runner 回復咗純隨機 shuffle(pool).slice() —— 學生會做唔曬成個題庫',
  )
})
