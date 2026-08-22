// ============================================================================
// replace-physics.mts —— 物理科模板替換（第一批：電學 80 + 運動學 72）
// ----------------------------------------------------------------------------
// 被替換的克隆組（封頂計劃實測）：
//   「物體初速 # m/s，加速度 # m/s²，經過 # s 後的速度」    49 條
//   「理想變壓器初級 # V、初級 # 匝、次級 # 匝」              30 條
//   「兩個電阻 # Ω 及 # Ω 並聯」                              26 條
//   「質量 # kg 的物體以 # m/s 運動，求其動能」               24 條
// 上述四組的【句子骨架】本批一概不重用 —— 框架會逐條比對現有題庫，撞到即中止。
// 故此同一個知識點若要保留，必須換一種問法：例如並聯電阻改為「已知並聯後的
// 總電阻與其中一個電阻，求另一個」，考的仍是並聯公式，但推導方向相反。
//
// ══ 難度缺口（本批同時修正）══
// 電學現有 133 條之中易 14 / 中 47 / 難 72 —— 嚴重偏難，補底題幾乎沒有。
// 運動學 96 條之中易 24 / 中 55 / 難 17。封頂計劃的補題訂單（易 119 / 中 135 /
// 難 55）正是為了把整科拉回 3:5:2，故本批以易、中為主。
//
// ══ 答案的正確性 ══
// correct-by-construction：每條的答案由程式按物理公式算出。人手負責的只有
// 兩件事——公式本身，以及每個干擾項對應哪一個【具名的錯誤】。兩者都寫在
// 各原型的註釋裏，可以逐項覆核。
//
// 物理科【不是】currency-only 科目，故選項可以用 LaTeX 數學模式。
// ============================================================================
import { emit, num, type Arch } from './_archetype.mts'

const T = {
  ele: ['electricity', '電學', 'Electricity'],
  kin: ['kinematics', '運動學', 'Kinematics'],
} as const

/** 帶單位的數值選項。單位符號中英一致，故 zh／en 同形。 */
const u = (v: number | string, unit: string) => `$${v}\\,\\text{${unit}}$`

