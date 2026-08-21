'use client'

import { ShieldCheck, Database, AlertTriangle } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { REVIEW_BATCHES, REVIEWED_COUNT } from '@/data/provenance'
import { getActiveSubjects } from '@/data/subjects'
import { getSubjectQuestions } from '@/data/questions'

// Transparency page — deliberately HONEST. It does NOT claim "not AI-generated" or
// "reviewed by frontline tutors"; the content is alumni + AI co-authored and
// hand-checked, and we say exactly that. No fabricated provenance.
export default function TransparencyClient() {
  const { locale } = useLocale()
  const en = locale === 'en'

  // 實數，唔硬編：題庫加減題之後呢兩個數會自動跟住走。
  // 硬編一個「1.83%」喺度，遲早會變成一個講錯咗嘅數字 —— 而呢一段嘅
  // 全部價值就係佢準。
  const totalQuestions = getActiveSubjects().reduce((n, sub) => n + getSubjectQuestions(sub.id).length, 0)
  const pct = totalQuestions > 0 ? ((REVIEWED_COUNT / totalQuestions) * 100).toFixed(2) : '0'

  const sections = [
    {
      icon: ShieldCheck,
      title: en ? 'How we keep the questions sound' : '我哋點樣確保題目質素',
      points: en
        ? [
            'Every question is co-authored by DSE alumni with AI, then checked by hand.',
            'All items are original rewrites that follow the style and reasoning of 2012–2025 past papers — they are NOT official HKEAA questions, and no official content is copied.',
            'Numeric / calculation questions are verified by parametric brute-force checking.',
            'Spotted a mistake? Tell us and we’ll fix it as soon as we can.',
          ]
        : [
            '每一條題目都由 DSE 舊生 + AI 協作編寫，再逐題人手核對。',
            '全部都係原創改寫，參照 2012–2025 歷屆試題嘅出題邏輯同風格 —— 並非 HKEAA 官方試題，亦無複製任何官方內容。',
            '數值／計算題以參數化方式 brute-force 驗算。',
            '發現錯誤？話我哋知，我哋會盡快修正。',
          ],
    },
    {
      icon: Database,
      title: en ? 'How we handle your data' : '我哋點樣處理你嘅數據',
      points: en
        ? [
            'Your practice records stay in your own browser (localStorage) by default — our server can’t read them.',
            'If you sign in with Google, it’s ONLY to sync progress across devices. It unlocks nothing — the platform is 100% free for everyone.',
            'We never sell user data to anyone.',
          ]
        : [
            '你嘅練習記錄預設只存喺你部裝置嘅瀏覽器（localStorage），我哋伺服器讀唔到。',
            '如果你用 Google 登入，純粹係為咗跨裝置同步進度。佢唔解鎖任何嘢 —— 平台對所有人 100% 免費。',
            '我哋永遠唔會將用戶數據賣俾任何人。',
          ],
    },
    {
      icon: AlertTriangle,
      title: en ? 'Known limits (we won’t overstate)' : '已知限制（唔會誇大）',
      points: en
        ? [
            'These are rewritten practice questions, not official papers. For real past papers, go to the HKEAA website.',
            'Grade prediction is based on your answers and is indicative only — the HKEAA result is the only one that counts.',
            'Written questions (short answers, long/structured responses) are never machine-marked. You compare your work against a reference answer and mark yourself. Nothing you self-mark counts towards the accuracy figure or the predicted grade — those come from multiple-choice answers only.',
            'AI-assisted writing can occasionally slip; if something looks off, please report it.',
          ]
        : [
            '呢啲係改寫練習題，唔係官方試題。要官方歷屆試題，請去 HKEAA 網站。',
            '等級預測根據你嘅作答表現計算，僅供參考 —— 最終成績以 HKEAA 公布為準。',
            '書寫題（短答、長題／結構式）永遠唔會由機器批改。你對住參考答案自己評，而自評結果【唔會計入】準確率同等級預測 —— 嗰兩個數字只由選擇題得出。',
            'AI 協作或會偶有手民之誤；見到有問題，麻煩話我哋知。',
          ],
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
        {en ? 'Transparency' : '透明度報告'}
      </h1>
      {/* light-first 遷移漏網：實測 text-ink-muted 落 #FAFAF8 得 2.52:1。
          呢段係全頁引言，改用 --color-ink-soft（12.59）而非 ink-muted —— 佢係正文，
          唔係註腳。頁內嗰幾張 bg-surface-raised 深色卡本身對比正常（12–16），另行處理。 */}
      <p className="text-ink-soft mb-10 leading-relaxed">
        {en
          ? 'We’d rather be honest about how this is built than oversell it. Here’s exactly how the questions are made, how your data is handled, and where the limits are.'
          : '我哋寧願老老實實講清楚係點整出嚟，都唔想誇大。以下係題目點樣製作、你嘅數據點樣處理、同埋邊度有限制。'}
      </p>

      <div className="space-y-8">
        {sections.map((s) => {
          const Icon = s.icon
          return (
            <section
              key={s.title}
              className="bg-surface-raised border border-line rounded-2xl p-6"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <Icon size={20} className="text-gold shrink-0" />
                <h2 className="text-lg font-bold text-ink">{s.title}</h2>
              </div>
              <ul className="space-y-2.5">
                {s.points.map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-ink-soft leading-relaxed">
                    <span className="text-gold/70 mt-0.5 shrink-0">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

      {/* 題目來源 —— 練習頁每條題底部嗰個披露 link 落嚟呢度解釋。
          最緊要嗰個數字唔好聽，但講出嚟先係建立信任嘅方法：一個聲稱「全部經
          專家審核」而攞唔出名單嘅平台，可信度低過一個講「幾多條有實名紀錄、
          名單喺呢度」嘅平台。 */}
      <section id="provenance" className="mt-12 scroll-mt-20">
        <h2 className="text-2xl font-extrabold mb-3">
          {en ? 'Where the questions come from' : '啲題目點嚟'}
        </h2>
        <p className="text-ink-soft leading-relaxed mb-4">
          {en
            ? `Every question passes automated gates: terminology and written-register checks, structural and difficulty-mix validation, and a format gate that refuses anything with missing materials. On top of that, ${REVIEWED_COUNT} questions carry a named, dated, question-by-question review record — ${pct}% of the ${totalQuestions.toLocaleString()} questions currently live. We would rather give you the real figure than claim more.`
            : `每一條題目都要通過自動閘：術語同書面語檢查、結構同難度比例驗證、以及一個材料唔齊就唔畀過嘅格式閘。喺呢個之上，有 ${REVIEWED_COUNT} 條題目附有實名、有日期、逐題嘅審批紀錄 —— 佔現時 ${totalQuestions.toLocaleString()} 條上線題目嘅 ${pct}%。呢個數唔好聽，但我哋寧願畀返實數，都唔想講大咗。`}
        </p>
        <p className="text-ink-soft leading-relaxed mb-5">
          {en
            ? 'A question with no named review record is not an unchecked question — it means no human signed off on it line by line, and we will not pretend otherwise. Machines never sign on a person\u2019s behalf here.'
            : '冇實名審批紀錄，唔等於冇檢查過 —— 只係冇真人逐題簽過名，我哋唔會扮有。喺呢度，機器永遠唔會代人簽名。'}
        </p>

        <div className="bg-surface-raised border border-line rounded-2xl p-5 overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="sr-only">{en ? 'Named review batches' : '實名審批批次'}</caption>
            <thead>
              <tr className="text-left text-xs text-ink-muted border-b border-line">
                <th scope="col" className="pb-2 pr-4 font-medium">{en ? 'Batch' : '批次'}</th>
                <th scope="col" className="pb-2 pr-4 font-medium">{en ? 'Subject' : '科目'}</th>
                <th scope="col" className="pb-2 pr-4 font-medium">{en ? 'Reviewer' : '審批人'}</th>
                <th scope="col" className="pb-2 pr-4 font-medium">{en ? 'Date' : '日期'}</th>
                <th scope="col" className="pb-2 font-medium text-right">{en ? 'Approved' : '批准'}</th>
              </tr>
            </thead>
            <tbody>
              {REVIEW_BATCHES.map((b) => (
                <tr key={b.batch} className="border-b border-line last:border-0">
                  <td className="py-2 pr-4 font-mono text-[11px] text-ink-muted break-all">{b.batch}</td>
                  <td className="py-2 pr-4 text-ink-soft">{b.subject}</td>
                  <td className="py-2 pr-4 text-ink-soft">{b.reviewer}</td>
                  <td className="py-2 pr-4 text-ink-muted whitespace-nowrap">{b.reviewedAt}</td>
                  <td className="py-2 text-ink-soft text-right tabular-nums">{b.approved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-ink-muted leading-relaxed mt-3">
          {en
            ? 'This table is generated from the review files in the source repository, so anyone can check it against the record rather than take our word for it.'
            : '呢張表由原始碼庫入面嘅審批檔案生成，任何人都可以自己對返紀錄，唔使淨係信我哋一句。'}
        </p>
      </section>
    </div>
  )
}
