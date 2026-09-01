import type { Question } from './types'
import { createBank, n, qty, round, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// geography-bank.ts —— 地理科參數化母模板（2026-08-29）
// ---------------------------------------------------------------------------
// 沿用 ict-bank.ts 與 biology-bank.ts 的做法：只擴充原本最薄的課題。
//
// 地理科現況為 10 個課題共 253 條，最厚的 rivers_coasts 已有 60 條，
// 而 geo_process_chain 與 geo_data_manage 各只有 10 條，倍差 6.0×。
// 若只擴充已有參數化基礎的課題，倍差只會惡化，違反目標第三條。
//
// 本檔為各課題找出可由數字直接算出答案的部分：
//   天氣與氣候  氣溫遞減率、相對濕度、年溫差、風寒指數
//   河流與海岸  流量＝流速×截面積、河流梯度、侵蝕與搬運
//   城市發展    人口密度、都市化比率、人口自然增長率
//   工業區位    運輸成本比較、重量減輕比、區位租金
//   糧食與飢荒  單位面積產量、糧食自給率、卡路里供應
//   板塊與災害  地震規模能量比、板塊移動距離、海嘯到達時間
//   熱帶雨林    林地流失率、碳儲量、生物量金字塔
//   氣候變化    海平面上升推算、碳排放人均值、升溫情境
//   地理過程    因果鏈方向判斷（正／反饋）
//   數據與管理  數據判讀與陷阱（基準年、單位、比例尺）
//
// ⚠️ 每個迴圈的輸出量必須先估算後撰寫。企會財一役的教訓：擴闊一個迴圈
// 令單一課題由 88 條跳至 190 條，其後須以四輪反覆收窄。
//
// ⚠️ 題幹不可只靠英文大小寫或 LaTeX 內容區分：validate-banks 的 normStem
// 會剝走標點、壓縮空白並 toLowerCase()（生物科 GE1 曾因此整組被判重複）。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  weather: { id: 'weather_climate', zh: '天氣與氣候', en: 'Weather & Climate' },
  rivers: { id: 'rivers_coasts', zh: '河流與海岸環境', en: 'Rivers & Coasts' },
  urban: { id: 'urban', zh: '城市發展', en: 'Urban Development' },
  industry: { id: 'industry', zh: '工業區位', en: 'Industrial Location' },
  food: { id: 'food', zh: '糧食與飢荒', en: 'Food & Famine' },
  plate: { id: 'plate_hazards', zh: '板塊與自然災害', en: 'Plates & Hazards' },
  rain: { id: 'rainforest', zh: '熱帶雨林', en: 'Tropical Rainforest' },
  climate: { id: 'climate_change', zh: '氣候變化與環境管理', en: 'Climate Change' },
  chain: { id: 'geo_process_chain', zh: '地理過程・因果鏈', en: 'Geographical processes — causal chains' },
  data: { id: 'geo_data_manage', zh: '數據與環境管理', en: 'Data & environmental management' },
} satisfies Record<string, TopicMeta>

const FW = {
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
} satisfies Record<string, FwMeta>

const b = createBank('geography')

const distract = (correct: number, cands: number[]): number[] =>
  cands.filter((v, i, a) => v !== correct && a.indexOf(v) === i && Number.isFinite(v)).slice(0, 3)

// ── 天氣與氣候 ────────────────────────────────────────────────────────────

// WC1 — 環境氣溫遞減率
for (const base of [18, 22, 26, 30]) {
  for (const rise of [500, 1000, 1500, 2000, 2500, 3000]) {
    const drop = (rise / 1000) * 6.5
    const top = base - drop
    if (!Number.isInteger(top * 2)) continue
    const d = distract(top, [base + drop, base - drop / 2, base - drop * 2])
    if (d.length < 3) continue
    const diff = rise <= 1000 ? 'easy' : rise <= 2000 ? 'medium' : 'hard'
    b.add(`geob_wc1_${base}_${rise}`, T.weather, FW.apply, diff,
      [`山腳的氣溫為 ${base}°C。按每上升 1000 米降 6.5°C 的環境遞減率計算，海拔高 ${rise} 米處的氣溫約為多少？`,
       `The temperature at the foot of a mountain is ${base}°C. Using an environmental lapse rate of 6.5°C per 1000 m, what is the temperature ${rise} m higher?`],
      [qty(round(top, 2), '°C', '°C'), ...d.map((v) => qty(round(v, 2), '°C', '°C'))],
      [`氣溫下降幅度 = $\\dfrac{${rise}}{1000} \\times 6.5 = ${round(drop, 2)}$°C，故該處氣溫 = $${base} - ${round(drop, 2)} = ${round(top, 2)}$°C。要留意方向：海拔上升，氣溫【下降】，因為近地面空氣主要由地面長波輻射加熱，離地面愈遠受熱愈少。答 ${round(base + drop, 2)}°C 是把方向寫反，這是本課題最常見的失分位。`,
       `The fall in temperature is $\\dfrac{${rise}}{1000} \\times 6.5 = ${round(drop, 2)}$°C, so the temperature there is $${base} - ${round(drop, 2)} = ${round(top, 2)}$°C. Note the direction: temperature FALLS with altitude, because air near the ground is heated mainly by long-wave radiation from the surface, so the further from it the less heating. Answering ${round(base + drop, 2)}°C reverses the direction, which is where this topic is most often lost.`])
  }
}

