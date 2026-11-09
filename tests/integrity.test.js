import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as E from '../engine.js';
import {roadmap} from '../roadmap.js';

const MON='2026-11-09', TUE='2026-11-10';
const fixture=()=>E.createState(MON);
const clone=structuredClone;
const invalid=s=>assert.throws(()=>E.validateState(s),/Backup inválido/);
const read=s=>E.complete(s,'read',MON,'normal',roadmap);
const purchase=()=>{const s=fixture();E.complete(s,'python',MON,'normal',roadmap);E.buy(s,'video',MON,'21:30','compra-1');return s;};

for(const field of ['records','overrides','difficult']){
  test(`integridade: ${field} não aceita array que perde propriedades no JSON`,()=>{
    const s=fixture();s[field]=[];
    if(field==='records')read(s);
    if(field==='overrides')s[field][`${MON}:read`]={skip:true};
    if(field==='difficult')s[field][MON]=true;
    invalid(s);
  });
}

test('integridade: ganho órfão sem ocorrência é recusado',()=>{
  const s=fixture();s.events.push({id:'orfao',at:new Date().toISOString(),day:MON,type:'mission',title:'Ganho órfão',xp:900,coins:900});invalid(s);
});

test('integridade: snapshots de habilidades correspondem aos eventos da ocorrência',()=>{
  const s=fixture();read(s);s.records[`${MON}:read`].skills={home:10};invalid(s);
});

test('integridade: eventos não podem criar uma ocorrência apenas com upgrade',()=>{
  const s=fixture();read(s);s.events[0].type='upgrade';invalid(s);
});

test('integridade: correção precisa desfazer exatamente a ocorrência ativa',()=>{
  const s=fixture();read(s);E.undo(s,`${MON}:read`,TUE);
  s.events[1].xp=-9;s.events[1].skills={reading:-9};invalid(s);
});

test('integridade: evento com chave desconhecida e histórico de missão duplicado são recusados',()=>{
  const s=fixture();read(s);s.events[0].key=`${MON}:inexistente`;invalid(s);
  const other=fixture();read(other);other.events.push({...clone(other.events[0]),id:'duplicado'});invalid(other);
});

test('integridade: compra e estorno têm tipo, valor, referência e status coerentes',()=>{
  for(const mutate of [
    s=>{s.events.at(-1).xp=1;},
    s=>{s.events.at(-1).type='refund';s.events.at(-1).coins=s.purchases[0].price;},
    s=>{s.events.at(-1).purchaseId='ausente';},
    s=>{s.purchases[0].rewardId='ausente';},
    s=>{s.purchases[0].end='21:20';},
    s=>{s.purchases[0].status='cancelled';},
    s=>{s.events.push({...clone(s.events.at(-1)),id:'compra-duplicada',coins:0});},
  ]){const s=purchase();mutate(s);invalid(s);}
  const s=purchase();E.cancel(s,s.purchases[0].id,TUE);s.events.at(-1).type='purchase';invalid(s);
});

test('integridade: requestId de compra é único mesmo após cancelamento',()=>{
  const s=purchase();E.cancel(s,s.purchases[0].id,MON);E.buy(s,'video',MON,'21:30','compra-2');s.purchases[1].requestId='compra-1';invalid(s);
});

test('integridade: fase precisa de vínculo bidirecional com registro Python normal',()=>{
  const s=fixture();E.complete(s,'python',MON,'normal',roadmap);s.lessons=[];invalid(s);
  const other=fixture();read(other);other.records[`${MON}:read`].lesson=1;invalid(other);
});

test('integridade: mapas, objetos e arrays precisam preservar seu conteúdo em JSON',()=>{
  for(const mutate of [
    s=>{s.records=new Date();},
    s=>{s.overrides=Object.create({oculto:true});},
    s=>{s.config.name=undefined;},
    s=>{s.config.sounds=NaN;},
    s=>{s.config.missions.extra='não serializa';},
    s=>{s.difficult.toJSON=()=>({});},
    s=>{Object.defineProperty(s.records,'invisivel',{value:1});},
    s=>{s.records[Symbol('oculto')]=1;},
    s=>{s.extra={surpresa:true};},
  ]){const s=fixture();mutate(s);invalid(s);}
});

test('integridade: descritores com getter são recusados sem executar código de acesso',()=>{
  const s=fixture();let accesses=0;
  Object.defineProperty(s.config.missions,'0',{get(){accesses++;return {};},enumerable:true,configurable:true});
  invalid(s);assert.equal(accesses,0);
});

