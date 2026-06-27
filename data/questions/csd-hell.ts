import type { Question, Topic } from './types'
import { makeQ, topicList, type Pair, type TopicMeta, type FwMeta } from './_builder'

// ════════════════════════════════════════════════════════════════════════════
// 公民與社會發展 — 資料回應「地獄卷」（真・5★★）。
// 對標 DSE 公社科最高階能力：數據詮釋（相關≠因果、基數謬誤）、多角度持份者權衡、
// 事實與價值判斷之分、概念應用。所有數據均為「示意 / 虛構個案」(清楚標明)，論證
// 中立、緊扣課程概念，答案由對材料的嚴謹推理決定，可逐步覆核。全部 difficulty:'hard'。
// ════════════════════════════════════════════════════════════════════════════

const q = makeQ('csd')
const opt = (zh: string, en: string): Pair => [zh, en]
const C = (zh: string, en: string): Pair => [zh, en]

const T = {
  data:    { id: 'csd_data_response',   zh: '資料回應・數據詮釋',   en: 'Data-response · interpreting data' },
  eval:    { id: 'csd_stakeholder_eval', zh: '多角度評鑑・持份者權衡', en: 'Multi-perspective · stakeholders' },
  concept: { id: 'csd_concept_apply',   zh: '概念應用・當代世界',   en: 'Applying concepts · the contemporary world' },
} satisfies Record<string, TopicMeta>

const FW = {
  data:     { id: 'data',     zh: '資料回應', en: 'Data-response',  emoji: '📊' },
  evaluate: { id: 'evaluate', zh: '多角度評鑑', en: 'Evaluation',    emoji: '⚖️' },
  analysis: { id: 'analysis', zh: '議題分析',  en: 'Issue analysis', emoji: '🔗' },
} satisfies Record<string, FwMeta>

let uid = 0
const id = (p: string) => `csdh_${p}_${++uid}`

