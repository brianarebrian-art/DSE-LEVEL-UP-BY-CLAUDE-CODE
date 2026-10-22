import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb } from '@/components/Seo/SeoNavigation'
import { JsonLd } from '@/components/Seo/JsonLd'
import { createSeoMetadata, articleJsonLd } from '@/lib/seo'

const h1 = 'DSE Maths 一元二次方程完整筆記' // i18n-exempt: zh-Hant editorial content
const title = 'DSE Maths 一元二次方程完整筆記：因式分解、配方法、公式與驗算 | DSE Level Up' // i18n-exempt: zh-Hant SEO metadata
const description = '本頁以 DSE Maths 一元二次方程為主線，整理標準形式、因式分解、配方法、二次公式與判別式的角色；透過三條原創例題逐步代入、化簡及代回驗算，說明根的和積、常見失誤、參數條件和選法。內容用作概念溫習與自我核對，題型解析為本站原創教學，不是考評局官方歷屆試題、評分參考或必考保證；請按當年課程與題目條件作答。' // i18n-exempt: zh-Hant SEO metadata

export const metadata: Metadata = createSeoMetadata({
  title, // i18n-exempt: zh-Hant SEO metadata
  description, // i18n-exempt: zh-Hant SEO metadata
  path: '/dse-maths/quadratic-equations',
})

const articleStructuredData = articleJsonLd({ title: h1, description, path: '/dse-maths/quadratic-equations' })

