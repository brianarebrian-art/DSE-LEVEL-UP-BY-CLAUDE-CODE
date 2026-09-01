import type { Question } from './types'
import { createBank, n, qty, round, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// pe-bank.ts —— 體育科參數化母模板（2026-08-29）
// ---------------------------------------------------------------------------
// 第六批。pe_physiology_calc（58）與 sport_society（57）為全科最厚，
// 兩者均不碰；只為其餘八個介乎 10 至 16 條的課題出題。
//
// 撰寫前的迴圈估算（前五批的教訓見下）：每組數值模板目標 25 至 45 條，
// 分類型模板約 8 至 16 條，令八個薄弱課題各自落在 40 至 60 之間。
//
// ⚠️ 三項在前五批重複觸閘的錯誤，本檔逐項防範：
//   一、英文選項夾雜中文（地理 IN1、音樂 EL2／IS2、科技與生活 ST1，共四次）。
//      本檔【所有】選項一律寫成明確的 [zh, en] 對，並且干擾項由具名的雙語
//      資料表取出，不從只有中文的清單構造。
//   二、數值範圍共用邊界，導致題幹相同而正確答案互相否定（音樂 EL2）。
//      本檔凡以區間分類者，取值一律落在區間內部。
//   三、單一模板產出過多而落在原已最厚的課題（地理 RC1、科技與生活 NU1）。
//      本檔每組模板的目標產出已於上方列明。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  anatomy: { id: 'anatomy', zh: '解剖學', en: 'Anatomy' },
  physiology: { id: 'physiology', zh: '運動生理學', en: 'Exercise Physiology' },
  biomech: { id: 'biomechanics', zh: '生物力學', en: 'Biomechanics' },
  nutrition: { id: 'nutrition_health', zh: '營養與健康', en: 'Nutrition & Health' },
  injuries: { id: 'injuries', zh: '運動創傷', en: 'Sports Injuries' },
  psych: { id: 'psychology', zh: '運動心理學', en: 'Sport Psychology' },
  fitness: { id: 'fitness_training', zh: '體適能與訓練', en: 'Fitness & Training' },
  systems: { id: 'pe_biomech_systems', zh: '生物力學與能量系統', en: 'Biomechanics & energy systems' },
} satisfies Record<string, TopicMeta>

const FW = {
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
} satisfies Record<string, FwMeta>

const b = createBank('pe')
const distract = (correct: number, cands: number[]): number[] =>
  cands.filter((v, i, a) => v !== correct && a.indexOf(v) === i && Number.isFinite(v) && v > 0).slice(0, 3)

// ── 體適能與訓練（目標約 45 條）────────────────────────────────────────────

// FT1 — 最大心率與目標心率區間
for (const age of [14, 15, 16, 17, 18, 20, 25, 30]) {
  for (const pct of [60, 70, 80, 85]) {
    const mhr = 220 - age
    const target = Math.round((mhr * pct) / 100)
    const d = distract(target, [mhr, Math.round(mhr * (pct / 100) * 2), age * pct])
    if (d.length < 3) continue
    b.add(`peb_ft1_${age}_${pct}`, T.fitness, FW.apply, pct <= 60 ? 'easy' : pct >= 85 ? 'hard' : 'medium',
      [`以「220 減年齡」估算最大心率。一名 ${age} 歲學生若要以最大心率的 ${pct}% 進行訓練，目標心率約為每分鐘多少次？`,
       `Using "220 minus age" to estimate maximum heart rate, what target heart rate should a ${age}-year-old aim for when training at ${pct}% of maximum?`],
      [qty(target, '次／分鐘', 'beats/min'), ...d.map((v) => qty(v, '次／分鐘', 'beats/min'))],
      [`估算最大心率 = $220 - ${age} = ${mhr}$ 次／分鐘，目標心率 = $${mhr} \\times ${pct}\\% \\approx ${target}$ 次／分鐘。要留意「220 減年齡」只是【群體平均的粗略估算】，個體差異可達每分鐘正負十餘次，故訓練時應同時參考自覺運動強度，而非單憑心率數字。一般有氧訓練建議落在最大心率的 60% 至 85% 之間。`,
       `Estimated maximum heart rate = $220 - ${age} = ${mhr}$ beats/min, so the target is $${mhr} \\times ${pct}\\% \\approx ${target}$ beats/min. Note that "220 minus age" is only a ROUGH POPULATION ESTIMATE: individual variation can exceed ten beats either way, so training should also be guided by perceived exertion rather than the number alone. General aerobic training is usually placed between 60% and 85% of maximum.`])
  }
}

