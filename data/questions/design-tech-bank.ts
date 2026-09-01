import type { Question } from './types'
import { createBank, n, qty, round, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// design-tech-bank.ts —— 設計與應用科技參數化母模板（2026-08-29）
// ---------------------------------------------------------------------------
// 第七批。dat_mechanisms_calc（92）為全科最厚，完全不碰；只為其餘九個
// 介乎 10 至 40 條的課題出題。
//
// 撰寫前的迴圈估算：數值模板目標 24 至 45 條，分類型模板 10 至 18 條，
// 令九個薄弱課題各自落在 30 至 60 之間。
//
// ⚠️ 沿用體育科那一批的三項防範（該批八閘一次通過）：
//   一、所有選項一律寫成明確的 [zh, en] 對；干擾項由具名的雙語資料表取出，
//      不從只有中文的清單構造（前五批曾四次因此觸雙語閘）。
//   二、以區間分類時取值落在區間內部，避免題幹相同而答案互相否定。
//   三、每組模板的目標產出先估算後撰寫，避免單一模板灌爆已最厚的課題。
//   四、凡以 find() 由清單取正確項者，一律改用 `if (!x) continue` 而非 `!`
//      斷言——體育科曾因新增資料而 find 回傳 undefined，tsc 捉不到。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  reason: { id: 'dat_materials_reason', zh: '材料與結構・推理', en: 'Materials & structures — reasoning' },
  elements: { id: 'design_elements', zh: '設計元素與原則', en: 'Design Elements & Principles' },
  structures: { id: 'structures_mech', zh: '結構與機械', en: 'Structures & Mechanisms' },
  manufacturing: { id: 'manufacturing', zh: '生產工序', en: 'Manufacturing Processes' },
  cad: { id: 'cad_cam', zh: '電腦輔助設計與製造', en: 'CAD / CAM' },
  ergo: { id: 'ergonomics', zh: '人體工學', en: 'Ergonomics' },
  sustain: { id: 'sustainability', zh: '可持續設計', en: 'Sustainable Design' },
  materials: { id: 'materials', zh: '材料與特性', en: 'Materials & Properties' },
  process: { id: 'design_process', zh: '設計過程', en: 'Design Process' },
} satisfies Record<string, TopicMeta>

const FW = {
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
} satisfies Record<string, FwMeta>

const b = createBank('design-tech')
const distract = (correct: number, cands: number[]): number[] =>
  cands.filter((v, i, a) => v !== correct && a.indexOf(v) === i && Number.isFinite(v) && v > 0).slice(0, 3)

// ── 電腦輔助設計與製造（目標約 40 條）──────────────────────────────────────

// CD1 — 圖則比例換算
for (const denom of [2, 5, 10, 20, 50, 100]) {
  for (const drawn of [15, 24, 36, 45, 60, 90]) {
    const actual = drawn * denom
    const d = distract(actual, [drawn / denom, drawn + denom, actual / 2])
    if (d.length < 3) continue
    b.add(`datb_cd1_${denom}_${drawn}`, T.cad, FW.apply, denom <= 5 ? 'easy' : 'medium',
      [`一張機件圖以 1 : ${denom} 的比例繪製。圖上量得某邊長為 ${drawn} 毫米，實際長度是多少毫米？`,
       `A component drawing uses a scale of 1 : ${denom}. An edge measures ${drawn} mm on the drawing. What is its actual length?`],
      [qty(actual, '毫米', 'mm'), ...d.map((v) => qty(round(v, 2), '毫米', 'mm'))],
      [`實際長度 = 圖上長度 × 比例分母 = $${drawn} \\times ${denom} = ${actual}$ 毫米。1 : ${denom} 表示圖上一個單位代表實物 ${denom} 個單位，即【縮小】圖。要留意方向：若寫成 ${denom} : 1 則為放大圖，圖上尺寸大於實物，換算時要改為相除——機械製圖中微小零件常用放大圖，看錯方向會令尺寸相差 ${denom} 倍的平方。`,
       `Actual length = drawn length × the scale denominator = $${drawn} \\times ${denom} = ${actual}$ mm. A scale of 1 : ${denom} means one unit on the drawing represents ${denom} units on the object, so the drawing is REDUCED. Note the direction: written ${denom} : 1 it would be an enlargement, with the drawing larger than the object, and conversion would be a division instead. Small components are often drawn enlarged, and reading the direction wrongly puts dimensions out by a factor of ${denom}.`])
  }
}

