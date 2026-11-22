import PDFDocument from 'pdfkit'
import SVGtoPDF from 'svg-to-pdfkit'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { mathjax } from 'mathjax-full/js/mathjax.js'
import { TeX } from 'mathjax-full/js/input/tex.js'
import { SVG } from 'mathjax-full/js/output/svg.js'
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js'
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js'
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js'
import type { StudyNote } from '@/data/notes/types'
import { TOPIC_LESSONS } from '@/data/notes/lessons'
import { topicExplainerSrc } from '@/data/notes/explainers'
import { topicLearningUrl } from '@/lib/notes/topicLearning'
import { encodeQR } from '@/lib/paper/qr'

const adaptor = liteAdaptor()
RegisterHTMLHandler(adaptor)
// Only repository-owned content is rendered; never accept arbitrary user TeX or SVG.
const math = mathjax.document('', {InputJax:new TeX({packages:AllPackages}),OutputJax:new SVG({fontCache:'none'})})
const LEFT=48, WIDTH=499, BOTTOM=780
export interface NotePdfInput {subjectName:string; notes:StudyNote[]; date:string}

export async function createNotePdf({subjectName,notes,date}:NotePdfInput):Promise<Buffer> {
  if(!notes.length || notes.length>50) throw new Error('Invalid PDF topic count')
  const doc=new PDFDocument({size:'A4',margins:{top:48,bottom:62,left:LEFT,right:48},bufferPages:true,autoFirstPage:false,info:{Title:`${subjectName}自學筆記${notes.length>1?'合集':''}`,Author:'DSE Level Up',Subject:'現有課題摘要與待覆核教材；並非完整教科書',Creator:'DSE Level Up'}})
  const chunks:Buffer[]=[]
  const result=new Promise<Buffer>((resolve,reject)=>{doc.on('data',(chunk:Buffer)=>chunks.push(chunk));doc.on('end',()=>resolve(Buffer.concat(chunks)));doc.on('error',reject)})
  doc.registerFont('Chinese',path.join(process.cwd(),'assets/fonts/wqy-zenhei.ttc'),'WenQuanYiZenHei')
  let y=48
  const pageTitles:string[]=[]
  let pageTitle=subjectName
  doc.on('pageAdded',()=>pageTitles.push(pageTitle))
  function newPage(){doc.addPage();doc.font('Chinese');y=48;}
  function room(height:number){if(y+height>BOTTOM)newPage()}
  function text(value:string,size=11,color='#173d36') {
    doc.font('Chinese').fontSize(size)
    // PDFKit wraps CJK text and embeds only glyphs used in this document.
    const paragraphs=value.replace(/−/g,'-').split('\n')
    for(const paragraph of paragraphs){
      const height=doc.heightOfString(paragraph,{width:WIDTH,lineGap:4})
      room(Math.min(height,100))
      doc.fillColor(color).text(paragraph,LEFT,y,{width:WIDTH,lineGap:4})
      y=doc.y+8
    }
  }
  function heading(value:string){room(64);text(value,16);}
  function svg(value:string,width:number,height:number,x=LEFT){
    room(height+10)
    SVGtoPDF(doc,value,x,y,{width,height,assumePt:true,fontCallback:()=> 'Chinese',imageCallback:()=>{throw new Error('External PDF image denied')},documentCallback:()=>{throw new Error('External PDF document denied')}})
    y+=height+12
  }
  function rich(value:string){
    for(const fragment of value.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+\$)/g).filter(Boolean)){
      if(!fragment.startsWith('$')){text(fragment);continue}
      const tex=fragment.replace(/^\$\$?|\$\$?$/g,'').replace(/_([A-Za-z0-9])/g,'_{$1}')
      const node=math.convert(tex,{display:true})
      let source=adaptor.outerHTML(node)
      source=source.slice(source.indexOf('<svg'),source.lastIndexOf('</svg>')+6)
      if(source.includes('data-mjx-error')||source.includes('data-mml-node="merror"'))throw new Error('Invalid source formula: '+tex)
      const viewBox=source.match(/viewBox="([^"]+)"/)?.[1].split(/\s+/).map(Number)
      if(!viewBox || !viewBox[2] || !viewBox[3])throw new Error('Invalid formula dimensions')
      const h=Math.max(20,Math.min(58,viewBox[3]/1000*13))
      const w=Math.min(WIDTH,h*viewBox[2]/viewBox[3])
      source=source.replace(/width="[^"]+"/,'width="'+w+'"').replace(/height="[^"]+"/,'height="'+h+'"')
      svg(source,w,h)
    }
  }
  if(notes.length>1){newPage();heading(`${subjectName}自學筆記合集`);text(`收錄 ${notes.length} 個現有課題摘要／待覆核教材。不是已完成教研審核的完整教科書。`);text(`生成日期：${date}（香港）`);heading('課題目錄');notes.forEach((n,i)=>text(`${i+1}. ${n.titleZh}`));}
  for(const note of notes){
    pageTitle=`${subjectName}｜${note.titleZh}`;newPage();heading(`${note.titleZh}自學筆記`);text(subjectName);text(`生成日期：${date}（香港）`)
    const lesson=TOPIC_LESSONS[`${note.subjectId}:${note.topicId}`]
    text(lesson?`編輯草稿；更新 ${lesson.updated}。未經註冊教師審定。`:'既有課題摘要；完整教材與學科覆核尚未完成。',10,'#526660')
    heading('核心概念');rich(note.conceptZh)
    if(lesson){heading('學習目標');lesson.objectives.forEach((x,i)=>rich(`${i+1}. ${x}`))}
    const image=note.subjectId==='math'&&note.topicId==='quadratic_equations'?'/explainers/math-quadratic-study.svg':topicExplainerSrc(note.subjectId,note.topicId,note.explainerSrc)
    if(image){
      // Registry-owned paths only. No request path or URL is passed to fs.
      if(!/^\/explainers\/[a-z0-9-]+\.svg$/.test(image))throw new Error('Invalid diagram asset')
      const source=await readFile(path.join(process.cwd(),'public',image),'utf8')
      const vb=source.match(/viewBox="([^"]+)"/)?.[1].split(/\s+/).map(Number)
      const height=vb?.[2]&&vb?.[3]?Math.min(290,WIDTH*vb[3]/vb[2]):240
      svg(source,WIDTH,height)
    }
    heading('重點整理');note.mustKnowZh.forEach((x,i)=>rich(`${i+1}. ${x}`))
    heading('應用提示');rich(note.examTipZh)
    if(lesson){
      heading('關鍵詞彙與公式');lesson.vocabulary.forEach(x=>rich(`${x.term}：${x.definition}`))
      for(const ex of lesson.examples){heading(ex.title);rich(ex.question);ex.steps.forEach((x,i)=>rich(`${i+1}. ${x}`));rich(`核對：${ex.check}`)}
      heading('自我檢查與參考答案');lesson.checks.forEach(x=>{rich(x.question);rich(`參考答案：${x.answer}`)})
      heading('延伸思考與挑戰');rich(lesson.challenge.question);lesson.challenge.steps.forEach((x,i)=>rich(`${i+1}. ${x}`))
    }
    heading('常見錯誤與注意事項');rich(note.commonTrapZh)
    newPage();heading('立即做練習');text(`${subjectName}｜${note.titleZh}`);text('掃描 QR 碼，選擇難度並開始本課題練習。')
    const url=topicLearningUrl(note.subjectId,note.topicId)
    const matrix=encodeQR(url),span=matrix.length+8,size=156,cell=size/span,x=(doc.page.width-size)/2
    room(size+90);doc.rect(x,y,size,size).fill('#ffffff')
    for(let r=0;r<matrix.length;r++)for(let c=0;c<matrix.length;c++)if(matrix[r][c])doc.rect(x+(c+4)*cell,y+(r+4)*cell,cell,cell).fill('#000000')
    y+=size+24;text(url,10);text('全部功能免費；題目為獨立改寫版本，並非香港考試及評核局官方試題。',10)
    text('此為正式網址；新功能正式部署前可能尚未開放。',10)
  }
  const range=doc.bufferedPageRange()
  for(let i=range.start;i<range.start+range.count;i++){
    doc.switchToPage(i)
    doc.page.margins.bottom=0
    doc.font('Chinese').fontSize(8).fillColor('#526660').text(`${pageTitles[i]}　｜　${i+1} / ${range.count}`,LEFT,806,{width:WIDTH,align:'center',lineBreak:false})
  }
  doc.end()
  return result
}
