import type { Question } from './types'
import { createBank, qty, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// geography-bank3.ts —— 地理參數化母模板・第三批（2026-09-03）
// ---------------------------------------------------------------------------
// 承接 geography-bank.ts。地理現為 585 條、分佈 22–111（5.0 倍）。
// 本檔【只】為每課題目標 100 之下的七個課題出題，
// 已達標的 rivers_coasts(111) 一條不加，接近達標的 weather_climate(87)
// 與 urban(83) 只作小幅補足。
//
// 地理的可計算部分比一般想像多：氣溫遞減率、河流流量、人口密度與增長、
// 侵蝕與堆積速率、碳排放與減排目標、糧食自給率、震級能量比 ——
// 全部由數字算出，毋須人手審批。
//
// ⚠️ 誘答必須互不相同【且在數學上不恆等】。同日 ICT DC2 與生物 GE2 兩役：
// 誘答字面不同而代數上恆等，去重後只剩兩個，整組靜默丟棄而審視源碼
// 不會發現。本檔每個模板寫完即以實測產出數字核對，並把三個誘答代入
// 邊界值逐一比對。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  chain: { id: 'geo_process_chain', zh: '地理過程・因果鏈', en: 'Geographical processes — causal chains' },
  rain: { id: 'rainforest', zh: '熱帶雨林', en: 'Tropical Rainforest' },
  industry: { id: 'industry', zh: '工業區位', en: 'Industrial Location' },
  food: { id: 'food', zh: '糧食與飢荒', en: 'Food & Famine' },
  plate: { id: 'plate_hazards', zh: '板塊與自然災害', en: 'Plates & Hazards' },
  climate: { id: 'climate_change', zh: '氣候變化與環境管理', en: 'Climate Change' },
  data: { id: 'geo_data_manage', zh: '數據與環境管理', en: 'Data & environmental management' },
  urban: { id: 'urban', zh: '城市發展', en: 'Urban Development' },
  weather: { id: 'weather_climate', zh: '天氣與氣候', en: 'Weather & Climate' },
} satisfies Record<string, TopicMeta>

const FW = {
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
} satisfies Record<string, FwMeta>

const b = createBank('geography')

const distract = (correct: number, cands: number[]): number[] =>
  cands.filter((v, i, a) => v !== correct && a.indexOf(v) === i).slice(0, 3)

// ── 地理過程・因果鏈 ──────────────────────────────────────────────────────

// GP1 — 氣溫遞減率：每上升 100 米降溫 0.6°C
for (const base of [18, 20, 22, 24, 26, 28, 30]) {
  for (const rise of [500, 1000, 1500, 2000, 2500, 3000]) {
    const drop = (rise / 100) * 0.6
    const top = Math.round((base - drop) * 10) / 10
    const d = distract(top, [base + drop, base, Math.round((base - drop / 2) * 10) / 10])
    if (d.length < 3) continue
    b.add(`geob3_gp1_${base}_${rise}`, T.chain, FW.apply, 'easy',
      [`山腳的氣溫為 ${base}°C。若氣溫遞減率為每上升 100 米下降 0.6°C，海拔高 ${rise} 米處的氣溫約為多少°C？`,
       `The temperature at the foot of a mountain is ${base}°C. With a lapse rate of 0.6°C per 100 m, what is the approximate temperature ${rise} m higher?`],
      [qty(top, '°C', '°C'), ...d.map((v) => qty(v, '°C', '°C'))],
      [`上升 ${rise} 米即 $${rise} \\div 100 = ${rise / 100}$ 個 100 米，共降溫 $${rise / 100} \\times 0.6 = ${drop}$°C，故山上約 $${base} - ${drop} = ${top}$°C。答 $${base + drop}$ 把方向弄反 —— 高處氣溫較低，是因為空氣上升時膨脹而失去能量，並非因為離太陽較近。這個直覺上的顛倒是本題設問的用意。`,
       `Rising ${rise} m is $${rise} \\div 100 = ${rise / 100}$ intervals of 100 m, a fall of $${rise / 100} \\times 0.6 = ${drop}$°C, giving $${base} - ${drop} = ${top}$°C. Answering $${base + drop}$ reverses the direction — higher air is colder because rising air expands and loses energy, not because it is nearer the sun. That counter-intuition is what this question tests.`])
  }
}