// WC2 — 年溫差
for (const hot of [26, 28, 30, 32, 34]) {
  for (const cold of [2, 5, 8, 12, 15, 18]) {
    const range = hot - cold
    const d = distract(range, [hot + cold, (hot + cold) / 2, cold - hot])
    if (d.length < 3) continue
    b.add(`geob_wc2_${hot}_${cold}`, T.weather, FW.apply, 'easy',
      [`某地最暖月平均氣溫為 ${hot}°C，最冷月平均氣溫為 ${cold}°C。該地的年溫差是多少？`,
       `A place has a mean temperature of ${hot}°C in its warmest month and ${cold}°C in its coldest. What is the annual temperature range?`],
      [qty(range, '°C', '°C'), ...d.map((v) => qty(round(v, 2), '°C', '°C'))],
      [`年溫差 = 最暖月均溫 − 最冷月均溫 = $${hot} - ${cold} = ${range}$°C。答 $${hot + cold}$ 是把兩者相加，答 $${(hot + cold) / 2}$ 是求平均氣溫而非溫差。年溫差是判別氣候類型的重要指標：大陸性氣候年溫差大，海洋性氣候年溫差小，因為水的比熱容遠高於陸地。`,
       `Annual range = warmest monthly mean − coldest monthly mean = $${hot} - ${cold} = ${range}$°C. Answering $${hot + cold}$ adds them, while $${(hot + cold) / 2}$ gives the mean temperature rather than the range. The annual range is a key indicator of climate type: continental climates have a large range and maritime ones a small range, because water has a far higher specific heat capacity than land.`])
  }
}

// ── 河流與海岸 ────────────────────────────────────────────────────────────

// RC1 — 河流流量 = 流速 × 截面積
for (const v of [0.5, 1, 2]) {
  for (const w of [4, 8, 12]) {
    for (const dep of [0.5, 1, 1.5, 2]) {
      const area = w * dep
      const q = v * area
      if (!Number.isInteger(q * 2)) continue
      const d = distract(q, [v + area, area, v * w, q / 2])
      if (d.length < 3) continue
      b.add(`geob_rc1_${String(v).replace('.', '')}_${w}_${String(dep).replace('.', '')}`, T.rivers, FW.apply, 'medium',
        [`某河道寬 ${w} 米、平均深 ${dep} 米，流速為每秒 ${v} 米。該河的流量是多少立方米／秒？`,
         `A river channel is ${w} m wide with a mean depth of ${dep} m and a velocity of ${v} m/s. What is its discharge in cubic metres per second?`],
        [qty(round(q, 2), '立方米／秒', 'm³/s'), ...d.map((x) => qty(round(x, 2), '立方米／秒', 'm³/s'))],
        [`流量 = 流速 × 橫截面積。橫截面積 = 河寬 × 平均深度 = $${w} \\times ${dep} = ${area}$ 平方米，故流量 = $${v} \\times ${area} = ${round(q, 2)}$ 立方米／秒。三個量必須齊備：只用流速乘河寬會漏掉深度，得出的並非流量。實地考察題常要求先量多點深度求平均，再代入此式。`,
         `Discharge = velocity × cross-sectional area. The cross-section is width × mean depth = $${w} \\times ${dep} = ${area}$ m², so discharge = $${v} \\times ${area} = ${round(q, 2)}$ m³/s. All three quantities are needed: multiplying velocity by width alone omits depth and does not give discharge. Fieldwork questions usually require several depth readings to be averaged first, then substituted into this formula.`])
    }
  }
}

