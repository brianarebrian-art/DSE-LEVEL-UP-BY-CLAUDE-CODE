import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,existsSync} from 'node:fs'
const pick=<T,>(m:T):T=>((m as {default?:T}).default??m)
const {notePdfResponse}=pick(await import('../notes/pdfRequest.ts'))
const {createNotePdf}=pick(await import('../notes/pdfDocument.ts'))
const {getStudyNote}=pick(await import('../notes/studyNotes.ts'))

test('PDF API rejects unknown subjects/topics and traversal before reading assets',async()=>{
 for(const [s,t] of [['missing','topic'],['math','../../etc/passwd'],['../math','quadratic_equations'],['math','']]){
  const response=await notePdfResponse(s,t)
  assert.equal(response.status,404)
 }
})
test('topic download returns a real PDF attachment with UTF-8 filename, not an HTML print page',async()=>{
 const r=await notePdfResponse('physics','mechanics')
 assert.equal(r.status,200)
 assert.equal(r.headers.get('Content-Type'),'application/pdf')
 assert.match(r.headers.get('Content-Disposition')??'',/attachment; filename="physics-notes.pdf"; filename\*=UTF-8''/)
 assert.match(r.headers.get('Content-Disposition')??'',new RegExp(encodeURIComponent('自學筆記')))
 assert.match(r.headers.get('Cache-Control')??'',/s-maxage=86400/)
 const b=Buffer.from(await r.arrayBuffer())
 assert.equal(b.subarray(0,5).toString(),'%PDF-')
 assert.ok(b.length>10000&&b.length<1000000)
})
test('single-topic renderer handles chemistry subscripts and embeds fonts',async()=>{
 const n=await getStudyNote('chemistry','organic');assert.ok(n)
 const b=await createNotePdf({subjectName:'化學',notes:[n],date:'22/11/2026'})
 assert.match(b.toString('latin1'),/\/FontFile2/)
})
test('subject collection is an actual PDF attachment covering registered notes',async()=>{
 const r=await notePdfResponse('m2',null)
 assert.equal(r.status,200)
 assert.match(r.headers.get('Content-Disposition')??'',new RegExp(encodeURIComponent('課題摘要合集')))
 assert.equal(Buffer.from(await r.arrayBuffer()).subarray(0,5).toString(),'%PDF-')
})
test('PDF renderer bounds work and does not accept external diagram sources',async()=>{
 await assert.rejects(()=>createNotePdf({subjectName:'test',notes:[],date:'today'}),/topic count/)
 const n=await getStudyNote('physics','mechanics');assert.ok(n)
 await assert.rejects(()=>createNotePdf({subjectName:'test',notes:[{...n,explainerSrc:'https://example.test/secret.svg'}],date:'today'}),/diagram asset/)
})
test('outlined diagram retains accessible labels without SVG text font dependencies',()=>{
 const svg=readFileSync('public/explainers/math-quadratic-study.svg','utf8')
 assert.doesNotMatch(svg,/<text\b/)
 assert.match(svg,/aria-label="頂點 \(2, −1\)"/)
 assert.ok(existsSync('assets/fonts/WenQuanYi-LICENSE.txt'))
 assert.match(readFileSync('assets/fonts/WenQuanYi-LICENSE.txt','utf8'),/embed this font/)
 const config=readFileSync('next.config.ts','utf8')
 assert.match(config,/'\/api\/notes-pdf\/\*': \['\.\/assets\/fonts\/\*\*'/)
})
