"""Avatar/refúgio: Chromium real com dados fictícios e perfis descartáveis.

Requer npm start: python3 tests/browser_refuge.py
BASE_URL/APP_PATHS selecionam servidor/artefatos. BROWSER_APP_ROOT permite
comparar snapshot local por interceptação, sem alegar transporte real.
REFUGE_SCREENSHOTS=1 grava capturas em /tmp. Não usa progresso pessoal.
"""
from datetime import datetime, timezone
import base64
import json
import mimetypes
import os
from pathlib import Path
import re
import subprocess
from tempfile import TemporaryDirectory
import unittest
from urllib.parse import unquote, urlparse

from playwright.sync_api import expect, sync_playwright

KEY = "entre-trilhas-v1"
RECOVERY = "entre-trilhas-v1-recovery"
PROJECT = Path(__file__).resolve().parents[1]
ROOT = Path(os.environ.get("BROWSER_APP_ROOT", PROJECT)).resolve()
BASE = os.environ.get("BASE_URL", "http://127.0.0.1:5173").rstrip("/")
PATHS = os.environ.get("APP_PATHS", "/,/ENTRE-TRILHAS.html").split(",")


class BrowserRefuge(unittest.TestCase):
    contexts_started = 0

    @classmethod
    def setUpClass(cls):
        code = """
        import * as E from './engine.js';
        import {roadmap} from './roadmap.js';
        const v1=E.createState('2026-11-02');
        for(const day of ['2026-11-02','2026-11-03','2026-11-04']){
          E.complete(v1,'read',day,'minimum',roadmap);
          E.complete(v1,'dog-am',day,'normal',roadmap);
          E.complete(v1,'python',day,'normal',roadmap);
        }
        const v2=E.migrateStudyState(v1);
        E.createStudyProject(v2,'Projeto fictício da bancada',null,'2026-11-05','fixture-project');
        E.completeStudyProject(v2,E.studyProjects(v2).at(-1).id,'2026-11-05','fixture-finish');
        const funded=E.createStudyState('2026-11-05');
        for(const id of ['read','dog-am','walk-am','dog-pm'])E.complete(funded,id,'2026-11-05','normal',roadmap);
        console.log(JSON.stringify({v1:E.serializeState(v1),v2:E.serializeState(v2),funded:E.serializeState(funded)}));
        """
        result = subprocess.run(["node", "--input-type=module", "-e", code], cwd=ROOT,
                                capture_output=True, text=True, check=True)
        cls.fixtures = json.loads(result.stdout)
        cls.p = sync_playwright().start()
        cls.browser = cls.p.chromium.launch(executable_path=os.environ.get("CHROMIUM_PATH", "/usr/bin/chromium"),
                                           headless=True, args=["--no-sandbox"])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.p.stop()
        print(f"Refúgio: {cls.contexts_started} contextos/perfis isolados; Chromium automatizado, sem aparelho físico.")

    def setUp(self):
        self.context = None

    def tearDown(self):
        if self.context:
            self.context.close()

    def start(self, path, raw=None, width=1440):
        if self.context:
            self.context.close()
        self.context = self.browser.new_context(viewport={"width": width, "height": 1000},
                                                timezone_id="America/Sao_Paulo", reduced_motion="reduce")
        type(self).contexts_started += 1
        self.context.set_default_timeout(5000)
        if ROOT != PROJECT:
            def serve(route):
                name = unquote(urlparse(route.request.url).path)
                file = (ROOT / ("index.html" if name == "/" else name.lstrip("/"))).resolve()
                if not file.is_relative_to(ROOT) or not file.is_file():
                    route.fulfill(status=404, body="Não encontrado")
                    return
                route.fulfill(status=200, body=file.read_bytes(),
                              content_type=mimetypes.guess_type(file.name)[0] or "application/octet-stream")
            self.context.route(BASE + "/**", serve)
        if raw is not None:
            self.context.add_init_script("if(localStorage.getItem(" + json.dumps(KEY) +
                                         ")===null)localStorage.setItem(" + json.dumps(KEY) + "," +
                                         json.dumps(raw) + ");")
        self.page = self.context.new_page()
        self.errors = []
        self.page.on("pageerror", lambda error: self.errors.append(str(error)))
        self.page.clock.install(time=datetime(2026, 11, 5, 18, 0, tzinfo=timezone.utc))
        self.page.goto(BASE + path)
        # Cuidados essenciais ficam visíveis mesmo depois de concluídos;
        # a leitura concluída da fixture de loja é recolhida legitimamente.
        expect(self.page.locator("#mission-dog-am")).to_be_visible()

    def raw(self, key=KEY):
        return self.page.evaluate("key=>localStorage.getItem(key)", key)

    def state(self):
        return json.loads(self.raw())

    def snapshot(self):
        return self.raw(), self.raw(RECOVERY)

    def nav(self, name):
        self.page.locator(f'[data-nav="{name}"]').first.click()

    def closed(self):
        expect(self.page.locator("#modal")).not_to_be_visible()

    def no_errors(self):
        self.assertEqual(self.errors, [])

    def personalize(self):
        self.nav("character")
        self.opener = self.page.locator('[data-action="appearance"]').first
        self.opener.click()
        expect(self.page.locator("#appearance-form")).to_be_visible()
        return self.page.locator("#appearance-form")

    def save_appearance(self):
        self.page.locator('#appearance-form [type="submit"]').click()
        self.closed()

    def collection(self):
        self.nav("character")
        details = self.page.locator("#cosmetic-collection")
        if not details.evaluate("el=>el.open"):
            details.locator(":scope > summary").click()
        return details

    def test_old_v1_v2_show_refuge_without_rewriting_history_or_defaults(self):
        for path in PATHS:
            for version in ("v1", "v2"):
                with self.subTest(path=path, version=version):
                    self.start(path, self.fixtures[version])
                    before = self.snapshot()
                    self.nav("character")
                    expect(self.page.locator("#refuge-scene")).to_be_visible()
                    expect(self.page.locator(".avatar-illustration").last).to_be_visible()
                    expect(self.page.locator(".refuge-illustration")).to_be_visible()
                    self.collection()
                    expect(self.page.locator('[data-cosmetic-id="books"]')).to_have_attribute("data-unlocked", "true")
                    expect(self.page.locator('[data-cosmetic-id="rug"]')).to_have_attribute("data-unlocked", "true")
                    self.assertNotIn("appearance", self.state()["config"])
                    self.assertEqual(self.snapshot(), before)
                    self.page.reload()
                    self.assertEqual(self.snapshot(), before)
                    self.no_errors()

    def test_preview_cancel_and_locked_tampering_do_not_write(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path)
                form = self.personalize()
                before = self.snapshot()
                form.locator('[name="cloak"]').select_option("night")
                form.locator('[name="skin"]').select_option("deep")
                form.locator('[name="hair"]').select_option("curly")
                expect(self.page.locator("#appearance-avatar-preview svg")).to_have_attribute("aria-label", re.compile("azul noturno.*pele escura.*cacheados"))
                self.assertTrue(form.locator('[name="accessory"] option[value="star"]').is_disabled())
                self.assertEqual(self.snapshot(), before)
                self.page.keyboard.press("Escape")
                self.closed()
                expect(self.opener).to_be_focused()
                self.assertEqual(self.snapshot(), before)
                form = self.personalize()
                form.locator('[name="accessory"]').evaluate("el=>{el.value='star';el.dispatchEvent(new Event('change',{bubbles:true}));}")
                form.evaluate("el=>el.requestSubmit()")
                expect(form).to_be_visible()
                expect(form.locator("[role=alert]")).to_contain_text(re.compile("marco|liberad|disponível", re.I))
                self.assertNotIn("backup inválido", form.inner_text().lower())
                self.assertEqual(self.snapshot(), before)
                self.no_errors()

    def test_save_idempotence_reopen_backup_restore_preserve_ledger_v1_v2(self):
        for path in PATHS:
            for version in ("v1", "v2"):
                with self.subTest(path=path, version=version):
                    self.start(path, self.fixtures[version])
                    original = self.state()
                    form = self.personalize()
                    form.locator('[name="cloak"]').select_option("clay")
                    form.locator('[name="skin"]').select_option("light")
                    form.locator('[name="hair"]').select_option("bob")
                    form.locator('[name="accessory"]').select_option("leaf")
                    form.locator('[name="simplified"]').check()
                    form.evaluate("el=>{el.requestSubmit();el.requestSubmit();}")
                    self.closed()
                    saved = self.state()
                    self.assertEqual(saved["version"], original["version"])
                    for field in ("events", "records", "purchases", "lessons"):
                        self.assertEqual(saved[field], original[field])
                    if version == "v2":
                        self.assertEqual(saved["study"], original["study"])
                    self.assertEqual(saved["revision"], original["revision"] + 1)
                    raw_saved = self.raw()
                    self.personalize()
                    self.save_appearance()
                    self.assertEqual(self.raw(), raw_saved, "Salvar sem mudanças deve ser idempotente")
                    self.page.reload()
                    self.nav("character")
                    expect(self.page.locator(".avatar-illustration").last).to_have_attribute("aria-label", re.compile("argila.*pele clara.*queixo.*broche de folha"))
                    self.nav("settings")
                    self.page.locator("#import-file").set_input_files({"name": "backup-anterior-ficticio.json", "mimeType": "application/json", "buffer": self.fixtures[version].encode()})
                    self.page.locator('[data-action="confirm-import"]').click()
                    self.closed()
                    self.assertEqual(json.loads(self.raw(RECOVERY))["raw"], raw_saved)
                    self.page.locator("#import-file").set_input_files({"name": "backup-aparencia-ficticio.json", "mimeType": "application/json", "buffer": raw_saved.encode()})
                    self.page.locator('[data-action="confirm-import"]').click()
                    self.closed()
                    before_reload = self.snapshot()
                    self.assertEqual(self.state(), saved)
                    self.page.reload()
                    self.assertEqual(self.snapshot(), before_reload)
                    self.no_errors()

    def test_unlock_equipping_day_gap_and_correction_keep_coins_and_valid_backup(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path)
                self.page.locator('#mission-read [data-mode="minimum"]').click()
                self.page.wait_for_function("key=>localStorage.getItem(key)!==null", arg=KEY)
                before = self.state()
                form = self.personalize()
                form.locator('[name="accessory"]').select_option("leaf")
                self.save_appearance()
                self.assertEqual(self.state()["events"], before["events"])
                self.page.clock.set_fixed_time(datetime(2026, 11, 20, 18, 0, tzinfo=timezone.utc))
                self.page.reload()
                self.collection()
                expect(self.page.locator('[data-cosmetic-id="leaf"]')).to_have_attribute("data-unlocked", "true")
                expect(self.page.locator(".avatar-illustration").last).to_have_attribute("aria-label", re.compile("broche de folha"))
                self.nav("history")
                self.page.locator('[data-action="undo"]').first.click()
                self.page.locator('[data-action="confirm-undo"]').click()
                self.closed()
                corrected = self.state()
                self.assertEqual(corrected["config"]["appearance"]["accessory"], "leaf")
                self.assertEqual(sum(e["xp"] for e in corrected["events"]), 0)
                self.assertEqual(sum(e["coins"] for e in corrected["events"]), 0)
                self.nav("character")
                expect(self.page.locator("#appearance-fallback")).to_be_visible()
                expect(self.page.locator(".avatar-illustration").last).to_have_attribute("aria-label", re.compile("sem acessório"))
                self.personalize()
                self.page.locator('#appearance-form [name="cloak"]').select_option("night")
                self.save_appearance()
                self.assertEqual(self.state()["config"]["appearance"]["accessory"], "leaf")
                raw = self.raw()
                self.page.reload()
                self.assertEqual(self.raw(), raw)
                self.no_errors()

    def test_failed_appearance_write_preserves_form_and_retry_saves_once(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path, self.fixtures["v2"])
                form = self.personalize()
                before = self.snapshot()
                form.locator('[name="cloak"]').select_option("night")
                self.page.evaluate("""()=>{window.refugeFailWrites=true;const original=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(window.refugeFailWrites&&key==='entre-trilhas-v1')throw new DOMException('Quota fictícia','QuotaExceededError');return original.call(this,key,value);};}""")
                form.locator('[type="submit"]').click()
                expect(form).to_be_visible()
                expect(form.locator('[name="cloak"]')).to_have_value("night")
                expect(self.page.locator("#toast")).to_contain_text(re.compile("salvar|espaço|armazenamento", re.I))
                self.assertEqual(self.snapshot(), before)
                self.page.evaluate("window.refugeFailWrites=false")
                self.save_appearance()
                self.assertEqual(self.state()["revision"], json.loads(before[0])["revision"] + 1)
                self.assertEqual(self.state()["events"], json.loads(before[0])["events"])
                self.no_errors()

    def test_store_collection_and_consumption_confirmation_keep_single_debit(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path, self.fixtures["funded"])
                initial = self.state()
                self.nav("shop")
                self.page.locator('[data-action="collection"]').click()
                expect(self.page.locator("#cosmetic-collection-summary")).to_be_focused()
                self.assertTrue(self.page.locator("#cosmetic-collection").evaluate("el=>el.open"))
                self.assertEqual(self.state(), initial)
                self.nav("shop")
                self.page.locator('[data-action="buy"][data-id="video"]').click()
                expect(self.page.locator("#reward-balance-after")).to_contain_text("4")
                self.page.locator("#buy-form").evaluate("el=>{el.requestSubmit();el.requestSubmit();}")
                self.closed()
                purchased = self.state()
                self.assertEqual(len(purchased["purchases"]), 1)
                self.assertEqual(sum(e["coins"] for e in purchased["events"]), 4)
                self.assertEqual(sum(e["xp"] for e in purchased["events"]), 50)
                self.page.locator('[data-action="use"]').click()
                expect(self.page.get_by_role("dialog", name="Confirmar uso da recompensa", exact=True)).to_be_visible()
                self.assertEqual(self.state(), purchased)
                self.page.keyboard.press("Escape")
                self.closed()
                expect(self.page.locator('[data-action="use"]')).to_be_focused()
                self.assertEqual(self.state(), purchased)
                self.page.locator('[data-action="cancel"]').click()
                self.page.wait_for_function("key=>JSON.parse(localStorage.getItem(key)).purchases[0].status==='cancelled'", arg=KEY)
                self.assertEqual(sum(e["coins"] for e in self.state()["events"]), 19)
                self.page.locator('[data-action="buy"][data-id="video"]').click()
                self.page.locator('#buy-form [type="submit"]').click()
                self.closed()
                self.page.locator('[data-action="use"]').click()
                button = self.page.locator('[data-action="confirm-use"]')
                button.evaluate("el=>{el.click();el.click();}")
                self.closed()
                used = self.state()
                self.assertEqual(used["purchases"][-1]["status"], "used")
                self.assertEqual(sum(e["coins"] for e in used["events"]), 4)
                self.assertEqual(sum(e["type"] == "purchase" for e in used["events"]), 2)
                self.assertEqual(sum(e["type"] == "refund" for e in used["events"]), 1)
                expect(self.page.locator('[data-action="cancel"]')).to_have_count(0)
                self.page.reload()
                self.assertEqual(self.state(), used)
                self.no_errors()

    def test_mobile_preview_and_keyboard_fit_without_touching_progress(self):
        for path in PATHS:
            for width in (320, 430):
                with self.subTest(path=path, width=width):
                    self.start(path, self.fixtures["v2"], width)
                    before = self.snapshot()
                    form = self.personalize()
                    for field in ("cloak", "skin", "hair", "accessory", "simplified"):
                        control = form.locator(f'[name="{field}"]')
                        control.focus()
                        expect(control).to_be_focused()
                    form.locator('[name="simplified"]').check()
                    for key in ("books", "lamp", "rug"):
                        form.locator(f'[name="decor"][value="{key}"]').uncheck()
                    expect(self.page.locator("#appearance-preview svg")).to_have_count(2)
                    dims = self.page.evaluate("""()=>{const m=document.querySelector('#modal');return {width:innerWidth,body:document.documentElement.scrollWidth,modal:m.scrollWidth,client:m.clientWidth};}""")
                    self.assertLessEqual(dims["body"], dims["width"] + 1)
                    self.assertLessEqual(dims["modal"], dims["client"] + 1)
                    self.page.keyboard.press("Escape")
                    self.closed()
                    expect(self.opener).to_be_focused()
                    self.assertEqual(self.snapshot(), before)
                    self.collection()
                    summary = self.page.locator("#cosmetic-collection-summary")
                    summary.focus()
                    self.assertGreaterEqual(summary.bounding_box()["height"], 44)
                    if os.environ.get("REFUGE_SCREENSHOTS"):
                        label = "single" if path.endswith("html") else "source"
                        self.page.screenshot(path=f"/tmp/entre-trilhas-refuge-{label}-{width}.png", full_page=False)
                    self.no_errors()

    def test_consumption_quota_and_other_tab_cancel_never_report_false_success(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path, self.fixtures["funded"])
                self.nav("shop")
                self.page.locator('[data-action="buy"][data-id="video"]').click()
                self.page.locator('#buy-form [type="submit"]').click()
                self.closed()
                reserved = self.raw()
                self.page.locator('[data-action="use"]').click()
                self.page.evaluate("""()=>{window.refugeFailWrites=true;const original=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(window.refugeFailWrites&&key==='entre-trilhas-v1')throw new DOMException('Quota fictícia','QuotaExceededError');return original.call(this,key,value);};}""")
                self.page.locator('[data-action="confirm-use"]').click()
                expect(self.page.get_by_role("dialog", name="Confirmar uso da recompensa", exact=True)).to_be_visible()
                expect(self.page.locator("#toast")).to_contain_text(re.compile("salvar|espaço|armazenamento", re.I))
                self.assertEqual(self.raw(), reserved)
                self.page.evaluate("window.refugeFailWrites=false")
                self.page.keyboard.press("Escape")
                self.closed()
                self.page.locator('[data-action="use"]').click()
                other = self.context.new_page()
                try:
                    other.clock.install(time=datetime(2026, 11, 5, 18, 0, tzinfo=timezone.utc))
                    other.goto(BASE + path)
                    other.locator('[data-nav="shop"]').first.click()
                    other.locator('[data-action="cancel"]').click()
                    other.wait_for_function("key=>JSON.parse(localStorage.getItem(key)).purchases[0].status==='cancelled'", arg=KEY)
                    cancelled = self.raw()
                    self.page.locator('[data-action="confirm-use"]').click()
                    expect(self.page.locator("#toast")).to_contain_text(re.compile("reserva mudou|cancelad|confira", re.I))
                    self.assertEqual(self.raw(), cancelled)
                    self.assertEqual(self.state()["purchases"][0]["status"], "cancelled")
                    self.assertEqual(sum(e["coins"] for e in self.state()["events"]), 19)
                    self.assertNotIn("marcada como utilizada", self.page.locator("#toast").inner_text())
                    self.page.keyboard.press("Escape")
                    self.closed()
                    # Uma nova reserva pode ser confirmada após a falha sem
                    # reutilizar o id cancelado ou descontar no consumo.
                    self.page.locator('[data-action="buy"][data-id="video"]').click()
                    self.page.locator('#buy-form [type="submit"]').click()
                    self.closed()
                    paid = self.state()["events"]
                    self.page.locator('[data-action="use"]').click()
                    self.page.locator('[data-action="confirm-use"]').click()
                    self.closed()
                    self.assertEqual(self.state()["events"], paid)
                    self.assertEqual(self.state()["purchases"][-1]["status"], "used")
                finally:
                    other.close()
                self.no_errors()

    def test_collection_second_opener_keeps_focus_after_escape_save_and_other_tab(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path, self.fixtures["v2"])
                self.nav("character")
                collection = self.page.locator("#cosmetic-collection")
                summary = collection.locator(":scope > summary")
                summary.focus()
                self.page.keyboard.press("Enter")
                self.assertTrue(collection.evaluate("el=>el.open"))
                opener = collection.locator('[data-action="appearance"]')
                opener.focus()
                self.page.keyboard.press("Enter")
                expect(self.page.locator("#appearance-form")).to_be_visible()
                before = self.state()
                self.page.keyboard.press("Escape")
                self.closed()
                expect(opener).to_be_focused()
                self.assertEqual(self.state(), before)
                self.page.keyboard.press("Enter")
                self.page.locator('#appearance-form [name="cloak"]').select_option("clay")
                self.save_appearance()
                # Salvar recria a página. O foco precisa voltar à mesma ação
                # dentro do grupo que o usuário abriu, não ao botão do título.
                self.assertTrue(collection.evaluate("el=>el.open"))
                expect(opener).to_be_visible()
                expect(opener).to_be_focused()
                saved = self.state()
                self.assertEqual(saved["events"], before["events"])
                self.assertEqual(saved["purchases"], before["purchases"])
                other = self.context.new_page()
                try:
                    other.clock.install(time=datetime(2026, 11, 5, 18, 0, tzinfo=timezone.utc))
                    other.goto(BASE + path)
                    other.locator('[data-nav="settings"]').first.click()
                    other.locator('#profile-form [name="name"]').fill("Viajante de teste")
                    other.locator('#profile-form [type="submit"]').click()
                    expect(self.page.locator(".character-name")).to_have_text("Viajante de teste")
                    self.page.bring_to_front()
                    self.assertTrue(collection.evaluate("el=>el.open"))
                    expect(opener).to_be_visible()
                    expect(opener).to_be_focused()
                    self.assertEqual(self.state()["events"], saved["events"])
                    self.assertEqual(self.state()["purchases"], saved["purchases"])
                finally:
                    other.close()
                self.no_errors()

    def test_native_200_refuge_and_form_keep_keyboard_focus_and_reflow(self):
        for path in PATHS:
            with self.subTest(path=path):
                with TemporaryDirectory(prefix="vida-refuge-native200-") as profile:
                    context = self.p.chromium.launch_persistent_context(profile,
                        executable_path=os.environ.get("CHROMIUM_PATH", "/usr/bin/chromium"),
                        headless=True, no_viewport=True, timezone_id="America/Sao_Paulo",
                        reduced_motion="reduce", args=["--no-sandbox", "--window-size=640,1000"])
                    type(self).contexts_started += 1
                    try:
                        settings = context.pages[0]
                        settings.goto("chrome://settings/appearance")
                        settings.locator("select#zoomLevel").select_option("2")
                        page = context.new_page()
                        page.clock.install(time=datetime(2026, 11, 5, 18, 0, tzinfo=timezone.utc))
                        page.goto(BASE + path)
                        page.locator('[data-nav="character"]').first.click()
                        opener = page.locator('[data-action="appearance"]').first
                        opener.focus()
                        page.keyboard.press("Enter")
                        expect(page.locator("#appearance-form")).to_be_visible()
                        metrics = page.evaluate("({width:innerWidth,outer:outerWidth,dpr:devicePixelRatio,cssZoom:getComputedStyle(document.documentElement).zoom})")
                        self.assertEqual(metrics["dpr"], 2)
                        self.assertEqual(metrics["cssZoom"], "1")
                        self.assertEqual(metrics["outer"], 640)
                        self.assertAlmostEqual(metrics["width"] * 2, 640, delta=2)
                        for field in ("cloak", "skin", "hair", "accessory", "simplified"):
                            control = page.locator(f'#appearance-form [name="{field}"]')
                            control.focus()
                            expect(control).to_be_focused()
                        save = page.locator('#appearance-form [type="submit"]')
                        save.focus()
                        page.keyboard.press("Tab")
                        self.assertTrue(page.evaluate("document.querySelector('#modal').contains(document.activeElement)"))
                        dims = page.evaluate("""()=>{const m=document.querySelector('#modal');return {width:innerWidth,body:document.documentElement.scrollWidth,modal:m.scrollWidth,client:m.clientWidth};}""")
                        self.assertLessEqual(dims["body"], dims["width"] + 1)
                        self.assertLessEqual(dims["modal"], dims["client"] + 1)
                        if os.environ.get("REFUGE_SCREENSHOTS"):
                            shot = context.new_cdp_session(page).send("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": False})
                            label = "single" if path.endswith("html") else "source"
                            Path(f"/tmp/entre-trilhas-refuge-native200-{label}.png").write_bytes(base64.b64decode(shot["data"]))
                        page.keyboard.press("Escape")
                        expect(page.locator("#modal")).not_to_be_visible()
                        expect(opener).to_be_focused()
                        self.assertIsNone(page.evaluate("key=>localStorage.getItem(key)", KEY))
                    finally:
                        context.close()


if __name__ == "__main__":
    unittest.main(verbosity=2)