// RC2 — 河流梯度
for (const drop of [60, 90, 120, 150, 200, 240]) {
  for (const km of [2, 3, 4, 5, 6, 8]) {
    const grad = drop / (km * 1000)
    const perKm = drop / km
    if (!Number.isInteger(perKm)) continue
    const d = distract(perKm, [drop * km, km / drop, drop - km])
    if (d.length < 3) continue
    b.add(`geob_rc2_${drop}_${km}`, T.rivers, FW.apply, 'hard',
      [`某河段的起點與終點高度相差 ${drop} 米，兩點之間的河道長度為 ${km} 公里。該河段的平均梯度是每公里下降多少米？`,
       `A river section falls ${drop} m between two points ${km} km apart along the channel. What is its mean gradient in metres of fall per kilometre?`],
      [qty(perKm, '米／公里', 'm per km'), ...d.map((x) => qty(round(x, 2), '米／公里', 'm per km'))],
      [`平均梯度 = 高度差 ÷ 水平距離 = $\\dfrac{${drop}}{${km}} = ${perKm}$ 米／公里（即 $${round(grad, 5)}$ 或約 1 : ${Math.round(1 / grad)}）。要留意距離必須沿【河道】量度而非兩點直線距離，因為河流蜿蜒，河道長度大於直線距離，若用直線距離會高估梯度。上游梯度大、下游梯度小，是河流長剖面呈凹形的原因。`,
       `Mean gradient = fall ÷ horizontal distance = $\\dfrac{${drop}}{${km}} = ${perKm}$ m per km (that is $${round(grad, 5)}$, or about 1 : ${Math.round(1 / grad)}). The distance must be measured ALONG THE CHANNEL, not as a straight line between the points: a river meanders, so channel length exceeds straight-line distance and using the latter overestimates the gradient. Gradient is steep upstream and gentle downstream, which is why the long profile is concave.`])
  }
}

// ── 城市發展 ──────────────────────────────────────────────────────────────

// UR1 — 人口密度
for (const pop of [12000, 48000, 90000, 240000]) {
  for (const area of [2, 4, 6, 8]) {
    const den = pop / area
    if (!Number.isInteger(den)) continue
    const d = distract(den, [pop * area, pop - area, area / pop, den / 2])
    if (d.length < 3) continue
    b.add(`geob_ur1_${pop}_${area}`, T.urban, FW.apply, 'easy',
      [`某區有人口 ${pop} 人，面積 ${area} 平方公里。該區的人口密度是多少人／平方公里？`,
       `A district has a population of ${pop} living in ${area} km². What is its population density in persons per km²?`],
      [qty(den, '人／平方公里', 'persons/km²'), ...d.map((x) => qty(round(x, 2), '人／平方公里', 'persons/km²'))],
      [`人口密度 = 人口 ÷ 面積 = $\\dfrac{${pop}}{${area}} = ${den}$ 人／平方公里。要留意密度是【平均值】，會掩蓋內部差異：同一個區之內，住宅區與工業區的實際密度可以相差極遠。分析城市問題時，單看全區密度往往不足以說明擠迫狀況，須配合更細的分區數據。`,
       `Population density = population ÷ area = $\\dfrac{${pop}}{${area}} = ${den}$ persons/km². Note that density is an AVERAGE and hides internal variation: within one district, residential and industrial zones can differ enormously. District-wide density alone is therefore rarely enough to describe crowding; finer-grained data are needed.`])
  }
}

// UR2 — 人口自然增長率
for (const birth of [12, 15, 18, 22, 28, 34]) {
  for (const death of [4, 6, 8, 10, 14]) {
    const nat = birth - death
    const d = distract(nat, [birth + death, death - birth, birth * death])
    if (d.length < 3) continue
    b.add(`geob_ur2_${birth}_${death}`, T.urban, FW.apply, 'medium',
      [`某國的出生率為每千人 ${birth} 人，死亡率為每千人 ${death} 人。其人口自然增長率是多少（以百分率表示）？`,
       `A country has a birth rate of ${birth} per 1000 and a death rate of ${death} per 1000. What is its rate of natural increase, expressed as a percentage?`],
      [n(`$${round(nat / 10, 2)}\\%$`), ...d.map((x) => n(`$${round(x / 10, 2)}\\%$`))],
      [`自然增長率 = 出生率 − 死亡率 = $${birth} - ${death} = ${nat}$（每千人），換成百分率即除以 10，得 $${round(nat / 10, 2)}\\%$。要留意「自然」二字：此數值【不包括】人口遷移。一個自然增長率為正的地方仍可能因大量外遷而總人口下降，故分析人口變化必須同時看遷移數據。`,
       `Natural increase = birth rate − death rate = $${birth} - ${death} = ${nat}$ per 1000, which as a percentage is $${round(nat / 10, 2)}\\%$. The word NATURAL matters: this figure EXCLUDES migration. A place with positive natural increase can still lose population through heavy out-migration, so any analysis of population change must also examine migration data.`])
  }
}

