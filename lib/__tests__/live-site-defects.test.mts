// Live-site defect batch. These checks lock the safe copy and routing fixes
// without loading the question bank or the practice session.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(path, 'utf8')

test('typed auth aliases redirect to the real sign-in and sign-up routes', async () => {
  const { default: config } = await import('../../next.config.ts')
  const rules = (await config.redirects?.()) ?? []
  const expect = [
    ['/signin', '/sign-in'],
    ['/login', '/sign-in'],
    ['/log-in', '/sign-in'],
    ['/sign_in', '/sign-in'],
    ['/signup', '/sign-up'],
    ['/sign_up', '/sign-up'],
  ] as const
  for (const [source, destination] of expect) {
    const rule = rules.find((item: { source: string }) => item.source === source)
    assert.ok(rule, `${source} has no redirect`)
    assert.equal(rule.destination, destination)
    assert.equal(rule.permanent, false)
  }
  assert.equal(rules.some((item: { source: string }) => item.source === '/sign-in'), false)
  assert.equal(rules.some((item: { source: string }) => item.source === '/sign-up'), false)
})

test('404 metadata is distinct, noindex, and has no canonical', () => {
  const src = read('app/not-found.tsx')
  assert.match(src, /找不到頁面 \| DSE Level Up/)
  assert.match(src, /index:\s*false/)
  assert.match(src, /follow:\s*false/)
  assert.doesNotMatch(src, /alternates|canonical\s*:/)
  assert.doesNotMatch(src, /DSE 溫習平台 \| 選擇題練判斷/)
  assert.match(src, /NotFoundView/)
})

test('sign-in form is rendered with the page, not behind an empty suspense fallback', () => {
  const page = read('app/(auth)/sign-in/page.tsx')
  const client = read('app/(auth)/sign-in/SignInPageClient.tsx')
  assert.match(page, /<SignInPageClient error=/)
  assert.doesNotMatch(page, /Suspense/)
  assert.doesNotMatch(client, /useSearchParams/)
  assert.match(client, /GoogleSignInButton/)
  assert.match(read('components/auth/GoogleSignInButton.tsx'), /用 Google 繼續/)
})

test('wordmark keeps a real space and does not collapse to DSE below xl', () => {
  const side = read('components/Sidebar.tsx')
  const nav = read('components/Navbar.tsx')
  assert.match(side, /aria-label="DSE Level Up"/)
  assert.match(side, /<span className="text-accent">DSE<\/span>\s*\{' '\}\s*<span>Level\{'\\u00A0'\}Up<\/span>/)
  assert.doesNotMatch(side, /hidden text-sm font-semibold text-ink xl:inline/)
  assert.match(nav, /DSE <span className="text-accent">Level\{'\\u00A0'\}Up<\/span>/)
  assert.doesNotMatch(nav, /hidden sm:inline/)
})

test('language control has spaces around the middle dot', () => {
  const src = read('components/LanguageToggle.tsx')
  assert.match(src, /\{' · '\}/)
  assert.doesNotMatch(src, />·</)
})

test('public copy drops the retired brand and the unsubstantiated study claims', () => {
  const files = [
    'app/subject/[subject]/[topic]/[id]/page.tsx',
    'app/feedback/page.tsx',
    'app/api/enroll/webhook/route.ts',
    'lib/generalFeedback.ts',
    'components/BlindTestQuestion.tsx',
    'app/page.tsx',
  ]
  for (const file of files) {
    const src = read(file)
    assert.equal(src.includes('考試急症室'), false, file)
    assert.equal(src.includes('間隔重複'), false, file)
    assert.equal(src.includes('即時錯因'), false, file)
  }
  const subject = read('app/subject/[subject]/[topic]/[id]/page.tsx')
  assert.doesNotMatch(subject, /DSE 2026/)
  assert.match(subject, /DSE \$\{meta\.name\} 題目解析/)
  assert.match(subject, /並非考評局試題/)
  assert.match(subject, /沒有從屬關係/)
  assert.match(subject, /<MathText>/)
  assert.match(subject, /isCorrect/)
  assert.match(read('app/dse-maths/page.tsx'), /非官方題解/)
  assert.doesNotMatch(read('app/dse-maths/page.tsx'), /非官方题解/)
})

test('homepage meta description leads with the practice offer', () => {
  const home = read('app/page.tsx')
  assert.match(home, /description: '免費、無廣告、毋須登入。一節約 10 題選擇題，大約 15 分鐘。題目為原創改寫，並非考評局試題，不作成績保證。'/)
  assert.doesNotMatch(home, /科目筆記和寫作自評/)
  assert.doesNotMatch(home, /全站雙語|一節20題|答錯鎖60秒/)
})

test('homepage tangent points lie on the circle and the lines are tangents', async () => {
  const { TANGENT_FIGURE } = await import('../../components/demoTangentGeometry.ts')
  const { O, P, r, A, B, C } = TANGENT_FIGURE
  const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y)
  const dot = (a: { x: number; y: number }, b: { x: number; y: number }) => a.x * b.x + a.y * b.y
  for (const point of [A, B, C]) {
    assert.ok(Math.abs(dist(O, point) - r) < 1e-9, 'point is not on the circle')
  }
  assert.ok(Math.abs(dot({ x: A.x - O.x, y: A.y - O.y }, { x: A.x - P.x, y: A.y - P.y })) < 1e-6)
  assert.ok(Math.abs(dot({ x: B.x - O.x, y: B.y - O.y }, { x: B.x - P.x, y: B.y - P.y })) < 1e-6)
  assert.ok(dist(P, O) > r, 'P must stay outside the circle')

  const angle = (point: { x: number; y: number }) => Math.atan2(point.y - O.y, point.x - O.x)
  const shortest = (delta: number) => {
    let d = delta
    while (d > Math.PI) d -= Math.PI * 2
    while (d < -Math.PI) d += Math.PI * 2
    return d
  }
  const minor = shortest(angle(B) - angle(A))
  let towardC = angle(C) - angle(A)
  if (minor >= 0) {
    while (towardC < 0) towardC += Math.PI * 2
    assert.ok(towardC > minor, 'C must sit on the major arc')
  } else {
    while (towardC > 0) towardC -= Math.PI * 2
    assert.ok(towardC < minor, 'C must sit on the major arc')
  }

  const figure = read('components/BlindTestQuestion.tsx')
  assert.match(figure, /TANGENT_FIGURE/)
  assert.match(figure, /圓心為 O 的圓/)
  assert.match(figure, /A circle with centre O/)
  assert.doesNotMatch(figure, /circle with two tangents/)
  assert.doesNotMatch(figure, /考評局陷阱/)
})
