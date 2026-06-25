import type { Question, Topic } from './types'
import { makeQ, topicList, rnd, type Pair, type TopicMeta, type FwMeta } from './_builder'

// HKDSE Physics — 120-question bilingual bank. Parametrised numeric generators
// (answers code-computed) + curated conceptual items. Units are language-neutral.
const q = makeQ('physics')

const T = {
  mechanics: { id: 'mechanics', zh: '力學', en: 'Mechanics' },
  electricity: { id: 'electricity', zh: '電學', en: 'Electricity' },
  heat: { id: 'heat', zh: '熱學', en: 'Heat' },
  waves: { id: 'waves', zh: '波動', en: 'Waves' },
  optics: { id: 'optics', zh: '光學', en: 'Optics' },
  radioactivity: { id: 'radioactivity', zh: '放射現象', en: 'Radioactivity' },
} satisfies Record<string, TopicMeta>

const FW = {
  conserve: { id: 'conservation', zh: '守恆定律', en: 'Conservation Laws', emoji: '⚖️' },
  circuit: { id: 'circuit', zh: '電路分析', en: 'Circuit Analysis', emoji: '⚡' },
  energy: { id: 'energy', zh: '能量轉移', en: 'Energy Transfer', emoji: '🔥' },
  wave: { id: 'wave', zh: '波的關係', en: 'Wave Relationships', emoji: '🌊' },
  light: { id: 'light', zh: '光的傳播', en: 'Propagation of Light', emoji: '🔦' },
  decay: { id: 'decay', zh: '衰變規律', en: 'Decay Laws', emoji: '☢️' },
} satisfies Record<string, FwMeta>

const opt = (v: string): Pair => [`$${v}$`, `$${v}$`]
let uid = 0
const id = (p: string) => `phy_${p}_${++uid}`

// ── Mechanics (30) ───────────────────────────────────────────────────────────
const mech: Question[] = []
// F = ma
;[[2, 3], [5, 4], [10, 2], [3, 6], [8, 5], [4, 9], [12, 3], [6, 7]].forEach(([m, a], i) =>
  mech.push(q(id('fma'), T.mechanics, FW.conserve, i < 2 ? 'easy' : 'medium', 2019 + (i % 5), 1,
    [`質量 $${m}\\,\\text{kg}$ 的物體受合力後加速度為 $${a}\\,\\text{m/s}^2$，求合力。`,
      `An object of mass $${m}\\,\\text{kg}$ accelerates at $${a}\\,\\text{m/s}^2$. Find the net force.`],
    [opt(`${m * a}\\,\\text{N}`), opt(`${m + a}\\,\\text{N}`), opt(`${rnd(a / m)}\\,\\text{N}`), opt(`${2 * m * a}\\,\\text{N}`)],
    [`$F = ma = ${m} \\times ${a} = ${m * a}\\,\\text{N}$。`, `$F = ma = ${m} \\times ${a} = ${m * a}\\,\\text{N}$.`])))
// v = u + at
;[[5, 2, 4], [4, 3, 6], [10, -2, 3], [2, 4, 5], [6, 2, 4]].forEach(([u, a, t], i) =>
  mech.push(q(id('vuat'), T.mechanics, FW.conserve, 'medium', 2020 + (i % 4), 1,
    [`初速 $${u}\\,\\text{m/s}$、加速度 $${a}\\,\\text{m/s}^2$，經 $${t}\\,\\text{s}$ 後的速度是？`,
      `Initial velocity $${u}\\,\\text{m/s}$, acceleration $${a}\\,\\text{m/s}^2$, after $${t}\\,\\text{s}$ the velocity is?`],
    [opt(`${u + a * t}\\,\\text{m/s}`), opt(`${u + a + t}\\,\\text{m/s}`), opt(`${a * t}\\,\\text{m/s}`), opt(`${u * t + a}\\,\\text{m/s}`)],
    [`$v = u + at = ${u} + ${a}\\times${t} = ${u + a * t}\\,\\text{m/s}$。`, `$v = u + at = ${u} + ${a}\\times${t} = ${u + a * t}\\,\\text{m/s}$.`])))
// KE = ½mv²
;[[2, 3], [4, 5], [1, 10], [6, 3], [3, 4]].forEach(([m, v], i) =>
  mech.push(q(id('ke'), T.mechanics, FW.energy, 'medium', 2019 + (i % 5), 1,
    [`質量 $${m}\\,\\text{kg}$ 物體以 $${v}\\,\\text{m/s}$ 運動，求其動能。`,
      `A $${m}\\,\\text{kg}$ object moves at $${v}\\,\\text{m/s}$. Find its kinetic energy.`],
    [opt(`${0.5 * m * v * v}\\,\\text{J}`), opt(`${m * v}\\,\\text{J}`), opt(`${0.5 * m * v}\\,\\text{J}`), opt(`${m * v * v}\\,\\text{J}`)],
    [`$E_k = \\frac{1}{2}mv^2 = \\frac{1}{2}\\times${m}\\times${v}^2 = ${0.5 * m * v * v}\\,\\text{J}$。`,
      `$E_k = \\frac{1}{2}mv^2 = \\frac{1}{2}\\times${m}\\times${v}^2 = ${0.5 * m * v * v}\\,\\text{J}$.`])))
