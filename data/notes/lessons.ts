/** Original editorial lessons. A draft is not a claim of teacher approval. */
export interface TopicLesson {
  objectives: string[]
  vocabulary: {term:string; definition:string}[]
  examples: {title:string; question:string; steps:string[]; check:string}[]
  checks: {question:string; answer:string}[]
  challenge: {question:string; steps:string[]}
  updated: string
  author: string
  review: 'draft'
}
export const TOPIC_LESSONS: Record<string, TopicLesson> = {
  'math:quadratic_equations': {
    objectives: ['把方程整理為 ax² + bx + c = 0，辨認係數及 a ≠ 0 的條件。', '按題目條件選擇因式分解或求根公式，並代回原式檢查。', '以判別式連結實根數目與拋物線的橫軸交點。'],
    vocabulary: [
      {term:'二次方程', definition:'可寫成 ax² + bx + c = 0 且 a ≠ 0 的方程。'},
      {term:'判別式', definition:'Δ = b² − 4ac；Δ > 0 有兩個相異實根，Δ = 0 有重根，Δ < 0 沒有實根。'},
      {term:'求根公式', definition:'x = (−b ± √(b² − 4ac)) / (2a)，使用前先整理一般式。'},
    ],
    examples: [
      {title:'基礎：因式分解後使用零乘積法', question:'解方程 x² − 7x + 12 = 0。', steps:['找出乘積為 12、和為 −7 的兩數：−3 與 −4。','把左式寫成 (x − 3)(x − 4) = 0。','由零乘積法，x − 3 = 0 或 x − 4 = 0，因此 x = 3 或 x = 4。'], check:'代回：3² − 7 × 3 + 12 = 0；4² − 7 × 4 + 12 = 0。'},
      {title:'進階：先移項，再用求根公式', question:'解方程 2x² = 3x + 1，答案保留根式。', steps:['移項得 2x² − 3x − 1 = 0；a = 2、b = −3、c = −1。','計算判別式 Δ = (−3)² − 4 × 2 × (−1) = 17。','代入求根公式：x = (3 ± √17) / 4。'], check:'兩根之和為 3/2，積為 −1/2，與 −b/a、c/a 相符；亦可代回原式確認。'},
      {title:'進階：把情境限制帶回答案', question:'長方形的長比闊多 3 厘米，面積為 40 平方厘米。求長和闊。', steps:['設闊為 x 厘米，x > 0，則長為 x + 3 厘米。','由面積得 x(x + 3) = 40，即 x² + 3x − 40 = 0。','因式分解為 (x + 8)(x − 5) = 0，得 x = −8 或 x = 5。','闊必須為正數，捨去 −8，故闊為 5 厘米，長為 8 厘米。'], check:'5 × 8 = 40，且 8 − 5 = 3，兩個條件均符合。'},
    ],
    checks:[
      {question:'3x² = 5 − 2x 整理後的 a、b、c 是甚麼？',answer:'3x² + 2x − 5 = 0，因此 a = 3、b = 2、c = −5。'},
      {question:'x² + 4x + 4 = 0 有多少個相異實根？',answer:'Δ = 4² − 4 × 1 × 4 = 0，有一個相異實根 x = −2（重根）。'},
      {question:'為甚麼求根公式不能省略 ±？',answer:'當 Δ > 0，加與減平方根會給出兩個不同的根；省略一個符號便會漏解。'},
    ],
    challenge:{question:'方程 x² − (k + 2)x + 2k = 0 何時有重根？說明它與因式分解的關係。',steps:['Δ = (k + 2)² − 8k = k² − 4k + 4 = (k − 2)²。','重根要求 Δ = 0，因此 k = 2，此時方程為 (x − 2)² = 0。','一般情況可因式分解為 (x − 2)(x − k) = 0，兩根為 2 與 k；只有 k = 2 時兩根相同。']},
    updated:'2026-11-22', author:'DSE Level Up 編輯草稿', review:'draft',
  },
}
