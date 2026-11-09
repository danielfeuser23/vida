import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as E from '../engine.js';

const MON='2026-11-09',TUE='2026-11-10',SAT='2026-11-14',SUN='2026-11-15';
const mission=(state,id)=>state.config.missions.find(item=>item.id===id);
const scheduled=(state,id,day)=>E.missionsFor(state,day).find(item=>item.id===id);
const roundtrip=state=>E.parseState(E.serializeState(state));

test('horário personalizado de exercício legado prevalece no sábado',()=>{
 const state=E.createState(MON);
 mission(state,'exercise').time='10:30';
 assert.equal(scheduled(state,'exercise',SAT).time,'10:30');
 assert.equal(scheduled(roundtrip(state),'exercise',SAT).time,'10:30');
});

test('horário personalizado de casa legado prevalece no domingo',()=>{
 const state=E.createState(MON);
 mission(state,'house').time='11:20';
 assert.equal(scheduled(state,'house',SUN).time,'11:20');
 assert.equal(scheduled(roundtrip(state),'house',SUN).time,'11:20');
});

test('legado sem edição preserva 09:00 na folga e não modifica as missões salvas',()=>{
 const state=E.createState(MON),snapshot=structuredClone(state);
 assert.equal(scheduled(state,'exercise',SAT).time,'09:00');
 assert.equal(scheduled(state,'house',SUN).time,'09:00');
 assert.equal(scheduled(state,'exercise',TUE).time,'06:25');
 assert.equal(scheduled(state,'house',MON).time,'06:25');
 assert.deepEqual(state,snapshot);
});

test('preferência explícita de folga prevalece inclusive quando igual ao antigo horário útil',()=>{
 const state=E.createState(MON),exercise=mission(state,'exercise'),house=mission(state,'house');
 exercise.time='06:40';exercise.weekendTime='10:30';
 house.weekendTime='06:25';
 assert.equal(scheduled(state,'exercise',SAT).time,'10:30');
 assert.equal(scheduled(state,'exercise',TUE).time,'06:40');
 assert.equal(scheduled(state,'house',SUN).time,'06:25');
 assert.equal(E.validateState(state),true);
});

test('editor pode consultar o horário de folga sem duplicar a regra do legado',()=>{
 const state=E.createState(MON);
 assert.equal(E.defaultWeekendTime(mission(state,'exercise')),'09:00');
 assert.equal(E.defaultWeekendTime(mission(state,'house')),'09:00');
 assert.equal(E.defaultWeekendTime(mission(state,'read')),'07:05');
 mission(state,'exercise').time='10:30';
 assert.equal(E.defaultWeekendTime(mission(state,'exercise')),'10:30');
 mission(state,'exercise').weekendTime='06:25';
 assert.equal(E.defaultWeekendTime(mission(state,'exercise')),'06:25');
});

test('reagendamento pontual continua prevalecendo sobre preferência de folga',()=>{
 const state=E.createState(MON);
 mission(state,'exercise').weekendTime='10:30';
 E.reschedule(state,'exercise',SAT,SAT,'14:15');
 assert.equal(scheduled(state,'exercise',SAT).time,'14:15');
 assert.equal(scheduled(roundtrip(state),'exercise',SAT).time,'14:15');
});

test('preferência opcional de folga é preservada por backup v1 e reabertura',()=>{
 const state=E.createState(MON);
 mission(state,'exercise').weekendTime='10:30';
 mission(state,'house').weekendTime='11:20';
 const reopened=roundtrip(state);
 assert.equal(reopened.version,1);
 assert.deepEqual(reopened,state);
 assert.equal(scheduled(reopened,'exercise',SAT).time,'10:30');
 assert.equal(scheduled(reopened,'house',SUN).time,'11:20');
});

test('preferência de folga inválida é recusada antes de serializar ou restaurar',()=>{
 for(const invalid of ['24:00','10:60','9:00','10:30:00','',null,undefined,900,{},[]]){
  const state=E.createState(MON);mission(state,'exercise').weekendTime=invalid;
  assert.throws(()=>E.validateState(state),/Backup inválido/);
  assert.throws(()=>E.serializeState(state),/Backup inválido/);
  if(invalid!==undefined)assert.throws(()=>E.parseState(JSON.stringify(state)),/Backup inválido/);
 }
});

