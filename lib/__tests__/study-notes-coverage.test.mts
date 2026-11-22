import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
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

describe('QR print card contrast', () => {
  it('keeps dark caption ink on its fixed white surface in either theme', () => {
    const source = readFileSync('app/notes/[subject]/NotesSubjectClient.tsx', 'utf8')
    const footer = source.slice(source.indexOf('<footer'), source.indexOf('</footer>'))
    assert.match(footer, /bg-white/)
    assert.match(footer, /mt-3 text-xs text-neutral-700/)
    assert.doesNotMatch(footer, /text-ink-muted|text-neutral-500/)
  })
})

describe('topic notes structured data', () => {
  it('every generated topic emits TechArticle with the visible headline and correct URL', () => {
    const result = spawnSync(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', `
      import assert from 'node:assert/strict';
      import { registerHooks } from 'node:module';
      registerHooks({ load(url, context, nextLoad) {
        if (url.endsWith('.css')) return { format: 'commonjs', source: '', shortCircuit: true };
        return nextLoad(url, context);
      }});
      globalThis.React = (await import('react')).default;
      const imported = await import('./app/notes/[subject]/[topic]/page.tsx');
      const route = imported.default?.default ? imported.default : imported;
      const page = route.default;
      function findH1(node) {
        if (!node || typeof node !== 'object') return null;
        if (node.type === 'h1') return node.props.children;
        for (const child of [node.props?.children].flat()) {
          const found = findH1(child);
          if (found) return found;
        }
        return null;
      }
      for (const params of route.generateStaticParams()) {
        const element = await page({ params: Promise.resolve(params) });
        const graph = element.props.children[0].props.data['@graph'];
        const article = graph.find((item) => item['@type'] === 'TechArticle');
        assert.ok(article, params.subject + '/' + params.topic + ': TechArticle required');
        assert.equal(article.headline, findH1(element));
        assert.equal(article.url, 'https://www.dselevelup.com/notes/' + params.subject + '/' + params.topic);
      }
    `], { env: { ...process.env, NODE_ENV: 'test' }, encoding: 'utf8' })
    assert.equal(result.status, 0, result.stderr)
  })
})
