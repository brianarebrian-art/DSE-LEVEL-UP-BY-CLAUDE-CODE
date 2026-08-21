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
    const [base, gen, param, imported, pbank] = await Promise.all([
      import('./math'), import('./math-generated'), import('./math-parametric'), import('./math-imported'), import('./math-bank'),
    ])
    return [
      ...base.mathQuestions,
      ...gen.mathGeneratedQuestions,
      ...param.mathParametricQuestions,
      ...imported.mathImportedQuestions,
      ...pbank.mathBankQuestions,
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
    const [base, cbank] = await Promise.all([import('./chemistry'), import('./chemistry-bank')])
    return [...base.chemistryQuestions, ...cbank.chemistryBankQuestions]
  },
  biology: async () => (await import('./biology')).biologyQuestions,
  english: async () => {
    const [base, reviewed] = await Promise.all([import('./english'), import('./english-reviewed')])
    return [...base.englishQuestions, ...reviewed.englishReviewedQuestions]
  },
  ict: async () => (await import('./ict')).ictQuestions,
  chinese: async () => {
    // 三個已審核批次各自一個檔案 —— promote-drafts.mjs 屬覆寫而非追加，同一科目
    // 多個批次必須以 `--out` 分檔，否則後一批會覆蓋前一批（2026-08-07 實際發生過）。
    // 新增書寫題批次時：此處要加，`index.ts` 亦要加，否則 loader-parity 測試會失敗。
    const [base, reviewed, p2, fanwenLong] = await Promise.all([
      import('./chinese'),
      import('./chinese-reviewed'),
      import('./chinese-p2-writing'),
      import('./chinese-fanwen-long'),
    ])
    return [
      ...base.chineseQuestions,
      ...reviewed.chineseReviewedQuestions,
      ...p2.chineseP2WritingQuestions,
      ...fanwenLong.chineseFanwenLongQuestions,
    ]
  },
  bafs: async () => {
    const [base, bbank, reviewed] = await Promise.all([import('./bafs'), import('./bafs-bank'), import('./bafs-reviewed')])
    return [...base.bafsQuestions, ...bbank.bafsBankQuestions, ...reviewed.bafsReviewedQuestions]
  },
  economics: async () => {
    const [base, ebank, reviewed] = await Promise.all([
      import('./economics'), import('./economics-bank'), import('./economics-reviewed'),
    ])
    return [...base.economicsQuestions, ...ebank.economicsBankQuestions, ...reviewed.economicsReviewedQuestions]
  },
  geography: async () => (await import('./geography')).geographyQuestions,
  history: async () => (await import('./history')).historyQuestions,
  'chinese-history': async () => (await import('./chinese-history')).chineseHistoryQuestions,
  ths: async () => (await import('./ths')).thsQuestions,
  'health-management': async () => (await import('./health-management')).healthManagementQuestions,
  'design-tech': async () => (await import('./design-tech')).designTechQuestions,
  music: async () => (await import('./music')).musicQuestions,
  pe: async () => (await import('./pe')).peQuestions,
  'chinese-literature': async () => (await import('./chinese-literature')).chineseLiteratureQuestions,
  'english-literature': async () => (await import('./english-literature')).englishLiteratureQuestions,
  'visual-arts': async () => (await import('./visual-arts')).visualArtsQuestions,
  csd: async () => (await import('./csd')).csdQuestions,
  'ethics-religious': async () => (await import('./ethics-religious')).ethicsReligiousQuestions,
  'technology-living': async () => (await import('./technology-living')).technologyLivingQuestions,
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
