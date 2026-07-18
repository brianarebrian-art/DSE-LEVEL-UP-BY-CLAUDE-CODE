'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Brain, Zap } from 'lucide-react'
import MathText from '@/components/MathText'
import BlindTestQuestion from '@/components/BlindTestQuestion'
import CountdownBanner from '@/components/CountdownBanner'
import { subjects, getActiveSubjects } from '@/data/subjects'
import { useLocale } from '@/lib/i18n'

// UI/UX 憲章 §3「清晨圖書館」light-first 首階段：landing 自足淺色（自帶背景，
// 唔郁全域 body），故內頁暗色維持不變、零爆版。全域 toggle + 內頁 migrate = Phase 2。
// 色板取憲章 §3.2：暖白底 #FAFAF8／卡片白／降飽和青 #00A8A0／暗金 #D4A017。
// 字重只用 400/500（憲章 §3.3），強調靠字級同顏色而非粗體。

const activeSubjects = getActiveSubjects()
const totalSubjects = subjects.length

// 真實數字（憲章 §4 規格牆；「4科」是憲章筆誤，實為 25 科）。
const statNums = ['10', '120+', '25']

export default function HomePage() {
  const { t, locale } = useLocale()
  const h = t.home
  const rootRef = useRef<HTMLDivElement>(null)

  const stats = [
    { num: statNums[0], unit: locale === 'en' ? '' : '年', label: h.statsItems[0].label },
    { num: statNums[1], unit: '', label: h.statsItems[1].label },
    { num: statNums[2], unit: locale === 'en' ? '' : '個', label: h.statsItems[2].label },
  ]

  // 純 CSS + Intersection Observer 進場動畫 + 大數字 count-up（憲章 §5，只觸發一次）。
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const els = Array.from(root.querySelectorAll('.animate-on-scroll'))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      els.forEach((el) => el.classList.add('visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('visible')
          entry.target.querySelectorAll<HTMLElement>('[data-count]').forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-count') || '0', 10)
            const suffix = counter.getAttribute('data-suffix') || ''
            const start = performance.now()
            const step = (now: number) => {
              const p = Math.min((now - start) / 1400, 1)
              counter.textContent = Math.floor(p * target).toString() + (p >= 1 ? suffix : '')
              if (p < 1) requestAnimationFrame(step)
            }
            requestAnimationFrame(step)
          })
          io.unobserve(entry.target)
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div ref={rootRef} className="min-h-screen bg-[#FAFAF8] text-[#2D2D2D]">
      <CountdownBanner />

      {/* ── HERO ── */}
      <section className="relative px-4 pt-20 pb-24">
        <div className="pointer-events-none absolute left-1/2 top-24 h-[280px] w-[560px] -translate-x-1/2 rounded-full bg-[#00A8A0]/[0.06] blur-3xl" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="animate-on-scroll mb-8 inline-flex items-center gap-2 rounded-full border border-[#00A8A0]/25 bg-[#00A8A0]/[0.07] px-4 py-2 text-sm font-medium text-[#00877F]">
            <span className="inline-block h-2 w-2 rounded-full bg-[#00A8A0]" />
            {locale === 'en' ? '📚 Personalised · For every student · 100% free' : '📚 因材施教 · 有教無類 · 完全免費'}
          </div>

          <h1 className="animate-on-scroll stagger-1 mb-6 text-4xl font-medium leading-[1.1] tracking-tight text-[#1A1A1A] sm:text-5xl md:text-6xl">
            {h.headline1}
            <br />
            <span className="bg-gradient-to-r from-[#00A8A0] to-[#00877F] bg-clip-text text-transparent">{h.headline2}</span>
          </h1>

          <p className="animate-on-scroll stagger-2 mx-auto mb-3 max-w-2xl text-xl text-[#6B6B6B]">{h.subhead}</p>

          <p className="animate-on-scroll stagger-2 mx-auto mb-3 max-w-2xl text-sm leading-relaxed text-[#9CA3AF]">
            {locale === 'en'
              ? 'Built by DSE alumni with AI — free, to help every student crack the core logic behind past-paper traps, one question at a time.'
              : '由 DSE 舊生 + AI 協作，免費同你逐題拆解歷屆試題陷阱背後嘅核心邏輯。'}
          </p>

          <div className="animate-on-scroll stagger-3 mb-10 flex items-center justify-center gap-4 text-sm text-[#9CA3AF]">
            <span>{h.trust1}</span>
            <span>·</span>
            <span>{h.trust2}</span>
            <span>·</span>
            <span>{h.trust3}</span>
          </div>

          <div className="animate-on-scroll stagger-4 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/subjects"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00726C] px-8 py-4 text-base font-medium text-white transition-all duration-200 hover:bg-[#005F5A] hover:-translate-y-0.5"
            >
              {h.ctaStart} <ArrowRight size={18} />
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/[0.08] bg-white px-8 py-4 text-base font-medium text-[#2D2D2D] transition-all duration-200 hover:border-[#00A8A0]/30 hover:-translate-y-0.5"
            >
              <Brain size={18} className="text-[#00A8A0]" /> {h.ctaMethod}
            </Link>
          </div>
        </div>
      </section>

      {/* ── 盲測黑題 —— 深色「終端」卡刻意做淺底對比 ── */}
      <section className="bg-white px-4 py-14">
        <div className="mx-auto max-w-md">
          <h2 className="animate-on-scroll mb-2 text-center text-2xl font-medium text-[#1A1A1A] sm:text-3xl">
            {locale === 'en' ? 'Can you see through the trap?' : '你睇唔睇穿到陷阱？'}
          </h2>
          <p className="animate-on-scroll stagger-1 mb-7 text-center text-sm text-[#6B6B6B]">
            {locale === 'en' ? 'Numbers blacked out — only the logic remains. See through it, don’t memorise.' : '數字全部塗黑，淨返邏輯。睇穿佢，唔使死記硬背。'}
          </p>
          <div className="animate-on-scroll stagger-2">
            <BlindTestQuestion />
          </div>
        </div>
      </section>

      {/* ── 三步拆解 ── */}
      <section className="bg-[#F5F5F0] px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="animate-on-scroll mb-3 text-center text-2xl font-medium text-[#1A1A1A] sm:text-3xl">{h.demoTitle}</h2>
          <p className="animate-on-scroll stagger-1 mb-12 text-center text-[#6B6B6B]">{h.demoSub}</p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="animate-on-scroll stagger-1 rounded-2xl border border-black/[0.08] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F5F5F0] text-xs font-medium text-[#6B6B6B]">1</span>
                <span className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">{h.step1Label}</span>
              </div>
              <div className="mb-3 font-mono text-xs text-[#00A8A0]">2023 DSE Math Paper 1 Q1</div>
              <p className="text-sm leading-relaxed text-[#2D2D2D]">
                {h.demoSolve}<MathText>$2x^2 + 3x - 5 = 0$</MathText>{h.demoFind}<MathText>$x$</MathText>{h.demoValueEnd}
              </p>
              <div className="mt-4 border-t border-black/[0.06] pt-4 text-xs text-[#9CA3AF]">
                {h.demoAnswer}<MathText>{'$x = 1$'}</MathText>{h.demoOr}<MathText>{'$x = -\\frac{5}{2}$'}</MathText>
              </div>
            </div>

            <div className="animate-on-scroll stagger-2 rounded-2xl border border-[#00A8A0]/25 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00A8A0]/15 text-xs font-medium text-[#00877F]">2</span>
                <span className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">{h.step2Label}</span>
              </div>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg">🔄</span>
                <span className="text-sm font-medium text-[#00877F]">{h.step2Framework}</span>
              </div>
              <p className="text-sm leading-relaxed text-[#6B6B6B]">{h.step2Desc}</p>
            </div>

            <div className="animate-on-scroll stagger-3 rounded-2xl border border-[#D4A017]/30 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#D4A017]/15 text-xs font-medium text-[#B8860B]">3</span>
                <span className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">{h.step3Label}</span>
              </div>
              <div className="mb-3 flex items-center gap-2">
                <Zap size={14} className="text-[#B8860B]" />
                <span className="text-sm font-medium text-[#B8860B]">{h.step3Tag}</span>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-[#2D2D2D]">
                {h.demoSolve}<MathText>$3x^2 + 5x - 2 = 0$</MathText>{h.demoFind}<MathText>$x$</MathText>{h.demoValueEnd}
              </p>
              <Link
                href="/subjects/math"
                className="block rounded-lg border border-[#00A8A0]/30 bg-[#00A8A0]/[0.06] py-2 text-center text-sm text-[#00877F] transition-all duration-200 hover:bg-[#00A8A0]/[0.12]"
              >
                {h.step3Cta}
              </Link>
            </div>
          </div>

          <p className="animate-on-scroll mt-6 text-center text-sm text-[#9CA3AF]">{h.demoNote}</p>
        </div>
      </section>

      {/* ── 規格牆（大數字 count-up）── */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map((s, i) => {
              const m = s.num.match(/^(\d+)(.*)$/)
              const target = m ? m[1] : s.num
              const numSuffix = m ? m[2] : ''
              return (
                <div key={i} className={`animate-on-scroll stagger-${i + 1}`}>
                  <div className="mb-1 text-4xl font-medium text-[#00A8A0] tabular-nums sm:text-5xl">
                    <span data-count={target} data-suffix={numSuffix}>0</span>
                    <span className="text-2xl">{s.unit}</span>
                  </div>
                  <div className="text-sm text-[#6B6B6B]">{s.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 使命：完全免費 ── */}
      <section className="bg-[#F5F5F0] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="animate-on-scroll mb-3 text-2xl font-medium text-[#1A1A1A] sm:text-3xl">
            {locale === 'en' ? 'Why it’s completely free' : '點解完全免費'}
          </h2>
          <p className="animate-on-scroll stagger-1 mx-auto mb-10 max-w-2xl leading-relaxed text-[#6B6B6B]">
            {locale === 'en'
              ? 'Real exam skill should never sit behind a wall — so we built it and opened it free, unconditionally, to every student.'
              : '攞分嘅真功夫，唔應該被任何一道牆擋住 —— 所以我哋重新砌返，無條件免費開放俾每一個學生。'}
          </p>
          <div className="grid gap-4 text-left sm:grid-cols-3">
            {[
              { icon: '🧠', title: locale === 'en' ? 'Efficient' : '高效', body: locale === 'en' ? 'Crack the underlying logic of past papers — not memorise answers that never come back.' : '拆穿歷屆試題嘅底層邏輯 —— 唔係死背啲唔會再出嘅答案。' },
              { icon: '⚖️', title: locale === 'en' ? 'Fair' : '公平', body: locale === 'en' ? 'Completely free. Every student — not only the ones who can afford star tutors — gets the same edge.' : '完全免費。唔止俾得起補習天王嘅人 —— 係每一個學生，都攞到同一個籌碼。' },
              { icon: '🤝', title: locale === 'en' ? 'For your family' : '利他', body: locale === 'en' ? 'Whatever you’d have spent on tutoring stays home with your family. That is the whole point.' : '本來要使喺補習嘅，留返喺屋企。呢個先係我哋嘅初心。' },
            ].map((c, i) => (
              <div key={i} className={`animate-on-scroll stagger-${i + 1} rounded-2xl border border-black/[0.08] bg-white p-5`}>
                <div className="mb-2 text-2xl">{c.icon}</div>
                <div className="mb-1 font-medium text-[#1A1A1A]">{c.title}</div>
                <p className="text-sm leading-relaxed text-[#6B6B6B]">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 科目 ── */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="animate-on-scroll mb-3 text-center text-2xl font-medium text-[#1A1A1A] sm:text-3xl">{h.subjectsTitle}</h2>
          <p className="animate-on-scroll stagger-1 mb-12 text-center text-[#6B6B6B]">{activeSubjects.length}{h.subjectsSubA}</p>

          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {activeSubjects.map((s, i) => (
              <Link
                key={s.id}
                href={`/subjects/${s.id}`}
                className={`animate-on-scroll stagger-${(i % 4) + 1} group rounded-xl border border-black/[0.08] bg-white p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-[#00A8A0]/40 hover:shadow-[0_8px_30px_rgba(0,168,160,0.08)]`}
              >
                <div className="mb-2 text-3xl">{s.emoji}</div>
                <div className="mb-1 text-sm font-medium text-[#2D2D2D]">{locale === 'en' ? s.shortEn : s.short}</div>
                <div className="flex items-center justify-center gap-1 text-[11px] text-[#00877F]">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00A8A0]" /> {t.common.live}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/subjects" className="inline-flex items-center gap-2 text-sm text-[#00877F] transition-colors hover:text-[#00A8A0]">
              {h.roadmapA}{totalSubjects}{h.roadmapB} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#FDFCF8] px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="animate-on-scroll mb-4 text-3xl font-medium text-[#1A1A1A] sm:text-4xl">{h.ctaTitle}</h2>
          <p className="animate-on-scroll stagger-1 mb-8 text-[#6B6B6B]">{h.ctaSub}</p>
          <Link
            href="/subjects"
            className="animate-on-scroll stagger-2 inline-flex items-center gap-3 rounded-xl bg-[#00726C] px-10 py-5 text-lg font-medium text-white transition-all duration-200 hover:bg-[#005F5A] hover:-translate-y-0.5"
          >
            {h.ctaBtn} <ArrowRight size={22} />
          </Link>
          <p className="animate-on-scroll stagger-3 mt-4 text-sm text-[#9CA3AF]">{h.ctaNote}</p>
        </div>
      </section>
    </div>
  )
}
