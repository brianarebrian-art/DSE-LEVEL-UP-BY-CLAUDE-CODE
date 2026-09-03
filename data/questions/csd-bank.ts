import type { Question, Difficulty } from './types'
import { createBank, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// csd-bank.ts —— 公民與社會發展參數化母模板・第一批（2026-09-03）
// ---------------------------------------------------------------------------
// 本科現為 190 條、分佈 10–22，十一個課題全部遠低於每課題 91 的目標。
//
// ══ 本科的出題原則比其他科更嚴 ══
// 公社科的內容涉及憲制、國家發展與公共政策。一條由迴圈生成的
// 「某年某項政策令某指標上升 X%」，即使數字看似合理，也是虛構統計 ——
// 憲章 §8 明文禁止；而且一旦寫錯，錯的不只是一條題，是向十二至十八歲的
// 學生傳遞了一個假事實。
//
// 故本檔【一條真實世界的政策、數據或評價都不斷言】，一律採用兩種結構：
//   甲・假設情境：題幹明寫「假設」，數字純為推理素材，答案由題幹算得出
//   乙・方法判斷：問的是分析方法本身（持份者分析怎樣做、資料支持到甚麼
//       程度、概念如何界定），與任何具體立場無關
// 這不是迴避，而是貼題 —— 本科三個核心課題（資料回應、多角度評鑑、
// 概念應用）考的本來就是方法。既有的 csd-floor-b2.ts 亦是同一路數。
//
// ⚠️ 本檔不出「哪一方立場正確」這類題。多角度評鑑考的是【權衡的結構】，
// 不是替學生決定立場；替學生決定立場的題目，本身就違反該課題的旨趣。
//
// ⚠️ 八條累積教訓（同日十役），開工前先寫下：
//   ① 誘答必須互不相同【且代數上不恆等】（ICT DC2、生物 GE2）。
//   ② 每個迴圈變數【必須出現在題幹】（音樂 HA1）。
//   ③ 補量用值域寬的數值參數，不要用固定枚舉表（音樂第一版只出 152 條）。
//   ④ 迴圈相乘：三層各加一值即八倍，不是加三。
//   ⑤ 改完即量度，不要改完九個才跑一次（旅遊與款待 380 → 1049）。
//   ⑥ 一個模板的組合空間有上限時，要加的是【模板】而不是取值。
//   ⑦ 英文動詞只可用三態相異的不規則動詞（英文科）。
//   ⑧ 【英文科新增】引用了迴圈變數【不等於】輸出會變 ——
//      字面 .replace() 若在部分資料條目中找不到目標字串，那幾條就會
//      整批輸出相同。佔位符必須每條都存在，並在缺失時直接拋錯。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  data: { id: 'csd_data_response', zh: '資料回應・數據詮釋', en: 'Data response · interpretation' },
  stake: { id: 'csd_stakeholder_eval', zh: '多角度評鑑・持份者權衡', en: 'Multi-perspective · stakeholders' },
  concept: { id: 'csd_concept_apply', zh: '概念應用・當代世界', en: 'Concept application' },
  society: { id: 'hk_society', zh: '香港社會與參與', en: 'Hong Kong society & participation' },
  inter: { id: 'interdependence', zh: '互聯相依的世界', en: 'An interdependent world' },
  sustain: { id: 'sustainability', zh: '可持續發展與公共衞生', en: 'Sustainability & public health' },
  constitution: { id: 'hk_constitution', zh: '「一國兩制」與憲制秩序', en: 'One country, two systems' },
  law: { id: 'hk_rule_of_law', zh: '法治、權利與責任', en: 'Rule of law, rights & duties' },
  global: { id: 'globalization', zh: '經濟全球化', en: 'Economic globalisation' },
  tech: { id: 'china_tech_power', zh: '科技創新與綜合國力', en: 'Innovation & national strength' },
  reform: { id: 'china_reform', zh: '改革開放與國家發展', en: 'Reform, opening up & development' },
} satisfies Record<string, TopicMeta>

const FW = {
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
} satisfies Record<string, FwMeta>

const b = createBank('csd')
const diff = (i: number): Difficulty => (i % 10 < 3 ? 'easy' : i % 10 < 8 ? 'medium' : 'hard')

// ── 共用假設素材 ────────────────────────────────────────────────────────
// 全部是【虛構】的地名與範疇，刻意不用任何真實城市或機構名稱，
// 以免一條推理練習被讀成一項事實陳述。
const PLACES = [
  { zh: '甲市', en: 'City A' },
  { zh: '乙市', en: 'City B' },
  { zh: '丙市', en: 'City C' },
  { zh: '丁市', en: 'City D' },
  { zh: '戊市', en: 'City E' },
  { zh: '己市', en: 'City F' },
  { zh: '庚市', en: 'City G' },
  { zh: '辛市', en: 'City H' },
]
const YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]

// ── 模板一：資料回應・數據詮釋 ──────────────────────────────────────────
// 題幹給兩個數字，只有一個結論由資料支持；三個誘答分別代表三種
// 最常見的過度推論：把變化當總量、無中生有的比較、憑空補上因果。
PLACES.forEach((pl, pi) => {
  YEARS.forEach((yr, yi) => {
    const i = pi * YEARS.length + yi
    const before = 120 + pi * 25 + yi * 15
    const after = before + 30 + yi * 8
    const rise = after - before
    const pct = Math.round((rise / before) * 100)
    b.add(
      `csd_dr_${pi}_${yi}`,
      T.data,
      FW.logic,
      diff(i),
      [
        `【假設資料】某研究記錄${pl.zh}的社區中心使用人次：${yr - 1} 年為 ${before} 萬人次，${yr} 年為 ${after} 萬人次。資料本身足以支持以下哪一項結論？`,
        `[Hypothetical data] A study records community-centre visits in ${pl.en}: ${before} × 10,000 in ${yr - 1}, rising to ${after} × 10,000 in ${yr}. Which conclusion does the data alone support?`,
      ],
      [
        [`使用人次在該年間增加了 ${rise} 萬，即約 ${pct}%`, `Visits rose by ${rise} × 10,000 over the year, about ${pct} per cent`],
        [`該市居民對社區服務的滿意程度提高了 ${pct}%`, `Residents' satisfaction with community services rose by ${pct} per cent`],
        [`該市是同期人次增幅最大的城市`, `${pl.en} had the largest increase of any city in the period`],
        [`人次上升是因為該年新增了社區中心`, `The rise happened because new centres opened that year`],
      ],
      [
        `資料回應題的第一步，是分清【資料說了甚麼】與【我以為資料說了甚麼】。此處資料只有兩個人次數字，所以能算的只有變化：${after} − ${before} = ${rise} 萬，約 ${pct}%。說「滿意程度提高」是把使用量當成滿意度 —— 人次上升也可能是因為別處服務減少；說「增幅最大」需要其他城市的數字，資料並無提供；說「因為新增中心」是替資料補上一個它沒有給的原因。三個誘答正是本科最常見的三種過度推論：以指標代替概念、無中生有的比較、憑空補上因果。`,
        `The first move in a data-response question is to separate what the data says from what you assume it says. Here there are two visit figures, so the only thing calculable is the change: ${after} − ${before} = ${rise} × 10,000, about ${pct} per cent. "Satisfaction rose" swaps usage for satisfaction — visits can rise because services elsewhere were cut. "Largest increase" needs figures for other cities that the data does not give. "Because new centres opened" supplies a cause the data does not state. These are the three commonest over-readings in this subject: an indicator standing in for a concept, an invented comparison, and an invented cause.`,
      ],
    )
  })
})

