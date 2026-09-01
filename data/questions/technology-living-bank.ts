import type { Question } from './types'
import { createBank, n, qty, round, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// technology-living-bank.ts —— 科技與生活參數化母模板（2026-08-29）
// ---------------------------------------------------------------------------
// 第五批。tl_nutrition_calc 原有 66 條（全科最厚），完全不碰；
// 只為其餘九個介乎 10 至 43 條的課題出題。
//
// 撰寫前的迴圈估算（前四批的教訓：地理 RC1 一口氣多出 125 條落最厚的課題，
// 音樂 LI1 則因過濾器濾走四分三組合而少出三成——兩個方向都要先算）：
//   每組模板目標 20 至 40 條，令九個課題各自落在 45 至 70 之間。
//
// ⚠️ 選項含中文時一律寫明 [zh, en] 對，不可用 n()：n() 只適用於與語言無關的
//    字串，中文會原封不動流入 optionsEn（地理 IN1、音樂 EL2／IS2 三度觸閘）。
// ⚠️ 題幹的區分不可只靠大小寫或標點：normStem 會 toLowerCase() 並剝走標點。
// ⚠️ 數值範圍不可共用邊界：音樂 EL2 曾因相鄰速度術語共用 76 BPM，出現題幹
//    相同而正確答案互相否定的兩條題。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  sci: { id: 'tl_food_textile_sci', zh: '食物與紡織科學', en: 'Food & textile science' },
  fashion: { id: 'fashion', zh: '成衣與時尚', en: 'Garments & Fashion' },
  consumer: { id: 'consumer', zh: '消費與可持續', en: 'Consumer & Sustainability' },
  lifecycle: { id: 'lifecycle', zh: '生命週期營養', en: 'Lifecycle Nutrition' },
  meal: { id: 'meal_planning', zh: '膳食計劃', en: 'Meal Planning' },
  foodsci: { id: 'food_science', zh: '食物科學', en: 'Food Science' },
  safety: { id: 'food_safety', zh: '食物安全', en: 'Food Safety' },
  nutrition: { id: 'nutrition', zh: '膳食營養素', en: 'Nutrients' },
  fibres: { id: 'fibres', zh: '纖維與布料', en: 'Fibres & Fabrics' },
} satisfies Record<string, TopicMeta>

const FW = {
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
} satisfies Record<string, FwMeta>

const b = createBank('technology-living')
const distract = (correct: number, cands: number[]): number[] =>
  cands.filter((v, i, a) => v !== correct && a.indexOf(v) === i && Number.isFinite(v) && v > 0).slice(0, 3)

// ── 食物安全（目標約 36 條）────────────────────────────────────────────────

// FS1 — 危險溫度帶
for (const temp of [-2, 0, 2, 3, 6, 8, 12, 20, 28, 35, 42, 50, 55, 58, 63, 68, 75, 82]) {
  const inZone = temp >= 4 && temp <= 60
  b.add(`tlb_fs1_${temp}`, T.safety, FW.logic, temp <= 8 || temp >= 65 ? 'easy' : 'medium',
    [`食物在 ${temp}°C 存放。就細菌繁殖而言，此溫度屬於甚麼情況？`,
     `Food is held at ${temp}°C. What does this mean for bacterial growth?`],
    [inZone
      ? ['處於危險溫度帶（4°C 至 60°C）之內，細菌可迅速繁殖', 'it lies within the danger zone of 4°C to 60°C, where bacteria multiply rapidly']
      : ['處於危險溫度帶之外，細菌繁殖受到明顯抑制', 'it lies outside the danger zone, so bacterial growth is markedly slowed'],
     inZone
       ? ['處於危險溫度帶之外，細菌繁殖受到明顯抑制', 'it lies outside the danger zone, so bacterial growth is markedly slowed']
       : ['處於危險溫度帶（4°C 至 60°C）之內，細菌可迅速繁殖', 'it lies within the danger zone of 4°C to 60°C, where bacteria multiply rapidly'],
     ['細菌已被完全殺死，食物可無限期存放', 'all bacteria have been killed and the food keeps indefinitely'],
     ['溫度與細菌繁殖無關，只影響食物的口感', 'temperature does not affect bacterial growth, only texture']],
    [`危險溫度帶為 4°C 至 60°C，${temp}°C ${inZone ? '落在此範圍之內，細菌在此溫度下可於數小時內大量繁殖' : '在此範圍之外，繁殖速度大幅減慢'}。要留意兩點：一、低溫只是【抑制】而非殺滅，冷藏食物中的細菌仍然存活，回到室溫即恢復繁殖；二、危險溫度帶的上限 60°C 是保溫供餐的下限，並非殺菌溫度——殺滅大部分致病菌需要中心溫度達 75°C 並維持足夠時間。`,
     `The danger zone runs from 4°C to 60°C. At ${temp}°C the food ${inZone ? 'lies inside it, where bacteria can multiply enormously within hours' : 'lies outside it, so growth is greatly slowed'}. Two points matter. Chilling only SLOWS growth rather than killing: bacteria in refrigerated food survive and resume multiplying at room temperature. And 60°C is the minimum for hot holding, not a killing temperature — destroying most pathogens requires a core temperature of 75°C held for long enough.`])
}

