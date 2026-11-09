import test from 'node:test';
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {createId} from '../ids.js';
import * as E from '../engine.js';
import {roadmap} from '../roadmap.js';

const MON='2026-11-09';
const clone=value=>structuredClone(value);
const uuidV4=/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const friendlyIdError=/identificadores|criptograf|navegador|contexto seguro/i;

// Apenas estados fictícios: não há acesso ao armazenamento ou perfil do usuário.
// As alterações de crypto são síncronas e restauradas, inclusive se a asserção falhar.
function withCrypto(provider,run) {
  const previous=Object.getOwnPropertyDescriptor(globalThis,'crypto');
  Object.defineProperty(globalThis,'crypto',{configurable:true,value:provider});
  try {return run();}
  finally {
    if(previous)Object.defineProperty(globalThis,'crypto',previous);
    else delete globalThis.crypto;
  }
}
function funded() {
  const s=E.createState(MON);
  withCrypto(webcrypto,()=>E.complete(s,'python',MON,'normal',roadmap));
  return s;
}
function reserved() {
  const s=funded();
  withCrypto(webcrypto,()=>E.buy(s,'video',MON,'21:30','pedido-seguro'));
  return s;
}
function unchangedOnFailure(s,run) {
  const previous=clone(s);
  assert.throws(run);
  assert.deepEqual(s,previous,'Uma falha na criação do ID deve preservar o estado inteiro.');
  assert.equal(E.validateState(s),true);
}

test('IDs: prefere randomUUID nativo e preserva o receptor, sem chamar fallback',()=>{
  const expected='d0f36f1a-42d7-40f8-9b07-3002e031f40e';let calls=0;
  const provider={
    randomUUID(){assert.equal(this,provider);calls++;return expected;},
    getRandomValues(){assert.fail('randomUUID disponível não precisa de fallback.');}
  };
  assert.equal(createId(provider),expected);
  assert.equal(calls,1);
});

test('IDs: fallback usa 16 bytes e RFC 4122 v4 com vetor conhecido',()=>{
  let calls=0;
  const provider={getRandomValues(values){
    assert.equal(this,provider);
    assert.ok(values instanceof Uint8Array);
    assert.equal(values.length,16);
    values.set(Array.from({length:16},(_,i)=>i));
    calls++;
    return values;
  }};
  assert.equal(createId(provider),'00010203-0405-4607-8809-0a0b0c0d0e0f');
  assert.equal(calls,1);
});

test('IDs: fallback ajusta bits de versão e variante, preservando os demais bytes',()=>{
  const zero={getRandomValues:values=>{values.fill(0);return values;}};
  const ones={getRandomValues:values=>{values.fill(255);return values;}};
  assert.equal(createId(zero),'00000000-0000-4000-8000-000000000000');
  assert.equal(createId(ones),'ffffffff-ffff-4fff-bfff-ffffffffffff');
});

test('IDs: provider padrão é o crypto disponível no momento da chamada',()=>{
  const expected='2ab5cfc6-2d46-4a69-960d-a28509d01fa8';
  withCrypto({randomUUID:()=>expected},()=>assert.equal(createId(),expected));
});

test('IDs: ausência de API criptográfica gera erro compreensível',()=>{
  for(const provider of [null,{},0,{randomUUID:null},{randomUUID:'indisponível',getRandomValues:false}]) {
    assert.throws(()=>createId(provider),friendlyIdError);
  }
  withCrypto(undefined,()=>assert.throws(()=>createId(),friendlyIdError));
});

test('IDs: erro do randomUUID não usa fallback nem retorna identificador fraco',()=>{
  let fallbackCalls=0;
  const provider={
    randomUUID(){throw Error('Falha simulada nativa');},
    getRandomValues(){fallbackCalls++;throw Error('Fallback não deve ser chamado.');}
  };
  assert.throws(()=>createId(provider),friendlyIdError);
  assert.equal(fallbackCalls,0);
});

test('IDs: resposta nativa inválida falha antes de introduzir IDs incompatíveis no histórico',()=>{
  for(const id of [undefined,'',17,'uuid-inválido','00000000-0000-1000-8000-000000000000']) {
    assert.throws(()=>createId({
      randomUUID:()=>id,
      getRandomValues(){assert.fail('Não encobrir resposta nativa inválida.');}
    }),friendlyIdError);
  }
});

test('IDs: falha de getRandomValues é apresentada sem criar identificador',()=>{
  assert.throws(()=>createId({getRandomValues(){throw Error('Falha simulada do CSPRNG');}}),friendlyIdError);
});

test('IDs: não consulta Math.random nem horário para gerar um identificador',()=>{
  const oldRandom=Math.random,oldNow=Date.now;
  Math.random=()=>assert.fail('Não usar Math.random na geração de IDs.');
  Date.now=()=>assert.fail('Não usar horário na geração de IDs.');
  try {
    const provider={getRandomValues:values=>{values.fill(91);return values;}};
    assert.match(createId(provider),uuidV4);
    assert.throws(()=>createId({}),friendlyIdError);
  } finally {Math.random=oldRandom;Date.now=oldNow;}
});