// ── 數據詮釋（相關≠因果 / 基數謬誤 / 事實vs價值）─────────────────────────────────
const data: Question[] = [
  q(id('da'), T.data, FW.data, 'hard', 2024, 3,
    C('【示意數據・虛構國家 X】20 年間，X 國的「貿易佔 GDP 比率」由 40% 升至 75%，同期堅尼系數（量度收入不均，數值愈高愈不均）由 0.38 升至 0.45。\n問：單憑上述數據，下列哪項推論最為穩妥？',
      '【Illustrative data — fictional Country X】Over 20 years, X’s trade-to-GDP ratio rose from 40% to 75%; over the same period its Gini coefficient (income inequality; higher = more unequal) rose from 0.38 to 0.45.\nQ: On the data ALONE, which inference is the most defensible?'),
    [opt('X 國的經濟對外開放程度上升，同期收入不均亦擴大，但數據本身未能證明前者「導致」後者',
        'X became more economically open AND inequality widened over the same period — but the data alone cannot prove the former CAUSED the latter'),
      opt('全球化直接導致 X 國的收入不均擴大',
        'globalisation directly caused the rise in X’s inequality'),
      opt('全球化令 X 國的收入不均收窄',
        'globalisation narrowed inequality in X'),
      opt('貿易與經濟表現之間並無任何關係',
        'trade has no relationship with economic performance')],
    C('兩個變項同向變動只是「相關 / 同時出現」，並非「因果」。影響堅尼系數的因素眾多（科技、稅制、教育等），數據無法把不均單獨歸因於開放。高階公社答題的關鍵，正是分清「數據顯示了甚麼」與「數據不能證明甚麼」。\n\n【陷阱拆解】「直接導致」犯『相關當因果』之過；「收窄」與數據相反；「毫無關係」則無視同向趨勢——三者都越過了數據可支持的範圍。',
      'Two variables moving together is correlation/co-occurrence, not causation. Many factors drive the Gini (technology, tax, education…), so the data cannot pin inequality on openness alone. The key higher-order skill is separating what the data shows from what it cannot establish.\n\n【Trap】 “Directly caused” commits the correlation-as-causation error; “narrowed” contradicts the data; “no relationship” ignores the co-trend — all overreach the data.')),

  q(id('da'), T.data, FW.data, 'hard', 2023, 3,
    C('【示意個案】某市人口 10,000，其中 9,000 人已接種疫苗、1,000 人未接種。某病爆發，共 100 宗病例，當中 60 宗為已接種者、40 宗為未接種者。有人說：「六成病例都打咗針，可見疫苗無效。」\n問：這個說法的最主要謬誤是？',
      '【Illustrative case】A town of 10,000: 9,000 vaccinated, 1,000 not. An outbreak yields 100 cases — 60 among the vaccinated, 40 among the unvaccinated. Someone says: “60% of cases were vaccinated, so the vaccine doesn’t work.”\nQ: The main flaw in this claim is that it?'),
    [opt('只比較病例的原始數目，忽略基數：已接種者發病率 60/9000≈0.67%，遠低於未接種者 40/1000=4%',
        'compares raw case counts and ignores the base rate: 60/9000≈0.67% among the vaccinated vs 40/1000=4% among the unvaccinated — far lower among the vaccinated'),
      opt('證明咗疫苗確實無效',
        'correctly shows the vaccine is ineffective'),
      opt('證明未接種者比較安全',
        'shows the unvaccinated are safer'),
      opt('證明接種疫苗會導致發病',
        'shows that vaccination causes the disease')],
    C('當絕大多數人已接種，即使疫苗有效，病例中「已接種者」佔多數也屬必然——要比較的是「發病率」而非原始宗數。算一算：已接種發病率 ≈0.67%，未接種 4%，相差約 6 倍，正說明疫苗有效。這是典型「基數謬誤 / 忽略分母」。\n\n【陷阱拆解】其餘三項都接受了原始宗數的表象，未回到分母作率的比較——正是公社數據題最常設的陷阱。',
      'When almost everyone is vaccinated, even an effective vaccine leaves most CASES among the vaccinated — you must compare RATES, not raw counts. The rates: ≈0.67% vs 4%, ~6× lower in the vaccinated, showing the vaccine works. This is the base-rate fallacy (ignoring the denominator).\n\n【Trap】 The other options take raw counts at face value without returning to rates — the classic data-response trap.')),

  q(id('da'), T.data, FW.data, 'hard', 2024, 3,
    C('【改革開放・宏觀數據】自 1978 年改革開放以來，中國農村貧困人口由約 2.5 億大幅下降至接近消除，同期城鎮化率由約 18% 升至逾 60%。\n問：單就上述趨勢數據，最穩妥的詮釋是？',
      '【Reform & opening — macro data】Since 1978, China’s rural poor fell from ~250 million toward near-elimination, while urbanisation rose from ~18% to over 60%.\nQ: On these trend figures alone, the most defensible reading is that?'),
    [opt('改革開放以來的經濟發展，與大規模脫貧及城鎮化同步發生；數據呈現趨勢，但未完整交代背後的因果機制',
        'economic development since reform-and-opening coincided with large-scale poverty reduction and urbanisation — the data shows the trends, not the full causal mechanism'),
      opt('單憑城鎮化一項就消除了貧困',
        'urbanisation alone eliminated poverty'),
      opt('脫貧與經濟發展毫無關係',
        'poverty reduction was unrelated to economic development'),
      opt('數據證明某一條單一政策造成了全部成果',
        'the data proves one single policy produced all of it')],
    C('數據清楚顯示「脫貧」「城鎮化」與「發展」同期推進，但趨勢圖不能單獨證明某一因素或政策造成全部成果（多重政策、市場化、產業升級等共同作用）。穩妥答題既肯定成就，亦對因果保持審慎。\n\n【陷阱拆解】「城鎮化單獨消除貧困」與「單一政策造成全部」都犯單因謬誤；「毫無關係」則與趨勢相違。',
      'The data clearly shows poverty reduction, urbanisation and development advancing together, but a trend cannot prove any single factor or policy caused all of it (many policies, marketisation and industrial upgrading interact). A sound answer affirms the achievement yet stays cautious on causation.\n\n【Trap】 “Urbanisation alone” and “one single policy” are single-cause fallacies; “no relationship” contradicts the trend.')),

  q(id('da'), T.data, FW.data, 'hard', 2022, 3,
    C('某交通政策的評估報告寫道：「徵收擠塞費後，路邊二氧化氮濃度下降了 20%；至於這是否值得向市民收費，則取決於社會如何權衡。」\n問：在公社資料回應中，為何必須區分「事實陳述」與「價值判斷」？',
      'A transport policy review states: “After the congestion charge, roadside NO₂ fell 20%; whether that justifies charging the public depends on how society weighs priorities.”\nQ: In CSD data-response, why must one separate factual claims from value judgements?'),
    [opt('事實陳述可用證據查證，價值判斷則取決於不同的優先次序；混淆兩者會把可爭辯的取態當成已證的事實',
        'factual claims can be checked against evidence, value judgements depend on priorities; conflating them treats a contestable stance as if it were proven fact'),
      opt('價值判斷在任何情況下都是錯的',
        'value judgements are always wrong'),
      opt('事實永遠比價值重要，價值可以略去',
        'facts always outweigh values, so values can be ignored'),
      opt('公社科應完全避免涉及任何價值',
        'CSD should avoid values entirely')],
    C('「NO₂ 跌 20%」是可查證的事實；「是否值得收費」是價值取捨，因人因優先次序而異。分清兩者，才不會把一方的立場偽裝成客觀結論，也才能在評鑑時公平地呈現多角度。\n\n【陷阱拆解】其餘三項或一刀切否定價值、或主張略去價值——但公社評鑑正正需要在事實基礎上處理價值取捨，而非取消它。',
      '“NO₂ fell 20%” is checkable fact; “whether it is worth it” is a value trade-off that varies with priorities. Separating them stops one side’s stance from masquerading as an objective conclusion and lets evaluation present perspectives fairly.\n\n【Trap】 The others dismiss or delete values — but CSD evaluation must handle value trade-offs on a factual basis, not erase them.')),
]

