import type { Question } from './types'
import { createBank, qty, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// pe-bank2.ts —— 體育參數化母模板・第二批（2026-09-03）
// ---------------------------------------------------------------------------
// 承接 pe-bank.ts。本科現為 426 條、分佈 27–59（2.2 倍）。
// 分佈不算失衡，問題純在總量 —— 十個課題全部低於每課題 100，
// 故本檔為【全部十個】出題。
//
// ⚠️ 四條累積教訓（同日五役），開工前先寫下：
//   ① 誘答必須互不相同【且代數上不恆等】（ICT DC2、生物 GE2）。
//   ② 每個迴圈變數【必須出現在題幹】（音樂 HA1：十二個 root 出十二條同題）。
//   ③ 補量用值域寬的數值參數，不要用固定枚舉表（音樂第一版只出 152 條）。
//   ④ 調產出量時【一次只改一個迴圈】再量度 —— 迴圈是相乘的，三層各加
//      一個值就是八倍而非加三。設計與應用科技一批因同時改多個迴圈而
//      來回擺盪四輪（139→29→77→90）。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  injuries: { id: 'injuries', zh: '運動創傷', en: 'Sports Injuries' },
  psych: { id: 'psychology', zh: '運動心理學', en: 'Sport Psychology' },
  anatomy: { id: 'anatomy', zh: '解剖學', en: 'Anatomy' },
  physiology: { id: 'physiology', zh: '運動生理學', en: 'Exercise Physiology' },
  systems: { id: 'pe_biomech_systems', zh: '生物力學與能量系統', en: 'Biomechanics & energy systems' },
  nutrition: { id: 'nutrition_health', zh: '營養與健康', en: 'Nutrition & Health' },
  fitness: { id: 'fitness_training', zh: '體適能與訓練', en: 'Fitness & Training' },
  society: { id: 'sport_society', zh: '運動與社會', en: 'Sport & Society' },
  physcalc: { id: 'pe_physiology_calc', zh: '運動生理計算', en: 'Exercise physiology — calculation' },
  biomech: { id: 'biomechanics', zh: '生物力學', en: 'Biomechanics' },
} satisfies Record<string, TopicMeta>

const FW = {
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
} satisfies Record<string, FwMeta>

const b = createBank('pe')

const distract = (correct: number, cands: number[]): number[] =>
  cands.filter((v, i, a) => v !== correct && a.indexOf(v) === i).slice(0, 3)

// ── 運動創傷 ──────────────────────────────────────────────────────────────

// IJ1 — 冰敷方案：總冰敷時間 = 每次時長 × 每日次數 × 日數
for (const mins of [10, 15, 20]) {
  for (const times of [2, 3, 4, 5, 6]) {
    for (const days of [1, 2, 3, 4, 5, 7]) {
      const total = mins * times * days
      const d = distract(total, [mins * times, mins + times + days, mins * days])
      if (d.length < 3) continue
      b.add(`peb2_ij1_${mins}_${times}_${days}`, T.injuries, FW.apply, 'easy',
        [`一項急性軟組織創傷的處理方案為每次冰敷 ${mins} 分鐘、每日 ${times} 次、共 ${days} 日。合共冰敷多少分鐘？`,
         `An acute soft-tissue injury is iced for ${mins} minutes, ${times} times a day, for ${days} days. What is the total icing time, in minutes?`],
        [qty(total, '分鐘', 'min'), ...d.map((v) => qty(v, '分鐘', 'min'))],
        [`總時間 = $${mins} \\times ${times} \\times ${days} = ${total}$ 分鐘。⚠️ 單次冰敷【不可】無限延長：超過約二十分鐘後，身體會反射性擴張血管以防組織凍傷，反而增加腫脹。所以方案是「短時間、多次數」而非「一次敷夠」—— 把 ${total} 分鐘一次敷完，效果與此完全相反。`,
         `Total = $${mins} \\times ${times} \\times ${days} = ${total}$ minutes. NOTE a single application must NOT be extended indefinitely: beyond about twenty minutes the body reflexively dilates the vessels to protect the tissue from cold injury, which increases swelling instead. Hence the protocol is short and repeated rather than one long session — applying all ${total} minutes at once has the opposite effect.`])
    }
  }
}