test('IDs: amostra de 1.024 IDs criptográficos tem formato v4 e nenhuma colisão',()=>{
  // Verificação de integração do RNG real, não prova matemática de unicidade.
  const provider={getRandomValues:values=>webcrypto.getRandomValues(values)};
  const ids=Array.from({length:1024},()=>createId(provider));
  assert.ok(ids.every(id=>uuidV4.test(id)));
  assert.equal(new Set(ids).size,ids.length);
});

test('R0b: sem randomUUID, missões, upgrade, compra, cancelamento e correção preservam a contabilidade',()=>{
  const provider={getRandomValues:values=>webcrypto.getRandomValues(values)};
  withCrypto(provider,()=>{
    const s=E.createState(MON);
    const python=s.config.missions.find(m=>m.id==='python');
    assert.equal(E.complete(s,'python',MON,'minimum',roadmap),true);
    assert.deepEqual(E.totals(s),{xp:python.minXp,coins:python.minCoins});
    assert.equal(E.complete(s,'python',MON,'normal',roadmap),true);
    assert.deepEqual(E.totals(s),{xp:python.xp,coins:python.coins});
    assert.equal(s.lessons.length,1);
    const afterNormal=clone(s);
    assert.equal(E.complete(s,'python',MON,'normal',roadmap),false);
    assert.equal(E.complete(s,'python',MON,'minimum',roadmap),false);
    assert.deepEqual(s,afterNormal);
    const price=s.config.rewards.find(r=>r.id==='video').price;
    assert.equal(E.buy(s,'video',MON,'21:30','pedido-http'),true);
    assert.deepEqual(E.totals(s),{xp:python.xp,coins:python.coins-price});
    const afterBuy=clone(s);
    assert.equal(E.buy(s,'video',MON,'21:30','pedido-http'),false);
    assert.deepEqual(s,afterBuy);
    assert.equal(E.cancel(s,s.purchases[0].id,MON),true);
    const afterCancel=clone(s);
    assert.equal(E.cancel(s,s.purchases[0].id,MON),false);
    assert.deepEqual(s,afterCancel);
    assert.deepEqual(E.totals(s),{xp:python.xp,coins:python.coins});
    assert.equal(E.undo(s,MON+':python',MON),true);
    const afterUndo=clone(s);
    assert.equal(E.undo(s,MON+':python',MON),false);
    assert.deepEqual(s,afterUndo);
    assert.deepEqual(E.totals(s),{xp:0,coins:0});
    assert.equal(s.lessons.length,0);
    assert.equal(s.events.filter(e=>e.type==='purchase').length,1);
    assert.equal(s.events.filter(e=>e.type==='refund').length,1);
    assert.equal(new Set(s.events.map(e=>e.id)).size,s.events.length);
    assert.equal(E.validateState(s),true);
    assert.deepEqual(E.parseState(E.serializeState(s)),s);
  });
});

test('R0b: falha ao gerar ID não conclui fase Python parcialmente',()=>{
  const s=E.createState(MON);
  withCrypto({},()=>unchangedOnFailure(s,()=>E.complete(s,'python',MON,'normal',roadmap)));
});

test('R0b: falha ao gerar ID não remove fase ao corrigir uma missão',()=>{
  const s=funded();
  withCrypto({},()=>unchangedOnFailure(s,()=>E.undo(s,MON+':python',MON)));
});

test('R0b: ausência de gerador não abre compra nem desconta moedas',()=>{
  const s=funded();
  withCrypto({},()=>unchangedOnFailure(s,()=>E.buy(s,'video',MON,'21:30','pedido-sem-api')));
});

test('R0b: falha no segundo ID da compra preserva compra, eventos e saldo',()=>{
  const s=funded();let calls=0;
  withCrypto({randomUUID(){if(++calls===2)throw Error('Falha simulada do gerador');return '00000000-0000-4000-8000-000000000001';}},()=>{
    unchangedOnFailure(s,()=>E.buy(s,'video',MON,'21:30','pedido-segundo-id'));
    assert.equal(calls,2);
  });
});

test('R0b: falha ao gerar ID não cancela compra sem estorno',()=>{
  const s=reserved();
  withCrypto({},()=>unchangedOnFailure(s,()=>E.cancel(s,s.purchases[0].id,MON)));
});

test('R0b: repetições já registradas não dependem de novos IDs',()=>{
  const s=reserved(),before=clone(s);
  withCrypto({},()=>{
    assert.equal(E.complete(s,'python',MON,'normal',roadmap),false);
    assert.equal(E.buy(s,'video',MON,'21:30','pedido-seguro'),false);
  });
  assert.deepEqual(s,before);
  assert.equal(E.validateState(s),true);
});
