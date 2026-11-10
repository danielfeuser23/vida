"""Hoje/agenda unificada: testes Chromium isolados, fonte e HTML único.
Execute com npm start ativo: python3 tests/browser_agenda.py
BASE_URL e APP_PATHS selecionam servidor/artefatos. BROWSER_APP_ROOT usa
snapshot local interceptado para a baseline, sem verificar transporte real.
Não usa perfil pessoal ou progresso real.
"""
from datetime import datetime, timedelta, timezone
import json
import mimetypes
import os
from pathlib import Path
import re
import subprocess
import unittest
from urllib.parse import unquote, urlparse
from playwright.sync_api import expect, sync_playwright

KEY="entre-trilhas-v1"
ROOT_PROJECT=Path(__file__).resolve().parents[1]
ROOT=Path(os.environ.get("BROWSER_APP_ROOT",ROOT_PROJECT)).resolve()
BASE=os.environ.get("BASE_URL","http://127.0.0.1:5173").rstrip("/")
PATHS=os.environ.get("APP_PATHS","/,/ENTRE-TRILHAS.html").split(",")

class BrowserAgenda(unittest.TestCase):
    contexts_started=0
    @classmethod
    def setUpClass(cls):
        code="""
        import * as E from './engine.js';
        import {roadmap} from './roadmap.js';
        const free=E.createStudyState('2026-11-05');
        for(const r of free.config.rewards)r.price=0;
        const legacy=E.createState('2026-11-05');
        legacy.config.missions.find(m=>m.id==='exercise').time='06:40';
        const legacyWalk=E.createState('2026-11-07');
        E.complete(legacyWalk,'python','2026-11-07','normal',roadmap);
        legacyWalk.config.missions.find(m=>m.id==='weekend-walk').secondTime='15:00';
        console.log(JSON.stringify({free:E.serializeState(free),legacy:E.serializeState(legacy),legacyWalk:JSON.stringify(legacyWalk)}));
        """
        result=subprocess.run(["node","--input-type=module","-e",code],cwd=ROOT,text=True,capture_output=True,check=True)
        cls.fixtures=json.loads(result.stdout)
        cls.p=sync_playwright().start()
        cls.browser=cls.p.chromium.launch(executable_path=os.environ.get("CHROMIUM_PATH","/usr/bin/chromium"),headless=True,args=["--no-sandbox"])
    @classmethod
    def tearDownClass(cls):
        cls.browser.close();cls.p.stop()
        print(f"Agenda: {cls.contexts_started} contextos isolados; Chromium automatizado, sem aparelhos físicos.")
    def setUp(self):self.context=None
    def tearDown(self):
        if self.context:self.context.close()
    def start(self,path,day=5,hour=15,minute=0,raw=None):
        if self.context:self.context.close()
        self.context=self.browser.new_context(viewport={"width":1440,"height":1000},timezone_id="America/Sao_Paulo",reduced_motion="reduce")
        type(self).contexts_started+=1;self.context.set_default_timeout(4000)
        if ROOT!=ROOT_PROJECT:
            def serve(route):
                name=unquote(urlparse(route.request.url).path)
                file=(ROOT/("index.html" if name=="/" else name.lstrip("/"))).resolve()
                if not file.is_relative_to(ROOT) or not file.is_file():
                    route.fulfill(status=404,body="Não encontrado");return
                route.fulfill(status=200,body=file.read_bytes(),content_type=mimetypes.guess_type(file.name)[0] or "application/octet-stream")
            self.context.route(BASE+"/**",serve)
        if raw is not None:
            self.context.add_init_script("if(localStorage.getItem("+json.dumps(KEY)+")===null)localStorage.setItem("+json.dumps(KEY)+","+json.dumps(raw)+");")
        self.page=self.context.new_page();self.errors=[]
        self.page.on("pageerror",lambda error:self.errors.append(str(error)))
        local=datetime(2026,11,day,hour,minute,tzinfo=timezone(timedelta(hours=-3)))
        self.page.clock.install(time=local.astimezone(timezone.utc))
        self.page.goto(BASE+path);expect(self.page.locator("#mission-read")).to_be_visible()
    def raw(self,key=KEY):return self.page.evaluate("key=>localStorage.getItem(key)",key)
    def state(self):return json.loads(self.raw())
    def nav(self,name):self.page.locator(f'[data-nav="{name}"]').first.click()
    def closed(self):expect(self.page.locator("#modal")).not_to_be_visible()
    def no_errors(self):self.assertEqual(self.errors,[])
    def wait_totals(self,xp,coins):
        self.page.wait_for_function("""([key,xp,coins])=>{const s=JSON.parse(localStorage.getItem(key));return s&&s.events.reduce((a,e)=>a+e.xp,0)===xp&&s.events.reduce((a,e)=>a+e.coins,0)===coins;}""",arg=[KEY,xp,coins])
    def agenda(self,day=None):
        self.nav("today");self.page.locator('[data-action="schedule"]').first.click()
        expect(self.page.get_by_role("dialog",name="Sua agenda",exact=True)).to_be_visible()
        if day:
            self.page.locator('#agenda-form [name="day"]').fill(day)
            self.page.locator("#agenda-form").evaluate("form=>form.requestSubmit()")
        expect(self.page.locator("#agenda-table")).to_be_visible()
    def intervals(self,mission):
        rows=self.page.locator(f'#agenda-table tr[data-mission-id="{mission}"]')
        result=[]
        for row in rows.all():
            time=row.locator("td").first.inner_text()
            match=re.search(r"(\d{2}:\d{2})\s*[–—-]\s*(\d{2}:\d{2})",time)
            self.assertIsNotNone(match,time)
            result.append(match.groups())
        return result
    def editor(self,mission):
        self.nav("settings");self.page.locator(f'[data-action="edit-mission"][data-id="{mission}"]').click()
        expect(self.page.locator("#mission-form")).to_be_visible()
    def save_editor(self):
        self.page.locator('#mission-form [type="submit"]').click();self.closed()
    def availability(self,reward):
        return self.page.locator(f'[data-reward-availability][data-id="{reward}"]')
    def card(self,reward):return self.page.locator(f'article[data-reward-id="{reward}"]')
    def assert_error_association(self,form_id,field_name):
        error=self.page.locator(f"#{form_id} [role=alert]")
        error_id=error.get_attribute("id")
        self.assertTrue(error_id,"Mensagem de erro precisa de ID para associação acessível")
        self.assertTrue(error.inner_text().strip())
        field=self.page.locator(f'#{form_id} [name="{field_name}"]')
        self.assertIn(error_id,(field.get_attribute("aria-describedby") or "").split())
        expect(field).to_have_attribute("aria-invalid","true")
    def reschedule(self,mission,day,time,valid=True):
        self.nav("today");self.page.locator(f'#mission-{mission} [data-action="reschedule"]').click()
        form=self.page.locator("#reschedule-form")
        if form.locator('[name="day"]').count():form.locator('[name="day"]').fill(day)
        form.locator('[name="time"]').fill(time);form.locator('[type="submit"]').click()
        if valid:self.closed()

    def test_next_action_during_work_does_not_offer_study_or_overdue_morning(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path,hour=9)
                action=self.page.locator("#next-action")
                expect(action).to_have_attribute("data-status","busy")
                expect(action).to_have_attribute("data-mission-id","")
                expect(action).to_contain_text(re.compile("trabalho",re.I))
                expect(action.locator('[data-action="session"]')).to_have_count(0)
                expect(action).not_to_contain_text("Bom dia, companheiro")
                self.assertTrue(action.evaluate("el=>el.getBoundingClientRect().top<document.querySelector('.mission').getBoundingClientRect().top"))
                action.locator('[data-action="next-action"]').click()
                expect(self.page.locator("#agenda-table")).to_be_visible();self.no_errors()

    def test_next_action_updates_with_time_without_recreating_timer_or_button(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path,hour=9)
                action=self.page.locator("#next-action")
                expect(action).to_have_attribute("data-status","busy")
                action.locator('[data-action="next-action"]').evaluate("el=>window.__nextButton=el")
                self.page.locator('#mission-read [data-action="timer"]').click()
                pause=self.page.locator('[data-action="timer-pause"]');pause.click();pause.focus()
                pause.evaluate("el=>window.__pauseButton=el")
                self.page.clock.fast_forward(9*60*60*1000)
                expect(action).to_have_attribute("data-mission-id","python")
                self.assertTrue(action.locator('[data-action="next-action"]').evaluate("el=>el===window.__nextButton"))
                self.assertTrue(pause.evaluate("el=>el===window.__pauseButton"))
                expect(pause).to_be_focused()
                action.locator('[data-action="next-action"]').click()
                expect(self.page.locator('#session-form [name="minutes"]')).to_have_value("60")
                self.assertIsNone(self.raw());self.no_errors()

    def test_python_blocks_pause_and_edited_duration_share_today_and_agenda(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path)
                self.agenda()
                self.assertEqual(self.intervals("python"),[("18:00","19:00"),("19:10","20:10")])
                pause=self.page.locator("#agenda-table tr").filter(has_text=re.compile("pausa",re.I))
                self.assertTrue(any("19:00" in text and "19:10" in text for text in pause.all_text_contents()))
                self.page.keyboard.press("Escape");self.closed()
                self.editor("python")
                self.page.locator('#mission-form [name="minutes"]').fill("90")
                self.save_editor();self.nav("today")
                expect(self.page.locator("#mission-python .mission-meta")).to_contain_text("18:45")
                expect(self.page.locator("#mission-python .mission-meta")).to_contain_text("18:55")
                self.agenda()
                self.assertEqual(self.intervals("python"),[("18:00","18:45"),("18:55","19:40")])
                self.no_errors()

    def test_weekend_has_two_essential_walks_and_minimum_pays_once(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path,day=7,hour=6)
                self.agenda()
                self.assertEqual(self.intervals("weekend-walk"),[("07:20","07:50"),("17:00","17:30")])
                self.page.keyboard.press("Escape");self.closed()
                self.page.locator('[data-action="difficult"]').click()
                article=self.page.locator("#mission-weekend-walk")
                expect(article).to_contain_text("07:20")
                expect(article).to_contain_text("17:00")
                article.locator('[data-action="complete"][data-mode="minimum"]').first.click()
                self.wait_totals(40,12)
                self.assertEqual(self.state()["records"]["2026-11-07:weekend-walk"]["xp"],40)
                self.assertEqual(len(self.state()["events"]),1)
                self.nav("history");self.nav("today")
                expect(self.page.locator("#mission-weekend-walk")).to_be_visible()
                self.assertFalse(self.page.locator("#mission-weekend-walk").evaluate("el=>!!el.closest('details.completed-missions')"))
                self.no_errors()

    def test_custom_weekend_house_and_exercise_clocks_survive_and_match_agenda(self):
        for path in PATHS:
            for mission,day in (("exercise",7),("house",8)):
                with self.subTest(path=path,mission=mission):
                    self.start(path,day=day,hour=9);self.editor(mission)
                    self.page.locator('#mission-form [name="weekendTime"]').fill("10:30");self.save_editor()
                    self.nav("today");expect(self.page.locator(f"#mission-{mission} .mission-meta")).to_contain_text("10:30")
                    self.agenda();self.assertEqual(self.intervals(mission)[0][0],"10:30")
                    self.page.keyboard.press("Escape");self.closed()
                    self.page.reload();expect(self.page.locator(f"#mission-{mission} .mission-meta")).to_contain_text("10:30")
                    self.no_errors()

    def test_preview_is_read_only_and_dinner_conflict_is_rejected_before_save(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path);self.editor("python");before=self.raw()
                self.page.locator('#mission-form [name="time"]').fill("19:00")
                self.page.locator('#mission-form [data-action="preview-schedule"]').click()
                preview=self.page.locator("#schedule-preview");expect(preview).to_be_visible()
                expect(preview).to_contain_text("19:00")
                expect(preview).to_contain_text(re.compile("conflit|sobrep|ocupad",re.I))
                self.assertEqual(self.raw(),before)
                self.page.locator('#mission-form [type="submit"]').click()
                expect(self.page.locator("#mission-form [role=alert]")).to_contain_text(re.compile("conflit|sobrep|ocupad",re.I))
                expect(self.page.locator("#mission-form")).to_be_visible()
                expect(self.page.locator('#mission-form [name="time"]')).to_have_value("19:00")
                self.assertEqual(self.raw(),before);self.no_errors()

    def test_rescheduled_house_blocks_same_shop_window_and_changes_default_slot(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path,day=8,hour=13,raw=self.fixtures["free"])
                self.reschedule("house","2026-11-08","14:00")
                expect(self.page.locator("#mission-house .mission-meta")).to_contain_text("14:00")
                self.agenda();self.assertEqual(self.intervals("house"),[("14:00","14:15")])
                self.page.keyboard.press("Escape");self.closed();self.nav("shop")
                expect(self.availability("movie")).to_contain_text(re.compile("janela|horário|cabe",re.I))
                expect(self.availability("video")).to_contain_text("14:15")
                self.card("video").locator('[data-action="buy"]').click()
                expect(self.page.locator("#reward-start")).to_have_value("14:15")
                self.assertEqual(self.state()["purchases"],[]);self.no_errors()

    def test_shop_explains_missing_coins_then_repeated_purchase_limit_and_refund(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path);self.nav("shop")
                expect(self.availability("video")).to_contain_text(re.compile("15.*moedas",re.I))
                before=self.raw();self.card("video").locator('[data-action="buy"]').click()
                expect(self.page.locator('#buy-form [type="submit"]')).to_be_disabled()
                self.assertEqual(self.raw(),before)
                self.page.keyboard.press("Escape");self.closed();self.nav("today")
                for mission in ("read","dog-am","walk-am"):
                    self.page.locator(f'#mission-{mission} [data-action="complete"][data-mode="normal"]').first.click()
                self.wait_totals(40,15);self.nav("shop")
                expect(self.availability("video")).to_contain_text("21:30")
                self.card("video").locator('[data-action="buy"]').click()
                self.page.locator("#buy-form").evaluate("form=>{form.requestSubmit();form.requestSubmit();}")
                self.closed();self.wait_totals(40,0)
                self.assertEqual(len(self.state()["purchases"]),1)
                expect(self.availability("video")).to_contain_text(re.compile("limite|resgat|reserv",re.I))
                self.page.locator('[data-action="cancel"]').first.click();self.wait_totals(40,15)
                self.assertEqual(self.state()["purchases"][0]["status"],"cancelled")
                expect(self.availability("video")).to_contain_text("21:30");self.no_errors()

    def test_shop_cannot_create_time_after_the_evening_window(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path,hour=21,minute=40,raw=self.fixtures["free"]);self.nav("shop")
                expect(self.availability("video")).to_contain_text(re.compile("janela|horário|cabe",re.I))
                before=self.raw();self.card("video").locator('[data-action="buy"]').click()
                expect(self.page.locator('#buy-form [type="submit"]')).to_be_disabled()
                self.assertEqual(self.raw(),before);self.no_errors()

    def test_completed_optional_is_collapsible_and_essential_stays_visible(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path)
                self.page.locator('#mission-read [data-action="complete"][data-mode="normal"]').first.click()
                self.wait_totals(10,5);self.nav("history");self.nav("today")
                collapsed=self.page.locator("details.completed-missions")
                expect(collapsed.locator("#mission-read")).to_have_count(1)
                if collapsed.evaluate("el=>el.open"):
                    collapsed.locator("summary").click()
                self.assertFalse(collapsed.evaluate("el=>el.open"))
                summary=collapsed.locator("summary");summary.focus();self.page.keyboard.press("Enter")
                expect(collapsed.locator("#mission-read")).to_be_visible()
                self.page.locator('#mission-dog-am [data-action="complete"][data-mode="normal"]').first.click()
                self.wait_totals(20,9);self.nav("history");self.nav("today")
                expect(self.page.locator("#mission-dog-am")).to_be_visible()
                self.assertFalse(self.page.locator("#mission-dog-am").evaluate("el=>!!el.closest('details.completed-missions')"))
                self.no_errors()

    def test_agenda_date_navigation_matches_frequency_without_changing_today_or_progress(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path);before=self.raw();self.agenda("2026-11-09")
                self.assertEqual(len(self.intervals("house")),1);self.assertEqual(self.intervals("exercise"),[])
                self.page.locator('#agenda-form [name="day"]').fill("2026-11-10")
                self.page.locator("#agenda-form").evaluate("form=>form.requestSubmit()")
                self.assertEqual(len(self.intervals("exercise")),1);self.assertEqual(self.intervals("house"),[])
                self.assertEqual(self.raw(),before);self.page.keyboard.press("Escape");self.closed()
                expect(self.page.locator(".today-date")).to_contain_text("5 de novembro");self.no_errors()

    def test_new_agenda_and_preview_are_usable_by_keyboard_at_mobile_widths(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path)
                for width in (320,360,390,430):
                    self.page.set_viewport_size({"width":width,"height":1000})
                    opener=self.page.locator('[data-action="schedule"]').first;opener.focus();self.page.keyboard.press("Enter")
                    dialog=self.page.get_by_role("dialog",name="Sua agenda",exact=True);expect(dialog).to_be_visible()
                    for key in ("Tab","Shift+Tab"):
                        self.page.keyboard.press(key);self.assertTrue(dialog.evaluate("el=>el.contains(document.activeElement)"))
                    box=dialog.bounding_box();self.assertGreaterEqual(box["x"],-1);self.assertLessEqual(box["x"]+box["width"],width+1)
                    self.assertTrue(self.page.evaluate("document.documentElement.scrollWidth<=innerWidth+1"))
                    for control in self.page.locator("#agenda-form button,#agenda-form input").all():
                        if control.is_visible():
                            target=control.bounding_box()
                            self.assertGreaterEqual(target["width"],43.9)
                            self.assertGreaterEqual(target["height"],43.9)
                    self.page.keyboard.press("Escape");self.closed();expect(opener).to_be_focused()
                self.page.set_viewport_size({"width":320,"height":1000});self.editor("read")
                preview_button=self.page.locator('#mission-form [data-action="preview-schedule"]')
                preview_button.focus();self.page.keyboard.press("Enter")
                expect(self.page.locator("#schedule-preview")).to_be_visible()
                self.assertTrue(self.page.evaluate("document.documentElement.scrollWidth<=innerWidth+1"))
                self.page.keyboard.press("Escape");self.closed()
                expect(self.page.locator('[data-action="edit-mission"][data-id="read"]')).to_be_focused()
                self.no_errors()

    def test_reschedule_into_python_is_rejected_and_form_keeps_values(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path);before=self.raw();self.reschedule("read","2026-11-05","18:10",valid=False)
                expect(self.page.locator("#reschedule-form")).to_be_visible()
                expect(self.page.locator("#reschedule-form [role=alert]")).to_contain_text(re.compile("conflit|sobrep|ocupad",re.I))
                expect(self.page.locator('#reschedule-form [name="time"]')).to_have_value("18:10")
                self.assert_error_association("reschedule-form","time")
                self.assertEqual(self.raw(),before);self.no_errors()

    def test_conflicting_legacy_backup_is_accepted_and_shows_conflict_without_silent_repair(self):
        for path in PATHS:
            with self.subTest(path=path):
                old=self.fixtures["legacy"];self.start(path,raw=old);self.assertEqual(self.raw(),old)
                self.agenda()
                self.assertEqual(self.intervals("exercise"),[("06:40","07:00")])
                expect(self.page.locator("#agenda-conflicts")).to_contain_text(re.compile("conflit|sobrep|ocupad",re.I))
                self.assertEqual(self.raw(),old);self.page.reload();self.assertEqual(self.raw(),old);self.no_errors()

    def test_second_walk_time_is_shared_and_preserved_through_backup_restore(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path,day=7,hour=13,raw=self.fixtures["free"]);self.editor("weekend-walk")
                self.page.locator('#mission-form [name="secondTime"]').fill("14:30");self.save_editor();self.nav("today")
                expect(self.page.locator("#mission-weekend-walk .mission-meta")).to_contain_text("14:30")
                self.agenda();self.assertEqual(self.intervals("weekend-walk"),[("07:20","07:50"),("14:30","15:00")])
                self.page.keyboard.press("Escape");self.closed();self.nav("shop")
                expect(self.availability("movie")).to_contain_text(re.compile("janela|horário|cabe",re.I))
                self.nav("settings")
                with self.page.expect_download() as info:self.page.locator('[data-action="export"]').click()
                backup=Path(info.value.path()).read_bytes()
                self.editor("weekend-walk");self.page.locator('#mission-form [name="secondTime"]').fill("17:00");self.save_editor()
                self.page.locator("#import-file").set_input_files({"name":"agenda.json","mimeType":"application/json","buffer":backup})
                self.page.locator('[data-action="confirm-import"]').click();self.closed();self.page.reload()
                self.assertEqual(next(m for m in self.state()["config"]["missions"] if m["id"]=="weekend-walk")["secondTime"],"14:30")
                self.agenda();self.assertEqual(self.intervals("weekend-walk"),[("07:20","07:50"),("14:30","15:00")]);self.no_errors()

    def test_legacy_ui_rejects_reward_overlapping_second_walk_even_when_legacy_api_would_allow(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path,day=7,hour=13,raw=self.fixtures["legacyWalk"])
                self.assertEqual(self.state()["version"],1)
                self.wait_totals(120,36)
                self.nav("shop");expect(self.availability("video")).to_contain_text("14:00")
                self.card("video").locator('[data-action="buy"]').click()
                expect(self.page.locator("#reward-start")).to_have_value("14:00")
                before=self.raw();self.page.locator("#reward-start").fill("15:00")
                self.page.locator('#buy-form [type="submit"]').click()
                expect(self.page.locator("#buy-form")).to_be_visible()
                expect(self.page.locator("#buy-form [role=alert]")).to_contain_text(re.compile("conflit|sobrep|ocupad|passeio",re.I))
                expect(self.page.locator("#modal")).not_to_contain_text(re.compile("backup inválido",re.I))
                self.assert_error_association("buy-form","start")
                self.assertEqual(self.raw(),before)
                self.assertEqual(self.state()["purchases"],[])
                self.wait_totals(120,36);self.no_errors()

    def test_completed_summary_keeps_focus_after_other_tab_storage_update(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path,day=14,raw=self.fixtures["free"])
                self.page.locator('#mission-read [data-action="complete"][data-mode="normal"]').first.click()
                self.wait_totals(10,5)
                completed=self.page.locator("details.completed-missions > summary")
                review=self.page.locator("details.review > summary")
                expect(review).to_be_visible();expect(completed).to_be_visible()
                completed.focus();expect(completed).to_be_focused()
                other=self.context.new_page()
                other.clock.install(time=datetime(2026,11,14,18,0,tzinfo=timezone.utc))
                other.goto(BASE+path)
                other.evaluate("""key=>{
                  const state=JSON.parse(localStorage.getItem(key));
                  state.config.missions.find(mission=>mission.id==='read').title='Leitura sincronizada';
                  state.revision++;
                  localStorage.setItem(key,JSON.stringify(state));
                }""",KEY)
                expect(self.page.locator("#mission-read h3")).to_contain_text("Leitura sincronizada")
                self.page.bring_to_front();expect(completed).to_be_focused()
                self.wait_totals(10,5);self.no_errors();other.close()

if __name__=="__main__":unittest.main(verbosity=2)