// FT2 — 身體質量指數
for (const kg of [45, 52, 58, 63, 70, 78, 85]) {
  for (const cm of [150, 158, 165, 172, 180]) {
    const m = cm / 100
    const bmi = kg / (m * m)
    const d = distract(round(bmi, 1) as unknown as number, [kg / m, kg * m, kg - cm])
    if (d.length < 3) continue
    b.add(`peb_ft2_${kg}_${cm}`, T.fitness, FW.apply, cm === 150 || cm === 180 ? 'easy' : 'medium',
      [`一名學生體重 ${kg} 公斤、身高 ${cm} 厘米。其身體質量指數約為多少？`,
       `A student weighs ${kg} kg and is ${cm} cm tall. What is the approximate body mass index?`],
      [n(`$${round(bmi, 1)}$`), ...d.map((v) => n(`$${round(v, 1)}$`))],
      [`身體質量指數 = 體重（公斤）÷ 身高（米）的平方 = $\\dfrac{${kg}}{${round(m, 2)}^2} \\approx ${round(bmi, 1)}$。最常見的失分位是身高未由厘米換成米。此外要理解此指標的限制：它不區分肌肉與脂肪，故肌肉量高的運動員可能被歸入超重組別，而體脂偏高但體重正常者則可能被遺漏——評估體適能不應單看一個數字。`,
       `BMI = mass in kilograms ÷ the square of height in metres = $\\dfrac{${kg}}{${round(m, 2)}^2} \\approx ${round(bmi, 1)}$. The commonest error is leaving height in centimetres. Note also the index's limits: it does not distinguish muscle from fat, so a muscular athlete may be classed as overweight while someone of normal weight but high body fat is missed — fitness should never be judged on one number alone.`])
  }
}

// ── 運動生理學（目標約 40 條）──────────────────────────────────────────────

// PH1 — 能量系統與運動時間
const energy: Array<[string, string, string, string, number, number]> = [
  ['磷酸原系統（ATP-PC）', 'the ATP-PC system', '極短時間、極高強度，無氧且不產生乳酸', 'very brief and very intense, anaerobic and producing no lactate', 0, 10],
  ['乳酸系統（無氧糖酵解）', 'the lactic acid system', '短時間高強度，無氧並累積乳酸', 'short and intense, anaerobic and accumulating lactate', 11, 120],
  ['有氧系統', 'the aerobic system', '長時間中低強度，需持續供氧', 'prolonged and moderate, requiring a continuous oxygen supply', 180, 3600],
]
for (const [zh, en, desc, descEn, lo, hi] of energy) {
  for (const sec of [lo + Math.round((hi - lo) * 0.2), Math.round((lo + hi) / 2), hi - Math.round((hi - lo) * 0.2)]) {
    const others = energy.filter((e) => e[0] !== zh)
    b.add(`peb_ph1_${en.slice(4, 10)}_${sec}`, T.physiology, FW.logic, 'medium',
      [`一項運動持續約 ${sec} 秒且以最大努力進行，主要由哪一個能量系統供能？`,
       `An all-out effort lasting about ${sec} seconds draws mainly on which energy system?`],
      [[zh, en], ...others.map((e) => [e[0], e[1]] as [string, string]),
       ['三個系統平均分擔，與時間長短無關', 'all three contribute equally, regardless of duration']],
      [`約 ${sec} 秒的最大努力主要由${zh}供能，其特徵是${desc}。三個系統的分工由【持續時間與強度】決定：時間愈短、強度愈高，愈依賴無氧途徑。要留意三者並非開關式切換，而是同時運作、比重隨時間改變——即使短跑，有氧系統亦有少量貢獻，只是不佔主導。`,
       `An all-out effort of about ${sec} seconds relies mainly on ${en}, which is ${descEn}. The division of labour is set by DURATION AND INTENSITY: the shorter and harder the effort, the greater the reliance on anaerobic pathways. Note that the systems do not switch on and off but operate together, with their relative contributions shifting over time — even a sprint draws a little on the aerobic system, though not predominantly.`])
  }
}