// GP2 — 河流流量 = 橫切面面積 × 流速
for (const width of [4, 5, 6, 8, 10, 12, 15, 16, 18, 20, 25, 30]) {
  for (const depth of [1, 2, 3, 4, 5]) {
    for (const speed of [1, 2]) {
      const q = width * depth * speed
      const d = distract(q, [width * depth, width + depth + speed, width * speed])
      if (d.length < 3) continue
      b.add(`geob3_gp2_${width}_${depth}_${speed}`, T.chain, FW.apply, 'medium',
        [`一條河流寬 ${width} 米、平均深 ${depth} 米，平均流速為每秒 ${speed} 米。其流量為每秒多少立方米？`,
         `A river is ${width} m wide with a mean depth of ${depth} m and a mean velocity of ${speed} m per second. What is its discharge, in cubic metres per second?`],
        [qty(q, '立方米', 'm³'), ...d.map((v) => qty(v, '立方米', 'm³'))],
        [`流量 = 橫切面面積 × 流速 = $(${width} \\times ${depth}) \\times ${speed} = ${q}$ 立方米／秒。三個因素缺一不可：答 $${width * depth}$ 只算了面積，那是靜止的水體斷面，未回答「每秒流過多少」。暴雨後流量急升，正是因為水深與流速【同時】上升，兩者相乘的效果遠大於任何一者單獨變化。`,
         `Discharge = cross-sectional area × velocity = $(${width} \\times ${depth}) \\times ${speed} = ${q}$ m³ per second. All three factors are needed: answering $${width * depth}$ gives only the area, a static cross-section that says nothing about how much passes per second. Discharge surges after heavy rain because depth and velocity rise TOGETHER, and their product grows far faster than either alone.`])
    }
  }
}

// ── 熱帶雨林 ──────────────────────────────────────────────────────────────

// RF1 — 森林流失面積 = 年流失率 × 年數
for (const area of [2000, 5000, 8000, 10000, 20000, 50000]) {
  for (const rate of [1, 2, 3, 5]) {
    for (const years of [5, 10]) {
      const lost = (area * rate * years) / 100
      if (!Number.isInteger(lost)) continue
      const d = distract(lost, [(area * rate) / 100, area - lost, area * years])
      if (d.length < 3) continue
      b.add(`geob3_rf1_${area}_${rate}_${years}`, T.rain, FW.apply, 'medium',
        [`某熱帶雨林原有面積 ${area} 平方公里，每年流失原有面積的 ${rate}%。${years} 年後合共流失多少平方公里？（按原有面積計算）`,
         `A tropical rainforest originally covers ${area} km² and loses ${rate}% of its original area each year. How many km² are lost in total after ${years} years? (Calculate on the original area.)`],
        [qty(lost, '平方公里', 'km²'), ...d.map((v) => qty(v, '平方公里', 'km²'))],
        [`每年流失 $${area} \\times ${rate}\\% = ${(area * rate) / 100}$ 平方公里，${years} 年共 $${(area * rate) / 100} \\times ${years} = ${lost}$ 平方公里。答 $${area - lost}$ 是【剩餘】面積而非流失面積 —— 題目問的是流失量，兩者互補。留意實際情況中流失率多以【當年剩餘面積】計算，那會是複利式遞減，本題已明言按原有面積，屬簡化模型。`,
         `Annual loss is $${area} \\times ${rate}\\% = ${(area * rate) / 100}$ km², so ${years} years give $${(area * rate) / 100} \\times ${years} = ${lost}$ km². Answering $${area - lost}$ gives the REMAINING area rather than the loss — the question asks for the loss and the two are complements. In reality rates are usually applied to the area still standing, which compounds; this question states the original-area basis and is a simplified model.`])
    }
  }
}

