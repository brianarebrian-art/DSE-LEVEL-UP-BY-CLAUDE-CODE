import type { Metadata } from 'next'
import LevelUpPractice from './LevelUpPractice'

export const metadata: Metadata = {
  title: '10 題學習節 | DSE Level Up',
  description: '用一節短練習檢視判斷、睇清解析，再知道下一步點溫。',
}

export default function LevelUpPage() {
  return <LevelUpPractice />
}