// FS2 — 解凍與烹煮的中心溫度
for (const core of [52, 55, 58, 60, 63, 66, 68, 70, 72, 74, 75, 78, 80, 85]) {
  const safe = core >= 75
  b.add(`tlb_fs2_${core}`, T.safety, FW.apply, core === 75 ? 'hard' : 'medium',
    [`一份雞肉烹煮後中心溫度為 ${core}°C。就殺滅致病菌而言，此溫度是否足夠？`,
     `A portion of chicken reaches a core temperature of ${core}°C. Is this sufficient to destroy pathogens?`],
    [safe
      ? ['足夠，已達 75°C 或以上的建議中心溫度', 'yes: it has reached the recommended core temperature of 75°C or above']
      : ['不足夠，未達 75°C 的建議中心溫度', 'no: it has not reached the recommended core temperature of 75°C'],
     safe
       ? ['不足夠，未達 75°C 的建議中心溫度', 'no: it has not reached the recommended core temperature of 75°C']
       : ['足夠，已達 75°C 或以上的建議中心溫度', 'yes: it has reached the recommended core temperature of 75°C or above'],
     ['只要外表已經變色，中心溫度並不重要', 'the core temperature does not matter once the outside has changed colour'],
     ['只要烹煮時間夠長，中心溫度多少均可', 'any core temperature is acceptable provided cooking lasts long enough']],
    [`家禽的建議中心溫度為 75°C，${core}°C ${safe ? '已達標準' : '未達標準，仍有致病菌存活的風險'}。要留意「外表變色」並不可靠：厚身肉件的中心可以仍然偏低，故必須以探針量度【最厚部位的中心】。時間與溫度須並用——低於建議溫度時，延長時間並不能等量替代，因為部分致病菌在較低溫度下仍可存活。`,
     `The recommended core temperature for poultry is 75°C, and ${core}°C ${safe ? 'meets it' : 'falls short, so pathogens may survive'}. Note that colour is not a reliable guide: the centre of a thick piece can remain much cooler, so a probe must be used at the CENTRE OF THE THICKEST PART. Time and temperature work together, but longer cooking below the recommended temperature is not an equivalent substitute, since some pathogens survive at lower temperatures.`])
}

// ── 膳食計劃（目標約 36 條）────────────────────────────────────────────────

