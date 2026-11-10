import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultMissions} from '../data.js';

let A={};
try {A=await import('../agenda.js');}
catch(error){if(error.code!=='ERR_MODULE_NOT_FOUND')throw error;}
const MON='2026-11-09',TUE='2026-11-10',SAT='2026-11-14',SUN='2026-11-15';
const minute=clock=>Number(clock.slice(0,2))*60+Number(clock.slice(3));
const fixture=()=>({config:{paused:false},difficult:{},purchases:[]});
const weekend=day=>[0,6].includes(new Date(day+'T12:00:00Z').getUTCDay());
function resolved(day) {
  const weekday=new Date(day+'T12:00:00Z').getUTCDay();
  return structuredClone(defaultMissions.filter(m=>m.days.includes(weekday)))
    .map(m=>({...m,time:weekend(day)&&['exercise','house'].includes(m.id)?'09:00':m.time}));
}
function api(name){assert.equal(typeof A[name],'function',`${name} deve existir no modelo único de agenda.`);return A[name];}
const build=(s,day,missions=resolved(day))=>api('buildAgenda')(s,day,missions);
const extras=(s,day,missions=resolved(day),now=0)=>api('availableExtra')(s,day,missions,now);
const next=(s,day,now,statuses={},missions=resolved(day))=>api('nextAgendaAction')(s,day,missions,now,statuses);
const missionBlocks=(agenda,id)=>agenda.blocks.filter(b=>b.kind==='mission'&&b.missionId===id);
const done=(day,except=[])=>Object.fromEntries(resolved(day).filter(m=>!except.includes(m.id)).map(m=>[m.id,'normal']));
function purchase(day,start,end,status='reserved',id='purchase-one') {
  return {id,day,start,end,status,title:'Extra de teste'};
}

test('agenda: dia útil padrão cobre 05:30–22:30 em ordem, sem sobreposição nem mutação',()=>{
  const s=fixture(),missions=resolved(MON),before=structuredClone({s,missions}),agenda=build(s,MON,missions);
  assert.equal(agenda.day,MON);
  assert.deepEqual(agenda.conflicts,[]);
  assert.equal(agenda.blocks[0].start,'05:30');
  assert.equal(agenda.blocks.at(-1).end,'22:30');
  for(let i=1;i<agenda.blocks.length;i++)assert.equal(agenda.blocks[i-1].endMinute,agenda.blocks[i].startMinute);
  assert.equal(agenda.blocks.reduce((sum,b)=>sum+b.endMinute-b.startMinute,0),17*60);
  assert.deepEqual({s,missions},before);
});

test('agenda: trabalho, almoço, lazer básico e desaceleração ficam protegidos',()=>{
  const agenda=build(fixture(),TUE);
  const fixed=agenda.blocks.filter(b=>b.kind==='fixed');
  for(const [start,end] of [['08:00','12:00'],['12:00','13:00'],['13:00','17:00'],['20:10','20:50'],['21:00','21:30'],['22:00','22:30']]){
    assert.ok(fixed.some(b=>b.start===start&&b.end===end),`${start}–${end}`);
  }
  assert.ok(fixed.every(b=>b.effortMinutes===0));
  assert.equal(missionBlocks(agenda,'walk-am')[0].start,'07:20');
  assert.equal(missionBlocks(agenda,'walk-pm')[0].start,'17:00');
});

test('agenda: sábado tem dois passeios e banho após exercício, sem colidir com café',()=>{
  const agenda=build(fixture(),SAT),walk=missionBlocks(agenda,'weekend-walk');
  assert.deepEqual(agenda.conflicts,[]);
  assert.deepEqual(walk.map(b=>[b.start,b.end,b.effortMinutes]),[['07:20','07:50',30],['17:00','17:30',30]]);
  assert.ok(walk.every(b=>b.essential&&b.parts===2));
  assert.ok(agenda.blocks.some(b=>b.kind==='fixed'&&b.start==='09:20'&&b.end==='09:40'&&/banho|higiene/i.test(b.title)));
  assert.ok(agenda.blocks.some(b=>b.kind==='fixed'&&b.start==='06:00'&&b.end==='06:30'));
});

test('agenda: domingo permite casa às10:30 dentro da parte flexível da manhã',()=>{
  const ms=resolved(SUN);ms.find(m=>m.id==='house').time='10:30';
  const agenda=build(fixture(),SUN,ms);
  assert.deepEqual(agenda.conflicts,[]);
  assert.equal(missionBlocks(agenda,'house')[0].start,'10:30');
  assert.ok(agenda.blocks.some(b=>b.kind==='free'&&b.startMinute<=minute('09:40')&&b.endMinute>=minute('10:30')));
});

