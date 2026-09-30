import { bestSimilarity, FUZZY_THRESHOLD, normalise } from '@/lib/fuzzy'
import type { SubjectMeta } from '@/data/subjects'

// Subject search on /subjects (UX loop 9, 2026-09-30).
//
// Measured before this change against the typo-tolerant matcher alone:
//   • no result for 通識, 電腦, 家政, TL or Liberal Studies — names students
//     still use for CSD, ICT and Technology and Living;
//   • LS matched only Mathematics;
//   • ICT and eng each matched five or six subjects, listed in the page's
//     default order rather than by how well they matched.
//
// Aliases are search terms only; they are never displayed. A query equal to a
// subject's short name or one of its aliases scores 1, so that subject comes first.

export const SUBJECT_ALIASES: Readonly<Record<string, readonly string[]>> = {
  math: ['Maths', 'Core Maths', '必修數學'],
  m1: ['延伸一', 'Module 1'],
  m2: ['延伸二', 'Module 2'],
  physics: ['Phy', 'Phys'],
  chemistry: ['Chem'],
  biology: ['Bio'],
  english: ['Eng'],
  bafs: ['企會財', '會計', '商科', 'Accounting'],
  ict: ['電腦', '資訊科技', 'Computer'],
  economics: ['Econs'],
  csd: ['通識', '通識教育', '公社', 'Liberal Studies', 'LS'],
  history: ['世史', '西史', '世界歷史'],
  'chinese-literature': ['中國文學'],
  'english-literature': ['英國文學', 'Literature in English'],
  'ethics-religious': ['ERS', 'RS', '倫理', '宗教'],
  ths: ['旅款', '旅遊', 'Tourism'],
  'health-management': ['社關', 'Health Management'],
  'design-tech': ['設計', 'D&T'],
  'visual-arts': ['視覺藝術', 'Art'],
  'technology-living': ['家政', 'TL', 'Home Economics'],
}

export function subjectSearchScore(query: string, s: SubjectMeta): number {
  const q = normalise(query)
  if (!q) return 1
  const aliases = SUBJECT_ALIASES[s.id] ?? []
  if ([s.short, s.shortEn, ...aliases].some((a) => normalise(a) === q)) return 1
  return bestSimilarity(query, [s.name, s.nameEn, s.short, s.shortEn, ...aliases])
}

/** Matching subjects, best match first. An empty query returns the list unchanged. */
export function searchSubjects(list: readonly SubjectMeta[], query: string): SubjectMeta[] {
  if (!normalise(query)) return [...list]
  return list
    .map((s, i) => ({ s, i, score: subjectSearchScore(query, s) }))
    .filter((x) => x.score >= FUZZY_THRESHOLD)
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .map((x) => x.s)
}
