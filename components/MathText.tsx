'use client'

import { useMemo } from 'react'
import katex from 'katex'

interface MathTextProps {
  children: string
  className?: string
}

// Placeholder for escaped dollar signs (\$) so they aren't treated as math delimiters.
const ESC = ' DLR '

// HTML-escape literal (non-math) text before it reaches dangerouslySetInnerHTML.
// Without this, a stray "<" / ">" in question text -- an inequality written outside
// a $...$ span, or anything AI-generated -- would be parsed as HTML: a rendering bug
// AND an XSS vector. (KaTeX output for math spans is already safe HTML; trust:false
// by default disables \href / \includegraphics / etc.)
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Render one KaTeX segment (inline or display). displayMode emits a
// `<span class="katex-display">` (centred block), which nests validly in our span.
//
// ⚠️ output 必須係 'htmlAndMathml'（KaTeX 預設），唔可以係 'html'。
// 2026-08-21 之前呢度寫住 'html' —— 咁樣 KaTeX 只出視覺用嘅 <span> 堆疊，
// 完全冇 MathML。螢幕閱讀器讀到嘅係一串散開嘅符號同數字（「x 2 + 3 x − 4 = 0」
// 讀成逐個字元），對盲人或者用 VoiceOver 嘅讀寫障礙學生嚟講，等於成條數學題
// 讀唔到。'htmlAndMathml' 會多出一個 `<span class="katex-mathml">`（內含 MathML，
// 視覺上隱藏）同埋 `aria-hidden` 嘅視覺層 —— 螢幕閱讀器讀 MathML，眼睛睇 HTML。
// 代價：每條數式多幾百 bytes。呢個代價唔值得慳。
function renderTex(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex.split(ESC).join('\\$'), {
      throwOnError: false,
      output: 'htmlAndMathml',
      displayMode,
    })
  } catch {
    return escapeHtml(tex.split(ESC).join('$'))
  }
}

function renderMathText(text: string): string {
  // Protect escaped dollars (currency like \$1600) before splitting on math delimiters.
  const protectedText = text.replace(/\\\$/g, ESC)

  // Tokenise on $$...$$ (display) OR $...$ (inline). The capturing group keeps the
  // delimited tokens; everything else is literal text. Display is tried first via
  // alternation order so $$ is never mis-parsed as two empty inline spans.
  const parts = protectedText.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/g)
  let out = ''
  for (const part of parts) {
    if (part.length > 4 && part.startsWith('$$') && part.endsWith('$$')) {
      out += renderTex(part.slice(2, -2), true)
    } else if (part.length > 2 && part.startsWith('$') && part.endsWith('$')) {
      out += renderTex(part.slice(1, -1), false)
    } else {
      // Literal text -> MUST be HTML-escaped before it goes into innerHTML.
      out += escapeHtml(part.split(ESC).join('$'))
    }
  }
  return out
}

export default function MathText({ children, className }: MathTextProps) {
  const html = useMemo(() => renderMathText(children), [children])
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
