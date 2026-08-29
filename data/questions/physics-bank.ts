import type { Topic } from './types'
import { topicList } from './_builder'
import type { Question } from './types'
import { createBank, n, round, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// PHYSICS — PARAMETRIC BANK (Mode A, correct-by-construction, 3-tier)
// g = 10 m/s². Every answer + 3 distractors computed by formula; distractors
// model named errors (forgot a factor, inverted a ratio, wrong operation).
// The shared add() drops any tuple whose 4 options aren't distinct.
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  kinematics: { id: 'kinematics', zh: '運動學', en: 'Kinematics' },
  forces: { id: 'force_motion', zh: '力與運動', en: 'Force & Motion' },
  energy: { id: 'work_energy', zh: '功、能與功率', en: 'Work, Energy & Power' },
  electricity: { id: 'electricity', zh: '電學', en: 'Electricity' },
  heat: { id: 'heat', zh: '熱學', en: 'Heat' },
  pressure: { id: 'pressure_density', zh: '壓強與密度', en: 'Pressure & Density' },
  // ── 2026-08-28 平均分佈補強 ────────────────────────────────────────────
  // 實測物理 13 個課題之中，electricity 已有 213 條，而 optics / radioactivity
  // 各僅 15 條、waves 18 條、mechanics 35 條（平均目標 77）。依指示：已達標者
  // 不予改動，先補題數最少者。以下四個課題原本不在參數化題庫覆蓋範圍之內。
  optics: { id: 'optics', zh: '光學', en: 'Optics' },
  radioactivity: { id: 'radioactivity', zh: '放射現象', en: 'Radioactivity' },
  waves: { id: 'waves', zh: '波動', en: 'Waves' },
  mechanics: { id: 'mechanics', zh: '力學', en: 'Mechanics' },
  // 三個「多步計算」課題各僅 3 條 —— 全科最薄。多步題正好適合參數化：
  // 把兩條公式串連，中間值與最終值都由公式算出，干擾項模擬「只做了第一步」
  // 或「第二步用錯公式」這類具名錯誤。
  hellMech: { id: 'phys_hell_mechanics', zh: '多步計算・力學', en: 'Multi-step — mechanics' },
  hellElec: { id: 'phys_hell_elec_heat', zh: '多步計算・電與熱', en: 'Multi-step — electricity & heat' },
  hellWave: { id: 'phys_hell_wave_optics', zh: '多步計算・波動光學放射', en: 'Multi-step — waves, optics & radioactivity' },
} satisfies Record<string, TopicMeta>

const FW = {
  formula: { id: 'core_formula', zh: '基礎公式', en: 'Core Formula', emoji: '🔬' },
  motion: { id: 'motion_analysis', zh: '運動分析', en: 'Motion Analysis', emoji: '🚀' },
  energy: { id: 'energy_conservation', zh: '能量守恆', en: 'Energy Conservation', emoji: '⚡' },
  circuit: { id: 'circuit_analysis', zh: '電路分析', en: 'Circuit Analysis', emoji: '🔌' },
  light: { id: 'light_propagation', zh: '光的傳播', en: 'Propagation of Light', emoji: '🔦' },
  decay: { id: 'decay_laws', zh: '衰變規律', en: 'Decay Laws', emoji: '☢️' },
  wave: { id: 'wave_relationships', zh: '波的關係', en: 'Wave Relationships', emoji: '🌊' },
  conserve: { id: 'conservation_laws', zh: '守恆定律', en: 'Conservation Laws', emoji: '⚖️' },
} satisfies Record<string, FwMeta>

const { bank, add } = createBank('physics')
const G = 10

// ═══════════════════════════════════════════════════════════════════════════
// 補底 (easy)
// ═══════════════════════════════════════════════════════════════════════════

// E1 — speed v = d / t
for (let v = 2; v <= 7; v++) {
  for (let t = 2; t <= 5; t++) {
    const d = v * t
    add(`pb_e1_${v}_${t}`, T.kinematics, FW.formula, 'easy',
      [`一物體 $${t}$ 秒內行走 $${d}$ 米，求其速率。`, `An object travels $${d}$ m in $${t}$ s. Find its speed.`],
      [n(`$${v}$ m/s`), n(`$${d * t}$ m/s`), n(`$${d + t}$ m/s`), n(`$${round(t / d, 3)}$ m/s`)],
      [`速率 $= \\dfrac{\\text{距離}}{\\text{時間}} = \\dfrac{${d}}{${t}} = ${v}$ m/s。陷阱：$${d * t}$ 用了乘法；$${round(t / d, 3)}$ 上下倒轉。`,
       `Speed $= \\frac{d}{t} = \\frac{${d}}{${t}} = ${v}$ m/s. Trap: $${d * t}$ multiplies instead of dividing.`])
  }
}

// E2 — Ohm's law V = IR
for (let I = 2; I <= 4; I++) {
  for (let R = 2; R <= 6; R++) {
    add(`pb_e2_${I}_${R}`, T.electricity, FW.circuit, 'easy',
      [`電流 $${I}$ A 流過 $${R}$ Ω 的電阻，求其兩端電壓。`, `A current of $${I}$ A flows through a $${R}$ Ω resistor. Find the voltage across it.`],
      [n(`$${I * R}$ V`), n(`$${round(I / R, 3)}$ V`), n(`$${round(R / I, 3)}$ V`), n(`$${I + R}$ V`)],
      [`$V = IR = ${I} \\times ${R} = ${I * R}$ V。陷阱：$${round(I / R, 3)}$ 或 $${round(R / I, 3)}$ 錯用了除法。`,
       `$V = IR = ${I * R}$ V. Trap: dividing instead of multiplying.`])
  }
}

// E3 — weight W = mg  (g = 10)
for (let m = 2; m <= 20; m += 2) {
  add(`pb_e3_${m}`, T.forces, FW.formula, 'easy',
    [`一物體質量 $${m}$ kg，求其重量（$g = 10$ N/kg）。`, `An object has mass $${m}$ kg. Find its weight ($g = 10$ N/kg).`],
    [n(`$${m * G}$ N`), n(`$${m}$ N`), n(`$${round(m / G, 2)}$ N`), n(`$${m + G}$ N`)],
    [`$W = mg = ${m} \\times 10 = ${m * G}$ N。陷阱：$${m}$ 漏了 $\\times g$；$${round(m / G, 2)}$ 錯用了除法。`,
     `$W = mg = ${m * G}$ N. Trap: $${m}$ forgets to multiply by $g$.`])
}

