// ============================================================================
// _gap.mts —— 逐科課題缺口：距離【該科中位數】仲差幾多條
// ----------------------------------------------------------------------------
// Brian 2026-09-05 裁決：先把現有課題補到該科中位數，新課題第二輪先做。
// 各 builder 檔頭引用嘅缺口數字由呢度出 —— 引一個算得返嘅數，唔好抄死喺註釋度。
//
// 點解係【中位數】唔係平均數：數學 25 個課題入面「二次方程」有 283 條、
// 「等差數列」142 條，把平均數扯到 61.6，而中位數只係 44。用平均數做目標
// 等於要為咗兩個超厚課題去追高其餘 23 個，追嘅係一個由離群值定義嘅線。
//
//   npx tsx scripts/qbank/builders/_gap.mts            # 全部 25 科摘要
//   npx tsx scripts/qbank/builders/_gap.mts chemistry  # 單科逐課題明細
// ============================================================================
const idx = await import('../../../data/questions/index.ts') as {
  getSubjectQuestions: (id: string) => { topic: string; type?: string }[]
  getSubjectTopics: (id: string) => { id: string; zh: string }[]
}

const SUBJECTS: [string, string][] = [
  ['math', '數學'], ['m1', 'M1'], ['m2', 'M2'], ['physics', '物理'], ['chemistry', '化學'],
  ['biology', '生物'], ['english', '英文'], ['chinese', '中文'], ['bafs', '企會財'], ['ict', 'ICT'],
  ['economics', '經濟'], ['csd', '公社'], ['chinese-history', '中史'], ['history', '歷史'],
  ['geography', '地理'], ['chinese-literature', '中文學'], ['english-literature', '英文學'],
  ['ethics-religious', '倫理'], ['ths', '旅款'], ['health-management', '健管'],
  ['design-tech', '設應科'], ['visual-arts', '視藝'], ['music', '音樂'], ['pe', '體育'],
  ['technology-living', '科技生活'],
]

const median = (a: number[]): number => {
  const s = [...a].sort((x, y) => x - y)
  const m = s.length >> 1
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

function rowsFor(id: string) {
  const qs = idx.getSubjectQuestions(id)
  const tps = idx.getSubjectTopics(id)
  const live: Record<string, number> = {}
  for (const q of qs) live[q.topic] = (live[q.topic] ?? 0) + 1
  const counts = tps.map((t) => live[t.id] ?? 0)
  const M = median(counts)
  const gaps = tps
    .map((t) => ({ ...t, n: live[t.id] ?? 0 }))
    .filter((x) => x.n < M)
    .sort((a, b) => a.n - b.n)
    .map((x) => ({ ...x, need: Math.ceil(M - x.n) }))
  return { total: qs.length, topics: tps.length, M, mean: qs.length / tps.length, gaps }
}

const only = process.argv.slice(2).filter((a) => !a.startsWith('--'))

if (only.length) {
  for (const id of only) {
    const r = rowsFor(id)
    console.log(`\n${id} —— ${r.total} 條 / ${r.topics} 課題 · 中位數 ${r.M} · 平均數 ${r.mean.toFixed(1)}\n`)
    for (const g of r.gaps) {
      console.log(`  ${g.zh.padEnd(14)} ${g.id.padEnd(26)} 現有 ${String(g.n).padStart(3)} → 補 ${String(g.need).padStart(3)} 條`)
    }
    const tot = r.gaps.reduce((a, g) => a + g.need, 0)
    console.log(`\n  合計 ${tot} 條，${r.gaps.length} 個課題`)
    // 3 : 5 : 2 —— 憲章 §12。用 round 之後補返差額落 intermediate，令三個數加起來啱。
    const b = Math.round(tot * 0.3)
    const h = Math.round(tot * 0.2)
    console.log(`  難度目標（3:5:2）：basic ${b} · intermediate ${tot - b - h} · hard ${h}`)
  }
} else {
  let grand = 0
  console.log('科目      題數  課題  中位數  平均數 │ 未到中位數：課題數／缺口')
  console.log('─'.repeat(72))
  for (const [id, zh] of SUBJECTS) {
    const r = rowsFor(id)
    const tot = r.gaps.reduce((a, g) => a + g.need, 0)
    grand += tot
    console.log(
      `${zh.padEnd(6)} ${String(r.total).padStart(5)} ${String(r.topics).padStart(5)} `
      + `${String(r.M).padStart(6)} ${r.mean.toFixed(1).padStart(7)} │ `
      + `${String(r.gaps.length).padStart(3)} 個 ${String(tot).padStart(5)} 條`,
    )
  }
  console.log('─'.repeat(72))
  console.log(`全站追到中位數合計 ${grand} 條`)
}