// PH2 — 攝氧量與運動強度
for (const vo2max of [40, 45, 50, 55, 60]) {
  for (const pct of [50, 60, 70, 80]) {
    const working = (vo2max * pct) / 100
    if (!Number.isInteger(working * 10)) continue
    const d = distract(working, [vo2max, vo2max - working, vo2max * 2])
    if (d.length < 3) continue
    b.add(`peb_ph2_${vo2max}_${pct}`, T.physiology, FW.apply, pct >= 80 ? 'hard' : 'medium',
      [`某運動員的最大攝氧量為每公斤每分鐘 ${vo2max} 毫升。若以最大攝氧量的 ${pct}% 運動，其攝氧量約為多少？`,
       `An athlete has a maximal oxygen uptake of ${vo2max} ml per kg per minute. Working at ${pct}% of maximum, what is the oxygen uptake?`],
      [qty(round(working, 1), '毫升／公斤／分鐘', 'ml/kg/min'), ...d.map((v) => qty(round(v, 1), '毫升／公斤／分鐘', 'ml/kg/min'))],
      [`運動時攝氧量 = 最大攝氧量 × 相對強度 = $${vo2max} \\times ${pct}\\% = ${round(working, 1)}$ 毫升／公斤／分鐘。最大攝氧量是心肺耐力的核心指標，其單位以【每公斤體重】表示，正是為了令不同體型的人可以比較。訓練可提升此值，但提升幅度受遺傳影響甚大，故不宜把它當成努力程度的量度。`,
       `Oxygen uptake during exercise = maximal uptake × relative intensity = $${vo2max} \\times ${pct}\\% = ${round(working, 1)}$ ml/kg/min. Maximal oxygen uptake is the central measure of cardiorespiratory endurance, and it is expressed PER KILOGRAM of body mass precisely so that people of different sizes can be compared. Training raises it, but the extent is strongly influenced by heredity, so it should not be read as a measure of effort.`])
  }
}

// ── 生物力學（目標約 40 條）────────────────────────────────────────────────

// BM1 — 功 = 力 × 距離
for (const force of [50, 80, 120, 200, 300, 450]) {
  for (const dist of [0.5, 1, 1.5, 2, 3]) {
    const work = force * dist
    const d = distract(work, [force + dist, force / dist, work / 2])
    if (d.length < 3) continue
    b.add(`peb_bm1_${force}_${String(dist).replace('.', '')}`, T.biomech, FW.apply, dist === 1 ? 'easy' : 'medium',
      [`一名運動員以 ${force} 牛頓的力，把槓鈴垂直舉高 ${dist} 米。所作的功是多少焦耳？`,
       `An athlete lifts a barbell ${dist} m vertically with a force of ${force} N. How much work is done, in joules?`],
      [qty(round(work, 1), '焦耳', 'J'), ...d.map((v) => qty(round(v, 1), '焦耳', 'J'))],
      [`功 = 力 × 沿力方向的位移 = $${force} \\times ${dist} = ${round(work, 1)}$ 焦耳。要留意「沿力方向」這個條件：橫向平移槓鈴時，重力方向並無位移，該部分不計功。這解釋了一個常見疑問——為何舉重時把槓鈴停在半空「很辛苦」卻不作功：肌肉持續耗能維持等長收縮，但物體沒有移動，力學上的功為零。`,
       `Work = force × displacement IN THE DIRECTION OF THE FORCE = $${force} \\times ${dist} = ${round(work, 1)}$ J. The direction condition matters: moving the bar sideways involves no displacement against gravity, so that part contributes no work. It also answers a common puzzle — why holding a barbell still is exhausting yet does no work: the muscles keep consuming energy in an isometric contraction, but nothing moves, so mechanically the work is zero.`])
  }
}

// BM2 — 功率 = 功 ÷ 時間
for (const work of [600, 900, 1200, 1800, 2400]) {
  for (const t of [2, 3, 4, 6]) {
    const power = work / t
    if (!Number.isInteger(power)) continue
    const d = distract(power, [work * t, work - t, t / work])
    if (d.length < 3) continue
    b.add(`peb_bm2_${work}_${t}`, T.biomech, FW.apply, t <= 3 ? 'easy' : 'medium',
      [`某動作所作的功為 ${work} 焦耳，用時 ${t} 秒。平均功率是多少瓦特？`,
       `A movement performs ${work} J of work in ${t} seconds. What is the mean power output in watts?`],
      [qty(power, '瓦特', 'W'), ...d.map((v) => qty(round(v, 1), '瓦特', 'W'))],
      [`功率 = 功 ÷ 時間 = $\\dfrac{${work}}{${t}} = ${power}$ 瓦特。功率反映的是【做功的速率】，這正是爆發力項目的關鍵：兩名運動員舉起同一重量到同一高度，所作的功相同，但用時較短者功率較高。訓練上，最大肌力與爆發力因而需要不同的處方。`,
       `Power = work ÷ time = $\\dfrac{${work}}{${t}} = ${power}$ W. Power expresses the RATE of doing work, which is what explosive events depend on: two athletes lifting the same load to the same height do identical work, but the faster one produces more power. Maximal strength and explosive power therefore require different training prescriptions.`])
  }
}

