import type { Question } from './types'
import { createBank, qty, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// technology-living-bank2.ts —— 科技與生活參數化母模板・第二批（2026-09-03）
// ---------------------------------------------------------------------------
// 承接 technology-living-bank.ts。本科現為 481 條、分佈 24–66（2.8 倍）。
// 分佈本身不算失衡，問題純在總量：十個課題全部低於每課題 100 的目標，
// 故本檔為【全部十個】出題，而非只補最薄者。
//
// ⚠️ 兩條同日累積的教訓，本檔開工前先寫下：
//   ① 誘答必須互不相同【且代數上不恆等】（ICT DC2、生物 GE2 兩役：
//      字面不同而數值恆等，整組靜默丟棄，審視源碼不會發現）。
//   ② 每個迴圈變數【必須出現在題幹】，否則同一條題會被複製 n 次
//      （音樂 HA1 一役：十二個 root 出了十二條相同的題，撞題閘攔下）。
//   ③ 補量要用【值域夠寬的數值參數】，不要用固定枚舉表 —— 枚舉表項數
//      固定即產出封頂，擴闊迴圈也補不了量（音樂第一版只出到 152 條）。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  sci: { id: 'tl_food_textile_sci', zh: '食物與紡織科學', en: 'Food & textile science' },
  lifecycle: { id: 'lifecycle', zh: '生命週期營養', en: 'Lifecycle Nutrition' },
  foodsci: { id: 'food_science', zh: '食物科學', en: 'Food Science' },
  consumer: { id: 'consumer', zh: '消費與可持續', en: 'Consumer & Sustainability' },
  fashion: { id: 'fashion', zh: '成衣與時尚', en: 'Garments & Fashion' },
  safety: { id: 'food_safety', zh: '食物安全', en: 'Food Safety' },
  fibres: { id: 'fibres', zh: '纖維與布料', en: 'Fibres & Fabrics' },
  meal: { id: 'meal_planning', zh: '膳食計劃', en: 'Meal Planning' },
  nutrition: { id: 'nutrition', zh: '膳食營養素', en: 'Dietary Nutrients' },
  nutricalc: { id: 'tl_nutrition_calc', zh: '營養計算', en: 'Nutrition — calculation' },
} satisfies Record<string, TopicMeta>

const FW = {
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
} satisfies Record<string, FwMeta>

const b = createBank('technology-living')

const distract = (correct: number, cands: number[]): number[] =>
  cands.filter((v, i, a) => v !== correct && a.indexOf(v) === i).slice(0, 3)

// ── 食物與紡織科學 ────────────────────────────────────────────────────────

// SC1 — 布料縮水率：洗後長度 = 原長 × (1 − 縮水率)
for (const len of [100, 120, 150, 160, 180, 200, 220, 240, 250, 280, 300, 400]) {
  for (const shrink of [2, 3, 4, 5, 6, 8, 10, 12]) {
    const after = (len * (100 - shrink)) / 100
    if (!Number.isInteger(after)) continue
    const d = distract(after, [(len * shrink) / 100, len - shrink, len + after])
    if (d.length < 3) continue
    b.add(`tlb2_sc1_${len}_${shrink}`, T.sci, FW.apply, 'medium',
      [`一塊長 ${len} 厘米的布料，首次洗滌後縮水 ${shrink}%。洗後長度為多少厘米？`,
       `A piece of fabric ${len} cm long shrinks by ${shrink}% on its first wash. What is its length afterwards, in cm?`],
      [qty(after, '厘米', 'cm'), ...d.map((v) => qty(v, '厘米', 'cm'))],
      [`縮水 ${shrink}% 即保留 $100\\% - ${shrink}\\% = ${100 - shrink}\\%$，故 $${len} \\times ${100 - shrink}\\% = ${after}$ 厘米。答 $${(len * shrink) / 100}$ 是【縮去的長度】而非剩餘長度 —— 兩者互補。裁剪前預留縮水餘量正是為此：布料一旦縮短就無法回復，故寧可裁大再改小。`,
       `Shrinking ${shrink}% leaves $100\\% - ${shrink}\\% = ${100 - shrink}\\%$, so $${len} \\times ${100 - shrink}\\% = ${after}$ cm. Answering $${(len * shrink) / 100}$ gives the LENGTH LOST rather than what remains — the two are complements. Allowing for shrinkage before cutting exists for exactly this reason: fabric cannot be un-shrunk, so it is safer to cut large and take in.`])
  }
}