// CD2 — 公差範圍
for (const nominal of [20, 25, 40, 50, 80, 120]) {
  for (const tol of [0.1, 0.2, 0.5]) {
    const hi = nominal + tol, lo = nominal - tol
    b.add(`datb_cd2_${nominal}_${String(tol).replace('.', '')}`, T.cad, FW.apply, tol >= 0.5 ? 'easy' : tol <= 0.1 ? 'hard' : 'medium',
      [`某零件的標註尺寸為 ${nominal} ± ${tol} 毫米。可接受的尺寸範圍為何？`,
       `A part is dimensioned ${nominal} ± ${tol} mm. What is the acceptable range?`],
      [[`${round(lo, 2)} 至 ${round(hi, 2)} 毫米`, `${round(lo, 2)} to ${round(hi, 2)} mm`],
       [`${nominal} 至 ${round(hi, 2)} 毫米`, `${nominal} to ${round(hi, 2)} mm`],
       [`${round(lo, 2)} 至 ${nominal} 毫米`, `${round(lo, 2)} to ${nominal} mm`],
       [`${round(nominal - tol * 2, 2)} 至 ${round(nominal + tol * 2, 2)} 毫米`, `${round(nominal - tol * 2, 2)} to ${round(nominal + tol * 2, 2)} mm`]],
      [`公差 ± ${tol} 表示上下各容許 ${tol} 毫米偏差，故範圍為 $${nominal} - ${tol} = ${round(lo, 2)}$ 至 $${nominal} + ${tol} = ${round(hi, 2)}$ 毫米，總公差帶寬 ${round(tol * 2, 2)} 毫米。公差的設定是成本與功能的取捨：公差愈窄，加工與檢驗成本愈高。故設計時只應在真正需要配合的尺寸上收緊公差，其餘從寬——把所有尺寸都標成高精度，是新手最常犯的成本錯誤。`,
       `A tolerance of ± ${tol} allows that much deviation either way, so the range runs from $${nominal} - ${tol} = ${round(lo, 2)}$ to $${nominal} + ${tol} = ${round(hi, 2)}$ mm, a total tolerance band of ${round(tol * 2, 2)} mm. Setting tolerances trades cost against function: the tighter the tolerance, the more expensive the machining and inspection. Tighten only the dimensions that actually have to fit and leave the rest generous — specifying high precision everywhere is the classic beginner's cost error.`])
  }
}

// ── 結構與機械（目標約 36 條）──────────────────────────────────────────────

// SM1 — 槓桿的力矩平衡
for (const load of [20, 30, 40, 60, 80]) {
  for (const dLoad of [0.2, 0.3, 0.5]) {
    for (const dEffort of [0.6, 1.0, 1.5, 2.0]) {
      const effort = (load * dLoad) / dEffort
      if (!Number.isInteger(effort * 10)) continue
      const d = distract(effort, [load, load * dEffort, load + dLoad])
      if (d.length < 3) continue
      b.add(`datb_sm1_${load}_${String(dLoad).replace('.', '')}_${String(dEffort).replace('.', '')}`,
        T.structures, FW.apply, dEffort === 1.0 ? 'easy' : 'medium',
        [`一支槓桿的支點兩側：負載 ${load} 牛頓置於距支點 ${dLoad} 米處，施力點距支點 ${dEffort} 米。要令槓桿平衡，需施力多少牛頓？`,
         `On a lever, a load of ${load} N sits ${dLoad} m from the fulcrum and the effort is applied ${dEffort} m from it. What effort is needed for balance?`],
        [qty(round(effort, 2), '牛頓', 'N'), ...d.map((v) => qty(round(v, 2), '牛頓', 'N'))],
        [`力矩平衡條件為：施力 × 施力臂 = 負載 × 負載臂，故施力 = $\\dfrac{${load} \\times ${dLoad}}{${dEffort}} = ${round(effort, 2)}$ 牛頓。機械利益 = $\\dfrac{${dEffort}}{${dLoad}} = ${round(dEffort / dLoad, 2)}$，即省力 ${round(dEffort / dLoad, 2)} 倍。要留意省力必然以【移動距離增加】為代價——功不會憑空產生，槓桿改變的是力與距離的分配，而非總功。`,
         `Moments balance when effort × effort arm = load × load arm, so the effort is $\\dfrac{${load} \\times ${dLoad}}{${dEffort}} = ${round(effort, 2)}$ N. The mechanical advantage is $\\dfrac{${dEffort}}{${dLoad}} = ${round(dEffort / dLoad, 2)}$. Note that force is always saved at the cost of DISTANCE MOVED: work is not created, and a lever redistributes force and distance rather than changing the total.`])
    }
  }
}