// MP1 — 每日能量分配
for (const total of [1600, 1800, 2000, 2200, 2400, 2600, 2800]) {
  for (const pct of [20, 25, 30, 35, 40]) {
    const kcal = (total * pct) / 100
    if (!Number.isInteger(kcal)) continue
    const d = distract(kcal, [total - kcal, total / pct, pct * 10])
    if (d.length < 3) continue
    b.add(`tlb_mp1_${total}_${pct}`, T.meal, FW.apply, pct <= 25 ? 'easy' : pct >= 40 ? 'hard' : 'medium',
      [`某人每日能量需要為 ${total} 千卡。若午餐佔全日能量的 ${pct}%，午餐應提供多少千卡？`,
       `A person needs ${total} kcal a day. If lunch provides ${pct}% of the daily energy, how many kcal should it supply?`],
      [qty(kcal, '千卡', 'kcal'), ...d.map((v) => qty(round(v, 1), '千卡', 'kcal'))],
      [`午餐能量 = $${total} \\times ${pct}\\% = ${kcal}$ 千卡。膳食計劃中，三餐的能量分配並無單一標準，但一般建議避免把過多能量集中於單一餐——尤其晚餐過量而其後活動量低，會令能量以脂肪形式儲存。答 ${total - kcal} 是其餘各餐的合計，並非題目所問。`,
       `Lunch energy = $${total} \\times ${pct}\\% = ${kcal}$ kcal. There is no single correct split between meals, but concentrating too much energy in one meal is generally discouraged — particularly a large evening meal followed by little activity, which favours storage as fat. Answering ${total - kcal} gives the total for the other meals, which is not what was asked.`])
  }
}

// MP2 — 三大營養素的能量佔比
for (const carb of [45, 50, 55, 60]) {
  for (const prot of [10, 15, 20]) {
    const fat = 100 - carb - prot
    if (fat < 15 || fat > 35) continue
    const opts: Array<[string, string]> = [
      [`碳水化合物 ${carb}%、蛋白質 ${prot}%、脂肪 ${fat}%`, `${carb}% carbohydrate, ${prot}% protein, ${fat}% fat`],
      [`碳水化合物 ${prot}%、蛋白質 ${carb}%、脂肪 ${fat}%`, `${prot}% carbohydrate, ${carb}% protein, ${fat}% fat`],
      [`碳水化合物 ${fat}%、蛋白質 ${prot}%、脂肪 ${carb}%`, `${fat}% carbohydrate, ${prot}% protein, ${carb}% fat`],
      [`碳水化合物 ${carb}%、蛋白質 ${fat}%、脂肪 ${prot}%`, `${carb}% carbohydrate, ${fat}% protein, ${prot}% fat`],
    ]
    b.add(`tlb_mp2_${carb}_${prot}`, T.meal, FW.logic, 'medium',
      [`某膳食中，碳水化合物供應全日能量的 ${carb}%，蛋白質供應 ${prot}%。若三者合計為 100%，脂肪佔多少？以下哪一組數字正確？`,
       `In a diet, carbohydrate supplies ${carb}% of the day's energy and protein ${prot}%. If the three together make 100%, what share comes from fat? Which set is correct?`],
      opts,
      [`脂肪佔比 = $100\\% - ${carb}\\% - ${prot}\\% = ${fat}\\%$。要留意此處計的是【能量】佔比而非【重量】佔比：脂肪每克提供的能量約為碳水化合物的兩倍多，故即使脂肪的重量遠少於碳水化合物，其能量佔比仍可達兩三成。把重量與能量混為一談，是本課題最常見的失分位。`,
       `Fat's share = $100\\% - ${carb}\\% - ${prot}\\% = ${fat}\\%$. Note that these are shares of ENERGY, not of WEIGHT: fat supplies more than twice the energy of carbohydrate per gram, so its energy share can reach twenty or thirty per cent even though it weighs far less. Confusing weight with energy is where this topic is most often lost.`])
  }
}

// ── 生命週期營養（目標約 32 條）────────────────────────────────────────────