// SC2 — 烹調水分流失：熟重 = 生重 × (1 − 流失率)
for (const raw of [200, 250, 300, 400, 500, 600, 800]) {
  for (const loss of [10, 15, 20, 25, 30]) {
    const cooked = (raw * (100 - loss)) / 100
    if (!Number.isInteger(cooked)) continue
    const d = distract(cooked, [(raw * loss) / 100, raw, raw - loss])
    if (d.length < 3) continue
    b.add(`tlb2_sc2_${raw}_${loss}`, T.sci, FW.apply, 'medium',
      [`一塊 ${raw} 克的生肉烹調後流失 ${loss}% 水分。熟肉重量為多少克？`,
       `A ${raw} g piece of raw meat loses ${loss}% of its weight as water during cooking. What does the cooked meat weigh, in grams?`],
      [qty(cooked, '克', 'g'), ...d.map((v) => qty(v, '克', 'g'))],
      [`保留 $100\\% - ${loss}\\% = ${100 - loss}\\%$，故 $${raw} \\times ${100 - loss}\\% = ${cooked}$ 克。要留意流失的【只是水分】，蛋白質與礦物質基本留在肉中 —— 所以熟肉每克的蛋白質含量反而【上升】。營養標籤標明「以生重計」還是「以熟重計」，數字可以相差兩三成。`,
       `Retaining $100\\% - ${loss}\\% = ${100 - loss}\\%$ gives $${raw} \\times ${100 - loss}\\% = ${cooked}$ g. Note that only WATER is lost while protein and minerals stay behind — so protein per gram actually RISES in the cooked meat. Whether a nutrition label is stated on a raw or cooked basis can shift the figures by twenty or thirty per cent.`])
  }
}

// ── 生命週期營養 ──────────────────────────────────────────────────────────

// LC1 — 每日能量需求 = 基礎代謝率 × 活動系數
for (const bmr of [1200, 1300, 1400, 1500, 1600, 1800, 2000]) {
  for (const factorPct of [120, 140, 155, 175, 190]) {
    const need = (bmr * factorPct) / 100
    if (!Number.isInteger(need)) continue
    const d = distract(need, [bmr, need - bmr, bmr + factorPct])
    if (d.length < 3) continue
    b.add(`tlb2_lc1_${bmr}_${factorPct}`, T.lifecycle, FW.apply, 'medium',
      [`某人的基礎代謝率為每日 ${bmr} 千卡，其身體活動水平系數為 ${factorPct / 100}。其每日總能量需求為多少千卡？`,
       `A person has a basal metabolic rate of ${bmr} kcal per day and a physical activity level factor of ${factorPct / 100}. What is their total daily energy requirement, in kcal?`],
      [qty(need, '千卡', 'kcal'), ...d.map((v) => qty(v, '千卡', 'kcal'))],
      [`總能量需求 = 基礎代謝率 × 活動系數 = $${bmr} \\times ${factorPct / 100} = ${need}$ 千卡。基礎代謝率是【完全靜止】時維持生命所需，佔總需求六至七成；活動系數把日常走動、工作與運動一併計入。答 $${bmr}$ 是只計基礎代謝，等於假設此人整日臥床不動。`,
       `Total requirement = BMR × activity factor = $${bmr} \\times ${factorPct / 100} = ${need}$ kcal. The BMR covers staying alive at COMPLETE REST and accounts for sixty to seventy per cent of the total; the activity factor adds everyday movement, work and exercise. Answering $${bmr}$ counts the BMR alone, which assumes the person lies still all day.`])
  }
}

