#!/usr/bin/env -S npx tsx
// ============================================================================
// gen-study-notes.mts —— 為每個科目×課題產生自學筆記（按科拆檔，避免 client 拉 582KB）
// ----------------------------------------------------------------------------
//   npm run gen:study-notes
//
// 輸出：
//   data/notes/generated/<subjectId>.ts
//   data/notes/studyNotes.generated.ts  （只做 loader 索引，唔嵌正文）
// ============================================================================
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_DIR = join(ROOT, 'data/notes/generated')
mkdirSync(OUT_DIR, { recursive: true })

const { subjects } = await import(join(ROOT, 'data/subjects.ts')) as {
  subjects: { id: string; name: string; nameEn: string; isActive?: boolean }[]
}
const idx = await import(join(ROOT, 'data/questions/index.ts')) as {
  getSubjectQuestions: (id: string) => {
    type?: string
    topic: string
    explanation?: string
    explanationEn?: string
  }[]
  getSubjectTopics: (id: string) => { id: string; zh: string; en?: string }[]
}

type SenseiCard = {
  topic: string
  concept: string
  example: string
  examTechnique: string
  commonTrap: string
  conceptEn?: string
  exampleEn?: string
  examTechniqueEn?: string
  commonTrapEn?: string
  keywords: string[]
}

const senseiLoaders: Record<string, () => Promise<Record<string, SenseiCard[]>>> = {
  math: async () => await import(join(ROOT, 'data/sensei/math/index.ts')),
  chinese: async () => await import(join(ROOT, 'data/sensei/chinese/index.ts')),
  english: async () => await import(join(ROOT, 'data/sensei/english/index.ts')),
  economics: async () => await import(join(ROOT, 'data/sensei/economics/index.ts')),
}

const EXPLAINER_BY_TOPIC: Record<string, string> = {
  'm2:differentiation': '/explainers/m2-differentiation.svg',
  'chemistry:electrolysis': '/explainers/chem-electrolysis.svg',
  'biology:genetics': '/explainers/bio-genetics.svg',
  'biology:inheritance': '/explainers/bio-genetics.svg',
  'math:quadratic_equations': '/explainers/math-quadratic.svg',
  'math:trigonometry': '/explainers/math-trigonometry.svg',
  'math:trig_3d': '/explainers/math-trigonometry.svg',
}

function extractTrap(explanation: string): string | null {
  const m = /陷阱[：:]\s*([^]*)$/.exec(String(explanation ?? ''))
  return m?.[1]?.trim() || null
}

function firstSentence(text: string, max = 180): string {
  const t = String(text ?? '')
    .replace(/陷阱[：:][\s\S]*$/u, '')
    .replace(/【陷阱】[\s\S]*$/iu, '')
    .replace(/【Trap】[\s\S]*$/iu, '')
    .replace(/\bTrap[：:]\s*[\s\S]*$/iu, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!t) return ''

  // 中文：喺句號／問嘆號切（唔掂英文句點 → 避免 37.5、i.e.、e.g.）。
  const zhEnd = t.search(/[。！？]/u)
  if (zhEnd >= 0) {
    const cut = t.slice(0, zhEnd + 1).trim()
    return cut.length > max ? softClip(cut, max) : cut
  }

  // 英文／混合：唔用句點分句；只做長度上限，喺空白處截，避免腰斬小數同縮寫。
  if (t.length <= max) return t
  return softClip(t, max)
}

/** 喺 max 內最後一個空白截斷；搵唔到就硬截。 */
function softClip(text: string, max: number): string {
  if (text.length <= max) return text
  const window = text.slice(0, max)
  const sp = window.lastIndexOf(' ')
  const base = sp >= Math.floor(max * 0.5) ? window.slice(0, sp) : window.slice(0, max - 1)
  return `${base.trimEnd()}…`
}

function uniqueKeep(items: string[], limit: number): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const item of items) {
    const k = item.replace(/[0-9０-９]+/g, '').replace(/\s+/g, '')
    if (!k || seen.has(k)) continue
    seen.add(k)
    out.push(item)
    if (out.length >= limit) break
  }
  return out
}

function matchSensei(cards: SenseiCard[], topicZh: string, topicEn: string): SenseiCard | null {
  const zh = topicZh.toLowerCase()
  const en = (topicEn || '').toLowerCase()
  for (const c of cards) {
    if (c.topic === topicZh || c.topic.toLowerCase() === zh) return c
    if (en && c.topic.toLowerCase() === en) return c
  }
  for (const c of cards) {
    if (c.keywords?.some((k) => zh.includes(k.toLowerCase()) || k.toLowerCase().includes(zh.slice(0, 2)))) {
      return c
    }
  }
  return null
}

type StudyNote = {
  subjectId: string
  topicId: string
  titleZh: string
  titleEn: string
  conceptZh: string
  conceptEn: string
  mustKnowZh: string[]
  mustKnowEn: string[]
  examTipZh: string
  examTipEn: string
  commonTrapZh: string
  commonTrapEn: string
  explainerSrc?: string
  source: 'generated' | 'sensei'
}

// 清走舊檔（科目改名時唔留 orphan）
for (const f of readdirSync(OUT_DIR)) {
  if (f.endsWith('.ts')) unlinkSync(join(OUT_DIR, f))
}

const active = subjects.filter((s) => s.isActive !== false)
const subjectIds: string[] = []
let senseiHits = 0
let total = 0

