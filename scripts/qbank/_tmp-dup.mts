import { readFileSync } from 'node:fs'
import { loadSubjectQuestions } from '../../data/questions/load.ts'
const [file, subj] = process.argv.slice(2)
const rows = JSON.parse(readFileSync(file, 'utf8'))
const existing = (await loadSubjectQuestions(subj)) as any[]
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9一-鿿]+/g, ' ').trim()
const toks = (s: string) => new Set(norm(s).split(' ').filter((w) => w.length > 3))
let worst = 0
for (const r of rows) {
  const a = toks(r.question)
  for (const e of existing) {
    const b = toks(e.content)
    const inter = [...a].filter((w) => b.has(w)).length
    const j = inter / (a.size + b.size - inter)
    if (j > 0.4) console.log(`⚠️ ${(j * 100).toFixed(0)}%  ${r.id}\n     new: ${r.question.replace(/\s+/g, ' ').slice(0, 90)}\n     old: ${e.content.replace(/\s+/g, ' ').slice(0, 90)}`)
    worst = Math.max(worst, j)
  }
}
console.log(`最高相似度 ${(worst * 100).toFixed(0)}%（門檻 40%）`)