// LC2 — 孕期額外能量：總需求 = 平日需求 + 額外
for (const base of [1800, 2000, 2100, 2200, 2400]) {
  for (const extra of [200, 300, 350, 450, 500]) {
    const total = base + extra
    const d = distract(total, [base, extra, base - extra])
    if (d.length < 3) continue
    b.add(`tlb2_lc2_${base}_${extra}`, T.lifecycle, FW.apply, 'easy',
      [`一名孕婦平日的每日能量需求為 ${base} 千卡，孕期後段每日需額外 ${extra} 千卡。她在該階段的每日總需求為多少千卡？`,
       `A pregnant woman normally needs ${base} kcal a day and requires an extra ${extra} kcal daily in later pregnancy. What is her total daily requirement at that stage, in kcal?`],
      [qty(total, '千卡', 'kcal'), ...d.map((v) => qty(v, '千卡', 'kcal'))],
      [`總需求 = $${base} + ${extra} = ${total}$ 千卡。要留意「額外」是【增量】不是【倍數】：孕期需求並非加倍，坊間所謂「食兩人份」是誤解 —— 額外的 ${extra} 千卡大約只等於一份三文治加一杯牛奶。真正需要大幅增加的是蛋白質、鐵、葉酸與鈣，而非總熱量。`,
       `Total = $${base} + ${extra} = ${total}$ kcal. Note that "extra" is an INCREMENT, not a multiplier: pregnancy does not double the requirement, and "eating for two" is a misreading — the additional ${extra} kcal is roughly a sandwich and a glass of milk. What genuinely rises sharply is the need for protein, iron, folate and calcium rather than total energy.`])
  }
}

// ── 食物科學 ──────────────────────────────────────────────────────────────

// FS1 — 糖水濃度：糖量 = 總重 × 濃度
for (const total of [200, 240, 250, 300, 400, 480, 500, 600, 750, 800, 1000, 1200]) {
  for (const pct of [5, 10, 12, 15, 20, 25, 30, 40]) {
    const sugar = (total * pct) / 100
    if (!Number.isInteger(sugar)) continue
    const d = distract(sugar, [total - sugar, pct, total / pct])
    if (d.length < 3) continue
    b.add(`tlb2_fs1_${total}_${pct}`, T.foodsci, FW.apply, 'easy',
      [`配製 ${total} 克濃度為 ${pct}% 的糖溶液，需要多少克糖？`,
       `How many grams of sugar are needed to make ${total} g of a ${pct}% sugar solution?`],
      [qty(sugar, '克', 'g'), ...d.map((v) => qty(v, '克', 'g'))],
      [`糖量 = $${total} \\times ${pct}\\% = ${sugar}$ 克，其餘 $${total} - ${sugar} = ${total - sugar}$ 克為水。濃度按【總重】而非【水量】計算 —— 這是配製溶液最常見的錯誤：若把 ${sugar} 克糖加入 ${total} 克水，總重會變成 ${total + sugar} 克，濃度就不再是 ${pct}%。`,
       `Sugar = $${total} \\times ${pct}\\% = ${sugar}$ g, leaving $${total} - ${sugar} = ${total - sugar}$ g of water. Concentration is taken on the TOTAL mass, not the water — the commonest error in making up solutions: adding ${sugar} g of sugar to ${total} g of water gives ${total + sugar} g in all, and the concentration is no longer ${pct}%.`])
  }
}