const archs: Arch[] = [
  // ══ 電學 80 ══════════════════════════════════════════════════════════════
  // 補底（易）42

  {
    // 歐姆定律最直接的一問：知 V、R 求 I。
    // 干擾項：① V×R（把除當成乘）② R/V（分子分母倒轉）③ V−R（把公式當成減法，
    // 這是真實答卷上出現過的錯誤——單位不同的量根本不能相減）。
    key: 'phy_ohm_find_current', topic: T.ele[0], topicZh: T.ele[1], topicEn: T.ele[2], diff: 'basic', n: 6,
    gen: (i) => {
      const [v, r] = [[12, 4], [24, 6], [9, 3], [18, 9], [36, 12], [6, 2]][i]
      const ans = v / r
      return {
        q: [`一個電阻為 $${r}\\,\\Omega$ 的電器接上 $${v}\\,\\text{V}$ 的電源。求通過它的電流。`,
            `A device of resistance $${r}\\,\\Omega$ is connected to a $${v}\\,\\text{V}$ supply. Find the current through it.`],
        ans: u(num(ans), 'A'),
        wrong: [u(num(v * r), 'A'), u(num(r / v), 'A'), u(num(v - r), 'A')],
        e: [`歐姆定律 $V = IR$，移項得 $I = V/R = ${v}/${r} = ${num(ans)}\\,\\text{A}$。把兩者相乘得 $${num(v * r)}\\,\\text{A}$ 是最常見的錯誤：電阻越大電流應該越【小】，相乘卻令電流隨電阻上升，方向剛好相反，單憑這一點已可排除。$${num(r / v)}\\,\\text{A}$ 把分子分母對調，所得其實是電導與電壓的比值，並無物理意義。最後一項把公式當成減法——電壓與電阻的單位不同，本來就不能相減。`,
            `Ohm's law is $V = IR$, so $I = V/R = ${v}/${r} = ${num(ans)}\\,\\text{A}$. Multiplying instead gives $${num(v * r)}\\,\\text{A}$ and is the commonest error: a larger resistance must give a *smaller* current, yet multiplying makes current rise with resistance — the wrong way round. $${num(r / v)}\\,\\text{A}$ inverts the ratio and has no physical meaning. The last option subtracts, but voltage and resistance do not share a unit and cannot be subtracted.`],
      }
    },
  },
  {
    // 入庫閘攔下了本來的「知 I、R 求 V」原型：同 live 題庫的
    // 「電流 # A 通過 # Ω 的電阻，求電壓」重複 47%。改為【比例推理】——
    // 同一個電阻器，電壓改變時電流怎樣變。骨架不同，考的仍是歐姆定律，
    // 但問的是關係而不是代入。
    // 干擾項：① 反比（以為電壓升電流跌）② 不變 ③ 變化量當成倍數。
    key: 'phy_ohm_proportion', topic: T.ele[0], topicZh: T.ele[1], topicEn: T.ele[2], diff: 'basic', n: 6,
    gen: (i) => {
      const [v1, v2] = [[3, 6], [4, 12], [2, 10], [5, 15], [6, 24], [8, 4]][i]
      const k = v2 / v1
      return {
        q: [`同一個電阻器兩端的電壓由 $${v1}\\,\\text{V}$ 改為 $${v2}\\,\\text{V}$，電阻值不變。通過它的電流會變成原來的多少倍？`,
            `The p.d. across a fixed resistor changes from $${v1}\\,\\text{V}$ to $${v2}\\,\\text{V}$, its resistance unchanged. The current becomes how many times the original?`],
        ans: `$${num(k)}$ 倍`,
        wrong: [`$${num(1 / k)}$ 倍`, '$1$ 倍', `$${num(Math.abs(v2 - v1))}$ 倍`],
        ansEn: `$${num(k)}$ times`,
        wrongEn: [`$${num(1 / k)}$ times`, '$1$ times', `$${num(Math.abs(v2 - v1))}$ times`],
        e: [`$I = V/R$，電阻不變時電流與電壓成【正比】，故倍數 $= ${v2}/${v1} = ${num(k)}$。$${num(1 / k)}$ 倍把關係看成反比——反比的是電流與【電阻】，不是電流與電壓，兩者最容易混淆。答「$1$ 倍」的以為電阻不變電流就不變，但推動電荷的是電壓，電壓一改電流必改。最後一項把電壓的【差】當成倍數：$${v2} - ${v1} = ${num(Math.abs(v2 - v1))}$ 是變化量，不是比值。`,
            `Since $I = V/R$ and $R$ is fixed, current is *directly* proportional to p.d., so the factor is $${v2}/${v1} = ${num(k)}$. $${num(1 / k)}$ treats the relation as inverse — it is current and *resistance* that vary inversely, not current and p.d., and the two are easily confused. Answering "$1$ times" assumes an unchanged resistor means an unchanged current, but it is the p.d. that drives the charge. The last option uses the *difference* $${v2} - ${v1} = ${num(Math.abs(v2 - v1))}$, which is a change, not a ratio.`],
      }
    },
  },
  {
    // 串聯總電阻。刻意用三個電阻（現有克隆組是兩個並聯，骨架不同）。
    // 干擾項：① 當成並聯算 ② 只加頭兩個（漏了一個）③ 三者相乘。
    key: 'phy_series_three', topic: T.ele[0], topicZh: T.ele[1], topicEn: T.ele[2], diff: 'basic', n: 6,
    gen: (i) => {
      const [a, b, c] = [[2, 3, 5], [4, 6, 10], [1, 2, 4], [5, 5, 10], [8, 12, 4], [10, 15, 5]][i]
      const ans = a + b + c
      const par = 1 / (1 / a + 1 / b + 1 / c)
      return {
        q: [`三個電阻 $${a}\\,\\Omega$、$${b}\\,\\Omega$ 及 $${c}\\,\\Omega$ 串聯接在同一電路中。求總電阻。`,
            `Three resistors of $${a}\\,\\Omega$, $${b}\\,\\Omega$ and $${c}\\,\\Omega$ are connected in series. Find the total resistance.`],
        ans: u(ans, '\\Omega'),
        wrong: [u(num(par), '\\Omega'), u(a + b, '\\Omega'), u(a * b * c, '\\Omega')],
        e: [`串聯時電流只有一條路徑，各電阻的阻礙逐個累加：$R = ${a} + ${b} + ${c} = ${ans}\\,\\Omega$。$${num(par)}\\,\\Omega$ 是用了並聯公式 $1/R = \\sum 1/R_i$ 的結果——分辨方法是看電流有沒有分岔：串聯無分岔，總電阻必定【大於】其中任何一個；並聯有分岔，總電阻必定【小於】最小的一個。$${a + b}\\,\\Omega$ 漏了第三個電阻。最後一項把相加誤作相乘。`,
            `In series there is only one path, so the resistances simply add: $R = ${a} + ${b} + ${c} = ${ans}\\,\\Omega$. $${num(par)}\\,\\Omega$ comes from the parallel formula $1/R = \\sum 1/R_i$. The test is whether the current branches: in series it does not, and the total must be *larger* than any single resistor; in parallel it does, and the total must be *smaller* than the smallest. $${a + b}\\,\\Omega$ omits the third resistor, and the last option multiplies instead of adding.`],
      }
    },
  },
  {
    // 電荷量 Q = It。時間以分鐘給出，故必須先換算——這正是失分位。
    // 干擾項：① 忘記換算（直接乘分鐘）② I/t ③ t/I。
    key: 'phy_charge_from_current', topic: T.ele[0], topicZh: T.ele[1], topicEn: T.ele[2], diff: 'basic', n: 6,
    gen: (i) => {
      const [cur, min] = [[2, 1], [0.5, 2], [3, 5], [1.5, 4], [0.2, 10], [4, 3]][i]
      const sec = min * 60
      const ans = cur * sec
      return {
        q: [`一條導線中通過 $${cur}\\,\\text{A}$ 的穩定電流，歷時 $${min}\\,\\text{min}$。求通過的電荷量。`,
            `A steady current of $${cur}\\,\\text{A}$ flows in a wire for $${min}\\,\\text{min}$. Find the charge that passes.`],
        ans: u(num(ans), 'C'),
        wrong: [u(num(cur * min), 'C'), u(num(cur / sec), 'C'), u(num(sec / cur), 'C')],
        e: [`$Q = It$，但 $t$ 必須用秒：$${min}\\,\\text{min} = ${sec}\\,\\text{s}$，故 $Q = ${cur} \\times ${sec} = ${num(ans)}\\,\\text{C}$。$${num(cur * min)}\\,\\text{C}$ 直接用了分鐘，是本題唯一的陷阱，亦是最多人中招的一項——公式本身答得對，單位換算漏了。其餘兩項把乘法誤作除法。`,
            `$Q = It$, but $t$ must be in seconds: $${min}\\,\\text{min} = ${sec}\\,\\text{s}$, so $Q = ${cur} \\times ${sec} = ${num(ans)}\\,\\text{C}$. $${num(cur * min)}\\,\\text{C}$ uses minutes directly — the one trap here, and the commonest slip: the formula is right but the unit conversion is missed. The other two divide where they should multiply.`],
      }
    },
  },
  {
    // 電功率 P = VI。
    // 干擾項：① V/I ② V+I ③ V×I×時間（把功率當成能量，缺時間仍照乘一個數）。
    key: 'phy_power_vi', topic: T.ele[0], topicZh: T.ele[1], topicEn: T.ele[2], diff: 'basic', n: 6,
    gen: (i) => {
      const [v, cur] = [[220, 2], [12, 3], [240, 5], [6, 0.5], [110, 4], [24, 1.5]][i]
      const ans = v * cur
      return {
        q: [`某電器在 $${v}\\,\\text{V}$ 下工作，通過的電流為 $${cur}\\,\\text{A}$。求它的電功率。`,
            `An appliance operates at $${v}\\,\\text{V}$ and draws $${cur}\\,\\text{A}$. Find its power.`],
        ans: u(num(ans), 'W'),
        wrong: [u(num(v / cur), 'W'), u(num(v + cur), 'W'), u(num(v * cur * 60), 'W')],
        e: [`$P = VI = ${v} \\times ${cur} = ${num(ans)}\\,\\text{W}$。$${num(v / cur)}\\,\\text{W}$ 其實是電阻值（單位應為 $\\Omega$），寫成瓦特已經自相矛盾——留意單位可以省下這一分。$${num(v + cur)}\\,\\text{W}$ 把兩個不同單位的量相加。最後一項乘多了 60 秒，那是【能量】而不是功率：功率是每秒的能量，時間一旦乘進去就變了另一個量。`,
            `$P = VI = ${v} \\times ${cur} = ${num(ans)}\\,\\text{W}$. $${num(v / cur)}\\,\\text{W}$ is actually the resistance and should carry $\\Omega$, so the unit alone rules it out. $${num(v + cur)}\\,\\text{W}$ adds unlike quantities. The last option multiplies by 60 s, giving *energy*, not power: power is energy per second, and folding time back in changes the quantity.`],
      }
    },
  },
  {
    // 保險絲額定值：算出正常工作電流之後，選【剛好高於】它的標準額定值。
    // 這一題考的是判斷而不是計算——現有電學題幾乎全是計算。
    // 干擾項：① 選低於工作電流的（會即刻熔斷）② 選過高的（失去保護作用）
    //         ③ 直接把功率當電流。
    key: 'phy_fuse_choice', topic: T.ele[0], topicZh: T.ele[1], topicEn: T.ele[2], diff: 'basic', n: 6,
    gen: (i) => {
      const [p, v] = [[1000, 220], [800, 220], [2000, 220], [1500, 240], [1200, 240], [900, 220]][i]
      const cur = p / v
      const ratings = [3, 5, 10, 13]
      const fit = ratings.find((r) => r > cur) ?? 13
      const below = [...ratings].reverse().find((r) => r < cur) ?? 3
      const over = ratings[ratings.length - 1] === fit ? 13 : ratings[ratings.indexOf(fit) + 1]
      return {
        q: [`一件 $${p}\\,\\text{W}$ 的電器接在 $${v}\\,\\text{V}$ 的家庭電源上。可選的保險絲額定值為 $3\\,\\text{A}$、$5\\,\\text{A}$、$10\\,\\text{A}$、$13\\,\\text{A}$。應選哪一個？`,
            `A $${p}\\,\\text{W}$ appliance runs from a $${v}\\,\\text{V}$ mains supply. Fuses of $3\\,\\text{A}$, $5\\,\\text{A}$, $10\\,\\text{A}$ and $13\\,\\text{A}$ are available. Which should be fitted?`],
        ans: u(fit, 'A'),
        wrong: [u(below, 'A'), u(over === fit ? 13 : over, 'A'), u(num(p / 10), 'A')],
        e: [`先求正常工作電流：$I = P/V = ${p}/${v} = ${num(cur)}\\,\\text{A}$。保險絲要選【剛好高於】這個值的標準額定值，故選 $${fit}\\,\\text{A}$。選 $${below}\\,\\text{A}$ 低於工作電流，電器一開就熔斷，根本用不了。選得太高則失去保護作用：故障電流要升到很高才切斷，導線可能已經過熱。最後一項把功率除以一個無關的數當成電流。`,
            `First find the working current: $I = P/V = ${p}/${v} = ${num(cur)}\\,\\text{A}$. The fuse should be the standard rating *just above* this, so $${fit}\\,\\text{A}$. A $${below}\\,\\text{A}$ fuse is below the working current and blows the moment the appliance is switched on. Too high a rating loses the protection: the fault current must climb very far before the fuse cuts, by which time the cable may already be overheating. The last option divides the power by an unrelated number.`],
      }
    },
  },
  {
    // 並聯電路的電壓特性——概念題，不是算式題（現有並聯克隆組全是算總電阻）。
    key: 'phy_parallel_voltage_rule', topic: T.ele[0], topicZh: T.ele[1], topicEn: T.ele[2], diff: 'basic', n: 6,
    gen: (i) => {
      const [v, ra, rb] = [[12, 4, 6], [24, 8, 12], [6, 2, 3], [18, 6, 9], [30, 10, 15], [9, 3, 6]][i]
      return {
        q: [`兩個電阻 $${ra}\\,\\Omega$ 與 $${rb}\\,\\Omega$ 並聯後接上 $${v}\\,\\text{V}$ 電源。$${ra}\\,\\Omega$ 那一支的兩端電壓是多少？`,
            `Resistors of $${ra}\\,\\Omega$ and $${rb}\\,\\Omega$ are connected in parallel across a $${v}\\,\\text{V}$ supply. What is the p.d. across the $${ra}\\,\\Omega$ branch?`],
        ans: u(v, 'V'),
        wrong: [u(num((v * ra) / (ra + rb)), 'V'), u(num(v / 2), 'V'), u(num((v * rb) / (ra + rb)), 'V')],
        e: [`並聯的每一支都直接跨在電源的兩極之間，所以每一支的電壓都等於電源電壓 $${v}\\,\\text{V}$，與該支的電阻值無關。$${num((v * ra) / (ra + rb))}\\,\\text{V}$ 與 $${num((v * rb) / (ra + rb))}\\,\\text{V}$ 用了【分壓】公式，那是串聯的行為：串聯分電壓、並聯分電流，兩者剛好相反。$${num(v / 2)}\\,\\text{V}$ 假設了平均分配，但即使在串聯之下，兩個不同電阻也不會平分電壓。`,
            `Each parallel branch is connected directly across the supply terminals, so every branch has the full supply p.d. of $${v}\\,\\text{V}$, whatever its resistance. $${num((v * ra) / (ra + rb))}\\,\\text{V}$ and $${num((v * rb) / (ra + rb))}\\,\\text{V}$ apply the potential-divider formula, which describes a *series* circuit: series divides voltage, parallel divides current — exactly opposite. $${num(v / 2)}\\,\\text{V}$ assumes an even split, which would not hold for unequal resistors even in series.`],
      }
    },
  },
  {
    // 家用電費：先算 kWh 再乘單價。時間以小時給出，功率以瓦特給出——必須除 1000。
    key: 'phy_energy_cost', topic: T.ele[0], topicZh: T.ele[1], topicEn: T.ele[2], diff: 'basic', n: 6,
    gen: (i) => {
      const [w, hr, rate] = [[1000, 3, 1.2], [500, 4, 1.2], [2000, 2, 1.5], [1500, 2, 1.5], [800, 5, 1.5], [250, 8, 2]][i]
      const kwh = (w / 1000) * hr
      const ans = kwh * rate
      return {
        q: [`一件 $${w}\\,\\text{W}$ 的電器連續使用 $${hr}\\,\\text{h}$。若每度電（$1\\,\\text{kW}\\,\\text{h}$）收費 $${rate}$ 元，求電費。`,
            `A $${w}\\,\\text{W}$ appliance runs for $${hr}\\,\\text{h}$. At $${rate}$ dollars per unit ($1\\,\\text{kW}\\,\\text{h}$), find the cost.`],
        ans: `$${num(ans)}$ 元`,
        wrong: [`$${num(w * hr * rate)}$ 元`, `$${num(kwh)}$ 元`, `$${num((w / 1000) * rate)}$ 元`],
        ansEn: `$${num(ans)}$ dollars`,
        wrongEn: [`$${num(w * hr * rate)}$ dollars`, `$${num(kwh)}$ dollars`, `$${num((w / 1000) * rate)}$ dollars`],
        e: [`先把功率化為千瓦：$${w}\\,\\text{W} = ${num(w / 1000)}\\,\\text{kW}$。耗電量 $= ${num(w / 1000)} \\times ${hr} = ${num(kwh)}\\,\\text{kW}\\,\\text{h}$，電費 $= ${num(kwh)} \\times ${rate} = ${num(ans)}$ 元。$${num(w * hr * rate)}$ 元漏了除以 1000，即把瓦特當成千瓦，數值會大一千倍——這是本題唯一的陷阱。$${num(kwh)}$ 元只算到耗電量而未乘單價。最後一項漏了時間。`,
            `First convert the power to kilowatts: $${w}\\,\\text{W} = ${num(w / 1000)}\\,\\text{kW}$. Energy used $= ${num(w / 1000)} \\times ${hr} = ${num(kwh)}\\,\\text{kW}\\,\\text{h}$, so the cost is $${num(kwh)} \\times ${rate} = ${num(ans)}$ dollars. $${num(w * hr * rate)}$ dollars omits the division by 1000, treating watts as kilowatts and inflating the answer a thousandfold — the one trap here. $${num(kwh)}$ dollars stops at the energy and never applies the tariff, and the last option leaves out the time.`],
      }
    },
  },

  // 普通（中）22

  {
    // $P = I^2R$ —— 電流平方關係，是「電流加倍，發熱變四倍」的來源。
    // 干擾項：① 忘記平方（IR，其實是電壓）② $I R^2$（平方放錯位）③ $I/R$。
    key: 'phy_power_i2r', topic: T.ele[0], topicZh: T.ele[1], topicEn: T.ele[2], diff: 'intermediate', n: 6,
    gen: (i) => {
      const [cur, r] = [[2, 5], [3, 4], [0.5, 40], [1.5, 8], [4, 3], [5, 2]][i]
      const ans = cur * cur * r
      return {
        q: [`電流 $${cur}\\,\\text{A}$ 通過一個 $${r}\\,\\Omega$ 的電熱線。求它的發熱功率。`,
            `A current of $${cur}\\,\\text{A}$ flows through a $${r}\\,\\Omega$ heating element. Find the rate at which heat is produced.`],
        ans: u(num(ans), 'W'),
        wrong: [u(num(cur * r), 'W'), u(num(cur * r * r), 'W'), u(num(cur / r), 'W')],
        e: [`$P = I^2R = ${cur}^2 \\times ${r} = ${num(ans)}\\,\\text{W}$。$${num(cur * r)}\\,\\text{W}$ 漏了平方，所得其實是電壓 $IR$（單位應為 $\\text{V}$），是本題最主要的失分位。$${num(cur * r * r)}\\,\\text{W}$ 把平方加了在電阻上。留意這條關係的重點：功率隨電流的【平方】上升，所以電流加倍，發熱變成四倍——這正是電纜要限流的原因。`,
            `$P = I^2R = ${cur}^2 \\times ${r} = ${num(ans)}\\,\\text{W}$. $${num(cur * r)}\\,\\text{W}$ drops the square and is really the p.d. $IR$, which should carry volts — the main trap. $${num(cur * r * r)}\\,\\text{W}$ squares the resistance instead. The point of this relation is that power rises with the *square* of the current, so doubling the current quadruples the heating — which is why cables carry a current limit.`],
      }
    },
  },
  {
    // 並聯的【反向】推導：已知並聯總電阻與其中一個，求另一個。
    // 刻意避開現有克隆組「兩個電阻 # Ω 及 # Ω 並聯」的正向骨架。
    // 干擾項：① 直接相減（把並聯當串聯）② 相加 ③ 兩者相乘。
    key: 'phy_parallel_inverse', topic: T.ele[0], topicZh: T.ele[1], topicEn: T.ele[2], diff: 'intermediate', n: 6,
    gen: (i) => {
      const [tot, known] = [[2, 6], [4, 12], [3, 6], [6, 10], [2.4, 4], [5, 20]][i]
      const ans = 1 / (1 / tot - 1 / known)
      return {
        q: [`兩個電阻並聯後的總電阻為 $${tot}\\,\\Omega$。已知其中一個為 $${known}\\,\\Omega$，求另一個。`,
            `Two resistors in parallel give a total resistance of $${tot}\\,\\Omega$. One of them is $${known}\\,\\Omega$. Find the other.`],
        ans: u(num(ans), '\\Omega'),
        wrong: [u(num(known - tot), '\\Omega'), u(num(known + tot), '\\Omega'), u(num(known * tot), '\\Omega')],
        e: [`並聯公式 $\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2}$，移項得 $\\dfrac{1}{R_2} = \\dfrac{1}{${tot}} - \\dfrac{1}{${known}}$，故 $R_2 = ${num(ans)}\\,\\Omega$。$${num(known - tot)}\\,\\Omega$ 把電阻本身相減，那是串聯的算法用錯了地方——並聯要相加的是【倒數】，不是電阻。驗算方法很簡單：並聯的總電阻必定小於任何一個分支，$${tot} < ${known}$ 與 $${tot} < ${num(ans)}$ 都成立，答案就合理。`,
            `From $\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2}$ we get $\\dfrac{1}{R_2} = \\dfrac{1}{${tot}} - \\dfrac{1}{${known}}$, so $R_2 = ${num(ans)}\\,\\Omega$. $${num(known - tot)}\\,\\Omega$ subtracts the resistances themselves, applying series arithmetic in the wrong place: in parallel it is the *reciprocals* that add. The check is quick — a parallel total must be smaller than either branch, and both $${tot} < ${known}$ and $${tot} < ${num(ans)}$ hold.`],
      }
    },
  },
  {
    // 理想變壓器：由功率守恆求次級電流。避開現有克隆組（給匝數求電壓）的骨架。
    // 干擾項：① 用電壓比而非功率（方向倒轉）② 初級電流 ③ 兩電壓相除。
    key: 'phy_transformer_current', topic: T.ele[0], topicZh: T.ele[1], topicEn: T.ele[2], diff: 'intermediate', n: 6,
    gen: (i) => {
      const [p, vs] = [[360, 12], [600, 24], [120, 6], [900, 45], [400, 20], [300, 15]][i]
      const vp = 240
      const ans = p / vs
      return {
        q: [`一個理想變壓器由 $${vp}\\,\\text{V}$ 供電，次級輸出電壓為 $${vs}\\,\\text{V}$，次級功率為 $${p}\\,\\text{W}$。求次級電流。`,
            `An ideal transformer is supplied at $${vp}\\,\\text{V}$ and delivers $${vs}\\,\\text{V}$ at a power of $${p}\\,\\text{W}$. Find the secondary current.`],
        ans: u(num(ans), 'A'),
        wrong: [u(num(p / vp), 'A'), u(num((p * vs) / (vp * vp)), 'A'), u(num(vp / vs), 'A')],
        e: [`次級側的功率與電壓已知，直接用 $P = VI$：$I = ${p}/${vs} = ${num(ans)}\\,\\text{A}$。$${num(p / vp)}\\,\\text{A}$ 用了初級電壓，所得是【初級】電流；理想變壓器兩側功率相等，但電流與電壓成反比——降壓的一側電流反而大，這正是變壓器的用處。$${num((p * vs) / (vp * vp))}\\,\\text{A}$ 由初級電流再乘一次電壓比，方向倒轉了。$${num(vp / vs)}\\,\\text{A}$ 只算了匝數比（無單位），不是電流。`,
            `Power and voltage on the secondary side are both given, so $P = VI$ applies directly: $I = ${p}/${vs} = ${num(ans)}\\,\\text{A}$. $${num(p / vp)}\\,\\text{A}$ uses the primary voltage and gives the *primary* current. An ideal transformer passes equal power both sides, so current varies inversely with voltage — the step-down side carries the larger current, which is the whole point of the device. $${num((p * vs) / (vp * vp))}\\,\\text{A}$ scales the primary current by the voltage ratio the wrong way round. $${num(vp / vs)}\\,\\text{A}$ is just the turns ratio, a pure number, not a current.`],
      }
    },
  },
  {
    // 電阻率：$R = \rho L / A$。長度加倍、截面積加倍的相反效果是常考的比較題。
    // 干擾項：① 誤以為兩者都令電阻上升 ② 只答其中一半 ③ 不變。
    key: 'phy_resistivity_scaling', topic: T.ele[0], topicZh: T.ele[1], topicEn: T.ele[2], diff: 'intermediate', n: 4,
    gen: (i) => {
      const [kl, ka] = [[3, 6], [4, 2], [2, 6], [6, 2]][i]
      const factor = kl / ka
      return {
        q: [`同一種金屬造的兩條導線，第二條的長度是第一條的 $${kl}$ 倍，截面積是第一條的 $${ka}$ 倍。第二條的電阻是第一條的多少倍？`,
            `Two wires are made of the same metal. The second is $${kl}$ times as long and has $${ka}$ times the cross-sectional area of the first. The resistance of the second is how many times that of the first?`],
        ans: `$${num(factor)}$ 倍`,
        wrong: [`$${num(kl * ka)}$ 倍`, `$${num(kl)}$ 倍`, `$${num(ka / kl)}$ 倍`],
        ansEn: `$${num(factor)}$ times`,
        wrongEn: [`$${num(kl * ka)}$ times`, `$${num(kl)}$ times`, `$${num(ka / kl)}$ times`],
        e: [`$R = \\rho L / A$：電阻與長度成正比、與截面積成反比，故倍數 $= ${kl} \\div ${ka} = ${num(factor)}$。$${num(kl * ka)}$ 倍把兩個因素【都】當成令電阻上升，忽略了截面積在分母；直觀理解是：導線越粗，載流的通道越闊，阻礙反而越小。$${num(kl)}$ 倍只計了長度而漏了粗細。`,
            `$R = \\rho L / A$: resistance is proportional to length and inversely proportional to area, so the factor is $${kl} \\div ${ka} = ${num(factor)}$. $${num(kl * ka)}$ treats *both* changes as increasing the resistance and forgets that area sits in the denominator; physically, a thicker wire offers a wider channel for the charge and so less opposition. $${num(kl)}$ counts only the length and ignores the thickness.`],
      }
    },
  },

  // 拔尖（難）10

  {
    // 分壓電路：兩個電阻串聯，求其中一個兩端的電壓。
    // 干擾項：① 用錯電阻做分子 ② 直接平分 ③ 用並聯總電阻算。
    key: 'phy_potential_divider', topic: T.ele[0], topicZh: T.ele[1], topicEn: T.ele[2], diff: 'hard', n: 5,
    gen: (i) => {
      const [v, r1, r2] = [[12, 4, 8], [24, 6, 18], [9, 3, 6], [18, 12, 6], [30, 5, 25]][i]
      const ans = (v * r1) / (r1 + r2)
      const par = (r1 * r2) / (r1 + r2)
      return {
        q: [`$${v}\\,\\text{V}$ 電源接上串聯的 $${r1}\\,\\Omega$ 與 $${r2}\\,\\Omega$。求 $${r1}\\,\\Omega$ 兩端的電壓。`,
            `A $${v}\\,\\text{V}$ supply is connected across $${r1}\\,\\Omega$ in series with $${r2}\\,\\Omega$. Find the p.d. across the $${r1}\\,\\Omega$ resistor.`],
        ans: u(num(ans), 'V'),
        wrong: [u(num((v * r2) / (r1 + r2)), 'V'), u(num(v / 2), 'V'), u(num((v * par) / (r1 + r2)), 'V')],
        e: [`串聯電流相同：$I = ${v}/(${r1}+${r2}) = ${num(v / (r1 + r2))}\\,\\text{A}$，故 $V_1 = I R_1 = ${num(ans)}\\,\\text{V}$；等價寫法是分壓式 $V_1 = V \\times \\dfrac{R_1}{R_1+R_2}$。$${num((v * r2) / (r1 + r2))}\\,\\text{V}$ 把另一個電阻放了在分子，是本題最主要的失分位——記法是：問邊一個電阻，分子就放邊一個。$${num(v / 2)}\\,\\text{V}$ 假設兩者平分，只有在兩個電阻相等時才成立。最後一項用了並聯總電阻，但這是串聯電路。`,
            `In series the current is common: $I = ${v}/(${r1}+${r2}) = ${num(v / (r1 + r2))}\\,\\text{A}$, so $V_1 = I R_1 = ${num(ans)}\\,\\text{V}$; equivalently $V_1 = V \\times \\dfrac{R_1}{R_1+R_2}$. $${num((v * r2) / (r1 + r2))}\\,\\text{V}$ puts the other resistor on top — the main trap; the rule is that the resistor you are asked about goes in the numerator. $${num(v / 2)}\\,\\text{V}$ assumes an even split, true only for equal resistors, and the last option uses the parallel combination in a series circuit.`],
      }
    },
  },
  {
    // 電池內阻：端電壓 = EMF − I·r。給端電壓與電流求內阻。
    // 干擾項：① EMF/I（漏減端電壓）② 端電壓/I（外電阻）③ 兩電壓相減本身。
    key: 'phy_internal_resistance', topic: T.ele[0], topicZh: T.ele[1], topicEn: T.ele[2], diff: 'hard', n: 5,
    gen: (i) => {
      const [emf, vt, cur] = [[12, 11.4, 3], [9, 8.4, 2], [6, 5.6, 4], [12, 10.8, 4], [24, 22.5, 5]][i]
      const ans = (emf - vt) / cur
      return {
        q: [`一個電動勢為 $${emf}\\,\\text{V}$ 的電池接上負載後，端電壓降至 $${vt}\\,\\text{V}$，此時電流為 $${cur}\\,\\text{A}$。求電池的內阻。`,
            `A cell of e.m.f. $${emf}\\,\\text{V}$ has its terminal p.d. drop to $${vt}\\,\\text{V}$ when it delivers $${cur}\\,\\text{A}$. Find the internal resistance.`],
        ans: u(num(ans), '\\Omega'),
        wrong: [u(num(emf / cur), '\\Omega'), u(num(vt / cur), '\\Omega'), u(num(emf - vt), '\\Omega')],
        e: [`電動勢分成兩部分：一部分落在外電路（端電壓），餘下的落在內阻上。內阻上的電壓 $= ${emf} - ${vt} = ${num(emf - vt)}\\,\\text{V}$，故 $r = ${num(emf - vt)}/${cur} = ${num(ans)}\\,\\Omega$。$${num(vt / cur)}\\,\\Omega$ 用了端電壓，所得是【外】電阻，不是內阻；$${num(emf / cur)}\\,\\Omega$ 用了整個電動勢，所得是內外電阻之和。$${num(emf - vt)}\\,\\Omega$ 停在電壓差就當成電阻，漏了除以電流——留意單位就會發現不對。`,
            `The e.m.f. splits in two: part appears across the external circuit (the terminal p.d.) and the rest is lost inside the cell. The p.d. across the internal resistance is $${emf} - ${vt} = ${num(emf - vt)}\\,\\text{V}$, so $r = ${num(emf - vt)}/${cur} = ${num(ans)}\\,\\Omega$. $${num(vt / cur)}\\,\\Omega$ uses the terminal p.d. and gives the *external* resistance; $${num(emf / cur)}\\,\\Omega$ uses the whole e.m.f. and gives internal plus external. $${num(emf - vt)}\\,\\Omega$ stops at the voltage difference without dividing by the current — the unit gives it away.`],
      }
    },
  },
]

emit('physics', 'phy_rep', archs, 'scripts/qbank/drafts/physics-replace.json')