test('agenda: Python ocupa duas metades e pausa sem pontuar os dez minutos',()=>{
  const agenda=build(fixture(),MON),python=missionBlocks(agenda,'python');
  assert.deepEqual(python.map(b=>[b.start,b.end,b.effortMinutes,b.part]),[['18:00','19:00',60,1],['19:10','20:10',60,2]]);
  const pause=agenda.blocks.find(b=>b.kind==='break'&&b.parentMissionId==='python');
  assert.deepEqual([pause.start,pause.end,pause.effortMinutes],['19:00','19:10',0]);
  assert.equal(pause.missionId,null);
  assert.equal(python.reduce((n,b)=>n+b.effortMinutes,0),120);
});

test('agenda: meta editada de Python altera as duas partes e conserva pausa adicional',()=>{
  const ms=resolved(MON);ms.find(m=>m.id==='python').minutes=90;
  const agenda=build(fixture(),MON,ms);
  assert.deepEqual(missionBlocks(agenda,'python').map(b=>[b.start,b.end,b.effortMinutes]),[['18:00','18:45',45],['18:55','19:40',45]]);
  assert.ok(agenda.blocks.some(b=>b.kind==='free'&&b.start==='19:40'&&b.end==='20:10'));
  assert.deepEqual(agenda.conflicts,[]);
});

test('agenda: esforço ímpar não perde minuto ao dividir sessões ou passeios',()=>{
  const ms=resolved(SAT);ms.find(m=>m.id==='python').minutes=121;ms.find(m=>m.id==='weekend-walk').minutes=61;
  const agenda=build(fixture(),SAT,ms);
  assert.deepEqual(missionBlocks(agenda,'python').map(b=>b.effortMinutes),[61,60]);
  assert.deepEqual(missionBlocks(agenda,'weekend-walk').map(b=>b.effortMinutes),[31,30]);
});

test('agenda: metas de 1,5 e121 minutos não inventam esforço e o horário além da meia-noite é explícito',()=>{
  for(const goal of [1,5,121]){
    const ms=resolved(MON);ms.find(m=>m.id==='python').minutes=goal;
    const agenda=build(fixture(),MON,ms),python=missionBlocks(agenda,'python');
    assert.equal(python.reduce((sum,b)=>sum+b.effortMinutes,0),goal);
    assert.ok(python.every(b=>b.effortMinutes>0&&b.endMinute>b.startMinute));
    assert.equal(python.length,goal===1?1:2);
    assert.equal(agenda.blocks.filter(b=>b.kind==='break'&&b.parentMissionId==='python').length,goal===1?0:1);
  }
  const ms=resolved(MON),m=ms.find(m=>m.id==='python');m.minutes=121;m.time='23:30';
  const last=missionBlocks(build(fixture(),MON,ms),'python').at(-1);
  assert.equal(last.end,'01:41');
  assert.equal(last.endDayOffset,1);
  assert.equal(last.endMinute,1440+101);
});

test('agenda: segundo passeio editado é respeitado e conflitos aparecem sem alterar o estado',()=>{
  const s=fixture(),ms=resolved(SAT);ms.find(m=>m.id==='weekend-walk').secondTime='16:30';
  const before=structuredClone({s,ms}),agenda=build(s,SAT,ms);
  assert.equal(missionBlocks(agenda,'weekend-walk')[1].start,'16:30');
  assert.ok(agenda.conflicts.some(c=>c.missionIds.includes('weekend-walk')));
  assert.deepEqual({s,ms},before);
});

test('agenda: essencial usa maior duração configurada e não encolhe em dia difícil',()=>{
  const s=fixture();s.difficult[SAT]=true;
  const ms=resolved(SAT),walk=ms.find(m=>m.id==='weekend-walk');walk.minutes=60;walk.minMinutes=80;
  const agenda=build(s,SAT,ms);
  assert.equal(missionBlocks(agenda,'weekend-walk').reduce((sum,b)=>sum+b.effortMinutes,0),80);
  assert.equal(missionBlocks(agenda,'dog-am')[0].effortMinutes,15);
  assert.equal(missionBlocks(agenda,'python').reduce((sum,b)=>sum+b.effortMinutes,0),120);
});

test('agenda: lista de frequência e exceção já resolvida não recebe missões inventadas',()=>{
  const ms=resolved(MON).filter(m=>!['house','read'].includes(m.id));
  ms.push({...structuredClone(defaultMissions.find(m=>m.id==='exercise')),time:'10:30'});
  const agenda=build(fixture(),MON,ms);
  assert.equal(missionBlocks(agenda,'read').length,0);
  assert.equal(missionBlocks(agenda,'house').length,0);
  assert.equal(missionBlocks(agenda,'exercise')[0].start,'10:30');
  assert.ok(agenda.conflicts.some(c=>c.missionIds.includes('exercise')));
});