// ── 多角度評鑑・持份者權衡 ────────────────────────────────────────────────────
const evaluate: Question[] = [
  q(id('ev'), T.eval, FW.evaluate, 'hard', 2024, 3,
    C('【示意議題】某市面臨垃圾爆滿，政府擬興建「轉廢為能」焚化設施。持份者：附近居民（憂健康）、政府（廢物危機）、環保團體（排放）、相關行業（就業）。\n問：最能體現高階「多角度評鑑」的取態是？',
      '【Illustrative issue】Facing a waste crisis, a city proposes a waste-to-energy incinerator. Stakeholders: nearby residents (health), government (waste crisis), green groups (emissions), industry (jobs).\nQ: Which stance best shows higher-order multi-perspective evaluation?'),
    [opt('同時權衡環境、社會與經濟三方面，連同減緩措施（排放管制、選址、獨立監測），作出有條件、有理據的判斷',
        'weigh the environmental, social and economic dimensions together — including mitigation (emission controls, siting, independent monitoring) — reaching a qualified, reasoned judgement'),
      opt('政府有需要就一定要興建，居民意見不重要',
        'the government needs it, so build it regardless of residents’ views'),
      opt('只要有任何一位居民反對就永不興建',
        'never build if any single resident objects'),
      opt('就業最重要，排放問題可以完全忽略',
        'jobs matter most, so emissions can be ignored entirely')],
    C('高階評鑑不是選邊站，而是把不同持份者的關切（健康、公共需要、環境、生計）一併放上枱，考慮可行的減緩與監測安排，再作有條件、可被理由支持的判斷。\n\n【陷阱拆解】其餘三項各偏一端（行政至上 / 一票否決 / 經濟壓倒環境），都把單一持份者的立場當成決定性，正是評鑑題要避開的單角度。',
      'Higher-order evaluation is not picking a side but putting every stakeholder concern (health, public need, environment, livelihoods) on the table, considering feasible mitigation and monitoring, then reaching a qualified, defensible judgement.\n\n【Trap】 The others each take one side (admin-supremacy / single veto / economy over environment), treating one stakeholder as decisive — exactly the single-angle trap.')),

  q(id('ev'), T.eval, FW.evaluate, 'hard', 2023, 3,
    C('就一項具爭議的公共政策（例如在市中心試行道路收費），下列哪一種回應，最能展現公社科最高階的「評鑑」能力？',
      'On a contested public policy (e.g. trialling a city-centre road charge), which response best shows the highest-order CSD “evaluation” skill?'),
    [opt('跨持份者衡量政策的成本與效益，結合證據與可行性，作出有保留、可被理由支持的判斷',
        'weigh the policy’s costs and benefits across stakeholders, combine evidence with feasibility, and reach a qualified, well-justified judgement'),
      opt('因為某一群體不喜歡，所以一定反對',
        'oppose it simply because one group dislikes it'),
      opt('無條件全力支持，毋須討論代價',
        'support it unconditionally with no discussion of costs'),
      opt('只羅列事實，拒絕作任何判斷',
        'just list facts and refuse to make any judgement')],
    C('評鑑（evaluate）的核心是「在證據與多方考量之上，作出有理據的判斷」。只列事實不下判斷，或無條件支持/反對，都未達評鑑層次。\n\n【陷阱拆解】「某群體唔鍾意就反對」屬訴諸群體；「無條件支持」缺乏代價衡量；「只列事實」停留在描述，缺少判斷——三者都不是評鑑。',
      'Evaluation means reaching a reasoned judgement on top of evidence and multiple considerations. Merely listing facts, or backing/opposing unconditionally, falls short of evaluation.\n\n【Trap】 “Oppose because a group dislikes it” is appeal to a group; “unconditional support” lacks cost-weighing; “just list facts” stays at description — none is evaluation.')),
]

