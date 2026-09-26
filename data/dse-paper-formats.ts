// ============================================================================
// data/dse-paper-formats.ts
// 每一科【真實 DSE 卷面結構】的事實清單。
// ----------------------------------------------------------------------------
// 來源：香港考試及評核局「評核大綱 / Assessment Framework」PDF。
// 2026-08-21 按 2026 年版逐科核對；2026-09-26 按 2027 年版（含地理、倫理與宗教、
// 音樂、體育的修訂版 -rev）再逐科核對，並加入下方 PAPER_STRUCTURE。
// 選修單元名稱來自教育局各科「課程及評估指引」（評核大綱多數不列單元名）。
// 入口：https://www.hkeaa.edu.hk/en/hkdse/assessment/assessment_framework/
// PDF 路徑格式：DocLibrary/HKDSE/Subject_Information/<slug>/<year>hkdse-<e|c>-<code>.pdf
//
// ⚠️ 本檔【只記錄事實，不重製版權內容】—— 記低嘅係「卷數、題型、比重、時限」
//    呢類結構性事實，並無抄錄大綱正文。
//
// 點解要有呢個檔：
//   本平台題庫長期 100% 由 MC 組成。但經逐科核對官方大綱後確認 ——
//   **有 10 科嘅真實 DSE 試卷根本冇多項選擇題。** 對呢啲科目而言，MC 練習
//   本身唔係「假題目」（概念仍然喺課程範圍內），但如果唔加說明就擺出嚟，
//   等於暗示考生「你將來會咁樣考」，而事實並非如此。
//   憲章「不虛構」要求我哋講清楚：邊啲練習對應真實卷面，邊啲只係知識檢查。
//
// 更新守則：HKEAA 每年重出大綱。改動本檔前必須重新下載該年 PDF 核對，
// 並更新 `verifiedOn`。唔准憑記憶改。
// ============================================================================

export type PaperFormat =
  | 'mc' // 多項選擇題
  | 'short' // 短題目
  | 'structured' // 結構式／資料回應
  | 'long' // 長題目／傳統題
  | 'essay' // 論述題／作文
  | 'fill_in' // 填充／填表
  | 'practical' // 實作／設計／演奏
  | 'oral' // 口試
  | 'listening' // 聆聽

export interface SubjectPaperFormat {
  /** app 內部 subject id */
  subject: string
  /** 真實公開試卷面【有冇】多項選擇題 */
  hasMC: boolean
  /**
   * 多項選擇題佔【全科總分】的百分比（不是佔該卷的百分比）。
   *
   * 之所以記錄：學生用本平台練 MC，練到的是這個比例的分數，其餘要靠別的題型。
   * 例如物理 MC 只佔全科 21%、化學與生物各 18% —— 一個只做 MC 的物理考生，
   * 練習覆蓋的分數不足全科四分之一。
   */
  mcWeightPct?: number
  /**
   * 官方大綱對難度／範圍梯度的明文說明。
   *
   * ⚠️ 香港考試及評核局【並無】公布任何「易／中／難」的固定百分比。
   *    難度由審題委員會按 specification grid 控制，成績以水平參照方式匯報，
   *    每年按考生表現與試卷難易調整臨界分數。任何「DSE 難度比例是 x:y:z」
   *    的說法，都不是官方標準。
   *
   * 官方真正寫得明白的，是【按卷別分段的範圍與難度梯度】—— 記錄於此。
   */
  difficultyGradient?: string
  /** 真實卷面出現過嘅題型（唔包括校本評核） */
  formats: PaperFormat[]
  /** 一句講清楚卷面結構 —— 顯示畀學生睇，必須同官方大綱一致 */
  papersZh: string
  papersEn: string
  /** 核對日期 + 大綱年份 */
  verifiedOn: string
  frameworkYear: number
}

