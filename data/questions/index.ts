import type { Question, Topic } from './types'
import { mathQuestions, mathTopics } from './math'
import { mathGeneratedQuestions } from './math-generated'
import { mathParametricQuestions } from './math-parametric'
import { mathImportedQuestions } from './math-imported'
import { mathBankQuestions } from './math-bank'
import { m1Questions, m1Topics } from './m1'
import { m1BankQuestions } from './m1-bank'
import { m2Questions, m2Topics } from './m2'
import { m2BankQuestions } from './m2-bank'
import { physicsQuestions, physicsTopics } from './physics'
import { physicsBankQuestions } from './physics-bank'
import { chemistryQuestions, chemistryTopics } from './chemistry'
import { chemistryBankQuestions } from './chemistry-bank'
import { biologyQuestions, biologyTopics } from './biology'
import { englishQuestions, englishTopics } from './english'
import { ictQuestions, ictTopics } from './ict'
import { chineseQuestions, chineseTopics } from './chinese'
import { chineseReviewedQuestions } from './chinese-reviewed'
import { bafsQuestions, bafsTopics } from './bafs'
import { economicsQuestions, economicsTopics } from './economics'
import { economicsBankQuestions } from './economics-bank'
import { economicsReviewedQuestions } from './economics-reviewed'
import { bafsBankQuestions } from './bafs-bank'
import { geographyQuestions, geographyTopics } from './geography'
import { historyQuestions, historyTopics } from './history'
import { chineseHistoryQuestions, chineseHistoryTopics } from './chinese-history'
import { thsQuestions, thsTopics } from './ths'
import { healthManagementQuestions, healthManagementTopics } from './health-management'
import { designTechQuestions, designTechTopics } from './design-tech'
import { musicQuestions, musicTopics } from './music'
import { peQuestions, peTopics } from './pe'
import { chineseLiteratureQuestions, chineseLiteratureTopics } from './chinese-literature'
import { englishLiteratureQuestions, englishLiteratureTopics } from './english-literature'
import { visualArtsQuestions, visualArtsTopics } from './visual-arts'
import { csdQuestions, csdTopics } from './csd'
import { ethicsReligiousQuestions, ethicsReligiousTopics } from './ethics-religious'
import { technologyLivingQuestions, technologyLivingTopics } from './technology-living'

export type { Question, MCQuestion, Topic, Difficulty } from './types'

interface SubjectBank {
  questions: Question[]
  topics: Topic[]
}

// Registry of all subjects that have live question content
const banks: Record<string, SubjectBank> = {
  // Hand-authored 120 + offline AI-generated (gate + LLM-judge verified) extras.
  math: { questions: [...mathQuestions, ...mathGeneratedQuestions, ...mathParametricQuestions, ...mathImportedQuestions, ...mathBankQuestions], topics: mathTopics },
  m1: { questions: [...m1Questions, ...m1BankQuestions], topics: m1Topics },
  m2: { questions: [...m2Questions, ...m2BankQuestions], topics: m2Topics },
  physics: { questions: [...physicsQuestions, ...physicsBankQuestions], topics: physicsTopics },
  chemistry: { questions: [...chemistryQuestions, ...chemistryBankQuestions], topics: chemistryTopics },
  biology: { questions: biologyQuestions, topics: biologyTopics },
  english: { questions: englishQuestions, topics: englishTopics },
  ict: { questions: ictQuestions, topics: ictTopics },
  chinese: { questions: [...chineseQuestions, ...chineseReviewedQuestions], topics: chineseTopics },
  bafs: { questions: [...bafsQuestions, ...bafsBankQuestions], topics: bafsTopics },
  economics: { questions: [...economicsQuestions, ...economicsBankQuestions, ...economicsReviewedQuestions], topics: economicsTopics },
  geography: { questions: geographyQuestions, topics: geographyTopics },
  history: { questions: historyQuestions, topics: historyTopics },
  'chinese-history': { questions: chineseHistoryQuestions, topics: chineseHistoryTopics },
  ths: { questions: thsQuestions, topics: thsTopics },
  'health-management': { questions: healthManagementQuestions, topics: healthManagementTopics },
  'design-tech': { questions: designTechQuestions, topics: designTechTopics },
  music: { questions: musicQuestions, topics: musicTopics },
  pe: { questions: peQuestions, topics: peTopics },
  'chinese-literature': { questions: chineseLiteratureQuestions, topics: chineseLiteratureTopics },
  'english-literature': { questions: englishLiteratureQuestions, topics: englishLiteratureTopics },
  'visual-arts': { questions: visualArtsQuestions, topics: visualArtsTopics },
  csd: { questions: csdQuestions, topics: csdTopics },
  'ethics-religious': { questions: ethicsReligiousQuestions, topics: ethicsReligiousTopics },
  'technology-living': { questions: technologyLivingQuestions, topics: technologyLivingTopics },
}

export function getSubjectQuestions(subjectId: string): Question[] {
  return banks[subjectId]?.questions ?? []
}

// 課題清單 —— `count` 於此按真實題庫即時計算，覆蓋 curated 陣列中人手維護、
// 已與題庫脫節的數值（見 types.ts `Topic.count` 的說明）。
// 每科只計算一次並快取：題庫為靜態 import，同一 process 內不會變動。
const topicCache = new Map<string, Topic[]>()

export function getSubjectTopics(subjectId: string): Topic[] {
  const cached = topicCache.get(subjectId)
  if (cached) return cached

  const bank = banks[subjectId]
  if (!bank) return []

  const counts = new Map<string, number>()
  for (const q of bank.questions) counts.set(q.topic, (counts.get(q.topic) ?? 0) + 1)

  const withRealCounts = bank.topics.map((t) => ({ ...t, count: counts.get(t.id) ?? 0 }))
  topicCache.set(subjectId, withRealCounts)
  return withRealCounts
}

export function hasQuestions(subjectId: string): boolean {
  return (banks[subjectId]?.questions.length ?? 0) > 0
}

export function getQuestionsByTopic(subjectId: string, topicId: string): Question[] {
  return getSubjectQuestions(subjectId).filter((q) => q.topic === topicId)
}
