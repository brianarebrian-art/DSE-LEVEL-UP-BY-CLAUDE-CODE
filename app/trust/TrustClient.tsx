'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'
import { REVIEWED_COUNT } from '@/data/provenance'
import { getActiveSubjects } from '@/data/subjects'
import { getSubjectQuestions } from '@/data/questions'

// 見 page.tsx 檔頭。呢版唔加新聲稱，只排列已存在嘅答案。
//
// 所有數字即時由題庫算 —— 硬編一個「5,201」落去，加減題嗰日呢版就會靜靜哋講錯，
// 而錯嘅一定係呢版（因為冇人跑得起佢）。同 /transparency、首頁同一個做法。

function Card({
  href,
  q,
  a,
  cta,
}: {
  href: string
  q: string
  a: string
  cta: string
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-line bg-surface-raised p-5 transition-colors hover:border-accent/40"
    >
      <div className="text-sm font-medium text-ink">{q}</div>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{a}</p>
      <div className="mt-3 text-sm font-medium text-accent-strong">{cta} →</div>
    </Link>
  )
}

export default function TrustClient() {
  const { locale } = useLocale()
  const en = locale === 'en'

  const subjects = getActiveSubjects()
  const total = subjects.reduce((n, s) => n + getSubjectQuestions(s.id).length, 0)
  const pct = total > 0 ? ((REVIEWED_COUNT / total) * 100).toFixed(2) : '0'

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-medium text-ink">{en ? 'Trust centre' : '信任中心'}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {en
            ? 'Everything on this page can be checked. Nothing here asks you to take our word for it.'
            : '呢版上面每一樣嘢你都查得到。冇一樣係要你「信我哋講」。'}
        </p>
      </header>

      {/* 由「唔係咩」開始 —— 一版信任頁若由「我哋幾好」開始，讀者第一反應係戒備。 */}
      <div className="mb-8 rounded-2xl border border-line-strong bg-surface-sunken p-5">
        <h2 className="mb-3 text-sm font-medium text-ink">{en ? 'What we are not' : '我哋唔係咩'}</h2>
        <ul className="space-y-1.5 text-sm leading-relaxed text-ink-soft">
          <li>
            {en
              ? '· Not affiliated with the HKEAA. Not endorsed, not approved, not in partnership. Official papers and results come from them.'
              : '· 同香港考試及評核局冇任何從屬關係。冇獲認可、冇獲授權、冇合作。官方試題同成績以佢哋為準。'}
          </li>
          <li>{en ? '· Not a company and not a school — a free project run by DSE students and alumni.' : '· 唔係公司，亦唔係學校 —— 一個由 DSE 學生同舊生營運嘅免費專案。'}</li>
          <li>{en ? '· Not a crisis or counselling service.' : '· 唔係危機支援或者輔導服務。'}</li>
          <li>{en ? '· Not audited or certified by anybody outside the project.' : '· 冇任何專案以外嘅人審計或者認證過。'}</li>
          <li>{en ? '· Not a place where anyone can contact you — there is no messaging of any kind here.' : '· 唔係一個有人搵得到你嘅地方 —— 呢度冇任何形式嘅訊息功能。'}</li>
        </ul>
      </div>

      {/* 三個即時由代碼算嘅數 */}
      <div className="mb-8 grid grid-cols-3 gap-3">
        {[
          { n: total.toLocaleString(), l: en ? 'rewritten MC questions' : '條改寫 MC 題' },
          { n: String(subjects.length), l: en ? 'subjects with MC practice' : '科有 MC 練習' },
          { n: `${pct}%`, l: en ? 'carry a named review record' : '有實名審批紀錄' },
        ].map((s) => (
          <div key={s.l} className="rounded-xl border border-line bg-surface-raised p-3 text-center">
            <div className="text-lg font-medium text-ink">{s.n}</div>
            <div className="mt-1 text-[11px] leading-snug text-ink-muted">{s.l}</div>
          </div>
        ))}
      </div>
      <p className="mb-8 text-xs leading-relaxed text-ink-muted">
        {en
          ? `That last figure is low and we publish it anyway: ${REVIEWED_COUNT} of ${total.toLocaleString()} questions have a named, dated, one-by-one approval on record. Every other question shows which automated checks it passed instead — we would rather show a small true number than a large vague one.`
          : `最後嗰個數低，我哋照樣公開：${total.toLocaleString()} 條題目入面有 ${REVIEWED_COUNT} 條有實名、有日期、逐題嘅審批紀錄。其餘每一條都會顯示佢過咗邊啲自動檢查 —— 我哋寧願擺一個細但真嘅數，唔擺一個大但含糊嘅數。`}
      </p>

      <h2 className="mb-3 text-lg font-medium text-ink">{en ? 'The questions people actually ask' : '大家真係會問嘅問題'}</h2>
      <div className="space-y-3">
        <Card
          href="/transparency"
          q={en ? 'Who writes the questions? Does AI write them?' : '啲題目邊個寫？係咪 AI 寫？'}
          a={
            en
              ? 'AI drafts and classifies; a person decides what goes live. Each question shows its own review status.'
              : 'AI 出初稿同分類，出唔出街由人決定。每條題目都會顯示佢自己嘅覆核狀態。'
          }
          cta={en ? 'How questions are made' : '題目點樣做出嚟'}
        />
        <Card
          href="/methodology"
          q={en ? 'What can this actually help me with — and what can it not?' : '呢個平台幫到我咩？又幫唔到我咩？'}
          a={
            en
              ? 'MC practice trains a narrow set of things well. Written papers, orals and practicals are not covered, and we say what to use instead.'
              : 'MC 練習訓練到嘅嘢好窄。書寫卷、口試、實作我哋涵蓋唔到，而我哋會講你應該用咩方法。'
          }
          cta={en ? 'Scope and limits' : '適用範圍與限制'}
        />
        <Card
          href="/prediction-method"
          q={en ? 'Where does my level come from?' : '我個等級係點嚟？'}
          a={
            en
              ? 'From your MC accuracy compared against approximate bands, shown as a range because the sample is small. The whole table is published.'
              : '由你嘅 MC 答對率同近似分界線對照而來，因為樣本細所以顯示成一個範圍。成張表都貼咗出嚟。'
          }
          cta={en ? 'The full method' : '完整計法'}
        />
        <Card
          href="/privacy"
          q={en ? 'What do you store about me? Can I delete it?' : '你哋存咗我啲咩？刪唔刪得？'}
          a={
            en
              ? 'Without signing in, nothing leaves your browser. Signed in, exactly 12 items sync. No analytics, no ad networks, no data sales. You can erase it yourself.'
              : '唔登入嘅話乜都唔會離開你部瀏覽器。登入之後同步嘅只有 12 項。冇分析工具、冇廣告網絡、唔賣數據。你自己刪得走。'
          }
          cta={en ? 'Privacy policy' : '私隱政策'}
        />
        <Card
          href="/community-safety"
          q={en ? 'Can strangers contact my child here?' : '有陌生人可以喺呢度搵到我小朋友嗎？'}
          a={
            en
              ? 'No. There is no messaging, no posting, no likes — no user-to-user interaction of any kind, and an automated check keeps it that way.'
              : '冇。呢度冇訊息、冇留言、冇心心 —— 冇任何形式嘅用戶對用戶互動，而且有自動檢查釘住佢。'
          }
          cta={en ? 'Student safety' : '學生安全'}
        />
        <Card
          href="/accessibility"
          q={en ? 'Does it work with assistive tools?' : '輔助工具用唔用得？'}
          a={
            en
              ? 'Text sizing, dyslexia-friendly font, reading ruler, reduced motion, MathML for formulas. We also list what is missing and what we have not tested.'
              : '字級調整、讀寫障礙友善字體、閱讀尺、減少動態、數式帶 MathML。我哋亦列明咗咩未做、咩未測試過。'
          }
          cta={en ? 'Accessibility self-assessment' : '無障礙自評'}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-surface-raised p-5">
        <h2 className="mb-2 text-sm font-medium text-ink">{en ? 'Found something wrong?' : '發現咗有嘢唔啱？'}</h2>
        <p className="text-sm leading-relaxed text-ink-soft">
          {en
            ? 'Every question has a report link under its explanation. For anything else — including a statement on these pages that does not match what the site does — email '
            : '每條題目嘅解析下面都有報錯連結。其他任何事 —— 包括呢幾版有邊句同個站實際做法唔同 —— 電郵 '}
          <a
            href="mailto:dselevelup@gmail.com"
            className="font-medium text-accent-strong underline underline-offset-2"
          >
            dselevelup@gmail.com
          </a>
          {en ? '. We are two people, so it will not be instant — but a real person reads it.' : '。我哋得兩個人，所以唔會即時 —— 但係會有真人睇。'}
        </p>
      </div>

      <p className="mt-8 text-xs leading-relaxed text-ink-muted">
        {en
          ? 'Every page linked above carries the date it was last checked against the code.'
          : '以上每一版都寫住佢最後一次對住代碼核實嘅日期。'}
      </p>
    </div>
  )
}
