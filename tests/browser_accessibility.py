"""R0c: comportamento, teclado e verificações de acessibilidade delimitadas.

Execute com ``npm start`` em outro terminal e:
    python3 tests/browser_accessibility.py

Cada cenário usa armazenamento descartável. APP_PATHS seleciona artefatos;
BROWSER_APP_ROOT intercepta localhost com um snapshot para reproduzir falhas.
As medições não equivalem a certificação WCAG nem a leitor de tela/aparelho real.
A ampliação de 200% é emulada: metade da largura CSS e DPR 2 via CDP,
sem mudar o zoom nativo. CSS zoom foi explorado separadamente: seus diálogos
na top layer excedem a largura e ele não reproduz unidades vw/media queries
do zoom nativo; esse resultado não é apresentado como resolvido pela suíte.
"""

from datetime import datetime, timezone
import json
import mimetypes
import os
from pathlib import Path
import re
import unittest
from urllib.parse import unquote, urlparse

from playwright.sync_api import expect, sync_playwright


KEY = "entre-trilhas-v1"
PROJECT = Path(__file__).resolve().parents[1]
ROOT = Path(os.environ.get("BROWSER_APP_ROOT", PROJECT)).resolve()
BASE_URL = os.environ.get("BASE_URL", "http://127.0.0.1:5173").rstrip("/")
APP_PATHS = os.environ.get("APP_PATHS", "/,/ENTRE-TRILHAS.html").split(",")
ARTIFACTS = Path(os.environ.get("BROWSER_REPORT_DIR", "/tmp/entre-trilhas-r0c"))