// ── 模板二：多角度評鑑・持份者權衡 ──────────────────────────────────────
// ⚠️ 不問「哪一方正確」，只問【權衡的結構】是否描述準確。
const TRADEOFFS = [
  { issue: '延長公共圖書館開放時間', en: 'extending public library opening hours', a: '夜間使用者', aEn: 'evening users', b: '館內員工', bEn: 'library staff', cost: '輪班與人手成本', costEn: 'shift patterns and staffing costs' },
  { issue: '在舊區加建單車徑', en: 'adding cycle lanes in an old district', a: '通勤騎行者', aEn: 'commuting cyclists', b: '沿路店舖', bEn: 'shops along the route', cost: '路旁上落貨空間', costEn: 'kerbside loading space' },
  { issue: '把一幅空置校舍改作社區用途', en: 'converting a vacant school site to community use', a: '附近居民', aEn: 'nearby residents', b: '財政部門', bEn: 'the finance department', cost: '長期維修開支', costEn: 'long-term maintenance costs' },
  { issue: '在公園實施夜間靜音時段', en: 'introducing a quiet period in a park at night', a: '毗鄰住戶', aEn: 'adjoining households', b: '夜間運動組織', bEn: 'evening sports groups', cost: '可用活動時間', costEn: 'available activity hours' },
  { issue: '把部分街道改為行人專用', en: 'pedestrianising some streets', a: '步行者與商戶', aEn: 'pedestrians and retailers', b: '需要駕車到達的長者', bEn: 'older people who need to arrive by car', cost: '無障礙接送安排', costEn: 'accessible drop-off arrangements' },
  { issue: '收緊建築工地的噪音時限', en: 'tightening noise limits on building sites', a: '周邊居民', aEn: 'surrounding residents', b: '承建商與工人', bEn: 'contractors and workers', cost: '工期與工資', costEn: 'schedules and wages' },
  { issue: '增加回收設施的收集頻次', en: 'increasing collection frequency for recycling', a: '參與回收的住戶', aEn: 'households that recycle', b: '清潔服務預算', bEn: 'the cleansing budget', cost: '車隊與人手', costEn: 'fleet and manpower' },
  { issue: '為小型商戶提供租金資助', en: 'subsidising rent for small traders', a: '受助商戶', aEn: 'assisted traders', b: '未受助的同業', bEn: 'traders outside the scheme', cost: '競爭是否公平', costEn: 'fairness of competition' },
  { issue: '在校園引入手機存放規定', en: 'introducing phone storage rules on campus', a: '希望減少干擾的教師', aEn: 'teachers seeking fewer interruptions', b: '需要即時聯絡的家長', bEn: 'parents needing to make contact', cost: '緊急聯絡途徑', costEn: 'emergency contact routes' },
]
TRADEOFFS.forEach((t, ti) => {
  PLACES.forEach((pl, pi) => {
    const i = ti * PLACES.length + pi
    b.add(
      `csd_se_${ti}_${pi}`,
      T.stake,
      FW.apply,
      diff(i),
      [
        `【假設情境】${pl.zh}正考慮${t.issue}。${t.a}普遍支持，${t.b}則關注${t.cost}。以下哪一項最準確地描述這個權衡？`,
        `[Hypothetical] ${pl.en} is considering ${t.en}. ${t.aEn} are broadly in favour; ${t.bEn} are concerned about ${t.costEn}. Which statement describes the trade-off most accurately?`,
      ],
      [
        [`得益集中於${t.a}，而代價主要由${t.b}承擔，兩者需要同時納入評估`, `The benefit falls mainly on ${t.aEn} while the cost falls mainly on ${t.bEn}; an assessment must weigh both`],
        [`由於支持的一方人數較多，該方案應當直接推行`, `Since more people are in favour, the proposal should simply go ahead`],
        [`${t.b}的關注屬於技術問題，不需要在政策評估中處理`, `The concern of ${t.bEn} is merely technical and need not enter the policy assessment`],
        [`只要沒有人反對得很激烈，就代表這個權衡並不存在`, `If no one objects strongly, there is no trade-off to speak of`],
      ],
      [
        `多角度評鑑的核心是【看清楚得益與代價各自落在誰身上】，而不是替任何一方下判詞。此處得益集中於${t.a}、代價集中於${t.b}，兩者都要入數，評估才算完整。三個誤答各自代表一種常見的評鑑失誤：以人數多寡取代理據（少數人可能承受極大代價，而人數與受影響程度是兩回事）、把一方的關注貶為「技術問題」而剔出議程、以及把「無人大聲反對」誤讀為「沒有代價」。留意本題並沒有問哪一方正確 —— 替學生決定立場，本身就違反這個課題的旨趣。`,
        `Multi-perspective evaluation turns on seeing exactly where the benefits and the costs land, not on ruling for one side. Here the benefit is concentrated on ${t.aEn} and the cost on ${t.bEn}; an assessment is complete only when both are counted. Each distractor is a familiar failure: substituting head-count for reasons (a minority can bear a very large cost, and numbers are not the same as depth of impact), dismissing one side's concern as "merely technical" and removing it from the agenda, and reading "nobody objected loudly" as "there is no cost". Note that the question does not ask which side is right — deciding that for the student would defeat the purpose of the topic.`,
      ],
    )
  })
})

