import type { Question } from './types'
import { createBank, qty, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// design-tech-bank2.ts —— 設計與應用科技參數化母模板・第二批（2026-09-03）
// ---------------------------------------------------------------------------
// 承接 design-tech-bank.ts。本科現為 465 條、分佈 22–92（4.2 倍）。
// 本檔為每課題目標 100 之下的九個課題出題，
// dat_mechanisms_calc(92) 只作小幅補足。
//
// ⚠️ 三條累積教訓（同日 ICT／生物／音樂三役），開工前先寫下：
//   ① 誘答必須互不相同【且代數上不恆等】—— 字面不同而數值恆等者，
//      整組會被 add() 靜默丟棄，審視源碼不會發現，只有實測產出數字揭穿。
//   ② 每個迴圈變數【必須出現在題幹】，否則同一條題被複製 n 次。
//   ③ 補量要用【值域夠寬的數值參數】，固定枚舉表項數封頂，補不了量。
// 上一批（科技與生活）先寫下這三條才開工，首版即達標、只需兩輪調整，
// 對比音樂五輪、地理六輪。故本檔照辦。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  reason: { id: 'dat_materials_reason', zh: '材料與結構・推理', en: 'Materials & structures — reasoning' },
  ergo: { id: 'ergonomics', zh: '人體工學', en: 'Ergonomics' },
  elements: { id: 'design_elements', zh: '設計元素與原則', en: 'Design Elements & Principles' },
  manufacturing: { id: 'manufacturing', zh: '生產工序', en: 'Manufacturing Processes' },
  sustain: { id: 'sustainability', zh: '可持續設計', en: 'Sustainable Design' },
  structures: { id: 'structures_mech', zh: '結構與機械', en: 'Structures & Mechanisms' },
  materials: { id: 'materials', zh: '材料與特性', en: 'Materials & Properties' },
  process: { id: 'design_process', zh: '設計過程', en: 'Design Process' },
  cad: { id: 'cad_cam', zh: '電腦輔助設計與製造', en: 'CAD / CAM' },
  mech: { id: 'dat_mechanisms_calc', zh: '結構與機械・計算', en: 'Structures & mechanisms — calculation' },
} satisfies Record<string, TopicMeta>

const FW = {
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
} satisfies Record<string, FwMeta>

const b = createBank('design-tech')

const distract = (correct: number, cands: number[]): number[] =>
  cands.filter((v, i, a) => v !== correct && a.indexOf(v) === i).slice(0, 3)

// ── 材料與結構・推理 ──────────────────────────────────────────────────────

// MR1 — 應力 = 力 ÷ 截面積
for (const force of [200, 400, 600, 800, 1000, 1500, 2000, 3000]) {
  for (const area of [2, 4, 5, 8, 10, 20]) {
    const stress = force / area
    if (!Number.isInteger(stress)) continue
    const d = distract(stress, [force * area, force - area, area / force])
    if (d.length < 3) continue
    b.add(`datb2_mr1_${force}_${area}`, T.reason, FW.apply, 'medium',
      [`一根桿件承受 ${force} 牛頓的拉力，其截面積為 ${area} 平方毫米。桿件所受的應力為每平方毫米多少牛頓？`,
       `A rod carries a tensile force of ${force} N over a cross-sectional area of ${area} mm². What is the stress, in N per mm²?`],
      [qty(stress, '牛頓', 'N'), ...d.map((v) => qty(v, '牛頓', 'N'))],
      [`應力 = 力 ÷ 截面積 = $${force} \\div ${area} = ${stress}$ 牛頓／平方毫米。同一個力落在【較細】的截面上，應力就【較大】—— 這正是零件在最幼的位置斷裂、而不是在受力最大的位置斷裂的原因。設計時要看的從來不是力本身，而是力除以截面。`,
       `Stress = force ÷ area = $${force} \\div ${area} = ${stress}$ N per mm². The SAME force on a SMALLER section gives a LARGER stress — which is why components fail at their thinnest point rather than where the load is greatest. What matters in design is never the force alone but the force divided by the section.`])
  }
}

