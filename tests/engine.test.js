import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../engine.js';
import {roadmap} from '../roadmap.js';
import {workSchedule,offSchedule} from '../data.js';

const MON = '2026-11-09', TUE = '2026-11-10', WED = '2026-11-11';
const SAT = '2026-11-14', SUN = '2026-11-15';
const allDays = [0,1,2,3,4,5,6];
function mission(overrides = {}) {
  return {id:'read',title:'Ler um trecho',action:'Ler por 15 minutos',minimum:'Ler duas páginas',
    criterion:'Tempo ou páginas cumpridos',time:'07:05',days:[...allDays],skill:'reading',
    minutes:15,minMinutes:5,xp:15,minXp:5,coins:10,minCoins:2,...overrides};
}
function fixture() {
  const s = E.createState(MON);
  s.config.missions = [
    mission(),
    mission({id:'walk',title:'Passeio compartilhado',skill:'dog',secondary:'fitness',time:'07:20',minutes:30,xp:21,minXp:7,coins:10,minCoins:3}),
    mission({id:'python',title:'Fase Python',skill:'python',time:'18:00',minutes:120,xp:120,minXp:5,coins:25,minCoins:2}),
    mission({id:'house',title:'Organizar casa',skill:'home',time:'06:25',days:[1,3,5],coins:20}),
    mission({id:'dog',title:'Cuidado essencial',skill:'dog',time:'06:15',essential:true,xp:10,minXp:10,coins:4,minCoins:4,minutes:10,minMinutes:10})
  ];
  s.config.rewards = [
    {id:'video',title:'Vídeo extra',description:'Vídeo pessoal',price:8,minutes:20,limit:'day'},
    {id:'match',title:'Partida extra',description:'Partida pessoal',price:6,minutes:30,limit:'day'},
    {id:'movie',title:'Filme extra',description:'Sessão pessoal',price:20,minutes:120,limit:'week',weekend:true},
    {id:'weekly',title:'Extra semanal',description:'Pequeno extra',price:3,minutes:10,limit:'week'}
  ];
  return s;
}
const clone = x => structuredClone(x);
const valid = s => assert.equal(E.validateState(s), true);
const completeRead = (s,day=MON,mode='normal') => E.complete(s,'read',day,mode,roadmap);

// Exercitam a contabilidade por eventos, inclusive tentativas repetidas e correções.
test('a conclusão repetida é idempotente: um registro, um ganho', () => {
  const s=fixture();
  assert.equal(completeRead(s),true);
  const snapshot=clone(s);
  assert.equal(completeRead(s),false);
  assert.deepEqual(s,snapshot);
  assert.deepEqual(E.totals(s),{xp:15,coins:10});
  assert.equal(s.events.length,1);
  valid(s);
});

test('mínimo para normal concede somente a diferença; não permite rebaixar', () => {
  const s=fixture();
  assert.equal(completeRead(s,MON,'minimum'),true);
  assert.deepEqual(E.totals(s),{xp:5,coins:2});
  assert.equal(completeRead(s),true);
  assert.deepEqual(E.totals(s),{xp:15,coins:10});
  assert.equal(s.events[1].type,'upgrade');
  assert.deepEqual([s.events[1].xp,s.events[1].coins],[10,8]);
  assert.equal(completeRead(s,MON,'minimum'),false);
  valid(s);
});

test('duas habilidades repartem o XP sem duplicar, inclusive no upgrade ímpar', () => {
  const s=fixture();
  E.complete(s,'walk',MON,'minimum',roadmap);
  assert.deepEqual(E.skillTotals(s),{reading:0,fitness:3,home:0,dog:4,python:0});
  E.complete(s,'walk',MON,'normal',roadmap);
  const skills=E.skillTotals(s);
  assert.equal(skills.dog,11);
  assert.equal(skills.fitness,10);
  assert.equal(Object.values(skills).reduce((a,b)=>a+b,0),E.totals(s).xp);
  assert.deepEqual(E.totals(s),{xp:21,coins:10});
  valid(s);
});

test('comprar desconta moedas uma vez e preserva XP e habilidades', () => {
  const s=fixture();completeRead(s);
  const skills=E.skillTotals(s);
  assert.equal(E.buy(s,'video',MON,'21:30','pedido-1'),true);
  assert.deepEqual(E.totals(s),{xp:15,coins:2});
  assert.deepEqual(E.skillTotals(s),skills);
  const snapshot=clone(s);
  assert.equal(E.buy(s,'video',MON,'21:30','pedido-1'),false);
  assert.deepEqual(s,snapshot);
  assert.equal(s.events.filter(e=>e.type==='purchase').length,1);
  valid(s);
});