// ── 模板三：概念應用・當代世界 ──────────────────────────────────────────
// 題幹先寫死定義，再問哪一個案例符合。定義由題幹提供，不靠背誦。
const CONCEPTS = [
  { term: '機會成本', en: 'opportunity cost', def: '為取得某項選擇而放棄的、價值最高的另一項選擇', defEn: 'the value of the best alternative given up in making a choice', fit: '把周末的八小時用於補習，因而放棄了原可賺取的兼職收入', fitEn: 'spending eight weekend hours on tutoring, thereby giving up the part-time pay those hours could have earned', bad: ['支付補習費用所用的現金金額', '補習之後成績是否真的提升', '同學普遍認為補習是否值得'], badEn: ['the cash paid out in tutoring fees', 'whether results actually improved after the tutoring', 'whether classmates generally think tutoring is worth it'] },
  { term: '可持續發展', en: 'sustainable development', def: '滿足當代需要，同時不損害後代滿足其需要的能力', defEn: 'meeting present needs without compromising the ability of future generations to meet theirs', fit: '以更新速度為上限開採一項再生資源，使存量不致下降', fitEn: 'harvesting a renewable resource no faster than it replenishes, so the stock does not fall', bad: ['以最快速度開採資源以換取即時的高收益', '把資源全部封存，任何一代都不得使用', '只要當代人一致同意，即可視為可持續'], badEn: ['extracting as fast as possible for immediate high returns', 'sealing off the resource so that no generation may use it', 'treating unanimity among the present generation as sufficient'] },
  { term: '全球化', en: 'globalisation', def: '商品、資本、人口與資訊跨越國界流動的程度不斷加深', defEn: 'the deepening cross-border flow of goods, capital, people and information', fit: '一件產品的設計、零件與組裝分別在三地完成，再運往第四地銷售', fitEn: 'a product designed, sourced and assembled in three different places, then sold in a fourth', bad: ['一個地方的居民比以往更常光顧本地店舖', '一個國家提高關稅以減少入口', '一個城市的人口在境內由鄉村遷往市區'], badEn: ['residents shopping more often at local stores than before', 'a country raising tariffs to reduce imports', 'people moving from countryside to city within one country'] },
  { term: '公民參與', en: 'civic participation', def: '公民透過制度內的途徑影響公共事務的決定', defEn: 'citizens influencing decisions on public affairs through established channels', fit: '就一項諮詢文件在限期前提交書面意見', fitEn: 'submitting written views on a consultation paper before the deadline', bad: ['在社交平台瀏覽有關該議題的貼文', '與家人在飯桌上討論該議題', '認為該議題重要但沒有採取任何行動'], badEn: ['scrolling posts about the issue on social media', 'discussing the issue with family over dinner', 'believing the issue matters but taking no action'] },
  { term: '相互依存', en: 'interdependence', def: '兩方各自的處境會因對方的變動而改變，且方向並非單向', defEn: 'two parties whose situations each change with the other, and not in one direction only', fit: '甲地供應原料予乙地加工，乙地的訂單多寡又決定甲地的產量', fitEn: 'one place supplying materials that another processes, while the second place’s orders determine the first place’s output', bad: ['甲地向乙地提供援助，乙地並無任何回流', '兩地各自生產完全相同的產品但互不往來', '兩地同時受到一場天氣事件影響'], badEn: ['one place giving aid to another with nothing flowing back', 'two places making identical products with no dealings between them', 'two places both affected by the same weather event'] },
  { term: '法治', en: 'the rule of law', def: '公權力的行使同樣受法律約束，而非僅以法律管治人民', defEn: 'public power itself being bound by law, not merely governing people through law', fit: '一項行政決定被指越權，須交由法院按法定準則審查', fitEn: 'an administrative decision alleged to exceed its powers being reviewed by a court against legal standards', bad: ['法律條文數目愈多，法治程度愈高', '只要人人守法，即等同法治已經實現', '執法愈嚴厲，法治水平必然愈高'], badEn: ['the more statutes there are, the stronger the rule of law', 'universal compliance alone amounting to the rule of law', 'harsher enforcement necessarily meaning a higher standard'] },
  { term: '公共衞生', en: 'public health', def: '以群體為單位、着眼於預防的健康工作', defEn: 'health work organised around populations and oriented to prevention', fit: '為全區學童安排定期視力篩查，及早找出未被察覺的問題', fitEn: 'arranging regular vision screening for all schoolchildren in a district to catch unnoticed problems early', bad: ['為一名已確診的病人安排專科手術', '一個人自行決定每日跑步三十分鐘', '一間私家診所延長門診時間'], badEn: ['arranging specialist surgery for one diagnosed patient', 'an individual deciding to run for thirty minutes a day', 'a private clinic extending its consultation hours'] },
  { term: '持份者', en: 'stakeholder', def: '會受某項決定影響、或有能力影響該決定的個人或群體', defEn: 'an individual or group affected by a decision, or able to affect it', fit: '一項道路改建方案中，沿線需要上落貨的商戶', fitEn: 'in a road scheme, the shops along the route that need kerbside loading', bad: ['與該決定完全無關且不受影響的外地讀者', '一份記錄該決定的會議紀錄文件', '該決定所依據的統計數據本身'], badEn: ['an overseas reader wholly unconnected with and unaffected by the decision', 'the minutes recording the decision', 'the statistics on which the decision was based'] },
  { term: '綜合國力', en: 'comprehensive national strength', def: '一國在經濟、科技、教育、文化等多個範疇的整體能力，並非單一指標', defEn: 'a country’s overall capacity across economic, technological, educational and cultural domains, not any single indicator', fit: '同時考察製造能力、研發投入、教育普及率與文化影響力', fitEn: 'looking at manufacturing capacity, research spending, educational reach and cultural influence together', bad: ['只看某一年的出口總額', '只看人口總數', '只看某一項體育賽事的成績'], badEn: ['looking only at one year’s total exports', 'looking only at total population', 'looking only at results in one sporting event'] },
]
CONCEPTS.forEach((c, ci) => {
  PLACES.forEach((pl, pi) => {
    const i = ci * PLACES.length + pi
    b.add(
      `csd_cp_${ci}_${pi}`,
      T.concept,
      FW.apply,
      diff(i),
      [
        `【定義由題幹提供】「${c.term}」指${c.def}。在${pl.zh}的以下四個情況中，哪一個最符合這個定義？`,
        `[Definition supplied] "${c.en}" means ${c.defEn}. In ${pl.en}, which of the following best fits that definition?`,
      ],
      [
        [c.fit, c.fitEn],
        [c.bad[0], c.badEn[0]],
        [c.bad[1], c.badEn[1]],
        [c.bad[2], c.badEn[2]],
      ],
      [
        `概念應用題不是考背定義 —— 定義已經寫在題幹。要做的是把定義拆成條件，再逐個選項對。「${c.term}」的條件是「${c.def}」；只有一個選項同時滿足全部條件。三個誤答的共通點是各自漏掉了定義中的一個要素，讀落卻仍然「與這個題目有關」，所以難分。方法：先用筆把定義中的關鍵詞圈出，再問每個選項是否逐項對得上，不要憑印象揀最熟悉那一個。`,
        `Concept application is not a memory test — the definition is given in the stem. The work is to break the definition into conditions and check each option against them. The conditions for "${c.en}" are: ${c.defEn}. Only one option meets all of them. Each distractor drops one element of the definition while still sounding topical, which is what makes them hard. Underline the key terms in the definition first, then check the options one condition at a time rather than picking whichever feels most familiar.`,
      ],
    )
  })
})

