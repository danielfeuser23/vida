"""Conteúdo Python 1–7: Chromium real, contextos fictícios e descartáveis.

Execute com npm start ativo: python3 tests/browser_content.py
BASE_URL e APP_PATHS selecionam o servidor e os dois artefatos. Não acessa
perfis pessoais, não executa Python no navegador e não verifica aparelho físico.
"""
from datetime import datetime, timezone
import base64
import json
import os
from pathlib import Path
import subprocess
from tempfile import TemporaryDirectory
import unittest

from playwright.sync_api import expect, sync_playwright

KEY = "entre-trilhas-v1"
RECOVERY = "entre-trilhas-v1-recovery"
ROOT = Path(__file__).resolve().parents[1]
BASE = os.environ.get("BASE_URL", "http://127.0.0.1:5173").rstrip("/")
PATHS = os.environ.get("APP_PATHS", "/,/ENTRE-TRILHAS.html").split(",")


class BrowserContent(unittest.TestCase):
    contexts_started = 0

    @classmethod
    def setUpClass(cls):
        code = """
        import * as E from './engine.js';
        import {roadmap} from './roadmap.js';
        const old=E.createState('2026-10-01');
        for(let i=0;i<7;i++)E.complete(old,'python',E.addDays(old.created,i),'normal',roadmap);
        console.log(JSON.stringify({v1:E.serializeState(old),v2:E.serializeState(E.migrateStudyState(old))}));
        """
        result = subprocess.run(["node", "--input-type=module", "-e", code], cwd=ROOT,
                                capture_output=True, text=True, check=True)
        cls.fixtures = json.loads(result.stdout)
        cls.p = sync_playwright().start()
        cls.browser = cls.p.chromium.launch(
            executable_path=os.environ.get("CHROMIUM_PATH", "/usr/bin/chromium"),
            headless=True, args=["--no-sandbox"])

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.p.stop()
        print(f"Conteúdo Python: {cls.contexts_started} contextos isolados; Chromium automatizado.")

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
        if raw is not None:
            self.context.add_init_script("if(localStorage.getItem(" + json.dumps(KEY) +
                                         ")===null)localStorage.setItem(" + json.dumps(KEY) + "," +
                                         json.dumps(raw) + ");")
        self.page = self.context.new_page()
        self.errors = []
        self.page.on("pageerror", lambda error: self.errors.append(str(error)))
        self.page.clock.install(time=datetime(2026, 11, 5, 18, 0, tzinfo=timezone.utc))
        self.page.goto(BASE + path)
        expect(self.page.locator("#mission-read")).to_be_visible()

    def raw(self, key=KEY):
        return self.page.evaluate("key=>localStorage.getItem(key)", key)

    def snapshot(self):
        return self.raw(), self.raw(RECOVERY)

    def state(self):
        return json.loads(self.raw())

    def nav(self, name):
        self.page.locator(f'[data-nav="{name}"]').first.click()

    def open_phase(self, number):
        self.nav("python")
        self.opener = self.page.locator(f'[data-lesson="{number}"]')
        self.opener.click()
        expect(self.page.get_by_role("dialog")).to_be_visible()
        article = self.page.locator(f'article.lesson-content[data-content-phase="{number}"]')
        expect(article).to_be_visible()
        return article

    def open_details(self, selector, keyboard=False):
        details = self.page.locator(selector)
        summary = details.locator(":scope > summary")
        if not details.evaluate("el=>el.open"):
            if keyboard:
                summary.focus()
                self.page.keyboard.press("Enter")
            else:
                summary.click()
        self.assertTrue(details.evaluate("el=>el.open"))
        return details

    def closed(self):
        expect(self.page.locator("#modal")).not_to_be_visible()

    def no_errors(self):
        self.assertEqual(self.errors, [])

    def test_first_seven_readable_with_legacy_v1_v2_and_no_history_recount(self):
        for path in PATHS:
            for version in ("v1", "v2"):
                with self.subTest(path=path, version=version):
                    raw = self.fixtures[version]
                    self.start(path, raw)
                    before = self.snapshot()
                    original = self.state()
                    self.assertEqual(sum(item["exercises"] for item in original["lessons"]), 35)
                    for number in range(1, 8):
                        article = self.open_phase(number)
                        if number == 1:
                            preparation = self.open_details("#lesson-1-preparation")
                            expect(preparation).to_contain_text("Preparação não é exercício de programação resolvido")
                            expect(preparation.locator("details.lesson-exercise")).to_have_count(0)
                        expect(article.locator("details.lesson-exercise")).to_have_count(10)
                        expect(article.locator("details[data-solution][open]")).to_have_count(0)
                        expect(article.locator("details[data-hint][open]")).to_have_count(0)
                        self.open_details(f"#lesson-{number}-basic")
                        expect(article.locator(f"#lesson-{number}-basic details.lesson-exercise")).to_have_count(4)
                        self.open_details(f"#lesson-{number}-extra")
                        expect(article.locator(f"#lesson-{number}-extra details.lesson-exercise")).to_have_count(6)
                        self.open_details(f"#lesson-{number}-explanation")
                        expect(article.locator("pre[data-example-code]")).to_be_visible()
                        expect(self.page.locator("#exercise-count")).to_have_count(0)
                        self.page.keyboard.press("Escape")
                        self.closed()
                        self.assertEqual(self.snapshot(), before)
                    self.page.reload()
                    self.assertEqual(self.snapshot(), before)
                    self.assertEqual(self.state(), original)
                    self.no_errors()

    def test_keyboard_hints_and_solution_are_optional_and_do_not_write(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path)
                self.open_phase(1)
                before = self.snapshot()
                self.open_details("#lesson-1-basic", keyboard=True)
                exercise = self.open_details("#lesson-exercise-p1-b1", keyboard=True)
                expect(exercise.locator("[data-solution-code]")).not_to_be_visible()
                first_hint = exercise.locator('details[data-hint="1"]')
                expect(first_hint).not_to_have_attribute("open", "")
                self.open_details('#lesson-exercise-p1-b1 details[data-hint="1"]', keyboard=True)
                second_hint = exercise.locator('details[data-hint="2"]')
                expect(second_hint.locator(":scope > summary")).to_be_visible()
                self.open_details('#lesson-exercise-p1-b1 details[data-hint="2"]', keyboard=True)
                self.open_details("#lesson-exercise-p1-b1 details[data-solution]", keyboard=True)
                expect(exercise.locator("pre[data-solution-code]")).to_be_visible()
                self.assertIn("#", exercise.locator("pre[data-solution-code]").inner_text())
                self.page.keyboard.press("Tab")
                expect(exercise.locator("pre[data-solution-code]")).to_be_focused()
                last = self.page.locator('[data-action="finish-lesson"]')
                last.focus()
                self.page.keyboard.press("Tab")
                expect(self.page.locator('#modal [data-close]').first).to_be_focused()
                self.page.keyboard.press("Shift+Tab")
                expect(last).to_be_focused()
                self.assertEqual(self.snapshot(), before)
                self.page.keyboard.press("Escape")
                self.closed()
                expect(self.opener).to_be_focused()
                self.open_phase(1)
                expect(self.page.locator("article.lesson-content details[data-solution][open]")).to_have_count(0)
                expect(self.page.locator("article.lesson-content details[data-hint][open]")).to_have_count(0)
                self.assertEqual(self.snapshot(), before)
                self.no_errors()

    def test_manual_session_and_phase_keep_separate_rewards_and_exercise_counts(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path)
                self.open_phase(1)
                self.open_details("#lesson-1-extra")
                self.assertIsNone(self.raw())
                self.page.locator('#modal [data-action="session"]').click()
                form = self.page.locator("#session-form")
                expect(form.locator('[name="minutes"]')).to_have_value("120")
                expect(form.locator('[name="exercises"]')).to_have_value("0")
                form.locator('[name="minutes"]').fill("60")
                form.locator('[name="exercises"]').fill("2")
                form.locator('[name="goal"]').fill("Reescrever duas mensagens sem copiar")
                form.locator('[type="submit"]').click()
                self.closed()
                before = self.state()
                self.assertEqual(sum(e["xp"] for e in before["events"]), 60)
                self.assertEqual(sum(e["coins"] for e in before["events"]), 18)
                self.assertEqual(before["lessons"], [])
                self.open_phase(1)
                self.page.locator("#criterion-check").check()
                self.page.locator('[data-action="finish-lesson"]').click()
                self.closed()
                after = self.state()
                self.assertEqual(after["events"], before["events"])
                self.assertEqual(after["lessons"], [{"id": 1, "day": "2026-11-05", "exercises": 0, "project": False}])
                sessions = [a for a in after["study"]["actions"] if a["type"] == "session"]
                self.assertEqual([(a["minutes"], a["exercises"]) for a in sessions], [(60, 2)])
                self.page.reload()
                self.assertEqual(self.state(), after)
                self.open_phase(1)
                expect(self.page.locator('[data-action="finish-lesson"]')).to_have_count(0)
                self.page.keyboard.press("Escape")
                self.assertEqual(self.state(), after)
                self.no_errors()

    def test_mobile_expanded_content_keeps_code_inside_dialog_and_keyboard_focus(self):
        for path in PATHS:
            for width in (320, 430):
                with self.subTest(path=path, width=width):
                    self.start(path, self.fixtures["v2"], width)
                    self.open_phase(7)
                    before = self.snapshot()
                    self.open_details("#lesson-7-explanation", keyboard=True)
                    self.open_details("#lesson-7-extra", keyboard=True)
                    self.open_details("#lesson-exercise-p7-e1", keyboard=True)
                    self.open_details("#lesson-exercise-p7-e1 details[data-solution]", keyboard=True)
                    expect(self.page.locator("#lesson-exercise-p7-e1 pre[data-solution-code]")).to_be_visible()
                    overflow = self.page.evaluate("""()=>{
                      const modal=document.querySelector('#modal');
                      const visible=[...modal.querySelectorAll('pre')].filter(el=>el.getClientRects().length);
                      const box=modal.getBoundingClientRect();
                      return {body:document.documentElement.scrollWidth>innerWidth+1,
                        modal:modal.scrollWidth>modal.clientWidth+1,
                        outside:visible.some(el=>{const r=el.getBoundingClientRect();return r.left<box.left-1||r.right>box.right+1;})};
                    }""")
                    self.assertEqual(overflow, {"body": False, "modal": False, "outside": False})
                    summary = self.page.locator("#exercise-p7-e1-solution-summary")
                    expect(summary).to_be_focused()
                    self.page.keyboard.press("Tab")
                    self.assertTrue(self.page.evaluate("document.querySelector('#modal').contains(document.activeElement)"))
                    self.page.keyboard.press("Escape")
                    self.closed()
                    expect(self.opener).to_be_focused()
                    self.assertEqual(self.snapshot(), before)
                    if path == "/" and os.environ.get("CONTENT_SCREENSHOTS"):
                        self.open_phase(7)
                        self.open_details("#lesson-7-explanation")
                        self.page.screenshot(path=f"/tmp/entre-trilhas-content-{width}.png", full_page=False)
                    self.no_errors()

    def test_restore_existing_backup_then_read_content_and_reopen_preserves_recovery(self):
        for path in PATHS:
            for version in ("v1", "v2"):
                with self.subTest(path=path, version=version):
                    self.start(path)
                    self.page.locator('#mission-read [data-mode="minimum"]').click()
                    self.page.wait_for_function("key=>localStorage.getItem(key)!==null", arg=KEY)
                    original = self.raw()
                    self.nav("settings")
                    self.page.locator("#import-file").set_input_files({
                        "name": "backup-ficticio.json", "mimeType": "application/json",
                        "buffer": self.fixtures[version].encode("utf-8")})
                    self.page.locator('[data-action="confirm-import"]').click()
                    self.closed()
                    self.assertEqual(self.state(), json.loads(self.fixtures[version]))
                    self.assertEqual(json.loads(self.raw(RECOVERY))["raw"], original)
                    before = self.snapshot()
                    self.open_phase(7)
                    self.open_details("#lesson-7-review", keyboard=True)
                    self.page.keyboard.press("Escape")
                    self.page.reload()
                    self.assertEqual(self.snapshot(), before)
                    self.no_errors()

    def test_study_plan_and_minimum_keep_pause_outside_practice(self):
        for path in PATHS:
            with self.subTest(path=path):
                self.start(path)
                self.page.locator('[data-action="schedule"]').first.click()
                rows = self.page.locator('#agenda-table tr[data-mission-id="python"]')
                self.assertEqual(rows.count(), 2)
                self.assertEqual([r.locator("td").first.inner_text() for r in rows.all()],
                                 ["18:00–19:00", "19:10–20:10"])
                pause = self.page.locator("#agenda-table tr").filter(has_text="19:00–19:10")
                expect(pause).to_contain_text("Pausa")
                self.page.keyboard.press("Escape")
                self.page.locator('#mission-python [data-action="session"][data-mode="minimum"]').click()
                form = self.page.locator("#session-form")
                expect(form.locator('[name="minutes"]')).to_have_value("5")
                expect(form.locator('[name="exercises"]')).to_have_value("0")
                expect(form).to_contain_text("pausa de dez minutos fica fora da contagem")
                self.assertIsNone(self.raw())
                self.page.keyboard.press("Escape")
                self.closed()
                self.no_errors()

    def test_content_native_200_percent_zoom_keeps_keyboard_and_reflow(self):
        for path in PATHS:
            with self.subTest(path=path):
                with TemporaryDirectory(prefix="vida-content-native200-") as profile:
                    context = self.p.chromium.launch_persistent_context(
                        profile, executable_path=os.environ.get("CHROMIUM_PATH", "/usr/bin/chromium"),
                        headless=True, no_viewport=True, timezone_id="America/Sao_Paulo",
                        reduced_motion="reduce", args=["--no-sandbox", "--window-size=640,1000"])
                    type(self).contexts_started += 1
                    try:
                        settings = context.pages[0]
                        settings.goto("chrome://settings/appearance")
                        settings.locator("select#zoomLevel").select_option("2")
                        page = context.new_page()
                        errors = []
                        page.on("pageerror", lambda error: errors.append(str(error)))
                        page.clock.install(time=datetime(2026, 11, 5, 18, 0, tzinfo=timezone.utc))
                        page.goto(BASE + path)
                        page.locator('[data-nav="python"]').first.click()
                        opener = page.locator('[data-lesson="1"]')
                        opener.focus()
                        page.keyboard.press("Enter")
                        expect(page.locator("article.lesson-content")).to_be_visible()
                        metrics = page.evaluate("({width:innerWidth,outer:outerWidth,dpr:devicePixelRatio,cssZoom:getComputedStyle(document.documentElement).zoom})")
                        self.assertEqual(metrics["dpr"], 2)
                        self.assertEqual(metrics["cssZoom"], "1")
                        self.assertEqual(metrics["outer"], 640)
                        self.assertAlmostEqual(metrics["width"] * 2, 640, delta=2)
                        for selector in ("#lesson-1-preparation", "#lesson-1-explanation", "#lesson-1-basic",
                                         "#lesson-exercise-p1-b1", "#lesson-exercise-p1-b1 details[data-solution]"):
                            details = page.locator(selector)
                            details.locator(":scope > summary").focus()
                            page.keyboard.press("Enter")
                            self.assertTrue(details.evaluate("el=>el.open"))
                        expect(page.locator("pre[data-solution-code]").first).to_be_visible()
                        dimensions = page.evaluate("""()=>{
                          const el=document.querySelector('#modal');return {
                            body:document.documentElement.scrollWidth,width:innerWidth,
                            modal:el.scrollWidth,client:el.clientWidth};
                        }""")
                        self.assertLessEqual(dimensions["body"], dimensions["width"] + 1)
                        self.assertLessEqual(dimensions["modal"], dimensions["client"] + 1)
                        for summary in page.locator("article.lesson-content summary:visible").all():
                            self.assertGreaterEqual(summary.bounding_box()["height"], 44)
                        if os.environ.get("CONTENT_SCREENSHOTS"):
                            capture = context.new_cdp_session(page).send("Page.captureScreenshot", {
                                "format": "png", "captureBeyondViewport": False})
                            label = "single" if path.endswith("html") else "source"
                            Path(f"/tmp/entre-trilhas-content-native200-{label}.png").write_bytes(
                                base64.b64decode(capture["data"]))
                        page.keyboard.press("Tab")
                        self.assertTrue(page.evaluate("document.querySelector('#modal').contains(document.activeElement)"))
                        page.keyboard.press("Escape")
                        expect(page.locator("#modal")).not_to_be_visible()
                        expect(opener).to_be_focused()
                        self.assertIsNone(page.evaluate("key=>localStorage.getItem(key)", KEY))
                        self.assertEqual(errors, [])
                    finally:
                        context.close()


if __name__ == "__main__":
    unittest.main(verbosity=2)