const stages: Array<[string, string, string, string, string, string]> = [
  ['嬰兒期', 'infancy', '鐵', 'iron', '約六個月後母體儲備耗盡，須及時添加含鐵輔食', 'maternal stores run out at around six months, so iron-rich weaning foods are needed'],
  ['青春期', 'adolescence', '鈣', 'calcium', '骨質在此階段迅速積累，成年後難以補回', 'bone mass builds rapidly at this stage and is hard to recover later'],
  ['懷孕期', 'pregnancy', '葉酸', 'folate', '在受孕前後攝取足夠葉酸可降低神經管缺陷風險', 'adequate folate around conception lowers the risk of neural tube defects'],
  ['長者', 'older adults', '維生素 D', 'vitamin D', '戶外活動減少令皮膚合成不足，同時影響鈣的吸收', 'less time outdoors reduces synthesis in the skin and impairs calcium absorption'],
]
for (const [zh, en, nut, nutEn, why, whyEn] of stages) {
  for (const q of ['需求', '理由']) {
    const others = stages.filter((s) => s[2] !== nut).slice(0, 3)
    if (q === '需求') {
      b.add(`tlb_lc1_${en.slice(0, 6)}_n`, T.lifecycle, FW.logic, 'medium',
        [`在${zh}，哪一種營養素的需求相對其他人生階段特別突出？`,
         `In ${en}, which nutrient is in particularly high demand compared with other life stages?`],
        [[nut, nutEn], ...others.map((s) => [s[2], s[3]] as [string, string])],
        [`${zh}對${nut}的需求特別突出，原因是${why}。生命週期營養的核心概念是：營養需要並非一成不變，而是隨生理狀態改變——生長、懷孕、老化各有其特殊需求。答這類題應由【該階段的生理變化】推出所需營養素，而非死記配對。`,
         `${en.charAt(0).toUpperCase() + en.slice(1)} has a notably high requirement for ${nutEn} because ${whyEn}. The central idea of lifecycle nutrition is that requirements are not fixed but shift with physiological state — growth, pregnancy and ageing each impose their own demands. Reason from the PHYSIOLOGICAL CHANGE of the stage to the nutrient, rather than memorising pairings.`])
    } else {
      b.add(`tlb_lc1_${en.slice(0, 6)}_w`, T.lifecycle, FW.logic, 'hard',
        [`${zh}對${nut}需求較高，主要原因為何？`,
         `Why is the requirement for ${nutEn} higher in ${en}?`],
        [[why, whyEn],
         ['因為該階段的總能量需要下降，故須提高各種營養素的濃度', 'because total energy needs fall at this stage, so nutrient density must rise'],
         ['因為該營養素在此階段完全無法由膳食吸收，必須另行補充', 'because the nutrient cannot be absorbed from food at all at this stage'],
         ['因為該營養素會在此階段大量隨汗液流失', 'because large amounts are lost in sweat at this stage']],
        [`正確理由是：${why}。其餘選項的共通問題是把【特定的生理機制】換成籠統或錯誤的說法。答營養學的「為甚麼」題，須指出具體機制——是需求增加、吸收下降、儲備耗盡，抑或流失增加，四者的介入方法並不相同。`,
         `The correct reason is that ${whyEn}. The other options all replace a SPECIFIC physiological mechanism with something vague or simply wrong. A "why" question in nutrition requires the mechanism to be named: increased requirement, reduced absorption, depleted stores or increased losses — the four call for different interventions.`])
    }
  }
}

// ── 食物科學（目標約 30 條）────────────────────────────────────────────────

// FC1 — 烹調對維生素 C 的影響
for (const method of ['水煮', '蒸', '快炒', '烤焗', '微波']) {
  for (const time of ['短時間', '長時間']) {
    const loss = method === '水煮' ? (time === '長時間' ? '最多' : '較多') : time === '長時間' ? '中等' : '較少'
    const lossEn = loss === '最多' ? 'greatest' : loss === '較多' ? 'considerable' : loss === '中等' ? 'moderate' : 'least'
    b.add(`tlb_fc1_${method}_${time}`, T.foodsci, FW.logic, method === '水煮' ? 'easy' : time === '長時間' ? 'hard' : 'medium',
      [`以${method}方式${time}處理蔬菜，維生素 C 的損失相對如何？`,
       `Vegetables are cooked by ${method === '水煮' ? 'boiling' : method === '蒸' ? 'steaming' : method === '快炒' ? 'stir-frying' : method === '烤焗' ? 'baking' : 'microwaving'} for a ${time === '長時間' ? 'long' : 'short'} time. How does vitamin C loss compare?`],
      [[`損失${loss}`, `loss is ${lossEn}`],
       [`損失${loss === '最多' ? '最少' : '最多'}`, `loss is ${lossEn === 'greatest' ? 'least' : 'greatest'}`],
       ['完全沒有損失，維生素 C 不受熱力影響', 'there is no loss at all: vitamin C is unaffected by heat'],
       ['損失多少與烹調方式及時間均無關', 'loss depends on neither the method nor the time']],
      [`維生素 C 同時【怕熱】與【溶於水】，故損失量取決於受熱時間與接觸水量兩者。水煮兩項條件皆佔，損失最大；蒸與微波接觸水量少，快炒受熱時間短，損失相對較低。減少損失的實用做法：切後即煮、用水量減至最少、縮短烹煮時間，以及把煮菜的水一併用作湯底。`,
       `Vitamin C is both HEAT-SENSITIVE and WATER-SOLUBLE, so losses depend on the time heated and the amount of water contacted. Boiling involves both, giving the largest loss; steaming and microwaving use little water, and stir-frying is brief, so losses are lower. Practical measures: cook soon after cutting, use as little water as possible, keep cooking short, and use the cooking water in a soup.`])
  }
}

