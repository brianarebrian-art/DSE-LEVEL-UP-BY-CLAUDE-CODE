// ⚠️ 由 scripts/gen-study-notes.mts 產生 —— 請勿手動修改。
import type { StudyNote } from '../types'

export const notes: Record<string, StudyNote> = {
  "design_process": {
    "subjectId": "design-tech",
    "topicId": "design_process",
    "titleZh": "設計過程",
    "titleEn": "Design Process",
    "conceptZh": "設計簡介清晰界定問題、目標、使用者與限制，是設計的起點。",
    "conceptEn": "A design brief defines the problem, aims, users and constraints — the starting point of design.",
    "mustKnowZh": [
      "設計簡介清晰界定問題、目標、使用者與限制，是設計的起點。",
      "前期研究掌握使用者需要、市場現況與技術限制，為設計提供依據。",
      "原型把概念實體化以供測試，及早發現缺陷並改良，降低後期風險。",
      "評估須對照設計簡介的準則與使用者回饋，客觀判斷方案是否達標。"
    ],
    "mustKnowEn": [
      "A design brief defines the problem, aims, users and constraints — the starting point of design.",
      "Early research gathers user needs, market context and constraints to inform the design.",
      "Prototypes make concepts tangible for testing, catching flaws early and reducing later risk.",
      "Evaluation tests the solution against the brief’s criteria and user feedback."
    ],
    "examTipZh": "DSE 作答「設計過程」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Design Process”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "3 把方向倒轉，當成放大比例；30 完全沒有換算；40 把比例數字當成加數。",
    "commonTrapEn": "3 reverses the direction and treats it as an enlargement; 30 makes no conversion; 40 adds the scale figure.",
    "source": "generated"
  },
  "design_elements": {
    "subjectId": "design-tech",
    "topicId": "design_elements",
    "titleZh": "設計元素與原則",
    "titleEn": "Elements & Principles",
    "conceptZh": "設計元素包括線條、形狀、色彩、質感、空間等視覺基本構件。",
    "conceptEn": "Design elements include line, shape, colour, texture and space — the visual building blocks.",
    "mustKnowZh": [
      "設計元素包括線條、形狀、色彩、質感、空間等視覺基本構件。",
      "平衡指視覺元素分佈使畫面穩定，分對稱與非對稱平衡。",
      "對比（明暗、大小、色彩）製造差異，引導視線並突出重點。",
      "視覺層次以大小、位置、色彩等引導視線，使重要資訊先被注意。"
    ],
    "mustKnowEn": [
      "Design elements include line, shape, colour, texture and space — the visual building blocks.",
      "Balance distributes visual weight for stability, in symmetric or asymmetric forms.",
      "Contrast (in value, size, colour) creates difference, guiding the eye and stressing key elements.",
      "Hierarchy uses size, position and colour to lead the eye so key information is seen first."
    ],
    "examTipZh": "DSE 作答「設計元素與原則」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Elements & Principles”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "混淆相近概念、漏讀題幹限制，或計算後未代回原式檢查。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "materials": {
    "subjectId": "design-tech",
    "topicId": "materials",
    "titleZh": "材料與特性",
    "titleEn": "Materials & Properties",
    "conceptZh": "熱塑性塑膠受熱軟化、冷卻變硬，可反覆加工與回收。",
    "conceptEn": "Thermoplastics soften when heated and harden when cooled, allowing reshaping and recycling.",
    "mustKnowZh": [
      "熱塑性塑膠受熱軟化、冷卻變硬，可反覆加工與回收。",
      "熱固性塑膠固化後形成永久交聯結構，受熱不會再軟化重塑。",
      "延展性指材料可被拉長／拉成幼線而不破裂，如銅與金。",
      "手柄宜用隔熱材料（如某些塑膠／木），防止熱傳至手部造成燙傷。"
    ],
    "mustKnowEn": [
      "Thermoplastics soften when heated and harden when cooled, allowing reshaping and recycling.",
      "Thermosets form permanent cross-links on curing and will not soften again with heat.",
      "Ductility is the capacity to be stretched into wire without fracturing, as in copper and gold.",
      "Handles should use insulating materials (some plastics/wood) to keep heat from the hand."
    ],
    "examTipZh": "DSE 作答「材料與特性」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Materials & Properties”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "37 把除法與乘法對調；100 只抄了體積；2.7 只抄了密度。",
    "commonTrapEn": "37 divides instead of multiplying; 100 copies the volume; 2.7 copies the density.",
    "source": "generated"
  },
  "structures_mech": {
    "subjectId": "design-tech",
    "topicId": "structures_mech",
    "titleZh": "結構與機械",
    "titleEn": "Structures & Mechanisms",
    "conceptZh": "三角形受力時形狀不變，是最穩定的幾何結構，常用於桁架。",
    "conceptEn": "A triangle keeps its shape under load — the most stable shape, used in trusses.",
    "mustKnowZh": [
      "三角形受力時形狀不變，是最穩定的幾何結構，常用於桁架。",
      "張力使物料被拉長，壓力使物料被壓縮，結構須同時承受兩者。",
      "橫樑受荷載時彎曲，上緣受壓、下緣受拉，設計須抵抗彎矩。",
      "小齒輪帶大齒輪使輸出轉速下降、扭力上升，常用於需要大力的場合。"
    ],
    "mustKnowEn": [
      "A triangle keeps its shape under load — the most stable shape, used in trusses.",
      "Tension stretches a material while compression squeezes it; structures resist both.",
      "A beam bends under load — compressed on top, in tension below — so it must resist bending moments.",
      "A small driver turning a larger gear lowers output speed and raises torque, useful where force is needed."
    ],
    "examTipZh": "DSE 作答「結構與機械」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Structures & Mechanisms”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "混淆相近概念、漏讀題幹限制，或計算後未代回原式檢查。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "manufacturing": {
    "subjectId": "design-tech",
    "topicId": "manufacturing",
    "titleZh": "生產工序",
    "titleEn": "Manufacturing Processes",
    "conceptZh": "大量生產以標準化流程大批生產，攤薄固定成本，降低單位成本。",
    "conceptEn": "Mass production makes standardised items in volume, spreading fixed costs to lower unit cost.",
    "mustKnowZh": [
      "大量生產以標準化流程大批生產，攤薄固定成本，降低單位成本。",
      "注塑把熔融塑膠注入模具，快速大量生產一致的塑膠部件。",
      "車削讓工件旋轉、刀具切削，加工圓柱、錐體等迴轉對稱形狀。",
      "注塑等開模成本高，須大量生產攤薄；小批量則宜用 3D 打印等低開模成本方法。"
    ],
    "mustKnowEn": [
      "Mass production makes standardised items in volume, spreading fixed costs to lower unit cost.",
      "Injection moulding forces molten plastic into a mould to mass-produce consistent parts.",
      "In turning the workpiece rotates against a cutting tool, shaping cylinders and other symmetric forms.",
      "High-tooling processes like moulding need volume to pay off; small runs suit low-tooling methods like 3D printing."
    ],
    "examTipZh": "DSE 作答「生產工序」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Manufacturing Processes”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "混淆相近概念、漏讀題幹限制，或計算後未代回原式檢查。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "cad_cam": {
    "subjectId": "design-tech",
    "topicId": "cad_cam",
    "titleZh": "電腦輔助設計與製造",
    "titleEn": "CAD/CAM & Technology",
    "conceptZh": "CAD 讓設計師以軟件繪製、修改與視覺化二維圖則或三維模型。",
    "conceptEn": "CAD lets designers draw, edit and visualise 2-D drawings or 3-D models in software.",
    "mustKnowZh": [
      "CAD 讓設計師以軟件繪製、修改與視覺化二維圖則或三維模型。",
      "CAM 把 CAD 數據轉為機器指令，控制 CNC 等設備自動加工。",
      "CAD/CAM 整合使設計直接轉為製造指令，減少重複輸入、誤差與生產時間。",
      "CNC（電腦數值控制）依程式精確、重複地控制刀具路徑與加工。"
    ],
    "mustKnowEn": [
      "CAD lets designers draw, edit and visualise 2-D drawings or 3-D models in software.",
      "CAM converts CAD data into machine instructions, driving CNC and other automated tools.",
      "CAD/CAM integration turns designs directly into machine code, cutting re-entry, errors and lead time.",
      "CNC (computer numerical control) follows programs to machine precisely and repeatably."
    ],
    "examTipZh": "DSE 作答「電腦輔助設計與製造」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “CAD/CAM & Technology”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "混淆相近概念、漏讀題幹限制，或計算後未代回原式檢查。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "ergonomics": {
    "subjectId": "design-tech",
    "topicId": "ergonomics",
    "titleZh": "人體工學",
    "titleEn": "Ergonomics & Human Factors",
    "conceptZh": "人體工學研究人與產品／環境的互動，使設計更舒適、安全與高效。",
    "conceptEn": "Ergonomics studies the interaction of people with products and environments for comfort, safety and efficiency.",
    "mustKnowZh": [
      "人體工學研究人與產品／環境的互動，使設計更舒適、安全與高效。",
      "人體測量數據（身高、臂長等）讓設計合乎大多數使用者的尺寸需要。",
      "以第5至第95百分位設計可調範圍，能涵蓋約九成使用者，兼顧大小體型。",
      "易用性指產品易學、操作有效率、不易出錯且令使用者滿意。"
    ],
    "mustKnowEn": [
      "Ergonomics studies the interaction of people with products and environments for comfort, safety and efficiency.",
      "Anthropometric data (heights, reach, etc.) help designs fit the size range of most users.",
      "Spanning the 5th–95th percentile covers about 90% of users, fitting both small and large bodies.",
      "Usability means a product is easy to learn, efficient, error-resistant and satisfying to use."
    ],
    "examTipZh": "DSE 作答「人體工學」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Ergonomics & Human Factors”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "混淆相近概念、漏讀題幹限制，或計算後未代回原式檢查。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "sustainability": {
    "subjectId": "design-tech",
    "topicId": "sustainability",
    "titleZh": "可持續設計",
    "titleEn": "Sustainable Design",
    "conceptZh": "可持續設計從選材、生產、使用到棄置全程考量，減少環境負擔。",
    "conceptEn": "Sustainable design considers the whole life cycle — materials, production, use and disposal — to cut impact.",
    "mustKnowZh": [
      "可持續設計從選材、生產、使用到棄置全程考量，減少環境負擔。",
      "經典 3R 為 Reduce、Reuse、Recycle；Redesign 非其中之一。",
      "LCA 系統評估產品從搖籃到墳墓各階段的能源、排放與資源消耗。",
      "可拆解設計讓零件易於分離，便於維修、更換與分類回收，延長壽命。"
    ],
    "mustKnowEn": [
      "Sustainable design considers the whole life cycle — materials, production, use and disposal — to cut impact.",
      "The classic 3Rs are Reduce, Reuse and Recycle; Redesign is not one of them.",
      "LCA systematically evaluates energy, emissions and resource use at every stage from cradle to grave.",
      "Design for disassembly lets parts be separated for repair, replacement and recycling, extending life."
    ],
    "examTipZh": "DSE 作答「可持續設計」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Sustainable Design”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "混淆相近概念、漏讀題幹限制，或計算後未代回原式檢查。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "dat_mechanisms_calc": {
    "subjectId": "design-tech",
    "topicId": "dat_mechanisms_calc",
    "titleZh": "結構與機械・計算",
    "titleEn": "Structures & mechanisms — calculation",
    "conceptZh": "齒輪比 = 從動 ÷ 主動 = 60/20 = 3。",
    "conceptEn": "Gear ratio = driven ÷ driver = 60/20 = 3. The larger driven gear turns slower (1/3 speed) but its torque rises ~3× (power is conserved: lower speed ⇒ higher torque).",
    "mustKnowZh": [
      "齒輪比 = 從動 ÷ 主動 = 60/20 = 3。",
      "動滑輪以兩段繩共同承托負載，故施力 ≈ 負載 ÷ 2，理想 MA = 2；但「功」守恆，省一半力就要多拉一倍距離。",
      "槓桿平衡的條件是兩邊力矩相等：$F_1 d_1 = F_2 d_2$，即 20 × 2 = F × 5，故 F = 40 ÷ 5 = 8 牛頓。",
      "齒輪嚙合時，兩輪在單位時間內走過的齒數相同，故轉速與齒數成【反】比：$N_1 T_1 = N_2 T_2$。"
    ],
    "mustKnowEn": [
      "Gear ratio = driven ÷ driver = 60/20 = 3. The larger driven gear turns slower (1/3 speed) but its torque rises ~3× (power is conserved: lower speed ⇒ higher torque).",
      "A movable pulley has two rope sections sharing the load, so effort ≈ load ÷ 2 and ideal MA = 2; work is conserved, so halving the force doubles the distance pulled. MA = 1 is the…",
      "A lever balances when the moments are equal: $F_1 d_1 = F_2 d_2$, so 20 × 2 = F × 5 and F = 40 ÷ 5 = 8 N. The longer the arm the smaller the force required, which is the principle…",
      "A lever balances when the moments are equal: $F_1 d_1 = F_2 d_2$, so 20 × 3 = F × 5 and F = 60 ÷ 5 = 12 N. The longer the arm the smaller the force required, which is the…"
    ],
    "examTipZh": "DSE 作答「結構與機械・計算」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Structures & mechanisms — calculation”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "「轉速 3 倍」弄反了大齒輪轉慢的關係；「都不變」忽略齒數比；末項違反速度與扭力此消彼長。",
    "commonTrapEn": "“3× faster” reverses the big-gear-turns-slower relation; “unchanged” ignores the ratio; the last breaks the speed-torque trade-off.",
    "source": "generated"
  },
  "dat_materials_reason": {
    "subjectId": "design-tech",
    "topicId": "dat_materials_reason",
    "titleZh": "材料與結構・推理",
    "titleEn": "Materials & structures — reasoning",
    "conceptZh": "三角形受側力時，除非邊長改變否則無法變形（幾何剛性）；四邊形在固定邊長下仍可被推成平行四邊形而坍塌。",
    "conceptEn": "Under a sideways force a triangle cannot deform unless a side length changes (geometric rigidity); a rectangle of fixed side lengths can still be pushed into a parallelogram and…",
    "mustKnowZh": [
      "三角形受側力時，除非邊長改變否則無法變形（幾何剛性）；四邊形在固定邊長下仍可被推成平行四邊形而坍塌。",
      "抗彎剛度與截面的「深度」成三次方關係：把材料移離中性軸，剛度上升得遠比重量快。",
      "鋁合金的密度約為鋼的三分之一，因此在同樣體積下輕得多，這是選用它的首要理由 —— 航空、單車、手提設備都看重這一點。",
      "三角形是唯一「邊長確定即形狀確定」的多邊形：三條邊的長度一經固定，內角便無法改變，即使接點是可自由轉動的鉸接也不會變成另一個形狀。"
    ],
    "mustKnowEn": [
      "Under a sideways force a triangle cannot deform unless a side length changes (geometric rigidity); a rectangle of fixed side lengths can still be pushed into a parallelogram and…",
      "Bending stiffness varies with the cube of section depth: moving material away from the neutral axis raises stiffness far faster than it raises weight. Ribs place a small amount of…",
      "Aluminium alloy has roughly one third the density of steel, so it is far lighter for the same volume, and that is the primary reason for choosing it — aircraft, bicycles and…",
      "A triangle is the only polygon whose shape is fully determined by its side lengths: fix the three sides and the angles cannot change, even if the joints are free-turning pins. A…"
    ],
    "examTipZh": "DSE 作答「材料與結構・推理」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Materials & structures — reasoning”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "「用更多材料」非主因；「四邊形不能承力」過度；「純美觀」否定其結構作用。",
    "commonTrapEn": "“More material” is not the reason; “rectangles bear no load” overstates; “decorative” denies its structural role.",
    "source": "generated"
  }
}