test('integridade: overrides e configurações rejeitam formas impossíveis',()=>{
  for(const mutate of [
    s=>{s.overrides[`${MON}:read`]=null;},
    s=>{s.overrides[`${MON}:read`]={skip:'sim'};},
    s=>{s.overrides[`${MON}:inexistente`]={include:true};},
    s=>{s.overrides[`${MON}:read`]={include:true,qualquer:1};},
    s=>{s.config.missions[0].essential='sim';},
    s=>{s.config.rewards[0].weekend='sim';},
    s=>{s.config.missions[0].id='__proto__';},
    s=>{s.config.missions=s.config.missions.filter(m=>m.id!=='python');},
  ]){const s=fixture();mutate(s);invalid(s);}
});

test('integridade: IDs interpolados na interface não aceitam marcação HTML',()=>{
  const s=purchase(),id='compra" onclick="alert(1)';s.purchases[0].id=id;s.events.at(-1).purchaseId=id;invalid(s);
});

test('compatibilidade: backup v1 real anterior mantém snapshots, zeros e correções retroativas',()=>{
  const s=JSON.parse(readFileSync(new URL('./fixtures/legacy-v1.json',import.meta.url),'utf8'));
  assert.equal(E.validateState(s),true);
  assert.ok(s.events.some(e=>Object.values(e.skills||{}).some(v=>v<0)&&e.type==='upgrade'));
  assert.equal(s.records[`${TUE}:dog-am`].xp,0);
  assert.equal(E.validateState(JSON.parse(JSON.stringify(s))),true);
});

test('integridade: históricos zerados preservam conclusão, correção e nova conclusão',()=>{
  const s=fixture(),m=s.config.missions.find(m=>m.id==='read');m.xp=0;m.coins=0;m.minXp=0;m.minCoins=0;
  E.complete(s,'read',MON,'minimum',roadmap);E.complete(s,'read',MON,'normal',roadmap);E.undo(s,`${MON}:read`,TUE);read(s);
  assert.equal(E.validateState(s),true);assert.deepEqual(E.totals(s),{xp:0,coins:0});
});

test('serialização: backup aceito é estável ao salvar, analisar e reabrir sem mutar a origem',()=>{
  const s=JSON.parse(readFileSync(new URL('./fixtures/legacy-v1.json',import.meta.url),'utf8')),before=clone(s);
  const raw=E.serializeState(s),reopened=E.parseState(raw);
  assert.deepEqual(reopened,s);assert.deepEqual(s,before);
  assert.equal(E.serializeState(reopened),raw);
  assert.equal(E.validateState(reopened),true);
});

test('serialização: JSON malformado e estados inconsistentes falham antes de salvar',()=>{
  for(const raw of ['', '{', 'null', '[]', '{"version":1}', JSON.stringify({...fixture(),records:[]})])assert.throws(()=>E.parseState(raw),/Backup inválido/);
  const s=fixture();s.records=[];assert.throws(()=>E.serializeState(s),/Backup inválido/);
});

test('serialização: sequência real com edição, compra, uso, estorno e correções valida a cada operação',()=>{
  let s=fixture();
  const mutate=fn=>{fn(s);assert.equal(E.validateState(s),true);const raw=E.serializeState(s);assert.deepEqual(E.parseState(raw),s);s=E.parseState(raw);};
  mutate(s=>E.complete(s,'read',MON,'minimum',roadmap));
  mutate(s=>{const m=s.config.missions.find(m=>m.id==='read');m.skill='home';m.title='Nova leitura';m.xp=20;m.coins=15;});
  mutate(s=>read(s));
  mutate(s=>E.complete(s,'python',MON,'normal',roadmap));
  mutate(s=>E.buy(s,'video',MON,'21:30','primeira'));
  mutate(s=>E.cancel(s,s.purchases[0].id,TUE));
  mutate(s=>E.buy(s,'video',MON,'21:30','segunda'));
  mutate(s=>E.usePurchase(s,s.purchases[1].id));
  mutate(s=>E.undo(s,`${MON}:read`,TUE));
  mutate(s=>read(s));
  mutate(s=>E.undo(s,`${MON}:python`,TUE));
  mutate(s=>E.complete(s,'python',MON,'normal',roadmap));
  mutate(s=>E.complete(s,'python',TUE,'normal',roadmap));
});