// ── 纖維與布料（目標約 30 條）──────────────────────────────────────────────

const fibres: Array<[string, string, string, string, string]> = [
  ['棉', 'cotton', '天然纖維素纖維', '吸濕性高、透氣、易皺、可高溫熨燙', 'a natural cellulose fibre: absorbent, breathable, creases easily, tolerates a hot iron'],
  ['羊毛', 'wool', '天然蛋白質纖維', '保暖、有彈性、遇熱水與摩擦會氈縮', 'a natural protein fibre: warm, elastic, felts with hot water and friction'],
  ['絲', 'silk', '天然蛋白質纖維', '光澤佳、柔軟、不耐鹼與陽光', 'a natural protein fibre: lustrous, soft, damaged by alkali and sunlight'],
  ['聚酯纖維', 'polyester', '合成纖維', '強韌、不易皺、吸濕性低、高溫會熔化', 'a synthetic fibre: strong, crease-resistant, low absorbency, melts at high temperature'],
  ['尼龍', 'nylon', '合成纖維', '極強韌、耐磨、吸濕性低、高溫會熔化', 'a synthetic fibre: very strong, abrasion-resistant, low absorbency, melts at high temperature'],
]
for (const [zh, en, cls, prop, propEn] of fibres) {
  for (const q of ['分類', '特性']) {
    const others = fibres.filter((f) => f[0] !== zh).slice(0, 3)
    if (q === '分類') {
      const clsOpts = [...new Set(fibres.map((f) => f[2]))]
      const rest = clsOpts.filter((c) => c !== cls)
      b.add(`tlb_fb1_${en}_c`, T.fibres, FW.logic, 'easy',
        [`${zh}屬於哪一類纖維？`, `To which class of fibre does ${en} belong?`],
        [[cls, cls === '天然纖維素纖維' ? 'natural cellulose fibre' : cls === '天然蛋白質纖維' ? 'natural protein fibre' : 'synthetic fibre'],
         [rest[0], rest[0] === '天然纖維素纖維' ? 'natural cellulose fibre' : rest[0] === '天然蛋白質纖維' ? 'natural protein fibre' : 'synthetic fibre'],
         [rest[1] ?? '再生纖維', 'regenerated fibre'],
         ['礦物纖維', 'mineral fibre']],
        [`${zh}屬${cls}。纖維分類決定了保養方式：纖維素纖維（棉、麻）耐鹼不耐酸，可高溫熨燙；蛋白質纖維（羊毛、絲）耐酸不耐鹼，故一般洗衣粉的鹼性會損害它們；合成纖維遇高溫會熔化而非燒焦，故熨燙溫度必須降低。認清類別，保養標籤上的指示便不再需要死記。`,
         `${en.charAt(0).toUpperCase() + en.slice(1)} is ${cls === '天然纖維素纖維' ? 'a natural cellulose fibre' : cls === '天然蛋白質纖維' ? 'a natural protein fibre' : 'a synthetic fibre'}. The class determines care: cellulose fibres (cotton, linen) resist alkali but not acid and tolerate a hot iron; protein fibres (wool, silk) resist acid but not alkali, so ordinary alkaline detergents damage them; synthetics melt rather than char, so ironing temperatures must be lower. Once the class is known, the care label no longer has to be memorised.`])
    } else {
      b.add(`tlb_fb1_${en}_p`, T.fibres, FW.apply, 'medium',
        [`就${zh}而言，以下哪一項最準確描述其特性？`, `Which statement best describes the properties of ${en}?`],
        [[prop, propEn], ...others.slice(0, 3).map((f) => [f[3], f[4]] as [string, string])],
        [`${zh}的特性為：${prop}。要理解特性與結構的關係：天然纖維素纖維有大量羥基，故吸濕；蛋白質纖維有鱗片與捲曲結構，故保暖而易氈縮；合成纖維為長鏈聚合物且不親水，故強韌但吸濕性低，並在高溫下熔化。由結構推特性，比逐項背誦可靠得多。`,
         `${en.charAt(0).toUpperCase() + en.slice(1)} is ${propEn}. Link property to structure: cellulose fibres carry many hydroxyl groups and so absorb moisture; protein fibres have scales and crimp, giving warmth but a tendency to felt; synthetics are long non-polar polymer chains, hence strong but poorly absorbent, and they melt when hot. Reasoning from structure is far more reliable than memorising lists.`])
    }
  }
}

