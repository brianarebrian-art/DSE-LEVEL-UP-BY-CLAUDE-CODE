// ============================================================================
// cap-plan.mts —— 模板封頂計劃：每個模板最多保留 6 條
// ----------------------------------------------------------------------------
//   npx tsx scripts/qbank/cap-plan.mts            # 報告 + 寫出補題訂單
//   npx tsx scripts/qbank/cap-plan.mts --ids      # 連逐條 id 一齊列出
//
// 【本腳本唔會改任何題庫檔。】佢只計數同出計劃。
// 真正執行封頂嘅次序係 Yuna 2026-08-21 拍板嘅：**先補，後剷** ——
// 剷咗幾多條，就要補返幾多條真正唔同嘅題上去，先至可以剷。
// 數學一剷就由 914 跌到 382，題量唔夠支撐重複練習；倒轉次序做，
// 等於用「題庫變細」去解決「題庫重複」，學生實際上蝕咗。
//
// ── 保留邊 6 條？──────────────────────────────────────────────────────────
// 唔可以「見到頭 6 條就留」。同一個模板嘅 139 條之中，如果頭 6 條啱啱全部
// 係中等難度，封頂之後該課題就淨返一種難度 —— 反而令難度分佈更差。
// 所以按難度輪流揀（easy → medium → hard → easy …），令保留嘅 6 條
// 盡量橫跨該模板實際存在嘅難度層。
//
// ── 「模板」點界定 ────────────────────────────────────────────────────────
// 把題幹入面所有數字換成 `#`、剝走 LaTeX 指令同標點，剩低嘅骨架相同 = 同一模板。
// 呢個定義刻意保守：只捉「同一句子換數字」，唔會把兩條真正唔同嘅題誤判為重複。
// ============================================================================
import { writeFileSync } from 'node:fs'
import { getActiveSubjects } from '../../data/subjects.ts'
import { getSubjectQuestions } from '../../data/questions/index.ts'

const CAP = 6
const SHOW_IDS = process.argv.includes('--ids')
const DIFFS = ['easy', 'medium', 'hard'] as const
type Diff = (typeof DIFFS)[number]
/** 憲章 3:5:2 —— 一節 20 題應派 6 易 / 10 中 / 4 難。 */
const TARGET_SHARE: Record<Diff, number> = { easy: 0.3, medium: 0.5, hard: 0.2 }

const skeleton = (s: string): string =>
  String(s)
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/[\d０-９]+(\.[\d]+)?/g, '#')
    .replace(/[\s{}()（）$,，.。、]/g, '')
    .toLowerCase()

interface Row { id: string; type: string; topic: string; topicZh: string; difficulty: Diff; content: string }

interface CutRow { subject: string; topic: string; topicZh: string; difficulty: Diff; id: string; skeleton: string }

const cuts: CutRow[] = []
const summary: {
  subject: string
  mcBefore: number; mcAfter: number; cut: number
  before: Record<Diff, number>; after: Record<Diff, number>
}[] = []

for (const s of getActiveSubjects()) {
  const mc = (getSubjectQuestions(s.id) as unknown as Row[]).filter((q) => q.type === 'mc')
  if (!mc.length) continue

  // 按模板分組
  const groups = new Map<string, Row[]>()
  for (const q of mc) {
    const k = skeleton(q.content)
    const g = groups.get(k)
    if (g) g.push(q); else groups.set(k, [q])
  }

  const keep = new Set<string>()
  for (const [k, g] of groups) {
    if (g.length <= CAP) { for (const q of g) keep.add(q.id); continue }
    // 按難度分桶，然後輪流抽 —— 令保留嘅 CAP 條盡量橫跨實際存在嘅難度層
    const buckets: Record<Diff, Row[]> = { easy: [], medium: [], hard: [] }
    for (const q of g) buckets[q.difficulty].push(q)
    let taken = 0
    for (let round = 0; taken < CAP; round++) {
      let progressed = false
      for (const d of DIFFS) {
        if (taken >= CAP) break
        const q = buckets[d][round]
        if (!q) continue
        keep.add(q.id); taken++; progressed = true
      }
      if (!progressed) break // 所有桶都抽乾（理論上唔會，因為 g.length > CAP）
    }
    for (const q of g) if (!keep.has(q.id)) cuts.push({ subject: s.id, topic: q.topic, topicZh: q.topicZh, difficulty: q.difficulty, id: q.id, skeleton: k })
  }

  const before: Record<Diff, number> = { easy: 0, medium: 0, hard: 0 }
  const after: Record<Diff, number> = { easy: 0, medium: 0, hard: 0 }
  for (const q of mc) { before[q.difficulty]++; if (keep.has(q.id)) after[q.difficulty]++ }
  summary.push({ subject: s.id, mcBefore: mc.length, mcAfter: keep.size, cut: mc.length - keep.size, before, after })
}