test('saldo insuficiente recusa compra sem alteração parcial', () => {
  const s=fixture(),snapshot=clone(s);
  assert.throws(()=>E.buy(s,'video',MON,'21:30','pedido-sem-saldo'),/moedas/i);
  assert.deepEqual(s,snapshot);
  valid(s);
});

test('limite diário impede nova compra da mesma recompensa e renova no próximo dia', () => {
  const s=fixture();completeRead(s);E.complete(s,'house',MON,'normal',roadmap);
  E.buy(s,'video',MON,'21:30','primeiro');
  assert.throws(()=>E.buy(s,'video',MON,'21:30','segundo'),/limite/i);
  assert.equal(E.buy(s,'video',TUE,'21:30','terceiro'),true);
  assert.equal(s.purchases.length,2);
  valid(s);
});

test('limite semanal usa segunda-feira como começo e preserva resgates usados', () => {
  const s=fixture();E.complete(s,'house',MON,'normal',roadmap);
  E.buy(s,'weekly',SAT,'14:00','sabado');
  E.usePurchase(s,s.purchases[0].id);
  assert.throws(()=>E.buy(s,'weekly',SUN,'14:00','domingo'),/limite/i);
  const nextMonday=E.addDays(MON,7);
  assert.equal(E.buy(s,'weekly',nextMonday,'21:30','semana-seguinte'),true);
  valid(s);
});

test('filme só pode ser reservado no fim de semana e cabe inteiro entre 14h e 16h', () => {
  const s=fixture();E.complete(s,'house',MON,'normal',roadmap);
  assert.throws(()=>E.buy(s,'movie',MON,'14:00','filme-segunda'),/sábado|domingo/i);
  assert.equal(E.buy(s,'movie',SAT,'14:00','filme-sabado'),true);
  assert.equal(s.purchases[0].end,'16:00');
  valid(s);
});

test('a janela útil termina às 21:50 e a recompensa precisa caber inteira', () => {
  const s=fixture(),video=s.config.rewards.find(r=>r.id==='video');
  assert.deepEqual(E.windows(MON),[['21:30','21:50']]);
  assert.equal(E.reservation(s,video,MON,'21:30'),'21:50');
  assert.throws(()=>E.reservation(s,video,MON,'21:31'),/caber|janela/i);
  assert.throws(()=>E.reservation(s,video,MON,'22:15'),/caber|janela/i);
  assert.throws(()=>E.reservation(s,s.config.rewards[1],MON,'21:30'),/caber|janela/i);
});

test('reserva recusa início passado e aceita início no minuto atual', () => {
  const s=fixture(),video=s.config.rewards[0];
  assert.throws(()=>E.reservation(s,video,MON,'21:30',E.minutes('21:31')),/passou/i);
  assert.equal(E.reservation(s,video,MON,'21:30',E.minutes('21:30')),'21:50');
});

test('reservas não se sobrepõem e intervalos adjacentes são aceitos', () => {
  const s=fixture();E.complete(s,'house',MON,'normal',roadmap);
  E.buy(s,'weekly',SAT,'14:00','reserva-a');
  assert.throws(()=>E.buy(s,'video',SAT,'14:05','reserva-b'),/reservada/i);
  assert.equal(E.buy(s,'video',SAT,'14:10','reserva-c'),true);
  assert.deepEqual(s.purchases.map(p=>[p.start,p.end]),[['14:00','14:10'],['14:10','14:30']]);
  valid(s);
});

test('missões reagendadas impedem recompensa sobreposta', () => {
  const s=fixture();
  E.reschedule(s,'house',MON,SAT,'14:15');
  assert.throws(()=>E.reservation(s,s.config.rewards[0],SAT,'14:00'),/missão/i);
  assert.equal(E.reservation(s,s.config.rewards[0],SAT,'14:30'),'14:50');
});