// ── 成衣與時尚（目標約 24 條）──────────────────────────────────────────────

// GF1 — 布料用量計算
for (const len of [1.2, 1.5, 1.8, 2.0, 2.4, 3.0]) {
  for (const pieces of [2, 3, 4, 5, 6, 8]) {
    const total = len * pieces
    const d = distract(total, [len + pieces, total / 2, len * (pieces + 1)])
    if (d.length < 3) continue
    b.add(`tlb_gf1_${String(len).replace('.', '')}_${pieces}`, T.fashion, FW.apply, pieces <= 3 ? 'easy' : 'medium',
      [`製作一件成衣需用布 ${len} 米。若要製作 ${pieces} 件同款成衣，共需用布多少米（不計損耗）？`,
       `One garment requires ${len} m of fabric. How many metres are needed for ${pieces} identical garments, ignoring wastage?`],
      [qty(round(total, 2), '米', 'm'), ...d.map((v) => qty(round(v, 2), '米', 'm'))],
      [`所需布料 = 單件用布 × 件數 = $${len} \\times ${pieces} = ${round(total, 2)}$ 米。實務上還須加上損耗：裁片之間必然有空隙，格紋或有方向性的圖案更要對花，用布量可較理論值多出一至兩成。故報價與採購一般會在計算結果之上另加寬放量。`,
       `Fabric needed = fabric per garment × number of garments = $${len} \\times ${pieces} = ${round(total, 2)}$ m. In practice an allowance must be added: gaps between pattern pieces are unavoidable, and checks or directional prints must be matched, which can raise consumption by ten to twenty per cent. Quotations and purchasing therefore add a margin above the calculated figure.`])
  }
}

// ── 消費與可持續（目標約 24 條）────────────────────────────────────────────

