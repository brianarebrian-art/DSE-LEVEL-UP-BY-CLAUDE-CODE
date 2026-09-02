import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'katex/dist/katex.min.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AppShell from '@/components/AppShell'
import Providers from '@/components/Providers'
import BottomNav from '@/components/BottomNav'
import GlobalA11y from '@/components/GlobalA11y'
import A11yPanel from '@/components/A11yPanel'
import ReadingRuler from '@/components/ReadingRuler'

const inter = Inter({ subsets: ['latin'] })

// 部署網域。dselevelup.hk 尚未購入，一律沿用現行 Vercel 域（Brian 2026-07-29 拍板）。
// 2026-08-14：原本此處與 app/sitemap.ts 各有一份字面值，靠註釋提醒「三處必須一致」。
// 紙筆戰士把對答案網址印上實體試卷後，寫錯即無法補救，故改為單一來源匯入。
// （public/robots.txt 為靜態檔，無法匯入，由 lib/__tests__/site-origin.test.mts 核對。）
import { SITE_ORIGIN as SITE_URL } from '@/lib/site'

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
  // 【刻意不在根 layout 設 alternates.canonical】
  // 根 layout 的 metadata 會被【全站每一頁】繼承。曾設為 `{ canonical: '/' }`，
  // 結果 25 個科目頁、/subjects、/methodology、/practice 等全部向搜尋引擎宣告
  // 「本頁是首頁的複製品」，等同要求不要收錄自己（實測 curl 每頁均輸出
  // `<link rel="canonical" href="…vercel.app">`）。
  // 需要 canonical 的頁面各自於 page.tsx 宣告；未宣告者由搜尋引擎以該 URL 自身
  // 為準，此即正確預設。
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
// 誠實紅線：`description` 只寫查證得到的事實（題數實測 5,167、25 科），
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
    // suppressHydrationWarning：下方防閃爍腳本會喺 React 水合之前改 data-theme，
    // 伺服器輸出與首次客戶端 render 因此必然不同，此屬預期行為。
    <html lang="zh-HK" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-surface text-ink`}>
        {/* 防閃爍：必須喺任何內容繪製之前決定主題，否則深色用戶會見到一下白閃。
            內容與 lib/theme.ts 同一條日出方程 —— 呢度係鏡像副本，因為 inline
            script 用唔到 import。兩者若有偏差，ThemeProvider 會喺 mount 後以
            lib/theme.ts 為準覆寫，最多差一格畫面，唔會停留喺錯誤狀態。 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k='dse-theme',p=localStorage.getItem(k);if(p!=='light'&&p!=='cyber'&&p!=='auto')p='auto';var t=p;if(p==='auto'){var o=new Date(),hk=new Date(o.getTime()+(480+o.getTimezoneOffset())*6e4),s=Date.UTC(hk.getUTCFullYear(),0,0),n=Math.floor((hk.getTime()-s)/864e5),R=Math.PI/180,d=-23.44*Math.cos(R*(360/365)*(n+10)),b=R*(360/364)*(n-81),e=9.87*Math.sin(2*b)-7.53*Math.cos(b)-1.5*Math.sin(b),c=-Math.tan(R*22.3019)*Math.tan(R*d),w=c>1?0:c<-1?180:Math.acos(c)/R,m=12-e/60+(120-114.1742)/15,h=hk.getHours()+hk.getMinutes()/60;t=(h>=m-w/15&&h<m+w/15)?'light':'cyber'}document.documentElement.setAttribute('data-theme',t)}catch(_){document.documentElement.setAttribute('data-theme','light')}})()`,
          }}
        />
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
          {/* AppShell 負責全屏任務模式（/practice 等）隱藏 Navbar／Footer 同收起
              頂部留白。名單見 lib/immersiveRoutes.ts，同 BottomNav 共用同一張。 */}
          <AppShell navbar={<Navbar />} footer={<Footer />}>
            {children}
          </AppShell>
          {/* 全站無障礙層：字級/易讀字體全站套用 + 「我唔開心」SOS（/relax 內自動隱藏） */}
          <GlobalA11y />
          {/* SEN 無障礙工具（全站常駐）：字級／易讀字體面板 + 防跳行閱讀尺 */}
          <A11yPanel />
          <ReadingRuler />
          {/* 手機底部導航（桌面 md:hidden）。放最後：佢會喺 <html> 掛
              data-bottomnav，上面幾個浮動掣靠嗰個變數讓位。 */}
          <BottomNav />
        </Providers>
      </body>
    </html>
  )
}
