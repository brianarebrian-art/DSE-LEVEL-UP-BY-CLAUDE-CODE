'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'
import ExternalLinkGate from '@/components/ExternalLinkGate'

// 見 page.tsx 檔頭。呢版唔係為算法辯護，係公開佢有幾粗糙。

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-medium text-ink">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-ink-soft">{children}</div>
    </section>
  )
}

// 直接對應 data/cutoffs.ts 嘅 practicePercentages。呢啲數會喺頁面顯示，
// 唔係為咗好睇 —— 而係「你自己都計得返」係呢版唯一嘅價值。
const BANDS: [grade: string, pct: number][] = [
  ['5**', 92],
  ['5*', 83],
  ['5', 70],
  ['4', 55],
  ['3', 40],
  ['2', 25],
  ['1', 12],
]

export default function PredictionMethodClient() {
  const { locale } = useLocale()
  const en = locale === 'en'

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-medium text-ink">
          {en ? 'How the performance level is worked out' : '「今次表現等級」係點計出嚟'}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {en
            ? 'Saying “for reference only” is a disclaimer, not an explanation. This page is the explanation — including the parts that are rough.'
            : '講「僅供參考」係一句免責，唔係一個解釋。呢版係嗰個解釋 —— 包括佢粗糙嘅地方。'}
        </p>
      </header>

      <Section title={en ? 'What goes in' : '用咩去計'}>
        <p>
          {en
            ? 'Only one thing: how many multiple-choice questions you got right in the set you just finished, on this device.'
            : '只有一樣嘢：你啱啱做完嗰份卷入面答啱咗幾多條選擇題，喺你呢部機。'}
        </p>
        <p>
          {en
            ? 'Not included: how long you took, how many sets you have done before, which topics you chose, how you did last week, or anything you wrote. Written papers are never scored by machine here, so they never enter this number.'
            : '唔包括：你用咗幾耐、你之前做過幾多份、你揀咗邊啲課題、你上星期做得點，或者你寫過嘅任何文字。書寫題喺呢度永遠唔由機器批改，所以佢哋從來冇入過呢個數。'}
        </p>
      </Section>

      <Section title={en ? 'The boundaries we compare against' : '我哋攞嚟對照嘅分界線'}>
        <p>
          {en
            ? 'Your percentage is compared against these bands. They are approximations of how DSE grades typically distribute — they are NOT the HKEAA’s published cut-offs, and the HKEAA does not publish per-paper cut-offs in this form.'
            : '你嘅百分率會同下面呢啲界線對照。佢哋係「DSE 等級大致點分佈」嘅近似值 —— 唔係考評局公布嘅分界線，而考評局亦冇以呢個形式公布逐卷分界。'}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-ink-muted">
                <th className="py-2 pr-4 font-medium">{en ? 'Level' : '等級'}</th>
                <th className="py-2 font-medium">{en ? 'Percentage correct at or above' : '答對率達到'}</th>
              </tr>
            </thead>
            <tbody>
              {BANDS.map(([g, p]) => (
                <tr key={g} className="border-b border-line/60">
                  <td className="py-2 pr-4 font-mono text-ink-soft">{g}</td>
                  <td className="py-2 text-ink-soft">{p}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-ink-muted">
          {en
            ? 'That is the whole table. You can do the arithmetic yourself — that is the point of showing it.'
            : '就係咁多。你自己都計得返 —— 貼出嚟就係為咗呢樣。'}
        </p>
      </Section>

      <Section title={en ? 'Why you see a range, not a number' : '點解你見到一個範圍，唔係一個數字'}>
        <p>
          {en
            ? 'Twenty questions is a small sample. The same student doing the same set today and tomorrow will not get the same percentage. So instead of one confident level, we compute a 95% confidence interval on your accuracy (a Wilson score interval) and show the levels at both ends.'
            : '二十條題係一個好細嘅樣本。同一個學生今日做同聽日做，答對率本身就會上落。所以我哋唔畀一個肯定嘅等級，而係計你答對率嘅 95% 置信區間（Wilson score interval），再顯示兩端對應嘅等級。'}
        </p>
        <p>
          {en
            ? 'We use Wilson rather than the more common p ± z·√(p(1−p)/n) because the latter breaks on small samples: it can produce intervals outside 0–100%, and at 20 out of 20 it collapses to zero width — which would tell you we are 100% certain you are a 5**. We are not.'
            : '用 Wilson 而唔用常見嘅 p ± z·√(p(1−p)/n)，係因為後者喺細樣本會出鬼：區間可以超出 0–100%，而 20 題全對時更會收窄成寬度零 —— 即係話畀你聽我哋百分百肯定你係 5**。我哋唔係。'}
        </p>
      </Section>

      <Section title={en ? 'Three kinds of uncertainty — we can only measure one' : '三層不確定性 —— 我哋只量得到一層'}>
        <ol className="ml-4 list-decimal space-y-2">
          <li>
            <span className="font-medium text-ink">{en ? 'Sample size.' : '樣本大細。'}</span>{' '}
            {en
              ? 'Measurable — this is the range you see.'
              : '量得到 —— 就係你見到嗰個範圍。'}
          </li>
          <li>
            <span className="font-medium text-ink">{en ? 'The boundaries themselves.' : '分界線本身。'}</span>{' '}
            {en
              ? 'Approximations, as above. Not measurable from anything we hold.'
              : '如上所述係近似值。我哋手上冇任何嘢量得到佢差幾多。'}
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
            ? 'So a narrow range does not mean the estimate is accurate. It only means your accuracy on this platform has stopped wobbling. Layers 2 and 3 stay unmeasured no matter how many questions you do.'
            : '所以範圍窄唔等於準。佢只等於「你喺呢個平台嘅答對率唔再飄」。無論你做幾多題，第 2 同第 3 層都仍然量唔到。'}
        </p>
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
            ? 'The whole calculation is in the open-source repository: the bands in data/cutoffs.ts and the interval in lib/gradeConfidence.ts. Both carry comments explaining the choices above.'
            : '成條數都喺開源倉庫入面：分界線喺 data/cutoffs.ts，區間喺 lib/gradeConfidence.ts。兩個檔都有註解解釋上面講嘅取捨。'}
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
