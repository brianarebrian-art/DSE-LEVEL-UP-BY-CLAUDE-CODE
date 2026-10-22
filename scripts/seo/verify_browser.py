#!/usr/bin/env python3
"""Read-only Chromium viewport checks; not real-user CWV or a full WCAG audit."""
import argparse
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

ROUTES = ['/', '/dse-maths', '/dse-maths/quadratic-equations', '/dse-english', '/dse-english/writing-format', '/ai/practice-generator', '/ai/study-plan', '/ai/past-paper-explainer', '/dse-maths/question-types/quadratic-discriminant', '/dse-physics/motion-equations']

JS = r"""() => {
 const visible = e => { const r=e.getBoundingClientRect(); const s=getComputedStyle(e); return r.width>0 && r.height>0 && s.visibility!=='hidden' && s.display!=='none'; };
 const width = document.documentElement.clientWidth;
 const overflowing = [...document.querySelectorAll('main,article,section,header,p,h1,h2,table')].filter(visible).filter(e => {
   const r=e.getBoundingClientRect();
   return r.left < -1 || r.right > width+1;
 }).map(e=>({tag:e.tagName,text:e.textContent.trim().slice(0,100),scrollableAncestor:!!e.closest('.overflow-x-auto')}));
 return {viewport:width,scrollWidth:document.documentElement.scrollWidth,h1:[...document.querySelectorAll('h1')].filter(visible).map(e=>e.textContent),mainCount:document.querySelectorAll('main').length,mainIdCount:document.querySelectorAll('#main-content').length,overflowing,tables:[...document.querySelectorAll('table')].map(e=>({width:e.getBoundingClientRect().width,scrollable:!!e.closest('.overflow-x-auto')})),images:[...document.querySelectorAll('img')].map(e=>({alt:e.getAttribute('alt'),loaded:e.complete&&e.naturalWidth>0})),dialogs:[...document.querySelectorAll('[role=dialog]')].filter(visible).map(e=>e.textContent.slice(0,200)),textLength:document.querySelector('main')?.innerText.length||0};
}"""

def main():
    cli=argparse.ArgumentParser()
    cli.add_argument('--origin',required=True)
    cli.add_argument('--output',required=True)
    args=cli.parse_args()
    out=Path(args.output);out.mkdir(parents=True,exist_ok=True)
    results=[]
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
        for width,height in [(390,844),(768,1024),(1440,1000)]:
            context=browser.new_context(viewport={'width':width,'height':height},device_scale_factor=1)
            for route in ROUTES:
                page=context.new_page(); errors=[]
                page.on('pageerror',lambda e:errors.append(str(e)))
                response=page.goto(args.origin.rstrip('/')+route,wait_until='networkidle',timeout=60000)
                page.wait_for_timeout(300)
                record=page.evaluate(JS)
                record.update(path=route,status=response.status,width=width,errors=errors)
                focus=[]
                for _ in range(8):
                    page.keyboard.press('Tab')
                    focus.append(page.evaluate("() => {const e=document.activeElement,s=getComputedStyle(e);return {tag:e.tagName,text:e.textContent.slice(0,60),outline:s.outline,boxShadow:s.boxShadow}}"))
                record['keyboard_focus']=focus
                record['issues']=[]
                if len(record['h1'])!=1:record['issues'].append('visible H1 count differs from 1')
                if record['mainCount']!=1 or record['mainIdCount']!=1:record['issues'].append('main landmark or ID duplicated/missing')
                if record['scrollWidth']>width+1:record['issues'].append('document horizontal overflow')
                if any(not e['scrollableAncestor'] for e in record['overflowing']):record['issues'].append('uncontained content exceeds viewport')
                if errors:record['issues'].append('browser runtime exception')
                prefix=(route.strip('/').replace('/','__')or'home')+f'-{width}'
                page.evaluate('window.scrollTo(0, 0)')
                page.wait_for_timeout(100)
                page.screenshot(path=str(out/(prefix+'.png')),full_page=True)
                page.screenshot(path=str(out/(prefix+'-viewport.png')),full_page=False)
                record['screenshot']=str(out/(prefix+'.png'))
                if width==390 and page.locator('table').count():
                    page.locator('table').first.screenshot(path=str(out/(prefix+'-table.png')))
                results.append(record);page.close()
                print(f'{width}px {route}: '+str(record['issues']),flush=True)
            context.close()
        browser.close()
    (out/'browser-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
    print(f'{len(results)} viewport checks saved to {out}')
    raise SystemExit(1 if any(r['issues']for r in results)else 0)

if __name__=='__main__':main()
