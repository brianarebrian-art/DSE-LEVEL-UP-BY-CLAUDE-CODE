const mod = async <T>(p: string): Promise<T> => await import(p).then((m: Record<string, unknown>) => (m.default ?? m) as T)
const { getSubjectQuestions, getSubjectTopics } = await mod<{
  getSubjectQuestions: (id: string) => Array<{ id: string; topic?: string; topicEn?: string }>
  getSubjectTopics: (id: string) => Array<{ id: string; name?: string; nameEn?: string; zh?: string; en?: string }>
}>('../../data/questions/index.ts')
const { getActiveSubjects } = await mod<{ getActiveSubjects: () => Array<{ id: string }> }>('../../data/subjects.ts')
const miss = new Map<string, number>()
const resolvable = new Map<string, string>()
for (const s of getActiveSubjects()) {
  const topics = getSubjectTopics(s.id)
  const byId = new Map(topics.map((t) => [t.id, t]))
  for (const q of getSubjectQuestions(s.id)) {
    if (q.topicEn) continue
    const k = `${s.id} | ${q.topic}`
    miss.set(k, (miss.get(k) ?? 0) + 1)
    const t = byId.get(q.topic ?? '')
    if (t) resolvable.set(k, JSON.stringify(t).slice(0, 120))
  }
}
console.log('缺 topicEn 嘅 (科|topic) 組合：', miss.size, '· 題數', [...miss.values()].reduce((a, b) => a + b, 0))
console.log('其中 topic 係已註冊 id（可以自動查返英文名）：', resolvable.size)
for (const [k, n] of [...miss].sort((a, z) => z[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${k}${resolvable.has(k) ? '   ✔已註冊' : '   ✗孤兒'}`)
}
console.log('\n--- 一個已註冊 topic 嘅欄位長咩樣 ---')
console.log([...resolvable.values()][0])
