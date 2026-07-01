import type { Question, Topic } from './types'
import { mathQuestions, mathTopics } from './math'
import { mathGeneratedQuestions } from './math-generated'
import { mathParametricQuestions } from './math-parametric'
import { mathImportedQuestions } from './math-imported'
import { mathBankQuestions } from './math-bank'
import { m1Questions, m1Topics } from './m1'
import { m2Questions, m2Topics } from './m2'
import { physicsQuestions, physicsTopics } from './physics'
import { physicsBankQuestions } from './physics-bank'
import { chemistryQuestions, chemistryTopics } from './chemistry'
import { chemistryBankQuestions } from './chemistry-bank'
import { biologyQuestions, biologyTopics } from './biology'
import { englishQuestions, englishTopics } from './english'
import { ictQuestions, ictTopics } from './ict'
import { chineseQuestions, chineseTopics } from './chinese'
import { bafsQuestions, bafsTopics } from './bafs'
import { economicsQuestions, economicsTopics } from './economics'
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
  m1: { questions: m1Questions, topics: m1Topics },
  m2: { questions: m2Questions, topics: m2Topics },
  physics: { questions: [...physicsQuestions, ...physicsBankQuestions], topics: physicsTopics },
  chemistry: { questions: [...chemistryQuestions, ...chemistryBankQuestions], topics: chemistryTopics },
  biology: { questions: biologyQuestions, topics: biologyTopics },
  english: { questions: englishQuestions, topics: englishTopics },
  ict: { questions: ictQuestions, topics: ictTopics },
  chinese: { questions: chineseQuestions, topics: chineseTopics },
  bafs: { questions: bafsQuestions, topics: bafsTopics },
  economics: { questions: economicsQuestions, topics: economicsTopics },
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

export function getSubjectTopics(subjectId: string): Topic[] {
  return banks[subjectId]?.topics ?? []
}

export function hasQuestions(subjectId: string): boolean {
  return (banks[subjectId]?.questions.length ?? 0) > 0
}

export function getQuestionsByTopic(subjectId: string, topicId: string): Question[] {
  return getSubjectQuestions(subjectId).filter((q) => q.topic === topicId)
}