// FS2 — 發酵：麵糰體積倍增
for (const start of [150, 200, 250, 300, 350, 400, 500, 600]) {
  for (const times of [2, 3]) {
    for (const rounds of [1, 2]) {
      const finalV = start * times ** rounds
      const d = distract(finalV, [start * times * rounds, start + times, start])
      if (d.length < 3) continue
      b.add(`tlb2_fs2_${start}_${times}_${rounds}`, T.foodsci, FW.logic, 'medium',
        [`一團體積 ${start} 立方厘米的麵糰，每次發酵後體積變為原來的 ${times} 倍，共發酵 ${rounds} 次。最終體積為多少立方厘米？`,
         `A dough of ${start} cm³ grows to ${times} times its volume at each proving, and is proved ${rounds} time(s). What is its final volume, in cm³?`],
        [qty(finalV, '立方厘米', 'cm³'), ...d.map((v) => qty(v, '立方厘米', 'cm³'))],
        [`每次乘以 ${times}，${rounds} 次即乘以 $${times}^{${rounds}} = ${times ** rounds}$，故 $${start} \\times ${times ** rounds} = ${finalV}$ 立方厘米。答 $${start * times * rounds}$ 把次方誤作乘法 —— 發酵是【連乘】：第二次發酵的起點是第一次的結果，不是原來的麵糰。`,
         `Each proving multiplies by ${times}, so ${rounds} provings multiply by $${times}^{${rounds}} = ${times ** rounds}$, giving $${start} \\times ${times ** rounds} = ${finalV}$ cm³. Answering $${start * times * rounds}$ treats the exponent as a multiplier — proving COMPOUNDS: the second proving starts from the result of the first, not from the original dough.`])
    }
  }
}

// ── 消費與可持續 ──────────────────────────────────────────────────────────

// CO1 — 單位價格比較
for (const priceA of [12, 18, 24, 30]) {
  for (const sizeA of [200, 250, 400, 500]) {
    const perHundred = Math.round((priceA / sizeA) * 100 * 100) / 100
    const d = distract(perHundred, [priceA, sizeA, Math.round((sizeA / priceA) * 100) / 100])
    if (d.length < 3) continue
    b.add(`tlb2_co1_${priceA}_${sizeA}`, T.consumer, FW.apply, 'easy',
      [`某產品售價 ${priceA} 元，淨重 ${sizeA} 克。其每 100 克單價為多少元？`,
       `A product costs $${priceA} for a net weight of ${sizeA} g. What is its price per 100 g?`],
      [qty(perHundred, '元', 'dollars'), ...d.map((v) => qty(v, '元', 'dollars'))],
      [`每 100 克單價 = $${priceA} \\div ${sizeA} \\times 100 = ${perHundred}$ 元。比較不同包裝的產品時，單價是唯一可比的基準 —— 大包裝【不一定】較便宜，尤其在促銷期間，小包裝的折扣往往更深。標價牌上的單位價格正是為此而設。`,
       `Price per 100 g = $${priceA} \\div ${sizeA} \\times 100 = ${perHundred}$. Unit price is the only comparable basis across pack sizes — the larger pack is NOT always cheaper, and during promotions the smaller one is often discounted harder. Unit pricing on shelf labels exists precisely for this.`])
  }
}

// CO2 — 折扣後售價
for (const price of [80, 120, 150, 200, 250, 300, 400, 500]) {
  for (const off of [10, 20, 25, 30, 40, 50]) {
    const after = (price * (100 - off)) / 100
    if (!Number.isInteger(after)) continue
    const d = distract(after, [(price * off) / 100, price - off, price])
    if (d.length < 3) continue
    b.add(`tlb2_co2_${price}_${off}`, T.consumer, FW.apply, 'easy',
      [`一件原價 ${price} 元的衣服以 ${off}% 折扣出售。折後售價為多少元？`,
       `A garment priced at $${price} is sold at ${off}% off. What is the discounted price?`],
      [qty(after, '元', 'dollars'), ...d.map((v) => qty(v, '元', 'dollars'))],
      [`折後 = $${price} \\times (100\\% - ${off}\\%) = ${price} \\times ${100 - off}\\% = ${after}$ 元。答 $${(price * off) / 100}$ 是【減去的金額】而非售價。留意香港常用的「${(100 - off) / 10} 折」與此處的「${off}% off」意思相同但表述相反 —— 前者說剩幾多，後者說減幾多，看錯一次就差一大截。`,
       `Discounted price = $${price} \\times (100\\% - ${off}\\%) = ${price} \\times ${100 - off}\\% = ${after}$. Answering $${(price * off) / 100}$ gives the AMOUNT TAKEN OFF rather than the price. Note that Hong Kong's "${(100 - off) / 10} 折" and "${off}% off" mean the same thing stated oppositely — one says what remains, the other what is removed, and confusing them is a large error.`])
  }
}

