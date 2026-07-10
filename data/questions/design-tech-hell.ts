import type { Question, Topic } from './types'
import { makeQ, topicList, type Pair, type TopicMeta, type FwMeta } from './_builder'

// Design & Applied Technology "hell" set (5★★). Mechanics answers hand-computed;
// distractors invert the MA formula or the gear/torque relationship. All hard.
const q = makeQ('design-tech')
const opt = (zh: string, en: string): Pair => [zh, en]
const C = (zh: string, en: string): Pair => [zh, en]

const T = {
  mech: { id: 'dat_mechanisms_calc', zh: '結構與機械・計算', en: 'Structures & mechanisms — calculation' },
  mat:  { id: 'dat_materials_reason', zh: '材料與結構・推理', en: 'Materials & structures — reasoning' },
} satisfies Record<string, TopicMeta>
const FW = {
  apply: { id: 'apply', zh: '應用判斷', en: 'Application', emoji: '🛠️' },
  concept: { id: 'concept', zh: '概念理解', en: 'Concepts', emoji: '📘' },
} satisfies Record<string, FwMeta>
let uid = 0
const id = (p: string) => `dath_${p}_${++uid}`

const mech: Question[] = [
  q(id('me'), T.mech, FW.apply, 'hard', 2024, 2,
    C('一根槓桿：負載 200 N 距支點 0.2 m，施力點距支點 0.8 m。在平衡時所需的施力，以及機械利益 (MA) 分別是？',
      'A lever: a 200 N load sits 0.2 m from the fulcrum; the effort is applied 0.8 m from the fulcrum. The effort needed for balance, and the mechanical advantage (MA), are?'),
    [opt('施力 = 50 N，MA = 4', 'effort = 50 N, MA = 4'),
     opt('施力 = 800 N，MA = 0.25', 'effort = 800 N, MA = 0.25'),
     opt('施力 = 200 N，MA = 1', 'effort = 200 N, MA = 1'),
     opt('施力 = 50 N，MA = 0.25', 'effort = 50 N, MA = 0.25')],
    C('力矩平衡：施力 × 0.8 = 200 × 0.2 ⇒ 施力 = 40 ÷ 0.8 = 50 N。MA = 負載 ÷ 施力 = 200 ÷ 50 = 4。\n\n【陷阱】800 N／MA 0.25 把力臂關係倒轉；MA 1 忽略了力臂差；最後一項算啱施力卻把 MA 倒轉。',
      'Moment balance: effort × 0.8 = 200 × 0.2 ⇒ effort = 40 ÷ 0.8 = 50 N. MA = load ÷ effort = 200 ÷ 50 = 4.\n\n【Trap】 800 N / MA 0.25 inverts the moment arms; MA 1 ignores the arm difference; the last gets effort right but inverts MA.')),

  q(id('me'), T.mech, FW.apply, 'hard', 2023, 2,
    C('一對齒輪：主動輪 20 齒，從動輪 60 齒。從動輪的轉速與輸出扭力，相對主動輪會？',
      'A gear pair: driver 20 teeth, driven 60 teeth. Compared with the driver, the driven gear’s rotational speed and output torque will?'),
    [opt('轉速為 1/3（減慢 3 倍），扭力增大約 3 倍',
        'rotate at 1/3 the speed (3× slower) and output about 3× the torque'),
      opt('轉速為 3 倍，扭力減小 3 倍',
        'rotate 3× faster and output 1/3 the torque'),
      opt('轉速與扭力都不變',
        'have unchanged speed and torque'),
      opt('轉速為 3 倍，扭力亦增大 3 倍',
        'rotate 3× faster and output 3× the torque')],
    C('齒輪比 = 從動 ÷ 主動 = 60/20 = 3。齒數多的從動輪轉得慢（1/3 速），但扭力相應增大約 3 倍（功率守恆，速度↓則扭力↑）。\n\n【陷阱】「轉速 3 倍」弄反了大齒輪轉慢的關係；「都不變」忽略齒數比；末項違反速度與扭力此消彼長。',
      'Gear ratio = driven ÷ driver = 60/20 = 3. The larger driven gear turns slower (1/3 speed) but its torque rises ~3× (power is conserved: lower speed ⇒ higher torque).\n\n【Trap】 “3× faster” reverses the big-gear-turns-slower relation; “unchanged” ignores the ratio; the last breaks the speed-torque trade-off.')),

  q(id('me'), T.mech, FW.apply, 'hard', 2024, 2,
    C('一個單一定滑輪與一個「動滑輪」系統。理想（無摩擦）的「動滑輪」系統用兩段繩支撐負載，其機械利益 (MA) 為？',
      'Compared with a single fixed pulley, an ideal (frictionless) single MOVABLE-pulley system supports the load with two rope sections. Its mechanical advantage (MA) is?'),
    [opt('MA = 2：施力只需負載的一半，但要拉動兩倍長度的繩',
        'MA = 2: the effort is half the load, but you must pull twice the rope length'),
      opt('MA = 1：只改變施力方向，並不省力',
        'MA = 1: it only changes the direction of effort, saving no force'),
      opt('MA = 0.5：施力是負載的兩倍',
        'MA = 0.5: the effort is twice the load'),
      opt('MA = 4', 'MA = 4')],
    C('動滑輪以兩段繩共同承托負載，故施力 ≈ 負載 ÷ 2，理想 MA = 2；但「功」守恆，省一半力就要多拉一倍距離。單一定滑輪才是 MA = 1（只改方向）。\n\n【陷阱】MA = 1 是定滑輪；MA = 0.5 把省力說成費力；MA = 4 需要更多繩段（如兩個動滑輪）。',
      'A movable pulley has two rope sections sharing the load, so effort ≈ load ÷ 2 and ideal MA = 2; work is conserved, so halving the force doubles the distance pulled. MA = 1 is the fixed pulley (direction only).\n\n【Trap】 MA = 1 is a fixed pulley; MA = 0.5 turns a force saving into a penalty; MA = 4 needs more rope sections (e.g. two movable pulleys).')),
]