// ── 生產工序（目標約 30 條）────────────────────────────────────────────────

const processes: Array<[string, string, string, string]> = [
  ['注塑成型', 'injection moulding', '適合大量生產同款塑膠件，開模成本高但單件成本極低', 'suited to high-volume identical plastic parts: high tooling cost but very low unit cost'],
  ['車削', 'turning', '在車床上加工回轉體零件，適合圓柱與圓錐形狀', 'machining rotationally symmetric parts on a lathe, suited to cylinders and cones'],
  ['激光切割', 'laser cutting', '切口窄而精度高，適合平面板材的小批量與快速原型', 'a narrow, accurate kerf, suited to sheet material in small batches and rapid prototyping'],
  ['三維打印', '3D printing', '可製作複雜內部結構，適合原型與極小批量，速度較慢', 'able to form complex internal geometry, suited to prototypes and very small batches, but slow'],
  ['沖壓', 'stamping', '以模具高速衝切成形金屬薄板，適合大量生產', 'high-speed forming of sheet metal with dies, suited to mass production'],
  ['真空成型', 'vacuum forming', '把加熱軟化的塑膠片吸附於模具，模具成本低，適合中小批量', 'drawing a heat-softened plastic sheet onto a mould: low tooling cost, suited to small and medium batches'],
  ['砂模鑄造', 'sand casting', '把熔融金屬倒入砂模，適合形狀複雜而精度要求不高的金屬件', 'pouring molten metal into a sand mould, suited to complex metal shapes where precision is not critical'],
  ['數控銑削', 'CNC milling', '以電腦控制刀具逐層切除材料，精度高而適合小批量與模具製作', 'computer-controlled cutters removing material layer by layer: accurate, and suited to small batches and tool-making'],
]
for (const [zh, en, desc, descEn] of processes) {
  for (const v of ['特性', '選用']) {
    const others = processes.filter((p) => p[0] !== zh).slice(0, 3)
    if (v === '特性') {
      b.add(`datb_mf1_${en.slice(0, 8)}_a`, T.manufacturing, FW.logic, 'medium',
        [`就${zh}而言，以下哪一項最準確描述其特性？`, `Which statement best describes ${en}?`],
        [[desc, descEn], ...others.map((p) => [p[2], p[3]] as [string, string])],
        [`${zh}的特性為：${desc}。選擇生產工序的核心考量是【批量】：開模類工序（注塑、沖壓）前期投入大而單件成本低，須達一定產量才划算；無模具工序（三維打印、激光切割）前期成本低而單件成本高，適合小批量。設計時應先確定預計產量，工序的選擇才有依據。`,
         `${en.charAt(0).toUpperCase() + en.slice(1)} is ${descEn}. The central consideration in choosing a process is BATCH SIZE: tooled processes such as injection moulding and stamping carry a large up-front cost but a low unit cost, and need volume to pay off; untooled processes such as 3D printing and laser cutting cost little to start but more per part, suiting small batches. Establish the expected volume first, and the choice of process follows.`])
    } else {
      b.add(`datb_mf1_${en.slice(0, 8)}_b`, T.manufacturing, FW.apply, 'hard',
        [`某產品預計生產量與工序特性須互相配合。若要求${desc}，應選用哪一種工序？`,
         `Process choice must match the production requirement. Which process is called for when the need is: ${descEn}?`],
        [[zh, en], ...others.map((p) => [p[0], p[1]] as [string, string])],
        [`所述條件對應${zh}。工序選擇題的解法是【由條件反推】：先看批量（大量抑或小量）、再看幾何（平面、回轉體，抑或複雜立體）、最後看材料（塑膠、金屬板，抑或其他）。三項條件通常已足以唯一決定工序，毋須死記各工序的清單。`,
         `The conditions described correspond to ${en}. Process-selection questions are answered by WORKING BACK FROM THE REQUIREMENT: consider batch size first (large or small), then geometry (flat, rotationally symmetric, or complex three-dimensional), then material (plastic, sheet metal, or other). Those three usually pin down the process uniquely, without memorising lists.`])
    }
  }
}

