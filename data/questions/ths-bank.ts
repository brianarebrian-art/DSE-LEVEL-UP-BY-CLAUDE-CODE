import type { Question } from './types'
import { createBank, qty, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// ths-bank.ts —— 旅遊與款待參數化母模板・第一批（2026-09-03）
// ---------------------------------------------------------------------------
// 本科現為 278 條、分佈 9–83（9.2 倍，全庫最不均）。七個課題停在 15 條、
// 一個停在 9 條，而 ths_hotel_metrics 已有 83。故本檔【不加】給
// ths_hotel_metrics，全部產能投向其餘九個。
//
// ⚠️ 四條累積教訓（同日六役），開工前先寫下：
//   ① 誘答必須互不相同【且代數上不恆等】（ICT DC2、生物 GE2）。
//   ② 每個迴圈變數【必須出現在題幹】（音樂 HA1）。
//   ③ 補量用值域寬的數值參數，不要用固定枚舉表（音樂第一版只出 152 條）。
//   ④ 調產出量時【一次只改一個迴圈】—— 迴圈相乘，三層各加一值即八倍
//      （設計與應用科技來回擺盪四輪；體育照辦後三輪定案）。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  concept: { id: 'ths_concept_analysis', zh: '概念分析・服務與可持續', en: 'Concept analysis — service & sustainability' },
  service: { id: 'service', zh: '優質顧客服務', en: 'Quality Customer Service' },
  dest: { id: 'destinations', zh: '旅遊目的地', en: 'Destinations' },
  fnb: { id: 'food_beverage', zh: '餐飲服務', en: 'Food & Beverage' },
  trade: { id: 'travel_trade', zh: '旅行社與會展', en: 'Travel Trade & MICE' },
  sustain: { id: 'sustainable', zh: '可持續旅遊', en: 'Sustainable Tourism' },
  impact: { id: 'impacts', zh: '旅遊影響', en: 'Impacts of Tourism' },
  accom: { id: 'accommodation', zh: '住宿營運', en: 'Accommodation Operations' },
  intro: { id: 'intro', zh: '旅遊與款待業概論', en: 'Intro to Tourism & Hospitality' },
} satisfies Record<string, TopicMeta>

const FW = {
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
} satisfies Record<string, FwMeta>

const b = createBank('ths')

const distract = (correct: number, cands: number[]): number[] =>
  cands.filter((v, i, a) => v !== correct && a.indexOf(v) === i).slice(0, 3)

// ── 概念分析・服務與可持續 ────────────────────────────────────────────────

// CA1 — 服務補救：投訴處理率
for (const complaints of [40, 50, 60, 80, 100, 120, 150, 200, 250, 300]) {
  for (const resolved of [15, 20, 24, 25, 30, 36, 40, 45, 50, 60, 75, 80, 90, 120, 150, 180]) {
    if (resolved > complaints) continue
    const pct = Math.round((resolved / complaints) * 1000) / 10
    const d = distract(pct, [Math.round(((complaints - resolved) / complaints) * 1000) / 10, resolved, complaints - resolved])
    if (d.length < 3) continue
    b.add(`thsb_ca1_${complaints}_${resolved}`, T.concept, FW.apply, 'medium',
      [`一間酒店本月收到 ${complaints} 宗投訴，其中 ${resolved} 宗在二十四小時內解決。二十四小時解決率為多少百分比？`,
       `A hotel receives ${complaints} complaints in a month and resolves ${resolved} of them within twenty-four hours. What is the 24-hour resolution rate, as a percentage?`],
      [qty(pct, '%', '%'), ...d.map((v) => qty(v, '%', '%'))],
      [`解決率 = $${resolved} \\div ${complaints} \\times 100\\% = ${pct}\\%$。服務補救理論指出：一名投訴獲【迅速】解決的顧客，其忠誠度往往【高於】從未遇上問題的顧客 —— 因為他親眼見過這間酒店出事時的表現。所以投訴數字本身不是壞消息，處理不了才是。`,
       `Resolution rate = $${resolved} \\div ${complaints} \\times 100\\% = ${pct}\\%$. Service-recovery theory holds that a guest whose complaint is resolved QUICKLY often becomes more loyal than one who never had a problem — because they have seen how the hotel behaves when things go wrong. The complaint count itself is not bad news; failing to resolve them is.`])
  }
}

