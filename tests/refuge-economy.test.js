import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../engine.js';
import {roadmap} from '../roadmap.js';

const MON='2026-11-09';
let sequence=0;
const request=()=>`economia-refugio-${++sequence}`;
const basic={cloak:'clay',skin:'deep',hair:'curly',accessory:'none',decor:['books','lamp','rug'],simplified:false};
function practice(s,day,minutes,exercises=0){
  E.recordStudySession(s,day,{minutes,goal:'Prática registrada para a simulação',kind:'review',lessonId:null,projectId:null,exercises,requestId:request()});
}
function care(s,day){
  for(const mission of E.missionsFor(s,day).filter(m=>m.essential))E.complete(s,mission.id,day,'minimum',roadmap);
}
function valid(s){assert.equal(E.validateState(s),true);assert.deepEqual(E.parseState(E.serializeState(s)),s);}
function assertCosmeticsDoNotPay(s,values=basic){
  const before={totals:E.totals(s),events:structuredClone(s.events),purchases:structuredClone(s.purchases),missions:structuredClone(s.config.missions),rewards:structuredClone(s.config.rewards)};
  E.refugeProgress(s);E.appearanceFor(s);E.updateAppearance(s,values);
  assert.deepEqual(E.totals(s),before.totals);
  assert.deepEqual(s.events,before.events);
  assert.deepEqual(s.purchases,before.purchases);
  assert.deepEqual(s.config.missions,before.missions);
  assert.deepEqual(s.config.rewards,before.rewards);
}

test('economia: dia parcial de50XP/20moedas compra vídeo por15 e preserva5 no saldo',()=>{
  const s=E.createStudyState(MON);
  E.complete(s,'read',MON,'normal',roadmap);
  practice(s,MON,5);
  for(const id of ['dog-am','dog-pm','house'])E.complete(s,id,MON,'normal',roadmap);
  assert.deepEqual(E.totals(s),{xp:50,coins:20});
  assertCosmeticsDoNotPay(s,{...basic,accessory:'leaf'});
  const id=request();
  assert.equal(E.buy(s,'video',MON,'21:30',id),true);
  assert.equal(s.purchases[0].end,'21:50');
  assert.deepEqual(E.totals(s),{xp:50,coins:5});
  const before=structuredClone(s);
  assert.equal(E.buy(s,'video',MON,'21:30',id),false);
  assert.deepEqual(s,before);
  valid(s);
});

test('economia: semana mínima combina5minPython/dia com cuidados essenciais sem exigir perfeição',()=>{
  const s=E.createStudyState(MON);
  for(let i=0;i<7;i++){
    const day=E.addDays(MON,i);
    care(s,day);practice(s,day,5);
    assert.equal(E.studyProgress(s,day).earnedXp,5);
    assert.equal(E.studyProgress(s,day).earnedCoins,2);
    assert.equal(E.studyProgress(s,day).normal,false);
    assert.equal(E.studyProgress(s,day).minutes,5);
  }
  assert.equal(E.studyStats(s).minutes,35);
  // Somente o estudo:35XP/14moedas. Os cuidados essenciais somam420XP/140moedas.
  assert.deepEqual(E.totals(s),{xp:455,coins:154});
  assert.equal(s.lessons.length,0);
  assertCosmeticsDoNotPay(s,{...basic,accessory:'scarf'});
  const windows=E.availableRewardWindows(s,E.addDays(MON,6));
  assert.ok(windows.some(([start,end])=>start==='21:30'&&end==='21:50'));
  valid(s);
});

test('economia: semana intensa respeita120XP/36moedas por dia e prática extra não aumenta teto',()=>{
  const s=E.createStudyState(MON);
  for(let i=0;i<7;i++){
    const day=E.addDays(MON,i);
    practice(s,day,60,2);practice(s,day,60,3);
    assert.equal(E.studyProgress(s,day).earnedXp,120);
    assert.equal(E.studyProgress(s,day).earnedCoins,36);
    const before=E.totals(s);
    practice(s,day,15,1);
    assert.deepEqual(E.totals(s),before);
  }
  assert.deepEqual(E.totals(s),{xp:840,coins:252});
  assert.equal(E.studyStats(s).minutes,945);
  assert.equal(E.studyStats(s).exercises,42);
  assertCosmeticsDoNotPay(s,{...basic,accessory:'scarf'});
  const sunday=E.addDays(MON,6);
  assert.equal(E.buy(s,'movie',sunday,'14:00',request()),true);
  assert.deepEqual(E.totals(s),{xp:840,coins:192});
  assert.equal(s.purchases[0].end,'16:00');
  assert.throws(()=>E.buy(s,'match',sunday,'14:00',request()),/reservad|horário|caber|janela/i);
  assert.throws(()=>E.buy(s,'match',sunday,'21:30',request()),/caber|janela/i);
  valid(s);
});

test('economia: personalização não muda descanso, cuidados, blocosPython nem janelas da loja',()=>{
  const s=E.createStudyState(MON);
  care(s,MON);practice(s,MON,5);
  const days=[MON,E.addDays(MON,5)],before=days.map(day=>E.agendaFor(s,day));
  const windows=days.map(day=>E.availableRewardWindows(s,day));
  assertCosmeticsDoNotPay(s,{...basic,accessory:'leaf',simplified:true});
  assert.deepEqual(days.map(day=>E.agendaFor(s,day)),before);
  assert.deepEqual(days.map(day=>E.availableRewardWindows(s,day)),windows);
  for(const day of days){
    const python=E.agendaFor(s,day).blocks.filter(block=>block.kind==='mission'&&block.missionId==='python');
    assert.equal(python.length,2);
    assert.equal(python.reduce((sum,block)=>sum+block.effortMinutes,0),120);
  }
});
