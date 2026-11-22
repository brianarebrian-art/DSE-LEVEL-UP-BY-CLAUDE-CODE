import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSubject } from '@/data/subjects'
import { SUBJECT_TOPICS } from '@/data/questions/summary.generated'
import { getSubjectQuestions } from '@/data/questions'
import { getStudyNote } from '@/lib/notes/studyNotes'
import { NOTE_LEVELS, topicLearningPath } from '@/lib/notes/topicLearning'
import { SESSION_SIZE } from '@/lib/entitlements'
import { createSeoMetadata, breadcrumbJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/Seo/JsonLd'

async function resource(subject:string, topic:string) {
  const meta=getSubject(subject)
  const t=SUBJECT_TOPICS[subject]?.find(t=>t.id===topic)
  const note=await getStudyNote(subject,topic)
  if(!meta || !t || !note) notFound()
  return {meta,t,note}
}
export async function generateMetadata({params}:{params:Promise<{subject:string;topic:string}>}) {
  const {subject,topic}=await params
  const {meta,t}=await resource(subject,topic)
  return createSeoMetadata({title:`${t.zh}課題練習｜${meta.name}｜DSE Level Up`,description:`選擇${meta.name}「${t.zh}」的練習難度，查看可用題目數量並開始原創改寫選擇題練習。`,path:topicLearningPath(subject,topic),type:'website',noIndex:true}) // i18n-exempt: requested Traditional Chinese metadata
}
export default async function Page({params}:{params:Promise<{subject:string;topic:string}>}) {
  const {subject,topic}=await params
  const {meta,t,note}=await resource(subject,topic)
  const bank=getSubjectQuestions(subject).filter(q=>q.topic===topic && q.type==='mc')
  return <div lang="zh-HK" className="mx-auto min-h-screen max-w-3xl px-4 pb-12 pt-16 text-ink">
    <JsonLd data={breadcrumbJsonLd([{name:'首頁',path:'/'},{name:meta.name,path:`/notes/${subject}`},{name:t.zh,path:`/notes/${subject}/${topic}`},{name:'課題練習',path:topicLearningPath(subject,topic)}])}/>{/* i18n-exempt: Traditional Chinese breadcrumbs */}
    <Link href={`/notes/${subject}/${topic}`} className="inline-flex min-h-12 items-center text-accent underline underline-offset-4">返回課題筆記</Link>{/* i18n-exempt: Traditional Chinese CTA */}
    <p className="mt-5 text-sm text-ink-muted">{meta.name} · 香港中學文憑試（DSE）</p>{/* i18n-exempt: Traditional Chinese editorial content */}
    <h1 className="mt-2 break-words text-3xl font-semibold leading-tight">{t.zh}：選擇練習難度</h1>{/* i18n-exempt: Traditional Chinese heading */}
    <p className="mt-4 leading-8 text-ink-soft">{note.conceptZh}</p>
    <p className="mt-4 text-sm leading-7 text-ink-muted">每節最多 {SESSION_SIZE} 題；不足時只使用現有題目，不以其他課題或難度補足。難度沿用現有題庫標記，尚未代表已完成全題庫難度重審。</p>{/* i18n-exempt: honest Traditional Chinese instructions */}
    <form action="/practice" method="get" className="mt-6 space-y-5 rounded-2xl border border-line bg-surface-raised p-5">
      <input type="hidden" name="subject" value={subject}/><input type="hidden" name="topic" value={topic}/>
      <fieldset className="space-y-3"><legend className="mb-4 text-lg font-semibold">練習難度與可用題數</legend>{/* i18n-exempt: Traditional Chinese controls */}
        <label className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-line p-4 focus-within:outline focus-within:outline-[3px] focus-within:outline-accent"><input type="radio" name="difficulty" value="" defaultChecked disabled={!bank.length}/><span>混合難度 · {bank.length} 題可用</span></label>{/* i18n-exempt: Traditional Chinese controls */}
        {NOTE_LEVELS.map(level=>{const count=bank.filter(q=>q.difficulty===level.value).length;return <label key={level.value} className={`flex min-h-14 items-center gap-3 rounded-xl border border-line p-4 focus-within:outline focus-within:outline-[3px] focus-within:outline-accent ${!count?'cursor-not-allowed opacity-60':'cursor-pointer'}`}><input type="radio" name="difficulty" value={level.value} disabled={!count}/><span><strong>{level.label}</strong> · {count} 題可用<br/><span className="text-sm text-ink-muted">{level.description}{count?'':'；此難度暫未有題目'}</span></span></label>})}{/* i18n-exempt: Traditional Chinese empty-state text */}
      </fieldset>
      <button type="submit" disabled={!bank.length} className="min-h-12 w-full rounded-xl bg-accent-strong px-5 py-3 font-semibold text-on-accent hover:bg-accent-hover focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60">開始本課題練習</button>{/* i18n-exempt: Traditional Chinese CTA */}
      {!bank.length && <p role="status" className="text-sm leading-7 text-ink-muted">本課題暫未有可用選擇題。請返回筆記，或到科目頁查看其他練習形式。</p>}{/* i18n-exempt: Traditional Chinese empty state */}
      <p className="text-sm leading-7 text-ink-muted">全部功能免費。同一裝置未登入可完成一節試用；之後使用 Google 登入繼續。題目未經註冊教師審定，並非考評局官方試題。</p>{/* i18n-exempt: Traditional Chinese disclosure */}
    </form>
  </div>
}
