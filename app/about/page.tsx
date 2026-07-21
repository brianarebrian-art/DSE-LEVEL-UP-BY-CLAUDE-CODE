'use client'

import Link from 'next/link'
import { ArrowRight, Mail, ShieldCheck } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import FAQSection from '@/components/FAQSection'

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
    zh: '我們拒絕麥當勞式、倒模般的公式教育。系統會記住你每一條答錯的題、每一種思維陷阱，按你真實的盲點砌出專屬的逆向清錯策略——你補的是你自己的洞，而不是別人的範本。',
    en: 'We refuse one-size-fits-all, assembly-line teaching. The system remembers every question you miss and every trap you fall for, then builds a reverse error-clearing path around your real weaknesses — you patch your own gaps, not someone else’s template.',
  },
  {
    icon: '🌏',
    zhTitle: '有教無類',
    enTitle: 'Education for everyone',
    quote: '有教無類',
    zh: '打破名校與貴族對資源的壟斷。不分貧富貴賤、不問出身學校，只要有心向學，任何人都可以免費用到最極致的訓練。沒有門檻、沒有白名單、沒有分級版本——全站功能，永久無條件對所有人免費開放。',
    en: 'We break the monopoly elite schools hold over resources. Regardless of wealth or background, anyone willing to learn gets the most demanding training, free. No barriers, no whitelist, no tiered editions — every feature is unconditionally and permanently free for all.',
  },
  {
    icon: '💡',
    zhTitle: '啟發式教學',
    enTitle: 'Learning through struggle',
    quote: '不憤不啟，不悱不發',
    zh: '不到你真正想通又想不通的臨界點，我們絕不直接施放答案。答錯一條硬題，介面會鎖死、強制你先誠實面對錯因、答對一條反思追問——逼你由「靠記」走向「靠想」，學會舉一反三。',
    en: 'We will not hand you the answer until you have genuinely wrestled to the edge of understanding. Miss a hard question and the screen locks: you must first own the cause of your error and answer a reflection check — pushing you from memorising toward thinking, and toward reasoning by analogy.',
  },
  {
    icon: '🕊️',
    zhTitle: '仁',
    enTitle: 'Benevolence at the core',
    quote: '己所不欲，勿施於人',
    zh: '己所不欲，勿施於人。我們自己也討厭被廣告、彈窗、課金心理戰騷擾，所以全站 100% 純粹降噪、零廣告、零雜訊——只為你留一個可以深夜安靜專注的空間。',
    en: '“Do not impose on others what you would not want for yourself.” We hate being hounded by ads, pop-ups and spending psychology too — so the whole platform is 100% noise-free, zero ads, zero clutter, leaving you a quiet space to focus, even late at night.',
  },
]