// ── 工業區位 ──────────────────────────────────────────────────────────────

// IN1 — 重量減輕比
for (const raw of [10, 12, 15, 20, 24, 30, 40]) {
  for (const prodW of [1, 2, 3, 4, 5, 6]) {
    if (raw % prodW !== 0) continue
    const ratio = raw / prodW
    const d = distract(ratio, [raw * prodW, raw - prodW, prodW / raw])
    if (d.length < 3) continue
    b.add(`geob_in1_${raw}_${prodW}`, T.industry, FW.apply, 'hard',
      [`某工業每生產 ${prodW} 噸成品需消耗 ${raw} 噸原料。其重量減輕比是多少？該工業的區位傾向為何？`,
       `An industry uses ${raw} tonnes of raw material to make ${prodW} tonnes of product. What is its weight-loss ratio, and where does it tend to locate?`],
      // ⚠️ 不可用 n()：n() 只適用於與語言無關的字串，中文一旦包進去就會
      // 原封不動流入 optionsEn，英文介面的學生會見到中文選項。
      [[`$${ratio} : 1$，傾向原料地`, `$${ratio} : 1$, pulled towards the raw material source`],
       [`$${ratio} : 1$，傾向市場`, `$${ratio} : 1$, pulled towards the market`],
       [`$1 : ${ratio}$，傾向原料地`, `$1 : ${ratio}$, pulled towards the raw material source`],
       [`$${raw + prodW} : 1$，傾向市場`, `$${raw + prodW} : 1$, pulled towards the market`]],
      [`重量減輕比 = 原料重量 : 成品重量 = $${raw} : ${prodW} = ${ratio} : 1$。比值大於 1 表示加工過程中重量大幅減少，運送原料的成本高於運送成品，故工廠傾向設於【原料產地】以減低總運輸成本。相反，若成品比原料重（如汽水裝瓶加入水），則傾向設於市場。判斷區位傾向的關鍵，是問哪一端運起來較貴。`,
       `Weight-loss ratio = raw material : product = $${raw} : ${prodW} = ${ratio} : 1$. A ratio above 1 means much weight is lost in processing, so moving the raw material costs more than moving the product and the plant tends to locate AT THE RAW MATERIAL SOURCE to minimise total transport cost. Where the product is heavier than the inputs — bottling drinks, for instance, where water is added — the pull is towards the market instead. The question to ask is always which end is more expensive to move.`])
  }
}

// ── 糧食與飢荒 ────────────────────────────────────────────────────────────

// FD1 — 單位面積產量
for (const total of [1200, 2400, 3600, 4800, 6000, 9000]) {
  for (const ha of [40, 60, 80, 120, 150]) {
    const yieldPerHa = total / ha
    if (!Number.isInteger(yieldPerHa)) continue
    const d = distract(yieldPerHa, [total * ha, total - ha, ha / total])
    if (d.length < 3) continue
    b.add(`geob_fd1_${total}_${ha}`, T.food, FW.apply, 'easy',
      [`某農場面積 ${ha} 公頃，全年收成 ${total} 公噸。其單位面積產量是每公頃多少公噸？`,
       `A farm of ${ha} hectares harvests ${total} tonnes in a year. What is its yield per hectare?`],
      [qty(yieldPerHa, '公噸／公頃', 't/ha'), ...d.map((x) => qty(round(x, 2), '公噸／公頃', 't/ha'))],
      [`單位面積產量 = 總產量 ÷ 耕地面積 = $\\dfrac{${total}}{${ha}} = ${yieldPerHa}$ 公噸／公頃。要分清【總產量】與【單位面積產量】：一個國家總產量高，可能只因耕地面積大，農業效率未必高。比較不同地區的農業生產力時，必須用單位面積產量而非總產量，否則會把規模誤讀為效率。`,
       `Yield per hectare = total output ÷ cultivated area = $\\dfrac{${total}}{${ha}} = ${yieldPerHa}$ t/ha. Keep TOTAL OUTPUT and YIELD PER HECTARE apart: a country may have high total output simply because it farms a large area, without being efficient. Comparisons of agricultural productivity must use yield per unit area, or scale will be mistaken for efficiency.`])
  }
}

// ── 板塊與自然災害 ────────────────────────────────────────────────────────