// MR2 — 安全系數 = 極限強度 ÷ 工作應力
for (const ultimate of [200, 240, 300, 400, 480, 600, 800]) {
  for (const working of [40, 50, 60, 80, 100, 120]) {
    const sf = ultimate / working
    if (!Number.isInteger(sf)) continue
    const d = distract(sf, [ultimate - working, working / ultimate, ultimate + working])
    if (d.length < 3) continue
    b.add(`datb2_mr2_${ultimate}_${working}`, T.reason, FW.logic, 'medium',
      [`某材料的極限強度為 ${ultimate} 兆帕，設計時的工作應力定為 ${working} 兆帕。其安全系數為多少？`,
       `A material has an ultimate strength of ${ultimate} MPa and is designed to a working stress of ${working} MPa. What is the factor of safety?`],
      [qty(sf, '', ''), ...d.map((v) => qty(v, '', ''))],
      [`安全系數 = 極限強度 ÷ 工作應力 = $${ultimate} \\div ${working} = ${sf}$。系數愈大愈安全，但同時代表用料愈多、成本愈高、重量愈大 —— 所以航空器的安全系數比建築物低得多，不是因為安全較不重要，而是因為每一公斤重量都要付出燃料代價，故改以嚴格檢測與定期更換來補足。`,
       `Factor of safety = ultimate strength ÷ working stress = $${ultimate} \\div ${working} = ${sf}$. A larger factor is safer but also means more material, more cost and more weight — which is why aircraft run far lower factors than buildings. Not because safety matters less, but because every kilogram costs fuel, so rigorous inspection and scheduled replacement take up the slack instead.`])
  }
}

// ── 人體工學 ──────────────────────────────────────────────────────────────

// ER1 — 百分位設計：可容納人數 = 總人數 × 百分位範圍
for (const users of [200, 400, 500, 800, 1000, 1200, 1500, 2000]) {
  for (const lower of [2, 5, 10]) {
    for (const upper of [90, 95, 98]) {
      const covered = (users * (upper - lower)) / 100
      if (!Number.isInteger(covered)) continue
      const d = distract(covered, [(users * upper) / 100, (users * lower) / 100, users])
      if (d.length < 3) continue
      b.add(`datb2_er1_${users}_${lower}_${upper}`, T.ergo, FW.apply, 'hard',
        [`一款座椅按第 ${lower} 至第 ${upper} 百分位的身體尺寸設計。若使用者共 ${users} 人，理論上有多少人的尺寸落在設計範圍之內？`,
         `A chair is designed for the ${lower}th to ${upper}th percentile of body dimensions. Out of ${users} users, how many fall within the design range in theory?`],
        [qty(covered, '人', ''), ...d.map((v) => qty(v, '人', ''))],
        [`涵蓋範圍 = $${upper}\\% - ${lower}\\% = ${upper - lower}\\%$，故 $${users} \\times ${upper - lower}\\% = ${covered}$ 人。餘下 ${users - covered} 人不合用 —— 人體工學的核心取捨就在這裏：涵蓋範圍愈闊，設計愈難兼顧，成本亦愈高。所以並非「設計給所有人」，而是明確選定一個範圍，並承認範圍以外的人需要另一個方案。`,
         `The range covers $${upper}\\% - ${lower}\\% = ${upper - lower}\\%$, so $${users} \\times ${upper - lower}\\% = ${covered}$ people. The remaining ${users - covered} are not served — and that is the central trade-off in ergonomics: a wider range is harder to satisfy and costs more. The aim is never "design for everyone" but to choose a range explicitly and acknowledge that those outside it need a different solution.`])
    }
  }
}

// ── 設計元素與原則 ────────────────────────────────────────────────────────

