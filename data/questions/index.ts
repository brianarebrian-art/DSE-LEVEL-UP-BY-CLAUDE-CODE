import type { AnyQuestion, MCQuestion, Topic, WrittenQuestion } from './types'
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
// 書寫題批次亦必須註冊入 barrel —— barrel 是所有 QA 工具與稽核統計的讀取路徑，
// 只註冊入 load.ts 會令題目對統計隱形（2026-08-07 已因此少報 12 題）。
import { chineseP2WritingQuestions } from './chinese-p2-writing'
import { chineseFanwenLongQuestions } from './chinese-fanwen-long'
import { bafsQuestions, bafsTopics } from './bafs'
import { economicsQuestions, economicsTopics } from './economics'
import { economicsBankQuestions } from './economics-bank'
import { economicsReviewedQuestions } from './economics-reviewed'
// 2026-08-07 補漏：以下兩個 reviewed bank 一直列於 load.ts（即一直供應予學生），
// 卻從未接入本 barrel。後果是 12 條已審核題目對所有經 index.ts 讀取的工具
// （topic-coverage、全量稽核統計）完全不可見。
// 迴歸鎖：data/questions/__tests__/loader-parity.test.mts
import { englishReviewedQuestions } from './english-reviewed'
import { bafsReviewedQuestions } from './bafs-reviewed'
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

export type { Question, MCQuestion, TextQuestion, LongQuestion, AnyQuestion, WrittenQuestion, Topic, Difficulty } from './types'

// 2026-07-31（非 MC 題型接線 Phase 2）：題庫由純 MC 放寬為混合題型。
//
// 三個出口，用途不可混淆：
//   getSubjectQuestions()   —— 全部題目（混合題型）。用於題數統計、課題覆蓋率、SEO 文案。
//   getSubjectMCQuestions() —— 只取 MC。現有 20 題練習流程專用；該流程讀取 options 與
//                              correctIndex，混入書寫題會即時出錯。
//   getWrittenQuestions()   —— 只取 text／long。獨立 ?mode=long 練習專用（決策 ②）。
//
// 為何不將 getSubjectQuestions 一律收窄為 MC：題數與課題覆蓋率屬於「共有多少題」的
// 統計問題，答案應涵蓋所有題型，否則長題目入庫後全站題數會低報。
interface SubjectBank {
  questions: AnyQuestion[]
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
  english: { questions: [...englishQuestions, ...englishReviewedQuestions], topics: englishTopics },
  ict: { questions: ictQuestions, topics: ictTopics },
  chinese: {
    questions: [
      ...chineseQuestions,
      ...chineseReviewedQuestions,
      ...chineseP2WritingQuestions,
      ...chineseFanwenLongQuestions,
    ],
    topics: chineseTopics,
  },
  bafs: { questions: [...bafsQuestions, ...bafsBankQuestions, ...bafsReviewedQuestions], topics: bafsTopics },
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

/** 該科全部題目（MC + 書寫題）。計數／課題統計用。 */
export function getSubjectQuestions(subjectId: string): AnyQuestion[] {
  return banks[subjectId]?.questions ?? []
}

/**
 * 只取 MC。現有 20 題練習流程（PracticeSession）專用：該流程讀取 `options` 與
 * `correctIndex`，一旦混入書寫題即會出錯，故於入口先行篩選。
 */
export function getSubjectMCQuestions(subjectId: string): MCQuestion[] {
  return getSubjectQuestions(subjectId).filter((q): q is MCQuestion => q.type === 'mc')
}

/**
 * 只取書寫題（text／long）。獨立 `?mode=long` 練習專用。
 * 此類題目【永不由機器批改】，亦不計入客觀準確率與等級預測（決策 ①）。
 */
export function getWrittenQuestions(subjectId: string): WrittenQuestion[] {
  return getSubjectQuestions(subjectId).filter(
    (q): q is WrittenQuestion => q.type === 'text' || q.type === 'long',
  )
}

/** 該科是否設有書寫題 —— 決定介面是否顯示「長題目練習」入口。 */
export function hasWrittenQuestions(subjectId: string): boolean {
  return getWrittenQuestions(subjectId).length > 0
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

/**
 * 按課題取 MC 題。刻意【只返 MC】：所有呼叫點（練習、答題卡、卷霸）都係走
 * 客觀批改流程。書寫題要按課題取就用 getWrittenQuestions() 再 filter。
 */
export function getQuestionsByTopic(subjectId: string, topicId: string): MCQuestion[] {
  return getSubjectMCQuestions(subjectId).filter((q) => q.topic === topicId)
}