// PL1 — 板塊移動累積距離
for (const rate of [2, 3, 5, 6, 8, 10]) {
  for (const yr of [1000, 5000, 10000, 50000, 100000]) {
    const cm = rate * yr
    const km = cm / 100000
    const d = distract(km, [cm, rate * yr / 1000, km * 10])
    if (d.length < 3) continue
    const diff = yr <= 5000 ? 'easy' : yr <= 50000 ? 'medium' : 'hard'
    b.add(`geob_pl1_${rate}_${yr}`, T.plate, FW.apply, diff,
      [`某板塊每年移動 ${rate} 厘米。經過 ${yr} 年，它移動的總距離是多少公里？`,
       `A plate moves ${rate} cm per year. How many kilometres does it move in ${yr} years?`],
      [qty(round(km, 3), '公里', 'km'), ...d.map((x) => qty(round(x, 3), '公里', 'km'))],
      [`總距離 = $${rate} \\times ${yr} = ${cm}$ 厘米。換算：1 公里 = 100 000 厘米，故 $\\dfrac{${cm}}{100000} = ${round(km, 3)}$ 公里。板塊每年只移動數厘米，看似極慢，但地質時間以百萬年計，累積下來足以令大陸分裂、海洋開闔——這正是理解板塊構造必須跳出日常時間尺度的原因。`,
       `Total distance = $${rate} \\times ${yr} = ${cm}$ cm. Since 1 km = 100 000 cm, this is $\\dfrac{${cm}}{100000} = ${round(km, 3)}$ km. A few centimetres a year seems negligible, but geological time runs to millions of years, and the accumulated movement is enough to split continents and open oceans — which is why plate tectonics can only be understood on a timescale far beyond everyday experience.`])
  }
}

// ── 熱帶雨林 ──────────────────────────────────────────────────────────────

// RF1 — 森林流失率
for (const start of [200000, 400000, 500000, 800000, 1000000]) {
  for (const pct of [1, 2, 5, 10]) {
    const lost = (start * pct) / 100
    const left = start - lost
    const d = distract(left, [lost, start + lost, start / pct])
    if (d.length < 3) continue
    b.add(`geob_rf1_${start}_${pct}`, T.rain, FW.apply, 'medium',
      [`某地雨林原有面積 ${start} 公頃，一年之內流失 ${pct}%。年終剩餘的雨林面積是多少公頃？`,
       `A rainforest of ${start} hectares loses ${pct}% of its area in one year. How many hectares remain at the end of the year?`],
      [qty(left, '公頃', 'ha'), ...d.map((x) => qty(round(x, 2), '公頃', 'ha'))],
      [`流失面積 = $${start} \\times ${pct}\\% = ${lost}$ 公頃，剩餘 = $${start} - ${lost} = ${left}$ 公頃。要留意題目問的是【剩餘】而非【流失】，答 ${lost} 即答錯了問題。另外要理解：雨林流失的影響不與面積成正比——邊緣效應令破碎化的林地生態價值下降得比面積損失更快，故「仍有九成」並不等於「九成功能仍在」。`,
       `Area lost = $${start} \\times ${pct}\\% = ${lost}$ ha, so the area remaining is $${start} - ${lost} = ${left}$ ha. The question asks what REMAINS, not what was lost, and answering ${lost} answers a different question. Note also that the impact is not proportional to area: edge effects mean fragmented forest loses ecological value faster than it loses area, so "90% still standing" does not mean "90% of the function remains".`])
  }
}

// ── 氣候變化 ──────────────────────────────────────────────────────────────

// CC1 — 人均碳排放
for (const total of [120, 250, 400, 560, 800, 1200]) {
  for (const pop of [4, 5, 8, 10, 20, 40]) {
    const per = total / pop
    if (!Number.isInteger(per * 100)) continue
    const d = distract(per, [total * pop, total - pop, pop / total])
    if (d.length < 3) continue
    b.add(`geob_cc1_${total}_${pop}`, T.climate, FW.apply, pop >= 20 ? 'hard' : 'medium',
      [`某國全年二氧化碳排放量為 ${total} 百萬公噸，人口為 ${pop} 百萬。其人均排放量是每人多少公噸？`,
       `A country emits ${total} million tonnes of carbon dioxide a year and has a population of ${pop} million. What is its per capita emission in tonnes per person?`],
      [qty(round(per, 2), '公噸／人', 't per person'), ...d.map((x) => qty(round(x, 2), '公噸／人', 't per person'))],
      [`人均排放量 = 總排放量 ÷ 人口 = $\\dfrac{${total}}{${pop}} = ${round(per, 2)}$ 公噸／人（兩者同以百萬為單位，可直接相除）。要留意【總量】與【人均】會給出完全不同的責任圖像：人口大國總量高但人均可能偏低，人口小國總量低而人均可能極高。氣候談判中兩種數字經常被各自援引，正是因為它們支持不同的論述。`,
       `Per capita emission = total ÷ population = $\\dfrac{${total}}{${pop}} = ${round(per, 2)}$ tonnes per person (both are in millions, so they divide directly). TOTAL and PER CAPITA figures give quite different pictures of responsibility: a populous country may have a high total but a low per capita figure, while a small one may have the reverse. Both are cited selectively in climate negotiations precisely because they support different arguments.`])
  }
}