// ── 模板四：法治、權利與責任（法治的層次）────────────────────────────────
// 這是教學上通用的四層框架，不涉任何具體案件或政治判斷。
const ROL_LEVELS = [
  { lv: '有法可依', en: 'laws must exist', desc: '存在公開、明確、可預先知悉的規則', descEn: 'there are published, clear rules that can be known in advance' },
  { lv: '有法必依', en: 'laws must be followed', desc: '規則實際上被遵守與執行，不是寫了不用', descEn: 'the rules are in fact observed and enforced, not merely written down' },
  { lv: '法律面前人人平等', en: 'equality before the law', desc: '同樣的規則適用於所有人，不因身分而異', descEn: 'the same rules apply to everyone, regardless of status' },
  { lv: '法律限制政府權力', en: 'law limits government power', desc: '公權力的行使本身也受法律約束並可被審查', descEn: 'the exercise of public power is itself bound by law and open to review' },
]
const ROL_CASES = [
  { txt: '一項新規則在生效前六個月公布全文，任何人都可以事先查閱', en: 'a new rule is published in full six months before it takes effect, open to anyone to read', lv: 0 },
  { txt: '一條早已訂立的規則長期無人執行，違規者從未被跟進', en: 'a long-standing rule goes unenforced for years and breaches are never followed up', lv: 1 },
  { txt: '兩宗情節相同的個案，因當事人職位不同而受到不同處理', en: 'two cases with identical facts are handled differently because the parties hold different posts', lv: 2 },
  { txt: '一個部門的決定被指超出其法定權限，須交由法院審查', en: 'a department’s decision is alleged to exceed its statutory powers and goes to court for review', lv: 3 },
  { txt: '規則的用語含糊到市民無法預先判斷自己有否違規', en: 'a rule is worded so vaguely that people cannot tell in advance whether they are in breach', lv: 0 },
  { txt: '執法人員按既定程序處理每一宗個案，不論對方是誰', en: 'officers follow the same procedure in every case, whoever is involved', lv: 2 },
  { txt: '一項規定訂明官員行使某項權力時必須記錄理由並可供覆核', en: 'a rule requires officials to record their reasons when exercising a power, and those reasons may be reviewed', lv: 3 },
  { txt: '違規個案獲一致跟進，處理方式與公布的程序相符', en: 'breaches are consistently followed up in the way the published procedure sets out', lv: 1 },
]
ROL_CASES.forEach((cs, ci) => {
  PLACES.forEach((pl, pi) => {
    for (let v = 0; v < 2; v++) {
      if ((ci + pi + v) % 3 === 2) continue // 此課題組合空間最大，疏一疏以就均衡
      const i = ci * 16 + pi * 2 + v
      const correct = ROL_LEVELS[cs.lv]
      const wrong = ROL_LEVELS.filter((_, k) => k !== cs.lv)
      b.add(
        `csd_rol_${ci}_${pi}_${v}`,
        T.law,
        FW.apply,
        diff(i),
        [
          `【假設情境・${pl.zh}第 ${v + 1} 宗】${cs.txt}。這個情況最直接對應法治的哪一個層次？`,
          `[Hypothetical · ${pl.en}, case ${v + 1}] ${cs.en}. Which level of the rule of law does this most directly bear on?`,
        ],
        [
          [`${correct.lv} —— ${correct.desc}`, `${correct.en} — ${correct.descEn}`],
          [`${wrong[0].lv} —— ${wrong[0].desc}`, `${wrong[0].en} — ${wrong[0].descEn}`],
          [`${wrong[1].lv} —— ${wrong[1].desc}`, `${wrong[1].en} — ${wrong[1].descEn}`],
          [`${wrong[2].lv} —— ${wrong[2].desc}`, `${wrong[2].en} — ${wrong[2].descEn}`],
        ],
        [
          `法治不是一個整體的「有」或「無」，而是幾個可以分別成立或失守的層次。本題的情況指向「${correct.lv}」，即${correct.desc}。分辨方法是問一條問題：這個情況出問題時，出問題的是【規則本身】（有沒有、清不清楚）、【執行】（有沒有真的用）、【適用範圍】（是否人人一樣），還是【權力受不受制約】？四個層次各對應其中一個環節，對得上就不會混淆。要注意最後一層最容易被忽略 —— 法治不只是用法律管人，也包括用法律約束公權力本身。`,
          `The rule of law is not a single thing you either have or lack; it is a set of levels that can hold or fail separately. This situation bears on ${correct.en}: ${correct.descEn}. Ask one question to sort them: when something goes wrong here, is the problem with the rule itself (does it exist, is it clear), with enforcement (is it actually applied), with scope (does it apply equally), or with the limits on power? Each level answers one of those. The last is the one most often overlooked: the rule of law is not only governing people through law but binding public power by it.`,
        ],
      )
    }
  })
})

// ── 模板五：香港社會與參與（途徑配對）────────────────────────────────────
const CHANNELS = [
  { goal: '就一份仍在諮詢期的政策文件表達意見', en: 'give views on a policy paper still open for consultation', ok: '在限期前提交書面意見', okEn: 'submit written views before the closing date', bad: ['等文件定案之後才發表看法', '只在朋友之間討論而不提交', '轉發他人的貼文而不表明自己的意見'], badEn: ['wait until the paper is finalised before commenting', 'discuss it among friends without submitting anything', 'reshare someone else’s post without stating a view'] },
  { goal: '反映一項與所住樓宇有關的持續問題', en: 'raise a continuing problem about one’s own building', ok: '循管理處與相關部門的既定投訴程序逐級反映', okEn: 'use the established complaint route through management and the relevant department', bad: ['直接去信與該事無關的機構', '在網上匿名描述而不提供地址細節', '待問題自行消失'], badEn: ['write to a body with no responsibility for it', 'describe it anonymously online without location details', 'wait for it to go away'] },
  { goal: '了解一項公共開支的用途', en: 'find out how a public sum was spent', ok: '查閱已公開的帳目或按既定機制索取資料', okEn: 'consult published accounts or request information through the established mechanism', bad: ['憑印象推算金額', '引用一段未註明來源的轉述', '假定金額與去年相同'], badEn: ['estimate the amount from impression', 'cite an unsourced second-hand account', 'assume it matches last year'] },
  { goal: '推動一項需要多方配合的社區改善', en: 'push a community improvement that needs several parties', ok: '先辨識所有相關持份者，再約見並收集各方意見', okEn: 'identify all relevant stakeholders first, then meet them and gather views', bad: ['只聯絡最支持自己的一方', '直接公布方案再處理反對', '假定沒有人會反對'], badEn: ['approach only the most supportive party', 'announce the plan first and handle objections later', 'assume no one will object'] },
  { goal: '核實一段在社交平台流傳的資訊', en: 'verify a claim circulating on social media', ok: '追溯到原始資料來源，並比對至少一個獨立來源', okEn: 'trace it to the original source and check it against at least one independent source', bad: ['看轉發次數是否夠多', '看發布者的追蹤人數', '看內容是否與自己的看法一致'], badEn: ['check how many times it was reshared', 'check the poster’s follower count', 'check whether it agrees with one’s own view'] },
  { goal: '就一項影響全校的安排提出替代方案', en: 'propose an alternative to an arrangement affecting the whole school', ok: '經學生會或既定意見渠道提交具體方案與理據', okEn: 'submit a concrete proposal with reasons through the student union or an established channel', bad: ['在課堂上即場表達不滿', '收集簽名但不提出替代方案', '等待他人代為提出'], badEn: ['voice displeasure in class on the spot', 'collect signatures without proposing an alternative', 'wait for someone else to raise it'] },
]
CHANNELS.forEach((c, ci) => {
  PLACES.forEach((pl, pi) => {
    for (let v = 0; v < 2; v++) {
      if ((ci + pi + v) % 4 === 3) continue
      const i = ci * 16 + pi * 2 + v
      b.add(
        `csd_soc_${ci}_${pi}_${v}`,
        T.society,
        FW.apply,
        diff(i),
        [
          `【假設情境】${pl.zh}一名中學生希望${c.goal}（情況 ${v + 1}）。以下哪一個做法最能達到這個目的？`,
          `[Hypothetical] A secondary student in ${pl.en} wants to ${c.en} (situation ${v + 1}). Which course of action best achieves it?`,
        ],
        [
          [c.ok, c.okEn],
          [c.bad[0], c.badEn[0]],
          [c.bad[1], c.badEn[1]],
          [c.bad[2], c.badEn[2]],
        ],
        [
          `參與是否有效，看的是【途徑是否對得上目的】，而不是態度是否積極。此處的目的是「${c.goal}」，所以有效的做法是${c.ok}。三個誤答的問題並非「不夠熱心」—— 它們各自缺了一個必要條件：時機不對（在窗口關閉之後才行動）、對象不對（找了無權處理的一方），或者形式不對（表達了情緒但沒有可供處理的具體內容）。做這類題時先問：這件事由誰負責？有沒有既定的窗口？我要提交的東西是否可以被處理？`,
          `Whether participation works depends on the fit between channel and purpose, not on how strongly one feels. The purpose here is to ${c.en}, so the effective step is to ${c.okEn}. The distractors are not failures of enthusiasm; each is missing one necessary condition — wrong timing (acting after the window has closed), wrong addressee (approaching a body with no power to act), or wrong form (expressing feeling without anything actionable). Ask first: who is responsible, is there an established window, and is what I am submitting something that can actually be acted on?`,
        ],
      )
    }
  })
})