test('agenda: preferência resolvida prevalece sem reaplicar horário antigo por ID',()=>{
  const ms=resolved(SAT);ms.find(m=>m.id==='exercise').time='10:30';
  const agenda=build(fixture(),SAT,ms);
  assert.equal(missionBlocks(agenda,'exercise')[0].start,'10:30');
  assert.ok(agenda.blocks.some(b=>b.start==='10:50'&&b.end==='11:10'&&/banho|higiene/i.test(b.title)));
  assert.deepEqual(agenda.conflicts,[]);
});

test('agenda: pausa da jornada preserva toda a rotina e cuidados essenciais',()=>{
  const active=fixture(),paused=fixture();paused.config.paused=true;
  assert.deepEqual(build(paused,SAT),build(active,SAT));
  const action=next(paused,SAT,minute('07:25'));
  assert.equal(action.status,'paused');
  assert.match(action.reason,/essencia|cachorro|cuidado/i);
});

test('agenda: janelas-base são as mesmas para todos os consumidores',()=>{
  assert.deepEqual(api('baseExtraWindows')(MON),[['21:30','21:50']]);
  assert.deepEqual(api('baseExtraWindows')(SAT),[['14:00','16:00'],['21:30','21:50']]);
  assert.deepEqual(build(fixture(),SAT).extraWindows,extras(fixture(),SAT));
});

test('agenda: extra disponível desconta missão que ocupa parte da janela',()=>{
  const ms=resolved(SAT);
  ms.push({...structuredClone(defaultMissions.find(m=>m.id==='house')),time:'14:15'});
  assert.deepEqual(extras(fixture(),SAT,ms),[['14:00','14:15'],['14:30','16:00'],['21:30','21:50']]);
});

test('agenda: reservas e extras usados ocupam tempo, cancelados não ocupam',()=>{
  const s=fixture();s.purchases=[
    purchase(SAT,'14:00','14:20','reserved','reserved'),
    purchase(SAT,'15:00','15:30','used','used'),
    purchase(SAT,'14:30','14:50','cancelled','cancelled'),
    purchase(MON,'21:30','21:50','reserved','another-day')
  ];
  assert.deepEqual(extras(s,SAT),[['14:20','15:00'],['15:30','16:00'],['21:30','21:50']]);
  assert.equal(build(s,SAT).blocks.filter(b=>b.kind==='reward').length,2);
});

test('agenda: somente o tempo restante de hoje pode receber recompensa',()=>{
  assert.deepEqual(extras(fixture(),SAT,resolved(SAT),minute('14:35')),[['14:35','16:00'],['21:30','21:50']]);
  assert.deepEqual(extras(fixture(),MON,resolved(MON),minute('21:45')),[['21:45','21:50']]);
  assert.deepEqual(extras(fixture(),MON,resolved(MON),minute('21:50')),[]);
});

test('agenda: intervalos adjacentes são permitidos e conflitos reais identificam as duas partes',()=>{
  const ms=resolved(SAT),read=ms.find(m=>m.id==='read');read.time='14:15';
  ms.push({...structuredClone(defaultMissions.find(m=>m.id==='house')),time:'14:00'});
  const adjacent=build(fixture(),SAT,ms);
  assert.ok(!adjacent.conflicts.some(c=>c.missionIds.includes('read')&&c.missionIds.includes('house')));
  read.time='14:10';
  const overlap=build(fixture(),SAT,ms).conflicts.find(c=>c.missionIds.includes('read')&&c.missionIds.includes('house'));
  assert.ok(overlap);
  assert.deepEqual([overlap.start,overlap.end],['14:10','14:15']);
  assert.ok(overlap.first.title&&overlap.second.title);
});

test('agenda: horários fora da janela acordada são sinalizados e nunca truncados silenciosamente',()=>{
  const ms=resolved(MON),read=ms.find(m=>m.id==='read'),python=ms.find(m=>m.id==='python');
  read.time='04:55';python.time='23:00';
  const agenda=build(fixture(),MON,ms);
  assert.equal(missionBlocks(agenda,'read')[0].start,'04:55');
  assert.ok(missionBlocks(agenda,'python').at(-1).endMinute>1440);
  assert.ok(agenda.conflicts.some(c=>c.missionIds.includes('read')&&c.second===null));
  assert.ok(agenda.conflicts.some(c=>c.missionIds.includes('python')&&c.second===null));
});

test('agenda: missão conflitante não transforma janela protegida em tempo extra',()=>{
  const ms=resolved(MON);ms.find(m=>m.id==='python').time='20:30';
  const agenda=build(fixture(),MON,ms);
  assert.ok(agenda.conflicts.length>0);
  assert.deepEqual(agenda.extraWindows,[]);
});