// ── 報告 ───────────────────────────────────────────────────────────────────
const pct = (n: number, d: number) => (d ? `${Math.round((n / d) * 100)}%` : '—')
console.log('='.repeat(96))
console.log(`模板封頂計劃 —— 每個模板最多保留 ${CAP} 條　【本腳本唔改任何題庫檔】`)
console.log('次序：先補後剷。剷幾多，就要先補返幾多條真正唔同嘅題。')
console.log('='.repeat(96))

const totalCut = cuts.length
const totalBefore = summary.reduce((a, r) => a + r.mcBefore, 0)
console.log(`\n全站 MC ${totalBefore} → ${totalBefore - totalCut}　剷 ${totalCut} 條（${pct(totalCut, totalBefore)}）`)
console.log(`即係：要先補 ${totalCut} 條真正唔同嘅題，先至剷得。\n`)

console.log('科目'.padEnd(20) + '剷前'.padStart(6) + '剷後'.padStart(6) + '剷走'.padStart(6) + '   剷前 易/中/難'.padEnd(22) + '剷後 易/中/難')
for (const r of summary.filter((x) => x.cut > 0).sort((a, b) => b.cut - a.cut)) {
  const b = `${r.before.easy}/${r.before.medium}/${r.before.hard}`
  const a = `${r.after.easy}/${r.after.medium}/${r.after.hard}`
  console.log(
    `${r.subject.padEnd(18)}${String(r.mcBefore).padStart(6)}${String(r.mcAfter).padStart(6)}${String(r.cut).padStart(6)}   ${b.padEnd(22)}${a}`,
  )
}

// ── 補題訂單 ───────────────────────────────────────────────────────────────
// 每科要補嘅數量 = 該科剷走嘅數量。而【難度分配】唔係照抄剷走嗰批 ——
// 而是按 3:5:2 補足，令剷完＋補完之後，該科嘅難度分佈比而家更接近目標。
console.log('\n' + '='.repeat(96))
console.log('補題訂單 —— 補幾多、補咩難度')
console.log('='.repeat(96))
console.log('（難度分配唔係照抄剷走嗰批：而係計出「剷完之後距離 3:5:2 仲差幾多」，優先補嗰一格。）\n')

interface Order { subject: string; need: number; byDiff: Record<Diff, number>; topics: { topic: string; topicZh: string; n: number }[] }
const orders: Order[] = []

