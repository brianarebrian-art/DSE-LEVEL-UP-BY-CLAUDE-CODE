import type { Question } from './types'
import { createBank, qty, round, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// biology-bank2.ts —— 生物參數化母模板・第二批（2026-09-03）
// ---------------------------------------------------------------------------
// 承接 biology-bank.ts。生物由 265 增至 649 條後，分佈仍是 22–97（4.4 倍）。
// 本檔【只】為每課題目標 91 條之下的七個課題出題，已達標的
// bio_data_ecology(97) 與 human_body(89) 一條不加。
//
// 生物常被視為純概念科目，但可 correct-by-construction 的部分不少：
//   遺傳推理    孟德爾比例、測交、性連鎖 —— 比例由配子組合直接算出
//   生態        十分之一能量遞減、營養級能量、族群指數增長
//   酶          反應速率與受質濃度、Q10 溫度係數
//   光合作用    限制因子下的淨光合速率、氣體交換量
//   生理因果鏈  心輸出量、腎小球濾過率、肺通氣量
//   細胞        表面積體積比、滲透濃度
//   營養與消化  能量攝取與消耗、營養素熱值
//
// ⚠️ 誘答必須互不相同【且在數學上不恆等】。ICT DC2 一役：誘答寫成
// Math.floor(Math.log2(n)) 與 bits - 1，兩者在非 2 次方時恆等，
// 十組全部靜默丟棄而肉眼審視不會發現。本檔每個模板寫完即以實測數字核對。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  glogic: { id: 'bio_genetics_logic', zh: '遺傳推理', en: 'Genetics — reasoning' },
  chain: { id: 'bio_physio_chain', zh: '生理機制・因果鏈', en: 'Physiological mechanisms — causal chains' },
  genetics: { id: 'genetics', zh: '遺傳', en: 'Genetics' },
  photo: { id: 'photosynthesis', zh: '光合作用', en: 'Photosynthesis' },
  eco: { id: 'ecology', zh: '生態', en: 'Ecology' },
  enzymes: { id: 'enzymes', zh: '酶', en: 'Enzymes' },
  coord: { id: 'coordination', zh: '神經與協調', en: 'Coordination' },
  digest: { id: 'digestion', zh: '營養與消化', en: 'Nutrition & Digestion' },
  cells: { id: 'cells', zh: '細胞', en: 'Cells' },
} satisfies Record<string, TopicMeta>

const FW = {
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
} satisfies Record<string, FwMeta>

const b = createBank('biology')

const distract = (correct: number, cands: number[]): number[] =>
  cands.filter((v, i, a) => v !== correct && a.indexOf(v) === i).slice(0, 3)

// ── 遺傳推理 ──────────────────────────────────────────────────────────────

// GL1 — 雜合子自交：顯性表現型的期望個體數 = 總數 × 3/4
for (const total of [16, 20, 24, 28, 32, 36, 40, 44, 48, 60, 64, 80, 100, 120, 160, 200, 240, 400]) {
  const dom = (total * 3) / 4
  if (!Number.isInteger(dom)) continue
  const d = distract(dom, [total / 4, total / 2, total])
  if (d.length < 3) continue
  b.add(`biob2_gl1_${total}`, T.glogic, FW.logic, 'easy',
    [`兩隻基因型同為 Aa 的個體交配，共產生 ${total} 個子代。理論上表現顯性性狀的子代有多少個？`,
     `Two individuals of genotype Aa are crossed and produce ${total} offspring. How many are expected to show the dominant phenotype?`],
    [qty(dom, '個', ''), ...d.map((v) => qty(v, '個', ''))],
    [`Aa × Aa 的子代基因型比例為 1 AA ∶ 2 Aa ∶ 1 aa。AA 與 Aa 都表現顯性，佔四分之三，故 $${total} \\times \\frac{3}{4} = ${dom}$ 個。答 $${total / 4}$ 是隱性個體數 —— 隱性只有 aa 一種基因型，而顯性有兩種，這正是 3∶1 而非 1∶1 的原因。`,
     `An Aa × Aa cross gives genotypes in the ratio 1 AA ∶ 2 Aa ∶ 1 aa. Both AA and Aa show the dominant phenotype, three quarters in all, so $${total} \\times \\frac{3}{4} = ${dom}$. Answering $${total / 4}$ gives the recessive count — recessives require the single genotype aa while dominants arise from two, which is why the ratio is 3∶1 and not 1∶1.`])
}