// RF2 — 生物多樣性：樣方推算物種總數
for (const plot of [20, 25, 40, 50, 80]) {
  for (const total of [2000, 4000, 5000, 10000]) {
    const factor = total / plot
    if (!Number.isInteger(factor)) continue
    const species = 30 * factor
    if (species > 100000) continue
    const d = distract(species, [30 * plot, 30 + factor, factor])
    if (d.length < 3) continue
    b.add(`geob3_rf2_${plot}_${total}`, T.rain, FW.logic, 'hard',
      [`研究人員在雨林中取 ${plot} 公頃樣方，錄得 30 種喬木。若整片林區共 ${total} 公頃，按同一密度【線性】推算的喬木種數為多少？`,
       `Researchers survey a ${plot}-hectare plot of rainforest and record 30 tree species. Scaling linearly at the same density, how many species would a ${total}-hectare forest hold?`],
      [qty(species, '種', ''), ...d.map((v) => qty(v, '種', ''))],
      [`放大倍數 = $${total} \\div ${plot} = ${factor}$，線性推算得 $30 \\times ${factor} = ${species}$ 種。⚠️ 這個數字【幾乎肯定過高】：物種數與面積的實際關係接近 $S = cA^z$（$z$ 約 0.2–0.3），面積擴大十倍物種數只增加約一倍。本題要考的正是「線性外推」這個常見謬誤 —— 懂得算，更要懂得它為何不可信。`,
       `The scaling factor is $${total} \\div ${plot} = ${factor}$, so linear extrapolation gives $30 \\times ${factor} = ${species}$ species. NOTE this figure is almost certainly far too high: the real species–area relationship is close to $S = cA^z$ with $z$ around 0.2–0.3, so a tenfold area holds roughly twice the species. The point of this question is the linear-extrapolation fallacy itself — being able to compute it matters less than knowing why it cannot be trusted.`])
  }
}

// ── 工業區位 ──────────────────────────────────────────────────────────────

// IN1 — 原料指數 = 原料重量 ÷ 製成品重量
for (const raw of [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20]) {
  for (const product of [1, 2]) {
    const idx = raw / product
    if (!Number.isInteger(idx)) continue
    const d = distract(idx, [product / raw, raw + product, raw - product])
    if (d.length < 3) continue
    b.add(`geob3_in1_${raw}_${product}`, T.industry, FW.logic, 'medium',
      [`某工業每生產 ${product} 噸製成品需消耗 ${raw} 噸原料。其原料指數為多少？`,
       `An industry consumes ${raw} tonnes of raw material to make ${product} tonne(s) of product. What is its material index?`],
      [qty(idx, '', ''), ...d.map((v) => qty(v, '', ''))],
      [`原料指數 = 原料重量 ÷ 製成品重量 = $${raw} \\div ${product} = ${idx}$。指數大於 1 表示生產過程中【減重】，運原料比運製成品貴，故工廠傾向設於【原料產地】附近（例如煉鋼、製糖）。指數等於或小於 1 則傾向設於市場附近（例如飲料裝瓶）。這個比值本身不是重點，它指向哪一邊才是。`,
       `Material index = raw material weight ÷ product weight = $${raw} \\div ${product} = ${idx}$. An index above 1 means the process LOSES weight, making raw material dearer to move than product, so the plant tends to locate near the RAW MATERIAL (steel, sugar refining). An index of 1 or below pulls it towards the market (drinks bottling). The ratio itself is not the point; which way it points is.`])
  }
}

// ── 糧食與飢荒 ────────────────────────────────────────────────────────────

// FD1 — 糧食自給率 = 本地生產 ÷ 總消耗
for (const produce of [20, 25, 30, 35, 40, 45, 50, 60, 75, 80, 90, 100, 120, 150, 180]) {
  for (const consume of [100, 150, 200, 300]) {
    const pct = Math.round((produce / consume) * 1000) / 10
    if (!Number.isInteger(pct * 10)) continue
    const d = distract(pct, [Math.round((consume / produce) * 1000) / 10, produce, 100 - pct])
    if (d.length < 3) continue
    b.add(`geob3_fd1_${produce}_${consume}`, T.food, FW.apply, 'medium',
      [`某地區每年本地生產糧食 ${produce} 萬噸，總消耗 ${consume} 萬噸。其糧食自給率為多少百分比？`,
       `A region produces ${produce} × 10⁴ tonnes of food a year and consumes ${consume} × 10⁴ tonnes. What is its food self-sufficiency ratio, as a percentage?`],
      [qty(pct, '%', '%'), ...d.map((v) => qty(v, '%', '%'))],
      [`自給率 = 本地生產 ÷ 總消耗 × 100% = $${produce} \\div ${consume} \\times 100\\% = ${pct}\\%$。餘下的 ${Math.round((100 - pct) * 10) / 10}% 須靠進口填補 —— 自給率低不等於必然捱餓，只代表【對外依賴】高，一旦供應鏈中斷或糧價急升，衝擊會直接傳入。答 $${100 - pct}$ 是進口依賴度，兩者互補而非同一件事。`,
       `Self-sufficiency = local production ÷ total consumption × 100% = $${produce} \\div ${consume} \\times 100\\% = ${pct}\\%$. The remaining ${Math.round((100 - pct) * 10) / 10}% must be imported — a low ratio does not by itself mean hunger, it means high EXTERNAL DEPENDENCE, so a broken supply chain or a price spike transmits straight through. Answering $${100 - pct}$ gives import dependence, the complement rather than the same thing.`])
  }
}