// CS1 — 單位價格比較
for (const [aSize, aPrice] of [[500, 18], [750, 25], [1000, 32], [1500, 45], [800, 26], [600, 21]] as Array<[number, number]>) {
  for (const [bSize, bPrice] of [[250, 10], [400, 15], [2000, 56], [300, 11], [1200, 40]] as Array<[number, number]>) {
    const aUnit = (aPrice / aSize) * 100
    const bUnit = (bPrice / bSize) * 100
    if (Math.abs(aUnit - bUnit) < 0.05) continue
    const cheaper = aUnit < bUnit ? `${aSize} 克裝` : `${bSize} 克裝`
    const cheaperEn = aUnit < bUnit ? `the ${aSize} g pack` : `the ${bSize} g pack`
    b.add(`tlb_cs1_${aSize}_${bSize}`, T.consumer, FW.apply, Math.abs(aUnit - bUnit) < 0.5 ? 'hard' : 'medium',
      [`同一產品有兩種包裝：${aSize} 克售 ${aPrice} 元，${bSize} 克售 ${bPrice} 元。以每 100 克計算，哪一款較便宜？`,
       `The same product comes in two packs: ${aSize} g at $${aPrice} and ${bSize} g at $${bPrice}. Which is cheaper per 100 g?`],
      [[cheaper, cheaperEn],
       [aUnit < bUnit ? `${bSize} 克裝` : `${aSize} 克裝`, aUnit < bUnit ? `the ${bSize} g pack` : `the ${aSize} g pack`],
       ['兩者單位價格相同', 'the two cost the same per 100 g'],
       ['無法比較，因為包裝規格不同', 'they cannot be compared because the pack sizes differ']],
      [`單位價格 = 售價 ÷ 重量 × 100。${aSize} 克裝為 $\\dfrac{${aPrice}}{${aSize}} \\times 100 = ${round(aUnit, 2)}$ 元／100 克；${bSize} 克裝為 $\\dfrac{${bPrice}}{${bSize}} \\times 100 = ${round(bUnit, 2)}$ 元／100 克，故${cheaper}較便宜。要留意「大包裝一定較抵」並非定律——促銷、包裝成本與存貨周轉都會影響定價，所以貨架上的單位價格標示才是可靠依據。另外「較便宜」不等於「應該買」：若份量超出實際需要而導致浪費，總支出反而更高。`,
       `Unit price = price ÷ weight × 100. The ${aSize} g pack works out at $\\dfrac{${aPrice}}{${aSize}} \\times 100 = ${round(aUnit, 2)}$ per 100 g, and the ${bSize} g pack at $\\dfrac{${bPrice}}{${bSize}} \\times 100 = ${round(bUnit, 2)}$, so ${cheaperEn} is cheaper. Note that "the larger pack is always better value" is not a rule: promotions, packaging costs and stock turnover all affect pricing, which is why the shelf unit-price label is the reliable guide. And cheaper per unit does not mean one should buy it: if the quantity exceeds what will be used, waste can make total spending higher.`])
  }
}

// ── 膳食營養素（目標約 24 條）──────────────────────────────────────────────

// NU1 — 每日建議攝取量的百分比
for (const rdi of [60, 90, 400, 800, 1000]) {
  for (const intake of [15, 30, 45, 60, 80, 90]) {
    const pct = (intake / rdi) * 100
    if (pct > 100 || pct < 1) continue
    const d = distract(round(pct, 1) as unknown as number, [rdi / intake, intake * 100 / (rdi * 2), pct * 2])
    if (d.length < 3) continue
    b.add(`tlb_nu1_${rdi}_${intake}`, T.nutrition, FW.apply, rdi >= 400 ? 'easy' : pct < 30 ? 'hard' : 'medium',
      [`某營養素的每日建議攝取量為 ${rdi} 毫克。若某人當日攝取了 ${intake} 毫克，佔建議量的百分之幾？`,
       `The recommended daily intake of a nutrient is ${rdi} mg. If a person takes in ${intake} mg that day, what percentage of the recommendation is that?`],
      [n(`$${round(pct, 1)}\\%$`), ...d.map((v) => n(`$${round(v, 1)}\\%$`))],
      [`佔比 = $\\dfrac{${intake}}{${rdi}} \\times 100\\% = ${round(pct, 1)}\\%$。要留意建議攝取量是【群體】的參考值，按年齡與性別分組訂定，並非個人的精確需要；而且單日不足並不等於缺乏——營養狀況要看一段時間的平均攝取，故評估膳食應以數天的紀錄為基礎，而非單日數字。`,
       `The share is $\\dfrac{${intake}}{${rdi}} \\times 100\\% = ${round(pct, 1)}\\%$. Note that a recommended intake is a POPULATION reference figure set by age and sex group, not an exact individual requirement; and falling short on one day is not deficiency — nutritional status reflects average intake over time, so dietary assessment should rest on several days' records rather than a single day.`])
  }
}

// ── 食物與紡織科學（目標約 24 條）──────────────────────────────────────────