test('próxima ação: expediente e trajeto não sugerem estudar nem recuperar tarefa atrasada',()=>{
  const work=next(fixture(),MON,minute('10:00'));
  assert.equal(work.status,'busy');
  assert.equal(work.missionId,null);
  assert.match(work.title,/trabalho/i);
  const commute=next(fixture(),MON,minute('07:25'),done(MON));
  assert.ok(['busy','rest'].includes(commute.status));
  assert.notEqual(commute.missionId,'python');
});

test('próxima ação: primeira hora, pausa e segunda hora de Python são distintas',()=>{
  const s=fixture(),statuses=done(MON,['python']);
  const first=next(s,MON,minute('18:00'),statuses);
  assert.equal(first.status,'available');assert.equal(first.missionId,'python');assert.equal(first.minutes,60);
  const pause=next(s,MON,minute('19:05'),statuses);
  assert.equal(pause.status,'rest');assert.equal(pause.missionId,null);assert.match(pause.title,/pausa/i);
  const second=next(s,MON,minute('19:10'),statuses);
  assert.equal(second.status,'available');assert.equal(second.missionId,'python');assert.equal(second.minutes,60);
  assert.ok(['rest','busy'].includes(next(s,MON,minute('19:10'),done(MON)).status));
});

test('próxima ação: tarefa futura permanece futura em vez de ser puxada para o tempo livre',()=>{
  const action=next(fixture(),SAT,minute('10:00'),done(SAT,['python']));
  assert.equal(action.status,'upcoming');
  assert.equal(action.missionId,'python');
  assert.equal(action.start,'18:00');
});

test('próxima ação: atraso opcional não passa na frente do bloco atual, mínima cabe só em tempo livre',()=>{
  const s=fixture(),statuses=done(MON,['read','python']);
  const current=next(s,MON,minute('18:00'),statuses);
  assert.equal(current.missionId,'python');
  const late=next(s,MON,minute('21:30'),done(MON,['read']));
  assert.equal(late.status,'available');assert.equal(late.missionId,'read');
  assert.equal(late.mode,'minimum');assert.equal(late.minutes,5);
  assert.match(late.reason,/mínima|flexível|passou/i);
  assert.ok(late.endMinute<=minute('21:50'));
});

test('próxima ação: cuidado essencial atrasado pede conferência ou ajuda, preservando duração',()=>{
  const action=next(fixture(),SAT,minute('10:00'),done(SAT,['dog-am']));
  assert.equal(action.status,'conflict');
  assert.equal(action.missionId,'dog-am');
  assert.equal(action.minutes,15);
  assert.match(action.reason,/ajuda|confir|essencia/i);
});

test('próxima ação: versão mínima cabe no restante do próprio bloco e dia difícil não corta essenciais',()=>{
  const s=fixture(),read=next(s,MON,minute('07:08'),done(MON,['read']));
  assert.equal(read.status,'available');assert.equal(read.mode,'minimum');assert.equal(read.minutes,5);
  assert.ok(read.endMinute<=minute('07:15'));
  s.difficult[MON]=true;
  const python=next(s,MON,minute('18:00'),done(MON,['python']));
  assert.equal(python.mode,'minimum');assert.equal(python.minutes,5);
  const dog=next(s,MON,minute('05:45'),done(MON,['dog-am']));
  assert.equal(dog.mode,'normal');assert.equal(dog.minutes,15);
});

test('próxima ação: sobra de dois minutos não é apresentada como versão mínima de cinco',()=>{
  const s=fixture();s.difficult[MON]=true;
  const action=next(s,MON,minute('18:58'),done(MON,['python']));
  assert.equal(action.status,'upcoming');
  assert.equal(action.missionId,'python');
  assert.equal(action.start,'19:10');
  assert.equal(action.mode,'minimum');
  assert.equal(action.minutes,5);
});

test('próxima ação: conflito de tarefa com trabalho requer ajuste e não oferece conclusão normal',()=>{
  const ms=resolved(MON);ms.find(m=>m.id==='read').time='10:00';
  const action=next(fixture(),MON,minute('10:00'),done(MON,['read']),ms);
  assert.equal(action.status,'conflict');
  assert.match(action.reason,/sobrep|conflit|horári/i);
});

test('próxima ação: horário de dormir e madrugada continuam reservados ao descanso',()=>{
  for(const now of [minute('04:00'),minute('22:30'),minute('23:45')]){
    const action=next(fixture(),MON,now);
    assert.equal(action.status,'rest');
    assert.equal(action.missionId,null);
  }
});
