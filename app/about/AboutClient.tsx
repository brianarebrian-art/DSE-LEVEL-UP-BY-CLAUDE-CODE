'use client'

import Link from 'next/link'
import { ArrowRight, Mail, ShieldCheck } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import FAQSection from '@/components/FAQSection'
import GuardianCredits from '@/components/GuardianCredits'
import ExternalLinkGate from '@/components/ExternalLinkGate'
import { OFFICIAL_SOCIAL } from '@/lib/site'

// Four classical-Confucian cores the platform is built on. Quotes are from the
// Analects (公有領域 — over two millennia old). Kept plain and human, no fanfare.
// Light-first migration (2026-07-21, task #97): 清晨圖書館 — 白卡、金 #B8860B 強調、
// 青 #008B84 承諾勾、實心青 CTA #00726C。weight 400/500，無 font-extrabold。
const CORES: { icon: string; zhTitle: string; enTitle: string; quote: string; zh: string; en: string }[] = [
  {
    icon: '🎯',
    zhTitle: '因材施教',
    enTitle: 'Teach to the learner',
    quote: '夫子教人，各因其材',
    // 2026-10-04（審計 #8，創辦人回覆 3a、草稿「3ok」）：原句「每一種思維陷阱……逆向清錯策略」超出現況
    // （練習頁錯因自診已於 2026-10-02 刪除），改為照實描述。
    // 2026-10-04（審計 #10，創辦人回覆 21a、草稿「21 ok」）：中文改為廣東話，與其餘頁面語氣一致；
    // 刪去「麥當勞式」「貴族壟斷」「最極致的訓練」「100% 純粹降噪、零雜訊」。英文不變。
    zh: '我哋唔想用一套公式教晒所有人。系統會記住你喺邊啲課題答錯，建議你下一步練邊個課題，仲會按時提你重溫答錯嘅題。你補嘅係你自己嘅漏洞，唔係人哋嘅範本。',
    en: 'We refuse one-size-fits-all, assembly-line teaching. The system remembers which topics you get wrong, suggests which topic to practise next, and reminds you to revisit the questions you missed — you patch your own gaps, not someone else’s template.',
  },
  {
    icon: '🌏',
    zhTitle: '有教無類',
    enTitle: 'Education for everyone',
    quote: '有教無類',
    zh: '好嘅練習唔應該只係名校學生先有。唔理你屋企有冇錢、讀邊間學校，只要你想學，就可以免費用晒全部功能。冇門檻、冇白名單、冇分級版本，全站功能永遠對所有人免費開放。',
    en: 'We break the monopoly elite schools hold over resources. Regardless of wealth or background, anyone willing to learn gets the most demanding training, free. No barriers, no whitelist, no tiered editions — every feature is unconditionally and permanently free for all.',
  },
  {
    icon: '💡',
    zhTitle: '啟發式教學',
    enTitle: 'Learning through struggle',
    quote: '不憤不啟，不悱不發',
    // 2026-10-02：練習頁的錯因自診已刪除（憲章 §7.2，創辦人決定），答錯後詳解即時打開，
    // 先顯示第一步（StagedExplanation），學生再撳開全部。此段按此改寫。
    zh: '我哋唔會一嘢將答案攤晒出嚟。答錯之後，解析會先畀你第一步；你諗多一步，再撳開全部。咁樣由「靠記」變成「靠諗」，學識舉一反三。',
    en: 'We do not lay the whole answer out at once. After a wrong answer the explanation opens with its first step; think one step further, then open the rest. That pushes you from memorising toward thinking, and toward reasoning by analogy.',
  },
  {
    icon: '🕊️',
    zhTitle: '仁',
    enTitle: 'Benevolence at the core',
    quote: '己所不欲，勿施於人',
    zh: '己所不欲，勿施於人。我哋自己都好憎俾廣告同催你課金嘅彈窗煩住，所以全站冇廣告，淨係留一個夜晚都可以靜靜哋專心溫書嘅地方。',
    en: '“Do not impose on others what you would not want for yourself.” We hate being hounded by ads, pop-ups and spending psychology too — so the whole platform is 100% noise-free, zero ads, zero clutter, leaving you a quiet space to focus, even late at night.',
  },
]