// DE1 — 黃金比例的長邊
for (const shortSide of [20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 120, 150, 180, 200]) {
  const longSide = Math.round(shortSide * 1.618)
  const d = distract(longSide, [shortSide * 2, shortSide, Math.round(shortSide * 1.5)])
  if (d.length < 3) continue
  b.add(`datb2_de1_${shortSide}`, T.elements, FW.apply, 'easy',
    [`一個矩形按黃金比例（約 1:1.618）設計，短邊為 ${shortSide} 毫米。長邊約為多少毫米？`,
     `A rectangle follows the golden ratio of about 1:1.618 with a short side of ${shortSide} mm. What is the approximate long side, in mm?`],
    [qty(longSide, '毫米', 'mm'), ...d.map((v) => qty(v, '毫米', 'mm'))],
    [`長邊 $= ${shortSide} \\times 1.618 \\approx ${longSide}$ 毫米。黃金比例在設計中常被引用，但要留意它【不是】一條視覺法則 —— 沒有實驗證明人眼必然偏好這個比例。它的價值在於提供一個【一致的比例系統】：整套設計沿用同一比例，各部分之間就會呼應，而呼應本身才是觀感和諧的來源。`,
     `Long side $= ${shortSide} \\times 1.618 \\approx ${longSide}$ mm. The golden ratio is widely cited in design, but note it is NOT a law of perception — no experiment shows the eye must prefer it. Its value lies in giving a CONSISTENT proportional system: use one ratio throughout and the parts echo each other, and that echo, rather than the number, is what reads as harmony.`])
}

// DE2 — 縮放比例：圖上尺寸與實物尺寸
for (const real of [200, 400, 600, 800, 1200, 1600, 2000, 2400]) {
  for (const scale of [2, 4, 5, 8, 10, 20]) {
    const drawn = real / scale
    if (!Number.isInteger(drawn)) continue
    const d = distract(drawn, [real * scale, real - scale, scale])
    if (d.length < 3) continue
    b.add(`datb2_de2_${real}_${scale}`, T.elements, FW.apply, 'easy',
      [`一件實物長 ${real} 毫米，以 1:${scale} 的比例繪圖。圖上長度為多少毫米？`,
       `An object ${real} mm long is drawn at a scale of 1:${scale}. What is its length on the drawing, in mm?`],
      [qty(drawn, '毫米', 'mm'), ...d.map((v) => qty(v, '毫米', 'mm'))],
      [`1:${scale} 表示圖上 1 單位代表實物 ${scale} 單位，故圖上長度 = $${real} \\div ${scale} = ${drawn}$ 毫米。答 $${real * scale}$ 把比例讀反了 —— 冒號左邊永遠是【圖】，右邊是【物】。放大圖的比例寫成 ${scale}:1，兩者只差寫法次序，看錯一次尺寸就差 ${scale * scale} 倍。`,
       `A 1:${scale} scale means one unit on the drawing stands for ${scale} on the object, so the drawn length is $${real} \\div ${scale} = ${drawn}$ mm. Answering $${real * scale}$ reads the ratio backwards — the left of the colon is always the DRAWING and the right the OBJECT. An enlargement is written ${scale}:1, differing only in order, and misreading it puts the size out by a factor of ${scale * scale}.`])
  }
}

// ── 生產工序 ──────────────────────────────────────────────────────────────

