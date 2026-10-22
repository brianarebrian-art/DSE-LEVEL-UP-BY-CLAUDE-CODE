import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb, InternalLinkCard } from '@/components/Seo/SeoNavigation'
import { JsonLd } from '@/components/Seo/JsonLd'
import { articleJsonLd, createSeoMetadata } from '@/lib/seo'
import ExternalLinkGate from '@/components/ExternalLinkGate'

const h1 = 'DSE Maths 二次方程判別式題型解析（非官方題解）' // i18n-exempt: zh-Hant editorial content
const description = '以原創參數題逐步拆解 DSE Maths 二次方程判別式：辨認係數、由 Δ 的正負判斷根的數目、解參數不等式並代入驗算；另附兩題相似原創練習、常見失分提醒、二次方程筆記與練習入口，說明本站不轉載考評局試題或建立年份／試卷／題號路由，方便按概念自學及核對下一步。亦同時說明重根、實根與二次項係數的檢查。' // i18n-exempt: zh-Hant SEO metadata

export const metadata: Metadata = createSeoMetadata({
  title: 'DSE Maths 二次方程判別式題型解析：原創參數題與驗算 | DSE Level Up', // i18n-exempt: zh-Hant SEO metadata
  description, // i18n-exempt: zh-Hant SEO metadata
  path: '/dse-maths/question-types/quadratic-discriminant',
  type: 'article',
})

