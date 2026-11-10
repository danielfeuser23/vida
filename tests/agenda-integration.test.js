import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../engine.js';
const MON='2026-11-09',SAT='2026-11-14',SUN='2026-11-15';
const fresh=()=>E.createStudyState(MON);
const mission=(s,id)=>s.config.missions.find(m=>m.id===id);
const clone=structuredClone;

test('agenda integrada: calendário mostra pausa além dos 120 minutos de esforço',()=>{
 const s=fresh(),agenda=E.agendaFor(s,MON);
 const python=agenda.blocks.filter(b=>b.missionId==='python');
 assert.equal(python.length,2);
 assert.deepEqual(python.map(b=>[b.start,b.end]),[['18:00','19:00'],['19:10','20:10']]);
 assert.equal(python.reduce((sum,b)=>sum+b.effortMinutes,0),120);
 assert.equal(agenda.conflicts.length,0);
});
test('agenda integrada: orçamento iniciado preserva duração hoje e edição vale no dia seguinte',()=>{
 const s=fresh();
 E.recordStudySession(s,MON,{minutes:5,goal:'Revisar',kind:'review',lessonId:null,projectId:null,exercises:0,requestId:'calendar-snapshot'});
 mission(s,'python').minutes=60;
 assert.equal(E.agendaFor(s,MON).blocks.filter(b=>b.missionId==='python').reduce((sum,b)=>sum+b.effortMinutes,0),120);
 assert.equal(E.agendaFor(s,E.addDays(MON,1)).blocks.filter(b=>b.missionId==='python').reduce((sum,b)=>sum+b.effortMinutes,0),60);
});
test('agenda integrada: reserva considera o segundo bloco de Python e não só esforço contínuo',()=>{
 const s=fresh();mission(s,'python').time='19:30';
 const reward=s.config.rewards.find(r=>r.id==='video');
 assert.throws(()=>E.reservation(s,reward,MON,'21:30'),/missão|agenda|horário|bloco|janela|conflito/i);
 assert.equal(E.validateState(s),true,'Preferência antiga conflitante continua restaurável.');
});
test('agenda integrada: preferência do segundo passeio é opcional, explícita e sobrevive ao backup',()=>{
 const s=fresh();mission(s,'weekend-walk').secondTime='15:00';
 assert.equal(E.validateState(s),true);
 const reopened=E.parseState(E.serializeState(s));
 assert.equal(mission(reopened,'weekend-walk').secondTime,'15:00');
 const blocks=E.agendaFor(reopened,SAT).blocks.filter(b=>b.missionId==='weekend-walk');
 assert.deepEqual(blocks.map(b=>b.start),['07:20','15:00']);
 assert.equal(blocks.reduce((sum,b)=>sum+b.effortMinutes,0),60);
 assert.throws(()=>E.reservation(reopened,s.config.rewards.find(r=>r.id==='movie'),SAT,'14:00'),/missão|agenda|horário|bloco|janela|conflito/i);
});
test('agenda integrada: segundo horário inválido ou em missão incompatível é recusado',()=>{
 for(const [id,value] of [['weekend-walk','24:00'],['weekend-walk',null],['read','17:00']]){
  const s=fresh();mission(s,id).secondTime=value;
  assert.throws(()=>E.serializeState(s),/inválido|inconsistente/i);
 }
});
test('agenda integrada: prévia semanal usa horários efetivos sem alterar o progresso',()=>{
 const s=fresh(),before=clone(s);
 const preview=E.schedulePreview(s,'house',{time:'21:30',weekendTime:'10:30'},MON);
 assert.equal(preview.days.length,7);
 assert.equal(preview.days.find(d=>d.day===SUN).agenda.blocks.find(b=>b.missionId==='house').start,'10:30');
 assert.deepEqual(s,before);
});
test('agenda integrada: novo conflito explica o motivo antes de substituir preferências',()=>{
 const s=fresh(),next=clone(s);mission(next,'exercise').time='06:40';
 assert.throws(()=>E.checkScheduleChange(s,next,MON),/conflito|sobrep|06:45|banho|prepar/i);
 assert.equal(mission(s,'exercise').time,'06:25');
 assert.equal(E.validateState(next),true,'Conflitos de agenda não invalidam backups históricos.');
});
test('agenda integrada: corrigir outro campo não bloqueia preferência legada já conflitante',()=>{
 const s=fresh();mission(s,'exercise').time='06:40';
 const next=clone(s);mission(next,'exercise').title='Título atualizado';
 assert.doesNotThrow(()=>E.checkScheduleChange(s,next,MON));
});
test('agenda integrada: reagendamento conflitante no v2 falha sem mudar overrides',()=>{
 const s=fresh(),before=clone(s);
 assert.throws(()=>E.reschedule(s,'read',MON,MON,'08:30'),/conflito|trabalho|agenda|sobrep/i);
 assert.deepEqual(s,before);
 assert.equal(E.validateState(s),true);
});
test('agenda integrada: próxima ação respeita trabalho e não oferece estudo no expediente',()=>{
 const s=fresh(),next=E.nextAction(s,MON,E.minutes('14:00'));
 assert.ok(['busy','rest','upcoming'].includes(next.status));
 assert.ok(next.status!=='upcoming'||next.start>='17:00');
 assert.notEqual(next.missionId,'python');
});
test('agenda integrada: disponibilidade explica saldo e respeita o limite antes de comprar',()=>{
 const s=fresh();
 let option=E.rewardOptions(s,'video',MON,E.minutes('15:00'));
 assert.equal(option.allowed,false);
 assert.equal(option.neededCoins,15);
 E.recordStudySession(s,MON,{minutes:120,goal:'Praticar',kind:'review',lessonId:null,projectId:null,exercises:0,requestId:'calendar-funding'});
 option=E.rewardOptions(s,'video',MON,E.minutes('15:00'));
 assert.equal(option.allowed,true);
 assert.ok(option.slots.some(slot=>slot.start==='21:30'&&slot.end==='21:50'));
 E.buy(s,'video',MON,'21:30','calendar-purchase');
 assert.equal(E.rewardOptions(s,'video',MON,E.minutes('15:00')).allowed,false);
});
test('agenda integrada: dias ou horários inválidos não produzem sugestões enganosas',()=>{
 const s=fresh();
 assert.throws(()=>E.agendaFor(s,'2026-02-30'),/data|dia/i);
 assert.throws(()=>E.nextAction(s,MON,-1),/horário|minuto/i);
});
test('agenda integrada: folga sem exercício mantém o banho e a transição de manhã',()=>{
 const s=fresh(),blocks=E.agendaFor(s,SUN).blocks;
 assert.ok(blocks.some(b=>b.kind==='fixed'&&b.role==='hygiene'&&b.start==='09:20'&&b.end==='09:40'));
 assert.equal(E.agendaFor(s,SUN).conflicts.length,0);
});