// ── 運動心理學 ────────────────────────────────────────────────────────────

// PS1 — 目標設定：達成率
for (const target of [20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200, 240]) {
  for (const done of [5, 10, 15, 20, 24, 30, 36, 45, 60, 75, 90, 120]) {
    if (done > target) continue
    const pct = Math.round((done / target) * 1000) / 10
    const d = distract(pct, [Math.round(((target - done) / target) * 1000) / 10, done, target - done])
    if (d.length < 3) continue
    b.add(`peb2_ps1_${target}_${done}`, T.psych, FW.apply, 'easy',
      [`一名運動員為賽季設定 ${target} 次訓練的目標，至今完成 ${done} 次。目標達成率為多少百分比？`,
       `An athlete sets a season goal of ${target} training sessions and has completed ${done}. What percentage of the goal is achieved?`],
      [qty(pct, '%', '%'), ...d.map((v) => qty(v, '%', '%'))],
      [`達成率 = $${done} \\div ${target} \\times 100\\% = ${pct}\\%$。目標設定理論強調目標須【可量度】—— 「更加努力」無法計算達成率，「完成 ${target} 次訓練」才可以。可量度的目標之所以有效，正是因為它令進度隨時查得到，而查得到才會有調整。`,
       `Achievement = $${done} \\div ${target} \\times 100\\% = ${pct}\\%$. Goal-setting theory insists goals be MEASURABLE — "try harder" yields no percentage while "complete ${target} sessions" does. Measurable goals work precisely because progress can be checked at any time, and only what is checked gets adjusted.`])
  }
}

// ── 解剖學 ────────────────────────────────────────────────────────────────

// AN1 — 關節活動範圍：剩餘角度
for (const full of [90, 100, 120, 135, 150, 160, 180]) {
  for (const achieved of [20, 30, 40, 45, 50, 60, 70, 75, 80, 90, 100, 105, 120]) {
    if (achieved >= full) continue
    const deficit = full - achieved
    const pct = Math.round((achieved / full) * 1000) / 10
    const d = distract(deficit, [achieved, full, pct])
    if (d.length < 3) continue
    b.add(`peb2_an1_${full}_${achieved}`, T.anatomy, FW.apply, 'medium',
      [`某關節的正常活動範圍為 ${full} 度，受傷後只能屈曲至 ${achieved} 度。活動範圍尚欠多少度？`,
       `A joint's normal range of motion is ${full} degrees but after injury it flexes only to ${achieved}. By how many degrees is the range short?`],
      [qty(deficit, '度', 'degrees'), ...d.map((v) => qty(v, '度', 'degrees'))],
      [`尚欠 $${full} - ${achieved} = ${deficit}$ 度，即已恢復 ${pct}%。復康評估同時看【絕對角度】與【百分比】：欠 ${deficit} 度在一個正常範圍 ${full} 度的關節上代表 ${Math.round((deficit / full) * 1000) / 10}% 的缺失，但同樣欠 ${deficit} 度在活動範圍較細的關節上，影響嚴重得多 —— 所以兩個數字要一齊看。`,
       `The shortfall is $${full} - ${achieved} = ${deficit}$ degrees, that is ${pct}% recovered. Rehabilitation assessment reads BOTH the absolute deficit and the percentage: ${deficit} degrees missing from a ${full}-degree range is a ${Math.round((deficit / full) * 1000) / 10}% loss, but the same ${deficit} degrees on a joint with a smaller range matters far more — which is why the two figures are read together.`])
  }
}

// ── 運動生理學 ────────────────────────────────────────────────────────────

