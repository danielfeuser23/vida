"""Python: sessões, fases e projetos independentes em perfis descartáveis.
Requer Playwright/Chromium e npm start: python3 tests/browser_sessions.py
BASE_URL/APP_PATHS selecionam servidor/artefatos. BROWSER_APP_ROOT intercepta
o endereço com um snapshot local; nessa modalidade o transporte HTTP é simulado.
Fixtures v1 são sintéticas. Nenhum perfil ou progresso pessoal é acessado.
"""
from datetime import datetime, timezone
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
RECOVERY="entre-trilhas-v1-recovery"
PROJECT=Path(__file__).resolve().parents[1]
ROOT=Path(os.environ.get("BROWSER_APP_ROOT",PROJECT)).resolve()
BASE=os.environ.get("BASE_URL","http://127.0.0.1:5173").rstrip("/")
PATHS=os.environ.get("APP_PATHS","/,/ENTRE-TRILHAS.html").split(",")

class BrowserSessions(unittest.TestCase):
    contexts_started=0
    @classmethod
    def setUpClass(cls):
        code="""
        import * as E from './engine.js';
        import {roadmap} from './roadmap.js';
        const all=E.createState('2026-01-01'),sameDay={};
        for(let i=0;i<roadmap.length;i++)E.complete(all,'python',E.addDays(all.created,i),'normal',roadmap);
        for(const mode of ['normal','minimum']){
          const s=E.createState('2026-11-05');
          E.complete(s,'python','2026-11-05',mode,roadmap);
          sameDay[mode]=E.serializeState(s);
        }
        console.log(JSON.stringify({all:E.serializeState(all),sameDay}));
        """
        out=subprocess.run(["node","--input-type=module","-e",code],cwd=ROOT,text=True,capture_output=True,check=True)
        cls.fixtures=json.loads(out.stdout)
        cls.p=sync_playwright().start()
        cls.browser=cls.p.chromium.launch(executable_path=os.environ.get("CHROMIUM_PATH","/usr/bin/chromium"),headless=True,args=["--no-sandbox"])
    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.p.stop()
        print(f"Sessões Python: {cls.contexts_started} contextos isolados; Chromium automatizado, sem aparelho real.")
    def setUp(self): self.context=None
    def tearDown(self):
        if self.context:self.context.close()
    def start(self,path,raw=None):
        if self.context:self.context.close()
        self.context=self.browser.new_context(viewport={"width":1440,"height":1000},timezone_id="America/Sao_Paulo",reduced_motion="reduce")
        type(self).contexts_started+=1
        self.context.set_default_timeout(4000)
        if ROOT!=PROJECT:
            def serve(route):
                name=unquote(urlparse(route.request.url).path)
                file=(ROOT/("index.html" if name=="/" else name.lstrip("/"))).resolve()
                if not file.is_relative_to(ROOT) or not file.is_file():
                    route.fulfill(status=404,body="Não encontrado");return
                route.fulfill(status=200,body=file.read_bytes(),content_type=mimetypes.guess_type(file.name)[0] or "application/octet-stream")
            self.context.route(BASE+"/**",serve)
        if raw is not None:
            self.context.add_init_script("if(localStorage.getItem("+json.dumps(KEY)+")===null)localStorage.setItem("+json.dumps(KEY)+","+json.dumps(raw)+");")
        self.page=self.context.new_page()
        self.errors=[]
        self.page.on("pageerror",lambda error:self.errors.append(str(error)))
        self.page.clock.install(time=datetime(2026,11,5,18,0,tzinfo=timezone.utc))
        self.page.goto(BASE+path)
        expect(self.page.locator("#mission-read")).to_be_visible()
    def raw(self,key=KEY):return self.page.evaluate("key=>localStorage.getItem(key)",key)
    def state(self):return json.loads(self.raw())
    def nav(self,name):self.page.locator(f'[data-nav="{name}"]').first.click()
    def totals(self):return tuple(sum(e[f] for e in self.state()["events"]) for f in ("xp","coins"))
    def wait_totals(self,xp,coins):
        self.page.wait_for_function("""([key,xp,coins])=>{const s=JSON.parse(localStorage.getItem(key));return s&&s.events.reduce((a,e)=>a+e.xp,0)===xp&&s.events.reduce((a,e)=>a+e.coins,0)===coins;}""",arg=[KEY,xp,coins])
        self.assertEqual(self.totals(),(xp,coins))
    def no_errors(self):self.assertEqual(self.errors,[])
    def closed(self):expect(self.page.locator("#modal")).not_to_be_visible()
    def sessions(self):return [a for a in self.state()["study"]["actions"] if "minutes" in a and "goal" in a]
    def open_session(self,mode="normal"):
        self.nav("today")
        button=self.page.locator(f'#mission-python [data-action="session"][data-mode="{mode}"]').first
        if not button.count():
            self.nav("python");button=self.page.locator('[data-action="session"][data-id="python"]').first
        button.click()
        expect(self.page.get_by_role("dialog",name="Registrar sessão de Python",exact=True)).to_be_visible()
    def register(self,minutes,goal,exercises=0,kind="review",project=None,duplicate=False,mode="normal"):
        self.open_session(mode)
        form=self.page.locator("#session-form")
        form.locator('[name="kind"]').select_option(kind)
        form.locator('[name="minutes"]').fill(str(minutes))
        form.locator('[name="goal"]').fill(goal)
        form.locator('[name="exercises"]').fill(str(exercises))
        if project:form.locator('[name="projectId"]').select_option(project)
        if duplicate:form.evaluate("form=>{form.requestSubmit();form.requestSubmit();}")
        else:form.locator('[type="submit"]').click()
        self.closed()
        self.assertEqual(self.state()["version"],2)
    def phase(self,lesson=1):
        self.nav("python");self.page.locator(f'[data-lesson="{lesson}"]').click()
        expect(self.page.locator("#exercise-count")).to_have_count(0)
        self.page.locator("#criterion-check").check()
        self.page.locator('[data-action="finish-lesson"]').click()
        self.closed()
    def activate(self):
        self.page.locator('[data-action="migrate-study"]').first.click()
        expect(self.page.get_by_role("dialog",name="Ativar sessões independentes",exact=True)).to_be_visible()
        self.page.locator('[data-action="confirm-migrate-study"]').click()
        self.closed();self.assertEqual(self.state()["version"],2)
    def undo_session(self):
        self.nav("python")
        self.page.locator('[data-action="undo-session"]').first.click()
        self.page.locator('[data-action="confirm-undo-session"]').click()
        self.closed()
    def create_project(self):
        self.nav("python");self.page.locator('[data-action="create-project"]').click()
        expect(self.page.get_by_role("dialog",name="Criar projeto de Python",exact=True)).to_be_visible()
        self.page.locator('#project-form [name="title"]').fill("Diário de pontos")
        self.page.locator('#project-form [type="submit"]').click();self.closed()
        return self.page.locator('[data-action="complete-project"]').first.get_attribute("data-id")

    def test_two_sessions_reach_goal_without_phase(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path);self.register(60,"Revisar variáveis",2);self.wait_totals(60,18)
                self.assertEqual(self.state()["lessons"],[])
                self.register(60,"Praticar pontos",3);self.wait_totals(120,36)
                self.assertEqual(self.state()["lessons"],[])
                self.assertEqual(sum(a["minutes"] for a in self.sessions()),120)
                self.assertEqual(sum(a["exercises"] for a in self.sessions()),5)
                self.page.reload();self.wait_totals(120,36)
                self.assertEqual(len(self.sessions()),2);self.no_errors()

    def test_minimum_upgrade_extra_practice_and_duplicate_share_budget(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path);self.register(5,"Revisão mínima",duplicate=True,mode="minimum")
                self.wait_totals(5,2);self.assertEqual(len(self.sessions()),1)
                self.register(115,"Continuar a prática",3);self.wait_totals(120,36)
                self.register(30,"Extras opcionais",2);self.wait_totals(120,36)
                self.assertEqual(sum(a["minutes"] for a in self.sessions()),150)
                self.assertEqual(len(self.sessions()),3);self.assertEqual(self.state()["lessons"],[]);self.no_errors()

    def test_later_phase_adds_no_reward_or_duplicate_exercises(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path);self.register(120,"Meu primeiro programa",4)
                before=self.totals();self.phase();self.assertEqual(self.totals(),before)
                self.assertEqual(self.state()["lessons"],[{"id":1,"day":"2026-11-05","exercises":0,"project":False}])
                self.assertEqual(sum(a["exercises"] for a in self.sessions()),4)
                self.nav("character")
                expect(self.page.locator("p").filter(has_text=re.compile(r"^4 exercícios registrados"))).to_have_count(1)
                self.nav("python");self.page.locator('[data-lesson="1"]').click()
                expect(self.page.locator('[data-action="finish-lesson"]')).to_have_count(0);self.no_errors()

    def test_phase_does_not_require_full_daily_minutes_and_next_day_renews_budget(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path);self.register(60,"Resolver o desafio",2);self.phase();self.wait_totals(60,18)
                self.page.clock.fast_forward(24*60*60*1000)
                self.register(60,"Continuar no outro dia",1);self.wait_totals(120,36)
                self.assertEqual(len(self.state()["lessons"]),1)
                self.assertEqual([a["day"] for a in self.sessions()],["2026-11-05","2026-11-06"]);self.no_errors()

    def test_project_spans_days_and_finishes_independently_without_reward(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path);pid=self.create_project();self.assertTrue(pid)
                self.register(60,"Começar o diário",1,"project",pid)
                self.page.clock.fast_forward(24*60*60*1000)
                self.register(60,"Continuar o diário",2,"project",pid);self.wait_totals(120,36)
                self.nav("python");self.page.locator(f'[data-action="complete-project"][data-id="{pid}"]').click()
                self.page.locator('[data-action="confirm-complete-project"]').click();self.closed();self.wait_totals(120,36)
                self.assertEqual(self.state()["lessons"],[])
                self.nav("character")
                practice=self.page.locator(".panel").filter(has=self.page.get_by_role("heading",name="Prática que fica",exact=True))
                expect(practice.locator(".stats > div").nth(1).locator("h1")).to_have_text("1")
                expect(practice.locator(".stats > div").nth(1).locator("p")).to_have_text("projetos concluídos")
                self.nav("python")
                expect(self.page.locator(f'[data-action="complete-project"][data-id="{pid}"]')).to_have_count(0)
                expect(self.page.locator(f'[data-action="reopen-project"][data-id="{pid}"]')).to_have_count(1)
                self.page.reload();self.wait_totals(120,36)
                self.nav("python")
                self.page.locator(f'[data-action="reopen-project"][data-id="{pid}"]').click()
                self.page.locator('[data-action="confirm-reopen-project"]').click();self.closed()
                self.wait_totals(120,36)
                expect(self.page.locator(f'[data-action="complete-project"][data-id="{pid}"]')).to_have_count(1)
                self.assertEqual(sum(a["exercises"] for a in self.sessions()),3)
                self.nav("character")
                practice=self.page.locator(".panel").filter(has=self.page.get_by_role("heading",name="Prática que fica",exact=True))
                expect(practice.locator(".stats > div").nth(1).locator("h1")).to_have_text("0")
                self.no_errors()

    def test_full_legacy_roadmap_migrates_then_records_review_without_invented_minutes(self):
        for path in PATHS:
            with self.subTest(path=path):
                old=self.fixtures["all"];self.start(path,old);self.assertEqual(self.raw(),old)
                self.page.reload();self.assertEqual(self.raw(),old);self.activate()
                self.assertEqual(len(self.state()["lessons"]),120)
                self.assertEqual(self.state()["study"]["actions"],[])
                self.assertEqual(json.loads(self.raw(RECOVERY))["raw"],old)
                previous=self.totals();self.register(120,"Revisão depois do mapa",2)
                self.wait_totals(previous[0]+120,previous[1]+36)
                self.assertEqual(len(self.state()["lessons"]),120)
                self.assertEqual(sum(a["minutes"] for a in self.sessions()),120)
                self.page.reload();self.assertEqual(len(self.state()["lessons"]),120);self.no_errors()

    def test_same_day_legacy_awards_are_not_paid_again_after_migration(self):
        for path in PATHS:
            for mode in ("minimum","normal"):
                with self.subTest(path=path,legacy=mode):
                    old=self.fixtures["sameDay"][mode];self.start(path,old)
                    self.assertEqual(self.raw(),old);self.activate()
                    self.assertEqual(self.state()["study"]["actions"],[])
                    self.register(120,"Prática real depois da ativação",2);self.wait_totals(120,36)
                    self.assertEqual(sum(a["minutes"] for a in self.sessions()),120)
                    self.assertEqual(len(self.state()["lessons"]),1 if mode=="normal" else 0)
                    self.assertEqual(json.loads(self.raw(RECOVERY))["raw"],old);self.no_errors()

    def test_session_correction_preserves_phase_and_phase_correction_preserves_practice(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path);self.register(120,"Prática e marco",3);self.phase();self.undo_session()
                self.wait_totals(0,0);self.assertEqual(len(self.state()["lessons"]),1)
                self.assertEqual(len(self.sessions()),1);self.nav("python")
                expect(self.page.locator("#python-sessions")).to_contain_text(re.compile("corrigid",re.I))
                self.page.reload();self.wait_totals(0,0);self.assertEqual(len(self.state()["lessons"]),1);self.no_errors()
                self.start(path);self.register(120,"Prática preservada",3);self.phase();self.nav("python")
                self.page.locator('[data-lesson="1"]').click()
                self.page.locator('[data-action="undo-phase"]').click()
                self.page.locator('[data-action="confirm-undo-phase"]').click();self.closed()
                self.wait_totals(120,36);self.assertEqual(self.state()["lessons"],[])
                self.assertEqual(sum(a["exercises"] for a in self.sessions()),3);self.no_errors()

    def test_spent_coins_block_session_correction_until_refund(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path);self.register(120,"Estudo antes da recompensa",1);self.nav("shop")
                self.page.locator('[data-action="buy"][data-id="video"]').click()
                self.page.locator("#reward-start").fill("21:30")
                self.page.locator('#buy-form [type="submit"]').click();self.closed();self.wait_totals(120,21)
                before=self.raw();self.nav("python")
                self.page.locator('[data-action="undo-session"]').first.click()
                self.page.locator('[data-action="confirm-undo-session"]').click()
                expect(self.page.locator("#toast")).to_contain_text(re.compile("saldo|moedas",re.I))
                self.assertEqual(self.raw(),before);self.wait_totals(120,21)
                self.page.keyboard.press("Escape");self.closed();self.nav("shop")
                self.page.locator('[data-action="cancel"]').first.click();self.wait_totals(120,36)
                self.undo_session();self.wait_totals(0,0);self.no_errors()

    def test_v2_backup_restore_reopen_and_recovery_keep_independent_records(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path);self.register(60,"Sessão do backup",2);self.phase();self.nav("settings")
                with self.page.expect_download() as info:self.page.locator('[data-action="export"]').click()
                backup=Path(info.value.path()).read_bytes();self.assertEqual(json.loads(backup)["version"],2)
                self.undo_session();self.wait_totals(0,0);corrected=self.raw();self.nav("settings")
                self.page.locator("#import-file").set_input_files({"name":"sessions.json","mimeType":"application/json","buffer":backup})
                self.page.locator('[data-action="confirm-import"]').click();self.closed();self.wait_totals(60,18)
                self.page.reload();self.wait_totals(60,18);self.assertEqual(len(self.state()["lessons"]),1)
                self.assertEqual(json.loads(self.raw(RECOVERY))["raw"],corrected);self.nav("settings")
                self.page.locator('[data-action="recover"]').click()
                self.page.locator('[data-action="confirm-recover"]').click();self.closed();self.wait_totals(0,0)
                self.assertEqual(len(self.state()["lessons"]),1);self.no_errors()

    def test_malformed_and_inconsistent_v2_backups_preserve_progress_and_recovery(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path,self.fixtures["sameDay"]["minimum"]);self.activate()
                self.register(120,"Preservar meus dados",2)
                before,recovery=self.raw(),self.raw(RECOVERY)
                bad=self.state();bad["study"]["actions"]=[];self.nav("settings")
                for raw in (b"{",json.dumps(bad).encode()):
                    self.page.locator("#import-file").set_input_files({"name":"bad.json","mimeType":"application/json","buffer":raw})
                    expect(self.page.locator("#toast")).to_contain_text(re.compile("backup inválido",re.I))
                    self.assertEqual(self.raw(),before);self.assertEqual(self.raw(RECOVERY),recovery)
                self.no_errors()

    def test_failed_session_write_preserves_form_and_retry_records_once(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path);self.open_session()
                self.page.locator('#session-form [name="goal"]').fill("Objetivo preservado")
                self.page.locator('#session-form [name="minutes"]').fill("60");before=self.raw()
                self.page.evaluate("""key=>{const original=Storage.prototype.setItem;window.__setItem=original;Storage.prototype.setItem=function(k,v){if(k===key)throw new DOMException('Teste','QuotaExceededError');return original.call(this,k,v);};}""",KEY)
                self.page.locator('#session-form [type="submit"]').click()
                expect(self.page.locator("#toast")).to_contain_text(re.compile("sem espaço|não foi possível salvar",re.I))
                expect(self.page.locator("#session-form")).to_be_visible()
                expect(self.page.locator('#session-form [name="goal"]')).to_have_value("Objetivo preservado")
                expect(self.page.locator('#session-form [name="minutes"]')).to_have_value("60")
                self.assertEqual(self.raw(),before)
                self.page.evaluate("()=>{Storage.prototype.setItem=window.__setItem;}")
                self.page.locator('#session-form [type="submit"]').click();self.closed();self.wait_totals(60,18);self.no_errors()

    def test_failed_migration_keeps_v1_and_retry_preserves_recoverable_copy(self):
        for path in PATHS:
            with self.subTest(path=path):
                old=self.fixtures["sameDay"]["normal"];self.start(path,old)
                self.page.locator('[data-action="migrate-study"]').first.click()
                self.page.evaluate("""key=>{const original=Storage.prototype.setItem;window.__setItem=original;Storage.prototype.setItem=function(k,v){if(k===key)throw new DOMException('Teste','QuotaExceededError');return original.call(this,k,v);};}""",RECOVERY)
                self.page.locator('[data-action="confirm-migrate-study"]').click()
                expect(self.page.locator("#toast")).to_contain_text(re.compile("sem espaço|não foi possível salvar",re.I))
                self.assertEqual(self.raw(),old);self.assertEqual(self.state()["version"],1)
                self.page.evaluate("()=>{Storage.prototype.setItem=window.__setItem;}")
                expect(self.page.locator('[data-action="confirm-migrate-study"]')).to_be_enabled()
                self.page.locator('[data-action="confirm-migrate-study"]').click();self.closed()
                self.assertEqual(self.state()["version"],2)
                self.assertEqual(json.loads(self.raw(RECOVERY))["raw"],old);self.no_errors()

    def test_session_dialog_keyboard_and_mobile_widths(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path)
                for width in (320,360,390,430):
                    self.page.set_viewport_size({"width":width,"height":1000});self.nav("python")
                    button=self.page.locator('[data-action="session"][data-id="python"]').first
                    button.focus();self.page.keyboard.press("Enter")
                    dialog=self.page.get_by_role("dialog",name="Registrar sessão de Python",exact=True)
                    expect(dialog).to_be_visible()
                    for key in ("Tab","Shift+Tab"):
                        self.page.keyboard.press(key)
                        self.assertTrue(dialog.evaluate("el=>el.contains(document.activeElement)"),
                                        f"{width}px {key}: foco fora do diálogo: "+self.page.evaluate("document.activeElement.outerHTML.slice(0,240)"))
                    dims=self.page.evaluate("({width:innerWidth,scroll:document.documentElement.scrollWidth})")
                    self.assertLessEqual(dims["scroll"],dims["width"]+1)
                    box=dialog.bounding_box();self.assertGreaterEqual(box["x"],-1)
                    self.assertLessEqual(box["x"]+box["width"],width+1)
                    self.page.keyboard.press("Escape");self.closed();expect(button).to_be_focused()
                self.no_errors()

if __name__=="__main__":unittest.main(verbosity=2)