// ── 解剖學（目標約 32 條）──────────────────────────────────────────────────

const joints: Array<[string, string, string, string, string, string]> = [
  ['肩關節', 'the shoulder', '球窩關節', 'ball-and-socket joint', '活動範圍最大，可作三個平面的運動，但穩定性相對較低', 'the widest range, moving in three planes, but relatively less stable'],
  ['肘關節', 'the elbow', '屈戍關節', 'hinge joint', '只可在一個平面屈伸，穩定性高', 'flexion and extension in one plane only, and highly stable'],
  ['髖關節', 'the hip', '球窩關節', 'ball-and-socket joint', '同為球窩關節但窩較深，故穩定性高於肩關節', 'also ball-and-socket but with a deeper socket, hence more stable than the shoulder'],
  ['膝關節', 'the knee', '屈戍關節', 'hinge joint', '主要屈伸，屈曲時容許少量旋轉，故易受扭轉創傷', 'mainly flexion and extension, with slight rotation when flexed, hence vulnerable to twisting injuries'],
  ['踝關節', 'the ankle', '屈戍關節', 'hinge joint', '背屈與蹠屈為主，外側韌帶較弱，內翻扭傷最為常見', 'chiefly dorsiflexion and plantarflexion, with weaker lateral ligaments, so inversion sprains are the commonest injury'],
  ['橈尺近端關節', 'the proximal radioulnar joint', '樞軸關節', 'pivot joint', '容許前臂旋前與旋後，是投擲與球拍項目的關鍵', 'allows pronation and supination of the forearm, key to throwing and racket sports'],
  ['腕關節', 'the wrist', '髁狀關節', 'condyloid joint', '可作屈伸與內收外展，但不能自主旋轉', 'flexion, extension, abduction and adduction, but no independent rotation'],
]
for (const [zh, en, type, typeEn, prop, propEn] of joints) {
  for (const q of ['類型', '特性']) {
    const others = joints.filter((j) => j[0] !== zh)
    if (q === '類型') {
      // 每加一個新關節，其類型必須同時出現在此清單，否則 find 回傳 undefined。
      const typeOpts: Array<[string, string]> = [
        ['球窩關節', 'ball-and-socket joint'], ['屈戍關節', 'hinge joint'],
        ['樞軸關節', 'pivot joint'], ['滑動關節', 'gliding joint'],
        ['髁狀關節', 'condyloid joint'], ['鞍狀關節', 'saddle joint'],
      ]
      const correct = typeOpts.find((t) => t[0] === type)
      if (!correct) continue
      b.add(`peb_an1_${en.slice(4)}_t`, T.anatomy, FW.logic, 'easy',
        [`${zh}屬於哪一類滑膜關節？`, `What type of synovial joint is ${en}?`],
        [correct, ...typeOpts.filter((t) => t !== correct).slice(0, 3)],
        [`${zh}屬${type}。關節類型直接決定可作的動作與受傷的模式：球窩關節活動範圍大而穩定性較低，屈戍關節則相反。分析運動技術或創傷成因時，第一步就是確認涉及哪一類關節，因為它限定了哪些動作在解剖上根本不可能發生。`,
         `${en.charAt(0).toUpperCase() + en.slice(1)} is a ${typeEn}. Joint type determines both the movements available and the pattern of injury: a ball-and-socket joint offers wide movement with less stability, and a hinge joint the reverse. When analysing technique or the mechanism of an injury, the first step is to identify the joint type, since it fixes which movements are anatomically possible at all.`])
    } else {
      b.add(`peb_an1_${en.slice(4)}_p`, T.anatomy, FW.apply, 'medium',
        [`就${zh}而言，以下哪一項最準確描述其活動特性？`, `Which statement best describes the movement characteristics of ${en}?`],
        [[prop, propEn], ...others.slice(0, 3).map((j) => [j[4], j[5]] as [string, string])],
        [`${zh}的特性為：${prop}。要掌握的通則是【活動範圍與穩定性互為代價】：關節窩愈淺、韌帶愈鬆，可動範圍愈大而愈易脫位；反之則穩定而受限。肩與髖同為球窩關節而穩定性懸殊，正是這條通則最清楚的例證。`,
         `${en.charAt(0).toUpperCase() + en.slice(1)} offers ${propEn}. The general principle is that RANGE AND STABILITY TRADE OFF: the shallower the socket and the looser the ligaments, the greater the movement and the greater the risk of dislocation; the reverse gives stability at the cost of range. The shoulder and the hip, both ball-and-socket yet very different in stability, are the clearest illustration.`])
    }
  }
}

