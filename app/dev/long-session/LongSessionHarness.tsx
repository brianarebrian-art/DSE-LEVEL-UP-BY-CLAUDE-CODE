'use client'

import LongPracticeSession from '@/app/practice/LongPracticeSession'
import type { LongQuestion, TextQuestion, WrittenQuestion } from '@/data/questions/types'

// 樣本題目 —— 純預覽用，唔會亦唔可以入題庫（見 /dev/answer-cards 同一組樣本）。
const sampleText: TextQuestion = {
  id: '_preview_text', type: 'text', subject: 'math',
  topic: 'quadratic_equations', topicZh: '二次方程', topicEn: 'Quadratic Equations',
  framework: 'preview', frameworkZh: '樣本', frameworkEn: 'Sample', frameworkEmoji: '🧪',
  difficulty: 'easy', year: 0,
  content: '寫出二次方程 $ax^2+bx+c=0$（其中 $a \\neq 0$）的判別式。',
  contentEn: 'Write down the discriminant of $ax^2+bx+c=0$ (where $a \\neq 0$).',
  referenceAnswer: '$b^2-4ac$', referenceAnswerEn: '$b^2-4ac$',
  explanation: '判別式決定實根數目：大於零有兩個相異實根，等於零有一個重根，小於零則無實根。',
  explanationEn: 'The discriminant determines the number of real roots.',
  marks: 1,
}

const sampleLong: LongQuestion = {
  id: '_preview_long', type: 'long', subject: 'math',
  topic: 'quadratic_equations', topicZh: '二次方程', topicEn: 'Quadratic Equations',
  framework: 'preview', frameworkZh: '樣本', frameworkEn: 'Sample', frameworkEmoji: '🧪',
  difficulty: 'hard', year: 0,
  content: '已知二次方程 $x^2-5x+6=0$ 的兩根為 $\\alpha$ 與 $\\beta$。求 $\\alpha+\\beta$ 及 $\\alpha\\beta$ 的值，並說明兩者與方程係數的關係。',
  contentEn: 'The roots of $x^2-5x+6=0$ are $\\alpha$ and $\\beta$. Find $\\alpha+\\beta$ and $\\alpha\\beta$.',
  referenceAnswer: '$\\alpha+\\beta=5$，$\\alpha\\beta=6$。由韋達定理，兩根之和等於 $-b/a$，兩根之積等於 $c/a$。',
  referenceAnswerEn: '$\\alpha+\\beta=5$ and $\\alpha\\beta=6$, by Vieta’s formulas.',
  markingScheme: 'M1 引用韋達定理；A1 求得和為 $5$；A1 求得積為 $6$；L1 說明與係數的對應關係。',
  markingSchemeEn: 'M1 cite Vieta’s formulas; A1 sum; A1 product; L1 explain.',
  suggestedMinutes: 6, marks: 4,
}

const bank: WrittenQuestion[] = [sampleText, sampleLong]

export default function LongSessionHarness() {
  return <LongPracticeSession bank={bank} subjectId="math" topicFilter={null} sessionSize={2} />
}
