import type { Question, Topic } from './types'
import { mathQuestions, mathTopics } from './math'
import { m1Questions, m1Topics } from './m1'
import { m2Questions, m2Topics } from './m2'
import { physicsQuestions, physicsTopics } from './physics'
import { chemistryQuestions, chemistryTopics } from './chemistry'
import { biologyQuestions, biologyTopics } from './biology'
import { englishQuestions, englishTopics } from './english'
import { ictQuestions, ictTopics } from './ict'
import { chineseQuestions, chineseTopics } from './chinese'
import { bafsQuestions, bafsTopics } from './bafs'
import { geographyQuestions, geographyTopics } from './geography'

export type { Question, MCQuestion, Topic, Difficulty } from './types'

interface SubjectBank {
  questions: Question[]
  topics: Topic[]
}

// Registry of all subjects that have live question content
const banks: Record<string, SubjectBank> = {
  math: { questions: mathQuestions, topics: mathTopics },
  m1: { questions: m1Questions, topics: m1Topics },
  m2: { questions: m2Questions, topics: m2Topics },
  physics: { questions: physicsQuestions, topics: physicsTopics },
  chemistry: { questions: chemistryQuestions, topics: chemistryTopics },
  biology: { questions: biologyQuestions, topics: biologyTopics },
  english: { questions: englishQuestions, topics: englishTopics },
  ict: { questions: ictQuestions, topics: ictTopics },
  chinese: { questions: chineseQuestions, topics: chineseTopics },
  bafs: { questions: bafsQuestions, topics: bafsTopics },
  geography: { questions: geographyQuestions, topics: geographyTopics },
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
