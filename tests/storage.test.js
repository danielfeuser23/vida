import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../engine.js';
import * as P from '../storage.js';

class MemoryStorage {
  values = new Map();
  writes = [];
  failKey = null;
  onSet = null;
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) {
    this.writes.push(key);
    if (key === this.failKey) throw new DOMException('quota', 'QuotaExceededError');
    this.onSet?.(key, value);
    this.values.set(key, value);
  }
  removeItem(key) {
    if (key === this.failKey) throw new DOMException('quota', 'QuotaExceededError');
    this.values.delete(key);
  }
}
const initial = () => E.createState('2026-11-09');
const incoming = () => {
  const s = initial();
  E.complete(s, 'read', '2026-11-09', 'normal');
  return s;
};
const seed = (storage, state) => storage.setItem(P.STORAGE_KEY, E.serializeState(state));

test('uma gravação aceita reabre com o mesmo estado e não muda o input', () => {
  const store = new MemoryStorage(), state = incoming(), before = structuredClone(state);
  const saved = P.saveState(store, state, null);
  assert.deepEqual(saved, before);
  assert.deepEqual(state, before);
  assert.deepEqual(E.parseState(store.getItem(P.STORAGE_KEY)), before);
});

test('restaurar preserva os bytes originais antes de instalar o backup', () => {
  const store = new MemoryStorage(), original = ' \n' + JSON.stringify(initial(), null, 2);
  store.setItem(P.STORAGE_KEY, original); store.writes = [];
  const backup = incoming();
  const restored = P.restoreBackup(store, JSON.stringify(backup), original);
  assert.deepEqual(store.writes, [P.RECOVERY_KEY, P.STORAGE_KEY, P.RECOVERY_KEY]);
  assert.equal(P.readRecovery(store).raw, original);
  assert.deepEqual(restored, backup);
  assert.deepEqual(E.totals(restored), {xp: 10, coins: 5});
});

test('backup malformado não altera a cópia atual nem a recuperação', () => {
  const store = new MemoryStorage(); seed(store, initial());
  P.restoreBackup(store, E.serializeState(incoming()));
  const before = new Map(store.values);
  for (const raw of ['{', '{"version":1}', JSON.stringify({...initial(), records: []}),
    JSON.stringify({...initial(), overrides: []}), JSON.stringify({...initial(), difficult: []})]) {
    assert.throws(() => P.restoreBackup(store, raw), /inválido|inconsistente/i);
    assert.deepEqual(store.values, before);
  }
});

test('sem espaço para a cópia anterior, restauração aborta sem tocar o principal', () => {
  const store = new MemoryStorage(); seed(store, initial());
  const before = new Map(store.values);
  store.failKey = P.RECOVERY_KEY;
  assert.throws(() => P.restoreBackup(store, E.serializeState(incoming())), /sem espaço/i);
  assert.deepEqual(store.values, before);
});

test('falha ao gravar principal preserva principal e uma cópia recuperável', () => {
  const store = new MemoryStorage(); seed(store, initial());
  const before = store.getItem(P.STORAGE_KEY);
  store.failKey = P.STORAGE_KEY;
  assert.throws(() => P.restoreBackup(store, E.serializeState(incoming())), /sem espaço/i);
  assert.equal(store.getItem(P.STORAGE_KEY), before);
  assert.equal(P.readRecovery(store).raw, before);
});

test('falha em gravação normal mantém progresso anterior', () => {
  const store = new MemoryStorage(); seed(store, initial());
  const before = store.getItem(P.STORAGE_KEY);
  store.failKey = P.STORAGE_KEY;
  assert.throws(() => P.saveState(store, incoming(), before), /sem espaço/i);
  assert.equal(store.getItem(P.STORAGE_KEY), before);
});

test('prévia desatualizada não substitui progresso nem cópia anterior', () => {
  const store = new MemoryStorage(); seed(store, initial());
  const preview = store.getItem(P.STORAGE_KEY);
  seed(store, incoming());
  const before = new Map(store.values);
  assert.throws(() => P.restoreBackup(store, E.serializeState(initial()), preview), /mudou/i);
  assert.deepEqual(store.values, before);
  assert.throws(() => P.saveState(store, initial(), preview), /mudou/i);
  assert.deepEqual(store.values, before);
});

test('recuperação troca as cópias e permite reverter a própria recuperação', () => {
  const store = new MemoryStorage(); seed(store, initial());
  const original = store.getItem(P.STORAGE_KEY);
  P.restoreBackup(store, E.serializeState(incoming()));
  const imported = store.getItem(P.STORAGE_KEY);
  P.recoverBackup(store, imported, store.getItem(P.RECOVERY_KEY));
  assert.equal(store.getItem(P.STORAGE_KEY), original);
  assert.equal(P.readRecovery(store).raw, imported);
  P.recoverBackup(store);
  assert.equal(store.getItem(P.STORAGE_KEY), imported);
});

test('cópia anterior que mudou depois da prévia não é recuperada silenciosamente', () => {
  const store = new MemoryStorage(); seed(store, initial());
  P.restoreBackup(store, E.serializeState(incoming()));
  const preview = store.getItem(P.RECOVERY_KEY);
  store.setItem(P.RECOVERY_KEY, JSON.stringify({version: 1, at: new Date().toISOString(), raw: null}));
  const before = new Map(store.values);
  assert.throws(() => P.recoverBackup(store, store.getItem(P.STORAGE_KEY), preview), /mudou/i);
  assert.deepEqual(store.values, before);
});

