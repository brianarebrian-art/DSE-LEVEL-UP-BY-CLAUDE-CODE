/**
 * 蘇格拉底式提示。回覆只引導步驟，不指出原題的正確選項。
 * 連續三次仍未對上之後，改給一題相似題，並附上另一例子的講解圖。
 */

import { tracePrerequisites, type KnowledgeNode } from '../knowledge/graph.ts'

export type TutorHintKind = 'simplify' | 'analogy' | 'similar'

export type TutorCopy = { zh: string; en: string }

export type TutorDrill = {
  topicId: string
  stem: TutorCopy
  options: { id: string; label: TutorCopy }[]
  correctOptionId: string
  keywords: string[]
  hints: Record<'simplify' | 'analogy' | 'recall', TutorCopy>
  similar: TutorCopy
  explainerSrc: string
}

export const TUTOR_DRILLS: readonly TutorDrill[] = [
  {
    topicId: 'm2-differentiation',
    stem: {
      zh: '求 y = x² 的導數。先選一個最接近的式。',
      en: 'Find the derivative of y = x². Choose the closest expression.',
    },
    options: [
      { id: 'keep', label: { zh: 'x²', en: 'x²' } },
      { id: 'power', label: { zh: '2x', en: '2x' } },
      { id: 'drop', label: { zh: '2', en: '2' } },
      { id: 'linear', label: { zh: 'x', en: 'x' } },
    ],
    correctOptionId: 'power',
    keywords: ['導數', '極限', '冪'],
    hints: {
      simplify: {
        zh: '先只看次數。x 的次數是 2。導數會把這個次數降下來，還是原封不動？',
        en: 'Look only at the power. The power of x is 2. Does the derivative keep that power, or lower it?',
      },
      analogy: {
        zh: '可以把它想成階梯：每一級的高度變成下一級的寬度。原來的次數會走到係數的位置。',
        en: 'Think of a staircase: the height of one step becomes the width of the next. The original power moves into the coefficient.',
      },
      recall: {
        zh: '這一步用到代數裡的冪。先寫出「原次數乘以變數」，再把次數減 1。先不要寫最終式。',
        en: 'This step uses powers from algebra. Write “original power times the variable”, then subtract 1 from the power. Do not write the final expression yet.',
      },
    },
    similar: {
      zh: '相似題：求 y = x³ 的導數。沿用同一條冪的步驟，不要套用上一題的式。',
      en: 'A similar item: find the derivative of y = x³. Use the same power step. Do not copy the previous expression.',
    },
    explainerSrc: '/explainers/m2-differentiation.svg',
  },
  {
    topicId: 'chem-electrolysis',
    stem: {
      zh: '以惰性電極電解稀硫酸。陰極放出的氣體是哪一種？',
      en: 'Inert electrodes electrolyse dilute sulfuric acid. Which gas is released at the cathode?',
    },
    options: [
      { id: 'h', label: { zh: '氫氣', en: 'hydrogen' } },
      { id: 'o', label: { zh: '氧氣', en: 'oxygen' } },
      { id: 'cl', label: { zh: '氯氣', en: 'chlorine' } },
      { id: 'n', label: { zh: '氮氣', en: 'nitrogen' } },
    ],
    correctOptionId: 'h',
    keywords: ['陰極', '還原', '陽離子'],
    hints: {
      simplify: {
        zh: '先分清兩極。陰極是接電源負極的一端。到這一端的粒子會得到電子，還是失去電子？',
        en: 'Separate the electrodes first. The cathode is joined to the negative terminal. Do particles there gain electrons, or lose them?',
      },
      analogy: {
        zh: '把陰極想成一個派發電子的窗口。溶液裡帶正電、並且最容易在這裡反應的粒子會先到。',
        en: 'Think of the cathode as a window handing out electrons. The positive particle in the solution that reacts most readily arrives first.',
      },
      recall: {
        zh: '先回到氧化還原：得到電子是還原。稀硫酸裡，哪一類帶正電的粒子會在陰極被還原？先不要寫氣體名稱。',
        en: 'Return to redox: gaining electrons is reduction. In dilute sulfuric acid, which kind of positive particle is reduced at the cathode? Do not name the gas yet.',
      },
    },
    similar: {
      zh: '相似題：以惰性電極電解稀氫氧化鈉，陰極同樣要先判斷哪一種正離子被還原。不要套用上一題的氣體名稱。',
      en: 'A similar item: inert electrodes electrolyse dilute sodium hydroxide. Again decide which positive ion is reduced at the cathode. Do not reuse the previous gas name.',
    },
    explainerSrc: '/explainers/chem-electrolysis.svg',
  },
  {
    topicId: 'bio-genetics',
    stem: {
      zh: '一對基因皆為異型合子的親代交配。子代出現顯性表現型的比例最接近哪一項？',
      en: 'Both parents are heterozygous for one gene. Which ratio is closest to the dominant phenotype among the offspring?',
    },
    options: [
      { id: 'all', label: { zh: '全部', en: 'all' } },
      { id: 'three', label: { zh: '三比一', en: 'three to one' } },
      { id: 'half', label: { zh: '一比一', en: 'one to one' } },
      { id: 'two', label: { zh: '一比二比一', en: 'one to two to one' } },
    ],
    correctOptionId: 'three',
    keywords: ['異型合子', '分離', '表現型'],
    hints: {
      simplify: {
        zh: '先畫一個兩行兩列的格子。每一格只放一個來自父方、一個來自母方的等位基因。',
        en: 'Draw a grid with two rows and two columns. Each cell receives one allele from each parent.',
      },
      analogy: {
        zh: '把它想成兩個袋子，每個袋子都有一顯一隱。每次各抽一個，顯性只要出現一個就會被看見。',
        en: 'Think of two bags, each holding one dominant and one recessive allele. Draw one from each. A single dominant allele is enough to be seen.',
      },
      recall: {
        zh: '這一步的先備是減數分裂時等位基因分開。數一數四格之中，有多少格帶有至少一個顯性等位基因。先不要寫比例。',
        en: 'The prerequisite is that alleles separate in meiosis. Count how many of the four cells carry at least one dominant allele. Do not write the ratio yet.',
      },
    },
    similar: {
      zh: '相似題：改為顯性純合與異型合子交配，再數四格裡的表現型。不要套用上一題的比例。',
      en: 'A similar item: cross a homozygous dominant parent with a heterozygous parent, then count phenotypes in the four cells. Do not reuse the previous ratio.',
    },
    explainerSrc: '/explainers/bio-genetics.svg',
  },
]