// ── 優質顧客服務 ──────────────────────────────────────────────────────────

// SV1 — 顧客滿意度平均分
for (const total of [200, 240, 250, 300, 400, 480, 500, 600, 800, 1000]) {
  for (const sumScore of [600, 720, 800, 900, 1000, 1200, 1400, 1500, 1600, 1800, 2000, 2400, 2800, 3000, 3200, 4000]) {
    const avg = Math.round((sumScore / total) * 100) / 100
    if (avg < 1 || avg > 5) continue
    const d = distract(avg, [total, sumScore, Math.round((total / sumScore) * 100) / 100])
    if (d.length < 3) continue
    b.add(`thsb_sv1_${total}_${sumScore}`, T.service, FW.apply, 'easy',
      [`一間餐廳收回 ${total} 份滿意度問卷，各項評分（五分為滿分）合計 ${sumScore} 分。平均滿意度為多少分？`,
       `A restaurant collects ${total} satisfaction questionnaires with scores totalling ${sumScore} out of a maximum of five each. What is the mean satisfaction score?`],
      [qty(avg, '分', ''), ...d.map((v) => qty(v, '分', ''))],
      [`平均分 = $${sumScore} \\div ${total} = ${avg}$ 分。⚠️ 平均分會【掩蓋兩極】：一半人給五分、一半人給一分，平均是三分；全部人給三分，平均也是三分。兩者的經營意義完全不同 —— 前者代表服務時好時壞（通常是人手或流程問題），後者代表一致地平庸。所以要同時看分佈。`,
       `Mean = $${sumScore} \\div ${total} = ${avg}$. NOTE that a mean HIDES POLARISATION: half scoring five and half scoring one averages three, and everyone scoring three also averages three. The two mean entirely different things operationally — the first says service is inconsistent, usually a staffing or process problem, the second says it is uniformly mediocre. The distribution must be read alongside.`])
  }
}

// ── 旅遊目的地 ────────────────────────────────────────────────────────────

// DE1 — 旅客人次增長率
for (const before of [200, 250, 300, 400, 500, 600, 800, 1000]) {
  for (const growthPct of [4, 5, 8, 10, 12, 15, 20, 25, 30, 40, 50]) {
    const after = (before * (100 + growthPct)) / 100
    if (!Number.isInteger(after)) continue
    const d = distract(after, [before + growthPct, (before * growthPct) / 100, before])
    if (d.length < 3) continue
    b.add(`thsb_de1_${before}_${growthPct}`, T.dest, FW.apply, 'easy',
      [`某目的地去年接待旅客 ${before} 萬人次，今年增長 ${growthPct}%。今年接待多少萬人次？`,
       `A destination received ${before} × 10⁴ visitors last year and grew ${growthPct}% this year. How many × 10⁴ visitors did it receive this year?`],
      [qty(after, '萬人次', '× 10⁴'), ...d.map((v) => qty(v, '萬人次', '× 10⁴'))],
      [`今年 = $${before} \\times (100\\% + ${growthPct}\\%) = ${after}$ 萬人次，即增加了 $${after - before}$ 萬人次。⚠️ 旅客增長【不等於】收益增長：人次上升而人均消費下降，總收益可以不變甚至下跌。目的地管理看的從來是「人次 × 人均消費 − 承載成本」，而不是人次本身。`,
       `This year = $${before} \\times (100\\% + ${growthPct}\\%) = ${after}$ × 10⁴, an increase of $${after - before}$ × 10⁴. NOTE that visitor growth is NOT revenue growth: if arrivals rise while spend per head falls, total revenue can stay flat or drop. Destination management always reads arrivals × spend per head minus the cost of carrying them, never arrivals alone.`])
  }
}