// GL2 — 測交：與隱性純合子雜交後顯性子代的比例
for (const total of [20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 150, 200, 300]) {
  const half = total / 2
  const d = distract(half, [total, total / 4, (total * 3) / 4])
  if (d.length < 3) continue
  b.add(`biob2_gl2_${total}`, T.glogic, FW.logic, 'medium',
    [`一株表現顯性性狀的植物與隱性純合子（aa）進行測交，得 ${total} 株子代。若該植物為雜合子（Aa），理論上有多少株子代表現隱性性狀？`,
     `A plant showing the dominant phenotype is test-crossed with a homozygous recessive (aa), giving ${total} offspring. If the plant is heterozygous (Aa), how many offspring are expected to show the recessive phenotype?`],
    [qty(half, '株', ''), ...d.map((v) => qty(v, '株', ''))],
    [`Aa × aa 的子代為 1 Aa ∶ 1 aa，隱性佔一半，故 $${total} \\div 2 = ${half}$ 株。測交的用意正在於此：若該植物是 AA，子代【全部】表現顯性；只要出現任何一株隱性子代，就足以斷定親本是雜合子。答 $${total / 4}$ 是把測交當成自交來計。`,
     `Aa × aa gives 1 Aa ∶ 1 aa, so half are recessive: $${total} \\div 2 = ${half}$. That is exactly the point of a test cross: an AA parent would give ALL dominant offspring, so a single recessive offspring is enough to prove the parent heterozygous. Answering $${total / 4}$ treats the test cross as a self-cross.`])
}

// GL3 — 雙因子雜交：9∶3∶3∶1 之中某一類的期望數
for (const total of [160, 240, 320, 400, 480, 560, 640, 720, 800, 880, 960, 1120, 1280, 1600, 3200]) {
  const nine = (total * 9) / 16
  if (!Number.isInteger(nine)) continue
  const one = total / 16
  const d = distract(nine, [one, (total * 3) / 16, total / 4])
  if (d.length < 3) continue
  b.add(`biob2_gl3_${total}`, T.glogic, FW.logic, 'hard',
    [`兩個雙雜合子（AaBb）交配，兩對等位基因獨立分配，共得 ${total} 個子代。理論上兩個性狀【均】表現顯性的子代有多少個？`,
     `Two dihybrids (AaBb) are crossed with the two gene pairs assorting independently, giving ${total} offspring. How many are expected to show the dominant phenotype for BOTH traits?`],
    [qty(nine, '個', ''), ...d.map((v) => qty(v, '個', ''))],
    [`兩對基因獨立分配，各自的顯性機率為 $\\frac{3}{4}$，同時顯性的機率為 $\\frac{3}{4} \\times \\frac{3}{4} = \\frac{9}{16}$，故 $${total} \\times \\frac{9}{16} = ${nine}$ 個。雙因子的 9∶3∶3∶1 並非新規則，而是兩次 3∶1 相乘的結果 —— 明白這一點，三對基因的比例也不必另行背誦。答 $${one}$ 是兩者【均】隱性的一類。`,
     `With independent assortment each pair is dominant with probability $\\frac{3}{4}$, so both together is $\\frac{3}{4} \\times \\frac{3}{4} = \\frac{9}{16}$, giving $${total} \\times \\frac{9}{16} = ${nine}$. The 9∶3∶3∶1 ratio is not a new rule but two 3∶1 ratios multiplied — grasp that and a three-gene ratio needs no separate memorising. Answering $${one}$ is the doubly recessive class.`])
}

// GL4 — 性連鎖：帶因母親與正常父親的男性子代患病比例
for (const sons of [20, 24, 30, 36, 40, 50, 60, 70, 80, 90, 100, 120, 160, 200, 240]) {
  const affected = sons / 2
  const d = distract(affected, [sons, sons / 4, 0])
  if (d.length < 3) continue
  b.add(`biob2_gl4_${sons}`, T.glogic, FW.logic, 'hard',
    [`一位帶因（X^A X^a）的母親與一位正常（X^A Y）的父親生育。若共有 ${sons} 名男性子代，理論上有多少名表現該隱性性連鎖性狀？`,
     `A carrier mother (X^A X^a) and an unaffected father (X^A Y) have children. Among ${sons} sons, how many are expected to show the recessive X-linked trait?`],
    [qty(affected, '名', ''), ...d.map((v) => qty(v, '名', ''))],
    [`男性只有一條 X 染色體，必定來自母親。母親的兩條 X 各佔一半機會，其中 X^a 會令兒子表現該性狀，故 $${sons} \\div 2 = ${affected}$ 名。父親的 Y 不帶對應基因，因此無法「遮蓋」隱性 —— 這正是隱性性連鎖性狀在男性遠較常見的原因。`,
     `A son has a single X, necessarily from his mother. Each of her two X chromosomes is equally likely, and X^a makes a son show the trait, so $${sons} \\div 2 = ${affected}$. The father's Y carries no matching allele and cannot mask the recessive — which is why recessive X-linked traits are far commoner in males.`])
}

