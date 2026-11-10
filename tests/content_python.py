"""Execute os exemplos/soluções locais; não adiciona execução ao aplicativo.

Requer Python 3.10+ e Node.js. Usa arquivos e subprocessos temporários, stdin
controlado e limite de tempo. Nenhum progresso do navegador é lido ou alterado.
"""
import ast
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]


def load_catalogue():
    result = subprocess.run(
        ['node', '--input-type=module', '-e',
         'import {pythonContent} from "./python-content.js"; process.stdout.write(JSON.stringify(pythonContent));'],
        cwd=ROOT, capture_output=True, text=True, encoding='utf-8', timeout=10,
        check=True,
    )
    return json.loads(result.stdout)


class PythonContent(unittest.TestCase):
    runs = 0

    @classmethod
    def setUpClass(cls):
        cls.catalogue = load_catalogue()
        cls.temporary = tempfile.TemporaryDirectory(prefix='entre-trilhas-python-content-')
        cls.program = Path(cls.temporary.name) / 'jornada.py'

    @classmethod
    def tearDownClass(cls):
        cls.temporary.cleanup()
        print(f'\nProgramas executados em subprocessos locais: {cls.runs}.')

    def execute(self, code, stdin='', stdout=None, error=None):
        self.program.write_text(code, encoding='utf-8')
        result = subprocess.run(
            [sys.executable, '-I', '-B', str(self.program)],
            cwd=self.temporary.name, input=stdin, capture_output=True,
            text=True, encoding='utf-8', timeout=3,
        )
        type(self).runs += 1
        if error:
            self.assertNotEqual(result.returncode, 0, 'entrada inválida precisa demonstrar a falha documentada')
            self.assertRegex(result.stderr, rf'\b{error}:')
        else:
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual(result.stderr, '')
        if stdout is not None:
            self.assertEqual(result.stdout, stdout)
        return result

    def check_scope(self, phase, code):
        tree = ast.parse(code)
        forbidden = (
            ast.Import, ast.ImportFrom, ast.FunctionDef, ast.AsyncFunctionDef,
            ast.ClassDef, ast.Lambda, ast.For, ast.AsyncFor, ast.While,
            ast.If, ast.IfExp, ast.Try, ast.With, ast.AsyncWith, ast.Match,
            ast.List, ast.Dict, ast.Set, ast.Tuple, ast.ListComp, ast.SetComp,
            ast.DictComp, ast.GeneratorExp, ast.Compare, ast.BoolOp,
            ast.Subscript, ast.Raise, ast.Assert, ast.Delete, ast.AugAssign,
            ast.AnnAssign, ast.NamedExpr, ast.Await, ast.Yield, ast.YieldFrom,
        )
        allowed_calls = {'print'}
        if phase >= 5:
            allowed_calls.add('len')
        if phase >= 6:
            allowed_calls.update({'input', 'int', 'type'})
        for node in ast.walk(tree):
            self.assertNotIsInstance(node, forbidden, f'fase {phase} exige conceito posterior: {type(node).__name__}')
            if isinstance(node, ast.Constant):
                self.assertIsNot(node.value, None, 'None ainda não foi apresentado')
                self.assertNotIsInstance(node.value, bool, 'booleanos são assunto da fase 8')
            if isinstance(node, ast.UnaryOp):
                self.assertGreaterEqual(phase, 4)
                self.assertIsInstance(node.op, (ast.USub, ast.UAdd))
            if isinstance(node, ast.Assign):
                self.assertGreaterEqual(phase, 3, 'variáveis só após a apresentação na fase 3')
                self.assertTrue(all(isinstance(target, ast.Name) for target in node.targets))
            if isinstance(node, ast.JoinedStr):
                self.assertGreaterEqual(phase, 5, 'f-string antes de sua explicação')
            if isinstance(node, ast.BinOp):
                self.assertGreaterEqual(phase, 3 if isinstance(node.op, ast.Add) else 4)
                self.assertIsInstance(node.op, (ast.Add, ast.Sub, ast.Mult, ast.Div, ast.FloorDiv, ast.Mod))
            if isinstance(node, ast.Call):
                if isinstance(node.func, ast.Name):
                    self.assertIn(node.func.id, allowed_calls, f'chamada ainda não ensinada: {node.func.id}')
                elif isinstance(node.func, ast.Attribute):
                    self.assertGreaterEqual(phase, 5)
                    self.assertIn(node.func.attr, {'strip', 'casefold', 'replace'})
                else:
                    self.fail('forma de chamada ainda não ensinada')
                if phase == 1:
                    self.assertFalse(node.keywords, 'sep/end só são apresentados na fase 2')

    def exercise(self, phase, exercise_id):
        return next(exercise for exercise in self.catalogue[str(phase)]['exercises']
                    if exercise['id'] == exercise_id)

    def with_fixture_value(self, code, name, value):
        """Troca só um dado inicial; preserva o algoritmo que está sendo testado."""
        tree = ast.parse(code)
        assignments = [node for node in tree.body if isinstance(node, ast.Assign)
                       and any(isinstance(target, ast.Name) and target.id == name
                               for target in node.targets)
                       and isinstance(node.value, ast.Constant)]
        self.assertEqual(len(assignments), 1, f'dado inicial explícito: {name}')
        assignments[0].value = ast.Constant(value=value)
        return ast.unparse(ast.fix_missing_locations(tree))

    def test_independent_minute_conversion_boundaries(self):
        solution = self.exercise(4, 'p4-b3')['solution']
        # Valores independentes dos exemplos publicados: antes, no e após o limite
        # de uma hora, e um intervalo de estudo maior, sem contar a pausa.
        for minutes, hours, remaining in [(0, 0, 0), (59, 0, 59), (60, 1, 0),
                                          (61, 1, 1), (120, 2, 0), (1440, 24, 0)]:
            with self.subTest(minutes=minutes):
                code = self.with_fixture_value(solution, 'minutos', minutes)
                self.execute(code, stdout=f'Horas: {hours}\nMinutos restantes: {remaining}\n')

    def test_independent_string_cleaning_unicode_and_empty(self):
        solution = self.exercise(5, 'p5-b3')['solution']
        # Straße distingue casefold de lower; espaços no meio são preservados.
        for original, expected in [('  Água  ', 'água'), ('\tStraße\n', 'strasse'),
                                   ('  ', ''), ('', ''), (' Casa Limpa ', 'casa limpa')]:
            with self.subTest(original=original):
                code = self.with_fixture_value(solution, 'nome', original)
                self.execute(code, stdout=expected + '\n')

    def test_independent_integer_input_zero_and_whitespace(self):
        solution = self.exercise(6, 'p6-b2')['solution']
        for supplied, points in [('0\n', 0), (' 12 \n', 24), ('0005\n', 10), ('60\n', 120)]:
            with self.subTest(supplied=supplied):
                self.execute(solution, supplied, f'Minutos: Pontos: {points}\n')

    def test_independent_integer_input_invalid_values(self):
        solution = self.exercise(6, 'p6-b2')['solution']
        # Uma linha vazia (Enter) é diferente de encerrar o fluxo sem entrada.
        # A investigação documenta ValueError sem exigir try/except ainda.
        for supplied in ['\n', 'abc\n', '1.5\n', '   \n']:
            with self.subTest(supplied=supplied):
                self.execute(solution, supplied, 'Minutos: ', 'ValueError')


def example_test(phase_id):
    def run(self):
        example = self.catalogue[str(phase_id)]['example']
        self.execute(example['code'], example['stdin'], example['stdout'], example.get('error'))
    return run


def solutions_test(phase_id):
    def run(self):
        for exercise in self.catalogue[str(phase_id)]['exercises']:
            for case_index, case in enumerate(exercise['cases']):
                with self.subTest(exercise=exercise['id'], case=case_index):
                    self.execute(exercise['solution'], case['stdin'], case['stdout'], case.get('error'))
    return run


def scope_test(phase_id):
    def run(self):
        phase = self.catalogue[str(phase_id)]
        self.check_scope(phase_id, phase['example']['code'])
        for exercise in phase['exercises']:
            with self.subTest(exercise=exercise['id']):
                self.check_scope(phase_id, exercise['solution'])
    return run


for phase_id in range(1, 8):
    setattr(PythonContent, f'test_phase_{phase_id}_example_output', example_test(phase_id))
    setattr(PythonContent, f'test_phase_{phase_id}_solutions_outputs', solutions_test(phase_id))
    setattr(PythonContent, f'test_phase_{phase_id}_no_future_concepts', scope_test(phase_id))


if __name__ == '__main__':
    unittest.main(verbosity=2)