export default function QuadraticDiscriminantQuestionTypePage() {
  return (
    <>
      <Breadcrumb
        items={[
          { name: '首頁', path: '/' }, // i18n-exempt: zh-Hant editorial content
          { name: 'DSE Maths', path: '/dse-maths' },
          { name: h1, path: '/dse-maths/question-types/quadratic-discriminant' },
        ]}
      />
      <section lang="zh-Hant" data-editorial-content className="mx-auto max-w-5xl px-4 py-10">
        <article className="max-w-3xl">
          <JsonLd data={articleJsonLd({ title: h1, description, path: '/dse-maths/question-types/quadratic-discriminant' })} />
          <header>
            <p className="text-sm font-medium text-accent">DSE Maths · Number and Algebra · 原創題型解析</p> {/* i18n-exempt: zh-Hant editorial content */}
            <h1 className="mt-3 text-4xl font-medium leading-tight text-ink sm:text-5xl">{h1}</h1>
            <p className="mt-5 text-lg leading-8 text-ink-muted">參數題不必先把兩個根完全求出。先把方程整理成標準形式，以判別式描述根的情況，再把條件翻成參數範圍；最後用一個符合條件和一個不符合條件的數值驗算。</p> {/* i18n-exempt: zh-Hant editorial content */}
          </header>

          <section className="mt-12 rounded-2xl border border-line bg-surface-raised p-6" aria-labelledby="original-scope">
            <h2 id="original-scope" className="text-2xl font-medium text-ink">先釐清：這是原創題型解析，不是官方題解</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">本站沒有獲授權轉載考評局官方原題、年份、試卷內容或題號答案，因此不會建立以 <code>/year/paper/q</code> 形式指向官方題目的路由。以下問題、數字和解法步驟均為本站自行編寫，只用來練習「由判別式判斷根的性質」這個概念，不能當作任何官方評分參考。</p> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">如要查閱課程及官方資源，請使用考評局的<ExternalLinkGate className="text-accent underline underline-offset-4" href="https://www.hkeaa.edu.hk/en/hkdse/assessment/subject_information/category_b_subjects/hkdse_subj.html?A1&1&4" platform="HKEAA">數學科資料頁</ExternalLinkGate>；該頁列出 Assessment Framework、Curriculum and Assessment Guide 及其他資源。閱讀官方材料時，請自行確認適用考試年度與版本。</p> {/* i18n-exempt: zh-Hant editorial content */}
          </section>

          <section className="mt-12" aria-labelledby="what-is-tested">
            <h2 id="what-is-tested" className="text-2xl font-medium text-ink">這類參數題考甚麼？</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">題目會以一個字母控制二次方程的係數，要求你判斷何時有兩個不同實根、一個重根，或沒有實根。重點不是背誦三個結論，而是把「根的數目」精準配對到判別式的等式或不等式。</p> {/* i18n-exempt: zh-Hant editorial content */}
            <div className="mt-5 overflow-x-auto rounded-xl border border-line">
              <table className="w-full text-left text-sm leading-7 text-ink-soft">
                <caption className="caption-top px-4 py-3 text-left text-ink-muted">判別式參數題的概念、涉及章節與作答要求</caption> {/* i18n-exempt: zh-Hant editorial content */}
                <thead className="bg-surface-sunken text-ink">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">題目語句</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <th scope="col" className="px-4 py-3 font-medium">必須建立的條件</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <th scope="col" className="px-4 py-3 font-medium">涉及章節</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <th scope="col" className="px-4 py-3 font-medium">作答時要寫出</th> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-line">
                    <th scope="row" className="px-4 py-3 font-medium text-ink">兩個不同實根</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="px-4 py-3">Δ &gt; 0</td>
                    <td className="px-4 py-3">一元二次方程、實數根</td> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="px-4 py-3">代入 Δ = b² − 4ac，並解出嚴格不等式</td> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                  <tr className="border-t border-line">
                    <th scope="row" className="px-4 py-3 font-medium text-ink">一個重根</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="px-4 py-3">Δ = 0</td>
                    <td className="px-4 py-3">一元二次方程、因式分解</td> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="px-4 py-3">列等式、求參數，並可代回確認平方因式</td> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                  <tr className="border-t border-line">
                    <th scope="row" className="px-4 py-3 font-medium text-ink">沒有實根</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="px-4 py-3">Δ &lt; 0</td>
                    <td className="px-4 py-3">一元二次方程、實數範圍</td> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="px-4 py-3">說明結論是「沒有實根」，不是「沒有解」</td> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="worked-example">
            <h2 id="worked-example" className="text-2xl font-medium text-ink">代表性原創參數題：先判斷根，再處理 p</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <div className="mt-5 rounded-2xl bg-surface-sunken p-6 text-ink-soft">
              <p><strong className="text-ink">題目：</strong>設 p 為實數。求 p 的範圍，使方程 <strong className="text-ink">x² − 2(p + 1)x + (p − 1)² = 0</strong> 有兩個不同實根。</p> {/* i18n-exempt: zh-Hant editorial content */}
            </div>
            <ol className="mt-6 list-decimal space-y-4 pl-6 leading-8 text-ink-soft">
              <li><strong className="text-ink">辨認係數：</strong>a = 1、b = −2(p + 1)、c = (p − 1)²。這一步先把括號連同負號保留，避免把 b 誤寫成 2(p + 1)。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li><strong className="text-ink">把題目語句翻成判別式條件：</strong>「兩個不同實根」表示 Δ &gt; 0。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li><strong className="text-ink">代入並逐行化簡：</strong><br />Δ = [−2(p + 1)]² − 4(1)(p − 1)²<br />= 4(p + 1)² − 4(p − 1)²<br />= 4[(p² + 2p + 1) − (p² − 2p + 1)]<br />= 16p。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li><strong className="text-ink">解參數不等式：</strong>16p &gt; 0，所以 <strong className="text-ink">p &gt; 0</strong>。由於 16 為正數，除以 16 時不等號方向不變。</li> {/* i18n-exempt: zh-Hant editorial content */}
            </ol>
          </section>

          <section className="mt-12" aria-labelledby="verification">
            <h2 id="verification" className="text-2xl font-medium text-ink">用代入檢查結論，而不是只看最後一行</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">已得出 p &gt; 0，現在各取一個正數、零和負數。這種核對可檢查你是否把「不同實根」誤當成「至少一個實根」。</p> {/* i18n-exempt: zh-Hant editorial content */}
            <div className="mt-5 overflow-x-auto rounded-xl border border-line">
              <table className="w-full text-left text-sm leading-7 text-ink-soft">
                <caption className="caption-top px-4 py-3 text-left text-ink-muted">以三個 p 值驗算 Δ = 16p 的結論</caption> {/* i18n-exempt: zh-Hant editorial content */}
                <thead className="bg-surface-sunken text-ink">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-medium">代入的 p 值</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <th scope="col" className="px-4 py-3 font-medium">方程與判別式</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <th scope="col" className="px-4 py-3 font-medium">根的情況</th> {/* i18n-exempt: zh-Hant editorial content */}
                    <th scope="col" className="px-4 py-3 font-medium">是否符合 p &gt; 0</th> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-line">
                    <th scope="row" className="px-4 py-3 font-medium text-ink">p = 2</th>
                    <td className="px-4 py-3">x² − 6x + 1 = 0，Δ = 32</td> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="px-4 py-3">兩個不同實根</td> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="px-4 py-3">符合</td> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                  <tr className="border-t border-line">
                    <th scope="row" className="px-4 py-3 font-medium text-ink">p = 0</th>
                    <td className="px-4 py-3">x² − 2x + 1 = 0，Δ = 0</td> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="px-4 py-3">一個重根</td> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="px-4 py-3">不符合</td> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                  <tr className="border-t border-line">
                    <th scope="row" className="px-4 py-3 font-medium text-ink">p = −1</th>
                    <td className="px-4 py-3">x² + 4 = 0，Δ = −16</td> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="px-4 py-3">沒有實根</td> {/* i18n-exempt: zh-Hant editorial content */}
                    <td className="px-4 py-3">不符合</td> {/* i18n-exempt: zh-Hant editorial content */}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="mistakes">
            <h2 id="mistakes" className="text-2xl font-medium text-ink">常見失分位：每一個都會改變參數範圍</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <ul className="mt-5 list-disc space-y-3 pl-6 leading-8 text-ink-soft">
              <li><strong className="text-ink">把「不同」漏掉：</strong>題目要求兩個不同實根時，條件是 Δ &gt; 0；寫成 Δ ≥ 0 會把重根錯誤包括在答案內。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li><strong className="text-ink">只平方 2，沒有平方整個 b：</strong>b 是 −2(p + 1)，所以 b² = [−2(p + 1)]²，而不是 −4(p + 1)。先加方括號可減少符號錯誤。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li><strong className="text-ink">在展開平方差時遺漏負號：</strong>減去 (p − 1)² 時，括號內每一項都受減號影響；先完整寫括號，再合併同類項。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li><strong className="text-ink">忘記先確認仍是二次方程：</strong>若參數位於 a，必須同時寫 a ≠ 0。例如 tx² − 4x + 1 = 0 在 t = 0 時已變成一次方程，不能用二次方程的根數結論處理。</li> {/* i18n-exempt: zh-Hant editorial content */}
            </ul>
          </section>

          <section className="mt-12" aria-labelledby="similar-questions">
            <h2 id="similar-questions" className="text-2xl font-medium text-ink">兩題相似原創題與解法</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <div className="mt-5 space-y-6">
              <section className="rounded-2xl border border-line p-6" aria-labelledby="similar-one">
                <h3 id="similar-one" className="text-xl font-medium text-ink">相似題一：重根條件會給出兩個參數值嗎？</h3> {/* i18n-exempt: zh-Hant editorial content */}
                <p className="mt-3 leading-8 text-ink-soft"><strong className="text-ink">題目：</strong>求 m 的值，使 x² + (m − 3)x + m = 0 有一個重根。</p> {/* i18n-exempt: zh-Hant editorial content */}
                <p className="mt-3 leading-8 text-ink-soft"><strong className="text-ink">解法：</strong>一個重根表示 Δ = 0。故 (m − 3)² − 4m = 0，整理得 m² − 10m + 9 = 0，即 (m − 1)(m − 9) = 0。因此 <strong className="text-ink">m = 1 或 m = 9</strong>。代回後分別是 (x − 1)² = 0 與 (x + 3)² = 0，兩個值都符合。</p> {/* i18n-exempt: zh-Hant editorial content */}
              </section>
              <section className="rounded-2xl border border-line p-6" aria-labelledby="similar-two">
                <h3 id="similar-two" className="text-xl font-medium text-ink">相似題二：二次項係數也含有參數時</h3> {/* i18n-exempt: zh-Hant editorial content */}
                <p className="mt-3 leading-8 text-ink-soft"><strong className="text-ink">題目：</strong>求 t 的範圍，使 tx² − 4x + 1 = 0 有兩個不同實根。</p> {/* i18n-exempt: zh-Hant editorial content */}
                <p className="mt-3 leading-8 text-ink-soft"><strong className="text-ink">解法：</strong>先保留二次方程身分：t ≠ 0。再用 Δ &gt; 0：16 − 4t &gt; 0，得 t &lt; 4。兩個條件要同時成立，因此答案是 <strong className="text-ink">t &lt; 4 且 t ≠ 0</strong>。t = 0 雖使 16 − 4t 為正，但原式已不是二次方程，所以必須剔除。</p> {/* i18n-exempt: zh-Hant editorial content */}
              </section>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="related-concepts">
            <h2 id="related-concepts" className="text-2xl font-medium text-ink">相關概念：何時用判別式，何時改用其他工具？</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">若問題只問根的數目、實根與否或重根條件，判別式通常最快。若題目要求求出根的實際數值，仍要在 Δ 的基礎上使用因式分解、配方法或二次公式。從圖像看，Δ &gt; 0、Δ = 0、Δ &lt; 0 分別對應拋物線與 x 軸有兩個交點、相切或沒有交點；這是檢查結論的另一種語言，不是另一條公式。</p> {/* i18n-exempt: zh-Hant editorial content */}
          </section>

          <section className="mt-12 rounded-2xl bg-surface-sunken p-6" aria-labelledby="calculator-check">
            <h2 id="calculator-check" className="text-2xl font-medium text-ink">計數機只用來核對，不代替條件推導</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">在 Casio fx-50FH II 或 3650P 的 Program 功能中，可把參數輸入值存作 A，計算 16A 來核對本例的判別式；例如 A = 2 應顯示 32，A = 0 應顯示 0。程式的輸出只驗證個別代入值，不能代替由 16p &gt; 0 推得 p &gt; 0 的不等式步驟。不同機型的編輯與執行操作請以該機說明書為準。</p> {/* i18n-exempt: zh-Hant editorial content */}
          </section>

          <section className="mt-12 rounded-2xl border border-accent/30 p-6" aria-labelledby="sensei-cta">
            <h2 id="sensei-cta" className="text-2xl font-medium text-ink">用 SENSEI 先查核概念，再自己完成計算</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-3 leading-8 text-ink-soft">SENSEI 是本站的 AI 學習助手，只會檢索已由真人審核的知識卡，不會自行生成答案，也不會為長答或作文評分。若你想先重溫概念用語，可查找已有的數學知識卡；本題的推導與驗算仍應由你自行完成。</p> {/* i18n-exempt: zh-Hant editorial content */}
            <Link href="/sensei" className="mt-5 inline-flex rounded-xl bg-accent-strong px-5 py-3 font-medium text-white">開啟 SENSEI，檢索已審核的數學知識卡</Link> {/* i18n-exempt: zh-Hant editorial content */}
          </section>

          <section className="mt-12 rounded-2xl border border-line p-6" aria-labelledby="copyright-note">
            <h2 id="copyright-note" className="text-2xl font-medium text-ink">版權與試題來源說明</h2> {/* i18n-exempt: zh-Hant editorial content */}
            <p className="mt-4 leading-8 text-ink-soft">© DSE Level Up 2026. Not affiliated with HKEAA. All questions are independently rewritten for educational purposes.</p>
            <p className="mt-4 leading-8 text-ink-soft">本平台提供之試題均為獨立改寫版本，旨在協助考生練習應試技巧，並非香港考試及評核局（HKEAA）官方試題。官方歷屆試題請前往 HKEAA 網站下載。練習表現估算僅供參考，最終成績以 HKEAA 公布為準。</p> {/* i18n-exempt: zh-Hant editorial content */}
          </section>
        </article>

        <section className="mt-12" aria-labelledby="next-learning">
          <h2 id="next-learning" className="text-2xl font-medium text-ink">下一步：按卡住的位置選擇內容</h2> {/* i18n-exempt: zh-Hant editorial content */}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <InternalLinkCard href="/dse-maths/quadratic-equations" title="重溫一元二次方程三種解法" description="先釐清因式分解、公式法和判別式各自適用的問題，再回來處理參數條件。" /> {/* i18n-exempt: zh-Hant editorial content */}
            <InternalLinkCard href="/notes/math" title="瀏覽 Maths 課題筆記" description="按課題重溫數學概念與常見陷阱，為下一組原創練習建立基礎。" /> {/* i18n-exempt: zh-Hant editorial content */}
            <InternalLinkCard href="/subjects/math" title="進入 Maths 原創練習題" description="完成題庫練習後核對解析，記下是符號、條件還是計算步驟需要重做。" /> {/* i18n-exempt: zh-Hant editorial content */}
            <InternalLinkCard href="/dse-physics/motion-equations" title="延伸閱讀物理運動方程教學" description="比較代數中整理條件的做法，如何用在物理量、單位與方程的關係上。" /> {/* i18n-exempt: zh-Hant editorial content */}
          </div>
        </section>
      </section>
    </>
  )
}