// PE = mgh (g=10)
;[[2, 5], [3, 10], [5, 4], [4, 8], [2, 15]].forEach(([m, h], i) =>
  mech.push(q(id('pe'), T.mechanics, FW.energy, i < 1 ? 'easy' : 'medium', 2020 + (i % 4), 1,
    [`質量 $${m}\\,\\text{kg}$ 物體升高 $${h}\\,\\text{m}$（取 $g = 10\\,\\text{m/s}^2$），重力勢能增加多少？`,
      `A $${m}\\,\\text{kg}$ object is raised $${h}\\,\\text{m}$ ($g = 10\\,\\text{m/s}^2$). Find the gain in gravitational PE.`],
    [opt(`${m * 10 * h}\\,\\text{J}`), opt(`${m * h}\\,\\text{J}`), opt(`${m + 10 + h}\\,\\text{J}`), opt(`${10 * h}\\,\\text{J}`)],
    [`$E_p = mgh = ${m}\\times10\\times${h} = ${m * 10 * h}\\,\\text{J}$。`, `$E_p = mgh = ${m}\\times10\\times${h} = ${m * 10 * h}\\,\\text{J}$.`])))
// momentum p = mv
;[[2, 6], [5, 3], [4, 7], [3, 8]].forEach(([m, v], i) =>
  mech.push(q(id('mom'), T.mechanics, FW.conserve, 'medium', 2021 + (i % 3), 1,
    [`質量 $${m}\\,\\text{kg}$ 物體以 $${v}\\,\\text{m/s}$ 運動，求動量。`,
      `A $${m}\\,\\text{kg}$ object moves at $${v}\\,\\text{m/s}$. Find its momentum.`],
    [opt(`${m * v}\\,\\text{kg·m/s}`), opt(`${m + v}\\,\\text{kg·m/s}`), opt(`${rnd(v / m)}\\,\\text{kg·m/s}`), opt(`${0.5 * m * v}\\,\\text{kg·m/s}`)],
    [`$p = mv = ${m}\\times${v} = ${m * v}\\,\\text{kg·m/s}$。`, `$p = mv = ${m}\\times${v} = ${m * v}\\,\\text{kg·m/s}$.`])))
// work W = Fd
;[[10, 4], [25, 2], [8, 5], [15, 3]].forEach(([F, d], i) =>
  mech.push(q(id('work'), T.mechanics, FW.energy, 'medium', 2019 + (i % 5), 1,
    [`以 $${F}\\,\\text{N}$ 的力推動物體前進 $${d}\\,\\text{m}$，所做的功是？`,
      `A force of $${F}\\,\\text{N}$ moves an object $${d}\\,\\text{m}$. Find the work done.`],
    [opt(`${F * d}\\,\\text{J}`), opt(`${F + d}\\,\\text{J}`), opt(`${rnd(F / d)}\\,\\text{J}`), opt(`${F * d * 2}\\,\\text{J}`)],
    [`$W = Fd = ${F}\\times${d} = ${F * d}\\,\\text{J}$。`, `$W = Fd = ${F}\\times${d} = ${F * d}\\,\\text{J}$.`])))
// power P = W/t
;[[100, 5], [240, 4], [600, 3], [80, 2]].forEach(([W, t], i) =>
  mech.push(q(id('pow'), T.mechanics, FW.energy, 'medium', 2020 + (i % 4), 1,
    [`在 $${t}\\,\\text{s}$ 內做了 $${W}\\,\\text{J}$ 的功，求功率。`,
      `$${W}\\,\\text{J}$ of work is done in $${t}\\,\\text{s}$. Find the power.`],
    [opt(`${W / t}\\,\\text{W}`), opt(`${W * t}\\,\\text{W}`), opt(`${W - t}\\,\\text{W}`), opt(`${rnd(t / W)}\\,\\text{W}`)],
    [`$P = \\frac{W}{t} = \\frac{${W}}{${t}} = ${W / t}\\,\\text{W}$。`, `$P = \\frac{W}{t} = \\frac{${W}}{${t}} = ${W / t}\\,\\text{W}$.`])))

// ── Electricity (24) ─────────────────────────────────────────────────────────
const elec: Question[] = []
// V = IR
;[[2, 5], [3, 4], [0.5, 10], [4, 6], [2, 12], [1.5, 8]].forEach(([I, R], i) =>
  elec.push(q(id('vir'), T.electricity, FW.circuit, i < 2 ? 'easy' : 'medium', 2019 + (i % 5), 1,
    [`電流 $${I}\\,\\text{A}$ 通過 $${R}\\,\\Omega$ 的電阻，求電壓。`,
      `A current of $${I}\\,\\text{A}$ flows through $${R}\\,\\Omega$. Find the voltage.`],
    [opt(`${rnd(I * R)}\\,\\text{V}`), opt(`${rnd(I + R)}\\,\\text{V}`), opt(`${rnd(R / I)}\\,\\text{V}`), opt(`${rnd(I * R * 2)}\\,\\text{V}`)],
    [`$V = IR = ${I}\\times${R} = ${rnd(I * R)}\\,\\text{V}$。`, `$V = IR = ${I}\\times${R} = ${rnd(I * R)}\\,\\text{V}$.`])))
