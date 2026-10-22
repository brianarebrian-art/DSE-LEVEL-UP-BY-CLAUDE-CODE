import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb, RelatedTopics } from '@/components/Seo/SeoNavigation'
import { JsonLd } from '@/components/Seo/JsonLd'
import { createSeoMetadata, softwareApplicationJsonLd } from '@/lib/seo'
import { SITE_ORIGIN } from '@/lib/site'

const path = '/ai/practice-generator'
const visibleH1 = 'AI 生成個人化 DSE 練習題' // i18n-exempt: zh-Hant editorial content
const title = 'AI 生成個人化 DSE 練習題：題庫使用指南 | DSE Level Up' // i18n-exempt: zh-Hant SEO metadata
const description = '本頁說明 DSE Level Up 現有題庫如何按科目、課題與練習模式抽題，列出可用網址參數、資料處理和功能限制。網站目前沒有讓學生輸入 prompt 即時生成新題的 API；AI 任意生成與作文自動評分均不支援。請使用現有題庫練習、查看解析並自行核對，勿把抽樣結果視為即時 AI 產出或教師評語；請以題庫設定為準。' // i18n-exempt: zh-Hant SEO metadata

export const metadata: Metadata = createSeoMetadata({ title, description, path, noIndex: true })

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: visibleH1,
  description, // i18n-exempt: zh-Hant SEO metadata
  mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_ORIGIN}${path}` },
  url: `${SITE_ORIGIN}${path}`,
  inLanguage: 'zh-HK',
}

export default function PracticeGeneratorPage() {
  return (
    <>
      <Breadcrumb items={[{ name: '首頁', path: '/' }, { name: visibleH1, path }]} /> {/* i18n-exempt: zh-Hant editorial content */}
      <JsonLd data={articleJsonLd} />
      <JsonLd data={softwareApplicationJsonLd({
        name: 'DSE 練習題庫', // i18n-exempt: zh-Hant editorial content
        description: 'DSE Level Up 的現有題庫練習應用，按科目、課題及練習模式抽取多項選擇題或書寫題。', // i18n-exempt: zh-Hant SEO metadata
        path: '/practice',
      })} />

      <section lang="zh-Hant" data-editorial-content className="mx-auto max-w-5xl px-4 py-10">
        <article className="max-w-3xl">
          <header>
            <p className="text-sm font-medium text-accent">DSE 題庫使用指南</p> {/* i18n-exempt: zh-Hant editorial content */}
            <h1 className="mt-3 text-4xl font-medium leading-tight text-ink sm:text-5xl">{visibleH1}</h1>
            <p className="mt-5 rounded-2xl border border-line bg-surface-sunken p-5 text-base leading-8 text-ink-soft">
              <strong className="text-ink">Draft／功能受阻：</strong> {/* i18n-exempt: zh-Hant editorial content */}
              本網站目前沒有讓學生即時輸入 prompt 生成新題的 API。此頁不是生成器，而是現有 DSE 題庫的需求說明與使用指南；從題庫抽取題目的結果，不能稱為即時 AI 生成。 {/* i18n-exempt: zh-Hant editorial content */}
            </p>
          </header>

          <section className="mt-12" aria-labelledby="meaning-of-personalisation">
            <h2 id="meaning-of-personalisation" className="text-2xl font-medium text-ink">先把「個人化」說清楚</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">
              溫習時常見的困難，不是單純缺少一題，而是「英文很弱」或「二次方程常錯」仍然太籠統；隨意取得一題又未必能對應課題。現有練習流程以已入庫的題目、科目 id 和課題 id 縮小範圍，讓學生從明確的內容開始，而不是向模型索取一條無法追溯來源的新題。 {/* i18n-exempt: zh-Hant editorial content */}
            </p>
            <ul className="mt-5 list-disc space-y-3 pl-6 leading-7 text-ink-soft">
              <li>選定科目和課題後，系統只會從相符的現有題庫中抽題；不會依照自然語言提示另寫題目。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li>一般選擇題練習預設為 10 題，按基礎、普通、拔尖約 3：5：2 的比例選取；若某難度的存題不足，才從其餘題目補足。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li>已有練習紀錄時，<code>mode=weakness</code> 只會優先排列較弱課題的既有題目；它不會診斷學生的文字描述，也不會產生新內容。</li> {/* i18n-exempt: zh-Hant editorial content */}
            </ul>
          </section>

          <section className="mt-12" aria-labelledby="available-routes">
            <h2 id="available-routes" className="text-2xl font-medium text-ink">目前可用的練習網址與輸出</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">
              練習頁直接讀取網址參數：<code>subject</code> 選科目，<code>topic</code> 必須是該科已註冊的精確課題 id。沒有 <code>difficulty</code> 參數；難度比例由練習流程處理。未識別的 <code>mode</code> 會回到一般練習，<code>size</code> 只有值為 <code>1</code> 時才會開啟單題練習。 {/* i18n-exempt: zh-Hant editorial content */}
            </p>
            <div className="mt-5 overflow-x-auto rounded-2xl border border-line">
              <table className="w-full border-collapse text-left text-sm leading-6">
                <caption className="caption-top px-5 py-4 text-left text-base font-medium text-ink">已核對的科目、課題與模式示例</caption> {/* i18n-exempt: zh-Hant editorial content */}
                <thead className="bg-surface-sunken text-ink">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">學習需要</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <th scope="col" className="px-5 py-3 font-medium">可用輸入</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <th scope="col" className="px-5 py-3 font-medium">實際輸出</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <th scope="col" className="px-5 py-3 font-medium">不會提供</th> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line text-ink-soft">
                  <tr>
                    <th scope="row" className="px-5 py-4 font-medium text-ink">數學：二次方程</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="px-5 py-4"><code>subject=math&amp;topic=quadratic_equations</code></td>
                    <td className="px-5 py-4">從數學科同一課題的既有選擇題抽取。</td> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="px-5 py-4">按 prompt 新寫的二次方程題。</td> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                  <tr>
                    <th scope="row" className="px-5 py-4 font-medium text-ink">英文：文法</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="px-5 py-4"><code>subject=english&amp;topic=grammar</code></td>
                    <td className="px-5 py-4">從英文文法的既有選擇題抽取。</td> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="px-5 py-4">由學生錯句即時改寫出的全新試題。</td> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                  <tr>
                    <th scope="row" className="px-5 py-4 font-medium text-ink">物理：力學</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="px-5 py-4"><code>subject=physics&amp;topic=mechanics</code></td>
                    <td className="px-5 py-4">從物理力學的既有選擇題抽取。</td> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="px-5 py-4">依個人描述即時計算並生成新題。</td> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                  <tr>
                    <th scope="row" className="px-5 py-4 font-medium text-ink">書寫題對照</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="px-5 py-4"><code>subject=math&amp;mode=long</code></td>
                    <td className="px-5 py-4">獨立載入該科已有的 text／long 題；指定課題未必有書寫題。</td> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="px-5 py-4">AI 為長答或作文批改、打分或評分。</td> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                  <tr>
                    <th scope="row" className="px-5 py-4 font-medium text-ink">按既有表現重排</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="px-5 py-4"><code>subject=math&amp;mode=weakness</code></td>
                    <td className="px-5 py-4">把較弱課題的現有題目排在較前位置。</td> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="px-5 py-4">AI 學習診斷、任意內容生成或成績保證。</td> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="bank-example">
            <h2 id="bank-example" className="text-2xl font-medium text-ink">可覆核的題庫示例，不是即時 AI 結果</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">
              以數學題庫條目 <code>math_quad_1</code> 為例，題幹要求解 <strong>x² − 4x + 3 = 0</strong>。它可因式分解為 <strong>(x − 1)(x − 3) = 0</strong>，所以兩個根是 <strong>x = 1</strong> 和 <strong>x = 3</strong>。代回原式：1 − 4 + 3 = 0，而 9 − 12 + 3 = 0，兩者均成立。 {/* i18n-exempt: zh-Hant editorial content */}
            </p>
            <p className="mt-4 leading-8 text-ink-soft">
              這個例子用來展示題庫內已有內容可如何核對；它不是在本頁或練習頁輸入指令後生成的答案。練習介面會洗牌選項的顯示次序，但不會把此題改寫為新的個人化題目。 {/* i18n-exempt: zh-Hant editorial content */}
            </p>
          </section>

          <section className="mt-12" aria-labelledby="how-to-use">
            <h2 id="how-to-use" className="text-2xl font-medium text-ink">把需求轉成可執行的練習</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <ol className="mt-5 space-y-4 leading-8 text-ink-soft">
              <li><strong className="text-ink">1. 先選範圍。</strong> 從科目開始；若已知道弱點，再加上精確的課題 id。不要把自然語言願望當作網站可處理的 prompt。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li><strong className="text-ink">2. 做現有題庫中的題。</strong> 先自行作答，再閱讀解析，核對自己是概念、審題還是運算出現問題。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li><strong className="text-ink">3. 以同一範圍重練。</strong> 想集中課題便保留 <code>topic</code>；想按已記錄的較弱課題排序，才使用 <code>mode=weakness</code>。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li><strong className="text-ink">4. 對書寫答案自行核對。</strong> 書寫題會提供現有參考內容作對照，但系統不會對作文或長答作 AI 評分。</li> {/* i18n-exempt: zh-Hant editorial content */}
            </ol>
            <Link href="/practice?subject=math&topic=quadratic_equations" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-accent-strong px-5 py-3 font-medium text-on-accent hover:bg-accent-hover">
              開始數學二次方程題庫練習 {/* i18n-exempt: zh-Hant editorial content */}
            </Link>
          </section>

          <section className="mt-12" aria-labelledby="related-guides">
            <h2 id="related-guides" className="text-2xl font-medium text-ink">可配合使用的規劃與拆題指南</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">如需先安排可執行的溫習步驟，可閱讀手動規劃指南；如需練習拆解題目條件，可閱讀原創拆題流程。兩者均是固定教學內容，並不提供 AI 生成、診斷或評分功能。</p> {/* i18n-exempt: zh-Hant editorial content */}
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/ai/study-plan" className="inline-flex min-h-11 items-center rounded-xl border border-line px-4 py-3 font-medium text-accent underline underline-offset-4">查看手動規劃溫習指南</Link> {/* i18n-exempt: zh-Hant editorial content */}
              <Link href="/ai/past-paper-explainer" className="inline-flex min-h-11 items-center rounded-xl border border-line px-4 py-3 font-medium text-accent underline underline-offset-4">閱讀原創拆題流程</Link> {/* i18n-exempt: zh-Hant editorial content */}
            </div>
          </section>

          <section className="mt-12 rounded-2xl border border-line bg-surface-sunken p-6" aria-labelledby="not-supported">
            <h2 id="not-supported" className="text-2xl font-medium text-ink">本頁不提供的 AI 功能</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <ul className="mt-4 list-disc space-y-3 pl-6 leading-8 text-ink-soft">
              <li><strong className="text-ink">AI 任意生成：</strong>不支援輸入題目要求、情境或 prompt 後即時產生新題，因為網站沒有相應 API。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li><strong className="text-ink">AI 作文或長答評分：</strong>不支援提交答案後由機器批改、打分、評分或預測成績；請以參考答案、課本和教師指導作核對。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li><strong className="text-ink">生成器軟件聲稱：</strong>本頁的 SoftwareApplication 結構化資料只描述現有的 <code>/practice</code> 題庫練習應用，並不把本指南或不存在的生成器標記為應用程式。</li> {/* i18n-exempt: zh-Hant editorial content */}
            </ul>
          </section>

          <section className="mt-12" aria-labelledby="privacy">
            <h2 id="privacy" className="text-2xl font-medium text-ink">資料處理：先知道，再決定是否登入</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">
              本頁沒有 prompt 輸入框，因此不會收集「要求 AI 出題」的文字。現行私隱政策說明：不登入時，練習分數、錯題課題及設定預設保留在瀏覽器；登入是為了跨裝置同步，並只同步政策列出的進度和設定資料。學生自行寫下的寫作草稿不會因此變成可供 AI 評分的資料。 {/* i18n-exempt: zh-Hant editorial content */}
            </p>
            <p className="mt-4 leading-8 text-ink-soft">
              題庫來源與學習資料是兩回事：題庫可由網站載入作練習，個人作答紀錄則依登入狀態及私隱政策處理。使用前應以網站私隱政策的完整清單為準，而非把本頁視作私隱承諾的替代品。 {/* i18n-exempt: zh-Hant editorial content */}
            </p>
          </section>

          <section className="mt-12" aria-labelledby="faq">
            <h2 id="faq" className="text-2xl font-medium text-ink">常見問題</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <dl className="mt-5 space-y-6 text-ink-soft">
              <div>
                <dt className="font-medium text-ink">我可以輸入「為我生成十條 DSE 題目」嗎？</dt> {/* i18n-exempt: zh-Hant editorial content */}
                <dd className="mt-2 leading-8">不可以。網站目前沒有接受 prompt 並即時生成新題的 API；請以 <code>subject</code> 和可用的 <code>topic</code> 從題庫選取範圍。</dd> {/* i18n-exempt: zh-Hant editorial content */}
              </div>
              <div>
                <dt className="font-medium text-ink">系統會按我選的難度出題嗎？</dt> {/* i18n-exempt: zh-Hant editorial content */}
                <dd className="mt-2 leading-8">目前沒有 <code>difficulty</code> 網址參數。一般選擇題由練習流程按既定難度比例抽取，並非由 AI 依指令編排難度。</dd> {/* i18n-exempt: zh-Hant editorial content */}
              </div>
              <div>
                <dt className="font-medium text-ink">書寫題或作文可以交給 AI 批改嗎？</dt> {/* i18n-exempt: zh-Hant editorial content */}
                <dd className="mt-2 leading-8">不可以。<code>mode=long</code> 只會載入已有書寫題；沒有自動批改、打分或評分功能，應對照參考內容並尋求教師回饋。</dd> {/* i18n-exempt: zh-Hant editorial content */}
              </div>
              <div>
                <dt className="font-medium text-ink">「較弱課題優先模式」會生成新的補救題嗎？</dt> {/* i18n-exempt: zh-Hant editorial content */}
                <dd className="mt-2 leading-8">不會。它只根據已有練習紀錄調整現有題目的優先次序；沒有歷史紀錄時，也不會以文字猜測你的弱點。</dd> {/* i18n-exempt: zh-Hant editorial content */}
              </div>
              <div>
                <dt className="font-medium text-ink">未登入時，我的作答資料在哪裡？</dt> {/* i18n-exempt: zh-Hant editorial content */}
                <dd className="mt-2 leading-8">預設保留在你的瀏覽器。登入後才可依私隱政策同步指定的進度與設定；本頁不會把不存在的 AI prompt 資料上傳。</dd> {/* i18n-exempt: zh-Hant editorial content */}
              </div>
            </dl>
          </section>
        </article>
      </section>

      <RelatedTopics topics={[
        { href: '/practice?subject=english&topic=grammar', title: 'English Grammar 題庫練習', description: '以已註冊的 english 與 grammar 參數開始現有選擇題練習。' }, // i18n-exempt: zh-Hant editorial content
        { href: '/practice?subject=physics&topic=mechanics', title: '物理力學題庫練習', description: '以 physics 與 mechanics 從現有物理題庫抽取練習題。' }, // i18n-exempt: zh-Hant editorial content
        { href: '/notes/math?topic=quadratic_equations', title: '數學二次方程筆記', description: '先整理二次方程的概念與常見陷阱，再回到題庫練習。' }, // i18n-exempt: zh-Hant editorial content
        { href: '/notes/physics?topic=mechanics', title: '物理力學筆記', description: '閱讀力學重點，配合既有物理題庫進行自我核對。' }, // i18n-exempt: zh-Hant editorial content
      ]} />
    </>
  )
}
