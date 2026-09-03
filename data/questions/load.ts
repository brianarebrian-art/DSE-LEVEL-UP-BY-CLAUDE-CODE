import type { AnyQuestion, MCQuestion, Question, WrittenQuestion } from './types'

// ── Lazy, per-subject question loading (code-splitting) ──────────────────────
// The eager barrel in ./index.ts statically imports ALL 25 banks. That is fine on
// the SERVER (subject pages are RSC — server-only, never shipped to the browser),
// but a CLIENT component that imports the barrel would pull every bank into one
// chunk. As banks grow toward ~1000 questions each, that chunk explodes.
//
// So client code (the practice runner) imports from HERE instead. Every entry below
// is a literal dynamic import(), which Webpack splits into its own on-demand chunk:
// practising Maths downloads only the Maths bank, not Biology + 23 others.
//
// To add a newly-generated bank for subject X:
//   1. create data/questions/<x>-generated.ts (the generator does this), and
//   2. merge it in X's loader below (see `math` for the pattern).

type Loader = () => Promise<AnyQuestion[]>

const loaders: Record<string, Loader> = {
  // Maths merges its hand-authored bank with the offline-generated, judge-verified extras.
  math: async () => {
    const [base, gen, param, imported, pbank, p1long, longb1, floor1] = await Promise.all([
      import('./math'), import('./math-generated'), import('./math-parametric'), import('./math-imported'), import('./math-bank'),
      // 卷一書寫題（long）—— brian 2026-08-27 逐題審批。數學科第一批非 MC 題目。
      import('./math-p1-long'), import('./math-long-b1'),
      // 補底 MC —— brian 2026-08-28 逐題審批。五個當時只得 1–2 條的課題各補至 10 條。
      import('./math-floor-batch1'),
    ])
    return [
      ...base.mathQuestions,
      ...gen.mathGeneratedQuestions,
      ...param.mathParametricQuestions,
      ...imported.mathImportedQuestions,
      ...pbank.mathBankQuestions,
      ...p1long.mathP1LongQuestions,
      ...longb1.mathLongB1Questions,
      ...floor1.mathFloorBatch1Questions,
    ]
  },
  m1: async () => {
    const [base, mbank] = await Promise.all([import('./m1'), import('./m1-bank')])
    return [...base.m1Questions, ...mbank.m1BankQuestions]
  },
  m2: async () => {
    const [base, mbank] = await Promise.all([import('./m2'), import('./m2-bank')])
    return [...base.m2Questions, ...mbank.m2BankQuestions]
  },
  physics: async () => {
    const [base, pbank] = await Promise.all([import('./physics'), import('./physics-bank')])
    return [...base.physicsQuestions, ...pbank.physicsBankQuestions]
  },
  chemistry: async () => {
    const [base, cbank, floor1] = await Promise.all([
      import('./chemistry'), import('./chemistry-bank'), import('./chemistry-floor-batch1'),
    ])
    return [...base.chemistryQuestions, ...cbank.chemistryBankQuestions, ...floor1.chemistryFloorBatch1Questions]
  },
  biology: async () => {
    const [base, bank, b2, b3, b4] = await Promise.all([import('./biology'), import('./applied-banks'), import('./biology-floor-b2'), import('./biology-bank'), import('./biology-bank2')])
    return [...base.biologyQuestions, ...bank.biologyBankQuestions, ...bank.biologyBank2Questions, ...b2.biologyFloorB2Questions, ...b3.biologyBank3Questions, ...b4.biologyBank4Questions]
  },
  english: async () => {
    const [base, reviewed, b2] = await Promise.all([import('./english'), import('./english-reviewed'), import('./english-floor-b2')])
    return [...base.englishQuestions, ...reviewed.englishReviewedQuestions, ...b2.englishFloorB2Questions]
  },
  ict: async () => {
    const [base, floor1, bank, b3, b4] = await Promise.all([
      import('./ict'), import('./ict-floor-batch1'), import('./applied-banks'), import('./ict-bank'),
      import('./ict-bank4'),
    ])
    return [...base.ictQuestions, ...floor1.ictFloorBatch1Questions, ...bank.ictBankQuestions, ...bank.ictBank2Questions, ...b3.ictBank3Questions, ...b4.ictBank4Questions]
  },
  chinese: async () => {
    // 三個已審核批次各自一個檔案 —— promote-drafts.mjs 屬覆寫而非追加，同一科目
    // 多個批次必須以 `--out` 分檔，否則後一批會覆蓋前一批（2026-08-07 實際發生過）。
    // 新增書寫題批次時：此處要加，`index.ts` 亦要加，否則 loader-parity 測試會失敗。
    const [base, reviewed, p2, p2b2, p2b3, fanwenLong, floor1] = await Promise.all([
      import('./chinese'),
      import('./chinese-reviewed'),
      import('./chinese-p2-writing'),
      import('./chinese-p2-writing-batch2'),
      import('./chinese-p2-writing-batch3'),
      import('./chinese-fanwen-long'),
      // 補底 MC —— brian 2026-08-28 逐題審批。五個當時只得 2–7 條的課題各補至 10 條。
      import('./chinese-floor-batch1'),
    ])
    return [
      ...base.chineseQuestions,
      ...reviewed.chineseReviewedQuestions,
      ...p2.chineseP2WritingQuestions,
      ...p2b2.chineseP2WritingBatch2Questions,
      ...p2b3.chineseP2WritingBatch3Questions,
      ...fanwenLong.chineseFanwenLongQuestions,
      ...floor1.chineseFloorBatch1Questions,
    ]
  },
  bafs: async () => {
    const [base, bbank, reviewed] = await Promise.all([import('./bafs'), import('./bafs-bank'), import('./bafs-reviewed')])
    return [...base.bafsQuestions, ...bbank.bafsBankQuestions, ...reviewed.bafsReviewedQuestions]
  },
  economics: async () => {
    const [base, ebank, reviewed, floor1, floor2] = await Promise.all([
      import('./economics'), import('./economics-bank'), import('./economics-reviewed'),
      import('./economics-floor-batch1'), import('./economics-floor-batch2'),
    ])
    return [...base.economicsQuestions, ...ebank.economicsBankQuestions, ...reviewed.economicsReviewedQuestions,
      ...floor1.economicsFloorBatch1Questions, ...floor2.economicsFloorBatch2Questions]
  },
  geography: async () => {
    const [base, bank, b2, b3, b4] = await Promise.all([import('./geography'), import('./applied-banks'), import('./geography-floor-b2'), import('./geography-bank'), import('./geography-bank3')])
    return [...base.geographyQuestions, ...bank.geographyBankQuestions, ...b2.geographyFloorB2Questions, ...b3.geographyBank2Questions, ...b4.geographyBank3Questions]
  },
  history: async () => {
    // 卷二論述題（long）—— brian 2026-08-27 逐題審批，38 條 / 950 分。
    // 補底 MC —— brian 2026-08-28 逐題審批。六個當時只得 1–4 條的課題各補至 10 條。
    const [base, essays, floor1] = await Promise.all([
      import('./history'), import('./history-p2-essays'), import('./history-floor-batch1'),
    ])
    return [...base.historyQuestions, ...essays.historyP2EssaysQuestions, ...floor1.historyFloorBatch1Questions]
  },
  'chinese-history': async () => {
    const [base, b2] = await Promise.all([import('./chinese-history'), import('./chinese-history-floor-b2')])
    return [...base.chineseHistoryQuestions, ...b2.chineseHistoryFloorB2Questions]
  },
  ths: async () => {
    const [base, bank, b2, b3] = await Promise.all([import('./ths'), import('./applied-banks'), import('./ths-floor-b2'), import('./ths-bank')])
    return [...base.thsQuestions, ...bank.thsBankQuestions, ...bank.thsBank2Questions, ...b2.thsFloorB2Questions, ...b3.thsBank3Questions]
  },
  'health-management': async () => {
    const [base, floor1] = await Promise.all([
      import('./health-management'), import('./health-management-floor-batch1'),
    ])
    const b2 = await import('./health-management-bank')
    const b3 = await import('./health-management-bank2')
    return [...base.healthManagementQuestions, ...floor1.healthManagementFloorBatch1Questions, ...(await import('./applied-banks')).healthManagementBankQuestions, ...b2.healthManagementBank2Questions, ...b3.healthManagementBank3Questions]
  },
  'design-tech': async () => {
    const [base, bank, b2, b3, b4] = await Promise.all([import('./design-tech'), import('./applied-banks'), import('./design-tech-floor-b2'), import('./design-tech-bank'), import('./design-tech-bank2')])
    return [...base.designTechQuestions, ...bank.designTechBankQuestions, ...bank.designTechBank2Questions, ...b2.designTechFloorB2Questions, ...b3.designTechBank3Questions, ...b4.designTechBank4Questions]
  },
  music: async () => {
    const [base, bank, b2, b3, b4] = await Promise.all([import('./music'), import('./applied-banks'), import('./music-floor-b2'), import('./music-bank'), import('./music-bank2')])
    return [...base.musicQuestions, ...bank.musicBankQuestions, ...bank.musicBank2Questions, ...b2.musicFloorB2Questions, ...b3.musicBank3Questions, ...b4.musicBank4Questions]
  },
  pe: async () => {
    const [base, bank, b2, b3, b4] = await Promise.all([import('./pe'), import('./applied-banks'), import('./pe-floor-b2'), import('./pe-bank'), import('./pe-bank2')])
    return [...base.peQuestions, ...bank.peBankQuestions, ...bank.peBank2Questions, ...b2.peFloorB2Questions, ...b3.peBank3Questions, ...b4.peBank4Questions]
  },
  'chinese-literature': async () => {
    const [base, b2] = await Promise.all([import('./chinese-literature'), import('./chinese-literature-floor-b2')])
    return [...base.chineseLiteratureQuestions, ...b2.chineseLiteratureFloorB2Questions]
  },
  'english-literature': async () => {
    const [base, b2] = await Promise.all([import('./english-literature'), import('./english-literature-floor-b2')])
    return [...base.englishLiteratureQuestions, ...b2.englishLiteratureFloorB2Questions]
  },
  'visual-arts': async () => {
    const [base, b2, b3] = await Promise.all([import('./visual-arts'), import('./visual-arts-floor-b2'), import('./visual-arts-bank')])
    return [...base.visualArtsQuestions, ...b2.visualArtsFloorB2Questions, ...b3.visualArtsBank2Questions]
  },
  csd: async () => {
    const [base, reviewed, b2] = await Promise.all([import('./csd'), import('./csd-reviewed'), import('./csd-floor-b2')])
    return [...base.csdQuestions, ...reviewed.csdReviewedQuestions, ...b2.csdFloorB2Questions]
  },
  'ethics-religious': async () => {
    const [base, b2] = await Promise.all([import('./ethics-religious'), import('./ethics-religious-floor-b2')])
    return [...base.ethicsReligiousQuestions, ...b2.ethicsReligiousFloorB2Questions]
  },
  'technology-living': async () => {
    const [base, bank, b2, b3, b4] = await Promise.all([import('./technology-living'), import('./applied-banks'), import('./technology-living-floor-b2'), import('./technology-living-bank'), import('./technology-living-bank2')])
    return [...base.technologyLivingQuestions, ...bank.technologyLivingBankQuestions, ...bank.technologyLivingBank2Questions, ...b2.technologyLivingFloorB2Questions, ...b3.technologyLivingBank3Questions, ...b4.technologyLivingBank4Questions]
  },
}