// ── 生態 ──────────────────────────────────────────────────────────────────

// EC1 — 營養級之間約 10% 能量傳遞
for (const kj of [20000, 40000, 60000, 80000, 100000, 200000, 500000]) {
  for (const levels of [1, 2, 3]) {
    const out = kj / 10 ** levels
    if (!Number.isInteger(out)) continue
    const d = distract(out, [kj / (10 * levels), kj * 0.1 * levels, kj])
    if (d.length < 3) continue
    b.add(`biob2_ec1_${kj}_${levels}`, T.eco, FW.apply, 'medium',
      [`某食物鏈的生產者固定了 ${kj} kJ 能量，每經一個營養級約有 10% 能量傳遞至下一級。第 ${levels + 1} 營養級可獲得約多少 kJ？`,
       `Producers in a food chain fix ${kj} kJ of energy and about 10% passes to each successive trophic level. About how much energy reaches trophic level ${levels + 1}, in kJ?`],
      [qty(out, 'kJ', 'kJ'), ...d.map((v) => qty(v, 'kJ', 'kJ'))],
      [`每上一個營養級保留十分之一，經 ${levels} 次傳遞即乘以 $0.1^{${levels}}$：$${kj} \\div 10^{${levels}} = ${out}$ kJ。能量遞減是【連乘】而非連減 —— 這正是食物鏈通常不超過四至五級的原因：再往上，剩餘能量已不足以支持一個族群。答 $${kj / (10 * levels)}$ 把連乘誤作除以 $10 \\times ${levels}$。`,
       `Each level retains one tenth, so ${levels} transfers multiply by $0.1^{${levels}}$: $${kj} \\div 10^{${levels}} = ${out}$ kJ. The loss compounds rather than subtracts — which is why food chains rarely exceed four or five levels: beyond that the remaining energy cannot support a population. Answering $${kj / (10 * levels)}$ divides by $10 \\times ${levels}$ instead of compounding.`])
  }
}

// EC2 — 族群倍增：N = N0 × 2^世代數
for (const n0 of [50, 100, 200, 400, 800]) {
  for (const gen of [3, 4, 5, 6, 7]) {
    const finalN = n0 * 2 ** gen
    const d = distract(finalN, [n0 * 2 * gen, n0 + 2 ** gen, n0 * gen])
    if (d.length < 3) continue
    b.add(`biob2_ec2_${n0}_${gen}`, T.eco, FW.apply, 'medium',
      [`某細菌族群起始有 ${n0} 個個體，在資源不受限的條件下每一世代倍增一次。經 ${gen} 個世代後族群約有多少個個體？`,
       `A bacterial population starts with ${n0} individuals and doubles each generation under unlimited resources. About how many individuals are there after ${gen} generations?`],
      [qty(finalN, '個', ''), ...d.map((v) => qty(v, '個', ''))],
      [`每一世代乘以 2，${gen} 個世代即乘以 $2^{${gen}} = ${2 ** gen}$，故 $${n0} \\times ${2 ** gen} = ${finalN}$ 個。指數增長的特徵是【倍數固定而增量遞增】：由第 ${gen - 1} 到第 ${gen} 世代，單是這一步就增加了 $${n0 * 2 ** (gen - 1)}$ 個。答 $${n0 * 2 * gen}$ 把指數誤作乘法，得出的是線性增長。`,
       `Each generation multiplies by 2, so ${gen} generations multiply by $2^{${gen}} = ${2 ** gen}$, giving $${n0} \\times ${2 ** gen} = ${finalN}$. Exponential growth keeps the RATIO fixed while the INCREMENT grows: the step from generation ${gen - 1} to ${gen} alone adds $${n0 * 2 ** (gen - 1)}$. Answering $${n0 * 2 * gen}$ treats the exponent as a multiplier and describes linear growth.`])
  }
}

