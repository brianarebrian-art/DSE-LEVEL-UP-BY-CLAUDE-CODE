// ============================================================================
// data/dse-paper-formats.ts
// 每一科【真實 DSE 卷面結構】的事實清單。
// ----------------------------------------------------------------------------
// 來源：香港考試及評核局 2026 年（英國語文學／中國文學等按實際最新年份）
// 「評核大綱 / Assessment Framework」PDF，2026-08-21 逐科下載核對。
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
    subject: 'math', hasMC: true, formats: ['mc', 'long'],
    papersZh: '卷一 傳統題 65%（2¼ 小時）；卷二 全卷多項選擇題 35%（1¼ 小時）',
    papersEn: 'Paper 1 conventional questions 65% (2¼ h); Paper 2 all multiple-choice 35% (1¼ h)',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'physics', hasMC: true, formats: ['mc', 'structured', 'long'],
    papersZh: '卷一 甲部 多項選擇題、乙部 結構式問題；卷二 選修部分（含多項選擇題與結構式問題）',
    papersEn: 'Paper 1 Section A multiple-choice + Section B structured; Paper 2 electives (MC + structured)',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'chemistry', hasMC: true, formats: ['mc', 'structured', 'long'],
    papersZh: '卷一 甲部 多項選擇題、乙部 結構式及論述題；卷二 選修部分',
    papersEn: 'Paper 1 Section A multiple-choice + Section B structured/essay; Paper 2 electives',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'biology', hasMC: true, formats: ['mc', 'structured', 'long'],
    papersZh: '卷一 甲部 多項選擇題、乙部 短題目及論述題；卷二 選修部分',
    papersEn: 'Paper 1 Section A multiple-choice + Section B short/essay; Paper 2 electives',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'economics', hasMC: true, formats: ['mc', 'short', 'structured', 'essay'],
    papersZh: '卷一 全卷多項選擇題 30%；卷二 甲部 短題目、乙部 結構式／論述題',
    papersEn: 'Paper 1 all multiple-choice 30%; Paper 2 Section A short questions + Section B structured/essay',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'bafs', hasMC: true, formats: ['mc', 'short', 'structured', 'long'],
    papersZh: '卷一 24 條多項選擇題及短題目；卷二 選修部分（會計／商業管理）結構式及長題目',
    papersEn: 'Paper 1 24 multiple-choice + short questions; Paper 2 elective (Accounting / Business Mgmt) structured & long',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'ict', hasMC: true, formats: ['mc', 'short', 'structured'],
    papersZh: '卷一 甲部 多項選擇題、乙部 短題目及結構式問題；卷二 選修單元',
    papersEn: 'Paper 1 Section A multiple-choice + Section B short/structured; Paper 2 elective module',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'geography', hasMC: true, formats: ['mc', 'structured', 'essay'],
    papersZh: '卷一 甲部 多項選擇題（涵蓋必修任何課題）、乙部 資料回應及結構式問題；卷二 選修議題',
    papersEn: 'Paper 1 Section A multiple-choice (any compulsory topic) + Section B data-response/structured; Paper 2 elective issues',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'pe', hasMC: true, formats: ['mc', 'structured', 'essay'],
    papersZh: '卷一 甲部 多項選擇題、乙部 結構式問題；卷二 選修部分',
    papersEn: 'Paper 1 Section A multiple-choice + Section B structured; Paper 2 electives',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'ths', hasMC: true, formats: ['mc', 'structured'],
    papersZh: '卷一 甲部 多項選擇題、乙部 資料回應題（3 選 2）',
    papersEn: 'Paper 1 Section A multiple-choice + Section B data-based (answer 2 of 3)',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'technology-living', hasMC: true, formats: ['mc', 'short', 'structured'],
    papersZh: '卷一 必修部分：甲部 多項選擇題（佔卷一 15%）、乙部及丙部 短題目與結構式問題；卷二 選修部分',
    papersEn: 'Paper 1 compulsory: Section A multiple-choice (15% of paper) + Sections B/C short & structured; Paper 2 elective',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'music', hasMC: true, formats: ['mc', 'listening', 'short', 'practical'],
    papersZh: '聆聽卷設多項選擇題、配對題及長短題；另設創作卷與演奏卷',
    papersEn: 'Listening paper uses multiple-choice, matching and long/short questions; plus composing and performing papers',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'csd', hasMC: true, formats: ['mc', 'short', 'essay', 'structured'],
    papersZh: '設不同題型，包括多項選擇題、短題目、短文論述題等',
    papersEn: 'Various question types are set, including multiple-choice, short questions and short essay questions',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'chinese', hasMC: true, formats: ['mc', 'short', 'fill_in', 'essay'],
    papersZh: '卷一 閱讀能力 40%：甲部 指定文言經典（佔全卷 30%）、乙部 課外篇章（70%）；設題方式包括問答、選擇、填表、填充。卷二 寫作能力 45%：甲部 實用寫作（佔全卷 30%）、乙部 命題寫作（70%）',
    papersEn: 'Paper 1 Reading 40%: Part A set classical texts (30% of paper), Part B unseen passages (70%); question types include short answer, multiple-choice, table completion and gap filling. Paper 2 Writing 45%: Part A practical writing (30%), Part B essay writing (70%)',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'english', hasMC: true, formats: ['mc', 'short', 'essay', 'listening', 'oral'],
    papersZh: 'Paper 1 閱讀 20%（Part A 必答；Part B1 較淺 / B2 較深二選一）；Paper 2 寫作 25%；Paper 3 聆聽及綜合能力 30%；Paper 4 說話 10%',
    papersEn: 'Paper 1 Reading 20% (Part A compulsory; choose Part B1 easier or B2 harder); Paper 2 Writing 25%; Paper 3 Listening & Integrated Skills 30%; Paper 4 Speaking 10%',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },

  // ── 真實卷面【冇】MC ────────────────────────────────────────────────────
  {
    subject: 'm1', hasMC: false, formats: ['long'],
    papersZh: '單卷傳統題，佔本單元 100%（2½ 小時）—— 全卷冇多項選擇題',
    papersEn: 'One paper of conventional questions, 100% (2½ h) — no multiple-choice at all',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'm2', hasMC: false, formats: ['long'],
    papersZh: '單卷傳統題，佔本單元 100%（2½ 小時）—— 全卷冇多項選擇題',
    papersEn: 'One paper of conventional questions, 100% (2½ h) — no multiple-choice at all',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'history', hasMC: false, formats: ['structured', 'essay'],
    papersZh: '卷一 資料題 60%（2 小時，全部必答，資料包括文字、統計、地圖、漫畫、照片）；卷二 論述題 40%（1½ 小時，七題選答兩題）—— 全卷冇多項選擇題',
    papersEn: 'Paper 1 data-based questions 60% (2 h, all compulsory; written sources, statistics, maps, cartoons, photographs); Paper 2 seven essay-type questions, attempt any TWO, 40% (1½ h) — no multiple-choice at all',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'chinese-history', hasMC: false, formats: ['structured', 'essay'],
    papersZh: '卷一 歷代發展 70%（2 小時 15 分）：必答題 40 分（提供多項資料）＋ 甲部、乙部各 3 題各選 1 題共 50 分；卷二 歷史專題 30%（1 小時 20 分）：6 單元，每單元 3 題，選 1 單元答 2 題共 50 分 —— 全卷冇多項選擇題',
    papersEn: 'Paper 1 Dynastic Development 70% (2h15): compulsory data-rich question 40 marks + one of three from each of Parts A and B, 50 marks; Paper 2 Themes 30% (1h20): 6 units × 3 questions, answer 2 from one unit, 50 marks — no multiple-choice at all',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'chinese-literature', hasMC: false, formats: ['essay', 'structured'],
    papersZh: '卷一 文學創作 25%（2 小時，兩題選一，作文一篇）；卷二 文學賞析 60%（2 小時，四題選二，結合指定作品與課外作品設問）—— 全卷冇多項選擇題',
    papersEn: 'Paper 1 Literary Creation 25% (2 h, one of two questions); Paper 2 Literary Appreciation 60% (2 h, two of four questions on set and unseen texts) — no multiple-choice at all',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'english-literature', hasMC: false, formats: ['essay', 'structured'],
    papersZh: 'Paper 1 論文寫作 50%（3 小時，小說／戲劇／短篇小說比較各一題）；Paper 2 賞析 30%（2 小時，指定篇章、指定詩作、未見過詩作）—— 全卷冇多項選擇題',
    papersEn: 'Paper 1 Essay Writing 50% (3 h: one novel, one play, one comparative short-story question); Paper 2 Appreciation 30% (2 h: set passage, set poems, unseen poem) — no multiple-choice at all',
    verifiedOn: '2026-08-21', frameworkYear: 2027,
  },
  {
    subject: 'ethics-religious', hasMC: false, formats: ['short', 'essay'],
    papersZh: '卷一 倫理學 50%（1 小時 45 分）：甲部 規範倫理 4–5 條短題目（必答）＋ 乙部 個人及社會議題 4 題選 2（論述題及引導式論述題）；卷二 宗教傳統 50%（論述題及引導式論述題）—— 全卷冇多項選擇題',
    papersEn: 'Paper 1 Ethics 50% (1h45): Part A Normative Ethics 4–5 compulsory short questions + Part B Personal & Social Issues, 2 of 4 essay / guided-essay questions; Paper 2 Religious Traditions 50% (essay and guided-essay) — no multiple-choice at all',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'health-management', hasMC: false, formats: ['short', 'structured', 'essay'],
    papersZh: '卷一 必修部分 46%（2 小時）：甲部 短題目（必答）、乙部 結構式／論述題；卷二 必修及選修 34%（1¾ 小時）：甲部 短題目、乙部 結構式／論述題 —— 全卷冇多項選擇題',
    papersEn: 'Paper 1 compulsory part 46% (2 h): Section A short questions + Section B structured/essay; Paper 2 compulsory + elective 34% (1¾ h): same shape — no multiple-choice at all',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'design-tech', hasMC: false, formats: ['structured', 'practical', 'essay'],
    papersZh: '卷一 必修 30%（2 小時）：甲部 一條大型設計題（60 分）、乙部 結構式問題；卷二 選修 30%（2 小時，五個單元選二）—— 全卷冇多項選擇題',
    papersEn: 'Paper 1 compulsory 30% (2 h): Section A one major design question (60 marks) + Section B structured; Paper 2 elective 30% (2 h, two of five modules) — no multiple-choice at all',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'visual-arts', hasMC: false, formats: ['essay', 'practical'],
    papersZh: '卷一 主題演繹 或 卷二 設計（二選一，4 小時）：甲部 藝術／設計評賞（45 分鐘，就所提供作品圖片撰寫評賞）、乙部 藝術創作／設計（3 小時 15 分）—— 全卷冇多項選擇題',
    papersEn: 'Choose Paper 1 (Visual Presentation of a Theme) or Paper 2 (Design), 4 h: Part A critical appreciation of provided reproductions (45 min) + Part B art-making / design (3h15) — no multiple-choice at all',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
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
