// ⚠️ 由 scripts/gen-study-notes.mts 產生 —— 請勿手動修改。
import type { StudyNote } from '../types'

export const notes: Record<string, StudyNote> = {
  "basic_concepts": {
    "subjectId": "economics",
    "topicId": "basic_concepts",
    "titleZh": "基礎概念",
    "titleEn": "Basic Concepts",
    "conceptZh": "機會成本只計放棄的「最佳」替代方案（\\$300），不可相加，免費≠零成本。",
    "conceptEn": "Opportunity cost is the single best forgone alternative (\\$300); not a sum, and \"free\" ≠ zero cost.",
    "mustKnowZh": [
      "機會成本只計放棄的「最佳」替代方案（\\$300），不可相加，免費≠零成本。",
      "機會成本包含非貨幣成本。",
      "\\$120 已付且不可收回，屬沉沒成本，不應影響當下決策。",
      "機會成本 = 放棄的「單一最佳」替代選項的價值，即兼職 \\$300（不是兩個放棄選項相加，也不是被選中選項本身的價值）。"
    ],
    "mustKnowEn": [
      "Opportunity cost is the single best forgone alternative (\\$300); not a sum, and \"free\" ≠ zero cost.",
      "Opportunity cost includes non-monetary costs. A longer wait means more forgone time (and its best use), so the opportunity cost rises — even though the menu price is unchanged.",
      "The \\$120 is paid and unrecoverable — a sunk cost that must not sway the choice now. Compare only future value: if leaving frees time for something better, leave. Staying \"so it…",
      "Opportunity cost is the value of the single best forgone alternative — the \\$300 job (not the sum of forgone options, nor the value of the chosen option)."
    ],
    "examTipZh": "DSE 作答「基礎概念」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Basic Concepts”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "135 元用了加法；8 元用了除法；900 元多除了 2。要留意總收益不是利潤——利潤還要減去總成本。試卷經常在同一題內同時給出價格、數量與成本，讀題時必須先確認所問的是收益、成本還是利潤。",
    "commonTrapEn": "135 adds; 8 divides; 900 halves the result. Note that total revenue is not profit — total cost must still be deducted. Questions often give price, quantity and cost together, so establish first whether revenue, cost or profit is wanted.",
    "source": "generated"
  },
  "ppf": {
    "subjectId": "economics",
    "topicId": "ppf",
    "titleZh": "生產可能線（PPF）",
    "titleEn": "Production Possibility Frontier",
    "conceptZh": "企業家職能指承擔不確定性並作出組合決策的功能，與土地、勞動、資本並列為生產要素，其報酬是利潤而非工資。",
    "conceptEn": "企業家職能指承擔不確定性並作出組合決策的功能，與土地、勞動、資本並列為生產要素，其報酬是利潤而非工資。",
    "mustKnowZh": [
      "同一批廠房與工人，由不同的人決定生產甚麼、產量多少、如何配置，結果可以是盈利或虧損。這個差異來自企業家職能。",
      "凸出的 PPF 表示多產一單位須放棄越來越多另一物，即機會成本遞增。",
      "線內生產代表存在閒置或低效資源，未達生產效率邊界。"
    ],
    "mustKnowEn": [
      "同一批廠房與工人，由不同的人決定生產甚麼、產量多少、如何配置，結果可以是盈利或虧損。這個差異來自企業家職能。",
      "A concave PPF means each extra unit costs ever more of the other good — increasing opportunity cost.",
      "Producing inside the PPF means idle or inefficient resources — short of the efficiency frontier."
    ],
    "examTipZh": "分辨四種要素時，先問報酬形式：地租、工資、利息、利潤。報酬是利潤的，便是企業家職能。",
    "examTipEn": "分辨四種要素時，先問報酬形式：地租、工資、利息、利潤。報酬是利潤的，便是企業家職能。",
    "commonTrapZh": "把企業家職能簡稱為「企業」。企業是組織，企業家職能是功能，兩者並非同一概念，混用會令答案的層次錯位。",
    "commonTrapEn": "2 inverts the fraction and gives the cost per machine; 15 and 30 are total changes rather than costs per unit. Identify which good the question asks about — the increase in that good is the denominator.",
    "source": "sensei"
  },
  "demand_supply": {
    "subjectId": "economics",
    "topicId": "demand_supply",
    "titleZh": "需求與供應",
    "titleEn": "Demand & Supply",
    "conceptZh": "價格改變引致沿同一條需求曲線移動，稱為需求量改變；價格以外的因素改變則令整條曲線平移，稱為需求改變。判斷準則只有一個：價格有沒有變。",
    "conceptEn": "價格改變引致沿同一條需求曲線移動，稱為需求量改變；價格以外的因素改變則令整條曲線平移，稱為需求改變。判斷準則只有一個：價格有沒有變。",
    "mustKnowZh": [
      "咖啡減價令銷量上升，屬沿曲線移動；市民收入普遍上升，令同一價格下買得更多，屬整條曲線右移。",
      "令 $Q_d=Q_s$：$100-P = P-20$，解得 $P^* = 60$。",
      "本身價格變動引致沿曲線移動的「需求量」變動，而非整條曲線移動。"
    ],
    "mustKnowEn": [
      "咖啡減價令銷量上升，屬沿曲線移動；市民收入普遍上升，令同一價格下買得更多，屬整條曲線右移。",
      "Set $Q_d=Q_s$: $100-P = P-20$, giving $P^* = 60$.",
      "A change in own price moves quantity demanded along the curve, not the whole curve."
    ],
    "examTipZh": "落筆前先問價格是否為變動的起點。是則沿曲線，否則平移。這一步判斷錯誤，後續分析會全盤相反。",
    "examTipEn": "落筆前先問價格是否為變動的起點。是則沿曲線，否則平移。這一步判斷錯誤，後續分析會全盤相反。",
    "commonTrapZh": "把價格以外的因素寫成沿曲線移動，是本課題最常見的失分位，而且往往令整題連鎖出錯。",
    "commonTrapEn": "25 adds instead of multiplying.",
    "source": "sensei"
  },
  "elasticity": {
    "subjectId": "economics",
    "topicId": "elasticity",
    "titleZh": "彈性",
    "titleEn": "Elasticity",
    "conceptZh": "從量稅由買賣雙方分擔，比例取決於雙方彈性的相對大小：彈性較低的一方承擔較多，因為其調整空間較小。法例上向誰徵收並不決定實際負擔。",
    "conceptEn": "從量稅由買賣雙方分擔，比例取決於雙方彈性的相對大小：彈性較低的一方承擔較多，因為其調整空間較小。法例上向誰徵收並不決定實際負擔。",
    "mustKnowZh": [
      "香煙需求彈性低，稅項大部分由消費者承擔；某項有大量替代品的商品，需求彈性高，稅項則主要由生產者承擔。",
      "$|PED| = \\frac{\\%\\Delta Q}{\\%\\Delta P} = \\frac{20}{10} = 2$。",
      "$|PED| = \\frac{\\%\\Delta Q}{\\%\\Delta P} = \\frac{10}{20} = 0.5$。"
    ],
    "mustKnowEn": [
      "香煙需求彈性低，稅項大部分由消費者承擔；某項有大量替代品的商品，需求彈性高，稅項則主要由生產者承擔。",
      "$|PED| = \\frac{\\%\\Delta Q}{\\%\\Delta P} = \\frac{20}{10} = 2$.",
      "$|PED| = \\frac{\\%\\Delta Q}{\\%\\Delta P} = \\frac{10}{20} = 0.5$."
    ],
    "examTipZh": "答題先比較雙方彈性，再推出承擔比例，最後才在圖上標示。先比較後推論，論述才有依據。",
    "examTipEn": "答題先比較雙方彈性，再推出承擔比例，最後才在圖上標示。先比較後推論，論述才有依據。",
    "commonTrapZh": "認為向生產者徵稅就由生產者承擔。徵收對象與最終負擔是兩回事，這正是稅項歸宿要處理的核心問題。",
    "commonTrapEn": "0.5 inverts numerator and denominator.",
    "source": "sensei"
  },
  "firm_production": {
    "subjectId": "economics",
    "topicId": "firm_production",
    "titleZh": "廠商與生產",
    "titleEn": "Firms & Production",
    "conceptZh": "利潤 $= TR - TC = 10\\times50 - 350 = 150$。",
    "conceptEn": "Profit $= TR - TC = 10\\times50 - 350 = 150$.",
    "mustKnowZh": [
      "利潤 $= TR - TC = 10\\times50 - 350 = 150$。",
      "$AC = \\frac{TC}{Q} = \\frac{600}{50} = 12$。",
      "短期固定要素不變，持續加可變要素，邊際產量終會下降。",
      "固定成本（如租金）短期內與產量無關，即使停產仍須支付。"
    ],
    "mustKnowEn": [
      "Profit $= TR - TC = 10\\times50 - 350 = 150$.",
      "$AC = \\frac{TC}{Q} = \\frac{600}{50} = 12$.",
      "In the short run a fixed input limits the variable input’s extra output, so marginal product eventually falls.",
      "A fixed cost (e.g. rent) is independent of output and payable even at zero production."
    ],
    "examTipZh": "DSE 作答「廠商與生產」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Firms & Production”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "0.33 元上下倒轉。",
    "commonTrapEn": "0.33 inverts the ratio.",
    "source": "generated"
  },
  "market_structure": {
    "subjectId": "economics",
    "topicId": "market_structure",
    "titleZh": "市場結構",
    "titleEn": "Market Structure",
    "conceptZh": "市場失靈指市場自行運作無法達致資源有效配置，主要成因包括外部性、共用品、壟斷力量與資訊不對稱。四者的機制各不相同。",
    "conceptEn": "市場失靈指市場自行運作無法達致資源有效配置，主要成因包括外部性、共用品、壟斷力量與資訊不對稱。四者的機制各不相同。",
    "mustKnowZh": [
      "工廠排污屬外部成本；街燈屬共用品；獨市經營屬壟斷力量；二手車買賣中賣方比買方更清楚車況，屬資訊不對稱。",
      "完全競爭廠商眾多且產品同質，個別廠商只能接受市場價格。",
      "壟斷者限制產量、定價高於邊際成本，造成無謂損失。"
    ],
    "mustKnowEn": [
      "工廠排污屬外部成本；街燈屬共用品；獨市經營屬壟斷力量；二手車買賣中賣方比買方更清楚車況，屬資訊不對稱。",
      "With many firms and identical products, each firm simply takes the market price.",
      "A monopolist restricts output and prices above marginal cost, creating deadweight loss."
    ],
    "examTipZh": "先指明題目屬於哪一種成因，再解釋該成因如何導致偏離有效率的產量；先分類再說明，論述才有結構。",
    "examTipEn": "先指明題目屬於哪一種成因，再解釋該成因如何導致偏離有效率的產量；先分類再說明，論述才有結構。",
    "commonTrapZh": "把「價格昂貴」或「有人買不起」當成市場失靈。價格高低屬分配問題，市場失靈指的是效率問題，兩者不應混為一談。",
    "commonTrapEn": "90% is CR4 and adds all four; 40% takes only the largest firm; 32.5% averages instead of summing.",
    "source": "sensei"
  },
  "market_failure": {
    "subjectId": "economics",
    "topicId": "market_failure",
    "titleZh": "市場失靈",
    "titleEn": "Market Failure",
    "conceptZh": "市場失靈指市場自行運作無法達致資源有效配置，主要成因包括外部性、共用品、壟斷力量與資訊不對稱。四者的機制各不相同。",
    "conceptEn": "市場失靈指市場自行運作無法達致資源有效配置，主要成因包括外部性、共用品、壟斷力量與資訊不對稱。四者的機制各不相同。",
    "mustKnowZh": [
      "工廠排污屬外部成本；街燈屬共用品；獨市經營屬壟斷力量；二手車買賣中賣方比買方更清楚車況，屬資訊不對稱。",
      "負外部性使私人成本低於社會成本，市場過度生產。",
      "正外部性使社會利益高於私人利益，市場供應不足，故政府常補貼。"
    ],
    "mustKnowEn": [
      "工廠排污屬外部成本；街燈屬共用品；獨市經營屬壟斷力量；二手車買賣中賣方比買方更清楚車況，屬資訊不對稱。",
      "A negative externality makes private cost below social cost, so the market over-produces.",
      "Positive externalities make social benefit exceed private benefit, so the market under-provides — hence subsidies."
    ],
    "examTipZh": "先指明題目屬於哪一種成因，再解釋該成因如何導致偏離有效率的產量；先分類再說明，論述才有結構。",
    "examTipEn": "先指明題目屬於哪一種成因，再解釋該成因如何導致偏離有效率的產量；先分類再說明，論述才有結構。",
    "commonTrapZh": "把「價格昂貴」或「有人買不起」當成市場失靈。價格高低屬分配問題，市場失靈指的是效率問題，兩者不應混為一談。",
    "commonTrapEn": "\\$40 omits the one-half and treats it as a rectangle; \\$10 and \\$4 are merely the base and the height.",
    "source": "sensei"
  },
  "macroeconomics": {
    "subjectId": "economics",
    "topicId": "macroeconomics",
    "titleZh": "宏觀經濟",
    "titleEn": "Macroeconomics",
    "conceptZh": "乘數 $= \\frac{1}{1-MPC} = \\frac{1}{1-0.8} = 5$。",
    "conceptEn": "Multiplier $= \\frac{1}{1-MPC} = \\frac{1}{1-0.8} = 5$.",
    "mustKnowZh": [
      "乘數 $= \\frac{1}{1-MPC} = \\frac{1}{1-0.8} = 5$。",
      "乘數 $= \\frac{1}{1-MPC} = \\frac{1}{1-0.6} = 2.5$。",
      "實質 GDP 以固定基期價格計算，剔除通脹，反映真正產量變化。",
      "需求拉動通脹源於總需求過旺，「太多錢追逐太少貨品」。"
    ],
    "mustKnowEn": [
      "Multiplier $= \\frac{1}{1-MPC} = \\frac{1}{1-0.8} = 5$.",
      "Multiplier $= \\frac{1}{1-MPC} = \\frac{1}{1-0.6} = 2.5$.",
      "Real GDP uses base-year prices to strip out inflation, showing true output change.",
      "Demand-pull inflation comes from excess aggregate demand — too much spending chasing too few goods."
    ],
    "examTipZh": "DSE 作答「宏觀經濟」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Macroeconomics”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "1.25 用了 1/MPC；0.2 只計了 MPS。",
    "commonTrapEn": "1.25 uses 1/MPC; 0.2 is only the MPS.",
    "source": "generated"
  },
  "trade": {
    "subjectId": "economics",
    "topicId": "trade",
    "titleZh": "國際貿易",
    "titleEn": "International Trade",
    "conceptZh": "生產電腦甲國放棄 4 噸＜乙國 6 噸，甲機會成本較低，應專產電腦。",
    "conceptEn": "A gives up 4 < B’s 6 tonnes per computer, so A has the lower opportunity cost and should specialise.",
    "mustKnowZh": [
      "生產電腦甲國放棄 4 噸＜乙國 6 噸，甲機會成本較低，應專產電腦。",
      "關稅是進口稅，推高進口品價格，保護本地生產者並減少進口。",
      "自由貿易促使按比較優勢分工，擴大世界產出與消費可能。",
      "配額直接限制進口數量；關稅則透過徵稅影響價格。"
    ],
    "mustKnowEn": [
      "A gives up 4 < B’s 6 tonnes per computer, so A has the lower opportunity cost and should specialise.",
      "A tariff is an import tax that raises import prices, protecting domestic producers and cutting imports.",
      "Free trade drives specialisation by comparative advantage, expanding world output and consumption.",
      "A quota caps the import quantity directly; a tariff works through price via a tax."
    ],
    "examTipZh": "DSE 作答「國際貿易」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “International Trade”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "0.5 單位是小麥【對布匹】的機會成本，方向倒轉；20 單位漏了除以布匹產量；10 單位把兩個產量相減。",
    "commonTrapEn": "0.5 is the cost of wheat in terms of cloth, the reverse direction; 20 omits the division by cloth output; 10 subtracts the two outputs.",
    "source": "generated"
  },
  "econ_micro_calc": {
    "subjectId": "economics",
    "topicId": "econ_micro_calc",
    "titleZh": "微觀計算（高階）",
    "titleEn": "Microeconomics — calculation",
    "conceptZh": "PED = %ΔQ ÷ %ΔP ⇒ %ΔQ = 0.4 × (−10%) = −4%。",
    "conceptEn": "PED = %ΔQ ÷ %ΔP ⇒ %ΔQ = 0.4 × (−10%) = −4%. %ΔTR ≈ %ΔP + %ΔQ = +10% − 4% = +6% > 0. When demand is inelastic (<1), a price rise raises total revenue.",
    "mustKnowZh": [
      "PED = %ΔQ ÷ %ΔP ⇒ %ΔQ = 0.4 × (−10%) = −4%。",
      "短期停產法則：當 P < AVC，繼續生產的虧損比停產（只蝕固定成本）更大，故應停產。",
      "%ΔP = (60 − 50) ÷ 50 = +20%；%ΔQ = (85 − 100) ÷ 100 = −15%。",
      "上限 \\$30 低於均衡 \\$50，屬有約束力的價格上限。"
    ],
    "mustKnowEn": [
      "PED = %ΔQ ÷ %ΔP ⇒ %ΔQ = 0.4 × (−10%) = −4%. %ΔTR ≈ %ΔP + %ΔQ = +10% − 4% = +6% > 0. When demand is inelastic (<1), a price rise raises total revenue.",
      "Short-run shut-down rule: shut down when P < AVC, because the loss from producing then exceeds the fixed-cost-only loss from stopping. Here P=\\$8 < AVC=\\$9 ⇒ shut down.",
      "%ΔP = (60 − 50) ÷ 50 = +20%; %ΔQ = (85 − 100) ÷ 100 = −15%. |PED| = |−15% ÷ 20%| = 0.75 < 1 ⇒ inelastic.",
      "The \\$30 ceiling is below the \\$50 equilibrium, so it binds. Shortage = Qd − Qs = 120 − 80 = 40 units. The legal price cannot rise back to equilibrium, so a shortage (and…"
    ],
    "examTipZh": "DSE 作答「微觀計算（高階）」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Microeconomics — calculation”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "「總收益下跌」誤用了富彈性的結論；「跌 10%」把彈性當 1；「需求量上升」弄錯了需求定律方向。",
    "commonTrapEn": "“TR falls” applies the elastic-case result; “falls 10%” treats PED as 1; “quantity rises” reverses the law of demand.",
    "source": "generated"
  },
  "econ_macro_calc": {
    "subjectId": "economics",
    "topicId": "econ_macro_calc",
    "titleZh": "宏觀計算（高階）",
    "titleEn": "Macroeconomics — calculation",
    "conceptZh": "簡單支出乘數 = 1 ÷ (1 − MPC) = 1 ÷ (1 − 0.8) = 1 ÷ 0.2 = 5。",
    "conceptEn": "Simple multiplier = 1 ÷ (1 − MPC) = 1 ÷ 0.2 = 5. ΔY = multiplier × ΔG = 5 × \\$50M = \\$250M.",
    "mustKnowZh": [
      "簡單支出乘數 = 1 ÷ (1 − MPC) = 1 ÷ (1 − 0.8) = 1 ÷ 0.2 = 5。",
      "實質 GDP = 名義 GDP ÷ 平減指數 × 100 = 660 ÷ 110 × 100 = \\$600M。",
      "實質工資變動 ≈ 名義工資變動 − 物價變動 = 5% − 8% = −3%，即購買力下降約 3%。",
      "支出法：GDP $= C + I + G + (X - M) = 400 + 120 + 180 + (260 - 210) = 750$ 億元。"
    ],
    "mustKnowEn": [
      "Simple multiplier = 1 ÷ (1 − MPC) = 1 ÷ 0.2 = 5. ΔY = multiplier × ΔG = 5 × \\$50M = \\$250M.",
      "Real GDP = nominal ÷ deflator × 100 = 660 ÷ 110 × 100 = \\$600M. With prices above the base year, real output is below nominal.",
      "Change in real wage ≈ nominal-wage change − inflation = 5% − 8% = −3%, i.e. purchasing power falls about 3%.",
      "By the expenditure approach GDP $= C + I + G + (X - M) = 400 + 120 + 180 + (260 - 210) = 750$."
    ],
    "examTipZh": "DSE 作答「宏觀計算（高階）」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Macroeconomics — calculation”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "\\$50M 忘了乘數；\\$40M = 50×0.8（只算首輪消費）；\\$62.5M = 50 ÷ 0.8（把 MPC 當乘數倒數用錯）。",
    "commonTrapEn": "\\$50M ignores the multiplier; \\$40M = 50×0.8 (only the first round of spending); \\$62.5M = 50 ÷ 0.8 (mis-uses MPC).",
    "source": "generated"
  },
  "econ_trade_failure": {
    "subjectId": "economics",
    "topicId": "econ_trade_failure",
    "titleZh": "貿易與市場失靈",
    "titleEn": "Trade & market failure",
    "conceptZh": "市場失靈指市場自行運作無法達致資源有效配置，主要成因包括外部性、共用品、壟斷力量與資訊不對稱。四者的機制各不相同。",
    "conceptEn": "市場失靈指市場自行運作無法達致資源有效配置，主要成因包括外部性、共用品、壟斷力量與資訊不對稱。四者的機制各不相同。",
    "mustKnowZh": [
      "工廠排污屬外部成本；街燈屬共用品；獨市經營屬壟斷力量；二手車買賣中賣方比買方更清楚車況，屬資訊不對稱。",
      "機會成本：造 1 匹布——甲 = 12/6 = 2 桶酒，乙 = 4/1 = 4 桶酒 ⇒ 甲布的機會成本較低，甲有比較優勢；造 1 桶酒——甲 = 6/12 = 0.5 匹布，乙 = 1/4 = 0.25 匹布 ⇒ 乙酒的機會成本較低。",
      "稅項歸宿取決於相對彈性：彈性愈低（愈難轉移行為）的一方承擔愈重。"
    ],
    "mustKnowEn": [
      "工廠排污屬外部成本；街燈屬共用品；獨市經營屬壟斷力量；二手車買賣中賣方比買方更清楚車況，屬資訊不對稱。",
      "Opportunity cost of 1 cloth: A = 12/6 = 2 wine; B = 4/1 = 4 wine ⇒ A’s cloth is cheaper, so A has the comparative advantage. Opportunity cost of 1 wine: A = 0.5 cloth; B = 0.25…",
      "Tax incidence depends on relative elasticity: the more inelastic side (less able to change behaviour) bears more. Demand far more inelastic than supply ⇒ consumers cannot cut…"
    ],
    "examTipZh": "先指明題目屬於哪一種成因，再解釋該成因如何導致偏離有效率的產量；先分類再說明，論述才有結構。",
    "examTipEn": "先指明題目屬於哪一種成因，再解釋該成因如何導致偏離有效率的產量；先分類再說明，論述才有結構。",
    "commonTrapZh": "把「價格昂貴」或「有人買不起」當成市場失靈。價格高低屬分配問題，市場失靈指的是效率問題，兩者不應混為一談。",
    "commonTrapEn": "“A is best at everything so needn’t trade” confuses absolute with comparative advantage — specialising by opportunity cost still benefits both; the other two reverse the computation.",
    "source": "sensei"
  },
  "market": {
    "subjectId": "economics",
    "topicId": "market",
    "titleZh": "市場效率",
    "titleEn": "Market Efficiency",
    "conceptZh": "生產可能性曲線向外凸，反映機會成本遞增：資源並非同樣適合兩種用途，愈是把不適合的資源調過來，代價愈大。",
    "conceptEn": "生產可能性曲線向外凸，反映機會成本遞增：資源並非同樣適合兩種用途，愈是把不適合的資源調過來，代價愈大。",
    "mustKnowZh": [
      "把農地逐步改為工業用地，最初調用的是產出最低的農地，其後被迫調用肥沃農地，每多一單位工業品放棄的糧食愈來愈多。",
      "消費者剩餘 = ½ × 成交量 × (最高願付價 − 市價) = ½ × 30 × (10−4) = 90 元。",
      "均衡發生於 $Q_d = Q_s$：100 − 2P = −20 + 2P，移項得 120 = 4P，故 $P = 20$ 元。"
    ],
    "mustKnowEn": [
      "把農地逐步改為工業用地，最初調用的是產出最低的農地，其後被迫調用肥沃農地，每多一單位工業品放棄的糧食愈來愈多。",
      "CS = ½ × Q × (Pmax − P) = 90.",
      "Equilibrium requires $Q_d = Q_s$: 100 − 2P = −20 + 2P, so 120 = 4P and $P = 20$. Substituting back into either equation gives the equilibrium quantity of 60 units, and agreement…"
    ],
    "examTipZh": "見到曲線形狀題，先答形狀反映甚麼，再答為何如此。只描述「向外凸」而不解釋資源適用性，答案缺了因由。",
    "examTipEn": "見到曲線形狀題，先答形狀反映甚麼，再答為何如此。只描述「向外凸」而不解釋資源適用性，答案缺了因由。",
    "commonTrapZh": "把曲線上的點與曲線內的點混淆。曲線上代表資源用盡且有效率，曲線內代表未用盡或無效率，兩者的政策含義不同。",
    "commonTrapEn": "180 drops the ½ (treats it as a rectangle).",
    "source": "sensei"
  }
}
