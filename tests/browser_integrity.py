"""R0a: fluxos reais isolados, para o app e o HTML único.

Requer Playwright Python, Chromium e servidor iniciado com ``npm start``.
Execute: python3 tests/browser_integrity.py
BASE_URL e APP_PATHS (separados por vírgula) permitem outro servidor/artefato.
Cada cenário usa um contexto novo; nenhum progresso de um perfil real é lido.
"""

from datetime import datetime, timezone
import json
import os
from pathlib import Path
import re
import unittest

from playwright.sync_api import expect, sync_playwright


KEY = "entre-trilhas-v1"
RECOVERY_KEY = "entre-trilhas-v1-recovery"
BASE_URL = os.environ.get("BASE_URL", "http://127.0.0.1:5173").rstrip("/")
APP_PATHS = os.environ.get("APP_PATHS", "/,/ENTRE-TRILHAS.html").split(",")


class BrowserIntegrity(unittest.TestCase):
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

    def setUp(self):
        self.context = None

    def tearDown(self):
        if self.context:
            self.context.close()

    def start(self, path):
        if self.context:
            self.context.close()
        self.context = self.browser.new_context(
            viewport={"width": 1440, "height": 1000},
            timezone_id="America/Sao_Paulo",
            reduced_motion="reduce",
        )
        self.context.set_default_timeout(5000)
        self.page = self.context.new_page()
        self.errors = []
        self.page.on("pageerror", lambda error: self.errors.append(str(error)))
        self.page.clock.install(time=datetime(2026, 11, 5, 18, 0, tzinfo=timezone.utc))
        self.url = BASE_URL + path
        self.page.goto(self.url)
        expect(self.page.locator("#mission-read")).to_be_visible()

    def raw(self, key=KEY):
        return self.page.evaluate("key => localStorage.getItem(key)", key)

    def state(self):
        return json.loads(self.raw())

    def snapshot(self):
        return self.raw(), self.raw(RECOVERY_KEY)

    def nav(self, name):
        self.page.locator(f'[data-nav="{name}"]').first.click()

    def wait_totals(self, xp, coins):
        self.page.wait_for_function(
            """([key, xp, coins]) => {
              const raw = localStorage.getItem(key);
              if (!raw) return false;
              const s = JSON.parse(raw);
              return s.events.reduce((a, e) => a + e.xp, 0) === xp &&
                     s.events.reduce((a, e) => a + e.coins, 0) === coins;
            }""",
            arg=[KEY, xp, coins],
        )

    def seed(self, rich=False):
        self.page.locator('#mission-read [data-mode="minimum"]').click()
        self.wait_totals(5, 2)
        if rich:
            self.page.locator('#mission-read [data-mode="normal"]').first.click()
            self.wait_totals(10, 5)
            for mission in ("dog-am", "walk-am", "dog-pm"):
                self.page.locator(f'#mission-{mission} [data-action="complete"]').first.click()
            self.wait_totals(50, 19)
            self.nav("shop")
            self.page.locator('[data-action="buy"][data-id="video"]').click()
            self.page.locator("#reward-start").fill("21:30")
            self.page.locator('#buy-form button[type="submit"]').click()
            self.wait_totals(50, 4)
            expect(self.page.locator("#modal")).not_to_be_visible()
            self.page.locator('[data-action="cancel"]').click()
            self.wait_totals(50, 19)
            self.nav("today")
        return self.state()

    def import_bytes(self, content, name="backup.json"):
        self.nav("settings")
        if not isinstance(content, bytes):
            content = content.encode("utf-8")
        self.page.locator("#import-file").set_input_files(
            {"name": name, "mimeType": "application/json", "buffer": content}
        )

    def preview(self, state):
        self.import_bytes(json.dumps(state, ensure_ascii=False))
        expect(self.page.locator('[data-action="confirm-import"]')).to_be_visible()

    def confirm(self):
        self.page.locator('[data-action="confirm-import"]').click()

    def expect_error(self):
        expect(self.page.locator("#toast")).to_have_class(re.compile(r"\berror\b"))

    def block_writes(self, key):
        self.page.evaluate(
            """key => {
              window.__integrityOriginalSetItem = Storage.prototype.setItem;
              Storage.prototype.setItem = function (name, value) {
                if (name === key) throw new DOMException('Quota exceeded', 'QuotaExceededError');
                return window.__integrityOriginalSetItem.call(this, name, value);
              };
              return true;
            }""",
            key,
        )

    def unblock_writes(self):
        self.page.evaluate(
            """() => {
              Storage.prototype.setItem = window.__integrityOriginalSetItem;
              delete window.__integrityOriginalSetItem;
              return true;
            }"""
        )

    def assert_no_page_errors(self):
        self.assertEqual(self.errors, [], "Exceções JS não tratadas")

    def test_rejects_array_maps_without_changing_progress(self):
        for path in APP_PATHS:
            for field in ("records", "overrides", "difficult"):
                with self.subTest(path=path, field=field):
                    self.start(path)
                    state = self.seed()
                    before = self.snapshot()
                    if field == "records":
                        # A versão antiga aceitava o mapa vazio como array;
                        # um registro já existente mascarava essa falha.
                        state["events"] = []
                    state[field] = []
                    self.import_bytes(json.dumps(state))
                    self.expect_error()
                    expect(self.page.locator("#modal")).not_to_be_visible()
                    self.assertEqual(self.snapshot(), before)
                    self.assert_no_page_errors()

    def test_rejects_orphan_event_and_malformed_json(self):
        for path in APP_PATHS:
            for kind in ("orphan", "malformed"):
                with self.subTest(path=path, kind=kind):
                    self.start(path)
                    state = self.seed()
                    before = self.snapshot()
                    if kind == "orphan":
                        state["events"].append(
                            {"id": "orphan-r0a", "at": "2026-11-05T18:00:00.000Z",
                             "day": "2026-11-05", "type": "mission", "title": "Órfão",
                             "xp": 50, "coins": 20}
                        )
                        content = json.dumps(state)
                    else:
                        content = '{"version":1,'
                    self.import_bytes(content)
                    self.expect_error()
                    expect(self.page.locator("#modal")).not_to_be_visible()
                    self.assertEqual(self.snapshot(), before)
                    self.assert_no_page_errors()

    def test_export_restore_reopen_and_recover_previous_copy(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                legacy = self.seed(rich=True)
                self.nav("settings")
                with self.page.expect_download() as info:
                    self.page.locator('[data-action="export"]').click()
                with open(info.value.path(), "rb") as file:
                    exported = file.read()
                self.assertEqual(json.loads(exported), legacy)
                self.nav("today")
                self.page.locator('#mission-exercise [data-mode="minimum"]').click()
                self.wait_totals(55, 21)
                previous_raw = self.raw()
                previous = self.state()
                self.import_bytes(exported)
                self.confirm()
                expect(self.page.locator("#modal")).not_to_be_visible()
                self.wait_totals(50, 19)
                restored_raw = self.raw()
                self.assertEqual(self.state(), legacy)
                recovery = json.loads(self.raw(RECOVERY_KEY))
                self.assertEqual(recovery["version"], 1)
                self.assertIsInstance(recovery["at"], str)
                self.assertEqual(recovery["raw"], previous_raw)
                self.page.reload()
                self.wait_totals(50, 19)
                self.assertEqual(self.state(), legacy)
                self.nav("settings")
                self.page.locator('[data-action="recover"]').click()
                self.page.locator('[data-action="confirm-recover"]').click()
                expect(self.page.locator("#modal")).not_to_be_visible()
                self.wait_totals(55, 21)
                self.assertEqual(self.state(), previous)
                self.assertEqual(json.loads(self.raw(RECOVERY_KEY))["raw"], restored_raw)
                self.page.reload()
                self.wait_totals(55, 21)
                self.assertEqual(self.state(), previous)
                self.assert_no_page_errors()

    def test_legacy_v1_fixture_restores_reopens_and_exports_unchanged(self):
        legacy = json.loads((Path(__file__).parent / "fixtures" / "legacy-v1.json").read_text())
        xp = sum(event["xp"] for event in legacy["events"])
        coins = sum(event["coins"] for event in legacy["events"])
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                self.seed()
                before_raw = self.raw()
                self.preview(legacy)
                self.confirm()
                expect(self.page.locator("#modal")).not_to_be_visible()
                self.wait_totals(xp, coins)
                self.assertEqual(self.state(), legacy)
                self.assertEqual(json.loads(self.raw(RECOVERY_KEY))["raw"], before_raw)
                self.page.reload()
                self.wait_totals(xp, coins)
                self.assertEqual(self.state(), legacy)
                self.nav("settings")
                with self.page.expect_download() as info:
                    self.page.locator('[data-action="export"]').click()
                with open(info.value.path(), "rb") as file:
                    self.assertEqual(json.load(file), legacy)
                self.assert_no_page_errors()

    def test_profile_write_failure_never_reports_success(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                self.seed()
                before = self.snapshot()
                self.nav("settings")
                self.block_writes(KEY)
                self.page.locator("#name").fill("Nome ainda não salvo")
                self.page.locator('#profile-form button[type="submit"]').click()
                self.expect_error()
                expect(self.page.locator("#toast")).not_to_contain_text("Preferências salvas")
                self.assertEqual(self.snapshot(), before)
                expect(self.page.locator("#name")).to_have_value("Nome ainda não salvo")
                self.unblock_writes()
                self.page.reload()
                self.nav("settings")
                expect(self.page.locator("#name")).to_have_value("Viajante")
                self.wait_totals(5, 2)
                self.assert_no_page_errors()

    def test_mission_write_failure_preserves_rank_and_balance(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                self.seed()
                before = self.snapshot()
                self.block_writes(KEY)
                self.page.locator('#mission-read [data-mode="normal"]').first.click()
                self.expect_error()
                self.assertEqual(self.snapshot(), before)
                self.assertEqual(self.state()["records"]["2026-11-05:read"]["rank"], 1)
                self.unblock_writes()
                self.page.reload()
                self.wait_totals(5, 2)
                self.assert_no_page_errors()

    def test_failed_restore_does_not_replace_main_and_can_retry(self):
        for path in APP_PATHS:
            for blocked_key in (KEY, RECOVERY_KEY):
                with self.subTest(path=path, blocked_key=blocked_key):
                    self.start(path)
                    target = self.seed()
                    before = self.snapshot()
                    target["config"]["name"] = "Backup de teste"
                    self.preview(target)
                    self.block_writes(blocked_key)
                    self.confirm()
                    self.expect_error()
                    expect(self.page.locator("#toast")).not_to_contain_text("sucesso")
                    self.assertEqual(self.raw(), before[0])
                    if blocked_key == RECOVERY_KEY:
                        self.assertEqual(self.raw(RECOVERY_KEY), before[1])
                    expect(self.page.locator('[data-action="confirm-import"]')).to_be_visible()
                    self.unblock_writes()
                    self.confirm()
                    expect(self.page.locator("#modal")).not_to_be_visible()
                    self.assertEqual(self.state(), target)
                    self.assertEqual(json.loads(self.raw(RECOVERY_KEY))["raw"], before[0])
                    self.page.reload()
                    self.nav("settings")
                    expect(self.page.locator("#name")).to_have_value("Backup de teste")
                    self.wait_totals(5, 2)
                    self.assert_no_page_errors()

    def test_invalid_backup_keeps_existing_recovery_copy(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                target = self.seed()
                target["config"]["name"] = "Primeira restauração válida"
                self.preview(target)
                self.confirm()
                expect(self.page.locator("#modal")).not_to_be_visible()
                expect(self.page.locator('[data-action="recover"]')).to_be_visible()
                before = self.snapshot()
                target["records"]["2026-11-05:read"]["coins"] += 1
                self.import_bytes(json.dumps(target))
                self.expect_error()
                expect(self.page.locator("#modal")).not_to_be_visible()
                self.assertEqual(self.snapshot(), before)
                self.page.reload()
                self.wait_totals(5, 2)
                self.assert_no_page_errors()

    def test_recovery_main_write_failure_preserves_original_target(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                original = self.seed()
                original_raw = self.raw()
                replacement = json.loads(original_raw)
                replacement["config"]["name"] = "Progresso B"
                self.preview(replacement)
                self.confirm()
                expect(self.page.locator("#modal")).not_to_be_visible()
                replacement_raw = self.raw()
                self.nav("settings")
                self.page.locator('[data-action="recover"]').click()
                expect(self.page.locator('[data-action="confirm-recover"]')).to_be_visible()
                self.block_writes(KEY)
                self.page.locator('[data-action="confirm-recover"]').click()
                self.expect_error()
                expect(self.page.locator("#toast")).not_to_contain_text("Cópia anterior recuperada")
                self.assertEqual(self.raw(), replacement_raw)
                self.page.locator("#modal [data-close]").first.click()
                expect(self.page.locator("#modal")).not_to_be_visible()
                with self.page.expect_download() as info:
                    self.page.locator('[data-action="export-recovery"]').click()
                with open(info.value.path(), "rb") as file:
                    self.assertEqual(file.read(), original_raw.encode("utf-8"))
                self.unblock_writes()
                self.page.locator('[data-action="recover"]').click()
                self.page.locator('[data-action="confirm-recover"]').click()
                expect(self.page.locator("#modal")).not_to_be_visible()
                self.assertEqual(self.state(), original)
                self.assertEqual(json.loads(self.raw(RECOVERY_KEY))["raw"], replacement_raw)
                self.page.reload()
                self.assertEqual(self.state(), original)
                self.wait_totals(5, 2)
                self.assert_no_page_errors()

    def test_external_corruption_exports_valid_memory_and_original_raw(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                original = self.seed()
                corrupt = '{"version":1,"origem":"outra aba",\n'
                other = self.context.new_page()
                other.goto(self.url)
                other.evaluate("([key, raw]) => localStorage.setItem(key, raw)", [KEY, corrupt])
                expect(self.page.locator(".notice.warning")).to_contain_text("Uma cópia válida permanece")
                self.expect_error()
                self.assertEqual(self.raw(), corrupt)
                self.nav("settings")
                with self.page.expect_download() as info:
                    self.page.locator('[data-action="export"]').click()
                with open(info.value.path(), "rb") as file:
                    self.assertEqual(json.load(file), original)
                with self.page.expect_download() as info:
                    self.page.locator('[data-action="export-raw"]').click()
                with open(info.value.path(), "rb") as file:
                    self.assertEqual(file.read(), corrupt.encode("utf-8"))
                self.assertEqual(self.raw(), corrupt)
                other.close()
                self.assert_no_page_errors()

    def test_security_error_after_load_exports_valid_memory(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                original = self.seed()
                before = self.snapshot()
                self.nav("settings")
                self.page.evaluate(
                    """key => {
                      window.__integrityOriginalGetItem = Storage.prototype.getItem;
                      Storage.prototype.getItem = function (name) {
                        if (name === key) throw new DOMException('Storage disabled', 'SecurityError');
                        return window.__integrityOriginalGetItem.call(this, name);
                      };
                      return true;
                    }""",
                    KEY,
                )
                with self.page.expect_download() as info:
                    self.page.locator('[data-action="export"]').click()
                with open(info.value.path(), "rb") as file:
                    self.assertEqual(json.load(file), original)
                expect(self.page.locator("#toast")).to_contain_text("Cópia válida da memória exportada")
                expect(self.page.locator("#toast")).not_to_have_class(re.compile(r"\berror\b"))
                self.page.evaluate(
                    """() => {
                      Storage.prototype.getItem = window.__integrityOriginalGetItem;
                      delete window.__integrityOriginalGetItem;
                      return true;
                    }"""
                )
                self.assertEqual(self.snapshot(), before)
                self.assert_no_page_errors()

    def test_restore_into_empty_storage_can_recover_absence(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                target = self.seed()
                self.page.evaluate("key => localStorage.removeItem(key)", KEY)
                self.page.reload()
                self.assertIsNone(self.raw())
                self.preview(target)
                self.confirm()
                expect(self.page.locator("#modal")).not_to_be_visible()
                self.wait_totals(5, 2)
                restored_raw = self.raw()
                self.assertIsNone(json.loads(self.raw(RECOVERY_KEY))["raw"])
                self.nav("settings")
                self.page.locator('[data-action="recover"]').click()
                self.page.locator('[data-action="confirm-recover"]').click()
                expect(self.page.locator("#modal")).not_to_be_visible()
                self.assertIsNone(self.raw())
                self.assertEqual(json.loads(self.raw(RECOVERY_KEY))["raw"], restored_raw)
                self.page.reload()
                self.assertIsNone(self.raw())
                expect(self.page.locator('#mission-read [data-mode="minimum"]')).to_be_visible()
                self.assert_no_page_errors()

    def test_corrupt_local_raw_is_preserved_and_can_be_exported_after_restore(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                valid = self.seed()
                corrupt = '{"version":1,"quebrado":\n'
                self.page.evaluate("([key, raw]) => localStorage.setItem(key, raw)", [KEY, corrupt])
                self.page.reload()
                self.assertEqual(self.raw(), corrupt)
                self.nav("settings")
                self.page.locator("#name").fill("Não pode apagar o original")
                self.page.locator('#profile-form button[type="submit"]').click()
                self.expect_error()
                self.assertEqual(self.raw(), corrupt)
                self.preview(valid)
                self.confirm()
                expect(self.page.locator("#modal")).not_to_be_visible()
                self.wait_totals(5, 2)
                self.assertEqual(json.loads(self.raw(RECOVERY_KEY))["raw"], corrupt)
                self.nav("settings")
                with self.page.expect_download() as info:
                    self.page.locator('[data-action="export-recovery"]').click()
                with open(info.value.path(), "rb") as file:
                    self.assertEqual(file.read(), corrupt.encode("utf-8"))
                before = self.snapshot()
                self.page.locator('[data-action="recover"]').click()
                confirm = self.page.locator('[data-action="confirm-recover"]')
                if confirm.is_visible():
                    confirm.click()
                self.expect_error()
                self.assertEqual(self.snapshot(), before)
                self.page.reload()
                self.wait_totals(5, 2)
                self.assert_no_page_errors()

    def test_stale_restore_preview_does_not_overwrite_another_tab(self):
        for path in APP_PATHS:
            with self.subTest(path=path):
                self.start(path)
                target = self.seed()
                target["config"]["name"] = "Backup antigo"
                self.preview(target)
                other = self.context.new_page()
                other.goto(self.url)
                other.locator('[data-nav="settings"]').first.click()
                other.locator("#name").fill("Outra aba atualizada")
                other.locator('#profile-form button[type="submit"]').click()
                other.wait_for_function(
                    "key => JSON.parse(localStorage.getItem(key)).config.name === 'Outra aba atualizada'",
                    arg=KEY,
                )
                before = self.snapshot()
                self.confirm()
                self.expect_error()
                self.assertEqual(self.snapshot(), before)
                self.assertEqual(self.state()["config"]["name"], "Outra aba atualizada")
                self.page.locator("#modal [data-close]").first.click()
                expect(self.page.locator("#modal")).not_to_be_visible()
                self.import_bytes(json.dumps(target))
                self.confirm()
                expect(self.page.locator("#modal")).not_to_be_visible()
                self.assertEqual(self.state(), target)
                self.assertEqual(json.loads(self.raw(RECOVERY_KEY))["raw"], before[0])
                other.close()
                self.assert_no_page_errors()


if __name__ == "__main__":
    unittest.main(verbosity=2)