const mat: Question[] = [
  q(id('ma'), T.mat, FW.concept, 'hard', 2023, 2,
    C('橋樑與塔架的桁架常用大量「三角形」單元而非四邊形。最根本的工程原因是？',
      'Bridges and towers use trusses made of many TRIANGLES rather than rectangles. The most fundamental engineering reason is that?'),
    [opt('三角形是唯一在邊長不變下不會變形的多邊形，故結構穩定、能有效抵抗側向變形',
        'a triangle is the only polygon that cannot deform without changing a side length, so it is inherently rigid and resists distortion'),
      opt('三角形比四邊形使用更多材料，因而更堅固',
        'triangles use more material than rectangles and so are stronger'),
      opt('四邊形不能承受任何力',
        'rectangles cannot bear any load at all'),
      opt('三角形純為美觀，與結構無關',
        'triangles are purely decorative and structural-irrelevant')],
    C('三角形受側力時，除非邊長改變否則無法變形（幾何剛性）；四邊形在固定邊長下仍可被推成平行四邊形而坍塌。故三角化 (triangulation) 是桁架穩定的關鍵。\n\n【陷阱】「用更多材料」非主因；「四邊形不能承力」過度；「純美觀」否定其結構作用。',
      'Under a sideways force a triangle cannot deform unless a side length changes (geometric rigidity); a rectangle of fixed side lengths can still be pushed into a parallelogram and collapse. So triangulation is the key to truss stability.\n\n【Trap】 “More material” is not the reason; “rectangles bear no load” overstates; “decorative” denies its structural role.')),
]

export const designTechHellQuestions: Question[] = [...mech, ...mat]
export const designTechHellTopics: Topic[] = topicList([
  { topic: T.mech, fw: FW.apply,   count: mech.length },
  { topic: T.mat,  fw: FW.concept, count: mat.length },
])