test('cancelar reserva devolve uma vez, libera horário e mantém trilha de auditoria', () => {
  const s=fixture();completeRead(s);
  E.buy(s,'video',MON,'21:30','reserva-cancelavel');
  const id=s.purchases[0].id;
  assert.equal(E.cancel(s,id,MON),true);
  assert.equal(E.cancel(s,id,MON),false);
  assert.deepEqual(E.totals(s),{xp:15,coins:10});
  assert.equal(s.events.filter(e=>e.type==='refund').length,1);
  assert.equal(E.buy(s,'video',MON,'21:30','nova-reserva'),true);
  assert.equal(s.purchases[0].status,'cancelled');
  valid(s);
});

test('uma recompensa utilizada não permite cancelamento ou reembolso', () => {
  const s=fixture();completeRead(s);E.buy(s,'video',MON,'21:30','uso');
  const id=s.purchases[0].id;
  assert.equal(E.usePurchase(s,id),true);
  assert.equal(E.usePurchase(s,id),false);
  const snapshot=clone(s);
  assert.throws(()=>E.cancel(s,id,MON),/utilizada/i);
  assert.deepEqual(s,snapshot);
  valid(s);
});

test('desfazer preserva saldo não negativo e funciona após cancelar compra não usada', () => {
  const s=fixture();completeRead(s);E.buy(s,'video',MON,'21:30','gasto');
  const snapshot=clone(s);
  assert.throws(()=>E.undo(s,MON+':read',MON),/saldo negativo/i);
  assert.deepEqual(s,snapshot);
  E.cancel(s,s.purchases[0].id,MON);
  assert.equal(E.undo(s,MON+':read',MON),true);
  assert.equal(E.undo(s,MON+':read',MON),false);
  assert.deepEqual(E.totals(s),{xp:0,coins:0});
  assert.deepEqual(E.skillTotals(s),{reading:0,fitness:0,home:0,dog:0,python:0});
  assert.equal(s.events.at(-1).type,'undo');
  valid(s);
});

test('desfazer um upgrade remove somente o ganho total efetivo e mantém os eventos', () => {
  const s=fixture();completeRead(s,MON,'minimum');completeRead(s);
  E.undo(s,MON+':read',TUE);
  assert.deepEqual(E.totals(s),{xp:0,coins:0});
  assert.equal(s.events.length,3);
  assert.equal(s.events.at(-1).originalDay,MON);
  assert.equal(s.events.at(-1).xp,-15);
  valid(s);
});

test('Python mínimo não avança fase; normal avança uma e repetição não duplica', () => {
  const s=fixture();
  E.complete(s,'python',MON,'minimum',roadmap);
  assert.equal(s.lessons.length,0);
  E.complete(s,'python',MON,'normal',roadmap);
  assert.equal(s.lessons.length,1);
  assert.equal(s.lessons[0].id,1);
  assert.equal(E.complete(s,'python',MON,'normal',roadmap),false);
  assert.deepEqual(E.totals(s),{xp:120,coins:25});
  valid(s);
});

test('a próxima fase abre no próximo dia e corrigir a anterior exige desfazer a dependente', () => {
  const s=fixture();
  E.complete(s,'python',MON,'normal',roadmap);
  E.complete(s,'python',TUE,'normal',roadmap);
  assert.deepEqual(s.lessons.map(l=>l.id),[1,2]);
  const snapshot=clone(s);
  assert.throws(()=>E.undo(s,MON+':python',TUE),/fase mais recente/i);
  assert.deepEqual(s,snapshot);
  E.undo(s,TUE+':python',TUE);
  E.undo(s,MON+':python',TUE);
  assert.equal(s.lessons.length,0);
  assert.deepEqual(E.totals(s),{xp:0,coins:0});
  valid(s);
});

test('Python não permite registrar uma fase retroativa anterior às já registradas', () => {
  const s=fixture();E.complete(s,'python',TUE,'normal',roadmap);
  assert.throws(()=>E.complete(s,'python',MON,'normal',roadmap),/posteriores/i);
  assert.equal(s.lessons.length,1);
  valid(s);
});

test('a mudança de dia cria nova ocorrência e preserva o histórico anterior', () => {
  const s=fixture();completeRead(s);completeRead(s,TUE);
  assert.ok(s.records[MON+':read']);
  assert.ok(s.records[TUE+':read']);
  assert.deepEqual(E.totals(s),{xp:30,coins:20});
  assert.equal(s.events[0].day,MON);
  valid(s);
});

