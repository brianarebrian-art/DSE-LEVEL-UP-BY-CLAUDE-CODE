'use client'

import { useState } from 'react'
import {
  Accessibility,
  ArrowRight,
  Check,
  Eye,
  Lightbulb,
  Type,
  Wind,
  X,
} from 'lucide-react'
import MathText from '@/components/MathText'
import { getActiveSubjects } from '@/data/subjects'
import { TOTAL_QUESTIONS } from '@/data/questions/summary.generated'
import { useLocale } from '@/lib/i18n'

const subjects = getActiveSubjects()

const fontSizes = [
  { label: 'A−', value: 0.9, nameZh: '較細字級', nameEn: 'Smaller text' },
  { label: 'A', value: 1, nameZh: '標準字級', nameEn: 'Standard text' },
  { label: 'A+', value: 1.5, nameZh: '放大字級', nameEn: 'Larger text' },
]

const gradeBars = [
  { label: '5**', width: '20%' },
  { label: '5*', width: '42%' },
  { label: '5', width: '68%' },
  { label: '4', width: '86%' },
  { label: '3', width: '54%' },
]

const focusClasses = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526354]'
const pillBase = 'inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border px-4 text-sm transition-colors motion-reduce:transition-none'

export default function CalmDseExperience() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const tr = (zh: string, english: string) => en ? english : zh
  const [selectedSubject, setSelectedSubject] = useState('math')
  const [answer, setAnswer] = useState<'correct' | 'incorrect' | null>(null)
  const [fontScale, setFontScale] = useState(1)
  const [eyeCare, setEyeCare] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [capsuleSealed, setCapsuleSealed] = useState(false)

  return (
    <main
      className={`min-h-screen overflow-x-clip text-[#2B2B2B] ${eyeCare ? 'bg-[#F1EBDD]' : 'bg-[#F6F3ED]'} ${reduceMotion ? '[&_*]:transition-none' : ''}`}
      style={{ fontSize: `${16 * fontScale}px`, letterSpacing: '0.02em', lineHeight: 1.8 }}
      data-reduced-motion={reduceMotion ? 'true' : 'false'}
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-14 px-4 pb-24 pt-8 sm:gap-20 sm:px-8 sm:pb-20 sm:pt-14">
        <header className="flex flex-col items-center gap-8 text-center sm:gap-10">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-medium text-[#4A656C]">{tr('DSE Level Up · 鬆綁練習', 'DSE Level Up · Calm practice')}</p>
            <h1 className="text-balance font-serif text-4xl font-semibold leading-tight sm:text-6xl">
              {tr('唔使死背，', 'No rote learning. ')}<span className="text-[#4A656C]">{tr('一樣 Level Up。', 'Still level up.')}</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-[#6C6A65] sm:mt-6 sm:text-lg">
              {tr('15 分鐘重判斷・睇清出題邏輯', '15 minutes of thoughtful practice')} · {subjects.length} {tr('科', 'subjects')} · {TOTAL_QUESTIONS.toLocaleString('en-US')} {tr('題・永久免費零廣告', 'questions · Free, no ads')}
            </p>
          </div>
          <section aria-labelledby="display-settings-heading" className="mx-auto w-full max-w-3xl rounded-3xl border border-[#E8E2D8] bg-[#FFFEFB] p-5 text-left shadow-[0_8px_32px_rgba(0,0,0,0.04)] sm:p-6">
            <div className="mb-5 flex items-start gap-3">
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E8DDD0]/70 text-[#514E48]">
                <Accessibility aria-hidden="true" size={20} strokeWidth={1.5} />
              </span>
              <div>
                <h2 id="display-settings-heading" className="text-lg font-semibold">{tr('顯示設定', 'Display settings')}</h2>
                <p className="mt-1 text-sm text-[#69635F]">{tr('按你舒服嘅方式調整字級、護眼同動態。', 'Adjust text, eye comfort and motion to suit you.')}</p>
              </div>
            </div>

            <p role="status" aria-live="polite" className="mb-4 text-sm text-[#69635F]">
              {tr('字級', 'Text size')} {Math.round(fontScale * 100)}% · {tr('護眼', 'Eye comfort')} {eyeCare ? tr('已開啟', 'on') : tr('已關閉', 'off')} · {tr('減少動態', 'Reduced motion')} {reduceMotion ? tr('已開啟', 'on') : tr('已關閉', 'off')}
            </p>

            <div className="grid gap-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-end">
              <fieldset>
                <legend className="mb-2 flex items-center gap-2 text-sm font-medium text-[#57544E]">
                  <Type aria-hidden="true" size={18} strokeWidth={1.5} /> {tr('文字大小', 'Text size')}
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {fontSizes.map(({ label, value, nameZh, nameEn }) => (
                    <button
                      key={label}
                      type="button"
                      aria-label={en ? nameEn : nameZh}
                      aria-pressed={fontScale === value}
                      onClick={() => setFontScale(value)}
                      className={`min-h-11 rounded-full border px-3 text-sm font-semibold transition-colors motion-reduce:transition-none ${focusClasses} ${fontScale === value ? 'border-[#4A656C] bg-[#4A656C]' : 'border-[#DCD7CE] bg-[#FDFBF7] hover:bg-[#F0EEE7]'}`}
                      style={{ color: fontScale === value ? 'var(--color-on-accent)' : '#57544E' }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div role="group" aria-label={tr('閱讀偏好', 'Reading preferences')} className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  aria-pressed={eyeCare}
                  onClick={() => setEyeCare((active) => !active)}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-full border px-3 text-sm font-medium transition-colors motion-reduce:transition-none ${focusClasses} ${eyeCare ? 'border-[#A58F7A] bg-[#E8DDD0] text-[#514E48]' : 'border-[#DCD7CE] bg-[#FDFBF7] text-[#57544E] hover:bg-[#F0EEE7]'}`}
                >
                  <Eye aria-hidden="true" size={18} strokeWidth={1.5} /> {tr('護眼', 'Eye comfort')}
                </button>
                <button
                  type="button"
                  aria-pressed={reduceMotion}
                  onClick={() => setReduceMotion((active) => !active)}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-full border px-3 text-sm font-medium transition-colors motion-reduce:transition-none ${focusClasses} ${reduceMotion ? 'border-[#A58F7A] bg-[#E8DDD0] text-[#514E48]' : 'border-[#DCD7CE] bg-[#FDFBF7] text-[#57544E] hover:bg-[#F0EEE7]'}`}
                >
                  <Wind aria-hidden="true" size={18} strokeWidth={1.5} /> {tr('減少動態', 'Reduce motion')}
                </button>
              </div>
            </div>
          </section>
          <a
            href="#practice"
            className={`inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#4A656C] px-7 py-3 text-base font-semibold text-white shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#526354] active:bg-[#465448] ${focusClasses}`}
          >
            {tr('即刻鬆綁，開始 15 分鐘', 'Start 15 calm minutes')}
            <ArrowRight aria-hidden="true" size={20} strokeWidth={1.5} />
          </a>
          <ul aria-label={tr('平台特色', 'Platform features')} className="flex flex-wrap justify-center gap-2">
            {[tr('秒開', 'Quick start'), tr('零廣告', 'No ads'), tr('SEN 友善', 'SEN-friendly')].map((item) => (
              <li key={item} className="rounded-full border border-[#D9D4CA] bg-[#FFFEFB] px-4 py-2 text-sm text-[#65635E]">
                {item}
              </li>
            ))}
          </ul>
        </header>


        <section id="practice" aria-labelledby="practice-heading" className="scroll-mt-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm text-[#69635F]">{tr('今日練習 · 約 15 分鐘', 'Today’s practice · about 15 minutes')}</p>
                <h2 id="practice-heading" className="mt-1 text-2xl font-semibold sm:text-3xl">{tr('揀一科，慢慢開始', 'Choose a subject at your pace')}</h2>
              </div>
              <span className="rounded-full bg-[#E8DDD0] px-4 py-2 text-sm font-medium text-[#514E48]">{tr('10 題一小節', '10 questions per set')}</span>
            </div>

            <div role="group" aria-label={tr('選擇科目', 'Choose a subject')} className="mb-6 flex flex-wrap gap-2">
              {subjects.map((subject) => {
                const selected = selectedSubject === subject.id
                return (
                  <button
                    key={subject.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setSelectedSubject(subject.id)}
                    className={`${pillBase} ${focusClasses} ${selected ? 'border-[#687966] bg-[#4A656C] hover:bg-[#3E555B]' : 'border-[#DCD7CE] bg-[#FFFEFB] hover:border-[#899783] hover:bg-[#F0EEE7]'}`}
                    style={{ color: selected ? 'var(--color-on-accent)' : '#57544E' }}
                  >
                    {en ? subject.nameEn : subject.name}
                  </button>
                )
              })}
            </div>

            <div className="mb-4 flex items-center gap-3" aria-label={tr('練習進度：第 3 題，共 10 題', 'Practice progress: question 3 of 10')}>
              <span className="shrink-0 text-sm tabular-nums text-[#6C6A65]">3 / 10</span>
              <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-[#E2DED5]">
                <div className="h-full w-[30%] rounded-full bg-[#899783]" />
              </div>
            </div>

            <article className="rounded-3xl border border-[#EEEAE2] bg-[#FFFEFB] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] sm:p-10">
              <p className="mb-5 text-sm text-[#69635F]">{tr('概念判斷 · 連續性', 'Concept check · Continuity')}</p>
              <h3 className="mb-4 text-xl font-semibold leading-relaxed text-[#2B2B2B] sm:text-2xl">
                {tr('若函數', 'If')} <MathText className="break-words">$f(x)$</MathText> {tr('在', 'is continuous at')} <MathText className="break-words">$x=a$</MathText>{tr('連續，以下說法是否正確？', ', is the following statement correct?')}
              </h3>
              <div className="my-5 min-w-0 break-words rounded-2xl bg-[#F6F3ED] px-4 py-5 text-center text-lg sm:px-6 sm:py-6" style={{ fontSize: `${18 * fontScale}px` }}>
                <MathText className="break-words">{'$\\lim_{x \\to a} f(x) = f(a)$'}</MathText>
              </div>
              <p className="mb-6 text-sm text-[#77736D]">{tr('小提示：連續性同極限有關。可以先諗一諗，再揀答案。', 'Hint: continuity relates to limits. Take your time before answering.')}</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  aria-pressed={answer === 'correct'}
                  onClick={() => setAnswer('correct')}
                  className={`flex min-h-14 items-center justify-center gap-2 rounded-full border px-5 text-base font-semibold transition-colors motion-reduce:transition-none ${focusClasses} ${answer === 'correct' ? 'border-[#687966] bg-[#E5EBE2] text-[#354435]' : 'border-[#D8DDD4] bg-[#F7F8F4] text-[#4C594A] hover:bg-[#E9EEE6]'}`}
                >
                  <Check aria-hidden="true" size={20} strokeWidth={1.5} /> {tr('正確', 'Correct')}
                </button>
                <button
                  type="button"
                  aria-pressed={answer === 'incorrect'}
                  onClick={() => setAnswer('incorrect')}
                  className={`flex min-h-14 items-center justify-center gap-2 rounded-full border px-5 text-base font-semibold transition-colors motion-reduce:transition-none ${focusClasses} ${answer === 'incorrect' ? 'border-[#A58F7A] bg-[#F1E8DF] text-[#665346]' : 'border-[#DED6CE] bg-[#FAF7F3] text-[#66584D] hover:bg-[#F1E8DF]'}`}
                >
                  <X aria-hidden="true" size={20} strokeWidth={1.5} /> {tr('錯誤', 'Incorrect')}
                </button>
              </div>
            </article>
          </div>
        </section>

        <section aria-labelledby="reflection-heading" className="mx-auto w-full max-w-3xl">
          <div className="mb-6">
            <p className="text-sm text-[#69635F]">{tr('一點點回看', 'A little reflection')}</p>
            <h2 id="reflection-heading" className="mt-1 text-2xl font-semibold sm:text-3xl">{tr('清醒咗啲喇', 'A clearer mind')}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-3xl border border-[#E8E2D8] bg-[#FFFEFB] p-6 sm:p-7">
              <h3 className="text-lg font-semibold">{tr('學習方向參考', 'Learning direction')}</h3>
              <p className="mt-1 text-sm text-[#77736D]">{tr('呢個係練習方向，唔係成績預測。', 'A learning direction, not a grade prediction.')}</p>
              <div className="mt-5 flex flex-col gap-3" aria-label={tr('學習方向示意圖', 'Illustrative learning direction')}>
                {gradeBars.map((bar) => (
                  <div key={bar.label} className="flex items-center gap-3 text-sm">
                    <span className="w-8 shrink-0 text-[#69635F]">{bar.label}</span>
                    <div className="h-2 flex-1 rounded-full bg-[#F0EBE3]">
                      <div className="h-full rounded-full bg-[#A8B5A0]" style={{ width: bar.width }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
            <article className="rounded-3xl border border-[#E8E2D8] bg-[#FFFEFB] p-6 sm:p-7">
              <h3 className="text-lg font-semibold">{tr('今次留意到', 'What I noticed')}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {[tr('睇漏題目入面嘅條件', 'Missed a condition'), tr('將相似概念混埋一齊', 'Mixed up similar concepts'), tr('可以試下先圈出關鍵字', 'Try circling the key words')].map((item, index) => (
                  <li key={item} className={`rounded-2xl px-4 py-3 text-sm ${index === 2 ? 'bg-[#E8DDD0]/60' : 'bg-[#F6F3ED]'}`}>
                    <span className="font-medium text-[#57544E]">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
          <p className="mt-4 rounded-2xl bg-[#E8DDD0]/65 px-5 py-4 text-center text-base font-medium text-[#5E554C]">
            {tr('你唔係唔識，係呢度諗多咗。', 'You are learning. This part just needed another look.')}
          </p>
        </section>

        <section aria-labelledby="capsule-heading" className="mx-auto w-full max-w-3xl">
          <div className="rounded-3xl border border-[#E8E2D8] bg-[#FFFEFB] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-[#E8DDD0]/70 text-[#514E48]">
                <Lightbulb aria-hidden="true" size={20} strokeWidth={1.5} />
              </span>
              <div>
                <h2 id="capsule-heading" className="text-xl font-semibold">{tr('留句說話畀未來嘅自己', 'A message to your future self')}</h2>
                <p className="text-sm text-[#77736D]">{tr('寫低而家嘅心情，唔使寫得完美。', 'Write how you feel. It does not need to be perfect.')}</p>
              </div>
            </div>
            <label htmlFor="time-capsule" className="sr-only">{tr('寫句說話畀 1 個月後嘅自己', 'A message to yourself in one month')}</label>
            <textarea
              id="time-capsule"
              name="time-capsule"
              autoComplete="off"
              rows={3}
              placeholder={tr('寫句說話畀 1 個月後嘅自己…', 'A message to yourself in one month…')}
              className={`w-full resize-y rounded-2xl border border-[#DCD7CE] bg-[#FDFBF7] px-4 py-3 text-base leading-relaxed placeholder:text-[#77736D] ${focusClasses}`}
            />
            <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#77736D]">{tr('只係一個靜靜嘅 UI 示範，文字唔會送出或儲存。', 'A UI demo only. Your text is not sent or saved.')}</p>
              <button
                type="button"
                aria-pressed={capsuleSealed}
                onClick={() => setCapsuleSealed((sealed) => !sealed)}
                className={`inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 font-semibold transition-colors motion-reduce:transition-none sm:w-auto ${focusClasses} ${capsuleSealed ? 'bg-[#E8DDD0] text-[#514E48]' : 'bg-[#4A656C] text-white hover:bg-[#526354]'}`}
              >
                {capsuleSealed ? tr('已封存', 'Sealed') : tr('封存', 'Seal')}
              </button>
            </div>
          </div>
        </section>
      </div>

    </main>
  )
}