// PH1 — 最大心率與目標心率區間
for (const age of [14, 15, 16, 17, 18, 20, 25, 30, 40, 50]) {
  for (const intensity of [60, 70, 75, 80, 85]) {
    const maxHr = 220 - age
    const target = Math.round((maxHr * intensity) / 100)
    const d = distract(target, [maxHr, age, intensity])
    if (d.length < 3) continue
    b.add(`peb2_ph1_${age}_${intensity}`, T.physiology, FW.apply, 'medium',
      [`以「220 減年齡」估算最大心率。一名 ${age} 歲的運動員以最大心率 ${intensity}% 的強度訓練，其目標心率約為每分鐘多少次？`,
       `Estimating maximum heart rate as 220 minus age, what is the target heart rate for a ${age}-year-old training at ${intensity}% of maximum, in beats per minute?`],
      [qty(target, '次', 'bpm'), ...d.map((v) => qty(v, '次', 'bpm'))],
      [`最大心率 $\\approx 220 - ${age} = ${maxHr}$ 次／分鐘，目標心率 $= ${maxHr} \\times ${intensity}\\% \\approx ${target}$ 次／分鐘。⚠️「220 減年齡」只是一條【粗略】公式，同齡者之間的實際最大心率相差可達正負十餘次 —— 它用作訂立訓練區間的起點可以，用作判斷某人是否超標則不可靠。`,
       `Maximum heart rate $\\approx 220 - ${age} = ${maxHr}$ bpm, so the target is $${maxHr} \\times ${intensity}\\% \\approx ${target}$ bpm. NOTE that "220 minus age" is only a ROUGH formula: actual maxima among people of the same age vary by more than ten beats either way. It is serviceable for setting a starting zone but unreliable for judging whether an individual has exceeded their limit.`])
  }
}

// ── 生物力學與能量系統 ────────────────────────────────────────────────────

// SY1 — 能量系統：不同時長的主要供能系統貢獻
for (const totalKj of [200, 300, 400, 500, 600, 800, 1000, 1200, 1500]) {
  for (const pct of [10, 20, 30, 40, 60, 70, 80]) {
    const part = (totalKj * pct) / 100
    if (!Number.isInteger(part)) continue
    const d = distract(part, [totalKj - part, pct, totalKj])
    if (d.length < 3) continue
    b.add(`peb2_sy1_${totalKj}_${pct}`, T.systems, FW.apply, 'medium',
      [`一項運動合共消耗 ${totalKj} 千焦能量，其中有氧系統供應 ${pct}%。有氧系統供應了多少千焦？`,
       `An activity uses ${totalKj} kJ of energy in total, of which the aerobic system supplies ${pct}%. How many kJ does the aerobic system provide?`],
      [qty(part, '千焦', 'kJ'), ...d.map((v) => qty(v, '千焦', 'kJ'))],
      [`有氧供能 = $${totalKj} \\times ${pct}\\% = ${part}$ 千焦，其餘 ${totalKj - part} 千焦由無氧系統供應。三個能量系統【並非輪流開關】，而是同時運作、比重隨時間改變：起步數秒以磷酸原為主，其後糖解系統接手，一分鐘之後有氧系統的比重才逐步上升。所謂「某系統供能」指的是比重而非唯一來源。`,
       `Aerobic supply = $${totalKj} \\times ${pct}\\% = ${part}$ kJ, leaving ${totalKj - part} kJ from anaerobic sources. The three energy systems do NOT switch on and off in turn; all run together with the balance shifting over time — phosphagen dominates the first seconds, glycolysis takes over next, and the aerobic share rises only after about a minute. Saying a system "supplies" energy means its share, not that it is the only source.`])
  }
}

// ── 營養與健康 ────────────────────────────────────────────────────────────

