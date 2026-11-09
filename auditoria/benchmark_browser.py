from playwright.sync_api import sync_playwright
import json
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);
 for days in (30,365,1095):
  page=b.new_page();page.goto('http://127.0.0.1:5173');raw=open(f'/tmp/vida-audit-{days}.json').read();page.evaluate('raw=>localStorage.setItem("entre-trilhas-v1",raw)',raw);page.reload()
  print(days,'records',page.evaluate('Object.keys(JSON.parse(localStorage.getItem("entre-trilhas-v1")).records).length'))
  for screen in ('today','history','character'):
   duration=page.evaluate('screen=>{const start=performance.now();document.querySelector(`[data-nav="${screen}"]`).click();return performance.now()-start}',screen)
   print(days,screen,'render',round(duration,1),'ms')
  page.close()
 b.close()