// MF1 — 生產時間 = 件數 × 單件工時 + 設置時間
for (const items of [50, 100, 150, 200, 300, 400, 500, 800]) {
  for (const perItem of [2, 3, 5, 6, 8]) {
    for (const setup of [30, 60]) {
      const total = items * perItem + setup
      const d = distract(total, [items * perItem, setup, (items + setup) * perItem])
      if (d.length < 3) continue
      b.add(`datb2_mf1_${items}_${perItem}_${setup}`, T.manufacturing, FW.apply, 'medium',
        [`生產 ${items} 件產品，每件加工需 ${perItem} 分鐘，另需一次性設置機器 ${setup} 分鐘。合共需時多少分鐘？`,
         `Producing ${items} items takes ${perItem} minutes each plus a one-off machine setup of ${setup} minutes. What is the total time, in minutes?`],
        [qty(total, '分鐘', 'min'), ...d.map((v) => qty(v, '分鐘', 'min'))],
        [`總時間 = $${items} \\times ${perItem} + ${setup} = ${items * perItem} + ${setup} = ${total}$ 分鐘。設置時間只算【一次】，不隨件數增加 —— 所以每件的平均耗時 $${total} \\div ${items} = ${Math.round((total / items) * 100) / 100}$ 分鐘會低於 ${perItem} 加設置。批量愈大，設置成本被攤得愈薄，這正是大量生產成本較低的根本原因。`,
         `Total = $${items} \\times ${perItem} + ${setup} = ${items * perItem} + ${setup} = ${total}$ minutes. Setup counts ONCE and does not scale with quantity — so the average per item, $${total} \\div ${items} = ${Math.round((total / items) * 100) / 100}$ minutes, sits below ${perItem} plus setup. The larger the batch, the thinner the setup is spread, and that is the root reason mass production costs less per unit.`])
    }
  }
}

// ── 可持續設計 ────────────────────────────────────────────────────────────

// SU1 — 回收率：回收量 = 廢棄量 × 回收率
for (const waste of [200, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000]) {
  for (const rate of [15, 20, 25, 30, 40, 50, 60]) {
    const recycled = (waste * rate) / 100
    if (!Number.isInteger(recycled)) continue
    const d = distract(recycled, [waste - recycled, rate, waste])
    if (d.length < 3) continue
    b.add(`datb2_su1_${waste}_${rate}`, T.sustain, FW.apply, 'easy',
      [`某工廠每月產生 ${waste} 公斤廢料，其中 ${rate}% 可回收再造。每月回收量為多少公斤？`,
       `A factory generates ${waste} kg of waste a month, of which ${rate}% can be recycled. How many kg are recycled each month?`],
      [qty(recycled, '公斤', 'kg'), ...d.map((v) => qty(v, '公斤', 'kg'))],
      [`回收量 = $${waste} \\times ${rate}\\% = ${recycled}$ 公斤，其餘 ${waste - recycled} 公斤仍需棄置。可持續設計的層級是【減量優先於重用，重用優先於回收】—— 回收雖然比棄置好，但過程本身也耗能耗水。真正有效的做法是在設計階段就令廢料少產生，而不是事後回收得多。`,
       `Recycled = $${waste} \\times ${rate}\\% = ${recycled}$ kg, leaving ${waste - recycled} kg still to be disposed of. The waste hierarchy runs REDUCE before REUSE before RECYCLE — recycling beats landfill but the process itself consumes energy and water. What works is designing so that less waste arises in the first place, not recovering more of it afterwards.`])
  }
}

// ── 結構與機械 ────────────────────────────────────────────────────────────

// ST1 — 槓桿：力臂與力的關係（力矩平衡）
for (const load of [20, 40, 60, 100, 200]) {
  for (const loadArm of [10, 20, 25, 40, 50]) {
    for (const effortArm of [50, 100, 200]) {
      const effort = (load * loadArm) / effortArm
      if (!Number.isInteger(effort)) continue
      const d = distract(effort, [load, (load * effortArm) / loadArm, load + loadArm])
      if (d.length < 3) continue
      b.add(`datb2_st1_${load}_${loadArm}_${effortArm}`, T.structures, FW.apply, 'medium',
        [`一根槓桿的負載為 ${load} 牛頓，負載力臂 ${loadArm} 厘米，施力力臂 ${effortArm} 厘米。維持平衡所需的施力為多少牛頓？`,
         `A lever carries a load of ${load} N at a load arm of ${loadArm} cm, with an effort arm of ${effortArm} cm. What effort is needed for balance, in N?`],
        [qty(effort, '牛頓', 'N'), ...d.map((v) => qty(v, '牛頓', 'N'))],
        [`力矩平衡：施力 × 施力力臂 = 負載 × 負載力臂，故施力 $= ${load} \\times ${loadArm} \\div ${effortArm} = ${effort}$ 牛頓。施力力臂愈長，所需施力愈小 —— 但省力的代價是【移動距離變長】，功並沒有減少。槓桿改變的是力的大小，不是所需的功。`,
         `Moments balance: effort × effort arm = load × load arm, so effort $= ${load} \\times ${loadArm} \\div ${effortArm} = ${effort}$ N. A longer effort arm needs less force — but the price of that saving is a LONGER TRAVEL, and the work done is unchanged. A lever changes the size of the force, not the work required.`])
    }
  }
}