// ── 成衣與時尚 ────────────────────────────────────────────────────────────

// FA1 — 用布量 = 每件用量 × 件數 + 損耗
for (const perItem of [120, 150, 180, 200, 250]) {
  for (const items of [4, 5, 6, 8, 10, 12]) {
    for (const wastePct of [5, 10]) {
      const base = perItem * items
      const total = (base * (100 + wastePct)) / 100
      if (!Number.isInteger(total)) continue
      const d = distract(total, [base, (base * wastePct) / 100, base - (base * wastePct) / 100])
      if (d.length < 3) continue
      b.add(`tlb2_fa1_${perItem}_${items}_${wastePct}`, T.fashion, FW.apply, 'medium',
        [`製作一件衣服需用布 ${perItem} 厘米，共製 ${items} 件，另須預留 ${wastePct}% 作裁剪損耗。合共需要多少厘米布料？`,
         `Each garment needs ${perItem} cm of fabric and ${items} are to be made, with ${wastePct}% extra allowed for cutting waste. How many cm of fabric are needed in total?`],
        [qty(total, '厘米', 'cm'), ...d.map((v) => qty(v, '厘米', 'cm'))],
        [`基本用量 $${perItem} \\times ${items} = ${base}$ 厘米，加 ${wastePct}% 損耗即乘以 $${(100 + wastePct) / 100}$，得 ${total} 厘米。損耗是【加上去】不是【減下來】—— 排版時布料的邊角、對花與紗向都會浪費，預留不足就會在最後一件時發現布不夠，而那時已無法補回同一批布的顏色。`,
         `The base is $${perItem} \\times ${items} = ${base}$ cm; adding ${wastePct}% means multiplying by $${(100 + wastePct) / 100}$ for ${total} cm. The allowance is ADDED, not deducted — marker layout wastes fabric at edges, in pattern matching and in grain alignment, and under-ordering shows up on the last garment, by which time the exact dye lot can no longer be matched.`])
    }
  }
}

// ── 食物安全 ──────────────────────────────────────────────────────────────

// SA1 — 細菌倍增：菌數 = 起始 × 2^(時間 ÷ 倍增期)
for (const start of [100, 200, 500, 1000]) {
  for (const hours of [1, 2, 3, 4, 5, 6]) {
    for (const doubling of [20, 30]) {
      const gens = (hours * 60) / doubling
      if (!Number.isInteger(gens) || gens > 18) continue
      const finalN = start * 2 ** gens
      const d = distract(finalN, [start * 2 * gens, start * gens, start + gens])
      if (d.length < 3) continue
      b.add(`tlb2_sa1_${start}_${hours}_${doubling}`, T.safety, FW.apply, 'hard',
        [`食物中原有 ${start} 個細菌，在危險溫度範圍內每 ${doubling} 分鐘倍增一次。${hours} 小時後細菌數目為多少？`,
         `Food carries ${start} bacteria which double every ${doubling} minutes within the danger zone. How many bacteria are present after ${hours} hour(s)?`],
        [qty(finalN, '個', ''), ...d.map((v) => qty(v, '個', ''))],
        [`${hours} 小時 = ${hours * 60} 分鐘，可倍增 $${hours * 60} \\div ${doubling} = ${gens}$ 次，故 $${start} \\times 2^{${gens}} = ${finalN}$ 個。答 $${start * 2 * gens}$ 把指數誤作乘法。「食物不可在室溫放超過兩小時」這條規則的根據就在這裏 —— 增長是連乘的，多放一小時不是多一點，而是再翻幾番。`,
         `${hours} hour(s) is ${hours * 60} minutes, allowing $${hours * 60} \\div ${doubling} = ${gens}$ doublings, so $${start} \\times 2^{${gens}} = ${finalN}$. Answering $${start * 2 * gens}$ treats the exponent as a multiplier. The rule that food must not sit at room temperature beyond two hours rests on exactly this — growth compounds, so an extra hour is not a little more but several more doublings.`])
    }
  }
}