// ── 餐飲服務 ──────────────────────────────────────────────────────────────

// FB1 — 食物成本率 = 食物成本 ÷ 銷售額
for (const cost of [30, 36, 40, 50, 60, 80, 100, 120, 150]) {
  for (const sales of [100, 120, 125, 150, 200, 240, 250, 300, 400, 500, 600]) {
    if (cost >= sales) continue
    const pct = Math.round((cost / sales) * 1000) / 10
    const d = distract(pct, [Math.round(((sales - cost) / sales) * 1000) / 10, cost, sales - cost])
    if (d.length < 3) continue
    b.add(`thsb_fb1_${cost}_${sales}`, T.fnb, FW.apply, 'medium',
      [`一間餐廳本月食物成本 ${cost} 萬元，食物銷售額 ${sales} 萬元。食物成本率為多少百分比？`,
       `A restaurant's food cost is $${cost} × 10⁴ against food sales of $${sales} × 10⁴ this month. What is the food cost percentage?`],
      [qty(pct, '%', '%'), ...d.map((v) => qty(v, '%', '%'))],
      [`食物成本率 = $${cost} \\div ${sales} \\times 100\\% = ${pct}\\%$。行業一般把三成左右視為參考水平，但【高不一定差】：高級餐廳用料貴、成本率高，靠人均消費支撐；快餐成本率低卻靠翻枱率取勝。單看這個比率不能判斷經營好壞，要連同定價策略與翻枱率一併讀。`,
       `Food cost percentage = $${cost} \\div ${sales} \\times 100\\% = ${pct}\\%$. The trade treats about thirty per cent as a reference, but a HIGH figure is not necessarily bad: fine dining runs expensive ingredients and high cost percentages, carried by spend per head, while fast food runs low percentages and wins on table turnover. The ratio alone cannot judge an operation; pricing strategy and turnover must be read with it.`])
  }
}

// ── 旅行社與會展 ──────────────────────────────────────────────────────────

// TR1 — 團費計算：總團費 = 人數 × 每人團費 − 折扣
for (const people of [12, 15, 18, 20, 25, 30, 40, 50]) {
  for (const perHead of [2000, 2500, 3000, 4000, 5000]) {
    for (const discPct of [5, 10]) {
      const gross = people * perHead
      const net = (gross * (100 - discPct)) / 100
      if (!Number.isInteger(net)) continue
      const d = distract(net, [gross, (gross * discPct) / 100, people * discPct])
      if (d.length < 3) continue
      b.add(`thsb_tr1_${people}_${perHead}_${discPct}`, T.trade, FW.apply, 'medium',
        [`一個 ${people} 人的旅行團，每人團費 ${perHead} 元，因人數達標獲 ${discPct}% 團體折扣。折後總團費為多少元？`,
         `A tour group of ${people} pays $${perHead} per person and qualifies for a ${discPct}% group discount. What is the discounted total?`],
        [qty(net, '元', 'dollars'), ...d.map((v) => qty(v, '元', 'dollars'))],
        [`折前 $${people} \\times ${perHead} = ${gross}$ 元，折後 $= ${gross} \\times ${100 - discPct}\\% = ${net}$ 元。團體折扣的商業邏輯不在於「人多所以便宜」，而在於【固定成本被攤薄】：領隊、車輛與導遊費用不論十五人抑或五十人都要付，人數愈多每人分擔愈少，折扣就是把這部分節省讓回給客人。`,
         `Before discount $${people} \\times ${perHead} = ${gross}$; after, $${gross} \\times ${100 - discPct}\\% = ${net}$. The commercial logic of a group discount is not "more people so cheaper" but that FIXED COSTS ARE SPREAD: the tour leader, coach and guide are paid whether the group is fifteen or fifty, so a larger group carries a smaller share each, and the discount passes that saving back.`])
    }
  }
}

