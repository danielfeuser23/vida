import {createState, parseState, serializeState} from './engine.js';

export const STORAGE_KEY = 'entre-trilhas-v1';
export const RECOVERY_KEY = 'entre-trilhas-v1-recovery';

function storageError(error) {
  if (error?.name === 'QuotaExceededError') {
    return new Error('Não foi possível salvar: o armazenamento está sem espaço. Exporte seus dados antes de liberar espaço ou tentar novamente.');
  }
  if (error?.name === 'SecurityError') {
    return new Error('O navegador bloqueou o armazenamento. Permita o acesso aos dados locais antes de salvar ou restaurar.');
  }
  return error instanceof Error ? error : new Error('Não foi possível acessar o armazenamento.');
}
function read(storage, key) {
  try { return storage.getItem(key); }
  catch (error) { throw storageError(error); }
}
function write(storage, key, raw) {
  try {
    if (raw === null) storage.removeItem(key);
    else storage.setItem(key, raw);
    if (storage.getItem(key) !== raw) {
      throw new Error('Não foi possível confirmar a gravação. Verifique o armazenamento antes de continuar.');
    }
  } catch (error) { throw storageError(error); }
}
function assertCurrent(actual, expected) {
  if (expected !== undefined && actual !== expected) {
    throw new Error('O progresso mudou desde a prévia, possivelmente em outra aba. Confira os dados e selecione o backup novamente.');
  }
}
function recoveryEnvelope(raw) {
  return {version: 1, at: new Date().toISOString(), raw};
}
const rawValue = value => value === null || typeof value === 'string';
const object = value => value && !Array.isArray(value) && typeof value === 'object';

function decodeRecovery(stored) {
  try {
    const copy = JSON.parse(stored);
    if (!object(copy) || copy.version !== 1 || typeof copy.at !== 'string' ||
        !Number.isFinite(Date.parse(copy.at)) || !rawValue(copy.raw)) throw new Error();
    if (Object.hasOwn(copy, 'pending')) {
      if (!object(copy.pending) ||
          !Object.hasOwn(copy.pending, 'targetRaw') || !rawValue(copy.pending.targetRaw) ||
          !Object.hasOwn(copy.pending, 'previousRecoveryRaw') ||
          !rawValue(copy.pending.previousRecoveryRaw)) throw new Error();
    }
    return copy;
  } catch {
    throw new Error('A cópia anterior está ilegível. Ela foi preservada; exporte seus dados atuais antes de continuar.');
  }
}
function selectedRecoveryRaw(copy, currentRaw) {
  const plain = JSON.stringify({version: copy.version, at: copy.at, raw: copy.raw});
  if (!copy.pending) return plain;
  if (currentRaw === copy.pending.targetRaw) return plain;
  if (currentRaw === copy.raw) return copy.pending.previousRecoveryRaw ?? plain;
  throw new Error('Uma substituição foi interrompida e os dados mudaram depois. As cópias foram preservadas; exporte o arquivo de recuperação para análise.');
}
// Checkpoints preserve both old snapshots before either primary replacement.
// No future primary write can change the meaning of an unfinished checkpoint.
function settleRecovery(storage) {
  const stored = read(storage, RECOVERY_KEY);
  if (stored === null) return;
  let copy;
  try { copy = decodeRecovery(stored); }
  catch { return; } // Damaged metadata stays intact; valid primary data remains usable.
  if (copy.pending) {
    write(storage, RECOVERY_KEY, selectedRecoveryRaw(copy, readStoredRaw(storage)));
  }
}
function replaceStored(storage, targetRaw, expectedRaw) {
  const previous = readStoredRaw(storage);
  assertCurrent(previous, expectedRaw);
  // An identical restore needs no write and must not replace a distinct older
  // recovery copy. It also avoids an ambiguous checkpoint (old === target).
  if (targetRaw === previous) return;
  settleRecovery(storage);
  assertCurrent(readStoredRaw(storage), previous);
  const checkpoint = recoveryEnvelope(previous);
  checkpoint.pending = {targetRaw, previousRecoveryRaw: read(storage, RECOVERY_KEY)};
  write(storage, RECOVERY_KEY, JSON.stringify(checkpoint));
  try {
    write(storage, STORAGE_KEY, targetRaw);
  } catch (error) {
    // Failed cleanup leaves the full persisted checkpoint, never a lost target.
    try { settleRecovery(storage); } catch {}
    throw error;
  }
  // Compaction is optional: while it fails, subsequent primary writes must wait
  // for settleRecovery. Both snapshots remain readable in the checkpoint.
  try { settleRecovery(storage); } catch {}
}
export function readStoredRaw(storage) {
  return read(storage, STORAGE_KEY);
}
export function saveState(storage, state, expectedRaw) {
  const raw = serializeState(state);
  const previous = readStoredRaw(storage);
  assertCurrent(previous, expectedRaw);
  settleRecovery(storage);
  assertCurrent(readStoredRaw(storage), previous);
  write(storage, STORAGE_KEY, raw);
  return parseState(raw);
}
export function readRecovery(storage) {
  const stored = read(storage, RECOVERY_KEY);
  if (stored === null) return null;
  const copy = decodeRecovery(stored);
  return decodeRecovery(selectedRecoveryRaw(copy, readStoredRaw(storage)));
}
export function restoreBackup(storage, incomingRaw, expectedRaw) {
  const next = parseState(incomingRaw);
  const serialized = serializeState(next);
  replaceStored(storage, serialized, expectedRaw);
  return parseState(serialized);
}
export function recoverBackup(storage, expectedRaw, expectedRecoveryRaw) {
  const previous = readStoredRaw(storage);
  assertCurrent(previous, expectedRaw);
  if (expectedRecoveryRaw !== undefined &&
      read(storage, RECOVERY_KEY) !== expectedRecoveryRaw) {
    throw new Error('A cópia anterior mudou em outra aba. Abra a recuperação novamente.');
  }
  const copy = readRecovery(storage);
  if (!copy) throw new Error('Não há cópia anterior disponível.');
  const next = copy.raw === null ? createState() : parseState(copy.raw);
  serializeState(next);
  replaceStored(storage, copy.raw, previous);
  return next;
}