// P = VI
;[[12, 2], [6, 4], [240, 0.5], [9, 4], [5, 2]].forEach(([V, I], i) =>
  elec.push(q(id('pvi'), T.electricity, FW.circuit, 'medium', 2020 + (i % 4), 1,
    [`電壓 $${V}\\,\\text{V}$、電流 $${I}\\,\\text{A}$，求功率。`,
      `Voltage $${V}\\,\\text{V}$, current $${I}\\,\\text{A}$. Find the power.`],
    [opt(`${rnd(V * I)}\\,\\text{W}`), opt(`${rnd(V + I)}\\,\\text{W}`), opt(`${rnd(V / I)}\\,\\text{W}`), opt(`${rnd(V * I / 2)}\\,\\text{W}`)],
    [`$P = VI = ${V}\\times${I} = ${rnd(V * I)}\\,\\text{W}$。`, `$P = VI = ${V}\\times${I} = ${rnd(V * I)}\\,\\text{W}$.`])))
// series resistance
;[[3, 4], [5, 5], [2, 8], [10, 6]].forEach(([a, b], i) =>
  elec.push(q(id('rser'), T.electricity, FW.circuit, 'medium', 2021 + (i % 3), 1,
    [`兩個電阻 $${a}\\,\\Omega$ 和 $${b}\\,\\Omega$ 串聯，求總電阻。`,
      `Two resistors $${a}\\,\\Omega$ and $${b}\\,\\Omega$ in series. Find the total resistance.`],
    [opt(`${a + b}\\,\\Omega`), opt(`${rnd(a * b / (a + b))}\\,\\Omega`), opt(`${a * b}\\,\\Omega`), opt(`${Math.abs(a - b)}\\,\\Omega`)],
    [`串聯：$R = R_1 + R_2 = ${a} + ${b} = ${a + b}\\,\\Omega$。`,
      `In series: $R = R_1 + R_2 = ${a} + ${b} = ${a + b}\\,\\Omega$.`])))
// parallel resistance (equal pairs for clean numbers)
;[[6, 3], [4, 4], [12, 6], [10, 10]].forEach(([a, b], i) =>
  elec.push(q(id('rpar'), T.electricity, FW.circuit, 'hard', 2020 + (i % 4), 1,
    [`兩個電阻 $${a}\\,\\Omega$ 和 $${b}\\,\\Omega$ 並聯，求總電阻。`,
      `Two resistors $${a}\\,\\Omega$ and $${b}\\,\\Omega$ in parallel. Find the total resistance.`],
    [opt(`${rnd(a * b / (a + b))}\\,\\Omega`), opt(`${a + b}\\,\\Omega`), opt(`${a * b}\\,\\Omega`), opt(`${rnd((a + b) / 2)}\\,\\Omega`)],
    [`並聯：$\\frac{1}{R} = \\frac{1}{${a}} + \\frac{1}{${b}}$，得 $R = ${rnd(a * b / (a + b))}\\,\\Omega$。`,
      `In parallel: $\\frac{1}{R} = \\frac{1}{${a}} + \\frac{1}{${b}}$, so $R = ${rnd(a * b / (a + b))}\\,\\Omega$.`])))
// charge Q = It
;[[2, 5], [3, 10], [0.5, 60], [4, 3]].forEach(([I, t], i) =>
  elec.push(q(id('qit'), T.electricity, FW.circuit, 'medium', 2019 + (i % 5), 1,
    [`電流 $${I}\\,\\text{A}$ 流過 $${t}\\,\\text{s}$，通過的電荷量是？`,
      `A current of $${I}\\,\\text{A}$ flows for $${t}\\,\\text{s}$. Find the charge.`],
    [opt(`${rnd(I * t)}\\,\\text{C}`), opt(`${rnd(I + t)}\\,\\text{C}`), opt(`${rnd(t / I)}\\,\\text{C}`), opt(`${rnd(I * t / 2)}\\,\\text{C}`)],
    [`$Q = It = ${I}\\times${t} = ${rnd(I * t)}\\,\\text{C}$。`, `$Q = It = ${I}\\times${t} = ${rnd(I * t)}\\,\\text{C}$.`])))

