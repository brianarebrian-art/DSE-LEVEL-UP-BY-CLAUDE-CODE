// 不考之地 topic cards: 200 cards in 10 categories, written in Cantonese.
//
// Yuna (COO), 2026-09-26/27, under charter §18 and §1 point 2.1: content outside any
// DSE subject, "純粹為樂趣而學". No scores, no quizzes, no progress tracking.
// Written with AI help (Claude); the fun facts were not checked one by one by an
// expert, and the page says so.
//
// Card text lives in cards-NN.json, one file per category. The category page is
// statically generated from here and only its own 20 cards reach the browser.

import c01 from './cards-01.json'
import c02 from './cards-02.json'
import c03 from './cards-03.json'
import c04 from './cards-04.json'
import c05 from './cards-05.json'
import c06 from './cards-06.json'
import c07 from './cards-07.json'
import c08 from './cards-08.json'
import c09 from './cards-09.json'
import c10 from './cards-10.json'

export interface OffSyllabusCard {
  id: number
  title: string
  tags: string[]
  /** 💡 3 秒搞懂 */
  hook: string
  /** 🗣️ 場景 */
  scene: string
  /** 🗣️ 地道對白, one entry per line */
  dialogue: string[]
  /** 🗣️ 解密, one entry per point */
  explain: string[]
  /** 🔍 不考冷知識, roughly 100–150 characters */
  trivia: string
  /** 💬 今日吹水話題: open-ended, no right answer */
  chat: string
}

export interface OffSyllabusCategory {
  slug: string
  emoji: string
  title: string
  titleEn: string
  cards: OffSyllabusCard[]
}

const cat = (slug: string, emoji: string, title: string, titleEn: string, cards: unknown): OffSyllabusCategory => ({
  slug, emoji, title, titleEn, cards: cards as OffSyllabusCard[],
})

export const CATEGORIES: OffSyllabusCategory[] = [
  cat('cantonese-slang', '🗣️', '地道廣東話與潮語解密', 'Cantonese and slang', c01),
  cat('food', '🍜', '香港飲食與茶餐廳文化', 'Hong Kong food and cha chaan teng', c02),
  cat('hk-trivia', '🏙️', '香港冷知識與城市探索', 'Hong Kong trivia and city walks', c03),
  cat('life-skills', '🧰', '實用生活生存技能', 'Everyday life skills', c04),
  cat('tech-ai', '🤖', '科技、AI 與未來工具', 'Tech, AI and future tools', c05),
  cat('money', '💰', '理財、消費與小資智慧', 'Money and smart spending', c06),
  cat('growth', '🌱', '社交、心理與自我成長', 'People, mind and growing up', c07),
  cat('visual', '📷', '攝影、視覺與流行美學', 'Photography and visual style', c08),
  cat('transport', '🚋', '香港交通與城市網絡', 'Getting around Hong Kong', c09),
  cat('careers', '🧭', '職場前瞻與斜槓探索', 'Future work and side paths', c10),
]

export function categoryBySlug(slug: string): OffSyllabusCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

/** "#001" style label. */
export const cardNo = (id: number) => `#${String(id).padStart(3, '0')}`
