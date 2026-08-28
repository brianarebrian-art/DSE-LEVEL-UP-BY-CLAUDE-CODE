import type { Question } from './types'
import { createBank, n, qty, round, money, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// 應用科目計算型題庫 —— PARAMETRIC BANK（Mode A, correct-by-construction）
// ---------------------------------------------------------------------------
// 為何六個科目共用一個檔案：旅遊與款待、科技與生活、設計與應用科技、體育、
// 生物、音樂 六科之中，真正屬「答案可由公式或規則構造」的課題各自只有一至
// 兩個（酒店營運計算、營養計算、機械計算、運動生理計算、生態數據、樂理音程）。
// 拆成六個 *-bank.ts，每個檔案只得兩個母模板，反而令這批內容散落難以維護。
// 其餘課題（服務概念、藝術史、道德推理等）屬判斷型內容，答案並非可構造，
// 不適用本工廠，須循人手出題與覆核管線處理。
//
// 每一條的答案與三個誘答一律由公式或樂理規則計算，誘答對應具名錯誤。
// 退化的參數組合由 createBank().add() 丟棄並登記（見 _parametric.ts）。
// ═══════════════════════════════════════════════════════════════════════════

const fmt = (v: number): string => v.toLocaleString('en-US')

// ── 旅遊與款待：酒店營運計算 ──────────────────────────────────────────────

const thsT = { calc: { id: 'ths_hotel_metrics', zh: '酒店營運計算', en: 'Hotel operations — metrics' } } satisfies Record<string, TopicMeta>
const thsFW = { analysis: { id: 'analysis', zh: '分析評鑑', en: 'Analysis', emoji: '🔗' } } satisfies Record<string, FwMeta>
const ths = createBank('ths')

// TH1 — 入住率 = 已售房間數 ÷ 可供出租房間數 × 100%
for (const rooms of [200, 250, 300, 400, 500]) {
  for (const pct of [60, 72, 80, 85, 90]) {
    const sold = (rooms * pct) / 100
    if (!Number.isInteger(sold)) continue
    ths.add(`thsb_th1_${rooms}_${pct}`, thsT.calc, thsFW.analysis, 'easy',
      [`一間酒店共有 ${rooms} 間可供出租的客房，某晚售出 ${sold} 間。當晚的入住率是多少？`,
       `A hotel has ${rooms} rooms available for sale and sells ${sold} of them one night. What is the occupancy rate for that night?`],
      [n(`${pct}%`), n(`${round((rooms / sold) * 100, 1)}%`), n(`${round(((rooms - sold) / rooms) * 100, 1)}%`), n(`${sold}%`)],
      [`入住率 = 已售房間數 ÷ 可供出租房間數 × 100% = ${sold} ÷ ${rooms} × 100% = ${pct}%。分母是【可供出租】的房間數，並非酒店的總房間數，維修中或封存的房間不計在內。陷阱：${round((rooms / sold) * 100, 1)}% 把分子分母倒轉；${round(((rooms - sold) / rooms) * 100, 1)}% 算的是空置率；${sold}% 直接把房間數當成百分率。`,
       `Occupancy rate = rooms sold ÷ rooms available for sale × 100% = ${sold} ÷ ${rooms} × 100% = ${pct}%. The denominator is the rooms available for sale, not the hotel's total room count; rooms out of order are excluded. Traps: ${round((rooms / sold) * 100, 1)}% inverts the fraction; ${round(((rooms - sold) / rooms) * 100, 1)}% is the vacancy rate; ${sold}% reads the room count as a percentage.`])
  }
}

// TH2 — 平均房價（ADR）= 客房收入 ÷ 已售房間數
for (const sold of [100, 120, 150, 180, 200, 240, 300]) {
  for (const adr of [700, 800, 950, 1100, 1200, 1500]) {
    const rev = sold * adr
    ths.add(`thsb_th2_${sold}_${adr}`, thsT.calc, thsFW.analysis, 'medium',
      [`某晚酒店客房收入 ${fmt(rev)} 元，售出 ${sold} 間客房。平均房價（ADR）是多少？`,
       `A hotel earns \\$${fmt(rev)} in room revenue one night from ${sold} rooms sold. What is the average daily rate (ADR)?`],
      [money(fmt(adr)), money(fmt(round(sold / adr, 3) as unknown as number)), money(fmt(rev)), money(fmt(rev - sold))],
      [`平均房價 = 客房收入 ÷ 已售房間數 = ${fmt(rev)} ÷ ${sold} = ${fmt(adr)} 元。留意分母是【已售】房間數而非可供出租房間數 —— 若誤用後者，得出的是每間可售房收入（RevPAR），是另一個指標。陷阱：${fmt(rev)} 元是總收入；${fmt(rev - sold)} 元把房間數當成金額扣減。`,
       `ADR = room revenue ÷ rooms sold = \\$${fmt(rev)} ÷ ${sold} = \\$${fmt(adr)}. The denominator is rooms SOLD, not rooms available; using the latter gives revenue per available room (RevPAR), a different measure. Traps: \\$${fmt(rev)} is total revenue; \\$${fmt(rev - sold)} subtracts the room count as if it were money.`])
  }
}

// TH3 — 每間可售房收入 RevPAR = ADR × 入住率
for (const adr of [800, 1000, 1200, 1600]) {
  for (const occ of [60, 75, 80, 90]) {
    const revpar = (adr * occ) / 100
    ths.add(`thsb_th3_${adr}_${occ}`, thsT.calc, thsFW.analysis, 'hard',
      [`某酒店平均房價 ${fmt(adr)} 元，入住率 ${occ}%。每間可售房收入（RevPAR）是多少？`,
       `A hotel has an average daily rate of \\$${fmt(adr)} and an occupancy rate of ${occ}%. What is its revenue per available room (RevPAR)?`],
      [money(fmt(revpar)), money(fmt(adr)), money(fmt(adr + occ)), money(fmt(round((adr * 100) / occ, 2) as unknown as number))],
      [`RevPAR = 平均房價 × 入住率 = ${fmt(adr)} × ${occ}% = ${fmt(revpar)} 元。RevPAR 同時反映「賣得幾貴」與「賣出幾多」，因此比單看平均房價更能顯示整體經營表現：一間酒店可以靠抬價推高平均房價，但若入住率因而下跌，RevPAR 未必上升。陷阱：${fmt(adr)} 元漏了乘入住率；${fmt(adr + occ)} 元把百分率當作金額相加；${round((adr * 100) / occ, 2)} 元把入住率放到了分母。`,
       `RevPAR = ADR × occupancy = \\$${fmt(adr)} × ${occ}% = \\$${fmt(revpar)}. RevPAR combines how much rooms sell for with how many sell, so it reflects overall performance better than ADR alone: raising rates lifts ADR, but if occupancy falls in response RevPAR need not rise. Traps: \\$${fmt(adr)} omits the occupancy factor; \\$${fmt(adr + occ)} adds the percentage as an amount; \\$${round((adr * 100) / occ, 2)} places occupancy in the denominator.`])
  }
}

export const thsBankQuestions: Question[] = ths.bank

// ── 科技與生活：營養計算 ──────────────────────────────────────────────────

const tlT = { nutri: { id: 'tl_nutrition_calc', zh: '營養計算', en: 'Nutrition — calculation' } } satisfies Record<string, TopicMeta>
const tlFW = { calc: { id: 'calc', zh: '計算分析', en: 'Quantitative', emoji: '🧮' } } satisfies Record<string, FwMeta>
const tl = createBank('technology-living')

// TL1 — 能量值：碳水化合物 4 kcal/g、蛋白質 4 kcal/g、脂肪 9 kcal/g
for (const carb of [20, 30, 40, 50, 60]) {
  for (const prot of [5, 10, 15, 20]) {
    for (const fat of [5, 10, 15]) {
      const kcal = carb * 4 + prot * 4 + fat * 9
      tl.add(`tlb_tl1_${carb}_${prot}_${fat}`, tlT.nutri, tlFW.calc, fat === 5 ? 'easy' : 'medium',
        [`一份食物含碳水化合物 ${carb} 克、蛋白質 ${prot} 克、脂肪 ${fat} 克。其能量值約為多少千卡？（碳水化合物與蛋白質各 4 千卡／克，脂肪 9 千卡／克）`,
         `A portion of food contains ${carb} g carbohydrate, ${prot} g protein and ${fat} g fat. What is its energy value in kcal? (Carbohydrate and protein 4 kcal/g each, fat 9 kcal/g.)`],
        [qty(kcal, '千卡', 'kcal'), qty(carb * 4 + prot * 9 + fat * 4, '千卡', 'kcal'), qty(carb * 4 + prot * 4 + fat * 4, '千卡', 'kcal'), qty(carb + prot + fat, '千卡', 'kcal')],
        [`能量值 = 碳水化合物 ${carb} × 4 ＋ 蛋白質 ${prot} × 4 ＋ 脂肪 ${fat} × 9 = ${carb * 4} ＋ ${prot * 4} ＋ ${fat * 9} = ${kcal} 千卡。脂肪每克提供的能量是碳水化合物與蛋白質的兩倍有多，因此同樣重量的高脂食物能量密度高得多。陷阱：${carb * 4 + prot * 9 + fat * 4} 千卡把蛋白質與脂肪的能量值調轉；${carb * 4 + prot * 4 + fat * 4} 千卡把脂肪也當作 4 千卡／克；${carb + prot + fat} 千卡只把克數相加。`,
         `Energy = carbohydrate ${carb} × 4 + protein ${prot} × 4 + fat ${fat} × 9 = ${carb * 4} + ${prot * 4} + ${fat * 9} = ${kcal} kcal. Fat supplies more than twice the energy per gram of carbohydrate or protein, so fatty foods are far more energy-dense for the same weight. Traps: ${carb * 4 + prot * 9 + fat * 4} kcal interchanges the values for protein and fat; ${carb * 4 + prot * 4 + fat * 4} kcal values fat at 4 kcal/g; ${carb + prot + fat} kcal merely adds the grams.`])
    }
  }
}

// TL2 — 脂肪供能百分比
for (const kcal of [400, 500, 600, 800, 1000]) {
  for (const fat of [10, 15, 20, 25, 30]) {
    const pct = (fat * 9 * 100) / kcal
    if (!Number.isInteger(pct * 10)) continue
    tl.add(`tlb_tl2_${kcal}_${fat}`, tlT.nutri, tlFW.calc, 'hard',
      [`一份總能量 ${kcal} 千卡的膳食含脂肪 ${fat} 克。脂肪提供的能量佔總能量的百分比是多少？（脂肪 9 千卡／克）`,
       `A meal providing ${kcal} kcal in total contains ${fat} g of fat. What percentage of the total energy comes from fat? (Fat 9 kcal/g.)`],
      [n(`${round(pct, 1)}%`), n(`${round((fat * 100) / kcal, 1)}%`), n(`${round((fat * 4 * 100) / kcal, 1)}%`), n(`${round((kcal * 100) / (fat * 9), 1)}%`)],
      [`脂肪提供的能量 = ${fat} × 9 = ${fat * 9} 千卡，佔比 = ${fat * 9} ÷ ${kcal} × 100% = ${round(pct, 1)}%。世界衞生組織建議脂肪供能一般不宜超過總能量的三成。陷阱：${round((fat * 100) / kcal, 1)}% 用了克數而非能量作分子；${round((fat * 4 * 100) / kcal, 1)}% 把脂肪的能量值誤作 4 千卡／克；${round((kcal * 100) / (fat * 9), 1)}% 把分子分母倒轉。`,
       `Energy from fat = ${fat} × 9 = ${fat * 9} kcal, so the share is ${fat * 9} ÷ ${kcal} × 100% = ${round(pct, 1)}%. The World Health Organization generally advises that fat should supply no more than about 30% of total energy. Traps: ${round((fat * 100) / kcal, 1)}% uses grams rather than energy in the numerator; ${round((fat * 4 * 100) / kcal, 1)}% values fat at 4 kcal/g; ${round((kcal * 100) / (fat * 9), 1)}% inverts the fraction.`])
  }
}

export const technologyLivingBankQuestions: Question[] = tl.bank

// ── 設計與應用科技：結構與機械計算 ────────────────────────────────────────

const datT = { mech: { id: 'dat_mechanisms_calc', zh: '結構與機械・計算', en: 'Structures & mechanisms — calculation' } } satisfies Record<string, TopicMeta>
const datFW = { calc: { id: 'calc', zh: '計算分析', en: 'Quantitative', emoji: '🧮' } } satisfies Record<string, FwMeta>
const dat = createBank('design-tech')

// DT1 — 槓桿平衡：F₁d₁ = F₂d₂
for (const f1 of [20, 30, 40, 50, 60]) {
  for (const d1 of [2, 3, 4]) {
    for (const d2 of [5, 6, 8]) {
      const f2 = (f1 * d1) / d2
      if (!Number.isInteger(f2) || f2 === f1) continue
      dat.add(`datb_dt1_${f1}_${d1}_${d2}`, datT.mech, datFW.calc, d1 === 2 ? 'easy' : 'medium',
        [`一支槓桿的支點左方距離 ${d1} 米處掛上 ${f1} 牛頓的力，右方距離 ${d2} 米處施力 F 使槓桿平衡。F 是多少牛頓？`,
         `On a lever, a force of ${f1} N acts ${d1} m to the left of the pivot, and a force F acts ${d2} m to the right. What value of F balances the lever?`],
        [qty(f2, '牛頓', 'N'), qty(f1, '牛頓', 'N'), qty(f1 * d1 * d2, '牛頓', 'N'), qty(round((f1 * d2) / d1, 2), '牛頓', 'N')],
        [`槓桿平衡的條件是兩邊力矩相等：$F_1 d_1 = F_2 d_2$，即 ${f1} × ${d1} = F × ${d2}，故 F = ${f1 * d1} ÷ ${d2} = ${f2} 牛頓。力臂愈長，所需的力愈小，這正是省力槓桿的原理。陷阱：${f1} 牛頓誤以為兩邊力相等（只有力臂相等時才成立）；${f1 * d1 * d2} 牛頓把兩個距離都乘上；${round((f1 * d2) / d1, 2)} 牛頓把兩個距離倒轉。`,
         `A lever balances when the moments are equal: $F_1 d_1 = F_2 d_2$, so ${f1} × ${d1} = F × ${d2} and F = ${f1 * d1} ÷ ${d2} = ${f2} N. The longer the arm the smaller the force required, which is the principle of a force-multiplying lever. Traps: ${f1} N assumes equal forces, which holds only for equal arms; ${f1 * d1 * d2} N multiplies by both distances; ${round((f1 * d2) / d1, 2)} N swaps the two distances.`])
    }
  }
}

// DT2 — 齒輪傳動比：轉速比與齒數比成反比
for (const driver of [10, 12, 15, 20, 25]) {
  for (const driven of [30, 40, 50, 60]) {
    for (const rpm of [120, 240, 300]) {
      const out = (driver * rpm) / driven
      if (!Number.isInteger(out)) continue
      dat.add(`datb_dt2_${driver}_${driven}_${rpm}`, datT.mech, datFW.calc, rpm === 120 ? 'medium' : 'hard',
        [`主動齒輪有 ${driver} 齒，從動齒輪有 ${driven} 齒。若主動齒輪以每分鐘 ${rpm} 轉轉動，從動齒輪的轉速是多少？`,
         `A driver gear has ${driver} teeth and the driven gear has ${driven} teeth. If the driver turns at ${rpm} rev/min, what is the speed of the driven gear?`],
        [qty(out, '轉／分鐘', 'rev/min'), qty(round((driven * rpm) / driver, 1), '轉／分鐘', 'rev/min'), qty(rpm, '轉／分鐘', 'rev/min'), qty(round(driven / driver, 2), '轉／分鐘', 'rev/min')],
        [`齒輪嚙合時，兩輪在單位時間內走過的齒數相同，故轉速與齒數成【反】比：$N_1 T_1 = N_2 T_2$。代入得 ${rpm} × ${driver} = N × ${driven}，N = ${driver * rpm} ÷ ${driven} = ${out} 轉／分鐘。齒數多的一輪轉得慢，但輸出扭矩較大。陷阱：${round((driven * rpm) / driver, 1)} 轉／分鐘把正比反比倒轉；${rpm} 轉／分鐘誤以為轉速不變；${round(driven / driver, 2)} 只是齒數比本身。`,
         `Meshing gears pass the same number of teeth per unit time, so speed varies INVERSELY with tooth count: $N_1 T_1 = N_2 T_2$. Hence ${rpm} × ${driver} = N × ${driven}, giving N = ${driver * rpm} ÷ ${driven} = ${out} rev/min. The larger gear turns more slowly but delivers greater torque. Traps: ${round((driven * rpm) / driver, 1)} rev/min inverts the relationship; ${rpm} rev/min assumes the speed is unchanged; ${round(driven / driver, 2)} is merely the gear ratio.`])
    }
  }
}

export const designTechBankQuestions: Question[] = dat.bank

// ── 體育：運動生理計算 ────────────────────────────────────────────────────

const peT = { physio: { id: 'pe_physiology_calc', zh: '運動生理計算', en: 'Exercise physiology — calculation' } } satisfies Record<string, TopicMeta>
const peFW = { calc: { id: 'calc', zh: '計算分析', en: 'Quantitative', emoji: '🧮' } } satisfies Record<string, FwMeta>
const pe = createBank('pe')

// PE1 — 身體質量指數 BMI = 體重(kg) ÷ 身高(m)²
for (const h of [150, 160, 170, 175, 180]) {
  for (const bmi of [18, 20, 22, 25, 28]) {
    const m = h / 100
    const w = bmi * m * m
    if (!Number.isInteger(w * 100)) continue
    pe.add(`peb_pe1_${h}_${bmi}`, peT.physio, peFW.calc, 'easy',
      [`一名學生身高 ${m} 米、體重 ${round(w, 2)} 公斤。其身體質量指數（BMI）是多少？`,
       `A student is ${m} m tall and weighs ${round(w, 2)} kg. What is their body mass index (BMI)?`],
      [n(`${round(bmi, 1)}`), n(`${round(w / m, 1)}`), n(`${round(w / (h * h), 4)}`), n(`${round(w * m * m, 1)}`)],
      [`BMI = 體重（公斤）÷ 身高（米）的平方 = ${round(w, 2)} ÷ ${m}² = ${round(w, 2)} ÷ ${round(m * m, 4)} = ${round(bmi, 1)}。身高必須用【米】為單位，這是最常見的失分位。BMI 只反映體重與身高的比例，並不區分肌肉與脂肪，運動員的數值往往偏高。陷阱：${round(w / m, 1)} 漏了把身高平方；${round(w / (h * h), 4)} 用了厘米；${round(w * m * m, 1)} 把除法寫成乘法。`,
       `BMI = mass in kg ÷ (height in m)² = ${round(w, 2)} ÷ ${m}² = ${round(w, 2)} ÷ ${round(m * m, 4)} = ${round(bmi, 1)}. Height must be in metres, which is where marks are most often lost. BMI compares mass with height only and does not distinguish muscle from fat, so athletes often score high. Traps: ${round(w / m, 1)} fails to square the height; ${round(w / (h * h), 4)} uses centimetres; ${round(w * m * m, 1)} multiplies instead of dividing.`])
  }
}

// PE2 — 目標心率 = (220 − 年齡) × 強度百分比
for (const age of [14, 15, 16, 17, 18, 20]) {
  for (const pct of [40, 50, 60, 70, 80, 90]) {
    const mhr = 220 - age
    const thr = (mhr * pct) / 100
    if (!Number.isInteger(thr)) continue
    pe.add(`peb_pe2_${age}_${pct}`, peT.physio, peFW.calc, 'medium',
      [`一名 ${age} 歲學生以最大心率的 ${pct}% 進行帶氧訓練。以「220 減年齡」估算最大心率，其目標心率是每分鐘多少次？`,
       `A ${age}-year-old student trains aerobically at ${pct}% of maximum heart rate. Using the "220 minus age" estimate, what is the target heart rate in beats per minute?`],
      [qty(thr, '次／分鐘', 'bpm'), qty(mhr, '次／分鐘', 'bpm'), qty(round((220 * pct) / 100, 1), '次／分鐘', 'bpm'), qty(round(((220 - age) * 100) / pct, 1), '次／分鐘', 'bpm')],
      [`估算最大心率 = 220 − ${age} = ${mhr} 次／分鐘，目標心率 = ${mhr} × ${pct}% = ${thr} 次／分鐘。此公式只是【估算】，個體差異可達每分鐘十餘次，實際訓練應配合自覺竭力程度。陷阱：${mhr} 次／分鐘漏了乘強度百分比；${round((220 * pct) / 100, 1)} 次／分鐘忘記先減年齡；${round(((220 - age) * 100) / pct, 1)} 次／分鐘把百分比放到了分母。`,
       `Estimated maximum heart rate = 220 − ${age} = ${mhr} bpm, so the target is ${mhr} × ${pct}% = ${thr} bpm. The formula is only an estimate; individual variation can exceed ten beats per minute, so training should also be guided by perceived exertion. Traps: ${mhr} bpm omits the intensity factor; ${round((220 * pct) / 100, 1)} bpm forgets to subtract the age first; ${round(((220 - age) * 100) / pct, 1)} bpm places the percentage in the denominator.`])
  }
}

// PE3 — 心輸出量 = 心率 × 每搏輸出量
for (const hr of [60, 70, 80, 120, 150, 180]) {
  for (const sv of [70, 80, 90, 100]) {
    const co = (hr * sv) / 1000
    pe.add(`peb_pe3_${hr}_${sv}`, peT.physio, peFW.calc, hr <= 80 ? 'medium' : 'hard',
      [`某人心率為每分鐘 ${hr} 次，每搏輸出量為 ${sv} 毫升。其心輸出量是每分鐘多少升？`,
       `A person has a heart rate of ${hr} beats per minute and a stroke volume of ${sv} mL. What is the cardiac output in litres per minute?`],
      [qty(round(co, 2), '升／分鐘', 'L/min'), qty(round(hr * sv, 0), '升／分鐘', 'L/min'), qty(round(sv / hr, 3), '升／分鐘', 'L/min'), qty(round((hr + sv) / 1000, 3), '升／分鐘', 'L/min')],
      [`心輸出量 = 心率 × 每搏輸出量 = ${hr} × ${sv} = ${hr * sv} 毫升／分鐘 = ${round(co, 2)} 升／分鐘。運動時心輸出量上升，既靠心率加快，也靠每搏輸出量增加；長期耐力訓練主要提高後者，因此運動員的靜息心率較低。陷阱：${hr * sv} 漏了把毫升換算成升；${round(sv / hr, 3)} 升／分鐘把兩者相除；${round((hr + sv) / 1000, 3)} 升／分鐘把兩者相加。`,
       `Cardiac output = heart rate × stroke volume = ${hr} × ${sv} = ${hr * sv} mL/min = ${round(co, 2)} L/min. During exercise cardiac output rises through both a faster rate and a larger stroke volume; endurance training mainly raises the latter, which is why athletes have low resting heart rates. Traps: ${hr * sv} omits the conversion from millilitres to litres; ${round(sv / hr, 3)} L/min divides the two; ${round((hr + sv) / 1000, 3)} L/min adds them.`])
  }
}

export const peBankQuestions: Question[] = pe.bank

// ── 生物：數據與生態 ──────────────────────────────────────────────────────

const bioT = { data: { id: 'bio_data_ecology', zh: '數據與生態', en: 'Data & ecology' } } satisfies Record<string, TopicMeta>
const bioFW = { data: { id: 'data', zh: '數據判讀', en: 'Data handling', emoji: '📊' } } satisfies Record<string, FwMeta>
const bio = createBank('biology')

// BI1 — 種群密度 = 個體數 ÷ 面積
for (const area of [20, 25, 40, 50, 80]) {
  for (const density of [3, 6, 12, 25]) {
    const count = area * density
    bio.add(`biob_bi1_${area}_${density}`, bioT.data, bioFW.data, 'easy',
      [`在一片 ${area} 平方米的草地上共數得 ${count} 株某種植物。該植物的種群密度是每平方米多少株？`,
       `A total of ${count} individuals of a plant species are counted in a ${area} m² plot of grassland. What is the population density per square metre?`],
      [qty(density, '株／平方米', 'per m²'), qty(count, '株／平方米', 'per m²'), qty(round(area / count, 3), '株／平方米', 'per m²'), qty(count * area, '株／平方米', 'per m²')],
      [`種群密度 = 個體數 ÷ 面積 = ${count} ÷ ${area} = ${density} 株／平方米。以樣方估算密度時，樣方必須隨機選取，否則會系統性高估或低估。陷阱：${count} 株／平方米直接抄了總數；${round(area / count, 3)} 株／平方米把分子分母倒轉；${count * area} 株／平方米改成了相乘。`,
       `Population density = number of individuals ÷ area = ${count} ÷ ${area} = ${density} per m². When density is estimated from quadrats the quadrats must be placed randomly, or the estimate is systematically biased. Traps: ${count} per m² copies the raw total; ${round(area / count, 3)} per m² inverts the fraction; ${count * area} per m² multiplies instead.`])
  }
}

// BI2 — 標記重捕法（林肯指數）N = (M × C) ÷ R
for (const M of [40, 50, 60, 80, 100]) {
  for (const C of [40, 50, 60, 80]) {
    for (const R of [8, 10, 20]) {
      const N = (M * C) / R
      if (!Number.isInteger(N) || R > C) continue
      bio.add(`biob_bi2_${M}_${C}_${R}`, bioT.data, bioFW.data, R === 10 ? 'medium' : 'hard',
        [`以標記重捕法估算池中魚的數目：首次捕獲並標記 ${M} 條後放回；第二次捕獲 ${C} 條，其中 ${R} 條帶有標記。估計池中魚的總數是多少？`,
         `The mark-and-recapture method is used to estimate a fish population: ${M} fish are caught, marked and released; a second sample of ${C} fish contains ${R} marked individuals. What is the estimated total population?`],
        [qty(N, '條', 'fish'), qty(M + C - R, '條', 'fish'), qty(round((M * R) / C, 1), '條', 'fish'), qty(M * C, '條', 'fish')],
        [`標記重捕法假設標記個體在種群中均勻混合，故第二次樣本中帶標記的比例等於種群中被標記的比例：$\\dfrac{R}{C} = \\dfrac{M}{N}$，即 $N = \\dfrac{M \\times C}{R} = \\dfrac{${M} \\times ${C}}{${R}} = ${N}$ 條。此法要求標記不影響存活率、期間無大量遷入遷出。陷阱：${M + C - R} 條把兩次樣本相加再扣重複，忽略了未被捕獲的個體；${round((M * R) / C, 1)} 條把 $C$ 與 $R$ 的位置調轉；${M * C} 條漏了除以 ${R}。`,
         `Mark-and-recapture assumes marked individuals mix evenly, so the marked proportion in the second sample equals the marked proportion of the population: $\\frac{R}{C} = \\frac{M}{N}$, giving $N = \\frac{M \\times C}{R} = \\frac{${M} \\times ${C}}{${R}} = ${N}$. The method requires that marking does not affect survival and that migration is negligible. Traps: ${M + C - R} adds the two samples and removes the overlap, ignoring the individuals never caught; ${round((M * R) / C, 1)} interchanges $C$ and $R$; ${M * C} omits the division by ${R}.`])
    }
  }
}

// BI3 — 營養級之間的能量傳遞效率
for (const lower of [10000, 20000, 50000, 80000]) {
  for (const pct of [5, 10, 15, 20]) {
    const upper = (lower * pct) / 100
    bio.add(`biob_bi3_${lower}_${pct}`, bioT.data, bioFW.data, 'medium',
      [`某生態系統中，生產者固定的能量為 ${fmt(lower)} 千焦，第一營養級消費者所獲得的能量為 ${fmt(upper)} 千焦。兩者之間的能量傳遞效率是多少？`,
       `In an ecosystem, producers fix ${fmt(lower)} kJ of energy and the primary consumers obtain ${fmt(upper)} kJ. What is the energy transfer efficiency between these two trophic levels?`],
      [n(`${pct}%`), n(`${round((lower / upper) * 100, 1)}%`), n(`${round(((lower - upper) / lower) * 100, 1)}%`), n(`${fmt(lower - upper)}%`)],
      [`能量傳遞效率 = 上一營養級獲得的能量 ÷ 下一營養級固定的能量 × 100% = ${fmt(upper)} ÷ ${fmt(lower)} × 100% = ${pct}%。能量在營養級之間大量流失，主要因為呼吸作用散失為熱、部分生物量未被取食、以及排遺與死亡的部分被分解者利用；這正是食物鏈通常不超過四至五個營養級的原因。陷阱：${round((lower / upper) * 100, 1)}% 把分子分母倒轉；${round(((lower - upper) / lower) * 100, 1)}% 算的是流失率；${fmt(lower - upper)}% 把能量差值當成百分率。`,
       `Energy transfer efficiency = energy gained by the higher level ÷ energy fixed by the lower level × 100% = ${fmt(upper)} ÷ ${fmt(lower)} × 100% = ${pct}%. Most energy is lost between trophic levels through respiratory heat, uneaten biomass, and faeces and dead matter passed to decomposers, which is why food chains rarely exceed four or five levels. Traps: ${round((lower / upper) * 100, 1)}% inverts the fraction; ${round(((lower - upper) / lower) * 100, 1)}% is the loss rate; ${fmt(lower - upper)}% treats the energy difference as a percentage.`])
  }
}

export const biologyBankQuestions: Question[] = bio.bank

// ── 音樂：樂理・音程與調號 ────────────────────────────────────────────────
//
// 音程的音名由【字母級數】與【半音數】兩者共同決定，兩者缺一不可 ——
// 這正是本課題最常見的失分位：學生只數半音，於是把增二度寫成小三度。
// 以下按字母級數推出目標字母，再由半音數推出所需的變化記號，
// 只在變化記號落在 ♭／本位／♯ 之內時出題，避免出現重升重降等超綱寫法。

const musT = { theory: { id: 'mus_theory_intervals', zh: '樂理・音程與調號', en: 'Theory — intervals & keys' } } satisfies Record<string, TopicMeta>
const musFW = { apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' } } satisfies Record<string, FwMeta>
const mus = createBank('music')

const LET = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const NATPC = [0, 2, 4, 5, 7, 9, 11]
const accSym = (a: number): string => (a === -1 ? '♭' : a === 1 ? '♯' : '')
const noteName = (li: number, a: number): string => `${LET[li]}${accSym(a)}`

type Interval = { zh: string; en: string; step: number; semi: number; minor: boolean }
const INTERVALS: Interval[] = [
  { zh: '小二度', en: 'minor 2nd', step: 1, semi: 1, minor: true },
  { zh: '大二度', en: 'major 2nd', step: 1, semi: 2, minor: false },
  { zh: '小三度', en: 'minor 3rd', step: 2, semi: 3, minor: true },
  { zh: '大三度', en: 'major 3rd', step: 2, semi: 4, minor: false },
  { zh: '完全四度', en: 'perfect 4th', step: 3, semi: 5, minor: false },
  { zh: '完全五度', en: 'perfect 5th', step: 4, semi: 7, minor: false },
  { zh: '小六度', en: 'minor 6th', step: 5, semi: 8, minor: true },
  { zh: '大六度', en: 'major 6th', step: 5, semi: 9, minor: false },
  { zh: '小七度', en: 'minor 7th', step: 6, semi: 10, minor: true },
  { zh: '大七度', en: 'major 7th', step: 6, semi: 11, minor: false },
]

const STARTS: [number, number][] = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0],
  [6, -1], [2, -1], [5, -1], [3, 1], [0, 1]]

