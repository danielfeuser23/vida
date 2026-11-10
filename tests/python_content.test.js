import test from 'node:test';
import assert from 'node:assert/strict';
import {roadmap} from '../roadmap.js';
import {pythonContent} from '../python-content.js';
import * as E from '../engine.js';

const text = value => typeof value === 'string' && value.trim().length > 0;
const day = '2026-11-09';

test('o aprofundamento preserva os 120 identificadores e o catálogo legado', () => {
  assert.deepEqual(roadmap.map(phase => phase.id), Array.from({length:120}, (_,i) => i+1));
  assert.equal(roadmap.reduce((sum,phase) => sum + phase.practice.length, 0), 600);
  assert.deepEqual(roadmap.slice(0,7).map(phase => phase.exercises), [5,5,5,5,5,5,5]);
  assert.deepEqual(Object.keys(pythonContent).map(Number), [1,2,3,4,5,6,7]);
});

for (let phaseId=1; phaseId<=7; phaseId++) {
  test(`fase ${phaseId}: material completo, exercícios opcionais e referências`, () => {
    const phase = pythonContent[phaseId];
    assert.ok(text(phase.objective));
    assert.ok(text(phase.criterion));
    for (const field of ['prerequisites','explanation','review','sources']) {
      assert.ok(Array.isArray(phase[field]) && phase[field].length > 0, field);
      assert.ok(phase[field].every(text), field);
    }
    if (phase.preparation !== undefined) assert.ok(Array.isArray(phase.preparation) && phase.preparation.every(text));
    assert.ok(phase.mistakes.length >= 2);
    for (const mistake of phase.mistakes) {
      assert.ok(text(mistake.symptom));
      assert.ok(text(mistake.investigate));
    }
    assert.ok(text(phase.example.code));
    assert.equal(typeof phase.example.stdin, 'string');
    assert.equal(typeof phase.example.stdout, 'string');
    assert.ok(phase.example.stdout.endsWith('\n'), 'saída do exemplo completa');
    for (const source of phase.sources) assert.ok(/^https:\/\//.test(source));
    const basic = phase.exercises.filter(exercise => exercise.kind === 'basic');
    const extra = phase.exercises.filter(exercise => exercise.kind === 'extra');
    assert.ok(basic.length >= 4 && basic.length <= 6, `${basic.length} básicos`);
    assert.ok(extra.length >= 6 && extra.length <= 10, `${extra.length} extras`);
    assert.equal(phase.exercises.length, basic.length + extra.length);
    for (const exercise of phase.exercises) {
      assert.ok(text(exercise.id));
      assert.ok(text(exercise.title));
      assert.ok(text(exercise.prompt));
      assert.ok(exercise.hints.length >= 2, `${exercise.id}: dicas progressivas`);
      assert.ok(exercise.hints.every(text));
      assert.equal(new Set(exercise.hints).size, exercise.hints.length, 'dicas distintas');
      assert.ok(text(exercise.solution));
      assert.match(exercise.solution, /(^|\n)\s*#.+/, `${exercise.id}: solução comentada`);
      assert.ok(exercise.cases.length >= 1);
      for (const example of exercise.cases) {
        assert.equal(typeof example.stdin, 'string', `${exercise.id}: entradas explícitas`);
        assert.equal(typeof example.stdout, 'string', `${exercise.id}: saída explícita`);
        if (example.error !== undefined) assert.equal(example.error, 'ValueError');
      }
    }
  });
}

test('os identificadores dos exercícios são únicos no catálogo aprofundado', () => {
  const ids = Object.values(pythonContent).flatMap(phase => phase.exercises.map(exercise => exercise.id));
  assert.equal(new Set(ids).size, ids.length);
});

test('o catálogo aprofundado não reconta exercícios antigos nem inventa minutos na migração', () => {
  const legacy = E.createState(day);
  E.complete(legacy,'python',day,'normal',roadmap);
  const previous = E.serializeState(legacy);
  const migrated = E.migrateStudyState(legacy);
  assert.equal(E.studyStats(migrated).exercises, 5);
  assert.equal(E.studyStats(migrated).minutes, 0);
  assert.deepEqual(migrated.lessons, legacy.lessons);
  assert.equal(E.serializeState(legacy), previous);
  assert.equal(E.studyStats(E.parseState(E.serializeState(migrated))).exercises, 5);
});

test('o novo número de enunciados não aumenta o autorregistro nem o pagamento de fases', () => {
  const state = E.createStudyState(day);
  E.recordStudySession(state,day,{minutes:60,goal:'Praticar variáveis',kind:'phase',lessonId:1,projectId:null,exercises:3,requestId:'conteudo-sessao'});
  const before = E.totals(state);
  assert.equal(E.completePhase(state,1,day,'conteudo-fase'), true);
  assert.deepEqual(E.totals(state), before);
  assert.equal(E.studyStats(state).exercises, 3);
  assert.equal(E.studyStats(E.parseState(E.serializeState(state))).exercises, 3);
});