test('fixture v1 anterior continua idêntica após validar, serializar e reabrir',()=>{
 const raw=readFileSync(new URL('./fixtures/legacy-v1.json',import.meta.url),'utf8');
 const state=E.parseState(raw);
 assert.equal(state.version,1);
 assert.ok(state.config.missions.every(item=>!Object.hasOwn(item,'weekendTime')));
 assert.deepEqual(roundtrip(state),JSON.parse(raw));
});

test('XP líquido do dia inclui correção e não infla ao repetir concluir e desfazer',()=>{
 const state=E.createState(MON);
 for(let i=0;i<3;i++){
  assert.equal(E.complete(state,'read',MON),true);
  assert.equal(E.dailyXp(state,MON),10);
  assert.equal(E.undo(state,MON+':read',MON),true);
  assert.equal(E.dailyXp(state,MON),0);
 }
 assert.deepEqual(E.totals(state),{xp:0,coins:0});
 assert.equal(E.validateState(state),true);
});

test('correção antiga lança débito hoje sem reescrever ganho histórico',()=>{
 const state=E.createState(MON);
 E.complete(state,'read',MON);
 assert.equal(E.undo(state,MON+':read',TUE),true);
 const snapshot=structuredClone(state);
 assert.equal(E.dailyXp(state,MON),10);
 assert.equal(E.dailyXp(state,TUE),-10);
 assert.equal(E.dailyXp(state,SAT),0);
 assert.equal(state.events.at(-1).originalDay,MON);
 assert.deepEqual(E.totals(state),{xp:0,coins:0});
 assert.deepEqual(state,snapshot);
 assert.deepEqual(roundtrip(state),snapshot);
});

test('XP líquido soma apenas a diferença mínima para normal e ignora cliques repetidos',()=>{
 const state=E.createState(MON);
 E.complete(state,'read',MON,'minimum');
 assert.equal(E.dailyXp(state,MON),5);
 assert.equal(E.complete(state,'read',MON,'minimum'),false);
 E.complete(state,'read',MON,'normal');
 assert.equal(E.dailyXp(state,MON),10);
 assert.equal(E.complete(state,'read',MON,'normal'),false);
 assert.equal(E.complete(state,'read',MON,'minimum'),false);
 assert.equal(E.dailyXp(state,MON),10);
 assert.equal(state.events.length,2);
 assert.equal(E.validateState(state),true);
});

test('compras e estornos não afetam o XP líquido nem são contados duas vezes',()=>{
 const state=E.createState(MON);
 state.config.rewards.find(item=>item.id==='video').price=5;
 E.complete(state,'read',MON);
 assert.equal(E.buy(state,'video',MON,'21:30','pedido-r0c'),true);
 assert.equal(E.buy(state,'video',MON,'21:30','pedido-r0c'),false);
 assert.equal(E.dailyXp(state,MON),10);
 const purchase=state.purchases[0];
 assert.equal(E.cancel(state,purchase.id,TUE),true);
 assert.equal(E.cancel(state,purchase.id,TUE),false);
 assert.equal(E.dailyXp(state,MON),10);
 assert.equal(E.dailyXp(state,TUE),0);
 assert.deepEqual(E.totals(state),{xp:10,coins:5});
 assert.equal(E.validateState(state),true);
});

test('preferência de folga não reduz cuidados essenciais nem duplica recompensas mínimas',()=>{
 const state=E.createState(MON),dog=mission(state,'dog-am');
 dog.weekendTime='06:00';
 const planned=scheduled(state,'dog-am',SAT);
 assert.equal(planned.time,'06:00');
 assert.equal(planned.essential,true);
 assert.equal(planned.minMinutes,15);
 assert.equal(E.complete(state,'dog-am',SAT,'minimum'),true);
 assert.equal(E.complete(state,'dog-am',SAT,'normal'),true);
 assert.equal(E.dailyXp(state,SAT),10);
 assert.deepEqual(E.totals(state),{xp:10,coins:4});
 assert.equal(E.validateState(state),true);
});
