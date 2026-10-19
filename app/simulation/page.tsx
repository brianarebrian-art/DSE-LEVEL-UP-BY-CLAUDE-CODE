import type { Metadata } from 'next'
import SimulationClient from './SimulationClient'

export const metadata: Metadata = {
  title: '學習行為模擬 | DSE Level Up',
  description: '以 Vercel AI Gateway 近似多代理模擬，檢視學生學習行為與 DSE Level Up SOP 決策。',
  robots: { index: false, follow: false },
}

export default function SimulationPage() {
  return <SimulationClient />
}
