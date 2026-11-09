from playwright.sync_api import sync_playwright,expect
from datetime import datetime,timezone
import json
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox']);c=b.new_context(viewport={'width':390,'height':844},timezone_id='America/Sao_Paulo');page=c.new_page();page.clock.install(time=datetime(2026,11,5,18,0,tzinfo=timezone.utc));page.goto('http://127.0.0.1:5173');
 # Repeated correction inflates today headline.
 page.locator('#mission-read [data-mode="normal"]').first.click();page.wait_for_function('JSON.parse(localStorage.getItem("entre-trilhas-v1"))?.events.length===1');
 print('XP after normal',page.locator('.stat').nth(1).inner_text());
 page.locator('#mission-read [data-action="undo"]').first.click();page.locator('[data-action="confirm-undo"]').click();page.wait_for_function('JSON.parse(localStorage.getItem("entre-trilhas-v1"))?.events.length===2');
 print('XP after undo',page.locator('.stat').nth(1).inner_text(),'totalxp',page.evaluate('JSON.parse(localStorage.getItem("entre-trilhas-v1")).events.reduce((a,e)=>a+e.xp,0)'));
 # Focus lost on completion.
 btn=page.locator('#mission-read [data-mode="minimum"]');btn.focus();print('focus before',page.evaluate('document.activeElement.textContent'));btn.press('Enter');page.wait_for_function('JSON.parse(localStorage.getItem("entre-trilhas-v1"))?.events.length===3');print('focus after',page.evaluate('document.activeElement.tagName'));
 # Timer focus disappears on each tick.
 page.locator('#mission-dog-am [data-action="timer"]').click();page.locator('[data-action="timer-pause"]').focus();print('timer focus before',page.evaluate('document.activeElement.getAttribute("data-action")'));page.clock.fast_forward(1100);print('timer focus after',page.evaluate('document.activeElement.tagName'));
 print('sizes',page.locator('.complete-check').first.bounding_box());
 print('mission text css',page.locator('.mission p').first.evaluate('(e)=>({color:getComputedStyle(e).color,bg:getComputedStyle(e.closest(".mission")).backgroundColor,size:getComputedStyle(e).fontSize})'));
 # Force localStorage write failure; profile says save success.
 page.locator('[data-nav="settings"]').first.click();page.evaluate('() => { Storage.prototype.setItem=()=>{throw new DOMException("Quota exceeded","QuotaExceededError")}; return true; }');page.locator('#name').fill('Nome novo');page.locator('#profile-form button[type="submit"]').click();page.wait_for_timeout(100);print('save failure toast',page.locator('#toast').inner_text());print('name stored',page.evaluate('JSON.parse(localStorage.getItem("entre-trilhas-v1")).config.name'));
 b.close()