// E4 — density ρ = m / V
for (let rho = 2; rho <= 7; rho++) {
  for (let V = 2; V <= 6; V++) {
    const m = rho * V
    add(`pb_e4_${rho}_${V}`, T.pressure, FW.formula, 'easy',
      [`一物體質量 $${m}$ kg、體積 $${V}$ m³，求其密度。`, `An object of mass $${m}$ kg has volume $${V}$ m³. Find its density.`],
      [n(`$${rho}$ kg/m³`), n(`$${m * V}$ kg/m³`), n(`$${round(V / m, 3)}$ kg/m³`), n(`$${m + V}$ kg/m³`)],
      [`$\\rho = \\dfrac{m}{V} = \\dfrac{${m}}{${V}} = ${rho}$ kg/m³。陷阱：$${round(V / m, 3)}$ 上下倒轉。`,
       `$\\rho = \\frac{m}{V} = ${rho}$ kg/m³. Trap: inverting the ratio.`])
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 普通 (medium)
// ═══════════════════════════════════════════════════════════════════════════

// M1 — v = u + at
for (let u = 0; u <= 8; u += 2) {
  for (let a = 2; a <= 6; a++) {
    for (const t of [3, 4, 5]) {
      const v = u + a * t
      add(`pb_m1_${u}_${a}_${t}`, T.kinematics, FW.motion, 'medium',
        [`物體初速 $${u}$ m/s，加速度 $${a}$ m/s²，經過 $${t}$ s 後的速度是多少？`,
         `An object starts at $${u}$ m/s with acceleration $${a}$ m/s². Find its velocity after $${t}$ s.`],
        [n(`$${v}$ m/s`), n(`$${u - a * t}$ m/s`), n(`$${a * t}$ m/s`), n(`$${u + a}$ m/s`)],
        [`$v = u + at = ${u} + ${a}\\times${t} = ${u} + ${a * t} = ${v}$ m/s。陷阱：$${a * t}$ 漏了初速 $u$；$${u + a}$ 漏了 $\\times t$。`,
         `$v = u + at = ${v}$ m/s. Trap: $${a * t}$ drops the initial velocity $u$.`])
    }
  }
}

// M2 — kinetic energy KE = ½mv²
for (let m = 2; m <= 10; m += 2) {
  for (let v = 2; v <= 8; v++) {
    const ke = 0.5 * m * v * v
    add(`pb_m2_${m}_${v}`, T.energy, FW.energy, 'medium',
      [`質量 $${m}$ kg 的物體以 $${v}$ m/s 運動，求其動能。`, `A $${m}$ kg object moves at $${v}$ m/s. Find its kinetic energy.`],
      [n(`$${ke}$ J`), n(`$${m * v * v}$ J`), n(`$${0.5 * m * v}$ J`), n(`$${m * v}$ J`)],
      [`$E_k = \\tfrac12 mv^2 = \\tfrac12 \\times ${m} \\times ${v}^2 = ${ke}$ J。陷阱：$${m * v * v}$ 漏了 $\\tfrac12$；$${0.5 * m * v}$ 漏了平方。`,
       `$E_k = \\frac12 mv^2 = ${ke}$ J. Trap: $${m * v * v}$ drops the $\\frac12$; $${0.5 * m * v}$ forgets to square $v$.`])
  }
}

// M3 — gravitational PE = mgh  (g = 10)
for (let m = 2; m <= 10; m += 2) {
  for (const h of [3, 5, 8, 10, 12]) {
    const pe = m * G * h
    add(`pb_m3_${m}_${h}`, T.energy, FW.energy, 'medium',
      [`質量 $${m}$ kg 的物體升高 $${h}$ m，求其增加的重力勢能（$g = 10$）。`,
       `A $${m}$ kg object is raised by $${h}$ m. Find the gain in gravitational PE ($g = 10$).`],
      [n(`$${pe}$ J`), n(`$${m * h}$ J`), n(`$${0.5 * m * G * h}$ J`), n(`$${m + G + h}$ J`)],
      [`$E_p = mgh = ${m}\\times10\\times${h} = ${pe}$ J。陷阱：$${m * h}$ 漏了 $g$；$${0.5 * m * G * h}$ 誤加了 $\\tfrac12$（那個是動能公式）。`,
       `$E_p = mgh = ${pe}$ J. Trap: $${m * h}$ drops $g$; $${0.5 * m * G * h}$ wrongly adds a $\\frac12$.`])
  }
}

// M4 — electrical power P = IV
for (let I = 2; I <= 6; I++) {
  for (let V = 3; V <= 12; V += 3) {
    add(`pb_m4_${I}_${V}`, T.electricity, FW.circuit, 'medium',
      [`電流 $${I}$ A、電壓 $${V}$ V，求電功率。`, `A current of $${I}$ A at $${V}$ V. Find the electrical power.`],
      [n(`$${I * V}$ W`), n(`$${round(V / I, 3)}$ W`), n(`$${I + V}$ W`), n(`$${I * I * V}$ W`)],
      [`$P = IV = ${I}\\times${V} = ${I * V}$ W。陷阱：$${round(V / I, 3)}$ 錯用除法；$${I * I * V}$ 誤用 $I^2V$。`,
       `$P = IV = ${I * V}$ W. Trap: $${round(V / I, 3)}$ divides instead.`])
  }
}

// M5 — momentum p = mv
for (let m = 2; m <= 12; m += 2) {
  for (let v = 3; v <= 9; v += 2) {
    add(`pb_m5_${m}_${v}`, T.forces, FW.motion, 'medium',
      [`質量 $${m}$ kg 的物體以 $${v}$ m/s 運動，求其動量。`, `A $${m}$ kg object moves at $${v}$ m/s. Find its momentum.`],
      [n(`$${m * v}$ kg·m/s`), n(`$${m + v}$ kg·m/s`), n(`$${0.5 * m * v}$ kg·m/s`), n(`$${round(m / v, 3)}$ kg·m/s`)],
      [`$p = mv = ${m}\\times${v} = ${m * v}$ kg·m/s。陷阱：$${0.5 * m * v}$ 誤加 $\\tfrac12$（那個是動能）；$${round(m / v, 3)}$ 用了除法。`,
       `$p = mv = ${m * v}$ kg·m/s. Trap: $${0.5 * m * v}$ wrongly halves it.`])
  }
}

// M6 — pressure P = F / A
for (let A = 2; A <= 6; A++) {
  for (let p = 3; p <= 9; p++) {
    const F = p * A
    add(`pb_m6_${A}_${p}`, T.pressure, FW.formula, 'medium',
      [`力 $${F}$ N 均勻作用於 $${A}$ m² 的面積上，求壓強。`, `A force of $${F}$ N acts over $${A}$ m². Find the pressure.`],
      [n(`$${p}$ Pa`), n(`$${F * A}$ Pa`), n(`$${round(A / F, 3)}$ Pa`), n(`$${F + A}$ Pa`)],
      [`$P = \\dfrac{F}{A} = \\dfrac{${F}}{${A}} = ${p}$ Pa。陷阱：$${F * A}$ 用了乘法；$${round(A / F, 3)}$ 上下倒轉。`,
       `$P = \\frac{F}{A} = ${p}$ Pa. Trap: $${F * A}$ multiplies instead.`])
  }
}

// M7 — resistors in series R = R₁ + R₂
;([[2, 3], [4, 6], [5, 10], [8, 4], [12, 6], [3, 9], [7, 5], [10, 15], [6, 6], [9, 3]] as const)
  .forEach(([r1, r2], i) => {
    add(`pb_m7_${i}`, T.electricity, FW.circuit, 'medium',
      [`兩個電阻 $${r1}$ Ω 及 $${r2}$ Ω 串聯，求總電阻。`, `Two resistors $${r1}$ Ω and $${r2}$ Ω are in series. Find the total resistance.`],
      [n(`$${r1 + r2}$ Ω`), n(`$${round((r1 * r2) / (r1 + r2), 2)}$ Ω`), n(`$${r1 * r2}$ Ω`), n(`$${round((r1 + r2) / 2, 2)}$ Ω`)],
      [`串聯：$R = R_1 + R_2 = ${r1} + ${r2} = ${r1 + r2}$ Ω。陷阱：$${round((r1 * r2) / (r1 + r2), 2)}$ 是並聯公式；$${round((r1 + r2) / 2, 2)}$ 是取平均。`,
       `Series: $R = R_1 + R_2 = ${r1 + r2}$ Ω. Trap: $${round((r1 * r2) / (r1 + r2), 2)}$ is the parallel value.`])
  })

// ═══════════════════════════════════════════════════════════════════════════
// 拔尖 (hard)
// ═══════════════════════════════════════════════════════════════════════════

// H1 — v² = u² + 2as, solve for v (only integer-v tuples are kept)
for (const u of [0, 4, 6]) {
  for (let a = 2; a <= 7; a++) {
    for (let s = 1; s <= 8; s++) {
      const v2 = u * u + 2 * a * s
      const v = Math.sqrt(v2)
      if (!Number.isInteger(v) || v === u) continue
      add(`pb_h1_${u}_${a}_${s}`, T.kinematics, FW.motion, 'hard',
        [`物體初速 $${u}$ m/s，以 $${a}$ m/s² 加速走了 $${s}$ m，求末速（$v^2 = u^2 + 2as$）。`,
         `An object starts at $${u}$ m/s, accelerates at $${a}$ m/s² over $${s}$ m. Find the final speed ($v^2 = u^2 + 2as$).`],
        [n(`$${v}$ m/s`), n(`$${v2}$ m/s`), n(`$${u + 2 * a * s}$ m/s`), n(`$${u + a * s}$ m/s`)],
        [`$v = \\sqrt{u^2 + 2as} = \\sqrt{${u * u} + ${2 * a * s}} = \\sqrt{${v2}} = ${v}$ m/s。陷阱：$${v2}$ 漏了開方；$${u + a * s}$ 誤套 $u+as$。`,
         `$v = \\sqrt{u^2 + 2as} = ${v}$ m/s. Trap: $${v2}$ forgets the square root.`])
    }
  }
}

// H2 — resistors in parallel R = R₁R₂/(R₁+R₂)
for (let r1 = 2; r1 <= 7; r1++) {
  for (let r2 = r1; r2 <= 9; r2++) {
    const rp = (r1 * r2) / (r1 + r2)
    add(`pb_h2_${r1}_${r2}`, T.electricity, FW.circuit, 'hard',
      [`兩個電阻 $${r1}$ Ω 及 $${r2}$ Ω 並聯，求等效電阻。`, `Two resistors $${r1}$ Ω and $${r2}$ Ω are in parallel. Find the effective resistance.`],
      [n(`$${round(rp, 2)}$ Ω`), n(`$${r1 + r2}$ Ω`), n(`$${round((r1 + r2) / 2, 2)}$ Ω`), n(`$${r1 * r2}$ Ω`)],
      [`並聯：$\\dfrac{1}{R} = \\dfrac{1}{${r1}} + \\dfrac{1}{${r2}}$ ⇒ $R = \\dfrac{${r1}\\times${r2}}{${r1}+${r2}} = ${round(rp, 2)}$ Ω。陷阱：$${r1 + r2}$ 誤當串聯；並聯總電阻一定細過任何一個電阻。`,
       `Parallel: $R = \\frac{R_1R_2}{R_1+R_2} = ${round(rp, 2)}$ Ω. Trap: $${r1 + r2}$ treats it as series — parallel R is always smaller than either resistor.`])
  }
}

// H3 — heat Q = mcΔT
for (const m of [1, 2, 3]) {
  for (const c of [400, 900, 4200]) {
    for (const dT of [10, 20, 25, 40]) {
      const Q = m * c * dT
      add(`pb_h3_${m}_${c}_${dT}`, T.heat, FW.energy, 'hard',
        [`$${m}$ kg 物質（比熱容 $${c}$ J/(kg·°C)）升溫 $${dT}$ °C，求吸收的熱量。`,
         `$${m}$ kg of a substance (specific heat $${c}$ J/(kg·°C)) is heated by $${dT}$ °C. Find the heat absorbed.`],
        [n(`$${Q}$ J`), n(`$${m * c}$ J`), n(`$${c * dT}$ J`), n(`$${m * dT}$ J`)],
        [`$Q = mc\\Delta T = ${m}\\times${c}\\times${dT} = ${Q}$ J。陷阱：$${m * c}$ 漏了 $\\Delta T$；$${c * dT}$ 漏了質量 $m$。`,
         `$Q = mc\\Delta T = ${Q}$ J. Trap: $${m * c}$ drops $\\Delta T$; $${c * dT}$ drops the mass.`])
    }
  }
}

// H4 — ideal transformer Vs = Vp·Ns/Np  (integer-output tuples only)
for (const Vp of [6, 10, 12, 20, 24, 30]) {
  for (const Np of [100, 200]) {
    for (const Ns of [100, 200, 300, 400]) {
      const Vs = (Vp * Ns) / Np
      if (!Number.isInteger(Vs) || Vs === Vp) continue
      add(`pb_h4_${Vp}_${Np}_${Ns}`, T.electricity, FW.circuit, 'hard',
        [`理想變壓器初級 $${Vp}$ V、初級 $${Np}$ 匝、次級 $${Ns}$ 匝，求次級電壓。`,
         `An ideal transformer has primary $${Vp}$ V, $${Np}$ turns primary, $${Ns}$ turns secondary. Find the secondary voltage.`],
        [n(`$${Vs}$ V`), n(`$${round((Vp * Np) / Ns, 2)}$ V`), n(`$${Vp * Ns}$ V`), n(`$${Vp + Ns - Np}$ V`)],
        [`$\\dfrac{V_s}{V_p} = \\dfrac{N_s}{N_p}$ ⇒ $V_s = ${Vp}\\times\\dfrac{${Ns}}{${Np}} = ${Vs}$ V。陷阱：$${round((Vp * Np) / Ns, 2)}$ 將匝數比倒轉。`,
         `$V_s = V_p\\frac{N_s}{N_p} = ${Vs}$ V. Trap: $${round((Vp * Np) / Ns, 2)}$ inverts the turns ratio.`])
    }
  }
}

// H5 — free-fall time from rest: t = √(2h/g)  (integer-t tuples only)
for (const h of [5, 20, 45, 80, 125, 180, 245, 320, 500]) {
  const t = Math.sqrt((2 * h) / G)
  if (!Number.isInteger(t)) continue
  add(`pb_h5_${h}`, T.kinematics, FW.motion, 'hard',
    [`物體由靜止自由下墜 $${h}$ m，求下墜所需時間（$g = 10$，$h = \\tfrac12 g t^2$）。`,
     `An object falls from rest through $${h}$ m. Find the time taken ($g = 10$, $h = \\frac12 g t^2$).`],
    [n(`$${t}$ s`), n(`$${round((2 * h) / G, 2)}$ s`), n(`$${round(h / G, 2)}$ s`), n(`$${round(Math.sqrt(h / G), 2)}$ s`)],
    [`$h = \\tfrac12 g t^2$ ⇒ $t = \\sqrt{\\dfrac{2h}{g}} = \\sqrt{\\dfrac{${2 * h}}{10}} = ${t}$ s。陷阱：$${round((2 * h) / G, 2)}$ 漏了開方；$${round(Math.sqrt(h / G), 2)}$ 漏了係數 $2$。`,
     `$t = \\sqrt{\\frac{2h}{g}} = ${t}$ s. Trap: $${round((2 * h) / G, 2)}$ forgets the square root.`])
}

// H6 — efficiency η = (useful / total) × 100%
for (const total of [200, 400, 500, 800, 1000]) {
  for (const pct of [25, 40, 60, 75, 80]) {
    const useful = (total * pct) / 100
    add(`pb_h6_${total}_${pct}`, T.energy, FW.energy, 'hard',
      [`一部機器輸入 $${total}$ J，有用輸出 $${useful}$ J，求其效率。`,
       `A machine takes in $${total}$ J and gives $${useful}$ J useful output. Find its efficiency.`],
      [n(`$${pct}\\%$`), n(`$${100 - pct}\\%$`), n(`$${round(useful / total, 2)}$`), n(`$${round(total / useful, 2)}$`)],
      [`效率 $= \\dfrac{\\text{有用輸出}}{\\text{總輸入}} \\times 100\\% = \\dfrac{${useful}}{${total}} \\times 100\\% = ${pct}\\%$。陷阱：$${100 - pct}\\%$ 是損耗百分比；$${round(useful / total, 2)}$ 漏了 $\\times 100\\%$。`,
       `Efficiency $= \\frac{\\text{useful}}{\\text{total}} \\times 100\\% = ${pct}\\%$. Trap: $${100 - pct}\\%$ is the wasted fraction.`])
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 平均分佈補強 —— 四個最薄課題（2026-08-28）
// 正解與三個干擾項全部由公式計出；每個干擾項模擬一個具名錯誤。
// ═══════════════════════════════════════════════════════════════════════════

// OP1 — 折射率 n = c / v（真空光速取 3 × 10⁸ m/s，以 10⁸ 為單位書寫）
for (const nIdx of [1.2, 1.5, 1.6, 2, 2.5]) {
  for (const label of ['玻璃', '塑膠', '水晶', '樹脂'] as const) {
    const v = round(3 / nIdx, 3)
    add(`pb_op1_${String(nIdx).replace('.', '')}_${label}`, T.optics, FW.light, 'easy',
      [`光在某${label}中的速率為 $${v} \\times 10^{8}$ m/s。已知真空光速為 $3 \\times 10^{8}$ m/s，求該介質的折射率。`,
       `Light travels at $${v} \\times 10^{8}$ m/s in a medium. Given the speed of light in vacuum is $3 \\times 10^{8}$ m/s, find its refractive index.`],
      [n(`$${nIdx}$`), n(`$${round(Number(v) / 3, 3)}$`), n(`$${round(3 - Number(v), 3)}$`), n(`$${round(3 * Number(v), 3)}$`)],
      [`折射率 $n = \\dfrac{c}{v} = \\dfrac{3}{${v}} = ${nIdx}$。折射率恆大於 1，因為光在介質中必定慢於真空。陷阱：$${round(Number(v) / 3, 3)}$ 上下倒轉（結果細於 1，一望即知不可能）；$${round(3 - Number(v), 3)}$ 用了相減；$${round(3 * Number(v), 3)}$ 用了相乘。`,
       `Refractive index $n = \\frac{c}{v} = \\frac{3}{${v}} = ${nIdx}$. It always exceeds 1, since light is slower in a medium than in vacuum. Traps: $${round(Number(v) / 3, 3)}$ inverts the fraction and gives less than 1, which is impossible; $${round(3 - Number(v), 3)}$ subtracts; $${round(3 * Number(v), 3)}$ multiplies.`])
  }
}

// OP2 — 薄透鏡公式 1/f = 1/u + 1/v（只取 v 為整數的組合）
for (const f of [10, 12, 15, 20]) {
  for (const k of [1.5, 2, 3, 4, 6]) {
    const u = Math.round(f * k)
    const v = (u * f) / (u - f)
    if (!Number.isInteger(v) || u === v * 0) continue
    add(`pb_op2_${f}_${u}`, T.optics, FW.light, 'medium',
      [`一個凸透鏡的焦距為 $${f}$ cm。物件放在距離透鏡 $${u}$ cm 處，求像距。`,
       `A converging lens has a focal length of $${f}$ cm. An object is placed $${u}$ cm from the lens. Find the image distance.`],
      [n(`$${v}$ cm`), n(`$${u - f}$ cm`), n(`$${u + f}$ cm`), n(`$${round((u * f) / (u + f), 2)}$ cm`)],
      [`薄透鏡公式 $\\dfrac{1}{f} = \\dfrac{1}{u} + \\dfrac{1}{v}$，故 $\\dfrac{1}{v} = \\dfrac{1}{${f}} - \\dfrac{1}{${u}}$，解得 $v = \\dfrac{${u} \\times ${f}}{${u} - ${f}} = ${v}$ cm。陷阱：$${u - f}$ cm 直接相減；$${u + f}$ cm 直接相加；$${round((u * f) / (u + f), 2)}$ cm 把分母的減號寫成加號。`,
       `The thin lens formula is $\\frac{1}{f} = \\frac{1}{u} + \\frac{1}{v}$, so $\\frac{1}{v} = \\frac{1}{${f}} - \\frac{1}{${u}}$ and $v = \\frac{${u} \\times ${f}}{${u} - ${f}} = ${v}$ cm. Traps: $${u - f}$ cm simply subtracts; $${u + f}$ cm adds; $${round((u * f) / (u + f), 2)}$ cm uses a plus sign in the denominator.`])
  }
}

// OP3 — 放大率 m = v / u
for (const u of [10, 15, 20, 25, 30]) {
  for (const mag of [2, 3, 4]) {
    const v = u * mag
    add(`pb_op3_${u}_${mag}`, T.optics, FW.light, 'easy',
      [`物距為 $${u}$ cm，像距為 $${v}$ cm。求該像的放大率。`,
       `The object distance is $${u}$ cm and the image distance is $${v}$ cm. Find the magnification.`],
      [n(`$${mag}$`), n(`$${round(u / v, 3)}$`), n(`$${v - u}$`), n(`$${u * v}$`)],
      [`放大率 $m = \\dfrac{v}{u} = \\dfrac{${v}}{${u}} = ${mag}$。$m > 1$ 表示像比物大。陷阱：$${round(u / v, 3)}$ 上下倒轉；$${v - u}$ 用了相減；$${u * v}$ 用了相乘。`,
       `Magnification $m = \\frac{v}{u} = \\frac{${v}}{${u}} = ${mag}$, and $m > 1$ means the image is larger than the object. Traps: $${round(u / v, 3)}$ inverts the ratio; $${v - u}$ subtracts; $${u * v}$ multiplies.`])
  }
}

// RA1 — 半衰期：經過 k 個半衰期後剩餘量 = N₀ / 2ᵏ
for (const N0 of [800, 1600, 3200, 6400, 12800]) {
  for (let k = 1; k <= 5; k++) {
    const left = N0 / 2 ** k
    if (!Number.isInteger(left)) continue
    add(`pb_ra1_${N0}_${k}`, T.radioactivity, FW.decay, 'easy',
      [`某放射性樣本的初始原子數為 $${N0}$。經過 ${k} 個半衰期之後，尚未衰變的原子數是多少？`,
       `A radioactive sample starts with $${N0}$ undecayed atoms. How many remain after ${k} half-lives?`],
      [n(`$${left}$`), n(`$${N0 / (2 * k)}$`), n(`$${N0 - N0 / 2 ** k}$`), n(`$${round(N0 / (k + 1), 1)}$`)],
      [`每經過一個半衰期，未衰變的原子數減半，故 ${k} 個半衰期後剩 $${N0} \\div 2^{${k}} = ${left}$。陷阱：$${N0 / (2 * k)}$ 把「減半 ${k} 次」誤算成「除以 $2 \\times ${k}$」——減半是連乘不是連加；$${N0 - N0 / 2 ** k}$ 是已衰變的數目；$${round(N0 / (k + 1), 1)}$ 誤除以 $${k + 1}$。`,
       `The number of undecayed atoms halves each half-life, so after ${k} half-lives $${N0} \\div 2^{${k}} = ${left}$ remain. Traps: $${N0 / (2 * k)}$ treats ${k} halvings as dividing by $2 \\times ${k}$, but halving compounds rather than adds; $${N0 - N0 / 2 ** k}$ is the number that has decayed; $${round(N0 / (k + 1), 1)}$ divides by $${k + 1}$.`])
  }
}

// RA2 — 由經過時間與半衰期求剩餘比例
for (const T12 of [2, 5, 10, 20]) {
  for (let k = 1; k <= 4; k++) {
    const elapsed = T12 * k, frac2 = 2 ** k
    add(`pb_ra2_${T12}_${k}`, T.radioactivity, FW.decay, 'medium',
      [`某同位素的半衰期為 $${T12}$ 天。經過 $${elapsed}$ 天之後，樣本中尚餘原本的幾分之幾？`,
       `An isotope has a half-life of $${T12}$ days. What fraction of the sample remains after $${elapsed}$ days?`],
      [n(`$\\dfrac{1}{${frac2}}$`), n(`$\\dfrac{1}{${2 * k}}$`), n(`$\\dfrac{${frac2 - 1}}{${frac2}}$`), n(`$\\dfrac{1}{${k}}$`)],
      [`先求經過了多少個半衰期：$${elapsed} \\div ${T12} = ${k}$ 個。每個半衰期剩下一半，故剩餘比例 $= \\left(\\dfrac{1}{2}\\right)^{${k}} = \\dfrac{1}{${frac2}}$。陷阱：$\\dfrac{1}{${2 * k}}$ 把指數當成倍數；$\\dfrac{${frac2 - 1}}{${frac2}}$ 是已衰變的比例；$\\dfrac{1}{${k}}$ 只除以半衰期數目。`,
       `First find how many half-lives have passed: $${elapsed} \\div ${T12} = ${k}$. Each halves the sample, so the fraction remaining is $\\left(\\frac{1}{2}\\right)^{${k}} = \\frac{1}{${frac2}}$. Traps: $\\frac{1}{${2 * k}}$ treats the exponent as a multiplier; $\\frac{${frac2 - 1}}{${frac2}}$ is the fraction that has decayed; $\\frac{1}{${k}}$ divides by the count of half-lives.`])
  }
}

// RA3 — α 衰變（A−4、Z−2）與 β 衰變（A 不變、Z+1）
for (const [A, Z, el] of [[238, 92, '鈾'], [226, 88, '鐳'], [222, 86, '氡'], [210, 84, '釙'], [214, 82, '鉛'], [232, 90, '釷']] as [number, number, string][]) {
  add(`pb_ra3a_${A}`, T.radioactivity, FW.decay, 'medium',
    [`一個質量數 $${A}$、原子序 $${Z}$ 的${el}原子核放出一粒 $\\alpha$ 粒子。所得新核的質量數與原子序分別是多少？`,
     `A nucleus with mass number $${A}$ and atomic number $${Z}$ emits an $\\alpha$ particle. What are the mass number and atomic number of the new nucleus?`],
    [n(`$${A - 4}$、$${Z - 2}$`), n(`$${A}$、$${Z + 1}$`), n(`$${A - 2}$、$${Z - 4}$`), n(`$${A - 4}$、$${Z}$`)],
    [`$\\alpha$ 粒子即氦核，含 2 個質子與 2 個中子，故質量數減 4、原子序減 2：$${A} - 4 = ${A - 4}$，$${Z} - 2 = ${Z - 2}$。陷阱：$${A}$、$${Z + 1}$ 是 $\\beta$ 衰變的結果；$${A - 2}$、$${Z - 4}$ 把兩個數字調轉；$${A - 4}$、$${Z}$ 漏了原子序的變化。`,
     `An $\\alpha$ particle is a helium nucleus of 2 protons and 2 neutrons, so the mass number falls by 4 and the atomic number by 2: $${A} - 4 = ${A - 4}$ and $${Z} - 2 = ${Z - 2}$. Traps: $${A}$, $${Z + 1}$ is the result of $\\beta$ decay; $${A - 2}$, $${Z - 4}$ swaps the two changes; $${A - 4}$, $${Z}$ omits the change in atomic number.`])
  add(`pb_ra3b_${A}`, T.radioactivity, FW.decay, 'medium',
    [`一個質量數 $${A}$、原子序 $${Z}$ 的原子核放出一粒 $\\beta$ 粒子。所得新核的質量數與原子序分別是多少？`,
     `A nucleus with mass number $${A}$ and atomic number $${Z}$ emits a $\\beta$ particle. What are the mass number and atomic number of the new nucleus?`],
    [n(`$${A}$、$${Z + 1}$`), n(`$${A - 4}$、$${Z - 2}$`), n(`$${A}$、$${Z - 1}$`), n(`$${A - 1}$、$${Z + 1}$`)],
    [`$\\beta$ 粒子是核內一個中子轉變為質子時放出的電子：質子數增加 1，而質子與中子的總數不變，故質量數維持 $${A}$、原子序增至 $${Z + 1}$。陷阱：$${A - 4}$、$${Z - 2}$ 是 $\\alpha$ 衰變；$${A}$、$${Z - 1}$ 方向相反；$${A - 1}$、$${Z + 1}$ 誤以為質量數會減。`,
     `A $\\beta$ particle is an electron emitted when a neutron in the nucleus turns into a proton: the proton count rises by 1 while the total of protons and neutrons is unchanged, so the mass number stays at $${A}$ and the atomic number becomes $${Z + 1}$. Traps: $${A - 4}$, $${Z - 2}$ is $\\alpha$ decay; $${A}$, $${Z - 1}$ has the wrong direction; $${A - 1}$, $${Z + 1}$ wrongly reduces the mass number.`])
}

// WA1 — 波速 v = f λ
for (const f of [2, 4, 5, 8, 10]) {
  for (const lam of [3, 6, 12, 15, 20]) {
    add(`pb_wa1_${f}_${lam}`, T.waves, FW.wave, 'easy',
      [`一列波的頻率為 $${f}$ Hz，波長為 $${lam}$ m。求其波速。`,
       `A wave has a frequency of $${f}$ Hz and a wavelength of $${lam}$ m. Find its speed.`],
      [n(`$${f * lam}$ m/s`), n(`$${round(lam / f, 3)}$ m/s`), n(`$${f + lam}$ m/s`), n(`$${round(f / lam, 3)}$ m/s`)],
      [`波速 $v = f\\lambda = ${f} \\times ${lam} = ${f * lam}$ m/s。陷阱：$${round(lam / f, 3)}$ 與 $${round(f / lam, 3)}$ 用了除法；$${f + lam}$ 用了加法。單位可作核對：Hz 即每秒次數，乘以米得米每秒，正是速率的單位。`,
       `Wave speed $v = f\\lambda = ${f} \\times ${lam} = ${f * lam}$ m/s. Traps: $${round(lam / f, 3)}$ and $${round(f / lam, 3)}$ divide; $${f + lam}$ adds. Units provide a check: hertz is per second, and per second times metres gives metres per second, the unit of speed.`])
  }
}

// WA2 — 由波速與頻率求波長 λ = v / f
for (const v of [24, 36, 48, 60, 120]) {
  for (const f of [2, 3, 4, 6]) {
    const lam = v / f
    if (!Number.isInteger(lam)) continue
    add(`pb_wa2_${v}_${f}`, T.waves, FW.wave, 'medium',
      [`一列波的波速為 $${v}$ m/s，頻率為 $${f}$ Hz。求其波長。`,
       `A wave travels at $${v}$ m/s with a frequency of $${f}$ Hz. Find its wavelength.`],
      [n(`$${lam}$ m`), n(`$${v * f}$ m`), n(`$${round(f / v, 4)}$ m`), n(`$${v - f}$ m`)],
      [`由 $v = f\\lambda$ 得 $\\lambda = \\dfrac{v}{f} = \\dfrac{${v}}{${f}} = ${lam}$ m。陷阱：$${v * f}$ m 用了乘法；$${round(f / v, 4)}$ m 上下倒轉；$${v - f}$ m 用了減法。一個有用的檢查：波由一種介質進入另一種介質時，頻率由波源決定而不會改變，改變的是波速與波長。`,
       `From $v = f\\lambda$, $\\lambda = \\frac{v}{f} = \\frac{${v}}{${f}} = ${lam}$ m. Traps: $${v * f}$ m multiplies; $${round(f / v, 4)}$ m inverts the fraction; $${v - f}$ m subtracts. A useful check: when a wave passes into another medium the frequency is fixed by the source and does not change — the speed and wavelength do.`])
  }
}

// WA3 — 週期與頻率互為倒數 T = 1 / f
for (const f of [2, 4, 5, 8, 10, 20, 25, 50]) {
  const T2 = round(1 / f, 4)
  add(`pb_wa3_${f}`, T.waves, FW.wave, 'easy',
    [`一列波的頻率為 $${f}$ Hz。求其週期。`, `A wave has a frequency of $${f}$ Hz. Find its period.`],
    [n(`$${T2}$ s`), n(`$${f}$ s`), n(`$${round(f / 2, 3)}$ s`), n(`$${round(60 / f, 3)}$ s`)],
    [`週期與頻率互為倒數：$T = \\dfrac{1}{f} = \\dfrac{1}{${f}} = ${T2}$ s。頻率是每秒振動的次數，週期是完成一次振動所需的秒數，兩者相乘必定得 1。陷阱：$${f}$ s 直接抄了頻率；$${round(60 / f, 3)}$ s 誤用了每分鐘。`,
     `Period and frequency are reciprocals: $T = \\frac{1}{f} = \\frac{1}{${f}} = ${T2}$ s. Frequency is oscillations per second and period is the seconds per oscillation, so their product is always 1. Traps: $${f}$ s copies the frequency; $${round(60 / f, 3)}$ s works per minute.`])
}

// ME1 — 牛頓第二定律 F = ma
for (const mm of [2, 4, 5, 8, 10]) {
  for (const a of [2, 3, 5, 6]) {
    add(`pb_me1_${mm}_${a}`, T.mechanics, FW.conserve, 'easy',
      [`一個質量為 $${mm}$ kg 的物體，其加速度為 $${a}$ m/s²。求作用於它的合力。`,
       `An object of mass $${mm}$ kg accelerates at $${a}$ m/s². Find the net force on it.`],
      [n(`$${mm * a}$ N`), n(`$${round(mm / a, 3)}$ N`), n(`$${mm + a}$ N`), n(`$${mm * G}$ N`)],
      [`牛頓第二定律 $F = ma = ${mm} \\times ${a} = ${mm * a}$ N。陷阱：$${round(mm / a, 3)}$ N 用了除法；$${mm + a}$ N 用了加法；$${mm * G}$ N 誤用重力加速度 $g = ${G}$ m/s²，那是計重量而非本題所問的合力。`,
       `Newton's second law gives $F = ma = ${mm} \\times ${a} = ${mm * a}$ N. Traps: $${round(mm / a, 3)}$ N divides; $${mm + a}$ N adds; $${mm * G}$ N uses $g = ${G}$ m/s², which gives the weight rather than the net force asked for.`])
  }
}

// ME2 — 動量 p = mv
for (const mm of [2, 3, 5, 6, 10]) {
  for (const v of [4, 8, 12]) {
    add(`pb_me2_${mm}_${v}`, T.mechanics, FW.conserve, 'easy',
      [`一個質量為 $${mm}$ kg 的物體以 $${v}$ m/s 移動。求其動量。`,
       `An object of mass $${mm}$ kg moves at $${v}$ m/s. Find its momentum.`],
      [n(`$${mm * v}$ kg·m/s`), n(`$${round(0.5 * mm * v * v, 1)}$ kg·m/s`), n(`$${round(mm / v, 3)}$ kg·m/s`), n(`$${mm + v}$ kg·m/s`)],
      [`動量 $p = mv = ${mm} \\times ${v} = ${mm * v}$ kg·m/s。陷阱：$${round(0.5 * mm * v * v, 1)}$ 是動能 $\\frac{1}{2}mv^2$ 的數值，兩者常被混淆——動量與速度成正比，動能與速度的平方成正比；$${round(mm / v, 3)}$ 用了除法；$${mm + v}$ 用了加法。`,
       `Momentum $p = mv = ${mm} \\times ${v} = ${mm * v}$ kg·m/s. Traps: $${round(0.5 * mm * v * v, 1)}$ is the value of the kinetic energy $\\frac{1}{2}mv^2$, often confused with momentum — momentum is proportional to speed while kinetic energy is proportional to its square; $${round(mm / v, 3)}$ divides; $${mm + v}$ adds.`])
  }
}

// ME3 — 力矩 = 力 × 垂直距離
for (const F of [10, 20, 25, 40, 50]) {
  for (const d of [2, 3, 4]) {
    add(`pb_me3_${F}_${d}`, T.mechanics, FW.conserve, 'medium',
      [`一個 $${F}$ N 的力垂直作用於一支槓桿，作用點距離支點 $${d}$ m。求該力對支點的力矩。`,
       `A force of $${F}$ N acts perpendicular to a lever at a point $${d}$ m from the pivot. Find its moment about the pivot.`],
      [n(`$${F * d}$ N·m`), n(`$${round(F / d, 3)}$ N·m`), n(`$${F + d}$ N·m`), n(`$${F}$ N·m`)],
      [`力矩 $=$ 力 $\\times$ 垂直距離 $= ${F} \\times ${d} = ${F * d}$ N·m。陷阱：$${round(F / d, 3)}$ 用了除法；$${F + d}$ 用了加法；$${F}$ 漏了距離。要留意「垂直距離」指由支點到力的作用線的垂直距離——若力並非垂直作用於槓桿，須先取其垂直分量，這是本課最常見的失分位。`,
       `Moment = force × perpendicular distance = $${F} \\times ${d} = ${F * d}$ N·m. Traps: $${round(F / d, 3)}$ divides; $${F + d}$ adds; $${F}$ omits the distance. Note that perpendicular distance means the distance from the pivot to the line of action of the force — if the force is not perpendicular to the lever, its perpendicular component must be taken first, which is where marks are most often lost.`])
  }
}

// ME4 — 動量守恆：完全非彈性碰撞後的共同速度
for (const m1 of [2, 4, 6]) {
  for (const u1 of [6, 9, 12]) {
    for (const m2 of [2, 3]) {
      const vf = (m1 * u1) / (m1 + m2)
      if (!Number.isInteger(vf)) continue
      add(`pb_me4_${m1}_${u1}_${m2}`, T.mechanics, FW.conserve, 'medium',
        [`一個質量 $${m1}$ kg 的物體以 $${u1}$ m/s 撞向一個靜止的 $${m2}$ kg 物體，兩者碰撞後黏在一起。求碰撞後的共同速度。`,
         `A $${m1}$ kg object moving at $${u1}$ m/s strikes a stationary $${m2}$ kg object and the two stick together. Find their common velocity after the collision.`],
        [n(`$${vf}$ m/s`), n(`$${u1}$ m/s`), n(`$${round(u1 * m2 / (m1 + m2), 2)}$ m/s`), n(`$${round(u1 / 2, 2)}$ m/s`)],
        [`動量守恆：碰撞前總動量 $= ${m1} \\times ${u1} + ${m2} \\times 0 = ${m1 * u1}$ kg·m/s。碰撞後兩者合為一體，總質量 $= ${m1} + ${m2} = ${m1 + m2}$ kg，故共同速度 $= ${m1 * u1} \\div ${m1 + m2} = ${vf}$ m/s。陷阱：$${u1}$ m/s 以為速度不變；$${round(u1 * m2 / (m1 + m2), 2)}$ m/s 用錯了質量；$${round(u1 / 2, 2)}$ m/s 直接取一半，只在兩物質量相等時才成立。留意此類碰撞動量守恆而動能不守恆，部分動能轉為熱與聲。`,
         `Momentum is conserved: before the collision the total is $${m1} \\times ${u1} + ${m2} \\times 0 = ${m1 * u1}$ kg·m/s. Afterwards the combined mass is $${m1} + ${m2} = ${m1 + m2}$ kg, so the common velocity is $${m1 * u1} \\div ${m1 + m2} = ${vf}$ m/s. Traps: $${u1}$ m/s assumes the speed is unchanged; $${round(u1 * m2 / (m1 + m2), 2)}$ m/s uses the wrong mass; $${round(u1 / 2, 2)}$ m/s simply halves, which holds only when the masses are equal. Note that momentum is conserved in such a collision but kinetic energy is not, some of it becoming heat and sound.`])
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 多步計算三個課題（2026-08-28）—— 每題串連兩條公式
// ═══════════════════════════════════════════════════════════════════════════

// HM1 — 自由下落：先由高度求落地速率 v = √(2gh)，再求動能 ½mv²
for (const h of [5, 20, 45, 80, 125, 180]) {
  for (const mm of [2, 4, 5, 10]) {
    const v = Math.sqrt(2 * G * h), ke = 0.5 * mm * v * v
    if (!Number.isInteger(v)) continue
    add(`pb_hm1_${h}_${mm}`, T.hellMech, FW.conserve, 'hard',
      [`一個質量 $${mm}$ kg 的物體由 $${h}$ m 高處自由下落（$g = ${G}$ m/s²，忽略空氣阻力）。求它到達地面時的動能。`,
       `An object of mass $${mm}$ kg falls freely from a height of $${h}$ m ($g = ${G}$ m/s², air resistance negligible). Find its kinetic energy on reaching the ground.`],
      // 注意：mgh 不可用作干擾項 —— 由能量守恆 ½m(2gh) ≡ mgh，它恆等於正解，
      // add() 會因四項不相異而丟棄整組（實測 24 組全滅）。改用其他具名錯誤。
      [n(`$${ke}$ J`), n(`$${mm * v}$ J`), n(`$${v}$ J`), n(`$${2 * ke}$ J`)],
      [`第一步求落地速率：$v = \\sqrt{2gh} = \\sqrt{2 \\times ${G} \\times ${h}} = ${v}$ m/s。第二步求動能：$E_k = \\frac{1}{2}mv^2 = \\frac{1}{2} \\times ${mm} \\times ${v}^2 = ${ke}$ J。核對：由能量守恆，落地動能應等於初始重力位能 $mgh = ${mm} \\times ${G} \\times ${h} = ${mm * G * h}$ J —— 兩條路徑一致（${ke === mm * G * h ? '本題兩者相等' : '若不一致代表某步出錯'}）。陷阱：$${mm * v}$ J 求了動量 $mv$ 而非動能；$${v}$ J 停在速率；$${2 * ke}$ J 漏了公式中的 $\\frac{1}{2}$。`,
       `Step one gives the landing speed: $v = \\sqrt{2gh} = \\sqrt{2 \\times ${G} \\times ${h}} = ${v}$ m/s. Step two gives the kinetic energy: $E_k = \\frac{1}{2}mv^2 = \\frac{1}{2} \\times ${mm} \\times ${v}^2 = ${ke}$ J. Check by conservation of energy: the kinetic energy on landing should equal the initial gravitational potential energy $mgh = ${mm} \\times ${G} \\times ${h} = ${mm * G * h}$ J, and the two routes agree. Traps: $${mm * v}$ J computes the momentum $mv$ rather than the kinetic energy; $${v}$ J stops at the speed; $${2 * ke}$ J omits the factor of $\\frac{1}{2}$.`])
  }
}

// HM2 — 先由 F = ma 求加速度，再由 v = u + at 求末速
for (const F of [20, 30, 40, 60, 80]) {
  for (const mm of [2, 4, 5, 10]) {
    for (const tt of [3, 5]) {
      const a = F / mm, v = a * tt
      if (!Number.isInteger(a)) continue
      add(`pb_hm2_${F}_${mm}_${tt}`, T.hellMech, FW.conserve, 'hard',
        [`一個靜止的 $${mm}$ kg 物體受一個 $${F}$ N 的合力作用 $${tt}$ 秒。求 $${tt}$ 秒後的速率。`,
         `A stationary $${mm}$ kg object is acted on by a net force of $${F}$ N for $${tt}$ s. Find its speed after $${tt}$ s.`],
        [n(`$${v}$ m/s`), n(`$${a}$ m/s`), n(`$${F * tt}$ m/s`), n(`$${round(F * tt / mm / 2, 2)}$ m/s`)],
        [`第一步由牛頓第二定律求加速度：$a = \\dfrac{F}{m} = \\dfrac{${F}}{${mm}} = ${a}$ m/s²。第二步由 $v = u + at$（初速 $u = 0$）：$v = 0 + ${a} \\times ${tt} = ${v}$ m/s。陷阱：$${a}$ m/s 停在加速度（而且單位錯，加速度是 m/s²）；$${F * tt}$ m/s 是衝量 $Ft$ 的數值，未除以質量；$${round(F * tt / mm / 2, 2)}$ m/s 多除了 2。`,
         `Step one uses Newton's second law for the acceleration: $a = \\frac{F}{m} = \\frac{${F}}{${mm}} = ${a}$ m/s². Step two uses $v = u + at$ with $u = 0$: $v = 0 + ${a} \\times ${tt} = ${v}$ m/s. Traps: $${a}$ m/s stops at the acceleration and has the wrong unit, since acceleration is in m/s²; $${F * tt}$ m/s is the impulse $Ft$ without dividing by mass; $${round(F * tt / mm / 2, 2)}$ m/s halves it unnecessarily.`])
    }
  }
}

// HE1 — 先由 V = IR 求電流，再由 P = VI 求功率
for (const V of [12, 24, 36, 48, 60]) {
  for (const R of [2, 3, 4, 6, 12]) {
    const I = V / R, P = V * I
    if (!Number.isInteger(I)) continue
    add(`pb_he1_${V}_${R}`, T.hellElec, FW.circuit, 'hard',
      [`一個 $${R}\\ \\Omega$ 的電阻接上 $${V}$ V 電源。求該電阻所消耗的功率。`,
       `A $${R}\\ \\Omega$ resistor is connected to a $${V}$ V supply. Find the power dissipated in it.`],
      [n(`$${P}$ W`), n(`$${I}$ W`), n(`$${V * R}$ W`), n(`$${round(V / (R * R), 3)}$ W`)],
      [`第一步由歐姆定律求電流：$I = \\dfrac{V}{R} = \\dfrac{${V}}{${R}} = ${I}$ A。第二步求功率：$P = VI = ${V} \\times ${I} = ${P}$ W。亦可一步到位用 $P = \\dfrac{V^2}{R} = \\dfrac{${V * V}}{${R}} = ${P}$ W —— 兩條路徑必須一致，這是最有效的自我檢查。陷阱：$${I}$ W 停在電流；$${V * R}$ W 把定律中的除法寫成乘法。`,
       `Step one uses Ohm's law for the current: $I = \\frac{V}{R} = \\frac{${V}}{${R}} = ${I}$ A. Step two gives the power: $P = VI = ${V} \\times ${I} = ${P}$ W. The one-step route $P = \\frac{V^2}{R} = \\frac{${V * V}}{${R}} = ${P}$ W must agree, which is the most effective self-check. Traps: $${I}$ W stops at the current; $${V * R}$ W multiplies where Ohm's law divides.`])
  }
}

// HE2 — 先由 E = Pt 求電能，再由 E = mcΔT 求溫升
// 功率與時間刻意選成令 Pt 可被 m × 4200 整除（4200 = 2³·3·5²·7）——
// 原先的 500/1000/1200/2000 W 配 60/120/300 s 沒有一個組合得出整數溫升，
// 結果整組被 add() 丟棄。參數化題庫要先確認參數空間真係產得出題。
for (const P of [700, 1400, 2100]) {
  for (const tt of [30, 60, 120]) {
    for (const mm of [1, 2, 4]) {
      const E = P * tt, dT = E / (mm * 4200)
      if (!Number.isInteger(dT)) continue
      add(`pb_he2_${P}_${tt}_${mm}`, T.hellElec, FW.circuit, 'hard',
        [`一個 $${P}$ W 的電熱水器加熱 $${mm}$ kg 水共 $${tt}$ 秒。假設所有電能轉為水的內能（水的比熱容 $= 4200$ J kg⁻¹ °C⁻¹），求水的溫度上升多少？`,
         `A $${P}$ W heater warms $${mm}$ kg of water for $${tt}$ s. Assuming all the electrical energy goes into the water (specific heat capacity $= 4200$ J kg⁻¹ °C⁻¹), find the temperature rise.`],
        [n(`$${dT}$ °C`), n(`$${E}$ °C`), n(`$${round(E / 4200, 2)}$ °C`), n(`$${round(P / (mm * 4200), 4)}$ °C`)],
        [`第一步求電能：$E = Pt = ${P} \\times ${tt} = ${E}$ J。第二步由 $E = mc\\Delta T$ 求溫升：$\\Delta T = \\dfrac{E}{mc} = \\dfrac{${E}}{${mm} \\times 4200} = ${dT}$ °C。陷阱：$${E}$ °C 停在能量（單位亦錯）；$${round(E / 4200, 2)}$ °C 漏了除以質量；$${round(P / (mm * 4200), 4)}$ °C 漏了乘以時間。留意題目假設「所有電能轉為水的內能」——現實中必有熱量散失，實際溫升會較低，答論述題時值得指出這個假設。`,
         `Step one gives the energy: $E = Pt = ${P} \\times ${tt} = ${E}$ J. Step two uses $E = mc\\Delta T$: $\\Delta T = \\frac{E}{mc} = \\frac{${E}}{${mm} \\times 4200} = ${dT}$ °C. Traps: $${E}$ °C stops at the energy and has the wrong unit; $${round(E / 4200, 2)}$ °C omits the mass; $${round(P / (mm * 4200), 4)}$ °C omits the time. Note the stated assumption that all the electrical energy reaches the water — in reality some is lost and the real rise is smaller, a point worth making in an extended answer.`])
    }
  }
}

// HW1 — 先由 v = fλ 求波速，再由 t = d/v 求傳播時間
for (const f of [4, 5, 10, 20]) {
  for (const lam of [3, 6, 15]) {
    for (const d of [120, 300, 600]) {
      const v = f * lam, tt = d / v
      if (!Number.isInteger(tt)) continue
      add(`pb_hw1_${f}_${lam}_${d}`, T.hellWave, FW.wave, 'hard',
        [`一列波的頻率為 $${f}$ Hz、波長為 $${lam}$ m。求該波傳播 $${d}$ m 所需的時間。`,
         `A wave has frequency $${f}$ Hz and wavelength $${lam}$ m. How long does it take to travel $${d}$ m?`],
        [n(`$${tt}$ s`), n(`$${v}$ s`), n(`$${round(d / f, 2)}$ s`), n(`$${round(d / lam, 2)}$ s`)],
        [`第一步求波速：$v = f\\lambda = ${f} \\times ${lam} = ${v}$ m/s。第二步求時間：$t = \\dfrac{d}{v} = \\dfrac{${d}}{${v}} = ${tt}$ s。陷阱：$${v}$ s 停在波速（單位亦錯）；$${round(d / f, 2)}$ s 用頻率作分母；$${round(d / lam, 2)}$ s 用波長作分母 —— 後兩者都跳過了求波速這一步。`,
         `Step one gives the wave speed: $v = f\\lambda = ${f} \\times ${lam} = ${v}$ m/s. Step two gives the time: $t = \\frac{d}{v} = \\frac{${d}}{${v}} = ${tt}$ s. Traps: $${v}$ s stops at the speed and has the wrong unit; $${round(d / f, 2)}$ s divides by the frequency; $${round(d / lam, 2)}$ s divides by the wavelength — both skip the step of finding the speed.`])
    }
  }
}

// HW2 — 先數半衰期數目，再求剩餘活度
for (const T12 of [3, 5, 8, 10]) {
  for (let k = 2; k <= 5; k++) {
    for (const A0 of [640, 1280, 3200]) {
      const left = A0 / 2 ** k
      if (!Number.isInteger(left)) continue
      add(`pb_hw2_${T12}_${k}_${A0}`, T.hellWave, FW.decay, 'hard',
        [`某放射源的半衰期為 $${T12}$ 天，初始活度為 $${A0}$ Bq。經過 $${T12 * k}$ 天之後，其活度是多少？`,
         `A source has a half-life of $${T12}$ days and an initial activity of $${A0}$ Bq. What is its activity after $${T12 * k}$ days?`],
        [n(`$${left}$ Bq`), n(`$${round(A0 / (2 * k), 1)}$ Bq`), n(`$${A0 - left}$ Bq`), n(`$${round(A0 / k, 1)}$ Bq`)],
        [`第一步數半衰期數目：$${T12 * k} \\div ${T12} = ${k}$ 個。第二步求剩餘活度：每個半衰期活度減半，故 $${A0} \\div 2^{${k}} = ${left}$ Bq。陷阱：$${round(A0 / (2 * k), 1)}$ Bq 把「減半 ${k} 次」誤算成除以 $2 \\times ${k}$ —— 減半是連乘而非連加；$${A0 - left}$ Bq 是已衰變的部分；$${round(A0 / k, 1)}$ Bq 只除以半衰期數目。`,
         `Step one counts the half-lives: $${T12 * k} \\div ${T12} = ${k}$. Step two applies them: the activity halves each time, so $${A0} \\div 2^{${k}} = ${left}$ Bq. Traps: $${round(A0 / (2 * k), 1)}$ Bq treats ${k} halvings as dividing by $2 \\times ${k}$, but halving compounds rather than adds; $${A0 - left}$ Bq is the portion that has decayed; $${round(A0 / k, 1)}$ Bq divides only by the number of half-lives.`])
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// force_motion 與 heat 補強（2026-08-28）—— 兩者各 33 / 42 條，低於平均值 77。
// 現有題型只有「重量 W=mg」「動量 p=mv」（力與運動）同「E=mcΔT」一族（熱學），
// 故新模板刻意避開該兩類，改用摩擦力、合力、潛熱、溫標換算。
// ═══════════════════════════════════════════════════════════════════════════

// FM1 — 摩擦力 f = μN，其中 N = mg（水平面）
for (const mm of [2, 4, 5, 8, 10, 20]) {
  for (const mu of [0.2, 0.25, 0.4, 0.5]) {
    const N2 = mm * G, f = mu * N2
    if (!Number.isInteger(f)) continue
    add(`pb_fm1_${mm}_${String(mu).replace('.', '')}`, T.forces, FW.formula, 'medium',
      [`一個質量 $${mm}$ kg 的物體靜止於水平面上，物體與面的動摩擦係數為 $${mu}$（$g = ${G}$ N/kg）。要令它以等速滑動，所需的水平推力是多少？`,
       `A $${mm}$ kg block rests on a horizontal surface with coefficient of kinetic friction $${mu}$ ($g = ${G}$ N/kg). What horizontal push is needed to slide it at constant speed?`],
      [n(`$${f}$ N`), n(`$${N2}$ N`), n(`$${round(mm * mu, 2)}$ N`), n(`$${round(N2 / mu, 2)}$ N`)],
      [`等速滑動即合力為零，推力必須恰好抵銷摩擦力。先求正向力：水平面上 $N = mg = ${mm} \\times ${G} = ${N2}$ N。再求摩擦力：$f = \\mu N = ${mu} \\times ${N2} = ${f}$ N。陷阱：$${N2}$ N 是正向力（即重量）而非摩擦力；$${round(mm * mu, 2)}$ N 漏了乘以 $g$；$${round(N2 / mu, 2)}$ N 用了除法。留意摩擦力與接觸面積無關，只取決於正向力與摩擦係數。`,
       `Constant speed means zero net force, so the push must exactly balance friction. First the normal force: on a horizontal surface $N = mg = ${mm} \\times ${G} = ${N2}$ N. Then friction: $f = \\mu N = ${mu} \\times ${N2} = ${f}$ N. Traps: $${N2}$ N is the normal force, that is the weight, not the friction; $${round(mm * mu, 2)}$ N omits $g$; $${round(N2 / mu, 2)}$ N divides. Note that friction does not depend on the contact area, only on the normal force and the coefficient.`])
  }
}

// FM2 — 同一直線上兩力的合力
for (const F1 of [12, 20, 25, 30, 40, 50]) {
  for (const F2 of [5, 8, 15, 18]) {
    if (F1 === F2) continue
    add(`pb_fm2_${F1}_${F2}`, T.forces, FW.formula, 'easy',
      [`一個物體同時受兩個方向【相反】的力作用：一個 $${F1}$ N 向右，一個 $${F2}$ N 向左。求合力的大小與方向。`,
       `An object is acted on by two opposing forces: $${F1}$ N to the right and $${F2}$ N to the left. Find the magnitude and direction of the net force.`],
      [[`$${F1 - F2}$ N，向右`, `$${F1 - F2}$ N to the right`],
       [`$${F1 + F2}$ N，向右`, `$${F1 + F2}$ N to the right`],
       [`$${F1 - F2}$ N，向左`, `$${F1 - F2}$ N to the left`],
       [`$${F1 * F2}$ N，向右`, `$${F1 * F2}$ N to the right`]],
      [`方向相反的兩力，合力大小為兩者之差，方向跟隨較大者：$${F1} - ${F2} = ${F1 - F2}$ N，向右。陷阱：$${F1 + F2}$ N 把方向相反的兩力相加（同向才可相加）；方向向左者誤判了哪一個力較大；$${F1 * F2}$ N 用了相乘。判斷合力時先定正方向，把反向的力寫成負數再相加，比記「同加異減」穩妥。`,
       `For forces in opposite directions the net force is their difference, acting in the direction of the larger: $${F1} - ${F2} = ${F1 - F2}$ N to the right. Traps: $${F1 + F2}$ N adds opposing forces, which is only valid when they act the same way; the leftward option mistakes which force is larger; $${F1 * F2}$ N multiplies. Fixing a positive direction and writing opposing forces as negative before adding is safer than recalling a rule about adding and subtracting.`])
  }
}

// HT1 — 潛熱 E = mL（熔化／汽化，不涉溫度變化）
for (const mm of [2, 3, 5, 8, 10]) {
  for (const [L, kind, kindEn] of [[334000, '熔化', 'melting'], [2260000, '汽化', 'vaporising']] as [number, string, string][]) {
    const E = mm * L
    add(`pb_ht1_${mm}_${L}`, T.heat, FW.formula, 'medium',
      [`把 $${mm}$ kg 的水在其${kind === '熔化' ? '熔點' : '沸點'}完全${kind}，所需的熱量是多少？（比${kind === '熔化' ? '熔化' : '汽化'}潛熱 $= ${(L / 1000).toLocaleString('en-US')}$ kJ/kg）`,
       `How much heat is needed to completely ${kindEn === 'melting' ? 'melt' : 'vaporise'} $${mm}$ kg of water at its ${kindEn === 'melting' ? 'melting' : 'boiling'} point? (specific latent heat $= ${(L / 1000).toLocaleString('en-US')}$ kJ/kg)`],
      [n(`$${(E / 1000).toLocaleString('en-US')}$ kJ`), n(`$${(L / 1000).toLocaleString('en-US')}$ kJ`), n(`$${round(L / 1000 / mm, 1)}$ kJ`), n(`$${(mm * 4.2).toLocaleString('en-US')}$ kJ`)],
      [`潛熱 $E = mL = ${mm} \\times ${(L / 1000).toLocaleString('en-US')} = ${(E / 1000).toLocaleString('en-US')}$ kJ。關鍵在於${kind}期間溫度【保持不變】——吸收的熱量全部用於改變物態而非升溫，所以這裏用 $E = mL$ 而不是 $E = mc\\Delta T$。陷阱：$${(L / 1000).toLocaleString('en-US')}$ kJ 只是每公斤的潛熱，未乘以質量；$${round(L / 1000 / mm, 1)}$ kJ 用了除法；$${(mm * 4.2).toLocaleString('en-US')}$ kJ 誤用了比熱容。`,
       `Latent heat is $E = mL = ${mm} \\times ${(L / 1000).toLocaleString('en-US')} = ${(E / 1000).toLocaleString('en-US')}$ kJ. The essential point is that the temperature stays constant during ${kindEn}: all the heat absorbed changes the state rather than the temperature, which is why $E = mL$ applies here rather than $E = mc\\Delta T$. Traps: $${(L / 1000).toLocaleString('en-US')}$ kJ is the latent heat per kilogram without the mass; $${round(L / 1000 / mm, 1)}$ kJ divides; $${(mm * 4.2).toLocaleString('en-US')}$ kJ uses the specific heat capacity instead.`])
  }
}

// HT2 — 攝氏與絕對溫標換算 T(K) = θ(°C) + 273
for (const c of [-100, -40, 0, 25, 37, 100, 200, 300, 500]) {
  const k = c + 273
  add(`pb_ht2_${c}`, T.heat, FW.formula, 'easy',
    [`$${c}$ °C 相當於絕對溫標的多少開爾文（K）？`, `What is $${c}$ °C on the absolute temperature scale, in kelvin?`],
    [n(`$${k}$ K`), n(`$${c - 273}$ K`), n(`$${c}$ K`), n(`$${273 - c}$ K`)],
    [`絕對溫標與攝氏溫標的刻度大小相同，只是零點不同：$T(\\mathrm{K}) = \\theta(°\\mathrm{C}) + 273$。故 $${c} + 273 = ${k}$ K。陷阱：$${c - 273}$ K 減了 273（方向相反）；$${c}$ K 直接抄了攝氏值；$${273 - c}$ K 把相減次序調轉。留意絕對零度 $0$ K $= -273$ °C 是理論上的最低溫，所以任何以 K 表示的溫度都不會是負數 —— 若計出負值，必定有一步出錯。`,
     `The absolute and Celsius scales have the same size of degree but different zero points: $T(\\mathrm{K}) = \\theta(°\\mathrm{C}) + 273$, so $${c} + 273 = ${k}$ K. Traps: $${c - 273}$ K subtracts instead of adding; $${c}$ K copies the Celsius value; $${273 - c}$ K reverses the subtraction. Note that absolute zero, $0$ K $= -273$ °C, is the theoretical minimum, so no temperature in kelvin is ever negative — a negative result means a step has gone wrong.`])
}

// ═══════════════════════════════════════════════════════════════════════════
// 第三批母模板 —— 平均分佈補強（2026-08-29）
// 物理已過 1,000，但電學 213 條而多步計算・電與熱只有 38 條、放射現象 50 條，
// 不均比 5.6×。電學一條不動，只補最薄的四個課題。
// ═══════════════════════════════════════════════════════════════════════════

// HE3 — 多步：電熱器加熱水（P = VI，Q = Pt = mcΔT）
for (const V of [110, 220]) {
  for (const I of [2, 4, 5, 10]) {
    for (const t of [60, 120, 300]) {
      const P = V * I, Q = P * t
      const m = 1, c = 4200
      const dT = Q / (m * c)
      if (!Number.isInteger(dT) || dT > 90) continue
      add(`physc_he3_${V}_${I}_${t}`, T.hellElec, FW.circuit, 'hard',
        [`一個電熱器接上 ${V} V 電源，通過的電流為 ${I} A，運作 ${t} 秒。若全部能量用於加熱 1 kg 水（比熱容 4200 J kg⁻¹ °C⁻¹），水溫上升多少度？`,
         `A heater is connected to a ${V} V supply and draws ${I} A for ${t} s. If all the energy heats 1 kg of water (specific heat capacity 4200 J kg⁻¹ °C⁻¹), by how much does the temperature rise?`],
        [n(`$${dT}$ °C`), n(`$${round(Q / 1000, 1)}$ °C`), n(`$${round(P / c, 4)}$ °C`), n(`$${round(dT * c, 0)}$ °C`)],
        [`第一步求功率：$P = VI = ${V} \\times ${I} = ${P}$ W。第二步求能量：$Q = Pt = ${P} \\times ${t} = ${Q}$ J。第三步用 $Q = mc\\Delta T$ 解出溫升：$\\Delta T = \\dfrac{${Q}}{1 \\times 4200} = ${dT}$ °C。三步各有一個公式，中間任何一步跳過都會出錯，這正是多步計算題的考核重點。陷阱：$${round(Q / 1000, 1)}$ °C 誤除以 1000；$${round(P / c, 4)}$ °C 漏了乘時間；$${round(dT * c, 0)}$ °C 漏了除以比熱容。`,
         `Step one, the power: $P = VI = ${V} \\times ${I} = ${P}$ W. Step two, the energy: $Q = Pt = ${P} \\times ${t} = ${Q}$ J. Step three, rearranging $Q = mc\\Delta T$: $\\Delta T = \\frac{${Q}}{1 \\times 4200} = ${dT}$ °C. Each step uses its own formula and skipping any one goes wrong, which is exactly what a multi-step item tests. Traps: $${round(Q / 1000, 1)}$ °C divides by 1000; $${round(P / c, 4)}$ °C omits the time; $${round(dT * c, 0)}$ °C omits the division by the specific heat capacity.`])
    }
  }
}

// HE4 — 多步：電費計算（kWh）
for (const P of [500, 800, 1000, 1500, 2000]) {
  for (const hrs of [2, 4, 5, 10]) {
    for (const rate of [1, 2]) {
      const kwh = (P * hrs) / 1000
      const cost = kwh * rate
      if (!Number.isInteger(cost * 10)) continue
      add(`physc_he4_${P}_${hrs}_${rate}`, T.hellElec, FW.circuit, 'medium',
        [`一件功率 ${P} W 的電器每日運作 ${hrs} 小時。若電費為每千瓦時 ${rate} 元，每日電費是多少？`,
         `An appliance rated ${P} W runs for ${hrs} hours a day. At \\$${rate} per kilowatt-hour, what is the daily cost?`],
        [[`${round(cost, 2)} 元`, `\\$${round(cost, 2)}`],
         [`${round(P * hrs * rate, 0)} 元`, `\\$${round(P * hrs * rate, 0)}`],
         [`${round(kwh, 2)} 元`, `\\$${round(kwh, 2)}`],
         [`${round(cost / hrs, 3)} 元`, `\\$${round(cost / hrs, 3)}`]],
        [`先把功率由瓦轉為千瓦：$${P}$ W $= ${P / 1000}$ kW。再求耗電量：$${P / 1000} \\times ${hrs} = ${kwh}$ kWh。最後乘電費率：$${kwh} \\times ${rate} = ${round(cost, 2)}$ 元。千瓦時是【能量】單位而非功率單位 —— 它等於以 1 kW 運作 1 小時所耗的能量，這是本題最常混淆的一點。陷阱：${round(P * hrs * rate, 0)} 元漏了瓦轉千瓦；${round(kwh, 2)} 元停在耗電量而未乘電費率；${round(cost / hrs, 3)} 元多除了一次時間。`,
         `First convert power to kilowatts: $${P}$ W $= ${P / 1000}$ kW. Then the energy used: $${P / 1000} \\times ${hrs} = ${kwh}$ kWh. Finally multiply by the tariff: $${kwh} \\times ${rate} = \\$${round(cost, 2)}$. A kilowatt-hour is a unit of ENERGY, not power — it is the energy used by 1 kW running for one hour, and that is the commonest confusion here. Traps: \\$${round(P * hrs * rate, 0)} omits the watt-to-kilowatt conversion; \\$${round(kwh, 2)} stops at the energy without applying the tariff; \\$${round(cost / hrs, 3)} divides by the time again.`])
    }
  }
}

// RA3 — 放射性衰變：剩餘活度
for (const A0 of [800, 1000, 1200, 1600, 2000, 3200]) {
  for (const nHalf of [1, 2, 3, 4]) {
    const rest = A0 / 2 ** nHalf
    if (!Number.isInteger(rest)) continue
    add(`physc_ra3_${A0}_${nHalf}`, T.radioactivity, FW.decay, 'medium',
      [`某放射源的初始活度為 ${A0} Bq，半衰期為 6 小時。經過 ${6 * nHalf} 小時後，其活度是多少？`,
       `A source has an initial activity of ${A0} Bq and a half-life of 6 hours. What is its activity after ${6 * nHalf} hours?`],
      [n(`$${rest}$ Bq`), n(`$${round(A0 / (nHalf + 1), 1)}$ Bq`), n(`$${A0 - nHalf * (A0 / 2)}$ Bq`), n(`$${round(A0 / (2 * nHalf), 1)}$ Bq`)],
      [`${6 * nHalf} 小時等於 $\\dfrac{${6 * nHalf}}{6} = ${nHalf}$ 個半衰期。每過一個半衰期活度減半，故剩餘活度 $= ${A0} \\times \\left(\\dfrac{1}{2}\\right)^{${nHalf}} = ${rest}$ Bq。衰變是【指數】而非線性的：經過 ${nHalf} 個半衰期並不是減去 ${nHalf} 個一半，而是連續減半 ${nHalf} 次，所以活度永遠不會真正歸零。陷阱：$${round(A0 / (nHalf + 1), 1)}$ Bq 與 $${round(A0 / (2 * nHalf), 1)}$ Bq 都把指數關係當成除法；$${A0 - nHalf * (A0 / 2)}$ Bq 把減半當成線性遞減。`,
       `${6 * nHalf} hours is $\\frac{${6 * nHalf}}{6} = ${nHalf}$ half-lives. Activity halves each half-life, so the remainder is $${A0} \\times \\left(\\frac{1}{2}\\right)^{${nHalf}} = ${rest}$ Bq. Decay is EXPONENTIAL, not linear: ${nHalf} half-lives does not mean subtracting ${nHalf} halves but halving ${nHalf} times over, which is why activity never truly reaches zero. Traps: $${round(A0 / (nHalf + 1), 1)}$ Bq and $${round(A0 / (2 * nHalf), 1)}$ Bq both replace the exponential with a division; $${A0 - nHalf * (A0 / 2)}$ Bq treats halving as a linear decrease.`])
  }
}

// RA4 — 核方程中的質量數與原子序守恆
;([['α', 4, 2], ['β', 0, -1]] as [string, number, number][]).forEach(([mode, dA, dZ]) => {
  for (const [A, Z] of [[226, 88], [238, 92], [214, 82], [210, 84], [232, 90], [220, 86],
    [212, 83], [228, 88], [234, 90], [206, 81]] as [number, number][]) {
    const A2 = A - dA, Z2 = Z - dZ
    add(`physc_ra4_${mode === 'α' ? 'a' : 'b'}_${A}_${Z}`, T.radioactivity, FW.decay, 'hard',
      [`一個質量數 ${A}、原子序 ${Z} 的原子核放出一個 ${mode} 粒子。衰變後子核的質量數與原子序分別是多少？`,
       `A nucleus of mass number ${A} and atomic number ${Z} emits an ${mode} particle. What are the mass number and atomic number of the daughter nucleus?`],
      [n(`$${A2}$、$${Z2}$`), n(`$${A - dA}$、$${Z + dZ}$`), n(`$${A + dA}$、$${Z - dZ}$`), n(`$${A}$、$${Z2}$`)],
      [`核反應中質量數與原子序皆守恆。${mode === 'α' ? 'α 粒子即氦核，帶走 4 個質量數與 2 個原子序，故兩者分別減 4 與減 2' : 'β 粒子是電子，質量數不變；核內一個中子轉為質子並放出電子，故原子序【增加】1'}：質量數 $${A} \\to ${A2}$，原子序 $${Z} \\to ${Z2}$。陷阱：其餘三項分別把原子序的增減方向寫反、把質量數的增減方向寫反，或忘記改動質量數。`,
       `Both mass number and atomic number are conserved in nuclear reactions. ${mode === 'α' ? 'An alpha particle is a helium nucleus carrying away 4 mass units and 2 protons, so both fall, by 4 and by 2 respectively' : 'A beta particle is an electron, so the mass number is unchanged; a neutron becomes a proton and emits the electron, so the atomic number INCREASES by 1'}: mass number $${A} \\to ${A2}$, atomic number $${Z} \\to ${Z2}$. Traps: the other options reverse the direction of the atomic-number change, reverse the mass-number change, or leave the mass number untouched.`])
  }
})

export const physicsBankQuestions: Question[] = bank

// ── 課題登記（2026-07-28 稽核修正）──────────────────────────────────────────
// 本題庫所用的 topic id 從未登記於科目的 *Topics 清單，令相關試題雖然存在於
// 題庫，學生卻無法經課題入口（/practice?topic=、/subjects 課題標籤、/notes）
// 篩選得到。現依 *-hell.ts 的既有慣例，由題庫自行匯出課題，再於科目檔案
// push 併入：T/FW 已在上方定義，毋須兩處重複維護，日後新增題目族亦自動登記。
// `count` 於 getSubjectTopics() 讀取時按真實題數計算，此處填 0 僅作佔位
// （見 types.ts 的說明）。
export const physicsBankTopics: Topic[] = topicList([
  { topic: T.kinematics, fw: FW.formula, count: 0 },
  { topic: T.forces, fw: FW.formula, count: 0 },
  { topic: T.pressure, fw: FW.formula, count: 0 },
  { topic: T.energy, fw: FW.energy, count: 0 },
])