// ── 板塊與自然災害 ────────────────────────────────────────────────────────

// PL1 — 板塊移動：位移 = 速率 × 年數
for (const rate of [2, 4, 5, 6, 8, 10]) {
  for (const years of [100, 500, 1000, 10000]) {
    const cm = rate * years
    const m = cm / 100
    const d = distract(m, [cm, rate * years * 10, rate + years])
    if (d.length < 3) continue
    b.add(`geob3_pl1_${rate}_${years}`, T.plate, FW.apply, 'easy',
      [`兩個板塊以每年 ${rate} 厘米的速率互相分離。${years} 年後兩者相距增加多少米？`,
       `Two plates diverge at ${rate} cm per year. By how many metres does the gap widen after ${years} years?`],
      [qty(m, '米', 'm'), ...d.map((v) => qty(v, '米', 'm'))],
      [`位移 = $${rate} \\times ${years} = ${cm}$ 厘米 = ${m} 米。答 $${cm}$ 是漏了換算單位。板塊每年只移動幾厘米，與指甲生長速度相若，但地質時間尺度以百萬年計 —— 一億年就是數千公里，足以把一塊大陸推到地球另一邊。慢，不等於影響小。`,
       `Displacement = $${rate} \\times ${years} = ${cm}$ cm = ${m} m. Answering $${cm}$ leaves the units unconverted. Plates move a few centimetres a year, about as fast as fingernails grow, but geological time runs in millions of years — a hundred million years is thousands of kilometres, enough to carry a continent to the far side of the planet. Slow does not mean small.`])
  }
}

// ── 氣候變化與環境管理 ────────────────────────────────────────────────────

// CC1 — 減排目標：目標排放量 = 基準 × (1 − 減幅)
for (const base of [200, 250, 300, 350, 400, 500, 600, 700, 800, 1000]) {
  for (const cut of [10, 20, 25, 30, 40, 50]) {
    const target = (base * (100 - cut)) / 100
    if (!Number.isInteger(target)) continue
    const d = distract(target, [(base * cut) / 100, base - cut, base + target])
    if (d.length < 3) continue
    b.add(`geob3_cc1_${base}_${cut}`, T.climate, FW.apply, 'easy',
      [`某城市的基準年碳排放量為 ${base} 萬噸，承諾在目標年減排 ${cut}%。目標年的排放量應為多少萬噸？`,
       `A city emits ${base} × 10⁴ tonnes of carbon in its baseline year and pledges a ${cut}% cut by the target year. What should its target-year emissions be, in 10⁴ tonnes?`],
      [qty(target, '萬噸', '× 10⁴ t'), ...d.map((v) => qty(v, '萬噸', '× 10⁴ t'))],
      [`減排 ${cut}% 即保留 $100\\% - ${cut}\\% = ${100 - cut}\\%$，故目標為 $${base} \\times ${100 - cut}\\% = ${target}$ 萬噸。答 $${(base * cut) / 100}$ 是【減少的量】而非【剩餘的量】—— 兩者只在減排 50% 時相等，正是這個特例令兩個概念容易混淆。承諾書寫「減排 X%」時，指的一律是前者。`,
       `A ${cut}% cut means retaining $100\\% - ${cut}\\% = ${100 - cut}\\%$, so the target is $${base} \\times ${100 - cut}\\% = ${target}$ × 10⁴ t. Answering $${(base * cut) / 100}$ gives the AMOUNT REDUCED rather than the amount remaining — the two coincide only at a 50% cut, and that special case is why they get confused. A pledge worded "cut by X%" always means the former.`])
  }
}

// ── 數據與環境管理 ────────────────────────────────────────────────────────