const DRILL_BY_TOPIC = new Map(TUTOR_DRILLS.map((drill) => [drill.topicId, drill]))

export function tutorDrill(topicId: string): TutorDrill | undefined {
  return DRILL_BY_TOPIC.get(topicId)
}

export type TutorReply = {
  topicId: string
  kind: TutorHintKind
  prompt: TutorCopy
  prerequisites: KnowledgeNode[]
  similar: TutorCopy | null
  explainerSrc: string | null
  keywordPrompt: TutorCopy | null
  revealsAnswer: false
}

export function socraticReply(topicId: string, misses: number, studentText = ''): TutorReply | null {
  const drill = DRILL_BY_TOPIC.get(topicId)
  if (!drill) return null
  const safeMisses = Math.max(1, Math.min(6, Math.floor(misses)))
  const kind: TutorHintKind = safeMisses >= 3 ? 'similar' : safeMisses === 2 ? 'analogy' : 'simplify'
  const prompt = kind === 'similar'
    ? drill.similar
    : kind === 'analogy'
      ? drill.hints.analogy
      : drill.hints.simplify
  const text = studentText.trim()
  const missingKeyword = text.length > 0 && !drill.keywords.some((keyword) => text.includes(keyword))
  return {
    topicId,
    kind,
    prompt: kind === 'similar' ? drill.hints.recall : prompt,
    prerequisites: tracePrerequisites(topicId, 2),
    similar: kind === 'similar' ? drill.similar : null,
    explainerSrc: kind === 'similar' ? drill.explainerSrc : null,
    keywordPrompt: missingKeyword
      ? {
          zh: '對照公開評卷參考常見用詞，這份答案還欠哪一個關鍵詞？',
          en: 'Compared with wording often seen in public marking notes, which keyword is still missing?',
        }
      : null,
    revealsAnswer: false,
  }
}

export function keywordGap(topicId: string, studentText: string): TutorCopy | null {
  const drill = DRILL_BY_TOPIC.get(topicId)
  if (!drill) return null
  const text = studentText.trim()
  if (drill.keywords.some((keyword) => text.includes(keyword))) return null
  return {
    zh: '對照公開評卷參考常見用詞，這份答案還欠哪一個關鍵詞？',
    en: 'Compared with wording often seen in public marking notes, which keyword is still missing?',
  }
}

export function replyLeaksAnswer(reply: TutorReply, drill: TutorDrill): boolean {
  const correct = drill.options.find((option) => option.id === drill.correctOptionId)
  if (!correct) return false
  const blob = [
    reply.prompt.zh,
    reply.prompt.en,
    reply.similar?.zh ?? '',
    reply.similar?.en ?? '',
    reply.keywordPrompt?.zh ?? '',
    reply.keywordPrompt?.en ?? '',
  ].join('\n')
  return blob.includes(correct.label.zh) || blob.includes(correct.label.en)
}