for (const s of active) {
  const topics = idx.getSubjectTopics(s.id)
  const qs = idx.getSubjectQuestions(s.id)
  let cards: SenseiCard[] = []
  if (senseiLoaders[s.id]) {
    const mod = await senseiLoaders[s.id]()
    const key = Object.keys(mod).find((k) => Array.isArray(mod[k]))
    cards = key ? (mod[key] ?? []) : []
  }

  const notes: Record<string, StudyNote> = {}
  for (const t of topics) {
    total++
    const inTopic = qs.filter((q) => q.topic === t.id)
    const trapsZh = uniqueKeep(
      inTopic.map((q) => extractTrap(q.explanation ?? '')).filter(Boolean) as string[],
      4,
    )
    const trapsEn = uniqueKeep(
      inTopic
        .map((q) => {
          const e = q.explanationEn ?? ''
          const m = /\[Trap\]\s*([^]*)$/i.exec(e) || /Trap[：:]\s*([^]*)$/i.exec(e)
          return m?.[1]?.trim() || ''
        })
        .filter(Boolean),
      4,
    )
    const concepts = uniqueKeep(
      inTopic.map((q) => firstSentence(q.explanation ?? '')).filter((x) => x.length >= 12),
      4,
    )
    const conceptsEn = uniqueKeep(
      inTopic.map((q) => firstSentence(q.explanationEn ?? '')).filter((x) => x.length >= 12),
      4,
    )

    const sensei = matchSensei(cards, t.zh, t.en ?? '')
    const titleEn = t.en ?? t.zh
    let note: StudyNote

    if (sensei) {
      senseiHits++
      note = {
        subjectId: s.id,
        topicId: t.id,
        titleZh: t.zh,
        titleEn,
        conceptZh: sensei.concept,
        conceptEn: sensei.conceptEn || sensei.concept,
        mustKnowZh: [sensei.example, ...concepts.slice(0, 2)].filter(Boolean).slice(0, 4),
        mustKnowEn: [sensei.exampleEn || sensei.example, ...conceptsEn.slice(0, 2)].filter(Boolean).slice(0, 4),
        examTipZh: sensei.examTechnique,
        examTipEn: sensei.examTechniqueEn || sensei.examTechnique,
        commonTrapZh: sensei.commonTrap || trapsZh[0] || `溫習「${t.zh}」時，核對定義同單位，避免張冠李戴。`,
        commonTrapEn: sensei.commonTrapEn || trapsEn[0] || `When revising “${titleEn}”, check definitions and units carefully.`,
        source: 'sensei',
      }
    } else {
      note = {
        subjectId: s.id,
        topicId: t.id,
        titleZh: t.zh,
        titleEn,
        conceptZh:
          concepts[0] ||
          `「${t.zh}」係${s.name}常考課題。先掌握定義同核心公式／準則，再用題庫由淺入深練。`,
        conceptEn:
          conceptsEn[0] ||
          `“${titleEn}” is a frequent ${s.nameEn} topic. Master definitions and core rules, then practise from the bank.`,
        mustKnowZh: (concepts.length
          ? concepts
          : [
              `清楚「${t.zh}」嘅定義同適用條件`,
              '做題前標示已知／所求，避免漏條件',
              '對照解析入面嘅陷阱標記，下次避開',
            ]
        ).slice(0, 4),
        mustKnowEn: (conceptsEn.length
          ? conceptsEn
          : [
              `Know the definition and conditions for “${titleEn}”`,
              'Mark givens and goals before solving',
              'Re-read flagged traps in explanations',
            ]
        ).slice(0, 4),
        examTipZh: `DSE 作答「${t.zh}」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。`,
        examTipEn: `In DSE “${titleEn}”: show steps and units; eliminate trap options in MC; structure long answers by marks.`,
        commonTrapZh: trapsZh[0] || `混淆相近概念、漏讀題幹限制，或計算後未代回原式檢查。`,
        commonTrapEn:
          trapsEn[0] ||
          `Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.`,
        source: 'generated',
      }
    }

    const explainer = EXPLAINER_BY_TOPIC[`${s.id}:${t.id}`]
    if (explainer) note.explainerSrc = explainer
    notes[t.id] = note
  }

  const safeId = s.id.replace(/'/g, '')
  const fileBody = `// ⚠️ 由 scripts/gen-study-notes.mts 產生 —— 請勿手動修改。
import type { StudyNote } from '../types'

export const notes: Record<string, StudyNote> = ${JSON.stringify(notes, null, 2)}
`
  writeFileSync(join(OUT_DIR, `${safeId}.ts`), fileBody, 'utf8')
  subjectIds.push(s.id)
}

const indexBody = `// ⚠️ 由 scripts/gen-study-notes.mts 產生 —— 請勿手動修改。
// 人手覆寫：data/notes/overrides.ts
import type { StudyNote } from './types'

export const STUDY_NOTE_SUBJECT_IDS = ${JSON.stringify(subjectIds)} as const

type Loader = () => Promise<Record<string, StudyNote>>

const loaders: Record<string, Loader> = {
${subjectIds
  .map((id) => `  '${id}': async () => (await import('./generated/${id}')).notes,`)
  .join('\n')}
}

/** Server／測試用：同步需要時請用 loadStudyNotesForSubject。 */
export async function loadStudyNotesForSubject(subjectId: string): Promise<Record<string, StudyNote>> {
  const load = loaders[subjectId]
  return load ? load() : {}
}
`
writeFileSync(join(ROOT, 'data/notes/studyNotes.generated.ts'), indexBody, 'utf8')
console.log(`Wrote ${total} topics (${senseiHits} sensei) across ${subjectIds.length} subject files.`)
