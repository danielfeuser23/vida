from playwright.sync_api import sync_playwright
from pathlib import Path
from urllib.parse import urlparse
root=Path(__file__).resolve().parent.parent
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);page=b.new_page()
 def serve(route):
  name=urlparse(route.request.url).path.lstrip('/') or 'index.html';f=root/name
  if not f.is_file():route.fulfill(status=404,body='');return
  ext=f.suffix;route.fulfill(status=200,content_type={'.html':'text/html','.js':'text/javascript','.css':'text/css'}.get(ext,'text/plain'),body=f.read_bytes())
 page.route('http://entretrilhas.test/**',serve)
 page.goto('http://entretrilhas.test/')
 print('secure context',page.evaluate('isSecureContext'),'uuid',page.evaluate('typeof crypto.randomUUID'))
 page.locator('#mission-read [data-mode="minimum"]').click();page.wait_for_timeout(200)
 print('toast',page.locator('#toast').inner_text(),'localstorage',page.evaluate('localStorage.getItem("entre-trilhas-v1")'))
 page.locator('[data-nav="shop"]').first.click();errs=[];page.on('pageerror',lambda e:errs.append(str(e)));page.locator('[data-action="buy"]').first.click();print('buy errors',errs)
 b.close()