// ── 模板六：互聯相依的世界 ──────────────────────────────────────────────
// 給定一條依存鏈，問由此可以推出甚麼；不斷言任何真實貿易關係。
PLACES.forEach((pl, pi) => {
  PLACES.forEach((pl2, pj) => {
    if (pi === pj) return
    const i = pi * PLACES.length + pj
    const share = 30 + ((pi * 7 + pj * 5) % 45)
    b.add(
      `csd_int_${pi}_${pj}`,
      T.inter,
      FW.logic,
      diff(i),
      [
        `【假設資料】${pl.zh}有 ${share}% 的零件輸往${pl2.zh}加工；${pl2.zh}的加工訂單量則決定${pl.zh}該行業的產量。單憑這段描述，可以確定的是甚麼？`,
        `[Hypothetical] ${share} per cent of components made in ${pl.en} go to ${pl2.en} for processing, and ${pl2.en}’s order volume in turn determines output in that industry in ${pl.en}. What does this description alone establish?`,
      ],
      [
        [`兩地在該行業上相互依存 —— 一方的變動會傳導至另一方`, `The two are interdependent in that industry: a change in one is transmitted to the other`],
        [`${pl2.zh}對${pl.zh}擁有完全的控制權`, `${pl2.en} has complete control over ${pl.en}`],
        [`${pl.zh}該行業有 ${share}% 的工人在${pl2.zh}工作`, `${share} per cent of that industry’s workers in ${pl.en} are employed in ${pl2.en}`],
        [`兩地的整體經濟規模相若`, `The two have economies of a similar overall size`],
      ],
      [
        `相互依存的判準是【傳導是否雙向】，不是誰比較強。資料寫明零件由${pl.zh}流向${pl2.zh}，而訂單量又反過來決定${pl.zh}的產量 —— 兩個方向都存在，所以「相互依存」成立。說「完全控制」是把不對等誤讀為單向：依存可以不對等，但只要有回流就不是單向。說「${share}% 工人在對方工作」是把零件比例當成人口比例，兩者是不同的量。說「經濟規模相若」則需要資料完全沒有提供的數字。`,
        `Interdependence is judged by whether transmission runs both ways, not by which side is stronger. The passage states that components flow from ${pl.en} to ${pl2.en} and that order volume in turn sets output back in ${pl.en} — both directions are present, so interdependence holds. "Complete control" reads an asymmetry as a one-way relation: dependence can be unequal and still be mutual. The worker claim converts a share of components into a share of people, which is a different quantity. Similar economy size needs figures the passage never gives.`,
      ],
    )
  })
})

// ── 模板六之二：相依 vs 單向（教訓⑥ —— 組合空間見頂就加模板）────────────
// 上一個模板的空間上限是 8×8 減對角 = 56 條，加取值只會令其他課題一齊發脹。
// 故另立一個模板：同樣是相依主題，但問的是【如何分辨相依與單向依賴】。
const FLOWS = [
  {
    zh: '甲地把製成品售予乙地，乙地並無任何貨物或服務回流甲地，亦不影響甲地的產量',
    en: 'one place sells finished goods to another, with nothing flowing back and no effect on the seller’s output',
    ok: '這是單向依賴，不是相互依存 —— 傳導只有一個方向',
    okEn: 'This is one-way dependence, not interdependence: transmission runs in one direction only',
    bad: ['這是相互依存，因為兩地之間有貿易往來', '這代表甲地在經濟上強於乙地', '這代表兩地的關係並不重要'],
    badEn: ['It is interdependence, because trade passes between them', 'It shows the seller is economically stronger', 'It shows the relationship does not matter'],
  },
  {
    zh: '甲地的原料價格上升會推高乙地的生產成本，而乙地的需求下降又會壓低甲地的原料價格',
    en: 'a rise in one place’s material prices raises the other’s production costs, while falling demand there in turn depresses the first place’s prices',
    ok: '這是相互依存 —— 兩個方向的傳導同時存在，且互為條件',
    okEn: 'This is interdependence: transmission runs both ways and each conditions the other',
    bad: ['這是單向依賴，因為價格由甲地決定', '這代表兩地的經濟規模相同', '這代表其中一方最終必然得益'],
    badEn: ['It is one-way, because the first place sets the price', 'It shows the two economies are the same size', 'It shows one side must ultimately gain'],
  },
  {
    zh: '甲地與乙地同時受同一場颱風影響，但兩地之間並無任何往來',
    en: 'two places are hit by the same typhoon but have no dealings with each other',
    ok: '這是共同承受同一外部因素，不是相互依存 —— 兩者之間並無傳導',
    okEn: 'This is exposure to a common external factor, not interdependence: nothing is transmitted between them',
    bad: ['這是相互依存，因為兩地同時受影響', '這代表兩地必然會建立經濟聯繫', '這代表其中一方的損失會轉嫁另一方'],
    badEn: ['It is interdependence, since both are affected at once', 'It means the two will necessarily form economic ties', 'It means one side’s loss passes to the other'],
  },
]
FLOWS.forEach((fl, fi) => {
  PLACES.forEach((pl, pi) => {
    const i = fi * PLACES.length + pi
    b.add(
      `csd_int2_${fi}_${pi}`,
      T.inter,
      FW.logic,
      diff(i),
      [
        `【假設情境・以${pl.zh}為例】${fl.zh}。按「相互依存」的定義（兩方各自的處境會因對方的變動而改變，且方向並非單向），以下哪一項判斷成立？`,
        `[Hypothetical · taking ${pl.en} as the case] ${fl.en}. Applying the definition of interdependence — each party's situation changing with the other, and not in one direction only — which judgement holds?`,
      ],
      [
        [fl.ok, fl.okEn],
        [fl.bad[0], fl.badEn[0]],
        [fl.bad[1], fl.badEn[1]],
        [fl.bad[2], fl.badEn[2]],
      ],
      [
        `「相互依存」與「有來往」是兩回事，這是本課題最常混淆的一點。定義要求的是【雙向傳導】：甲變會令乙變，乙變也會令甲變。單向買賣有來往但只有一個方向；同受一場天災則連傳導都沒有，只是共同暴露於同一外部因素。判斷方法是畫兩支箭：畫得出兩支，才是相互依存；只畫得出一支，是單向依賴；一支都畫不出，就只是巧合地同時發生。`,
        `Interdependence and "having dealings" are not the same thing, and this is where the topic is most often confused. The definition requires transmission in both directions: a change in one alters the other, and the reverse also holds. A one-way sale involves dealings but only one direction; a shared typhoon involves no transmission at all, only common exposure to an outside factor. Draw two arrows: two arrows means interdependence, one arrow means one-way dependence, and no arrow means the two things merely happened at the same time.`,
      ],
    )
  })
})