// ── 材料與特性 ────────────────────────────────────────────────────────────

// MA1 — 密度：質量 = 密度 × 體積
for (const density of [2, 3, 5, 8, 9, 11]) {
  for (const volume of [50, 100, 150, 200, 300, 400, 500]) {
    const mass = density * volume
    const d = distract(mass, [density + volume, volume / density, density])
    if (d.length < 3) continue
    b.add(`datb2_ma1_${density}_${volume}`, T.materials, FW.apply, 'easy',
      [`某金屬的密度為每立方厘米 ${density} 克，一件該金屬製品的體積為 ${volume} 立方厘米。其質量為多少克？`,
       `A metal has a density of ${density} g per cm³ and a component made from it occupies ${volume} cm³. What is its mass, in grams?`],
      [qty(mass, '克', 'g'), ...d.map((v) => qty(v, '克', 'g'))],
      [`質量 = 密度 × 體積 = $${density} \\times ${volume} = ${mass}$ 克。選材時密度往往與強度同樣重要：同一個結構若改用密度較低的材料，重量下降，但若強度不足就要加厚，加厚回來的體積可能把省下的重量全數抵銷 —— 所以真正的比較基準是【比強度】，即強度除以密度。`,
       `Mass = density × volume = $${density} \\times ${volume} = ${mass}$ g. In material selection density often matters as much as strength: switching to a lighter material cuts weight, but if it is also weaker the section must thicken, and the added volume can cancel the saving entirely — which is why the real basis for comparison is SPECIFIC STRENGTH, strength divided by density.`])
  }
}

// ── 設計過程 ──────────────────────────────────────────────────────────────

// DP1 — 迭代次數與累積改善
for (const initial of [40, 50, 60, 70, 80]) {
  for (const gain of [5, 8, 10]) {
    for (const rounds of [2, 3, 4]) {
      const finalScore = initial + gain * rounds
      if (finalScore > 100) continue
      const d = distract(finalScore, [initial + gain, gain * rounds, initial * rounds])
      if (d.length < 3) continue
      b.add(`datb2_dp1_${initial}_${gain}_${rounds}`, T.process, FW.apply, 'medium',
        [`一個設計方案的初評分為 ${initial} 分，每經一次測試與修改可提升 ${gain} 分，共進行 ${rounds} 次迭代。最終評分為多少分？`,
         `A design scores ${initial} initially and gains ${gain} points per test-and-revise cycle over ${rounds} iterations. What is the final score?`],
        [qty(finalScore, '分', 'points'), ...d.map((v) => qty(v, '分', 'points'))],
        [`最終 = $${initial} + ${gain} \\times ${rounds} = ${initial} + ${gain * rounds} = ${finalScore}$ 分。設計過程是【循環】而非直線：測試不是最後一步，而是下一輪的起點。答 $${initial + gain}$ 只算了一次迭代 —— 這正是「一次做對」的設計思維與迭代思維的分別，前者把測試當驗收，後者把測試當資料來源。`,
         `Final = $${initial} + ${gain} \\times ${rounds} = ${initial} + ${gain * rounds} = ${finalScore}$. The design process is a LOOP, not a line: testing is not the last step but the start of the next round. Answering $${initial + gain}$ counts one iteration only — which is exactly the difference between "get it right first time" thinking and iterative thinking, where testing is a source of data rather than a final check.`])
    }
  }
}

