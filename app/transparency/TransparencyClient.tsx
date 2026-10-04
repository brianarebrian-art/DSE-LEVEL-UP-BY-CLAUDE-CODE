'use client'

import { ShieldCheck, Database, AlertTriangle } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { FLAGGED } from '@/data/qualityFlags'
import type { RepairStats, WithdrawalBatch } from '@/data/questions/repair-stats'

// 「待核」按介面語言分開計（同 components/QuestionProvenance.tsx 嘅 ZH_FLAGS／EN_FLAGS 一致）。
const PENDING_ZH = Object.values(FLAGGED).filter((f) => f.includes('posref')).length
const PENDING_EN = Object.values(FLAGGED).filter((f) => f.includes('posref-en')).length

// Transparency page — deliberately HONEST. It does NOT claim "not AI-generated" or
// "reviewed by frontline tutors"; the content is alumni + AI co-authored and passes
// automated checks, and we say exactly that. No fabricated provenance.
//
// 2026-09-25: the named review records (decisions.json) were deleted on Yuna's
// instruction, together with the batch table and the "N questions carry a named
// review record" figure that were generated from them. Nothing on this page may
// claim human, line-by-line review again unless new records back it.
//
// 2026-09-29 (Yuna): "follow the style and reasoning of 2012–2025 past papers" was removed.
// Until a lawyer or the HKEAA confirms it, no public text links AI to past papers
// (the HKEAA copyright notice bars use of its publications with AI tools).
// 撤回及修復數字由 server component（page.tsx）經 data/questions/repair-stats.ts 計好傳入，
// 兩個 JSON 檔（約 450KB）因此不會送到瀏覽器。
//
// 2026-09-29 第四次決定（Yuna）：
//   · 兩組數分開寫：「修復」＝已收起的位置式解析題；「候選」＝手寫題庫的位置詞命中。
//     命中不等於有錯（「數列的第二項」是題目內容），混在一起學生會以為全部都錯。
//   · 共收起的總數由程式按題號計聯集，不是把幾批相加。
//   · Yuna 要求用「已修復」；此處用「已改寫」，因為改寫後未經真人內容覆核，
//     不應暗示內容已確認正確（第三次決定：AI 不可自行宣稱解析內容正確）。
export interface ContentCounts {
  totalAuthored: number
  published: number
  withdrawn: number
  withheldTopic: number
  pendingReview: number
}

// Plain-words labels for the withdrawal log. Every key of WITHDRAW_CODES
// (data/questions/hidden-topics.ts) needs a case here (withdrawal-log.test.mts); free-text
// reasons arrive as OTHER and are shown only as the generic label.
function reasonLabel(code: string, en: boolean): string {
  switch (code) {
    case 'POSITIONAL_RATIONALE_REFERENCE':
      return en ? 'The explanation points at an option by its position' : '解析用位置講選項，洗牌之後會指錯'
    default:
      return en ? 'A fault was found in the question' : '題目發現有錯'
  }
}