// ── 地理過程・因果鏈 ──────────────────────────────────────────────────────
// ⚠️ 每條鏈只出一題，並另設一條問「若此過程持續」的題，兩題的題幹與選項
// 完全不同 —— 生物科 PC1 曾因同一題幹出三個 variant 而被撞題閘整組退回。

const chains: Array<[string, string, string, string, string, string]> = [
  ['都市面積擴張、地面被不透水物料覆蓋',
   '雨水下滲減少 → 地表徑流增加 → 河流洪峰流量上升且提前到達 → 市區水浸風險上升',
   '雨水下滲增加 → 地表徑流減少 → 河流洪峰流量下降 → 水浸風險下降',
   'urban areas expand and the ground is sealed with impermeable surfaces',
   'infiltration falls → surface run-off rises → the flood peak is higher and arrives sooner → urban flood risk rises',
   'infiltration rises → surface run-off falls → the flood peak is lower → flood risk falls'],
  ['雨林被大規模砍伐',
   '截留與蒸散作用減少 → 局部降雨減少、表土失去保護 → 土壤侵蝕加劇 → 土地生產力下降',
   '截留與蒸散作用增加 → 局部降雨增加 → 土壤水分上升 → 土地生產力提高',
   'rainforest is cleared on a large scale',
   'interception and transpiration fall → local rainfall declines and topsoil is exposed → erosion intensifies → land productivity falls',
   'interception and transpiration rise → local rainfall increases → soil moisture rises → land productivity improves'],
  ['海平面因暖化而上升',
   '海岸低地被淹沒 → 鹹水入侵地下水與農田 → 農業產量下降 → 人口被迫遷移',
   '海岸低地面積增加 → 淡水補注增加 → 農業產量上升 → 人口遷入',
   'sea level rises with warming',
   'low-lying coasts are inundated → saltwater intrudes into groundwater and farmland → crop yields fall → people are displaced',
   'low-lying coastal area increases → freshwater recharge rises → crop yields rise → people move in'],
  ['過度抽取地下水',
   '地下水位下降 → 含水層壓密 → 地面沉降 → 沿海地區水浸與鹹水入侵風險上升',
   '地下水位上升 → 含水層膨脹 → 地面隆起 → 水浸風險下降',
   'groundwater is over-abstracted',
   'the water table falls → the aquifer compacts → the ground subsides → flooding and saltwater intrusion risk rise on the coast',
   'the water table rises → the aquifer expands → the ground is uplifted → flood risk falls'],
  ['北極海冰融化',
   '反照率下降、海面吸收更多太陽輻射 → 局部升溫加快 → 海冰進一步融化（正反饋）',
   '反照率上升、海面反射更多太陽輻射 → 局部降溫 → 海冰重新形成（負反饋）',
   'Arctic sea ice melts',
   'albedo falls and the ocean absorbs more solar radiation → local warming accelerates → more ice melts, a positive feedback',
   'albedo rises and the ocean reflects more solar radiation → local cooling follows → ice re-forms, a negative feedback'],
  ['河流上游興建水壩',
   '泥沙被攔截於水庫 → 下游輸沙量減少 → 三角洲沉積不足以抵消侵蝕 → 海岸線後退',
   '泥沙輸送增加 → 下游沉積加劇 → 三角洲快速向海推進 → 海岸線前進',
   'a dam is built on the upper course of a river',
   'sediment is trapped behind the dam → the downstream sediment load falls → deposition no longer offsets erosion at the delta → the coastline retreats',
   'sediment transport increases → deposition downstream intensifies → the delta advances rapidly → the coastline advances'],
]

