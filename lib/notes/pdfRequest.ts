import { getSubject, getActiveSubjects } from '@/data/subjects'
import { SUBJECT_TOPICS } from '@/data/questions/summary.generated'
import { getStudyNote, getSubjectStudyNotes } from '@/lib/notes/studyNotes'
import { createNotePdf } from '@/lib/notes/pdfDocument'
import { noteFilename } from '@/lib/notes/topicLearning'

export async function notePdfResponse(subject:string,topic:string|null) {
  const meta=getSubject(subject)
  if(!meta || !getActiveSubjects().some(s=>s.id===subject))return new Response('找不到科目。',{status:404})
  const topics=SUBJECT_TOPICS[subject]??[]
  if(topic!==null && !topics.some(t=>t.id===topic))return new Response('找不到課題。',{status:404})
  const byTopic=topic===null?await getSubjectStudyNotes(subject):null
  const single=topic!==null?await getStudyNote(subject,topic):null
  const notes=byTopic?topics.map(t=>byTopic[t.id]).filter(Boolean):single?[single]:[]
  if(!notes.length)return new Response('暫未有可下載筆記。',{status:404})
  const date=new Date().toLocaleDateString('zh-HK',{timeZone:'Asia/Hong_Kong'})
  try{
    const buffer=await createNotePdf({subjectName:meta.name,notes,date})
    const filename=noteFilename(meta.name,topic===null?'課題摘要合集':notes[0].titleZh)+'.pdf'
    return new Response(new Uint8Array(buffer),{headers:{'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="${subject}-notes.pdf"; filename*=UTF-8''${encodeURIComponent(filename)}`,'Content-Length':String(buffer.length),'Cache-Control':'public, max-age=0, s-maxage=86400','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex'}})
  }catch{
    return new Response('PDF 暫時未能產生。請稍後重試，或返回筆記使用列印功能。',{status:503,headers:{'Cache-Control':'no-store','Retry-After':'60'}})
  }
}
