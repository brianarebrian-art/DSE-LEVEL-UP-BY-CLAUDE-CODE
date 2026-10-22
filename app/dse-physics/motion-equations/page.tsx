import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb, RelatedTopics } from '@/components/Seo/SeoNavigation'
import { JsonLd } from '@/components/Seo/JsonLd'
import { createSeoMetadata } from '@/lib/seo'
import { SITE_ORIGIN } from '@/lib/site'
import ExternalLinkGate from '@/components/ExternalLinkGate'

const pageHeading = 'DSE Physics 勻加速運動方程：公式與分步例題' // i18n-exempt: zh-Hant editorial content
const description = 'DSE Physics 勻加速運動方程教學：掌握方向正負、五個運動變數與 SI 單位，理解公式只適用於恆定加速度；透過加速、煞車及鉛直拋擲例題，練習由題意選取公式、分步列式和代入，並逐步核對數值、單位與正負號、解讀速度—時間圖，整理常見失分位與修正方法，連結物理科筆記、練習及考評局官方樣本試卷資源。' // i18n-exempt: zh-Hant SEO metadata
const path = '/dse-physics/motion-equations'

export const metadata: Metadata = createSeoMetadata({
  title: `${pageHeading} | DSE Level Up`, // i18n-exempt: zh-Hant SEO metadata
  description, // i18n-exempt: zh-Hant SEO metadata
  path,
  type: 'article',
})

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: pageHeading,
  description,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `${SITE_ORIGIN}${path}`,
  },
  url: `${SITE_ORIGIN}${path}`,
  inLanguage: 'zh-HK',
}

