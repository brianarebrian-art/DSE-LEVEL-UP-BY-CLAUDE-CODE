// ============================================================================
// baseline.mts —— 機器生成題庫基線，附時間戳同失效期
// ----------------------------------------------------------------------------
// 點解要有呢個腳本：2026-08-27《全員優化建議書》140 條建議入面，30 條直接
// 引用咗一份 08-07 嘅稽核數字。嗰份稽核自己有日期，亦有一節寫住專案喺 08-23
// 郁過，但數字照樣被當成「現況」用落文件第一頁「所有建議建基於此」。
//
// 根因唔係數字舊，係【一份手打嘅基線表冇辦法自己作廢】。所以基線唔可以再由
// 人打字，要當場由題庫載入生成，並且帶住三樣嘢：
//   ① 生成時間（香港時間）
//   ② 產生嗰行確切指令
//   ③ 一句失效聲明 —— 超過 14 日即不可用作任何建議嘅前提
//
// 用法：
//   npm run baseline           印出 markdown，貼入文件
//   npm run baseline -- --json 出 JSON，畀其他腳本用
// ============================================================================

// ⚠️ 用 dynamic import 而唔係具名 import：tsx 之下 `.ts` 模組(CJS interop)
// 唔可以由 `.mts` 具名 import 出 runtime 值，會 SyntaxError。全 repo 同一寫法。
const mod = async <T>(p: string): Promise<T> =>
  await import(p).then((m: Record<string, unknown>) => (m.default ?? m) as T)

const { loadSubjectQuestions, loadWrittenQuestions } = await mod<{
  loadSubjectQuestions: (id: string) => Promise<unknown[]>
  loadWrittenQuestions: (id: string) => Promise<unknown[]>
}>('../../data/questions/load.ts')
const { subjects } = await mod<{ subjects: Array<Record<string, string>> }>('../../data/subjects.ts')

const STALE_DAYS = 14
const CMD = 'npm run baseline'

const hkNow = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Hong_Kong',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date()).replace(',', '')

interface Row {
  id: string; zh: string
  mc: number; text: number; long: number
  easy: number; medium: number; hard: number
  total: number
}

const rows: Row[] = []
for (const s of subjects) {
  const all = await loadSubjectQuestions(s.id).catch(() => [])
  const r: Row = {
    id: s.id, zh: s.zh ?? s.id,
    mc: 0, text: 0, long: 0, easy: 0, medium: 0, hard: 0, total: all.length,
  }
  for (const q of all as Array<Record<string, string>>) {
    const t = q.type ?? 'mc'
    if (t === 'mc') r.mc++
    else if (t === 'text') r.text++
    else if (t === 'long') r.long++
    const d = q.difficulty ?? ''
    if (/easy|basic/.test(d)) r.easy++
    else if (/med|inter/.test(d)) r.medium++
    else if (/hard/.test(d)) r.hard++
  }
  rows.push(r)
}

const sum = (k: keyof Row) => rows.reduce((n, r) => n + (r[k] as number), 0)
const TOTAL = sum('total')
const pct = (n: number) => TOTAL ? `${(n / TOTAL * 100).toFixed(1)}%` : '—'

// 書寫題入口可見性 —— hasWrittenQuestions 對邊幾科返 true
const writable: string[] = []
for (const r of rows) {
  const w = await loadWrittenQuestions(r.id).catch(() => [])
  if (w.length) writable.push(`${r.zh}（${w.length}）`)
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ generatedAt: hkNow(), command: CMD, staleDays: STALE_DAYS, total: TOTAL, rows }, null, 2))
} else {
  const L: string[] = []
  L.push(`### 題庫基線`)
  L.push('')
  L.push(`> **生成時間：** ${hkNow()}（香港時間）  `)
  L.push(`> **產生指令：** \`${CMD}\`  `)
  L.push(`> ⚠️ **本基線超過 ${STALE_DAYS} 日即失效，唔可以用嚟做任何建議嘅前提。** 過期請重跑，唔好照抄。`)
  L.push('')
  L.push(`| 指標 | 實測 | 佔比 |`)
  L.push(`|---|---:|---:|`)
  L.push(`| 上線科目 | ${rows.length} 科 | — |`)
  L.push(`| 題目總數 | ${TOTAL} | 100% |`)
  L.push(`| 選擇題 \`mc\` | ${sum('mc')} | ${pct(sum('mc'))} |`)
  L.push(`| 短答題 \`text\` | ${sum('text')} | ${pct(sum('text'))} |`)
  L.push(`| 長題 \`long\` | ${sum('long')} | ${pct(sum('long'))} |`)
  L.push(`| 難度・易 | ${sum('easy')} | ${pct(sum('easy'))} |`)
  L.push(`| 難度・中 | ${sum('medium')} | ${pct(sum('medium'))} |`)
  L.push(`| 難度・難 | ${sum('hard')} | ${pct(sum('hard'))} |`)
  L.push('')
  L.push(`**書寫題入口可見（\`hasWrittenQuestions\` = true）：** ${writable.length ? writable.join('、') : '（無）'}`)
  L.push('')
  L.push(`| 科目 | 總數 | mc | text | long | 易 | 中 | 難 | 易% |`)
  L.push(`|---|---:|---:|---:|---:|---:|---:|---:|---:|`)
  for (const r of [...rows].sort((a, b) => b.total - a.total)) {
    const e = r.total ? (r.easy / r.total * 100).toFixed(0) : '0'
    L.push(`| ${r.zh} \`${r.id}\` | ${r.total} | ${r.mc} | ${r.text} | ${r.long} | ${r.easy} | ${r.medium} | ${r.hard} | ${e}% |`)
  }
  console.log(L.join('\n'))
}
