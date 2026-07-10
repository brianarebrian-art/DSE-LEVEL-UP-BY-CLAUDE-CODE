import type { Question, Topic } from './types'
import { makeQ, topicList, type Pair, type TopicMeta, type FwMeta } from './_builder'

// M2 (Algebra & Calculus) "hell" set (5★★). In-syllabus: 3-D vectors, 2×2
// determinant, complex modulus. Every value hand-computed; distractors drop the
// square root, mis-apply the dot product, or invert the determinant. All hard.
const q = makeQ('m2')
const optm = (v: string): Pair => [`$${v}$`, `$${v}$`]
const C = (zh: string, en: string): Pair => [zh, en]

const T = {
  vectors: { id: 'm2_vectors_3d', zh: '三維向量', en: '3-D vectors' },
  algebra: { id: 'm2_matrix_complex', zh: '矩陣與複數', en: 'Matrices & complex numbers' },
} satisfies Record<string, TopicMeta>
const FW = {
  model: { id: 'modelling', zh: '建模能力', en: 'Modelling', emoji: '🏗️' },
  decompose: { id: 'condition_decomposition', zh: '條件分解', en: 'Condition Decomposition', emoji: '🎯' },
} satisfies Record<string, FwMeta>
let uid = 0
const id = (p: string) => `m2h_${p}_${++uid}`

const vectors: Question[] = [
  q(id('ve'), T.vectors, FW.model, 'hard', 2024, 2,
    C('設三維向量 $\\mathbf{a}=(1, 2, 2)$。其大小（模）$|\\mathbf{a}|$ 為？',
      'Let the 3-D vector $\\mathbf{a}=(1, 2, 2)$. Its magnitude $|\\mathbf{a}|$ is?'),
    [optm('3'), optm('5'), optm('9'), optm('\\sqrt{5}')],
    C('$|\\mathbf{a}|=\\sqrt{1^2+2^2+2^2}=\\sqrt{1+4+4}=\\sqrt{9}=3$。\n\n【陷阱】9 漏了開方（停在平方和）；5 把分量相加（1+2+2）；$\\sqrt5$ 漏了其中一個分量。',
      '$|\\mathbf{a}|=\\sqrt{1^2+2^2+2^2}=\\sqrt{1+4+4}=\\sqrt{9}=3$.\n\n【Trap】 9 forgets the square root (stops at the sum of squares); 5 adds the components (1+2+2); $\\sqrt5$ drops a component.')),

  q(id('ve'), T.vectors, FW.decompose, 'hard', 2023, 2,
    C('設 $\\mathbf{a}=(1,0,0)$，$\\mathbf{b}=(1,1,0)$。兩向量之間的夾角是？',
      'Let $\\mathbf{a}=(1,0,0)$ and $\\mathbf{b}=(1,1,0)$. The angle between them is?'),
    [optm('45^\\circ'), optm('60^\\circ'), optm('90^\\circ'), optm('30^\\circ')],
    C('$\\cos\\theta=\\dfrac{\\mathbf{a}\\cdot\\mathbf{b}}{|\\mathbf{a}||\\mathbf{b}|}=\\dfrac{1}{1\\cdot\\sqrt2}=\\dfrac{1}{\\sqrt2}$，故 $\\theta=45^\\circ$。\n\n【陷阱】90° 誤以為兩者垂直（但點積 $=1\\ne 0$）；60° 對應 $\\cos\\theta=\\frac12$；30° 對應 $\\frac{\\sqrt3}{2}$。',
      '$\\cos\\theta=\\dfrac{\\mathbf{a}\\cdot\\mathbf{b}}{|\\mathbf{a}||\\mathbf{b}|}=\\dfrac{1}{1\\cdot\\sqrt2}=\\dfrac{1}{\\sqrt2}$, so $\\theta=45^\\circ$.\n\n【Trap】 90° wrongly assumes perpendicularity (but the dot product is $1\\ne 0$); 60° needs $\\cos\\theta=\\frac12$; 30° needs $\\frac{\\sqrt3}{2}$.')),
]

const algebra: Question[] = [
  q(id('al'), T.algebra, FW.decompose, 'hard', 2024, 2,
    C('求 $2\\times 2$ 矩陣 $\\begin{pmatrix} 2 & 3 \\\\ 1 & 4 \\end{pmatrix}$ 的行列式。',
      'Find the determinant of the $2\\times 2$ matrix $\\begin{pmatrix} 2 & 3 \\\\ 1 & 4 \\end{pmatrix}$.'),
    [optm('5'), optm('11'), optm('-5'), optm('8')],
    C('$\\det = ad-bc = (2)(4)-(3)(1) = 8-3 = 5$。\n\n【陷阱】11 計成 $ad+bc$；$-5$ 把 $bc-ad$ 倒轉；8 只取 $ad$。',
      '$\\det = ad-bc = (2)(4)-(3)(1) = 8-3 = 5$.\n\n【Trap】 11 computes $ad+bc$; $-5$ inverts to $bc-ad$; 8 keeps only $ad$.')),

  q(id('al'), T.algebra, FW.model, 'hard', 2023, 2,
    C('設複數 $z = 3 + 4i$。其模 $|z|$ 為？',
      'Let the complex number $z = 3 + 4i$. Its modulus $|z|$ is?'),
    [optm('5'), optm('7'), optm('25'), optm('\\sqrt{7}')],
    C('$|z|=\\sqrt{3^2+4^2}=\\sqrt{9+16}=\\sqrt{25}=5$。\n\n【陷阱】7 把實部虛部相加（3+4）；25 漏了開方；$\\sqrt7$ 把平方當相加。',
      '$|z|=\\sqrt{3^2+4^2}=\\sqrt{9+16}=\\sqrt{25}=5$.\n\n【Trap】 7 adds real and imaginary parts (3+4); 25 forgets the square root; $\\sqrt7$ adds instead of squaring.')),
]

export const m2HellQuestions: Question[] = [...vectors, ...algebra]
export const m2HellTopics: Topic[] = topicList([
  { topic: T.vectors, fw: FW.model,     count: vectors.length },
  { topic: T.algebra, fw: FW.decompose, count: algebra.length },
])
