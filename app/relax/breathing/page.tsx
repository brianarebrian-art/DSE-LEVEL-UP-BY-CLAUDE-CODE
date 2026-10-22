import { completeSeoMetadata } from '@/lib/seo'
import BreathingExercise from '../components/BreathingExercise'

// /relax/breathing — 全屏 4-7-8 呼吸（語音引導）。

export const metadata = completeSeoMetadata({
  title: '呼吸練習 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '跟隨可隨時停止的 4-7-8 呼吸動畫與語音節奏，在溫習或考前需要短暫停頓時自行調整步伐；工具支援關閉動態效果，亦不收集或儲存你的回答、情緒資料或健康狀態，不提供醫療診斷、治療或危機介入，如感到不安全應向可信任人士或當地緊急服務求助。完成後可自行返回原來學習頁面，沒有連續使用、完成次數或表現紀錄要求。', // i18n-exempt: zh-Hant fixed search metadata
}, '/relax/breathing')

export default function RelaxBreathingPage() {
  return <BreathingExercise />
}
