import type { AnyQuestion, MCQuestion, Topic, WrittenQuestion } from './types'
import { mathQuestions, mathTopics } from './math'
import { mathGeneratedQuestions } from './math-generated'
import { mathParametricQuestions } from './math-parametric'
import { mathImportedQuestions } from './math-imported'
import { mathBankQuestions } from './math-bank'
import { mathP1LongQuestions } from './math-p1-long'
import { mathLongB1Questions } from './math-long-b1'
import { mathFloorBatch1Questions } from './math-floor-batch1'
import { m1Questions, m1Topics } from './m1'
import { m1BankQuestions } from './m1-bank'
import { m2Questions, m2Topics } from './m2'
import { m2BankQuestions } from './m2-bank'
import { physicsQuestions, physicsTopics } from './physics'
import { physicsBankQuestions } from './physics-bank'
import { chemistryQuestions, chemistryTopics } from './chemistry'
import { chemistryBankQuestions } from './chemistry-bank'
import { chemistryFloorBatch1Questions } from './chemistry-floor-batch1'
import { biologyQuestions, biologyTopics } from './biology'
import { biologyFloorB2Questions } from './biology-floor-b2'
import { biologyBank3Questions } from './biology-bank'
import { biologyBank4Questions } from './biology-bank2'
import { englishQuestions, englishTopics } from './english'
import { englishFloorB2Questions } from './english-floor-b2'
import { englishBank1Questions } from './english-bank'
import { ictQuestions, ictTopics } from './ict'
import { ictFloorBatch1Questions } from './ict-floor-batch1'
import { ictBank3Questions } from './ict-bank'
import { ictBank4Questions } from './ict-bank4'
import { chineseQuestions, chineseTopics } from './chinese'
import { chineseReviewedQuestions } from './chinese-reviewed'
// 書寫題批次亦必須註冊入 barrel —— barrel 是所有 QA 工具與稽核統計的讀取路徑，
// 只註冊入 load.ts 會令題目對統計隱形（2026-08-07 已因此少報 12 題）。
import { chineseP2WritingQuestions } from './chinese-p2-writing'
import { chineseP2WritingBatch2Questions } from './chinese-p2-writing-batch2'
import { chineseP2WritingBatch3Questions } from './chinese-p2-writing-batch3'
import { chineseFanwenLongQuestions } from './chinese-fanwen-long'
import { chineseFloorBatch1Questions } from './chinese-floor-batch1'
import { chineseBank1Questions } from './chinese-bank'
import { bafsQuestions, bafsTopics } from './bafs'
import { economicsQuestions, economicsTopics } from './economics'
import { economicsBankQuestions } from './economics-bank'
import { economicsReviewedQuestions } from './economics-reviewed'
import { economicsFloorBatch1Questions } from './economics-floor-batch1'
import { economicsFloorBatch2Questions } from './economics-floor-batch2'
// 2026-08-07 補漏：以下兩個 reviewed bank 一直列於 load.ts（即一直供應予學生），
// 卻從未接入本 barrel。後果是 12 條已審核題目對所有經 index.ts 讀取的工具
// （topic-coverage、全量稽核統計）完全不可見。
// 迴歸鎖：data/questions/__tests__/loader-parity.test.mts
import { englishReviewedQuestions } from './english-reviewed'
import { bafsReviewedQuestions } from './bafs-reviewed'
import { bafsBankQuestions } from './bafs-bank'
import { thsBankQuestions, technologyLivingBankQuestions, designTechBankQuestions, peBankQuestions, biologyBankQuestions, musicBankQuestions, ictBankQuestions, geographyBankQuestions, biologyBank2Questions, healthManagementBankQuestions, peBank2Questions, thsBank2Questions, technologyLivingBank2Questions, ictBank2Questions, musicBank2Questions, designTechBank2Questions } from './applied-banks'
import { geographyQuestions, geographyTopics } from './geography'
import { geographyFloorB2Questions } from './geography-floor-b2'
import { geographyBank2Questions } from './geography-bank'
import { geographyBank3Questions } from './geography-bank3'
import { historyQuestions, historyTopics } from './history'
import { historyP2EssaysQuestions } from './history-p2-essays'
import { historyBank1Questions } from './history-bank'
import { historyFloorBatch1Questions } from './history-floor-batch1'
import { chineseHistoryQuestions, chineseHistoryTopics } from './chinese-history'
import { chineseHistoryFloorB2Questions } from './chinese-history-floor-b2'
import { chineseHistoryBank1Questions } from './chinese-history-bank'
import { thsQuestions, thsTopics } from './ths'
import { thsBank3Questions } from './ths-bank'
import { thsFloorB2Questions } from './ths-floor-b2'
import { healthManagementQuestions, healthManagementTopics } from './health-management'
import { healthManagementFloorBatch1Questions } from './health-management-floor-batch1'
import { healthManagementBank2Questions } from './health-management-bank'
import { healthManagementBank3Questions } from './health-management-bank2'
import { designTechQuestions, designTechTopics } from './design-tech'
import { designTechFloorB2Questions } from './design-tech-floor-b2'
import { designTechBank3Questions } from './design-tech-bank'
import { designTechBank4Questions } from './design-tech-bank2'
import { musicQuestions, musicTopics } from './music'
import { musicFloorB2Questions } from './music-floor-b2'
import { musicBank3Questions } from './music-bank'
import { musicBank4Questions } from './music-bank2'
import { peQuestions, peTopics } from './pe'
import { peFloorB2Questions } from './pe-floor-b2'
import { peBank3Questions } from './pe-bank'
import { peBank4Questions } from './pe-bank2'
import { chineseLiteratureQuestions, chineseLiteratureTopics } from './chinese-literature'
import { chineseLiteratureFloorB2Questions } from './chinese-literature-floor-b2'
import { englishLiteratureQuestions, englishLiteratureTopics } from './english-literature'
import { englishLiteratureFloorB2Questions } from './english-literature-floor-b2'
import { visualArtsQuestions, visualArtsTopics } from './visual-arts'
import { visualArtsFloorB2Questions } from './visual-arts-floor-b2'
import { visualArtsBank2Questions } from './visual-arts-bank'
import { visualArtsBank3Questions } from './visual-arts-bank2'
import { csdQuestions, csdTopics } from './csd'
import { csdFloorB2Questions } from './csd-floor-b2'
import { csdReviewedQuestions } from './csd-reviewed'
import { csdBank1Questions } from './csd-bank'
import { ethicsReligiousQuestions, ethicsReligiousTopics } from './ethics-religious'
import { ethicsReligiousFloorB2Questions } from './ethics-religious-floor-b2'
import { technologyLivingQuestions, technologyLivingTopics } from './technology-living'
import { technologyLivingFloorB2Questions } from './technology-living-floor-b2'
import { technologyLivingBank3Questions } from './technology-living-bank'
import { technologyLivingBank4Questions } from './technology-living-bank2'
import { chineseHistoryAutoQuestions } from './chinese-history-auto'
import { chineseLiteratureAutoQuestions } from './chinese-literature-auto'
import { historyAutoQuestions } from './history-auto'
import { englishLiteratureAutoQuestions } from './english-literature-auto'
import { technologyLivingAutoQuestions } from './technology-living-auto'
import { ethicsReligiousAutoQuestions } from './ethics-religious-auto'
import { geographyAutoQuestions } from './geography-auto'
import { englishAutoQuestions } from './english-auto'
import { chineseAutoQuestions } from './chinese-auto'
import { chemistryAutoQuestions } from './chemistry-auto'
import { economicsAutoQuestions } from './economics-auto'
import { bafsAutoQuestions } from './bafs-auto'
import { m2AutoQuestions } from './m2-auto'
import { m1AutoQuestions } from './m1-auto'
import { physicsAutoQuestions } from './physics-auto'

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
  math: { questions: [...mathQuestions, ...mathGeneratedQuestions, ...mathParametricQuestions, ...mathImportedQuestions, ...mathBankQuestions, ...mathP1LongQuestions, ...mathLongB1Questions, ...mathFloorBatch1Questions], topics: mathTopics },
  m1: { questions: [...m1Questions, ...m1BankQuestions], topics: m1Topics },
  m2: { questions: [...m2Questions, ...m2BankQuestions], topics: m2Topics },
  physics: { questions: [...physicsQuestions, ...physicsBankQuestions], topics: physicsTopics },
  chemistry: { questions: [...chemistryQuestions, ...chemistryBankQuestions, ...chemistryFloorBatch1Questions], topics: chemistryTopics },
  biology: { questions: [...biologyQuestions, ...biologyBankQuestions, ...biologyBank2Questions, ...biologyFloorB2Questions, ...biologyBank3Questions, ...biologyBank4Questions], topics: biologyTopics },
  english: { questions: [...englishQuestions, ...englishReviewedQuestions, ...englishFloorB2Questions, ...englishBank1Questions], topics: englishTopics },
  ict: { questions: [...ictQuestions, ...ictFloorBatch1Questions, ...ictBankQuestions, ...ictBank2Questions, ...ictBank3Questions, ...ictBank4Questions], topics: ictTopics },
  chinese: {
    questions: [
      ...chineseQuestions,
      ...chineseReviewedQuestions,
      ...chineseP2WritingQuestions,
      ...chineseP2WritingBatch2Questions,
      ...chineseP2WritingBatch3Questions,
      ...chineseFanwenLongQuestions,
      ...chineseFloorBatch1Questions,
      ...chineseBank1Questions,
    ],
    topics: chineseTopics,
  },
  bafs: { questions: [...bafsQuestions, ...bafsBankQuestions, ...bafsReviewedQuestions], topics: bafsTopics },
  economics: { questions: [...economicsQuestions, ...economicsBankQuestions, ...economicsReviewedQuestions, ...economicsFloorBatch1Questions, ...economicsFloorBatch2Questions], topics: economicsTopics },
  geography: { questions: [...geographyQuestions, ...geographyBankQuestions, ...geographyFloorB2Questions, ...geographyBank2Questions, ...geographyBank3Questions], topics: geographyTopics },
  history: { questions: [...historyQuestions, ...historyP2EssaysQuestions, ...historyFloorBatch1Questions, ...historyBank1Questions], topics: historyTopics },
  'chinese-history': { questions: [...chineseHistoryQuestions, ...chineseHistoryFloorB2Questions, ...chineseHistoryBank1Questions], topics: chineseHistoryTopics },
  ths: { questions: [...thsQuestions, ...thsBankQuestions, ...thsBank2Questions, ...thsFloorB2Questions, ...thsBank3Questions], topics: thsTopics },
  'health-management': { questions: [...healthManagementQuestions, ...healthManagementFloorBatch1Questions, ...healthManagementBankQuestions, ...healthManagementBank2Questions, ...healthManagementBank3Questions], topics: healthManagementTopics },
  'design-tech': { questions: [...designTechQuestions, ...designTechBankQuestions, ...designTechBank2Questions, ...designTechFloorB2Questions, ...designTechBank3Questions, ...designTechBank4Questions], topics: designTechTopics },
  music: { questions: [...musicQuestions, ...musicBankQuestions, ...musicBank2Questions, ...musicFloorB2Questions, ...musicBank3Questions, ...musicBank4Questions], topics: musicTopics },
  pe: { questions: [...peQuestions, ...peBankQuestions, ...peBank2Questions, ...peFloorB2Questions, ...peBank3Questions, ...peBank4Questions], topics: peTopics },
  'chinese-literature': { questions: [...chineseLiteratureQuestions, ...chineseLiteratureFloorB2Questions], topics: chineseLiteratureTopics },
  'english-literature': { questions: [...englishLiteratureQuestions, ...englishLiteratureFloorB2Questions], topics: englishLiteratureTopics },
  'visual-arts': { questions: [...visualArtsQuestions, ...visualArtsFloorB2Questions, ...visualArtsBank2Questions, ...visualArtsBank3Questions], topics: visualArtsTopics },
  csd: { questions: [...csdQuestions, ...csdReviewedQuestions, ...csdFloorB2Questions, ...csdBank1Questions], topics: csdTopics },
  'ethics-religious': { questions: [...ethicsReligiousQuestions, ...ethicsReligiousFloorB2Questions], topics: ethicsReligiousTopics },
  'technology-living': { questions: [...technologyLivingQuestions, ...technologyLivingBankQuestions, ...technologyLivingBank2Questions, ...technologyLivingFloorB2Questions, ...technologyLivingBank3Questions, ...technologyLivingBank4Questions], topics: technologyLivingTopics },
}