export default function TransparencyClient({
  stats,
  content,
  withdrawals,
}: {
  stats: RepairStats
  content: ContentCounts
  withdrawals: WithdrawalBatch[]
}) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const WITHDRAWN_COUNT = stats.withdrawnNow
  const stillOut = stats.found - stats.restored
  const c = stats.byCohort
  const k = stats.candidates
  const n = (x: number) => x.toLocaleString()

  const sections = [
    {
      icon: ShieldCheck,
      title: en ? 'How we keep the questions sound' : '我哋點樣確保題目質素',
      points: en
        ? [
            'Every question is co-authored by DSE alumni with AI, then passes automated checks before it goes live.',
            'All items are original rewrites written to DSE question types and assessment points — they are NOT official HKEAA questions, and no official content is copied.',
            'Numeric / calculation questions are verified by parametric brute-force checking.',
            'Spotted a mistake? Tell us and we’ll fix it as soon as we can.',
          ]
        : [
            '每一條題目都由 DSE 舊生 + AI 協作編寫，上線前要通過自動檢查。',
            '全部都係原創改寫，按 DSE 題型同考核重點撰寫 —— 並非 HKEAA 官方試題，亦無複製任何官方內容。',
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
            'The practice performance estimate is worked out from your answers on this site only. It is not a prediction of your HKEAA grade — the HKEAA result is the only one that counts.',
            'Written questions (short answers, long/structured responses) are never machine-marked. You compare your work against a reference answer and mark yourself. Nothing you self-mark counts towards the accuracy figure or the practice performance estimate — those come from multiple-choice answers only.',
            'AI-assisted writing can occasionally slip; if something looks off, please report it.',
          ]
        : [
            '呢啲係改寫練習題，唔係官方試題。要官方歷屆試題，請去 HKEAA 網站。',
            '練習表現估算只根據你喺本站嘅作答計算，唔係考評局成績預測，僅供參考 —— 最終成績以 HKEAA 公布為準。',
            '書寫題（短答、長題／結構式）永遠唔會由機器批改。你對住參考答案自己評，而自評結果【唔會計入】準確率同練習表現估算 —— 嗰兩個數字只由選擇題得出。',
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

      {/* Where the questions come from. The disclosure link under every practice
          question points here. */}
      <section id="provenance" className="mt-12 scroll-mt-20">
        <h2 className="text-2xl font-extrabold mb-3">
          {en ? 'Where the questions come from' : '啲題目點嚟'}
        </h2>
        <p className="text-ink-soft leading-relaxed mb-5">
          {en
            ? 'Every question passes automated gates before it goes live: terminology and written-register checks, structural and difficulty-mix validation, and a format gate that refuses anything with missing materials. These are machine checks, not a person signing off on each question, and we do not claim otherwise.'
            : '每一條題目上線前都要通過自動閘：術語同書面語檢查、結構同難度比例驗證、以及一個材料唔齊就唔畀過嘅格式閘。呢啲係機器檢查，唔係有人逐題簽名 —— 我哋唔會扮有。'}
        </p>
        {/* 2026-09-30（UX 循環 LOOP 12）：講清楚每題有咩、冇咩資料，冇嘅就唔標示。 */}
        <p className="text-ink-soft leading-relaxed mb-5">
          {en
            ? 'Every question has an ID, shown under the explanation after you answer; quote it when you report a problem. Our question records do not store, question by question, which syllabus year a question was checked against or when it was last revised, so we do not show either.'
            : '每條題目都有題號，答完之後喺解析底部見到；報錯時引用題號就得。題目紀錄冇逐題記低對照邊一年嘅課綱、幾時最後修訂，所以題目度唔會標示呢兩樣。'}
        </p>
        {/* 第三個狀態「待核」（2026-09-15）。數字由生成檔即時計，唔寫死 —— 題目修好一條，
            呢度自動少一條。
            2026-09-29（Yuna 決定）：待核題由「照常出題、掛徽章」改為撤回，故刪去原文
            「我哋選擇攤出嚟，而唔係收埋」，並加上撤回段落。 */}
        <p className="text-ink-soft leading-relaxed mb-5">
          {PENDING_ZH + PENDING_EN === 0
            ? en
              ? 'No question is marked “Pending review” at the moment.'
              : '而家冇題目標住「待核」。'
            : en
              ? `${PENDING_EN.toLocaleString()} questions are marked “Pending review” in the English interface and ${PENDING_ZH.toLocaleString()} in the Chinese interface. These are questions where our checks have found a specific problem that a person has not fixed yet: the explanation refers to an option by position, and because options are shuffled every time, that reference may point to the wrong one. The badge says so on the question itself.`
              : `有 ${PENDING_ZH.toLocaleString()} 條題目喺中文介面、${PENDING_EN.toLocaleString()} 條喺英文介面標住「待核」。呢啲係機器已經驗出具體問題、但仲未有人手修正嘅題目：解析用位置講選項，而選項每次都會洗牌，所以嗰句可能指錯。徽章會喺題目度直接講明。`}
        </p>
        {/* 2026-09-30（UX 循環 LOOP 20）：題庫各狀態題數，與首頁、科目頁、練習頁同一來源
            （summary.generated.ts 的 CONTENT_STATS）。四項相加等於已編寫題數，產生器不成立就不寫檔。 */}
        <h3 className="text-base font-bold text-ink mb-2">{en ? 'Where every question stands' : '題庫數字'}</h3>
        <dl className="mb-3 grid grid-cols-2 gap-3 rounded-xl border border-line bg-surface-raised p-4 sm:grid-cols-4">
          <div>
            <dt className="text-xs text-ink-muted">{en ? 'In practice' : '練習中'}</dt>
            <dd className="text-2xl font-medium tabular-nums text-ink">{n(content.published)}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">{en ? 'Withdrawn' : '已收起'}</dt>
            <dd className="text-2xl font-medium tabular-nums text-ink">{n(content.withdrawn)}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">{en ? 'Topic held back' : '課題暫緩'}</dt>
            <dd className="text-2xl font-medium tabular-nums text-ink">{n(content.withheldTopic)}</dd>
          </div>
          <div>
            <dt className="text-xs text-ink-muted">{en ? 'Awaiting a person' : '等人手判斷'}</dt>
            <dd className="text-2xl font-medium tabular-nums text-ink">{n(content.pendingReview)}</dd>
          </div>
        </dl>
        <p className="text-ink-muted text-sm leading-relaxed mb-5">
          {en
            ? `${n(content.totalAuthored)} questions have been written. Each is counted once, so the four figures add up to that total. Only the ones in practice are shown to students; every question count elsewhere on the site is this figure. “Topic held back”: whole topics that are not shown until each question in them is matched to the curriculum guide.`
            : `題庫共編寫咗 ${n(content.totalAuthored)} 條題目，每條只計一次，所以四個數加埋就係呢個總數。只有「練習中」嘅題目會出畀學生，網站其他地方顯示嘅題數都係呢個數。「課題暫緩」：成個課題暫時唔出題，要逐題對返課程指引先會出。`}
        </p>
        {WITHDRAWN_COUNT > 0 && (
          <p className="text-ink-soft leading-relaxed mb-5">
            {en
              ? `${n(WITHDRAWN_COUNT)} questions have been withdrawn and no longer appear in practice. Withdrawn is not deleted: each stays in the bank with the date and reason recorded. ${stillOut === WITHDRAWN_COUNT ? 'All of them were' : `${n(stillOut)} of them were`} withdrawn because the explanation refers to an option by its position (“the second option”, “the last option”). Options are shuffled every time, so those words point at the wrong option, and leaving them in would teach the wrong thing.`
              : `有 ${n(WITHDRAWN_COUNT)} 條題目已經收起，唔會再出現喺練習入面。收起唔係刪除：題目留喺題庫，每條都記低咗收起日期同原因。${stillOut === WITHDRAWN_COUNT ? '全部' : `其中 ${n(stillOut)} 條`}都係因為解析用位置講選項（例如「第二項」「最後一項」「第三個選項」）—— 選項每次都會洗牌，呢啲字眼會指錯，留住只會教錯。`}
          </p>
        )}
        {/* 最近退回紀錄（審計 #7，創辦人 2026-10-04 回覆 A7-3 A）：只列日期、原因、科目及條數，不列題目。 */}
        {withdrawals.length > 0 && (
          <>
            <h3 className="text-base font-bold text-ink mb-2">{en ? 'Recent withdrawals' : '最近退回紀錄'}</h3>
            <p className="text-ink-muted text-sm leading-relaxed mb-3">
              {en
                ? 'Each withdrawal by date and reason, newest first, with the number of questions per subject. The questions themselves are not listed.'
                : '每次退回按日期同原因列出，最新嘅排先，附每科條數。唔會列出題目本身。'}
            </p>
            <ul className="mb-6 space-y-3">
              {withdrawals.map((w) => (
                <li key={`${w.date}-${w.reason}`} className="rounded-xl border border-line bg-surface-raised p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <span className="text-sm font-medium text-ink">
                      <time dateTime={w.date} className="tabular-nums">{w.date}</time> · {reasonLabel(w.reason, en)}
                    </span>
                    <span className="text-sm tabular-nums text-ink-muted">{en ? `${n(w.total)} questions` : `${n(w.total)} 條`}</span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                    {w.subjects.map((x) => `${en ? x.en : x.zh} ${n(x.count)}`).join(en ? ', ' : '、')}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
        {stats.found > 0 && (
          <>
            <h3 className="text-base font-bold text-ink mb-2">{en ? 'Repairing these explanations' : '修復進度'}</h3>
            <dl className="mb-3 grid grid-cols-3 gap-3 rounded-xl border border-line bg-surface-raised p-4 text-center">
              <div>
                <dt className="text-xs text-ink-muted">{en ? 'Total withdrawn' : '共收起'}</dt>
                <dd className="text-2xl font-medium tabular-nums text-ink">{n(stats.found)}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">{en ? 'Rewritten' : '已改寫'}</dt>
                <dd className="text-2xl font-medium tabular-nums text-ink">{n(stats.rewritten)}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">{en ? 'Back in practice' : '已重新上線'}</dt>
                <dd className="text-2xl font-medium tabular-nums text-ink">{n(stats.restored)}</dd>
              </div>
            </dl>
            <p className="text-ink-muted text-sm leading-relaxed mb-6">
              {en
                ? `Found in three rounds, counted by question with none counted twice: ${n(c['positional-first'])} in the first check, ${n(c['positional-machine'])} in the machine-generated banks, ${n(c['positional-handwritten'])} in the hand-written banks. A rewritten question goes back into practice only after a person has reviewed its content.`
                : `分三次發現，按題號計，冇重複：第一次檢查 ${n(c['positional-first'])} 條、機器生成題庫 ${n(c['positional-machine'])} 條、手寫題庫 ${n(c['positional-handwritten'])} 條。已改寫嘅題目要經真人內容覆核，先會重新加入練習池。`}
            </p>
          </>
        )}
        {k.total > 0 && (
          <>
            <h3 className="text-base font-bold text-ink mb-2">{en ? 'Position words in the hand-written banks' : '手寫題庫嘅位置詞'}</h3>
            <p className="text-ink-soft leading-relaxed mb-3">
              {en
                ? `Our check found ${n(k.total)} explanations in the hand-written banks that use a position word. A position word is not always about the options: “the second term of the sequence” is about the question itself and is correct. So each one was sorted, instead of withdrawing them all:`
                : `檢查器喺手寫題庫搵到 ${n(k.total)} 條解析用咗位置詞。但位置詞唔一定係講選項：例如「數列的第二項」講嘅係題目內容，冇錯。所以我哋逐條分類，而唔係一次過全部收起：`}
            </p>
            <dl className="mb-3 grid grid-cols-3 gap-3 rounded-xl border border-line bg-surface-raised p-4 text-center">
              {/* 標籤要短，375px 下每欄約 95px；狀態放在數字下面，三欄數字才對得齊。 */}
              <div>
                <dt className="text-xs text-ink-muted">{en ? 'About an option' : '講選項'}</dt>
                <dd className="text-2xl font-medium tabular-nums text-ink">{n(k.A)}</dd>
                <dd className="text-xs text-ink-muted">{en ? 'withdrawn' : '已收起'}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">{en ? 'About content' : '講題目內容'}</dt>
                <dd className="text-2xl font-medium tabular-nums text-ink">{n(k.B)}</dd>
                <dd className="text-xs text-ink-muted">{en ? 'kept' : '保留'}</dd>
              </div>
              <div>
                <dt className="text-xs text-ink-muted">{en ? 'Unclear' : '未能判斷'}</dt>
                <dd className="text-2xl font-medium tabular-nums text-ink">{n(k.C)}</dd>
                <dd className="text-xs text-ink-muted">{en ? 'held back' : '暫時收起'}</dd>
              </div>
            </dl>
            <p className="text-ink-muted text-sm leading-relaxed mb-5">
              {en
                ? 'Unclear questions are held back from practice until a person has looked at them. New questions may not use position words at all.'
                : '未能判斷嘅題目，喺有人睇過之前暫時唔出題。新題一律唔准用位置詞。'}
            </p>
          </>
        )}
      </section>
    </div>
  )
}