// ── 運動創傷（目標約 24 條）────────────────────────────────────────────────

for (const [zh, en, first, firstEn] of [
  ['肌肉拉傷', 'a muscle strain', '立即停止活動，冷敷、加壓、抬高患處，休息後按情況求醫', 'stop at once, then rest, ice, compress and elevate, seeking care as required'],
  ['腳踝扭傷', 'an ankle sprain', '立即停止活動，冷敷、加壓、抬高患處，避免負重', 'stop at once, then rest, ice, compress and elevate, avoiding weight-bearing'],
  ['中暑', 'heat stroke', '立即移至陰涼處、降低體溫、補充水分並盡快求醫', 'move to shade at once, cool the body, give fluids and seek medical help urgently'],
  ['擦傷', 'an abrasion', '清潔傷口、以清水沖洗、覆蓋敷料防止感染', 'clean the wound, rinse with water and cover it to prevent infection'],
  ['抽筋', 'a muscle cramp', '停止動作、緩慢伸展該肌肉並補充水分與電解質', 'stop, stretch the muscle slowly, and replace fluid and electrolytes'],
  ['腦震盪', 'a concussion', '立即離場、不可自行返回比賽，並須由醫護評估', 'leave the field at once, never return to play unassessed, and obtain medical evaluation'],
] as Array<[string, string, string, string]>) {
  for (const v of ['處理', '禁忌']) {
    if (v === '處理') {
      b.add(`peb_in1_${en.slice(2, 10)}_a`, T.injuries, FW.apply, 'easy',
        [`運動期間發生${zh}，即時處理應如何進行？`, `What is the immediate management of ${en} during sport?`],
        [[first, firstEn],
         ['繼續完成訓練，待練習結束後再處理', 'finish the session first and deal with it afterwards'],
         ['立即熱敷並按摩患處以促進血液循環', 'apply heat and massage the area at once to improve circulation'],
         ['自行服用止痛藥後繼續參與比賽', 'take painkillers and continue competing']],
        [`${zh}的即時處理為：${first}。共通原則是【先停止、後處理】：繼續活動會令損傷擴大。要特別留意急性期【不可】熱敷或按摩——兩者促進血流，會加劇腫脹與出血；熱敷與按摩屬康復後期的手段。以止痛藥掩蓋痛感而繼續比賽尤其危險，因為痛楚正是限制進一步損傷的保護訊號。`,
         `The immediate management of ${en} is to ${firstEn}. The common principle is STOP FIRST, then treat: continuing makes the injury worse. Note particularly that heat and massage are contraindicated in the acute phase — both increase blood flow and so worsen swelling and bleeding; they belong to later rehabilitation. Masking pain with analgesics to keep competing is especially dangerous, since pain is the protective signal limiting further damage.`])
    } else {
      b.add(`peb_in1_${en.slice(2, 10)}_b`, T.injuries, FW.logic, 'hard',
        [`就${zh}的急性期處理而言，以下哪一項屬於禁忌？`, `Which of the following is contraindicated in the acute phase of ${en}?`],
        [['熱敷、按摩、飲酒與繼續活動', 'heat, massage, alcohol and continued activity'],
         ['冷敷與抬高患處', 'ice and elevation'],
         ['適度加壓包紮', 'moderate compression bandaging'],
         ['讓患處充分休息', 'resting the affected part']],
        [`急性期的四項禁忌可記為熱敷、按摩、飲酒、活動。四者的共通點是【增加患處血流或機械負荷】，因而加劇腫脹、出血與組織損傷。與之相對，冷敷、加壓、抬高、休息四項的作用剛好相反，是急性期的標準處理。分辨方法很簡單：問這個做法會令血流增加還是減少。`,
         `The four contraindications in the acute phase are heat, massage, alcohol and activity. What they share is that each INCREASES BLOOD FLOW OR MECHANICAL LOAD at the site, worsening swelling, bleeding and tissue damage. Ice, compression, elevation and rest do the opposite and are the standard acute measures. The test is simple: ask whether the action raises or lowers blood flow to the area.`])
    }
  }
}