// ── 機器閘放行題（auto-gate）──────────────────────────────────────────────
// 對應 load.ts 的 autoLoaders。barrel 與 loader 必須同步 —— barrel 是所有 QA
// 工具及稽核統計的讀取路徑，只註冊其中一邊會令題目對統計隱形
// （2026-08-07 曾因此少報 12 題，迴歸鎖：__tests__/loader-parity.test.mts）。
const autoBanks: Record<string, AnyQuestion[]> = {
  'physics': physicsAutoQuestions,
  'm1': m1AutoQuestions,
  'm2': m2AutoQuestions,
  'bafs': bafsAutoQuestions,
  'economics': economicsAutoQuestions,
  'chemistry': chemistryAutoQuestions,
  'chinese': chineseAutoQuestions,
  'english': englishAutoQuestions,
  'geography': geographyAutoQuestions,
  'ethics-religious': ethicsReligiousAutoQuestions,
  'technology-living': technologyLivingAutoQuestions,
  'english-literature': englishLiteratureAutoQuestions,
  'history': historyAutoQuestions,
  'chinese-literature': chineseLiteratureAutoQuestions,
  'chinese-history': chineseHistoryAutoQuestions,
}

/** 該科全部題目（MC + 書寫題）。計數／課題統計用。 */
export function getSubjectQuestions(subjectId: string): AnyQuestion[] {
  const base = banks[subjectId]?.questions ?? []
  const extra = autoBanks[subjectId]
  return extra?.length ? [...base, ...extra] : base
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

  // ⚠️ 必須採用 getSubjectQuestions()（即 banks ＋ autoBanks），不可只取
  // bank.questions。2026-08-28 之前此處僅統計 banks，機器入庫的一批
  // （`*-auto.ts`）完全不計入課題題數 —— 實測 15 科共 101 個課題向學生少報，
  // 例如物理 electricity 顯示 133 而實際有 213 條。
  // 此數字屬【用戶可見】內容（科目頁課題卡、/paper-warrior），
  // 顯示與題庫不符的數值，等同向學生提供錯誤資訊。
  // 同時亦令覆蓋率報告（採用 getSubjectQuestions）與介面長期不一致，
  // 補題時將依據一份錯誤的「最薄課題」清單進行。
  const counts = new Map<string, number>()
  const mcCounts = new Map<string, number>()
  const writtenCounts = new Map<string, number>()
  for (const q of getSubjectQuestions(subjectId)) {
    counts.set(q.topic, (counts.get(q.topic) ?? 0) + 1)
    if (q.type === 'mc') mcCounts.set(q.topic, (mcCounts.get(q.topic) ?? 0) + 1)
    else writtenCounts.set(q.topic, (writtenCounts.get(q.topic) ?? 0) + 1)
  }

  const withRealCounts = bank.topics.map((t) => ({
    ...t,
    count: counts.get(t.id) ?? 0,
    mcCount: mcCounts.get(t.id) ?? 0,
    writtenCount: writtenCounts.get(t.id) ?? 0,
  }))
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
