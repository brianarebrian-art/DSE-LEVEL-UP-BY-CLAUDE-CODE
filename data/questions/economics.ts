import type { Question, Topic } from './types'

// DSE Economics (Micro + Macro). Rewritten study questions pitched at
// application / analysis level — concept traps, calculations and scenarios
// rather than one-line recall. Fully bilingual (中 / EN).
export const economicsQuestions: Question[] = [
  {
    id: 'econ_q1', type: 'mc', subject: 'economics', topic: 'basic_concepts', topicZh: '基礎概念', topicEn: 'Basic Concepts',
    framework: 'scarcity_choice', frameworkZh: '稀缺與選擇', frameworkEn: 'Scarcity & Choice', frameworkEmoji: '💡',
    difficulty: 'hard', year: 2022,
    content: '小明用一個下午，可以做以下其中一項：補習賺 \\$300、做兼職賺 \\$250，或免費入場睇朋友的演唱會。若他選擇睇演唱會，這個下午的「機會成本」是？',
    contentEn: 'In one afternoon, Siu Ming can do exactly one of: earn \\$300 from tutoring, earn \\$250 from a part-time job, or attend a friend’s concert for free. If he chooses the concert, the opportunity cost of this afternoon is?',
    options: ['\\$300（補習）', '\\$550（補習＋兼職）', '\\$250（兼職）', '\\$0（演唱會免費入場）'],
    optionsEn: ['\\$300 (tutoring)', '\\$550 (tutoring + part-time)', '\\$250 (part-time job)', '\\$0 (the concert is free)'],
    correctIndex: 0,
    explanation:
      '機會成本只計「放棄的最佳替代方案」的價值，不能把所有放棄項目相加。補習（\\$300）與兼職（\\$250）中最高者為補習，故機會成本為 \\$300。「免費入場」不等於零成本——成本在於放棄了的最佳選擇。考核重點：機會成本＝次佳方案的代價（不可相加，免費≠零成本）。',
    explanationEn:
      'Opportunity cost counts only the value of the single best alternative given up — you cannot add up all forgone options. Between tutoring (\\$300) and the part-time job (\\$250) the higher is tutoring, so the opportunity cost is \\$300. "Free admission" does not mean zero cost — the cost is the best option sacrificed. Key point: opportunity cost = value of the next-best alternative (not a sum; free ≠ zero cost).',
    marks: 4,
  },
  {
    id: 'econ_q2', type: 'mc', subject: 'economics', topic: 'basic_concepts', topicZh: '基礎概念', topicEn: 'Basic Concepts',
    framework: 'scarcity_choice', frameworkZh: '稀缺與選擇', frameworkEn: 'Scarcity & Choice', frameworkEmoji: '💡',
    difficulty: 'medium', year: 2021,
    content: '一條向原點凸出（concave）的生產可能線（PPF）反映甚麼？',
    contentEn: 'A production possibilities frontier (PPF) that is concave to the origin reflects what?',
    options: ['機會成本遞增', '機會成本固定不變', '資源可無限增加', '社會必然生產於線外'],
    optionsEn: ['Increasing opportunity cost', 'Constant opportunity cost', 'Resources can increase without limit', 'Society must produce outside the curve'],
    correctIndex: 0,
    explanation:
      'PPF 向原點凸出，代表每多生產一單位某產品，需放棄的另一產品愈來愈多，即「機會成本遞增」（因資源並非完全適用於所有用途）。直線 PPF 才代表固定機會成本。考核重點：PPF 形狀與機會成本的關係。',
    explanationEn:
      'A PPF concave to the origin means each extra unit of one good requires giving up ever more of the other good — i.e. increasing opportunity cost (resources are not equally suited to all uses). A straight-line PPF represents constant opportunity cost. Key point: PPF shape vs opportunity cost.',
    marks: 3,
  },
  {
    id: 'econ_q3', type: 'mc', subject: 'economics', topic: 'basic_concepts', topicZh: '基礎概念', topicEn: 'Basic Concepts',
    framework: 'scarcity_choice', frameworkZh: '稀缺與選擇', frameworkEn: 'Scarcity & Choice', frameworkEmoji: '💡',
    difficulty: 'medium', year: 2020,
    content: '下列哪一句屬於「規範性陳述」（normative statement）？',
    contentEn: 'Which of the following is a "normative statement"?',
    options: ['政府應該增加對基層的福利開支', '失業率上升通常伴隨消費下降', '加稅會減少家庭可支配收入', '最低工資上調會影響聘用決定'],
    optionsEn: ['The government should increase welfare spending on the grassroots', 'A rising unemployment rate usually accompanies falling consumption', 'Raising taxes reduces households’ disposable income', 'Raising the minimum wage affects hiring decisions'],
    correctIndex: 0,
    explanation:
      '規範性陳述含價值判斷（「應該」「好／壞」），不能單憑事實驗證對錯；其餘三項為實證性陳述（positive），可用數據檢驗。考核重點：分辨實證與規範。',
    explanationEn:
      'A normative statement carries a value judgement ("should", "good/bad") and cannot be verified by facts alone; the other three are positive statements testable against data. Key point: positive vs normative.',
    marks: 3,
  },
  {
    id: 'econ_q4', type: 'mc', subject: 'economics', topic: 'demand_supply', topicZh: '需求與供應', topicEn: 'Demand & Supply',
    framework: 'market_mechanism', frameworkZh: '市場機制', frameworkEn: 'Market Mechanism', frameworkEmoji: '📈',
    difficulty: 'hard', year: 2023,
    content: '其他因素不變，某產品「本身價格」下跌，會直接引致？',
    contentEn: 'Other things equal, a fall in a product’s "own price" directly causes?',
    options: ['需求量增加（沿需求曲線下移）', '需求增加（需求曲線右移）', '需求減少（需求曲線左移）', '供應增加（供應曲線右移）'],
    optionsEn: ['Quantity demanded rises (a movement down the demand curve)', 'Demand rises (the demand curve shifts right)', 'Demand falls (the demand curve shifts left)', 'Supply rises (the supply curve shifts right)'],
    correctIndex: 0,
    explanation:
      '產品「本身價格」變動只引起「需求量」沿同一需求曲線移動（movement along），不會令整條曲線移位。只有非價格因素（收入、相關物品價格、口味等）改變才令「需求」整條曲線移動。考核重點：需求 vs 需求量、移動 vs 移位的分別。',
    explanationEn:
      'A change in a product’s "own price" only causes a movement along the same demand curve (a change in quantity demanded), not a shift of the whole curve. Only non-price factors (income, prices of related goods, tastes) shift "demand". Key point: demand vs quantity demanded; shift vs movement.',
    marks: 4,
  },
  {
    id: 'econ_q5', type: 'mc', subject: 'economics', topic: 'demand_supply', topicZh: '需求與供應', topicEn: 'Demand & Supply',
    framework: 'market_mechanism', frameworkZh: '市場機制', frameworkEn: 'Market Mechanism', frameworkEmoji: '📈',
    difficulty: 'medium', year: 2021,
    content: '咖啡與奶茶為替代品。若咖啡價格大幅上升，奶茶市場最可能出現？',
    contentEn: 'Coffee and milk tea are substitutes. If the price of coffee rises sharply, the milk-tea market will most likely show?',
    options: ['奶茶需求增加，均衡價格與成交量上升', '奶茶需求減少，均衡價格下跌', '奶茶供應增加，價格下跌', '奶茶需求量沿原曲線下移'],
    optionsEn: ['Demand for milk tea rises; equilibrium price and quantity both rise', 'Demand for milk tea falls; equilibrium price falls', 'Supply of milk tea rises; price falls', 'Quantity of milk tea demanded moves down the original curve'],
    correctIndex: 0,
    explanation:
      '替代品（咖啡）價格上升，消費者轉向奶茶，奶茶「需求」整條右移，均衡價格與成交量同時上升。考核重點：替代品價格與需求移位的方向。',
    explanationEn:
      'When a substitute (coffee) rises in price, consumers switch to milk tea, so the "demand" for milk tea shifts right, raising both equilibrium price and quantity. Key point: a substitute’s price and the direction of the demand shift.',
    marks: 3,
  },
  {
    id: 'econ_q6', type: 'mc', subject: 'economics', topic: 'demand_supply', topicZh: '需求與供應', topicEn: 'Demand & Supply',
    framework: 'market_mechanism', frameworkZh: '市場機制', frameworkEn: 'Market Mechanism', frameworkEmoji: '📈',
    difficulty: 'hard', year: 2022,
    content: '政府在市場均衡價格「以下」設定一個有效的價格上限（price ceiling），最可能造成？',
    contentEn: 'If the government sets an effective price ceiling "below" the market equilibrium price, the most likely result is?',
    options: ['短缺（需求量大於供應量）', '過剩（供應量大於需求量）', '均衡維持不變', '供應曲線右移'],
    optionsEn: ['A shortage (quantity demanded exceeds quantity supplied)', 'A surplus (quantity supplied exceeds quantity demanded)', 'The equilibrium stays unchanged', 'The supply curve shifts right'],
    correctIndex: 0,
    explanation:
      '有效的價格上限設於均衡價之下，價格被壓低使需求量增、供應量減，造成「短缺」，並可能衍生黑市、排隊等非價格競爭。若設於均衡價之上則無約束力。考核重點：價格上限的市場後果。',
    explanationEn:
      'An effective price ceiling below equilibrium pushes price down, raising quantity demanded and lowering quantity supplied — a shortage, possibly with black markets and queuing (non-price competition). A ceiling above equilibrium would not bind. Key point: consequences of a price ceiling.',
    marks: 4,
  },
  {
    id: 'econ_q7', type: 'mc', subject: 'economics', topic: 'elasticity', topicZh: '彈性', topicEn: 'Elasticity',
    framework: 'market_mechanism', frameworkZh: '市場機制', frameworkEn: 'Market Mechanism', frameworkEmoji: '📊',
    difficulty: 'hard', year: 2023,
    content: '某商品價格由 \\$10 升至 \\$12（升 20%），需求量由 100 件跌至 85 件（跌 15%）。其需求價格彈性（PED，絕對值）及商品屬性為？',
    contentEn: 'A product’s price rises from \\$10 to \\$12 (up 20%) and quantity demanded falls from 100 to 85 units (down 15%). Its price elasticity of demand (PED, absolute value) and the good’s nature are?',
    options: ['0.75，缺乏彈性', '1.33，富彈性', '0.75，富彈性', '1.33，缺乏彈性'],
    optionsEn: ['0.75, inelastic', '1.33, elastic', '0.75, elastic', '1.33, inelastic'],
    correctIndex: 0,
    explanation:
      'PED（絕對值）＝需求量變動百分比 ÷ 價格變動百分比 ＝ 15% ÷ 20% ＝ 0.75。小於 1 表示「缺乏彈性」（需求量對價格變動反應較小），常見於必需品。考核重點：PED 計算與分類（>1 富彈性、<1 缺乏彈性）。',
    explanationEn:
      'PED (absolute value) = % change in quantity demanded ÷ % change in price = 15% ÷ 20% = 0.75. Below 1 means "inelastic" (quantity responds relatively little to price), common for necessities. Key point: PED calculation and classification (>1 elastic, <1 inelastic).',
    marks: 4,
  },
  {
    id: 'econ_q8', type: 'mc', subject: 'economics', topic: 'elasticity', topicZh: '彈性', topicEn: 'Elasticity',
    framework: 'market_mechanism', frameworkZh: '市場機制', frameworkEn: 'Market Mechanism', frameworkEmoji: '📊',
    difficulty: 'hard', year: 2021,
    content: '若某產品需求「富彈性」（PED > 1），廠商提高售價，總收入（total revenue）會？',
    contentEn: 'If a product’s demand is "elastic" (PED > 1) and the firm raises its price, total revenue will?',
    options: ['下跌', '上升', '不變', '必定先升後跌'],
    optionsEn: ['Fall', 'Rise', 'Stay unchanged', 'Necessarily rise then fall'],
    correctIndex: 0,
    explanation:
      '富彈性下，需求量變動百分比大於價格變動百分比，加價令銷量大幅下跌，總收入（價格 × 銷量）淨減少。相反，缺乏彈性時加價會增加總收入。考核重點：彈性與總收入的關係。',
    explanationEn:
      'When demand is elastic, the % fall in quantity exceeds the % rise in price, so raising price cuts sales sharply and total revenue (price × quantity) falls. When demand is inelastic, raising price increases total revenue. Key point: elasticity and total revenue.',
    marks: 4,
  },
  {
    id: 'econ_q9', type: 'mc', subject: 'economics', topic: 'elasticity', topicZh: '彈性', topicEn: 'Elasticity',
    framework: 'market_mechanism', frameworkZh: '市場機制', frameworkEn: 'Market Mechanism', frameworkEmoji: '📊',
    difficulty: 'medium', year: 2020,
    content: '當消費者收入上升，某商品的需求量反而下跌。此商品的收入彈性（YED）及類型為？',
    contentEn: 'When consumers’ income rises, the quantity demanded of a certain good falls instead. This good’s income elasticity (YED) and type are?',
    options: ['YED 為負，劣等財（inferior good）', 'YED 為正，正常財', 'YED 為零，必需品', 'YED 大於 1，奢侈品'],
    optionsEn: ['YED negative, an inferior good', 'YED positive, a normal good', 'YED zero, a necessity', 'YED greater than 1, a luxury'],
    correctIndex: 0,
    explanation:
      '收入上升而需求下跌，收入彈性（YED）為負，屬「劣等財」（如低檔即食麵）；正常財 YED 為正，其中奢侈品 YED > 1。考核重點：以 YED 正負判斷商品類別。',
    explanationEn:
      'Income rises but demand falls, so income elasticity (YED) is negative — an "inferior good" (e.g. cheap instant noodles). Normal goods have positive YED, and luxuries have YED > 1. Key point: using the sign of YED to classify a good.',
    marks: 3,
  },
  {
    id: 'econ_q10', type: 'mc', subject: 'economics', topic: 'firm_production', topicZh: '廠商與生產', topicEn: 'Firms & Production',
    framework: 'production', frameworkZh: '生產理論', frameworkEn: 'Production Theory', frameworkEmoji: '🏭',
    difficulty: 'medium', year: 2022,
    content: '在「短期」內，下列哪一項最屬於廠商的「固定成本」（fixed cost）？',
    contentEn: 'In the "short run", which of the following is most likely a firm’s "fixed cost"?',
    options: ['廠房的租金', '生產用的原材料費', '按件計酬的散工工資', '隨產量變動的電費'],
    optionsEn: ['Rent of the factory premises', 'Cost of raw materials for production', 'Piece-rate wages of casual workers', 'Electricity that varies with output'],
    correctIndex: 0,
    explanation:
      '固定成本短期內不隨產量變動（即使停產仍須支付），如廠房租金、機器折舊；原材料、計件工資、可變電費屬「可變成本」。考核重點：短期固定 vs 可變成本的劃分。',
    explanationEn:
      'A fixed cost does not vary with output in the short run (paid even if production stops), e.g. factory rent or machine depreciation; raw materials, piece-rate wages and variable electricity are variable costs. Key point: short-run fixed vs variable costs.',
    marks: 3,
  },
  {
    id: 'econ_q11', type: 'mc', subject: 'economics', topic: 'firm_production', topicZh: '廠商與生產', topicEn: 'Firms & Production',
    framework: 'production', frameworkZh: '生產理論', frameworkEn: 'Production Theory', frameworkEmoji: '🏭',
    difficulty: 'hard', year: 2021,
    content: '某廠商擴大生產規模後，「長期平均成本」（long-run average cost）持續下降。這現象稱為？',
    contentEn: 'After a firm expands its scale of production, its "long-run average cost" keeps falling. This phenomenon is called?',
    options: ['規模經濟（economies of scale）', '規模不經濟', '邊際報酬遞減', '外部成本上升'],
    optionsEn: ['Economies of scale', 'Diseconomies of scale', 'Diminishing marginal returns', 'Rising external costs'],
    correctIndex: 0,
    explanation:
      '長期平均成本隨產量擴大而下降即「規模經濟」（源於分工、大量採購、技術等）；若平均成本反升則為規模不經濟。注意「邊際報酬遞減」是短期、固定生產要素下的概念，與此不同。考核重點：規模經濟與短期邊際報酬遞減的區別。',
    explanationEn:
      'Long-run average cost falling as output expands is "economies of scale" (from division of labour, bulk buying, technology); if it rises instead it is diseconomies of scale. Note "diminishing marginal returns" is a short-run idea under a fixed factor — different from this. Key point: economies of scale vs short-run diminishing returns.',
    marks: 4,
  },
  {
    id: 'econ_q12', type: 'mc', subject: 'economics', topic: 'market_structure', topicZh: '市場結構', topicEn: 'Market Structure',
    framework: 'market_structure', frameworkZh: '市場結構', frameworkEn: 'Market Structure', frameworkEmoji: '🏪',
    difficulty: 'medium', year: 2020,
    content: '在「完全競爭」市場中，個別廠商是「價格接受者」（price taker），主要因為？',
    contentEn: 'In a "perfectly competitive" market, an individual firm is a "price taker" mainly because?',
    options: ['產品同質且廠商眾多，個別廠商無力左右市價', '市場只得一家廠商壟斷供應', '入行門檻極高', '產品差異化程度很高'],
    optionsEn: ['Products are homogeneous and firms are numerous, so no single firm can sway the market price', 'Only one firm monopolises supply', 'Barriers to entry are extremely high', 'Products are highly differentiated'],
    correctIndex: 0,
    explanation:
      '完全競爭具備：廠商眾多、產品同質、資訊流通、自由出入市場，故個別廠商只能接受市價，其需求曲線為水平線。壟斷、高門檻、產品差異屬其他市場結構特徵。考核重點：完全競爭的假設與「價格接受者」成因。',
    explanationEn:
      'Perfect competition has many firms, homogeneous products, free information flow and free entry/exit, so a firm can only accept the market price and faces a horizontal demand curve. Monopoly, high barriers and product differentiation belong to other structures. Key point: assumptions of perfect competition and why firms are price takers.',
    marks: 3,
  },
  {
    id: 'econ_q13', type: 'mc', subject: 'economics', topic: 'market_structure', topicZh: '市場結構', topicEn: 'Market Structure',
    framework: 'market_structure', frameworkZh: '市場結構', frameworkEn: 'Market Structure', frameworkEmoji: '🏪',
    difficulty: 'hard', year: 2023,
    content: '相比完全競爭，「壟斷」市場通常導致？',
    contentEn: 'Compared with perfect competition, a "monopoly" market usually leads to?',
    options: ['產量較低、價格較高', '產量較高、價格較低', '價格剛好等於邊際成本', '廠商長期必然虧損'],
    optionsEn: ['Lower output and higher price', 'Higher output and lower price', 'Price exactly equal to marginal cost', 'The firm necessarily making a long-run loss'],
    correctIndex: 0,
    explanation:
      '壟斷者為「價格制定者」，為求利潤極大化會限制產量、訂較高價格（P > MC），造成無謂損失（deadweight loss）與配置無效率；完全競爭則 P = MC。考核重點：壟斷與完全競爭在產量／價格／效率上的比較。',
    explanationEn:
      'A monopolist is a "price maker"; to maximise profit it restricts output and sets a higher price (P > MC), causing deadweight loss and allocative inefficiency. Perfect competition gives P = MC. Key point: monopoly vs perfect competition on output / price / efficiency.',
    marks: 4,
  },
  {
    id: 'econ_q14', type: 'mc', subject: 'economics', topic: 'market_failure', topicZh: '市場失靈', topicEn: 'Market Failure',
    framework: 'efficiency', frameworkZh: '效率與干預', frameworkEn: 'Efficiency & Intervention', frameworkEmoji: '⚖️',
    difficulty: 'hard', year: 2022,
    content: '工廠排污令鄰近居民健康受損，但工廠毋須為此付費。從社會角度看，這代表？',
    contentEn: 'A factory’s pollution harms the health of nearby residents, but the factory does not pay for it. From society’s viewpoint, this represents?',
    options: ['存在負外部性，市場產量高於社會最適水平', '存在正外部性，市場產量低於社會最適水平', '純粹是公共財供應問題', '市場已達致配置效率'],
    optionsEn: ['A negative externality; market output is above the socially optimal level', 'A positive externality; market output is below the socially optimal level', 'Purely a public-good provision problem', 'The market has already achieved allocative efficiency'],
    correctIndex: 0,
    explanation:
      '排污成本由第三者（居民）承擔而非生產者，屬「負外部性」；私人成本低於社會成本，市場產量高於社會最適，造成市場失靈，政府可徵稅（庇古稅）或管制糾正。考核重點：負外部性導致過度生產。',
    explanationEn:
      'The cost of pollution is borne by a third party (residents), not the producer — a "negative externality"; private cost is below social cost, so market output exceeds the social optimum, a market failure correctable by a tax (Pigouvian tax) or regulation. Key point: negative externalities cause over-production.',
    marks: 4,
  },
  {
    id: 'econ_q15', type: 'mc', subject: 'economics', topic: 'market_failure', topicZh: '市場失靈', topicEn: 'Market Failure',
    framework: 'efficiency', frameworkZh: '效率與干預', frameworkEn: 'Efficiency & Intervention', frameworkEmoji: '⚖️',
    difficulty: 'medium', year: 2021,
    content: '「公共財」（public good，如國防）的兩個基本特性是？',
    contentEn: 'The two basic characteristics of a "public good" (e.g. national defence) are?',
    options: ['非排他性與非競爭性', '排他性與競爭性', '高彈性與低成本', '可分割且可自由買賣'],
    optionsEn: ['Non-excludability and non-rivalry', 'Excludability and rivalry', 'High elasticity and low cost', 'Divisible and freely tradable'],
    correctIndex: 0,
    explanation:
      '公共財具「非排他性」（無法阻止未付費者享用）與「非競爭性」（一人享用不減少他人可享用量），故易生「搭便車」問題，私人市場供應不足，需政府提供。考核重點：公共財的兩大特性及搭便車。',
    explanationEn:
      'A public good is "non-excludable" (you cannot stop non-payers from enjoying it) and "non-rival" (one person’s use does not reduce what is available to others), so it suffers the free-rider problem and is under-supplied by private markets, needing government provision. Key point: the two features of a public good and free-riding.',
    marks: 3,
  },
  {
    id: 'econ_q16', type: 'mc', subject: 'economics', topic: 'macroeconomics', topicZh: '宏觀經濟', topicEn: 'Macroeconomics',
    framework: 'macro', frameworkZh: '宏觀經濟', frameworkEn: 'Macroeconomics', frameworkEmoji: '🧮',
    difficulty: 'hard', year: 2023,
    content: '某國今年「名義 GDP」上升 6%，同期物價（GDP 平減指數）亦上升 6%。該國今年的「實質 GDP」大致？',
    contentEn: 'A country’s "nominal GDP" rises 6% this year, while prices (the GDP deflator) also rise 6%. The country’s "real GDP" this year is roughly?',
    options: ['維持不變', '上升約 6%', '上升約 12%', '下跌約 6%'],
    optionsEn: ['Unchanged', 'Up about 6%', 'Up about 12%', 'Down about 6%'],
    correctIndex: 0,
    explanation:
      '實質 GDP 增長率 ≈ 名義 GDP 增長率 − 物價增長率 ＝ 6% − 6% ≈ 0%，即實質產出無增長，升幅全由通脹造成。考核重點：名義 vs 實質、剔除物價因素。',
    explanationEn:
      'Real GDP growth ≈ nominal GDP growth − inflation = 6% − 6% ≈ 0%, i.e. no growth in real output — the rise is entirely due to inflation. Key point: nominal vs real; removing the price effect.',
    marks: 4,
  },
  {
    id: 'econ_q17', type: 'mc', subject: 'economics', topic: 'macroeconomics', topicZh: '宏觀經濟', topicEn: 'Macroeconomics',
    framework: 'macro', frameworkZh: '宏觀經濟', frameworkEn: 'Macroeconomics', frameworkEmoji: '🧮',
    difficulty: 'hard', year: 2022,
    content: '工廠引入自動化機器，令一批欠缺新技能的工人失業。這屬於哪類失業？',
    contentEn: 'A factory introduces automated machines, leaving a group of workers who lack new skills unemployed. This is which type of unemployment?',
    options: ['結構性失業', '週期性失業', '摩擦性失業', '季節性失業'],
    optionsEn: ['Structural unemployment', 'Cyclical unemployment', 'Frictional unemployment', 'Seasonal unemployment'],
    correctIndex: 0,
    explanation:
      '因產業結構或技術改變，使工人技能與職位需求不匹配而失業，屬「結構性失業」；週期性源於經濟衰退、摩擦性源於轉工的過渡期。考核重點：分辨失業類型的成因。',
    explanationEn:
      'When changes in industry structure or technology leave workers’ skills mismatched with job requirements, the result is "structural unemployment"; cyclical comes from recessions and frictional from the transition between jobs. Key point: distinguishing the causes of unemployment types.',
    marks: 4,
  },
  {
    id: 'econ_q18', type: 'mc', subject: 'economics', topic: 'macroeconomics', topicZh: '宏觀經濟', topicEn: 'Macroeconomics',
    framework: 'macro', frameworkZh: '宏觀經濟', frameworkEn: 'Macroeconomics', frameworkEmoji: '🧮',
    difficulty: 'medium', year: 2020,
    content: '若一國總需求持續快速增長、超出經濟的生產能力，最可能引致？',
    contentEn: 'If a country’s aggregate demand keeps growing rapidly, beyond the economy’s productive capacity, the most likely result is?',
    options: ['需求拉動型通脹（demand-pull）', '成本推動型通脹（cost-push）', '通縮（deflation）', '純供應衝擊造成的停滯性通脹'],
    optionsEn: ['Demand-pull inflation', 'Cost-push inflation', 'Deflation', 'Stagflation purely from a supply shock'],
    correctIndex: 0,
    explanation:
      '總需求過度增長、「太多金錢追逐太少貨物」，推高物價即需求拉動型通脹；成本推動型則源於生產成本（工資、原料）上升。考核重點：兩類通脹的成因區分。',
    explanationEn:
      'Excess growth in aggregate demand — "too much money chasing too few goods" — pushes prices up: demand-pull inflation. Cost-push inflation instead comes from rising production costs (wages, raw materials). Key point: distinguishing the causes of the two inflation types.',
    marks: 3,
  },
  {
    id: 'econ_q19', type: 'mc', subject: 'economics', topic: 'trade', topicZh: '國際貿易', topicEn: 'International Trade',
    framework: 'international', frameworkZh: '國際經濟', frameworkEn: 'International Economics', frameworkEmoji: '🌐',
    difficulty: 'hard', year: 2023,
    content: '即使甲國生產所有產品的效率都高於乙國，兩國分工後仍可透過貿易互利。這主要基於哪個原理？',
    contentEn: 'Even if Country A produces every good more efficiently than Country B, the two can still gain mutually from trade after specialising. This rests mainly on which principle?',
    options: ['比較優勢（comparative advantage）', '絕對優勢（absolute advantage）', '貿易保護主義', '規模不經濟'],
    optionsEn: ['Comparative advantage', 'Absolute advantage', 'Trade protectionism', 'Diseconomies of scale'],
    correctIndex: 0,
    explanation:
      '互利貿易的基礎是「比較優勢」——各國專注生產自己「機會成本較低」的產品再交換，即使一國對所有產品都有絕對優勢，雙方仍可得益。考核重點：比較優勢（機會成本）而非絕對優勢決定分工。',
    explanationEn:
      'Mutually beneficial trade rests on "comparative advantage" — each country specialises in the good for which its opportunity cost is lower and then trades; even if one country has an absolute advantage in all goods, both can still gain. Key point: comparative advantage (opportunity cost), not absolute advantage, drives specialisation.',
    marks: 4,
  },
  {
    id: 'econ_q20', type: 'mc', subject: 'economics', topic: 'trade', topicZh: '國際貿易', topicEn: 'International Trade',
    framework: 'international', frameworkZh: '國際經濟', frameworkEn: 'International Economics', frameworkEmoji: '🌐',
    difficulty: 'hard', year: 2021,
    content: '若港元相對美元貶值（其他因素不變），對香港進出口最直接的影響是？',
    contentEn: 'If the Hong Kong dollar depreciates against the US dollar (other things equal), the most direct effect on Hong Kong’s imports and exports is?',
    options: ['出口在外國變平、進口在本地變貴', '出口變貴、進口變平', '進出口價格都下跌', '對進出口都沒有影響'],
    optionsEn: ['Exports become cheaper abroad and imports become dearer at home', 'Exports become dearer and imports cheaper', 'Both import and export prices fall', 'No effect on either imports or exports'],
    correctIndex: 0,
    explanation:
      '本幣貶值令以外幣計的出口價下降（出口較有競爭力、傾向增加），而以本幣購入的進口品變貴（進口傾向減少）。考核重點：匯率變動對進出口價格的方向性影響。',
    explanationEn:
      'A depreciation of the local currency lowers the foreign-currency price of exports (more competitive, tending to rise) while making imports bought in local currency dearer (tending to fall). Key point: the directional effect of exchange-rate changes on import/export prices.',
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