// ── 運動心理學（目標約 24 條）──────────────────────────────────────────────

for (const [zh, en, def, defEn] of [
  ['內在動機', 'intrinsic motivation', '出於活動本身帶來的興趣與滿足而參與', 'taking part for the interest and satisfaction the activity itself provides'],
  ['外在動機', 'extrinsic motivation', '出於獎項、金錢或他人認同等外部誘因而參與', 'taking part for external rewards such as prizes, money or recognition'],
  ['目標設定', 'goal setting', '訂立具體、可量度而具挑戰性的目標以引導努力', 'setting specific, measurable and challenging targets to direct effort'],
  ['意象訓練', 'imagery training', '在心中反覆演練動作以強化神經肌肉的協調', 'rehearsing movements mentally to strengthen neuromuscular coordination'],
  ['喚醒水平', 'arousal level', '生理與心理的激活程度，過低或過高均會令表現下降', 'the level of physiological and psychological activation, where too little or too much both impair performance'],
  ['自我效能', 'self-efficacy', '個人對自己能否完成特定任務的信念，影響努力程度與堅持', 'a person\'s belief in their capacity to carry out a specific task, shaping effort and persistence'],
] as Array<[string, string, string, string]>) {
  for (const v of ['定義', '應用']) {
    const others = [
      ['出於活動本身帶來的興趣與滿足而參與', 'taking part for the interest and satisfaction the activity itself provides'],
      ['出於獎項、金錢或他人認同等外部誘因而參與', 'taking part for external rewards such as prizes, money or recognition'],
      ['訂立具體、可量度而具挑戰性的目標以引導努力', 'setting specific, measurable and challenging targets to direct effort'],
      ['在心中反覆演練動作以強化神經肌肉的協調', 'rehearsing movements mentally to strengthen neuromuscular coordination'],
      ['生理與心理的激活程度，過低或過高均會令表現下降', 'the level of physiological and psychological activation, where too little or too much both impair performance'],
      ['個人對自己能否完成特定任務的信念，影響努力程度與堅持', 'a person\'s belief in their capacity to carry out a specific task, shaping effort and persistence'],
    ].filter((o) => o[0] !== def) as Array<[string, string]>
    if (v === '定義') {
      b.add(`peb_ps1_${en.slice(0, 8)}_d`, T.psych, FW.logic, 'easy',
        [`運動心理學中的「${zh}」指甚麼？`, `In sport psychology, what does ${en} refer to?`],
        [[def, defEn], ...others.slice(0, 3)],
        [`${zh}指${def}。要理解內在與外在動機的分別何以重要：長期堅持運動的人多以內在動機為主，因為外在誘因一旦撤走，行為往往隨之停止。過度強調獎賞甚至可能削弱原有的內在動機，故推廣體育參與時，設計上應讓參與者感受到勝任感與自主。`,
         `${en.charAt(0).toUpperCase() + en.slice(1)} means ${defEn}. The distinction between intrinsic and extrinsic motivation matters because those who sustain activity long term are usually intrinsically motivated: once an external incentive is withdrawn, the behaviour tends to stop with it. Heavy emphasis on rewards can even undermine existing intrinsic motivation, so programmes promoting participation should be designed to give participants a sense of competence and autonomy.`])
    } else {
      b.add(`peb_ps1_${en.slice(0, 8)}_u`, T.psych, FW.apply, 'medium',
        [`一名運動員在比賽前情緒緊張、注意力難以集中。就「${zh}」而言，最貼切的應用方式是甚麼？`,
         `An athlete is tense and unable to concentrate before competition. How is ${en} most appropriately applied here?`],
        [[def, defEn], ...others.slice(0, 3)],
        [`「${zh}」在此的應用即為：${def}。答運動心理學的應用題，須把概念與【具體處境】扣連，而非複述定義。要留意各種心理技巧並非萬用：緊張的成因是準備不足、對結果過度在意，抑或缺乏比賽經驗，介入手段並不相同——先辨明成因，再選技巧。`,
         `Applied here, ${en} means ${defEn}. An applied question in sport psychology requires the concept to be tied to the SPECIFIC SITUATION rather than defined again. Note that no technique is universal: tension arising from inadequate preparation, from over-investment in the outcome, or from inexperience calls for different interventions — identify the cause first, then choose the technique.`])
    }
  }
}

