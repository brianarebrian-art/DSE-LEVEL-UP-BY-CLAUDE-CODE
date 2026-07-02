import type { Question } from './types'

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

type Loader = () => Promise<Question[]>

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
  english: async () => (await import('./english')).englishQuestions,
  ict: async () => (await import('./ict')).ictQuestions,
  chinese: async () => (await import('./chinese')).chineseQuestions,
  bafs: async () => {
    const [base, bbank] = await Promise.all([import('./bafs'), import('./bafs-bank')])
    return [...base.bafsQuestions, ...bbank.bafsBankQuestions]
  },
  economics: async () => {
    const [base, ebank] = await Promise.all([import('./economics'), import('./economics-bank')])
    return [...base.economicsQuestions, ...ebank.economicsBankQuestions]
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

/**
 * Load one subject's question bank on demand (its own chunk). Returns [] for an
 * unknown subject. Use this from CLIENT components instead of the eager barrel.
 */
export async function loadSubjectQuestions(subjectId: string): Promise<Question[]> {
  const loader = loaders[subjectId]
  if (!loader) return []
  return loader()
}
