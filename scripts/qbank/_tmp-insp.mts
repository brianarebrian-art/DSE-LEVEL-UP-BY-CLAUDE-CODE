import { loadSubjectQuestions } from '../../data/questions/load.ts'
const qs = await loadSubjectQuestions(process.argv[2])
const by: Record<string, any> = {}
for (const q of qs as any[]) { by[q.topic] ??= {}; by[q.topic][q.difficulty] = (by[q.topic][q.difficulty] ?? 0) + 1 }
for (const [t, v] of Object.entries(by)) console.log(t.padEnd(24), JSON.stringify(v))
console.log('---')
for (const q of qs as any[]) console.log(q.topic.padEnd(22), '|', q.difficulty.padEnd(6), '|', q.content.replace(/\s+/g, ' ').slice(0, 80))