// ── Heat (18) ────────────────────────────────────────────────────────────────
const heat: Question[] = []
// Q = mcΔT  (water c=4200)
;[[1, 4200, 10], [2, 4200, 5], [0.5, 4200, 20], [3, 4200, 4]].forEach(([m, c, dT], i) =>
  heat.push(q(id('mcdt'), T.heat, FW.energy, 'medium', 2020 + (i % 4), 1,
    [`把 $${m}\\,\\text{kg}$ 水（比熱容 $${c}\\,\\text{J/kg°C}$）升溫 $${dT}\\,\\text{°C}$，需要多少熱量？`,
      `Heating $${m}\\,\\text{kg}$ of water (specific heat $${c}\\,\\text{J/kg°C}$) by $${dT}\\,\\text{°C}$ needs how much heat?`],
    [opt(`${m * c * dT}\\,\\text{J}`), opt(`${rnd(m * c)}\\,\\text{J}`), opt(`${rnd(m * dT)}\\,\\text{J}`), opt(`${m * c * dT * 2}\\,\\text{J}`)],
    [`$Q = mc\\Delta T = ${m}\\times${c}\\times${dT} = ${m * c * dT}\\,\\text{J}$。`,
      `$Q = mc\\Delta T = ${m}\\times${c}\\times${dT} = ${m * c * dT}\\,\\text{J}$.`])))
// metal c = 900 (aluminium)
;[[2, 900, 10], [1, 900, 30], [0.5, 900, 40]].forEach(([m, c, dT], i) =>
  heat.push(q(id('mcdt2'), T.heat, FW.energy, 'medium', 2019 + (i % 5), 1,
    [`$${m}\\,\\text{kg}$ 金屬（比熱容 $${c}\\,\\text{J/kg°C}$）吸收熱量後升溫 $${dT}\\,\\text{°C}$，求吸收的熱量。`,
      `$${m}\\,\\text{kg}$ of metal (specific heat $${c}\\,\\text{J/kg°C}$) rises $${dT}\\,\\text{°C}$. Find the heat absorbed.`],
    [opt(`${m * c * dT}\\,\\text{J}`), opt(`${rnd(m * c)}\\,\\text{J}`), opt(`${rnd(m * dT)}\\,\\text{J}`), opt(`${rnd(m * c * dT * 2)}\\,\\text{J}`)],
    [`$Q = mc\\Delta T = ${m}\\times${c}\\times${dT} = ${m * c * dT}\\,\\text{J}$。`,
      `$Q = mc\\Delta T = ${m}\\times${c}\\times${dT} = ${m * c * dT}\\,\\text{J}$.`])))
// conceptual heat
heat.push(
  q(id('heatc'), T.heat, FW.energy, 'easy', 2022, 1,
    ['熱量由高溫物體傳向低溫物體，這過程稱為？', 'Heat flowing from a hotter to a colder body is called?'],
    [['熱傳遞', 'heat transfer'], ['電傳導', 'electrical conduction'], ['核衰變', 'nuclear decay'], ['折射', 'refraction']],
    ['熱量總由高溫流向低溫，直至達到熱平衡。', 'Heat always flows from hot to cold until thermal equilibrium.']),
  q(id('heatc'), T.heat, FW.energy, 'medium', 2021, 1,
    ['固體熔化為液體時，溫度在熔點保持不變，吸收的熱量稱為？', 'While a solid melts at its melting point the temperature stays constant; the heat absorbed is called?'],
    [['潛熱', 'latent heat'], ['比熱容', 'specific heat capacity'], ['內能', 'internal energy'], ['功', 'work']],
    ['相變時溫度不變，吸收/釋放的能量為潛熱（用於改變狀態而非升溫）。',
      'During a phase change the temperature is constant; the energy absorbed/released is latent heat (it changes state, not temperature).']),
  q(id('heatc'), T.heat, FW.energy, 'medium', 2020, 1,
    ['以下哪種傳熱方式不需要介質？', 'Which mode of heat transfer requires no medium?'],
    [['輻射', 'radiation'], ['傳導', 'conduction'], ['對流', 'convection'], ['以上皆需介質', 'all need a medium']],
    ['輻射以電磁波傳播，可在真空中進行；傳導與對流均需介質。',
      'Radiation travels as electromagnetic waves and works in a vacuum; conduction and convection need a medium.']),
)
// fill heat to 18: more mcΔT variants
;[[4, 4200, 2], [1, 4200, 50], [2, 900, 25], [3, 900, 10], [0.2, 4200, 100], [5, 900, 8], [1, 2100, 20], [2, 2100, 15]].forEach((p, i) => {
  const [m, c, dT] = p
  heat.push(q(id('mcdt3'), T.heat, FW.energy, i % 3 === 0 ? 'easy' : 'medium', 2019 + (i % 5), 1,
    [`$${m}\\,\\text{kg}$ 物質（比熱容 $${c}\\,\\text{J/kg°C}$）升溫 $${dT}\\,\\text{°C}$，需熱量？`,
      `$${m}\\,\\text{kg}$ of a substance (specific heat $${c}\\,\\text{J/kg°C}$) rises $${dT}\\,\\text{°C}$. Heat needed?`],
    [opt(`${m * c * dT}\\,\\text{J}`), opt(`${rnd(m * c)}\\,\\text{J}`), opt(`${rnd(m * dT)}\\,\\text{J}`), opt(`${rnd(m * c * dT * 2)}\\,\\text{J}`)],
    [`$Q = mc\\Delta T = ${m}\\times${c}\\times${dT} = ${m * c * dT}\\,\\text{J}$。`,
      `$Q = mc\\Delta T = ${m}\\times${c}\\times${dT} = ${m * c * dT}\\,\\text{J}$.`]))
})