// ── 可持續旅遊 ────────────────────────────────────────────────────────────

// SU1 — 承載力：可接待日數 = 年度承載力 ÷ 每日人數
for (const annual of [24000, 30000, 36000, 42000, 48000, 54000, 60000, 72000, 84000, 90000, 96000, 108000, 120000, 144000]) {
  for (const daily of [150, 200, 240, 250, 300, 350, 400, 450, 500, 600, 720]) {
    const days = annual / daily
    if (!Number.isInteger(days) || days > 365) continue
    const d = distract(days, [annual, daily, Math.round(365 - days)])
    if (d.length < 3) continue
    b.add(`thsb_su1_${annual}_${daily}`, T.sustain, FW.apply, 'hard',
      [`某生態景區的年度承載力上限為 ${annual} 人次。若每日接待 ${daily} 人，該景區一年最多可開放多少日？`,
       `An ecological site has an annual carrying capacity of ${annual} visitors. Admitting ${daily} per day, for how many days a year can it open at most?`],
      [qty(days, '日', 'days'), ...d.map((v) => qty(v, '日', 'days'))],
      [`可開放日數 = $${annual} \\div ${daily} = ${days}$ 日，即一年之中有 ${365 - days} 日必須關閉。承載力管理的關鍵不在於【總量】，而在於【恢復時間】：生態系統需要間歇休養，故做法通常是分區輪休或設淡季封閉期，而不是全年平均攤分。`,
       `Opening days = $${annual} \\div ${daily} = ${days}$, meaning ${365 - days} days a year must be closed. What matters in carrying-capacity management is not the total but the RECOVERY TIME: ecosystems need intervals to recuperate, so the usual practice is rotating zone closures or a closed season rather than spreading the quota evenly across the year.`])
  }
}

// ── 旅遊影響 ──────────────────────────────────────────────────────────────

// IM1 — 旅遊收益乘數效應
for (const spend of [80, 100, 120, 150, 200, 250, 300, 400, 500, 600, 800]) {
  for (const multiplierX10 of [11, 12, 14, 15, 16, 18, 20, 22, 25]) {
    const total = (spend * multiplierX10) / 10
    if (!Number.isInteger(total)) continue
    const d = distract(total, [spend, total - spend, spend * multiplierX10])
    if (d.length < 3) continue
    b.add(`thsb_im1_${spend}_${multiplierX10}`, T.impact, FW.apply, 'hard',
      [`旅客在某地直接消費 ${spend} 萬元，該地的旅遊收益乘數為 ${multiplierX10 / 10}。計入間接與衍生效應後，對當地經濟的總貢獻為多少萬元？`,
       `Visitors spend $${spend} × 10⁴ directly in a locality whose tourism income multiplier is ${multiplierX10 / 10}. Counting indirect and induced effects, what is the total contribution to the local economy?`],
      [qty(total, '萬元', '× 10⁴'), ...d.map((v) => qty(v, '萬元', '× 10⁴'))],
      [`總貢獻 = $${spend} \\times ${multiplierX10 / 10} = ${total}$ 萬元，其中 ${total - spend} 萬元來自間接與衍生效應（酒店向本地農戶採購、員工把工資花在本地）。⚠️ 乘數【愈依賴進口愈低】：若酒店的食材、傢俬與管理人員全部外購，錢很快漏出當地，乘數就會接近 1。所以「旅遊帶動經濟」的實際幅度，取決於本地供應鏈有多完整。`,
       `Total = $${spend} \\times ${multiplierX10 / 10} = ${total}$ × 10⁴, of which ${total - spend} × 10⁴ comes from indirect and induced effects — hotels buying from local farms, staff spending wages locally. NOTE the multiplier FALLS AS IMPORTS RISE: if food, furnishings and managers are all brought in, the money leaks out quickly and the multiplier approaches one. How much tourism actually drives an economy depends on how complete the local supply chain is.`])
  }
}