// ── 人體工學（目標約 30 條）────────────────────────────────────────────────

// ER1 — 百分位數的應用
for (const dim of [
  ['門的高度', 'door height', '第 95 百分位', 'the 95th percentile', '須讓最高的使用者也能通過，故取上限', 'the tallest users must pass through, so the upper end governs'],
  ['椅子的座高', 'seat height', '第 5 百分位', 'the 5th percentile', '須讓最矮的使用者雙腳著地，故取下限', 'the shortest users must reach the floor, so the lower end governs'],
  ['貨架的高度', 'shelf height', '第 5 百分位', 'the 5th percentile', '須讓最矮的使用者伸手可及，故取下限', 'the shortest users must be able to reach, so the lower end governs'],
  ['通道的闊度', 'aisle width', '第 95 百分位', 'the 95th percentile', '須讓最寬的使用者通過，故取上限', 'the widest users must pass, so the upper end governs'],
  ['桌面的高度', 'desk height', '第 5 百分位', 'the 5th percentile', '須讓最矮的使用者手肘自然放置，故取下限', 'the shortest users must rest their elbows comfortably, so the lower end governs'],
  ['床鋪的長度', 'bed length', '第 95 百分位', 'the 95th percentile', '須容納最高的使用者，故取上限', 'the tallest users must fit, so the upper end governs'],
  ['扶手的直徑', 'handrail diameter', '第 5 百分位', 'the 5th percentile', '須讓手掌最小的使用者握得穩，故取下限', 'users with the smallest hands must grip securely, so the lower end governs'],
] as Array<[string, string, string, string, string, string]>) {
  const [zh, en, pct, pctEn, why, whyEn] = dim
  for (const v of ['取值', '理由']) {
    if (v === '取值') {
      b.add(`datb_er1_${en.slice(0, 8)}_a`, T.ergo, FW.logic, 'medium',
        [`設計${zh}時，應以人體測量數據的哪一個百分位為依據？`,
         `Which anthropometric percentile should govern the design of ${en}?`],
        [[pct, pctEn], [pct === '第 95 百分位' ? '第 5 百分位' : '第 95 百分位', pct === '第 95 百分位' ? 'the 5th percentile' : 'the 95th percentile'],
         ['第 50 百分位（平均值）', 'the 50th percentile, the average'],
         ['不需參考百分位，按設計師自身尺寸即可', 'no percentile is needed; the designer\'s own dimensions suffice']],
        [`應取${pct}，因為${why}。人體工學的通則是：涉及【可及性】的尺寸取低百分位（遷就最小的使用者），涉及【容納】的尺寸取高百分位（遷就最大的使用者）。取平均值是最常見的錯誤——按平均身高設計的門，會讓將近一半人撞頭。`,
         `Use ${pctEn}, because ${whyEn}. The general rule in ergonomics is that dimensions governing REACH take a low percentile, accommodating the smallest user, while dimensions governing CLEARANCE take a high percentile, accommodating the largest. Designing to the average is the commonest error: a door built to average height would strike almost half of all users.`])
    } else {
      b.add(`datb_er1_${en.slice(0, 8)}_b`, T.ergo, FW.apply, 'hard',
        [`設計${zh}時取${pct}，理由為何？`, `Why is ${pctEn} used for ${en}?`],
        [[why, whyEn],
         ['因為該百分位最接近人口的平均值', 'because that percentile is closest to the population average'],
         ['因為該百分位的數據最容易取得', 'because data for that percentile are the easiest to obtain'],
         ['因為國際標準規定所有尺寸均用該百分位', 'because international standards require this percentile for every dimension']],
        [`理由是：${why}。要留意百分位的選取【因尺寸而異】，同一件家具的不同部分可能取不同百分位——例如椅子的座高取低百分位（讓矮者雙腳著地），椅背闊度則取高百分位（讓寬者坐得下）。把整件產品套用同一個百分位，是設計上常見的過度簡化。`,
         `The reason is that ${whyEn}. Percentile choice VARIES BY DIMENSION, and different parts of one piece of furniture may take different percentiles: a chair's seat height uses a low percentile so short users can reach the floor, while its backrest width uses a high one so broad users fit. Applying a single percentile across a whole product is a common oversimplification.`])
    }
  }
}