// DM1 — 人口密度 = 人口 ÷ 面積
for (const pop of [12000, 24000, 36000, 48000, 60000, 90000, 120000]) {
  for (const area of [3, 4, 6, 8, 12]) {
    const density = pop / area
    if (!Number.isInteger(density)) continue
    const d = distract(density, [area / pop, pop * area, pop - area])
    if (d.length < 3) continue
    b.add(`geob3_dm1_${pop}_${area}`, T.data, FW.apply, 'easy',
      [`某區域人口 ${pop} 人，面積 ${area} 平方公里。其人口密度為每平方公里多少人？`,
       `A district has a population of ${pop} in an area of ${area} km². What is its population density, in persons per km²?`],
      [qty(density, '人', 'persons'), ...d.map((v) => qty(v, '人', 'persons'))],
      [`人口密度 = 人口 ÷ 面積 = $${pop} \\div ${area} = ${density}$ 人／平方公里。留意密度是【平均值】，會掩蓋內部差異：同一個區可以一半是高密度住宅、一半是郊野公園，平均數兩邊都不像。分析時要問的下一條問題永遠是：這個平均之下，實際分佈是怎樣？`,
       `Population density = population ÷ area = $${pop} \\div ${area} = ${density}$ persons per km². Note density is an AVERAGE and hides internal variation: a district can be half dense housing and half country park, and the mean resembles neither. The next question in any analysis is always what the distribution behind the average actually looks like.`])
  }
}

// IN2 — 運輸總成本 = 原料運費 + 製成品運費
for (const rawKm of [20, 60, 100, 150]) {
  for (const mktKm of [30, 70, 120]) {
    for (const rawRate of [3, 5]) {
      const cost = rawKm * rawRate + mktKm * 2
      const d = distract(cost, [rawKm * rawRate, mktKm * 2, (rawKm + mktKm) * rawRate])
      if (d.length < 3) continue
      b.add(`geob3_in2_${rawKm}_${mktKm}_${rawRate}`, T.industry, FW.apply, 'hard',
        [`某工廠距原料產地 ${rawKm} 公里、距市場 ${mktKm} 公里。運送原料每公里 ${rawRate} 元，運送製成品每公里 2 元。總運輸成本為多少元？`,
         `A factory lies ${rawKm} km from its raw material source and ${mktKm} km from its market. Moving raw material costs $${rawRate} per km and moving product costs $2 per km. What is the total transport cost?`],
        [qty(cost, '元', 'dollars'), ...d.map((v) => qty(v, '元', 'dollars'))],
        [`總成本 = 原料運費 + 製成品運費 = $${rawKm} \\times ${rawRate} + ${mktKm} \\times 2 = ${rawKm * rawRate} + ${mktKm * 2} = ${cost}$ 元。原料每公里 ${rawRate} 元而製成品只需 2 元，代表原料較貴運 —— 廠址若能向原料產地移近，節省的會多於在市場端增加的。韋伯區位論的整套推導，起點就是比較這兩個單位成本。`,
         `Total = raw-material haulage + product haulage = $${rawKm} \\times ${rawRate} + ${mktKm} \\times 2 = ${rawKm * rawRate} + ${mktKm * 2} = ${cost}$. At $${rawRate} per km against $2, the raw material is dearer to move — so shifting the plant towards the source saves more than it adds at the market end. The whole of Weber's location theory starts from comparing these two unit costs.`])
    }
  }
}

// IN3 — 勞工成本佔總成本的百分比
for (const labour of [30, 50, 80, 120, 150]) {
  for (const other of [70, 150, 250]) {
    const total = labour + other
    const pct = Math.round((labour / total) * 1000) / 10
    const d = distract(pct, [Math.round((other / total) * 1000) / 10, labour, total])
    if (d.length < 3) continue
    b.add(`geob3_in3_${labour}_${other}`, T.industry, FW.logic, 'medium',
      [`某工廠每月勞工成本 ${labour} 萬元，其他成本 ${other} 萬元。勞工成本佔總成本的百分比為多少？`,
       `A factory's monthly labour cost is $${labour} × 10⁴ and its other costs are $${other} × 10⁴. What percentage of total cost is labour?`],
      [qty(pct, '%', '%'), ...d.map((v) => qty(v, '%', '%'))],
      [`總成本 = $${labour} + ${other} = ${total}$ 萬元，勞工佔 $${labour} \\div ${total} \\times 100\\% = ${pct}\\%$。這個比例決定廠商對工資的敏感度：佔比高的產業（成衣、電子裝配）會為低工資而遷廠，佔比低的（石化、鋼鐵）則幾乎不受工資影響，因為搬遷省下的遠少於運輸與設備成本。`,
       `Total cost = $${labour} + ${other} = ${total}$ × 10⁴, so labour is $${labour} \\div ${total} \\times 100\\% = ${pct}\\%$. That share governs how sensitive a firm is to wages: labour-intensive industries such as garments and electronics assembly relocate chasing low wages, while petrochemicals and steel barely respond, because relocation saves far less than it costs in transport and plant.`])
  }
}

