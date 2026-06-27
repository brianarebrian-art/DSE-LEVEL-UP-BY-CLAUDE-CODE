import type { Question, Topic } from './types'
import { makeQ, topicList, type Pair, type TopicMeta, type FwMeta } from './_builder'

// Visual Arts "hell" set (5★★). Tests precise appreciation vocabulary: element vs
// principle, named techniques (linear perspective, chiaroscuro), movement traits
// (Impressionism), and Chinese vs Western space. Distractors swap the definitions.
// All hard.
const q = makeQ('visual-arts')
const opt = (zh: string, en: string): Pair => [zh, en]
const C = (zh: string, en: string): Pair => [zh, en]

const T = {
  formal: { id: 'va_formal_analysis', zh: '形式分析・元素與原則', en: 'Formal analysis — elements & principles' },
  history: { id: 'va_history_context', zh: '藝術史・技法與風格', en: 'Art history — technique & style' },
} satisfies Record<string, TopicMeta>
const FW = {
  describe:  { id: 'describe',  zh: '描述分析', en: 'Describe & Analyse', emoji: '🔍' },
  interpret: { id: 'interpret', zh: '詮釋判斷', en: 'Interpret & Judge', emoji: '⚖️' },
} satisfies Record<string, FwMeta>
let uid = 0
const id = (p: string) => `vah_${p}_${++uid}`

const formal: Question[] = [
  q(id('fo'), T.formal, FW.describe, 'hard', 2024, 2,
    C('在藝術評賞中，「元素」(elements) 與「原則」(principles) 須分清。下列哪一組分類完全正確？',
      'In art appreciation, “elements” and “principles” must be distinguished. Which grouping is entirely correct?'),
    [opt('線條、形狀、色彩、質感＝元素；平衡、節奏、對比、比例＝原則',
        'line, shape, colour and texture = elements; balance, rhythm, contrast and proportion = principles'),
      opt('平衡、對比、節奏＝元素；線條、色彩＝原則',
        'balance, contrast and rhythm = elements; line and colour = principles'),
      opt('所有上述項目都是「元素」',
        'all of the above are “elements”'),
      opt('元素與原則意思相同，無須分辨',
        'elements and principles mean the same thing')],
    C('「元素」是構成作品的基本視覺材料（線條、形狀、色彩、明暗、質感、空間）；「原則」是組織這些元素的方法（平衡、對比、節奏、比例、統一、強調）。元素是「材料」，原則是「組織之道」。\n\n【陷阱】其餘各項把元素與原則對調、混為一談或否定分別。',
      'Elements are the basic visual materials of a work (line, shape, colour, value, texture, space); principles are how those elements are organised (balance, contrast, rhythm, proportion, unity, emphasis). Elements are the materials; principles are the organisation.\n\n【Trap】 The others swap, conflate, or deny the distinction.')),

  q(id('fo'), T.formal, FW.describe, 'hard', 2023, 2,
    C('一幅畫以一對「互補色」(complementary colours，色環上相對的顏色，如紅與綠) 並置。其最主要的視覺效果是？',
      'A painting places a pair of complementary colours (opposite on the colour wheel, e.g. red and green) side by side. The main visual effect is?'),
    [opt('產生強烈對比、互相襯托，使彼此顯得更鮮明、更跳脫',
        'a strong contrast in which each colour intensifies the other, making both appear more vivid'),
      opt('產生柔和、近乎融為一體的和諧過渡',
        'a soft, almost merging, harmonious transition'),
      opt('使兩種顏色都變得灰暗模糊',
        'making both colours dull and blurred'),
      opt('與顏色配搭原理完全無關', 'nothing to do with colour theory')],
    C('互補色並置時相互強化，對比最強烈，令彩度與視覺張力大增（如梵高常用），是製造焦點與活力的常用手法。\n\n【陷阱】柔和過渡是「類比色」的效果；「變灰暗」是互補色「混合」（非並置）的結果；末項否定色彩原理。',
      'Placed side by side, complementary colours reinforce each other, giving the strongest contrast and heightened vividness and tension (as van Gogh often used) — a common way to create focus and energy.\n\n【Trap】 Soft transitions come from analogous colours; “dull” results from MIXING complementaries (not juxtaposing them); the last denies colour theory.')),
]

const history: Question[] = [
  q(id('hi'), T.history, FW.interpret, 'hard', 2024, 2,
    C('文藝復興畫家運用「線性透視」(linear perspective) 的主要目的是？',
      'Renaissance painters used linear perspective mainly in order to?'),
    [opt('在二維平面上以消失點與會聚線製造逼真的三維「深度／空間」錯覺',
        'create a convincing three-dimensional illusion of depth/space on a 2-D surface, using a vanishing point and converging lines'),
      opt('令畫面刻意變得平面而無深度',
        'deliberately flatten the picture so it has no depth'),
      opt('純粹增加畫面的色彩數目',
        'simply increase the number of colours'),
      opt('與空間表現完全無關', 'nothing to do with depicting space')],
    C('線性透視以一個或多個消失點，使平行線在畫面中向遠處會聚，從而在平面上營造合乎視覺經驗的縱深感，是文藝復興再現空間的重大突破。\n\n【陷阱】「刻意平面化」與透視目的相反；「增加色彩」「與空間無關」皆離題。',
      'Linear perspective uses one or more vanishing points so that parallel lines converge into the distance, producing a believable sense of depth on a flat surface — a major Renaissance breakthrough in representing space.\n\n【Trap】 “Deliberately flatten” is the opposite aim; “more colours” and “nothing to do with space” miss the point.')),

  q(id('hi'), T.history, FW.interpret, 'hard', 2023, 2,
    C('比較傳統「中國山水畫」與「西方文藝復興繪畫」在空間表現上的根本分別，正確的是？',
      'Comparing traditional Chinese landscape painting with Western Renaissance painting in their handling of space, which is correct?'),
    [opt('中國山水多用「散點透視」與「留白」，視點流動、虛實相生；西方多用「線性（單點）透視」，從固定視點再現逼真景深',
        'Chinese landscape often uses shifting (multiple) perspective and empty space (留白), with a roving viewpoint; Western painting often uses single-point linear perspective for realistic depth from a fixed viewpoint'),
      opt('兩者都嚴格使用單點線性透視',
        'both strictly use single-point linear perspective'),
      opt('中國山水從不留白，畫面必定填滿',
        'Chinese landscape never leaves space and always fills the surface'),
      opt('西方繪畫從不講求景深',
        'Western painting never cares about depth')],
    C('中國山水以散點透視讓視點隨卷軸移動，並以留白營造虛實與意境；西方文藝復興則以固定視點的線性透視追求逼真景深。兩者體現不同的空間觀與美學。\n\n【陷阱】「兩者都用單點透視」「中國從不留白」「西方不講景深」均與兩種傳統的特徵相反。',
      'Chinese landscape uses shifting perspective so the viewpoint roves across the scroll, and uses empty space (留白) to balance solid and void and evoke mood; Western Renaissance painting pursues realistic depth via fixed-viewpoint linear perspective. They embody different conceptions of space.\n\n【Trap】 “Both single-point”, “Chinese never leaves space” and “Western never cares about depth” contradict the two traditions.')),
]

export const visualArtsHellQuestions: Question[] = [...formal, ...history]
export const visualArtsHellTopics: Topic[] = topicList([
  { topic: T.formal,  fw: FW.describe,  count: formal.length },
  { topic: T.history, fw: FW.interpret, count: history.length },
])