export default function QuadraticEquationsPage() {
  return (
    <>
      <Breadcrumb items={[
        { name: '首頁', path: '/' }, // i18n-exempt: zh-Hant editorial content
        { name: 'DSE Maths', path: '/dse-maths' },
        { name: '一元二次方程', path: '/dse-maths/quadratic-equations' }, // i18n-exempt: zh-Hant editorial content
      ]} />
      <section lang="zh-Hant" data-editorial-content className="mx-auto max-w-5xl px-4 py-10">
        <article className="max-w-3xl">
          <JsonLd data={articleStructuredData} />
          <header>
            <p className="text-sm font-medium text-accent">DSE Maths · Algebra</p>
            <h1 className="mt-3 text-4xl font-medium leading-tight text-ink sm:text-5xl">{h1}</h1>
            <p className="mt-5 text-lg leading-8 text-ink-muted">
              解一元二次方程，不是背一條公式便足夠。先把式子整理清楚，再按係數與題目所問選擇方法；最後把每個根代回原式，才知道運算和符號是否一致。 {/* i18n-exempt: zh-Hant editorial content */}
            </p>
          </header>

          <section className="mt-12" aria-labelledby="standard-form">
            <h2 id="standard-form" className="text-2xl font-medium text-ink">先認清標準形式與解題目標</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">
              一元二次方程可寫成 <strong>ax² + bx + c = 0</strong>，其中 <strong>a ≠ 0</strong>。未知數只是一個，而最高次是二次；若 a = 0，便不再是一元二次方程。開始前應把等式一邊整理為 0，合併同類項，並標記 a、b、c。這一步尤其重要，因為公式中的 b 是連同正負號的係數。 {/* i18n-exempt: zh-Hant editorial content */}
            </p>
            <p className="mt-4 leading-8 text-ink-soft">
              「解方程」的目標是找出令左邊等於 0 的所有 x 值。題目若附有長度、時間或指定範圍等條件，代回原方程後還要再核對該條件；代數根未必都是情境中的可接受答案。 {/* i18n-exempt: zh-Hant editorial content */}
            </p>
          </section>

          <section className="mt-10" aria-labelledby="choose-method">
            <h2 id="choose-method" className="text-2xl font-medium text-ink">三種主要求根方法：何時使用？</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <div className="mt-5 overflow-x-auto rounded-xl border border-line">
              <table className="w-full text-left text-sm leading-7">
                <caption className="caption-top px-4 py-3 text-left text-ink-muted">按方程結構選擇解法；每種方法都應以代回作最後檢查。</caption> {/* i18n-exempt: zh-Hant editorial content */}
                <thead className="border-b border-line bg-surface-sunken">
                  <tr>
                    <th scope="col" className="p-3 font-medium text-ink">方法</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <th scope="col" className="p-3 font-medium text-ink">適合情況與步驟</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <th scope="col" className="p-3 font-medium text-ink">常見注意點</th> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-line">
                    <th scope="row" className="p-3 font-medium text-ink">因式分解</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="p-3 text-ink-soft">可拆成兩個一次因式時，寫成 <span className="whitespace-nowrap">(px + q)(rx + s) = 0</span>，再用零乘積性質。</td> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="p-3 text-ink-soft">不可把兩項分別隨意等於 0；必須先得到「乘積為 0」。</td> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                  <tr className="border-b border-line">
                    <th scope="row" className="p-3 font-medium text-ink">配方法</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="p-3 text-ink-soft">把 x 的二次與一次項配成完全平方，能清楚展示式子的結構與頂點關係。</td> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="p-3 text-ink-soft">若先把二次項係數化為 1，等式另一邊也要同時除以該係數。</td> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                  <tr>
                    <th scope="row" className="p-3 font-medium text-ink">二次公式</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="p-3 text-ink-soft"><span className="whitespace-nowrap">x = (−b ± √(b² − 4ac)) / 2a</span>，適合難以整齊分解、仍要精確求根的方程。</td> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="p-3 text-ink-soft">根號內的 <span className="whitespace-nowrap">b² − 4ac</span> 是判別式；分母是整個 2a。</td> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-10" aria-labelledby="factorisation">
            <h2 id="factorisation" className="text-2xl font-medium text-ink">因式分解：先拆中間項，再使用零乘積性質</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">
              面對 ax² + bx + c，可先考慮 a × c，尋找兩個數：乘積是 ac、和是 b，然後拆開 bx 並分組。得到兩個一次因式後，才可令每個因式等於 0。若方程已有公因式，應先提出公因式。 {/* i18n-exempt: zh-Hant editorial content */}
            </p>
            <div className="mt-5 rounded-2xl bg-surface-sunken p-5">
              <h3 className="text-xl font-medium text-ink">例題一：以分組因式分解求根</h3> {/* i18n-exempt: zh-Hant editorial content */}
              <p className="mt-3 leading-8 text-ink-soft">解 <strong>6x² + x − 2 = 0</strong>。</p> {/* i18n-exempt: zh-Hant editorial content */}
              <ol className="mt-3 list-decimal space-y-2 pl-6 leading-8 text-ink-soft">
                <li>a × c = 6 × (−2) = −12；選 4 和 −3，因為 4 + (−3) = 1。</li> {/* i18n-exempt: zh-Hant editorial content */}
                <li>拆中間項：6x² + 4x − 3x − 2 = 0。</li> {/* i18n-exempt: zh-Hant editorial content */}
                <li>分組：2x(3x + 2) − 1(3x + 2) = 0。</li> {/* i18n-exempt: zh-Hant editorial content */}
                <li>提出共同因式：<strong>(2x − 1)(3x + 2) = 0</strong>。</li> {/* i18n-exempt: zh-Hant editorial content */}
                <li>因此 2x − 1 = 0 或 3x + 2 = 0，得到 <strong>x = 1/2 或 x = −2/3</strong>。</li> {/* i18n-exempt: zh-Hant editorial content */}
              </ol>
              <p className="mt-4 leading-8 text-ink-soft"><strong>代回驗算：</strong>當 x = 1/2，6(1/2)² + 1/2 − 2 = 3/2 + 1/2 − 2 = 0；當 x = −2/3，6(−2/3)² − 2/3 − 2 = 24/9 − 6/9 − 18/9 = 0。</p> {/* i18n-exempt: zh-Hant editorial content */}
            </div>
          </section>

          <section className="mt-10" aria-labelledby="completing-square">
            <h2 id="completing-square" className="text-2xl font-medium text-ink">配方法：把二次式改寫成平方</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">
              對 x² + px 來說，加上 <strong>(p/2)²</strong> 便可組成 <strong>(x + p/2)²</strong>。記得這個「補上的數」必須在等式兩邊同時處理；配方法不是把一項憑空移到另一邊。 {/* i18n-exempt: zh-Hant editorial content */}
            </p>
            <div className="mt-5 rounded-2xl bg-surface-sunken p-5">
              <h3 className="text-xl font-medium text-ink">例題二：由淺入深完成平方</h3> {/* i18n-exempt: zh-Hant editorial content */}
              <p className="mt-3 leading-8 text-ink-soft">解 <strong>2x² + 8x − 10 = 0</strong>。</p> {/* i18n-exempt: zh-Hant editorial content */}
              <ol className="mt-3 list-decimal space-y-2 pl-6 leading-8 text-ink-soft">
                <li>各項同除以 2：x² + 4x − 5 = 0。</li> {/* i18n-exempt: zh-Hant editorial content */}
                <li>移項：x² + 4x = 5。</li> {/* i18n-exempt: zh-Hant editorial content */}
                <li>4 的一半是 2，兩邊同加 2²：x² + 4x + 4 = 5 + 4。</li> {/* i18n-exempt: zh-Hant editorial content */}
                <li>化為平方：<strong>(x + 2)² = 9</strong>。</li> {/* i18n-exempt: zh-Hant editorial content */}
                <li>x + 2 = ±3，所以 <strong>x = 1 或 x = −5</strong>。</li> {/* i18n-exempt: zh-Hant editorial content */}
              </ol>
              <p className="mt-4 leading-8 text-ink-soft"><strong>代回驗算：</strong>x = 1 時，2(1)² + 8(1) − 10 = 0；x = −5 時，2(−5)² + 8(−5) − 10 = 50 − 40 − 10 = 0。</p> {/* i18n-exempt: zh-Hant editorial content */}
            </div>
          </section>

          <section className="mt-10" aria-labelledby="quadratic-formula">
            <h2 id="quadratic-formula" className="text-2xl font-medium text-ink">二次公式與判別式：角色不同，不要混為一談</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">
              二次公式直接求出根：<strong>x = (−b ± √(b² − 4ac)) / 2a</strong>。其中 Δ = b² − 4ac 稱為判別式；它告訴你實根的數目和性質，但<strong>判別式本身不是求根方法</strong>。例如知道 Δ &gt; 0，只知道有兩個不同實根，仍要以因式分解、配方法或二次公式找出它們。 {/* i18n-exempt: zh-Hant editorial content */}
            </p>
            <div className="mt-5 rounded-2xl bg-surface-sunken p-5">
              <h3 className="text-xl font-medium text-ink">例題三：用二次公式處理不能整齊分解的方程</h3> {/* i18n-exempt: zh-Hant editorial content */}
              <p className="mt-3 leading-8 text-ink-soft">解 <strong>2x² + 3x − 1 = 0</strong>。</p> {/* i18n-exempt: zh-Hant editorial content */}
              <ol className="mt-3 list-decimal space-y-2 pl-6 leading-8 text-ink-soft">
                <li>辨認 a = 2、b = 3、c = −1。</li> {/* i18n-exempt: zh-Hant editorial content */}
                <li>判別式 Δ = 3² − 4(2)(−1) = 9 + 8 = 17。</li> {/* i18n-exempt: zh-Hant editorial content */}
                <li>代入公式：x = [−3 ± √17] / [2(2)]。</li> {/* i18n-exempt: zh-Hant editorial content */}
                <li>因此 <strong>x = (−3 + √17)/4 或 x = (−3 − √17)/4</strong>。</li> {/* i18n-exempt: zh-Hant editorial content */}
              </ol>
              <p className="mt-4 leading-8 text-ink-soft"><strong>代回驗算：</strong>設 r = (−3 ± √17)/4（兩個符號要同取）。則 r² = (13 ∓ 3√17)/8，所以 2r² + 3r − 1 = (13 ∓ 3√17)/4 + (−9 ± 3√17)/4 − 4/4 = 0。兩個根均令原式成立。</p> {/* i18n-exempt: zh-Hant editorial content */}
            </div>
          </section>

          <section className="mt-10" aria-labelledby="root-properties">
            <h2 id="root-properties" className="text-2xl font-medium text-ink">判別式與根的性質</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <div className="mt-5 overflow-x-auto rounded-xl border border-line">
              <table className="w-full text-left text-sm leading-7">
                <caption className="caption-top px-4 py-3 text-left text-ink-muted">以 Δ = b² − 4ac 判斷實根的數目；一般 DSE 代數語境下以實數範圍理解。</caption> {/* i18n-exempt: zh-Hant editorial content */}
                <thead className="border-b border-line bg-surface-sunken">
                  <tr>
                    <th scope="col" className="p-3 font-medium text-ink">判別式情況</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <th scope="col" className="p-3 font-medium text-ink">實根性質</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <th scope="col" className="p-3 font-medium text-ink">可如何使用</th> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-line">
                    <th scope="row" className="p-3 font-medium text-ink">Δ &gt; 0</th>
                    <td className="p-3 text-ink-soft">兩個不同的實根。</td> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="p-3 text-ink-soft">可用於判斷「兩個不同根」的參數範圍。</td> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                  <tr className="border-b border-line">
                    <th scope="row" className="p-3 font-medium text-ink">Δ = 0</th>
                    <td className="p-3 text-ink-soft">一個重根，即兩根相同。</td> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="p-3 text-ink-soft">可令 b² − 4ac = 0 以建立參數方程。</td> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                  <tr>
                    <th scope="row" className="p-3 font-medium text-ink">Δ &lt; 0</th>
                    <td className="p-3 text-ink-soft">沒有實根。</td> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="p-3 text-ink-soft">可排除要求與 x 軸相交或要求實數解的情況。</td> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-5 leading-8 text-ink-soft">
              若 α、β 是 ax² + bx + c = 0 的兩根，則 <strong>α + β = −b/a</strong>，而 <strong>αβ = c/a</strong>。這兩個關係適合在不必逐個寫出根時使用，例如已知一根、求另一根，或由已知兩根建立方程。若兩根為 α、β，方程可寫成 a(x − α)(x − β) = 0；a 的非零倍數不會改變根。 {/* i18n-exempt: zh-Hant editorial content */}
            </p>
          </section>

          <section className="mt-10" aria-labelledby="common-errors">
            <h2 id="common-errors" className="text-2xl font-medium text-ink">至少先避開這七個常見錯誤</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <div className="mt-5 overflow-x-auto rounded-xl border border-line">
              <table className="w-full text-left text-sm leading-7">
                <caption className="caption-top px-4 py-3 text-left text-ink-muted">把錯誤寫成可檢查的規則，訂正時便知道下一次要看哪一步。</caption> {/* i18n-exempt: zh-Hant editorial content */}
                <thead className="border-b border-line bg-surface-sunken">
                  <tr>
                    <th scope="col" className="p-3 font-medium text-ink">常見錯誤</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <th scope="col" className="p-3 font-medium text-ink">為何不對</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <th scope="col" className="p-3 font-medium text-ink">修正方法</th> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-line"><th scope="row" className="p-3 font-medium text-ink">未整理成等於 0</th><td className="p-3 text-ink-soft">因式分解與二次公式的係數可能讀錯。</td><td className="p-3 text-ink-soft">先移項、合併同類項，再標示 a、b、c。</td></tr> {/* i18n-exempt: zh-Hant editorial content */}
                  <tr className="border-b border-line"><th scope="row" className="p-3 font-medium text-ink">把 Δ 當作答案</th><td className="p-3 text-ink-soft">Δ 只描述根的性質，通常不是 x 的值。</td><td className="p-3 text-ink-soft">用 Δ 判斷後，再選求根方法或解參數條件。</td></tr> {/* i18n-exempt: zh-Hant editorial content */}
                  <tr className="border-b border-line"><th scope="row" className="p-3 font-medium text-ink">把 b = −5 寫成 5</th><td className="p-3 text-ink-soft">公式中的 −b 會由 5 誤成 −5；省略括號也容易把負數平方寫錯。</td><td className="p-3 text-ink-soft">把 b 連同括號寫入：−(−5) 與 (−5)²。</td></tr> {/* i18n-exempt: zh-Hant editorial content */}
                  <tr className="border-b border-line"><th scope="row" className="p-3 font-medium text-ink">公式分母只寫 2</th><td className="p-3 text-ink-soft">公式的分母是 2a，不是 2。</td><td className="p-3 text-ink-soft">先寫成分數線，再把 2a 整體代入分母。</td></tr> {/* i18n-exempt: zh-Hant editorial content */}
                  <tr className="border-b border-line"><th scope="row" className="p-3 font-medium text-ink">漏掉 ±</th><td className="p-3 text-ink-soft">平方根方程可能有兩個根。</td><td className="p-3 text-ink-soft">由 y² = k 寫成 y = ±√k，分別求兩個 x。</td></tr> {/* i18n-exempt: zh-Hant editorial content */}
                  <tr className="border-b border-line"><th scope="row" className="p-3 font-medium text-ink">未得到乘積為 0 便分開求解</th><td className="p-3 text-ink-soft">零乘積性質只適用於 pq = 0。</td><td className="p-3 text-ink-soft">先完整因式分解為兩個因式的乘積等於 0。</td></tr> {/* i18n-exempt: zh-Hant editorial content */}
                  <tr><th scope="row" className="p-3 font-medium text-ink">只核對一個根或忽略範圍</th><td className="p-3 text-ink-soft">另一根可能有符號錯誤，情境題也可能限制 x。</td><td className="p-3 text-ink-soft">每個根均代回原式，並寫出是否符合題設條件。</td></tr> {/* i18n-exempt: zh-Hant editorial content */}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-10" aria-labelledby="dse-question-types">
            <h2 id="dse-question-types" className="text-2xl font-medium text-ink">DSE 常見設問與閱讀重點</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">下列是可用來溫習的常見設問，不代表任何一類必考，也不代替當年課程、試題或評分要求。</p> {/* i18n-exempt: zh-Hant editorial content */}
            <div className="mt-5 overflow-x-auto rounded-xl border border-line">
              <table className="w-full text-left text-sm leading-7">
                <caption className="caption-top px-4 py-3 text-left text-ink-muted">由題目動詞決定先寫哪一條關係式。</caption> {/* i18n-exempt: zh-Hant editorial content */}
                <thead className="border-b border-line bg-surface-sunken"><tr><th scope="col" className="p-3 font-medium text-ink">設問類型</th><th scope="col" className="p-3 font-medium text-ink">解題起點</th></tr></thead> {/* i18n-exempt: zh-Hant editorial content */}
                <tbody>
                  <tr className="border-b border-line"><th scope="row" className="p-3 font-medium text-ink">求解方程</th><td className="p-3 text-ink-soft">整理為 0，按可否因式分解、配平方或二次公式選法。</td></tr> {/* i18n-exempt: zh-Hant editorial content */}
                  <tr className="border-b border-line"><th scope="row" className="p-3 font-medium text-ink">判斷根的數目或重根條件</th><td className="p-3 text-ink-soft">先列 Δ = b² − 4ac，再以 &gt; 0、= 0、&lt; 0 轉成條件。</td></tr> {/* i18n-exempt: zh-Hant editorial content */}
                  <tr className="border-b border-line"><th scope="row" className="p-3 font-medium text-ink">已知一根、求另一根或係數</th><td className="p-3 text-ink-soft">考慮 α + β = −b/a 與 αβ = c/a，必要時代回方程。</td></tr> {/* i18n-exempt: zh-Hant editorial content */}
                  <tr><th scope="row" className="p-3 font-medium text-ink">情境或圖像條件</th><td className="p-3 text-ink-soft">先建立方程，再保留符合長度、時間或題設範圍的解。</td></tr> {/* i18n-exempt: zh-Hant editorial content */}
                </tbody>
              </table>
            </div>
            <p className="mt-5 leading-8 text-ink-soft">
              想集中處理「參數令方程有兩個不同根、重根或沒有實根」的推理，可閱讀<Link href="/dse-maths/question-types/quadratic-discriminant" className="font-medium text-accent underline underline-offset-4">本站原創的判別式參數題解析</Link>；它不是考評局官方歷屆試題或官方評分參考。 {/* i18n-exempt: zh-Hant editorial content */}
            </p>
          </section>

          <section className="mt-10" aria-labelledby="connections">
            <h2 id="connections" className="text-2xl font-medium text-ink">把二次方程連回其他概念</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">
              若想重溫代數符號、因式分解或其他課題，可到<Link href="/notes/math" className="font-medium text-accent underline underline-offset-4">Maths 課題筆記</Link>按主題整理。應用題中，位移公式經代入已知量後有時會變成關於時間的二次方程；這時除了求根，還要保留非負時間。可對照<Link href="/dse-physics/motion-equations" className="font-medium text-accent underline underline-offset-4">運動方程教學</Link>及<Link href="/notes/physics" className="font-medium text-accent underline underline-offset-4">Physics 課題筆記</Link>，分清代數步驟與物理條件。 {/* i18n-exempt: zh-Hant editorial content */}
            </p>
          </section>

          <section className="mt-10 rounded-2xl border border-accent/30 p-6" aria-labelledby="next-step">
            <h2 id="next-step" className="text-xl font-medium text-ink">下一步：先寫步驟，再用工具安排練習</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-3 leading-8 text-ink-soft">先自行選一條方程，寫出你選哪一種方法、每個係數和最終代回。若要了解 AI 練習題生成器的使用方向，可前往相關頁面；<strong>功能狀態：</strong>該頁目前提供使用指引及練習平台入口，本頁不承諾即時生成、機器作文批改或自動評分。</p> {/* i18n-exempt: zh-Hant editorial content */}
            <Link href="/ai/practice-generator" className="mt-4 inline-flex rounded-xl bg-accent-strong px-4 py-3 font-medium text-white">查看 AI 練習題生成器的使用指引</Link> {/* i18n-exempt: zh-Hant editorial content */}
          </section>
        </article>
      </section>
    </>
  )
}