for (const [stim, right, reversed, stimEn, rightEn, reversedEn] of chains) {
  const midWrong = right.split(' → ').slice(0, -1).join(' → ') + ' → 最終結果與上述相反'
  const midWrongEn = rightEn.split(' → ').slice(0, -1).join(' → ') + ' → the final outcome is the opposite of the above'
  const firstWrong = '起始條件被讀作相反方向 → ' + right.split(' → ').slice(1).join(' → ')
  const firstWrongEn = 'the initial condition is read in the opposite direction → ' + rightEn.split(' → ').slice(1).join(' → ')

  b.add(`geob_pc1_${stim.slice(0, 8)}`, T.chain, FW.logic, 'medium',
    [`當${stim}，相關的地理過程依循哪一條因果鏈？`,
     `When ${stimEn}, which causal chain describes the geographical process that follows?`],
    [[right, rightEn], [reversed, reversedEn], [midWrong, midWrongEn], [firstWrong, firstWrongEn]],
    [`正確鏈為：${right}。答這類題的固定方法：先由物理機制確定第一環的方向，再逐環檢查後一環是否由前一環必然導出；任何一環方向相反，整條鏈即可排除。要留意干擾項往往前半正確而結論相反，只讀首尾容易中伏。`,
     `The correct chain is: ${rightEn}. The method is fixed: establish the direction of the first link from the physical mechanism, then check that each subsequent link follows necessarily from the one before; a single reversed link eliminates the whole chain. Note that distractors often begin correctly and end with a contradictory conclusion, so reading only the first and last steps is a reliable way to be caught out.`])

  b.add(`geob_pc2_${stim.slice(0, 8)}`, T.chain, FW.logic, 'hard',
    [`若${stim}此一情況持續數十年而未有任何干預，最可能出現甚麼結果？`,
     `If ${stimEn} and this continues for decades without intervention, what is the most likely outcome?`],
    [['上述過程的末端影響持續累積並擴大，系統難以自行回復原狀',
      'the end-of-chain impact accumulates and widens, and the system cannot readily return to its former state'],
     ['系統會自動回復平衡，因為自然過程必然趨向穩定',
      'the system returns to equilibrium by itself, since natural processes always tend towards stability'],
     ['過程會反向運行，最終抵消原來的改變',
      'the process reverses and eventually cancels the original change'],
     ['影響維持在初始水平，因為地理過程不會隨時間累積',
      'the impact stays at its initial level, since geographical processes do not accumulate over time']],
    [`地理過程的影響多屬【累積性】：改變一旦持續，末端影響不會停留在初始水平，而是逐年疊加。所謂「自然會回復平衡」是常見誤解——負反饋確實存在，但當擾動的規模與速度超出系統的調節能力，或當過程本身屬正反饋（如冰－反照率反饋），系統便會離原狀愈來愈遠。這正是環境管理必須及早介入的原因：愈遲干預，回復所需的代價愈大，部分改變甚至不可逆。`,
     `The impacts of geographical processes are largely CUMULATIVE: once a change persists, the end-of-chain effect does not stay at its initial level but compounds year on year. The idea that nature restores its own balance is a common misconception — negative feedbacks do exist, but where the scale and speed of the disturbance exceed the system's capacity to adjust, or where the process is itself a positive feedback such as the ice-albedo feedback, the system moves further and further from its original state. This is why environmental management must intervene early: the later the intervention, the greater the cost of recovery, and some changes cannot be reversed at all.`])
}

// ── 數據與環境管理 ────────────────────────────────────────────────────────
// 此課題考的是【數據判讀的陷阱】，而非計算本身，故干擾項一律由真實的誤讀
// 方式構成：換基準年、混淆總量與人均、誤讀比例尺、把相關當因果。

// DM1 — 百分比變化的基準
for (const before of [40, 50, 80, 120, 200, 400]) {
  for (const after of [30, 60, 100, 160, 300]) {
    if (before === after) continue
    const pct = ((after - before) / before) * 100
    if (!Number.isInteger(pct)) continue
    const wrongBase = ((after - before) / after) * 100
    if (!Number.isFinite(wrongBase) || Math.round(wrongBase) === Math.round(pct)) continue
    b.add(`geob_dm1_${before}_${after}`, T.data, FW.apply, 'medium',
      [`某地的森林覆蓋面積由 ${before} 平方公里變為 ${after} 平方公里。變化的百分比是多少？`,
       `Forest cover in an area changes from ${before} km² to ${after} km². What is the percentage change?`],
      [n(`$${round(pct, 2)}\%$`), n(`$${round(wrongBase, 2)}\%$`),
       n(`$${round(after - before, 2)}\%$`), n(`$${round((after / before) * 100, 2)}\%$`)],
      [`百分比變化 = $\\dfrac{\\text{變化量}}{\\text{原有值}} \\times 100\\% = \\dfrac{${after} - ${before}}{${before}} \\times 100\\% = ${round(pct, 2)}\\%$。分母必須用【原有值】而非新值：以 ${after} 作分母得 ${round(wrongBase, 2)}%，是最常見的誤算。另外 ${round(after - before, 2)}% 是把絕對變化量當成百分比，而 ${round((after / before) * 100, 2)}% 是新值佔原值的比例，並非變化率。`,
       `Percentage change = $\\dfrac{\\text{change}}{\\text{original}} \\times 100\\% = \\dfrac{${after} - ${before}}{${before}} \\times 100\\% = ${round(pct, 2)}\\%$. The denominator must be the ORIGINAL value, not the new one: using ${after} gives ${round(wrongBase, 2)}%, the commonest error. Note too that ${round(after - before, 2)}% treats the absolute change as a percentage, while ${round((after / before) * 100, 2)}% is the new value as a proportion of the old, not the rate of change.`])
  }
}

