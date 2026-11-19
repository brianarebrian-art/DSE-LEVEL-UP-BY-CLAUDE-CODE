// ⚠️ 由 scripts/gen-study-notes.mts 產生 —— 請勿手動修改。
import type { StudyNote } from '../types'

export const notes: Record<string, StudyNote> = {
  "mole": {
    "subjectId": "chemistry",
    "topicId": "mole",
    "titleZh": "摩爾概念",
    "titleEn": "The Mole Concept",
    "conceptZh": "$n = \\frac{m}{M} = \\frac{36}{18} = 2\\,\\text{mol}$。",
    "conceptEn": "$n = \\frac{m}{M} = \\frac{36}{18} = 2\\,\\text{mol}$.",
    "mustKnowZh": [
      "$n = \\frac{m}{M} = \\frac{36}{18} = 2\\,\\text{mol}$。",
      "$n = \\frac{m}{M} = \\frac{117}{58.5} = 2\\,\\text{mol}$。",
      "$m = nM = 2\\times18 = 36\\,\\text{g}$。",
      "$m = nM = 0.5\\times40 = 20\\,\\text{g}$。"
    ],
    "mustKnowEn": [
      "$n = \\frac{m}{M} = \\frac{36}{18} = 2\\,\\text{mol}$.",
      "$n = \\frac{m}{M} = \\frac{117}{58.5} = 2\\,\\text{mol}$.",
      "$m = nM = 2\\times18 = 36\\,\\text{g}$.",
      "$m = nM = 0.5\\times40 = 20\\,\\text{g}$."
    ],
    "examTipZh": "DSE 作答「摩爾概念」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “The Mole Concept”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$648$ 用了乘法；$0.5$ 上下倒轉。",
    "commonTrapEn": "$648$ multiplies instead of dividing.",
    "source": "generated"
  },
  "acids_bases": {
    "subjectId": "chemistry",
    "topicId": "acids_bases",
    "titleZh": "酸鹼",
    "titleEn": "Acids & Bases",
    "conceptZh": "酸性 pH < 7，中性 = 7，鹼性 > 7。",
    "conceptEn": "Acidic pH < 7, neutral = 7, alkaline > 7.",
    "mustKnowZh": [
      "酸性 pH < 7，中性 = 7，鹼性 > 7。",
      "鹽酸在水中完全電離，屬強酸；醋酸、碳酸屬弱酸，氨水是鹼。",
      "酸使藍色石蕊變紅；鹼使紅色石蕊變藍。",
      "pH 每降 1，[H⁺] 增 10 倍；差 2 即 $10^2 = 100$ 倍。"
    ],
    "mustKnowEn": [
      "Acidic pH < 7, neutral = 7, alkaline > 7.",
      "HCl fully ionises in water (strong acid); ethanoic and carbonic acids are weak; ammonia is a base.",
      "Acid turns blue litmus red; alkali turns red litmus blue.",
      "Each pH unit is ×10 in [H⁺]; a difference of 2 means $10^2 = 100$ times."
    ],
    "examTipZh": "DSE 作答「酸鹼」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Acids & Bases”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$-1$ 漏了負號（pH 在中學範圍內不會是負數）；$13$ 是 pOH；$2$ 把指數乘了 2。記住 pH 愈細酸性愈強，每差 1 個單位，氫離子濃度相差 10 倍。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "redox": {
    "subjectId": "chemistry",
    "topicId": "redox",
    "titleZh": "氧化還原",
    "titleEn": "Redox",
    "conceptZh": "單質元素氧化數定為 0。",
    "conceptEn": "An uncombined element has an oxidation number of 0.",
    "mustKnowZh": [
      "單質元素氧化數定為 0。",
      "氫在大多數化合物中為 $+1$（金屬氫化物中為 $-1$）。",
      "氧在大多數化合物中為 $-2$（過氧化物中為 $-1$）。",
      "$2(+1) + S + 4(-2) = 0 \\Rightarrow S = +6$。"
    ],
    "mustKnowEn": [
      "An uncombined element has an oxidation number of 0.",
      "Hydrogen is usually $+1$ (but $-1$ in metal hydrides).",
      "Oxygen is usually $-2$ (but $-1$ in peroxides).",
      "$2(+1) + S + 4(-2) = 0 \\Rightarrow S = +6$."
    ],
    "examTipZh": "DSE 作答「氧化還原」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Redox”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$-6$ 正負號相反；$+8$ 漏了氫的貢獻；$+4$ 少算了一個氧。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "rates_energy": {
    "subjectId": "chemistry",
    "topicId": "rates_energy",
    "titleZh": "反應速率與能量",
    "titleEn": "Reaction Rates & Energy",
    "conceptZh": "溫度升高，分子能量與有效碰撞增多，速率加快。",
    "conceptEn": "Higher temperature gives more energetic, more frequent effective collisions, so the rate increases.",
    "mustKnowZh": [
      "溫度升高，分子能量與有效碰撞增多，速率加快。",
      "催化劑提供較低活化能的途徑，加快正逆反應，自身不被消耗，不改變平衡位置。",
      "放熱反應向環境放出能量，ΔH < 0，溫度上升。",
      "表面積增大使更多顆粒接觸、碰撞增多，速率加快。"
    ],
    "mustKnowEn": [
      "Higher temperature gives more energetic, more frequent effective collisions, so the rate increases.",
      "A catalyst offers a lower-activation-energy path, speeding the reaction without being consumed and without shifting equilibrium.",
      "An exothermic reaction releases energy to the surroundings, ΔH < 0, temperature rises.",
      "More surface area means more particle contact and collisions, so a faster rate."
    ],
    "examTipZh": "DSE 作答「反應速率與能量」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Reaction Rates & Energy”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$0.167$ 上下倒轉；$24$ 用了乘法；$12$ 漏了除以時間。留意反應速率一般隨時間下降，因為反應物濃度不斷減少，所以「平均速率」與任何一刻的「瞬時速率」通常不同。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "bonding": {
    "subjectId": "chemistry",
    "topicId": "bonding",
    "titleZh": "化學鍵",
    "titleEn": "Chemical Bonding",
    "conceptZh": "金屬失電子、非金屬得電子，靠靜電吸引形成離子鍵。",
    "conceptEn": "Metals lose and non-metals gain electrons; electrostatic attraction forms an ionic bond.",
    "mustKnowZh": [
      "金屬失電子、非金屬得電子，靠靜電吸引形成離子鍵。",
      "非金屬間共用電子對，形成共價鍵。",
      "固態離子被晶格固定不能移動；熔融/溶解後離子自由移動而導電。",
      "金屬鍵中離域電子（電子海）可自由移動，故能導電與導熱。"
    ],
    "mustKnowEn": [
      "Metals lose and non-metals gain electrons; electrostatic attraction forms an ionic bond.",
      "Non-metals share electron pairs, forming covalent bonds.",
      "In the solid the ions are fixed in the lattice; when molten or dissolved the ions move freely and carry charge.",
      "Metallic bonding has delocalised electrons (a “sea”) free to move, so metals conduct electricity and heat."
    ],
    "examTipZh": "DSE 作答「化學鍵」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Chemical Bonding”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$\\mathrm{Mg_2Cl}$ 把電荷數直接寫成自己的下標而未交叉；$\\mathrm{Mg_2Cl_2}$ 與 $\\mathrm{MgCl_3}$ 各有一個下標多算了一，代入檢查電荷即知不平衡。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "periodic_table": {
    "subjectId": "chemistry",
    "topicId": "periodic_table",
    "titleZh": "週期表",
    "titleEn": "The Periodic Table",
    "conceptZh": "同族元素最外層電子數相同，故化學性質相似。",
    "conceptEn": "Same-group elements share the same number of valence electrons, hence similar chemistry.",
    "mustKnowZh": [
      "同族元素最外層電子數相同，故化學性質相似。",
      "第 1 族最外層有 1 個電子，易失去成 $+1$ 離子。",
      "鈍氣最外層電子已填滿（穩定組態），不易得失電子，故不活潑。",
      "同週期由左至右，由金屬過渡到非金屬，金屬性減弱。"
    ],
    "mustKnowEn": [
      "Same-group elements share the same number of valence electrons, hence similar chemistry.",
      "Group 1 has 1 valence electron, readily lost to form a $+1$ ion.",
      "Noble gases have a full outer shell (stable configuration), so they neither gain nor lose electrons easily.",
      "Across a period, elements change from metals to non-metals, so metallic character decreases."
    ],
    "examTipZh": "DSE 作答「週期表」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “The Periodic Table”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$1, 8, 2$ 把次序倒轉；$11$ 直接寫了總數而未分層；$2, 9$ 忽略了第二層 8 個的上限。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "organic": {
    "subjectId": "chemistry",
    "topicId": "organic",
    "titleZh": "有機化學",
    "titleEn": "Organic Chemistry",
    "conceptZh": "同系物有相同通式與相似化學性質，相鄰成員相差一個 $CH_2$，物理性質隨碳數遞變。",
    "conceptEn": "Members of a homologous series share a general formula and similar chemistry; consecutive ones differ by one $CH_2$, with physical properties trending with chain length.",
    "mustKnowZh": [
      "同系物有相同通式與相似化學性質，相鄰成員相差一個 $CH_2$，物理性質隨碳數遞變。",
      "飽和烷烴每個碳以單鍵相連，通式為 $C_nH_{2n+2}$；烯烴（含一個雙鍵）為 $C_nH_{2n}$。",
      "烯含 C=C 雙鍵，能與溴水進行加成反應而使其由橙褐色褪去；烷為飽和，常溫下不與溴水反應，故可藉此區分。",
      "雙鍵打開，溴的兩個原子加到相鄰碳上形成二溴化物，無小分子釋出，屬加成反應；烷與鹵素在光照下則行取代反應。"
    ],
    "mustKnowEn": [
      "Members of a homologous series share a general formula and similar chemistry; consecutive ones differ by one $CH_2$, with physical properties trending with chain length.",
      "Saturated alkanes have only single bonds, formula $C_nH_{2n+2}$; alkenes with one C=C are $C_nH_{2n}$.",
      "Alkenes have a C=C double bond that adds bromine, decolourising bromine water; saturated alkanes do not react at room temperature, so this distinguishes them.",
      "The double bond opens and the two bromine atoms add across adjacent carbons forming a dibromide with no small molecule lost — addition; alkanes undergo substitution with halogens…"
    ],
    "examTipZh": "DSE 作答「有機化學」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Organic Chemistry”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$\\mathrm{C_2H_{6}}$ 是同碳數的烷烴（通式 $\\mathrm{C_nH_{2n+2}}$）；$\\mathrm{C_2H_{2}}$ 是炔烴；$\\mathrm{C_2H_2}$ 誤把氫碳比當成 $1 : 1$。三個通式相差的氫數反映不飽和度：每多一個雙鍵或一個環，就少 2 個氫。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "chem_hell_quant": {
    "subjectId": "chemistry",
    "topicId": "chem_hell_quant",
    "titleZh": "定量計算（高階）",
    "titleEn": "Quantitative killers",
    "conceptZh": "比例 $H_2:O_2 = 2:1$。",
    "conceptEn": "Ratio $H_2:O_2 = 2:1$. $0.5\\,\\text{mol}$ H₂ needs only $0.25\\,\\text{mol}$ O₂, but $0.5\\,\\text{mol}$ O₂ is present ⇒ O₂ in excess, H₂ is limiting. Water $= $ mol(H₂) $=…",
    "mustKnowZh": [
      "比例 $H_2:O_2 = 2:1$。",
      "mol HCl $= 0.0200\\times0.10 = 0.0020\\,\\text{mol}$ $=$ mol NaOH（1:1）。",
      "mol CaCO₃ $= 5.0/100 = 0.05\\,\\text{mol}$ ⇒ mol CO₂ $= 0.05$（1:1）。",
      "摩爾比：C $40/12=3.33$、H $6.7/1=6.7$、O $53.3/16=3.33$。"
    ],
    "mustKnowEn": [
      "Ratio $H_2:O_2 = 2:1$. $0.5\\,\\text{mol}$ H₂ needs only $0.25\\,\\text{mol}$ O₂, but $0.5\\,\\text{mol}$ O₂ is present ⇒ O₂ in excess, H₂ is limiting. Water $= $ mol(H₂) $=…",
      "mol HCl $= 0.0200\\times0.10 = 0.0020\\,\\text{mol}$ $=$ mol NaOH (1:1). $[NaOH] = 0.0020/0.0250 = 0.08\\,\\text{M}$.",
      "mol CaCO₃ $= 5.0/100 = 0.05\\,\\text{mol}$ ⇒ mol CO₂ $= 0.05$ (1:1). Volume $= 0.05\\times24 = 1.2\\,\\text{dm}^3$.",
      "Mole ratio: C $40/12=3.33$, H $6.7/1=6.7$, O $53.3/16=3.33$. Divide by $3.33$: C:H:O $= 1:2:1$ ⇒ empirical formula $CH_2O$."
    ],
    "examTipZh": "DSE 作答「定量計算（高階）」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Quantitative killers”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$2$ mol 停在第一步；$1$ mol 把係數比倒轉；$64$ mol 把質量當成摩爾。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "chem_hell_redox_equil": {
    "subjectId": "chemistry",
    "topicId": "chem_hell_redox_equil",
    "titleZh": "氧化還原與平衡",
    "titleEn": "Redox & equilibrium",
    "conceptZh": "設 Cr 氧化數為 $x$：$2x + 7(-2) = -2 \\Rightarrow 2x - 14 = -2 \\Rightarrow 2x = 12 \\Rightarrow x = +6$。",
    "conceptEn": "Let Cr be $x$: $2x + 7(-2) = -2 \\Rightarrow 2x = 12 \\Rightarrow x = +6$.",
    "mustKnowZh": [
      "設 Cr 氧化數為 $x$：$2x + 7(-2) = -2 \\Rightarrow 2x - 14 = -2 \\Rightarrow 2x = 12 \\Rightarrow x = +6$。",
      "依勒沙特列原理，升溫令平衡向吸熱方向（此處為逆反應）移動，故氨的平衡產率下降。",
      "氧化數的變化量即得失電子數：$|2 - (7)| = 5$ 個。",
      "活潑性較高的金屬能把活潑性較低的金屬由其鹽溶液中置換出來。"
    ],
    "mustKnowEn": [
      "Let Cr be $x$: $2x + 7(-2) = -2 \\Rightarrow 2x = 12 \\Rightarrow x = +6$.",
      "By Le Chatelier, raising temperature shifts equilibrium toward the endothermic direction (here the reverse), so the equilibrium yield of NH₃ falls. Note: higher T speeds up the…",
      "The change in oxidation number is the number of electrons transferred: $|2 - (7)| = 5$. A fall in oxidation number means electrons are gained, so the species is reduced. A useful…",
      "A more reactive metal displaces a less reactive one from its salt solution. Since 鋅 was displaced, 鎂 is the more reactive. In the reaction 鎂 loses electrons to form ions — it is…"
    ],
    "examTipZh": "DSE 作答「氧化還原與平衡」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Redox & equilibrium”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "方向相反的一項把氧化與還原調轉，是本課最常見的錯誤；$9$ 個把兩個氧化數相加而非相減。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "chem_hell_organic": {
    "subjectId": "chemistry",
    "topicId": "chem_hell_organic",
    "titleZh": "有機化學（高階）",
    "titleEn": "Organic killers",
    "conceptZh": "$C_4H_9Cl$ 的結構異構體有 4 個：1-氯丁烷、2-氯丁烷、1-氯-2-甲基丙烷、2-氯-2-甲基丙烷（碳骨架有直鏈與支鏈，氯位置不同）。",
    "conceptEn": "$C_4H_9Cl$ has 4 structural isomers: 1-chlorobutane, 2-chlorobutane, 1-chloro-2-methylpropane and 2-chloro-2-methylpropane (straight and branched carbon skeletons, different Cl…",
    "mustKnowZh": [
      "$C_4H_9Cl$ 的結構異構體有 4 個：1-氯丁烷、2-氯丁烷、1-氯-2-甲基丙烷、2-氯-2-甲基丙烷（碳骨架有直鏈與支鏈，氯位置不同）。",
      "乙烯含 C=C 雙鍵，能在室溫下與溴「加成」，迅速使溴水（橙黃色）褪色，生成 1,2-二溴乙烷——這正是區分烯烴（不飽和）與烷烴（飽和）的測試。",
      "不飽和度 $= \\dfrac{2C + 2 - H}{2} = \\dfrac{2(4) + 2 - 8}{2} = \\dfrac{2}{2} = 1$。",
      "同系列是指結構相似、通式相同、相鄰成員相差一個 $\\mathrm{CH_2}$ 的一組化合物。"
    ],
    "mustKnowEn": [
      "$C_4H_9Cl$ has 4 structural isomers: 1-chlorobutane, 2-chlorobutane, 1-chloro-2-methylpropane and 2-chloro-2-methylpropane (straight and branched carbon skeletons, different Cl…",
      "Ethene has a C=C double bond and undergoes ADDITION with bromine at room temperature, rapidly decolourising the orange bromine water to form 1,2-dibromoethane — the standard test…",
      "The degree of unsaturation is $\\frac{2C + 2 - H}{2} = \\frac{2(4) + 2 - 8}{2} = \\frac{2}{2} = 1$. It means that relative to the saturated alkane with the same carbon count,…",
      "A homologous series is a family of compounds with similar structure, a common general formula, and successive members differing by $\\mathrm{CH_2}$. The alkanes are characterised…"
    ],
    "examTipZh": "DSE 作答「有機化學（高階）」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Organic killers”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$2$ 多計一個；$0$ 誤以為飽和；$3$ 用碳數相減。這個數字係推斷結構的第一步：知道不飽和度，就知道要畫幾多個環或雙鍵。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "formula_mass": {
    "subjectId": "chemistry",
    "topicId": "formula_mass",
    "titleZh": "化學式與式量",
    "titleEn": "Formulae & Formula Mass",
    "conceptZh": "質量百分比 $= \\dfrac{\\text{該元素質量}}{M_r} \\times 100\\% = \\dfrac{16}{18} \\times 100\\% = 88.9\\%$。",
    "conceptEn": "% by mass $= \\frac{16}{18} \\times 100\\% = 88.9\\%$. Traps: the \"rest\" is $11.1\\%$; $0.889\\%$ forgets to multiply by 100 but keeps the % sign.",
    "mustKnowZh": [
      "質量百分比 $= \\dfrac{\\text{該元素質量}}{M_r} \\times 100\\% = \\dfrac{16}{18} \\times 100\\% = 88.9\\%$。",
      "質量百分比 $= \\dfrac{\\text{該元素質量}}{M_r} \\times 100\\% = \\dfrac{12}{16} \\times 100\\% = 75\\%$。",
      "式量為分子式中各原子相對原子質量之總和，下標代表該元素的原子數目，必須乘上：$23 \\times 2 + 16 \\times 1 = 46 + 16 = 62$。",
      "式量為分子式中各原子相對原子質量之總和，下標代表該元素的原子數目，必須乘上：$56 \\times 1 + 35.5 \\times 3 = 56 + 106.5 = 162.5$。"
    ],
    "mustKnowEn": [
      "% by mass $= \\frac{16}{18} \\times 100\\% = 88.9\\%$. Traps: the \"rest\" is $11.1\\%$; $0.889\\%$ forgets to multiply by 100 but keeps the % sign.",
      "% by mass $= \\frac{12}{16} \\times 100\\% = 75\\%$. Traps: the \"rest\" is $25\\%$; $0.75\\%$ forgets to multiply by 100 but keeps the % sign.",
      "The formula mass is the sum of the relative atomic masses of every atom in the formula; the subscripts give how many atoms of each element and must be applied: $23 \\times 2 + 16…",
      "The formula mass is the sum of the relative atomic masses of every atom in the formula; the subscripts give how many atoms of each element and must be applied: $56 \\times 1 + 35.5…"
    ],
    "examTipZh": "DSE 作答「化學式與式量」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Formulae & Formula Mass”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$11.1\\%$ 是其餘部分；$0.889\\%$ 計出比值後漏了乘以 100，卻照樣加上百分號。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "concentration": {
    "subjectId": "chemistry",
    "topicId": "concentration",
    "titleZh": "濃度",
    "titleEn": "Concentration",
    "conceptZh": "$c = \\dfrac{n}{V} = \\dfrac{2}{4} = 0.5$ mol/dm³。",
    "conceptEn": "$c = \\frac{n}{V} = 0.5$ mol/dm³.",
    "mustKnowZh": [
      "$c = \\dfrac{n}{V} = \\dfrac{2}{4} = 0.5$ mol/dm³。",
      "$c = \\dfrac{n}{V} = \\dfrac{4}{2} = 2$ mol/dm³。",
      "先求摩爾：$n = \\dfrac{40}{40} = 1$ mol，再 $c = \\dfrac{n}{V} = \\dfrac{1}{2} = 0.5$ mol/dm³。",
      "先求摩爾：$n = \\dfrac{80}{40} = 2$ mol，再 $c = \\dfrac{n}{V} = \\dfrac{2}{2} = 1$ mol/dm³。"
    ],
    "mustKnowEn": [
      "$c = \\frac{n}{V} = 0.5$ mol/dm³.",
      "$c = \\frac{n}{V} = 2$ mol/dm³.",
      "$n = \\frac{40}{40} = 1$ mol, then $c = \\frac{n}{V} = 0.5$ mol/dm³.",
      "$n = \\frac{80}{40} = 2$ mol, then $c = \\frac{n}{V} = 1$ mol/dm³."
    ],
    "examTipZh": "DSE 作答「濃度」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Concentration”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$2$ 上下倒轉；$8$ 用了乘法。",
    "commonTrapEn": "$2$ inverts the ratio.",
    "source": "generated"
  },
  "gas_volume": {
    "subjectId": "chemistry",
    "topicId": "gas_volume",
    "titleZh": "氣體體積",
    "titleEn": "Gas Volume",
    "conceptZh": "先求摩爾 $n = \\dfrac{16}{32} = 0.5$ mol，再 $V = n \\times 24 = 0.5 \\times 24 = 12$ dm³。",
    "conceptEn": "$n = \\frac{16}{32} = 0.5$ mol, then $V = 24n = 12$ dm³.",
    "mustKnowZh": [
      "先求摩爾 $n = \\dfrac{16}{32} = 0.5$ mol，再 $V = n \\times 24 = 0.5 \\times 24 = 12$ dm³。",
      "先求摩爾 $n = \\dfrac{64}{32} = 2$ mol，再 $V = n \\times 24 = 2 \\times 24 = 48$ dm³。",
      "由亞佛加德羅定律，同溫同壓下氣體的體積比等於摩爾比，故可直接用係數比換算，毋須先求摩爾數：$10 \\times \\dfrac{2}{1} = 20$ cm³。",
      "體積 = 摩爾數 × 氣體摩爾體積 = 0.5 × 24 = 12 dm³。"
    ],
    "mustKnowEn": [
      "$n = \\frac{16}{32} = 0.5$ mol, then $V = 24n = 12$ dm³.",
      "$n = \\frac{64}{32} = 2$ mol, then $V = 24n = 48$ dm³.",
      "By Avogadro's law, gas volumes at the same temperature and pressure are in the same ratio as the moles, so the coefficients can be applied directly without converting to moles:…",
      "Volume = amount in moles × molar volume = 0.5 × 24 = 12 dm³. The molar volume does not depend on the identity of the gas: at the same temperature and pressure equal amounts of any…"
    ],
    "examTipZh": "DSE 作答「氣體體積」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Gas Volume”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$0.5$ 漏了 $\\times 24$；$384$ 用了質量而非摩爾。",
    "commonTrapEn": "$384$ uses mass instead of moles.",
    "source": "generated"
  },
  "stoichiometry": {
    "subjectId": "chemistry",
    "topicId": "stoichiometry",
    "titleZh": "化學計量",
    "titleEn": "Stoichiometry",
    "conceptZh": "酸鹼摩爾比 $1:1$：$c_aV_a = c_bV_b$ ⇒ $V_b = \\dfrac{c_aV_a}{c_b} = \\dfrac{2\\times24}{3} = 16$ cm³。",
    "conceptEn": "1:1 ratio: $c_aV_a=c_bV_b$ ⇒ $V_b = \\frac{c_aV_a}{c_b} = 16$ cm³.",
    "mustKnowZh": [
      "酸鹼摩爾比 $1:1$：$c_aV_a = c_bV_b$ ⇒ $V_b = \\dfrac{c_aV_a}{c_b} = \\dfrac{2\\times24}{3} = 16$ cm³。",
      "判斷限量反應物不能只比較摩爾數，必須按方程式的【係數比】換算。",
      "物質的量由 $n = \\dfrac{m}{M}$ 求得，即 $\\dfrac{11.7}{58.5} = 0.2$ mol。",
      "物質的量由 $n = \\dfrac{m}{M}$ 求得，即 $\\dfrac{25}{100} = 0.25$ mol。"
    ],
    "mustKnowEn": [
      "1:1 ratio: $c_aV_a=c_bV_b$ ⇒ $V_b = \\frac{c_aV_a}{c_b} = 16$ cm³.",
      "1:1 ratio ⇒ $m(\\mathrm{CaO}) = \\frac{25\\times56}{100} = 14$ g.",
      "A limiting reactant cannot be identified by comparing moles alone; the COEFFICIENT ratio must be applied. 2 mol of $\\mathrm{Mg}$ requires $2 \\times \\frac{1}{2} = 1$ mol of…",
      "A limiting reactant cannot be identified by comparing moles alone; the COEFFICIENT ratio must be applied. 2 mol of $\\mathrm{H_2}$ requires $2 \\times \\frac{1}{2} = 1$ mol of…"
    ],
    "examTipZh": "DSE 作答「化學計量」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Stoichiometry”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$36$ 將兩個濃度倒轉；$48$ 漏了 $\\div c_b$；$24$ 當兩者體積相等。",
    "commonTrapEn": "$48$ forgets $\\div c_b$; $24$ assumes equal volumes.",
    "source": "generated"
  }
}