export default function AboutClient() {
  const { locale } = useLocale()
  const en = locale === 'en'

  return (
    <div className="min-h-screen px-4 py-12 bg-surface text-ink-soft">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-medium text-ink mb-4">
            {en ? 'About ' : '關於 '}<span className="text-gold">DSE Level Up</span>
          </h1>
          <p className="text-ink-muted text-lg leading-relaxed">
            {en
              ? 'A 100% free DSE practice platform for every Hong Kong student — built on a simple, old idea: that real teaching adapts to the learner, and that no one should ever be shut out of it.'
              : '一個全免費、畀全港 DSE 考生用嘅練習平台。我哋相信一件好舊但好簡單嘅事：教書要睇人教，亦唔應該有人被拒諸門外。'}
          </p>
          <p className="text-ink-muted text-sm mt-4 leading-relaxed">
            {en
              ? 'We turn four ideas from Confucius into the platform’s engineering: 因材施教 (teach to the learner), 有教無類 (education for all), 啟發式教學 (learning through struggle), and 仁 (benevolence).'
              : '我哋將孔子四個教育理念放咗入平台設計入面：因材施教、有教無類、啟發式教學，同埋仁。'}
          </p>
        </div>

        {/* Four cores */}
        <div className="space-y-5">
          {CORES.map((c, i) => (
            <div key={i} className="bg-surface-raised border border-line rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <h2 className="font-medium text-lg leading-tight text-ink">
                    {en ? c.enTitle : c.zhTitle}
                  </h2>
                  <p className="text-gold text-xs mt-0.5 tracking-wide">「{c.quote}」</p>
                </div>
              </div>
              <p className="text-ink-soft text-sm leading-relaxed mt-3">
                {en ? c.en : c.zh}
              </p>
            </div>
          ))}
        </div>

        {/* Promise — quality control */}
        <div className="bg-surface-raised border border-line rounded-2xl p-6 mt-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={20} className="text-accent" />
            <h2 className="font-medium text-lg text-ink">{en ? 'Our promise' : '我們的承諾'}</h2>
          </div>
          <div className="space-y-2.5 text-sm text-ink-soft">
            {[
              en
                ? 'Answers and explanations must pass automated checks before they go live; the questions have not been reviewed by registered teachers. We fix reported errors as soon as we can, and withdrawn questions are listed on the transparency page.'
                : '答案同解析上線前都要通過自動檢查；題目未經註冊教師審定。收到錯誤報告會盡快修正，收起咗嘅題目會喺透明度頁公開。',
              en
                ? 'Original rewrites only — no reproduction of HKEAA past-paper content.'
                : '全部題目獨立改寫，絕對唔會抄考評局試題。',
              en
                ? 'No ads, no selling your data, no fabricated statistics or score guarantees.'
                : '冇廣告、唔賣你嘅資料、唔會作假成績統計或者保證分數。',
              en
                ? 'Free forever, for everyone — there is nothing to buy here.'
                : '永遠免費，對所有人：呢度冇任何嘢要你買。',
            ].map((line, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-accent mt-0.5 shrink-0">✓</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ（精選 8 條；完整 20 條見 content/community/faq.md） */}
        <FAQSection />

        {/* Contact */}
        <div className="bg-surface-raised border border-line rounded-2xl p-6 mt-5">
          <h2 className="font-medium text-lg mb-3 text-ink">{en ? 'Get in touch' : '聯絡我們'}</h2>
          <p className="text-ink-muted mb-4 text-sm leading-relaxed">
            {en
              ? 'Spotted a mistake in a question, or want a subject prioritised? Tell us — accuracy depends on it.'
              : '發現題目有錯，或者想我哋優先處理某一科？歡迎話我哋知，準確度要靠大家一齊把關。'}
          </p>
          <a
            href="mailto:dselevelup@gmail.com"
            className="inline-flex items-center gap-2 bg-surface-sunken hover:bg-surface-sunken border border-line-strong px-4 py-2.5 rounded-xl text-sm text-ink-soft transition-all"
          >
            <Mail size={16} className="text-gold" /> dselevelup@gmail.com
          </a>
          <p className="text-ink-muted mt-4 mb-2 text-sm">
            {en ? 'Official accounts (study tips and updates):' : '官方帳戶（溫書貼士及更新）：'}
          </p>
          <div className="flex flex-wrap gap-2">
            {OFFICIAL_SOCIAL.map((s) => (
              <ExternalLinkGate
                key={s.platform}
                href={s.href}
                platform={s.platform}
                className="inline-flex min-h-11 items-center bg-surface-sunken border border-line-strong px-4 py-2.5 rounded-xl text-sm text-ink-soft transition-all"
              >
                {s.platform} {s.handle}
              </ExternalLinkGate>
            ))}
          </div>
        </div>

        {/* 守護者致謝名單（創辦人決定 7，2026-09-30）：由頁尾移來。放在「聯絡我們」之後，
            因為名單本身邀請大家匯報問題。 */}
        <section id="guardians" aria-labelledby="guardians-title" className="mt-5">
          <GuardianCredits />
        </section>

        {/* Legal */}
        <div className="bg-surface-sunken border border-line rounded-2xl p-5 text-xs text-ink-muted leading-relaxed mt-5">
          <strong className="text-ink-muted font-medium">{en ? 'Disclaimer: ' : '免責聲明：'}</strong>
          {en
            ? 'All questions are independently rewritten practice items, not official HKEAA papers. Practice performance estimates are indicative only; final results are determined by the HKEAA.'
            : '本平台所有試題均為獨立改寫版本，並非香港考試及評核局（HKEAA）官方試題。練習表現估算僅供參考，最終成績以 HKEAA 公布為準。'}
        </div>

        {/* CTA */}
        <div className="mt-10">
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 bg-accent-strong hover:bg-accent-hover text-on-accent font-medium px-6 py-3 rounded-xl transition-all"
          >
            {en ? 'Start practising' : '開始練習'} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
