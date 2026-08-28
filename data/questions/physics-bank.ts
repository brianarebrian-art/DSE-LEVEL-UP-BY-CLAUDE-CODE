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
