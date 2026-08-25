import type { KnowledgeCard } from './types'
import { SENSEI_SUBJECTS, type SenseiSubject } from './types'

// 逐科動態 import，沿用 data/questions/load.ts 的模式。
// 使用經濟科的學生只會下載經濟科卡片，不會一併載入其餘三科。
// 這就是「舊 Android 亦能即時開啟」的實際做法：沒有模型下載、沒有網絡往返。

type Loader = () => Promise<KnowledgeCard[]>

const loaders: Record<SenseiSubject, Loader> = {
  chinese: async () => (await import('./chinese')).chineseSenseiCards,
  english: async () => (await import('./english')).englishSenseiCards,
  math: async () => (await import('./math')).mathSenseiCards,
  economics: async () => (await import('./economics')).economicsSenseiCards,
}

export function isSenseiSubject(id: string): id is SenseiSubject {
  return (SENSEI_SUBJECTS as readonly string[]).includes(id)
}

export async function loadSenseiCards(subject: string): Promise<KnowledgeCard[]> {
  if (!isSenseiSubject(subject)) return []
  return loaders[subject]()
}
