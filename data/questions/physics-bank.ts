import type { Question } from './types'
import { createBank, n, frac, round, type TopicMeta, type FwMeta } from './_parametric'

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
} satisfies Record<string, TopicMeta>

const FW = {
  formula: { id: 'core_formula', zh: '基礎公式', en: 'Core Formula', emoji: '🔬' },
  motion: { id: 'motion_analysis', zh: '運動分析', en: 'Motion Analysis', emoji: '🚀' },
  energy: { id: 'energy_conservation', zh: '能量守恆', en: 'Energy Conservation', emoji: '⚡' },
  circuit: { id: 'circuit_analysis', zh: '電路分析', en: 'Circuit Analysis', emoji: '🔌' },
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
      [`速率 $= \\dfrac{\\text{距離}}{\\text{時間}} = \\dfrac{${d}}{${t}} = ${v}$ m/s。陷阱：$${d * t}$ 用咗乘法；$${round(t / d, 3)}$ 上下倒轉。`,
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
    [`$W = mg = ${m} \\times 10 = ${m * G}$ N。陷阱：$${m}$ 漏咗 $\\times g$；$${round(m / G, 2)}$ 錯用了除法。`,
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
        [`$v = u + at = ${u} + ${a}\\times${t} = ${u} + ${a * t} = ${v}$ m/s。陷阱：$${a * t}$ 漏咗初速 $u$；$${u + a}$ 漏咗 $\\times t$。`,
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
      [`$E_k = \\tfrac12 mv^2 = \\tfrac12 \\times ${m} \\times ${v}^2 = ${ke}$ J。陷阱：$${m * v * v}$ 漏咗 $\\tfrac12$；$${0.5 * m * v}$ 漏咗平方。`,
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
      [`$E_p = mgh = ${m}\\times10\\times${h} = ${pe}$ J。陷阱：$${m * h}$ 漏咗 $g$；$${0.5 * m * G * h}$ 誤加咗 $\\tfrac12$（嗰個係動能公式）。`,
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
      [`$p = mv = ${m}\\times${v} = ${m * v}$ kg·m/s。陷阱：$${0.5 * m * v}$ 誤加 $\\tfrac12$（嗰個係動能）；$${round(m / v, 3)}$ 用咗除法。`,
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
      [`$P = \\dfrac{F}{A} = \\dfrac{${F}}{${A}} = ${p}$ Pa。陷阱：$${F * A}$ 用咗乘法；$${round(A / F, 3)}$ 上下倒轉。`,
       `$P = \\frac{F}{A} = ${p}$ Pa. Trap: $${F * A}$ multiplies instead.`])
  }
}

// M7 — resistors in series R = R₁ + R₂
;([[2, 3], [4, 6], [5, 10], [8, 4], [12, 6], [3, 9], [7, 5], [10, 15], [6, 6], [9, 3]] as const)
  .forEach(([r1, r2], i) => {
    add(`pb_m7_${i}`, T.electricity, FW.circuit, 'medium',
      [`兩個電阻 $${r1}$ Ω 及 $${r2}$ Ω 串聯，求總電阻。`, `Two resistors $${r1}$ Ω and $${r2}$ Ω are in series. Find the total resistance.`],
      [n(`$${r1 + r2}$ Ω`), n(`$${round((r1 * r2) / (r1 + r2), 2)}$ Ω`), n(`$${r1 * r2}$ Ω`), n(`$${round((r1 + r2) / 2, 2)}$ Ω`)],
      [`串聯：$R = R_1 + R_2 = ${r1} + ${r2} = ${r1 + r2}$ Ω。陷阱：$${round((r1 * r2) / (r1 + r2), 2)}$ 係並聯公式；$${round((r1 + r2) / 2, 2)}$ 係取平均。`,
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
        [`$v = \\sqrt{u^2 + 2as} = \\sqrt{${u * u} + ${2 * a * s}} = \\sqrt{${v2}} = ${v}$ m/s。陷阱：$${v2}$ 漏咗開方；$${u + a * s}$ 亂套 $u+as$。`,
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
        [`$Q = mc\\Delta T = ${m}\\times${c}\\times${dT} = ${Q}$ J。陷阱：$${m * c}$ 漏咗 $\\Delta T$；$${c * dT}$ 漏咗質量 $m$。`,
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
    [`$h = \\tfrac12 g t^2$ ⇒ $t = \\sqrt{\\dfrac{2h}{g}} = \\sqrt{\\dfrac{${2 * h}}{10}} = ${t}$ s。陷阱：$${round((2 * h) / G, 2)}$ 漏咗開方；$${round(Math.sqrt(h / G), 2)}$ 漏咗個 $2$。`,
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
      [`效率 $= \\dfrac{\\text{有用輸出}}{\\text{總輸入}} \\times 100\\% = \\dfrac{${useful}}{${total}} \\times 100\\% = ${pct}\\%$。陷阱：$${100 - pct}\\%$ 係損耗百分比；$${round(useful / total, 2)}$ 漏咗 $\\times 100\\%$。`,
       `Efficiency $= \\frac{\\text{useful}}{\\text{total}} \\times 100\\% = ${pct}\\%$. Trap: $${100 - pct}\\%$ is the wasted fraction.`])
  }
}

export const physicsBankQuestions: Question[] = bank