// FD2 — 糧食總產量 = 單位面積產量 × 耕地面積
for (const yieldT of [2, 3, 5, 6, 8]) {
  for (const hectare of [500, 1200, 2000, 3000, 5000]) {
    const total = yieldT * hectare
    const d = distract(total, [yieldT + hectare, hectare / yieldT, yieldT * hectare * 2])
    if (d.length < 3) continue
    b.add(`geob3_fd2_${yieldT}_${hectare}`, T.food, FW.apply, 'easy',
      [`某農區的單位面積產量為每公頃 ${yieldT} 噸，耕地面積 ${hectare} 公頃。全區年產量為多少噸？`,
       `A farming region yields ${yieldT} tonnes per hectare over ${hectare} hectares of cropland. What is its annual output, in tonnes?`],
      [qty(total, '噸', 't'), ...d.map((v) => qty(v, '噸', 't'))],
      [`總產量 = 單位面積產量 × 面積 = $${yieldT} \\times ${hectare} = ${total}$ 噸。要增加產量只有兩條路：擴大面積（粗放）或提高單產（集約）。前者受土地限制，且往往以砍伐森林為代價；後者靠品種、灌溉與肥料，是綠色革命的核心。兩條路的環境代價完全不同，而算式本身看不出這一點。`,
       `Output = yield per hectare × area = $${yieldT} \\times ${hectare} = ${total}$ tonnes. Raising output allows only two routes: more land (extensive) or higher yield (intensive). The first is bounded by available land and often paid for in felled forest; the second rests on varieties, irrigation and fertiliser, and was the core of the Green Revolution. Their environmental costs differ entirely, and the arithmetic alone does not show it.`])
  }
}

// PL2 — 海嘯到達時間 = 距離 ÷ 波速
for (const km of [200, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500]) {
  for (const speed of [200, 400, 500]) {
    const hours = km / speed
    if (!Number.isInteger(hours * 10)) continue
    const r = Math.round(hours * 100) / 100
    const d = distract(r, [km / (speed / 10), Math.round((speed / km) * 100) / 100, km])
    if (d.length < 3) continue
    b.add(`geob3_pl2_${km}_${speed}`, T.plate, FW.apply, 'medium',
      [`一次海底地震引發海嘯，波速為每小時 ${speed} 公里。距震央 ${km} 公里的海岸約在多少小時後受影響？`,
       `An undersea earthquake generates a tsunami travelling at ${speed} km per hour. About how many hours before it reaches a coast ${km} km from the epicentre?`],
      [qty(r, '小時', 'hours'), ...d.map((v) => qty(v, '小時', 'hours'))],
      [`時間 = 距離 ÷ 波速 = $${km} \\div ${speed} = ${r}$ 小時。這個數字就是預警系統的全部價值所在：地震發生後幾分鐘內即可測定位置，而海嘯要 ${r} 小時才到 —— 中間的時間足以疏散。距離愈近，可用時間愈短，故近岸地震的預警效益最低而風險最高。`,
       `Time = distance ÷ wave speed = $${km} \\div ${speed} = ${r}$ hours. That figure is the entire value of a warning system: the quake is located within minutes while the wave takes ${r} hours to arrive, and the gap is enough to evacuate. The nearer the coast, the shorter the window — which is why near-shore quakes offer the least warning and carry the greatest risk.`])
  }
}

// ── 城市發展 ──────────────────────────────────────────────────────────────