// ── 酶 ────────────────────────────────────────────────────────────────────

// EN1 — Q10 溫度係數：溫度每升 10°C 反應速率倍增（最適溫度以下）
for (const base of [2, 4, 5, 8, 10, 16, 20, 25]) {
  for (const rise of [10, 20, 30]) {
    const rate = base * 2 ** (rise / 10)
    const d = distract(rate, [base * (rise / 10), base + rise, base * rise])
    if (d.length < 3) continue
    b.add(`biob2_en1_${base}_${rise}`, T.enzymes, FW.apply, 'medium',
      [`某酶促反應在 20°C 時速率為每分鐘 ${base} 單位。在最適溫度以下，溫度每上升 10°C 速率約增加一倍。溫度升至 ${20 + rise}°C 時速率約為每分鐘多少單位？`,
       `An enzyme-catalysed reaction proceeds at ${base} units per minute at 20°C. Below the optimum, the rate roughly doubles for every 10°C rise. What is the approximate rate at ${20 + rise}°C, in units per minute?`],
      [qty(rate, '單位', 'units'), ...d.map((v) => qty(v, '單位', 'units'))],
      [`上升 ${rise}°C 即經歷 $${rise} \\div 10 = ${rise / 10}$ 次倍增，速率乘以 $2^{${rise / 10}} = ${2 ** (rise / 10)}$，得 $${base} \\times ${2 ** (rise / 10)} = ${rate}$ 單位。⚠️ 此規律【只適用於最適溫度以下】：越過最適溫度後酶會變性，速率不升反跌，屆時再套用倍增規律就會得出完全相反的結論。`,
       `A rise of ${rise}°C means $${rise} \\div 10 = ${rise / 10}$ doublings, multiplying the rate by $2^{${rise / 10}} = ${2 ** (rise / 10)}$ to give $${base} \\times ${2 ** (rise / 10)} = ${rate}$ units. NOTE this holds only BELOW the optimum: past it the enzyme denatures and the rate falls, so applying the doubling rule there gives exactly the wrong conclusion.`])
  }
}

// EN2 — 受質濃度加倍而酶已飽和：速率不變
for (const rate of [12, 15, 18, 20, 24, 30, 36, 40, 45, 50]) {
  const d = distract(rate, [rate * 2, rate / 2, rate * 4])
  if (d.length < 3) continue
  b.add(`biob2_en2_${rate}`, T.enzymes, FW.logic, 'hard',
    [`某酶促反應在受質過量的條件下達到最大速率 ${rate} 單位／分鐘。若再把受質濃度加倍而酶量不變，反應速率約為每分鐘多少單位？`,
     `An enzyme-catalysed reaction reaches its maximum rate of ${rate} units per minute with substrate in excess. If the substrate concentration is doubled while the enzyme amount is unchanged, what is the approximate rate, in units per minute?`],
    [qty(rate, '單位', 'units'), ...d.map((v) => qty(v, '單位', 'units'))],
    [`受質已經過量，代表所有酶的活性部位在任何一刻都被佔用 —— 此時的限制因素是【酶的數目】而非受質。再加受質不會有任何酶去處理它，速率維持 ${rate} 單位／分鐘。答 $${rate * 2}$ 是把「加倍受質」與「加倍速率」直接掛鉤，忽略了飽和這個前提。若要提升速率，必須增加酶量。`,
     `With substrate already in excess, every active site is occupied at any instant, so the limiting factor is the AMOUNT OF ENZYME, not the substrate. Adding more substrate leaves no free enzyme to act on it and the rate stays at ${rate} units per minute. Answering $${rate * 2}$ links doubled substrate to a doubled rate and ignores saturation. Raising the rate requires more enzyme.`])
}

// ── 光合作用 ──────────────────────────────────────────────────────────────

