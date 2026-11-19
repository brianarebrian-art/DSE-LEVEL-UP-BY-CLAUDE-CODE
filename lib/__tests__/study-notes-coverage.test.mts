import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

const { SUBJECT_TOPICS } = await import('../../data/questions/summary.generated.ts')
const { getStudyNote, studyNoteCoverage } = await import('../notes/studyNotes.ts')
const { practiceTopicPath, practiceTopicUrl } = await import('../notes/practiceLink.ts')

describe('study notes coverage', () => {
  it('every subject topic has a study note', async () => {
    for (const subjectId of Object.keys(SUBJECT_TOPICS)) {
      const { total, covered, missing } = await studyNoteCoverage(subjectId)
      assert.equal(
        covered,
        total,
        `${subjectId}: missing ${missing.join(', ') || '(none)'}`,
      )
    }
  })

  it('math quadratic override is richer than empty stub', async () => {
    const note = await getStudyNote('math', 'quadratic_equations')
    assert.ok(note)
    assert.equal(note.source, 'override')
    assert.ok(note.mustKnowZh.length >= 3)
    assert.ok(note.explainerSrc?.includes('math-quadratic'))
  })
})

describe('practice link for note QR', () => {
  it('builds practice path and absolute URL without PII', () => {
    assert.equal(
      practiceTopicPath('math', 'quadratic_equations'),
      '/practice?subject=math&topic=quadratic_equations',
    )
    assert.equal(
      practiceTopicUrl('math', 'quadratic_equations'),
      'https://www.dselevelup.com/practice?subject=math&topic=quadratic_equations',
    )
  })
})