// ── 模板七：可持續發展與公共衞生 ────────────────────────────────────────
PLACES.forEach((pl, pi) => {
  YEARS.forEach((yr, yi) => {
    const i = pi * YEARS.length + yi
    const stock = 800 + pi * 60 + yi * 40
    const regen = 40 + yi * 4
    const take = regen + 6 + pi * 2
    const over = take - regen
    b.add(
      `csd_sus_${pi}_${yi}`,
      T.sustain,
      FW.logic,
      diff(i),
      [
        `【假設資料】${pl.zh}某項再生資源於 ${yr} 年的存量為 ${stock} 單位，每年自然更新 ${regen} 單位，而每年開採 ${take} 單位。按可持續發展的定義（滿足當代需要而不損害後代滿足其需要的能力），以下哪一項判斷成立？`,
        `[Hypothetical] In ${yr} a renewable resource in ${pl.en} has a stock of ${stock} units, replenishes by ${regen} units a year, and is harvested at ${take} units a year. Applying the definition of sustainable development, which judgement holds?`,
      ],
      [
        [`開採量高於更新量 ${over} 單位，存量每年淨減，此速度不可持續`, `Harvesting exceeds replenishment by ${over} units, so the stock falls each year; this rate is not sustainable`],
        [`存量尚有 ${stock} 單位，因此目前的開採速度可持續`, `With ${stock} units still in stock, the current rate is sustainable`],
        [`只要開採量不超過存量的一成，即屬可持續`, `Any harvest below one tenth of the stock counts as sustainable`],
        [`該資源可再生，因此開採速度不影響可持續性`, `Because the resource is renewable, the harvest rate does not affect sustainability`],
      ],
      [
        `可持續與否，比較的是【流量】而不是【存量】：要看每年拿走多少對每年補回多少，而不是看現在還剩多少。此處 ${take} − ${regen} = ${over}，每年淨減 ${over} 單位，方向確定，所以不可持續 —— 存量有 ${stock} 單位只代表撐得比較久，不代表撐得下去。第三個選項憑空發明了一條「一成」的準則，定義中並無此物。第四個把「可再生」誤讀成「取之不盡」：可再生只表示有更新機制，更新速度仍然是上限。`,
        `Sustainability compares flows, not stocks: what is taken each year against what returns each year, not how much remains today. Here ${take} − ${regen} = ${over}, a net loss of ${over} units a year, so the rate is not sustainable — a stock of ${stock} only means it lasts longer, not that it lasts. The third option invents a "one tenth" rule that appears nowhere in the definition. The fourth reads "renewable" as "inexhaustible": renewable means there is a replenishment mechanism, and its rate is still the ceiling.`,
      ],
    )
  })
})

