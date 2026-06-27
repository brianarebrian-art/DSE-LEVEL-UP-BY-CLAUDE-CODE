import type { Question, Topic } from './types'
import { makeQ, topicList, type Pair, type TopicMeta, type FwMeta } from './_builder'

// 科技與生活 Technology & Living "hell" set (5★★). Nutrition energy hand-computed
// (protein/carb 4 kcal/g, fat 9 kcal/g); food-science + textile distractors are the
// standard confusions. All hard.
const q = makeQ('technology-living')
const opt = (zh: string, en: string): Pair => [zh, en]
const C = (zh: string, en: string): Pair => [zh, en]

const T = {
  nutri: { id: 'tl_nutrition_calc', zh: '營養計算', en: 'Nutrition — calculation' },
  sci:   { id: 'tl_food_textile_sci', zh: '食物與紡織科學', en: 'Food & textile science' },
} satisfies Record<string, TopicMeta>
const FW = {
  nutri:   { id: 'nutri',   zh: '營養健康', en: 'Nutrition & Health', emoji: '🍎' },
  foodsci: { id: 'foodsci', zh: '食物科學', en: 'Food Science', emoji: '🔬' },
} satisfies Record<string, FwMeta>
let uid = 0
const id = (p: string) => `tlh_${p}_${++uid}`

const nutri: Question[] = [
  q(id('nu'), T.nutri, FW.nutri, 'hard', 2024, 2,
    C('一份食物含蛋白質 20 g、碳水化合物 30 g、脂肪 10 g。已知蛋白質與碳水化合物各提供 4 kcal/g，脂肪提供 9 kcal/g。其總能量約為？',
      'A food contains 20 g protein, 30 g carbohydrate and 10 g fat. Protein and carbohydrate each give 4 kcal/g and fat gives 9 kcal/g. Its total energy is about?'),
    [opt('290 kcal', '290 kcal'),
     opt('240 kcal', '240 kcal'),
     opt('360 kcal', '360 kcal'),
     opt('60 kcal', '60 kcal')],
    C('20×4 + 30×4 + 10×9 = 80 + 120 + 90 = 290 kcal。脂肪每克能量是蛋白質／碳水的逾兩倍，計算時不可一視同仁。\n\n【陷阱】240 kcal 把脂肪也當 4 kcal/g（漏算脂肪高能量）；360 把全部當 9；60 只把克數相加。',
      '20×4 + 30×4 + 10×9 = 80 + 120 + 90 = 290 kcal. Fat carries over twice the energy per gram of protein/carbohydrate, so they cannot be treated alike.\n\n【Trap】 240 treats fat as 4 kcal/g (under-counts fat); 360 treats all as 9; 60 just sums the grams.')),

  q(id('nu'), T.nutri, FW.nutri, 'hard', 2023, 2,
    C('在烹調與處理食物時，下列關於維他命流失的描述，哪一項最準確？',
      'In cooking and handling food, which statement about vitamin loss is most accurate?'),
    [opt('水溶性維他命（如維他命 C、B 群）易溶於水並受熱破壞，宜避免長時間水煮；脂溶性維他命（A、D、E、K）相對較穩定',
        'water-soluble vitamins (e.g. C, B group) dissolve in water and are heat-sensitive, so avoid long boiling; fat-soluble vitamins (A, D, E, K) are relatively more stable'),
      opt('所有維他命都不受烹調影響',
        'all vitamins are unaffected by cooking'),
      opt('脂溶性維他命最易溶於水中流失',
        'fat-soluble vitamins are the ones most easily lost into water'),
      opt('維他命 C 在高溫久煮下會增加',
        'vitamin C increases with prolonged high-heat boiling')],
    C('維他命 C 與 B 群為水溶性，既溶於煮食水又怕熱，長時間水煮流失最多；A、D、E、K 為脂溶性，相對耐存。故宜短時間、少水烹調以保營養。\n\n【陷阱】「都不受影響」「C 久煮會增加」與事實相反；「脂溶性最易溶於水」混淆了水溶與脂溶。',
      'Vitamins C and B are water-soluble — they leach into cooking water and degrade with heat, so long boiling loses the most; A, D, E, K are fat-soluble and more stable. Short, low-water cooking preserves nutrients.\n\n【Trap】 “Unaffected” and “C increases with boiling” are false; “fat-soluble lost into water” confuses water- and fat-soluble.')),
]

