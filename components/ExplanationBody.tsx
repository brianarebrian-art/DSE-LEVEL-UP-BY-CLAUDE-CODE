'use client'

import MathText from '@/components/MathText'
import { isGenericWritingGuide } from '@/lib/genericWritingGuide'
import { useLocale } from '@/lib/i18n'

// When the stored explanation is the shared writing boilerplate, show that fact
// instead of the paragraph. The paragraph mentions calculation steps and what
// markers reward, which reads as a mark scheme for this item. It is not.
export default function ExplanationBody({ text }: { text: string }) {
  const { locale } = useLocale()
  const en = locale === 'en'
  if (isGenericWritingGuide(text)) {
    return (
      <p>
        {en
          ? 'This note is reused across questions. It is not a mark scheme for this question, and it was not written for this item. Compare your own working with the reference answer.'
          : '呢段係各題共用嘅自評方向，唔係呢題嘅評卷參考，亦冇逐題核對過。請對照參考答案自己判斷。'}
      </p>
    )
  }
  return <MathText>{text}</MathText>
}