export const DSE_PAPER_FORMATS: SubjectPaperFormat[] = [
  // ── 真實卷面【有】MC ────────────────────────────────────────────────────
  {
    subject: 'math', hasMC: true, mcWeightPct: 35,
    difficultyGradient: '卷二全卷 MC：甲部佔該卷 2/3 分數，【只考必修部分的基礎課題 + 中一至中三基礎課題】；乙部佔 1/3，涵蓋必修部分連同中一至中三的基礎與非基礎課題。卷一亦分三段：甲部(1) 35 分為 8–11 條「淺易題」(elementary)，甲部(2) 35 分為 4–7 條「較難題」(harder)，乙部 35 分為 4–7 條。', formats: ['mc', 'long'],
    papersZh: '卷一 傳統題 65%（2¼ 小時）；卷二 全卷多項選擇題 35%（1¼ 小時）',
    papersEn: 'Paper 1 conventional questions 65% (2¼ h); Paper 2 all multiple-choice 35% (1¼ h)',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'physics', hasMC: true, mcWeightPct: 21,
    difficultyGradient: '大綱未就 MC 內部再分難度段；卷一甲部 MC 佔全科 21%，乙部短題／結構題／論述題佔 39%。', formats: ['mc', 'structured', 'long'],
    papersZh: '卷一 甲部 多項選擇題、乙部 結構式問題；卷二 選修部分（含多項選擇題與結構式問題）',
    papersEn: 'Paper 1 Section A multiple-choice + Section B structured; Paper 2 electives (MC + structured)',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'chemistry', hasMC: true, mcWeightPct: 18,
    difficultyGradient: '卷一甲、乙兩部各再分 Part I（主要考課題 I–VIII）與 Part II（主要考課題 IX–XII）—— 分段依課程範圍而非難度。MC 佔全科 18%。', formats: ['mc', 'structured', 'long'],
    papersZh: '卷一 甲部 多項選擇題、乙部 結構式及論述題；卷二 選修部分',
    papersEn: 'Paper 1 Section A multiple-choice + Section B structured/essay; Paper 2 electives',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'biology', hasMC: true, mcWeightPct: 18,
    difficultyGradient: '大綱未就 MC 內部再分難度段；卷一甲部 MC 佔全科 18%，乙部短題／結構題／論述題佔 42%。', formats: ['mc', 'structured', 'long'],
    papersZh: '卷一 甲部 多項選擇題、乙部 短題目及論述題；卷二 選修部分',
    papersEn: 'Paper 1 Section A multiple-choice + Section B short/essay; Paper 2 electives',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'economics', hasMC: true, mcWeightPct: 30,
    difficultyGradient: '大綱未就 MC 內部再分難度段，但明文要求試題兼顧「基礎與選定範疇的知識及分析能力」與「高階思維技巧」。卷一全卷 MC 佔全科 30%。', formats: ['mc', 'short', 'structured', 'essay'],
    papersZh: '卷一 全卷多項選擇題 30%；卷二 甲部 短題目 26%、乙部 結構式／論述／資料回應題 35%、丙部 選修部分 9%（兩個選修部分選一）',
    papersEn: 'Paper 1 all multiple-choice 30%; Paper 2 Section A short questions 26%, Section B structured/essay/data-response 35%, Section C elective 9% (one of two elective parts)',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'bafs', hasMC: true, mcWeightPct: 17,
    difficultyGradient: '卷一甲部 24 條 MC 佔全科 17%，乙部 3 條短題佔 8%；會計與商業管理兩個選修組別的共同課題會出同一批題目。', formats: ['mc', 'short', 'structured', 'long'],
    papersZh: '卷一 24 條多項選擇題及短題目；卷二 選修部分（會計／商業管理）結構式及長題目',
    papersEn: 'Paper 1 24 multiple-choice + short questions; Paper 2 elective (Accounting / Business Mgmt) structured & long',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'ict', hasMC: true, mcWeightPct: 22,
    difficultyGradient: '卷一甲部 MC 佔全科 22%，乙部短題與結構題佔 33%；MC 只考必修部分。', formats: ['mc', 'short', 'structured'],
    papersZh: '卷一 甲部 多項選擇題、乙部 短題目及結構式問題；卷二 選修單元',
    papersEn: 'Paper 1 Section A multiple-choice + Section B short/structured; Paper 2 elective module',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'geography', hasMC: true,
    difficultyGradient: '卷一甲部 MC 涵蓋必修部分【任何】課題，建議作答時間約 30 分鐘；其餘為實地考察題、資料／技能題及短論述題。', formats: ['mc', 'structured', 'essay'],
    papersZh: '卷一 75%：甲部 多項選擇題 20%、乙部 實地考察題 15%、丙部 資料／技能／結構式問題 30%（四題選二）、丁部 短文論述 10%（三題選一）；卷二 選修部分 25%：戊部 資料／技能／結構式問題 15%、己部 短文論述 10%',
    papersEn: 'Paper 1 75%: A multiple-choice 20%, B fieldwork-based 15%, C data/skill-based/structured 30% (two of four), D short essay 10% (one of three); Paper 2 elective 25%: E data/skill-based/structured 15%, F short essay 10%',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'pe', hasMC: true,
    difficultyGradient: '卷一甲部 MC、乙部短題；卷二為 3 條長題目選答 2 條；卷三為實習考試。', formats: ['mc', 'structured', 'essay'],
    papersZh: '卷一 42%：甲部 多項選擇題、乙部 短題目；卷二 長題目 18%（三題選二）；卷三 實習考試 40%',
    papersEn: 'Paper 1 42%: Section A multiple-choice + Section B short questions; Paper 2 long questions 18% (two of three); Paper 3 practical examination 40%',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'ths', hasMC: true,
    difficultyGradient: '卷一甲部為 MC、乙部為資料回應題（3 選 2），卷一合共佔全科 45%；卷二為 5 條論述題選答 3 條，佔 55%。', formats: ['mc', 'structured'],
    papersZh: '卷一 甲部 多項選擇題、乙部 資料回應題（3 選 2）',
    papersEn: 'Paper 1 Section A multiple-choice + Section B data-based (answer 2 of 3)',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'technology-living', hasMC: true,
    difficultyGradient: '卷一分三部：甲部 MC 15 分、乙部設計題 25 分、丙部結構題 30 分 —— MC 只佔卷一約五分之一。', formats: ['mc', 'short', 'structured'],
    papersZh: '卷一 必修部分 30%：甲部 多項選擇題 15 分、乙部 設計題 25 分、丙部 結構式問題 30 分；卷二 選修部分 40%（三個選修單元選二）',
    papersEn: 'Paper 1 compulsory 30%: Section A multiple-choice 15 marks, Section B design 25 marks, Section C structured 30 marks; Paper 2 elective 40% (two of three modules)',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'music', hasMC: true, formats: ['mc', 'listening', 'short', 'practical'],
    papersZh: '聆聽卷設多項選擇題、配對題及長短題；另設創作卷與演奏卷',
    papersEn: 'Listening paper uses multiple-choice, matching and long/short questions; plus composing and performing papers',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'csd', hasMC: true,
    difficultyGradient: '只設一卷資料回應題，可用多種題型（多項選擇題、短題目、短文論述題）。成績只分「達標／未達標」。', formats: ['mc', 'short', 'essay', 'structured'],
    papersZh: '設不同題型，包括多項選擇題、短題目、短文論述題等',
    papersEn: 'Various question types are set, including multiple-choice, short questions and short essay questions',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'chinese', hasMC: true,
    difficultyGradient: '卷一閱讀能力：甲部指定文言經典佔全卷 30%、乙部課外篇章佔 70%；設題方式包括問答、選擇、填表、填充 —— 選擇題只是其中一種。', formats: ['mc', 'short', 'fill_in', 'essay'],
    papersZh: '卷一 閱讀能力 40%：甲部 指定文言經典（佔全卷 30%）、乙部 課外篇章（70%）；設題方式包括問答、選擇、填表、填充。卷二 寫作能力 45%：甲部 實用寫作（佔全卷 30%）、乙部 命題寫作（70%）',
    papersEn: 'Paper 1 Reading 40%: Part A set classical texts (30% of paper), Part B unseen passages (70%); question types include short answer, multiple-choice, table completion and gap filling. Paper 2 Writing 45%: Part A practical writing (30%), Part B essay writing (70%)',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'english', hasMC: true,
    difficultyGradient: 'Paper 1 Reading 分 Part A（必答）與 Part B1／B2 二擇一：**B1 較淺、B2 較深**，只做 A+B1 者最高只能取得第 4 級。這是全 DSE 之中最明文的難度分流設計。', formats: ['mc', 'short', 'essay', 'listening', 'oral'],
    papersZh: 'Paper 1 閱讀 20%（Part A 必答；Part B1 較淺 / B2 較深二選一）；Paper 2 寫作 25%；Paper 3 聆聽及綜合能力 30%；Paper 4 說話 10%',
    papersEn: 'Paper 1 Reading 20% (Part A compulsory; choose Part B1 easier or B2 harder); Paper 2 Writing 25%; Paper 3 Listening & Integrated Skills 30%; Paper 4 Speaking 10%',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },

  // ── 真實卷面【冇】MC ────────────────────────────────────────────────────
  {
    subject: 'm1', hasMC: false, formats: ['long'],
    papersZh: '單卷傳統題，佔本單元 100%（2½ 小時）—— 全卷冇多項選擇題',
    papersEn: 'One paper of conventional questions, 100% (2½ h) — no multiple-choice at all',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'm2', hasMC: false, formats: ['long'],
    papersZh: '單卷傳統題，佔本單元 100%（2½ 小時）—— 全卷冇多項選擇題',
    papersEn: 'One paper of conventional questions, 100% (2½ h) — no multiple-choice at all',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'history', hasMC: false, formats: ['structured', 'essay'],
    papersZh: '卷一 資料題 60%（2 小時，全部必答，資料包括文字、統計、地圖、漫畫、照片）；卷二 論述題 40%（1½ 小時，七題選答兩題）—— 全卷冇多項選擇題',
    papersEn: 'Paper 1 data-based questions 60% (2 h, all compulsory; written sources, statistics, maps, cartoons, photographs); Paper 2 seven essay-type questions, attempt any TWO, 40% (1½ h) — no multiple-choice at all',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'chinese-history', hasMC: false, formats: ['structured', 'essay'],
    papersZh: '卷一 歷代發展 70%（2 小時 15 分）：必答題 40 分（提供多項資料）＋ 甲部、乙部各 3 題各選 1 題共 50 分；卷二 歷史專題 30%（1 小時 20 分）：6 單元，每單元 3 題，選 1 單元答 2 題共 50 分 —— 全卷冇多項選擇題',
    papersEn: 'Paper 1 Dynastic Development 70% (2h15): compulsory data-rich question 40 marks + one of three from each of Parts A and B, 50 marks; Paper 2 Themes 30% (1h20): 6 units × 3 questions, answer 2 from one unit, 50 marks — no multiple-choice at all',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'chinese-literature', hasMC: false, formats: ['essay', 'structured'],
    papersZh: '卷一 文學創作 25%（2 小時，兩題選一，作文一篇）；卷二 文學賞析 60%（2 小時，四題選二，結合指定作品與課外作品設問）—— 全卷冇多項選擇題',
    papersEn: 'Paper 1 Literary Creation 25% (2 h, one of two questions); Paper 2 Literary Appreciation 60% (2 h, two of four questions on set and unseen texts) — no multiple-choice at all',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'english-literature', hasMC: false, formats: ['essay', 'structured'],
    papersZh: 'Paper 1 論文寫作 50%（3 小時，小說／戲劇／短篇小說比較各一題）；Paper 2 賞析 30%（2 小時，指定篇章、指定詩作、未見過詩作）—— 全卷冇多項選擇題',
    papersEn: 'Paper 1 Essay Writing 50% (3 h: one novel, one play, one comparative short-story question); Paper 2 Appreciation 30% (2 h: set passage, set poems, unseen poem) — no multiple-choice at all',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'ethics-religious', hasMC: false, formats: ['short', 'essay'],
    papersZh: '卷一 倫理學 50%（1 小時 45 分）：甲部 規範倫理 4–5 條短題目（必答）＋ 乙部 個人及社會議題 4 題選 2（論述題及引導式論述題）；卷二 宗教傳統 50%（論述題及引導式論述題）—— 全卷冇多項選擇題',
    papersEn: 'Paper 1 Ethics 50% (1h45): Part A Normative Ethics 4–5 compulsory short questions + Part B Personal & Social Issues, 2 of 4 essay / guided-essay questions; Paper 2 Religious Traditions 50% (essay and guided-essay) — no multiple-choice at all',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'health-management', hasMC: false, formats: ['short', 'structured', 'essay'],
    papersZh: '卷一 必修部分 46%（2 小時）：甲部 短題目、乙部 結構式問題（均須作答）；卷二 必修及選修 34%（1¾ 小時）：甲部 短題目、乙部 議題為本題（三題選二）—— 全卷冇多項選擇題',
    papersEn: 'Paper 1 compulsory part 46% (2 h): Section A short questions + Section B structured questions (all compulsory); Paper 2 compulsory + elective 34% (1¾ h): Section A short questions + Section B issue-based questions (two of three) — no multiple-choice at all',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'design-tech', hasMC: false, formats: ['structured', 'practical', 'essay'],
    papersZh: '卷一 必修 30%（2 小時）：甲部 一條大型設計題（60 分）、乙部 結構式問題；卷二 選修 30%（2 小時，五個單元選二）—— 全卷冇多項選擇題',
    papersEn: 'Paper 1 compulsory 30% (2 h): Section A one major design question (60 marks) + Section B structured; Paper 2 elective 30% (2 h, two of five modules) — no multiple-choice at all',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
  {
    subject: 'visual-arts', hasMC: false, formats: ['essay', 'practical'],
    papersZh: '卷一 主題演繹 或 卷二 設計（二選一，4 小時）：甲部 藝術／設計評賞（45 分鐘，就所提供作品圖片撰寫評賞）、乙部 藝術創作／設計（3 小時 15 分）—— 全卷冇多項選擇題',
    papersEn: 'Choose Paper 1 (Visual Presentation of a Theme) or Paper 2 (Design), 4 h: Part A critical appreciation of provided reproductions (45 min) + Part B art-making / design (3h15) — no multiple-choice at all',
    verifiedOn: '2026-09-26', frameworkYear: 2027,
  },
]

const BY_SUBJECT = new Map(DSE_PAPER_FORMATS.map((f) => [f.subject, f]))

export function getPaperFormat(subject: string): SubjectPaperFormat | undefined {
  return BY_SUBJECT.get(subject)
}

/** 真實 DSE 卷面冇 MC 嘅科目 —— 呢啲科嘅 MC 練習只算「知識檢查」，唔可以扮卷面題型。 */
export function isMCExamFormat(subject: string): boolean {
  return BY_SUBJECT.get(subject)?.hasMC ?? false
}

// ============================================================================
// PAPER_STRUCTURE —— 2027 年卷別、分部、題型、比重與選修規則（結構化）
// ----------------------------------------------------------------------------
// 2026-09-26 逐科讀 2027 年評核大綱原文整理。只記事實，不抄大綱正文。
//   • weight = 佔全科總分百分比。derived = 大綱只列分數，此處按分數比例換算。
//   • weight = null：大綱只列卷別合計，未分列分部比重 —— 不作估算。
//   • kinds 含 'unknown'：大綱未列明題型 —— 不作估算。
//   • 選修單元名稱照錄教育局課程指引原文（英文），避免自行翻譯出錯。
// 迴歸鎖：lib/__tests__/paper-structure.test.mts（各卷比重＋校本評核＝100 等）。
// ============================================================================

export type QuestionKind =
  | 'mc'
  | 'matching'
  | 'fill'
  | 'short'
  | 'structured'
  | 'essay'
  | 'guided-essay'
  | 'short-essay'
  | 'data-based'
  | 'data-response'
  | 'data-skill-structured'
  | 'fieldwork'
  | 'issue-based'
  | 'case-study'
  | 'application'
  | 'long'
  | 'conventional'
  | 'practical-writing'
  | 'composition'
  | 'literary-creation'
  | 'appreciation'
  | 'listening'
  | 'integrated'
  | 'speaking'
  | 'design'
  | 'performing'
  | 'creating'
  | 'practical'
  | 'art-making'
  | 'unknown'

export const QUESTION_KIND_LABELS: Record<QuestionKind, { zh: string; en: string }> = {
  "mc": {
    "zh": "選擇題",
    "en": "Multiple-choice"
  },
  "matching": {
    "zh": "配對題",
    "en": "Matching"
  },
  "fill": {
    "zh": "填充／填表",
    "en": "Gap filling / table completion"
  },
  "short": {
    "zh": "短題目",
    "en": "Short questions"
  },
  "structured": {
    "zh": "結構式問題",
    "en": "Structured questions"
  },
  "essay": {
    "zh": "論述題",
    "en": "Essay questions"
  },
  "guided-essay": {
    "zh": "引導式論述題",
    "en": "Guided essay questions"
  },
  "short-essay": {
    "zh": "短文論述題",
    "en": "Short essay questions"
  },
  "data-based": {
    "zh": "資料題",
    "en": "Data-based questions"
  },
  "data-response": {
    "zh": "資料回應題",
    "en": "Data-response questions"
  },
  "data-skill-structured": {
    "zh": "資料／技能／結構式問題",
    "en": "Data / skill-based / structured questions"
  },
  "fieldwork": {
    "zh": "實地考察題",
    "en": "Fieldwork-based question"
  },
  "issue-based": {
    "zh": "議題為本題",
    "en": "Issue-based questions"
  },
  "case-study": {
    "zh": "個案研究",
    "en": "Case studies"
  },
  "application": {
    "zh": "應用題",
    "en": "Application problems"
  },
  "long": {
    "zh": "長題目",
    "en": "Long questions"
  },
  "conventional": {
    "zh": "傳統題",
    "en": "Conventional questions"
  },
  "practical-writing": {
    "zh": "實用寫作",
    "en": "Practical writing"
  },
  "composition": {
    "zh": "寫作",
    "en": "Writing"
  },
  "literary-creation": {
    "zh": "文學創作",
    "en": "Literary creation"
  },
  "appreciation": {
    "zh": "賞析",
    "en": "Appreciation"
  },
  "listening": {
    "zh": "聆聽",
    "en": "Listening"
  },
  "integrated": {
    "zh": "綜合能力",
    "en": "Integrated skills"
  },
  "speaking": {
    "zh": "說話",
    "en": "Speaking"
  },
  "design": {
    "zh": "設計題",
    "en": "Design question"
  },
  "performing": {
    "zh": "演奏",
    "en": "Performing"
  },
  "creating": {
    "zh": "創作",
    "en": "Creating"
  },
  "practical": {
    "zh": "實習考試",
    "en": "Practical examination"
  },
  "art-making": {
    "zh": "藝術創作／設計",
    "en": "Art-making / design"
  },
  "unknown": {
    "zh": "大綱未列明",
    "en": "Not specified"
  }
}

export interface PaperSection {
  /** 卷別，例如 '1'、'2A'；視藝為 '1/2'（兩卷選一） */
  paper: string
  /** 分部，例如 'A'、'甲部'；無分部則省略 */
  section?: string
  kinds: QuestionKind[]
  /** 佔全科總分 %；null = 大綱未分列 */
  weight: number | null
  /** true = 由分數比例換算，大綱無直接列出百分比 */
  derived?: boolean
  choice?: string
  /** 屬選修部分 */
  elective?: boolean
  /** 只適用於某組別（BAFS 會計／商管） */
  strand?: string
  noteZh?: string
}

export interface ElectiveRule {
  /** 'strand' = 先揀組別（BAFS、科技與生活）；'units' = 揀選修單元 */
  kind: 'strand' | 'units'
  /** 只適用於某組別的選修（科技與生活） */
  strand?: string
  choose: number
  of: number
  units: { id: string; en?: string; zh?: string }[]
  source: string
}

export interface PaperStructure {
  /** 各卷佔全科 %（未計校本評核） */
  paperWeights: Record<string, number>
  sbaPct: number
  sections: PaperSection[]
  electives?: ElectiveRule[]
  /** HKEAA DocLibrary/HKDSE/Subject_Information/ 之下的 2027 年評核大綱 */
  framework: string
  pages: string
  verifiedOn: string
}

export const PAPER_STRUCTURE: Record<string, PaperStructure> = {
  "math": {
    "paperWeights": {
      "1": 65,
      "2": 35
    },
    "sbaPct": 0,
    "sections": [
      {
        "paper": "1",
        "section": "A(1)",
        "kinds": [
          "conventional"
        ],
        "weight": 21.67,
        "derived": true,
        "noteZh": "8–11 條淺易題，35 分"
      },
      {
        "paper": "1",
        "section": "A(2)",
        "kinds": [
          "conventional"
        ],
        "weight": 21.67,
        "derived": true,
        "noteZh": "4–7 條較難題，35 分"
      },
      {
        "paper": "1",
        "section": "B",
        "kinds": [
          "conventional"
        ],
        "weight": 21.67,
        "derived": true,
        "noteZh": "4–7 條，35 分"
      },
      {
        "paper": "2",
        "section": "A",
        "kinds": [
          "mc"
        ],
        "weight": 23.33,
        "derived": true,
        "noteZh": "佔該卷 2/3"
      },
      {
        "paper": "2",
        "section": "B",
        "kinds": [
          "mc"
        ],
        "weight": 11.67,
        "derived": true,
        "noteZh": "佔該卷 1/3"
      }
    ],
    "framework": "math/2027hkdse-e-math.pdf",
    "pages": "2-3",
    "verifiedOn": "2026-09-26"
  },
  "m1": {
    "paperWeights": {
      "1": 100
    },
    "sbaPct": 0,
    "sections": [
      {
        "paper": "1",
        "section": "A",
        "kinds": [
          "short"
        ],
        "weight": 50,
        "noteZh": "8–12 條淺易短題目，50 分"
      },
      {
        "paper": "1",
        "section": "B",
        "kinds": [
          "long"
        ],
        "weight": 50,
        "noteZh": "3–5 條長題目，50 分"
      }
    ],
    "framework": "math/2027hkdse-e-math.pdf",
    "pages": "3-4",
    "verifiedOn": "2026-09-26"
  },
  "m2": {
    "paperWeights": {
      "1": 100
    },
    "sbaPct": 0,
    "sections": [
      {
        "paper": "1",
        "section": "A",
        "kinds": [
          "short"
        ],
        "weight": 50,
        "noteZh": "8–12 條淺易短題目，50 分"
      },
      {
        "paper": "1",
        "section": "B",
        "kinds": [
          "long"
        ],
        "weight": 50,
        "noteZh": "3–5 條長題目，50 分"
      }
    ],
    "framework": "math/2027hkdse-e-math.pdf",
    "pages": "3-4",
    "verifiedOn": "2026-09-26"
  },
  "chinese": {
    "paperWeights": {
      "1": 40,
      "2": 45
    },
    "sbaPct": 15,
    "sections": [
      {
        "paper": "1",
        "section": "甲部",
        "kinds": [
          "short",
          "mc",
          "fill"
        ],
        "weight": 12,
        "noteZh": "指定文言經典，佔全卷 30%"
      },
      {
        "paper": "1",
        "section": "乙部",
        "kinds": [
          "short",
          "mc",
          "fill"
        ],
        "weight": 28,
        "noteZh": "課外篇章，佔全卷 70%"
      },
      {
        "paper": "2",
        "section": "甲部",
        "kinds": [
          "practical-writing"
        ],
        "weight": 13.5,
        "noteZh": "佔全卷 30%"
      },
      {
        "paper": "2",
        "section": "乙部",
        "kinds": [
          "composition"
        ],
        "weight": 31.5,
        "noteZh": "佔全卷 70%"
      }
    ],
    "framework": "chi_lang/2027hkdse-c-clang.pdf",
    "pages": "1-2",
    "verifiedOn": "2026-09-26"
  },
  "english": {
    "paperWeights": {
      "1": 20,
      "2": 25,
      "3": 30,
      "4": 10
    },
    "sbaPct": 15,
    "sections": [
      {
        "paper": "1",
        "section": "A",
        "kinds": [
          "mc",
          "short"
        ],
        "weight": 10,
        "noteZh": "Reading，必答"
      },
      {
        "paper": "1",
        "section": "B1/B2",
        "kinds": [
          "mc",
          "short"
        ],
        "weight": 10,
        "choice": "B1（較淺）或 B2（較深）二選一"
      },
      {
        "paper": "2",
        "section": "A",
        "kinds": [
          "composition"
        ],
        "weight": 10,
        "noteZh": "約 200 字引導寫作"
      },
      {
        "paper": "2",
        "section": "B",
        "kinds": [
          "composition"
        ],
        "weight": 15,
        "choice": "四題選一",
        "noteZh": "約 400 字"
      },
      {
        "paper": "3",
        "section": "A",
        "kinds": [
          "listening"
        ],
        "weight": 15
      },
      {
        "paper": "3",
        "section": "B1/B2",
        "kinds": [
          "integrated"
        ],
        "weight": 15,
        "choice": "B1 或 B2 二選一"
      },
      {
        "paper": "4",
        "kinds": [
          "speaking"
        ],
        "weight": 10
      }
    ],
    "framework": "eng_lang/2027hkdse-e-elang.pdf",
    "pages": "2-3",
    "verifiedOn": "2026-09-26"
  },
  "csd": {
    "paperWeights": {
      "1": 100
    },
    "sbaPct": 0,
    "sections": [
      {
        "paper": "1",
        "kinds": [
          "data-response",
          "mc",
          "short",
          "short-essay"
        ],
        "weight": 100,
        "noteZh": "全部題目均附資料"
      }
    ],
    "framework": "cs/2027hkdse-e-cs.pdf",
    "pages": "1-2",
    "verifiedOn": "2026-09-26"
  },
  "physics": {
    "paperWeights": {
      "1": 60,
      "2": 20
    },
    "sbaPct": 20,
    "sections": [
      {
        "paper": "1",
        "section": "A",
        "kinds": [
          "mc"
        ],
        "weight": 21
      },
      {
        "paper": "1",
        "section": "B",
        "kinds": [
          "short",
          "structured",
          "essay"
        ],
        "weight": 39
      },
      {
        "paper": "2",
        "kinds": [
          "mc",
          "structured"
        ],
        "weight": 20,
        "choice": "四個選修選二，每個佔 10%",
        "elective": true
      }
    ],
    "electives": [
      {
        "kind": "units",
        "choose": 2,
        "of": 4,
        "source": "https://www.edb.gov.hk/attachment/en/curriculum-development/kla/science-edu/Phy_C_and_A_Guide_updated_e_20151126.pdf",
        "units": [
          {
            "id": "astronomy-and-space-science",
            "en": "Astronomy and Space Science"
          },
          {
            "id": "atomic-world",
            "en": "Atomic World"
          },
          {
            "id": "energy-and-use-of-energy",
            "en": "Energy and Use of Energy"
          },
          {
            "id": "medical-physics",
            "en": "Medical Physics"
          }
        ]
      }
    ],
    "framework": "phy/2027hkdse-e-phy.pdf",
    "pages": "2",
    "verifiedOn": "2026-09-26"
  },
  "chemistry": {
    "paperWeights": {
      "1": 60,
      "2": 20
    },
    "sbaPct": 20,
    "sections": [
      {
        "paper": "1",
        "section": "A",
        "kinds": [
          "mc"
        ],
        "weight": 18
      },
      {
        "paper": "1",
        "section": "B",
        "kinds": [
          "short",
          "structured",
          "essay"
        ],
        "weight": 42
      },
      {
        "paper": "2",
        "kinds": [
          "structured"
        ],
        "weight": 20,
        "choice": "所選兩個選修的題目",
        "elective": true
      }
    ],
    "electives": [
      {
        "kind": "units",
        "choose": 2,
        "of": 3,
        "source": "https://www.edb.gov.hk/attachment/en/curriculum-development/kla/science-edu/Chem_C_and_A_Guide_updated_Eng_22082018.pdf",
        "units": [
          {
            "id": "industrial-chemistry",
            "en": "Industrial Chemistry"
          },
          {
            "id": "materials-chemistry",
            "en": "Materials Chemistry"
          },
          {
            "id": "analytical-chemistry",
            "en": "Analytical Chemistry"
          }
        ]
      }
    ],
    "framework": "chem/2027hkdse-e-chem.pdf",
    "pages": "2",
    "verifiedOn": "2026-09-26"
  },
  "biology": {
    "paperWeights": {
      "1": 60,
      "2": 20
    },
    "sbaPct": 20,
    "sections": [
      {
        "paper": "1",
        "section": "A",
        "kinds": [
          "mc"
        ],
        "weight": 18
      },
      {
        "paper": "1",
        "section": "B",
        "kinds": [
          "short",
          "structured",
          "essay"
        ],
        "weight": 42
      },
      {
        "paper": "2",
        "kinds": [
          "structured"
        ],
        "weight": 20,
        "choice": "四個選修選二",
        "elective": true
      }
    ],
    "electives": [
      {
        "kind": "units",
        "choose": 2,
        "of": 4,
        "source": "https://www.edb.gov.hk/attachment/en/curriculum-development/kla/science-edu/Bio_C_and_A_Guide_updated_e_20151126.pdf",
        "units": [
          {
            "id": "human-physiology-regulation-and-control",
            "en": "Human Physiology: Regulation and Control"
          },
          {
            "id": "applied-ecology",
            "en": "Applied Ecology"
          },
          {
            "id": "microorganisms-and-humans",
            "en": "Microorganisms and Humans"
          },
          {
            "id": "biotechnology",
            "en": "Biotechnology"
          }
        ]
      }
    ],
    "framework": "bio/2027hkdse-e-bio.pdf",
    "pages": "2",
    "verifiedOn": "2026-09-26"
  },
  "economics": {
    "paperWeights": {
      "1": 30,
      "2": 70
    },
    "sbaPct": 0,
    "sections": [
      {
        "paper": "1",
        "kinds": [
          "mc"
        ],
        "weight": 30
      },
      {
        "paper": "2",
        "section": "A",
        "kinds": [
          "short"
        ],
        "weight": 26
      },
      {
        "paper": "2",
        "section": "B",
        "kinds": [
          "structured",
          "essay",
          "data-response"
        ],
        "weight": 35
      },
      {
        "paper": "2",
        "section": "C",
        "kinds": [
          "structured",
          "essay"
        ],
        "weight": 9,
        "choice": "兩個選修部分選一",
        "elective": true
      }
    ],
    "electives": [
      {
        "kind": "units",
        "choose": 1,
        "of": 2,
        "source": "https://www.edb.gov.hk/attachment/en/curriculum-development/kla/pshe/Econ_C&A_Guide_E_with_updates_in_2025.pdf",
        "units": [
          {
            "id": "elective-part-1",
            "en": "Elective Part 1: Monopoly Pricing; Anti-competitive Behaviours and Competition Policy"
          },
          {
            "id": "elective-part-2",
            "en": "Elective Part 2: Extension of Trade Theory; Economic Growth and Development"
          }
        ]
      }
    ],
    "framework": "econ/2027hkdse-e-econ.pdf",
    "pages": "1",
    "verifiedOn": "2026-09-26"
  },
  "bafs": {
    "paperWeights": {
      "1": 25,
      "2": 75
    },
    "sbaPct": 0,
    "sections": [
      {
        "paper": "1",
        "section": "A",
        "kinds": [
          "mc"
        ],
        "weight": 17,
        "noteZh": "24 條，兩個組別共同課題同題"
      },
      {
        "paper": "1",
        "section": "B",
        "kinds": [
          "short"
        ],
        "weight": 8,
        "noteZh": "3 條"
      },
      {
        "paper": "2A",
        "section": "A",
        "kinds": [
          "short"
        ],
        "weight": 33,
        "strand": "accounting",
        "noteZh": "4–5 條"
      },
      {
        "paper": "2A",
        "section": "B",
        "kinds": [
          "application"
        ],
        "weight": 27,
        "strand": "accounting",
        "noteZh": "3 條應用題"
      },
      {
        "paper": "2A",
        "section": "C",
        "kinds": [
          "long"
        ],
        "weight": 15,
        "choice": "兩題選一",
        "strand": "accounting"
      },
      {
        "paper": "2B",
        "section": "A",
        "kinds": [
          "short"
        ],
        "weight": 33,
        "strand": "business-management",
        "noteZh": "5–6 條"
      },
      {
        "paper": "2B",
        "section": "B",
        "kinds": [
          "case-study"
        ],
        "weight": 27,
        "strand": "business-management",
        "noteZh": "2 個個案研究"
      },
      {
        "paper": "2B",
        "section": "C",
        "kinds": [
          "essay"
        ],
        "weight": 15,
        "choice": "兩題選一",
        "strand": "business-management"
      }
    ],
    "electives": [
      {
        "kind": "strand",
        "choose": 1,
        "of": 2,
        "source": "/DocLibrary/HKDSE/Subject_Information/bafs/2027hkdse-e-bafs.pdf",
        "units": [
          {
            "id": "accounting",
            "en": "Accounting",
            "zh": "會計"
          },
          {
            "id": "business-management",
            "en": "Business Management",
            "zh": "商業管理"
          }
        ]
      }
    ],
    "framework": "bafs/2027hkdse-e-bafs.pdf",
    "pages": "1-2",
    "verifiedOn": "2026-09-26"
  },
  "ict": {
    "paperWeights": {
      "1": 55,
      "2": 25
    },
    "sbaPct": 20,
    "sections": [
      {
        "paper": "1",
        "section": "A",
        "kinds": [
          "mc"
        ],
        "weight": 22
      },
      {
        "paper": "1",
        "section": "B",
        "kinds": [
          "short",
          "structured"
        ],
        "weight": 33
      },
      {
        "paper": "2",
        "kinds": [
          "short",
          "structured"
        ],
        "weight": 25,
        "choice": "三個選修選二",
        "elective": true
      }
    ],
    "electives": [
      {
        "kind": "units",
        "choose": 2,
        "of": 3,
        "source": "/DocLibrary/HKDSE/Subject_Information/ict/2027hkdse-e-ict.pdf",
        "units": [
          {
            "id": "databases",
            "en": "Databases"
          },
          {
            "id": "web-application-development",
            "en": "Web Application Development"
          },
          {
            "id": "algorithm-and-programming",
            "en": "Algorithm and Programming"
          }
        ]
      }
    ],
    "framework": "ict/2027hkdse-e-ict.pdf",
    "pages": "1-2",
    "verifiedOn": "2026-09-26"
  },
  "geography": {
    "paperWeights": {
      "1": 75,
      "2": 25
    },
    "sbaPct": 0,
    "sections": [
      {
        "paper": "1",
        "section": "A",
        "kinds": [
          "mc"
        ],
        "weight": 20
      },
      {
        "paper": "1",
        "section": "B",
        "kinds": [
          "fieldwork"
        ],
        "weight": 15,
        "noteZh": "2027 考核單元：Changing Industrial Location、Managing Coastal Environment、Building a Sustainable City"
      },
      {
        "paper": "1",
        "section": "C",
        "kinds": [
          "data-skill-structured"
        ],
        "weight": 30,
        "choice": "四題選二"
      },
      {
        "paper": "1",
        "section": "D",
        "kinds": [
          "short-essay"
        ],
        "weight": 10,
        "choice": "三題選一"
      },
      {
        "paper": "2",
        "section": "E",
        "kinds": [
          "data-skill-structured"
        ],
        "weight": 15,
        "choice": "四題選一",
        "elective": true
      },
      {
        "paper": "2",
        "section": "F",
        "kinds": [
          "short-essay"
        ],
        "weight": 10,
        "choice": "四題選一",
        "elective": true
      }
    ],
    "electives": [
      {
        "kind": "units",
        "choose": 2,
        "of": 4,
        "source": "https://www.edb.gov.hk/attachment/en/curriculum-development/kla/pshe/Geography%20C&A%20Guide%202022-eng.pdf",
        "units": [
          {
            "id": "dynamic-earth-the-building-of-hong-kong",
            "en": "Dynamic Earth: the building of Hong Kong"
          },
          {
            "id": "weather-and-climate",
            "en": "Weather and Climate"
          },
          {
            "id": "transport-development-planning-and-management",
            "en": "Transport Development, Planning and Management"
          },
          {
            "id": "regional-study-of-zhujiang-pearl-river-delta",
            "en": "Regional Study of Zhujiang (Pearl River) Delta"
          }
        ]
      }
    ],
    "framework": "geog/2027hkdse-e-geog-rev.pdf",
    "pages": "2-3",
    "verifiedOn": "2026-09-26"
  },
  "history": {
    "paperWeights": {
      "1": 60,
      "2": 40
    },
    "sbaPct": 0,
    "sections": [
      {
        "paper": "1",
        "kinds": [
          "data-based"
        ],
        "weight": 60,
        "noteZh": "全部必答；資料包括文字、統計、地圖、漫畫、照片"
      },
      {
        "paper": "2",
        "kinds": [
          "essay"
        ],
        "weight": 40,
        "choice": "七題選二"
      }
    ],
    "framework": "hist/2027hkdse-e-hist.pdf",
    "pages": "1",
    "verifiedOn": "2026-09-26"
  },
  "chinese-history": {
    "paperWeights": {
      "1": 70,
      "2": 30
    },
    "sbaPct": 0,
    "sections": [
      {
        "paper": "1",
        "section": "必答題",
        "kinds": [
          "data-based"
        ],
        "weight": 31.11,
        "derived": true,
        "noteZh": "40 分，提供多項資料"
      },
      {
        "paper": "1",
        "section": "甲部、乙部",
        "kinds": [
          "unknown"
        ],
        "weight": 38.89,
        "derived": true,
        "choice": "甲、乙部各三題選一",
        "noteZh": "50 分；大綱未列明題型"
      },
      {
        "paper": "2",
        "kinds": [
          "unknown"
        ],
        "weight": 30,
        "choice": "六個單元選一，答兩題",
        "elective": true,
        "noteZh": "大綱未列明題型"
      }
    ],
    "electives": [
      {
        "kind": "units",
        "choose": 1,
        "of": 6,
        "source": "https://www.edb.gov.hk/tc/curriculum-development/kla/pshe/references-and-resources/chinese-history/support-materials-elective-part.html",
        "units": [
          {
            "id": "chist-20c-culture",
            "zh": "二十世紀中國傳統文化的發展：承傳與轉變"
          },
          {
            "id": "chist-region-resources",
            "zh": "地域與資源運用"
          },
          {
            "id": "chist-intellectuals",
            "zh": "時代與知識分子"
          },
          {
            "id": "chist-institutions",
            "zh": "制度與政治演變"
          },
          {
            "id": "chist-religion-exchange",
            "zh": "宗教傳播與文化交流"
          },
          {
            "id": "chist-women",
            "zh": "女性社會地位：傳統與變遷"
          }
        ]
      }
    ],
    "framework": "chist/2027hkdse-c-chist.pdf",
    "pages": "1-2",
    "verifiedOn": "2026-09-26"
  },
  "chinese-literature": {
    "paperWeights": {
      "1": 25,
      "2": 60
    },
    "sbaPct": 15,
    "sections": [
      {
        "paper": "1",
        "kinds": [
          "literary-creation"
        ],
        "weight": 25,
        "choice": "兩題選一"
      },
      {
        "paper": "2",
        "kinds": [
          "appreciation"
        ],
        "weight": 60,
        "choice": "四題選二",
        "noteZh": "結合指定作品與課外作品"
      }
    ],
    "framework": "clit/2027hkdse-c-clit.pdf",
    "pages": "1",
    "verifiedOn": "2026-09-26"
  },
  "english-literature": {
    "paperWeights": {
      "1": 50,
      "2": 30
    },
    "sbaPct": 20,
    "sections": [
      {
        "paper": "1",
        "kinds": [
          "essay"
        ],
        "weight": 50,
        "noteZh": "小說、戲劇各一題，短篇小說比較一題"
      },
      {
        "paper": "2",
        "section": "A",
        "kinds": [
          "appreciation"
        ],
        "weight": 10,
        "noteZh": "指定小說或戲劇片段"
      },
      {
        "paper": "2",
        "section": "B",
        "kinds": [
          "appreciation"
        ],
        "weight": 12,
        "noteZh": "指定詩作"
      },
      {
        "paper": "2",
        "section": "C",
        "kinds": [
          "appreciation"
        ],
        "weight": 8,
        "noteZh": "未見過的詩"
      }
    ],
    "framework": "liteng/2027hkdse-e-elit.pdf",
    "pages": "1-2",
    "verifiedOn": "2026-09-26"
  },
  "ethics-religious": {
    "paperWeights": {
      "1": 50,
      "2": 50
    },
    "sbaPct": 0,
    "sections": [
      {
        "paper": "1",
        "section": "A",
        "kinds": [
          "short"
        ],
        "weight": 16.67,
        "derived": true,
        "noteZh": "4–5 條，20 分"
      },
      {
        "paper": "1",
        "section": "B",
        "kinds": [
          "essay",
          "guided-essay"
        ],
        "weight": 33.33,
        "derived": true,
        "choice": "四題選二",
        "noteZh": "40 分"
      },
      {
        "paper": "2",
        "kinds": [
          "essay",
          "guided-essay"
        ],
        "weight": 50,
        "choice": "兩個單元選一",
        "elective": true
      }
    ],
    "electives": [
      {
        "kind": "units",
        "choose": 1,
        "of": 2,
        "source": "/DocLibrary/HKDSE/Subject_Information/ers/2027hkdse-e-ers-rev.pdf",
        "units": [
          {
            "id": "buddhism",
            "en": "Buddhism",
            "zh": "佛教"
          },
          {
            "id": "christianity",
            "en": "Christianity",
            "zh": "基督宗教"
          }
        ]
      }
    ],
    "framework": "ers/2027hkdse-e-ers-rev.pdf",
    "pages": "1-2",
    "verifiedOn": "2026-09-26"
  },
  "ths": {
    "paperWeights": {
      "1": 45,
      "2": 55
    },
    "sbaPct": 0,
    "sections": [
      {
        "paper": "1",
        "section": "A",
        "kinds": [
          "mc"
        ],
        "weight": null,
        "noteZh": "卷一合共 45%，大綱未分列甲乙部比重"
      },
      {
        "paper": "1",
        "section": "B",
        "kinds": [
          "data-based"
        ],
        "weight": null,
        "choice": "三題選二"
      },
      {
        "paper": "2",
        "kinds": [
          "essay"
        ],
        "weight": 55,
        "choice": "五題選三"
      }
    ],
    "framework": "ths/2027hkdse-e-ths.pdf",
    "pages": "1",
    "verifiedOn": "2026-09-26"
  },
  "health-management": {
    "paperWeights": {
      "1": 46,
      "2": 34
    },
    "sbaPct": 20,
    "sections": [
      {
        "paper": "1",
        "section": "A",
        "kinds": [
          "short"
        ],
        "weight": null,
        "noteZh": "卷一合共 46%，大綱未分列甲乙部比重"
      },
      {
        "paper": "1",
        "section": "B",
        "kinds": [
          "structured"
        ],
        "weight": null
      },
      {
        "paper": "2",
        "section": "A",
        "kinds": [
          "short"
        ],
        "weight": null,
        "noteZh": "卷二合共 34%，涵蓋必修及選修部分"
      },
      {
        "paper": "2",
        "section": "B",
        "kinds": [
          "issue-based"
        ],
        "weight": null,
        "choice": "三題選二"
      }
    ],
    "electives": [
      {
        "kind": "units",
        "choose": 2,
        "of": 3,
        "source": "https://www.edb.gov.hk/attachment/en/curriculum-development/kla/technology-edu/curriculum-doc/HMSC_CA_Guide_e_2015.pdf",
        "units": [
          {
            "id": "extended-study-on-health-promotion-and-health-maintenance-services",
            "en": "Extended Study on Health Promotion and Health Maintenance Services"
          },
          {
            "id": "extended-study-on-community-and-social-care-services",
            "en": "Extended Study on Community and Social Care Services"
          },
          {
            "id": "current-issues-of-health-and-social-care",
            "en": "Current Issues of Health and Social Care"
          }
        ]
      }
    ],
    "framework": "hmsc/2027hkdse-e-hmsc.pdf",
    "pages": "1-2",
    "verifiedOn": "2026-09-26"
  },
  "design-tech": {
    "paperWeights": {
      "1": 30,
      "2": 30
    },
    "sbaPct": 40,
    "sections": [
      {
        "paper": "1",
        "section": "A",
        "kinds": [
          "design"
        ],
        "weight": 18,
        "derived": true,
        "noteZh": "一條大型設計題，60 分"
      },
      {
        "paper": "1",
        "section": "B",
        "kinds": [
          "unknown"
        ],
        "weight": 12,
        "derived": true,
        "choice": "三題選二",
        "noteZh": "40 分；大綱只稱「選答題」"
      },
      {
        "paper": "2",
        "kinds": [
          "unknown"
        ],
        "weight": 30,
        "choice": "五個單元選二，每單元答兩題",
        "elective": true,
        "noteZh": "大綱未列明題型"
      }
    ],
    "electives": [
      {
        "kind": "units",
        "choose": 2,
        "of": 5,
        "source": "/DocLibrary/HKDSE/Subject_Information/dat/2027hkdse-e-dat.pdf",
        "units": [
          {
            "id": "automation",
            "en": "Automation"
          },
          {
            "id": "creative-digital-media",
            "en": "Creative Digital Media"
          },
          {
            "id": "design-implementation-and-material-processing",
            "en": "Design Implementation and Material Processing"
          },
          {
            "id": "electronics",
            "en": "Electronics"
          },
          {
            "id": "visualisation-and-cad-modelling",
            "en": "Visualisation and CAD Modelling"
          }
        ]
      }
    ],
    "framework": "dat/2027hkdse-e-dat.pdf",
    "pages": "1-2",
    "verifiedOn": "2026-09-26"
  },
  "technology-living": {
    "paperWeights": {
      "1": 30,
      "2": 40
    },
    "sbaPct": 30,
    "sections": [
      {
        "paper": "1",
        "section": "A",
        "kinds": [
          "mc"
        ],
        "weight": 6.43,
        "derived": true,
        "noteZh": "15 分"
      },
      {
        "paper": "1",
        "section": "B",
        "kinds": [
          "design"
        ],
        "weight": 10.71,
        "derived": true,
        "noteZh": "25 分"
      },
      {
        "paper": "1",
        "section": "C",
        "kinds": [
          "structured"
        ],
        "weight": 12.86,
        "derived": true,
        "noteZh": "30 分"
      },
      {
        "paper": "2",
        "kinds": [
          "short",
          "data-response",
          "essay"
        ],
        "weight": 40,
        "choice": "三個選修單元選二",
        "elective": true
      }
    ],
    "electives": [
      {
        "kind": "strand",
        "choose": 1,
        "of": 2,
        "source": "/DocLibrary/HKDSE/Subject_Information/tnl/2027hkdse-e-tl.pdf",
        "units": [
          {
            "id": "food",
            "en": "Food Science and Technology",
            "zh": "食品科學與科技"
          },
          {
            "id": "fashion",
            "en": "Fashion, Clothing and Textiles",
            "zh": "服裝、成衣與紡織"
          }
        ]
      },
      {
        "kind": "units",
        "strand": "food",
        "choose": 2,
        "of": 3,
        "source": "https://www.edb.gov.hk/attachment/en/curriculum-development/kla/technology-edu/curriculum-doc/TL_CAGuide_e_2015.pdf",
        "units": [
          {
            "id": "food-culture",
            "en": "Food Culture"
          },
          {
            "id": "food-science-and-technology-extended-study",
            "en": "Food Science and Technology Extended Study"
          },
          {
            "id": "food-product-development",
            "en": "Food Product Development"
          }
        ]
      },
      {
        "kind": "units",
        "strand": "fashion",
        "choose": 2,
        "of": 3,
        "source": "https://www.edb.gov.hk/attachment/en/curriculum-development/kla/technology-edu/curriculum-doc/TL_CAGuide_e_2015.pdf",
        "units": [
          {
            "id": "culture-and-fashion-design",
            "en": "Culture and Fashion Design"
          },
          {
            "id": "textiles-and-textile-technology",
            "en": "Textiles and Textile Technology"
          },
          {
            "id": "apparel-industry",
            "en": "Apparel Industry"
          }
        ]
      }
    ],
    "framework": "tnl/2027hkdse-e-tl.pdf",
    "pages": "1-2",
    "verifiedOn": "2026-09-26"
  },
  "music": {
    "paperWeights": {
      "1": 50,
      "2": 30,
      "3": 20
    },
    "sbaPct": 0,
    "sections": [
      {
        "paper": "1",
        "section": "A",
        "kinds": [
          "listening",
          "mc",
          "matching",
          "short",
          "long"
        ],
        "weight": 24,
        "noteZh": "西方古典音樂；須播放音樂片段"
      },
      {
        "paper": "1",
        "section": "B",
        "kinds": [
          "listening",
          "mc",
          "matching",
          "short",
          "long"
        ],
        "weight": 26,
        "noteZh": "中國器樂 12%、粵劇 6%、本地及西方流行音樂 8%"
      },
      {
        "paper": "2",
        "kinds": [
          "performing"
        ],
        "weight": 30
      },
      {
        "paper": "3",
        "kinds": [
          "creating"
        ],
        "weight": 20
      }
    ],
    "framework": "music/2027hkdse-e-music-rev.pdf",
    "pages": "1-3",
    "verifiedOn": "2026-09-26"
  },
  "pe": {
    "paperWeights": {
      "1": 42,
      "2": 18,
      "3": 40
    },
    "sbaPct": 0,
    "sections": [
      {
        "paper": "1",
        "section": "A",
        "kinds": [
          "mc"
        ],
        "weight": null,
        "noteZh": "卷一合共 42%，大綱未分列甲乙部比重"
      },
      {
        "paper": "1",
        "section": "B",
        "kinds": [
          "short"
        ],
        "weight": null
      },
      {
        "paper": "2",
        "kinds": [
          "long"
        ],
        "weight": 18,
        "choice": "三題選二"
      },
      {
        "paper": "3",
        "kinds": [
          "practical"
        ],
        "weight": 40
      }
    ],
    "framework": "pe/2027hkdse-e-pe-rev.pdf",
    "pages": "1-2",
    "verifiedOn": "2026-09-26"
  },
  "visual-arts": {
    "paperWeights": {
      "1/2": 50
    },
    "sbaPct": 50,
    "sections": [
      {
        "paper": "1/2",
        "section": "A",
        "kinds": [
          "appreciation"
        ],
        "weight": 10,
        "noteZh": "卷一或卷二二選一；評賞所提供的作品圖片"
      },
      {
        "paper": "1/2",
        "section": "B",
        "kinds": [
          "art-making"
        ],
        "weight": 40
      }
    ],
    "framework": "va/2027hkdse-e-va.pdf",
    "pages": "1-2",
    "verifiedOn": "2026-09-26"
  }
}