// PH1 — 淨光合速率 = 總光合速率 − 呼吸速率
for (const gross of [20, 25, 30, 35, 40, 45, 50, 60, 70, 80]) {
  for (const resp of [4, 6, 8, 10]) {
    const net = gross - resp
    const d = distract(net, [gross + resp, gross, resp])
    if (d.length < 3) continue
    b.add(`biob2_ph1_${gross}_${resp}`, T.photo, FW.apply, 'easy',
      [`某植物的總光合速率為每小時吸收二氧化碳 ${gross} 單位，同期呼吸作用釋出二氧化碳 ${resp} 單位。淨二氧化碳吸收量為每小時多少單位？`,
       `A plant photosynthesises at a gross rate of ${gross} units of carbon dioxide taken up per hour while respiration releases ${resp} units over the same period. What is the net carbon dioxide uptake per hour?`],
      [qty(net, '單位', 'units'), ...d.map((v) => qty(v, '單位', 'units'))],
      [`淨吸收 = 總光合 − 呼吸 = $${gross} - ${resp} = ${net}$ 單位。實驗量度到的一律是【淨值】，因為兩個過程同時進行；要求總光合速率，就必須另行量度黑暗中的呼吸速率再加回去。答 $${gross + resp}$ 把兩者相加，方向錯了 —— 呼吸釋出二氧化碳，正正抵銷光合的吸收。`,
       `Net uptake = gross photosynthesis − respiration = $${gross} - ${resp} = ${net}$ units. Any measurement gives the NET figure because both processes run at once; obtaining the gross rate requires measuring respiration separately in darkness and adding it back. Answering $${gross + resp}$ adds them, which is the wrong direction — respiration releases carbon dioxide and offsets the uptake.`])
  }
}

// PH2 — 限制因子：提高非限制因子不會改變速率
for (const rate of [15, 18, 20, 24, 28, 30, 36, 42, 48]) {
  const d = distract(rate, [rate * 2, rate + 10, 0])
  if (d.length < 3) continue
  b.add(`biob2_ph2_${rate}`, T.photo, FW.logic, 'hard',
    [`某植物在低光強度下的光合速率為 ${rate} 單位／小時，此時光強度為限制因子。若把二氧化碳濃度提高一倍而光強度不變，光合速率約為每小時多少單位？`,
     `A plant photosynthesises at ${rate} units per hour under low light, with light intensity as the limiting factor. If the carbon dioxide concentration is doubled while light intensity is unchanged, what is the approximate rate per hour?`],
    [qty(rate, '單位', 'units'), ...d.map((v) => qty(v, '單位', 'units'))],
    [`限制因子的定義是：在眾多因素之中，【數量最不足】的那一個決定了整體速率。此處光強度不足，二氧化碳並不短缺；再加二氧化碳，光反應仍然供應不到足夠的還原力去用它，速率維持 ${rate} 單位／小時。答 $${rate * 2}$ 假設任何因素加倍都會令速率加倍 —— 若如此，速率便可無限提升，明顯不合理。`,
     `A limiting factor is, by definition, the one in SHORTEST supply among several, and it sets the overall rate. Here light is short while carbon dioxide is not; adding more carbon dioxide still leaves the light reactions unable to supply enough reducing power to use it, so the rate stays at ${rate} units per hour. Answering $${rate * 2}$ assumes doubling any factor doubles the rate — which would make the rate unboundedly improvable, plainly unreasonable.`])
}

// ── 生理機制・因果鏈 ──────────────────────────────────────────────────────

// CH1 — 心輸出量 = 心搏量 × 心率
for (const stroke of [55, 60, 65, 70, 75, 80, 85, 90, 95]) {
  for (const hr of [60, 70, 72, 80, 100]) {
    const co = (stroke * hr) / 1000
    const r = Math.round(co * 100) / 100
    const d = distract(r, [stroke * hr, Math.round((stroke + hr) / 10) / 100, Math.round((r / 2) * 100) / 100])
    if (d.length < 3) continue
    b.add(`biob2_ch1_${stroke}_${hr}`, T.chain, FW.apply, 'medium',
      [`某人的心搏量為 ${stroke} 毫升，心率為每分鐘 ${hr} 次。其心輸出量為每分鐘多少公升？`,
       `A person has a stroke volume of ${stroke} mL and a heart rate of ${hr} beats per minute. What is the cardiac output in litres per minute?`],
      [qty(r, '公升', 'L'), ...d.map((v) => qty(v, '公升', 'L'))],
      [`心輸出量 = 心搏量 × 心率 = $${stroke} \\times ${hr} = ${stroke * hr}$ 毫升／分鐘，除以 1000 得 ${r} 公升／分鐘。運動時心輸出量上升，靠的是這兩個因素【同時】增加，所以升幅是相乘而非相加 —— 這正是訓練有素者靜息心率偏低卻不影響供血的原因：心搏量補足了。`,
       `Cardiac output = stroke volume × heart rate = $${stroke} \\times ${hr} = ${stroke * hr}$ mL per minute, or ${r} L per minute. During exercise both factors rise TOGETHER, so the increase multiplies rather than adds — which is also why a trained person's low resting heart rate does not reduce blood supply: the stroke volume compensates.`])
  }
}