// UR1 — 城市化率 = 城市人口 ÷ 總人口
for (const urbanPop of [45, 75, 120]) {
  for (const total of [150, 250]) {
    if (urbanPop > total) continue
    const pct = Math.round((urbanPop / total) * 1000) / 10
    const d = distract(pct, [Math.round(((total - urbanPop) / total) * 1000) / 10, urbanPop, total - urbanPop])
    if (d.length < 3) continue
    b.add(`geob3_ur1_${urbanPop}_${total}`, T.urban, FW.apply, 'easy',
      [`某國城市人口 ${urbanPop} 百萬，全國總人口 ${total} 百萬。其城市化率為多少百分比？`,
       `A country has an urban population of ${urbanPop} million out of ${total} million. What is its urbanisation rate, as a percentage?`],
      [qty(pct, '%', '%'), ...d.map((v) => qty(v, '%', '%'))],
      [`城市化率 = 城市人口 ÷ 總人口 × 100% = $${urbanPop} \\div ${total} \\times 100\\% = ${pct}\\%$。留意這個比率上升可以來自兩個完全不同的過程：農村人口遷入城市，或者城市邊界重新劃定把原本的鄉郊納入。前者是真實的人口流動，後者只是定義改變 —— 比較不同國家的數字之前，必須先確認兩者的城市定義。`,
       `Urbanisation rate = urban population ÷ total × 100% = $${urbanPop} \\div ${total} \\times 100\\% = ${pct}\\%$. Note the rate can rise through two quite different processes: rural people moving into cities, or city boundaries being redrawn to absorb countryside. The first is real migration, the second only a change of definition — so before comparing countries, check how each defines "urban".`])
  }
}

// UR2 — 人口自然增長率 = 出生率 − 死亡率
for (const birth of [12, 18, 24, 32]) {
  for (const death of [6, 10, 12]) {
    const growth = birth - death
    const d = distract(growth, [birth + death, birth, death])
    if (d.length < 3) continue
    b.add(`geob3_ur2_${birth}_${death}`, T.urban, FW.logic, 'medium',
      [`某城市的粗出生率為每千人 ${birth}，粗死亡率為每千人 ${death}。其人口自然增長率為每千人多少？`,
       `A city has a crude birth rate of ${birth} per thousand and a crude death rate of ${death} per thousand. What is its rate of natural increase, per thousand?`],
      [qty(growth, '', ''), ...d.map((v) => qty(v, '', ''))],
      [`自然增長率 = 出生率 − 死亡率 = $${birth} - ${death} = ${growth}$（每千人）。「自然」二字是關鍵：這條式【不包括遷移】。一個自然增長率為 ${growth} 的城市，若同時有大量人口遷出，總人口仍可以下降 —— 香港正是這種情況的典型，人口變化主要由遷移而非自然增長主導。`,
       `Natural increase = birth rate − death rate = $${birth} - ${death} = ${growth}$ per thousand. The word NATURAL is the key: this expression EXCLUDES migration. A city with natural increase of ${growth} can still shrink if enough people leave — Hong Kong is a textbook case, where population change is driven mainly by migration rather than natural increase.`])
  }
}

// ── 天氣與氣候 ────────────────────────────────────────────────────────────

// WC1 — 年溫差 = 最暖月均溫 − 最冷月均溫
for (const warm of [22, 28, 32, 35]) {
  for (const cold of [-10, 0, 5, 15]) {
    const range = warm - cold
    const d = distract(range, [warm + cold, warm, Math.abs(cold)])
    if (d.length < 3) continue
    b.add(`geob3_wc1_${warm}_${String(cold).replace('-', 'm')}`, T.weather, FW.apply, 'easy',
      [`某地最暖月平均氣溫 ${warm}°C，最冷月平均氣溫 ${cold}°C。其年溫差為多少°C？`,
       `A place has a warmest-month mean of ${warm}°C and a coldest-month mean of ${cold}°C. What is its annual temperature range, in °C?`],
      [qty(range, '°C', '°C'), ...d.map((v) => qty(v, '°C', '°C'))],
      [`年溫差 = 最暖月 − 最冷月 = $${warm} - (${cold}) = ${range}$°C。年溫差是判別氣候類型的核心指標：海洋性氣候溫差小（海水升溫降溫都慢），大陸性氣候溫差大。${range}°C 屬${range >= 30 ? '偏大，指向內陸大陸性' : range <= 15 ? '偏小，指向海洋性或熱帶' : '中等'}。負值相減時務必保留括號，否則會變成相加。`,
       `Annual range = warmest month − coldest month = $${warm} - (${cold}) = ${range}$°C. The range is a core indicator of climate type: maritime climates have small ranges because water heats and cools slowly, continental ones large. ${range}°C is ${range >= 30 ? 'large, pointing to a continental interior' : range <= 15 ? 'small, pointing to maritime or tropical conditions' : 'moderate'}. Keep the brackets when subtracting a negative, or the subtraction becomes an addition.`])
  }
}

export const geographyBank3Questions: Question[] = b.bank
