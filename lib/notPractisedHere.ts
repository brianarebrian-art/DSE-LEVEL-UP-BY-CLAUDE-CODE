import { PAPER_STRUCTURE, type PaperSection, type QuestionKind } from '@/data/dse-paper-formats'

// Founders' reply 22a (audit #10, 2026-10-04; wording approved as drafted, "22 ok").
// Each subject page says which parts of the real exam this site cannot practise, so
// a thousand multiple-choice questions are not read as covering the whole subject.
// Derived from PAPER_STRUCTURE (the paper table already shown on the page), never a
// hand-kept list: a subject with only written papers and no school-based assessment
// shows nothing.

const KINDS: Partial<Record<QuestionKind, { zh: string; en: string; noteZh?: string; noteEn?: string }>> = {
  listening: { zh: '聆聽', en: 'listening', noteZh: '要聽錄音', noteEn: 'needs recordings' },
  speaking: { zh: '口試', en: 'speaking' },
  performing: { zh: '演奏', en: 'performing' },
  creating: { zh: '創作', en: 'composing' },
  practical: { zh: '實習考試', en: 'practical exam' },
  'art-making': { zh: '藝術創作', en: 'art making' },
  design: { zh: '設計題', en: 'design tasks', noteZh: '要繪圖', noteEn: 'needs drawing' },
}

export interface NotPractisedPart {
  zh: string
  en: string
}

function paperLabel(secs: PaperSection[]): string {
  const papers = new Set(secs.map((s) => s.paper))
  if (secs.length > 1 && papers.size === 1) return secs[0].paper
  return secs.map((s) => `${s.paper}${s.section ?? ''}`).join('、')
}

function weightLabel(secs: PaperSection[], en: boolean): string | null {
  if (secs.some((s) => s.weight === null)) return null
  const sum = Math.round(secs.reduce((n, s) => n + (s.weight as number), 0))
  return `${secs.some((s) => s.derived) ? (en ? 'about ' : '約 ') : ''}${sum}%`
}

/** The parts of the subject's exam this site has no way to practise, in paper order. */
export function notPractisedHere(subjectId: string): NotPractisedPart[] {
  const st = PAPER_STRUCTURE[subjectId]
  if (!st) return []
  const byKind = new Map<QuestionKind, PaperSection[]>()
  for (const sec of st.sections) {
    for (const k of sec.kinds) {
      if (!KINDS[k]) continue
      byKind.set(k, [...(byKind.get(k) ?? []), sec])
    }
  }
  const parts: NotPractisedPart[] = []
  for (const [k, secs] of byKind) {
    const label = KINDS[k]!
    const paper = paperLabel(secs)
    const wZh = weightLabel(secs, false)
    const wEn = weightLabel(secs, true)
    const zh = [label.noteZh, `卷 ${paper}`, wZh].filter(Boolean).join('，')
    const where = [`Paper ${paper.replace('、', ', ')}`, wEn].filter(Boolean).join(', ')
    const en = label.noteEn ? `${label.noteEn}; ${where}` : where
    parts.push({ zh: `${label.zh}（${zh}）`, en: `${label.en} (${en})` })
  }
  if (st.sbaPct > 0) parts.push({ zh: `校本評核（${st.sbaPct}%）`, en: `school-based assessment (${st.sbaPct}%)` })
  return parts
}

/** The sentence shown under the subject title, or null when every part can be practised here. */
export function notPractisedSentence(subjectId: string, en: boolean): string | null {
  const parts = notPractisedHere(subjectId)
  if (parts.length === 0) return null
  return en
    ? `Not covered here: ${parts.map((p) => p.en).join(', ')}. Prepare for these separately.`
    : `本站練唔到：${parts.map((p) => p.zh).join('、')}。呢啲部分要另外準備。`
}
