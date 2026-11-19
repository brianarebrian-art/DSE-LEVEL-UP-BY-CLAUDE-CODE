// ⚠️ 由 scripts/gen-study-notes.mts 產生 —— 請勿手動修改。
import type { StudyNote } from '../types'

export const notes: Record<string, StudyNote> = {
  "mechanics": {
    "subjectId": "physics",
    "topicId": "mechanics",
    "titleZh": "力學",
    "titleEn": "Mechanics",
    "conceptZh": "$F = ma = 2 \\times 3 = 6\\,\\text{N}$。",
    "conceptEn": "$F = ma = 2 \\times 3 = 6\\,\\text{N}$.",
    "mustKnowZh": [
      "$F = ma = 2 \\times 3 = 6\\,\\text{N}$。",
      "$v = u + at = 5 + 2\\times4 = 13\\,\\text{m/s}$。",
      "$v = u + at = 10 + -2\\times3 = 4\\,\\text{m/s}$。",
      "$E_k = \\frac{1}{2}mv^2 = \\frac{1}{2}\\times2\\times3^2 = 9\\,\\text{J}$。"
    ],
    "mustKnowEn": [
      "$F = ma = 2 \\times 3 = 6\\,\\text{N}$.",
      "$v = u + at = 5 + 2\\times4 = 13\\,\\text{m/s}$.",
      "$v = u + at = 10 + -2\\times3 = 4\\,\\text{m/s}$.",
      "$E_k = \\frac{1}{2}mv^2 = \\frac{1}{2}\\times2\\times3^2 = 9\\,\\text{J}$."
    ],
    "examTipZh": "DSE 作答「力學」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Mechanics”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$0.667$ N 用了除法；$5$ N 用了加法；$20$ N 誤用重力加速度 $g = 10$ m/s²，那是計重量而非本題所問的合力。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "electricity": {
    "subjectId": "physics",
    "topicId": "electricity",
    "titleZh": "電學",
    "titleEn": "Electricity",
    "conceptZh": "$V = IR = 2\\times5 = 10\\,\\text{V}$。",
    "conceptEn": "$V = IR = 2\\times5 = 10\\,\\text{V}$.",
    "mustKnowZh": [
      "$V = IR = 2\\times5 = 10\\,\\text{V}$。",
      "$V = IR = 0.",
      "$P = VI = 12\\times2 = 24\\,\\text{W}$。",
      "$P = VI = 240\\times0."
    ],
    "mustKnowEn": [
      "$V = IR = 2\\times5 = 10\\,\\text{V}$.",
      "$V = IR = 0.",
      "$P = VI = 12\\times2 = 24\\,\\text{W}$.",
      "$P = VI = 240\\times0."
    ],
    "examTipZh": "DSE 作答「電學」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Electricity”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$0.667$ 或 $1.5$ 錯用了除法。",
    "commonTrapEn": "dividing instead of multiplying.",
    "source": "generated"
  },
  "heat": {
    "subjectId": "physics",
    "topicId": "heat",
    "titleZh": "熱學",
    "titleEn": "Heat",
    "conceptZh": "$Q = mc\\Delta T = 1\\times4200\\times10 = 42000\\,\\text{J}$。",
    "conceptEn": "$Q = mc\\Delta T = 1\\times4200\\times10 = 42000\\,\\text{J}$.",
    "mustKnowZh": [
      "$Q = mc\\Delta T = 1\\times4200\\times10 = 42000\\,\\text{J}$。",
      "$Q = mc\\Delta T = 0.",
      "輻射以電磁波傳播，可在真空中進行；傳導與對流均需介質。",
      "$Q = mc\\Delta T = 2\\times400\\times10 = 8000$ J。"
    ],
    "mustKnowEn": [
      "$Q = mc\\Delta T = 1\\times4200\\times10 = 42000\\,\\text{J}$.",
      "$Q = mc\\Delta T = 0.",
      "Radiation travels as electromagnetic waves and works in a vacuum; conduction and convection need a medium.",
      "$Q = mc\\Delta T = 8000$ J."
    ],
    "examTipZh": "DSE 作答「熱學」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Heat”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$800$ 漏了 $\\Delta T$；$4000$ 漏了質量 $m$。",
    "commonTrapEn": "$800$ drops $\\Delta T$; $4000$ drops the mass.",
    "source": "generated"
  },
  "waves": {
    "subjectId": "physics",
    "topicId": "waves",
    "titleZh": "波動",
    "titleEn": "Waves",
    "conceptZh": "$v = f\\lambda = 2\\times3 = 6\\,\\text{m/s}$。",
    "conceptEn": "$v = f\\lambda = 2\\times3 = 6\\,\\text{m/s}$.",
    "mustKnowZh": [
      "$v = f\\lambda = 2\\times3 = 6\\,\\text{m/s}$。",
      "$v = f\\lambda = 4\\times0.",
      "$T = \\frac{1}{f} = \\frac{1}{2} = 0.",
      "$f = \\frac{v}{\\lambda} = \\frac{340}{2} = 170\\,\\text{Hz}$。"
    ],
    "mustKnowEn": [
      "$v = f\\lambda = 2\\times3 = 6\\,\\text{m/s}$.",
      "$v = f\\lambda = 4\\times0.",
      "$T = \\frac{1}{f} = \\frac{1}{2} = 0.",
      "$f = \\frac{v}{\\lambda} = \\frac{340}{2} = 170\\,\\text{Hz}$."
    ],
    "examTipZh": "DSE 作答「波動」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Waves”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$1.5$ 與 $0.667$ 用了除法；$5$ 用了加法。單位可作核對：Hz 即每秒次數，乘以米得米每秒，正是速率的單位。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "optics": {
    "subjectId": "physics",
    "topicId": "optics",
    "titleZh": "光學",
    "titleEn": "Optics",
    "conceptZh": "水較密，折射率較大，光速減慢（並向法線偏折）。",
    "conceptEn": "Water is optically denser, so light slows down (and bends toward the normal).",
    "mustKnowZh": [
      "水較密，折射率較大，光速減慢（並向法線偏折）。",
      "平面鏡成正立、等大的虛像，像距等於物距。",
      "由密介質射向疏介質且入射角超過臨界角時，光全部反射回原介質。",
      "凸透鏡為會聚透鏡，平行光經折射後會聚於焦點。"
    ],
    "mustKnowEn": [
      "Water is optically denser, so light slows down (and bends toward the normal).",
      "A plane mirror gives an upright, same-size virtual image at equal distance behind it.",
      "From a denser to a rarer medium beyond the critical angle, all light reflects back — total internal reflection.",
      "A convex lens is converging; parallel rays meet at the focal point."
    ],
    "examTipZh": "DSE 作答「光學」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Optics”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$0.833$ 上下倒轉（結果細於 1，一望即知不可能）；$0.5$ 用了相減；$7.5$ 用了相乘。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "radioactivity": {
    "subjectId": "physics",
    "topicId": "radioactivity",
    "titleZh": "放射現象",
    "titleEn": "Radioactivity",
    "conceptZh": "每個半衰期數量減半：$N = \\frac{800}{2^{2}} = 200$。",
    "conceptEn": "Each half-life halves the amount: $N = \\frac{800}{2^{2}} = 200$.",
    "mustKnowZh": [
      "每個半衰期數量減半：$N = \\frac{800}{2^{2}} = 200$。",
      "總時間 $= 2\\times3 = 6$ 天。",
      "穿透力 $\\gamma > \\beta > \\alpha$；$\\alpha$ 一張紙即可擋住。",
      "$\\alpha$ 粒子即氦核，含 2 質子 + 2 中子。"
    ],
    "mustKnowEn": [
      "Each half-life halves the amount: $N = \\frac{800}{2^{2}} = 200$.",
      "Total time $= 2\\times3 = 6$ days.",
      "Penetration: $\\gamma > \\beta > \\alpha$; $\\alpha$ is stopped by paper.",
      "An $\\alpha$ particle is a helium nucleus: 2 protons and 2 neutrons."
    ],
    "examTipZh": "DSE 作答「放射現象」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Radioactivity”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$133.33333333333334$ 把「減半 3 次」誤算成「除以 $2 \\times 3$」——減半是連乘不是連加；$700$ 是已衰變的數目；$200$ 誤除以 $4$。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "phys_hell_mechanics": {
    "subjectId": "physics",
    "topicId": "phys_hell_mechanics",
    "titleZh": "多步計算・力學",
    "titleEn": "Multi-step — Mechanics",
    "conceptZh": "用 $v^2 = u^2 + 2as$：$0 = 30^2 + 2a(60) \\Rightarrow a = -900/120 = -7.",
    "conceptEn": "Use $v^2 = u^2 + 2as$: $0 = 30^2 + 2a(60) \\Rightarrow a = -7.",
    "mustKnowZh": [
      "用 $v^2 = u^2 + 2as$：$0 = 30^2 + 2a(60) \\Rightarrow a = -900/120 = -7.",
      "動量守恆求共速：$v = (2\\times3)/(2+4) = 1\\,\\text{m/s}$。",
      "能量守恆：$mgh = \\tfrac12 mv^2 \\Rightarrow v = \\sqrt{2gh} = \\sqrt{2(10)(5)} = \\sqrt{100} = 10\\,\\text{m/s}$。",
      "第一步求落地速率：$v = \\sqrt{2gh} = \\sqrt{2 \\times 10 \\times 5} = 10$ m/s。"
    ],
    "mustKnowEn": [
      "Use $v^2 = u^2 + 2as$: $0 = 30^2 + 2a(60) \\Rightarrow a = -7.",
      "Momentum conservation: $v = (2\\times3)/6 = 1\\,\\text{m/s}$.",
      "Energy conservation: $mgh = \\tfrac12 mv^2 \\Rightarrow v = \\sqrt{2gh} = \\sqrt{100} = 10\\,\\text{m/s}$.",
      "Step one gives the landing speed: $v = \\sqrt{2gh} = \\sqrt{2 \\times 10 \\times 5} = 10$ m/s."
    ],
    "examTipZh": "DSE 作答「多步計算・力學」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Multi-step — Mechanics”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$20$ J 求了動量 $mv$ 而非動能；$10$ J 停在速率；$200$ J 漏了公式中的 $\\frac{1}{2}$。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "phys_hell_elec_heat": {
    "subjectId": "physics",
    "topicId": "phys_hell_elec_heat",
    "titleZh": "多步計算・電與熱",
    "titleEn": "Multi-step — Electricity & Heat",
    "conceptZh": "電流 $I = \\dfrac{\\varepsilon}{R+r} = \\dfrac{12}{5+1} = 2\\,\\text{A}$。",
    "conceptEn": "Current $I = \\dfrac{\\varepsilon}{R+r} = \\dfrac{12}{6} = 2\\,\\text{A}$.",
    "mustKnowZh": [
      "電流 $I = \\dfrac{\\varepsilon}{R+r} = \\dfrac{12}{5+1} = 2\\,\\text{A}$。",
      "並聯等效電阻 $= \\dfrac{6}{2} = 3\\,\\Omega$。",
      "熱平衡：熱水放熱 = 冷水吸熱（$c$ 相同可消去）：$0.",
      "第一步由歐姆定律求電流：$I = \\dfrac{V}{R} = \\dfrac{12}{2} = 6$ A。"
    ],
    "mustKnowEn": [
      "Current $I = \\dfrac{\\varepsilon}{R+r} = \\dfrac{12}{6} = 2\\,\\text{A}$.",
      "Parallel resistance $= 3\\,\\Omega$.",
      "Heat balance: heat lost by hot = heat gained by cold (equal $c$ cancels): $0.",
      "Step one uses Ohm's law for the current: $I = \\frac{V}{R} = \\frac{12}{2} = 6$ A."
    ],
    "examTipZh": "DSE 作答「多步計算・電與熱」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Multi-step — Electricity & Heat”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$6$ W 停在電流；$24$ W 把定律中的除法寫成乘法。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "phys_hell_wave_optics": {
    "subjectId": "physics",
    "topicId": "phys_hell_wave_optics",
    "titleZh": "多步計算・波動光學放射",
    "titleEn": "Multi-step — Waves, Optics & Radioactivity",
    "conceptZh": "介質一波速 $v_1 = f\\lambda_1 = 50\\times0.",
    "conceptEn": "In medium 1, $v_1 = f\\lambda_1 = 50\\times0.",
    "mustKnowZh": [
      "介質一波速 $v_1 = f\\lambda_1 = 50\\times0.",
      "$12$ 天 $= 4$ 個半衰期，活度 $= 800 \\div 2^4 = 800 \\div 16 = 50\\,\\text{Bq}$。",
      "臨界角 $\\theta_c$ 滿足 $\\sin\\theta_c = \\dfrac{1}{n} = \\dfrac{1}{1.",
      "第一步求波速：$v = f\\lambda = 4 \\times 3 = 12$ m/s。"
    ],
    "mustKnowEn": [
      "In medium 1, $v_1 = f\\lambda_1 = 50\\times0.",
      "$12$ days $= 4$ half-lives, so activity $= 800 \\div 2^4 = 50\\,\\text{Bq}$.",
      "The critical angle $\\theta_c$ satisfies $\\sin\\theta_c = \\dfrac{1}{n} = \\dfrac{1}{1.",
      "Step one gives the wave speed: $v = f\\lambda = 4 \\times 3 = 12$ m/s."
    ],
    "examTipZh": "DSE 作答「多步計算・波動光學放射」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Multi-step — Waves, Optics & Radioactivity”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$12$ s 停在波速（單位亦錯）；$30$ s 用頻率作分母；$40$ s 用波長作分母 —— 後兩者都跳過了求波速這一步。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "kinematics": {
    "subjectId": "physics",
    "topicId": "kinematics",
    "titleZh": "運動學",
    "titleEn": "Kinematics",
    "conceptZh": "速率 $= \\dfrac{\\text{距離}}{\\text{時間}} = \\dfrac{4}{2} = 2$ m/s。",
    "conceptEn": "Speed $= \\frac{d}{t} = \\frac{4}{2} = 2$ m/s.",
    "mustKnowZh": [
      "速率 $= \\dfrac{\\text{距離}}{\\text{時間}} = \\dfrac{4}{2} = 2$ m/s。",
      "$v = u + at = 2 + 2\\times3 = 2 + 6 = 8$ m/s。",
      "$v = \\sqrt{u^2 + 2as} = \\sqrt{16 + 20} = \\sqrt{36} = 6$ m/s。",
      "$h = \\tfrac12 g t^2$ ⇒ $t = \\sqrt{\\dfrac{2h}{g}} = \\sqrt{\\dfrac{90}{10}} = 3$ s。"
    ],
    "mustKnowEn": [
      "Speed $= \\frac{d}{t} = \\frac{4}{2} = 2$ m/s.",
      "$v = u + at = 8$ m/s.",
      "$v = \\sqrt{u^2 + 2as} = 6$ m/s.",
      "$t = \\sqrt{\\frac{2h}{g}} = 3$ s."
    ],
    "examTipZh": "DSE 作答「運動學」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Kinematics”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$8$ 用了乘法；$0.5$ 上下倒轉。",
    "commonTrapEn": "$8$ multiplies instead of dividing.",
    "source": "generated"
  },
  "force_motion": {
    "subjectId": "physics",
    "topicId": "force_motion",
    "titleZh": "力與運動",
    "titleEn": "Force & Motion",
    "conceptZh": "$W = mg = 2 \\times 10 = 20$ N。",
    "conceptEn": "$W = mg = 20$ N.",
    "mustKnowZh": [
      "$W = mg = 2 \\times 10 = 20$ N。",
      "$p = mv = 2\\times3 = 6$ kg·m/s。",
      "等速滑動即合力為零，推力必須恰好抵銷摩擦力。",
      "方向相反的兩力，合力大小為兩者之差，方向跟隨較大者：$12 - 5 = 7$ N，向右。"
    ],
    "mustKnowEn": [
      "$W = mg = 20$ N.",
      "$p = mv = 6$ kg·m/s.",
      "Constant speed means zero net force, so the push must exactly balance friction.",
      "For forces in opposite directions the net force is their difference, acting in the direction of the larger: $12 - 5 = 7$ N to the right."
    ],
    "examTipZh": "DSE 作答「力與運動」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Force & Motion”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$2$ 漏了 $\\times g$；$0.2$ 錯用了除法。",
    "commonTrapEn": "$2$ forgets to multiply by $g$.",
    "source": "generated"
  },
  "pressure_density": {
    "subjectId": "physics",
    "topicId": "pressure_density",
    "titleZh": "壓強與密度",
    "titleEn": "Pressure & Density",
    "conceptZh": "$\\rho = \\dfrac{m}{V} = \\dfrac{4}{2} = 2$ kg/m³。",
    "conceptEn": "$\\rho = \\frac{m}{V} = 2$ kg/m³.",
    "mustKnowZh": [
      "$\\rho = \\dfrac{m}{V} = \\dfrac{4}{2} = 2$ kg/m³。",
      "$P = \\dfrac{F}{A} = \\dfrac{6}{2} = 3$ Pa。",
      "本題的失分位不在算術，而在於混淆「力」與「壓強」。"
    ],
    "mustKnowEn": [
      "$\\rho = \\frac{m}{V} = 2$ kg/m³.",
      "$P = \\frac{F}{A} = 3$ Pa.",
      "The marks are lost not on arithmetic but on confusing force with pressure."
    ],
    "examTipZh": "DSE 作答「壓強與密度」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Pressure & Density”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$0.5$ 上下倒轉。",
    "commonTrapEn": "inverting the ratio.",
    "source": "generated"
  },
  "work_energy": {
    "subjectId": "physics",
    "topicId": "work_energy",
    "titleZh": "功、能與功率",
    "titleEn": "Work, Energy & Power",
    "conceptZh": "$E_k = \\tfrac12 mv^2 = \\tfrac12 \\times 2 \\times 3^2 = 9$ J。",
    "conceptEn": "$E_k = \\frac12 mv^2 = 9$ J.",
    "mustKnowZh": [
      "$E_k = \\tfrac12 mv^2 = \\tfrac12 \\times 2 \\times 3^2 = 9$ J。",
      "$E_p = mgh = 2\\times10\\times3 = 60$ J。",
      "效率 $= \\dfrac{\\text{有用輸出}}{\\text{總輸入}} \\times 100\\% = \\dfrac{50}{200} \\times 100\\% = 25\\%$。",
      "本題考核的是【由數據走到結論】的完整過程：計算要寫得出步驟，解釋要指出機制而非複述現象，延伸部分要處理題目指定的比較或條件。"
    ],
    "mustKnowEn": [
      "$E_k = \\frac12 mv^2 = 9$ J.",
      "$E_p = mgh = 60$ J.",
      "Efficiency $= \\frac{\\text{useful}}{\\text{total}} \\times 100\\% = 25\\%$.",
      "(a) and (b) are routine; the usual deduction in (b) is omitting the weight — the tension must both support the weight and supply the acceleration, and writing T = ma is the most c…"
    ],
    "examTipZh": "DSE 作答「功、能與功率」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Work, Energy & Power”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$18$ 漏了 $\\tfrac12$；$3$ 漏了平方。",
    "commonTrapEn": "$18$ drops the $\\frac12$; $3$ forgets to square $v$.",
    "source": "generated"
  }
}