// MU1 — 由起音與音程名稱求目標音
for (const [li, sa] of STARTS) {
  for (const iv of INTERVALS) {
    const ti = (li + iv.step) % 7
    const reqPc = (((NATPC[li] + sa + iv.semi) % 12) + 12) % 12
    let ta = (((reqPc - NATPC[ti]) % 12) + 12) % 12
    if (ta > 6) ta -= 12
    if (ta < -1 || ta > 1) continue
    const wrongQ = ta + (iv.minor ? 1 : -1) // 只數半音、把音程性質認錯
    if (wrongQ < -1 || wrongQ > 1) continue
    const start = noteName(li, sa), ans = noteName(ti, ta)
    const byLetterCount = noteName((li + iv.semi) % 7, 0) // 把半音數當成字母級數
    mus.add(`musb_mu1_${li}${sa + 1}_${iv.step}${iv.semi}`, musT.theory, musFW.apply, iv.step >= 5 ? 'hard' : iv.step <= 2 ? 'easy' : 'medium',
      [`${start} 的上方${iv.zh}是哪一個音？`, `What note lies a ${iv.en} above ${start}?`],
      [n(ans), n(noteName(ti, wrongQ)), n(byLetterCount), n(start)],
      [`音程要同時數【字母級數】與【半音數】。${iv.zh}跨越 ${iv.step + 1} 個字母（由 ${LET[li]} 數到 ${LET[ti]}），並含 ${iv.semi} 個半音。${start} 上方 ${iv.semi} 個半音的音高，寫在字母 ${LET[ti]} 上就是 ${ans}。陷阱：${noteName(ti, wrongQ)} 字母正確但半音數差一，即把${iv.zh}與${iv.minor ? '大' : '小'}的一級混淆；${byLetterCount} 把半音數誤當成字母級數去數；${start} 是起音本身。`,
       `An interval is defined by BOTH the number of letter names it spans and the number of semitones. A ${iv.en} spans ${iv.step + 1} letters (${LET[li]} up to ${LET[ti]}) and contains ${iv.semi} semitones. The pitch ${iv.semi} semitones above ${start}, spelt on the letter ${LET[ti]}, is ${ans}. Traps: ${noteName(ti, wrongQ)} has the right letter but is one semitone out, confusing the quality of the interval; ${byLetterCount} counts the semitone total as if it were letter steps; ${start} is the starting note itself.`])
  }
}