test('o dia de São Paulo muda às 03:00 UTC, não à meia-noite UTC', () => {
  assert.equal(E.TIMEZONE,'America/Sao_Paulo');
  assert.equal(E.dayKey(new Date('2026-11-10T02:59:59.999Z')),MON);
  assert.equal(E.dayKey(new Date('2026-11-10T03:00:00.000Z')),TUE);
  assert.equal(E.timeNow(new Date('2026-11-10T02:59:00Z')),'23:59');
  assert.equal(E.timeNow(new Date('2026-11-10T03:00:00Z')),'00:00');
  assert.equal(E.weekKey(SUN),MON);
  assert.equal(E.weekKey(E.addDays(SUN,1)),E.addDays(MON,7));
});

test('frequência semanal filtra missões e rege a conclusão', () => {
  const s=fixture();
  assert.ok(E.missionsFor(s,MON).some(m=>m.id==='house'));
  assert.ok(!E.missionsFor(s,TUE).some(m=>m.id==='house'));
  assert.throws(()=>E.complete(s,'house',TUE,'normal',roadmap),/indisponível/i);
  assert.ok(E.missionsFor(s,WED).some(m=>m.id==='house'));
  assert.deepEqual(E.totals(s),{xp:0,coins:0});
});

test('reagendar remove a ocorrência de origem e inclui destino sem mudar recompensas', () => {
  const s=fixture();
  E.reschedule(s,'house',MON,TUE,'09:10');
  assert.ok(!E.missionsFor(s,MON).some(m=>m.id==='house'));
  assert.equal(E.missionsFor(s,TUE).find(m=>m.id==='house').time,'09:10');
  assert.deepEqual(E.totals(s),{xp:0,coins:0});
  E.complete(s,'house',TUE,'normal',roadmap);
  assert.equal(s.records[TUE+':house'].xp,15);
  valid(s);
});

test('reagendar no mesmo dia ajusta horário sem esconder a missão', () => {
  const s=fixture();E.reschedule(s,'house',MON,MON,'09:10');
  assert.equal(E.missionsFor(s,MON).filter(m=>m.id==='house').length,1);
  assert.equal(E.missionsFor(s,MON).find(m=>m.id==='house').time,'09:10');
  valid(s);
});

test('cuidados essenciais não podem ser adiados; missões concluídas exigem correção antes', () => {
  const s=fixture();
  assert.throws(()=>E.reschedule(s,'dog',MON,TUE,'06:15'),/essenciais/i);
  E.complete(s,'house',MON,'normal',roadmap);
  assert.throws(()=>E.reschedule(s,'house',MON,TUE,'09:10'),/desfaça/i);
  assert.throws(()=>E.reschedule(s,'read',TUE,MON,'09:10'),/posterior/i);
  valid(s);
});

test('backup JSON restaura registros, ganhos, compras e correções com totais iguais', () => {
  const s=fixture();completeRead(s);E.complete(s,'python',MON,'normal',roadmap);
  E.buy(s,'video',MON,'21:30','backup-compra');E.cancel(s,s.purchases[0].id,TUE);
  E.reschedule(s,'house',MON,TUE,'09:10');
  s.difficult[TUE]=true;
  const backup=JSON.stringify(s),restored=JSON.parse(backup);
  valid(restored);
  assert.deepEqual(restored,s);
  assert.deepEqual(E.totals(restored),E.totals(s));
  assert.deepEqual(E.skillTotals(restored),E.skillTotals(s));
  assert.equal(E.complete(restored,'read',MON,'normal',roadmap),false);
});

test('backups inválidos ou adulterados são recusados sem mutar o objeto validado', () => {
  const base=fixture();completeRead(base);E.buy(base,'video',MON,'21:30','backup');
  const mutations = [
    s=>s.version=99,
    s=>s.events.push(clone(s.events[0])),
    s=>s.records[MON+':read'].xp++,
    s=>s.events[0].coins=-100,
    s=>s.events[0].skills.reading++,
    s=>s.config.rewards[0].minutes=0,
    s=>s.config.missions[0].time='25:99',
    s=>s.purchases[0].price++,
    s=>s.purchases[0].status='cancelled',
    s=>s.created='não-é-data'
  ];
  for (const mutate of mutations) {
    const invalid=clone(base);mutate(invalid);const before=clone(invalid);
    assert.throws(()=>E.validateState(invalid),/backup inválido/i);
    assert.deepEqual(invalid,before);
  }
  valid(base);
});

