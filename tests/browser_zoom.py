"""R0c: zoom nativo 200% no Chromium, em perfis temporários.

Requer npm start e Playwright/Chromium. Não usa CSS zoom nem emulação CDP:
altera o seletor de zoom em chrome://settings/appearance de um perfil novo.
Não acessa o perfil ou o progresso do usuário. Não equivale a aparelho real,
outros navegadores, leitor de tela ou certificação de acessibilidade.
"""

from datetime import datetime, timezone
import base64
import os
from pathlib import Path
from tempfile import TemporaryDirectory
import unittest

from playwright.sync_api import expect, sync_playwright


BASE_URL = os.environ.get("BASE_URL", "http://127.0.0.1:5173").rstrip("/")
APP_PATHS = os.environ.get("APP_PATHS", "/,/ENTRE-TRILHAS.html").split(",")
ARTIFACTS = Path(os.environ.get("BROWSER_REPORT_DIR", "/tmp/entre-trilhas-r0c"))


class NativeZoom(unittest.TestCase):
    contexts_started = 0

    @classmethod
    def setUpClass(cls):
        ARTIFACTS.mkdir(parents=True, exist_ok=True)
        cls.playwright = sync_playwright().start()

    @classmethod
    def tearDownClass(cls):
        cls.playwright.stop()
        print(f"Zoom nativo 200%: {cls.contexts_started} perfis temporários; "
              "Chromium headless, janelas de 640/1280 px; sem aparelhos reais.")

    def verify_window(self, window_width):
        for path in APP_PATHS:
            with self.subTest(path=path, window_width=window_width):
                with TemporaryDirectory(prefix="vida-r0c-zoom-") as profile:
                    context = self.playwright.chromium.launch_persistent_context(
                        profile, executable_path=os.environ.get("CHROMIUM_PATH", "/usr/bin/chromium"),
                        headless=True, no_viewport=True, timezone_id="America/Sao_Paulo",
                        reduced_motion="reduce",
                        args=["--no-sandbox", f"--window-size={window_width},1000"],
                    )
                    type(self).contexts_started += 1
                    try:
                        settings = context.pages[0]
                        settings.goto("chrome://settings/appearance")
                        settings.locator("select#zoomLevel").select_option("2")
                        page = context.new_page()
                        errors = []
                        page.on("pageerror", lambda error: errors.append(str(error)))
                        page.clock.install(time=datetime(2026, 11, 5, 18, 0, tzinfo=timezone.utc))
                        page.goto(BASE_URL + path)
                        expect(page.locator("#mission-read")).to_be_visible()
                        metrics = page.evaluate("({width:innerWidth,outer:outerWidth,dpr:devicePixelRatio,cssZoom:getComputedStyle(document.documentElement).zoom})")
                        self.assertEqual(metrics["dpr"], 2, metrics)
                        self.assertEqual(metrics["cssZoom"], "1", metrics)
                        self.assertEqual(metrics["outer"], window_width, metrics)
                        self.assertAlmostEqual(metrics["width"] * 2, window_width, delta=2)
                        for screen in ("today", "character", "python", "shop", "history", "settings"):
                            button = page.locator(f'[data-nav="{screen}"]').first
                            button.focus()
                            page.keyboard.press("Enter")
                            expect(page.locator("main h1").first).to_be_focused()
                            self.no_overflow(page, screen)
                        page.locator('[data-action="edit-mission"][data-id="read"]').click()
                        dialog = page.get_by_role("dialog", name="Editar missão", exact=True)
                        expect(dialog).to_be_visible()
                        self.dialog_fits(page, dialog)
                        for field in ("title", "time", "weekendTime", "skill", "secondary", "minXp", "coins"):
                            control = page.locator(f'#mission-form [name="{field}"]')
                            control.focus()
                            expect(control).to_be_focused()
                            box = control.bounding_box()
                            self.assertGreaterEqual(box["x"], -1, field)
                            self.assertLessEqual(box["x"] + box["width"], metrics["width"] + 1, field)
                        page.keyboard.press("Escape")
                        expect(dialog).not_to_be_visible()
                        expect(page.locator('[data-action="edit-mission"][data-id="read"]')).to_be_focused()
                        page.locator('[data-nav="today"]').first.click()
                        opener = page.locator('#mission-read [data-action="reschedule"]')
                        opener.click()
                        dialog = page.get_by_role("dialog", name="Reagendar sem cobrança", exact=True)
                        expect(dialog).to_be_visible()
                        self.dialog_fits(page, dialog)
                        page.keyboard.press("Escape")
                        expect(dialog).not_to_be_visible()
                        expect(opener).to_be_focused()
                        page.evaluate("window.scrollTo(0,0)")
                        page.clock.run_for(50)
                        # Captura da janela física: full_page do Playwright usa
                        # escala do contexto (1) e recorta a imagem no zoom nativo.
                        session = context.new_cdp_session(page)
                        shot = session.send("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": False})
                        (ARTIFACTS / f"{'single' if path.endswith('html') else 'source'}-native200-{window_width}.png").write_bytes(base64.b64decode(shot["data"]))
                        self.assertEqual(errors, [])
                    finally:
                        context.close()

    def no_overflow(self, page, screen):
        dims = page.evaluate("({scroll:document.documentElement.scrollWidth,width:innerWidth})")
        self.assertLessEqual(dims["scroll"], dims["width"] + 1, f"{screen}: {dims}")

    def dialog_fits(self, page, dialog):
        box = dialog.bounding_box()
        self.assertGreaterEqual(box["x"], -1, box)
        self.assertLessEqual(box["x"] + box["width"], page.evaluate("innerWidth") + 1, box)
        self.assertLessEqual(dialog.evaluate("el=>el.scrollWidth"), dialog.evaluate("el=>el.clientWidth") + 1)

    def verify_study_forms(self, window_width):
        """Regressão Python: manter foco e reflow nos dois formulários novos."""
        for path in APP_PATHS:
            with self.subTest(path=path, window_width=window_width):
                with TemporaryDirectory(prefix="vida-study-zoom-") as profile:
                    context = self.playwright.chromium.launch_persistent_context(
                        profile, executable_path=os.environ.get("CHROMIUM_PATH", "/usr/bin/chromium"),
                        headless=True, no_viewport=True, timezone_id="America/Sao_Paulo",
                        reduced_motion="reduce",
                        args=["--no-sandbox", f"--window-size={window_width},1000"],
                    )
                    type(self).contexts_started += 1
                    try:
                        settings = context.pages[0]
                        settings.goto("chrome://settings/appearance")
                        settings.locator("select#zoomLevel").select_option("2")
                        page = context.new_page()
                        errors = []
                        page.on("pageerror", lambda error: errors.append(str(error)))
                        page.clock.install(time=datetime(2026, 11, 5, 18, 0, tzinfo=timezone.utc))
                        page.goto(BASE_URL + path)
                        page.locator('[data-nav="python"]').first.click()
                        metrics = page.evaluate("({width:innerWidth,outer:outerWidth,dpr:devicePixelRatio,cssZoom:getComputedStyle(document.documentElement).zoom})")
                        self.assertEqual(metrics["dpr"], 2, metrics)
                        self.assertEqual(metrics["cssZoom"], "1", metrics)
                        self.assertEqual(metrics["outer"], window_width, metrics)
                        self.assertAlmostEqual(metrics["width"] * 2, window_width, delta=2)
                        self.no_overflow(page, "python")
                        cases = (("session", "session-form", "Registrar sessão de Python"),
                                 ("create-project", "project-form", "Criar projeto de Python"))
                        for action, form, name in cases:
                            opener = page.locator(f'[data-action="{action}"]').first
                            opener.focus()
                            page.keyboard.press("Enter")
                            dialog = page.get_by_role("dialog", name=name, exact=True)
                            expect(dialog).to_be_visible()
                            self.dialog_fits(page, dialog)
                            for control in page.locator(f"#{form} input,#{form} select,#{form} button").all():
                                if control.is_visible():
                                    box = control.bounding_box()
                                    self.assertGreaterEqual(box["x"], -1, box)
                                    self.assertLessEqual(box["x"] + box["width"], metrics["width"] + 1, box)
                            # Título inicial -> fechar -> Shift+Tab reproduzia
                            # BODY fora do diálogo, inclusive em zoom nativo.
                            for key in ("Tab", "Shift+Tab", "Tab", "Shift+Tab"):
                                page.keyboard.press(key)
                                self.assertTrue(dialog.evaluate("el=>el===document.activeElement||el.contains(document.activeElement)"),
                                                f"{name} {key}: " + page.evaluate("document.activeElement.outerHTML.slice(0,200)"))
                            last = page.locator(f"#{form} button[type=submit]")
                            last.focus()
                            page.keyboard.press("Tab")
                            expect(dialog.locator('[data-close]').first).to_be_focused()
                            page.keyboard.press("Shift+Tab")
                            expect(last).to_be_focused()
                            if path == "/" and window_width == 640:
                                shot = context.new_cdp_session(page).send("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": False})
                                (ARTIFACTS / f"study-{action}-native200.png").write_bytes(base64.b64decode(shot["data"]))
                            page.keyboard.press("Escape")
                            expect(dialog).not_to_be_visible()
                            expect(opener).to_be_focused()
                        self.assertEqual(errors, [])
                    finally:
                        context.close()

    def test_study_forms_native_200_at_1280_window(self):
        self.verify_study_forms(1280)

    def test_study_forms_native_200_at_640_window(self):
        self.verify_study_forms(640)

    def test_native_200_at_1280_window(self):
        self.verify_window(1280)

    def test_native_200_at_640_window(self):
        self.verify_window(640)

    def verify_agenda_forms(self, window_width):
        """Agenda e prévia em zoom real, preservando as regressões anteriores."""
        for path in APP_PATHS:
            with self.subTest(path=path, window_width=window_width):
                with TemporaryDirectory(prefix="vida-agenda-zoom-") as profile:
                    context = self.playwright.chromium.launch_persistent_context(
                        profile, executable_path=os.environ.get("CHROMIUM_PATH", "/usr/bin/chromium"),
                        headless=True, no_viewport=True, timezone_id="America/Sao_Paulo",
                        reduced_motion="reduce", args=["--no-sandbox", f"--window-size={window_width},1000"],
                    )
                    type(self).contexts_started += 1
                    try:
                        settings = context.pages[0]
                        settings.goto("chrome://settings/appearance")
                        settings.locator("select#zoomLevel").select_option("2")
                        page = context.new_page()
                        errors = []
                        page.on("pageerror", lambda error: errors.append(str(error)))
                        page.clock.install(time=datetime(2026, 11, 5, 18, 0, tzinfo=timezone.utc))
                        page.goto(BASE_URL + path)
                        metrics = page.evaluate("({width:innerWidth,outer:outerWidth,dpr:devicePixelRatio,cssZoom:getComputedStyle(document.documentElement).zoom})")
                        self.assertEqual(metrics["dpr"], 2, metrics)
                        self.assertEqual(metrics["cssZoom"], "1", metrics)
                        self.assertEqual(metrics["outer"], window_width, metrics)
                        self.assertAlmostEqual(metrics["width"] * 2, window_width, delta=2)
                        opener = page.locator('[data-action="schedule"]').first
                        opener.focus()
                        page.keyboard.press("Enter")
                        dialog = page.get_by_role("dialog", name="Sua agenda", exact=True)
                        expect(dialog).to_be_visible()
                        self.dialog_fits(page, dialog)
                        day = page.locator('#agenda-form [name="day"]')
                        day.fill("2026-11-07")
                        page.locator("#agenda-form").evaluate("form=>form.requestSubmit()")
                        expect(page.locator("#agenda-table")).to_contain_text("07:20")
                        for control in page.locator("#agenda-form button,#agenda-form input").all():
                            if control.is_visible():
                                box = control.bounding_box()
                                self.assertGreaterEqual(box["x"], -1, box)
                                self.assertLessEqual(box["x"] + box["width"], metrics["width"] + 1, box)
                        for key in ("Tab", "Shift+Tab", "Tab", "Shift+Tab"):
                            page.keyboard.press(key)
                            self.assertTrue(dialog.evaluate("el=>el.contains(document.activeElement)"))
                        page.keyboard.press("Escape")
                        expect(dialog).not_to_be_visible()
                        expect(opener).to_be_focused()
                        page.locator('[data-nav="settings"]').first.click()
                        edit = page.locator('[data-action="edit-mission"][data-id="read"]')
                        edit.click()
                        dialog = page.get_by_role("dialog", name="Editar missão", exact=True)
                        preview = page.locator('#mission-form [data-action="preview-schedule"]')
                        preview.focus()
                        page.keyboard.press("Enter")
                        expect(page.locator("#schedule-preview")).to_be_visible()
                        self.dialog_fits(page, dialog)
                        self.no_overflow(page, "agenda/preview")
                        if path == "/" and window_width == 640:
                            shot = context.new_cdp_session(page).send("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": False})
                            (ARTIFACTS / "agenda-preview-native200.png").write_bytes(base64.b64decode(shot["data"]))
                        page.keyboard.press("Escape")
                        expect(dialog).not_to_be_visible()
                        expect(edit).to_be_focused()
                        self.assertEqual(errors, [])
                    finally:
                        context.close()

    def test_agenda_forms_native_200_at_1280_window(self):
        self.verify_agenda_forms(1280)

    def test_agenda_forms_native_200_at_640_window(self):
        self.verify_agenda_forms(640)


if __name__ == "__main__":
    unittest.main(verbosity=2)