// ── Waves (18) ───────────────────────────────────────────────────────────────
const waves: Question[] = []
// v = fλ
;[[2, 3], [5, 4], [10, 2], [4, 0.5], [340, 2], [50, 6]].forEach(([f, lam], i) =>
  waves.push(q(id('vfl'), T.waves, FW.wave, i < 2 ? 'easy' : 'medium', 2019 + (i % 5), 1,
    [`波的頻率 $${f}\\,\\text{Hz}$、波長 $${lam}\\,\\text{m}$，求波速。`,
      `A wave has frequency $${f}\\,\\text{Hz}$ and wavelength $${lam}\\,\\text{m}$. Find its speed.`],
    [opt(`${rnd(f * lam)}\\,\\text{m/s}`), opt(`${rnd(f + lam)}\\,\\text{m/s}`), opt(`${rnd(f / lam)}\\,\\text{m/s}`), opt(`${rnd(f * lam * 2)}\\,\\text{m/s}`)],
    [`$v = f\\lambda = ${f}\\times${lam} = ${rnd(f * lam)}\\,\\text{m/s}$。`, `$v = f\\lambda = ${f}\\times${lam} = ${rnd(f * lam)}\\,\\text{m/s}$.`])))
// T = 1/f
;[[2, 0.5], [4, 0.25], [5, 0.2], [10, 0.1]].forEach(([f], i) =>
  waves.push(q(id('period'), T.waves, FW.wave, 'medium', 2020 + (i % 4), 1,
    [`波的頻率為 $${f}\\,\\text{Hz}$，求週期。`, `A wave has frequency $${f}\\,\\text{Hz}$. Find its period.`],
    [opt(`${rnd(1 / f, 3)}\\,\\text{s}`), opt(`${f}\\,\\text{s}`), opt(`${rnd(f * 2)}\\,\\text{s}`), opt(`${rnd(2 / f, 3)}\\,\\text{s}`)],
    [`$T = \\frac{1}{f} = \\frac{1}{${f}} = ${rnd(1 / f, 3)}\\,\\text{s}$。`, `$T = \\frac{1}{f} = \\frac{1}{${f}} = ${rnd(1 / f, 3)}\\,\\text{s}$.`])))
// f = v/λ
;[[340, 2, 170], [300, 5, 60], [20, 4, 5], [12, 3, 4]].forEach(([v, lam, ans], i) =>
  waves.push(q(id('freq'), T.waves, FW.wave, 'medium', 2021 + (i % 3), 1,
    [`波速 $${v}\\,\\text{m/s}$、波長 $${lam}\\,\\text{m}$，求頻率。`,
      `Wave speed $${v}\\,\\text{m/s}$, wavelength $${lam}\\,\\text{m}$. Find the frequency.`],
    [opt(`${ans}\\,\\text{Hz}`), opt(`${v * lam}\\,\\text{Hz}`), opt(`${rnd(lam / v, 3)}\\,\\text{Hz}`), opt(`${v + lam}\\,\\text{Hz}`)],
    [`$f = \\frac{v}{\\lambda} = \\frac{${v}}{${lam}} = ${ans}\\,\\text{Hz}$。`, `$f = \\frac{v}{\\lambda} = \\frac{${v}}{${lam}} = ${ans}\\,\\text{Hz}$.`])))
// conceptual waves
waves.push(
  q(id('wavec'), T.waves, FW.wave, 'easy', 2022, 1,
    ['聲波屬於哪一類波？', 'A sound wave is what type of wave?'],
    [['縱波', 'a longitudinal wave'], ['橫波', 'a transverse wave'], ['電磁波', 'an electromagnetic wave'], ['駐波', 'a standing wave']],
    ['聲波中介質振動方向與傳播方向平行，屬縱波。', 'In a sound wave the medium vibrates parallel to the direction of travel — it is longitudinal.']),
  q(id('wavec'), T.waves, FW.wave, 'medium', 2020, 1,
    ['光波在真空中能傳播，因為它是？', 'Light can travel through a vacuum because it is?'],
    [['電磁波', 'an electromagnetic wave'], ['縱波', 'a longitudinal wave'], ['機械波', 'a mechanical wave'], ['聲波', 'a sound wave']],
    ['光是電磁波，不需介質，可在真空中傳播；機械波（如聲波）則需介質。',
      'Light is an electromagnetic wave needing no medium; mechanical waves like sound require one.']),
  q(id('wavec'), T.waves, FW.wave, 'medium', 2021, 1,
    ['波的振幅增大，代表波傳遞的？', 'Increasing a wave’s amplitude increases its?'],
    [['能量', 'energy'], ['頻率', 'frequency'], ['波速', 'speed'], ['波長', 'wavelength']],
    ['振幅越大，波攜帶的能量越大；頻率、波速、波長不由振幅決定。',
      'Greater amplitude carries more energy; frequency, speed and wavelength are independent of amplitude.']),
  q(id('wavec'), T.waves, FW.wave, 'easy', 2019, 1,
    ['每秒通過某點的完整波數稱為？', 'The number of complete waves passing a point per second is the?'],
    [['頻率', 'frequency'], ['波長', 'wavelength'], ['振幅', 'amplitude'], ['週期', 'period']],
    ['頻率即每秒振動（或波）的次數，單位赫茲。', 'Frequency is the number of oscillations (waves) per second, in hertz.']),
)

