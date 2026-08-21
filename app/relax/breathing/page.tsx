import BreathingExercise from '../components/BreathingExercise'

// /relax/breathing — 全屏 4-7-8 呼吸（語音引導）。
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '呼吸練習 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  // i18n-exempt: 靜態 SEO description，唔跟 client locale（標記須同行，故此句唔換行）
  description: '4-7-8 呼吸法動畫，可隨時停止、可關動態效果。本工具唔會儲存你嘅任何回答。', // i18n-exempt
}

export default function RelaxBreathingPage() {
  return <BreathingExercise />
}
