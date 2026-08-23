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
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'physics', hasMC: true, mcWeightPct: 21,
    difficultyGradient: '大綱未就 MC 內部再分難度段；卷一甲部 MC 佔全科 21%，乙部短題／結構題／論述題佔 39%。', formats: ['mc', 'structured', 'long'],
    papersZh: '卷一 甲部 多項選擇題、乙部 結構式問題；卷二 選修部分（含多項選擇題與結構式問題）',
    papersEn: 'Paper 1 Section A multiple-choice + Section B structured; Paper 2 electives (MC + structured)',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'chemistry', hasMC: true, mcWeightPct: 18,
    difficultyGradient: '卷一甲、乙兩部各再分 Part I（主要考課題 I–VIII）與 Part II（主要考課題 IX–XII）—— 分段依課程範圍而非難度。MC 佔全科 18%。', formats: ['mc', 'structured', 'long'],
    papersZh: '卷一 甲部 多項選擇題、乙部 結構式及論述題；卷二 選修部分',
    papersEn: 'Paper 1 Section A multiple-choice + Section B structured/essay; Paper 2 electives',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'biology', hasMC: true, mcWeightPct: 18,
    difficultyGradient: '大綱未就 MC 內部再分難度段；卷一甲部 MC 佔全科 18%，乙部短題／結構題／論述題佔 42%。', formats: ['mc', 'structured', 'long'],
    papersZh: '卷一 甲部 多項選擇題、乙部 短題目及論述題；卷二 選修部分',
    papersEn: 'Paper 1 Section A multiple-choice + Section B short/essay; Paper 2 electives',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'economics', hasMC: true, mcWeightPct: 30,
    difficultyGradient: '大綱未就 MC 內部再分難度段，但明文要求試題兼顧「基礎與選定範疇的知識及分析能力」與「高階思維技巧」。卷一全卷 MC 佔全科 30%。', formats: ['mc', 'short', 'structured', 'essay'],
    papersZh: '卷一 全卷多項選擇題 30%；卷二 甲部 短題目、乙部 結構式／論述題',
    papersEn: 'Paper 1 all multiple-choice 30%; Paper 2 Section A short questions + Section B structured/essay',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'bafs', hasMC: true, mcWeightPct: 17,
    difficultyGradient: '卷一甲部 24 條 MC 佔全科 17%，乙部 3 條短題佔 8%；會計與商業管理兩個選修組別的共同課題會出同一批題目。', formats: ['mc', 'short', 'structured', 'long'],
    papersZh: '卷一 24 條多項選擇題及短題目；卷二 選修部分（會計／商業管理）結構式及長題目',
    papersEn: 'Paper 1 24 multiple-choice + short questions; Paper 2 elective (Accounting / Business Mgmt) structured & long',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'ict', hasMC: true, mcWeightPct: 22,
    difficultyGradient: '卷一甲部 MC 佔全科 22%，乙部短題與結構題佔 33%；MC 只考必修部分。', formats: ['mc', 'short', 'structured'],
    papersZh: '卷一 甲部 多項選擇題、乙部 短題目及結構式問題；卷二 選修單元',
    papersEn: 'Paper 1 Section A multiple-choice + Section B short/structured; Paper 2 elective module',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'geography', hasMC: true,
    difficultyGradient: '卷一甲部 MC 涵蓋必修部分【任何】課題，建議作答時間約 30 分鐘；其餘為實地考察題、資料／技能題及短論述題。', formats: ['mc', 'structured', 'essay'],
    papersZh: '卷一 甲部 多項選擇題（涵蓋必修任何課題）、乙部 資料回應及結構式問題；卷二 選修議題',
    papersEn: 'Paper 1 Section A multiple-choice (any compulsory topic) + Section B data-response/structured; Paper 2 elective issues',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'pe', hasMC: true,
    difficultyGradient: '卷一甲部 MC、乙部短題；卷二為 3 條長題目選答 2 條；卷三為實習考試。', formats: ['mc', 'structured', 'essay'],
    papersZh: '卷一 甲部 多項選擇題、乙部 結構式問題；卷二 選修部分',
    papersEn: 'Paper 1 Section A multiple-choice + Section B structured; Paper 2 electives',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'ths', hasMC: true,
    difficultyGradient: '卷一甲部為 MC、乙部為資料回應題（3 選 2），卷一合共佔全科 45%；卷二為 5 條論述題選答 3 條，佔 55%。', formats: ['mc', 'structured'],
    papersZh: '卷一 甲部 多項選擇題、乙部 資料回應題（3 選 2）',
    papersEn: 'Paper 1 Section A multiple-choice + Section B data-based (answer 2 of 3)',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'technology-living', hasMC: true,
    difficultyGradient: '卷一分三部：甲部 MC 15 分、乙部設計題 25 分、丙部結構題 30 分 —— MC 只佔卷一約五分之一。', formats: ['mc', 'short', 'structured'],
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
    subject: 'csd', hasMC: true,
    difficultyGradient: '只設一卷資料回應題，可用多種題型（多項選擇題、短題目、短文論述題）。成績只分「達標／未達標」。', formats: ['mc', 'short', 'essay', 'structured'],
    papersZh: '設不同題型，包括多項選擇題、短題目、短文論述題等',
    papersEn: 'Various question types are set, including multiple-choice, short questions and short essay questions',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'chinese', hasMC: true,
    difficultyGradient: '卷一閱讀能力：甲部指定文言經典佔全卷 30%、乙部課外篇章佔 70%；設題方式包括問答、選擇、填表、填充 —— 選擇題只是其中一種。', formats: ['mc', 'short', 'fill_in', 'essay'],
    papersZh: '卷一 閱讀能力 40%：甲部 指定文言經典（佔全卷 30%）、乙部 課外篇章（70%）；設題方式包括問答、選擇、填表、填充。卷二 寫作能力 45%：甲部 實用寫作（佔全卷 30%）、乙部 命題寫作（70%）',
    papersEn: 'Paper 1 Reading 40%: Part A set classical texts (30% of paper), Part B unseen passages (70%); question types include short answer, multiple-choice, table completion and gap filling. Paper 2 Writing 45%: Part A practical writing (30%), Part B essay writing (70%)',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },
  {
    subject: 'english', hasMC: true,
    difficultyGradient: 'Paper 1 Reading 分 Part A（必答）與 Part B1／B2 二擇一：**B1 較淺、B2 較深**，只做 A+B1 者最高只能取得第 4 級。這是全 DSE 之中最明文的難度分流設計。', formats: ['mc', 'short', 'essay', 'listening', 'oral'],
    papersZh: 'Paper 1 閱讀 20%（Part A 必答；Part B1 較淺 / B2 較深二選一）；Paper 2 寫作 25%；Paper 3 聆聽及綜合能力 30%；Paper 4 說話 10%',
    papersEn: 'Paper 1 Reading 20% (Part A compulsory; choose Part B1 easier or B2 harder); Paper 2 Writing 25%; Paper 3 Listening & Integrated Skills 30%; Paper 4 Speaking 10%',
    verifiedOn: '2026-08-21', frameworkYear: 2026,
  },

  // ── 真實卷面【冇】MC ────────────────────────────────────────────────────
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
