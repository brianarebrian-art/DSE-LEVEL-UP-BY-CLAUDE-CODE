'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'

const CONTACT = 'dselevelup@gmail.com'

export default function TermsClient() {
  const { locale } = useLocale()
  const en = locale === 'en'

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-medium text-ink">{en ? 'Terms of use' : '使用條款'}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {en
            ? 'This page states the limits of the site. It is not a contract reviewed by a lawyer, and it does not claim that any wording has been legally cleared.'
            : '呢版只講本站嘅限制。佢唔係經律師審定嘅合約，亦唔聲稱任何字句已經通過法律審核。'}
        </p>
      </header>

      <section className="mb-8 space-y-3 text-sm leading-relaxed text-ink-soft">
        <h2 className="text-lg font-medium text-ink">{en ? 'Not the exam board' : '唔係考評局'}</h2>
        <p>
          {en
            ? 'DSE Level Up is not the Hong Kong Examinations and Assessment Authority (HKEAA), not a school, and not affiliated with the HKEAA. Questions here are original practice items. They are not official HKEAA papers. Official past papers are on the HKEAA website.'
            : 'DSE Level Up 唔係香港考試及評核局（考評局），唔係學校，亦同考評局冇從屬關係。呢度嘅題目係原創練習，並非考評局官方試題。官方歷屆試題請到考評局網站下載。'}
        </p>
      </section>

      <section className="mb-8 space-y-3 text-sm leading-relaxed text-ink-soft">
        <h2 className="text-lg font-medium text-ink">{en ? 'No grade promise' : '唔會保證成績'}</h2>
        <p>
          {en
            ? 'Using this site does not promise a DSE grade or level. Practice figures, when shown, are about your practice on this site. They are not a prediction of the grade the HKEAA will publish. Some subjects do not show a level range at all.'
            : '用本站唔等於承諾任何 DSE 成績或者等級。有顯示嘅練習數字，只係講你喺本站嘅練習，唔係預測考評局會公布嘅成績。有啲科目根本唔會顯示等級範圍。'}
        </p>
        <p>
          {en
            ? 'Where the 2027 paper has no multiple-choice questions, the multiple-choice set is a concept warm-up. It is not the exam format, and it is not counted in the practice-performance estimate.'
            : '2027 年考卷冇選擇題嘅科目，選擇題只係概念溫習，唔係考試題型，亦唔會計入練習表現估算。'}
        </p>
      </section>

      <section className="mb-8 space-y-3 text-sm leading-relaxed text-ink-soft">
        <h2 className="text-lg font-medium text-ink">{en ? 'How questions go live' : '題目點上線'}</h2>
        <p>
          {en
            ? 'Questions go live after automated checks. They have not been reviewed by registered teachers. We do not describe a question as signed off unless a record says so. Counts of what is in practice, withdrawn, or held back are on the transparency page, from one source.'
            : '題目經自動檢查上線，未經註冊教師審定。冇紀錄嘅題，我哋唔會寫成已經簽核。練習中、已收起、暫停放入練習嘅題數，以透明度頁同一個來源為準。'}
        </p>
        <p>
          <Link href="/transparency" className="font-medium text-accent-strong underline underline-offset-2">
            {en ? 'Transparency' : '透明度'}
          </Link>
        </p>
      </section>

      <section className="mb-8 space-y-3 text-sm leading-relaxed text-ink-soft">
        <h2 className="text-lg font-medium text-ink">{en ? 'Students and accounts' : '學生同帳戶'}</h2>
        <p>
          {en
            ? 'You can practise without an account. What is stored on the device, what is synced if you sign in, and how to delete it, is set out in the privacy policy. That page is the one to read for personal data. Most people using this site are under 18.'
            : '唔登入都可以做題。邊啲資料留喺部機、登入之後邊啲會同步、點樣刪除，寫喺私隱政策。個人資料以嗰版為準。用本站嘅人大部分未夠 18 歲。'}
        </p>
        <p>
          <Link href="/privacy" className="font-medium text-accent-strong underline underline-offset-2">
            {en ? 'Privacy policy' : '私隱政策'}
          </Link>
        </p>
      </section>

      <section className="mb-8 space-y-3 text-sm leading-relaxed text-ink-soft">
        <h2 className="text-lg font-medium text-ink">{en ? 'Contact' : '聯絡'}</h2>
        <p>
          {en ? 'Email ' : '電郵 '}
          <a href={`mailto:${CONTACT}`} className="font-medium text-accent-strong underline underline-offset-2">
            {CONTACT}
          </a>
          {en ? '. A person replies.' : '。會有人回覆。'}
        </p>
      </section>
    </div>
  )
}