test('principal corrompido é preservado para exportação, nunca reintroduzido automaticamente', () => {
  const store = new MemoryStorage(), damaged = '{progresso danificado';
  store.setItem(P.STORAGE_KEY, damaged);
  P.restoreBackup(store, E.serializeState(incoming()), damaged);
  assert.equal(P.readRecovery(store).raw, damaged);
  const before = new Map(store.values);
  assert.throws(() => P.recoverBackup(store), /inválido/i);
  assert.deepEqual(store.values, before);
});

test('restauração em navegador vazio permite voltar à ausência de progresso salvo', () => {
  const store = new MemoryStorage();
  P.restoreBackup(store, E.serializeState(incoming()), null);
  assert.equal(P.readRecovery(store).raw, null);
  const recovered = P.recoverBackup(store);
  assert.equal(store.getItem(P.STORAGE_KEY), null);
  assert.deepEqual(E.totals(recovered), {xp: 0, coins: 0});
  assert.ok(P.readRecovery(store).raw);
});

test('falhar ao recuperar nunca perde o alvo que só existia na cópia anterior', () => {
  const store = new MemoryStorage(); seed(store, initial());
  const target = store.getItem(P.STORAGE_KEY);
  P.restoreBackup(store, E.serializeState(incoming()));
  const current = store.getItem(P.STORAGE_KEY);
  store.failKey = P.STORAGE_KEY;
  assert.throws(() => P.recoverBackup(store), /sem espaço/i);
  assert.equal(store.getItem(P.STORAGE_KEY), current);
  assert.equal(P.readRecovery(store).raw, target);
  store.failKey = null;
  P.recoverBackup(store);
  assert.equal(store.getItem(P.STORAGE_KEY), target);
});

test('nova restauração que falha preserva a recuperação que já existia', () => {
  const store = new MemoryStorage(); seed(store, initial());
  P.restoreBackup(store, E.serializeState(incoming()));
  const before = new Map(store.values), third = incoming();
  third.config.name = 'Terceira cópia';
  store.failKey = P.STORAGE_KEY;
  assert.throws(() => P.restoreBackup(store, E.serializeState(third)), /sem espaço/i);
  assert.deepEqual(store.values, before);
});

test('interrupção da recuperação e falha da limpeza deixam checkpoint recuperável ao reabrir', () => {
  const store = new MemoryStorage(); seed(store, initial());
  const target = store.getItem(P.STORAGE_KEY);
  P.restoreBackup(store, E.serializeState(incoming()));
  const current = store.getItem(P.STORAGE_KEY);
  let recoveryWrites = 0;
  store.onSet = key => {
    if (key === P.STORAGE_KEY || (key === P.RECOVERY_KEY && ++recoveryWrites > 1)) {
      throw new DOMException('quota', 'QuotaExceededError');
    }
  };
  assert.throws(() => P.recoverBackup(store), /sem espaço/i);
  assert.ok(JSON.parse(store.getItem(P.RECOVERY_KEY)).pending);
  assert.equal(store.getItem(P.STORAGE_KEY), current);
  assert.equal(P.readRecovery(store).raw, target);
  // Reading a fresh storage instance simulates reopening with only persisted bytes.
  const reopened = new MemoryStorage(); reopened.values = new Map(store.values);
  assert.equal(P.readRecovery(reopened).raw, target);
  P.recoverBackup(reopened);
  assert.equal(reopened.getItem(P.STORAGE_KEY), target);
});

test('limpeza após commit que falha não deixa outra gravação invalidar o checkpoint', () => {
  const store = new MemoryStorage(); seed(store, initial());
  const original = store.getItem(P.STORAGE_KEY);
  let recoveryWrites = 0;
  store.onSet = key => {
    if (key === P.RECOVERY_KEY && ++recoveryWrites > 1) {
      throw new DOMException('quota', 'QuotaExceededError');
    }
  };
  const restored = P.restoreBackup(store, E.serializeState(incoming()));
  const committed = store.getItem(P.STORAGE_KEY);
  assert.equal(P.readRecovery(store).raw, original);
  restored.config.name = 'Ainda não salva';
  assert.throws(() => P.saveState(store, restored, committed), /sem espaço/i);
  assert.equal(store.getItem(P.STORAGE_KEY), committed);
  store.onSet = null;
  P.saveState(store, restored, committed);
  assert.equal(P.readRecovery(store).raw, original);
  assert.ok(!JSON.parse(store.getItem(P.RECOVERY_KEY)).pending);
});

test('restaurar bytes idênticos é idempotente e preserva uma recuperação distinta', () => {
  const store = new MemoryStorage(); seed(store, initial());
  P.restoreBackup(store, E.serializeState(incoming()));
  const before = new Map(store.values);
  store.writes = [];
  store.failKey = P.STORAGE_KEY;
  const restored = P.restoreBackup(store, store.getItem(P.STORAGE_KEY));
  assert.deepEqual(E.totals(restored), {xp: 10, coins: 5});
  assert.deepEqual(store.values, before);
  assert.deepEqual(store.writes, []);
});