// ── 營養與健康（目標約 30 條）──────────────────────────────────────────────

// NH1 — 運動時的水分流失補充
for (const before of [60, 62, 65, 68, 70, 75]) {
  for (const lossKg of [0.5, 0.8, 1.0, 1.2, 1.5]) {
    const after = before - lossKg
    const mlNeeded = Math.round(lossKg * 1000 * 1.5)
    const d = distract(mlNeeded, [lossKg * 1000, lossKg * 500, before * 10])
    if (d.length < 3) continue
    b.add(`peb_nh1_${before}_${String(lossKg).replace('.', '')}`, T.nutrition, FW.apply, lossKg <= 0.8 ? 'medium' : 'hard',
      [`一名運動員訓練前體重 ${before} 公斤，訓練後為 ${round(after, 1)} 公斤。若按流失量的 1.5 倍補充水分，應攝取約多少毫升？`,
       `An athlete weighs ${before} kg before training and ${round(after, 1)} kg after. Replacing 1.5 times the loss, roughly how many millilitres should be drunk?`],
      [qty(mlNeeded, '毫升', 'ml'), ...d.map((v) => qty(Math.round(v), '毫升', 'ml'))],
      [`體重差 = $${before} - ${round(after, 1)} = ${lossKg}$ 公斤，主要為水分流失。1 公斤約相當於 1000 毫升，按 1.5 倍補充得 $${lossKg} \\times 1000 \\times 1.5 \\approx ${mlNeeded}$ 毫升。之所以要補多於流失量，是因為攝入的水分有一部分會經尿液排出，故按等量補充並不足以回復水平衡。補充亦應分次進行，一次過大量飲用既不易吸收，亦可能引致不適。`,
       `The change in mass, $${before} - ${round(after, 1)} = ${lossKg}$ kg, is mostly fluid. Since 1 kg corresponds to about 1000 ml, replacing 1.5 times gives $${lossKg} \\times 1000 \\times 1.5 \\approx ${mlNeeded}$ ml. More than the loss is needed because part of what is drunk is excreted as urine, so replacing an equal volume does not restore fluid balance. Replacement should also be spread over time: a single large volume is poorly absorbed and may cause discomfort.`])
  }
}

// ── 生物力學與能量系統（目標約 30 條）──────────────────────────────────────

// SY1 — 動量 = 質量 × 速度
for (const mass of [50, 60, 70, 80, 90]) {
  for (const v of [2, 3, 4, 5, 6, 8]) {
    const p = mass * v
    const d = distract(p, [mass + v, mass / v, p / 2])
    if (d.length < 3) continue
    b.add(`peb_sy1_${mass}_${v}`, T.systems, FW.apply, v <= 3 ? 'easy' : 'medium',
      [`一名質量 ${mass} 公斤的運動員以每秒 ${v} 米的速度移動。其動量是多少？`,
       `An athlete of mass ${mass} kg moves at ${v} m/s. What is the momentum?`],
      [qty(p, '公斤・米／秒', 'kg·m/s'), ...d.map((x) => qty(round(x, 1), '公斤・米／秒', 'kg·m/s'))],
      [`動量 = 質量 × 速度 = $${mass} \\times ${v} = ${p}$ 公斤・米／秒。動量在碰撞類項目中特別重要：要令對手停下，所需的衝量等於其動量的改變量。這解釋了為何欖球等項目同時重視體重與速度——兩者對動量的貢獻是相乘而非相加，速度提高一倍所增加的動量，與體重加倍相同。`,
       `Momentum = mass × velocity = $${mass} \\times ${v} = ${p}$ kg·m/s. It matters most in contact sports: the impulse needed to stop an opponent equals the change in their momentum. This is why codes such as rugby value mass and speed together — their contributions MULTIPLY rather than add, so doubling speed raises momentum exactly as much as doubling mass.`])
  }
}

export const peBank3Questions: Question[] = b.bank
