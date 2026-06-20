const targets = (process.argv[2] || 'm2').split(',')
const camel: Record<string,string> = {'chinese-history':'chineseHistory','health-management':'healthManagement','design-tech':'designTech','chinese-literature':'chineseLiterature','english-literature':'englishLiterature','visual-arts':'visualArts','ethics-religious':'ethicsReligious'}
for (const file of targets) {
  const name = camel[file] || file
  const m: any = await import('./data/questions/' + file + '.ts')
  const qs = m[name+'Questions'] as any[]
  let dup = 0
  const byTopic: Record<string,number> = {}
  for (const q of qs) {
    byTopic[q.topic] = (byTopic[q.topic]||0)+1
    if (q.options && new Set(q.options).size !== q.options.length) { dup++; console.log('DUP', q.id, JSON.stringify(q.options)) }
    if (q.optionsEn && new Set(q.optionsEn).size !== q.optionsEn.length) { dup++; console.log('DUP-EN', q.id, JSON.stringify(q.optionsEn)) }
    const enMiss = !q.contentEn || !q.optionsEn || (q.optionsEn||[]).length !== (q.options||[]).length
    if (enMiss) console.log('EN-MISS', q.id)
  }
  console.log(`${file}: n=${qs.length} dup=${dup} topics=${JSON.stringify(byTopic)}`)
}
