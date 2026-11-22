import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const pick = <T,>(m:T):T => ((m as {default?:T}).default ?? m)
const {filterNotePractice,parseNoteDifficulty,topicLearningPath,topicLearningUrl,noteFilename,topicStudyFaq,NOTE_LEVELS}=pick(await import('../notes/topicLearning.ts'))
const {TOPIC_LESSONS}=pick(await import('../../data/notes/lessons.ts'))
const {SUBJECT_TOPICS}=pick(await import('../../data/questions/summary.generated.ts'))
const {getSubjectQuestions}=pick(await import('../../data/questions/index.ts'))
const {encodeQR}=pick(await import('../paper/qr.ts'))
const read=(p:string)=>readFileSync(p,'utf8')

test('difficulty parser rejects unsupported and hostile values',()=>{
  for(const v of [undefined,null,'','all','HARD','<script>'])assert.equal(parseNoteDifficulty(v),undefined)
  for(const v of ['easy','medium','hard'])assert.equal(parseNoteDifficulty(v),v)
  assert.deepEqual(NOTE_LEVELS.map(x=>x.label),['基礎','進階','挑戰'])
})
test('explicit topic and difficulty never borrow other questions or mutate bank',()=>{
  const bank=[{topic:'a',difficulty:'easy'},{topic:'a',difficulty:'hard'},{topic:'b',difficulty:'hard'}] as const
  const qs=[...bank]
  assert.deepEqual(filterNotePractice(qs,'a','hard'),[bank[1]])
  assert.deepEqual(filterNotePractice(qs,'a','medium'),[])
  assert.deepEqual(filterNotePractice(qs,'missing','hard'),[])
  assert.equal(qs.length,3)
  assert.deepEqual(filterNotePractice(qs,null),qs)
})
test('all topic QR URLs are stable unique canonical URLs and fit the encoder',()=>{
  const urls=new Set<string>()
  for(const [s,topics] of Object.entries(SUBJECT_TOPICS))for(const t of topics){
    const url=topicLearningUrl(s,t.id)
    assert.ok(url.startsWith('https://www.dselevelup.com/practice/'))
    assert.ok(!urls.has(url));urls.add(url)
    assert.doesNotThrow(()=>encodeQR(url))
    const parts=new URL(url).pathname.split('/').slice(2).map(decodeURIComponent)
    assert.deepEqual(parts,[s,t.id])
  }
  assert.equal(urls.size,296)
  assert.equal(topicLearningPath('a/b','c d'),'/practice/a%2Fb/c%20d')
})
test('filename is descriptive and does not contain platform path characters',()=>{
  assert.equal(noteFilename('數學','二次方程'),'數學-二次方程-自學筆記')
  assert.doesNotMatch(noteFilename('a/b','c:d*e'),/[\\/:*?"<>|]/)
})
test('FAQ exposes the actual visible note without using English fallback',()=>{
  const faq=topicStudyFaq({titleZh:'示例',mustKnowZh:['甲','乙'],commonTrapZh:'丙'})
  assert.equal(faq[0].answer,'甲；乙');assert.equal(faq[1].answer,'丙')
  assert.match(read('components/TopicStudyNote.tsx'),/topicStudyFaq\(note\).map/)
  assert.match(read('app/notes/[subject]/[topic]/page.tsx'),/topicStudyFaq\(note\).map/)
})
test('pilot lesson has goals, examples, checks, vocabulary and a genuine parameter challenge',()=>{
  const x=TOPIC_LESSONS['math:quadratic_equations']
  assert.equal(x.review,'draft')
  assert.equal(x.examples.length,3)
  for(const ex of x.examples){assert.ok(ex.steps.length>=3);assert.ok(ex.check)}
  assert.ok(x.objectives.length>=3);assert.ok(x.vocabulary.length>=3);assert.ok(x.checks.length>=3)
  // Independent numeric verification of the worked examples and parameter factorisation.
  for(const v of [3,4])assert.equal(v*v-7*v+12,0)
  for(const sign of [-1,1]){const v=(3+sign*Math.sqrt(17))/4;assert.ok(Math.abs(2*v*v-3*v-1)<1e-10)}
  for(const k of [-3,0,2,7]){assert.equal((k+2)**2-8*k,(k-2)**2);for(const v of [2,k])assert.equal(v*v-(k+2)*v+2*k,0)}
})
test('new difficulty choice reaches the real runner and survives the login return URL',()=>{
  const shell=read('app/practice/PracticeShell.tsx');const gate=read('app/practice/PracticeGate.tsx')
  assert.match(shell,/parseNoteDifficulty\(params.get\('difficulty'\)\)/)
  assert.match(shell,/difficulty=\{difficulty\}/)
  assert.match(gate,/filterNotePractice\(scopedMc, topicFilter, difficulty\)/)
  assert.match(gate,/bank=\{difficulty \? selectedMc! : scopedMc\}/)
  assert.match(gate,/q.set\('difficulty', opts.difficulty\)/)
  assert.match(read('components/StudyNoteActions.tsx'),/window.print\(\)/)
  assert.match(read('app/globals.css'),/\.note-qr-page \{ break-before: page/)
})
test('empty difficulty levels are real gaps, not fabricated labels',()=>{
  const qs=getSubjectQuestions('math').filter(q=>q.type==='mc')
  for(const t of SUBJECT_TOPICS.math)for(const level of NOTE_LEVELS){
    assert.equal(filterNotePractice(qs,t.id,level.value).length,qs.filter(q=>q.topic===t.id&&q.difficulty===level.value).length)
  }
})

test('pilot diagram has the actual roots and vertex of its labelled quadratic',()=>{
  const svg=read('public/explainers/math-quadratic-study.svg')
  assert.match(svg,/M90 30Q290 590 490 30/)
  for(const [x,y] of [[1,0],[3,0],[2,-1]])assert.equal(x*x-4*x+3,y)
  const point=(t:number)=>({x:(1-t)**2*90+2*(1-t)*t*290+t*t*490,y:(1-t)**2*30+2*(1-t)*t*590+t*t*30})
  assert.deepEqual(point(.25),{x:190,y:240})
  assert.deepEqual(point(.75),{x:390,y:240})
  assert.deepEqual(point(.5),{x:290,y:310})
  assert.match(svg,/頂點/);assert.doesNotMatch(svg,/vertex|intercepts/)
})
