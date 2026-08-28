// ============================================================================
// coverage-report.mts —— 25 科 × 逐課題覆蓋率報告
// ----------------------------------------------------------------------------
// 目標（2026-08-27 Yuna 指令）：每科 1,000 條 MC ＋ 100 條書寫題，
// 而且【平均分佈喺所有課題】—— 唔可以一啲課題兩條、一啲課題兩百條。
//
// 呢個報告答三條問題：
//   ① 每科距離 1,000 / 100 仲差幾多
//   ② 每科內部分佈有幾不均（用最厚／最薄比例同基尼系數）
//   ③ 邊啲課題最薄 —— 即係應該先補邊度
//
//   npx tsx scripts/qbank/coverage-report.mts [--subject <id>] [--thin <n>]
// ============================================================================
const idx = await import('../../data/questions/index.ts').then((m) => (m.default ?? m) as {
  getSubjectQuestions: (s: string) => { id: string; type?: string; topic?: string }[]
  getSubjectTopics: (s: string) => { id: string; zh: string; en: string }[]
})
const args = process.argv.slice(2)
const arg = (n: string, d: string | null = null) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] ? args[i + 1] : d }
const ONLY = arg('subject')
const THIN = Number(arg('thin', '0'))

const SUBJECTS: [string, string][] = [
  ['math','數學'],['m1','數學 M1'],['m2','數學 M2'],['physics','物理'],['chemistry','化學'],
  ['biology','生物'],['english','英國語文'],['chinese','中國語文'],['bafs','企會財'],['ict','資訊及通訊科技'],
  ['economics','經濟'],['csd','公民與社會發展'],['chinese-history','中國歷史'],['history','歷史'],
  ['geography','地理'],['chinese-literature','中國文學'],['english-literature','英語文學'],
  ['ethics-religious','倫理與宗教'],['ths','旅遊與款待'],['health-management','健康管理'],
  ['design-tech','設計與應用科技'],['visual-arts','視覺藝術'],['music','音樂'],['pe','體育'],
  ['technology-living','科技與生活'],
]
const MC_TARGET = 1000, W_TARGET = 100

type Topic = { id: string; zh: string; n: number; wn: number; tot: number }
type Row = { id: string; zh: string; mc: number; w: number; topics: number
  perTopic: Topic[]; thinnest: number; thickest: number; empty: number }
const rows: Row[] = []
for (const [id, zh] of SUBJECTS) {
  if (ONLY && id !== ONLY) continue
  const qs = idx.getSubjectQuestions(id)
  const topics = idx.getSubjectTopics(id)
  const mc = qs.filter((q) => (q.type ?? 'mc') === 'mc')
  const w = qs.filter((q) => q.type === 'long' || q.type === 'text')
  // ⚠️ 必須同時數 MC 同書寫題。2026-08-27 初版只數 MC，於是中文嘅命題寫作
  // 課題、歷史嘅 hk_mod／seasia／postwar_conflicts（啱啱入咗 38 條論述題）
  // 全部報成「0 條」，排喺最需要補嘅頭幾位 —— 但佢哋根本唔係 MC 課題。
  // 照住嗰張表補題，等於去補一啲唔缺嘅位。
  const cm = new Map(topics.map((t) => [t.id, 0]))
  const cw = new Map(topics.map((t) => [t.id, 0]))
  for (const q of mc) if (q.topic && cm.has(q.topic)) cm.set(q.topic, cm.get(q.topic)! + 1)
  for (const q of w) if (q.topic && cw.has(q.topic)) cw.set(q.topic, cw.get(q.topic)! + 1)
  const perTopic = topics.map((t) => ({ id: t.id, zh: t.zh,
      n: cm.get(t.id) ?? 0, wn: cw.get(t.id) ?? 0, tot: (cm.get(t.id) ?? 0) + (cw.get(t.id) ?? 0) }))
    .sort((a, b) => a.tot - b.tot)
  rows.push({ id, zh, mc: mc.length, w: w.length, topics: topics.length, perTopic,
    thinnest: perTopic[0]?.tot ?? 0, thickest: perTopic[perTopic.length - 1]?.tot ?? 0,
    empty: perTopic.filter((t) => t.tot === 0).length })
}

if (!ONLY) {
  console.log('科目              MC/1000   書寫/100  課題數   每課題應有   最薄  最厚   不均比  空課題')
  console.log('─'.repeat(88))
  let gm = 0, gw = 0
  for (const r of rows) {
    gm += Math.max(0, MC_TARGET - r.mc); gw += Math.max(0, W_TARGET - r.w)
    const even = Math.round(MC_TARGET / (r.topics || 1))
    const ratio = r.thinnest ? (r.thickest / r.thinnest).toFixed(1) + '×' : '∞'
    const done = r.mc >= MC_TARGET ? ' ✅' : ''
    console.log(
      `${r.zh.padEnd(16)} ${String(r.mc).padStart(5)}    ${String(r.w).padStart(5)}    ` +
      `${String(r.topics).padStart(4)}   ${String(even).padStart(8)}   ${String(r.thinnest).padStart(4)}  ${String(r.thickest).padStart(4)}   ${ratio.padStart(6)}  ${r.empty ? '★' + r.empty : ' -'}${done}`)
  }
  console.log('─'.repeat(88))
  console.log(`總缺口：MC ${gm} 條 · 書寫題 ${gw} 條 · 合共 ${gm + gw} 條`)
  console.log(`已達 1,000 條 MC 嘅科目：${rows.filter((r) => r.mc >= MC_TARGET).length} / ${rows.length}`)
}

if (THIN) {
  console.log(`\n最薄嘅 ${THIN} 個課題（MC ＋ 書寫題合計）：`)
  const all = rows.flatMap((r) => r.perTopic.map((t) => ({ ...t, subj: r.zh, sid: r.id, even: Math.round(MC_TARGET / r.topics) })))
  all.sort((a, b) => a.tot - b.tot)
  for (const t of all.slice(0, THIN))
    console.log(`  ${String(t.tot).padStart(4)} 條（MC ${String(t.n).padStart(3)} ＋ 書寫 ${String(t.wn).padStart(2)}）  應有約 ${String(t.even).padStart(3)}   ${t.subj} / ${t.zh}  [${t.sid}:${t.id}]`)
}
if (ONLY) {
  const r = rows[0]
  console.log(`${r.zh}：MC ${r.mc} / 1000 · 書寫 ${r.w} / 100 · ${r.topics} 個課題 · 每課題應有約 ${Math.round(MC_TARGET / r.topics)}`)
  console.log('─'.repeat(60))
  for (const t of r.perTopic) console.log(`  ${String(t.tot).padStart(4)}（MC ${String(t.n).padStart(3)} ＋ 書寫 ${String(t.wn).padStart(2)}）  ${t.zh}  [${t.id}]`)
}