// ── 可持續設計（目標約 30 條）──────────────────────────────────────────────

// SU1 — 回收率計算
for (const total of [400, 600, 800, 1200, 1500, 2000]) {
  for (const pct of [15, 25, 40, 60, 75]) {
    const recycled = (total * pct) / 100
    if (!Number.isInteger(recycled)) continue
    const d = distract(recycled, [total - recycled, total / pct, pct * 10])
    if (d.length < 3) continue
    b.add(`datb_su1_${total}_${pct}`, T.sustain, FW.apply, pct <= 25 ? 'easy' : pct >= 60 ? 'hard' : 'medium',
      [`某工廠每月產生 ${total} 公斤廢料，其中 ${pct}% 可回收。每月可回收的廢料是多少公斤？`,
       `A factory generates ${total} kg of waste a month, of which ${pct}% is recyclable. How many kilograms can be recycled?`],
      [qty(recycled, '公斤', 'kg'), ...d.map((v) => qty(round(v, 1), '公斤', 'kg'))],
      [`可回收量 = $${total} \\times ${pct}\\% = ${recycled}$ 公斤，其餘 ${total - recycled} 公斤仍須處置。要留意可持續設計的優先次序是【減量、重用、回收】，三者並非平等：回收本身需要能源與運輸，故排在最後。設計階段減少材料用量或令產品可維修，比事後提高回收率有效得多。`,
       `Recyclable mass = $${total} \\times ${pct}\\% = ${recycled}$ kg, leaving ${total - recycled} kg still to be disposed of. Note that the hierarchy in sustainable design is REDUCE, REUSE, RECYCLE, and the three are not equal: recycling itself consumes energy and transport, which is why it ranks last. Cutting material use or making a product repairable at the design stage achieves far more than raising the recycling rate afterwards.`])
  }
}

// ── 設計元素與原則（目標約 24 條）──────────────────────────────────────────