test('backup recusa uma data impossível em vez de normalizar para outro mês', () => {
  const s=fixture();s.created='2026-02-31';
  assert.throws(()=>E.validateState(s),/backup inválido/i);
});

test('pausa preserva progresso, bloqueia conclusão e não cobra os dias sem uso', () => {
  const s=fixture();completeRead(s);s.config.paused=true;
  const snapshot=clone(s);
  assert.throws(()=>completeRead(s,TUE),/pausa/i);
  assert.deepEqual(s,snapshot);
  s.config.paused=false;
  const returnDay=E.addDays(MON,14);
  assert.equal(completeRead(s,returnDay),true);
  assert.deepEqual(E.totals(s),{xp:30,coins:20});
  assert.equal(Object.keys(s.records).length,2);
  valid(s);
});

test('níveis contam XP acumulado e cruzam o limite exato de forma previsível', () => {
  assert.deepEqual(E.levelInfo(0),{level:1,current:0,next:100});
  assert.deepEqual(E.levelInfo(99),{level:1,current:99,next:100});
  assert.deepEqual(E.levelInfo(100),{level:2,current:0,next:100});
  assert.deepEqual(E.levelInfo(250),{level:3,current:50,next:100});
  assert.deepEqual(E.levelInfo(250,50),{level:6,current:0,next:50});
});


test('defaults reservam duas horas de Python todos os dias fora de trabalho e trajeto', () => {
  const s=E.createState(MON);
  const python=s.config.missions.find(m=>m.id==='python');
  assert.deepEqual([...python.days].sort(),allDays);
  assert.equal(python.minutes,120);
  assert.equal(python.time,'18:00');
  for (let i=0;i<7;i++) {
    const day=E.addDays(MON,i),mission=E.missionsFor(s,day).find(m=>m.id==='python');
    assert.equal(E.timeString(E.minutes(mission.time)+mission.minutes),'20:00');
  }
  valid(s);
});

test('agendas de trabalho e folga não têm sobreposição e terminam às 22:30', () => {
  for (const [name,schedule] of [['trabalho',workSchedule],['folga',offSchedule]]) {
    let previousEnd=E.minutes('05:30');
    assert.equal(schedule[0][0].split('–')[0],'05:30',name);
    for (const [range,label] of schedule) {
      const [start,end]=range.split('–').map(E.minutes);
      assert.ok(Number.isFinite(start)&&Number.isFinite(end),`${name}: horário inválido em ${label}`);
      assert.ok(start>=previousEnd,`${name}: ${label} sobrepõe o bloco anterior`);
      assert.ok(end>start,`${name}: ${label} tem duração inválida`);
      assert.ok(end<=E.minutes('22:30'),`${name}: ${label} passa do sono`);
      previousEnd=end;
    }
    assert.equal(previousEnd,E.minutes('22:30'),name);
  }
});

test('missões padrão de cada dia não se sobrepõem', () => {
  const s=E.createState(MON);
  for (let i=0;i<7;i++) {
    const day=E.addDays(MON,i),missions=E.missionsFor(s,day);
    for (let j=1;j<missions.length;j++) {
      const previous=missions[j-1],current=missions[j];
      assert.ok(E.minutes(current.time)>=E.minutes(previous.time)+previous.minutes,
        `${day}: ${current.id} ${current.time} sobrepõe ${previous.id} ${previous.time} + ${previous.minutes}min`);
    }
    assert.ok(missions.every(m=>E.minutes(m.time)+m.minutes<=E.minutes('22:30')));
  }
});

test('backup recusa fase sem registro normal correspondente e IDs fora da sequência', () => {
  const s=fixture();E.complete(s,'python',MON,'normal',roadmap);
  const missingRecord=clone(s);missingRecord.lessons[0].day=TUE;
  assert.throws(()=>E.validateState(missingRecord),/backup inválido/i);
  const wrongSequence=clone(s);wrongSequence.lessons[0].id=2;
  assert.throws(()=>E.validateState(wrongSequence),/backup inválido/i);
  valid(s);
});

test('repetir ID de compra cancelada não executa nova cobrança', () => {
  const s=fixture();completeRead(s);E.buy(s,'video',MON,'21:30','mesmo-pedido');
  E.cancel(s,s.purchases[0].id,MON);
  const snapshot=clone(s);
  assert.equal(E.buy(s,'video',MON,'21:30','mesmo-pedido'),false);
  assert.deepEqual(s,snapshot);
  valid(s);
});
