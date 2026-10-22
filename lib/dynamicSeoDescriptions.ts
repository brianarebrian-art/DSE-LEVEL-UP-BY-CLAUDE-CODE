type SubjectInput = {
  name: string
  description: string
  questionCount: number
  topicCount: number
}

type CantoneseInput = {
  title: string
  why: string
  phraseCount: number
  wordCount: number
}

type OffSyllabusInput = {
  title: string
  cardCount: number
}

type SourceLabInput = {
  title: string
  date: string
  place: string
  factCount: number
  perspectiveCount: number
  positionCount: number
}

const MIN_DESCRIPTION_LENGTH = 150
const MAX_DESCRIPTION_LENGTH = 160

/** Counts Unicode code points rather than UTF-16 code units. */
export function unicodeCodePointLength(value: string): number {
  return Array.from(value).length
}

/**
 * Appends only complete, independently meaningful sentences. This deliberately
 * never slices text to meet a character target: metadata must not end mid-sentence.
 */
function completeDescription(base: string, sentences: string[]): string {
  const baseLength = unicodeCodePointLength(base)
  if (baseLength >= MIN_DESCRIPTION_LENGTH && baseLength <= MAX_DESCRIPTION_LENGTH) return base

  const combinations: string[] = []
  const visit = (index: number, current: string[]) => {
    const candidate = [base, ...current].join('')
    const length = unicodeCodePointLength(candidate)
    if (length >= MIN_DESCRIPTION_LENGTH && length <= MAX_DESCRIPTION_LENGTH) {
      combinations.push(candidate)
      return
    }
    if (length > MAX_DESCRIPTION_LENGTH || index === sentences.length) return

    visit(index + 1, [...current, sentences[index]])
    visit(index + 1, current)
  }

  visit(0, [])
  if (combinations.length > 0) return combinations[0]

  throw new Error(`No complete metadata description between ${MIN_DESCRIPTION_LENGTH} and ${MAX_DESCRIPTION_LENGTH} code points; base length: ${baseLength}`)
}

export function subjectSeoDescription({ name, description, questionCount, topicCount }: SubjectInput): string {
  return completeDescription(
    `DSE Level Up 的${name}頁收錄${questionCount}條原創改寫題目，按${topicCount}個課題整理；${description}`,
    [
      '可從課題入口選擇練習，答案與解析用於核對概念和解題步驟。',
      '內容並非香港考試及評核局官方試題或評分參考，應配合課本和教師指引溫習。',
      '頁面按實際題庫顯示題數與課題，未提供的卷別或技能不作涵蓋聲稱。',
      '先閱讀本頁列出的範圍，再按自己的溫習需要選擇下一項練習。',
      '本頁以題庫資料為準。',
      '可按課題安排溫習次序。',
      '先釐清自己的溫習重點。',
    ],
  )
}

export function notesSeoDescription({ name, questionCount, topicCount }: Omit<SubjectInput, 'description'>): string {
  return completeDescription(
    `DSE Level Up 的${name}知識凝結筆記按${topicCount}個課題編排，頁面現有${questionCount}條獨立改寫題目，著重整理重點與常見陷阱。`,
    [
      '可由課題入口閱讀筆記，再連到同一課題的練習。',
      '題數及課題列表均按已上載資料顯示。',
      '所有題目均為原創改寫，並非香港考試及評核局官方試題或官方評分安排。',
      '筆記只供溫習參考，應配合課本、課堂和教師指引使用。',
      '可按需要溫習。',
      '並可重點回看陷阱。',
    ],
  )
}

export function cantoneseSeoDescription({ title, why, phraseCount, wordCount }: CantoneseInput): string {
  return completeDescription(
    `「${title}」是新來港・香港日常廣東話的生活場景頁：${why}頁面提供${phraseCount}句常用表達和${wordCount}個詞語，逐項附粵拼、普通話、英文及用法提示。`,
    [
      '另有學習提示，幫助普通話使用者辨認香港日常說法。',
      '這是獨立的生活語言支援內容，與中國語文科和任何 DSE 科目無關。',
      '詞語表把常見字詞拆開，方便在別的情境重新組合。',
      '可先按場景熟習實用用語，再因應真實對話調整語氣。',
      '可按需要選讀。',
    ],
  )
}

export function offSyllabusSeoDescription({ title, cardCount }: OffSyllabusInput): string {
  return completeDescription(
    `「${title}」是不考之地的分類頁，收錄${cardCount}張可展開閱讀的知識卡。頁面以生活場景、對白、解密、冷知識和吹水話題呈現內容。`,
    [
      '此區純粹為樂趣而學，不設計分、測驗或進度紀錄。',
      '卡片可供閱讀和討論，內容不取代專業建議或正式課程材料。',
      '冷知識由 AI 協助撰寫，並非每項均經專家逐條查證。',
      '閱讀時宜自行核實重要資訊。',
    ],
  )
}

export function sourceLabSeoDescription({ title, date, place, factCount, perspectiveCount, positionCount }: SourceLabInput): string {
  return completeDescription(
    `「${title}」是史料判讀室的 DSE 歷史科卷一資料題訓練頁，涵蓋${factCount}項事實、${perspectiveCount}種詮釋及${positionCount}項立場；頁面標示的時間為${date}，地點為${place}。`,
    [
      '頁面把文獻所載、不同解釋和各方立場分層呈現，避免把其中一項當作唯一結論。',
      '按三層資料比較證據，再判斷哪個說法較受資料支持。',
      '引用前請查核來源；標示「來源待查」者不可作答題依據。',
      '此頁只訓練判讀，不提供預設的標準結論。',
    ],
  )
}