// ── Optics (15) ──────────────────────────────────────────────────────────────
const optics: Question[] = [
  q(id('opt'), T.optics, FW.light, 'easy', 2023, 1,
    ['光由空氣進入水中，速度會？', 'When light passes from air into water its speed?'],
    [['減慢', 'decreases'], ['加快', 'increases'], ['不變', 'stays the same'], ['變為零', 'becomes zero']],
    ['水較密，折射率較大，光速減慢（並向法線偏折）。', 'Water is optically denser, so light slows down (and bends toward the normal).']),
  q(id('opt'), T.optics, FW.light, 'medium', 2022, 1,
    ['平面鏡成像的特性是？', 'The image formed by a plane mirror is?'],
    [['正立、等大、虛像', 'upright, same size, virtual'], ['倒立、放大、實像', 'inverted, magnified, real'], ['倒立、縮小、實像', 'inverted, diminished, real'], ['正立、放大、實像', 'upright, magnified, real']],
    ['平面鏡成正立、等大的虛像，像距等於物距。', 'A plane mirror gives an upright, same-size virtual image at equal distance behind it.']),
  q(id('opt'), T.optics, FW.light, 'medium', 2021, 1,
    ['白光通過三稜鏡後分散成彩色光譜，這現象稱為？', 'White light split into a spectrum by a prism is called?'],
    [['色散', 'dispersion'], ['反射', 'reflection'], ['繞射', 'diffraction'], ['偏振', 'polarisation']],
    ['不同顏色（波長）折射率不同，分散成光譜，稱色散。', 'Different colours (wavelengths) refract by different amounts, separating into a spectrum — dispersion.']),
  q(id('opt'), T.optics, FW.light, 'hard', 2020, 1,
    ['光由水（折射率較大）射向空氣，當入射角大於臨界角時會發生？', 'Light going from water to air at an angle greater than the critical angle undergoes?'],
    [['全內反射', 'total internal reflection'], ['色散', 'dispersion'], ['折射', 'refraction'], ['漫反射', 'diffuse reflection']],
    ['由密介質射向疏介質且入射角超過臨界角時，光全部反射回原介質。',
      'From a denser to a rarer medium beyond the critical angle, all light reflects back — total internal reflection.']),
  q(id('opt'), T.optics, FW.light, 'medium', 2023, 1,
    ['凸透鏡可使平行光線？', 'A convex (converging) lens makes parallel rays?'],
    [['會聚於焦點', 'converge to a focus'], ['發散開來', 'diverge'], ['平行射出', 'stay parallel'], ['完全反射', 'reflect completely']],
    ['凸透鏡為會聚透鏡，平行光經折射後會聚於焦點。', 'A convex lens is converging; parallel rays meet at the focal point.']),
  q(id('opt'), T.optics, FW.light, 'easy', 2019, 1,
    ['光在均勻介質中沿什麼路徑傳播？', 'In a uniform medium light travels along?'],
    [['直線', 'straight lines'], ['曲線', 'curved paths'], ['圓周', 'circles'], ['隨機路徑', 'random paths']],
    ['光在均勻介質中直線傳播（光的直進）。', 'Light travels in straight lines in a uniform medium (rectilinear propagation).']),
  q(id('opt'), T.optics, FW.light, 'medium', 2022, 1,
    ['入射角為 $30°$，反射角是？', 'If the angle of incidence is $30°$, the angle of reflection is?'],
    [['$30°$', '$30°$'], ['$60°$', '$60°$'], ['$15°$', '$15°$'], ['$0°$', '$0°$']],
    ['反射定律：反射角等於入射角，故為 $30°$。', 'Law of reflection: angle of reflection = angle of incidence = $30°$.']),
  q(id('opt'), T.optics, FW.light, 'hard', 2021, 1,
    ['物體置於凸透鏡兩倍焦距以外，成的像是？', 'An object beyond twice the focal length of a convex lens forms an image that is?'],
    [['倒立、縮小、實像', 'inverted, diminished, real'], ['正立、放大、虛像', 'upright, magnified, virtual'], ['倒立、放大、實像', 'inverted, magnified, real'], ['正立、等大、虛像', 'upright, same-size, virtual']],
    ['物距大於 $2f$ 時，凸透鏡成倒立、縮小的實像（如相機）。',
      'For object distance greater than $2f$, a convex lens forms an inverted, diminished real image (as in a camera).']),
  q(id('opt'), T.optics, FW.light, 'medium', 2020, 1,
    ['紅光與藍光相比，何者波長較長？', 'Compared with blue light, red light has a?'],
    [['較長波長', 'longer wavelength'], ['較短波長', 'shorter wavelength'], ['相同波長', 'the same wavelength'], ['零波長', 'zero wavelength']],
    ['可見光中紅光波長最長、藍/紫光最短。', 'Among visible light, red has the longest wavelength and blue/violet the shortest.']),
  q(id('opt'), T.optics, FW.light, 'easy', 2023, 1,
    ['光的三原色是？', 'The three primary colours of light are?'],
    [['紅、綠、藍', 'red, green, blue'], ['紅、黃、藍', 'red, yellow, blue'], ['青、品紅、黃', 'cyan, magenta, yellow'], ['紅、綠、黃', 'red, green, yellow']],
    ['光的三原色為紅、綠、藍（RGB），相加成白光。', 'The primary colours of light are red, green and blue (RGB); together they make white.']),
  q(id('opt'), T.optics, FW.light, 'medium', 2022, 1,
    ['凹透鏡（發散透鏡）對平行光的作用是？', 'A concave (diverging) lens acts on parallel rays by?'],
    [['使其發散', 'spreading them apart'], ['使其會聚', 'bringing them to a focus'], ['不改變方向', 'leaving them parallel'], ['將其反射', 'reflecting them']],
    ['凹透鏡使平行光發散，像由反向延長線交於虛焦點。',
      'A concave lens diverges parallel rays; they appear to come from a virtual focus.']),
  q(id('opt'), T.optics, FW.light, 'medium', 2021, 1,
    ['潛望鏡利用了光的什麼性質？', 'A periscope works by using which property of light?'],
    [['反射', 'reflection'], ['折射', 'refraction'], ['色散', 'dispersion'], ['繞射', 'diffraction']],
    ['潛望鏡用兩面平面鏡使光反射兩次改變方向。', 'A periscope uses two plane mirrors to reflect light twice and change its direction.']),
  q(id('opt'), T.optics, FW.light, 'hard', 2020, 1,
    ['光纖通訊主要依靠哪一現象傳遞訊號？', 'Optical-fibre communication relies mainly on which phenomenon?'],
    [['全內反射', 'total internal reflection'], ['色散', 'dispersion'], ['折射', 'refraction'], ['吸收', 'absorption']],
    ['光在纖芯內不斷全內反射，幾乎無損地沿光纖傳播。',
      'Light undergoes repeated total internal reflection inside the core, travelling along the fibre with little loss.']),
  q(id('opt'), T.optics, FW.light, 'easy', 2019, 1,
    ['影子的形成說明光？', 'The formation of shadows shows that light?'],
    [['沿直線傳播', 'travels in straight lines'], ['能繞過障礙', 'bends around obstacles'], ['速度為零', 'has zero speed'], ['只在水中傳播', 'only travels in water']],
    ['光直線傳播，被不透明物擋住即形成影子。', 'Light travels in straight lines, so an opaque object blocks it and casts a shadow.']),
  q(id('opt'), T.optics, FW.light, 'medium', 2023, 1,
    ['當光垂直射向鏡面（入射角 $0°$）時，反射光？', 'When light hits a mirror normally (angle of incidence $0°$), it reflects?'],
    [['沿原路返回', 'straight back along its path'], ['偏轉 $90°$', 'at $90°$'], ['完全透過', 'straight through'], ['消失', 'disappears']],
    ['入射角為 $0°$，反射角也為 $0°$，光沿原路返回。', 'With $0°$ incidence the reflection angle is also $0°$, so light returns along its path.']),
]