for (const r of summary.filter((x) => x.cut > 0)) {
  const finalTotal = r.mcBefore // 補返同樣數量 ⇒ 最終題數同剷前一樣
  const want: Record<Diff, number> = {
    easy: Math.round(finalTotal * TARGET_SHARE.easy),
    medium: Math.round(finalTotal * TARGET_SHARE.medium),
    hard: 0,
  }
  want.hard = finalTotal - want.easy - want.medium
  // 每格要補 = 目標 − 剷後已有；負數（已經超額）記 0，餘額按缺口比例攤返落其他格
  const raw: Record<Diff, number> = {
    easy: Math.max(0, want.easy - r.after.easy),
    medium: Math.max(0, want.medium - r.after.medium),
    hard: Math.max(0, want.hard - r.after.hard),
  }
  const rawSum = raw.easy + raw.medium + raw.hard
  const byDiff: Record<Diff, number> = { easy: 0, medium: 0, hard: 0 }
  if (rawSum > 0) {
    let assigned = 0
    for (const d of DIFFS) {
      byDiff[d] = Math.round((raw[d] / rawSum) * r.cut)
      assigned += byDiff[d]
    }
    // 四捨五入殘差撥落缺口最大嗰格
    const biggest = DIFFS.reduce((m, d) => (raw[d] > raw[m] ? d : m), 'easy' as Diff)
    byDiff[biggest] += r.cut - assigned
  } else {
    byDiff.medium = r.cut
  }

  // 邊個課題剷得最多，就係補題最應該落嘅位
  const byTopic = new Map<string, { topicZh: string; n: number }>()
  for (const c of cuts) {
    if (c.subject !== r.subject) continue
    const e = byTopic.get(c.topic) ?? { topicZh: c.topicZh, n: 0 }
    e.n++; byTopic.set(c.topic, e)
  }
  const topics = [...byTopic.entries()].map(([topic, v]) => ({ topic, topicZh: v.topicZh, n: v.n })).sort((a, b) => b.n - a.n)
  orders.push({ subject: r.subject, need: r.cut, byDiff, topics })

  console.log(`── ${r.subject}　要補 ${r.cut} 條：易 ${byDiff.easy} / 中 ${byDiff.medium} / 難 ${byDiff.hard}`)
  for (const t of topics.slice(0, SHOW_IDS ? 99 : 6)) {
    console.log(`     ${String(t.n).padStart(4)} 條　${t.topic.padEnd(26)} ${t.topicZh}`)
  }
  if (!SHOW_IDS && topics.length > 6) console.log(`     …… 另外 ${topics.length - 6} 個課題`)
  console.log()
}

// ── 另一條軌：難度補底（同封頂無關）───────────────────────────────────────
// 呢六科完全冇被封頂影響，但佢哋派唔出 3:5:2，缺嘅係【容易題】。
// Yuna 拍板：唔准改標籤湊數，要出新題。
console.log('='.repeat(96))
console.log('難度補底訂單 —— 同封頂無關嘅另一條軌')
console.log('='.repeat(96))
console.log('（呢啲科一條都冇被封頂剷到，但派唔出 3:5:2。缺嘅係容易題，只能出新題，唔准改標籤。）\n')
const floorOrders: { subject: string; easy: number; total: number; need: number }[] = []
for (const s of getActiveSubjects()) {
  const mc = (getSubjectQuestions(s.id) as unknown as Row[]).filter((q) => q.type === 'mc')
  if (!mc.length) continue
  const easy = mc.filter((q) => q.difficulty === 'easy').length
  const want = Math.round(mc.length * TARGET_SHARE.easy)
  if (easy >= 6 && easy / mc.length >= 0.15) continue // 派得出一節 6 條易題，且未算極端偏低
  floorOrders.push({ subject: s.id, easy, total: mc.length, need: want - easy })
}
floorOrders.sort((a, b) => b.need - a.need)
console.log('科目'.padEnd(22) + 'MC'.padStart(6) + '現有易題'.padStart(10) + '目標(30%)'.padStart(11) + '　要補')
for (const f of floorOrders) {
  console.log(`${f.subject.padEnd(20)}${String(f.total).padStart(6)}${String(f.easy).padStart(10)}${String(Math.round(f.total * 0.3)).padStart(11)}　${f.need}`)
}
console.log(`\n補底合計：${floorOrders.reduce((a, f) => a + f.need, 0)} 條容易題`)

// ── 寫出機器可讀嘅訂單 ─────────────────────────────────────────────────────
const OUT = 'scripts/qbank/cap-plan.json'
writeFileSync(OUT, JSON.stringify({
  generatedAt: new Date().toISOString().slice(0, 10),
  cap: CAP,
  note: '先補後剷。cuts 只係計劃，未執行。',
  totals: { mcBefore: totalBefore, mcAfter: totalBefore - totalCut, cut: totalCut },
  replaceOrders: orders,
  difficultyFloorOrders: floorOrders,
  cuts: cuts.map((c) => ({ subject: c.subject, topic: c.topic, difficulty: c.difficulty, id: c.id })),
}, null, 2) + '\n')
console.log(`\n📄 機器可讀訂單 → ${OUT}（含逐條會被剷嘅 id，可覆核）`)