// ── 纖維與布料 ────────────────────────────────────────────────────────────

// FB1 — 混紡比例：某纖維的重量
for (const weight of [200, 250, 300, 400, 500, 600, 800]) {
  for (const pct of [20, 30, 35, 40, 60, 65, 70, 80]) {
    const part = (weight * pct) / 100
    if (!Number.isInteger(part)) continue
    const d = distract(part, [weight - part, pct, weight])
    if (d.length < 3) continue
    b.add(`tlb2_fb1_${weight}_${pct}`, T.fibres, FW.apply, 'easy',
      [`一件 ${weight} 克的衣物由混紡布料製成，其中棉佔 ${pct}%。該衣物含棉多少克？`,
       `A ${weight} g garment is made from a blend containing ${pct}% cotton. How many grams of cotton does it contain?`],
      [qty(part, '克', 'g'), ...d.map((v) => qty(v, '克', 'g'))],
      [`含棉量 = $${weight} \\times ${pct}\\% = ${part}$ 克，其餘 ${weight - part} 克為其他纖維。混紡的用意是取長補短：棉吸濕透氣但易皺易縮，聚酯挺身耐洗但不透氣，按比例混合可同時保留兩者的優點 —— 比例本身就是設計決定。`,
       `Cotton content = $${weight} \\times ${pct}\\% = ${part}$ g, leaving ${weight - part} g of other fibres. Blending trades strengths against weaknesses: cotton absorbs moisture and breathes but creases and shrinks, while polyester holds shape and washes well but does not breathe. The ratio itself is the design decision.`])
  }
}

// ── 膳食計劃 ──────────────────────────────────────────────────────────────

// MP1 — 份量換算：n 人份所需材料
for (const forN of [2, 3, 4, 6]) {
  for (const target of [6, 8, 9, 10, 12, 15, 20]) {
    if (target % forN !== 0) continue
    const scale = target / forN
    for (const amount of [150, 200, 250, 300]) {
      const need = amount * scale
      const d = distract(need, [amount, amount + scale, amount * target])
      if (d.length < 3) continue
      b.add(`tlb2_mp1_${forN}_${target}_${amount}`, T.meal, FW.apply, 'easy',
        [`一份 ${forN} 人份的食譜需用某材料 ${amount} 克。若要製作 ${target} 人份，需用該材料多少克？`,
         `A recipe for ${forN} servings calls for ${amount} g of an ingredient. How much is needed for ${target} servings?`],
        [qty(need, '克', 'g'), ...d.map((v) => qty(v, '克', 'g'))],
        [`放大倍數 = $${target} \\div ${forN} = ${scale}$，故需 $${amount} \\times ${scale} = ${need}$ 克。⚠️ 這條【線性放大】只適用於主要食材：調味料、香料與發酵劑往往不能同比例放大，因為它們的作用與濃度有關而非與份量成正比 —— 把辣椒粉乘以 ${scale} 通常會辣得無法入口。`,
         `The scaling factor is $${target} \\div ${forN} = ${scale}$, so $${amount} \\times ${scale} = ${need}$ g is needed. NOTE that linear scaling applies to BULK ingredients only: seasonings, spices and raising agents often cannot be scaled proportionally, because their effect depends on concentration rather than portion size — multiplying chilli powder by ${scale} is usually inedible.`])
    }
  }
}

// ── 膳食營養素 ────────────────────────────────────────────────────────────

