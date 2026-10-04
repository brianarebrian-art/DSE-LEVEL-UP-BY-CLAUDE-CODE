'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Brain, Zap } from 'lucide-react'
import BlindTestQuestion from '@/components/BlindTestQuestion'
import CountdownBanner from '@/components/CountdownBanner'
import InstallHint from '@/components/InstallHint'
import ContinueCard from '@/components/ContinueCard'
import { subjects, getActiveSubjects } from '@/data/subjects'
// 只攞簽名狀態，唔攞內容 —— 首頁唔需要 48 條對照，攞咗就白白 build 入 bundle。
// 由 summary.generated.ts 攞總數，唔好 import barrel ——
// barrel 靜態 import 齊 25 科題庫，喺 'use client' 檔掂親就會將 2.2MB 題目
// build 入首頁（2026-09-05 生產站實測：首頁載入 28 個題庫 chunk，涵蓋 23 科，
// 一條都冇顯示過）。呢一頁只係想要一個總數。
import { TOTAL_QUESTIONS, CONTENT_STATS } from '@/data/questions/summary.generated'
import { SESSION_SIZE, sessionMinutes } from '@/lib/entitlements'
import { quickStartSubjects, quickStartHref } from '@/lib/quickStart'
import { useLocale } from '@/lib/i18n'
// 方向一：季節性 Hero（純前端按月切換文案；light-first 不變）
import { getCurrentSeason } from '@/utils/season'
import { getSeasonalHero } from '@/data/heroContent'
import Mascot from '@/components/Mascot'

// UI/UX 憲章 §3「清晨圖書館」light-first 首階段：landing 自足淺色（自帶背景，
// 唔郁全域 body），故內頁暗色維持不變、零爆版。全域 toggle + 內頁 migrate = Phase 2。
// 色板取憲章 §3.2：暖白底 #FAFAF8／卡片白／降飽和青 #00A8A0／暗金 #D4A017。
// 字重只用 400/500（憲章 §3.3），強調靠字級同顏色而非粗體。

const activeSubjects = getActiveSubjects()
const totalSubjects = subjects.length
const quickSubjects = quickStartSubjects()
const sessionMins = sessionMinutes()

// 首頁規格牆三個大數字。
//
// 2026-08-20：題數由硬編「120+」改為即時由題庫計算。
// 2026-09-29：另外兩個數字撤下，因為兩者均無資料支持（憲章 §8 不虛構數據）：
//   ①「10 年 · 年份分析（2014–2023）」—— 當日實測，題庫大部分題目沒有年份欄位，
//     有年份者全屬 2019–2025，沒有任何一題標示 2014–2018。
//   ②「25 個核心思維框架」—— 數值其實是科目數目，並非框架數目；
//     數學科頁面實際列出的框架只有七個。
// 改為三個可由程式碼推導、學生關心的數字：題數、一節題數（SESSION_SIZE）、費用。
const statNums = [TOTAL_QUESTIONS, SESSION_SIZE, 0]

// 首頁示範的幾條算式用純文字（2026-09-30，UX 循環 LOOP 38）。原本經 MathText 用 KaTeX 排版，
// 令首頁要下載 256KB（未壓縮）的 KaTeX，只為六條固定算式。上標「²」讀屏軟件會讀作 squared。
function M({ children }: { children: string }) {
  return <span className="whitespace-nowrap font-serif italic">{children}</span>
}

