import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const { isResearchRouteHidden } = await import('../research/availability.ts')
const { seedStore } = await import('../research/seed.ts')
const { parseStore } = await import('../research/storage.ts')
const { susScore } = await import('../research/sus.ts')
const {
  aggregate,
  filterResponses,
  npsIndex,
  prioritySuggestions,
  questionError,
  taskSuccessRate,
} = await import('../research/metrics.ts')
const { duplicateSurvey, nextRespondentCode } = await import('../research/surveys.ts')
const { responsesToCsv } = await import('../research/csv.ts')
const { RESEARCH_NAV } = await import('../research/nav.ts')
const { shouldNoIndex } = await import('../seoPolicy.ts')
const { isImmersiveRoute } = await import('../immersiveRoutes.ts')
const { showsStudentLanguageControl } = await import('../localePreference.ts')

const emptyFilters = { query: '', surveyId: '', status: '' as const, tag: '' as const, from: '', to: '' }

test('正式環境隱藏用戶研究，預覽同本機開發唔隱藏', () => {
  assert.equal(isResearchRouteHidden({ VERCEL_ENV: 'production', NODE_ENV: 'production' }), true)
  assert.equal(isResearchRouteHidden({ VERCEL_ENV: 'production', NODE_ENV: 'development' }), true)
  assert.equal(isResearchRouteHidden({ VERCEL_ENV: 'preview', NODE_ENV: 'production' }), false)
  assert.equal(isResearchRouteHidden({ VERCEL_ENV: 'preview', NODE_ENV: 'development' }), false)
  assert.equal(isResearchRouteHidden({ NODE_ENV: 'production' }), true)
  assert.equal(isResearchRouteHidden({ NODE_ENV: 'development' }), false)
  const layout = readFileSync('app/research/layout.tsx', 'utf8')
  assert.match(layout, /isResearchRouteHidden\(\)/)
  assert.match(layout, /notFound\(\)/)
})

test('研究路由唔入學生導覽、唔收錄、唔顯示語言掣', () => {
  assert.equal(isImmersiveRoute('/research'), true)
  assert.equal(isImmersiveRoute('/research/admin/surveys'), true)
  assert.equal(shouldNoIndex('/research'), true)
  assert.equal(shouldNoIndex('/research/s/sv-practice-flow'), true)
  assert.equal(showsStudentLanguageControl('/research/s/sv-practice-flow'), false)
  for (const file of ['components/Sidebar.tsx', 'components/BottomNav.tsx', 'components/Navbar.tsx', 'app/page.tsx', 'app/practice/page.tsx']) {
    assert.equal(readFileSync(file, 'utf8').includes('/research'), false, file)
  }
  const vercel = JSON.parse(readFileSync('vercel.json', 'utf8')) as { rootDirectory?: string; framework?: string }
  assert.equal(vercel.framework, 'nextjs')
  assert.equal(vercel.rootDirectory, undefined)
  const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { name: string; dependencies: Record<string, string> }
  assert.equal(pkg.name, 'dse-level-up')
  assert.equal(pkg.dependencies.recharts, undefined)
  assert.equal(pkg.dependencies['chart.js'], undefined)
})

test('示範數據有兩份以上問卷、十二份以上匿名回覆，而且可以還原', () => {
  const store = seedStore()
  assert.ok(store.surveys.length >= 2)
  assert.ok(store.responses.length >= 12)
  assert.equal(parseStore(JSON.stringify(store))?.responses.length, store.responses.length)
  assert.equal(parseStore('{'), null)
  const raw = JSON.stringify(store)
  assert.equal(raw.includes('@'), false)
  for (const response of store.responses) assert.match(response.respondentCode, /^R-\d{4}$/)
  const joined = store.surveys.map((survey) => `${survey.name} ${survey.description} ${survey.purpose}`).join(' ')
  for (const word of ['練習', '題庫', '列印', '難度', '登入']) assert.match(joined, new RegExp(word))
})

test('滿意度、NPS、完成率同任務完成由答案計出', () => {
  assert.equal(susScore([5, 1, 5, 1, 5, 1, 5, 1, 5, 1]), 100)
  assert.equal(susScore([1, 5, 1, 5, 1, 5, 1, 5, 1, 5]), 0)
  assert.equal(npsIndex([10, 9, 8, 0]), 25)
  assert.equal(taskSuccessRate(['done', 'done', 'partial', 'unable']), 0.5)
  const store = seedStore()
  const summary = aggregate(store.surveys, store.responses)
  assert.equal(summary.responseCount, 14)
  assert.equal(typeof summary.satisfaction, 'number')
  assert.equal(typeof summary.nps, 'number')
  assert.equal(typeof summary.taskSuccess, 'number')
  assert.equal(typeof summary.sus, 'number')
  assert.ok(summary.tagCounts.some((row) => row.tag === 'bug' && row.count > 0))
  const later = filterResponses(store.surveys, store.responses, { ...emptyFilters, from: '2026-11-20' })
  assert.equal(later.length, 4)
  const one = filterResponses(store.surveys, store.responses, { ...emptyFilters, query: 'R-2411' })
  assert.equal(one.length, 1)
  const draft = filterResponses(store.surveys, store.responses, { ...emptyFilters, surveyId: 'sv-signin-copy' })
  assert.equal(draft.length, 0)
  assert.ok(prioritySuggestions(store.surveys, store.responses).some((item) => item.id.startsWith('task-')))
  const survey = store.surveys[0]
  const required = survey.questions.find((question) => question.required)
  assert.ok(required)
  assert.match(questionError(required, undefined) ?? '', /請/)
})

test('複本係草稿；CSV 會跳脫引號', () => {
  const store = seedStore()
  const copy = duplicateSurvey(store.surveys[0], '2026-11-27T00:00:00.000Z', {
    surveyId: 'sv-copy',
    questionIds: store.surveys[0].questions.map((_, index) => `q-copy-${index}`),
  })
  assert.equal(copy.status, 'draft')
  assert.match(copy.name, /複本/)
  assert.equal(copy.questions[0]?.id, 'q-copy-0')
  assert.equal(nextRespondentCode([], () => 0.5), 'R-5500')
  assert.equal(nextRespondentCode(['R-5500'], () => 0.5), 'R-1000')
  const csv = responsesToCsv(store.surveys, [{
    ...store.responses[0],
    answers: {
      ...store.responses[0].answers,
      'q-note': { type: 'text', text: '佢話 "清楚"' },
    },
  }])
  assert.equal(csv.charCodeAt(0), 0xfeff)
  assert.match(csv, /""清楚""/)
})

test('研究導覽每一項都有頁面', () => {
  for (const item of RESEARCH_NAV) {
    assert.equal(existsSync(join('app', item.href.replace(/^\//, ''), 'page.tsx')), true, item.href)
  }
})