// ── Radioactivity (15) ───────────────────────────────────────────────────────
const radio: Question[] = []
// half-life decay: N = N0 / 2^n
;[[800, 2], [2000, 3], [640, 4], [3200, 5], [1600, 2]].forEach(([N0, n], i) => {
  const ans = N0 / 2 ** n
  radio.push(q(id('half'), T.radioactivity, FW.decay, 'medium', 2020 + (i % 4), 1,
    [`某放射性樣本初始有 $${N0}$ 個原子，經過 $${n}$ 個半衰期後剩下多少？`,
      `A sample starts with $${N0}$ atoms. How many remain after $${n}$ half-lives?`],
    [opt(`${ans}`), opt(`${2 * ans}`), opt(`${ans / 2}`), opt(`${N0}`)],
    [`每個半衰期數量減半：$N = \\frac{${N0}}{2^{${n}}} = ${ans}$。`,
      `Each half-life halves the amount: $N = \\frac{${N0}}{2^{${n}}} = ${ans}$.`]))
})
// half-life time
;[[2, 3, 6], [5, 4, 20], [10, 2, 20], [8, 3, 24]].forEach(([hl, n, total], i) =>
  radio.push(q(id('hltime'), T.radioactivity, FW.decay, 'medium', 2021 + (i % 3), 1,
    [`某同位素半衰期為 $${hl}$ 天，經過 $${n}$ 個半衰期共需多少天？`,
      `An isotope has a half-life of $${hl}$ days. How many days are $${n}$ half-lives?`],
    [opt(`${total}\\,\\text{天 / days}`), opt(`${hl + n}\\,\\text{天 / days}`), opt(`${rnd(hl / n)}\\,\\text{天 / days}`), opt(`${total * 2}\\,\\text{天 / days}`)],
    [`總時間 $= ${hl}\\times${n} = ${total}$ 天。`, `Total time $= ${hl}\\times${n} = ${total}$ days.`])))
