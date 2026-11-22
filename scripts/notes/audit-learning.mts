import {mkdirSync,writeFileSync} from 'node:fs'
const pick=<T,>(m:T):T=>((m as {default?:T}).default??m)
const {getActiveSubjects}=pick(await import('../../data/subjects'))
const {getSubjectQuestions}=pick(await import('../../data/questions'))
const {SUBJECT_TOPICS}=pick(await import('../../data/questions/summary.generated'))
const {getSubjectStudyNotes}=pick(await import('../../lib/notes/studyNotes'))
const {TOPIC_LESSONS}=pick(await import('../../data/notes/lessons'))
const {topicExplainerSrc}=pick(await import('../../data/notes/explainers'))
const {familyKey}=pick(await import('../../data/questions/family'))

const output=process.argv[2]??'artifacts/learning-review'
mkdirSync(output,{recursive:true})
const rows:string[][]=[['subject','topic','question_id','type','current_difficulty','has_explanation','has_authored_steps','family_size','longest_option_unique_correct','flags','human_review']]
const topics=[]
for(const subject of getActiveSubjects()){
 const qs=getSubjectQuestions(subject.id)
 const families=new Map<string,number>()
 for(const q of qs){const key=familyKey(subject.id,q);families.set(key,(families.get(key)??0)+1)}
 for(const q of qs){
  const count=families.get(familyKey(subject.id,q))??1
  const steps=q.type==='mc'&&!!q.steps?.length
  const options=q.type==='mc'?q.options.map(x=>[...x.replace(/\s/g,'')].length):[]
  const max=Math.max(...options)
  const cue=q.type==='mc'&&options.filter(x=>x===max).length===1&&options[q.correctIndex]===max
  const flags=[!q.explanation?.trim()?'missing_explanation':'',!steps?'no_authored_steps':'',count>1?'repeated_family':'',cue?'longest_correct_option':''].filter(Boolean)
  rows.push([subject.id,q.topic,q.id,q.type,q.difficulty,String(!!q.explanation?.trim()),String(steps),String(count),String(cue),flags.join('|'),'pending_subject_expert'])
 }
 const notes=await getSubjectStudyNotes(subject.id)
 for(const t of SUBJECT_TOPICS[subject.id]??[]){
  const bank=qs.filter(q=>q.topic===t.id)
  const note=notes[t.id]
  const levels=Object.fromEntries(['easy','medium','hard'].map(d=>[d,bank.filter(q=>q.type==='mc'&&q.difficulty===d).length]))
  topics.push({subject:subject.id,subjectName:subject.name,topic:t.id,title:t.zh,questions:bank.length,mcLevels:levels,missingLevels:Object.entries(levels).filter(([,n])=>!n).map(([d])=>d),notePresent:!!note,expandedLesson:!!TOPIC_LESSONS[`${subject.id}:${t.id}`],dedicatedDiagram:!!(note&&topicExplainerSrc(subject.id,t.id,note.explainerSrc)),contentReview:'pending_subject_expert',difficultyReview:'pending_subject_expert'})
 }
}
const csv=rows.map(row=>row.map(x=>'"'+x.replace(/"/g,'""')+'"').join(',')).join('\n')+'\n'
writeFileSync(output+'/question-review.csv','\uFEFF'+csv)
writeFileSync(output+'/topic-review.json',JSON.stringify(topics,null,2)+'\n')
const summary={generatedAt:new Date().toISOString(),subjects:getActiveSubjects().length,topics:topics.length,questions:rows.length-1,expandedLessons:topics.filter(t=>t.expandedLesson).length,missingMcLevels:topics.filter(t=>t.missingLevels.length).length,humanReviewedQuestions:0,warning:'機器檢查只找出待審證據，不證明題目難度合理、學科正確或完成教材。所有人工覆核狀態保留待審。'}
writeFileSync(output+'/summary.json',JSON.stringify(summary,null,2)+'\n')
console.log(JSON.stringify(summary,null,2))