// ── 機器閘放行題（auto-gate）──────────────────────────────────────────────
// 由 scripts/qbank/auto-promote.mts 自動入庫的批次，每科一個檔案。
//
// 為何不直接寫進上方各科的 loader：上方每個 loader 的寫法並不一致（有單行式、
// 有 Promise.all 區塊、有四個 bank 合併），腳本每次都要針對不同形狀動手術，
// 改錯一次即會令整科題目消失。此處改為獨立註冊表 —— 新增批次只需插入一行，
// 上方的 loader 完全不必改動。
//
// ⚠️ 此類題目【並無實名逐題審批紀錄】。前端 QuestionProvenance 會如實顯示
//    「經自動檢查 …本題未有實名逐題審批紀錄」，不會假稱經人手審批。
//    經真人審批的批次走的是另一條路（promote-drafts.mjs → *-reviewed.ts），
//    兩條路不可混用。
const autoLoaders: Record<string, Loader> = {
  'physics': async () => (await import('./physics-auto')).physicsAutoQuestions,
  'm1': async () => (await import('./m1-auto')).m1AutoQuestions,
  'm2': async () => (await import('./m2-auto')).m2AutoQuestions,
  'bafs': async () => (await import('./bafs-auto')).bafsAutoQuestions,
  'economics': async () => (await import('./economics-auto')).economicsAutoQuestions,
  'chemistry': async () => (await import('./chemistry-auto')).chemistryAutoQuestions,
  'chinese': async () => (await import('./chinese-auto')).chineseAutoQuestions,
  'english': async () => (await import('./english-auto')).englishAutoQuestions,
  'geography': async () => (await import('./geography-auto')).geographyAutoQuestions,
  'ethics-religious': async () => (await import('./ethics-religious-auto')).ethicsReligiousAutoQuestions,
  'technology-living': async () => (await import('./technology-living-auto')).technologyLivingAutoQuestions,
  'english-literature': async () => (await import('./english-literature-auto')).englishLiteratureAutoQuestions,
  'history': async () => (await import('./history-auto')).historyAutoQuestions,
  'chinese-literature': async () => (await import('./chinese-literature-auto')).chineseLiteratureAutoQuestions,
  'chinese-history': async () => (await import('./chinese-history-auto')).chineseHistoryAutoQuestions,
}