const sci: Question[] = [
  q(id('sc'), T.sci, FW.foodsci, 'hard', 2024, 2,
    C('煎蛋時蛋白由透明液體變成不透明固體；這一不可逆的轉變主要是哪一種食物科學過程？',
      'When frying an egg, the egg white turns from a clear liquid to an opaque solid. This irreversible change is mainly which food-science process?'),
    [opt('蛋白質變性（denaturation）—— 受熱使蛋白質的立體結構展開並凝固，不可逆',
        'protein denaturation — heat unfolds the protein’s 3-D structure and it coagulates, irreversibly'),
      opt('澱粉糊化（gelatinisation）',
        'starch gelatinisation'),
      opt('焦糖化（caramelisation）',
        'caramelisation'),
      opt('發酵（fermentation）',
        'fermentation')],
    C('蛋白受熱，維持其立體結構的鍵被破壞，蛋白質展開並互相結合凝固、變不透明，屬「變性」且不可逆。\n\n【陷阱】糊化是澱粉吸水膨脹；焦糖化是糖受熱褐變；發酵涉及微生物——皆非蛋白凝固的機制。',
      'Heat breaks the bonds holding the egg protein’s 3-D shape; the proteins unfold and bond together, coagulating and turning opaque — denaturation, and irreversible.\n\n【Trap】 Gelatinisation is starch swelling in water; caramelisation is sugar browning; fermentation involves microbes — none is protein coagulation.')),

  q(id('sc'), T.sci, FW.foodsci, 'hard', 2023, 2,
    C('比較天然纖維「棉」與合成纖維「聚酯（滌綸）」的特性，正確的是？',
      'Comparing the natural fibre cotton with the synthetic fibre polyester, which is correct?'),
    [opt('棉吸濕透氣（親水）但易皺；聚酯吸濕差（疏水）但抗皺、快乾、耐用',
        'cotton is absorbent and breathable (hydrophilic) but creases easily; polyester is poorly absorbent (hydrophobic) but crease-resistant, quick-drying and durable'),
      opt('棉與聚酯的吸濕性完全相同',
        'cotton and polyester have identical absorbency'),
      opt('聚酯比棉更吸濕透氣',
        'polyester is more absorbent and breathable than cotton'),
      opt('棉是合成纖維，聚酯是天然纖維',
        'cotton is synthetic and polyester is natural')],
    C('棉為天然纖維，親水吸濕、透氣舒適，但回彈差易皺；聚酯為合成纖維，疏水吸濕差，卻抗皺、快乾、強韌耐用。混紡常取二者之長。\n\n【陷阱】「吸濕相同」「聚酯更吸濕」與纖維特性相反；「棉合成、聚酯天然」更把兩者來源對調。',
      'Cotton is a natural fibre — hydrophilic, absorbent and breathable, but resilient-poor and creases; polyester is synthetic — hydrophobic and poorly absorbent, yet crease-resistant, quick-drying and durable. Blends combine the best of both.\n\n【Trap】 “Identical absorbency” and “polyester more absorbent” reverse the properties; “cotton synthetic, polyester natural” swaps their origins.')),
]

export const technologyLivingHellQuestions: Question[] = [...nutri, ...sci]
export const technologyLivingHellTopics: Topic[] = topicList([
  { topic: T.nutri, fw: FW.nutri,   count: nutri.length },
  { topic: T.sci,   fw: FW.foodsci, count: sci.length },
])