// CH2 — 肺通氣量 = 潮氣量 × 呼吸頻率
for (const tidal of [400, 450, 500, 550, 600]) {
  for (const bpm of [12, 14, 15, 16, 20]) {
    const v = (tidal * bpm) / 1000
    const r = Math.round(v * 100) / 100
    const d = distract(r, [tidal * bpm, Math.round((r * 2) * 100) / 100, Math.round((tidal / bpm) * 100) / 100])
    if (d.length < 3) continue
    b.add(`biob2_ch2_${tidal}_${bpm}`, T.chain, FW.apply, 'medium',
      [`某人的潮氣量為 ${tidal} 毫升，呼吸頻率為每分鐘 ${bpm} 次。其肺通氣量為每分鐘多少公升？`,
       `A person has a tidal volume of ${tidal} mL and breathes ${bpm} times per minute. What is the pulmonary ventilation in litres per minute?`],
      [qty(r, '公升', 'L'), ...d.map((v2) => qty(v2, '公升', 'L'))],
      [`肺通氣量 = 潮氣量 × 呼吸頻率 = $${tidal} \\times ${bpm} = ${tidal * bpm}$ 毫升／分鐘，即 ${r} 公升／分鐘。要留意這是【進入呼吸道】的空氣量，其中約 150 毫升每次停留在無效腔而不參與氣體交換 —— 故此深而慢的呼吸，比淺而快的更有效，即使兩者的肺通氣量相同。`,
       `Pulmonary ventilation = tidal volume × breathing rate = $${tidal} \\times ${bpm} = ${tidal * bpm}$ mL per minute, that is ${r} L per minute. Note this is the air entering the AIRWAYS; about 150 mL per breath stays in the dead space and never exchanges gas — which is why deep slow breathing is more effective than shallow rapid breathing even at the same ventilation figure.`])
  }
}

// ── 神經與協調 ────────────────────────────────────────────────────────────

// CO1 — 神經衝動傳導時間 = 距離 ÷ 傳導速度
for (const cm of [20, 40, 60, 90, 120, 150]) {
  for (const speed of [30, 60, 120]) {
    const ms = (cm / 100 / speed) * 1000
    const r = Math.round(ms * 100) / 100
    const d = distract(r, [Math.round(cm / speed * 100) / 100, Math.round(r * 10 * 100) / 100, Math.round((speed / cm) * 100) / 100])
    if (d.length < 3) continue
    b.add(`biob2_co1_${cm}_${speed}`, T.coord, FW.apply, 'hard',
      [`一條神經纖維長 ${cm} 厘米，神經衝動的傳導速度為每秒 ${speed} 米。衝動由一端傳至另一端約需多少毫秒？`,
       `A nerve fibre is ${cm} cm long and conducts impulses at ${speed} m per second. About how many milliseconds does an impulse take to travel its length?`],
      [qty(r, '毫秒', 'ms'), ...d.map((v3) => qty(v3, '毫秒', 'ms'))],
      [`先統一單位：${cm} 厘米 = ${cm / 100} 米。時間 = 距離 ÷ 速度 = $${cm / 100} \\div ${speed} = ${(cm / 100 / speed).toFixed(5)}$ 秒 = ${r} 毫秒。單位換算是本題唯一的難處：厘米與米差一百倍，秒與毫秒差一千倍，兩處都換錯就會相差十萬倍。有髓鞘纖維的跳躍式傳導正是把速度由每秒約 1 米提升至上百米的原因。`,
       `Convert units first: ${cm} cm = ${cm / 100} m. Time = distance ÷ speed = $${cm / 100} \\div ${speed} = ${(cm / 100 / speed).toFixed(5)}$ s = ${r} ms. Unit conversion is the whole difficulty here: centimetres and metres differ by a hundred, seconds and milliseconds by a thousand, and getting both wrong is a factor of a hundred thousand. Saltatory conduction in myelinated fibres is what raises the speed from about 1 m per second to hundreds.`])
  }
}

// ── 遺傳 ──────────────────────────────────────────────────────────────────