// ── 電腦輔助設計與製造 ────────────────────────────────────────────────────

// CD1 — 數控加工時間 = 路徑長度 ÷ 進給速度
for (const path of [200, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500, 3000]) {
  for (const feed of [50, 100, 125, 200, 250]) {
    const min = path / feed
    if (!Number.isInteger(min)) continue
    const d = distract(min, [path * feed, path - feed, feed / path])
    if (d.length < 3) continue
    b.add(`datb2_cd1_${path}_${feed}`, T.cad, FW.apply, 'medium',
      [`一項數控銑削工序的刀具路徑總長 ${path} 毫米，進給速度為每分鐘 ${feed} 毫米。加工需時多少分鐘？`,
       `A CNC milling operation has a total tool path of ${path} mm at a feed rate of ${feed} mm per minute. How many minutes does it take?`],
      [qty(min, '分鐘', 'min'), ...d.map((v) => qty(v, '分鐘', 'min'))],
      [`時間 = 路徑長度 ÷ 進給速度 = $${path} \\div ${feed} = ${min}$ 分鐘。提高進給速度可縮短時間，但表面粗糙度會變差、刀具磨損加快 —— 電腦輔助製造的核心取捨正在這裏：同一個模型，粗加工用高進給快速去料，精加工用低進給求表面，兩者用同一份路徑資料而參數不同。`,
       `Time = path length ÷ feed rate = $${path} \\div ${feed} = ${min}$ minutes. A higher feed shortens the job but worsens surface finish and wears the tool faster — and that is the central trade-off in computer-aided manufacture: the same model is roughed at high feed to remove material fast and finished at low feed for surface quality, using one set of path data with different parameters.`])
  }
}

// ── 結構與機械・計算 ──────────────────────────────────────────────────────

// MC1 — 齒輪傳動比與轉速
for (const driver of [10, 15, 20]) {
  for (const driven of [30, 60]) {
    for (const rpm of [300]) {
      const outRpm = (driver * rpm) / driven
      if (!Number.isInteger(outRpm)) continue
      const d = distract(outRpm, [rpm, (driven * rpm) / driver, driven - driver])
      if (d.length < 3) continue
      b.add(`datb2_mc1_${driver}_${driven}_${rpm}`, T.mech, FW.apply, 'hard',
        [`一組齒輪中，主動輪有 ${driver} 齒、從動輪有 ${driven} 齒。主動輪以每分鐘 ${rpm} 轉旋轉，從動輪的轉速為每分鐘多少轉？`,
         `In a gear pair the driver has ${driver} teeth and the driven gear ${driven}. With the driver at ${rpm} rpm, what is the driven gear's speed, in rpm?`],
        [qty(outRpm, '轉', 'rpm'), ...d.map((v) => qty(v, '轉', 'rpm'))],
        [`齒數與轉速成【反比】：從動輪轉速 $= ${rpm} \\times \\frac{${driver}}{${driven}} = ${outRpm}$ 轉／分鐘。從動輪齒數較多故轉得較慢，但扭矩相應增大 —— 減速的同時增扭，這是齒輪組最常見的用途。答 $${(driven * rpm) / driver}$ 把比例倒轉了，會得出「愈大的輪轉得愈快」這個明顯不合理的結論。`,
         `Teeth and speed are INVERSELY related: the driven gear turns at $${rpm} \\times \\frac{${driver}}{${driven}} = ${outRpm}$ rpm. Having more teeth it turns slower, and the torque rises correspondingly — reducing speed while increasing torque is the commonest use of a gear train. Answering $${(driven * rpm) / driver}$ inverts the ratio and implies the larger wheel spins faster, which is plainly wrong.`])
    }
  }
}

export const designTechBank4Questions: Question[] = b.bank