const principles: Array<[string, string, string, string]> = [
  ['對比', 'contrast', '透過差異令重點突出，例如深淺、大小或粗細的並置', 'making an element stand out through difference, such as juxtaposing light and dark, large and small'],
  ['平衡', 'balance', '視覺重量在畫面中的分佈，可為對稱或不對稱', 'the distribution of visual weight across a composition, symmetrical or otherwise'],
  ['比例', 'proportion', '各部分之間及與整體之間的尺寸關係', 'the size relationships between parts and between each part and the whole'],
  ['韻律', 'rhythm', '元素有規律地重複而產生的視覺節奏', 'a visual beat created by the regular repetition of elements'],
  ['統一', 'unity', '各元素互相配合，令整體讀成一件作品而非零件的集合', 'elements working together so the whole reads as one work rather than a collection of parts'],
  ['強調', 'emphasis', '刻意令某一元素成為視線首先落到的位置', 'deliberately making one element the first thing the eye reaches'],
  ['留白', 'white space', '刻意不放置元素的區域，用以分隔與呼吸', 'areas deliberately left empty, to separate elements and give the eye rest'],
  ['層級', 'hierarchy', '以大小、位置或顏色標示資訊的輕重次序', 'signalling the relative importance of information through size, position or colour'],
]
for (const [zh, en, def, defEn] of principles) {
  const others = principles.filter((p) => p[0] !== zh).slice(0, 3)
  b.add(`datb_de1_${en}_u`, T.elements, FW.apply, 'medium',
    [`一張海報的資訊全部同一大小、平均鋪滿版面，觀者不知從何看起。運用「${zh}」可以如何改善？`,
     `Every element on a poster is the same size and evenly spread, so the viewer does not know where to begin. How does ${en} help?`],
    [[def, defEn], ...others.map((p) => [p[2], p[3]] as [string, string])],
    [`「${zh}」在此的作用即為${def}。版面失效的成因通常不是元素太少，而是【每一項都同樣重要，於是沒有一項重要】。改善的方向並非加東西，而是刻意製造差異：放大最重要的一項、把次要的縮小或推後，視線自然有了落腳點。`,
     `Here ${en} works by ${defEn}. A layout usually fails not because it has too few elements but because EVERYTHING CLAIMS EQUAL IMPORTANCE, so nothing has any. The remedy is not to add but to create difference deliberately: enlarge what matters most and reduce or recede the rest, and the eye finds its footing.`])
  b.add(`datb_de1_${en}`, T.elements, FW.logic, 'easy',
    [`設計原則中的「${zh}」指甚麼？`, `In design principles, what does ${en} mean?`],
    [[def, defEn], ...others.map((p) => [p[2], p[3]] as [string, string])],
    [`「${zh}」指${def}。設計原則並非評分的清單，而是【分析工具】：面對一件作品，應問它用了哪些原則、達到甚麼效果，而非逐項檢查有否齊全。過度追求每一項原則，反而會令設計失去重點——例如處處對比，等於沒有對比。`,
     `${en.charAt(0).toUpperCase() + en.slice(1)} means ${defEn}. Design principles are not a checklist for marking but ANALYTICAL TOOLS: faced with a work, ask which principles it uses and to what effect, rather than checking each off. Pursuing every principle at once robs a design of focus — contrast everywhere is the same as no contrast at all.`])
}

// ── 材料與特性（目標約 24 條）──────────────────────────────────────────────