// ── 模板八：「一國兩制」與憲制秩序（由題幹給條文，問推論）──────────────
// ⚠️ 不考記誦具體條文編號，只考【由給定條文能推出甚麼】這種法律閱讀方法。
const PROVISIONS = [
  { txt: '該文件訂明：某類事務由中央負責，另一類事務由地方自行管理', en: 'the document provides that one class of matters is the responsibility of the central authorities and another is managed locally', ok: '該文件對兩類事務作了權限劃分，判斷任何具體事項時須先歸類', okEn: 'the document divides competences between two classes, so any specific matter must first be classified', bad: ['地方可以自行改變劃分本身', '凡文件未提及的事項一律屬地方管理', '劃分只是原則性描述，不具實際效力'], badEn: ['the local level may itself alter the division', 'anything not mentioned falls automatically to the local level', 'the division is only descriptive and has no practical effect'] },
  { txt: '該文件訂明：本地法律不得與該文件相抵觸', en: 'the document provides that local laws must not contravene it', ok: '該文件在效力上高於一般本地法律，抵觸者須以該文件為準', okEn: 'the document ranks above ordinary local law, and in a conflict the document prevails', bad: ['一般本地法律因此全部無效', '該文件與一般法律效力相同', '抵觸與否由制定該法律的機關自行決定'], badEn: ['ordinary local laws are therefore all invalid', 'the document and ordinary law rank equally', 'whether there is a conflict is decided by the body that made the law'] },
  { txt: '該文件訂明：原有的某項制度在指定期間內保持不變', en: 'the document provides that an existing system is to remain unchanged for a specified period', ok: '該條文同時包含「保持」與「期間」兩個要素，兩者缺一都會讀錯', okEn: 'the clause contains both a continuity element and a time element; dropping either misreads it', bad: ['該制度永遠不得作任何調整', '該制度可以隨時由任何一方更改', '該條文只適用於文件生效當日'], badEn: ['the system may never be adjusted at all', 'the system may be changed at any time by either side', 'the clause applies only on the day the document takes effect'] },
  { txt: '該文件訂明：某項權利受保障，但其行使須依法進行', en: 'the document provides that a right is protected, and that its exercise is to be in accordance with law', ok: '保障與依法行使並存 —— 兩句要一併讀，不能只取其一', okEn: 'protection and lawful exercise stand together; the two clauses must be read as one', bad: ['該權利不受任何限制', '該權利只是宣示性質，沒有實際保障', '只要有法律規定，該權利即可被完全取消'], badEn: ['the right is subject to no limits at all', 'the right is merely declaratory with no real protection', 'any statute may extinguish the right entirely'] },
  { txt: '該文件訂明：對其條文的解釋權屬於指定機關', en: 'the document provides that the power to interpret its provisions rests with a designated body', ok: '解釋權的歸屬由文件本身明定，並非按慣例或默契決定', okEn: 'the location of the interpretive power is fixed by the document itself, not by custom or understanding', bad: ['任何機關都可以作出有約束力的解釋', '解釋權可由當事人協議轉移', '條文文義清楚時便毋須任何機關解釋'], badEn: ['any body may give a binding interpretation', 'the power may be transferred by agreement between parties', 'no body need interpret a provision whose wording is clear'] },
  { txt: '該文件訂明：修改須依照文件所列的程序進行', en: 'the document provides that amendment must follow the procedure it sets out', ok: '修改並非不可能，但必須循文件自訂的程序，程序本身即是限制', okEn: 'amendment is possible but only through the document’s own procedure; the procedure is itself the constraint', bad: ['該文件完全不可修改', '任何一方可單方面修改', '只要多數人同意即可修改'], badEn: ['the document cannot be amended at all', 'either side may amend it unilaterally', 'a simple majority is enough to amend it'] },
]
PROVISIONS.forEach((pv, vi) => {
  PLACES.forEach((pl, pi) => {
    for (let k = 0; k < 2; k++) {
      if ((vi + pi + k) % 4 === 3) continue
      const i = vi * 16 + pi * 2 + k
      b.add(
        `csd_con_${vi}_${pi}_${k}`,
        T.constitution,
        FW.logic,
        diff(i),
        [
          `【假設文本・${pl.zh}示例 ${k + 1}】設有一份憲制性文件，${pv.txt}。單憑這一句條文，可以推出甚麼？`,
          `[Hypothetical text · ${pl.en}, example ${k + 1}] Suppose a constitutional document in which ${pv.en}. What follows from this clause alone?`,
        ],
        [
          [pv.ok, pv.okEn],
          [pv.bad[0], pv.badEn[0]],
          [pv.bad[1], pv.badEn[1]],
          [pv.bad[2], pv.badEn[2]],
        ],
        [
          `讀憲制性條文的方法，與讀任何法律條文一樣：只取條文寫了的，不補條文沒寫的。此句寫明的內容，只支持一個結論 —— ${pv.ok}。三個誤答分別是三種最常見的讀法錯誤：把限制讀成絕對（推到「永遠不可以」或「完全不受限」）、把沉默讀成授權（條文沒提到的就當作歸自己）、以及把效力讀成形式（承認條文存在卻否定它有實際作用）。本題刻意不考條文編號 —— 記得住編號而讀不出效力，考試時一樣答不到。`,
          `Reading a constitutional provision works like reading any legal text: take what it says and add nothing it does not say. What this clause states supports only one conclusion — ${pv.okEn}. The three distractors are the three commonest misreadings: pushing a limit into an absolute (never, or wholly unrestricted), reading silence as a grant (whatever is unmentioned falls to me), and conceding that the clause exists while denying it any effect. The item deliberately does not test article numbers: remembering a number without being able to read its effect answers nothing in an examination.`,
        ],
      )
    }
  })
})

// ── 模板九：經濟全球化（貿易數據推理）──────────────────────────────────
PLACES.forEach((pl, pi) => {
  YEARS.forEach((yr, yi) => {
    const i = pi * YEARS.length + yi
    const exp = 200 + pi * 35 + yi * 22
    const imp = 150 + pi * 28 + yi * 30
    const bal = exp - imp
    b.add(
      `csd_glo_${pi}_${yi}`,
      T.global,
      FW.logic,
      diff(i),
      [
        `【假設資料】${pl.zh}於 ${yr} 年的貨物出口值為 ${exp} 億單位，進口值為 ${imp} 億單位。資料本身足以支持哪一項結論？`,
        `[Hypothetical] In ${yr}, ${pl.en} exported goods worth ${exp} hundred million units and imported ${imp} hundred million. Which conclusion does the data alone support?`,
      ],
      [
        [`該年貨物貿易${bal >= 0 ? '順' : '逆'}差為 ${Math.abs(bal)} 億單位`, `Its goods trade balance that year was ${bal >= 0 ? 'a surplus' : 'a deficit'} of ${Math.abs(bal)} hundred million`],
        [`該市居民的平均收入因此${bal >= 0 ? '上升' : '下降'}`, `Average incomes there therefore ${bal >= 0 ? 'rose' : 'fell'}`],
        [`該市的整體經濟表現優於同期其他城市`, `Its overall economic performance beat other cities in the same period`],
        [`該市的貿易總額中，服務業佔大部分`, `Services made up most of its total trade`],
      ],
      [
        `全球化的題目常常給貿易數字，而數字能支持的結論比看上去少。此處只有貨物出入口兩個值，能算的就只有差額：${exp} − ${imp} = ${bal}，即${bal >= 0 ? '順' : '逆'}差 ${Math.abs(bal)} 億。說「收入因此上升／下降」把一個總量指標當成人均福祉，中間隔了分配這一層；說「表現優於其他城市」需要其他城市的數字；說「服務業佔大部分」則超出資料範圍 —— 題幹寫明是【貨物】貿易，服務貿易根本沒有給。做這類題的自檢是：資料給了哪幾個量？我的結論有沒有用到一個沒給的量？`,
        `Globalisation items often supply trade figures, and figures support fewer conclusions than they appear to. Here there are two values for goods, so the only thing calculable is the balance: ${exp} − ${imp} = ${bal}, a ${bal >= 0 ? 'surplus' : 'deficit'} of ${Math.abs(bal)} hundred million. "Incomes therefore rose or fell" turns an aggregate into personal welfare, skipping distribution entirely. "Beat other cities" needs figures for those cities. "Services made up most of it" goes outside the data — the stem specifies goods trade, and services are not given at all. The self-check: which quantities were supplied, and does my conclusion use one that was not?`,
      ],
    )
  })
})