// NU1 — 體重指數（BMI）
for (const kg of [45, 50, 55, 60, 64, 68, 70, 75, 80, 85, 90]) {
  for (const cm of [150, 155, 160, 165, 170, 175, 180, 185]) {
    const m2 = (cm / 100) ** 2
    const bmi = Math.round((kg / m2) * 10) / 10
    const d = distract(bmi, [kg, cm, Math.round((kg / (cm / 100)) * 10) / 10])
    if (d.length < 3) continue
    b.add(`peb2_nu1_${kg}_${cm}`, T.nutrition, FW.apply, 'easy',
      [`一名運動員體重 ${kg} 公斤、身高 ${cm} 厘米。其體重指數（BMI）約為多少？`,
       `An athlete weighs ${kg} kg and is ${cm} cm tall. What is their approximate body mass index?`],
      [qty(bmi, '', ''), ...d.map((v) => qty(v, '', ''))],
      [`BMI = 體重 ÷ 身高的平方 = $${kg} \\div ${(cm / 100).toFixed(2)}^2 = ${kg} \\div ${m2.toFixed(4)} \\approx ${bmi}$。⚠️ BMI 不區分【肌肉與脂肪】，故對運動員的參考價值有限：一名肌肉量高的運動員 BMI 可能落在「超重」範圍，而體脂率其實很低。評估運動員應同時看體脂率與圍度，不可只憑一個 BMI 下判斷。`,
       `BMI = mass ÷ height squared = $${kg} \\div ${(cm / 100).toFixed(2)}^2 = ${kg} \\div ${m2.toFixed(4)} \\approx ${bmi}$. NOTE that BMI cannot distinguish MUSCLE from FAT, so it tells you little about an athlete: a heavily muscled competitor can score in the "overweight" band with a very low body-fat percentage. Assessing athletes requires body-fat percentage and girth measurements alongside, never a BMI alone.`])
  }
}

// ── 體適能與訓練 ──────────────────────────────────────────────────────────

// FT1 — 訓練負荷 = 重量 × 組數 × 每組次數
for (const weight of [20, 30, 40, 50, 60, 80, 100]) {
  for (const sets of [3, 4, 5]) {
    for (const reps of [6, 10, 12]) {
      const load = weight * sets * reps
      const d = distract(load, [weight * reps, weight * sets, weight + sets + reps])
      if (d.length < 3) continue
      b.add(`peb2_ft1_${weight}_${sets}_${reps}`, T.fitness, FW.apply, 'easy',
        [`一項阻力訓練以 ${weight} 公斤進行 ${sets} 組、每組 ${reps} 次。該項訓練的總負荷量為多少公斤？`,
         `A resistance exercise is performed with ${weight} kg for ${sets} sets of ${reps} repetitions. What is the total training volume, in kg?`],
        [qty(load, '公斤', 'kg'), ...d.map((v) => qty(v, '公斤', 'kg'))],
        [`總負荷 = $${weight} \\times ${sets} \\times ${reps} = ${load}$ 公斤。總負荷量是監控訓練進度的常用指標，但【單看它會誤導】：同樣是 ${load} 公斤，以重量大而次數少的方式完成，訓練的是最大肌力；以重量小而次數多的方式完成，訓練的是肌耐力。兩者的適應完全不同，而總負荷量看不出分別。`,
         `Total volume = $${weight} \\times ${sets} \\times ${reps} = ${load}$ kg. Volume is a common way to track progress but READING IT ALONE MISLEADS: the same ${load} kg reached with heavy weights and few reps builds maximal strength, while light weights and many reps build endurance. The adaptations differ entirely and the volume figure cannot tell them apart.`])
    }
  }
}

// ── 運動與社會 ────────────────────────────────────────────────────────────

// SO1 — 參與率
for (const participants of [120, 240, 300, 360, 480, 600, 900, 1200]) {
  for (const population of [1200, 2000, 2400, 3000, 4000, 6000]) {
    if (participants > population) continue
    const pct = Math.round((participants / population) * 1000) / 10
    const d = distract(pct, [participants, population - participants, Math.round((population / participants) * 10) / 10])
    if (d.length < 3) continue
    b.add(`peb2_so1_${participants}_${population}`, T.society, FW.apply, 'easy',
      [`某社區共 ${population} 名居民，其中 ${participants} 人每週參與體育活動。體育參與率為多少百分比？`,
       `A community of ${population} residents includes ${participants} who take part in sport weekly. What is the participation rate, as a percentage?`],
      [qty(pct, '%', '%'), ...d.map((v) => qty(v, '%', '%'))],
      [`參與率 = $${participants} \\div ${population} \\times 100\\% = ${pct}\\%$。留意這個數字【不會告訴你誰沒有參與】：參與率相同的兩個社區，可以一個是各年齡層平均參與，另一個是青年踴躍而長者近乎為零。制訂政策要看的是分項數據，總參與率只能用來比較不同時間的同一社區。`,
       `Participation = $${participants} \\div ${population} \\times 100\\% = ${pct}\\%$. Note this figure says NOTHING ABOUT WHO IS ABSENT: two communities with the same rate may differ entirely, one participating evenly across ages and the other carried by the young with almost no older participants. Policy needs the disaggregated data; an overall rate is useful only for comparing one community across time.`])
  }
}

