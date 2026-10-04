'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'
import ExternalLinkGate from '@/components/ExternalLinkGate'
import { MIN_BAND_EVIDENCE } from '@/lib/practiceBand'
import { lengthBiasedSubjects, OPTION_LENGTH_MEASURED_AT } from '@/lib/optionLengthBias'
import { getSubject } from '@/data/subjects'

// 見 page.tsx 檔頭。呢版唔係為算法辯護，係公開佢有幾粗糙。

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-medium text-ink">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-ink-soft">{children}</div>
    </section>
  )
}

export default function PredictionMethodClient() {
  const { locale } = useLocale()
  const en = locale === 'en'
  // Founders' reply 17C (2026-10-04), wording approved as drafted. Derived from the live bank.
  const biased = lengthBiasedSubjects().map((id) => getSubject(id)).filter((m) => m !== undefined)
  const [y, mo, d] = OPTION_LENGTH_MEASURED_AT.split('-').map(Number)
  const measured = en
    ? new Date(Date.UTC(y, mo - 1, d)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    : `${y} 年 ${mo} 月 ${d} 日`

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-medium text-ink">
          {en ? 'How the practice figures are worked out' : '練習表現係點計出嚟'}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {en
            ? 'Saying “for reference only” is a disclaimer, not an explanation. This page is the explanation — including the parts that are rough.'
            : '講「僅供參考」係一句免責，唔係一個解釋。呢版係嗰個解釋 —— 包括佢粗糙嘅地方。'}
        </p>
      </header>

      {/* 2026-09-30（改進循環 2）：結果頁不再顯示 DSE 等級。原本的「本節表現等級」分界線表
          （5** 92% … 1 12%）及 Wilson 區間一節隨之刪除。 */}
      <Section title={en ? 'Two different things' : '兩樣唔同嘅嘢'}>
        <ul className="ml-4 list-disc space-y-1.5">
          <li>
            <span className="font-medium text-ink">{en ? 'This session (result page)' : '本節表現（結果頁）'}</span>
            {en
              ? ' — how the set you just finished went, in plain words. No DSE level.'
              : ' —— 你啱啱做完嗰一節點樣，用普通字眼講。冇 DSE 等級。'}
          </li>
          <li>
            <span className="font-medium text-ink">{en ? 'Practice performance (estimate)' : '練習表現估算'}</span>
            {en
              ? ' — a cumulative range across every valid session in a subject, compared with the HKEAA’s published share of candidates at each level. Described further down.'
              : ' —— 累計本科所有有效練習，對照考評局公布嘅各級考生比例計出。下面另有一節專講。'}
          </li>
        </ul>
      </Section>

      <Section title={en ? 'This session: how the words are chosen' : '「本節表現」點樣揀字'}>
        <p>
          {en
            ? 'Only one thing goes in: how many multiple-choice questions you got right in the set you just finished, on this device. Written answers are never scored by machine here.'
            : '只計一樣嘢：你啱啱做完嗰一節答啱咗幾多條選擇題，喺你呢部機。書寫題喺呢度永遠唔由機器批改。'}
        </p>
        <ul className="ml-4 list-disc space-y-1.5">
          <li>{en ? `Fewer than ${MIN_BAND_EVIDENCE} questions: “Not enough evidence”.` : `少過 ${MIN_BAND_EVIDENCE} 題：「證據不足」。`}</li>
          <li>{en ? 'Under half right: “Needs consolidating”.' : '答對少過一半：「需要鞏固」。'}</li>
          <li>{en ? 'Half to under 80% right: “Developing”.' : '答對一半至八成以下：「發展中」。'}</li>
          <li>{en ? '80% or more right: “Fairly steady”.' : '答對八成或以上：「相對穩定」。'}</li>
        </ul>
        <p>
          {en
            ? 'These describe one session, not you, and none of them means “mastered”. Ten questions cannot say that.'
            : '呢啲字眼描述嘅係一節練習，唔係你本人；冇一個代表「已經掌握」—— 十條題講唔到呢樣嘢。'}
        </p>
      </Section>

      <Section title={en ? 'Three kinds of uncertainty — we can only measure one' : '三層不確定性 —— 我哋只量得到一層'}>
        <ol className="ml-4 list-decimal space-y-2">
          <li>
            <span className="font-medium text-ink">{en ? 'Sample size.' : '樣本大細。'}</span>{' '}
            {en
              ? 'Measurable — this is why the estimate shows a range.'
              : '量得到 —— 所以估算顯示一個範圍。'}
          </li>
          <li>
            <span className="font-medium text-ink">{en ? 'The boundaries themselves.' : '分界線本身。'}</span>{' '}
            {en
              ? 'For the cumulative range: now measured — see below. (This page said “not measurable” until 23 Aug 2026; that stopped being true when the ten-year series went in.)'
              : '對「累積估算」而言：而家量得到 —— 見下文。（呢版一直寫住「量唔到」，直至 2026-08-23 十年數據入庫為止；嗰句已經唔啱。）'}
          </li>
          <li>
            <span className="font-medium text-ink">{en ? 'The questions are rewrites.' : '題目係改寫版本。'}</span>{' '}
            {en
              ? 'Their difficulty mix will never match a real paper exactly. Also not measurable.'
              : '佢哋嘅難度分佈唔會同真卷完全一致。同樣量唔到。'}
          </li>
        </ol>
        <p className="rounded-xl border border-gold/25 bg-gold/[0.06] p-3">
          {en
            ? 'So a narrow range does not mean the estimate is accurate. It only means your accuracy on this platform has stopped wobbling. Layer 3 stays unmeasured no matter how many questions you do — and it is the one that matters most.'
            : '所以範圍窄唔等於準。佢只等於「你喺呢個平台嘅答對率唔再飄」。無論你做幾多題，第 3 層都仍然量唔到 —— 而佢係最要緊嗰層。'}
        </p>
        <p>
          {en
            ? 'On layer 2 we can now put a number on it. Across 2016–2025 the Level 5 boundary in biology moved between 18.0% and 20.9% of candidates; in mathematics it sat between 13.8% and 15.4%. DSE is standards-referenced — the cut is set each year after marking, so there is no fixed line to aim at. The cumulative range is widened by that year-to-year spread.'
            : '第 2 層而家有得畀個數你。2016 至 2025 年之間，生物科「5 級或以上」嘅界線由 18.0% 郁到 20.9%；數學必修由 13.8% 到 15.4%。DSE 用水平參照，條線每年評卷之後先訂 —— 根本冇一條固定嘅線畀你瞄。累積估算會按呢個逐年幅度自動加闊。'}
        </p>
      </Section>

      {biased.length > 0 && (
        <Section title={en ? 'Known issue: option length' : '已知問題：選項長短'}>
          <p>
            {en
              ? `On ${measured} we tested this ourselves: in the subjects below, picking the longest option gets the answer right more than half the time (guessing at random should give about one in four), so the practice estimate for these subjects may be too high: ${biased.map((m) => m.nameEn).join(', ')}. An automatic check now stops new questions from having this problem.`
              : `${measured}我哋自己測試過：喺以下科目，揀最長嗰個選項有超過一半機會答中（亂揀應該只有大約四分之一），所以呢啲科目嘅練習表現估算可能偏高：${biased.map((m) => m.name).join('、')}。新題目已經有自動檢查擋住呢個問題。`}
          </p>
        </Section>
      )}

      <Section title={en ? 'The cumulative range: how it is worked out' : '「累積估算」係點計出嚟'}>
        <p>
          {en
            ? 'It works in percentile space, because that is the only space in which the HKEAA has actually published anything.'
            : '佢喺百分位空間做嘢，因為考評局真正公布過嘅嘢，就只有喺呢個空間入面。'}
        </p>
        <ol className="ml-4 list-decimal space-y-2">
          <li>
            {en
              ? 'Each difficulty tier is guess-corrected: (observed − 0.25) ÷ 0.75, floored at zero. Four-option guessing scores 25%, so pure guessing corrects to nothing.'
              : '逐個難度層做猜測校正：（觀察正確率 − 0.25）÷ 0.75，下限截於零。四選一亂撳嘅期望係 25%，所以純粹靠估校正之後乜都冇。'}
          </li>
          <li>
            {en
              ? 'The three tiers are combined 3 : 5 : 2 — the same basic : intermediate : hard mix the question bank is written to.'
              : '三層按 3 : 5 : 2 合成 —— 同題庫出題嘅基礎:普通:拔尖比例一致。'}
          </li>
          <li>
            {en
              ? 'That figure is read as a candidate percentile, and the level is looked up in the HKEAA’s published cumulative percentages for that subject (2025, day-school candidates).'
              : '嗰個數當作考生百分位，再喺考評局公布嘅該科累積百分率（2025 年，日校考生）查返等級。'}
          </li>
        </ol>
        <p className="rounded-xl border border-accent/25 bg-accent/[0.06] p-3">
          {en
            ? 'The point of step 3 is that the boundaries stop being ours. English needs the top 10.1% for Level 5; physics needs the top 26.3%. That difference comes from the published data, not from a parameter we chose.'
            : '第 3 步嘅意義係：界線唔再係我哋定嘅。英文要全港前 10.1% 先係 5 級，物理前 26.3% 就已經係。呢個差異來自公布咗嘅數據，唔係我哋揀嘅參數。'}
        </p>
        <p>
          {en
            ? 'Step 2 of the old approach used seven hand-picked thresholds. Those are gone. Nothing in the cumulative estimate is a number we invented, apart from the 3 : 5 : 2 weighting and the assumption in step 3 — both stated here.'
            : '舊做法第 2 步用咗七個人手揀嘅門檻。嗰七個數已經剷走。累積估算入面冇一個數係我哋作嘅，除咗 3 : 5 : 2 個權重同第 3 步嗰個假設 —— 兩樣都寫咗喺呢度。'}
        </p>
      </Section>

      <Section title={en ? 'When we refuse to show anything' : '幾時我哋乜都唔顯示'}>
        <p>
          {en
            ? 'A range that spans three levels tells you nothing, but it reads like an answer. So there are three points at which the cumulative estimate refuses to speak:'
            : '一個跨三個等級嘅範圍對你冇任何用，但佢讀落好似係個答案。所以累積估算有三個位會直接唔講：'}
        </p>
        <ul className="ml-4 list-disc space-y-1.5">
          <li>
            {en
              ? 'If we cannot statistically rule out that you were guessing (99% interval, deliberately stricter than the 95% used for display).'
              : '如果我哋喺統計上排除唔到「你係喺度估」（用 99% 區間，刻意嚴過顯示用嘅 95%）。'}
          </li>
          <li>
            {en
              ? 'If the resulting range would span more than two adjacent levels. We say how many more questions would narrow it instead.'
              : '如果個範圍會跨過兩個相鄰等級以上。我哋改為講「仲要做幾多題先收窄到講得出嘢」。'}
          </li>
          <li>
            {en
              ? 'Below 30 questions in the subject, and for Citizenship and Social Development, which is reported as attained / not attained only.'
              : '本科少過 30 題；以及公民與社會發展科 —— 該科只設達標／未達標。'}
          </li>
        </ul>
        <p>
          {en
            ? 'This does mean the estimate stays quiet longer for very strong candidates: the top three levels together occupy about 17 percentage points in economics, while Levels 3 and 4 are 25 points apart. Telling 5 from 5* genuinely needs far more evidence.'
            : '呢個做法對拔尖生嚟講會靜耐啲：經濟科頂三級加埋先約 17 個百分點，而 3 級同 4 級之間有 25 個。分辨 5 同 5* 本來就需要多好多證據。'}
        </p>
      </Section>

      <Section title={en ? 'Four things the HKEAA has never published' : '四句必須講清楚嘅嘢'}>
        <ol className="ml-4 list-decimal space-y-2">
          <li>
            {en
              ? 'The HKEAA has never published a cut-off score for any subject. Any figure claiming to be an “official cut-off” is not official.'
              : '考評局從來冇公布過任何一科嘅分數線。任何聲稱係「官方 cut-off」嘅數字都唔係官方嘅。'}
          </li>
          <li>
            {en
              ? 'Our level boundaries use the HKEAA’s published share of candidates at each level, per subject, for 2025 day-school candidates.'
              : '我哋嘅等級界線，用嘅係考評局公布嘅各級考生百分比，逐科獨立，數據年份 2025（日校考生）。'}
          </li>
          <li>
            {en
              ? 'We give you a range, not a number, because the sampling error on a short set really is that large. More questions narrows it on its own.'
              : '我哋畀你一個範圍，唔係一個數字，因為短卷嘅抽樣誤差真係好大。做多啲題，範圍會自己收窄。'}
          </li>
          <li>
            {en
              ? 'This is worked out from this platform’s own rewritten questions. It is not an HKEAA grade and the two cannot be compared directly.'
              : '呢個估算按本平台自己改寫嘅練習題推算，唔係考評局嘅評級，兩者唔可以直接比較。'}
          </li>
        </ol>
      </Section>

      <Section title={en ? 'What it does not mean' : '佢唔代表咩'}>
        <ul className="ml-4 list-disc space-y-1.5">
          <li>{en ? 'It is not a DSE grade prediction.' : '佢唔係 DSE 成績預測。'}</li>
          <li>{en ? 'It does not account for written papers, orals or practicals at all.' : '佢完全冇計算書寫卷、口試或者實作。'}</li>
          <li>{en ? 'It is not calibrated against anyone’s real DSE results — we hold no such data.' : '佢冇對照過任何人嘅真實 DSE 成績校準 —— 我哋手上冇呢啲數據。'}</li>
          <li>{en ? 'It should not be used to decide which subjects to drop.' : '唔應該攞佢嚟決定放棄邊科。'}</li>
        </ul>
        <p>
          {en ? 'Official results come from the HKEAA. Past papers are on the ' : '正式成績以香港考試及評核局公布為準。歷屆試題請前往'}
          <ExternalLinkGate
            href="https://www.hkeaa.edu.hk/"
            platform={en ? 'HKEAA' : '香港考試及評核局'}
            className="font-medium text-accent-strong underline underline-offset-2"
          >
            {en ? 'HKEAA website' : '考評局網站'}
          </ExternalLinkGate>
          {en ? '.' : '下載。'}
        </p>
      </Section>

      <Section title={en ? 'If you want to check our arithmetic' : '想核我哋條數'}>
        <p>
          {en
            ? 'The whole calculation is in the open-source repository. This session’s words: lib/practiceBand.ts. The cumulative range: lib/mastery.ts, with the published figures in data/dse-2025-level-distribution.json and the ten-year series in data/dse-level-drift.json — both extracted straight from the HKEAA PDFs by scripts you can re-run.'
            : '成條數都喺開源倉庫入面。本節表現：lib/practiceBand.ts。累積估算：lib/mastery.ts，公布數字喺 data/dse-2025-level-distribution.json，十年序列喺 data/dse-level-drift.json —— 兩份都由考評局 PDF 直接抽出，抽取腳本你自己跑得返。'}
        </p>
        <p>
          {en ? 'Related: ' : '相關：'}
          <Link href="/transparency" className="font-medium text-accent-strong underline underline-offset-2">
            {en ? 'transparency' : '透明度'}
          </Link>
          {en ? ' · ' : '、'}
          <Link href="/methodology" className="font-medium text-accent-strong underline underline-offset-2">
            {en ? 'how questions are written' : '出題方法'}
          </Link>
        </p>
      </Section>
    </div>
  )
}
