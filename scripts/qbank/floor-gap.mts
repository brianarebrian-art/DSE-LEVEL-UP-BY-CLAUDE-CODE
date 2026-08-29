// ============================================================================
// floor-gap.mts —— 25 科分佈報告 ＋ 課題下限缺口（連未簽名草稿一齊計）
// ----------------------------------------------------------------------------
// coverage-report.mts 只計已入庫嘅題目。呢個報告額外加埋 drafts/ 入面
// 等緊人手審批嘅草稿，答一條問題：【簽晒名之後，仲有邊個課題唔夠 10 條】。
//
// 草稿唔等於已入庫 —— 憲章 §12：機器永不自動入庫。呢度計佢哋，
// 係為咗計算仲要寫幾多條，唔係當佢哋已經生效。
//
// ⚠️ 2026-08-29 修正：舊版把 drafts/ 全部檔案一齊計，包括仲未簽名、
// 亦唔會即刻入庫嗰批舊草稿，於是 p1_vocab_ref 明明 live 只有 5 條、
// floor2 草稿只補 3 條（合共 8），舊版仍然報「已達下限」。
// 而家分開報兩個數：【已入庫】同【連草稿】—— 前者先係學生見到嘅。
//
//   npx tsx scripts/qbank/floor-gap.mts
// ============================================================================
// 現有題數 ＋ 待簽草稿 → 仲差幾多先夠每個課題 10 條
import { readFileSync, readdirSync } from 'node:fs'
const idx = await import('../../data/questions/index.ts') as any
const S: [string,string][] = [['math','數學'],['m1','M1'],['m2','M2'],['physics','物理'],['chemistry','化學'],
['biology','生物'],['english','英文'],['chinese','中文'],['bafs','企會財'],['ict','ICT'],['economics','經濟'],
['csd','公社'],['chinese-history','中史'],['history','歷史'],['geography','地理'],['chinese-literature','中文學'],
['english-literature','英文學'],['ethics-religious','倫理'],['ths','旅款'],['health-management','健管'],
['design-tech','設應科'],['visual-arts','視藝'],['music','音樂'],['pe','體育'],['technology-living','科技生活']]
const draft: Record<string, Record<string, number>> = {}
for (const f of readdirSync('scripts/qbank/drafts')) {
  if (!f.endsWith('.json') || f.includes('.decisions.') || f.includes('.review.')) continue
  let d: any
  try { d = JSON.parse(readFileSync('scripts/qbank/drafts/' + f, 'utf8')) } catch { continue }
  for (const q of (Array.isArray(d) ? d : d.questions ?? d.drafts ?? d.items ?? [])) {
    const s = q.subject, t = q.topicId ?? q.topic
    if (!s || !t) continue
    ;(draft[s] ??= {})[t] = (draft[s][t] ?? 0) + 1
  }
}
const FLOOR = 10
let gapTotal = 0
let liveGapTotal = 0
const rows: string[] = []
for (const [id, zh] of S) {
  const qs = idx.getSubjectQuestions(id) as any[]
  const tps = idx.getSubjectTopics(id) as {id:string,zh:string}[]
  const live: Record<string, number> = {}
  for (const q of qs) live[q.topic] = (live[q.topic] ?? 0) + 1
  const mc = qs.filter((q) => (q.type ?? 'mc') === 'mc').length
  const gaps: string[] = []
  const liveGaps: string[] = []
  for (const t of tps) {
    const nLive = live[t.id] ?? 0
    const n = nLive + (draft[id]?.[t.id] ?? 0)
    if (nLive < FLOOR) { liveGapTotal += FLOOR - nLive; liveGaps.push(`${t.id}(${nLive})`) }
    if (n < FLOOR) { gaps.push(`${t.id}(${n})`); gapTotal += FLOOR - n }
  }
  const counts = tps.map((t) => live[t.id] ?? 0)
  rows.push(`${zh.padEnd(5)} MC ${String(mc).padStart(5)} 書寫 ${String(qs.length-mc).padStart(3)} · ${String(tps.length).padStart(2)} 課題 · 最薄 ${String(Math.min(...counts)).padStart(3)} 最厚 ${String(Math.max(...counts)).padStart(4)}${liveGaps.length ? ` · 【已入庫】未夠 10：${liveGaps.join(' ')}` : ''}${gaps.length ? ` · 【連草稿】仍未夠：${gaps.join(' ')}` : ''}`)
}
console.log(rows.join('\n'))
console.log(`\n【已入庫】仲要補 ${liveGapTotal} 條先做到全站每課題 ≥ ${FLOOR}`)
console.log(`【連未簽名草稿一齊計】仲要補 ${gapTotal} 條`)
