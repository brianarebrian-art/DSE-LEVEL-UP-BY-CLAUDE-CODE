// ⚠️ 由 scripts/gen-study-notes.mts 產生 —— 請勿手動修改。
// 人手覆寫：data/notes/overrides.ts
import type { StudyNote } from './types'

export const STUDY_NOTE_SUBJECT_IDS = ["math","m2","m1","physics","chemistry","biology","english","chinese","bafs","ict","economics","csd","chinese-history","history","geography","chinese-literature","english-literature","ethics-religious","ths","health-management","design-tech","visual-arts","music","pe","technology-living"] as const

type Loader = () => Promise<Record<string, StudyNote>>

const loaders: Record<string, Loader> = {
  'math': async () => (await import('./generated/math')).notes,
  'm2': async () => (await import('./generated/m2')).notes,
  'm1': async () => (await import('./generated/m1')).notes,
  'physics': async () => (await import('./generated/physics')).notes,
  'chemistry': async () => (await import('./generated/chemistry')).notes,
  'biology': async () => (await import('./generated/biology')).notes,
  'english': async () => (await import('./generated/english')).notes,
  'chinese': async () => (await import('./generated/chinese')).notes,
  'bafs': async () => (await import('./generated/bafs')).notes,
  'ict': async () => (await import('./generated/ict')).notes,
  'economics': async () => (await import('./generated/economics')).notes,
  'csd': async () => (await import('./generated/csd')).notes,
  'chinese-history': async () => (await import('./generated/chinese-history')).notes,
  'history': async () => (await import('./generated/history')).notes,
  'geography': async () => (await import('./generated/geography')).notes,
  'chinese-literature': async () => (await import('./generated/chinese-literature')).notes,
  'english-literature': async () => (await import('./generated/english-literature')).notes,
  'ethics-religious': async () => (await import('./generated/ethics-religious')).notes,
  'ths': async () => (await import('./generated/ths')).notes,
  'health-management': async () => (await import('./generated/health-management')).notes,
  'design-tech': async () => (await import('./generated/design-tech')).notes,
  'visual-arts': async () => (await import('./generated/visual-arts')).notes,
  'music': async () => (await import('./generated/music')).notes,
  'pe': async () => (await import('./generated/pe')).notes,
  'technology-living': async () => (await import('./generated/technology-living')).notes,
}

/** Server／測試用：同步需要時請用 loadStudyNotesForSubject。 */
export async function loadStudyNotesForSubject(subjectId: string): Promise<Record<string, StudyNote>> {
  const load = loaders[subjectId]
  return load ? load() : {}
}
