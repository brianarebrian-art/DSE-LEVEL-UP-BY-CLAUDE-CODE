import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumb, RelatedTopics } from '@/components/Seo/SeoNavigation'
import { JsonLd } from '@/components/Seo/JsonLd'
import { articleJsonLd, createSeoMetadata } from '@/lib/seo'
import ExternalLinkGate from '@/components/ExternalLinkGate'

const h1 = 'DSE English Writing Format：Letter、Article、Report 與 Speech' // i18n-exempt: zh-Hant editorial content
const title = 'DSE English Writing Format：四種文體、語氣與示例 | DSE Level Up' // i18n-exempt: zh-Hant SEO metadata
const description = '這份 DSE English Writing Format 指南按題目指定的讀者、目的與情境，說明 Letter、Article、Report 與 Speech 的格式、語氣、段落功能、連接詞和句式。比較表配合原創大綱與短段示範，並列出錯誤及自評步驟；地址、日期、稱呼與標題須依題目處理，不能背成所有文體的必備規則。' // i18n-exempt: zh-Hant SEO metadata

export const metadata: Metadata = createSeoMetadata({ title, description, path: '/dse-english/writing-format' })

export default function WritingFormatPage() {
  return <>
    <Breadcrumb items={[{ name: '首頁', path: '/' }, { name: 'DSE English', path: '/dse-english' }, { name: 'Writing format', path: '/dse-english/writing-format' }]} /> {/* i18n-exempt: zh-Hant editorial content */}
    <section lang="zh-Hant" data-editorial-content className="mx-auto max-w-5xl px-4 py-10">
      <article className="max-w-3xl">
        <JsonLd data={articleJsonLd({ title: h1, description, path: '/dse-english/writing-format' })} />
        <header>
          <p className="text-sm font-medium text-accent">DSE English Language · Writing</p>
          <h1 className="mt-3 text-4xl font-medium leading-tight text-ink sm:text-5xl">{h1}</h1>
          <p className="mt-5 text-lg leading-8 text-ink-muted">格式的作用不是把文章變成同一個模樣，而是讓讀者立刻看出你在向誰說話、為何而寫，以及每一段如何完成題目交代的任務。</p> {/* i18n-exempt: zh-Hant editorial content */}
        </header>

        <section className="mt-10" aria-labelledby="format-first">
          <h2 id="format-first" className="text-2xl font-medium text-ink">先讀題目，再選擇格式</h2> {/* i18n-exempt: zh-Hant editorial content */}
          <p className="mt-4 leading-8 text-ink-soft">寫作題先圈出四項資料：你的身分、讀者、寫作目的和必須回應的重點。這些資料決定你要採用的稱呼、語氣、例子和結尾行動。文體名稱只提供方向；若題目指定刊物、收件人、演講場合、標題、資料或版面，指定要求必須優先。</p> {/* i18n-exempt: zh-Hant editorial content */}
          <p className="mt-4 leading-8 text-ink-soft">以考評局的 <ExternalLinkGate className="font-medium text-accent underline underline-offset-4" href="https://www.hkeaa.edu.hk/DocLibrary/HKDSE/Subject_Information/eng_lang/2028hkdse-e-elang-9d8.pdf" platform="HKEAA">2028 English Language Assessment Framework</ExternalLinkGate> 為例，寫作考核包括按不同情境、讀者和目的寫作，並以恰當的語氣、文體和體裁特徵組織意思。該文件列出 Paper 2 為兩小時，短引導寫作約 200 字、較開放的長寫作約 400 字。這些是理解任務規模的資料，不是可取代當年題目指示的格式清單。</p> {/* i18n-exempt: zh-Hant editorial content */}
        </section>

        <section className="mt-10" aria-labelledby="format-comparison">
          <h2 id="format-comparison" className="text-2xl font-medium text-ink">Letter、Article、Report 與 Speech 怎樣分？</h2> {/* i18n-exempt: zh-Hant editorial content */}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm leading-7">
              <caption className="mb-3 text-left text-ink-muted">四種常見文體的讀者、結構與語氣比較；實際格式以題目情境為準。</caption> {/* i18n-exempt: zh-Hant editorial content */}
              <thead>
                <tr className="border-y border-line bg-surface-sunken">
                  <th scope="col" className="p-3 font-medium text-ink">文體</th> {/* i18n-exempt: zh-Hant editorial content */}
                  <th scope="col" className="p-3 font-medium text-ink">讀者與目的</th> {/* i18n-exempt: zh-Hant editorial content */}
                  <th scope="col" className="p-3 font-medium text-ink">可見結構</th> {/* i18n-exempt: zh-Hant editorial content */}
                  <th scope="col" className="p-3 font-medium text-ink">語氣與句式</th> {/* i18n-exempt: zh-Hant editorial content */}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-line align-top">
                  <th scope="row" className="p-3 font-medium text-ink">Letter / Email</th>
                  <td className="p-3">向特定收件人提出建議、投訴、查詢、致謝或交代事情。</td> {/* i18n-exempt: zh-Hant editorial content */}
                  <td className="p-3">依關係選稱呼、開首、主體段落和結語。地址、日期、署名或電郵欄位只在題目情境要求時處理。</td> {/* i18n-exempt: zh-Hant editorial content */}
                  <td className="p-3">對校長或機構宜清楚而有禮；對熟人可較親切，但仍須完成目的。</td> {/* i18n-exempt: zh-Hant editorial content */}
                </tr>
                <tr className="border-b border-line align-top">
                  <th scope="row" className="p-3 font-medium text-ink">Article</th>
                  <td className="p-3">為報章、校刊、網站或學生讀者分享觀點、經驗或建議。</td> {/* i18n-exempt: zh-Hant editorial content */}
                  <td className="p-3">題目指定時可有吸引而準確的標題；開首建立話題，中段逐點發展，結尾留下可記住的訊息。</td> {/* i18n-exempt: zh-Hant editorial content */}
                  <td className="p-3">可直接與讀者對話或提出問題，但不可為了活潑而犧牲清楚和相關性。</td> {/* i18n-exempt: zh-Hant editorial content */}
                </tr>
                <tr className="border-b border-line align-top">
                  <th scope="row" className="p-3 font-medium text-ink">Report</th>
                  <td className="p-3">向委員會、學校或負責人整理調查、觀察、問題及建議。</td> {/* i18n-exempt: zh-Hant editorial content */}
                  <td className="p-3">以清楚標題和小標題分開背景、發現、分析與建議；每個部分只處理一項工作。</td> {/* i18n-exempt: zh-Hant editorial content */}
                  <td className="p-3">較客觀、精確；以觀察或資料支持結論，避免把情緒化口號當證據。</td> {/* i18n-exempt: zh-Hant editorial content */}
                </tr>
                <tr className="align-top">
                  <th scope="row" className="p-3 font-medium text-ink">Speech</th>
                  <td className="p-3">向現場聽眾動員、勸說、提醒、感謝或分享立場。</td> {/* i18n-exempt: zh-Hant editorial content */}
                  <td className="p-3">以適合場合的問候開場，讓聽眾知道主題；用提示語帶領要點，最後重申行動或訊息。</td> {/* i18n-exempt: zh-Hant editorial content */}
                  <td className="p-3">像對人說話般自然，可使用呼籲、反問或重複重點；正式程度仍須配合場合。</td> {/* i18n-exempt: zh-Hant editorial content */}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="paragraph-structure">
          <h2 id="paragraph-structure" className="text-2xl font-medium text-ink">段落架構：每段完成一個讀者看得見的任務</h2> {/* i18n-exempt: zh-Hant editorial content */}
          <p className="mt-4 leading-8 text-ink-soft">不論文體如何變化，讀者都要辨認你的重點和理由。把每個 bullet point 變成一個段落任務，而不是把所有想法堆在同一段。段數沒有固定答案；題目要求較多、論點需要比較時，自然要留出更多空間。</p> {/* i18n-exempt: zh-Hant editorial content */}
          <ol className="mt-5 list-decimal space-y-3 pl-6 leading-8 text-ink-soft">
            <li><strong className="text-ink">開首：</strong>交代情境和目的。Letter 可直接說明來信原因；Article 可由讀者熟悉的情況切入；Speech 可先問候聽眾再點題。</li> {/* i18n-exempt: zh-Hant editorial content */}
            <li><strong className="text-ink">發展段：</strong>先提出一個清楚觀點，再說明原因、例子或後果。若只重複立場，讀者看不見你如何推論。</li> {/* i18n-exempt: zh-Hant editorial content */}
            <li><strong className="text-ink">回應題目重點：</strong>逐一核對必答內容。遇到兩個相近重點，也要清楚顯示它們各自已被處理。</li> {/* i18n-exempt: zh-Hant editorial content */}
            <li><strong className="text-ink">結尾：</strong>回到目的，提出合理的下一步、建議、邀請或總結。不要只因為背了句子就突然加入與題目無關的客套話。</li> {/* i18n-exempt: zh-Hant editorial content */}
          </ol>
        </section>

        <section className="mt-10" aria-labelledby="connectors-and-sentences">
          <h2 id="connectors-and-sentences" className="text-2xl font-medium text-ink">連接詞與句式：先說清關係，才追求變化</h2> {/* i18n-exempt: zh-Hant editorial content */}
          <p className="mt-4 leading-8 text-ink-soft">連接詞不是裝飾。選詞前先問：下一句是補充、因果、對比，還是例證？同一個字反覆出現，通常代表段落之間的關係尚未想清楚。</p> {/* i18n-exempt: zh-Hant editorial content */}
          <dl className="mt-5 space-y-4 text-ink-soft">
            <div className="rounded-xl bg-surface-sunken p-5"><dt className="font-medium text-ink">補充：<span lang="en">Furthermore, ... / In addition, ...</span></dt><dd className="mt-2 leading-7">用於新增同方向的理由：<span lang="en">Furthermore, the scheme would give students a quiet place to exchange books.</span></dd></div> {/* i18n-exempt: zh-Hant editorial content */}
            <div className="rounded-xl bg-surface-sunken p-5"><dt className="font-medium text-ink">因果：<span lang="en">As a result, ... / Therefore, ...</span></dt><dd className="mt-2 leading-7">前句必須真的是原因：<span lang="en">The signs are unclear. As a result, visitors often enter the wrong room.</span></dd></div> {/* i18n-exempt: zh-Hant editorial content */}
            <div className="rounded-xl bg-surface-sunken p-5"><dt className="font-medium text-ink">對比：<span lang="en">However, ... / Although ..., ...</span></dt><dd className="mt-2 leading-7">承認限制後再推進論點：<span lang="en">Although the plan needs volunteers, each class could take turns once a month.</span></dd></div> {/* i18n-exempt: zh-Hant editorial content */}
            <div className="rounded-xl bg-surface-sunken p-5"><dt className="font-medium text-ink">例證：<span lang="en">For example, ... / This can be seen when ...</span></dt><dd className="mt-2 leading-7">用具體情況支持前句，而不是另開一個沒有關係的新主題。</dd></div> {/* i18n-exempt: zh-Hant editorial content */}
          </dl>
          <p className="mt-5 leading-8 text-ink-soft">句式也應服務意思。<span lang="en">This would not only reduce waste, but also make the campus easier to use.</span> 同時交代兩個效果；<span lang="en">If the school provides a booking form, students can reserve a time slot in advance.</span> 則清楚呈現條件和結果。完成初稿後，可到 <Link className="font-medium text-accent underline underline-offset-4" href="/notes/english">English 課題筆記</Link> 集中溫習時態、主謂一致、詞語搭配和常見語境。</p> {/* i18n-exempt: zh-Hant editorial content */}
        </section>

        <section className="mt-10" aria-labelledby="original-model">
          <h2 id="original-model" className="text-2xl font-medium text-ink">原創示範：先完成大綱，再寫出一小段</h2> {/* i18n-exempt: zh-Hant editorial content */}
          <p className="mt-4 leading-8 text-ink-soft">以下題目、大綱和段落均為本站原創教學示例，不是考評局試題、官方範文或可直接套用的答案。</p> {/* i18n-exempt: zh-Hant editorial content */}
          <div className="mt-5 rounded-2xl border border-line bg-surface-raised p-6">
            <h3 className="text-xl font-medium text-ink">示範題目：在學校早會發表 Speech</h3> {/* i18n-exempt: zh-Hant editorial content */}
            <p lang="en" className="mt-3 leading-8 text-ink-soft">You are the chairperson of the Green Club. Give a speech at the school assembly to encourage students to reduce single-use plastic at school.</p>
            <h4 className="mt-6 text-lg font-medium text-ink">完整大綱</h4> {/* i18n-exempt: zh-Hant editorial content */}
            <ol className="mt-3 list-decimal space-y-2 pl-6 leading-8 text-ink-soft">
              <li>問候校長、老師和同學，點出校園午飯時間常見的即棄膠樽和餐具。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li>說明問題：垃圾桶很快裝滿，清潔同學需要額外時間分類。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li>提出第一項可行行動：自備水樽，在指定位置補水。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li>提出第二項可行行動：在小食部選擇不附即棄餐具的選項，並說明如何幫助減少浪費。</li> {/* i18n-exempt: zh-Hant editorial content */}
              <li>結尾重申「由下一個午飯開始」的行動，感謝聽眾並作簡潔呼籲。</li> {/* i18n-exempt: zh-Hant editorial content */}
            </ol>
            <h4 className="mt-6 text-lg font-medium text-ink">短段示範</h4> {/* i18n-exempt: zh-Hant editorial content */}
            <p lang="en" className="mt-3 rounded-xl bg-surface-sunken p-5 leading-8 text-ink-soft">Good morning, Principal, teachers and fellow students. By the end of lunch break, the bins near the canteen are often filled with plastic bottles and cutlery. This waste does not disappear when we leave the canteen; it has to be sorted and collected. From today, we can make one simple change: bring a reusable bottle and refill it at school.</p>
            <p className="mt-4 leading-8 text-ink-soft">這段先建立共同看見的情境，再說明影響，最後提出第一個行動。它沒有急於塞入所有論點，因此聽眾可跟上後文的安排。</p> {/* i18n-exempt: zh-Hant editorial content */}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="common-format-mistakes">
          <h2 id="common-format-mistakes" className="text-2xl font-medium text-ink">常見格式錯誤：格式正確也不能代替內容</h2> {/* i18n-exempt: zh-Hant editorial content */}
          <ul className="mt-5 list-disc space-y-3 pl-6 leading-8 text-ink-soft">
            <li><strong className="text-ink">把地址、日期或固定稱呼當成每題必寫：</strong>先看題目有否要求；不合情境的資料會令文章看似背誦，而非回應任務。</li> {/* i18n-exempt: zh-Hant editorial content */}
            <li><strong className="text-ink">只有漂亮開首，沒有清楚目的：</strong>首段應讓讀者知道你要建議、報告、勸說還是分享，而不只展示句式。</li> {/* i18n-exempt: zh-Hant editorial content */}
            <li><strong className="text-ink">語氣忽然轉換：</strong>向正式讀者提出建議時，避免下一句改用聊天式俚語；Speech 親切不等於隨意。</li> {/* i18n-exempt: zh-Hant editorial content */}
            <li><strong className="text-ink">為了像 Report 而堆滿小標題：</strong>只有當文體和任務需要分類資訊時才使用；每個小標題下仍要有完整內容。</li> {/* i18n-exempt: zh-Hant editorial content */}
            <li><strong className="text-ink">以連接詞取代推理：</strong><span lang="en">Therefore</span> 之前若沒有原因，讀者不會因為一個字而接受結論。</li> {/* i18n-exempt: zh-Hant editorial content */}
          </ul>
        </section>

        <section className="mt-10 rounded-2xl bg-surface-sunken p-6" aria-labelledby="self-review">
          <h2 id="self-review" className="text-2xl font-medium text-ink">寫完後的自評次序</h2> {/* i18n-exempt: zh-Hant editorial content */}
          <ol className="mt-4 list-decimal space-y-3 pl-6 leading-8 text-ink-soft">
            <li>回到題目，把每項要求旁邊標記它在文章哪一段出現。</li> {/* i18n-exempt: zh-Hant editorial content */}
            <li>逐段問：「這一段對讀者有甚麼作用？」若答不出，補上觀點、理由或例子。</li> {/* i18n-exempt: zh-Hant editorial content */}
            <li>最後才檢查文法、拼字、標點、代詞指向和連接詞是否真的表達原意。</li> {/* i18n-exempt: zh-Hant editorial content */}
          </ol>
          <p className="mt-4 leading-8 text-ink-soft">考評局的 <ExternalLinkGate className="font-medium text-accent underline underline-offset-4" href="https://www.hkeaa.edu.hk/en/hkdse/assessment/subject_information/category_a_subjects/eng_lang/faq_q/q4.html" platform="HKEAA">Paper 2 FAQ</ExternalLinkGate> 說明，字數提示有助考生安排任務、時間、規劃和校對；明顯少於或多於建議字數都可能影響完成任務的能力。把校對留到最後，正是為了先確保內容和組織已回應題目。</p> {/* i18n-exempt: zh-Hant editorial content */}
        </section>

        <section className="mt-10 rounded-2xl border border-accent/30 p-6" aria-labelledby="ai-essay-feedback">
          <h2 id="ai-essay-feedback" className="text-xl font-medium text-ink">尋找 AI Essay Feedback？</h2> {/* i18n-exempt: zh-Hant editorial content */}
          <p className="mt-2 leading-7 text-ink-muted">本站目前不提供 AI 作文評分、機器作文評分、分數預測或官方閱卷。完成草稿後，請改用寫作自評清單，按題目要求、組織和語言逐項檢查，再配合教師回饋訂正。</p> {/* i18n-exempt: zh-Hant editorial content */}
          <Link href="/writing" className="mt-4 inline-flex rounded-xl bg-accent-strong px-4 py-3 font-medium text-white">前往英文寫作自評清單</Link> {/* i18n-exempt: zh-Hant editorial content */}
        </section>
      </article>
    </section>
    <RelatedTopics topics={[
      { href: '/dse-english', title: 'DSE English 學習路線', description: '從讀者、目的和語氣開始，安排閱讀、寫作與自評練習。' }, // i18n-exempt: zh-Hant editorial content
      { href: '/notes/english', title: 'English 課題筆記', description: '整理英文科課題，溫習詞彙、文法與語境的基本功。' }, // i18n-exempt: zh-Hant editorial content
      { href: '/reading', title: '閱讀材料與詞彙學習', description: '在閱讀中觀察作者如何按讀者、目的和語氣組織意思。' }, // i18n-exempt: zh-Hant editorial content
    ]} />
  </>
}
