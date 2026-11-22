import Image from 'next/image'
import Link from 'next/link'
import MathText from '@/components/MathText'
import QRCode from '@/components/QRCode'
import type { StudyNote } from '@/data/notes/types'
import type { TopicLesson } from '@/data/notes/lessons'
import { topicExplainerSrc } from '@/data/notes/explainers'
import { topicLearningUrl, topicStudyFaq } from '@/lib/notes/topicLearning'

const copy = {
  objectives:'學習目標', concepts:'核心概念圖', points:'重點整理', tip:'應用提示', traps:'常見錯誤與注意事項', // i18n-exempt: requested Traditional Chinese editorial content
  words:'關鍵詞彙與公式', examples:'例題與逐步解釋', checks:'自我檢查', challenge:'延伸思考與挑戰', // i18n-exempt: requested Traditional Chinese editorial content
  answer:'顯示參考答案', verify:'檢查方法', faq:'常見問題', incomplete:'這份是現有課題摘要，並非完整教材。學習目標、獨立例題、詞彙與挑戰題仍待逐課題編寫及覆核。', // i18n-exempt: transparent Traditional Chinese status
  qrTitle:'立即做練習', qrHelp:'掃描 QR 碼，選擇難度並開始本課題練習。', // i18n-exempt: Traditional Chinese instructions
  disclaimer:'本平台試題為獨立改寫版本，並非香港考試及評核局官方試題。練習表現不代表正式考試成績。', // i18n-exempt: Traditional Chinese disclaimer
}
export default function TopicStudyNote({note,subjectName,lesson}:{note:StudyNote;subjectName:string;lesson?:TopicLesson}) {
  const src = topicExplainerSrc(note.subjectId, note.topicId, note.explainerSrc)
  const url = topicLearningUrl(note.subjectId, note.topicId)
  const block = 'note-section rounded-2xl border border-line bg-surface-raised p-4 sm:p-6'
  const heading = 'mb-4 text-xl font-semibold text-ink'
  return <>
    {!lesson && <p className="rounded-xl border border-line bg-surface-sunken p-4 text-sm leading-7 text-ink-muted">{copy.incomplete}</p>}
    {lesson && <section className={block}><h2 className={heading}>{copy.objectives}</h2><ul className="list-disc space-y-2 pl-5 leading-8">{lesson.objectives.map(x=><li key={x}>{x}</li>)}</ul></section>}
    <section className={block}>
      <h2 className={heading}>{copy.concepts}</h2>
      {src && <figure className="mb-5"><Image src={src} alt={`${note.titleZh}的概念關係圖`} width={640} height={360} loading="lazy" unoptimized className="h-auto w-full rounded-xl bg-white" /></figure>}{/* i18n-exempt: descriptive Traditional Chinese alternative text */}
      <ol className="grid gap-3 sm:grid-cols-2">{note.mustKnowZh.map((point,i)=><li key={point} className="rounded-xl border border-line bg-surface-sunken p-4"><span aria-hidden className="mb-2 block text-sm font-semibold text-accent">{String(i+1).padStart(2,'0')}</span><p className="break-words text-sm leading-8"><MathText>{point}</MathText></p></li>)}</ol>
    </section>
    <section className={block}><h2 className={heading}>{copy.tip}</h2><p className="leading-8"><MathText>{note.examTipZh}</MathText></p></section>
    {lesson && <section className={block}><h2 className={heading}>{copy.words}</h2><dl className="space-y-4">{lesson.vocabulary.map(v=><div key={v.term}><dt className="font-semibold">{v.term}</dt><dd className="mt-1 leading-8"><MathText>{v.definition}</MathText></dd></div>)}</dl></section>}
    {lesson && <section className="space-y-4"><h2 className={heading}>{copy.examples}</h2>{lesson.examples.map(ex=><article key={ex.title} className={block}><h3 className="text-lg font-semibold">{ex.title}</h3><p className="my-3 leading-8"><MathText>{ex.question}</MathText></p><ol className="list-decimal space-y-3 pl-6 leading-8">{ex.steps.map(x=><li key={x}><MathText>{x}</MathText></li>)}</ol><p className="mt-4 leading-8"><strong>{copy.verify}：</strong><MathText>{ex.check}</MathText></p></article>)}</section>}{/* i18n-exempt: Traditional Chinese instructional punctuation */}
    <section className={block}><h2 className={heading}>{copy.traps}</h2><p className="leading-8"><MathText>{note.commonTrapZh}</MathText></p></section>
    {lesson && <section className={block}><h2 className={heading}>{copy.checks}</h2>{lesson.checks.map(x=><details className="note-answer border-b border-line py-3" key={x.question}><summary className="min-h-12 cursor-pointer py-3 font-semibold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-accent">{x.question}</summary><p className="py-3 leading-8"><MathText>{x.answer}</MathText></p></details>)}</section>}
    {lesson && <section className={block}><h2 className={heading}>{copy.challenge}</h2><p className="leading-8"><MathText>{lesson.challenge.question}</MathText></p><details className="note-answer mt-4"><summary className="min-h-12 cursor-pointer py-3 font-semibold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-accent">{copy.answer}</summary><ol className="list-decimal space-y-3 pl-6 leading-8">{lesson.challenge.steps.map(x=><li key={x}><MathText>{x}</MathText></li>)}</ol></details></section>}
    <section className={block}><h2 className={heading}>{copy.faq}</h2>{topicStudyFaq(note).map(f=><div key={f.question} className="mb-5"><h3 className="font-semibold">{f.question}</h3><p className="mt-2 leading-8"><MathText>{f.answer}</MathText></p></div>)}</section>
    <p className="text-sm leading-7 text-ink-muted">{copy.disclaimer}</p>
    <section className="note-qr-page rounded-2xl border border-neutral-300 bg-white p-6 text-center text-neutral-900" aria-labelledby="note-practice-heading">
      <h2 id="note-practice-heading" className="text-2xl font-semibold">{copy.qrTitle}</h2>
      <p className="my-3">{subjectName} · {note.titleZh}</p>
      <div className="mx-auto my-6 w-fit border border-neutral-300 bg-white p-3"><QRCode value={url} size={192} label={copy.qrTitle}/></div>
      <p className="my-4 leading-8">{copy.qrHelp}</p>
      <Link href={url} className="block break-all text-sm underline underline-offset-4">{url}</Link>
      <p className="mt-6 text-sm leading-7">{copy.disclaimer}</p>
    </section>
  </>
}