// GE1 — 減數分裂產生的配子種類數 = 2^雜合基因對數
for (const pairs of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 23]) {
  const kinds = 2 ** pairs
  const d = distract(kinds, [pairs * 2, pairs, 4 ** pairs])
  if (d.length < 3) continue
  b.add(`biob2_ge1_${pairs}`, T.genetics, FW.logic, 'medium',
    [`某個體有 ${pairs} 對獨立分配的雜合基因。理論上它可產生多少種不同的配子？`,
     `An individual is heterozygous at ${pairs} independently assorting gene pairs. How many genetically different gametes can it produce in theory?`],
    [qty(kinds, '種', ''), ...d.map((v) => qty(v, '種', ''))],
    [`每一對雜合基因在減數分裂時獨立分離，各給出兩種可能，${pairs} 對互相獨立，故配子種類為 $2^{${pairs}} = ${kinds}$ 種。答 $${pairs * 2}$ 把次方誤作乘二 —— 兩者在一對時同為 2、兩對時分別為 4 與 4，要到三對才分道揚鑣，正是這個巧合令錯誤公式不易被發現。人類有 23 對，故配子種類為 $2^{23}$，這還未計交叉互換。`,
     `Each heterozygous pair segregates independently and offers two possibilities, so ${pairs} independent pairs give $2^{${pairs}} = ${kinds}$ gamete types. Answering $${pairs * 2}$ treats the exponent as a doubling — the two agree at one pair and again at two, and only diverge at three, which is why the wrong rule survives unnoticed. Humans have 23 pairs, giving $2^{23}$ types before crossing over is even counted.`])
}

// GE2 — 減數分裂後配子的染色體數 = 體細胞的一半
for (const diploid of [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 52, 56, 60, 64, 70, 78]) {
  const haploid = diploid / 2
  // ⚠️ 誘答不可寫 haploid * 4：它【恆等於】diploid * 2，兩個誘答其實
  // 是同一個數，去重後只剩兩個，整組十七條靜默丟棄（首次撰寫實測產出 0）。
  // 這與 ICT DC2 是同一形狀：字面不同而數學上恆等，肉眼審視不會發現。
  const d = distract(haploid, [diploid, diploid * 2, haploid + 2])
  if (d.length < 3) continue
  b.add(`biob2_ge2_${diploid}`, T.genetics, FW.logic, 'easy',
    [`某物種的體細胞含 ${diploid} 條染色體。經減數分裂形成的一個配子含多少條染色體？`,
     `A somatic cell of a species contains ${diploid} chromosomes. How many chromosomes are in one gamete formed by meiosis?`],
    [qty(haploid, '條', ''), ...d.map((v) => qty(v, '條', ''))],
    [`減數分裂使染色體數目減半，故配子含 $${diploid} \\div 2 = ${haploid}$ 條。這個減半是必需的：受精時兩個配子結合，${haploid} + ${haploid} 恰好回復 ${diploid} 條。若配子仍是 ${diploid} 條，每一代的染色體數目都會翻一倍。答 $${diploid}$ 是有絲分裂的結果 —— 有絲分裂維持數目，減數分裂減半，兩者的用途正好相反。`,
     `Meiosis halves the chromosome number, so a gamete carries $${diploid} \\div 2 = ${haploid}$. The halving is essential: at fertilisation two gametes fuse and ${haploid} + ${haploid} restores ${diploid}. Were gametes to keep ${diploid}, the number would double every generation. Answering $${diploid}$ describes MITOSIS — mitosis preserves the number and meiosis halves it, and their purposes are exactly opposite.`])
}

// CO2 — 反射弧總延擱時間 = 突觸數目 × 每個突觸延擱
for (const synapses of [2, 3, 4, 5, 6, 8]) {
  for (const delay of [0.5, 0.7, 1]) {
    const total = Math.round(synapses * delay * 100) / 100
    const d = distract(total, [synapses, delay, Math.round((synapses + delay) * 100) / 100])
    if (d.length < 3) continue
    b.add(`biob2_co2_${synapses}_${String(delay).replace('.', 'p')}`, T.coord, FW.apply, 'medium',
      [`一條反射弧中有 ${synapses} 個突觸，每個突觸的傳遞延擱約 ${delay} 毫秒。突觸傳遞合共造成多少毫秒延擱？`,
       `A reflex arc contains ${synapses} synapses, each introducing a delay of about ${delay} ms. What is the total synaptic delay, in milliseconds?`],
      [qty(total, '毫秒', 'ms'), ...d.map((v) => qty(v, '毫秒', 'ms'))],
      [`總延擱 = 突觸數 × 每個延擱 = $${synapses} \\times ${delay} = ${total}$ 毫秒。突觸延擱源於神經遞質的釋放、擴散與受體結合 —— 這是化學過程，比沿軸突的電傳導慢得多。這正是最簡單的反射弧只用兩至三個神經元的原因：每多一個突觸，反應就慢一點，而反射的價值正在於快。`,
       `Total delay = number of synapses × delay each = $${synapses} \\times ${delay} = ${total}$ ms. Synaptic delay comes from transmitter release, diffusion and receptor binding — a chemical process, far slower than electrical conduction along an axon. That is exactly why the simplest reflex arcs use only two or three neurones: every extra synapse costs time, and speed is the whole point of a reflex.`])
  }
}