export default function AboutPage() {
  const { locale } = useLocale()
  const en = locale === 'en'

  return (
    <div className="min-h-screen px-4 py-12 bg-[#FAFAF8] text-[#2D2D2D]">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-medium text-[#1A1A1A] mb-4">
            {en ? 'About ' : '關於 '}<span className="text-[#B8860B]">DSE Level Up</span>
          </h1>
          <p className="text-[#6B6B6B] text-lg leading-relaxed">
            {en
              ? 'A 100% free DSE practice platform for every Hong Kong student — built on a simple, old idea: that real teaching adapts to the learner, and that no one should ever be shut out of it.'
              : '一個 100% 全免費、面向全港考生的 DSE 練習平台。它建基於一個古老而簡單的信念：真正的教育因人而異，而沒有人應該被拒諸門外。'}
          </p>
          <p className="text-[#6B6B6B] text-sm mt-4 leading-relaxed">
            {en
              ? 'We turn four ideas from Confucius into the platform’s engineering: 因材施教 (teach to the learner), 有教無類 (education for all), 啟發式教學 (learning through struggle), and 仁 (benevolence).'
              : '我們把孔子的四個教育理念，寫進平台的底層：因材施教、有教無類、啟發式教學，與仁。'}
          </p>
        </div>

        {/* Four cores */}
        <div className="space-y-5">
          {CORES.map((c, i) => (
            <div key={i} className="bg-white border border-black/[0.06] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <h2 className="font-medium text-lg leading-tight text-[#1A1A1A]">
                    {en ? c.enTitle : c.zhTitle}
                  </h2>
                  <p className="text-[#B8860B] text-xs mt-0.5 tracking-wide">「{c.quote}」</p>
                </div>
              </div>
              <p className="text-[#2D2D2D] text-sm leading-relaxed mt-3">
                {en ? c.en : c.zh}
              </p>
            </div>
          ))}
        </div>

        {/* Promise — quality control */}
        <div className="bg-white border border-black/[0.06] rounded-2xl p-6 mt-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={20} className="text-[#008B84]" />
            <h2 className="font-medium text-lg text-[#1A1A1A]">{en ? 'Our promise' : '我們的承諾'}</h2>
          </div>
          <div className="space-y-2.5 text-sm text-[#2D2D2D]">
            {[
              en
                ? 'Academic precision is the red line: every answer and explanation is hand-verified.'
                : '學術精準度是生死線：每題答案與釋義均經人手核對。',
              en
                ? 'Original rewrites only — no reproduction of HKEAA past-paper content.'
                : '一律獨立改寫——絕不複製香港考評局試題內容。',
              en
                ? 'No ads, no selling your data, no fabricated statistics or score guarantees.'
                : '無廣告、不販賣你的數據、不杜撰成績統計或分數保證。',
              en
                ? 'Free forever, for everyone — there is nothing to buy here.'
                : '永遠免費，對所有人——這裏沒有任何嘢要你買。',
            ].map((line, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[#008B84] mt-0.5 shrink-0">✓</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ（精選 8 條；完整 20 條見 content/community/faq.md） */}
        <FAQSection />

        {/* Contact */}
        <div className="bg-white border border-black/[0.06] rounded-2xl p-6 mt-5">
          <h2 className="font-medium text-lg mb-3 text-[#1A1A1A]">{en ? 'Get in touch' : '聯絡我們'}</h2>
          <p className="text-[#6B6B6B] mb-4 text-sm leading-relaxed">
            {en
              ? 'Spotted a mistake in a question, or want a subject prioritised? Tell us — accuracy depends on it.'
              : '發現題目有錯，或想我們優先處理某一科？歡迎告訴我們——準確度全靠大家把關。'}
          </p>
          <a
            href="mailto:dselevelup@gmail.com"
            className="inline-flex items-center gap-2 bg-[#F5F5F0] hover:bg-[#EDEDE8] border border-black/[0.10] px-4 py-2.5 rounded-xl text-sm text-[#2D2D2D] transition-all"
          >
            <Mail size={16} className="text-[#B8860B]" /> dselevelup@gmail.com
          </a>
        </div>

        {/* Legal */}
        <div className="bg-[#F5F5F0] border border-black/[0.06] rounded-2xl p-5 text-xs text-[#9CA3AF] leading-relaxed mt-5">
          <strong className="text-[#6B6B6B] font-medium">{en ? 'Disclaimer: ' : '免責聲明：'}</strong>
          {en
            ? 'All questions are independently rewritten practice items, not official HKEAA papers. Grade predictions are indicative only; final results are determined by the HKEAA.'
            : '本平台所有試題均為獨立改寫版本，並非香港考試及評核局（HKEAA）官方試題。等級預測僅供參考，最終成績以 HKEAA 公布為準。'}
        </div>

        {/* CTA */}
        <div className="mt-10">
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 bg-[#00726C] hover:bg-[#005F5A] text-white font-medium px-6 py-3 rounded-xl transition-all"
          >
            {en ? 'Start practising' : '開始練習'} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