// ST1 — 燃燒測試辨認纖維
const burnTable: Array<[string, string, string, string]> = [
  ['棉', 'cotton', '迅速燃燒，有燒紙氣味，灰燼呈灰色細粉', 'burns quickly with a smell of burning paper, leaving fine grey ash'],
  ['羊毛', 'wool', '緩慢燃燒並自行熄滅，有燒頭髮氣味，灰燼呈易碎黑珠', 'burns slowly and self-extinguishes, smells of burning hair, leaves a brittle black bead'],
  ['聚酯纖維', 'polyester', '先熔縮後燃燒，有化學氣味，冷卻後成硬珠', 'melts and shrinks before burning, smells chemical, leaves a hard bead'],
  ['絲', 'silk', '緩慢燃燒，有燒頭髮氣味，灰燼呈黑色鬆脆球狀', 'burns slowly, smells of burning hair, leaves a crushable black ball'],
  ['麻', 'linen', '迅速燃燒，有燒草木氣味，灰燼呈灰白色細粉', 'burns quickly with a smell of burning vegetation, leaving pale grey ash'],
  ['尼龍', 'nylon', '熔縮並滴落，有芹菜狀氣味，冷卻後成灰褐硬珠', 'melts and drips, gives a celery-like smell, leaves a hard greyish bead'],
  ['亞加力纖維', 'acrylic', '快速熔燃並冒黑煙，有辛辣氣味，成不規則硬塊', 'melts and burns fast with black smoke and an acrid smell, leaving an irregular hard lump'],
]
for (const [zh, en, burn, burnEn] of burnTable) {
  for (const dir of ['由纖維推現象', '由現象推纖維']) {
    if (dir === '由纖維推現象') {
      // 干擾項連英文一併由 burnTable 取出：只取中文會令英文選項夾雜中文。
      const others = burnTable.filter((f) => f[2] !== burn).slice(0, 3)
      b.add(`tlb_st1_${en}_f`, T.sci, FW.apply, 'medium',
        [`以燃燒測試辨認纖維時，${zh}會出現甚麼現象？`,
         `In a burn test, how does ${en} behave?`],
        [[burn, burnEn], [others[0][2], others[0][3]], [others[1][2], others[1][3]], [others[2][2], others[2][3]]],
        [`${zh}的燃燒現象為：${burn}。燃燒測試的原理在於纖維的化學組成：纖維素纖維燃燒似紙；蛋白質纖維含氮與硫，故有燒頭髮的氣味並自行熄滅；合成纖維屬熱塑性聚合物，故先熔後燃並留下硬珠。此測試只需極少量樣本，是實驗室以外最快的初步辨認方法，但混紡布料會同時呈現多種現象，須配合其他測試。`,
         `${en.charAt(0).toUpperCase() + en.slice(1)} ${burnEn}. The test works from chemical composition: cellulose fibres burn like paper; protein fibres contain nitrogen and sulphur, hence the burning-hair smell and self-extinguishing; synthetics are thermoplastic polymers and so melt before burning, leaving a hard bead. It needs only a tiny sample and is the quickest preliminary identification outside a laboratory, but blends show several behaviours at once and need further tests.`])
    } else {
      const others = fibres.filter((f) => f[0] !== zh).slice(0, 3)
      b.add(`tlb_st1_${en}_r`, T.sci, FW.logic, 'hard',
        [`燃燒測試中，某纖維樣本${burn}。該纖維最可能是甚麼？`,
         `In a burn test a fibre sample ${burnEn}. Which fibre is it most likely to be?`],
        [[zh, en], ...others.map((f) => [f[0], f[1]] as [string, string])],
        [`此現象對應${zh}。反向辨認時，最有用的兩項線索是【氣味】與【灰燼形態】：燒頭髮氣味指向蛋白質纖維（羊毛、絲），燒紙氣味指向纖維素纖維（棉、麻），化學氣味加硬珠則指向合成纖維。要進一步區分羊毛與絲，可看灰燼——羊毛成易碎黑珠，絲則較鬆脆，並須配合手感與光澤判斷。`,
         `This behaviour corresponds to ${en}. Working backwards, the two most useful clues are SMELL and the FORM OF THE RESIDUE: a burning-hair smell points to protein fibres (wool, silk), a burning-paper smell to cellulose fibres (cotton, linen), and a chemical smell with a hard bead to synthetics. To separate wool from silk, examine the residue — wool leaves a brittle bead and silk a more crushable one — and confirm with handle and lustre.`])
    }
  }
}

export const technologyLivingBank3Questions: Question[] = b.bank
