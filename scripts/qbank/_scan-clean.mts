import { loadSubjectMCQuestions } from '../../data/questions/load'

const SUBJECTS = ['math','physics','chemistry','m1','m2','economics','bafs']

// 「乾淨答案」定義（草案）：整數、或分母 ≤ 12 嘅分數、或 ≤ 2 位小數。
const INT = /^-?\d+$/
const FRAC = /^-?\\frac\{(-?\d+)\}\{(\d+)\}$/
const DEC = /^-?\d+\.\d{1,2}$/
const MAXDEN = 12

function classify(s: string): 'int' | 'frac' | 'dec' | 'dirty' | 'nonnumeric' {
  const t = s.trim()
  if (INT.test(t)) return 'int'
  const m = t.match(FRAC)
  if (m) return Number(m[2]) <= MAXDEN ? 'frac' : 'dirty'
  if (DEC.test(t)) return 'dec'
  if (/^-?\d+\.\d{3,}$/.test(t)) return 'dirty'
  return 'nonnumeric'   // 帶單位、代數式、文字選項 —— 唔屬本閘管轄範圍
}

const tally: Record<string, number> = {}
const dirty: { id: string; ans: string }[] = []
let total = 0
for (const s of SUBJECTS) {
  for (const q of await loadSubjectMCQuestions(s)) {
    if (q.type !== 'mc') continue
    total++
    const ans = q.options[q.correctIndex]
    const c = classify(ans)
    tally[c] = (tally[c] ?? 0) + 1
    if (c === 'dirty') dirty.push({ id: q.id, ans })
  }
}
console.log(`量化科 MC 總數：${total}`)
for (const [k, v] of Object.entries(tally).sort((a,b)=>b[1]-a[1]))
  console.log(`  ${k.padEnd(11)} ${String(v).padStart(5)}  ${(v/total*100).toFixed(1)}%`)
console.log(`\n會被新閘攔住嘅（dirty）共 ${dirty.length} 條，前 10 例：`)
dirty.slice(0,10).forEach(d => console.log(`  ${d.id}  →  ${d.ans}`))