/**
 * Load one subject's question bank on demand (its own chunk). Returns [] for an
 * unknown subject. Use this from CLIENT components instead of the eager barrel.
 *
 * 回傳混合題型（MC + 書寫題）。呼叫者一般應使用下方兩個收窄版本之一 ——
 * 直接取用全部題目通常並不正確，因為兩類題目走完全不同的批改流程。
 */
export async function loadSubjectQuestions(subjectId: string): Promise<AnyQuestion[]> {
  const loader = loaders[subjectId]
  const auto = autoLoaders[subjectId]
  if (!loader && !auto) return []
  const [base, extra] = await Promise.all([loader ? loader() : [], auto ? auto() : []])
  return extra.length ? [...base, ...extra] : base
}

/** 只取 MC。標準 20 題練習流程專用（讀 options／correctIndex）。 */
export async function loadSubjectMCQuestions(subjectId: string): Promise<MCQuestion[]> {
  return (await loadSubjectQuestions(subjectId)).filter((q): q is MCQuestion => q.type === 'mc')
}

/**
 * 只取書寫題（text／long）。獨立 `?mode=long` 練習專用。
 * 此類題目【永不由機器批改】，亦不計入客觀準確率與等級預測（決策 ①）。
 */
export async function loadWrittenQuestions(subjectId: string): Promise<WrittenQuestion[]> {
  return (await loadSubjectQuestions(subjectId)).filter(
    (q): q is WrittenQuestion => q.type === 'text' || q.type === 'long',
  )
}

// `Question` 仍由上方 loaders 的回傳值隱式使用（各 bank 檔導出 Question[]），
// 故保留該 import；此行僅為避免日後讀者誤以為它是無用 import。
export type { Question }