// ── 模板十：科技創新與綜合國力（多指標，不可用單一指標下判斷）────────────
PLACES.forEach((pl, pi) => {
  YEARS.forEach((yr, yi) => {
    const i = pi * YEARS.length + yi
    const rd = 12 + pi * 3 + yi
    const patents = 400 + pi * 90 + yi * 55
    b.add(
      `csd_tech_${pi}_${yi}`,
      T.tech,
      FW.logic,
      diff(i),
      [
        `【假設資料】${pl.zh}於 ${yr} 年的研發開支佔本地生產總值 ${rd / 10}%，同年錄得 ${patents} 項專利註冊。若以「綜合國力」為分析框架，以下哪一項判斷最為恰當？`,
        `[Hypothetical] In ${yr}, ${pl.en} spent ${rd / 10} per cent of GDP on research and development and recorded ${patents} patent registrations. Using "comprehensive national strength" as the framework, which judgement is most appropriate?`,
      ],
      [
        [`這兩項屬於科技範疇的指標，尚不足以斷定綜合國力，須併同經濟、教育、文化等範疇一併考察`, `These are two indicators in the technological domain; comprehensive strength cannot be judged from them alone and must be read alongside the economic, educational and cultural domains`],
        [`研發開支達 ${rd / 10}%，即可斷定綜合國力位居前列`, `Research spending of ${rd / 10} per cent alone establishes a leading position`],
        [`專利數目 ${patents} 項是唯一可靠的綜合國力指標`, `The figure of ${patents} patents is the single reliable measure of comprehensive strength`],
        [`兩項數字均為正數，因此各範疇必然同步增長`, `Since both figures are positive, every domain must be growing in step`],
      ],
      [
        `「綜合國力」這個概念的關鍵字是【綜合】—— 它按定義就是多範疇的整體能力，所以任何單一指標，無論數字多好看，都不足以下判斷。此處給的兩項（研發佔比 ${rd / 10}%、專利 ${patents} 項）同屬科技範疇，連科技一項都未必說得完整，更不足以概括全局。三個誤答分別犯了：以單一指標代替整體、指定某一指標為唯一標準、以及由部分指標的方向推斷全部範疇同步 —— 最後這一項尤其常見，各範疇之間並非必然同向。`,
        `The key word in "comprehensive national strength" is comprehensive: by definition it spans domains, so no single indicator, however impressive, settles it. The two figures given here (${rd / 10} per cent on research, ${patents} patents) both sit in the technological domain and may not even characterise that domain fully, let alone the whole. The distractors respectively substitute one indicator for the whole, nominate a single measure as definitive, and infer that all domains move together from the direction of a few — the last being especially common, since domains need not move in step.`,
      ],
    )
  })
})

// ── 模板十一：改革開放與國家發展（由變化推方法，不斷言史實）──────────────
const CHANGE_KINDS = [
  { kind: '某項統計指標在十年間持續上升', en: 'a statistical indicator rising steadily over a decade', ok: '可以確定該指標的方向，但成因需要另外的證據', okEn: 'the direction of that indicator is established, but its causes require separate evidence', bad: ['可以確定上升是由某一項政策造成', '可以確定所有地區都同步上升', '可以確定居民生活的每一方面都改善了'], badEn: ['it is established that one particular policy caused the rise', 'it is established that every region rose in step', 'it is established that every aspect of life improved'] },
  { kind: '兩個地區在同一時期的同一指標走勢不同', en: 'two regions showing different trends in the same indicator over the same period', ok: '差異本身成立，但要解釋差異必須比較兩地的其他條件', okEn: 'the difference itself is established, but explaining it requires comparing other conditions in the two places', bad: ['走勢較好的一方政策必然較優', '走勢較差的一方沒有付出努力', '差異必然會在下一個時期消失'], badEn: ['the better-performing side necessarily had better policy', 'the weaker side simply did not try', 'the gap will necessarily close in the next period'] },
  { kind: '某項改革措施推行後，相關指標於三年內改變', en: 'an indicator changing within three years of a reform measure', ok: '時間上的先後不等於因果，須排除同期其他影響因素', okEn: 'temporal order is not causation; other concurrent influences must be ruled out', bad: ['先後次序本身已足以證明因果', '三年是判斷因果的公認年期', '指標改變即代表措施達到全部目標'], badEn: ['sequence alone proves causation', 'three years is the accepted period for establishing cause', 'a change in the indicator means the measure met all its aims'] },
  { kind: '一份報告只列出成功的個案', en: 'a report listing only successful cases', ok: '樣本經過挑選，據此推論整體會高估成效', okEn: 'the sample is selected, so generalising from it overstates the effect', bad: ['個案數目夠多即可代表整體', '成功個案愈多，結論愈可靠', '只要每個個案屬實，推論即成立'], badEn: ['a large enough number of cases represents the whole', 'the more successes listed, the sounder the conclusion', 'if each case is true, the generalisation follows'] },
  { kind: '同一組數據被兩份報告用作支持相反的結論', en: 'the same data used by two reports to support opposite conclusions', ok: '應先檢查兩者選取了哪一段時期與哪一個比較基準', okEn: 'check first which period and which baseline each report selected', bad: ['其中必有一份偽造了數據', '數據本身沒有意義', '應採納結論較樂觀的一份'], badEn: ['one of them must have falsified the data', 'the data itself is meaningless', 'the more optimistic conclusion should be preferred'] },
  { kind: '一項指標的絕對值上升但佔比下降', en: 'an indicator rising in absolute terms while falling as a share', ok: '兩者並不矛盾 —— 分子在增加，而分母增加得更快', okEn: 'the two are not in conflict: the numerator grew while the denominator grew faster', bad: ['其中一個數字必然計錯', '佔比下降代表絕對值也在下降', '應以絕對值為準而忽略佔比'], badEn: ['one of the figures must be miscalculated', 'a falling share means the absolute value is falling too', 'the absolute value should be used and the share ignored'] },
]
CHANGE_KINDS.forEach((ck, ki) => {
  PLACES.forEach((pl, pi) => {
    for (let v = 0; v < 2; v++) {
      if ((ki + pi + v) % 4 === 3) continue
      const i = ki * 16 + pi * 2 + v
      b.add(
        `csd_ref_${ki}_${pi}_${v}`,
        T.reform,
        FW.logic,
        diff(i),
        [
          `【假設研究・${pl.zh}第 ${v + 1} 份資料】一份研究國家發展的報告出現以下情況：${ck.kind}。在方法上，恰當的處理是甚麼？`,
          `[Hypothetical study · ${pl.en}, source ${v + 1}] A report on national development presents ${ck.en}. What is the methodologically sound response?`,
        ],
        [
          [ck.ok, ck.okEn],
          [ck.bad[0], ck.badEn[0]],
          [ck.bad[1], ck.badEn[1]],
          [ck.bad[2], ck.badEn[2]],
        ],
        [
          `研究國家發展這類長時段課題，最容易出錯的不是史實記憶，而是【由資料到結論那一步】。此處恰當的處理是：${ck.ok}。三個誤答的共同毛病，是把一個需要額外證據的步驟省略了 —— 有的把先後當因果，有的把被挑選過的樣本當成整體，有的把「兩個數字方向不同」當成必有一個出錯。本科的資料回應題正是考這一步，所以練的應該是這種檢查次序，而不是背某年某項數字。`,
          `In long-run topics like national development, the usual failure is not weak recall of facts but the step from data to conclusion. The sound response here is: ${ck.okEn}. What the distractors share is that each skips a step requiring further evidence — treating sequence as cause, treating a selected sample as the whole, or treating two figures moving differently as proof that one is wrong. Data-response questions in this subject test exactly that step, so what is worth practising is the order of checks, not the memorising of particular figures.`,
        ],
      )
    }
  })
})

export const csdBank1Questions: Question[] = b.bank
export const csdBank1Drops = b.drops
