import { notFound } from 'next/navigation'
import { getSubject, getActiveSubjects } from '@/data/subjects'
import { getSubjectQuestions, getSubjectTopics } from '@/data/questions'
// 書寫題唔喺 eager barrel 度 —— `Question` 型別本身等同 `MCQuestion`，barrel 只載 MC。
// 要數書寫題必須經 lazy loader；本頁係 server component，await 得，SSG 時就解好。
import { loadWrittenQuestions } from '@/data/questions/load'
import SubjectDetailView from './SubjectDetailView'
import { SITE_ORIGIN } from '@/lib/site'

// Pre-render the active subject routes at build time.
export function generateStaticParams() {
  return getActiveSubjects().map((s) => ({ subject: s.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string }>
}) {
  const { subject } = await params
  const meta = getSubject(subject)
  if (!meta) return { title: '科目 | DSE Level Up' } // i18n-exempt: 靜態 SEO <title> fallback（generateMetadata 唔跟 client locale）
  return {
    title: `${meta.name} | DSE Level Up`,
    description: meta.description,
    // 每科自報 canonical，令 25 個科目頁各自獨立收錄（此前繼承根 layout 的
    // `canonical: '/'`，等同全部指向首頁）。
    alternates: { canonical: `/subjects/${subject}` },
  }
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>
}) {
  const { subject } = await params
  const meta = getSubject(subject)

  if (!meta) notFound()

  const questions = getSubjectQuestions(subject)
  const topics = getSubjectTopics(subject)
  const writtenCount = (await loadWrittenQuestions(subject)).length

  // 科目頁嘅結構化資料。根 layout 已有 WebSite／Organization／WebApplication，
  // 呢度補返逐科嗰一層 —— 一個科目頁本身就係一份學習資源，`LearningResource`
  // 係啱嘅型別。
  //
  // ⚠️ 刻意【唔用】QAPage：QAPage 係畀「問題同答案都已經喺頁面上」嘅問答頁，
  //    而練習題載入嗰陣答案未揭。全部題目標 QAPage 等於向搜尋引擎聲稱一樣
  //    唔存在嘅嘢（§16.D）。
  // ⚠️ 亦刻意【唔加】SearchAction：全站冇任何 `?q=` 端點、冇 /search route
  //    （2026-09-19 實測），聲稱一個行唔到嘅搜尋框同樣係假聲稱。
  //
  // 數字全部由真題庫衍生，一個都唔手寫 —— 手寫版喺 app/layout.tsx 漂過兩個
  // 星期。迴歸鎖：lib/__tests__/claim-parity.test.mts（連註釋一齊掃）。
  //
  // `inLanguage` 只寫 zh-HK：介面有中英，但題目本身以中文為主，
  // 而語文科（中文／中國文學等）係刻意單語。寫埋 en-HK 會係一個對
  // 嗰幾科唔成立嘅聲稱。
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LearningResource',
        '@id': `${SITE_ORIGIN}/subjects/${subject}#resource`,
        url: `${SITE_ORIGIN}/subjects/${subject}`,
        name: `${meta.name} — DSE Level Up`,
        description: meta.description,
        learningResourceType: 'Practice questions',
        educationalLevel: 'Hong Kong Diploma of Secondary Education (HKDSE)',
        // 課題名用 `zh` —— 同上面 `inLanguage: 'zh-HK'` 一致。`en` 係 optional
        // 且明寫「falls back to zh when absent」（types.ts:117），混住兩種語言出
        // 只會令 `teaches` 半中半英。
        teaches: topics.map((t) => t.zh),
        inLanguage: 'zh-HK',
        isAccessibleForFree: true,
        audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
        provider: { '@id': `${SITE_ORIGIN}/#organization` },
        isFamilyFriendly: true,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_ORIGIN}/subjects/${subject}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DSE Level Up', item: SITE_ORIGIN },
          { '@type': 'ListItem', position: 2, name: 'Subjects', item: `${SITE_ORIGIN}/subjects` },
          { '@type': 'ListItem', position: 3, name: meta.name },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SubjectDetailView
        meta={meta}
        questionsCount={questions.length}
        writtenCount={writtenCount}
        typeCounts={{
          mc: questions.filter((q) => (q.type ?? 'mc') === 'mc').length,
          text: questions.filter((q) => q.type === 'text').length,
          long: questions.filter((q) => q.type === 'long').length,
        }}
        topics={topics}
      />
    </>
  )
}