const props: Array<[string, string, string, string]> = [
  ['延展性', 'ductility', '能被拉長成線而不斷裂的性質', 'the ability to be drawn into a wire without breaking'],
  ['韌性', 'toughness', '吸收能量而不斷裂的能力，與脆性相對', 'the ability to absorb energy without fracturing, the opposite of brittleness'],
  ['硬度', 'hardness', '抵抗刮擦與壓痕的能力', 'resistance to scratching and indentation'],
  ['彈性', 'elasticity', '受力變形後能回復原狀的性質', 'the ability to return to the original shape after deformation'],
  ['耐蝕性', 'corrosion resistance', '抵抗化學侵蝕而不劣化的能力', 'the ability to resist chemical attack without degrading'],
]
for (const [zh, en, def, defEn] of props) {
  for (const v of ['定義', '選材']) {
    const others = props.filter((p) => p[0] !== zh).slice(0, 3)
    if (v === '定義') {
      b.add(`datb_ma1_${en.slice(0, 8)}_d`, T.materials, FW.logic, 'easy',
        [`材料特性中的「${zh}」指甚麼？`, `What does ${en} mean as a material property?`],
        [[def, defEn], ...others.map((p) => [p[2], p[3]] as [string, string])],
        [`「${zh}」指${def}。要分清幾組容易混淆的特性：硬度高不等於韌性高——玻璃硬而脆，橡膠軟而韌；強度是抵抗破壞所需的應力，剛度則是抵抗變形的程度，兩者亦不相同。選材時須先問產品實際承受甚麼負荷，再對應所需特性。`,
         `${en.charAt(0).toUpperCase() + en.slice(1)} is ${defEn}. Several properties are easily confused: hardness is not toughness — glass is hard and brittle, rubber soft and tough; strength is the stress needed to cause failure, while stiffness is resistance to deformation, and the two are distinct. Selection begins by asking what loads the product actually carries, then matching the property required.`])
    } else {
      b.add(`datb_ma1_${en.slice(0, 8)}_s`, T.materials, FW.apply, 'medium',
        [`某產品的設計要求為「${def}」。這對應哪一項材料特性？`,
         `A product requires ${defEn}. Which material property does this correspond to?`],
        [[zh, en], ...others.map((p) => [p[0], p[1]] as [string, string])],
        [`所述要求對應${zh}。選材的方法是【由使用情境反推特性】：問產品會遇到甚麼——反覆受力、撞擊、刮擦、潮濕，抑或高溫——每一種情境對應一項或幾項關鍵特性。先寫出情境清單，再逐項對應，比背誦材料表可靠得多。`,
         `The requirement corresponds to ${en}. Material selection works by REASONING FROM THE SERVICE CONDITIONS: ask what the product will meet — repeated loading, impact, abrasion, moisture, heat — and each condition points to one or two key properties. Listing the conditions first and matching them one by one is far more reliable than memorising tables of materials.`])
    }
  }
}

// ── 材料與結構・推理（目標約 30 條）────────────────────────────────────────

// MR1 — 結構形狀與剛度
for (const [shape, en, why, whyEn] of [
  ['三角形', 'a triangle', '三邊確定之後形狀唯一，不需額外約束即穩定', 'once its three sides are fixed the shape is unique, so it is stable without further bracing'],
  ['矩形', 'a rectangle', '四邊確定之後仍可平行四邊形化，須加斜撐才穩定', 'with four sides fixed it can still shear into a parallelogram, so it needs a diagonal brace'],
  ['工字形截面', 'an I-section', '材料集中於離中性軸最遠處，同重量下抗彎剛度最高', 'material sits farthest from the neutral axis, giving the greatest bending stiffness for its mass'],
  ['圓管截面', 'a tube', '材料分佈於外圍，同重量下抗扭與抗彎均佳', 'material is distributed around the perimeter, resisting both torsion and bending well for its mass'],
] as Array<[string, string, string, string]>) {
  for (const size of [1, 2, 3]) {
    b.add(`datb_mr1_${en.slice(2, 10)}_${size}`, T.reason, FW.logic, size === 1 ? 'medium' : 'hard',
      [`就結構穩定性而言，${shape}有何特點？（情境 ${size}：構件承受${size === 1 ? '靜態垂直' : size === 2 ? '側向風' : '反覆振動'}負載）`,
       `What is characteristic of ${en} in structural terms, where the member carries ${size === 1 ? 'a static vertical' : size === 2 ? 'a lateral wind' : 'a repeated vibrating'} load?`],
      [[why, whyEn],
       ['形狀與剛度無關，只有材料本身決定結構強度', 'shape has no bearing on stiffness; only the material determines strength'],
       ['截面愈實心愈好，中空必然削弱結構', 'the more solid the section the better; hollowing always weakens a structure'],
       ['所有幾何形狀在受力下的表現完全相同', 'all geometric forms behave identically under load']],
      [`${shape}的特點是：${why}。本課題的核心觀念是【形狀與材料同等重要】：同一重量的材料，佈置方式不同，抗彎剛度可以相差數倍。工字樑與圓管之所以廣泛採用，正是因為它們把材料放到最有效的位置，而非因為用了更好的材料。${size === 3 ? '在反覆負載之下，還須另外考慮疲勞——應力集中處（尖角、孔洞）會成為裂紋起點，故轉角應以圓角過渡。' : ''}`,
       `${en.charAt(0).toUpperCase() + en.slice(1)} is characterised in that ${whyEn}. The central idea is that SHAPE MATTERS AS MUCH AS MATERIAL: for the same mass, different arrangements can differ several-fold in bending stiffness. I-beams and tubes are used widely because they place material where it works hardest, not because they are made of better material.${size === 3 ? ' Under repeated loading, fatigue must also be considered: stress concentrations at sharp corners and holes become crack initiation sites, so corners should be filleted.' : ''}`])
  }
}

