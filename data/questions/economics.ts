import type { Question, Topic } from './types'

// DSE Economics (Micro + Macro). Rewritten study questions pitched at
// application / analysis level — concept traps, calculations and scenarios
// rather than one-line recall.
export const economicsQuestions: Question[] = [
  {
    id: 'econ_q1', type: 'mc', subject: 'economics', topic: 'basic_concepts', topicZh: '基礎概念',
    framework: 'scarcity_choice', frameworkZh: '稀缺與選擇', frameworkEmoji: '💡',
    difficulty: 'hard', year: 2022,
    content: '小明用一個下午，可以做以下其中一項：補習賺 $300、做兼職賺 $250，或免費入場睇朋友的演唱會。若他選擇睇演唱會，這個下午的「機會成本」是？',
    options: ['$300（補習）', '$550（補習＋兼職）', '$250（兼職）', '$0（演唱會免費入場）'],
    correctIndex: 0,
    explanation:
      '機會成本只計「放棄的最佳替代方案」的價值，不能把所有放棄項目相加。補習（$300）與兼職（$250）中最高者為補習，故機會成本為 $300。「免費入場」不等於零成本——成本在於放棄了的最佳選擇。考核重點：機會成本＝次佳方案的代價（不可相加，免費≠零成本）。',
    marks: 4,
  },
  {
    id: 'econ_q2', type: 'mc', subject: 'economics', topic: 'basic_concepts', topicZh: '基礎概念',
    framework: 'scarcity_choice', frameworkZh: '稀缺與選擇', frameworkEmoji: '💡',
    difficulty: 'medium', year: 2021,
    content: '一條向原點凸出（concave）的生產可能線（PPF）反映甚麼？',
    options: ['機會成本遞增', '機會成本固定不變', '資源可無限增加', '社會必然生產於線外'],
    correctIndex: 0,
    explanation:
      'PPF 向原點凸出，代表每多生產一單位某產品，需放棄的另一產品愈來愈多，即「機會成本遞增」（因資源並非完全適用於所有用途）。直線 PPF 才代表固定機會成本。考核重點：PPF 形狀與機會成本的關係。',
    marks: 3,
  },
  {
    id: 'econ_q3', type: 'mc', subject: 'economics', topic: 'basic_concepts', topicZh: '基礎概念',
    framework: 'scarcity_choice', frameworkZh: '稀缺與選擇', frameworkEmoji: '💡',
    difficulty: 'medium', year: 2020,
    content: '下列哪一句屬於「規範性陳述」（normative statement）？',
    options: ['政府應該增加對基層的福利開支', '失業率上升通常伴隨消費下降', '加稅會減少家庭可支配收入', '最低工資上調會影響聘用決定'],
    correctIndex: 0,
    explanation:
      '規範性陳述含價值判斷（「應該」「好／壞」），不能單憑事實驗證對錯；其餘三項為實證性陳述（positive），可用數據檢驗。考核重點：分辨實證與規範。',
    marks: 3,
  },
  {
    id: 'econ_q4', type: 'mc', subject: 'economics', topic: 'demand_supply', topicZh: '需求與供應',
    framework: 'market_mechanism', frameworkZh: '市場機制', frameworkEmoji: '📈',
    difficulty: 'hard', year: 2023,
    content: '其他因素不變，某產品「本身價格」下跌，會直接引致？',
    options: ['需求量增加（沿需求曲線下移）', '需求增加（需求曲線右移）', '需求減少（需求曲線左移）', '供應增加（供應曲線右移）'],
    correctIndex: 0,
    explanation:
      '產品「本身價格」變動只引起「需求量」沿同一需求曲線移動（movement along），不會令整條曲線移位。只有非價格因素（收入、相關物品價格、口味等）改變才令「需求」整條曲線移動。考核重點：需求 vs 需求量、移動 vs 移位的分別。',
    marks: 4,
  },
  {
    id: 'econ_q5', type: 'mc', subject: 'economics', topic: 'demand_supply', topicZh: '需求與供應',
    framework: 'market_mechanism', frameworkZh: '市場機制', frameworkEmoji: '📈',
    difficulty: 'medium', year: 2021,
    content: '咖啡與奶茶為替代品。若咖啡價格大幅上升，奶茶市場最可能出現？',
    options: ['奶茶需求增加，均衡價格與成交量上升', '奶茶需求減少，均衡價格下跌', '奶茶供應增加，價格下跌', '奶茶需求量沿原曲線下移'],
    correctIndex: 0,
    explanation:
      '替代品（咖啡）價格上升，消費者轉向奶茶，奶茶「需求」整條右移，均衡價格與成交量同時上升。考核重點：替代品價格與需求移位的方向。',
    marks: 3,
  },
  {
    id: 'econ_q6', type: 'mc', subject: 'economics', topic: 'demand_supply', topicZh: '需求與供應',
    framework: 'market_mechanism', frameworkZh: '市場機制', frameworkEmoji: '📈',
    difficulty: 'hard', year: 2022,
    content: '政府在市場均衡價格「以下」設定一個有效的價格上限（price ceiling），最可能造成？',
    options: ['短缺（需求量大於供應量）', '過剩（供應量大於需求量）', '均衡維持不變', '供應曲線右移'],
    correctIndex: 0,
    explanation:
      '有效的價格上限設於均衡價之下，價格被壓低使需求量增、供應量減，造成「短缺」，並可能衍生黑市、排隊等非價格競爭。若設於均衡價之上則無約束力。考核重點：價格上限的市場後果。',
    marks: 4,
  },
  {
    id: 'econ_q7', type: 'mc', subject: 'economics', topic: 'elasticity', topicZh: '彈性',
    framework: 'market_mechanism', frameworkZh: '市場機制', frameworkEmoji: '📊',
    difficulty: 'hard', year: 2023,
    content: '某商品價格由 $10 升至 $12（升 20%），需求量由 100 件跌至 85 件（跌 15%）。其需求價格彈性（PED，絕對值）及商品屬性為？',
    options: ['0.75，缺乏彈性', '1.33，富彈性', '0.75，富彈性', '1.33，缺乏彈性'],
    correctIndex: 0,
    explanation:
      'PED（絕對值）＝需求量變動百分比 ÷ 價格變動百分比 ＝ 15% ÷ 20% ＝ 0.75。小於 1 表示「缺乏彈性」（需求量對價格變動反應較小），常見於必需品。考核重點：PED 計算與分類（>1 富彈性、<1 缺乏彈性）。',
    marks: 4,
  },
  {
    id: 'econ_q8', type: 'mc', subject: 'economics', topic: 'elasticity', topicZh: '彈性',
    framework: 'market_mechanism', frameworkZh: '市場機制', frameworkEmoji: '📊',
    difficulty: 'hard', year: 2021,
    content: '若某產品需求「富彈性」（PED > 1），廠商提高售價，總收入（total revenue）會？',
    options: ['下跌', '上升', '不變', '必定先升後跌'],
    correctIndex: 0,
    explanation:
      '富彈性下，需求量變動百分比大於價格變動百分比，加價令銷量大幅下跌，總收入（價格 × 銷量）淨減少。相反，缺乏彈性時加價會增加總收入。考核重點：彈性與總收入的關係。',
    marks: 4,
  },
  {
    id: 'econ_q9', type: 'mc', subject: 'economics', topic: 'elasticity', topicZh: '彈性',
    framework: 'market_mechanism', frameworkZh: '市場機制', frameworkEmoji: '📊',
    difficulty: 'medium', year: 2020,
    content: '當消費者收入上升，某商品的需求量反而下跌。此商品的收入彈性（YED）及類型為？',
    options: ['YED 為負，劣等財（inferior good）', 'YED 為正，正常財', 'YED 為零，必需品', 'YED 大於 1，奢侈品'],
    correctIndex: 0,
    explanation:
      '收入上升而需求下跌，收入彈性（YED）為負，屬「劣等財」（如低檔即食麵）；正常財 YED 為正，其中奢侈品 YED > 1。考核重點：以 YED 正負判斷商品類別。',
    marks: 3,
  },
  {
    id: 'econ_q10', type: 'mc', subject: 'economics', topic: 'firm_production', topicZh: '廠商與生產',
    framework: 'production', frameworkZh: '生產理論', frameworkEmoji: '🏭',
    difficulty: 'medium', year: 2022,
    content: '在「短期」內，下列哪一項最屬於廠商的「固定成本」（fixed cost）？',
    options: ['廠房的租金', '生產用的原材料費', '按件計酬的散工工資', '隨產量變動的電費'],
    correctIndex: 0,
    explanation:
      '固定成本短期內不隨產量變動（即使停產仍須支付），如廠房租金、機器折舊；原材料、計件工資、可變電費屬「可變成本」。考核重點：短期固定 vs 可變成本的劃分。',
    marks: 3,
  },
  {
    id: 'econ_q11', type: 'mc', subject: 'economics', topic: 'firm_production', topicZh: '廠商與生產',
    framework: 'production', frameworkZh: '生產理論', frameworkEmoji: '🏭',
    difficulty: 'hard', year: 2021,
    content: '某廠商擴大生產規模後，「長期平均成本」（long-run average cost）持續下降。這現象稱為？',
    options: ['規模經濟（economies of scale）', '規模不經濟', '邊際報酬遞減', '外部成本上升'],
    correctIndex: 0,
    explanation:
      '長期平均成本隨產量擴大而下降即「規模經濟」（源於分工、大量採購、技術等）；若平均成本反升則為規模不經濟。注意「邊際報酬遞減」是短期、固定生產要素下的概念，與此不同。考核重點：規模經濟與短期邊際報酬遞減的區別。',
    marks: 4,
  },
  {
    id: 'econ_q12', type: 'mc', subject: 'economics', topic: 'market_structure', topicZh: '市場結構',
    framework: 'market_structure', frameworkZh: '市場結構', frameworkEmoji: '🏪',
    difficulty: 'medium', year: 2020,
    content: '在「完全競爭」市場中，個別廠商是「價格接受者」（price taker），主要因為？',
    options: ['產品同質且廠商眾多，個別廠商無力左右市價', '市場只得一家廠商壟斷供應', '入行門檻極高', '產品差異化程度很高'],
    correctIndex: 0,
    explanation:
      '完全競爭具備：廠商眾多、產品同質、資訊流通、自由出入市場，故個別廠商只能接受市價，其需求曲線為水平線。壟斷、高門檻、產品差異屬其他市場結構特徵。考核重點：完全競爭的假設與「價格接受者」成因。',
    marks: 3,
  },
  {
    id: 'econ_q13', type: 'mc', subject: 'economics', topic: 'market_structure', topicZh: '市場結構',
    framework: 'market_structure', frameworkZh: '市場結構', frameworkEmoji: '🏪',
    difficulty: 'hard', year: 2023,
    content: '相比完全競爭，「壟斷」市場通常導致？',
    options: ['產量較低、價格較高', '產量較高、價格較低', '價格剛好等於邊際成本', '廠商長期必然虧損'],
    correctIndex: 0,
    explanation:
      '壟斷者為「價格制定者」，為求利潤極大化會限制產量、訂較高價格（P > MC），造成無謂損失（deadweight loss）與配置無效率；完全競爭則 P = MC。考核重點：壟斷與完全競爭在產量／價格／效率上的比較。',
    marks: 4,
  },
  {
    id: 'econ_q14', type: 'mc', subject: 'economics', topic: 'market_failure', topicZh: '市場失靈',
    framework: 'efficiency', frameworkZh: '效率與干預', frameworkEmoji: '⚖️',
    difficulty: 'hard', year: 2022,
    content: '工廠排污令鄰近居民健康受損，但工廠毋須為此付費。從社會角度看，這代表？',
    options: ['存在負外部性，市場產量高於社會最適水平', '存在正外部性，市場產量低於社會最適水平', '純粹是公共財供應問題', '市場已達致配置效率'],
    correctIndex: 0,
    explanation:
      '排污成本由第三者（居民）承擔而非生產者，屬「負外部性」；私人成本低於社會成本，市場產量高於社會最適，造成市場失靈，政府可徵稅（庇古稅）或管制糾正。考核重點：負外部性導致過度生產。',
    marks: 4,
  },
  {
    id: 'econ_q15', type: 'mc', subject: 'economics', topic: 'market_failure', topicZh: '市場失靈',
    framework: 'efficiency', frameworkZh: '效率與干預', frameworkEmoji: '⚖️',
    difficulty: 'medium', year: 2021,
    content: '「公共財」（public good，如國防）的兩個基本特性是？',
    options: ['非排他性與非競爭性', '排他性與競爭性', '高彈性與低成本', '可分割且可自由買賣'],
    correctIndex: 0,
    explanation:
      '公共財具「非排他性」（無法阻止未付費者享用）與「非競爭性」（一人享用不減少他人可享用量），故易生「搭便車」問題，私人市場供應不足，需政府提供。考核重點：公共財的兩大特性及搭便車。',
    marks: 3,
  },
  {
    id: 'econ_q16', type: 'mc', subject: 'economics', topic: 'macroeconomics', topicZh: '宏觀經濟',
    framework: 'macro', frameworkZh: '宏觀經濟', frameworkEmoji: '🧮',
    difficulty: 'hard', year: 2023,
    content: '某國今年「名義 GDP」上升 6%，同期物價（GDP 平減指數）亦上升 6%。該國今年的「實質 GDP」大致？',
    options: ['維持不變', '上升約 6%', '上升約 12%', '下跌約 6%'],
    correctIndex: 0,
    explanation:
      '實質 GDP 增長率 ≈ 名義 GDP 增長率 − 物價增長率 ＝ 6% − 6% ≈ 0%，即實質產出無增長，升幅全由通脹造成。考核重點：名義 vs 實質、剔除物價因素。',
    marks: 4,
  },
  {
    id: 'econ_q17', type: 'mc', subject: 'economics', topic: 'macroeconomics', topicZh: '宏觀經濟',
    framework: 'macro', frameworkZh: '宏觀經濟', frameworkEmoji: '🧮',
    difficulty: 'hard', year: 2022,
    content: '工廠引入自動化機器，令一批欠缺新技能的工人失業。這屬於哪類失業？',
    options: ['結構性失業', '週期性失業', '摩擦性失業', '季節性失業'],
    correctIndex: 0,
    explanation:
      '因產業結構或技術改變，使工人技能與職位需求不匹配而失業，屬「結構性失業」；週期性源於經濟衰退、摩擦性源於轉工的過渡期。考核重點：分辨失業類型的成因。',
    marks: 4,
  },
  {
    id: 'econ_q18', type: 'mc', subject: 'economics', topic: 'macroeconomics', topicZh: '宏觀經濟',
    framework: 'macro', frameworkZh: '宏觀經濟', frameworkEmoji: '🧮',
    difficulty: 'medium', year: 2020,
    content: '若一國總需求持續快速增長、超出經濟的生產能力，最可能引致？',
    options: ['需求拉動型通脹（demand-pull）', '成本推動型通脹（cost-push）', '通縮（deflation）', '純供應衝擊造成的停滯性通脹'],
    correctIndex: 0,
    explanation:
      '總需求過度增長、「太多金錢追逐太少貨物」，推高物價即需求拉動型通脹；成本推動型則源於生產成本（工資、原料）上升。考核重點：兩類通脹的成因區分。',
    marks: 3,
  },
  {
    id: 'econ_q19', type: 'mc', subject: 'economics', topic: 'trade', topicZh: '國際貿易',
    framework: 'international', frameworkZh: '國際經濟', frameworkEmoji: '🌐',
    difficulty: 'hard', year: 2023,
    content: '即使甲國生產所有產品的效率都高於乙國，兩國分工後仍可透過貿易互利。這主要基於哪個原理？',
    options: ['比較優勢（comparative advantage）', '絕對優勢（absolute advantage）', '貿易保護主義', '規模不經濟'],
    correctIndex: 0,
    explanation:
      '互利貿易的基礎是「比較優勢」——各國專注生產自己「機會成本較低」的產品再交換，即使一國對所有產品都有絕對優勢，雙方仍可得益。考核重點：比較優勢（機會成本）而非絕對優勢決定分工。',
    marks: 4,
  },
  {
    id: 'econ_q20', type: 'mc', subject: 'economics', topic: 'trade', topicZh: '國際貿易',
    framework: 'international', frameworkZh: '國際經濟', frameworkEmoji: '🌐',
    difficulty: 'hard', year: 2021,
    content: '若港元相對美元貶值（其他因素不變），對香港進出口最直接的影響是？',
    options: ['出口在外國變平、進口在本地變貴', '出口變貴、進口變平', '進出口價格都下跌', '對進出口都沒有影響'],
    correctIndex: 0,
    explanation:
      '本幣貶值令以外幣計的出口價下降（出口較有競爭力、傾向增加），而以本幣購入的進口品變貴（進口傾向減少）。考核重點：匯率變動對進出口價格的方向性影響。',
    marks: 4,
  },
]

export const economicsTopics: Topic[] = [
  { id: 'basic_concepts', zh: '基礎概念', framework: '稀缺與選擇', emoji: '💡', count: 3 },
  { id: 'demand_supply', zh: '需求與供應', framework: '市場機制', emoji: '📈', count: 3 },
  { id: 'elasticity', zh: '彈性', framework: '市場機制', emoji: '📊', count: 3 },
  { id: 'firm_production', zh: '廠商與生產', framework: '生產理論', emoji: '🏭', count: 2 },
  { id: 'market_structure', zh: '市場結構', framework: '市場結構', emoji: '🏪', count: 2 },
  { id: 'market_failure', zh: '市場失靈', framework: '效率與干預', emoji: '⚖️', count: 2 },
  { id: 'macroeconomics', zh: '宏觀經濟', framework: '宏觀經濟', emoji: '🧮', count: 3 },
  { id: 'trade', zh: '國際貿易', framework: '國際經濟', emoji: '🌐', count: 2 },
]
