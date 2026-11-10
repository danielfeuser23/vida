"""R0b: abertura e operações reais, sempre em contextos descartáveis.

Requer ``npm start``, Playwright Python e Chromium. Execute:
    python3 tests/browser_opening.py

localhost usa o servidor HTTP real. As origens HTTP de rede local e HTTPS são
simuladas por route.fulfill dos arquivos locais: exercitam as APIs de segurança
do navegador, sem testar uma rede física, aparelho, certificado ou conexão TLS.
Nenhuma opção para ignorar certificados ou tratar HTTP como seguro é usada.
BASE_URL, APP_PATHS, BROWSER_ORIGINS e BROWSER_APP_ROOT permitem repetir a
regressão contra um snapshot anterior sem alterar as fontes/progresso reais.
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
RECOVERY_KEY = KEY + "-recovery"
PROJECT = Path(__file__).resolve().parents[1]
ROOT = Path(os.environ.get("BROWSER_APP_ROOT", PROJECT)).resolve()
BASE_URL = os.environ.get("BASE_URL", "http://127.0.0.1:5173").rstrip("/")
APP_PATHS = os.environ.get("APP_PATHS", "/,/ENTRE-TRILHAS.html").split(",")
ORIGINS = {
    "localhost": (BASE_URL, False, True),
    "lan": ("http://entretrilhas.test", True, False),
    "https": ("https://entretrilhas.test", True, True),
}
SELECTED = os.environ.get("BROWSER_ORIGINS", "localhost,lan,https").split(",")
UUID4 = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$", re.I)


class BrowserOpening(unittest.TestCase):
    contexts_started = 0

    @classmethod
    def setUpClass(cls):
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(
            executable_path=os.environ.get("CHROMIUM_PATH", "/usr/bin/chromium"),
            headless=True,
            args=["--no-sandbox"],
        )

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        print(f"R0b: {cls.contexts_started} contextos isolados; localhost HTTP real; "
              "HTTP não confiável e HTTPS via arquivos interceptados (sem TLS/rede/aparelho real).")

    def setUp(self):
        self.context = None

    def tearDown(self):
        if self.context:
            self.context.close()

    def start(self, origin, path, raw=None, provider="native"):
        if self.context:
            self.context.close()
        self.context = self.browser.new_context(
            viewport={"width": 1440, "height": 1000},
            timezone_id="America/Sao_Paulo", reduced_motion="reduce",
        )
        type(self).contexts_started += 1
        self.context.set_default_timeout(5000)
        base, intercepted, secure = ORIGINS[origin]
        if intercepted:
            def fulfill(route):
                name = unquote(urlparse(route.request.url).path)
                target = (ROOT / ("index.html" if name == "/" else name.lstrip("/"))).resolve()
                if not target.is_relative_to(ROOT) or not target.is_file():
                    route.fulfill(status=404, body="Não encontrado")
                    return
                mime = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
                route.fulfill(status=200, content_type=mime, body=target.read_bytes())
            self.context.route(base + "/**", fulfill)
        if raw is not None:
            # Only the first opening is seeded; reload must read the actual save.
            self.context.add_init_script(
                "if (localStorage.getItem(" + json.dumps(KEY) + ") === null) "
                "localStorage.setItem(" + json.dumps(KEY) + "," + json.dumps(raw) + ");"
            )
        if provider != "native":
            self.context.add_init_script("""(() => {
              Object.defineProperty(crypto, 'randomUUID', {value: undefined, configurable: true});
            })();""")
        if provider == "none":
            self.context.add_init_script("""(() => {
              Object.defineProperty(globalThis, 'crypto', {value: undefined, configurable: true});
            })();""")
        self.errors = []
        self.page = self.new_page(base + path)
        self.assertEqual(self.page.evaluate("isSecureContext"), secure)
        if origin == "lan" or provider != "native":
            self.assertEqual(self.page.evaluate("typeof globalThis.crypto?.randomUUID"), "undefined")
        self.url = base + path

    def new_page(self, url):
        page = self.context.new_page()
        page.on("pageerror", lambda error: self.errors.append(str(error)))
        page.clock.install(time=datetime(2026, 11, 5, 18, 0, tzinfo=timezone.utc))
        page.goto(url)
        expect(page.locator("#mission-read")).to_be_visible()
        return page

    def raw(self, key=KEY):
        return self.page.evaluate("key => localStorage.getItem(key)", key)

    def state(self):
        return json.loads(self.raw())

    def nav(self, name):
        self.page.locator(f'[data-nav="{name}"]').first.click()

    def wait_totals(self, xp, coins):
        self.page.wait_for_function("""([key, xp, coins]) => {
          if (document.querySelector('#toast.error')) return true;
          const raw = localStorage.getItem(key);
          if (!raw) return false;
          const s = JSON.parse(raw);
          return s.events.reduce((a, e) => a + e.xp, 0) === xp &&
                 s.events.reduce((a, e) => a + e.coins, 0) === coins;
        }""", arg=[KEY, xp, coins])
        raw = self.raw()
        actual = None if raw is None else tuple(
            sum(event[field] for event in json.loads(raw)["events"])
            for field in ("xp", "coins")
        )
        self.assertEqual(actual, (xp, coins), self.page.locator("#toast").inner_text())

    def burst(self, selector, count=4):
        self.page.locator(selector).first.evaluate(
            "(el, count) => {for (let i=0; i<count; i++) el.click();}", count
        )

    def open_purchase(self):
        self.nav("shop")
        self.page.locator('[data-action="buy"][data-id="video"]').click()
        self.assert_no_errors()
        expect(self.page.locator("#buy-form")).to_be_visible()
        self.page.locator("#reward-start").fill("21:30")

    def buy_burst(self):
        self.page.locator("#buy-form").evaluate("""form => {
          for (let i=0; i<4; i++) form.dispatchEvent(
            new Event('submit', {bubbles:true, cancelable:true}));
        }""")
        expect(self.page.locator("#modal")).not_to_be_visible()

    def assert_identifiers(self):
        s = self.state()
        identifiers = [event["id"] for event in s["events"]]
        identifiers += [purchase["id"] for purchase in s["purchases"]]
        # Legacy request IDs intentionally remain valid; all newly generated IDs
        # in this test (including request IDs) must be secure UUID v4 values.
        identifiers += [purchase["requestId"] for purchase in s["purchases"]]
        self.assertEqual(len(identifiers), len(set(identifiers)))
        self.assertTrue(all(UUID4.fullmatch(value) for value in identifiers), identifiers)

    def assert_no_errors(self):
        self.assertEqual(self.errors, [], "Exceções JavaScript não tratadas")

    def test_complete_normal_on_supported_origins(self):
        for origin in SELECTED:
            for path in APP_PATHS:
                with self.subTest(origin=origin, path=path):
                    self.start(origin, path)
                    self.page.locator('#mission-read [data-mode="normal"]').first.click()
                    self.wait_totals(10, 5)
                    self.assertEqual(len(self.state()["events"]), 1)
                    self.page.reload()
                    expect(self.page.locator("#mission-read")).to_have_class("mission done")
                    self.wait_totals(10, 5)
                    self.assert_identifiers()
                    self.assert_no_errors()

    def test_open_and_confirm_purchase_on_supported_origins(self):
        fixture = (PROJECT / "tests/fixtures/legacy-v1.json").read_text()
        for origin in SELECTED:
            for path in APP_PATHS:
                with self.subTest(origin=origin, path=path):
                    self.start(origin, path, raw=fixture)
                    self.open_purchase()
                    self.buy_burst()
                    self.wait_totals(258, 64)
                    state = self.state()
                    self.assertEqual(len(state["purchases"]), 2)
                    purchase = state["purchases"][-1]
                    self.assertEqual((purchase["start"], purchase["end"]), ("21:30", "21:50"))
                    for value in (purchase["id"], purchase["requestId"], state["events"][-1]["id"]):
                        self.assertRegex(value, UUID4)
                    self.page.reload()
                    self.wait_totals(258, 64)
                    self.assert_no_errors()

    def test_repeated_actions_upgrade_split_refund_and_correction(self):
        for origin in SELECTED:
            for path in APP_PATHS:
                with self.subTest(origin=origin, path=path):
                    self.start(origin, path)
                    self.burst('#mission-read [data-mode="minimum"]')
                    self.wait_totals(5, 2)
                    self.assertEqual(len(self.state()["events"]), 1)
                    self.burst('#mission-read [data-mode="normal"]')
                    self.wait_totals(10, 5)
                    self.assertEqual([(e["xp"], e["coins"]) for e in self.state()["events"]], [(5, 2), (5, 3)])
                    for mission in ("dog-am", "walk-am", "dog-pm"):
                        self.burst(f'#mission-{mission} [data-action="complete"]')
                    self.wait_totals(50, 19)
                    split = self.state()["records"]["2026-11-05:walk-am"]["skills"]
                    self.assertEqual(split, {"fitness": 10, "dog": 10})
                    self.assertEqual(sum(sum(e.get("skills", {}).values()) for e in self.state()["events"]), 50)
                    self.open_purchase()
                    self.buy_burst()
                    self.wait_totals(50, 4)
                    self.assertEqual(len(self.state()["purchases"]), 1)
                    self.assertEqual(sum(e["type"] == "purchase" for e in self.state()["events"]), 1)
                    self.burst('[data-action="cancel"]')
                    self.wait_totals(50, 19)
                    self.assertEqual(sum(e["type"] == "refund" for e in self.state()["events"]), 1)
                    self.nav("today")
                    undo_read = self.page.locator('#mission-read [data-action="undo"]').first
                    if not undo_read.is_visible():
                        completed = self.page.locator("details.completed-missions:has(#mission-read)")
                        if completed.count() and not completed.evaluate("el=>el.open"):
                            completed.locator("summary").click()
                        expect(undo_read).to_be_visible()
                    undo_read.click()
                    self.burst('[data-action="confirm-undo"]')
                    self.wait_totals(40, 14)
                    self.assertEqual(sum(e["type"] == "undo" for e in self.state()["events"]), 1)
                    self.assertNotIn("2026-11-05:read", self.state()["records"])
                    self.assert_identifiers()
                    self.page.reload()
                    self.wait_totals(40, 14)
                    self.assert_no_errors()

    def test_secure_context_fallback_uses_get_random_values(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start("https", path, provider="fallback")
                self.assertEqual(self.page.evaluate("typeof crypto.getRandomValues"), "function")
                for mission in ("read", "dog-am", "walk-am", "dog-pm"):
                    self.page.locator(f'#mission-{mission} [data-mode="normal"]').first.click()
                self.wait_totals(50, 19)
                self.open_purchase()
                self.buy_burst()
                self.wait_totals(50, 4)
                self.assert_identifiers()
                self.assert_no_errors()

    def test_missing_entropy_fails_safely_without_changing_progress(self):
        fixture = (PROJECT / "tests/fixtures/legacy-v1.json").read_text()
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start("https", path, raw=fixture, provider="none")
                before = self.raw()
                self.page.locator('#mission-read [data-mode="normal"]').first.click()
                expect(self.page.locator("#toast")).to_have_class(re.compile(r"\berror\b"))
                expect(self.page.locator("#toast")).to_contain_text(re.compile(r"identific|aleat|segur|compat", re.I))
                self.assertEqual(self.raw(), before)
                self.nav("shop")
                self.page.locator('[data-action="buy"][data-id="video"]').click()
                expect(self.page.locator("#toast")).to_have_class(re.compile(r"\berror\b"))
                expect(self.page.locator("#modal")).not_to_be_visible()
                self.assertEqual(self.raw(), before)
                self.assert_no_errors()

    def test_backup_v1_restore_and_recover_on_each_origin(self):
        fixture = (PROJECT / "tests/fixtures/legacy-v1.json").read_text()
        for origin in SELECTED:
            for path in APP_PATHS:
                with self.subTest(origin=origin, path=path):
                    self.start(origin, path)
                    self.page.locator('#mission-read [data-mode="minimum"]').click()
                    self.wait_totals(5, 2)
                    before = self.raw()
                    self.nav("settings")
                    self.page.locator("#import-file").set_input_files({
                        "name": "legacy-v1.json", "mimeType": "application/json", "buffer": fixture.encode(),
                    })
                    expect(self.page.locator('[data-action="confirm-import"]')).to_be_visible()
                    self.page.locator('[data-action="confirm-import"]').click()
                    expect(self.page.locator("#modal")).not_to_be_visible()
                    self.wait_totals(258, 79)
                    self.assertEqual(json.loads(self.raw(RECOVERY_KEY))["raw"], before)
                    self.assertEqual(self.state()["version"], 1)
                    self.page.reload()
                    self.wait_totals(258, 79)
                    self.nav("settings")
                    with self.page.expect_download() as info:
                        self.page.locator('[data-action="export"]').click()
                    exported = json.loads(Path(info.value.path()).read_text())
                    self.assertEqual(exported, json.loads(fixture))
                    self.page.locator('[data-action="recover"]').click()
                    self.page.locator('[data-action="confirm-recover"]').click()
                    expect(self.page.locator("#modal")).not_to_be_visible()
                    self.wait_totals(5, 2)
                    self.assertEqual(self.raw(), before)
                    self.page.reload()
                    self.wait_totals(5, 2)
                    self.assert_no_errors()

    def test_two_tabs_with_web_locks_serialize_repeated_occurrence(self):
        for origin in [name for name in SELECTED if ORIGINS[name][2]]:
            for path in APP_PATHS:
                with self.subTest(origin=origin, path=path):
                    self.start(origin, path)
                    self.assertTrue(self.page.evaluate("Boolean(navigator.locks)"))
                    second = self.new_page(self.url)
                    # Hold a real origin lock, queue stale UI clicks from both
                    # tabs, then release; this guarantees overlap, without sleeps.
                    self.page.evaluate("""key => {
                      window.__testLockHeld = false;
                      navigator.locks.request(key, async () => {
                        window.__testLockHeld = true;
                        await new Promise(resolve => window.__releaseTestLock = resolve);
                      });
                    }""", KEY)
                    self.page.wait_for_function("window.__testLockHeld")
                    for page in (self.page, second):
                        page.locator('#mission-read [data-mode="minimum"]').evaluate("el => el.click()")
                    self.page.evaluate("window.__releaseTestLock()")
                    self.wait_totals(5, 2)
                    self.page.wait_for_function("""async key => {
                      const state = await navigator.locks.query();
                      return !state.held.some(lock => lock.name===key) &&
                             !state.pending.some(lock => lock.name===key);
                    }""", arg=KEY)
                    self.assertEqual(len(self.state()["events"]), 1)
                    second.reload()
                    expect(second.locator('#mission-read .chip')).to_contain_text("Mínima feita")
                    self.assert_no_errors()


if __name__ == "__main__":
    unittest.main(verbosity=2)