// NU1 — 三大營養素供能百分比
for (const carbG of [200, 250, 300, 350, 400]) {
  for (const fatG of [50, 60, 70, 80, 90]) {
    const carbKcal = carbG * 4
    const fatKcal = fatG * 9
    const totalKcal = carbKcal + fatKcal
    const pct = Math.round((fatKcal / totalKcal) * 1000) / 10
    const d = distract(pct, [Math.round((carbKcal / totalKcal) * 1000) / 10, fatG, Math.round((fatG / (carbG + fatG)) * 1000) / 10])
    if (d.length < 3) continue
    b.add(`tlb2_nu1_${carbG}_${fatG}`, T.nutrition, FW.logic, 'hard',
      [`某人一日攝取碳水化合物 ${carbG} 克、脂肪 ${fatG} 克（不計蛋白質）。碳水化合物每克供 4 千卡、脂肪每克供 9 千卡。脂肪佔總能量的百分比為多少？`,
       `A person consumes ${carbG} g of carbohydrate and ${fatG} g of fat in a day, ignoring protein. Carbohydrate gives 4 kcal per g and fat 9 kcal per g. What percentage of total energy comes from fat?`],
      [qty(pct, '%', '%'), ...d.map((v) => qty(v, '%', '%'))],
      [`碳水供能 $${carbG} \\times 4 = ${carbKcal}$ 千卡，脂肪供能 $${fatG} \\times 9 = ${fatKcal}$ 千卡，合共 ${totalKcal} 千卡，脂肪佔 $${fatKcal} \\div ${totalKcal} \\times 100\\% = ${pct}\\%$。⚠️ 關鍵在於【按能量計而非按重量計】：脂肪只佔重量的 $${Math.round((fatG / (carbG + fatG)) * 1000) / 10}\\%$，卻佔能量的 ${pct}%，因為每克供能是碳水的兩倍多。膳食指引中的「脂肪不超過三成」指的一律是能量佔比。`,
       `Carbohydrate supplies $${carbG} \\times 4 = ${carbKcal}$ kcal and fat $${fatG} \\times 9 = ${fatKcal}$ kcal, totalling ${totalKcal} kcal, so fat provides $${fatKcal} \\div ${totalKcal} \\times 100\\% = ${pct}\\%$. The key is that this is BY ENERGY, not by weight: fat is only $${Math.round((fatG / (carbG + fatG)) * 1000) / 10}\\%$ of the mass yet ${pct}% of the energy, because each gram carries more than twice as much. Dietary guidelines capping fat at thirty per cent always mean the energy share.`])
  }
}

// ── 營養計算 ──────────────────────────────────────────────────────────────

// NC1 — 每份營養素含量 = 每 100 克含量 × 份量 ÷ 100
for (const per100 of [3, 5, 8, 12, 20, 30]) {
  for (const serving of [30, 50, 80, 150, 200]) {
    const amount = (per100 * serving) / 100
    if (!Number.isInteger(amount * 10)) continue
    const r = Math.round(amount * 10) / 10
    const d = distract(r, [per100, serving, Math.round((per100 * serving) * 10) / 10])
    if (d.length < 3) continue
    b.add(`tlb2_nc1_${per100}_${serving}`, T.nutricalc, FW.apply, 'easy',
      [`某食品的營養標籤標示每 100 克含蛋白質 ${per100} 克。食用 ${serving} 克該食品，攝取蛋白質多少克？`,
       `A food label states ${per100} g of protein per 100 g. How much protein is taken in from a ${serving} g portion?`],
      [qty(r, '克', 'g'), ...d.map((v) => qty(v, '克', 'g'))],
      [`攝取量 = $${per100} \\times ${serving} \\div 100 = ${r}$ 克。營養標籤在香港以【每 100 克】為法定基準，而包裝上另標的「每份」份量由廠商自訂 —— 比較兩個產品時必須先統一基準，否則一個標每 100 克、一個標每 30 克，數字看似相差很遠，實際可能相若。`,
       `Intake = $${per100} \\times ${serving} \\div 100 = ${r}$ g. Hong Kong labels use a statutory PER 100 g basis, while any "per serving" figure alongside is set by the manufacturer — so comparing two products requires putting them on the same basis first, or one labelled per 100 g against another per 30 g will look far apart when they are in fact similar.`])
  }
}

export const technologyLivingBank4Questions: Question[] = b.bank
