"""Teste funcional real: requer playwright e Chromium, servidor na porta 5173."""
from playwright.sync_api import sync_playwright, expect
from datetime import datetime, timezone
import json
KEY='entre-trilhas-v1'
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':1440,'height':1000},timezone_id='America/Sao_Paulo',reduced_motion='reduce')
    page=context.new_page()
    errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.clock.install(time=datetime(2026,11,5,18,0,0,tzinfo=timezone.utc))
    page.goto('http://127.0.0.1:5173')
    expect(page.locator('.mission')).to_have_count(7)
    def data(): return page.evaluate('(key)=>JSON.parse(localStorage.getItem(key))',KEY)
    def totals(): return tuple(sum(e[k] for e in data()['events']) for k in ('xp','coins'))
    def wait_totals(xp,coins):
        page.wait_for_function('([key,xp,coins])=>{const s=JSON.parse(localStorage.getItem(key));return s&&s.events.reduce((a,e)=>a+e.xp,0)===xp&&s.events.reduce((a,e)=>a+e.coins,0)===coins}',arg=[KEY,xp,coins])
    def nav(name): page.locator('[data-nav="'+name+'"]').first.click()
    # Minimum -> normal grants only the difference, reload persists.
    page.locator('#mission-read [data-mode="minimum"]').click()
    wait_totals(5,2)
    assert totals()==(5,2)
    page.locator('#mission-read [data-mode="normal"]').first.click()
    wait_totals(10,5)
    assert totals()==(10,5)
    page.reload()
    expect(page.locator('#mission-read')).to_have_class('mission done')
    wait_totals(10,5)
    assert totals()==(10,5)
    # Three more records fund a reward.
    for mid in ('dog-am','walk-am','dog-pm'):
        page.locator(f'#mission-{mid} [data-action="complete"]').first.click()
    wait_totals(50,19)
    assert totals()==(50,19)
    # Real UI purchase, persistence, one refund only, history survives.
    nav('shop')
    page.locator('[data-action="buy"][data-id="video"]').click()
    page.locator('#reward-start').fill('21:30')
    page.locator('#buy-form button[type=submit]').click()
    expect(page.locator('#modal')).not_to_be_visible()
    wait_totals(50,4)
    assert totals()==(50,4)
    assert len(data()['purchases'])==1
    page.reload()
    nav('shop')
    page.locator('[data-action="cancel"]').click()
    wait_totals(50,19)
    assert totals()==(50,19)
    assert data()['purchases'][0]['status']=='cancelled'
    # Python practice and phase are independent: one budget, actual exercises.
    nav('today')
    page.locator('#mission-python [data-mode="normal"]').first.click()
    page.locator('#session-form [name="minutes"]').fill('120')
    page.locator('#session-form [name="goal"]').fill('Praticar o primeiro programa')
    page.locator('#session-form [name="exercises"]').fill('4')
    page.locator('#session-form [type="submit"]').click()
    expect(page.locator('#modal')).not_to_be_visible()
    wait_totals(170,55)
    assert data()['lessons']==[]
    nav('python')
    page.locator('[data-lesson="1"]').click()
    page.locator('#criterion-check').check()
    page.locator('[data-action="finish-lesson"]').click()
    expect(page.locator('#modal')).not_to_be_visible()
    assert data()['lessons']==[{'id':1,'day':'2026-11-05','exercises':0,'project':False}]
    sessions=[a for a in data()['study']['actions'] if 'minutes' in a and 'goal' in a]
    assert len(sessions)==1
    assert sessions[0]['minutes']==120
    assert sessions[0]['exercises']==4
    wait_totals(170,55)
    assert totals()==(170,55)
    # Export and restore from an actual downloaded JSON, after a correction.
    nav('settings')
    with page.expect_download() as info: page.locator('[data-action="export"]').click()
    download=info.value
    backup=download.path()
    saved=json.loads(open(backup).read())
    assert len(saved['lessons'])==1
    assert saved['study']==data()['study']
    nav('today')
    page.locator('#mission-read [data-action="undo"]').first.click()
    page.locator('[data-action="confirm-undo"]').click()
    wait_totals(160,50)
    assert totals()==(160,50)
    nav('settings')
    page.locator('#import-file').set_input_files(backup)
    expect(page.locator('#modal')).to_be_visible()
    page.locator('[data-action="confirm-import"]').click()
    expect(page.locator('#modal')).not_to_be_visible()
    wait_totals(170,55)
    assert totals()==(170,55)
    # Invalid backup is rejected without overwriting current progress.
    page.locator('#import-file').set_input_files({'name':'bad.json','mimeType':'application/json','buffer':b'{"version":1}'})
    wait_totals(170,55)
    assert totals()==(170,55)
    expect(page.locator('#toast')).to_contain_text('Backup inválido')
    # Sao Paulo midnight: 02:59:59 UTC still previous day; 03:00 next day.
    nav('today')
    page.clock.fast_forward(9*60*60*1000+1000)
    expect(page.locator('#mission-read')).not_to_have_class('mission done')
    assert '2026-11-05:read' in data()['records']
    assert len(data()['lessons'])==1
    wait_totals(170,55)
    assert totals()==(170,55)
    # Responsive layouts on all screens, no horizontal overflow.
    page.set_viewport_size({'width':390,'height':844})
    for screen in ('today','character','python','shop','history','settings'):
        nav(screen)
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'),screen
        assert page.locator('h1').count()>0
    nav('today')
    page.screenshot(path='/tmp/entre-trilhas-mobile.png',full_page=True)
    assert not errors,errors
    print('PASS: missão, mínimo→normal, persistência, compra, reembolso, Python, correção, backup real, backup inválido, virada do dia e seis telas mobile; sem erros JS.')
    browser.close()