// DM2 — 地圖比例尺換算
for (const denom of [10000, 25000, 50000, 100000, 200000]) {
  for (const cm of [2, 3, 4, 5, 8]) {
    const km = (cm * denom) / 100000
    const d = distract(km, [cm * denom, km * 10, km / 10, cm / denom])
    if (d.length < 3) continue
    b.add(`geob_dm2_${denom}_${cm}`, T.data, FW.apply, 'easy',
      [`地圖比例尺為 1 : ${denom}。圖上量得兩點相距 ${cm} 厘米，實地距離是多少公里？`,
       `A map has a scale of 1 : ${denom}. Two points are ${cm} cm apart on the map. What is the actual distance in kilometres?`],
      [qty(round(km, 3), '公里', 'km'), ...d.map((x) => qty(round(x, 3), '公里', 'km'))],
      [`實地距離 = 圖上距離 × 比例尺分母 = $${cm} \\times ${denom} = ${cm * denom}$ 厘米，再除以 100 000 換成公里，得 ${round(km, 3)} 公里。兩個關口都容易失分：一是忘記乘分母，二是漏了厘米與公里的換算（1 公里 = 100 000 厘米）。比例尺分母愈大，地圖涵蓋範圍愈廣而細節愈少。`,
       `Actual distance = map distance × scale denominator = $${cm} \\times ${denom} = ${cm * denom}$ cm, then ÷ 100 000 for kilometres, giving ${round(km, 3)} km. Marks are lost at two points: forgetting to multiply by the denominator, and skipping the cm-to-km conversion (1 km = 100 000 cm). The larger the denominator, the wider the area covered and the less detail shown.`])
  }
}

// DM3 — 相關並非因果
for (const pair of [
  ['某市的雪糕銷量與中暑求診人數', '兩者同受氣溫上升影響', 'ice-cream sales and heatstroke admissions in a city', 'both rise with temperature'],
  ['某國的手機用戶數與人均壽命', '兩者同受經濟發展水平影響', 'mobile subscriptions and life expectancy in a country', 'both rise with the level of economic development'],
  ['某區的公園數目與居民運動時數', '兩者同受該區規劃政策影響', 'the number of parks and residents\' exercise hours in a district', 'both reflect the district\'s planning policy'],
  ['沿海城市的旅客人次與海水污染指數', '兩者同受季節性人口流動影響', 'visitor numbers and marine pollution index in a coastal city', 'both follow seasonal movements of people'],
]) {
  const [zh, why, en, whyEn] = pair
  b.add(`geob_dm3_${zh.slice(0, 6)}`, T.data, FW.logic, 'hard',
    [`統計顯示，${zh}呈強正相關。以下哪一項是最合理的解讀？`,
     `Statistics show a strong positive correlation between ${en}. Which reading is most defensible?`],
    [[`兩者未必互為因果，可能同受第三個因素影響——${why}`,
      `neither necessarily causes the other; a third factor may drive both — ${whyEn}`],
     ['既然相關度高，即可斷定前者導致後者',
      'a high correlation is enough to conclude that the first causes the second'],
     ['相關度高代表兩者互相導致，形成循環',
      'a high correlation means each causes the other in a loop'],
     ['相關度高但無統計意義，故該數據不應使用',
      'the correlation is high but meaningless, so the data should be discarded']],
    [`相關只說明兩組數字同步變動，並不說明何者導致何者，亦不排除兩者同受第三個變項影響——${why}。確立因果至少需要三項條件：相關、正確的時序（因先於果），以及排除其他解釋。地理數據題常以強相關誘導考生作因果結論，這是最常設的陷阱。留意最後一項亦錯：數據本身有效，問題只在於【如何解讀】，不應因此棄用。`,
     `A correlation shows only that two sets of figures move together; it says nothing about which causes which, nor does it rule out a third variable driving both — ${whyEn}. Establishing causation requires at least three things: correlation, the right time order with cause before effect, and the elimination of alternative explanations. Data questions in geography routinely use a strong correlation to invite a causal conclusion, and that is the trap. Note the last option is wrong too: the data are valid; what is at issue is how they are READ, not whether they should be used.`])
}

export const geographyBank2Questions: Question[] = b.bank
