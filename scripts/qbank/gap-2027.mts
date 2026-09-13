// ============================================================================
// gap-2027.mts —— 「MC 30,000 / 非 MC 1,200」離目標仲差幾多，逐科攤開
// ----------------------------------------------------------------------------
// 點解要有呢個：2027 目標一直只有兩個總數（3,936 / 1,060），而總數答唔到
// 「聽日應該出邊科」。逐科攤開之後先睇得出缺口其實極度集中 ——
// 唔係 25 科各差少少，而係幾科差好遠。
//
// 三欄要分清楚：
//   live      —— 學生而家做得到
//   已簽待上  —— 已有實名審批、過晒閘，但未 wire 入 load.ts（唔使再出題）
//   要新寫    —— 連草稿都未有，呢個先係真.缺口
//
// 用法：npm run qbank:gap
// ============================================================================

import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const mod = async <T>(p: string): Promise<T> =>
  await import(p).then((m: Record<string, unknown>) => (m.default ?? m) as T)

const { loadSubjectQuestions, loadWrittenQuestions } = await mod<{
  loadSubjectQuestions: (id: string) => Promise<Array<{ id: string; type?: string }>>
  loadWrittenQuestions: (id: string) => Promise<Array<{ id: string; type?: string }>>
}>('../../data/questions/load.ts')
const { getActiveSubjects } = await mod<{
  getActiveSubjects: () => Array<{ id: string; nameZh?: string; name?: string }>
}>('../../data/subjects.ts')

const MC_TARGET = 30_000
const NONMC_TARGET = 1_200

const subjects = getActiveSubjects()
// 目標係全站總數，唔係逐科 —— 逐科配額用平均攤，只作參考基準。
const perSubjMc = Math.ceil(MC_TARGET / subjects.length)
const perSubjNon = Math.ceil(NONMC_TARGET / subjects.length)

type Row = { id: string; mc: number; non: number; qMc: number; qNon: number }
const rows: Row[] = []
const liveIds = new Set<string>()

for (const s of subjects) {
  const byId = new Map<string, string>()
  for (const q of await loadSubjectQuestions(s.id)) byId.set(q.id, q.type ?? 'mc')
  try { for (const q of await loadWrittenQuestions(s.id)) byId.set(q.id, q.type ?? 'long') } catch { /* 冇寫作題 */ }
  let mc = 0, non = 0
  for (const [id, t] of byId) { liveIds.add(id); t === 'mc' ? mc++ : non++ }
  rows.push({ id: s.id, mc, non, qMc: 0, qNon: 0 })
}

// 已簽名但未上線嘅草稿 —— 逐科逐型點數
const D = 'scripts/qbank/drafts'
const byId = new Map(rows.map((r) => [r.id, r]))
for (const f of readdirSync(D)) {
  if (!f.endsWith('.json') || f.startsWith('_') || f.endsWith('.decisions.json')
    || f.endsWith('.rejected.json') || f.endsWith('.sample.json')) continue
  const dp = join(D, f.replace(/\.json$/, '.decisions.json'))
  if (!existsSync(dp)) continue
  const dec = JSON.parse(readFileSync(dp, 'utf8'))
  if (!String(dec?._meta?.reviewer ?? '').trim()) continue
  const ok = new Set(Object.entries(dec.decisions ?? {}).filter(([, v]) => v === 'approved').map(([k]) => k))
  const raw = JSON.parse(readFileSync(join(D, f), 'utf8'))
  const arr = Array.isArray(raw) ? raw : (raw.questions ?? raw.rows ?? raw.drafts ?? [])
  for (const q of arr) {
    if (!ok.has(q.id) || liveIds.has(q.id)) continue      // 未批／已上線都唔計
    const r = byId.get(dec._meta.subject ?? q.subject)
    if (!r) continue
    ;(q.type ?? 'mc') === 'mc' ? r.qMc++ : r.qNon++
  }
}

const pad = (s: string, n: number) => s + ' '.repeat(Math.max(0, n - [...s].reduce((a, c) => a + (c.charCodeAt(0) > 0x2e80 ? 2 : 1), 0)))
const num = (n: number, w: number) => String(n).padStart(w)

console.log('\n' + '─'.repeat(78))
console.log(`  2027 題量缺口 —— MC ${MC_TARGET.toLocaleString()} / 非 MC ${NONMC_TARGET.toLocaleString()}`)
console.log(`  逐科參考配額：MC ${perSubjMc} · 非 MC ${perSubjNon}（總數 ÷ ${subjects.length} 科）`)
console.log('─'.repeat(78))
console.log(`  ${pad('科目', 22)}${pad('MC live', 9)}${pad('待上', 6)}${pad('距配額', 8)}  ${pad('非MC live', 11)}${pad('待上', 6)}${pad('距配額', 8)}`)

const sort = [...rows].sort((a, z) => (perSubjMc - z.mc - z.qMc) - (perSubjMc - a.mc - a.qMc))
let tMc = 0, tNon = 0, tQMc = 0, tQNon = 0, needMc = 0, needNon = 0
for (const r of sort) {
  const gMc = Math.max(0, perSubjMc - r.mc - r.qMc)
  const gNon = Math.max(0, perSubjNon - r.non - r.qNon)
  tMc += r.mc; tNon += r.non; tQMc += r.qMc; tQNon += r.qNon; needMc += gMc; needNon += gNon
  console.log(`  ${pad(r.id, 22)}${num(r.mc, 7)}  ${num(r.qMc, 4)}  ${num(gMc, 6)}    ${num(r.non, 9)}  ${num(r.qNon, 4)}  ${num(gNon, 6)}`)
}
console.log('─'.repeat(78))
console.log(`  ${pad('合計', 22)}${num(tMc, 7)}  ${num(tQMc, 4)}  ${num(needMc, 6)}    ${num(tNon, 9)}  ${num(tQNon, 4)}  ${num(needNon, 6)}`)
console.log('─'.repeat(78))
// ⚠️「距配額」逐科相加【唔等於】全站缺口：目標本身係全站總數，逐科配額只係
// 平均攤出嚟做參考。有科已經超額（math MC 1,509、ict 非 MC 110），超出嗰部分
// 會補返其他科，但逐科相加時會當佢係 0。所以兩個數要分開讀 ——
// 下面兩行先係目標本身。
console.log(`  （「距配額」逐科相加 = MC ${needMc} · 非 MC ${needNon}，係平均攤嘅參考值，`)
console.log(`    唔等於全站缺口 —— 超額科目會補返其他科。目標睇下面兩行。）`)
console.log('─'.repeat(78))
console.log(`  全站 MC     ${tMc} live ＋ ${tQMc} 待上 = ${tMc + tQMc} / ${MC_TARGET}   仲要寫 ${Math.max(0, MC_TARGET - tMc - tQMc)}`)
console.log(`  全站 非 MC  ${tNon} live ＋ ${tQNon} 待上 = ${tNon + tQNon} / ${NONMC_TARGET}   仲要寫 ${Math.max(0, NONMC_TARGET - tNon - tQNon)}`)
console.log('─'.repeat(78) + '\n')