// ── 概念應用・當代世界 ────────────────────────────────────────────────────────
const concept: Question[] = [
  q(id('co'), T.concept, FW.analysis, 'hard', 2024, 3,
    C('【示意個案】某國一個港口因事故關閉數週，導致全球多地的電子產品付運延誤、價格上升。\n問：這最能說明當代世界的哪一特徵？',
      '【Illustrative case】A port in one country closes for weeks after an accident, delaying electronics shipments and raising prices in many countries.\nQ: This best illustrates which feature of the contemporary world?'),
    [opt('互聯相依——在全球化經濟下，一地的局部干擾會透過供應鏈跨境傳遞',
        'interdependence — in a globalised economy a local disruption transmits across borders through supply chains'),
      opt('自給自足是當代經濟的主流',
        'self-sufficiency is the contemporary economic norm'),
      opt('閉關鎖國對所有國家最有利',
        'national isolation is best for every country'),
      opt('該事故只會影響該港口所在的國家',
        'the accident affects only the port’s own country')],
    C('一個港口的局部事故引發跨國連鎖反應，正是「互聯相依」的典型：全球供應鏈把各地經濟緊密扣連，局部衝擊會外溢。\n\n【陷阱拆解】「自給自足是主流」「閉關最有利」與全球化現實相反；「只影響一國」恰與「跨地價格上升」的材料相矛盾。',
      'A local port accident triggering a cross-border chain reaction is textbook interdependence: global supply chains tie economies together so local shocks spill over.\n\n【Trap】 “Self-sufficiency is the norm” and “isolation is best” contradict globalisation; “only one country” contradicts the worldwide price rise in the stimulus.')),

  q(id('co'), T.concept, FW.analysis, 'hard', 2023, 3,
    C('「可持續發展」常被界定為：滿足當代人的需要，而不損害後代滿足其需要的能力。\n問：一項以耗盡某不可再生資源來換取短期 GDP 高增長的政策，最直接違反了下列哪一原則？',
      '“Sustainable development” is commonly defined as meeting present needs without compromising future generations’ ability to meet theirs.\nQ: A policy that maximises short-term GDP by depleting a non-renewable resource MOST directly violates which principle?'),
    [opt('代際公平（可持續發展）——以當代消費換取，犧牲了後代的需要',
        'intergenerational equity (sustainable development) — advancing present consumption at the expense of future generations'),
      opt('法治原則',
        'the rule of law'),
      opt('自由市場的效率原則',
        'free-market efficiency'),
      opt('比較優勢原則',
        'the principle of comparative advantage')],
    C('耗盡不可再生資源以追求短期增長，正是把成本轉嫁後代，直接抵觸可持續發展的「代際公平」核心。\n\n【陷阱拆解】法治、市場效率、比較優勢各有所指，與「當代 vs 後代」的取捨並非同一範疇——揀中它們即概念張冠李戴。',
      'Exhausting a non-renewable resource for short-term growth shifts costs onto future generations — directly violating the intergenerational-equity core of sustainable development.\n\n【Trap】 Rule of law, market efficiency and comparative advantage concern other things, not the present-vs-future trade-off — picking them is a concept mismatch.')),

  q(id('co'), T.concept, FW.analysis, 'hard', 2024, 3,
    C('【示意個案】某國持續加大研發投入，專利申請量與高科技產品出口同步上升，於多項關鍵技術取得突破。\n問：這最能說明下列哪一關係？',
      '【Illustrative case】A country sustains heavy R&D spending; its patent filings and high-tech exports rise together, with breakthroughs in several key technologies.\nQ: This best illustrates which relationship?'),
    [opt('科技創新可成為提升綜合國力與競爭力的重要動力',
        'innovation can be a major driver of overall national strength and competitiveness'),
      opt('軍事力量是綜合國力的唯一構成',
        'military power is the only component of national strength'),
      opt('研發投入對經濟並無價值',
        'R&D spending has no economic value'),
      opt('專利愈多，國家競爭力反而愈低',
        'more patents means lower national competitiveness')],
    C('研發、專利與高科技出口同升，反映科技創新轉化為經濟與技術競爭力，是「綜合國力」的重要構成與動力。\n\n【陷阱拆解】「軍事是唯一構成」窄化了綜合國力（尚含經濟、科技、文化等）；「研發無價值」「專利愈多競爭力愈低」均與材料趨勢相反。',
      'R&D, patents and high-tech exports rising together show innovation converting into economic and technological competitiveness — a key component and driver of overall national strength.\n\n【Trap】 “Military is the only component” narrows national strength (which also spans economy, technology, culture); “R&D has no value” and “more patents = less competitive” both contradict the stimulus.')),

  q(id('co'), T.concept, FW.analysis, 'hard', 2022, 3,
    C('【示意議題】溫室氣體無論在何地排放，都會影響全球氣候，因此沒有任何單一國家可以獨力解決氣候變化。\n問：這最能說明下列哪一點？',
      '【Illustrative issue】Greenhouse gases, wherever emitted, affect the global climate, so no single country can solve climate change alone.\nQ: This best illustrates which point?'),
    [opt('氣候變化屬「全球公域」問題，須靠國際合作集體應對',
        'climate change is a “global commons” problem requiring collective international cooperation'),
      opt('每個國家各自為政就能解決',
        'each country acting on its own can solve it'),
      opt('問題只影響排放量最高的國家',
        'the problem affects only the highest-emitting country'),
      opt('要解決就必須完全停止一切經濟增長',
        'solving it requires halting all economic growth entirely')],
    C('排放的影響跨越國界、惠損與共，正是「全球公域」的特徵：個別國家難以獨力解決，需要國際協作。\n\n【陷阱拆解】「各自為政能解決」與跨境性質相違；「只影響最高排放國」忽略全球受影響；「必須完全停止增長」是非此即彼的過度推論，忽略了減排與發展可並行的中間路徑。',
      'Cross-border, shared-fate effects are the hallmark of a global commons: no country can fix it alone, so international cooperation is needed.\n\n【Trap】 “Each on its own” contradicts the cross-border nature; “only the top emitter” ignores global impact; “halt all growth” is an all-or-nothing overreach ignoring that mitigation and development can co-exist.')),
]

export const csdHellQuestions: Question[] = [...data, ...evaluate, ...concept]

export const csdHellTopics: Topic[] = topicList([
  { topic: T.data,    fw: FW.data,     count: data.length },
  { topic: T.eval,    fw: FW.evaluate, count: evaluate.length },
  { topic: T.concept, fw: FW.analysis, count: concept.length },
])