// ── 設計過程（目標約 24 條）────────────────────────────────────────────────

const stages: Array<[string, string, number, string, string]> = [
  ['確認需要', 'identifying the need', 1, '界定問題與使用者，避免解決了錯的問題', 'defining the problem and the user, so as not to solve the wrong problem'],
  ['資料搜集', 'research', 2, '了解現有方案、使用情境與限制條件', 'examining existing solutions, contexts of use and constraints'],
  ['構思方案', 'generating ideas', 3, '產生多個方案而非過早收窄至單一構想', 'producing several options rather than narrowing prematurely to one'],
  ['製作原型', 'prototyping', 4, '把構想化為可測試的實體，令問題及早暴露', 'turning an idea into something testable so problems surface early'],
  ['測試評估', 'testing and evaluation', 5, '以使用者實際試用的結果修正設計', 'revising the design from what real users actually do with it'],
]
for (const [zh, en, order, why, whyEn] of stages) {
  const others = stages.filter((s) => s[0] !== zh).slice(0, 3)
  b.add(`datb_dp1_${en.slice(0, 8)}_o`, T.process, FW.apply, 'hard',
    [`若略過設計過程中的「${zh}」階段而直接進入下一步，最可能出現甚麼後果？`,
     `What is the likely consequence of skipping the ${en} stage and moving straight on?`],
    [[`失去${why}這一步所提供的把關，問題會延後到成本更高的階段才浮現`,
      `the check that ${whyEn} is lost, and problems surface later when they cost more to fix`],
     ['沒有後果，設計過程各階段本來就可以任意略過', 'no consequence: the stages may be skipped freely'],
     ['產品必然無法製造出來', 'the product becomes impossible to manufacture'],
     ['只會影響外觀，不影響功能', 'only appearance is affected, never function']],
    [`略過「${zh}」的代價是失去${why}這一步的把關。設計過程各階段的價值在於【及早發現問題】：同一個錯誤，在構思階段修改只需重畫，在原型階段需重做，在量產之後則要回收。愈遲發現，代價愈以數量級上升——這正是各階段不可任意略過的原因。`,
     `Skipping ${en} forfeits the check by which ${whyEn}. The value of the stages lies in FINDING PROBLEMS EARLY: the same error costs a redrawing at the ideas stage, a rebuild at the prototype stage, and a recall after mass production. The later it is found, the more the cost rises by orders of magnitude — which is why the stages cannot be skipped at will.`])
  b.add(`datb_dp1_${en.slice(0, 8)}`, T.process, FW.logic, 'medium',
    [`設計過程中的「${zh}」階段，其主要目的為何？`, `What is the main purpose of the ${en} stage of the design process?`],
    [[why, whyEn], ...others.map((s) => [s[3], s[4]] as [string, string])],
    [`「${zh}」的目的是${why}。要留意設計過程並非單向的直線：測試結果往往令人回到構思甚至重新界定需要，故各階段之間有回饋迴路。把它畫成直線流程圖只是為了說明，實際工作中反覆來回才是常態——愈早發現方向錯誤，修正的代價愈小。`,
     `The purpose of ${en} is ${whyEn}. Note that the design process is not a one-way line: testing frequently sends the designer back to generating ideas, or even to redefining the need, so feedback loops run between the stages. Drawing it as a linear flowchart is a teaching simplification; in practice iteration is the norm — and the earlier a wrong direction is found, the cheaper it is to correct.`])
}

export const designTechBank3Questions: Question[] = b.bank
