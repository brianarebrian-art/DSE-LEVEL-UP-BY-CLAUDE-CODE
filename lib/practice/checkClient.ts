import type { McCheckResult, WrittenKeyResult } from '@/lib/practice/publicQuestion'

const snippets = new Map<string, string>()

export function rememberWrittenSnippet(id: string, text: string): void {
  if (text) snippets.set(id, text.slice(0, 120))
}

export function writtenSnippet(id: string): string {
  return snippets.get(id) ?? ''
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 20000)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    })
    if (!res.ok) throw new Error(`check_${res.status}`)
    return (await res.json()) as T
  } finally {
    clearTimeout(timer)
  }
}

export function fetchMcCheck(
  subjectId: string,
  questionId: string,
  chosenText: string,
): Promise<McCheckResult> {
  return postJson<McCheckResult>('/api/practice/check', {
    subjectId,
    questionId,
    chosenText,
  })
}

export async function fetchWrittenKey(
  subjectId: string,
  questionId: string,
  submittedText: string,
): Promise<WrittenKeyResult> {
  const key = await postJson<WrittenKeyResult>('/api/practice/check', {
    subjectId,
    questionId,
    submittedText,
  })
  rememberWrittenSnippet(questionId, key.referenceAnswer)
  return key
}