// ── 住宿營運 ──────────────────────────────────────────────────────────────

// AC1 — 入住率 = 已售房晚 ÷ 可售房晚
for (const rooms of [100, 120, 140, 150, 180, 200, 240, 250, 300, 400]) {
  for (const soldPct of [50, 55, 60, 65, 70, 75, 80, 85, 90, 95]) {
    const sold = (rooms * soldPct) / 100
    if (!Number.isInteger(sold)) continue
    const d = distract(sold, [rooms - sold, soldPct, rooms])
    if (d.length < 3) continue
    b.add(`thsb_ac1_${rooms}_${soldPct}`, T.accom, FW.apply, 'easy',
      [`一間有 ${rooms} 間客房的酒店，某晚入住率為 ${soldPct}%。當晚售出多少間房？`,
       `A hotel with ${rooms} rooms records an occupancy of ${soldPct}% one night. How many rooms were sold?`],
      [qty(sold, '間', 'rooms'), ...d.map((v) => qty(v, '間', 'rooms'))],
      [`售出 = $${rooms} \\times ${soldPct}\\% = ${sold}$ 間，空置 ${rooms - sold} 間。⚠️ 入住率高【不等於】賺得多：大幅減價可以把入住率推到接近滿房，但每間房的收入下跌。酒店業因此看的是「每間可售房收入」，即入住率乘平均房價 —— 兩者的乘積才是經營目標。`,
       `Sold = $${rooms} \\times ${soldPct}\\% = ${sold}$ rooms, leaving ${rooms - sold} empty. NOTE that high occupancy does NOT mean high earnings: deep discounting can fill almost every room while revenue per room falls. The trade therefore watches revenue per available room, occupancy multiplied by average rate — it is the product, not either factor, that is the objective.`])
  }
}

// ── 旅遊與款待業概論 ──────────────────────────────────────────────────────

// IN1 — 就業人數佔比
for (const tourismJobs of [10, 12, 15, 20, 25, 30, 40, 50]) {
  for (const totalJobs of [200, 250, 300, 400, 500]) {
    const pct = Math.round((tourismJobs / totalJobs) * 1000) / 10
    const d = distract(pct, [tourismJobs, totalJobs - tourismJobs, Math.round((totalJobs / tourismJobs) * 10) / 10])
    if (d.length < 3) continue
    b.add(`thsb_in1_${tourismJobs}_${totalJobs}`, T.intro, FW.apply, 'easy',
      [`某地旅遊及款待業僱用 ${tourismJobs} 萬人，全地區總就業人口 ${totalJobs} 萬人。該行業佔總就業的百分比為多少？`,
       `Tourism and hospitality employs ${tourismJobs} × 10⁴ people in a territory with total employment of ${totalJobs} × 10⁴. What percentage of employment does the sector represent?`],
      [qty(pct, '%', '%'), ...d.map((v) => qty(v, '%', '%'))],
      [`佔比 = $${tourismJobs} \\div ${totalJobs} \\times 100\\% = ${pct}\\%$。旅遊業的就業特性是【入行門檻低而季節性強】：這既是它能大量吸納勞動力的原因，也是它在疫情或經濟下行時失業衝擊特別集中的原因。一個依賴旅遊的經濟體，就業結構的韌性通常較弱。`,
       `Share = $${tourismJobs} \\div ${totalJobs} \\times 100\\% = ${pct}\\%$. Tourism employment is marked by LOW ENTRY BARRIERS AND STRONG SEASONALITY: that is why it absorbs labour in volume, and equally why job losses concentrate there during a pandemic or a downturn. An economy leaning on tourism usually has a less resilient employment structure.`])
  }
}

export const thsBank3Questions: Question[] = b.bank