// ── 運動生理計算 ──────────────────────────────────────────────────────────

// PC1 — 攝氧量：相對攝氧量 = 絕對攝氧量 ÷ 體重
for (const absL of [2, 2.5, 3, 3.5, 4, 4.5, 5]) {
  for (const kg of [50, 60, 70, 75, 80]) {
    const rel = Math.round(((absL * 1000) / kg) * 10) / 10
    const d = distract(rel, [absL, kg, Math.round((kg / absL) * 10) / 10])
    if (d.length < 3) continue
    b.add(`peb2_pc1_${String(absL).replace('.', 'p')}_${kg}`, T.physcalc, FW.apply, 'hard',
      [`一名體重 ${kg} 公斤的運動員，其最大攝氧量為每分鐘 ${absL} 公升。以相對值表示，其最大攝氧量為每公斤每分鐘多少毫升？`,
       `An athlete weighing ${kg} kg has a maximal oxygen uptake of ${absL} litres per minute. Expressed relative to body mass, what is it in mL per kg per minute?`],
      [qty(rel, '毫升', 'mL'), ...d.map((v) => qty(v, '毫升', 'mL'))],
      [`先把公升換成毫升：$${absL} \\times 1000 = ${absL * 1000}$ 毫升／分鐘，再除以體重得 $${absL * 1000} \\div ${kg} \\approx ${rel}$ 毫升／公斤／分鐘。⚠️ 用【絕對值】還是【相對值】會改變結論：體重較大的運動員絕對攝氧量通常較高，但在需要移動自身體重的項目（長跑、爬山）中，決定表現的是相對值。划艇等體重由器材承托的項目則相反。`,
       `Convert to millilitres first: $${absL} \\times 1000 = ${absL * 1000}$ mL per minute, then divide by mass for $${absL * 1000} \\div ${kg} \\approx ${rel}$ mL per kg per minute. NOTE that absolute and relative figures lead to different conclusions: heavier athletes usually have higher absolute uptake, but where the body must be carried — distance running, hill climbing — the relative figure decides performance. In rowing, where the craft carries the weight, the opposite holds.`])
  }
}

// ── 生物力學 ──────────────────────────────────────────────────────────────

// BM1 — 平均速度 = 距離 ÷ 時間
for (const metres of [100, 200, 400, 800, 1500, 3000, 5000]) {
  for (const sec of [10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100, 150, 200, 300, 400, 500, 600, 800]) {
    const speed = Math.round((metres / sec) * 100) / 100
    if (speed > 12 || speed < 2) continue
    const d = distract(speed, [metres, sec, Math.round((sec / metres) * 100) / 100])
    if (d.length < 3) continue
    b.add(`peb2_bm1_${metres}_${sec}`, T.biomech, FW.apply, 'easy',
      [`一名跑手以 ${sec} 秒完成 ${metres} 米。其平均速度為每秒多少米？`,
       `A runner covers ${metres} m in ${sec} seconds. What is the average speed, in metres per second?`],
      [qty(speed, '米', 'm'), ...d.map((v) => qty(v, '米', 'm'))],
      [`平均速度 = 距離 ÷ 時間 = $${metres} \\div ${sec} = ${speed}$ 米／秒。要留意這是【平均】速度：短跑的實際速度曲線由零加速至最高，再輕微下降，全程沒有一刻等於平均值。分析技術動作時看的是瞬時速度，而平均速度只能用來比較整體表現。`,
       `Average speed = distance ÷ time = $${metres} \\div ${sec} = ${speed}$ m per second. Note this is the AVERAGE: a sprinter's actual curve rises from zero to a peak and then eases slightly, and at no instant equals the mean. Technique analysis needs instantaneous speed; the average serves only to compare overall performances.`])
  }
}

export const peBank4Questions: Question[] = b.bank
