import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'katex/dist/katex.min.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Providers from '@/components/Providers'
import GlobalA11y from '@/components/GlobalA11y'
import A11yPanel from '@/components/A11yPanel'
import ReadingRuler from '@/components/ReadingRuler'

const inter = Inter({ subsets: ['latin'] })

// 部署網域。dselevelup.hk 尚未購入，一律沿用現行 Vercel 域（Brian 2026-07-29 拍板）。
// robots.txt 與 app/sitemap.ts 使用同一個值，三處必須一致。
const SITE_URL = 'https://dse-level-up-by-claude-code.vercel.app'

export const metadata: Metadata = {
  // metadataBase 是 OG／canonical 相對路徑解析的基準；缺少它時 Next.js 會在建置期
  // 發出警告，且 og:image 會輸出成相對路徑，大部分社交平台抓不到。
  metadataBase: new URL(SITE_URL),
  title: 'DSE Level Up | 掌握 DSE 核心邏輯', // i18n-exempt: 靜態 SEO <title>，Next.js metadata 唔跟 client locale
  description:
    '改寫版歷屆試題 + 即時等級預測。掌握邏輯，唔係背答案。涵蓋全部 DSE 科目，幫你用最輕鬆嘅方法溫書。', // i18n-exempt: 靜態 SEO meta description
  // 刻意不設 `title.template` —— 各子頁（/subjects、/notes/[subject] 等）已自行
  // 於標題末尾附上「| DSE Level Up」，加 template 會變成重複兩次。
  applicationName: 'DSE Level Up',
  keywords: ['DSE', 'HKDSE', '文憑試', '歷屆試題', '改寫試題', '溫習', '免費補習', 'DSE 練習'], // i18n-exempt: SEO keywords，唔跟 client locale
  authors: [{ name: 'DSE Level Up' }],
  creator: 'DSE Level Up',
  publisher: 'DSE Level Up',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  openGraph: {
    type: 'website',
    siteName: 'DSE Level Up',
    locale: 'zh_HK',
    url: SITE_URL,
    title: 'DSE Level Up | 掌握 DSE 核心邏輯', // i18n-exempt: 靜態 SEO OG title
    description: '免費 DSE 練習平台，涵蓋 25 科獨立改寫試題。掌握邏輯，唔係背答案。', // i18n-exempt: 靜態 SEO OG description
    // 刻意不在此宣告 images —— `app/opengraph-image.tsx` 屬 Next.js 檔案約定，
    // 建置時會自動注入 og:image / twitter:image（連 width／height／type）。
    // 兩邊都寫會產生重複標籤。
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DSE Level Up | 掌握 DSE 核心邏輯', // i18n-exempt: 靜態 SEO Twitter title
    description: '免費 DSE 練習平台，涵蓋 25 科獨立改寫試題。', // i18n-exempt: 靜態 SEO Twitter description
  },
}

// 知識圖譜（JSON-LD）。全部以英文撰寫 —— 此段並非使用者可見文案，而是給搜尋引擎
// 與答案引擎讀的結構化資料，英文可獲最廣泛的解析支援。
//
// 誠實紅線：`description` 只寫查證得到的事實（題數由 `_scan` 實測 5,167、25 科），
// 且明文載明與 HKEAA 無從屬關係 —— 與頁尾免責聲明、/llms.txt 三處一致。
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'DSE Level Up',
      description: 'A free, independent HKDSE practice platform for Hong Kong secondary students.',
      inLanguage: ['zh-HK', 'en-HK'],
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'DSE Level Up',
      url: SITE_URL,
      email: 'dselevelup@gmail.com',
      description:
        'An independent, non-commercial educational project. Not affiliated with, authorised by, or endorsed by the Hong Kong Examinations and Assessment Authority (HKEAA).',
    },
    {
      '@type': 'WebApplication',
      '@id': `${SITE_URL}/#application`,
      name: 'DSE Level Up',
      url: SITE_URL,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web browser',
      inLanguage: ['zh-HK', 'en-HK'],
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'HKD' },
      audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
      description:
        'Free HKDSE revision platform with 5,167 independently rewritten multiple-choice questions across 25 subjects, a 60-second reflection lock for wrong answers, printable paper-based mock sets, and accessibility features for students with SEN. Questions are original rewrites, not reproductions of HKEAA past papers.',
    },
  ],
}

// FIX: [B8] viewport-fit=cover — 冇佢 iOS 嘅 env(safe-area-inset-*) 恆等於 0，
// 左下／右下懸浮掣嘅 safe-area 位移唔會生效（iPhone Home Indicator 遮擋）
export const viewport: Viewport = {
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-HK" className="h-full">
      <body className={`${inter.className} min-h-screen bg-bg-dark text-slate-100`}>
        {/* 知識圖譜。放於 <body> 起首，令爬蟲毋須等待水合即可讀取。 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* P1-3 WCAG：跳至主要內容連結（鍵盤/螢幕閱讀器用戶第一下 Tab 就見到，
            滑鼠用戶完全睇唔到）。Server component 冇 locale hook，雙語並列。 */}
        <a href="#main-content" className="skip-link">
          跳至主要內容 · Skip to main content{/* i18n-exempt: 雙語已並列（server component 冇 locale） */}
        </a>
        <Providers>
          <Navbar />
          <main id="main-content" className="pt-16">{children}</main>
          <Footer />
          {/* 全站無障礙層：字級/易讀字體全站套用 + 「我唔開心」SOS（/relax 內自動隱藏） */}
          <GlobalA11y />
          {/* SEN 無障礙工具（全站常駐）：字級／易讀字體面板 + 防跳行閱讀尺 */}
          <A11yPanel />
          <ReadingRuler />
        </Providers>
      </body>
    </html>
  )
}