// conceptual radioactivity
radio.push(
  q(id('radc'), T.radioactivity, FW.decay, 'easy', 2022, 1,
    ['以下哪種射線的穿透力最強？', 'Which type of radiation is the most penetrating?'],
    [['$\\gamma$ 射線', '$\\gamma$ rays'], ['$\\alpha$ 粒子', '$\\alpha$ particles'], ['$\\beta$ 粒子', '$\\beta$ particles'], ['可見光', 'visible light']],
    ['穿透力 $\\gamma > \\beta > \\alpha$；$\\alpha$ 一張紙即可擋住。', 'Penetration: $\\gamma > \\beta > \\alpha$; $\\alpha$ is stopped by paper.']),
  q(id('radc'), T.radioactivity, FW.decay, 'medium', 2021, 1,
    ['$\\alpha$ 粒子的組成是？', 'An $\\alpha$ particle consists of?'],
    [['2 個質子和 2 個中子', '2 protons and 2 neutrons'], ['1 個電子', '1 electron'], ['1 個質子', '1 proton'], ['高能光子', 'a high-energy photon']],
    ['$\\alpha$ 粒子即氦核，含 2 質子 + 2 中子。', 'An $\\alpha$ particle is a helium nucleus: 2 protons and 2 neutrons.']),
  q(id('radc'), T.radioactivity, FW.decay, 'medium', 2020, 1,
    ['$\\beta$ 衰變中放出的粒子是？', 'The particle emitted in $\\beta$ decay is?'],
    [['電子', 'an electron'], ['質子', 'a proton'], ['中子', 'a neutron'], ['氦核', 'a helium nucleus']],
    ['$\\beta^-$ 衰變中，中子轉為質子並放出一個電子。', 'In $\\beta^-$ decay a neutron becomes a proton, emitting an electron.']),
  q(id('radc'), T.radioactivity, FW.decay, 'medium', 2019, 1,
    ['放射性衰變是？', 'Radioactive decay is?'],
    [['隨機且自發的過程', 'a random, spontaneous process'], ['可由溫度控制', 'controllable by temperature'], ['可由壓力控制', 'controllable by pressure'], ['完全可預測單一原子', 'predictable for a single atom']],
    ['個別原子何時衰變無法預測（隨機），但大量原子的整體率（半衰期）固定。',
      'When a single atom decays is unpredictable (random), but the overall rate (half-life) of many atoms is fixed.']),
  q(id('radc'), T.radioactivity, FW.decay, 'hard', 2023, 1,
    ['哪一項不受溫度、壓力等外在條件影響？', 'Which is unaffected by external conditions like temperature or pressure?'],
    [['半衰期', 'the half-life'], ['反應速率（化學）', 'a chemical reaction rate'], ['氣體體積', 'gas volume'], ['電阻', 'electrical resistance']],
    ['放射性半衰期是原子核固有性質，不受溫度、壓力或化學狀態影響。',
      'Half-life is an intrinsic nuclear property, unaffected by temperature, pressure or chemical state.']),
  q(id('radc'), T.radioactivity, FW.decay, 'easy', 2022, 1,
    ['哪種射線帶正電？', 'Which radiation is positively charged?'],
    [['$\\alpha$ 粒子', '$\\alpha$ particles'], ['$\\beta$ 粒子', '$\\beta$ particles'], ['$\\gamma$ 射線', '$\\gamma$ rays'], ['中子', 'neutrons']],
    ['$\\alpha$ 帶 $+2$ 電荷，$\\beta^-$ 帶負電，$\\gamma$ 不帶電。', '$\\alpha$ carries $+2$ charge; $\\beta^-$ is negative; $\\gamma$ is neutral.']),
)

export const physicsQuestions: Question[] = [
  ...mech, ...elec, ...heat, ...waves, ...optics, ...radio,
]

export const physicsTopics: Topic[] = topicList([
  { topic: T.mechanics, fw: FW.conserve, count: mech.length },
  { topic: T.electricity, fw: FW.circuit, count: elec.length },
  { topic: T.heat, fw: FW.energy, count: heat.length },
  { topic: T.waves, fw: FW.wave, count: waves.length },
  { topic: T.optics, fw: FW.light, count: optics.length },
  { topic: T.radioactivity, fw: FW.decay, count: radio.length },
])
