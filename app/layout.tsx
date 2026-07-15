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

export const metadata: Metadata = {
  title: 'DSE Level Up | 掌握 DSE 核心邏輯', // i18n-exempt: 靜態 SEO <title>，Next.js metadata 唔跟 client locale
  description:
    '改寫版歷屆試題 + 即時等級預測。掌握邏輯，唔係背答案。涵蓋全部 DSE 科目，幫你用最輕鬆嘅方法溫書。', // i18n-exempt: 靜態 SEO meta description
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
      <body className={`${inter.className} min-h-screen bg-[#080C14] text-slate-100`}>
        <Providers>
          <Navbar />
          <main className="pt-16">{children}</main>
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