/** 四個核心科目，一撳開始一節（首頁頂部及底部共用，audit loop T09）。 */
function QuickStartGrid({ labelledBy, en }: { labelledBy: string; en: boolean }) {
  return (
    <ul aria-labelledby={labelledBy} className="grid grid-cols-4 gap-2 sm:gap-3">
      {quickSubjects.map((s) => (
        <li key={s.id}>
          <Link
            href={quickStartHref(s.id)}
            aria-label={en ? `${s.shortEn}: start ${SESSION_SIZE} questions` : `${s.short}：開始 ${SESSION_SIZE} 題`}
            className="flex min-h-[64px] flex-col items-center justify-center gap-0.5 rounded-xl bg-accent-strong px-1 text-base font-medium text-on-accent transition-colors duration-200 hover:bg-accent-hover"
          >
            <span aria-hidden className="text-lg leading-none">{s.emoji}</span>
            {en ? s.shortEn : s.short}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function HomePage() {
  const { t, locale } = useLocale()
  const h = t.home
  const en = locale === 'en'
  const rootRef = useRef<HTMLDivElement>(null)
  // 季節性 Hero 文案（按月份，deterministic → SSR/CSR 一致，無 hydration mismatch）
  const hero = getSeasonalHero(getCurrentSeason(), locale === 'en')

  const stats = [
    { num: statNums[0], prefix: '', unit: '', label: h.statsItems[0].label },
    { num: statNums[1], prefix: '', unit: locale === 'en' ? '' : '題', label: h.statsItems[1].label },
    { num: statNums[2], prefix: locale === 'en' ? 'HK$' : '', unit: locale === 'en' ? '' : '元', label: h.statsItems[2].label },
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
            // 由 0 數上去係【裝飾】。真數已經喺 SSR 出咗，所以動畫中途改寫成
            // 細數之後，一定要保證回得返真數 —— 用 setTimeout 兜底：rAF 喺隱藏
            // 分頁完全唔行，setTimeout 只會被節流。缺咗呢個保險，用戶喺動畫途中
            // 切走再返嚟，就會永遠停喺一個中途數字。
            // 千位分隔與信任列一致（規格牆以前顯示不帶逗號的數字）。
            const settle = () => { counter.textContent = target.toLocaleString('en-US') + suffix }
            const start = performance.now()
            const step = (now: number) => {
              const p = Math.min((now - start) / 1400, 1)
              counter.textContent = Math.floor(p * target).toLocaleString('en-US') + (p >= 1 ? suffix : '')
              if (p < 1) requestAnimationFrame(step)
            }
            if (document.hidden) { settle() } else {
              requestAnimationFrame(step)
              setTimeout(settle, 1400 + 250)
            }
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
    <div ref={rootRef} className="min-h-screen bg-surface text-ink-soft">
      <CountdownBanner />
      {/* 「加到主畫面」輕提示：已裝／撳過唔使／瀏覽器唔支援都唔出（見組件檔頭） */}
      <InstallHint />

      {/* ── HERO ──
          2026-09-29 手機首屏重排。375×812 實測：主 CTA「開始練習」原位於 y=807，
          而底部導航由 y=755 開始 —— 在最多人使用的裝置上，第一屏看不到主按鈕。
          ① 吉祥物在手機縮小（高約 104px），徽章在手機隱藏（與 h1 內容重複）；
          ② CTA 移到副標題之後，「DSE 舊生 + AI」及信任標記移到 CTA 之下；
          ③ 進場動畫改用純 CSS（.hero-rise，見 globals.css），不再等待 JavaScript
             hydrate 才由 opacity 0 變為可見。
          2026-09-30（UX 循環 LOOP 2）：桌面頂部留白及徽章、副標題下方間距各減一級，
          令 1280×800 手提電腦的首屏亦見到「揀其他科目」。 */}
      <section className="relative px-4 pt-8 pb-16 sm:pt-12 sm:pb-24">
        {/* 裝飾光暈。w-full max-w-[560px]：以前寫死 w-[560px]，喺 375px 機上左右各爆 93px，
            令 Chrome 將版面視窗由 375 撐大到 467（＝成頁自動縮細 20%，字細咗一圈，
            對讀寫障礙同弱視考生尤其傷）。改成流體寬度後桌面版一模一樣，手機版啱啱好。 */}
        <div className="pointer-events-none absolute left-1/2 top-24 h-[280px] w-full max-w-[560px] -translate-x-1/2 rounded-full bg-accent/[0.06] blur-3xl" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          {/* 回訪學生：一按即繼續上次練習（沒有紀錄則不顯示，初次訪客所見不變）。 */}
          <ContinueCard />

          {/* 吉祥物擺喺標題之上 —— 訪客見到嘅第一件嘢。
              擺呢隻嘅目的係認得出個網站，所以佢應該喺最強嗰個位，
              唔係收埋喺頁尾做裝飾。揀「讀緊書」呢個姿勢而唔係滑板嗰隻：
              首屏要一眼講到呢度係做咩嘅。
              priority：佢喺 LCP 範圍，唔標會拖慢首屏。 */}
          <div className="hero-mascot hero-rise mb-4 flex justify-center">
            {/* 以外層闊度控制尺寸（手機 128px ≈ 高 104px；桌面 176px ≈ 高 142px。
                2026-09-30 由 208px 縮小，令 1024×768 首屏容得下快速開始及「揀其他科目」）。
                不能在 img 上用 h-[…]：globals.css 有一條不在 @layer 內的 `img { height: auto }`，
                優先級高於所有 Tailwind 工具類，高度類別會被靜默覆蓋（2026-09-29 production 實測）。 */}
            <div className="w-[128px] sm:w-[176px]">
              <Mascot pose="reading" height={168} priority className="w-full" />
            </div>
          </div>

          <div className="hero-rise hero-rise-1 mb-6 hidden items-center gap-2 rounded-full border border-accent/25 bg-surface-sunken px-4 py-2 text-sm font-medium text-accent sm:inline-flex">
            <span className="inline-block h-2 w-2 rounded-full bg-accent" />
            {hero.badge}
          </div>

          <h1 className="hero-rise hero-rise-1 mb-4 text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:mb-6 sm:text-5xl md:text-6xl">
            {hero.headline1}
            <br />
            <span className="bg-gradient-to-r from-accent to-accent bg-clip-text text-transparent">{hero.headline2}</span>
          </h1>

          <p className="hero-rise hero-rise-2 mx-auto mb-6 max-w-2xl text-lg text-ink-muted sm:mb-6 sm:text-xl">{hero.subhead}</p>

          {/* 快速開始（UX 循環 LOOP 2，2026-09-30）。
              以前主按鈕「開始練習」只通往科目列表，新訪客要經過科目列表、科目頁、「立即開始」
              三頁才見到第一題。現在四個核心科目直接開始一節練習；其他科目及季節性副入口
              改為同一屏的文字連結，副入口（放榜季是 /waiting、/relax）仍然在首屏。 */}
          <div className="hero-rise hero-rise-2 mx-auto mb-6 max-w-md">
            <p id="quick-start-label" className="mb-3 text-base font-medium text-ink">
              {en ? `Pick a subject to start ${SESSION_SIZE} questions` : `揀一科，即刻開始 ${SESSION_SIZE} 題`}
            </p>
            {/* 四格一行（手機亦然）：兩行兩格會把「揀其他科目」推到 375×812 首屏底部，
                被左下角無障礙按鈕及右下角情緒支援按鈕遮住。 */}
            <QuickStartGrid labelledBy="quick-start-label" en={en} />
            <p className="mt-2 text-sm text-ink-muted">
              {en ? `About ${sessionMins} minutes · no sign-in needed · free` : `約 ${sessionMins} 分鐘 · 唔使登入 · 免費`}
            </p>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4">
              <Link
                href={hero.ctaStartHref}
                className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-accent-strong underline underline-offset-4"
              >
                {en ? `All ${activeSubjects.length} subjects` : `揀其他科目（共 ${activeSubjects.length} 科）`}
                <ArrowRight size={14} aria-hidden />
              </Link>
              <Link
                href={hero.ctaSecHref}
                className="inline-flex min-h-11 items-center gap-1 text-sm text-ink-soft underline underline-offset-4"
              >
                <Brain size={14} aria-hidden className="text-accent" /> {hero.ctaSecLabel}
              </Link>
            </div>
          </div>

          <p className="hero-rise hero-rise-3 mx-auto mb-3 max-w-2xl text-sm leading-relaxed text-ink-muted">
            {locale === 'en'
              ? 'Built by DSE alumni with AI — free, to help every student crack the core logic behind common DSE traps, one question at a time.'
              : '由 DSE 舊生 + AI 協作，免費同你逐題拆解 DSE 常見陷阱背後嘅核心邏輯。'}
          </p>

          {/* 信任標記：手機自動換行，不用「·」分隔 —— 分隔點在窄屏會單獨落到下一行。 */}
          <ul className="hero-rise hero-rise-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-ink-muted">
            <li>{h.trust1}</li>
            <li>{h.trust2}</li>
            <li>{h.trust3}</li>
          </ul>
          {/* 覆核狀態（創辦人決定 6）：一句講實情，連去透明度頁的細節。
              2026-10-02 創辦人決定刪去「未經逐題人手覆核」半句，保留「經自動檢查」（憲章 §12.1 約束 1）。
              2026-10-04（審計 #9，創辦人回覆 10a）：加「未經註冊教師審定」及已收起題數。收起數由
              summary.generated 計，0 條時不顯示。同日收起 36 條設定有誤的化學題（回覆 15a），
              原因不再只是解析，字眼改為「發現有錯」。 */}
          <p className="hero-rise hero-rise-3 mt-2 text-xs text-ink-muted">
            {locale === 'en'
              ? `Questions go live after automated checks and have not been reviewed by registered teachers${CONTENT_STATS.withdrawn > 0 ? `; another ${CONTENT_STATS.withdrawn.toLocaleString()} have been withdrawn because errors were found` : ''}. `
              : `題目經自動檢查上線，未經註冊教師審定${CONTENT_STATS.withdrawn > 0 ? `；另有 ${CONTENT_STATS.withdrawn.toLocaleString()} 條發現有錯暫時收起` : ''}。`}
            <Link href="/transparency" className="inline-flex min-h-11 items-center underline underline-offset-2 hover:text-accent-strong">
              {locale === 'en' ? 'How it works' : '點樣做'}
            </Link>
          </p>
        </div>
      </section>

      {/* ── 信任列 ──
          Hero 之後第一件事就係講清楚邊界。呢條列唔賣任何嘢，佢答緊訪客第一個
          真正嘅問題：「呢個係咩嚟？可唔可以信？」

          三個數全部即時由題庫算（同 /trust、/transparency 同一個來源）——
          硬編一個「5,201」落去，加減題嗰日呢度就會靜靜哋講錯，而首頁係最多人
          睇、最少人記得更新嗰版。今年 8 月首頁三個數顯示成 0 就係咁樣嚟。 */}
      <section className="border-y border-line bg-surface-sunken px-4 py-4">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center text-xs text-ink-muted">
          <span>
            {TOTAL_QUESTIONS.toLocaleString()}
            {locale === 'en' ? ' rewritten questions' : ' 條改寫題目'}
          </span>
          <span aria-hidden className="text-ink-faint">·</span>
          <span>
            {activeSubjects.length}
            {locale === 'en' ? ' subjects' : ' 科'}
          </span>
          <span aria-hidden className="text-ink-faint">·</span>
          <span>{locale === 'en' ? 'Not affiliated with the HKEAA' : '與考評局無從屬關係'}</span>
          <span aria-hidden className="text-ink-faint">·</span>
          <Link href="/trust" className="inline-flex min-h-11 items-center font-medium text-accent-strong underline underline-offset-2">
            {locale === 'en' ? 'Check any of this' : '逐項查得到'}
          </Link>
        </div>
      </section>

      {/* 2026-09-26：新來港廣東話卡已由首頁移走（Yuna：「唔好擺咁當眼位置」）。
          入口改為三橫選單同側欄嘅「不考之地」（/off-syllabus）。 */}

      {/* ── 盲測黑題 —— 深色「終端」卡刻意做淺底對比 ── */}
      <section className="bg-surface-raised px-4 py-14">
        <div className="mx-auto max-w-md">
          <h2 className="animate-on-scroll mb-2 text-center text-2xl font-medium text-ink sm:text-3xl">
            {locale === 'en' ? 'Can you see through the trap?' : '你睇唔睇穿到陷阱？'}
          </h2>
          <p className="animate-on-scroll stagger-1 mb-7 text-center text-sm text-ink-muted">
            {locale === 'en' ? 'Numbers blacked out — only the logic remains. See through it, don’t memorise.' : '數字全部塗黑，淨返邏輯。睇穿佢，唔使死記硬背。'}
          </p>
          <div className="animate-on-scroll stagger-2">
            <BlindTestQuestion />
          </div>
        </div>
      </section>

      {/* ── 三步拆解 ── */}
      <section className="bg-surface-sunken px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="animate-on-scroll mb-3 text-center text-2xl font-medium text-ink sm:text-3xl">{h.demoTitle}</h2>
          <p className="animate-on-scroll stagger-1 mb-12 text-center text-ink-muted">{h.demoSub}</p>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="animate-on-scroll stagger-1 rounded-2xl border border-line bg-surface-raised p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-sunken text-xs font-medium text-ink-muted">1</span>
                <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">{h.step1Label}</span>
              </div>
              <div className="mb-3 font-mono text-xs text-accent">{h.demoArchetype}</div>
              <p className="text-sm leading-relaxed text-ink-soft">
                {h.demoSolve}<M>2x² + 3x − 5 = 0</M>{h.demoFind}<M>x</M>{h.demoValueEnd}
              </p>
              <div className="mt-4 border-t border-line pt-4 text-xs text-ink-muted">
                {h.demoAnswer}<M>x = 1</M>{h.demoOr}<M>x = −5/2</M>
              </div>
            </div>

            <div className="animate-on-scroll stagger-2 rounded-2xl border border-accent/25 bg-surface-raised p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-sunken border border-accent/40 text-xs font-medium text-accent">2</span>
                <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">{h.step2Label}</span>
              </div>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-lg">🔄</span>
                <span className="text-sm font-medium text-accent">{h.step2Framework}</span>
              </div>
              <p className="text-sm leading-relaxed text-ink-muted">{h.step2Desc}</p>
            </div>

            <div className="animate-on-scroll stagger-3 rounded-2xl border border-gold-soft/30 bg-surface-raised p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-sunken border border-gold/40 text-xs font-medium text-gold">3</span>
                <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">{h.step3Label}</span>
              </div>
              <div className="mb-3 flex items-center gap-2">
                <Zap size={14} className="text-gold" />
                <span className="text-sm font-medium text-gold">{h.step3Tag}</span>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-ink-soft">
                {h.demoSolve}<M>3x² + 5x − 2 = 0</M>{h.demoFind}<M>x</M>{h.demoValueEnd}
              </p>
              <Link
                href="/subjects/math"
                className="flex min-h-11 items-center justify-center rounded-lg border border-accent/30 bg-surface-sunken text-center text-sm text-accent transition-all duration-200 hover:bg-surface-sunken"
              >
                {h.step3Cta}
              </Link>
            </div>
          </div>

          <p className="animate-on-scroll mt-6 text-center text-sm text-ink-muted">{h.demoNote}</p>
        </div>
      </section>

      {/* ── 規格牆（大數字 count-up）── */}
      <section className="bg-surface-raised px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="grid grid-cols-3 gap-4 text-center sm:gap-8">
            {stats.map((s, i) => {
              return (
                <div key={i} className={`animate-on-scroll stagger-${i + 1}`}>
                  <div className="mb-1 text-2xl font-medium text-accent tabular-nums sm:text-5xl">
                    {s.prefix && <span className="text-lg sm:text-2xl">{s.prefix}</span>}
                    {/* SSR 初始值必須係【真數】而唔係 0：requestAnimationFrame 喺隱藏分頁
                        完全唔 fire，動畫唔行嗰陣呢個值就係學生（同搜尋引擎、社交預覽）
                        見到嘅嘢。以前寫死 0，即係首頁隨時顯示「0 年 0 題 0 個」。 */}
                    <span data-count={s.num}>{s.num.toLocaleString('en-US')}</span>
                    <span className="text-lg sm:text-2xl">{s.unit}</span>
                  </div>
                  <div className="text-sm text-ink-muted">{s.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 使命：完全免費 ── */}
      <section className="bg-surface-sunken px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="animate-on-scroll mb-3 text-2xl font-medium text-ink sm:text-3xl">
            {locale === 'en' ? 'Why it’s completely free' : '點解完全免費'}
          </h2>
          <p className="animate-on-scroll stagger-1 mx-auto mb-10 max-w-2xl leading-relaxed text-ink-muted">
            {locale === 'en'
              ? 'Real exam skill should never sit behind a wall — so we built it and opened it free, unconditionally, to every student.'
              : '攞分嘅真功夫，唔應該被任何一道牆擋住 —— 所以我哋重新砌返，無條件免費開放俾每一個學生。'}
          </p>
          <div className="grid gap-4 text-left sm:grid-cols-3">
            {[
              { icon: '🧠', title: locale === 'en' ? 'Efficient' : '高效', body: locale === 'en' ? 'Crack the logic behind common DSE question types — not memorise answers that never come back.' : '拆穿 DSE 常見題型嘅底層邏輯 —— 唔係死背啲唔會再出嘅答案。' },
              { icon: '⚖️', title: locale === 'en' ? 'Fair' : '公平', body: locale === 'en' ? 'Completely free. Every student — not only the ones who can afford star tutors — gets the same edge.' : '完全免費。唔止俾得起補習天王嘅人 —— 係每一個學生，都攞到同一個籌碼。' },
              { icon: '🤝', title: locale === 'en' ? 'For your family' : '利他', body: locale === 'en' ? 'Whatever you’d have spent on tutoring stays home with your family. That is the whole point.' : '本來要使喺補習嘅，留返喺屋企。呢個先係我哋嘅初心。' },
            ].map((c, i) => (
              <div key={i} className={`animate-on-scroll stagger-${i + 1} rounded-2xl border border-line bg-surface-raised p-5`}>
                <div className="mb-2 text-2xl">{c.icon}</div>
                <div className="mb-1 font-medium text-ink">{c.title}</div>
                <p className="text-sm leading-relaxed text-ink-muted">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 科目 ── */}
      <section className="bg-surface-raised px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="animate-on-scroll mb-3 text-center text-2xl font-medium text-ink sm:text-3xl">{h.subjectsTitle}</h2>
          <p className="animate-on-scroll stagger-1 mb-12 text-center text-ink-muted">{activeSubjects.length}{h.subjectsSubA}</p>

          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {activeSubjects.map((s, i) => (
              <Link
                key={s.id}
                href={`/subjects/${s.id}`}
                className={`animate-on-scroll stagger-${(i % 4) + 1} group rounded-xl border border-line bg-surface-raised p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_8px_30px_rgba(0,168,160,0.08)]`}
              >
                <div className="mb-2 text-3xl">{s.emoji}</div>
                <div className="mb-1 text-sm font-medium text-ink-soft">{locale === 'en' ? s.shortEn : s.short}</div>
                <div className="flex items-center justify-center gap-1 text-[11px] text-accent">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" /> {t.common.live}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/subjects" className="inline-flex min-h-11 items-center gap-2 text-sm text-accent transition-colors hover:text-accent">
              {h.roadmapA}{totalSubjects}{h.roadmapB} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-surface px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="animate-on-scroll mb-4 text-3xl font-medium text-ink sm:text-4xl">{h.ctaTitle}</h2>
          <p id="quick-start-label-bottom" className="animate-on-scroll stagger-1 mb-8 text-ink-muted">{h.ctaSub}</p>
          {/* audit loop T09（2026-10-02）：原本係一個去 /subjects 嘅大掣，要再揀一次科目。
              改為同頁頂一樣嘅四科快捷掣，一撳就開始；其他科目用下面文字連結。 */}
          <div className="animate-on-scroll stagger-2 mx-auto max-w-md">
            <QuickStartGrid labelledBy="quick-start-label-bottom" en={en} />
            <Link
              href="/subjects"
              className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-accent-strong underline underline-offset-4"
            >
              {en ? `All ${activeSubjects.length} subjects` : `揀其他科目（共 ${activeSubjects.length} 科）`}
              <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
          <p className="animate-on-scroll stagger-3 mt-4 text-sm text-ink-muted">{h.ctaNote}</p>
        </div>
      </section>
    </div>
  )
}