class BrowserAccessibility(unittest.TestCase):
    contexts_started = 0

    @classmethod
    def setUpClass(cls):
        ARTIFACTS.mkdir(parents=True, exist_ok=True)
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(
            executable_path=os.environ.get("CHROMIUM_PATH", "/usr/bin/chromium"),
            headless=True, args=["--no-sandbox"],
        )

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        print(f"R0c: {cls.contexts_started} contextos isolados; Chromium desktop, "
              "larguras móveis e ampliação 200% emulada por área CSS/DPR 2; "
              "sem zoom nativo/leitor de tela/aparelho real.")

    def setUp(self):
        self.context = None

    def tearDown(self):
        if self.context:
            self.context.close()

    def start(self, path, raw=None, day=5):
        if self.context:
            self.context.close()
        self.context = self.browser.new_context(
            viewport={"width": 1440, "height": 1000},
            timezone_id="America/Sao_Paulo", reduced_motion="reduce",
        )
        type(self).contexts_started += 1
        self.context.set_default_timeout(4000)
        if ROOT != PROJECT:
            def fulfill(route):
                name = unquote(urlparse(route.request.url).path)
                target = (ROOT / ("index.html" if name == "/" else name.lstrip("/"))).resolve()
                if not target.is_relative_to(ROOT) or not target.is_file():
                    route.fulfill(status=404, body="Não encontrado")
                    return
                route.fulfill(status=200, body=target.read_bytes(),
                              content_type=mimetypes.guess_type(target.name)[0] or "application/octet-stream")
            self.context.route(BASE_URL + "/**", fulfill)
        if raw is not None:
            self.context.add_init_script(
                "if(localStorage.getItem(" + json.dumps(KEY) + ")===null)"
                "localStorage.setItem(" + json.dumps(KEY) + "," + json.dumps(raw) + ");"
            )
        self.page = self.context.new_page()
        self.errors = []
        self.page.on("pageerror", lambda error: self.errors.append(str(error)))
        self.page.clock.install(time=datetime(2026, 11, day, 18, 0, tzinfo=timezone.utc))
        self.page.goto(BASE_URL + path)
        expect(self.page.locator("#mission-read")).to_be_visible()

    def state(self):
        return self.page.evaluate("key => JSON.parse(localStorage.getItem(key))", KEY)

    def raw(self):
        return self.page.evaluate("key => localStorage.getItem(key)", KEY)

    def nav(self, name, keyboard=False):
        button = self.page.locator(f'[data-nav="{name}"]').first
        if keyboard:
            button.focus()
            self.page.keyboard.press("Enter")
        else:
            button.click()

    def wait_totals(self, xp, coins):
        self.page.wait_for_function(
            """([key,xp,coins]) => { const s=JSON.parse(localStorage.getItem(key));
            return s && s.events.reduce((a,e)=>a+e.xp,0)===xp &&
            s.events.reduce((a,e)=>a+e.coins,0)===coins; }""", arg=[KEY,xp,coins])

    def complete(self, mission="read", mode="normal", xp=10, coins=5):
        self.page.locator(f'#mission-{mission} [data-action="complete"][data-mode="{mode}"]').first.click()
        self.wait_totals(xp, coins)

    def undo(self, key="2026-11-05:read"):
        self.page.locator(f'[data-action="undo"][data-key="{key}"]').first.click()
        self.page.locator('[data-action="confirm-undo"]').click()
        expect(self.page.locator("#modal")).not_to_be_visible()

    def focus_inside(self, selector):
        self.assertTrue(self.page.locator(selector).evaluate(
            "el => el===document.activeElement || el.contains(document.activeElement)"),
            f"Foco deveria permanecer em {selector}; ativo=" + self.page.evaluate("document.activeElement.outerHTML.slice(0,500)"))

    def no_errors(self):
        self.assertEqual(self.errors, [], "Exceções JavaScript não tratadas")

    def open_editor(self, mission="walk-am"):
        self.nav("settings")
        button = self.page.locator(f'[data-action="edit-mission"][data-id="{mission}"]')
        button.focus()
        self.page.keyboard.press("Enter")
        expect(self.page.locator("#mission-form")).to_be_visible()

    def test_legacy_weekend_custom_time_survives_save_reopen(self):
        for path in APP_PATHS:
            for mission, day in (("exercise", 7), ("house", 8)):
                with self.subTest(path=path, mission=mission):
                    self.start(path)
                    self.complete(mode="minimum", xp=5, coins=2)
                    state = self.state()
                    edited = next(m for m in state["config"]["missions"] if m["id"] == mission)
                    edited["time"] = "10:30"
                    edited.pop("weekendTime", None)
                    self.start(path, json.dumps(state), day=day)
                    expect(self.page.locator(f"#mission-{mission} .mission-meta")).to_contain_text("10:30")
                    self.page.reload()
                    expect(self.page.locator(f"#mission-{mission} .mission-meta")).to_contain_text("10:30")
                    self.no_errors()

    def test_weekend_editor_is_explicit_and_weekday_is_preserved(self):
        for path in APP_PATHS:
            for mission, day in (("exercise", 7), ("house", 8)):
                with self.subTest(path=path, mission=mission):
                    self.start(path)
                    self.open_editor(mission)
                    self.page.locator('#mission-form [name="time"]').fill("06:40")
                    weekend = self.page.locator('#mission-form [name="weekendTime"]')
                    expect(weekend).to_have_count(1)
                    weekend.fill("10:45")
                    self.page.locator('#mission-form button[type="submit"]').click()
                    expect(self.page.locator("#modal")).not_to_be_visible()
                    saved = next(m for m in self.state()["config"]["missions"] if m["id"] == mission)
                    self.assertEqual((saved["time"],saved["weekendTime"]), ("06:40","10:45"))
                    self.start(path, self.raw(), day=day)
                    expect(self.page.locator(f"#mission-{mission} .mission-meta")).to_contain_text("10:45")
                    self.page.reload()
                    expect(self.page.locator(f"#mission-{mission} .mission-meta")).to_contain_text("10:45")
                    self.no_errors()

    def test_today_xp_is_net_after_correction(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                self.complete()
                self.undo()
                self.wait_totals(0,0)
                expect(self.page.locator(".stats .stat").nth(1).locator("strong")).to_contain_text(re.compile(r"^\+?0\s"))
                expect(self.page.locator(".stats .stat").nth(1)).to_contain_text(re.compile("líquid", re.I))
                self.page.reload()
                self.wait_totals(0,0)
                self.no_errors()

    def test_old_correction_is_debited_on_correction_day_and_chart_is_signed(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                self.complete()
                self.page.clock.fast_forward(24*60*60*1000)
                expect(self.page.locator(".hero .chip")).to_contain_text("6 de novembro")
                self.nav("history")
                self.undo()
                self.wait_totals(0,0)
                events = self.state()["events"]
                self.assertEqual([(e["day"],e["xp"]) for e in events],
                                 [("2026-11-05",10),("2026-11-06",-10)])
                cols = self.page.locator(".week-col")
                expect(cols.nth(3)).to_contain_text("10 XP")
                expect(cols.nth(4)).to_contain_text("-10 XP")
                bar = cols.nth(4).locator(".week-bar").last
                self.assertGreater(bar.bounding_box()["height"], 12,
                                   "A barra negativa não deve virar um traço mínimo")
                expect(self.page.locator("main")).to_contain_text(re.compile(r"correç.*(?:dia|data)|(?:dia|data).*correç", re.I))
                self.nav("today")
                expect(self.page.locator(".stats .stat").nth(1).locator("strong")).to_contain_text(re.compile(r"^-10\s"))
                expect(self.page.locator(".stats .stat").nth(1)).not_to_contain_text("+-")
                self.page.reload()
                self.wait_totals(0,0)
                self.no_errors()

    def test_keyboard_navigation_focuses_page_heading(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                for name in ("character","python","shop","history","settings","today"):
                    self.nav(name, keyboard=True)
                    heading = self.page.locator("main h1").first
                    expect(heading).to_be_focused()
                    expect(heading).to_have_attribute("tabindex","-1")
                    self.page.keyboard.press("Tab")
                    self.assertNotEqual(self.page.evaluate("document.activeElement.tagName"),"BODY")
                self.no_errors()

    def test_keyboard_completion_upgrade_and_correction_keep_local_focus(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                minimum = self.page.locator('#mission-read [data-mode="minimum"]')
                minimum.focus()
                self.page.keyboard.press("Enter")
                self.wait_totals(5,2)
                self.focus_inside("#mission-read")
                normal = self.page.locator('#mission-read [data-mode="normal"]').first
                normal.focus()
                self.page.keyboard.press("Enter")
                self.wait_totals(10,5)
                self.focus_inside("#mission-read")
                self.page.locator('#mission-read [data-action="undo"]').first.focus()
                self.page.keyboard.press("Enter")
                self.page.locator('[data-action="confirm-undo"]').focus()
                self.page.keyboard.press("Enter")
                expect(self.page.locator("#modal")).not_to_be_visible()
                self.wait_totals(0,0)
                self.focus_inside("#mission-read")
                self.no_errors()

    def test_dialog_named_keyboard_trapped_and_focus_returns_on_escape_cancel_save(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                for close in ("escape","cancel","save"):
                    self.open_editor("read")
                    dialog = self.page.get_by_role("dialog", name="Editar missão", exact=True)
                    expect(dialog).to_be_visible()
                    labelledby = dialog.get_attribute("aria-labelledby")
                    self.assertTrue(labelledby, "Diálogo deve apontar para seu título visível")
                    expect(self.page.locator("#" + labelledby)).to_contain_text("Editar missão")
                    self.focus_inside("#modal")
                    for key in ("Shift+Tab","Tab","Tab","Shift+Tab"):
                        self.page.keyboard.press(key)
                        self.focus_inside("#modal")
                    if close == "escape":
                        self.page.keyboard.press("Escape")
                    elif close == "cancel":
                        self.page.locator('#mission-form [data-close]').focus()
                        self.page.keyboard.press("Enter")
                    else:
                        self.page.locator('#mission-form [name="title"]').fill("Leitura de teste")
                        self.page.locator('#mission-form button[type="submit"]').focus()
                        self.page.keyboard.press("Enter")
                    expect(self.page.locator("#modal")).not_to_be_visible()
                    expect(self.page.locator('[data-action="edit-mission"][data-id="read"]')).to_be_focused()
                self.no_errors()

    def test_skill_editor_prevents_duplicates_and_forced_error_is_specific(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                self.open_editor()
                secondary = self.page.locator('#mission-form [name="secondary"]')
                expect(secondary).to_have_count(1)
                primary = self.page.locator('#mission-form [name="skill"]')
                old_secondary = secondary.input_value()
                self.assertNotEqual(primary.input_value(), old_secondary)
                self.assertTrue(primary.locator(f'option[value="{old_secondary}"]').evaluate("option=>option.disabled"))
                before = self.raw()
                # Dom adulterado cobre validação de defesa além da opção desabilitada.
                self.page.locator("#mission-form").evaluate("""form => {
                  const select=form.elements.secondary, value=form.elements.skill.value;
                  select.querySelector('option[value="'+value+'"]').disabled=false;
                  select.value=value;
                }""")
                self.page.locator('#mission-form button[type="submit"]').click()
                expect(self.page.locator("#mission-form [role=alert]")).to_contain_text(re.compile("habilidade.*diferent",re.I))
                expect(self.page.locator("#modal")).not_to_contain_text(re.compile("backup inválido",re.I))
                self.assertEqual(self.raw(), before)
                expect(primary).to_have_attribute("aria-invalid","true")
                expect(secondary).to_have_attribute("aria-invalid","true")
                secondary.select_option("")
                expect(secondary).not_to_have_attribute("aria-invalid","true")
                expect(secondary).to_have_attribute("aria-describedby",re.compile("mission-skills-help"))
                self.page.locator('#mission-form [name="title"]').fill("Passeio editado")
                self.page.locator('#mission-form button[type="submit"]').click()
                expect(self.page.locator("#modal")).not_to_be_visible()
                edited = next(m for m in self.state()["config"]["missions"] if m["id"]=="walk-am")
                self.assertFalse(edited.get("secondary"))
                self.assertEqual(edited["title"],"Passeio editado")
                self.no_errors()

    def test_secondary_skill_label_and_credit_follow_saved_choice(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                self.open_editor()
                self.page.locator('#mission-form [name="secondary"]').select_option("reading")
                self.page.locator('#mission-form button[type="submit"]').click()
                expect(self.page.locator("#modal")).not_to_be_visible()
                self.nav("today")
                expect(self.page.locator("#mission-walk-am .mission-meta")).to_contain_text("+ Leitura e conhecimento (XP dividido)")
                self.complete("walk-am", "normal", 20, 6)
                event = self.state()["events"][-1]
                self.assertEqual(event["skills"], {"dog": 10, "reading": 10})
                self.page.reload()
                expect(self.page.locator("#mission-walk-am .mission-meta")).to_contain_text("+ Leitura e conhecimento (XP dividido)")
                self.wait_totals(20, 6)
                self.no_errors()

    def test_editor_invalid_minimum_keeps_inputs_and_has_specific_error(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                self.open_editor("read")
                self.page.locator('#mission-form [name="minXp"]').fill("999")
                self.page.locator('#mission-form [name="title"]').fill("Título preservado")
                before = self.raw()
                self.page.locator('#mission-form button[type="submit"]').click()
                expect(self.page.locator("#mission-form [role=alert]")).to_contain_text(re.compile("mínim.*normal", re.I))
                expect(self.page.locator("#modal")).not_to_contain_text(re.compile("backup inválido",re.I))
                expect(self.page.locator('#mission-form [name="title"]')).to_have_value("Título preservado")
                expect(self.page.locator('#mission-form [name="minXp"]')).to_have_value("999")
                self.assertEqual(self.raw(),before)
                self.no_errors()

    def test_timer_keeps_controls_and_focus_across_ticks_pause_and_resume(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                self.page.locator('#mission-read [data-action="timer"]').click()
                pause = self.page.locator('[data-action="timer-pause"]')
                pause.focus()
                pause.evaluate("el => {window.__timerPause = el; window.__timerRoot=el.closest('.timer');}")
                self.page.clock.fast_forward(2100)
                expect(pause).to_be_focused()
                self.assertTrue(pause.evaluate("el=>el===window.__timerPause&&el.closest('.timer')===window.__timerRoot"))
                self.page.keyboard.press("Enter")
                expect(pause).to_have_attribute("aria-label", "Continuar cronômetro")
                expect(pause).to_be_focused()
                paused = self.page.locator(".timer strong").inner_text()
                self.page.clock.fast_forward(2100)
                self.assertEqual(self.page.locator(".timer strong").inner_text(),paused)
                self.page.keyboard.press("Enter")
                expect(pause).to_have_attribute("aria-label","Pausar cronômetro")
                self.page.clock.fast_forward(2100)
                expect(pause).to_be_focused()
                self.assertTrue(pause.evaluate("el=>el===window.__timerPause"))
                self.page.keyboard.press("Tab")
                expect(self.page.locator('[data-action="timer-close"]')).to_be_focused()
                self.page.keyboard.press("Enter")
                expect(self.page.locator(".timer")).to_have_count(0)
                self.focus_inside("#mission-read")
                self.no_errors()

    def test_difficult_day_preserves_essential_care_and_single_credit(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                self.page.locator('[data-action="difficult"]').focus()
                self.page.keyboard.press("Enter")
                expect(self.page.locator('[data-action="difficult"]')).to_have_attribute("aria-pressed","true")
                for mission in ("dog-am","walk-am","dog-pm","walk-pm"):
                    article=self.page.locator(f"#mission-{mission}")
                    expect(article.locator('[data-action="complete"][data-mode="minimum"]')).to_have_count(2)
                    self.assertFalse(article.locator('[data-action="complete"][data-mode="normal"]').count())
                expect(self.page.locator("main")).to_contain_text("Alimentação, água, higiene, passeios e interação")
                self.complete("dog-am","minimum",10,4)
                self.complete("read","minimum",15,6)
                self.complete("read","normal",20,9)
                read=self.state()["records"]["2026-11-05:read"]
                self.assertEqual((read["rank"],read["xp"],read["coins"]),(2,10,5))
                self.page.reload()
                self.wait_totals(20,9)
                self.no_errors()

    def test_sampled_text_contrast(self):
        contrast_script = """selectors => {
          const rgba=s=>{const x=s.match(/[\\d.]+/g).map(Number);return [x[0]/255,x[1]/255,x[2]/255,x[3]??1];};
          const blend=(top,under)=>[0,1,2].map(i=>top[i]*top[3]+under[i]*(1-top[3])).concat(1);
          const lum=c=>c.slice(0,3).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
          return selectors.flatMap(sel=>[...document.querySelectorAll(sel)].filter(el=>el.getClientRects().length).map(el=>{
            const style=getComputedStyle(el);let bg=[1,1,1,1],parents=[];
            for(let p=el;p;p=p.parentElement)parents.unshift(p);
            for(const p of parents)bg=blend(rgba(getComputedStyle(p).backgroundColor),bg);
            const fg=blend(rgba(style.color),bg),a=lum(fg),b=lum(bg),size=parseFloat(style.fontSize),weight=parseFloat(style.fontWeight);
            return {selector:sel,text:el.innerText.trim().slice(0,70),ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05),required:size>=24||(size>=18.66&&weight>=700)?3:4.5,color:style.color,bg,size};
          }));
        }"""
        selectors=[".nav-label",".side-quote",".local-badge",".stat-label",".stat small",
                   ".mission-meta", ".mission-meta .reward", ".period-title", ".gentle", ".requirements",
                   ".panel .muted", ".skill-row small", ".breadcrumb", ".topbar .small", ".btn"]
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                samples=[]
                for name in ("today","character","python","shop","history","settings"):
                    self.nav(name)
                    samples.extend(self.page.evaluate(contrast_script,selectors))
                report=ARTIFACTS/("contrast-single.json" if path.endswith("html") else "contrast-source.json")
                report.write_text(json.dumps(samples,ensure_ascii=False,indent=2))
                failures=[s for s in samples if s["ratio"]+.02<s["required"]]
                self.assertEqual(failures,[],"Contraste medido em amostras de texto: "+json.dumps(failures[:8],ensure_ascii=False))
                self.no_errors()

    def test_main_touch_targets_are_at_least_44_css_pixels(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                targets=self.page.locator('.nav button,.avatar-small,.mission-actions button,.complete-check,[data-action="difficult"],[data-action="schedule"]')
                small=[]
                for target in targets.all():
                    if target.is_visible():
                        box=target.bounding_box()
                        if box["width"]<43.9 or box["height"]<43.9:
                            small.append({"label":target.get_attribute("aria-label") or target.inner_text(),"box":box})
                self.assertEqual(small,[],"Alvos principais menores que 44 CSS px: "+json.dumps(small[:8],ensure_ascii=False))
                self.no_errors()

    def test_mobile_widths_and_emulated_200_percent_reflow(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                cdp=self.context.new_cdp_session(self.page)
                # DPR 2 + metade da área CSS simula o tamanho físico de 200%:
                # 320 CSS px em 640 pixels; 640 CSS px em 1280 pixels.
                for width,scale in ((320,1),(360,1),(390,1),(430,1),(320,2),(640,2)):
                    self.page.set_viewport_size({"width":width,"height":1000})
                    cdp.send("Emulation.setDeviceMetricsOverride",{
                        "width":width,"height":1000,"deviceScaleFactor":scale,"mobile":False})
                    self.assertEqual(self.page.evaluate("devicePixelRatio"),scale)
                    for name in ("today","character","python","shop","history","settings"):
                        self.nav(name,keyboard=True)
                        dims=self.page.evaluate("({scroll:document.documentElement.scrollWidth,width:innerWidth})")
                        self.assertEqual(dims["width"],width)
                        self.assertLessEqual(dims["scroll"],dims["width"]+1,f"{name} {width} CSS px DPR{scale}: overflow {dims}")
                    self.nav("today")
                    self.page.locator('#mission-read [data-action="reschedule"]').click()
                    expect(self.page.locator("#modal")).to_be_visible()
                    self.assertLessEqual(self.page.locator("#modal").evaluate("el=>el.getBoundingClientRect().right"),width+1)
                    self.page.keyboard.press("Escape")
                    expect(self.page.locator("#modal")).not_to_be_visible()
                    if width==390 or scale==2 and width==320:
                        self.page.screenshot(path=str(ARTIFACTS/f"{'single' if path.endswith('html') else 'source'}-{width}css-dpr{scale}.png"),full_page=True)
                self.no_errors()


if __name__ == "__main__":
    unittest.main(verbosity=2)
