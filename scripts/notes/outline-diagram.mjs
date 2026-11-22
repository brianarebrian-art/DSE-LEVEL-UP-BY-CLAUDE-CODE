// Reproducible original SVG: outlines avoid missing CJK glyphs in image documents.
import {openSync} from 'fontkit'
import {readFileSync,writeFileSync} from 'node:fs'
const collection=openSync('assets/fonts/wqy-zenhei.ttc')
const font=collection.getFont('WenQuanYiZenHei')
let svg=readFileSync('scripts/notes/math-quadratic-source.svg','utf8')
svg=svg.replace(/<text\b([^>]*)>([^<]*)<\/text>/g,(_,attrs,text)=>{
  const x=Number(attrs.match(/\bx="([^"]+)"/)?.[1]??0),y=Number(attrs.match(/\by="([^"]+)"/)?.[1]??0)
  const size=Number(attrs.match(/font-size="([^"]+)"/)?.[1]??16),scale=size/font.unitsPerEm
  const run=font.layout(text)
  let at=0
  const paths=run.glyphs.map((glyph,i)=>{const pos=run.positions[i];const d=glyph.path.toSVG();const path=`<path d="${d}" transform="translate(${x+(at+pos.xOffset)*scale} ${y-pos.yOffset*scale}) scale(${scale} ${-scale})"/>`;at+=pos.xAdvance;return path}).join('')
  return `<g aria-label="${text}">${paths}</g>`
})
writeFileSync('public/explainers/math-quadratic-study.svg',svg)
console.log('CJK labels outlined; original source and embedding licence retained')