// MU2 — 五度圈：由升號或降號的數目辨認大調
const SHARP_KEYS = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯', 'C♯']
const FLAT_KEYS = ['C', 'F', 'B♭', 'E♭', 'A♭', 'D♭', 'G♭', 'C♭']
const REL_MINOR = ['A', 'E', 'B', 'F♯', 'C♯', 'G♯', 'D♯', 'A♯']
for (let k = 1; k <= 7; k++) {
  mus.add(`musb_mu2s_${k}`, musT.theory, musFW.apply, k <= 3 ? 'easy' : 'medium',
    [`調號有 ${k} 個升號的大調是哪一個？`, `Which major key has ${k} sharps in its key signature?`],
    [[`${SHARP_KEYS[k]} 大調`, `${SHARP_KEYS[k]} major`], [`${FLAT_KEYS[k]} 大調`, `${FLAT_KEYS[k]} major`],
     [`${SHARP_KEYS[k - 1]} 大調`, `${SHARP_KEYS[k - 1]} major`], [`${REL_MINOR[k]} 小調`, `${REL_MINOR[k]} minor`]],
    [`沿五度圈向上方純五度每走一格，調號便多一個升號：C → G → D → A → E → B → F♯ → C♯。走 ${k} 格即得 ${SHARP_KEYS[k]} 大調。陷阱：${FLAT_KEYS[k]} 大調是有 ${k} 個【降】號的調，方向相反；${SHARP_KEYS[k - 1]} 大調少數了一格；${REL_MINOR[k]} 小調與 ${SHARP_KEYS[k]} 大調共用同一個調號，但題目問的是大調。`,
     `Each step clockwise round the circle of fifths adds one sharp: C → G → D → A → E → B → F♯ → C♯. Taking ${k} steps gives ${SHARP_KEYS[k]} major. Traps: ${FLAT_KEYS[k]} major is the key with ${k} FLATS, the opposite direction; ${SHARP_KEYS[k - 1]} major is one step short; ${REL_MINOR[k]} minor shares the same key signature as ${SHARP_KEYS[k]} major, but the question asks for the major key.`])
  mus.add(`musb_mu2f_${k}`, musT.theory, musFW.apply, k <= 3 ? 'easy' : 'medium',
    [`調號有 ${k} 個降號的大調是哪一個？`, `Which major key has ${k} flats in its key signature?`],
    [[`${FLAT_KEYS[k]} 大調`, `${FLAT_KEYS[k]} major`], [`${SHARP_KEYS[k]} 大調`, `${SHARP_KEYS[k]} major`],
     [`${FLAT_KEYS[k - 1]} 大調`, `${FLAT_KEYS[k - 1]} major`], [`${FLAT_KEYS[k]} 小調`, `${FLAT_KEYS[k]} minor`]],
    [`沿五度圈向下方純五度每走一格，調號便多一個降號：C → F → B♭ → E♭ → A♭ → D♭ → G♭ → C♭。走 ${k} 格即得 ${FLAT_KEYS[k]} 大調。陷阱：${SHARP_KEYS[k]} 大調是有 ${k} 個【升】號的調；${FLAT_KEYS[k - 1]} 大調少數了一格；${FLAT_KEYS[k]} 小調是同名小調，調號並不相同。`,
     `Each step anticlockwise round the circle of fifths adds one flat: C → F → B♭ → E♭ → A♭ → D♭ → G♭ → C♭. Taking ${k} steps gives ${FLAT_KEYS[k]} major. Traps: ${SHARP_KEYS[k]} major is the key with ${k} SHARPS; ${FLAT_KEYS[k - 1]} major is one step short; ${FLAT_KEYS[k]} minor is the parallel minor and carries a different key signature.`])
}

export const musicBankQuestions: Question[] = mus.bank
