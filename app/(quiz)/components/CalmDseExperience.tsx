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

const subjects = [
  '中文', '英文', '數學', '公民與社會發展', '生物', '化學', '物理', '地理', '歷史', '中國歷史',
  '經濟', '企業會計與財務概論', '資訊及通訊科技', '視覺藝術', '音樂', '體育', '旅遊與款待',
  '健康管理與社會關懷', '英國文學', '中國文學', '倫理與宗教', '科技與生活', '設計與應用科技',
  '創意媒體', '組合科學',
]

const fontSizes = [
  { label: 'A−', value: 0.9, name: '較細字級' },
  { label: 'A', value: 1, name: '標準字級' },
  { label: 'A+', value: 1.5, name: '放大字級' },
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
  const [selectedSubject, setSelectedSubject] = useState('數學')
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
            <p className="mb-4 text-sm font-medium text-[#4A656C]">DSE Level Up · 鬆綁練習</p>
            <h1 className="text-balance font-serif text-4xl font-semibold leading-tight sm:text-6xl">
              唔使死背，<span className="text-[#4A656C]">一樣 Level Up。</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-[#6C6A65] sm:mt-6 sm:text-lg">
              15 分鐘重判斷・睇清出題邏輯・25 科 27,000+ 題・永久免費零廣告
            </p>
          </div>
          <section aria-labelledby="display-settings-heading" className="mx-auto w-full max-w-3xl rounded-3xl border border-[#E8E2D8] bg-[#FFFEFB] p-5 text-left shadow-[0_8px_32px_rgba(0,0,0,0.04)] sm:p-6">
            <div className="mb-5 flex items-start gap-3">
              <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E8DDD0]/70 text-[#514E48]">
                <Accessibility aria-hidden="true" size={20} strokeWidth={1.5} />
              </span>
              <div>
                <h2 id="display-settings-heading" className="text-lg font-semibold">顯示設定</h2>
                <p className="mt-1 text-sm text-[#69635F]">按你舒服嘅方式調整字級、護眼同動態。</p>
              </div>
            </div>

            <p role="status" aria-live="polite" className="mb-4 text-sm text-[#69635F]">
              字級 {Math.round(fontScale * 100)}% · 護眼{eyeCare ? '已開啟' : '已關閉'} · 減少動態{reduceMotion ? '已開啟' : '已關閉'}
            </p>

            <div className="grid gap-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-end">
              <fieldset>
                <legend className="mb-2 flex items-center gap-2 text-sm font-medium text-[#57544E]">
                  <Type aria-hidden="true" size={18} strokeWidth={1.5} /> 文字大小
                </legend>
                <div className="grid grid-cols-3 gap-2">
                  {fontSizes.map(({ label, value, name }) => (
                    <button
                      key={label}
                      type="button"
                      aria-label={name}
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

              <div role="group" aria-label="閱讀偏好" className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  aria-pressed={eyeCare}
                  onClick={() => setEyeCare((active) => !active)}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-full border px-3 text-sm font-medium transition-colors motion-reduce:transition-none ${focusClasses} ${eyeCare ? 'border-[#A58F7A] bg-[#E8DDD0] text-[#514E48]' : 'border-[#DCD7CE] bg-[#FDFBF7] text-[#57544E] hover:bg-[#F0EEE7]'}`}
                >
                  <Eye aria-hidden="true" size={18} strokeWidth={1.5} /> 護眼
                </button>
                <button
                  type="button"
                  aria-pressed={reduceMotion}
                  onClick={() => setReduceMotion((active) => !active)}
                  className={`flex min-h-11 items-center justify-center gap-2 rounded-full border px-3 text-sm font-medium transition-colors motion-reduce:transition-none ${focusClasses} ${reduceMotion ? 'border-[#A58F7A] bg-[#E8DDD0] text-[#514E48]' : 'border-[#DCD7CE] bg-[#FDFBF7] text-[#57544E] hover:bg-[#F0EEE7]'}`}
                >
                  <Wind aria-hidden="true" size={18} strokeWidth={1.5} /> 減少動態
                </button>
              </div>
            </div>
          </section>
          <a
            href="#practice"
            className={`inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[#4A656C] px-7 py-3 text-base font-semibold text-white shadow-[0_8px_32px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#526354] active:bg-[#465448] ${focusClasses}`}
          >
            即刻鬆綁，開始 15 分鐘
            <ArrowRight aria-hidden="true" size={20} strokeWidth={1.5} />
          </a>
          <ul aria-label="平台特色" className="flex flex-wrap justify-center gap-2">
            {['秒開', '零廣告', 'SEN 友善'].map((item) => (
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
                <p className="text-sm text-[#69635F]">今日練習 · 約 15 分鐘</p>
                <h2 id="practice-heading" className="mt-1 text-2xl font-semibold sm:text-3xl">揀一科，慢慢開始</h2>
              </div>
              <span className="rounded-full bg-[#E8DDD0] px-4 py-2 text-sm font-medium text-[#514E48]">10 題一小節</span>
            </div>

            <div role="group" aria-label="選擇科目" className="mb-6 flex flex-wrap gap-2">
              {subjects.map((subject) => {
                const selected = selectedSubject === subject
                return (
                  <button
                    key={subject}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setSelectedSubject(subject)}
                    className={`${pillBase} ${focusClasses} ${selected ? 'border-[#687966] bg-[#4A656C] hover:bg-[#3E555B]' : 'border-[#DCD7CE] bg-[#FFFEFB] hover:border-[#899783] hover:bg-[#F0EEE7]'}`}
                    style={{ color: selected ? 'var(--color-on-accent)' : '#57544E' }}
                  >
                    {subject}
                  </button>
                )
              })}
            </div>

            <div className="mb-4 flex items-center gap-3" aria-label="練習進度：第 3 題，共 10 題">
              <span className="shrink-0 text-sm tabular-nums text-[#6C6A65]">3 / 10</span>
              <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-[#E2DED5]">
                <div className="h-full w-[30%] rounded-full bg-[#899783]" />
              </div>
            </div>

            <article className="rounded-3xl border border-[#EEEAE2] bg-[#FFFEFB] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] sm:p-10">
              <p className="mb-5 text-sm text-[#69635F]">概念判斷 · 連續性</p>
              <h3 className="mb-4 text-xl font-semibold leading-relaxed text-[#2B2B2B] sm:text-2xl">
                若函數 <MathText className="break-words" >$f(x)$</MathText> 在 <MathText className="break-words">$x=a$</MathText> 連續，以下說法是否正確？
              </h3>
              <div className="my-5 min-w-0 break-words rounded-2xl bg-[#F6F3ED] px-4 py-5 text-center text-lg sm:px-6 sm:py-6" style={{ fontSize: `${18 * fontScale}px` }}>
                <MathText className="break-words">{'$\\lim_{x \\to a} f(x) = f(a)$'}</MathText>
              </div>
              <p className="mb-6 text-sm text-[#77736D]">小提示：連續性同極限有關。可以先諗一諗，再揀答案。</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  aria-pressed={answer === 'correct'}
                  onClick={() => setAnswer('correct')}
                  className={`flex min-h-14 items-center justify-center gap-2 rounded-full border px-5 text-base font-semibold transition-colors motion-reduce:transition-none ${focusClasses} ${answer === 'correct' ? 'border-[#687966] bg-[#E5EBE2] text-[#354435]' : 'border-[#D8DDD4] bg-[#F7F8F4] text-[#4C594A] hover:bg-[#E9EEE6]'}`}
                >
                  <Check aria-hidden="true" size={20} strokeWidth={1.5} /> 正確
                </button>
                <button
                  type="button"
                  aria-pressed={answer === 'incorrect'}
                  onClick={() => setAnswer('incorrect')}
                  className={`flex min-h-14 items-center justify-center gap-2 rounded-full border px-5 text-base font-semibold transition-colors motion-reduce:transition-none ${focusClasses} ${answer === 'incorrect' ? 'border-[#A58F7A] bg-[#F1E8DF] text-[#665346]' : 'border-[#DED6CE] bg-[#FAF7F3] text-[#66584D] hover:bg-[#F1E8DF]'}`}
                >
                  <X aria-hidden="true" size={20} strokeWidth={1.5} /> 錯誤
                </button>
              </div>
            </article>
          </div>
        </section>

        <section aria-labelledby="reflection-heading" className="mx-auto w-full max-w-3xl">
          <div className="mb-6">
            <p className="text-sm text-[#69635F]">一點點回看</p>
            <h2 id="reflection-heading" className="mt-1 text-2xl font-semibold sm:text-3xl">清醒咗啲喇</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-3xl border border-[#E8E2D8] bg-[#FFFEFB] p-6 sm:p-7">
              <h3 className="text-lg font-semibold">學習方向參考</h3>
              <p className="mt-1 text-sm text-[#77736D]">呢個係練習方向，唔係成績預測。</p>
              <div className="mt-5 flex flex-col gap-3" aria-label="學習方向示意圖">
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
              <h3 className="text-lg font-semibold">今次留意到</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {['睇漏題目入面嘅條件', '將相似概念混埋一齊', '可以試下先圈出關鍵字'].map((item, index) => (
                  <li key={item} className={`rounded-2xl px-4 py-3 text-sm ${index === 2 ? 'bg-[#E8DDD0]/60' : 'bg-[#F6F3ED]'}`}>
                    <span className="font-medium text-[#57544E]">{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
          <p className="mt-4 rounded-2xl bg-[#E8DDD0]/65 px-5 py-4 text-center text-base font-medium text-[#5E554C]">
            你唔係唔識，係呢度諗多咗。
          </p>
        </section>

        <section aria-labelledby="capsule-heading" className="mx-auto w-full max-w-3xl">
          <div className="rounded-3xl border border-[#E8E2D8] bg-[#FFFEFB] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.04)] sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-[#E8DDD0]/70 text-[#514E48]">
                <Lightbulb aria-hidden="true" size={20} strokeWidth={1.5} />
              </span>
              <div>
                <h2 id="capsule-heading" className="text-xl font-semibold">留句說話畀未來嘅自己</h2>
                <p className="text-sm text-[#77736D]">寫低而家嘅心情，唔使寫得完美。</p>
              </div>
            </div>
            <label htmlFor="time-capsule" className="sr-only">寫句說話畀 1 個月後嘅自己</label>
            <textarea
              id="time-capsule"
              name="time-capsule"
              autoComplete="off"
              rows={3}
              placeholder="寫句說話畀 1 個月後嘅自己…"
              className={`w-full resize-y rounded-2xl border border-[#DCD7CE] bg-[#FDFBF7] px-4 py-3 text-base leading-relaxed placeholder:text-[#77736D] ${focusClasses}`}
            />
            <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#77736D]">只係一個靜靜嘅 UI 示範，文字唔會送出或儲存。</p>
              <button
                type="button"
                aria-pressed={capsuleSealed}
                onClick={() => setCapsuleSealed((sealed) => !sealed)}
                className={`inline-flex min-h-12 w-full items-center justify-center rounded-full px-6 font-semibold transition-colors motion-reduce:transition-none sm:w-auto ${focusClasses} ${capsuleSealed ? 'bg-[#E8DDD0] text-[#514E48]' : 'bg-[#4A656C] text-white hover:bg-[#526354]'}`}
              >
                {capsuleSealed ? '已封存' : '封存'}
              </button>
            </div>
          </div>
        </section>
      </div>

    </main>
  )
}