export default function MotionEquationsPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { name: '首頁', path: '/' }, // i18n-exempt: zh-Hant editorial content
          { name: 'DSE 科目', path: '/subjects' }, // i18n-exempt: zh-Hant editorial content
          { name: 'DSE Physics', path: '/subjects/physics' },
          { name: pageHeading, path },
        ]}
      />
      <section lang="zh-Hant" data-editorial-content className="mx-auto max-w-5xl px-4 py-10">
        <article className="prose prose-slate max-w-3xl">
          <JsonLd data={articleSchema} />
          <p className="text-sm font-medium text-accent">DSE Physics · Mechanics</p>
          <h1 className="mt-3 text-4xl font-medium leading-tight text-ink sm:text-5xl">{pageHeading}</h1>
          <p className="mt-5 text-lg leading-8 text-ink-muted">
            勻加速直線運動題的關鍵，不是背得最多公式，而是先訂好正方向，再把每個量連同單位和正負號寫清楚。以下例題均為原創情境，讓你練習由已知量選公式、列式和檢查答案。 {/* i18n-exempt: zh-Hant editorial content */}
          </p>

          <section className="mt-12" aria-labelledby="model-and-direction">
            <h2 id="model-and-direction" className="text-2xl font-medium text-ink">先建立模型：方向與正負號</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">
              這四條運動方程處理的是<strong>一維、加速度恆定</strong>的運動。解題前自行選擇一個正方向，例如向東為正或向上為正；其後位移、速度和加速度都必須以同一方向判斷正負。負速度只表示物體朝負方向運動，並不等於「正在減速」；速度大小是否變小，要比較速度和加速度的方向。 {/* i18n-exempt: zh-Hant editorial content */}
            </p>
            <div className="mt-5 overflow-x-auto rounded-xl border border-line">
              <table className="w-full border-collapse text-left text-sm text-ink-soft">
                <caption className="caption-top px-4 py-3 text-left font-medium text-ink">五個常用運動變數、SI 單位與可重組的關係</caption> {/* i18n-exempt: zh-Hant editorial content */}
                <thead className="bg-surface-sunken text-ink">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">符號</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <th scope="col" className="px-4 py-3 font-medium">名稱與方向</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <th scope="col" className="px-4 py-3 font-medium">SI 單位</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <th scope="col" className="px-4 py-3 font-medium">常用關係</th> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-line"><th scope="row" className="px-4 py-3 font-medium">s</th><td className="px-4 py-3">位移；沿所選正方向可正可負</td><td className="px-4 py-3">m</td><td className="px-4 py-3">s = ut + ½at²</td></tr> {/* i18n-exempt: zh-Hant editorial content */}
                  <tr className="border-t border-line"><th scope="row" className="px-4 py-3 font-medium">u</th><td className="px-4 py-3">初速度</td><td className="px-4 py-3">m s⁻¹</td><td className="px-4 py-3">u = v − at</td></tr> {/* i18n-exempt: zh-Hant editorial content */}
                  <tr className="border-t border-line"><th scope="row" className="px-4 py-3 font-medium">v</th><td className="px-4 py-3">末速度</td><td className="px-4 py-3">m s⁻¹</td><td className="px-4 py-3">v = u + at</td></tr> {/* i18n-exempt: zh-Hant editorial content */}
                  <tr className="border-t border-line"><th scope="row" className="px-4 py-3 font-medium">a</th><td className="px-4 py-3">加速度；速度的改變率</td><td className="px-4 py-3">m s⁻²</td><td className="px-4 py-3">a = (v − u) / t</td></tr> {/* i18n-exempt: zh-Hant editorial content */}
                  <tr className="border-y border-line"><th scope="row" className="px-4 py-3 font-medium">t</th><td className="px-4 py-3">時間</td><td className="px-4 py-3">s</td><td className="px-4 py-3">t = (v − u) / a，當 a ≠ 0</td></tr> {/* i18n-exempt: zh-Hant editorial content */}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-10" aria-labelledby="equations-and-limit">
            <h2 id="equations-and-limit" className="text-2xl font-medium text-ink">四條方程與適用限制</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">選擇不含不需要未知量的一條方程，不必每題四條都用：</p> {/* i18n-exempt: zh-Hant editorial content */}
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-ink-soft">
              <li><strong>v = u + at</strong>：已知時間，求末速度或加速度。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li><strong>s = ut + ½at²</strong>：已知時間，求位移。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li><strong>v² = u² + 2as</strong>：題目沒有時間時，常可直接連結速度、加速度和位移。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li><strong>s = ½(u + v)t</strong>：加速度恆定時，平均速度是 ½(u + v)。</li> {/* i18n-exempt: zh-Hant editorial content */}
            </ul>
            <p className="mt-4 leading-8 text-ink-soft">
              若加速度正在改變，例如降落傘打開後空氣阻力迅速改變，不能把整段運動當成一次勻加速。應按加速度可視為恆定的時段分段處理，或改用題目提供的圖像和資料。在近地面鉛直運動中，只有題目容許忽略空氣阻力時，才可取重力加速度為恆定；若取向上為正，<strong>a = −9.8 m s⁻²</strong>。 {/* i18n-exempt: zh-Hant editorial content */}
            </p>
          </section>

          <section className="mt-10" aria-labelledby="velocity-time-graph">
            <h2 id="velocity-time-graph" className="text-2xl font-medium text-ink">速度—時間圖怎樣解讀？</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">在 v–t 圖中，橫軸是時間，縱軸是有正負的速度。直線斜率代表加速度；圖線與時間軸之間的有向面積代表位移。</p> {/* i18n-exempt: zh-Hant editorial content */}
            <div className="mt-5 overflow-x-auto rounded-xl border border-line">
              <table className="w-full border-collapse text-left text-sm text-ink-soft">
                <caption className="caption-top px-4 py-3 text-left font-medium text-ink">v–t 圖常見特徵的物理意義</caption> {/* i18n-exempt: zh-Hant editorial content */}
                <thead className="bg-surface-sunken text-ink">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">圖像特徵</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <th scope="col" className="px-4 py-3 font-medium">代表意思</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <th scope="col" className="px-4 py-3 font-medium">解題提示</th> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-line"><th scope="row" className="px-4 py-3 font-medium">水平直線</th><td className="px-4 py-3">速度不變，a = 0</td><td className="px-4 py-3">矩形的有向面積為 vt。</td></tr> {/* i18n-exempt: zh-Hant editorial content */}
                  <tr className="border-t border-line"><th scope="row" className="px-4 py-3 font-medium">向上直線</th><td className="px-4 py-3">斜率為正，加速度為正</td><td className="px-4 py-3">斜率 = Δv / Δt，單位是 m s⁻²。</td></tr> {/* i18n-exempt: zh-Hant editorial content */}
                  <tr className="border-t border-line"><th scope="row" className="px-4 py-3 font-medium">向下直線</th><td className="px-4 py-3">斜率為負，加速度為負</td><td className="px-4 py-3">若速度本身為正，速率會下降；若速度為負，速率反而會上升。</td></tr> {/* i18n-exempt: zh-Hant editorial content */}
                  <tr className="border-y border-line"><th scope="row" className="px-4 py-3 font-medium">圖線在時間軸下方</th><td className="px-4 py-3">速度和該段位移為負</td><td className="px-4 py-3">求總路程時，須把每段面積的大小相加，不能直接以有向面積相加。</td></tr> {/* i18n-exempt: zh-Hant editorial content */}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-10" aria-labelledby="worked-examples">
            <h2 id="worked-examples" className="text-2xl font-medium text-ink">三題分步例題</h2> {/* i18n-exempt: zh-Hant editorial content */}

            <section className="mt-6 rounded-2xl bg-surface-sunken p-6" aria-labelledby="example-acceleration">
              <h3 id="example-acceleration" className="text-xl font-medium text-ink">例題一：直線加速</h3> {/* i18n-exempt: zh-Hant editorial content */}
              <p className="mt-3 leading-8 text-ink-soft">汽車向東行駛，取向東為正。它以 u = +4.0 m s⁻¹ 行駛，然後以 a = +2.5 m s⁻² 的恆定加速度加速 6.0 s。求末速度和位移。</p> {/* i18n-exempt: zh-Hant editorial content */}
              <ol className="mt-4 list-decimal space-y-3 pl-6 leading-8 text-ink-soft">
                <li>先記錄同一方向的數值：u = +4.0 m s⁻¹、a = +2.5 m s⁻²、t = 6.0 s。</li> {/* i18n-exempt: zh-Hant editorial content */}
                <li>求末速度：v = u + at = 4.0 + (2.5)(6.0) = <strong>+19 m s⁻¹</strong>，即向東 19 m s⁻¹。</li> {/* i18n-exempt: zh-Hant editorial content */}
                <li>求位移：s = ut + ½at² = (4.0)(6.0) + ½(2.5)(6.0)² = 24 + 45 = <strong>+69 m</strong>，即向東 69 m。</li> {/* i18n-exempt: zh-Hant editorial content */}
                <li>核對：平均速度是 ½(4.0 + 19) = 11.5 m s⁻¹；11.5 × 6.0 = 69 m，與上式一致。</li> {/* i18n-exempt: zh-Hant editorial content */}
              </ol>
            </section>

            <section className="mt-6 rounded-2xl bg-surface-sunken p-6" aria-labelledby="example-braking">
              <h3 id="example-braking" className="text-xl font-medium text-ink">例題二：煞車至靜止</h3> {/* i18n-exempt: zh-Hant editorial content */}
              <p className="mt-3 leading-8 text-ink-soft">電車向東行駛，取向東為正。煞車前 u = +20 m s⁻¹，煞車時 a = −5.0 m s⁻²，直至靜止。求煞車時間和位移。</p> {/* i18n-exempt: zh-Hant editorial content */}
              <ol className="mt-4 list-decimal space-y-3 pl-6 leading-8 text-ink-soft">
                <li>靜止表示 v = 0 m s⁻¹，並不表示 a = 0。</li> {/* i18n-exempt: zh-Hant editorial content */}
                <li>由 v = u + at 得 0 = 20 + (−5.0)t，所以 t = (0 − 20) / (−5.0) = <strong>4.0 s</strong>。</li> {/* i18n-exempt: zh-Hant editorial content */}
                <li>題目沒有要求中途速度，可用 v² = u² + 2as：0 = 20² + 2(−5.0)s，因此 s = <strong>+40 m</strong>。</li> {/* i18n-exempt: zh-Hant editorial content */}
                <li>位移為正，因為整段仍朝東行駛；負號只在加速度，表示速度每秒減少 5.0 m s⁻¹。</li> {/* i18n-exempt: zh-Hant editorial content */}
              </ol>
            </section>

            <section className="mt-6 rounded-2xl bg-surface-sunken p-6" aria-labelledby="example-vertical">
              <h3 id="example-vertical" className="text-xl font-medium text-ink">例題三：鉛直上拋與回落</h3> {/* i18n-exempt: zh-Hant editorial content */}
              <p className="mt-3 leading-8 text-ink-soft">小球由地面向上拋出，取向上為正，u = +14.7 m s⁻¹。忽略空氣阻力，並取 g = 9.8 m s⁻²，所以 a = −9.8 m s⁻²。求 1.0 s 後的速度和位移、最高點高度，以及回到拋出點的時刻和速度。</p> {/* i18n-exempt: zh-Hant editorial content */}
              <ol className="mt-4 list-decimal space-y-3 pl-6 leading-8 text-ink-soft">
                <li>1.0 s 後：v = 14.7 + (−9.8)(1.0) = <strong>+4.9 m s⁻¹</strong>；s = (14.7)(1.0) + ½(−9.8)(1.0)² = <strong>+9.8 m</strong>。正號表示仍向上、在拋出點上方。</li> {/* i18n-exempt: zh-Hant editorial content */}
                <li>最高點瞬間 v = 0，而加速度仍為 −9.8 m s⁻²。由 0 = 14.7² + 2(−9.8)s，得最高點 s = <strong>+11.0 m</strong>（3 個有效數字）。</li> {/* i18n-exempt: zh-Hant editorial content */}
                <li>回到拋出點時 s = 0：0 = 14.7t − 4.9t² = t(14.7 − 4.9t)。t = 0 是起始時刻，故回落時 t = <strong>3.0 s</strong>。</li> {/* i18n-exempt: zh-Hant editorial content */}
                <li>回落瞬間：v = 14.7 + (−9.8)(3.0) = <strong>−14.7 m s⁻¹</strong>，負號表示向下。這組結果依賴「重力加速度恆定、空氣阻力可忽略」的題設假定。</li> {/* i18n-exempt: zh-Hant editorial content */}
              </ol>
            </section>
          </section>

          <section className="mt-10" aria-labelledby="mistakes">
            <h2 id="mistakes" className="text-2xl font-medium text-ink">常見錯誤與修正</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <ol className="mt-4 list-decimal space-y-4 pl-6 leading-8 text-ink-soft">
              <li><strong>未先選正方向：</strong>看到「減速」便直接把速度或加速度寫成負。<strong>修正：</strong>先寫「向東為正」或「向上為正」，再按實際方向填號。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li><strong>把負速度當作減速：</strong>v &lt; 0 只表示物體往負方向。<strong>修正：</strong>比較 v 與 a 的符號：同號時速率增加，異號時速率減少。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li><strong>把加速度單位寫成 m s⁻¹：</strong>那是速度的單位。<strong>修正：</strong>加速度是每秒的速度改變，單位必為 m s⁻²。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li><strong>混用分鐘與秒：</strong>速度以 m s⁻¹ 表示時，直接代入分鐘會令答案大 60 倍。<strong>修正：</strong>列式前先把所有時間換成 s。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li><strong>把所有運動當成勻加速：</strong>加速度改變的整段運動不能只代一次四條方程。<strong>修正：</strong>按題意分段，或利用圖像給出的資料。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li><strong>把 v–t 圖下面積一律當總路程：</strong>時間軸下方的有向面積是負位移。<strong>修正：</strong>位移按正負相加；總路程則逐段取面積大小再相加。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li><strong>以為最高點 v = 0 便代表 a = 0：</strong>上拋物體在最高點仍受重力。<strong>修正：</strong>忽略空氣阻力時，向上為正便一直取 a = −g。</li> {/* i18n-exempt: zh-Hant editorial content */}
            </ol>
          </section>

          <section className="mt-10" aria-labelledby="dse-question-types">
            <h2 id="dse-question-types" className="text-2xl font-medium text-ink">DSE 常見題型：用作溫習分類，不代表必考</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">可把勻加速題按以下方式練習：由文字資料找出 u、v、a、s、t；從 v–t 圖以斜率求加速度、以面積求位移；以及在鉛直運動中以選定方向處理重力的負號。實際考核內容和題目形式應以考評局當年的公開資料為準。</p> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">當回落時間由二次式求得兩個根時，物理語境會告訴你哪一個是起始時刻、哪一個是所求的後來時刻。若想先複習這種代數判斷，可閱讀本站的<Link href="/dse-maths/question-types/quadratic-discriminant" className="font-medium text-accent underline underline-offset-4">一元二次方程判別式題型教學</Link>。</p> {/* i18n-exempt: zh-Hant editorial content */}
          </section>

          <section className="mt-10 rounded-2xl border border-line p-6" aria-labelledby="official-resources">
            <h2 id="official-resources" className="text-xl font-medium text-ink">官方試題與樣本資源</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-3 leading-8 text-ink-muted">本站的例題是原創教學情境，並非考評局原題。需要核對物理科公開試題、樣本試卷或評核資料時，請使用<ExternalLinkGate href="https://www.hkeaa.edu.hk/en/hkdse/hkdse_subj.html?A2&2&20" platform="HKEAA" className="font-medium text-accent underline underline-offset-4">考評局 HKDSE Physics 官方科目資源頁</ExternalLinkGate>，並以該頁當前提供的資料為準。</p> {/* i18n-exempt: zh-Hant editorial content */}
          </section>

          <section className="mt-10 rounded-2xl border border-accent/30 bg-surface-raised p-6" aria-labelledby="practice-cta">
            <h2 id="practice-cta" className="text-xl font-medium text-ink">整理步驟後，再用物理科題目練習</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-3 leading-8 text-ink-muted">本站目前沒有把這一頁例題或你上載的題目交給 AI 自動生成解題的功能，也不提供機器作文評分。你可先到物理科練習頁，以自己的列式和單位檢查來鞏固概念。</p> {/* i18n-exempt: zh-Hant editorial content */}
            <Link href="/subjects/physics" className="mt-4 inline-flex rounded-xl bg-accent-strong px-4 py-3 font-medium text-white no-underline">前往 DSE Physics 練習</Link> {/* i18n-exempt: zh-Hant editorial content */}
          </section>
        </article>
      </section>
      <RelatedTopics
        topics={[
          { href: '/subjects/physics', title: 'DSE Physics 科目練習', description: '按物理科題目練習運動、力和其他課題。' }, // i18n-exempt: zh-Hant editorial content
          { href: '/notes/physics', title: 'Physics 知識凝結筆記', description: '按課題整理物理科重點與常見陷阱。' }, // i18n-exempt: zh-Hant editorial content
          { href: '/dse-maths/question-types/quadratic-discriminant', title: '一元二次方程判別式', description: '理解鉛直運動時間方程可能出現的兩個根。' }, // i18n-exempt: zh-Hant editorial content
          { href: '/practice', title: '開始全科練習', description: '以短練習檢查自己需要回看的概念。' }, // i18n-exempt: zh-Hant editorial content
        ]}
      />
    </>
  )
}
