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
function renderTex(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex.split(ESC).join('\\$'), {
      throwOnError: false,
      output: 'html',
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