// ── 營養與消化 ────────────────────────────────────────────────────────────

// DG1 — 三大營養素熱值：碳水化合物與蛋白質各 17 kJ/g，脂肪 38 kJ/g
for (const carb of [20, 30, 40, 50, 60, 80, 100]) {
  for (const fat of [5, 10, 15, 20, 25]) {
    const kj = carb * 17 + fat * 38
    const d = distract(kj, [(carb + fat) * 17, (carb + fat) * 38, carb * 38 + fat * 17])
    if (d.length < 3) continue
    b.add(`biob2_dg1_${carb}_${fat}`, T.digest, FW.apply, 'medium',
      [`一份食物含碳水化合物 ${carb} 克、脂肪 ${fat} 克，不含蛋白質。若碳水化合物的熱值為每克 17 kJ、脂肪為每克 38 kJ，該食物可提供多少 kJ 能量？`,
       `A portion of food contains ${carb} g of carbohydrate and ${fat} g of fat, with no protein. Taking carbohydrate as 17 kJ per g and fat as 38 kJ per g, how much energy does it supply, in kJ?`],
      [qty(kj, 'kJ', 'kJ'), ...d.map((v) => qty(v, 'kJ', 'kJ'))],
      [`分別計算再相加：碳水化合物 $${carb} \\times 17 = ${carb * 17}$ kJ，脂肪 $${fat} \\times 38 = ${fat * 38}$ kJ，合共 ${kj} kJ。脂肪的熱值是碳水化合物的【兩倍多】，所以少量脂肪已可貢獻大量能量 —— 答 $${(carb + fat) * 17}$ 把兩者當成同一熱值相加，正是低估脂肪的典型做法。`,
       `Compute each and add: carbohydrate gives $${carb} \\times 17 = ${carb * 17}$ kJ and fat gives $${fat} \\times 38 = ${fat * 38}$ kJ, totalling ${kj} kJ. Fat carries MORE THAN TWICE the energy per gram, so a small mass of fat contributes a great deal — answering $${(carb + fat) * 17}$ treats both at the same value and is the classic way fat gets underestimated.`])
  }
}

// ── 細胞 ──────────────────────────────────────────────────────────────────

// CE1 — 立方體細胞的表面積體積比 = 6/邊長
for (const side of [1, 2, 3, 4, 5, 6, 8, 10, 12]) {
  const sa = 6 * side * side
  const vol = side ** 3
  const ratio = Math.round((sa / vol) * 100) / 100
  const d = distract(ratio, [sa, vol, Math.round((vol / sa) * 100) / 100])
  if (d.length < 3) continue
  b.add(`biob2_ce1_${side}`, T.cells, FW.logic, 'medium',
    [`一個立方體細胞的邊長為 ${side} 單位。其表面積與體積之比為多少？`,
     `A cube-shaped cell has sides of ${side} units. What is its surface-area-to-volume ratio?`],
    [qty(ratio, '', ''), ...d.map((v) => qty(v, '', ''))],
    [`表面積 = $6 \\times ${side}^2 = ${sa}$，體積 = $${side}^3 = ${vol}$，比值 = $${sa} \\div ${vol} = ${ratio}$。留意邊長增加時，表面積按【平方】增長而體積按【立方】增長，故比值【下降】。細胞不能無限長大，正是因為物質靠擴散進出而擴散只發生在表面：體積一大，表面就不夠用。`,
     `Surface area = $6 \\times ${side}^2 = ${sa}$ and volume = $${side}^3 = ${vol}$, so the ratio is $${sa} \\div ${vol} = ${ratio}$. As the side grows, surface area rises with the SQUARE while volume rises with the CUBE, so the ratio FALLS. Cells cannot grow without limit precisely because materials enter and leave by diffusion across the surface: enlarge the volume and the surface can no longer keep up.`])
}

export const biologyBank4Questions: Question[] = b.bank
