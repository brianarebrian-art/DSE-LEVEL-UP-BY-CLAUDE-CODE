import type { KnowledgeCard } from '../types'
import { englishBatch1P2RegisterCards } from './reviewed/batch1-p2-register'
import { englishBatch1P3IntegratedCards } from './reviewed/batch1-p3-integrated'

// english 科 SENSEI 知識卡片。
//
// 本檔由 scripts/qbank/sensei-golive.mjs 產生，但【刻意保留明文 import】——
// 並非以 glob 自動掃描 reviewed/ 目錄。因此新增一個已批准檔案並不會自動
// 出現在學生面前，仍須有人再次執行上線指令。憲章 §12：機器永不自動入庫。
export const englishSenseiCards: KnowledgeCard[] = [
  ...englishBatch1P2RegisterCards,
  ...englishBatch1P3IntegratedCards,
]
